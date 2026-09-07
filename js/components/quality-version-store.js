/** 数据质量配置版本：完整快照、版本引用和本地持久化。 */
window.DP = window.DP || {};
DP.qualityVersions = (function () {
  'use strict';
  var adapters = {};
  var cache = {};
  var prefix = 'dp-quality-versions-v1-';
  function clone(value) { return JSON.parse(JSON.stringify(value)); }
  function now() {
    var d = new Date();
    function pad(n) { return String(n).padStart(2, '0'); }
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
  }
  function canonical(value) {
    if (Array.isArray(value)) return value.map(canonical);
    if (value && typeof value === 'object') {
      var out = {};
      Object.keys(value).sort().forEach(function (key) { out[key] = canonical(value[key]); });
      return out;
    }
    return value;
  }
  function same(a, b) { return JSON.stringify(canonical(a)) === JSON.stringify(canonical(b)); }
  function versionRecord(item, version) { return item.versions.find(function (record) { return record.version === version; }); }
  function eventFor(type, item, record, from, before, operator, time, summary) {
    return { type: type, from: from || '', to: record.version, saveId: record.saveId, reason: summary, operator: operator, time: time, before: before ? clone(before) : null, snapshot: clone(record.snapshot) };
  }
  function identifyReference(ref) {
    if (!ref || !ref.snapshot || (ref.saveId && ref.savedAt)) return ref;
    var source;
    try { source = read('rules').find(function (item) { return item.id === ref.id; }); } catch (error) { return ref; }
    if (!source) return ref;
    var record = (source.versions || []).find(function (v) { return v.version === ref.version && same(v.snapshot, ref.snapshot); });
    var event = (source.events || []).find(function (e) { return e.type !== 'rollback' && e.to === ref.version && e.snapshot && same(e.snapshot, ref.snapshot); });
    if (record || event) { ref.saveId = (record || event).saveId; ref.savedAt = (record || event).time; }
    return ref;
  }
  function identifyReferences(value) {
    if (!value || typeof value !== 'object') return;
    if (value.ruleRef) identifyReference(value.ruleRef);
    Object.keys(value).forEach(function (key) { if (key !== 'ruleRef') identifyReferences(value[key]); });
  }
  function upgrade(kind, rows) {
    var changed = false;
    rows.forEach(function (item) {
      if (item.versionSchema === 2) return;
      changed = true;
      item.events = item.events || [];
      item.events.forEach(function (event) { if (!event.type) event.type = 'rollback'; });
      item.versions.forEach(function (record, index) {
        record.createdAt = record.createdAt || record.time;
        record.createdBy = record.createdBy || record.operator;
        record.saveId = record.saveId || item.id + ':legacy:' + record.version;
        if (!item.events.some(function (e) { return e.type !== 'rollback' && e.to === record.version; })) {
          item.events.push(eventFor(index ? 'new' : 'create', item, record, index ? item.versions[index - 1].version : '', null, record.operator, record.time, record.summary));
        }
      });
      item.events.sort(function (a, b) { return a.time.localeCompare(b.time); });
      if (kind === 'tasks') identifyReferences(item);
      item.versionSchema = 2;
    });
    return changed;
  }
  function read(kind) {
    var raw = window.localStorage.getItem(prefix + kind);
    if (!raw) return cache[kind] || [];
    var data = JSON.parse(raw);
    if (!Array.isArray(data)) throw new Error('版本数据格式异常，请检查本地存储');
    return data;
  }
  function write(kind, rows) {
    // 写入成功后才更新内存，避免存储失败时显示保存成功。
    window.localStorage.setItem(prefix + kind, JSON.stringify(rows));
    cache[kind] = rows;
  }
  function makeRecord(kind, seed, config, summary) {
    var item = clone(seed);
    item.currentVersion = 'V1.0';
    item.revision = 0;
    item.versionSchema = 2;
    item.config = clone(config);
    var time = item.modifiedAt || item.createdAt || now();
    var operator = item.creator || 'present';
    item.versions = [{ version: 'V1.0', saveId: item.id + ':save:0', createdAt: time, createdBy: operator, summary: String(summary || '').trim() || '首次保存', operator: operator, time: time, snapshot: clone(config) }];
    item.events = [eventFor('create', item, item.versions[0], '', null, operator, time, item.versions[0].summary)];
    adapters[kind].apply(item, clone(config));
    return item;
  }
  function register(kind, seeds, adapter) {
    adapters[kind] = adapter;
    try {
      var raw = window.localStorage.getItem(prefix + kind);
      if (raw) {
        cache[kind] = read(kind);
        if (upgrade(kind, cache[kind])) write(kind, cache[kind]);
      }
      else {
        var rows = seeds.map(function (seed) { return makeRecord(kind, seed, adapter.snapshot(seed)); });
        cache[kind] = rows;
        write(kind, rows);
      }
    } catch (error) {
      if (!cache[kind]) cache[kind] = seeds.map(function (seed) { return makeRecord(kind, seed, adapter.snapshot(seed)); });
      // 保留可浏览的初始配置；保存/回滚会明确报告失败。
    }
    return rowsFor(kind);
  }
  function rowsFor(kind) {
    try { cache[kind] = read(kind); upgrade(kind, cache[kind]); } catch (error) { /* 已加载的配置仍可查看 */ }
    return clone((cache[kind] || []).filter(function (item) { return !item.deleted; }));
  }
  function get(kind, id) { return rowsFor(kind).filter(function (item) { return item.id === id; })[0] || null; }
  function latestVersion(item) {
    return (item.versions || []).reduce(function (latest, record) {
      var left = record.version.slice(1).split('.').map(Number);
      var right = latest.slice(1).split('.').map(Number);
      for (var i = 0; i < Math.max(left.length, right.length); i++) {
        var difference = (left[i] || 0) - (right[i] || 0);
        if (difference) return difference > 0 ? record.version : latest;
      }
      return latest;
    }, item.currentVersion || 'V1.0');
  }
  function nextVersion(item) {
    var parts = latestVersion(item).slice(1).split('.').map(Number);
    parts[parts.length - 1] += 1;
    return 'V' + parts.join('.');
  }
  function transaction(kind, id, callback) {
    try {
      var rows = clone(read(kind));
      upgrade(kind, rows);
      var index = rows.findIndex(function (row) { return row.id === id; });
      var item = index < 0 ? null : rows[index];
      var result = callback(item);
      if (result.error || result.unchanged) return result;
      if (index < 0) rows.unshift(result.item); else rows[index] = result.item;
      write(kind, rows);
      return { item: clone(result.item) };
    } catch (error) { return { error: '本地版本数据未保存：' + error.message }; }
  }
  function save(kind, id, config, options) {
    options = options || {};
    return transaction(kind, id, function (item) {
      if (!item) {
        if (!options.seed) return { error: '该配置已不存在，请返回列表刷新' };
        var created = makeRecord(kind, options.seed, config, options.summary);
        return { item: created };
      }
      if (item.deleted || item.revision !== options.revision) return { error: '配置已变化，请返回列表后重新编辑' };
      var mode = options.mode || 'current';
      if (mode !== 'current' && mode !== 'new') return { error: '请选择保存当前版本或保存为新版本' };
      if (mode === 'current' && same(item.config, config)) return { unchanged: true, item: clone(item) };
      if (!String(options.summary || '').trim()) return { error: '请填写变更说明' };
      var from = item.currentVersion;
      var before = clone(item.config);
      var version = mode === 'new' ? nextVersion(item) : item.currentVersion;
      var time = now();
      var record = mode === 'new' ? { version: version, createdAt: time, createdBy: 'present' } : versionRecord(item, version);
      if (!record) return { error: '未找到当前版本，请返回列表后重新编辑' };
      record.saveId = item.id + ':save:' + (item.revision + 1);
      record.summary = options.summary.trim();
      record.operator = 'present';
      record.time = time;
      record.snapshot = clone(config);
      if (mode === 'new') item.versions.push(record);
      item.events.push(eventFor(mode === 'new' ? 'new' : 'update', item, record, from, before, 'present', time, record.summary));
      item.currentVersion = version;
      item.revision += 1;
      item.modifiedAt = time;
      item.config = clone(config);
      adapters[kind].apply(item, clone(config));
      return { item: item };
    });
  }
  function rollback(kind, id, version, reason, revision) {
    return transaction(kind, id, function (item) {
      if (!item || item.deleted || item.revision !== revision) return { error: '配置已变化，请刷新版本记录后重试' };
      if (kind === 'tasks' && item.status === '执行中') return { error: '任务正在执行，暂不能回滚配置' };
      if (!String(reason || '').trim()) return { error: '请填写回滚原因' };
      var record = item.versions.filter(function (v) { return v.version === version; })[0];
      if (!record || version === item.currentVersion) return { error: '请选择可回滚的历史版本' };
      item.events.push(eventFor('rollback', item, record, item.currentVersion, item.config, 'present', now(), reason.trim()));
      item.currentVersion = version;
      item.revision += 1;
      item.modifiedAt = now();
      item.config = clone(record.snapshot);
      adapters[kind].apply(item, clone(record.snapshot));
      return { item: item };
    });
  }
  function operate(kind, ids, operation) {
    try {
      var rows = clone(read(kind));
      upgrade(kind, rows);
      ids.forEach(function (id) {
        var item = rows.find(function (row) { return row.id === id && !row.deleted; });
        if (!item) return;
        if (operation === 'delete') item.deleted = true;
        else item.status = operation === 'start' ? '运行中' : '已停止';
        item.revision += 1;
      });
      write(kind, rows);
      return {};
    } catch (error) { return { error: '本地数据未保存：' + error.message }; }
  }
  function reference(id) {
    var item = get('rules', id);
    if (!item) return null;
    var record = versionRecord(item, item.currentVersion);
    return { id: item.id, version: item.currentVersion, saveId: record.saveId, savedAt: record.time, snapshot: clone(item.config) };
  }
  function mergeSamples(kind, examples) {
    try {
      var rows = clone(read(kind));
      var added = clone(examples.filter(function (example) { return !rows.some(function (row) { return row.id === example.id; }); }));
      added.forEach(function (item) { adapters[kind].apply(item, clone(item.config)); });
      if (added.length) write(kind, added.concat(rows));
      return { added: added.length };
    } catch (error) { return { error: '版本示例未保存：' + error.message }; }
  }
  return { clone: clone, same: same, now: now, register: register, rows: rowsFor, get: get, save: save, rollback: rollback, operate: operate, reference: reference, latestVersion: latestVersion, nextVersion: nextVersion, identifyReference: identifyReference, mergeSamples: mergeSamples };
})();
