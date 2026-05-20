/**
 * 数据中台 V4.0 - 公共表详情视图
 */
window.DP = window.DP || {};
DP.components = DP.components || {};

DP.components.tableDetailView = (function () {
  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function normalizeItem(item) {
    item = item || {};
    var tableName = item.tableName || 'order_main';
    return {
      tableName: tableName,
      alias: item.alias || getAlias(tableName),
      comment: item.comment || getComment(tableName),
      metadataFill: item.metadataFill == null ? 100 : item.metadataFill,
      standardMap: item.standardMap == null ? 100 : item.standardMap,
      standardAudit: item.standardAudit == null ? 100 : item.standardAudit,
      dataQuality: item.dataQuality == null ? 85 : item.dataQuality,
      dataSource: item.dataSource || getDataSource(tableName),
      layer: item.layer || getLayer(tableName),
      recordCount: item.recordCount || getRecordCount(tableName),
      owner: item.owner || '张明',
      updateTime: item.updateTime || '2026-05-12 08:30:00'
    };
  }

  function getAlias(tableName) {
    var aliases = {
      order_main: '订单主表',
      order_detail: '订单明细表',
      order_payment: '订单支付记录',
      order_address: '收货地址表',
      order_status_log: '订单状态变更日志',
      order_refund: '订单退款记录',
      order_coupon: '订单优惠券关联',
      dwd_order_fact: '订单事实宽表',
      dws_order_daily: '订单日汇总表',
      ads_order_overview: '订单概览报表'
    };
    return aliases[tableName] || '订单主题表';
  }

  function getComment(tableName) {
    var comments = {
      order_main: '核心订单交易主表，记录所有订单基础信息',
      order_detail: '订单商品明细，包含SKU、数量、金额',
      order_payment: '支付流水、支付渠道、支付状态记录',
      order_address: '用户订单关联的收货地址信息',
      order_status_log: '记录订单状态流转的完整日志',
      order_refund: '退款申请、审核结果、退款金额明细',
      order_coupon: '订单优惠券使用与核销明细',
      dwd_order_fact: '关联用户、商品、支付的订单宽表',
      dws_order_daily: '按天汇总订单数、GMV、客单价等指标',
      ads_order_overview: '面向管理层的订单业务全局报表'
    };
    return comments[tableName] || '订单主题资产表，服务治理、查询和分析场景';
  }

  function getLayer(tableName) {
    if (tableName.indexOf('ods_') === 0 || tableName.indexOf('order_') === 0) return 'ODS';
    if (tableName.indexOf('dwd_') === 0) return 'DWD';
    if (tableName.indexOf('dws_') === 0) return 'DWS';
    if (tableName.indexOf('ads_') === 0) return 'ADS';
    if (tableName.indexOf('dim_') === 0) return 'DIM';
    return 'ODS';
  }

  function getDataSource(tableName) {
    if (tableName.indexOf('ads_') === 0) return 'dw_hive_ads';
    if (tableName.indexOf('dws_') === 0) return 'dw_hive_dws';
    if (tableName.indexOf('dwd_') === 0) return 'dw_hive_dwd';
    if (tableName.indexOf('dim_') === 0) return 'dw_hive_dim';
    return 'prod_mysql_master';
  }

  function getRecordCount(tableName) {
    var counts = {
      order_main: '1,438,920',
      order_detail: '3,892,105',
      order_payment: '1,205,680',
      order_address: '528,630',
      order_status_log: '5,620,340',
      order_refund: '89,450',
      order_coupon: '246,910',
      dwd_order_fact: '1,438,920',
      dws_order_daily: '12,580',
      ads_order_overview: '365'
    };
    return counts[tableName] || '128,640';
  }

  function getTableSize(tableName) {
    var sizes = {
      order_main: '2.8 GB',
      order_detail: '8.6 GB',
      order_payment: '1.9 GB',
      order_address: '760 MB',
      dwd_order_fact: '6.4 GB',
      dws_order_daily: '420 MB',
      ads_order_overview: '128 MB'
    };
    return sizes[tableName] || '680 MB';
  }

  function getStructureFields() {
    return [
      { index: 1, name: 'order_id', alias: '订单编号', type: 'bigint', length: '20', nullable: '否', primary: true, desc: '订单唯一标识' },
      { index: 2, name: 'user_id', alias: '用户ID', type: 'bigint', length: '20', nullable: '否', primary: false, desc: '下单用户ID' },
      { index: 3, name: 'order_no', alias: '订单号', type: 'varchar', length: '64', nullable: '否', primary: false, desc: '业务订单号' },
      { index: 4, name: 'order_status', alias: '订单状态', type: 'tinyint', length: '4', nullable: '否', primary: false, desc: '0待付款 1已付款 2已发货 3已完成' },
      { index: 5, name: 'total_amount', alias: '订单总金额', type: 'decimal', length: '12,2', nullable: '否', primary: false, desc: '订单应付总额' },
      { index: 6, name: 'pay_amount', alias: '实付金额', type: 'decimal', length: '12,2', nullable: '是', primary: false, desc: '用户实际支付金额' },
      { index: 7, name: 'pay_time', alias: '支付时间', type: 'datetime', length: '-', nullable: '是', primary: false, desc: '支付完成时间' },
      { index: 8, name: 'create_time', alias: '创建时间', type: 'datetime', length: '-', nullable: '否', primary: false, desc: '订单创建时间' },
      { index: 9, name: 'update_time', alias: '更新时间', type: 'datetime', length: '-', nullable: '否', primary: false, desc: '最后更新时间' }
    ];
  }

  function findStructureField(fieldName) {
    return getStructureFields().find(function (field) {
      return field.name === fieldName;
    }) || getStructureFields()[0];
  }

  function renderMetaRows(rows) {
    return rows.map(function (row) {
      if (row.group) return '<tr class="gt-meta-group"><td colspan="2">' + escapeHtml(row.group) + '</td></tr>';
      return '<tr><td class="gt-meta-name">' + escapeHtml(row.name) + '</td><td class="gt-meta-value">' + escapeHtml(row.value) + '</td></tr>';
    }).join('');
  }

  function renderTableMetaRows(groups) {
    return groups.map(function (group) {
      var rows = '<tr class="gt-meta-group"><td colspan="4">' + escapeHtml(group.title) + '</td></tr>';
      for (var i = 0; i < group.items.length; i += 2) {
        var first = group.items[i];
        var second = group.items[i + 1];
        rows += '<tr>' +
          '<td class="gt-meta-name">' + escapeHtml(first.name) + '</td>' +
          '<td class="gt-meta-value">' + escapeHtml(first.value) + '</td>' +
          (second
            ? '<td class="gt-meta-name">' + escapeHtml(second.name) + '</td><td class="gt-meta-value">' + escapeHtml(second.value) + '</td>'
            : '<td class="gt-meta-name"></td><td class="gt-meta-value"></td>') +
        '</tr>';
      }
      return rows;
    }).join('');
  }

  function renderTableMetaPanels(rawItem) {
    var item = normalizeItem(rawItem);
    var isHive = item.dataSource.indexOf('dw_hive') === 0;
    var refreshCycle = item.tableName.indexOf('_rt') >= 0 ? '实时写入' : 'T+1 日批';
    var groups = [
      { title: '业务分类', items: [{ name: '华润中心', value: '华润置地' }, { name: '业态', value: '商业地产' }] },
      { title: '主题分类', items: [{ name: '业务域', value: '客户域' }, { name: '业务主题', value: '订单交易' }, { name: '业务子主题', value: '订单基础信息' }, { name: '业务细分类别', value: '客户订单资产' }] },
      { title: '基础信息', items: [{ name: '表名', value: item.tableName }, { name: '表别名', value: item.alias }, { name: '表类型', value: item.layer === 'ODS' ? '贴源明细表' : '数仓主题表' }, { name: '数据源', value: item.dataSource }, { name: '数仓分层', value: item.layer }, { name: '负责人', value: item.owner }, { name: '表描述', value: item.comment }] },
      { title: '技术信息', items: [{ name: '存储引擎', value: isHive ? 'Hive ORC' : 'InnoDB' }, { name: '字符集', value: isHive ? 'UTF-8' : 'utf8mb4' }, { name: '主键字段', value: 'order_id' }, { name: '分区字段', value: isHive ? 'ds' : '-' }, { name: '字段数量', value: getStructureFields().length + ' 个' }, { name: '记录数', value: item.recordCount }, { name: '数据量', value: getTableSize(item.tableName) }, { name: '刷新周期', value: refreshCycle }, { name: '生命周期', value: '36 个月' }, { name: '存储位置', value: (isHive ? 'dw.customer.' : 'prod.order.') + item.tableName }] },
      { title: '管控信息', items: [{ name: '业务责任部门', value: '客户运营部' }, { name: '参与编制部门', value: '数据治理部' }, { name: '资产等级', value: '核心资产' }, { name: '标准映射率', value: item.standardMap + '%' }, { name: '标准稽查率', value: item.standardAudit + '%' }, { name: '数据质量分', value: item.dataQuality + '%' }, { name: '版本', value: 'V3.2' }, { name: '修订人', value: '张伟' }, { name: '修订时间', value: item.updateTime }] },
      { title: '其它', items: [{ name: '备注', value: '表级元数据已接入治理任务，需持续维护字段、标准和质量规则。' }] }
    ];

    return '<section class="gt-meta-panel">' +
      '<div class="gt-meta-table-wrap"><table class="gt-meta-table gt-meta-pair-table">' +
        '<colgroup><col class="gt-meta-col-name"><col class="gt-meta-col-value"><col class="gt-meta-col-name"><col class="gt-meta-col-value"></colgroup>' +
        '<tbody>' + renderTableMetaRows(groups) + '</tbody>' +
      '</table></div>' +
    '</section>';
  }

  function renderStructureRows() {
    return getStructureFields().map(function (field) {
      return '<tr>' +
        '<td>' + field.index + '</td>' +
        '<td class="td-link">' + escapeHtml(field.name) + '</td>' +
        '<td>' + escapeHtml(field.alias) + '</td>' +
        '<td>' + escapeHtml(field.type) + '</td>' +
        '<td>' + escapeHtml(field.length) + '</td>' +
        '<td>' + escapeHtml(field.nullable) + '</td>' +
        '<td>' + (field.primary ? '<i class="bi bi-key-fill" style="color:#faad14"></i>' : '-') + '</td>' +
        '<td>' + escapeHtml(field.desc) + '</td>' +
        '<td class="td-actions"><button class="ma-op-btn" type="button" data-tdv-field-detail="' + escapeHtml(field.name) + '"><i class="bi bi-eye"></i><span>查看详情</span></button></td>' +
      '</tr>';
    }).join('');
  }

  function renderFieldMetaRows(field) {
    var rows = [
      { group: '业务分类' },
      { name: '华润中心', value: '华润置地' },
      { name: '业态', value: '商业地产' },
      { group: '主题分类' },
      { name: '业务主题', value: '客户管理' },
      { name: '业务子主题', value: '客户信息' },
      { name: '业务细分类别', value: '客户基础信息' },
      { group: '基础信息' },
      { name: '标准项编码', value: 'MD20260511000' + field.index },
      { name: '中文名称', value: field.alias },
      { name: '英文名称', value: field.name },
      { name: '常用名称', value: field.alias },
      { name: '代码编号', value: field.name.toUpperCase() },
      { name: '代码名称', value: field.alias + '代码' },
      { group: '技术信息' },
      { name: '业务定义', value: field.desc },
      { name: '业务规则', value: field.nullable === '否' ? '该字段为必填项，入库前需完成非空校验。' : '该字段允许为空，展示和统计时需按业务口径处理。' },
      { name: '参考标准', value: '客户域数据标准 V1.1' },
      { name: '定义依据', value: '订单主题数据模型规范 V3.2' },
      { name: '数据类型', value: field.type },
      { name: '数据格式', value: field.type === 'datetime' ? 'yyyy-MM-dd HH:mm:ss' : field.type },
      { name: '数据长度', value: field.length },
      { group: '管控信息' },
      { name: '业务责任部门', value: '客户运营部' },
      { name: '参与编制部门', value: '数据治理部' },
      { name: '版本', value: 'V1.1' },
      { name: '修订人', value: '张伟' },
      { name: '修订时间', value: '2026-05-10 09:30:00' },
      { group: '其它' },
      { name: '备注', value: '字段详情与元数据属性表保持同一展示方式。' }
    ];
    return renderMetaRows(rows);
  }

  function renderStructureDrawer() {
    return '<div class="gt-field-drawer-mask" data-tdv-drawer-close></div>' +
      '<aside class="gt-field-drawer" id="gtFieldDrawer" aria-hidden="true">' +
        '<div class="gt-field-drawer-head">' +
          '<div><h3 data-tdv-field-title>字段详情</h3><p data-tdv-field-subtitle></p></div>' +
          '<button class="gt-field-drawer-close" type="button" data-tdv-drawer-close aria-label="关闭"><i class="bi bi-x-lg"></i></button>' +
        '</div>' +
        '<div class="gt-field-drawer-body" data-tdv-field-body></div>' +
      '</aside>';
  }

  function getQualityRateClass(rate) {
    if (rate < 60) return 'gt-quality-rate-low';
    if (rate < 80) return 'gt-quality-rate-mid';
    return 'gt-quality-rate-high';
  }

  function renderQualityRate(rate) {
    return '<span class="gt-quality-rate ' + getQualityRateClass(rate) + '">' +
      '<i style="width:' + Math.max(0, Math.min(100, rate)) + '%"></i>' +
      '<b>' + rate + '%</b>' +
    '</span>';
  }

  function getQualityRules() {
    return [
      { name: '订单编号非空校验', type: '完整性', field: 'order_id', desc: '主键订单编号不能为空', rate: 100, summary: '检查订单主键字段，未发现订单编号为空的数据，规则执行结果稳定。', problems: [] },
      { name: '用户ID非空校验', type: '完整性', field: 'user_id', desc: '下单用户ID不允许为空', rate: 97.8, summary: '发现少量订单缺少下单用户ID，影响客户归因、会员分析和后续画像关联。', problems: [{ order_id: '100013', user_id: 'NULL', order_no: 'ORD20260212013', order_status: '1', total_amount: '328.00', pay_amount: '328.00', pay_time: '2026-02-12 11:12', create_time: '2026-02-12 11:08', update_time: '2026-02-12 11:13', issueField: 'user_id', issue: '用户ID为空，不符合非空规则' }] },
      { name: '订单金额范围校验', type: '准确性', field: 'total_amount', desc: '订单总金额必须大于0', rate: 83.6, summary: '部分订单总金额为0或负数，可能来自退款冲正、异常测试单或上游同步错误。', problems: [{ order_id: '100018', user_id: '72018', order_no: 'ORD20260212018', order_status: '1', total_amount: '0.00', pay_amount: '0.00', pay_time: '2026-02-12 11:25', create_time: '2026-02-12 11:22', update_time: '2026-02-12 11:26', issueField: 'total_amount', issue: '订单总金额等于0，不符合金额大于0规则' }, { order_id: '100027', user_id: '61027', order_no: 'ORD20260212027', order_status: '3', total_amount: '-25.00', pay_amount: '-25.00', pay_time: '2026-02-12 12:10', create_time: '2026-02-12 12:08', update_time: '2026-02-12 12:30', issueField: 'total_amount', issue: '订单总金额为负数，需要核对冲正链路' }] },
      { name: '订单状态枚举校验', type: '一致性', field: 'order_status', desc: '订单状态值必须在0-3范围内', rate: 76.5, summary: '订单状态存在超出标准枚举范围的取值，需要同步检查业务系统状态码映射。', problems: [{ order_id: '100032', user_id: '80321', order_no: 'ORD20260212032', order_status: '5', total_amount: '168.00', pay_amount: '168.00', pay_time: '2026-02-12 12:42', create_time: '2026-02-12 12:39', update_time: '2026-02-12 12:45', issueField: 'order_status', issue: '状态值5不在0-3标准范围内' }, { order_id: '100039', user_id: '39128', order_no: 'ORD20260212039', order_status: '-1', total_amount: '96.00', pay_amount: 'NULL', pay_time: 'NULL', create_time: '2026-02-12 13:05', update_time: '2026-02-12 13:06', issueField: 'order_status', issue: '状态值-1不在0-3标准范围内' }] },
      { name: '订单号唯一性校验', type: '唯一性', field: 'order_no', desc: '业务订单号在表内必须唯一', rate: 58.2, summary: '订单号存在重复，属于高优先级质量问题，会影响订单去重、交易统计和对账结果。', problems: [{ order_id: '100041', user_id: '50128', order_no: 'ORD20260212041', order_status: '3', total_amount: '236.00', pay_amount: '236.00', pay_time: '2026-02-12 13:18', create_time: '2026-02-12 13:15', update_time: '2026-02-12 13:40', issueField: 'order_no', issue: '订单号与记录100042重复' }, { order_id: '100042', user_id: '50128', order_no: 'ORD20260212041', order_status: '3', total_amount: '236.00', pay_amount: '236.00', pay_time: '2026-02-12 13:19', create_time: '2026-02-12 13:16', update_time: '2026-02-12 13:41', issueField: 'order_no', issue: '订单号与记录100041重复' }] }
    ];
  }

  function renderQualityRuleRows() {
    return getQualityRules().map(function (rule) {
      return '<tr><td>' + escapeHtml(rule.name) + '</td><td>' + escapeHtml(rule.type) + '</td><td class="td-link">' + escapeHtml(rule.field) + '</td><td>' + escapeHtml(rule.desc) + '</td><td>' + renderQualityRate(rule.rate) + '</td></tr>';
    }).join('');
  }

  function renderQualityProblemRows(rule) {
    var fields = ['order_id', 'user_id', 'order_no', 'order_status', 'total_amount', 'pay_amount', 'pay_time', 'create_time', 'update_time'];
    if (!rule.problems.length) return '<tr class="gt-quality-empty-row"><td colspan="10">未发现不符合规则的数据</td></tr>';
    return rule.problems.map(function (item) {
      var cells = fields.map(function (field) {
        var cls = field === item.issueField ? ' class="gt-quality-error-cell"' : '';
        return '<td' + cls + '>' + escapeHtml(item[field]) + '</td>';
      }).join('');
      return '<tr>' + cells + '<td class="gt-quality-issue">' + escapeHtml(item.issue) + '</td></tr>';
    }).join('');
  }

  function renderQualityReport(rawItem) {
    var item = normalizeItem(rawItem);
    var rules = getQualityRules();
    var avgRate = Math.round(rules.reduce(function (sum, rule) { return sum + rule.rate; }, 0) / rules.length * 10) / 10;
    var problemCount = rules.reduce(function (sum, rule) { return sum + rule.problems.length; }, 0);
    var riskCount = rules.filter(function (rule) { return rule.rate < 80; }).length;
    var sections = rules.map(function (rule) {
      return '<section class="gt-quality-report-section">' +
        '<div class="gt-quality-section-head"><div><h4>' + escapeHtml(rule.name) + '</h4><p>' + escapeHtml(rule.summary) + '</p></div>' + renderQualityRate(rule.rate) + '</div>' +
        '<table class="ds-table gt-quality-problem-table"><thead><tr><th>order_id</th><th>user_id</th><th>order_no</th><th>order_status</th><th>total_amount</th><th>pay_amount</th><th>pay_time</th><th>create_time</th><th>update_time</th><th>质量问题说明</th></tr></thead><tbody>' + renderQualityProblemRows(rule) + '</tbody></table>' +
      '</section>';
    }).join('');

    return '<div class="gt-quality-report">' +
      '<section class="gt-quality-overview">' +
        '<div class="gt-quality-overview-text"><h4>' + escapeHtml(item.alias) + '质量稽查概述</h4><p>本次基于 ' + rules.length + ' 条质量规则完成稽查，平均通过率 ' + avgRate + '%。当前主要问题集中在订单号唯一性、订单状态枚举和金额范围校验，建议优先核查上游订单生成、状态码映射和异常金额处理链路。</p></div>' +
        '<div class="gt-quality-stat"><span>规则数</span><b>' + rules.length + '</b></div>' +
        '<div class="gt-quality-stat"><span>平均通过率</span><b>' + avgRate + '%</b></div>' +
        '<div class="gt-quality-stat"><span>问题样例</span><b>' + problemCount + '</b></div>' +
        '<div class="gt-quality-stat"><span>风险规则</span><b>' + riskCount + '</b></div>' +
      '</section>' + sections + '</div>';
  }

  function renderQualityTab(item) {
    return '<div class="ms-tab-content" data-content="quality">' +
      '<div class="ms-quality-sub-tabs gt-quality-sub-tabs"><a class="ms-qtab active" data-tdv-quality-tab="rules">质量规则</a><a class="ms-qtab" data-tdv-quality-tab="report">质量报告</a></div>' +
      '<div class="gt-quality-panel active" data-tdv-quality-panel="rules"><table class="ds-table gt-quality-rule-table"><thead><tr><th>规则名称</th><th>规则类型</th><th>检测字段</th><th>规则描述</th><th>通过率</th></tr></thead><tbody>' + renderQualityRuleRows() + '</tbody></table></div>' +
      '<div class="gt-quality-panel" data-tdv-quality-panel="report">' + renderQualityReport(item) + '</div>' +
    '</div>';
  }

  function renderStandardTab() {
    var rows = [
      ['order_id', '订单编号', 'STD_ORDER_001', '订单唯一标识', 100],
      ['user_id', '用户ID', 'STD_USER_001', '用户标识', 96.8],
      ['order_no', '订单号', 'STD_ORDER_002', '业务订单号', 88.5],
      ['order_status', '订单状态', 'STD_STATUS_002', '订单状态码', 74.2],
      ['total_amount', '订单总金额', 'STD_AMOUNT_001', '订单应付金额', 82.4],
      ['pay_amount', '实付金额', 'STD_AMOUNT_002', '订单实付金额', 90.6],
      ['pay_time', '支付时间', 'STD_TIME_001', '支付完成时间', 79.5],
      ['create_time', '创建时间', 'STD_TIME_002', '数据创建时间', 100],
      ['update_time', '更新时间', 'STD_TIME_003', '数据更新时间', 57.8]
    ].map(function (row) {
      return '<tr><td>' + row[0] + '</td><td>' + row[1] + '</td><td>' + row[2] + '</td><td>' + row[3] + '</td><td><span class="tag tag-green">已映射</span></td><td>' + renderQualityRate(row[4]) + '</td></tr>';
    }).join('');

    return '<div class="ms-tab-content" data-content="standard"><div class="ms-empty-hint"><p>标准映射关系与稽查结果</p><table class="ds-table" style="margin-top:12px;"><thead><tr><th>字段名</th><th>字段别名</th><th>标准编码</th><th>标准名称</th><th>映射状态</th><th>稽查结果（标准一致性）</th></tr></thead><tbody>' + rows + '</tbody></table></div></div>';
  }

  function renderPreviewTab() {
    return '<div class="ms-tab-content" data-content="preview">' +
      '<div class="ms-preview-toolbar"><span class="ms-preview-info">前 10 条记录预览</span></div>' +
      '<table class="ds-table"><thead><tr><th>order_id</th><th>user_id</th><th>order_no</th><th>order_status</th><th>total_amount</th><th>pay_amount</th><th>pay_time</th><th>create_time</th><th>update_time</th></tr></thead><tbody>' +
        '<tr><td>100001</td><td>50821</td><td>ORD20260212001</td><td>3</td><td>299.00</td><td>279.00</td><td>2026-02-12 09:15</td><td>2026-02-12 09:10</td><td>2026-02-12 09:42</td></tr>' +
        '<tr><td>100002</td><td>32156</td><td>ORD20260212002</td><td>1</td><td>1580.00</td><td>1580.00</td><td>2026-02-12 09:22</td><td>2026-02-12 09:20</td><td>2026-02-12 09:23</td></tr>' +
        '<tr><td>100003</td><td>78432</td><td>ORD20260212003</td><td>0</td><td>68.50</td><td>NULL</td><td>NULL</td><td>2026-02-12 09:35</td><td>2026-02-12 09:35</td></tr>' +
        '<tr><td>100004</td><td>12890</td><td>ORD20260212004</td><td>2</td><td>4350.00</td><td>4200.00</td><td>2026-02-12 08:50</td><td>2026-02-12 08:45</td><td>2026-02-12 10:18</td></tr>' +
        '<tr><td>100005</td><td>65213</td><td>ORD20260212005</td><td>3</td><td>128.00</td><td>118.00</td><td>2026-02-11 22:30</td><td>2026-02-11 22:25</td><td>2026-02-11 22:58</td></tr>' +
        '<tr><td>100006</td><td>43891</td><td>ORD20260212006</td><td>1</td><td>899.00</td><td>899.00</td><td>2026-02-12 10:05</td><td>2026-02-12 10:01</td><td>2026-02-12 10:06</td></tr>' +
        '<tr><td>100007</td><td>90217</td><td>ORD20260212007</td><td>0</td><td>49.90</td><td>NULL</td><td>NULL</td><td>2026-02-12 10:16</td><td>2026-02-12 10:16</td></tr>' +
        '<tr><td>100008</td><td>21784</td><td>ORD20260212008</td><td>3</td><td>236.00</td><td>236.00</td><td>2026-02-12 10:21</td><td>2026-02-12 10:19</td><td>2026-02-12 11:02</td></tr>' +
        '<tr><td>100009</td><td>67502</td><td>ORD20260212009</td><td>2</td><td>1288.00</td><td>1268.00</td><td>2026-02-12 10:30</td><td>2026-02-12 10:27</td><td>2026-02-12 11:35</td></tr>' +
        '<tr><td>100010</td><td>39016</td><td>ORD20260212010</td><td>1</td><td>76.80</td><td>76.80</td><td>2026-02-12 10:45</td><td>2026-02-12 10:43</td><td>2026-02-12 10:46</td></tr>' +
      '</tbody></table></div>';
  }

  function renderLineageCanvas(rawItem) {
    var item = normalizeItem(rawItem);
    var currentName = escapeHtml(item.tableName);
    return '<div class="gt-lineage-shell"><div class="gt-lineage-tip"><i class="bi bi-mouse"></i><span>按住 Ctrl + 滚轮缩放画板，拖动表节点调整位置</span></div><div class="gt-lineage-canvas" data-lineage-canvas><div class="gt-lineage-pan-surface" data-lineage-pan-surface></div><div class="gt-lineage-world" data-lineage-world>' +
      '<svg class="gt-lineage-svg" data-lineage-svg width="1180" height="430"><defs><marker id="gtLineageArrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z"></path></marker></defs><g data-lineage-links><path data-from="n1" data-to="n4"></path><text data-label-for="n1-n4">订单采集</text><path data-from="n2" data-to="n5"></path><text data-label-for="n2-n5">支付采集</text><path data-from="n3" data-to="n6"></path><text data-label-for="n3-n6">会员采集</text><path data-from="n4" data-to="n7"></path><text data-label-for="n4-n7">清洗入明细</text><path data-from="n5" data-to="n7"></path><text data-label-for="n5-n7">支付关联</text><path data-from="n6" data-to="n7"></path><text data-label-for="n6-n7">会员补全</text><path data-from="n7" data-to="n8"></path><text data-label-for="n7-n8">汇总加工</text><path data-from="n7" data-to="n9"></path><text data-label-for="n7-n9">宽表输出</text><path data-from="n8" data-to="n10"></path><text data-label-for="n8-n10">指标发布</text><path data-from="n9" data-to="n10"></path><text data-label-for="n9-n10">分析服务</text><path data-from="n9" data-to="n11"></path><text data-label-for="n9-n11">接口消费</text></g></svg>' +
      '<div class="gt-lineage-node gt-node-source" data-node-id="n1" style="left:24px;top:30px;"><i class="bi bi-database"></i><strong>erp_order_raw</strong><span>业务库 / 订单原始表</span></div><div class="gt-lineage-node gt-node-source" data-node-id="n2" style="left:24px;top:180px;"><i class="bi bi-credit-card"></i><strong>pay_callback_log</strong><span>支付系统 / 回调日志</span></div><div class="gt-lineage-node gt-node-source" data-node-id="n3" style="left:24px;top:330px;"><i class="bi bi-person-badge"></i><strong>crm_member_base</strong><span>CRM / 会员基础表</span></div><div class="gt-lineage-node" data-node-id="n4" style="left:290px;top:30px;"><i class="bi bi-box-arrow-in-down"></i><strong>ods_order_main</strong><span>ODS贴源层 / 订单采集</span></div><div class="gt-lineage-node" data-node-id="n5" style="left:290px;top:180px;"><i class="bi bi-box-arrow-in-down"></i><strong>ods_payment_record</strong><span>ODS贴源层 / 支付采集</span></div><div class="gt-lineage-node" data-node-id="n6" style="left:290px;top:330px;"><i class="bi bi-box-arrow-in-down"></i><strong>ods_member_profile</strong><span>ODS贴源层 / 会员采集</span></div><div class="gt-lineage-node gt-node-current" data-node-id="n7" style="left:550px;top:180px;"><i class="bi bi-table"></i><strong>' + currentName + '</strong><span>当前表 / 治理对象</span></div><div class="gt-lineage-node" data-node-id="n8" style="left:790px;top:90px;"><i class="bi bi-bar-chart"></i><strong>dws_order_daily</strong><span>DWS汇总层 / 日汇总</span></div><div class="gt-lineage-node" data-node-id="n9" style="left:790px;top:270px;"><i class="bi bi-intersect"></i><strong>dwd_order_user_wide</strong><span>DWD宽表 / 用户订单宽表</span></div><div class="gt-lineage-node gt-node-output" data-node-id="n10" style="left:1010px;top:90px;"><i class="bi bi-window-sidebar"></i><strong>ads_order_overview</strong><span>ADS应用层 / 经营看板</span></div><div class="gt-lineage-node gt-node-output" data-node-id="n11" style="left:1010px;top:270px;"><i class="bi bi-link-45deg"></i><strong>api_order_profile</strong><span>服务层 / 订单画像接口</span></div>' +
      '</div><div class="gt-lineage-minimap" data-lineage-minimap><div class="gt-mini-node" style="left:6px;top:8px;"></div><div class="gt-mini-node" style="left:6px;top:27px;"></div><div class="gt-mini-node" style="left:6px;top:46px;"></div><div class="gt-mini-node" style="left:33px;top:8px;"></div><div class="gt-mini-node" style="left:33px;top:27px;"></div><div class="gt-mini-node" style="left:33px;top:46px;"></div><div class="gt-mini-node current" style="left:65px;top:27px;"></div><div class="gt-mini-node" style="left:95px;top:17px;"></div><div class="gt-mini-node" style="left:95px;top:40px;"></div><div class="gt-mini-node output" style="left:125px;top:17px;"></div><div class="gt-mini-node output" style="left:125px;top:40px;"></div><div class="gt-mini-viewport" data-mini-viewport></div></div></div></div>';
  }

  function renderSecurityTab() {
    return '<div class="ms-tab-content" data-content="security"><table class="ds-table"><thead><tr><th>字段名</th><th>安全等级</th><th>规则类型</th><th>规则名称</th><th>规则描述</th></tr></thead><tbody><tr><td>user_id</td><td><span class="tag tag-yellow">L2-敏感</span></td><td>脱敏</td><td>用户ID展示脱敏</td><td>用户ID部分遮蔽显示</td></tr><tr><td>pay_amount</td><td><span class="tag tag-red">L3-机密</span></td><td>加密</td><td>支付金额加密存储</td><td>AES-256 加密存储</td></tr></tbody></table></div>';
  }

  function renderHistoryTab() {
    return '<div class="ms-tab-content" data-content="history"><table class="ds-table"><thead><tr><th>版本号</th><th>变更类型</th><th>变更内容</th><th>操作人</th><th>变更时间</th></tr></thead><tbody><tr><td>v3.2</td><td><span class="tag tag-green">新增</span></td><td>新增字段 coupon_id</td><td>张明</td><td>2026-02-10 14:20</td></tr><tr><td>v3.1</td><td><span class="tag tag-yellow">修改</span></td><td>修改 total_amount 精度为 12,2</td><td>王强</td><td>2026-01-28 09:15</td></tr><tr><td>v3.0</td><td><span class="tag tag-green">新增</span></td><td>新增字段 pay_channel</td><td>张明</td><td>2026-01-15 16:40</td></tr><tr><td>v2.0</td><td><span class="tag tag-red">删除</span></td><td>删除冗余字段 temp_order_flag</td><td>李婷</td><td>2025-11-20 10:00</td></tr><tr><td>v1.0</td><td><span class="tag tag-green">新增</span></td><td>新增订单主表</td><td>张明</td><td>2024-06-15 10:30</td></tr></tbody></table></div>';
  }

  function renderInner(rawItem, options) {
    var item = normalizeItem(rawItem);
    options = options || {};
    var backClass = options.backClass || 'btn btn-outline btn-sm';
    var backAttrs = options.backAttrs || '';
    var titleId = options.titleId ? ' id="' + options.titleId + '"' : ' id="msDetailTitle"';
    return '<div class="ms-detail-header">' +
        '<button class="' + backClass + '" type="button" ' + backAttrs + '><i class="bi bi-arrow-left"></i> 返回列表</button>' +
        '<span class="ms-detail-title"' + titleId + '>' + escapeHtml(item.tableName) + ' — ' + escapeHtml(item.alias) + '</span>' +
      '</div>' +
      '<div class="ms-detail-tabs"><a class="ms-dtab active" data-tab="meta-info">元数据</a><a class="ms-dtab" data-tab="structure">表结构</a><a class="ms-dtab" data-tab="preview">数据预览</a><a class="ms-dtab" data-tab="standard">标准稽查</a><a class="ms-dtab" data-tab="lineage">血缘关系</a><a class="ms-dtab" data-tab="quality">数据质量</a><a class="ms-dtab" data-tab="security">数据安全</a><a class="ms-dtab" data-tab="history">历史版本</a></div>' +
      '<div class="ms-detail-body">' +
        '<div class="ms-tab-content active" data-content="meta-info">' + renderTableMetaPanels(item) + '</div>' +
        '<div class="ms-tab-content" data-content="structure"><table class="ds-table"><thead><tr><th>序号</th><th>字段名</th><th>别名</th><th>类型</th><th>长度</th><th>允许空</th><th>主键</th><th>描述</th><th>操作</th></tr></thead><tbody>' + renderStructureRows() + '</tbody></table></div>' +
        renderStandardTab() +
        renderPreviewTab() +
        '<div class="ms-tab-content" data-content="lineage">' + renderLineageCanvas(item) + '</div>' +
        renderQualityTab(item) +
        renderSecurityTab() +
        renderHistoryTab() +
      '</div>' +
      renderStructureDrawer();
  }

  function render(rawItem, options) {
    return '<div class="gt-detail-view ms-detail-panel">' + renderInner(rawItem, options) + '</div>';
  }

  function openStructureDrawer(root, fieldName) {
    var field = findStructureField(fieldName);
    var detailView = root.closest('.gt-detail-view') || root.querySelector('.gt-detail-view') || root;
    var drawer = root.querySelector('#gtFieldDrawer');
    if (!drawer) return;
    var title = drawer.querySelector('[data-tdv-field-title]');
    var subtitle = drawer.querySelector('[data-tdv-field-subtitle]');
    var body = drawer.querySelector('[data-tdv-field-body]');
    if (title) title.textContent = field.name + ' — ' + field.alias;
    if (subtitle) subtitle.textContent = field.type + ' / 长度 ' + field.length + ' / 允许空：' + field.nullable;
    if (body) {
      body.innerHTML = '<section class="gt-meta-panel gt-drawer-meta"><div class="gt-meta-table-wrap"><table class="gt-meta-table"><tbody>' + renderFieldMetaRows(field) + '</tbody></table></div></section>';
    }
    drawer.setAttribute('aria-hidden', 'false');
    detailView.classList.add('gt-drawer-open');
  }

  function closeStructureDrawer(root) {
    var detailView = root.closest('.gt-detail-view') || root.querySelector('.gt-detail-view') || root;
    var drawer = root.querySelector('#gtFieldDrawer');
    if (drawer) drawer.setAttribute('aria-hidden', 'true');
    detailView.classList.remove('gt-drawer-open');
  }

  function updateLineageLinks(canvas) {
    var svg = canvas.querySelector('[data-lineage-svg]');
    if (!svg) return;
    svg.querySelectorAll('path[data-from][data-to]').forEach(function (path) {
      var from = canvas.querySelector('[data-node-id="' + path.dataset.from + '"]');
      var to = canvas.querySelector('[data-node-id="' + path.dataset.to + '"]');
      if (!from || !to) return;
      var x1 = parseFloat(from.style.left || 0) + from.offsetWidth;
      var y1 = parseFloat(from.style.top || 0) + from.offsetHeight / 2;
      var x2 = parseFloat(to.style.left || 0);
      var y2 = parseFloat(to.style.top || 0) + to.offsetHeight / 2;
      var bend = Math.max(70, (x2 - x1) / 2);
      path.setAttribute('d', 'M ' + x1 + ' ' + y1 + ' C ' + (x1 + bend) + ' ' + y1 + ', ' + (x2 - bend) + ' ' + y2 + ', ' + x2 + ' ' + y2);
      var label = svg.querySelector('[data-label-for="' + path.dataset.from + '-' + path.dataset.to + '"]');
      if (label) {
        label.setAttribute('x', (x1 + x2) / 2 - 30);
        label.setAttribute('y', (y1 + y2) / 2 - 14);
      }
    });
  }

  function getLineagePanState(canvas) {
    var scale = Number(canvas.dataset.scale || 1);
    var visualW = 1180 * scale;
    var visualH = 430 * scale;
    var marginLeft = Math.max(0, (canvas.clientWidth - visualW) / 2);
    var marginTop = Math.max(0, (canvas.clientHeight - visualH) / 2);
    var keepX = Math.min(120, canvas.clientWidth * 0.25, visualW * 0.25);
    var keepY = Math.min(90, canvas.clientHeight * 0.25, visualH * 0.25);
    return { scale: scale, visualW: visualW, visualH: visualH, marginLeft: marginLeft, marginTop: marginTop, minPanX: keepX - visualW - marginLeft, maxPanX: canvas.clientWidth - keepX - marginLeft, minPanY: keepY - visualH - marginTop, maxPanY: canvas.clientHeight - keepY - marginTop };
  }

  function updateLineageTransform(canvas) {
    var world = canvas.querySelector('[data-lineage-world]');
    if (!world) return;
    var state = getLineagePanState(canvas);
    var scale = state.scale;
    var panX = Math.max(state.minPanX, Math.min(state.maxPanX, Number(canvas.dataset.panX || 0)));
    var panY = Math.max(state.minPanY, Math.min(state.maxPanY, Number(canvas.dataset.panY || 0)));
    canvas.dataset.panX = String(panX);
    canvas.dataset.panY = String(panY);
    world.style.width = '1180px';
    world.style.height = '430px';
    world.style.marginLeft = state.marginLeft + 'px';
    world.style.marginTop = state.marginTop + 'px';
    world.style.left = panX + 'px';
    world.style.top = panY + 'px';
    world.style.transform = 'scale(' + scale + ')';
    updateLineageMinimap(canvas);
  }

  function updateLineageMinimap(canvas) {
    var viewport = canvas.querySelector('[data-mini-viewport]');
    if (!viewport) return;
    var state = getLineagePanState(canvas);
    var miniW = 150;
    var miniH = 60;
    var panX = Number(canvas.dataset.panX || 0);
    var panY = Number(canvas.dataset.panY || 0);
    var width = Math.max(20, Math.min(miniW, canvas.clientWidth / state.visualW * miniW));
    var height = Math.max(14, Math.min(miniH, canvas.clientHeight / state.visualH * miniH));
    viewport.style.width = width + 'px';
    viewport.style.height = height + 'px';
    viewport.style.left = Math.min(miniW - width, Math.max(0, -(state.marginLeft + panX) / state.visualW * miniW)) + 'px';
    viewport.style.top = Math.min(miniH - height, Math.max(0, -(state.marginTop + panY) / state.visualH * miniH)) + 'px';
  }

  function getLineageNodeBounds(canvas, node) {
    var state = getLineagePanState(canvas);
    var originX = state.marginLeft + Number(canvas.dataset.panX || 0);
    var originY = state.marginTop + Number(canvas.dataset.panY || 0);
    var padding = 16;
    var minLeft = (padding - originX) / state.scale;
    var minTop = (padding - originY) / state.scale;
    var maxLeft = (canvas.clientWidth - padding - originX) / state.scale - node.offsetWidth;
    var maxTop = (canvas.clientHeight - padding - originY) / state.scale - node.offsetHeight;
    return { minLeft: Math.min(minLeft, maxLeft), maxLeft: Math.max(minLeft, maxLeft), minTop: Math.min(minTop, maxTop), maxTop: Math.max(minTop, maxTop) };
  }

  function initLineage(root) {
    var canvas = root.querySelector('.gt-lineage-canvas');
    if (!canvas || canvas.dataset.ready === 'true') return;
    if (!canvas.clientWidth || !canvas.clientHeight) return;
    var dragSurface = canvas.querySelector('[data-lineage-pan-surface]') || canvas;
    canvas.dataset.ready = 'true';
    var fitScale = Math.min(1, (canvas.clientWidth - 48) / 1180, (canvas.clientHeight - 48) / 430);
    canvas.dataset.scale = String(Math.max(0.62, Math.floor(fitScale * 100) / 100));
    canvas.dataset.panX = '0';
    canvas.dataset.panY = '0';
    updateLineageLinks(canvas);
    updateLineageTransform(canvas);
    updateLineageMinimap(canvas);

    canvas.addEventListener('wheel', function (e) {
      if (!e.ctrlKey) return;
      e.preventDefault();
      var current = Number(canvas.dataset.scale || 1);
      var next = Math.min(1.8, Math.max(0.55, current + (e.deltaY < 0 ? 0.08 : -0.08)));
      canvas.dataset.scale = String(Math.round(next * 100) / 100);
      updateLineageTransform(canvas);
      updateLineageLinks(canvas);
      updateLineageMinimap(canvas);
    }, { passive: false });

    dragSurface.addEventListener('pointerdown', function (e) {
      if (e.button !== 0) return;
      if (e.target.closest('.gt-lineage-node') || e.target.closest('.gt-lineage-minimap')) return;
      e.preventDefault();
      dragSurface.setPointerCapture(e.pointerId);
      canvas.classList.add('is-panning');
      var startX = e.clientX;
      var startY = e.clientY;
      var startPanX = Number(canvas.dataset.panX || 0);
      var startPanY = Number(canvas.dataset.panY || 0);
      function move(ev) {
        canvas.dataset.panX = String(startPanX + ev.clientX - startX);
        canvas.dataset.panY = String(startPanY + ev.clientY - startY);
        updateLineageTransform(canvas);
      }
      function up(ev) {
        canvas.classList.remove('is-panning');
        dragSurface.releasePointerCapture(ev.pointerId);
        dragSurface.removeEventListener('pointermove', move);
        dragSurface.removeEventListener('pointerup', up);
        dragSurface.removeEventListener('pointercancel', up);
      }
      dragSurface.addEventListener('pointermove', move);
      dragSurface.addEventListener('pointerup', up);
      dragSurface.addEventListener('pointercancel', up);
    });

    canvas.querySelectorAll('.gt-lineage-node').forEach(function (node) {
      node.addEventListener('pointerdown', function (e) {
        e.preventDefault();
        node.setPointerCapture(e.pointerId);
        var scale = Number(canvas.dataset.scale || 1);
        var startX = e.clientX;
        var startY = e.clientY;
        var startLeft = parseFloat(node.style.left || 0);
        var startTop = parseFloat(node.style.top || 0);
        node.classList.add('dragging');
        function move(ev) {
          var bounds = getLineageNodeBounds(canvas, node);
          var nextLeft = startLeft + (ev.clientX - startX) / scale;
          var nextTop = startTop + (ev.clientY - startY) / scale;
          node.style.left = Math.max(bounds.minLeft, Math.min(bounds.maxLeft, nextLeft)) + 'px';
          node.style.top = Math.max(bounds.minTop, Math.min(bounds.maxTop, nextTop)) + 'px';
          updateLineageLinks(canvas);
        }
        function up(ev) {
          node.classList.remove('dragging');
          node.releasePointerCapture(ev.pointerId);
          node.removeEventListener('pointermove', move);
          node.removeEventListener('pointerup', up);
          node.removeEventListener('pointercancel', up);
        }
        node.addEventListener('pointermove', move);
        node.addEventListener('pointerup', up);
        node.addEventListener('pointercancel', up);
      });
    });
  }

  function bind(root) {
    if (!root || root.dataset.tdvBound === 'true') return;
    root.dataset.tdvBound = 'true';
    root.addEventListener('click', function (e) {
      var tab = e.target.closest('.gt-detail-view .ms-dtab, .ms-detail-panel .ms-dtab');
      if (tab && root.contains(tab)) {
        e.stopPropagation();
        closeStructureDrawer(root);
        var detailRoot = tab.closest('.gt-detail-view') || tab.closest('.ms-detail-panel') || root;
        detailRoot.querySelectorAll('.ms-dtab').forEach(function (item) { item.classList.remove('active'); });
        tab.classList.add('active');
        detailRoot.querySelectorAll('.ms-tab-content').forEach(function (content) { content.classList.remove('active'); });
        var target = tab.dataset.tab;
        var targetContent = detailRoot.querySelector('.ms-tab-content[data-content="' + target + '"]');
        if (targetContent) targetContent.classList.add('active');
        if (target === 'lineage') initLineage(detailRoot);
        return;
      }

      var fieldBtn = e.target.closest('[data-tdv-field-detail]');
      if (fieldBtn && root.contains(fieldBtn)) {
        e.stopPropagation();
        openStructureDrawer(root, fieldBtn.dataset.tdvFieldDetail || '');
        return;
      }

      var drawerClose = e.target.closest('[data-tdv-drawer-close]');
      if (drawerClose && root.contains(drawerClose)) {
        e.stopPropagation();
        closeStructureDrawer(root);
        return;
      }

      var qualityTab = e.target.closest('[data-tdv-quality-tab]');
      if (qualityTab && root.contains(qualityTab)) {
        e.stopPropagation();
        var qualityContent = qualityTab.closest('.ms-tab-content[data-content="quality"]');
        qualityTab.closest('.ms-quality-sub-tabs').querySelectorAll('.ms-qtab').forEach(function (item) { item.classList.remove('active'); });
        qualityTab.classList.add('active');
        if (qualityContent) {
          qualityContent.querySelectorAll('[data-tdv-quality-panel]').forEach(function (panel) { panel.classList.remove('active'); });
          var panel = qualityContent.querySelector('[data-tdv-quality-panel="' + qualityTab.dataset.tdvQualityTab + '"]');
          if (panel) panel.classList.add('active');
        }
      }
    });
  }

  return {
    bind: bind,
    render: render,
    renderInner: renderInner,
    initLineage: initLineage,
    normalizeItem: normalizeItem
  };
})();
