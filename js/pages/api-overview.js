/** 运维监控 / 运维概况 / API概览。 */
window.DP = window.DP || {};
DP.pages = DP.pages || {};

DP.pages.apiOverview = (function () {
  'use strict';

  var pageEl = null;
  var trendChart = null;
  var resizeHandler = null;

  var dates = ['08/23', '08/24', '08/25', '08/26', '08/27', '08/28', '08/29', '08/30', '08/31', '09/01', '09/02', '09/03', '09/04', '09/05', '09/06', '09/07', '09/08', '09/09', '09/10', '09/11', '09/12', '09/13', '09/14', '09/15', '09/16', '09/17', '09/18', '09/19', '09/20', '09/21', '09/22'];
  var callCounts = [58420, 62180, 60360, 64890, 67940, 71520, 69260, 73180, 74860, 72410, 76680, 79420, 82360, 78640, 81180, 83520, 80460, 84920, 87240, 85680, 89160, 91420, 88640, 92780, 94860, 93620, 97140, 95680, 100320, 78560, 86420];
  var errorCounts = [16, 14, 18, 15, 21, 19, 17, 20, 16, 22, 18, 17, 15, 23, 20, 16, 19, 14, 18, 16, 13, 17, 15, 19, 16, 14, 20, 17, 21, 21, 18];
  var responseTimes = [0.52, 0.48, 0.51, 0.47, 0.55, 0.50, 0.46, 0.49, 0.45, 0.53, 0.48, 0.44, 0.42, 0.51, 0.47, 0.45, 0.49, 0.43, 0.46, 0.41, 0.44, 0.48, 0.45, 0.43, 0.40, 0.42, 0.47, 0.44, 0.49, 0.54, 0.46];

  var rankings = {
    calls: {
      title: '被调用最多的接口 TOP10', label: '调用次数', unit: '次',
      rows: [['订单明细查询API', 184260], ['会员画像查询API', 162480], ['门店库存查询API', 148920], ['商品主数据查询API', 131760], ['物流轨迹查询API', 118430], ['区域维度信息API', 102680], ['营销活动效果API', 94820], ['客户工单查询API', 86540], ['财务结算结果API', 79260], ['供应商履约数据API', 68420]]
    },
    errors: {
      title: '异常数最多的接口 TOP10', label: '异常次数', unit: '次',
      rows: [['物流轨迹查询API', 46], ['门店库存查询API', 39], ['供应商履约数据API', 34], ['财务结算结果API', 31], ['会员画像查询API', 28], ['订单明细查询API', 25], ['营销活动效果API', 22], ['客户工单查询API', 18], ['商品主数据查询API', 15], ['区域维度信息API', 11]]
    },
    response: {
      title: '平均响应时长最多的接口 TOP10', label: '响应时长(秒)', unit: '秒', decimals: 2,
      rows: [['供应商履约数据API', 1.86], ['财务结算结果API', 1.62], ['营销活动效果API', 1.48], ['物流轨迹查询API', 1.37], ['会员画像查询API', 1.24], ['客户工单查询API', 1.12], ['订单明细查询API', 0.96], ['门店库存查询API', 0.88], ['商品主数据查询API', 0.72], ['区域维度信息API', 0.48]]
    },
    concurrency: {
      title: '并发数最多的接口 TOP10', label: '最大并发数', unit: '',
      rows: [['订单明细查询API', 286], ['门店库存查询API', 248], ['会员画像查询API', 226], ['商品主数据查询API', 198], ['物流轨迹查询API', 184], ['区域维度信息API', 166], ['营销活动效果API', 148], ['客户工单查询API', 132], ['财务结算结果API', 116], ['供应商履约数据API', 98]]
    },
    users: {
      title: '申请使用用户最多的接口 TOP10', label: '申请用户数', unit: '人',
      rows: [['区域维度信息API', 186], ['商品主数据查询API', 172], ['订单明细查询API', 158], ['会员画像查询API', 146], ['门店库存查询API', 132], ['物流轨迹查询API', 118], ['营销活动效果API', 104], ['客户工单查询API', 96], ['供应商履约数据API', 82], ['财务结算结果API', 74]]
    }
  };

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (char) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char];
    });
  }

  function formatNumber(value, decimals) {
    if (decimals != null) return Number(value).toFixed(decimals);
    return Number(value).toLocaleString('zh-CN');
  }

  function metricCard(icon, tone, label, value, unit, comparison, direction) {
    var directionClass = direction === 'down' ? 'is-down' : (direction === 'up' ? 'is-up' : 'is-flat');
    var directionIcon = direction === 'down' ? 'bi-arrow-down' : (direction === 'up' ? 'bi-arrow-up' : 'bi-dash');
    return '<article class="ao-metric-card ao-tone-' + tone + '">' +
      '<div class="ao-metric-icon"><i class="bi ' + icon + '" aria-hidden="true"></i></div>' +
      '<div class="ao-metric-main"><span class="ao-metric-label">' + label + '</span><div class="ao-metric-value">' + value + (unit ? '<em>' + unit + '</em>' : '') + '</div></div>' +
      '<div class="ao-metric-compare"><span>较昨日</span><b class="' + directionClass + '"><i class="bi ' + directionIcon + '" aria-hidden="true"></i>' + comparison + '</b></div>' +
    '</article>';
  }

  function renderRanking(key) {
    var item = rankings[key];
    var rows = item.rows.map(function (row, index) {
      return '<li><span class="ao-rank-no' + (index < 3 ? ' is-top' : '') + '">' + (index + 1) + '</span><span class="ao-rank-name" title="' + esc(row[0]) + '">' + esc(row[0]) + '</span><b>' + formatNumber(row[1], item.decimals) + '</b></li>';
    }).join('');
    return '<article class="ao-ranking-card"><div class="ao-ranking-head"><h4>' + item.title + '</h4><button type="button" data-ao-more="' + key + '"><i class="bi bi-arrow-right-circle" aria-hidden="true"></i><span>更多</span></button></div>' +
      '<div class="ao-ranking-columns"><span>接口名称</span><span>' + item.label + '</span></div><ol class="ao-ranking-list">' + rows + '</ol></article>';
  }

  function renderPage() {
    var callsDelta = callCounts[30] - callCounts[29];
    var errorsDelta = errorCounts[30] - errorCounts[29];
    var responseDelta = Number((responseTimes[30] - responseTimes[29]).toFixed(2));
    return '<div class="page-api-overview"><div class="ao-page-inner">' +
      '<section class="ao-panel ao-metrics-panel"><div class="ao-panel-head"><h3>API概览</h3></div><div class="ao-metric-grid">' +
        metricCard('bi-exclamation-octagon', 'danger', '今日异常数', formatNumber(errorCounts[30]), '', formatNumber(Math.abs(errorsDelta)), errorsDelta < 0 ? 'down' : (errorsDelta > 0 ? 'up' : 'flat')) +
        metricCard('bi-bar-chart-line', 'success', '今日总调用次数', formatNumber(callCounts[30]), '', formatNumber(Math.abs(callsDelta)), callsDelta < 0 ? 'down' : (callsDelta > 0 ? 'up' : 'flat')) +
        metricCard('bi-stopwatch', 'primary', '今日平均响应时间', formatNumber(responseTimes[30], 2), '秒', formatNumber(Math.abs(responseDelta), 2) + '秒', responseDelta < 0 ? 'down' : (responseDelta > 0 ? 'up' : 'flat')) +
        metricCard('bi-plug', 'warning', '总API数', '42', '', '2', 'up') +
      '</div></section>' +
      '<section class="ao-panel ao-trend-panel"><div class="ao-panel-head"><h3>近1个月运行趋势</h3></div><div id="aoTrendChart" class="ao-trend-chart"></div></section>' +
      '<section class="ao-panel ao-analysis-panel"><div class="ao-panel-head"><h3>近1个月统计分析</h3></div><div class="ao-ranking-scroll"><div class="ao-ranking-grid">' +
        renderRanking('calls') + renderRanking('errors') + renderRanking('response') + renderRanking('concurrency') + renderRanking('users') +
      '</div></div></section>' +
      '<div class="ao-modal" data-ao-modal hidden><div class="ao-modal-mask" data-ao-close></div><section class="ao-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="aoModalTitle"><div class="ao-modal-head"><h3 id="aoModalTitle"></h3><button type="button" class="ao-modal-x" data-ao-close aria-label="关闭"><i class="bi bi-x-lg" aria-hidden="true"></i></button></div><div class="ao-modal-body" data-ao-modal-body></div><div class="ao-modal-foot"><button type="button" class="btn btn-default" data-ao-close><i class="bi bi-x-lg" aria-hidden="true"></i><span>关闭</span></button></div></section></div>' +
    '</div></div>';
  }

  function initTrendChart() {
    var el = pageEl.querySelector('#aoTrendChart');
    if (!el) return;
    if (!window.echarts) {
      el.innerHTML = '<div class="ao-chart-fallback"><i class="bi bi-bar-chart-line" aria-hidden="true"></i><span>图表组件加载后显示近1个月运行趋势</span></div>';
      return;
    }
    trendChart = window.echarts.init(el);
    trendChart.setOption({
      color: ['#20c985', '#ff6159', '#f0b429'],
      tooltip: {
        trigger: 'axis', confine: true, backgroundColor: 'rgba(255,255,255,.98)', borderColor: '#d8e4f2', borderWidth: 1,
        textStyle: { color: '#26384d', fontSize: 12 },
        formatter: function (params) {
          return '<b>' + params[0].axisValue + '</b><br>' + params.map(function (item) {
            var value = item.seriesName === '平均响应时间' ? Number(item.value).toFixed(2) + '秒' : Number(item.value).toLocaleString('zh-CN') + '次';
            return item.marker + item.seriesName + '：' + value;
          }).join('<br>');
        }
      },
      legend: { top: 15, left: 'center', itemWidth: 17, itemHeight: 9, itemGap: 22, textStyle: { color: '#52667c', fontSize: 12 }, data: ['总调用数', '异常数', '平均响应时间'] },
      grid: { left: 68, right: 76, top: 62, bottom: 54 },
      xAxis: { type: 'category', data: dates, axisTick: { show: false }, axisLine: { lineStyle: { color: '#b9c7d5' } }, axisLabel: { color: '#6f8298', rotate: 36, interval: 1, fontSize: 10 } },
      yAxis: [{
        type: 'value', name: '次数', min: 0, nameTextStyle: { color: '#52667c', fontSize: 12 }, axisLabel: { color: '#6f8298', formatter: function (value) { return value >= 10000 ? value / 10000 + '万' : value; } }, splitLine: { lineStyle: { color: '#edf2f7', type: 'dashed' } }
      }, {
        type: 'value', name: '平均响应时间(秒)', min: 0, max: 1, interval: 0.2, nameTextStyle: { color: '#52667c', fontSize: 12 }, axisLabel: { color: '#6f8298', formatter: '{value}' }, splitLine: { show: false }
      }],
      series: [{ name: '总调用数', type: 'bar', barMaxWidth: 14, data: callCounts, itemStyle: { borderRadius: [2, 2, 0, 0] } }, { name: '异常数', type: 'bar', barMaxWidth: 8, data: errorCounts, itemStyle: { borderRadius: [2, 2, 0, 0] } }, { name: '平均响应时间', type: 'line', yAxisIndex: 1, smooth: true, symbol: 'circle', symbolSize: 4, lineStyle: { width: 2 }, data: responseTimes }]
    });
  }

  function closeModal() {
    var modal = pageEl && pageEl.querySelector('[data-ao-modal]');
    if (modal) modal.hidden = true;
  }

  function openModal(key) {
    var item = rankings[key];
    var modal = pageEl.querySelector('[data-ao-modal]');
    if (!item || !modal) return;
    modal.querySelector('#aoModalTitle').textContent = item.title;
    modal.querySelector('[data-ao-modal-body]').innerHTML = '<table class="ds-table ao-detail-table"><thead><tr><th style="width:72px">排名</th><th>接口名称</th><th style="width:160px">' + item.label + '</th></tr></thead><tbody>' + item.rows.map(function (row, index) {
      return '<tr><td><span class="ao-rank-no' + (index < 3 ? ' is-top' : '') + '">' + (index + 1) + '</span></td><td>' + esc(row[0]) + '</td><td>' + formatNumber(row[1], item.decimals) + (item.unit ? ' ' + item.unit : '') + '</td></tr>';
    }).join('') + '</tbody></table>';
    modal.hidden = false;
    var closeButton = modal.querySelector('.ao-modal-x');
    if (closeButton) closeButton.focus();
  }

  function bindEvents() {
    pageEl.addEventListener('click', function (event) {
      var more = event.target.closest('[data-ao-more]');
      if (more) { openModal(more.getAttribute('data-ao-more')); return; }
      if (event.target.closest('[data-ao-close]')) closeModal();
    });
    pageEl.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') closeModal();
    });
  }

  function dispose() {
    if (resizeHandler) { window.removeEventListener('resize', resizeHandler); resizeHandler = null; }
    if (trendChart) { trendChart.dispose(); trendChart = null; }
  }

  return {
    html: renderPage(),
    init: function () {
      dispose();
      pageEl = DP.contentArea.querySelector('.page-api-overview');
      if (!pageEl) return;
      initTrendChart();
      bindEvents();
      resizeHandler = function () { if (trendChart) trendChart.resize(); };
      window.addEventListener('resize', resizeHandler);
      window.setTimeout(resizeHandler, 0);
    }
  };
}());
