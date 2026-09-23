/** 运维监控 / 运维管理 / 采集监控。 */
window.DP = window.DP || {};
DP.pages = DP.pages || {};

DP.pages.collectionMonitor = (function () {
  'use strict';

  var pageEl = null;
  var trendChart = null;
  var resizeHandler = null;
  var state = {
    period: 'day',
    page: 1,
    pageSize: 10,
    sortKey: 'id',
    sortDir: 'desc',
    filters: { project: '', env: '', method: '', diffMin: '', diffMax: '', durationMin: '', durationMax: '', durationUnit: 'second', status: '', keyword: '' }
  };

  var projects = ['零售交易数仓', '会员画像中心', '供应链协同分析', '财务结算分析'];
  var environments = ['生产环境', '测试环境', '开发环境'];
  var methods = ['调度执行', '测试执行', '接口执行', '数据重跑', '数据补录', '触发执行', '批量执行', '执行一次'];
  var flowTemplates = [
    ['ods_order_detail_df【V3】', '全渠道订单明细入仓', '零售交易数仓', 128460, 128460, 2864],
    ['ods_store_sales_df【V2】', '门店销售流水采集', '零售交易数仓', 86420, 86420, 2417],
    ['dwd_member_profile_di【V5】', '会员画像增量同步', '会员画像中心', 76380, 76378, 1982],
    ['ods_inventory_snapshot_hf【V2】', '门店库存快照采集', '供应链协同分析', 184620, 184620, 3286],
    ['ods_logistics_track_di【V4】', '物流轨迹明细入仓', '供应链协同分析', 94680, 94672, 2168],
    ['dwd_supplier_fulfill_di【V2】', '供应商履约数据同步', '供应链协同分析', 42680, 42680, 1463],
    ['ods_settlement_detail_df【V3】', '渠道结算明细采集', '财务结算分析', 58240, 58240, 1786],
    ['dwd_payment_result_di【V2】', '支付结果增量采集', '财务结算分析', 112860, 112860, 2642],
    ['ods_coupon_usage_di【V1】', '营销券核销记录采集', '零售交易数仓', 68420, 68420, 1931],
    ['dwd_member_behavior_hi【V4】', '会员行为日志采集', '会员画像中心', 216480, 216480, 3968],
    ['ods_customer_service_di【V2】', '客户工单明细同步', '会员画像中心', 32640, 32640, 1278],
    ['ods_product_master_df【V6】', '商品主数据全量采集', '零售交易数仓', 48620, 48620, 1524]
  ];

  function pad(value) { return String(value).padStart(2, '0'); }
  function formatDate(date) { return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate()) + ' ' + pad(date.getHours()) + ':' + pad(date.getMinutes()) + ':' + pad(date.getSeconds()); }
  function esc(value) { return String(value == null ? '' : value).replace(/[&<>"']/g, function (char) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]; }); }
  function csv(value) { var text = String(value == null ? '' : value); return '"' + text.replace(/"/g, '""') + '"'; }

  function buildRows() {
    var base = new Date(2026, 8, 22, 10, 32, 0);
    var rows = [];
    for (var index = 0; index < 36; index++) {
      var template = flowTemplates[index % flowTemplates.length];
      var start = new Date(base.getTime() - index * 62 * 60 * 1000);
      var failed = index % 11 === 2 || index % 13 === 5;
      var running = index === 1 || index === 17;
      var duration = 36 + (index * 17 % 284);
      var read = template[3] + (index % 5) * 183;
      var lost = failed ? 12 + index % 31 : (index % 9 === 4 ? 2 : 0);
      var write = running ? Math.floor(read * .72) : Math.max(0, read - lost);
      var end = running ? null : new Date(start.getTime() + duration * 1000);
      rows.push({
        id: 202609220360 - index,
        subflow: template[0],
        process: template[1],
        method: methods[index % methods.length],
        project: template[2],
        env: index % 8 === 7 ? '测试环境' : (index % 15 === 14 ? '开发环境' : '生产环境'),
        read: read,
        write: write,
        diff: Math.abs(read - write),
        rate: running ? Math.max(1, Math.round(write / Math.max(1, duration))) : (failed ? Math.round(write / Math.max(1, duration)) : template[5] + index % 7 * 36),
        status: running ? '执行中' : (failed ? '执行失败' : '执行成功'),
        start: formatDate(start),
        end: end ? formatDate(end) : '--',
        duration: duration
      });
    }
    return rows;
  }

  var rows = buildRows();
  var trendSets = {
    day: {
      labels: ['11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00'],
      success: [2, 3, 2, 4, 3, 2, 4, 3, 5, 4, 3, 2, 4, 3, 2, 5, 4, 3, 2, 4, 5, 3, 4, 6],
      failed: [0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0]
    },
    week: {
      labels: ['09/16', '09/17', '09/18', '09/19', '09/20', '09/21', '09/22'],
      success: [68, 74, 71, 79, 82, 76, 86], failed: [3, 2, 4, 2, 3, 5, 4]
    },
    month: {
      labels: ['08/24', '08/26', '08/28', '08/30', '09/01', '09/03', '09/05', '09/07', '09/09', '09/11', '09/13', '09/15', '09/17', '09/19', '09/21'],
      success: [61, 65, 68, 64, 72, 70, 75, 78, 74, 81, 79, 83, 86, 82, 88], failed: [4, 3, 5, 4, 3, 2, 4, 3, 5, 2, 3, 4, 2, 3, 4]
    },
    custom: {
      labels: ['09/09', '09/10', '09/11', '09/12', '09/13', '09/14', '09/15', '09/16', '09/17', '09/18', '09/19', '09/20', '09/21', '09/22'],
      success: [72, 76, 81, 77, 79, 84, 83, 86, 88, 82, 85, 87, 84, 91], failed: [3, 4, 2, 5, 3, 2, 4, 3, 2, 5, 3, 4, 5, 3]
    }
  };

  function option(value, label, selected) { return '<option value="' + esc(value) + '"' + (selected === value ? ' selected' : '') + '>' + esc(label) + '</option>'; }
  function durationText(seconds) { if (seconds < 60) return seconds + '秒'; if (seconds < 3600) return Math.floor(seconds / 60) + '分' + pad(seconds % 60) + '秒'; return Math.floor(seconds / 3600) + '小时' + Math.floor(seconds % 3600 / 60) + '分'; }

  function renderPage() {
    var topProjectOptions = '<option value="">请选择</option>' + projects.map(function (item) { return option(item, item, ''); }).join('');
    var envOptions = '<option value="">请选择</option>' + environments.map(function (item) { return option(item, item, ''); }).join('');
    var methodOptions = '<option value="">请选择</option>' + methods.map(function (item) { return option(item, item, ''); }).join('');
    var datePicker = DP.datePicker.render({ mode: 'range', label: '采集监控时间范围', output: 'datetime', start: '2026-09-21 00:00:00', end: '2026-09-22 23:59:59', startAttrs: { 'data-cm-date': 'start' }, endAttrs: { 'data-cm-date': 'end' } });
    return '<div class="page-collection-monitor"><div class="cm-page-inner">' +
      '<section class="cm-trend-panel"><div class="cm-top-filter">' +
        '<label><span>项目</span><select data-cm-top="project">' + topProjectOptions + '</select></label>' +
        '<label><span>环境</span><select data-cm-top="env">' + envOptions + '</select></label>' +
        '<div class="cm-period-tabs" role="group" aria-label="监控周期"><button type="button" class="active" data-cm-period="day">近1天</button><button type="button" data-cm-period="week">近7天</button><button type="button" data-cm-period="month">近30天</button></div>' +
        '<div class="cm-top-date">' + datePicker + '</div>' +
      '</div><div id="cmTrendChart" class="cm-trend-chart"></div></section>' +
      '<section class="cm-detail-panel"><div class="cm-section-title"><h3>采集详情</h3></div><form class="cm-query" data-cm-query>' +
        '<label><span>执行方式</span><select data-cm-filter="method">' + methodOptions + '</select></label>' +
        '<label class="cm-range-field"><span>读写差异</span><input type="number" min="0" placeholder="最小值" data-cm-filter="diffMin"><em>—</em><input type="number" min="0" placeholder="最大值" data-cm-filter="diffMax"></label>' +
        '<label class="cm-range-field"><span>时长</span><input type="number" min="0" placeholder="最小值" data-cm-filter="durationMin"><em>—</em><input type="number" min="0" placeholder="最大值" data-cm-filter="durationMax"><select data-cm-filter="durationUnit"><option value="second">秒钟</option><option value="minute">分钟</option><option value="hour">小时</option><option value="day">天</option></select></label>' +
        '<label><span>状态</span><select data-cm-filter="status"><option value="">全部</option><option>执行成功</option><option>执行失败</option><option>执行中</option></select></label>' +
        '<label class="cm-keyword"><span class="sr-only">关键词</span><input type="text" placeholder="关键字(子流程和业务流程)" data-cm-filter="keyword"></label>' +
        '<div class="cm-query-actions"><button type="submit" class="btn btn-primary"><i class="bi bi-search"></i><span>查询</span></button><button type="button" class="btn btn-primary" data-cm-action="export"><i class="bi bi-download"></i><span>导出</span></button></div>' +
      '</form><div class="cm-table-wrap"><table class="ds-table cm-table"><thead data-cm-thead></thead><tbody data-cm-tbody></tbody></table></div><div class="cm-pagination" data-cm-pagination></div></section>' +
      '<div class="cm-modal" data-cm-modal hidden><div class="cm-modal-mask" data-cm-close></div><section class="cm-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="cmModalTitle"><div class="cm-modal-head"><h3 id="cmModalTitle"></h3><button type="button" class="cm-modal-x" data-cm-close aria-label="关闭"><i class="bi bi-x-lg"></i></button></div><div class="cm-modal-body" data-cm-modal-body></div><div class="cm-modal-foot" data-cm-modal-foot></div></section></div>' +
      '<div class="cm-toast" data-cm-toast role="status"></div>' +
    '</div></div>';
  }

  var columns = [
    ['id', '执行ID'], ['subflow', '采集子流程'], ['process', '所属业务流程'], ['method', '执行方式'], ['owner', '归属'],
    ['read', '读入数据'], ['write', '写入数据'], ['diff', '读写差异'], ['rate', '速率(记录数/秒)'], ['status', '状态'],
    ['start', '开始时间'], ['end', '结束时间'], ['duration', '执行时长']
  ];

  function headerHtml() {
    return '<tr>' + columns.map(function (column) {
      var active = state.sortKey === column[0];
      return '<th><button type="button" class="cm-sort' + (active ? ' active' : '') + '" data-cm-sort="' + column[0] + '"><span>' + column[1] + '</span><i class="bi bi-' + (active && state.sortDir === 'asc' ? 'sort-up' : 'sort-down') + '"></i></button></th>';
    }).join('') + '<th class="cm-action-col">操作</th></tr>';
  }

  function readFilters() {
    var topProject = pageEl.querySelector('[data-cm-top="project"]');
    var topEnv = pageEl.querySelector('[data-cm-top="env"]');
    state.filters.project = topProject ? topProject.value : '';
    state.filters.env = topEnv ? topEnv.value : '';
    pageEl.querySelectorAll('[data-cm-filter]').forEach(function (control) { state.filters[control.dataset.cmFilter] = control.value.trim(); });
    var dateStart = pageEl.querySelector('[data-cm-date="start"]');
    var dateEnd = pageEl.querySelector('[data-cm-date="end"]');
    state.filters.dateStart = dateStart ? dateStart.value : '';
    state.filters.dateEnd = dateEnd ? dateEnd.value : '';
  }

  function filteredRows() {
    var filters = state.filters;
    var unitFactor = { second: 1, minute: 60, hour: 3600, day: 86400 }[filters.durationUnit] || 1;
    var diffMin = filters.diffMin === '' ? null : Number(filters.diffMin);
    var diffMax = filters.diffMax === '' ? null : Number(filters.diffMax);
    var durationMin = filters.durationMin === '' ? null : Number(filters.durationMin) * unitFactor;
    var durationMax = filters.durationMax === '' ? null : Number(filters.durationMax) * unitFactor;
    var keyword = filters.keyword.toLowerCase();
    return rows.filter(function (row) {
      if (filters.project && row.project !== filters.project) return false;
      if (filters.env && row.env !== filters.env) return false;
      if (filters.dateStart && row.start < filters.dateStart) return false;
      if (filters.dateEnd && row.start > filters.dateEnd) return false;
      if (filters.method && row.method !== filters.method) return false;
      if (filters.status && row.status !== filters.status) return false;
      if (diffMin != null && row.diff < diffMin) return false;
      if (diffMax != null && row.diff > diffMax) return false;
      if (durationMin != null && row.duration < durationMin) return false;
      if (durationMax != null && row.duration > durationMax) return false;
      return !keyword || (row.subflow + ' ' + row.process).toLowerCase().indexOf(keyword) >= 0;
    }).sort(function (a, b) {
      var left = state.sortKey === 'owner' ? a.project + a.env : a[state.sortKey];
      var right = state.sortKey === 'owner' ? b.project + b.env : b[state.sortKey];
      if (left === right) return 0;
      var result = left > right ? 1 : -1;
      return state.sortDir === 'asc' ? result : -result;
    });
  }

  function statusHtml(status) {
    var cls = status === '执行成功' ? 'success' : (status === '执行失败' ? 'failed' : 'running');
    return '<span class="cm-status ' + cls + '">' + status + '</span>';
  }

  function tableRow(row) {
    var rerun = row.status === '执行失败' ? '<button type="button" data-cm-row-action="rerun" data-id="' + row.id + '"><i class="bi bi-clock-history"></i><span>数据重跑</span></button>' : '';
    return '<tr><td>' + row.id + '</td><td title="' + esc(row.subflow) + '">' + esc(row.subflow) + '</td><td title="' + esc(row.process) + '">' + esc(row.process) + '</td><td>' + row.method + '</td><td title="' + esc(row.project + ' / ' + row.env) + '">' + esc(row.project + ' / ' + row.env) + '</td><td>' + row.read.toLocaleString('zh-CN') + '</td><td>' + row.write.toLocaleString('zh-CN') + '</td><td class="' + (row.diff ? 'cm-diff-warning' : '') + '">' + row.diff.toLocaleString('zh-CN') + '</td><td>' + row.rate.toLocaleString('zh-CN') + '</td><td>' + statusHtml(row.status) + '</td><td>' + row.start + '</td><td>' + row.end + '</td><td>' + durationText(row.duration) + '</td><td class="cm-action-col"><div class="cm-row-actions"><button type="button" data-cm-row-action="log" data-id="' + row.id + '"><i class="bi bi-file-earmark-code"></i><span>执行日志</span></button><button type="button" data-cm-row-action="supply" data-id="' + row.id + '"><i class="bi bi-file-earmark-plus"></i><span>数据补录</span></button>' + rerun + '</div></td></tr>';
  }

  function renderPagination(total) {
    var count = Math.max(1, Math.ceil(total / state.pageSize));
    if (state.page > count) state.page = count;
    var start = total ? (state.page - 1) * state.pageSize + 1 : 0;
    var end = Math.min(state.page * state.pageSize, total);
    var pages = [];
    for (var page = 1; page <= Math.min(count, 5); page++) pages.push('<button type="button" data-cm-page="' + page + '" class="' + (page === state.page ? 'active' : '') + '">' + page + '</button>');
    return '<span>第' + start + '到第' + end + '条，共' + total + '条数据</span><div class="cm-page-nav"><button type="button" data-cm-page="prev"' + (state.page === 1 ? ' disabled' : '') + '><i class="bi bi-chevron-left"></i><span>上一页</span></button>' + pages.join('') + (count > 5 ? '<span>…</span><button type="button" data-cm-page="' + count + '" class="' + (count === state.page ? 'active' : '') + '">' + count + '</button>' : '') + '<button type="button" data-cm-page="next"' + (state.page === count ? ' disabled' : '') + '><i class="bi bi-chevron-right"></i><span>下一页</span></button></div><select data-cm-page-size aria-label="每页条数"><option value="10"' + (state.pageSize === 10 ? ' selected' : '') + '>10 条/页</option><option value="20"' + (state.pageSize === 20 ? ' selected' : '') + '>20 条/页</option><option value="30"' + (state.pageSize === 30 ? ' selected' : '') + '>30 条/页</option></select><label>跳至 <input type="number" min="1" max="' + count + '" value="' + state.page + '" data-cm-jump aria-label="跳转页码"> 页</label>';
  }

  function renderTable() {
    var filtered = filteredRows();
    var start = (state.page - 1) * state.pageSize;
    var body = filtered.slice(start, start + state.pageSize);
    pageEl.querySelector('[data-cm-thead]').innerHTML = headerHtml();
    pageEl.querySelector('[data-cm-tbody]').innerHTML = body.length ? body.map(tableRow).join('') : '<tr><td colspan="14"><div class="cm-empty"><i class="bi bi-inbox"></i><span>暂无符合条件的采集记录</span></div></td></tr>';
    pageEl.querySelector('[data-cm-pagination]').innerHTML = renderPagination(filtered.length);
  }

  function initChart() {
    var el = pageEl.querySelector('#cmTrendChart');
    if (!el) return;
    if (!window.echarts) { el.innerHTML = '<div class="cm-chart-fallback"><i class="bi bi-bar-chart-line"></i><span>图表组件加载后显示采集任务趋势</span></div>'; return; }
    trendChart = window.echarts.init(el);
    renderChart();
  }

  function renderChart() {
    if (!trendChart) return;
    var data = trendSets[state.period] || trendSets.day;
    var projectFactor = state.filters.project ? 0.72 + projects.indexOf(state.filters.project) * .08 : 1;
    var envFactor = state.filters.env === '测试环境' ? .26 : (state.filters.env === '开发环境' ? .18 : 1);
    var success = data.success.map(function (value) { return Math.max(0, Math.round(value * projectFactor * envFactor)); });
    var failed = data.failed.map(function (value) { return Math.max(0, Math.round(value * projectFactor * envFactor)); });
    var rates = success.map(function (value, index) { var total = value + failed[index]; return total ? Number((failed[index] / total * 100).toFixed(2)) : 0; });
    trendChart.setOption({
      color: ['#20c985', '#ff5b52', '#f0b429'],
      tooltip: { trigger: 'axis', confine: true, backgroundColor: 'rgba(255,255,255,.98)', borderColor: '#d8e4f2', borderWidth: 1, textStyle: { color: '#26384d', fontSize: 12 } },
      legend: { top: 18, left: 'center', itemWidth: 18, itemHeight: 9, itemGap: 22, textStyle: { color: '#52667c', fontSize: 12 }, data: ['执行成功', '执行失败', '错误率'] },
      grid: { left: 66, right: 72, top: 62, bottom: 58 },
      xAxis: { type: 'category', name: '时间', data: data.labels, axisTick: { show: false }, axisLine: { lineStyle: { color: '#b9c7d5' } }, axisLabel: { color: '#6f8298', rotate: data.labels.length > 12 ? 38 : 0, interval: 0, fontSize: 10 }, nameTextStyle: { color: '#1683ff', fontSize: 12 } },
      yAxis: [{ type: 'value', name: '任务数', minInterval: 1, nameTextStyle: { color: '#1683ff', fontSize: 12 }, axisLabel: { color: '#6f8298' }, splitLine: { lineStyle: { color: '#edf2f7', type: 'dashed' } } }, { type: 'value', name: '百分比', min: 0, max: 100, interval: 20, nameTextStyle: { color: '#1683ff', fontSize: 12 }, axisLabel: { color: '#6f8298', formatter: '{value}%' }, splitLine: { show: false } }],
      series: [{ name: '执行成功', type: 'bar', stack: 'task', barMaxWidth: 18, data: success, itemStyle: { borderRadius: [2, 2, 0, 0] } }, { name: '执行失败', type: 'bar', stack: 'task', barMaxWidth: 18, data: failed, itemStyle: { borderRadius: [2, 2, 0, 0] } }, { name: '错误率', type: 'line', yAxisIndex: 1, smooth: true, symbol: 'circle', symbolSize: 4, lineStyle: { width: 2 }, data: rates }]
    }, true);
  }

  function findRow(id) { return rows.find(function (row) { return String(row.id) === String(id); }); }
  function modalButtons(confirmAction) { return '<button type="button" class="btn btn-default" data-cm-close><i class="bi bi-x-lg"></i><span>取消</span></button>' + (confirmAction ? '<button type="button" class="btn btn-primary" data-cm-modal-confirm="' + confirmAction + '"><i class="bi bi-check-lg"></i><span>确认</span></button>' : ''); }

  function openModal(title, body, footer, cls) {
    var modal = pageEl.querySelector('[data-cm-modal]');
    modal.querySelector('#cmModalTitle').textContent = title;
    modal.querySelector('[data-cm-modal-body]').innerHTML = body;
    modal.querySelector('[data-cm-modal-foot]').innerHTML = footer;
    modal.querySelector('.cm-modal-dialog').className = 'cm-modal-dialog ' + (cls || '');
    modal.hidden = false;
  }

  function openLog(row) {
    var failed = row.status === '执行失败';
    var lines = [
      row.start + ' - INFO 任务实例 ' + row.id + ' 开始执行',
      row.start + ' - INFO 连接数据源：' + row.project + ' / ' + row.env,
      row.start + ' - INFO 读取对象：' + row.subflow.replace(/【.*$/, ''),
      row.start + ' - INFO 已读取 ' + row.read.toLocaleString('zh-CN') + ' 条记录',
      row.start + ' - INFO 已写入 ' + row.write.toLocaleString('zh-CN') + ' 条记录',
      failed ? row.start + ' - ERROR 写入阶段检测到 ' + row.diff + ' 条异常记录，任务执行失败' : row.start + ' - INFO 数据一致性校验通过，读写差异 ' + row.diff,
      (row.end === '--' ? formatDate(new Date(2026, 8, 22, 10, 58, 0)) : row.end) + ' - ' + (failed ? 'ERROR 任务结束，状态 FAILED' : 'INFO 任务执行完成，状态 ' + row.status)
    ];
    if (!DP.logViewer) { toast('公共日志查看器未加载'); return; }
    DP.logViewer.open({
      title: '执行日志',
      subtitle: row.subflow + ' · ' + row.process,
      fileName: '采集执行日志_' + row.id + '.log',
      content: lines.join('\n'),
      meta: [
        { label: '执行ID', value: row.id },
        { label: '执行方式', value: row.method },
        { label: '开始时间', value: row.start },
        { label: '执行时长', value: durationText(row.duration) },
        { label: '状态', value: row.status, tone: failed ? 'danger' : (row.status === '执行中' ? 'info' : 'success') }
      ]
    });
  }

  function openTaskModal(row, kind) {
    var rerun = kind === 'rerun';
    var title = rerun ? '数据重跑' : '数据补录';
    var disabled = rerun ? ' disabled aria-disabled="true"' : '';
    var body = '<div class="cm-task-meta"><span>任务名称</span><b>' + esc(row.subflow) + '</b><span>所属流程</span><b>' + esc(row.process) + '</b></div><h4>参数配置</h4><div class="cm-param-grid"><label><span>业务日期</span><input type="text" value="2026-09-21" data-cm-param="biz_date"' + disabled + '></label><label><span>执行批次</span><input type="text" value="' + (rerun ? 'retry-' : 'supply-') + row.id + '" data-cm-param="batch"' + disabled + '></label></div>' + (rerun ? '<div class="cm-modal-tip"><i class="bi bi-info-circle"></i><span>数据重跑沿用原执行参数，参数不可修改。</span></div>' : '<div class="cm-modal-tip"><i class="bi bi-info-circle"></i><span>补录任务使用原采集配置，仅补充指定业务日期的数据。</span></div>');
    openModal(title, body, modalButtons(kind), 'cm-task-dialog');
    pageEl.querySelector('[data-cm-modal]').dataset.rowId = row.id;
  }

  function closeModal() { var modal = pageEl.querySelector('[data-cm-modal]'); if (modal) { modal.hidden = true; modal.removeAttribute('data-row-id'); } }
  function toast(message) { var el = pageEl.querySelector('[data-cm-toast]'); el.innerHTML = '<i class="bi bi-check-circle"></i><span>' + esc(message) + '</span>'; el.classList.add('show'); window.clearTimeout(toast.timer); toast.timer = window.setTimeout(function () { el.classList.remove('show'); }, 1800); }

  function exportRows() {
    var data = filteredRows();
    var lines = [['执行ID', '采集子流程', '所属业务流程', '执行方式', '归属', '读入数据', '写入数据', '读写差异', '速率(记录数/秒)', '状态', '开始时间', '结束时间', '执行时长'].map(csv).join(',')];
    data.forEach(function (row) { lines.push([row.id, row.subflow, row.process, row.method, row.project + ' / ' + row.env, row.read, row.write, row.diff, row.rate, row.status, row.start, row.end, durationText(row.duration)].map(csv).join(',')); });
    var blob = new Blob(['\ufeff' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8' });
    var link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = '采集监控明细_20260922.csv'; document.body.appendChild(link); link.click(); link.remove(); URL.revokeObjectURL(link.href); toast('已导出当前查询结果，共' + data.length + '条');
  }

  function applyQuery(resetPage) { readFilters(); if (resetPage) state.page = 1; renderTable(); renderChart(); }

  function setDateRange(period) {
    var ranges = {
      day: ['2026-09-21 00:00:00', '2026-09-22 23:59:59'],
      week: ['2026-09-16 00:00:00', '2026-09-22 23:59:59'],
      month: ['2026-08-24 00:00:00', '2026-09-22 23:59:59']
    };
    var range = ranges[period];
    var picker = pageEl.querySelector('[data-dp-date-picker]');
    if (!range || !picker) return;
    var start = picker.querySelector('[data-cm-date="start"]');
    var end = picker.querySelector('[data-cm-date="end"]');
    var caption = picker.querySelector('[data-dp-date-caption]');
    var trigger = picker.querySelector('[data-dp-date-action="open"]');
    var clear = picker.querySelector('[data-dp-date-action="clear"]');
    start.value = range[0]; end.value = range[1];
    var text = range[0].slice(0, 10) + ' 至 ' + range[1].slice(0, 10);
    caption.textContent = text; trigger.title = text; trigger.setAttribute('aria-label', '采集监控时间范围：' + text);
    picker.classList.add('has-value'); if (clear) clear.hidden = false;
  }

  function bindEvents() {
    pageEl.addEventListener('click', function (event) {
      var period = event.target.closest('[data-cm-period]');
      if (period) {
        state.period = period.dataset.cmPeriod;
        pageEl.querySelectorAll('[data-cm-period]').forEach(function (button) { button.classList.toggle('active', button === period); });
        setDateRange(state.period); applyQuery(true); return;
      }
      var sort = event.target.closest('[data-cm-sort]');
      if (sort) { var key = sort.dataset.cmSort; state.sortDir = state.sortKey === key && state.sortDir === 'desc' ? 'asc' : 'desc'; state.sortKey = key; renderTable(); return; }
      var page = event.target.closest('[data-cm-page]');
      if (page) { var value = page.dataset.cmPage; var count = Math.max(1, Math.ceil(filteredRows().length / state.pageSize)); state.page = value === 'prev' ? Math.max(1, state.page - 1) : (value === 'next' ? Math.min(count, state.page + 1) : Number(value)); renderTable(); return; }
      var rowAction = event.target.closest('[data-cm-row-action]');
      if (rowAction) { var row = findRow(rowAction.dataset.id); if (!row) return; if (rowAction.dataset.cmRowAction === 'log') openLog(row); else openTaskModal(row, rowAction.dataset.cmRowAction); return; }
      if (event.target.closest('[data-cm-action="export"]')) { exportRows(); return; }
      if (event.target.closest('[data-cm-close]')) { closeModal(); return; }
      var confirm = event.target.closest('[data-cm-modal-confirm]');
      if (confirm) { var action = confirm.dataset.cmModalConfirm; var rowId = pageEl.querySelector('[data-cm-modal]').dataset.rowId; closeModal(); toast((action === 'rerun' ? '数据重跑' : '数据补录') + '任务已提交，执行ID：' + rowId); return; }
    });
    pageEl.addEventListener('submit', function (event) { if (!event.target.matches('[data-cm-query]')) return; event.preventDefault(); applyQuery(true); });
    pageEl.addEventListener('change', function (event) {
      if (event.target.matches('[data-cm-top], [data-cm-filter="method"], [data-cm-filter="status"], [data-cm-filter="durationUnit"]')) applyQuery(true);
      if (event.target.matches('[data-cm-date]')) { state.period = 'custom'; pageEl.querySelectorAll('[data-cm-period]').forEach(function (button) { button.classList.remove('active'); }); applyQuery(true); }
      if (event.target.matches('[data-cm-page-size]')) { state.pageSize = Number(event.target.value) || 10; state.page = 1; renderTable(); }
    });
    pageEl.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') closeModal();
      if (event.key === 'Enter' && event.target.matches('[data-cm-jump]')) { event.preventDefault(); var count = Math.max(1, Math.ceil(filteredRows().length / state.pageSize)); state.page = Math.min(count, Math.max(1, Number(event.target.value) || 1)); renderTable(); }
    });
  }

  function dispose() { if (resizeHandler) { window.removeEventListener('resize', resizeHandler); resizeHandler = null; } if (trendChart) { trendChart.dispose(); trendChart = null; } }

  return {
    html: renderPage(),
    init: function () {
      dispose();
      pageEl = DP.contentArea.querySelector('.page-collection-monitor');
      if (!pageEl) return;
      state.page = 1; state.pageSize = 10; state.sortKey = 'id'; state.sortDir = 'desc'; state.period = 'day';
      readFilters(); renderTable(); initChart(); bindEvents();
      resizeHandler = function () { if (trendChart) trendChart.resize(); };
      window.addEventListener('resize', resizeHandler); window.setTimeout(resizeHandler, 0);
    }
  };
}());
