/** 数据资产 / 业务分层。按参考系统实现配置与权限管理，本地状态仅用于原型演示。 */
window.DP = window.DP || {};
DP.pages = DP.pages || {};
DP.pages.businessLayer = (function () {
  'use strict';
  var root, store, state, draft, parentPicker;
  var storageKey = 'dp.business-layer.v1';
  var types = [
    { id: 'data-source', name: '数据源' }, { id: 'data-domain', name: '数据域' },
    { id: 'project', name: '项目' }, { id: 'document', name: '文档' },
    { id: 'batch-flow', name: '批量处理流程', formOnly: true }, { id: 'stream-flow', name: '流式处理流程', formOnly: true },
    { id: 'interface', name: '接口' }, { id: 'tag', name: '标签' }, { id: 'file', name: '文件' }
  ];
  var organizations = [
    { id: 'org', name: '数据中台', icon: 'building', children: [
      { id: 'dept-data', name: '数据平台主管部门', icon: 'folder2', children: [
        { id: 'dept-dev', name: '数据开发组', icon: 'folder2', children: [{ id: 'u-lin', name: '林晨', icon: 'person' }, { id: 'u-zhou', name: '周宁', icon: 'person' }] },
        { id: 'dept-gov', name: '数据治理组', icon: 'folder2', children: [{ id: 'u-chen', name: '陈嘉', icon: 'person' }, { id: 'u-xu', name: '许清', icon: 'person' }] },
        { id: 'dept-ops', name: '平台运维组', icon: 'folder2', children: [{ id: 'u-wang', name: '王睿', icon: 'person' }] }
      ] },
      { id: 'dept-biz', name: '业务运营中心', icon: 'folder2', children: [{ id: 'u-li', name: '李欣', icon: 'person' }, { id: 'u-zhao', name: '赵明', icon: 'person' }] }
    ] }
  ];
  var roles = [
    { id: 'role-developer', name: '开发人员', icon: 'people', children: [{ id: 'ru-lin', name: '林晨', icon: 'person' }, { id: 'ru-zhou', name: '周宁', icon: 'person' }] },
    { id: 'role-governor', name: '数据治理人员', icon: 'people', children: [{ id: 'ru-chen', name: '陈嘉', icon: 'person' }, { id: 'ru-xu', name: '许清', icon: 'person' }] },
    { id: 'role-admin', name: '超级管理员', icon: 'shield-check' }, { id: 'role-user', name: '普通用户', icon: 'person-badge' }
  ];
  function clone(value) { return JSON.parse(JSON.stringify(value)); }
  function esc(value) { return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function button(action, icon, label, attrs, cls) { return '<button type="button" class="' + (cls || 'btn btn-outline') + '" data-bl-action="' + action + '" ' + (attrs || '') + '><i class="bi bi-' + icon + '" aria-hidden="true"></i><span>' + label + '</span></button>'; }
  function typeName(id) { var found = types.find(function (item) { return item.id === id; }); return found ? found.name : '未知类型'; }
  function node(id) { return store.layers.find(function (item) { return item.id === id; }); }
  function actorName(id) {
    var result = '';
    function walk(items) { items.forEach(function (item) { if (item.id === id) result = item.name; walk(item.children || []); }); }
    walk(organizations); walk(roles); return result || '未选择对象';
  }
  function seed() {
    var layers = [
      ['BL001', '', 'data-source', '核心业务系统', 'CORE_SYSTEM', '承载订单、会员、商品等企业核心业务数据。', ['dept-data', 'role-admin']],
      ['BL002', 'BL001', 'data-source', '订单交易系统', 'ORDER_SYSTEM', '沉淀订单创建、支付、履约及售后业务数据。', ['dept-dev', 'role-developer']],
      ['BL003', 'BL001', 'data-source', '会员运营系统', 'MEMBER_SYSTEM', '管理会员主数据、等级、权益及运营触达数据。', ['dept-gov', 'role-governor']],
      ['BL004', '', 'data-source', '企业数据仓库', 'DATA_WAREHOUSE', '统一承载离线数仓各层数据资产。', ['dept-data', 'role-admin']],
      ['BL005', 'BL004', 'data-source', 'ODS-贴源层', 'ODS', '保留源系统原始结构和每日增量数据。', ['dept-dev', 'role-developer']],
      ['BL006', 'BL004', 'data-source', 'DWD-数据明细层', 'DWD', '沉淀标准化、清洗后的业务事实明细。', ['dept-dev', 'dept-gov']],
      ['BL007', 'BL004', 'data-source', 'DWS-数据汇总层', 'DWS', '形成面向主题的公共汇总数据。', ['dept-gov', 'role-governor']],
      ['BL008', 'BL004', 'data-source', 'ADS-应用层', 'ADS', '支撑经营分析和业务应用的数据集市。', ['dept-biz', 'role-user']],
      ['BL009', '', 'data-source', '财务结算系统', 'FINANCE_SYSTEM', '承载应收、应付、开票及资金结算数据。', ['dept-biz', 'role-admin']],
      ['BL010', '', 'data-source', '供应链协同系统', 'SCM_SYSTEM', '承载供应商、采购、库存和物流协同数据。', ['dept-data', 'role-developer']],
      ['BL011', '', 'data-source', '客户服务系统', 'SERVICE_SYSTEM', '管理客户咨询、投诉、工单及满意度数据。', ['dept-biz', 'role-user']],
      ['BL012', '', 'data-source', '实时数据平台', 'REALTIME_PLATFORM', '承载消息接入、实时计算和指标服务。', ['dept-dev', 'role-developer']],
      ['BL013', '', 'data-domain', '交易域', 'DOMAIN_TRADE', '订单与交易主题的数据域。', ['dept-gov']],
      ['BL014', '', 'data-domain', '客户域', 'DOMAIN_CUSTOMER', '客户及会员主题的数据域。', ['dept-gov']],
      ['BL015', '', 'project', '数据治理一期', 'PROJECT_DG01', '企业数据治理一期建设项目。', ['dept-data']],
      ['BL016', '', 'document', '数据标准制度', 'DOC_STANDARD', '数据标准相关制度与规范文档。', ['role-governor']],
      ['BL017', '', 'interface', '订单查询接口', 'API_ORDER_QUERY', '面向内部应用提供订单查询服务。', ['role-developer']],
      ['BL018', '', 'tag', '核心数据标签', 'TAG_CORE_DATA', '用于标识企业核心数据资产。', ['role-governor']],
      ['BL019', '', 'file', '月度质量报告', 'FILE_QUALITY_MONTHLY', '每月数据质量分析报告文件。', ['dept-gov']],
      ['BL020', '', 'batch-flow', '订单日汇总流程', 'FLOW_ORDER_DAILY', '订单主题每日批量汇总流程。', ['role-developer']],
      ['BL021', '', 'stream-flow', '库存实时同步流程', 'FLOW_STOCK_RT', '库存变更消息实时同步流程。', ['role-developer']]
    ].map(function (row) { return { id: row[0], parentId: row[1], type: row[2], name: row[3], code: row[4], description: row[5], owners: row[6] }; });
    var permissions = {};
    ['dept-data', 'dept-dev', 'dept-gov', 'dept-biz', 'role-admin', 'role-developer', 'role-governor', 'role-user'].forEach(function (id, i) {
      permissions[id] = layers.filter(function (layer, index) { return layer.owners.indexOf(id) >= 0 || (index + i) % 4 !== 0; }).map(function (layer) { return layer.id; });
    });
    return { version: 1, layers: layers, permissions: permissions };
  }
  function load() {
    try {
      var saved = JSON.parse(window.localStorage.getItem(storageKey) || 'null');
      if (saved && saved.version === 1 && Array.isArray(saved.layers) && saved.permissions && saved.layers.every(function (item) { return item && item.id && item.code && item.name && Array.isArray(item.owners); })) return saved;
    } catch (error) { /* 存储不可用时仍保留当前会话数据。 */ }
    return seed();
  }
  function persist() { try { window.localStorage.setItem(storageKey, JSON.stringify(store)); return true; } catch (error) { return false; } }
  function status(text, tone) { var box = root.querySelector('[data-bl-status]'); if (!box) return; box.className = 'bl-status ' + (tone || ''); box.textContent = text || ''; }
  function roots(items) {
    var ids = new Set(items.map(function (item) { return item.id; }));
    return items.filter(function (item) { return !item.parentId || !ids.has(item.parentId); });
  }
  function childLayers(parentId, items) { return items.filter(function (item) { return item.parentId === parentId; }); }
  function layerDescendants(id) { return childLayers(id, store.layers).reduce(function (ids, child) { return ids.concat(child.id, layerDescendants(child.id)); }, []); }
  function matchesLayer(item, keyword, items) {
    var own = !keyword || (item.name + ' ' + item.code + ' ' + item.description).toLowerCase().indexOf(keyword) >= 0;
    return own || childLayers(item.id, items).some(function (child) { return matchesLayer(child, keyword, items); });
  }
  function configItems() {
    var keyword = state.treeKeyword.toLowerCase();
    return store.layers.filter(function (item) { return item.type === state.filterType && matchesLayer(item, keyword, store.layers.filter(function (candidate) { return candidate.type === state.filterType; })); });
  }
  function renderLayerTree(items, options) {
    options = options || {}; var all = options.allItems || items, keyword = (options.keyword || '').trim().toLowerCase();
    function walk(parentId) {
      return childLayers(parentId, all).filter(function (item) { return items.some(function (visible) { return visible.id === item.id; }) && matchesLayer(item, keyword, all); }).map(function (item) {
        var children = walk(item.id), selected = options.selectedId === item.id, checked = options.checked && options.checked.has(item.id), descendants = options.checkbox ? layerDescendants(item.id) : [], partial = descendants.some(function (id) { return options.checked.has(id); }) && !descendants.every(function (id) { return options.checked.has(id); });
        return '<li class="bl-tree-item"><div class="bl-tree-line' + (selected ? ' active' : '') + '" data-bl-layer="' + esc(item.id) + '">' + (children ? '<button type="button" class="bl-tree-toggle" data-bl-toggle="' + esc(item.id) + '" aria-label="' + (state.expanded.has(item.id) || keyword ? '收起' : '展开') + '" aria-expanded="' + (state.expanded.has(item.id) || !!keyword) + '"><i class="bi bi-chevron-right"></i></button>' : '<span class="bl-tree-spacer"></span>') + (options.checkbox ? '<input type="checkbox" data-bl-permission="' + esc(item.id) + '" aria-label="授权' + esc(item.name) + '"' + (checked ? ' checked' : '') + (partial ? ' data-bl-partial' : '') + '>' : '') + '<i class="bi bi-layers-fill bl-layer-icon"></i><span title="' + esc(item.name) + '">' + esc(item.name) + '</span><small>' + esc(typeName(item.type)) + '</small></div>' + (children ? '<ul' + (state.expanded.has(item.id) || keyword ? '' : ' hidden') + '>' + children + '</ul>' : '') + '</li>';
      }).join('');
    }
    return '<ul class="bl-tree-root">' + walk('') + '</ul>';
  }
  function renderTabs() {
    return '<div class="bl-tabs" role="tablist" aria-label="业务分层管理"><button type="button" role="tab" data-bl-tab="config" aria-selected="' + (state.tab === 'config') + '" class="bl-tab' + (state.tab === 'config' ? ' active' : '') + '"><i class="bi bi-sliders"></i><span>配置管理</span></button><button type="button" role="tab" data-bl-tab="permission" aria-selected="' + (state.tab === 'permission') + '" class="bl-tab' + (state.tab === 'permission' ? ' active' : '') + '"><i class="bi bi-shield-check"></i><span>权限管理</span></button></div>';
  }
  function render() {
    parentPicker = null;
    root.innerHTML = renderTabs() + '<div data-bl-status class="bl-status" role="status" aria-live="polite"></div><div data-bl-content></div><div data-bl-overlay></div>';
    if (state.tab === 'config') renderConfig(); else renderPermission();
  }
  function renderConfig() {
    var items = configItems();
    if (!items.some(function (item) { return item.id === state.selectedId; })) state.selectedId = items.length ? items[0].id : '';
    root.querySelector('[data-bl-content]').innerHTML = '<section class="bl-config"><aside class="bl-side"><label class="bl-field"><span>业务类型</span><select class="bl-control" data-bl-filter-type aria-label="业务类型">' + types.filter(function (item) { return !item.formOnly; }).map(function (item) { return '<option value="' + item.id + '"' + (item.id === state.filterType ? ' selected' : '') + '>' + item.name + '</option>'; }).join('') + '</select></label><div class="bl-search"><input class="bl-control" type="search" data-bl-tree-keyword aria-label="业务分层关键词" placeholder="关键字搜索" value="' + esc(state.treeDraft) + '">' + button('tree-query', 'search', '查询', '', 'btn btn-primary') + '</div><div class="bl-tree" data-bl-config-tree>' + (items.length ? renderLayerTree(items, { allItems: store.layers.filter(function (item) { return item.type === state.filterType; }), keyword: state.treeKeyword, selectedId: state.selectedId }) : '<div class="bl-empty"><i class="bi bi-folder2-open"></i><span>暂无匹配的业务分层</span></div>') + '</div></aside><main class="bl-detail" data-bl-detail></main></section>';
    renderDetail();
  }
  function viewRow(label, value, wide) { return '<div class="bl-form-row' + (wide ? ' wide' : '') + '"><label>' + label + '</label><div class="bl-readonly">' + esc(value || '—') + '</div></div>'; }
  function renderDetail() {
    var item = node(state.selectedId), panel = root.querySelector('[data-bl-detail]'); if (!panel) return;
    if (!item && state.mode !== 'create') {
      panel.innerHTML = '<div class="bl-detail-toolbar">' + button('new', 'plus-lg', '新建', '', 'btn btn-primary') + '</div><div class="bl-empty bl-detail-empty"><i class="bi bi-inbox"></i><span>请选择业务分层</span></div>'; return;
    }
    if (state.mode === 'create' || state.mode === 'edit') { renderForm(panel); return; }
    panel.innerHTML = '<div class="bl-detail-toolbar">' + button('new', 'plus-lg', '新建', '', 'btn btn-primary') + button('edit', 'pencil-square', '编辑') + button('delete', 'trash', '删除', '', 'btn btn-danger') + '</div><div class="bl-view-grid">' + viewRow('编码', item.code) + viewRow('类型', typeName(item.type)) + viewRow('名称', item.name) + viewRow('描述', item.description, true) + viewRow('父级节点', node(item.parentId) ? node(item.parentId).name : '—') + '<div class="bl-form-row wide"><label>数据 Owner</label><div class="bl-owner-view"><h3>按部门 / 角色</h3>' + (item.owners.length ? item.owners.map(function (id) { return '<span><i class="bi bi-' + (id.indexOf('role-') === 0 ? 'people' : 'folder2') + '"></i>' + esc(actorName(id)) + '</span>'; }).join('') : '<em>—</em>') + '</div></div></div>';
  }
  function field(label, control, required, wide) { return '<div class="bl-form-row' + (wide ? ' wide' : '') + '"><label>' + (required ? '<b>*</b>' : '') + label + '</label><div>' + control + '</div></div>'; }
  function renderForm(panel) {
    panel.innerHTML = '<form class="bl-edit-form" data-bl-form><div class="bl-detail-toolbar"><strong>' + (state.mode === 'create' ? '新建业务分层' : '编辑业务分层') + '</strong></div><div class="bl-form-grid">' +
      field('编码', '<input class="bl-control" name="code" maxlength="50" value="' + esc(draft.code) + '" placeholder="请输入编码">', true) +
      field('类型', '<select class="bl-control" name="type" disabled aria-label="业务类型">' + types.map(function (item) { return '<option value="' + item.id + '"' + (item.id === draft.type ? ' selected' : '') + '>' + item.name + '</option>'; }).join('') + '</select>', true) +
      field('名称', '<input class="bl-control" name="name" maxlength="50" value="' + esc(draft.name) + '" placeholder="请输入名称">', true) +
      field('描述', '<textarea class="bl-control" name="description" maxlength="300" placeholder="请输入描述">' + esc(draft.description) + '</textarea>', true) +
      field('父级节点', '<div class="bl-parent-control"><input class="bl-control" readonly name="parentName" value="' + esc(node(draft.parentId) ? node(draft.parentId).name : '') + '" placeholder="请选择父级节点"><input type="hidden" name="parentId" value="' + esc(draft.parentId) + '">' + button('choose-parent', 'diagram-3', '选择') + button('clear-parent', 'x-lg', '清除') + '</div>', false) +
      '<div></div>' + field('数据 Owner', '<div class="bl-owner-picker"><div class="bl-owner-source"><div class="bl-subtabs">' + button('owner-tab', 'folder2', '按部门', 'data-mode="department" aria-pressed="' + (state.ownerMode === 'department') + '"', 'bl-subtab' + (state.ownerMode === 'department' ? ' active' : '')) + button('owner-tab', 'people', '按角色', 'data-mode="role" aria-pressed="' + (state.ownerMode === 'role') + '"', 'bl-subtab' + (state.ownerMode === 'role' ? ' active' : '')) + '</div><input class="bl-control" type="search" data-bl-owner-search placeholder="搜索部门、人员或角色" aria-label="搜索数据Owner" value="' + esc(state.ownerSearch) + '"><div class="bl-actor-tree" data-bl-owner-tree></div></div><i class="bi bi-arrow-right bl-owner-arrow"></i><div class="bl-owner-target"><h3>已选择 Owner</h3><div data-bl-owner-selected></div></div></div>', false, true) + '</div><footer class="bl-form-footer">' + button('save', 'floppy', '保存', '', 'btn btn-primary') + button('cancel', 'x-lg', '取消') + '</footer></form>';
    renderOwnerPicker();
  }
  function treeMatches(item, keyword) { return !keyword || item.name.toLowerCase().indexOf(keyword) >= 0 || (item.children || []).some(function (child) { return treeMatches(child, keyword); }); }
  function actorTree(items, keyword, selected) {
    keyword = keyword.trim().toLowerCase();
    function walk(nodes) {
      return '<ul>' + nodes.filter(function (item) { return treeMatches(item, keyword); }).map(function (item) { var children = item.children || [], checked = selected.indexOf(item.id) >= 0; return '<li><label><input type="checkbox" data-bl-owner="' + item.id + '"' + (checked ? ' checked' : '') + '><i class="bi bi-' + item.icon + '"></i><span>' + esc(item.name) + '</span></label>' + (children.length ? walk(children) : '') + '</li>'; }).join('') + '</ul>';
    }
    var html = walk(items); return html === '<ul></ul>' ? '<div class="bl-empty"><i class="bi bi-search"></i><span>没有匹配的对象</span></div>' : html;
  }
  function renderOwnerPicker() {
    var tree = root.querySelector('[data-bl-owner-tree]'), selected = root.querySelector('[data-bl-owner-selected]'); if (!tree || !selected) return;
    tree.innerHTML = actorTree(state.ownerMode === 'department' ? organizations : roles, state.ownerSearch, draft.owners);
    selected.innerHTML = draft.owners.length ? draft.owners.map(function (id) { return '<div><span><i class="bi bi-' + (id.indexOf('role-') === 0 ? 'people' : 'folder2') + '"></i>' + esc(actorName(id)) + '</span>' + button('remove-owner', 'x-lg', '移除', 'data-id="' + id + '"', 'bl-link') + '</div>'; }).join('') : '<div class="bl-empty"><i class="bi bi-person-plus"></i><span>暂未选择 Owner</span></div>';
  }
  function startForm(mode) {
    var item = node(state.selectedId);
    state.mode = mode; state.ownerMode = 'department'; state.ownerSearch = '';
    draft = mode === 'edit' && item ? clone(item) : { id: '', parentId: item ? item.id : '', type: state.filterType, name: '', code: '', description: '', owners: [] };
    renderDetail();
  }
  function captureForm() {
    var form = root.querySelector('[data-bl-form]'); if (!form) return;
    draft.code = form.querySelector('[name="code"]').value.trim(); draft.type = form.querySelector('[name="type"]').value; draft.name = form.querySelector('[name="name"]').value.trim(); draft.description = form.querySelector('[name="description"]').value.trim(); draft.parentId = form.querySelector('[name="parentId"]').value;
  }
  function isDescendant(parentId, targetId) { if (!parentId) return false; if (parentId === targetId) return true; var parent = node(parentId); return parent ? isDescendant(parent.parentId, targetId) : false; }
  function saveLayer() {
    captureForm(); var error = '';
    if (!draft.code || !draft.name || !draft.description) error = '请完整填写编码、名称和描述。';
    else if (store.layers.some(function (item) { return item.id !== draft.id && item.code.toLowerCase() === draft.code.toLowerCase(); })) error = '编码已存在，请使用其他编码。';
    else if (store.layers.some(function (item) { return item.id !== draft.id && item.type === draft.type && item.name === draft.name; })) error = '当前类型下已存在同名业务分层。';
    else if (draft.parentId && (!node(draft.parentId) || node(draft.parentId).type !== draft.type)) error = '父级节点必须与当前业务类型一致。';
    else if (draft.id && isDescendant(draft.parentId, draft.id)) error = '父级节点不能选择当前节点或其子节点。';
    if (error) { status(error, 'warning'); return; }
    if (!draft.id) draft.id = 'BL-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7);
    var index = store.layers.findIndex(function (item) { return item.id === draft.id; });
    if (index < 0) store.layers.unshift(clone(draft)); else store.layers[index] = clone(draft);
    persist(); state.filterType = draft.type; state.treeDraft = ''; state.treeKeyword = ''; state.selectedId = draft.id; state.mode = 'view'; renderConfig(); status('业务分层已保存。', 'success');
  }
  function deleteLayer() {
    var item = node(state.selectedId); if (!item) return;
    var children = childLayers(item.id, store.layers);
    if (children.length) { status('当前节点包含子节点，请先调整或删除子节点。', 'warning'); return; }
    DP.confirm('确认删除业务分层“' + esc(item.name) + '”？', { icon: 'warning', okText: '<i class="bi bi-trash"></i> 删除', cancelText: '<i class="bi bi-x-lg"></i> 取消', onOk: function () {
      store.layers = store.layers.filter(function (layer) { return layer.id !== item.id; }); Object.keys(store.permissions).forEach(function (id) { store.permissions[id] = store.permissions[id].filter(function (layerId) { return layerId !== item.id; }); }); persist(); state.selectedId = ''; if (root.isConnected) { renderConfig(); status('业务分层已删除。', 'success'); }
    } });
  }
  function parentCandidates() {
    var keyword = parentPicker.keyword.toLowerCase();
    return store.layers.filter(function (item) { return item.type === draft.type && item.id !== draft.id && !isDescendant(item.id, draft.id) && matchesLayer(item, keyword, store.layers.filter(function (candidate) { return candidate.type === draft.type && candidate.id !== draft.id; })); });
  }
  function renderParentPicker() {
    var items = parentCandidates();
    root.querySelector('[data-bl-overlay]').innerHTML = '<div class="bl-modal-mask"><section class="bl-modal" role="dialog" aria-modal="true" aria-labelledby="blParentTitle"><header><h3 id="blParentTitle">选择父级节点</h3>' + button('close-parent', 'x-lg', '关闭', '', 'bl-icon-btn') + '</header><div class="bl-modal-body"><div class="bl-search"><input class="bl-control" type="search" data-bl-parent-keyword placeholder="搜索父级节点" aria-label="搜索父级节点" value="' + esc(parentPicker.draft) + '">' + button('parent-query', 'search', '查询', '', 'btn btn-primary') + '</div><div class="bl-parent-tree">' + (items.length ? renderLayerTree(items, { allItems: store.layers.filter(function (item) { return item.type === draft.type && item.id !== draft.id; }), keyword: parentPicker.keyword, selectedId: parentPicker.selectedId }) : '<div class="bl-empty"><i class="bi bi-search"></i><span>没有匹配的父级节点</span></div>') + '</div></div><footer>' + button('close-parent', 'x-lg', '取消') + button('apply-parent', 'check-lg', '确定', parentPicker.selectedId ? '' : 'disabled', 'btn btn-primary') + '</footer></section></div>';
    root.querySelector('[data-bl-action="close-parent"]').focus();
  }
  function permissionActors() {
    var source = state.permissionMode === 'department' ? organizations : roles, keyword = state.actorKeyword.trim().toLowerCase();
    function walk(items) {
      return '<ul>' + items.filter(function (item) { return treeMatches(item, keyword); }).map(function (item) {
        var children = item.children || [], selected = item.id === state.actorId;
        return '<li><button type="button" class="bl-actor-node' + (selected ? ' active' : '') + '" data-bl-actor="' + item.id + '" aria-pressed="' + selected + '"><i class="bi bi-' + item.icon + '"></i><span>' + esc(item.name) + '</span></button>' + (children.length ? walk(children) : '') + '</li>';
      }).join('') + '</ul>';
    }
    var html = walk(source); return html === '<ul></ul>' ? '<div class="bl-empty"><i class="bi bi-search"></i><span>没有匹配的对象</span></div>' : html;
  }
  function permissionLayers() {
    var keyword = state.permissionKeyword.toLowerCase(), allowed = new Set(store.permissions[state.actorId] || []), qualified = store.layers.filter(function (item) {
      var stateMatch = state.permissionFilter === 'all' || (state.permissionFilter === 'selected' ? allowed.has(item.id) : !allowed.has(item.id));
      return stateMatch && (!keyword || (item.name + ' ' + item.code + ' ' + item.description).toLowerCase().indexOf(keyword) >= 0);
    });
    var visibleIds = new Set();
    qualified.forEach(function (item) { var current = item; while (current) { visibleIds.add(current.id); current = node(current.parentId); } });
    return { items: store.layers.filter(function (item) { return visibleIds.has(item.id); }), allowed: allowed };
  }
  function renderPermission() {
    var data = permissionLayers();
    root.querySelector('[data-bl-content]').innerHTML = '<section class="bl-permission"><aside class="bl-permission-side"><div class="bl-subtabs">' + button('permission-mode', 'folder2', '部门', 'data-mode="department" aria-pressed="' + (state.permissionMode === 'department') + '"', 'bl-subtab' + (state.permissionMode === 'department' ? ' active' : '')) + button('permission-mode', 'people', '角色', 'data-mode="role" aria-pressed="' + (state.permissionMode === 'role') + '"', 'bl-subtab' + (state.permissionMode === 'role' ? ' active' : '')) + '</div><input class="bl-control" type="search" data-bl-actor-keyword placeholder="搜索部门、人员或角色" aria-label="搜索权限对象" value="' + esc(state.actorKeyword) + '"><div class="bl-actor-tree" data-bl-actor-tree>' + permissionActors() + '</div></aside><main class="bl-permission-main"><header><div><h2>业务分层</h2><p>当前对象：<strong>' + esc(actorName(state.actorId)) + '</strong></p></div></header><div class="bl-permission-query"><select class="bl-control" data-bl-permission-filter aria-label="授权状态"><option value="all"' + (state.permissionFilter === 'all' ? ' selected' : '') + '>全部</option><option value="selected"' + (state.permissionFilter === 'selected' ? ' selected' : '') + '>已选择</option><option value="unselected"' + (state.permissionFilter === 'unselected' ? ' selected' : '') + '>未选择</option></select><input class="bl-control" type="search" data-bl-permission-keyword placeholder="关键字搜索" aria-label="业务分层权限关键词" value="' + esc(state.permissionDraft) + '">' + button('permission-query', 'search', '查询', '', 'btn btn-primary') + '</div><div class="bl-permission-tree">' + (data.items.length ? renderLayerTree(data.items, { allItems: store.layers, keyword: state.permissionKeyword, checked: data.allowed, checkbox: true }) : '<div class="bl-empty"><i class="bi bi-shield-x"></i><span>暂无匹配的业务分层</span></div>') + '</div></main></section>';
    root.querySelectorAll('[data-bl-partial]').forEach(function (box) { box.indeterminate = true; });
  }
  function togglePermission(id, checked) {
    if (!state.actorId) return;
    var current = new Set(store.permissions[state.actorId] || []), ids = [id].concat(layerDescendants(id));
    ids.forEach(function (layerId) { if (checked) current.add(layerId); else current.delete(layerId); });
    store.permissions[state.actorId] = Array.from(current); persist(); renderPermission();
    status((checked ? '已授予' : '已取消') + '“' + actorName(state.actorId) + '”对“' + node(id).name + '”' + (ids.length > 1 ? '及其子节点' : '') + '的权限。', 'success');
  }
  function onClick(event) {
    var tab = event.target.closest('[data-bl-tab]'); if (tab) { state.tab = tab.dataset.blTab; state.mode = 'view'; state.expanded = new Set(); render(); return; }
    var layer = event.target.closest('[data-bl-layer]');
    if (layer && !event.target.closest('[data-bl-toggle]') && !event.target.matches('[data-bl-permission]')) {
      if (parentPicker) { parentPicker.selectedId = layer.dataset.blLayer; renderParentPicker(); }
      else if (state.tab === 'config') { state.selectedId = layer.dataset.blLayer; state.mode = 'view'; renderConfig(); }
      return;
    }
    var actor = event.target.closest('[data-bl-actor]'); if (actor) { state.actorId = actor.dataset.blActor; renderPermission(); return; }
    var el = event.target.closest('[data-bl-action]'); if (!el || el.disabled) return; var action = el.dataset.blAction;
    if (action === 'tree-query') { state.treeKeyword = state.treeDraft.trim(); renderConfig(); }
    else if (action === 'new') startForm('create'); else if (action === 'edit') startForm('edit'); else if (action === 'delete') deleteLayer();
    else if (action === 'cancel') { state.mode = 'view'; draft = null; renderDetail(); }
    else if (action === 'save') saveLayer();
    else if (action === 'owner-tab') { captureForm(); state.ownerMode = el.dataset.mode; state.ownerSearch = ''; renderForm(root.querySelector('[data-bl-detail]')); }
    else if (action === 'remove-owner') { captureForm(); draft.owners = draft.owners.filter(function (id) { return id !== el.dataset.id; }); renderOwnerPicker(); }
    else if (action === 'choose-parent') { captureForm(); parentPicker = { selectedId: draft.parentId, draft: '', keyword: '' }; renderParentPicker(); }
    else if (action === 'clear-parent') { captureForm(); draft.parentId = ''; renderForm(root.querySelector('[data-bl-detail]')); }
    else if (action === 'close-parent') { parentPicker = null; root.querySelector('[data-bl-overlay]').innerHTML = ''; }
    else if (action === 'parent-query') { parentPicker.keyword = parentPicker.draft.trim(); renderParentPicker(); }
    else if (action === 'apply-parent') { draft.parentId = parentPicker.selectedId; parentPicker = null; root.querySelector('[data-bl-overlay]').innerHTML = ''; renderForm(root.querySelector('[data-bl-detail]')); }
    else if (action === 'permission-mode') { state.permissionMode = el.dataset.mode; state.actorKeyword = ''; state.actorId = el.dataset.mode === 'department' ? 'dept-data' : 'role-developer'; renderPermission(); }
    else if (action === 'permission-query') { state.permissionKeyword = state.permissionDraft.trim(); renderPermission(); }
  }
  function onChange(event) {
    var el = event.target;
    if (el.matches('[data-bl-filter-type]')) { state.filterType = el.value; state.treeKeyword = state.treeDraft.trim(); state.selectedId = ''; state.mode = 'view'; renderConfig(); }
    else if (el.matches('[data-bl-owner]')) { captureForm(); draft.owners = draft.owners.filter(function (id) { return id !== el.dataset.blOwner; }); if (el.checked) draft.owners.push(el.dataset.blOwner); renderOwnerPicker(); }
    else if (el.matches('[data-bl-permission-filter]')) { state.permissionFilter = el.value; state.permissionKeyword = state.permissionDraft.trim(); renderPermission(); }
    else if (el.matches('[data-bl-permission]')) togglePermission(el.dataset.blPermission, el.checked);
  }
  function onInput(event) {
    var el = event.target;
    if (el.matches('[data-bl-tree-keyword]')) state.treeDraft = el.value;
    else if (el.matches('[data-bl-owner-search]')) { captureForm(); state.ownerSearch = el.value; renderOwnerPicker(); var search = root.querySelector('[data-bl-owner-search]'); if (search) { search.value = state.ownerSearch; search.focus(); } }
    else if (el.matches('[data-bl-actor-keyword]')) { state.actorKeyword = el.value; root.querySelector('[data-bl-actor-tree]').innerHTML = permissionActors(); }
    else if (el.matches('[data-bl-permission-keyword]')) state.permissionDraft = el.value;
    else if (el.matches('[data-bl-parent-keyword]')) parentPicker.draft = el.value;
  }
  function onKey(event) {
    if (event.key === 'Enter' && event.target.matches('[data-bl-tree-keyword]')) { event.preventDefault(); state.treeKeyword = state.treeDraft.trim(); renderConfig(); }
    else if (event.key === 'Enter' && event.target.matches('[data-bl-permission-keyword]')) { event.preventDefault(); state.permissionKeyword = state.permissionDraft.trim(); renderPermission(); }
    else if (event.key === 'Enter' && event.target.matches('[data-bl-parent-keyword]')) { event.preventDefault(); parentPicker.keyword = parentPicker.draft.trim(); renderParentPicker(); }
    if (event.key === 'Escape' && parentPicker) { parentPicker = null; root.querySelector('[data-bl-overlay]').innerHTML = ''; }
  }
  function init() {
    root = DP.contentArea.querySelector('.page-business-layer'); if (!root) return;
    store = store || load(); draft = null; parentPicker = null;
    state = { tab: 'config', filterType: 'data-source', treeDraft: '', treeKeyword: '', selectedId: '', mode: 'view', expanded: new Set(['BL001', 'BL004']), ownerMode: 'department', ownerSearch: '', permissionMode: 'department', actorId: 'dept-data', actorKeyword: '', permissionFilter: 'all', permissionDraft: '', permissionKeyword: '' };
    root.addEventListener('click', onClick); root.addEventListener('change', onChange); root.addEventListener('input', onInput); root.addEventListener('keydown', onKey);
    root.addEventListener('click', function (event) { var toggle = event.target.closest('[data-bl-toggle]'); if (!toggle) return; event.stopPropagation(); var id = toggle.dataset.blToggle; if (state.expanded.has(id)) state.expanded.delete(id); else state.expanded.add(id); if (parentPicker) renderParentPicker(); else if (state.tab === 'config') renderConfig(); else renderPermission(); });
    render();
  }
  return { html: '<div class="page-business-layer"></div>', init: init };
}());
