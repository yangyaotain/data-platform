/**
 * 数据中台 V4.0 - 数据资产 / 数据标准管理 / 数据标准
 * 静态高保真原型：标准列表 + 新建编辑查看 + 导入导出 + 日志查看
 */
window.DP = window.DP || {};
DP.pages = DP.pages || {};

DP.pages.dataStandard = (function () {
  var pageEl = null;

  var standardTree = [
    {
      key: 'biz',
      label: '业务部',
      count: 25,
      icon: 'bi-folder-fill',
      children: [
        {
          key: 'trade',
          label: '交易域',
          count: 9,
          icon: 'bi-folder2-open',
          children: [
            { key: 'trade_order', label: '订单履约', count: 5, icon: 'bi-bookmark-fill' },
            { key: 'trade_settle', label: '支付结算', count: 4, icon: 'bi-bookmark-fill' }
          ]
        },
        {
          key: 'customer',
          label: '客户域',
          count: 6,
          icon: 'bi-folder2-open',
          children: [
            { key: 'customer_profile', label: '客户画像', count: 3, icon: 'bi-bookmark-fill' },
            { key: 'customer_service', label: '服务工单', count: 3, icon: 'bi-bookmark-fill' }
          ]
        },
        {
          key: 'public_domain',
          label: '公共域',
          count: 5,
          icon: 'bi-folder2-open',
          children: [
            { key: 'public_master', label: '主数据标识', count: 2, icon: 'bi-bookmark-fill' },
            { key: 'public_common', label: '通用属性', count: 3, icon: 'bi-bookmark-fill' }
          ]
        },
        {
          key: 'risk',
          label: '风控域',
          count: 5,
          icon: 'bi-folder2-open',
          children: [
            { key: 'risk_asset', label: '资源识别', count: 2, icon: 'bi-bookmark-fill' },
            { key: 'risk_security', label: '安全合规', count: 3, icon: 'bi-bookmark-fill' }
          ]
        }
      ]
    },
    {
      key: 'warehouse',
      label: '数仓组',
      count: 2,
      icon: 'bi-folder-fill',
      children: [
        { key: 'warehouse_ods', label: 'ODS贴源层', count: 5, icon: 'bi-database-fill' },
        { key: 'warehouse_dwd', label: 'DWD明细层', count: 7, icon: 'bi-database-fill' },
        { key: 'warehouse_dws', label: 'DWS汇总层', count: 6, icon: 'bi-database-fill' },
        { key: 'warehouse_ads', label: 'ADS应用层', count: 8, icon: 'bi-database-fill' },
        { key: 'warehouse_dim', label: 'DIM维表层', count: 4, icon: 'bi-database-fill' }
      ]
    }
  ];

  function row(code, englishName, alias, objectType, metaModel, meaning, publishStatus, auditStatus, groupKey, extra) {
    extra = extra || {};
    return {
      id: '',
      code: code,
      englishName: englishName,
      alias: alias,
      objectType: objectType,
      metaModel: metaModel,
      meaning: meaning,
      publishStatus: publishStatus,
      auditStatus: auditStatus,
      groupKey: groupKey,
      dataType: extra.dataType || '',
      length: extra.length || '',
      precision: extra.precision || '',
      desensitizeRule: extra.desensitizeRule || '请选择',
      qualityRule: extra.qualityRule || '请选择',
      encryptRule: extra.encryptRule || '请选择',
      dataClass: extra.dataClass || (groupKey === 'warehouse' ? '数仓组' : '业务部'),
      dataLevel: extra.dataLevel || '请选择',
      description: extra.description || meaning
    };
  }

  var standardRows = [
    row('order_00000004', 'REVENUE', '当日收入', '字段', '字段模型', '当日收入', '编制', '废止通过', 'trade_settle', { dataType: 'decimal', length: '18', precision: '2', qualityRule: '金额非负校验(金额字段必须大于等于0)', dataLevel: '对内公开(L2)' }),
    row('order_00000006', 'IR_PVMN', 'ir_pvmn', '字段', '字段模型', 'ir_pvmn', '已发布', '发布通过', 'risk_asset', { dataType: 'varchar', length: '64', dataLevel: '对内公开(L2)' }),
    row('order_00000008', 'master_id', '主数据编码', '字段', '字段模型', '主数据编码', '已发布', '发布通过', 'public_master', { dataType: 'varchar', length: '32', qualityRule: '唯一性校验(主数据编码不可重复)' }),
    row('order_00000009', 'cw_number', '标价', '字段', '字段模型', '标价', '已发布', '发布通过', 'trade_settle', { dataType: 'decimal', length: '18', precision: '2', qualityRule: '金额非负校验(金额字段必须大于等于0)' }),
    row('order_00000010', 'UPDATE_TIME', '更新时间', '字段', '字段模型', '更新时间', '已发布', '发布通过', 'public_common', { dataType: 'timestamp', length: '19', qualityRule: '及时性校验(更新时间不得晚于当前时间)' }),
    row('order_00000011', 'IP', '活跃资源IP信息', '字段', '字段模型', '活跃资源IP信息', '已发布', '发布通过', 'risk_security', { dataType: 'varchar', length: '32', desensitizeRule: 'IP地址(IP地址正则脱敏)', dataLevel: '机密数据(L3)' }),
    row('order_00000012', 'CRETAE_TIME', '创建时间', '字段', '字段模型', '创建时间', '已发布', '发布通过', 'public_common', { dataType: 'timestamp', length: '19' }),
    row('order_00000007', 'ID', '主键ID', '字段', '字段模型', '主键ID', '已发布', '发布通过', 'public_master', { dataType: 'bigint', length: '20', qualityRule: '唯一性校验(主键ID不可重复)' }),
    row('order_00000014', 'DESCRIPTION', '备注说明', '字段', '字段模型', '备注说明', '已发布', '发布通过', 'public_common', { dataType: 'varchar', length: '500' }),
    row('order_00000015', 'create_date', '创建日期时间', '字段', '字段模型', '创建日期时间', '已发布', '发布通过', 'public_common', { dataType: 'date', length: '10' }),
    row('db_00000001', 'zz_tms_ads', '运输主题应用库', '库', '库模型', '承载运输履约、城市配送、运力效率等应用层指标', '编制', '待提交', 'warehouse_ads'),
    row('table_00000001', 'ads_driver_stats', '司机绩效统计表', '表', '表模型', '按天统计司机接单、履约、超时和里程表现', '编制', '待提交', 'warehouse_ads'),
    row('order_00000016', 'pay_amount', '支付金额', '字段', '字段模型', '订单实际支付金额', '编制', '待提交', 'trade_settle', { dataType: 'decimal', length: '18', precision: '2', qualityRule: '金额非负校验(金额字段必须大于等于0)' }),
    row('order_00000017', 'order_status', '订单状态', '字段', '字段模型', '订单全生命周期状态', '已发布', '发布通过', 'trade_order', { dataType: 'varchar', length: '20', qualityRule: '取值范围约束(订单状态必须在标准代码内)' }),
    row('order_00000018', 'customer_id', '客户ID', '字段', '字段模型', '客户主数据唯一标识', '已发布', '发布通过', 'customer_profile', { dataType: 'varchar', length: '32', dataLevel: '机密数据(L3)' })
  ];

  standardRows.forEach(function (item, index) {
    item.id = index + 1;
  });

  var ioRows = [
    { id: 1, fileName: '字段模型-20260617151930.xls', attr: '导出', status: '处理失败', success: 10, fail: 0, total: 10, operator: '演示-测试', time: '2026-06-17 15:19:34' },
    { id: 2, fileName: '数据标准导入模板.xls', attr: '导入', status: '处理中', success: 0, fail: 0, total: 0, operator: '演示-测试', time: '2026-04-09 17:58:17' }
  ];

  var state = {
    activeTab: 'list',
    treeKey: 'biz',
    treeKeyword: '',
    selectedIds: {},
    page: 1,
    pageSize: 10,
    sortKey: 'code',
    sortDir: 'asc',
    filters: {
      metaModel: '',
      objectType: '',
      publishStatus: '',
      auditStatus: '',
      keyword: ''
    },
    ioFilters: {
      attr: '',
      status: '',
      keyword: ''
    },
    createMenuOpen: false,
    formMode: '',
    formType: 'field',
    editRowId: '',
    viewRowId: '',
    logId: ''
  };

  function resetState() {
    state.activeTab = 'list';
    state.treeKey = 'biz';
    state.treeKeyword = '';
    state.selectedIds = {};
    state.page = 1;
    state.pageSize = 10;
    state.sortKey = 'code';
    state.sortDir = 'asc';
    state.filters = { metaModel: '', objectType: '', publishStatus: '', auditStatus: '', keyword: '' };
    state.ioFilters = { attr: '', status: '', keyword: '' };
    state.createMenuOpen = false;
    state.formMode = '';
    state.formType = 'field';
    state.editRowId = '';
    state.viewRowId = '';
    state.logId = '';
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function typeToMeta(type) {
    if (type === 'database') return { objectType: '库', metaModel: '库模型', title: '库模型' };
    if (type === 'table') return { objectType: '表', metaModel: '表模型', title: '表模型' };
    return { objectType: '字段', metaModel: '字段模型', title: '字段模型' };
  }

  function getTypeFromRow(row) {
    if (!row) return 'field';
    if (row.objectType === '库') return 'database';
    if (row.objectType === '表') return 'table';
    return 'field';
  }

  function getRowById(id) {
    return standardRows.filter(function (item) { return String(item.id) === String(id); })[0] || null;
  }

  function getIoById(id) {
    return ioRows.filter(function (item) { return String(item.id) === String(id); })[0] || null;
  }

  function getSelectedRows() {
    return Object.keys(state.selectedIds).map(getRowById).filter(Boolean);
  }

  function findTreeNode(nodes, key) {
    for (var i = 0; i < nodes.length; i++) {
      if (nodes[i].key === key) return nodes[i];
      var child = findTreeNode(nodes[i].children || [], key);
      if (child) return child;
    }
    return null;
  }

  function collectTreeKeys(node) {
    if (!node) return [];
    return [node.key].concat((node.children || []).reduce(function (keys, child) {
      return keys.concat(collectTreeKeys(child));
    }, []));
  }

  function getActiveTreeKeys() {
    return collectTreeKeys(findTreeNode(standardTree, state.treeKey));
  }

  function isInActiveTree(item) {
    var keys = getActiveTreeKeys();
    return !state.treeKey || keys.indexOf(item.groupKey) >= 0;
  }

  function getFilteredRows() {
    var keyword = state.filters.keyword.trim().toLowerCase();
    var rows = standardRows.filter(function (item) {
      if (!isInActiveTree(item)) return false;
      if (state.filters.metaModel && item.metaModel !== state.filters.metaModel) return false;
      if (state.filters.objectType && item.objectType !== state.filters.objectType) return false;
      if (state.filters.publishStatus && item.publishStatus !== state.filters.publishStatus) return false;
      if (state.filters.auditStatus && item.auditStatus !== state.filters.auditStatus) return false;
      if (!keyword) return true;
      return [item.code, item.englishName, item.alias, item.objectType, item.metaModel, item.meaning].join(' ').toLowerCase().indexOf(keyword) >= 0;
    });

    if (!state.sortKey) return rows;
    return rows.slice().sort(function (a, b) {
      var av = String(a[state.sortKey] || '');
      var bv = String(b[state.sortKey] || '');
      if (av > bv) return state.sortDir === 'asc' ? 1 : -1;
      if (av < bv) return state.sortDir === 'asc' ? -1 : 1;
      return 0;
    });
  }

  function getVisibleRows() {
    var rows = getFilteredRows();
    var totalPages = Math.max(1, Math.ceil(rows.length / state.pageSize));
    if (state.page > totalPages) state.page = totalPages;
    var start = (state.page - 1) * state.pageSize;
    return rows.slice(start, start + state.pageSize);
  }

  function getIoRows() {
    var keyword = state.ioFilters.keyword.trim().toLowerCase();
    return ioRows.filter(function (item) {
      if (state.ioFilters.attr && item.attr !== state.ioFilters.attr) return false;
      if (state.ioFilters.status && item.status !== state.ioFilters.status) return false;
      if (!keyword) return true;
      return item.fileName.toLowerCase().indexOf(keyword) >= 0;
    });
  }

  function showToast(text) {
    if (!pageEl) return;
    var old = pageEl.querySelector('.dsd-toast');
    if (old) old.remove();
    var toast = document.createElement('div');
    toast.className = 'dsd-toast';
    toast.innerHTML = '<i class="bi bi-check-circle"></i><span>' + escapeHtml(text) + '</span>';
    pageEl.appendChild(toast);
    setTimeout(function () { toast.classList.add('show'); }, 10);
    setTimeout(function () {
      toast.classList.remove('show');
      setTimeout(function () { if (toast.parentNode) toast.remove(); }, 180);
    }, 1800);
  }

  function updateContent() {
    if (!pageEl) return;
    var tabs = pageEl.querySelector('[data-dsd-tabs]');
    var view = pageEl.querySelector('[data-dsd-view]');
    if (tabs) tabs.innerHTML = renderTabs();
    if (view) view.innerHTML = renderActiveView();
    syncFilterControls();
    updateCheckAll();
    updateSortButtons();
  }

  function treeNodeMatches(node, keyword) {
    if (!keyword) return true;
    var text = (node.label + ' ' + (node.count || '')).toLowerCase();
    if (text.indexOf(keyword) >= 0) return true;
    return (node.children || []).some(function (child) {
      return treeNodeMatches(child, keyword);
    });
  }

  function renderTreeNodes(nodes, keyword, forceShowChildren) {
    return nodes.filter(function (node) {
      return forceShowChildren || treeNodeMatches(node, keyword);
    }).map(function (node) {
      var ownMatched = !keyword || (node.label + ' ' + (node.count || '')).toLowerCase().indexOf(keyword) >= 0;
      var children = node.children || [];
      var childHtml = children.length
        ? '<ul class="dsd-tree-children">' + renderTreeNodes(children, keyword, forceShowChildren || ownMatched) + '</ul>'
        : '';
      return '<li class="dsd-tree-node">' +
        '<button class="dsd-tree-row' + (state.treeKey === node.key ? ' active' : '') + '" type="button" data-dsd-tree-key="' + node.key + '">' +
          '<i class="bi ' + node.icon + '"></i><span class="dsd-tree-name">' + escapeHtml(node.label) + '</span>' +
          '<span class="dsd-tree-count">' + escapeHtml(node.count || 0) + '</span>' +
        '</button>' +
        childHtml +
      '</li>';
    }).join('');
  }

  function renderTree() {
    if (!pageEl) return;
    var tree = pageEl.querySelector('[data-dsd-tree]');
    if (!tree) return;
    var keyword = state.treeKeyword.trim().toLowerCase();
    var html = renderTreeNodes(standardTree, keyword, false);
    tree.innerHTML = html || '<li class="dsd-tree-empty">暂无匹配分类</li>';
  }

  function renderTabs() {
    var active = state.activeTab === 'log' ? 'io' : state.activeTab;
    return [
      { key: 'list', text: '数据列表' },
      { key: 'io', text: '导入导出' }
    ].map(function (tab) {
      return '<button class="dsd-tab' + (active === tab.key ? ' active' : '') + '" type="button" data-dsd-tab="' + tab.key + '">' + tab.text + '</button>';
    }).join('');
  }

  function renderActiveView() {
    if (state.formMode) return renderFormPage();
    if (state.activeTab === 'log') return renderLogView();
    if (state.activeTab === 'io') return renderIoView();
    return renderListView();
  }

  function sortHeader(key, label) {
    return '<button class="dsd-th-sort" type="button" data-dsd-sort="' + key + '">' +
      '<span>' + label + '</span>' +
      '<span class="dsd-sort-stack"><i class="bi bi-caret-up-fill"></i><i class="bi bi-caret-down-fill"></i></span>' +
    '</button>';
  }

  function renderCreateMenu() {
    return '<div class="dsd-create-menu' + (state.createMenuOpen ? ' open' : '') + '">' +
      '<button class="btn btn-primary" type="button" data-dsd-action="toggle-create"><i class="bi bi-plus-lg"></i><span>新建</span><i class="bi bi-caret-down-fill"></i></button>' +
      '<div class="dsd-create-dropdown">' +
        '<button type="button" data-dsd-action="create" data-type="field"><i class="bi bi-card-text"></i><span>字段模型（字段）</span></button>' +
        '<button type="button" data-dsd-action="create" data-type="database"><i class="bi bi-database"></i><span>库模型（库）</span></button>' +
        '<button type="button" data-dsd-action="create" data-type="table"><i class="bi bi-table"></i><span>表模型（表）</span></button>' +
      '</div>' +
    '</div>';
  }

  function renderListView() {
    var rows = getFilteredRows();
    var visibleRows = getVisibleRows();
    return '<div class="dsd-toolbar">' +
      '<div class="dsd-toolbar-left">' +
        renderCreateMenu() +
        '<button class="btn btn-primary" type="button" data-dsd-action="import"><i class="bi bi-upload"></i><span>导入</span></button>' +
        '<button class="btn btn-primary" type="button" data-dsd-action="export"><i class="bi bi-download"></i><span>导出</span></button>' +
        '<button class="btn btn-primary" type="button" data-dsd-action="publish-selected"><i class="bi bi-send-check"></i><span>发布</span></button>' +
        '<button class="btn btn-danger" type="button" data-dsd-action="abolish-selected"><i class="bi bi-slash-circle"></i><span>废止</span></button>' +
        '<button class="btn btn-danger" type="button" data-dsd-action="delete-selected"><i class="bi bi-trash3"></i><span>删除</span></button>' +
      '</div>' +
      '<div class="dsd-toolbar-right">' +
        '<select class="dsd-filter" data-dsd-filter="metaModel" aria-label="元模型"><option value="">元模型</option><option value="字段模型">字段模型</option><option value="库模型">库模型</option><option value="表模型">表模型</option></select>' +
        '<select class="dsd-filter" data-dsd-filter="objectType" aria-label="对象"><option value="">对象</option><option value="字段">字段</option><option value="库">库</option><option value="表">表</option></select>' +
        '<select class="dsd-filter" data-dsd-filter="publishStatus" aria-label="发布状态"><option value="">发布状态</option><option value="编制">编制</option><option value="已发布">已发布</option><option value="已废止">已废止</option></select>' +
        '<select class="dsd-filter" data-dsd-filter="auditStatus" aria-label="审核状态"><option value="">审核状态</option><option value="待提交">待提交</option><option value="发布通过">发布通过</option><option value="废止通过">废止通过</option></select>' +
        '<div class="dsd-query"><input type="text" data-dsd-keyword value="' + escapeHtml(state.filters.keyword) + '" placeholder="编码/英文名/别名" aria-label="编码英文名别名"><button class="btn btn-primary" type="button" data-dsd-action="query"><i class="bi bi-search"></i><span>查询</span></button></div>' +
      '</div>' +
    '</div>' +
    '<div class="dsd-table-wrap dsd-list-table-wrap">' +
      '<table class="dsd-table dsd-list-table">' +
        '<colgroup><col class="dsd-w-check"><col class="dsd-w-code"><col class="dsd-w-name"><col class="dsd-w-alias"><col class="dsd-w-object"><col class="dsd-w-model"><col class="dsd-w-meaning"><col class="dsd-w-status"><col class="dsd-w-audit"><col class="dsd-w-action"></colgroup>' +
        '<thead><tr>' +
          '<th class="dsd-col-check"><input type="checkbox" data-dsd-check-all aria-label="全选"></th>' +
          '<th>' + sortHeader('code', '编码') + '</th>' +
          '<th>' + sortHeader('englishName', '英文名称') + '</th>' +
          '<th>' + sortHeader('alias', '别名') + '</th>' +
          '<th>' + sortHeader('objectType', '对象') + '</th>' +
          '<th>' + sortHeader('metaModel', '元模型') + '</th>' +
          '<th>' + sortHeader('meaning', '含义说明') + '</th>' +
          '<th>' + sortHeader('publishStatus', '发布状态') + '</th>' +
          '<th>' + sortHeader('auditStatus', '审核状态') + '</th>' +
          '<th>操作</th>' +
        '</tr></thead>' +
        '<tbody>' + (visibleRows.length ? visibleRows.map(renderDataRow).join('') : '<tr class="dsd-empty-row"><td colspan="10">暂无匹配的数据标准</td></tr>') + '</tbody>' +
      '</table>' +
    '</div>' +
    renderPager(rows.length);
  }

  function renderDataRow(item) {
    return '<tr>' +
      '<td class="dsd-col-check"><input type="checkbox" data-dsd-row-check="' + item.id + '"' + (state.selectedIds[item.id] ? ' checked' : '') + ' aria-label="选择记录"></td>' +
      '<td title="' + escapeHtml(item.code) + '">' + escapeHtml(item.code) + '</td>' +
      '<td title="' + escapeHtml(item.englishName) + '">' + escapeHtml(item.englishName) + '</td>' +
      '<td title="' + escapeHtml(item.alias) + '">' + escapeHtml(item.alias) + '</td>' +
      '<td>' + escapeHtml(item.objectType) + '</td>' +
      '<td>' + escapeHtml(item.metaModel) + '</td>' +
      '<td title="' + escapeHtml(item.meaning) + '">' + escapeHtml(item.meaning) + '</td>' +
      '<td>' + renderPublishStatus(item.publishStatus) + '</td>' +
      '<td>' + renderAuditStatus(item.auditStatus) + '</td>' +
      '<td>' + renderRowActions(item) + '</td>' +
    '</tr>';
  }

  function renderPublishStatus(status) {
    var cls = status === '已发布' ? ' published' : (status === '已废止' ? ' abolished' : ' draft');
    return '<span class="dsd-status' + cls + '">' + escapeHtml(status) + '</span>';
  }

  function renderAuditStatus(status) {
    var cls = status.indexOf('通过') >= 0 ? ' pass' : ' waiting';
    return '<span class="dsd-audit' + cls + '">' + escapeHtml(status) + '</span>';
  }

  function renderRowActions(item) {
    var common = '<button class="dsd-action-btn" type="button" data-dsd-action="view" data-id="' + item.id + '"><i class="bi bi-file-earmark-text"></i><span>查看</span></button>';
    if (item.publishStatus === '已发布') {
      return '<div class="dsd-actions">' + common +
        '<button class="dsd-action-btn danger" type="button" data-dsd-action="abolish-row" data-id="' + item.id + '"><i class="bi bi-slash-circle"></i><span>废止</span></button>' +
      '</div>';
    }
    if (item.publishStatus !== '编制') {
      return '<div class="dsd-actions">' + common + '</div>';
    }
    return '<div class="dsd-actions">' + common +
      '<button class="dsd-action-btn" type="button" data-dsd-action="edit" data-id="' + item.id + '"><i class="bi bi-pencil-square"></i><span>编辑</span></button>' +
      '<button class="dsd-action-btn" type="button" data-dsd-action="publish-row" data-id="' + item.id + '"><i class="bi bi-share-fill"></i><span>发布</span></button>' +
      '<button class="dsd-action-btn danger" type="button" data-dsd-action="delete-row" data-id="' + item.id + '"><i class="bi bi-trash3"></i><span>删除</span></button>' +
    '</div>';
  }

  function renderPager(total) {
    var totalPages = Math.max(1, Math.ceil(total / state.pageSize));
    var start = total ? (state.page - 1) * state.pageSize + 1 : 0;
    var end = Math.min(state.page * state.pageSize, total);
    var pageBtns = '';
    for (var i = 1; i <= totalPages; i++) {
      pageBtns += '<button class="dsd-page-num' + (i === state.page ? ' active' : '') + '" type="button" data-dsd-page="' + i + '">' + i + '</button>';
    }
    return '<div class="dsd-pagination">' +
      '<div class="dsd-page-info">显示第 ' + start + ' 到第 ' + end + ' 条记录，总共 ' + total + ' 条记录&nbsp;&nbsp;每页显示' +
        '<select class="dsd-page-size" data-dsd-page-size aria-label="每页显示条数">' +
          '<option value="10"' + (state.pageSize === 10 ? ' selected' : '') + '>10</option>' +
          '<option value="20"' + (state.pageSize === 20 ? ' selected' : '') + '>20</option>' +
          '<option value="50"' + (state.pageSize === 50 ? ' selected' : '') + '>50</option>' +
        '</select>条记录</div>' +
      '<div class="dsd-page-nav">' +
        '<button class="dsd-page-btn" type="button" data-dsd-page="prev"' + (state.page === 1 ? ' disabled' : '') + '><i class="bi bi-chevron-left"></i></button>' +
        pageBtns +
        '<button class="dsd-page-btn" type="button" data-dsd-page="next"' + (state.page === totalPages ? ' disabled' : '') + '><i class="bi bi-chevron-right"></i></button>' +
        '<input class="dsd-page-jump" value="' + state.page + '" aria-label="跳转页码"><button class="dsd-page-go" type="button" data-dsd-action="page-go">GO</button>' +
      '</div>' +
    '</div>';
  }

  function defaultFormData(type) {
    var meta = typeToMeta(type);
    var prefix = type === 'database' ? 'db_' : (type === 'table' ? 'table_' : 'order_');
    var nextNo = String(standardRows.length + 1).padStart(8, '0');
    return {
      code: prefix + nextNo,
      englishName: '',
      alias: '',
      objectType: meta.objectType,
      metaModel: meta.metaModel,
      meaning: '',
      dataType: '',
      length: '',
      precision: '',
      desensitizeRule: '请选择',
      qualityRule: '请选择',
      encryptRule: '请选择',
      dataClass: state.treeKey === 'warehouse' ? '数仓组' : '业务部',
      dataLevel: '请选择'
    };
  }

  function getFormData() {
    var item = state.formMode === 'create' ? null : getRowById(state.editRowId || state.viewRowId);
    if (!item) return defaultFormData(state.formType);
    return {
      code: item.code,
      englishName: item.englishName,
      alias: item.alias,
      objectType: item.objectType,
      metaModel: item.metaModel,
      meaning: item.meaning,
      dataType: item.dataType,
      length: item.length,
      precision: item.precision,
      desensitizeRule: item.desensitizeRule,
      qualityRule: item.qualityRule,
      encryptRule: item.encryptRule,
      dataClass: item.dataClass,
      dataLevel: item.dataLevel
    };
  }

  function editTextField(name, label, value, required, disabled) {
    return '<div class="dsd-edit-row">' +
      '<label class="dsd-edit-label" for="dsd-edit-' + name + '">' + (required ? '<em>*</em>' : '') + label + '</label>' +
      '<input id="dsd-edit-' + name + '" class="dsd-edit-control" data-dsd-edit="' + name + '" value="' + escapeHtml(value) + '"' + (disabled ? ' disabled' : '') + '>' +
      '<span class="dsd-edit-tip"><i class="bi bi-info-circle-fill"></i>' + label + ';</span>' +
    '</div>';
  }

  function editTextarea(name, label, value, disabled) {
    return '<div class="dsd-edit-row dsd-edit-row-area">' +
      '<label class="dsd-edit-label" for="dsd-edit-' + name + '">' + label + '</label>' +
      '<textarea id="dsd-edit-' + name + '" class="dsd-edit-control" data-dsd-edit="' + name + '"' + (disabled ? ' disabled' : '') + '>' + escapeHtml(value) + '</textarea>' +
      '<span class="dsd-edit-tip"><i class="bi bi-info-circle-fill"></i>' + label + ';</span>' +
    '</div>';
  }

  function editSelectField(name, label, value, options, disabled) {
    if (disabled) return editTextField(name, label, value, false, true);
    if (value && options.indexOf(value) < 0) options = [value].concat(options);
    return '<div class="dsd-edit-row">' +
      '<label class="dsd-edit-label" for="dsd-edit-' + name + '">' + label + '</label>' +
      '<div class="dsd-combo" data-dsd-combo>' +
        '<input id="dsd-edit-' + name + '" type="hidden" data-dsd-edit="' + name + '" value="' + escapeHtml(value) + '">' +
        '<button class="dsd-edit-control dsd-combo-trigger" type="button" data-dsd-combo-trigger><span data-dsd-combo-text>' + escapeHtml(value || '请选择') + '</span><i class="bi bi-caret-down-fill"></i></button>' +
        '<div class="dsd-combo-panel">' +
          '<input class="dsd-combo-search" type="text" data-dsd-combo-search aria-label="' + label + '搜索">' +
          '<div class="dsd-combo-options">' + options.map(function (option) {
            return '<button class="dsd-combo-option' + (option === value ? ' active' : '') + '" type="button" data-dsd-combo-option data-value="' + escapeHtml(option) + '">' + escapeHtml(option) + '</button>';
          }).join('') + '</div>' +
        '</div>' +
      '</div>' +
      '<span class="dsd-edit-tip"><i class="bi bi-info-circle-fill"></i>' + label + ';</span>' +
    '</div>';
  }

  function renderBasicSection(data, readonly) {
    return '<section class="dsd-edit-section">' +
      '<h3>基本信息</h3>' +
      editTextField('code', '编码', data.code, true, true) +
      editTextField('englishName', '英文名', data.englishName, true, readonly) +
      editTextField('alias', '别名', data.alias, true, readonly) +
      editTextarea('meaning', '描述', data.meaning, readonly) +
    '</section>';
  }

  function renderTechnicalSection(data, readonly) {
    return '<section class="dsd-edit-section">' +
      '<h3>技术信息</h3>' +
      editTextField('dataType', '数据类型', data.dataType, false, readonly) +
      editTextField('length', '长度', data.length, false, readonly) +
      editTextField('precision', '精度', data.precision, false, readonly) +
      editSelectField('desensitizeRule', '脱敏规则', data.desensitizeRule, ['请选择', '手机号(手机号正则脱敏)', '身份证号(身份证号正则脱敏)', 'IP地址(IP地址正则脱敏)', '地址(地址正则脱敏)', '银行卡号(银行卡号正则脱敏)'], readonly) +
      editSelectField('qualityRule', '质量规则', data.qualityRule, ['请选择', '长度校验(模型字段长度规范值)', '唯一性校验(字段值不可重复)', '取值范围约束(字段值必须在标准范围内)', '金额非负校验(金额字段必须大于等于0)', '及时性校验(时间字段不得晚于当前时间)'], readonly) +
      editSelectField('encryptRule', '加密规则', data.encryptRule, ['请选择', '国密SM2(国密SM2)', 'AES192加密(AES192加密)', '3DES加密(3DES加密)', 'MD5加密(MD5加密)'], readonly) +
    '</section>';
  }

  function renderBusinessSection(data, readonly, isFieldModel) {
    return '<section class="dsd-edit-section dsd-edit-section-last">' +
      '<h3>业务信息</h3>' +
      editSelectField('dataClass', '数据分类', data.dataClass, ['业务部', '数仓组', '财务结算域', '客户服务域', '公共维度域'], readonly) +
      (isFieldModel ? editSelectField('dataLevel', '数据分级', data.dataLevel, ['请选择', '绝密数据(L4)', '机密数据(L3)', '对内公开(L2)', '公开数据(L1)'], readonly) : '') +
      (readonly ? '' : '<div class="dsd-edit-footer">' +
        '<button class="btn btn-primary" type="button" data-dsd-action="save-form"><i class="bi bi-save"></i><span>保存</span></button>' +
        '<button class="btn btn-outline" type="button" data-dsd-action="cancel-form"><i class="bi bi-x-lg"></i><span>取消</span></button>' +
      '</div>') +
    '</section>';
  }

  function renderFormPage() {
    var data = getFormData();
    var readonly = state.formMode === 'view';
    var type = state.formMode === 'create' ? state.formType : getTypeFromRow(getRowById(state.editRowId || state.viewRowId));
    var meta = typeToMeta(type);
    var title = readonly ? '查看' : (state.formMode === 'create' ? '新建' + meta.title : '修改');
    return '<div class="dsd-edit-page" data-dsd-form="' + state.formMode + '">' +
      '<div class="dsd-edit-head">' +
        '<div class="dsd-edit-title"><i class="bi bi-list"></i><span>' + title + '</span></div>' +
        '<button class="btn btn-primary" type="button" data-dsd-action="back-list"><i class="bi bi-arrow-left"></i><span>返回</span></button>' +
      '</div>' +
      '<div class="dsd-edit-scroll">' +
        renderBasicSection(data, readonly) +
        (type === 'field' ? renderTechnicalSection(data, readonly) : '') +
        renderBusinessSection(data, readonly, type === 'field') +
      '</div>' +
    '</div>';
  }

  function renderIoView() {
    var rows = getIoRows();
    return '<div class="dsd-toolbar dsd-toolbar-compact">' +
      '<div class="dsd-toolbar-left"></div>' +
      '<div class="dsd-toolbar-right">' +
        '<select class="dsd-filter" data-dsd-io-filter="attr" aria-label="属性"><option value="">属性</option><option value="导入">导入</option><option value="导出">导出</option></select>' +
        '<select class="dsd-filter" data-dsd-io-filter="status" aria-label="状态"><option value="">状态</option><option value="处理中">处理中</option><option value="处理成功">处理成功</option><option value="处理失败">处理失败</option></select>' +
        '<div class="dsd-query"><input type="text" data-dsd-io-keyword value="' + escapeHtml(state.ioFilters.keyword) + '" placeholder="文件名" aria-label="文件名"><button class="btn btn-primary" type="button" data-dsd-action="query-io"><i class="bi bi-search"></i><span>查询</span></button></div>' +
      '</div>' +
    '</div>' +
    '<div class="dsd-table-wrap">' +
      '<table class="dsd-table dsd-io-table">' +
        '<colgroup><col class="dsd-io-file"><col class="dsd-io-attr"><col class="dsd-io-status"><col class="dsd-io-count"><col class="dsd-io-user"><col class="dsd-io-time"><col class="dsd-io-action"></colgroup>' +
        '<thead><tr><th>文件名</th><th>属性</th><th>状态</th><th>处理记录数(成功/失败/总量)</th><th>操作者</th><th>时间</th><th>操作</th></tr></thead>' +
        '<tbody>' + (rows.length ? rows.map(renderIoRow).join('') : '<tr class="dsd-empty-row"><td colspan="7">暂无匹配的导入导出记录</td></tr>') + '</tbody>' +
      '</table>' +
    '</div>' +
    '<div class="dsd-footnote">显示第 1 到第 ' + rows.length + ' 条记录，总共 ' + rows.length + ' 条记录</div>';
  }

  function renderIoRow(item) {
    return '<tr>' +
      '<td title="' + escapeHtml(item.fileName) + '">' + escapeHtml(item.fileName) + '</td>' +
      '<td><span class="dsd-io-attr-text">' + escapeHtml(item.attr) + '</span></td>' +
      '<td>' + renderIoStatus(item.status) + '</td>' +
      '<td><span class="dsd-success">' + item.success + '</span>/<span class="dsd-fail">' + item.fail + '</span>/' + item.total + '</td>' +
      '<td>' + escapeHtml(item.operator) + '</td>' +
      '<td>' + escapeHtml(item.time) + '</td>' +
      '<td>' + (item.status === '处理中' ? '<span class="dsd-muted">--</span>' : '<button class="dsd-action-btn danger" type="button" data-dsd-action="view-log" data-id="' + item.id + '"><i class="bi bi-file-text"></i><span>查看日志</span></button>') + '</td>' +
    '</tr>';
  }

  function renderIoStatus(status) {
    var cls = status === '处理成功' ? ' success' : (status === '处理中' ? ' running' : ' failed');
    return '<span class="dsd-io-status-text' + cls + '">' + escapeHtml(status) + '</span>';
  }

  function buildLogText(item) {
    var flowId = 'standard-' + String(item.id).padStart(4, '0') + '-20260617';
    var prefix = '17-06-2026 ' + item.time.slice(11) + ' CST data-standard-flow-' + flowId + ' INFO - ';
    var lines = [
      prefix + 'Starting job data-standard-flow-' + flowId,
      prefix + 'effective user is standard_admin',
      prefix + 'DataStandardTask - begin ' + (item.attr === '导出' ? 'export' : 'import') + ' file: /data/upload/standard/' + item.fileName,
      prefix + 'DataStandardTask - template columns: code,english_name,alias,object_type,meta_model,meaning,publish_status,audit_status',
      prefix + 'DataStandardTask - total rows parsed: ' + item.total,
      prefix + 'HiveWriter$Task - begin do write...',
      prefix + 'HiveWriter$Task - write to table: governance.dim_data_standard',
      prefix + 'StandAloneJobContainerCommunicator - total ' + item.total + ' records, success ' + item.success + ' records, failed ' + item.fail + ' records'
    ];
    if (item.status === '处理失败') {
      lines.push(prefix + 'WARN - export file generated with validation warnings.');
      lines.push(prefix + 'ERROR - row 7 field code order_00000012 spelling CRETAE_TIME needs manual confirmation.');
      lines.push(prefix + 'DataStandardTask - job finished with validation errors.');
    } else if (item.status === '处理中') {
      lines.push(prefix + 'DataStandardTask - task is still running, waiting for worker heartbeat.');
    } else {
      lines.push(prefix + 'DataStandardTask - commit standard changes success.');
      lines.push(prefix + 'DataStandardTask - job finished successfully.');
    }
    return lines.join('\n');
  }

  function renderLogView() {
    var item = getIoById(state.logId);
    if (!item) {
      return '<div class="dsd-log-empty"><button class="btn btn-outline" type="button" data-dsd-action="back-io"><i class="bi bi-arrow-left"></i><span>返回</span></button><span>未找到日志记录</span></div>';
    }
    return '<div class="dsd-log-view">' +
      '<div class="dsd-log-header">' +
        '<button class="btn btn-outline" type="button" data-dsd-action="back-io"><i class="bi bi-arrow-left"></i><span>返回</span></button>' +
        '<div><h3>任务处理日志</h3><p title="' + escapeHtml(item.fileName) + '">' + escapeHtml(item.fileName) + '</p></div>' +
      '</div>' +
      '<pre class="dsd-tech-log">' + escapeHtml(buildLogText(item)) + '</pre>' +
    '</div>';
  }

  function syncFilterControls() {
    Object.keys(state.filters).forEach(function (key) {
      var filter = pageEl.querySelector('[data-dsd-filter="' + key + '"]');
      if (filter) filter.value = state.filters[key];
    });
    Object.keys(state.ioFilters).forEach(function (key) {
      var filter = pageEl.querySelector('[data-dsd-io-filter="' + key + '"]');
      if (filter) filter.value = state.ioFilters[key];
    });
  }

  function updateCheckAll() {
    var checkAll = pageEl.querySelector('[data-dsd-check-all]');
    if (!checkAll) return;
    var visibleRows = getVisibleRows();
    var checked = visibleRows.filter(function (item) { return state.selectedIds[item.id]; }).length;
    checkAll.checked = visibleRows.length > 0 && checked === visibleRows.length;
    checkAll.indeterminate = checked > 0 && checked < visibleRows.length;
  }

  function updateSortButtons() {
    pageEl.querySelectorAll('[data-dsd-sort]').forEach(function (button) {
      var key = button.getAttribute('data-dsd-sort');
      if (key === state.sortKey) button.setAttribute('data-sort-dir', state.sortDir);
      else button.removeAttribute('data-sort-dir');
    });
  }

  function closeCombos(except) {
    pageEl.querySelectorAll('[data-dsd-combo].open').forEach(function (combo) {
      if (combo !== except) combo.classList.remove('open');
    });
  }

  function filterCombo(combo, keyword) {
    keyword = keyword.trim().toLowerCase();
    combo.querySelectorAll('[data-dsd-combo-option]').forEach(function (option) {
      option.style.display = !keyword || option.textContent.toLowerCase().indexOf(keyword) >= 0 ? '' : 'none';
    });
  }

  function selectComboValue(combo, value) {
    var input = combo.querySelector('[data-dsd-edit]');
    var text = combo.querySelector('[data-dsd-combo-text]');
    if (input) input.value = value;
    if (text) text.textContent = value || '请选择';
    combo.querySelectorAll('.active').forEach(function (item) { item.classList.remove('active'); });
    combo.querySelectorAll('[data-value]').forEach(function (item) {
      if (item.getAttribute('data-value') === value) item.classList.add('active');
    });
    combo.classList.remove('open');
  }

  function closeModal() {
    var modal = pageEl.querySelector('[data-dsd-modal]');
    if (modal) modal.remove();
  }

  function openImportModal() {
    closeModal();
    var modal = document.createElement('div');
    modal.className = 'dsd-modal-mask';
    modal.setAttribute('data-dsd-modal', 'import');
    modal.innerHTML =
      '<div class="dsd-modal dsd-import-modal" role="dialog" aria-modal="true" aria-label="导入">' +
        '<div class="dsd-modal-header"><h3>导入</h3><button class="dsd-modal-close" type="button" data-dsd-action="close-modal" aria-label="关闭"><i class="bi bi-x-lg"></i></button></div>' +
        '<div class="dsd-modal-body">' +
          '<div class="dsd-import-note">' +
            '<div><i class="bi bi-info-circle-fill"></i><span>请先导出数据，作为模板或者 <a href="javascript:;" data-dsd-action="download-template">下载空模板</a> 再导入；请勿修改模板结构</span></div>' +
            '<div><i class="bi bi-info-circle-fill"></i><span>数据导入为异步处理，请稍后在导入导出查看处理结果</span></div>' +
          '</div>' +
          '<label class="dsd-modal-row"><span><em>*</em>覆盖机制</span><select><option>重复覆盖</option><option>有值跳过</option></select></label>' +
          '<label class="dsd-modal-row"><span><em>*</em>上传文件</span><div class="dsd-file-box"><button class="dsd-file-picker" type="button" data-dsd-action="choose-file">选择文件</button><span class="dsd-file-name">未选择任何文件</span><button class="dsd-upload-link" type="button" data-dsd-action="mock-upload"><i class="bi bi-upload"></i><span>上传</span></button><strong><i class="bi bi-info-circle-fill"></i> 文件格式为excel，大小不超过50M</strong></div></label>' +
        '</div>' +
        '<div class="dsd-modal-footer"><button class="btn btn-primary" type="button" data-dsd-action="save-import"><i class="bi bi-check-lg"></i><span>确定</span></button><button class="btn btn-outline" type="button" data-dsd-action="close-modal"><i class="bi bi-x-lg"></i><span>取消</span></button></div>' +
      '</div>';
    pageEl.appendChild(modal);
  }

  function selectedOrWarn(actionText) {
    var selected = getSelectedRows();
    if (!selected.length) {
      showToast('请先选择需要' + actionText + '的数据标准');
      return null;
    }
    return selected;
  }

  function publishRows(rows) {
    rows.forEach(function (item) {
      item.publishStatus = '已发布';
      item.auditStatus = '发布通过';
    });
    state.selectedIds = {};
    updateContent();
    showToast('数据标准已发布');
  }

  function abolishRows(rows) {
    rows.forEach(function (item) {
      item.publishStatus = '已废止';
      item.auditStatus = '废止通过';
    });
    state.selectedIds = {};
    updateContent();
    showToast('数据标准已废止');
  }

  function deleteRows(rows) {
    var ids = rows.map(function (item) { return String(item.id); });
    standardRows = standardRows.filter(function (item) { return ids.indexOf(String(item.id)) < 0; });
    state.selectedIds = {};
    state.formMode = '';
    state.editRowId = '';
    state.viewRowId = '';
    updateContent();
    showToast('数据标准已删除');
  }

  function confirmAndRun(message, icon, fn) {
    if (DP.confirm) {
      DP.confirm(message, { icon: icon || 'info', onOk: fn });
    } else {
      fn();
    }
  }

  function openForm(mode, id, type) {
    var item = getRowById(id);
    state.formMode = mode;
    state.editRowId = mode === 'edit' ? id : '';
    state.viewRowId = mode === 'view' ? id : '';
    state.formType = type || getTypeFromRow(item);
    state.activeTab = 'list';
    state.logId = '';
    state.createMenuOpen = false;
    updateContent();
  }

  function backToList() {
    state.formMode = '';
    state.editRowId = '';
    state.viewRowId = '';
    state.activeTab = 'list';
    updateContent();
  }

  function saveForm() {
    var form = pageEl.querySelector('[data-dsd-form]');
    if (!form) return;
    var values = {};
    form.querySelectorAll('[data-dsd-edit]').forEach(function (input) {
      values[input.getAttribute('data-dsd-edit')] = input.value.trim();
    });
    if (!values.englishName || !values.alias) {
      showToast('请填写英文名和别名');
      return;
    }
    if (state.formMode === 'create') {
      var meta = typeToMeta(state.formType);
      var newRow = row(
        values.code || defaultFormData(state.formType).code,
        values.englishName,
        values.alias,
        meta.objectType,
        meta.metaModel,
        values.meaning || values.alias,
        '编制',
        '待提交',
        state.treeKey || 'biz',
        {
          dataType: values.dataType,
          length: values.length,
          precision: values.precision,
          desensitizeRule: values.desensitizeRule,
          qualityRule: values.qualityRule,
          encryptRule: values.encryptRule,
          dataClass: values.dataClass,
          dataLevel: values.dataLevel
        }
      );
      newRow.id = standardRows.reduce(function (max, item) { return Math.max(max, Number(item.id)); }, 0) + 1;
      standardRows.unshift(newRow);
    } else {
      var item = getRowById(state.editRowId);
      if (!item) return;
      ['code', 'englishName', 'alias', 'meaning', 'dataType', 'length', 'precision', 'desensitizeRule', 'qualityRule', 'encryptRule', 'dataClass', 'dataLevel'].forEach(function (key) {
        if (values[key] != null) item[key] = values[key] || '';
      });
      item.description = item.meaning;
    }
    state.formMode = '';
    state.editRowId = '';
    state.viewRowId = '';
    state.page = 1;
    updateContent();
    renderTree();
    showToast('数据标准已保存');
  }

  function addExportLog() {
    ioRows.unshift({
      id: Date.now(),
      fileName: '字段模型-' + '20260617151930' + '.xls',
      attr: '导出',
      status: '处理中',
      success: 0,
      fail: 0,
      total: getFilteredRows().length,
      operator: '演示-测试',
      time: '2026-06-17 15:19:30'
    });
    showToast('导出任务已创建，可在导入导出查看');
  }

  function saveImport() {
    ioRows.unshift({
      id: Date.now(),
      fileName: '数据标准导入模板.xls',
      attr: '导入',
      status: '处理中',
      success: 0,
      fail: 0,
      total: 0,
      operator: '演示-测试',
      time: '2026-06-17 15:20:12'
    });
    closeModal();
    state.activeTab = 'io';
    updateContent();
    showToast('导入任务已创建');
  }

  function bindEvents() {
    pageEl.addEventListener('click', function (e) {
      var comboTrigger = e.target.closest('[data-dsd-combo-trigger]');
      if (comboTrigger) {
        var combo = comboTrigger.closest('[data-dsd-combo]');
        var isOpen = combo.classList.contains('open');
        closeCombos(combo);
        combo.classList.toggle('open', !isOpen);
        var search = combo.querySelector('[data-dsd-combo-search]');
        if (!isOpen && search) {
          search.value = '';
          filterCombo(combo, '');
          setTimeout(function () { search.focus(); }, 0);
        }
        return;
      }

      var comboOption = e.target.closest('[data-dsd-combo-option]');
      if (comboOption) {
        var optionCombo = comboOption.closest('[data-dsd-combo]');
        selectComboValue(optionCombo, comboOption.getAttribute('data-value') || comboOption.textContent.trim());
        return;
      }

      if (!e.target.closest('[data-dsd-combo]')) closeCombos();

      var treeRow = e.target.closest('[data-dsd-tree-key]');
      if (treeRow) {
        state.treeKey = treeRow.getAttribute('data-dsd-tree-key');
        state.page = 1;
        state.selectedIds = {};
        renderTree();
        updateContent();
        return;
      }

      var tab = e.target.closest('[data-dsd-tab]');
      if (tab) {
        state.activeTab = tab.getAttribute('data-dsd-tab');
        state.formMode = '';
        state.editRowId = '';
        state.viewRowId = '';
        state.logId = '';
        state.createMenuOpen = false;
        updateContent();
        return;
      }

      var sortBtn = e.target.closest('[data-dsd-sort]');
      if (sortBtn) {
        var key = sortBtn.getAttribute('data-dsd-sort');
        if (state.sortKey === key) state.sortDir = state.sortDir === 'asc' ? 'desc' : 'asc';
        else {
          state.sortKey = key;
          state.sortDir = 'asc';
        }
        updateContent();
        return;
      }

      var pageBtn = e.target.closest('[data-dsd-page]');
      if (pageBtn) {
        var totalPages = Math.max(1, Math.ceil(getFilteredRows().length / state.pageSize));
        var target = pageBtn.getAttribute('data-dsd-page');
        if (target === 'prev') state.page = Math.max(1, state.page - 1);
        else if (target === 'next') state.page = Math.min(totalPages, state.page + 1);
        else state.page = Number(target) || 1;
        updateContent();
        return;
      }

      var actionEl = e.target.closest('[data-dsd-action]');
      if (!actionEl) {
        if (!e.target.closest('.dsd-create-menu')) {
          state.createMenuOpen = false;
          var menu = pageEl.querySelector('.dsd-create-menu');
          if (menu) menu.classList.remove('open');
        }
        return;
      }
      var action = actionEl.getAttribute('data-dsd-action');
      var id = actionEl.getAttribute('data-id');

      if (action === 'toggle-create') {
        state.createMenuOpen = !state.createMenuOpen;
        updateContent();
      } else if (action === 'create') {
        openForm('create', '', actionEl.getAttribute('data-type') || 'field');
      } else if (action === 'import') {
        openImportModal();
      } else if (action === 'export') {
        addExportLog();
      } else if (action === 'query') {
        var keyword = pageEl.querySelector('[data-dsd-keyword]');
        state.filters.keyword = keyword ? keyword.value.trim() : '';
        state.page = 1;
        updateContent();
      } else if (action === 'query-io') {
        var ioKeyword = pageEl.querySelector('[data-dsd-io-keyword]');
        state.ioFilters.keyword = ioKeyword ? ioKeyword.value.trim() : '';
        updateContent();
      } else if (action === 'view') {
        openForm('view', id);
      } else if (action === 'edit') {
        openForm('edit', id);
      } else if (action === 'publish-row') {
        var publishRow = getRowById(id);
        if (publishRow) confirmAndRun('确认发布数据标准 <b>' + escapeHtml(publishRow.alias) + '</b> 吗？', 'info', function () { publishRows([publishRow]); });
      } else if (action === 'abolish-row') {
        var abolishRow = getRowById(id);
        if (abolishRow) confirmAndRun('确认废止数据标准 <b>' + escapeHtml(abolishRow.alias) + '</b> 吗？', 'danger', function () { abolishRows([abolishRow]); });
      } else if (action === 'delete-row') {
        var deleteRow = getRowById(id);
        if (deleteRow) confirmAndRun('确认删除数据标准 <b>' + escapeHtml(deleteRow.alias) + '</b> 吗？', 'danger', function () { deleteRows([deleteRow]); });
      } else if (action === 'publish-selected') {
        var rowsToPublish = selectedOrWarn('发布');
        if (rowsToPublish) confirmAndRun('确认发布选中的 <b>' + rowsToPublish.length + '</b> 条数据标准吗？', 'info', function () { publishRows(rowsToPublish); });
      } else if (action === 'abolish-selected') {
        var rowsToAbolish = selectedOrWarn('废止');
        if (rowsToAbolish) confirmAndRun('确认废止选中的 <b>' + rowsToAbolish.length + '</b> 条数据标准吗？', 'danger', function () { abolishRows(rowsToAbolish); });
      } else if (action === 'delete-selected') {
        var rowsToDelete = selectedOrWarn('删除');
        if (rowsToDelete) confirmAndRun('确认删除选中的 <b>' + rowsToDelete.length + '</b> 条数据标准吗？', 'danger', function () { deleteRows(rowsToDelete); });
      } else if (action === 'back-list' || action === 'cancel-form') {
        backToList();
      } else if (action === 'save-form') {
        saveForm();
      } else if (action === 'view-log') {
        state.logId = id;
        state.activeTab = 'log';
        state.formMode = '';
        updateContent();
      } else if (action === 'back-io') {
        state.logId = '';
        state.activeTab = 'io';
        updateContent();
      } else if (action === 'close-modal') {
        closeModal();
      } else if (action === 'save-import') {
        saveImport();
      } else if (action === 'download-template') {
        showToast('空模板已准备下载');
      } else if (action === 'choose-file') {
        showToast('静态原型中已模拟文件选择');
      } else if (action === 'mock-upload') {
        showToast('请选择本地 Excel 文件');
      } else if (action === 'page-go') {
        var jump = pageEl.querySelector('.dsd-page-jump');
        var total = Math.max(1, Math.ceil(getFilteredRows().length / state.pageSize));
        state.page = Math.max(1, Math.min(total, Number(jump && jump.value) || 1));
        updateContent();
      }
    });

    pageEl.addEventListener('change', function (e) {
      if (e.target.matches('[data-dsd-filter]')) {
        state.filters[e.target.getAttribute('data-dsd-filter')] = e.target.value;
        state.page = 1;
        updateContent();
        return;
      }
      if (e.target.matches('[data-dsd-io-filter]')) {
        state.ioFilters[e.target.getAttribute('data-dsd-io-filter')] = e.target.value;
        updateContent();
        return;
      }
      if (e.target.matches('[data-dsd-check-all]')) {
        getVisibleRows().forEach(function (item) {
          if (e.target.checked) state.selectedIds[item.id] = true;
          else delete state.selectedIds[item.id];
        });
        updateContent();
        return;
      }
      if (e.target.matches('[data-dsd-row-check]')) {
        var id = e.target.getAttribute('data-dsd-row-check');
        if (e.target.checked) state.selectedIds[id] = true;
        else delete state.selectedIds[id];
        updateCheckAll();
        return;
      }
      if (e.target.matches('[data-dsd-page-size]')) {
        state.pageSize = Number(e.target.value) || 10;
        state.page = 1;
        updateContent();
      }
    });

    pageEl.addEventListener('input', function (e) {
      if (e.target.matches('[data-dsd-tree-search]')) {
        state.treeKeyword = e.target.value;
        renderTree();
      }
      if (e.target.matches('[data-dsd-combo-search]')) {
        var combo = e.target.closest('[data-dsd-combo]');
        if (combo) filterCombo(combo, e.target.value);
      }
    });

    pageEl.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter') return;
      if (e.target.matches('[data-dsd-keyword]')) {
        var query = pageEl.querySelector('[data-dsd-action="query"]');
        if (query) query.click();
      }
      if (e.target.matches('[data-dsd-io-keyword]')) {
        var ioQuery = pageEl.querySelector('[data-dsd-action="query-io"]');
        if (ioQuery) ioQuery.click();
      }
      if (e.target.matches('.dsd-page-jump')) {
        var go = pageEl.querySelector('[data-dsd-action="page-go"]');
        if (go) go.click();
      }
    });
  }

  var html = '<div class="page-data-standard">' +
    '<aside class="dsd-left-panel">' +
      '<div class="dsd-tree-search">' +
        '<input type="text" data-dsd-tree-search placeholder="关键字搜索" aria-label="关键字搜索">' +
        '<button type="button" aria-label="搜索"><i class="bi bi-search"></i></button>' +
      '</div>' +
      '<div class="dsd-tree-scroll"><ul class="dsd-tree" data-dsd-tree></ul></div>' +
    '</aside>' +
    '<section class="dsd-main-panel">' +
      '<div class="dsd-tabs" data-dsd-tabs></div>' +
      '<div class="dsd-view" data-dsd-view></div>' +
    '</section>' +
  '</div>';

  return {
    html: html,
    init: function () {
      pageEl = document.querySelector('.page-data-standard');
      if (!pageEl) return;
      resetState();
      bindEvents();
      renderTree();
      updateContent();
    }
  };
})();
