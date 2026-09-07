/** 控制台 / 文档管理：本地文档、分类、富文本与附件。系统对照见 work/document-management/。 */
window.DP = window.DP || {};
DP.pages = DP.pages || {};
DP.pages.documentManagement = (function () {
  'use strict';
  var root, store, editor, draft, categoryDraft, databasePromise, busy = false, sequence = 0;
  var mode = 'list', categoryId = 'root', keyword = '', keywordDraft = '', treeKeyword = '', page = 1, pageSize = 10;
  var selected = new Set(), expanded = new Set(['root', 'governance', 'development']), memoryFiles = new Map();
  var picker = null, lastFocus = null;
  var currentUser = '专用账户';
  function esc(value) { return DP.logView.esc(value); }
  function clone(value) { return JSON.parse(JSON.stringify(value)); }
  function uid(prefix) { sequence += 1; return prefix + '-' + Date.now().toString(36) + '-' + sequence; }
  function button(action, icon, label, attrs, cls) {
    return '<button type="button" class="btn ' + (cls || 'btn-outline') + '" data-dm-action="' + action + '" ' + (attrs || '') + '><i class="bi bi-' + icon + '" aria-hidden="true"></i><span>' + esc(label) + '</span></button>';
  }
  function timestamp() {
    var date = new Date(); function pad(value) { return String(value).padStart(2, '0'); }
    return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate()) + ' ' + pad(date.getHours()) + ':' + pad(date.getMinutes()) + ':' + pad(date.getSeconds());
  }
  function seedStore() {
    var categories = [
      ['root', '', 'ALL', '全部文档'], ['platform', 'root', 'PLATFORM', '平台规范'],
      ['project', 'platform', 'PROJECT', '项目管理'], ['security', 'platform', 'SECURITY', '安全管理'],
      ['governance', 'root', 'GOVERNANCE', '数据治理'], ['standard', 'governance', 'STANDARD', '数据标准'],
      ['quality', 'governance', 'QUALITY', '质量管理'], ['metadata', 'governance', 'METADATA', '元数据管理'],
      ['development', 'root', 'DEVELOPMENT', '数据开发'], ['offline', 'development', 'OFFLINE', '离线开发'],
      ['realtime', 'development', 'REALTIME', '实时开发'], ['service', 'root', 'SERVICE', '数据服务'],
      ['api', 'service', 'API', '接口文档']
    ].map(function (item) { return { id: item[0], parent: item[1], code: item[2], name: item[3], description: item[3] === '全部文档' ? '' : item[3] + '相关设计与操作说明', ownerIds: [] }; });
    var examples = [
      ['standard', '订单金额数据标准说明', '统一订单金额、优惠金额与实付金额的定义及精度，适用于订单域数据接入与加工。', '订单金额,DECIMAL(18,2),元\n优惠金额,DECIMAL(18,2),元\n实付金额,DECIMAL(18,2),元'],
      ['project', '数仓建设项目资源配置说明', '说明开发、测试和生产环境的资源申请与配置流程，明确项目负责人和资源使用范围。'],
      ['offline', '订单明细每日入仓流程设计', '按业务日期抽取订单明细，完成字段映射、去重和汇总后写入明细层。'],
      ['quality', '核心数据质量稽查操作指南', '梳理完整性、唯一性和准确性稽查任务的配置、执行与问题复核。', '稽查项,规则说明\n订单编号唯一性,同一业务日期订单编号不重复\n客户编号完整性,客户编号不能为空'],
      ['api', '客户订单查询接口使用说明', '面向客户服务场景，提供订单状态和订单汇总查询的参数与返回口径。'],
      ['metadata', '客户主题域元模型设计', '定义客户实体、客户属性和业务关系，统一采集与管理口径。'],
      ['realtime', '物流轨迹实时采集方案', '采集物流节点事件并按事件时间处理乱序和重复消息，形成轨迹明细。'],
      ['security', '敏感数据使用管理规范', '明确敏感字段的使用范围、脱敏要求与访问记录核对要求。'],
      ['standard', '客户标识统一编码规范', '规范客户标识命名、长度、唯一性和跨系统映射关系。'],
      ['quality', '订单主题质量问题处理流程', '说明问题登记、原因分析、整改与复核的责任分工。'],
      ['offline', '库存快照每日汇总设计', '按仓库、商品与业务日期聚合库存快照，保持期初、入库、出库与期末数量一致。'],
      ['api', '供应商履约查询接口说明', '约定供应商履约查询的筛选参数、指标口径和错误处理。'],
      ['metadata', '元数据采集与同步操作说明', '说明数据源选择、采集范围、同步结果检查及异常排查步骤。'],
      ['project', '项目成员配置与协作约定', '按项目开发职责配置人员，明确开发、复核和业务确认分工。'],
      ['standard', '物流状态代码对照说明', '统一待揽收、运输中、派送中与已签收等状态的业务含义。'],
      ['realtime', '实时数据重复事件处理说明', '使用业务主键和事件标识识别重复消息，保证下游统计口径一致。'],
      ['quality', '数据质量规则版本使用说明', '说明任务引用规则版本的方式以及变更后的验证步骤。'],
      ['security', '数据服务应用访问约定', '约定应用使用范围、访问凭证保管与接口调用记录检查要求。'],
      ['offline', '月度经营指标加工说明', '定义统计周期、时间边界与订单金额汇总口径。'],
      ['api', '物流时效查询参数说明', '说明查询时间范围、节点类型和时效统计结果的含义。'],
      ['metadata', '业务元数据描述编写规范', '描述字段应包含业务定义、取值说明、统计口径和维护负责人。'],
      ['platform', '数据中台文档编写规范', '按业务主题组织文档，名称清晰，正文说明适用范围和操作步骤。']
    ];
    var users = ['王敏', '张伟', currentUser, '李娜', '陈晨'];
    var documents = examples.map(function (item, index) {
      var id = 'DOC' + String(index + 1).padStart(4, '0');
      var html = '<h2>' + esc(item[1]) + '</h2><p>' + esc(item[2]) + '</p><h3>适用范围</h3><p>适用于数据中台相关业务主题的开发、管理与使用，涉及变更时应同步核对相关数据对象。</p>' +
        '<h3>操作说明</h3><ol><li>核对业务对象、所属项目与适用环境。</li><li>按文档口径完成配置，并检查关键字段与处理结果。</li><li>记录核对结论，保持上下游口径一致。</li></ol>' +
        (index % 3 === 0 ? '<h3>核对清单</h3><ul><li><input type="checkbox" checked> 已核对数据来源</li><li><input type="checkbox"> 已完成下游结果复核</li></ul>' : '<blockquote>说明中的业务定义应与项目当前采用的数据标准保持一致。</blockquote>');
      var attachments = [];
      if (item[3]) { var text = '\uFEFF' + (index === 0 ? '字段,数据类型,说明\n' : '') + item[3]; attachments.push({ id: id + '-sample', name: item[1] + '-清单.csv', type: 'text/csv;charset=utf-8', size: new Blob([text]).size, seedText: text }); }
      if (index === 2) { var sql = '-- 订单明细入仓核对示例\nSELECT biz_date, COUNT(*) AS record_count\nFROM dwd_trade_order_detail_di\nGROUP BY biz_date;\n'; attachments.push({ id: id + '-sample', name: '订单入仓核对示例.sql', type: 'text/plain;charset=utf-8', size: new Blob([sql]).size, seedText: sql }); }
      return { id: id, name: item[1], categoryId: item[0], html: html, uploader: users[index % users.length], uploadedAt: '2026-09-0' + (3 - Math.floor(index / 8)) + ' ' + String(16 - index % 8).padStart(2, '0') + ':20:00', attachments: attachments };
    });
    return { version: 1, categories: categories, documents: documents };
  }
  function openDatabase() {
    if (databasePromise) return databasePromise;
    databasePromise = new Promise(function (resolve) {
      if (!window.indexedDB) { resolve(null); return; }
      try {
        var request = window.indexedDB.open('dp-document-management', 1);
        request.onupgradeneeded = function () { var db = request.result; if (!db.objectStoreNames.contains('data')) db.createObjectStore('data'); if (!db.objectStoreNames.contains('files')) db.createObjectStore('files'); };
        request.onsuccess = function () { resolve(request.result); };
        request.onerror = request.onblocked = function () { resolve(null); };
      } catch (error) { resolve(null); }
    });
    return databasePromise;
  }
  function validStore(value) {
    if (!value || value.version !== 1 || !Array.isArray(value.categories) || !Array.isArray(value.documents)) return false;
    var ids = new Set(value.categories.map(function (item) { return item && item.id; }));
    if (!ids.has('root') || ids.size !== value.categories.length) return false;
    var validCategories = value.categories.every(function (item) {
      if (!item || typeof item.name !== 'string' || typeof item.code !== 'string' || !Array.isArray(item.ownerIds)) return false;
      var visited = new Set(), node = item;
      while (node && node.id !== 'root') { if (visited.has(node.id) || !ids.has(node.parent)) return false; visited.add(node.id); node = value.categories.find(function (entry) { return entry.id === node.parent; }); }
      return !!node;
    });
    return validCategories && new Set(value.documents.map(function (item) { return item && item.id; })).size === value.documents.length && value.documents.every(function (item) {
      return item && typeof item.id === 'string' && typeof item.name === 'string' && ids.has(item.categoryId) && typeof item.html === 'string' && typeof item.uploader === 'string' && typeof item.uploadedAt === 'string' && Array.isArray(item.attachments) && item.attachments.every(function (file) { return file && typeof file.id === 'string' && typeof file.name === 'string' && typeof file.size === 'number'; });
    });
  }
  async function loadStore() {
    var db = await openDatabase(), saved = null;
    if (db) saved = await new Promise(function (resolve) {
      try { var request = db.transaction('data', 'readonly').objectStore('data').get('main'); request.onsuccess = function () { resolve(request.result); }; request.onerror = function () { resolve(null); }; } catch (error) { resolve(null); }
    });
    store = validStore(saved) ? saved : seedStore();
    store.documents.forEach(function (item) { item.html = DP.documentEditor.sanitize(item.html); });
  }
  async function saveStore(next, files, removed) {
    files = files || new Map(); removed = removed || [];
    var db = await openDatabase(), saved = false;
    if (db) saved = await new Promise(function (resolve) {
      try {
        var tx = db.transaction(['data', 'files'], 'readwrite');
        tx.objectStore('data').put(next, 'main');
        files.forEach(function (blob, id) { tx.objectStore('files').put(blob, id); });
        removed.forEach(function (id) { tx.objectStore('files').delete(id); });
        tx.oncomplete = function () { resolve(true); }; tx.onerror = tx.onabort = function () { resolve(false); };
      } catch (error) { if (tx) { try { tx.abort(); } catch (ignored) {} } resolve(false); }
    });
    store = next;
    files.forEach(function (blob, id) { memoryFiles.set(id, blob); });
    removed.forEach(function (id) { memoryFiles.delete(id); });
    return saved;
  }
  async function getFile(attachment) {
    if (draft && draft.files && draft.files.has(attachment.id)) return draft.files.get(attachment.id);
    if (memoryFiles.has(attachment.id)) return memoryFiles.get(attachment.id);
    if (typeof attachment.seedText === 'string') return new Blob([attachment.seedText], { type: attachment.type });
    var db = await openDatabase(); if (!db) return null;
    return new Promise(function (resolve) {
      try { var request = db.transaction('files', 'readonly').objectStore('files').get(attachment.id); request.onsuccess = function () { resolve(request.result || null); }; request.onerror = function () { resolve(null); }; } catch (error) { resolve(null); }
    });
  }
  function findCategory(id) { return store.categories.find(function (item) { return item.id === id; }); }
  function findDocument(id) { return store.documents.find(function (item) { return item.id === id; }); }
  function descendants(nodes, id) {
    var found = [id];
    nodes.filter(function (node) { return node.parent === id; }).forEach(function (node) { found = found.concat(descendants(nodes, node.id)); });
    return found;
  }
  function pathFor(id) {
    var parts = [], item = findCategory(id);
    while (item) { parts.unshift(item.name); item = item.parent ? findCategory(item.parent) : null; }
    return parts.join(' / ');
  }
  function matchingNodes(nodes, search) {
    var text = search.trim().toLowerCase(), visible = new Set();
    if (!text) return new Set(nodes.map(function (item) { return item.id; }));
    nodes.forEach(function (node) {
      if (node.name.toLowerCase().indexOf(text) < 0) return;
      descendants(nodes, node.id).forEach(function (id) { visible.add(id); });
      var item = node;
      while (item) { visible.add(item.id); item = nodes.find(function (candidate) { return candidate.id === item.parent; }); }
    });
    return visible;
  }
  function filteredDocuments() {
    var ids = new Set(descendants(store.categories, categoryId)), text = keyword.toLowerCase();
    return store.documents.filter(function (item) { return ids.has(item.categoryId) && (!text || item.name.toLowerCase().indexOf(text) >= 0); }).sort(function (a, b) { return b.uploadedAt.localeCompare(a.uploadedAt) || b.id.localeCompare(a.id); });
  }
  function currentRows() { return filteredDocuments().slice((page - 1) * pageSize, page * pageSize); }
  function notice(message, error) {
    if (!root || !root.isConnected) return;
    var el = categoryDraft ? root.querySelector('[data-dm-category-error]') : root.querySelector('[data-dm-notice]');
    if (el) { el.textContent = message || ''; el.classList.toggle('is-error', !!error); }
  }
  function savedNotice(message, saved) { notice(message + (saved ? '' : ' 本地保存未成功，当前页面会话内保留；关闭或刷新页面后可能丢失。'), !saved); }
  function captureKeyword() { var el = root.querySelector('[data-dm-keyword]'); if (el) keywordDraft = el.value; }
  function cleanupEditor() { if (editor) editor.destroy(); editor = null; }
  function treeHTML(search, scope) {
    var visible = matchingNodes(store.categories, search);
    function branch(parent, depth) {
      return store.categories.filter(function (item) { return item.parent === parent && visible.has(item.id); }).map(function (item) {
        var children = store.categories.some(function (node) { return node.parent === item.id; });
        var open = !!search || expanded.has(item.id), selectedId = scope === 'main' ? categoryId : scope === 'document' ? draft.categoryId : categoryDraft.parent;
        return '<li class="dm-tree-node"><div class="dm-tree-row' + (item.id === selectedId ? ' active' : '') + '" style="--dm-depth:' + depth + '" data-dm-tree-node="' + esc(item.id) + '">' +
          (children ? '<button type="button" class="dm-tree-toggle" data-dm-action="toggle-tree" data-id="' + esc(item.id) + '" data-scope="' + scope + '" aria-label="' + (open ? '收起' : '展开') + esc(item.name) + '" aria-expanded="' + open + '"><i class="bi bi-chevron-' + (open ? 'down' : 'right') + '" aria-hidden="true"></i></button>' : '<span class="dm-tree-spacer"></span>') +
          '<button type="button" class="dm-tree-label" data-dm-action="choose-category" data-id="' + esc(item.id) + '" data-scope="' + scope + '" title="' + esc(pathFor(item.id)) + '"><i class="bi bi-' + (item.id === 'root' ? 'folder2-open' : 'folder') + '" aria-hidden="true"></i><span>' + esc(item.name) + '</span></button></div>' +
          (children && open ? '<ul>' + branch(item.id, depth + 1) + '</ul>' : '') + '</li>';
      }).join('');
    }
    return visible.size ? '<ul class="dm-tree">' + branch('', 0) + '</ul>' : '<div class="dm-tree-empty">没有匹配的目录</div>';
  }
  function renderList() {
    cleanupEditor(); draft = null; mode = 'list'; picker = null;
    root.innerHTML = '<div class="dm-workspace"><aside class="ds-left-panel dm-directory"><div class="dm-directory-head"><strong>文档目录</strong>' + button('new-category', 'folder-plus', '新建分类', '', 'dm-text-button') + '</div>' +
      '<div class="ds-tree-search"><input type="search" class="ds-tree-search-input" data-dm-tree-search value="' + esc(treeKeyword) + '" placeholder="搜索文档目录" aria-label="搜索文档目录"></div><div class="ds-tree-scroll" data-dm-tree>' + treeHTML(treeKeyword, 'main') + '</div></aside>' +
      '<section class="ds-right-panel dm-main"><div class="dm-toolbar"><div class="dm-toolbar-left">' + button('new-document', 'plus-lg', '新增', '', 'btn-primary') + button('delete-selected', 'trash', '删除') + '<span data-dm-selection class="dm-selection"></span></div>' +
      '<form class="dm-query" data-dm-query><input type="search" class="lm-control dm-keyword" data-dm-keyword value="' + esc(keywordDraft) + '" placeholder="请输入关键字查询" aria-label="文档名称关键词"><button type="submit" class="btn btn-primary"><i class="bi bi-search" aria-hidden="true"></i><span>查询</span></button></form></div>' +
      '<div class="dm-notice" data-dm-notice role="status" aria-live="polite"></div><div class="dm-table-wrap"><table class="ds-table dm-table" aria-label="文档列表"></table></div><div class="ds-pagination dm-pagination" data-dm-pagination></div></section></div><div data-dm-overlay></div><div data-dm-floating></div>';
    renderTable();
  }
  function renderTable() {
    var rows = filteredDocuments(), count = Math.max(1, Math.ceil(rows.length / pageSize)); page = Math.min(Math.max(1, page), count);
    root.querySelector('.dm-table').innerHTML = '<colgroup><col style="width:42px"><col><col style="width:110px"><col style="width:164px"><col style="width:212px"></colgroup><thead><tr><th class="dm-check"><input type="checkbox" data-dm-all aria-label="选择本页文档"' + (rows.length ? '' : ' disabled') + '></th>' + ['名称', '上传者', '上传时间', '操作'].map(function (label) { return '<th scope="col">' + label + '</th>'; }).join('') + '</tr></thead><tbody>' +
      (rows.length ? currentRows().map(function (item) {
        return '<tr data-dm-row="' + esc(item.id) + '"><td class="dm-check"><input type="checkbox" data-dm-check="' + esc(item.id) + '" aria-label="选择' + esc(item.name) + '"' + (selected.has(item.id) ? ' checked' : '') + '></td><td><button type="button" class="dm-document-link" data-dm-action="view" data-id="' + esc(item.id) + '" title="' + esc(item.name) + '"><i class="bi bi-file-earmark-richtext" aria-hidden="true"></i><span>' + esc(item.name) + '</span></button></td><td>' + esc(item.uploader) + '</td><td class="dm-time">' + esc(item.uploadedAt) + '</td><td><div class="dm-row-actions">' + button('view', 'eye', '查看', 'data-id="' + esc(item.id) + '"', 'dm-text-button') + button('edit', 'pencil', '编辑', 'data-id="' + esc(item.id) + '"', 'dm-text-button') + button('delete', 'trash', '删除', 'data-id="' + esc(item.id) + '"', 'dm-text-button dm-danger') + '</div></td></tr>';
      }).join('') : '<tr><td colspan="5"><div class="lm-empty"><i class="bi bi-folder2-open" aria-hidden="true"></i><strong>暂无文档</strong><span>' + (keyword ? '没有匹配的文档，请调整关键词后查询。' : '当前目录暂无文档，可点击“新增”添加。') + '</span></div></td></tr>') + '</tbody>';
    root.querySelector('[data-dm-pagination]').innerHTML = '<span>共 <b>' + rows.length + '</b> 条</span><div class="page-nav">' + button('page', 'chevron-left', '上一页', 'data-page="' + (page - 1) + '"' + (page === 1 ? ' disabled' : '')) + Array.from({ length: count }, function (_, i) { return '<button type="button" class="page-num' + (page === i + 1 ? ' active' : '') + '" data-dm-action="page" data-page="' + (i + 1) + '"' + (page === i + 1 ? ' aria-current="page"' : '') + '>' + (i + 1) + '</button>'; }).join('') + button('page', 'chevron-right', '下一页', 'data-page="' + (page + 1) + '"' + (page === count ? ' disabled' : '')) + '</div><select class="lm-control dm-page-size" data-dm-size aria-label="每页条数">' + [10, 30, 50].map(function (size) { return '<option value="' + size + '"' + (pageSize === size ? ' selected' : '') + '>' + size + ' 条/页</option>'; }).join('') + '</select>';
    updateSelection();
  }
  function updateSelection() {
    var all = root.querySelector('[data-dm-all]'); if (!all) return;
    var rows = currentRows(); all.checked = rows.length > 0 && rows.every(function (row) { return selected.has(row.id); }); all.indeterminate = selected.size > 0 && !all.checked;
    root.querySelector('[data-dm-selection]').textContent = selected.size ? '已选 ' + selected.size + ' 项' : '';
    root.querySelectorAll('[data-dm-row]').forEach(function (row) { row.classList.toggle('is-selected', selected.has(row.dataset.dmRow)); });
  }
  function query() { captureKeyword(); keyword = keywordDraft.trim(); page = 1; selected.clear(); notice(''); renderTable(); }
  function pickerTrigger(scope, id) {
    return '<button type="button" class="lm-control dm-directory-trigger" data-dm-action="picker" data-scope="' + scope + '" aria-expanded="false" aria-label="所属目录" title="' + esc(pathFor(id)) + '"><i class="bi bi-folder2-open" aria-hidden="true"></i><span>' + esc(pathFor(id)) + '</span><i class="bi bi-chevron-down" aria-hidden="true"></i></button>';
  }
  function closePicker() { var floating = root && root.querySelector('[data-dm-floating]'); if (floating) floating.innerHTML = ''; if (picker && picker.trigger && picker.trigger.isConnected) picker.trigger.setAttribute('aria-expanded', 'false'); picker = null; }
  function openPicker(trigger) {
    if (picker && picker.trigger === trigger) { closePicker(); return; }
    closePicker(); picker = { scope: trigger.dataset.scope, trigger: trigger, search: '' };
    trigger.setAttribute('aria-expanded', 'true');
    var rect = trigger.getBoundingClientRect(), width = Math.min(360, window.innerWidth - 24), height = 294;
    root.querySelector('[data-dm-floating]').innerHTML = '<div class="dm-picker-panel" style="width:' + width + 'px;left:' + Math.max(12, Math.min(rect.left, window.innerWidth - width - 12)) + 'px;top:' + (rect.bottom + height < window.innerHeight ? rect.bottom + 4 : Math.max(12, rect.top - height)) + 'px"><input type="search" class="lm-control" data-dm-picker-search placeholder="搜索所属目录" aria-label="搜索所属目录"><div class="dm-picker-tree">' + treeHTML('', picker.scope) + '</div></div>';
    root.querySelector('[data-dm-picker-search]').focus();
  }
  function openDocument(id, readonly) {
    captureKeyword(); cleanupEditor(); closePicker();
    var item = id ? findDocument(id) : null;
    if (id && !item) { notice('该文档已不存在。', true); return; }
    draft = item ? clone(item) : { id: '', name: '', categoryId: categoryId, html: '', attachments: [] };
    draft.files = new Map(); mode = readonly ? 'view' : 'edit';
    root.innerHTML = '<div class="dm-form-view"><header class="dm-form-head"><h2>' + (readonly ? '文档详情' : item ? '编辑文档' : '新增文档') + '</h2>' + button('back', 'arrow-left', '返回列表') + '</header><div class="dm-form-scroll">' +
      (readonly ? '<div class="dm-read-heading"><h3>' + esc(item.name) + '</h3><p><span>所属目录：' + esc(pathFor(item.categoryId)) + '</span><span>上传者：' + esc(item.uploader) + '</span><span>上传时间：' + esc(item.uploadedAt) + '</span></p></div>' : '<form id="dm-document-form" data-dm-document-form><div class="dm-document-fields"><label class="dm-field"><span>文档名称 <b>*</b></span><input type="text" class="lm-control" data-dm-name value="' + esc(draft.name) + '" maxlength="50" placeholder="50 个字符以内" required></label><div class="dm-field"><span>所属目录 <b>*</b></span>' + pickerTrigger('document', draft.categoryId) + '</div></div></form>') +
      '<section class="dm-content-section"><h3>文档内容</h3><div data-dm-editor></div></section><section class="dm-attachment-section"><div class="dm-section-head"><h3>附件</h3>' + (readonly ? '' : button('upload', 'paperclip', '上传附件') + '<input type="file" data-dm-upload multiple hidden aria-label="选择附件">') + '</div><div data-dm-attachments></div></section></div>' +
      '<footer class="dm-form-footer"><div class="dm-notice" data-dm-notice role="status" aria-live="polite"></div><div>' + button('back', readonly ? 'arrow-left' : 'x-lg', readonly ? '返回列表' : '取消') + (readonly ? '' : '<button type="submit" form="dm-document-form" class="btn btn-primary" data-dm-save><i class="bi bi-check2" aria-hidden="true"></i><span>保存</span></button>') + '</div></footer></div><div data-dm-overlay></div><div data-dm-floating></div>';
    var currentDraft = draft;
    editor = DP.documentEditor.create(root.querySelector('[data-dm-editor]'), { html: draft.html, readOnly: readonly, onChange: function (html) { if (draft === currentDraft) draft.html = html; } });
    renderAttachments();
    var title = root.querySelector('.dm-form-head h2'); title.tabIndex = -1; title.focus();
  }
  function fileSize(bytes) { if (bytes < 1024) return bytes + ' B'; if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'; return (bytes / (1024 * 1024)).toFixed(1) + ' MB'; }
  function renderAttachments() {
    root.querySelector('[data-dm-attachments]').innerHTML = draft.attachments.length ? '<ul class="dm-attachments">' + draft.attachments.map(function (file) {
      return '<li><i class="bi bi-file-earmark" aria-hidden="true"></i><div><strong>' + esc(file.name) + '</strong><span>' + fileSize(file.size) + '</span></div>' + button('download', 'download', '下载', 'data-id="' + esc(file.id) + '"', 'dm-text-button') + (mode === 'edit' ? button('remove-attachment', 'x-lg', '移除', 'data-id="' + esc(file.id) + '"', 'dm-text-button dm-danger') : '') + '</li>';
    }).join('') + '</ul>' : '<p class="dm-empty-attachments">暂无附件</p>';
  }
  function addAttachments(files) {
    if (!draft || mode !== 'edit' || busy) return;
    var count = 0;
    Array.from(files || []).forEach(function (file) {
      if (!file || typeof file.name !== 'string' || typeof file.size !== 'number') return;
      if (draft.attachments.some(function (item) { return item.name === file.name && item.size === file.size && item.lastModified === file.lastModified; })) return;
      var id = uid('file'); draft.attachments.push({ id: id, name: file.name, size: file.size, type: file.type || 'application/octet-stream', lastModified: file.lastModified }); draft.files.set(id, file); count++;
    });
    renderAttachments(); notice(count ? '已添加 ' + count + ' 个附件，保存文档后生效。' : '所选附件已在列表中。');
  }
  async function download(id) {
    var attachment = draft && draft.attachments.find(function (file) { return file.id === id; }); if (!attachment) return;
    var blob = await getFile(attachment);
    if (!blob) { notice('附件内容不可用，请重新添加附件后保存。', true); return; }
    var url = URL.createObjectURL(blob), anchor = document.createElement('a');
    anchor.href = url; anchor.download = attachment.name; document.body.appendChild(anchor); anchor.click(); anchor.remove();
    window.setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }
  function setBusy(value) { busy = value; root.querySelectorAll('[data-dm-save], [data-dm-action="back"], [data-dm-action="close-category"]').forEach(function (el) { el.disabled = value; }); }
  async function saveDocument() {
    if (busy || mode !== 'edit' || !draft) return;
    var input = root.querySelector('[data-dm-name]'); draft.name = input.value.trim(); draft.html = editor.getHTML();
    if (!draft.name || draft.name.length > 50) { notice('请填写 1–50 个字符的文档名称。', true); input.focus(); return; }
    if (!findCategory(draft.categoryId)) { notice('请选择有效的所属目录。', true); return; }
    var next = clone(store), original = draft.id ? findDocument(draft.id) : null, added = !original;
    var record = { id: original ? original.id : uid('doc'), name: draft.name, categoryId: draft.categoryId, html: draft.html, uploader: original ? original.uploader : currentUser, uploadedAt: original ? original.uploadedAt : timestamp(), attachments: clone(draft.attachments) };
    var removed = original ? original.attachments.filter(function (file) { return !record.attachments.some(function (item) { return item.id === file.id; }); }).map(function (file) { return file.id; }) : [];
    if (original) next.documents[next.documents.findIndex(function (item) { return item.id === original.id; })] = record; else next.documents.unshift(record);
    var targetRoot = root; setBusy(true);
    var saved = await saveStore(next, new Map(draft.files), removed); busy = false;
    if (targetRoot !== root || !targetRoot.isConnected) return;
    if (added) { categoryId = record.categoryId; keyword = keywordDraft = treeKeyword = ''; page = 1; expandPath(categoryId); }
    selected.clear(); renderList(); savedNotice('文档“' + record.name + '”已保存。', saved);
  }
  function expandPath(id) { var item = findCategory(id); while (item) { expanded.add(item.id); item = findCategory(item.parent); } }
  function deleteDocuments(ids) {
    if (busy) return;
    var targets = ids.map(findDocument).filter(Boolean);
    if (!targets.length) { notice('请先勾选需要删除的文档。', true); return; }
    DP.confirm('确认删除' + (targets.length === 1 ? '文档“' + esc(targets[0].name) + '”' : '选中的 ' + targets.length + ' 个文档') + '？关联附件将一并删除。', {
      icon: 'danger', okText: '<i class="bi bi-trash" aria-hidden="true"></i> 删除', cancelText: '<i class="bi bi-x-lg" aria-hidden="true"></i> 取消',
      onOk: async function () {
        if (busy) return;
        var next = clone(store), removed = [], targetRoot = root;
        next.documents = next.documents.filter(function (item) { if (ids.indexOf(item.id) < 0) return true; item.attachments.forEach(function (file) { removed.push(file.id); }); return false; });
        busy = true; var saved = await saveStore(next, new Map(), removed); busy = false;
        if (targetRoot !== root || !targetRoot.isConnected) return;
        selected.clear(); renderList(); savedNotice('已删除 ' + targets.length + ' 个文档。', saved);
      }
    });
  }
  function memberNodes(tab) {
    var groups = tab === 'department' ? [
      ['dept-platform', '数据平台部', [['current', currentUser], ['chenchen', '陈晨']]],
      ['dept-governance', '数据治理组', [['wangmin', '王敏'], ['zhangwei', '张伟']]],
      ['dept-business', '业务分析组', [['lina', '李娜'], ['zhoulin', '周琳']]]
    ] : [
      ['role-developer', '开发人员', [['current', currentUser], ['chenchen', '陈晨'], ['zhangwei', '张伟']]],
      ['role-admin', '超级管理员', [['current', currentUser], ['wangmin', '王敏']]],
      ['role-user', '用户', [['lina', '李娜'], ['zhoulin', '周琳']]]
    ];
    var nodes = [];
    groups.forEach(function (group) { nodes.push({ id: group[0], parent: '', value: group[0], name: group[1], group: true }); group[2].forEach(function (user) { nodes.push({ id: group[0] + '-' + user[0], parent: group[0], value: 'user-' + user[0], name: user[1] }); }); });
    return nodes;
  }
  function ownerTree(side) {
    var nodes = memberNodes(categoryDraft.tab), selectedOwners = new Set(categoryDraft.ownerIds), search = categoryDraft[side + 'Search'];
    var visible = matchingNodes(nodes, search), marks = categoryDraft[side + 'Marks'];
    if (side === 'right') {
      var selectedPaths = new Set();
      nodes.filter(function (node) { return selectedOwners.has(node.value); }).forEach(function (node) { selectedPaths.add(node.id); if (node.parent) selectedPaths.add(node.parent); });
      visible = new Set(Array.from(visible).filter(function (id) { return selectedPaths.has(id); }));
    }
    function branch(parent) {
      return nodes.filter(function (node) { return node.parent === parent && visible.has(node.id); }).map(function (node) {
        var available = side === 'left' || selectedOwners.has(node.value), childHtml = branch(node.id);
        var row = '<label class="dm-owner-row">' + (available ? '<input type="checkbox" data-dm-owner="' + esc(node.id) + '" data-side="' + side + '"' + (marks.has(node.value) ? ' checked' : '') + '>' : '<span class="dm-owner-spacer"></span>') + '<i class="bi bi-' + (node.group ? 'folder' : 'person') + '" aria-hidden="true"></i><span>' + esc(node.name) + '</span></label>';
        return '<li>' + (childHtml ? '<details open><summary>' + row + '</summary><ul>' + childHtml + '</ul></details>' : row) + '</li>';
      }).join('');
    }
    return visible.size ? '<ul class="dm-owner-tree">' + branch('') + '</ul>' : '<p class="dm-tree-empty">' + (search ? '没有匹配的对象' : '暂无已选对象') + '</p>';
  }
  function renderOwners() {
    var host = root.querySelector('[data-dm-owners]'); if (!host) return;
    function panel(side) {
      return '<section class="dm-owner-panel"><div class="pm-tabs dm-owner-tabs">' + [['department', '按部门'], ['role', '按角色']].map(function (tab) { return '<button type="button" class="pm-tab' + (categoryDraft.tab === tab[0] ? ' active' : '') + '" data-dm-action="owner-tab" data-tab="' + tab[0] + '" role="tab" aria-selected="' + (categoryDraft.tab === tab[0]) + '">' + tab[1] + '</button>'; }).join('') + '</div><div class="dm-owner-panel-head">' + (side === 'left' ? '可选对象' : '已选对象（' + categoryDraft.ownerIds.length + '）') + '</div><input type="search" class="lm-control" data-dm-owner-search="' + side + '" value="' + esc(categoryDraft[side + 'Search']) + '" placeholder="搜索部门、角色或人员" aria-label="搜索' + (side === 'left' ? '可选' : '已选') + '对象"><div class="dm-owner-scroll" data-dm-owner-tree="' + side + '">' + ownerTree(side) + '</div></section>';
    }
    host.innerHTML = panel('left') + '<div class="dm-owner-transfer">' + button('add-owner', 'chevron-right', '添加') + button('remove-owner', 'chevron-left', '移除') + '</div>' + panel('right');
  }
  function openCategory(parentId) {
    if (busy || mode !== 'list') return;
    lastFocus = document.activeElement;
    categoryDraft = { code: '', name: '', description: '', parent: parentId || categoryId, ownerIds: [], tab: 'department', leftSearch: '', rightSearch: '', leftMarks: new Set(), rightMarks: new Set() };
    root.querySelector('[data-dm-overlay]').innerHTML = '<div class="dm-modal-mask"><section class="dm-category-modal" role="dialog" aria-modal="true" aria-labelledby="dm-category-title"><header class="dm-modal-head"><h2 id="dm-category-title">新增文档分类</h2>' + button('close-category', 'x-lg', '关闭', '', 'dm-text-button') + '</header><form id="dm-category-form" class="dm-category-body" data-dm-category-form><div class="dm-category-fields"><div><label class="dm-field"><span>编码 <b>*</b></span><input class="lm-control" data-dm-category-field="code" maxlength="50" placeholder="50 个字符以内" required></label><label class="dm-field"><span>名称 <b>*</b></span><input class="lm-control" data-dm-category-field="name" maxlength="50" placeholder="50 个字符以内" required></label></div><label class="dm-field dm-description"><span>描述</span><textarea data-dm-category-field="description" placeholder="请输入描述" rows="4"></textarea></label></div><div class="dm-field dm-category-parent"><span>所属目录 <b>*</b></span>' + pickerTrigger('category', categoryId) + '</div><div class="dm-owners" data-dm-owners></div></form><footer class="dm-modal-footer"><div class="dm-notice is-error" data-dm-category-error role="alert"></div><div>' + button('close-category', 'x-lg', '取消') + '<button type="submit" form="dm-category-form" class="btn btn-primary" data-dm-save><i class="bi bi-check2" aria-hidden="true"></i><span>保存</span></button></div></footer></section></div>';
    var parentTrigger = root.querySelector('[data-scope="category"]'); parentTrigger.title = pathFor(categoryDraft.parent); parentTrigger.querySelector('span').textContent = pathFor(categoryDraft.parent);
    renderOwners(); root.querySelector('[data-dm-category-field="code"]').focus();
  }
  function closeCategory() { if (busy) return; closePicker(); categoryDraft = null; root.querySelector('[data-dm-overlay]').innerHTML = ''; if (lastFocus && lastFocus.isConnected) lastFocus.focus(); }
  async function saveCategory() {
    if (busy || !categoryDraft) return;
    root.querySelectorAll('[data-dm-category-field]').forEach(function (el) { categoryDraft[el.dataset.dmCategoryField] = el.value.trim(); });
    var item = categoryDraft;
    if (!item.code || item.code.length > 50 || !item.name || item.name.length > 50) { notice('编码和名称必填，且均不能超过 50 个字符。', true); return; }
    if (store.categories.some(function (node) { return node.code.toLowerCase() === item.code.toLowerCase(); })) { notice('分类编码已存在，请使用其他编码。', true); return; }
    if (!findCategory(item.parent)) { notice('请选择有效的所属目录。', true); return; }
    if (store.categories.some(function (node) { return node.parent === item.parent && node.name === item.name; })) { notice('所属目录下已存在同名分类。', true); return; }
    var next = clone(store), id = uid('category'); next.categories.push({ id: id, parent: item.parent, code: item.code, name: item.name, description: item.description, ownerIds: item.ownerIds.slice() });
    var targetRoot = root; setBusy(true); var saved = await saveStore(next); busy = false;
    if (targetRoot !== root || !targetRoot.isConnected) return;
    categoryDraft = null; categoryId = id; treeKeyword = ''; keyword = keywordDraft = ''; page = 1; selected.clear(); expandPath(id); renderList(); savedNotice('文档分类“' + item.name + '”已新增。', saved);
  }
  function chooseCategory(target) {
    var id = target.dataset.id, scope = target.dataset.scope;
    if (!findCategory(id)) return;
    if (scope === 'main') { captureKeyword(); categoryId = id; keyword = keywordDraft.trim(); page = 1; selected.clear(); renderList(); }
    else {
      if (scope === 'document') draft.categoryId = id; else categoryDraft.parent = id;
      var trigger = picker && picker.trigger; closePicker();
      if (trigger) { trigger.title = pathFor(id); trigger.querySelector('span').textContent = pathFor(id); trigger.focus(); }
    }
  }
  function handleClick(event) {
    var target = event.target.closest('[data-dm-action]');
    if (picker && !event.target.closest('.dm-picker-panel, .dm-directory-trigger')) closePicker();
    if (!target || target.disabled || busy) return;
    var action = target.dataset.dmAction, id = target.dataset.id;
    if (action === 'new-category') openCategory();
    else if (action === 'close-category') closeCategory();
    else if (action === 'new-document') openDocument('', false);
    else if (action === 'view' || action === 'edit') openDocument(id, action === 'view');
    else if (action === 'back') { closePicker(); renderList(); }
    else if (action === 'page') { captureKeyword(); page = Number(target.dataset.page); selected.clear(); renderTable(); }
    else if (action === 'choose-category') chooseCategory(target);
    else if (action === 'toggle-tree') {
      if (expanded.has(id)) expanded.delete(id); else expanded.add(id);
      if (target.dataset.scope === 'main') root.querySelector('[data-dm-tree]').innerHTML = treeHTML(treeKeyword, 'main');
      else if (picker) root.querySelector('.dm-picker-tree').innerHTML = treeHTML(picker.search, picker.scope);
    } else if (action === 'picker') openPicker(target);
    else if (action === 'delete-selected') deleteDocuments(Array.from(selected));
    else if (action === 'delete') deleteDocuments([id]);
    else if (action === 'upload') root.querySelector('[data-dm-upload]').click();
    else if (action === 'download') download(id);
    else if (action === 'remove-attachment') { draft.attachments = draft.attachments.filter(function (file) { return file.id !== id; }); draft.files.delete(id); renderAttachments(); }
    else if (action === 'owner-tab') { categoryDraft.tab = target.dataset.tab; categoryDraft.leftMarks.clear(); categoryDraft.rightMarks.clear(); renderOwners(); }
    else if (action === 'add-owner') { categoryDraft.ownerIds = Array.from(new Set(categoryDraft.ownerIds.concat(Array.from(categoryDraft.leftMarks)))); categoryDraft.leftMarks.clear(); renderOwners(); }
    else if (action === 'remove-owner') { categoryDraft.ownerIds = categoryDraft.ownerIds.filter(function (value) { return !categoryDraft.rightMarks.has(value); }); categoryDraft.rightMarks.clear(); renderOwners(); }
  }
  function handleChange(event) {
    var target = event.target;
    if (target.matches('[data-dm-size]')) { captureKeyword(); pageSize = Number(target.value); page = 1; selected.clear(); renderTable(); }
    else if (target.matches('[data-dm-check]')) { if (target.checked) selected.add(target.dataset.dmCheck); else selected.delete(target.dataset.dmCheck); updateSelection(); }
    else if (target.matches('[data-dm-all]')) { currentRows().forEach(function (item) { if (target.checked) selected.add(item.id); else selected.delete(item.id); }); root.querySelectorAll('[data-dm-check]').forEach(function (el) { el.checked = selected.has(el.dataset.dmCheck); }); updateSelection(); }
    else if (target.matches('[data-dm-upload]')) { addAttachments(target.files); target.value = ''; }
    else if (target.matches('[data-dm-owner]')) {
      var nodes = memberNodes(categoryDraft.tab), ids = new Set(descendants(nodes, target.dataset.dmOwner)), marks = categoryDraft[target.dataset.side + 'Marks'];
      nodes.filter(function (node) { return ids.has(node.id) && (target.dataset.side === 'left' || categoryDraft.ownerIds.indexOf(node.value) >= 0); }).forEach(function (node) { if (target.checked) marks.add(node.value); else marks.delete(node.value); });
      renderOwners();
    }
  }
  function handleInput(event) {
    var target = event.target;
    if (target.matches('[data-dm-keyword]')) keywordDraft = target.value;
    else if (target.matches('[data-dm-tree-search]')) { treeKeyword = target.value; root.querySelector('[data-dm-tree]').innerHTML = treeHTML(treeKeyword, 'main'); }
    else if (target.matches('[data-dm-picker-search]') && picker) { picker.search = target.value; root.querySelector('.dm-picker-tree').innerHTML = treeHTML(picker.search, picker.scope); }
    else if (target.matches('[data-dm-name]') && draft) draft.name = target.value;
    else if (target.matches('[data-dm-category-field]') && categoryDraft) categoryDraft[target.dataset.dmCategoryField] = target.value;
    else if (target.matches('[data-dm-owner-search]') && categoryDraft) { var side = target.dataset.dmOwnerSearch; categoryDraft[side + 'Search'] = target.value; root.querySelector('[data-dm-owner-tree="' + side + '"]').innerHTML = ownerTree(side); }
  }
  async function init() {
    root = document.querySelector('.page-document-management'); if (!root) return;
    var targetRoot = root;
    root.innerHTML = '<div class="dm-loading" role="status">正在加载文档…</div>';
    if (!store) await loadStore();
    if (targetRoot !== root || !targetRoot.isConnected) return;
    if (!findCategory(categoryId)) categoryId = 'root';
    categoryDraft = null; selected.clear();
    root.addEventListener('click', handleClick); root.addEventListener('change', handleChange); root.addEventListener('input', handleInput);
    root.addEventListener('submit', function (event) { if (event.target.matches('[data-dm-query]')) { event.preventDefault(); query(); } else if (event.target.matches('[data-dm-document-form]')) { event.preventDefault(); saveDocument(); } else if (event.target.matches('[data-dm-category-form]')) { event.preventDefault(); saveCategory(); } });
    root.addEventListener('contextmenu', function (event) { var node = event.target.closest('[data-dm-tree-node]'); if (node && mode === 'list' && !categoryDraft) { event.preventDefault(); openCategory(node.dataset.dmTreeNode); } });
    root.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') { if (picker) { event.preventDefault(); closePicker(); } else if (categoryDraft) { event.preventDefault(); closeCategory(); } }
      if (event.key === 'Tab' && categoryDraft && !picker) {
        var modal = root.querySelector('.dm-category-modal'), items = Array.from(modal.querySelectorAll('button:not(:disabled), input:not(:disabled), textarea, summary')).filter(function (el) { return !el.closest('[hidden]'); });
        if (event.shiftKey && document.activeElement === items[0]) { event.preventDefault(); items[items.length - 1].focus(); }
        else if (!event.shiftKey && document.activeElement === items[items.length - 1]) { event.preventDefault(); items[0].focus(); }
      }
    });
    root.addEventListener('scroll', function (event) { if (picker && !event.target.closest('.dm-picker-panel')) closePicker(); }, true);
    renderList();
  }
  window.addEventListener('resize', function () { if (root && root.isConnected) closePicker(); });
  return { html: '<section class="page-document-management" aria-label="文档管理"></section>', init: init };
}());
