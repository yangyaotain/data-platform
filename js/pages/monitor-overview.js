/** 运维监控 / 运维概况 / 监控概览。 */
window.DP = window.DP || {};
DP.pages = DP.pages || {};

DP.pages.monitorOverview = (function () {
  'use strict';

  var pageEl = null;
  var scheduleChart = null;
  var distributionChart = null;
  var statusChart = null;
  var resizeHandler = null;
  var activeDurationPeriod = 'yesterday';

  var abnormalTasks = [
    ['订单日汇总 [零售交易数仓/生产环境]', '业务流程', '2026-09-22 06:42:18'],
    ['会员标签增量同步 [会员画像中心/生产环境]', '批量任务', '2026-09-22 05:26:43'],
    ['门店库存实时对账 [供应链协同分析/生产环境]', '流式任务', '2026-09-22 04:18:09'],
    ['物流轨迹归档 [供应链协同分析/生产环境]', '业务流程', '2026-09-22 03:54:27'],
    ['财务结算异常明细 [财务结算分析/生产环境]', '批量任务', '2026-09-22 03:16:52'],
    ['客户工单主题加工 [客户服务分析/生产环境]', '业务流程', '2026-09-22 02:48:35'],
    ['商品价格快照 [零售交易数仓/生产环境]', '批量任务', '2026-09-22 02:22:14'],
    ['供应商履约评分 [供应链协同分析/生产环境]', '业务流程', '2026-09-22 01:45:08'],
    ['营销活动归因 [经营决策驾驶舱/生产环境]', '批量任务', '2026-09-21 23:38:49'],
    ['用户画像宽表更新 [会员画像中心/生产环境]', '业务流程', '2026-09-21 22:56:31']
  ];

  var durationRows = {
    yesterday: [
      ['全渠道订单明细归档 [零售交易数仓/生产环境]', 925],
      ['会员全量画像重算 [会员画像中心/生产环境]', 812],
      ['供应链库存日结 [供应链协同分析/生产环境]', 748],
      ['财务结算汇总 [财务结算分析/生产环境]', 693],
      ['物流轨迹历史压缩 [供应链协同分析/生产环境]', 626],
      ['经营指标宽表加工 [经营决策驾驶舱/生产环境]', 558],
      ['客户工单主题汇总 [客户服务分析/生产环境]', 486],
      ['门店销售日报生成 [零售交易数仓/生产环境]', 431],
      ['商品主数据校验 [零售交易数仓/生产环境]', 382],
      ['用户标签增量计算 [会员画像中心/生产环境]', 345]
    ],
    today: [
      ['供应链库存日结 [供应链协同分析/生产环境]', 844],
      ['全渠道订单明细归档 [零售交易数仓/生产环境]', 798],
      ['会员全量画像重算 [会员画像中心/生产环境]', 736],
      ['财务结算汇总 [财务结算分析/生产环境]', 652],
      ['经营指标宽表加工 [经营决策驾驶舱/生产环境]', 601],
      ['物流轨迹历史压缩 [供应链协同分析/生产环境]', 547],
      ['客户工单主题汇总 [客户服务分析/生产环境]', 465],
      ['门店销售日报生成 [零售交易数仓/生产环境]', 419],
      ['用户标签增量计算 [会员画像中心/生产环境]', 372],
      ['商品主数据校验 [零售交易数仓/生产环境]', 328]
    ]
  };

  var failureRows = [
    ['订单日汇总 [零售交易数仓/生产环境]', 7],
    ['门店库存实时对账 [供应链协同分析/生产环境]', 6],
    ['会员标签增量同步 [会员画像中心/生产环境]', 5],
    ['财务结算异常明细 [财务结算分析/生产环境]', 4],
    ['物流轨迹归档 [供应链协同分析/生产环境]', 4],
    ['客户工单主题加工 [客户服务分析/生产环境]', 3],
    ['供应商履约评分 [供应链协同分析/生产环境]', 3],
    ['营销活动归因 [经营决策驾驶舱/生产环境]', 2],
    ['商品价格快照 [零售交易数仓/生产环境]', 2],
    ['用户画像宽表更新 [会员画像中心/生产环境]', 1]
  ];

  var hours = ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'];
  var yesterdayDistribution = [3, 3, 2, 4, 7, 10, 14, 12, 8, 7, 6, 5, 8, 18, 31, 16, 9, 7, 6, 7, 8, 6, 5, 4];
  var todayDistribution = [2, 2, 3, 5, 8, 12, 16, 13, 9, 8, 7, 6, 10, 21, 28, 14, 10, 8, 7, 8, 9, 7, 6, 3];
  var monthDates = ['08/24', '08/25', '08/26', '08/27', '08/28', '08/29', '08/30', '08/31', '09/01', '09/02', '09/03', '09/04', '09/05', '09/06', '09/07', '09/08', '09/09', '09/10', '09/11', '09/12', '09/13', '09/14', '09/15', '09/16', '09/17', '09/18', '09/19', '09/20', '09/21', '09/22'];
  var monthSuccess = [38, 41, 39, 42, 40, 43, 44, 41, 42, 45, 43, 46, 44, 45, 47, 46, 48, 47, 45, 49, 48, 50, 47, 49, 51, 48, 50, 47, 49, 46];
  var monthFailed = [1, 0, 1, 0, 2, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 2, 0, 0, 1, 0, 1, 0, 2, 1, 2, 1, 3];

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (char) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char];
    });
  }

  function durationText(seconds) {
    return Math.floor(seconds / 60) + '分' + String(seconds % 60).padStart(2, '0') + '秒';
  }

  function panel(title, body, cls, actions) {
    return '<section class="mo-panel ' + (cls || '') + '"><div class="mo-panel-head"><h3>' + title + '</h3>' + (actions || '') + '</div>' + body + '</section>';
  }

  function renderAbnormalRows() {
    return abnormalTasks.map(function (task) {
      return '<tr><td title="' + esc(task[0]) + '">' + esc(task[0]) + '</td><td>' + esc(task[1]) + '</td><td><span class="mo-status-failed">执行失败</span></td><td>' + task[2] + '</td></tr>';
    }).join('');
  }

  function renderRankList(rows, kind) {
    var max = rows[0] ? rows[0][1] : 1;
    return '<div class="mo-rank-list">' + rows.map(function (row, index) {
      var width = Math.max(8, row[1] / max * 100);
      return '<div class="mo-rank-item"><span class="mo-rank-index' + (index < 3 ? ' is-top' : '') + '">' + (index + 1) + '</span><div class="mo-rank-main"><div class="mo-rank-line"><span title="' + esc(row[0]) + '">' + esc(row[0]) + '</span><b>' + (kind === 'duration' ? durationText(row[1]) : row[1] + '次') + '</b></div><div class="mo-rank-track"><i style="width:' + width.toFixed(1) + '%"></i></div></div></div>';
    }).join('') + '</div>';
  }

  function renderPage() {
    var durationActions = '<div class="mo-period-tabs" role="tablist" aria-label="任务执行时长日期"><button type="button" class="mo-period-tab active" role="tab" aria-selected="true" data-mo-period="yesterday">昨日</button><button type="button" class="mo-period-tab" role="tab" aria-selected="false" data-mo-period="today">今日</button></div>';
    var scheduleBody = '<div class="mo-schedule-body"><div class="mo-total">总任务：<b>43</b></div><div id="moScheduleChart" class="mo-schedule-chart"></div></div>';
    var abnormalBody = '<div class="mo-table-wrap"><table class="ds-table mo-abnormal-table"><colgroup><col><col style="width:120px"><col style="width:110px"><col style="width:170px"></colgroup><thead><tr><th>任务名称</th><th>任务类型</th><th>状态</th><th>时间</th></tr></thead><tbody>' + renderAbnormalRows() + '</tbody></table></div>';
    var durationBody = '<div id="moDurationList">' + renderRankList(durationRows.yesterday, 'duration') + '</div>';
    var failureBody = renderRankList(failureRows, 'failure');
    return '<div class="page-monitor-overview"><div class="mo-dashboard">' +
      '<div class="mo-dashboard-row">' + panel('调度任务', scheduleBody, 'mo-schedule-panel') + panel('异常任务列表', abnormalBody, 'mo-abnormal-panel') + '</div>' +
      '<div class="mo-dashboard-row">' + panel('任务执行时长TOP10', durationBody, 'mo-duration-panel', durationActions) + panel('任务执行分布趋势', '<div id="moDistributionChart" class="mo-chart"></div>', 'mo-chart-panel') + '</div>' +
      '<div class="mo-dashboard-row">' + panel('近一个月任务执行失败TOP10', failureBody, 'mo-failure-panel') + panel('近一个月调度任务执行状态趋势', '<div id="moStatusChart" class="mo-chart"></div>', 'mo-chart-panel') + '</div>' +
    '</div></div>';
  }

  function fallback(el, text) {
    if (el) el.innerHTML = '<div class="mo-chart-fallback"><i class="bi bi-bar-chart-line" aria-hidden="true"></i><span>' + text + '</span></div>';
  }

  function initScheduleChart() {
    var el = pageEl.querySelector('#moScheduleChart');
    if (!el) return;
    if (!window.echarts) { fallback(el, '图表组件加载后显示调度任务分布'); return; }
    scheduleChart = window.echarts.init(el);
    scheduleChart.setOption({
      color: ['#b8c2cf', '#1683ff', '#6d32df', '#ff5b52', '#21cf83'],
      tooltip: { trigger: 'item', formatter: '{b}：{c}（{d}%）' },
      legend: { bottom: 2, left: 'center', itemWidth: 12, itemHeight: 8, itemGap: 8, textStyle: { color: '#657184', fontSize: 11 }, data: ['未启动', '已启动', '未配置', '执行失败', '执行成功'] },
      series: [{
        name: '配置状态', type: 'pie', radius: ['0%', '43%'], center: ['50%', '43%'], avoidLabelOverlap: true,
        label: { show: true, position: 'inside', color: '#fff', fontSize: 11, formatter: function (params) { return params.name + '\n' + params.value + '\n' + params.percent + '%'; } },
        labelLine: { show: false },
        data: [{ value: 6, name: '未启动' }, { value: 33, name: '已启动' }, { value: 4, name: '未配置' }]
      }, {
        name: '执行状态', type: 'pie', radius: ['52%', '71%'], center: ['50%', '43%'],
        label: { color: '#657184', fontSize: 11, formatter: '{b}\n{c}' },
        labelLine: { length: 7, length2: 7, lineStyle: { color: '#a9b5c2' } },
        data: [{ value: 12, name: '执行失败' }, { value: 31, name: '执行成功' }]
      }]
    });
  }

  function commonTooltip(unit) {
    return {
      trigger: 'axis', confine: true, backgroundColor: 'rgba(255,255,255,.97)', borderColor: '#d8e4f2', borderWidth: 1,
      textStyle: { color: '#26384d', fontSize: 12 },
      formatter: function (params) { return '<b>' + params[0].axisValue + '</b><br>' + params.map(function (item) { return item.marker + item.seriesName + '：' + item.value + unit; }).join('<br>'); }
    };
  }

  function initDistributionChart() {
    var el = pageEl.querySelector('#moDistributionChart');
    if (!el) return;
    if (!window.echarts) { fallback(el, '图表组件加载后显示任务执行分布趋势'); return; }
    distributionChart = window.echarts.init(el);
    distributionChart.setOption({
      color: ['#ff6b62', '#1683ff'],
      tooltip: commonTooltip('个'),
      legend: { top: 14, left: 'center', itemWidth: 16, itemHeight: 9, textStyle: { color: '#52667c', fontSize: 12 }, data: ['昨日', '今日'] },
      grid: { left: 54, right: 28, top: 58, bottom: 44 },
      xAxis: { type: 'category', boundaryGap: false, data: hours, axisTick: { show: false }, axisLine: { lineStyle: { color: '#b9c7d5' } }, axisLabel: { color: '#6f8298', interval: 1, fontSize: 11 } },
      yAxis: { type: 'value', name: '执行中任务数', minInterval: 1, nameTextStyle: { color: '#1683ff', fontSize: 12 }, axisLabel: { color: '#6f8298' }, splitLine: { lineStyle: { color: '#edf2f7', type: 'dashed' } } },
      series: [{ name: '昨日', type: 'line', smooth: true, symbol: 'none', lineStyle: { width: 2 }, areaStyle: { color: 'rgba(255,107,98,.10)' }, data: yesterdayDistribution }, { name: '今日', type: 'line', smooth: true, symbol: 'none', lineStyle: { width: 2 }, areaStyle: { color: 'rgba(22,131,255,.08)' }, data: todayDistribution }]
    });
  }

  function initStatusChart() {
    var el = pageEl.querySelector('#moStatusChart');
    if (!el) return;
    if (!window.echarts) { fallback(el, '图表组件加载后显示调度任务执行状态趋势'); return; }
    var errorRates = monthDates.map(function (_, index) {
      var total = monthSuccess[index] + monthFailed[index];
      return Number((monthFailed[index] / total * 100).toFixed(2));
    });
    statusChart = window.echarts.init(el);
    statusChart.setOption({
      color: ['#21cf83', '#ff5b52', '#f0b429'],
      tooltip: { trigger: 'axis', confine: true, backgroundColor: 'rgba(255,255,255,.97)', borderColor: '#d8e4f2', borderWidth: 1, textStyle: { color: '#26384d', fontSize: 12 } },
      legend: { top: 14, left: 'center', itemWidth: 16, itemHeight: 9, textStyle: { color: '#52667c', fontSize: 12 }, data: ['执行成功', '执行失败', '错误率'] },
      grid: { left: 56, right: 58, top: 58, bottom: 54 },
      xAxis: { type: 'category', data: monthDates, axisTick: { show: false }, axisLine: { lineStyle: { color: '#b9c7d5' } }, axisLabel: { color: '#6f8298', rotate: 38, interval: 1, fontSize: 10 } },
      yAxis: [{ type: 'value', name: '任务数', minInterval: 1, nameTextStyle: { color: '#1683ff', fontSize: 12 }, axisLabel: { color: '#6f8298' }, splitLine: { lineStyle: { color: '#edf2f7', type: 'dashed' } } }, { type: 'value', name: '百分比', min: 0, max: 100, interval: 20, nameTextStyle: { color: '#1683ff', fontSize: 12 }, axisLabel: { color: '#6f8298', formatter: '{value}%' }, splitLine: { show: false } }],
      series: [{ name: '执行成功', type: 'bar', barMaxWidth: 14, data: monthSuccess, itemStyle: { borderRadius: [3, 3, 0, 0] } }, { name: '执行失败', type: 'bar', barMaxWidth: 14, data: monthFailed, itemStyle: { borderRadius: [3, 3, 0, 0] } }, { name: '错误率', type: 'line', yAxisIndex: 1, smooth: true, symbol: 'none', lineStyle: { width: 2 }, areaStyle: { color: 'rgba(240,180,41,.10)' }, data: errorRates }]
    });
  }

  function disposeCharts() {
    if (resizeHandler) { window.removeEventListener('resize', resizeHandler); resizeHandler = null; }
    [scheduleChart, distributionChart, statusChart].forEach(function (chart) { if (chart) chart.dispose(); });
    scheduleChart = null;
    distributionChart = null;
    statusChart = null;
  }

  function bindEvents() {
    pageEl.addEventListener('click', function (event) {
      var button = event.target.closest('[data-mo-period]');
      if (!button) return;
      activeDurationPeriod = button.getAttribute('data-mo-period') || 'yesterday';
      pageEl.querySelectorAll('[data-mo-period]').forEach(function (item) {
        var active = item === button;
        item.classList.toggle('active', active);
        item.setAttribute('aria-selected', String(active));
      });
      var list = pageEl.querySelector('#moDurationList');
      if (list) list.innerHTML = renderRankList(durationRows[activeDurationPeriod], 'duration');
    });
  }

  return {
    html: renderPage(),
    init: function () {
      disposeCharts();
      pageEl = DP.contentArea.querySelector('.page-monitor-overview');
      if (!pageEl) return;
      activeDurationPeriod = 'yesterday';
      initScheduleChart();
      initDistributionChart();
      initStatusChart();
      bindEvents();
      resizeHandler = function () {
        if (scheduleChart) scheduleChart.resize();
        if (distributionChart) distributionChart.resize();
        if (statusChart) statusChart.resize();
      };
      window.addEventListener('resize', resizeHandler);
      window.setTimeout(resizeHandler, 0);
    }
  };
}());
