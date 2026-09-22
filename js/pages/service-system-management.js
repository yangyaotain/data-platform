/** 数据服务 / 系统管理：数据分类、数据领域、数据模型与 SDK 管理。 */
window.DP = window.DP || {};
DP.pages = DP.pages || {};

DP.pages.serviceSystemManagement = (function () {
  var root = null;
  var state = {};
  var classRows = [
    { id: 'public', parentId: '', code: 'root', name: '公共目录', desc: '面向全平台发布的数据服务公共分类。', locked: true },
    { id: 'mine', parentId: '', code: 'my-catalog', name: '我的目录', desc: '数据服务团队维护的业务分类目录。' },
    { id: 'logistics', parentId: 'mine', code: 'logistics-service', name: '物流履约', desc: '订单履约、运输轨迹与运力服务数据。' },
    { id: 'customer', parentId: 'mine', code: 'customer-service', name: '客户经营', desc: '客户画像、服务工单与满意度数据。' },
    { id: 'finance', parentId: 'mine', code: 'finance-settlement', name: '财务结算', desc: '账单、结算、开票与对账服务数据。' },
    { id: 'equipment', parentId: 'mine', code: 'equipment-operation', name: '设备运维', desc: '设备状态、告警与维护记录数据。' }
  ];
  var domainRows = [
    { id: 1, code: 'supply_chain', name: '供应链物流', desc: '订单、仓储、运输与履约主题数据', operator: '数据服务管理员', time: '2026-09-21 09:36:18' },
    { id: 2, code: 'customer_ops', name: '客户经营', desc: '客户档案、行为与服务主题数据', operator: '数据服务管理员', time: '2026-09-20 16:22:45' },
    { id: 3, code: 'finance_settlement', name: '财务结算', desc: '账单、发票、结算与对账主题数据', operator: '平台管理员', time: '2026-09-19 14:08:31' },
    { id: 4, code: 'equipment_ops', name: '设备运维', desc: '设备台账、状态、告警与维护主题数据', operator: '数据服务管理员', time: '2026-09-18 11:42:09' },
    { id: 5, code: 'after_sales', name: '售后服务', desc: '工单、退换货与客户反馈主题数据', operator: '平台管理员', time: '2026-09-17 10:15:26' }
  ];
  var sdkRows = [
    { id: 1, name: 'MySQL驱动', jar: 'mysql-connector-j-8.0.33.jar', className: 'com.mysql.cj.jdbc.Driver', desc: 'MySQL 8 数据服务连接驱动', operator: '平台管理员', time: '2026-09-21 10:06:42' },
    { id: 2, name: 'PostgreSQL驱动', jar: 'postgresql-42.7.3.jar', className: 'org.postgresql.Driver', desc: 'PostgreSQL 数据服务连接驱动', operator: '平台管理员', time: '2026-09-20 17:18:36' },
    { id: 3, name: 'Oracle驱动', jar: 'ojdbc8-19.21.jar', className: 'oracle.jdbc.OracleDriver', desc: 'Oracle 数据服务连接驱动', operator: '数据服务管理员', time: '2026-09-19 15:31:08' },
    { id: 4, name: 'StarRocks驱动', jar: 'starrocks-jdbc-2.5.19.jar', className: 'com.mysql.cj.jdbc.Driver', desc: 'StarRocks 分析服务连接驱动', operator: '数据服务管理员', time: '2026-09-18 09:25:17' },
    { id: 5, name: 'Kafka客户端', jar: 'kafka-clients-3.7.0.jar', className: 'org.apache.kafka.clients.producer.KafkaProducer', desc: '实时消息数据服务客户端', operator: '平台管理员', time: '2026-09-17 13:48:52' }
  ];
  var model = {
    code: 'DM20260921001',
    name: '订单履约服务模型',
    enName: 'order_fulfillment_service',
    summary: '统一描述订单、承运商、配送状态及履约异常等数据服务属性。',
    version: 'V1',
    category: '我的目录 / 物流履约',
    domain: '供应链物流',
    shelfTime: '2026-09-18 15:20:08',
    updateTime: '2026-09-21 10:12:36',
    quality: '96',
    dataCount: '128,560',
    browseCount: '2,486',
    pushCount: '126',
    callCount: '18,642',
    unit: '数据运营中心',
    source: '订单履约中心',
    phone: '0755-88001234',
    frequency: '次/时',
    applyCount: '18',
    attrs: [
      { id: 'order-no', label: '订单编号', name: 'order_no', scopes: ['API属性'], inputType: '文本框', required: '是', length: 64, example: 'ORD202609210038' },
      { id: 'logistics-status', label: '物流状态', name: 'logistics_status', scopes: ['API属性', '数据集属性'], inputType: '下拉框', required: '是', optionValues: '待揽收；运输中；已签收；异常', example: '运输中' },
      { id: 'carrier-name', label: '承运商名称', name: 'carrier_name', scopes: ['数据集属性'], inputType: '文本框', required: '否', length: 100, example: '华南捷运物流有限公司' },
      { id: 'expected-arrival', label: '预计送达时间', name: 'expected_arrival_time', scopes: ['库表属性'], inputType: '文本框', required: '否', length: 32, example: '2026-09-22 16:30:00' },
      { id: 'exception-desc', label: '异常说明', name: 'exception_desc', scopes: ['API属性'], inputType: '文本域', required: '否', length: 500, example: '目的地受强降雨影响，预计延迟两小时送达。' }
    ]
  };
  var builtinModelAttrs = [
    { key: 'name', label: '数据名称', name: 'dataName', scopes: ['API属性', '数据集属性', '库表属性'] },
    { key: 'enName', label: '英文名称', name: 'enName', scopes: ['API属性', '数据集属性', '库表属性'] },
    { key: 'summary', label: '数据摘要', name: 'briefIntroduction', scopes: ['API属性', '数据集属性', '库表属性'] },
    { key: 'category', label: '数据分类', name: 'classId', scopes: ['API属性', '数据集属性', '库表属性'] },
    { key: 'domain', label: '数据领域', name: 'areaId', scopes: ['API属性', '数据集属性', '库表属性'] },
    { key: 'unit', label: '管理单位', name: 'manager', scopes: ['API属性', '数据集属性', '库表属性'] },
    { key: 'phone', label: '联系电话', name: 'phone', scopes: ['API属性', '数据集属性', '库表属性'] },
    { key: 'frequency', label: '更新频率', name: 'updateFrequency', scopes: ['API属性', '数据集属性', '库表属性'] }
  ];

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (char) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char];
    });
  }

  function nowText() { return '2026-09-21 11:36:00'; }

  function toast(message, type) {
    var old = root.querySelector('.ssm-toast');
    if (old) old.remove();
    var notice = document.createElement('div');
    notice.className = 'ssm-toast ' + (type || 'info');
    notice.innerHTML = '<i class="bi ' + (type === 'success' ? 'bi-check-circle-fill' : type === 'warning' ? 'bi-exclamation-circle-fill' : 'bi-info-circle-fill') + '"></i><span>' + esc(message) + '</span>';
    root.appendChild(notice);
    window.setTimeout(function () { if (notice.parentNode) notice.remove(); }, 1800);
  }

  function confirmAction(message, onOk) {
    if (DP.confirm) DP.confirm(message, { icon: 'info', onOk: onOk });
    else if (window.confirm(message)) onOk();
  }

  function downloadCsv(filename, rows) {
    var csv = '\ufeff' + rows.map(function (row) {
      return row.map(function (cell) { return '"' + String(cell).replace(/"/g, '""') + '"'; }).join(',');
    }).join('\r\n');
    var url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    var link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    toast('导出文件已生成', 'success');
  }

  function resetState(mode) {
    state = {
      mode: mode,
      classSelected: 'public',
      classNew: false,
      domainDraft: '',
      domainKeyword: '',
      domainSort: '',
      sdkDraft: '',
      sdkKeyword: '',
      sdkSelected: new Set(),
      modelSelected: 'builtin:name',
      modelScopeOpen: false,
      modelDraftNewId: '',
      modelCategoryOpen: false,
      classExpanded: true,
      classParentOpen: false,
      classParentId: '',
      classParentSearch: ''
    };
  }

  function classById(id) { return classRows.filter(function (item) { return item.id === id; })[0] || classRows[0]; }

  function classTreeHtml() {
    var mineChildren = classRows.filter(function (item) { return item.parentId === 'mine'; });
    function row(item, child) {
      var active = !state.classNew && state.classSelected === item.id;
      var button = '<button type="button" class="ssm-tree-row' + (child ? ' child' : '') + (item.id === 'mine' ? ' has-toggle' : '') + (active ? ' active' : '') + '" data-ssm-class-select="' + item.id + '" data-ssm-class-name="' + esc(item.name + ' ' + item.code) + '">' +
        (item.id === 'mine' || child ? '' : '<span class="ssm-tree-spacer"></span>') + '<i class="bi ' + (child ? 'bi-folder2' : 'bi-folder-fill') + '"></i><span>' + esc(item.name) + '</span>' + (item.id === 'mine' ? '<em>(' + mineChildren.length + ')</em>' : '') + '</button>';
      if (item.id !== 'mine') return button;
      return '<div class="ssm-tree-group"><button class="ssm-tree-toggle" type="button" aria-label="展开或收起我的目录" data-ssm-class-toggle><i class="bi bi-chevron-' + (state.classExpanded ? 'down' : 'right') + '"></i></button>' + button + '</div>';
    }
    return row(classRows[0], false) + row(classRows[1], false) + '<div class="ssm-tree-children"' + (state.classExpanded ? '' : ' hidden') + '>' + mineChildren.map(function (item) { return row(item, true); }).join('') + '</div><div class="ssm-tree-empty" data-ssm-class-empty hidden>未找到匹配的分类</div>';
  }

  function classParentPickerHtml(parentId) {
    var parent = parentId ? classById(parentId) : null;
    var mineChildren = classRows.filter(function (item) { return item.parentId === 'mine'; });
    function option(item, child) {
      return '<button type="button" class="ssm-parent-option' + (child ? ' child' : '') + '" data-ssm-class-parent="' + item.id + '" data-ssm-parent-name="' + esc(item.name + ' ' + item.code) + '"><i class="bi ' + (child ? 'bi-folder2' : 'bi-folder-fill') + '"></i><span>' + esc(item.name) + '</span></button>';
    }
    return '<div class="ssm-parent-picker"><button class="ssm-control ssm-tree-select" type="button" data-ssm-class-parent-toggle><span class="' + (parent ? '' : 'placeholder') + '">' + esc(parent ? parent.name : '请选择父级分类') + '</span><i class="bi bi-chevron-down"></i></button>' +
      (parent ? '<button class="ssm-tree-select-clear" type="button" aria-label="清除父级分类" data-ssm-class-parent-clear><i class="bi bi-x-circle-fill"></i></button>' : '') +
      '<div class="ssm-parent-pop"' + (state.classParentOpen ? '' : ' hidden') + '><div class="ssm-tree-search"><i class="bi bi-search"></i><input value="' + esc(state.classParentSearch) + '" placeholder="搜索父级分类" data-ssm-class-parent-search></div>' +
      option(classRows[0], false) + '<div class="ssm-parent-mine">' + option(classRows[1], false) + '<div class="ssm-parent-children">' + mineChildren.map(function (item) { return option(item, true); }).join('') + '</div></div><div class="ssm-category-empty" data-ssm-class-parent-empty hidden>未找到匹配的分类</div></div></div>';
  }

  function classFormHtml() {
    var selected = classById(state.classSelected);
    var item = state.classNew ? { code: '', name: '', desc: '', parentId: state.classParentId } : selected;
    var showActions = state.classNew || !item.locked;
    var showParent = state.classNew || !!item.parentId;
    return '<div class="ssm-section-title">分类属性</div><div class="ssm-class-form">' +
      '<label><span>*</span> 分类编码</label><input class="ssm-control" data-ssm-class-field="code" value="' + esc(item.code) + '"' + (item.locked ? ' disabled' : '') + '>' +
      '<label><span>*</span> 分类名称</label><input class="ssm-control" data-ssm-class-field="name" value="' + esc(item.name) + '"' + (item.locked ? ' disabled' : '') + '>' +
      (showParent ? '<label><span>*</span> 父级分类</label>' + classParentPickerHtml(state.classParentId || item.parentId) : '') +
      '<label>分类描述</label><div class="ssm-textarea-wrap"><textarea class="ssm-control" maxlength="500" data-ssm-class-field="desc" placeholder="500个字符以内"' + (item.locked ? ' disabled' : '') + '>' + esc(item.desc) + '</textarea><em>' + String(item.desc || '').length + ' / 500</em></div>' +
      (showActions ? '<div></div><div class="ssm-form-actions"><button class="btn btn-primary" type="button" data-ssm-class-save><i class="bi bi-check2-circle"></i> 保存</button><button class="btn btn-outline danger" type="button" data-ssm-class-delete><i class="bi bi-trash3"></i> 删除</button></div>' : '') +
    '</div>';
  }

  function renderClassPage() {
    root.innerHTML = '<div class="ssm-class-layout"><aside class="ssm-class-tree"><div class="ssm-tree-search"><i class="bi bi-search"></i><input type="text" placeholder="请输入" data-ssm-class-search></div><div class="ssm-tree-list">' + classTreeHtml() + '</div></aside>' +
      '<section class="ssm-class-main"><div class="ssm-toolbar"><button class="ssm-toolbar-btn" type="button" data-ssm-class-new><i class="bi bi-plus-circle"></i> 新增</button><button class="ssm-toolbar-btn" type="button" data-ssm-import="class"><i class="bi bi-download"></i> 导入</button><button class="ssm-toolbar-btn" type="button" data-ssm-export="class"><i class="bi bi-upload"></i> 导出</button></div>' + classFormHtml() + '</section></div>';
  }

  function filteredDomains() {
    var key = state.domainKeyword.toLowerCase();
    var rows = domainRows.filter(function (row) { return !key || (row.name + row.code).toLowerCase().indexOf(key) > -1; });
    if (state.domainSort) rows.sort(function (a, b) { return String(a[state.domainSort]).localeCompare(String(b[state.domainSort]), 'zh-CN'); });
    return rows;
  }

  function renderDomainPage() {
    var rows = filteredDomains();
    root.innerHTML = '<div class="ssm-list-page"><div class="ssm-list-toolbar"><div class="ssm-list-actions"><button class="ssm-toolbar-btn" type="button" data-ssm-domain-add><i class="bi bi-plus-circle"></i> 新增</button><button class="ssm-toolbar-btn" type="button" data-ssm-import="domain"><i class="bi bi-download"></i> 导入</button><button class="ssm-toolbar-btn" type="button" data-ssm-export="domain"><i class="bi bi-upload"></i> 导出</button></div><div class="ssm-query"><input class="ssm-control" value="' + esc(state.domainDraft) + '" placeholder="名称/编码" data-ssm-domain-keyword><button class="btn btn-primary" type="button" data-ssm-domain-query><i class="bi bi-search"></i> 查询</button></div></div>' +
      '<div class="ssm-table-wrap"><table class="ssm-table ssm-domain-table"><thead><tr><th>序号</th><th><button type="button" data-ssm-domain-sort="code">编码 <i class="bi bi-caret-up-fill"></i><i class="bi bi-caret-down-fill"></i></button></th><th><button type="button" data-ssm-domain-sort="name">名称 <i class="bi bi-caret-up-fill"></i><i class="bi bi-caret-down-fill"></i></button></th><th>描述</th><th>操作者</th><th>修改时间</th><th class="ssm-action-col">操作</th></tr></thead><tbody>' + rows.map(function (row, index) {
        return '<tr><td>' + (index + 1) + '</td><td>' + esc(row.code) + '</td><td>' + esc(row.name) + '</td><td title="' + esc(row.desc) + '">' + esc(row.desc) + '</td><td>' + esc(row.operator) + '</td><td>' + esc(row.time) + '</td><td class="ssm-action-col"><button class="ssm-row-action" type="button" data-ssm-domain-edit="' + row.id + '"><i class="bi bi-pencil-square"></i> 修改</button><button class="ssm-row-action danger" type="button" data-ssm-domain-delete="' + row.id + '"><i class="bi bi-trash3"></i> 删除</button></td></tr>';
      }).join('') + '</tbody></table></div>' + paginationHtml(rows.length) + '</div>';
  }

  function filteredSdks() {
    var key = state.sdkKeyword.toLowerCase();
    return sdkRows.filter(function (row) { return !key || (row.name + row.jar + row.className + row.desc).toLowerCase().indexOf(key) > -1; });
  }

  function renderSdkPage() {
    var rows = filteredSdks();
    root.innerHTML = '<div class="ssm-list-page"><div class="ssm-list-toolbar"><div class="ssm-list-actions"><button class="ssm-toolbar-btn" type="button" data-ssm-sdk-add><i class="bi bi-plus-circle"></i> 新增</button><button class="ssm-toolbar-btn danger" type="button" data-ssm-sdk-batch-delete><i class="bi bi-trash3"></i> 删除</button></div><div class="ssm-query"><input class="ssm-control" value="' + esc(state.sdkDraft) + '" placeholder="关键字查询" data-ssm-sdk-keyword><button class="btn btn-primary" type="button" data-ssm-sdk-query><i class="bi bi-search"></i> 查询</button></div></div>' +
      '<div class="ssm-table-wrap"><table class="ssm-table ssm-sdk-table"><thead><tr><th class="ssm-check-col"><input type="checkbox" data-ssm-sdk-check-all></th><th>名称</th><th>Jar包</th><th>Java类名</th><th>描述</th><th>操作者</th><th>修改时间</th><th class="ssm-action-col">操作</th></tr></thead><tbody>' + rows.map(function (row) {
        return '<tr><td class="ssm-check-col"><input type="checkbox" data-ssm-sdk-check="' + row.id + '"' + (state.sdkSelected.has(row.id) ? ' checked' : '') + '></td><td>' + esc(row.name) + '</td><td title="' + esc(row.jar) + '">' + esc(row.jar) + '</td><td title="' + esc(row.className) + '">' + esc(row.className) + '</td><td title="' + esc(row.desc) + '">' + esc(row.desc) + '</td><td>' + esc(row.operator) + '</td><td>' + esc(row.time) + '</td><td class="ssm-action-col"><button class="ssm-row-action" type="button" data-ssm-sdk-edit="' + row.id + '"><i class="bi bi-pencil-square"></i> 修改</button><button class="ssm-row-action danger" type="button" data-ssm-sdk-delete="' + row.id + '"><i class="bi bi-trash3"></i> 删除</button></td></tr>';
      }).join('') + '</tbody></table></div>' + paginationHtml(rows.length) + '</div>';
  }

  function paginationHtml(total) {
    return '<div class="ssm-pagination"><span>共 ' + total + ' 条</span><button type="button" disabled><i class="bi bi-chevron-left"></i></button><button type="button" class="active">1</button><button type="button" disabled><i class="bi bi-chevron-right"></i></button><select><option>10 条/页</option><option>20 条/页</option><option>50 条/页</option></select></div>';
  }

  function modelCategoryPickerHtml() {
    return '<div class="ssm-category-picker"><button class="ssm-control" type="button" data-ssm-model-category-toggle><span>' + esc(model.category) + '</span><i class="bi bi-chevron-down"></i></button><div class="ssm-category-pop"' + (state.modelCategoryOpen ? '' : ' hidden') + '><div class="ssm-tree-search"><i class="bi bi-search"></i><input placeholder="搜索数据分类" data-ssm-model-category-search></div><button type="button" data-ssm-model-category="公共目录"><i class="bi bi-folder-fill"></i> 公共目录</button><button type="button" data-ssm-category-parent><i class="bi bi-folder-fill"></i> 我的目录</button><button class="child" type="button" data-ssm-model-category="我的目录 / 物流履约"><i class="bi bi-folder2"></i> 物流履约</button><button class="child" type="button" data-ssm-model-category="我的目录 / 客户经营"><i class="bi bi-folder2"></i> 客户经营</button><button class="child" type="button" data-ssm-model-category="我的目录 / 财务结算"><i class="bi bi-folder2"></i> 财务结算</button><div class="ssm-category-empty" hidden>未找到匹配的分类</div></div></div>';
  }

  function builtinAttr(key) {
    return builtinModelAttrs.filter(function (item) { return item.key === key; })[0];
  }

  function customAttr(id) {
    return model.attrs.filter(function (item) { return item.id === id; })[0];
  }

  function selectedAttr() {
    var parts = state.modelSelected.split(':');
    return parts[0] === 'builtin' ? { kind: 'builtin', value: builtinAttr(parts[1]) } : { kind: 'custom', value: customAttr(parts[1]) };
  }

  function modelField(label, value, options) {
    options = options || {};
    var required = options.required ? '<span>*</span> ' : '';
    var selection = options.configKey ? 'builtin:' + options.configKey : '';
    var control;
    if (options.textarea) control = '<textarea class="ssm-control" data-ssm-model-field="' + options.field + '">' + esc(value) + '</textarea>';
    else if (options.select) control = '<select class="ssm-control" data-ssm-model-field="' + options.field + '">' + options.select.map(function (item) { return '<option' + (item === value ? ' selected' : '') + '>' + esc(item) + '</option>'; }).join('') + '</select>';
    else if (options.category) control = modelCategoryPickerHtml();
    else control = '<input class="ssm-control" value="' + esc(value) + '" data-ssm-model-field="' + (options.field || '') + '"' + (options.disabled ? ' disabled' : '') + '>';
    return '<div class="ssm-model-field' + (options.wide ? ' wide' : '') + (selection ? ' configurable' : '') + (state.modelSelected === selection ? ' active' : '') + '"' + (selection ? ' data-ssm-model-select="' + selection + '"' : '') + '><label>' + required + label + '</label>' + control + '</div>';
  }

  function customFieldHtml(attr) {
    var control;
    if (attr.inputType === '文本域') control = '<textarea class="ssm-control" disabled>' + esc(attr.example || '请输入' + attr.label) + '</textarea>';
    else if (attr.inputType === '下拉框') control = '<select class="ssm-control" disabled><option>' + esc(attr.example || '请选择') + '</option></select>';
    else control = '<input class="ssm-control" disabled value="' + esc(attr.example || '') + '" placeholder="请输入' + esc(attr.label) + '">';
    return '<div class="ssm-model-field configurable ssm-custom-field' + (state.modelSelected === 'custom:' + attr.id ? ' active' : '') + '" data-ssm-model-select="custom:' + attr.id + '"><label>' + (attr.required === '是' ? '<span>*</span> ' : '') + esc(attr.label) + '</label>' + control + '</div>';
  }

  function scopePickerHtml(scopes) {
    var all = ['API属性', '数据集属性', '库表属性'];
    return '<div class="ssm-scope-picker"><button class="ssm-scope-control" type="button" data-ssm-scope-toggle><span class="ssm-scope-tags">' + (scopes.length ? scopes.map(function (item) { return '<em>' + esc(item) + '<i class="bi bi-x"></i></em>'; }).join('') : '<span class="placeholder">请选择属性范围</span>') + '</span><i class="bi bi-chevron-down"></i></button><div class="ssm-scope-pop"' + (state.modelScopeOpen ? '' : ' hidden') + '>' + all.map(function (item) { return '<button type="button" data-ssm-scope-option="' + item + '"><i class="bi ' + (scopes.indexOf(item) > -1 ? 'bi-check-square-fill' : 'bi-square') + '"></i>' + item + '</button>'; }).join('') + '</div></div>';
  }

  function attrEditorHtml() {
    var selected = selectedAttr();
    var attr = selected.value;
    if (!attr) return '<div class="ssm-panel-title">数据模型配置</div>';
    if (selected.kind === 'builtin') {
      return '<div class="ssm-panel-title">数据模型配置</div><div class="ssm-attr-form">' +
        '<label><span>*</span> 名称</label><input class="ssm-control" value="' + esc(attr.label) + '" disabled>' +
        '<label><span>*</span> 英文名</label><input class="ssm-control" value="' + esc(attr.name) + '" disabled>' +
        '<label><span>*</span> 属性范围</label>' + scopePickerHtml(attr.scopes) + '</div>';
    }
    return '<div class="ssm-panel-title">数据模型配置</div><div class="ssm-attr-form">' +
      '<label><span>*</span> 名称</label><div class="ssm-input-clear"><input class="ssm-control" data-ssm-attr-field="label" value="' + esc(attr.label) + '"><i class="bi bi-x-circle-fill"></i></div>' +
      '<label><span>*</span> 英文名</label><input class="ssm-control" data-ssm-attr-field="name" value="' + esc(attr.name) + '">' +
      '<label><span>*</span> 属性范围</label>' + scopePickerHtml(attr.scopes) +
      '<label><span>*</span> 表单类型</label><select class="ssm-control" data-ssm-attr-field="inputType"><option' + (attr.inputType === '文本框' ? ' selected' : '') + '>文本框</option><option' + (attr.inputType === '文本域' ? ' selected' : '') + '>文本域</option><option' + (attr.inputType === '下拉框' ? ' selected' : '') + '>下拉框</option></select>' +
      '<label><span>*</span> 是否必填</label><select class="ssm-control" data-ssm-attr-field="required"><option value="">请选择</option><option' + (attr.required === '否' ? ' selected' : '') + '>否</option><option' + (attr.required === '是' ? ' selected' : '') + '>是</option></select>' +
      (attr.inputType === '下拉框' ? '<label><span>*</span> 选项数据</label><textarea class="ssm-control ssm-option-values" maxlength="1000" data-ssm-attr-field="optionValues" placeholder="多个选项用中文分号(；)或英文分号(;)隔开，1000个字符以内；例如：1级；2级；">' + esc(attr.optionValues || '') + '</textarea>' : '<label>数据长度</label><input class="ssm-control" type="number" min="0" data-ssm-attr-field="length" value="' + esc(attr.length || 0) + '">') +
      '<div></div><button class="btn btn-primary ssm-attr-save" type="button" data-ssm-attr-save><i class="bi bi-check2-circle"></i> 保存</button></div>';
  }

  function refreshModelEditor() {
    var aside = root.querySelector('.ssm-model-aside');
    if (aside) aside.innerHTML = attrEditorHtml();
    root.querySelectorAll('[data-ssm-model-select]').forEach(function (field) { field.classList.toggle('active', field.dataset.ssmModelSelect === state.modelSelected); });
  }

  function renderModelPage() {
    root.innerHTML = '<div class="ssm-model-page"><section class="ssm-model-main"><div class="ssm-panel-title">数据模型配置</div><button class="ssm-toolbar-btn ssm-model-add" type="button" data-ssm-attr-add><i class="bi bi-plus-circle"></i> 新增</button><div class="ssm-model-scroll"><div class="ssm-model-form">' +
      modelField('数据编码', model.code, { disabled: true }) + modelField('数据名称', model.name, { required: true, field: 'name', configKey: 'name' }) + modelField('英文名称', model.enName, { field: 'enName', configKey: 'enName' }) + modelField('数据摘要', model.summary, { textarea: true, field: 'summary', wide: true, configKey: 'summary' }) +
      modelField('版本', model.version, { disabled: true }) + modelField('数据分类', model.category, { required: true, category: true, configKey: 'category' }) + modelField('数据领域', model.domain, { required: true, field: 'domain', select: domainRows.map(function (item) { return item.name; }), configKey: 'domain' }) + modelField('上架时间', model.shelfTime, { disabled: true }) + modelField('更新时间', model.updateTime, { disabled: true }) + modelField('质量评分', model.quality, { disabled: true }) + modelField('数据量', model.dataCount, { disabled: true }) + modelField('浏览量', model.browseCount, { disabled: true }) + modelField('推送量', model.pushCount, { disabled: true }) + modelField('调用量', model.callCount, { disabled: true }) + modelField('管理单位', model.unit, { field: 'unit', configKey: 'unit' }) + modelField('数据来源', model.source, { disabled: true }) + modelField('联系电话', model.phone, { field: 'phone', configKey: 'phone' }) + modelField('更新频率', model.frequency, { field: 'frequency', select: ['次/秒', '次/分', '次/时', '次/日'], configKey: 'frequency' }) + modelField('申请量', model.applyCount, { disabled: true }) + model.attrs.map(customFieldHtml).join('') +
      '</div></div></section><aside class="ssm-model-aside">' + attrEditorHtml() + '</aside></div>';
  }

  function importModalHtml(kind) {
    return '<div class="ssm-modal-mask" data-ssm-modal><div class="ssm-modal ssm-import-modal"><div class="ssm-modal-head"><h3>导入</h3><button type="button" data-ssm-modal-close><i class="bi bi-x-lg"></i></button></div><div class="ssm-modal-body"><div class="ssm-modal-row"><label><span>*</span> 文件</label><label class="ssm-upload"><input type="file" accept=".xlsx,.xls,.csv" data-ssm-import-file><i class="bi bi-upload"></i><em data-ssm-file-name>请选择文件</em></label></div><div class="ssm-modal-row"><label><span>*</span> 导入机制</label><select class="ssm-control" data-ssm-import-mode><option value="">请选择</option><option>全部覆盖</option><option>更新+新增</option></select></div></div><div class="ssm-modal-footer"><button class="btn btn-outline" type="button" data-ssm-modal-close><i class="bi bi-x-circle"></i> 取消</button><button class="btn btn-primary" type="button" data-ssm-import-confirm="' + kind + '"><i class="bi bi-check2-circle"></i> 确定</button></div></div></div>';
  }

  function domainModalHtml(row) {
    row = row || {};
    return '<div class="ssm-modal-mask" data-ssm-modal><div class="ssm-modal"><div class="ssm-modal-head"><h3>' + (row.id ? '修改' : '新增') + '</h3><button type="button" data-ssm-modal-close><i class="bi bi-x-lg"></i></button></div><div class="ssm-modal-body"><div class="ssm-modal-row"><label><span>*</span> 编码</label><input class="ssm-control" data-ssm-domain-field="code" value="' + esc(row.code || '') + '" placeholder="100个字符以内"></div><div class="ssm-modal-row"><label><span>*</span> 名称</label><input class="ssm-control" data-ssm-domain-field="name" value="' + esc(row.name || '') + '" placeholder="100个字符以内"></div><div class="ssm-modal-row"><label>描述</label><div class="ssm-textarea-wrap"><textarea class="ssm-control" maxlength="200" data-ssm-domain-field="desc" placeholder="200个字符以内">' + esc(row.desc || '') + '</textarea><em>' + String(row.desc || '').length + ' / 200</em></div></div></div><div class="ssm-modal-footer"><button class="btn btn-outline" type="button" data-ssm-modal-close><i class="bi bi-x-circle"></i> 取消</button><button class="btn btn-primary" type="button" data-ssm-domain-save="' + (row.id || '') + '"><i class="bi bi-check2-circle"></i> 确定</button></div></div></div>';
  }

  function sdkModalHtml(row) {
    row = row || {};
    return '<div class="ssm-modal-mask" data-ssm-modal><div class="ssm-modal"><div class="ssm-modal-head"><h3>' + (row.id ? '修改' : '新增') + '</h3><button type="button" data-ssm-modal-close><i class="bi bi-x-lg"></i></button></div><div class="ssm-modal-body"><div class="ssm-modal-row"><label><span>*</span> SDK名称</label><input class="ssm-control" data-ssm-sdk-field="name" value="' + esc(row.name || '') + '" placeholder="50个字符以内"></div><div class="ssm-modal-row"><label><span>*</span> Jar包</label><label class="ssm-upload"><input type="file" accept=".jar" data-ssm-sdk-file><i class="bi bi-upload"></i><em data-ssm-file-name>' + esc(row.jar || '请选择文件') + '</em></label></div><div class="ssm-modal-row"><label><span>*</span> Java类名</label><input class="ssm-control" data-ssm-sdk-field="className" value="' + esc(row.className || '') + '" placeholder="100个字符以内"></div><div class="ssm-modal-row"><label>描述</label><div class="ssm-textarea-wrap"><textarea class="ssm-control" maxlength="500" data-ssm-sdk-field="desc" placeholder="500个字符以内">' + esc(row.desc || '') + '</textarea><em>' + String(row.desc || '').length + ' / 500</em></div></div></div><div class="ssm-modal-footer"><button class="btn btn-outline" type="button" data-ssm-modal-close><i class="bi bi-x-circle"></i> 取消</button><button class="btn btn-primary" type="button" data-ssm-sdk-save="' + (row.id || '') + '" data-current-jar="' + esc(row.jar || '') + '"><i class="bi bi-check2-circle"></i> 确定</button></div></div></div>';
  }

  function appendModal(html) { root.insertAdjacentHTML('beforeend', html); }
  function closeModal() { var modal = root.querySelector('[data-ssm-modal]'); if (modal) modal.remove(); }

  function saveClass() {
    var code = root.querySelector('[data-ssm-class-field="code"]').value.trim();
    var name = root.querySelector('[data-ssm-class-field="name"]').value.trim();
    var desc = root.querySelector('[data-ssm-class-field="desc"]').value.trim();
    var needsParent = state.classNew || !!classById(state.classSelected).parentId;
    if (!code || !name || (needsParent && !state.classParentId)) { toast('请填写分类编码、分类名称并选择父级分类', 'warning'); return; }
    if (state.classNew) {
      var id = 'class-' + Date.now();
      classRows.push({ id: id, parentId: state.classParentId, code: code, name: name, desc: desc });
      state.classSelected = id;
      state.classNew = false;
    } else {
      var item = classById(state.classSelected);
      item.code = code; item.name = name; if (needsParent) item.parentId = state.classParentId; item.desc = desc;
    }
    renderClassPage();
    toast('分类信息已保存', 'success');
  }

  function saveDomain(id) {
    var code = root.querySelector('[data-ssm-domain-field="code"]').value.trim();
    var name = root.querySelector('[data-ssm-domain-field="name"]').value.trim();
    var desc = root.querySelector('[data-ssm-domain-field="desc"]').value.trim();
    if (!code || !name) { toast('请填写编码和名称', 'warning'); return; }
    if (id) {
      var row = domainRows.filter(function (item) { return item.id === Number(id); })[0];
      row.code = code; row.name = name; row.desc = desc; row.time = nowText();
    } else domainRows.unshift({ id: Date.now(), code: code, name: name, desc: desc, operator: '数据服务管理员', time: nowText() });
    closeModal(); renderDomainPage(); toast('数据领域已保存', 'success');
  }

  function saveSdk(id) {
    var name = root.querySelector('[data-ssm-sdk-field="name"]').value.trim();
    var className = root.querySelector('[data-ssm-sdk-field="className"]').value.trim();
    var desc = root.querySelector('[data-ssm-sdk-field="desc"]').value.trim();
    var file = root.querySelector('[data-ssm-sdk-file]').files[0];
    var button = root.querySelector('[data-ssm-sdk-save]');
    var jar = file ? file.name : button.dataset.currentJar;
    if (!name || !jar || !className) { toast('请填写 SDK名称、Jar包和Java类名', 'warning'); return; }
    if (id) {
      var row = sdkRows.filter(function (item) { return item.id === Number(id); })[0];
      row.name = name; row.jar = jar; row.className = className; row.desc = desc; row.time = nowText();
    } else sdkRows.unshift({ id: Date.now(), name: name, jar: jar, className: className, desc: desc, operator: '数据服务管理员', time: nowText() });
    closeModal(); renderSdkPage(); toast('SDK信息已保存', 'success');
  }

  function deleteDomain(id) {
    confirmAction('确认删除该数据领域吗？', function () { domainRows = domainRows.filter(function (row) { return row.id !== id; }); renderDomainPage(); toast('数据领域已删除', 'success'); });
  }

  function deleteSdk(ids) {
    if (!ids.length) { toast('请先选择需要删除的 SDK', 'warning'); return; }
    confirmAction('确认删除已选择的 ' + ids.length + ' 个 SDK 吗？', function () { sdkRows = sdkRows.filter(function (row) { return ids.indexOf(row.id) === -1; }); state.sdkSelected.clear(); renderSdkPage(); toast('SDK已删除', 'success'); });
  }

  function saveAttr() {
    var selected = selectedAttr();
    if (selected.kind !== 'custom' || !selected.value) return;
    var attr = selected.value;
    root.querySelectorAll('[data-ssm-attr-field]').forEach(function (field) { attr[field.dataset.ssmAttrField] = field.type === 'number' ? Number(field.value) : field.value.trim(); });
    if (!attr.label || !attr.name || !attr.scopes.length || !attr.inputType || !attr.required || (attr.inputType === '下拉框' && !attr.optionValues)) { toast('请完整填写属性配置', 'warning'); return; }
    state.modelDraftNewId = '';
    model.updateTime = nowText();
    renderModelPage();
    toast('属性配置已保存', 'success');
  }

  function onClick(event) {
    var target = event.target.closest('button, [data-ssm-model-select], [data-ssm-model-category], [data-ssm-modal-close]');
    if (!target) return;
    if (target.hasAttribute('data-ssm-class-toggle')) { state.classExpanded = !state.classExpanded; renderClassPage(); return; }
    if (target.hasAttribute('data-ssm-class-select')) { state.classSelected = target.dataset.ssmClassSelect; state.classNew = false; state.classParentId = classById(state.classSelected).parentId; state.classParentOpen = false; renderClassPage(); return; }
    if (target.hasAttribute('data-ssm-class-new')) { state.classNew = true; state.classParentId = state.classSelected; state.classParentOpen = false; renderClassPage(); return; }
    if (target.hasAttribute('data-ssm-class-parent-toggle')) { state.classParentOpen = !state.classParentOpen; renderClassPage(); return; }
    if (target.hasAttribute('data-ssm-class-parent-clear')) { state.classParentId = ''; state.classParentOpen = false; renderClassPage(); return; }
    if (target.hasAttribute('data-ssm-class-parent')) { state.classParentId = target.dataset.ssmClassParent; state.classParentOpen = false; state.classParentSearch = ''; renderClassPage(); return; }
    if (target.hasAttribute('data-ssm-class-save')) { saveClass(); return; }
    if (target.hasAttribute('data-ssm-class-delete')) {
      if (state.classNew) { state.classNew = false; renderClassPage(); return; }
      var selectedId = state.classSelected;
      confirmAction('确认删除该数据分类吗？', function () { classRows = classRows.filter(function (item) { return item.id !== selectedId && item.parentId !== selectedId; }); state.classSelected = 'mine'; renderClassPage(); toast('数据分类已删除', 'success'); });
      return;
    }
    if (target.hasAttribute('data-ssm-import')) { appendModal(importModalHtml(target.dataset.ssmImport)); return; }
    if (target.hasAttribute('data-ssm-export')) {
      if (target.dataset.ssmExport === 'class') downloadCsv('数据分类.csv', [['分类编码', '分类名称', '父级分类', '分类描述']].concat(classRows.map(function (row) { return [row.code, row.name, row.parentId ? classById(row.parentId).name : '', row.desc]; })));
      else downloadCsv('数据领域.csv', [['编码', '名称', '描述', '操作者', '修改时间']].concat(domainRows.map(function (row) { return [row.code, row.name, row.desc, row.operator, row.time]; })));
      return;
    }
    if (target.hasAttribute('data-ssm-modal-close')) { closeModal(); return; }
    if (target.hasAttribute('data-ssm-import-confirm')) {
      var file = root.querySelector('[data-ssm-import-file]').files[0];
      var mechanism = root.querySelector('[data-ssm-import-mode]').value;
      if (!file || !mechanism) { toast('请选择文件和导入机制', 'warning'); return; }
      closeModal(); toast('文件已按“' + mechanism + '”方式导入', 'success'); return;
    }
    if (target.hasAttribute('data-ssm-domain-query')) { state.domainKeyword = state.domainDraft.trim(); renderDomainPage(); return; }
    if (target.hasAttribute('data-ssm-domain-sort')) { state.domainSort = target.dataset.ssmDomainSort; renderDomainPage(); return; }
    if (target.hasAttribute('data-ssm-domain-add')) { appendModal(domainModalHtml()); return; }
    if (target.hasAttribute('data-ssm-domain-edit')) { appendModal(domainModalHtml(domainRows.filter(function (row) { return row.id === Number(target.dataset.ssmDomainEdit); })[0])); return; }
    if (target.hasAttribute('data-ssm-domain-delete')) { deleteDomain(Number(target.dataset.ssmDomainDelete)); return; }
    if (target.hasAttribute('data-ssm-domain-save')) { saveDomain(target.dataset.ssmDomainSave); return; }
    if (target.hasAttribute('data-ssm-sdk-query')) { state.sdkKeyword = state.sdkDraft.trim(); state.sdkSelected.clear(); renderSdkPage(); return; }
    if (target.hasAttribute('data-ssm-sdk-add')) { appendModal(sdkModalHtml()); return; }
    if (target.hasAttribute('data-ssm-sdk-edit')) { appendModal(sdkModalHtml(sdkRows.filter(function (row) { return row.id === Number(target.dataset.ssmSdkEdit); })[0])); return; }
    if (target.hasAttribute('data-ssm-sdk-delete')) { deleteSdk([Number(target.dataset.ssmSdkDelete)]); return; }
    if (target.hasAttribute('data-ssm-sdk-batch-delete')) { deleteSdk(Array.from(state.sdkSelected)); return; }
    if (target.hasAttribute('data-ssm-sdk-save')) { saveSdk(target.dataset.ssmSdkSave); return; }
    if (target.hasAttribute('data-ssm-attr-add')) {
      if (state.modelDraftNewId) { toast('请先保存新增的数据！', 'warning'); return; }
      var attrId = 'attr-' + Date.now();
      model.attrs.push({ id: attrId, label: '新增属性', name: '', scopes: [], inputType: '文本框', required: '', length: 0, example: '' });
      state.modelSelected = 'custom:' + attrId; state.modelDraftNewId = attrId; state.modelScopeOpen = false; renderModelPage(); return;
    }
    if (target.hasAttribute('data-ssm-model-select')) {
      var selection = target.dataset.ssmModelSelect;
      if (state.modelDraftNewId && selection !== 'custom:' + state.modelDraftNewId) { toast('请先保存新增的数据！', 'warning'); return; }
      state.modelSelected = selection; state.modelScopeOpen = false; refreshModelEditor(); return;
    }
    if (target.hasAttribute('data-ssm-scope-toggle')) { state.modelScopeOpen = !state.modelScopeOpen; refreshModelEditor(); return; }
    if (target.hasAttribute('data-ssm-scope-option')) {
      var current = selectedAttr().value;
      var scope = target.dataset.ssmScopeOption;
      var scopeIndex = current.scopes.indexOf(scope);
      if (scopeIndex > -1) current.scopes.splice(scopeIndex, 1); else current.scopes.push(scope);
      state.modelScopeOpen = true; refreshModelEditor(); return;
    }
    if (target.hasAttribute('data-ssm-attr-save')) { saveAttr(); return; }
    if (target.hasAttribute('data-ssm-model-category-toggle')) { state.modelSelected = 'builtin:category'; state.modelCategoryOpen = !state.modelCategoryOpen; renderModelPage(); return; }
    if (target.hasAttribute('data-ssm-model-category')) { model.category = target.dataset.ssmModelCategory; state.modelCategoryOpen = false; renderModelPage(); toast('数据分类已选择', 'success'); }
  }

  function onInput(event) {
    if (event.target.matches('[data-ssm-class-search]')) {
      var key = event.target.value.trim().toLowerCase();
      var visible = 0;
      root.querySelectorAll('[data-ssm-class-name]').forEach(function (row) { var show = !key || row.dataset.ssmClassName.toLowerCase().indexOf(key) > -1; row.style.display = show ? '' : 'none'; if (show) visible += 1; });
      var visibleChild = Array.prototype.some.call(root.querySelectorAll('.ssm-tree-row.child'), function (row) { return row.style.display !== 'none'; });
      var mineRow = root.querySelector('[data-ssm-class-select="mine"]');
      var children = root.querySelector('.ssm-tree-children');
      if (key && visibleChild) { mineRow.style.display = ''; children.hidden = false; }
      else if (!key) children.hidden = !state.classExpanded;
      root.querySelector('[data-ssm-class-empty]').hidden = visible > 0;
    } else if (event.target.matches('[data-ssm-class-parent-search]')) {
      var parentKey = event.target.value.trim().toLowerCase();
      state.classParentSearch = event.target.value;
      var parentVisible = 0;
      root.querySelectorAll('[data-ssm-parent-name]').forEach(function (row) { var parentShow = !parentKey || row.dataset.ssmParentName.toLowerCase().indexOf(parentKey) > -1; row.style.display = parentShow ? '' : 'none'; if (parentShow) parentVisible += 1; });
      var childVisible = Array.prototype.some.call(root.querySelectorAll('.ssm-parent-option.child'), function (row) { return row.style.display !== 'none'; });
      var mineParent = root.querySelector('[data-ssm-class-parent="mine"]');
      if (parentKey && childVisible) mineParent.style.display = '';
      root.querySelector('[data-ssm-class-parent-empty]').hidden = parentVisible > 0;
    } else if (event.target.matches('[data-ssm-domain-keyword]')) state.domainDraft = event.target.value;
    else if (event.target.matches('[data-ssm-sdk-keyword]')) state.sdkDraft = event.target.value;
    else if (event.target.matches('[data-ssm-model-field]')) model[event.target.dataset.ssmModelField] = event.target.value;
    else if (event.target.matches('[data-ssm-attr-field]')) {
      var selected = selectedAttr();
      if (selected.kind === 'custom') selected.value[event.target.dataset.ssmAttrField] = event.target.type === 'number' ? Number(event.target.value) : event.target.value;
    }
    else if (event.target.matches('[data-ssm-model-category-search]')) {
      var term = event.target.value.trim().toLowerCase();
      var pop = event.target.closest('.ssm-category-pop');
      var count = 0;
      pop.querySelectorAll('button').forEach(function (button) { var showButton = !term || button.textContent.trim().toLowerCase().indexOf(term) > -1; button.style.display = showButton ? '' : 'none'; if (showButton) count += 1; });
      var childMatched = Array.prototype.some.call(pop.querySelectorAll('button.child'), function (button) { return button.style.display !== 'none'; });
      if (term && childMatched) { pop.querySelector('[data-ssm-category-parent]').style.display = ''; count += 1; }
      pop.querySelector('.ssm-category-empty').hidden = count > 0;
    }
  }

  function onChange(event) {
    if (event.target.matches('[data-ssm-sdk-check]')) { var id = Number(event.target.dataset.ssmSdkCheck); if (event.target.checked) state.sdkSelected.add(id); else state.sdkSelected.delete(id); }
    else if (event.target.matches('[data-ssm-sdk-check-all]')) { filteredSdks().forEach(function (row) { if (event.target.checked) state.sdkSelected.add(row.id); else state.sdkSelected.delete(row.id); }); renderSdkPage(); }
    else if (event.target.matches('[data-ssm-import-file], [data-ssm-sdk-file]')) { var label = event.target.closest('.ssm-upload').querySelector('[data-ssm-file-name]'); label.textContent = event.target.files[0] ? event.target.files[0].name : '请选择文件'; }
    else if (event.target.matches('[data-ssm-model-field]')) model[event.target.dataset.ssmModelField] = event.target.value;
    else if (event.target.matches('[data-ssm-attr-field]')) {
      var selected = selectedAttr();
      if (selected.kind !== 'custom') return;
      selected.value[event.target.dataset.ssmAttrField] = event.target.type === 'number' ? Number(event.target.value) : event.target.value;
      if (event.target.dataset.ssmAttrField === 'inputType') renderModelPage();
    }
  }

  function onKeydown(event) {
    if (event.key === 'Escape' && root.querySelector('[data-ssm-modal]')) { closeModal(); return; }
    if (event.key !== 'Enter') return;
    if (event.target.matches('[data-ssm-domain-keyword]')) { event.preventDefault(); state.domainKeyword = state.domainDraft.trim(); renderDomainPage(); }
    else if (event.target.matches('[data-ssm-sdk-keyword]')) { event.preventDefault(); state.sdkKeyword = state.sdkDraft.trim(); state.sdkSelected.clear(); renderSdkPage(); }
  }

  function render() {
    if (state.mode === 'class') renderClassPage();
    else if (state.mode === 'domain') renderDomainPage();
    else if (state.mode === 'model') renderModelPage();
    else renderSdkPage();
  }

  return {
    html: '<div class="page-service-system-management"></div>',
    init: function (mode) {
      root = document.querySelector('.page-service-system-management');
      if (!root) return;
      resetState(mode);
      root.addEventListener('click', onClick);
      root.addEventListener('input', onInput);
      root.addEventListener('change', onChange);
      root.addEventListener('keydown', onKeydown);
      render();
    }
  };
}());
