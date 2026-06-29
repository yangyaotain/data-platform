/**
 * 数据中台 V4.0 - 数据资产 / 数据质量 / 稽查报告
 * 静态高保真原型：按数据源汇总表级稽查报告，支持查看质量报告详情
 */
window.DP = window.DP || {};
DP.pages = DP.pages || {};

DP.pages.qualityInspectReport = (function () {
  var pageEl = null;

  var state = {
    view: 'list',
    treeKey: 'all',
    treeKeyword: '',
    keyword: '',
    page: 1,
    pageSize: 10,
    selectedReportId: '',
    rulePages: {},
    rulePageSize: 5,
    treeOpen: {
      all: true,
      production: true,
      warehouse: true,
      business: true,
      test: true
    }
  };

  var dataSourceParents = {
    prod_mysql_master: '生产数据库',
    prod_mysql_slave: '生产数据库',
    prod_postgresql: '生产数据库',
    dw_hive_ods: '数据仓库',
    dw_hive_dwd: '数据仓库',
    dw_hive_dws: '数据仓库',
    dw_hive_ads: '数据仓库',
    erp_oracle_db: '业务系统',
    crm_sqlserver: '业务系统',
    oa_mysql_db: '业务系统',
    test_mysql_db: '测试环境',
    test_clickhouse: '测试环境',
    test_mongodb: '测试环境'
  };

  var reportTree = [
    {
      key: 'all',
      label: '数据源目录 (13)',
      icon: 'bi-stack',
      children: [
        {
          key: 'production',
          label: '生产数据库 (3)',
          icon: 'bi-folder2-open',
          children: [
            { key: 'prod_mysql_master', label: 'prod_mysql_master', icon: 'bi-database' },
            { key: 'prod_mysql_slave', label: 'prod_mysql_slave', icon: 'bi-database' },
            { key: 'prod_postgresql', label: 'prod_postgresql', icon: 'bi-database' }
          ]
        },
        {
          key: 'warehouse',
          label: '数据仓库 (4)',
          icon: 'bi-folder2-open',
          children: [
            { key: 'dw_hive_ods', label: 'dw_hive_ods', icon: 'bi-database' },
            { key: 'dw_hive_dwd', label: 'dw_hive_dwd', icon: 'bi-database' },
            { key: 'dw_hive_dws', label: 'dw_hive_dws', icon: 'bi-database' },
            { key: 'dw_hive_ads', label: 'dw_hive_ads', icon: 'bi-database' }
          ]
        },
        {
          key: 'business',
          label: '业务系统 (3)',
          icon: 'bi-folder2-open',
          children: [
            { key: 'erp_oracle_db', label: 'erp_oracle_db', icon: 'bi-database' },
            { key: 'crm_sqlserver', label: 'crm_sqlserver', icon: 'bi-database' },
            { key: 'oa_mysql_db', label: 'oa_mysql_db', icon: 'bi-database' }
          ]
        },
        {
          key: 'test',
          label: '测试环境 (3)',
          icon: 'bi-folder2-open',
          children: [
            { key: 'test_mysql_db', label: 'test_mysql_db', icon: 'bi-database' },
            { key: 'test_clickhouse', label: 'test_clickhouse', icon: 'bi-database' },
            { key: 'test_mongodb', label: 'test_mongodb', icon: 'bi-database' }
          ]
        }
      ]
    }
  ];

  var reportRows = [
    report('rep-order-main', 'order_main', '订单主表', 'prod_mysql_master', 5, 83.2, 38, 1438920, '2026-06-29 14:54:09', '订单核心交易数据质量稽查'),
    report('rep-order-detail', 'order_detail', '订单明细表', 'prod_mysql_master', 6, 88.6, 26, 3892105, '2026-06-29 14:51:22', '订单商品明细完整性稽查'),
    report('rep-order-payment', 'order_payment', '订单支付记录', 'prod_mysql_master', 5, 91.4, 18, 1205680, '2026-06-29 14:46:18', '支付流水一致性稽查'),
    report('rep-order-status-log', 'order_status_log', '订单状态变更日志', 'prod_mysql_master', 4, 79.5, 42, 5620340, '2026-06-29 14:40:03', '订单状态枚举稽查'),
    report('rep-product-info', 'product_info', '商品信息表', 'prod_mysql_slave', 5, 94.7, 9, 86742, '2026-06-29 13:22:10', '商品主数据基础质量稽查'),
    report('rep-dim-region', 'dim_region', '区域维度表', 'prod_mysql_slave', 4, 96.3, 5, 3624, '2026-06-28 13:18:33', '行政区划标准映射稽查'),
    report('rep-inventory-snapshot', 'inventory_snapshot', '库存快照表', 'prod_postgresql', 5, 86.9, 31, 9450200, '2026-06-28 12:55:42', '库存数量范围稽查'),
    report('rep-ods-workorder-ticket', 'ods_workorder_ticket', '工单贴源表', 'dw_hive_ods', 6, 82.1, 47, 2865340, '2026-06-29 03:30:16', '工单贴源完整性稽查'),
    report('rep-ods-user-behavior', 'ods_user_behavior_log', '用户行为日志表', 'dw_hive_ods', 5, 89.8, 22, 89320600, '2026-06-29 03:12:05', '埋点行为日志有效性稽查'),
    report('rep-dwd-order-fact', 'dwd_order_fact', '订单事实宽表', 'dw_hive_dwd', 6, 85.6, 36, 1438920, '2026-06-28 02:45:11', '订单事实宽表一致性稽查'),
    report('rep-dwd-customer-profile', 'dwd_customer_profile', '客户画像明细表', 'dw_hive_dwd', 5, 90.5, 17, 328915, '2026-06-28 02:38:27', '客户画像字段完整性稽查'),
    report('rep-dws-order-daily', 'dws_order_daily', '订单日汇总表', 'dw_hive_dws', 5, 92.8, 12, 12580, '2026-06-27 03:20:00', '订单汇总一致性稽查'),
    report('rep-dws-user-profile', 'dws_user_profile', '用户画像宽表', 'dw_hive_dws', 6, 87.2, 29, 241836, '2026-06-27 03:16:24', '用户标签汇总质量稽查'),
    report('rep-ads-gmv-summary', 'ads_gmv_summary', 'GMV汇总表', 'dw_hive_ads', 5, 93.5, 8, 4580, '2026-06-29 04:10:58', 'GMV指标口径稽查'),
    report('rep-ads-order-overview', 'ads_order_overview', '订单概览报表', 'dw_hive_ads', 4, 95.6, 6, 365, '2026-06-29 04:05:36', '订单概览报表质量稽查'),
    report('rep-employee-info', 'employee_info', '员工信息表', 'erp_oracle_db', 5, 84.9, 34, 18630, '2026-06-28 10:18:57', '员工手机号有效性稽查'),
    report('rep-supplier-contract', 'supplier_contract', '供应商合同表', 'erp_oracle_db', 4, 88.1, 19, 52460, '2026-06-27 10:06:12', '供应商合同日期范围稽查'),
    report('rep-crm-customer-info', 'crm_customer_info', 'CRM客户信息表', 'crm_sqlserver', 5, 81.7, 44, 265890, '2026-06-29 09:45:28', '客户证件与联系方式稽查'),
    report('rep-crm-contact-record', 'crm_contact_record', '客户触达记录表', 'crm_sqlserver', 4, 90.1, 16, 786320, '2026-06-28 09:31:40', '触达记录时间完整性稽查'),
    report('rep-oa-leave-apply', 'oa_leave_apply', '请假申请表', 'oa_mysql_db', 4, 93.9, 7, 42960, '2026-06-27 08:40:00', '请假流程状态稽查'),
    report('rep-test-order-main', 'test_order_main', '测试订单主表', 'test_mysql_db', 4, 78.3, 53, 9280, '2026-06-26 11:20:10', '测试订单基础规则稽查'),
    report('rep-test-clickhouse-log', 'test_event_log_ck', '测试事件日志表', 'test_clickhouse', 4, 82.7, 25, 182640, '2026-06-25 11:08:35', '测试日志字段稽查'),
    report('rep-test-mongodb-profile', 'test_user_profile_doc', '测试用户画像文档', 'test_mongodb', 4, 89.4, 11, 38420, '2026-06-25 10:52:21', '测试画像文档完整性稽查')
  ];

  var issueTemplates = [
    { ruleKey: 'required', ruleName: '关键字段非空校验', type: '完整性', field: '主键字段', rateOffset: 6 },
    { ruleKey: 'unique', ruleName: '业务主键唯一性校验', type: '唯一性', field: '业务编号', rateOffset: 11 },
    { ruleKey: 'range', ruleName: '数值范围校验', type: '准确性', field: '金额/数量字段', rateOffset: 8 },
    { ruleKey: 'enum', ruleName: '状态枚举校验', type: '一致性', field: '状态字段', rateOffset: 13 },
    { ruleKey: 'format', ruleName: '日期与格式校验', type: '规范性', field: '日期/手机号字段', rateOffset: 9 },
    { ruleKey: 'relation', ruleName: '关联完整性校验', type: '完整性', field: '关联ID', rateOffset: 7 }
  ];

  function report(id, tableName, alias, dataSource, ruleCount, avgPassRate, problemRecordCount, fileRecordCount, lastExecutionTime, desc) {
    return {
      id: id,
      tableName: tableName,
      alias: alias,
      dataSource: dataSource,
      dataSourceLabel: (dataSourceParents[dataSource] ? dataSourceParents[dataSource] + '/' : '') + dataSource,
      dataSourceKey: dataSource,
      ruleCount: ruleCount,
      avgPassRate: avgPassRate,
      problemRecordCount: problemRecordCount,
      fileRecordCount: fileRecordCount,
      lastExecutionTime: lastExecutionTime,
      duration: '1分钟',
      desc: desc
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
    return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  function sanitizeReportFileName(value) {
    return String(value == null ? '' : value).replace(/[<>:"/\\|?*\u0000-\u001f]/g, '_');
  }

  function getReportExportDate(report) {
    var parts = String(report.lastExecutionTime || '').split(' ')[0].split('-');
    if (parts.length !== 3) return String(report.lastExecutionTime || '').split(' ')[0];
    return [parts[0], String(Number(parts[1])), String(Number(parts[2]))].join('-');
  }

  function getReportExportFileName(report) {
    return sanitizeReportFileName(report.alias) + '（' + sanitizeReportFileName(report.tableName) + '）质量稽查报告-' + getReportExportDate(report) + '.xlsx';
  }

  function xmlEscape(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function columnName(col) {
    var name = '';
    while (col > 0) {
      var rem = (col - 1) % 26;
      name = String.fromCharCode(65 + rem) + name;
      col = Math.floor((col - 1) / 26);
    }
    return name;
  }

  function textCell(row, col, value, style) {
    return { row: row, col: col, value: value, style: style || 0, type: 'text' };
  }

  function numberCell(row, col, value, style) {
    return { row: row, col: col, value: value, style: style || 0, type: 'number' };
  }

  function sheetCellXml(cell) {
    var ref = columnName(cell.col) + cell.row;
    var style = cell.style ? ' s="' + cell.style + '"' : '';
    if (cell.type === 'number') {
      return '<c r="' + ref + '"' + style + '><v>' + Number(cell.value || 0) + '</v></c>';
    }
    return '<c r="' + ref + '" t="inlineStr"' + style + '><is><t xml:space="preserve">' + xmlEscape(cell.value) + '</t></is></c>';
  }

  function worksheetXml(rows, colWidths, merges, freezeRows) {
    var rowMap = {};
    var maxRow = 1;
    rows.forEach(function (cell) {
      rowMap[cell.row] = rowMap[cell.row] || [];
      rowMap[cell.row].push(cell);
      maxRow = Math.max(maxRow, cell.row);
    });
    var maxCol = colWidths.length || 1;
    var cols = colWidths.map(function (width, index) {
      return '<col min="' + (index + 1) + '" max="' + (index + 1) + '" width="' + width + '" customWidth="1"/>';
    }).join('');
    var sheetViews = '<sheetViews><sheetView workbookViewId="0">';
    if (freezeRows) {
      sheetViews += '<pane ySplit="' + freezeRows + '" topLeftCell="A' + (freezeRows + 1) + '" activePane="bottomLeft" state="frozen"/><selection pane="bottomLeft"/>';
    }
    sheetViews += '</sheetView></sheetViews>';
    var rowXml = Object.keys(rowMap).map(function (rowKey) {
      var row = Number(rowKey);
      var height = row === 1 ? 32 : (row === 3 || row === 8 || row === 11 ? 24 : (row === 5 || row === 6 ? 36 : 22));
      return '<row r="' + row + '" ht="' + height + '" customHeight="1">' +
        rowMap[rowKey].sort(function (a, b) { return a.col - b.col; }).map(sheetCellXml).join('') +
      '</row>';
    }).join('');
    var mergeXml = merges.length ? '<mergeCells count="' + merges.length + '">' + merges.map(function (ref) {
      return '<mergeCell ref="' + ref + '"/>';
    }).join('') + '</mergeCells>' : '';
    return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">' +
      sheetViews +
      '<dimension ref="A1:' + columnName(maxCol) + maxRow + '"/>' +
      '<cols>' + cols + '</cols>' +
      '<sheetData>' + rowXml + '</sheetData>' +
      mergeXml +
      '</worksheet>';
  }

  function getInspectionTotal(report, problemTotal) {
    var failRate = Math.max(0.1, 100 - report.avgPassRate);
    return Math.max(problemTotal, Math.round(problemTotal / (failRate / 100)));
  }

  function getRuleSheetName(rule, usedNames) {
    var base = rule.name.replace(/[\\/?*\[\]:]/g, '').slice(0, 31) || 'Sheet';
    var name = base;
    var index = 2;
    while (usedNames[name]) {
      var suffix = '_' + index;
      name = base.slice(0, 31 - suffix.length) + suffix;
      index += 1;
    }
    usedNames[name] = true;
    return name;
  }

  function getExportIssueSummary(summary) {
    return String(summary || '').replace(/^质量问题说明：/, '');
  }

  function buildOverviewSheet(report, rules, problemRows) {
    var problemTotal = problemRows.length;
    var inspectionTotal = getInspectionTotal(report, problemTotal);
    var usedNames = { '概述': true };
    var weakRules = rules.filter(function (rule) { return rule.rate < 90; }).map(function (rule) {
      return rule.name + '（' + rule.field + '）';
    }).join('、') || '关键字段完整性与业务一致性';
    var rows = [
      textCell(1, 1, report.alias + '质量稽查报告', 1),
      textCell(3, 1, '顶部概述', 2),
      textCell(4, 1, '稽查对象', 3),
      textCell(4, 2, report.dataSourceLabel + '/' + report.tableName + '（' + report.alias + '）', 4),
      textCell(4, 3, '所属数据源', 3),
      textCell(4, 4, report.dataSourceLabel, 4),
      textCell(5, 1, '稽查内容', 3),
      textCell(5, 2, weakRules, 4),
      textCell(5, 3, '最后执行时间', 3),
      textCell(5, 4, report.lastExecutionTime, 4),
      textCell(6, 1, '稽查结果', 3),
      textCell(6, 2, '本次稽查记录总数 ' + formatNumber(inspectionTotal) + ' 条，问题记录数 ' + formatNumber(problemTotal) + ' 条，平均通过率 ' + report.avgPassRate.toFixed(1) + '%，共执行 ' + report.ruleCount + ' 条质量规则。', 4),
      textCell(6, 3, '报告说明', 3),
      textCell(6, 4, report.desc, 4),
      textCell(8, 1, '指标摘要', 2),
      textCell(9, 1, '总记录数', 5),
      numberCell(9, 2, inspectionTotal, 6),
      textCell(9, 3, '问题记录数', 5),
      numberCell(9, 4, problemTotal, 6),
      textCell(9, 5, '平均通过率', 5),
      numberCell(9, 6, report.avgPassRate / 100, 11),
      textCell(9, 7, '规则数', 5),
      numberCell(9, 8, report.ruleCount, 6),
      textCell(11, 1, '稽查内容清单', 2)
    ];
    ['序号', '稽查内容', '规则类型', '问题字段', '通过率', '问题记录数', '对应 Sheet', '质量问题说明'].forEach(function (header, index) {
      rows.push(textCell(12, index + 1, header, 7));
    });
    rules.forEach(function (rule, index) {
      var issueCount = problemRows.filter(function (item) { return item.ruleKey === rule.key; }).length;
      var row = 13 + index;
      var sheetName = getRuleSheetName(rule, usedNames);
      rows.push(numberCell(row, 1, index + 1, 9));
      rows.push(textCell(row, 2, rule.name, 9));
      rows.push(textCell(row, 3, rule.type, 9));
      rows.push(textCell(row, 4, rule.field, 9));
      rows.push(numberCell(row, 5, rule.rate / 100, 11));
      rows.push(numberCell(row, 6, issueCount, 9));
      rows.push(textCell(row, 7, sheetName, 9));
      rows.push(textCell(row, 8, getExportIssueSummary(rule.summary), 9));
    });
    return worksheetXml(rows, [8, 36, 16, 24, 14, 14, 20, 64], ['A1:H1', 'A3:H3', 'A8:H8', 'A11:H11'], 12);
  }

  function buildRuleSheet(report, rule, sheetName) {
    var fields = getInspectionFields(report);
    var problemRows = getRuleProblemRows(report, rule.key);
    var rows = [
      textCell(1, 1, report.alias + ' - ' + rule.name, 1),
      textCell(3, 1, '规则概述', 2),
      textCell(4, 1, '稽查对象', 3),
      textCell(4, 2, report.dataSourceLabel + '/' + report.tableName + '（' + report.alias + '）', 4),
      textCell(4, 3, '稽查内容', 3),
      textCell(4, 4, rule.name, 4),
      textCell(4, 5, '规则类型', 3),
      textCell(4, 6, rule.type, 4),
      textCell(5, 1, '问题字段', 3),
      textCell(5, 2, rule.field, 4),
      textCell(5, 3, '通过率', 3),
      numberCell(5, 4, rule.rate / 100, 11),
      textCell(5, 5, '问题记录数', 3),
      numberCell(5, 6, problemRows.length, 9),
      textCell(6, 1, '质量问题说明', 3),
      textCell(6, 2, getExportIssueSummary(rule.summary), 4),
      textCell(6, 3, '最后执行时间', 3),
      textCell(6, 4, report.lastExecutionTime, 4),
      textCell(6, 5, 'sheet', 3),
      textCell(6, 6, sheetName, 4),
      textCell(8, 1, '问题清单', 2)
    ];
    fields.forEach(function (field, index) {
      var isIssue = field === rule.field;
      rows.push(textCell(9, index + 1, field + (isIssue ? '（问题列）' : ''), isIssue ? 8 : 7));
    });
    problemRows.forEach(function (item, rowIndex) {
      fields.forEach(function (field, colIndex) {
        rows.push(textCell(10 + rowIndex, colIndex + 1, item.values[field], field === item.issueField ? 10 : 9));
      });
    });
    return worksheetXml(rows, [16, 16, 22, 18, 16, 16, 20, 20, 20], ['A1:I1', 'A3:I3', 'A8:I8'], 9);
  }

  function workbookXml(sheetNames) {
    return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">' +
      '<bookViews><workbookView xWindow="0" yWindow="0" windowWidth="16000" windowHeight="9600"/></bookViews><sheets>' +
      sheetNames.map(function (name, index) {
        return '<sheet name="' + xmlEscape(name) + '" sheetId="' + (index + 1) + '" r:id="rId' + (index + 1) + '"/>';
      }).join('') +
      '</sheets></workbook>';
  }

  function workbookRelsXml(sheetNames) {
    return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
      sheetNames.map(function (name, index) {
        return '<Relationship Id="rId' + (index + 1) + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet' + (index + 1) + '.xml"/>';
      }).join('') +
      '<Relationship Id="rId' + (sheetNames.length + 1) + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>' +
      '</Relationships>';
  }

  function contentTypesXml(sheetCount) {
    var overrides = '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>' +
      '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>';
    for (var i = 1; i <= sheetCount; i++) {
      overrides += '<Override PartName="/xl/worksheets/sheet' + i + '.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>';
    }
    return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
      '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
      '<Default Extension="xml" ContentType="application/xml"/>' + overrides + '</Types>';
  }

  function stylesXml() {
    return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' +
      '<numFmts count="1"><numFmt numFmtId="164" formatCode="0.0%"/></numFmts>' +
      '<fonts count="5">' +
      '<font><sz val="11"/><name val="Carlito"/></font>' +
      '<font><b/><sz val="16"/><color rgb="FFFFFFFF"/><name val="宋体"/></font>' +
      '<font><b/><sz val="11"/><color rgb="FF26384D"/><name val="Carlito"/></font>' +
      '<font><sz val="11"/><color rgb="FFC00000"/><name val="Carlito"/></font>' +
      '<font><b/><sz val="11"/><color rgb="FFAD6800"/><name val="Carlito"/></font>' +
      '</fonts>' +
      '<fills count="9">' +
      '<fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill>' +
      '<fill><patternFill patternType="solid"><fgColor rgb="FF1F4E78"/><bgColor indexed="64"/></patternFill></fill>' +
      '<fill><patternFill patternType="solid"><fgColor rgb="FFD9EAF7"/><bgColor indexed="64"/></patternFill></fill>' +
      '<fill><patternFill patternType="solid"><fgColor rgb="FFF5F7FA"/><bgColor indexed="64"/></patternFill></fill>' +
      '<fill><patternFill patternType="solid"><fgColor rgb="FFF8FBFF"/><bgColor indexed="64"/></patternFill></fill>' +
      '<fill><patternFill patternType="solid"><fgColor rgb="FFEAF2F8"/><bgColor indexed="64"/></patternFill></fill>' +
      '<fill><patternFill patternType="solid"><fgColor rgb="FFFFF2CC"/><bgColor indexed="64"/></patternFill></fill>' +
      '<fill><patternFill patternType="solid"><fgColor rgb="FFFCE4D6"/><bgColor indexed="64"/></patternFill></fill>' +
      '</fills>' +
      '<borders count="3"><border/><border><left style="thin"><color rgb="FFE6EDF4"/></left><right style="thin"><color rgb="FFE6EDF4"/></right><top style="thin"><color rgb="FFE6EDF4"/></top><bottom style="thin"><color rgb="FFE6EDF4"/></bottom></border><border><left style="thin"><color rgb="FFC9D6E2"/></left><right style="thin"><color rgb="FFC9D6E2"/></right><top style="thin"><color rgb="FFC9D6E2"/></top><bottom style="thin"><color rgb="FFC9D6E2"/></bottom></border></borders>' +
      '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>' +
      '<cellXfs count="12">' +
      '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>' +
      '<xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1"><alignment horizontal="left" vertical="center"/></xf>' +
      '<xf numFmtId="0" fontId="2" fillId="3" borderId="2" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="left" vertical="center"/></xf>' +
      '<xf numFmtId="0" fontId="2" fillId="4" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment vertical="center" wrapText="1"/></xf>' +
      '<xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1" applyAlignment="1"><alignment vertical="center" wrapText="1"/></xf>' +
      '<xf numFmtId="0" fontId="2" fillId="5" borderId="2" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>' +
      '<xf numFmtId="0" fontId="0" fillId="5" borderId="2" xfId="0" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>' +
      '<xf numFmtId="0" fontId="2" fillId="6" borderId="2" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center" wrapText="1"/></xf>' +
      '<xf numFmtId="0" fontId="4" fillId="7" borderId="2" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="left" vertical="center" wrapText="1"/></xf>' +
      '<xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1" applyAlignment="1"><alignment vertical="center"/></xf>' +
      '<xf numFmtId="0" fontId="3" fillId="8" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment vertical="center"/></xf>' +
      '<xf numFmtId="164" fontId="0" fillId="5" borderId="2" xfId="0" applyNumberFormat="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>' +
      '</cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>';
  }

  function crc32(bytes) {
    var table = crc32.table || (crc32.table = (function () {
      var result = [];
      for (var n = 0; n < 256; n++) {
        var c = n;
        for (var k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
        result[n] = c >>> 0;
      }
      return result;
    })());
    var crc = -1;
    for (var i = 0; i < bytes.length; i++) crc = (crc >>> 8) ^ table[(crc ^ bytes[i]) & 0xff];
    return (crc ^ -1) >>> 0;
  }

  function u16(value) {
    return new Uint8Array([value & 0xff, (value >>> 8) & 0xff]);
  }

  function u32(value) {
    return new Uint8Array([value & 0xff, (value >>> 8) & 0xff, (value >>> 16) & 0xff, (value >>> 24) & 0xff]);
  }

  function concatBytes(parts) {
    var length = parts.reduce(function (sum, part) { return sum + part.length; }, 0);
    var output = new Uint8Array(length);
    var offset = 0;
    parts.forEach(function (part) {
      output.set(part, offset);
      offset += part.length;
    });
    return output;
  }

  function createZip(files) {
    var encoder = new TextEncoder();
    var localParts = [];
    var centralParts = [];
    var offset = 0;
    var now = new Date();
    var dosTime = (now.getHours() << 11) | (now.getMinutes() << 5) | Math.floor(now.getSeconds() / 2);
    var dosDate = ((now.getFullYear() - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate();
    files.forEach(function (file) {
      var nameBytes = encoder.encode(file.name);
      var data = typeof file.content === 'string' ? encoder.encode(file.content) : file.content;
      var crc = crc32(data);
      var localHeader = concatBytes([
        u32(0x04034b50), u16(20), u16(0), u16(0), u16(dosTime), u16(dosDate), u32(crc),
        u32(data.length), u32(data.length), u16(nameBytes.length), u16(0), nameBytes
      ]);
      localParts.push(localHeader, data);
      var centralHeader = concatBytes([
        u32(0x02014b50), u16(20), u16(20), u16(0), u16(0), u16(dosTime), u16(dosDate), u32(crc),
        u32(data.length), u32(data.length), u16(nameBytes.length), u16(0), u16(0), u16(0), u16(0), u32(0), u32(offset), nameBytes
      ]);
      centralParts.push(centralHeader);
      offset += localHeader.length + data.length;
    });
    var central = concatBytes(centralParts);
    var local = concatBytes(localParts);
    var end = concatBytes([u32(0x06054b50), u16(0), u16(0), u16(files.length), u16(files.length), u32(central.length), u32(local.length), u16(0)]);
    return new Blob([local, central, end], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  }

  function createReportWorkbookBlob(report) {
    var rules = getQualityRules(report);
    var problemRows = makeProblemRows(report);
    var sheetNames = ['概述'];
    var usedNames = { '概述': true };
    var sheetXmls = [buildOverviewSheet(report, rules, problemRows)];
    rules.forEach(function (rule) {
      var sheetName = getRuleSheetName(rule, usedNames);
      sheetNames.push(sheetName);
      sheetXmls.push(buildRuleSheet(report, rule, sheetName));
    });
    var files = [
      { name: '[Content_Types].xml', content: contentTypesXml(sheetNames.length) },
      { name: '_rels/.rels', content: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>' },
      { name: 'xl/workbook.xml', content: workbookXml(sheetNames) },
      { name: 'xl/_rels/workbook.xml.rels', content: workbookRelsXml(sheetNames) },
      { name: 'xl/styles.xml', content: stylesXml() }
    ];
    sheetXmls.forEach(function (content, index) {
      files.push({ name: 'xl/worksheets/sheet' + (index + 1) + '.xml', content: content });
    });
    return createZip(files);
  }

  function downloadBlob(blob, fileName) {
    var url = URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(function () { URL.revokeObjectURL(url); }, 0);
  }

  function exportReport(report) {
    if (!report) return;
    downloadBlob(createReportWorkbookBlob(report), getReportExportFileName(report));
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

  function getTreeSearchMatch(node) {
    var keyword = state.treeKeyword.trim().toLowerCase();
    if (!keyword) return true;
    if (node.label.toLowerCase().indexOf(keyword) >= 0) return true;
    return (node.children || []).some(getTreeSearchMatch);
  }

  function getReportRows() {
    var keys = getDescendantKeys(state.treeKey, reportTree);
    if (!keys.length) keys = [state.treeKey];
    var rows = reportRows.filter(function (item) {
      return keys.indexOf(item.dataSourceKey) >= 0;
    });
    var keyword = state.keyword.trim().toLowerCase();
    if (keyword) {
      rows = rows.filter(function (item) {
        return item.tableName.toLowerCase().indexOf(keyword) >= 0 ||
          item.alias.toLowerCase().indexOf(keyword) >= 0;
      });
    }
    rows.sort(function (a, b) { return b.lastExecutionTime.localeCompare(a.lastExecutionTime); });
    return rows;
  }

  function getSelectedReport() {
    return reportRows.filter(function (item) { return item.id === state.selectedReportId; })[0] ||
      getReportRows()[0] ||
      reportRows[0];
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

  function getQualityRules(report) {
    var count = Math.max(3, Math.min(issueTemplates.length, report.ruleCount));
    var fields = getInspectionFields(report);
    return issueTemplates.slice(0, count).map(function (tpl, index) {
      var rate = Math.max(52, Math.min(100, Math.round((report.avgPassRate + 10 - tpl.rateOffset + index * 1.3) * 10) / 10));
      var issueField = getIssueFieldForRule(fields, tpl.ruleKey);
      var issueCount = Math.floor(report.problemRecordCount / count) + (index < report.problemRecordCount % count ? 1 : 0);
      return {
        key: tpl.ruleKey,
        name: tpl.ruleName,
        type: tpl.type,
        field: issueField,
        desc: issueField + ' 需满足' + tpl.type + '规则，稽查对象为 ' + report.tableName + '。',
        rate: rate,
        summary: '质量问题说明：' + report.alias + '的 ' + issueField + ' 字段在“' + tpl.ruleName + '”中命中问题记录 ' + issueCount + ' 条，通过率为 ' + rate + '%，' + getRuleIssueSummary(tpl.ruleKey, issueField) + '。'
      };
    });
  }

  function getRuleIssueSummary(ruleKey, issueField) {
    var summaries = {
      required: issueField + ' 存在空值或未写入，影响关键记录的唯一定位和后续链路追踪',
      unique: issueField + ' 存在重复取值，可能导致同一业务对象被重复识别或覆盖',
      range: issueField + ' 存在超出合理业务范围的取值，可能影响金额、数量或评分类指标统计',
      enum: issueField + ' 存在未定义或非法枚举值，可能导致状态流转、分组统计和规则判断异常',
      format: issueField + ' 存在不符合格式约束的取值，可能影响日期、手机号、证件号等字段解析',
      relation: issueField + ' 存在无法匹配关联主数据或维表的取值，可能造成关联查询和指标汇总缺失'
    };
    return summaries[ruleKey] || issueField + ' 存在不符合当前质量规则的异常取值';
  }

  function getInspectionFields(report) {
    if (report.tableName.indexOf('employee') >= 0) {
      return ['employee_id', 'employee_no', 'real_name', 'phone', 'department_id', 'position_type', 'hire_date', 'status', 'update_time'];
    }
    if (report.tableName.indexOf('customer') >= 0 || report.tableName.indexOf('crm') >= 0) {
      return ['customer_id', 'customer_no', 'customer_name', 'mobile', 'id_card_no', 'customer_level', 'source_channel', 'create_time', 'update_time'];
    }
    if (report.tableName.indexOf('product') >= 0) {
      return ['product_id', 'sku_code', 'product_name', 'category_id', 'sale_price', 'stock_status', 'is_deleted', 'create_time', 'update_time'];
    }
    if (report.tableName.indexOf('inventory') >= 0) {
      return ['snapshot_id', 'warehouse_id', 'sku_code', 'available_qty', 'locked_qty', 'snapshot_date', 'batch_no', 'create_time', 'update_time'];
    }
    if (report.tableName.indexOf('region') >= 0) {
      return ['region_id', 'parent_id', 'region_code', 'region_name', 'region_level', 'sort_no', 'is_enabled', 'create_time', 'update_time'];
    }
    if (report.tableName.indexOf('profile') >= 0) {
      return ['user_id', 'member_no', 'real_name', 'mobile', 'tag_code', 'tag_value', 'score', 'create_time', 'update_time'];
    }
    if (report.tableName.indexOf('contract') >= 0) {
      return ['contract_id', 'supplier_id', 'contract_no', 'contract_amount', 'start_date', 'end_date', 'approve_status', 'create_time', 'update_time'];
    }
    if (report.tableName.indexOf('leave') >= 0) {
      return ['apply_id', 'employee_id', 'leave_type', 'start_time', 'end_time', 'leave_days', 'approve_status', 'create_time', 'update_time'];
    }
    if (report.tableName.indexOf('log') >= 0) {
      return ['log_id', 'event_id', 'user_id', 'event_type', 'event_time', 'device_id', 'payload_hash', 'create_time', 'update_time'];
    }
    return ['order_id', 'user_id', 'order_no', 'order_status', 'total_amount', 'pay_amount', 'pay_time', 'create_time', 'update_time'];
  }

  function getIssueFieldForRule(fields, ruleKey) {
    var candidates = {
      required: ['order_id', 'user_id', 'employee_id', 'customer_id', 'product_id', 'snapshot_id', 'region_id', 'contract_id', 'apply_id', 'log_id'],
      unique: ['order_no', 'employee_no', 'customer_no', 'sku_code', 'contract_no', 'region_code', 'event_id'],
      range: ['total_amount', 'pay_amount', 'sale_price', 'available_qty', 'locked_qty', 'score', 'contract_amount', 'leave_days'],
      enum: ['order_status', 'status', 'stock_status', 'customer_level', 'approve_status', 'region_level', 'event_type'],
      format: ['pay_time', 'hire_date', 'mobile', 'phone', 'id_card_no', 'snapshot_date', 'start_date', 'event_time'],
      relation: ['user_id', 'department_id', 'category_id', 'warehouse_id', 'parent_id', 'supplier_id', 'employee_id', 'device_id']
    }[ruleKey] || [];
    for (var i = 0; i < candidates.length; i++) {
      if (fields.indexOf(candidates[i]) >= 0) return candidates[i];
    }
    return fields[Math.min(2, fields.length - 1)];
  }

  function getRawIssueValue(ruleKey, field, index, report) {
    var prefix = report.tableName.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 3) || 'TAB';
    if (ruleKey === 'required') return 'NULL';
    if (ruleKey === 'unique') return prefix + '20260624001';
    if (ruleKey === 'range') {
      if (field.indexOf('amount') >= 0 || field.indexOf('price') >= 0) return index % 2 ? '-25.00' : '0.00';
      if (field.indexOf('qty') >= 0 || field.indexOf('days') >= 0 || field === 'score') return index % 2 ? '-3' : '0';
      return '-1';
    }
    if (ruleKey === 'enum') return index % 2 ? '9' : '-1';
    if (ruleKey === 'format') {
      if (field.indexOf('mobile') >= 0 || field.indexOf('phone') >= 0) return index % 2 ? '13812' : '1700000000000';
      if (field.indexOf('card') >= 0) return '110000199913320000';
      return '2026-13-41 25:61:00';
    }
    if (ruleKey === 'relation') return '999999';
    return 'NULL';
  }

  function makeFieldValues(report, fields, index, issueField, issueValue) {
    var values = {};
    fields.forEach(function (field) {
      if (field.indexOf('id') >= 0 && field.indexOf('card') < 0) values[field] = String(70000 + index * 11);
      else if (field.indexOf('no') >= 0 || field.indexOf('code') >= 0) values[field] = report.tableName.toUpperCase().slice(0, 3) + String(2026060000 + index * 13);
      else if (field.indexOf('name') >= 0) values[field] = ['张明', '李婷', '王强', '赵丽', '陈晨'][index % 5];
      else if (field.indexOf('mobile') >= 0 || field.indexOf('phone') >= 0) values[field] = '13' + String(500000000 + index * 7913).slice(0, 9);
      else if (field.indexOf('amount') >= 0 || field.indexOf('price') >= 0) values[field] = (68 + index * 3.7).toFixed(2);
      else if (field.indexOf('qty') >= 0 || field.indexOf('days') >= 0 || field === 'score') values[field] = String(10 + index % 80);
      else if (field.indexOf('status') >= 0 || field.indexOf('level') >= 0 || field.indexOf('type') >= 0) values[field] = String(index % 4);
      else if (field.indexOf('time') >= 0 || field.indexOf('date') >= 0) values[field] = '2026-06-' + String(20 + index % 8).padStart(2, '0') + ' ' + String(8 + index % 10).padStart(2, '0') + ':15:00';
      else if (field.indexOf('hash') >= 0) values[field] = 'HASH' + String(900000 + index * 17);
      else values[field] = String(1000 + index * 9);
    });
    values[issueField] = issueValue;
    return values;
  }

  function makeProblemRows(report) {
    var rows = [];
    var rules = getQualityRules(report);
    var namePrefix = report.tableName.replace(/[^a-zA-Z0-9]/g, '').slice(0, 3).toUpperCase() || 'TAB';
    var fields = getInspectionFields(report);
    for (var i = 0; i < report.problemRecordCount; i++) {
      var rule = rules[i % rules.length];
      var day = 24 - (i % 6);
      var hour = 9 + (i % 8);
      var issueField = getIssueFieldForRule(fields, rule.key);
      var rawIssueValue = getRawIssueValue(rule.key, issueField, i + 1, report);
      rows.push({
        index: i + 1,
        ruleKey: rule.key,
        ruleName: rule.name,
        issueField: issueField,
        recordId: namePrefix + String(100000 + i * 17).slice(-6),
        businessKey: report.tableName + '_' + String(2026060000 + i * 13),
        values: makeFieldValues(report, fields, i + 1, issueField, rawIssueValue),
        foundAt: '2026-06-' + String(day).padStart(2, '0') + ' ' + String(hour).padStart(2, '0') + ':' + String((i * 7) % 60).padStart(2, '0') + ':00',
        status: i % 4 === 0 ? '待处理' : (i % 4 === 1 ? '已分派' : '待复核')
      });
    }
    return rows;
  }

  function getRuleProblemRows(report, ruleKey) {
    return makeProblemRows(report).filter(function (item) {
      return item.ruleKey === ruleKey;
    });
  }

  function getRulePage(ruleKey, total) {
    var totalPages = Math.max(1, Math.ceil(total / state.rulePageSize));
    var current = state.rulePages[ruleKey] || 1;
    current = Math.max(1, Math.min(totalPages, current));
    state.rulePages[ruleKey] = current;
    return current;
  }

  function getRateClass(rate) {
    if (rate < 80) return 'qir-rate-low';
    if (rate < 90) return 'qir-rate-mid';
    return 'qir-rate-high';
  }

  function renderRate(rate) {
    return '<span class="qir-rate ' + getRateClass(rate) + '">' +
      '<i style="width:' + Math.max(0, Math.min(100, rate)) + '%"></i>' +
      '<b>' + escapeHtml(rate.toFixed(1)) + '%</b>' +
    '</span>';
  }

  function renderTree(nodes, level) {
    level = level || 0;
    return nodes.filter(getTreeSearchMatch).map(function (node) {
      var hasChildren = node.children && node.children.length;
      var isOpen = state.treeOpen[node.key] || !!state.treeKeyword.trim();
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
        '<thead><tr><th>表名称</th><th>所属数据源</th><th>规则数</th><th>平均通过率</th><th>问题记录数</th><th>最后执行时间</th><th>操作</th></tr></thead>' +
        '<tbody>' + (rows.length ? rows.map(function (item) {
          return '<tr>' +
            '<td><div class="qir-table-name"><b>' + escapeHtml(item.tableName) + '</b><span>' + escapeHtml(item.alias) + '</span></div></td>' +
            '<td>' + escapeHtml(item.dataSourceLabel) + '</td>' +
            '<td>' + escapeHtml(item.ruleCount) + '</td>' +
            '<td>' + renderRate(item.avgPassRate) + '</td>' +
            '<td><span class="qir-problem-count">' + escapeHtml(item.problemRecordCount) + '</span></td>' +
            '<td>' + escapeHtml(item.lastExecutionTime) + '</td>' +
            '<td><div class="qir-table-actions">' +
              '<button class="qir-view-btn" type="button" data-qir-action="open-detail" data-id="' + escapeHtml(item.id) + '" title="查看报告" aria-label="查看报告"><i class="bi bi-file-earmark-text"></i><span>查看报告</span></button>' +
              '<button class="qir-view-btn qir-export-link" type="button" data-qir-action="export-report" data-id="' + escapeHtml(item.id) + '" title="导出 Excel" aria-label="导出 Excel"><i class="bi bi-file-earmark-excel"></i><span>导出</span></button>' +
            '</div></td>' +
          '</tr>';
        }).join('') : '<tr class="qir-empty-row"><td colspan="7">暂无匹配稽查报告</td></tr>') +
        '</tbody>' +
      '</table>' +
    '</div>';
  }

  function renderPageNav(totalPages, current, attr) {
    var html = '<button type="button" ' + attr + '="prev"' + (current <= 1 ? ' disabled' : '') + '><i class="bi bi-chevron-left"></i></button>';
    var maxVisible = Math.min(totalPages, 7);
    for (var i = 1; i <= maxVisible; i++) {
      html += '<button type="button" ' + attr + '="' + i + '"' + (current === i ? ' class="active"' : '') + '>' + i + '</button>';
    }
    if (totalPages > 7) {
      html += '<span>...</span><button type="button" ' + attr + '="' + totalPages + '"' + (current === totalPages ? ' class="active"' : '') + '>' + totalPages + '</button>';
    }
    html += '<button type="button" ' + attr + '="next"' + (current >= totalPages ? ' disabled' : '') + '><i class="bi bi-chevron-right"></i></button>';
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
      '<div class="qir-page-nav">' + renderPageNav(totalPages, state.page, 'data-qir-page') + '</div>' +
    '</div>';
  }

  function renderListShell() {
    return '<aside class="qir-left-panel">' +
      '<div class="qir-tree-search"><input type="text" data-qir-tree-search value="' + escapeHtml(state.treeKeyword) + '" placeholder="搜索数据源" aria-label="搜索数据源"><button type="button" data-qir-action="tree-search"><i class="bi bi-search"></i></button></div>' +
      '<div class="qir-tree-scroll"><ul class="qir-tree">' + renderTree(reportTree) + '</ul></div>' +
    '</aside>' +
    '<section class="qir-main-panel">' +
      '<div class="qir-toolbar"><div class="qir-toolbar-title">稽查报告列表</div><div class="qir-query-box"><span class="qir-query-label">表名称</span><input type="text" data-qir-keyword value="' + escapeHtml(state.keyword) + '" placeholder="请输入表名称" aria-label="表名称模糊查询"><button class="btn btn-primary" type="button" data-qir-action="query"><i class="bi bi-search"></i><span>查询</span></button></div></div>' +
      renderListTable() +
      renderFooter() +
    '</section>';
  }

  function renderQualityOverview(report) {
    var problemTotal = makeProblemRows(report).length;
    var failRate = Math.max(0.1, 100 - report.avgPassRate);
    var inspectionTotal = Math.max(problemTotal, Math.round(problemTotal / (failRate / 100)));
    var rules = getQualityRules(report);
    var weakRules = rules.filter(function (rule) { return rule.rate < 90; }).map(function (rule) {
      return rule.name + '（' + rule.field + '）';
    }).join('、');
    var overviewLines = [
      '<p><b>稽查对象：</b>' + escapeHtml(report.dataSourceLabel) + '/' + escapeHtml(report.tableName) + '（' + escapeHtml(report.alias) + '）</p>',
      '<p><b>稽查内容：</b>' + escapeHtml(weakRules || '关键字段完整性与业务一致性') + '。</p>',
      '<p><b>稽查结果：</b>最近执行时间 ' + escapeHtml(report.lastExecutionTime) + '，本次稽查记录总数 ' + escapeHtml(formatNumber(inspectionTotal)) + ' 条，问题记录数 ' + escapeHtml(formatNumber(problemTotal)) + ' 条，平均通过率 ' + report.avgPassRate.toFixed(1) + '%，本次共执行 ' + report.ruleCount + ' 条质量规则。</p>'
    ].join('');
    return '<section class="gt-quality-overview qir-quality-overview">' +
      '<div class="gt-quality-overview-text qir-overview-text"><h4>' + escapeHtml(report.alias) + '质量稽查概述</h4><div class="qir-overview-lines">' + overviewLines + '</div></div>' +
      '<div class="gt-quality-stat"><span>规则数</span><b>' + escapeHtml(report.ruleCount) + '</b></div>' +
      '<div class="gt-quality-stat"><span>平均通过率</span><b>' + escapeHtml(report.avgPassRate.toFixed(1)) + '%</b></div>' +
      '<div class="gt-quality-stat"><span>问题记录数</span><b>' + escapeHtml(formatNumber(problemTotal)) + '</b></div>' +
    '</section>';
  }

  function renderRuleProblemRows(report, rule) {
    var rows = getRuleProblemRows(report, rule.key);
    var fields = getInspectionFields(report);
    var current = getRulePage(rule.key, rows.length);
    var start = (current - 1) * state.rulePageSize;
    var visible = rows.slice(start, start + state.rulePageSize);
    if (!visible.length) {
      return '<tr class="gt-quality-empty-row"><td colspan="' + fields.length + '">未发现不符合规则的数据</td></tr>';
    }
    return visible.map(function (item) {
      var cells = fields.map(function (field) {
        var cls = field === item.issueField ? ' class="qir-issue-cell"' : '';
        return '<td' + cls + '>' + escapeHtml(item.values[field]) + '</td>';
      }).join('');
      return '<tr>' + cells + '</tr>';
    }).join('');
  }

  function renderRuleProblemHead(report, rule) {
    var fields = getInspectionFields(report);
    return '<tr>' + fields.map(function (field) {
      var cls = field === rule.field ? ' class="qir-issue-column-head"' : '';
      var tag = field === rule.field ? '<span class="qir-issue-column-tag">问题列</span>' : '';
      return '<th' + cls + '><span>' + escapeHtml(field) + '</span>' + tag + '</th>';
    }).join('') + '</tr>';
  }

  function renderRuleProblemFooter(report, rule) {
    var rows = getRuleProblemRows(report, rule.key);
    var total = rows.length;
    var current = getRulePage(rule.key, total);
    var totalPages = Math.max(1, Math.ceil(total / state.rulePageSize));
    var start = total ? (current - 1) * state.rulePageSize + 1 : 0;
    var end = total ? Math.min(total, current * state.rulePageSize) : 0;
    return '<div class="qir-rule-footer">' +
      '<span>显示第 ' + start + ' 到第 ' + end + ' 条记录，总共 ' + total + ' 条记录 每页显示 <select data-qir-rule-page-size><option value="5"' + (state.rulePageSize === 5 ? ' selected' : '') + '>5</option><option value="10"' + (state.rulePageSize === 10 ? ' selected' : '') + '>10</option><option value="20"' + (state.rulePageSize === 20 ? ' selected' : '') + '>20</option></select> 条记录</span>' +
      '<div class="qir-page-nav">' + renderRulePageNav(totalPages, current, rule.key) + '</div>' +
    '</div>';
  }

  function renderRulePageNav(totalPages, current, ruleKey) {
    var html = '<button type="button" data-qir-rule-page="prev" data-rule-key="' + escapeHtml(ruleKey) + '"' + (current <= 1 ? ' disabled' : '') + '><i class="bi bi-chevron-left"></i></button>';
    var maxVisible = Math.min(totalPages, 5);
    for (var i = 1; i <= maxVisible; i++) {
      html += '<button type="button" data-qir-rule-page="' + i + '" data-rule-key="' + escapeHtml(ruleKey) + '"' + (current === i ? ' class="active"' : '') + '>' + i + '</button>';
    }
    if (totalPages > 5) {
      html += '<span>...</span><button type="button" data-qir-rule-page="' + totalPages + '" data-rule-key="' + escapeHtml(ruleKey) + '"' + (current === totalPages ? ' class="active"' : '') + '>' + totalPages + '</button>';
    }
    html += '<button type="button" data-qir-rule-page="next" data-rule-key="' + escapeHtml(ruleKey) + '"' + (current >= totalPages ? ' disabled' : '') + '><i class="bi bi-chevron-right"></i></button>';
    return html;
  }

  function renderQualitySections(report) {
    return getQualityRules(report).map(function (rule) {
      return '<section class="gt-quality-report-section qir-quality-section">' +
        '<div class="gt-quality-section-head"><div><h4>' + escapeHtml(rule.name) + '</h4><p>' + escapeHtml(rule.summary) + '</p></div>' + renderRate(rule.rate) + '</div>' +
        '<div class="qir-rule-table-wrap"><table class="ds-table gt-quality-problem-table qir-rule-problem-table">' +
          '<thead>' + renderRuleProblemHead(report, rule) + '</thead>' +
          '<tbody>' + renderRuleProblemRows(report, rule) + '</tbody>' +
        '</table></div>' +
        renderRuleProblemFooter(report, rule) +
      '</section>';
    }).join('');
  }

  function renderDetailShell() {
    var report = getSelectedReport();
    return '<section class="dqit-form-shell dqit-report-shell qir-detail-shell">' +
      '<div class="ms-detail-header qir-detail-header">' +
        '<div class="qir-detail-titlebar"><button class="btn btn-outline btn-sm" type="button" data-qir-action="back-list"><i class="bi bi-arrow-left"></i><span>返回列表</span></button><span class="ms-detail-title">' + escapeHtml(report.tableName) + ' - ' + escapeHtml(report.alias) + '质量报告</span></div>' +
        '<button class="btn btn-primary btn-sm qir-export-btn" type="button" data-qir-action="export-report" data-id="' + escapeHtml(report.id) + '"><i class="bi bi-file-earmark-excel"></i><span>导出 Excel</span></button>' +
      '</div>' +
      '<div class="ms-detail-body qir-detail-scroll">' +
        '<div class="gt-quality-report qir-quality-report">' + renderQualityOverview(report) + renderQualitySections(report) + '</div>' +
      '</div>' +
    '</section>';
  }

  function renderAll() {
    if (!pageEl) return;
    pageEl.classList.toggle('detail-mode', state.view === 'detail');
    pageEl.innerHTML = state.view === 'detail' ? renderDetailShell() : renderListShell();
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
          state.rulePages = {};
          renderAll();
        } else if (action === 'back-list') {
          state.view = 'list';
          renderAll();
        } else if (action === 'export-report') {
          var reportId = actionEl.getAttribute('data-id') || state.selectedReportId;
          var exportTarget = reportRows.filter(function (item) { return item.id === reportId; })[0] || getSelectedReport();
          exportReport(exportTarget);
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
        return;
      }

      var rulePageBtn = e.target.closest('[data-qir-rule-page]');
      if (rulePageBtn && pageEl.contains(rulePageBtn) && !rulePageBtn.disabled) {
        var ruleKey = rulePageBtn.getAttribute('data-rule-key') || '';
        var rows = getRuleProblemRows(getSelectedReport(), ruleKey);
        var totalRulePages = Math.max(1, Math.ceil(rows.length / state.rulePageSize));
        var ruleTarget = rulePageBtn.getAttribute('data-qir-rule-page');
        var currentRulePage = state.rulePages[ruleKey] || 1;
        if (ruleTarget === 'prev') state.rulePages[ruleKey] = Math.max(1, currentRulePage - 1);
        else if (ruleTarget === 'next') state.rulePages[ruleKey] = Math.min(totalRulePages, currentRulePage + 1);
        else state.rulePages[ruleKey] = Number(ruleTarget) || 1;
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
      } else if (e.target.matches('[data-qir-rule-page-size]')) {
        state.rulePageSize = Number(e.target.value) || 5;
        state.rulePages = {};
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
    state.treeKey = 'all';
    state.treeKeyword = '';
    state.keyword = '';
    state.page = 1;
    state.pageSize = 10;
    state.selectedReportId = '';
    state.rulePages = {};
    state.rulePageSize = 5;
    state.treeOpen = {
      all: true,
      production: true,
      warehouse: true,
      business: true,
      test: true
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
