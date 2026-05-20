/**
 * 数据中台 V4.0 - 数据分析 / 指标体系 / 维度管理
 */
window.DP = window.DP || {};
DP.pages = DP.pages || {};

DP.pages.dimensionManagement = (function () {
  var pageEl = null;
  var selectedCategory = 'all';
  var currentPage = 1;
  var pageSize = 10;
  var openTree = { manage: true };
  var filters = {
    type: 'all',
    keyword: ''
  };
  var editorState = null;

  var categories = [
    { id: 'all', name: '全部', icon: 'bi-folder-fill' },
    {
      id: 'manage',
      name: '维度管理',
      icon: 'bi-folder-fill',
      children: [
        { id: 'public', name: '公共维度', icon: 'bi-folder-fill' },
        { id: 'customer', name: '客户维度', icon: 'bi-folder-fill' },
        { id: 'trade', name: '交易维度', icon: 'bi-folder-fill' },
        { id: 'product', name: '商品维度', icon: 'bi-folder-fill' },
        { id: 'org', name: '组织维度', icon: 'bi-folder-fill' },
        { id: 'risk', name: '风控维度', icon: 'bi-folder-fill' }
      ]
    }
  ];

  var rows = [
    row('DIM_CUSTOMER_GRADE', '客户等级维度', 'table', 'customer', '客户域会员等级、成长值、权益身份的统一维度。', '张明', '2026-05-18'),
    row('DIM_MEMBER_STATUS', '会员状态维度', 'dynamic', 'customer', '会员注册、冻结、注销、沉睡等状态枚举。', '李娜', '2026-05-17'),
    row('DIM_REGION_AREA', '行政区域维度', 'manual', 'public', '国家、省、市、区县编码与层级关系。', '王敏', '2026-05-15'),
    row('DIM_TIME_PERIOD', '时间周期维度', 'manual', 'public', '自然日、周、月、季度、财年和节假日标识。', '周琳', '2026-05-13'),
    row('DIM_CHANNEL_SOURCE', '渠道来源维度', 'dynamic', 'trade', '线上、线下、投放渠道和订单来源归因。', '赵磊', '2026-05-12'),
    row('DIM_PAYMENT_METHOD', '支付方式维度', 'dynamic', 'trade', '支付渠道、支付工具、结算方式和手续费规则。', '孙琪', '2026-05-11'),
    row('DIM_PRODUCT_CATEGORY', '商品类目维度', 'table', 'product', '商品一级到三级类目结构与运营分类。', '陈晨', '2026-05-10'),
    row('DIM_ORG_DEPT', '组织部门维度', 'table', 'org', '集团、事业部、部门、门店等组织层级。', '刘洋', '2026-05-09'),
    row('DIM_DEVICE_TYPE', '设备类型维度', 'manual', 'public', '终端设备、操作系统、客户端版本和访问载体。', '吴越', '2026-05-08'),
    row('DIM_RISK_LEVEL', '风险等级维度', 'dynamic', 'risk', '风控评分区间、风险等级和处置建议映射。', '何静', '2026-05-07')
  ];

  function row(code, name, type, category, desc, owner, updateTime) {
    return {
      id: code.toLowerCase().replace(/_/g, '-'),
      code: code,
      name: name,
      type: type,
      dataType: getDataModeName(type),
      category: category,
      desc: desc,
      owner: owner,
      updateTime: updateTime
    };
  }

  function getDataModeName(type) {
    if (type === 'table') return '库表数据';
    if (type === 'dynamic') return '数据集';
    return '手工录入';
  }

  function getDefaultDataName(mode) {
    if (mode === 'table') return 'dim_org_region';
    if (mode === 'dynamic') return '省机构';
    return '';
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

  function walkCategories(list, cb) {
    list.forEach(function (item) {
      cb(item);
      if (item.children) walkCategories(item.children, cb);
    });
  }

  function findCategory(id) {
    var result = null;
    walkCategories(categories, function (item) {
      if (item.id === id) result = item;
    });
    return result;
  }

  function getCategoryName(id) {
    var item = findCategory(id);
    return item ? item.name : '全部';
  }

  function getCategoryCount(id) {
    if (id === 'all' || id === 'manage') return rows.length;
    return rows.filter(function (item) { return item.category === id; }).length;
  }

  function getCategoryOptions() {
    var options = [];
    walkCategories(categories, function (item) {
      if (item.id !== 'all' && item.id !== 'manage') {
        options.push(item);
      }
    });
    return options;
  }

  function findRow(id) {
    return rows.find(function (item) { return item.id === id; }) || null;
  }

  function getFilteredRows() {
    var keyword = normalize(filters.keyword);
    return rows.filter(function (item) {
      var inCategory = selectedCategory === 'all' || selectedCategory === 'manage' || item.category === selectedCategory;
      var inType = filters.type === 'all' || item.type === filters.type;
      var searchText = normalize(item.code + ' ' + item.name + ' ' + item.desc + ' ' + getCategoryName(item.category));
      return inCategory && inType && (!keyword || searchText.indexOf(keyword) >= 0);
    });
  }

  function renderTreeNodes(list, keyword) {
    return list.map(function (item) {
      var hasChildren = item.children && item.children.length;
      var childHtml = hasChildren ? renderTreeNodes(item.children, keyword) : '';
      var textMatch = !keyword || normalize(item.name).indexOf(keyword) >= 0;
      if (keyword && !textMatch && !childHtml) return '';

      var isOpen = !!openTree[item.id] || !!keyword;
      var icon = item.icon || (hasChildren ? (isOpen ? 'bi-folder2-open' : 'bi-folder2') : 'bi-folder-fill');
      var active = item.id === selectedCategory ? ' active' : '';
      var open = isOpen ? ' open' : '';
      var child = hasChildren ? '<ul class="dim-tree-children">' + childHtml + '</ul>' : '';

      return '<li class="dim-tree-node' + (hasChildren ? ' has-children' : '') + open + '">' +
        '<div class="dim-tree-node-row' + active + '" data-dim-tree-id="' + item.id + '">' +
          '<span class="dim-tree-toggle" data-dim-action="toggle-tree" data-dim-tree-id="' + item.id + '">' +
            '<i class="bi ' + (isOpen ? 'bi-chevron-down' : 'bi-chevron-right') + '"></i>' +
          '</span>' +
          '<i class="bi ' + icon + ' dim-tree-icon"></i>' +
          '<span class="dim-tree-text" title="' + escapeHtml(item.name) + '">' + escapeHtml(item.name) + '</span>' +
          '<span class="dim-tree-count">' + getCategoryCount(item.id) + '</span>' +
        '</div>' +
        child +
      '</li>';
    }).join('');
  }

  function renderTree() {
    var tree = pageEl.querySelector('#dimTreeList');
    var input = pageEl.querySelector('#dimTreeSearch');
    var keyword = normalize(input ? input.value : '');
    if (!tree) return;
    var html = renderTreeNodes(categories, keyword);
    tree.innerHTML = html || '<li class="dim-empty-row"><div class="dim-tree-node-row">暂无匹配分类</div></li>';
  }

  function renderDataType(type) {
    if (type === 'table') return '<span class="tag tag-yellow">库表数据</span>';
    if (type === 'dynamic') return '<span class="tag tag-blue">数据集</span>';
    return '<span class="tag tag-green">手工录入</span>';
  }

  function renderTable() {
    var table = pageEl.querySelector('#dimTable');
    var tbody = pageEl.querySelector('#dimTableBody');
    var pagination = pageEl.querySelector('#dimPagination');
    if (!tbody || !pagination) return;

    var filtered = getFilteredRows();
    var total = filtered.length;
    var totalPages = Math.max(1, Math.ceil(total / pageSize));
    currentPage = Math.min(Math.max(1, currentPage), totalPages);
    var start = (currentPage - 1) * pageSize;
    var pageRows = filtered.slice(start, start + pageSize);

    tbody.innerHTML = pageRows.map(function (item) {
      return '<tr>' +
        '<td class="dim-col-ck"><input type="checkbox"></td>' +
        '<td title="' + escapeHtml(item.code) + '">' + escapeHtml(item.code) + '</td>' +
        '<td class="td-link" title="' + escapeHtml(item.name) + '">' + escapeHtml(item.name) + '</td>' +
        '<td>' + renderDataType(item.type) + '</td>' +
        '<td class="td-desc" title="' + escapeHtml(item.desc) + '">' + escapeHtml(item.desc) + '</td>' +
        '<td><div class="dim-actions">' +
          '<button class="dim-op-btn" type="button" data-dim-action="edit" data-dim-id="' + item.id + '"><i class="bi bi-pencil-square"></i><span>编辑</span></button>' +
          '<button class="dim-op-btn" type="button" data-dim-action="data" data-dim-id="' + item.id + '"><i class="bi bi-table"></i><span>数据</span></button>' +
          '<button class="dim-op-btn dim-op-danger" type="button" data-dim-action="delete" data-dim-id="' + item.id + '"><i class="bi bi-trash3"></i><span>删除</span></button>' +
        '</div></td>' +
      '</tr>';
    }).join('');

    if (!pageRows.length) {
      tbody.innerHTML = '<tr class="dim-empty-row"><td colspan="6">暂无符合条件的维度数据</td></tr>';
    }

    if (table) table.classList.toggle('dim-compact', pageEl.classList.contains('dim-compact-mode'));

    pagination.innerHTML =
      '<div class="dim-pagination-inner">' +
        '<span>总共 ' + total + ' 条数据</span>' +
        '<button class="dim-page-arrow' + (currentPage === 1 ? ' disabled' : '') + '" type="button" data-dim-action="page" data-dim-page="' + (currentPage - 1) + '"><i class="bi bi-chevron-left"></i></button>' +
        renderPageNumbers(totalPages) +
        '<button class="dim-page-arrow' + (currentPage === totalPages ? ' disabled' : '') + '" type="button" data-dim-action="page" data-dim-page="' + (currentPage + 1) + '"><i class="bi bi-chevron-right"></i></button>' +
        '<select class="dim-page-size" id="dimPageSize"><option value="10"' + (pageSize === 10 ? ' selected' : '') + '>10条/页</option><option value="20"' + (pageSize === 20 ? ' selected' : '') + '>20条/页</option><option value="50"' + (pageSize === 50 ? ' selected' : '') + '>50条/页</option></select>' +
      '</div>';
  }

  function renderPageNumbers(totalPages) {
    var html = [];
    for (var i = 1; i <= totalPages; i += 1) {
      html.push('<a class="page-num' + (i === currentPage ? ' active' : '') + '" data-dim-action="page" data-dim-page="' + i + '">' + i + '</a>');
    }
    return html.join('');
  }

  function renderAll() {
    var breadcrumb = pageEl.querySelector('#dimBreadcrumb');
    if (breadcrumb) breadcrumb.textContent = getCategoryName(selectedCategory);
    renderTree();
    renderTable();
  }

  function applyFilters() {
    var typeSelect = pageEl.querySelector('#dimTypeFilter');
    var keywordInput = pageEl.querySelector('#dimKeywordInput');
    filters.type = typeSelect ? typeSelect.value : 'all';
    filters.keyword = keywordInput ? keywordInput.value : '';
    currentPage = 1;
    renderTable();
  }

  function resetFilters() {
    filters.type = 'all';
    filters.keyword = '';
    var typeSelect = pageEl.querySelector('#dimTypeFilter');
    var keywordInput = pageEl.querySelector('#dimKeywordInput');
    if (typeSelect) typeSelect.value = 'all';
    if (keywordInput) keywordInput.value = '';
    currentPage = 1;
    renderTable();
  }

  function showToast(message) {
    var old = document.querySelector('.dim-toast');
    if (old) old.remove();

    var toast = document.createElement('div');
    toast.className = 'dim-toast';
    toast.innerHTML = '<i class="bi bi-check-circle"></i><span>' + escapeHtml(message) + '</span>';
    document.body.appendChild(toast);
    window.setTimeout(function () {
      if (toast.parentNode) toast.remove();
    }, 1800);
  }

  function renderCategorySelectOptions(activeId) {
    return getCategoryOptions().map(function (item) {
      return '<option value="' + item.id + '"' + (item.id === activeId ? ' selected' : '') + '>' + escapeHtml(item.name) + '</option>';
    }).join('');
  }

  function getEditorCategory(item) {
    if (item) return item.category;
    return selectedCategory !== 'all' && selectedCategory !== 'manage' ? selectedCategory : 'public';
  }

  function getDatasetTreeItems() {
    return [
      {
        name: '数据集目录',
        icon: 'bi-folder-fill',
        open: true,
        children: [
          {
            name: '数据目录',
            icon: 'bi-folder-fill',
            open: true,
            children: [
              { name: '省机构', leaf: true },
              { name: 'sorter_info', leaf: true },
              { name: 'order_org_bound', leaf: true },
              { name: 'truck_team', leaf: true }
            ]
          },
          {
            name: '物流数据集',
            icon: 'bi-folder-fill',
            open: true,
            children: [
              { name: '各省订单', leaf: true },
              { name: '订单按天取件状态分布', leaf: true },
              { name: '订单取件状态', leaf: true }
            ]
          }
        ]
      }
    ];
  }

  function getTableTreeItems() {
    return [
      {
        name: '库表目录树',
        icon: 'bi-folder-fill',
        open: true,
        children: [
          {
            name: 'dw_dim（维度库）',
            icon: 'bi-folder-fill',
            open: true,
            children: [
              { name: 'dim_org_region', leaf: true, icon: 'bi-table' },
              { name: 'dim_customer_level', leaf: true, icon: 'bi-table' },
              { name: 'dim_product_category', leaf: true, icon: 'bi-table' },
              { name: 'dim_channel_source', leaf: true, icon: 'bi-table' }
            ]
          },
          {
            name: 'dw_dwd（明细库）',
            icon: 'bi-folder-fill',
            open: true,
            children: [
              { name: 'dwd_order_org_bound_di', leaf: true, icon: 'bi-table' },
              { name: 'dwd_member_address_df', leaf: true, icon: 'bi-table' },
              { name: 'dwd_sku_info_df', leaf: true, icon: 'bi-table' }
            ]
          },
          {
            name: 'ods_erp（贴源库）',
            icon: 'bi-folder-fill',
            open: true,
            children: [
              { name: 'ods_org_department', leaf: true, icon: 'bi-table' },
              { name: 'ods_region_area', leaf: true, icon: 'bi-table' },
              { name: 'ods_store_info', leaf: true, icon: 'bi-table' }
            ]
          }
        ]
      }
    ];
  }

  function renderDatasetTree(items, keyword) {
    return items.map(function (item) {
      var children = item.children ? renderDatasetTree(item.children, keyword) : '';
      var match = !keyword || normalize(item.name).indexOf(keyword) >= 0;
      if (keyword && !match && !children) return '';
      if (item.leaf) {
        return '<li class="dim-dataset-leaf" data-dim-action="choose-dataset" data-dim-dataset="' + escapeHtml(item.name) + '">' +
          '<i class="bi ' + (item.icon || 'bi-table') + '"></i><span>' + escapeHtml(item.name) + '</span>' +
        '</li>';
      }
      return '<li class="dim-dataset-node open">' +
        '<div class="dim-dataset-node-row"><i class="bi bi-caret-down-fill"></i><i class="bi ' + (item.icon || 'bi-folder-fill') + '"></i><span>' + escapeHtml(item.name) + '</span></div>' +
        '<ul>' + children + '</ul>' +
      '</li>';
    }).join('');
  }

  function renderFieldSelect(value) {
    var fields = ['org_id', 'org_name', 'org_parent_id', 'province_code', 'province_name', 'city_code', 'city_name'];
    return '<select class="dim-map-select">' +
      '<option value="">请选择</option>' +
      fields.map(function (field) {
        return '<option value="' + field + '"' + (field === value ? ' selected' : '') + '>' + field + '</option>';
      }).join('') +
    '</select>';
  }

  function getSourceTreeItems(mode) {
    return mode === 'table' ? getTableTreeItems() : getDatasetTreeItems();
  }

  function getSourcePlaceholder(mode) {
    return mode === 'table' ? '请输入库名或表名' : '请输入数据集名称';
  }

  function renderDatasetShell(mode, datasetName) {
    if (mode === 'manual') {
      return '<div class="dim-dataset-select dim-dataset-disabled"><span></span><i class="bi bi-chevron-down"></i></div>';
    }

    var currentName = datasetName || getDefaultDataName(mode);

    return '<div class="dim-dataset-picker" id="dimDatasetPicker">' +
      '<button class="dim-dataset-select" type="button" data-dim-action="toggle-dataset-picker">' +
        '<span id="dimDatasetName">' + escapeHtml(currentName) + '</span><i class="bi bi-chevron-down"></i>' +
      '</button>' +
      '<div class="dim-dataset-dropdown">' +
        '<div class="dim-dataset-search"><input id="dimDatasetSearch" type="text" value="' + escapeHtml(currentName) + '" placeholder="' + getSourcePlaceholder(mode) + '"><i class="bi bi-search"></i></div>' +
        '<ul class="dim-dataset-tree" id="dimDatasetTree">' + renderDatasetTree(getSourceTreeItems(mode), '') + '</ul>' +
      '</div>' +
    '</div>';
  }

  function renderConfigTable(mode) {
    if (mode === 'manual') {
      return '<table class="dim-edit-config-table">' +
        '<thead><tr><th>属性</th><th>字段配置</th></tr></thead>' +
        '<tbody>' +
          '<tr><td>维度编码</td><td><input type="checkbox" checked disabled></td></tr>' +
          '<tr><td>维度名称</td><td><input type="checkbox" checked disabled></td></tr>' +
          '<tr><td>父类编码</td><td><input type="checkbox"></td></tr>' +
          '<tr><td>属性1779268763</td><td><input type="checkbox"><button class="dim-inline-delete" type="button" data-dim-action="remove-config-row"><i class="bi bi-trash3"></i></button></td></tr>' +
        '</tbody>' +
      '</table>' +
      '<button class="dim-add-line" type="button" data-dim-action="add-manual-config">添加配置</button>';
    }

    return '<table class="dim-edit-config-table">' +
      '<thead><tr><th>属性</th><th>' + (mode === 'table' ? '库表字段' : '数据字段') + '</th></tr></thead>' +
      '<tbody>' +
        '<tr><td><span class="dim-required">*</span>维度编码</td><td>' + renderFieldSelect('org_id') + '</td></tr>' +
        '<tr><td><span class="dim-required">*</span>维度名称</td><td>' + renderFieldSelect('org_name') + '</td></tr>' +
        '<tr><td>父类编码</td><td>' + renderFieldSelect('') + '</td></tr>' +
      '</tbody>' +
    '</table>' +
    '<button class="dim-add-line" type="button" data-dim-action="add-dynamic-config"><i class="bi bi-plus-circle"></i> 新增一行</button>';
  }

  function showEditor(rowId, mode) {
    var item = mode === 'edit' ? findRow(rowId) : null;
    var category = getEditorCategory(item);
    editorState = {
      mode: mode,
      rowId: rowId || '',
      dataMode: item ? item.type : 'table',
      dataName: getDefaultDataName(item ? item.type : 'table'),
      category: category
    };
    pageEl.classList.add('dim-editor-mode');
    pageEl.classList.remove('dim-drawer-open');
    renderEditor(item);
  }

  function renderEditor(item) {
    var view = pageEl.querySelector('#dimEditorView');
    if (!view || !editorState) return;
    var title = editorState.mode === 'edit' ? '编辑维度' : '新增维度';
    var code = item ? item.code : '';
    var name = item ? item.name : '';
    var desc = item ? item.desc : '';
    var dataMode = editorState.dataMode;

    view.innerHTML =
      '<div class="dim-edit-head"><i class="bi bi-folder-plus"></i><span>' + title + '</span></div>' +
      '<div class="dim-edit-scroll">' +
        '<form class="dim-edit-form" data-dim-mode="' + dataMode + '">' +
          '<div class="dim-form-row"><label><span class="dim-required">*</span> 编码:</label><input class="dim-edit-input" id="dimFormCode" value="' + escapeHtml(code) + '" placeholder="请输入编码"></div>' +
          '<div class="dim-form-row"><label><span class="dim-required">*</span> 名称:</label><input class="dim-edit-input" id="dimFormName" value="' + escapeHtml(name) + '" placeholder="请输入名称"></div>' +
          '<div class="dim-form-row"><label><span class="dim-required">*</span> 所属分类:</label><input class="dim-edit-input" id="dimFormCategoryName" value="维度管理" readonly data-dim-category="' + escapeHtml(editorState.category) + '"></div>' +
          '<div class="dim-form-row dim-form-row-top"><label>数据:</label>' +
            '<div class="dim-dataset-card">' +
              '<div class="dim-radio-row">' +
                '<label><input type="radio" name="dimDatasetMode" value="table"' + (dataMode === 'table' ? ' checked' : '') + '> 库表数据</label>' +
                '<label><input type="radio" name="dimDatasetMode" value="dynamic"' + (dataMode === 'dynamic' ? ' checked' : '') + '> 数据集</label>' +
                '<label><input type="radio" name="dimDatasetMode" value="manual"' + (dataMode === 'manual' ? ' checked' : '') + '> 手工录入</label>' +
              '</div>' +
              '<div id="dimDatasetShell">' + renderDatasetShell(dataMode, editorState.dataName) + '</div>' +
            '</div>' +
          '</div>' +
          '<div class="dim-form-row dim-form-row-top"><label>数据配置:</label><div class="dim-config-wrap" id="dimEditorConfig">' + renderConfigTable(dataMode) + '</div></div>' +
          '<div class="dim-form-row dim-form-row-top dim-desc-row"><label>描述:</label>' +
            '<div class="dim-desc-wrap"><textarea id="dimFormDesc" maxlength="200" placeholder="200个字符以内，允许输入中文、英文、数字和特殊字符">' + escapeHtml(desc) + '</textarea><span class="dim-desc-count" id="dimDescCount">' + desc.length + ' / 200</span></div>' +
          '</div>' +
          '<div class="dim-edit-actions"><button class="btn btn-primary" type="button" data-dim-action="save-editor">保存</button><button class="btn btn-outline" type="button" data-dim-action="cancel-editor">取消</button></div>' +
        '</form>' +
      '</div>';
  }

  function updateEditorMode(mode) {
    if (!editorState) return;
    editorState.dataMode = mode;
    editorState.dataName = getDefaultDataName(mode);
    var form = pageEl.querySelector('.dim-edit-form');
    var shell = pageEl.querySelector('#dimDatasetShell');
    var config = pageEl.querySelector('#dimEditorConfig');
    if (form) form.dataset.dimMode = mode;
    if (shell) shell.innerHTML = renderDatasetShell(mode, editorState.dataName);
    if (config) config.innerHTML = renderConfigTable(mode);
  }

  function renderDatasetFilter(keyword) {
    var tree = pageEl.querySelector('#dimDatasetTree');
    if (!tree) return;
    tree.innerHTML = renderDatasetTree(getSourceTreeItems(editorState ? editorState.dataMode : 'dynamic'), normalize(keyword));
  }

  function closeEditor() {
    pageEl.classList.remove('dim-editor-mode');
    editorState = null;
    var view = pageEl.querySelector('#dimEditorView');
    if (view) view.innerHTML = '';
    renderAll();
  }

  function saveEditorPage() {
    if (!editorState) return;
    var code = (pageEl.querySelector('#dimFormCode') || {}).value || '';
    var name = (pageEl.querySelector('#dimFormName') || {}).value || '';
    var desc = (pageEl.querySelector('#dimFormDesc') || {}).value || '';
    var categoryInput = pageEl.querySelector('#dimFormCategoryName');
    var category = categoryInput ? categoryInput.dataset.dimCategory : 'public';
    var type = editorState.dataMode || 'dynamic';

    code = code.trim();
    name = name.trim();
    desc = desc.trim();
    if (!code || !name) {
      showToast('请填写编码和名称');
      return;
    }

    if (editorState.mode === 'edit') {
      var item = findRow(editorState.rowId);
      if (item) {
        item.code = code;
        item.name = name;
        item.type = type;
        item.dataType = getDataModeName(type);
        item.category = category || item.category;
        item.desc = desc;
        item.updateTime = '2026-05-20';
      }
      showToast('维度已保存');
    } else {
      rows.unshift({
        id: code.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || ('dim-' + Date.now()),
        code: code,
        name: name,
        type: type,
        dataType: getDataModeName(type),
        category: category || 'public',
        desc: desc,
        owner: '当前用户',
        updateTime: '2026-05-20'
      });
      selectedCategory = category || 'public';
      currentPage = 1;
      showToast('维度已新建');
    }

    closeEditor();
  }

  function getSampleRows(item) {
    var samples = {
      customer: [
        ['VIP01', '黄金会员', '会员等级', '启用'],
        ['VIP02', '铂金会员', '会员等级', '启用'],
        ['VIP03', '黑金会员', '会员等级', '启用'],
        ['SLEEP', '沉睡会员', '会员状态', '启用']
      ],
      public: [
        ['CN-110000', '北京市', '中国', '启用'],
        ['CN-310000', '上海市', '中国', '启用'],
        ['20260520', '2026-05-20', '自然日', '启用'],
        ['MOBILE', '移动端', '访问设备', '启用']
      ],
      trade: [
        ['APP', '移动应用', '线上渠道', '启用'],
        ['MINI', '小程序', '线上渠道', '启用'],
        ['ALIPAY', '支付宝', '支付方式', '启用'],
        ['WECHAT', '微信支付', '支付方式', '启用']
      ],
      product: [
        ['C100', '数码家电', '一级类目', '启用'],
        ['C101', '手机通讯', '二级类目', '启用'],
        ['C102', '智能穿戴', '二级类目', '启用'],
        ['C201', '生活百货', '一级类目', '启用']
      ],
      org: [
        ['HQ', '集团总部', '组织根节点', '启用'],
        ['EC', '电商事业部', '集团总部', '启用'],
        ['OPS', '运营中心', '电商事业部', '启用'],
        ['FIN', '财务中心', '集团总部', '启用']
      ],
      risk: [
        ['LOW', '低风险', '风险等级', '启用'],
        ['MID', '中风险', '风险等级', '启用'],
        ['HIGH', '高风险', '风险等级', '启用'],
        ['BLOCK', '拦截处理', '处置建议', '启用']
      ]
    };
    return samples[item.category] || samples.public;
  }

  function showDataDrawer(rowId) {
    var item = findRow(rowId);
    if (!item) return;

    var title = pageEl.querySelector('#dimDrawerTitle');
    var subtitle = pageEl.querySelector('#dimDrawerSubtitle');
    var body = pageEl.querySelector('#dimDrawerBody');
    if (!title || !subtitle || !body) return;

    title.textContent = item.name + ' - 数据预览';
    subtitle.textContent = item.code + ' / ' + item.dataType;
    body.innerHTML =
      '<div class="dim-info-grid">' +
        renderInfo('维度编码', item.code) +
        renderInfo('维度名称', item.name) +
        renderInfo('数据类型', item.dataType) +
        renderInfo('所属分类', getCategoryName(item.category)) +
        renderInfo('负责人', item.owner) +
        renderInfo('更新时间', item.updateTime) +
      '</div>' +
      '<div class="dim-section-title"><i class="bi bi-table"></i><span>样例数据</span></div>' +
      '<table class="ds-table">' +
        '<thead><tr><th>维度值编码</th><th>维度值名称</th><th>父级/分组</th><th>状态</th></tr></thead>' +
        '<tbody>' + getSampleRows(item).map(function (sample) {
          return '<tr><td>' + escapeHtml(sample[0]) + '</td><td>' + escapeHtml(sample[1]) + '</td><td>' + escapeHtml(sample[2]) + '</td><td><span class="tag tag-green">' + escapeHtml(sample[3]) + '</span></td></tr>';
        }).join('') + '</tbody>' +
      '</table>';

    pageEl.classList.add('dim-drawer-open');
  }

  function renderInfo(label, value) {
    return '<div class="dim-info-item"><span class="dim-info-label">' + escapeHtml(label) + '</span><span class="dim-info-value" title="' + escapeHtml(value) + '">' + escapeHtml(value) + '</span></div>';
  }

  function deleteRow(rowId) {
    var item = findRow(rowId);
    if (!item) return;
    DP.confirm('确认删除维度 <b>' + escapeHtml(item.name) + '</b> 吗？', {
      icon: 'danger',
      okText: '删除',
      onOk: function () {
        rows = rows.filter(function (rowItem) { return rowItem.id !== rowId; });
        currentPage = 1;
        renderAll();
        showToast('维度已删除');
      }
    });
  }

  function bindEvents() {
    pageEl.addEventListener('click', function (e) {
      var treeRow = e.target.closest('.dim-tree-node-row[data-dim-tree-id]');
      var actionEl = e.target.closest('[data-dim-action]');
      if (!e.target.closest('.dim-dataset-picker')) {
        var openPicker = pageEl.querySelector('.dim-dataset-picker.open');
        if (openPicker) openPicker.classList.remove('open');
      }

      if (treeRow && pageEl.contains(treeRow) && !(actionEl && actionEl.dataset.dimAction === 'toggle-tree')) {
        selectedCategory = treeRow.dataset.dimTreeId;
        currentPage = 1;
        renderAll();
        return;
      }

      if (!actionEl || !pageEl.contains(actionEl)) return;
      var action = actionEl.dataset.dimAction;
      var id = actionEl.dataset.dimId;

      if (action === 'toggle-tree') {
        var treeId = actionEl.dataset.dimTreeId;
        openTree[treeId] = !openTree[treeId];
        renderTree();
      } else if (action === 'toggle-left') {
        pageEl.classList.toggle('dim-left-collapsed');
      } else if (action === 'add-category') {
        showToast('分类新增弹窗已预留，可继续配置目录名称');
      } else if (action === 'new') {
        showEditor('', 'new');
      } else if (action === 'import') {
        showToast('导入操作已触发');
      } else if (action === 'export') {
        showToast('导出操作已触发');
      } else if (action === 'search') {
        applyFilters();
      } else if (action === 'reset') {
        resetFilters();
      } else if (action === 'refresh') {
        renderAll();
        showToast('列表已刷新');
      } else if (action === 'toggle-switch') {
        actionEl.classList.toggle('active');
        var text = actionEl.querySelector('.dim-switch-text');
        if (text) text.textContent = actionEl.classList.contains('active') ? '开' : '关';
      } else if (action === 'compact') {
        pageEl.classList.toggle('dim-compact-mode');
        renderTable();
      } else if (action === 'settings') {
        showToast('列设置已打开');
      } else if (action === 'fullscreen') {
        pageEl.classList.toggle('dim-left-collapsed');
      } else if (action === 'edit') {
        showEditor(id, 'edit');
      } else if (action === 'data') {
        showDataDrawer(id);
      } else if (action === 'delete') {
        deleteRow(id);
      } else if (action === 'close-drawer') {
        pageEl.classList.remove('dim-drawer-open');
      } else if (action === 'save-editor') {
        saveEditorPage();
      } else if (action === 'cancel-editor') {
        closeEditor();
      } else if (action === 'toggle-dataset-picker') {
        var picker = actionEl.closest('.dim-dataset-picker');
        if (picker) picker.classList.toggle('open');
      } else if (action === 'choose-dataset') {
        editorState.dataName = actionEl.dataset.dimDataset || getDefaultDataName(editorState ? editorState.dataMode : 'dynamic');
        var datasetName = pageEl.querySelector('#dimDatasetName');
        var datasetSearch = pageEl.querySelector('#dimDatasetSearch');
        if (datasetName) datasetName.textContent = editorState.dataName;
        if (datasetSearch) datasetSearch.value = editorState.dataName;
        var currentPicker = actionEl.closest('.dim-dataset-picker');
        if (currentPicker) currentPicker.classList.remove('open');
      } else if (action === 'add-dynamic-config') {
        var dynamicBody = pageEl.querySelector('.dim-edit-config-table tbody');
        if (dynamicBody) {
          dynamicBody.insertAdjacentHTML('beforeend', '<tr><td>扩展属性</td><td>' + renderFieldSelect('') + '</td></tr>');
        }
      } else if (action === 'add-manual-config') {
        var manualBody = pageEl.querySelector('.dim-edit-config-table tbody');
        if (manualBody) {
          manualBody.insertAdjacentHTML('beforeend', '<tr><td>属性' + Date.now().toString().slice(-10) + '</td><td><input type="checkbox"><button class="dim-inline-delete" type="button" data-dim-action="remove-config-row"><i class="bi bi-trash3"></i></button></td></tr>');
        }
      } else if (action === 'remove-config-row') {
        var configRow = actionEl.closest('tr');
        if (configRow) configRow.remove();
      } else if (action === 'page') {
        var nextPage = Number(actionEl.dataset.dimPage || 1);
        if (!actionEl.classList.contains('disabled')) {
          currentPage = nextPage;
          renderTable();
        }
      }
    });

    pageEl.addEventListener('input', function (e) {
      if (e.target.id === 'dimTreeSearch') {
        renderTree();
      } else if (e.target.id === 'dimDatasetSearch') {
        renderDatasetFilter(e.target.value);
      } else if (e.target.id === 'dimFormDesc') {
        var count = pageEl.querySelector('#dimDescCount');
        if (count) count.textContent = e.target.value.length + ' / 200';
      }
    });

    pageEl.addEventListener('change', function (e) {
      if (e.target.id === 'dimTypeFilter') {
        applyFilters();
      } else if (e.target.id === 'dimPageSize') {
        pageSize = Number(e.target.value) || 10;
        currentPage = 1;
        renderTable();
      } else if (e.target.name === 'dimDatasetMode') {
        updateEditorMode(e.target.value);
      }
    });

    pageEl.addEventListener('keydown', function (e) {
      if (e.target.id === 'dimKeywordInput' && e.key === 'Enter') {
        applyFilters();
      }
    });
  }

  return {
    html: '<div class="page-dim-mgr">' +
      '<aside class="dim-tree-panel">' +
        '<div class="dim-tree-head">' +
          '<button class="dim-icon-btn" type="button" title="收起分类" data-dim-action="toggle-left"><i class="bi bi-list"></i></button>' +
          '<div class="dim-tree-title">维度管理分类</div>' +
          '<button class="dim-add-btn" type="button" title="新增分类" data-dim-action="add-category"><i class="bi bi-plus-lg"></i></button>' +
        '</div>' +
        '<div class="dim-tree-search"><i class="bi bi-search"></i><input id="dimTreeSearch" type="text" placeholder="请输入..."></div>' +
        '<div class="dim-tree-scroll"><ul class="dim-tree" id="dimTreeList"></ul></div>' +
      '</aside>' +
      '<main class="dim-main-panel">' +
        '<div class="dim-main-head"><div class="dim-breadcrumb"><i class="bi bi-folder-fill"></i><span id="dimBreadcrumb">全部</span></div></div>' +
        '<div class="dim-toolbar">' +
          '<div class="dim-toolbar-left">' +
            '<button class="btn btn-primary" type="button" data-dim-action="new"><i class="bi bi-plus-lg"></i> 新建</button>' +
            '<button class="btn btn-outline" type="button" data-dim-action="import"><i class="bi bi-upload"></i> 导入</button>' +
            '<button class="btn btn-outline" type="button" data-dim-action="export"><i class="bi bi-download"></i> 导出</button>' +
          '</div>' +
          '<div class="dim-toolbar-right">' +
            '<select class="dim-filter-select" id="dimTypeFilter"><option value="all">请选择数据类型</option><option value="table">库表数据</option><option value="dynamic">数据集</option><option value="manual">手工录入</option></select>' +
            '<div class="dim-keyword-wrap"><i class="bi bi-search"></i><input class="dim-filter-input" id="dimKeywordInput" type="text" placeholder="请输入编码或名称"></div>' +
            '<button class="btn btn-primary" type="button" data-dim-action="search"><i class="bi bi-search"></i> 查询</button>' +
            '<button class="btn btn-outline" type="button" data-dim-action="reset"><i class="bi bi-arrow-counterclockwise"></i> 重置</button>' +
          '</div>' +
        '</div>' +
        '<div class="dim-table-tools">' +
          '<button class="dim-switch" type="button" data-dim-action="toggle-switch"><span class="dim-switch-track"><span class="dim-switch-text">关</span></span></button>' +
          '<button class="dim-tool-btn" type="button" title="刷新" data-dim-action="refresh"><i class="bi bi-arrow-clockwise"></i></button>' +
          '<button class="dim-tool-btn" type="button" title="紧凑密度" data-dim-action="compact"><i class="bi bi-textarea-resize"></i></button>' +
          '<button class="dim-tool-btn" type="button" title="列设置" data-dim-action="settings"><i class="bi bi-gear"></i></button>' +
          '<button class="dim-tool-btn" type="button" title="全屏" data-dim-action="fullscreen"><i class="bi bi-arrows-fullscreen"></i></button>' +
        '</div>' +
        '<div class="dim-table-wrap">' +
          '<table class="ds-table dim-table" id="dimTable">' +
            '<thead><tr>' +
              '<th class="dim-col-ck"><input type="checkbox"></th>' +
              '<th class="dim-col-code">编码</th>' +
              '<th class="dim-col-name">名称</th>' +
              '<th class="dim-col-type">数据类型</th>' +
              '<th>描述</th>' +
              '<th class="dim-col-action">操作</th>' +
            '</tr></thead>' +
            '<tbody id="dimTableBody"></tbody>' +
          '</table>' +
        '</div>' +
        '<div class="ds-pagination dim-pagination" id="dimPagination"></div>' +
        '<div class="dim-drawer-mask" data-dim-action="close-drawer"></div>' +
        '<aside class="dim-data-drawer" aria-hidden="true">' +
          '<div class="dim-drawer-head">' +
            '<div><h3 id="dimDrawerTitle">数据预览</h3><p id="dimDrawerSubtitle">--</p></div>' +
            '<button class="dim-drawer-close" type="button" data-dim-action="close-drawer" aria-label="关闭"><i class="bi bi-x-lg"></i></button>' +
          '</div>' +
          '<div class="dim-drawer-body" id="dimDrawerBody"></div>' +
        '</aside>' +
      '</main>' +
      '<section class="dim-editor-view" id="dimEditorView"></section>' +
    '</div>',

    init: function () {
      pageEl = document.querySelector('.page-dim-mgr');
      if (!pageEl) return;
      selectedCategory = 'all';
      currentPage = 1;
      pageSize = 10;
      openTree = { manage: true };
      editorState = null;
      filters = { type: 'all', keyword: '' };
      renderAll();
      bindEvents();
    }
  };
})();
