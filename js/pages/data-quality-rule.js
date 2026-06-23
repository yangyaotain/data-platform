/**
 * 数据中台 V4.0 - 数据资产 / 数据质量 / 质量规则
 */
window.DP = window.DP || {};
DP.pages = DP.pages || {};

DP.pages.dataQualityRule = (function () {
  var pageEl = null;

  var state = {
    view: 'list',
    treeKey: 'system',
    treeKeyword: '',
    treeOpen: {
      system: true,
      'system-basic': true,
      'system-format': true,
      demo: true,
      'demo-dwd': true,
      business: true,
      'biz-order': true
    },
    selectedIds: {},
    page: 1,
    pageSize: 12,
    formMode: '',
    formId: '',
    formDraft: null,
    layerOpen: false,
    layerKeyword: '',
    layerTreeOpen: {},
    sqlSearchOpen: false,
    sqlTheme: 'dark',
    sqlFont: '14px',
    filters: {
      dbType: '',
      standard: '',
      ruleType: '',
      keyword: ''
    }
  };

  var databaseTypes = ['Mysql5', 'Mysql8', 'Oracle', 'SqlSever', 'PostgreSQL', 'Presto', 'GreenPlum', 'Hive', 'Impala', 'StarRocks', 'Hana'];
  var standards = ['完整性', '有效性', '及时性', '一致性', '准确性', '唯一性'];
  var ruleTypes = ['质量稽查（自定义稽查）', '标准稽查（固定检查）'];
  var paramAttrs = ['Catalog', 'Schema', '表', '字段', '数据（时间）', '数据（字符串）', '数据（数字）'];

  var ruleTree = [
    {
      key: 'system',
      label: '系统规则',
      icon: 'bi-collection-fill',
      iconClass: 'is-system',
      children: [
        { key: 'system-basic', label: '基础字段校验', icon: 'bi-stack' },
        { key: 'system-format', label: '格式规范校验', icon: 'bi-stack' },
        { key: 'system-range', label: '范围枚举校验', icon: 'bi-stack' },
        { key: 'system-time', label: '时间及时性校验', icon: 'bi-stack' }
      ]
    },
    {
      key: 'demo',
      label: '中电数治演示',
      icon: 'bi-layers-fill',
      iconClass: 'is-custom',
      children: [
        { key: 'demo-ods', label: 'ODS 贴源层', icon: 'bi-database-fill' },
        { key: 'demo-dwd', label: 'DWD 明细层', icon: 'bi-database-fill' },
        { key: 'demo-dws', label: 'DWS 汇总层', icon: 'bi-database-fill' },
        { key: 'demo-ads', label: 'ADS 应用层', icon: 'bi-database-fill' }
      ]
    },
    {
      key: 'business',
      label: '业务系统',
      icon: 'bi-layers-fill',
      iconClass: 'is-custom',
      children: [
        { key: 'biz-order', label: '订单交易系统', icon: 'bi-server' },
        { key: 'biz-customer', label: '客户主数据系统', icon: 'bi-server' },
        { key: 'biz-workorder', label: '工单协同系统', icon: 'bi-server' },
        { key: 'biz-finance', label: '财务结算系统', icon: 'bi-server' },
        { key: 'biz-logistics', label: '物流运单系统', icon: 'bi-server' }
      ]
    }
  ];

  var ruleRows = [
    row('qr-001', '非空校验-字段不能为空', '有效性', 'Mysql5', '质量稽查（自定义稽查）', '演示-测试', '2026-05-26 11:39:55', 'system-basic', '字段值不允许为空，适用于主键、业务编码、状态字段。', { catalog: 'quality_catalog', schema: 'dq_rule', sql: nonNullSql() }),
    row('qr-002', '筛选出重复的记录', '准确性', 'Mysql5', '质量稽查（自定义稽查）', '演示-测试', '2026-04-10 09:50:50', 'system-basic', '按指定字段组合识别重复记录，辅助业务去重。', { sql: duplicateSql() }),
    row('qr-003', '长度不能超过 10 个字符', '有效性', 'Mysql5', '质量稽查（自定义稽查）', '演示-测试', '2026-04-10 09:48:56', 'system-basic', '校验编码类字段长度不得超过规则阈值。', { sql: lengthSql() }),
    row('qr-004', '字段非空校验', '有效性', 'Mysql5', '标准稽查（固定检查）', '演示-测试', '2026-04-09 18:41:48', 'system-basic', '标准字段必填项检查。', { sql: standardSql() }),
    row('qr-005', '长度校验', '有效性', 'Mysql5', '系统规则', '-', '2021-06-24 09:14:01', 'system-basic', '模型字段长度必须符合元数据定义。', { sql: lengthSql() }),
    row('qr-006', '取值范围约束', '有效性', 'Mysql5', '系统规则', '-', '2021-06-24 09:14:01', 'system-range', '字段值必须落在配置的枚举或数值范围内。'),
    row('qr-007', '大小值校验', '有效性', 'Mysql5', '系统规则', '-', '2021-06-24 09:14:01', 'system-range', '数值字段支持最小值、最大值边界检查。'),
    row('qr-008', '身份证号校验(18位)', '有效性', 'Mysql5', '系统规则', '-', '2021-06-24 09:14:01', 'system-format', '按二代身份证号码规则校验长度、地区码、生日和校验位。'),
    row('qr-009', '及时性校验', '及时性', 'Mysql5', '系统规则', '-', '2021-06-24 09:14:01', 'system-time', '判断时间标识字段是否晚于业务截止日期。'),
    row('qr-010', '唯一性校验', '唯一性', 'Mysql5', '系统规则', '-', '2021-06-24 09:14:01', 'system-basic', '校验主键、业务编码等字段在表内唯一。'),
    row('qr-011', '电话号码校验(11位)码校验', '有效性', 'Mysql5', '系统规则', '-', '2021-06-24 09:14:01', 'system-format', '手机号字段必须为 11 位数字并匹配号段规则。'),
    row('qr-012', '非空校验', '完整性', 'Mysql5', '系统规则', '-', '2021-06-24 09:14:01', 'system-basic', '核心业务字段不得为空。'),
    row('qr-013', '订单号唯一性校验', '唯一性', 'Mysql8', '质量稽查（自定义稽查）', '数据治理部', '2026-06-18 10:22:36', 'biz-order', '订单号在交易明细表内必须唯一。'),
    row('qr-014', '订单状态标准代码校验', '一致性', 'Mysql8', '标准稽查（固定检查）', '数据治理部', '2026-06-15 16:08:12', 'biz-order', '订单状态必须映射到标准代码表。'),
    row('qr-015', '客户手机号格式校验', '有效性', 'Oracle', '质量稽查（自定义稽查）', '客户运营部', '2026-06-12 14:35:20', 'biz-customer', '客户主数据手机号需满足中国大陆手机号格式。'),
    row('qr-016', '客户证件号脱敏前格式校验', '有效性', 'Oracle', '标准稽查（固定检查）', '客户运营部', '2026-06-10 09:12:44', 'biz-customer', '证件号入湖前执行合法性检查。'),
    row('qr-017', '工单状态取值校验', '准确性', 'SqlSever', '质量稽查（自定义稽查）', '工单运营组', '2026-06-09 13:48:27', 'biz-workorder', '工单状态必须为待处理、处理中、已完成或已关闭。'),
    row('qr-018', '工单关闭时间一致性校验', '一致性', 'SqlSever', '质量稽查（自定义稽查）', '工单运营组', '2026-06-08 18:16:02', 'biz-workorder', '已关闭工单必须存在关闭时间，且不早于创建时间。'),
    row('qr-019', '支付金额非负校验', '有效性', 'PostgreSQL', '标准稽查（固定检查）', '财务结算部', '2026-06-07 11:05:30', 'biz-finance', '支付金额、优惠金额、退款金额不得为负数。'),
    row('qr-020', '结算金额精度校验', '准确性', 'PostgreSQL', '质量稽查（自定义稽查）', '财务结算部', '2026-06-05 15:42:18', 'biz-finance', '金额字段保留两位小数，避免精度异常。'),
    row('qr-021', '运单签收时间及时性', '及时性', 'Hive', '质量稽查（自定义稽查）', '物流数据组', '2026-06-03 17:31:56', 'biz-logistics', '签收时间不得早于揽收时间，且不得晚于当前时间。'),
    row('qr-022', '省市区编码一致性', '一致性', 'Hive', '标准稽查（固定检查）', '物流数据组', '2026-06-02 10:19:04', 'biz-logistics', '省、市、区编码需与行政区划标准层级一致。'),
    row('qr-023', 'ODS 主键入仓非空校验', '完整性', 'GreenPlum', '质量稽查（自定义稽查）', '数仓开发组', '2026-05-30 09:20:18', 'demo-ods', '贴源层主键字段不得为空。'),
    row('qr-024', 'DWD 明细记录重复校验', '唯一性', 'StarRocks', '质量稽查（自定义稽查）', '数仓开发组', '2026-05-28 16:44:52', 'demo-dwd', '明细层按业务主键和数据日期识别重复记录。'),
    row('qr-025', 'DWS 汇总口径一致性校验', '一致性', 'Presto', '标准稽查（固定检查）', '数仓开发组', '2026-05-24 12:06:33', 'demo-dws', '汇总指标需与指标口径和维度粒度保持一致。'),
    row('qr-026', 'ADS 报表刷新及时性校验', '及时性', 'Impala', '质量稽查（自定义稽查）', '经营分析组', '2026-05-22 08:58:16', 'demo-ads', '经营报表需在每日 09:00 前完成刷新。')
  ];

  function row(id, name, standard, dbType, ruleType, creator, modifiedAt, group, desc, extra) {
    extra = extra || {};
    var sql = extra.sql || defaultSql();
    return {
      id: id,
      name: name,
      standard: standard,
      dbType: dbType,
      ruleType: ruleType,
      creator: creator,
      modifiedAt: modifiedAt,
      group: group,
      desc: desc || '',
      catalog: extra.catalog || 'quality_catalog',
      schema: extra.schema || 'dq_rule',
      sql: sql,
      params: extra.params || getParamsFromSql(sql)
    };
  }

  function defaultSql() {
    return [
      'SELECT',
      '  t.*',
      'FROM ${catalog}.${schema}.${tableName} t',
      'WHERE ${fieldName} IS NOT NULL',
      '  AND ${fieldName} <> \'\''
    ].join('\n');
  }

  function nonNullSql() {
    return [
      'SELECT',
      '  t.${id}',
      'FROM (',
      '  SELECT',
      '    *',
      '  FROM ${standard_rule} a',
      ') t',
      'WHERE',
      '  t.${name} IS NOT NULL',
      '  OR t.${name} <> \'\''
    ].join('\n');
  }

  function duplicateSql() {
    return [
      'SELECT',
      '  ${fieldName},',
      '  COUNT(1) AS duplicate_count',
      'FROM ${catalog}.${schema}.${tableName}',
      'GROUP BY ${fieldName}',
      'HAVING COUNT(1) > 1'
    ].join('\n');
  }

  function lengthSql() {
    return [
      'SELECT',
      '  *',
      'FROM',
      '  ${tableName}',
      'WHERE',
      '  LENGTH(${tableName}.${fieldName}) <> ${length}'
    ].join('\n');
  }

  function standardSql() {
    return [
      'SELECT',
      '  *',
      'FROM ${tableName}',
      'WHERE ${fieldName} IS NULL'
    ].join('\n');
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function normalize(value) {
    return String(value || '').trim().toLowerCase();
  }

  function formatDateTime(date) {
    function pad(value) { return String(value).padStart(2, '0'); }
    return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate()) + ' ' +
      pad(date.getHours()) + ':' + pad(date.getMinutes()) + ':' + pad(date.getSeconds());
  }

  function highlightSQL(code) {
    var h = escapeHtml(code);
    h = h.replace(/(\/\/[^\n]*)/g, '<span class="dp-sql-comment">$1</span>');
    h = h.replace(/(\/\*[\s\S]*?\*\/|\/\*[\s\S]*$)/g, '<span class="dp-sql-comment">$1</span>');
    h = h.replace(/('[^']*')/g, '<span class="dp-sql-string">$1</span>');
    h = h.replace(/(\$\{[^}]+\})/g, '<span class="dp-sql-var">$1</span>');
    h = h.replace(/\b(SET|CREATE|TABLE|WITH|SELECT|FROM|INSERT|INTO|VALUES|WHERE|AND|OR|NOT|NULL|AS|VARCHAR|INT|BIGINT|FLOAT|DOUBLE|DECIMAL|DATE|BOOLEAN|COUNT|GROUP|BY|HAVING|JOIN|LEFT|RIGHT|INNER|ON|LENGTH)\b/gi,
      '<span class="dp-sql-keyword">$1</span>');
    return h;
  }

  function lineNumbers(code) {
    var total = Math.max(1, String(code || '').split('\n').length);
    var html = '';
    for (var i = 1; i <= total; i++) html += '<div>' + i + '</div>';
    return html;
  }

  function getPlainEditorText() {
    var content = pageEl ? pageEl.querySelector('[data-dqr-sql-content]') : null;
    return content ? (content.innerText || content.textContent || '') : '';
  }

  function guessParamAttr(name) {
    var key = String(name || '').toLowerCase();
    if (key.indexOf('catalog') >= 0) return 'Catalog';
    if (key.indexOf('schema') >= 0 || key.indexOf('db') >= 0) return 'Schema';
    if (key.indexOf('table') >= 0 || key.indexOf('rule') >= 0) return '表';
    if (key.indexOf('field') >= 0 || key.indexOf('name') >= 0 || key.indexOf('id') >= 0) return '字段';
    if (key.indexOf('time') >= 0 || key.indexOf('date') >= 0) return '数据（时间）';
    if (key.indexOf('length') >= 0 || key.indexOf('count') >= 0 || key.indexOf('amount') >= 0) return '数据（数字）';
    return '数据（字符串）';
  }

  function getParamsFromSql(sql, oldParams) {
    var oldMap = {};
    (oldParams || []).forEach(function (item) { oldMap[item.name] = item; });
    var seen = {};
    var params = [];
    var matches = String(sql || '').match(/\$\{[^}]+\}/g) || [];
    matches.forEach(function (token) {
      if (seen[token]) return;
      seen[token] = true;
      params.push({
        name: token,
        attr: oldMap[token] ? oldMap[token].attr : guessParamAttr(token),
        desc: oldMap[token] ? oldMap[token].desc : '100个字符以内'
      });
    });
    return params;
  }

  function findTreeNode(nodes, key) {
    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      if (node.key === key) return node;
      var found = findTreeNode(node.children || [], key);
      if (found) return found;
    }
    return null;
  }

  function collectTreeKeys(node) {
    if (!node) return [];
    return [node.key].concat((node.children || []).reduce(function (keys, child) {
      return keys.concat(collectTreeKeys(child));
    }, []));
  }

  function getFirstLeafKey(node) {
    if (!node) return 'system-basic';
    if (!node.children || !node.children.length) return node.key;
    return getFirstLeafKey(node.children[0]);
  }

  function getSelectedLeafKey() {
    return getFirstLeafKey(findTreeNode(ruleTree, state.treeKey)) || 'system-basic';
  }

  function getTreeCount(node) {
    var keys = collectTreeKeys(node);
    return ruleRows.filter(function (item) { return keys.indexOf(item.group) >= 0; }).length;
  }

  function treeMatches(node, keyword) {
    if (!keyword) return true;
    if (normalize(node.label).indexOf(keyword) >= 0) return true;
    return (node.children || []).some(function (child) { return treeMatches(child, keyword); });
  }

  function renderTreeNodes(nodes, keyword, mode) {
    return nodes.filter(function (node) {
      return treeMatches(node, keyword);
    }).map(function (node) {
      var children = node.children || [];
      var hasChildren = children.length > 0;
      var isPicker = mode === 'picker';
      var isOpen = !!keyword || !!(isPicker ? state.layerTreeOpen[node.key] : state.treeOpen[node.key]);
      var selected = isPicker ? state.formDraft && state.formDraft.group === node.key : state.treeKey === node.key;
      var action = isPicker ? 'toggle-layer-tree' : 'toggle-tree';
      var keyAttr = isPicker ? 'data-dqr-layer-key' : 'data-dqr-tree-key';
      return '<li class="dqr-tree-node' + (isOpen ? ' open' : '') + '">' +
        '<div class="dqr-tree-row' + (selected ? ' active' : '') + '">' +
          (hasChildren
            ? '<button class="dqr-tree-toggle" type="button" data-dqr-action="' + action + '" data-key="' + escapeHtml(node.key) + '" aria-label="展开或收起"><i class="bi ' + (isOpen ? 'bi-caret-down-fill' : 'bi-caret-right-fill') + '"></i></button>'
            : '<span class="dqr-tree-toggle-placeholder"></span>') +
          '<button class="dqr-tree-select" type="button" ' + keyAttr + '="' + escapeHtml(node.key) + '">' +
            '<i class="bi ' + escapeHtml(node.icon || 'bi-folder-fill') + ' dqr-tree-icon ' + escapeHtml(node.iconClass || '') + '"></i>' +
            '<span class="dqr-tree-name">' + escapeHtml(node.label) + '</span>' +
            '<span class="dqr-tree-count">' + getTreeCount(node) + '</span>' +
          '</button>' +
        '</div>' +
        (hasChildren ? '<ul class="dqr-tree-children">' + renderTreeNodes(children, keyword, mode) + '</ul>' : '') +
      '</li>';
    }).join('');
  }

  function renderTree() {
    var keyword = normalize(state.treeKeyword);
    return renderTreeNodes(ruleTree, keyword, 'left') || '<li class="dqr-empty-tree">暂无匹配目录</li>';
  }

  function getCurrentTreeKeys() {
    return collectTreeKeys(findTreeNode(ruleTree, state.treeKey));
  }

  function getFilteredRows() {
    var keys = getCurrentTreeKeys();
    var keyword = normalize(state.filters.keyword);
    return ruleRows.filter(function (item) {
      if (keys.length && keys.indexOf(item.group) < 0) return false;
      if (state.filters.dbType && item.dbType !== state.filters.dbType) return false;
      if (state.filters.standard && item.standard !== state.filters.standard) return false;
      if (state.filters.ruleType && item.ruleType !== state.filters.ruleType) return false;
      if (keyword) {
        var text = [item.name, item.standard, item.dbType, item.ruleType, item.creator, item.desc].join(' ');
        if (normalize(text).indexOf(keyword) < 0) return false;
      }
      return true;
    });
  }

  function clampPage(total) {
    var totalPages = Math.max(1, Math.ceil(total / state.pageSize));
    state.page = Math.max(1, Math.min(totalPages, state.page));
    return totalPages;
  }

  function getVisibleRows() {
    var rows = getFilteredRows();
    clampPage(rows.length);
    var start = (state.page - 1) * state.pageSize;
    return rows.slice(start, start + state.pageSize);
  }

  function renderOptions(values, current, placeholder) {
    return '<option value="">' + escapeHtml(placeholder || '请选择') + '</option>' +
      values.map(function (value) {
        return '<option value="' + escapeHtml(value) + '"' + (value === current ? ' selected' : '') + '>' + escapeHtml(value) + '</option>';
      }).join('');
  }

  function getTreePath(key, nodes, parents) {
    nodes = nodes || ruleTree;
    parents = parents || [];
    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      var path = parents.concat(node.label);
      if (node.key === key) return path.join(' / ');
      var childPath = getTreePath(key, node.children || [], path);
      if (childPath) return childPath;
    }
    return '';
  }

  function createDraft(item) {
    var draftRuleType = item && ruleTypes.indexOf(item.ruleType) >= 0 ? item.ruleType : '标准稽查（固定检查）';
    return {
      id: item ? item.id : '',
      name: item ? item.name : '',
      dbType: item ? item.dbType : 'Mysql5',
      standard: item ? item.standard : '有效性',
      group: item ? item.group : getSelectedLeafKey(),
      ruleType: item ? draftRuleType : '质量稽查（自定义稽查）',
      catalog: item ? item.catalog : 'quality_catalog',
      schema: item ? item.schema : 'dq_rule',
      creator: item ? item.creator : '演示-测试',
      desc: item ? item.desc : '',
      sql: item ? item.sql : nonNullSql(),
      params: item ? item.params.map(function (param) {
        return { name: param.name, attr: param.attr, desc: param.desc };
      }) : getParamsFromSql(nonNullSql())
    };
  }

  function isFixedRuleType(type) {
    return String(type || '') === '标准稽查（固定检查）';
  }

  function getSqlTipText() {
    return isFixedRuleType(state.formDraft && state.formDraft.ruleType)
      ? '请输入SQL表达式，请使用${dbName}表示数据库名称，使用${tableName}表示表名称，${fieldName}表示字段名称'
      : '请输入SQL表达式，请参照示例模板编写';
  }

  function getRowById(id) {
    return ruleRows.filter(function (item) { return item.id === id; })[0] || null;
  }

  function captureFormDraft() {
    if (!pageEl || state.view !== 'form' || !state.formDraft) return;
    pageEl.querySelectorAll('[data-dqr-field]').forEach(function (control) {
      state.formDraft[control.getAttribute('data-dqr-field')] = control.value.trim();
    });
    var sql = getPlainEditorText();
    if (sql) state.formDraft.sql = sql.replace(/\u00a0/g, ' ');
    pageEl.querySelectorAll('[data-dqr-param-index]').forEach(function (rowEl) {
      var index = Number(rowEl.getAttribute('data-dqr-param-index'));
      var item = state.formDraft.params[index];
      if (!item) return;
      var nameInput = rowEl.querySelector('[data-dqr-param-name]');
      var attrSelect = rowEl.querySelector('[data-dqr-param-attr]');
      var descInput = rowEl.querySelector('[data-dqr-param-desc]');
      if (nameInput) item.name = nameInput.value.trim();
      if (attrSelect) item.attr = attrSelect.value;
      if (descInput) item.desc = descInput.value.trim();
    });
  }

  function renderToolbar() {
    return '<div class="dqr-toolbar">' +
      '<div class="dqr-toolbar-left">' +
        '<button class="btn btn-primary" type="button" data-dqr-action="new"><i class="bi bi-plus-lg"></i><span>新建</span></button>' +
        '<button class="btn btn-danger" type="button" data-dqr-action="delete-selected"><i class="bi bi-trash3"></i><span>删除</span></button>' +
      '</div>' +
      '<div class="dqr-toolbar-right">' +
        '<label class="dqr-filter"><span>数据库类型</span><select data-dqr-filter="dbType">' + renderOptions(databaseTypes, state.filters.dbType) + '</select></label>' +
        '<label class="dqr-filter"><span>评价标准</span><select data-dqr-filter="standard">' + renderOptions(standards, state.filters.standard) + '</select></label>' +
        '<label class="dqr-filter"><span>规则类型</span><select data-dqr-filter="ruleType">' + renderOptions(ruleTypes, state.filters.ruleType) + '</select></label>' +
        '<div class="dqr-query-box">' +
          '<input id="dqrKeywordInput" type="text" value="' + escapeHtml(state.filters.keyword) + '" placeholder="关键字查询" aria-label="关键字查询">' +
          '<button class="btn btn-primary" type="button" data-dqr-action="query"><i class="bi bi-search"></i><span>查询</span></button>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  function renderTableRows() {
    var rows = getVisibleRows();
    if (!rows.length) {
      return '<tr class="dqr-empty-row"><td colspan="8">暂无匹配质量规则</td></tr>';
    }
    return rows.map(function (item) {
      return '<tr>' +
        '<td><input type="checkbox" data-dqr-row-check="' + escapeHtml(item.id) + '"' + (state.selectedIds[item.id] ? ' checked' : '') + ' aria-label="选择质量规则"></td>' +
        '<td title="' + escapeHtml(item.name) + '">' + escapeHtml(item.name) + '</td>' +
        '<td>' + escapeHtml(item.standard) + '</td>' +
        '<td>' + escapeHtml(item.dbType) + '</td>' +
        '<td title="' + escapeHtml(item.ruleType) + '">' + escapeHtml(item.ruleType) + '</td>' +
        '<td>' + escapeHtml(item.creator) + '</td>' +
        '<td>' + escapeHtml(item.modifiedAt) + '</td>' +
        '<td><div class="dqr-icon-actions">' +
          '<button type="button" data-dqr-action="edit" data-id="' + escapeHtml(item.id) + '"><i class="bi bi-pencil-square"></i><span>编辑</span></button>' +
          '<button class="danger" type="button" data-dqr-action="delete-row" data-id="' + escapeHtml(item.id) + '"><i class="bi bi-trash3"></i><span>删除</span></button>' +
        '</div></td>' +
      '</tr>';
    }).join('');
  }

  function renderTable() {
    var visible = getVisibleRows();
    var checkedCount = visible.filter(function (item) { return state.selectedIds[item.id]; }).length;
    var allChecked = visible.length > 0 && checkedCount === visible.length;
    return '<div class="dqr-table-wrap">' +
      '<table class="ds-table dqr-table">' +
        '<colgroup>' +
          '<col class="dqr-w-check"><col class="dqr-w-name"><col class="dqr-w-standard"><col class="dqr-w-db">' +
          '<col class="dqr-w-type"><col class="dqr-w-creator"><col class="dqr-w-time"><col class="dqr-w-action">' +
        '</colgroup>' +
        '<thead><tr>' +
          '<th class="col-ck"><input type="checkbox" data-dqr-check-all' + (allChecked ? ' checked' : '') + ' aria-label="全选质量规则"></th>' +
          '<th>规则名称</th><th>评价标准</th><th>数据库类型</th><th>规则类型</th><th>创建人</th><th>修改时间</th><th>操作</th>' +
        '</tr></thead>' +
        '<tbody>' + renderTableRows() + '</tbody>' +
      '</table>' +
    '</div>';
  }

  function renderFooter() {
    var rows = getFilteredRows();
    var total = rows.length;
    var totalPages = clampPage(total);
    var start = total ? (state.page - 1) * state.pageSize + 1 : 0;
    var end = total ? Math.min(total, state.page * state.pageSize) : 0;
    var nav = '';
    for (var i = 1; i <= totalPages; i++) {
      nav += '<button type="button" data-dqr-page="' + i + '"' + (state.page === i ? ' class="active"' : '') + '>' + i + '</button>';
    }
    return '<div class="dqr-footer">' +
      '<div class="dqr-footer-left">显示第 ' + start + ' 到第 ' + end + ' 条记录，总共 ' + total + ' 条记录 每页显示 ' +
        '<select data-dqr-page-size><option value="12"' + (state.pageSize === 12 ? ' selected' : '') + '>12</option><option value="20"' + (state.pageSize === 20 ? ' selected' : '') + '>20</option></select> 条记录</div>' +
      '<div class="dqr-page-nav">' +
        '<button type="button" data-dqr-page="prev"' + (state.page <= 1 ? ' disabled' : '') + '><i class="bi bi-chevron-left"></i></button>' +
        nav +
        '<button type="button" data-dqr-page="next"' + (state.page >= totalPages ? ' disabled' : '') + '><i class="bi bi-chevron-right"></i></button>' +
      '</div>' +
    '</div>';
  }

  function renderLayerPicker() {
    var draft = state.formDraft;
    var keyword = normalize(state.layerKeyword);
    return '<div class="dqr-layer-picker' + (state.layerOpen ? ' open' : '') + '">' +
      '<button class="dqr-layer-value" type="button" data-dqr-action="toggle-layer-picker">' +
        '<span>' + escapeHtml(getTreePath(draft.group) || '请选择业务分层') + '</span><i class="bi bi-chevron-down"></i>' +
      '</button>' +
      '<div class="dqr-layer-dropdown">' +
        '<div class="dqr-layer-search"><input type="text" data-dqr-layer-search value="' + escapeHtml(state.layerKeyword) + '" placeholder="搜索目录"><button type="button"><i class="bi bi-search"></i></button></div>' +
        '<div class="dqr-layer-tree-wrap"><ul class="dqr-tree dqr-layer-tree">' + (renderTreeNodes(ruleTree, keyword, 'picker') || '<li class="dqr-empty-tree">暂无匹配目录</li>') + '</ul></div>' +
      '</div>' +
    '</div>';
  }

  function renderHint(text) {
    if (String(text || '').indexOf('<a>') === 0) {
      return '<div class="dqr-form-hint dqr-form-hint-link"><a href="javascript:;">' + escapeHtml(String(text).replace(/<\/?a>/g, '')) + '</a></div>';
    }
    var body = '<span>' + escapeHtml(text) + '</span>';
    return '<div class="dqr-form-hint"><i class="bi bi-info-circle-fill"></i>' + body + '</div>';
  }

  function renderField(label, control, required, hint) {
    return '<div class="dqr-form-row">' +
      '<label>' + (required ? '<span>*</span>' : '') + escapeHtml(label) + '</label>' +
      '<div class="dqr-form-control">' + control + '</div>' +
      (hint ? renderHint(hint) : '<div></div>') +
    '</div>';
  }

  function renderParamRows() {
    var params = (state.formDraft && state.formDraft.params) || [];
    if (!params.length) {
      return '<tr class="dqr-param-empty"><td colspan="3">点击“解析”后生成参数</td></tr>';
    }
    return params.map(function (param, index) {
      return '<tr data-dqr-param-index="' + index + '">' +
        '<td><input type="text" data-dqr-param-name value="' + escapeHtml(param.name) + '" placeholder="${param}"></td>' +
        '<td><select data-dqr-param-attr>' + renderOptions(paramAttrs, param.attr, '请选择') + '</select></td>' +
        '<td><input type="text" data-dqr-param-desc value="' + escapeHtml(param.desc) + '" placeholder="100个字符以内"></td>' +
      '</tr>';
    }).join('');
  }

  function renderParamTable() {
    var total = (state.formDraft && state.formDraft.params ? state.formDraft.params.length : 0);
    return '<div class="dqr-param-panel">' +
      '<table class="dqr-param-table">' +
        '<thead><tr><th>参数名</th><th>参数属性</th><th>参数说明</th></tr></thead>' +
        '<tbody>' + renderParamRows() + '</tbody>' +
      '</table>' +
      '<div class="dqr-param-footer">显示第 ' + (total ? 1 : 0) + ' 到第 ' + total + ' 条记录，总共 ' + total + ' 条记录</div>' +
    '</div>';
  }

  function renderSqlEditor() {
    var sql = state.formDraft.sql || '';
    var isLight = state.sqlTheme !== 'dark';
    return '<div class="dp-sql-editor dqr-sql-editor ' + (isLight ? 'theme-light' : 'theme-dark') + (state.sqlSearchOpen ? ' search-open' : '') + '" data-dqr-sql-editor style="font-size:' + escapeHtml(state.sqlFont) + ';">' +
      '<div class="dp-sql-editor-toolbar">' +
        '<select class="dp-sql-editor-select" data-dqr-sql-theme><option value="light"' + (isLight ? ' selected' : '') + '>亮色 - Light</option><option value="dark"' + (!isLight ? ' selected' : '') + '>暗色 - One Dark</option></select>' +
        '<select class="dp-sql-editor-select" data-dqr-sql-font><option' + (state.sqlFont === '12px' ? ' selected' : '') + '>12px</option><option' + (state.sqlFont === '13px' ? ' selected' : '') + '>13px</option><option' + (state.sqlFont === '14px' ? ' selected' : '') + '>14px</option><option' + (state.sqlFont === '15px' ? ' selected' : '') + '>15px</option><option' + (state.sqlFont === '16px' ? ' selected' : '') + '>16px</option></select>' +
        '<button class="dp-sql-editor-btn" type="button" data-dqr-action="format-sql"><i class="bi bi-sliders"></i><span>格式化</span></button>' +
        '<button class="dp-sql-editor-btn" type="button" data-dqr-action="copy-sql"><i class="bi bi-clipboard"></i><span>复制</span></button>' +
        '<button class="dp-sql-editor-btn" type="button" data-dqr-action="toggle-sql-search"><i class="bi bi-search"></i><span>搜索</span></button>' +
      '</div>' +
      '<div class="dp-sql-editor-searchbar">' +
        '<input class="dp-sql-editor-input" type="text" placeholder="查找...">' +
        '<button class="dp-sql-editor-btn" type="button">下一个</button>' +
        '<button class="dp-sql-editor-btn" type="button">上一个</button>' +
        '<label class="dp-sql-editor-check"><input type="checkbox"> 区分大小写</label>' +
        '<input class="dp-sql-editor-input" type="text" placeholder="替换...">' +
        '<button class="dp-sql-editor-btn" type="button">替换</button>' +
        '<span class="dp-sql-editor-close" data-dqr-action="close-sql-search"><i class="bi bi-x"></i></span>' +
      '</div>' +
      '<div class="dp-sql-editor-wrap">' +
        '<div class="dp-sql-editor-gutter" data-dqr-sql-gutter>' + lineNumbers(sql) + '</div>' +
        '<div class="dp-sql-editor-content" data-dqr-sql-content contenteditable="true" spellcheck="false">' + highlightSQL(sql) + '</div>' +
      '</div>' +
    '</div>';
  }

  function renderForm() {
    var draft = state.formDraft;
    var fixedRule = isFixedRuleType(draft.ruleType);
    return '<div class="dqr-form-page">' +
      '<div class="dqr-form-head">' +
        '<div class="dqr-form-title"><i class="bi bi-list"></i><span>新建/编辑</span></div>' +
        '<button class="btn btn-primary" type="button" data-dqr-action="back-list"><i class="bi bi-arrow-left"></i><span>返回</span></button>' +
      '</div>' +
      '<div class="dqr-form-body">' +
        renderField('规则名称', '<input type="text" data-dqr-field="name" value="' + escapeHtml(draft.name) + '" placeholder="请输入规则名称">', true, '50个字符以内；') +
        renderField('数据库类型', '<select data-dqr-field="dbType">' + renderOptions(databaseTypes, draft.dbType) + '</select>', true, '数据库类型') +
        renderField('评价标准', '<select data-dqr-field="standard">' + renderOptions(standards, draft.standard) + '</select>', true, '评价标准') +
        renderField('业务分层', renderLayerPicker(), true, '业务分层') +
        renderField('规则类型', '<select data-dqr-field="ruleType">' + renderOptions(ruleTypes, draft.ruleType) + '</select>', true, '<a>示例模板下载</a>') +
        '<div class="dqr-form-row dqr-form-row-sql">' +
          '<label><span>*</span>规则SQL</label>' +
          '<div class="dqr-sql-zone">' +
            (fixedRule ? '' : '<div class="dqr-sql-actionbar"><button class="btn btn-primary" type="button" data-dqr-action="parse-sql"><i class="bi bi-gear-wide-connected"></i><span>解析</span></button></div>') +
            '<div class="dqr-sql-grid' + (fixedRule ? ' single' : '') + '">' +
              renderSqlEditor() +
              (fixedRule ? '' : renderParamTable()) +
            '</div>' +
          '</div>' +
          '<div></div>' +
        '</div>' +
        '<div class="dqr-sql-tip"><div class="dqr-sql-tip-content"><i class="bi bi-info-circle-fill"></i><span>' + escapeHtml(getSqlTipText()) + '</span></div></div>' +
        renderField('描述', '<textarea data-dqr-field="desc" placeholder="100个字符以内">' + escapeHtml(draft.desc) + '</textarea>', false, '100个字符以内；') +
        '<div class="dqr-form-actions">' +
          '<button class="btn btn-primary" type="button" data-dqr-action="save-form"><i class="bi bi-check-lg"></i><span>保存</span></button>' +
          '<button class="btn btn-outline" type="button" data-dqr-action="back-list"><i class="bi bi-x-lg"></i><span>取消</span></button>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  function renderList() {
    return renderToolbar() + renderTable() + renderFooter();
  }

  function renderMain() {
    var main = pageEl.querySelector('[data-dqr-main]');
    if (!main) return;
    main.innerHTML = state.view === 'form' ? renderForm() : renderList();
  }

  function renderAll() {
    var tree = pageEl.querySelector('[data-dqr-tree]');
    var treeInput = pageEl.querySelector('[data-dqr-tree-search]');
    if (tree) tree.innerHTML = renderTree();
    if (treeInput && treeInput.value !== state.treeKeyword) treeInput.value = state.treeKeyword;
    renderMain();
  }

  function showToast(message) {
    var old = document.querySelector('.dqr-toast');
    if (old) old.remove();
    var toast = document.createElement('div');
    toast.className = 'dqr-toast';
    toast.innerHTML = '<i class="bi bi-check-circle"></i><span>' + escapeHtml(message) + '</span>';
    document.body.appendChild(toast);
    window.setTimeout(function () {
      if (toast.parentNode) toast.remove();
    }, 1800);
  }

  function confirmAndRun(message, icon, callback) {
    if (window.DP && typeof DP.confirm === 'function') {
      DP.confirm(message, { icon: icon || 'danger', onOk: callback, okText: '确认', cancelText: '取消' });
    } else if (window.confirm(message.replace(/<[^>]+>/g, ''))) {
      callback();
    }
  }

  function deleteRows(ids) {
    if (!ids.length) {
      showToast('请先选择需要删除的规则');
      return;
    }
    confirmAndRun('确认删除选中的 <b>' + ids.length + '</b> 条质量规则吗？', 'danger', function () {
      ruleRows = ruleRows.filter(function (item) { return ids.indexOf(item.id) < 0; });
      state.selectedIds = {};
      renderAll();
      showToast('质量规则已删除');
    });
  }

  function openForm(mode, id) {
    var item = mode === 'edit' ? getRowById(id) : null;
    state.view = 'form';
    state.formMode = mode;
    state.formId = id || '';
    state.formDraft = createDraft(item);
    state.layerOpen = false;
    state.layerKeyword = '';
    state.layerTreeOpen = {
      system: true,
      demo: true,
      business: true
    };
    state.sqlSearchOpen = false;
    renderAll();
  }

  function closeForm() {
    state.view = 'list';
    state.formMode = '';
    state.formId = '';
    state.formDraft = null;
    state.layerOpen = false;
    state.layerKeyword = '';
    state.sqlSearchOpen = false;
    renderAll();
  }

  function saveForm() {
    captureFormDraft();
    var draft = state.formDraft;
    if (!draft.name || !draft.group || !draft.dbType || !draft.standard || !draft.ruleType || !draft.sql) {
      showToast('请填写必填项');
      return;
    }
    if (state.formMode === 'edit') {
      var current = getRowById(state.formId);
      if (current) {
        current.name = draft.name;
        current.group = draft.group;
        current.standard = draft.standard;
        current.dbType = draft.dbType;
        current.ruleType = draft.ruleType;
        current.catalog = draft.catalog;
        current.schema = draft.schema;
        current.creator = draft.creator || current.creator || '演示-测试';
        current.desc = draft.desc || '';
        current.sql = draft.sql;
        current.params = draft.params;
        current.modifiedAt = formatDateTime(new Date());
      }
    } else {
      ruleRows.unshift(row('qr-' + Date.now(), draft.name, draft.standard, draft.dbType, draft.ruleType, draft.creator || '演示-测试', formatDateTime(new Date()), draft.group, draft.desc || '', {
        catalog: draft.catalog,
        schema: draft.schema,
        sql: draft.sql,
        params: draft.params
      }));
      state.page = 1;
    }
    state.selectedIds = {};
    closeForm();
    showToast('质量规则已保存');
  }

  function syncGutter() {
    var gutter = pageEl.querySelector('[data-dqr-sql-gutter]');
    var sql = getPlainEditorText();
    if (state.formDraft) state.formDraft.sql = sql;
    if (gutter) gutter.innerHTML = lineNumbers(sql);
  }

  function formatSqlText(sql) {
    var keywords = ['SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'INSERT', 'INTO', 'VALUES', 'SET', 'CREATE', 'TABLE', 'WITH', 'AS', 'NOT', 'NULL', 'ORDER', 'BY', 'GROUP', 'HAVING', 'JOIN', 'LEFT', 'RIGHT', 'INNER', 'ON', 'LIMIT', 'UNION', 'ALL', 'COUNT', 'LENGTH'];
    var formatted = String(sql || '').replace(/\r\n/g, '\n').replace(/[ \t]+$/gm, '');
    keywords.forEach(function (kw) {
      formatted = formatted.replace(new RegExp('\\b' + kw + '\\b', 'gi'), kw);
    });
    formatted = formatted.replace(/\s+(FROM|WHERE|GROUP BY|HAVING|ORDER BY)\b/g, '\n$1');
    formatted = formatted.replace(/\s+(AND|OR)\b/g, '\n  $1');
    return formatted.trim();
  }

  function setSqlText(sql) {
    if (!state.formDraft) return;
    state.formDraft.sql = sql;
    var content = pageEl.querySelector('[data-dqr-sql-content]');
    var gutter = pageEl.querySelector('[data-dqr-sql-gutter]');
    if (content) content.innerHTML = highlightSQL(sql);
    if (gutter) gutter.innerHTML = lineNumbers(sql);
  }

  function handleSqlTheme(selectEl) {
    state.sqlTheme = selectEl.value === 'dark' ? 'dark' : 'light';
    var editor = pageEl.querySelector('[data-dqr-sql-editor]');
    if (!editor) return;
    editor.classList.toggle('theme-light', state.sqlTheme !== 'dark');
    editor.classList.toggle('theme-dark', state.sqlTheme === 'dark');
  }

  function handleSqlFont(selectEl) {
    state.sqlFont = selectEl.value || '14px';
    var editor = pageEl.querySelector('[data-dqr-sql-editor]');
    if (editor) editor.style.fontSize = state.sqlFont;
  }

  function copySql(button) {
    var text = getPlainEditorText();
    function done() {
      button.innerHTML = '<i class="bi bi-check2"></i><span>已复制</span>';
      window.setTimeout(function () {
        button.innerHTML = '<i class="bi bi-clipboard"></i><span>复制</span>';
      }, 1200);
    }
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(done).catch(function () { showToast('复制失败'); });
    } else {
      done();
    }
  }

  function parseSqlParams() {
    captureFormDraft();
    state.formDraft.params = getParamsFromSql(state.formDraft.sql, state.formDraft.params);
    renderMain();
    showToast('参数已解析');
  }

  function handleAction(actionEl) {
    var action = actionEl.getAttribute('data-dqr-action');
    var id = actionEl.getAttribute('data-id') || '';
    if (state.view === 'form') captureFormDraft();

    if (action === 'toggle-tree') {
      var key = actionEl.getAttribute('data-key') || '';
      state.treeOpen[key] = !state.treeOpen[key];
      var tree = pageEl.querySelector('[data-dqr-tree]');
      if (tree) tree.innerHTML = renderTree();
    } else if (action === 'new') {
      openForm('new', '');
    } else if (action === 'edit') {
      openForm('edit', id);
    } else if (action === 'delete-row') {
      deleteRows([id]);
    } else if (action === 'delete-selected') {
      deleteRows(Object.keys(state.selectedIds));
    } else if (action === 'query') {
      var input = pageEl.querySelector('#dqrKeywordInput');
      state.filters.keyword = input ? input.value.trim() : '';
      state.page = 1;
      state.selectedIds = {};
      renderMain();
    } else if (action === 'back-list') {
      closeForm();
    } else if (action === 'save-form') {
      saveForm();
    } else if (action === 'toggle-layer-picker') {
      state.layerOpen = !state.layerOpen;
      renderMain();
    } else if (action === 'toggle-layer-tree') {
      var layerKey = actionEl.getAttribute('data-key') || '';
      state.layerTreeOpen[layerKey] = !state.layerTreeOpen[layerKey];
      renderMain();
    } else if (action === 'format-sql') {
      setSqlText(formatSqlText(state.formDraft.sql || getPlainEditorText()));
      showToast('SQL 已格式化');
    } else if (action === 'parse-sql') {
      parseSqlParams();
    } else if (action === 'copy-sql') {
      copySql(actionEl);
    } else if (action === 'toggle-sql-search') {
      state.sqlSearchOpen = !state.sqlSearchOpen;
      renderMain();
    } else if (action === 'close-sql-search') {
      state.sqlSearchOpen = false;
      renderMain();
    }
  }

  function bindEvents() {
    pageEl.addEventListener('click', function (e) {
      var actionEl = e.target.closest('[data-dqr-action]');
      if (actionEl && pageEl.contains(actionEl)) {
        handleAction(actionEl);
        return;
      }

      var layerRow = e.target.closest('[data-dqr-layer-key]');
      if (layerRow && pageEl.contains(layerRow)) {
        captureFormDraft();
        state.formDraft.group = layerRow.getAttribute('data-dqr-layer-key') || getSelectedLeafKey();
        state.layerOpen = false;
        state.layerKeyword = '';
        renderMain();
        return;
      }

      var treeRow = e.target.closest('[data-dqr-tree-key]');
      if (treeRow && pageEl.contains(treeRow)) {
        state.treeKey = treeRow.getAttribute('data-dqr-tree-key') || 'system';
        state.page = 1;
        state.selectedIds = {};
        if (state.view === 'form' && state.formDraft) {
          state.formDraft.group = getFirstLeafKey(findTreeNode(ruleTree, state.treeKey));
        }
        renderAll();
        return;
      }

      var pageBtn = e.target.closest('[data-dqr-page]');
      if (pageBtn && pageEl.contains(pageBtn) && !pageBtn.disabled) {
        var rows = getFilteredRows();
        var totalPages = Math.max(1, Math.ceil(rows.length / state.pageSize));
        var target = pageBtn.getAttribute('data-dqr-page');
        if (target === 'prev') state.page = Math.max(1, state.page - 1);
        else if (target === 'next') state.page = Math.min(totalPages, state.page + 1);
        else state.page = Number(target) || 1;
        renderMain();
      }
    });

    pageEl.addEventListener('change', function (e) {
      if (e.target.matches('[data-dqr-filter]')) {
        state.filters[e.target.getAttribute('data-dqr-filter')] = e.target.value;
        state.page = 1;
        state.selectedIds = {};
        renderMain();
        return;
      }
      if (e.target.matches('[data-dqr-check-all]')) {
        getVisibleRows().forEach(function (item) {
          if (e.target.checked) state.selectedIds[item.id] = true;
          else delete state.selectedIds[item.id];
        });
        renderMain();
        return;
      }
      if (e.target.matches('[data-dqr-row-check]')) {
        var id = e.target.getAttribute('data-dqr-row-check');
        if (e.target.checked) state.selectedIds[id] = true;
        else delete state.selectedIds[id];
        renderMain();
        return;
      }
      if (e.target.matches('[data-dqr-page-size]')) {
        state.pageSize = Number(e.target.value) || 12;
        state.page = 1;
        state.selectedIds = {};
        renderMain();
        return;
      }
      if (e.target.matches('[data-dqr-field]') && state.formDraft) {
        var field = e.target.getAttribute('data-dqr-field');
        state.formDraft[field] = e.target.value.trim();
        if (field === 'ruleType') {
          renderMain();
        }
        return;
      }
      if (e.target.matches('[data-dqr-param-attr]')) {
        captureFormDraft();
        return;
      }
      if (e.target.matches('[data-dqr-sql-theme]')) {
        handleSqlTheme(e.target);
        return;
      }
      if (e.target.matches('[data-dqr-sql-font]')) {
        handleSqlFont(e.target);
      }
    });

    pageEl.addEventListener('input', function (e) {
      if (e.target.matches('[data-dqr-tree-search]')) {
        state.treeKeyword = e.target.value;
        var tree = pageEl.querySelector('[data-dqr-tree]');
        if (tree) tree.innerHTML = renderTree();
        return;
      }
      if (e.target.matches('[data-dqr-layer-search]')) {
        captureFormDraft();
        state.layerKeyword = e.target.value;
        renderMain();
        var search = pageEl.querySelector('[data-dqr-layer-search]');
        if (search) search.focus();
        return;
      }
      if (e.target.matches('[data-dqr-field]') && state.formDraft) {
        state.formDraft[e.target.getAttribute('data-dqr-field')] = e.target.value;
        return;
      }
      if (e.target.matches('[data-dqr-param-name], [data-dqr-param-desc]')) {
        captureFormDraft();
        return;
      }
      if (e.target.matches('[data-dqr-sql-content]')) {
        syncGutter();
      }
    });

    pageEl.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && e.target.id === 'dqrKeywordInput') {
        var query = pageEl.querySelector('[data-dqr-action="query"]');
        if (query) query.click();
      }
      if (e.key === 'Escape' && state.view === 'form') {
        closeForm();
      }
    });
  }

  function resetState() {
    state.view = 'list';
    state.treeKey = 'system';
    state.treeKeyword = '';
    state.treeOpen = {
      system: true,
      'system-basic': true,
      'system-format': true,
      demo: true,
      'demo-dwd': true,
      business: true,
      'biz-order': true
    };
    state.selectedIds = {};
    state.page = 1;
    state.pageSize = 12;
    state.formMode = '';
    state.formId = '';
    state.formDraft = null;
    state.layerOpen = false;
    state.layerKeyword = '';
    state.layerTreeOpen = {};
    state.sqlSearchOpen = false;
    state.sqlTheme = 'dark';
    state.sqlFont = '14px';
    state.filters = { dbType: '', standard: '', ruleType: '', keyword: '' };
  }

  var html = '<div class="page-data-quality-rule">' +
    '<aside class="dqr-left-panel">' +
      '<div class="dqr-tree-search">' +
        '<input type="text" data-dqr-tree-search placeholder="关键字搜索" aria-label="关键字搜索">' +
        '<button type="button" aria-label="搜索目录"><i class="bi bi-search"></i></button>' +
      '</div>' +
      '<div class="dqr-tree-scroll"><ul class="dqr-tree" data-dqr-tree></ul></div>' +
    '</aside>' +
    '<section class="dqr-main-panel" data-dqr-main></section>' +
  '</div>';

  return {
    html: html,
    init: function () {
      pageEl = document.querySelector('.page-data-quality-rule');
      if (!pageEl) return;
      resetState();
      bindEvents();
      renderAll();
    }
  };
})();
