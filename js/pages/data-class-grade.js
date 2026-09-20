/** 数据资产 / 分级分类：分类目录与数据分级配置。 */
window.DP = window.DP || {};
DP.pages = DP.pages || {};

DP.pages.dataClassGrade = (function () {
  var storageKey = 'dp-data-class-grade-v1';
  var seed = {
    classes: [
      { id: 'asset', parentId: '', code: 'ZC001', name: '数据资产', description: '平台统一管理的数据资产分类目录。' },
      { id: 'business', parentId: 'asset', code: 'ZC101', name: '业务数据', description: '承载订单、客户与供应链等业务数据资产。' },
      { id: 'order', parentId: 'business', code: 'ZC111', name: '订单履约', description: '订单、支付和履约过程的数据资产。' },
      { id: 'supply', parentId: 'business', code: 'ZC112', name: '供应链管理', description: '采购、库存和供应商协同的数据资产。' },
      { id: 'governance', parentId: 'asset', code: 'ZC102', name: '治理数据', description: '数据标准、质量规则及治理结果数据资产。' },
      { id: 'quality', parentId: 'governance', code: 'ZC121', name: '质量管理', description: '质量稽查任务、问题记录与质量报告。' },
      { id: 'operation', parentId: '', code: 'ZC002', name: '经营分析', description: '面向经营分析和管理决策的数据资产分类目录。' },
      { id: 'indicator', parentId: 'operation', code: 'ZC201', name: '经营指标', description: '收入、成本、客户与服务效率等经营指标。' }
    ],
    grades: [
      { id: 'l4', code: 'L4', name: '绝密数据', encryption: true, masking: true, description: '核心交易密钥、完整支付账户及财务原始总账数据。' },
      { id: 'l3', code: 'L3', name: '机密数据', encryption: true, masking: true, description: '客户完整联系方式、供应商银行账户与合同结算信息。' },
      { id: 'l2', code: 'L2', name: '对内公开', encryption: false, masking: false, description: '内部订单编号、部门信息及业务流程工单。' },
      { id: 'l1', code: 'L1', name: '公开数据', encryption: false, masking: false, description: '已对外发布的企业介绍、公开服务目录及制度文件。' }
    ]
  };
  var store = load();
  var root = null;
  var state = {
    mode: 'class', view: 'detail', selectedId: store.classes[0] && store.classes[0].id,
    expanded: new Set(['asset', 'business', 'governance']),
    treeDraft: '', treeKeyword: '', parentOpen: false, parentKeyword: '',
    form: null, gradeEditId: '', gradeDraft: null, message: ''
  };

  function clone(value) { return JSON.parse(JSON.stringify(value)); }
  function load() {
    try {
      var saved = JSON.parse(localStorage.getItem(storageKey));
      if (saved && Array.isArray(saved.classes) && Array.isArray(saved.grades)) return saved;
    } catch (error) { /* 无效缓存回到初始数据。 */ }
    return clone(seed);
  }
  function persist() { try { localStorage.setItem(storageKey, JSON.stringify(store)); } catch (error) { /* 私密模式仍可演示本次会话。 */ } }
  function esc(value) { return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function button(action, icon, label, cls, attrs) {
    return '<button type="button" class="btn ' + (cls || 'btn-outline') + '" data-dcg-action="' + action + '" ' + (attrs || '') + '><i class="bi bi-' + icon + '"></i><span>' + label + '</span></button>';
  }
  function category(id) { return store.classes.find(function (item) { return item.id === id; }); }
  function childrenOf(id, items) { return (items || store.classes).filter(function (item) { return item.parentId === id; }); }
  function descendantIds(id) {
    var ids = new Set();
    function visit(parent) { childrenOf(parent).forEach(function (item) { ids.add(item.id); visit(item.id); }); }
    visit(id);
    return ids;
  }
  function classPath(id) {
    var names = [], seen = new Set(), item = category(id);
    while (item && !seen.has(item.id)) { names.unshift(item.name); seen.add(item.id); item = category(item.parentId); }
    return names.join(' / ');
  }
  function treeMarkup(keyword, selectedId, picker) {
    var items = store.classes;
    if (picker && state.form && state.form.mode === 'edit') {
      var excluded = descendantIds(state.form.draft.id); excluded.add(state.form.draft.id);
      items = items.filter(function (item) { return !excluded.has(item.id); });
    }
    var normalized = keyword.trim().toLowerCase();
    function visible(item) {
      return !normalized || item.name.toLowerCase().includes(normalized) || childrenOf(item.id, items).some(visible);
    }
    function row(item) {
      var kids = childrenOf(item.id, items).filter(visible);
      var expanded = !!normalized || state.expanded.has(item.id);
      return '<li class="dcg-tree-item"><div class="dcg-tree-line' + (item.id === selectedId ? ' active' : '') + '">' +
        (kids.length ? '<button type="button" class="dcg-tree-toggle" data-dcg-action="toggle-tree" data-id="' + esc(item.id) + '" aria-label="' + (expanded ? '收起' : '展开') + esc(item.name) + '" aria-expanded="' + expanded + '"><i class="bi bi-chevron-right"></i></button>' : '<span class="dcg-tree-spacer"></span>') +
        '<button type="button" class="dcg-tree-node" data-dcg-action="' + (picker ? 'choose-parent' : 'select-class') + '" data-id="' + esc(item.id) + '" title="' + esc(classPath(item.id)) + '"><i class="bi bi-' + (kids.length ? 'folder2' : 'folder') + '"></i><span>' + esc(item.name) + '</span></button></div>' +
        (kids.length && expanded ? '<ul>' + kids.map(row).join('') + '</ul>' : '') + '</li>';
    }
    var roots = items.filter(function (item) { return !item.parentId || !items.some(function (parent) { return parent.id === item.parentId; }); }).filter(visible);
    return roots.length ? '<ul class="dcg-tree-root">' + roots.map(row).join('') + '</ul>' : '<div class="dcg-empty"><i class="bi bi-search"></i><span>没有匹配的分类目录</span></div>';
  }
  function sidebar() {
    return '<aside class="dcg-class-side"><div class="dcg-tree-query"><input class="dcg-control" type="search" data-dcg-tree-draft value="' + esc(state.treeDraft) + '" placeholder="关键词搜索" aria-label="分类目录关键词">' + button('query-tree', 'search', '查询', 'btn-primary') + '</div><div class="dcg-class-tree">' + treeMarkup(state.treeKeyword, state.selectedId, false) + '</div></aside>';
  }
  function detail() {
    var item = category(state.selectedId);
    return '<main class="dcg-class-main"><header class="dcg-class-toolbar">' + button('new-class', 'plus-lg', '新建', 'btn-primary') +
      button('edit-class', 'pencil-square', '编辑', 'btn-primary', item ? '' : 'disabled') +
      button('delete-class', 'trash', '删除', 'btn-danger', item ? '' : 'disabled') + '</header>' +
      (item ? '<div class="dcg-detail-fields"><div class="dcg-field"><label>分类编码</label><div class="dcg-readonly">' + esc(item.code) + '</div></div>' +
        '<div class="dcg-field"><label>分类名称</label><div class="dcg-readonly">' + esc(item.name) + '</div></div>' +
        '<div class="dcg-field"><label>父级分类</label><div class="dcg-readonly">' + esc(category(item.parentId) ? category(item.parentId).name : '顶级分类') + '</div></div>' +
        '<div class="dcg-field"><label>分类描述</label><div class="dcg-readonly dcg-description">' + esc(item.description) + '</div></div></div>' :
        '<div class="dcg-empty dcg-main-empty"><i class="bi bi-folder2-open"></i><span>请选择左侧分类</span></div>') + '</main>';
  }
  function parentPicker() {
    return state.parentOpen ? '<div class="dcg-parent-popover"><input class="dcg-control" type="search" data-dcg-parent-keyword value="' + esc(state.parentKeyword) + '" placeholder="搜索父级分类" aria-label="搜索父级分类"><div class="dcg-parent-tree" data-dcg-parent-tree>' + treeMarkup(state.parentKeyword, state.form.draft.parentId, true) + '</div></div>' : '';
  }
  function form() {
    var draft = state.form.draft;
    return '<main class="dcg-class-main dcg-form-main"><header class="dcg-form-head"><h2><i class="bi bi-list"></i><span>新建/编辑</span></h2>' + button('cancel-class', 'arrow-left', '返回', 'btn-primary') + '</header>' +
      '<div class="dcg-form-body"><div class="dcg-form-row"><label for="dcgClassCode"><b>*</b> 分类编码</label><div><input id="dcgClassCode" class="dcg-control" maxlength="50" data-dcg-class-field="code" value="' + esc(draft.code) + '" placeholder="长度不超过50个字符"><small>50个字符以内</small></div></div>' +
      '<div class="dcg-form-row"><label for="dcgClassName"><b>*</b> 分类名称</label><div><input id="dcgClassName" class="dcg-control" maxlength="50" data-dcg-class-field="name" value="' + esc(draft.name) + '" placeholder="长度不超过50个字符"><small>50个字符以内</small></div></div>' +
      '<div class="dcg-form-row"><label for="dcgParentClass">父级分类</label><div class="dcg-parent-wrap"><div class="dcg-parent-control"><input id="dcgParentClass" class="dcg-control" readonly data-dcg-action="open-parent" value="' + esc(category(draft.parentId) ? category(draft.parentId).name : '') + '" placeholder="选择父级分类">' + button('clear-parent', 'x-lg', '清除') + '</div>' + parentPicker() + '</div></div>' +
      '<div class="dcg-form-row dcg-form-row-top"><label for="dcgClassDescription">分类描述</label><div><textarea id="dcgClassDescription" class="dcg-control" maxlength="100" data-dcg-class-field="description">' + esc(draft.description) + '</textarea><small>100个字符以内</small></div></div>' +
      '<div class="dcg-form-actions">' + button('save-class', 'floppy', '保存', 'btn-primary') + button('cancel-class', 'x-lg', '取消') + '</div></div></main>';
  }
  function classPage() { return '<section class="dcg-class-layout">' + sidebar() + (state.view === 'form' ? form() : detail()) + '</section>'; }
  function gradeRow(item) {
    var editing = state.gradeEditId === item.id, draft = editing ? state.gradeDraft : item;
    return '<tr data-dcg-grade-row="' + esc(item.id) + '"><td><input class="dcg-grade-input" data-dcg-grade-field="code" value="' + esc(draft.code) + '" ' + (editing ? 'maxlength="50"' : 'disabled') + ' aria-label="分级编码"></td>' +
      '<td><input class="dcg-grade-input" data-dcg-grade-field="name" value="' + esc(draft.name) + '" ' + (editing ? 'maxlength="50"' : 'disabled') + ' aria-label="分级名称"></td>' +
      '<td class="dcg-grade-properties"><label><input type="checkbox" data-dcg-grade-field="encryption" ' + (draft.encryption ? 'checked ' : '') + (editing ? '' : 'disabled ') + '>加密规则</label><label><input type="checkbox" data-dcg-grade-field="masking" ' + (draft.masking ? 'checked ' : '') + (editing ? '' : 'disabled ') + '>脱敏规则</label></td>' +
      '<td><textarea class="dcg-grade-input" data-dcg-grade-field="description" ' + (editing ? '' : 'disabled') + ' aria-label="分级描述">' + esc(draft.description) + '</textarea></td>' +
      '<td class="dcg-grade-actions">' + (editing ? button('save-grade', 'floppy', '保存', 'btn-outline', 'data-id="' + esc(item.id) + '"') : button('edit-grade', 'pencil-square', '编辑', 'btn-outline', 'data-id="' + esc(item.id) + '"')) + button('delete-grade', 'trash', '删除', 'btn-outline', 'data-id="' + esc(item.id) + '"') + '</td></tr>';
  }
  function gradePage() {
    var rows = store.grades.slice();
    if (state.gradeEditId === 'new') rows.unshift({ id: 'new' });
    return '<section class="dcg-grade-layout"><header class="dcg-grade-head"><i class="bi bi-list"></i><h2>数据分级配置</h2></header><div class="dcg-grade-body">' + button('new-grade', 'plus-lg', '新增', 'btn-primary') +
      '<div class="dcg-grade-scroll"><table class="dcg-grade-table"><colgroup><col class="dcg-col-code"><col class="dcg-col-name"><col class="dcg-col-props"><col class="dcg-col-desc"><col class="dcg-col-actions"></colgroup><thead><tr><th>编码</th><th>名称</th><th>配置属性</th><th>描述</th><th>操作</th></tr></thead><tbody>' + rows.map(gradeRow).join('') + '</tbody></table></div></div></section>';
  }
  function notice() { return '<div class="dcg-notice" role="status"' + (state.message ? '' : ' hidden') + '><i class="bi bi-info-circle"></i><span>' + esc(state.message) + '</span></div>'; }
  function render() { if (root) root.innerHTML = notice() + (state.mode === 'class' ? classPage() : gradePage()); }
  function notify(message) { state.message = message; var el = root && root.querySelector('.dcg-notice'); if (el) { el.hidden = false; el.querySelector('span').textContent = message; } }
  function startForm(mode) {
    var item = mode === 'edit' && category(state.selectedId);
    if (mode === 'edit' && !item) return;
    state.form = { mode: mode, draft: item ? clone(item) : { id: '', parentId: '', code: '', name: '', description: '' } };
    state.view = 'form'; state.parentOpen = false; state.parentKeyword = ''; state.message = ''; render();
  }
  function saveClass() {
    var draft = state.form.draft;
    draft.code = draft.code.trim(); draft.name = draft.name.trim(); draft.description = draft.description.trim();
    if (!draft.code || !draft.name) { notify('请填写分类编码和分类名称'); return; }
    if (draft.code.length > 50 || draft.name.length > 50 || draft.description.length > 100) { notify('分类字段长度超出限制'); return; }
    if (store.classes.some(function (item) { return item.id !== draft.id && item.code.toLowerCase() === draft.code.toLowerCase(); })) { notify('分类编码已存在'); return; }
    if (draft.parentId && !category(draft.parentId)) { notify('请选择有效的父级分类'); return; }
    if (state.form.mode === 'edit') {
      var index = store.classes.findIndex(function (item) { return item.id === draft.id; });
      if (index < 0) return;
      store.classes[index] = clone(draft);
    } else {
      draft.id = 'class-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6);
      store.classes.push(clone(draft)); state.selectedId = draft.id;
    }
    if (draft.parentId) state.expanded.add(draft.parentId);
    persist(); state.form = null; state.view = 'detail'; state.parentOpen = false;
    state.treeDraft = ''; state.treeKeyword = ''; state.message = '分类已保存'; render();
  }
  function saveGrade() {
    var draft = state.gradeDraft;
    draft.code = draft.code.trim(); draft.name = draft.name.trim(); draft.description = draft.description.trim();
    if (!draft.code || !draft.name) { notify('请填写分级编码和名称'); return; }
    if (store.grades.some(function (item) { return item.id !== draft.id && item.code.toLowerCase() === draft.code.toLowerCase(); })) { notify('分级编码已存在'); return; }
    if (draft.id === 'new') { draft.id = 'grade-' + Date.now(); store.grades.unshift(clone(draft)); }
    else { var index = store.grades.findIndex(function (item) { return item.id === draft.id; }); if (index < 0) return; store.grades[index] = clone(draft); }
    persist(); state.gradeEditId = ''; state.gradeDraft = null; state.message = '分级配置已保存'; render();
  }
  function onClick(event) {
    var target = event.target.closest('[data-dcg-action]');
    if (!target || !root.contains(target)) {
      if (state.parentOpen && !event.target.closest('.dcg-parent-wrap')) { state.parentOpen = false; render(); }
      return;
    }
    var action = target.dataset.dcgAction, id = target.dataset.id;
    if (action === 'query-tree') { state.treeKeyword = state.treeDraft.trim(); render(); }
    else if (action === 'toggle-tree') { state.expanded.has(id) ? state.expanded.delete(id) : state.expanded.add(id); render(); }
    else if (action === 'select-class') { if (state.view === 'form') return; state.selectedId = id; state.message = ''; render(); }
    else if (action === 'new-class') startForm('new');
    else if (action === 'edit-class') startForm('edit');
    else if (action === 'cancel-class') { state.form = null; state.view = 'detail'; state.parentOpen = false; state.message = ''; render(); }
    else if (action === 'save-class') saveClass();
    else if (action === 'open-parent') { state.parentOpen = !state.parentOpen; render(); }
    else if (action === 'clear-parent') { state.form.draft.parentId = ''; state.parentOpen = false; render(); }
    else if (action === 'choose-parent') { state.form.draft.parentId = id; state.parentOpen = false; state.parentKeyword = ''; render(); }
    else if (action === 'delete-class') {
      var selected = category(state.selectedId); if (!selected) return;
      if (childrenOf(selected.id).length) { notify('请先处理该分类下的子分类'); return; }
      DP.confirm('确定删除分类“' + esc(selected.name) + '”吗？', { icon: 'danger', onOk: function () {
        store.classes = store.classes.filter(function (item) { return item.id !== selected.id; });
        state.selectedId = selected.parentId || (store.classes[0] && store.classes[0].id) || '';
        persist(); state.message = '分类已删除'; render();
      } });
    } else if (action === 'new-grade') { state.gradeEditId = 'new'; state.gradeDraft = { id: 'new', code: '', name: '', encryption: true, masking: false, description: '' }; state.message = ''; render(); }
    else if (action === 'edit-grade') { var grade = store.grades.find(function (item) { return item.id === id; }); if (!grade) return; state.gradeEditId = id; state.gradeDraft = clone(grade); state.message = ''; render(); }
    else if (action === 'save-grade') saveGrade();
    else if (action === 'delete-grade') {
      if (id === 'new') { state.gradeEditId = ''; state.gradeDraft = null; render(); return; }
      var row = store.grades.find(function (item) { return item.id === id; }); if (!row) return;
      DP.confirm('确定删除分级“' + esc(row.name) + '”吗？', { icon: 'danger', onOk: function () {
        store.grades = store.grades.filter(function (item) { return item.id !== id; });
        if (state.gradeEditId === id) { state.gradeEditId = ''; state.gradeDraft = null; }
        persist(); state.message = '分级配置已删除'; render();
      } });
    }
  }
  function onInput(event) {
    var target = event.target;
    if (target.matches('[data-dcg-tree-draft]')) state.treeDraft = target.value;
    else if (target.matches('[data-dcg-parent-keyword]')) {
      state.parentKeyword = target.value;
      var tree = root.querySelector('[data-dcg-parent-tree]'); if (tree) tree.innerHTML = treeMarkup(state.parentKeyword, state.form.draft.parentId, true);
    } else if (target.matches('[data-dcg-class-field]') && state.form) state.form.draft[target.dataset.dcgClassField] = target.value;
    else if (target.matches('[data-dcg-grade-field]') && state.gradeDraft) {
      var field = target.dataset.dcgGradeField; state.gradeDraft[field] = target.type === 'checkbox' ? target.checked : target.value;
    }
  }
  function onKeydown(event) {
    if (event.key === 'Escape' && state.parentOpen) { state.parentOpen = false; render(); return; }
    if (event.key !== 'Enter') return;
    if (event.target.matches('[data-dcg-tree-draft]')) { event.preventDefault(); state.treeKeyword = state.treeDraft.trim(); render(); }
  }
  function init(mode) {
    root = document.querySelector('.page-data-class-grade'); if (!root) return;
    state.mode = mode === 'grade' ? 'grade' : 'class'; state.view = 'detail'; state.form = null;
    state.parentOpen = false; state.gradeEditId = ''; state.gradeDraft = null; state.message = '';
    if (!category(state.selectedId)) state.selectedId = store.classes[0] && store.classes[0].id;
    root.addEventListener('click', onClick); root.addEventListener('input', onInput);
    root.addEventListener('change', onInput); root.addEventListener('keydown', onKeydown);
    render();
  }
  return { html: '<div class="page-data-class-grade"></div>', init: init };
}());
