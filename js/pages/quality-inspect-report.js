/**
 * 数据中台 V4.0 - 数据资产 / 数据质量 / 稽查报告
 * 静态高保真原型：汇总展示所有稽查任务产生的报告，支持直接查看报告详情
 */
window.DP = window.DP || {};
DP.pages = DP.pages || {};

DP.pages.qualityInspectReport = (function () {
  var pageEl = null;
  var reportGaugeChart = null;

  var state = {
    view: 'list',
    treeKey: 'ads-app',
    treeKeyword: '',
    keyword: '',
    page: 1,
    pageSize: 10,
    selectedReportId: '',
    treeOpen: {
      demo: true,
      business: true,
      'ads-app': true,
      warehouse: true,
      system: true
    }
  };

  var reportSummary = {
    total: 2500,
    passed: 2302,
    failed: 198,
    passRate: 92.08,
    failRate: 7.92
  };

  var reportTree = [
    {
      key: 'demo',
      label: '中电数治演示',
      icon: 'bi-layers-fill',
      children: [
        { key: 'demo-overview', label: '演示质量看板', icon: 'bi-speedometer2' },
        { key: 'demo-public', label: '公共稽查规则', icon: 'bi-puzzle-fill' }
      ]
    },
    {
      key: 'business',
      label: '业务系统',
      icon: 'bi-stack',
      children: [
        { key: 'biz-workorder', label: '工单协同系统', icon: 'bi-ui-checks' },
        { key: 'biz-order', label: '订单交易系统', icon: 'bi-receipt' },
        { key: 'biz-customer', label: '客户主数据系统', icon: 'bi-people' },
        { key: 'biz-hr', label: '人事考勤系统', icon: 'bi-person-badge' }
      ]
    },
    {
      key: 'ads-app',
      label: 'ADS-应用层',
      icon: 'bi-stack',
      children: [
        { key: 'ads-building', label: '楼宇运营主题', icon: 'bi-building' },
        { key: 'ads-service', label: '服务履约主题', icon: 'bi-window-sidebar' }
      ]
    },
    {
      key: 'warehouse',
      label: '数仓分层',
      icon: 'bi-stack',
      children: [
        { key: 'warehouse-dwd', label: 'DWD-数据明细层', icon: 'bi-table' },
        { key: 'warehouse-dws', label: 'DWS-数据汇总层', icon: 'bi-table' },
        { key: 'warehouse-ods', label: 'ODS-贴源层', icon: 'bi-database-fill' }
      ]
    },
    {
      key: 'system',
      label: '系统业务库',
      icon: 'bi-stack',
      children: [
        { key: 'system-standard', label: '标准稽查报告', icon: 'bi-shield-check' },
        { key: 'system-basic', label: '基础稽查报告', icon: 'bi-clipboard-check' }
      ]
    }
  ];

  var reportTemplates = {
    'ads-app': {
      name: 'buildinglog稽查',
      start: [2026, 5, 24, 14, 54, 9],
      frequency: '每天 14:54:09',
      group: 'ads-app'
    },
    'ads-building': {
      name: 'buildinglog稽查',
      start: [2026, 5, 24, 14, 54, 9],
      frequency: '每天 14:54:09',
      group: 'ads-building'
    },
    'ads-service': {
      name: '服务履约及时性稽查',
      start: [2026, 5, 24, 13, 30, 0],
      frequency: '每天 13:30:00',
      group: 'ads-service'
    },
    'biz-workorder': {
      name: 'express_task_collect表非空校验',
      start: [2026, 5, 24, 10, 5, 2],
      frequency: '每天 10:05:02',
      group: 'biz-workorder'
    },
    'biz-order': {
      name: '订单明细金额范围稽查',
      start: [2026, 5, 24, 9, 20, 0],
      frequency: '每小时 20',
      group: 'biz-order'
    },
    'biz-customer': {
      name: 'employee_info表手机号码稽查',
      start: [2026, 5, 24, 15, 10, 0],
      frequency: '每小时 10',
      group: 'biz-customer'
    },
    'biz-hr': {
      name: '员工手机号有效性稽查',
      start: [2026, 5, 24, 8, 40, 0],
      frequency: '每天 08:40:00',
      group: 'biz-hr'
    },
    'warehouse-dwd': {
      name: 'dwd_order_detail_di主键重复稽查',
      start: [2026, 5, 24, 2, 0, 0],
      frequency: '每天 02:00:00',
      group: 'warehouse-dwd'
    },
    'warehouse-dws': {
      name: 'dws_order_daily汇总一致性稽查',
      start: [2026, 5, 24, 3, 20, 0],
      frequency: '每天 03:20:00',
      group: 'warehouse-dws'
    },
    'warehouse-ods': {
      name: 'ods_workorder_ticket贴源完整性稽查',
      start: [2026, 5, 24, 1, 30, 0],
      frequency: '每天 01:30:00',
      group: 'warehouse-ods'
    },
    'system-standard': {
      name: 'customer.Phone标准稽查',
      start: [2026, 5, 24, 10, 18, 57],
      frequency: '每天 10:18:57',
      group: 'system-standard'
    },
    'system-basic': {
      name: '字段非空基础稽查',
      start: [2026, 5, 24, 16, 0, 0],
      frequency: '每小时 16',
      group: 'system-basic'
    },
    'demo-overview': {
      name: '质量分析样例稽查',
      start: [2026, 5, 24, 11, 0, 0],
      frequency: '每天 11:00:00',
      group: 'demo-overview'
    },
    'demo-public': {
      name: '公共字段命名规范稽查',
      start: [2026, 5, 24, 7, 30, 0],
      frequency: '每天 07:30:00',
      group: 'demo-public'
    }
  };

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function pad(value) {
    return String(value).padStart(2, '0');
  }

  function formatDateTime(date) {
    return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate()) + ' ' +
      pad(date.getHours()) + ':' + pad(date.getMinutes()) + ':' + pad(date.getSeconds());
  }

  function getDescendantKeys(key, nodes) {
    var keys = [];
    nodes.forEach(function (node) {
      if (node.key === key) {
        keys.push(node.key);
        (node.children || []).forEach(function collect(child) {
          keys.push(child.key);
          (child.children || []).forEach(collect);
        });
      } else if (node.children) {
        keys = keys.concat(getDescendantKeys(key, node.children));
      }
    });
    return keys;
  }

  function getTemplateByKey(key) {
    if (reportTemplates[key]) return reportTemplates[key];
    var descendants = getDescendantKeys(key, reportTree);
    for (var i = 0; i < descendants.length; i++) {
      if (reportTemplates[descendants[i]]) return reportTemplates[descendants[i]];
    }
    return reportTemplates['ads-app'];
  }

  function getTreeSearchMatch(node) {
    var keyword = state.treeKeyword.trim().toLowerCase();
    if (!keyword) return true;
    if (node.label.toLowerCase().indexOf(keyword) >= 0) return true;
    return (node.children || []).some(getTreeSearchMatch);
  }

  function getReportRows() {
    var keys = getDescendantKeys(state.treeKey, reportTree);
    if (!keys.length) keys = [state.treeKey];
    var template = getTemplateByKey(state.treeKey);
    var rows = [];
    for (var i = 0; i < 70; i++) {
      var start = new Date(template.start[0], template.start[1], template.start[2], template.start[3], template.start[4], template.start[5]);
      start.setDate(start.getDate() - i);
      var end = new Date(start.getTime());
      end.setMinutes(end.getMinutes() + 1);
      end.setSeconds(16 + (i % 11));
      rows.push({
        id: template.group + '-' + i,
        group: template.group,
        reportName: template.name,
        startAt: formatDateTime(start),
        endAt: formatDateTime(end),
        frequency: template.frequency,
        duration: '1分钟',
        status: '执行成功'
      });
    }
    if (state.treeKey === 'business' || state.treeKey === 'warehouse' || state.treeKey === 'system' || state.treeKey === 'demo') {
      rows = [];
      keys.filter(function (key) { return !!reportTemplates[key]; }).forEach(function (key) {
        var tpl = reportTemplates[key];
        for (var j = 0; j < 8; j++) {
          var startMixed = new Date(tpl.start[0], tpl.start[1], tpl.start[2], tpl.start[3], tpl.start[4], tpl.start[5]);
          startMixed.setDate(startMixed.getDate() - j);
          var endMixed = new Date(startMixed.getTime());
          endMixed.setMinutes(endMixed.getMinutes() + 1);
          endMixed.setSeconds(18 + (j % 8));
          rows.push({
            id: tpl.group + '-' + j,
            group: tpl.group,
            reportName: tpl.name,
            startAt: formatDateTime(startMixed),
            endAt: formatDateTime(endMixed),
            frequency: tpl.frequency,
            duration: '1分钟',
            status: '执行成功'
          });
        }
      });
    }
    var keyword = state.keyword.trim().toLowerCase();
    if (keyword) {
      rows = rows.filter(function (item) {
        return item.reportName.toLowerCase().indexOf(keyword) >= 0 ||
          item.startAt.indexOf(keyword) >= 0 ||
          item.frequency.toLowerCase().indexOf(keyword) >= 0;
      });
    }
    rows.sort(function (a, b) { return b.startAt.localeCompare(a.startAt); });
    return rows;
  }

  function getSelectedReport() {
    var rows = getReportRows();
    return rows.filter(function (item) { return item.id === state.selectedReportId; })[0] || rows[0] || getReportRows()[0];
  }

  function clampPage(total) {
    var totalPages = Math.max(1, Math.ceil(total / state.pageSize));
    state.page = Math.max(1, Math.min(totalPages, state.page));
    return totalPages;
  }

  function getVisibleRows() {
    var rows = getReportRows();
    clampPage(rows.length);
    var start = (state.page - 1) * state.pageSize;
    return rows.slice(start, start + state.pageSize);
  }

  function renderTree(nodes, level) {
    level = level || 0;
    return nodes.filter(getTreeSearchMatch).map(function (node) {
      var hasChildren = node.children && node.children.length;
      var isOpen = state.treeOpen[node.key];
      var isActive = state.treeKey === node.key;
      return '<li>' +
        '<div class="qir-tree-node' + (isActive ? ' active' : '') + '" style="padding-left:' + (8 + level * 18) + 'px;">' +
          '<button class="qir-tree-toggle" type="button" data-qir-action="toggle-tree" data-key="' + escapeHtml(node.key) + '">' + (hasChildren ? '<i class="bi ' + (isOpen ? 'bi-chevron-down' : 'bi-chevron-right') + '"></i>' : '') + '</button>' +
          '<button class="qir-tree-label" type="button" data-qir-action="select-tree" data-key="' + escapeHtml(node.key) + '"><i class="bi ' + escapeHtml(node.icon || 'bi-folder-fill') + '"></i><span>' + escapeHtml(node.label) + '</span></button>' +
        '</div>' +
        (hasChildren && isOpen ? '<ul>' + renderTree(node.children, level + 1) + '</ul>' : '') +
      '</li>';
    }).join('');
  }

  function renderListTable() {
    var rows = getVisibleRows();
    return '<div class="qir-table-wrap">' +
      '<table class="ds-table qir-table">' +
        '<thead><tr><th>报告名称</th><th>开始时间</th><th>完成时间</th><th>执行频次</th><th>耗时</th><th>状态</th><th>操作</th></tr></thead>' +
        '<tbody>' + (rows.length ? rows.map(function (item) {
          return '<tr>' +
            '<td>' + escapeHtml(item.reportName) + '</td>' +
            '<td>' + escapeHtml(item.startAt) + '</td>' +
            '<td>' + escapeHtml(item.endAt) + '</td>' +
            '<td>' + escapeHtml(item.frequency) + '</td>' +
            '<td>' + escapeHtml(item.duration) + '</td>' +
            '<td>' + escapeHtml(item.status) + '</td>' +
            '<td><button class="qir-view-btn" type="button" data-qir-action="open-detail" data-id="' + escapeHtml(item.id) + '" title="查看报告" aria-label="查看报告"><i class="bi bi-file-earmark-text"></i><span>查看报告</span></button></td>' +
          '</tr>';
        }).join('') : '<tr class="qir-empty-row"><td colspan="7">暂无匹配稽查报告</td></tr>') +
        '</tbody>' +
      '</table>' +
    '</div>';
  }

  function renderPageNav(totalPages) {
    var current = state.page;
    var html = '<button type="button" data-qir-page="prev"' + (current <= 1 ? ' disabled' : '') + '><i class="bi bi-chevron-left"></i></button>';
    for (var i = 1; i <= Math.min(totalPages, 7); i++) {
      html += '<button type="button" data-qir-page="' + i + '"' + (current === i ? ' class="active"' : '') + '>' + i + '</button>';
    }
    html += '<button type="button" data-qir-page="next"' + (current >= totalPages ? ' disabled' : '') + '><i class="bi bi-chevron-right"></i></button>';
    return html;
  }

  function renderFooter() {
    var rows = getReportRows();
    var total = rows.length;
    var totalPages = clampPage(total);
    var start = total ? (state.page - 1) * state.pageSize + 1 : 0;
    var end = total ? Math.min(total, state.page * state.pageSize) : 0;
    return '<div class="qir-footer">' +
      '<div>显示第 ' + start + ' 到第 ' + end + ' 条记录，总共 ' + total + ' 条记录 每页显示 <select data-qir-page-size><option value="10"' + (state.pageSize === 10 ? ' selected' : '') + '>10</option><option value="20"' + (state.pageSize === 20 ? ' selected' : '') + '>20</option></select> 条记录</div>' +
      '<div class="qir-page-nav">' + renderPageNav(totalPages) + '</div>' +
    '</div>';
  }

  function renderListShell() {
    return '<aside class="qir-left-panel">' +
      '<div class="qir-tree-search"><input type="text" data-qir-tree-search value="' + escapeHtml(state.treeKeyword) + '" placeholder="关键字搜索" aria-label="关键字搜索"><button type="button" data-qir-action="tree-search"><i class="bi bi-search"></i></button></div>' +
      '<div class="qir-tree-scroll"><ul class="qir-tree">' + renderTree(reportTree) + '</ul></div>' +
    '</aside>' +
    '<section class="qir-main-panel">' +
      '<div class="qir-toolbar"><div></div><div class="qir-query-box"><input type="text" data-qir-keyword value="' + escapeHtml(state.keyword) + '" placeholder="关键字查询" aria-label="关键字查询"><button class="btn btn-primary" type="button" data-qir-action="query"><i class="bi bi-search"></i><span>查询</span></button></div></div>' +
      renderListTable() +
      renderFooter() +
    '</section>';
  }

  function renderReportMetricTable(rows) {
    return '<table class="dqit-report-metric-table"><tbody>' + rows.map(function (row) {
      return '<tr><th>' + escapeHtml(row[0]) + '</th><td class="' + (row[2] || '') + '">' + escapeHtml(row[1]) + '</td></tr>';
    }).join('') + '</tbody></table>';
  }

  function renderReportGauge() {
    return '<div class="dqit-report-gauge-wrap"><div id="qirReportGauge" class="dqit-report-gauge" aria-label="符合规则比例 ' + reportSummary.passRate.toFixed(2) + '%"></div></div>';
  }

  function renderReportDataRows() {
    var rows = [
      ['13978529932', '71001', 'OEwxR1ELbcy', '36', '雷枫芸', '70002', '2021-10-18 11:11:13...', '0', '1980-12-18 11:11:13...', '2021-10-18 11:11:14', '2023-07-18 11:11:14'],
      ['13522143946', '71001', 'JP8I57099IRd', '72', '雷欢霄', '70003', '2022-07-18 11:11:13...', '0', '1987-08-18 10:11:13...', '2022-07-18 11:11:14', '2023-07-18 11:11:14'],
      ['13992373346', '71001', 'nWHHIl5SqYTI', '28', '孟绍功', '70003', '2021-01-18 11:11:13.9', '0', '1975-06-18 11:11:13.9', '2021-01-18 11:11:14', '2023-07-18 11:11:14'],
      ['13715678182', '71001', 'GB8B6qKXAMHj', '61', '狄可姬', '70002', '2019-11-18 11:11:13...', '0', '1987-03-18 11:11:13...', '2019-11-18 11:11:14', '2023-07-18 11:11:14'],
      ['13465112581', '71001', 'u8E0bXM7y8XY', '91', '钟馨之欣', '70004', '2018-10-18 11:11:13...', '0', '1992-05-18 11:11:13...', '2018-10-18 11:11:14', '2023-07-18 11:11:14'],
      ['13593336628', '71001', 'Dh6lUQ5CkkW1', '25', '姜亚', '70003', '2021-06-18 11:11:13.9', '0', '1990-05-18 10:11:13.9', '2021-06-18 11:11:14', '2023-07-18 11:11:14'],
      ['13655285588', '71001', 'jv49xCH7R4FB', '12', '朱波宁', '70002', '2018-07-18 11:11:13...', '0', '1977-12-18 11:11:13...', '2018-07-18 11:11:14', '2023-07-18 11:11:14'],
      ['13524263873', '71001', 'gKF4OOakTXXL', '10', '平雁蓓', '70003', '2020-12-18 11:11:13...', '0', '2002-05-18 11:11:13...', '2020-12-18 11:11:14', '2023-07-18 11:11:14'],
      ['13181483999', '71001', 'jMT6yeacGrdP', '43', '余鸾媛', '70003', '2021-10-18 11:11:13...', '0', '1976-11-18 11:11:13...', '2021-10-18 11:11:14', '2023-07-18 11:11:14'],
      ['13866663691', '71001', 'L5mr6HHUzWtv', '65', '唐昭冰', '70003', '2021-12-18 11:11:13...', '0', '1974-10-18 11:11:13...', '2021-12-18 11:11:14', '2023-07-18 11:11:14']
    ];
    return rows.map(function (row) {
      return '<tr>' + row.map(function (cell, index) {
        return '<td' + (index === 0 ? ' class="dqit-report-danger"' : '') + '>' + escapeHtml(cell) + '</td>';
      }).join('') + '</tr>';
    }).join('');
  }

  function renderDetailShell() {
    var report = getSelectedReport();
    return '<section class="dqit-form-shell dqit-report-shell qir-detail-shell">' +
      '<div class="dqit-form-head"><div class="dqit-form-title"><i class="bi bi-list"></i><span>查看报告</span></div><button class="btn btn-primary" type="button" data-qir-action="back-list"><i class="bi bi-arrow-left"></i><span>返回</span></button></div>' +
      '<div class="dqit-report-scroll">' +
        '<div class="dqit-report-top">' +
          '<section><div class="dqit-report-card-title">报告概述</div>' + renderReportGauge() + '</section>' +
          '<section><div class="dqit-report-card-title">' + escapeHtml(report.reportName) + '</div>' +
            renderReportMetricTable([
              ['开始时间', report.startAt],
              ['结束时间', report.endAt],
              ['执行耗时', report.duration, 'link'],
              ['执行标准', '有效性', 'link'],
              ['执行实体', '1个', 'link']
            ]) +
          '</section>' +
          '<section><div class="dqit-report-card-title">报告记录</div>' +
            renderReportMetricTable([
              ['总记录数', String(reportSummary.total)],
              ['符合规则记录数', String(reportSummary.passed), 'ok'],
              ['符合规则比例', reportSummary.passRate.toFixed(2) + ' %', 'ok'],
              ['不符合规则记录数', String(reportSummary.failed), 'danger'],
              ['不符合规则比例', reportSummary.failRate.toFixed(2) + ' %', 'danger']
            ]) +
          '</section>' +
        '</div>' +
        '<div class="dqit-report-data-head"><h3>不符合规则数据</h3><div class="dqit-report-filters"><span>稽查实体:</span><select><option>employee_info(employee_info)-phone</option></select><select><option>请选择</option></select><select><option>请选择</option></select><input type="text"><div class="dqit-report-tool-buttons"><button class="btn btn-primary" type="button"><i class="bi bi-search"></i><span>查询</span></button><button class="btn btn-primary" type="button"><i class="bi bi-download"></i><span>导出</span></button><button class="btn btn-outline" type="button"><i class="bi bi-grid-3x3-gap-fill"></i><span>列配置</span></button></div></div></div>' +
        '<div class="dqit-report-data-wrap"><table class="ds-table dqit-report-data-table"><thead><tr><th>phone</th><th>position_type</th><th>username</th><th>id</th><th>real_name</th><th>education</th><th>employment_date</th><th>is_deleted</th><th>birthday</th><th>create_time</th><th>update_time</th></tr></thead><tbody>' + renderReportDataRows() + '</tbody></table></div>' +
        '<div class="dqit-report-data-footer"><span>显示第 1 到第 10 条记录，总共 ' + reportSummary.failed + ' 条记录 每页显示 <select><option>10</option></select> 条记录</span><div class="dqit-page-nav"><button type="button">上一页</button><button type="button" class="active">1</button><button type="button">2</button><button type="button">3</button><button type="button">4</button><button type="button">5</button><span>...</span><button type="button">20</button><button type="button">下一页</button></div></div>' +
      '</div>' +
    '</section>';
  }

  function disposeGauge() {
    if (reportGaugeChart) {
      reportGaugeChart.dispose();
      reportGaugeChart = null;
    }
  }

  function initReportGauge() {
    var el = pageEl ? pageEl.querySelector('#qirReportGauge') : null;
    if (!el) return;
    if (!window.echarts) {
      el.innerHTML = '<div class="dqit-gauge-fallback"><strong>' + reportSummary.passRate.toFixed(2) + '%</strong><span>符合规则比例</span></div>';
      return;
    }
    var progressColor = window.echarts.graphic
      ? new window.echarts.graphic.LinearGradient(0, 0, 1, 0, [
        { offset: 0, color: '#20c997' },
        { offset: 0.52, color: '#1683ff' },
        { offset: 1, color: '#2f78ff' }
      ])
      : '#1683ff';
    reportGaugeChart = window.echarts.init(el);
    reportGaugeChart.setOption({
      series: [{
        type: 'gauge',
        startAngle: 90,
        endAngle: -270,
        min: 0,
        max: 100,
        center: ['50%', '50%'],
        radius: '82%',
        progress: {
          show: true,
          roundCap: true,
          clip: false,
          width: 18,
          itemStyle: {
            color: progressColor,
            shadowColor: 'rgba(22, 131, 255, 0.22)',
            shadowBlur: 10,
            shadowOffsetY: 2
          }
        },
        axisLine: {
          roundCap: true,
          lineStyle: { width: 18, color: [[1, '#edf4fb']] }
        },
        pointer: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        anchor: { show: false },
        title: {
          offsetCenter: [0, '22%'],
          color: '#60758b',
          fontSize: 13,
          fontWeight: 400
        },
        detail: {
          valueAnimation: true,
          offsetCenter: [0, '-8%'],
          formatter: function (value) { return Number(value).toFixed(2) + '%'; },
          color: '#1683ff',
          fontSize: 31,
          fontWeight: 700,
          lineHeight: 36
        },
        data: [{ value: reportSummary.passRate, name: '符合规则比例' }]
      }]
    }, true);
    window.setTimeout(function () {
      if (reportGaugeChart) reportGaugeChart.resize();
    }, 0);
  }

  function renderAll() {
    if (!pageEl) return;
    disposeGauge();
    pageEl.classList.toggle('detail-mode', state.view === 'detail');
    pageEl.innerHTML = state.view === 'detail' ? renderDetailShell() : renderListShell();
    if (state.view === 'detail') {
      if (window.requestAnimationFrame) window.requestAnimationFrame(initReportGauge);
      else initReportGauge();
    }
  }

  function bindEvents() {
    pageEl.addEventListener('click', function (e) {
      var actionEl = e.target.closest('[data-qir-action]');
      if (actionEl && pageEl.contains(actionEl)) {
        var action = actionEl.getAttribute('data-qir-action');
        var key = actionEl.getAttribute('data-key') || '';
        if (action === 'toggle-tree') {
          state.treeOpen[key] = !state.treeOpen[key];
          renderAll();
        } else if (action === 'select-tree') {
          state.treeKey = key || state.treeKey;
          state.page = 1;
          renderAll();
        } else if (action === 'query') {
          var input = pageEl.querySelector('[data-qir-keyword]');
          state.keyword = input ? input.value.trim() : '';
          state.page = 1;
          renderAll();
        } else if (action === 'tree-search') {
          var treeInput = pageEl.querySelector('[data-qir-tree-search]');
          state.treeKeyword = treeInput ? treeInput.value.trim() : '';
          renderAll();
        } else if (action === 'open-detail') {
          state.selectedReportId = actionEl.getAttribute('data-id') || '';
          state.view = 'detail';
          renderAll();
        } else if (action === 'back-list') {
          state.view = 'list';
          renderAll();
        }
        return;
      }
      var pageBtn = e.target.closest('[data-qir-page]');
      if (pageBtn && pageEl.contains(pageBtn) && !pageBtn.disabled) {
        var totalPages = Math.max(1, Math.ceil(getReportRows().length / state.pageSize));
        var target = pageBtn.getAttribute('data-qir-page');
        if (target === 'prev') state.page = Math.max(1, state.page - 1);
        else if (target === 'next') state.page = Math.min(totalPages, state.page + 1);
        else state.page = Number(target) || 1;
        renderAll();
      }
    });

    pageEl.addEventListener('input', function (e) {
      if (e.target.matches('[data-qir-tree-search]')) {
        state.treeKeyword = e.target.value;
        renderAll();
      }
    });

    pageEl.addEventListener('change', function (e) {
      if (e.target.matches('[data-qir-page-size]')) {
        state.pageSize = Number(e.target.value) || 10;
        state.page = 1;
        renderAll();
      }
    });

    pageEl.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && e.target.matches('[data-qir-keyword]')) {
        state.keyword = e.target.value.trim();
        state.page = 1;
        renderAll();
      }
    });
  }

  function resetState() {
    state.view = 'list';
    state.treeKey = 'ads-app';
    state.treeKeyword = '';
    state.keyword = '';
    state.page = 1;
    state.pageSize = 10;
    state.selectedReportId = '';
    state.treeOpen = {
      demo: true,
      business: true,
      'ads-app': true,
      warehouse: true,
      system: true
    };
  }

  return {
    html: '<div class="page-quality-inspect-report"></div>',
    init: function () {
      pageEl = document.querySelector('.page-quality-inspect-report');
      if (!pageEl) return;
      resetState();
      bindEvents();
      renderAll();
    }
  };
})();
