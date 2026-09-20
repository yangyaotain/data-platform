/**
 * 数据资产 / 数据建模。
 * 按参考系统实现数仓规划、模型管理、物化管理与逆向建模；全部为本地演示数据。
 */
window.DP = window.DP || {};
DP.pages = DP.pages || {};

DP.pages.dataModeling = (function () {
  'use strict';

  var root, store, state;
  var storageKey = 'dp.data-modeling.v3';
  var groupMeta = [
    { id: 'BDS', name: '业务库层', tone: 'blue' },
    { id: 'ODS', name: '贴源层', tone: 'cyan' },
    { id: 'PUBLIC', name: '公共层', tone: 'purple' },
    { id: 'ADS', name: '应用层', tone: 'green' },
    { id: 'DOP', name: '输出层', tone: 'orange' },
    { id: 'OTHER', name: '其他层', tone: 'gray' }
  ];
  var modelMethods = ['可视化建模', 'SQL建模', '数据集建模'];
  var planModelTypes = {
    BDS: [['BDS', '业务库层【BDS】']],
    ODS: [['ODS', '贴源层【ODS】']],
    PUBLIC: [['DIM', '维度层【DIM】'], ['DWD', '明细数据层【DWD】'], ['DWS', '汇总数据层【DWS】']],
    ADS: [['ADS', '应用数据层【ADS】']],
    DOP: [['DOP', '数据输出层【DOP】']],
    OTHER: [['OTHER', '其他层']]
  };
  var ruleVariables = ['数据源编码', '业务分层编码', '数仓分层编码', '数据用户', '更新标识', '自定义'];
  var databaseTypes = ['MySQL', 'PostgreSQL', 'Hive', 'StarRocks', 'Clickhouse', 'Oracle'];
  var tableTypes = ['业务表', '贴源表', '维度表', '明细表', '汇总表', '应用表', '输出表', '其他表'];
  var tableTypeByPlanType = { BDS: '业务表', ODS: '贴源表', DIM: '维度表', DWD: '明细表', DWS: '汇总表', ADS: '应用表', DOP: '输出表', OTHER: '其他表' };
  var updateTypes = ['按小时全量（hf）', '按小时增量（hi）', '按天全量（df）', '按天增量（di）', '按周全量（wf）', '按周增量（wi）', '按月全量（mf）', '按月增量（mi）'];
  var domains = ['交易域', '客户域', '供应链域', '财务域'];
  var reverseTableSubtypes = {
    '维度表': ['普通维度表', '枚举维度表', '层级维度表']
  };
  var reverseSourceTree = [
    { id: 'quality', name: '数据质量-报告', children: [
      { name: 'StarRocks分析库', code: 'quality_starrocks', type: 'StarRocks' },
      { name: 'MySQL质量报告库', code: 'quality_mysql', type: 'MySQL' }
    ] },
    { id: 'business', name: '业务系统', children: [
      { name: '订单交易库', code: 'trade_mysql', type: 'MySQL' },
      { name: '会员运营库', code: 'member_postgresql', type: 'PostgreSQL' },
      { name: '供应链业务库', code: 'scm_mysql8', type: 'MySQL8' },
      { name: '客户服务库', code: 'service_sqlserver', type: 'SqlServer' }
    ] }
  ];
  var materialSourceTree = [
    { id: 'business', name: '业务系统', children: [
      { name: '订单交易库', code: 'trade_mysql', type: 'MySQL' },
      { name: '会员运营库', code: 'member_postgresql', type: 'PostgreSQL' },
      { name: '财务结算库', code: 'finance_oracle', type: 'Oracle' },
      { name: '供应链业务库', code: 'scm_mysql8', type: 'MySQL8' },
      { name: '客户服务库', code: 'service_sqlserver', type: 'SqlServer' }
    ] },
    { id: 'warehouse', name: '数据仓库', children: [
      { name: 'ODS贴源库', code: 'ods_hive', type: 'Hive' },
      { name: 'DWD明细库', code: 'dwd_starrocks', type: 'StarRocks' },
      { name: 'DWS汇总库', code: 'dws_starrocks', type: 'StarRocks' },
      { name: 'ADS应用库', code: 'ads_clickhouse', type: 'Clickhouse' }
    ] },
    { id: 'realtime', name: '实时数据', children: [
      { name: '实时消息集群', code: 'realtime_kafka', type: 'Kafka' }
    ] }
  ];
  var dataStandards = [
    { code: 'order_00000004', englishName: 'REVENUE', alias: '当日收入', type: 'decimal', length: 18, precision: 2, remark: '当日收入' },
    { code: 'order_00000006', englishName: 'IR_PVMN', alias: '活跃资源标识', type: 'varchar', length: 64, precision: 0, remark: '活跃资源唯一标识' },
    { code: 'order_00000008', englishName: 'master_id', alias: '主数据编码', type: 'varchar', length: 32, precision: 0, remark: '主数据编码' },
    { code: 'order_00000009', englishName: 'cw_number', alias: '标价', type: 'decimal', length: 18, precision: 2, remark: '商品标准标价' },
    { code: 'order_00000010', englishName: 'UPDATE_TIME', alias: '更新时间', type: 'timestamp', length: 19, precision: 0, remark: '记录最后更新时间' },
    { code: 'order_00000011', englishName: 'IP', alias: '活跃资源IP信息', type: 'varchar', length: 32, precision: 0, remark: '活跃资源IP信息' },
    { code: 'order_00000012', englishName: 'CRETAE_TIME', alias: '创建时间', type: 'timestamp', length: 19, precision: 0, remark: '创建时间' },
    { code: 'order_00000007', englishName: 'ID', alias: '主键ID', type: 'bigint', length: 20, precision: 0, remark: '主键ID' },
    { code: 'order_00000014', englishName: 'DESCRIPTION', alias: '备注说明', type: 'varchar', length: 500, precision: 0, remark: '备注说明' },
    { code: 'order_00000015', englishName: 'create_date', alias: '创建日期时间', type: 'date', length: 10, precision: 0, remark: '创建日期时间' },
    { code: 'order_00000016', englishName: 'pay_amount', alias: '支付金额', type: 'decimal', length: 18, precision: 2, remark: '订单实际支付金额' },
    { code: 'order_00000017', englishName: 'order_status', alias: '订单状态', type: 'varchar', length: 20, precision: 0, remark: '订单全生命周期状态' },
    { code: 'order_00000018', englishName: 'customer_id', alias: '客户ID', type: 'varchar', length: 32, precision: 0, remark: '客户主数据唯一标识' },
    { code: 'order_00000001', englishName: 'REFUND_AMOUNT', alias: '退款金额', type: 'decimal', length: 18, precision: 2, remark: '订单实际退款金额' },
    { code: 'order_00000002', englishName: 'RECEIVER_PHONE', alias: '收货人手机号', type: 'varchar', length: 32, precision: 0, remark: '订单收货联系人手机号' },
    { code: 'order_00000003', englishName: 'CUSTOMER_LEVEL', alias: '客户等级', type: 'varchar', length: 20, precision: 0, remark: '客户当前运营等级' }
  ];
  var datasetPreviewColumns = ['order_id', 'customer_id', 'product_id', 'order_status', 'pay_amount', 'order_channel', 'province_code', 'biz_date', 'created_time', 'is_deleted'];
  var datasetPreviewRows = [
    ['ORD202609080001', 'CUS100238', 'SKU-A1024', '已支付', '1288.00', 'APP', '310000', '2026-09-08', '2026-09-08 08:01:16', '0'],
    ['ORD202609080002', 'CUS100517', 'SKU-B2088', '已发货', '356.50', '小程序', '440000', '2026-09-08', '2026-09-08 08:04:32', '0'],
    ['ORD202609080003', 'CUS100806', 'SKU-C3106', '待支付', '89.90', 'WEB', '110000', '2026-09-08', '2026-09-08 08:09:47', '0'],
    ['ORD202609080004', 'CUS101024', 'SKU-A1058', '已完成', '2199.00', 'APP', '330000', '2026-09-08', '2026-09-08 08:12:05', '0'],
    ['ORD202609080005', 'CUS101366', 'SKU-D4012', '已取消', '168.00', '门店', '320000', '2026-09-08', '2026-09-08 08:17:28', '0'],
    ['ORD202609080006', 'CUS101592', 'SKU-B2120', '已支付', '688.80', '小程序', '510000', '2026-09-08', '2026-09-08 08:23:41', '0'],
    ['ORD202609080007', 'CUS101873', 'SKU-E5007', '退款中', '459.00', 'APP', '420000', '2026-09-08', '2026-09-08 08:31:09', '0'],
    ['ORD202609080008', 'CUS102114', 'SKU-C3199', '已发货', '1024.00', 'WEB', '370000', '2026-09-08', '2026-09-08 08:38:52', '0'],
    ['ORD202609080009', 'CUS102405', 'SKU-A1096', '已完成', '79.90', '小程序', '350000', '2026-09-08', '2026-09-08 08:45:33', '0'],
    ['ORD202609080010', 'CUS102688', 'SKU-D4075', '已支付', '3168.00', 'APP', '110000', '2026-09-08', '2026-09-08 08:53:18', '0']
  ];

  function clone(value) { return JSON.parse(JSON.stringify(value)); }
  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (char) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char];
    });
  }
  function highlightSql(code) {
    var html = esc(code || '');
    html = html.replace(/(--.*)$/gm, '<span class="dp-sql-comment">$1</span>');
    html = html.replace(/('(?:''|[^'])*')/g, '<span class="dp-sql-string">$1</span>');
    html = html.replace(/(\$\{[^}]+\})/g, '<span class="dp-sql-var">$1</span>');
    html = html.replace(/\b(SELECT|FROM|WHERE|AND|OR|NOT|NULL|AS|CREATE|TABLE|INSERT|INTO|VALUES|GROUP|BY|HAVING|ORDER|JOIN|LEFT|RIGHT|INNER|ON|LIMIT|DISTINCT|COUNT|SUM|MAX|MIN|AVG|CASE|WHEN|THEN|ELSE|END)\b/gi, '<span class="dp-sql-keyword">$1</span>');
    return html;
  }
  function sqlLineNumbers(code) {
    var total = Math.max(1, String(code || '').split('\n').length), html = '';
    for (var i = 1; i <= total; i++) html += '<div>' + i + '</div>';
    return html;
  }
  function button(action, icon, label, attrs, cls) {
    return '<button type="button" class="' + (cls || 'btn btn-outline') + '" data-dm-action="' + action + '" ' + (attrs || '') + '>' +
      '<i class="bi bi-' + icon + '" aria-hidden="true"></i><span>' + esc(label) + '</span></button>';
  }
  function option(value, label, selected) {
    return '<option value="' + esc(value) + '"' + (String(value) === String(selected) ? ' selected' : '') + '>' + esc(label) + '</option>';
  }
  function selectControl(kind, value, items, placeholder, cls) {
    return '<select class="dm-control ' + (cls || '') + '" data-dm-' + kind + ' aria-label="' + esc(placeholder) + '">' +
      option('', placeholder, value) + items.map(function (item) {
        var pair = Array.isArray(item) ? item : [item, item];
        return option(pair[0], pair[1], value);
      }).join('') + '</select>';
  }
  function persist() {
    try { window.localStorage.setItem(storageKey, JSON.stringify(store)); } catch (error) { /* 保留内存状态。 */ }
  }
  function seedStore() {
    var plans = [
      ['P001', 'BDS', 'ORDER_BIZ', '订单交易系统', 'order_biz', '承载订单、支付与售后业务模型。'],
      ['P002', 'BDS', 'MEMBER_BIZ', '会员运营系统', 'member_biz', '承载会员档案与运营业务模型。'],
      ['P003', 'BDS', 'SCM_BIZ', '供应链协同系统', 'scm_biz', '承载采购、库存与供应商业务模型。'],
      ['P004', 'ODS', 'ORDER_ODS', '订单主题 ODS', 'order_ods', '订单交易数据按日增量贴源。'],
      ['P005', 'ODS', 'MEMBER_ODS', '客户主题 ODS', 'member_ods', '客户与会员数据全量贴源。'],
      ['P006', 'ODS', 'SCM_ODS', '库存主题 ODS', 'scm_ods', '库存流水与快照数据贴源。'],
      ['P007', 'PUBLIC', 'DIM', '公共维度 DIM', 'dim', '沉淀区域、商品与组织公共维度。'],
      ['P008', 'PUBLIC', 'DWD', '交易明细 DWD', 'dwd', '沉淀标准化交易事实明细。'],
      ['P009', 'PUBLIC', 'DWS', '主题汇总 DWS', 'dws', '沉淀交易、客户与供应链主题汇总。'],
      ['P010', 'ADS', 'TRADE_ADS', '经营分析 ADS', 'trade_ads', '支撑经营驾驶舱与交易分析。'],
      ['P011', 'ADS', 'MEMBER_ADS', '客户运营 ADS', 'member_ads', '支撑客户增长与精细化运营。'],
      ['P012', 'DOP', 'REPORT_DOP', '报表输出层', 'report_dop', '面向报表与数据服务统一输出。']
    ].map(function (row, index) {
      var type = row[1] === 'PUBLIC' ? row[4].toUpperCase() : row[1];
      return { id: row[0], group: row[1], code: row[2], name: row[3], englishName: row[4], remark: row[5], modelType: type, creator: index % 3 === 0 ? '陈嘉' : index % 3 === 1 ? '林晨' : '周宁', updatedAt: '2026-09-' + String(8 - index % 5).padStart(2, '0') + ' ' + String(9 + index % 7).padStart(2, '0') + ':2' + (index % 6) + ':18' };
    });
    var models = [
      ['M001', 'dwd_trade_order_detail_di', '交易订单明细', '表', 'StarRocks', '公共层/交易明细 DWD', '明细表', 'V3', true, '可视化建模', '交易域'],
      ['M002', 'dwd_trade_payment_detail_di', '支付交易明细', '表', 'StarRocks', '公共层/交易明细 DWD', '明细表', 'V2', true, 'SQL建模', '交易域'],
      ['M003', 'dws_trade_day_summary', '交易日汇总', '表', 'StarRocks', '公共层/主题汇总 DWS', '汇总表', 'V2', true, 'SQL建模', '交易域'],
      ['M004', 'dws_member_profile', '会员画像宽表', '表', 'StarRocks', '公共层/主题汇总 DWS', '汇总表', 'V3', true, '数据集建模', '客户域'],
      ['M005', 'dim_region', '区域维度', '表', 'StarRocks', '公共层/公共维度 DIM', '维度表', 'V1', true, '可视化建模', '客户域'],
      ['M006', 'dim_product', '商品维度', '表', 'StarRocks', '公共层/公共维度 DIM', '维度表', 'V2', true, '可视化建模', '供应链域'],
      ['M007', 'ads_trade_operation_dashboard', '交易经营看板', '表', 'Clickhouse', '应用层/经营分析 ADS', '应用表', 'V2', true, '数据集建模', '交易域'],
      ['M008', 'ads_member_operation', '客户运营分析', '表', 'Clickhouse', '应用层/客户运营 ADS', '应用表', 'V1', false, 'SQL建模', '客户域'],
      ['M009', 'ods_trade_order_di', '订单贴源模型', '表', 'Hive', '贴源层/订单主题 ODS', '贴源表', 'V3', true, '可视化建模', '交易域'],
      ['M010', 'ods_member_info_df', '会员贴源模型', '表', 'Hive', '贴源层/客户主题 ODS', '贴源表', 'V1', false, '可视化建模', '客户域'],
      ['M011', 'dwd_inventory_flow_di', '库存流水明细', '表', 'StarRocks', '公共层/交易明细 DWD', '明细表', 'V1', false, 'SQL建模', '供应链域'],
      ['M012', 'report_trade_monthly', '交易月报输出', '视图', 'PostgreSQL', '输出层/报表输出层', '输出表', 'V1', true, '数据集建模', '交易域']
    ].map(function (row) {
      return { id: row[0], name: row[1], alias: row[2], attribute: row[3], dbType: row[4], layer: row[5], tableType: row[6], version: row[7], materialized: row[8], method: row[9], domain: row[10], updateType: '按天增量（di）', remark: row[2] + '模型，统一服务于企业数据资产分析。', fields: defaultFields(row[10]), sql: defaultSql(row[1], row[10]) };
    });
    return {
      version: 3,
      plans: plans,
      rules: [
        { id: 'R001', planId: 'P004', name: 'ODS 增量表命名', template: 'ODS_${数据源编码}_${自定义}_${更新标识}', enabled: true },
        { id: 'R002', planId: 'P008', name: 'DWD 明细表命名', template: 'DWD_${业务分层编码}_${自定义}_${更新标识}', enabled: true },
        { id: 'R003', planId: 'P009', name: 'DWS 汇总表命名', template: 'DWS_${业务分层编码}_${自定义}_${更新标识}', enabled: true }
      ],
      models: models,
      materialRuns: [
        { id: 'MR001', source: 'DWD明细库', project: '数据中台项目', environment: '生产', mode: '增量发布', status: '执行成功', total: 6, success: 6, failed: 0, remark: '交易明细模型日常发布', time: '2026-09-08 08:35:26' },
        { id: 'MR002', source: 'DWS汇总库', project: '经营分析项目', environment: '生产', mode: '增量发布', status: '执行成功', total: 4, success: 4, failed: 0, remark: '主题汇总模型例行发布', time: '2026-09-08 07:12:41' },
        { id: 'MR003', source: 'ADS应用库', project: '经营分析项目', environment: '测试', mode: '全量发布', status: '执行中', total: 3, success: 2, failed: 0, remark: '经营看板模型测试发布', time: '2026-09-08 10:18:03' },
        { id: 'MR004', source: 'ODS贴源库', project: '数据中台项目', environment: '生产', mode: '增量发布', status: '执行失败', total: 5, success: 4, failed: 1, remark: '会员贴源模型发布', time: '2026-09-07 23:30:18' },
        { id: 'MR005', source: 'DWD明细库', project: '供应链分析项目', environment: '开发', mode: '全量发布', status: '执行成功', total: 2, success: 2, failed: 0, remark: '库存主题模型首次发布', time: '2026-09-07 17:45:39' }
      ],
      reverseJobs: [
        { id: 'J001', name: '订单交易模型逆向同步', status: '运行中', source: '订单交易库', layer: '业务库层/订单交易系统', tableType: '业务表', tableSubtype: '', domain: '交易域', executeType: '增量更新', matchLogic: '不区分大小写', rules: ['custom'], rule: '自定义(系统规则)', frequency: '每天 02:30:00', operator: '陈嘉', updatedAt: '2026-09-08 09:14:36', runs: 18, success: 86, failed: 0 },
        { id: 'J002', name: '客户主题模型逆向同步', status: '已停止', source: '会员运营库', layer: '业务库层/会员运营系统', tableType: '业务表', tableSubtype: '', domain: '客户域', executeType: '全量覆盖', matchLogic: '不区分大小写', rules: ['custom'], rule: '自定义(系统规则)', frequency: '每周 周一 03:00:00', operator: '林晨', updatedAt: '2026-09-07 16:29:58', runs: 6, success: 32, failed: 1 },
        { id: 'J003', name: '供应链模型逆向同步', status: '运行中', source: '供应链业务库', layer: '业务库层/供应链协同系统', tableType: '业务表', tableSubtype: '', domain: '供应链域', executeType: '增量更新', matchLogic: '区分大小写', rules: ['custom'], rule: '自定义(系统规则)', frequency: '每天 04:10:00', operator: '周宁', updatedAt: '2026-09-08 08:50:12', runs: 12, success: 54, failed: 0 }
      ],
      pendingMaterialIds: []
    };
  }
  function defaultFields(domain) {
    var prefix = domain === '客户域' ? 'member' : domain === '供应链域' ? 'product' : 'order';
    return [
      { standard: 'custom', name: prefix + '_id', alias: domain === '客户域' ? '会员标识' : domain === '供应链域' ? '商品标识' : '订单标识', type: 'varchar', length: 64, precision: 0, defaultValue: '', required: true, primary: true, auto: false, remark: '业务主键' },
      standardField('order_00000008', { required: true }),
      standardField('order_00000010', { required: true })
    ];
  }
  function defaultDatasetFields() {
    return [
      { name: 'order_id', alias: '订单编号', type: 'varchar', length: 32, precision: 0, defaultValue: '', required: true, primary: true, auto: false, remark: '订单唯一编号' },
      { name: 'customer_id', alias: '客户ID', type: 'varchar', length: 32, precision: 0, defaultValue: '', required: true, primary: false, auto: false, remark: '客户主数据唯一标识' },
      { name: 'product_id', alias: '商品ID', type: 'varchar', length: 32, precision: 0, defaultValue: '', required: true, primary: false, auto: false, remark: '商品主数据唯一标识' },
      { name: 'order_status', alias: '订单状态', type: 'varchar', length: 20, precision: 0, defaultValue: '', required: true, primary: false, auto: false, remark: '订单当前业务状态' },
      { name: 'pay_amount', alias: '支付金额', type: 'decimal', length: 18, precision: 2, defaultValue: '0.00', required: true, primary: false, auto: false, remark: '订单实际支付金额' },
      { name: 'order_channel', alias: '下单渠道', type: 'varchar', length: 20, precision: 0, defaultValue: '', required: false, primary: false, auto: false, remark: '订单来源渠道' },
      { name: 'province_code', alias: '省份编码', type: 'varchar', length: 12, precision: 0, defaultValue: '', required: false, primary: false, auto: false, remark: '收货地址省级行政区划编码' },
      { name: 'biz_date', alias: '业务日期', type: 'date', length: 10, precision: 0, defaultValue: '', required: true, primary: false, auto: false, remark: '订单归属业务日期' },
      { name: 'created_time', alias: '创建时间', type: 'timestamp', length: 19, precision: 0, defaultValue: 'CURRENT_TIMESTAMP', required: true, primary: false, auto: false, remark: '订单记录创建时间' },
      { name: 'is_deleted', alias: '删除标识', type: 'tinyint', length: 1, precision: 0, defaultValue: '0', required: true, primary: false, auto: false, remark: '逻辑删除标识：0 否，1 是' }
    ];
  }
  function defaultSql(name, domain) {
    return 'SELECT\n  biz_id,\n  org_code,\n  biz_date,\n  update_time\nFROM ods.' + (domain === '客户域' ? 'ods_member_info_df' : domain === '供应链域' ? 'ods_scm_inventory_di' : 'ods_trade_order_di') + "\nWHERE dt = '${biz_date}'" + (name.indexOf('summary') >= 0 ? '\nGROUP BY biz_date, org_code' : '') + ';';
  }
  function loadStore() {
    try {
      var saved = JSON.parse(window.localStorage.getItem(storageKey) || 'null');
      if (saved && saved.version === 3 && Array.isArray(saved.plans) && Array.isArray(saved.models)) {
        if (!Array.isArray(saved.pendingMaterialIds)) saved.pendingMaterialIds = [];
        return saved;
      }
    } catch (error) { /* 使用内置数据。 */ }
    return seedStore();
  }
  function toast(message, tone) {
    var old = document.querySelector('.dm-toast');
    if (old) old.remove();
    var box = document.createElement('div');
    box.className = 'dm-toast ' + (tone || 'success');
    box.innerHTML = '<i class="bi bi-' + (tone === 'warning' ? 'exclamation-circle' : 'check-circle') + '"></i><span>' + esc(message) + '</span>';
    document.body.appendChild(box);
    window.setTimeout(function () { if (box.parentNode) box.remove(); }, 2400);
  }
  function findById(list, id) { return list.filter(function (item) { return item.id === id; })[0]; }
  function groupName(id) { var group = findById(groupMeta, id); return group ? group.name : '其他层'; }
  function planPath(plan) { return groupName(plan.group) + '/' + plan.name; }
  function planByPath(path) { return store.plans.filter(function (plan) { return planPath(plan) === path; })[0]; }
  function linkedTableType(plan) { return plan ? (tableTypeByPlanType[plan.modelType] || '其他表') : '' ; }
  function findStandard(code) { return dataStandards.filter(function (item) { return item.code === code; })[0]; }
  function standardLabel(code) {
    if (!code || code === 'custom') return '自定义';
    var standard = findStandard(code);
    return standard ? standard.code + '（' + standard.alias + '）' : '自定义';
  }
  function standardField(code, extras) {
    var standard = findStandard(code);
    var value = standard ? { standard: standard.code, name: standard.englishName, alias: standard.alias, type: standard.type, length: standard.length, precision: standard.precision, defaultValue: '', required: false, primary: false, auto: false, remark: standard.remark } : { standard: 'custom', name: '', alias: '', type: 'varchar', length: 64, precision: 0, defaultValue: '', required: false, primary: false, auto: false, remark: '' };
    return Object.assign(value, extras || {});
  }
  function applyStandard(fieldValue, code) {
    if (code === 'custom') { fieldValue.standard = 'custom'; return true; }
    var standard = findStandard(code);
    if (!standard) return false;
    fieldValue.standard = standard.code;
    fieldValue.name = standard.englishName;
    fieldValue.alias = standard.alias;
    fieldValue.type = standard.type;
    fieldValue.length = standard.length;
    fieldValue.precision = standard.precision;
    fieldValue.defaultValue = '';
    fieldValue.remark = standard.remark;
    return true;
  }
  function statusTag(status) {
    var cls = /成功|运行中|已物化|已启用/.test(status) ? 'green' : /失败/.test(status) ? 'red' : /执行中|物化中/.test(status) ? 'blue' : 'gray';
    return '<span class="dm-status ' + cls + '">' + esc(status) + '</span>';
  }
  function pageHeader(icon, title, actions) {
    return '<header class="dm-page-head"><h2><i class="bi bi-' + icon + '"></i><span>' + esc(title) + '</span></h2><div class="dm-head-actions">' + (actions || '') + '</div></header>';
  }
  function field(label, control, required, wide, hint) {
    return '<div class="dm-form-row' + (wide ? ' wide' : '') + '"><label>' + (required ? '<b>*</b>' : '') + esc(label) + '</label><div class="dm-form-control-wrap">' + control + (hint ? '<small><i class="bi bi-info-circle"></i>' + esc(hint) + '</small>' : '') + '</div></div>';
  }
  function inputDraft(scope, fieldName, value, placeholder, extra) {
    return '<input class="dm-control" type="text" data-dm-draft="' + scope + '.' + fieldName + '" value="' + esc(value) + '" placeholder="' + esc(placeholder || '') + '" ' + (extra || '') + '>';
  }
  function selectDraft(scope, fieldName, value, items, placeholder, extra) {
    return '<select class="dm-control" data-dm-draft="' + scope + '.' + fieldName + '" ' + (extra || '') + '>' + option('', placeholder || '请选择', value) + items.map(function (item) { var pair = Array.isArray(item) ? item : [item, item]; return option(pair[0], pair[1], value); }).join('') + '</select>';
  }
  function navigate(key, opts) {
    var link = document.querySelector('[data-menu="' + key + '"]');
    if (link && DP.setActiveMenu) {
      DP.setActiveMenu(link);
      var parent = link.closest('.menu-item.has-sub');
      if (parent) parent.classList.add('open');
    }
    DP.showPage(key, opts || {});
  }

  function planRules(planId) { return store.rules.filter(function (rule) { return rule.planId === planId; }); }
  function renderPlanList() {
    var sections = groupMeta.map(function (group) {
      var cards = store.plans.filter(function (plan) { return plan.group === group.id; });
      return '<section class="dm-plan-lane tone-' + group.tone + '"><div class="dm-lane-title"><i class="bi bi-inboxes-fill"></i><strong>' + esc(group.name) + '</strong><span>' + cards.length + '</span></div><div class="dm-plan-grid">' +
        (cards.length ? cards.map(function (plan) {
          return '<article class="dm-plan-card"><div class="dm-plan-card-main"><h3>' + esc(plan.name) + '</h3><strong>' + esc(plan.englishName) + '</strong><p>' + esc(plan.remark) + '</p></div><footer><span>创建者：' + esc(plan.creator) + '</span><span>' + esc(plan.updatedAt) + '</span><div>' + button('edit-plan', 'pencil-square', '编辑', 'data-id="' + plan.id + '"', 'dm-link-btn') + button('delete-plan', 'trash3', '删除', 'data-id="' + plan.id + '"', 'dm-link-btn danger') + '</div></footer></article>';
        }).join('') : '<div class="dm-lane-empty"><i class="bi bi-inbox"></i><span>暂无分层</span></div>') + '</div></section>';
    }).join('');
    return pageHeader('building', '数仓规划', button('new-plan', 'plus-lg', '新建分层', '', 'btn btn-primary')) + '<div class="dm-plan-board">' + sections + '</div>';
  }
  function renderRuleEditRow(rule) {
    return '<tr class="dm-rule-edit-row"><td><input class="dm-field-control" type="text" data-dm-rule-field="name" value="' + esc(rule.name) + '" placeholder="请输入规则名称"></td>' +
      '<td><input class="dm-field-control dm-rule-template-input" type="text" data-dm-rule-field="template" data-dm-rule-template value="' + esc(rule.template) + '" placeholder="例如：ODS_${数据源编码}_${自定义}_${更新标识}"></td>' +
      '<td><select class="dm-field-control" data-dm-rule-field="enabled">' + option('true', '启用', rule.enabled ? 'true' : 'false') + option('false', '停用', rule.enabled ? 'true' : 'false') + '</select></td>' +
      '<td><div class="dm-row-actions">' + button('save-rule', 'check-lg', '保存', '', 'dm-link-btn') + button('cancel-rule', 'x-lg', '取消', '', 'dm-link-btn') + '</div></td></tr>';
  }
  function renderRuleViewRow(rule) {
    return '<tr><td><strong>' + esc(rule.name) + '</strong></td><td><code>' + esc(rule.template) + '</code></td><td>' + statusTag(rule.enabled ? '已启用' : '已停用') + '</td><td><div class="dm-row-actions">' + button('edit-rule', 'pencil-square', '编辑', 'data-id="' + rule.id + '"', 'dm-link-btn') + button('delete-rule', 'trash3', '删除', 'data-id="' + rule.id + '"', 'dm-link-btn danger') + '</div></td></tr>';
  }
  function renderRuleTable(planId) {
    var keyword = (state.ruleKeyword || '').trim().toLowerCase();
    var rules = planRules(planId).filter(function (rule) { return !keyword || (rule.name + ' ' + rule.template).toLowerCase().indexOf(keyword) >= 0 || (state.ruleEdit && state.ruleEdit.id === rule.id); });
    var rows = rules.map(function (rule) { return state.ruleEdit && state.ruleEdit.id === rule.id ? renderRuleEditRow(state.ruleEdit) : renderRuleViewRow(rule); }).join('');
    if (state.ruleEdit && !state.ruleEdit.id && state.ruleEdit.planId === planId) rows += renderRuleEditRow(state.ruleEdit);
    return '<section class="dm-section"><div class="dm-section-title dm-rule-title"><h3><i class="bi bi-file-earmark-check"></i>建模规范</h3><div class="dm-rule-vars"><span>可用变量（双击插入）：</span>' +
      ruleVariables.map(function (item) { return '<button type="button" data-dm-rule-variable data-value="${' + item + '}" title="双击插入规则模板">' + esc(item) + '</button>'; }).join('') + '</div></div>' +
      '<div class="dm-inline-query"><input class="dm-control" type="search" data-dm-rule-keyword value="' + esc(state.ruleKeywordDraft || '') + '" placeholder="表规则名称 / 规则模板"><button class="btn btn-primary" type="button" data-dm-action="rule-query"><i class="bi bi-search"></i><span>查询</span></button></div>' +
      '<div class="dm-table-wrap"><table class="ds-table dm-rule-table"><thead><tr><th>表规则名称</th><th>规则模板</th><th>启用状态</th><th>操作 ' + button('new-rule', 'plus-circle', '新增规则', state.ruleEdit ? 'disabled' : '', 'dm-th-action') + '</th></tr></thead><tbody>' +
      (rows || '<tr><td colspan="4"><div class="dm-empty"><i class="bi bi-file-earmark-x"></i><span>当前分层暂无建模规范</span></div></td></tr>') + '</tbody></table></div></section>';
  }
  function renderPlanForm() {
    var draft = state.planForm;
    var actions = button('back-plan', 'arrow-left', '返回') + button('save-plan', 'floppy', '保存', '', 'btn btn-primary');
    return pageHeader('pencil-square', draft.id ? '编辑数仓分层' : '新建数仓分层', actions) +
      '<section class="dm-section"><div class="dm-section-title"><h3><i class="bi bi-card-checklist"></i>基本信息</h3></div><div class="dm-form-grid">' +
      field('编码', inputDraft('plan', 'code', draft.code, '英文字母、数字或下划线', 'maxlength="100"'), true, true, '唯一标识数仓分层，最大长度为 100 个字符。') +
      field('英文名', inputDraft('plan', 'englishName', draft.englishName, '请输入英文名', 'maxlength="100"'), true, false) +
      field('中文名', inputDraft('plan', 'name', draft.name, '请输入中文名', 'maxlength="100"'), true, false) +
      field('分类归属', selectDraft('plan', 'group', draft.group, groupMeta.map(function (g) { return [g.id, g.name]; }), '请选择'), true, false, '分类归属决定模型类型的可选值。') +
      field('模型类型', selectDraft('plan', 'modelType', draft.modelType, planModelTypes[draft.group] || [], '请选择'), true, false, '模型类型随分类归属联动。') +
      field('备注', '<textarea class="dm-control dm-textarea" data-dm-draft="plan.remark" maxlength="500" placeholder="请输入分层说明">' + esc(draft.remark) + '</textarea>', false, true) +
      '</div></section>' + renderRuleTable(draft.id || '__new__');
  }
  function renderPlan() { return state.planForm ? renderPlanForm() : renderPlanList(); }

  function treeNodes() {
    var keyword = state.treeKeyword.trim().toLowerCase();
    return groupMeta.slice(0, 4).map(function (group) {
      var children = store.plans.filter(function (plan) { return plan.group === group.id && (!keyword || (plan.name + ' ' + plan.englishName + ' ' + plan.code).toLowerCase().indexOf(keyword) >= 0); });
      var groupMatch = !keyword || group.name.toLowerCase().indexOf(keyword) >= 0;
      return { group: group, children: groupMatch && keyword ? store.plans.filter(function (plan) { return plan.group === group.id; }) : children };
    }).filter(function (item) { return !keyword || item.children.length || item.group.name.toLowerCase().indexOf(keyword) >= 0; });
  }
  function renderModelTree() {
    var nodes = treeNodes();
    return '<div class="dm-tree-list">' + (nodes.length ? nodes.map(function (item) {
      var groupSelected = state.modelLayer === item.group.id;
      return '<div class="dm-tree-group"><button type="button" class="dm-tree-row group' + (groupSelected ? ' active' : '') + '" data-dm-action="select-layer" data-layer="' + item.group.id + '"><i class="bi bi-chevron-down"></i><i class="bi bi-globe2"></i><span>' + esc(item.group.name) + '</span><small>' + item.children.length + '</small></button><div class="dm-tree-children">' + item.children.map(function (plan) {
        var value = planPath(plan);
        return '<button type="button" class="dm-tree-row' + (state.modelLayer === value ? ' active' : '') + '" data-dm-action="select-layer" data-layer="' + esc(value) + '"><i class="bi bi-folder2"></i><span>' + esc(plan.name) + '</span></button>';
      }).join('') + '</div></div>';
    }).join('') : '<div class="dm-empty compact"><i class="bi bi-search"></i><span>没有匹配的分层</span></div>') + '</div>';
  }
  function matchLayer(model) {
    if (!state.modelLayer) return true;
    if (state.modelLayer.indexOf('/') >= 0) return model.layer === state.modelLayer;
    return model.layer.indexOf(groupName(state.modelLayer) + '/') === 0;
  }
  function filteredModels() {
    var f = state.modelFilters;
    return store.models.filter(function (model) {
      var material = model.materialized ? '已物化' : '未物化';
      var keyword = state.modelKeyword.toLowerCase();
      return matchLayer(model) && (!f.version || model.version === f.version) && (!f.method || model.method === f.method) && (!f.material || material === f.material) && (!f.attribute || model.attribute === f.attribute) && (!f.dbType || model.dbType === f.dbType) && (!f.tableType || model.tableType === f.tableType) && (!keyword || (model.name + ' ' + model.alias).toLowerCase().indexOf(keyword) >= 0);
    });
  }
  function renderModelFilters() {
    var f = state.modelFilters;
    return '<div class="dm-filter-grid">' +
      '<label><span>版本</span>' + selectControl('model-filter="version"', f.version, ['V1', 'V2', 'V3'], '全部版本') + '</label>' +
      '<label><span>建模类型</span>' + selectControl('model-filter="method"', f.method, modelMethods, '全部类型') + '</label>' +
      '<label><span>物化状态</span>' + selectControl('model-filter="material"', f.material, ['已物化', '未物化'], '全部状态') + '</label>' +
      '<label><span>属性</span>' + selectControl('model-filter="attribute"', f.attribute, ['表', '视图'], '全部属性') + '</label>' +
      '<label><span>数据库类型</span>' + selectControl('model-filter="dbType"', f.dbType, databaseTypes, '全部数据库') + '</label>' +
      '<label><span>表类型</span>' + selectControl('model-filter="tableType"', f.tableType, tableTypes, '全部表类型') + '</label>' +
      '<div class="dm-keyword"><input class="dm-control" type="search" data-dm-model-keyword value="' + esc(state.modelKeywordDraft) + '" placeholder="英文名称 / 别名"><button class="btn btn-primary" type="button" data-dm-action="model-query"><i class="bi bi-search"></i><span>查询</span></button><button class="btn btn-outline" type="button" data-dm-action="model-reset"><i class="bi bi-arrow-counterclockwise"></i><span>重置</span></button></div>' +
      '</div>';
  }
  function renderModelTable() {
    var rows = filteredModels();
    var totalPages = Math.max(1, Math.ceil(rows.length / 8));
    if (state.modelPage > totalPages) state.modelPage = totalPages;
    var pageRows = rows.slice((state.modelPage - 1) * 8, state.modelPage * 8);
    return '<div class="dm-table-tools"><div>' + statusTag('共 ' + rows.length + ' 个模型') + '</div><div>' + button('model-refresh', 'arrow-clockwise', '刷新', '', 'dm-icon-text-btn') + button('model-density', 'text-paragraph', '紧凑', '', 'dm-icon-text-btn') + button('model-columns', 'gear', '列设置', '', 'dm-icon-text-btn') + '</div></div>' +
      '<div class="dm-table-wrap"><table class="ds-table dm-model-table"><thead><tr><th>英文名称</th><th>别名</th><th>属性</th><th>数据库类型</th><th>数仓分层</th><th>表类型</th><th>版本</th><th>物化状态</th><th>操作</th></tr></thead><tbody>' +
      (pageRows.length ? pageRows.map(function (model) {
        return '<tr><td><strong>' + esc(model.name) + '</strong><small class="dm-method-note">' + esc(model.method) + '</small></td><td>' + esc(model.alias) + '</td><td>' + esc(model.attribute) + '</td><td>' + esc(model.dbType) + '</td><td title="' + esc(model.layer) + '">' + esc(model.layer) + '</td><td>' + esc(model.tableType) + '</td><td>' + esc(model.version) + '</td><td>' + statusTag(model.materialized ? '已物化' : '未物化') + '</td><td><div class="dm-row-actions">' +
          button('edit-model', 'pencil-square', '编辑', 'data-id="' + model.id + '"', 'dm-link-btn') + button('add-material-model', 'hdd-stack', '添加物化', 'data-id="' + model.id + '"', 'dm-link-btn') + (model.materialized ? button('model-detail', 'file-earmark-text', '物化详情', 'data-id="' + model.id + '"', 'dm-link-btn') : button('delete-model', 'trash3', '删除', 'data-id="' + model.id + '"', 'dm-link-btn danger')) + '</div></td></tr>';
      }).join('') : '<tr><td colspan="9"><div class="dm-empty"><i class="bi bi-inbox"></i><span>暂无符合条件的模型</span></div></td></tr>') + '</tbody></table></div>' + renderPagination(rows.length, state.modelPage, totalPages, 'model-page');
  }
  function renderPagination(total, current, pages, action) {
    var nums = '';
    for (var i = 1; i <= pages; i++) nums += '<button type="button" class="page-num' + (i === current ? ' active' : '') + '" data-dm-action="' + action + '" data-page="' + i + '">' + i + '</button>';
    return '<div class="ds-pagination"><span>共 ' + total + ' 条数据</span><div class="page-nav">' + button(action, 'chevron-left', '上一页', 'data-page="' + Math.max(1, current - 1) + '" ' + (current === 1 ? 'disabled' : ''), 'page-btn') + nums + button(action, 'chevron-right', '下一页', 'data-page="' + Math.min(pages, current + 1) + '" ' + (current === pages ? 'disabled' : ''), 'page-btn') + '</div></div>';
  }
  function renderModelList() {
    store.pendingMaterialIds = store.pendingMaterialIds.filter(function (id) { return !!findById(store.models, id); });
    var pending = store.pendingMaterialIds.length;
    var dropdown = '<div class="dm-create-wrap"><button type="button" class="btn btn-primary dm-create-trigger" data-dm-action="toggle-model-create" aria-haspopup="menu" aria-expanded="' + state.modelCreateOpen + '"><i class="bi bi-diagram-3" aria-hidden="true"></i><span>数仓建模</span><i class="bi bi-chevron-down dm-create-caret" aria-hidden="true"></i></button>' + (state.modelCreateOpen ? '<div class="dm-create-menu">' + modelMethods.map(function (method, index) {
      return '<button type="button" data-dm-action="new-model" data-method="' + esc(method) + '"><i class="bi bi-' + (index === 0 ? 'graph-up-arrow' : index === 1 ? 'code-square' : 'grid-3x3-gap') + '"></i><span><strong>' + esc(method) + '</strong><small>' + (index === 0 ? '通过可视化配置模型信息创建' : index === 1 ? '通过自定义 SQL 方式创建' : '通过数据集数据信息创建') + '</small></span></button>';
    }).join('') + '</div>' : '') + '</div>';
    return '<div class="dm-model-layout"><aside class="dm-model-tree"><header><i class="bi bi-list-nested"></i><strong>数仓分层</strong></header><div class="dm-tree-search"><i class="bi bi-search"></i><input type="search" data-dm-tree-keyword value="' + esc(state.treeKeyword) + '" placeholder="搜索数仓分层"></div><button class="dm-tree-all' + (!state.modelLayer ? ' active' : '') + '" type="button" data-dm-action="select-layer" data-layer=""><i class="bi bi-grid"></i><span>全部模型</span></button><div data-dm-tree>' + renderModelTree() + '</div></aside><main class="dm-model-main"><div class="dm-model-toolbar"><div>' + dropdown + button('show-pending', 'hourglass-split', '待物化模型：' + pending, '', 'btn btn-outline') + '</div></div>' + renderModelFilters() + renderModelTable() + '</main></div>';
  }
  function modelPlanOptions(selected) {
    return '<input class="dm-control" list="dmPlanOptions" data-dm-draft="model.layer" value="' + esc(selected) + '" placeholder="输入关键词搜索数仓分层"><datalist id="dmPlanOptions">' + store.plans.map(function (plan) { return '<option value="' + esc(planPath(plan)) + '">'; }).join('') + '</datalist>';
  }
  function renderModelPlanTree() {
    var keyword = String(state.modelPlanKeyword || '').trim().toLowerCase();
    var groups = groupMeta.map(function (group) {
      var groupMatched = group.name.toLowerCase().indexOf(keyword) >= 0 || group.id.toLowerCase().indexOf(keyword) >= 0;
      var plans = store.plans.filter(function (plan) {
        if (plan.group !== group.id) return false;
        if (!keyword || groupMatched) return true;
        return [plan.name, plan.englishName, plan.code, plan.modelType].some(function (value) { return String(value || '').toLowerCase().indexOf(keyword) >= 0; });
      });
      if (!plans.length) return '';
      return '<div class="dm-model-plan-group"><div class="dm-model-plan-group-title"><i class="bi bi-folder2-open"></i><span>' + esc(group.name) + '</span><small>' + plans.length + '</small></div><div class="dm-model-plan-children">' + plans.map(function (plan) {
        var active = draftPlanSelected(plan);
        return '<button type="button" class="dm-model-plan-option' + (active ? ' active' : '') + '" data-dm-action="select-model-plan" data-id="' + plan.id + '"><i class="bi bi-diagram-2"></i><span><strong>' + esc(plan.name) + '</strong><small>' + esc(plan.code) + '</small></span><em>' + esc(plan.modelType) + '</em></button>';
      }).join('') + '</div></div>';
    }).join('');
    return groups || '<div class="dm-model-plan-empty"><i class="bi bi-search"></i><span>未找到匹配的数仓分层</span></div>';
  }
  function draftPlanSelected(plan) {
    return state.modelForm && (state.modelForm.planId === plan.id || (!state.modelForm.planId && state.modelForm.layer === planPath(plan)));
  }
  function renderModelPlanPicker(draft) {
    return '<div class="dm-model-plan-picker"><button type="button" class="dm-model-plan-trigger" data-dm-action="toggle-model-plan" aria-expanded="' + state.modelPlanOpen + '"><span>' + esc(draft.layer || '请选择数仓分层') + '</span><i class="bi bi-chevron-down"></i></button>' + (state.modelPlanOpen ? '<div class="dm-model-plan-panel"><div class="dm-model-plan-search"><i class="bi bi-search"></i><input type="search" data-dm-model-plan-keyword value="' + esc(state.modelPlanKeyword) + '" placeholder="搜索分层名称或编码"></div><div class="dm-model-plan-tree" data-dm-model-plan-tree>' + renderModelPlanTree() + '</div></div>' : '') + '</div>';
  }
  function renderBasicModelForm(draft) {
    var rules = store.rules.filter(function (rule) { return rule.enabled; });
    return '<section class="dm-section dm-basic-section"><div class="dm-section-title"><h3><i class="bi bi-card-checklist"></i>基础信息</h3></div><div class="dm-form-grid">' +
      field('数仓分层', renderModelPlanPicker(draft), true, false) + field('表类型', selectDraft('model', 'tableType', draft.tableType, draft.tableType ? [draft.tableType] : [], '请选择', 'disabled aria-disabled="true"'), true, false, '根据数仓分层自动匹配') +
      field('表命名规则', selectDraft('model', 'ruleId', draft.ruleId || '', rules.map(function (rule) { return [rule.id, rule.name]; }), '请选择'), true, false) + field('数据域', selectDraft('model', 'domain', draft.domain, domains, '请选择'), true, false) +
      field('规则内容', inputDraft('model', 'ruleContent', draft.ruleContent || '', '选择命名规则后生成', 'readonly'), true, false) + field('更新标识', selectDraft('model', 'updateType', draft.updateType, updateTypes, '请选择'), false, false) +
      field('表名称', '<div class="dm-version-input">' + inputDraft('model', 'name', draft.name, '请输入表名称', 'maxlength="128"') + '<span>' + esc(draft.version || 'V1') + '</span></div>', true, false) + field('别名', inputDraft('model', 'alias', draft.alias, '请输入模型别名', 'maxlength="128"'), true, false) +
      field('数据库类型', selectDraft('model', 'dbType', draft.dbType, databaseTypes, '请选择'), true, false) +
      field('备注', '<textarea class="dm-control dm-textarea" data-dm-draft="model.remark" maxlength="500" placeholder="请输入模型说明">' + esc(draft.remark || '') + '</textarea>', false, true) + '</div></section>';
  }
  function renderStandardOptions(index) {
    var keyword = String(state.standardKeyword || '').trim().toLowerCase();
    var customVisible = !keyword || '自定义'.indexOf(keyword) >= 0;
    var standards = dataStandards.filter(function (item) {
      return !keyword || [item.code, item.alias, item.englishName, item.type].some(function (value) { return String(value || '').toLowerCase().indexOf(keyword) >= 0; });
    });
    var custom = customVisible ? '<button type="button" class="dm-standard-option custom" data-dm-action="select-field-standard" data-index="' + index + '" data-code="custom"><i class="bi bi-pencil-square"></i><span><strong>自定义</strong><small>手工维护字段信息</small></span></button>' : '';
    var options = standards.map(function (item) {
      return '<button type="button" class="dm-standard-option" data-dm-action="select-field-standard" data-index="' + index + '" data-code="' + esc(item.code) + '"><i class="bi bi-bookmark-check"></i><span><strong>' + esc(item.code + '（' + item.alias + '）') + '</strong><small>' + esc(item.englishName + ' · ' + item.type + '(' + item.length + (item.precision ? ',' + item.precision : '') + ')') + '</small></span></button>';
    }).join('');
    return custom + options || '<div class="dm-standard-empty"><i class="bi bi-search"></i><span>未找到匹配的数据标准</span></div>';
  }
  function renderStandardPicker(fieldValue, index) {
    var open = state.standardPickerIndex === index;
    var position = state.standardPickerPosition || { left: 24, top: 120, width: 390 };
    return '<div class="dm-standard-picker"><button type="button" class="dm-field-control dm-standard-trigger" data-dm-action="toggle-field-standard" data-index="' + index + '" aria-expanded="' + open + '"><span>' + esc(standardLabel(fieldValue.standard)) + '</span><i class="bi bi-chevron-down"></i></button>' + (open ? '<div class="dm-standard-panel" style="left:' + position.left + 'px;top:' + position.top + 'px;width:' + position.width + 'px"><div class="dm-standard-search"><i class="bi bi-search"></i><input type="search" data-dm-standard-keyword data-index="' + index + '" value="' + esc(state.standardKeyword) + '" placeholder="搜索标准编码、别名或英文"></div><div class="dm-standard-options" data-dm-standard-options>' + renderStandardOptions(index) + '</div></div>' : '') + '</div>';
  }
  function fieldRow(fieldValue, index) {
    var locked = fieldValue.standard && fieldValue.standard !== 'custom';
    var readonly = locked ? ' disabled aria-disabled="true"' : '';
    return '<tr><td>' + renderStandardPicker(fieldValue, index) + '</td>' +
      '<td><input class="dm-field-control" data-dm-field="name" data-index="' + index + '" value="' + esc(fieldValue.name) + '"' + readonly + '></td><td><input class="dm-field-control" data-dm-field="alias" data-index="' + index + '" value="' + esc(fieldValue.alias) + '"' + readonly + '></td>' +
      '<td><select class="dm-field-control" data-dm-field="type" data-index="' + index + '"' + readonly + '>' + ['varchar', 'bigint', 'decimal', 'date', 'datetime', 'timestamp'].map(function (item) { return option(item, item, fieldValue.type); }).join('') + '</select></td>' +
      '<td><input class="dm-field-control" type="number" min="0" data-dm-field="length" data-index="' + index + '" value="' + esc(fieldValue.length) + '"' + readonly + '></td><td><input class="dm-field-control" type="number" min="0" data-dm-field="precision" data-index="' + index + '" value="' + esc(fieldValue.precision) + '"' + readonly + '></td>' +
      '<td><input class="dm-field-control" data-dm-field="defaultValue" data-index="' + index + '" value="' + esc(fieldValue.defaultValue) + '"' + readonly + '></td><td><div class="dm-field-checks"><label><input type="checkbox" data-dm-field="required" data-index="' + index + '"' + (fieldValue.required ? ' checked' : '') + '>非空</label><label><input type="checkbox" data-dm-field="primary" data-index="' + index + '"' + (fieldValue.primary ? ' checked' : '') + '>主键</label><label><input type="checkbox" data-dm-field="auto" data-index="' + index + '"' + (fieldValue.auto ? ' checked' : '') + '>自增长</label></div></td>' +
      '<td><input class="dm-field-control" data-dm-field="remark" data-index="' + index + '" value="' + esc(fieldValue.remark) + '"' + readonly + '></td><td>' + button('remove-field', 'trash3', '删除', 'data-index="' + index + '"', 'dm-link-btn danger') + '</td></tr>';
  }
  function renderSqlEditor(sql) {
    var isLight = state.sqlTheme === 'light';
    return '<div class="dp-sql-editor dm-public-sql-editor ' + (isLight ? 'theme-light' : 'theme-dark') + (state.sqlSearchOpen ? ' search-open' : '') + '" data-dm-sql-editor style="font-size:' + esc(state.sqlFont) + ';">' +
      '<div class="dp-sql-editor-toolbar"><select class="dp-sql-editor-select" data-dm-sql-theme><option value="dark"' + (!isLight ? ' selected' : '') + '>暗色 - One Dark</option><option value="light"' + (isLight ? ' selected' : '') + '>亮色 - Light</option></select><select class="dp-sql-editor-select" data-dm-sql-font>' + ['12px', '13px', '14px', '15px', '16px'].map(function (size) { return option(size, size, state.sqlFont); }).join('') + '</select>' +
      button('format-sql', 'sliders', '格式化', '', 'dp-sql-editor-btn') + button('copy-sql', 'clipboard', '复制', '', 'dp-sql-editor-btn') + button('toggle-sql-search', 'search', '搜索', '', 'dp-sql-editor-btn') + button('fullscreen-sql', 'arrows-fullscreen', '全屏', '', 'dp-sql-editor-btn') + '</div>' +
      '<div class="dp-sql-editor-searchbar"><input class="dp-sql-editor-input" type="search" data-dm-sql-find placeholder="查找..."><button class="dp-sql-editor-btn" type="button" data-dm-action="sql-find-next"><i class="bi bi-chevron-down"></i><span>下一个</span></button><button class="dp-sql-editor-btn" type="button" data-dm-action="sql-find-prev"><i class="bi bi-chevron-up"></i><span>上一个</span></button><label class="dp-sql-editor-check"><input type="checkbox" data-dm-sql-case> 区分大小写</label><span class="dp-sql-editor-close" data-dm-action="close-sql-search" title="关闭搜索"><i class="bi bi-x"></i></span></div>' +
      '<div class="dp-sql-editor-wrap"><div class="dp-sql-editor-gutter" data-dm-sql-gutter>' + sqlLineNumbers(sql) + '</div><div class="dp-sql-editor-content" data-dm-sql-content contenteditable="true" spellcheck="false">' + highlightSql(sql) + '</div></div></div>';
  }
  function currentSqlText() {
    var content = root && root.querySelector('[data-dm-sql-content]');
    return content ? (content.innerText || content.textContent || '') : (state.modelForm ? state.modelForm.sql || '' : '');
  }
  function datasetFieldRow(fieldValue, index) {
    return '<tr><td><strong>' + esc(fieldValue.name) + '</strong></td><td><input class="dm-field-control" data-dm-dataset-field="alias" data-index="' + index + '" value="' + esc(fieldValue.alias) + '" placeholder="请输入别名"></td><td><select class="dm-field-control" data-dm-dataset-field="type" data-index="' + index + '">' + ['varchar', 'bigint', 'decimal', 'date', 'datetime', 'timestamp', 'tinyint'].map(function (type) { return option(type, type, fieldValue.type); }).join('') + '</select></td><td><input class="dm-field-control" type="number" min="0" data-dm-dataset-field="length" data-index="' + index + '" value="' + esc(fieldValue.length) + '" placeholder="数字"></td><td><input class="dm-field-control" type="number" min="0" data-dm-dataset-field="precision" data-index="' + index + '" value="' + esc(fieldValue.precision) + '" placeholder="数字"></td><td><input class="dm-field-control" data-dm-dataset-field="defaultValue" data-index="' + index + '" value="' + esc(fieldValue.defaultValue) + '" placeholder="256个字符以内"></td><td><div class="dm-field-checks"><label><input type="checkbox" data-dm-dataset-field="required" data-index="' + index + '"' + (fieldValue.required ? ' checked' : '') + '>非空</label><label><input type="checkbox" data-dm-dataset-field="primary" data-index="' + index + '"' + (fieldValue.primary ? ' checked' : '') + '>主键</label><label><input type="checkbox" data-dm-dataset-field="auto" data-index="' + index + '"' + (fieldValue.auto ? ' checked' : '') + '>自增长</label></div></td><td><input class="dm-field-control" data-dm-dataset-field="remark" data-index="' + index + '" value="' + esc(fieldValue.remark) + '" placeholder="200个字符以内"></td></tr>';
  }
  function renderDatasetPreview() {
    if (!state.datasetPreview) return '<div class="dm-empty dm-dataset-empty"><i class="bi bi-play-circle"></i><span>点击“执行预览”后展示数据</span></div>';
    return '<div class="dm-dataset-preview-head"><strong><i class="bi bi-table"></i>预览</strong><span>当前预览 10 条数据，共计 240 条</span></div><div class="dm-table-wrap"><table class="ds-table dm-dataset-preview-table"><thead><tr>' + datasetPreviewColumns.map(function (name) { return '<th>' + esc(name) + '</th>'; }).join('') + '</tr></thead><tbody>' + datasetPreviewRows.map(function (row) { return '<tr>' + row.map(function (value) { return '<td title="' + esc(value) + '">' + esc(value) + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>';
  }
  function renderDatasetConfig(draft) {
    var fields = draft.datasetFields || (draft.datasetFields = defaultDatasetFields());
    return '<div class="dm-table-wrap"><table class="ds-table dm-dataset-config-table"><thead><tr><th>英文</th><th>别名</th><th>数据类型</th><th>长度</th><th>精度</th><th>缺省值</th><th>属性</th><th>描述</th></tr></thead><tbody>' + fields.map(datasetFieldRow).join('') + '</tbody></table></div>';
  }
  function renderModelSpecial(draft) {
    if (draft.method === '可视化建模') {
      return '<section class="dm-section"><div class="dm-section-title"><h3><i class="bi bi-table"></i>字段信息</h3>' + button('add-field', 'plus-circle', '新增字段', '', 'btn btn-outline') + '</div><div class="dm-table-wrap"><table class="ds-table dm-field-table"><thead><tr><th>数据标准</th><th>英文</th><th>别名</th><th>数据类型</th><th>长度</th><th>精度</th><th>缺省值</th><th>属性</th><th>描述</th><th>操作</th></tr></thead><tbody>' + draft.fields.map(fieldRow).join('') + '</tbody></table></div></section>';
    }
    if (draft.method === 'SQL建模') {
      return '<section class="dm-section"><div class="dm-section-title"><h3><i class="bi bi-code-square"></i>建表 SQL</h3></div>' + renderSqlEditor(draft.sql || '') + '</section>';
    }
    return '<section class="dm-section dm-dataset-section"><div class="dm-section-title"><h3><i class="bi bi-grid-3x3-gap"></i>数据集</h3></div><div class="dm-dataset-head"><label>数据源 ' + selectDraft('model', 'datasetSource', draft.datasetSource || '', ['订单交易库', '会员运营库', 'ODS贴源库', 'DWD明细库'], '请选择数据库') + '</label></div><div class="dm-dataset-layout"><aside><div class="dm-tree-search"><i class="bi bi-search"></i><input type="search" data-dm-dataset-keyword value="' + esc(state.datasetKeyword) + '" placeholder="搜索数据表"></div>' + ['ods_trade_order_di', 'ods_trade_payment_di', 'dwd_trade_order_detail_di', 'dwd_member_behavior_di'].filter(function (name) { return !state.datasetKeyword || name.indexOf(state.datasetKeyword.toLowerCase()) >= 0; }).map(function (name) { return '<button type="button" data-dm-action="choose-dataset" data-value="' + name + '"><i class="bi bi-table"></i><span>' + name + '</span></button>'; }).join('') + '</aside><main>' + renderSqlEditor(draft.sql || '') + button('dataset-preview', 'play-circle', '执行预览', '', 'btn btn-primary') + '</main></div><div class="dm-dataset-tabs" role="tablist"><button type="button" role="tab" aria-selected="' + (state.datasetTab === 'preview') + '" class="' + (state.datasetTab === 'preview' ? 'active' : '') + '" data-dm-action="dataset-tab" data-tab="preview">数据预览</button><button type="button" role="tab" aria-selected="' + (state.datasetTab === 'config') + '" class="' + (state.datasetTab === 'config' ? 'active' : '') + '" data-dm-action="dataset-tab" data-tab="config">建模配置</button></div><div class="dm-dataset-tab-body" role="tabpanel">' + (state.datasetTab === 'config' ? renderDatasetConfig(draft) : renderDatasetPreview()) + '</div></section>';
  }
  function renderModelForm() {
    var draft = state.modelForm;
    return pageHeader(draft.method === '可视化建模' ? 'graph-up-arrow' : draft.method === 'SQL建模' ? 'code-square' : 'grid-3x3-gap', draft.method, button('back-model', 'arrow-left', '返回') + button('save-model', 'floppy', '保存', '', 'btn btn-primary')) + renderBasicModelForm(draft) + renderModelSpecial(draft);
  }
  function renderModel() { return state.modelForm ? renderModelForm() : renderModelList(); }

  function filteredMaterialRuns() {
    var f = state.materialFilters;
    return store.materialRuns.filter(function (run) { return (!f.source || run.source === f.source) && (!f.project || run.project === f.project) && (!f.environment || run.environment === f.environment) && (!f.mode || run.mode === f.mode) && (!f.status || run.status === f.status); });
  }
  function renderMaterialList() {
    var f = state.materialFilters, rows = filteredMaterialRuns();
    return pageHeader('hdd-stack', '物化管理') + '<div class="dm-toolbar dm-material-toolbar"><div class="dm-material-create-actions">' + button('new-material', 'plus-lg', '新建', '', 'btn btn-primary') + '</div><div class="dm-material-filters">' +
      '<label><span>数据源</span>' + selectControl('material-filter="source"', f.source, ['DWD明细库', 'DWS汇总库', 'ADS应用库', 'ODS贴源库'], '全部数据源') + '</label><label><span>项目</span>' + selectControl('material-filter="project"', f.project, ['数据中台项目', '经营分析项目', '供应链分析项目'], '全部项目') + '</label><label><span>环境</span>' + selectControl('material-filter="environment"', f.environment, ['开发', '测试', '生产'], '全部环境') + '</label><label><span>发布模式</span>' + selectControl('material-filter="mode"', f.mode, ['增量发布', '全量发布'], '全部模式') + '</label><label><span>执行状态</span>' + selectControl('material-filter="status"', f.status, ['执行成功', '执行中', '执行失败'], '全部状态') + '</label>' + button('material-query', 'search', '查询', '', 'btn btn-primary') + button('material-reset', 'arrow-counterclockwise', '重置') + '</div></div>' +
      '<div class="dm-table-wrap dm-fill-table"><table class="ds-table"><thead><tr><th>数据源</th><th>发布项目</th><th>环境</th><th>发布模式</th><th>执行状态</th><th>执行结果（总/成功/失败）</th><th>备注说明</th><th>操作</th></tr></thead><tbody>' + (rows.length ? rows.map(function (run) {
        return '<tr><td><strong>' + esc(run.source) + '</strong><small class="dm-method-note">' + esc(run.time) + '</small></td><td>' + esc(run.project) + '</td><td>' + esc(run.environment) + '</td><td>' + esc(run.mode) + '</td><td>' + statusTag(run.status) + '</td><td><span class="dm-result-count"><b>' + run.total + '</b> / <em>' + run.success + '</em> / <i>' + run.failed + '</i></span></td><td title="' + esc(run.remark) + '">' + esc(run.remark) + '</td><td>' + button('material-detail', 'file-earmark-text', '查看详情', 'data-id="' + run.id + '"', 'dm-link-btn') + '</td></tr>';
      }).join('') : '<tr><td colspan="8"><div class="dm-empty"><i class="bi bi-inbox"></i><span>暂无物化发布记录</span></div></td></tr>') + '</tbody></table></div>' + renderPagination(rows.length, 1, 1, 'noop');
  }
  function renderMaterialSourceTree() {
    var keyword = String(state.materialSourceKeyword || '').trim().toLowerCase();
    var groups = materialSourceTree.map(function (group) {
      var groupMatched = !keyword || (group.name + ' ' + group.id).toLowerCase().indexOf(keyword) >= 0;
      var children = group.children.filter(function (source) {
        return groupMatched || (source.name + ' ' + source.code + ' ' + source.type).toLowerCase().indexOf(keyword) >= 0;
      });
      if (!children.length) return '';
      return '<details class="dm-material-source-group" open><summary><i class="bi bi-chevron-right"></i><i class="bi bi-folder2"></i><span>' + esc(group.name) + '</span><small>' + children.length + '</small></summary><div class="dm-material-source-children">' + children.map(function (source) {
        return '<button type="button" class="dm-material-source-option' + (state.materialForm.source === source.name ? ' active' : '') + '" data-dm-action="select-material-source" data-value="' + esc(source.name) + '"><i class="bi bi-database"></i><span><strong>' + esc(source.name) + '</strong><small>' + esc(source.code + ' · ' + source.type) + '</small></span></button>';
      }).join('') + '</div></details>';
    }).join('');
    return groups || '<div class="dm-model-plan-empty"><i class="bi bi-search"></i><span>没有匹配的数据源</span></div>';
  }
  function renderMaterialSourcePicker(draft) {
    return '<div class="dm-material-source-picker"><button type="button" class="dm-model-plan-trigger" data-dm-action="toggle-material-source" aria-expanded="' + state.materialSourceOpen + '"><span>' + esc(draft.source || '请选择数据源') + '</span><i class="bi bi-chevron-down"></i></button>' + (state.materialSourceOpen ? '<div class="dm-material-source-panel"><div class="dm-model-plan-search"><i class="bi bi-search"></i><input type="search" data-dm-material-source-keyword value="' + esc(state.materialSourceKeyword) + '" placeholder="搜索数据源名称、编码或类型"></div><div class="dm-material-source-tree" data-dm-material-source-tree>' + renderMaterialSourceTree() + '</div></div>' : '') + '</div>';
  }
  function pendingModels() { return store.models.filter(function (model) { return state.materialForm.modelIds.indexOf(model.id) >= 0; }); }
  function renderMaterialForm() {
    var draft = state.materialForm, models = pendingModels();
    return pageHeader('hdd-stack', '物化管理', button('back-material', 'arrow-left', '返回') + button('publish-material', 'cloud-upload', '发布', '', 'btn btn-primary')) +
      '<section class="dm-section dm-material-basic"><div class="dm-section-title"><h3><i class="bi bi-card-checklist"></i>基础信息</h3></div><div class="dm-form-grid">' +
      field('发布项目', selectDraft('material', 'project', draft.project, ['数据中台项目', '经营分析项目', '供应链分析项目'], '请选择'), false, false) + field('项目环境', selectDraft('material', 'environment', draft.environment, ['开发', '测试', '生产'], '请选择发布项目'), false, false) +
      field('数据源', renderMaterialSourcePicker(draft), true, false) + field('发布模式', selectDraft('material', 'mode', draft.mode, ['增量发布', '全量发布'], '请选择'), true, false) +
      field('备注说明', '<textarea class="dm-control dm-textarea" data-dm-draft="material.remark" maxlength="500" placeholder="请输入本次发布说明">' + esc(draft.remark) + '</textarea>', true, true) + '</div></section>' +
      '<section class="dm-section"><div class="dm-section-title"><h3><i class="bi bi-hourglass-split"></i>待物化模型</h3><div>' + button('material-add-model', 'plus-lg', '添加', '', 'btn btn-primary') + button('remove-pending', 'trash3', '移除', '', 'btn btn-outline danger') + '</div></div><div class="dm-table-wrap"><table class="ds-table"><thead><tr><th class="col-ck"><input type="checkbox" data-dm-pending-all></th><th>英文名称</th><th>别名</th><th>表类型</th><th>数据库类型</th><th>版本</th><th>物化状态</th></tr></thead><tbody>' +
      (models.length ? models.map(function (model) { return '<tr><td class="col-ck"><input type="checkbox" data-dm-pending-check="' + model.id + '"' + (state.pendingSelected.has(model.id) ? ' checked' : '') + '></td><td><strong>' + esc(model.name) + '</strong></td><td>' + esc(model.alias) + '</td><td>' + esc(model.tableType) + '</td><td>' + esc(model.dbType) + '</td><td>' + esc(model.version) + '</td><td>' + statusTag(model.materialized ? '已物化' : '未物化') + '</td></tr>'; }).join('') : '<tr><td colspan="7"><div class="dm-empty"><i class="bi bi-inbox"></i><span>请添加需要物化的模型</span></div></td></tr>') + '</tbody></table></div></section>';
  }
  function materialInfoItem(label, value, html) {
    return '<div><span>' + esc(label) + '</span>' + (html ? value : '<strong>' + esc(value || '-') + '</strong>') + '</div>';
  }
  function materialRunModels(run) {
    var rows = [], total = Math.min(Number(run.total) || 0, store.models.length);
    var offset = Math.max(0, (Number(String(run.id).replace(/\D/g, '')) || 1) - 1) * 2;
    for (var index = 0; index < total; index++) {
      var model = store.models[(offset + index) % store.models.length];
      var materialStatus = run.status === '执行失败' && index === total - 1 ? '物化失败' : run.status === '执行中' && index === total - 1 ? '物化中' : '物化成功';
      rows.push({ model: model, status: materialStatus });
    }
    return rows;
  }
  function filteredMaterialDetailRows(run) {
    var keyword = state.materialDetailKeyword.toLowerCase();
    return materialRunModels(run).filter(function (row) {
      return (!state.materialDetailStatus || row.status === state.materialDetailStatus) && (!keyword || (row.model.name + ' ' + row.model.alias).toLowerCase().indexOf(keyword) >= 0);
    });
  }
  function renderMaterialDetail() {
    var run = findById(store.materialRuns, state.materialDetailId), rows = filteredMaterialDetailRows(run);
    var result = '<span class="dm-result-count"><b>' + run.total + '</b> / <em>' + run.success + '</em> / <i>' + run.failed + '</i></span>';
    return pageHeader('hdd-stack', '物化管理') +
      '<section class="dm-section dm-material-detail-basic"><div class="dm-section-title"><h3><i class="bi bi-person-badge"></i>基本信息</h3>' + button('back-material-detail', 'arrow-left', '返回') + '</div><div class="dm-material-info-grid">' +
      materialInfoItem('发布项目', run.project) + materialInfoItem('环境', run.environment) + materialInfoItem('数据源', run.source) + materialInfoItem('发布模式', run.mode) + materialInfoItem('执行状态', statusTag(run.status), true) + materialInfoItem('执行结果（总/成功/失败）', result, true) + '</div></section>' +
      '<section class="dm-section dm-material-detail-list"><div class="dm-section-title"><h3><i class="bi bi-list-check"></i>物化列表</h3></div><div class="dm-material-detail-query"><label><span>状态</span>' + selectControl('material-detail-status', state.materialDetailStatus, ['物化成功', '物化中', '物化失败'], '执行状态') + '</label><input class="dm-control" type="search" data-dm-material-detail-keyword value="' + esc(state.materialDetailKeywordDraft) + '" placeholder="英文名/别名"><button type="button" class="btn btn-primary" data-dm-action="material-detail-query"><i class="bi bi-search"></i><span>查询</span></button></div>' +
      '<div class="dm-table-wrap"><table class="ds-table dm-material-detail-table"><thead><tr><th>英文名称</th><th>匹配规则</th><th>数仓分层</th><th>别名</th><th>表类型</th><th>数据库类型</th><th>版本</th><th>物化状态</th><th>操作</th></tr></thead><tbody>' +
      (rows.length ? rows.map(function (row) { var model = row.model; return '<tr><td><strong>' + esc(model.name) + '</strong></td><td><code>' + esc(model.ruleContent || '${自定义}') + '</code></td><td title="' + esc(model.layer) + '">' + esc(model.layer) + '</td><td>' + esc(model.alias) + '</td><td>' + esc(model.tableType) + '</td><td>' + esc(model.dbType) + '</td><td>' + esc(model.version) + '</td><td>' + statusTag(row.status) + '</td><td>' + button('view-material-log', 'file-earmark-code', '查看日志', 'data-id="' + model.id + '"', 'dm-link-btn') + '</td></tr>'; }).join('') : '<tr><td colspan="9"><div class="dm-empty"><i class="bi bi-inbox"></i><span>暂无符合条件的物化模型</span></div></td></tr>') + '</tbody></table></div>' + renderPagination(rows.length, 1, 1, 'noop') + '</section>';
  }
  function materialExecutionLog(run, row) {
    var model = row.model, failed = row.status === '物化失败';
    return [
      run.time + ' [INFO] 开始物化模型 ' + model.name,
      run.time + ' [INFO] 数据源：' + run.source + '，发布模式：' + run.mode,
      run.time + ' [INFO] 校验数仓分层：' + model.layer,
      run.time + ' [INFO] 执行目标表 DDL',
      run.time + (failed ? ' [ERROR] 物化执行失败，请检查目标库连接与字段类型' : ' [INFO] 目标表结构创建完成'),
      run.time + (failed ? ' [INFO] 物化任务结束，状态：失败' : ' [INFO] 物化任务结束，状态：成功')
    ].join('\n');
  }
  function materialDdl(model) {
    var fields = model.fields && model.fields.length ? model.fields : defaultFields(model.domain || '交易域');
    var primary = fields.filter(function (fieldValue) { return fieldValue.primary; }).map(function (fieldValue) { return '`' + fieldValue.name + '`'; });
    var lines = fields.map(function (fieldValue) {
      var type = String(fieldValue.type || 'varchar').toUpperCase();
      if (/CHAR|VARCHAR/.test(type) && fieldValue.length) type += '(' + fieldValue.length + ')';
      else if (/DECIMAL/.test(type)) type += '(' + (fieldValue.length || 18) + ',' + (fieldValue.precision || 0) + ')';
      var line = '  `' + fieldValue.name + '` ' + type + (fieldValue.required ? ' NOT NULL' : ' NULL');
      if (fieldValue.defaultValue !== '' && fieldValue.defaultValue != null) line += ' DEFAULT ' + (/^CURRENT_/i.test(fieldValue.defaultValue) || /^-?\d+(\.\d+)?$/.test(fieldValue.defaultValue) ? fieldValue.defaultValue : "'" + fieldValue.defaultValue + "'");
      if (fieldValue.remark) line += " COMMENT '" + String(fieldValue.remark).replace(/'/g, "''") + "'";
      return line;
    });
    if (primary.length) lines.push('  PRIMARY KEY (' + primary.join(', ') + ')');
    return 'CREATE TABLE `' + model.name + '` (\n' + lines.join(',\n') + "\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='" + String(model.alias || model.name).replace(/'/g, "''") + "';";
  }
  function renderMaterialCodeViewer(code) {
    var isLight = state.sqlTheme === 'light';
    return '<div class="dp-sql-editor dm-public-sql-editor dm-material-code-viewer ' + (isLight ? 'theme-light' : 'theme-dark') + (state.sqlSearchOpen ? ' search-open' : '') + '" data-dm-sql-editor style="font-size:' + esc(state.sqlFont) + ';"><div class="dp-sql-editor-toolbar"><select class="dp-sql-editor-select" data-dm-sql-theme><option value="dark"' + (!isLight ? ' selected' : '') + '>暗色 - One Dark</option><option value="light"' + (isLight ? ' selected' : '') + '>亮色 - Light</option></select><select class="dp-sql-editor-select" data-dm-sql-font>' + ['12px', '13px', '14px', '15px', '16px'].map(function (size) { return option(size, size, state.sqlFont); }).join('') + '</select>' + button('format-material-code', 'sliders', '格式化', '', 'dp-sql-editor-btn') + button('copy-material-code', 'clipboard', '复制', '', 'dp-sql-editor-btn') + button('toggle-sql-search', 'search', '搜索', '', 'dp-sql-editor-btn') + button('fullscreen-sql', 'arrows-fullscreen', '全屏', '', 'dp-sql-editor-btn') + '</div><div class="dp-sql-editor-searchbar"><input class="dp-sql-editor-input" type="search" data-dm-sql-find placeholder="查找..."><button class="dp-sql-editor-btn" type="button" data-dm-action="sql-find-next"><i class="bi bi-chevron-down"></i><span>下一个</span></button><button class="dp-sql-editor-btn" type="button" data-dm-action="sql-find-prev"><i class="bi bi-chevron-up"></i><span>上一个</span></button><label class="dp-sql-editor-check"><input type="checkbox" data-dm-sql-case> 区分大小写</label><span class="dp-sql-editor-close" data-dm-action="close-sql-search" title="关闭搜索"><i class="bi bi-x"></i></span></div><div class="dp-sql-editor-wrap"><div class="dp-sql-editor-gutter" data-dm-sql-gutter>' + sqlLineNumbers(code) + '</div><div class="dp-sql-editor-content" data-dm-material-code tabindex="0">' + highlightSql(code) + '</div></div></div>';
  }
  function currentMaterialCode() {
    var run = findById(store.materialRuns, state.materialDetailId), row = materialRunModels(run).filter(function (item) { return item.model.id === state.materialLogModelId; })[0];
    if (!row) return '';
    return state.materialLogTab === 'ddl' ? materialDdl(row.model) : materialExecutionLog(run, row);
  }
  function renderMaterialLog() {
    var run = findById(store.materialRuns, state.materialDetailId), row = materialRunModels(run).filter(function (item) { return item.model.id === state.materialLogModelId; })[0];
    if (!row) { state.materialLogModelId = ''; return renderMaterialDetail(); }
    var model = row.model, code = currentMaterialCode();
    return pageHeader('terminal', '物化日志') + '<section class="dm-section dm-material-log-basic"><div class="dm-section-title"><h3><i class="bi bi-person-badge"></i>基本信息</h3>' + button('back-material-log', 'arrow-left', '返回') + '</div><div class="dm-material-info-grid">' + materialInfoItem('英文名称', model.name) + materialInfoItem('别名', model.alias) + materialInfoItem('版本', model.version) + materialInfoItem('发布项目', run.project) + materialInfoItem('环境', run.environment) + materialInfoItem('数据源', run.source) + materialInfoItem('发布模式', run.mode) + materialInfoItem('执行状态', statusTag(run.status), true) + '</div></section><section class="dm-section dm-material-log-section"><div class="dm-material-log-tabs" role="tablist"><button type="button" role="tab" aria-selected="' + (state.materialLogTab === 'execution') + '" class="' + (state.materialLogTab === 'execution' ? 'active' : '') + '" data-dm-action="material-log-tab" data-tab="execution">执行日志</button><button type="button" role="tab" aria-selected="' + (state.materialLogTab === 'ddl') + '" class="' + (state.materialLogTab === 'ddl' ? 'active' : '') + '" data-dm-action="material-log-tab" data-tab="ddl">DDL</button></div><div class="dm-material-log-panel" role="tabpanel">' + renderMaterialCodeViewer(code) + '</div></section>';
  }
  function renderMaterial() { return state.materialLogModelId ? renderMaterialLog() : state.materialDetailId ? renderMaterialDetail() : state.materialForm ? renderMaterialForm() : renderMaterialList(); }

  function reverseRuleOptions() {
    return [{ id: 'custom', name: '自定义(系统规则)', template: '${自定义}' }].concat(store.rules.filter(function (rule) { return rule.enabled; }).map(function (rule) {
      return { id: rule.id, name: rule.name, template: rule.template };
    }));
  }
  function reverseRuleById(id) { return findById(reverseRuleOptions(), id); }
  function renderReverseSourceTree() {
    var keyword = String(state.reverseSourceKeyword || '').trim().toLowerCase();
    var groups = reverseSourceTree.map(function (group) {
      var groupMatched = !keyword || group.name.toLowerCase().indexOf(keyword) >= 0;
      var children = group.children.filter(function (source) { return groupMatched || (source.name + ' ' + source.code + ' ' + source.type).toLowerCase().indexOf(keyword) >= 0; });
      if (!children.length) return '';
      return '<details class="dm-material-source-group" open><summary><i class="bi bi-chevron-right"></i><i class="bi bi-folder2"></i><span>' + esc(group.name) + '</span><small>' + children.length + '</small></summary><div class="dm-material-source-children">' + children.map(function (source) {
        return '<button type="button" class="dm-material-source-option' + (state.modal.draft.source === source.name ? ' active' : '') + '" data-dm-action="select-reverse-source" data-value="' + esc(source.name) + '"><i class="bi bi-database"></i><span><strong>' + esc(source.name) + '</strong><small>' + esc(source.code + ' · ' + source.type) + '</small></span></button>';
      }).join('') + '</div></details>';
    }).join('');
    return groups || '<div class="dm-model-plan-empty"><i class="bi bi-search"></i><span>没有匹配的数据源</span></div>';
  }
  function renderReverseSourcePicker(draft) {
    return '<div class="dm-reverse-picker"><button type="button" class="dm-model-plan-trigger" data-dm-action="toggle-reverse-source" aria-expanded="' + state.reverseSourceOpen + '"><span>' + esc(draft.source || '请选择数据源') + '</span><i class="bi bi-chevron-down"></i></button>' + (state.reverseSourceOpen ? '<div class="dm-reverse-picker-panel"><div class="dm-model-plan-search"><i class="bi bi-search"></i><input type="search" data-dm-reverse-source-keyword value="' + esc(state.reverseSourceKeyword) + '" placeholder="搜索数据源名称、编码或类型"></div><div class="dm-material-source-tree" data-dm-reverse-source-tree>' + renderReverseSourceTree() + '</div></div>' : '') + '</div>';
  }
  function renderReversePlanTree() {
    var keyword = String(state.reversePlanKeyword || '').trim().toLowerCase();
    var groups = groupMeta.map(function (group) {
      var groupMatched = !keyword || (group.name + ' ' + group.id).toLowerCase().indexOf(keyword) >= 0;
      var plans = store.plans.filter(function (plan) { return plan.group === group.id && (groupMatched || [plan.name, plan.englishName, plan.code, plan.modelType].join(' ').toLowerCase().indexOf(keyword) >= 0); });
      if (!plans.length) return '';
      return '<div class="dm-model-plan-group"><div class="dm-model-plan-group-title"><i class="bi bi-folder2-open"></i><span>' + esc(group.name) + '</span><small>' + plans.length + '</small></div><div class="dm-model-plan-children">' + plans.map(function (plan) {
        return '<button type="button" class="dm-model-plan-option' + (state.modal.draft.planId === plan.id ? ' active' : '') + '" data-dm-action="select-reverse-plan" data-id="' + plan.id + '"><i class="bi bi-diagram-2"></i><span><strong>' + esc(plan.name) + '</strong><small>' + esc(plan.code) + '</small></span><em>' + esc(plan.modelType) + '</em></button>';
      }).join('') + '</div></div>';
    }).join('');
    return groups || '<div class="dm-model-plan-empty"><i class="bi bi-search"></i><span>未找到匹配的数仓分层</span></div>';
  }
  function renderReversePlanPicker(draft) {
    return '<div class="dm-reverse-picker"><button type="button" class="dm-model-plan-trigger" data-dm-action="toggle-reverse-plan" aria-expanded="' + state.reversePlanOpen + '"><span>' + esc(draft.layer || '请选择') + '</span><i class="bi bi-chevron-down"></i></button>' + (state.reversePlanOpen ? '<div class="dm-reverse-picker-panel"><div class="dm-model-plan-search"><i class="bi bi-search"></i><input type="search" data-dm-reverse-plan-keyword value="' + esc(state.reversePlanKeyword) + '" placeholder="搜索分层名称或编码"></div><div class="dm-model-plan-tree" data-dm-reverse-plan-tree>' + renderReversePlanTree() + '</div></div>' : '') + '</div>';
  }
  function renderReverseDomainPicker(draft) {
    var keyword = String(state.reverseDomainKeyword || '').trim().toLowerCase();
    var values = domains.filter(function (domain) { return !keyword || domain.toLowerCase().indexOf(keyword) >= 0; });
    return '<div class="dm-reverse-picker"><button type="button" class="dm-model-plan-trigger" data-dm-action="toggle-reverse-domain" aria-expanded="' + state.reverseDomainOpen + '"><span>' + esc(draft.domain || '请选择') + '</span><i class="bi bi-chevron-down"></i></button>' + (state.reverseDomainOpen ? '<div class="dm-reverse-picker-panel compact"><div class="dm-model-plan-search"><i class="bi bi-search"></i><input type="search" data-dm-reverse-domain-keyword value="' + esc(state.reverseDomainKeyword) + '" placeholder="搜索数据域"></div><div class="dm-reverse-domain-tree">' + (values.length ? values.map(function (domain) { return '<button type="button" class="dm-reverse-domain-option' + (draft.domain === domain ? ' active' : '') + '" data-dm-action="select-reverse-domain" data-value="' + esc(domain) + '"><i class="bi bi-diagram-3"></i><span>' + esc(domain) + '</span></button>'; }).join('') : '<div class="dm-model-plan-empty"><i class="bi bi-search"></i><span>未找到匹配的数据域</span></div>') + '</div></div>' : '') + '</div>';
  }
  function renderReverseRuleRows(draft) {
    var options = reverseRuleOptions();
    return (draft.rules || ['']).map(function (ruleId, index) {
      var rule = reverseRuleById(ruleId);
      return '<div class="dm-reverse-rule-row"><select class="dm-control" data-dm-reverse-rule="' + index + '">' + option('', '请选择规则', ruleId) + options.map(function (item) { return option(item.id, item.name, ruleId); }).join('') + '</select><input class="dm-control" type="text" value="' + esc(rule ? rule.template : '') + '" placeholder="选择规则后展示模板" disabled><button type="button" class="dm-rule-icon" data-dm-action="remove-reverse-rule" data-index="' + index + '" aria-label="删除匹配规则"' + ((draft.rules || []).length === 1 ? ' disabled' : '') + '><i class="bi bi-dash-circle"></i></button></div>';
    }).join('') + '<button type="button" class="dm-rule-add" data-dm-action="add-reverse-rule"><i class="bi bi-plus-circle"></i><span>添加规则</span></button>';
  }
  function renderReverseFrequency(draft) {
    var type = draft.rateType || '每周';
    var extra = '';
    if (type === '每周') extra = selectDraft('modal', 'rateDay', draft.rateDay || '周一', ['周一', '周二', '周三', '周四', '周五', '周六', '周日'], '请选择星期');
    else if (type === '每月') extra = selectDraft('modal', 'rateDay', draft.rateDay || '1日', Array.from({ length: 31 }, function (_, index) { return (index + 1) + '日'; }), '请选择日期');
    if (type === 'cron表达式') return '<div class="dm-frequency cron">' + selectDraft('modal', 'rateType', type, ['每天', '每周', '每月', 'cron表达式', '执行一次'], '请选择') + inputDraft('modal', 'cronExpr', draft.cronExpr || '', '请输入 cron 表达式') + '</div>';
    if (type === '执行一次') return '<div class="dm-frequency once">' + selectDraft('modal', 'rateType', type, ['每天', '每周', '每月', 'cron表达式', '执行一次'], '请选择') + '<input class="dm-control" type="datetime-local" step="1" data-dm-draft="modal.onceTime" value="' + esc(draft.onceTime || '') + '"></div>';
    return '<div class="dm-frequency">' + selectDraft('modal', 'rateType', type, ['每天', '每周', '每月', 'cron表达式', '执行一次'], '请选择') + extra + '<input class="dm-control" type="time" step="1" data-dm-draft="modal.rateTime" value="' + esc(draft.rateTime || '') + '"></div>';
  }

  function filteredJobs() {
    var f = state.reverseFilters, keyword = state.reverseKeyword.toLowerCase();
    return store.reverseJobs.filter(function (job) { return (!f.executeType || job.executeType === f.executeType) && (!f.status || job.status === f.status) && (!keyword || (job.name + ' ' + job.source + ' ' + job.domain).toLowerCase().indexOf(keyword) >= 0); });
  }
  function metric(label, value, tone) { return '<div class="dm-metric"><span>' + esc(label) + '</span><strong class="' + (tone || '') + '">' + esc(value) + '</strong></div>'; }
  function renderReverseList() {
    var jobs = filteredJobs(), f = state.reverseFilters;
    return pageHeader('arrow-left-right', '逆向建模') + '<div class="dm-toolbar dm-reverse-toolbar"><div class="dm-reverse-create">' + button('new-reverse', 'plus-lg', '新建', '', 'btn btn-primary') + '</div><div class="dm-reverse-filters"><label><span>执行方式</span>' + selectControl('reverse-filter="executeType"', f.executeType, ['增量更新', '全量覆盖'], '请选择执行方式') + '</label><label><span>状态</span>' + selectControl('reverse-filter="status"', f.status, [['运行中', '启动'], ['已停止', '停止']], '请选择状态') + '</label><input class="dm-control" type="search" data-dm-reverse-keyword value="' + esc(state.reverseKeywordDraft) + '" placeholder="名称关键字">' + button('reverse-query', 'search', '查询', '', 'btn btn-primary') + button('reverse-reset', 'arrow-counterclockwise', '重置') + '</div></div><div class="dm-job-list">' +
      (jobs.length ? jobs.map(function (job) { return '<article class="dm-job-card"><header><div><h3><i class="bi bi-arrow-left-right"></i>' + esc(job.name) + '</h3>' + statusTag(job.status) + '</div><div>' + button('toggle-job', job.status === '运行中' ? 'stop-circle' : 'play-circle', job.status === '运行中' ? '停止' : '启动', 'data-id="' + job.id + '"', 'btn ' + (job.status === '运行中' ? 'btn-outline' : 'btn-primary')) + button('reverse-detail', 'file-earmark-text', '查看详情', 'data-id="' + job.id + '"') + button('edit-reverse', 'pencil-square', '编辑', 'data-id="' + job.id + '"') + button('delete-reverse', 'trash3', '删除', 'data-id="' + job.id + '"', 'btn btn-outline danger') + '</div></header><div class="dm-job-body"><div class="dm-job-metrics">' + metric('执行总次数', job.runs + ' 次') + metric('建模成功', job.success + ' 个', 'success') + metric('建模失败', job.failed + ' 个', 'danger') + metric(job.tableType || '业务表', (job.success + job.failed) + ' 个', 'primary') + '</div><dl><div><dt>数仓分层</dt><dd title="' + esc(job.layer) + '">' + esc(job.layer) + '</dd></div><div><dt>数据域</dt><dd>' + esc(job.domain) + '</dd></div><div><dt>执行方式</dt><dd>' + esc(job.executeType) + '</dd></div><div><dt>执行频率</dt><dd>' + esc(job.frequency) + '</dd></div><div><dt>操作者</dt><dd>' + esc(job.operator) + '</dd></div><div><dt>修改时间</dt><dd>' + esc(job.updatedAt) + '</dd></div></dl></div></article>'; }).join('') : '<div class="dm-empty panel"><i class="bi bi-inbox"></i><span>暂无符合条件的逆向建模任务</span></div>') + '</div>' + renderPagination(jobs.length, 1, 1, 'noop');
  }
  function jobRecords(job) {
    var dates = ['2026-09-08', '2026-09-07', '2026-09-06'];
    return dates.map(function (date, index) {
      var failed = index === 1 && job.failed ? 1 : 0, success = Math.max(1, Math.round(job.success / 3) - failed);
      return { id: job.id + '-L' + index, start: date + ' 02:' + String(30 + index * 5).padStart(2, '0') + ':01', end: date + ' 02:' + String(31 + index * 5).padStart(2, '0') + ':' + (18 + index * 7), duration: (index + 1) * 18 + '秒' + (245 + index * 81) + '毫秒', result: failed ? '建模失败' : '建模成功', success: success, failed: failed };
    });
  }
  function filteredJobRecords(job) {
    var rows = jobRecords(job), f = state.reverseDetailFilters;
    return rows.filter(function (row) { var day = row.start.slice(0, 10); return (!f.result || row.result === f.result) && (!f.from || day >= f.from.slice(0, 10)) && (!f.to || day <= f.to.slice(0, 10)); });
  }
  function renderReverseDetail() {
    var job = findById(store.reverseJobs, state.reverseDetailId), rows = filteredJobRecords(job);
    var dates = DP.datePicker ? DP.datePicker.render({ mode: 'range', label: '执行时间', output: 'datetime', start: state.reverseDetailFilters.from, end: state.reverseDetailFilters.to, startAttrs: { 'data-dm-reverse-date': 'from' }, endAttrs: { 'data-dm-reverse-date': 'to' } }) : '';
    dates += button('reverse-detail-query', 'search', '查询', '', 'btn btn-primary') + button('reverse-detail-reset', 'arrow-counterclockwise', '重置');
    return pageHeader('file-earmark-text', job.name, statusTag(job.status) + button('back-reverse-detail', 'arrow-left', '返回')) + '<section class="dm-job-summary"><div class="dm-job-metrics">' + metric('执行总次数', job.runs + ' 次') + metric('建模成功', job.success + ' 个', 'success') + metric('建模失败', job.failed + ' 个', 'danger') + metric(job.tableType || '业务表', (job.success + job.failed) + ' 个', 'primary') + '</div><dl><div><dt>数仓分层</dt><dd>' + esc(job.layer) + '</dd></div><div><dt>数据域</dt><dd>' + esc(job.domain) + '</dd></div><div><dt>执行方式</dt><dd>' + esc(job.executeType) + '</dd></div><div><dt>执行频率</dt><dd>' + esc(job.frequency) + '</dd></div><div><dt>操作者</dt><dd>' + esc(job.operator) + '</dd></div><div><dt>修改时间</dt><dd>' + esc(job.updatedAt) + '</dd></div></dl></section><section class="dm-section"><div class="dm-section-title"><h3><i class="bi bi-journal-text"></i>执行记录</h3></div><div class="dm-inline-query dm-record-query"><label><span>执行结果</span>' + selectControl('reverse-detail-filter="result"', state.reverseDetailFilters.result, ['建模成功', '建模失败'], '请选择执行结果') + '</label>' + dates + button('export-records', 'download', '导出') + '</div><div class="dm-table-wrap"><table class="ds-table dm-reverse-record-table"><thead><tr><th>开始时间</th><th>结束时间</th><th>执行时长</th><th>执行结果</th><th>操作</th></tr></thead><tbody>' +
      (rows.length ? rows.map(function (row) { return '<tr><td>' + esc(row.start) + '</td><td>' + esc(row.end) + '</td><td>' + esc(row.duration) + '</td><td><div class="dm-record-result"><span>建模成功：<b>' + row.success + ' 个</b></span><span>建模失败：<b>' + row.failed + ' 个</b></span><span>' + esc(job.tableType || '业务表') + ' <b>' + (row.success + row.failed) + ' 个</b></span></div></td><td>' + button('record-checklist', 'list-check', '查看清单', 'data-id="' + row.id + '" data-job="' + job.id + '"', 'dm-link-btn') + '</td></tr>'; }).join('') : '<tr><td colspan="5"><div class="dm-empty"><i class="bi bi-inbox"></i><span>暂无符合条件的执行记录</span></div></td></tr>') + '</tbody></table></div>' + renderPagination(rows.length, 1, 1, 'noop') + '</section>';
  }
  function renderReverse() { return state.reverseDetailId ? renderReverseDetail() : renderReverseList(); }
  function reverseChecklistRows(job) {
    var sourceRows = job.domain === '客户域' ? [
      ['crm_member_account', '会员账户', '会员账户主数据'], ['crm_member_level', '会员等级', '会员等级定义'], ['crm_member_address', '会员地址', '会员常用地址'], ['crm_member_tag', '会员标签', '会员运营标签'], ['crm_member_points', '会员积分', '会员积分流水']
    ] : job.domain === '供应链域' ? [
      ['scm_inventory_flow', '库存流水', '仓库库存变更明细'], ['scm_supplier', '供应商', '供应商主数据'], ['scm_purchase_order', '采购订单', '采购业务单据'], ['scm_warehouse', '仓库信息', '仓库基础信息'], ['scm_product_stock', '商品库存', '商品实时库存']
    ] : [
      ['ods_trade_order', '交易订单', '订单交易主表'], ['ods_trade_order_item', '订单明细', '订单商品明细'], ['ods_trade_payment', '支付记录', '订单支付流水'], ['ods_trade_refund', '退款申请', '订单退款申请'], ['ods_trade_delivery', '履约记录', '订单配送履约']
    ];
    return sourceRows.concat(sourceRows.map(function (row, index) { return [row[0] + '_his', row[1] + '历史', row[2] + '历史归档']; })).map(function (row, index) {
      return { name: row[0], alias: row[1], remark: row[2], rule: '${自定义}', attribute: '表', tableType: job.tableType || '业务表', status: index === 8 && job.failed ? '建模失败' : '建模成功' };
    });
  }
  function filteredReverseChecklist(job) {
    var keyword = String(state.modal.keyword || '').trim().toLowerCase(), status = state.modal.status || '';
    return reverseChecklistRows(job).filter(function (row) { return (!status || row.status === status) && (!keyword || (row.name + ' ' + row.alias + ' ' + row.remark).toLowerCase().indexOf(keyword) >= 0); });
  }

  function renderOverlay() {
    if (!state.modal) return '';
    if (state.modal.kind === 'model-picker') {
      var choices = store.models.filter(function (model) { return state.materialForm.modelIds.indexOf(model.id) < 0; });
      return '<div class="dm-modal-mask" data-dm-modal-mask><section class="dm-modal" role="dialog" aria-modal="true"><header><h3>添加待物化模型</h3>' + button('close-modal', 'x-lg', '关闭', '', 'dm-icon-text-btn') + '</header><div class="dm-modal-body"><div class="dm-inline-query"><input class="dm-control" type="search" data-dm-picker-keyword value="' + esc(state.modal.keyword) + '" placeholder="搜索英文名称或别名"></div><div class="dm-table-wrap"><table class="ds-table"><thead><tr><th class="col-ck"></th><th>英文名称</th><th>别名</th><th>数仓分层</th><th>版本</th><th>物化状态</th></tr></thead><tbody>' + choices.filter(function (model) { var keyword = state.modal.keyword.toLowerCase(); return !keyword || (model.name + ' ' + model.alias).toLowerCase().indexOf(keyword) >= 0; }).map(function (model) { return '<tr><td class="col-ck"><input type="checkbox" data-dm-picker-check="' + model.id + '"' + (state.modal.selected.has(model.id) ? ' checked' : '') + '></td><td>' + esc(model.name) + '</td><td>' + esc(model.alias) + '</td><td>' + esc(model.layer) + '</td><td>' + esc(model.version) + '</td><td>' + statusTag(model.materialized ? '已物化' : '未物化') + '</td></tr>'; }).join('') + '</tbody></table></div></div><footer>' + button('close-modal', 'x-lg', '取消') + button('apply-model-picker', 'check-lg', '添加', '', 'btn btn-primary') + '</footer></section></div>';
    }
    if (state.modal.kind === 'reverse-form') {
      var draftJob = state.modal.draft;
      var subtypeOptions = reverseTableSubtypes[draftJob.tableType] || [];
      var tableTypeControls = '<div class="dm-reverse-table-types">' + selectDraft('modal', 'tableType', draftJob.tableType, draftJob.tableType ? [draftJob.tableType] : [], '请选择', 'disabled aria-disabled="true"') + selectDraft('modal', 'tableSubtype', draftJob.tableSubtype || '', subtypeOptions, '请选择', subtypeOptions.length ? '' : 'disabled aria-disabled="true"') + '</div>';
      return '<div class="dm-modal-mask" data-dm-modal-mask><section class="dm-modal reverse" role="dialog" aria-modal="true"><header><h3>' + (draftJob.id ? '编辑' : '新建') + '</h3>' + button('close-modal', 'x-lg', '关闭', '', 'dm-icon-text-btn') + '</header><div class="dm-modal-body dm-form-grid single">' +
        field('名称', inputDraft('modal', 'name', draftJob.name, '100个字符以内', 'maxlength="100"'), true, true) +
        field('数据源', renderReverseSourcePicker(draftJob), true, true) +
        field('数仓分层', renderReversePlanPicker(draftJob), true, true) +
        field('表类型', tableTypeControls, true, true) +
        field('数据域', renderReverseDomainPicker(draftJob), true, true) +
        field('执行方式', '<div class="dm-radio-line"><label><input type="radio" name="executeType" data-dm-draft="modal.executeType" value="增量更新"' + (draftJob.executeType === '增量更新' ? ' checked' : '') + '>增量更新</label><label><input type="radio" name="executeType" data-dm-draft="modal.executeType" value="全量覆盖"' + (draftJob.executeType === '全量覆盖' ? ' checked' : '') + '>全量覆盖</label></div>', true, true) +
        field('匹配逻辑', '<div class="dm-radio-line"><label><input type="radio" name="matchLogic" data-dm-draft="modal.matchLogic" value="不区分大小写"' + (draftJob.matchLogic === '不区分大小写' ? ' checked' : '') + '>不区分大小写</label><label><input type="radio" name="matchLogic" data-dm-draft="modal.matchLogic" value="区分大小写"' + (draftJob.matchLogic === '区分大小写' ? ' checked' : '') + '>区分大小写</label></div>', true, true) +
        field('表名匹配规则', '<div class="dm-reverse-rules">' + renderReverseRuleRows(draftJob) + '</div>', true, true) +
        field('执行频率', renderReverseFrequency(draftJob), true, true) +
        '</div><footer>' + button('close-modal', 'x-lg', '取消') + button('save-reverse', 'floppy', '保存', '', 'btn btn-primary') + '</footer></section></div>';
    }
    if (state.modal.kind === 'model-detail') {
      var model = findById(store.models, state.modal.id);
      return '<div class="dm-modal-mask" data-dm-modal-mask><section class="dm-modal" role="dialog" aria-modal="true"><header><h3>物化详情</h3>' + button('close-modal', 'x-lg', '关闭', '', 'dm-icon-text-btn') + '</header><div class="dm-modal-body"><div class="dm-detail-grid"><div><span>模型</span><strong>' + esc(model.alias) + '</strong></div><div><span>英文名称</span><strong>' + esc(model.name) + '</strong></div><div><span>数仓分层</span><strong>' + esc(model.layer) + '</strong></div><div><span>当前版本</span><strong>' + esc(model.version) + '</strong></div><div><span>数据源</span><strong>' + esc(model.dbType === 'Hive' ? 'ODS贴源库' : model.dbType === 'Clickhouse' ? 'ADS应用库' : 'DWD明细库') + '</strong></div><div><span>物化状态</span>' + statusTag('已物化') + '</div></div></div><footer>' + button('close-modal', 'check-lg', '关闭', '', 'btn btn-primary') + '</footer></section></div>';
    }
    if (state.modal.kind === 'checklist') {
      var selectedJob = findById(store.reverseJobs, state.modal.jobId);
      var checklistRows = filteredReverseChecklist(selectedJob);
      return '<div class="dm-modal-mask" data-dm-modal-mask><section class="dm-modal dm-checklist-modal" role="dialog" aria-modal="true"><header><h3>查看清单</h3>' + button('close-modal', 'x-lg', '关闭', '', 'dm-icon-text-btn') + '</header><div class="dm-modal-body"><div class="dm-inline-query dm-checklist-query"><label><span>状态</span>' + selectControl('checklist-status', state.modal.status || '', ['建模成功', '建模失败'], '请选择状态') + '</label><input class="dm-control" type="search" data-dm-checklist-keyword value="' + esc(state.modal.keywordDraft || '') + '" placeholder="英文名/别名/备注关键字查询">' + button('checklist-query', 'search', '查询', '', 'btn btn-primary') + button('export-checklist', 'download', '导出') + '</div><div class="dm-table-wrap"><table class="ds-table dm-checklist-table"><thead><tr><th>英文名称</th><th>匹配规则</th><th>别名</th><th>属性</th><th>表类型</th><th>备注</th><th>状态</th><th>操作</th></tr></thead><tbody>' + (checklistRows.length ? checklistRows.map(function (row) { return '<tr><td><strong>' + esc(row.name) + '</strong></td><td><code>' + esc(row.rule) + '</code></td><td>' + esc(row.alias) + '</td><td>' + esc(row.attribute) + '</td><td>' + esc(row.tableType) + '</td><td title="' + esc(row.remark) + '">' + esc(row.remark) + '</td><td>' + statusTag(row.status) + '</td><td></td></tr>'; }).join('') : '<tr><td colspan="8"><div class="dm-empty"><i class="bi bi-inbox"></i><span>暂无符合条件的建模清单</span></div></td></tr>') + '</tbody></table></div>' + renderPagination(checklistRows.length, 1, 1, 'noop') + '</div></section></div>';
    }
    return '';
  }
  function render() {
    var html = state.view === 'plan' ? renderPlan() : state.view === 'model' ? renderModel() : state.view === 'material' ? renderMaterial() : renderReverse();
    root.innerHTML = html + '<div data-dm-overlay>' + renderOverlay() + '</div>';
  }
  function renderOverlayOnly() { var target = root.querySelector('[data-dm-overlay]'); if (target) target.innerHTML = renderOverlay(); }
  function setDraft(path, value) {
    var parts = path.split('.'), scope = parts[0], key = parts[1], target = scope === 'plan' ? state.planForm : scope === 'model' ? state.modelForm : scope === 'material' ? state.materialForm : state.modal && state.modal.draft;
    if (target) target[key] = value;
    if (scope === 'plan' && key === 'group') {
      var linkedTypes = planModelTypes[value] || [];
      if (!linkedTypes.some(function (item) { return item[0] === target.modelType; })) target.modelType = linkedTypes.length ? linkedTypes[0][0] : '';
      render();
    }
    if (scope === 'model' && key === 'ruleId') { var rule = findById(store.rules, value); state.modelForm.ruleContent = rule ? rule.template : ''; render(); }
    if (scope === 'modal' && key === 'rateType' && state.modal && state.modal.kind === 'reverse-form') {
      if (value === '每周') target.rateDay = /^周/.test(target.rateDay || '') ? target.rateDay : '周一';
      if (value === '每月') target.rateDay = /日$/.test(target.rateDay || '') ? target.rateDay : '1日';
      renderOverlayOnly();
    }
  }
  function openPlan(mode, id) {
    var existing = id ? findById(store.plans, id) : null;
    state.ruleKeywordDraft = '';
    state.ruleKeyword = '';
    state.ruleEdit = null;
    state.planForm = existing ? clone(existing) : { id: '', group: 'PUBLIC', code: '', name: '', englishName: '', modelType: 'DIM', remark: '', creator: '演示用户', updatedAt: '2026-09-08 10:00:00' };
    render();
  }
  function savePlan() {
    var draft = state.planForm;
    if (!draft.code.trim() || !draft.englishName.trim() || !draft.name.trim() || !draft.group || !draft.modelType) return toast('请完整填写必填信息。', 'warning');
    if (store.plans.some(function (item) { return item.id !== draft.id && item.code.toLowerCase() === draft.code.toLowerCase(); })) return toast('分层编码已存在。', 'warning');
    if (!draft.id) {
      var temporaryPlanId = '__new__';
      draft.id = 'P' + Date.now();
      store.rules.forEach(function (rule) { if (rule.planId === temporaryPlanId) rule.planId = draft.id; });
      store.plans.push(clone(draft));
    }
    else store.plans[store.plans.findIndex(function (item) { return item.id === draft.id; })] = clone(draft);
    persist(); state.planForm = null; render(); toast('数仓分层已保存。');
  }
  function focusRuleField(fieldName) {
    var input = root.querySelector('[data-dm-rule-field="' + fieldName + '"]');
    if (!input) return;
    input.focus();
    if (typeof input.setSelectionRange === 'function') input.setSelectionRange(input.value.length, input.value.length);
  }
  function saveInlineRule() {
    var rule = state.ruleEdit;
    if (!rule || !rule.name.trim() || !rule.template.trim()) return toast('请填写规则名称与规则模板。', 'warning');
    if (!rule.id) {
      rule.id = 'R' + Date.now();
      store.rules.push(clone(rule));
    } else {
      store.rules[store.rules.findIndex(function (item) { return item.id === rule.id; })] = clone(rule);
    }
    if (rule.planId !== '__new__') persist();
    state.ruleEdit = null;
    render();
    toast('建模规范已保存。');
  }
  function deleteWithConfirm(message, callback) {
    DP.confirm(message, { icon: 'danger', okText: '<i class="bi bi-trash3"></i> 删除', cancelText: '<i class="bi bi-x-lg"></i> 取消', onOk: callback });
  }
  function newModel(method) {
    var defaultLayer = state.modelLayer && state.modelLayer.indexOf('/') >= 0 ? state.modelLayer : '公共层/交易明细 DWD';
    var defaultPlan = planByPath(defaultLayer) || findById(store.plans, 'P008') || store.plans[0];
    state.modelCreateOpen = false; state.datasetPreview = false; state.datasetKeyword = ''; state.datasetTab = 'preview'; state.standardPickerIndex = -1; state.standardKeyword = ''; state.sqlSearchOpen = false;
    state.modelPlanOpen = false; state.modelPlanKeyword = '';
    state.modelForm = { id: '', method: method, planId: defaultPlan ? defaultPlan.id : '', layer: defaultPlan ? planPath(defaultPlan) : '', tableType: linkedTableType(defaultPlan), ruleId: 'R002', ruleContent: findById(store.rules, 'R002').template, domain: '交易域', updateType: '按天增量（di）', name: '', alias: '', dbType: method === '数据集建模' ? 'Clickhouse' : 'StarRocks', attribute: '表', version: 'V1', remark: '', fields: defaultFields('交易域'), sql: defaultSql('new_model', '交易域'), datasetSource: 'ODS贴源库', datasetFields: defaultDatasetFields() };
    render();
  }
  function saveModel() {
    var draft = state.modelForm;
    if (!draft.layer || !draft.tableType || !draft.domain || !draft.name.trim() || !draft.alias.trim() || !draft.dbType) return toast('请完整填写模型基础信息。', 'warning');
    if (store.models.some(function (item) { return item.id !== draft.id && item.name.toLowerCase() === draft.name.toLowerCase() && item.version === draft.version; })) return toast('当前版本已存在同名模型。', 'warning');
    if (!draft.id) { draft.id = 'M' + Date.now(); draft.materialized = false; store.models.unshift(clone(draft)); }
    else store.models[store.models.findIndex(function (item) { return item.id === draft.id; })] = clone(draft);
    persist(); state.modelForm = null; render(); toast('模型已保存。');
  }
  function openMaterialForm(ids) {
    state.materialForm = { project: '数据中台项目', environment: '开发', source: '', mode: '增量发布', remark: '数据建模模型物化发布', modelIds: (ids || store.pendingMaterialIds || []).slice() };
    state.materialSourceOpen = false;
    state.materialSourceKeyword = '';
    state.pendingSelected = new Set(); render();
  }
  function publishMaterial() {
    var draft = state.materialForm;
    if (!draft.source || !draft.mode || !draft.remark.trim()) return toast('请完整填写物化发布信息。', 'warning');
    if (!draft.modelIds.length) return toast('请至少添加一个待物化模型。', 'warning');
    draft.modelIds.forEach(function (id) { var model = findById(store.models, id); if (model) model.materialized = true; });
    store.materialRuns.unshift({ id: 'MR' + Date.now(), source: draft.source, project: draft.project || '-', environment: draft.environment || '-', mode: draft.mode, status: '执行中', total: draft.modelIds.length, success: 0, failed: 0, remark: draft.remark, time: '2026-09-08 10:36:00' });
    store.pendingMaterialIds = []; persist(); state.materialForm = null; render(); toast('物化任务已发布。');
  }
  function openReverseForm(id) {
    var existing = id ? findById(store.reverseJobs, id) : null;
    var existingPlan = existing ? planByPath(existing.layer) : null;
    var rateType = existing && /^(每天|每周|每月|cron表达式|执行一次)/.test(existing.frequency) ? existing.frequency.match(/^(每天|每周|每月|cron表达式|执行一次)/)[0] : '每周';
    var rateDay = existing && (existing.frequency.match(/周[一二三四五六日]/) || existing.frequency.match(/\d{1,2}日/));
    var existingRules = existing && Array.isArray(existing.rules) && existing.rules.length ? existing.rules.slice() : ['custom'];
    state.reverseSourceOpen = false; state.reverseSourceKeyword = ''; state.reversePlanOpen = false; state.reversePlanKeyword = ''; state.reverseDomainOpen = false; state.reverseDomainKeyword = '';
    state.modal = { kind: 'reverse-form', draft: existing ? Object.assign(clone(existing), { planId: existingPlan ? existingPlan.id : '', tableSubtype: existing.tableSubtype || '', rules: existingRules, rateType: rateType, rateDay: rateDay ? rateDay[0] : (rateType === '每月' ? '1日' : '周一'), rateTime: (existing.frequency.match(/\d{2}:\d{2}:\d{2}/) || ['02:30:00'])[0], cronExpr: rateType === 'cron表达式' ? existing.frequency.replace(/^cron表达式\s*/, '') : '', onceTime: '' }) : { id: '', name: '', status: '已停止', source: '', planId: '', layer: '', tableType: '', tableSubtype: '', domain: '', executeType: '增量更新', matchLogic: '不区分大小写', rules: [''], rule: '', rateType: '每周', rateDay: '周一', rateTime: '', cronExpr: '', onceTime: '', operator: '演示用户', updatedAt: '2026-09-08 10:00:00', runs: 0, success: 0, failed: 0 } };
    renderOverlayOnly();
  }
  function saveReverse() {
    var draft = state.modal.draft;
    var rateComplete = draft.rateType === 'cron表达式' ? draft.cronExpr.trim() : draft.rateType === '执行一次' ? draft.onceTime : draft.rateTime;
    if (!draft.name.trim() || !draft.source || !draft.layer || !draft.tableType || !draft.domain || !draft.executeType || !draft.rules.length || draft.rules.some(function (ruleId) { return !ruleId; }) || !draft.rateType || !rateComplete) return toast('请完整填写逆向建模配置。', 'warning');
    if (draft.tableType === '维度表' && !draft.tableSubtype) return toast('请选择维度表子类型。', 'warning');
    draft.rule = draft.rules.map(function (ruleId) { var rule = reverseRuleById(ruleId); return rule ? rule.name : ''; }).filter(Boolean).join('、');
    draft.frequency = draft.rateType === 'cron表达式' ? 'cron表达式 ' + draft.cronExpr : draft.rateType === '执行一次' ? '执行一次 ' + draft.onceTime.replace('T', ' ') : draft.rateType + (draft.rateType === '每周' || draft.rateType === '每月' ? ' ' + draft.rateDay : '') + ' ' + draft.rateTime;
    delete draft.rateType; delete draft.rateDay; delete draft.rateTime; delete draft.cronExpr; delete draft.onceTime; delete draft.planId;
    if (!draft.id) { draft.id = 'J' + Date.now(); store.reverseJobs.unshift(clone(draft)); }
    else store.reverseJobs[store.reverseJobs.findIndex(function (item) { return item.id === draft.id; })] = clone(draft);
    persist(); state.modal = null; render(); toast('逆向建模任务已保存。');
  }
  function exportRecords() {
    var job = findById(store.reverseJobs, state.reverseDetailId), rows = filteredJobRecords(job);
    var csv = '\ufeff开始时间,结束时间,执行时长,执行结果,建模成功,建模失败\r\n' + rows.map(function (row) { return [row.start, row.end, row.duration, row.result, row.success, row.failed].join(','); }).join('\r\n');
    var url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    var link = document.createElement('a'); link.href = url; link.download = '逆向建模执行记录.csv'; document.body.appendChild(link); link.click(); link.remove(); URL.revokeObjectURL(url); toast('执行记录已导出。');
  }
  function exportReverseChecklist() {
    var job = findById(store.reverseJobs, state.modal.jobId), rows = filteredReverseChecklist(job);
    var csv = '\ufeff英文名称,匹配规则,别名,属性,表类型,备注,状态\r\n' + rows.map(function (row) { return [row.name, row.rule, row.alias, row.attribute, row.tableType, row.remark, row.status].map(function (value) { return '"' + String(value || '').replace(/"/g, '""') + '"'; }).join(','); }).join('\r\n');
    var url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    var link = document.createElement('a'); link.href = url; link.download = '逆向建模清单.csv'; document.body.appendChild(link); link.click(); link.remove(); URL.revokeObjectURL(url); toast('建模清单已导出。');
  }
  function resetModelFilters() {
    state.modelFilters = { version: '', method: '', material: '', attribute: '', dbType: '', tableType: '' }; state.modelKeyword = ''; state.modelKeywordDraft = ''; state.modelPage = 1; render();
  }
  function onClick(event) {
    if (event.target.matches('[data-dm-modal-mask]')) { state.modal = null; renderOverlayOnly(); return; }
    var actionEl = event.target.closest('[data-dm-action]');
    if (!actionEl) {
      var closeFloating = false;
      if (state.standardPickerIndex >= 0 && !event.target.closest('.dm-standard-panel')) { state.standardPickerIndex = -1; state.standardKeyword = ''; closeFloating = true; }
      if (state.materialSourceOpen && !event.target.closest('.dm-material-source-panel')) { state.materialSourceOpen = false; state.materialSourceKeyword = ''; closeFloating = true; }
      if (state.reverseSourceOpen && !event.target.closest('.dm-reverse-picker-panel')) { state.reverseSourceOpen = false; state.reverseSourceKeyword = ''; closeFloating = true; }
      if (state.reversePlanOpen && !event.target.closest('.dm-reverse-picker-panel')) { state.reversePlanOpen = false; state.reversePlanKeyword = ''; closeFloating = true; }
      if (state.reverseDomainOpen && !event.target.closest('.dm-reverse-picker-panel')) { state.reverseDomainOpen = false; state.reverseDomainKeyword = ''; closeFloating = true; }
      if (closeFloating) state.modal && state.modal.kind === 'reverse-form' ? renderOverlayOnly() : render();
      return;
    }
    if (actionEl.disabled) return;
    if (actionEl.classList.contains('dm-modal-mask') && event.target.closest('.dm-modal')) return;
    var action = actionEl.dataset.dmAction, id = actionEl.dataset.id;
    if (action === 'noop') return;
    if (action === 'close-modal') { state.modal = null; renderOverlayOnly(); return; }
    if (action === 'new-plan') openPlan('new');
    else if (action === 'edit-plan') openPlan('edit', id);
    else if (action === 'back-plan') { if (state.planForm && !state.planForm.id) store.rules = store.rules.filter(function (rule) { return rule.planId !== '__new__'; }); state.ruleEdit = null; state.planForm = null; render(); }
    else if (action === 'save-plan') savePlan();
    else if (action === 'delete-plan') deleteWithConfirm('确认删除数仓分层“' + esc(findById(store.plans, id).name) + '”？', function () { store.plans = store.plans.filter(function (plan) { return plan.id !== id; }); store.rules = store.rules.filter(function (rule) { return rule.planId !== id; }); persist(); if (root.isConnected) { render(); toast('数仓分层已删除。'); } });
    else if (action === 'new-rule') { state.ruleEdit = { id: '', planId: state.planForm.id || '__new__', name: '', template: '', enabled: true }; render(); focusRuleField('name'); }
    else if (action === 'edit-rule') { state.ruleEdit = clone(findById(store.rules, id)); render(); focusRuleField('template'); }
    else if (action === 'save-rule') saveInlineRule();
    else if (action === 'cancel-rule') { state.ruleEdit = null; render(); }
    else if (action === 'delete-rule') deleteWithConfirm('确认删除该建模规范？', function () { store.rules = store.rules.filter(function (ruleItem) { return ruleItem.id !== id; }); if (state.ruleEdit && state.ruleEdit.id === id) state.ruleEdit = null; if (state.planForm && state.planForm.id) persist(); if (root.isConnected) render(); });
    else if (action === 'rule-query') { state.ruleKeyword = state.ruleKeywordDraft.trim(); render(); }
    else if (action === 'select-layer') { state.modelLayer = actionEl.dataset.layer || ''; state.modelPage = 1; render(); }
    else if (action === 'toggle-model-create') { state.modelCreateOpen = !state.modelCreateOpen; render(); }
    else if (action === 'new-model') newModel(actionEl.dataset.method);
    else if (action === 'back-model') { state.modelForm = null; state.modelPlanOpen = false; state.modelPlanKeyword = ''; state.standardPickerIndex = -1; state.standardKeyword = ''; state.sqlSearchOpen = false; render(); }
    else if (action === 'save-model') saveModel();
    else if (action === 'edit-model') { state.modelForm = clone(findById(store.models, id)); var editPlan = planByPath(state.modelForm.layer); state.modelForm.planId = editPlan ? editPlan.id : ''; if (editPlan) state.modelForm.tableType = linkedTableType(editPlan); if (!state.modelForm.datasetFields) state.modelForm.datasetFields = defaultDatasetFields(); state.modelPlanOpen = false; state.modelPlanKeyword = ''; state.standardPickerIndex = -1; state.standardKeyword = ''; state.sqlSearchOpen = false; state.datasetPreview = false; state.datasetKeyword = ''; state.datasetTab = 'preview'; render(); }
    else if (action === 'delete-model') deleteWithConfirm('确认删除模型“' + esc(findById(store.models, id).alias) + '”？', function () { store.models = store.models.filter(function (model) { return model.id !== id; }); persist(); if (root.isConnected) { render(); toast('模型已删除。'); } });
    else if (action === 'add-material-model') { if (store.pendingMaterialIds.indexOf(id) < 0) { store.pendingMaterialIds.push(id); persist(); render(); toast('已添加到待物化模型。'); } else toast('该模型已在待物化列表中。', 'warning'); }
    else if (action === 'model-detail') { state.modal = { kind: 'model-detail', id: id }; renderOverlayOnly(); }
    else if (action === 'show-pending') navigate('data-modeling-materialization', { mode: 'create', modelIds: store.pendingMaterialIds.slice() });
    else if (action === 'model-query') { state.modelKeyword = state.modelKeywordDraft.trim(); state.modelPage = 1; render(); }
    else if (action === 'model-reset') resetModelFilters();
    else if (action === 'model-refresh') { render(); toast('模型列表已刷新。'); }
    else if (action === 'model-density') { root.classList.toggle('compact-table'); }
    else if (action === 'model-columns') toast('当前列配置已按系统默认展示。');
    else if (action === 'model-page') { state.modelPage = Number(actionEl.dataset.page) || 1; render(); }
    else if (action === 'toggle-model-plan') { state.modelPlanOpen = !state.modelPlanOpen; if (!state.modelPlanOpen) state.modelPlanKeyword = ''; render(); }
    else if (action === 'select-model-plan') { var selectedPlan = findById(store.plans, id); if (selectedPlan && state.modelForm) { state.modelForm.planId = selectedPlan.id; state.modelForm.layer = planPath(selectedPlan); state.modelForm.tableType = linkedTableType(selectedPlan); state.modelPlanOpen = false; state.modelPlanKeyword = ''; render(); } }
    else if (action === 'toggle-field-standard') { var pickerIndex = Number(actionEl.dataset.index); var openingStandard = state.standardPickerIndex !== pickerIndex; state.standardPickerIndex = openingStandard ? pickerIndex : -1; state.standardKeyword = ''; if (openingStandard) { var triggerRect = actionEl.getBoundingClientRect ? actionEl.getBoundingClientRect() : { left: 24, top: 80, bottom: 120, width: 210 }; var pickerWidth = Math.min(Math.max(390, triggerRect.width || 0), (window.innerWidth || 1280) - 16); var pickerLeft = Math.max(8, Math.min(triggerRect.left, (window.innerWidth || 1280) - pickerWidth - 8)); var pickerTop = triggerRect.bottom + 4; if (pickerTop + 344 > (window.innerHeight || 800)) pickerTop = Math.max(8, triggerRect.top - 344); state.standardPickerPosition = { left: pickerLeft, top: pickerTop, width: pickerWidth }; } render(); if (state.standardPickerIndex >= 0) { var standardSearch = root.querySelector('[data-dm-standard-keyword]'); if (standardSearch) standardSearch.focus(); } }
    else if (action === 'select-field-standard') { var targetField = state.modelForm && state.modelForm.fields[Number(actionEl.dataset.index)]; if (targetField && applyStandard(targetField, actionEl.dataset.code || 'custom')) { state.standardPickerIndex = -1; state.standardKeyword = ''; render(); } }
    else if (action === 'add-field') { state.modelForm.fields.push({ standard: 'custom', name: '', alias: '', type: 'varchar', length: 64, precision: 0, defaultValue: '', required: false, primary: false, auto: false, remark: '' }); state.standardPickerIndex = -1; render(); }
    else if (action === 'remove-field') { state.modelForm.fields.splice(Number(actionEl.dataset.index), 1); state.standardPickerIndex = -1; render(); }
    else if (action === 'dataset-preview') { state.datasetPreview = true; state.datasetTab = 'preview'; render(); toast('数据预览已生成。'); }
    else if (action === 'dataset-tab') { state.datasetTab = actionEl.dataset.tab === 'config' ? 'config' : 'preview'; render(); }
    else if (action === 'choose-dataset') { state.modelForm.sql = 'SELECT *\nFROM ' + actionEl.dataset.value + "\nWHERE dt = '${biz_date}';"; state.modelForm.datasetFields = defaultDatasetFields(); state.datasetPreview = false; state.datasetTab = 'preview'; render(); }
    else if (action === 'format-sql') { if (state.modelForm) { state.modelForm.sql = String(currentSqlText()).replace(/\s+FROM\s+/i, '\nFROM ').replace(/\s+WHERE\s+/i, '\nWHERE ').replace(/,\s*/g, ',\n  '); render(); toast('SQL 已格式化。'); } }
    else if (action === 'copy-sql') { var sqlToCopy = currentSqlText(); if (navigator.clipboard) navigator.clipboard.writeText(sqlToCopy).catch(function () {}); toast('SQL 已复制。'); }
    else if (action === 'toggle-sql-search') { state.sqlSearchOpen = !state.sqlSearchOpen; render(); }
    else if (action === 'close-sql-search') { state.sqlSearchOpen = false; render(); }
    else if (action === 'sql-find-next' || action === 'sql-find-prev') { var findInput = root.querySelector('[data-dm-sql-find]'); var findValue = findInput ? findInput.value : ''; if (!findValue) return toast('请输入查找内容。', 'warning'); var caseInput = root.querySelector('[data-dm-sql-case]'); var found = window.find ? window.find(findValue, !!(caseInput && caseInput.checked), action === 'sql-find-prev', true, false, false, false) : false; if (!found) toast('未找到匹配内容。', 'warning'); }
    else if (action === 'fullscreen-sql') root.classList.toggle('dm-editor-fullscreen');
    else if (action === 'new-material') openMaterialForm([]);
    else if (action === 'back-material') { state.materialForm = null; state.materialSourceOpen = false; state.materialSourceKeyword = ''; render(); }
    else if (action === 'publish-material') publishMaterial();
    else if (action === 'material-query') render();
    else if (action === 'material-reset') { state.materialFilters = { source: '', project: '', environment: '', mode: '', status: '' }; render(); }
    else if (action === 'material-detail') { state.materialDetailId = id; state.materialDetailStatus = ''; state.materialDetailKeywordDraft = ''; state.materialDetailKeyword = ''; state.materialLogModelId = ''; state.sqlSearchOpen = false; render(); }
    else if (action === 'back-material-detail') { state.materialDetailId = ''; state.materialDetailStatus = ''; state.materialDetailKeywordDraft = ''; state.materialDetailKeyword = ''; render(); }
    else if (action === 'material-detail-query') { state.materialDetailKeyword = state.materialDetailKeywordDraft.trim(); render(); }
    else if (action === 'view-material-log') { state.materialLogModelId = id; state.materialLogTab = 'execution'; state.sqlSearchOpen = false; render(); }
    else if (action === 'back-material-log') { state.materialLogModelId = ''; state.materialLogTab = 'execution'; state.sqlSearchOpen = false; render(); }
    else if (action === 'material-log-tab') { state.materialLogTab = actionEl.dataset.tab === 'ddl' ? 'ddl' : 'execution'; state.sqlSearchOpen = false; render(); }
    else if (action === 'format-material-code') { render(); toast('代码已格式化。'); }
    else if (action === 'copy-material-code') { var materialCode = currentMaterialCode(); if (navigator.clipboard) navigator.clipboard.writeText(materialCode).catch(function () {}); toast('代码已复制。'); }
    else if (action === 'material-add-model') navigate('data-modeling-model');
    else if (action === 'toggle-material-source') { state.materialSourceOpen = !state.materialSourceOpen; state.materialSourceKeyword = ''; render(); if (state.materialSourceOpen) { var materialSourceSearch = root.querySelector('[data-dm-material-source-keyword]'); if (materialSourceSearch) materialSourceSearch.focus(); } }
    else if (action === 'select-material-source') { state.materialForm.source = actionEl.dataset.value || ''; state.materialSourceOpen = false; state.materialSourceKeyword = ''; render(); }
    else if (action === 'open-model-picker') { state.modal = { kind: 'model-picker', keyword: '', selected: new Set() }; renderOverlayOnly(); }
    else if (action === 'apply-model-picker') { state.materialForm.modelIds = state.materialForm.modelIds.concat(Array.from(state.modal.selected)); state.modal = null; render(); }
    else if (action === 'remove-pending') { if (!state.pendingSelected.size) return toast('请先选择需要移除的模型。', 'warning'); state.materialForm.modelIds = state.materialForm.modelIds.filter(function (modelId) { return !state.pendingSelected.has(modelId); }); store.pendingMaterialIds = store.pendingMaterialIds.filter(function (modelId) { return !state.pendingSelected.has(modelId); }); state.pendingSelected.clear(); persist(); render(); }
    else if (action === 'new-reverse') openReverseForm();
    else if (action === 'edit-reverse') openReverseForm(id);
    else if (action === 'toggle-reverse-source') { state.reverseSourceOpen = !state.reverseSourceOpen; state.reversePlanOpen = false; state.reverseDomainOpen = false; state.reverseSourceKeyword = ''; renderOverlayOnly(); if (state.reverseSourceOpen) { var reverseSourceSearch = root.querySelector('[data-dm-reverse-source-keyword]'); if (reverseSourceSearch) reverseSourceSearch.focus(); } }
    else if (action === 'select-reverse-source') { state.modal.draft.source = actionEl.dataset.value || ''; state.reverseSourceOpen = false; state.reverseSourceKeyword = ''; renderOverlayOnly(); }
    else if (action === 'toggle-reverse-plan') { state.reversePlanOpen = !state.reversePlanOpen; state.reverseSourceOpen = false; state.reverseDomainOpen = false; state.reversePlanKeyword = ''; renderOverlayOnly(); if (state.reversePlanOpen) { var reversePlanSearch = root.querySelector('[data-dm-reverse-plan-keyword]'); if (reversePlanSearch) reversePlanSearch.focus(); } }
    else if (action === 'select-reverse-plan') { var reversePlan = findById(store.plans, id); if (reversePlan) { state.modal.draft.planId = reversePlan.id; state.modal.draft.layer = planPath(reversePlan); state.modal.draft.tableType = linkedTableType(reversePlan); state.modal.draft.tableSubtype = ''; state.reversePlanOpen = false; state.reversePlanKeyword = ''; renderOverlayOnly(); } }
    else if (action === 'toggle-reverse-domain') { state.reverseDomainOpen = !state.reverseDomainOpen; state.reverseSourceOpen = false; state.reversePlanOpen = false; state.reverseDomainKeyword = ''; renderOverlayOnly(); if (state.reverseDomainOpen) { var reverseDomainSearch = root.querySelector('[data-dm-reverse-domain-keyword]'); if (reverseDomainSearch) reverseDomainSearch.focus(); } }
    else if (action === 'select-reverse-domain') { state.modal.draft.domain = actionEl.dataset.value || ''; state.reverseDomainOpen = false; state.reverseDomainKeyword = ''; renderOverlayOnly(); }
    else if (action === 'add-reverse-rule') { state.modal.draft.rules.push(''); renderOverlayOnly(); }
    else if (action === 'remove-reverse-rule') { state.modal.draft.rules.splice(Number(actionEl.dataset.index), 1); if (!state.modal.draft.rules.length) state.modal.draft.rules.push(''); renderOverlayOnly(); }
    else if (action === 'save-reverse') saveReverse();
    else if (action === 'toggle-job') { var job = findById(store.reverseJobs, id); job.status = job.status === '运行中' ? '已停止' : '运行中'; persist(); render(); toast('任务已' + (job.status === '运行中' ? '启动。' : '停止。')); }
    else if (action === 'delete-reverse') deleteWithConfirm('确认删除逆向建模任务“' + esc(findById(store.reverseJobs, id).name) + '”？', function () { store.reverseJobs = store.reverseJobs.filter(function (jobItem) { return jobItem.id !== id; }); persist(); if (root.isConnected) render(); });
    else if (action === 'reverse-detail') { state.reverseDetailId = id; state.reverseDetailFilters = { result: '', from: '', to: '' }; render(); }
    else if (action === 'back-reverse-detail') { state.reverseDetailId = ''; render(); }
    else if (action === 'reverse-query') { state.reverseKeyword = state.reverseKeywordDraft.trim(); render(); }
    else if (action === 'reverse-reset') { state.reverseFilters = { executeType: '', status: '' }; state.reverseKeyword = ''; state.reverseKeywordDraft = ''; render(); }
    else if (action === 'reverse-detail-query') { render(); toast('执行记录已查询。'); }
    else if (action === 'reverse-detail-reset') { state.reverseDetailFilters = { result: '', from: '', to: '' }; render(); }
    else if (action === 'export-records') exportRecords();
    else if (action === 'record-checklist') { state.modal = { kind: 'checklist', jobId: actionEl.dataset.job, recordId: id, status: '', keywordDraft: '', keyword: '' }; renderOverlayOnly(); }
    else if (action === 'checklist-query') { state.modal.keyword = String(state.modal.keywordDraft || '').trim(); renderOverlayOnly(); }
    else if (action === 'export-checklist') exportReverseChecklist();
  }
  function onInput(event) {
    var el = event.target;
    if (el.matches('[data-dm-model-keyword]')) state.modelKeywordDraft = el.value;
    else if (el.matches('[data-dm-material-detail-keyword]')) state.materialDetailKeywordDraft = el.value;
    else if (el.matches('[data-dm-reverse-keyword]')) state.reverseKeywordDraft = el.value;
    else if (el.matches('[data-dm-rule-keyword]')) state.ruleKeywordDraft = el.value;
    else if (el.matches('[data-dm-rule-field]') && state.ruleEdit) state.ruleEdit[el.dataset.dmRuleField] = el.value;
    else if (el.matches('[data-dm-tree-keyword]')) { state.treeKeyword = el.value; var target = root.querySelector('[data-dm-tree]'); if (target) target.innerHTML = renderModelTree(); }
    else if (el.matches('[data-dm-model-plan-keyword]')) { state.modelPlanKeyword = el.value; var modelPlanTree = root.querySelector('[data-dm-model-plan-tree]'); if (modelPlanTree) modelPlanTree.innerHTML = renderModelPlanTree(); }
    else if (el.matches('[data-dm-material-source-keyword]')) { state.materialSourceKeyword = el.value; var materialSourceTreeTarget = root.querySelector('[data-dm-material-source-tree]'); if (materialSourceTreeTarget) materialSourceTreeTarget.innerHTML = renderMaterialSourceTree(); }
    else if (el.matches('[data-dm-reverse-source-keyword]')) { state.reverseSourceKeyword = el.value; var reverseSourceTreeTarget = root.querySelector('[data-dm-reverse-source-tree]'); if (reverseSourceTreeTarget) reverseSourceTreeTarget.innerHTML = renderReverseSourceTree(); }
    else if (el.matches('[data-dm-reverse-plan-keyword]')) { state.reversePlanKeyword = el.value; var reversePlanTreeTarget = root.querySelector('[data-dm-reverse-plan-tree]'); if (reversePlanTreeTarget) reversePlanTreeTarget.innerHTML = renderReversePlanTree(); }
    else if (el.matches('[data-dm-reverse-domain-keyword]')) { state.reverseDomainKeyword = el.value; renderOverlayOnly(); var reverseDomainKeyword = root.querySelector('[data-dm-reverse-domain-keyword]'); if (reverseDomainKeyword) { reverseDomainKeyword.focus(); reverseDomainKeyword.setSelectionRange(reverseDomainKeyword.value.length, reverseDomainKeyword.value.length); } }
    else if (el.matches('[data-dm-checklist-keyword]') && state.modal && state.modal.kind === 'checklist') state.modal.keywordDraft = el.value;
    else if (el.matches('[data-dm-standard-keyword]')) { state.standardKeyword = el.value; var standardOptions = root.querySelector('[data-dm-standard-options]'); if (standardOptions) standardOptions.innerHTML = renderStandardOptions(Number(el.dataset.index)); }
    else if (el.matches('[data-dm-sql-content]') && state.modelForm) { state.modelForm.sql = el.innerText || el.textContent || ''; var sqlGutter = root.querySelector('[data-dm-sql-gutter]'); if (sqlGutter) sqlGutter.innerHTML = sqlLineNumbers(state.modelForm.sql); }
    else if (el.matches('[data-dm-dataset-keyword]')) {
      state.datasetKeyword = el.value;
      render();
      var datasetSearch = root.querySelector('[data-dm-dataset-keyword]');
      if (datasetSearch) { datasetSearch.focus(); datasetSearch.setSelectionRange(datasetSearch.value.length, datasetSearch.value.length); }
    }
    else if (el.matches('[data-dm-picker-keyword]') && state.modal) {
      state.modal.keyword = el.value;
      renderOverlayOnly();
      var pickerSearch = root.querySelector('[data-dm-picker-keyword]');
      if (pickerSearch) { pickerSearch.focus(); pickerSearch.setSelectionRange(pickerSearch.value.length, pickerSearch.value.length); }
    }
    else if (el.matches('[data-dm-dataset-field]') && state.modelForm && el.tagName !== 'SELECT' && el.type !== 'checkbox') { var datasetInputField = (state.modelForm.datasetFields || [])[Number(el.dataset.index)]; if (datasetInputField) datasetInputField[el.dataset.dmDatasetField] = el.type === 'number' ? Number(el.value) : el.value; }
    else if (el.matches('[data-dm-draft]') && el.tagName !== 'SELECT' && el.type !== 'checkbox' && el.type !== 'radio') setDraft(el.dataset.dmDraft, el.value);
    else if (el.matches('[data-dm-field]') && state.modelForm) { var fieldItem = state.modelForm.fields[Number(el.dataset.index)]; if (fieldItem) fieldItem[el.dataset.dmField] = el.type === 'number' ? Number(el.value) : el.value; }
  }
  function onChange(event) {
    var el = event.target;
    if (el.matches('[data-dm-rule-field]') && state.ruleEdit) state.ruleEdit[el.dataset.dmRuleField] = el.dataset.dmRuleField === 'enabled' ? el.value === 'true' : el.value;
    else if (el.matches('[data-dm-model-filter]')) { state.modelFilters[el.dataset.dmModelFilter] = el.value; state.modelPage = 1; render(); }
    else if (el.matches('[data-dm-material-filter]')) { state.materialFilters[el.dataset.dmMaterialFilter] = el.value; render(); }
    else if (el.matches('[data-dm-material-detail-status]')) { state.materialDetailStatus = el.value; render(); }
    else if (el.matches('[data-dm-reverse-filter]')) { state.reverseFilters[el.dataset.dmReverseFilter] = el.value; render(); }
    else if (el.matches('[data-dm-reverse-detail-filter]')) { state.reverseDetailFilters[el.dataset.dmReverseDetailFilter] = el.value; render(); }
    else if (el.matches('[data-dm-reverse-date]')) { var picker = el.closest('[data-dp-date-picker]'); state.reverseDetailFilters.from = picker.querySelector('[data-dp-date-value="start"]').value; state.reverseDetailFilters.to = picker.querySelector('[data-dp-date-value="end"]').value; render(); }
    else if (el.matches('[data-dm-reverse-rule]') && state.modal && state.modal.kind === 'reverse-form') { state.modal.draft.rules[Number(el.dataset.dmReverseRule)] = el.value; renderOverlayOnly(); }
    else if (el.matches('[data-dm-checklist-status]') && state.modal && state.modal.kind === 'checklist') { state.modal.status = el.value; renderOverlayOnly(); }
    else if (el.matches('[data-dm-sql-theme]')) { state.sqlTheme = el.value === 'light' ? 'light' : 'dark'; var themeEditor = el.closest('[data-dm-sql-editor]'); if (themeEditor) { themeEditor.classList.toggle('theme-light', state.sqlTheme === 'light'); themeEditor.classList.toggle('theme-dark', state.sqlTheme !== 'light'); } }
    else if (el.matches('[data-dm-sql-font]')) { state.sqlFont = el.value || '14px'; var fontEditor = el.closest('[data-dm-sql-editor]'); if (fontEditor) fontEditor.style.fontSize = state.sqlFont; }
    else if (el.matches('[data-dm-dataset-field]') && state.modelForm) { var datasetFieldValue = (state.modelForm.datasetFields || [])[Number(el.dataset.index)]; if (datasetFieldValue) datasetFieldValue[el.dataset.dmDatasetField] = el.type === 'checkbox' ? el.checked : el.type === 'number' ? Number(el.value) : el.value; }
    else if (el.matches('[data-dm-draft]')) setDraft(el.dataset.dmDraft, el.type === 'checkbox' ? el.checked : el.value);
    else if (el.matches('[data-dm-field]') && state.modelForm) { var fieldValue = state.modelForm.fields[Number(el.dataset.index)]; if (fieldValue) fieldValue[el.dataset.dmField] = el.type === 'checkbox' ? el.checked : el.type === 'number' ? Number(el.value) : el.value; }
    else if (el.matches('[data-dm-pending-check]')) { if (el.checked) state.pendingSelected.add(el.dataset.dmPendingCheck); else state.pendingSelected.delete(el.dataset.dmPendingCheck); }
    else if (el.matches('[data-dm-pending-all]')) { state.pendingSelected = new Set(el.checked ? state.materialForm.modelIds : []); render(); }
    else if (el.matches('[data-dm-picker-check]') && state.modal) { if (el.checked) state.modal.selected.add(el.dataset.dmPickerCheck); else state.modal.selected.delete(el.dataset.dmPickerCheck); }
  }
  function onKeydown(event) {
    if (event.key !== 'Enter') return;
    if (event.target.matches('[data-dm-model-keyword]')) { event.preventDefault(); state.modelKeyword = state.modelKeywordDraft.trim(); state.modelPage = 1; render(); }
    else if (event.target.matches('[data-dm-material-detail-keyword]')) { event.preventDefault(); state.materialDetailKeyword = state.materialDetailKeywordDraft.trim(); render(); }
    else if (event.target.matches('[data-dm-reverse-keyword]')) { event.preventDefault(); state.reverseKeyword = state.reverseKeywordDraft.trim(); render(); }
    else if (event.target.matches('[data-dm-checklist-keyword]') && state.modal && state.modal.kind === 'checklist') { event.preventDefault(); state.modal.keyword = String(state.modal.keywordDraft || '').trim(); renderOverlayOnly(); }
    else if (event.target.matches('[data-dm-rule-keyword]')) { event.preventDefault(); state.ruleKeyword = state.ruleKeywordDraft.trim(); render(); }
  }
  function onDblClick(event) {
    var variable = event.target.closest('[data-dm-rule-variable]');
    if (!variable) return;
    event.preventDefault();
    if (!state.ruleEdit) return toast('请先新增或编辑一条建模规范。', 'warning');
    var input = root.querySelector('[data-dm-rule-template]');
    if (!input) return;
    var start = typeof input.selectionStart === 'number' ? input.selectionStart : state.ruleEdit.template.length;
    var end = typeof input.selectionEnd === 'number' ? input.selectionEnd : start;
    var token = variable.dataset.value;
    state.ruleEdit.template = state.ruleEdit.template.slice(0, start) + token + state.ruleEdit.template.slice(end);
    input.value = state.ruleEdit.template;
    input.focus();
    input.setSelectionRange(start + token.length, start + token.length);
  }
  function init(view, opts) {
    root = DP.contentArea.querySelector('.page-data-modeling');
    if (!root) return;
    store = store || loadStore();
    state = {
      view: view || 'plan', planForm: null, modal: null, ruleEdit: null, ruleKeywordDraft: '', ruleKeyword: '',
      treeKeyword: '', modelLayer: '', modelCreateOpen: false, modelPage: 1, modelKeywordDraft: '', modelKeyword: '', modelFilters: { version: '', method: '', material: '', attribute: '', dbType: '', tableType: '' }, modelForm: null, modelPlanOpen: false, modelPlanKeyword: '', standardPickerIndex: -1, standardKeyword: '', standardPickerPosition: null, sqlTheme: 'dark', sqlFont: '14px', sqlSearchOpen: false, datasetPreview: false, datasetKeyword: '', datasetTab: 'preview',
      materialFilters: { source: '', project: '', environment: '', mode: '', status: '' }, materialForm: null, materialSourceOpen: false, materialSourceKeyword: '', pendingSelected: new Set(), materialDetailId: '', materialDetailStatus: '', materialDetailKeywordDraft: '', materialDetailKeyword: '', materialLogModelId: '', materialLogTab: 'execution',
      reverseFilters: { executeType: '', status: '' }, reverseKeywordDraft: '', reverseKeyword: '', reverseDetailId: '', reverseDetailFilters: { result: '', from: '', to: '' }, reverseSourceOpen: false, reverseSourceKeyword: '', reversePlanOpen: false, reversePlanKeyword: '', reverseDomainOpen: false, reverseDomainKeyword: ''
    };
    root.addEventListener('click', onClick); root.addEventListener('dblclick', onDblClick); root.addEventListener('input', onInput); root.addEventListener('change', onChange); root.addEventListener('keydown', onKeydown);
    if (state.view === 'material' && opts && opts.mode === 'create') openMaterialForm(opts.modelIds || store.pendingMaterialIds || []); else render();
  }
  return { html: '<div class="page-data-modeling"></div>', init: init };
}());
