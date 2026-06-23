/**
 * 数据中台 V4.0 - 数据资产 / 数据质量 / 质量分析
 */
window.DP = window.DP || {};
DP.pages = DP.pages || {};

DP.pages.dataQualityAnalysis = (function () {
  var pageEl = null;
  var gaugeChart = null;
  var trendChart = null;
  var resizeHandler = null;
  var activeScoreTab = 'high';

  var overview = {
    score: 87.6,
    rules: 32,
    tasks: 18,
    databases: 12,
    tables: 86,
    total: 38052253,
    passed: 36515722,
    failed: 1536531,
    failedRate: 4.04
  };

  var dimensions = [
    { name: '完整性', value: 91.8, state: 'good' },
    { name: '有效性', value: 96.0, state: 'good' },
    { name: '及时性', value: 88.4, state: 'mid' },
    { name: '一致性', value: 82.6, state: 'mid' },
    { name: '准确性', value: 93.5, state: 'good' },
    { name: '唯一性', value: 79.2, state: 'warn' }
  ];

  var scoreRows = {
    high: [
      { name: '业务系统/中电数治业务系统', score: 96.8 },
      { name: '业务系统/工单系统', score: 94.6 },
      { name: '数仓库/zz_tms_dim/dim_city_area', score: 93.2 },
      { name: '数仓库/zz_tms_dwd/dwd_order_detail_di', score: 91.7 },
      { name: '数仓库/zz_tms_dws/dws_driver_quality_1d', score: 90.5 },
      { name: '主数据管理/customer_master', score: 89.4 },
      { name: '数据集/订单按天取件状态分布', score: 88.9 },
      { name: '经营分析/ads_sales_daily_report', score: 87.8 },
      { name: '公共域/dim_region_area', score: 86.9 },
      { name: '支付结算/dwd_payment_record_di', score: 85.6 }
    ],
    low: [
      { name: '业务系统/历史订单归档库', score: 62.4 },
      { name: 'ODS/ods_user_address/user_phone', score: 65.1 },
      { name: '贴源库/ods_payment_record/pay_channel', score: 67.8 },
      { name: '工单系统/aierp_pro_test/ticket_event', score: 69.6 },
      { name: '物流系统/tms_waybill_info', score: 71.3 },
      { name: '仿真数据/demo_order_archive', score: 72.8 },
      { name: '用户画像/customer_profile_tag', score: 74.2 },
      { name: 'ODS/ods_member_address_df', score: 75.6 },
      { name: '财务域/finance_settle_detail', score: 76.9 },
      { name: '供应链/supplier_delivery_record', score: 78.1 }
    ]
  };

  var rectifyRows = [
    row('业务系统/中电数治业务系统/tms_waybill_info', 1025602, 2291, 8, 7, 87.5),
    row('业务系统/工单系统/aierp_pro_test', 77008, 4809, 5, 2, 40.0),
    row('数仓库/zz_tms_dwd/dwd_order_detail_di', 9321500, 168320, 16, 12, 75.0),
    row('数仓库/zz_tms_dim/dim_city_area', 186420, 612, 3, 3, 100.0),
    row('业务系统/用户画像/customer_profile_tag', 3507820, 42716, 9, 6, 66.7),
    row('ODS/ods_payment_record/pay_channel', 1187560, 38524, 7, 4, 57.1)
  ];

  var trendData = {
    title: '近1年质量趋势分析',
    x: ['2025-07', '2025-08', '2025-09', '2025-10', '2025-11', '2025-12', '2026-01', '2026-02', '2026-03', '2026-04', '2026-05', '2026-06'],
    pass: [18600000, 19420000, 20760000, 21950000, 23580000, 24810000, 25640000, 26720000, 28390000, 31260000, 34150000, 36515722],
    fail: [1120000, 1055000, 982000, 912000, 846000, 778000, 720000, 652000, 584000, 501000, 432000, 1536531],
    score: [72.6, 74.8, 77.1, 79.5, 81.2, 82.9, 84.1, 85.3, 86.1, 86.8, 87.2, 87.6],
    mom: [70.2, 73.1, 75.6, 78.0, 79.8, 81.6, 83.0, 84.2, 85.4, 86.1, 86.9, 87.4],
    yoy: [68.4, 70.5, 72.8, 75.3, 77.6, 79.2, 80.8, 82.5, 83.7, 84.9, 85.8, 86.3]
  };

  function row(name, total, problem, submitted, handled, rate) {
    return {
      name: name,
      total: total,
      problem: problem,
      submitted: submitted,
      handled: handled,
      rate: rate
    };
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function formatNumber(value) {
    return Number(value || 0).toLocaleString('zh-CN');
  }

  function shortNumber(value) {
    value = Number(value || 0);
    if (value >= 100000000) return (value / 100000000).toFixed(1) + '亿';
    if (value >= 10000) return Math.round(value / 10000) + '万';
    return String(value);
  }

  function renderMetric(label, value, state) {
    return '<div class="dqa-metric dqa-metric-' + state + '">' +
      '<div class="dqa-metric-value">' + escapeHtml(value) + '</div>' +
      '<div class="dqa-metric-label">' + escapeHtml(label) + '</div>' +
    '</div>';
  }

  function renderTile(icon, label, value) {
    return '<div class="dqa-tile">' +
      '<i class="bi ' + icon + '"></i>' +
      '<div><span>' + escapeHtml(label) + '</span><b>' + escapeHtml(value) + '</b></div>' +
    '</div>';
  }

  function renderDimensionRows() {
    return dimensions.map(function (item, index) {
      return '<div class="dqa-dimension-row">' +
        '<span class="dqa-dimension-rank">' + (index + 1) + '</span>' +
        '<span class="dqa-dimension-name">' + escapeHtml(item.name) + '</span>' +
        '<span class="dqa-dimension-line"><i class="dqa-dimension-fill dqa-fill-' + item.state + '" style="width:' + item.value + '%;"></i></span>' +
        '<b class="dqa-dimension-score dqa-score-' + item.state + '">' + item.value.toFixed(1) + '分</b>' +
      '</div>';
    }).join('');
  }

  function renderScoreRows(type) {
    type = type || activeScoreTab;
    return (scoreRows[type] || scoreRows.high).map(function (item, index) {
      var colorClass = type === 'high' ? 'dqa-score-high' : 'dqa-score-low';
      return '<div class="dqa-score-row">' +
        '<span class="dqa-score-rank">' + (index + 1) + '</span>' +
        '<div class="dqa-score-main">' +
          '<div class="dqa-score-name" title="' + escapeHtml(item.name) + '">' + escapeHtml(item.name) + '</div>' +
          '<div class="dqa-score-track"><i class="' + colorClass + '" style="width:' + item.score + '%;"></i></div>' +
        '</div>' +
        '<b class="' + colorClass + '">' + item.score.toFixed(1) + '</b>' +
      '</div>';
    }).join('');
  }

  function renderRectifyRows() {
    return rectifyRows.map(function (item, index) {
      return '<tr>' +
        '<td>' + (index + 1) + '</td>' +
        '<td title="' + escapeHtml(item.name) + '">' + escapeHtml(item.name) + '</td>' +
        '<td>' + formatNumber(item.total) + '</td>' +
        '<td>' + formatNumber(item.problem) + '</td>' +
        '<td>' + item.submitted + '</td>' +
        '<td>' + item.handled + '</td>' +
        '<td><div class="dqa-table-rate"><span><i style="width:' + item.rate + '%;"></i></span><b>' + item.rate.toFixed(2) + '%</b></div></td>' +
      '</tr>';
    }).join('');
  }

  function renderPage() {
    return '<div class="page-data-quality-analysis">' +
      '<div class="dqa-dashboard-grid">' +
        '<section class="dqa-panel dqa-overview-panel">' +
          '<div class="dqa-panel-head">' +
            '<div class="dqa-panel-title"><span>近1月概况</span></div>' +
          '</div>' +
          '<div class="dqa-overview-body">' +
            '<div class="dqa-gauge-wrap">' +
              '<div id="dqaGauge" class="dqa-gauge"></div>' +
              '<div class="dqa-tile-grid">' +
                renderTile('bi-shield-check', '质量规则', overview.rules) +
                renderTile('bi-clipboard2-check', '质量任务', overview.tasks) +
                renderTile('bi-database-check', '稽查库', overview.databases) +
                renderTile('bi-table', '稽查表', overview.tables) +
              '</div>' +
            '</div>' +
            '<div class="dqa-dimension-list">' + renderDimensionRows() + '</div>' +
          '</div>' +
          '<div class="dqa-metric-strip">' +
            renderMetric('总记录数', formatNumber(overview.total), 'blue') +
            renderMetric('符合规则', formatNumber(overview.passed), 'green') +
            renderMetric('不符合规则', formatNumber(overview.failed), 'red') +
            renderMetric('不符合率', overview.failedRate.toFixed(2) + '%', 'orange') +
          '</div>' +
        '</section>' +
        '<section class="dqa-panel dqa-trend-panel">' +
          '<div class="dqa-panel-head">' +
            '<div class="dqa-panel-title"><span>近1年质量趋势分析</span></div>' +
          '</div>' +
          '<div class="dqa-chart-wrap">' +
            '<div class="dqa-chart-corner dqa-chart-left">记录数：条</div>' +
            '<div class="dqa-chart-corner dqa-chart-right">评分：分</div>' +
            '<div id="dqaTrendChart" class="dqa-trend-chart"></div>' +
          '</div>' +
        '</section>' +
        '<section class="dqa-panel dqa-score-panel">' +
          '<div class="dqa-panel-head">' +
            '<div class="dqa-panel-title"><span>Top10 数据质量评分</span></div>' +
            '<div class="dqa-score-tabs">' +
              '<button class="dqa-score-tab active" type="button" data-dqa-score-tab="high">高分榜</button>' +
              '<button class="dqa-score-tab" type="button" data-dqa-score-tab="low">低分榜</button>' +
            '</div>' +
          '</div>' +
          '<div class="dqa-score-list" id="dqaScoreList">' + renderScoreRows('high') + '</div>' +
        '</section>' +
        '<section class="dqa-panel dqa-rectify-panel">' +
          '<div class="dqa-panel-head">' +
            '<div class="dqa-panel-title"><span>Top10 数据整改情况统计</span></div>' +
          '</div>' +
          '<div class="dqa-table-wrap">' +
            '<table class="ds-table dqa-rectify-table">' +
              '<colgroup><col style="width:54px"><col><col style="width:135px"><col style="width:150px"><col style="width:90px"><col style="width:100px"><col style="width:190px"></colgroup>' +
              '<thead><tr><th>序号</th><th>数据源名称</th><th>稽查总记录数</th><th>问题稽查总记录数</th><th>提交工单</th><th>已处理工单</th><th>处理完成率</th></tr></thead>' +
              '<tbody>' + renderRectifyRows() + '</tbody>' +
            '</table>' +
          '</div>' +
        '</section>' +
      '</div>' +
    '</div>';
  }

  function disposeCharts() {
    if (resizeHandler) {
      window.removeEventListener('resize', resizeHandler);
      resizeHandler = null;
    }
    if (gaugeChart) {
      gaugeChart.dispose();
      gaugeChart = null;
    }
    if (trendChart) {
      trendChart.dispose();
      trendChart = null;
    }
  }

  function initGauge() {
    var el = pageEl.querySelector('#dqaGauge');
    if (!el) return;
    if (!window.echarts) {
      el.innerHTML = '<div class="dqa-chart-fallback">ECharts 加载后显示评分仪表盘</div>';
      return;
    }
    gaugeChart = window.echarts.init(el);
    gaugeChart.setOption({
      series: [{
        type: 'gauge',
        startAngle: 180,
        endAngle: 0,
        min: 0,
        max: 100,
        center: ['50%', '74%'],
        radius: '92%',
        splitNumber: 10,
        axisLine: {
          lineStyle: {
            width: 10,
            color: [[0.6, '#ff6b5f'], [0.75, '#f6b322'], [0.9, '#1683ff'], [1, '#27c66d']]
          }
        },
        pointer: {
          icon: 'path://M0 -3 L78 0 L0 3 Z',
          length: '54%',
          width: 4,
          offsetCenter: [0, '-5%'],
          itemStyle: { color: '#1683ff' }
        },
        axisTick: {
          distance: -18,
          length: 5,
          lineStyle: { color: '#fff', width: 1 }
        },
        splitLine: {
          distance: -22,
          length: 10,
          lineStyle: { color: '#fff', width: 2 }
        },
        axisLabel: {
          distance: -3,
          color: '#7b8fa8',
          fontSize: 11
        },
        anchor: { show: true, size: 7, itemStyle: { color: '#1683ff' } },
        title: {
          offsetCenter: [0, '22%'],
          color: '#52667c',
          fontSize: 12
        },
        detail: {
          valueAnimation: true,
          offsetCenter: [0, '-12%'],
          formatter: function (value) { return Number(value).toFixed(1) + '分'; },
          color: '#ff6b5f',
          fontSize: 22,
          fontWeight: 700
        },
        data: [{ value: overview.score, name: '总体评分' }]
      }]
    });
  }

  function getTrendOption() {
    var data = trendData;
    return {
      color: ['#24c875', '#ff5b52', '#f6b322', '#ff837a', '#4d91ff'],
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(255,255,255,0.97)',
        borderColor: '#d8e4f2',
        borderWidth: 1,
        textStyle: { color: '#26384d', fontSize: 12 },
        axisPointer: { type: 'cross', crossStyle: { color: '#8aa0b7' } },
        formatter: function (params) {
          var title = params[0] ? params[0].axisValue : '';
          return '<b>' + title + '</b><br>' + params.map(function (item) {
            var value = item.seriesType === 'bar' ? formatNumber(item.value) + ' 条' : Number(item.value).toFixed(1) + ' 分';
            return item.marker + item.seriesName + '：' + value;
          }).join('<br>');
        }
      },
      legend: {
        top: 24,
        left: 'center',
        itemWidth: 18,
        itemHeight: 10,
        textStyle: { color: '#4d5e73', fontSize: 12 },
        data: ['符合规则', '不符合规则', '评分', '环比评分', '同比评分']
      },
      grid: { left: 78, right: 58, top: 78, bottom: 42 },
      xAxis: [{
        type: 'category',
        data: data.x,
        axisPointer: { type: 'shadow' },
        axisTick: { show: false },
        axisLine: { lineStyle: { color: '#dfe6ef' } },
        axisLabel: { color: '#687d94', fontSize: 12 }
      }],
      yAxis: [{
        type: 'value',
        min: 0,
        axisLabel: {
          color: '#687d94',
          formatter: function (value) { return shortNumber(value); }
        },
        splitLine: { lineStyle: { color: '#e8eef6', type: 'dashed' } }
      }, {
        type: 'value',
        min: 0,
        max: 100,
        interval: 20,
        axisLabel: { color: '#687d94' },
        splitLine: { show: false }
      }],
      series: [
        { name: '符合规则', type: 'bar', barWidth: 18, stack: 'records', data: data.pass, itemStyle: { borderRadius: [3, 3, 0, 0] } },
        { name: '不符合规则', type: 'bar', barWidth: 18, stack: 'records', data: data.fail, itemStyle: { borderRadius: [3, 3, 0, 0] } },
        { name: '评分', type: 'line', yAxisIndex: 1, smooth: true, symbol: 'circle', symbolSize: 7, lineStyle: { width: 2 }, data: data.score },
        { name: '环比评分', type: 'line', yAxisIndex: 1, smooth: true, symbol: 'circle', symbolSize: 7, lineStyle: { width: 2 }, data: data.mom },
        { name: '同比评分', type: 'line', yAxisIndex: 1, smooth: true, symbol: 'circle', symbolSize: 7, lineStyle: { width: 2 }, data: data.yoy }
      ]
    };
  }

  function initTrendChart() {
    var el = pageEl.querySelector('#dqaTrendChart');
    if (!el) return;
    if (!window.echarts) {
      el.innerHTML = '<div class="dqa-chart-fallback">ECharts 加载后显示质量趋势图</div>';
      return;
    }
    trendChart = window.echarts.init(el);
    trendChart.setOption(getTrendOption(), true);
  }

  function bindEvents() {
    pageEl.addEventListener('click', function (event) {
      var scoreTab = event.target.closest('[data-dqa-score-tab]');
      if (scoreTab && pageEl.contains(scoreTab)) {
        activeScoreTab = scoreTab.getAttribute('data-dqa-score-tab') || 'high';
        pageEl.querySelectorAll('[data-dqa-score-tab]').forEach(function (btn) {
          btn.classList.toggle('active', btn === scoreTab);
        });
        var list = pageEl.querySelector('#dqaScoreList');
        if (list) list.innerHTML = renderScoreRows(activeScoreTab);
      }
    });
  }

  return {
    html: renderPage(),

    init: function () {
      disposeCharts();
      pageEl = document.querySelector('.page-data-quality-analysis');
      if (!pageEl) return;
      activeScoreTab = 'high';
      initGauge();
      initTrendChart();
      resizeHandler = function () {
        if (gaugeChart) gaugeChart.resize();
        if (trendChart) trendChart.resize();
      };
      window.addEventListener('resize', resizeHandler);
      window.setTimeout(resizeHandler, 0);
      bindEvents();
    }
  };
})();
