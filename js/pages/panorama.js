(function () {
  'use strict';

  var content = document.getElementById('panoramaContent');
  var navItems = Array.prototype.slice.call(document.querySelectorAll('.pano-nav-item'));
  var toastEl = document.getElementById('panoToast');
  var chartInstances = [];
  var currentView = 'warehouse';
  var toastTimer = null;

  var colors = {
    blue: '#4b78c9',
    lightBlue: '#75c4ef',
    cyan: '#12b8ba',
    orange: '#ff784d',
    yellow: '#f3b400',
    green: '#58b800',
    red: '#e0001b',
    line: '#ff8d13',
    grid: '#d8d8d8',
    axis: '#3b98d4'
  };

  var layerNames = ['贴源层（ODS）', '明细层（DWD）', '主题层（DWS）', '应用层（ADS）'];
  var businessNames = ['客户主题', '订单主题', '商品主题', '供应链主题', '财务主题', '组织主题', '营销主题', '渠道主题', '履约主题', '售后主题', '会员主题', '库存主题'];
  var databaseNames = ['核心业务库', '客户中心库', '商品中心库', '订单中心库', '供应链库', '结算中心库', '营销中心库', '主数据管理库', '日志分析库', '经营分析库', '风控业务库', '归档数据库'];

  function formatNumber(value) {
    return Number(value).toLocaleString('zh-CN');
  }

  function showToast(message) {
    clearTimeout(toastTimer);
    toastEl.textContent = message;
    toastEl.classList.add('show');
    toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 1800);
  }

  function kpis(items) {
    return '<section class="pano-kpis" style="--kpi-count:' + items.length + '">' + items.map(function (item) {
      return '<div class="pano-kpi"><i class="bi ' + item[0] + '" aria-hidden="true"></i><div class="pano-kpi-copy"><div class="pano-kpi-label">' + item[1] + '</div><div class="pano-kpi-value">' + item[2] + '</div></div></div>';
    }).join('') + '</section>';
  }

  function panel(title, body, extraClass, tools) {
    return '<section class="pano-panel ' + (extraClass || '') + '"><div class="pano-panel-head"><span class="pano-panel-title">' + title + '</span>' + (tools || '') + '</div>' + body + '</section>';
  }

  function chartPanel(title, id, chartClass, drillable) {
    var back = drillable ? '<span class="pano-panel-tools"><button class="pano-drill-back" type="button" data-drill-back="' + id + '" hidden><i class="bi bi-arrow-up-left"></i>返回上级</button></span>' : '';
    return '<section class="pano-panel" data-chart-panel="' + id + '"><div class="pano-panel-head"><span class="pano-panel-title" data-chart-title="' + id + '">' + title + '</span>' + back + '</div><div id="' + id + '" class="pano-chart ' + (chartClass || '') + '" data-drillable="' + (drillable ? 'true' : 'false') + '"></div></section>';
  }

  function miniMetrics(items) {
    return '<div class="pano-mini-metrics">' + items.map(function (item) {
      return '<div class="pano-mini-metric"><i class="bi ' + item[0] + '" aria-hidden="true"></i><div class="pano-mini-copy"><div class="pano-mini-label">' + item[1] + '</div><div class="pano-mini-value">' + item[2] + (item[3] ? '<small>' + item[3] + '</small>' : '') + '</div></div></div>';
    }).join('') + '</div>';
  }

  function overviewPanel(title, chartId, centerLabel, centerValue, metrics) {
    return panel(title, '<div class="pano-overview-body"><div id="' + chartId + '" class="pano-chart gauge-chart"></div>' + miniMetrics(metrics) + '</div>');
  }

  function rankingRows() {
    var rates = ['33.78%', '28.69%', '22.65%', '12.69%', '10.89%', '9.66%', '8.65%', '7.23%', '6.26%', '5.86%'];
    return rates.map(function (rate, index) {
      return '<div class="pano-ranking-row"><span><i class="bi bi-file-earmark-text"></i>供应链业务线' + (index + 1) + '</span><span class="counts">100/<b class="pass">' + (76 - index) + '</b>/<b class="fail">' + (24 + index) + '</b></span><span class="rate">' + rate + '</span></div>';
    }).join('');
  }

  function topList(prefix, icon) {
    var values = ['100,016', '99,901', '97,311', '97,228', '95,332', '89,127', '77,079', '67,885', '67,186', '63,882'];
    return values.map(function (value, index) {
      return '<div class="pano-list-row"><i class="bi ' + icon + '"></i><span>' + prefix + (index + 1) + '</span><b>' + value + '</b></div>';
    }).join('');
  }

  function renderWarehouse() {
    return '<div class="pano-view">' +
      kpis([
        ['bi-hdd-stack', '数据库实例', '12个'], ['bi-database-fill', '数据库', '80个'], ['bi-table', '表', '20.36万张'], ['bi-braces', '字段', '256.23万个'], ['bi-globe2', '数据记录', '100,962万条']
      ]) +
      '<div class="pano-grid two">' +
        panel('数据资产统计概况', '<div class="pano-funnel-layout"><div id="whFunnel" class="pano-chart compact"></div><div class="pano-funnel-list"><span><b style="color:#4d7dcc">业务库</b><strong>1,548万</strong></span><span><b style="color:#2dc82d">贴源层（ODS）</b><strong>835万</strong></span><span><b style="color:#cc5bcb">明细层（DWD）</b><strong>634万</strong></span><span><b style="color:#71bce9">主题层（DWS）</b><strong>410万</strong></span><span><b style="color:#ff784d">应用层（ADS）</b><strong>235万</strong></span></div></div>') +
        chartPanel('业务库统计分析', 'whBusiness', '', true) +
      '</div>' +
      '<div class="pano-grid two">' + overviewPanel('贴源层概况', 'whOdsRing', '贴源库', '15', [['bi-database-fill', '库', '15'], ['bi-table', '表数量', '1,286'], ['bi-globe2', '数据记录', '38,962', '万']]) + chartPanel('贴源层统计分析', 'whOds', '', true) + '</div>' +
      '<div class="pano-grid two">' + overviewPanel('公共层概况', 'whDwdRing', '公共库', '12', [['bi-database-fill', '库', '12'], ['bi-table', '表数量', '862'], ['bi-globe2', '数据记录', '26,418', '万']]) + chartPanel('公共层统计分析', 'whDwd', '', true) + '</div>' +
      '<div class="pano-grid two">' + overviewPanel('应用层概况', 'whAdsRing', '应用库', '8', [['bi-database-fill', '库', '8'], ['bi-table', '表数量', '492'], ['bi-globe2', '数据记录', '6,962', '万']]) + chartPanel('应用层统计分析', 'whAds', '', true) + '</div>' +
    '</div>';
  }

  function renderDevelop() {
    return '<div class="pano-view">' +
      kpis([
        ['bi-people', '项目人员', '12个'], ['bi-database-fill', '项目资源', '88'], ['bi-table', '项目总数', '12个'], ['bi-diagram-3', '总任务数', '180个'], ['bi-arrow-repeat', '流程总数', '800个'], ['bi-play-circle', '已启动任务', '128个'], ['bi-broadcast', '流式处理', '20个'], ['bi-clipboard2-check', '已启动流式任务', '18个']
      ]) +
      '<div class="pano-grid two">' + overviewPanel('数据采集概况', 'devCollectRing', '已启动/未启动', '66/82', [['bi-hdd-stack', '批量采集', '34/40'], ['bi-table', '流式采集', '30/40'], ['bi-globe2', '数据同步（FlinkCDC）', '2/2']]) + chartPanel('数据采集-项目分析（Top20）', 'devCollect', '', false) + '</div>' +
      '<div class="pano-grid two">' + overviewPanel('批量处理概况', 'devBatchRing', '已启动/未启动', '66/82', [['bi-clipboard2-check', '在线编程', '40/40'], ['bi-table', '上传程序包', '24/40'], ['bi-globe2', '数据治理（数治）', '2/2']]) + chartPanel('批量处理-项目分析（Top20）', 'devBatch', '', false) + '</div>' +
      '<div class="pano-grid two">' + overviewPanel('流式处理概况', 'devStreamRing', '已启动/未启动', '8/15', [['bi-clipboard2-check', '在线编程', '6/8'], ['bi-table', '上传程序包', '2/7'], ['bi-globe2', '流式处理（数易）', '0/0']]) + chartPanel('流式处理-项目分析（Top20）', 'devStream', '', false) + '</div>' +
      '<div class="pano-grid two">' + overviewPanel('任务调度概况', 'devScheduleRing', '调度任务', '128', [['bi-hdd-stack', '数据采集', '100'], ['bi-table', '数据处理', '20'], ['bi-globe2', '综合任务', '8']]) + chartPanel('调度任务-项目分析（Top20）', 'devSchedule', '', false) + '</div>' +
    '</div>';
  }

  function renderStandard() {
    return '<div class="pano-view">' +
      '<div class="pano-grid two-balanced">' +
        panel('数据标准概要统计', '<div class="pano-standard-summary">' + miniMetrics([['bi-database-fill', '库', '33'], ['bi-table', '表数量', '2,626'], ['bi-globe2', '字段', '56,396']]) + '<div id="stdOverview" class="pano-chart tall" data-drillable="true"></div></div>', '', '<span class="pano-panel-tools"><button class="pano-drill-back" type="button" data-drill-back="stdOverview" hidden><i class="bi bi-arrow-up-left"></i>返回上级</button></span>') +
        panel('标准代码概要统计', '<div class="pano-standard-summary">' + miniMetrics([['bi-database-fill', '分类', '8'], ['bi-table', '种类', '92'], ['bi-globe2', '代码记录', '36,662']]) + '<div id="codeOverview" class="pano-chart tall" data-drillable="true"></div></div>', '', '<span class="pano-panel-tools"><button class="pano-drill-back" type="button" data-drill-back="codeOverview" hidden><i class="bi bi-arrow-up-left"></i>返回上级</button></span>') +
      '</div>' +
      '<div class="pano-grid quality">' +
        panel('元数据标准治理概要统计', '<div id="stdMetaGauge" class="pano-chart gauge-chart"></div><div class="pano-summary-footer two"><div><span>待治理数量</span><b>99,990</b></div><div><span>已完成</span><b class="good">78,899</b></div></div>') +
        chartPanel('元数据标准治理统计分析（核心数据）', 'stdMeta', 'wide', true) +
      '</div>' +
      '<div class="pano-grid quality">' +
        panel('业务代码标准治理概要统计', '<div id="stdCodeGauge" class="pano-chart gauge-chart"></div><div class="pano-summary-footer two"><div><span>待治理数量</span><b>89,990</b></div><div><span>已完成</span><b class="good">58,899</b></div></div>') +
        chartPanel('业务代码标准治理统计分析（核心数据）', 'stdCode', 'wide', true) +
      '</div>' +
    '</div>';
  }

  function renderQuality() {
    var tabs = '<span class="pano-ranking-tabs"><button class="pano-ranking-tab active" type="button" data-ranking-tab="good">质量【好】</button><button class="pano-ranking-tab" type="button" data-ranking-tab="bad">质量【差】</button></span>';
    return '<div class="pano-view">' +
      '<div class="pano-grid quality">' +
        panel('质量稽查概要统计', '<div class="pano-quality-summary"><div id="qualityGauge" class="pano-chart gauge-chart"></div><div class="pano-rule-list">' + ['完整性|88%', '有效性|75%', '及时性|92%', '一致性|68%', '准确性|98%', '唯一性|55%'].map(function (item, i) { var p = item.split('|'); return '<div class="pano-rule-item"><b>' + (i + 1) + '</b><span>' + p[0] + '</span><em>' + p[1] + '</em></div>'; }).join('') + '</div><div class="pano-summary-footer"><div><span>总记录数</span><b>99,990</b></div><div><span>符合规则</span><b class="good">78,899</b></div><div><span>不符合规则</span><b class="bad">21,091</b></div><div><span>不符合率</span><b class="warn">21.09%</b></div></div></div>') +
        chartPanel('质量稽查变化趋势（近12月）', 'qualityTrend', 'quality-tall', false) +
      '</div>' +
      '<div class="pano-grid quality">' +
        panel('重点稽查报告（Top10）', '<div class="pano-ranking"><div class="pano-ranking-head"><span>业务线</span><span>总/符合/不符合</span><span>不符合率</span></div><div class="pano-ranking-list">' + rankingRows() + '</div></div>', '', tabs) +
        '<div class="pano-side-stack">' + chartPanel('质量情况统计（数仓分层）', 'qualityLayer', 'compact', true) + chartPanel('质量情况统计（数据库）', 'qualityDatabase', 'compact', true) + '</div>' +
      '</div>' +
    '</div>';
  }

  function renderSecurity() {
    return '<div class="pano-view">' +
      '<div class="pano-grid quality">' +
        panel('数据安全统计概况', '<div class="pano-security-overview"><div class="pano-security-rings"><div id="securityEncryptRing" class="pano-chart compact"></div><div id="securityMaskRing" class="pano-chart compact"></div></div>' + miniMetrics([['bi-database-fill', '库', '6'], ['bi-table', '表数量', '162'], ['bi-hdd-stack', '字段数量', '10,962'], ['bi-globe2', '数据记录', '100,962', '万']]) + '</div>') +
        chartPanel('敏感数据记录统计（配置脱敏或者加密规则表的记录数）', 'securitySensitive', 'security-tall', true) +
      '</div>' +
      chartPanel('核心敏感数据统计（数据量最多的敏感数据）', 'securityCore', 'security-bottom', true) +
    '</div>';
  }

  function renderService() {
    return '<div class="pano-view">' +
      '<div class="pano-grid service">' +
        panel('资源概况', '<div class="pano-service-overview">' + [
          ['bi-briefcase', '接口开发', '1,000'], ['bi-graph-up-arrow', '月均浏览量', '668,532'], ['bi-clipboard2-check', '接口注册', '600'], ['bi-person-workspace', '申请应用量', '66'], ['bi-table', '数据库表', '800'], ['bi-hdd-stack', '月均API调用量', '10,962'], ['bi-file-earmark-bar-graph', '数据集文件', '200'], ['bi-folder-symlink', '月下载量', '22,456']
        ].map(function (item) { return '<div class="pano-service-metric"><i class="bi ' + item[0] + '"></i><div class="pano-service-metric-copy"><span>' + item[1] + '</span><b>' + item[2] + '</b></div></div>'; }).join('') + '</div>') +
        chartPanel('资源主题分类统计', 'serviceResource', 'tall', true) +
      '</div>' +
      '<div class="pano-grid service">' +
        '<div class="pano-top-lists">' + panel('应用活跃月均Top10', '<div class="pano-list">' + topList('供应链协同应用', 'bi-window') + '</div>') + panel('API月均调用Top10', '<div class="pano-list">' + topList('订单履约查询API-', 'bi-file-earmark-code') + '</div>') + '</div>' +
        chartPanel('数据使用时间分布趋势（近一个月每天趋势）', 'serviceUsage', 'service-usage', false) +
      '</div>' +
    '</div>';
  }

  var renderers = {
    warehouse: renderWarehouse,
    develop: renderDevelop,
    standard: renderStandard,
    quality: renderQuality,
    security: renderSecurity,
    service: renderService
  };

  function disposeCharts() {
    chartInstances.forEach(function (entry) {
      if (entry && entry.chart && !entry.chart.isDisposed()) entry.chart.dispose();
    });
    chartInstances = [];
  }

  function axisLabel(rotate) {
    return { color: '#596974', fontSize: 11, interval: 0, rotate: rotate || 0, hideOverlap: false };
  }

  function baseCartesian(labels, rotate) {
    return {
      grid: { left: 58, right: 46, top: 52, bottom: rotate ? 62 : 42, containLabel: false },
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, backgroundColor: 'rgba(33,42,50,.88)', borderWidth: 0, textStyle: { color: '#fff', fontSize: 12 } },
      xAxis: { type: 'category', data: labels, axisLabel: axisLabel(rotate), axisLine: { lineStyle: { color: colors.axis } }, axisTick: { alignWithLabel: true } },
      yAxis: { type: 'value', axisLabel: { color: '#687984', fontSize: 11 }, splitLine: { lineStyle: { color: colors.grid } }, axisLine: { show: true, lineStyle: { color: colors.axis } } },
      animationDuration: 500
    };
  }

  function pairedBarOption(labels, records, tables, names) {
    var option = baseCartesian(labels, 38);
    option.legend = { top: 8, data: names || ['数据记录', '表数量'], itemWidth: 18, itemHeight: 10, textStyle: { fontSize: 11 } };
    option.yAxis = [
      { type: 'value', name: '数据记录数', axisLabel: { color: '#687984', fontSize: 11 }, splitLine: { lineStyle: { color: colors.grid } }, axisLine: { show: true, lineStyle: { color: colors.axis } } },
      { type: 'value', name: '表数量', axisLabel: { color: '#687984', fontSize: 11 }, splitLine: { show: false }, axisLine: { show: true, lineStyle: { color: colors.axis } } }
    ];
    option.series = [
      { name: (names || ['数据记录', '表数量'])[0], type: 'bar', data: records, barMaxWidth: 22, itemStyle: { color: colors.orange } },
      { name: (names || ['数据记录', '表数量'])[1], type: 'bar', yAxisIndex: 1, data: tables, barMaxWidth: 22, itemStyle: { color: colors.lightBlue } }
    ];
    return option;
  }

  function stackedProjectOption(seed, names) {
    var labels = Array.from({ length: 20 }, function (_, i) { return '项目资源' + (i + 1); });
    var option = baseCartesian(labels, 45);
    option.legend = { top: 8, data: names, itemWidth: 10, itemHeight: 9, textStyle: { fontSize: 11 } };
    var multipliers = [1, .88, .82, .77, .74, .67, .58, .53, .49, .46, .43, .4, .38, .31, .23, .2, .15, .11, .08, .02];
    option.series = names.map(function (name, index) {
      return { name: name, type: 'bar', stack: 'total', barMaxWidth: 26, data: multipliers.map(function (m) { return Math.round((86 + index * 102 + seed) * m); }), itemStyle: { color: [colors.blue, '#ed7d31', colors.yellow, '#70ad47'][index] } };
    });
    return option;
  }

  function governanceOption(labels, seed) {
    var completed = labels.map(function (_, i) { return 4600 + ((i * 2371 + seed * 397) % 8100); });
    var unfinished = labels.map(function (_, i) { return 2100 + ((i * 1229 + seed * 251) % 4200); });
    var rates = labels.map(function (_, i) { return 38 + ((i * 17 + seed * 7) % 59); });
    var option = baseCartesian(labels, 0);
    option.grid.bottom = 40;
    option.legend = { top: 8, data: ['已完成', '未完成', '完成率'], itemWidth: 18, itemHeight: 10, textStyle: { fontSize: 11 } };
    option.yAxis = [
      { type: 'value', name: '数量', axisLabel: { color: '#687984', fontSize: 11 }, splitLine: { lineStyle: { color: colors.grid } }, axisLine: { show: true, lineStyle: { color: colors.axis } } },
      { type: 'value', name: '完成率[%]', max: 100, axisLabel: { color: '#687984', fontSize: 11 }, splitLine: { show: false }, axisLine: { show: true, lineStyle: { color: colors.axis } } }
    ];
    option.series = [
      { name: '已完成', type: 'bar', stack: 'all', data: completed, barMaxWidth: 38, itemStyle: { color: colors.green } },
      { name: '未完成', type: 'bar', stack: 'all', data: unfinished, barMaxWidth: 38, itemStyle: { color: colors.red } },
      { name: '完成率', type: 'line', smooth: true, yAxisIndex: 1, data: rates, itemStyle: { color: colors.line }, lineStyle: { width: 3, color: colors.line }, symbolSize: 6, label: { show: true, formatter: '{c}%', color: colors.line, fontSize: 10 } }
    ];
    return option;
  }

  function qualityOption(labels, seed) {
    var totals = labels.map(function (_, i) { return 9800 + ((i * 4129 + seed * 631) % 10200); });
    var passed = totals.map(function (v, i) { return Math.round(v * (.54 + ((i * 7 + seed) % 31) / 100)); });
    var failed = totals.map(function (v, i) { return v - passed[i]; });
    var rates = passed.map(function (v, i) { return Math.round(v / totals[i] * 10000) / 100; });
    var option = baseCartesian(labels, 38);
    option.legend = { top: 8, data: ['总稽查', '符合规则', '不符合规则', '符合率'], itemWidth: 18, itemHeight: 10, textStyle: { fontSize: 11 } };
    option.yAxis = [
      { type: 'value', name: '数量', axisLabel: { color: '#687984', fontSize: 11 }, splitLine: { lineStyle: { color: colors.grid } }, axisLine: { show: true, lineStyle: { color: colors.axis } } },
      { type: 'value', name: '符合率[%]', max: 100, axisLabel: { color: '#687984', fontSize: 11 }, splitLine: { show: false }, axisLine: { show: true, lineStyle: { color: colors.axis } } }
    ];
    option.series = [
      { name: '总稽查', type: 'bar', data: totals, barMaxWidth: 34, itemStyle: { color: colors.cyan } },
      { name: '符合规则', type: 'bar', stack: 'result', data: passed, barMaxWidth: 34, itemStyle: { color: '#00bf00' } },
      { name: '不符合规则', type: 'bar', stack: 'result', data: failed, barMaxWidth: 34, itemStyle: { color: '#f00000' } },
      { name: '符合率', type: 'line', smooth: true, yAxisIndex: 1, data: rates, symbolSize: 6, itemStyle: { color: colors.line }, lineStyle: { color: colors.line, width: 2 }, label: { show: true, formatter: '{c}%', color: colors.line, fontSize: 10 } }
    ];
    return option;
  }

  function donutOption(value, label, centerText, color) {
    return {
      tooltip: { show: false },
      title: [
        { text: centerText, left: 'center', top: '40%', textStyle: { color: '#263746', fontSize: 22, fontWeight: 700 } },
        { text: label, left: 'center', top: '55%', textStyle: { color: '#566976', fontSize: 13, fontWeight: 500 } }
      ],
      series: [{ type: 'pie', radius: ['61%', '76%'], center: ['50%', '50%'], silent: true, label: { show: false }, data: [{ value: value, itemStyle: { color: color || colors.lightBlue } }, { value: 100 - value, itemStyle: { color: '#eef1f3' } }] }]
    };
  }

  function gaugeOption(value, label, color) {
    return {
      series: [{
        type: 'gauge', min: 0, max: 100, startAngle: 180, endAngle: 0, center: ['50%', '66%'], radius: '88%',
        progress: { show: false }, axisLine: { lineStyle: { width: 2, color: [[.33, '#ff6573'], [.66, '#ffd850'], [1, '#54e69b']] } },
        axisTick: { distance: -12, length: 6, lineStyle: { color: 'auto', width: 1 } }, splitLine: { distance: -15, length: 13, lineStyle: { color: 'auto', width: 1 } },
        axisLabel: { show: false }, pointer: { length: '52%', width: 5, itemStyle: { color: '#50d5ee' } }, anchor: { show: true, size: 7, itemStyle: { color: '#50d5ee' } },
        detail: { valueAnimation: true, formatter: '{value}%', color: color || colors.green, fontSize: 25, offsetCenter: [0, '16%'] },
        title: { offsetCenter: [0, '42%'], color: '#697884', fontSize: 14 }, data: [{ value: value, name: label }]
      }]
    };
  }

  function registerChart(id, option, drillMeta) {
    var element = document.getElementById(id);
    if (!element || !window.echarts) return;
    var chart = echarts.init(element);
    chart.setOption(option);
    var entry = { id: id, chart: chart, baseOption: option, drillMeta: drillMeta || null, level: 0, path: [] };
    chartInstances.push(entry);
    if (drillMeta) {
      chart.on('click', function (params) { drillDown(entry, params.name || '当前分类'); });
    }
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function drillDown(entry, selected) {
    if (entry.level >= 2) {
      showToast('已到达最细的数据对象层级');
      return;
    }
    entry.level += 1;
    entry.path.push(selected);
    var option = clone(entry.baseOption);
    var prefix = selected.length > 8 ? selected.slice(0, 8) : selected;
    var labels = entry.level === 1
      ? [prefix + '·客户域', prefix + '·交易域', prefix + '·商品域', prefix + '·履约域', prefix + '·结算域', prefix + '·运营域']
      : [prefix + '_明细表', prefix + '_汇总表', prefix + '_指标表', prefix + '_快照表', prefix + '_维度表'];
    option.xAxis.data = labels;
    option.xAxis.axisLabel = axisLabel(32);
    (option.series || []).forEach(function (series, seriesIndex) {
      if (series.type === 'line') {
        series.data = labels.map(function (_, i) { return 48 + ((i * 13 + seriesIndex * 9 + entry.level * 7) % 48); });
      } else if (series.yAxisIndex === 1) {
        series.data = labels.map(function (_, i) { return 18 + ((i * 17 + seriesIndex * 11 + entry.level * 5) % 78); });
      } else {
        var base = entry.level === 1 ? 760000 : 180000;
        series.data = labels.map(function (_, i) { return Math.max(2, Math.round(base / (i + 1) * (1 - seriesIndex * .16))); });
      }
    });
    entry.chart.setOption(option, true);
    updateDrillHeader(entry);
    showToast('已下钻至“' + selected + '”的' + (entry.level === 1 ? '业务域' : '数据对象') + '层级');
  }

  function drillBack(id) {
    var entry = chartInstances.filter(function (item) { return item.id === id; })[0];
    if (!entry || entry.level === 0) return;
    entry.level -= 1;
    entry.path.pop();
    if (entry.level === 0) {
      entry.chart.setOption(entry.baseOption, true);
    } else {
      var previous = entry.path.pop();
      entry.level -= 1;
      drillDown(entry, previous);
    }
    updateDrillHeader(entry);
  }

  function updateDrillHeader(entry) {
    var button = document.querySelector('[data-drill-back="' + entry.id + '"]');
    if (button) button.hidden = entry.level === 0;
  }

  function initWarehouseCharts() {
    registerChart('whFunnel', {
      tooltip: { trigger: 'item', formatter: '{b}<br>{c}万条' },
      series: [{ type: 'funnel', top: 18, bottom: 12, left: '8%', width: '84%', minSize: '22%', maxSize: '100%', sort: 'descending', gap: 2, label: { show: false }, itemStyle: { borderColor: '#fff', borderWidth: 2 }, data: [
        { value: 1548, name: '业务库', itemStyle: { color: '#5b8dde' } }, { value: 835, name: '贴源层（ODS）', itemStyle: { color: '#2ccb2c' } }, { value: 634, name: '明细层（DWD）', itemStyle: { color: '#cc61cc' } }, { value: 410, name: '主题层（DWS）', itemStyle: { color: '#71bee9' } }, { value: 235, name: '应用层（ADS）', itemStyle: { color: colors.orange } }
      ] }]
    });
    registerChart('whBusiness', pairedBarOption(businessNames, [905000, 770000, 640000, 620000, 590000, 570000, 490000, 460000, 455000, 445000, 390000, 320000], [82, 76, 8, 64, 12, 30, 67, 52, 23, 75, 8, 2]), { kind: 'warehouse' });
    registerChart('whOdsRing', donutOption(83, '贴源库', '15', colors.lightBlue));
    registerChart('whDwdRing', donutOption(76, '公共库', '12', colors.lightBlue));
    registerChart('whAdsRing', donutOption(68, '应用库', '8', colors.lightBlue));
    registerChart('whOds', pairedBarOption(databaseNames, [905000, 780000, 640000, 620000, 590000, 560000, 490000, 460000, 450000, 430000, 390000, 320000], [82, 76, 8, 64, 12, 30, 67, 52, 23, 75, 8, 2]), { kind: 'layer' });
    registerChart('whDwd', pairedBarOption(businessNames, [885000, 760000, 630000, 615000, 585000, 560000, 485000, 455000, 448000, 425000, 382000, 310000], [80, 75, 7, 62, 11, 28, 65, 50, 22, 73, 7, 2]), { kind: 'layer' });
    registerChart('whAds', pairedBarOption(['经营分析', '客户画像', '商品推荐', '风险预警', '履约监控', '渠道运营', '供应预测', '会员洞察', '营销分析', '财务分析', '售后分析', '库存分析'], [650000, 595000, 560000, 530000, 498000, 475000, 450000, 420000, 405000, 388000, 350000, 300000], [68, 58, 92, 76, 70, 46, 88, 44, 36, 80, 32, 28]), { kind: 'layer' });
  }

  function initDevelopCharts() {
    ['devCollectRing', 'devBatchRing'].forEach(function (id) { registerChart(id, donutOption(80, '已启动/未启动', '66/82', colors.lightBlue)); });
    registerChart('devStreamRing', donutOption(53, '已启动/未启动', '8/15', colors.lightBlue));
    registerChart('devScheduleRing', donutOption(86, '调度任务', '128', colors.lightBlue));
    registerChart('devCollect', stackedProjectOption(0, ['批量采集', '流式采集', '数据同步']));
    registerChart('devBatch', stackedProjectOption(5, ['在线编程', '上传程序包', '数据治理']));
    registerChart('devStream', stackedProjectOption(0, ['在线编程', '上传程序包', '流式处理']));
    registerChart('devSchedule', stackedProjectOption(4, ['数据采集', '数据处理', '综合任务']));
  }

  function initStandardCharts() {
    registerChart('stdOverview', {
      grid: { left: 50, right: 28, top: 52, bottom: 58 }, tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } }, legend: { top: 8, data: ['标准数量'], itemWidth: 18, itemHeight: 10 },
      xAxis: { type: 'category', data: businessNames.slice(0, 10), axisLabel: axisLabel(38), axisLine: { lineStyle: { color: colors.axis } } }, yAxis: { type: 'value', axisLabel: { color: '#687984' }, splitLine: { lineStyle: { color: colors.grid } }, axisLine: { show: true, lineStyle: { color: colors.axis } } },
      series: [{ name: '标准数量', type: 'bar', data: [12020, 16393, 12091, 10291, 17470, 19451, 10453, 19669, 15288, 19927], barMaxWidth: 34, itemStyle: { color: colors.cyan }, label: { show: true, position: 'top', color: colors.cyan, fontSize: 11 } }]
    }, { kind: 'standard' });
    registerChart('codeOverview', {
      grid: { left: 50, right: 28, top: 52, bottom: 58 }, tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } }, legend: { top: 8, data: ['代码数据量'], itemWidth: 18, itemHeight: 10 },
      xAxis: { type: 'category', data: ['机构代码', '部门代码', '民族代码', '科目代码', '职称代码', '产品代码', '地区代码', '行业代码', '状态代码'], axisLabel: axisLabel(38), axisLine: { lineStyle: { color: colors.axis } } }, yAxis: { type: 'value', axisLabel: { color: '#687984' }, splitLine: { lineStyle: { color: colors.grid } }, axisLine: { show: true, lineStyle: { color: colors.axis } } },
      series: [{ name: '代码数据量', type: 'bar', data: [153, 162, 186, 140, 190, 159, 400, 175, 104], barMaxWidth: 36, itemStyle: { color: colors.cyan }, label: { show: true, position: 'top', color: colors.cyan, fontSize: 11 } }]
    }, { kind: 'code' });
    registerChart('stdMetaGauge', gaugeOption(98.22, '完成率', colors.green));
    registerChart('stdCodeGauge', gaugeOption(88.22, '完成率', '#05a4ec'));
    registerChart('stdMeta', governanceOption(businessNames, 3), { kind: 'standard-governance' });
    registerChart('stdCode', governanceOption(['机构代码', '部门代码', '民族代码', '科目代码', '职称代码', '产品代码', '地区代码', '行业代码', '状态代码', '渠道代码', '岗位代码', '证件代码'], 7), { kind: 'standard-governance' });
  }

  function initQualityCharts() {
    registerChart('qualityGauge', gaugeOption(78.91, '规则符合率', '#089fe9'));
    var months = ['2025年10月', '2025年11月', '2025年12月', '2026年1月', '2026年2月', '2026年3月', '2026年4月', '2026年5月', '2026年6月', '2026年7月', '2026年8月', '2026年9月'];
    registerChart('qualityTrend', qualityOption(months, 4));
    registerChart('qualityLayer', qualityOption(layerNames.concat(['公共指标层', '经营分析层', '服务主题层']), 2), { kind: 'quality-layer' });
    registerChart('qualityDatabase', qualityOption(databaseNames, 5), { kind: 'quality-database' });
  }

  function initSecurityCharts() {
    registerChart('securityEncryptRing', donutOption(76, '加密规则', '15', colors.lightBlue));
    registerChart('securityMaskRing', donutOption(82, '脱敏规则', '139', colors.lightBlue));
    registerChart('securitySensitive', pairedBarOption(databaseNames.concat(['数据交换库', '统一认证库', '客户服务库', '监管报送库', '文件资源库', '数据备份库', '历史归档库', '审计日志库']), [905000, 780000, 640000, 610000, 590000, 560000, 490000, 460000, 450000, 430000, 390000, 320000, 305000, 295000, 290000, 230000, 220000, 120000, 80000, 35000], [100, 65, 23, 72, 36, 33, 89, 67, 45, 41, 38, 49, 84, 47, 60, 93, 55, 30, 22, 7]), { kind: 'security-db' });
    registerChart('securityCore', pairedBarOption(['手机号码', '身份证号', '驾驶证号', '居住证号', '社保卡号', '银行账号', '通信地址', '定位信息', '家庭住址', '婚姻信息', '健康病史', '家庭成员', '注册信息', '过敏信息', '检测报告', '客户画像', '交易流水', '信用记录', '设备标识', '登录日志'], [900000, 780000, 640000, 610000, 590000, 560000, 490000, 460000, 450000, 430000, 390000, 320000, 305000, 295000, 290000, 230000, 220000, 120000, 80000, 35000], [15, 39, 22, 22, 24, 88, 93, 12, 42, 45, 7, 55, 24, 35, 94, 54, 98, 45, 30, 6]), { kind: 'security-rule' });
  }

  function initServiceCharts() {
    var labels = ['客户域', '订单域', '商品域', '供应链域', '财务域', '组织域', '营销域', '渠道域', '履约域', '售后域', '会员域', '库存域', '风控域', '结算域', '日志域', '监管域', '文件域', '主数据域', '服务域', '归档域'];
    var option = baseCartesian(labels, 38);
    option.legend = { top: 8, data: ['接口开发', '接口注册', '数据库表', '数据集文件'], itemWidth: 10, itemHeight: 9, textStyle: { fontSize: 11 } };
    option.series = ['接口开发', '接口注册', '数据库表', '数据集文件'].map(function (name, index) {
      return { name: name, type: 'bar', stack: 'resource', barMaxWidth: 30, data: labels.map(function (_, i) { return Math.max(2, Math.round((85 - index * 5) * (1 - i / 22))); }), itemStyle: { color: [colors.blue, '#ed7d31', colors.yellow, '#70ad47'][index] } };
    });
    registerChart('serviceResource', option, { kind: 'service' });
    var hours = Array.from({ length: 24 }, function (_, i) { return (i < 10 ? '0' : '') + i + ':00'; });
    var usage = [920, 890, 360, 880, 540, 220, 900, 420, 500, 660, 170, 450, 1030, 680, 720, 410, 960, 880, 610, 590, 900, 830, 810, 770];
    registerChart('serviceUsage', {
      title: { text: 'API调用', left: 'center', top: 14, textStyle: { fontSize: 17, color: '#4c4c4c' } }, tooltip: { trigger: 'axis' }, grid: { left: 42, right: 20, top: 60, bottom: 40 },
      xAxis: { type: 'category', boundaryGap: false, data: hours, axisLabel: { fontSize: 10, color: '#5d6971' }, axisLine: { lineStyle: { color: '#c3cbd1' } } }, yAxis: { type: 'value', splitLine: { lineStyle: { color: '#d8d8d8' } }, axisLabel: { fontSize: 10, color: '#5d6971' } },
      series: [{ type: 'line', data: usage, symbol: 'none', lineStyle: { width: 1, color: '#3e7db7' }, areaStyle: { color: '#3d9eaa', opacity: .85 } }]
    });
  }

  var initializers = {
    warehouse: initWarehouseCharts,
    develop: initDevelopCharts,
    standard: initStandardCharts,
    quality: initQualityCharts,
    security: initSecurityCharts,
    service: initServiceCharts
  };

  function renderView(view) {
    if (!renderers[view]) view = 'warehouse';
    currentView = view;
    disposeCharts();
    content.innerHTML = renderers[view]();
    navItems.forEach(function (item) { item.classList.toggle('active', item.getAttribute('data-view') === view); });
    if (history.replaceState) history.replaceState(null, '', '#view=' + view);
    initializers[view]();
    content.scrollTop = 0;
    window.scrollTo(0, 0);
  }

  navItems.forEach(function (item) {
    item.addEventListener('click', function () { renderView(item.getAttribute('data-view')); });
  });

  document.addEventListener('click', function (event) {
    var back = event.target.closest('[data-drill-back]');
    if (back) drillBack(back.getAttribute('data-drill-back'));

    var rankTab = event.target.closest('[data-ranking-tab]');
    if (rankTab) {
      document.querySelectorAll('[data-ranking-tab]').forEach(function (button) { button.classList.toggle('active', button === rankTab); });
      var bad = rankTab.getAttribute('data-ranking-tab') === 'bad';
      document.querySelectorAll('.pano-ranking-row').forEach(function (row, index) {
        var rate = row.querySelector('.rate');
        if (rate) rate.textContent = bad ? (38 + index * 2.41).toFixed(2) + '%' : ['33.78%', '28.69%', '22.65%', '12.69%', '10.89%', '9.66%', '8.65%', '7.23%', '6.26%', '5.86%'][index];
      });
    }
  });

  window.addEventListener('resize', function () {
    chartInstances.forEach(function (entry) { entry.chart.resize(); });
  });

  var hashMatch = location.hash.match(/view=([a-z]+)/);
  renderView(hashMatch && renderers[hashMatch[1]] ? hashMatch[1] : currentView);
}());
