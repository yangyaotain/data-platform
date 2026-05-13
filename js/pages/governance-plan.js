/**
 * 数据中台 V4.0 - 数据治理 / 治理规划
 */
window.DP = window.DP || {};
DP.pages = DP.pages || {};

DP.pages.governancePlan = (function () {
  var pageSize = 6;
  var scopePageSize = 10;
  var currentPage = 1;
  var activeTab = 'ongoing';
  var confirmState = null;
  var viewMode = 'list';
  var formMode = 'create';
  var editingPlanId = '';
  var formDraftState = null;
  var formUiState = {
    pendingKeyword: '',
    pendingPage: 1,
    selectedKeyword: '',
    selectedPage: 1
  };

  var tabs = [
    { key: 'ongoing', label: '进行中' },
    { key: 'completed', label: '已完成' },
    { key: 'archived', label: '归档' },
    { key: 'all', label: '全部' }
  ];

  var statusOptions = [
    { key: 'ongoing', label: '进行中' },
    { key: 'completed', label: '已完成' },
    { key: 'archived', label: '归档' }
  ];

  var dataSources = [
    {
      id: 'ds-trade',
      category: '核心数仓',
      instance: '交易主题实例',
      name: 'dw_trade',
      displayName: '交易数仓',
      tables: [
        { id: 'ods_order_main', name: 'ods_order_main', desc: '订单主表', fields: 82 },
        { id: 'dwd_trade_order_detail_di', name: 'dwd_trade_order_detail_di', desc: '交易订单明细表', fields: 126 },
        { id: 'dws_trade_summary_1d', name: 'dws_trade_summary_1d', desc: '交易汇总表', fields: 74 },
        { id: 'ads_sales_daily_report', name: 'ads_sales_daily_report', desc: '销售日分析报表', fields: 58 },
        { id: 'ods_payment_record', name: 'ods_payment_record', desc: '支付流水表', fields: 64 },
        { id: 'ods_refund_apply', name: 'ods_refund_apply', desc: '退款申请表', fields: 48 },
        { id: 'dwd_trade_pay_detail_di', name: 'dwd_trade_pay_detail_di', desc: '交易支付明细表', fields: 92 },
        { id: 'dwd_trade_refund_detail_di', name: 'dwd_trade_refund_detail_di', desc: '交易退款明细表', fields: 88 },
        { id: 'dws_trade_user_summary_1d', name: 'dws_trade_user_summary_1d', desc: '用户交易汇总表', fields: 66 },
        { id: 'dws_trade_shop_summary_1d', name: 'dws_trade_shop_summary_1d', desc: '店铺交易汇总表', fields: 70 },
        { id: 'ads_order_conversion_report', name: 'ads_order_conversion_report', desc: '订单转化分析报表', fields: 52 },
        { id: 'ads_refund_risk_report', name: 'ads_refund_risk_report', desc: '退款风险分析报表', fields: 46 }
      ]
    },
    {
      id: 'ds-customer',
      category: '核心数仓',
      instance: '客户主题实例',
      name: 'dw_customer',
      displayName: '客户数据源',
      tables: [
        { id: 'dwd_customer_base', name: 'dwd_customer_base', desc: '客户基础信息表', fields: 96 },
        { id: 'ods_member_address', name: 'ods_member_address', desc: '会员地址表', fields: 42 },
        { id: 'dwd_customer_identity', name: 'dwd_customer_identity', desc: '客户身份认证表', fields: 38 },
        { id: 'dim_member_level', name: 'dim_member_level', desc: '会员等级维表', fields: 26 },
        { id: 'ods_member_account', name: 'ods_member_account', desc: '会员账户表', fields: 54 },
        { id: 'ods_member_login_log', name: 'ods_member_login_log', desc: '会员登录日志表', fields: 40 },
        { id: 'dwd_customer_contact', name: 'dwd_customer_contact', desc: '客户联系方式表', fields: 44 },
        { id: 'dwd_customer_preference', name: 'dwd_customer_preference', desc: '客户偏好特征表', fields: 72 },
        { id: 'dws_customer_growth_1d', name: 'dws_customer_growth_1d', desc: '客户成长汇总表', fields: 58 },
        { id: 'dws_customer_value_1d', name: 'dws_customer_value_1d', desc: '客户价值汇总表', fields: 61 },
        { id: 'ads_customer_profile_report', name: 'ads_customer_profile_report', desc: '客户画像分析报表', fields: 67 },
        { id: 'ads_member_retention_report', name: 'ads_member_retention_report', desc: '会员留存分析报表', fields: 45 }
      ]
    },
    {
      id: 'ds-marketing',
      category: '应用数仓',
      instance: '营销分析实例',
      name: 'ads_marketing',
      displayName: '营销分析库',
      tables: [
        { id: 'dwd_campaign_touch_di', name: 'dwd_campaign_touch_di', desc: '活动触达明细表', fields: 68 },
        { id: 'dws_marketing_conversion_1d', name: 'dws_marketing_conversion_1d', desc: '营销转化汇总表', fields: 54 },
        { id: 'ads_user_tag_profile', name: 'ads_user_tag_profile', desc: '用户标签画像表', fields: 112 },
        { id: 'dim_channel', name: 'dim_channel', desc: '渠道维表', fields: 24 },
        { id: 'ods_campaign_base', name: 'ods_campaign_base', desc: '营销活动基础表', fields: 50 },
        { id: 'ods_coupon_issue_record', name: 'ods_coupon_issue_record', desc: '优惠券发放记录表', fields: 57 },
        { id: 'dwd_campaign_click_di', name: 'dwd_campaign_click_di', desc: '活动点击明细表', fields: 62 },
        { id: 'dwd_coupon_use_detail_di', name: 'dwd_coupon_use_detail_di', desc: '优惠券使用明细表', fields: 73 },
        { id: 'dws_channel_effect_1d', name: 'dws_channel_effect_1d', desc: '渠道效果汇总表', fields: 49 },
        { id: 'dws_user_tag_change_1d', name: 'dws_user_tag_change_1d', desc: '用户标签变化表', fields: 84 },
        { id: 'ads_campaign_roi_report', name: 'ads_campaign_roi_report', desc: '活动 ROI 分析报表', fields: 43 },
        { id: 'ads_channel_funnel_report', name: 'ads_channel_funnel_report', desc: '渠道漏斗分析报表', fields: 47 }
      ]
    },
    {
      id: 'ds-resource',
      category: '治理数仓',
      instance: '资源管理实例',
      name: 'gov_resource',
      displayName: '资源目录库',
      tables: [
        { id: 'asset_catalog_item', name: 'asset_catalog_item', desc: '资产目录表', fields: 46 },
        { id: 'project_resource_usage', name: 'project_resource_usage', desc: '项目资源使用表', fields: 62 },
        { id: 'asset_owner_relation', name: 'asset_owner_relation', desc: '资产责任关系表', fields: 36 },
        { id: 'resource_apply_record', name: 'resource_apply_record', desc: '资源申请记录表', fields: 44 },
        { id: 'asset_tag_relation', name: 'asset_tag_relation', desc: '资产标签关系表', fields: 32 },
        { id: 'asset_lineage_relation', name: 'asset_lineage_relation', desc: '资产血缘关系表', fields: 58 },
        { id: 'resource_quota_config', name: 'resource_quota_config', desc: '资源配额配置表', fields: 41 },
        { id: 'resource_cost_daily', name: 'resource_cost_daily', desc: '资源成本日统计表', fields: 53 },
        { id: 'project_asset_bind', name: 'project_asset_bind', desc: '项目资产绑定表', fields: 39 },
        { id: 'project_usage_summary_1d', name: 'project_usage_summary_1d', desc: '项目使用汇总表', fields: 48 },
        { id: 'asset_quality_score', name: 'asset_quality_score', desc: '资产质量评分表', fields: 37 },
        { id: 'resource_alert_record', name: 'resource_alert_record', desc: '资源告警记录表', fields: 51 }
      ]
    }
  ];

  var governanceContents = [
    {
      key: 'metadataFill',
      name: '元数据填充',
      desc: '业务元数据信息补充完成。'
    },
    {
      key: 'standardMap',
      name: '标准映射',
      desc: '建立元数据与标准的映射，业务代码与标准代码的映射。'
    },
    {
      key: 'standardAudit',
      name: '标准稽查',
      desc: '元数据与标准对比稽查，完成所有差异性处理。'
    },
    {
      key: 'dataQuality',
      name: '数据质量',
      desc: '指定表，配置数据质量任务。'
    }
  ];

  var plans = [
    {
      id: 'gp-001',
      name: '客户域核心资产治理规划',
      status: 'ongoing',
      rate: 68,
      owner: '李婷',
      createdAt: '2026-05-08 09:30',
      counts: { db: 2, table: 32, field: 520 },
      desc: '围绕客户主数据、会员基础表和客户标签字段补齐标准、口径、血缘与责任人信息。'
    },
    {
      id: 'gp-002',
      name: '交易域数仓标准化规划',
      status: 'completed',
      rate: 100,
      owner: '张明',
      createdAt: '2026-05-06 14:20',
      counts: { db: 2, table: 28, field: 460 },
      desc: '完成订单、支付、履约主题库表字段的标准映射和核心指标口径统一。'
    },
    {
      id: 'gp-003',
      name: '营销域标签数据治理规划',
      status: 'ongoing',
      rate: 54,
      owner: '王强',
      createdAt: '2026-05-05 11:05',
      counts: { db: 1, table: 24, field: 360 },
      desc: '梳理活动投放、用户触达和标签生产链路，明确标签字段命名、来源和使用范围。'
    },
    {
      id: 'gp-004',
      name: '供应链主题资产治理规划',
      status: 'ongoing',
      rate: 0,
      owner: '赵磊',
      createdAt: '2026-05-04 16:45',
      counts: { db: 1, table: 18, field: 260 },
      desc: '计划对供应商、库存、入库出库等主题资产进行责任归属和元数据完整性治理。'
    },
    {
      id: 'gp-005',
      name: '财务报表口径治理规划',
      status: 'ongoing',
      rate: 72,
      owner: '陈晨',
      createdAt: '2026-05-03 10:18',
      counts: { db: 1, table: 20, field: 310 },
      desc: '统一收入、退款、成本、毛利相关字段定义，降低跨报表统计口径差异。'
    },
    {
      id: 'gp-006',
      name: '商品域基础模型治理规划',
      status: 'completed',
      rate: 100,
      owner: '刘洋',
      createdAt: '2026-05-02 15:36',
      counts: { db: 2, table: 22, field: 330 },
      desc: '完成商品类目、SKU、SPU 相关库表字段的标准绑定和基础质量规则配置。'
    },
    {
      id: 'gp-007',
      name: '公共维表字段治理规划',
      status: 'ongoing',
      rate: 61,
      owner: '孙悦',
      createdAt: '2026-04-30 13:12',
      counts: { db: 1, table: 16, field: 280 },
      desc: '治理区域、日期、组织、渠道等公共维表，沉淀可复用字段标准和维护责任。'
    },
    {
      id: 'gp-008',
      name: '实时数据链路治理规划',
      status: 'ongoing',
      rate: 46,
      owner: '周航',
      createdAt: '2026-04-28 17:20',
      counts: { db: 1, table: 18, field: 240 },
      desc: '聚焦实时采集、清洗和宽表产出链路，补齐任务归属、字段说明和异常处置规则。'
    },
    {
      id: 'gp-009',
      name: '风控模型特征治理规划',
      status: 'archived',
      rate: 0,
      owner: '高敏',
      createdAt: '2026-04-26 09:42',
      counts: { db: 1, table: 14, field: 210 },
      desc: '准备对风控特征字段进行来源校验、脱敏标识和模型使用说明补充。'
    },
    {
      id: 'gp-010',
      name: '经营分析指标治理规划',
      status: 'completed',
      rate: 100,
      owner: '黄鑫',
      createdAt: '2026-04-24 10:00',
      counts: { db: 2, table: 26, field: 390 },
      desc: '完成 GMV、客单价、转化率等经营指标涉及字段的定义、计算口径和资产归属治理。'
    },
    {
      id: 'gp-011',
      name: '数据安全分级治理规划',
      status: 'ongoing',
      rate: 39,
      owner: '何倩',
      createdAt: '2026-04-22 14:28',
      counts: { db: 1, table: 13, field: 180 },
      desc: '按敏感等级梳理个人信息、交易信息和经营数据字段，补齐安全分级和使用边界。'
    },
    {
      id: 'gp-012',
      name: '项目资源目录治理规划',
      status: 'archived',
      rate: 100,
      owner: '马宁',
      createdAt: '2026-04-20 11:50',
      counts: { db: 1, table: 15, field: 220 },
      desc: '完成重点项目资产目录归类、资源责任人和使用说明整理，支撑后续资源管理视图。'
    }
  ];

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function formatNumber(value) {
    if (typeof value === 'string') return value;
    return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  function formatDateTime(date) {
    var pad = function (value) { return value < 10 ? '0' + value : String(value); };
    return date.getFullYear() + '-' +
      pad(date.getMonth() + 1) + '-' +
      pad(date.getDate()) + ' ' +
      pad(date.getHours()) + ':' +
      pad(date.getMinutes());
  }

  function getStatusLabel(status) {
    var item = statusOptions.find(function (option) { return option.key === status; });
    return item ? item.label : status;
  }

  function getDataSource(id) {
    return dataSources.find(function (source) { return source.id === id; }) || dataSources[0];
  }

  function getTablesBySource(id) {
    return getDataSource(id).tables;
  }

  function getTableById(sourceId, tableId) {
    return getTablesBySource(sourceId).find(function (table) { return table.id === tableId; });
  }

  function getDataSourceName(id) {
    var source = getDataSource(id);
    return source.category + ' / ' + source.instance + ' / ' + source.name;
  }

  function getGovernanceItem(key) {
    return governanceContents.find(function (item) { return item.key === key; });
  }

  function getDefaultTableConfig() {
    return {
      metadataFill: true,
      standardMap: true,
      standardAudit: true,
      dataQuality: false
    };
  }

  function resetFormUiState() {
    formUiState = {
      pendingKeyword: '',
      pendingPage: 1,
      selectedKeyword: '',
      selectedPage: 1
    };
  }

  function normalizeKeyword(value) {
    return String(value || '').trim().toLowerCase();
  }

  function filterTables(tables, keyword) {
    var normalized = normalizeKeyword(keyword);
    if (!normalized) return tables.slice();
    return tables.filter(function (table) {
      return (table.name + ' ' + table.desc).toLowerCase().indexOf(normalized) >= 0;
    });
  }

  function getFilteredPendingTables(state) {
    return filterTables(getTablesBySource(state.datasourceId), formUiState.pendingKeyword);
  }

  function getFilteredSelectedTableIds(state) {
    return state.tableIds.filter(function (tableId) {
      var table = getTableById(state.datasourceId, tableId);
      if (!table) return false;
      return filterTables([table], formUiState.selectedKeyword).length > 0;
    });
  }

  function clampPage(page, total) {
    var totalPages = Math.max(1, Math.ceil(total / scopePageSize));
    return Math.min(Math.max(1, page || 1), totalPages);
  }

  function renderScopePagination(kind, total, current) {
    var currentPageNo = clampPage(current, total);
    var totalPages = Math.max(1, Math.ceil(total / scopePageSize));
    var pages = [];

    for (var i = 1; i <= totalPages; i += 1) {
      pages.push('<a class="page-num' + (i === currentPageNo ? ' active' : '') + '" data-gp-scope="' + kind + '" data-gp-scope-page="' + i + '">' + i + '</a>');
    }

    return (
      '<div class="ds-pagination gp-scope-pagination">' +
        '<div class="page-info">共 ' + total + ' 条，每页 ' + scopePageSize + ' 条</div>' +
        '<div class="page-nav">' +
          '<a class="page-btn' + (currentPageNo === 1 ? ' disabled' : '') + '" data-gp-scope="' + kind + '" data-gp-scope-page="' + (currentPageNo - 1) + '">上一页</a>' +
          pages.join('') +
          '<a class="page-btn' + (currentPageNo === totalPages ? ' disabled' : '') + '" data-gp-scope="' + kind + '" data-gp-scope-page="' + (currentPageNo + 1) + '">下一页</a>' +
        '</div>' +
      '</div>'
    );
  }

  function normalizeTableConfig(config) {
    var defaults = getDefaultTableConfig();
    var result = {};
    governanceContents.forEach(function (item) {
      result[item.key] = config && typeof config[item.key] === 'boolean' ? config[item.key] : defaults[item.key];
    });
    return result;
  }

  function findPlan(id) {
    return plans.find(function (plan) { return plan.id === id; });
  }

  function ensurePlanScope(plan) {
    if (!plan || plan.datasourceId) return;
    var index = Math.abs(Number((plan.id || '').replace(/\D/g, '')) || 1) % dataSources.length;
    var source = dataSources[index];
    var tables = source.tables.slice(0, Math.min(3, source.tables.length));

    plan.datasourceId = source.id;
    plan.tableIds = tables.map(function (table) { return table.id; });
    plan.tableConfigs = {};
    plan.tableIds.forEach(function (tableId) {
      plan.tableConfigs[tableId] = getDefaultTableConfig();
    });
  }

  function getFilteredPlans() {
    if (activeTab === 'all') return plans.slice();
    return plans.filter(function (plan) { return plan.status === activeTab; });
  }

  function countByStatus(status) {
    if (status === 'all') return plans.length;
    return plans.filter(function (plan) { return plan.status === status; }).length;
  }

  function sumCounts(list) {
    return list.reduce(function (result, plan) {
      result.db += plan.counts.db;
      result.table += plan.counts.table;
      result.field += plan.counts.field;
      return result;
    }, { db: 0, table: 0, field: 0 });
  }

  function buildMetrics() {
    var total = countByStatus('all');
    var ongoing = countByStatus('ongoing');
    var completed = countByStatus('completed');
    var totalCounts = sumCounts(plans);
    var ongoingCounts = sumCounts(plans.filter(function (plan) { return plan.status === 'ongoing'; }));
    var completedCounts = sumCounts(plans.filter(function (plan) { return plan.status === 'completed'; }));
    var completeRate = total ? Math.round((completed / total) * 1000) / 10 : 0;

    return [
      {
        title: '总规划',
        icon: 'bi-diagram-3',
        value: total,
        unit: '个',
        items: [
          { label: '库', value: totalCounts.db },
          { label: '表', value: totalCounts.table },
          { label: '字段', value: totalCounts.field }
        ]
      },
      {
        title: '进行中',
        icon: 'bi-hourglass-split',
        value: ongoing,
        unit: '个',
        items: [
          { label: '库', value: ongoingCounts.db },
          { label: '表', value: ongoingCounts.table },
          { label: '字段', value: ongoingCounts.field }
        ]
      },
      {
        title: '已完成',
        icon: 'bi-check2-circle',
        value: completed,
        unit: '个',
        items: [
          { label: '库', value: completedCounts.db },
          { label: '表', value: completedCounts.table },
          { label: '字段', value: completedCounts.field }
        ]
      },
      {
        title: '完成率',
        icon: 'bi-pie-chart',
        value: completeRate + '%',
        rate: completeRate,
        items: [
          { label: '已完成', value: completed },
          { label: '全部', value: total }
        ]
      }
    ];
  }

  function buildCountsFromScope(sourceId, tableIds) {
    var fields = tableIds.reduce(function (sum, tableId) {
      var table = getTableById(sourceId, tableId);
      return sum + (table ? table.fields : 0);
    }, 0);

    return {
      db: tableIds.length ? 1 : 0,
      table: tableIds.length,
      field: fields
    };
  }

  function getCheckedValues(selector) {
    return Array.prototype.slice.call(document.querySelectorAll(selector + ':checked')).map(function (input) {
      return input.value;
    });
  }

  function getFormState(plan) {
    if (plan) {
      ensurePlanScope(plan);
      var tableConfigs = {};
      plan.tableIds.forEach(function (tableId) {
        tableConfigs[tableId] = normalizeTableConfig(plan.tableConfigs && plan.tableConfigs[tableId]);
      });
      return {
        name: plan.name,
        status: plan.status,
        owner: plan.owner,
        desc: plan.desc,
        datasourceId: plan.datasourceId,
        tableIds: plan.tableIds.slice(),
        tableConfigs: tableConfigs,
        datasourceKeyword: ''
      };
    }

    var defaultTableIds = getTablesBySource(dataSources[0].id).slice(0, 6).map(function (table) {
      return table.id;
    });
    var defaultConfigs = {};
    defaultTableIds.forEach(function (tableId) {
      defaultConfigs[tableId] = getDefaultTableConfig();
    });

    return {
      name: '',
      status: 'ongoing',
      owner: '',
      desc: '',
      datasourceId: dataSources[0].id,
      tableIds: defaultTableIds,
      tableConfigs: defaultConfigs,
      datasourceKeyword: ''
    };
  }

  function renderStatusOptions(value) {
    return statusOptions.map(function (option) {
      return '<option value="' + option.key + '"' + (option.key === value ? ' selected' : '') + '>' + option.label + '</option>';
    }).join('');
  }

  function renderDataSourceTree(activeId, keyword) {
    var lowerKeyword = (keyword || '').trim().toLowerCase();
    var groups = {};

    dataSources.forEach(function (source) {
      var pathText = (source.category + ' ' + source.instance + ' ' + source.name + ' ' + source.displayName).toLowerCase();
      if (lowerKeyword && pathText.indexOf(lowerKeyword) < 0) return;
      if (!groups[source.category]) groups[source.category] = {};
      if (!groups[source.category][source.instance]) groups[source.category][source.instance] = [];
      groups[source.category][source.instance].push(source);
    });

    var html = Object.keys(groups).map(function (category) {
      var instances = Object.keys(groups[category]).map(function (instance) {
        var dbs = groups[category][instance].map(function (source) {
          return (
            '<button class="gp-ds-node gp-ds-db' + (source.id === activeId ? ' active' : '') + '" type="button" data-gp-ds="' + source.id + '">' +
              '<i class="bi bi-database"></i>' +
              '<span>' + escapeHtml(source.name) + '</span>' +
              '<em>' + escapeHtml(source.displayName) + '</em>' +
            '</button>'
          );
        }).join('');

        return (
          '<div class="gp-ds-instance">' +
            '<div class="gp-ds-node gp-ds-folder"><i class="bi bi-folder2-open"></i><span>' + escapeHtml(instance) + '</span></div>' +
            '<div class="gp-ds-db-list">' + dbs + '</div>' +
          '</div>'
        );
      }).join('');

      return (
        '<div class="gp-ds-category">' +
          '<div class="gp-ds-node gp-ds-root"><i class="bi bi-diagram-3"></i><span>' + escapeHtml(category) + '</span></div>' +
          instances +
        '</div>'
      );
    }).join('');

    return html || '<div class="gp-ds-empty">未找到匹配的数据源</div>';
  }

  function renderTableOptions(state) {
    var rows = getFilteredPendingTables(state);
    formUiState.pendingPage = clampPage(formUiState.pendingPage, rows.length);
    rows = rows.slice((formUiState.pendingPage - 1) * scopePageSize, formUiState.pendingPage * scopePageSize);

    if (!rows.length) {
      return '<div class="gp-scope-empty">未找到匹配的数据表</div>';
    }

    return rows.map(function (table) {
      var checked = state.tableIds.indexOf(table.id) >= 0 ? ' checked' : '';
      return (
        '<label class="gp-pending-table">' +
          '<input class="gp-form-table" type="checkbox" value="' + table.id + '"' + checked + '>' +
          '<div class="gp-pending-main">' +
            '<strong>' + escapeHtml(table.name) + '</strong>' +
            '<span>' + escapeHtml(table.desc) + '</span>' +
          '</div>' +
          '<em>' + table.fields + ' 字段</em>' +
        '</label>'
      );
    }).join('');
  }

  function renderPendingPagination(state) {
    var total = getFilteredPendingTables(state).length;
    return renderScopePagination('pending', total, formUiState.pendingPage);
  }

  function renderConfigHeader(state, tableIds) {
    var targetIds = tableIds || state.tableIds;
    return governanceContents.map(function (item) {
      var checked = targetIds.length > 0 && targetIds.every(function (tableId) {
        var config = normalizeTableConfig(state.tableConfigs[tableId]);
        return config[item.key];
      });

      return (
        '<label class="gp-config-head-cell" title="' + escapeHtml(item.desc) + '">' +
          '<input class="gp-config-all" type="checkbox" value="' + item.key + '"' + (checked ? ' checked' : '') + '>' +
          '<span>' + escapeHtml(item.name) + '</span>' +
          '<i class="bi bi-info-circle"></i>' +
        '</label>'
      );
    }).join('');
  }

  function renderSelectedTables(state) {
    var selectedIds = getFilteredSelectedTableIds(state);
    formUiState.selectedPage = clampPage(formUiState.selectedPage, selectedIds.length);
    var pageIds = selectedIds.slice((formUiState.selectedPage - 1) * scopePageSize, formUiState.selectedPage * scopePageSize);
    var emptyText = state.tableIds.length ? '未找到匹配的已选表' : '请从左侧勾选需要治理的数据表';
    var emptyIcon = state.tableIds.length ? 'bi-search' : 'bi-table';

    return (
      '<div class="gp-selected-table">' +
        '<div class="gp-selected-row gp-selected-row-head">' +
          '<div class="gp-selected-main">已选择表</div>' +
          renderConfigHeader(state, pageIds) +
          '<div class="gp-selected-action-head">操作</div>' +
        '</div>' +
        (pageIds.length ? pageIds.map(function (tableId) {
          var table = getTableById(state.datasourceId, tableId);
          if (!table) return '';
          var config = normalizeTableConfig(state.tableConfigs[tableId]);
          var cells = governanceContents.map(function (item) {
            return (
              '<label class="gp-config-cell" title="' + escapeHtml(item.desc) + '">' +
                '<input class="gp-table-config" type="checkbox" data-table-id="' + table.id + '" value="' + item.key + '"' + (config[item.key] ? ' checked' : '') + '>' +
                '<i class="bi bi-info-circle"></i>' +
              '</label>'
            );
          }).join('');

          return (
            '<div class="gp-selected-row">' +
              '<div class="gp-selected-main">' +
                '<strong>' + escapeHtml(table.name) + '</strong>' +
                '<span>' + escapeHtml(table.desc) + ' · ' + table.fields + ' 字段</span>' +
              '</div>' +
              cells +
              '<div class="gp-selected-action"><button class="gp-row-remove" type="button" data-gp-remove-table="' + table.id + '" title="取消选择"><i class="bi bi-trash3"></i><span>移除</span></button></div>' +
            '</div>'
          );
        }).join('') : '<div class="gp-selected-empty gp-selected-empty-row"><i class="bi ' + emptyIcon + '"></i><span>' + emptyText + '</span></div>') +
      '</div>'
    );
  }

  function renderSelectedPagination(state) {
    var selectedIds = getFilteredSelectedTableIds(state);
    return renderScopePagination('selected', selectedIds.length, formUiState.selectedPage);
  }

  function collectFormState() {
    var datasourceEl = document.getElementById('gpFormDatasource');
    var draft = formDraftState || {
      datasourceId: datasourceEl ? datasourceEl.value : dataSources[0].id,
      tableIds: [],
      tableConfigs: {}
    };
    var datasourceId = datasourceEl ? datasourceEl.value : draft.datasourceId;
    var tableIds = draft.tableIds.slice();
    var tableConfigs = Object.assign({}, draft.tableConfigs);

    Array.prototype.slice.call(document.querySelectorAll('.gp-form-table')).forEach(function (input) {
      var index = tableIds.indexOf(input.value);
      if (input.checked && index < 0) {
        tableIds.push(input.value);
        tableConfigs[input.value] = normalizeTableConfig(tableConfigs[input.value]);
      } else if (!input.checked && index >= 0) {
        tableIds.splice(index, 1);
        delete tableConfigs[input.value];
      }
    });

    tableIds = getTablesBySource(datasourceId).map(function (table) {
      return table.id;
    }).filter(function (tableId) {
      return tableIds.indexOf(tableId) >= 0;
    });

    Array.prototype.slice.call(document.querySelectorAll('.gp-table-config')).forEach(function (input) {
      var tableId = input.dataset.tableId;
      if (!tableConfigs[tableId]) return;
      tableConfigs[tableId][input.value] = input.checked;
    });

    Object.keys(tableConfigs).forEach(function (tableId) {
      if (tableIds.indexOf(tableId) < 0) delete tableConfigs[tableId];
    });

    var state = {
      name: (document.getElementById('gpFormName') || {}).value || '',
      status: (document.getElementById('gpFormStatus') || {}).value || 'ongoing',
      owner: (document.getElementById('gpFormOwner') || {}).value || '',
      desc: (document.getElementById('gpFormDesc') || {}).value || '',
      datasourceId: datasourceId,
      tableIds: tableIds,
      tableConfigs: tableConfigs,
      datasourceKeyword: (document.getElementById('gpDatasourceSearch') || {}).value || '',
      pendingKeyword: (document.getElementById('gpPendingSearch') || {}).value || formUiState.pendingKeyword,
      selectedKeyword: (document.getElementById('gpSelectedSearch') || {}).value || formUiState.selectedKeyword
    };

    formDraftState = state;
    return state;
  }

  function showFormError(message) {
    var error = document.getElementById('gpFormError');
    if (error) {
      error.textContent = message;
      error.style.display = message ? 'block' : 'none';
    }
  }

  function syncSelectedTables() {
    var state = collectFormState();
    var pending = document.getElementById('gpPendingTables');
    if (pending) pending.innerHTML = renderTableOptions(state);
    var pendingPagination = document.getElementById('gpPendingPagination');
    if (pendingPagination) pendingPagination.innerHTML = renderPendingPagination(state);
    var selected = document.getElementById('gpSelectedTables');
    if (selected) selected.innerHTML = renderSelectedTables(state);
    var selectedPagination = document.getElementById('gpSelectedPagination');
    if (selectedPagination) selectedPagination.innerHTML = renderSelectedPagination(state);
    var pendingCount = document.getElementById('gpPendingCount');
    if (pendingCount) pendingCount.textContent = getFilteredPendingTables(state).length + ' 张';
    var selectedCount = document.getElementById('gpSelectedCount');
    if (selectedCount) selectedCount.textContent = '已选 ' + state.tableIds.length + ' 张';
  }

  function renderForm(state) {
    var formRoot = document.getElementById('gpFormView');
    var listRoot = document.getElementById('gpListView');
    if (!formRoot || !listRoot) return;

    viewMode = 'form';
    listRoot.style.display = 'none';
    formRoot.style.display = 'flex';
    formUiState.pendingKeyword = state.pendingKeyword || formUiState.pendingKeyword || '';
    formUiState.selectedKeyword = state.selectedKeyword || formUiState.selectedKeyword || '';
    formDraftState = state;
    formUiState.pendingPage = clampPage(formUiState.pendingPage, getFilteredPendingTables(state).length);
    formUiState.selectedPage = clampPage(formUiState.selectedPage, getFilteredSelectedTableIds(state).length);

    var title = formMode === 'edit' ? '编辑治理规划' : '新建治理规划';

    formRoot.innerHTML =
      '<div class="gp-form-header">' +
        '<div class="gp-form-title"><button class="btn btn-outline btn-sm" type="button" data-gp-form-action="cancel"><i class="bi bi-arrow-left"></i> 返回</button><span>' + title + '</span></div>' +
        '<div class="gp-form-actions"><button class="btn btn-outline" type="button" data-gp-form-action="cancel">取消</button><button class="btn btn-primary" type="button" data-gp-form-action="save"><i class="bi bi-check-lg"></i> 保存</button></div>' +
      '</div>' +
      '<div class="gp-form-scroll">' +
        '<section class="gp-form-section">' +
          '<div class="gp-section-title"><i class="bi bi-card-text"></i><span>基本信息</span></div>' +
          '<div class="gp-form-grid">' +
            '<label class="gp-form-field"><span>名称</span><input id="gpFormName" type="text" value="' + escapeHtml(state.name) + '" placeholder="请输入治理规划名称"></label>' +
            '<label class="gp-form-field"><span>状态</span><select id="gpFormStatus">' + renderStatusOptions(state.status) + '</select></label>' +
            '<label class="gp-form-field"><span>责任人</span><input id="gpFormOwner" type="text" value="' + escapeHtml(state.owner) + '" placeholder="请输入责任人"></label>' +
            '<label class="gp-form-field gp-form-field-wide"><span>简介</span><textarea id="gpFormDesc" rows="3" placeholder="请输入治理规划简介">' + escapeHtml(state.desc) + '</textarea></label>' +
          '</div>' +
        '</section>' +
        '<section class="gp-form-section">' +
          '<div class="gp-section-title"><i class="bi bi-bounding-box"></i><span>治理范围</span></div>' +
          '<input id="gpFormDatasource" type="hidden" value="' + escapeHtml(state.datasourceId) + '">' +
          '<div class="gp-range-layout">' +
            '<div class="gp-range-left">' +
              '<div class="gp-range-title"><span>待选项</span><em id="gpPendingCount">' + getFilteredPendingTables(state).length + ' 张</em></div>' +
              '<div class="gp-source-row">' +
                '<span class="gp-source-label">数据源</span>' +
                '<div class="gp-ds-select">' +
                  '<div class="gp-ds-combo" id="gpDsCombo">' +
                    '<button class="gp-ds-trigger" type="button" data-gp-ds-toggle>' +
                      '<strong>' + escapeHtml(getDataSourceName(state.datasourceId)) + '</strong>' +
                      '<i class="bi bi-chevron-down"></i>' +
                    '</button>' +
                    '<div class="gp-ds-dropdown">' +
                      '<div class="gp-ds-search"><i class="bi bi-search"></i><input id="gpDatasourceSearch" type="text" value="' + escapeHtml(state.datasourceKeyword || '') + '" placeholder="搜索分类、实例或数据库"></div>' +
                      '<div class="gp-ds-tree" id="gpDatasourceTree">' + renderDataSourceTree(state.datasourceId, state.datasourceKeyword) + '</div>' +
                    '</div>' +
                  '</div>' +
                '</div>' +
              '</div>' +
              '<div class="gp-scope-toolbar">' +
                '<div class="gp-scope-search"><i class="bi bi-search"></i><input id="gpPendingSearch" type="text" value="' + escapeHtml(formUiState.pendingKeyword) + '" placeholder="搜索表名或说明"></div>' +
              '</div>' +
              '<div class="gp-pending-list" id="gpPendingTables">' + renderTableOptions(state) + '</div>' +
              '<div id="gpPendingPagination">' + renderPendingPagination(state) + '</div>' +
            '</div>' +
            '<div class="gp-range-right">' +
              '<div class="gp-range-title"><span>已选择</span><em id="gpSelectedCount">已选 ' + state.tableIds.length + ' 张</em></div>' +
              '<div class="gp-selected-toolbar gp-scope-toolbar">' +
                '<div class="gp-scope-search"><i class="bi bi-search"></i><input id="gpSelectedSearch" type="text" value="' + escapeHtml(formUiState.selectedKeyword) + '" placeholder="搜索已选表"></div>' +
              '</div>' +
              '<div id="gpSelectedTables">' + renderSelectedTables(state) + '</div>' +
              '<div id="gpSelectedPagination">' + renderSelectedPagination(state) + '</div>' +
            '</div>' +
          '</div>' +
        '</section>' +
        '<div class="gp-form-error" id="gpFormError" style="display:none;"></div>' +
      '</div>' +
      '<div class="gp-form-footer"><button class="btn btn-outline" type="button" data-gp-form-action="cancel">取消</button><button class="btn btn-primary" type="button" data-gp-form-action="save"><i class="bi bi-check-lg"></i> 保存</button></div>';
  }

  function showPlanForm(mode, id) {
    formMode = mode;
    editingPlanId = id || '';
    resetFormUiState();
    var plan = id ? findPlan(id) : null;
    renderForm(getFormState(plan));
  }

  function saveForm() {
    var state = collectFormState();
    state.name = state.name.trim();
    state.owner = state.owner.trim();
    state.desc = state.desc.trim();

    if (!state.name) {
      showFormError('请输入治理规划名称。');
      return;
    }
    if (!state.owner) {
      showFormError('请输入责任人。');
      return;
    }
    if (!state.tableIds.length) {
      showFormError('请选择至少一张数据表。');
      return;
    }
    var counts = buildCountsFromScope(state.datasourceId, state.tableIds);

    if (formMode === 'edit') {
      var plan = findPlan(editingPlanId);
      if (plan) {
        plan.name = state.name;
        plan.status = state.status;
        plan.owner = state.owner;
        plan.desc = state.desc;
        plan.datasourceId = state.datasourceId;
        plan.tableIds = state.tableIds;
        plan.tableConfigs = state.tableConfigs;
        plan.counts = counts;
        if (state.status === 'completed') plan.rate = 100;
      }
    } else {
      plans.unshift({
        id: 'gp-' + String(Date.now()).slice(-6),
        name: state.name,
        status: state.status,
        rate: state.status === 'completed' ? 100 : 0,
        owner: state.owner,
        createdAt: formatDateTime(new Date()),
        counts: counts,
        desc: state.desc,
        datasourceId: state.datasourceId,
        tableIds: state.tableIds,
        tableConfigs: state.tableConfigs
      });
    }

    activeTab = state.status;
    currentPage = 1;
    renderListView();
  }

  function renderMetrics() {
    var grid = document.getElementById('gpMetricGrid');
    if (!grid) return;

    grid.innerHTML = buildMetrics().map(function (metric) {
      var breakdown = metric.items.map(function (item) {
        return (
          '<div class="gp-metric-split">' +
            '<span>' + escapeHtml(item.label) + '</span>' +
            '<strong>' + formatNumber(item.value) + '</strong>' +
          '</div>'
        );
      }).join('');
      var rate = metric.rate !== undefined
        ? '<div class="gp-metric-progress"><div style="width:' + metric.rate + '%;"></div></div>'
        : '';
      var unit = metric.unit ? '<span>' + escapeHtml(metric.unit) + '</span>' : '';

      return (
        '<section class="gp-metric-card">' +
          '<div class="gp-metric-main">' +
            '<i class="bi ' + metric.icon + '"></i>' +
            '<div>' +
              '<div class="gp-metric-head">' + escapeHtml(metric.title) + '</div>' +
              '<div class="gp-metric-value">' + formatNumber(metric.value) + unit + '</div>' +
            '</div>' +
          '</div>' +
          rate +
          '<div class="gp-metric-breakdown">' + breakdown + '</div>' +
        '</section>'
      );
    }).join('');
  }

  function renderTabs() {
    var tabWrap = document.getElementById('gpTabs');
    if (!tabWrap) return;

    tabWrap.innerHTML = tabs.map(function (tab) {
      return (
        '<button class="gp-tab' + (tab.key === activeTab ? ' active' : '') + '" data-gp-tab="' + tab.key + '">' +
          '<span>' + tab.label + '</span>' +
        '</button>'
      );
    }).join('');
  }

  function renderCards() {
    var wrap = document.getElementById('gpCardWrap');
    if (!wrap) return;

    var filtered = getFilteredPlans();
    var totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    if (currentPage > totalPages) currentPage = totalPages;

    var start = (currentPage - 1) * pageSize;
    var rows = filtered.slice(start, start + pageSize);

    if (!rows.length) {
      wrap.innerHTML =
        '<div class="gp-empty">' +
          '<i class="bi bi-inboxes"></i>' +
          '<span>当前分类暂无治理规划</span>' +
        '</div>';
      return;
    }

    wrap.innerHTML = rows.map(function (plan) {
      var isArchived = plan.status === 'archived';
      var archiveButton = isArchived
        ? '<button class="gp-icon-btn disabled" type="button" disabled title="已归档"><i class="bi bi-archive"></i></button>'
        : '<button class="gp-icon-btn" type="button" data-gp-action="archive" data-gp-id="' + plan.id + '" title="归档"><i class="bi bi-archive"></i></button>';
      var deleteButton = isArchived
        ? '<button class="gp-icon-btn danger" type="button" data-gp-action="delete" data-gp-id="' + plan.id + '" title="删除"><i class="bi bi-trash3"></i></button>'
        : '<button class="gp-icon-btn disabled" type="button" disabled title="归档后才能删除"><i class="bi bi-trash3"></i></button>';

      return (
        '<article class="gp-plan-card">' +
          '<div class="gp-plan-head">' +
            '<div class="gp-plan-name" title="' + escapeHtml(plan.name) + '">' +
              '<i class="bi bi-kanban"></i><span>' + escapeHtml(plan.name) + '</span>' +
            '</div>' +
            '<div class="gp-plan-actions">' +
              '<button class="gp-icon-btn" type="button" data-gp-action="edit" data-gp-id="' + plan.id + '" title="编辑"><i class="bi bi-pencil-square"></i></button>' +
              archiveButton +
              deleteButton +
            '</div>' +
          '</div>' +
          '<div class="gp-plan-rate">' +
            '<span>完成率</span>' +
            '<strong>' + plan.rate + '%</strong>' +
          '</div>' +
          '<div class="gp-plan-progress"><div style="width:' + plan.rate + '%;"></div></div>' +
          '<p class="gp-plan-desc">' + escapeHtml(plan.desc) + '</p>' +
          '<div class="gp-plan-meta">' +
            '<div><span>责任人</span><strong>' + escapeHtml(plan.owner) + '</strong></div>' +
            '<div><span>创建时间</span><strong>' + escapeHtml(plan.createdAt) + '</strong></div>' +
          '</div>' +
        '</article>'
      );
    }).join('');
  }

  function renderPagination() {
    var pagination = document.getElementById('gpPagination');
    if (!pagination) return;

    var total = getFilteredPlans().length;
    var totalPages = Math.max(1, Math.ceil(total / pageSize));
    if (currentPage > totalPages) currentPage = totalPages;

    var pages = [];
    for (var i = 1; i <= totalPages; i += 1) {
      pages.push('<a class="page-num' + (i === currentPage ? ' active' : '') + '" data-gp-page="' + i + '">' + i + '</a>');
    }

    pagination.innerHTML =
      '<div class="page-info">共 ' + total + ' 条，每页 ' + pageSize + ' 条</div>' +
      '<div class="page-nav">' +
        '<a class="page-btn' + (currentPage === 1 ? ' disabled' : '') + '" data-gp-prev>上一页</a>' +
        pages.join('') +
        '<a class="page-btn' + (currentPage === totalPages ? ' disabled' : '') + '" data-gp-next>下一页</a>' +
      '</div>';
  }

  function renderConfirm() {
    var root = document.getElementById('gpConfirmRoot');
    if (!root) return;

    if (!confirmState) {
      root.innerHTML = '';
      return;
    }

    root.innerHTML =
      '<div class="gp-confirm-mask">' +
        '<div class="gp-confirm-modal">' +
          '<div class="gp-confirm-icon ' + (confirmState.type || '') + '">' +
            '<i class="bi ' + (confirmState.icon || 'bi-exclamation-circle') + '"></i>' +
          '</div>' +
          '<div class="gp-confirm-main">' +
            '<div class="gp-confirm-title">' + escapeHtml(confirmState.title) + '</div>' +
            '<div class="gp-confirm-text">' + escapeHtml(confirmState.message) + '</div>' +
            '<div class="gp-confirm-actions">' +
              '<button class="btn btn-outline" type="button" data-gp-confirm="cancel">取消</button>' +
              '<button class="btn ' + (confirmState.danger ? 'btn-danger' : 'btn-primary') + '" type="button" data-gp-confirm="ok">' + escapeHtml(confirmState.confirmText || '确认') + '</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  function showConfirm(options) {
    confirmState = options;
    renderConfirm();
  }

  function closeConfirm() {
    confirmState = null;
    renderConfirm();
  }

  function renderListView() {
    var formRoot = document.getElementById('gpFormView');
    var listRoot = document.getElementById('gpListView');
    viewMode = 'list';
    if (formRoot) {
      formRoot.style.display = 'none';
      formRoot.innerHTML = '';
    }
    if (listRoot) listRoot.style.display = 'flex';
    renderMetrics();
    renderTabs();
    renderCards();
    renderPagination();
    renderConfirm();
  }

  function renderPage() {
    renderListView();
  }

  function refreshList() {
    renderMetrics();
    renderTabs();
    renderCards();
    renderPagination();
  }

  function archivePlan(plan) {
    var message = plan.rate < 100
      ? '当前规划只完成' + plan.rate + '%，未全部完成，请确认是否归档。'
      : '确认归档该治理规划？归档后可在“归档”分类中查看。';

    showConfirm({
      title: '归档确认',
      message: message,
      confirmText: '确认归档',
      icon: 'bi-archive',
      onConfirm: function () {
        plan.status = 'archived';
        if (activeTab !== 'all' && activeTab !== 'archived') currentPage = 1;
        refreshList();
      }
    });
  }

  function deletePlan(plan) {
    if (plan.status !== 'archived') return;

    showConfirm({
      title: '删除确认',
      message: '删除后该治理规划将从列表中移除，请确认是否删除。',
      confirmText: '确认删除',
      icon: 'bi-trash3',
      danger: true,
      type: 'danger',
      onConfirm: function () {
        plans = plans.filter(function (item) { return item.id !== plan.id; });
        refreshList();
      }
    });
  }

  function bindEvents() {
    var page = document.querySelector('.page-governance-plan');
    if (!page) return;

    page.addEventListener('click', function (e) {
      var confirmBtn = e.target.closest('[data-gp-confirm]');
      if (confirmBtn) {
        var action = confirmBtn.dataset.gpConfirm;
        var onConfirm = confirmState && confirmState.onConfirm;
        closeConfirm();
        if (action === 'ok' && onConfirm) onConfirm();
        return;
      }

      var formAction = e.target.closest('[data-gp-form-action]');
      if (formAction) {
        if (formAction.dataset.gpFormAction === 'save') {
          saveForm();
        } else {
          renderListView();
        }
        return;
      }

      var dataSourceToggle = e.target.closest('[data-gp-ds-toggle]');
      if (dataSourceToggle && viewMode === 'form') {
        var combo = document.getElementById('gpDsCombo');
        if (combo) {
          combo.classList.toggle('open');
          if (combo.classList.contains('open')) {
            var searchInput = document.getElementById('gpDatasourceSearch');
            if (searchInput) searchInput.focus();
          }
        }
        return;
      }

      var dataSourceNode = e.target.closest('[data-gp-ds]');
      if (dataSourceNode && viewMode === 'form') {
        var sourceState = collectFormState();
        sourceState.datasourceId = dataSourceNode.dataset.gpDs;
        sourceState.tableIds = [];
        sourceState.tableConfigs = {};
        sourceState.datasourceKeyword = '';
        formUiState.pendingKeyword = '';
        formUiState.pendingPage = 1;
        formUiState.selectedKeyword = '';
        formUiState.selectedPage = 1;
        renderForm(sourceState);
        return;
      }

      var removeTableBtn = e.target.closest('[data-gp-remove-table]');
      if (removeTableBtn && viewMode === 'form') {
        var removeTableId = removeTableBtn.dataset.gpRemoveTable;
        var removeState = collectFormState();
        removeState.tableIds = removeState.tableIds.filter(function (tableId) {
          return tableId !== removeTableId;
        });
        delete removeState.tableConfigs[removeTableId];
        formDraftState = removeState;
        var tableCheckbox = document.querySelector('.gp-form-table[value="' + removeTableId + '"]');
        if (tableCheckbox) tableCheckbox.checked = false;
        formUiState.selectedPage = 1;
        syncSelectedTables();
        return;
      }

      var scopePageBtn = e.target.closest('[data-gp-scope-page]');
      if (scopePageBtn && viewMode === 'form' && !scopePageBtn.classList.contains('disabled')) {
        var targetPage = Number(scopePageBtn.dataset.gpScopePage) || 1;
        if (scopePageBtn.dataset.gpScope === 'pending') {
          formUiState.pendingPage = targetPage;
          var pendingState = collectFormState();
          var pendingList = document.getElementById('gpPendingTables');
          var pendingPagination = document.getElementById('gpPendingPagination');
          if (pendingList) pendingList.innerHTML = renderTableOptions(pendingState);
          if (pendingPagination) pendingPagination.innerHTML = renderPendingPagination(pendingState);
        } else {
          formUiState.selectedPage = targetPage;
          syncSelectedTables();
        }
        return;
      }

      if (viewMode === 'form' && !e.target.closest('.gp-ds-combo')) {
        var openCombo = document.getElementById('gpDsCombo');
        if (openCombo) openCombo.classList.remove('open');
      }

      var tab = e.target.closest('[data-gp-tab]');
      if (tab) {
        activeTab = tab.dataset.gpTab;
        currentPage = 1;
        renderTabs();
        renderCards();
        renderPagination();
        return;
      }

      var pager = e.target.closest('[data-gp-page], [data-gp-prev], [data-gp-next]');
      if (pager && !pager.classList.contains('disabled')) {
        var totalPages = Math.max(1, Math.ceil(getFilteredPlans().length / pageSize));
        if (pager.hasAttribute('data-gp-prev')) {
          currentPage = Math.max(1, currentPage - 1);
        } else if (pager.hasAttribute('data-gp-next')) {
          currentPage = Math.min(totalPages, currentPage + 1);
        } else {
          currentPage = Number(pager.dataset.gpPage) || 1;
        }
        renderCards();
        renderPagination();
        return;
      }

      var actionBtn = e.target.closest('[data-gp-action]');
      if (!actionBtn) return;

      var action = actionBtn.dataset.gpAction;
      var plan = findPlan(actionBtn.dataset.gpId);

      if (action === 'create') {
        showPlanForm('create');
      } else if (action === 'edit' && plan) {
        showPlanForm('edit', plan.id);
      } else if (action === 'archive' && plan) {
        archivePlan(plan);
      } else if (action === 'delete' && plan) {
        deletePlan(plan);
      }
    });

    page.addEventListener('change', function (e) {
      if (viewMode !== 'form') return;

      if (e.target && e.target.classList.contains('gp-config-all')) {
        var checked = e.target.checked;
        var key = e.target.value;
        document.querySelectorAll('.gp-table-config[value="' + key + '"]').forEach(function (input) {
          input.checked = checked;
        });
        syncSelectedTables();
        return;
      }

      if (e.target && (e.target.classList.contains('gp-form-table') || e.target.classList.contains('gp-table-config'))) {
        if (e.target.classList.contains('gp-form-table')) formUiState.selectedPage = 1;
        syncSelectedTables();
      }
    });

    page.addEventListener('input', function (e) {
      if (viewMode !== 'form' || !e.target) return;

      if (e.target.id === 'gpDatasourceSearch') {
        var state = collectFormState();
        var tree = document.getElementById('gpDatasourceTree');
        if (tree) tree.innerHTML = renderDataSourceTree(state.datasourceId, e.target.value);
        return;
      }

      if (e.target.id === 'gpPendingSearch') {
        formUiState.pendingKeyword = e.target.value;
        formUiState.pendingPage = 1;
        var pendingState = collectFormState();
        var pendingList = document.getElementById('gpPendingTables');
        var pendingPagination = document.getElementById('gpPendingPagination');
        var pendingCount = document.getElementById('gpPendingCount');
        if (pendingList) pendingList.innerHTML = renderTableOptions(pendingState);
        if (pendingPagination) pendingPagination.innerHTML = renderPendingPagination(pendingState);
        if (pendingCount) pendingCount.textContent = getFilteredPendingTables(pendingState).length + ' 张';
        return;
      }

      if (e.target.id === 'gpSelectedSearch') {
        formUiState.selectedKeyword = e.target.value;
        formUiState.selectedPage = 1;
        syncSelectedTables();
      }
    });
  }

  return {
    html: (
      '<div class="page-governance-plan">' +
        '<div class="gp-list-view" id="gpListView">' +
          '<div class="gp-body">' +
            '<div class="gp-metric-grid" id="gpMetricGrid"></div>' +
            '<div class="gp-list-head">' +
              '<div class="gp-tabs" id="gpTabs"></div>' +
              '<button class="btn btn-primary" type="button" data-gp-action="create"><i class="bi bi-plus-lg"></i> 新建</button>' +
            '</div>' +
            '<div class="gp-card-wrap" id="gpCardWrap"></div>' +
          '</div>' +
          '<div class="ds-pagination gp-pagination" id="gpPagination"></div>' +
        '</div>' +
        '<div class="gp-form-view" id="gpFormView" style="display:none;"></div>' +
        '<div id="gpConfirmRoot"></div>' +
      '</div>'
    ),

    init: function () {
      currentPage = 1;
      activeTab = 'ongoing';
      confirmState = null;
      viewMode = 'list';
      formMode = 'create';
      editingPlanId = '';
      resetFormUiState();
      renderPage();
      bindEvents();
    }
  };
})();
