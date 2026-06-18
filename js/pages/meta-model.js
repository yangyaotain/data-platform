/**
 * 数据中台 V4.0 - 数据资产 / 元数据管理 / 元模型
 * 静态高保真原型：元模型列表 + 新建/编辑表单联动
 */
window.DP = window.DP || {};
DP.pages = DP.pages || {};

DP.pages.metaModel = (function () {
  var modelRows = [
    { id: 1, name: '2323', object: '库', defaultModel: '是', publishStatus: '编制', auditStatus: '--', creator: '演示-测试', createTime: '2026-04-14 11:19:23', updateTime: '2026-04-14 11:19:23', remark: '库对象的默认元模型，用于承载数据库级资产属性。' },
    { id: 2, name: '字段模型', object: '字段', defaultModel: '否', publishStatus: '已发布', auditStatus: '发布通过', creator: '演示-测试', createTime: '2026-04-09 17:46:13', updateTime: '2026-04-13 16:00:59', remark: '字段对象通用元模型，包含数据类型、长度、精度、业务含义等属性。' },
    { id: 3, name: '库模型', object: '库', defaultModel: '否', publishStatus: '已发布', auditStatus: '发布通过', creator: '演示-测试', createTime: '2026-04-09 17:46:28', updateTime: '2026-04-09 17:51:56', remark: '数据库对象的扩展元模型，用于描述数据源归属与库级标签。' },
    { id: 4, name: '表模型', object: '表', defaultModel: '是', publishStatus: '已发布', auditStatus: '发布通过', creator: '演示-测试', createTime: '2026-04-09 17:46:44', updateTime: '2026-04-09 17:51:49', remark: '表对象默认元模型，用于记录生命周期、主题域、分层和负责人。' }
  ];

  var state = {
    mode: 'list',
    editorMode: 'new',
    editingId: null,
    publishStatus: '',
    auditStatus: '',
    keyword: '',
    sortKey: '',
    sortDir: 'asc',
    selectedIds: {},
    form: {}
  };

  function resetState() {
    state.mode = 'list';
    state.editorMode = 'new';
    state.editingId = null;
    state.publishStatus = '';
    state.auditStatus = '';
    state.keyword = '';
    state.sortKey = '';
    state.sortDir = 'asc';
    state.selectedIds = {};
    state.form = defaultForm('库');
  }

  function defaultForm(object) {
    return {
      name: '',
      object: object || '库',
      defaultModel: '是',
      code: '',
      englishName: '',
      alias: '',
      description: '',
      dataCategory: '',
      dataLevel: '',
      dataType: '',
      length: '',
      precision: '',
      standard: '',
      businessCode: '',
      desensRule: '',
      qualityRule: '',
      encryptRule: '',
      required: '否',
      systemAttr: '',
      formType: '文本框',
      formData: '',
      data: '',
      tableField: ''
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

  function nowText() {
    var d = new Date();
    function pad(n) { return String(n).padStart(2, '0'); }
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + ' ' +
      pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
  }

  function findRow(id) {
    return modelRows.filter(function (row) { return String(row.id) === String(id); })[0];
  }

  function getFilteredRows() {
    var keyword = state.keyword.toLowerCase();
    var rows = modelRows.filter(function (row) {
      if (state.publishStatus && row.publishStatus !== state.publishStatus) return false;
      if (state.auditStatus && row.auditStatus !== state.auditStatus) return false;
      if (!keyword) return true;
      return [row.name, row.object, row.defaultModel, row.creator, row.remark].join(' ').toLowerCase().indexOf(keyword) >= 0;
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

  function renderPublishStatus(status) {
    var cls = status === '已发布' ? 'published' : (status === '已废止' ? 'abolished' : 'editing');
    return '<span class="mm-status mm-status-' + cls + '">' + escapeHtml(status) + '</span>';
  }

  function renderAuditStatus(status) {
    if (status === '--') return '<span class="mm-audit-empty">--</span>';
    return '<span class="mm-status mm-status-approved">' + escapeHtml(status) + '</span>';
  }

  function actionButton(action, icon, text, id, danger) {
    return '<button class="mm-action-btn' + (danger ? ' danger' : '') + '" type="button" data-mm-action="' + action + '" data-id="' + id + '" title="' + text + '">' +
      '<i class="bi ' + icon + '"></i><span>' + text + '</span></button>';
  }

  function renderActions(row) {
    if (row.publishStatus === '已发布') {
      return actionButton('view', 'bi-file-earmark-text', '查看', row.id) +
        actionButton('abolish', 'bi-slash-circle', '废止', row.id, true);
    }
    if (row.publishStatus === '编制') {
      return actionButton('view', 'bi-file-earmark-text', '查看', row.id) +
        actionButton('edit', 'bi-pencil-square', '编辑', row.id) +
        actionButton('publish', 'bi-share-fill', '发布', row.id) +
        actionButton('delete-row', 'bi-trash3', '删除', row.id, true);
    }
    return actionButton('view', 'bi-file-earmark-text', '查看', row.id);
  }

  function renderRow(row) {
    return '<tr data-mm-row="' + row.id + '">' +
      '<td class="mm-col-check"><input type="checkbox" data-mm-row-check="' + row.id + '"' + (state.selectedIds[row.id] ? ' checked' : '') + ' aria-label="选择记录"></td>' +
      '<td title="' + escapeHtml(row.name) + '">' + escapeHtml(row.name) + '</td>' +
      '<td title="' + escapeHtml(row.object) + '">' + escapeHtml(row.object) + '</td>' +
      '<td title="' + escapeHtml(row.defaultModel) + '">' + escapeHtml(row.defaultModel) + '</td>' +
      '<td>' + renderPublishStatus(row.publishStatus) + '</td>' +
      '<td>' + renderAuditStatus(row.auditStatus) + '</td>' +
      '<td title="' + escapeHtml(row.creator) + '">' + escapeHtml(row.creator) + '</td>' +
      '<td title="' + escapeHtml(row.createTime) + '">' + escapeHtml(row.createTime) + '</td>' +
      '<td title="' + escapeHtml(row.updateTime) + '">' + escapeHtml(row.updateTime) + '</td>' +
      '<td class="mm-actions">' + renderActions(row) + '</td>' +
    '</tr>';
  }

  function sortHeader(key, label) {
    return '<button class="mm-th-sort" type="button" data-mm-sort="' + key + '">' +
      '<span>' + label + '</span>' +
      '<span class="mm-sort-stack"><i class="bi bi-caret-up-fill"></i><i class="bi bi-caret-down-fill"></i></span>' +
    '</button>';
  }

  function updateSortButtons(page) {
    page.querySelectorAll('[data-mm-sort]').forEach(function (button) {
      var key = button.getAttribute('data-mm-sort');
      if (key === state.sortKey) button.setAttribute('data-sort-dir', state.sortDir);
      else button.removeAttribute('data-sort-dir');
    });
  }

  function updateCheckAll(page, rows) {
    var checkAll = page.querySelector('[data-mm-check-all]');
    if (!checkAll) return;
    var checkedCount = rows.filter(function (row) { return state.selectedIds[row.id]; }).length;
    checkAll.checked = rows.length > 0 && checkedCount === rows.length;
    checkAll.indeterminate = checkedCount > 0 && checkedCount < rows.length;
  }

  function renderListPage(page) {
    var rows = getFilteredRows();
    page.innerHTML = '<section class="mm-panel">' +
      '<div class="mm-toolbar">' +
        '<div class="mm-toolbar-left">' +
          '<button class="btn btn-primary mm-new-btn" type="button" data-mm-action="new"><i class="bi bi-plus-lg"></i><span>新建</span></button>' +
        '</div>' +
        '<div class="mm-toolbar-right">' +
          '<select class="mm-filter-select" data-mm-filter="publishStatus" aria-label="发布状态"><option value="">发布状态</option><option value="编制"' + (state.publishStatus === '编制' ? ' selected' : '') + '>编制</option><option value="已发布"' + (state.publishStatus === '已发布' ? ' selected' : '') + '>已发布</option><option value="已废止"' + (state.publishStatus === '已废止' ? ' selected' : '') + '>已废止</option></select>' +
          '<select class="mm-filter-select" data-mm-filter="auditStatus" aria-label="审核状态"><option value="">审核状态</option><option value="发布通过"' + (state.auditStatus === '发布通过' ? ' selected' : '') + '>发布通过</option><option value="待审核"' + (state.auditStatus === '待审核' ? ' selected' : '') + '>待审核</option><option value="审核退回"' + (state.auditStatus === '审核退回' ? ' selected' : '') + '>审核退回</option><option value="--"' + (state.auditStatus === '--' ? ' selected' : '') + '>--</option></select>' +
          '<div class="mm-keyword-box"><input type="text" data-mm-keyword value="' + escapeHtml(state.keyword) + '" placeholder="名称" aria-label="名称"><button class="btn btn-primary" type="button" data-mm-action="query"><i class="bi bi-search"></i><span>查询</span></button></div>' +
        '</div>' +
      '</div>' +
      '<div class="mm-table-wrap">' +
        '<table class="mm-table">' +
          '<colgroup><col class="mm-w-check"><col class="mm-w-name"><col class="mm-w-object"><col class="mm-w-default"><col class="mm-w-publish"><col class="mm-w-audit"><col class="mm-w-creator"><col class="mm-w-created"><col class="mm-w-updated"><col class="mm-w-actions"></colgroup>' +
          '<thead><tr>' +
            '<th class="mm-col-check"><input type="checkbox" data-mm-check-all aria-label="全选"></th>' +
            '<th>' + sortHeader('name', '名称') + '</th>' +
            '<th>' + sortHeader('object', '对象') + '</th>' +
            '<th>' + sortHeader('defaultModel', '默认元模型') + '</th>' +
            '<th>' + sortHeader('publishStatus', '发布状态') + '</th>' +
            '<th>' + sortHeader('auditStatus', '审核状态') + '</th>' +
            '<th>' + sortHeader('creator', '创建人') + '</th>' +
            '<th>' + sortHeader('createTime', '创建时间') + '</th>' +
            '<th>' + sortHeader('updateTime', '修改时间') + '</th>' +
            '<th>操作</th>' +
          '</tr></thead>' +
          '<tbody data-mm-table-body>' + (rows.length ? rows.map(renderRow).join('') : '<tr class="mm-empty-row"><td colspan="10">暂无匹配的元模型</td></tr>') + '</tbody>' +
        '</table>' +
      '</div>' +
      '<div class="mm-footer"><span data-mm-count>显示第 1 到第 ' + rows.length + ' 条记录，总共 ' + rows.length + ' 条记录</span></div>' +
    '</section>';
    updateSortButtons(page);
    updateCheckAll(page, rows);
  }

  function selectOptions(options, value, placeholder) {
    var html = placeholder ? '<option value="">' + placeholder + '</option>' : '';
    return html + options.map(function (option) {
      return '<option value="' + escapeHtml(option) + '"' + (option === value ? ' selected' : '') + '>' + escapeHtml(option) + '</option>';
    }).join('');
  }

  function topText(name, placeholder, hint) {
    return '<div class="mm-editor-row">' +
      '<label>' + (name === 'object' ? '<span class="mm-active-label">对象</span>' : escapeHtml(labelMap[name] || name)) + '</label>' +
      '<input data-mm-form="' + name + '" value="' + escapeHtml(state.form[name] || '') + '" placeholder="' + escapeHtml(placeholder || '') + '">' +
      '<span class="mm-field-help"><i class="bi bi-info-circle-fill"></i>' + escapeHtml(hint || '') + '</span>' +
    '</div>';
  }

  function topSelect(name, options, hint) {
    return '<div class="mm-editor-row">' +
      '<label>' + (name === 'object' ? '<span class="mm-active-label">对象</span>' : escapeHtml(labelMap[name] || name)) + '</label>' +
      '<select data-mm-form="' + name + '"' + (name === 'object' ? ' class="mm-object-select"' : '') + '>' + selectOptions(options, state.form[name]) + '</select>' +
      '<span class="mm-field-help">' + (hint ? '<i class="bi bi-info-circle-fill"></i>' + escapeHtml(hint) : '') + '</span>' +
    '</div>';
  }

  var labelMap = {
    name: '名称',
    object: '对象',
    defaultModel: '默认元模型',
    code: '编码',
    englishName: '英文名',
    alias: '别名',
    description: '描述',
    dataCategory: '数据分类',
    dataLevel: '数据分级',
    dataType: '数据类型',
    length: '长度',
    precision: '精度',
    standard: '引用标准',
    businessCode: '引用业务代码',
    desensRule: '脱敏规则',
    qualityRule: '质量规则',
    encryptRule: '加密规则'
  };

  function fieldInput(name, type) {
    var isTextarea = type === 'textarea';
    var control = isTextarea
      ? '<textarea data-mm-form="' + name + '">' + escapeHtml(state.form[name] || '') + '</textarea>'
      : '<input data-mm-form="' + name + '" value="' + escapeHtml(state.form[name] || '') + '">';
    return '<div class="mm-detail-row' + (isTextarea ? ' mm-detail-row-area' : '') + '">' +
      '<label>' + escapeHtml(labelMap[name]) + '</label>' +
      control +
      '<span class="mm-field-help"><i class="bi bi-info-circle-fill"></i>' + escapeHtml(labelMap[name]) + '</span>' +
    '</div>';
  }

  function fieldSelect(name, options, placeholder) {
    return '<div class="mm-detail-row">' +
      '<label>' + escapeHtml(labelMap[name]) + '</label>' +
      '<select data-mm-form="' + name + '">' + selectOptions(options, state.form[name], placeholder) + '</select>' +
      '<span class="mm-field-help"><i class="bi bi-info-circle-fill"></i>' + escapeHtml(labelMap[name]) + '</span>' +
    '</div>';
  }

  function sectionHead(title, buttons, blueBand) {
    return '<div class="mm-section-head' + (blueBand ? ' mm-section-head-band' : '') + '">' +
      '<div class="mm-section-title">' + escapeHtml(title) + '</div>' +
      '<div class="mm-section-actions">' + buttons.map(function (btn) {
        return '<button class="btn ' + btn.cls + '" type="button" data-mm-action="' + btn.action + '"><i class="bi ' + btn.icon + '"></i><span>' + btn.text + '</span></button>';
      }).join('') + '</div>' +
    '</div>';
  }

  function commonButtons(isFirst, isFieldTech) {
    var buttons = [
      { cls: 'btn-primary', action: 'noop', icon: 'bi-plus-square-fill', text: '添加分类' },
      { cls: 'btn-danger', action: 'noop', icon: 'bi-dash-square-fill', text: '删除分类' },
      { cls: 'btn-primary', action: 'noop', icon: 'bi-plus-lg', text: '添加属性' },
      { cls: 'btn-primary', action: 'noop', icon: isFirst || isFieldTech ? 'bi-arrow-down' : 'bi-arrow-up', text: isFirst || isFieldTech ? '分类下移' : '分类上移' }
    ];
    if (isFieldTech) buttons.push({ cls: 'btn-primary', action: 'noop', icon: 'bi-arrow-up', text: '分类上移' });
    return buttons;
  }

  function renderBasicSection(isField) {
    return sectionHead('基本信息', commonButtons(true, false), true) +
      fieldInput('code') +
      fieldInput('englishName') +
      fieldInput('alias') +
      fieldInput('description', 'textarea') +
      (isField ? '' : renderBusinessSection(false));
  }

  function renderTechnicalSection() {
    return sectionHead('技术信息', commonButtons(false, true), false) +
      fieldInput('dataType') +
      fieldInput('length') +
      fieldInput('precision') +
      fieldSelect('standard', ['STD_PERSON_NAME', 'STD_CITY_ID', 'STD_ORDER_COUNT'], '') +
      fieldSelect('businessCode', ['BC_STAT_PERIOD', 'BC_TIMEOUT_REASON', 'BC_EMPLOYEE_STATUS'], '') +
      fieldSelect('desensRule', ['手机号脱敏', '身份证脱敏', '姓名脱敏'], '') +
      '<div class="mm-detail-row mm-quality-row"><label>质量规则</label></div>' +
      '<div class="mm-rule-band">' +
        '<span><i class="bi bi-info-circle-fill"></i> 加密规则</span>' +
        '<i class="bi bi-x-circle-fill mm-rule-remove"></i>' +
        '<label>加密规则</label>' +
        '<select data-mm-form="encryptRule">' + selectOptions(['AES加密', 'SM4加密', '不加密'], state.form.encryptRule, '') + '</select>' +
      '</div>';
  }

  function renderBusinessSection(isField) {
    return sectionHead('业务信息', commonButtons(false, false), false) +
      fieldSelect('dataCategory', ['客户数据', '订单数据', '组织数据', '财务数据'], '') +
      (isField ? fieldSelect('dataLevel', ['请选择', '公开', '内部', '敏感', '核心'], '请选择') : '');
  }

  function renderRightAttrPanel() {
    return '<aside class="mm-attr-panel">' +
      attrText('名称', 'name', '50个字符以内；多级联动多个名称用英文分号;隔开', true, true) +
      attrSelect('是否必填', 'required', ['否', '是'], true) +
      attrSelect('关联系统属性', 'systemAttr', ['请选择', '物理字段名', '字段注释', '数据类型'], true) +
      '<div class="mm-attr-label"><i class="bi bi-list-ul"></i><span>元数据编码规则</span><em>*</em></div>' +
      attrSelect('表单类型', 'formType', ['文本框', '下拉框', '文本域', '日期框'], true) +
      attrTextarea('表单数据', 'formData', '数据用英文分号 “;” 隔开 “,” 例如：深圳;广州;佛山; 1000字以内', true) +
      attrText('数据', 'data', '', true) +
      attrSelect('表字段2', 'tableField', ['请选择', '字段英文名', '字段中文名'], true) +
    '</aside>';
  }

  function attrLabel(label, required) {
    return '<div class="mm-attr-label"><i class="bi bi-list-ul"></i><span>' + escapeHtml(label) + '</span>' + (required ? '<em>*</em>' : '') + '<i class="bi bi-info-circle"></i></div>';
  }

  function attrText(label, name, placeholder, required, disabled) {
    return '<div class="mm-attr-item">' + attrLabel(label, required) +
      '<input data-mm-form="' + name + '" value="' + escapeHtml(state.form[name] || '') + '" placeholder="' + escapeHtml(placeholder || '') + '"' + (disabled ? ' disabled' : '') + '>' +
    '</div>';
  }

  function attrSelect(label, name, options, required) {
    return '<div class="mm-attr-item">' + attrLabel(label, required) +
      '<select data-mm-form="' + name + '">' + selectOptions(options, state.form[name]) + '</select>' +
    '</div>';
  }

  function attrTextarea(label, name, placeholder, required) {
    return '<div class="mm-attr-item">' + attrLabel(label, required) +
      '<textarea data-mm-form="' + name + '" placeholder="' + escapeHtml(placeholder || '') + '">' + escapeHtml(state.form[name] || '') + '</textarea>' +
    '</div>';
  }

  function renderEditorPage(page) {
    var isField = state.form.object === '字段';
    page.innerHTML = '<section class="mm-editor">' +
      '<div class="mm-editor-head">' +
        '<h2><i class="bi bi-list"></i><span>' + (state.editorMode === 'edit' ? '编辑' : '新建') + '</span></h2>' +
        '<button class="btn btn-primary mm-return-btn" type="button" data-mm-action="back-list"><i class="bi bi-arrow-left"></i><span>返回</span></button>' +
      '</div>' +
      '<div class="mm-editor-body">' +
        '<main class="mm-editor-main">' +
          '<div class="mm-main-scroll">' +
            '<div class="mm-editor-top">' +
              topText('name', '长度不超过50个字符!', '请输入模板名称，50个字符以内；') +
              topSelect('object', ['库', '表', '字段'], '') +
              topSelect('defaultModel', ['是', '否'], '') +
            '</div>' +
            renderBasicSection(isField) +
            (isField ? renderTechnicalSection() + renderBusinessSection(true) : '') +
            '<div class="mm-form-footer">' +
              '<button class="btn btn-primary" type="button" data-mm-action="save-editor"><i class="bi bi-save"></i><span>保存</span></button>' +
              '<button class="btn btn-outline" type="button" data-mm-action="back-list"><i class="bi bi-x-lg"></i><span>取消</span></button>' +
            '</div>' +
          '</div>' +
        '</main>' +
        '<div class="mm-splitter"><span></span></div>' +
        renderRightAttrPanel() +
      '</div>' +
    '</section>';
  }

  function renderPage(page) {
    if (state.mode === 'editor') renderEditorPage(page);
    else renderListPage(page);
  }

  function syncForm(page) {
    page.querySelectorAll('[data-mm-form]').forEach(function (control) {
      var key = control.getAttribute('data-mm-form');
      state.form[key] = control.value;
    });
  }

  function openEditor(page, mode, row) {
    state.mode = 'editor';
    state.editorMode = mode;
    state.editingId = row ? row.id : null;
    state.form = defaultForm(row ? row.object : '库');
    if (row) {
      state.form.name = row.name;
      state.form.object = row.object;
      state.form.defaultModel = row.defaultModel;
      state.form.description = row.remark;
    }
    renderPage(page);
  }

  function saveEditor(page) {
    syncForm(page);
    if (!state.form.name.trim()) {
      showToast(page, '请填写名称');
      return;
    }
    if (state.editorMode === 'edit') {
      var editRow = findRow(state.editingId);
      if (editRow) {
        editRow.name = state.form.name;
        editRow.object = state.form.object;
        editRow.defaultModel = state.form.defaultModel;
        editRow.remark = state.form.description;
        editRow.updateTime = nowText();
      }
      state.mode = 'list';
      renderPage(page);
      showToast(page, '元模型已保存');
      return;
    }
    var newId = modelRows.reduce(function (max, item) { return Math.max(max, item.id); }, 0) + 1;
    modelRows.unshift({
      id: newId,
      name: state.form.name,
      object: state.form.object,
      defaultModel: state.form.defaultModel,
      publishStatus: '编制',
      auditStatus: '--',
      creator: '演示-测试',
      createTime: nowText(),
      updateTime: nowText(),
      remark: state.form.description
    });
    state.mode = 'list';
    renderPage(page);
    showToast(page, '元模型已新建');
  }

  function showToast(page, text) {
    var old = page.querySelector('.mm-toast');
    if (old) old.remove();
    var toast = document.createElement('div');
    toast.className = 'mm-toast';
    toast.innerHTML = '<i class="bi bi-check-circle"></i><span>' + escapeHtml(text) + '</span>';
    page.appendChild(toast);
    setTimeout(function () { toast.classList.add('show'); }, 10);
    setTimeout(function () {
      toast.classList.remove('show');
      setTimeout(function () { if (toast.parentNode) toast.remove(); }, 180);
    }, 1800);
  }

  function setPublished(page, row) {
    if (!row) return;
    row.publishStatus = '已发布';
    row.auditStatus = '发布通过';
    row.updateTime = nowText();
    renderPage(page);
    showToast(page, '元模型已发布');
  }

  function setAbolished(page, row) {
    if (!row) return;
    row.publishStatus = '已废止';
    row.auditStatus = '--';
    row.updateTime = nowText();
    renderPage(page);
    showToast(page, '元模型已废止');
  }

  function deleteRow(page, row) {
    if (!row) return;
    modelRows = modelRows.filter(function (item) { return item.id !== row.id; });
    delete state.selectedIds[row.id];
    renderPage(page);
    showToast(page, '元模型已删除');
  }

  function bindEvents(page) {
    page.addEventListener('click', function (e) {
      var sortBtn = e.target.closest('[data-mm-sort]');
      if (sortBtn) {
        var sortKey = sortBtn.getAttribute('data-mm-sort');
        if (state.sortKey === sortKey) state.sortDir = state.sortDir === 'asc' ? 'desc' : 'asc';
        else {
          state.sortKey = sortKey;
          state.sortDir = 'asc';
        }
        renderPage(page);
        return;
      }

      var action = e.target.closest('[data-mm-action]');
      if (!action) return;
      var actionName = action.getAttribute('data-mm-action');
      var row = findRow(action.getAttribute('data-id'));

      if (actionName === 'new') {
        openEditor(page, 'new');
      } else if (actionName === 'query') {
        var publish = page.querySelector('[data-mm-filter="publishStatus"]');
        var audit = page.querySelector('[data-mm-filter="auditStatus"]');
        var keyword = page.querySelector('[data-mm-keyword]');
        state.publishStatus = publish ? publish.value : '';
        state.auditStatus = audit ? audit.value : '';
        state.keyword = keyword ? keyword.value.trim() : '';
        renderPage(page);
      } else if (actionName === 'view') {
        showToast(page, '查看页面暂不展示');
      } else if (actionName === 'edit') {
        openEditor(page, 'edit', row);
      } else if (actionName === 'back-list') {
        state.mode = 'list';
        renderPage(page);
      } else if (actionName === 'save-editor') {
        saveEditor(page);
      } else if (actionName === 'noop') {
        showToast(page, '原型操作已触发');
      } else if (actionName === 'publish') {
        DP.confirm('确认发布元模型 <b>' + escapeHtml(row ? row.name : '') + '</b> 吗？', {
          icon: 'info',
          okText: '发布',
          onOk: function () { setPublished(page, row); }
        });
      } else if (actionName === 'delete-row') {
        DP.confirm('确认删除元模型 <b>' + escapeHtml(row ? row.name : '') + '</b> 吗？', {
          icon: 'danger',
          okText: '删除',
          onOk: function () { deleteRow(page, row); }
        });
      } else if (actionName === 'abolish') {
        DP.confirm('确认废止元模型 <b>' + escapeHtml(row ? row.name : '') + '</b> 吗？', {
          icon: 'danger',
          okText: '废止',
          onOk: function () { setAbolished(page, row); }
        });
      }
    });

    page.addEventListener('change', function (e) {
      var checkAll = e.target.closest('[data-mm-check-all]');
      if (checkAll) {
        getFilteredRows().forEach(function (row) {
          if (checkAll.checked) state.selectedIds[row.id] = true;
          else delete state.selectedIds[row.id];
        });
        renderPage(page);
        return;
      }
      if (e.target.matches('[data-mm-row-check]')) {
        var id = e.target.getAttribute('data-mm-row-check');
        if (e.target.checked) state.selectedIds[id] = true;
        else delete state.selectedIds[id];
        updateCheckAll(page, getFilteredRows());
        return;
      }
      if (e.target.matches('[data-mm-form]')) {
        syncForm(page);
        if (e.target.getAttribute('data-mm-form') === 'object') renderPage(page);
      }
    });

    page.addEventListener('input', function (e) {
      if (e.target.matches('[data-mm-form]')) {
        var key = e.target.getAttribute('data-mm-form');
        state.form[key] = e.target.value;
      }
    });

    page.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && e.target.matches('[data-mm-keyword]')) {
        var query = page.querySelector('[data-mm-action="query"]');
        if (query) query.click();
      }
    });
  }

  return {
    html: '<div class="page-meta-model"></div>',
    init: function () {
      var page = document.querySelector('.page-meta-model');
      if (!page) return;
      resetState();
      bindEvents(page);
      renderPage(page);
    }
  };
})();
