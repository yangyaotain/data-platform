/** 数据资产 / 数据权限。功能按参考系统的权限配置与分权分域实现，本地状态仅用于原型演示。 */
window.DP = window.DP || {};
DP.pages = DP.pages || {};

DP.pages.dataPermission = (function () {
  'use strict';

  var root, store, state;
  var storageKey = 'dp.data-permission.v1';

  var organizations = [
    { id: 'org-platform', name: '数据平台主管部门', icon: 'building', children: [
      { id: 'dept-governance', name: '数据治理部', icon: 'folder2', children: [
        { id: 'u-chen', name: '陈嘉', icon: 'person' },
        { id: 'u-xu', name: '许清', icon: 'person' }
      ] },
      { id: 'dept-development', name: '数据开发部', icon: 'folder2', children: [
        { id: 'u-lin', name: '林晨', icon: 'person' },
        { id: 'u-zhou', name: '周宁', icon: 'person' }
      ] },
      { id: 'dept-analysis', name: '经营分析部', icon: 'folder2', children: [
        { id: 'u-li', name: '李欣', icon: 'person' },
        { id: 'u-zhao', name: '赵明', icon: 'person' }
      ] },
      { id: 'dept-ops', name: '平台运维部', icon: 'folder2', children: [
        { id: 'u-wang', name: '王睿', icon: 'person' }
      ] }
    ] }
  ];

  var roles = [
    { id: 'role-developer', name: '数据开发人员', icon: 'people', children: [
      { id: 'ru-lin', name: '林晨', icon: 'person' }, { id: 'ru-zhou', name: '周宁', icon: 'person' }
    ] },
    { id: 'role-governor', name: '数据治理人员', icon: 'people', children: [
      { id: 'ru-chen', name: '陈嘉', icon: 'person' }, { id: 'ru-xu', name: '许清', icon: 'person' }
    ] },
    { id: 'role-analyst', name: '经营分析人员', icon: 'people', children: [
      { id: 'ru-li', name: '李欣', icon: 'person' }, { id: 'ru-zhao', name: '赵明', icon: 'person' }
    ] },
    { id: 'role-admin', name: '超级管理员', icon: 'shield-check' },
    { id: 'role-user', name: '普通用户', icon: 'person-badge' }
  ];

  var sources = [
    { id: 'group-warehouse', name: '数据仓库', icon: 'layers', children: [
      { id: 'src-supply-ods', name: '供应链ODS库', type: 'MySQL', icon: 'database', tables: [
        { id: 'tbl-purchase-order', name: 'ods_purchase_order', alias: '采购订单贴源表', fields: fieldRows([
          ['purchase_order_id', '采购订单编号'], ['supplier_id', '供应商编号'], ['order_amount', '采购金额'], ['order_status', '订单状态'], ['created_time', '创建时间']
        ]) },
        { id: 'tbl-supplier-master', name: 'ods_supplier_master', alias: '供应商主数据贴源表', fields: fieldRows([
          ['supplier_id', '供应商编号'], ['supplier_name', '供应商名称'], ['credit_level', '信用等级'], ['region_code', '所属区域'], ['enabled_flag', '启用标识']
        ]) }
      ] },
      { id: 'src-supply-dwd', name: '供应链明细库', type: 'StarRocks', icon: 'database', tables: [
        { id: 'tbl-order-detail', name: 'dwd_order_detail', alias: '订单明细事实表', fields: fieldRows([
          ['order_id', '订单编号'], ['customer_id', '客户编号'], ['product_code', '商品编码'], ['order_quantity', '订单数量'], ['order_amount', '订单金额'], ['delivery_date', '交付日期']
        ]) },
        { id: 'tbl-inventory-flow', name: 'dwd_inventory_flow', alias: '库存流水明细表', fields: fieldRows([
          ['warehouse_code', '仓库编码'], ['product_code', '商品编码'], ['movement_type', '出入库类型'], ['movement_quantity', '出入库数量'], ['business_time', '业务时间']
        ]) }
      ] },
      { id: 'src-operation-dws', name: '经营汇总库', type: 'StarRocks', icon: 'database', tables: [
        { id: 'tbl-sales-summary', name: 'dws_sales_summary_day', alias: '销售日汇总表', fields: fieldRows([
          ['stat_date', '统计日期'], ['organization_code', '经营主体编码'], ['sales_amount', '销售金额'], ['gross_profit', '毛利额'], ['order_count', '订单数']
        ]) }
      ] }
    ] },
    { id: 'group-business', name: '业务系统', icon: 'layers', children: [
      { id: 'src-order', name: '订单履约库', type: 'PostgreSQL', icon: 'database', tables: [
        { id: 'tbl-order-main', name: 'order_main', alias: '订单主表', fields: fieldRows([
          ['order_id', '订单编号'], ['customer_name', '客户名称'], ['contract_no', '合同编号'], ['delivery_status', '履约状态'], ['owner_department', '负责部门']
        ]) },
        { id: 'tbl-delivery-plan', name: 'delivery_plan', alias: '交付计划表', fields: fieldRows([
          ['plan_id', '计划编号'], ['order_id', '订单编号'], ['planned_date', '计划交付日期'], ['actual_date', '实际交付日期'], ['exception_reason', '异常原因']
        ]) }
      ] },
      { id: 'src-customer', name: '客户主数据库', type: 'MySQL', icon: 'database', tables: [
        { id: 'tbl-customer-main', name: 'mdm_customer', alias: '客户主数据表', fields: fieldRows([
          ['customer_id', '客户编号'], ['customer_name', '客户名称'], ['customer_level', '客户等级'], ['industry_code', '所属行业'], ['region_code', '所属区域']
        ]) }
      ] }
    ] },
    { id: 'group-analysis', name: '分析应用', icon: 'layers', children: [
      { id: 'src-analysis', name: '经营分析库', type: 'ClickHouse', icon: 'database', tables: [
        { id: 'tbl-operation-dashboard', name: 'ads_operation_dashboard', alias: '经营驾驶舱指标表', fields: fieldRows([
          ['stat_period', '统计周期'], ['organization_name', '经营主体'], ['revenue_amount', '营业收入'], ['profit_margin', '利润率'], ['inventory_turnover', '库存周转率']
        ]) }
      ] }
    ] }
  ];

  var dictionaries = [
    { id: 'dict-region', name: '行政区域字典', fields: ['区域名称', '区域编码', '区域说明'] },
    { id: 'dict-org', name: '经营主体字典', fields: ['主体名称', '主体编码', '主体说明'] },
    { id: 'dict-line', name: '业务条线字典', fields: ['条线名称', '条线编码', '条线说明'] }
  ];

  var domainTables = [
    { id: 'domain-table-org', database: '客户主数据库', name: 'mdm_operating_entity', fields: ['entity_name', 'entity_code', 'entity_desc'] },
    { id: 'domain-table-region', database: '经营分析库', name: 'dim_region', fields: ['region_name', 'region_code', 'region_desc'] },
    { id: 'domain-table-line', database: '供应链明细库', name: 'dim_business_line', fields: ['line_name', 'line_code', 'line_desc'] },
    { id: 'domain-table-dept', database: '订单履约库', name: 'sys_department', fields: ['department_name', 'department_code', 'description'] }
  ];

  function fieldRows(rows) {
    return rows.map(function (row) { return { id: row[0], name: row[0], alias: row[1] }; });
  }

  function clone(value) { return JSON.parse(JSON.stringify(value)); }
  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function iconButton(action, icon, label, kind, attrs) {
    return '<button type="button" class="btn ' + (kind || 'btn-outline') + '" data-dp-action="' + action + '" ' + (attrs || '') + '><i class="bi bi-' + icon + '" aria-hidden="true"></i><span>' + label + '</span></button>';
  }
  function flatTree(items, result) {
    result = result || [];
    items.forEach(function (item) { result.push(item); flatTree(item.children || [], result); });
    return result;
  }
  function sourceLeaves() {
    return sources.reduce(function (all, item) { return all.concat(item.children || []); }, []);
  }
  function sourceById(id) { return sourceLeaves().find(function (item) { return item.id === id; }); }
  function tableById(id) {
    var found;
    sourceLeaves().some(function (source) { found = source.tables.find(function (table) { return table.id === id; }); return !!found; });
    return found;
  }
  function tableSource(id) { return sourceLeaves().find(function (source) { return source.tables.some(function (table) { return table.id === id; }); }); }
  function fieldTable(fieldId, tableId) {
    var table = tableById(tableId);
    return table && table.fields.some(function (field) { return field.id === fieldId; }) ? table : null;
  }
  function people() {
    var seen = {};
    return flatTree(organizations).filter(function (item) { return item.icon === 'person'; }).filter(function (item) {
      if (seen[item.name]) return false;
      seen[item.name] = true;
      return true;
    });
  }
  function actorById(id) {
    return flatTree(organizations).concat(flatTree(roles)).find(function (item) { return item.id === id; });
  }
  function personById(id) { return people().find(function (item) { return item.id === id; }); }
  function definitionById(id) { return store.definitions.find(function (item) { return item.id === id; }); }

  function seedPermissions() {
    var ids = flatTree(organizations).concat(flatTree(roles)).map(function (item) { return item.id; });
    var leaves = sourceLeaves();
    var allTables = leaves.reduce(function (all, source) { return all.concat(source.tables); }, []);
    var result = {};
    ids.forEach(function (id, index) {
      var grantedSources = leaves.filter(function (_, i) { return (i + index) % 3 !== 0; });
      var grantedTables = allTables.filter(function (table, i) {
        var source = tableSource(table.id);
        return grantedSources.some(function (item) { return item.id === source.id; }) && (i + index) % 4 !== 0;
      });
      result[id] = {
        sources: grantedSources.map(function (item) { return item.id; }),
        tables: grantedTables.map(function (item) { return item.id; }),
        fields: grantedTables.reduce(function (all, table, i) {
          return all.concat(table.fields.filter(function (_, j) { return (i + j + index) % 4 !== 0; }).map(function (field) { return table.id + ':' + field.id; }));
        }, [])
      };
    });
    return result;
  }

  function seedStore() {
    return {
      version: 1,
      permissions: seedPermissions(),
      definitions: [
        { id: 'domain-org', name: '经营主体', sourceType: 'table', sourceId: 'domain-table-org', domainField: 'entity_name', noteField: 'entity_desc' },
        { id: 'domain-region', name: '所属区域', sourceType: 'dictionary', sourceId: 'dict-region', domainField: '区域名称', noteField: '区域说明' },
        { id: 'domain-line', name: '业务条线', sourceType: 'table', sourceId: 'domain-table-line', domainField: 'line_name', noteField: 'line_desc' }
      ],
      configs: [
        { id: 'config-1', roleName: '供应链数据域管理员', definitionIds: ['domain-org', 'domain-line'], userIds: ['u-zhou', 'u-wang'], status: '审核通过' },
        { id: 'config-2', roleName: '经营分析数据域管理员', definitionIds: ['domain-region', 'domain-line'], userIds: ['u-li'], status: '待审核' },
        { id: 'config-3', roleName: '客户主数据管理员', definitionIds: ['domain-org', 'domain-region'], userIds: ['u-chen', 'u-xu'], status: '审核通过' }
      ]
    };
  }

  function loadStore() {
    try {
      var saved = JSON.parse(window.localStorage.getItem(storageKey));
      if (saved && saved.version === 1 && saved.permissions && Array.isArray(saved.definitions) && Array.isArray(saved.configs)) return saved;
    } catch (error) { /* 使用种子数据 */ }
    return seedStore();
  }
  function persist() {
    try { window.localStorage.setItem(storageKey, JSON.stringify(store)); return true; } catch (error) { return false; }
  }
  function permissionOf(id) {
    if (!store.permissions[id]) store.permissions[id] = { sources: [], tables: [], fields: [] };
    return store.permissions[id];
  }
  function includes(list, id) { return list.indexOf(id) >= 0; }
  function toggleValue(list, id, checked) {
    var next = list.filter(function (item) { return item !== id; });
    if (checked) next.push(id);
    return next;
  }
  function matchesStatus(granted, status) { return status === 'all' || (status === 'selected' ? granted : !granted); }
  function matchesText(text, keyword) { return !keyword || String(text).toLowerCase().indexOf(keyword.toLowerCase()) >= 0; }
  function notify(text, tone) { state.notice = { text: text, tone: tone || 'success' }; }
  function noticeHtml() {
    return state.notice ? '<div class="dp-perm-notice ' + esc(state.notice.tone) + '" role="status"><i class="bi bi-' + (state.notice.tone === 'error' ? 'exclamation-circle' : 'check-circle') + '"></i><span>' + esc(state.notice.text) + '</span></div>' : '';
  }

  function initialState(mode) {
    return {
      mode: mode,
      notice: null,
      actorMode: 'department', actorId: 'u-chen', actorDraft: '', actorKeyword: '',
      sourceId: 'src-supply-dwd', tableId: 'tbl-order-detail',
      expandedSources: new Set(['group-warehouse', 'group-business']),
      filters: {
        source: { status: 'all', draft: '', keyword: '' },
        table: { status: 'all', draft: '', keyword: '' },
        field: { status: 'all', draft: '', keyword: '' }
      },
      domainTab: 'config', domainScreen: 'list', configDraft: '', configKeyword: '',
      definitionId: 'domain-org', definitionDraft: null, definitionCreating: false,
      editor: null, peopleTab: 'department', peopleDraft: '', peopleKeyword: '', domainDraft: '', domainKeyword: '',
      pendingDomains: [], pendingUsers: []
    };
  }

  function controlQuery(kind, placeholder) {
    var filter = state.filters[kind];
    return '<div class="dp-perm-query"><select class="dp-perm-control" data-dp-filter="' + kind + '" aria-label="授权状态">' +
      '<option value="all"' + (filter.status === 'all' ? ' selected' : '') + '>全部</option>' +
      '<option value="selected"' + (filter.status === 'selected' ? ' selected' : '') + '>已选择</option>' +
      '<option value="unselected"' + (filter.status === 'unselected' ? ' selected' : '') + '>未选择</option></select>' +
      '<input class="dp-perm-control" type="search" data-dp-draft="' + kind + '" value="' + esc(filter.draft) + '" placeholder="' + placeholder + '">' +
      iconButton('filter-search', 'search', '查询', 'btn-primary', 'data-kind="' + kind + '"') + '</div>';
  }

  function treeMatch(item, keyword) {
    return matchesText(item.name, keyword) || (item.children || []).some(function (child) { return treeMatch(child, keyword); });
  }
  function renderActorTree(items) {
    var keyword = state.actorKeyword;
    function walk(nodes) {
      return '<ul>' + nodes.filter(function (item) { return treeMatch(item, keyword); }).map(function (item) {
        var children = item.children || [];
        return '<li><button type="button" class="dp-perm-tree-row' + (item.id === state.actorId ? ' active' : '') + '" data-dp-actor="' + esc(item.id) + '"><i class="bi bi-' + esc(item.icon) + '"></i><span>' + esc(item.name) + '</span></button>' + (children.length ? walk(children) : '') + '</li>';
      }).join('') + '</ul>';
    }
    var html = walk(items);
    return html === '<ul></ul>' ? emptyHtml('search', '没有匹配的权限对象') : html;
  }

  function renderActorPanel() {
    var items = state.actorMode === 'department' ? organizations : roles;
    return '<section class="dp-perm-panel actor"><header class="dp-perm-tabs"><button type="button" data-dp-action="actor-mode" data-mode="department" class="' + (state.actorMode === 'department' ? 'active' : '') + '"><i class="bi bi-diagram-3"></i><span>部门</span></button><button type="button" data-dp-action="actor-mode" data-mode="role" class="' + (state.actorMode === 'role' ? 'active' : '') + '"><i class="bi bi-people"></i><span>角色</span></button></header>' +
      '<div class="dp-perm-single-query"><input class="dp-perm-control" type="search" data-dp-actor-draft value="' + esc(state.actorDraft) + '" placeholder="搜索部门、角色或人员">' + iconButton('actor-search', 'search', '查询', 'btn-primary') + '</div>' +
      '<div class="dp-perm-tree dp-perm-actor-tree">' + renderActorTree(items) + '</div></section>';
  }

  function visibleSourceChildren(group, permission) {
    var filter = state.filters.source;
    return (group.children || []).filter(function (source) {
      var granted = includes(permission.sources, source.id);
      return matchesStatus(granted, filter.status) && matchesText(source.name + ' ' + source.type, filter.keyword);
    });
  }
  function renderSourceTree(permission) {
    var filter = state.filters.source;
    var html = sources.map(function (group) {
      var children = visibleSourceChildren(group, permission);
      if (!children.length && !matchesText(group.name, filter.keyword)) return '';
      var expanded = state.expandedSources.has(group.id) || !!filter.keyword;
      return '<li><button type="button" class="dp-perm-tree-row group" data-dp-source-toggle="' + esc(group.id) + '" aria-expanded="' + expanded + '"><i class="bi bi-chevron-right dp-perm-chevron"></i><i class="bi bi-layers-fill"></i><span>' + esc(group.name) + '</span><small>' + children.length + '</small></button>' +
        '<ul' + (expanded ? '' : ' hidden') + '>' + children.map(function (source) {
          var checked = includes(permission.sources, source.id);
          return '<li><div class="dp-perm-tree-row' + (source.id === state.sourceId ? ' active' : '') + '"><input type="checkbox" data-dp-grant-source="' + esc(source.id) + '" aria-label="授权' + esc(source.name) + '"' + (checked ? ' checked' : '') + '><button type="button" data-dp-source="' + esc(source.id) + '"><i class="bi bi-database"></i><span title="' + esc(source.name) + '">' + esc(source.name) + '</span><small>' + esc(source.type) + '</small></button></div></li>';
        }).join('') + '</ul></li>';
    }).join('');
    return html ? '<ul>' + html + '</ul>' : emptyHtml('database-x', '没有匹配的数据源');
  }

  function renderTableRows(permission) {
    var source = sourceById(state.sourceId);
    if (!source) return emptyHtml('table', '请选择数据源');
    var filter = state.filters.table;
    var rows = source.tables.filter(function (table) {
      return matchesStatus(includes(permission.tables, table.id), filter.status) && matchesText(table.name + ' ' + table.alias, filter.keyword);
    });
    if (!rows.length) return emptyHtml('table', '没有匹配的表');
    return '<div class="dp-perm-list" role="table" aria-label="表权限"><div class="dp-perm-list-head" role="row"><span></span><strong>表名</strong></div>' + rows.map(function (table) {
      return '<div class="dp-perm-list-row' + (table.id === state.tableId ? ' active' : '') + '" role="row"><input type="checkbox" data-dp-grant-table="' + esc(table.id) + '" aria-label="授权' + esc(table.alias) + '"' + (includes(permission.tables, table.id) ? ' checked' : '') + '><button type="button" data-dp-table="' + esc(table.id) + '" title="' + esc(table.name + '（' + table.alias + '）') + '"><span>' + esc(table.name) + '</span><small>（' + esc(table.alias) + '）</small></button></div>';
    }).join('') + '</div>';
  }

  function renderFieldRows(permission) {
    var table = tableById(state.tableId);
    if (!table || !fieldTable(table.fields[0] && table.fields[0].id, table.id)) return emptyHtml('columns-gap', '请选择表');
    var filter = state.filters.field;
    var rows = table.fields.filter(function (field) {
      var key = table.id + ':' + field.id;
      return matchesStatus(includes(permission.fields, key), filter.status) && matchesText(field.name + ' ' + field.alias, filter.keyword);
    });
    if (!rows.length) return emptyHtml('columns-gap', '没有匹配的字段');
    return '<div class="dp-perm-list" role="table" aria-label="字段权限"><div class="dp-perm-list-head" role="row"><span></span><strong>列名称</strong></div>' + rows.map(function (field) {
      var key = table.id + ':' + field.id;
      return '<label class="dp-perm-list-row"><input type="checkbox" data-dp-grant-field="' + esc(key) + '" aria-label="授权' + esc(field.alias) + '"' + (includes(permission.fields, key) ? ' checked' : '') + '><span title="' + esc(field.name + '（' + field.alias + '）') + '">' + esc(field.name) + '<small>（' + esc(field.alias) + '）</small></span></label>';
    }).join('') + '</div>';
  }

  function renderResourcePanel(kind, title, icon, content) {
    return '<section class="dp-perm-panel"><header class="dp-perm-panel-title"><i class="bi bi-' + icon + '"></i><h2>' + title + '</h2></header>' + controlQuery(kind, kind === 'source' ? '搜索数据源' : kind === 'table' ? '搜索表名' : '搜索列名称') + '<div class="dp-perm-panel-body">' + content + '</div></section>';
  }

  function renderPermission() {
    var permission = permissionOf(state.actorId);
    var actor = actorById(state.actorId);
    root.innerHTML = '<div class="dp-perm-page-head"><div><h1><i class="bi bi-shield-lock"></i>权限配置</h1><p>当前权限对象：<strong>' + esc(actor ? actor.name : '请选择') + '</strong></p></div></div>' + noticeHtml() +
      '<div class="dp-perm-grid">' + renderActorPanel() + renderResourcePanel('source', '数据源', 'database', renderSourceTree(permission)) + renderResourcePanel('table', '表', 'table', renderTableRows(permission)) + renderResourcePanel('field', '字段', 'columns-gap', renderFieldRows(permission)) + '</div>';
  }

  function emptyHtml(icon, text) { return '<div class="dp-perm-empty"><i class="bi bi-' + icon + '"></i><span>' + esc(text) + '</span></div>'; }
  function statusTag(status) {
    var tone = status === '审核通过' ? 'green' : status === '待审核' ? 'orange' : 'gray';
    return '<span class="dp-domain-status ' + tone + '">' + esc(status) + '</span>';
  }
  function configDefinitionText(row) {
    return row.definitionIds.map(function (id) { var item = definitionById(id); return item ? item.name : ''; }).filter(Boolean).join('、') || '未配置';
  }
  function configPeopleText(row) {
    return row.userIds.map(function (id) { var item = personById(id); return item ? item.name : ''; }).filter(Boolean).join('、') || '未配置';
  }

  function renderDomainTabs() {
    return '<div class="dp-domain-tabs" role="tablist"><button type="button" role="tab" data-dp-domain-tab="config" aria-selected="' + (state.domainTab === 'config') + '" class="' + (state.domainTab === 'config' ? 'active' : '') + '"><i class="bi bi-sliders"></i><span>配置管理</span></button><button type="button" role="tab" data-dp-domain-tab="definition" aria-selected="' + (state.domainTab === 'definition') + '" class="' + (state.domainTab === 'definition' ? 'active' : '') + '"><i class="bi bi-diagram-3"></i><span>定义管理</span></button></div>';
  }

  function renderConfigList() {
    var rows = store.configs.filter(function (row) {
      return matchesText(row.roleName + ' ' + configDefinitionText(row) + ' ' + configPeopleText(row) + ' ' + row.status, state.configKeyword);
    });
    return '<div class="dp-domain-toolbar"><div>' + iconButton('config-new', 'plus-lg', '新建', 'btn-primary') + '</div><div class="dp-domain-query"><input class="dp-perm-control" data-dp-config-draft type="search" value="' + esc(state.configDraft) + '" placeholder="关键词查询">' + iconButton('config-search', 'search', '查询', 'btn-primary') + '</div></div>' +
      '<div class="dp-domain-table-wrap"><table class="ds-table dp-domain-table"><thead><tr><th>序号</th><th>角色名称</th><th>分权分域信息</th><th>配置人员信息</th><th>审核状态</th><th>操作</th></tr></thead><tbody>' + (rows.length ? rows.map(function (row, index) {
        return '<tr><td>' + (index + 1) + '</td><td><strong>' + esc(row.roleName) + '</strong></td><td title="' + esc(configDefinitionText(row)) + '">' + esc(configDefinitionText(row)) + '</td><td title="' + esc(configPeopleText(row)) + '">' + esc(configPeopleText(row)) + '</td><td>' + statusTag(row.status) + '</td><td><button type="button" class="dp-link-btn" data-dp-edit-config="' + esc(row.id) + '"><i class="bi bi-pencil-square"></i><span>编辑</span></button></td></tr>';
      }).join('') : '<tr><td colspan="6">' + emptyHtml('inbox', '没有找到匹配的记录') + '</td></tr>') + '</tbody></table></div><div class="dp-domain-total">共 <strong>' + rows.length + '</strong> 条</div>';
  }

  function definitionSource(item) {
    if (!item) return null;
    return item.sourceType === 'dictionary' ? dictionaries.find(function (row) { return row.id === item.sourceId; }) : domainTables.find(function (row) { return row.id === item.sourceId; });
  }
  function definitionFieldOptions(draft) {
    var source = definitionSource(draft);
    return source ? source.fields : [];
  }
  function selectOptions(items, value, placeholder, valueKey, textKey) {
    return '<option value="">' + placeholder + '</option>' + items.map(function (item) {
      var itemValue = typeof item === 'string' ? item : item[valueKey || 'id'];
      var text = typeof item === 'string' ? item : item[textKey || 'name'];
      return '<option value="' + esc(itemValue) + '"' + (itemValue === value ? ' selected' : '') + '>' + esc(text) + '</option>';
    }).join('');
  }
  function renderDefinitionTree() {
    var items = store.definitions.slice();
    if (state.definitionCreating && state.definitionDraft) items.push(state.definitionDraft);
    return '<div class="dp-definition-tree">' + items.map(function (item) {
      var active = item.id === state.definitionId;
      return '<button type="button" class="dp-definition-node' + (active ? ' active' : '') + '" data-dp-definition="' + esc(item.id) + '"><i class="bi bi-folder-fill"></i>' +
        (state.definitionCreating && active ? '<input data-dp-definition-name value="' + esc(item.name) + '" maxlength="50" aria-label="分权分域名称">' : '<span>' + esc(item.name) + '</span>') + '</button>';
    }).join('') + '</div>';
  }
  function renderDefinitionForm() {
    var draft = state.definitionDraft;
    if (!draft) return emptyHtml('diagram-3', '请选择分权分域定义');
    var fields = definitionFieldOptions(draft);
    var sourceControl = draft.sourceType === 'dictionary' ?
      '<label class="dp-domain-field"><span>字典表</span><select class="dp-perm-control" data-dp-definition-field="sourceId">' + selectOptions(dictionaries, draft.sourceId, '请选择字典表') + '</select></label>' :
      '<label class="dp-domain-field"><span>数据库</span><select class="dp-perm-control" data-dp-definition-database><option value="">请选择数据库</option>' + Array.from(new Set(domainTables.map(function (item) { return item.database; }))).map(function (name) { var current = definitionSource(draft); return '<option value="' + esc(name) + '"' + (current && current.database === name ? ' selected' : '') + '>' + esc(name) + '</option>'; }).join('') + '</select></label><label class="dp-domain-field"><span>表</span><select class="dp-perm-control" data-dp-definition-field="sourceId">' + selectOptions(domainTables.filter(function (item) { var current = definitionSource(draft); return current ? item.database === current.database : true; }), draft.sourceId, '请选择表') + '</select></label>';
    return '<div class="dp-definition-form"><div class="dp-definition-source"><label class="dp-domain-field"><span>数据来源</span><select class="dp-perm-control" data-dp-definition-field="sourceType"><option value="dictionary"' + (draft.sourceType === 'dictionary' ? ' selected' : '') + '>字典表</option><option value="table"' + (draft.sourceType === 'table' ? ' selected' : '') + '>数据表</option></select></label>' + sourceControl + '</div>' +
      '<table class="ds-table dp-definition-map"><thead><tr><th>分权分域</th><th>备注</th></tr></thead><tbody><tr><td><select class="dp-perm-control" data-dp-definition-field="domainField">' + selectOptions(fields, draft.domainField, '请选择字段') + '</select></td><td><select class="dp-perm-control" data-dp-definition-field="noteField">' + selectOptions(fields, draft.noteField, '请选择字段') + '</select></td></tr></tbody></table>' +
      '<div class="dp-definition-footer">' + iconButton('definition-save', 'floppy', '保存', 'btn-primary') + '</div></div>';
  }

  function renderDefinitionManagement() {
    var selected = definitionById(state.definitionId);
    if (!state.definitionDraft) state.definitionDraft = selected ? clone(selected) : null;
    return '<div class="dp-definition-layout"><aside class="dp-definition-side"><div class="dp-definition-actions">' + iconButton('definition-sync', 'arrow-repeat', '同步', 'btn-primary') + iconButton('definition-new', 'plus-lg', '新建', 'btn-primary') + iconButton('definition-delete', 'trash3', '删除', 'btn-danger', state.definitionId ? '' : 'disabled') + '</div>' + renderDefinitionTree() + '</aside><main class="dp-definition-main">' + renderDefinitionForm() + '</main></div>';
  }

  function transferPanel(title, type, itemsHtml) {
    return '<section class="dp-transfer-panel"><header><strong>' + title + '</strong></header><div class="dp-transfer-body" data-dp-transfer="' + type + '">' + itemsHtml + '</div></section>';
  }
  function availableDefinitions() {
    return store.definitions.filter(function (item) { return !includes(state.editor.definitionIds, item.id) && matchesText(item.name, state.domainKeyword); });
  }
  function renderDefinitionChoices(items, selected, attr) {
    if (!items.length) return emptyHtml('inbox', '暂无可选项');
    return items.map(function (item) {
      var source = definitionSource(item);
      return '<label class="dp-choice-row"><input type="checkbox" ' + attr + '="' + esc(item.id) + '"' + (includes(selected, item.id) ? ' checked' : '') + '><span><strong>' + esc(item.name) + '</strong><small>' + esc(source ? source.name : '来源未配置') + '</small></span></label>';
    }).join('');
  }
  function departmentPeopleHtml() {
    var keyword = state.peopleKeyword;
    var availableIds = people().filter(function (person) { return !includes(state.editor.userIds, person.id); }).map(function (person) { return person.id; });
    function walk(nodes) {
      return '<ul>' + nodes.map(function (item) {
        var children = item.children || [];
        if (children.length) {
          var childHtml = walk(children);
          if (childHtml === '<ul></ul>' && !matchesText(item.name, keyword)) return '';
          return '<li><div class="dp-people-group"><i class="bi bi-folder2"></i><span>' + esc(item.name) + '</span></div>' + childHtml + '</li>';
        }
        if (!includes(availableIds, item.id) || !matchesText(item.name, keyword)) return '';
        return '<li><label class="dp-choice-row compact"><input type="checkbox" data-dp-pending-user="' + esc(item.id) + '"' + (includes(state.pendingUsers, item.id) ? ' checked' : '') + '><span><strong>' + esc(item.name) + '</strong></span></label></li>';
      }).join('') + '</ul>';
    }
    var html = walk(organizations);
    return html === '<ul></ul>' ? emptyHtml('person-x', '暂无可选人员') : html;
  }
  function flatPeopleHtml() {
    var items = people().filter(function (item) { return !includes(state.editor.userIds, item.id) && matchesText(item.name, state.peopleKeyword); });
    if (!items.length) return emptyHtml('person-x', '暂无可选人员');
    return items.map(function (item) { return '<label class="dp-choice-row compact"><input type="checkbox" data-dp-pending-user="' + esc(item.id) + '"' + (includes(state.pendingUsers, item.id) ? ' checked' : '') + '><span><strong>' + esc(item.name) + '</strong></span></label>'; }).join('');
  }

  function renderConfigEditor() {
    var editor = state.editor;
    var selectedDefinitions = editor.definitionIds.map(definitionById).filter(Boolean);
    var selectedUsers = editor.userIds.map(personById).filter(Boolean);
    var domainAvailable = '<div class="dp-transfer-query"><input class="dp-perm-control" data-dp-domain-draft value="' + esc(state.domainDraft) + '" placeholder="搜索分权分域">' + iconButton('editor-domain-search', 'search', '查询', 'btn-primary') + '</div>' + renderDefinitionChoices(availableDefinitions(), state.pendingDomains, 'data-dp-pending-domain');
    var domainSelected = renderDefinitionChoices(selectedDefinitions, [], 'data-dp-remove-domain');
    var peopleAvailable = '<div class="dp-people-tabs"><button type="button" data-dp-people-tab="department" class="' + (state.peopleTab === 'department' ? 'active' : '') + '"><i class="bi bi-diagram-3"></i><span>按部门</span></button><button type="button" data-dp-people-tab="user" class="' + (state.peopleTab === 'user' ? 'active' : '') + '"><i class="bi bi-person"></i><span>按用户</span></button></div><div class="dp-transfer-query"><input class="dp-perm-control" data-dp-people-draft value="' + esc(state.peopleDraft) + '" placeholder="搜索部门或用户">' + iconButton('editor-people-search', 'search', '查询', 'btn-primary') + '</div>' + (state.peopleTab === 'department' ? departmentPeopleHtml() : flatPeopleHtml());
    var peopleSelected = selectedUsers.length ? selectedUsers.map(function (item) { return '<label class="dp-choice-row compact"><input type="checkbox" data-dp-remove-user="' + esc(item.id) + '"><span><strong>' + esc(item.name) + '</strong></span></label>'; }).join('') : emptyHtml('person-plus', '暂未选择用户');
    return '<div class="dp-domain-editor"><header class="dp-editor-head"><h2><i class="bi bi-list-check"></i>' + (editor.id ? '编辑' : '新建') + '</h2>' + iconButton('editor-cancel', 'arrow-left', '返回', 'btn-primary') + '</header><div class="dp-editor-form"><label class="dp-editor-role"><span>角色名称</span><input class="dp-perm-control" data-dp-role-name maxlength="50" value="' + esc(editor.roleName) + '" placeholder="长度不超过50个字符"><small><i class="bi bi-info-circle"></i>50个字符以内</small></label>' +
      '<section class="dp-editor-section"><h3>分权分域</h3><div class="dp-transfer-grid">' + transferPanel('待选择', 'domain-available', domainAvailable) + '<div class="dp-transfer-actions">' + iconButton('editor-add-domains', 'chevron-right', '添加', 'btn-outline') + iconButton('editor-remove-domains', 'chevron-left', '移除', 'btn-outline') + '</div>' + transferPanel('已选择', 'domain-selected', domainSelected) + '</div></section>' +
      '<section class="dp-editor-section"><h3>人员配置</h3><div class="dp-transfer-grid">' + transferPanel('待选择', 'people-available', peopleAvailable) + '<div class="dp-transfer-actions">' + iconButton('editor-add-users', 'chevron-right', '添加', 'btn-outline') + iconButton('editor-remove-users', 'chevron-left', '移除', 'btn-outline') + '</div>' + transferPanel('已选择用户', 'people-selected', peopleSelected) + '</div></section></div>' +
      '<footer class="dp-editor-footer">' + iconButton('editor-submit', 'send-check', '提交审核', 'btn-primary') + iconButton('editor-cancel', 'x-lg', '取消', 'btn-outline') + '</footer></div>';
  }

  function renderDomain() {
    if (state.domainScreen === 'editor' && state.editor) {
      root.innerHTML = noticeHtml() + renderConfigEditor();
      return;
    }
    root.innerHTML = '<div class="dp-perm-page-head"><div><h1><i class="bi bi-diagram-2"></i>分权分域</h1><p>维护分权分域定义及角色人员配置</p></div></div>' + noticeHtml() + '<div class="dp-domain-card">' + renderDomainTabs() + '<div class="dp-domain-content">' + (state.domainTab === 'config' ? renderConfigList() : renderDefinitionManagement()) + '</div></div>';
  }

  function render() { if (state.mode === 'permission') renderPermission(); else renderDomain(); }

  function setSourceGrant(sourceId, checked) {
    var permission = permissionOf(state.actorId);
    permission.sources = toggleValue(permission.sources, sourceId, checked);
    if (!checked) {
      var source = sourceById(sourceId);
      var tableIds = source ? source.tables.map(function (table) { return table.id; }) : [];
      permission.tables = permission.tables.filter(function (id) { return !includes(tableIds, id); });
      permission.fields = permission.fields.filter(function (key) { return !tableIds.some(function (id) { return key.indexOf(id + ':') === 0; }); });
    }
    notify((checked ? '已授予' : '已取消') + '“' + actorById(state.actorId).name + '”的数据源权限。');
    persist(); renderPermission();
  }
  function setTableGrant(tableId, checked) {
    var permission = permissionOf(state.actorId), source = tableSource(tableId);
    permission.tables = toggleValue(permission.tables, tableId, checked);
    if (checked && source) permission.sources = toggleValue(permission.sources, source.id, true);
    if (!checked) permission.fields = permission.fields.filter(function (key) { return key.indexOf(tableId + ':') !== 0; });
    notify((checked ? '已授予' : '已取消') + '表权限。');
    persist(); renderPermission();
  }
  function setFieldGrant(key, checked) {
    var permission = permissionOf(state.actorId), parts = key.split(':'), tableId = parts[0], source = tableSource(tableId);
    permission.fields = toggleValue(permission.fields, key, checked);
    if (checked) {
      permission.tables = toggleValue(permission.tables, tableId, true);
      if (source) permission.sources = toggleValue(permission.sources, source.id, true);
    }
    notify((checked ? '已授予' : '已取消') + '字段权限。');
    persist(); renderPermission();
  }

  function startConfigEditor(id) {
    var source = store.configs.find(function (item) { return item.id === id; });
    state.editor = source ? clone(source) : { id: '', roleName: '', definitionIds: [], userIds: [], status: '待审核' };
    state.domainScreen = 'editor'; state.pendingDomains = []; state.pendingUsers = [];
    state.peopleDraft = ''; state.peopleKeyword = ''; state.domainDraft = ''; state.domainKeyword = '';
    renderDomain();
  }
  function selectedChecked(attr) {
    return Array.prototype.map.call(root.querySelectorAll('input[' + attr + ']:checked'), function (input) { return input.getAttribute(attr); });
  }
  function submitConfig() {
    var nameInput = root.querySelector('[data-dp-role-name]');
    if (nameInput) state.editor.roleName = nameInput.value.trim();
    if (!state.editor.roleName) { notify('请输入角色名称。', 'error'); renderDomain(); return; }
    if (state.editor.roleName.length > 50) { notify('角色名称不能超过50个字符。', 'error'); renderDomain(); return; }
    if (!state.editor.definitionIds.length) { notify('请至少选择一项分权分域。', 'error'); renderDomain(); return; }
    if (!state.editor.userIds.length) { notify('请至少选择一名配置人员。', 'error'); renderDomain(); return; }
    if (state.editor.id) {
      var index = store.configs.findIndex(function (item) { return item.id === state.editor.id; });
      store.configs[index] = clone(state.editor); store.configs[index].status = '待审核';
    } else {
      state.editor.id = 'config-' + Date.now(); state.editor.status = '待审核'; store.configs.unshift(clone(state.editor));
    }
    persist(); state.domainScreen = 'list'; state.editor = null; notify('分权分域配置已提交审核。'); renderDomain();
  }

  function newDefinition() {
    state.definitionCreating = true;
    state.definitionDraft = { id: 'domain-new-' + Date.now(), name: '新建分权分域' + (store.definitions.length + 1), sourceType: 'dictionary', sourceId: '', domainField: '', noteField: '' };
    state.definitionId = state.definitionDraft.id;
    renderDomain();
    var input = root.querySelector('[data-dp-definition-name]');
    if (input) { input.focus(); if (typeof input.select === 'function') input.select(); }
  }
  function saveDefinition() {
    var draft = state.definitionDraft;
    var nameInput = root.querySelector('[data-dp-definition-name]');
    if (nameInput) draft.name = nameInput.value.trim();
    if (!draft.name) { notify('请输入分权分域名称。', 'error'); renderDomain(); return; }
    if (!draft.sourceId) { notify('请选择数据来源。', 'error'); renderDomain(); return; }
    if (!draft.domainField || !draft.noteField) { notify('请选择分权分域和备注字段。', 'error'); renderDomain(); return; }
    var duplicate = store.definitions.some(function (item) { return item.id !== draft.id && item.name === draft.name; });
    if (duplicate) { notify('分权分域名称已存在。', 'error'); renderDomain(); return; }
    var index = store.definitions.findIndex(function (item) { return item.id === draft.id; });
    if (index >= 0) store.definitions[index] = clone(draft); else store.definitions.push(clone(draft));
    state.definitionCreating = false; state.definitionId = draft.id; persist(); notify('分权分域定义已保存。'); renderDomain();
  }
  function deleteDefinition() {
    var item = definitionById(state.definitionId);
    if (!item) return;
    DP.confirm('确认删除分权分域定义“' + esc(item.name) + '”？', {
      icon: 'danger', okText: '<i class="bi bi-trash3"></i> 删除', cancelText: '<i class="bi bi-x-lg"></i> 取消',
      onOk: function () {
        store.definitions = store.definitions.filter(function (row) { return row.id !== item.id; });
        store.configs.forEach(function (row) { row.definitionIds = row.definitionIds.filter(function (id) { return id !== item.id; }); });
        state.definitionId = store.definitions[0] ? store.definitions[0].id : '';
        state.definitionDraft = null; persist(); notify('分权分域定义已删除。'); if (root.isConnected) renderDomain();
      }
    });
  }

  function handleAction(button) {
    var action = button.dataset.dpAction;
    if (action === 'actor-mode') { state.actorMode = button.dataset.mode; state.actorId = state.actorMode === 'department' ? 'u-chen' : 'role-governor'; state.actorDraft = ''; state.actorKeyword = ''; renderPermission(); }
    else if (action === 'actor-search') { var actorInput = root.querySelector('[data-dp-actor-draft]'); state.actorDraft = actorInput.value; state.actorKeyword = actorInput.value.trim(); renderPermission(); }
    else if (action === 'filter-search') { var kind = button.dataset.kind, input = root.querySelector('[data-dp-draft="' + kind + '"]'); state.filters[kind].draft = input.value; state.filters[kind].keyword = input.value.trim(); renderPermission(); }
    else if (action === 'config-new') startConfigEditor('');
    else if (action === 'config-search') { var configInput = root.querySelector('[data-dp-config-draft]'); state.configDraft = configInput.value; state.configKeyword = configInput.value.trim(); renderDomain(); }
    else if (action === 'editor-cancel') { state.domainScreen = 'list'; state.editor = null; state.notice = null; renderDomain(); }
    else if (action === 'editor-domain-search') { var domainInput = root.querySelector('[data-dp-domain-draft]'); state.domainDraft = domainInput.value; state.domainKeyword = domainInput.value.trim(); renderDomain(); }
    else if (action === 'editor-people-search') { var peopleInput = root.querySelector('[data-dp-people-draft]'); state.peopleDraft = peopleInput.value; state.peopleKeyword = peopleInput.value.trim(); renderDomain(); }
    else if (action === 'editor-add-domains') { selectedChecked('data-dp-pending-domain').forEach(function (id) { if (!includes(state.editor.definitionIds, id)) state.editor.definitionIds.push(id); }); state.pendingDomains = []; renderDomain(); }
    else if (action === 'editor-remove-domains') { var removeDomains = selectedChecked('data-dp-remove-domain'); state.editor.definitionIds = state.editor.definitionIds.filter(function (id) { return !includes(removeDomains, id); }); renderDomain(); }
    else if (action === 'editor-add-users') { selectedChecked('data-dp-pending-user').forEach(function (id) { if (!includes(state.editor.userIds, id)) state.editor.userIds.push(id); }); state.pendingUsers = []; renderDomain(); }
    else if (action === 'editor-remove-users') { var removeUsers = selectedChecked('data-dp-remove-user'); state.editor.userIds = state.editor.userIds.filter(function (id) { return !includes(removeUsers, id); }); renderDomain(); }
    else if (action === 'editor-submit') submitConfig();
    else if (action === 'definition-sync') { notify('分权分域定义已同步。'); renderDomain(); }
    else if (action === 'definition-new') newDefinition();
    else if (action === 'definition-delete') deleteDefinition();
    else if (action === 'definition-save') saveDefinition();
  }

  function onClick(event) {
    var action = event.target.closest('[data-dp-action]'); if (action) { handleAction(action); return; }
    var actor = event.target.closest('[data-dp-actor]'); if (actor) { state.actorId = actor.dataset.dpActor; state.notice = null; renderPermission(); return; }
    var toggle = event.target.closest('[data-dp-source-toggle]'); if (toggle) { var groupId = toggle.dataset.dpSourceToggle; if (state.expandedSources.has(groupId)) state.expandedSources.delete(groupId); else state.expandedSources.add(groupId); renderPermission(); return; }
    var source = event.target.closest('[data-dp-source]'); if (source) { state.sourceId = source.dataset.dpSource; var sourceRow = sourceById(state.sourceId); state.tableId = sourceRow && sourceRow.tables[0] ? sourceRow.tables[0].id : ''; renderPermission(); return; }
    var table = event.target.closest('[data-dp-table]'); if (table) { state.tableId = table.dataset.dpTable; renderPermission(); return; }
    var tab = event.target.closest('[data-dp-domain-tab]'); if (tab) { state.domainTab = tab.dataset.dpDomainTab; state.notice = null; state.definitionCreating = false; state.definitionDraft = null; renderDomain(); return; }
    var edit = event.target.closest('[data-dp-edit-config]'); if (edit) { startConfigEditor(edit.dataset.dpEditConfig); return; }
    var peopleTab = event.target.closest('[data-dp-people-tab]'); if (peopleTab) { state.peopleTab = peopleTab.dataset.dpPeopleTab; state.pendingUsers = []; state.peopleDraft = ''; state.peopleKeyword = ''; renderDomain(); return; }
    var definition = event.target.closest('[data-dp-definition]'); if (definition && event.target.tagName !== 'INPUT') { state.definitionCreating = false; state.definitionId = definition.dataset.dpDefinition; state.definitionDraft = clone(definitionById(state.definitionId)); renderDomain(); }
  }

  function onChange(event) {
    var input = event.target;
    if (input.matches('[data-dp-grant-source]')) { setSourceGrant(input.dataset.dpGrantSource, input.checked); return; }
    if (input.matches('[data-dp-grant-table]')) { setTableGrant(input.dataset.dpGrantTable, input.checked); return; }
    if (input.matches('[data-dp-grant-field]')) { setFieldGrant(input.dataset.dpGrantField, input.checked); return; }
    if (input.matches('[data-dp-filter]')) { state.filters[input.dataset.dpFilter].status = input.value; renderPermission(); return; }
    if (input.matches('[data-dp-definition-field]')) {
      var key = input.dataset.dpDefinitionField; state.definitionDraft[key] = input.value;
      if (key === 'sourceType' || key === 'sourceId') { state.definitionDraft.domainField = ''; state.definitionDraft.noteField = ''; }
      renderDomain(); return;
    }
    if (input.matches('[data-dp-definition-database]')) {
      var first = domainTables.find(function (item) { return item.database === input.value; });
      state.definitionDraft.sourceId = first ? first.id : ''; state.definitionDraft.domainField = ''; state.definitionDraft.noteField = ''; renderDomain();
    }
  }

  function onInput(event) {
    var input = event.target;
    if (input.matches('[data-dp-draft]')) state.filters[input.dataset.dpDraft].draft = input.value;
    else if (input.matches('[data-dp-actor-draft]')) state.actorDraft = input.value;
    else if (input.matches('[data-dp-config-draft]')) state.configDraft = input.value;
    else if (input.matches('[data-dp-role-name]') && state.editor) state.editor.roleName = input.value;
    else if (input.matches('[data-dp-domain-draft]')) state.domainDraft = input.value;
    else if (input.matches('[data-dp-people-draft]')) state.peopleDraft = input.value;
    else if (input.matches('[data-dp-definition-name]') && state.definitionDraft) state.definitionDraft.name = input.value;
  }

  function onKeydown(event) {
    if (event.key !== 'Enter') return;
    var action = '';
    if (event.target.matches('[data-dp-actor-draft]')) action = 'actor-search';
    else if (event.target.matches('[data-dp-draft]')) action = 'filter-search';
    else if (event.target.matches('[data-dp-config-draft]')) action = 'config-search';
    else if (event.target.matches('[data-dp-domain-draft]')) action = 'editor-domain-search';
    else if (event.target.matches('[data-dp-people-draft]')) action = 'editor-people-search';
    if (!action) return;
    event.preventDefault();
    var selector = '[data-dp-action="' + action + '"]';
    var button = root.querySelector(selector + (action === 'filter-search' ? '[data-kind="' + event.target.dataset.dpDraft + '"]' : ''));
    if (button) handleAction(button);
  }

  function init(mode) {
    root = document.querySelector('.page-data-permission');
    if (!root) return;
    store = loadStore(); state = initialState(mode === 'domain' ? 'domain' : 'permission');
    root.addEventListener('click', onClick);
    root.addEventListener('change', onChange);
    root.addEventListener('input', onInput);
    root.addEventListener('keydown', onKeydown);
    render();
  }

  return { html: '<div class="page-data-permission"></div>', init: init };
})();
