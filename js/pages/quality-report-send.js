/** 数据资产 / 数据质量 / 报告发送（本地静态交互） */
window.DP = window.DP || {};
DP.pages = DP.pages || {};

DP.pages.qualityReportSend = (function () {
  var storageKey = 'dp-quality-report-send-v2';
  var legacyStorageKey = 'dp-quality-report-send-v1';
  var pageEl = null;
  var store = null;
  var deliveryTimers = {};
  var serial = 0;
  var state = {
    tab: 'records',
    filters: { records: { keyword: '', recipient: '', channel: '', status: '', start: '', end: '' }, rules: { keyword: '', channel: '', reportId: '' } },
    pages: { records: 1, rules: 1 }, sizes: { records: 10, rules: 10 }, selected: {},
    form: null, picker: null, logId: '', combo: '', comboKeyword: '', error: '', queryError: '',
    errorChannel: '', reportsExpanded: false
  };
  state.queryDrafts = copy(state.filters);
  var departments = [
    { id: 'org', parent: '', name: '全部部门' },
    { id: 'data', parent: 'org', name: '数据管理中心' },
    { id: 'governance', parent: 'data', name: '数据治理部' },
    { id: 'warehouse', parent: 'data', name: '数据开发部' },
    { id: 'business', parent: 'org', name: '业务运营中心' },
    { id: 'customer', parent: 'business', name: '客户运营部' },
    { id: 'finance', parent: 'business', name: '财务管理部' },
    { id: 'it', parent: 'org', name: '信息技术部' }
  ];
  var users = [
    ['u01', '王敏', 'governance', 'wangmin'], ['u02', '李明', 'governance', 'liming'],
    ['u03', '张伟', 'governance', 'zhangwei'], ['u04', '陈晨', 'governance', 'chenchen'],
    ['u05', '刘洋', 'warehouse', 'liuyang'], ['u06', '赵磊', 'warehouse', 'zhaolei'],
    ['u07', '周宁', 'warehouse', 'zhouning'], ['u08', '吴桐', 'customer', 'wutong'],
    ['u09', '林琳', 'customer', 'linlin'], ['u10', '郑浩', 'customer', 'zhenghao'],
    ['u11', '孙悦', 'finance', 'sunyue'], ['u12', '何静', 'finance', 'hejing'],
    ['u13', '杨帆', 'finance', 'yangfan'], ['u14', '黄凯', 'it', 'huangkai'],
    ['u15', '徐峰', 'it', 'xufeng'], ['u16', '宋佳', 'it', 'songjia']
  ].map(function (row) { return { id: row[0], name: row[1], dept: row[2], email: row[3] + '@example.com' }; });
  var channels = [{ id: 'email', name: '邮件', icon: 'bi-envelope' }, { id: 'runwork', name: '润工作', icon: 'bi-chat-dots' }];

  function esc(value) {
    return String(value == null ? '' : value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function copy(value) { return JSON.parse(JSON.stringify(value)); }
  function uid(prefix) { serial += 1; return prefix + '-' + Date.now() + '-' + serial; }
  function now() {
    return formatDateTime(new Date());
  }
  function formatDateTime(date) {
    function pad(n) { return String(n).padStart(2, '0'); }
    return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate()) + ' ' + pad(date.getHours()) + ':' + pad(date.getMinutes()) + ':' + pad(date.getSeconds());
  }
  function matches(text, keyword) { return String(text).toLowerCase().indexOf(String(keyword || '').trim().toLowerCase()) >= 0; }
  function getOptions() { return DP.pages.qualityInspectReport.getSendReportOptions(); }
  function findReport(id) { return getOptions().filter(function (r) { return r.id === id; })[0]; }
  function findUser(id) { return users.filter(function (u) { return u.id === id; })[0]; }
  function deptName(id) { var dept = departments.filter(function (d) { return d.id === id; })[0]; return dept ? dept.name : ''; }
  function deptPath(id) {
    var node = departments.filter(function (d) { return d.id === id; })[0];
    return node ? (node.parent && node.parent !== 'org' ? deptPath(node.parent) + ' / ' : '') + node.name : '';
  }
  function reportNames(rule) { return (rule.reportIds || []).map(function (id) { var r = findReport(id); return r ? r.name : '原报告已不可用'; }); }
  function unique(values) { return Array.from(new Set(values || [])); }
  function channelName(id) { return id === 'email' ? '邮件' : '润工作'; }
  function findRecord(id) { return store.records.filter(function (r) { return r.id === id; })[0]; }
  function deptUsers(id) {
    var ids = [id];
    function descend(parent) { departments.filter(function (d) { return d.parent === parent; }).forEach(function (d) { ids.push(d.id); descend(d.id); }); }
    descend(id);
    return users.filter(function (u) { return ids.indexOf(u.dept) >= 0; });
  }
  function recipientList(rule, channel) {
    var result = [];
    if (channel === 'email') {
      var currentUserIds = (rule.userIds || []).slice();
      (rule.departmentIds || []).forEach(function (id) { deptUsers(id).forEach(function (u) { currentUserIds.push(u.id); }); });
      unique(currentUserIds).forEach(function (id) {
        var user = findUser(id);
        if (user) result.push({ key: user.email.toLowerCase(), name: user.name, address: user.email, type: '系统用户' });
      });
      (rule.emails || []).forEach(function (item) { result.push({ key: item.address.trim().toLowerCase(), name: item.name.trim(), address: item.address.trim(), type: '其他邮箱' }); });
    } else {
      (rule.groups || []).forEach(function (item) { result.push({ key: 'group:' + item.address, name: item.name, address: item.address, type: '润工作群' }); });
      (rule.people || []).forEach(function (item) { result.push({ key: 'person:' + item.address, name: item.name, address: item.address, type: '润工作人员' }); });
    }
    var seen = Object.create(null);
    return result.filter(function (r) { if (seen[r.key]) return false; seen[r.key] = true; return true; });
  }
  function makeRecord(rule, report, channel, recipient, time, batch, previous) {
    return {
      id: uid('send'), ruleId: rule.id, ruleName: rule.name, reportId: report.id, reportName: report.name,
      generatedTime: report.generatedTime, batch: batch, channel: channel, sentAt: time, finishedAt: '', status: 'pending',
      recipient: copy(recipient), requestId: uid('req'), attemptNo: previous ? previous.attemptNo + 1 : 1,
      retryOf: previous ? previous.id : '', retryId: '', logs: [], errorCode: '', durationMs: 0
    };
  }
  function logLine(record, level, stage, message, time) { record.logs.push({ time: time || now(), level: level, stage: stage, message: message }); }
  function startLog(record) {
    logLine(record, 'INFO', 'DISPATCH', 'requestId=' + record.requestId + ' channel=' + record.channel + ' attempt=' + record.attemptNo, record.sentAt);
    logLine(record, 'INFO', 'RECIPIENT', 'type=' + record.recipient.type + ' target=' + record.recipient.address, record.sentAt);
    logLine(record, 'INFO', 'REPORT', 'reportId=' + record.reportId + ' generatedAt=' + record.generatedTime, record.sentAt);
    logLine(record, 'INFO', 'CONNECT', record.channel === 'email' ? 'SMTP connect smtp.example.com:465; TLS enabled; timeout=10000ms' : 'HTTPS POST /messages/send; timeout=10000ms', record.sentAt);
  }
  function completeLog(record, failed, reason, time) {
    record.status = failed ? 'failed' : 'success'; record.finishedAt = time || now();
    if (failed) {
      record.errorCode = record.channel === 'email' ? 'ETIMEDOUT' : 'HTTP_504';
      logLine(record, 'ERROR', 'RESPONSE', record.channel === 'email' ? 'SMTP transport failed: code=ETIMEDOUT; command=CONN; no SMTP response received' : 'HTTP 504 Gateway Timeout; response={"code":"UPSTREAM_TIMEOUT","message":"Message service timeout"}', record.finishedAt);
      logLine(record, 'ERROR', 'EXCEPTION', (record.channel === 'email' ? 'SocketTimeoutError: Connection timed out\n    at SmtpTransport.connect (mail-transport.js:84:16)' : 'UpstreamTimeoutError: Message service did not respond\n    at RunWorkClient.send (runwork-client.js:126:18)') + '\n' + (reason || '发送超时，接收服务未确认投递。'), record.finishedAt);
    } else {
      logLine(record, 'INFO', 'RESPONSE', record.channel === 'email' ? 'SMTP 250 2.0.0 OK: message accepted for delivery' : 'HTTP 200; response={"code":0,"message":"ok"}', record.finishedAt);
    }
    logLine(record, failed ? 'ERROR' : 'INFO', 'COMPLETE', 'status=' + record.status + ' duration=' + record.durationMs + 'ms requestId=' + record.requestId, record.finishedAt);
  }
  function seedRules(options, legacyVersion) {
    var rules = [];
    for (var i = 0; i < 12 && options.length; i++) {
      var reportCount = legacyVersion === 1 ? 1 : legacyVersion === 2 ? 2 : i % 4 + 1;
      var reportIds = [];
      for (var n = 0; n < Math.min(reportCount, options.length); n++) reportIds.push(options[(i + n) % options.length].id);
      var names = ['治理负责人', '开发值班组', '运营负责人', '财务核对组'];
      rules.push({
        id: 'send-rule-' + (i + 1), name: names[i % names.length] + '报告通知' + (i >= 4 ? '（' + (Math.floor(i / 4) + 1) + '）' : ''),
        reportIds: reportIds, departmentIds: legacyVersion !== 1 && i % 4 === 0 ? ['governance'] : [], channels: i % 3 === 0 ? ['email', 'runwork'] : [i % 3 === 1 ? 'email' : 'runwork'],
        userIds: [users[i % users.length].id, users[(i + 1) % users.length].id],
        emails: i % 3 === 0 ? [{ name: '业务对接人', address: 'contact' + (i + 1) + '@example.com' }] : [],
        groups: [{ name: names[i % names.length] + '协作群', address: 'rw-quality-' + (i + 1) }],
        people: [{ name: users[i % users.length].name, address: 'rw-user-' + (i + 1) }], updatedAt: '2026-09-01 09:30:00'
      });
    }
    return rules;
  }
  function refreshSeedReports() {
    if (store.sampleRulesVersion === 1) return;
    var options = getOptions();
    if (!options.length) return;
    var current = seedRules(options);
    var legacySingle = seedRules(options, 1);
    var legacyMultiple = seedRules(options, 2);
    function unchanged(rule, sample) {
      return Object.keys(rule).length === Object.keys(sample).length && Object.keys(sample).every(function (key) { return JSON.stringify(rule[key]) === JSON.stringify(sample[key]); });
    }
    store.rules.forEach(function (rule) {
      var index = current.findIndex(function (sample) { return sample.id === rule.id; });
      if (index < 0) return;
      var fromLegacy = store.records.some(function (record) { return record.ruleId === rule.id && record.batch === 'seed-' + rule.id && /-attempt-\d+-target-\d+$/.test(record.id); });
      // 仅更新与旧内置样例全部字段一致的规则，保留用户编辑及历史发送数据。
      if (unchanged(rule, fromLegacy ? legacySingle[index] : legacyMultiple[index])) rule.reportIds = current[index].reportIds.slice();
    });
    store.sampleRulesVersion = 1;
  }
  function seedStore() {
    var rules = seedRules(getOptions());
    var records = [];
    rules.forEach(function (rule, index) {
      rule.channels.forEach(function (channel) {
        var report = findReport(rule.reportIds[0]);
        var time = report.generatedTime && report.generatedTime !== '-' ? report.generatedTime : '2026-06-30 10:05:02';
        recipientList(rule, channel).forEach(function (recipient, n) {
          var record = makeRecord(rule, Object.assign({}, report, { generatedTime: time }), channel, recipient, time, 'seed-' + rule.id);
          var failed = index % 3 !== 1 && n === 0;
          record.durationMs = failed ? 10000 : 820;
          startLog(record); completeLog(record, failed, '', formatDateTime(new Date(dateTimeValue(time) + record.durationMs))); records.push(record);
        });
      });
    });
    records.sort(function (a, b) { return b.sentAt.localeCompare(a.sentAt); });
    return { version: 2, sampleRulesVersion: 1, rules: rules, records: records, processed: [] };
  }
  function migrateLegacy(legacy) {
    var migrated = { version: 2, rules: [], records: [], processed: (legacy.processed || []).slice() };
    migrated.rules = legacy.rules.map(function (old) {
      var rule = Object.assign({}, old, { reportIds: old.reportId ? [old.reportId] : [], departmentIds: [], userIds: (old.userIds || []).slice() });
      delete rule.reportId; delete rule.reportName;
      return rule;
    });
    legacy.records.forEach(function (old) {
      var previousByRecipient = Object.create(null);
      var attempts = old.attempts && old.attempts.length ? old.attempts : [{ startedAt: old.sentAt, endedAt: old.sentAt, results: old.recipients || [] }];
      attempts.forEach(function (attempt, attemptIndex) {
        (attempt.results || []).forEach(function (target, targetIndex) {
          var key = target.key || target.type + ':' + target.address;
          var previous = previousByRecipient[key];
          var record = makeRecord({ id: old.ruleId, name: old.ruleName }, { id: old.reportId, name: old.reportName, generatedTime: old.generatedTime }, old.channel, target, attempt.startedAt || old.sentAt, old.batch, previous);
          record.id = old.id + '-attempt-' + (attemptIndex + 1) + '-target-' + (targetIndex + 1);
          record.recipient = { key: key, name: target.name, address: target.address, type: target.type };
          record.status = target.status === 'success' ? 'success' : 'failed';
          record.finishedAt = attempt.endedAt || record.sentAt;
          if (/^seed-/.test(old.batch || '')) {
            // 已知静态示例补齐技术日志展示；非示例历史仅保留原有日志证据。
            record.durationMs = record.status === 'failed' ? 10000 : 820;
            startLog(record); completeLog(record, record.status === 'failed', target.reason, formatDateTime(new Date(dateTimeValue(record.sentAt) + record.durationMs)));
          } else {
            logLine(record, 'WARN', 'ARCHIVE', '该历史发送未保存详细的渠道技术日志。', record.sentAt);
            logLine(record, record.status === 'failed' ? 'ERROR' : 'INFO', 'RESULT', target.reason || (record.status === 'success' ? '已成功投递' : '发送未完成，请重新发送'), record.finishedAt);
          }
          if (previous) previous.retryId = record.id;
          previousByRecipient[key] = record; migrated.records.push(record);
        });
      });
    });
    migrated.records.sort(function (a, b) { return b.sentAt.localeCompare(a.sentAt); });
    return migrated;
  }
  function ensureStore() {
    if (store) return;
    try {
      var saved = JSON.parse(window.localStorage.getItem(storageKey) || 'null');
      if (saved && saved.version === 2 && Array.isArray(saved.rules) && Array.isArray(saved.records) && Array.isArray(saved.processed)) store = saved;
      if (!store) {
        var legacy = JSON.parse(window.localStorage.getItem(legacyStorageKey) || 'null');
        if (legacy && legacy.version === 1 && Array.isArray(legacy.rules) && Array.isArray(legacy.records)) store = migrateLegacy(legacy);
      }
    } catch (error) { /* 本地存储不可用时仍可完成当前页面演示。 */ }
    if (!store) store = seedStore();
    refreshSeedReports();
    // 页面刷新中断的发送保留为可重试失败，不将未完成的请求标为成功。
    store.records.forEach(function (record) {
      if (record.status !== 'sending') return;
      record.status = 'failed'; record.errorCode = 'CLIENT_INTERRUPTED'; record.finishedAt = now();
      logLine(record, 'ERROR', 'INTERRUPTED', 'ClientInterruptedError: 发送过程中页面已刷新，未获得投递确认，请重新发送。');
    });
    persist();
  }
  function persist() {
    try { window.localStorage.setItem(storageKey, JSON.stringify(store)); } catch (error) { /* 内存状态继续可用。 */ }
  }
  function toast(message) {
    var old = document.querySelector('.qrs-toast');
    if (old) old.remove();
    var node = document.createElement('div');
    node.className = 'qrs-toast'; node.setAttribute('role', 'status'); node.textContent = message;
    document.body.appendChild(node);
    window.setTimeout(function () { node.remove(); }, 2400);
  }
  function isVisible() { return pageEl && document.documentElement.contains(pageEl); }
  function statusBadge(status) {
    var map = { success: ['tag-green', 'bi-check-circle', '发送成功'], failed: ['tag-red', 'bi-x-circle', '发送失败'], sending: ['tag-blue', 'bi-arrow-repeat', '发送中'], pending: ['tag-blue', 'bi-clock', '待发送'] };
    var item = map[status] || map.pending;
    return '<span class="tag qrs-status ' + item[0] + '"><i class="bi ' + item[1] + '"></i>' + item[2] + '</span>';
  }
  function button(action, icon, label, extra, className) {
    return '<button type="button" class="' + (className || 'btn btn-outline') + '" data-qrs-action="' + action + '" ' + (extra || '') + '><i class="bi ' + icon + '"></i><span>' + label + '</span></button>';
  }
  function empty(message, cols) { return '<tr><td colspan="' + cols + '"><div class="qrs-empty"><i class="bi bi-inbox"></i><span>' + message + '</span></div></td></tr>'; }
  function renderChannels(values) {
    return values.map(function (id) { return '<span class="qrs-channel"><i class="bi ' + (id === 'email' ? 'bi-envelope' : 'bi-chat-dots') + '"></i>' + channelName(id) + '</span>'; }).join('');
  }
  function filteredRows() {
    var filters = state.filters[state.tab];
    var rows = state.tab === 'records' ? store.records : store.rules;
    return rows.filter(function (r) {
      var searchable = state.tab === 'rules' ? r.name + ' ' + reportNames(r).join(' ') : r.ruleName + ' ' + r.reportName;
      if (!matches(searchable, filters.keyword)) return false;
      if (filters.channel && (state.tab === 'records' ? r.channel !== filters.channel : r.channels.indexOf(filters.channel) < 0)) return false;
      if (state.tab === 'rules') return !filters.reportId || r.reportIds.indexOf(filters.reportId) >= 0;
      if (!matches(r.recipient.name, filters.recipient) && !matches(r.recipient.address, filters.recipient)) return false;
      var sentAt = dateTimeValue(r.sentAt);
      return (!filters.status || r.status === filters.status) && (!filters.start || sentAt >= dateTimeValue(filters.start)) && (!filters.end || sentAt <= dateTimeValue(filters.end));
    });
  }
  function pageRows() {
    var rows = filteredRows();
    var size = state.sizes[state.tab];
    state.pages[state.tab] = Math.max(1, Math.min(state.pages[state.tab], Math.ceil(rows.length / size) || 1));
    return rows.slice((state.pages[state.tab] - 1) * size, state.pages[state.tab] * size);
  }
  function canRetry(record) { return record && record.status === 'failed' && !record.retryId; }
  function selectedFailed() { return store.records.filter(function (r) { return state.selected[r.id] && canRetry(r); }); }
  function pad(number) { return String(number).padStart(2, '0'); }
  function dateTimeValue(value) {
    var parts = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/.exec(value || '');
    if (!parts) return NaN;
    var nums = parts.slice(1).map(Number);
    var date = new Date(nums[0], nums[1] - 1, nums[2], nums[3], nums[4], nums[5]);
    if (date.getFullYear() !== nums[0] || date.getMonth() + 1 !== nums[1] || date.getDate() !== nums[2] || date.getHours() !== nums[3] || date.getMinutes() !== nums[4] || date.getSeconds() !== nums[5]) return NaN;
    return date.getTime();
  }
  function query() {
    var values = Object.assign({}, state.queryDrafts[state.tab]);
    pageEl.querySelectorAll('[data-qrs-filter]').forEach(function (el) { values[el.dataset.qrsFilter] = el.value.trim(); });
    state.queryDrafts[state.tab] = values;
    if ((values.start && !Number.isFinite(dateTimeValue(values.start))) || (values.end && !Number.isFinite(dateTimeValue(values.end))) || (values.start && values.end && dateTimeValue(values.start) > dateTimeValue(values.end))) {
      state.queryError = '请选择有效时间，开始时间不能晚于结束时间';
      var errorEl = pageEl.querySelector('.qrs-query-error');
      if (errorEl) { errorEl.textContent = state.queryError; errorEl.hidden = false; }
      return false;
    }
    state.queryError = '';
    state.filters[state.tab] = Object.assign({}, values);
    state.pages[state.tab] = 1; state.selected = {};
    render();
    return true;
  }
  function renderCombo(context) {
    var id = context === 'form' ? '' : state.queryDrafts.rules.reportId;
    var selected = findReport(id);
    var label = context === 'form' ? '选择报告' : selected ? selected.name : id ? '原报告已不可用，请重新选择' : '全部报告';
    var opened = state.combo === context;
    return '<div class="qrs-combo" data-qrs-combo="' + context + '">' +
      button('combo', 'bi-file-earmark-text', esc(label), 'data-context="' + context + '" aria-expanded="' + opened + '" title="' + esc(label) + '"', 'qrs-combo-trigger') +
      (opened ? '<div class="qrs-combo-pop"><div class="qrs-combo-search"><i class="bi bi-search"></i><input type="search" data-qrs-combo-search placeholder="搜索报告或关联任务" value="' + esc(state.comboKeyword) + '" aria-label="搜索稽查报告"></div><div class="qrs-combo-options">' + renderComboOptions(context) + '</div>' + (context === 'form' ? '<div class="qrs-combo-footer"><span>已选择 ' + state.form.reportIds.length + ' 份</span>' + button('reports-clear', 'bi-trash3', '清空', '', 'qrs-link') + button('reports-done', 'bi-check-lg', '完成', '', 'qrs-link') + '</div>' : '') + '</div>' : '') + '</div>';
  }
  function renderComboOptions(context) {
    var rows = getOptions().filter(function (r) { return matches(r.name + ' ' + r.taskName, state.comboKeyword); });
    return (context === 'filter' ? button('choose-report', 'bi-collection', '全部报告', 'data-id="" data-context="filter"', 'qrs-combo-option') : '') +
      rows.map(function (r) {
        var content = '<i class="bi bi-file-earmark-text"></i><span><strong>' + esc(r.name) + '</strong><small>' + esc(r.taskName) + '</small></span>';
        return context === 'form' ? '<label class="qrs-combo-option"><input type="checkbox" data-qrs-report-select="' + esc(r.id) + '"' + (state.form.reportIds.indexOf(r.id) >= 0 ? ' checked' : '') + '>' + content + '</label>' : '<button type="button" class="qrs-combo-option" data-qrs-action="choose-report" data-id="' + esc(r.id) + '">' + content + '</button>';
      }).join('') +
      (!rows.length ? '<div class="qrs-empty-small">未找到匹配的稽查报告</div>' : '');
  }
  function renderQuery() {
    var filters = state.queryDrafts[state.tab];
    return '<div class="qrs-query"><label>名称<input type="search" data-qrs-filter="keyword" value="' + esc(filters.keyword) + '" placeholder="报告名称 / 规则名称"></label>' +
      (state.tab === 'records' ? '<label class="qrs-recipient-filter">接收对象<input type="search" data-qrs-filter="recipient" value="' + esc(filters.recipient) + '" placeholder="接收人 / 群名称 / 邮箱 / ID"></label>' : '') +
      (state.tab === 'rules' ? '<div class="qrs-query-field"><span>稽查报告</span>' + renderCombo('filter') + '</div>' : '') +
      '<label>发送渠道<select data-qrs-filter="channel"><option value="">全部渠道</option>' + channels.map(function (c) { return '<option value="' + c.id + '"' + (filters.channel === c.id ? ' selected' : '') + '>' + c.name + '</option>'; }).join('') + '</select></label>' +
      (state.tab === 'records' ? '<label>发送状态<select data-qrs-filter="status"><option value="">全部状态</option>' + [['success', '发送成功'], ['failed', '发送失败'], ['sending', '发送中']].map(function (r) { return '<option value="' + r[0] + '"' + (filters.status === r[0] ? ' selected' : '') + '>' + r[1] + '</option>'; }).join('') + '</select></label><div class="qrs-query-field qrs-dates"><span>发送时间</span>' + DP.datePicker.render({ mode: 'range', label: '发送时间', output: 'datetime', start: filters.start, end: filters.end, startAttrs: { 'data-qrs-filter': 'start' }, endAttrs: { 'data-qrs-filter': 'end' } }) + '</div>' : '') +
      button('query', 'bi-search', '查询', '', 'btn btn-primary') + button('reset', 'bi-arrow-counterclockwise', '重置') + '</div><p class="qrs-query-error" role="alert"' + (state.queryError ? '' : ' hidden') + '>' + esc(state.queryError) + '</p>';
  }
  function renderRecordRows() {
    var rows = pageRows();
    return rows.map(function (r) {
      return '<tr><td class="col-ck"><input type="checkbox" data-qrs-select="' + esc(r.id) + '" aria-label="选择' + esc(r.recipient.name + '的发送记录') + '"' + (!canRetry(r) ? ' disabled' : '') + (state.selected[r.id] ? ' checked' : '') + '></td>' +
        '<td><div class="qrs-cell-main" title="' + esc(r.reportName) + '">' + esc(r.reportName) + '</div><small>生成时间：' + esc(r.generatedTime) + '</small></td>' +
        '<td title="' + esc(r.ruleName) + '">' + esc(r.ruleName) + '</td><td>' + renderChannels([r.channel]) + '</td>' +
        '<td><div class="qrs-cell-main">' + esc(r.recipient.name) + '</div><small>' + esc(r.recipient.type) + '</small></td><td title="' + esc(r.recipient.address) + '">' + esc(r.recipient.address) + '</td>' +
        '<td>' + esc(r.sentAt) + '<small>' + (r.retryOf ? '失败重发 · 第 ' + r.attemptNo + ' 次' : '自动发送') + '</small></td><td>' + statusBadge(r.status) + (r.retryId ? '<small>已发起重发</small>' : '') + '</td>' +
        '<td class="qrs-actions-cell"><div class="qrs-actions">' + button('view', 'bi-file-earmark-text', '查看内容', 'data-id="' + esc(r.id) + '"', 'qrs-link') +
        (canRetry(r) ? button('retry', 'bi-arrow-clockwise', '重新发送', 'data-id="' + esc(r.id) + '"', 'qrs-link') : '') +
        button('logs', 'bi-journal-text', '发送日志', 'data-id="' + esc(r.id) + '"', 'qrs-link') + '</div></td></tr>';
    }).join('') || empty('暂无符合条件的发送记录', 9);
  }
  function renderRuleRows() {
    return pageRows().map(function (rule) {
      var targets = rule.channels.map(function (c) { return c === 'email' ? '邮件：' + rule.departmentIds.length + ' 个部门、' + rule.userIds.length + ' 名用户、' + rule.emails.length + ' 个邮箱' : '润工作：' + rule.groups.length + ' 个群、' + rule.people.length + ' 名人员'; }).join('；');
      var names = reportNames(rule);
      return '<tr><td><div class="qrs-cell-main" title="' + esc(rule.name) + '">' + esc(rule.name) + '</div><small>报告生成成功后自动发送</small></td><td><details class="qrs-report-summary"><summary>' + names.length + ' 份报告</summary><div>' + names.map(function (name) { return '<span>' + esc(name) + '</span>'; }).join('') + '</div></details></td><td>' + renderChannels(rule.channels) + '</td><td title="' + esc(targets) + '">' + esc(targets) + (rule.departmentIds.length ? '<small>部门成员在发送时动态获取</small>' : '') + '</td><td>' + esc(rule.updatedAt) + '</td><td>' + button('edit', 'bi-pencil-square', '编辑', 'data-id="' + esc(rule.id) + '"', 'qrs-link') + '</td></tr>';
    }).join('') || empty('暂无符合条件的发送规则', 6);
  }
  function renderPagination() {
    var total = filteredRows().length;
    var size = state.sizes[state.tab];
    var page = state.pages[state.tab];
    var count = Math.max(1, Math.ceil(total / size));
    var nums = [];
    for (var n = Math.max(1, page - 2); n <= Math.min(count, page + 2); n++) nums.push('<button type="button" class="page-num' + (n === page ? ' active' : '') + '" data-qrs-action="page" data-page="' + n + '" aria-label="第' + n + '页">' + n + '</button>');
    return '<div class="ds-pagination qrs-pagination"><span>共 ' + total + ' 条</span><div class="page-nav"><label>每页 <select data-qrs-size aria-label="每页条数"><option value="10"' + (size === 10 ? ' selected' : '') + '>10 条</option><option value="20"' + (size === 20 ? ' selected' : '') + '>20 条</option></select></label>' + button('page', 'bi-chevron-left', '上一页', 'data-page="' + (page - 1) + '"' + (page === 1 ? ' disabled' : '')) + nums.join('') + button('page', 'bi-chevron-right', '下一页', 'data-page="' + (page + 1) + '"' + (page === count ? ' disabled' : '')) + '</div></div>';
  }
  function renderList() {
    var records = state.tab === 'records';
    var rows = records ? renderRecordRows() : renderRuleRows();
    return '<div class="qrs-tabs" role="tablist" aria-label="报告发送">' + ['records', 'rules'].map(function (tab) {
      return '<button type="button" role="tab" aria-selected="' + (state.tab === tab) + '" class="' + (state.tab === tab ? 'active' : '') + '" data-qrs-action="tab" data-tab="' + tab + '"><i class="bi ' + (tab === 'records' ? 'bi-send' : 'bi-sliders') + '"></i>' + (tab === 'records' ? '发送记录' : '规则配置') + '</button>';
    }).join('') + '</div><section class="qrs-panel" role="tabpanel">' + renderQuery() +
      '<div class="qrs-toolbar"><div class="qrs-toolbar-actions">' + (records ? button('batch-retry', 'bi-arrow-repeat', '批量重新发送', selectedFailed().length ? '' : 'disabled', 'btn btn-primary') + '<span data-qrs-count>已选择 ' + selectedFailed().length + ' 条失败记录</span>' : button('new', 'bi-plus-lg', '新增规则', '', 'btn btn-primary')) + '</div><span class="qrs-hint">' + (records ? '每个接收对象的每次发送独立记录' : '所选稽查报告每次生成成功后，自动按规则发送') + '</span></div>' +
      '<div class="qrs-table-scroll"><table class="ds-table qrs-table ' + (records ? 'qrs-record-table' : 'qrs-rule-table') + '"><thead><tr>' + (records ? '<th class="col-ck"><input type="checkbox" data-qrs-select-all aria-label="选择本页可重发的失败记录"></th><th>报告名称</th><th>规则名称</th><th>发送渠道</th><th>接收人 / 群名称</th><th>邮箱 / ID</th><th>发送时间</th><th>发送状态</th><th>操作</th>' : '<th>规则名称</th><th>稽查报告</th><th>发送渠道</th><th>接收对象</th><th>更新时间</th><th>操作</th>') + '</tr></thead><tbody>' + rows + '</tbody></table></div>' + renderPagination() + '</section>';
  }
  function newDraft() { return { id: '', name: '', reportIds: [], departmentIds: [], channels: ['email'], userIds: [], emails: [], groups: [], people: [] }; }
  function renderSelectedReports() {
    var ids = state.form.reportIds;
    if (!ids.length) return '';
    var shown = state.reportsExpanded ? ids : ids.slice(0, 4);
    return '<div class="qrs-selected-reports' + (state.reportsExpanded ? ' is-expanded' : '') + '">' + shown.map(function (id) {
      var report = findReport(id);
      var name = report ? report.name : '原报告已不可用';
      return '<div><i class="bi bi-file-earmark-text"></i><span title="' + esc(name) + '">' + esc(name) + '</span>' + button('report-remove', 'bi-x', '移除', 'data-id="' + esc(id) + '" aria-label="移除' + esc(name) + '"', 'qrs-link') + '</div>';
    }).join('') + '</div>' + (ids.length > 4 ? button('reports-expand', state.reportsExpanded ? 'bi-chevron-up' : 'bi-chevron-down', state.reportsExpanded ? '收起' : '展开全部（' + ids.length + '）', 'aria-expanded="' + state.reportsExpanded + '"', 'qrs-link qrs-report-expand') : '');
  }
  function renderSelectedTargets() {
    var f = state.form;
    var deptRows = f.departmentIds.map(function (id) { return '<div class="qrs-user-chip qrs-department-chip"><i class="bi bi-diagram-3"></i><span title="' + esc(deptName(id) + ' · ' + deptPath(id)) + '">' + esc(deptName(id)) + '<small title="' + esc(deptPath(id)) + '">' + esc(deptPath(id)) + '</small></span>' + button('remove-department', 'bi-x', '移除', 'data-id="' + esc(id) + '"', 'qrs-link') + '</div>'; }).join('');
    var userRows = f.userIds.map(findUser).filter(Boolean).map(function (u) { return '<div class="qrs-user-chip"><i class="bi bi-person"></i><span title="' + esc(u.name + ' · ' + deptName(u.dept) + ' · ' + u.email) + '">' + esc(u.name) + '<small>' + esc(deptName(u.dept)) + ' · ' + esc(u.email) + '</small></span>' + button('remove-user', 'bi-x', '移除', 'data-id="' + u.id + '"', 'qrs-link') + '</div>'; }).join('');
    var count = f.departmentIds.length + ' 个部门 · ' + f.userIds.length + ' 名用户';
    return '<div class="qrs-target-block"><div class="qrs-section-title"><h3><span>部门与指定用户</span><span class="qrs-count" title="' + count + '">' + count + '</span></h3>' + button('pick-users', 'bi-person-plus', '选择用户') + '</div>' + (deptRows || userRows ? '<div class="qrs-user-chips">' + deptRows + userRows + '</div>' : '<div class="qrs-empty-small">请选择部门或用户</div>') + '</div>';
  }
  function fitSelectedTargets() {
    if (!isVisible()) return;
    var list = pageEl.querySelector('.qrs-user-chips');
    if (!list) return;
    var scrollTop = list.scrollTop;
    list.style.maxHeight = '';
    var rows = list.querySelectorAll('.qrs-user-chip');
    list.style.scrollbarGutter = rows.length > 5 ? 'stable' : '';
    if (rows.length > 5 && rows[0].getBoundingClientRect && window.getComputedStyle) {
      var styles = window.getComputedStyle(list);
      var height = rows[4].getBoundingClientRect().bottom - rows[0].getBoundingClientRect().top;
      if (styles.boxSizing === 'border-box') height += ['paddingTop', 'paddingBottom', 'borderTopWidth', 'borderBottomWidth'].reduce(function (total, key) { return total + (parseFloat(styles[key]) || 0); }, 0);
      list.style.maxHeight = Math.ceil(height) + 'px';
    }
    list.scrollTop = scrollTop;
  }
  function fitTargetTables() {
    if (!isVisible()) return;
    pageEl.querySelectorAll('[data-qrs-target-scroll]').forEach(function (list) {
      var scrollTop = list.scrollTop;
      list.style.maxHeight = '';
      var rows = list.querySelectorAll('tbody tr');
      list.style.scrollbarGutter = rows.length > 5 ? 'stable' : '';
      if (rows.length > 5) {
        var table = list.querySelector('table');
        var height = rows[4].getBoundingClientRect().bottom - table.getBoundingClientRect().top;
        list.style.maxHeight = Math.ceil(height) + 'px';
      }
      list.scrollTop = scrollTop;
    });
  }
  function formActions() { return button('cancel-form', 'bi-x-lg', '取消') + button('save', 'bi-check-lg', '保存', '', 'btn btn-primary'); }
  function renderTargetRows(kind, title, columns) {
    var values = state.form[kind];
    return '<div class="qrs-target-block"><div class="qrs-section-title"><h3>' + title + '</h3>' + button('add-target', 'bi-plus-lg', '添加' + (kind === 'emails' ? '邮箱' : kind === 'groups' ? '群' : '人员'), 'data-kind="' + kind + '"') + '</div><div class="qrs-target-scroll" data-qrs-target-scroll="' + kind + '" role="region" aria-label="' + title + '列表"><table class="ds-table qrs-target-table"><thead><tr><th>' + columns[0] + '</th><th>' + columns[1] + '</th><th>操作</th></tr></thead><tbody>' +
      (values.length ? values.map(function (item, index) {
        return '<tr><td><input type="text" maxlength="60" data-qrs-target="name" data-kind="' + kind + '" data-index="' + index + '" value="' + esc(item.name) + '" placeholder="请输入' + columns[0] + '" aria-label="' + columns[0] + '"></td><td><input type="' + (kind === 'emails' ? 'email' : 'text') + '" maxlength="120" data-qrs-target="address" data-kind="' + kind + '" data-index="' + index + '" value="' + esc(item.address) + '" placeholder="请输入' + columns[1] + '" aria-label="' + columns[1] + '"></td><td>' + button('remove-target', 'bi-trash3', '移除', 'data-kind="' + kind + '" data-index="' + index + '"', 'qrs-link qrs-danger') + '</td></tr>';
      }).join('') : '<tr><td colspan="3"><div class="qrs-empty-small">暂未添加' + title + '</div></td></tr>') + '</tbody></table></div></div>';
  }
  function channelSummary(draft, channel) {
    function filled(kind) { return draft[kind].filter(function (item) { return item.name.trim() && item.address.trim(); }).length; }
    return channel === 'email' ? draft.departmentIds.length + ' 个部门 · ' + draft.userIds.length + ' 名用户 · ' + filled('emails') + ' 个邮箱' : filled('groups') + ' 个群 · ' + filled('people') + ' 名人员';
  }
  function syncChannelSummaries() {
    if (!state.form || !isVisible()) return;
    pageEl.querySelectorAll('[data-qrs-channel-summary]').forEach(function (el) {
      var channel = el.dataset.qrsChannelSummary;
      el.textContent = state.form.channels.indexOf(channel) >= 0 ? channelSummary(state.form, channel) : '未启用';
    });
  }
  function renderFormError() { return state.error ? '<div class="qrs-form-error" role="alert">' + esc(state.error) + '</div>' : ''; }
  function renderDeliveryConfig() {
    var f = state.form;
    var columns = channels.map(function (c) {
      var enabled = f.channels.indexOf(c.id) >= 0;
      var content = enabled ? (c.id === 'email' ? renderSelectedTargets() + renderTargetRows('emails', '其他邮箱', ['姓名', '邮箱']) : renderTargetRows('groups', '润工作群', ['名称', '群 ID']) + renderTargetRows('people', '润工作人员', ['名称', '人员 ID'])) : '<div class="qrs-channel-empty"><i class="bi ' + c.icon + '"></i><span>' + c.name + '未启用</span></div>';
      return '<section class="qrs-channel-column' + (enabled ? ' is-enabled' : '') + '" data-qrs-channel-column="' + c.id + '" aria-labelledby="qrsChannelTitle-' + c.id + '"><div class="qrs-channel-card"><div class="qrs-channel-heading"><i class="bi ' + c.icon + '"></i><div><h4 id="qrsChannelTitle-' + c.id + '">' + c.name + '</h4><small data-qrs-channel-summary="' + c.id + '">' + (enabled ? channelSummary(f, c.id) : '未启用') + '</small></div></div><label class="qrs-channel-enable"><input type="checkbox" data-qrs-channel="' + c.id + '" aria-label="启用' + c.name + '"' + (enabled ? ' checked' : '') + '><span>' + (enabled ? '已启用' : '启用') + '</span></label></div><div class="qrs-channel-panel">' + content + '</div></section>';
    }).join('');
    return '<section class="qrs-section qrs-delivery-config"><div class="qrs-section-title"><h3><i class="bi bi-send"></i>发送配置</h3><span class="qrs-hint">可同时启用邮件和润工作</span></div>' + (state.errorChannel ? renderFormError() : '') + '<div class="qrs-channel-columns">' + columns + '</div></section>';
  }
  function renderForm() {
    var f = state.form;
    return '<div class="qrs-form-head"><h2>' + (f.id ? '编辑发送规则' : '新增发送规则') + '</h2></div><div class="qrs-form-scroll">' +
      '<section class="qrs-section qrs-basic-info"><div class="qrs-section-title"><h3><i class="bi bi-card-text"></i>基本信息</h3></div><div class="qrs-form-grid"><label class="qrs-field"><span><em>*</em>规则名称</span><input type="text" data-qrs-form-name maxlength="60" value="' + esc(f.name) + '" placeholder="请输入发送规则名称"></label><div class="qrs-field"><span>发送时机</span><div class="qrs-trigger-note"><i class="bi bi-lightning-charge"></i>所选报告每次生成成功后自动发送</div></div><div class="qrs-field qrs-wide"><span><em>*</em>稽查报告</span><div class="qrs-report-field"><div class="qrs-report-toolbar">' + renderCombo('form') + '<span class="qrs-hint">' + (f.reportIds.length ? '已选 ' + f.reportIds.length + ' 份报告' : '支持选择多份稽查报告') + '</span></div>' + renderSelectedReports() + '</div></div></div>' + (!state.errorChannel ? renderFormError() : '') + '</section>' + renderDeliveryConfig() + '</div><div class="qrs-form-footer">' + formActions() + '</div>';
  }
  function pickerMatches(dept, inherited) {
    if (inherited || matches(dept.name, state.picker.keyword)) return true;
    return (state.picker.mode === 'user' && deptUsers(dept.id).some(function (u) { return matches(u.name + ' ' + u.email, state.picker.keyword); })) ||
      departments.filter(function (d) { return d.parent === dept.id; }).some(function (d) { return pickerMatches(d, false); });
  }
  function renderOrgTree(parent, depth, inherited) {
    var p = state.picker;
    if (!parent) return renderOrgTree('org', depth, inherited);
    return departments.filter(function (d) { return d.parent === parent && pickerMatches(d, inherited); }).map(function (dept) {
      var all = deptUsers(dept.id);
      var selectedCount = all.filter(function (u) { return p.users[u.id]; }).length;
      var checked = all.length > 0 && selectedCount === all.length;
      var partial = selectedCount > 0 && selectedCount < all.length;
      var checkbox = p.mode === 'dept' ? '<input type="checkbox" data-qrs-picker-dept="' + dept.id + '"' + (p.departments[dept.id] ? ' checked' : '') + '>' : '<input type="checkbox" data-qrs-picker-group="' + dept.id + '" data-partial="' + partial + '" aria-checked="' + (partial ? 'mixed' : checked) + '" aria-label="选择' + esc(dept.name) + '及下级部门全部用户"' + (checked ? ' checked' : '') + (!all.length ? ' disabled' : '') + '>';
      var hasChildren = departments.some(function (d) { return d.parent === dept.id; }) || (p.mode === 'user' && users.some(function (u) { return u.dept === dept.id; }));
      var opened = !!p.keyword || p.open[dept.id] === true || (depth < 1 && p.open[dept.id] !== false);
      var directMatch = inherited || matches(dept.name, p.keyword);
      var children = opened ? renderOrgTree(dept.id, depth + 1, directMatch) : '';
      var userRows = opened && p.mode === 'user' ? users.filter(function (u) { return u.dept === dept.id && (directMatch || matches(u.name + ' ' + u.email, p.keyword)); }).map(function (u) {
        return '<label class="qrs-tree-user" style="--depth:' + (depth + 1) + '"><span class="qrs-tree-spacer"></span><input type="checkbox" data-qrs-picker-user="' + u.id + '"' + (p.users[u.id] ? ' checked' : '') + '><i class="bi bi-person"></i><span title="' + esc(u.email) + '">' + esc(u.name) + '<small>' + esc(u.email) + '</small></span></label>';
      }).join('') : '';
      return '<div class="qrs-tree-row" style="--depth:' + depth + '">' + (hasChildren ? button('toggle-dept', opened ? 'bi-chevron-down' : 'bi-chevron-right', opened ? '收起' : '展开', 'data-id="' + dept.id + '" data-open="' + opened + '" aria-expanded="' + opened + '" aria-label="' + (opened ? '收起' : '展开') + esc(dept.name) + '"', 'qrs-tree-toggle') : '<span class="qrs-tree-spacer"></span>') + '<label>' + checkbox + '<i class="bi bi-folder-fill"></i><span title="' + esc(deptPath(dept.id)) + '">' + esc(dept.name) + '</span></label><small>' + all.length + ' 人</small></div>' + children + userRows;
    }).join('');
  }
  function pickerSelectedRows() {
    var p = state.picker;
    var deptMode = p.mode === 'dept';
    var items = deptMode ? departments : users;
    var chosen = deptMode ? p.departments : p.users;
    return items.filter(function (item) { return chosen[item.id] && matches(item.name + ' ' + (deptMode ? deptPath(item.id) : item.email + ' ' + deptName(item.dept)), p.selectedKeyword); }).map(function (item) {
      return '<div class="qrs-picker-person"><i class="bi ' + (deptMode ? 'bi-diagram-3' : 'bi-person') + '"></i><span>' + esc(item.name) + '<small>' + esc(deptMode ? deptPath(item.id) : deptName(item.dept) + ' · ' + item.email) + '</small></span>' + button('picker-remove', 'bi-x', '移除', 'data-id="' + item.id + '"', 'qrs-link') + '</div>';
    }).join('') || '<div class="qrs-empty-small">' + (p.selectedKeyword ? '没有匹配的已选项' : '请从左侧选择' + (deptMode ? '部门' : '用户')) + '</div>';
  }
  function pickedCount(map) { return Object.keys(map).filter(function (id) { return map[id]; }).length; }
  function openPicker() {
    var deptMap = {}, userMap = {};
    state.form.departmentIds.forEach(function (id) { deptMap[id] = true; });
    state.form.userIds.forEach(function (id) { userMap[id] = true; });
    state.picker = { mode: 'dept', keyword: '', selectedKeyword: '', departments: deptMap, users: userMap, open: {} };
    state.combo = ''; render();
    var search = pageEl && pageEl.querySelector('[data-qrs-picker-search]'); if (search) search.focus();
  }
  function savePicker() {
    state.form.departmentIds = departments.filter(function (d) { return state.picker.departments[d.id]; }).map(function (d) { return d.id; });
    state.form.userIds = users.filter(function (u) { return state.picker.users[u.id]; }).map(function (u) { return u.id; });
    state.picker = null; render();
  }
  function renderPicker() {
    var p = state.picker;
    var deptMode = p.mode === 'dept';
    var count = pickedCount(deptMode ? p.departments : p.users);
    var label = deptMode ? '部门' : '用户';
    return '<div class="qrs-modal-mask"><section class="qrs-modal qrs-picker" role="dialog" aria-modal="true" aria-labelledby="qrsPickerTitle"><header><h2 id="qrsPickerTitle">选择邮件接收对象</h2>' + button('picker-cancel', 'bi-x-lg', '关闭') + '</header><div class="qrs-picker-tabs">' + ['dept', 'user'].map(function (mode) {
      return button('picker-mode', mode === 'dept' ? 'bi-diagram-3' : 'bi-people', (mode === 'dept' ? '按部门' : '按用户') + '（' + pickedCount(mode === 'dept' ? p.departments : p.users) + '）', 'data-mode="' + mode + '" aria-pressed="' + (p.mode === mode) + '"', 'btn btn-outline' + (p.mode === mode ? ' active' : ''));
    }).join('') + '</div><div class="qrs-picker-columns"><div class="qrs-picker-panel"><div class="qrs-picker-label"><span><i class="bi bi-diagram-3"></i>组织架构</span></div><div class="qrs-picker-search"><i class="bi bi-search"></i><input type="search" data-qrs-picker-search value="' + esc(p.keyword) + '" placeholder="' + (deptMode ? '搜索部门名称' : '搜索部门、姓名或邮箱') + '" aria-label="搜索' + label + '"></div><div class="qrs-picker-tree">' + (renderOrgTree('', 0, false) || '<div class="qrs-empty-small">未找到匹配的' + label + '</div>') + '</div></div>' +
      '<div class="qrs-picker-panel"><div class="qrs-picker-label"><span>已选' + label + ' <b>' + count + '</b></span>' + button('picker-clear', 'bi-trash3', '清空', count ? '' : 'disabled', 'qrs-link') + '</div><div class="qrs-picker-search"><i class="bi bi-search"></i><input type="search" data-qrs-selected-search value="' + esc(p.selectedKeyword) + '" placeholder="搜索已选' + label + '" aria-label="搜索已选' + label + '"></div><div class="qrs-picker-selected">' + pickerSelectedRows() + '</div></div></div><footer><span class="qrs-picker-total">已选择 ' + pickedCount(p.departments) + ' 个部门、' + pickedCount(p.users) + ' 名用户</span>' + button('picker-cancel', 'bi-x-lg', '取消') + button('picker-save', 'bi-check-lg', '确定选择', '', 'btn btn-primary') + '</footer></section></div>';
  }
  function renderLog() {
    var record = findRecord(state.logId);
    if (!record) return '';
    var content = '<div class="qrs-log-toolbar"><span>日志内容</span>' + button('copy-log', 'bi-clipboard', '复制日志', 'title="复制日志" aria-label="复制日志"', 'qrs-log-copy') + '</div><div class="qrs-technical-log" role="region" aria-label="本次发送日志" tabindex="0">' + record.logs.map(function (line) {
      return '<div class="qrs-log-line ' + (line.level === 'ERROR' ? 'is-error' : line.level === 'WARN' ? 'is-warning' : '') + '"><span class="qrs-log-time">' + esc(line.time) + '</span><b>' + esc(line.level) + '</b><pre>[' + esc(line.stage) + '] ' + esc(line.message) + '</pre></div>';
    }).join('') + '</div>';
    return '<div class="qrs-modal-mask"><section class="qrs-modal qrs-log-modal" role="dialog" aria-modal="true" aria-labelledby="qrsLogTitle"><header><h2 id="qrsLogTitle">发送日志</h2>' + button('close-log', 'bi-x-lg', '关闭') + '</header><div class="qrs-log-summary"><strong>' + esc(record.reportName) + '</strong><div class="qrs-log-metadata"><span>接收对象：' + esc(record.recipient.name) + '（' + esc(record.recipient.address) + '）</span><span>发送渠道：' + channelName(record.channel) + '</span><span>发送时间：' + esc(record.sentAt) + '</span><span>结束时间：' + esc(record.finishedAt || '发送中') + '</span><span>请求流水号：' + esc(record.requestId) + '</span><span>耗时：' + (record.durationMs ? record.durationMs + ' ms' : '—') + '</span></div><div>' + statusBadge(record.status) + (record.errorCode ? '<code>' + esc(record.errorCode) + '</code>' : '') + '</div></div><div class="qrs-modal-scroll">' + content + '</div><footer>' + button('close-log', 'bi-x-lg', '关闭') + '</footer></section></div>';
  }
  function logText(record) {
    return ['发送日志', '报告：' + record.reportName, '接收对象：' + record.recipient.name + '（' + record.recipient.address + '）', '发送渠道：' + channelName(record.channel), '发送时间：' + record.sentAt, '结束时间：' + (record.finishedAt || '发送中'), '请求流水号：' + record.requestId, '状态：' + record.status, '耗时：' + (record.durationMs ? record.durationMs + ' ms' : '—'), '错误码：' + (record.errorCode || '—'), '', record.logs.map(function (line) {
      return line.time + ' ' + line.level + ' [' + line.stage + '] ' + line.message;
    }).join('\n')].join('\n');
  }
  function copyLog() {
    var record = findRecord(state.logId);
    if (!record) return Promise.resolve(false);
    var text = logText(record);
    function fallback() {
      var input = document.createElement('textarea');
      var previous = document.activeElement;
      input.value = text; input.setAttribute('readonly', ''); input.setAttribute('aria-label', '待复制日志');
      input.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0';
      document.body.appendChild(input);
      try { input.focus(); input.select(); return !!document.execCommand('copy'); }
      catch (error) { return false; }
      finally { input.remove(); if (previous && previous.focus) previous.focus(); }
    }
    function feedback(ok) { toast(ok ? '已复制' : '复制失败，请选中日志后手动复制'); return ok; }
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(text).then(function () { return feedback(true); }).catch(function () { return feedback(fallback()); });
    } catch (error) { /* 使用兼容方式复制本次日志。 */ }
    return Promise.resolve(feedback(fallback()));
  }
  function render() {
    if (!isVisible()) return;
    var active = document.activeElement;
    var focusAttr = active && pageEl.contains(active) ? ['data-qrs-form-name', 'data-qrs-picker-search', 'data-qrs-selected-search', 'data-qrs-combo-search', 'data-qrs-target', 'data-qrs-filter', 'data-qrs-picker-user', 'data-qrs-picker-dept', 'data-qrs-picker-group', 'data-qrs-report-select', 'data-qrs-channel'].filter(function (attr) { return active.hasAttribute(attr); })[0] : '';
    var caret = focusAttr ? active.selectionStart : null;
    var focusSelector = focusAttr ? '[' + focusAttr + '="' + active.getAttribute(focusAttr) + '"]' : '';
    if (focusAttr === 'data-qrs-target') focusSelector += '[data-kind="' + active.dataset.kind + '"][data-index="' + active.dataset.index + '"]';
    var scroll = pageEl.querySelector('.qrs-form-scroll');
    var scrollTop = scroll ? scroll.scrollTop : 0;
    var pickerScrolls = {};
    ['.qrs-picker-tree', '.qrs-picker-selected', '.qrs-combo-options', '.qrs-selected-reports', '.qrs-user-chips', '.qrs-technical-log', '[data-qrs-target-scroll="emails"]', '[data-qrs-target-scroll="groups"]', '[data-qrs-target-scroll="people"]'].forEach(function (selector) { var area = pageEl.querySelector(selector); if (area) pickerScrolls[selector] = area.scrollTop; });
    pageEl.innerHTML = (state.form ? renderForm() : renderList()) + (state.picker ? renderPicker() : '') + (state.logId ? renderLog() : '');
    fitSelectedTargets();
    fitTargetTables();
    var newScroll = pageEl.querySelector('.qrs-form-scroll');
    if (newScroll) newScroll.scrollTop = scrollTop;
    if (focusAttr) {
      var input = pageEl.querySelector(focusSelector);
      if (input) { input.focus(); if (caret != null && /^(text|search)$/.test(input.type)) input.setSelectionRange(caret, caret); }
    }
    Object.keys(pickerScrolls).forEach(function (selector) { var area = pageEl.querySelector(selector); if (area) area.scrollTop = pickerScrolls[selector]; });
    syncChecks();
  }
  function syncChecks() {
    if (!isVisible()) return;
    pageEl.querySelectorAll('[data-partial]').forEach(function (el) { el.indeterminate = el.dataset.partial === 'true'; });
    var all = pageEl.querySelector('[data-qrs-select-all]');
    if (all) {
      var rows = pageRows().filter(canRetry);
      var count = rows.filter(function (r) { return state.selected[r.id]; }).length;
      all.disabled = !rows.length; all.checked = !!rows.length && count === rows.length; all.indeterminate = count > 0 && count < rows.length;
    }
    var retry = pageEl.querySelector('[data-qrs-action="batch-retry"]');
    if (retry) retry.disabled = !selectedFailed().length;
    var countEl = pageEl.querySelector('[data-qrs-count]');
    if (countEl) countEl.textContent = '已选择 ' + selectedFailed().length + ' 条失败记录';
  }
  function validateRule(draft) {
    if (!draft.name.trim()) return '请输入规则名称';
    if (!draft.reportIds.length || draft.reportIds.some(function (id) { return !findReport(id); })) return '请至少选择一份有效的稽查报告';
    if (!draft.channels.length) return '请至少选择一个发送渠道';
    if (store.rules.some(function (r) { return r.id !== draft.id && r.name.trim() === draft.name.trim(); })) return '规则名称已存在，请修改';
    for (var c = 0; c < draft.channels.length; c++) {
      var error = validateChannel(draft, draft.channels[c]);
      if (error) return error;
    }
    return '';
  }
  function validateChannel(draft, channel) {
    var kinds = channel === 'email' ? ['emails'] : ['groups', 'people'];
    for (var k = 0; k < kinds.length; k++) {
      var kind = kinds[k];
      var rows = draft[kind];
      var seen = Object.create(null);
      for (var n = 0; n < rows.length; n++) {
        var item = rows[n];
        var title = kind === 'emails' ? '其他邮箱' : kind === 'groups' ? '润工作群' : '润工作人员';
        if (!item.name.trim() || !item.address.trim()) return title + '第 ' + (n + 1) + ' 行：请填写完整的姓名/名称和邮箱/ID';
        if (kind === 'emails' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(item.address.trim())) return '其他邮箱第 ' + (n + 1) + ' 行：邮箱格式不正确';
        if (kind !== 'emails' && /\s/.test(item.address.trim())) return title + ' ID 不能包含空格';
        var key = kind === 'emails' ? item.address.trim().toLowerCase() : item.address.trim();
        if (seen[key]) return title + '存在重复的邮箱/ID，请移除重复项';
        seen[key] = true;
      }
    }
    if (channel === 'email' && draft.departmentIds.length) return draft.departmentIds.some(function (id) { return !deptName(id); }) ? '所选部门已不可用，请重新选择' : '';
    if (!recipientList(draft, channel).length) return '请为' + channelName(channel) + '配置至少一个接收对象';
    return '';
  }
  function saveRule() {
    state.error = validateRule(state.form);
    state.errorChannel = '';
    if (state.error) {
      state.errorChannel = state.form.channels.filter(function (channel) { return validateChannel(state.form, channel) === state.error; })[0] || '';
      render();
      var node = pageEl && pageEl.querySelector('.qrs-form-error');
      if (node) node.scrollIntoView({ block: 'center' });
      return;
    }
    var rule = copy(state.form);
    rule.name = rule.name.trim(); rule.reportIds = unique(rule.reportIds); rule.departmentIds = unique(rule.departmentIds); rule.userIds = unique(rule.userIds); rule.updatedAt = now();
    ['emails', 'groups', 'people'].forEach(function (kind) { rule[kind] = rule[kind].map(function (r) { return { name: r.name.trim(), address: r.address.trim() }; }); });
    var index = store.rules.findIndex(function (r) { return r.id === rule.id; });
    if (index >= 0) store.rules[index] = rule;
    else { rule.id = uid('rule'); store.rules.unshift(rule); }
    persist(); state.form = null; state.combo = ''; state.error = ''; state.tab = 'rules'; state.pages.rules = 1;
    state.filters.rules = { keyword: '', channel: '', reportId: '' };
    state.queryDrafts.rules = copy(state.filters.rules);
    render(); toast('规则已保存，将在报告下次生成成功后自动发送');
  }
  function deliver(record) {
    if (deliveryTimers[record.id] || record.status !== 'pending') return;
    record.status = 'sending'; record.sentAt = now();
    startLog(record);
    persist();
    deliveryTimers[record.id] = window.setTimeout(function () {
      delete deliveryTimers[record.id];
      record.durationMs = 1400;
      completeLog(record, false);
      persist(); render();
      if (isVisible()) toast(record.recipient.name + '：' + (record.retryOf ? '重新发送成功' : '发送成功'));
    }, 1400);
  }
  function retryRecords(ids) {
    var records = unique(ids).map(findRecord).filter(canRetry);
    if (!records.length) { toast('请选择发送失败的记录'); return; }
    DP.confirm('确认重新发送 ' + records.length + ' 条失败记录？将向原接收对象发送相同报告，并新增本次发送记录。', {
      icon: 'info', okText: '确认重发',
      onOk: function () {
        records.forEach(function (r) {
          if (!canRetry(r)) return;
          var record = makeRecord({ id: r.ruleId, name: r.ruleName }, { id: r.reportId, name: r.reportName, generatedTime: r.generatedTime }, r.channel, r.recipient, now(), r.batch, r);
          r.retryId = record.id; delete state.selected[r.id];
          store.records.unshift(record); deliver(record);
        });
        persist(); state.pages.records = 1; render();
      }
    });
  }
  function onReportGenerated(report) {
    ensureStore();
    if (!report || !findReport(report.id) || !report.generatedTime || !report.generationId) return;
    var key = report.id + '|' + report.generationId;
    if (store.processed.indexOf(key) >= 0) return;
    store.processed.push(key);
    store.rules.filter(function (r) { return r.reportIds.indexOf(report.id) >= 0; }).forEach(function (rule) {
      rule.channels.forEach(function (channel) {
        recipientList(rule, channel).forEach(function (recipient) {
          var record = makeRecord(rule, report, channel, recipient, now(), report.generationId);
          store.records.unshift(record); deliver(record);
        });
      });
    });
    persist(); render();
  }
  function showReport(id) {
    var record = findRecord(id);
    if (!record) return;
    var opened = DP.pages.qualityInspectReport.openFromDelivery(record, function () {
      DP.contentArea.innerHTML = DP.pages.qualityReportSend.html;
      init();
    });
    if (!opened) toast('该稽查报告已不可用');
  }
  function cancelForm() {
    state.form = null; state.error = ''; state.picker = null; state.combo = ''; render();
  }
  function bindEvents() {
    pageEl.addEventListener('click', function (event) {
      var el = event.target.closest('[data-qrs-action]');
      if (!el || !pageEl.contains(el) || el.disabled) {
        if (state.combo && !event.target.closest('.qrs-combo')) { state.combo = ''; render(); }
        return;
      }
      var action = el.dataset.qrsAction;
      var id = el.dataset.id;
      if (action === 'tab') { state.tab = el.dataset.tab; state.selected = {}; state.combo = ''; state.queryError = ''; render(); }
      else if (action === 'query') query();
      else if (action === 'reset') {
        state.filters[state.tab] = state.tab === 'records' ? { keyword: '', recipient: '', channel: '', status: '', start: '', end: '' } : { keyword: '', channel: '', reportId: '' };
        state.queryDrafts[state.tab] = copy(state.filters[state.tab]);
        state.pages[state.tab] = 1; state.selected = {}; state.queryError = ''; state.combo = ''; render();
      } else if (action === 'page') { state.pages[state.tab] = Number(el.dataset.page); state.selected = {}; render(); }
      else if (action === 'new' || action === 'edit') {
        var source = action === 'edit' ? store.rules.filter(function (r) { return r.id === id; })[0] : newDraft();
        if (!source) return;
        state.form = copy(source); state.reportsExpanded = false; state.error = ''; state.errorChannel = ''; state.combo = ''; render();
      } else if (action === 'cancel-form') cancelForm();
      else if (action === 'save') saveRule();
      else if (action === 'combo') { state.combo = state.combo === el.dataset.context ? '' : el.dataset.context; state.comboKeyword = ''; render(); var search = pageEl.querySelector('[data-qrs-combo-search]'); if (search) search.focus(); }
      else if (action === 'choose-report') {
        state.combo = ''; state.comboKeyword = '';
        state.queryDrafts.rules.reportId = id || ''; query();
      } else if (action === 'reports-clear') { state.form.reportIds = []; state.reportsExpanded = false; render(); }
      else if (action === 'reports-done') { state.combo = ''; render(); }
      else if (action === 'reports-expand') { state.reportsExpanded = !state.reportsExpanded; render(); }
      else if (action === 'report-remove') { state.form.reportIds = state.form.reportIds.filter(function (value) { return value !== id; }); render(); }
      else if (action === 'add-target') {
        state.form[el.dataset.kind].push({ name: '', address: '' }); render();
        var targetList = pageEl.querySelector('[data-qrs-target-scroll="' + el.dataset.kind + '"]');
        if (targetList) targetList.scrollTop = targetList.scrollHeight;
        var fields = pageEl.querySelectorAll('[data-qrs-target="name"][data-kind="' + el.dataset.kind + '"]');
        if (fields.length) fields[fields.length - 1].focus();
      }
      else if (action === 'remove-target') { state.form[el.dataset.kind].splice(Number(el.dataset.index), 1); render(); }
      else if (action === 'remove-user') { state.form.userIds = state.form.userIds.filter(function (v) { return v !== id; }); render(); }
      else if (action === 'remove-department') { state.form.departmentIds = state.form.departmentIds.filter(function (v) { return v !== id; }); render(); }
      else if (action === 'pick-users') openPicker();
      else if (action === 'picker-cancel') { state.picker = null; render(); }
      else if (action === 'picker-save') savePicker();
      else if (action === 'picker-mode') { state.picker.mode = el.dataset.mode; state.picker.keyword = ''; state.picker.selectedKeyword = ''; render(); }
      else if (action === 'toggle-dept') { state.picker.open[id] = el.dataset.open !== 'true'; render(); }
      else if (action === 'picker-remove') { delete (state.picker.mode === 'dept' ? state.picker.departments : state.picker.users)[id]; render(); }
      else if (action === 'picker-clear') { if (state.picker.mode === 'dept') state.picker.departments = {}; else state.picker.users = {}; render(); }
      else if (action === 'retry') retryRecords([id]);
      else if (action === 'batch-retry') retryRecords(selectedFailed().map(function (r) { return r.id; }));
      else if (action === 'view') showReport(id);
      else if (action === 'logs') { state.logId = id; state.combo = ''; render(); pageEl.querySelector('[data-qrs-action="close-log"]').focus(); }
      else if (action === 'copy-log') copyLog();
      else if (action === 'close-log') { state.logId = ''; render(); }
    });
    pageEl.addEventListener('input', function (event) {
      var el = event.target;
      if (el.hasAttribute('data-qrs-filter')) state.queryDrafts[state.tab][el.dataset.qrsFilter] = el.value;
      else if (el.hasAttribute('data-qrs-form-name')) state.form.name = el.value;
      else if (el.hasAttribute('data-qrs-target')) { state.form[el.dataset.kind][Number(el.dataset.index)][el.dataset.qrsTarget] = el.value; syncChannelSummaries(); }
      else if (el.hasAttribute('data-qrs-picker-search')) { state.picker.keyword = el.value; var tree = pageEl.querySelector('.qrs-picker-tree'); tree.innerHTML = renderOrgTree('', 0, false) || '<div class="qrs-empty-small">未找到匹配的部门或用户</div>'; syncChecks(); }
      else if (el.hasAttribute('data-qrs-selected-search')) { state.picker.selectedKeyword = el.value; pageEl.querySelector('.qrs-picker-selected').innerHTML = pickerSelectedRows(); }
      else if (el.hasAttribute('data-qrs-combo-search')) { state.comboKeyword = el.value; pageEl.querySelector('.qrs-combo-options').innerHTML = renderComboOptions(state.combo); }
    });
    pageEl.addEventListener('change', function (event) {
      var el = event.target;
      if (el.hasAttribute('data-qrs-filter') && el.type !== 'search') query();
      else if (el.hasAttribute('data-qrs-size')) { state.sizes[state.tab] = Number(el.value); state.pages[state.tab] = 1; state.selected = {}; render(); }
      else if (el.hasAttribute('data-qrs-select')) { state.selected[el.dataset.qrsSelect] = el.checked; syncChecks(); }
      else if (el.hasAttribute('data-qrs-select-all')) { pageRows().filter(canRetry).forEach(function (r) { state.selected[r.id] = el.checked; }); pageEl.querySelectorAll('[data-qrs-select]:not(:disabled)').forEach(function (checkbox) { checkbox.checked = el.checked; }); syncChecks(); }
      else if (el.hasAttribute('data-qrs-channel')) {
        if (el.checked) state.form.channels = unique(state.form.channels.concat(el.dataset.qrsChannel));
        else state.form.channels = state.form.channels.filter(function (c) { return c !== el.dataset.qrsChannel; });
        if (state.errorChannel === el.dataset.qrsChannel) { state.error = ''; state.errorChannel = ''; }
        state.combo = ''; render();
      }
      else if (el.hasAttribute('data-qrs-picker-user')) { state.picker.users[el.dataset.qrsPickerUser] = el.checked; render(); }
      else if (el.hasAttribute('data-qrs-picker-group') && state.picker.mode === 'user') {
        deptUsers(el.dataset.qrsPickerGroup).forEach(function (u) { if (el.checked) state.picker.users[u.id] = true; else delete state.picker.users[u.id]; });
        render();
      }
      else if (el.hasAttribute('data-qrs-picker-dept')) { state.picker.departments[el.dataset.qrsPickerDept] = el.checked; render(); }
      else if (el.hasAttribute('data-qrs-report-select')) { var reportId = el.dataset.qrsReportSelect; state.form.reportIds = el.checked ? unique(state.form.reportIds.concat(reportId)) : state.form.reportIds.filter(function (id) { return id !== reportId; }); render(); }
    });
    pageEl.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' && event.target.hasAttribute('data-qrs-filter')) { event.preventDefault(); query(); }
      if (event.key === 'Escape') {
        if (state.picker) { state.picker = null; render(); }
        else if (state.logId) { state.logId = ''; render(); }
        else if (state.combo) { state.combo = ''; render(); }
      }
      if (event.key === 'Tab') {
        var modal = pageEl.querySelector('.qrs-modal');
        if (!modal) return;
        var focusable = Array.from(modal.querySelectorAll('button:not(:disabled), input:not(:disabled), select:not(:disabled), [tabindex="0"]'));
        var first = focusable[0], last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    });
  }
  function init() {
    ensureStore();
    pageEl = document.querySelector('.page-quality-report-send');
    if (!pageEl) return;
    bindEvents(); render();
  }
  window.addEventListener('resize', fitSelectedTargets);
  window.addEventListener('resize', fitTargetTables);
  return { html: '<div class="page-quality-report-send"></div>', init: init, onReportGenerated: onReportGenerated };
})();
