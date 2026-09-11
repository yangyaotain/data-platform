/** 通知规则：参考系统字段，本地保存，不发送真实通知。 */
window.DP = window.DP || {};
DP.pages = DP.pages || {};
DP.pages.notificationRules = (function () {
  'use strict';
  var root, catalog, rules, state, draft, readonly, picker, storageError = false;
  var storageKey = 'dp.notification-rules.v1';
  var channels = ['邮箱', '钉钉', '短信', '润工作(飞书)'];
  var departments = [{ id: 'platform', name: '数据平台部', children: [
    { id: 'development', name: '数据开发组', users: [{ id: 'lin', name: '林晨' }, { id: 'zhou', name: '周宁' }] },
    { id: 'governance', name: '数据治理组', users: [{ id: 'chen', name: '陈嘉' }, { id: 'xu', name: '许清' }] },
    { id: 'operations', name: '平台运维组', users: [{ id: 'wang', name: '王睿' }, { id: 'li', name: '李欣' }] }
  ] }];
  function clone(value) { return JSON.parse(JSON.stringify(value)); }
  function esc(value) { return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function btn(action, icon, label, attrs, cls) { return '<button type="button" class="' + (cls || 'btn btn-outline') + '" data-nr-action="' + action + '" ' + (attrs || '') + '><i class="bi bi-' + icon + '" aria-hidden="true"></i><span>' + label + '</span></button>'; }
  function empty(text) { return '<div class="nr-empty"><i class="bi bi-inbox" aria-hidden="true"></i><span>' + text + '</span></div>'; }
  function typeName(id) { var type = catalog.types.find(function (t) { return t.id === id; }); return type ? type.name : '已移除类型'; }
  function recipientName(id) {
    var result = '';
    function walk(nodes) { nodes.forEach(function (node) { if ('dept:' + node.id === id) result = node.name; (node.users || []).forEach(function (u) { if ('user:' + u.id === id) result = u.name; }); walk(node.children || []); }); }
    walk(departments); return result || '已移除用户';
  }
  function blank() { return { id: '', name: '', type: '', items: [], trigger: 'immediate', window: '5', unit: '分钟内', threshold: '3', channels: [], recipients: [], contacts: [], dingGroups: [], feishuGroups: [] }; }
  function seed() {
    var names = ['订单采集异常通知', '会员数据入仓通知', '订单入仓超时通知', '订单接口故障通知', '库存快照写入通知', '会员接口性能通知', '交易汇总异常通知', '商品接口并发通知', '订单表结构变更通知', '物流采集超时通知', '订单采集量波动通知', '支付接口异常通知'];
    return catalog.items.slice(0, 12).map(function (item, index) {
      return Object.assign(blank(), { id: 'NR' + (index + 1), name: names[index], type: item.type, items: [clone(item)], trigger: index % 3 === 0 ? 'periodic' : 'immediate', channels: index % 2 ? ['钉钉', '邮箱'] : [channels[index % 4]], recipients: [index % 2 ? 'dept:operations' : 'dept:governance'] });
    });
  }
  function load() {
    try { var saved = JSON.parse(localStorage.getItem(storageKey) || 'null'); if (saved && saved.version === 1 && Array.isArray(saved.rules) && saved.rules.every(function (r) { return r && typeof r.id === 'string' && typeof r.name === 'string' && ['items', 'channels', 'recipients', 'contacts', 'dingGroups', 'feishuGroups'].every(function (key) { return Array.isArray(r[key]); }); })) return saved.rules; }
    catch (e) { storageError = true; }
    return seed();
  }
  function persist(next) {
    try { localStorage.setItem(storageKey, JSON.stringify({ version: 1, rules: next })); storageError = false; }
    catch (e) { storageError = true; }
    rules = next;
  }
  function notice(text) { var el = root.querySelector('[data-nr-notice]'); if (el) el.textContent = text; }
  function filtered() { return rules.filter(function (r) { return (!state.type || r.type === state.type) && (!state.keyword || r.name.toLowerCase().indexOf(state.keyword.toLowerCase()) >= 0); }); }
  function typePicker(value, attr, placeholder) {
    if (catalog.types.length <= 10) return '<select class="nr-control" ' + attr + '><option value="">' + placeholder + '</option>' + catalog.types.map(function (t) { return '<option value="' + esc(t.id) + '"' + (value === t.id ? ' selected' : '') + '>' + esc(t.name) + '</option>'; }).join('') + '</select>';
    return '<details class="nr-type-picker"><summary class="nr-control">' + esc(value ? typeName(value) : placeholder) + '<i class="bi bi-chevron-down"></i></summary><div class="nr-type-panel"><input class="nr-control" type="search" data-nr-type-search placeholder="搜索监控类型" aria-label="搜索监控类型"><div data-nr-type-options>' + btn('type', 'x-circle', placeholder, 'data-value=""', 'nr-option') + catalog.types.map(function (t) { return btn('type', 'folder', esc(t.name), 'data-value="' + esc(t.id) + '"', 'nr-option'); }).join('') + '</div><div data-nr-type-empty hidden>没有匹配的类型</div></div></details>';
  }
  function pagination(total, current, size, scope) {
    var count = Math.max(1, Math.ceil(total / size)), start = (current - 1) * size;
    return '<span>第 ' + (total ? start + 1 : 0) + ' 到第 ' + Math.min(start + size, total) + ' 条，共 ' + total + ' 条数据</span><div class="page-nav">' + btn('page', 'chevron-left', '上一页', 'data-scope="' + scope + '" data-page="' + (current - 1) + '"' + (current === 1 ? ' disabled' : '')) + '<span class="nr-page-count">' + current + ' / ' + count + '</span>' + btn('page', 'chevron-right', '下一页', 'data-scope="' + scope + '" data-page="' + (current + 1) + '"' + (current === count ? ' disabled' : '')) + '<select class="nr-control nr-page-size" data-nr-size="' + scope + '" aria-label="每页条数">' + [10, 20, 50].map(function (n) { return '<option' + (n === size ? ' selected' : '') + ' value="' + n + '">' + n + ' 条/页</option>'; }).join('') + '</select><label>跳至 <input class="nr-control nr-jump" type="number" min="1" max="' + count + '" value="' + current + '" data-nr-jump="' + scope + '" aria-label="跳转页码"> 页</label></div>';
  }
  function renderList() {
    draft = null; picker = null;
    root.innerHTML = '<section class="nr-list"><div class="nr-toolbar">' + btn('new', 'plus-lg', '新建', '', 'btn btn-primary') + btn('delete-selected', 'trash', '删除', 'data-nr-delete disabled') + '<div class="nr-query"><label>类型</label>' + typePicker(state.type, 'data-nr-query-type aria-label="类型"', '全部') + '<input class="nr-control nr-keyword" type="search" placeholder="请输入规则名称" aria-label="规则名称关键词" data-nr-keyword value="' + esc(state.keywordDraft) + '">' + btn('query', 'search', '查询', '', 'btn btn-primary') + '</div></div><div data-nr-notice class="nr-notice" role="status" aria-live="polite"></div><div data-nr-list-table></div><div class="ds-pagination nr-pagination" data-nr-pagination></div></section>';
    renderRows(); if (storageError) notice('本地存储不可用，当前修改仅在本次页面使用期间保留。');
  }
  function renderRows() {
    var rows = filtered(); state.page = Math.min(state.page, Math.max(1, Math.ceil(rows.length / state.size)));
    var paged = rows.slice((state.page - 1) * state.size, state.page * state.size);
    root.querySelector('[data-nr-list-table]').innerHTML = '<div class="nr-table-scroll"><table class="ds-table nr-table"><colgroup><col style="width:42px"><col style="width:200px"><col style="width:120px"><col><col style="width:185px"><col style="width:210px"></colgroup><thead><tr><th><input type="checkbox" data-nr-all aria-label="选择本页规则"' + (paged.length ? '' : ' disabled') + '></th><th>规则名称</th><th>监控类型</th><th>监控事项</th><th>通知接收者</th><th>操作</th></tr></thead><tbody>' + (paged.length ? paged.map(function (r) {
      return '<tr><td><input type="checkbox" data-nr-check="' + esc(r.id) + '" aria-label="选择' + esc(r.name) + '"></td><td>' + esc(r.name) + '</td><td>' + esc(typeName(r.type)) + '</td><td>' + r.items.map(function (i) { return esc(i.name); }).join('、') + '</td><td>' + esc(r.recipients.map(recipientName).concat(r.contacts.map(function (c) { return c.name; })).join('、') || '—') + '</td><td><div class="nr-actions">' + btn('view', 'eye', '查看', 'data-id="' + esc(r.id) + '"', 'nr-link') + btn('edit', 'pencil-square', '修改', 'data-id="' + esc(r.id) + '"', 'nr-link') + btn('delete', 'trash', '删除', 'data-id="' + esc(r.id) + '"', 'nr-link') + '</div></td></tr>';
    }).join('') : '<tr><td colspan="6">' + empty('暂无匹配的通知规则') + '</td></tr>') + '</tbody></table></div>';
    root.querySelector('[data-nr-pagination]').innerHTML = pagination(rows.length, state.page, state.size, 'list'); syncChecks();
  }
  function syncChecks() {
    var boxes = Array.from(root.querySelectorAll('[data-nr-check]')), count = 0;
    boxes.forEach(function (box) { box.checked = state.selected.has(box.dataset.nrCheck); if (box.checked) count++; });
    var all = root.querySelector('[data-nr-all]'); if (all) { all.checked = !!boxes.length && count === boxes.length; all.indeterminate = count > 0 && count < boxes.length; }
    var del = root.querySelector('[data-nr-delete]'); if (del) del.disabled = !state.selected.size;
  }
  function query(value) {
    var input = root.querySelector('[data-nr-keyword]'); state.keywordDraft = input.value; state.keyword = input.value.trim();
    state.type = value == null ? state.type : value; state.page = 1; state.selected.clear(); renderList();
  }
  function field(label, html, required) { return '<div class="nr-form-row"><div class="nr-form-label">' + (required ? '<span class="nr-required">*</span>' : '') + label + '</div><div class="nr-form-value">' + html + '</div></div>'; }
  function input(key, value, label, attrs) { return '<input class="nr-control" data-nr-value="' + key + '" aria-label="' + label + '" value="' + esc(value) + '" ' + (attrs || '') + (readonly ? ' disabled' : '') + '>'; }
  function itemTable(items, selectable, target) {
    return '<table class="ds-table nr-table nr-items"><colgroup>' + (selectable ? '<col style="width:42px">' : '') + '<col style="width:235px"><col></colgroup><thead><tr>' + (selectable ? '<th><input type="checkbox" data-nr-items-all="' + target + '" aria-label="选择本页事项"></th>' : '') + '<th>名称</th><th>描述</th></tr></thead><tbody>' + (items.length ? items.map(function (item) { return '<tr>' + (selectable ? '<td><input type="checkbox" data-nr-item="' + esc(item.id) + '" data-target="' + target + '" aria-label="选择' + esc(item.name) + '"' + ((target === 'picker' ? picker.selected : state.itemsSelected).has(item.id) ? ' checked' : '') + '></td>' : '') + '<td>' + esc(item.name) + '</td><td>' + esc(item.description || '—') + '</td></tr>'; }).join('') : '<tr><td colspan="' + (selectable ? 3 : 2) + '">' + empty('暂无监控事项') + '</td></tr>') + '</tbody></table>';
  }
  function descendants(node) { return (node.children || []).reduce(function (ids, child) { return ids.concat(descendants(child)); }, (node.users || []).map(function (u) { return 'user:' + u.id; })); }
  function treeHtml() {
    var keyword = state.treeSearch.trim().toLowerCase(), users = state.treeTab === 'user';
    function walk(nodes, inheritedMatch) {
      return nodes.map(function (node) {
        var match = inheritedMatch || (keyword && node.name.toLowerCase().indexOf(keyword) >= 0);
        var children = walk(node.children || [], match), people = users ? (node.users || []).filter(function (u) { return !keyword || match || u.name.toLowerCase().indexOf(keyword) >= 0; }).map(function (u) { return '<label class="nr-tree-user"><input type="checkbox" data-nr-recipient="user:' + u.id + '"' + (draft.recipients.indexOf('user:' + u.id) >= 0 ? ' checked' : '') + '><i class="bi bi-person"></i>' + esc(u.name) + '</label>'; }).join('') : '';
        if (keyword && !match && !children && !people) return '';
        var ids = users ? descendants(node) : ['dept:' + node.id], checked = ids.length && ids.every(function (id) { return draft.recipients.indexOf(id) >= 0; });
        return '<details class="nr-tree-node" data-node="' + node.id + '"' + (keyword || state.expanded.has(node.id) ? ' open' : '') + '><summary><i class="bi bi-chevron-right nr-tree-chevron"></i><input type="checkbox" data-nr-dept="' + node.id + '" aria-label="选择' + esc(node.name) + '"' + (checked ? ' checked' : '') + '><i class="bi bi-folder2"></i><span>' + esc(node.name) + '</span></summary><div class="nr-tree-children">' + children + people + '</div></details>';
      }).join('');
    }
    return walk(departments, false) || empty('没有匹配的部门或用户');
  }
  function selectedRecipients() { return draft.recipients.map(function (id) { return '<div class="nr-recipient"><span><i class="bi bi-' + (id.indexOf('dept:') === 0 ? 'folder2' : 'person') + '"></i> ' + esc(recipientName(id)) + '</span>' + (readonly ? '' : btn('remove-recipient', 'x-lg', '移除', 'data-id="' + id + '"', 'nr-link')) + '</div>'; }).join('') || empty('暂未选择用户'); }
  function renderRecipients() {
    var tree = root.querySelector('[data-nr-tree]'); if (tree) { tree.innerHTML = treeHtml(); tree.querySelectorAll('[data-nr-dept]').forEach(function (box) { if (state.treeTab !== 'user') return; var ids = descendants(findDepartment(box.dataset.nrDept)); var count = ids.filter(function (id) { return draft.recipients.indexOf(id) >= 0; }).length; box.indeterminate = count > 0 && count < ids.length; }); }
    root.querySelector('[data-nr-recipients]').innerHTML = selectedRecipients();
  }
  function repeatRows(key, fields) {
    var rows = draft[key].length ? draft[key] : [Object.fromEntries(fields.map(function (f) { return [f[0], '']; }))];
    return '<div class="nr-repeat" data-nr-repeat="' + key + '">' + rows.map(function (row, index) { return '<div class="nr-repeat-row">' + fields.map(function (f) { return '<label><span>' + f[1] + '</span><input class="nr-control" data-nr-cell="' + f[0] + '" aria-label="' + f[1] + (index + 1) + '" value="' + esc(row[f[0]]) + '"' + (readonly ? ' disabled' : '') + '></label>'; }).join('') + (readonly ? '' : btn('remove-row', 'dash-lg', '移除', 'data-key="' + key + '" data-index="' + index + '"', 'nr-link')) + '</div>'; }).join('') + (readonly ? '' : btn('add-row', 'plus-lg', '添加', 'data-key="' + key + '"', 'nr-link')) + '</div>';
  }
  function renderForm() {
    root.innerHTML = '<header class="nr-head"><h2>' + (readonly ? '查看规则' : draft.id ? '修改规则' : '新建规则') + '</h2>' + btn('back', 'arrow-left', '返回') + '</header><div data-nr-notice class="nr-notice" role="status" aria-live="polite"></div><div class="nr-form">' +
      field('名称', '<div class="nr-name">' + input('name', draft.name, '规则名称', 'maxlength="50"') + '<span data-nr-counter>' + draft.name.length + '/50</span></div>', true) +
      field('监控类型', readonly ? input('type', typeName(draft.type), '监控类型') : typePicker(draft.type, 'data-nr-form-type aria-label="监控类型"', '请选择监控类型'), true) +
      field('监控事项', (readonly ? '' : '<div class="nr-actions nr-item-actions">' + btn('add-items', 'plus-lg', '添加', draft.type ? '' : 'disabled') + btn('remove-items', 'trash', '删除', 'data-nr-remove-items' + (state.itemsSelected.size ? '' : ' disabled')) + '</div>') + '<div data-nr-items-table>' + itemTable(draft.items, !readonly, 'form') + '</div>', true) +
      field('触发条件', '<div class="nr-trigger"><label><input type="radio" name="nrTrigger" data-nr-trigger value="immediate"' + (draft.trigger === 'immediate' ? ' checked' : '') + (readonly ? ' disabled' : '') + '> 立即执行</label><span class="nr-hint">满足预警规则就立即发生通知</span></div><div class="nr-trigger"><label><input type="radio" name="nrTrigger" data-nr-trigger value="periodic"' + (draft.trigger === 'periodic' ? ' checked' : '') + (readonly ? ' disabled' : '') + '> 周期执行</label>' + input('window', draft.window, '周期时长', 'type="number" min="1" step="1"') + '<select class="nr-control" data-nr-value="unit" aria-label="周期单位"' + (readonly ? ' disabled' : '') + '>' + ['分钟内', '小时内'].map(function (unit) { return '<option' + (unit === draft.unit ? ' selected' : '') + '>' + unit + '</option>'; }).join('') + '</select><span>满足预警规则次数，大于</span>' + input('threshold', draft.threshold, '触发次数阈值', 'type="number" min="0" step="1"') + '<span>发生一次通知</span></div>', true) +
      field('通知类型', '<div class="nr-channels">' + channels.map(function (channel) { return '<label><input type="checkbox" data-nr-channel="' + esc(channel) + '"' + (draft.channels.indexOf(channel) >= 0 ? ' checked' : '') + (readonly ? ' disabled' : '') + '> ' + esc(channel) + '</label>'; }).join('') + '</div>', true) +
      field('通知用户', '<div class="nr-recipient-picker' + (readonly ? ' is-readonly' : '') + '">' + (readonly ? '' : '<div class="nr-recipient-source"><div class="nr-tabs">' + btn('tree-tab', 'folder2', '按部门', 'data-tab="department" aria-pressed="' + (state.treeTab === 'department') + '"', 'nr-tab' + (state.treeTab === 'department' ? ' active' : '')) + btn('tree-tab', 'people', '按用户', 'data-tab="user" aria-pressed="' + (state.treeTab === 'user') + '"', 'nr-tab' + (state.treeTab === 'user' ? ' active' : '')) + '</div><input class="nr-control" type="search" data-nr-tree-search placeholder="搜索部门或用户" aria-label="搜索部门或用户" value="' + esc(state.treeSearch) + '"><div data-nr-tree class="nr-tree"></div></div><i class="bi bi-arrow-right nr-transfer-arrow" aria-hidden="true"></i>') + '<div class="nr-recipient-target"><h3>已选择用户</h3><div data-nr-recipients></div></div></div>', true) +
      field('其他联系人', repeatRows('contacts', [['name', '姓名'], ['email', 'Email'], ['phone', '手机']])) +
      field('钉钉群', repeatRows('dingGroups', [['name', '名称'], ['sign', '签名'], ['webhook', 'Webhook']])) +
      field('润工作群(飞书)', repeatRows('feishuGroups', [['name', '名称'], ['webhook', 'Webhook']])) + '</div>' + (readonly ? '' : '<footer class="nr-footer">' + btn('save', 'floppy', '保存', '', 'btn btn-primary') + btn('back', 'x-lg', '取消') + '</footer>') + '<div data-nr-overlay></div>';
    renderRecipients();
  }
  function capture() {
    if (!draft || readonly) return;
    root.querySelectorAll('[data-nr-value]').forEach(function (el) { draft[el.dataset.nrValue] = el.value; });
    var type = root.querySelector('[data-nr-form-type]'); if (type) draft.type = type.value;
    var trigger = root.querySelector('[data-nr-trigger]:checked'); draft.trigger = trigger ? trigger.value : '';
    draft.channels = Array.from(root.querySelectorAll('[data-nr-channel]:checked')).map(function (el) { return el.dataset.nrChannel; });
    root.querySelectorAll('[data-nr-repeat]').forEach(function (el) { draft[el.dataset.nrRepeat] = Array.from(el.querySelectorAll('.nr-repeat-row')).map(function (row) { var result = {}; row.querySelectorAll('[data-nr-cell]').forEach(function (cell) { result[cell.dataset.nrCell] = cell.value.trim(); }); return result; }); });
  }
  function openForm(id, viewOnly) {
    var found = rules.find(function (r) { return r.id === id; });
    draft = found ? clone(found) : blank(); readonly = viewOnly;
    state.itemsSelected.clear(); state.treeTab = 'department'; state.treeSearch = ''; state.expanded = new Set(['platform']); renderForm();
  }
  function findDepartment(id) { var found; function walk(nodes) { nodes.forEach(function (node) { if (node.id === id) found = node; walk(node.children || []); }); } walk(departments); return found; }
  function availableItems() { return catalog.items.filter(function (item) { return item.type === draft.type; }); }
  function renderPicker() {
    var items = availableItems(); picker.page = Math.min(picker.page, Math.max(1, Math.ceil(items.length / picker.size)));
    root.querySelector('[data-nr-overlay]').innerHTML = '<div class="nr-modal-mask"><section class="nr-modal" role="dialog" aria-modal="true" aria-labelledby="nrPickerTitle"><header><h3 id="nrPickerTitle">添加事项</h3>' + btn('close-picker', 'x-lg', '关闭') + '</header><div class="nr-modal-body">' + itemTable(items.slice((picker.page - 1) * picker.size, picker.page * picker.size), true, 'picker') + '<div class="ds-pagination nr-pagination">' + pagination(items.length, picker.page, picker.size, 'picker') + '</div></div><footer>' + btn('close-picker', 'x-lg', '取消') + btn('save-picker', 'floppy', '保存', '', 'btn btn-primary') + '</footer></section></div>';
    syncItemChecks();
  }
  function syncItemChecks() {
    ['picker', 'form'].forEach(function (target) { var boxes = Array.from(root.querySelectorAll('[data-nr-item][data-target="' + target + '"]')), all = root.querySelector('[data-nr-items-all="' + target + '"]'); if (!all) return; var chosen = target === 'picker' && picker ? picker.selected : state.itemsSelected; boxes.forEach(function (b) { b.checked = chosen.has(b.dataset.nrItem); }); var count = boxes.filter(function (b) { return b.checked; }).length; all.disabled = !boxes.length; all.checked = !!boxes.length && count === boxes.length; all.indeterminate = count > 0 && count < boxes.length; });
    var del = root.querySelector('[data-nr-remove-items]'); if (del) del.disabled = !state.itemsSelected.size;
  }
  function closePicker() { picker = null; root.querySelector('[data-nr-overlay]').innerHTML = ''; var add = root.querySelector('[data-nr-action="add-items"]'); if (add) add.focus(); }
  function save() {
    capture(); var next = clone(draft); next.name = next.name.trim();
    ['contacts', 'dingGroups', 'feishuGroups'].forEach(function (key) { next[key] = next[key].filter(function (row) { return Object.values(row).some(Boolean); }); });
    var error = '';
    if (!next.name || next.name.length > 50) error = '请填写50字以内的规则名称。';
    else if (rules.some(function (r) { return r.id !== next.id && r.name === next.name; })) error = '规则名称已存在，请使用其他名称。';
    else if (!catalog.types.some(function (t) { return t.id === next.type; })) error = '请选择监控类型。';
    else if (!next.items.length || next.items.some(function (i) { return !catalog.items.some(function (c) { return c.id === i.id && c.type === next.type; }); })) error = '请添加当前监控类型下的有效监控事项。';
    else if (!next.trigger || (next.trigger === 'periodic' && (!/^\d+$/.test(next.window) || Number(next.window) < 1 || !/^\d+$/.test(next.threshold)))) error = '请填写有效的周期时长和触发次数：时长为正整数，次数为非负整数。';
    else if (!next.channels.length) error = '请至少选择一种通知类型。';
    else if (!next.recipients.length) error = '请选择通知用户。';
    else if (next.contacts.some(function (r) { return !r.name || (!r.email && !r.phone) || (r.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(r.email)) || (r.phone && !/^\+?[\d\s()-]{6,20}$/.test(r.phone)); })) error = '请补全联系人姓名及有效的Email或手机。';
    else if (next.dingGroups.concat(next.feishuGroups).some(function (r) { return !r.name || !/^https?:\/\/[^\s]+$/.test(r.webhook); })) error = '请补全群名称及有效的Webhook地址。';
    if (error) { notice(error); root.querySelector('[data-nr-notice]').scrollIntoView({ block: 'nearest' }); return; }
    next.items = next.items.map(function (item) { return clone(catalog.items.find(function (c) { return c.id === item.id; })); });
    if (!next.id) next.id = 'NR-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7);
    var updated = rules.filter(function (r) { return r.id !== next.id; }); var index = rules.findIndex(function (r) { return r.id === next.id; }); updated.splice(index < 0 ? 0 : index, 0, next);
    persist(updated); state.selected.clear(); renderList(); notice(storageError ? '已保留本次修改，但浏览器存储不可用，刷新后可能丢失。' : '规则已保存。');
  }
  function removeRules(ids) {
    if (!ids.length) return;
    DP.confirm('确认删除选中的 ' + ids.length + ' 条通知规则？', { icon: 'warning', okText: '<i class="bi bi-trash"></i> 删除', cancelText: '<i class="bi bi-x-lg"></i> 取消', onOk: function () { persist(rules.filter(function (r) { return ids.indexOf(r.id) < 0; })); state.selected.clear(); if (root.isConnected) { renderList(); notice(storageError ? '已删除，但浏览器存储不可用，刷新后可能恢复。' : '通知规则已删除。'); } } });
  }
  function changeType(value) { if (!draft) { query(value); return; } capture(); draft.type = value; draft.items = draft.items.filter(function (i) { return i.type === value; }); state.itemsSelected.clear(); renderForm(); }
  function movePage(scope, page, size) {
    var target = scope === 'picker' ? picker : state; if (!target) return;
    if (size) target.size = size;
    var total = scope === 'picker' ? availableItems().length : filtered().length;
    target.page = Math.min(Math.max(1, Number.isFinite(page) ? Math.floor(page) : 1), Math.max(1, Math.ceil(total / target.size)));
    if (scope === 'picker') renderPicker(); else { state.selected.clear(); renderRows(); }
  }
  function onClick(event) {
    var el = event.target.closest('[data-nr-action]'); if (!el || el.disabled) return;
    var action = el.dataset.nrAction;
    if (readonly && ['back'].indexOf(action) < 0) return;
    if (action === 'new') openForm('', false);
    else if (action === 'view' || action === 'edit') openForm(el.dataset.id, action === 'view');
    else if (action === 'back') { readonly = false; renderList(); }
    else if (action === 'query') query();
    else if (action === 'type') changeType(el.dataset.value);
    else if (action === 'delete') removeRules([el.dataset.id]);
    else if (action === 'delete-selected') removeRules(Array.from(state.selected));
    else if (action === 'page') movePage(el.dataset.scope, Number(el.dataset.page));
    else if (action === 'save') save();
    else if (action === 'add-items') { capture(); picker = { selected: new Set(draft.items.map(function (i) { return i.id; })), page: 1, size: 10 }; renderPicker(); root.querySelector('[data-nr-action="close-picker"]').focus(); }
    else if (action === 'close-picker') closePicker();
    else if (action === 'save-picker') { draft.items = availableItems().filter(function (i) { return picker.selected.has(i.id); }).map(clone); closePicker(); state.itemsSelected.clear(); renderForm(); }
    else if (action === 'remove-items') { capture(); draft.items = draft.items.filter(function (i) { return !state.itemsSelected.has(i.id); }); state.itemsSelected.clear(); renderForm(); }
    else if (action === 'tree-tab') { capture(); state.treeTab = el.dataset.tab; renderForm(); }
    else if (action === 'remove-recipient') { draft.recipients = draft.recipients.filter(function (id) { return id !== el.dataset.id; }); renderRecipients(); }
    else if (action === 'add-row' || action === 'remove-row') { capture(); if (action === 'add-row') draft[el.dataset.key].push({}); else draft[el.dataset.key].splice(Number(el.dataset.index), 1); renderForm(); }
  }
  function onChange(event) {
    var el = event.target; if (readonly) return;
    if (el.matches('[data-nr-query-type]')) query(el.value);
    else if (el.matches('[data-nr-form-type]')) changeType(el.value);
    else if (el.matches('[data-nr-check]')) { if (el.checked) state.selected.add(el.dataset.nrCheck); else state.selected.delete(el.dataset.nrCheck); syncChecks(); }
    else if (el.matches('[data-nr-all]')) { root.querySelectorAll('[data-nr-check]').forEach(function (box) { if (el.checked) state.selected.add(box.dataset.nrCheck); else state.selected.delete(box.dataset.nrCheck); }); syncChecks(); }
    else if (el.matches('[data-nr-size]')) movePage(el.dataset.nrSize, 1, Number(el.value));
    else if (el.matches('[data-nr-jump]')) movePage(el.dataset.nrJump, Number(el.value));
    else if (el.matches('[data-nr-item], [data-nr-items-all]')) {
      var target = el.dataset.target || el.dataset.nrItemsAll, chosen = target === 'picker' ? picker.selected : state.itemsSelected;
      var ids = el.dataset.nrItem ? [el.dataset.nrItem] : Array.from(root.querySelectorAll('[data-nr-item][data-target="' + target + '"]')).map(function (b) { return b.dataset.nrItem; });
      ids.forEach(function (id) { if (el.checked) chosen.add(id); else chosen.delete(id); }); syncItemChecks();
    } else if (el.matches('[data-nr-recipient], [data-nr-dept]')) {
      var ids = el.dataset.nrRecipient ? [el.dataset.nrRecipient] : state.treeTab === 'user' ? descendants(findDepartment(el.dataset.nrDept)) : ['dept:' + el.dataset.nrDept];
      draft.recipients = draft.recipients.filter(function (id) { return ids.indexOf(id) < 0; }); if (el.checked) draft.recipients = draft.recipients.concat(ids); renderRecipients();
    }
  }
  function init() {
    root = DP.contentArea.querySelector('.page-notification-rules'); if (!root) return;
    catalog = DP.pages.monitorItems.getCatalog(); rules = rules || load(); readonly = false;
    state = { type: '', keyword: '', keywordDraft: '', page: 1, size: 10, selected: new Set(), itemsSelected: new Set(), treeTab: 'department', treeSearch: '', expanded: new Set(['platform']) };
    root.addEventListener('click', onClick); root.addEventListener('change', onChange);
    root.addEventListener('input', function (event) {
      var el = event.target;
      if (el.matches('[data-nr-keyword]')) state.keywordDraft = el.value;
      else if (el.matches('[data-nr-tree-search]')) { state.treeSearch = el.value; renderRecipients(); }
      else if (el.matches('[data-nr-value="name"]')) root.querySelector('[data-nr-counter]').textContent = el.value.length + '/50';
      else if (el.matches('[data-nr-type-search]')) { var matches = 0; root.querySelectorAll('[data-nr-action="type"]').forEach(function (b) { b.hidden = !!b.dataset.value && b.textContent.toLowerCase().indexOf(el.value.toLowerCase()) < 0; if (b.dataset.value && !b.hidden) matches++; }); root.querySelector('[data-nr-type-empty]').hidden = matches > 0; }
    });
    root.addEventListener('toggle', function (event) { var el = event.target; if (el.matches('.nr-tree-node') && !state.treeSearch) { if (el.open) state.expanded.add(el.dataset.node); else state.expanded.delete(el.dataset.node); } }, true);
    root.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' && event.target.matches('[data-nr-keyword]')) { event.preventDefault(); query(); }
      else if (event.key === 'Enter' && event.target.matches('[data-nr-jump]')) { event.preventDefault(); movePage(event.target.dataset.nrJump, Number(event.target.value)); }
      if (event.key === 'Escape') { if (picker) closePicker(); root.querySelectorAll('.nr-type-picker[open]').forEach(function (p) { p.open = false; }); }
      if (event.key === 'Tab' && picker) { var controls = Array.from(root.querySelectorAll('.nr-modal button:not(:disabled), .nr-modal input:not(:disabled), .nr-modal select:not(:disabled)')); var first = controls[0], last = controls[controls.length - 1]; if (event.shiftKey && event.target === first || !event.shiftKey && event.target === last) { event.preventDefault(); (event.shiftKey ? last : first).focus(); } }
    });
    renderList();
  }
  document.addEventListener('click', function (event) { if (!root || !root.isConnected) return; root.querySelectorAll('.nr-type-picker[open]').forEach(function (p) { if (!p.contains(event.target)) p.open = false; }); });
  return { html: '<div class="page-notification-rules"></div>', init: init };
}());
