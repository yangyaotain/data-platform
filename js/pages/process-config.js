/** 控制台 / 流程配置：业务功能审批开关与已有审批流程的绑定。 */
window.DP = window.DP || {};
DP.pages = DP.pages || {};
DP.pages.processConfig = (function () {
  'use strict';
  var storageKey = 'dp-process-config-v1';
  // 系统模块、功能及层级均来自参考系统；这里只配置已有功能。
  var modules = [
    { id: 'console', name: '我的控制台', children: [
      { id: 'projects', name: '项目管理', children: [
        { id: 'project-create', name: '项目新增' }, { id: 'project-edit', name: '项目信息修改', example: 'FLOW0016' },
        { id: 'project-members', name: '成员修改变更' }, { id: 'project-resources', name: '资源申请修改', example: 'FLOW0017' },
        { id: 'project-enable', name: '项目启用' }, { id: 'project-close', name: '项目关闭' }
      ] }
    ] },
    { id: 'development', name: '项目开发', children: [
      { id: 'data-development', name: '数据开发', children: [{ id: 'flow-release', name: '流程发布', example: 'FLOW0009' }] },
      { id: 'data-release', name: '数据发布', children: [{ id: 'data-publish', name: '数据发布-申请发布' }] }
    ] },
    { id: 'assets', name: '数据资产', children: [
      { id: 'metadata-audit', name: '数据治理-审核流程', example: 'FLOW0007' },
      { id: 'model-audit', name: '数据资产-元模型审核流程' },
      { id: 'standard-audit', name: '数据治理-标准数据审核流程', example: 'FLOW0001' },
      { id: 'quality-performance', name: '数据资产-数据质量-绩效管理' },
      { id: 'lifecycle-cleanup', name: '数据资产-生命周期-数据清理任务' }
    ] },
    { id: 'sharing', name: '协同共享', children: [
      { id: 'sharing-audit', name: '数据审核', children: [{ id: 'access-audit', name: '申请审核', example: 'FLOW0014' }, { id: 'share-audit', name: '共享审核' }] }
    ] },
    { id: 'services', name: '数据服务', children: [{ id: 'application-audit', name: '数据服务-应用审批', example: 'FLOW0012' }] },
    { id: 'operations', name: '运营管理', children: [{ id: 'account-audit', name: '审核管理', children: [{ id: 'developer-account', name: '开发者账号' }] }] },
    { id: 'analysis', name: '数据分析', children: [{ id: 'metric-audit', name: '指标审核' }] }
  ];
  var root, catalog, settings, popup = null, collapsed = new Set();
  var features = [], groups = [];
  function walk(nodes) { nodes.forEach(function (item) { if (item.children) { groups.push(item); walk(item.children); } else features.push(item); }); }
  walk(modules);
  function esc(value) { return DP.logView.esc(value); }
  function feature(id) { return features.find(function (item) { return item.id === id; }); }
  function flow(id) { return catalog.flows.find(function (item) { return item.id === id; }); }
  function category(id) { return catalog.categories.find(function (item) { return item.id === id; }); }
  function refreshCatalog() { catalog = DP.pages.processManagement.getCatalog(); }
  function seedSettings() {
    var values = {};
    features.forEach(function (item) { var example = item.example && flow(item.example); values[item.id] = { enabled: !!example, flowId: example ? example.id : '' }; });
    return values;
  }
  function loadSettings() {
    var saved;
    try { saved = JSON.parse(window.localStorage.getItem(storageKey) || 'null'); } catch (error) { saved = null; }
    settings = seedSettings();
    if (!saved || saved.version !== 1 || !saved.values || typeof saved.values !== 'object') return;
    features.forEach(function (item) {
      var value = saved.values[item.id];
      // 保留已删除流程的绑定标识，明确提示重新选择，不能静默套用示例流程。
      if (value && typeof value.enabled === 'boolean' && typeof value.flowId === 'string') settings[item.id] = { enabled: value.enabled, flowId: value.flowId };
    });
  }
  function notice(message, error) {
    if (!root || !root.isConnected) return;
    var el = root.querySelector('[data-pc-notice]'); el.textContent = message || ''; el.classList.toggle('is-error', !!error);
  }
  function persist(message) {
    try { window.localStorage.setItem(storageKey, JSON.stringify({ version: 1, values: settings })); notice(message); }
    catch (error) { notice(message + ' 本地保存失败，当前会话保留；刷新后可能丢失。', true); }
  }
  function flowPath(item) {
    var parts = [item.name], node = category(item.categoryId), seen = new Set();
    while (node && !seen.has(node.id)) { seen.add(node.id); parts.unshift(node.name); node = category(node.parent); }
    return parts.join(' / ');
  }
  function renderCells(item, depth) {
    var value = settings[item.id], selectedFlow = value.enabled ? flow(value.flowId) : null;
    var missing = value.enabled && value.flowId && !selectedFlow;
    var label = selectedFlow ? selectedFlow.name : missing ? '关联流程已删除，请重新选择' : '请选择审批流程';
    return '<td><span class="pc-feature-name" style="--pc-depth:' + depth + '">' + esc(item.name) + '</span></td>' +
      '<td><label class="pm-switch pc-switch" title="' + esc(item.name) + '：' + (value.enabled ? '已开启审批' : '已关闭审批') + '"><input type="checkbox" role="switch" data-pc-switch="' + item.id + '" aria-label="' + esc(item.name) + '审批" aria-checked="' + value.enabled + '"' + (value.enabled ? ' checked' : '') + '><span class="pm-switch-slider" aria-hidden="true"></span></label></td>' +
      '<td>' + (value.enabled ? '<button type="button" class="lm-control pc-select' + (!selectedFlow ? ' is-placeholder' : '') + (missing ? ' is-missing' : '') + '" data-pc-action="open-picker" data-feature="' + item.id + '" role="combobox" aria-haspopup="dialog" aria-controls="pc-flow-picker" aria-expanded="false" aria-label="' + esc(item.name) + '审批流程" title="' + esc(selectedFlow ? flowPath(selectedFlow) : label) + '"><i class="bi bi-diagram-3" aria-hidden="true"></i><span>' + esc(label) + '</span><i class="bi bi-chevron-down" aria-hidden="true"></i></button>' : '') + '</td>' +
      '<td class="pc-description' + (missing ? ' is-missing' : '') + '">' + (selectedFlow ? esc(selectedFlow.description || '—') : missing ? '原流程已不可用，请重新关联。' : '') + '</td>';
  }
  function renderTable() {
    function branch(nodes, depth) { return nodes.map(function (item) {
      if (!item.children) return '<tr data-pc-row="' + item.id + '">' + renderCells(item, depth) + '</tr>';
      var open = !collapsed.has(item.id);
      return '<tr class="pc-group-row' + (depth === 0 ? ' pc-module-row' : '') + '"><td><button type="button" class="pc-group" data-pc-action="toggle-group" data-id="' + item.id + '" style="--pc-depth:' + depth + '" aria-expanded="' + open + '"><i class="bi bi-' + (open ? 'dash-square' : 'plus-square') + '" aria-hidden="true"></i><span>' + esc(item.name) + '</span></button></td><td></td><td></td><td></td></tr>' + (open ? branch(item.children, depth + 1) : '');
    }).join(''); }
    root.querySelector('.pc-table tbody').innerHTML = branch(modules, 0);
  }
  function refreshRow(id) {
    var row = root.querySelector('[data-pc-row="' + id + '"]');
    if (row) { var depth = row.querySelector('.pc-feature-name').style.getPropertyValue('--pc-depth'); row.innerHTML = renderCells(feature(id), depth); }
  }
  function closePicker(restoreFocus) {
    if (!popup) return;
    var trigger = popup.trigger; root.querySelector('[data-pc-floating]').innerHTML = ''; popup = null;
    if (trigger.isConnected) { trigger.setAttribute('aria-expanded', 'false'); if (restoreFocus) trigger.focus(); }
  }
  function filteredCatalog() {
    var text = popup.search.trim().toLowerCase(), categories = new Set();
    var flows = catalog.flows.filter(function (item) { return !text || flowPath(item).toLowerCase().indexOf(text) >= 0; });
    flows.forEach(function (item) {
      var node = category(item.categoryId), seen = new Set();
      while (node && !seen.has(node.id)) { seen.add(node.id); categories.add(node.id); node = category(node.parent); }
    });
    return { flows: flows, categories: categories };
  }
  function renderOptions() {
    var host = root.querySelector('[data-pc-options]'), matching = filteredCatalog();
    if (!matching.flows.length) { host.innerHTML = '<div class="pc-picker-empty"><i class="bi bi-search" aria-hidden="true"></i><span>' + (catalog.flows.length ? '没有匹配的审批流程' : '暂无可选流程，请先在“流程管理”中创建。') + '</span></div>'; return; }
    function categoryCount(id) { return matching.flows.filter(function (item) { var node = category(item.categoryId); while (node) { if (node.id === id) return true; node = category(node.parent); } return false; }).length; }
    function branch(parent, depth) {
      var html = catalog.categories.filter(function (item) { return item.parent === parent && matching.categories.has(item.id); }).map(function (item) {
        var open = !!popup.search.trim() || !popup.collapsed.has(item.id);
        return '<li><button type="button" class="pc-choice-group" data-pc-action="toggle-category" data-id="' + esc(item.id) + '" style="--pc-depth:' + depth + '" aria-expanded="' + open + '"><i class="bi bi-chevron-' + (open ? 'down' : 'right') + '" aria-hidden="true"></i><i class="bi bi-folder2-open" aria-hidden="true"></i><span>' + esc(item.name) + '</span><small>' + categoryCount(item.id) + '</small></button>' + (open ? '<ul>' + branch(item.id, depth + 1) + '</ul>' : '') + '</li>';
      }).join('');
      html += matching.flows.filter(function (item) { return item.categoryId === parent; }).map(function (item) {
        var chosen = settings[popup.featureId].flowId === item.id;
        return '<li><button type="button" class="pc-choice' + (chosen ? ' selected' : '') + '" data-pc-action="choose-flow" data-id="' + esc(item.id) + '" style="--pc-depth:' + depth + '" aria-pressed="' + chosen + '" title="' + esc(flowPath(item)) + '"><i class="bi bi-diagram-3" aria-hidden="true"></i><span>' + esc(item.name) + '</span>' + (chosen ? '<i class="bi bi-check2" aria-hidden="true"></i>' : '') + '</button></li>';
      }).join('');
      return html;
    }
    host.innerHTML = '<ul class="pc-choice-tree">' + branch('', 0) + '</ul>';
  }
  function openPicker(trigger) {
    if (popup && popup.trigger === trigger) { closePicker(true); return; }
    closePicker(); refreshCatalog();
    popup = { trigger: trigger, featureId: trigger.dataset.feature, search: '', collapsed: new Set() };
    var rect = trigger.getBoundingClientRect(), width = Math.min(Math.max(340, rect.width), window.innerWidth - 24);
    var height = Math.min(346, window.innerHeight - 24), top = rect.bottom + height + 4 <= window.innerHeight - 12 ? rect.bottom + 4 : Math.max(12, rect.top - height - 4);
    trigger.setAttribute('aria-expanded', 'true');
    root.querySelector('[data-pc-floating]').innerHTML = '<div id="pc-flow-picker" class="pc-picker" role="dialog" aria-label="选择审批流程" style="width:' + width + 'px;height:' + height + 'px;left:' + Math.max(12, Math.min(rect.left, window.innerWidth - width - 12)) + 'px;top:' + top + 'px"><div class="pc-picker-search"><i class="bi bi-search" aria-hidden="true"></i><input type="search" class="lm-control" data-pc-search placeholder="搜索流程名称或分类" aria-label="搜索流程名称或分类" autocomplete="off"></div><div class="pc-options" data-pc-options></div></div>';
    renderOptions(); root.querySelector('[data-pc-search]').focus();
  }
  function toggleApproval(input) {
    var id = input.dataset.pcSwitch, item = feature(id); if (!item) return;
    closePicker(); refreshCatalog(); settings[id].enabled = input.checked;
    persist('“' + item.name + '”已' + (input.checked ? '开启审批。' + (flow(settings[id].flowId) ? '' : '请选择审批流程。') : '关闭审批。'));
    refreshRow(id); root.querySelector('[data-pc-switch="' + id + '"]').focus();
  }
  function chooseFlow(id) {
    if (!popup) return;
    var selectedId = popup.featureId; refreshCatalog(); var selectedFlow = flow(id);
    if (!selectedFlow) { notice('所选流程已不可用，请重新选择。', true); renderOptions(); return; }
    settings[selectedId].flowId = id; closePicker(); refreshRow(selectedId);
    persist('“' + feature(selectedId).name + '”已关联“' + selectedFlow.name + '”。');
    root.querySelector('[data-feature="' + selectedId + '"]').focus();
  }
  function init() {
    closePicker(); root = document.querySelector('.page-process-config'); if (!root) return;
    refreshCatalog(); if (!settings) loadSettings();
    root.innerHTML = '<div class="pc-table-wrap"><table class="ds-table pc-table" aria-label="系统功能审批流程配置"><colgroup><col style="width:31%"><col style="width:90px"><col style="width:28%"><col></colgroup><thead><tr><th scope="col">系统模块和功能</th><th scope="col">审批</th><th scope="col">审批流程</th><th scope="col">流程描述</th></tr></thead><tbody></tbody></table></div><div class="pc-notice" data-pc-notice role="status" aria-live="polite"></div><div data-pc-floating></div>';
    renderTable();
    root.addEventListener('click', function (event) {
      var target = event.target.closest('[data-pc-action]'); if (!target) return;
      var action = target.dataset.pcAction, id = target.dataset.id;
      if (action === 'open-picker') openPicker(target);
      else if (action === 'choose-flow') chooseFlow(id);
      else if (action === 'toggle-category' && popup) { event.stopPropagation(); if (popup.collapsed.has(id)) popup.collapsed.delete(id); else popup.collapsed.add(id); renderOptions(); var next = root.querySelector('[data-pc-action="toggle-category"][data-id="' + CSS.escape(id) + '"]'); if (next) next.focus(); }
      else if (action === 'toggle-group') { closePicker(); if (collapsed.has(id)) collapsed.delete(id); else collapsed.add(id); renderTable(); root.querySelector('[data-pc-action="toggle-group"][data-id="' + id + '"]').focus(); }
    });
    root.addEventListener('change', function (event) { if (event.target.matches('[data-pc-switch]')) toggleApproval(event.target); });
    root.addEventListener('input', function (event) { if (popup && event.target.matches('[data-pc-search]')) { popup.search = event.target.value; renderOptions(); } });
    root.addEventListener('keydown', function (event) {
      if (!popup) { if (event.key === 'ArrowDown' && event.target.matches('[data-pc-action="open-picker"]')) { event.preventDefault(); openPicker(event.target); } return; }
      if (event.key === 'Escape') { event.preventDefault(); closePicker(true); return; }
      if (event.key === 'Enter' && event.target.matches('[data-pc-search]')) { event.preventDefault(); var matches = root.querySelectorAll('[data-pc-action="choose-flow"]'); if (matches.length === 1) chooseFlow(matches[0].dataset.id); }
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        var buttons = Array.from(root.querySelectorAll('[data-pc-options] button')), index = buttons.indexOf(event.target);
        var next = event.key === 'ArrowDown' ? Math.min(index + 1, buttons.length - 1) : Math.max(0, index - 1);
        if (buttons[next]) { event.preventDefault(); buttons[next].focus(); }
      }
    });
    root.querySelector('.pc-table-wrap').addEventListener('scroll', function () { closePicker(); });
  }
  document.addEventListener('click', function (event) { if (popup && !event.target.closest('.pc-picker') && !popup.trigger.contains(event.target)) closePicker(); });
  document.addEventListener('focusin', function (event) { if (popup && !event.target.closest('.pc-picker') && !popup.trigger.contains(event.target)) closePicker(); });
  window.addEventListener('resize', function () { closePicker(); });
  return { html: '<section class="page-process-config" aria-label="流程配置"></section>', init: init };
}());
