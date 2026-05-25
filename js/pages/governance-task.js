/**
 * 数据中台 V4.0 - 数据治理 / 治理任务
 */
window.DP = window.DP || {};
DP.pages = DP.pages || {};

DP.pages.governanceTask = (function () {
  var pageSize = 8;
  var currentPage = 1;
  var activeStatus = 'ongoing';
  var activePlanId = 'gp-001';
  var filters = {
    keyword: '',
    metadataFill: 'all',
    standardMap: 'all',
    standardAudit: 'all',
    dataQuality: 'all'
  };

  var statusTabs = [
    { key: 'ongoing', label: '进行中' },
    { key: 'completed', label: '已完成' },
    { key: 'archived', label: '归档' }
  ];

  var plans = [
    { id: 'gp-001', name: '客户域核心资产治理规划', status: 'ongoing', rate: 68, owner: '李婷', createdAt: '2026-05-08 09:30', counts: { db: 2, table: 32, field: 520 }, desc: '围绕客户主数据、会员基础表和客户标签字段补齐标准、口径、血缘与责任人信息。' },
    { id: 'gp-002', name: '交易域数仓标准化规划', status: 'completed', rate: 100, owner: '张明', createdAt: '2026-05-06 14:20', counts: { db: 2, table: 28, field: 460 }, desc: '完成订单、支付、履约主题库表字段的标准映射和核心指标口径统一。' },
    { id: 'gp-003', name: '营销域标签数据治理规划', status: 'ongoing', rate: 54, owner: '王强', createdAt: '2026-05-05 11:05', counts: { db: 1, table: 24, field: 360 }, desc: '梳理活动投放、用户触达和标签生产链路，明确标签字段命名、来源和使用范围。' },
    { id: 'gp-004', name: '供应链主题资产治理规划', status: 'ongoing', rate: 0, owner: '赵磊', createdAt: '2026-05-04 16:45', counts: { db: 1, table: 18, field: 260 }, desc: '计划对供应商、库存、入库出库等主题资产进行责任归属和元数据完整性治理。' },
    { id: 'gp-005', name: '财务报表口径治理规划', status: 'ongoing', rate: 72, owner: '陈晨', createdAt: '2026-05-03 10:18', counts: { db: 1, table: 20, field: 310 }, desc: '统一收入、退款、成本、毛利相关字段定义，降低跨报表统计口径差异。' },
    { id: 'gp-006', name: '商品域基础模型治理规划', status: 'completed', rate: 100, owner: '刘洋', createdAt: '2026-05-02 15:36', counts: { db: 2, table: 22, field: 330 }, desc: '完成商品类目、SKU、SPU 相关库表字段的标准绑定和基础质量规则配置。' },
    { id: 'gp-007', name: '公共维表字段治理规划', status: 'ongoing', rate: 61, owner: '孙悦', createdAt: '2026-04-30 13:12', counts: { db: 1, table: 16, field: 280 }, desc: '治理区域、日期、组织、渠道等公共维表，沉淀可复用字段标准和维护责任。' },
    { id: 'gp-008', name: '实时数据链路治理规划', status: 'ongoing', rate: 46, owner: '周航', createdAt: '2026-04-28 17:20', counts: { db: 1, table: 18, field: 240 }, desc: '聚焦实时采集、清洗和宽表产出链路，补齐任务归属、字段说明和异常处置规则。' },
    { id: 'gp-009', name: '风控模型特征治理规划', status: 'archived', rate: 0, owner: '高敏', createdAt: '2026-04-26 09:42', counts: { db: 1, table: 14, field: 210 }, desc: '准备对风控特征字段进行来源校验、脱敏标识和模型使用说明补充。' },
    { id: 'gp-010', name: '经营分析指标治理规划', status: 'completed', rate: 100, owner: '黄鑫', createdAt: '2026-04-24 10:00', counts: { db: 2, table: 26, field: 390 }, desc: '完成 GMV、客单价、转化率等经营指标涉及字段的定义、计算口径和资产归属治理。' },
    { id: 'gp-011', name: '数据安全分级治理规划', status: 'ongoing', rate: 39, owner: '何倩', createdAt: '2026-04-22 14:28', counts: { db: 1, table: 13, field: 180 }, desc: '按敏感等级梳理个人信息、交易信息和经营数据字段，补齐安全分级和使用边界。' },
    { id: 'gp-012', name: '项目资源目录治理规划', status: 'archived', rate: 100, owner: '马宁', createdAt: '2026-04-20 11:50', counts: { db: 1, table: 15, field: 220 }, desc: '完成重点项目资产目录归类、资源责任人和使用说明整理，支撑后续资源管理视图。' }
  ];

  var planTables = {
    'gp-001': [
      row('order_main', '订单主表', '核心订单交易主表，记录所有订单基础信息', 100, 100, 100, 45),
      row('order_detail', '订单明细表', '订单商品明细，包含SKU、数量、金额', 100, 85, 62, 30),
      row('dwd_customer_base', '客户基础信息表', '客户主数据基础属性与会员标识信息', 100, 72, 38, 20),
      row('ods_member_address', '会员地址表', '会员收货地址、默认地址与地址标签', 48, 36, 12, 0),
      row('ads_user_tag_profile', '用户标签画像表', '客户标签画像与营销圈选结果宽表', 100, 100, 100, 100),
      row('dwd_customer_identity', '客户身份认证表', '客户实名、证件与认证状态信息', 100, 64, 40, 100),
      row('dim_member_level', '会员等级维表', '会员等级、成长值区间与权益说明', 56, 100, 34, 18),
      row('asset_owner_relation', '资产责任关系表', '客户域资产负责人、业务归属与维护关系', 100, 100, 100, 76),
      row('resource_apply_record', '资源申请记录表', '客户域资源申请、授权与使用留痕', 28, 15, 0, 0)
    ],
    'gp-003': [
      row('dwd_campaign_touch_di', '活动触达明细表', '营销活动触达用户、渠道和触达结果', 100, 100, 70, 42),
      row('dws_marketing_conversion_1d', '营销转化汇总表', '按天统计营销触达、点击和转化情况', 100, 58, 40, 100),
      row('ads_user_tag_profile', '用户标签画像表', '用户标签结果、标签版本与可用范围', 100, 100, 100, 100),
      row('dim_channel', '渠道维表', '渠道编码、渠道名称与渠道层级', 60, 100, 28, 10),
      row('ads_order_overview', '订单概览报表', '面向营销复盘的订单概览报表', 100, 100, 46, 100)
    ],
    'gp-004': [
      row('ods_supplier_main', '供应商主表', '供应商基础资料、资质与状态', 100, 24, 0, 0),
      row('dwd_inventory_snapshot_di', '库存快照表', '商品库存每日快照与库存地点', 18, 0, 0, 0),
      row('dwd_purchase_order_detail', '采购订单明细表', '采购订单、物料、数量与金额明细', 100, 100, 36, 12),
      row('dim_warehouse', '仓库维表', '仓库编码、区域、类型与负责人', 100, 100, 100, 58)
    ],
    'gp-005': [
      row('ads_finance_income_report', '收入分析报表', '财务收入、退款与折扣统计口径', 100, 100, 68, 100),
      row('dwd_refund_detail_di', '退款明细表', '订单退款申请、审核和退款金额', 100, 42, 30, 16),
      row('dws_cost_summary_1d', '成本日汇总表', '按日汇总商品成本、履约成本和营销费用', 100, 100, 100, 75),
      row('dim_account_subject', '会计科目维表', '会计科目编码、名称和核算层级', 54, 100, 22, 0)
    ],
    'gp-007': [
      row('dim_date', '日期维表', '自然日、工作日、周月季度和节假日信息', 100, 100, 100, 100),
      row('dim_region', '区域维表', '国家、省市区与区域层级', 100, 100, 64, 38),
      row('dim_org', '组织维表', '组织编码、组织层级和负责人', 45, 30, 20, 0),
      row('dim_channel', '渠道维表', '渠道编码、渠道名称与渠道层级', 100, 100, 100, 72)
    ],
    'gp-008': [
      row('ods_event_log_rt', '实时事件日志表', '实时采集的用户行为事件明细', 100, 35, 20, 0),
      row('dwd_order_fact_rt', '实时订单事实表', '实时订单宽表产出链路', 100, 100, 58, 100),
      row('dws_realtime_metric_1m', '实时指标分钟表', '按分钟汇总实时交易与访问指标', 30, 18, 0, 0),
      row('ads_realtime_dashboard', '实时看板报表', '实时经营看板展示数据', 100, 100, 100, 100)
    ],
    'gp-011': [
      row('order_payment', '订单支付记录', '支付流水、支付渠道、支付状态记录', 100, 100, 56, 100),
      row('order_address', '收货地址表', '用户订单关联的收货地址信息', 100, 42, 24, 18),
      row('dwd_customer_identity', '客户身份认证表', '客户实名、证件与认证状态信息', 100, 100, 100, 66),
      row('asset_security_level', '资产安全分级表', '资产敏感等级、脱敏策略与授权边界', 26, 15, 0, 0)
    ],
    'gp-002': [
      row('ods_order_main', '订单主表', '订单交易主数据，承载订单生命周期状态', 100, 100, 100, 100),
      row('dwd_trade_order_detail_di', '交易订单明细表', '交易订单明细、商品、优惠和支付口径', 100, 100, 100, 100),
      row('dws_trade_summary_1d', '交易汇总表', '按日沉淀交易指标和标准口径', 100, 100, 100, 100),
      row('ads_sales_daily_report', '销售日分析报表', '销售日报经营指标展示', 100, 100, 100, 100)
    ],
    'gp-006': [
      row('ods_product_spu', '商品SPU表', '商品基础模型和类目归属信息', 100, 100, 100, 100),
      row('ods_product_sku', '商品SKU表', 'SKU规格、价格和上下架状态', 100, 100, 100, 100),
      row('dim_product_category', '商品类目维表', '商品类目层级和维护责任', 100, 100, 100, 100),
      row('dwd_product_inventory_di', '商品库存明细表', '商品库存和销售状态快照', 100, 100, 100, 100)
    ],
    'gp-010': [
      row('ads_gmv_overview', 'GMV概览报表', '经营分析核心指标口径和展示表', 100, 100, 100, 100),
      row('dws_conversion_rate_1d', '转化率日汇总表', '按日统计转化链路指标', 100, 100, 100, 100),
      row('dws_customer_price_1d', '客单价日汇总表', '客单价、订单数和用户数统计', 100, 100, 100, 100),
      row('ads_operation_metric_report', '经营指标报表', '管理层经营分析指标报表', 100, 100, 100, 100)
    ],
    'gp-009': [
      row('dwd_risk_feature_di', '风控特征明细表', '风控模型特征来源、口径与脱敏说明', 0, 0, 0, 0),
      row('dim_risk_model', '风控模型维表', '模型编码、版本和责任人信息', 0, 0, 0, 0),
      row('ads_risk_score_report', '风险评分报表', '风险评分结果和模型应用说明', 0, 0, 0, 0)
    ],
    'gp-012': [
      row('asset_catalog_item', '资产目录表', '资产目录归类和层级维护结果', 100, 100, 100, 100),
      row('project_resource_usage', '项目资源使用表', '项目资源消耗、归属和使用说明', 100, 100, 100, 100),
      row('asset_owner_relation', '资产责任关系表', '资产责任人、部门和维护关系', 100, 100, 100, 100),
      row('resource_apply_record', '资源申请记录表', '资源申请、审批和使用留痕', 100, 100, 100, 100)
    ]
  };

  function row(tableName, alias, comment, metadataFill, standardMap, standardAudit, dataQuality) {
    return {
      tableName: tableName,
      alias: alias,
      comment: comment,
      metadataFill: metadataFill,
      standardMap: standardMap,
      standardAudit: standardAudit,
      dataQuality: dataQuality
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

  function normalize(value) {
    return String(value || '').trim().toLowerCase();
  }

  function getStatusLabel(status) {
    var item = statusTabs.find(function (tab) { return tab.key === status; });
    return item ? item.label : status;
  }

  function getPlansByStatus(status) {
    return plans.filter(function (plan) { return plan.status === status; });
  }

  function getPlanCount(status) {
    return getPlansByStatus(status).length;
  }

  function getFilteredPlans() {
    var keyword = normalize((document.getElementById('gtPlanSearch') || {}).value || '');
    return getPlansByStatus(activeStatus).filter(function (plan) {
      return matchText(plan.name + ' ' + plan.owner + ' ' + plan.createdAt, keyword);
    });
  }

  function ensureActivePlan() {
    var active = plans.find(function (plan) { return plan.id === activePlanId && plan.status === activeStatus; });
    if (active) return active;
    var first = getPlansByStatus(activeStatus)[0] || plans[0];
    activePlanId = first ? first.id : '';
    return first;
  }

  function getActivePlan() {
    return ensureActivePlan();
  }

  function getActiveRows() {
    return (planTables[activePlanId] || []).slice();
  }

  function findTable(tableName) {
    return getActiveRows().find(function (item) {
      return item.tableName === tableName;
    }) || getActiveRows()[0];
  }

  function matchText(value, keyword) {
    return !keyword || normalize(value).indexOf(keyword) >= 0;
  }

  function matchStatus(value, status) {
    if (status === 'all') return true;
    return status === 'done' ? value >= 100 : value < 100;
  }

  function getFilteredRows() {
    var keyword = normalize(filters.keyword);

    return getActiveRows().filter(function (item) {
      var searchText = item.tableName + ' ' + item.alias + ' ' + item.comment;
      return matchText(searchText, keyword) &&
        matchStatus(item.metadataFill, filters.metadataFill) &&
        matchStatus(item.standardMap, filters.standardMap) &&
        matchStatus(item.standardAudit, filters.standardAudit) &&
        matchStatus(item.dataQuality, filters.dataQuality);
    });
  }

  function getCompletionRate(rows) {
    var total = rows.length * 4;
    if (!total) return 0;
    var done = rows.reduce(function (sum, item) {
      return sum +
        item.metadataFill +
        item.standardMap +
        item.standardAudit +
        item.dataQuality;
    }, 0);
    return Math.round(done / total);
  }

  function renderPlans() {
    ensureActivePlan();
    var html = getFilteredPlans().map(function (plan) {
      return '<button class="gt-plan-item' + (plan.id === activePlanId ? ' active' : '') + '" type="button" data-gt-plan="' + plan.id + '">' +
        '<span class="gt-plan-name" title="' + escapeHtml(plan.name) + '">' + escapeHtml(plan.name) + '</span>' +
        '<span class="gt-plan-rate">' + plan.rate + '%</span>' +
        '<span class="gt-plan-progress"><span style="width:' + plan.rate + '%;"></span></span>' +
        '<span class="gt-plan-meta"><span><i class="bi bi-person"></i>' + escapeHtml(plan.owner) + '</span><span>' + escapeHtml(plan.createdAt) + '</span></span>' +
      '</button>';
    }).join('');

    return html || '<div class="gt-empty-side">未找到' + getStatusLabel(activeStatus) + '的治理规划</div>';
  }

  function renderPlanStatusTabs() {
    return '<div class="gt-plan-status-tabs">' + statusTabs.map(function (tab) {
      return '<button class="gt-plan-status-tab' + (tab.key === activeStatus ? ' active' : '') + '" type="button" data-gt-status="' + tab.key + '">' +
        '<span>' + tab.label + '</span><b>' + getPlanCount(tab.key) + '</b>' +
      '</button>';
    }).join('') + '</div>';
  }

  function renderStatusSelect(key, label) {
    return '<label class="gt-filter-field gt-filter-field-sm"><span>' + label + '</span>' +
      '<select class="ma-select" data-gt-filter="' + key + '">' +
        '<option value="all"' + (filters[key] === 'all' ? ' selected' : '') + '>全部</option>' +
        '<option value="todo"' + (filters[key] === 'todo' ? ' selected' : '') + '>未完成</option>' +
        '<option value="done"' + (filters[key] === 'done' ? ' selected' : '') + '>已完成</option>' +
      '</select></label>';
  }

  function renderFilters() {
    return '<div class="gt-filter-grid">' +
      renderStatusSelect('metadataFill', '元数据填充') +
      renderStatusSelect('standardMap', '标准映射') +
      renderStatusSelect('standardAudit', '标准稽查') +
      renderStatusSelect('dataQuality', '数据质量') +
      '<label class="gt-filter-field gt-keyword-field"><input class="ma-search" data-gt-filter="keyword" type="text" value="' + escapeHtml(filters.keyword) + '" placeholder="搜索表名、别名、注释"></label>' +
      '<div class="gt-filter-actions">' +
        '<button class="btn btn-primary" type="button" data-gt-action="search"><i class="bi bi-search"></i> 查询</button>' +
        '<button class="btn btn-outline" type="button" data-gt-action="reset"><i class="bi bi-arrow-counterclockwise"></i> 重置</button>' +
      '</div>' +
    '</div>';
  }

  function renderRate(rate) {
    var tagClass = rate >= 100 ? 'tag-green' : rate > 0 ? 'tag-yellow' : 'tag-red';
    return '<span class="gt-rate-cell">' +
      '<span class="tag ' + tagClass + '">' + rate + '%</span>' +
      '<span class="gt-rate-track"><span style="width:' + rate + '%;"></span></span>' +
    '</span>';
  }

  function renderTable() {
    var rows = getFilteredRows();
    var totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
    currentPage = Math.min(Math.max(1, currentPage), totalPages);
    var start = (currentPage - 1) * pageSize;
    var pageRows = rows.slice(start, start + pageSize);

    var body = pageRows.map(function (item) {
      return '<tr>' +
        '<td class="td-link" title="' + escapeHtml(item.tableName) + '">' + escapeHtml(item.tableName) + '</td>' +
        '<td title="' + escapeHtml(item.alias) + '">' + escapeHtml(item.alias) + '</td>' +
        '<td class="td-desc" title="' + escapeHtml(item.comment) + '">' + escapeHtml(item.comment) + '</td>' +
        '<td>' + renderRate(item.metadataFill) + '</td>' +
        '<td>' + renderRate(item.standardMap) + '</td>' +
        '<td>' + renderRate(item.standardAudit) + '</td>' +
        '<td>' + renderRate(item.dataQuality) + '</td>' +
        '<td class="td-actions"><button class="ma-op-btn" type="button" data-gt-action="view" data-gt-table="' + escapeHtml(item.tableName) + '"><i class="bi bi-eye"></i><span>查看</span></button></td>' +
      '</tr>';
    }).join('');

    if (!body) {
      body = '<tr><td colspan="8" class="gt-empty-table">暂无符合条件的治理任务</td></tr>';
    }

    return '<table class="ds-table">' +
      '<thead><tr>' +
        '<th>表名</th><th>别名</th><th>注释</th><th>元数据填充</th><th>标准映射</th><th>标准稽查</th><th>数据质量</th><th>操作</th>' +
      '</tr></thead>' +
      '<tbody>' + body + '</tbody>' +
    '</table>';
  }

  function renderPagination() {
    var rows = getFilteredRows();
    var total = rows.length;
    var totalPages = Math.max(1, Math.ceil(total / pageSize));
    currentPage = Math.min(Math.max(1, currentPage), totalPages);
    var pages = [];
    var start = total ? (currentPage - 1) * pageSize + 1 : 0;
    var end = Math.min(currentPage * pageSize, total);

    for (var i = 1; i <= totalPages; i += 1) {
      pages.push('<a class="page-num' + (i === currentPage ? ' active' : '') + '" data-gt-page="' + i + '">' + i + '</a>');
    }

    return '<div class="page-info">第 ' + start + '-' + end + ' 条，共 ' + total + ' 条，每页 ' + pageSize + ' 条</div>' +
      '<div class="page-nav">' +
        '<a class="page-btn' + (currentPage === 1 ? ' disabled' : '') + '" data-gt-page="' + (currentPage - 1) + '">上一页</a>' +
        pages.join('') +
        '<a class="page-btn' + (currentPage === totalPages ? ' disabled' : '') + '" data-gt-page="' + (currentPage + 1) + '">下一页</a>' +
      '</div>';
  }

  function getLayer(tableName) {
    if (tableName.indexOf('ods_') === 0 || tableName.indexOf('order_') === 0) return 'ODS';
    if (tableName.indexOf('dwd_') === 0) return 'DWD';
    if (tableName.indexOf('dws_') === 0) return 'DWS';
    if (tableName.indexOf('ads_') === 0) return 'ADS';
    if (tableName.indexOf('dim_') === 0) return 'DIM';
    return 'ODS';
  }

  function getDataSource(tableName) {
    if (tableName.indexOf('order_') === 0) return 'prod_mysql_master';
    if (tableName.indexOf('ads_') === 0) return 'dw_hive_ads';
    if (tableName.indexOf('dws_') === 0) return 'dw_hive_dws';
    if (tableName.indexOf('dwd_') === 0) return 'dw_hive_dwd';
    if (tableName.indexOf('dim_') === 0) return 'dw_hive_dim';
    return 'prod_mysql_master';
  }

  function getRecordCount(tableName) {
    var counts = {
      order_main: '1,438,920',
      order_detail: '3,892,105',
      order_payment: '1,205,680',
      order_address: '528,630',
      ads_user_tag_profile: '862,400',
      ads_order_overview: '365'
    };
    return counts[tableName] || '128,640';
  }

  function renderDetailInfo(label, value) {
    return '<div class="ms-info-item"><span class="info-label">' + label + '</span><span class="info-value">' + escapeHtml(value) + '</span></div>';
  }

  function renderMetaRows(rows) {
    return rows.map(function (row) {
      if (row.group) return '<tr class="gt-meta-group"><td colspan="2">' + row.group + '</td></tr>';
      return '<tr><td class="gt-meta-name">' + row.name + '</td><td class="gt-meta-value">' + escapeHtml(row.value) + '</td></tr>';
    }).join('');
  }

  function renderTableMetaRows(groups) {
    return groups.map(function (group) {
      var rows = '<tr class="gt-meta-group"><td colspan="4">' + escapeHtml(group.title) + '</td></tr>';
      for (var i = 0; i < group.items.length; i += 2) {
        var first = group.items[i];
        var second = group.items[i + 1];
        rows += '<tr>' +
          '<td class="gt-meta-name">' + escapeHtml(first.name) + '</td>' +
          '<td class="gt-meta-value">' + escapeHtml(first.value) + '</td>' +
          (second
            ? '<td class="gt-meta-name">' + escapeHtml(second.name) + '</td><td class="gt-meta-value">' + escapeHtml(second.value) + '</td>'
            : '<td class="gt-meta-name"></td><td class="gt-meta-value"></td>') +
        '</tr>';
      }
      return rows;
    }).join('');
  }

  function getTableSize(tableName) {
    var sizes = {
      order_main: '2.8 GB',
      order_detail: '8.6 GB',
      order_payment: '1.9 GB',
      order_address: '760 MB',
      ads_user_tag_profile: '4.2 GB',
      ads_order_overview: '128 MB'
    };
    return sizes[tableName] || '680 MB';
  }

  function renderTableMetaPanels(item) {
    var layer = getLayer(item.tableName);
    var source = getDataSource(item.tableName);
    var isHive = source.indexOf('dw_hive') === 0;
    var refreshCycle = item.tableName.indexOf('_rt') >= 0 ? '实时写入' : 'T+1 日批';
    var groups = [
      {
        title: '业务分类',
        items: [
          { name: '华润中心', value: '华润置地' },
          { name: '业态', value: '商业地产' }
        ]
      },
      {
        title: '主题分类',
        items: [
          { name: '业务域', value: '客户域' },
          { name: '业务主题', value: '订单交易' },
          { name: '业务子主题', value: '订单基础信息' },
          { name: '业务细分类别', value: '客户订单资产' }
        ]
      },
      {
        title: '基础信息',
        items: [
          { name: '表名', value: item.tableName },
          { name: '表别名', value: item.alias },
          { name: '表类型', value: layer === 'ODS' ? '贴源明细表' : '数仓主题表' },
          { name: '数据源', value: source },
          { name: '数仓分层', value: layer },
          { name: '负责人', value: '张明' },
          { name: '表描述', value: item.comment }
        ]
      },
      {
        title: '技术信息',
        items: [
          { name: '存储引擎', value: isHive ? 'Hive ORC' : 'InnoDB' },
          { name: '字符集', value: isHive ? 'UTF-8' : 'utf8mb4' },
          { name: '主键字段', value: 'order_id' },
          { name: '分区字段', value: isHive ? 'ds' : '-' },
          { name: '字段数量', value: getStructureFields().length + ' 个' },
          { name: '记录数', value: getRecordCount(item.tableName) },
          { name: '数据量', value: getTableSize(item.tableName) },
          { name: '刷新周期', value: refreshCycle },
          { name: '生命周期', value: '36 个月' },
          { name: '存储位置', value: (isHive ? 'dw.customer.' : 'prod.order.') + item.tableName }
        ]
      },
      {
        title: '管控信息',
        items: [
          { name: '业务责任部门', value: '客户运营部' },
          { name: '参与编制部门', value: '数据治理部' },
          { name: '资产等级', value: '核心资产' },
          { name: '标准映射率', value: item.standardMap + '%' },
          { name: '标准稽查率', value: item.standardAudit + '%' },
          { name: '数据质量分', value: item.dataQuality + '%' },
          { name: '版本', value: 'V3.2' },
          { name: '修订人', value: '张伟' },
          { name: '修订时间', value: '2026-05-12 08:30:00' }
        ]
      },
      {
        title: '其它',
        items: [
          { name: '备注', value: '表级元数据已接入治理任务，需持续维护字段、标准和质量规则。' }
        ]
      }
    ];

    return '<section class="gt-meta-panel">' +
      '<div class="gt-meta-table-wrap"><table class="gt-meta-table gt-meta-pair-table">' +
        '<colgroup><col class="gt-meta-col-name"><col class="gt-meta-col-value"><col class="gt-meta-col-name"><col class="gt-meta-col-value"></colgroup>' +
        '<tbody>' + renderTableMetaRows(groups) + '</tbody>' +
      '</table></div>' +
    '</section>';
  }

  function getStructureFields() {
    return [
      { index: 1, name: 'order_id', alias: '订单编号', type: 'bigint', length: '20', nullable: '否', primary: true, desc: '订单唯一标识' },
      { index: 2, name: 'user_id', alias: '用户ID', type: 'bigint', length: '20', nullable: '否', primary: false, desc: '下单用户ID' },
      { index: 3, name: 'order_no', alias: '订单号', type: 'varchar', length: '64', nullable: '否', primary: false, desc: '业务订单号' },
      { index: 4, name: 'order_status', alias: '订单状态', type: 'tinyint', length: '4', nullable: '否', primary: false, desc: '0待付款 1已付款 2已发货 3已完成' },
      { index: 5, name: 'total_amount', alias: '订单总金额', type: 'decimal', length: '12,2', nullable: '否', primary: false, desc: '订单应付总额' },
      { index: 6, name: 'pay_amount', alias: '实付金额', type: 'decimal', length: '12,2', nullable: '是', primary: false, desc: '用户实际支付金额' },
      { index: 7, name: 'pay_time', alias: '支付时间', type: 'datetime', length: '-', nullable: '是', primary: false, desc: '支付完成时间' },
      { index: 8, name: 'create_time', alias: '创建时间', type: 'datetime', length: '-', nullable: '否', primary: false, desc: '订单创建时间' },
      { index: 9, name: 'update_time', alias: '更新时间', type: 'datetime', length: '-', nullable: '否', primary: false, desc: '最后更新时间' }
    ];
  }

  function findStructureField(fieldName) {
    return getStructureFields().find(function (field) {
      return field.name === fieldName;
    }) || getStructureFields()[0];
  }

  function renderStructureRows() {
    return getStructureFields().map(function (field) {
      return '<tr>' +
        '<td>' + field.index + '</td>' +
        '<td class="td-link">' + escapeHtml(field.name) + '</td>' +
        '<td>' + escapeHtml(field.alias) + '</td>' +
        '<td>' + escapeHtml(field.type) + '</td>' +
        '<td>' + escapeHtml(field.length) + '</td>' +
        '<td>' + escapeHtml(field.nullable) + '</td>' +
        '<td>' + (field.primary ? '<i class="bi bi-key-fill" style="color:#faad14"></i>' : '-') + '</td>' +
        '<td>' + escapeHtml(field.desc) + '</td>' +
        '<td class="td-actions"><button class="ma-op-btn" type="button" data-gt-field-detail="' + escapeHtml(field.name) + '"><i class="bi bi-eye"></i><span>查看详情</span></button></td>' +
      '</tr>';
    }).join('');
  }

  function renderFieldMetaRows(field) {
    var rows = [
      { group: '业务分类' },
      { name: '华润中心', value: '华润置地' },
      { name: '业态', value: '商业地产' },
      { group: '主题分类' },
      { name: '业务主题', value: '客户管理' },
      { name: '业务子主题', value: '客户信息' },
      { name: '业务细分类别', value: '客户基础信息' },
      { group: '基础信息' },
      { name: '标准项编码', value: 'MD20260511000' + field.index },
      { name: '中文名称', value: field.alias },
      { name: '英文名称', value: field.name },
      { name: '常用名称', value: field.alias },
      { name: '代码编号', value: field.name.toUpperCase() },
      { name: '代码名称', value: field.alias + '代码' },
      { group: '技术信息' },
      { name: '业务定义', value: field.desc },
      { name: '业务规则', value: field.nullable === '否' ? '该字段为必填项，入库前需完成非空校验。' : '该字段允许为空，展示和统计时需按业务口径处理。' },
      { name: '参考标准', value: '客户域数据标准 V1.1' },
      { name: '定义依据', value: '订单主题数据模型规范 V3.2' },
      { name: '数据类型', value: field.type },
      { name: '数据格式', value: field.type === 'datetime' ? 'yyyy-MM-dd HH:mm:ss' : field.type },
      { name: '数据长度', value: field.length },
      { group: '管控信息' },
      { name: '业务责任部门', value: '客户运营部' },
      { name: '参与编制部门', value: '数据治理部' },
      { name: '版本', value: 'V1.1' },
      { name: '修订人', value: '张伟' },
      { name: '修订时间', value: '2026-05-10 09:30:00' },
      { group: '其它' },
      { name: '备注', value: '字段详情与元数据属性表保持同一展示方式。' }
    ];

    return rows.map(function (row) {
      if (row.group) return '<tr class="gt-meta-group"><td colspan="2">' + row.group + '</td></tr>';
      return '<tr><td class="gt-meta-name">' + row.name + '</td><td class="gt-meta-value">' + escapeHtml(row.value) + '</td></tr>';
    }).join('');
  }

  function renderStructureDrawer() {
    return '<div class="gt-field-drawer-mask" data-gt-drawer-close></div>' +
      '<aside class="gt-field-drawer" id="gtFieldDrawer" aria-hidden="true">' +
        '<div class="gt-field-drawer-head">' +
          '<div><h3 data-gt-field-title>字段详情</h3><p data-gt-field-subtitle></p></div>' +
          '<button class="gt-field-drawer-close" type="button" data-gt-drawer-close aria-label="关闭"><i class="bi bi-x-lg"></i></button>' +
        '</div>' +
        '<div class="gt-field-drawer-body" data-gt-field-body></div>' +
      '</aside>';
  }

  function getQualityRules() {
    return [
      {
        name: '订单编号非空校验',
        type: '完整性',
        field: 'order_id',
        desc: '主键订单编号不能为空',
        rate: 100,
        summary: '检查订单主键字段，未发现订单编号为空的数据，规则执行结果稳定。',
        problems: []
      },
      {
        name: '用户ID非空校验',
        type: '完整性',
        field: 'user_id',
        desc: '下单用户ID不允许为空',
        rate: 97.8,
        summary: '发现少量订单缺少下单用户ID，影响客户归因、会员分析和后续画像关联。',
        problems: [
          { order_id: '100013', user_id: 'NULL', order_no: 'ORD20260212013', order_status: '1', total_amount: '328.00', pay_amount: '328.00', pay_time: '2026-02-12 11:12', create_time: '2026-02-12 11:08', update_time: '2026-02-12 11:13', issueField: 'user_id', issue: '用户ID为空，不符合非空规则' }
        ]
      },
      {
        name: '订单金额范围校验',
        type: '准确性',
        field: 'total_amount',
        desc: '订单总金额必须大于0',
        rate: 83.6,
        summary: '部分订单总金额为0或负数，可能来自退款冲正、异常测试单或上游同步错误。',
        problems: [
          { order_id: '100018', user_id: '72018', order_no: 'ORD20260212018', order_status: '1', total_amount: '0.00', pay_amount: '0.00', pay_time: '2026-02-12 11:25', create_time: '2026-02-12 11:22', update_time: '2026-02-12 11:26', issueField: 'total_amount', issue: '订单总金额等于0，不符合金额大于0规则' },
          { order_id: '100027', user_id: '61027', order_no: 'ORD20260212027', order_status: '3', total_amount: '-25.00', pay_amount: '-25.00', pay_time: '2026-02-12 12:10', create_time: '2026-02-12 12:08', update_time: '2026-02-12 12:30', issueField: 'total_amount', issue: '订单总金额为负数，需要核对冲正链路' }
        ]
      },
      {
        name: '订单状态枚举校验',
        type: '一致性',
        field: 'order_status',
        desc: '订单状态值必须在0-3范围内',
        rate: 76.5,
        summary: '订单状态存在超出标准枚举范围的取值，需要同步检查业务系统状态码映射。',
        problems: [
          { order_id: '100032', user_id: '80321', order_no: 'ORD20260212032', order_status: '5', total_amount: '168.00', pay_amount: '168.00', pay_time: '2026-02-12 12:42', create_time: '2026-02-12 12:39', update_time: '2026-02-12 12:45', issueField: 'order_status', issue: '状态值5不在0-3标准范围内' },
          { order_id: '100039', user_id: '39128', order_no: 'ORD20260212039', order_status: '-1', total_amount: '96.00', pay_amount: 'NULL', pay_time: 'NULL', create_time: '2026-02-12 13:05', update_time: '2026-02-12 13:06', issueField: 'order_status', issue: '状态值-1不在0-3标准范围内' }
        ]
      },
      {
        name: '订单号唯一性校验',
        type: '唯一性',
        field: 'order_no',
        desc: '业务订单号在表内必须唯一',
        rate: 58.2,
        summary: '订单号存在重复，属于高优先级质量问题，会影响订单去重、交易统计和对账结果。',
        problems: [
          { order_id: '100041', user_id: '50128', order_no: 'ORD20260212041', order_status: '3', total_amount: '236.00', pay_amount: '236.00', pay_time: '2026-02-12 13:18', create_time: '2026-02-12 13:15', update_time: '2026-02-12 13:40', issueField: 'order_no', issue: '订单号与记录100042重复' },
          { order_id: '100042', user_id: '50128', order_no: 'ORD20260212041', order_status: '3', total_amount: '236.00', pay_amount: '236.00', pay_time: '2026-02-12 13:19', create_time: '2026-02-12 13:16', update_time: '2026-02-12 13:41', issueField: 'order_no', issue: '订单号与记录100041重复' }
        ]
      }
    ];
  }

  function getQualityRateClass(rate) {
    if (rate < 60) return 'gt-quality-rate-low';
    if (rate < 80) return 'gt-quality-rate-mid';
    return 'gt-quality-rate-high';
  }

  function renderQualityRate(rate) {
    return '<span class="gt-quality-rate ' + getQualityRateClass(rate) + '">' +
      '<i style="width:' + Math.max(0, Math.min(100, rate)) + '%"></i>' +
      '<b>' + rate + '%</b>' +
    '</span>';
  }

  function renderQualityRuleRows() {
    return getQualityRules().map(function (rule) {
      return '<tr>' +
        '<td>' + escapeHtml(rule.name) + '</td>' +
        '<td>' + escapeHtml(rule.type) + '</td>' +
        '<td class="td-link">' + escapeHtml(rule.field) + '</td>' +
        '<td>' + escapeHtml(rule.desc) + '</td>' +
        '<td>' + renderQualityRate(rule.rate) + '</td>' +
      '</tr>';
    }).join('');
  }

  function renderQualityProblemRows(rule) {
    var fields = ['order_id', 'user_id', 'order_no', 'order_status', 'total_amount', 'pay_amount', 'pay_time', 'create_time', 'update_time'];
    if (!rule.problems.length) {
      return '<tr class="gt-quality-empty-row"><td colspan="10">未发现不符合规则的数据</td></tr>';
    }
    return rule.problems.map(function (item) {
      var cells = fields.map(function (field) {
        var cls = field === item.issueField ? ' class="gt-quality-error-cell"' : '';
        return '<td' + cls + '>' + escapeHtml(item[field]) + '</td>';
      }).join('');
      return '<tr>' + cells + '<td class="gt-quality-issue">' + escapeHtml(item.issue) + '</td></tr>';
    }).join('');
  }

  function renderQualityReport(item) {
    var rules = getQualityRules();
    var avgRate = Math.round(rules.reduce(function (sum, rule) { return sum + rule.rate; }, 0) / rules.length * 10) / 10;
    var problemCount = rules.reduce(function (sum, rule) { return sum + rule.problems.length; }, 0);
    var riskCount = rules.filter(function (rule) { return rule.rate < 80; }).length;
    var sections = rules.map(function (rule) {
      return '<section class="gt-quality-report-section">' +
        '<div class="gt-quality-section-head">' +
          '<div><h4>' + escapeHtml(rule.name) + '</h4><p>' + escapeHtml(rule.summary) + '</p></div>' +
          renderQualityRate(rule.rate) +
        '</div>' +
        '<table class="ds-table gt-quality-problem-table">' +
          '<thead><tr><th>order_id</th><th>user_id</th><th>order_no</th><th>order_status</th><th>total_amount</th><th>pay_amount</th><th>pay_time</th><th>create_time</th><th>update_time</th><th>质量问题说明</th></tr></thead>' +
          '<tbody>' + renderQualityProblemRows(rule) + '</tbody>' +
        '</table>' +
      '</section>';
    }).join('');

    return '<div class="gt-quality-report">' +
      '<section class="gt-quality-overview">' +
        '<div class="gt-quality-overview-text">' +
          '<h4>' + escapeHtml(item.alias) + '质量稽查概述</h4>' +
          '<p>本次基于 ' + rules.length + ' 条质量规则完成稽查，平均通过率 ' + avgRate + '%。当前主要问题集中在订单号唯一性、订单状态枚举和金额范围校验，建议优先核查上游订单生成、状态码映射和异常金额处理链路。</p>' +
        '</div>' +
        '<div class="gt-quality-stat"><span>规则数</span><b>' + rules.length + '</b></div>' +
        '<div class="gt-quality-stat"><span>平均通过率</span><b>' + avgRate + '%</b></div>' +
        '<div class="gt-quality-stat"><span>问题样例</span><b>' + problemCount + '</b></div>' +
        '<div class="gt-quality-stat"><span>风险规则</span><b>' + riskCount + '</b></div>' +
      '</section>' +
      sections +
    '</div>';
  }

  function renderQualityTab(item) {
    return '<div class="ms-tab-content" data-content="quality">' +
      '<div class="ms-quality-sub-tabs gt-quality-sub-tabs">' +
        '<a class="ms-qtab active" data-gt-quality-tab="rules">质量规则</a>' +
        '<a class="ms-qtab" data-gt-quality-tab="report">质量报告</a>' +
      '</div>' +
      '<div class="gt-quality-panel active" data-gt-quality-panel="rules">' +
        '<table class="ds-table gt-quality-rule-table">' +
          '<thead><tr><th>规则名称</th><th>规则类型</th><th>检测字段</th><th>规则描述</th><th>通过率</th></tr></thead>' +
          '<tbody>' + renderQualityRuleRows() + '</tbody>' +
        '</table>' +
      '</div>' +
      '<div class="gt-quality-panel" data-gt-quality-panel="report">' + renderQualityReport(item) + '</div>' +
    '</div>';
  }

  function renderLineageCanvas(item) {
    var currentName = escapeHtml(item.tableName);
    return '<div class="gt-lineage-shell">' +
      '<div class="gt-lineage-tip"><i class="bi bi-mouse"></i><span>按住 Ctrl + 滚轮缩放画板，拖动表节点调整位置</span></div>' +
      '<div class="gt-lineage-canvas" data-lineage-canvas>' +
        '<div class="gt-lineage-pan-surface" data-lineage-pan-surface></div>' +
        '<div class="gt-lineage-world" data-lineage-world>' +
          '<svg class="gt-lineage-svg" data-lineage-svg width="1180" height="430">' +
            '<defs><marker id="gtLineageArrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z"></path></marker></defs>' +
            '<g data-lineage-links>' +
              '<path data-from="n1" data-to="n4"></path><text data-label-for="n1-n4">订单采集</text>' +
              '<path data-from="n2" data-to="n5"></path><text data-label-for="n2-n5">支付采集</text>' +
              '<path data-from="n3" data-to="n6"></path><text data-label-for="n3-n6">会员采集</text>' +
              '<path data-from="n4" data-to="n7"></path><text data-label-for="n4-n7">清洗入明细</text>' +
              '<path data-from="n5" data-to="n7"></path><text data-label-for="n5-n7">支付关联</text>' +
              '<path data-from="n6" data-to="n7"></path><text data-label-for="n6-n7">会员补全</text>' +
              '<path data-from="n7" data-to="n8"></path><text data-label-for="n7-n8">汇总加工</text>' +
              '<path data-from="n7" data-to="n9"></path><text data-label-for="n7-n9">宽表输出</text>' +
              '<path data-from="n8" data-to="n10"></path><text data-label-for="n8-n10">指标发布</text>' +
              '<path data-from="n9" data-to="n10"></path><text data-label-for="n9-n10">分析服务</text>' +
              '<path data-from="n9" data-to="n11"></path><text data-label-for="n9-n11">接口消费</text>' +
            '</g>' +
          '</svg>' +
          '<div class="gt-lineage-node gt-node-source" data-node-id="n1" style="left:24px;top:30px;"><i class="bi bi-database"></i><strong>erp_order_raw</strong><span>业务库 / 订单原始表</span></div>' +
          '<div class="gt-lineage-node gt-node-source" data-node-id="n2" style="left:24px;top:180px;"><i class="bi bi-credit-card"></i><strong>pay_callback_log</strong><span>支付系统 / 回调日志</span></div>' +
          '<div class="gt-lineage-node gt-node-source" data-node-id="n3" style="left:24px;top:330px;"><i class="bi bi-person-badge"></i><strong>crm_member_base</strong><span>CRM / 会员基础表</span></div>' +
          '<div class="gt-lineage-node" data-node-id="n4" style="left:290px;top:30px;"><i class="bi bi-box-arrow-in-down"></i><strong>ods_order_main</strong><span>ODS贴源层 / 订单采集</span></div>' +
          '<div class="gt-lineage-node" data-node-id="n5" style="left:290px;top:180px;"><i class="bi bi-box-arrow-in-down"></i><strong>ods_payment_record</strong><span>ODS贴源层 / 支付采集</span></div>' +
          '<div class="gt-lineage-node" data-node-id="n6" style="left:290px;top:330px;"><i class="bi bi-box-arrow-in-down"></i><strong>ods_member_profile</strong><span>ODS贴源层 / 会员采集</span></div>' +
          '<div class="gt-lineage-node gt-node-current" data-node-id="n7" style="left:550px;top:180px;"><i class="bi bi-table"></i><strong>' + currentName + '</strong><span>当前表 / 治理对象</span></div>' +
          '<div class="gt-lineage-node" data-node-id="n8" style="left:790px;top:90px;"><i class="bi bi-bar-chart"></i><strong>dws_order_daily</strong><span>DWS汇总层 / 日汇总</span></div>' +
          '<div class="gt-lineage-node" data-node-id="n9" style="left:790px;top:270px;"><i class="bi bi-intersect"></i><strong>dwd_order_user_wide</strong><span>DWD宽表 / 用户订单宽表</span></div>' +
          '<div class="gt-lineage-node gt-node-output" data-node-id="n10" style="left:1010px;top:90px;"><i class="bi bi-window-sidebar"></i><strong>ads_order_overview</strong><span>ADS应用层 / 经营看板</span></div>' +
          '<div class="gt-lineage-node gt-node-output" data-node-id="n11" style="left:1010px;top:270px;"><i class="bi bi-link-45deg"></i><strong>api_order_profile</strong><span>服务层 / 订单画像接口</span></div>' +
        '</div>' +
        '<div class="gt-lineage-minimap" data-lineage-minimap><div class="gt-mini-node" style="left:6px;top:8px;"></div><div class="gt-mini-node" style="left:6px;top:27px;"></div><div class="gt-mini-node" style="left:6px;top:46px;"></div><div class="gt-mini-node" style="left:33px;top:8px;"></div><div class="gt-mini-node" style="left:33px;top:27px;"></div><div class="gt-mini-node" style="left:33px;top:46px;"></div><div class="gt-mini-node current" style="left:65px;top:27px;"></div><div class="gt-mini-node" style="left:95px;top:17px;"></div><div class="gt-mini-node" style="left:95px;top:40px;"></div><div class="gt-mini-node output" style="left:125px;top:17px;"></div><div class="gt-mini-node output" style="left:125px;top:40px;"></div><div class="gt-mini-viewport" data-mini-viewport></div></div>' +
      '</div>' +
    '</div>';
  }

  function renderDetail(tableName) {
    var item = findTable(tableName);
    if (!item) return '';
    var layer = getLayer(item.tableName);
    var source = getDataSource(item.tableName);

    return '<div class="gt-detail-view ms-detail-panel">' +
      '<div class="ms-detail-header">' +
        '<button class="btn btn-outline btn-sm" type="button" data-gt-action="back-list"><i class="bi bi-arrow-left"></i> 返回列表</button>' +
        '<span class="ms-detail-title">' + escapeHtml(item.tableName) + ' — ' + escapeHtml(item.alias) + '</span>' +
      '</div>' +
      '<div class="ms-detail-tabs">' +
        '<a class="ms-dtab active" data-tab="meta-info">元数据</a>' +
        '<a class="ms-dtab" data-tab="structure">表结构</a>' +
        '<a class="ms-dtab" data-tab="preview">数据预览</a>' +
        '<a class="ms-dtab" data-tab="standard">标准稽查</a>' +
        '<a class="ms-dtab" data-tab="lineage">血缘关系</a>' +
        '<a class="ms-dtab" data-tab="quality">数据质量</a>' +
        '<a class="ms-dtab" data-tab="security">数据安全</a>' +
        '<a class="ms-dtab" data-tab="history">历史版本</a>' +
      '</div>' +
      '<div class="ms-detail-body">' +
        '<div class="ms-tab-content active" data-content="meta-info">' +
          renderTableMetaPanels(item) +
        '</div>' +
        '<div class="ms-tab-content" data-content="structure">' +
          '<table class="ds-table">' +
            '<thead><tr><th>序号</th><th>字段名</th><th>别名</th><th>类型</th><th>长度</th><th>允许空</th><th>主键</th><th>描述</th><th>操作</th></tr></thead>' +
            '<tbody>' + renderStructureRows() + '</tbody>' +
          '</table>' +
        '</div>' +
        '<div class="ms-tab-content" data-content="standard">' +
          '<div class="ms-empty-hint"><p>标准映射关系与稽查结果</p>' +
            '<table class="ds-table" style="margin-top:12px;">' +
              '<thead><tr><th>字段名</th><th>字段别名</th><th>标准编码</th><th>标准名称</th><th>映射状态</th><th>稽查结果（标准一致性）</th></tr></thead>' +
              '<tbody>' +
                '<tr><td>order_id</td><td>订单编号</td><td>STD_ORDER_001</td><td>订单唯一标识</td><td><span class="tag tag-green">已映射</span></td><td>' + renderQualityRate(100) + '</td></tr>' +
                '<tr><td>user_id</td><td>用户ID</td><td>STD_USER_001</td><td>用户标识</td><td><span class="tag tag-green">已映射</span></td><td>' + renderQualityRate(96.8) + '</td></tr>' +
                '<tr><td>order_no</td><td>订单号</td><td>STD_ORDER_002</td><td>业务订单号</td><td><span class="tag tag-green">已映射</span></td><td>' + renderQualityRate(88.5) + '</td></tr>' +
                '<tr><td>order_status</td><td>订单状态</td><td>STD_STATUS_002</td><td>订单状态码</td><td><span class="tag tag-green">已映射</span></td><td>' + renderQualityRate(74.2) + '</td></tr>' +
                '<tr><td>total_amount</td><td>订单总金额</td><td>STD_AMOUNT_001</td><td>订单应付金额</td><td><span class="tag tag-green">已映射</span></td><td>' + renderQualityRate(82.4) + '</td></tr>' +
                '<tr><td>pay_amount</td><td>实付金额</td><td>STD_AMOUNT_002</td><td>订单实付金额</td><td><span class="tag tag-green">已映射</span></td><td>' + renderQualityRate(90.6) + '</td></tr>' +
                '<tr><td>pay_time</td><td>支付时间</td><td>STD_TIME_001</td><td>支付完成时间</td><td><span class="tag tag-green">已映射</span></td><td>' + renderQualityRate(79.5) + '</td></tr>' +
                '<tr><td>create_time</td><td>创建时间</td><td>STD_TIME_002</td><td>数据创建时间</td><td><span class="tag tag-green">已映射</span></td><td>' + renderQualityRate(100) + '</td></tr>' +
                '<tr><td>update_time</td><td>更新时间</td><td>STD_TIME_003</td><td>数据更新时间</td><td><span class="tag tag-green">已映射</span></td><td>' + renderQualityRate(57.8) + '</td></tr>' +
              '</tbody>' +
            '</table>' +
          '</div>' +
        '</div>' +
        '<div class="ms-tab-content" data-content="preview">' +
          '<div class="ms-preview-toolbar"><span class="ms-preview-info">前 10 条记录预览</span></div>' +
          '<table class="ds-table">' +
            '<thead><tr><th>order_id</th><th>user_id</th><th>order_no</th><th>order_status</th><th>total_amount</th><th>pay_amount</th><th>pay_time</th><th>create_time</th><th>update_time</th></tr></thead>' +
            '<tbody>' +
              '<tr><td>100001</td><td>50821</td><td>ORD20260212001</td><td>3</td><td>299.00</td><td>279.00</td><td>2026-02-12 09:15</td><td>2026-02-12 09:10</td><td>2026-02-12 09:42</td></tr>' +
              '<tr><td>100002</td><td>32156</td><td>ORD20260212002</td><td>1</td><td>1580.00</td><td>1580.00</td><td>2026-02-12 09:22</td><td>2026-02-12 09:20</td><td>2026-02-12 09:23</td></tr>' +
              '<tr><td>100003</td><td>78432</td><td>ORD20260212003</td><td>0</td><td>68.50</td><td>NULL</td><td>NULL</td><td>2026-02-12 09:35</td><td>2026-02-12 09:35</td></tr>' +
              '<tr><td>100004</td><td>12890</td><td>ORD20260212004</td><td>2</td><td>4350.00</td><td>4200.00</td><td>2026-02-12 08:50</td><td>2026-02-12 08:45</td><td>2026-02-12 10:18</td></tr>' +
              '<tr><td>100005</td><td>65213</td><td>ORD20260212005</td><td>3</td><td>128.00</td><td>118.00</td><td>2026-02-11 22:30</td><td>2026-02-11 22:25</td><td>2026-02-11 22:58</td></tr>' +
              '<tr><td>100006</td><td>43891</td><td>ORD20260212006</td><td>1</td><td>899.00</td><td>899.00</td><td>2026-02-12 10:05</td><td>2026-02-12 10:01</td><td>2026-02-12 10:06</td></tr>' +
              '<tr><td>100007</td><td>90217</td><td>ORD20260212007</td><td>0</td><td>49.90</td><td>NULL</td><td>NULL</td><td>2026-02-12 10:16</td><td>2026-02-12 10:16</td></tr>' +
              '<tr><td>100008</td><td>21784</td><td>ORD20260212008</td><td>3</td><td>236.00</td><td>236.00</td><td>2026-02-12 10:21</td><td>2026-02-12 10:19</td><td>2026-02-12 11:02</td></tr>' +
              '<tr><td>100009</td><td>67502</td><td>ORD20260212009</td><td>2</td><td>1288.00</td><td>1268.00</td><td>2026-02-12 10:30</td><td>2026-02-12 10:27</td><td>2026-02-12 11:35</td></tr>' +
              '<tr><td>100010</td><td>39016</td><td>ORD20260212010</td><td>1</td><td>76.80</td><td>76.80</td><td>2026-02-12 10:45</td><td>2026-02-12 10:43</td><td>2026-02-12 10:46</td></tr>' +
            '</tbody>' +
          '</table>' +
        '</div>' +
        '<div class="ms-tab-content" data-content="lineage">' +
          renderLineageCanvas(item) +
        '</div>' +
        renderQualityTab(item) +
        '<div class="ms-tab-content" data-content="security">' +
          '<table class="ds-table">' +
            '<thead><tr><th>字段名</th><th>安全等级</th><th>规则类型</th><th>规则名称</th><th>规则描述</th></tr></thead>' +
            '<tbody>' +
              '<tr><td>user_id</td><td><span class="tag tag-yellow">L2-敏感</span></td><td>脱敏</td><td>用户ID展示脱敏</td><td>用户ID部分遮蔽显示</td></tr>' +
              '<tr><td>pay_amount</td><td><span class="tag tag-red">L3-机密</span></td><td>加密</td><td>支付金额加密存储</td><td>AES-256 加密存储</td></tr>' +
            '</tbody>' +
          '</table>' +
        '</div>' +
        '<div class="ms-tab-content" data-content="history">' +
          '<table class="ds-table">' +
            '<thead><tr><th>版本号</th><th>变更类型</th><th>变更内容</th><th>操作人</th><th>变更时间</th></tr></thead>' +
            '<tbody>' +
              '<tr><td>v3.2</td><td><span class="tag tag-green">新增</span></td><td>新增字段 coupon_id</td><td>张明</td><td>2026-02-10 14:20</td></tr>' +
              '<tr><td>v3.1</td><td><span class="tag tag-yellow">修改</span></td><td>修改 total_amount 精度为 12,2</td><td>王强</td><td>2026-01-28 09:15</td></tr>' +
              '<tr><td>v3.0</td><td><span class="tag tag-green">新增</span></td><td>新增字段 pay_channel</td><td>张明</td><td>2026-01-15 16:40</td></tr>' +
              '<tr><td>v2.0</td><td><span class="tag tag-red">删除</span></td><td>删除冗余字段 temp_order_flag</td><td>李婷</td><td>2025-11-20 10:00</td></tr>' +
              '<tr><td>v1.0</td><td><span class="tag tag-green">新增</span></td><td>新增订单主表</td><td>张明</td><td>2024-06-15 10:30</td></tr>' +
            '</tbody>' +
          '</table>' +
        '</div>' +
      '</div>' +
      renderStructureDrawer() +
    '</div>';
  }

  function updateLineageLinks(canvas) {
    var svg = canvas.querySelector('[data-lineage-svg]');
    if (!svg) return;
    svg.querySelectorAll('path[data-from][data-to]').forEach(function (path) {
      var from = canvas.querySelector('[data-node-id="' + path.dataset.from + '"]');
      var to = canvas.querySelector('[data-node-id="' + path.dataset.to + '"]');
      if (!from || !to) return;
      var x1 = parseFloat(from.style.left || 0) + from.offsetWidth;
      var y1 = parseFloat(from.style.top || 0) + from.offsetHeight / 2;
      var x2 = parseFloat(to.style.left || 0);
      var y2 = parseFloat(to.style.top || 0) + to.offsetHeight / 2;
      var bend = Math.max(70, (x2 - x1) / 2);
      path.setAttribute('d', 'M ' + x1 + ' ' + y1 + ' C ' + (x1 + bend) + ' ' + y1 + ', ' + (x2 - bend) + ' ' + y2 + ', ' + x2 + ' ' + y2);
      var label = svg.querySelector('[data-label-for="' + path.dataset.from + '-' + path.dataset.to + '"]');
      if (label) {
        label.setAttribute('x', (x1 + x2) / 2 - 30);
        label.setAttribute('y', (y1 + y2) / 2 - 14);
      }
    });
  }

  function getLineagePanState(canvas) {
    var scale = Number(canvas.dataset.scale || 1);
    var visualW = 1180 * scale;
    var visualH = 430 * scale;
    var marginLeft = Math.max(0, (canvas.clientWidth - visualW) / 2);
    var marginTop = Math.max(0, (canvas.clientHeight - visualH) / 2);
    var keepX = Math.min(120, canvas.clientWidth * 0.25, visualW * 0.25);
    var keepY = Math.min(90, canvas.clientHeight * 0.25, visualH * 0.25);

    return {
      scale: scale,
      visualW: visualW,
      visualH: visualH,
      marginLeft: marginLeft,
      marginTop: marginTop,
      minPanX: keepX - visualW - marginLeft,
      maxPanX: canvas.clientWidth - keepX - marginLeft,
      minPanY: keepY - visualH - marginTop,
      maxPanY: canvas.clientHeight - keepY - marginTop
    };
  }

  function updateLineageTransform(canvas) {
    var world = canvas.querySelector('[data-lineage-world]');
    if (!world) return;
    var state = getLineagePanState(canvas);
    var scale = state.scale;
    var panX = Number(canvas.dataset.panX || 0);
    var panY = Number(canvas.dataset.panY || 0);

    panX = Math.max(state.minPanX, Math.min(state.maxPanX, panX));
    panY = Math.max(state.minPanY, Math.min(state.maxPanY, panY));
    canvas.dataset.panX = String(panX);
    canvas.dataset.panY = String(panY);

    world.style.width = '1180px';
    world.style.height = '430px';
    world.style.marginLeft = state.marginLeft + 'px';
    world.style.marginTop = state.marginTop + 'px';
    world.style.left = panX + 'px';
    world.style.top = panY + 'px';
    world.style.transform = 'scale(' + scale + ')';
    updateLineageMinimap(canvas);
  }

  function updateLineageMinimap(canvas) {
    var viewport = canvas.querySelector('[data-mini-viewport]');
    if (!viewport) return;
    var state = getLineagePanState(canvas);
    var scale = state.scale;
    var panX = Number(canvas.dataset.panX || 0);
    var panY = Number(canvas.dataset.panY || 0);
    var miniW = 150;
    var miniH = 60;
    var width = Math.max(20, Math.min(miniW, canvas.clientWidth / state.visualW * miniW));
    var height = Math.max(14, Math.min(miniH, canvas.clientHeight / state.visualH * miniH));
    var left = Math.min(miniW - width, Math.max(0, -(state.marginLeft + panX) / state.visualW * miniW));
    var top = Math.min(miniH - height, Math.max(0, -(state.marginTop + panY) / state.visualH * miniH));
    viewport.style.width = width + 'px';
    viewport.style.height = height + 'px';
    viewport.style.left = left + 'px';
    viewport.style.top = top + 'px';
  }

  function getLineageNodeBounds(canvas, node) {
    var state = getLineagePanState(canvas);
    var panX = Number(canvas.dataset.panX || 0);
    var panY = Number(canvas.dataset.panY || 0);
    var originX = state.marginLeft + panX;
    var originY = state.marginTop + panY;
    var padding = 16;
    var minLeft = (padding - originX) / state.scale;
    var minTop = (padding - originY) / state.scale;
    var maxLeft = (canvas.clientWidth - padding - originX) / state.scale - node.offsetWidth;
    var maxTop = (canvas.clientHeight - padding - originY) / state.scale - node.offsetHeight;

    return {
      minLeft: Math.min(minLeft, maxLeft),
      maxLeft: Math.max(minLeft, maxLeft),
      minTop: Math.min(minTop, maxTop),
      maxTop: Math.max(minTop, maxTop)
    };
  }

  function initLineageCanvas(page) {
    var canvas = page.querySelector('.gt-lineage-canvas');
    if (!canvas || canvas.dataset.ready === 'true') return;
    if (!canvas.clientWidth || !canvas.clientHeight) return;
    var dragSurface = canvas.querySelector('[data-lineage-pan-surface]') || canvas;
    canvas.dataset.ready = 'true';
    var fitScale = Math.min(1, (canvas.clientWidth - 48) / 1180, (canvas.clientHeight - 48) / 430);
    canvas.dataset.scale = String(Math.max(0.62, Math.floor(fitScale * 100) / 100));
    canvas.dataset.panX = '0';
    canvas.dataset.panY = '0';
    updateLineageLinks(canvas);
    updateLineageTransform(canvas);
    updateLineageMinimap(canvas);

    canvas.addEventListener('wheel', function (e) {
      if (!e.ctrlKey) return;
      e.preventDefault();
      var current = Number(canvas.dataset.scale || 1);
      var next = Math.min(1.8, Math.max(0.55, current + (e.deltaY < 0 ? 0.08 : -0.08)));
      canvas.dataset.scale = String(Math.round(next * 100) / 100);
      updateLineageTransform(canvas);
      updateLineageLinks(canvas);
      updateLineageMinimap(canvas);
    }, { passive: false });

    canvas.addEventListener('scroll', function () {
      updateLineageMinimap(canvas);
    });

    dragSurface.addEventListener('pointerdown', function (e) {
      if (e.button !== 0) return;
      if (e.target.closest('.gt-lineage-node') || e.target.closest('.gt-lineage-minimap')) return;
      e.preventDefault();
      dragSurface.setPointerCapture(e.pointerId);
      canvas.classList.add('is-panning');
      dragSurface.classList.add('is-panning');

      var startX = e.clientX;
      var startY = e.clientY;
      var startPanX = Number(canvas.dataset.panX || 0);
      var startPanY = Number(canvas.dataset.panY || 0);

      function move(ev) {
        var dx = ev.clientX - startX;
        var dy = ev.clientY - startY;
        canvas.dataset.panX = String(startPanX + dx);
        canvas.dataset.panY = String(startPanY + dy);
        updateLineageTransform(canvas);
        updateLineageMinimap(canvas);
      }

      function up(ev) {
        canvas.classList.remove('is-panning');
        dragSurface.classList.remove('is-panning');
        dragSurface.releasePointerCapture(ev.pointerId);
        dragSurface.removeEventListener('pointermove', move);
        dragSurface.removeEventListener('pointerup', up);
        dragSurface.removeEventListener('pointercancel', up);
      }

      dragSurface.addEventListener('pointermove', move);
      dragSurface.addEventListener('pointerup', up);
      dragSurface.addEventListener('pointercancel', up);
    });

    canvas.querySelectorAll('.gt-lineage-node').forEach(function (node) {
      node.addEventListener('pointerdown', function (e) {
        e.preventDefault();
        node.setPointerCapture(e.pointerId);
        var scale = Number(canvas.dataset.scale || 1);
        var startX = e.clientX;
        var startY = e.clientY;
        var startLeft = parseFloat(node.style.left || 0);
        var startTop = parseFloat(node.style.top || 0);
        node.classList.add('dragging');

        function move(ev) {
          var nextLeft = startLeft + (ev.clientX - startX) / scale;
          var nextTop = startTop + (ev.clientY - startY) / scale;
          var bounds = getLineageNodeBounds(canvas, node);
          node.style.left = Math.max(bounds.minLeft, Math.min(bounds.maxLeft, nextLeft)) + 'px';
          node.style.top = Math.max(bounds.minTop, Math.min(bounds.maxTop, nextTop)) + 'px';
          updateLineageLinks(canvas);
        }

        function up(ev) {
          node.classList.remove('dragging');
          node.releasePointerCapture(ev.pointerId);
          node.removeEventListener('pointermove', move);
          node.removeEventListener('pointerup', up);
          node.removeEventListener('pointercancel', up);
        }

        node.addEventListener('pointermove', move);
        node.addEventListener('pointerup', up);
        node.addEventListener('pointercancel', up);
      });
    });
  }

  function syncFiltersFromDom() {
    Object.keys(filters).forEach(function (key) {
      var el = document.querySelector('[data-gt-filter="' + key + '"]');
      if (el) filters[key] = el.value;
    });
  }

  function renderMain() {
    var rows = getActiveRows();
    var plan = getActivePlan();
    var tableWrap = document.getElementById('gtTableWrap');
    var pagination = document.getElementById('gtPagination');
    var summary = document.getElementById('gtSummary');
    var taskPanel = document.querySelector('.gt-task-panel');

    if (taskPanel) taskPanel.classList.remove('gt-task-detail');
    if (tableWrap) tableWrap.classList.remove('gt-table-detail');
    if (summary) {
      summary.innerHTML = '<span><i class="bi bi-kanban"></i> ' + escapeHtml(plan.name) + '</span>' +
        '<span>治理表 ' + (plan.counts ? plan.counts.table : rows.length) + ' 张</span>' +
        '<span>字段 ' + (plan.counts ? plan.counts.field : rows.length * 40) + ' 个</span>' +
        '<span>' + getStatusLabel(plan.status) + '</span>' +
        '<span>责任人 ' + escapeHtml(plan.owner) + '</span>' +
        '<span>创建时间 ' + escapeHtml(plan.createdAt) + '</span>' +
        '<span>规划进度 ' + plan.rate + '%</span>';
    }
    if (tableWrap) tableWrap.innerHTML = renderTable();
    if (pagination) {
      pagination.innerHTML = renderPagination();
      pagination.style.display = 'flex';
    }
  }

  function renderListShell(page) {
    page.classList.remove('gt-detail-mode');
    page.innerHTML =
      '<aside class="gt-plan-panel">' +
        '<div class="gt-panel-title"><i class="bi bi-diagram-3"></i><span>治理规划任务</span></div>' +
        renderPlanStatusTabs() +
        '<div class="gt-plan-search"><i class="bi bi-search"></i><input id="gtPlanSearch" type="text" placeholder="搜索治理规划"></div>' +
        '<div class="gt-plan-list">' + renderPlans() + '</div>' +
      '</aside>' +
      '<section class="gt-task-panel">' +
        '<div class="gt-filter-panel">' + renderFilters() + '</div>' +
        '<div class="gt-task-head">' +
          '<div class="gt-summary" id="gtSummary"></div>' +
        '</div>' +
        '<div class="gt-table-wrap" id="gtTableWrap"></div>' +
        '<div class="ds-pagination gt-pagination" id="gtPagination"></div>' +
      '</section>';
    renderMain();
  }

  function showDetail(page, tableName) {
    var tableWrap = document.getElementById('gtTableWrap');
    var pagination = document.getElementById('gtPagination');
    var taskPanel = page.querySelector('.gt-task-panel');
    var item = findTable(tableName);
    if (taskPanel) taskPanel.classList.add('gt-task-detail');
    if (tableWrap) {
      tableWrap.classList.add('gt-table-detail');
      tableWrap.innerHTML = DP.components.tableDetailView.render(item, {
        backAttrs: 'data-gt-action="back-list"'
      });
      DP.components.tableDetailView.bind(tableWrap);
    }
    if (pagination) pagination.style.display = 'none';
  }

  function openStructureDrawer(page, fieldName) {
    var field = findStructureField(fieldName);
    var detailView = page.querySelector('.gt-detail-view');
    var drawer = page.querySelector('#gtFieldDrawer');
    if (!detailView || !drawer) return;

    var title = drawer.querySelector('[data-gt-field-title]');
    var subtitle = drawer.querySelector('[data-gt-field-subtitle]');
    var body = drawer.querySelector('[data-gt-field-body]');

    if (title) title.textContent = field.name + ' — ' + field.alias;
    if (subtitle) subtitle.textContent = field.type + ' / 长度 ' + field.length + ' / 允许空：' + field.nullable;
    if (body) {
      body.innerHTML = '<section class="gt-meta-panel gt-drawer-meta"><div class="gt-meta-table-wrap"><table class="gt-meta-table"><tbody>' + renderFieldMetaRows(field) + '</tbody></table></div></section>';
    }
    drawer.setAttribute('aria-hidden', 'false');
    detailView.classList.add('gt-drawer-open');
  }

  function closeStructureDrawer(page) {
    var detailView = page.querySelector('.gt-detail-view');
    var drawer = page.querySelector('#gtFieldDrawer');
    if (drawer) drawer.setAttribute('aria-hidden', 'true');
    if (detailView) detailView.classList.remove('gt-drawer-open');
  }

  function resetFilters() {
    filters = {
      keyword: '',
      metadataFill: 'all',
      standardMap: 'all',
      standardAudit: 'all',
      dataQuality: 'all'
    };
  }

  function bindEvents(page) {
    page.addEventListener('click', function (e) {
      var statusBtn = e.target.closest('[data-gt-status]');
      if (statusBtn) {
        activeStatus = statusBtn.dataset.gtStatus || 'ongoing';
        var first = getPlansByStatus(activeStatus)[0];
        activePlanId = first ? first.id : activePlanId;
        currentPage = 1;
        resetFilters();
        var searchInput = page.querySelector('#gtPlanSearch');
        if (searchInput) searchInput.value = '';
        page.querySelector('.gt-filter-panel').innerHTML = renderFilters();
        page.querySelector('.gt-plan-status-tabs').innerHTML = statusTabs.map(function (tab) {
          return '<button class="gt-plan-status-tab' + (tab.key === activeStatus ? ' active' : '') + '" type="button" data-gt-status="' + tab.key + '">' +
            '<span>' + tab.label + '</span><b>' + getPlanCount(tab.key) + '</b>' +
          '</button>';
        }).join('');
        page.querySelector('.gt-plan-list').innerHTML = renderPlans();
        renderMain();
        return;
      }

      var planBtn = e.target.closest('[data-gt-plan]');
      if (planBtn) {
        activePlanId = planBtn.dataset.gtPlan;
        currentPage = 1;
        resetFilters();
        page.querySelector('.gt-filter-panel').innerHTML = renderFilters();
        page.querySelector('.gt-plan-list').innerHTML = renderPlans();
        renderMain();
        return;
      }

      var detailTab = e.target.closest('.gt-detail-view .ms-dtab');
      if (detailTab) {
        closeStructureDrawer(page);
        page.querySelectorAll('.gt-detail-view .ms-dtab').forEach(function (tab) {
          tab.classList.remove('active');
        });
        detailTab.classList.add('active');
        page.querySelectorAll('.gt-detail-view .ms-tab-content').forEach(function (content) {
          content.classList.remove('active');
        });
        var target = detailTab.dataset.tab;
        var targetContent = page.querySelector('.gt-detail-view .ms-tab-content[data-content="' + target + '"]');
        if (targetContent) targetContent.classList.add('active');
        if (target === 'lineage') {
          initLineageCanvas(page);
        }
        return;
      }

      var fieldDetailBtn = e.target.closest('[data-gt-field-detail]');
      if (fieldDetailBtn) {
        openStructureDrawer(page, fieldDetailBtn.dataset.gtFieldDetail || '');
        return;
      }

      var drawerClose = e.target.closest('[data-gt-drawer-close]');
      if (drawerClose) {
        closeStructureDrawer(page);
        return;
      }

      var qualityTab = e.target.closest('.gt-detail-view .ms-qtab');
      if (qualityTab) {
        var parent = qualityTab.closest('.ms-quality-sub-tabs');
        if (parent) {
          parent.querySelectorAll('.ms-qtab').forEach(function (tab) {
            tab.classList.remove('active');
          });
        }
        qualityTab.classList.add('active');
        if (qualityTab.dataset.gtQualityTab) {
          var qualityContent = qualityTab.closest('.ms-tab-content[data-content="quality"]');
          if (qualityContent) {
            qualityContent.querySelectorAll('[data-gt-quality-panel]').forEach(function (panel) {
              panel.classList.remove('active');
            });
            var qualityPanel = qualityContent.querySelector('[data-gt-quality-panel="' + qualityTab.dataset.gtQualityTab + '"]');
            if (qualityPanel) qualityPanel.classList.add('active');
          }
        }
        return;
      }

      var actionBtn = e.target.closest('[data-gt-action]');
      if (actionBtn) {
        var action = actionBtn.dataset.gtAction;
        if (action === 'search') {
          syncFiltersFromDom();
          currentPage = 1;
          renderMain();
        } else if (action === 'reset') {
          resetFilters();
          currentPage = 1;
          page.querySelector('.gt-filter-panel').innerHTML = renderFilters();
          renderMain();
        } else if (action === 'view') {
          showDetail(page, actionBtn.dataset.gtTable || '');
        } else if (action === 'back-list') {
          renderMain();
        }
        return;
      }

      var pageBtn = e.target.closest('[data-gt-page]');
      if (pageBtn && !pageBtn.classList.contains('disabled')) {
        currentPage = Number(pageBtn.dataset.gtPage) || 1;
        renderMain();
      }
    });

    page.addEventListener('input', function (e) {
      if (e.target && e.target.id === 'gtPlanSearch') {
        page.querySelector('.gt-plan-list').innerHTML = renderPlans();
      }
    });

    page.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && e.target && e.target.matches('[data-gt-filter]')) {
        syncFiltersFromDom();
        currentPage = 1;
        renderMain();
      }
    });
  }

  return {
    html: '<div class="page-governance-task"></div>',
    init: function (opts) {
      opts = opts || {};
      currentPage = 1;
      var targetPlan = opts.planId ? plans.find(function (plan) { return plan.id === opts.planId; }) : null;
      activeStatus = targetPlan ? targetPlan.status : (opts.status || 'ongoing');
      activePlanId = targetPlan
        ? targetPlan.id
        : (getPlansByStatus(activeStatus)[0] || plans[0]).id;
      resetFilters();
      var page = document.querySelector('.page-governance-task');
      if (!page) return;
      bindEvents(page);
      renderListShell(page);
    }
  };
})();
