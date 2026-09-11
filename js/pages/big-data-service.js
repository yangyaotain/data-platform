/** 数据资产 / 大数据服务。仅实现参考系统中的大数据账号与集群配置。 */
window.DP = window.DP || {};
DP.pages = DP.pages || {};

DP.pages.bigDataService = (function () {
  var root;
  var pageType = 'account';
  var state;
  var modal = null;
  var statusTimer = null;

  var clusters = [
    { id: 'CL001', name: 'dw_prod_cluster', service: 'hadoop_prod', params: [
      { key: 'dfs.nameservices', value: 'dw-prod' },
      { key: 'yarn.resourcemanager.ha.enabled', value: 'true' }
    ] },
    { id: 'CL002', name: 'realtime_cluster', service: 'flink_realtime', params: [
      { key: 'yarn.application.queue', value: 'realtime' },
      { key: 'fs.defaultFS', value: 'hdfs://realtime' }
    ] },
    { id: 'CL003', name: 'dw_dev_cluster', service: 'hadoop_dev', params: [] }
  ];
  var accounts = [
    { id: 'AC001', name: 'etl_batch_prod', clusterId: 'CL001', storage: 2048, minCpu: 8, maxCpu: 32, minMemory: 16, maxMemory: 64, maxApps: 20, weight: 30 },
    { id: 'AC002', name: 'bi_service_ro', clusterId: 'CL001', storage: 1024, minCpu: 4, maxCpu: 16, minMemory: 8, maxMemory: 32, maxApps: 12, weight: 20 },
    { id: 'AC003', name: 'risk_stream_job', clusterId: 'CL002', storage: 512, minCpu: 8, maxCpu: 24, minMemory: 16, maxMemory: 48, maxApps: 16, weight: 25 },
    { id: 'AC004', name: 'sandbox_analyst', clusterId: 'CL003', storage: 256, minCpu: 2, maxCpu: 8, minMemory: 4, maxMemory: 16, maxApps: 8, weight: 10 }
  ];

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (char) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char];
    });
  }
  function nextId(prefix, rows) {
    var max = rows.reduce(function (value, row) {
      return Math.max(value, Number(String(row.id).replace(/\D/g, '')) || 0);
    }, 0);
    return prefix + String(max + 1).padStart(3, '0');
  }
  function findCluster(id) { return clusters.find(function (row) { return row.id === id; }); }
  function findAccount(id) { return accounts.find(function (row) { return row.id === id; }); }
  function iconButton(kind, label, action, disabled) {
    var icons = { primary: 'bi-plus-lg', edit: 'bi-pencil-square', delete: 'bi-trash3', back: 'bi-arrow-left' };
    var cls = kind === 'primary' ? 'btn btn-primary' : kind === 'delete' ? 'btn btn-outline' : 'btn btn-outline';
    return '<button type="button" class="' + cls + '" data-bds-action="' + action + '"' + (disabled ? ' disabled' : '') + '><i class="bi ' + icons[kind] + '"></i><span>' + label + '</span></button>';
  }
  function notify(message, type) {
    if (!root) return;
    var target = (modal && root.querySelector('[data-bds-modal-status]')) || root.querySelector('[data-bds-status]');
    if (!target) return;
    target.textContent = message;
    target.classList.toggle('error', type === 'error');
    clearTimeout(statusTimer);
    statusTimer = setTimeout(function () {
      if (target) target.textContent = '';
    }, 2600);
  }
  function accountCount(clusterId) {
    return accounts.filter(function (row) { return row.clusterId === clusterId; }).length;
  }

  function renderAccountTree() {
    return '<div class="bds-tree"><ul>' + clusters.map(function (cluster) {
      var expanded = state.expanded.has(cluster.id);
      var children = accounts.filter(function (row) { return row.clusterId === cluster.id; });
      return '<li>' +
        '<button type="button" class="bds-tree-line" data-bds-toggle-cluster="' + cluster.id + '" aria-expanded="' + expanded + '">' +
          '<i class="bi bi-chevron-right"></i><i class="bi bi-hdd-rack"></i>' +
          '<span class="bds-tree-label">' + esc(cluster.name) + '</span><small class="bds-tree-count">' + children.length + '</small>' +
        '</button>' +
        '<ul class="bds-tree-children"' + (expanded ? '' : ' hidden') + '>' + children.map(function (account) {
          return '<li><button type="button" class="bds-tree-line' + (account.id === state.selectedId ? ' active' : '') + '" data-bds-select-account="' + account.id + '">' +
            '<i class="bi bi-person-badge"></i><span class="bds-tree-label">' + esc(account.name) + '</span></button></li>';
        }).join('') + '</ul>' +
      '</li>';
    }).join('') + '</ul></div>';
  }
  function readonlyField(label, value, wide) {
    return '<div class="bds-field' + (wide ? ' wide' : '') + '"><label>' + label + '</label><div class="bds-readonly">' + esc(value) + '</div></div>';
  }
  function renderAccountDetail() {
    var account = findAccount(state.selectedId);
    if (!account) return '<div class="bds-empty"><i class="bi bi-person-badge"></i><span>请选择大数据账号查看详情</span></div>';
    var cluster = findCluster(account.clusterId);
    return '<div class="bds-detail-grid">' +
      readonlyField('大数据账号', account.name) +
      readonlyField('归属集群', cluster ? cluster.name : '-') +
      readonlyField('存储空间(G)', account.storage) +
      readonlyField('最小CPU内核(个)', account.minCpu) +
      readonlyField('最大CPU内核(个)', account.maxCpu) +
      readonlyField('最小内存(G)', account.minMemory) +
      readonlyField('最大内存(G)', account.maxMemory) +
      readonlyField('最大应用数', account.maxApps) +
      readonlyField('权重', account.weight) +
    '</div>';
  }
  function accountToolbar() {
    var account = findAccount(state.selectedId);
    var title = account ? account.name : '大数据账号';
    return '<div class="bds-toolbar"><div class="bds-toolbar-title"><i class="bi bi-person-badge"></i><span>' + esc(title) + '</span></div>' +
      '<div class="bds-toolbar-actions">' + iconButton('primary', '新建大数据账号', 'new-account') + iconButton('edit', '编辑', 'edit-account', !account) + '</div></div>';
  }
  function renderAccountPage() {
    root.innerHTML = '<div class="bds-shell"><aside class="bds-side"><div class="bds-side-title"><i class="bi bi-diagram-3"></i><span>集群 / 账号</span></div>' + renderAccountTree() + '</aside>' +
      '<section class="bds-main">' + accountToolbar() + '<div class="bds-status" data-bds-status></div><div data-bds-main>' + renderAccountDetail() + '</div></section></div><div data-bds-overlay></div>';
  }

  function inputField(label, name, value, options) {
    options = options || {};
    var type = options.type || 'text';
    return '<div class="bds-field' + (options.wide ? ' wide' : '') + '"><label for="bds-' + name + '"><b>*</b>' + label + '</label><div>' +
      '<input class="bds-control" id="bds-' + name + '" name="' + name + '" type="' + type + '" value="' + esc(value) + '"' +
        (options.placeholder ? ' placeholder="' + esc(options.placeholder) + '"' : '') + (options.disabled ? ' disabled' : '') + (type === 'number' ? ' min="1" step="1"' : '') + '>' +
      (options.hint ? '<div class="bds-hint"><i class="bi bi-info-circle-fill"></i><span>' + options.hint + '</span></div>' : '') + '</div></div>';
  }
  function accountClusterField(draft, editMode) {
    var options = clusters.map(function (row) {
      return '<option value="' + row.id + '"' + (row.id === draft.clusterId ? ' selected' : '') + '>' + esc(row.name) + '</option>';
    }).join('');
    if (editMode) {
      var cluster = findCluster(draft.clusterId);
      return '<div class="bds-field"><label><b>*</b>归属集群</label><div class="bds-input-action"><input class="bds-control" value="' + esc(cluster ? cluster.name : '') + '" disabled>' +
        '<button type="button" class="bds-link-btn" data-bds-action="open-cluster-modal"><i class="bi bi-plus-circle"></i><span>新建集群</span></button></div></div>';
    }
    return '<div class="bds-field"><label for="bds-clusterId"><b>*</b>归属集群</label><div class="bds-input-action"><select class="bds-control" id="bds-clusterId" name="clusterId"><option value="">请选择</option>' + options + '</select>' +
      '<button type="button" class="bds-link-btn" data-bds-action="open-cluster-modal"><i class="bi bi-plus-circle"></i><span>新建集群</span></button></div></div>';
  }
  function renderAccountForm(mode) {
    var source = mode === 'edit' ? findAccount(state.selectedId) : null;
    var draft = source ? Object.assign({}, source) : { name: '', clusterId: '', storage: '', minCpu: '', maxCpu: '', minMemory: '', maxMemory: '', maxApps: '', weight: '' };
    state.mode = mode;
    state.draft = draft;
    root.querySelector('[data-bds-main]').innerHTML = '<form data-bds-account-form novalidate><div class="bds-form-grid">' +
      inputField('大数据账号', 'name', draft.name, { disabled: mode === 'edit', placeholder: '长度不超过50个字符', hint: '字母开头，只允许字母、数字、下划线，50个字符以内。' }) +
      accountClusterField(draft, mode === 'edit') +
      inputField('存储空间(G)', 'storage', draft.storage, { type: 'number', hint: '单位：GB。' }) +
      inputField('最小CPU内核数', 'minCpu', draft.minCpu, { type: 'number', hint: 'Yarn 资源至少使用的 CPU 内核数。' }) +
      inputField('最大CPU内核数', 'maxCpu', draft.maxCpu, { type: 'number', hint: 'Yarn 资源最多使用的 CPU 内核数。' }) +
      inputField('最小内存(G)', 'minMemory', draft.minMemory, { type: 'number', hint: 'Yarn 资源最少使用的内存。' }) +
      inputField('最大内存(G)', 'maxMemory', draft.maxMemory, { type: 'number', hint: 'Yarn 资源最多使用的内存。' }) +
      inputField('应用程序最大值', 'maxApps', draft.maxApps, { type: 'number', hint: '账号可同时执行的最大应用数。' }) +
      inputField('权重', 'weight', draft.weight, { type: 'number', hint: '用于分配集群队列资源。' }) +
    '</div><div class="bds-form-footer"><button type="submit" class="btn btn-primary"><i class="bi bi-check-lg"></i><span>保存</span></button>' +
      '<button type="button" class="btn btn-outline" data-bds-action="cancel-form"><i class="bi bi-x-lg"></i><span>取消</span></button></div></form>';
    root.querySelector('.bds-toolbar').innerHTML = '<div class="bds-toolbar-title"><i class="bi bi-list-task"></i><span>' + (mode === 'edit' ? '编辑大数据账号' : '新建大数据账号') + '</span></div>' +
      '<div class="bds-toolbar-actions">' + iconButton('back', '返回', 'cancel-form') + '</div>';
  }
  function accountFormValues(form) {
    var data = new FormData(form);
    var source = state.mode === 'edit' ? findAccount(state.selectedId) : null;
    return {
      id: source ? source.id : nextId('AC', accounts),
      name: source ? source.name : String(data.get('name') || '').trim(),
      clusterId: source ? source.clusterId : String(data.get('clusterId') || ''),
      storage: Number(data.get('storage')),
      minCpu: Number(data.get('minCpu')),
      maxCpu: Number(data.get('maxCpu')),
      minMemory: Number(data.get('minMemory')),
      maxMemory: Number(data.get('maxMemory')),
      maxApps: Number(data.get('maxApps')),
      weight: Number(data.get('weight'))
    };
  }
  function validateAccount(row) {
    if (!/^[A-Za-z][A-Za-z0-9_]{0,49}$/.test(row.name)) return '大数据账号需以字母开头，只能包含字母、数字和下划线，且不超过50个字符';
    if (state.mode === 'new' && accounts.some(function (item) { return item.name === row.name; })) return '大数据账号已存在';
    if (!findCluster(row.clusterId)) return '请选择归属集群';
    var numeric = ['storage', 'minCpu', 'maxCpu', 'minMemory', 'maxMemory', 'maxApps', 'weight'];
    if (numeric.some(function (key) { return !Number.isInteger(row[key]) || row[key] <= 0; })) return '资源配置必须填写大于0的整数';
    if (row.minCpu > row.maxCpu) return '最小CPU内核数不能大于最大CPU内核数';
    if (row.minMemory > row.maxMemory) return '最小内存不能大于最大内存';
    return '';
  }

  function clusterList() {
    return '<div class="bds-cluster-list">' + clusters.map(function (cluster) {
      return '<button type="button" class="bds-cluster-item' + (cluster.id === state.selectedId ? ' active' : '') + '" data-bds-select-cluster="' + cluster.id + '"><i class="bi bi-hdd-rack"></i><span>' + esc(cluster.name) + '</span></button>';
    }).join('') + '</div>';
  }
  function paramsTable(params, editing) {
    var rows = params.map(function (row, index) {
      if (editing && row.editing) {
        return '<tr><td><input class="bds-control" data-bds-param-key="' + index + '" value="' + esc(row.key) + '"></td>' +
          '<td><input class="bds-control" data-bds-param-value="' + index + '" value="' + esc(row.value) + '"></td><td><div class="bds-param-actions">' +
          '<button type="button" class="bds-link-btn" data-bds-finish-param="' + index + '"><i class="bi bi-check2"></i><span>完成</span></button>' +
          '<button type="button" class="bds-link-btn danger" data-bds-delete-param="' + index + '"><i class="bi bi-trash3"></i><span>删除</span></button></div></td></tr>';
      }
      return '<tr><td>' + esc(row.key) + '</td><td>' + esc(row.value) + '</td>' + (editing ? '<td><div class="bds-param-actions"><button type="button" class="bds-link-btn" data-bds-edit-param="' + index + '"><i class="bi bi-pencil-square"></i><span>编辑</span></button><button type="button" class="bds-link-btn danger" data-bds-delete-param="' + index + '"><i class="bi bi-trash3"></i><span>删除</span></button></div></td>' : '') + '</tr>';
    }).join('');
    if (!rows) rows = '<tr><td class="bds-table-empty" colspan="' + (editing ? 3 : 2) + '">暂无配置参数</td></tr>';
    return '<table class="bds-params-table"><thead><tr><th>Key</th><th>Value</th>' + (editing ? '<th style="width:150px">操作</th>' : '') + '</tr></thead><tbody>' + rows + '</tbody></table>';
  }
  function clusterToolbar() {
    var cluster = findCluster(state.selectedId);
    return '<div class="bds-toolbar"><div class="bds-toolbar-title"><i class="bi bi-hdd-rack"></i><span>' + esc(cluster ? cluster.name : '集群配置') + '</span></div><div class="bds-toolbar-actions">' +
      iconButton('primary', '新建集群', 'new-cluster') + iconButton('edit', '编辑', 'edit-cluster', !cluster) + iconButton('delete', '删除', 'delete-cluster', !cluster) + '</div></div>';
  }
  function renderClusterDetail() {
    var cluster = findCluster(state.selectedId);
    if (!cluster) return '<div class="bds-empty"><i class="bi bi-hdd-rack"></i><span>请选择集群查看详情</span></div>';
    return '<div class="bds-detail-grid">' + readonlyField('集群名称', cluster.name) + readonlyField('服务名称', cluster.service) +
      '<div class="bds-section"><div class="bds-section-title"><span>配置参数</span></div>' + paramsTable(cluster.params, false) + '</div></div>';
  }
  function renderClusterPage() {
    root.innerHTML = '<div class="bds-shell"><aside class="bds-side"><div class="bds-side-title"><i class="bi bi-hdd-rack"></i><span>集群列表</span></div>' + clusterList() + '</aside>' +
      '<section class="bds-main">' + clusterToolbar() + '<div class="bds-status" data-bds-status></div><div data-bds-main>' + renderClusterDetail() + '</div></section></div><div data-bds-overlay></div>';
  }
  function clusterNameField(draft, serviceDisabled) {
    return inputField('集群名称', 'clusterName', draft.name, { placeholder: '长度不超过50个字符', hint: '字母开头，只允许字母、数字、下划线、中划线，50个字符以内。' }) +
      '<div class="bds-field"><label for="bds-service"><b>*</b>服务名称</label><div><select class="bds-control" id="bds-service" name="service"' + (serviceDisabled ? ' disabled' : '') + '><option value="">请选择</option>' +
      ['hadoop_prod', 'hadoop_dev', 'flink_realtime'].map(function (value) { return '<option value="' + value + '"' + (draft.service === value ? ' selected' : '') + '>' + value + '</option>'; }).join('') + '</select></div></div>';
  }
  function clusterFormHtml(draft, options) {
    options = options || {};
    return '<form data-bds-cluster-form novalidate><div class="bds-form-grid">' + clusterNameField(draft, options.serviceDisabled) +
      '<div class="bds-section"><div class="bds-section-title"><span>配置参数</span><button type="button" class="bds-link-btn" data-bds-action="add-param"><i class="bi bi-plus-lg"></i><span>新增配置参数</span></button></div>' + paramsTable(draft.params, true) +
      '<div class="bds-hint"><i class="bi bi-info-circle-fill"></i><span>配置参数由 Key 和 Value 组成，新增后请先点击“完成”。</span></div></div></div>' +
      '<div class="bds-form-footer"><button type="submit" class="btn btn-primary"><i class="bi bi-check-lg"></i><span>保存</span></button><button type="button" class="btn btn-outline" data-bds-action="cancel-cluster-form"><i class="bi bi-x-lg"></i><span>取消</span></button></div></form>';
  }
  function renderClusterForm(mode) {
    var source = mode === 'edit' ? findCluster(state.selectedId) : null;
    state.mode = mode;
    state.draft = source ? { id: source.id, name: source.name, service: source.service, params: source.params.map(function (row) { return { key: row.key, value: row.value, editing: false }; }) } : { id: nextId('CL', clusters), name: '', service: '', params: [] };
    root.querySelector('[data-bds-main]').innerHTML = clusterFormHtml(state.draft, { serviceDisabled: mode === 'edit' });
    root.querySelector('.bds-toolbar').innerHTML = '<div class="bds-toolbar-title"><i class="bi bi-list-task"></i><span>' + (mode === 'edit' ? '编辑集群' : '新建集群') + '</span></div><div class="bds-toolbar-actions">' + iconButton('back', '返回', 'cancel-cluster-form') + '</div>';
  }
  function renderCurrentClusterForm() {
    var main = modal ? root.querySelector('[data-bds-cluster-modal-body]') : root.querySelector('[data-bds-main]');
    if (!main) return;
    if (modal) main.innerHTML = clusterFormHtml(state.modalDraft, { serviceDisabled: false }).replace('data-bds-cluster-form', 'data-bds-modal-cluster-form').replace(/data-bds-action="cancel-cluster-form"/g, 'data-bds-action="close-modal"');
    else main.innerHTML = clusterFormHtml(state.draft, { serviceDisabled: state.mode === 'edit' });
  }
  function collectClusterDraft(form, draft) {
    var data = new FormData(form);
    draft.name = String(data.get('clusterName') || '').trim();
    if (!form.elements.service.disabled) draft.service = String(data.get('service') || '');
    return draft;
  }
  function validateCluster(draft, editingId) {
    if (!/^[A-Za-z][A-Za-z0-9_-]{0,49}$/.test(draft.name)) return '集群名称需以字母开头，只能包含字母、数字、下划线和中划线，且不超过50个字符';
    if (clusters.some(function (row) { return row.name === draft.name && row.id !== editingId; })) return '集群名称已存在';
    if (!draft.service) return '请选择服务名称';
    if (draft.params.some(function (row) { return row.editing; })) return '请先完成正在编辑的配置参数';
    if (draft.params.some(function (row) { return !row.key.trim() || !row.value.trim(); })) return '配置参数的 Key 和 Value 不能为空';
    return '';
  }
  function openClusterModal() {
    state.modalDraft = { id: nextId('CL', clusters), name: '', service: '', params: [] };
    modal = { type: 'cluster' };
    root.querySelector('[data-bds-overlay]').innerHTML = '<div class="bds-modal-mask"><section class="bds-modal" role="dialog" aria-modal="true" aria-labelledby="bds-modal-title"><header class="bds-modal-header"><h3 id="bds-modal-title">新建集群</h3><button type="button" class="bds-link-btn" data-bds-action="close-modal" aria-label="关闭"><i class="bi bi-x-lg"></i></button></header><div class="bds-status" data-bds-modal-status></div><div class="bds-modal-body" data-bds-cluster-modal-body></div></section></div>';
    renderCurrentClusterForm();
  }
  function openDeleteConfirm() {
    var cluster = findCluster(state.selectedId);
    if (!cluster) return;
    modal = { type: 'delete', clusterId: cluster.id };
    root.querySelector('[data-bds-overlay]').innerHTML = '<div class="bds-modal-mask"><section class="bds-modal small" role="dialog" aria-modal="true" aria-labelledby="bds-confirm-title"><div class="bds-modal-body"><div class="bds-confirm-body"><span class="bds-confirm-icon"><i class="bi bi-exclamation-lg"></i></span><div class="bds-confirm-copy"><h4 id="bds-confirm-title">确定要删除这条表记录吗？</h4><p>删除后将无法恢复，请谨慎操作！</p></div></div></div><footer class="bds-modal-footer"><button type="button" class="btn btn-outline" data-bds-action="close-modal"><i class="bi bi-x-lg"></i><span>取消</span></button><button type="button" class="btn btn-danger" data-bds-action="confirm-delete"><i class="bi bi-check-lg"></i><span>确定</span></button></footer></section></div>';
  }
  function closeModal() {
    modal = null;
    state.modalDraft = null;
    var overlay = root.querySelector('[data-bds-overlay]');
    if (overlay) overlay.innerHTML = '';
  }
  function currentParamDraft() { return modal && modal.type === 'cluster' ? state.modalDraft : state.draft; }
  function syncParamInputs(index) {
    var draft = currentParamDraft();
    var key = root.querySelector('[data-bds-param-key="' + index + '"]');
    var value = root.querySelector('[data-bds-param-value="' + index + '"]');
    if (draft && draft.params[index]) {
      if (key) draft.params[index].key = key.value;
      if (value) draft.params[index].value = value.value;
    }
  }

  function onClick(event) {
    var accountButton = event.target.closest('[data-bds-select-account]');
    if (accountButton) { state.selectedId = accountButton.dataset.bdsSelectAccount; state.mode = 'view'; renderAccountPage(); return; }
    var clusterButton = event.target.closest('[data-bds-select-cluster]');
    if (clusterButton) { state.selectedId = clusterButton.dataset.bdsSelectCluster; state.mode = 'view'; renderClusterPage(); return; }
    var toggle = event.target.closest('[data-bds-toggle-cluster]');
    if (toggle) {
      var id = toggle.dataset.bdsToggleCluster;
      if (state.expanded.has(id)) state.expanded.delete(id); else state.expanded.add(id);
      renderAccountPage(); return;
    }
    var addParam = event.target.closest('[data-bds-action="add-param"]');
    if (addParam) {
      var paramDraft = currentParamDraft();
      if (!paramDraft || paramDraft.params.some(function (row) { return row.editing; })) { notify('请先完成正在编辑的配置参数', 'error'); return; }
      paramDraft.params.push({ key: '', value: '', editing: true }); renderCurrentClusterForm(); return;
    }
    var editParam = event.target.closest('[data-bds-edit-param]');
    if (editParam) {
      var editingDraft = currentParamDraft();
      if (editingDraft.params.some(function (row) { return row.editing; })) { notify('请先完成正在编辑的配置参数', 'error'); return; }
      editingDraft.params[Number(editParam.dataset.bdsEditParam)].editing = true; renderCurrentClusterForm(); return;
    }
    var finishParam = event.target.closest('[data-bds-finish-param]');
    if (finishParam) {
      var finishIndex = Number(finishParam.dataset.bdsFinishParam); syncParamInputs(finishIndex);
      var finishDraft = currentParamDraft();
      if (!finishDraft.params[finishIndex].key.trim() || !finishDraft.params[finishIndex].value.trim()) { notify('配置参数的 Key 和 Value 不能为空', 'error'); return; }
      finishDraft.params[finishIndex].editing = false; renderCurrentClusterForm(); return;
    }
    var deleteParam = event.target.closest('[data-bds-delete-param]');
    if (deleteParam) { currentParamDraft().params.splice(Number(deleteParam.dataset.bdsDeleteParam), 1); renderCurrentClusterForm(); return; }
    var actionButton = event.target.closest('[data-bds-action]');
    if (!actionButton) return;
    var action = actionButton.dataset.bdsAction;
    if (action === 'new-account') renderAccountForm('new');
    else if (action === 'edit-account') renderAccountForm('edit');
    else if (action === 'cancel-form') renderAccountPage();
    else if (action === 'open-cluster-modal') openClusterModal();
    else if (action === 'new-cluster') renderClusterForm('new');
    else if (action === 'edit-cluster') renderClusterForm('edit');
    else if (action === 'cancel-cluster-form') renderClusterPage();
    else if (action === 'delete-cluster') openDeleteConfirm();
    else if (action === 'close-modal') closeModal();
    else if (action === 'confirm-delete') {
      var linked = accountCount(modal.clusterId);
      if (linked) { closeModal(); notify('该集群已关联大数据账号，不能删除', 'error'); return; }
      clusters = clusters.filter(function (row) { return row.id !== modal.clusterId; });
      state.selectedId = clusters.length ? clusters[0].id : '';
      closeModal(); renderClusterPage(); notify('集群已删除');
    }
  }
  function onSubmit(event) {
    if (event.target.matches('[data-bds-account-form]')) {
      event.preventDefault();
      var row = accountFormValues(event.target);
      var error = validateAccount(row);
      if (error) { notify(error, 'error'); return; }
      if (state.mode === 'edit') accounts[accounts.findIndex(function (item) { return item.id === row.id; })] = row;
      else accounts.push(row);
      state.selectedId = row.id;
      state.expanded.add(row.clusterId);
      renderAccountPage(); notify(state.mode === 'edit' ? '大数据账号已更新' : '大数据账号已创建');
      state.mode = 'view'; return;
    }
    if (event.target.matches('[data-bds-cluster-form]')) {
      event.preventDefault();
      collectClusterDraft(event.target, state.draft);
      var clusterError = validateCluster(state.draft, state.mode === 'edit' ? state.draft.id : '');
      if (clusterError) { notify(clusterError, 'error'); return; }
      var saved = { id: state.draft.id, name: state.draft.name, service: state.draft.service, params: state.draft.params.map(function (row) { return { key: row.key.trim(), value: row.value.trim() }; }) };
      if (state.mode === 'edit') clusters[clusters.findIndex(function (row) { return row.id === saved.id; })] = saved; else clusters.push(saved);
      state.selectedId = saved.id;
      renderClusterPage(); notify(state.mode === 'edit' ? '集群配置已更新' : '集群已创建');
      state.mode = 'view'; return;
    }
    if (event.target.matches('[data-bds-modal-cluster-form]')) {
      event.preventDefault();
      collectClusterDraft(event.target, state.modalDraft);
      var modalError = validateCluster(state.modalDraft, '');
      if (modalError) { notify(modalError, 'error'); return; }
      var modalSaved = { id: state.modalDraft.id, name: state.modalDraft.name, service: state.modalDraft.service, params: state.modalDraft.params.map(function (row) { return { key: row.key.trim(), value: row.value.trim() }; }) };
      clusters.push(modalSaved);
      closeModal();
      var select = root.querySelector('select[name="clusterId"]');
      if (select) {
        select.insertAdjacentHTML('beforeend', '<option value="' + modalSaved.id + '">' + esc(modalSaved.name) + '</option>');
        select.value = modalSaved.id;
      }
      notify('集群已创建，可继续配置大数据账号');
    }
  }
  function onInput(event) {
    var key = event.target.dataset.bdsParamKey;
    var value = event.target.dataset.bdsParamValue;
    if (key != null) currentParamDraft().params[Number(key)].key = event.target.value;
    if (value != null) currentParamDraft().params[Number(value)].value = event.target.value;
    if (event.target.name === 'clusterName') currentParamDraft().name = event.target.value;
  }
  function onChange(event) {
    if (event.target.name === 'service') currentParamDraft().service = event.target.value;
  }
  function onKey(event) {
    if (event.key === 'Escape' && modal) closeModal();
  }
  function init(type) {
    root = DP.contentArea.querySelector('.page-big-data-service');
    if (!root) return;
    pageType = type === 'cluster' ? 'cluster' : 'account';
    state = {
      selectedId: pageType === 'account' ? (accounts[0] ? accounts[0].id : '') : (clusters[0] ? clusters[0].id : ''),
      expanded: new Set(clusters.map(function (row) { return row.id; })),
      mode: 'view',
      draft: null,
      modalDraft: null
    };
    modal = null;
    root.addEventListener('click', onClick);
    root.addEventListener('submit', onSubmit);
    root.addEventListener('input', onInput);
    root.addEventListener('change', onChange);
    root.addEventListener('keydown', onKey);
    if (pageType === 'account') renderAccountPage(); else renderClusterPage();
  }
  return { html: '<div class="page-big-data-service"></div>', init: init };
}());
