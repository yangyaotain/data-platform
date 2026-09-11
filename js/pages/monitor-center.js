/** 运维监控 / 监控中心。参考系统的告警列表及关联任务视图；数据仅在本地演示。 */
window.DP = window.DP || {};
DP.pages = DP.pages || {};
DP.pages.monitorCenter = (function () {
  'use strict';
  var root, model, state, lastFocus, notificationMode = false;
  var levels = ['轻微', '重要', '严重', '紧急'];
  var methods = ['调度执行', '测试执行', '接口执行', '数据重跑', '数据补录', '触发执行', '批量执行', '执行一次'];
  var statuses = ['执行中', '执行成功', '执行失败', '取消'];
  var channels = ['邮箱', '钉钉', '短信', '润工作(飞书)'];
  var tabs = [['history', 'clock-history', '历史记录'], ['topology', 'diagram-3', '流程拓扑图'], ['dependency', 'bezier2', '任务依赖'], ['monitor', 'display', '监控记录'], ['notification', 'bell', '通知记录']];
  function esc(value) { return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function pad(value) { return String(value).padStart(2, '0'); }
  function stamp(value) { var d = new Date(value); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds()); }
  function milliseconds(value) { return new Date(value.replace(' ', 'T')).getTime(); }
  function duration(seconds) { return seconds == null ? '—' : (seconds >= 60 ? Math.floor(seconds / 60) + '分钟' : '') + seconds % 60 + '秒'; }
  function taskById(id) { return model.tasks.find(function (task) { return task.id === id; }); }
  function currentTask() { return taskById(state.taskId); }
  function button(action, icon, label, extra, cls) { return '<button type="button" class="' + (cls || 'btn btn-outline') + '" data-mc-action="' + action + '" ' + (extra || '') + '><i class="bi bi-' + icon + '" aria-hidden="true"></i><span>' + label + '</span></button>'; }
  function badge(level) { return '<span class="tag tag-' + (level === '轻微' ? 'blue' : level === '重要' ? 'yellow' : 'red') + '">' + esc(level) + '</span>'; }
  function statusBadge(status) { return '<span class="mc-status ' + (status === '执行失败' || status === '发送失败' ? 'is-failed' : status === '执行成功' || status === '发送成功' ? 'is-success' : status === '执行中' ? 'is-running' : '') + '"><i class="bi bi-' + (status.indexOf('失败') >= 0 ? 'x-circle' : status.indexOf('成功') >= 0 ? 'check-circle' : status === '执行中' ? 'arrow-repeat' : 'dash-circle') + '" aria-hidden="true"></i>' + esc(status) + '</span>'; }
  function range(days) {
    var end = new Date(), start = new Date(end);
    start.setDate(start.getDate() - days + 1);
    return { from: stamp(start).slice(0, 10) + ' 00:00:00', to: stamp(end).slice(0, 10) + ' 23:59:59' };
  }
  function viewState() { return { filters: Object.assign({ level: '', projects: [], environment: '', keyword: '', method: '', status: '', channel: '', min: '', max: '' }, range(1)), keywordDraft: null, preset: 1, page: 1, size: 10, sort: '', direction: -1 }; }
  function view() { return state.taskId ? state.detail : state.list; }
  function seed() {
    var anchor = Date.now() - 300000;
    var ids = ['code-batch-prod-sql', 'code-batch-test-sql', 'code-warehouse-prod-python', 'code-warehouse-dev-shell', 'code-stream-prod-flinksql', 'code-batch-dev-sql'];
    var topics = ['订单明细入仓', '会员主数据校验', '交易日汇总', '供应链数据归档', '库存实时同步', '订单增量采集'];
    var tasks = ids.map(function (id, i) {
      var record = DP.developmentCodeRecords.find(function (item) { return item.id === id; });
      return { id: 'MCT' + (i + 1), recordId: id, project: record.project, environment: record.environment + '环境', name: record.businessFlow,
        node: record.subflow, topic: topics[i], version: record.version, owner: record.owner, type: i === 4 ? '流式处理' : '批量处理',
        created: '2026-08-01 09:00:00', updated: record.updatedAt + ':00', schedule: i === 4 ? '持续运行' : '每天 02:00:00',
        remark: '完成' + topics[i] + '，保障数据资产及时、准确地提供服务。', upstream: topics[(i + 5) % topics.length] + '准备', downstream: topics[i] + '结果发布' };
    });
    var data = { anchor: anchor, tasks: tasks, alerts: [], runs: [], notifications: [], serial: 0 };
    function time(minutes) { return stamp(anchor - minutes * 60000); }
    for (var i = 0; i < 48; i += 1) {
      var task = tasks[i % tasks.length], level = levels[i % levels.length];
      var minutes = i < 16 ? i * 4 : (i - 15) * 1440 + (i % 5) * 17;
      var seconds = [182, 640, 86, 920, 124, 315][i % 6];
      var status = level === '严重' || level === '紧急' ? '执行失败' : '执行成功';
      var reason = status === '执行失败' ? (i % 2 ? '目标库连接超时，请检查数据源连接及网络状态。' : '数据字段类型与目标表不一致，请核对字段映射。') : '';
      var detail = level === '轻微' ? '读取记录数为4200，低于配置阈值5000条' : level === '重要' ? '运行时长为' + seconds + '秒，超过配置阈值300秒' : reason;
      var run = { id: String(26090000 + i), taskId: task.id, method: methods[i % 3], start: stamp(milliseconds(time(minutes)) - seconds * 1000), end: time(minutes), status: status, seconds: seconds, reason: reason };
      data.runs.push(run);
      var alert = { id: 'MCA' + pad(i + 1), taskId: task.id, runId: run.id, level: level, project: task.project, environment: task.environment, flow: task.name, time: run.end,
        unsupported: i === 15, description: '项目流程：' + task.project + '-' + task.name + '-' + task.node + '，在' + task.environment + '，版本号：' + task.version + '。' + task.topic + '：' + detail + '，请及时处理。' };
      if (alert.unsupported) {
        alert.flow = '供应链采集流程';
        alert.description = '项目流程：' + task.project + '-供应链采集流程-供应商基础信息采集，在' + task.environment + '，版本号：' + task.version + '，执行失败：源表字段映射缺失，请核对采集配置。';
      }
      data.alerts.push(alert);
      var deliveries = [{ channel: channels[i % 4], status: i % 9 === 0 ? '发送失败' : '发送成功' }];
      if (i % 3 === 0) deliveries.push({ channel: channels[(i + 1) % 4], status: '发送成功' });
      data.notifications.push(Object.assign({}, alert, { id: 'MCN' + pad(i + 1), time: stamp(milliseconds(run.end) + 4000), channel: channels[i % 4], status: i % 9 === 0 ? '发送失败' : '发送成功', deliveries: deliveries }));
    }
    tasks.forEach(function (task, index) {
      for (var n = 0; n < 24; n += 1) {
        var seconds = 65 + (n * 31 + index * 7) % 260;
        var end = time(n * 1440 + 45 + index * 9), status = n === 5 ? '取消' : '执行成功';
        var running = n === 0 && index === 5;
        data.runs.push({ id: String(26100000 + index * 100 + n), taskId: task.id, method: methods[n % methods.length], start: running ? time(1) : stamp(milliseconds(end) - seconds * 1000), end: running ? '' : end, status: running ? '执行中' : status, seconds: running ? null : seconds, reason: status === '取消' ? '任务已取消。' : '' });
      }
    });
    return data;
  }
  function select(key, label, choices, placeholder, disabled) {
    var filters = view().filters;
    return '<label class="mc-field"><span>' + label + '</span><select class="mc-control" data-mc-filter="' + key + '" aria-label="' + label + '"' + (disabled ? ' disabled' : '') + '><option value="">' + (placeholder || '全部') + '</option>' + choices.map(function (value) { return '<option value="' + esc(value) + '"' + (filters[key] === value ? ' selected' : '') + '>' + esc(value) + '</option>'; }).join('') + '</select></label>';
  }
  function projects() { return Array.from(new Set(model.tasks.map(function (task) { return task.project; }))); }
  function environments() { return Array.from(new Set(model.tasks.filter(function (task) { return state.list.filters.projects.indexOf(task.project) >= 0; }).map(function (task) { return task.environment; }))); }
  function projectPicker() {
    var chosen = state.list.filters.projects;
    return '<div class="mc-field"><span>所属项目</span><details class="mc-project-picker"><summary class="mc-control" aria-label="所属项目，可多选"><span title="' + esc(chosen.join('、')) + '">' + esc(chosen.length ? chosen.length === 1 ? chosen[0] : '已选 ' + chosen.length + ' 个项目' : '请选择项目') + '</span><i class="bi bi-chevron-down" aria-hidden="true"></i></summary><div class="mc-picker-panel"><input type="search" class="mc-control" data-mc-project-search placeholder="搜索项目名称" aria-label="搜索项目名称"><div data-mc-project-options>' + projectOptions('') + '</div></div></details></div>';
  }
  function projectOptions(keyword) {
    var choices = projects().filter(function (value) { return value.toLowerCase().indexOf(keyword.toLowerCase()) >= 0; });
    return button('project-clear', 'x-circle', '清除选择', '', 'mc-option') + choices.map(function (value) { var selected = state.list.filters.projects.indexOf(value) >= 0; return '<label class="mc-option' + (selected ? ' active' : '') + '"><input type="checkbox" data-mc-project="' + esc(value) + '"' + (selected ? ' checked' : '') + '><span>' + esc(value) + '</span></label>'; }).join('') + (choices.length ? '' : '<div class="mc-picker-empty">没有匹配的项目</div>');
  }
  function dateFilters() {
    var current = view();
    if (state.runId) return '<div class="mc-date-row">' + DP.datePicker.render({ mode: 'single', label: '执行日期', value: current.filters.from.slice(0, 10), valueAttrs: { 'data-mc-node-date': '' } }) + '</div>';
    return '<div class="mc-date-row"><div class="mc-presets" role="group" aria-label="时间快捷筛选">' + [1, 7, 30].map(function (days) { return button('preset', 'calendar3', '近' + days + '天', 'data-days="' + days + '" aria-pressed="' + (current.preset === days) + '"', 'btn btn-outline' + (current.preset === days ? ' active' : '')); }).join('') + '</div>' + DP.datePicker.render({ mode: 'range', output: 'datetime', label: '查询日期范围', start: current.filters.from, end: current.filters.to, startAttrs: { 'data-mc-date': 'from' }, endAttrs: { 'data-mc-date': 'to' } }) + '</div>';
  }
  function renderFilters() {
    var filters = view().filters, isList = !state.taskId, isHistory = state.taskId && state.tab === 'history', isNodes = !!state.runId;
    var html = dateFilters() + '<div class="mc-filter-row">';
    if (isHistory && !isNodes) {
      html += select('method', '执行方式', methods, '全部执行方式') + '<div class="mc-field"><span>时长（秒）</span><input type="number" min="0" class="mc-control mc-duration" data-mc-number="min" aria-label="最短时长" value="' + esc(filters.min) + '"><span>至</span><input type="number" min="0" class="mc-control mc-duration" data-mc-number="max" aria-label="最长时长" value="' + esc(filters.max) + '"></div>' + select('status', '状态', statuses, '全部状态');
    } else if (isNodes) html += select('status', '状态', statuses, '全部状态');
    else html += select('level', '等级', levels);
    if (isList) html += projectPicker() + select('environment', '所属环境', environments(), filters.projects.length ? '全部环境' : '请先选择项目', !filters.projects.length);
    if ((isList && notificationMode) || (state.taskId && state.tab === 'notification')) html += select('channel', '通知', channels);
    var placeholder = isNodes ? '版本查询' : isHistory ? '请输入执行ID或故障原因' : isList ? '描述/所属业务流程关键字' : '请输入描述关键词';
    html += '<div class="mc-keyword"><input class="mc-control" type="search" data-mc-keyword aria-label="' + placeholder + '" placeholder="' + placeholder + '" value="' + esc(view().keywordDraft == null ? filters.keyword : view().keywordDraft) + '">' + button('query', 'search', '查询', '', 'btn btn-primary') + '</div>';
    if (isHistory && !isNodes) html += button('rerun-selected', 'arrow-clockwise', '批量重跑', 'data-mc-rerun' + (state.selected.size ? '' : ' disabled'));
    if (isNodes) html += button('back-history', 'arrow-left', '返回');
    root.querySelector('[data-mc-filters]').innerHTML = html + '</div>';
  }
  function filteredRows() {
    var current = view(), f = current.filters, rows;
    if (!state.taskId) rows = notificationMode ? model.notifications : model.alerts;
    else if (state.tab === 'history') rows = state.runId ? nodeRows() : model.runs.filter(function (r) { return r.taskId === state.taskId; });
    else rows = (state.tab === 'notification' ? model.notifications : model.alerts).filter(function (r) { return r.taskId === state.taskId; });
    var keyword = f.keyword.trim().toLowerCase();
    rows = rows.filter(function (row) {
      var time = row.time || row.start;
      return (!f.from || time >= f.from) && (!f.to || time <= f.to) && (!f.projects.length || f.projects.indexOf(row.project) >= 0) && ['level', 'environment', 'method', 'status', 'channel'].every(function (key) {
        return !f[key] || (key === 'channel' && row.deliveries ? row.deliveries.some(function (delivery) { return delivery.channel === f[key]; }) : row[key] === f[key]);
      }) && (f.min === '' || (row.seconds != null && row.seconds >= Number(f.min))) && (f.max === '' || (row.seconds != null && row.seconds <= Number(f.max))) &&
        (!keyword || (state.runId ? row.version : state.taskId && state.tab === 'history' ? row.id + ' ' + row.reason : row.description + ' ' + (row.flow || '')).toLowerCase().indexOf(keyword) >= 0);
    });
    return rows.slice().sort(function (a, b) {
      var key = current.sort || (state.taskId && state.tab === 'history' ? 'start' : 'time'), av = a[key], bv = b[key];
      var diff = typeof av === 'number' && typeof bv === 'number' ? av - bv : String(av || '').localeCompare(String(bv || ''), 'zh-CN', { numeric: true });
      return current.direction * (diff || a.id.localeCompare(b.id));
    });
  }
  function nodeRows() {
    var task = currentTask(), run = model.runs.find(function (r) { return r.id === state.runId; });
    return run ? [Object.assign({}, run, { name: task.node, version: task.version })] : [];
  }
  function columns() {
    if (state.runId) return [['name', '名称', 210], ['version', '版本', 90], ['start', '开始时间', 172], ['end', '结束时间', 172], ['status', '状态', 110], ['seconds', '时长', 115], ['nodeLog', '详情', 90]];
    if (!state.taskId) return [['level', '等级', 80], ['description', '通知描述', 0], ['project', '所属项目', 135], ['environment', '所属环境', 95], ['flow', '所属业务流程', 155]].concat(notificationMode ? [['status', '通知状态', 172]] : [], [['time', notificationMode ? '通知时间' : '告警时间', 175], ['view', '操作', 85]]);
    if (state.tab === 'history') return [['check', '', 40], ['id', '执行ID', 115], ['method', '执行方式', 105], ['start', '开始时间', 170], ['end', '结束时间', 170], ['status', '状态', 115], ['seconds', '时长', 115], ['reason', '故障原因', 0], ['runActions', '操作', 230]];
    if (state.tab === 'notification') return [['level', '等级', 90], ['description', '通知描述', 0], ['status', '通知状态', 190], ['time', '通知时间', 180]];
    return [['level', '等级', 90], ['description', '描述', 0], ['time', '告警时间', 180]];
  }
  function cell(row, col) {
    var key = col[0], value = row[key], id = 'data-id="' + esc(row.id) + '"';
    if (key === 'level') return badge(value);
    if (key === 'status') return row.deliveries ? row.deliveries.map(function (delivery) { return '<div class="mc-delivery"><span>' + esc(delivery.channel) + '</span>' + statusBadge(delivery.status) + '</div>'; }).join('') : statusBadge(value);
    if (key === 'seconds') return duration(value);
    if (key === 'check') return '<input type="checkbox" data-mc-check="' + esc(row.id) + '" aria-label="选择执行记录' + esc(row.id) + '"' + (state.selected.has(row.id) ? ' checked' : '') + (row.status === '执行中' ? ' disabled' : '') + '>';
    if (key === 'view') return button('view', 'eye', '查看', id, 'mc-link');
    if (key === 'nodeLog') return button('node-log', 'file-text', '详情', id, 'mc-link');
    if (key === 'runActions') return '<div class="mc-actions">' + button('run-log', 'journal-text', '查看', id, 'mc-link') + button('supplement', 'file-earmark-plus', '数据补录', id, 'mc-link') + button('rerun', 'arrow-clockwise', '重跑', id + (row.status === '执行中' ? ' disabled' : ''), 'mc-link') + '</div>';
    return '<span class="' + (key === 'description' || key === 'reason' ? 'mc-description' : 'mc-truncate') + '" title="' + esc(value || '—') + '">' + esc(value || '—') + '</span>';
  }
  function renderTable() {
    var current = view(), rows = filteredRows(), cols = columns(), count = Math.max(1, Math.ceil(rows.length / current.size));
    current.page = Math.min(Math.max(1, current.page), count);
    var start = (current.page - 1) * current.size, paged = rows.slice(start, start + current.size);
    root.querySelector('[data-mc-table]').innerHTML = '<div class="mc-table-scroll"><table class="ds-table mc-table' + (state.taskId && state.tab === 'history' ? ' mc-history-table' : '') + '"><colgroup>' + cols.map(function (col) { return col[2] ? '<col style="width:' + col[2] + 'px">' : '<col>'; }).join('') + '</colgroup><thead><tr>' + cols.map(function (col) {
      var sortable = state.taskId && state.tab === 'history' && ['check', 'reason', 'runActions', 'nodeLog'].indexOf(col[0]) < 0;
      return '<th scope="col"' + (sortable ? ' aria-sort="' + (current.sort === col[0] ? current.direction === 1 ? 'ascending' : 'descending' : 'none') + '"' : '') + '>' + (col[0] === 'check' ? '<input type="checkbox" data-mc-check-all aria-label="选择本页全部执行记录"' + (paged.some(function (row) { return row.status !== '执行中'; }) ? '' : ' disabled') + '>' : sortable ? button('sort', current.sort === col[0] && current.direction === 1 ? 'sort-up' : 'sort-down', col[1], 'data-key="' + col[0] + '"', 'mc-sort') : col[1]) + '</th>';
    }).join('') + '</tr></thead><tbody>' + (paged.length ? paged.map(function (row) { return '<tr' + (state.selected.has(row.id) ? ' class="is-selected"' : '') + '>' + cols.map(function (col) { return '<td>' + cell(row, col) + '</td>'; }).join('') + '</tr>'; }).join('') : '<tr><td colspan="' + cols.length + '"><div class="mc-empty"><i class="bi bi-inbox" aria-hidden="true"></i><span>暂无数据</span></div></td></tr>') + '</tbody></table></div>';
    renderPagination(rows.length, start, count);
    syncChecks();
  }
  function renderPagination(total, start, count) {
    var current = view(), html = button('page', 'chevron-left', '上一页', 'data-page="' + (current.page - 1) + '"' + (current.page === 1 ? ' disabled' : ''));
    for (var p = 1; p <= count; p += 1) {
      if (p === 1 || p === count || Math.abs(p - current.page) <= 1) html += '<button type="button" class="page-num' + (p === current.page ? ' active' : '') + '" data-mc-action="page" data-page="' + p + '" aria-label="第' + p + '页"' + (p === current.page ? ' aria-current="page"' : '') + '>' + p + '</button>';
      else if (p === 2 || p === count - 1) html += '<span>…</span>';
    }
    html += button('page', 'chevron-right', '下一页', 'data-page="' + (current.page + 1) + '"' + (current.page === count ? ' disabled' : ''));
    root.querySelector('[data-mc-pagination]').innerHTML = '<span>第 ' + (total ? start + 1 : 0) + ' 到第 ' + Math.min(start + current.size, total) + ' 条，共 ' + total + ' 条数据</span><div class="page-nav">' + html + '<select class="mc-control mc-page-size" data-mc-size aria-label="每页条数">' + [10, 20, 50].map(function (size) { return '<option value="' + size + '"' + (current.size === size ? ' selected' : '') + '>' + size + ' 条/页</option>'; }).join('') + '</select><label class="mc-page-jump">跳至 <input type="number" class="mc-control" data-mc-jump min="1" max="' + count + '" value="' + current.page + '" aria-label="跳转页码"> 页</label></div>';
  }
  function notice(text) { var box = root.querySelector('[data-mc-notice]'); if (box) box.textContent = text; }
  function captureFilters() {
    var filters = Object.assign({}, view().filters), keyword = root.querySelector('[data-mc-keyword]');
    if (keyword) filters.keyword = keyword.value;
    root.querySelectorAll('[data-mc-filter]').forEach(function (el) { filters[el.dataset.mcFilter] = el.value; });
    root.querySelectorAll('[data-mc-date]').forEach(function (el) { filters[el.dataset.mcDate] = el.value; });
    root.querySelectorAll('[data-mc-number]').forEach(function (el) { filters[el.dataset.mcNumber] = el.value; });
    return filters;
  }
  function query(patch) {
    var current = view(), filters = Object.assign(captureFilters(), patch || {});
    if (['min', 'max'].some(function (key) { return filters[key] !== '' && (!Number.isFinite(Number(filters[key])) || Number(filters[key]) < 0); }) || (filters.min !== '' && filters.max !== '' && Number(filters.min) > Number(filters.max))) { notice('请填写有效的时长范围，最短时长不能大于最长时长。'); return; }
    current.filters = filters; current.keywordDraft = null; current.page = 1; state.selected.clear(); renderFilters(); renderTable(); notice('');
  }
  function summary(task) {
    var runs = model.runs.filter(function (run) { return run.taskId === task.id; });
    var success = runs.filter(function (run) { return run.status === '执行成功'; }).length, failure = runs.filter(function (run) { return run.status === '执行失败'; }).length;
    var finished = runs.filter(function (run) { return run.seconds != null; });
    var average = finished.reduce(function (sum, run) { return sum + run.seconds; }, 0) / (finished.length || 1);
    return [['所属项目', task.project], ['环境', task.environment], ['任务类型', task.type], ['版本', task.version], ['子流程个数', 1], ['创建者', task.owner], ['修改时间', task.updated], ['调度', task.schedule], ['执行总数', runs.length], ['执行成功', success + '（' + (success * 100 / runs.length).toFixed(1) + '%）'], ['执行失败', failure + '（' + (failure * 100 / runs.length).toFixed(1) + '%）'], ['执行时长', (average / 60).toFixed(2) + 'min（平均）']];
  }
  function fields(pairs) { return '<dl class="mc-summary">' + pairs.map(function (pair) { return '<div><dt>' + esc(pair[0]) + '</dt><dd' + (pair[0] === '执行失败' ? ' class="is-failed"' : pair[0] === '执行成功' ? ' class="is-success"' : '') + '>' + esc(pair[1]) + '</dd></div>'; }).join('') + '</dl>'; }
  function render() {
    if (DP.datePicker) DP.datePicker.close();
    var task = currentTask();
    root.classList.toggle('mc-list-layout', !task);
    root.innerHTML = (task ? '<header class="mc-detail-head"><h2>' + esc(task.name) + '</h2><div class="mc-actions">' + button('edit', 'pencil-square', '编辑', '', 'btn btn-primary') + button('back', 'arrow-left', '返回') + '</div></header>' + fields(summary(task)) + '<div class="mc-tabs" role="tablist" aria-label="任务详情">' + tabs.map(function (tab) { return button('tab', tab[1], tab[2], 'data-tab="' + tab[0] + '" role="tab" aria-selected="' + (state.tab === tab[0]) + '"', 'mc-tab' + (state.tab === tab[0] ? ' active' : '')); }).join('') + '</div>' : '') + '<div class="mc-notice" data-mc-notice role="status" aria-live="polite"></div><section class="mc-body" aria-label="' + (task ? '任务详情' : '监控中心列表') + '"><div data-mc-filters></div><div data-mc-table></div><div class="ds-pagination mc-pagination" data-mc-pagination></div></section><div data-mc-overlay></div>';
    root.querySelector('.mc-body').setAttribute('aria-label', task ? '任务详情' : notificationMode ? '通知中心列表' : '监控中心列表');
    if (task && ['topology', 'dependency'].indexOf(state.tab) >= 0) renderGraph();
    else { renderFilters(); renderTable(); }
  }
  function renderGraph() {
    var task = currentTask(), dependency = state.tab === 'dependency';
    var latest = model.runs.filter(function (row) { return row.taskId === task.id; }).sort(function (a, b) { return b.start.localeCompare(a.start); })[0];
    var nodes = dependency ? (state.direction === 'down' ? [] : [{ id: 'up', name: task.upstream, icon: 'box-arrow-in-right' }]).concat([{ id: 'task', name: task.name, icon: 'diagram-3' }], state.direction === 'up' ? [] : [{ id: 'down', name: task.downstream, icon: 'box-arrow-right' }]) : [{ id: 'start', name: '开始', icon: 'play-circle' }, { id: 'node', name: task.node + '【' + task.version + '】', icon: 'code-square' }, { id: 'end', name: '结束', icon: 'stop-circle' }];
    root.querySelector('[data-mc-filters]').innerHTML = dependency ? '<div class="mc-dependency-toolbar"><div class="mc-field"><span>链路分析</span>' + [['all', '全部'], ['up', '上游'], ['down', '下游']].map(function (item) { return '<label><input type="radio" name="mcDependency" data-mc-direction="' + item[0] + '"' + (state.direction === item[0] ? ' checked' : '') + '> ' + item[1] + '</label>'; }).join('') + '</div>' + button('batch-execute', 'play', '批量执行', '', 'btn btn-primary') + '</div>' : '';
    root.querySelector('[data-mc-table]').innerHTML = '<div class="mc-graph-layout"><div class="mc-graph" aria-label="' + (dependency ? '任务依赖图' : '流程拓扑图') + '"><div class="mc-graph-chain">' + nodes.map(function (node, i) { return (i ? '<span class="mc-connector" aria-hidden="true"><i class="bi bi-arrow-right"></i></span>' : '') + '<div class="mc-graph-node' + (node.id === 'node' || node.id === 'task' ? ' active' : '') + '"><i class="bi bi-' + node.icon + '" aria-hidden="true"></i><span>' + esc(node.name) + '</span></div>'; }).join('') + '</div></div>' + (dependency ? '' : '<aside class="mc-properties"><h3>任务属性</h3>' + fields([['项目', task.project], ['任务名称', task.name], ['运行状态', latest.status], ['修改人', task.owner], ['创建时间', task.created], ['备注', task.remark]]) + '</aside>') + '</div>';
    root.querySelector('[data-mc-pagination]').innerHTML = '';
  }
  function syncChecks() {
    var boxes = Array.from(root.querySelectorAll('[data-mc-check]:not(:disabled)')), all = root.querySelector('[data-mc-check-all]');
    boxes.forEach(function (box) { box.checked = state.selected.has(box.dataset.mcCheck); box.closest('tr').classList.toggle('is-selected', box.checked); });
    var count = boxes.filter(function (box) { return box.checked; }).length;
    if (all) { all.checked = boxes.length > 0 && count === boxes.length; all.indeterminate = count > 0 && count < boxes.length; }
    var btn = root.querySelector('[data-mc-rerun]'); if (btn) btn.disabled = !state.selected.size;
  }
  function openTask(id) {
    var row = (notificationMode ? model.notifications : model.alerts).find(function (alert) { return alert.id === id; });
    if (!row) return;
    if (row.unsupported) { notice('暂时不支持采集子流程'); return; }
    state.list.keywordDraft = root.querySelector('[data-mc-keyword]').value;
    state.taskId = row.taskId; state.tab = notificationMode ? 'notification' : 'monitor'; state.runId = ''; state.detail = viewState(); state.selected.clear(); render();
  }
  function editTask() {
    var task = currentTask(), record = DP.developmentCodeRecords.find(function (r) { return r.id === task.recordId; });
    var nav = document.querySelector('.nav-item[data-page="develop"]');
    if (nav) { document.querySelectorAll('.nav-item.active').forEach(function (el) { el.classList.remove('active'); }); nav.classList.add('active'); }
    DP.switchMenuGroup('develop');
    var link = document.querySelector('[data-menu="dev-develop"]'); if (link) DP.setActiveMenu(link);
    if (DP.setProjectEnvironment) DP.setProjectEnvironment(record.project, record.environment, { silent: true });
    DP.showPage('数据开发', { project: record.project, environment: record.environment, flowId: record.businessFlowId, subflowId: record.subflowId, recordId: record.id });
  }
  function openLog(id) {
    var run = model.runs.find(function (r) { return r.id === id; }), task = currentTask();
    if (!run) return;
    lastFocus = document.activeElement;
    var log = '[' + run.start + '] INFO  开始执行 ' + task.node + '，版本 ' + task.version + '\n[' + run.start + '] INFO  执行方式：' + run.method + '\n[' + (run.end || run.start) + '] ' + (run.status === '执行失败' ? 'ERROR ' + run.reason : 'INFO  ' + run.status);
    root.querySelector('[data-mc-overlay]').innerHTML = '<div class="mc-modal-mask"><section class="mc-modal" role="dialog" aria-modal="true" aria-labelledby="mcLogTitle"><header><h3 id="mcLogTitle">执行日志</h3>' + button('close-log', 'x-lg', '关闭') + '</header><div class="mc-modal-body">' + fields([['名称', task.node], ['版本', task.version], ['执行ID', run.id], ['状态', run.status], ['开始时间', run.start], ['结束时间', run.end || '—']]) + '<pre>' + esc(log) + '</pre></div></section></div>';
    root.querySelector('[data-mc-action="close-log"]').focus();
  }
  function closeLog() { root.querySelector('[data-mc-overlay]').innerHTML = ''; if (lastFocus && lastFocus.isConnected) lastFocus.focus(); }
  function openSupplement(id) {
    var run = model.runs.find(function (row) { return row.id === id; });
    if (!run) return;
    lastFocus = document.activeElement;
    state.supplementId = id;
    root.querySelector('[data-mc-overlay]').innerHTML = '<div class="mc-modal-mask"><section class="mc-modal mc-supplement" role="dialog" aria-modal="true" aria-labelledby="mcSupplementTitle"><header><h3 id="mcSupplementTitle">数据补录</h3>' + button('close-log', 'x-lg', '关闭') + '</header><div class="mc-modal-body">' + fields([['名称', currentTask().name]]) + '</div><footer>' + button('close-log', 'x-lg', '取消') + button('save-supplement', 'floppy', '保存', '', 'btn btn-primary') + '</footer></section></div>';
    root.querySelector('[data-mc-action="save-supplement"]').focus();
  }
  function addExecutions(taskId, method, count) {
    for (var i = 0; i < count; i += 1) {
      model.serial += 1;
      var now = stamp(Date.now());
      model.runs.push({ id: '2699' + String(model.serial).padStart(4, '0'), taskId: taskId, method: method, start: now, end: now, status: '执行成功', seconds: 0, reason: '' });
    }
    if (!root.isConnected || state.taskId !== taskId) return;
    state.tab = 'history'; state.runId = ''; state.detail = viewState(); state.selected.clear(); render(); notice('本地演示执行完成，已新增 ' + count + ' 条历史记录。');
  }
  function execute(ids, batch) {
    var taskId = state.taskId, task = currentTask();
    var runs = ids.map(function (id) { return model.runs.find(function (run) { return run.id === id && run.taskId === taskId; }); }).filter(function (run) { return run && run.status !== '执行中'; });
    if (!batch && !runs.length) return;
    DP.confirm(batch ? '确认批量执行当前任务“' + esc(task.name) + '”？' : '确认重跑选中的 ' + runs.length + ' 条执行记录？', {
      icon: 'info', okText: '<i class="bi bi-play" aria-hidden="true"></i> 确认', cancelText: '<i class="bi bi-x-lg" aria-hidden="true"></i> 取消', onOk: function () {
        // 新建本地执行记录，保留原执行结果及历史告警，不调用真实任务。
        addExecutions(taskId, batch ? '批量执行' : '数据重跑', batch ? 1 : runs.length);
      }
    });
  }
  function onClick(event) {
    var el = event.target.closest('[data-mc-action]');
    if (!el || el.disabled) return;
    var action = el.dataset.mcAction, current = view();
    if (action === 'query') query();
    else if (action === 'preset') { current.preset = Number(el.dataset.days); query(range(current.preset)); }
    else if (action === 'project-clear') query({ projects: [], environment: '' });
    else if (action === 'page') { current.page = Number(el.dataset.page); state.selected.clear(); renderTable(); }
    else if (action === 'view') openTask(el.dataset.id);
    else if (action === 'back') { state.taskId = ''; state.runId = ''; state.selected.clear(); render(); }
    else if (action === 'tab') { state.tab = el.dataset.tab; state.runId = ''; state.detail = viewState(); state.selected.clear(); render(); }
    else if (action === 'edit') editTask();
    else if (action === 'sort') { current.direction = current.sort === el.dataset.key ? -current.direction : -1; current.sort = el.dataset.key; renderTable(); }
    else if (action === 'run-log') { state.savedHistory = state.detail; state.runId = el.dataset.id; state.detail = viewState(); state.detail.preset = 0; state.detail.filters.from = ''; state.detail.filters.to = ''; render(); }
    else if (action === 'back-history') { state.runId = ''; state.detail = state.savedHistory; render(); }
    else if (action === 'supplement') openSupplement(el.dataset.id);
    else if (action === 'save-supplement') { var run = model.runs.find(function (r) { return r.id === state.supplementId && r.taskId === state.taskId; }); if (run) addExecutions(run.taskId, '数据补录', 1); }
    else if (action === 'node-log') openLog(el.dataset.id);
    else if (action === 'close-log') closeLog();
    else if (action === 'rerun') execute([el.dataset.id], false);
    else if (action === 'rerun-selected') execute(Array.from(state.selected), false);
    else if (action === 'batch-execute') execute([], true);
  }
  function jump(input) {
    var value = Number(input.value), count = Math.max(1, Math.ceil(filteredRows().length / view().size));
    view().page = Number.isFinite(value) ? Math.min(count, Math.max(1, Math.floor(value))) : 1;
    state.selected.clear(); renderTable();
  }
  function onChange(event) {
    var el = event.target;
    if (el.matches('[data-mc-filter]')) query();
    else if (el.matches('[data-mc-project]')) {
      var chosen = state.list.filters.projects.filter(function (project) { return project !== el.dataset.mcProject; });
      if (el.checked) chosen.push(el.dataset.mcProject);
      var search = root.querySelector('[data-mc-project-search]').value;
      query({ projects: chosen, environment: '' });
      var picker = root.querySelector('.mc-project-picker'); picker.open = true;
      root.querySelector('[data-mc-project-search]').value = search;
      root.querySelector('[data-mc-project-options]').innerHTML = projectOptions(search);
    }
    else if (el.matches('[data-mc-date]')) { view().preset = 0; query(); }
    else if (el.matches('[data-mc-node-date]')) { query({ from: el.value ? el.value + ' 00:00:00' : '', to: el.value ? el.value + ' 23:59:59' : '' }); }
    else if (el.matches('[data-mc-size]')) { view().size = Number(el.value); view().page = 1; state.selected.clear(); renderTable(); }
    else if (el.matches('[data-mc-jump]')) jump(el);
    else if (el.matches('[data-mc-direction]')) { state.direction = el.dataset.mcDirection; renderGraph(); }
    else if (el.matches('[data-mc-check]')) { if (el.checked) state.selected.add(el.dataset.mcCheck); else state.selected.delete(el.dataset.mcCheck); syncChecks(); }
    else if (el.matches('[data-mc-check-all]')) { root.querySelectorAll('[data-mc-check]:not(:disabled)').forEach(function (box) { if (el.checked) state.selected.add(box.dataset.mcCheck); else state.selected.delete(box.dataset.mcCheck); }); syncChecks(); }
  }
  function onKey(event) {
    if (event.key === 'Escape') { closeLog(); var picker = root.querySelector('.mc-project-picker'); if (picker) picker.open = false; }
    if (event.key === 'Tab' && root.querySelector('.mc-modal')) {
      var focusable = Array.from(root.querySelectorAll('.mc-modal button:not(:disabled)'));
      var index = focusable.indexOf(event.target);
      if ((event.shiftKey && index <= 0) || (!event.shiftKey && index === focusable.length - 1)) { event.preventDefault(); focusable[event.shiftKey ? focusable.length - 1 : 0].focus(); }
    }
    if (event.key !== 'Enter') return;
    if (event.target.matches('[data-mc-keyword], [data-mc-number]')) { event.preventDefault(); query(); }
    else if (event.target.matches('[data-mc-jump]')) { event.preventDefault(); jump(event.target); }
  }
  function init(kind) {
    notificationMode = kind === 'notification';
    root = DP.contentArea.querySelector('.page-monitor-center');
    if (!root) return;
    if (!model) model = seed();
    state = { list: viewState(), detail: viewState(), taskId: '', tab: 'monitor', runId: '', selected: new Set(), direction: 'all' };
    root.addEventListener('click', onClick); root.addEventListener('change', onChange); root.addEventListener('keydown', onKey);
    root.addEventListener('input', function (event) {
      if (event.target.matches('[data-mc-project-search]')) root.querySelector('[data-mc-project-options]').innerHTML = projectOptions(event.target.value);
      else if (event.target.matches('[data-mc-keyword]')) view().keywordDraft = event.target.value;
    });
    render();
  }
  document.addEventListener('click', function (event) { if (!root || !root.isConnected) return; var picker = root.querySelector('.mc-project-picker[open]'); if (picker && !picker.contains(event.target)) picker.open = false; });
  return { html: '<div class="page-monitor-center"></div>', init: init };
}());
DP.pages.notificationCenter = {
  html: '<div class="page-monitor-center page-notification-center"></div>',
  init: function () { DP.pages.monitorCenter.init('notification'); }
};
