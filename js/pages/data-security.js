/** 数据资产 / 数据安全：规则目录、规则配置与表字段安全管理。 */
window.DP = window.DP || {};
DP.pages = DP.pages || {};
DP.pages.dataSecurity = (function () {
  var key = 'dp-data-security-v1';
  var algorithms = ['MD5', 'AES128', 'AES192', 'AES256', 'DES', '3DES', 'RC4', 'RC5', '国密SM2', '国密SM3', '国密SM4', 'RSA', '同态加密'];
  var layerNodes = [
    { id: 'business', name: '业务系统', parent: '' }, { id: 'crm', name: '客户服务系统', parent: 'business' },
    { id: 'order', name: '订单履约系统', parent: 'business' }, { id: 'supply', name: '供应链系统', parent: 'business' },
    { id: 'ods', name: 'ODS-贴源层', parent: '' }, { id: 'ods-order', name: '订单_ODS', parent: 'ods' },
    { id: 'ods-customer', name: '客户_ODS', parent: 'ods' }, { id: 'dwd', name: 'DWD-数据明细层', parent: '' },
    { id: 'dwd-trade', name: '交易明细_DWD', parent: 'dwd' }
  ];
  var dbs = [
    { id: 'db-order', name: 'order_ods', layer: 'ods-order' },
    { id: 'db-customer', name: 'customer_service_db', layer: 'crm' },
    { id: 'db-trade', name: 'trade_dwd', layer: 'dwd-trade' }
  ];
  var tables = [
    { id: 't-order', db: 'db-order', name: 'ods_order_info', alias: '订单信息表', fields: [
      { name: 'order_id', alias: '订单编号', type: 'VARCHAR', pk: 'P' },
      { name: 'customer_name', alias: '客户姓名', type: 'VARCHAR', pk: '' },
      { name: 'customer_phone', alias: '客户手机号', type: 'VARCHAR', pk: '' },
      { name: 'pay_account', alias: '支付账户', type: 'VARCHAR', pk: '' },
      { name: 'created_at', alias: '创建时间', type: 'TIMESTAMP', pk: '' }
    ] },
    { id: 't-customer', db: 'db-customer', name: 'customer_contact', alias: '客户联系人表', fields: [
      { name: 'customer_id', alias: '客户编号', type: 'BIGINT', pk: 'P' },
      { name: 'real_name', alias: '客户姓名', type: 'VARCHAR', pk: '' },
      { name: 'mobile', alias: '手机号', type: 'VARCHAR', pk: '' },
      { name: 'id_card', alias: '身份证号', type: 'VARCHAR', pk: '' },
      { name: 'email', alias: '电子邮箱', type: 'VARCHAR', pk: '' }
    ] },
    { id: 't-trade', db: 'db-trade', name: 'dwd_trade_detail', alias: '交易明细表', fields: [
      { name: 'trade_id', alias: '交易编号', type: 'VARCHAR', pk: 'P' },
      { name: 'supplier_account', alias: '供应商账户', type: 'VARCHAR', pk: '' },
      { name: 'settlement_amount', alias: '结算金额', type: 'DECIMAL', pk: '' },
      { name: 'updated_at', alias: '更新时间', type: 'TIMESTAMP', pk: '' }
    ] }
  ];
  var seed = {
    mask: [
      ['车牌号', '车牌号字段脱敏', '^\\S{2}(\\S+)\\S$', 'order'],
      ['地址', '地址字段脱敏', '^\\S{3}(\\S+)$', 'crm'],
      ['座机号', '座机号字段脱敏', '^\\d{3,4}(\\d+)$', 'crm'],
      ['身份证号', '身份证号字段脱敏', '^\\d{3}(\\d+)\\d{4}$', 'crm'],
      ['密码', '密码字段脱敏', '(.+)', 'crm'],
      ['银行卡号', '银行卡号字段脱敏', '^\\d{4}(\\d+)\\d{4}$', 'supply'],
      ['姓名', '姓名字段脱敏', '^(.)(.+)$', 'crm'],
      ['邮箱', '邮箱字段脱敏', '^\\S{2}(\\S+)@', 'crm'],
      ['手机号', '手机号字段脱敏', '^\\d{3}(\\d{4})\\d{4}$', 'crm']
    ].map(function (row, index) {
      return { id: 'sys-' + index, name: row[0], description: row[1], system: true, layer: row[3], type: 'regex', expression: row[2], symbol: 'fixed', replacement: '*', from: '', to: '', creator: '系统管理员', modified: '2026-09-10 10:30:00' };
    }).concat([
      { id: 'mask-customer', name: '客户联系人脱敏', description: '客户联系人手机号中间四位脱敏。', system: false, layer: 'crm', type: 'normal', expression: '', symbol: 'fixed', replacement: '*', from: '4', to: '7', creator: '数据管理员', modified: '2026-09-12 14:20:00' },
      { id: 'mask-supplier', name: '供应商账户脱敏', description: '供应商银行账户中间位脱敏。', system: false, layer: 'supply', type: 'normal', expression: '', symbol: 'random', replacement: '', from: '5', to: '12', randomStart: '0', randomEnd: '9', creator: '数据管理员', modified: '2026-09-13 09:15:00' }
    ]),
    crypto: ['RC4', '同态加密', '3DES', 'DES', 'AES192', 'AES128', 'MD5', '国密SM2'].map(function (name, index) {
      return { id: 'crypto-' + index, name: name === '国密SM2' || name === '同态加密' ? name : name + '加密', description: name + (name === '同态加密' ? '规则' : '加密规则'), layer: index < 4 ? 'order' : 'supply', algorithm: name, creator: '数据管理员', modified: '2026-09-12 15:0' + index + ':00' };
    }),
    management: [
      { id: 'm-order', table: 't-order', operator: '数据管理员', modified: '2026-09-12 16:10:00', fields: {
        customer_name: { mask: 'sys-6', exception: ['u-li'], crypto: '', decrypt: [] },
        customer_phone: { mask: 'sys-8', exception: [], crypto: 'crypto-5', decrypt: ['u-wang'] },
        pay_account: { mask: 'sys-5', exception: [], crypto: 'crypto-4', decrypt: ['u-wang'] }
      } },
      { id: 'm-customer', table: 't-customer', operator: '数据管理员', modified: '2026-09-13 11:25:00', fields: {
        mobile: { mask: 'sys-8', exception: [], crypto: 'crypto-5', decrypt: ['u-wang'] },
        id_card: { mask: 'sys-3', exception: [], crypto: 'crypto-4', decrypt: ['u-wang'] },
        email: { mask: 'sys-7', exception: [], crypto: '', decrypt: [] }
      } },
      { id: 'm-trade', table: 't-trade', operator: '数据管理员', modified: '2026-09-14 09:40:00', fields: {
        supplier_account: { mask: 'mask-supplier', exception: [], crypto: 'crypto-7', decrypt: ['u-chen'] }
      } }
    ]
  };
  var people = [
    { id: 'u-wang', name: '王鹏', dept: '数据治理部' }, { id: 'u-li', name: '李敏', dept: '客户服务部' },
    { id: 'u-chen', name: '陈晨', dept: '供应链部' }, { id: 'u-zhou', name: '周宁', dept: '供应链部' }
  ];
  var root, store, state;

  function copy(value) { return JSON.parse(JSON.stringify(value)); }
  function load() {
    try {
      var saved = JSON.parse(localStorage.getItem(key));
      if (saved && Array.isArray(saved.mask) && Array.isArray(saved.crypto) && Array.isArray(saved.management)) return saved;
    } catch (error) { /* 无效缓存回到初始数据。 */ }
    return copy(seed);
  }
  function save() { try { localStorage.setItem(key, JSON.stringify(store)); } catch (error) { /* 本次会话仍可使用。 */ } }
  function esc(value) { return String(value == null ? '' : value).replace(/[&<>"']/g, function (char) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]; }); }
  function btn(action, icon, label, cls, extra) {
    return '<button type="button" class="btn ' + (cls || 'btn-outline') + '" data-ds-action="' + action + '" ' + (extra || '') + '><i class="bi bi-' + icon + '"></i><span>' + label + '</span></button>';
  }
  function now() { var date = new Date(); return date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0') + ' ' + String(date.getHours()).padStart(2, '0') + ':' + String(date.getMinutes()).padStart(2, '0') + ':' + String(date.getSeconds()).padStart(2, '0'); }
  function table(id) { return tables.find(function (item) { return item.id === id; }); }
  function db(id) { return dbs.find(function (item) { return item.id === id; }); }
  function rule(kind, id) { return store[kind].find(function (item) { return item.id === id; }); }
  function layer(id) { return layerNodes.find(function (item) { return item.id === id; }); }
  function path(id) {
    var names = [], seen = new Set(), item = layer(id);
    while (item && !seen.has(item.id)) { names.unshift(item.name); seen.add(item.id); item = layer(item.parent); }
    return names.join(' / ');
  }
  function tree(nodes, search, selected, action, option) {
    var query = search.trim().toLowerCase();
    function children(id) { return nodes.filter(function (node) { return node.parent === id; }); }
    function visible(node) { return !query || node.name.toLowerCase().includes(query) || children(node.id).some(visible); }
    function markup(node) {
      var kids = children(node.id).filter(visible), open = !!query || state.expanded.has(node.id);
      return '<li><div class="ds-tree-line' + (selected === node.id ? ' active' : '') + '">' +
        (kids.length ? '<button type="button" class="ds-tree-toggle" data-ds-action="toggle-node" data-id="' + esc(node.id) + '" aria-label="' + (open ? '收起' : '展开') + esc(node.name) + '"><i class="bi bi-chevron-right"></i></button>' : '<span class="ds-tree-gap"></span>') +
        '<button type="button" class="ds-tree-node" data-ds-action="' + action + '" data-id="' + esc(node.id) + '" title="' + esc(node.path || node.name) + '"><i class="bi bi-' + (kids.length ? 'folder2' : 'file-earmark-text') + '"></i><span>' + esc(node.name) + '</span></button></div>' +
        (kids.length && open ? '<ul>' + kids.map(markup).join('') + '</ul>' : '') + '</li>';
    }
    var roots = nodes.filter(function (node) { return !node.parent || !nodes.some(function (item) { return item.id === node.parent; }); }).filter(visible);
    return roots.length ? '<ul class="ds-tree">' + roots.map(markup).join('') + '</ul>' : '<div class="ds-empty"><i class="bi bi-search"></i><span>' + (option || '没有匹配的目录') + '</span></div>';
  }
  function ruleNodes() {
    if (state.mode === 'mask') {
      return [{ id: 'system', name: '系统规则', parent: '' }, { id: 'custom', name: '业务系统', parent: '' }]
        .concat(store.mask.map(function (item) { return { id: item.id, name: item.name, parent: item.system ? 'system' : 'custom' }; }));
    }
    return [{ id: 'custom', name: '业务系统', parent: '' }].concat(store.crypto.map(function (item) { return { id: item.id, name: item.name, parent: 'custom' }; }));
  }
  function managementNodes() {
    return layerNodes.filter(function (item) { return ['business', 'crm', 'order', 'supply', 'ods', 'ods-order', 'ods-customer', 'dwd', 'dwd-trade'].includes(item.id); })
      .map(function (item) { return { id: item.id, parent: item.parent, name: item.name, path: path(item.id) }; });
  }
  function side() {
    var nodes = state.mode === 'management' ? managementNodes() : ruleNodes();
    return '<aside class="ds-side"><div class="ds-side-search"><input class="ds-control" type="search" data-ds-input="tree-draft" value="' + esc(state.treeDraft) + '" placeholder="目录关键词搜索" aria-label="目录关键词搜索">' +
      btn('query-tree', 'search', '查询', 'btn-primary') + '</div><div class="ds-side-tree">' +
      tree(nodes, state.treeQuery, state.selected, 'select-tree', '没有匹配的目录') + '</div></aside>';
  }
  function notice() { return state.message ? '<div class="ds-notice"><i class="bi bi-info-circle"></i><span>' + esc(state.message) + '</span>' + btn('clear-message', 'x-lg', '关闭') + '</div>' : ''; }
  function visibleRules() {
    var rows = store[state.mode], selected = state.selected;
    if (selected === 'system') rows = rows.filter(function (item) { return item.system; });
    else if (selected === 'custom') rows = rows.filter(function (item) { return !item.system; });
    else rows = rows.filter(function (item) { return item.id === selected; });
    var query = state.keyword.toLowerCase();
    return rows.filter(function (item) { return !query || (item.name + ' ' + item.description).toLowerCase().includes(query); });
  }
  function ruleList() {
    var rows = visibleRules(), selected = state.checked;
    return '<main class="ds-main"><header class="ds-toolbar">' + btn('new', 'plus-lg', '新建', 'btn-primary') +
      btn('bulk-delete', 'trash', '删除', 'btn-danger', !selected.size ? 'disabled' : '') +
      '<div class="ds-spacer"></div><input class="ds-control ds-keyword" type="search" data-ds-input="keyword-draft" value="' + esc(state.keywordDraft) + '" placeholder="请输入规则名称" aria-label="规则名称关键词">' +
      btn('query-list', 'search', '查询', 'btn-primary') + '</header><div class="ds-table-wrap"><table class="ds-table"><thead><tr>' +
      '<th class="ds-check"><input type="checkbox" data-ds-change="check-all" aria-label="全选当前列表" ' + (rows.length && rows.every(function (item) { return selected.has(item.id); }) ? 'checked' : '') + '></th>' +
      '<th>规则名称</th><th>描述</th><th>创建人</th><th>修改时间</th><th>操作</th></tr></thead><tbody>' +
      (rows.length ? rows.map(function (item) {
        return '<tr><td><input type="checkbox" data-ds-change="check-row" data-id="' + esc(item.id) + '" aria-label="选择' + esc(item.name) + '" ' + (selected.has(item.id) ? 'checked' : '') + ' ' + (item.system ? 'disabled' : '') + '></td>' +
          '<td>' + esc(item.name) + '</td><td>' + esc(item.description) + '</td><td>' + esc(item.creator) + '</td><td>' + esc(item.modified) + '</td><td class="ds-actions">' +
          btn('edit', 'pencil-square', '编辑', 'btn-outline', 'data-id="' + esc(item.id) + '"') +
          (item.system ? '' : btn('delete', 'trash', '删除', 'btn-outline', 'data-id="' + esc(item.id) + '"')) + '</td></tr>';
      }).join('') : '<tr><td colspan="6"><div class="ds-empty">没有找到匹配的规则</div></td></tr>') +
      '</tbody></table></div><footer class="ds-count">显示第 ' + (rows.length ? '1' : '0') + ' 到第 ' + rows.length + ' 条记录，总共 ' + rows.length + ' 条记录</footer></main>';
  }
  function field(label, input, required, note) {
    return '<div class="ds-form-row"><label>' + (required ? '<b>*</b> ' : '') + label + '</label><div>' + input + (note ? '<small>' + note + '</small>' : '') + '</div></div>';
  }
  function layerPicker() {
    var draft = state.form, item = layer(draft.layer);
    return '<div class="ds-picker"><button type="button" class="ds-control ds-picker-trigger" data-ds-action="open-picker" data-picker="layer"><span>' + esc(item ? path(item.id) : '请选择业务分层') + '</span><i class="bi bi-chevron-down"></i></button>' +
      (state.picker === 'layer' ? '<div class="ds-pop"><input type="search" class="ds-control" data-ds-input="picker-query" value="' + esc(state.pickerQuery) + '" placeholder="搜索业务分层" aria-label="搜索业务分层"><div class="ds-pop-tree">' + tree(layerNodes.map(function (node) { return { id: node.id, parent: node.parent, name: node.name, path: path(node.id) }; }), state.pickerQuery, draft.layer, 'choose-layer', '没有匹配的业务分层') + '</div></div>' : '') + '</div>';
  }
  function algoPicker() {
    var draft = state.form, choices = algorithms.filter(function (name) { return name.toLowerCase().includes(state.pickerQuery.toLowerCase()); });
    return '<div class="ds-picker"><button type="button" class="ds-control ds-picker-trigger" data-ds-action="open-picker" data-picker="algorithm"><span>' + esc(draft.algorithm || '请选择加密算法') + '</span><i class="bi bi-chevron-down"></i></button>' +
      (state.picker === 'algorithm' ? '<div class="ds-pop"><input class="ds-control" type="search" data-ds-input="picker-query" value="' + esc(state.pickerQuery) + '" placeholder="搜索加密算法" aria-label="搜索加密算法"><div class="ds-options">' +
        (choices.length ? choices.map(function (name) { return '<button type="button" data-ds-action="choose-algorithm" data-id="' + esc(name) + '">' + esc(name) + '</button>'; }).join('') : '<div class="ds-empty">没有匹配的加密算法</div>') +
        '</div></div>' : '') + '</div>';
  }
  function ruleForm() {
    var item = state.form, mask = state.mode === 'mask', locked = !!item.system;
    var title = state.editId ? '编辑' : '新建';
    var body = field('规则名称', '<input class="ds-control" data-ds-input="form-name" maxlength="50" value="' + esc(item.name) + '" placeholder="请输入规则名称">', true, '50个字符以内') +
      field('业务分层', locked ? '<div class="ds-readonly">' + esc(path(item.layer)) + '</div>' : layerPicker(), true);
    if (mask) {
      body += field('规则类型', '<select class="ds-control" data-ds-change="rule-type" ' + (locked || state.editId ? 'disabled' : '') + '><option value="normal" ' + (item.type === 'normal' ? 'selected' : '') + '>普通规则</option><option value="regex" ' + (item.type === 'regex' ? 'selected' : '') + '>正则表达式</option></select>', true);
      body += field('规则表达式', item.type === 'normal' ?
        '<div class="ds-range">从 <input class="ds-control" type="number" min="1" data-ds-input="form-from" value="' + esc(item.from) + '" ' + (locked ? 'disabled' : '') + '> 到 <input class="ds-control" type="number" min="1" data-ds-input="form-to" value="' + esc(item.to) + '" ' + (locked ? 'disabled' : '') + '> 位替换</div>' :
        '<input class="ds-control" data-ds-input="form-expression" value="' + esc(item.expression) + '" placeholder="请输入正则表达式" ' + (locked ? 'disabled' : '') + '>', true,
        item.type === 'normal' ? '起止位置都留空时替换全部字符。' : '正则表达式中括号匹配的字符将被替换。');
      body += field('替换符号', '<select class="ds-control" data-ds-change="symbol" ' + (locked ? 'disabled' : '') + '><option value="fixed" ' + (item.symbol === 'fixed' ? 'selected' : '') + '>固定值</option><option value="random" ' + (item.symbol === 'random' ? 'selected' : '') + '>随机数字</option></select>', true);
      body += field(item.symbol === 'fixed' ? '替换值' : '随机范围', item.symbol === 'fixed' ?
        '<input class="ds-control" data-ds-input="form-replacement" value="' + esc(item.replacement) + '" placeholder="请输入替换值" ' + (locked ? 'disabled' : '') + '>' :
        '<div class="ds-range"><input class="ds-control" type="number" min="0" max="9" data-ds-input="form-random-start" value="' + esc(item.randomStart) + '"> - <input class="ds-control" type="number" min="0" max="9" data-ds-input="form-random-end" value="' + esc(item.randomEnd) + '"></div>', true);
    } else {
      body += field('规则类型', '<div class="ds-readonly">加密算法</div>', true);
      body += field('加密算法', algoPicker(), true);
    }
    body += field('描述', '<textarea class="ds-control" data-ds-input="form-description" maxlength="100" placeholder="请输入规则描述">' + esc(item.description) + '</textarea>', true, '100个字符以内');
    return '<main class="ds-main"><header class="ds-form-head"><h2><i class="bi bi-list-ul"></i>' + title + '</h2>' + btn('cancel', 'arrow-left', '返回') + '</header><div class="ds-form-body">' + body +
      '<div class="ds-form-buttons">' + btn('save', 'check-lg', '保存', 'btn-primary') + btn('cancel', 'x-lg', '取消') + '</div></div></main>';
  }
  function visibleManagement() {
    var rows = store.management, selected = state.selected, query = state.keyword.toLowerCase();
    if (selected) rows = rows.filter(function (item) {
      var info = table(item.table), current = info && layer(db(info.db).layer);
      while (current) { if (current.id === selected) return true; current = layer(current.parent); }
      return false;
    });
    return rows.filter(function (item) { var info = table(item.table); return info && (!query || (info.name + ' ' + info.alias + ' ' + db(info.db).name).toLowerCase().includes(query)); });
  }
  function counts(item) {
    var fields = Object.values(item.fields || {});
    return { mask: fields.filter(function (field) { return field.mask; }).length, crypto: fields.filter(function (field) { return field.crypto; }).length };
  }
  function managementList() {
    var rows = visibleManagement(), selected = state.checked;
    return '<main class="ds-main"><header class="ds-toolbar">' + btn('new', 'plus-lg', '新建', 'btn-primary') +
      btn('bulk-delete', 'trash', '删除', 'btn-danger', !selected.size ? 'disabled' : '') +
      '<div class="ds-spacer"></div><input class="ds-control ds-keyword" type="search" data-ds-input="keyword-draft" value="' + esc(state.keywordDraft) + '" placeholder="请输入表名称" aria-label="表名称关键词">' +
      btn('query-list', 'search', '查询', 'btn-primary') + '</header><div class="ds-table-wrap"><table class="ds-table ds-management-table"><thead><tr>' +
      '<th class="ds-check"><input type="checkbox" data-ds-change="check-all" aria-label="全选当前列表" ' + (rows.length && rows.every(function (item) { return selected.has(item.id); }) ? 'checked' : '') + '></th>' +
      '<th>表名称</th><th>表别名</th><th>数据库</th><th>脱敏设置</th><th>加密设置</th><th>操作者</th><th>修改时间</th><th>操作</th></tr></thead><tbody>' +
      (rows.length ? rows.map(function (item) {
        var info = table(item.table), count = counts(item);
        return '<tr><td><input type="checkbox" data-ds-change="check-row" data-id="' + esc(item.id) + '" aria-label="选择' + esc(info.name) + '" ' + (selected.has(item.id) ? 'checked' : '') + '></td>' +
          '<td>' + esc(info.name) + '</td><td>' + esc(info.alias) + '</td><td>' + esc(db(info.db).name) + '</td>' +
          '<td>' + (count.mask ? '已设置(' + count.mask + ')' : '未设置') + '</td><td>' + (count.crypto ? '已设置(' + count.crypto + ')' : '未设置') + '</td>' +
          '<td>' + esc(item.operator) + '</td><td>' + esc(item.modified) + '</td><td class="ds-actions">' +
          btn('edit', 'pencil-square', '编辑', 'btn-outline', 'data-id="' + esc(item.id) + '"') +
          btn('delete', 'trash', '删除', 'btn-outline', 'data-id="' + esc(item.id) + '"') + '</td></tr>';
      }).join('') : '<tr><td colspan="9"><div class="ds-empty">没有找到匹配的表安全配置</div></td></tr>') +
      '</tbody></table></div><footer class="ds-count">显示第 ' + (rows.length ? '1' : '0') + ' 到第 ' + rows.length + ' 条记录，总共 ' + rows.length + ' 条记录</footer></main>';
  }
  function dbPicker() {
    var chosen = db(state.form.db);
    var nodes = layerNodes.map(function (node) { return { id: node.id, parent: node.parent, name: node.name, path: path(node.id) }; })
      .concat(dbs.map(function (item) { return { id: item.id, parent: item.layer, name: item.name, path: path(item.layer) + ' / ' + item.name }; }));
    return '<div class="ds-picker"><button type="button" class="ds-control ds-picker-trigger" data-ds-action="open-picker" data-picker="database"><span>' + esc(chosen ? chosen.name : '请选择数据库') + '</span><i class="bi bi-chevron-down"></i></button>' +
      (state.picker === 'database' ? '<div class="ds-pop"><input class="ds-control" type="search" data-ds-input="picker-query" value="' + esc(state.pickerQuery) + '" placeholder="搜索数据库目录" aria-label="搜索数据库目录"><div class="ds-pop-tree">' + tree(nodes, state.pickerQuery, state.form.db, 'choose-database', '没有匹配的数据库目录') + '</div></div>' : '') + '</div>';
  }
  function tablePicker() {
    var choices = tables.filter(function (item) { return item.db === state.form.db && item.name.toLowerCase().includes(state.pickerQuery.toLowerCase()); });
    return '<div class="ds-picker"><button type="button" class="ds-control ds-picker-trigger" data-ds-action="open-picker" data-picker="table" ' + (!state.form.db ? 'disabled' : '') + '><span>' + esc(state.form.table ? table(state.form.table).name : '请选择脱敏表') + '</span><i class="bi bi-chevron-down"></i></button>' +
      (state.picker === 'table' ? '<div class="ds-pop"><input class="ds-control" type="search" data-ds-input="picker-query" value="' + esc(state.pickerQuery) + '" placeholder="搜索表名称" aria-label="搜索表名称"><div class="ds-options">' +
        (choices.length ? choices.map(function (item) { return '<button type="button" data-ds-action="choose-table" data-id="' + esc(item.id) + '">' + esc(item.name) + '</button>'; }).join('') : '<div class="ds-empty">没有匹配的表</div>') +
        '</div></div>' : '') + '</div>';
  }
  function pickerPortal() {
    if (!state.fieldPicker) return '';
    var kind = state.fieldPicker.kind, place = state.fieldPicker.place;
    var style = 'left:' + place.left + 'px;top:' + place.top + 'px;max-height:' + place.maxHeight + 'px;' +
      (place.above ? 'transform:translateY(-100%);' : '');
    var nodes = kind === 'mask' ?
      [{ id: 'unset', name: '未设置', parent: '' }, { id: 'system', name: '系统规则', parent: '' }, { id: 'custom', name: '业务系统', parent: '' }]
        .concat(store.mask.map(function (item) { return { id: item.id, name: item.name, parent: item.system ? 'system' : 'custom' }; })) :
      [{ id: 'unset', name: '未设置', parent: '' }, { id: 'custom', name: '业务系统', parent: '' }]
        .concat(store.crypto.map(function (item) { return { id: item.id, name: item.name, parent: 'custom' }; }));
    return '<div class="ds-field-pop" style="' + style + '"><div class="ds-field-pop-head"><span>' + (kind === 'mask' ? '脱敏规则' : '加密规则') + '</span>' + btn('close-field-picker', 'x-lg', '关闭') + '</div>' +
      '<input class="ds-control" type="search" data-ds-input="field-query" value="' + esc(state.fieldQuery) + '" placeholder="搜索规则名称" aria-label="搜索规则名称"><div class="ds-pop-tree">' +
      tree(nodes, state.fieldQuery, '', 'choose-field-rule', '没有匹配的规则') + '</div></div>';
  }
  function managementForm() {
    var draft = state.form, info = table(draft.table), editing = !!state.editId;
    var body = field('数据库', editing ? '<div class="ds-readonly">' + esc(db(draft.db).name) + '</div>' : dbPicker(), false) +
      field('脱敏表', editing ? '<div class="ds-readonly">' + esc(info.name) + '</div>' : tablePicker(), false);
    if (info) {
      body += '<div class="ds-field-title"><i class="bi bi-table"></i><span>' + esc(info.name) + '(' + esc(info.alias) + ')</span></div><div class="ds-field-table-wrap"><table class="ds-table ds-field-table"><thead><tr>' +
        '<th>别名</th><th>英文名称</th><th>数据类型</th><th>主键/外键</th><th>脱敏规则</th><th>脱敏例外</th><th>加密规则</th><th>解密权限</th></tr></thead><tbody>' +
        info.fields.map(function (col) {
          var fieldData = draft.fields[col.name] || { mask: '', exception: [], crypto: '', decrypt: [] };
          var maskRule = rule('mask', fieldData.mask), cryptoRule = rule('crypto', fieldData.crypto);
          return '<tr><td>' + esc(col.alias) + '</td><td>' + esc(col.name) + '</td><td>' + esc(col.type) + '</td><td>' + esc(col.pk) + '</td>' +
            '<td><button type="button" class="ds-cell-select" data-ds-action="open-field-picker" data-field="' + esc(col.name) + '" data-kind="mask">' + esc(maskRule ? maskRule.name : '未设置') + '<i class="bi bi-chevron-down"></i></button></td>' +
            '<td>' + btn('open-people', 'people', fieldData.exception.length ? '已设置(' + fieldData.exception.length + ')' : '未设置', 'btn-outline', 'data-field="' + esc(col.name) + '" data-kind="exception"') + '</td>' +
            '<td><button type="button" class="ds-cell-select" data-ds-action="open-field-picker" data-field="' + esc(col.name) + '" data-kind="crypto">' + esc(cryptoRule ? cryptoRule.name : '未设置') + '<i class="bi bi-chevron-down"></i></button></td>' +
            '<td>' + btn('open-people', 'people', fieldData.decrypt.length ? '已设置(' + fieldData.decrypt.length + ')' : '未设置', 'btn-outline', 'data-field="' + esc(col.name) + '" data-kind="decrypt"') + '</td></tr>';
        }).join('') + '</tbody></table></div>';
    }
    return '<main class="ds-main"><header class="ds-form-head"><h2><i class="bi bi-list-ul"></i>' + (editing ? '编辑' : '新建') + '</h2>' + btn('cancel', 'arrow-left', '返回') + '</header><div class="ds-management-form">' +
      body + '<div class="ds-form-buttons">' + btn('save', 'check-lg', '保存', 'btn-primary') + btn('cancel', 'x-lg', '取消') + '</div></div></main>';
  }
  function peopleModal() {
    if (!state.peopleModal) return '';
    var data = state.peopleModal, query = data.query.toLowerCase();
    var groups = [...new Set(people.map(function (item) { return item.dept; }))];
    var matchingGroups = groups.filter(function (group) {
      return !query || group.toLowerCase().includes(query) || data.tab === 'user' && people.some(function (item) { return item.dept === group && item.name.toLowerCase().includes(query); });
    });
    var options = matchingGroups.length ? '<ul class="ds-people-tree"><li><div class="ds-people-root"><i class="bi bi-folder2"></i>我的部门</div><ul>' +
      matchingGroups.map(function (group) {
        var members = people.filter(function (item) { return item.dept === group && (!query || group.toLowerCase().includes(query) || item.name.toLowerCase().includes(query)); });
        return '<li><label>' + (data.tab === 'department' ? '<input type="checkbox" data-ds-change="people-dept" data-id="' + esc(group) + '" ' +
          (people.filter(function (item) { return item.dept === group; }).every(function (item) { return data.ids.has(item.id); }) ? 'checked' : '') + '>' : '') +
          '<i class="bi bi-building"></i>' + esc(group) + '</label>' +
          (data.tab === 'user' ? '<ul>' + members.map(function (item) {
            return '<li><label><input type="checkbox" data-ds-change="people-user" data-id="' + esc(item.id) + '" ' +
              (data.ids.has(item.id) ? 'checked' : '') + '><i class="bi bi-person"></i>' + esc(item.name) + '</label></li>';
          }).join('') + '</ul>' : '') + '</li>';
      }).join('') + '</ul></li></ul>' : '<div class="ds-empty">没有匹配的部门或用户</div>';
    return '<div class="ds-modal-backdrop"><section class="ds-modal" role="dialog" aria-modal="true" aria-label="' + (data.kind === 'exception' ? '脱敏例外' : '解密权限') + '">' +
      '<header><h2>' + (data.kind === 'exception' ? '脱敏例外：添加到脱敏例外的用户，数据不脱敏' : '解密权限：添加的用户可查看解密后的数据') + '</h2>' + btn('close-people', 'x-lg', '关闭') + '</header>' +
      '<div class="ds-modal-body"><div class="ds-people-pane"><nav>' +
      btn('people-tab', 'building', '按部门', data.tab === 'department' ? 'btn-primary' : 'btn-outline', 'data-tab="department"') +
      btn('people-tab', 'person', '按用户', data.tab === 'user' ? 'btn-primary' : 'btn-outline', 'data-tab="user"') + '</nav>' +
      '<input class="ds-control" type="search" data-ds-input="people-query" value="' + esc(data.query) + '" placeholder="搜索部门或用户" aria-label="搜索部门或用户"><div class="ds-people-list">' +
      options + '</div></div><div class="ds-people-selected"><h3>已选择用户</h3><div class="ds-people-list">' +
      (data.ids.size ? people.filter(function (item) { return data.ids.has(item.id); }).map(function (item) { return '<div class="ds-selected-person"><span>' + esc(item.name) + ' · ' + esc(item.dept) + '</span>' + btn('remove-person', 'x-lg', '移除', 'btn-outline', 'data-id="' + esc(item.id) + '"') + '</div>'; }).join('') : '<div class="ds-empty">尚未选择用户</div>') +
      '</div></div></div><footer>' + btn('confirm-people', 'check-lg', '确定', 'btn-primary') + btn('close-people', 'x-lg', '取消') + '</footer></section></div>';
  }
  function render() {
    if (!root) return;
    var main = root.querySelector('.ds-main'), fieldTable = root.querySelector('.ds-field-table-wrap'), listTable = root.querySelector('.ds-table-wrap'), sideTree = root.querySelector('.ds-side-tree');
    var scroll = { mainTop: main ? main.scrollTop : 0, mainLeft: main ? main.scrollLeft : 0,
      fieldTop: fieldTable ? fieldTable.scrollTop : 0, fieldLeft: fieldTable ? fieldTable.scrollLeft : 0,
      listTop: listTable ? listTable.scrollTop : 0, listLeft: listTable ? listTable.scrollLeft : 0,
      sideTop: sideTree ? sideTree.scrollTop : 0 };
    root.innerHTML = notice() + '<div class="ds-layout">' + side() +
      (state.view === 'form' ? state.mode === 'management' ? managementForm() : ruleForm() : state.mode === 'management' ? managementList() : ruleList()) +
      '</div>' + (state.mode === 'management' && state.view === 'form' ? pickerPortal() : '') + peopleModal();
    main = root.querySelector('.ds-main'); fieldTable = root.querySelector('.ds-field-table-wrap'); listTable = root.querySelector('.ds-table-wrap'); sideTree = root.querySelector('.ds-side-tree');
    if (main) { main.scrollTop = scroll.mainTop; main.scrollLeft = scroll.mainLeft; }
    if (fieldTable) { fieldTable.scrollTop = scroll.fieldTop; fieldTable.scrollLeft = scroll.fieldLeft; }
    if (listTable) { listTable.scrollTop = scroll.listTop; listTable.scrollLeft = scroll.listLeft; }
    if (sideTree) sideTree.scrollTop = scroll.sideTop;
  }
  function fieldPlacement(target) {
    var rect = typeof target.getBoundingClientRect === 'function' ? target.getBoundingClientRect() : { left: 300, top: 160, bottom: 192 };
    var viewWidth = window.innerWidth || document.documentElement.clientWidth || 1280;
    var viewHeight = window.innerHeight || document.documentElement.clientHeight || 800;
    var width = Math.min(290, viewWidth - 16);
    var below = Math.max(0, viewHeight - rect.bottom - 8), above = Math.max(0, rect.top - 8);
    var openAbove = below < 220 && above > below;
    return {
      left: Math.round(Math.max(8, Math.min(rect.left, viewWidth - width - 8))),
      top: Math.round(openAbove ? rect.top - 4 : rect.bottom + 4),
      maxHeight: Math.round(Math.min(430, Math.max(120, openAbove ? above : below))),
      above: openAbove
    };
  }
  function startForm(id) {
    state.view = 'form'; state.editId = id || ''; state.picker = ''; state.pickerQuery = ''; state.fieldPicker = null;
    if (state.mode === 'management') {
      var item = id ? store.management.find(function (row) { return row.id === id; }) : null;
      state.form = item ? copy(item) : { id: '', table: '', db: '', fields: {}, operator: '数据管理员', modified: '' };
      if (item) state.form.db = table(item.table).db;
    } else {
      var existing = id ? rule(state.mode, id) : null;
      state.form = existing ? copy(existing) : state.mode === 'mask' ?
        { id: '', name: '', description: '', system: false, layer: '', type: 'normal', expression: '', symbol: 'fixed', replacement: '*', from: '', to: '', randomStart: '0', randomEnd: '9', creator: '数据管理员', modified: '' } :
        { id: '', name: '', description: '', layer: '', algorithm: '', creator: '数据管理员', modified: '' };
    }
    render();
  }
  function validForm() {
    var item = state.form;
    if (state.mode === 'management') {
      if (!item.db || !item.table) return '请选择数据库和脱敏表。';
      if (!Object.values(item.fields).some(function (field) { return field.mask || field.crypto; })) return '请至少为一个字段设置脱敏规则或加密规则。';
      return '';
    }
    if (!item.name.trim() || !item.layer || !item.description.trim()) return '请填写规则名称、业务分层和描述。';
    if (store[state.mode].some(function (row) { return row.id !== state.editId && row.name === item.name.trim(); })) return '规则名称已存在，请更换名称。';
    if (state.mode === 'crypto') return item.algorithm ? '' : '请选择加密算法。';
    if (item.type === 'regex' && !item.expression.trim()) return '请输入正则表达式。';
    if (item.type === 'normal' && ((item.from && !item.to) || (!item.from && item.to) || (item.from && item.to && Number(item.from) > Number(item.to)))) return '请填写有效的起止位置。';
    if (item.symbol === 'fixed' && !item.replacement) return '请输入替换值。';
    if (item.symbol === 'random' && (item.randomStart === '' || item.randomEnd === '' || Number(item.randomStart) > Number(item.randomEnd))) return '请填写有效的随机数字范围。';
    return '';
  }
  function saveForm() {
    var error = validForm(); if (error) { state.message = error; render(); return; }
    var item = state.form;
    if (state.mode === 'management') {
      if (!state.editId && store.management.some(function (row) { return row.table === item.table; })) { state.message = '该表已有安全配置，请通过编辑修改。'; render(); return; }
      item.id = state.editId || 'manage-' + Date.now();
      item.operator = '数据管理员'; item.modified = now();
    } else {
      item.id = state.editId || state.mode + '-' + Date.now();
      item.name = item.name.trim(); item.description = item.description.trim(); item.modified = now();
    }
    var rows = store[state.mode], index = rows.findIndex(function (row) { return row.id === state.editId; });
    if (index < 0) rows.unshift(copy(item)); else rows[index] = copy(item);
    save(); state.view = 'list'; state.form = null; state.editId = ''; state.message = '保存成功。'; state.checked.clear();
    render();
  }
  function remove(ids) {
    var rows = store[state.mode], targets = rows.filter(function (item) { return ids.includes(item.id) && !(state.mode === 'mask' && item.system); });
    if (!targets.length) { state.message = '请选择可删除的记录。'; render(); return; }
    var mode = state.mode;
    DP.confirm('确定删除选中的' + targets.length + '条记录吗？', { icon: 'danger', onOk: function () {
      if (state.mode !== mode) return;
      store[mode] = store[mode].filter(function (item) { return !targets.some(function (target) { return target.id === item.id; }); });
      if (mode === 'mask' || mode === 'crypto') {
        store.management.forEach(function (item) { Object.values(item.fields).forEach(function (field) {
          if (mode === 'mask' && ids.includes(field.mask)) { field.mask = ''; field.exception = []; }
          if (mode === 'crypto' && ids.includes(field.crypto)) { field.crypto = ''; field.decrypt = []; }
        }); });
      }
      if (ids.includes(state.selected)) state.selected = mode === 'mask' ? 'system' : 'custom';
      state.checked.clear(); state.message = '删除成功。'; save(); render();
    } });
  }
  function ensureField(name) {
    if (!state.form.fields[name]) state.form.fields[name] = { mask: '', exception: [], crypto: '', decrypt: [] };
    return state.form.fields[name];
  }
  function action(target) {
    var name = target.dataset.dsAction, id = target.dataset.id;
    if (name === 'clear-message') { state.message = ''; render(); }
    else if (name === 'query-tree') { state.treeQuery = state.treeDraft.trim(); render(); }
    else if (name === 'query-list') { state.keyword = state.keywordDraft.trim(); state.checked.clear(); render(); }
    else if (name === 'toggle-node') { state.expanded.has(id) ? state.expanded.delete(id) : state.expanded.add(id); render(); }
    else if (name === 'select-tree') { state.selected = id; state.checked.clear(); state.keyword = state.keywordDraft.trim(); render(); }
    else if (name === 'new') startForm('');
    else if (name === 'edit') startForm(id);
    else if (name === 'cancel') { state.view = 'list'; state.form = null; state.editId = ''; state.picker = ''; state.fieldPicker = null; state.message = ''; render(); }
    else if (name === 'save') saveForm();
    else if (name === 'delete') remove([id]);
    else if (name === 'bulk-delete') remove([...state.checked]);
    else if (name === 'open-picker') { state.picker = state.picker === target.dataset.picker ? '' : target.dataset.picker; state.pickerQuery = ''; render(); }
    else if (name === 'choose-layer') { if (!layer(id)) return; state.form.layer = id; state.picker = ''; render(); }
    else if (name === 'choose-algorithm') { state.form.algorithm = id; state.picker = ''; render(); }
    else if (name === 'choose-database') { if (!db(id)) return; state.form.db = id; state.form.table = ''; state.form.fields = {}; state.picker = ''; render(); }
    else if (name === 'choose-table') { state.form.table = id; state.form.fields = {}; state.picker = ''; render(); }
    else if (name === 'open-field-picker') {
      state.fieldPicker = { name: target.dataset.field, kind: target.dataset.kind, place: fieldPlacement(target) };
      state.fieldQuery = ''; render();
    }
    else if (name === 'close-field-picker') { state.fieldPicker = null; render(); }
    else if (name === 'choose-field-rule') {
      if (!state.fieldPicker) return;
      var kind = state.fieldPicker.kind, value = id === 'unset' ? '' : id;
      if (value && !rule(kind, value)) return;
      var field = ensureField(state.fieldPicker.name);
      field[kind] = value;
      if (!value) { if (kind === 'mask') field.exception = []; else field.decrypt = []; }
      state.fieldPicker = null; render();
    } else if (name === 'open-people') {
      var fieldData = ensureField(target.dataset.field), kindName = target.dataset.kind;
      state.peopleModal = { field: target.dataset.field, kind: kindName, ids: new Set(fieldData[kindName] || []), tab: 'department', query: '' };
      render();
    } else if (name === 'people-tab') { state.peopleModal.tab = target.dataset.tab; state.peopleModal.query = ''; render(); }
    else if (name === 'remove-person') { state.peopleModal.ids.delete(id); render(); }
    else if (name === 'confirm-people') { ensureField(state.peopleModal.field)[state.peopleModal.kind] = [...state.peopleModal.ids]; state.peopleModal = null; render(); }
    else if (name === 'close-people') { state.peopleModal = null; render(); }
  }
  function onClick(event) {
    var target = event.target.closest('[data-ds-action]');
    if (!target || !root.contains(target)) {
      if (state.fieldPicker && !event.target.closest('.ds-field-pop')) {
        state.fieldPicker = null;
        var pop = root.querySelector('.ds-field-pop'); if (pop) pop.remove();
      }
      return;
    }
    event.preventDefault(); action(target);
  }
  function onScroll(event) {
    if (!state.fieldPicker || !event.target.matches || !event.target.matches('.ds-field-table-wrap, .ds-main') || !root.contains(event.target)) return;
    var pop = root.querySelector('.ds-field-pop');
    var anchor = Array.prototype.find.call(root.querySelectorAll('[data-ds-action="open-field-picker"]'), function (item) {
      return item.dataset.field === state.fieldPicker.name && item.dataset.kind === state.fieldPicker.kind;
    });
    if (!pop || !anchor) { state.fieldPicker = null; if (pop) pop.remove(); return; }
    var bounds = root.querySelector('.ds-field-table-wrap');
    if (bounds && typeof anchor.getBoundingClientRect === 'function' && typeof bounds.getBoundingClientRect === 'function') {
      var anchorRect = anchor.getBoundingClientRect(), tableRect = bounds.getBoundingClientRect();
      if (anchorRect.bottom <= tableRect.top || anchorRect.top >= tableRect.bottom || anchorRect.right <= tableRect.left || anchorRect.left >= tableRect.right) {
        state.fieldPicker = null; pop.remove(); return;
      }
    }
    var place = fieldPlacement(anchor);
    state.fieldPicker.place = place;
    pop.style.left = place.left + 'px';
    pop.style.top = place.top + 'px';
    pop.style.maxHeight = place.maxHeight + 'px';
    pop.style.transform = place.above ? 'translateY(-100%)' : '';
  }
  function onChange(event) {
    var target = event.target, name = target.dataset.dsChange;
    if (name === 'check-row') { target.checked ? state.checked.add(target.dataset.id) : state.checked.delete(target.dataset.id); render(); }
    else if (name === 'check-all') {
      var rows = state.mode === 'management' ? visibleManagement() : visibleRules();
      rows.forEach(function (row) { if (state.mode === 'mask' && row.system) return; target.checked ? state.checked.add(row.id) : state.checked.delete(row.id); });
      render();
    } else if (name === 'rule-type') { state.form.type = target.value; render(); }
    else if (name === 'symbol') { state.form.symbol = target.value; render(); }
    else if (name === 'people-user') { target.checked ? state.peopleModal.ids.add(target.dataset.id) : state.peopleModal.ids.delete(target.dataset.id); render(); }
    else if (name === 'people-dept') { people.filter(function (person) { return person.dept === target.dataset.id; }).forEach(function (person) {
      target.checked ? state.peopleModal.ids.add(person.id) : state.peopleModal.ids.delete(person.id);
    }); render(); }
  }
  function onInput(event) {
    var target = event.target, name = target.dataset.dsInput, value = target.value;
    if (!name) return;
    if (name === 'tree-draft') state.treeDraft = value;
    else if (name === 'keyword-draft') state.keywordDraft = value;
    else if (name === 'picker-query') { state.pickerQuery = value; refreshInput(name, target); }
    else if (name === 'field-query') { state.fieldQuery = value; refreshInput(name, target); }
    else if (name === 'people-query') { state.peopleModal.query = value; refreshInput(name, target); }
    else if (name.indexOf('form-') === 0 && state.form) {
      var prop = { 'form-name': 'name', 'form-description': 'description', 'form-expression': 'expression', 'form-from': 'from',
        'form-to': 'to', 'form-replacement': 'replacement', 'form-random-start': 'randomStart', 'form-random-end': 'randomEnd' }[name];
      if (prop) state.form[prop] = value;
    }
  }
  function refreshInput(name, target) {
    var start = target.selectionStart, end = target.selectionEnd;
    render();
    var next = root.querySelector('[data-ds-input="' + name + '"]');
    if (next) { next.focus(); try { next.setSelectionRange(start, end); } catch (error) { /* 不适用的控件。 */ } }
  }
  function onKeydown(event) {
    if (event.key === 'Escape') {
      if (state.peopleModal) { state.peopleModal = null; render(); }
      else if (state.fieldPicker) { state.fieldPicker = null; render(); }
      else if (state.picker) { state.picker = ''; render(); }
      return;
    }
    if (event.key !== 'Enter') return;
    var name = event.target.dataset.dsInput;
    if (name === 'tree-draft' || name === 'keyword-draft') {
      event.preventDefault(); action(root.querySelector('[data-ds-action="' + (name === 'tree-draft' ? 'query-tree' : 'query-list') + '"]'));
    }
  }
  function init(mode) {
    root = document.querySelector('.page-data-security'); if (!root) return;
    store = load();
    state = { mode: mode, selected: mode === 'mask' ? 'system' : mode === 'crypto' ? 'custom' : '',
      expanded: new Set(['system', 'custom', 'business', 'ods', 'dwd', 'ods-order', 'ods-customer']),
      treeDraft: '', treeQuery: '', keywordDraft: '', keyword: '', checked: new Set(),
      view: 'list', editId: '', form: null, picker: '', pickerQuery: '', fieldPicker: null, fieldQuery: '', peopleModal: null, message: '' };
    root.addEventListener('click', onClick);
    root.addEventListener('scroll', onScroll, true);
    root.addEventListener('change', onChange);
    root.addEventListener('input', onInput);
    root.addEventListener('keydown', onKeydown);
    render();
  }
  return { html: '<div class="page-data-security"></div>', init: init };
})();
