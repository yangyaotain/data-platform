/**
 * 数据中台 V4.0 - 数据治理 / 治理规划
 */
window.DP = window.DP || {};
DP.pages = DP.pages || {};

DP.pages.governancePlan = (function () {
  var pageSize = 6;
  var currentPage = 1;
  var activeTab = 'ongoing';
  var confirmState = null;
  var viewMode = 'list';
  var formMode = 'create';
  var editingPlanId = '';

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
      name: '交易数仓',
      tables: [
        { id: 'ods_order_main', name: 'ods_order_main', desc: '订单主表', fields: 82 },
        { id: 'dwd_trade_order_detail_di', name: 'dwd_trade_order_detail_di', desc: '交易订单明细表', fields: 126 },
        { id: 'dws_trade_summary_1d', name: 'dws_trade_summary_1d', desc: '交易汇总表', fields: 74 },
        { id: 'ads_sales_daily_report', name: 'ads_sales_daily_report', desc: '销售日分析报表', fields: 58 }
      ]
    },
    {
      id: 'ds-customer',
      name: '客户数据源',
      tables: [
        { id: 'dwd_customer_base', name: 'dwd_customer_base', desc: '客户基础信息表', fields: 96 },
        { id: 'ods_member_address', name: 'ods_member_address', desc: '会员地址表', fields: 42 },
        { id: 'dwd_customer_identity', name: 'dwd_customer_identity', desc: '客户身份认证表', fields: 38 },
        { id: 'dim_member_level', name: 'dim_member_level', desc: '会员等级维表', fields: 26 }
      ]
    },
    {
      id: 'ds-marketing',
      name: '营销分析库',
      tables: [
        { id: 'dwd_campaign_touch_di', name: 'dwd_campaign_touch_di', desc: '活动触达明细表', fields: 68 },
        { id: 'dws_marketing_conversion_1d', name: 'dws_marketing_conversion_1d', desc: '营销转化汇总表', fields: 54 },
        { id: 'ads_user_tag_profile', name: 'ads_user_tag_profile', desc: '用户标签画像表', fields: 112 },
        { id: 'dim_channel', name: 'dim_channel', desc: '渠道维表', fields: 24 }
      ]
    },
    {
      id: 'ds-resource',
      name: '资源目录库',
      tables: [
        { id: 'asset_catalog_item', name: 'asset_catalog_item', desc: '资产目录表', fields: 46 },
        { id: 'project_resource_usage', name: 'project_resource_usage', desc: '项目资源使用表', fields: 62 },
        { id: 'asset_owner_relation', name: 'asset_owner_relation', desc: '资产责任关系表', fields: 36 },
        { id: 'resource_apply_record', name: 'resource_apply_record', desc: '资源申请记录表', fields: 44 }
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
    plan.contentKeys = plan.rate === 100
      ? ['metadataFill', 'standardMap', 'standardAudit', 'dataQuality']
      : ['metadataFill', 'standardMap'];
    plan.qualityTableIds = plan.contentKeys.indexOf('dataQuality') >= 0 ? [tables[0].id] : [];
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
      return {
        name: plan.name,
        status: plan.status,
        owner: plan.owner,
        desc: plan.desc,
        datasourceId: plan.datasourceId,
        tableIds: plan.tableIds.slice(),
        contentKeys: plan.contentKeys.slice(),
        qualityTableIds: plan.qualityTableIds.slice()
      };
    }

    return {
      name: '',
      status: 'ongoing',
      owner: '',
      desc: '',
      datasourceId: dataSources[0].id,
      tableIds: dataSources[0].tables.slice(0, 2).map(function (table) { return table.id; }),
      contentKeys: ['metadataFill', 'standardMap'],
      qualityTableIds: []
    };
  }

  function renderStatusOptions(value) {
    return statusOptions.map(function (option) {
      return '<option value="' + option.key + '"' + (option.key === value ? ' selected' : '') + '>' + option.label + '</option>';
    }).join('');
  }

  function renderDataSourceOptions(value) {
    return dataSources.map(function (source) {
      return '<option value="' + source.id + '"' + (source.id === value ? ' selected' : '') + '>' + source.name + '</option>';
    }).join('');
  }

  function renderTableOptions(state) {
    return getTablesBySource(state.datasourceId).map(function (table) {
      var checked = state.tableIds.indexOf(table.id) >= 0 ? ' checked' : '';
      return (
        '<label class="gp-table-option">' +
          '<input class="gp-form-table" type="checkbox" value="' + table.id + '"' + checked + '>' +
          '<div>' +
            '<strong>' + escapeHtml(table.name) + '</strong>' +
            '<span>' + escapeHtml(table.desc) + ' · ' + table.fields + ' 字段</span>' +
          '</div>' +
        '</label>'
      );
    }).join('');
  }

  function renderContentOptions(state) {
    return governanceContents.map(function (item) {
      var checked = state.contentKeys.indexOf(item.key) >= 0 ? ' checked' : '';
      return (
        '<label class="gp-content-option">' +
          '<input class="gp-form-content" type="checkbox" value="' + item.key + '"' + checked + '>' +
          '<div>' +
            '<strong>' + escapeHtml(item.name) + '</strong>' +
            '<span>' + escapeHtml(item.desc) + '</span>' +
          '</div>' +
        '</label>'
      );
    }).join('');
  }

  function renderQualityOptions(sourceId, tableIds, selectedIds) {
    if (!tableIds.length) {
      return '<div class="gp-quality-empty">请先在治理范围中选择数据表。</div>';
    }

    return tableIds.map(function (tableId) {
      var table = getTableById(sourceId, tableId);
      if (!table) return '';
      var checked = selectedIds.indexOf(table.id) >= 0 ? ' checked' : '';
      return (
        '<label class="gp-quality-option">' +
          '<input class="gp-quality-table" type="checkbox" value="' + table.id + '"' + checked + '>' +
          '<span>' + escapeHtml(table.name) + '</span>' +
        '</label>'
      );
    }).join('');
  }

  function collectFormState() {
    var datasourceEl = document.getElementById('gpFormDatasource');
    var state = {
      name: (document.getElementById('gpFormName') || {}).value || '',
      status: (document.getElementById('gpFormStatus') || {}).value || 'ongoing',
      owner: (document.getElementById('gpFormOwner') || {}).value || '',
      desc: (document.getElementById('gpFormDesc') || {}).value || '',
      datasourceId: datasourceEl ? datasourceEl.value : dataSources[0].id,
      tableIds: getCheckedValues('.gp-form-table'),
      contentKeys: getCheckedValues('.gp-form-content'),
      qualityTableIds: getCheckedValues('.gp-quality-table')
    };

    if (state.contentKeys.indexOf('dataQuality') < 0) state.qualityTableIds = [];
    return state;
  }

  function showFormError(message) {
    var error = document.getElementById('gpFormError');
    if (error) {
      error.textContent = message;
      error.style.display = message ? 'block' : 'none';
    }
  }

  function syncQualityScope() {
    var state = collectFormState();
    var section = document.getElementById('gpQualitySection');
    var list = document.getElementById('gpQualityList');
    if (!section || !list) return;

    var showQuality = state.contentKeys.indexOf('dataQuality') >= 0;
    section.style.display = showQuality ? 'block' : 'none';
    if (!showQuality) return;

    var selectedQuality = state.qualityTableIds.filter(function (tableId) {
      return state.tableIds.indexOf(tableId) >= 0;
    });
    if (!selectedQuality.length && state.tableIds.length) selectedQuality = [state.tableIds[0]];
    list.innerHTML = renderQualityOptions(state.datasourceId, state.tableIds, selectedQuality);
  }

  function renderForm(state) {
    var formRoot = document.getElementById('gpFormView');
    var listRoot = document.getElementById('gpListView');
    if (!formRoot || !listRoot) return;

    viewMode = 'form';
    listRoot.style.display = 'none';
    formRoot.style.display = 'flex';

    var showQuality = state.contentKeys.indexOf('dataQuality') >= 0;
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
          '<div class="gp-form-grid">' +
            '<label class="gp-form-field"><span>选择数据源</span><select id="gpFormDatasource">' + renderDataSourceOptions(state.datasourceId) + '</select></label>' +
          '</div>' +
          '<div class="gp-table-select">' + renderTableOptions(state) + '</div>' +
        '</section>' +
        '<section class="gp-form-section">' +
          '<div class="gp-section-title"><i class="bi bi-check2-square"></i><span>治理内容</span></div>' +
          '<div class="gp-content-select">' + renderContentOptions(state) + '</div>' +
          '<div class="gp-quality-section" id="gpQualitySection" style="display:' + (showQuality ? 'block' : 'none') + ';">' +
            '<div class="gp-quality-title">基于治理范围配置的表，选择需要配置数据质量任务的表</div>' +
            '<div class="gp-quality-list" id="gpQualityList">' + renderQualityOptions(state.datasourceId, state.tableIds, state.qualityTableIds) + '</div>' +
          '</div>' +
        '</section>' +
        '<div class="gp-form-error" id="gpFormError" style="display:none;"></div>' +
      '</div>' +
      '<div class="gp-form-footer"><button class="btn btn-outline" type="button" data-gp-form-action="cancel">取消</button><button class="btn btn-primary" type="button" data-gp-form-action="save"><i class="bi bi-check-lg"></i> 保存</button></div>';
  }

  function showPlanForm(mode, id) {
    formMode = mode;
    editingPlanId = id || '';
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
    if (!state.contentKeys.length) {
      showFormError('请选择至少一项治理内容。');
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
        plan.contentKeys = state.contentKeys;
        plan.qualityTableIds = state.qualityTableIds;
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
        contentKeys: state.contentKeys,
        qualityTableIds: state.qualityTableIds
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

      if (e.target && e.target.id === 'gpFormDatasource') {
        var state = collectFormState();
        state.datasourceId = e.target.value;
        state.tableIds = [];
        state.qualityTableIds = [];
        renderForm(state);
        return;
      }

      if (e.target && (e.target.classList.contains('gp-form-table') || e.target.classList.contains('gp-form-content'))) {
        syncQualityScope();
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
      renderPage();
      bindEvents();
    }
  };
})();
