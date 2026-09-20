/** 数据资产 / 血缘关系。仅实现参考系统已观察到的四类对象选择、链路分析、导入和下载。 */
window.DP = window.DP || {};
DP.pages = DP.pages || {};

DP.pages.lineage = (function () {
  'use strict';

  var root;
  var state;
  var tabConfig = {
    source: {
      label: '数据源', searchPlaceholder: '表关键字搜索', objectLabel: '表',
      directories: [
        { id: 'biz', name: '业务系统', children: [
          { id: 'order', name: '订单履约系统' }, { id: 'supply', name: '供应链协同系统' }, { id: 'customer', name: '客户主数据系统' }
        ] },
        { id: 'ods', name: 'ODS-贴源层', children: [
          { id: 'ods-trade', name: '交易贴源库' }, { id: 'ods-supply', name: '供应链贴源库' }
        ] },
        { id: 'warehouse', name: '数据仓库', children: [
          { id: 'dwd', name: 'DWD-数据明细层' }, { id: 'dws', name: 'DWS-数据汇总层' }, { id: 'ads', name: 'ADS-应用层' }
        ] }
      ],
      defaultDirectory: 'order',
      objects: [
        obj('order-main', 'order_main', '订单主表', 'order', 'table'),
        obj('delivery-plan', 'delivery_plan', '交付计划表', 'order', 'table'),
        obj('order-item', 'order_item', '订单商品明细表', 'order', 'table'),
        obj('order-payment', 'order_payment', '订单支付记录表', 'order', 'table'),
        obj('order-status-log', 'order_status_log', '订单状态变更记录表', 'order', 'table'),
        obj('order-invoice', 'order_invoice', '订单开票信息表', 'order', 'table'),
        obj('delivery-address', 'delivery_address', '订单收货地址表', 'order', 'table'),
        obj('return-order', 'return_order', '订单退货申请表', 'order', 'table'),
        obj('purchase-order', 'purchase_order', '采购订单表', 'supply', 'table'),
        obj('supplier-master', 'supplier_master', '供应商主数据表', 'supply', 'table'),
        obj('purchase-item', 'purchase_order_item', '采购订单明细表', 'supply', 'table'),
        obj('supplier-contract', 'supplier_contract', '供应商合同表', 'supply', 'table'),
        obj('customer-master', 'mdm_customer', '客户主数据表', 'customer', 'table'),
        obj('customer-contact', 'mdm_customer_contact', '客户联系人表', 'customer', 'table'),
        obj('customer-address', 'mdm_customer_address', '客户地址表', 'customer', 'table'),
        obj('ods-order', 'ods_order_main', '订单主表贴源数据', 'ods-trade', 'table'),
        obj('ods-payment', 'ods_payment_record', '支付记录贴源数据', 'ods-trade', 'table'),
        obj('ods-order-item', 'ods_order_item', '订单明细贴源数据', 'ods-trade', 'table'),
        obj('ods-return', 'ods_return_order', '退货申请贴源数据', 'ods-trade', 'table'),
        obj('ods-purchase', 'ods_purchase_order', '采购订单贴源数据', 'ods-supply', 'table'),
        obj('ods-supplier', 'ods_supplier_master', '供应商主数据贴源数据', 'ods-supply', 'table'),
        obj('ods-contract', 'ods_supplier_contract', '供应商合同贴源数据', 'ods-supply', 'table'),
        obj('dwd-order', 'dwd_order_detail', '订单明细事实表', 'dwd', 'table'),
        obj('dwd-inventory', 'dwd_inventory_flow', '库存流水明细表', 'dwd', 'table'),
        obj('dwd-payment', 'dwd_order_payment', '订单支付明细表', 'dwd', 'table'),
        obj('dwd-return', 'dwd_return_detail', '退货明细事实表', 'dwd', 'table'),
        obj('dws-sales', 'dws_sales_summary_day', '销售日汇总表', 'dws', 'table'),
        obj('dws-delivery', 'dws_delivery_fulfillment_day', '履约日汇总表', 'dws', 'table'),
        obj('dws-supplier', 'dws_supplier_performance_month', '供应商绩效月汇总表', 'dws', 'table'),
        obj('ads-supply', 'ads_supply_chain_overview', '供应链经营看板表', 'ads', 'table'),
        obj('ads-order', 'ads_order_fulfillment_overview', '订单履约看板表', 'ads', 'table')
      ]
    },
    project: {
      label: '项目', searchPlaceholder: '表关键字搜索', objectLabel: '表',
      projects: ['数据中台建设项目', '供应链治理项目'], environments: ['开发环境', '测试环境', '生产环境'],
      directories: [
        { id: 'project-ods', name: 'ODS-贴源层' }, { id: 'project-dwd', name: 'DWD-数据明细层' },
        { id: 'project-dws', name: 'DWS-数据汇总层' }, { id: 'project-ads', name: 'ADS-应用层' },
        { id: 'project-biz', name: '业务系统' }
      ],
      defaultDirectory: 'project-dwd',
      objects: [
        obj('p-ods-order', 'ods_order_main', '订单贴源表', 'project-ods', 'table'),
        obj('p-ods-payment', 'ods_order_payment', '订单支付贴源表', 'project-ods', 'table'),
        obj('p-ods-supplier', 'ods_supplier_master', '供应商主数据贴源表', 'project-ods', 'table'),
        obj('p-dwd-order', 'dwd_order_detail', '订单明细事实表', 'project-dwd', 'table'),
        obj('p-dwd-delivery', 'dwd_delivery_detail', '履约明细事实表', 'project-dwd', 'table'),
        obj('p-dwd-payment', 'dwd_order_payment', '订单支付明细表', 'project-dwd', 'table'),
        obj('p-dwd-item', 'dwd_order_item', '订单商品明细表', 'project-dwd', 'table'),
        obj('p-dwd-customer-wide', 'dwd_customer_order_wide', '客户订单宽表', 'project-dwd', 'table'),
        obj('p-dwd-return', 'dwd_return_detail', '退货明细事实表', 'project-dwd', 'table'),
        obj('p-dwd-inventory', 'dwd_inventory_flow', '库存流水明细表', 'project-dwd', 'table'),
        obj('p-dws-operation', 'dws_operation_summary_day', '经营日汇总表', 'project-dws', 'table'),
        obj('p-dws-delivery', 'dws_delivery_summary_day', '履约日汇总表', 'project-dws', 'table'),
        obj('p-ads-overview', 'ads_operation_overview', '经营驾驶舱指标表', 'project-ads', 'table'),
        obj('p-ads-supply', 'ads_supply_chain_overview', '供应链运营看板表', 'project-ads', 'table'),
        obj('p-biz-order', 'order_main', '订单履约系统订单表', 'project-biz', 'table'),
        obj('p-biz-supplier', 'supplier_master', '供应链系统供应商表', 'project-biz', 'table')
      ]
    },
    analysis: {
      label: '数据分析', searchPlaceholder: '指标关键字搜索', objectLabel: '分析对象',
      types: ['指标', '数据集', '仪表盘', '数据洞察', '指标洞察'],
      directories: [
        { id: 'ana-operation', name: '经营分析' }, { id: 'ana-supply', name: '供应链分析' }, { id: 'ana-customer', name: '客户分析' }
      ],
      defaultDirectory: 'ana-operation',
      objects: [
        obj('metric-revenue', '营业收入', '指标 / 日粒度', 'ana-operation', 'analysis', '指标'),
        obj('metric-profit', '毛利率', '指标 / 日粒度', 'ana-operation', 'analysis', '指标'),
        obj('metric-order-count', '订单数', '指标 / 日粒度', 'ana-operation', 'analysis', '指标'),
        obj('metric-order-value', '客单价', '指标 / 日粒度', 'ana-operation', 'analysis', '指标'),
        obj('metric-receivable', '回款金额', '指标 / 日粒度', 'ana-operation', 'analysis', '指标'),
        obj('metric-operation-profit', '经营利润', '指标 / 月粒度', 'ana-operation', 'analysis', '指标'),
        obj('metric-budget-rate', '预算达成率', '指标 / 月粒度', 'ana-operation', 'analysis', '指标'),
        obj('metric-growth-rate', '营业收入同比增长率', '指标 / 月粒度', 'ana-operation', 'analysis', '指标'),
        obj('dataset-operation', '经营日报数据集', '数据集 / 经营主题', 'ana-operation', 'analysis', '数据集'),
        obj('dataset-budget', '预算执行数据集', '数据集 / 经营主题', 'ana-operation', 'analysis', '数据集'),
        obj('dashboard-operation', '经营驾驶舱', '仪表盘 / 经营主题', 'ana-operation', 'analysis', '仪表盘'),
        obj('dashboard-finance', '经营财务分析看板', '仪表盘 / 经营主题', 'ana-operation', 'analysis', '仪表盘'),
        obj('insight-revenue', '收入趋势洞察', '数据洞察 / 经营主题', 'ana-operation', 'analysis', '数据洞察'),
        obj('insight-order', '订单结构洞察', '数据洞察 / 经营主题', 'ana-operation', 'analysis', '数据洞察'),
        obj('indicator-insight-profit', '毛利异常洞察', '指标洞察 / 毛利率', 'ana-operation', 'analysis', '指标洞察'),
        obj('indicator-insight-budget', '预算偏差洞察', '指标洞察 / 预算达成率', 'ana-operation', 'analysis', '指标洞察'),
        obj('metric-delivery', '订单按期交付率', '指标 / 日粒度', 'ana-supply', 'analysis', '指标'),
        obj('metric-turnover', '库存周转天数', '指标 / 月粒度', 'ana-supply', 'analysis', '指标'),
        obj('dataset-supply', '供应链运营数据集', '数据集 / 供应链主题', 'ana-supply', 'analysis', '数据集'),
        obj('dashboard-supply', '供应链运营看板', '仪表盘 / 供应链主题', 'ana-supply', 'analysis', '仪表盘'),
        obj('insight-delivery', '履约趋势洞察', '数据洞察 / 供应链主题', 'ana-supply', 'analysis', '数据洞察'),
        obj('indicator-insight-turnover', '周转效率洞察', '指标洞察 / 库存周转天数', 'ana-supply', 'analysis', '指标洞察'),
        obj('metric-customer', '有效客户数', '指标 / 月粒度', 'ana-customer', 'analysis', '指标'),
        obj('metric-repeat', '客户复购率', '指标 / 月粒度', 'ana-customer', 'analysis', '指标'),
        obj('dataset-customer', '客户经营数据集', '数据集 / 客户主题', 'ana-customer', 'analysis', '数据集'),
        obj('dashboard-customer', '客户经营看板', '仪表盘 / 客户主题', 'ana-customer', 'analysis', '仪表盘')
      ]
    },
    interface: {
      label: '接口', searchPlaceholder: '接口关键字搜索', objectLabel: '接口',
      directories: [
        { id: 'api-order', name: '订单服务' }, { id: 'api-supply', name: '供应链服务' }, { id: 'api-customer', name: '客户服务' }
      ],
      defaultDirectory: 'api-order',
      objects: [
        obj('api-order-detail', '/api/order/detail', '订单详情查询接口', 'api-order', 'api'),
        obj('api-order-track', '/api/order/track', '订单履约跟踪接口', 'api-order', 'api'),
        obj('api-order-list', '/api/order/list', '订单列表查询接口', 'api-order', 'api'),
        obj('api-order-status', '/api/order/status', '订单状态查询接口', 'api-order', 'api'),
        obj('api-order-payment', '/api/order/payment', '订单支付信息接口', 'api-order', 'api'),
        obj('api-order-delivery', '/api/order/delivery', '订单配送信息接口', 'api-order', 'api'),
        obj('api-order-cancel', '/api/order/cancel', '订单取消服务接口', 'api-order', 'api'),
        obj('api-order-return', '/api/order/return', '订单退货查询接口', 'api-order', 'api'),
        obj('api-supplier-profile', '/api/supplier/profile', '供应商画像接口', 'api-supply', 'api'),
        obj('api-inventory-status', '/api/inventory/status', '库存状态查询接口', 'api-supply', 'api'),
        obj('api-purchase-detail', '/api/purchase/detail', '采购订单详情接口', 'api-supply', 'api'),
        obj('api-supplier-score', '/api/supplier/score', '供应商绩效查询接口', 'api-supply', 'api'),
        obj('api-customer-profile', '/api/customer/profile', '客户画像接口', 'api-customer', 'api'),
        obj('api-customer-orders', '/api/customer/orders', '客户订单查询接口', 'api-customer', 'api'),
        obj('api-customer-level', '/api/customer/level', '客户等级查询接口', 'api-customer', 'api')
      ]
    }
  };

  var nodeTypeConfig = {
    table: { label: '表', icon: 'table' },
    interface: { label: '接口', icon: 'link-45deg' },
    dataset: { label: '数据集', icon: 'grid' },
    metric: { label: '指标', icon: 'bar-chart-line' },
    dashboard: { label: '仪表盘', icon: 'speedometer2' },
    metricInsight: { label: '指标洞察', icon: 'file-earmark-bar-graph' },
    dataInsight: { label: '数据洞察', icon: 'graph-up-arrow' }
  };
  var legendTypeOrder = ['table', 'interface', 'dataset', 'metric', 'dashboard', 'metricInsight', 'dataInsight'];

  function obj(id, name, meta, directoryId, kind, subtype) { return { id: id, name: name, meta: meta, directoryId: directoryId, kind: kind, subtype: subtype || '' }; }
  function esc(value) { return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function objectTypeKey(item) {
    if (item.kind === 'api') return 'interface';
    if (item.kind !== 'analysis') return 'table';
    return { '指标': 'metric', '数据集': 'dataset', '仪表盘': 'dashboard', '指标洞察': 'metricInsight', '数据洞察': 'dataInsight' }[item.subtype] || 'metric';
  }
  function typeIcon(typeKey) { return (nodeTypeConfig[typeKey] || nodeTypeConfig.table).icon; }
  function getConfig() { return tabConfig[state.activeTab]; }
  function directoryName(config, id) {
    var found = '';
    (config.directories || []).some(function (group) {
      if (group.id === id) { found = group.name; return true; }
      return (group.children || []).some(function (child) { if (child.id === id) { found = child.name; return true; } return false; });
    });
    return found;
  }
  function initialState() {
    var directoryByTab = {};
    Object.keys(tabConfig).forEach(function (key) { directoryByTab[key] = tabConfig[key].defaultDirectory; });
    return { activeTab: 'source', directoryByTab: directoryByTab, directoryOpen: false, selectedListId: '', selectedObject: null, keywordDraft: '', keywordApplied: '', direction: 'all', depth: '5', modal: '', notice: null, project: '数据中台建设项目', environment: '开发环境', analysisType: '指标', importMode: '重复覆盖', importFile: '', history: [], fieldNodeId: '', canvasViews: { main: { scale: 1, x: 0, y: 0 }, field: { scale: 1, x: 0, y: 0 } }, nodePositions: {}, fieldPositions: { source: { x: 120, y: 70 }, target: { x: 650, y: 70 } } };
  }

  function render() {
    var config = getConfig();
    root.innerHTML = '<section class="page-lineage">' + renderSide(config) + '<main class="ln-main">' + (state.selectedObject ? renderAnalysis() : renderEmpty()) + renderModal() + renderNotice() + '</main></section>';
    scheduleCanvasSync();
  }
  function renderSide(config) {
    return '<aside class="ln-side">' +
      '<div class="ln-tabs">' + Object.keys(tabConfig).map(function (key) { return '<button class="ln-tab ' + (state.activeTab === key ? 'active' : '') + '" type="button" data-ln-action="tab" data-value="' + key + '">' + tabConfig[key].label + '</button>'; }).join('') + '</div>' +
      '<div class="ln-side-body"><div class="ln-select-stack">' + renderContextControls(config) + renderDirectory(config) + '</div>' +
      '<div class="ln-search-row"><input type="text" data-ln-object-search value="' + esc(state.keywordDraft) + '" placeholder="' + esc(config.searchPlaceholder) + '"><button class="btn btn-outline" type="button" data-ln-action="apply-search" title="查询"><i class="bi bi-search"></i></button></div>' +
      renderObjectList(config) + '<div class="ln-object-hint">单击选择，双击查看血缘关系</div></div></aside>';
  }
  function renderContextControls(config) {
    if (state.activeTab === 'project') {
      return '<select class="ln-control" data-ln-context="project">' + config.projects.map(function (item) { return '<option' + (state.project === item ? ' selected' : '') + '>' + esc(item) + '</option>'; }).join('') + '</select>' +
        '<select class="ln-control" data-ln-context="environment">' + config.environments.map(function (item) { return '<option' + (state.environment === item ? ' selected' : '') + '>' + esc(item) + '</option>'; }).join('') + '</select>';
    }
    if (state.activeTab === 'analysis') {
      return '<select class="ln-control" data-ln-context="analysisType">' + config.types.map(function (item) { return '<option' + (state.analysisType === item ? ' selected' : '') + '>' + esc(item) + '</option>'; }).join('') + '</select>';
    }
    return '';
  }
  function renderDirectory(config) {
    var selectedId = state.directoryByTab[state.activeTab];
    return '<div class="ln-dir-wrap"><button class="ln-dir-trigger" type="button" data-ln-action="toggle-directory"><span>' + esc(directoryName(config, selectedId) || '请选择目录') + '</span><i class="bi bi-chevron-down"></i></button>' +
      (state.directoryOpen ? '<div class="ln-tree-pop"><div class="ln-tree-query"><input type="text" data-ln-tree-search placeholder="搜索目录名称"><button class="btn btn-outline" type="button" data-ln-action="focus-tree-search" title="搜索"><i class="bi bi-search"></i></button></div><div class="ln-tree-list" data-ln-tree-list>' + config.directories.map(function (group) { return renderTreeGroup(group, selectedId); }).join('') + '<div class="ln-tree-empty" hidden data-ln-tree-empty>无匹配目录</div></div></div>' : '') + '</div>';
  }
  function renderTreeGroup(group, selectedId) {
    var children = group.children || [];
    if (!children.length) return '<div class="ln-tree-group" data-ln-tree-group data-search="' + esc(group.name.toLowerCase()) + '"><button class="ln-tree-leaf ' + (selectedId === group.id ? 'active' : '') + '" type="button" data-ln-action="select-directory" data-value="' + esc(group.id) + '"><i class="bi bi-layers"></i><span>' + esc(group.name) + '</span></button></div>';
    return '<div class="ln-tree-group" data-ln-tree-group data-search="' + esc((group.name + ' ' + children.map(function (x) { return x.name; }).join(' ')).toLowerCase()) + '"><div class="ln-tree-parent"><i class="bi bi-chevron-down"></i><i class="bi bi-layers"></i><span>' + esc(group.name) + '</span></div><div class="ln-tree-children">' + children.map(function (child) { return '<button class="ln-tree-leaf ' + (selectedId === child.id ? 'active' : '') + '" type="button" data-ln-action="select-directory" data-value="' + esc(child.id) + '" data-search="' + esc((group.name + ' ' + child.name).toLowerCase()) + '"><i class="bi bi-database"></i><span>' + esc(child.name) + '</span></button>'; }).join('') + '</div></div>';
  }
  function renderObjectList(config) {
    var directoryId = state.directoryByTab[state.activeTab];
    var keyword = state.keywordApplied.toLowerCase();
    var items = config.objects.filter(function (item) {
      if (item.directoryId !== directoryId) return false;
      if (state.activeTab === 'analysis' && item.subtype !== state.analysisType) return false;
      return !keyword || (item.name + ' ' + item.meta).toLowerCase().indexOf(keyword) >= 0;
    });
    if (!items.length) return '<div class="ln-object-list"><div class="ln-object-empty"><i class="bi bi-inbox"></i><p>暂无匹配的' + esc(config.objectLabel) + '</p></div></div>';
    return '<div class="ln-object-list">' + items.map(function (item) { return '<button type="button" class="ln-object-item ' + (state.selectedListId === item.id ? 'active' : '') + '" data-ln-object="' + esc(item.id) + '"><i class="bi bi-' + typeIcon(objectTypeKey(item)) + '"></i><span><strong>' + esc(item.name) + '</strong><small>' + esc(item.meta) + '</small></span></button>'; }).join('') + '</div>';
  }
  function renderEmpty() {
    return '<div class="ln-empty"><div class="ln-empty-visual"><div class="ln-empty-illustration"><div class="ln-empty-dots"><i></i><i></i><i></i></div><div class="ln-empty-flow"><div class="ln-empty-card"><i class="bi bi-database"></i></div><i class="bi bi-arrow-right"></i><div class="ln-empty-card"><i class="bi bi-diagram-3"></i></div><i class="bi bi-arrow-right"></i><div class="ln-empty-card"><i class="bi bi-window-sidebar"></i></div></div></div><h2>血缘关系</h2><p>请选择需要分析的对象，双击进行分析，查看上下游的影响关系</p></div></div>';
  }

  function graphData(item) {
    if (item.kind === 'analysis') return analysisGraph(item);
    if (item.kind === 'api') return apiGraph(item);
    return tableGraph(item);
  }
  function tableGraph(item) {
    return { nodes: [
      node('u3', 'purchase_order', '供应链协同系统 / 采购订单', -2, 40, 80, 'table'),
      node('u2', 'ods_purchase_order', 'ODS贴源层 / 采购订单', -1, 330, 80, 'table'),
      node('u1', 'ods_supplier_master', 'ODS贴源层 / 供应商主数据', -1, 330, 300, 'table'),
      node('cur', item.name, item.meta, 0, 650, 190, objectTypeKey(item)),
      node('d1', 'dws_purchase_execution_day', 'DWS汇总层 / 采购履约日汇总', 1, 970, 80, 'table'),
      node('d2', 'dwd_supplier_order_wide', 'DWD明细层 / 供应商订单宽表', 1, 970, 300, 'table'),
      node('d3', 'ads_supply_chain_overview', 'ADS应用层 / 供应链看板', 2, 1240, 80, 'dashboard'),
      node('d4', '/api/supplier/profile', '数据服务 / 供应商画像接口', 2, 1240, 300, 'interface')
    ], edges: [edge('u3','u2','订单采集'), edge('u2','cur','明细加工'), edge('u1','cur','供应商补全'), edge('cur','d1','汇总加工'), edge('cur','d2','宽表加工'), edge('d1','d3','指标发布'), edge('d2','d4','接口发布')] };
  }
  function analysisGraph(item) {
    return { nodes: [
      node('u3', 'order_main', '订单履约系统 / 订单主表', -2, 40, 80, 'table'),
      node('u4', 'delivery_plan', '订单履约系统 / 交付计划表', -2, 40, 300, 'table'),
      node('u1', 'dwd_order_detail', 'DWD明细层 / 订单明细事实表', -1, 330, 80, 'table'),
      node('u2', 'dwd_delivery_detail', 'DWD明细层 / 履约明细事实表', -1, 330, 300, 'table'),
      node('cur', item.name, item.meta, 0, 650, 190, objectTypeKey(item)),
      node('d1', '供应链经营驾驶舱', '仪表盘 / 经营分析', 1, 970, 80, 'dashboard'),
      node('d2', '采购履约月报', '数据集 / 管理报表', 1, 970, 300, 'dataset'),
      node('d3', '/api/indicator/value', '数据服务 / 指标查询接口', 2, 1240, 190, 'interface')
    ], edges: [edge('u3','u1','订单采集'), edge('u4','u2','计划采集'), edge('u1','cur','指标计算'), edge('u2','cur','履约补全'), edge('cur','d1','看板引用'), edge('cur','d2','报表引用'), edge('d1','d3','服务发布')] };
  }
  function apiGraph(item) {
    return { nodes: [
      node('u3', 'ods_order_main', 'ODS贴源层 / 订单主表', -2, 40, 80, 'table'),
      node('u4', 'ods_customer_master', 'ODS贴源层 / 客户主数据', -2, 40, 300, 'table'),
      node('u1', 'dwd_order_detail', 'DWD明细层 / 订单明细事实表', -1, 330, 80, 'table'),
      node('u2', 'dwd_customer_profile', 'DWD明细层 / 客户画像宽表', -1, 330, 300, 'table'),
      node('cur', item.name, item.meta, 0, 650, 190, 'interface'),
      node('d1', '供应链门户', '应用系统 / 业务门户', 1, 970, 80, 'dashboard'),
      node('d2', '经营分析看板', '分析应用 / 经营驾驶舱', 1, 970, 300, 'dashboard'),
      node('d3', '运营监控任务', '运维监控 / 服务调用', 2, 1240, 190, 'dataInsight')
    ], edges: [edge('u3','u1','订单加工'), edge('u4','u2','客户加工'), edge('u1','cur','接口取数'), edge('u2','cur','画像补全'), edge('cur','d1','门户调用'), edge('cur','d2','看板调用'), edge('d1','d3','调用监控')] };
  }
  function node(id, name, meta, level, x, y, typeKey) { return { id: id, name: name, meta: meta, level: level, x: x, y: y, type: typeKey, icon: typeIcon(typeKey) }; }
  function edge(from, to, label) { return { from: from, to: to, label: label }; }
  function visibleGraph() {
    var graph = graphData(state.selectedObject);
    var depth = state.depth === 'all' ? 99 : Number(state.depth);
    var nodes = graph.nodes.filter(function (n) {
      if (n.level === 0) return true;
      if (Math.abs(n.level) > depth) return false;
      return state.direction === 'all' || (state.direction === 'up' && n.level < 0) || (state.direction === 'down' && n.level > 0);
    }).map(function (n) {
      var saved = state.nodePositions[state.selectedObject.id] && state.nodePositions[state.selectedObject.id][n.id];
      return Object.assign({}, n, saved || {});
    });
    var ids = nodes.map(function (n) { return n.id; });
    return { nodes: nodes, edges: graph.edges.filter(function (e) { return ids.indexOf(e.from) >= 0 && ids.indexOf(e.to) >= 0; }) };
  }
  function renderAnalysis() {
    var graph = visibleGraph();
    return '<div class="ln-toolbar"><span class="ln-toolbar-title">链路分析</span><div class="ln-radio-group">' + [['all','全部'],['up','上游'],['down','下游']].map(function (item) { return '<label><input type="radio" name="lnDirection" value="' + item[0] + '" data-ln-direction' + (state.direction === item[0] ? ' checked' : '') + '><span>' + item[1] + '</span></label>'; }).join('') + '</div>' +
      '<label class="ln-depth"><span>分析深度</span><select data-ln-depth>' + ['1','2','3','4','5','all'].map(function (value) { return '<option value="' + value + '"' + (state.depth === value ? ' selected' : '') + '>' + (value === 'all' ? '全部' : value) + '</option>'; }).join('') + '</select></label>' +
      '<div class="ln-toolbar-actions"><button class="btn btn-primary" type="button" data-ln-action="open-import"><i class="bi bi-upload"></i><span>导入</span></button><button class="btn btn-primary" type="button" data-ln-action="download-image"><i class="bi bi-download"></i><span>下载图片</span></button></div></div>' +
      '<div class="ln-graph-head"><strong>' + esc(state.selectedObject.name) + ' 血缘关系</strong><span>双击表节点查看字段级血缘关系</span></div>' +
      renderCanvas('main', graph, renderEdges(graph) + graph.nodes.map(renderNode).join(''));
  }
  function renderCanvas(context, graph, content) {
    var view = state.canvasViews[context];
    return '<div class="ln-canvas-wrap"><div class="ln-canvas-tip"><i class="bi bi-arrows-move"></i><span>拖动画布 · Ctrl + 滚轮缩放 · 节点可拖动</span></div>' +
      '<div class="ln-graph-scroll ln-canvas-viewport" data-ln-viewport="' + context + '"><div class="ln-graph-canvas ln-canvas-world" data-ln-world="' + context + '" style="transform:translate(' + view.x + 'px,' + view.y + 'px) scale(' + view.scale + ')">' + content + '</div>' +
      (context === 'main' ? renderLegend() + '<div class="ln-hover-popover" data-ln-hover-popover hidden></div>' : '') + renderMiniMap(context, graph.nodes) + '<div class="ln-canvas-tools"><button type="button" data-ln-action="zoom-out" data-ln-context="' + context + '" title="缩小"><i class="bi bi-dash-lg"></i></button><button type="button" class="ln-zoom-value" data-ln-action="zoom-reset" data-ln-context="' + context + '" data-ln-zoom-label="' + context + '">' + Math.round(view.scale * 100) + '%</button><button type="button" data-ln-action="zoom-in" data-ln-context="' + context + '" title="放大"><i class="bi bi-plus-lg"></i></button><button type="button" data-ln-action="fit-canvas" data-ln-context="' + context + '" title="适应画布"><i class="bi bi-arrows-fullscreen"></i></button></div></div></div>';
  }
  function renderLegend() {
    return '<div class="ln-legend" aria-label="对象类型图例">' + legendTypeOrder.map(function (typeKey) {
      var config = nodeTypeConfig[typeKey];
      return '<span data-ln-legend-type="' + typeKey + '"><i class="bi bi-' + config.icon + '"></i>' + config.label + '</span>';
    }).join('') + '</div>';
  }
  function renderMiniMap(context, nodes) {
    var size = canvasSize(context);
    return '<div class="ln-minimap" data-ln-minimap="' + context + '" title="画布缩略图"><div class="ln-mini-world">' + nodes.map(function (n) { return '<i class="' + (n.level === 0 ? 'current' : (n.level > 0 ? 'output' : '')) + '" data-ln-mini-node="' + esc(n.id) + '" style="left:' + (n.x / size.width * 100) + '%;top:' + (n.y / size.height * 100) + '%"></i>'; }).join('') + '</div><span class="ln-mini-viewport" data-ln-mini-viewport="' + context + '"></span></div>';
  }
  function renderEdges(graph) {
    var map = {};
    graph.nodes.forEach(function (n) { map[n.id] = n; });
    return '<svg class="ln-graph-svg" viewBox="0 0 1450 560" aria-hidden="true"><defs><marker id="lnArrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M1,1 L8,5 L1,9" fill="none" stroke="#68acec" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path></marker><marker id="lnArrowHover" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M1,1 L8,5 L1,9" fill="none" stroke="#f26b00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></marker></defs>' + graph.edges.map(function (e) { var a = map[e.from], b = map[e.to], x1 = a.x + 190, y1 = a.y + 34, x2 = b.x, y2 = b.y + 34, mid = (x1 + x2) / 2, labelY = ((y1 + y2) / 2) - 9; return '<path data-ln-edge-from="' + e.from + '" data-ln-edge-to="' + e.to + '" d="M' + x1 + ' ' + y1 + ' C' + mid + ' ' + y1 + ' ' + mid + ' ' + y2 + ' ' + x2 + ' ' + y2 + '"></path><g class="ln-edge-label-hit" data-ln-edge-label="' + e.from + '-' + e.to + '" data-ln-edge-from="' + e.from + '" data-ln-edge-to="' + e.to + '"><rect x="' + (mid - 75) + '" y="' + (labelY - 15) + '" width="150" height="22" rx="4"></rect><text x="' + mid + '" y="' + labelY + '" text-anchor="middle">' + esc(e.label) + '</text></g>'; }).join('') + '</svg>';
  }
  function renderNode(n) {
    return '<button type="button" class="ln-node ' + (n.level === 0 ? 'current' : (n.level > 0 ? 'output' : '')) + '" style="left:' + n.x + 'px;top:' + n.y + 'px" data-ln-node="' + esc(n.id) + '" data-ln-node-type="' + esc(n.type) + '"><i class="bi bi-' + esc(n.icon) + '"></i><span><strong>' + esc(n.name) + '</strong><small>' + esc(n.meta) + '</small></span></button>';
  }

  function renderModal() {
    if (state.modal === 'import') return renderImportModal();
    if (state.modal === 'history') return renderHistoryModal();
    if (state.modal === 'field') return renderFieldModal();
    return '';
  }
  function modalShell(title, body, footer, wide) {
    return '<div class="ln-modal-mask" data-ln-modal-mask><section class="ln-modal ' + (wide ? 'ln-modal-wide' : '') + '" role="dialog" aria-modal="true" aria-label="' + esc(title) + '"><header class="ln-modal-head"><h3>' + esc(title) + '</h3><button class="ln-modal-close" type="button" data-ln-action="close-modal" title="关闭"><i class="bi bi-x-lg"></i></button></header><div class="ln-modal-body">' + body + '</div>' + (footer || '') + '</section></div>';
  }
  function renderImportModal() {
    var body = '<div class="ln-form-row"><label><span class="ln-required">*</span> 覆盖机制</label><div class="ln-import-line"><select class="ln-form-control" data-ln-import-mode><option' + (state.importMode === '重复覆盖' ? ' selected' : '') + '>重复覆盖</option><option' + (state.importMode === '重复跳过' ? ' selected' : '') + '>重复跳过</option><button class="btn btn-outline" type="button" data-ln-action="open-history"><i class="bi bi-clock-history"></i><span>导入历史</span></button></div></div>' +
      '<div class="ln-form-row"><label><span class="ln-required">*</span> 导入数据</label><div><div class="ln-import-line"><input type="file" accept=".xls,.xlsx" data-ln-import-file><button class="btn btn-outline" type="button" data-ln-action="download-template"><i class="bi bi-download"></i><span>下载模板</span></button></div><small class="ln-form-note">文件格式为 Excel，大小不超过 50M</small></div></div>';
    var footer = '<footer class="ln-modal-footer"><button class="btn btn-outline" type="button" data-ln-action="close-modal"><i class="bi bi-x-circle"></i><span>取消</span></button><button class="btn btn-primary" type="button" data-ln-action="confirm-import"><i class="bi bi-check-circle"></i><span>确定</span></button></footer>';
    return modalShell('导入', body, footer, false);
  }
  function renderHistoryModal() {
    var rows = state.history.length ? state.history.map(function (item) { return '<tr><td>' + esc(item.file) + '</td><td>' + esc(item.mode) + '</td><td class="ln-status-success">导入成功</td><td>' + esc(item.time) + '</td></tr>'; }).join('') : '<tr><td colspan="4" style="text-align:center;color:#9aa5b1;">暂无导入记录</td></tr>';
    var body = '<table class="ln-history-table"><thead><tr><th>文件名称</th><th>覆盖机制</th><th>导入结果</th><th>导入时间</th></tr></thead><tbody>' + rows + '</tbody></table>';
    var footer = '<footer class="ln-modal-footer"><button class="btn btn-outline" type="button" data-ln-action="close-modal"><i class="bi bi-x-circle"></i><span>关闭</span></button></footer>';
    return modalShell('导入历史', body, footer, false);
  }
  function renderFieldModal() {
    var data = fieldGraphData();
    var fieldNodes = [
      { id: 'source', x: state.fieldPositions.source.x, y: state.fieldPositions.source.y, level: -1 },
      { id: 'target', x: state.fieldPositions.target.x, y: state.fieldPositions.target.y, level: 1 }
    ];
    var body = '<div class="ln-field-canvas">' + renderCanvas('field', { nodes: fieldNodes }, renderFieldEdges(data) + renderFieldTable('source', data.source) + renderFieldTable('target', data.target)) + '</div>';
    return modalShell('字段级血缘关系', body, '', true);
  }
  function fieldGraphData() {
    var graph = visibleGraph();
    var selected = graph.nodes.find(function (n) { return n.id === state.fieldNodeId; }) || graph.nodes.find(function (n) { return n.id === 'cur'; }) || graph.nodes[0];
    var downstream = graph.edges.find(function (e) { return e.from === selected.id; });
    var targetNode = downstream && graph.nodes.find(function (n) { return n.id === downstream.to; });
    if (!targetNode) {
      var upstream = graph.edges.find(function (e) { return e.to === selected.id; });
      targetNode = upstream && graph.nodes.find(function (n) { return n.id === upstream.from; });
    }
    var sourceName = selected ? selected.name : state.selectedObject.name;
    var targetName = targetNode ? targetNode.name : 'dws_purchase_execution_day';
    return {
      source: { name: sourceName, alias: selected ? selected.meta : state.selectedObject.meta, tone: 'source', fields: [
        ['order_id', 'varchar', '订单编号'], ['supplier_id', 'varchar', '供应商编号'], ['order_status', 'varchar', '订单状态'], ['purchase_amount', 'decimal', '采购金额'], ['order_time', 'datetime', '下单时间'], ['update_time', 'datetime', '更新时间']
      ] },
      target: { name: targetName, alias: targetNode ? targetNode.meta : 'DWS汇总层 / 采购履约日汇总', tone: 'target', fields: [
        ['order_id', 'varchar', '订单编号'], ['supplier_id', 'varchar', '供应商编号'], ['order_status', 'varchar', '订单状态'], ['purchase_amount', 'decimal', '采购金额'], ['order_time', 'datetime', '下单时间'], ['update_time', 'datetime', '更新时间']
      ] }
    };
  }
  function renderFieldTable(id, table) {
    var position = state.fieldPositions[id];
    return '<section class="ln-field-table ' + table.tone + '" data-ln-field-node="' + id + '" style="left:' + position.x + 'px;top:' + position.y + 'px"><header><strong>' + esc(table.name) + '</strong><small>' + esc(table.alias) + '</small></header><div class="ln-field-labels"><span>英文名</span><span>数据类型</span><span>注释</span></div><ul>' + table.fields.map(function (field, index) { return '<li data-ln-field-row="' + index + '"><span>' + esc(field[0]) + '</span><span>' + esc(field[1]) + '</span><span>' + esc(field[2]) + '</span></li>'; }).join('') + '</ul></section>';
  }
  function renderFieldEdges(data) {
    var a = state.fieldPositions.source, b = state.fieldPositions.target;
    return '<svg class="ln-field-svg" viewBox="0 0 1320 620" aria-hidden="true"><defs><marker id="lnFieldArrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M1,1 L8,5 L1,9" fill="none" stroke="#1687ff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path></marker></defs>' + data.source.fields.map(function (_, index) { var y1 = a.y + 100 + index * 32, y2 = b.y + 100 + index * 32, x1 = a.x + 360, x2 = b.x, mid = (x1 + x2) / 2; return '<path data-ln-field-edge="' + index + '" d="M' + x1 + ' ' + y1 + ' C' + mid + ' ' + y1 + ' ' + mid + ' ' + y2 + ' ' + x2 + ' ' + y2 + '"></path><circle data-ln-field-dot="source-' + index + '" cx="' + x1 + '" cy="' + y1 + '" r="4"></circle>'; }).join('') + '</svg>';
  }
  function renderNotice() {
    return state.notice ? '<div class="ln-toast ' + (state.notice.tone === 'error' ? 'error' : '') + '" role="status"><i class="bi bi-' + (state.notice.tone === 'error' ? 'exclamation-circle' : 'check-circle') + '"></i><span>' + esc(state.notice.text) + '</span></div>' : '';
  }

  var dragState = null;
  var resetPending = { main: false, field: false };
  function canvasSize(context) { return context === 'field' ? { width: 1320, height: 620 } : { width: 1450, height: 560 }; }
  function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
  function scheduleCanvasSync() {
    window.requestAnimationFrame(function () {
      ['main', 'field'].forEach(function (context) {
        if (!root || !root.querySelector('[data-ln-viewport="' + context + '"]')) return;
        if (resetPending[context]) { resetPending[context] = false; resetCanvas(context); }
        else applyCanvasView(context);
      });
    });
  }
  function applyCanvasView(context) {
    var world = root.querySelector('[data-ln-world="' + context + '"]');
    var viewport = root.querySelector('[data-ln-viewport="' + context + '"]');
    if (!world || !viewport) return;
    var view = state.canvasViews[context];
    world.style.transform = 'translate(' + view.x + 'px,' + view.y + 'px) scale(' + view.scale + ')';
    var label = root.querySelector('[data-ln-zoom-label="' + context + '"]');
    if (label) label.textContent = Math.round(view.scale * 100) + '%';
    updateMiniMap(context);
  }
  function fitCanvas(context) {
    var viewport = root.querySelector('[data-ln-viewport="' + context + '"]');
    if (!viewport) return;
    var size = canvasSize(context);
    var scale = clamp(Math.min((viewport.clientWidth - 54) / size.width, (viewport.clientHeight - 54) / size.height), 0.48, 1.15);
    state.canvasViews[context] = { scale: scale, x: Math.max(20, (viewport.clientWidth - size.width * scale) / 2), y: Math.max(20, (viewport.clientHeight - size.height * scale) / 2) };
    applyCanvasView(context);
  }
  function resetCanvas(context) {
    var viewport = root.querySelector('[data-ln-viewport="' + context + '"]');
    if (!viewport) return;
    var size = canvasSize(context);
    state.canvasViews[context] = { scale: 1, x: (viewport.clientWidth - size.width) / 2, y: Math.max(20, (viewport.clientHeight - size.height) / 2) };
    applyCanvasView(context);
  }
  function zoomCanvas(context, factor, clientX, clientY) {
    var viewport = root.querySelector('[data-ln-viewport="' + context + '"]');
    if (!viewport) return;
    var rect = viewport.getBoundingClientRect();
    var view = state.canvasViews[context];
    var nextScale = clamp(view.scale * factor, 0.4, 1.8);
    var px = (clientX == null ? rect.left + rect.width / 2 : clientX) - rect.left;
    var py = (clientY == null ? rect.top + rect.height / 2 : clientY) - rect.top;
    var worldX = (px - view.x) / view.scale;
    var worldY = (py - view.y) / view.scale;
    view.x = px - worldX * nextScale;
    view.y = py - worldY * nextScale;
    view.scale = nextScale;
    applyCanvasView(context);
  }
  function nodeDragBounds(context, nodeWidth, nodeHeight) {
    var viewport = root.querySelector('[data-ln-viewport="' + context + '"]');
    var size = canvasSize(context), view = state.canvasViews[context];
    if (!viewport) return { minX: 0, maxX: size.width - nodeWidth, minY: 0, maxY: size.height - nodeHeight };
    var padding = 16 / view.scale;
    var visibleLeft = -view.x / view.scale;
    var visibleTop = -view.y / view.scale;
    var visibleRight = (viewport.clientWidth - view.x) / view.scale;
    var visibleBottom = (viewport.clientHeight - view.y) / view.scale;
    return {
      minX: Math.min(0, visibleLeft + padding),
      maxX: Math.max(size.width - nodeWidth, visibleRight - nodeWidth - padding),
      minY: Math.min(0, visibleTop + padding),
      maxY: Math.max(size.height - nodeHeight, visibleBottom - nodeHeight - padding)
    };
  }
  function updateMiniNode(miniNode, x, y, size) {
    if (!miniNode) return;
    miniNode.style.left = clamp(x / size.width * 100, 0, 96) + '%';
    miniNode.style.top = clamp(y / size.height * 100, 0, 90) + '%';
  }
  function updateMiniMap(context) {
    var mini = root.querySelector('[data-ln-minimap="' + context + '"]');
    var viewport = root.querySelector('[data-ln-viewport="' + context + '"]');
    if (!mini || !viewport) return;
    var size = canvasSize(context), view = state.canvasViews[context];
    var miniViewport = mini.querySelector('[data-ln-mini-viewport]');
    var ratioX = mini.clientWidth / size.width, ratioY = mini.clientHeight / size.height;
    var left = clamp(-view.x / view.scale, 0, size.width) * ratioX;
    var top = clamp(-view.y / view.scale, 0, size.height) * ratioY;
    var width = Math.min(size.width, viewport.clientWidth / view.scale) * ratioX;
    var height = Math.min(size.height, viewport.clientHeight / view.scale) * ratioY;
    miniViewport.style.left = left + 'px'; miniViewport.style.top = top + 'px';
    miniViewport.style.width = Math.max(18, width) + 'px'; miniViewport.style.height = Math.max(14, height) + 'px';
    if (context === 'main') {
      root.querySelectorAll('[data-ln-node]').forEach(function (nodeEl) {
        var miniNode = mini.querySelector('[data-ln-mini-node="' + nodeEl.getAttribute('data-ln-node') + '"]');
        updateMiniNode(miniNode, parseFloat(nodeEl.style.left), parseFloat(nodeEl.style.top), size);
      });
    } else {
      root.querySelectorAll('[data-ln-field-node]').forEach(function (nodeEl) {
        var miniNode = mini.querySelector('[data-ln-mini-node="' + nodeEl.getAttribute('data-ln-field-node') + '"]');
        updateMiniNode(miniNode, parseFloat(nodeEl.style.left), parseFloat(nodeEl.style.top), size);
      });
    }
  }
  function updateMainEdges() {
    root.querySelectorAll('[data-ln-edge-from]').forEach(function (path) {
      var from = root.querySelector('[data-ln-node="' + path.getAttribute('data-ln-edge-from') + '"]');
      var to = root.querySelector('[data-ln-node="' + path.getAttribute('data-ln-edge-to') + '"]');
      if (!from || !to) return;
      var x1 = parseFloat(from.style.left) + 190, y1 = parseFloat(from.style.top) + 34;
      var x2 = parseFloat(to.style.left), y2 = parseFloat(to.style.top) + 34, mid = (x1 + x2) / 2;
      path.setAttribute('d', 'M' + x1 + ' ' + y1 + ' C' + mid + ' ' + y1 + ' ' + mid + ' ' + y2 + ' ' + x2 + ' ' + y2);
      var label = root.querySelector('[data-ln-edge-label="' + path.getAttribute('data-ln-edge-from') + '-' + path.getAttribute('data-ln-edge-to') + '"]');
      if (label) {
        var labelY = ((y1 + y2) / 2) - 9;
        var text = label.querySelector('text'), hit = label.querySelector('rect');
        if (text) { text.setAttribute('x', mid); text.setAttribute('y', labelY); }
        if (hit) { hit.setAttribute('x', mid - 75); hit.setAttribute('y', labelY - 15); }
      }
    });
  }
  function updateFieldEdges() {
    var source = root.querySelector('[data-ln-field-node="source"]'), target = root.querySelector('[data-ln-field-node="target"]');
    if (!source || !target) return;
    root.querySelectorAll('[data-ln-field-edge]').forEach(function (path) {
      var index = Number(path.getAttribute('data-ln-field-edge'));
      var x1 = parseFloat(source.style.left) + 360, y1 = parseFloat(source.style.top) + 100 + index * 32;
      var x2 = parseFloat(target.style.left), y2 = parseFloat(target.style.top) + 100 + index * 32, mid = (x1 + x2) / 2;
      path.setAttribute('d', 'M' + x1 + ' ' + y1 + ' C' + mid + ' ' + y1 + ' ' + mid + ' ' + y2 + ' ' + x2 + ' ' + y2);
      var dot = root.querySelector('[data-ln-field-dot="source-' + index + '"]');
      if (dot) { dot.setAttribute('cx', x1); dot.setAttribute('cy', y1); }
    });
  }
  function nodeType(nodeData) {
    return nodeData && nodeTypeConfig[nodeData.type] ? nodeTypeConfig[nodeData.type].label : '数据对象';
  }
  function nodePopoverHtml(nodeData) {
    var type = nodeType(nodeData), parts = String(nodeData.meta || '').split('/').map(function (part) { return part.trim(); });
    var location = parts[0] || '数据资产';
    var alias = parts[parts.length - 1] || nodeData.name;
    if (type === '表') {
      return '<p><b>表名：</b>' + esc(nodeData.name) + '</p><p><b>别名：</b>' + esc(alias) + '</p><p><b>库名：</b>' + esc(location) + '</p><p><b>描述：</b>' + esc(nodeData.meta) + '</p>';
    }
    return '<p><b>对象名称：</b>' + esc(nodeData.name) + '</p><p><b>对象类型：</b>' + esc(type) + '</p><p><b>所属位置：</b>' + esc(location) + '</p><p><b>描述：</b>' + esc(nodeData.meta) + '</p>';
  }
  function edgePopoverHtml(fromId, toId) {
    var graph = visibleGraph();
    var edgeData = graph.edges.find(function (item) { return item.from === fromId && item.to === toId; });
    var fromNode = graph.nodes.find(function (item) { return item.id === fromId; });
    var toNode = graph.nodes.find(function (item) { return item.id === toId; });
    if (!edgeData || !fromNode || !toNode) return '';
    return '<p><b>流程名：</b>' + esc(edgeData.label) + '</p><p><b>项目归属：</b>数据中台建设项目</p><p><b>血缘关系：</b>' + esc(fromNode.name) + ' → ' + esc(toNode.name) + '</p><p><b>创建者：</b>系统管理员</p><p><b>更新时间：</b>2026-09-16 10:20:36</p><p><b>描述：</b>' + esc(edgeData.label) + '</p>';
  }
  function showHoverPopover(target, html) {
    var viewport = root.querySelector('[data-ln-viewport="main"]');
    var popover = root.querySelector('[data-ln-hover-popover]');
    if (!viewport || !popover || !html) return;
    popover.innerHTML = html;
    popover.hidden = false;
    var viewportRect = viewport.getBoundingClientRect(), targetRect = target.getBoundingClientRect();
    var width = popover.offsetWidth, height = popover.offsetHeight;
    var left = targetRect.left - viewportRect.left + targetRect.width / 2 - width / 2;
    var top = targetRect.top - viewportRect.top - height - 10;
    if (top < 8) top = targetRect.bottom - viewportRect.top + 10;
    left = clamp(left, 8, Math.max(8, viewport.clientWidth - width - 8));
    top = clamp(top, 8, Math.max(8, viewport.clientHeight - height - 8));
    popover.style.left = left + 'px';
    popover.style.top = top + 'px';
  }
  function hideHoverPopover() {
    var popover = root.querySelector('[data-ln-hover-popover]');
    if (popover) { popover.hidden = true; popover.innerHTML = ''; }
    root.querySelectorAll('.ln-graph-svg > path.is-hovered').forEach(function (path) { path.classList.remove('is-hovered'); });
  }

  function updateTreeFilter(keyword) {
    var list = root.querySelector('[data-ln-tree-list]');
    if (!list) return;
    var query = keyword.trim().toLowerCase();
    var visibleCount = 0;
    list.querySelectorAll('[data-ln-tree-group]').forEach(function (group) {
      var parentText = (group.getAttribute('data-search') || '').toLowerCase();
      var leaves = group.querySelectorAll('.ln-tree-leaf[data-search]');
      var parentMatch = !query || parentText.indexOf(query) >= 0;
      var childVisible = 0;
      leaves.forEach(function (leaf) { var show = parentMatch || (leaf.getAttribute('data-search') || '').indexOf(query) >= 0; leaf.hidden = !show; if (show) childVisible += 1; });
      var showGroup = parentMatch || childVisible > 0;
      group.hidden = !showGroup;
      if (showGroup) visibleCount += 1;
    });
    var empty = list.querySelector('[data-ln-tree-empty]');
    if (empty) empty.hidden = visibleCount > 0;
  }
  function selectObject(id, analyze) {
    var config = getConfig();
    var item = config.objects.find(function (x) { return x.id === id; });
    if (!item) return;
    state.selectedListId = id;
    if (analyze) {
      state.selectedObject = item;
      state.canvasViews.main = { scale: 1, x: 0, y: 0 };
      resetPending.main = true;
    }
    render();
  }
  function notice(text, tone) {
    state.notice = { text: text, tone: tone || 'success' };
    render();
    window.setTimeout(function () { if (state && state.notice && state.notice.text === text) { state.notice = null; render(); } }, 2200);
  }
  function downloadBlob(name, content, type) {
    var url = URL.createObjectURL(new Blob([content], { type: type }));
    var a = document.createElement('a'); a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  }
  function downloadTemplate() {
    var html = '<html><meta charset="UTF-8"><body><table border="1"><tr><th>来源类型</th><th>来源对象</th><th>目标类型</th><th>目标对象</th><th>关系说明</th></tr><tr><td>表</td><td>ods_purchase_order</td><td>表</td><td>dwd_order_detail</td><td>明细加工</td></tr></table></body></html>';
    downloadBlob('血缘关系导入模板.xls', html, 'application/vnd.ms-excel;charset=utf-8');
    notice('导入模板已生成');
  }
  function downloadImage() {
    var graph = visibleGraph(), map = {};
    graph.nodes.forEach(function (n) { map[n.id] = n; });
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="1450" height="560"><rect width="1450" height="560" fill="#fbfcfe"/>' + graph.edges.map(function (e) { var a = map[e.from], b = map[e.to], x1=a.x+190, y1=a.y+34, x2=b.x, y2=b.y+34, mid=(x1+x2)/2; return '<path d="M'+x1+' '+y1+' C'+mid+' '+y1+' '+mid+' '+y2+' '+x2+' '+y2+'" fill="none" stroke="#68acec" stroke-width="1.8"/><text x="'+(mid-24)+'" y="'+(((y1+y2)/2)-9)+'" fill="#74869a" font-size="11">'+esc(e.label)+'</text>'; }).join('') + graph.nodes.map(function(n){return '<g transform="translate('+n.x+','+n.y+')"><rect width="190" height="68" rx="5" fill="'+(n.level===0?'#f4f9ff':'#fff')+'" stroke="'+(n.level===0?'#0078ff':'#d7e1eb')+'"/><text x="14" y="28" fill="#344557" font-size="13" font-weight="600">'+esc(n.name).slice(0,24)+'</text><text x="14" y="49" fill="#8b98a6" font-size="11">'+esc(n.meta).slice(0,28)+'</text></g>';}).join('') + '</svg>';
    downloadBlob('血缘关系-' + state.selectedObject.name.replace(/[^a-zA-Z0-9_-]/g, '_') + '.svg', svg, 'image/svg+xml;charset=utf-8');
    notice('血缘关系图片已生成');
  }
  function nowText() { var d = new Date(); function p(n){return String(n).padStart(2,'0');} return d.getFullYear()+'-'+p(d.getMonth()+1)+'-'+p(d.getDate())+' '+p(d.getHours())+':'+p(d.getMinutes())+':'+p(d.getSeconds()); }

  function bind() {
    root.addEventListener('click', function (e) {
      var actionEl = e.target.closest('[data-ln-action]');
      var objectEl = e.target.closest('[data-ln-object]');
      if (objectEl) {
        state.selectedListId = objectEl.getAttribute('data-ln-object');
        root.querySelectorAll('[data-ln-object]').forEach(function (item) { item.classList.toggle('active', item === objectEl); });
        return;
      }
      if (!actionEl) {
        if (e.target.matches('[data-ln-modal-mask]')) { state.modal=''; render(); return; }
        if (state.directoryOpen && !e.target.closest('.ln-dir-wrap')) { state.directoryOpen=false; render(); }
        return;
      }
      var action = actionEl.getAttribute('data-ln-action');
      if (action === 'tab') { state.activeTab = actionEl.getAttribute('data-value'); state.keywordDraft=''; state.keywordApplied=''; state.directoryOpen=false; state.selectedListId=''; state.selectedObject=null; render(); }
      else if (action === 'toggle-directory') { state.directoryOpen = !state.directoryOpen; render(); }
      else if (action === 'select-directory') { state.directoryByTab[state.activeTab] = actionEl.getAttribute('data-value'); state.directoryOpen=false; state.keywordDraft=''; state.keywordApplied=''; state.selectedListId=''; state.selectedObject=null; render(); }
      else if (action === 'apply-search') { state.keywordApplied = state.keywordDraft.trim(); state.selectedListId=''; render(); }
      else if (action === 'focus-tree-search') { var input=root.querySelector('[data-ln-tree-search]'); if(input) input.focus(); }
      else if (action === 'open-import') { state.modal='import'; state.importFile=''; render(); }
      else if (action === 'open-history') { state.modal='history'; render(); }
      else if (action === 'close-modal') { state.modal=''; render(); }
      else if (action === 'download-template') downloadTemplate();
      else if (action === 'download-image') downloadImage();
      else if (action === 'zoom-in') zoomCanvas(actionEl.getAttribute('data-ln-context'), 1.15);
      else if (action === 'zoom-out') zoomCanvas(actionEl.getAttribute('data-ln-context'), 1 / 1.15);
      else if (action === 'zoom-reset') resetCanvas(actionEl.getAttribute('data-ln-context'));
      else if (action === 'fit-canvas') fitCanvas(actionEl.getAttribute('data-ln-context'));
      else if (action === 'confirm-import') { if (!state.importFile) { notice('请选择需要导入的 Excel 文件', 'error'); state.modal='import'; render(); return; } state.history.unshift({file:state.importFile,mode:state.importMode,time:nowText()}); state.modal=''; notice('文件导入成功，可在导入历史中查看结果'); }
    });
    root.addEventListener('dblclick', function (e) {
      var nodeEl=e.target.closest('[data-ln-node]');
      var objectEl=e.target.closest('[data-ln-object]');
      if (nodeEl) {
        state.fieldNodeId=nodeEl.getAttribute('data-ln-node'); state.modal='field';
        state.fieldPositions={source:{x:120,y:70},target:{x:650,y:70}};
        state.canvasViews.field={scale:1,x:0,y:0}; resetPending.field=true; render(); return;
      }
      if(objectEl) selectObject(objectEl.getAttribute('data-ln-object'), true);
    });
    root.addEventListener('mouseover', function (e) {
      var nodeEl = e.target.closest('[data-ln-node]');
      var edgeLabel = e.target.closest('[data-ln-edge-label]');
      if (nodeEl && (!e.relatedTarget || !nodeEl.contains(e.relatedTarget))) {
        var graph = visibleGraph();
        var nodeData = graph.nodes.find(function (item) { return item.id === nodeEl.getAttribute('data-ln-node'); });
        if (nodeData) showHoverPopover(nodeEl, nodePopoverHtml(nodeData));
        return;
      }
      if (edgeLabel && (!e.relatedTarget || !edgeLabel.contains(e.relatedTarget))) {
        var fromId = edgeLabel.getAttribute('data-ln-edge-from'), toId = edgeLabel.getAttribute('data-ln-edge-to');
        var path = root.querySelector('path[data-ln-edge-from="' + fromId + '"][data-ln-edge-to="' + toId + '"]');
        if (path) path.classList.add('is-hovered');
        showHoverPopover(edgeLabel, edgePopoverHtml(fromId, toId));
      }
    });
    root.addEventListener('mouseout', function (e) {
      var target = e.target.closest('[data-ln-node], [data-ln-edge-label]');
      if (!target || (e.relatedTarget && target.contains(e.relatedTarget))) return;
      hideHoverPopover();
    });
    root.addEventListener('wheel', function (e) {
      var viewport=e.target.closest('[data-ln-viewport]');
      if (!viewport || !e.ctrlKey) return;
      e.preventDefault();
      zoomCanvas(viewport.getAttribute('data-ln-viewport'), e.deltaY < 0 ? 1.1 : 1 / 1.1, e.clientX, e.clientY);
    }, { passive: false });
    root.addEventListener('pointerdown', function (e) {
      if (e.button !== 0 || e.target.closest('.ln-canvas-tools') || e.target.closest('.ln-minimap')) return;
      var mainNode=e.target.closest('[data-ln-node]');
      var fieldNode=e.target.closest('[data-ln-field-node]');
      var viewport=e.target.closest('[data-ln-viewport]');
      if (!viewport) return;
      hideHoverPopover();
      var context=viewport.getAttribute('data-ln-viewport');
      if (mainNode || fieldNode) {
        var nodeEl=mainNode || fieldNode;
        dragState={type:'node',context:context,element:nodeEl,id:mainNode?mainNode.getAttribute('data-ln-node'):fieldNode.getAttribute('data-ln-field-node'),startX:e.clientX,startY:e.clientY,nodeX:parseFloat(nodeEl.style.left),nodeY:parseFloat(nodeEl.style.top),moved:false};
      } else {
        var view=state.canvasViews[context];
        dragState={type:'canvas',context:context,startX:e.clientX,startY:e.clientY,viewX:view.x,viewY:view.y,moved:false};
        viewport.classList.add('is-panning');
      }
      if (e.target.setPointerCapture) e.target.setPointerCapture(e.pointerId);
      if (!mainNode && !fieldNode) e.preventDefault();
    });
    root.addEventListener('pointermove', function (e) {
      if (!dragState) return;
      var dx=e.clientX-dragState.startX, dy=e.clientY-dragState.startY;
      if (Math.abs(dx)+Math.abs(dy)>3) dragState.moved=true;
      if (dragState.type === 'canvas') {
        var view=state.canvasViews[dragState.context]; view.x=dragState.viewX+dx; view.y=dragState.viewY+dy; applyCanvasView(dragState.context);
      } else {
        var scale=state.canvasViews[dragState.context].scale;
        var width=dragState.context==='field'?360:190, height=dragState.context==='field'?284:68;
        var bounds=nodeDragBounds(dragState.context,width,height);
        var x=clamp(dragState.nodeX+dx/scale,bounds.minX,bounds.maxX), y=clamp(dragState.nodeY+dy/scale,bounds.minY,bounds.maxY);
        dragState.element.style.left=x+'px'; dragState.element.style.top=y+'px';
        if (dragState.context==='main') {
          state.nodePositions[state.selectedObject.id]=state.nodePositions[state.selectedObject.id]||{};
          state.nodePositions[state.selectedObject.id][dragState.id]={x:x,y:y}; updateMainEdges();
        } else { state.fieldPositions[dragState.id]={x:x,y:y}; updateFieldEdges(); }
        updateMiniMap(dragState.context);
      }
    });
    function endPointer() {
      if (!dragState) return;
      var viewport=root.querySelector('[data-ln-viewport="'+dragState.context+'"]');
      if (viewport) viewport.classList.remove('is-panning');
      dragState=null;
    }
    root.addEventListener('pointerup', endPointer);
    root.addEventListener('pointercancel', endPointer);
    root.addEventListener('input', function (e) {
      if (e.target.matches('[data-ln-object-search]')) state.keywordDraft = e.target.value;
      if (e.target.matches('[data-ln-tree-search]')) updateTreeFilter(e.target.value);
    });
    root.addEventListener('keydown', function (e) { if (e.target.matches('[data-ln-object-search]') && e.key === 'Enter') { state.keywordApplied=state.keywordDraft.trim(); state.selectedListId=''; render(); } });
    root.addEventListener('change', function (e) {
      if (e.target.matches('[data-ln-context]')) { state[e.target.getAttribute('data-ln-context')] = e.target.value; state.selectedListId=''; state.selectedObject=null; render(); }
      else if (e.target.matches('[data-ln-direction]')) { state.direction=e.target.value; resetPending.main=true; render(); }
      else if (e.target.matches('[data-ln-depth]')) { state.depth=e.target.value; resetPending.main=true; render(); }
      else if (e.target.matches('[data-ln-import-mode]')) state.importMode=e.target.value;
      else if (e.target.matches('[data-ln-import-file]')) { var file=e.target.files&&e.target.files[0]; if(file&&!/\.xlsx?$/i.test(file.name)){e.target.value=''; state.importFile=''; notice('请选择 Excel 格式文件','error'); state.modal='import'; render();} else if(file&&file.size>50*1024*1024){e.target.value=''; state.importFile=''; notice('文件大小不能超过 50M','error'); state.modal='import'; render();} else state.importFile=file?file.name:''; }
    });
  }

  return {
    html: '<div id="lineagePageRoot"></div>',
    init: function () { root=document.getElementById('lineagePageRoot'); if(!root) return; state=initialState(); render(); bind(); }
  };
})();
