/**
 * 数据中台 V4.0 - 数据探索
 * 按参考系统实现数据树、查询标签、公共 SQL 编辑器、收藏夹与结果区。
 */
window.DP = window.DP || {};
DP.pages = DP.pages || {};

DP.pages.dataExplore = (function () {
  var pageEl;
  var outsideHandler;
  var splitterState;
  var projectHandler;

  var sourceGroups = [
    {
      id: 'ods', label: 'ODS-贴源层', icon: 'database-fill',
      children: [
        {
          id: 'ods_trade', label: '订单交易_ODS', icon: 'database', schema: 'ods_trade',
          sql: "SELECT order_no, customer_id, order_amount, order_status, pay_time\nFROM ods_trade.ods_trade_order\nWHERE dt = '2026-09-20'\nORDER BY pay_time DESC\nLIMIT 100;",
          tables: [
            { id: 'ods_trade_order', name: 'ods_trade_order', fields: ['order_no', 'customer_id', 'order_amount', 'order_status', 'pay_time', 'dt'] },
            { id: 'ods_trade_order_item', name: 'ods_trade_order_item', fields: ['order_no', 'sku_id', 'quantity', 'sale_price', 'discount_amount', 'dt'] }
          ]
        },
        {
          id: 'ods_logistics', label: '物流履约_ODS', icon: 'database', schema: 'ods_logistics',
          sql: "SELECT waybill_no, order_no, carrier_name, transport_status, signed_time\nFROM ods_logistics.ods_logistics_waybill\nWHERE dt = '2026-09-20'\nLIMIT 100;",
          tables: [
            { id: 'ods_logistics_waybill', name: 'ods_logistics_waybill', fields: ['waybill_no', 'order_no', 'carrier_name', 'transport_status', 'signed_time', 'dt'] },
            { id: 'ods_logistics_route', name: 'ods_logistics_route', fields: ['waybill_no', 'node_name', 'node_status', 'occurred_at', 'dt'] }
          ]
        },
        {
          id: 'ods_member', label: '客户中心_ODS', icon: 'database', schema: 'ods_customer',
          sql: "SELECT customer_id, customer_name, member_level, register_channel, created_at\nFROM ods_customer.ods_customer_info\nWHERE status = 'ACTIVE'\nLIMIT 100;",
          tables: [
            { id: 'ods_customer_info', name: 'ods_customer_info', fields: ['customer_id', 'customer_name', 'member_level', 'register_channel', 'created_at', 'status'] },
            { id: 'ods_customer_address', name: 'ods_customer_address', fields: ['customer_id', 'province_name', 'city_name', 'detail_address', 'is_default'] }
          ]
        }
      ]
    },
    {
      id: 'dwd', label: 'DWD-数据明细层', icon: 'layers',
      children: [
        { id: 'dwd_order', label: '交易订单明细_DWD', icon: 'database', schema: 'dwd_trade', sql: "SELECT order_id, sku_id, shop_id, buyer_id, paid_amount, pay_time\nFROM dwd_trade.dwd_trade_order_detail_di\nWHERE dt = '2026-09-20'\nLIMIT 100;", tables: [
          { id: 'dwd_trade_order_detail_di', name: 'dwd_trade_order_detail_di', fields: ['order_id', 'sku_id', 'shop_id', 'buyer_id', 'paid_amount', 'pay_time', 'dt'] }
        ] }
      ]
    },
    {
      id: 'dws', label: 'DWS-数据汇总层', icon: 'layers',
      children: [
        { id: 'dws_shop', label: '门店交易日汇总_DWS', icon: 'database', schema: 'dws_trade', sql: "SELECT stat_date, shop_id, order_count, buyer_count, paid_amount\nFROM dws_trade.dws_trade_shop_day_1d\nWHERE stat_date = '2026-09-20'\nORDER BY paid_amount DESC;", tables: [
          { id: 'dws_trade_shop_day_1d', name: 'dws_trade_shop_day_1d', fields: ['stat_date', 'shop_id', 'order_count', 'buyer_count', 'paid_amount'] }
        ] }
      ]
    },
    {
      id: 'ads', label: 'ADS-应用层', icon: 'bar-chart-line',
      children: [
        { id: 'ads_overview', label: '经营分析看板_ADS', icon: 'database', schema: 'ads_trade', sql: "SELECT stat_date, region_name, order_count, paid_amount, refund_amount\nFROM ads_trade.ads_trade_overview_day\nWHERE stat_date BETWEEN '2026-09-14' AND '2026-09-20'\nORDER BY stat_date, region_name;", tables: [
          { id: 'ads_trade_overview_day', name: 'ads_trade_overview_day', fields: ['stat_date', 'region_name', 'order_count', 'paid_amount', 'refund_amount'] }
        ] }
      ]
    },
    {
      id: 'business', label: '业务系统', icon: 'boxes',
      children: [
        { id: 'biz_order', label: '订单中心', icon: 'database', schema: 'order_center', sql: 'SHOW TABLES;', tables: [
          { id: 'sys_order', name: 'sys_order', fields: ['id', 'order_no', 'customer_id', 'order_status', 'created_at'] }
        ] },
        { id: 'biz_customer', label: '客户中心', icon: 'database', schema: 'customer_center', sql: 'SHOW TABLES;', tables: [
          { id: 'sys_customer', name: 'sys_customer', fields: ['id', 'customer_code', 'customer_name', 'status', 'created_at'] }
        ] }
      ]
    },
    {
      id: 'system', label: '系统业务库', icon: 'server',
      children: [
        { id: 'sys_metadata', label: '数据治理运营库', icon: 'database', schema: 'governance_ops', sql: 'SHOW TABLES;', tables: [
          { id: 'metadata_table', name: 'metadata_table', fields: ['table_id', 'table_name', 'catalog_id', 'owner_name', 'updated_at'] }
        ] }
      ]
    },
    {
      id: 'demo', label: '演示', icon: 'layers',
      children: [
        { id: 'demo_sandbox', label: '数据探索演示库', icon: 'database', schema: 'demo', sql: 'SHOW TABLES;', tables: [
          { id: 'demo_sales_order', name: 'demo_sales_order', fields: ['order_id', 'product_name', 'sale_amount', 'sale_date'] }
        ] }
      ]
    },
    {
      id: 'quality', label: '数据质量-报告', icon: 'clipboard2-check',
      children: [
        { id: 'quality_report', label: '质量报告库', icon: 'database', schema: 'quality_report', sql: "SELECT report_name, check_date, rule_count, issue_count, pass_rate\nFROM quality_report.ads_quality_report\nORDER BY check_date DESC\nLIMIT 20;", tables: [
          { id: 'ads_quality_report', name: 'ads_quality_report', fields: ['report_name', 'check_date', 'rule_count', 'issue_count', 'pass_rate'] }
        ] }
      ]
    }
  ];

  var resultSets = {
    ods_trade: {
      columns: ['订单编号', '客户编号', '订单金额', '订单状态', '支付时间'],
      rows: [
        ['SO2026092000186', 'C100238', '1,286.00', '已完成', '2026-09-20 18:42:16'],
        ['SO2026092000179', 'C100816', '568.50', '配送中', '2026-09-20 18:21:03'],
        ['SO2026092000163', 'C100492', '2,349.00', '已支付', '2026-09-20 17:56:48'],
        ['SO2026092000158', 'C100127', '316.80', '已完成', '2026-09-20 17:32:11']
      ]
    },
    ods_logistics: {
      columns: ['运单编号', '订单编号', '承运商', '运输状态', '签收时间'],
      rows: [
        ['WB202609200968', 'SO2026092000186', '华东冷链物流', '已签收', '2026-09-21 09:18:36'],
        ['WB202609200955', 'SO2026092000179', '安达供应链', '运输中', '--'],
        ['WB202609200936', 'SO2026092000163', '华东冷链物流', '待揽收', '--']
      ]
    },
    ods_member: {
      columns: ['客户编号', '客户名称', '会员等级', '注册渠道', '注册时间'],
      rows: [
        ['C100238', '华清商贸有限公司', '金牌会员', '企业门户', '2025-11-08 10:26:41'],
        ['C100816', '启航零售中心', '银牌会员', '移动端', '2026-02-19 14:08:25'],
        ['C100492', '星城餐饮管理', '普通会员', '业务导入', '2026-06-03 09:36:12']
      ]
    },
    dwd_order: {
      columns: ['订单ID', '商品ID', '门店ID', '买家ID', '实付金额', '支付时间'],
      rows: [
        ['90186231', 'SKU008216', 'S032', 'B100238', '1,286.00', '2026-09-20 18:42:16'],
        ['90186198', 'SKU002079', 'S018', 'B100816', '568.50', '2026-09-20 18:21:03'],
        ['90186117', 'SKU006342', 'S032', 'B100492', '2,349.00', '2026-09-20 17:56:48']
      ]
    },
    dws_shop: {
      columns: ['统计日期', '门店ID', '订单数', '买家数', '实付金额'],
      rows: [
        ['2026-09-20', 'S032', '1,268', '1,079', '386,420.50'],
        ['2026-09-20', 'S018', '986', '844', '298,136.80'],
        ['2026-09-20', 'S027', '873', '752', '261,904.00']
      ]
    },
    ads_overview: {
      columns: ['统计日期', '区域', '订单数', '实付金额', '退款金额'],
      rows: [
        ['2026-09-20', '华东区域', '8,632', '2,698,340.50', '36,812.00'],
        ['2026-09-20', '华南区域', '6,908', '2,074,186.80', '29,604.50'],
        ['2026-09-20', '华北区域', '5,736', '1,816,904.00', '21,385.00']
      ]
    },
    quality_report: {
      columns: ['报告名称', '检查日期', '规则数', '问题数', '通过率'],
      rows: [
        ['交易主题数据质量日报', '2026-09-20', '42', '5', '98.67%'],
        ['物流履约数据质量日报', '2026-09-20', '36', '3', '99.12%'],
        ['客户主数据质量周报', '2026-09-19', '28', '7', '97.54%']
      ]
    }
  };

  var state;

  function initialState() {
    var initial = findSource('ods_trade');
    return {
      keyword: '',
      expanded: { ods: true, 'source:ods_trade': true, 'table:ods_trade:ods_trade_order': true, dwd: false, dws: false, ads: false, business: false, system: false, demo: false, quality: false },
      tabs: [createTab(initial)],
      activeTabId: initial.id,
      bottomTab: 'info',
      infoLines: ['等待执行 SQL。'],
      historyQueryDraft: '',
      historyFilter: '',
      historyPage: 1,
      historyPageSize: 10,
      exportQueryDraft: '',
      exportFilter: '',
      exportPage: 1,
      exportPageSize: 10,
      histories: [
        { user: '数据分析员', time: '2026-09-21 09:36:18', sql: "SELECT COUNT(*) FROM ods_trade_order WHERE dt = '2026-09-20';", status: '运行成功', duration: '0.82 秒', info: 'OK' },
        { user: '数据分析员', time: '2026-09-20 16:18:43', sql: 'SHOW TABLES;', status: '运行成功', duration: '0.31 秒', info: 'OK' },
        { user: '数据开发工程师', time: '2026-09-20 14:05:27', sql: "SELECT * FROM dwd_trade_order_detail_di WHERE dt = '2026-09-19' LIMIT 100;", status: '运行成功', duration: '1.26 秒', info: '返回 100 条记录' },
        { user: '经营分析员', time: '2026-09-20 11:42:16', sql: "SELECT region_name, SUM(paid_amount) FROM ads_trade.ads_trade_overview_day GROUP BY region_name;", status: '运行成功', duration: '1.08 秒', info: '返回 6 条记录' },
        { user: '质量管理员', time: '2026-09-19 17:31:08', sql: 'SELECT report_name, pass_rate FROM quality_report.ads_quality_report ORDER BY check_date DESC;', status: '运行成功', duration: '0.74 秒', info: '返回 20 条记录' },
        { user: '数据分析员', time: '2026-09-19 15:26:43', sql: "SELECT order_status, COUNT(*) FROM ods_trade.ods_trade_order WHERE dt = '2026-09-19' GROUP BY order_status;", status: '运行成功', duration: '0.96 秒', info: '返回 5 条记录' },
        { user: '数据开发工程师', time: '2026-09-19 10:18:29', sql: 'DESC dwd_trade.dwd_trade_order_detail_di;', status: '运行成功', duration: '0.28 秒', info: 'OK' },
        { user: '经营分析员', time: '2026-09-18 16:47:52', sql: "SELECT shop_id, paid_amount FROM dws_trade.dws_trade_shop_day_1d WHERE stat_date = '2026-09-18';", status: '运行成功', duration: '1.12 秒', info: '返回 86 条记录' },
        { user: '数据分析员', time: '2026-09-18 13:20:11', sql: 'SHOW DATABASES;', status: '运行成功', duration: '0.22 秒', info: 'OK' },
        { user: '质量管理员', time: '2026-09-18 09:38:47', sql: "SELECT COUNT(*) FROM quality_report.ads_quality_report WHERE pass_rate < 98;", status: '运行成功', duration: '0.67 秒', info: '返回 1 条记录' },
        { user: '数据开发工程师', time: '2026-09-17 18:06:35', sql: 'SELECT * FROM governance_ops.metadata_table LIMIT 50;', status: '运行成功', duration: '0.89 秒', info: '返回 50 条记录' },
        { user: '数据分析员', time: '2026-09-17 14:52:09', sql: "SELECT carrier_name, COUNT(*) FROM ods_logistics.ods_logistics_waybill GROUP BY carrier_name;", status: '运行成功', duration: '0.78 秒', info: '返回 8 条记录' },
        { user: '经营分析员', time: '2026-09-17 10:24:18', sql: 'SELECT * FROM demo.demo_sales_order LIMIT 20;', status: '运行成功', duration: '0.35 秒', info: '返回 20 条记录' }
      ],
      exportRecords: [
        { id: 'export-progress', user: '数据分析员', time: '2026-09-21 10:18:06', sql: "SELECT * FROM ods_trade.ods_trade_order WHERE dt = '2026-09-20';", status: 'processing', progress: 68, count: '--', format: 'csv', action: '' },
        { id: 'export-success-1', user: '数据分析员', time: '2026-09-21 09:46:32', sql: "SELECT * FROM ods_logistics.ods_logistics_waybill WHERE dt = '2026-09-20';", status: 'success', progress: 100, count: '223,665', format: 'csv', action: 'file', resultKey: 'ods_logistics' },
        { id: 'export-failed-1', user: '数据开发工程师', time: '2026-09-20 17:26:18', sql: 'SELECT order_id, sku_id, paid_amount FROM dwd_trade.dwd_trade_order_detail_di;', status: 'failed', progress: 0, count: '0', format: 'csv', action: 'log', log: '导出失败：查询结果超过当前任务资源限制，请缩小查询范围后重试。' },
        { id: 'export-failed-2', user: '数据开发工程师', time: '2026-09-20 16:58:41', sql: 'SELECT stat_date, shop_id, paid_amount FROM dws_trade.dws_trade_shop_day_1d;', status: 'failed', progress: 0, count: '0', format: 'csv', action: 'log', log: '导出失败：目标文件生成异常，请稍后重试。' },
        { id: 'export-success-2', user: '经营分析员', time: '2026-09-20 15:42:09', sql: "SELECT * FROM ads_trade.ads_trade_overview_day WHERE stat_date = '2026-09-20';", status: 'success', progress: 100, count: '22,223,665', format: 'csv', action: 'file', resultKey: 'ads_overview' },
        { id: 'export-success-3', user: '质量管理员', time: '2026-09-20 14:16:55', sql: 'SELECT report_name, check_date, pass_rate FROM quality_report.ads_quality_report;', status: 'success', progress: 100, count: '18,426', format: 'csv', action: 'file', resultKey: 'quality_report' },
        { id: 'export-success-4', user: '数据分析员', time: '2026-09-19 17:48:22', sql: "SELECT * FROM ods_customer.ods_customer_info WHERE status = 'ACTIVE';", status: 'success', progress: 100, count: '86,942', format: 'csv', action: 'file', resultKey: 'ods_member' },
        { id: 'export-success-5', user: '经营分析员', time: '2026-09-19 16:21:37', sql: 'SELECT * FROM dws_trade.dws_trade_shop_day_1d;', status: 'success', progress: 100, count: '286,314', format: 'csv', action: 'file', resultKey: 'dws_shop' },
        { id: 'export-failed-3', user: '数据开发工程师', time: '2026-09-19 14:09:05', sql: 'SELECT * FROM governance_ops.metadata_table;', status: 'failed', progress: 0, count: '0', format: 'csv', action: 'log', log: '导出失败：当前账号无权导出该数据表。' },
        { id: 'export-success-6', user: '质量管理员', time: '2026-09-19 11:32:46', sql: 'SELECT * FROM quality_report.ads_quality_report;', status: 'success', progress: 100, count: '18,426', format: 'csv', action: 'file', resultKey: 'quality_report' },
        { id: 'export-success-7', user: '数据分析员', time: '2026-09-18 18:04:19', sql: "SELECT * FROM ods_trade.ods_trade_order_item WHERE dt = '2026-09-18';", status: 'success', progress: 100, count: '512,806', format: 'csv', action: 'file', resultKey: 'ods_trade' }
      ],
      lastResult: null,
      exportFormat: 'csv',
      favoritesOpen: false,
      folders: [
        { id: 'common', name: '常用查询' },
        { id: 'quality', name: '数据质量核验' }
      ],
      favorites: [
        { id: 'fav-order-day', folder: 'common', name: '订单当日明细', sql: initial.sql },
        { id: 'fav-logistics', folder: 'common', name: '物流签收进度', sql: findSource('ods_logistics').sql },
        { id: 'fav-quality', folder: 'quality', name: '质量报告最近记录', sql: findSource('quality_report').sql }
      ],
      modal: '',
      selectedFolder: 'common',
      renamingFolder: ''
    };
  }

  function escapeHtml(text) {
    return String(text == null ? '' : text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function findSource(id) {
    for (var i = 0; i < sourceGroups.length; i += 1) {
      for (var j = 0; j < sourceGroups[i].children.length; j += 1) {
        if (sourceGroups[i].children[j].id === id) return sourceGroups[i].children[j];
      }
    }
    return sourceGroups[0].children[0];
  }

  function findTab(id) {
    return state.tabs.find(function (tab) { return tab.id === id; });
  }

  function activeTab() {
    return findTab(state.activeTabId) || state.tabs[0];
  }

  function createTab(source) {
    return { id: source.id, label: source.label, sql: source.sql, theme: 'dark', font: '14px', savedAt: '' };
  }

  function highlight(text, keyword) {
    var safe = escapeHtml(text);
    if (!keyword) return safe;
    var index = text.toLowerCase().indexOf(keyword.toLowerCase());
    if (index < 0) return safe;
    return escapeHtml(text.slice(0, index)) + '<span class="de-tree-match">' + escapeHtml(text.slice(index, index + keyword.length)) + '</span>' + escapeHtml(text.slice(index + keyword.length));
  }

  function renderTree() {
    var host = pageEl.querySelector('#deSourceTree');
    if (!host) return;
    var keyword = state.keyword.trim().toLowerCase();
    var visibleCount = 0;
    var html = sourceGroups.map(function (group) {
      var groupMatch = group.label.toLowerCase().indexOf(keyword) >= 0;
      var children = group.children.map(function (source) {
        var sourceMatch = groupMatch || source.label.toLowerCase().indexOf(keyword) >= 0 || source.schema.toLowerCase().indexOf(keyword) >= 0;
        var tables = source.tables.map(function (table) {
          var tableMatch = sourceMatch || table.name.toLowerCase().indexOf(keyword) >= 0;
          var fields = table.fields.filter(function (field) {
            return !keyword || tableMatch || field.toLowerCase().indexOf(keyword) >= 0;
          });
          if (keyword && !tableMatch && !fields.length) return null;
          return { table: table, fields: fields, expanded: keyword ? true : !!state.expanded['table:' + source.id + ':' + table.id] };
        }).filter(Boolean);
        if (keyword && !sourceMatch && !tables.length) return null;
        return { source: source, tables: tables, expanded: keyword ? true : !!state.expanded['source:' + source.id] };
      }).filter(Boolean);
      if (keyword && !groupMatch && !children.length) return '';
      visibleCount += 1 + children.length;
      var expanded = keyword ? true : !!state.expanded[group.id];
      return '<div class="de-tree-group' + (expanded ? ' expanded' : '') + '" data-de-group="' + group.id + '">' +
        '<div class="de-tree-row" data-de-action="toggle-group" data-group-id="' + group.id + '" title="' + escapeHtml(group.label) + '">' +
          '<i class="bi bi-chevron-right de-tree-caret"></i><i class="bi bi-' + group.icon + '"></i><span class="de-tree-label">' + highlight(group.label, state.keyword.trim()) + '</span>' +
        '</div>' +
        '<div class="de-tree-children">' + children.map(function (item) {
          var source = item.source;
          return '<div class="de-tree-node de-tree-source' + (item.expanded ? ' expanded' : '') + '">' +
            '<div class="de-tree-row level-source' + (state.activeTabId === source.id ? ' active' : '') + '" title="' + escapeHtml(source.label) + '">' +
              '<button class="de-tree-toggle" type="button" data-de-action="toggle-source" data-source-id="' + source.id + '" aria-label="展开或收起' + escapeHtml(source.label) + '"><i class="bi bi-chevron-right de-tree-caret"></i></button>' +
              '<span class="de-tree-main" data-de-action="open-source" data-source-id="' + source.id + '"><i class="bi bi-' + source.icon + '"></i><span class="de-tree-label">' + highlight(source.label, state.keyword.trim()) + '</span></span>' +
            '</div>' +
            '<div class="de-tree-children">' + item.tables.map(function (tableItem) {
              var table = tableItem.table;
              var qualifiedName = source.schema + '.' + table.name;
              return '<div class="de-tree-node de-tree-table' + (tableItem.expanded ? ' expanded' : '') + '">' +
                '<div class="de-tree-row level-table" data-de-insert="' + escapeHtml(qualifiedName) + '" title="双击插入 ' + escapeHtml(qualifiedName) + '">' +
                  '<button class="de-tree-toggle" type="button" data-de-action="toggle-table" data-source-id="' + source.id + '" data-table-id="' + table.id + '" aria-label="展开或收起' + escapeHtml(table.name) + '"><i class="bi bi-chevron-right de-tree-caret"></i></button>' +
                  '<i class="bi bi-table"></i><span class="de-tree-label">' + highlight(table.name, state.keyword.trim()) + '</span>' +
                '</div>' +
                '<div class="de-tree-children">' + tableItem.fields.map(function (field) {
                  return '<div class="de-tree-row level-field" data-de-insert="' + escapeHtml(field) + '" title="双击插入字段 ' + escapeHtml(field) + '"><span class="de-tree-caret-spacer"></span><i class="bi bi-type"></i><span class="de-tree-label">' + highlight(field, state.keyword.trim()) + '</span></div>';
                }).join('') + '</div>' +
              '</div>';
            }).join('') + '</div>' +
          '</div>';
        }).join('') + '</div>' +
      '</div>';
    }).join('');
    host.innerHTML = visibleCount ? html : '<div class="de-tree-empty"><i class="bi bi-search"></i><div>未找到匹配的数据源</div><span>请尝试其他关键词</span></div>';
  }

  function renderTabs() {
    var host = pageEl.querySelector('#deQueryTabs');
    if (!host) return;
    host.innerHTML = state.tabs.map(function (tab) {
      return '<button class="de-query-tab' + (tab.id === state.activeTabId ? ' active' : '') + '" type="button" data-de-action="select-tab" data-tab-id="' + tab.id + '" title="' + escapeHtml(tab.label) + '">' +
        '<span>' + escapeHtml(tab.label) + '</span>' +
        (state.tabs.length > 1 ? '<i class="bi bi-x-lg de-tab-close" data-de-action="close-tab" data-tab-id="' + tab.id + '" title="关闭"></i>' : '') +
      '</button>';
    }).join('');
  }

  function renderFavoritesMenu() {
    var grouped = state.folders.map(function (folder) {
      var items = state.favorites.filter(function (item) { return item.folder === folder.id; });
      return '<div class="de-favorite-folder-title"><i class="bi bi-folder2-open"></i> ' + escapeHtml(folder.name) + '</div>' +
        items.map(function (item) {
          return '<button class="de-favorite-item" type="button" data-de-action="load-favorite" data-favorite-id="' + item.id + '"><i class="bi bi-file-earmark-code"></i><span>' + escapeHtml(item.name) + '</span></button>';
        }).join('');
    }).join('');
    return '<div class="de-favorite-wrap">' +
      '<button class="de-favorite-trigger" type="button" data-de-action="toggle-favorites"><i class="bi bi-star-fill"></i><span>收藏夹</span><i class="bi bi-chevron-down"></i></button>' +
      '<div class="de-favorite-menu"' + (state.favoritesOpen ? '' : ' hidden') + '>' +
        '<button type="button" data-de-action="add-favorite-dialog"><i class="bi bi-plus-circle"></i><span>添加到收藏夹</span></button>' +
        '<button type="button" data-de-action="manage-favorites"><i class="bi bi-gear"></i><span>整理收藏夹</span></button>' +
        '<div class="de-favorite-divider"></div>' + grouped +
      '</div>' +
    '</div>';
  }

  function renderEditor() {
    var tab = activeTab();
    var context = DP.getProjectEnvironment ? DP.getProjectEnvironment() : { project: '数据中台项目', environment: '开发' };
    var host = pageEl.querySelector('#deMainPanel');
    if (!host || !tab) return;
    host.innerHTML = '<div class="de-favorite-bar">' + renderFavoritesMenu() +
      '<div class="de-context-note"><i class="bi bi-diagram-3"></i><span>' + escapeHtml(context.project) + ' / ' + escapeHtml(context.environment) + ' · ' + escapeHtml(tab.label) + '</span></div>' +
    '</div>' +
    '<div class="de-editor-zone" id="deEditorZone">' +
      DP.sqlEditor.render({
        id: 'explore-' + tab.id,
        value: tab.sql,
        theme: tab.theme,
        font: tab.font,
        leadingActions: [
          { action: 'run', icon: 'play-fill', label: '运行', primary: true },
          { action: 'save', icon: 'save', label: '保存' }
        ]
      }) +
    '</div>' +
    '<div class="de-splitter" id="deSplitter" title="拖动调整编辑区高度"></div>' +
    '<section class="de-result-panel">' +
      '<div class="de-result-tabs" role="tablist">' +
        resultTabButton('info', '执行信息') + resultTabButton('history', '历史记录') + resultTabButton('export', '导出记录') + resultTabButton('result', '执行结果') +
      '</div>' +
      '<div class="de-result-body" id="deResultBody"></div>' +
    '</section>';

    DP.sqlEditor.mount(host, {
      onChange: function (value) { activeTab().sql = value; },
      onAction: function (action) {
        if (action === 'run') runSql();
        else if (action === 'save') saveSql();
      },
      onStateChange: function (key, value) {
        if (key === 'theme') activeTab().theme = value;
        else if (key === 'font') activeTab().font = value;
      },
      onNotify: showToast
    });
    bindSplitter();
    renderResult();
  }

  function resultTabButton(key, label) {
    return '<button class="de-result-tab' + (state.bottomTab === key ? ' active' : '') + '" type="button" role="tab" aria-selected="' + (state.bottomTab === key) + '" data-de-action="bottom-tab" data-bottom-tab="' + key + '">' + label + '</button>';
  }

  function renderResult() {
    var host = pageEl.querySelector('#deResultBody');
    if (!host) return;
    if (state.bottomTab === 'info') host.innerHTML = '<div class="de-info-log">' + escapeHtml(state.infoLines.join('\n')) + '</div>';
    else if (state.bottomTab === 'history') host.innerHTML = renderHistory();
    else if (state.bottomTab === 'export') host.innerHTML = renderExportRecords();
    else host.innerHTML = renderExecutionResult();
  }

  function renderPagination(kind, total) {
    var pageKey = kind + 'Page';
    var sizeKey = kind + 'PageSize';
    var pageSize = state[sizeKey];
    var totalPages = Math.max(1, Math.ceil(total / pageSize));
    state[pageKey] = Math.max(1, Math.min(state[pageKey], totalPages));
    var currentPage = state[pageKey];
    var pageButtons = '';
    for (var page = 1; page <= totalPages; page += 1) {
      pageButtons += '<button class="de-page-number' + (page === currentPage ? ' active' : '') + '" type="button" data-de-action="change-page" data-page-kind="' + kind + '" data-page="' + page + '" aria-label="第 ' + page + ' 页">' + page + '</button>';
    }
    return '<div class="de-pagination">' +
      '<span>共 ' + total + ' 条</span>' +
      '<button class="de-page-nav" type="button" data-de-action="change-page" data-page-kind="' + kind + '" data-page="' + (currentPage - 1) + '"' + (currentPage <= 1 ? ' disabled' : '') + '><i class="bi bi-chevron-left"></i><span>上一页</span></button>' +
      '<div class="de-page-numbers">' + pageButtons + '</div>' +
      '<button class="de-page-nav" type="button" data-de-action="change-page" data-page-kind="' + kind + '" data-page="' + (currentPage + 1) + '"' + (currentPage >= totalPages ? ' disabled' : '') + '><span>下一页</span><i class="bi bi-chevron-right"></i></button>' +
      '<select class="de-page-size" data-de-page-size data-page-kind="' + kind + '" aria-label="每页条数"><option value="10"' + (pageSize === 10 ? ' selected' : '') + '>10 条/页</option><option value="20"' + (pageSize === 20 ? ' selected' : '') + '>20 条/页</option><option value="50"' + (pageSize === 50 ? ' selected' : '') + '>50 条/页</option></select>' +
      '<label class="de-page-jump">跳至 <input type="number" min="1" max="' + totalPages + '" value="' + currentPage + '" data-de-page-jump data-page-kind="' + kind + '" aria-label="跳转页码"> 页</label>' +
    '</div>';
  }

  function renderHistory() {
    var keyword = state.historyFilter.toLowerCase();
    var rows = state.histories.filter(function (row) {
      return !keyword || [row.user, row.time, row.sql, row.status, row.info].join(' ').toLowerCase().indexOf(keyword) >= 0;
    });
    var totalPages = Math.max(1, Math.ceil(rows.length / state.historyPageSize));
    state.historyPage = Math.min(state.historyPage, totalPages);
    var start = (state.historyPage - 1) * state.historyPageSize;
    var pageRows = rows.slice(start, start + state.historyPageSize);
    return '<div class="de-table-tools"><span>共 ' + rows.length + ' 条</span><div class="de-table-tools-right"><input type="text" data-de-history-query value="' + escapeHtml(state.historyQueryDraft) + '" placeholder="输入执行 SQL 的关键词搜索"><button class="de-small-action" type="button" data-de-action="query-history"><i class="bi bi-search"></i><span>查询</span></button></div></div>' +
      '<table class="de-data-table"><thead><tr><th>操作者</th><th>执行时间</th><th style="width:30%">执行SQL</th><th>运行状态</th><th>运行时间</th><th>执行信息</th></tr></thead><tbody>' +
      (pageRows.length ? pageRows.map(function (row) {
        return '<tr><td>' + escapeHtml(row.user) + '</td><td>' + escapeHtml(row.time) + '</td><td class="de-history-sql" data-de-history-sql="' + escapeHtml(row.sql) + '" title="双击加载到编辑区：' + escapeHtml(row.sql) + '">' + escapeHtml(row.sql) + '</td><td><span class="de-status">' + escapeHtml(row.status) + '</span></td><td>' + escapeHtml(row.duration) + '</td><td>' + escapeHtml(row.info) + '</td></tr>';
      }).join('') : '<tr><td colspan="6"><div class="de-empty-state"><i class="bi bi-inbox"></i><span>暂无匹配的历史记录</span></div></td></tr>') +
      '</tbody></table>' + renderPagination('history', rows.length);
  }

  function renderExportRecords() {
    var keyword = state.exportFilter.toLowerCase();
    var records = state.exportRecords.filter(function (row) { return !keyword || [row.user, row.sql].join(' ').toLowerCase().indexOf(keyword) >= 0; });
    var totalPages = Math.max(1, Math.ceil(records.length / state.exportPageSize));
    state.exportPage = Math.min(state.exportPage, totalPages);
    var start = (state.exportPage - 1) * state.exportPageSize;
    var pageRecords = records.slice(start, start + state.exportPageSize);
    return '<div class="de-table-tools"><span>共 ' + records.length + ' 条</span><div class="de-table-tools-right"><input type="text" data-de-export-query value="' + escapeHtml(state.exportQueryDraft) + '" placeholder="输入执行 SQL 的关键词搜索"><button class="de-small-action" type="button" data-de-action="query-export"><i class="bi bi-search"></i><span>查询</span></button></div></div>' +
      '<table class="de-data-table"><thead><tr><th>操作者</th><th>执行时间</th><th style="width:28%">执行SQL</th><th>导出状态</th><th>记录数</th><th>文件格式</th><th>操作</th></tr></thead><tbody>' +
      (pageRecords.length ? pageRecords.map(function (row) {
        var statusText = row.status === 'failed' ? '导出失败' : (row.progress || 0) + '%';
        var action = row.action === 'file'
          ? '<button class="de-export-link" type="button" data-de-action="download-record" data-export-id="' + row.id + '"><i class="bi bi-file-earmark-spreadsheet"></i><span>下载文件</span></button>'
          : row.action === 'log'
            ? '<button class="de-export-link danger" type="button" data-de-action="download-log" data-export-id="' + row.id + '"><i class="bi bi-file-earmark-text"></i><span>下载日志</span></button>'
            : '<span class="de-muted">--</span>';
        return '<tr><td>' + escapeHtml(row.user) + '</td><td>' + escapeHtml(row.time) + '</td><td title="' + escapeHtml(row.sql) + '">' + escapeHtml(row.sql) + '</td><td><div class="de-export-progress ' + row.status + '"><span style="width:' + Math.max(0, Math.min(100, Number(row.progress) || 0)) + '%"></span><b>' + statusText + '</b></div></td><td>' + escapeHtml(row.count) + '</td><td>' + escapeHtml(row.format.toUpperCase()) + '</td><td>' + action + '</td></tr>';
      }).join('') : '<tr><td colspan="7"><div class="de-empty-state"><i class="bi bi-inbox"></i><span>暂无导出记录</span></div></td></tr>') +
      '</tbody></table>' + renderPagination('export', records.length);
  }

  function renderExecutionResult() {
    var result = state.lastResult;
    var count = result ? result.rows.length : 0;
    var header = result ? '<tr>' + result.columns.map(function (col) { return '<th>' + escapeHtml(col) + '</th>'; }).join('') + '</tr>' : '<tr><th>执行结果</th></tr>';
    var rows = result ? result.rows.map(function (row) {
      return '<tr>' + row.map(function (cell) { return '<td title="' + escapeHtml(cell) + '">' + escapeHtml(cell) + '</td>'; }).join('') + '</tr>';
    }).join('') : '<tr><td><div class="de-empty-state"><i class="bi bi-inbox"></i><span>运行 SQL 后查看查询结果</span></div></td></tr>';
    return '<div class="de-table-tools"><span>总记录：' + count + '</span><div class="de-table-tools-right"><label>导出格式：</label><select data-de-export-format><option value="csv" selected>CSV</option></select><button class="de-small-action" type="button" data-de-action="export-result"' + (result ? '' : ' disabled') + '><i class="bi bi-download"></i><span>导出结果</span></button></div></div>' +
      '<table class="de-data-table"><thead>' + header + '</thead><tbody>' + rows + '</tbody></table>';
  }

  function renderModal() {
    var host = pageEl.querySelector('#deModalHost');
    if (!host) return;
    if (!state.modal) {
      host.innerHTML = '';
      return;
    }
    var tab = activeTab();
    if (state.modal === 'add') {
      host.innerHTML = '<div class="de-modal-mask"><section class="de-modal de-favorite-dialog" role="dialog" aria-modal="true" aria-labelledby="deModalTitle"><header class="de-modal-header"><h3 id="deModalTitle">添加到收藏夹</h3><button class="de-modal-close" type="button" data-de-action="close-modal" title="关闭"><i class="bi bi-x-lg"></i></button></header><div class="de-modal-body de-favorite-dialog-body">' +
        '<div class="de-form-row de-form-row-inline"><label for="deFavoriteName">名称：</label><input id="deFavoriteName" maxlength="50" value="' + escapeHtml(tab.label) + '"></div>' +
        '<div class="de-form-row de-form-row-inline de-favorite-tree-row"><label>收藏夹：</label><div class="de-fav-tree-box de-fav-select-tree"><div class="de-fav-tree-list"><div class="de-fav-tree-root"><i class="bi bi-chevron-down"></i><i class="bi bi-folder-fill"></i><strong>收藏夹</strong></div>' + state.folders.map(function (folder) {
          return '<label class="de-fav-tree-row child' + (state.selectedFolder === folder.id ? ' selected' : '') + '"><input class="de-fav-radio" type="radio" name="deFavoriteFolder" value="' + folder.id + '"' + (state.selectedFolder === folder.id ? ' checked' : '') + '><i class="bi bi-chevron-right"></i><i class="bi bi-folder-fill"></i><span>' + escapeHtml(folder.name) + '</span></label>';
        }).join('') + '</div></div></div>' +
      '</div><footer class="de-modal-footer"><button class="de-small-action" type="button" data-de-action="close-modal"><i class="bi bi-x"></i><span>取消</span></button><button class="btn btn-primary" type="button" data-de-action="confirm-favorite"><i class="bi bi-check2"></i><span>确定</span></button></footer></section></div>';
    } else {
      host.innerHTML = '<div class="de-modal-mask"><section class="de-modal" role="dialog" aria-modal="true" aria-labelledby="deModalTitle"><header class="de-modal-header"><h3 id="deModalTitle">整理收藏夹</h3><button class="de-modal-close" type="button" data-de-action="close-modal" title="关闭"><i class="bi bi-x-lg"></i></button></header><div class="de-modal-body"><div class="de-fav-tree-box"><div class="de-fav-tree-head"><span><i class="bi bi-star"></i> 收藏夹</span><button class="de-small-action" type="button" data-de-action="focus-new-folder"><i class="bi bi-folder-plus"></i><span>新增目录</span></button></div><div class="de-fav-tree-list">' +
        state.folders.map(function (folder) {
          var items = state.favorites.filter(function (item) { return item.folder === folder.id; });
          return (state.renamingFolder === folder.id
            ? '<div class="de-fav-tree-row"><i class="bi bi-folder-fill"></i><input id="deRenameFolderName" value="' + escapeHtml(folder.name) + '" maxlength="20" style="flex:1;height:30px;border:1px solid #dce2e9;border-radius:4px;padding:0 8px"><div class="de-fav-tree-actions"><button type="button" data-de-action="save-folder-name" data-folder-id="' + folder.id + '" title="保存"><i class="bi bi-check2"></i></button><button type="button" data-de-action="cancel-rename" title="取消"><i class="bi bi-x"></i></button></div></div>'
            : '<div class="de-fav-tree-row"><i class="bi bi-folder-fill"></i><span>' + escapeHtml(folder.name) + '</span><div class="de-fav-tree-actions"><button type="button" data-de-action="rename-folder" data-folder-id="' + folder.id + '" title="重命名"><i class="bi bi-pencil"></i></button><button type="button" data-de-action="delete-folder" data-folder-id="' + folder.id + '" title="删除"><i class="bi bi-trash3"></i></button></div></div>') +
            items.map(function (item) { return '<div class="de-fav-tree-row child"><i class="bi bi-file-earmark-code"></i><span>' + escapeHtml(item.name) + '</span></div>'; }).join('');
        }).join('') +
        '<div class="de-fav-tree-row" id="deManageNewFolder" hidden><i class="bi bi-folder-plus"></i><input id="deManageFolderName" maxlength="20" placeholder="目录名称" style="flex:1;height:30px;border:1px solid #dce2e9;border-radius:4px;padding:0 8px"><button class="de-small-action" type="button" data-de-action="confirm-manage-folder"><i class="bi bi-check2"></i><span>保存</span></button></div>' +
      '</div></div></div><footer class="de-modal-footer"><button class="btn btn-primary" type="button" data-de-action="close-modal"><i class="bi bi-check2"></i><span>确定</span></button></footer></section></div>';
    }
  }

  function openSource(id) {
    var source = findSource(id);
    if (!findTab(id)) state.tabs.push(createTab(source));
    state.activeTabId = id;
    state.bottomTab = 'info';
    state.infoLines = ['已连接：' + source.label, '等待执行 SQL。'];
    renderTree();
    renderTabs();
    renderEditor();
  }

  function closeTab(id) {
    if (state.tabs.length === 1) return;
    var index = state.tabs.findIndex(function (tab) { return tab.id === id; });
    if (index < 0) return;
    state.tabs.splice(index, 1);
    if (state.activeTabId === id) state.activeTabId = state.tabs[Math.max(0, index - 1)].id;
    state.lastResult = null;
    renderTree();
    renderTabs();
    renderEditor();
  }

  function runSql() {
    var tab = activeTab();
    if (!tab.sql.trim()) {
      showToast('请输入 SQL 后再运行', 'warning');
      return;
    }
    var result = resultSets[tab.id] || {
      columns: ['表名', '类型', '所属层级', '状态'],
      rows: [['dim_region', '维度表', 'DIM', '可用'], ['fact_trade_order', '事实表', 'DWD', '可用'], ['ads_trade_overview_day', '应用表', 'ADS', '可用']]
    };
    state.lastResult = { columns: result.columns.slice(), rows: result.rows.map(function (row) { return row.slice(); }) };
    state.infoLines = [
      '[2026-09-21 10:24:18] 开始执行 SQL',
      '[2026-09-21 10:24:18] 数据源：' + tab.label,
      '[2026-09-21 10:24:19] 扫描完成，返回 ' + result.rows.length + ' 条记录',
      '[2026-09-21 10:24:19] 执行成功，耗时 0.86 秒'
    ];
    state.histories.unshift({ user: '数据分析员', time: '2026-09-21 10:24:19', sql: tab.sql, status: '运行成功', duration: '0.86 秒', info: '返回 ' + result.rows.length + ' 条记录' });
    state.historyPage = 1;
    state.bottomTab = 'result';
    refreshBottomTabs();
    renderResult();
    showToast('SQL 执行成功', 'success');
  }

  function saveSql() {
    state.favoritesOpen = false;
    state.modal = 'add';
    renderModal();
  }

  function insertIntoEditor(text) {
    var editor = pageEl.querySelector('#deEditorZone [data-dp-sql-editor]');
    if (!editor || !DP.sqlEditor || !DP.sqlEditor.insertAtCursor) return;
    DP.sqlEditor.insertAtCursor(editor, text, {
      onChange: function (value) { activeTab().sql = value; }
    });
  }

  function loadHistorySql(sql) {
    var editor = pageEl.querySelector('#deEditorZone [data-dp-sql-editor]');
    if (!editor || !DP.sqlEditor) return;
    activeTab().sql = sql;
    DP.sqlEditor.setValue(editor, sql, {
      onChange: function (value) { activeTab().sql = value; }
    });
    if (DP.sqlEditor.focusAt) DP.sqlEditor.focusAt(editor, sql.length);
  }

  function refreshBottomTabs() {
    pageEl.querySelectorAll('.de-result-tab').forEach(function (button) {
      var active = button.dataset.bottomTab === state.bottomTab;
      button.classList.toggle('active', active);
      button.setAttribute('aria-selected', String(active));
    });
  }

  function showToast(text, type) {
    if (!pageEl) return;
    var old = pageEl.querySelector('.de-toast');
    if (old) old.remove();
    var toast = document.createElement('div');
    toast.className = 'de-toast ' + (type || 'info');
    toast.innerHTML = '<i class="bi bi-' + (type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-circle' : 'info-circle') + '"></i><span>' + escapeHtml(text) + '</span>';
    pageEl.appendChild(toast);
    window.setTimeout(function () { if (toast.parentNode) toast.remove(); }, 1800);
  }

  function exportResult(recordId) {
    var record = recordId ? state.exportRecords.find(function (item) { return item.id === recordId; }) : null;
    var exportData = record ? (record.result || resultSets[record.resultKey]) : state.lastResult;
    if (!exportData) return;
    var format = record ? record.format : state.exportFormat;
    var content = [exportData.columns].concat(exportData.rows).map(function (row) {
      return row.map(function (cell) { return '"' + String(cell).replace(/"/g, '""') + '"'; }).join(',');
    }).join('\n');
    var blob = new Blob(['\ufeff' + content], { type: 'text/csv;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.href = url;
    link.download = activeTab().label + '_查询结果.' + format;
    link.click();
    URL.revokeObjectURL(url);
    if (!record) {
      state.exportRecords.unshift({
        id: 'export-' + Date.now(),
        user: '数据分析员',
        time: '2026-09-21 10:25:06',
        sql: activeTab().sql,
        status: 'success',
        progress: 100,
        count: String(exportData.rows.length),
        format: format,
        action: 'file',
        result: { columns: exportData.columns.slice(), rows: exportData.rows.map(function (row) { return row.slice(); }) }
      });
      state.exportPage = 1;
    }
    showToast('查询结果已导出', 'success');
  }

  function downloadExportLog(recordId) {
    var record = state.exportRecords.find(function (item) { return item.id === recordId; });
    if (!record || !record.log) return;
    var blob = new Blob([record.log], { type: 'text/plain;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.href = url;
    link.download = '数据探索导出日志_' + record.time.replace(/[^0-9]/g, '') + '.txt';
    link.click();
    URL.revokeObjectURL(url);
    showToast('导出日志已下载', 'success');
  }

  function bindSplitter() {
    var splitter = pageEl.querySelector('#deSplitter');
    var zone = pageEl.querySelector('#deEditorZone');
    var panel = pageEl.querySelector('#deMainPanel');
    if (!splitter || !zone || !panel) return;
    splitter.addEventListener('mousedown', function (event) {
      splitterState = { startY: event.clientY, startHeight: zone.getBoundingClientRect().height, panelHeight: panel.getBoundingClientRect().height };
      document.body.style.cursor = 'row-resize';
      document.body.style.userSelect = 'none';
    });
  }

  function handleMouseMove(event) {
    if (!splitterState || !pageEl) return;
    var zone = pageEl.querySelector('#deEditorZone');
    if (!zone) return;
    var next = splitterState.startHeight + event.clientY - splitterState.startY;
    var min = 190;
    var max = Math.max(min, splitterState.panelHeight - 220);
    zone.style.height = Math.min(max, Math.max(min, next)) + 'px';
  }

  function handleMouseUp() {
    if (!splitterState) return;
    splitterState = null;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }

  function handleClick(event) {
    var target = event.target.closest('[data-de-action]');
    if (!target || !pageEl.contains(target)) return;
    var action = target.dataset.deAction;
    if (action === 'toggle-group') {
      var groupId = target.dataset.groupId;
      state.expanded[groupId] = !state.expanded[groupId];
      renderTree();
    } else if (action === 'toggle-source') {
      var sourceKey = 'source:' + target.dataset.sourceId;
      state.expanded[sourceKey] = !state.expanded[sourceKey];
      renderTree();
    } else if (action === 'toggle-table') {
      var tableKey = 'table:' + target.dataset.sourceId + ':' + target.dataset.tableId;
      state.expanded[tableKey] = !state.expanded[tableKey];
      renderTree();
    } else if (action === 'open-source') openSource(target.dataset.sourceId);
    else if (action === 'select-tab') {
      state.activeTabId = target.dataset.tabId;
      state.lastResult = null;
      renderTree(); renderTabs(); renderEditor();
    } else if (action === 'close-tab') {
      event.stopPropagation();
      closeTab(target.dataset.tabId);
    } else if (action === 'refresh-tree') {
      renderTree();
      showToast('数据源目录已刷新', 'success');
    } else if (action === 'toggle-favorites') {
      state.favoritesOpen = !state.favoritesOpen;
      renderEditor();
    } else if (action === 'add-favorite-dialog') {
      state.favoritesOpen = false; state.modal = 'add'; renderModal();
    } else if (action === 'manage-favorites') {
      state.favoritesOpen = false; state.modal = 'manage'; renderModal();
    } else if (action === 'load-favorite') {
      var favorite = state.favorites.find(function (item) { return item.id === target.dataset.favoriteId; });
      if (favorite) {
        activeTab().sql = favorite.sql;
        state.favoritesOpen = false;
        renderEditor();
        showToast('已载入收藏查询：' + favorite.name, 'success');
      }
    } else if (action === 'bottom-tab') {
      state.bottomTab = target.dataset.bottomTab;
      refreshBottomTabs();
      renderResult();
    } else if (action === 'query-history') {
      var input = pageEl.querySelector('[data-de-history-query]');
      state.historyQueryDraft = input ? input.value : '';
      state.historyFilter = state.historyQueryDraft.trim();
      state.historyPage = 1;
      renderResult();
    } else if (action === 'query-export') {
      var exportInput = pageEl.querySelector('[data-de-export-query]');
      state.exportQueryDraft = exportInput ? exportInput.value : '';
      state.exportFilter = state.exportQueryDraft.trim();
      state.exportPage = 1;
      renderResult();
    } else if (action === 'change-page') {
      var pageKind = target.dataset.pageKind;
      if (pageKind !== 'history' && pageKind !== 'export') return;
      state[pageKind + 'Page'] = Math.max(1, Number(target.dataset.page) || 1);
      renderResult();
    } else if (action === 'export-result') exportResult();
    else if (action === 'download-record') exportResult(target.dataset.exportId);
    else if (action === 'download-log') downloadExportLog(target.dataset.exportId);
    else if (action === 'close-modal') { state.modal = ''; renderModal(); }
    else if (action === 'add-folder') addFolder('deNewFolderName');
    else if (action === 'confirm-favorite') confirmFavorite();
    else if (action === 'focus-new-folder') {
      var row = pageEl.querySelector('#deManageNewFolder');
      if (row) { row.hidden = false; row.querySelector('input').focus(); }
    } else if (action === 'confirm-manage-folder') addFolder('deManageFolderName');
    else if (action === 'rename-folder') { state.renamingFolder = target.dataset.folderId; renderModal(); }
    else if (action === 'save-folder-name') saveFolderName(target.dataset.folderId);
    else if (action === 'cancel-rename') { state.renamingFolder = ''; renderModal(); }
    else if (action === 'delete-folder') deleteFolder(target.dataset.folderId);
  }

  function handleDoubleClick(event) {
    var historyCell = event.target.closest('[data-de-history-sql]');
    if (historyCell && pageEl.contains(historyCell)) {
      loadHistorySql(historyCell.dataset.deHistorySql || '');
      return;
    }
    if (event.target.closest('[data-de-action]')) return;
    var treeNode = event.target.closest('[data-de-insert]');
    if (treeNode && pageEl.contains(treeNode)) insertIntoEditor(treeNode.dataset.deInsert || '');
  }

  function addFolder(inputId) {
    var input = pageEl.querySelector('#' + inputId);
    var name = input ? input.value.trim() : '';
    if (!name) { showToast('请输入目录名称', 'warning'); return; }
    var id = 'folder-' + Date.now();
    state.folders.push({ id: id, name: name });
    state.selectedFolder = id;
    renderModal();
    showToast('收藏目录已新增', 'success');
  }

  function confirmFavorite() {
    var nameInput = pageEl.querySelector('#deFavoriteName');
    var folderInput = pageEl.querySelector('input[name="deFavoriteFolder"]:checked');
    var name = nameInput ? nameInput.value.trim() : '';
    if (!name) { showToast('请输入收藏名称', 'warning'); return; }
    state.favorites.push({ id: 'favorite-' + Date.now(), folder: folderInput ? folderInput.value : state.folders[0].id, name: name, sql: activeTab().sql });
    state.modal = '';
    renderModal();
    showToast('已添加到收藏夹', 'success');
  }

  function saveFolderName(id) {
    var folder = state.folders.find(function (item) { return item.id === id; });
    if (!folder) return;
    var input = pageEl.querySelector('#deRenameFolderName');
    var next = input ? input.value.trim() : '';
    if (!next) { showToast('请输入目录名称', 'warning'); return; }
    folder.name = next;
    state.renamingFolder = '';
    renderModal();
  }

  function deleteFolder(id) {
    if (state.folders.length <= 1) { showToast('至少保留一个收藏目录', 'warning'); return; }
    var targetIndex = state.folders.findIndex(function (item) { return item.id === id; });
    if (targetIndex < 0) return;
    var fallback = state.folders[targetIndex === 0 ? 1 : 0].id;
    state.favorites.forEach(function (item) { if (item.folder === id) item.folder = fallback; });
    state.folders.splice(targetIndex, 1);
    state.selectedFolder = fallback;
    renderModal();
    showToast('目录已删除，查询已移至其他目录', 'success');
  }

  function handleInput(event) {
    if (event.target.matches('#deSourceKeyword')) {
      state.keyword = event.target.value;
      renderTree();
    } else if (event.target.matches('[data-de-history-query]')) {
      state.historyQueryDraft = event.target.value;
    } else if (event.target.matches('[data-de-export-query]')) {
      state.exportQueryDraft = event.target.value;
    }
  }

  function handleChange(event) {
    if (event.target.matches('[data-de-export-format]')) state.exportFormat = event.target.value;
    else if (event.target.matches('[data-de-page-size]')) {
      var pageKind = event.target.dataset.pageKind;
      if (pageKind !== 'history' && pageKind !== 'export') return;
      state[pageKind + 'PageSize'] = Number(event.target.value) || 10;
      state[pageKind + 'Page'] = 1;
      renderResult();
    }
    else if (event.target.matches('input[name="deFavoriteFolder"]')) {
      state.selectedFolder = event.target.value;
      renderModal();
    }
  }

  function handleKeydown(event) {
    if (event.target.matches('[data-de-history-query]') && event.key === 'Enter') {
      state.historyQueryDraft = event.target.value;
      state.historyFilter = state.historyQueryDraft.trim();
      state.historyPage = 1;
      renderResult();
    } else if (event.target.matches('[data-de-export-query]') && event.key === 'Enter') {
      state.exportQueryDraft = event.target.value;
      state.exportFilter = state.exportQueryDraft.trim();
      state.exportPage = 1;
      renderResult();
    } else if (event.target.matches('[data-de-page-jump]') && event.key === 'Enter') {
      event.preventDefault();
      var pageKind = event.target.dataset.pageKind;
      if (pageKind !== 'history' && pageKind !== 'export') return;
      state[pageKind + 'Page'] = Math.max(1, Number(event.target.value) || 1);
      renderResult();
    } else if (event.key === 'Escape') {
      if (state.modal) { state.modal = ''; renderModal(); }
      state.favoritesOpen = false;
      var menu = pageEl.querySelector('.de-favorite-menu');
      if (menu) menu.hidden = true;
      pageEl.querySelectorAll('.dp-sql-editor.is-fullscreen').forEach(function (editor) {
        editor.classList.remove('is-fullscreen');
        var button = editor.querySelector('[data-dp-sql-action="fullscreen"]');
        if (button) { button.querySelector('span').textContent = '全屏'; button.querySelector('i').className = 'bi bi-arrows-fullscreen'; }
      });
    }
  }

  function init() {
    pageEl = document.querySelector('.page-data-explore');
    if (!pageEl) return;
    state = initialState();
    renderTree();
    renderTabs();
    renderEditor();
    renderModal();

    pageEl.addEventListener('click', handleClick);
    pageEl.addEventListener('dblclick', handleDoubleClick);
    pageEl.addEventListener('input', handleInput);
    pageEl.addEventListener('change', handleChange);
    pageEl.addEventListener('keydown', handleKeydown);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    if (outsideHandler) document.removeEventListener('click', outsideHandler);
    outsideHandler = function (event) {
      if (!pageEl || !document.body.contains(pageEl)) return;
      if (!event.target.closest('.de-favorite-wrap') && state.favoritesOpen) {
        state.favoritesOpen = false;
        var menu = pageEl.querySelector('.de-favorite-menu');
        if (menu) menu.hidden = true;
      }
    };
    document.addEventListener('click', outsideHandler);

    if (projectHandler) document.removeEventListener('dp:project-environment-change', projectHandler);
    projectHandler = function () {
      if (!pageEl || !document.body.contains(pageEl)) return;
      renderEditor();
      showToast('已切换项目与环境，数据源目录已刷新', 'success');
    };
    document.addEventListener('dp:project-environment-change', projectHandler);
  }

  return {
    html: '<div class="page-data-explore">' +
      '<aside class="de-source-panel" aria-label="数据源目录">' +
        '<div class="de-source-search"><div class="de-source-searchbox"><input id="deSourceKeyword" type="text" placeholder="搜索关键字" autocomplete="off"><i class="bi bi-search"></i></div></div>' +
        '<div class="de-source-tree" id="deSourceTree"></div>' +
      '</aside>' +
      '<main class="de-workspace"><div class="de-query-tabs" id="deQueryTabs" role="tablist"></div><div class="de-main-panel" id="deMainPanel"></div></main>' +
      '<div id="deModalHost"></div>' +
    '</div>',
    init: init
  };
})();
