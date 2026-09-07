/** 质量规则与任务配置共用的版本记录、只读详情和回滚确认。 */
window.DP = window.DP || {};
DP.qualityVersionPanel = (function () {
  'use strict';
  var V = DP.qualityVersions;
  function esc(value) { return String(value == null ? '' : value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;'); }
  function button(action, icon, label, extra) { return '<button type="button" class="btn btn-outline btn-sm" data-qv-action="' + action + '" ' + (extra || '') + '><i class="bi bi-' + icon + '"></i><span>' + label + '</span></button>'; }
  function fields(title, values) {
    return '<section class="qv-section"><h3>' + esc(title) + '</h3><dl class="qv-fields">' + values.map(function (pair) {
      return '<div><dt>' + esc(pair[0]) + '</dt><dd>' + esc(pair[1] == null || pair[1] === '' ? '—' : pair[1]) + '</dd></div>';
    }).join('') + '</dl></section>';
  }
  function table(title, headers, rows) {
    return '<section class="qv-section"><h3>' + esc(title) + '</h3><div class="qv-table-scroll"><table class="ds-table qv-detail-table"><thead><tr>' + headers.map(function (h) { return '<th>' + esc(h) + '</th>'; }).join('') + '</tr></thead><tbody>' + (rows.length ? rows.map(function (row) { return '<tr>' + row.map(function (cell) { return '<td>' + esc(cell == null || cell === '' ? '—' : cell) + '</td>'; }).join('') + '</tr>'; }).join('') : '<tr><td colspan="' + headers.length + '" class="qv-empty">暂无配置</td></tr>') + '</tbody></table></div></section>';
  }
  function sql(title, code) { return '<section class="qv-section"><h3>' + esc(title) + '</h3><pre class="qv-sql">' + esc(code || '—') + '</pre></section>'; }
  function params(config) {
    return table('参数配置', ['参数名', '属性', '说明', '表', '字段', '参数值'], (config.params || []).map(function (p) { return [p.name, p.attr, p.desc, p.table, p.field, p.value]; }));
  }
  function ruleContent(s) {
    return fields('规则信息', [['规则名称', s.name], ['数据库类型', s.dbType], ['评价标准', s.standard], ['业务分层', s.groupPath || s.group], ['规则类型', s.ruleType], ['Catalog', s.catalog], ['Schema', s.schema], ['描述', s.desc]]) + sql('规则 SQL', s.sql) + params(s);
  }
  function reference(ref) {
    if (!ref) return '';
    return '<details class="qv-reference"><summary>' + esc(ref.snapshot.name) + ' · ' + esc(ref.version) + '（点击查看引用内容）</summary>' + fields('引用信息', [['引用版本', ref.version], ['引用保存时间', ref.savedAt || '未记录']]) + ruleContent(ref.snapshot) + '</details>';
  }
  function saveOptions(prefix, current, next, mode) {
    return '<div class="qv-save-options" role="radiogroup" aria-label="保存方式">' + [['current', '保存当前版本', current], ['new', '保存为新版本', next]].map(function (option) {
      return '<label class="qv-save-option"><input type="radio" name="' + prefix + '-save-mode" data-' + prefix + '-save-mode value="' + option[0] + '"' + ((mode || 'current') === option[0] ? ' checked' : '') + '><span>' + option[1] + '（' + esc(option[2]) + '）</span></label>';
    }).join('') + '</div>';
  }
  function saveHint(current, latest, next, mode) {
    if (mode !== 'new') return '保存后更新当前版本 ' + current + '，版本号不变，并保留操作记录。';
    return (current !== latest ? '当前使用 ' + current + '，已有最大版本为 ' + latest + '；' : '已有最大版本为 ' + latest + '；') + '保存后生成新版本 ' + next + ' 并设为当前版本，已有版本保留。';
  }
  function taskContent(s) {
    var c = s.form;
    var html = fields('任务信息', [['任务名称', c.taskName], ['任务类型', s.type], ['业务分层', c.businessLayer], ['考核权重', c.weight], ['数据源', c.dataSource || c.datasource], ['稽查对象', c.inspectObject], ['稽查机制', c.inspectMode]]);
    if (s.kind === 'custom') {
      html += fields('规则配置', [['规则选择', c.ruleMode === 'custom' ? '自定义规则' : '选择已有规则'], ['评价标准', c.ruleMode === 'custom' ? c.customStandard : c.ruleRef && c.ruleRef.snapshot.standard], ['描述', c.ruleMode === 'custom' ? c.customDescription : c.ruleRef && c.ruleRef.snapshot.desc]]);
      if (c.ruleMode !== 'custom') html += reference(c.ruleRef) + params(c) + sql('SQL 模板', c.sqlTemplate) + sql('生成 SQL', c.sqlGenerated);
      else html += sql('自定义 SQL', c.sqlCustom);
    } else if (s.kind === 'basic') {
      html += table('稽查实体', ['实体名称', '对象别名', '质量规则', '引用版本', '引用保存时间'], (c.entities || []).map(function (e) { return [e.name, e.alias, e.ruleRef && e.ruleRef.snapshot.name, e.ruleRef && e.ruleRef.version, e.ruleRef && e.ruleRef.savedAt || '未记录']; }));
      (c.entities || []).forEach(function (e) {
        html += '<details class="qv-reference"><summary>' + esc(e.name) + ' · 规则及参数</summary>' + reference(e.ruleRef);
        if (e.paramConfig) html += params(e.paramConfig) + (e.paramConfig.ruleMode === 'custom' ? sql('自定义 SQL', e.paramConfig.sqlCustom) : sql('SQL 模板', e.paramConfig.sqlTemplate) + sql('生成 SQL', e.paramConfig.sqlGenerated));
        html += '</details>';
      });
      html += fields('稽查参数', [['参数模式', c.paramMode]]);
      if (c.paramMode === '自定义SQL') html += sql('自定义 SQL', c.customSql);
      else if (c.timeParams) html += fields('增量时间参数', Object.keys(c.timeParams).map(function (key) {
        var labels = { startField: '开始时间字段', endField: '结束时间字段', startDataType: '开始字段类型', endDataType: '结束字段类型', startFormat: '开始日期格式', endFormat: '结束日期格式', startOffset: '开始偏移量', endOffset: '结束偏移量', startUnit: '开始偏移单位', endUnit: '结束偏移单位', startFixedTime: '固定开始时间', endFixedTime: '固定结束时间' };
        return [labels[key] || key, c.timeParams[key]];
      }));
    } else {
      html += fields('标准配置', [['标准数据', c.standardData], ['质量规则', c.qualityRule]]) + reference(c.ruleRef);
      html += table('关联实体', ['实体名称', '别名', '描述'], (c.entities || []).map(function (e) { return [e.name, e.alias, e.desc]; }));
    }
    var schedule = c.schedule || {};
    var types = { hourly: '每小时', daily: '每天', weekly: '每周', monthly: '每月', once: '执行一次' };
    var scheduleFields = [['周期', types[schedule.type] || schedule.type]];
    if (schedule.type === 'hourly') scheduleFields.push(['分钟', schedule.minute]);
    else if (schedule.type === 'once') scheduleFields.push(['执行时间', schedule.datetime]);
    else {
      if (schedule.type === 'weekly') scheduleFields.push(['星期', schedule.week]);
      if (schedule.type === 'monthly') scheduleFields.push(['日期', schedule.day]);
      scheduleFields.push(['执行时间', schedule.time]);
    }
    return html + fields('调度配置', scheduleFields);
  }
  function open(options) {
    var host = options.host;
    if (host.querySelector('.qv-panel')) return;
    var item = V.get(options.kind, options.id);
    if (!item) return options.toast('该配置已不存在');
    var origin = document.activeElement;
    var root = document.createElement('section');
    root.className = 'qv-panel';
    root.setAttribute('aria-label', '版本管理');
    host.classList.add('qv-host');
    var background = Array.from(host.children).map(function (node) { var previous = node.inert; node.inert = true; return { node: node, previous: previous }; });
    host.appendChild(root);
    var state = { detail: '', status: '', keyword: '', pending: null, error: '', page: 1 };
    function render() {
      var current = V.get(options.kind, options.id);
      if (current) item = current;
      var record = item.versions.find(function (v) { return v.version === state.detail; });
      var title = record ? '版本详情 · ' + esc(record.version) : '版本管理';
      var body;
      if (record) {
        body = fields('版本信息', [['版本状态', record.version === item.currentVersion ? '当前版本' : '历史版本'], ['变更说明', record.summary], ['创建人', record.createdBy || record.operator], ['创建时间', record.createdAt || record.time], ['最近保存人', record.operator], ['最近保存时间', record.time]]) + (options.kind === 'rules' ? ruleContent(record.snapshot) : taskContent(record.snapshot));
        var events = item.events.filter(function (event) { return event.from === record.version || event.to === record.version; }).slice().reverse();
        var eventTypes = { create: '首次创建', update: '保存当前版本', new: '生成新版本', rollback: '回滚版本' };
        body += table('操作记录', ['操作类型', '原版本', '目标版本', '说明', '操作人', '操作时间'], events.map(function (e) { return [eventTypes[e.type] || '回滚版本', e.from, e.to, e.reason, e.operator, e.time]; }));
      } else {
        var filtered = item.versions.slice().reverse().sort(function (a, b) {
          return Number(b.version === item.currentVersion) - Number(a.version === item.currentVersion);
        }).filter(function (v) {
          var status = v.version === item.currentVersion ? 'current' : 'history';
          return (!state.status || state.status === status) && (!state.keyword || [v.version, v.summary, v.operator].join(' ').toLowerCase().indexOf(state.keyword.toLowerCase()) >= 0);
        });
        var pages = Math.max(1, Math.ceil(filtered.length / 10));
        state.page = Math.min(pages, state.page);
        body = '<div class="qv-toolbar"><label>版本状态<select data-qv-filter><option value="">全部</option><option value="current"' + (state.status === 'current' ? ' selected' : '') + '>当前版本</option><option value="history"' + (state.status === 'history' ? ' selected' : '') + '>历史版本</option></select></label><div class="qv-query"><input data-qv-keyword value="' + esc(state.keyword) + '" placeholder="版本号 / 说明 / 操作人" aria-label="版本关键词">' + button('query', 'search', '查询') + '</div></div>';
        body += '<div class="qv-table-scroll"><table class="ds-table qv-history-table"><thead><tr><th>版本号</th><th>版本状态</th><th>变更说明</th><th>操作人</th><th>最近保存时间</th><th>操作</th></tr></thead><tbody>' + (filtered.length ? filtered.slice((state.page - 1) * 10, state.page * 10).map(function (v) {
          var isCurrent = v.version === item.currentVersion;
          return '<tr><td>' + esc(v.version) + '</td><td><span class="qv-badge' + (isCurrent ? ' current' : '') + '">' + (isCurrent ? '当前版本' : '历史版本') + '</span></td><td class="qv-summary-cell">' + esc(v.summary) + '</td><td>' + esc(v.operator) + '</td><td>' + esc(v.time) + '</td><td><div class="qv-actions">' + button('detail', 'file-earmark-text', '查看', 'data-version="' + v.version + '"') + (isCurrent ? '' : button('rollback', 'arrow-counterclockwise', '回滚', 'data-version="' + v.version + '"' + (item.status === '执行中' ? ' disabled title="任务执行中，暂不能回滚"' : ''))) + '</div></td></tr>';
        }).join('') : '<tr><td colspan="6" class="qv-empty">暂无匹配版本</td></tr>') + '</tbody></table></div><div class="qv-footer"><span>共 ' + filtered.length + ' 个版本 · 第 ' + state.page + ' / ' + pages + ' 页</span><div>' + button('prev', 'chevron-left', '上一页', state.page === 1 ? 'disabled' : '') + button('next', 'chevron-right', '下一页', state.page === pages ? 'disabled' : '') + '</div></div>';
      }
      root.innerHTML = '<header class="qv-head"><div><h2><i class="bi bi-clock-history"></i>' + title + '</h2><p>' + esc(item.name) + '<span class="qv-badge current">当前版本 ' + esc(item.currentVersion) + '</span></p></div>' + button(record ? 'back' : 'close', 'arrow-left', record ? '返回版本列表' : '返回列表') + '</header><div class="qv-body">' + body + '</div>';
      if (state.pending) {
        root.insertAdjacentHTML('beforeend', '<div class="qv-modal-mask"><section class="qv-modal" role="dialog" aria-modal="true" aria-labelledby="qv-rollback-title"><header><h3 id="qv-rollback-title">确认回滚</h3>' + button('cancel', 'x-lg', '关闭') + '</header><div class="qv-modal-body">' + fields('回滚对象', [['名称', item.name], ['当前版本', state.pending.from], ['目标版本', state.pending.to]]) + '<p class="qv-note">' + (options.kind === 'tasks' ? '回滚恢复配置及引用规则版本，后续执行采用恢复的配置，启停状态和历史执行结果保留。' : '回滚后该版本成为规则当前版本，已有任务仍使用各自绑定的规则版本。') + '原版本和操作记录保留。</p><label class="qv-reason"><span><em>*</em> 回滚原因</span><textarea data-qv-reason maxlength="200" placeholder="请输入回滚原因，200 字以内">' + esc(state.pending.reason || '') + '</textarea></label><p class="qv-error" role="alert">' + esc(state.error) + '</p></div><footer>' + button('confirm', 'arrow-counterclockwise', '确认回滚') + button('cancel', 'x-lg', '取消') + '</footer></section></div>');
        root.querySelector('[data-qv-reason]').focus();
      }
    }
    function query() {
      state.keyword = root.querySelector('[data-qv-keyword]').value.trim();
      state.status = root.querySelector('[data-qv-filter]').value;
      state.page = 1;
      render();
    }
    root.addEventListener('click', function (e) {
      e.stopPropagation();
      var control = e.target.closest('[data-qv-action]');
      if (!control || control.disabled) return;
      var action = control.getAttribute('data-qv-action');
      if (action === 'close') {
        root.remove(); host.classList.remove('qv-host'); background.forEach(function (entry) { entry.node.inert = entry.previous; }); options.onClose();
        if (origin && document.contains(origin)) origin.focus();
      } else if (action === 'query') query();
      else if (action === 'prev' || action === 'next') { state.page += action === 'prev' ? -1 : 1; render(); }
      else if (action === 'detail') { state.detail = control.getAttribute('data-version'); render(); }
      else if (action === 'back') { state.detail = ''; render(); }
      else if (action === 'rollback') {
        state.pending = { to: control.getAttribute('data-version'), from: item.currentVersion, revision: item.revision, reason: '' };
        state.error = ''; render();
      } else if (action === 'cancel') { state.pending = null; state.error = ''; render(); }
      else if (action === 'confirm' && state.pending) {
        state.pending.reason = root.querySelector('[data-qv-reason]').value.trim();
        var result = V.rollback(options.kind, item.id, state.pending.to, state.pending.reason, state.pending.revision);
        if (result.error) { state.error = result.error; render(); return; }
        item = result.item; state.pending = null; state.detail = ''; state.status = ''; state.keyword = ''; state.page = 1;
        render(); options.toast('已回滚至 ' + item.currentVersion);
      }
    });
    root.addEventListener('change', function (e) { e.stopPropagation(); if (e.target.matches('[data-qv-filter]')) query(); });
    root.addEventListener('input', function (e) { e.stopPropagation(); });
    root.addEventListener('keydown', function (e) {
      e.stopPropagation();
      if (e.key === 'Enter' && e.target.matches('[data-qv-keyword]')) { e.preventDefault(); query(); }
      if (e.key === 'Escape' && state.pending) { state.pending = null; state.error = ''; render(); }
      if (e.key === 'Tab' && state.pending) {
        var controls = Array.from(root.querySelectorAll('.qv-modal button, .qv-modal textarea')).filter(function (c) { return !c.disabled; });
        var first = controls[0]; var last = controls[controls.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    render();
    root.querySelector('button').focus();
  }
  return { open: open, saveOptions: saveOptions, saveHint: saveHint };
})();
