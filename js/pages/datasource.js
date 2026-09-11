/**
 * 数据资产 / 数据源。
 * 按参考系统实现目录联动、上下文工具栏、对象查询、接入配置、注册管理和表级查看。
 * 所有状态均为本地原型数据，不连接真实数据库。
 */
window.DP = window.DP || {};
DP.pages = DP.pages || {};

DP.pages.datasource = (function () {
  'use strict';

  var root;
  var store;
  var state;
  var storageKey = 'dp.datasource.v2';
  var businessLayerStorageKey = 'dp.business-layer.v1';

  var fallbackLayers = [
    { id: 'BL001', parentId: '', type: 'data-source', name: '核心业务系统', code: 'CORE_SYSTEM' },
    { id: 'BL002', parentId: 'BL001', type: 'data-source', name: '订单交易系统', code: 'ORDER_SYSTEM' },
    { id: 'BL003', parentId: 'BL001', type: 'data-source', name: '会员运营系统', code: 'MEMBER_SYSTEM' },
    { id: 'BL004', parentId: '', type: 'data-source', name: '企业数据仓库', code: 'DATA_WAREHOUSE' },
    { id: 'BL005', parentId: 'BL004', type: 'data-source', name: 'ODS-贴源层', code: 'ODS' },
    { id: 'BL006', parentId: 'BL004', type: 'data-source', name: 'DWD-数据明细层', code: 'DWD' },
    { id: 'BL007', parentId: 'BL004', type: 'data-source', name: 'DWS-数据汇总层', code: 'DWS' },
    { id: 'BL008', parentId: 'BL004', type: 'data-source', name: 'ADS-应用层', code: 'ADS' },
    { id: 'BL009', parentId: '', type: 'data-source', name: '财务结算系统', code: 'FINANCE_SYSTEM' },
    { id: 'BL010', parentId: '', type: 'data-source', name: '供应链协同系统', code: 'SCM_SYSTEM' },
    { id: 'BL011', parentId: '', type: 'data-source', name: '客户服务系统', code: 'SERVICE_SYSTEM' },
    { id: 'BL012', parentId: '', type: 'data-source', name: '实时数据平台', code: 'REALTIME_PLATFORM' }
  ];

  var warehouseTree = [
    { id: 'WH01', parentId: '', name: '业务库层', path: '业务库层' },
    { id: 'WH011', parentId: 'WH01', name: '订单交易系统', path: '业务库层/订单交易系统' },
    { id: 'WH012', parentId: 'WH01', name: '会员运营系统', path: '业务库层/会员运营系统' },
    { id: 'WH013', parentId: 'WH01', name: '供应链协同系统', path: '业务库层/供应链协同系统' },
    { id: 'WH014', parentId: 'WH01', name: '财务结算系统', path: '业务库层/财务结算系统' },
    { id: 'WH02', parentId: '', name: '贴源层', path: '贴源层' },
    { id: 'WH021', parentId: 'WH02', name: '交易域', path: '贴源层/交易域' },
    { id: 'WH022', parentId: 'WH02', name: '客户域', path: '贴源层/客户域' },
    { id: 'WH023', parentId: 'WH02', name: '供应链域', path: '贴源层/供应链域' },
    { id: 'WH03', parentId: '', name: '公共层', path: '公共层' },
    { id: 'WH031', parentId: 'WH03', name: '交易域', path: '公共层/交易域' },
    { id: 'WH032', parentId: 'WH03', name: '客户域', path: '公共层/客户域' },
    { id: 'WH033', parentId: 'WH03', name: '公共维度', path: '公共层/公共维度' },
    { id: 'WH04', parentId: '', name: '应用层', path: '应用层' },
    { id: 'WH041', parentId: 'WH04', name: '经营分析', path: '应用层/经营分析' },
    { id: 'WH042', parentId: 'WH04', name: '客户运营', path: '应用层/客户运营' },
    { id: 'WH043', parentId: 'WH04', name: '供应链分析', path: '应用层/供应链分析' }
  ];

  var databaseTypeGroups = [
    { name: '关系型数据库', items: ['TDSQL', 'PolarDB', 'TiDB', 'Doris', 'Gaussdb', 'KingBase', 'Mariadb', 'Oscar', 'DB2', 'postgis', 'OceanBase', 'DM8', 'MySQL8', 'MySQL', 'Oracle', 'SqlServer', 'PostgreSQL', 'Informix', 'HANA', 'StarRocks'] },
    { name: 'MPP', items: ['TDengine', 'Iceberg', 'Clickhouse', 'KADB', 'Impala', 'Presto', 'Greenplum'] },
    { name: 'Hadoop', items: ['Hive', 'HBase'] },
    { name: 'NoSQL', items: ['NebulaGraph', 'MongoDB', 'Elasticsearch'] },
    { name: '其他', items: ['Http'] },
    { name: '文件系统', items: ['H3C', 'HDFS', 'FTP'] },
    { name: '消息系统', items: ['activeMq', 'MQTT', 'Rabbitmq', 'IBMMQ', 'Kafka'] },
    { name: '时序数据库', items: ['Clickhouse', 'TDengine'] }
  ];

  var databaseTypesByMode = {
    'new': ['Hive', 'HBase', 'MongoDB', 'Elasticsearch', 'HDFS', 'Kafka'],
    link: null,
    instance: ['TDSQL', 'PolarDB', 'TiDB', 'Doris', 'Gaussdb', 'KingBase', 'Mariadb', 'Oscar', 'DB2', 'postgis', 'OceanBase', 'DM8', 'MySQL8', 'MySQL', 'Oracle', 'SqlServer', 'PostgreSQL', 'Informix', 'HANA', 'StarRocks', 'TDengine', 'Iceberg', 'Clickhouse', 'KADB', 'Impala', 'Presto', 'Greenplum', 'Hive', 'HBase']
  };

  var objectTypes = ['表', '视图', '物化视图', '同义词', '索引', '主题', '集合', '队列', '子表', '超级表', '节点', '边', '时间序列'];
  var tableTypes = ['业务表', '贴源表', '维度表', '明细表', '汇总表', '应用表', '输出表', '其他表'];
  var tableSubtypeMap = {
    '维度表': ['普通维度表', '枚举维度表', '层级维度表'],
    '明细表': ['事务事实表', '累加表'],
    '汇总表': ['普通汇总表', '轻度汇总表'],
    '应用表': ['普通应用表', '轻度应用表', '主数据表']
  };
  var dataDomainTree = [
    { id: 'DOMAIN_ROOT', parentId: '', name: '数据域目录', selectable: false },
    { id: 'DOMAIN_01', parentId: 'DOMAIN_ROOT', name: '中电数治', selectable: true },
    { id: 'DOMAIN_02', parentId: 'DOMAIN_ROOT', name: '工单信息', selectable: true },
    { id: 'DOMAIN_03', parentId: 'DOMAIN_ROOT', name: '物流信息', selectable: true }
  ];

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (char) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char];
    });
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function databaseGroupsForMode(mode) {
    var allowed = databaseTypesByMode[mode];
    if (!allowed) return databaseTypeGroups;
    return databaseTypeGroups.map(function (group) {
      return { name: group.name, items: group.items.filter(function (item) { return allowed.indexOf(item) >= 0; }) };
    }).filter(function (group) { return group.items.length; });
  }

  function databaseGroupName(type) {
    var group = databaseTypeGroups.filter(function (item) { return item.items.indexOf(type) >= 0; })[0];
    return group ? group.name : '';
  }

  function needsPlatformFields(type) {
    return !!type && databaseGroupName(type) !== '关系型数据库';
  }

  function schemaOptions(type) {
    if (type === 'Hive' || type === 'HBase') return { root: '大数据集群', items: ['ods', 'dwd', 'dws', 'ads'] };
    if (type === 'Iceberg') return { root: 'Iceberg Catalog', items: ['default', 'ods', 'dwd', 'analytics'] };
    if (type === 'StarRocks' || type === 'Doris' || type === 'Clickhouse') return { root: '数据目录', items: ['default_catalog', 'information_schema', 'analytics'] };
    return { root: '数据库实例', items: ['public', 'business', 'report', 'archive'] };
  }

  function sourceSchemas(source) {
    if (Array.isArray(source.schemas) && source.schemas.length) return source.schemas;
    if (source.schema) return String(source.schema).split(',').map(function (item) { return item.trim(); }).filter(Boolean);
    return source.database ? [source.database] : [];
  }

  function datasourceIcon(type) {
    var value = String(type || '').toLowerCase();
    if (value === 'hdfs') return { icon: 'cloud-fill', tone: 'hdfs' };
    if (value === 'ftp' || value === 'h3c') return { icon: 'hdd-network-fill', tone: 'file' };
    if (value === 'oracle') return { icon: 'disc-fill', tone: 'oracle' };
    if (value === 'hive') return { icon: 'plugin', tone: 'hive' };
    if (value === 'hbase') return { icon: 'grid-3x3-gap-fill', tone: 'hbase' };
    if (value === 'postgresql' || value === 'postgis') return { icon: 'database-check', tone: 'postgresql' };
    if (value === 'sqlserver' || value === 'db2' || value === 'dm8' || value === 'gaussdb' || value === 'kingbase' || value === 'oscar' || value === 'informix' || value === 'hana') return { icon: 'server', tone: 'server' };
    if (value === 'starrocks' || value === 'doris' || value === 'clickhouse' || value === 'tdengine' || value === 'iceberg' || value === 'kadb' || value === 'impala' || value === 'presto' || value === 'greenplum') return { icon: 'hdd-stack-fill', tone: 'analytical' };
    if (value === 'mongodb' || value === 'elasticsearch' || value === 'nebulagraph') return { icon: 'collection-fill', tone: 'nosql' };
    if (value === 'kafka' || value === 'mqtt' || value === 'activemq' || value === 'rabbitmq' || value === 'ibmmq') return { icon: 'broadcast-pin', tone: 'message' };
    if (value === 'http') return { icon: 'globe2', tone: 'http' };
    return { icon: 'database-fill', tone: 'mysql' };
  }

  function datasourceIconHtml(type, extraClass) {
    var meta = datasourceIcon(type);
    return '<i class="bi bi-' + meta.icon + ' ds-tree-source-icon ds-tree-source-icon-' + meta.tone + (extraClass ? ' ' + extraClass : '') + '" aria-hidden="true"></i>';
  }

  function button(action, icon, label, attrs, className) {
    return '<button type="button" class="' + (className || 'btn btn-outline') + '" data-ds-action="' + action + '" ' + (attrs || '') + '>' +
      '<i class="bi bi-' + icon + '" aria-hidden="true"></i><span>' + label + '</span></button>';
  }

  function loadBusinessLayers() {
    try {
      var saved = JSON.parse(window.localStorage.getItem(businessLayerStorageKey) || 'null');
      if (saved && Array.isArray(saved.layers)) {
        var layers = saved.layers.filter(function (item) { return item.type === 'data-source'; });
        if (layers.length) return layers.map(function (item) {
          return { id: item.id, parentId: item.parentId || '', type: item.type, name: item.name, code: item.code };
        });
      }
    } catch (error) { /* 使用内置示例数据。 */ }
    return clone(fallbackLayers);
  }

  function layerName(id) {
    var item = state.layers.filter(function (layer) { return layer.id === id; })[0];
    return item ? item.name : '未设置';
  }

  function layerPath(id) {
    var names = [];
    var current = state.layers.filter(function (layer) { return layer.id === id; })[0];
    while (current) {
      names.unshift(current.name);
      current = current.parentId ? state.layers.filter(function (layer) { return layer.id === current.parentId; })[0] : null;
    }
    return names.join('/');
  }

  function warehouseName(id) {
    var item = warehouseTree.filter(function (node) { return node.id === id; })[0];
    return item ? item.path : '-';
  }

  function seedSources() {
    return [
      { id: 'SRC001', businessLayerId: 'BL002', name: 'trade_mysql', alias: '订单交易库', dbType: 'MySQL', mode: 'link', database: 'trade_center', url: 'jdbc:mysql://10.20.8.16:3306/trade_center', account: 'metadata_reader', autoSync: true, lastSync: '2026-09-08 09:20:36' },
      { id: 'SRC002', businessLayerId: 'BL003', name: 'member_postgresql', alias: '会员运营库', dbType: 'PostgreSQL', mode: 'link', database: 'member_center', url: 'jdbc:postgresql://10.20.8.22:5432/member_center', account: 'metadata_reader', autoSync: true, lastSync: '2026-09-08 09:16:08' },
      { id: 'SRC003', businessLayerId: 'BL005', name: 'ods_hive', alias: 'ODS贴源库', dbType: 'Hive', mode: 'instance', database: 'ods', url: 'jdbc:hive2://10.20.12.10:10000/ods', account: 'hive_reader', schema: 'ods', autoSync: true, lastSync: '2026-09-08 08:55:20' },
      { id: 'SRC004', businessLayerId: 'BL006', name: 'dwd_starrocks', alias: 'DWD明细库', dbType: 'StarRocks', mode: 'link', database: 'dwd', url: 'jdbc:mysql://10.20.14.18:9030/dwd', account: 'metadata_reader', autoSync: true, lastSync: '2026-09-08 08:42:51' },
      { id: 'SRC005', businessLayerId: 'BL007', name: 'dws_starrocks', alias: 'DWS汇总库', dbType: 'StarRocks', mode: 'link', database: 'dws', url: 'jdbc:mysql://10.20.14.18:9030/dws', account: 'metadata_reader', autoSync: false, lastSync: '2026-09-07 23:01:42' },
      { id: 'SRC006', businessLayerId: 'BL008', name: 'ads_clickhouse', alias: 'ADS应用库', dbType: 'Clickhouse', mode: 'instance', database: 'ads', url: 'jdbc:clickhouse://10.20.15.31:8123/ads', account: 'metadata_reader', schema: 'ads', autoSync: true, lastSync: '2026-09-08 08:31:15' },
      { id: 'SRC007', businessLayerId: 'BL009', name: 'finance_oracle', alias: '财务结算库', dbType: 'Oracle', mode: 'link', database: 'FINANCE', url: 'jdbc:oracle:thin:@10.20.9.21:1521:FIN', account: 'metadata_reader', autoSync: false, lastSync: '2026-09-07 21:38:09' },
      { id: 'SRC008', businessLayerId: 'BL010', name: 'scm_mysql8', alias: '供应链业务库', dbType: 'MySQL8', mode: 'link', database: 'scm_center', url: 'jdbc:mysql://10.20.10.25:3306/scm_center', account: 'metadata_reader', autoSync: true, lastSync: '2026-09-08 09:02:44' },
      { id: 'SRC009', businessLayerId: 'BL011', name: 'service_sqlserver', alias: '客户服务库', dbType: 'SqlServer', mode: 'link', database: 'service_center', url: 'jdbc:sqlserver://10.20.11.12:1433;databaseName=service_center', account: 'metadata_reader', autoSync: false, lastSync: '2026-09-07 22:18:30' },
      { id: 'SRC010', businessLayerId: 'BL012', name: 'realtime_kafka', alias: '实时消息集群', dbType: 'Kafka', mode: 'instance', database: 'realtime_topic', url: '10.20.18.11:9092,10.20.18.12:9092', account: 'metadata_reader', schema: 'realtime_topic', autoSync: true, lastSync: '2026-09-08 09:28:13' }
    ];
  }

  function objectFields(name) {
    var prefix = name.indexOf('order') >= 0 ? 'order' : name.indexOf('member') >= 0 ? 'member' : name.indexOf('product') >= 0 ? 'product' : 'record';
    return [
      { name: prefix + '_id', alias: prefix === 'order' ? '订单标识' : prefix === 'member' ? '会员标识' : prefix === 'product' ? '商品标识' : '记录标识', type: 'varchar(64)', description: '业务主键' },
      { name: 'org_code', alias: '组织编码', type: 'varchar(32)', description: '数据归属组织' },
      { name: 'status', alias: '业务状态', type: 'varchar(20)', description: '当前业务状态' },
      { name: 'biz_date', alias: '业务日期', type: 'date', description: '数据业务日期' },
      { name: 'update_time', alias: '更新时间', type: 'datetime', description: '记录最后更新时间' }
    ];
  }

  function seedObjects() {
    var rows = [
      ['T001', 'SRC001', 'order_main', '订单主表', '表', 'WH011', '业务表', '核心订单数据', 1438920],
      ['T002', 'SRC001', 'order_detail', '订单明细表', '表', 'WH011', '业务表', '订单商品明细', 3892105],
      ['T003', 'SRC001', 'payment_record', '支付流水表', '表', 'WH011', '业务表', '支付交易流水记录', 2156830],
      ['T004', 'SRC001', 'refund_apply', '退款申请表', '表', 'WH011', '业务表', '售后退款申请记录', 286540],
      ['T005', 'SRC001', 'v_order_daily', '订单日报视图', '视图', 'WH011', '输出表', '订单日汇总查询视图', 365],
      ['T006', 'SRC002', 'member_info', '会员信息表', '表', 'WH012', '业务表', '会员基础档案', 628915],
      ['T007', 'SRC002', 'member_level', '会员等级表', '表', 'WH012', '业务表', '会员等级与权益定义', 12],
      ['T008', 'SRC002', 'member_tag_relation', '会员标签关系表', '表', 'WH012', '业务表', '会员标签关联关系', 2867340],
      ['T009', 'SRC003', 'ods_trade_order_di', '订单贴源表', '表', 'WH021', '贴源表', '订单每日增量贴源数据', 42863920],
      ['T010', 'SRC003', 'ods_trade_payment_di', '支付贴源表', '表', 'WH021', '贴源表', '支付流水每日增量', 21568400],
      ['T011', 'SRC003', 'ods_member_info_df', '会员全量贴源表', '表', 'WH022', '贴源表', '会员信息每日全量快照', 628915],
      ['T012', 'SRC003', 'ods_scm_inventory_di', '库存贴源表', '表', 'WH023', '贴源表', '库存变更增量数据', 9450200],
      ['T013', 'SRC004', 'dwd_trade_order_detail_di', '交易订单明细', '表', 'WH031', '明细表', '清洗标准化后的订单明细', 39864210],
      ['T014', 'SRC004', 'dwd_trade_payment_detail_di', '支付交易明细', '表', 'WH031', '明细表', '支付成功与退款明细', 21682950],
      ['T015', 'SRC004', 'dwd_member_behavior_di', '会员行为明细', '表', 'WH032', '明细表', '会员访问及互动行为', 89320600],
      ['T016', 'SRC004', 'dim_region', '区域维度表', '表', 'WH033', '维度表', '省市区行政区划维度', 3624],
      ['T017', 'SRC004', 'dim_product', '商品维度表', '表', 'WH033', '维度表', '标准商品维度', 86742],
      ['T018', 'SRC005', 'dws_trade_day_summary', '交易日汇总表', '表', 'WH031', '汇总表', '按日期和组织汇总交易指标', 328650],
      ['T019', 'SRC005', 'dws_member_profile', '会员画像宽表', '表', 'WH032', '汇总表', '会员标签与价值指标汇总', 628915],
      ['T020', 'SRC005', 'mv_trade_month_summary', '交易月汇总物化视图', '物化视图', 'WH031', '汇总表', '月度交易汇总结果', 13620],
      ['T021', 'SRC006', 'ads_trade_operation_dashboard', '交易经营看板', '表', 'WH041', '应用表', '经营驾驶舱交易主题数据', 4580],
      ['T022', 'SRC006', 'ads_member_operation', '会员运营分析表', '表', 'WH042', '应用表', '会员增长及活跃度分析', 18630],
      ['T023', 'SRC006', 'ads_supply_chain_analysis', '供应链分析表', '表', 'WH043', '应用表', '库存周转与履约分析', 12780],
      ['T024', 'SRC007', 'finance_receivable', '应收账款表', '表', 'WH014', '业务表', '客户应收账款明细', 356890],
      ['T025', 'SRC007', 'finance_invoice', '发票信息表', '表', 'WH014', '业务表', '销项与进项发票信息', 762150],
      ['T026', 'SRC008', 'scm_purchase_order', '采购订单表', '表', 'WH013', '业务表', '采购订单及履约状态', 486270],
      ['T027', 'SRC008', 'scm_inventory_snapshot', '库存快照表', '表', 'WH013', '业务表', '仓库商品每日库存快照', 9450200],
      ['T028', 'SRC008', 'scm_supplier', '供应商主数据', '表', 'WH013', '业务表', '供应商基础与资质信息', 12680],
      ['T029', 'SRC009', 'service_ticket', '客户工单表', '表', 'WH01', '业务表', '客户咨询投诉工单', 592840],
      ['T030', 'SRC009', 'service_satisfaction', '服务满意度表', '表', 'WH01', '业务表', '客户服务评价记录', 428690],
      ['T031', 'SRC010', 'topic_order_status', '订单状态主题', '主题', '', '其他表', '订单状态实时变更主题', 0],
      ['T032', 'SRC010', 'topic_inventory_change', '库存变化主题', '主题', '', '其他表', '库存数量实时变化主题', 0],
      ['T033', 'SRC010', 'topic_member_event', '会员事件主题', '主题', '', '其他表', '会员访问与运营事件主题', 0]
    ];
    return rows.map(function (row, index) {
      var source = seedSources().filter(function (item) { return item.id === row[1]; })[0];
      return {
        id: row[0], sourceId: row[1], name: row[2], alias: row[3], objectType: row[4],
        warehouseId: row[5], tableType: row[6], description: row[7], records: row[8],
        database: source ? source.database + '(' + source.alias + ')' : '-', registered: index % 7 !== 0,
        fields: objectFields(row[2])
      };
    });
  }

  function defaultStore() {
    return { version: 2, sources: seedSources(), objects: seedObjects() };
  }

  function loadStore() {
    try {
      var saved = JSON.parse(window.localStorage.getItem(storageKey) || 'null');
      if (saved && saved.version === 2 && Array.isArray(saved.sources) && Array.isArray(saved.objects)) return saved;
    } catch (error) { /* 使用内置示例数据。 */ }
    return defaultStore();
  }

  function persist() {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(store));
      return true;
    } catch (error) {
      return false;
    }
  }

  function initialState() {
    var layers = loadBusinessLayers();
    var firstLayer = layers[0] ? layers[0].id : '';
    return {
      layers: layers,
      tab: 'datasource',
      selection: { kind: 'layer', id: firstLayer },
      openLayers: new Set(layers.filter(function (item) { return !item.parentId; }).map(function (item) { return item.id; })),
      openWarehouses: new Set(['WH01', 'WH02', 'WH03', 'WH04']),
      treeKeyword: '',
      dbTypeFilter: '',
      dbTypeMenu: false,
      dbTypeKeyword: '',
      filters: { keywordDraft: '', keyword: '', tableType: '', warehouseId: '', objectType: '' },
      warehousePicker: false,
      warehousePickerKeyword: '',
      objectTypePicker: false,
      objectTypeKeyword: '',
      page: 1,
      pageSize: 20,
      sortKey: 'name',
      sortDir: 'asc',
      selectedRows: new Set(),
      view: 'list',
      currentRowId: '',
      modal: null,
      formDraft: null,
      formPicker: '',
      formPickerKeyword: '',
      formPickerExpanded: new Set(),
      openSourceTreeNodes: new Set(),
      selectedTreeNode: '',
      connectionTested: false,
      inlineEdit: null,
      structureEdit: null,
      register: { keywordDraft: '', keyword: '', status: '', selected: new Set(), page: 1 },
      preview: { alias: false, conditions: [{ field: '', operator: 'eq', value: '' }], page: 1, pageSize: 20 },
      hdfsTab: 'list',
      hdfsTransfer: { attribute: '', status: '' }
    };
  }

  function childLayers(parentId) {
    return state.layers.filter(function (item) { return (item.parentId || '') === parentId; });
  }

  function layerDescendants(id) {
    return childLayers(id).reduce(function (result, child) {
      return result.concat(child.id, layerDescendants(child.id));
    }, []);
  }

  function sourceById(id) {
    return store.sources.filter(function (item) { return item.id === id; })[0] || null;
  }

  function rowById(id) {
    return store.objects.filter(function (item) { return item.id === id; })[0] || null;
  }

  function warehouseById(id) {
    return warehouseTree.filter(function (item) { return item.id === id; })[0] || null;
  }

  function sourceMatchesTree(source, keyword) {
    var text = (source.name + ' ' + source.alias + ' ' + source.dbType + ' ' + source.database + ' ' + sourceSchemas(source).join(' ')).toLowerCase();
    if (keyword && text.indexOf(keyword) < 0) return false;
    return !state.dbTypeFilter || source.dbType.toLowerCase() === state.dbTypeFilter.toLowerCase();
  }

  function layerMatchesTree(layer, keyword) {
    var own = (layer.name + ' ' + layer.code).toLowerCase().indexOf(keyword) >= 0;
    var ownSources = store.sources.some(function (source) {
      return source.businessLayerId === layer.id && sourceMatchesTree(source, keyword);
    });
    return own || ownSources || childLayers(layer.id).some(function (child) { return layerMatchesTree(child, keyword); });
  }

  function renderDatasourceTree() {
    var keyword = state.treeKeyword.trim().toLowerCase();
    function renderSourceNode(source) {
      var sourceKey = 'source:' + source.id;
      var schemas = sourceSchemas(source);
      var isInstance = source.mode === 'instance';
      var sourceOpen = !!keyword || state.openSourceTreeNodes.has(sourceKey);
      var sourceSelected = state.selection.kind === 'source' && state.selection.id === source.id && (!state.selectedTreeNode || state.selectedTreeNode === sourceKey);
      var ownMatches = !keyword || (source.name + ' ' + source.alias + ' ' + source.dbType + ' ' + source.database).toLowerCase().indexOf(keyword) >= 0;
      var visibleSchemas = ownMatches ? schemas : schemas.filter(function (schema) { return schema.toLowerCase().indexOf(keyword) >= 0; });
      var sourceRow = '<div class="ds-tree-line">' +
        (isInstance ? button('toggle-source-tree', sourceOpen ? 'chevron-down' : 'chevron-right', '展开或收起', 'data-key="' + esc(sourceKey) + '" aria-expanded="' + sourceOpen + '"', 'ds-tree-toggle') : '<span class="ds-tree-toggle-placeholder"></span>') +
        '<button type="button" class="ds-tree-row ds-tree-source' + (isInstance ? ' ds-tree-instance' : '') + (sourceSelected ? ' active' : '') + '" data-ds-action="select-source" data-id="' + esc(source.id) + '" data-tree-key="' + esc(sourceKey) + '" title="' + esc(source.alias + ' · ' + source.dbType) + '">' +
        (isInstance ? '<i class="bi bi-box-seam-fill ds-tree-instance-icon" aria-hidden="true"></i>' : datasourceIconHtml(source.dbType)) + '<span>' + esc(source.alias) + '</span></button></div>';
      if (!isInstance || !sourceOpen) return '<li class="ds-tree-node">' + sourceRow + '</li>';

      var catalogKey = 'catalog:' + source.id;
      var catalogOpen = !!keyword || state.openSourceTreeNodes.has(catalogKey);
      var catalogSelected = state.selection.kind === 'source' && state.selection.id === source.id && state.selectedTreeNode === catalogKey;
      var schemaRows = visibleSchemas.map(function (schema) {
        var schemaKey = 'schema:' + source.id + ':' + schema;
        return '<li class="ds-tree-node"><div class="ds-tree-line"><span class="ds-tree-toggle-placeholder"></span><button type="button" class="ds-tree-row ds-tree-source ds-tree-schema' + (state.selection.kind === 'source' && state.selection.id === source.id && state.selectedTreeNode === schemaKey ? ' active' : '') + '" data-ds-action="select-source" data-id="' + esc(source.id) + '" data-tree-key="' + esc(schemaKey) + '" title="' + esc(source.alias + ' / ' + schema) + '">' + datasourceIconHtml(source.dbType) + '<span>' + esc(schema) + '</span></button></div></li>';
      }).join('');
      var catalogRow = '<li class="ds-tree-node"><div class="ds-tree-line">' +
        (visibleSchemas.length ? button('toggle-source-tree', catalogOpen ? 'chevron-down' : 'chevron-right', '展开或收起', 'data-key="' + esc(catalogKey) + '" aria-expanded="' + catalogOpen + '"', 'ds-tree-toggle') : '<span class="ds-tree-toggle-placeholder"></span>') +
        '<button type="button" class="ds-tree-row ds-tree-catalog' + (catalogSelected ? ' active' : '') + '" data-ds-action="select-source" data-id="' + esc(source.id) + '" data-tree-key="' + esc(catalogKey) + '" title="' + esc(source.alias) + '"><i class="bi bi-diagram-3-fill ds-tree-catalog-icon" aria-hidden="true"></i><span>' + esc(source.alias) + '</span></button></div>' +
        (visibleSchemas.length && catalogOpen ? '<ul class="ds-tree-children">' + schemaRows + '</ul>' : '') + '</li>';
      return '<li class="ds-tree-node ds-tree-instance-node">' + sourceRow + '<ul class="ds-tree-children">' + catalogRow + '</ul></li>';
    }

    function walk(parentId) {
      return childLayers(parentId).filter(function (layer) {
        return layerMatchesTree(layer, keyword);
      }).map(function (layer) {
        var children = childLayers(layer.id);
        var sources = store.sources.filter(function (source) {
          return source.businessLayerId === layer.id && sourceMatchesTree(source, keyword);
        });
        var layerIds = [layer.id].concat(layerDescendants(layer.id));
        var sourceCount = store.sources.filter(function (source) {
          return layerIds.indexOf(source.businessLayerId) >= 0 && sourceMatchesTree(source, keyword);
        }).length;
        var hasChildren = children.length || sources.length;
        var open = keyword || state.openLayers.has(layer.id);
        var selected = state.selection.kind === 'layer' && state.selection.id === layer.id;
        var nested = hasChildren && open ? '<ul class="ds-tree-children">' +
          walk(layer.id) +
          sources.map(renderSourceNode).join('') + '</ul>' : '';
        return '<li class="ds-tree-node">' +
          '<div class="ds-tree-line">' +
          (hasChildren ? button('toggle-layer', open ? 'chevron-down' : 'chevron-right', '展开或收起', 'data-id="' + esc(layer.id) + '" aria-expanded="' + open + '"', 'ds-tree-toggle') : '<span class="ds-tree-toggle-placeholder"></span>') +
          '<button type="button" class="ds-tree-row' + (selected ? ' active' : '') + '" data-ds-action="select-layer" data-id="' + esc(layer.id) + '">' +
          '<i class="bi bi-folder2' + (open ? '-open' : '') + '" aria-hidden="true"></i><span title="' + esc(layer.name) + '">' + esc(layer.name) + '</span>' + (sourceCount ? '<strong>' + sourceCount + '</strong>' : '') + '</button>' +
          '</div>' + nested + '</li>';
      }).join('');
    }
    var html = walk('');
    return html || '<div class="ds-empty ds-tree-empty"><i class="bi bi-search"></i><span>没有匹配的数据源</span></div>';
  }

  function warehouseMatches(node, keyword) {
    var own = (node.name + ' ' + node.path).toLowerCase().indexOf(keyword) >= 0;
    return own || warehouseTree.some(function (child) {
      return child.parentId === node.id && warehouseMatches(child, keyword);
    });
  }

  function renderWarehouseTree() {
    var keyword = state.treeKeyword.trim().toLowerCase();
    function walk(parentId) {
      return warehouseTree.filter(function (node) {
        return node.parentId === parentId && warehouseMatches(node, keyword);
      }).map(function (node) {
        var children = warehouseTree.filter(function (child) { return child.parentId === node.id; });
        var open = keyword || state.openWarehouses.has(node.id);
        var selected = state.selection.kind === 'warehouse' && state.selection.id === node.id;
        return '<li class="ds-tree-node"><div class="ds-tree-line">' +
          (children.length ? button('toggle-warehouse', open ? 'chevron-down' : 'chevron-right', '展开或收起', 'data-id="' + esc(node.id) + '" aria-expanded="' + open + '"', 'ds-tree-toggle') : '<span class="ds-tree-toggle-placeholder"></span>') +
          '<button type="button" class="ds-tree-row' + (selected ? ' active' : '') + '" data-ds-action="select-warehouse" data-id="' + esc(node.id) + '">' +
          '<i class="bi bi-folder2' + (open ? '-open' : '') + '" aria-hidden="true"></i><span>' + esc(node.name) + '</span></button></div>' +
          (children.length && open ? '<ul class="ds-tree-children">' + walk(node.id) + '</ul>' : '') + '</li>';
      }).join('');
    }
    var html = walk('');
    return html || '<div class="ds-empty ds-tree-empty"><i class="bi bi-search"></i><span>没有匹配的数仓分层</span></div>';
  }

  function renderDbTypeMenu() {
    if (!state.dbTypeMenu) return '';
    var keyword = state.dbTypeKeyword.trim().toLowerCase();
    var groups = databaseTypeGroups.map(function (group) {
      var items = group.items.filter(function (item) { return !keyword || item.toLowerCase().indexOf(keyword) >= 0 || group.name.toLowerCase().indexOf(keyword) >= 0; });
      if (!items.length) return '';
      return '<section><h4>' + esc(group.name) + '</h4><div>' + items.map(function (item) {
        return '<button type="button" class="' + (state.dbTypeFilter === item ? 'active' : '') + '" data-ds-action="choose-db-type" data-value="' + esc(item) + '"><i class="bi bi-database"></i><span>' + esc(item) + '</span></button>';
      }).join('') + '</div></section>';
    }).join('');
    return '<div class="ds-type-menu"><div class="ds-popover-search"><i class="bi bi-search"></i><input type="search" data-ds-input="db-type-keyword" value="' + esc(state.dbTypeKeyword) + '" placeholder="搜索数据库类型"></div>' +
      '<button type="button" class="ds-type-all' + (!state.dbTypeFilter ? ' active' : '') + '" data-ds-action="choose-db-type" data-value=""><i class="bi bi-grid"></i><span>全部类型</span></button>' +
      (groups || '<div class="ds-empty"><span>没有匹配的数据库类型</span></div>') + '</div>';
  }

  function renderLeftPanel() {
    return '<aside class="ds-left-panel">' +
      '<div class="ds-tabs" role="tablist">' +
      '<button type="button" class="ds-tab' + (state.tab === 'datasource' ? ' active' : '') + '" data-ds-action="switch-tab" data-tab="datasource">数据源</button>' +
      '<button type="button" class="ds-tab' + (state.tab === 'layer' ? ' active' : '') + '" data-ds-action="switch-tab" data-tab="layer">数仓分层</button>' +
      '</div>' +
      '<div class="ds-tree-tools"><div class="ds-tree-search"><i class="bi bi-search"></i><input type="search" data-ds-input="tree-keyword" value="' + esc(state.treeKeyword) + '" placeholder="' + (state.tab === 'datasource' ? '搜索业务分层或数据源' : '搜索数仓分层') + '"></div>' +
      (state.tab === 'datasource' ? '<div class="ds-tree-filter-wrap">' +
        button('toggle-db-type-menu', 'funnel', '数据库类型', 'aria-expanded="' + state.dbTypeMenu + '"', 'ds-icon-button' + (state.dbTypeFilter ? ' active' : '')) +
        renderDbTypeMenu() + '</div>' : '') + '</div>' +
      (state.tab === 'datasource' && state.dbTypeFilter ? '<div class="ds-tree-filter-status"><span>数据库类型</span><button type="button" class="ds-filter-chip" data-ds-action="clear-db-type"><span>' + esc(state.dbTypeFilter) + '</span><i class="bi bi-x"></i></button></div>' : '') +
      '<div class="ds-tree-scroll"><ul class="ds-tree">' + (state.tab === 'datasource' ? renderDatasourceTree() : renderWarehouseTree()) + '</ul></div>' +
      '</aside>';
  }

  function currentSourceIds() {
    if (state.tab !== 'datasource') return store.sources.map(function (source) { return source.id; });
    if (state.selection.kind === 'source') return [state.selection.id];
    if (state.selection.kind === 'layer') {
      var ids = [state.selection.id].concat(layerDescendants(state.selection.id));
      return store.sources.filter(function (source) { return ids.indexOf(source.businessLayerId) >= 0; }).map(function (source) { return source.id; });
    }
    return store.sources.map(function (source) { return source.id; });
  }

  function applyCurrentTextFilter() {
    state.filters.keyword = state.filters.keywordDraft.trim();
    state.page = 1;
  }

  function filteredRows() {
    var sourceIds = currentSourceIds();
    var warehouseSelection = state.tab === 'layer' && state.selection.kind === 'warehouse' ? warehouseById(state.selection.id) : null;
    var keyword = state.filters.keyword.toLowerCase();
    var rows = store.objects.filter(function (row) {
      var source = sourceById(row.sourceId);
      if (sourceIds.indexOf(row.sourceId) < 0) return false;
      if (state.tab === 'datasource' && state.dbTypeFilter && (!source || source.dbType !== state.dbTypeFilter)) return false;
      if (warehouseSelection && warehouseName(row.warehouseId).indexOf(warehouseSelection.path) !== 0) return false;
      if (state.filters.tableType && row.tableType !== state.filters.tableType) return false;
      if (state.filters.warehouseId) {
        var selectedWarehouse = warehouseById(state.filters.warehouseId);
        if (selectedWarehouse && warehouseName(row.warehouseId).indexOf(selectedWarehouse.path) !== 0) return false;
      }
      if (state.filters.objectType && row.objectType !== state.filters.objectType) return false;
      if (keyword) {
        var searchable = [row.name, row.alias, row.description, row.database, warehouseName(row.warehouseId)].join(' ').toLowerCase();
        if (searchable.indexOf(keyword) < 0) return false;
      }
      return true;
    });
    rows.sort(function (a, b) {
      var av = state.sortKey === 'warehouse' ? warehouseName(a.warehouseId) : String(a[state.sortKey] == null ? '' : a[state.sortKey]);
      var bv = state.sortKey === 'warehouse' ? warehouseName(b.warehouseId) : String(b[state.sortKey] == null ? '' : b[state.sortKey]);
      var result = av.localeCompare(bv, 'zh-CN', { numeric: true });
      return state.sortDir === 'asc' ? result : -result;
    });
    return rows;
  }

  function renderWarehousePicker() {
    if (!state.warehousePicker) return '';
    var keyword = state.warehousePickerKeyword.trim().toLowerCase();
    var items = warehouseTree.filter(function (node) {
      return !keyword || (node.path + ' ' + node.name).toLowerCase().indexOf(keyword) >= 0;
    });
    return '<div class="ds-filter-popover ds-warehouse-popover"><div class="ds-popover-search"><i class="bi bi-search"></i><input type="search" data-ds-input="warehouse-picker-keyword" value="' + esc(state.warehousePickerKeyword) + '" placeholder="搜索数仓分层"></div>' +
      '<button type="button" class="ds-picker-option' + (!state.filters.warehouseId ? ' active' : '') + '" data-ds-action="choose-filter-warehouse" data-value=""><i class="bi bi-grid"></i><span>全部分层</span></button>' +
      (items.length ? items.map(function (node) {
        var depth = node.path.split('/').length - 1;
        return '<button type="button" class="ds-picker-option' + (state.filters.warehouseId === node.id ? ' active' : '') + '" style="padding-left:' + (12 + depth * 18) + 'px" data-ds-action="choose-filter-warehouse" data-value="' + esc(node.id) + '"><i class="bi bi-folder2"></i><span>' + esc(node.name) + '</span><small>' + esc(node.path) + '</small></button>';
      }).join('') : '<div class="ds-empty"><span>没有匹配的数仓分层</span></div>') + '</div>';
  }

  function renderObjectTypePicker() {
    if (!state.objectTypePicker) return '';
    var keyword = state.objectTypeKeyword.trim().toLowerCase();
    var items = objectTypes.filter(function (item) { return !keyword || item.toLowerCase().indexOf(keyword) >= 0; });
    return '<div class="ds-filter-popover ds-object-type-popover"><div class="ds-popover-search"><i class="bi bi-search"></i><input type="search" data-ds-input="object-type-keyword" value="' + esc(state.objectTypeKeyword) + '" placeholder="搜索类型"></div>' +
      '<button type="button" class="ds-picker-option' + (!state.filters.objectType ? ' active' : '') + '" data-ds-action="choose-object-type" data-value=""><i class="bi bi-grid"></i><span>全部</span></button>' +
      (items.length ? items.map(function (item) {
        return '<button type="button" class="ds-picker-option' + (state.filters.objectType === item ? ' active' : '') + '" data-ds-action="choose-object-type" data-value="' + esc(item) + '"><i class="bi bi-box"></i><span>' + esc(item) + '</span></button>';
      }).join('') : '<div class="ds-empty"><span>没有匹配的类型</span></div>') + '</div>';
  }

  function renderContextActions() {
    if (state.tab === 'layer') return '';
    if (state.selection.kind === 'source') {
      var source = sourceById(state.selection.id);
      if (!source) return '';
      if (source.dbType === 'HDFS') {
        return button('open-hdfs-upload', 'cloud-arrow-up', '上传', '', 'btn btn-primary') +
          button('export-source', 'download', '导出') +
          button('open-import', 'upload', '导入') +
          button('edit-source', 'pencil', '编辑') +
          button('delete-source', 'trash', '删除', '', 'btn btn-danger');
      }
      return (source.mode === 'instance' ? '' : button('open-register', 'journal-check', '注册管理', '', 'btn btn-primary')) +
        button('export-source', 'download', '导出') +
        button('open-import', 'upload', '导入') +
        button('edit-source', 'pencil', '编辑') +
        button('sync-source', 'arrow-repeat', '同步') +
        button('toggle-auto-sync', source.autoSync ? 'toggle-on' : 'toggle-off', '自动同步(' + (source.autoSync ? '开' : '关') + ')') +
        (source.mode === 'instance' ? '' : button('plan-source', 'layers', '数仓规划')) +
        button('delete-source', 'trash', '删除', '', 'btn btn-danger');
    }
    return button('add-source', 'plus-lg', '添加数据源', '', 'btn btn-primary') +
      button('batch-export', 'download', '批量导出') +
      button('open-import', 'upload', '批量导入') +
      button('export-table', 'file-earmark-spreadsheet', '导出表格数据');
  }

  function renderFilters() {
    return '<div class="ds-query-row">' +
      '<div class="ds-keyword-query"><input type="search" data-ds-input="keyword" value="' + esc(state.filters.keywordDraft) + '" placeholder="输入检索关键字">' +
      button('query', 'search', '查询', '', 'btn btn-primary') + '</div>' +
      '<label class="ds-filter-field"><span>表类型</span><select data-ds-filter="tableType"><option value="">请选择</option>' +
      tableTypes.map(function (item) { return '<option value="' + esc(item) + '"' + (state.filters.tableType === item ? ' selected' : '') + '>' + esc(item) + '</option>'; }).join('') + '</select></label>' +
      '<div class="ds-filter-field ds-filter-picker"><span>数仓分层</span><button type="button" class="ds-picker-trigger' + (state.filters.warehouseId ? ' has-value' : '') + '" data-ds-action="toggle-warehouse-picker"><span>' + esc(state.filters.warehouseId ? warehouseName(state.filters.warehouseId) : '请选择') + '</span><i class="bi bi-chevron-down"></i></button>' +
      (state.filters.warehouseId ? '<button type="button" class="ds-picker-clear" data-ds-action="clear-filter-warehouse" aria-label="清除数仓分层"><i class="bi bi-x"></i></button>' : '') + renderWarehousePicker() + '</div>' +
      '<div class="ds-filter-field ds-filter-picker"><span>类型</span><button type="button" class="ds-picker-trigger' + (state.filters.objectType ? ' has-value' : '') + '" data-ds-action="toggle-object-type-picker"><span>' + esc(state.filters.objectType || '全部') + '</span><i class="bi bi-chevron-down"></i></button>' +
      renderObjectTypePicker() + '</div>' +
      '</div>';
  }

  function sortHeader(key, label) {
    var active = state.sortKey === key;
    var icon = !active ? 'arrow-down-up' : state.sortDir === 'asc' ? 'sort-up' : 'sort-down';
    return '<button type="button" class="ds-sort-button' + (active ? ' active' : '') + '" data-ds-action="sort" data-key="' + key + '">' + esc(label) + '<i class="bi bi-' + icon + '"></i></button>';
  }

  function renderInlineCell(row, field) {
    if (state.inlineEdit && state.inlineEdit.rowId === row.id && state.inlineEdit.field === field) {
      return '<input class="ds-inline-input" type="text" data-ds-inline-row="' + esc(row.id) + '" data-ds-inline-field="' + field + '" value="' + esc(row[field]) + '" maxlength="' + (field === 'alias' ? '50' : '300') + '">';
    }
    return '<button type="button" class="ds-inline-link" data-ds-action="edit-inline" data-id="' + esc(row.id) + '" data-field="' + field + '">' + esc(row[field] || '--') + '</button>';
  }

  function renderTable() {
    var rows = filteredRows();
    var total = rows.length;
    var totalPages = Math.max(1, Math.ceil(total / state.pageSize));
    if (state.page > totalPages) state.page = totalPages;
    var start = (state.page - 1) * state.pageSize;
    var pageRows = rows.slice(start, start + state.pageSize);
    var allChecked = pageRows.length && pageRows.every(function (row) { return state.selectedRows.has(row.id); });
    var body = pageRows.map(function (row) {
      return '<tr>' +
        '<td class="ds-col-check"><input type="checkbox" data-ds-row-check="' + esc(row.id) + '"' + (state.selectedRows.has(row.id) ? ' checked' : '') + ' aria-label="选择' + esc(row.name) + '"></td>' +
        '<td class="ds-name-cell"><strong>' + esc(row.name) + '</strong></td>' +
        '<td>' + renderInlineCell(row, 'alias') + '</td>' +
        '<td><span class="ds-object-tag">' + esc(row.objectType) + '</span></td>' +
        '<td>' + esc(warehouseName(row.warehouseId)) + '</td>' +
        '<td>' + esc(row.tableSubtype ? row.tableType + '-' + row.tableSubtype : row.tableType || '-') + '</td>' +
        '<td>' + esc(row.database) + '</td>' +
        '<td class="ds-description-cell">' + renderInlineCell(row, 'description') + '</td>' +
        '<td class="ds-number">' + (row.records == null ? '-' : Number(row.records).toLocaleString('zh-CN')) + '</td>' +
        '<td class="ds-operation-cell"><div class="ds-row-actions">' +
        button('view-structure', 'file-earmark-text', '表结构', 'data-id="' + esc(row.id) + '"', 'ds-row-action') +
        button('sync-count', 'arrow-repeat', '同步记录数', 'data-id="' + esc(row.id) + '"', 'ds-row-action') +
        button('preview-data', 'search', '数据预览', 'data-id="' + esc(row.id) + '"', 'ds-row-action') +
        button('plan-row', 'layers', '数仓规划', 'data-id="' + esc(row.id) + '"', 'ds-row-action') +
        '</div></td></tr>';
    }).join('');
    if (!body) body = '<tr><td colspan="10"><div class="ds-empty ds-table-empty"><i class="bi bi-inbox"></i><strong>没有找到匹配的记录</strong><span>请调整目录选择或查询条件</span></div></td></tr>';
    return '<div class="ds-table-wrap"><table class="ds-table"><thead><tr>' +
      '<th class="ds-col-check"><input type="checkbox" data-ds-check-all' + (allChecked ? ' checked' : '') + ' aria-label="全选当前页"></th>' +
      '<th>' + sortHeader('name', '英文名称') + '</th><th>' + sortHeader('alias', '别名') + '</th><th>' + sortHeader('objectType', '类型') + '</th>' +
      '<th>' + sortHeader('warehouse', '数仓分层') + '</th><th>' + sortHeader('tableType', '表类型') + '</th><th>库名</th><th>描述</th><th>' + sortHeader('records', '记录数') + '</th><th class="ds-operation-cell">操作</th>' +
      '</tr></thead><tbody>' + body + '</tbody></table></div>' + renderPagination(total, totalPages, start, pageRows.length);
  }

  function renderPagination(total, totalPages, start, visibleCount) {
    var pageButtons = '';
    var from = Math.max(1, state.page - 2);
    var to = Math.min(totalPages, from + 4);
    if (to - from < 4) from = Math.max(1, to - 4);
    for (var page = from; page <= to; page += 1) {
      pageButtons += '<button type="button" class="' + (page === state.page ? 'active' : '') + '" data-ds-action="page" data-page="' + page + '">' + page + '</button>';
    }
    return '<div class="ds-pagination"><div class="ds-page-summary">显示第 ' + (total ? start + 1 : 0) + ' 到第 ' + (total ? start + visibleCount : 0) + ' 条记录，总共 ' + total + ' 条记录</div>' +
      '<label>每页显示<select data-ds-page-size><option' + (state.pageSize === 10 ? ' selected' : '') + '>10</option><option' + (state.pageSize === 20 ? ' selected' : '') + '>20</option><option' + (state.pageSize === 50 ? ' selected' : '') + '>50</option><option' + (state.pageSize === 100 ? ' selected' : '') + '>100</option></select>条记录</label>' +
      '<div class="ds-page-nav"><button type="button" data-ds-action="page" data-page="' + Math.max(1, state.page - 1) + '"' + (state.page === 1 ? ' disabled' : '') + '>上一页</button>' + pageButtons +
      '<button type="button" data-ds-action="page" data-page="' + Math.min(totalPages, state.page + 1) + '"' + (state.page === totalPages ? ' disabled' : '') + '>下一页</button></div></div>';
  }

  function renderListView() {
    var selectedSource = state.selection.kind === 'source' ? sourceById(state.selection.id) : null;
    if (state.tab === 'datasource' && selectedSource && selectedSource.dbType === 'HDFS') return renderHdfsView(selectedSource);
    var selectedLabel = '';
    if (state.tab === 'datasource' && state.selection.kind === 'source') {
      var source = sourceById(state.selection.id);
      selectedLabel = source ? '<span class="ds-context-label"><i class="bi bi-database"></i>' + esc(source.alias) + '<small>' + esc(source.dbType) + '</small></span>' : '';
    } else if (state.tab === 'datasource' && state.selection.kind === 'layer') {
      selectedLabel = '<span class="ds-context-label"><i class="bi bi-folder2"></i>' + esc(layerName(state.selection.id)) + '</span>';
    } else if (state.tab === 'layer' && state.selection.kind === 'warehouse') {
      selectedLabel = '<span class="ds-context-label"><i class="bi bi-layers"></i>' + esc(warehouseName(state.selection.id)) + '</span>';
    }
    return '<main class="ds-right-panel"><div class="ds-list-view">' +
      '<div class="ds-toolbar"><div class="ds-toolbar-actions">' + renderContextActions() + '</div>' + selectedLabel + '</div>' +
      renderFilters() + renderTable() + '</div></main>';
  }

  function renderHdfsView(source) {
    var transfer = state.hdfsTransfer;
    var contextLabel = '<span class="ds-context-label">' + datasourceIconHtml(source.dbType) + esc(source.alias) + '<small>HDFS</small></span>';
    var content = state.hdfsTab === 'transfer'
      ? '<div class="ds-hdfs-transfer-query"><label><span>属性</span><select data-ds-hdfs-filter="attribute"><option value="">请选择</option><option value="import"' + (transfer.attribute === 'import' ? ' selected' : '') + '>导入</option><option value="export"' + (transfer.attribute === 'export' ? ' selected' : '') + '>导出</option></select></label><label><span>状态</span><select data-ds-hdfs-filter="status"><option value="">请选择</option><option value="processing"' + (transfer.status === 'processing' ? ' selected' : '') + '>处理中</option><option value="success"' + (transfer.status === 'success' ? ' selected' : '') + '>处理成功</option><option value="failed"' + (transfer.status === 'failed' ? ' selected' : '') + '>处理失败</option></select></label>' + button('query-hdfs-transfer', 'search', '查询', '', 'btn btn-primary') + '</div><div class="ds-table-wrap"><table class="ds-table ds-hdfs-transfer-table"><thead><tr><th>文件名</th><th>属性</th><th>状态</th><th>操作者</th><th>时间</th><th>操作</th></tr></thead><tbody><tr><td colspan="6"><div class="ds-empty ds-table-empty"><i class="bi bi-inbox"></i><strong>暂无数据</strong></div></td></tr></tbody></table></div>'
      : '<div class="ds-hdfs-browser"><div class="ds-hdfs-tree"><button type="button" class="ds-tree-row active"><i class="bi bi-folder2-open"></i><span>根目录</span></button></div><div class="ds-empty ds-table-empty"><i class="bi bi-folder2-open"></i><strong>根目录暂无文件</strong></div></div>';
    return '<main class="ds-right-panel"><div class="ds-list-view"><div class="ds-hdfs-tabs"><button type="button" class="' + (state.hdfsTab === 'list' ? 'active' : '') + '" data-ds-action="switch-hdfs-tab" data-tab="list">数据列表</button><button type="button" class="' + (state.hdfsTab === 'transfer' ? 'active' : '') + '" data-ds-action="switch-hdfs-tab" data-tab="transfer">导入导出</button></div><div class="ds-toolbar"><div><span class="ds-hdfs-storage">存储总量（0.0G/10.0G）</span><div class="ds-toolbar-actions">' + renderContextActions() + '</div></div>' + contextLabel + '</div>' + content + '</div></main>';
  }

  function formField(label, field, value, options) {
    options = options || {};
    var control;
    if (options.textarea) {
      control = '<textarea data-ds-form-field="' + field + '" maxlength="' + (options.maxlength || 300) + '"' + (options.disabled ? ' disabled' : '') + '>' + esc(value) + '</textarea>';
    } else {
      control = '<input type="' + (options.type || 'text') + '" data-ds-form-field="' + field + '" value="' + esc(value) + '" placeholder="' + esc(options.placeholder || '') + '"' +
        (options.maxlength ? ' maxlength="' + options.maxlength + '"' : '') + (options.disabled ? ' disabled' : '') + '>';
    }
    return '<label class="ds-form-field' + (options.wide ? ' wide' : '') + '"><span>' + (options.required ? '<b>*</b>' : '') + esc(label) + '</span>' + control + (options.hint ? '<small>' + esc(options.hint) + '</small>' : '') + '</label>';
  }

  function renderFormPicker(kind) {
    if (state.formPicker !== kind) return '';
    var keyword = state.formPickerKeyword.trim().toLowerCase();
    if (kind === 'businessLayer') {
      function matchesLayer(layer) {
        var ownMatch = (layer.name + ' ' + layer.code).toLowerCase().indexOf(keyword) >= 0;
        return !keyword || ownMatch || childLayers(layer.id).some(matchesLayer);
      }
      function renderLayerBranch(parentId) {
        return childLayers(parentId).filter(matchesLayer).map(function (layer) {
          var children = childLayers(layer.id);
          var open = !!keyword || state.formPickerExpanded.has('layer:' + layer.id);
          return '<li><div class="ds-form-tree-row">' +
            (children.length ? '<button type="button" class="ds-form-tree-toggle" data-ds-action="toggle-form-tree" data-key="layer:' + esc(layer.id) + '" aria-label="展开或收起" aria-expanded="' + open + '"><i class="bi bi-chevron-' + (open ? 'down' : 'right') + '"></i></button>' : '<span class="ds-form-tree-spacer"></span>') +
            '<button type="button" class="ds-form-tree-select' + (state.formDraft.businessLayerId === layer.id ? ' active' : '') + '" data-ds-action="choose-form-picker" data-kind="businessLayer" data-value="' + esc(layer.id) + '" title="' + esc(layerPath(layer.id)) + '"><i class="bi bi-folder2' + (open ? '-open' : '') + '"></i><span>' + esc(layer.name) + '</span><small>' + esc(layer.code) + '</small></button></div>' +
            (children.length && open ? '<ul class="ds-form-tree-children">' + renderLayerBranch(layer.id) + '</ul>' : '') + '</li>';
        }).join('');
      }
      var layerTree = renderLayerBranch('');
      return '<div class="ds-form-picker-panel"><div class="ds-popover-search"><i class="bi bi-search"></i><input type="search" data-ds-input="form-picker-keyword" value="' + esc(state.formPickerKeyword) + '" placeholder="搜索业务分层"></div>' +
        (layerTree ? '<ul class="ds-form-tree">' + layerTree + '</ul>' : '<div class="ds-empty"><span>没有匹配的业务分层</span></div>') + '</div>';
    }
    if (kind === 'schema') {
      var schemaTree = schemaOptions(state.formDraft.dbType);
      var schemaItems = schemaTree.items.filter(function (item) { return !keyword || (schemaTree.root + ' ' + item).toLowerCase().indexOf(keyword) >= 0; });
      var schemaOpen = !!keyword || state.formPickerExpanded.has('schema:root');
      return '<div class="ds-form-picker-panel ds-schema-picker-panel"><div class="ds-popover-search"><i class="bi bi-search"></i><input type="search" data-ds-input="form-picker-keyword" value="' + esc(state.formPickerKeyword) + '" placeholder="搜索schema"></div>' +
        (schemaItems.length ? '<ul class="ds-form-tree"><li><div class="ds-form-tree-row"><button type="button" class="ds-form-tree-toggle" data-ds-action="toggle-form-tree" data-key="schema:root" aria-label="展开或收起" aria-expanded="' + schemaOpen + '"><i class="bi bi-chevron-' + (schemaOpen ? 'down' : 'right') + '"></i></button><button type="button" class="ds-form-tree-group-label" data-ds-action="toggle-form-tree" data-key="schema:root"><i class="bi bi-folder2' + (schemaOpen ? '-open' : '') + '"></i><span>' + esc(schemaTree.root) + '</span><small>' + schemaItems.length + '</small></button></div>' +
          (schemaOpen ? '<ul class="ds-form-tree-children">' + schemaItems.map(function (item) {
            return '<li><label class="ds-schema-tree-option"><input type="checkbox" data-ds-schema-option="' + esc(item) + '"' + (state.formDraft.schemas.indexOf(item) >= 0 ? ' checked' : '') + '><i class="bi bi-diagram-2"></i><span>' + esc(item) + '</span></label></li>';
          }).join('') + '</ul>' : '') + '</li></ul>' : '<div class="ds-empty"><span>没有匹配的schema</span></div>') + '</div>';
    }
    var groups = databaseGroupsForMode(state.formDraft.mode).map(function (group) {
      var items = group.items.filter(function (item) { return !keyword || (group.name + ' ' + item).toLowerCase().indexOf(keyword) >= 0; });
      if (!items.length) return '';
      var key = 'db:' + group.name;
      var open = !!keyword || state.formPickerExpanded.has(key);
      return '<li><div class="ds-form-tree-row"><button type="button" class="ds-form-tree-toggle" data-ds-action="toggle-form-tree" data-key="' + esc(key) + '" aria-label="展开或收起" aria-expanded="' + open + '"><i class="bi bi-chevron-' + (open ? 'down' : 'right') + '"></i></button>' +
        '<button type="button" class="ds-form-tree-group-label" data-ds-action="toggle-form-tree" data-key="' + esc(key) + '"><i class="bi bi-folder2' + (open ? '-open' : '') + '"></i><span>' + esc(group.name) + '</span><small>' + items.length + '</small></button></div>' +
        (open ? '<ul class="ds-form-tree-children">' + items.map(function (item) {
          return '<li><div class="ds-form-tree-row"><span class="ds-form-tree-spacer"></span><button type="button" class="ds-form-tree-select' + (state.formDraft.dbType === item ? ' active' : '') + '" data-ds-action="choose-form-picker" data-kind="dbType" data-value="' + esc(item) + '"><i class="bi bi-database"></i><span>' + esc(item) + '</span></button></div></li>';
        }).join('') + '</ul>' : '') + '</li>';
    }).join('');
    return '<div class="ds-form-picker-panel"><div class="ds-popover-search"><i class="bi bi-search"></i><input type="search" data-ds-input="form-picker-keyword" value="' + esc(state.formPickerKeyword) + '" placeholder="搜索数据库类型"></div>' +
      (groups ? '<ul class="ds-form-tree">' + groups + '</ul>' : '<div class="ds-empty"><span>没有匹配的数据库类型</span></div>') + '</div>';
  }

  function pickerField(label, kind, value, textValue, required, disabled) {
    return '<div class="ds-form-field ds-form-picker-field"><span>' + (required ? '<b>*</b>' : '') + esc(label) + '</span>' +
      '<button type="button" class="ds-form-picker-trigger' + (value ? ' has-value' : '') + '" data-ds-action="toggle-form-picker" data-kind="' + kind + '"' + (disabled ? ' disabled' : '') + '><span>' + esc(textValue || '请选择') + '</span><i class="bi bi-chevron-down"></i></button>' +
      renderFormPicker(kind) + '</div>';
  }

  function renderParams() {
    var params = state.formDraft.params || [];
    return '<div class="ds-form-field wide ds-param-field"><span>其他参数</span><div class="ds-param-card"><div class="ds-param-head"><strong>连接参数</strong>' +
      button('add-param', 'plus-lg', '新增参数', '', 'btn btn-outline btn-sm') + '</div><table><thead><tr><th>KEY</th><th>VALUE</th><th>操作</th></tr></thead><tbody>' +
      (params.length ? params.map(function (param, index) {
        return '<tr><td><input type="text" data-ds-param-index="' + index + '" data-ds-param-field="key" value="' + esc(param.key) + '" placeholder="参数名"></td>' +
          '<td><input type="text" data-ds-param-index="' + index + '" data-ds-param-field="value" value="' + esc(param.value) + '" placeholder="参数值"></td><td>' +
          button('delete-param', 'trash', '删除', 'data-index="' + index + '"', 'ds-text-danger') + '</td></tr>';
      }).join('') : '<tr><td colspan="3"><div class="ds-param-empty">暂无其他参数</div></td></tr>') +
      '</tbody></table></div></div>';
  }

  function selectFormField(label, field, value, items, required) {
    return '<label class="ds-form-field"><span>' + (required ? '<b>*</b>' : '') + esc(label) + '</span><select data-ds-form-field="' + field + '">' + items.map(function (item) {
      return '<option value="' + esc(item.value) + '"' + (value === item.value ? ' selected' : '') + '>' + esc(item.label) + '</option>';
    }).join('') + '</select></label>';
  }

  function renderSourceForm() {
    var draft = state.formDraft;
    var editing = draft.id;
    var modeOptions = [
      { value: 'new', label: '新建数据库' },
      { value: 'link', label: '添加数据库链接' },
      { value: 'instance', label: '添加数据库实例' }
    ];
    var modeSelect = '<label class="ds-form-field"><span><b>*</b>添加方式</span><select data-ds-form-field="mode"' + (editing ? ' disabled' : '') + '>' +
      modeOptions.map(function (item) { return '<option value="' + item.value + '"' + (draft.mode === item.value ? ' selected' : '') + '>' + item.label + '</option>'; }).join('') + '</select></label>';
    var fields = modeSelect;
    fields += pickerField('数据库类型', 'dbType', draft.dbType, draft.dbType, true, !!editing);
    if (needsPlatformFields(draft.dbType) && draft.mode !== 'new') {
      fields += selectFormField('链接方式', 'linkType', draft.linkType, [
        { value: 'internal', label: '内部链接' },
        { value: 'external', label: '外部链接' }
      ], true);
    }
    fields += pickerField('业务分层', 'businessLayer', draft.businessLayerId, layerName(draft.businessLayerId), true, false);
    fields += formField('数据源代码', 'code', draft.code, { maxlength: 100, hint: '100个字符以内' });
    if (draft.mode === 'new' || (editing && draft.mode === 'link')) {
      fields += formField('数据库名', 'database', draft.database, { required: true, maxlength: 50, hint: '字母开头，只允许英文、数字和下划线' });
    }
    fields += formField('数据源别名', 'alias', draft.alias, { required: true, maxlength: 50, hint: '中英文、数字或下划线，50个字符以内' });
    if (draft.dbType && (draft.mode === 'new' || needsPlatformFields(draft.dbType))) {
      fields += selectFormField('大数据账号', 'bigDataAccount', draft.bigDataAccount, [
        { value: '', label: '请选择' },
        { value: 'metadata_reader', label: 'metadata_reader' }
      ], true);
    }
    if (draft.mode !== 'new') {
      fields += formField('URL', 'url', draft.url, { required: true, maxlength: 300, wide: true, hint: '连接地址，300个字符以内' });
      fields += formField('账号', 'account', draft.account, { maxlength: 100, hint: '英文、数字或下划线，100个字符以内' });
      fields += formField('密码', 'password', draft.password, { type: 'password', maxlength: 50, hint: '50个字符以内' });
      fields += renderParams();
      fields += '<div class="ds-form-action-row">' + button('test-connection', 'plug', state.connectionTested ? '连接成功' : '测试连接', '', state.connectionTested ? 'btn ds-success-button' : 'btn btn-outline') + '</div>';
      if (draft.mode === 'instance') {
        var schemaText = draft.schemas.length ? draft.schemas.join('、') : '请选择';
        fields += pickerField('schema', 'schema', draft.schemas.length, schemaText, true, false);
      }
    }
    var footer = '<div class="ds-form-footer">';
    footer += button('cancel-form', 'x-lg', '取消');
    footer += draft.mode === 'new' || (editing && draft.mode === 'link') ? button('save-source', 'check-lg', '保存', '', 'btn btn-primary') : button('next-form', 'arrow-right', '下一步', '', 'btn btn-primary');
    footer += '</div>';
    return '<main class="ds-right-panel"><div class="ds-subview"><div class="ds-subview-header"><div><h2>' + (editing ? '编辑数据源' : '添加数据源') + '</h2><p>配置数据源接入信息，必填项完成后可保存。</p></div></div>' +
      '<div class="ds-source-form"><div class="ds-form-grid">' + fields + '</div>' + footer + '</div></div></main>';
  }

  function renderRegisterView() {
    var source = sourceById(state.selection.id);
    if (!source) return renderListView();
    var keyword = state.register.keyword.toLowerCase();
    var rows = store.objects.filter(function (row) {
      if (row.sourceId !== source.id) return false;
      if (state.register.status === 'registered' && !row.registered) return false;
      if (state.register.status === 'unregistered' && row.registered) return false;
      if (keyword && (row.name + ' ' + row.alias + ' ' + row.description).toLowerCase().indexOf(keyword) < 0) return false;
      return true;
    });
    var body = rows.map(function (row) {
      return '<tr><td><input type="checkbox" data-ds-register-check="' + esc(row.id) + '"' + (state.register.selected.has(row.id) ? ' checked' : '') + '></td><td><strong>' + esc(row.name) + '</strong></td><td>' + esc(row.alias) + '</td><td>' + esc(row.description) + '</td><td><span class="ds-status-tag ' + (row.registered ? 'success' : 'muted') + '">' + (row.registered ? '已注册' : '未注册') + '</span></td></tr>';
    }).join('');
    if (!body) body = '<tr><td colspan="5"><div class="ds-empty ds-table-empty"><i class="bi bi-inbox"></i><strong>没有匹配的记录</strong></div></td></tr>';
    return '<main class="ds-right-panel"><div class="ds-subview"><div class="ds-subview-header"><div><h2>注册管理</h2><p>' + esc(source.alias) + ' · ' + esc(source.name) + '</p></div>' +
      button('back-list', 'arrow-left', '返回') + '</div><div class="ds-register-toolbar"><div class="ds-toolbar-actions">' +
      button('register-selected', 'check-circle', '注册', '', 'btn btn-primary') +
      button('unregister-selected', 'x-circle', '取消注册') +
      button('register-all', 'check2-all', '全部注册') +
      button('unregister-all', 'dash-circle', '全部取消') +
      button('open-register-import', 'upload', '导入注册') +
      button('refresh-register', 'arrow-clockwise', '刷新') +
      '</div><div class="ds-register-query"><select data-ds-register-filter="status"><option value="">全部</option><option value="registered"' + (state.register.status === 'registered' ? ' selected' : '') + '>已注册</option><option value="unregistered"' + (state.register.status === 'unregistered' ? ' selected' : '') + '>未注册</option></select>' +
      '<input type="search" data-ds-input="register-keyword" value="' + esc(state.register.keywordDraft) + '" placeholder="输入表英文名称">' +
      button('query-register', 'search', '查询', '', 'btn btn-primary') + '</div></div>' +
      '<div class="ds-table-wrap"><table class="ds-table ds-register-table"><thead><tr><th><input type="checkbox" data-ds-register-all></th><th>英文名称</th><th>别名</th><th>描述</th><th>状态</th></tr></thead><tbody>' + body + '</tbody></table></div>' +
      '<div class="ds-pagination"><div class="ds-page-summary">显示第 1 到第 ' + rows.length + ' 条记录，总共 ' + rows.length + ' 条记录</div></div></div></main>';
  }

  function renderStructureView() {
    var row = rowById(state.currentRowId);
    if (!row) return renderListView();
    function renderStructureCell(field, index, key) {
      if (state.structureEdit && state.structureEdit.rowId === row.id && state.structureEdit.index === index && state.structureEdit.field === key) {
        return '<input class="ds-inline-input" type="text" data-ds-structure-row="' + esc(row.id) + '" data-ds-structure-index="' + index + '" data-ds-structure-field="' + key + '" value="' + esc(field[key]) + '" maxlength="' + (key === 'alias' ? '50' : '300') + '">';
      }
      return '<button type="button" class="ds-inline-link" data-ds-action="edit-structure-field" data-id="' + esc(row.id) + '" data-index="' + index + '" data-field="' + key + '">' + esc(field[key] || '--') + '</button>';
    }
    return '<main class="ds-right-panel"><div class="ds-subview"><div class="ds-subview-header"><div><h2>数据查看</h2><p><strong>' + esc(row.name) + '</strong>（' + esc(row.alias) + '） · 业务分层：' + esc(layerName(sourceById(row.sourceId).businessLayerId)) + '</p></div>' +
      button('back-list', 'arrow-left', '返回') + '</div><div class="ds-table-wrap"><table class="ds-table"><thead><tr><th>序号</th><th>英文名称</th><th>别名</th><th>数据类型</th><th>描述</th></tr></thead><tbody>' +
      row.fields.map(function (field, index) {
        return '<tr><td>' + (index + 1) + '</td><td><strong>' + esc(field.name) + '</strong></td><td>' + renderStructureCell(field, index, 'alias') + '</td><td><code>' + esc(field.type) + '</code></td><td>' + renderStructureCell(field, index, 'description') + '</td></tr>';
      }).join('') + '</tbody></table></div></div></main>';
  }

  function previewRows(row) {
    var rows = [];
    for (var index = 1; index <= 48; index += 1) {
      var item = {};
      row.fields.forEach(function (field, fieldIndex) {
        if (field.name.indexOf('_id') >= 0) item[field.name] = row.name.toUpperCase().slice(0, 8) + '-' + String(index).padStart(5, '0');
        else if (field.name === 'org_code') item[field.name] = 'ORG_' + String((index % 6) + 1).padStart(2, '0');
        else if (field.name === 'status') item[field.name] = ['ACTIVE', 'FINISHED', 'PENDING'][index % 3];
        else if (field.name === 'biz_date') item[field.name] = '2026-09-' + String((index % 8) + 1).padStart(2, '0');
        else item[field.name] = '2026-09-08 ' + String((index % 12) + 8).padStart(2, '0') + ':' + String((index * 7) % 60).padStart(2, '0') + ':00';
        if (fieldIndex === 0 && row.name.indexOf('topic_') === 0) item[field.name] = 'EVENT-' + String(index).padStart(6, '0');
      });
      rows.push(item);
    }
    state.preview.conditions.forEach(function (condition) {
      if (!condition.field || ((!condition.value) && condition.operator !== 'isNull' && condition.operator !== 'notNull')) return;
      var value = condition.value.toLowerCase();
      rows = rows.filter(function (item) {
        var current = String(item[condition.field] == null ? '' : item[condition.field]).toLowerCase();
        if (condition.operator === 'neq') return current !== value;
        if (condition.operator === 'contains') return current.indexOf(value) >= 0;
        if (condition.operator === 'notContains') return current.indexOf(value) < 0;
        if (condition.operator === 'gt') return current > value;
        if (condition.operator === 'lt') return current < value;
        if (condition.operator === 'isNull') return !current;
        if (condition.operator === 'notNull') return !!current;
        return current === value;
      });
    });
    return rows;
  }

  function renderPreviewView() {
    var row = rowById(state.currentRowId);
    if (!row) return renderListView();
    var rows = previewRows(row);
    var start = (state.preview.page - 1) * state.preview.pageSize;
    var pageRows = rows.slice(start, start + state.preview.pageSize);
    var conditions = state.preview.conditions.map(function (condition, index) {
      return '<div class="ds-preview-condition"><select data-ds-preview-index="' + index + '" data-ds-preview-field="field"><option value="">请选择字段</option>' +
        row.fields.map(function (field) { return '<option value="' + esc(field.name) + '"' + (condition.field === field.name ? ' selected' : '') + '>' + esc(field.name + '(' + field.alias + ')') + '</option>'; }).join('') + '</select>' +
        '<select data-ds-preview-index="' + index + '" data-ds-preview-field="operator">' +
        [['eq', '等于'], ['neq', '不等于'], ['gt', '大于'], ['lt', '小于'], ['contains', '包含'], ['notContains', '不包含'], ['isNull', 'is null'], ['notNull', 'is not null']].map(function (operator) {
          return '<option value="' + operator[0] + '"' + (condition.operator === operator[0] ? ' selected' : '') + '>' + operator[1] + '</option>';
        }).join('') + '</select><input type="text" data-ds-preview-index="' + index + '" data-ds-preview-field="value" value="' + esc(condition.value) + '" placeholder="条件值"' + (condition.operator === 'isNull' || condition.operator === 'notNull' ? ' disabled' : '') + '>' +
        (index ? button('remove-preview-condition', 'x-lg', '删除条件', 'data-index="' + index + '"', 'ds-icon-button') : '') + '</div>';
    }).join('');
    return '<main class="ds-right-panel"><div class="ds-subview"><div class="ds-subview-header"><div><h2>表详情</h2><p><strong>' + esc(row.name) + '</strong>（' + esc(row.alias) + '）</p></div><div class="ds-subview-actions">' +
      button('back-list', 'arrow-left', '返回') + '</div></div>' +
      '<div class="ds-preview-query"><div class="ds-preview-conditions">' + conditions + '</div><div class="ds-preview-buttons">' +
      button('add-preview-condition', 'plus-lg', '新增') + button('query-preview', 'search', '查询', '', 'btn btn-primary') +
      '<button type="button" class="btn btn-outline' + (state.preview.alias ? ' active' : '') + '" data-ds-action="toggle-preview-alias"><i class="bi bi-tag"></i><span>别名</span></button></div></div>' +
      '<div class="ds-table-wrap"><table class="ds-table ds-preview-table"><thead><tr>' + row.fields.map(function (field) {
        return '<th>' + esc(state.preview.alias ? field.alias : field.name) + '</th>';
      }).join('') + '</tr></thead><tbody>' +
      (pageRows.length ? pageRows.map(function (item) {
        return '<tr>' + row.fields.map(function (field) { return '<td>' + esc(item[field.name]) + '</td>'; }).join('') + '</tr>';
      }).join('') : '<tr><td colspan="' + row.fields.length + '"><div class="ds-empty ds-table-empty"><strong>没有匹配的数据</strong></div></td></tr>') +
      '</tbody></table></div><div class="ds-pagination"><div class="ds-page-summary">显示第 ' + (rows.length ? start + 1 : 0) + ' 到第 ' + (rows.length ? start + pageRows.length : 0) + ' 条记录，总共 ' + rows.length + ' 条记录</div></div></div></main>';
  }

  function renderImportModal() {
    var modal = state.modal;
    var registration = modal.kind === 'registration';
    var accept = registration ? '.xls,.xlsx' : '.json';
    return '<div class="ds-modal-mask" data-ds-action="close-modal"><section class="ds-modal" role="dialog" aria-modal="true"><header><div><h3>' + (registration ? '导入注册' : '导入') + '</h3><p>' + (registration ? '按模板批量导入表注册信息' : '导入数据源配置') + '</p></div>' +
      button('close-modal', 'x-lg', '关闭', '', 'ds-icon-button') + '</header><div class="ds-modal-body">' +
      (!registration ? '<div class="ds-modal-field"><span><b>*</b>业务分层</span><div class="ds-modal-layer-picker"><div class="ds-popover-search"><i class="bi bi-search"></i><input type="search" data-ds-input="modal-layer-keyword" value="' + esc(modal.layerKeyword || '') + '" placeholder="搜索业务分层"></div><div class="ds-modal-layer-list">' +
        state.layers.filter(function (layer) {
          var keyword = (modal.layerKeyword || '').toLowerCase();
          return !keyword || (layer.name + ' ' + layer.code).toLowerCase().indexOf(keyword) >= 0;
        }).map(function (layer) {
          return '<button type="button" class="' + (modal.businessLayerId === layer.id ? 'active' : '') + '" data-ds-action="choose-modal-layer" data-value="' + esc(layer.id) + '"><i class="bi bi-folder2"></i><span>' + esc(layer.name) + '</span><small>' + esc(layerPath(layer.id)) + ' · ' + esc(layer.code) + '</small></button>';
        }).join('') + '</div></div></div>' : '') +
      '<label class="ds-modal-field"><span><b>*</b>上传文件</span><div class="ds-upload-box"><i class="bi bi-cloud-arrow-up"></i><strong>' + esc(modal.fileName || '选择文件') + '</strong><small>文件格式为' + (registration ? 'Excel' : 'JSON') + '，大小不超过50M</small><input type="file" data-ds-file accept="' + accept + '"></div></label>' +
      (registration ? '<button type="button" class="ds-template-link" data-ds-action="download-register-template"><i class="bi bi-download"></i><span>下载模板</span></button>' : '') +
      '<div class="ds-upload-progress"><span style="width:' + (modal.progress || 0) + '%"></span></div></div><footer>' +
      button('close-modal', 'x-lg', '取消') + button('save-import', 'check-lg', registration ? '确认' : '保存', '', 'btn btn-primary') + '</footer></section></div>';
  }

  function renderPlanModal() {
    var modal = state.modal;
    if (!Array.isArray(modal.warehouseOpen)) modal.warehouseOpen = [];
    if (!Array.isArray(modal.domainOpen)) modal.domainOpen = ['DOMAIN_ROOT'];
    var subtypes = tableSubtypeMap[modal.tableType] || [];

    function warehouseBranch(parentId) {
      var keyword = (modal.warehouseKeyword || '').trim().toLowerCase();
      function matches(node) {
        var own = (node.path + ' ' + node.name).toLowerCase().indexOf(keyword) >= 0;
        return !keyword || own || warehouseTree.filter(function (child) { return child.parentId === node.id; }).some(matches);
      }
      return warehouseTree.filter(function (node) { return node.parentId === parentId && matches(node); }).map(function (node) {
        var children = warehouseTree.filter(function (child) { return child.parentId === node.id && matches(child); });
        var open = !!keyword || modal.warehouseOpen.indexOf(node.id) >= 0;
        return '<li><div class="ds-plan-tree-row">' +
          (children.length ? '<button type="button" class="ds-plan-tree-toggle" data-ds-action="toggle-plan-tree" data-id="' + esc(node.id) + '"><i class="bi bi-chevron-' + (open ? 'down' : 'right') + '"></i><span>展开或收起</span></button>' : '<span class="ds-plan-tree-spacer"></span>') +
          '<button type="button" class="ds-plan-tree-option' + (modal.warehouseId === node.id ? ' active' : '') + '" data-ds-action="choose-plan-warehouse" data-value="' + esc(node.id) + '"><i class="bi bi-folder2' + (open && children.length ? '-open' : '') + '"></i><span>' + esc(node.name) + '</span></button></div>' +
          (children.length && open ? '<ul>' + warehouseBranch(node.id) + '</ul>' : '') + '</li>';
      }).join('');
    }

    function domainBranch(parentId) {
      var keyword = (modal.domainKeyword || '').trim().toLowerCase();
      function matches(node) {
        var own = node.name.toLowerCase().indexOf(keyword) >= 0;
        return !keyword || own || dataDomainTree.filter(function (child) { return child.parentId === node.id; }).some(matches);
      }
      return dataDomainTree.filter(function (node) { return node.parentId === parentId && matches(node); }).map(function (node) {
        var children = dataDomainTree.filter(function (child) { return child.parentId === node.id && matches(child); });
        var open = !!keyword || modal.domainOpen.indexOf(node.id) >= 0;
        var nodeContent = node.selectable
          ? '<button type="button" class="ds-plan-tree-option' + (modal.dataDomain === node.name ? ' active' : '') + '" data-ds-action="choose-plan-domain" data-value="' + esc(node.name) + '"><i class="bi bi-folder2"></i><span>' + esc(node.name) + '</span></button>'
          : '<span class="ds-plan-tree-option ds-plan-tree-group"><i class="bi bi-folder2' + (open ? '-open' : '') + '"></i><span>' + esc(node.name) + '</span></span>';
        return '<li><div class="ds-plan-tree-row">' +
          (children.length ? '<button type="button" class="ds-plan-tree-toggle" data-ds-action="toggle-plan-domain-tree" data-id="' + esc(node.id) + '"><i class="bi bi-chevron-' + (open ? 'down' : 'right') + '"></i><span>展开或收起</span></button>' : '<span class="ds-plan-tree-spacer"></span>') + nodeContent + '</div>' +
          (children.length && open ? '<ul>' + domainBranch(node.id) + '</ul>' : '') + '</li>';
      }).join('');
    }

    var warehouseDropdown = modal.planPicker === 'warehouse'
      ? '<div class="ds-plan-tree-dropdown"><div class="ds-popover-search"><i class="bi bi-search"></i><input type="search" data-ds-input="plan-warehouse-keyword" value="' + esc(modal.warehouseKeyword || '') + '" placeholder="搜索数仓分层"></div><ul class="ds-plan-tree">' + (warehouseBranch('') || '<li><div class="ds-empty"><span>没有匹配的数仓分层</span></div></li>') + '</ul></div>'
      : '';
    var domainDropdown = modal.planPicker === 'domain'
      ? '<div class="ds-plan-tree-dropdown"><div class="ds-popover-search"><i class="bi bi-search"></i><input type="search" data-ds-input="plan-domain-keyword" value="' + esc(modal.domainKeyword || '') + '" placeholder="搜索数据域"></div><ul class="ds-plan-tree">' +
        (domainBranch('') || '<li><div class="ds-empty"><span>没有匹配的数据域</span></div></li>') + '</ul></div>'
      : '';

    return '<div class="ds-modal-mask" data-ds-action="close-modal"><section class="ds-modal ds-plan-modal" role="dialog" aria-modal="true"><header><div><h3>数仓规划</h3></div>' +
      button('close-modal', 'x-lg', '关闭', '', 'ds-icon-button') + '</header><div class="ds-modal-body"><label class="ds-modal-field"><span><b>*</b>待规划</span><input type="text" value="' + esc(modal.targetLabel) + '" disabled></label>' +
      '<div class="ds-modal-field ds-plan-picker-field"><span><b>*</b>数仓分层</span><button type="button" class="ds-plan-picker-trigger' + (modal.warehouseId ? ' has-value' : '') + '" data-ds-action="toggle-plan-picker" data-kind="warehouse"><span>' + esc(modal.warehouseId ? warehouseName(modal.warehouseId) : '请选择') + '</span><i class="bi bi-diagram-3"></i></button>' + warehouseDropdown + '</div>' +
      '<div class="ds-modal-field"><span><b>*</b>表类型</span><div class="ds-plan-table-types"><select data-ds-modal-field="tableType"><option value="">请选择</option>' +
      tableTypes.map(function (item) { return '<option value="' + esc(item) + '"' + (modal.tableType === item ? ' selected' : '') + '>' + esc(item) + '</option>'; }).join('') + '</select><select data-ds-modal-field="tableSubtype"' + (subtypes.length ? '' : ' disabled') + '><option value="">请选择</option>' +
      subtypes.map(function (item) { return '<option value="' + esc(item) + '"' + (modal.tableSubtype === item ? ' selected' : '') + '>' + esc(item) + '</option>'; }).join('') + '</select></div></div>' +
      '<div class="ds-modal-field ds-plan-picker-field"><span><b>*</b>数据域</span><button type="button" class="ds-plan-picker-trigger' + (modal.dataDomain ? ' has-value' : '') + '" data-ds-action="toggle-plan-picker" data-kind="domain"><span>' + esc(modal.dataDomain || '请选择') + '</span><i class="bi bi-diagram-3"></i></button>' + domainDropdown + '</div>' +
      '<label class="ds-modal-field"><span><b>*</b>重复机制</span><select data-ds-modal-field="repeatRule"><option value="skip"' + (modal.repeatRule === 'skip' ? ' selected' : '') + '>重复跳过</option><option value="replace"' + (modal.repeatRule === 'replace' ? ' selected' : '') + '>重复覆盖</option></select></label></div><footer>' +
      button('close-modal', 'x-lg', '取消') + button('save-plan', 'check-lg', '保存', '', 'btn btn-primary') + '</footer></section></div>';
  }

  function renderAutoSyncModal() {
    var modal = state.modal;
    return '<div class="ds-modal-mask" data-ds-action="close-modal"><section class="ds-modal ds-auto-sync-modal" role="dialog" aria-modal="true"><header><h3>自动同步配置</h3>' +
      button('close-modal', 'x-lg', '关闭', '', 'ds-icon-button') + '</header><div class="ds-modal-body">' +
      '<label class="ds-modal-field"><span>自动同步</span><span class="ds-switch-control"><input type="checkbox" data-ds-modal-toggle="autoSync"' + (modal.autoSync ? ' checked' : '') + '><i></i></span></label>' +
      '<div class="ds-modal-field"><span>同步时间</span><div class="ds-auto-sync-time"><select data-ds-modal-field="syncFrequency"><option value="daily">每天</option></select><input type="time" step="1" data-ds-modal-field="syncTime" value="' + esc(modal.syncTime) + '"></div></div>' +
      '<label class="ds-modal-field"><span>同步内容</span><select data-ds-modal-field="syncContent"><option value="registered"' + (modal.syncContent === 'registered' ? ' selected' : '') + '>已注册的表</option><option value="lineage"' + (modal.syncContent === 'lineage' ? ' selected' : '') + '>已注册并具有血缘关系的表</option></select></label>' +
      '</div><footer>' + button('close-modal', 'x-lg', '取消') + button('save-auto-sync', 'check-lg', '保存', '', 'btn btn-primary') + '</footer></section></div>';
  }

  function renderHdfsUploadModal() {
    var modal = state.modal;
    return '<div class="ds-modal-mask" data-ds-action="close-modal"><section class="ds-modal" role="dialog" aria-modal="true"><header><h3>上传</h3>' + button('close-modal', 'x-lg', '关闭', '', 'ds-icon-button') + '</header><div class="ds-modal-body">' +
      '<div class="ds-modal-notice"><i class="bi bi-info-circle"></i><span><strong>温馨提示：</strong>数据导入为异步处理，提交后请在“导入导出”查看处理结果</span></div>' +
      '<div class="ds-modal-field"><span><b>*</b>选择目录</span><div class="ds-modal-layer-picker"><div class="ds-popover-search"><i class="bi bi-search"></i><input type="search" data-ds-input="hdfs-directory-keyword" value="' + esc(modal.directoryKeyword || '') + '" placeholder="搜索目录"></div><div class="ds-modal-layer-list">' + ((modal.directoryKeyword || '').trim() && '根目录'.indexOf((modal.directoryKeyword || '').trim()) < 0 ? '<div class="ds-empty"><span>没有匹配的目录</span></div>' : '<button type="button" class="' + (modal.directory === '/' ? 'active' : '') + '" data-ds-action="choose-hdfs-directory" data-value="/"><i class="bi bi-folder2"></i><span>根目录</span></button>') + '</div></div></div>' +
      '<label class="ds-modal-field"><span><b>*</b>选择文件</span><div class="ds-upload-box"><i class="bi bi-folder2-open"></i><strong>' + esc(modal.fileName || '浏览文件') + '</strong><small>最大支持5000MB</small><input type="file" data-ds-hdfs-file multiple accept=".jar,.py,.sh,.hql,.opt,.sql,.zip,.scala,.txt,.xlsx,.xls,.csv"></div></label>' +
      '</div><footer>' + button('close-modal', 'x-lg', '取消') + button('save-hdfs-upload', 'check-lg', '确定', '', 'btn btn-primary') + '</footer></section></div>';
  }

  function renderModal() {
    if (!state.modal) return '';
    if (state.modal.type === 'import') return renderImportModal();
    if (state.modal.type === 'plan') return renderPlanModal();
    if (state.modal.type === 'auto-sync') return renderAutoSyncModal();
    if (state.modal.type === 'hdfs-upload') return renderHdfsUploadModal();
    return '';
  }

  function render() {
    if (!root) return;
    var activeElement = document.activeElement;
    var activeInput = activeElement && root.contains(activeElement) ? activeElement.getAttribute('data-ds-input') : '';
    var caret = activeElement && typeof activeElement.selectionStart === 'number' ? activeElement.selectionStart : null;
    var sourceForm = root.querySelector('.ds-source-form');
    var sourceFormScrollTop = sourceForm ? sourceForm.scrollTop : null;
    var right = state.view === 'form' ? renderSourceForm() :
      state.view === 'register' ? renderRegisterView() :
      state.view === 'structure' ? renderStructureView() :
      state.view === 'preview' ? renderPreviewView() :
      renderListView();
    root.innerHTML = renderLeftPanel() + right + renderModal();
    if (sourceFormScrollTop != null) {
      var restoredSourceForm = root.querySelector('.ds-source-form');
      if (restoredSourceForm) restoredSourceForm.scrollTop = sourceFormScrollTop;
    }
    if (state.inlineEdit) {
      var inlineInput = root.querySelector('[data-ds-inline-row="' + state.inlineEdit.rowId + '"][data-ds-inline-field="' + state.inlineEdit.field + '"]');
      if (inlineInput) {
        inlineInput.focus();
        inlineInput.select();
      }
    } else if (state.structureEdit) {
      var structureInput = root.querySelector('[data-ds-structure-row="' + state.structureEdit.rowId + '"][data-ds-structure-index="' + state.structureEdit.index + '"][data-ds-structure-field="' + state.structureEdit.field + '"]');
      if (structureInput) {
        structureInput.focus();
        structureInput.select();
      }
    } else if (activeInput) {
      var restoredInput = root.querySelector('[data-ds-input="' + activeInput + '"]');
      if (restoredInput) {
        restoredInput.focus();
        if (caret != null && restoredInput.setSelectionRange) restoredInput.setSelectionRange(caret, caret);
      }
    }
  }

  function toast(message, tone) {
    var old = document.querySelector('.ds-toast');
    if (old) old.remove();
    var box = document.createElement('div');
    box.className = 'ds-toast ' + (tone || 'success');
    box.innerHTML = '<i class="bi bi-' + (tone === 'error' ? 'x-circle-fill' : tone === 'warning' ? 'exclamation-circle-fill' : 'check-circle-fill') + '"></i><span>' + esc(message) + '</span>';
    document.body.appendChild(box);
    window.setTimeout(function () { box.classList.add('show'); }, 10);
    window.setTimeout(function () { if (box.parentNode) box.remove(); }, 2600);
  }

  function resetListPage() {
    state.page = 1;
    state.selectedRows.clear();
  }

  function openSourceForm(source) {
    state.formDraft = source ? clone(source) : {
      id: '', businessLayerId: state.selection.kind === 'layer' ? state.selection.id : '',
      name: '', alias: '', dbType: '', mode: 'new', linkType: 'internal', code: '', database: '', url: '', account: '', password: '', bigDataAccount: '', schemas: [], params: []
    };
    if (!state.formDraft.params) state.formDraft.params = [];
    if (!state.formDraft.linkType) state.formDraft.linkType = 'internal';
    if (!Array.isArray(state.formDraft.schemas)) state.formDraft.schemas = state.formDraft.schema ? String(state.formDraft.schema).split(',').filter(Boolean) : [];
    state.view = 'form';
    state.formPicker = '';
    state.formPickerKeyword = '';
    state.formPickerExpanded = new Set(state.layers.filter(function (layer) { return !layer.parentId; }).map(function (layer) { return 'layer:' + layer.id; })
      .concat(databaseTypeGroups.map(function (group) { return 'db:' + group.name; }), ['schema:root']));
    state.connectionTested = false;
    render();
  }

  function validateSourceForm(skipSchema) {
    var draft = state.formDraft;
    if (!draft.dbType) return '请选择数据库类型';
    if (!draft.businessLayerId) return '请选择业务分层';
    if (!draft.alias.trim()) return '请输入数据源别名';
    if ((draft.mode === 'new' || (draft.id && draft.mode === 'link')) && !draft.database.trim()) return '请输入数据库名';
    if (draft.dbType && (draft.mode === 'new' || needsPlatformFields(draft.dbType)) && !draft.bigDataAccount) return '请选择大数据账号';
    if (draft.mode !== 'new' && !draft.url.trim()) return '请输入URL';
    if (!skipSchema && draft.mode === 'instance' && !draft.schemas.length) return '请选择schema';
    if (draft.database && !/^[A-Za-z][A-Za-z0-9_]*$/.test(draft.database)) return '数据库名必须以字母开头，只能包含英文、数字和下划线';
    return '';
  }

  function saveSource(openRegistration) {
    var error = validateSourceForm();
    if (error) return toast(error, 'warning');
    var draft = state.formDraft;
    draft.schema = draft.schemas.join(',');
    if (!draft.businessLayerId) draft.businessLayerId = state.layers[0] ? state.layers[0].id : '';
    if (!draft.dbType) draft.dbType = draft.url.toLowerCase().indexOf('postgres') >= 0 ? 'PostgreSQL' : 'MySQL';
    if (!draft.database) draft.database = (draft.alias || 'datasource').replace(/[^\w]/g, '_').toLowerCase();
    if (draft.id) {
      var existing = sourceById(draft.id);
      Object.assign(existing, draft);
      persist();
      state.selection = { kind: 'source', id: existing.id };
      state.selectedTreeNode = 'source:' + existing.id;
      state.view = openRegistration ? 'register' : 'list';
      state.register.selected.clear();
      render();
      if (!openRegistration) return toast('数据源信息已保存');
      return;
    }
    var id = 'SRC' + String(Date.now()).slice(-6);
    var source = Object.assign({}, draft, { id: id, name: draft.code || draft.database, autoSync: false, lastSync: '--' });
    store.sources.push(source);
    ['业务主表', '业务明细表', '状态字典表'].forEach(function (alias, index) {
      var name = source.database + (index === 0 ? '_main' : index === 1 ? '_detail' : '_status_dict');
      store.objects.push({
        id: 'T' + String(Date.now() + index), sourceId: id, name: name, alias: alias, objectType: '表',
        warehouseId: '', tableType: '其他表', description: alias + '，等待完成数仓规划',
        records: index ? 0 : 1280, database: source.database + '(' + source.alias + ')', registered: false, fields: objectFields(name)
      });
    });
    persist();
    state.selection = { kind: 'source', id: id };
    state.selectedTreeNode = 'source:' + id;
    state.openLayers.add(source.businessLayerId);
    state.view = openRegistration ? 'register' : 'list';
    state.register.selected.clear();
    render();
    if (!openRegistration) toast('数据源已添加');
  }

  function downloadBlob(fileName, content, type) {
    var blob = content instanceof Blob ? content : new Blob([content], { type: type || 'text/plain;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(function () { URL.revokeObjectURL(url); }, 0);
  }

  function exportSources(sources, prefix) {
    if (!sources.length) return toast('当前目录下没有可导出的数据源', 'warning');
    var safe = sources.map(function (source) {
      return {
        code: source.name, alias: source.alias, databaseType: source.dbType,
        businessLayer: layerName(source.businessLayerId), database: source.database,
        url: source.url, account: source.account, autoSync: source.autoSync
      };
    });
    downloadBlob((prefix || '数据源配置') + '.json', JSON.stringify(safe, null, 2), 'application/json;charset=utf-8');
    toast('已导出' + sources.length + '个数据源配置');
  }

  function exportTableRows(rows, fileName) {
    var headers = ['英文名称', '别名', '类型', '数仓分层', '表类型', '库名', '描述', '记录数'];
    var csv = '\uFEFF' + headers.join(',') + '\r\n' + rows.map(function (row) {
      return [row.name, row.alias, row.objectType, warehouseName(row.warehouseId), row.tableSubtype ? row.tableType + '-' + row.tableSubtype : row.tableType, row.database, row.description, row.records].map(function (value) {
        return '"' + String(value == null ? '' : value).replace(/"/g, '""') + '"';
      }).join(',');
    }).join('\r\n');
    downloadBlob(fileName || '数据源对象清单.csv', csv, 'text/csv;charset=utf-8');
    toast('表格数据已导出');
  }

  function openImport(kind) {
    state.modal = {
      type: 'import', kind: kind || 'source', businessLayerId: state.selection.kind === 'layer' ? state.selection.id : sourceById(state.selection.id) ? sourceById(state.selection.id).businessLayerId : '',
      layerKeyword: '', fileName: '', fileSize: 0, file: null, progress: 0
    };
    render();
  }

  function openPlan(row) {
    var rowIds = row ? [row.id] : Array.from(state.selectedRows);
    state.modal = {
      type: 'plan',
      rowIds: rowIds,
      targetLabel: '已选择' + rowIds.length + '条记录',
      warehouseId: row ? row.warehouseId : '',
      warehouseKeyword: '',
      warehouseOpen: warehouseTree.filter(function (node) { return !node.parentId; }).map(function (node) { return node.id; }),
      planPicker: '',
      tableType: row && row.tableType ? row.tableType : '',
      tableSubtype: row && row.tableSubtype ? row.tableSubtype : '',
      dataDomain: row && row.dataDomain ? row.dataDomain : '',
      domainKeyword: '',
      domainOpen: ['DOMAIN_ROOT'],
      repeatRule: 'skip'
    };
    render();
  }

  function updateRegisterRows(registered, all) {
    var source = sourceById(state.selection.id);
    if (!source) return;
    var ids = all ? store.objects.filter(function (row) { return row.sourceId === source.id; }).map(function (row) { return row.id; }) : Array.from(state.register.selected);
    if (!ids.length) return toast('请先选择需要处理的表', 'warning');
    DP.confirm('确认' + (registered ? '注册' : '取消注册') + '选择的' + ids.length + '张表？', {
      icon: registered ? 'info' : 'danger',
      onOk: function () {
        store.objects.forEach(function (row) { if (ids.indexOf(row.id) >= 0) row.registered = registered; });
        state.register.selected.clear();
        persist();
        render();
        toast(registered ? '注册状态已更新' : '已取消注册');
      }
    });
  }

  function deleteSource() {
    var source = sourceById(state.selection.id);
    if (!source) return;
    DP.confirm('确认删除数据源“' + esc(source.alias) + '”？关联的原型对象将一并移除。', {
      icon: 'danger',
      okText: '<i class="bi bi-trash"></i> 删除',
      onOk: function () {
        store.sources = store.sources.filter(function (item) { return item.id !== source.id; });
        store.objects = store.objects.filter(function (item) { return item.sourceId !== source.id; });
        state.selection = { kind: 'layer', id: source.businessLayerId };
        state.selectedTreeNode = '';
        resetListPage();
        persist();
        render();
        toast('数据源已删除');
      }
    });
  }

  function commitInline(input, cancel) {
    if (!state.inlineEdit) return;
    var row = rowById(state.inlineEdit.rowId);
    var field = state.inlineEdit.field;
    if (row && !cancel) {
      var value = input.value.trim();
      if (!value) {
        toast(field === 'alias' ? '别名不能为空' : '描述不能为空', 'warning');
        input.focus();
        return;
      }
      row[field] = value;
      persist();
      toast(field === 'alias' ? '别名已更新' : '描述已更新');
    }
    state.inlineEdit = null;
    render();
  }

  function commitStructure(input, cancel) {
    if (!state.structureEdit) return;
    var row = rowById(state.structureEdit.rowId);
    var field = row && row.fields[state.structureEdit.index];
    var key = state.structureEdit.field;
    if (field && !cancel) {
      var value = input.value.trim();
      if (!value) {
        toast(key === 'alias' ? '别名不能为空' : '描述不能为空', 'warning');
        input.focus();
        return;
      }
      field[key] = value;
      persist();
      toast(key === 'alias' ? '字段别名已更新' : '字段描述已更新');
    }
    state.structureEdit = null;
    render();
  }

  function handleAction(action, target) {
    var id = target.getAttribute('data-id') || '';
    if (action === 'switch-tab') {
      state.tab = target.getAttribute('data-tab');
      state.treeKeyword = '';
      state.selection = state.tab === 'datasource'
        ? { kind: 'layer', id: state.layers[0] ? state.layers[0].id : '' }
        : { kind: 'warehouse', id: 'WH01' };
      state.selectedTreeNode = '';
      state.view = 'list';
      state.dbTypeMenu = false;
      resetListPage();
      applyCurrentTextFilter();
      return render();
    }
    if (action === 'toggle-layer') {
      state.openLayers.has(id) ? state.openLayers.delete(id) : state.openLayers.add(id);
      return render();
    }
    if (action === 'toggle-source-tree') {
      var sourceTreeKey = target.getAttribute('data-key');
      state.openSourceTreeNodes.has(sourceTreeKey) ? state.openSourceTreeNodes.delete(sourceTreeKey) : state.openSourceTreeNodes.add(sourceTreeKey);
      return render();
    }
    if (action === 'toggle-warehouse') {
      state.openWarehouses.has(id) ? state.openWarehouses.delete(id) : state.openWarehouses.add(id);
      return render();
    }
    if (action === 'select-layer') {
      state.selection = { kind: 'layer', id: id };
      state.selectedTreeNode = '';
      state.openLayers.add(id);
      state.view = 'list';
      applyCurrentTextFilter();
      resetListPage();
      return render();
    }
    if (action === 'select-source') {
      state.selection = { kind: 'source', id: id };
      state.selectedTreeNode = target.getAttribute('data-tree-key') || 'source:' + id;
      state.view = 'list';
      state.hdfsTab = 'list';
      applyCurrentTextFilter();
      resetListPage();
      return render();
    }
    if (action === 'select-warehouse') {
      state.selection = { kind: 'warehouse', id: id };
      state.selectedTreeNode = '';
      state.view = 'list';
      applyCurrentTextFilter();
      resetListPage();
      return render();
    }
    if (action === 'toggle-db-type-menu') {
      state.dbTypeMenu = !state.dbTypeMenu;
      state.warehousePicker = false;
      state.objectTypePicker = false;
      return render();
    }
    if (action === 'choose-db-type') {
      state.dbTypeFilter = target.getAttribute('data-value') || '';
      state.dbTypeMenu = false;
      applyCurrentTextFilter();
      resetListPage();
      return render();
    }
    if (action === 'clear-db-type') {
      state.dbTypeFilter = '';
      applyCurrentTextFilter();
      resetListPage();
      return render();
    }
    if (action === 'query') {
      applyCurrentTextFilter();
      return render();
    }
    if (action === 'toggle-warehouse-picker') {
      state.warehousePicker = !state.warehousePicker;
      state.objectTypePicker = false;
      state.dbTypeMenu = false;
      return render();
    }
    if (action === 'choose-filter-warehouse' || action === 'clear-filter-warehouse') {
      state.filters.warehouseId = action === 'clear-filter-warehouse' ? '' : target.getAttribute('data-value') || '';
      state.warehousePicker = false;
      applyCurrentTextFilter();
      resetListPage();
      return render();
    }
    if (action === 'toggle-object-type-picker') {
      state.objectTypePicker = !state.objectTypePicker;
      state.warehousePicker = false;
      state.dbTypeMenu = false;
      return render();
    }
    if (action === 'choose-object-type') {
      state.filters.objectType = target.getAttribute('data-value') || '';
      state.objectTypePicker = false;
      applyCurrentTextFilter();
      resetListPage();
      return render();
    }
    if (action === 'sort') {
      var key = target.getAttribute('data-key');
      if (state.sortKey === key) state.sortDir = state.sortDir === 'asc' ? 'desc' : 'asc';
      else { state.sortKey = key; state.sortDir = 'asc'; }
      return render();
    }
    if (action === 'page') {
      state.page = Number(target.getAttribute('data-page')) || 1;
      return render();
    }
    if (action === 'add-source') return openSourceForm(null);
    if (action === 'edit-source') return openSourceForm(sourceById(state.selection.id));
    if (action === 'cancel-form') {
      state.view = 'list';
      state.formDraft = null;
      return render();
    }
    if (action === 'toggle-form-picker') {
      var kind = target.getAttribute('data-kind');
      state.formPicker = state.formPicker === kind ? '' : kind;
      state.formPickerKeyword = '';
      return render();
    }
    if (action === 'toggle-form-tree') {
      var treeKey = target.getAttribute('data-key');
      state.formPickerExpanded.has(treeKey) ? state.formPickerExpanded.delete(treeKey) : state.formPickerExpanded.add(treeKey);
      return render();
    }
    if (action === 'choose-form-picker') {
      var pickerKind = target.getAttribute('data-kind');
      var value = target.getAttribute('data-value');
      if (pickerKind === 'businessLayer') {
        state.formDraft.businessLayerId = value;
      } else {
        state.formDraft.dbType = value;
        state.formDraft.linkType = 'internal';
        state.formDraft.bigDataAccount = '';
        state.formDraft.schemas = [];
        state.connectionTested = false;
      }
      state.formPicker = '';
      return render();
    }
    if (action === 'add-param') {
      state.formDraft.params.push({ key: '', value: '' });
      return render();
    }
    if (action === 'delete-param') {
      state.formDraft.params.splice(Number(target.getAttribute('data-index')), 1);
      return render();
    }
    if (action === 'test-connection') {
      var validation = validateSourceForm(true);
      if (validation) return toast(validation, 'warning');
      state.connectionTested = true;
      render();
      return toast('连接测试成功');
    }
    if (action === 'next-form') {
      var nextError = validateSourceForm();
      if (nextError) return toast(nextError, 'warning');
      if (!state.connectionTested) return toast('请先测试连接', 'warning');
      return saveSource(true);
    }
    if (action === 'save-source') return saveSource();
    if (action === 'batch-export') return exportSources(store.sources.filter(function (source) { return currentSourceIds().indexOf(source.id) >= 0; }), '批量数据源配置');
    if (action === 'export-source') {
      var source = sourceById(state.selection.id);
      return exportSources(source ? [source] : [], source ? source.name + '-数据源配置' : '数据源配置');
    }
    if (action === 'export-table') return exportTableRows(filteredRows(), '数据源对象清单.csv');
    if (action === 'open-import') return openImport('source');
    if (action === 'close-modal') {
      state.modal = null;
      return render();
    }
    if (action === 'choose-modal-layer') {
      state.modal.businessLayerId = target.getAttribute('data-value');
      return render();
    }
    if (action === 'save-import') {
      if (!state.modal.file) return toast('请选择需要导入的文件', 'warning');
      if (state.modal.kind !== 'registration' && !state.modal.businessLayerId) return toast('请选择业务分层', 'warning');
      var registrationImport = state.modal.kind === 'registration';
      state.modal.progress = 100;
      render();
      window.setTimeout(function () {
        state.modal = null;
        render();
        toast(registrationImport ? '注册信息已导入' : '数据源配置已导入');
      }, 380);
      return;
    }
    if (action === 'download-register-template') {
      var template = '\uFEFF表英文名称,是否注册,别名,描述\r\norder_main,是,订单主表,核心订单数据';
      downloadBlob('数据源注册导入模板.xls', template, 'application/vnd.ms-excel;charset=utf-8');
      return toast('模板已下载');
    }
    if (action === 'sync-source') {
      var syncSource = sourceById(state.selection.id);
      if (!syncSource) return;
      syncSource.lastSync = '2026-09-08 10:00:00';
      persist();
      render();
      return toast('数据源同步已完成');
    }
    if (action === 'toggle-auto-sync') {
      var autoSource = sourceById(state.selection.id);
      if (!autoSource) return;
      state.modal = {
        type: 'auto-sync', sourceId: autoSource.id, autoSync: !!autoSource.autoSync,
        syncFrequency: autoSource.syncFrequency || 'daily', syncTime: autoSource.syncTime || '00:00:00',
        syncContent: autoSource.syncContent || 'registered'
      };
      return render();
    }
    if (action === 'save-auto-sync') {
      var configuredSource = sourceById(state.modal.sourceId);
      if (!configuredSource) return;
      configuredSource.autoSync = !!state.modal.autoSync;
      configuredSource.syncFrequency = state.modal.syncFrequency;
      configuredSource.syncTime = state.modal.syncTime;
      configuredSource.syncContent = state.modal.syncContent;
      persist();
      state.modal = null;
      render();
      return toast('自动同步配置已保存');
    }
    if (action === 'delete-source') return deleteSource();
    if (action === 'plan-source') return openPlan(null);
    if (action === 'plan-row') return openPlan(rowById(id));
    if (action === 'toggle-plan-picker') {
      var planPicker = target.getAttribute('data-kind');
      state.modal.planPicker = state.modal.planPicker === planPicker ? '' : planPicker;
      if (planPicker === 'warehouse') state.modal.warehouseKeyword = '';
      if (planPicker === 'domain') state.modal.domainKeyword = '';
      return render();
    }
    if (action === 'toggle-plan-tree') {
      var planNodeId = target.getAttribute('data-id');
      var planNodeIndex = state.modal.warehouseOpen.indexOf(planNodeId);
      if (planNodeIndex >= 0) state.modal.warehouseOpen.splice(planNodeIndex, 1);
      else state.modal.warehouseOpen.push(planNodeId);
      return render();
    }
    if (action === 'toggle-plan-domain-tree') {
      var domainNodeId = target.getAttribute('data-id');
      var domainNodeIndex = state.modal.domainOpen.indexOf(domainNodeId);
      if (domainNodeIndex >= 0) state.modal.domainOpen.splice(domainNodeIndex, 1);
      else state.modal.domainOpen.push(domainNodeId);
      return render();
    }
    if (action === 'choose-plan-warehouse') {
      state.modal.warehouseId = target.getAttribute('data-value');
      state.modal.planPicker = '';
      return render();
    }
    if (action === 'choose-plan-domain') {
      state.modal.dataDomain = target.getAttribute('data-value');
      state.modal.planPicker = '';
      return render();
    }
    if (action === 'save-plan') {
      if (!state.modal.rowIds.length) return toast('请先选择需要规划的记录', 'warning');
      if (!state.modal.warehouseId) return toast('请选择数仓分层', 'warning');
      if (!state.modal.tableType) return toast('请选择表类型', 'warning');
      if ((tableSubtypeMap[state.modal.tableType] || []).length && !state.modal.tableSubtype) return toast('请选择二级表类型', 'warning');
      if (!state.modal.dataDomain) return toast('请选择数据域', 'warning');
      var plan = clone(state.modal);
      store.objects.forEach(function (item) {
        if (plan.rowIds.indexOf(item.id) < 0 || (item.warehouseId && plan.repeatRule === 'skip')) return;
        item.warehouseId = plan.warehouseId;
        item.tableType = plan.tableType;
        item.tableSubtype = plan.tableSubtype;
        item.dataDomain = plan.dataDomain;
      });
      persist();
      state.selectedRows.clear();
      state.modal = null;
      render();
      return toast('数仓规划已保存');
    }
    if (action === 'edit-inline') {
      state.inlineEdit = { rowId: id, field: target.getAttribute('data-field') };
      return render();
    }
    if (action === 'view-structure') {
      state.currentRowId = id;
      state.structureEdit = null;
      state.view = 'structure';
      return render();
    }
    if (action === 'edit-structure-field') {
      state.structureEdit = { rowId: id, index: Number(target.getAttribute('data-index')), field: target.getAttribute('data-field') };
      return render();
    }
    if (action === 'sync-count') {
      var countRow = rowById(id);
      if (!countRow) return;
      countRow.records = Math.max(0, Number(countRow.records || 0) + 12);
      persist();
      render();
      return toast(countRow.name + '记录数已同步');
    }
    if (action === 'preview-data') {
      state.currentRowId = id;
      state.preview = { alias: false, conditions: [{ field: '', operator: 'eq', value: '' }], page: 1, pageSize: 20 };
      state.view = 'preview';
      return render();
    }
    if (action === 'back-list') {
      state.view = 'list';
      state.currentRowId = '';
      return render();
    }
    if (action === 'add-preview-condition') {
      state.preview.conditions.push({ field: '', operator: 'eq', value: '' });
      return render();
    }
    if (action === 'remove-preview-condition') {
      state.preview.conditions.splice(Number(target.getAttribute('data-index')), 1);
      return render();
    }
    if (action === 'query-preview') {
      state.preview.page = 1;
      render();
      return toast('预览数据已按条件筛选');
    }
    if (action === 'toggle-preview-alias') {
      state.preview.alias = !state.preview.alias;
      return render();
    }
    if (action === 'open-register') {
      state.view = 'register';
      state.register.selected.clear();
      return render();
    }
    if (action === 'query-register') {
      state.register.keyword = state.register.keywordDraft.trim();
      state.register.page = 1;
      return render();
    }
    if (action === 'register-selected') return updateRegisterRows(true, false);
    if (action === 'unregister-selected') return updateRegisterRows(false, false);
    if (action === 'register-all') return updateRegisterRows(true, true);
    if (action === 'unregister-all') return updateRegisterRows(false, true);
    if (action === 'open-register-import') return openImport('registration');
    if (action === 'refresh-register') {
      render();
      return toast('注册状态已刷新');
    }
    if (action === 'switch-hdfs-tab') {
      state.hdfsTab = target.getAttribute('data-tab') || 'list';
      return render();
    }
    if (action === 'query-hdfs-transfer') return render();
    if (action === 'open-hdfs-upload') {
      state.modal = { type: 'hdfs-upload', directory: '', directoryKeyword: '', file: null, fileName: '' };
      return render();
    }
    if (action === 'choose-hdfs-directory') {
      state.modal.directory = target.getAttribute('data-value');
      return render();
    }
    if (action === 'save-hdfs-upload') {
      if (!state.modal.directory) return toast('请选择目录', 'warning');
      if (!state.modal.file) return toast('请选择文件', 'warning');
      state.modal = null;
      state.hdfsTab = 'transfer';
      render();
      return toast('文件已提交上传');
    }
  }

  function handleClick(event) {
    var actionTarget = event.target.closest('[data-ds-action]');
    if (!actionTarget || !root.contains(actionTarget)) return;
    var action = actionTarget.getAttribute('data-ds-action');
    if (action === 'close-modal' && event.target !== actionTarget && actionTarget.classList.contains('ds-modal-mask')) return;
    handleAction(action, actionTarget);
  }

  function handleInput(event) {
    var kind = event.target.getAttribute('data-ds-input');
    if (kind === 'tree-keyword') {
      state.treeKeyword = event.target.value;
      return render();
    }
    if (kind === 'db-type-keyword') {
      state.dbTypeKeyword = event.target.value;
      return render();
    }
    if (kind === 'warehouse-picker-keyword') {
      state.warehousePickerKeyword = event.target.value;
      return render();
    }
    if (kind === 'object-type-keyword') {
      state.objectTypeKeyword = event.target.value;
      return render();
    }
    if (kind === 'keyword') state.filters.keywordDraft = event.target.value;
    if (kind === 'form-picker-keyword') {
      state.formPickerKeyword = event.target.value;
      return render();
    }
    if (kind === 'modal-layer-keyword' && state.modal) {
      state.modal.layerKeyword = event.target.value;
      return render();
    }
    if (kind === 'plan-warehouse-keyword' && state.modal) {
      state.modal.warehouseKeyword = event.target.value;
      return render();
    }
    if (kind === 'plan-domain-keyword' && state.modal) {
      state.modal.domainKeyword = event.target.value;
      return render();
    }
    if (kind === 'hdfs-directory-keyword' && state.modal) {
      state.modal.directoryKeyword = event.target.value;
      return render();
    }
    if (kind === 'register-keyword') state.register.keywordDraft = event.target.value;
    var field = event.target.getAttribute('data-ds-form-field');
    if (field && state.formDraft) {
      state.formDraft[field] = event.target.value;
      if (['url', 'account', 'password'].indexOf(field) >= 0) state.connectionTested = false;
    }
    var paramIndex = event.target.getAttribute('data-ds-param-index');
    if (paramIndex != null && state.formDraft) {
      state.formDraft.params[Number(paramIndex)][event.target.getAttribute('data-ds-param-field')] = event.target.value;
      state.connectionTested = false;
    }
    var previewIndex = event.target.getAttribute('data-ds-preview-index');
    if (previewIndex != null) state.preview.conditions[Number(previewIndex)][event.target.getAttribute('data-ds-preview-field')] = event.target.value;
  }

  function handleChange(event) {
    var previewIndex = event.target.getAttribute('data-ds-preview-index');
    if (previewIndex != null) {
      state.preview.conditions[Number(previewIndex)][event.target.getAttribute('data-ds-preview-field')] = event.target.value;
      return render();
    }
    var filter = event.target.getAttribute('data-ds-filter');
    if (filter) {
      state.filters[filter] = event.target.value;
      applyCurrentTextFilter();
      resetListPage();
      return render();
    }
    if (event.target.hasAttribute('data-ds-page-size')) {
      state.pageSize = Number(event.target.value);
      state.page = 1;
      return render();
    }
    var rowCheck = event.target.getAttribute('data-ds-row-check');
    if (rowCheck) {
      event.target.checked ? state.selectedRows.add(rowCheck) : state.selectedRows.delete(rowCheck);
      return;
    }
    if (event.target.hasAttribute('data-ds-check-all')) {
      var rows = filteredRows().slice((state.page - 1) * state.pageSize, state.page * state.pageSize);
      rows.forEach(function (row) { event.target.checked ? state.selectedRows.add(row.id) : state.selectedRows.delete(row.id); });
      return render();
    }
    if (event.target.getAttribute('data-ds-form-field') === 'mode' && state.formDraft) {
      state.formDraft.mode = event.target.value;
      state.formDraft.dbType = '';
      state.formDraft.linkType = 'internal';
      state.formDraft.bigDataAccount = '';
      state.formDraft.schemas = [];
      state.formPicker = '';
      state.connectionTested = false;
      return render();
    }
    var schemaOption = event.target.getAttribute('data-ds-schema-option');
    if (schemaOption && state.formDraft) {
      if (event.target.checked && state.formDraft.schemas.indexOf(schemaOption) < 0) state.formDraft.schemas.push(schemaOption);
      if (!event.target.checked) state.formDraft.schemas = state.formDraft.schemas.filter(function (item) { return item !== schemaOption; });
      var schemaField = event.target.closest('.ds-form-picker-field');
      var schemaTrigger = schemaField ? schemaField.querySelector('.ds-form-picker-trigger') : null;
      if (schemaTrigger) {
        schemaTrigger.classList.toggle('has-value', state.formDraft.schemas.length > 0);
        var schemaText = schemaTrigger.querySelector('span');
        if (schemaText) schemaText.textContent = state.formDraft.schemas.length ? state.formDraft.schemas.join('、') : '请选择';
      }
      return;
    }
    var formSelectField = event.target.getAttribute('data-ds-form-field');
    if (formSelectField && state.formDraft) {
      state.formDraft[formSelectField] = event.target.value;
      if (formSelectField === 'linkType' || formSelectField === 'bigDataAccount') state.connectionTested = false;
      return render();
    }
    if (event.target.hasAttribute('data-ds-file') && state.modal) {
      var file = event.target.files && event.target.files[0];
      if (!file) return;
      var registration = state.modal.kind === 'registration';
      var validExtension = registration ? /\.(xls|xlsx)$/i.test(file.name) : /\.json$/i.test(file.name);
      if (!validExtension) return toast('请选择' + (registration ? 'Excel' : 'JSON') + '格式文件', 'warning');
      if (file.size > 50 * 1024 * 1024) return toast('文件大小不能超过50M', 'warning');
      state.modal.file = file;
      state.modal.fileName = file.name;
      state.modal.fileSize = file.size;
      state.modal.progress = 0;
      return render();
    }
    if (event.target.hasAttribute('data-ds-hdfs-file') && state.modal) {
      var hdfsFile = event.target.files && event.target.files[0];
      if (!hdfsFile) return;
      if (hdfsFile.size > 5000 * 1024 * 1024) return toast('文件大小不能超过5000MB', 'warning');
      state.modal.file = hdfsFile;
      state.modal.fileName = hdfsFile.name;
      return render();
    }
    var modalField = event.target.getAttribute('data-ds-modal-field');
    if (modalField && state.modal) {
      state.modal[modalField] = event.target.value;
      if (modalField === 'tableType') {
        state.modal.tableSubtype = '';
        return render();
      }
      return;
    }
    var modalToggle = event.target.getAttribute('data-ds-modal-toggle');
    if (modalToggle && state.modal) {
      state.modal[modalToggle] = event.target.checked;
      return;
    }
    var hdfsFilter = event.target.getAttribute('data-ds-hdfs-filter');
    if (hdfsFilter) {
      state.hdfsTransfer[hdfsFilter] = event.target.value;
      return render();
    }
    var regCheck = event.target.getAttribute('data-ds-register-check');
    if (regCheck) {
      event.target.checked ? state.register.selected.add(regCheck) : state.register.selected.delete(regCheck);
      return;
    }
    if (event.target.hasAttribute('data-ds-register-all')) {
      var source = sourceById(state.selection.id);
      store.objects.filter(function (row) { return source && row.sourceId === source.id; }).forEach(function (row) {
        event.target.checked ? state.register.selected.add(row.id) : state.register.selected.delete(row.id);
      });
      return render();
    }
    if (event.target.getAttribute('data-ds-register-filter') === 'status') {
      state.register.status = event.target.value;
      state.register.keyword = state.register.keywordDraft.trim();
      state.register.page = 1;
      return render();
    }
  }

  function handleKeydown(event) {
    if (event.key === 'Enter' && event.target.getAttribute('data-ds-input') === 'keyword') {
      event.preventDefault();
      applyCurrentTextFilter();
      return render();
    }
    if (event.key === 'Enter' && event.target.getAttribute('data-ds-input') === 'register-keyword') {
      event.preventDefault();
      state.register.keyword = state.register.keywordDraft.trim();
      return render();
    }
    if (event.target.hasAttribute('data-ds-inline-row')) {
      if (event.key === 'Enter') {
        event.preventDefault();
        commitInline(event.target, false);
      } else if (event.key === 'Escape') {
        event.preventDefault();
        commitInline(event.target, true);
      }
    }
    if (event.target.hasAttribute('data-ds-structure-row')) {
      if (event.key === 'Enter') {
        event.preventDefault();
        commitStructure(event.target, false);
      } else if (event.key === 'Escape') {
        event.preventDefault();
        commitStructure(event.target, true);
      }
      return;
    }
    if (event.key === 'Escape') {
      state.dbTypeMenu = false;
      state.warehousePicker = false;
      state.objectTypePicker = false;
      state.formPicker = '';
      if (state.modal) state.modal = null;
      render();
    }
  }

  function handleFocusout(event) {
    if (event.target.hasAttribute('data-ds-inline-row')) commitInline(event.target, false);
    if (event.target.hasAttribute('data-ds-structure-row')) commitStructure(event.target, false);
  }

  return {
    html: '<div class="page-datasource"></div>',
    init: function () {
      root = document.querySelector('.page-datasource');
      if (!root) return;
      store = loadStore();
      state = initialState();
      root.addEventListener('click', handleClick);
      root.addEventListener('input', handleInput);
      root.addEventListener('change', handleChange);
      root.addEventListener('keydown', handleKeydown);
      root.addEventListener('focusout', handleFocusout);
      render();
    }
  };
})();
