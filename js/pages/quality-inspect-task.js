/**
 * 数据中台 V4.0 - 数据资产 / 数据质量 / 稽查任务
 * 静态高保真原型：稽查任务列表、目录筛选、运行控制确认弹窗
 */
window.DP = window.DP || {};
DP.pages = DP.pages || {};

DP.pages.qualityInspectTask = (function () {
  var pageEl = null;

  var state = {
    treeKey: 'demo',
    treeKeyword: '',
    treeOpen: {
      demo: true,
      'demo-warehouse': true,
      business: true,
      'biz-core': true,
      standard: true,
      'standard-domain': true
    },
    selectedIds: {},
    page: 1,
    pageSize: 16,
    filters: {
      status: '',
      keyword: ''
    },
    modal: null
  };

  var statuses = ['运行中', '已停止', '执行中', '异常'];

  var taskTree = [
    {
      key: 'demo',
      label: '中电数治演示',
      icon: 'bi-layers-fill',
      iconClass: 'is-blue',
      children: [
        { key: 'demo-ods', label: 'ODS 贴源层', icon: 'bi-database-fill' },
        {
          key: 'demo-warehouse',
          label: '数仓分层稽查',
          icon: 'bi-folder-fill',
          children: [
            { key: 'demo-dwd', label: 'DWD 明细层', icon: 'bi-table' },
            { key: 'demo-dws', label: 'DWS 汇总层', icon: 'bi-table' },
            { key: 'demo-ads', label: 'ADS 应用层', icon: 'bi-window-sidebar' }
          ]
        },
        { key: 'demo-mart', label: '指标集市', icon: 'bi-grid-3x3-gap-fill' }
      ]
    },
    {
      key: 'business',
      label: '业务系统',
      icon: 'bi-hdd-network-fill',
      iconClass: 'is-system',
      children: [
        {
          key: 'biz-core',
          label: '核心业务域',
          icon: 'bi-folder-fill',
          children: [
            { key: 'biz-order', label: '订单交易系统', icon: 'bi-receipt' },
            { key: 'biz-customer', label: '客户主数据系统', icon: 'bi-people' },
            { key: 'biz-workorder', label: '工单协同系统', icon: 'bi-ui-checks' }
          ]
        },
        { key: 'biz-hr', label: '人事考勤系统', icon: 'bi-person-badge' },
        { key: 'biz-finance', label: '财务结算系统', icon: 'bi-cash-coin' },
        { key: 'biz-logistics', label: '物流运单系统', icon: 'bi-truck' }
      ]
    },
    {
      key: 'standard',
      label: '系统业务库',
      icon: 'bi-collection-fill',
      iconClass: 'is-standard',
      children: [
        {
          key: 'standard-domain',
          label: '标准稽查任务',
          icon: 'bi-folder-fill',
          children: [
            { key: 'standard-code', label: '标准代码一致性', icon: 'bi-code-square' },
            { key: 'standard-field', label: '字段命名规范', icon: 'bi-input-cursor-text' },
            { key: 'standard-security', label: '分级分类一致性', icon: 'bi-shield-lock' }
          ]
        },
        { key: 'standard-public', label: '公共质量模板', icon: 'bi-puzzle-fill' }
      ]
    }
  ];

  var taskRows = [
    task('dqit-001', '手机号码稽查', '每天 10:18:57', '运行中', 'present', '2026-05-22 10:13:46', '2026-06-23 10:18:57', 'biz-customer', '基础稽查', 'crm_member_base', 4, '校验客户手机号非空、格式、号段和重复情况。'),
    task('dqit-002', 'express_task_collect表非空校验', '每天 10:05:02', '运行中', 'present', '2026-05-22 09:59:50', '2026-06-23 10:05:02', 'demo-ods', '自定义稽查', 'express_task_collect', 5, '对快递采集任务关键字段进行非空稽查。'),
    task('dqit-003', '订单号唯一性稽查', '每天 01:20:00', '运行中', '数据治理部', '2026-06-18 09:23:12', '2026-06-23 01:20:00', 'biz-order', '自定义稽查', 'dwd_order_detail_di', 6, '检查订单明细表订单号重复记录。'),
    task('dqit-004', '订单状态标准代码稽查', '每天 02:10:00', '执行中', '数据治理部', '2026-06-16 15:42:27', '2026-06-23 02:10:00', 'standard-code', '标准稽查', 'dim_order_status', 3, '校验订单状态与标准代码值域一致性。'),
    task('dqit-005', '客户证件号格式稽查', '每天 03:35:00', '运行中', '客户运营部', '2026-06-14 11:08:36', '2026-06-23 03:35:00', 'biz-customer', '基础稽查', 'crm_customer_identity', 4, '校验证件号长度、字符规则和脱敏前格式。'),
    task('dqit-006', '工单关闭时间一致性稽查', '每小时 15 分', '运行中', '工单运营组', '2026-06-12 16:19:04', '2026-06-23 16:15:00', 'biz-workorder', '自定义稽查', 'ods_workorder_ticket', 5, '关闭时间不得早于创建时间，关闭状态必须有关闭时间。'),
    task('dqit-007', '人事考勤打卡时间稽查', '每天 07:40:00', '运行中', '人力共享中心', '2026-06-11 18:20:16', '2026-06-23 07:40:00', 'biz-hr', '基础稽查', 'hr_attendance_record', 6, '识别迟到、缺卡、重复打卡和跨日异常记录。'),
    task('dqit-008', '人员组织编码标准稽查', '每天 08:25:00', '已停止', '人力共享中心', '2026-06-10 14:05:41', '2026-06-21 08:25:00', 'standard-field', '标准稽查', 'hr_employee_org', 3, '人员组织编码需与组织主数据标准一致。'),
    task('dqit-009', '支付金额非负稽查', '每天 04:05:00', '运行中', '财务结算部', '2026-06-09 10:12:33', '2026-06-23 04:05:00', 'biz-finance', '基础稽查', 'fin_payment_record', 4, '支付金额、退款金额和优惠金额不得为负数。'),
    task('dqit-010', '结算金额精度稽查', '每周一 06:30:00', '已停止', '财务结算部', '2026-06-08 17:46:58', '2026-06-22 06:30:00', 'biz-finance', '自定义稽查', 'fin_settlement_bill', 5, '金额字段保留两位小数，识别精度异常。'),
    task('dqit-011', '运单签收时间及时性稽查', '每小时 05 分', '运行中', '物流数据组', '2026-06-07 13:28:15', '2026-06-23 16:05:00', 'biz-logistics', '自定义稽查', 'logistics_waybill', 5, '签收时间不得早于揽收时间，且不得晚于当前时间。'),
    task('dqit-012', '省市区编码一致性稽查', '每天 05:45:00', '异常', '物流数据组', '2026-06-06 09:33:27', '2026-06-23 05:45:00', 'standard-code', '标准稽查', 'logistics_address_area', 4, '校验省、市、区编码与行政区划标准层级一致。'),
    task('dqit-013', 'ODS 主键入仓非空稽查', '每天 00:30:00', '运行中', '数仓开发组', '2026-06-05 12:11:05', '2026-06-23 00:30:00', 'demo-ods', '基础稽查', 'ods_order_main', 5, '贴源层主键字段不得为空。'),
    task('dqit-014', 'DWD 明细记录重复稽查', '每天 01:05:00', '运行中', '数仓开发组', '2026-06-04 16:44:52', '2026-06-23 01:05:00', 'demo-dwd', '自定义稽查', 'dwd_order_user_wide', 6, '明细层按业务主键和数据日期识别重复记录。'),
    task('dqit-015', 'DWS 汇总口径一致性稽查', '每天 02:45:00', '运行中', '数仓开发组', '2026-06-03 12:06:33', '2026-06-23 02:45:00', 'demo-dws', '标准稽查', 'dws_order_daily', 4, '汇总指标需与指标口径和维度粒度保持一致。'),
    task('dqit-016', 'ADS 报表刷新及时性稽查', '每天 09:00:00', '执行中', '经营分析组', '2026-06-02 08:58:16', '2026-06-23 09:00:00', 'demo-ads', '自定义稽查', 'ads_order_overview', 4, '经营报表需在每日 09:00 前完成刷新。'),
    task('dqit-017', '会员画像标签取值稽查', '每天 03:15:00', '运行中', '客户运营部', '2026-05-31 15:21:09', '2026-06-23 03:15:00', 'demo-mart', '基础稽查', 'ads_member_profile_tag', 5, '检查会员标签空值、枚举和更新日期。'),
    task('dqit-018', '商品维表上下架状态稽查', '每天 01:55:00', '运行中', '商品数据组', '2026-05-30 11:47:20', '2026-06-23 01:55:00', 'demo-dwd', '基础稽查', 'dim_product_sku', 4, '商品上下架状态需与标准枚举保持一致。'),
    task('dqit-019', '接口日志响应码稽查', '每小时 30 分', '已停止', '平台运维组', '2026-05-29 19:23:44', '2026-06-20 18:30:00', 'standard-public', '自定义稽查', 'api_access_log', 3, '识别接口响应码异常峰值和空响应。'),
    task('dqit-020', '敏感字段分级分类稽查', '每天 23:30:00', '运行中', '安全管理员', '2026-05-28 10:32:26', '2026-06-22 23:30:00', 'standard-security', '标准稽查', 'meta_field_security', 6, '校验字段分级分类标签是否与安全规范一致。'),
    task('dqit-021', '字段英文命名规范稽查', '每周二 04:00:00', '运行中', '元数据管理员', '2026-05-27 09:44:18', '2026-06-23 04:00:00', 'standard-field', '标准稽查', 'meta_model_field', 4, '字段英文名需符合下划线小写命名规范。'),
    task('dqit-022', '公共代码表空值稽查', '每天 06:10:00', '运行中', '标准管理员', '2026-05-26 17:05:13', '2026-06-23 06:10:00', 'standard-code', '基础稽查', 'std_common_code', 3, '公共代码表编码、名称、状态字段不得为空。'),
    task('dqit-023', '营销活动日期范围稽查', '每天 02:25:00', '异常', '营销分析组', '2026-05-25 14:16:39', '2026-06-23 02:25:00', 'demo-mart', '自定义稽查', 'mart_campaign_effect', 4, '活动结束时间不得早于开始时间。'),
    task('dqit-024', '库存快照数量非负稽查', '每小时 45 分', '运行中', '供应链数据组', '2026-05-24 11:36:22', '2026-06-23 15:45:00', 'demo-dws', '基础稽查', 'dws_inventory_snapshot', 5, '库存数量、锁定数量和在途数量不得为负数。')
  ];

  function task(id, name, frequency, status, creator, createdAt, lastRunAt, group, type, target, ruleCount, desc) {
    return {
      id: id,
      name: name,
      frequency: frequency,
      status: status,
      creator: creator,
      createdAt: createdAt,
      lastRunAt: lastRunAt,
      group: group,
      type: type,
      target: target,
      ruleCount: ruleCount,
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

  function normalize(value) {
    return String(value || '').trim().toLowerCase();
  }

  function formatDateTime(date) {
    function pad(value) { return String(value).padStart(2, '0'); }
    return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate()) + ' ' +
      pad(date.getHours()) + ':' + pad(date.getMinutes()) + ':' + pad(date.getSeconds());
  }

  function findTreeNode(nodes, key) {
    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      if (node.key === key) return node;
      var found = findTreeNode(node.children || [], key);
      if (found) return found;
    }
    return null;
  }

  function collectTreeKeys(node) {
    if (!node) return [];
    return [node.key].concat((node.children || []).reduce(function (keys, child) {
      return keys.concat(collectTreeKeys(child));
    }, []));
  }

  function getTreeCount(node) {
    var keys = collectTreeKeys(node);
    return taskRows.filter(function (item) { return keys.indexOf(item.group) >= 0; }).length;
  }

  function treeMatches(node, keyword) {
    if (!keyword) return true;
    if (normalize(node.label).indexOf(keyword) >= 0) return true;
    return (node.children || []).some(function (child) { return treeMatches(child, keyword); });
  }

  function renderTreeNodes(nodes, keyword) {
    return nodes.filter(function (node) {
      return treeMatches(node, keyword);
    }).map(function (node) {
      var children = node.children || [];
      var hasChildren = children.length > 0;
      var isOpen = !!keyword || !!state.treeOpen[node.key];
      var isActive = state.treeKey === node.key;
      return '<li class="dqit-tree-node' + (isOpen ? ' open' : '') + '">' +
        '<div class="dqit-tree-row' + (isActive ? ' active' : '') + '">' +
          (hasChildren
            ? '<button class="dqit-tree-toggle" type="button" data-dqit-action="toggle-tree" data-key="' + escapeHtml(node.key) + '" aria-label="展开或收起"><i class="bi ' + (isOpen ? 'bi-caret-down-fill' : 'bi-caret-right-fill') + '"></i></button>'
            : '<span class="dqit-tree-toggle-placeholder"></span>') +
          '<button class="dqit-tree-select" type="button" data-dqit-tree-key="' + escapeHtml(node.key) + '">' +
            '<i class="bi ' + escapeHtml(node.icon || 'bi-folder-fill') + ' dqit-tree-icon ' + escapeHtml(node.iconClass || '') + '"></i>' +
            '<span class="dqit-tree-name">' + escapeHtml(node.label) + '</span>' +
            '<span class="dqit-tree-count">' + getTreeCount(node) + '</span>' +
          '</button>' +
        '</div>' +
        (hasChildren ? '<ul class="dqit-tree-children">' + renderTreeNodes(children, keyword) + '</ul>' : '') +
      '</li>';
    }).join('');
  }

  function renderTree() {
    return renderTreeNodes(taskTree, normalize(state.treeKeyword)) || '<li class="dqit-empty-tree">暂无匹配目录</li>';
  }

  function getCurrentTreeKeys() {
    return collectTreeKeys(findTreeNode(taskTree, state.treeKey));
  }

  function getFilteredRows() {
    var keys = getCurrentTreeKeys();
    var keyword = normalize(state.filters.keyword);
    return taskRows.filter(function (item) {
      if (keys.length && keys.indexOf(item.group) < 0) return false;
      if (state.filters.status && item.status !== state.filters.status) return false;
      if (keyword) {
        var text = [item.name, item.frequency, item.status, item.creator, item.createdAt, item.lastRunAt, item.type, item.target, item.desc].join(' ');
        if (normalize(text).indexOf(keyword) < 0) return false;
      }
      return true;
    });
  }

  function clampPage(total) {
    var totalPages = Math.max(1, Math.ceil(total / state.pageSize));
    state.page = Math.max(1, Math.min(totalPages, state.page));
    return totalPages;
  }

  function getVisibleRows() {
    var rows = getFilteredRows();
    clampPage(rows.length);
    var start = (state.page - 1) * state.pageSize;
    return rows.slice(start, start + state.pageSize);
  }

  function getTaskById(id) {
    return taskRows.filter(function (item) { return item.id === id; })[0] || null;
  }

  function getTasksByIds(ids) {
    return ids.map(getTaskById).filter(function (item) { return !!item; });
  }

  function renderStatusOptions() {
    return '<option value="">运行状态</option>' + statuses.map(function (status) {
      return '<option value="' + escapeHtml(status) + '"' + (state.filters.status === status ? ' selected' : '') + '>' + escapeHtml(status) + '</option>';
    }).join('');
  }

  function renderToolbar() {
    return '<div class="dqit-toolbar">' +
      '<div class="dqit-toolbar-left">' +
        '<button class="btn btn-primary" type="button" data-dqit-action="entry-custom"><i class="bi bi-plus-square"></i><span>自定义稽查</span></button>' +
        '<button class="btn btn-primary" type="button" data-dqit-action="entry-basic"><i class="bi bi-clipboard-check"></i><span>基础稽查</span></button>' +
        '<button class="btn btn-primary" type="button" data-dqit-action="entry-standard"><i class="bi bi-search"></i><span>标准稽查</span></button>' +
        '<span class="dqit-toolbar-divider"></span>' +
        '<button class="btn btn-primary" type="button" data-dqit-action="start-selected"><i class="bi bi-play-fill"></i><span>启动</span></button>' +
        '<button class="btn btn-primary" type="button" data-dqit-action="stop-selected"><i class="bi bi-stop-fill"></i><span>停止</span></button>' +
        '<button class="btn btn-danger" type="button" data-dqit-action="delete-selected"><i class="bi bi-trash3"></i><span>删除</span></button>' +
      '</div>' +
      '<div class="dqit-toolbar-right">' +
        '<select class="dqit-status-select" data-dqit-filter="status" aria-label="运行状态">' + renderStatusOptions() + '</select>' +
        '<div class="dqit-query-box">' +
          '<input id="dqitKeywordInput" type="text" value="' + escapeHtml(state.filters.keyword) + '" placeholder="关键字查询" aria-label="关键字查询">' +
          '<button class="btn btn-primary" type="button" data-dqit-action="query"><i class="bi bi-search"></i><span>查询</span></button>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  function statusClass(status) {
    if (status === '运行中') return 'running';
    if (status === '执行中') return 'executing';
    if (status === '异常') return 'error';
    return 'stopped';
  }

  function renderStatus(status) {
    return '<span class="dqit-status ' + statusClass(status) + '">' + escapeHtml(status) + '</span>';
  }

  function renderActionButtons(item) {
    var isRunning = item.status === '运行中' || item.status === '执行中';
    return '<div class="dqit-actions">' +
      '<button type="button" data-dqit-action="view-row" data-id="' + escapeHtml(item.id) + '"><i class="bi bi-search"></i><span>查看</span></button>' +
      (isRunning
        ? '<button type="button" data-dqit-action="stop-row" data-id="' + escapeHtml(item.id) + '"><i class="bi bi-stop-circle-fill"></i><span>停止</span></button>'
        : '<button type="button" data-dqit-action="start-row" data-id="' + escapeHtml(item.id) + '"><i class="bi bi-play-circle-fill"></i><span>启动</span></button>') +
      '<button type="button" data-dqit-action="edit-row" data-id="' + escapeHtml(item.id) + '"><i class="bi bi-pencil-square"></i><span>编辑</span></button>' +
      '<button class="danger" type="button" data-dqit-action="delete-row" data-id="' + escapeHtml(item.id) + '"><i class="bi bi-trash3"></i><span>删除</span></button>' +
    '</div>';
  }

  function renderTableRows() {
    var rows = getVisibleRows();
    if (!rows.length) {
      return '<tr class="dqit-empty-row"><td colspan="8">暂无匹配稽查任务</td></tr>';
    }
    return rows.map(function (item) {
      return '<tr>' +
        '<td><input type="checkbox" data-dqit-row-check="' + escapeHtml(item.id) + '"' + (state.selectedIds[item.id] ? ' checked' : '') + ' aria-label="选择稽查任务"></td>' +
        '<td title="' + escapeHtml(item.desc) + '"><a class="dqit-task-name" data-dqit-action="view-row" data-id="' + escapeHtml(item.id) + '">' + escapeHtml(item.name) + '</a><span>' + escapeHtml(item.type) + ' / ' + escapeHtml(item.target) + '</span></td>' +
        '<td>' + escapeHtml(item.frequency) + '</td>' +
        '<td>' + renderStatus(item.status) + '</td>' +
        '<td>' + escapeHtml(item.creator) + '</td>' +
        '<td>' + escapeHtml(item.createdAt) + '</td>' +
        '<td>' + escapeHtml(item.lastRunAt) + '</td>' +
        '<td>' + renderActionButtons(item) + '</td>' +
      '</tr>';
    }).join('');
  }

  function renderTable() {
    var visible = getVisibleRows();
    var checkedCount = visible.filter(function (item) { return state.selectedIds[item.id]; }).length;
    var allChecked = visible.length > 0 && checkedCount === visible.length;
    return '<div class="dqit-table-wrap">' +
      '<table class="ds-table dqit-table">' +
        '<colgroup>' +
          '<col class="dqit-w-check"><col class="dqit-w-name"><col class="dqit-w-frequency"><col class="dqit-w-status">' +
          '<col class="dqit-w-creator"><col class="dqit-w-created"><col class="dqit-w-last"><col class="dqit-w-action">' +
        '</colgroup>' +
        '<thead><tr>' +
          '<th class="col-ck"><input type="checkbox" data-dqit-check-all' + (allChecked ? ' checked' : '') + ' aria-label="全选稽查任务"></th>' +
          '<th>任务名称</th><th>频率</th><th>运行状态</th><th>创建人</th><th>创建时间</th><th>最后执行时间</th><th>操作</th>' +
        '</tr></thead>' +
        '<tbody>' + renderTableRows() + '</tbody>' +
      '</table>' +
    '</div>';
  }

  function renderFooter() {
    var rows = getFilteredRows();
    var total = rows.length;
    var totalPages = clampPage(total);
    var start = total ? (state.page - 1) * state.pageSize + 1 : 0;
    var end = total ? Math.min(total, state.page * state.pageSize) : 0;
    var nav = '';
    for (var i = 1; i <= totalPages; i++) {
      nav += '<button type="button" data-dqit-page="' + i + '"' + (state.page === i ? ' class="active"' : '') + '>' + i + '</button>';
    }
    return '<div class="dqit-footer">' +
      '<div class="dqit-footer-left">显示第 ' + start + ' 到第 ' + end + ' 条记录，总共 ' + total + ' 条记录 每页显示 ' +
        '<select data-dqit-page-size><option value="16"' + (state.pageSize === 16 ? ' selected' : '') + '>16</option><option value="24"' + (state.pageSize === 24 ? ' selected' : '') + '>24</option></select> 条记录</div>' +
      '<div class="dqit-page-nav">' +
        '<button type="button" data-dqit-page="prev"' + (state.page <= 1 ? ' disabled' : '') + '><i class="bi bi-chevron-left"></i></button>' +
        nav +
        '<button type="button" data-dqit-page="next"' + (state.page >= totalPages ? ' disabled' : '') + '><i class="bi bi-chevron-right"></i></button>' +
      '</div>' +
    '</div>';
  }

  function renderModal() {
    if (!state.modal) return '';
    var type = state.modal.type;
    var tasks = getTasksByIds(state.modal.ids);
    var isDelete = type === 'delete';
    var isStop = type === 'stop';
    var title = isDelete ? '删除稽查任务' : (isStop ? '停止稽查任务' : '启动稽查任务');
    var icon = isDelete ? 'bi-trash3' : (isStop ? 'bi-stop-circle' : 'bi-play-circle');
    var tone = isDelete ? 'danger' : (isStop ? 'warning' : 'primary');
    var okText = isDelete ? '确认删除' : (isStop ? '确认停止' : '确认启动');
    var desc = isDelete
      ? '删除后该任务配置将从列表移除，静态原型内不会进入回收站。'
      : (isStop ? '停止后任务将不再按调度频率自动执行，可在列表中再次启动。' : '启动后任务将按配置频率进入调度执行，并更新运行状态。');
    var taskHtml = tasks.slice(0, 6).map(function (item) {
      return '<li><span>' + escapeHtml(item.name) + '</span><em>' + escapeHtml(item.status) + '</em></li>';
    }).join('');
    if (tasks.length > 6) {
      taskHtml += '<li class="more">另有 ' + (tasks.length - 6) + ' 个任务</li>';
    }
    return '<div class="dqit-modal-mask" data-dqit-modal-mask>' +
      '<div class="dqit-confirm" role="dialog" aria-modal="true" aria-label="' + escapeHtml(title) + '">' +
        '<button class="dqit-confirm-close" type="button" data-dqit-action="close-modal" aria-label="关闭"><i class="bi bi-x-lg"></i></button>' +
        '<div class="dqit-confirm-body">' +
          '<div class="dqit-confirm-icon ' + tone + '"><i class="bi ' + icon + '"></i></div>' +
          '<div class="dqit-confirm-main">' +
            '<h3>' + escapeHtml(title) + '</h3>' +
            '<p>确认对 <b>' + tasks.length + '</b> 个稽查任务执行该操作吗？</p>' +
            '<div class="dqit-confirm-desc">' + escapeHtml(desc) + '</div>' +
            '<ul class="dqit-confirm-list">' + taskHtml + '</ul>' +
          '</div>' +
        '</div>' +
        '<div class="dqit-confirm-footer">' +
          '<button class="btn btn-outline" type="button" data-dqit-action="close-modal"><i class="bi bi-x-lg"></i><span>取消</span></button>' +
          '<button class="btn ' + (isDelete ? 'btn-danger' : 'btn-primary') + '" type="button" data-dqit-action="confirm-modal"><i class="bi bi-check-lg"></i><span>' + escapeHtml(okText) + '</span></button>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  function renderMain() {
    var main = pageEl.querySelector('[data-dqit-main]');
    if (!main) return;
    main.innerHTML = renderToolbar() + renderTable() + renderFooter();
  }

  function renderAll() {
    var tree = pageEl.querySelector('[data-dqit-tree]');
    var treeInput = pageEl.querySelector('[data-dqit-tree-search]');
    if (tree) tree.innerHTML = renderTree();
    if (treeInput && treeInput.value !== state.treeKeyword) treeInput.value = state.treeKeyword;
    renderMain();
    renderModalContainer();
  }

  function renderModalContainer() {
    var old = pageEl.querySelector('[data-dqit-modal-mask]');
    if (old) old.remove();
    if (state.modal) pageEl.insertAdjacentHTML('beforeend', renderModal());
  }

  function showToast(message) {
    var old = pageEl.querySelector('.dqit-toast');
    if (old) old.remove();
    pageEl.insertAdjacentHTML('beforeend', '<div class="dqit-toast"><i class="bi bi-check-circle"></i><span>' + escapeHtml(message) + '</span></div>');
    var toast = pageEl.querySelector('.dqit-toast');
    window.setTimeout(function () { if (toast) toast.classList.add('show'); }, 20);
    window.setTimeout(function () { if (toast && toast.parentNode) toast.remove(); }, 1800);
  }

  function openOperation(type, ids) {
    ids = (ids || []).filter(function (id) { return !!getTaskById(id); });
    if (!ids.length) {
      showToast('请先选择需要操作的稽查任务');
      return;
    }
    state.modal = { type: type, ids: ids };
    renderModalContainer();
  }

  function closeModal() {
    state.modal = null;
    renderModalContainer();
  }

  function applyOperation() {
    if (!state.modal) return;
    var type = state.modal.type;
    var ids = state.modal.ids.slice();
    if (type === 'delete') {
      taskRows = taskRows.filter(function (item) { return ids.indexOf(item.id) < 0; });
      state.selectedIds = {};
      state.modal = null;
      renderAll();
      showToast('稽查任务已删除');
      return;
    }
    taskRows.forEach(function (item) {
      if (ids.indexOf(item.id) < 0) return;
      item.status = type === 'start' ? '运行中' : '已停止';
      if (type === 'start') item.lastRunAt = formatDateTime(new Date());
    });
    state.selectedIds = {};
    state.modal = null;
    renderAll();
    showToast(type === 'start' ? '稽查任务已启动' : '稽查任务已停止');
  }

  function getSelectedIds() {
    return Object.keys(state.selectedIds);
  }

  function handleAction(actionEl) {
    var action = actionEl.getAttribute('data-dqit-action');
    var id = actionEl.getAttribute('data-id') || '';
    if (action === 'toggle-tree') {
      var key = actionEl.getAttribute('data-key') || '';
      state.treeOpen[key] = !state.treeOpen[key];
      var tree = pageEl.querySelector('[data-dqit-tree]');
      if (tree) tree.innerHTML = renderTree();
    } else if (action === 'query') {
      var input = pageEl.querySelector('#dqitKeywordInput');
      state.filters.keyword = input ? input.value.trim() : '';
      state.page = 1;
      state.selectedIds = {};
      renderMain();
    } else if (action === 'start-selected') {
      openOperation('start', getSelectedIds());
    } else if (action === 'stop-selected') {
      openOperation('stop', getSelectedIds());
    } else if (action === 'delete-selected') {
      openOperation('delete', getSelectedIds());
    } else if (action === 'start-row') {
      openOperation('start', [id]);
    } else if (action === 'stop-row') {
      openOperation('stop', [id]);
    } else if (action === 'delete-row') {
      openOperation('delete', [id]);
    } else if (action === 'close-modal') {
      closeModal();
    } else if (action === 'confirm-modal') {
      applyOperation();
    } else if (action === 'view-row') {
      showToast('查看详情入口已保留，详情页未设计');
    } else if (action === 'edit-row') {
      showToast('编辑入口已保留，编辑页未设计');
    } else if (action.indexOf('entry-') === 0) {
      showToast('创建入口已保留，本次只设计列表页面');
    }
  }

  function bindEvents() {
    pageEl.addEventListener('click', function (e) {
      var mask = e.target.closest('[data-dqit-modal-mask]');
      if (mask && e.target === mask) {
        closeModal();
        return;
      }

      var actionEl = e.target.closest('[data-dqit-action]');
      if (actionEl && pageEl.contains(actionEl)) {
        handleAction(actionEl);
        return;
      }

      var treeRow = e.target.closest('[data-dqit-tree-key]');
      if (treeRow && pageEl.contains(treeRow)) {
        state.treeKey = treeRow.getAttribute('data-dqit-tree-key') || 'demo';
        state.page = 1;
        state.selectedIds = {};
        renderAll();
        return;
      }

      var pageBtn = e.target.closest('[data-dqit-page]');
      if (pageBtn && pageEl.contains(pageBtn) && !pageBtn.disabled) {
        var rows = getFilteredRows();
        var totalPages = Math.max(1, Math.ceil(rows.length / state.pageSize));
        var target = pageBtn.getAttribute('data-dqit-page');
        if (target === 'prev') state.page = Math.max(1, state.page - 1);
        else if (target === 'next') state.page = Math.min(totalPages, state.page + 1);
        else state.page = Number(target) || 1;
        renderMain();
      }
    });

    pageEl.addEventListener('change', function (e) {
      if (e.target.matches('[data-dqit-filter="status"]')) {
        state.filters.status = e.target.value;
        state.page = 1;
        state.selectedIds = {};
        renderMain();
        return;
      }
      if (e.target.matches('[data-dqit-check-all]')) {
        getVisibleRows().forEach(function (item) {
          if (e.target.checked) state.selectedIds[item.id] = true;
          else delete state.selectedIds[item.id];
        });
        renderMain();
        return;
      }
      if (e.target.matches('[data-dqit-row-check]')) {
        var id = e.target.getAttribute('data-dqit-row-check');
        if (e.target.checked) state.selectedIds[id] = true;
        else delete state.selectedIds[id];
        renderMain();
        return;
      }
      if (e.target.matches('[data-dqit-page-size]')) {
        state.pageSize = Number(e.target.value) || 16;
        state.page = 1;
        state.selectedIds = {};
        renderMain();
      }
    });

    pageEl.addEventListener('input', function (e) {
      if (e.target.matches('[data-dqit-tree-search]')) {
        state.treeKeyword = e.target.value;
        var tree = pageEl.querySelector('[data-dqit-tree]');
        if (tree) tree.innerHTML = renderTree();
      }
    });

    pageEl.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && e.target.id === 'dqitKeywordInput') {
        var query = pageEl.querySelector('[data-dqit-action="query"]');
        if (query) query.click();
      }
      if (e.key === 'Escape' && state.modal) {
        closeModal();
      }
    });
  }

  function resetState() {
    state.treeKey = 'demo';
    state.treeKeyword = '';
    state.treeOpen = {
      demo: true,
      'demo-warehouse': true,
      business: true,
      'biz-core': true,
      standard: true,
      'standard-domain': true
    };
    state.selectedIds = {};
    state.page = 1;
    state.pageSize = 16;
    state.filters = { status: '', keyword: '' };
    state.modal = null;
  }

  var html = '<div class="page-quality-inspect-task">' +
    '<aside class="dqit-left-panel">' +
      '<div class="dqit-tree-search">' +
        '<input type="text" data-dqit-tree-search placeholder="关键字搜索" aria-label="关键字搜索">' +
        '<button type="button" aria-label="搜索目录"><i class="bi bi-search"></i></button>' +
      '</div>' +
      '<div class="dqit-tree-scroll"><ul class="dqit-tree" data-dqit-tree></ul></div>' +
    '</aside>' +
    '<section class="dqit-main-panel" data-dqit-main></section>' +
  '</div>';

  return {
    html: html,
    init: function () {
      pageEl = document.querySelector('.page-quality-inspect-task');
      if (!pageEl) return;
      resetState();
      bindEvents();
      renderAll();
    }
  };
})();
