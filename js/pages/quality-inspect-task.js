/**
 * 数据中台 V4.0 - 数据资产 / 数据质量 / 稽查任务
 * 静态高保真原型：稽查任务列表、自定义稽查新增/编辑、规则选择与调度联动
 */
window.DP = window.DP || {};
DP.pages = DP.pages || {};

DP.pages.qualityInspectTask = (function () {
  var pageEl = null;
  var reportGaugeChart = null;

  var state = {
    view: 'list',
    formMode: 'create',
    formKind: 'custom',
    editingId: '',
    treeKey: 'demo',
    treeKeyword: '',
    treeOpen: {
      demo: true,
      'demo-warehouse': true,
      business: true,
      'biz-core': true,
      standard: true,
      'standard-domain': true,
      'std-business': true,
      'std-warehouse': true
    },
    selectedIds: {},
    page: 1,
    pageSize: 16,
    filters: {
      status: '',
      type: '',
      keyword: '',
      targetKeyword: ''
    },
    form: null,
    modal: null,
    ruleModal: null,
    standardModal: null,
    basicFieldModal: null,
    basicParamModal: null,
    testSqlModal: null,
    reportSqlModal: null,
    reportLogModal: null,
    viewTaskId: '',
    reportRunIndex: 0,
    resultPage: 1,
    resultPageSize: 10,
    resultExecutionMode: '',
    openPicker: '',
    pickerKeyword: '',
    openParamSelect: '',
    paramKeyword: '',
    openBasicRuleSelect: '',
    basicRuleKeyword: '',
    schedulePopup: '',
    basicTimePopup: '',
    sql: {
      template: { theme: 'dark', font: '14px', searchOpen: false },
      generated: { theme: 'dark', font: '14px', searchOpen: false },
      customRule: { theme: 'dark', font: '14px', searchOpen: false },
      basicCustom: { theme: 'dark', font: '14px', searchOpen: false },
      reportSql: { theme: 'dark', font: '14px', searchOpen: false }
    }
  };

  var statuses = ['运行中', '已停止', '执行中', '异常'];
  var taskTypes = ['自定义稽查', '基础稽查', '标准稽查'];
  var scheduleTypes = [
    { value: 'hourly', label: '每小时' },
    { value: 'daily', label: '每天' },
    { value: 'weekly', label: '每周' },
    { value: 'monthly', label: '每月' },
    { value: 'once', label: '执行一次' }
  ];
  var weekOptions = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
  var dayOptions = [
    '1号', '2号', '3号', '4号', '5号', '6号', '7号', '8号',
    '9号', '10号', '11号', '12号', '13号', '14号', '15号', '16号',
    '17号', '18号', '19号', '20号', '21号', '22号', '23号', '24号',
    '25号', '26号', '27号', '28号', '29号', '30号', '31号', '最后一天'
  ];
  var tableOptions = ['buildinglog', 'ods_workorder_ticket', 'dwd_order_detail_di', 'crm_member_base', 'fin_settlement_bill', 'api_access_log'];
  var inspectTableAliases = {
    buildinglog: '楼宇日志表',
    crm_member_base: '会员基础表',
    express_task_collect: '快递采集任务表',
    dwd_order_detail_di: '订单明细表',
    dim_order_status: '订单状态维表',
    crm_customer_identity: '客户证件信息表',
    ods_workorder_ticket: '工单票据贴源表',
    hr_attendance_record: '考勤打卡记录表',
    hr_employee_org: '员工组织关系表',
    fin_payment_record: '支付记录表',
    fin_settlement_bill: '结算账单表',
    logistics_waybill: '物流运单表',
    logistics_address_area: '物流地址区域表',
    ods_order_main: '订单主表',
    dwd_order_user_wide: '订单用户宽表',
    dws_order_daily: '订单日汇总表',
    ads_order_overview: '订单经营看板表',
    ads_member_profile_tag: '会员画像标签表',
    dim_product_sku: '商品SKU维表',
    api_access_log: '接口访问日志表',
    meta_field_security: '字段安全分级表',
    meta_model_field: '元模型字段表',
    std_common_code: '公共代码表',
    mart_campaign_effect: '营销活动效果表',
    dws_inventory_snapshot: '库存快照汇总表'
  };
  var taskDataSourceByTarget = {
    buildinglog: '业务系统/oa_mysql_db',
    crm_member_base: '业务系统/crm_sqlserver',
    express_task_collect: '数据仓库/dw_hive_ods',
    dwd_order_detail_di: '数据仓库/dw_hive_dwd',
    dim_order_status: '数据仓库/dw_hive_dwd',
    crm_customer_identity: '业务系统/crm_sqlserver',
    ods_workorder_ticket: '数据仓库/dw_hive_ods',
    hr_attendance_record: '业务系统/oa_mysql_db',
    hr_employee_org: '业务系统/oa_mysql_db',
    fin_payment_record: '业务系统/erp_oracle_db',
    fin_settlement_bill: '业务系统/erp_oracle_db',
    logistics_waybill: '业务系统/erp_oracle_db',
    logistics_address_area: '业务系统/erp_oracle_db',
    ods_order_main: '数据仓库/dw_hive_ods',
    dwd_order_user_wide: '数据仓库/dw_hive_dwd',
    dws_order_daily: '数据仓库/dw_hive_dws',
    ads_order_overview: '数据仓库/dw_hive_ads',
    ads_member_profile_tag: '数据仓库/dw_hive_ads',
    dim_product_sku: '数据仓库/dw_hive_dwd',
    api_access_log: '实时数据源/kafka_cluster_01',
    meta_field_security: '业务系统/prod_postgresql',
    meta_model_field: '业务系统/prod_postgresql',
    std_common_code: '业务系统/prod_postgresql',
    mart_campaign_effect: '数据仓库/dw_hive_dws',
    dws_inventory_snapshot: '数据仓库/dw_hive_dws',
    aierp_pro_test: '业务系统/prod_mysql_master',
    aierp_std_test: '业务系统/prod_postgresql'
  };
  var taskDataSourceByGroup = {
    demo: '数据仓库/dw_hive_ods',
    'demo-ods': '数据仓库/dw_hive_ods',
    'demo-dwd': '数据仓库/dw_hive_dwd',
    'demo-dws': '数据仓库/dw_hive_dws',
    'demo-ads': '数据仓库/dw_hive_ads',
    'demo-mart': '数据仓库/dw_hive_ads',
    business: '业务系统/prod_mysql_master',
    'biz-order': '业务系统/erp_oracle_db',
    'biz-customer': '业务系统/crm_sqlserver',
    'biz-workorder': '业务系统/oa_mysql_db',
    'biz-hr': '业务系统/oa_mysql_db',
    'biz-finance': '业务系统/erp_oracle_db',
    'biz-logistics': '业务系统/erp_oracle_db',
    standard: '业务系统/prod_postgresql',
    'standard-code': '业务系统/prod_postgresql',
    'standard-field': '业务系统/prod_postgresql',
    'standard-security': '业务系统/prod_postgresql',
    'standard-public': '业务系统/prod_postgresql'
  };
  var dataSourceDisplayByPickerKey = {
    'ds-business': '业务系统/prod_mysql_master',
    'ds-workorder': '业务系统/oa_mysql_db',
    'ds-order': '业务系统/erp_oracle_db',
    'ds-customer': '业务系统/crm_sqlserver',
    'ds-warehouse': '数据仓库/dw_hive_dwd',
    'ds-hive-prod': '数据仓库/dw_hive_ods',
    'ds-starrocks': '数据仓库/dw_hive_ads',
    'ds-standard': '业务系统/prod_postgresql'
  };
  var dataSourcePickerByDisplay = {
    '业务系统/oa_mysql_db': { key: 'ds-workorder', label: '工单系统' },
    '业务系统/erp_oracle_db': { key: 'ds-order', label: '订单系统' },
    '业务系统/crm_sqlserver': { key: 'ds-customer', label: '客户系统' },
    '业务系统/prod_mysql_master': { key: 'ds-business', label: '业务系统数据源' },
    '业务系统/prod_postgresql': { key: 'ds-standard', label: '标准管理库' },
    '数据仓库/dw_hive_ods': { key: 'ds-hive-prod', label: 'Hive 生产库' },
    '数据仓库/dw_hive_dwd': { key: 'ds-warehouse', label: '数仓数据源' },
    '数据仓库/dw_hive_dws': { key: 'ds-warehouse', label: '数仓数据源' },
    '数据仓库/dw_hive_ads': { key: 'ds-starrocks', label: 'StarRocks 集群' }
  };
  var fieldOptions = ['Id', 'Name', 'OrderNo', 'TicketNo', 'CreateTime', 'CloseTime', 'Status', 'Amount'];
  var customRuleModeOptions = [
    { value: 'existing', label: '已有规则' },
    { value: 'custom', label: '自定义' }
  ];
  var reportSummary = {
    total: 2500,
    passed: 2302,
    failed: 198,
    passRate: 92.08,
    failRate: 7.92
  };

  var taskTree = [
    {
      key: 'demo',
      label: '中电数治演示',
      icon: 'bi-layers-fill',
      iconClass: 'is-blue',
      children: [
        { key: 'demo-ods', label: 'ODS 贴源层', icon: 'bi-database-fill' },
        {
          key: 'demo-warehouse',
          label: '数仓分层稽查',
          icon: 'bi-folder-fill',
          children: [
            { key: 'demo-dwd', label: 'DWD 明细层', icon: 'bi-table' },
            { key: 'demo-dws', label: 'DWS 汇总层', icon: 'bi-table' },
            { key: 'demo-ads', label: 'ADS 应用层', icon: 'bi-window-sidebar' }
          ]
        },
        { key: 'demo-mart', label: '指标集市', icon: 'bi-grid-3x3-gap-fill' }
      ]
    },
    {
      key: 'business',
      label: '业务系统',
      icon: 'bi-hdd-network-fill',
      iconClass: 'is-system',
      children: [
        {
          key: 'biz-core',
          label: '核心业务域',
          icon: 'bi-folder-fill',
          children: [
            { key: 'biz-order', label: '订单交易系统', icon: 'bi-receipt' },
            { key: 'biz-customer', label: '客户主数据系统', icon: 'bi-people' },
            { key: 'biz-workorder', label: '工单协同系统', icon: 'bi-ui-checks' }
          ]
        },
        { key: 'biz-hr', label: '人事考勤系统', icon: 'bi-person-badge' },
        { key: 'biz-finance', label: '财务结算系统', icon: 'bi-cash-coin' },
        { key: 'biz-logistics', label: '物流运单系统', icon: 'bi-truck' }
      ]
    },
    {
      key: 'standard',
      label: '系统业务库',
      icon: 'bi-collection-fill',
      iconClass: 'is-standard',
      children: [
        {
          key: 'standard-domain',
          label: '标准稽查任务',
          icon: 'bi-folder-fill',
          children: [
            { key: 'standard-code', label: '标准代码一致性', icon: 'bi-code-square' },
            { key: 'standard-field', label: '字段命名规范', icon: 'bi-input-cursor-text' },
            { key: 'standard-security', label: '分级分类一致性', icon: 'bi-shield-lock' }
          ]
        },
        { key: 'standard-public', label: '公共质量模板', icon: 'bi-puzzle-fill' }
      ]
    }
  ];

  var dataSourceTree = [
    {
      key: 'ds-root',
      label: '数据源目录',
      icon: 'bi-collection-fill',
      iconClass: 'is-blue',
      count: 18,
      children: [
        {
          key: 'ds-business',
          label: '业务系统数据源',
          icon: 'bi-folder-fill',
          count: 9,
          children: [
            { key: 'ds-workorder', label: '工单系统', icon: 'bi-database-fill', count: 3 },
            { key: 'ds-order', label: '订单系统', icon: 'bi-database-fill', count: 4 },
            { key: 'ds-customer', label: '客户系统', icon: 'bi-database-fill', count: 2 }
          ]
        },
        {
          key: 'ds-warehouse',
          label: '数仓数据源',
          icon: 'bi-folder-fill',
          count: 6,
          children: [
            { key: 'ds-hive-prod', label: 'Hive 生产库', icon: 'bi-hdd-stack-fill', count: 3 },
            { key: 'ds-starrocks', label: 'StarRocks 集群', icon: 'bi-hdd-network-fill', count: 3 }
          ]
        },
        { key: 'ds-standard', label: '标准管理库', icon: 'bi-database-fill', count: 3 }
      ]
    }
  ];

  var ruleTree = [
    {
      key: 'rule-demo',
      label: '中电数治演示',
      icon: 'bi-layers-fill',
      iconClass: 'is-blue',
      children: [
        { key: 'rule-demo-common', label: '公共稽查规则', icon: 'bi-folder-fill' }
      ]
    },
    {
      key: 'rule-business',
      label: '业务系统',
      icon: 'bi-hdd-network-fill',
      iconClass: 'is-system',
      children: [
        { key: 'rule-workorder', label: '工单系统', icon: 'bi-ui-checks' },
        { key: 'rule-order', label: '订单交易系统', icon: 'bi-receipt' }
      ]
    }
  ];

  var ruleRows = [
    { id: 'rule-not-null', group: 'rule-business', name: '非空校验字段不能为空', desc: '非空校验（name 字段不能为空）' },
    { id: 'rule-repeat', group: 'rule-business', name: '筛选出重复的记录', desc: '校验name字段的唯一性，筛选出重复的记录' },
    { id: 'rule-length', group: 'rule-demo-common', name: '长度不能超过 10 个字符', desc: '长度不能超过 10 个字符' }
  ];

  var standardTree = [
    {
      key: 'std-business',
      label: '业务部',
      icon: 'bi-folder-fill',
      iconClass: 'is-standard',
      count: 2,
      children: [
        { key: 'std-warehouse', label: '数仓组', icon: 'bi-folder-fill', iconClass: 'is-blue', count: 1 }
      ]
    }
  ];

  var standardRows = [
    { id: 'code_id', group: 'std-business', enName: 'code_id', alias: '网格id', desc: '网格id' },
    { id: 'phone', group: 'std-warehouse', enName: 'phone', alias: '手机号码', desc: '手机号码' }
  ];

  var standardEntities = [
    { name: 'aierp_pro_test.customer.Phone', alias: 'Phone', desc: '电话' },
    { name: 'aierp_pro_test.supplier.Phone', alias: 'Phone', desc: '电话' },
    { name: 'aierp_pro_test.useremergencycontact.Telephone', alias: 'Telephone', desc: '联系电话' }
  ];

  var standardDatasourceOptions = ['aierp_pro_test', 'ods_workorder_ticket', 'crm_member_base', 'aierp_std_test'];
  var inspectModeOptions = ['全量稽查', '增量稽查'];
  var basicObjectOptions = ['字段', '表'];
  var basicParamModeOptions = ['普通设置', '自定义SQL'];
  var basicTimeFieldOptions = ['Id', 'OutboundId', 'GoodsId', 'CurrentInventory', 'OutQuantity', 'Address', 'Remark', 'CreateTime', 'CreateUserId', 'UpdateTime', 'UpdateUserId'];
  var basicDateFormatOptions = [
    'YYYY-MM-DD',
    'YYYY-MM-DD HH:mm:ss',
    'YYYY-MM-DD HH:mm',
    'YYYY/MM/DD',
    'YYYY/MM/DD HH:mm:ss',
    'YYYYMMDD',
    'YYYYMMDDHHmmss',
    'YYYY-MM',
    'YYYY',
    'HH:mm:ss',
    '时间戳(秒)',
    '时间戳(毫秒)'
  ];
  var basicOffsetUnitOptions = ['小时', '天', '周', '月'];
  var basicRuleGroups = [
    {
      id: 'system',
      label: '系统规则',
      icon: 'bi-folder-fill',
      children: [
        { id: 'length', label: '长度校验', desc: '字段值长度需在配置的最小值与最大值之间', ruleType: 'fixed' },
        { id: 'range', label: '取值范围约束', desc: '字段值必须落在规则维护的枚举或阈值范围内', ruleType: 'fixed' },
        { id: 'size', label: '大小值校验', desc: '数值型字段不得超过配置的上限或低于下限', ruleType: 'fixed' },
        { id: 'id-card', label: '身份证号校验(18位)', desc: '身份证号需满足18位长度、出生日期和校验位规则', ruleType: 'fixed' },
        { id: 'timely', label: '及时性校验', desc: '时间字段需满足业务要求的采集或入仓时效', ruleType: 'fixed' },
        { id: 'unique', label: '唯一性校验', desc: '同一业务主键在目标范围内不得重复出现', ruleType: 'fixed' },
        { id: 'phone', label: '电话号码与手机号码校验(11位)码校验', desc: '电话号码或手机号需满足11位号码格式规则', ruleType: 'fixed' },
        { id: 'not-null', label: '非空校验', desc: '字段值不能为空、空字符串或仅包含空白字符', ruleType: 'fixed' }
      ]
    },
    {
      id: 'business',
      label: '业务系统',
      icon: 'bi-layers-fill',
      children: [
        { id: 'field-not-null', label: '字段非空校验', desc: '稽查字段值不能为空，用于发现关键业务字段缺失记录', ruleType: 'fixed' }
      ]
    },
    {
      id: 'custom',
      label: '自定义稽查规则',
      icon: 'bi-code-square',
      children: [
        { id: 'custom-not-null', label: '非空校验-字段不能为空', desc: '通过自定义 SQL 检查关键字段空值记录', ruleType: 'custom' },
        { id: 'custom-repeat', label: '筛选出重复的记录', desc: '通过自定义 SQL 识别指定字段组合的重复数据', ruleType: 'custom' },
        { id: 'custom-length', label: '长度不能超过 10 个字符', desc: '通过自定义 SQL 校验编码类字段长度阈值', ruleType: 'custom' }
      ]
    }
  ];
  var basicEntities = [
    { name: 'tms_demo.express_task_collect.actual_collected_time', alias: 'actual_collected_time', ruleId: 'field-not-null' },
    { name: 'tms_demo.express_task_collect.actual_commit_time', alias: 'actual_commit_time', ruleId: 'field-not-null' },
    { name: 'tms_demo.express_task_collect.update_time', alias: 'update_time', ruleId: 'field-not-null' }
  ];
  var basicFieldTree = [
    { key: 'ads', label: 'ADS-应用层', icon: 'bi-layers-fill', type: 'layer' },
    { key: 'dwd', label: 'DWD-数据明细层', icon: 'bi-layers-fill', type: 'layer' },
    { key: 'dws', label: 'DWS-数据汇总层', icon: 'bi-layers-fill', type: 'layer' },
    {
      key: 'ods',
      label: 'ODS-贴源层',
      icon: 'bi-layers-fill',
      type: 'layer',
      children: [
        { key: 'zd-ods', label: '中电数智_ODS', icon: 'bi-database-fill', type: 'database' },
        {
          key: 'workorder-ods',
          label: '工单_ODS',
          icon: 'bi-folder-fill',
          type: 'database',
          children: [
            { key: 'dim-order-status', label: 'dim_tms_ads_trans_order_status', icon: 'bi-table', type: 'table' },
            { key: 'dim-order-stats', label: 'dim_tms_ads_trans_order_stats', icon: 'bi-table', type: 'table' },
            { key: 'dim-daily-cmp', label: 'dim_tms_daily_cmp_order_2026', icon: 'bi-table', type: 'table' },
            { key: 'dim-daily-cmp-hf', label: 'dim_tms_daily_cmp_order_hf', icon: 'bi-table', type: 'table' },
            { key: 'dim-city-stats-hf', label: 'dim_tms_dm_city_stats_hf', icon: 'bi-table', type: 'table' },
            { key: 'dim-driver-stats-hf', label: 'dim_tms_dm_driver_stats_hf', icon: 'bi-table', type: 'table' },
            { key: 'dim-driver-stats-test', label: 'dim_tms_dm_driver_stats_test', icon: 'bi-table', type: 'table' }
          ]
        }
      ]
    }
  ];
  var basicFieldRows = [
    { id: 'dt', table: 'dim_tms_ads_trans_order_status', alias: 'dt', enName: 'dt', desc: '日期分区' },
    { id: 'recent_days', table: 'dim_tms_ads_trans_order_status', alias: 'recent_days', enName: 'recent_days', desc: '最近统计天数' },
    { id: 'receive_order_count', table: 'dim_tms_ads_trans_order_status', alias: 'receive_order_count', enName: 'receive_order_count', desc: '收件订单数量' },
    { id: 'receive_order_amount', table: 'dim_tms_ads_trans_order_status', alias: 'receive_order_amount', enName: 'receive_order_amount', desc: '收件订单金额' },
    { id: 'dispatch_order_count', table: 'dim_tms_ads_trans_order_status', alias: 'dispatch_order_count', enName: 'dispatch_order_count', desc: '派件订单数量' },
    { id: 'dispatch_order_amount', table: 'dim_tms_ads_trans_order_status', alias: 'dispatch_order_amount', enName: 'dispatch_order_amount', desc: '派件订单金额' },
    { id: 'ins_dt', table: 'dim_tms_ads_trans_order_status', alias: 'ins_dt', enName: 'ins_dt', desc: '入库日期' },
    { id: 'ins_by', table: 'dim_tms_ads_trans_order_status', alias: 'ins_by', enName: 'ins_by', desc: '写入人' },
    { id: 'stats_dt', table: 'dim_tms_ads_trans_order_stats', alias: 'dt', enName: 'dt', desc: '统计日期' },
    { id: 'stats_order_count', table: 'dim_tms_ads_trans_order_stats', alias: 'order_count', enName: 'order_count', desc: '订单总量' },
    { id: 'stats_finish_rate', table: 'dim_tms_ads_trans_order_stats', alias: 'finish_rate', enName: 'finish_rate', desc: '完成率' },
    { id: 'cmp_dt', table: 'dim_tms_daily_cmp_order_2026', alias: 'dt', enName: 'dt', desc: '对账日期' },
    { id: 'cmp_order_no', table: 'dim_tms_daily_cmp_order_2026', alias: 'order_no', enName: 'order_no', desc: '订单编号' },
    { id: 'cmp_diff_amount', table: 'dim_tms_daily_cmp_order_2026', alias: 'diff_amount', enName: 'diff_amount', desc: '差异金额' },
    { id: 'city_dt', table: 'dim_tms_dm_city_stats_hf', alias: 'dt', enName: 'dt', desc: '城市统计日期' },
    { id: 'city_code', table: 'dim_tms_dm_city_stats_hf', alias: 'city_code', enName: 'city_code', desc: '城市编码' },
    { id: 'city_order_count', table: 'dim_tms_dm_city_stats_hf', alias: 'order_count', enName: 'order_count', desc: '城市订单量' }
  ];

  var taskRows = [
    task('dqit-001', '手机号码稽查', '每天 10:18:57', '运行中', 'present', '2026-05-22 10:13:46', '2026-06-23 10:18:57', 'biz-customer', '基础稽查', 'crm_member_base', 4, '校验客户手机号非空、格式、号段和重复情况。'),
    task('dqit-002', 'express_task_collect表非空校验', '每天 10:05:02', '运行中', 'present', '2026-05-22 09:59:50', '2026-06-23 10:05:02', 'demo-ods', '自定义稽查', 'express_task_collect', 5, '对快递采集任务关键字段进行非空稽查。'),
    task('dqit-003', '订单号唯一性稽查', '每天 01:20:00', '运行中', '数据治理部', '2026-06-18 09:23:12', '2026-06-23 01:20:00', 'biz-order', '自定义稽查', 'dwd_order_detail_di', 6, '检查订单明细表订单号重复记录。'),
    task('dqit-004', '订单状态标准代码稽查', '每天 02:10:00', '执行中', '数据治理部', '2026-06-16 15:42:27', '2026-06-23 02:10:00', 'standard-code', '标准稽查', 'dim_order_status', 3, '校验订单状态与标准代码值域一致性。'),
    task('dqit-005', '客户证件号格式稽查', '每天 03:35:00', '运行中', '客户运营部', '2026-06-14 11:08:36', '2026-06-23 03:35:00', 'biz-customer', '基础稽查', 'crm_customer_identity', 4, '校验证件号长度、字符规则和脱敏前格式。'),
    task('dqit-006', '工单关闭时间一致性稽查', '每小时 15 分', '运行中', '工单运营组', '2026-06-12 16:19:04', '2026-06-23 16:15:00', 'biz-workorder', '自定义稽查', 'ods_workorder_ticket', 5, '关闭时间不得早于创建时间，关闭状态必须有关闭时间。'),
    task('dqit-007', '人事考勤打卡时间稽查', '每天 07:40:00', '运行中', '人力共享中心', '2026-06-11 18:20:16', '2026-06-23 07:40:00', 'biz-hr', '基础稽查', 'hr_attendance_record', 6, '识别迟到、缺卡、重复打卡和跨日异常记录。'),
    task('dqit-008', '人员组织编码标准稽查', '每天 08:25:00', '已停止', '人力共享中心', '2026-06-10 14:05:41', '2026-06-21 08:25:00', 'standard-field', '标准稽查', 'hr_employee_org', 3, '人员组织编码需与组织主数据标准一致。'),
    task('dqit-009', '支付金额非负稽查', '每天 04:05:00', '运行中', '财务结算部', '2026-06-09 10:12:33', '2026-06-23 04:05:00', 'biz-finance', '基础稽查', 'fin_payment_record', 4, '支付金额、退款金额和优惠金额不得为负数。'),
    task('dqit-010', '结算金额精度稽查', '每周一 06:30:00', '已停止', '财务结算部', '2026-06-08 17:46:58', '2026-06-22 06:30:00', 'biz-finance', '自定义稽查', 'fin_settlement_bill', 5, '金额字段保留两位小数，识别精度异常。'),
    task('dqit-011', '运单签收时间及时性稽查', '每小时 05 分', '运行中', '物流数据组', '2026-06-07 13:28:15', '2026-06-23 16:05:00', 'biz-logistics', '自定义稽查', 'logistics_waybill', 5, '签收时间不得早于揽收时间，且不得晚于当前时间。'),
    task('dqit-012', '省市区编码一致性稽查', '每天 05:45:00', '异常', '物流数据组', '2026-06-06 09:33:27', '2026-06-23 05:45:00', 'standard-code', '标准稽查', 'logistics_address_area', 4, '校验省、市、区编码与行政区划标准层级一致。'),
    task('dqit-013', 'ODS 主键入仓非空稽查', '每天 00:30:00', '运行中', '数仓开发组', '2026-06-05 12:11:05', '2026-06-23 00:30:00', 'demo-ods', '基础稽查', 'ods_order_main', 5, '贴源层主键字段不得为空。'),
    task('dqit-014', 'DWD 明细记录重复稽查', '每天 01:05:00', '运行中', '数仓开发组', '2026-06-04 16:44:52', '2026-06-23 01:05:00', 'demo-dwd', '自定义稽查', 'dwd_order_user_wide', 6, '明细层按业务主键和数据日期识别重复记录。'),
    task('dqit-015', 'DWS 汇总口径一致性稽查', '每天 02:45:00', '运行中', '数仓开发组', '2026-06-03 12:06:33', '2026-06-23 02:45:00', 'demo-dws', '标准稽查', 'dws_order_daily', 4, '汇总指标需与指标口径和维度粒度保持一致。'),
    task('dqit-016', 'ADS 报表刷新及时性稽查', '每天 09:00:00', '执行中', '经营分析组', '2026-06-02 08:58:16', '2026-06-23 09:00:00', 'demo-ads', '自定义稽查', 'ads_order_overview', 4, '经营报表需在每日 09:00 前完成刷新。'),
    task('dqit-017', '会员画像标签取值稽查', '每天 03:15:00', '运行中', '客户运营部', '2026-05-31 15:21:09', '2026-06-23 03:15:00', 'demo-mart', '基础稽查', 'ads_member_profile_tag', 5, '检查会员标签空值、枚举和更新日期。'),
    task('dqit-018', '商品维表上下架状态稽查', '每天 01:55:00', '运行中', '商品数据组', '2026-05-30 11:47:20', '2026-06-23 01:55:00', 'demo-dwd', '基础稽查', 'dim_product_sku', 4, '商品上下架状态需与标准枚举保持一致。'),
    task('dqit-019', '接口日志响应码稽查', '每小时 30 分', '已停止', '平台运维组', '2026-05-29 19:23:44', '2026-06-20 18:30:00', 'standard-public', '自定义稽查', 'api_access_log', 3, '识别接口响应码异常峰值和空响应。'),
    task('dqit-020', '敏感字段分级分类稽查', '每天 23:30:00', '运行中', '安全管理员', '2026-05-28 10:32:26', '2026-06-22 23:30:00', 'standard-security', '标准稽查', 'meta_field_security', 6, '校验字段分级分类标签是否与安全规范一致。'),
    task('dqit-021', '字段英文命名规范稽查', '每周二 04:00:00', '运行中', '元数据管理员', '2026-05-27 09:44:18', '2026-06-23 04:00:00', 'standard-field', '标准稽查', 'meta_model_field', 4, '字段英文名需符合下划线小写命名规范。'),
    task('dqit-022', '公共代码表空值稽查', '每天 06:10:00', '运行中', '标准管理员', '2026-05-26 17:05:13', '2026-06-23 06:10:00', 'standard-code', '基础稽查', 'std_common_code', 3, '公共代码表编码、名称、状态字段不得为空。'),
    task('dqit-023', '营销活动日期范围稽查', '每天 02:25:00', '异常', '营销分析组', '2026-05-25 14:16:39', '2026-06-23 02:25:00', 'demo-mart', '自定义稽查', 'mart_campaign_effect', 4, '活动结束时间不得早于开始时间。'),
    task('dqit-024', '库存快照数量非负稽查', '每小时 45 分', '运行中', '供应链数据组', '2026-05-24 11:36:22', '2026-06-23 15:45:00', 'demo-dws', '基础稽查', 'dws_inventory_snapshot', 5, '库存数量、锁定数量和在途数量不得为负数。')
  ];

  function task(id, name, frequency, status, creator, createdAt, lastRunAt, group, type, target, ruleCount, desc, dataSource) {
    return {
      id: id,
      name: name,
      frequency: frequency,
      status: status,
      creator: creator,
      createdAt: createdAt,
      lastRunAt: lastRunAt,
      group: group,
      type: type,
      target: target,
      dataSource: dataSource || getDefaultTaskDataSource(target, group),
      ruleCount: ruleCount,
      desc: desc
    };
  }

  function getDefaultTaskDataSource(target, group) {
    return taskDataSourceByTarget[target] || taskDataSourceByGroup[group] || '数据仓库/dw_hive_ods';
  }

  function getTaskDataSource(item) {
    if (!item) return '-';
    return item.dataSource || getDefaultTaskDataSource(item.target, item.group);
  }

  function getFormDataSourceFromTask(item) {
    if (!item) return { key: 'ds-workorder', label: '工单系统' };
    var dataSource = getTaskDataSource(item);
    return dataSourcePickerByDisplay[dataSource] || { key: 'ds-hive-prod', label: 'Hive 生产库' };
  }

  function getDisplayDataSourceFromForm(target) {
    if (!state.form) return getDefaultTaskDataSource(target, '');
    return dataSourceDisplayByPickerKey[state.form.dataSourceKey] || getDefaultTaskDataSource(target, state.form.businessLayerKey);
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

  function getInspectTableAlias(target) {
    return inspectTableAliases[target] || '-';
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
    h = h.replace(/('[^']*'|`[^`]*`)/g, '<span class="dp-sql-string">$1</span>');
    h = h.replace(/(\$\{[^}]+\})/g, '<span class="dp-sql-var">$1</span>');
    h = h.replace(/\b(SET|CREATE|TABLE|WITH|SELECT|FROM|INSERT|INTO|VALUES|WHERE|AND|OR|NOT|NULL|AS|VARCHAR|INT|BIGINT|FLOAT|DOUBLE|DECIMAL|DATE|BOOLEAN|COUNT|GROUP|BY|HAVING|JOIN|LEFT|RIGHT|INNER|ON|LENGTH|IN)\b/gi,
      '<span class="dp-sql-keyword">$1</span>');
    return h;
  }

  function lineNumbers(code) {
    var total = Math.max(1, String(code || '').split('\n').length);
    var html = '';
    for (var i = 1; i <= total; i++) html += '<div>' + i + '</div>';
    return html;
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

  function treeMatches(node, keyword) {
    if (!keyword) return true;
    if (normalize(node.label).indexOf(keyword) >= 0) return true;
    return (node.children || []).some(function (child) { return treeMatches(child, keyword); });
  }

  function getTreeCount(node) {
    var keys = collectTreeKeys(node);
    return taskRows.filter(function (item) { return keys.indexOf(item.group) >= 0; }).length;
  }

  function getNodeCount(node) {
    if (typeof node.count === 'number') return node.count;
    return getTreeCount(node);
  }

  function renderTreeNodes(nodes, keyword, options) {
    options = options || {};
    return nodes.filter(function (node) {
      return treeMatches(node, keyword);
    }).map(function (node) {
      var children = node.children || [];
      var hasChildren = children.length > 0;
      var open = !!keyword || !!state.treeOpen[node.key] || !!options.forceOpen;
      var activeKey = options.activeKey || state.treeKey;
      var isActive = activeKey === node.key;
      var action = options.action || 'toggle-tree';
      var selectAction = options.selectAction || '';
      var pickerAttr = selectAction ? ' data-dqit-action="' + selectAction + '" data-key="' + escapeHtml(node.key) + '"' : ' data-dqit-tree-key="' + escapeHtml(node.key) + '"';
      return '<li class="dqit-tree-node' + (open ? ' open' : '') + '">' +
        '<div class="dqit-tree-row' + (isActive ? ' active' : '') + '">' +
          (hasChildren
            ? '<button class="dqit-tree-toggle" type="button" data-dqit-action="' + action + '" data-key="' + escapeHtml(node.key) + '" aria-label="展开或收起"><i class="bi ' + (open ? 'bi-caret-down-fill' : 'bi-caret-right-fill') + '"></i></button>'
            : '<span class="dqit-tree-toggle-placeholder"></span>') +
          '<button class="dqit-tree-select" type="button"' + pickerAttr + '>' +
            '<i class="bi ' + escapeHtml(node.icon || 'bi-folder-fill') + ' dqit-tree-icon ' + escapeHtml(node.iconClass || '') + '"></i>' +
            '<span class="dqit-tree-name">' + escapeHtml(node.label) + '</span>' +
            '<span class="dqit-tree-count">' + getNodeCount(node) + '</span>' +
          '</button>' +
        '</div>' +
        (hasChildren ? '<ul class="dqit-tree-children">' + renderTreeNodes(children, keyword, options) + '</ul>' : '') +
      '</li>';
    }).join('');
  }

  function renderTree() {
    return renderTreeNodes(taskTree, normalize(state.treeKeyword)) || '<li class="dqit-empty-tree">暂无匹配目录</li>';
  }

  function getCurrentTreeKeys() {
    return collectTreeKeys(findTreeNode(taskTree, state.treeKey));
  }

  function getFilteredRows() {
    var keys = getCurrentTreeKeys();
    var keyword = normalize(state.filters.keyword);
    var targetKeyword = normalize(state.filters.targetKeyword);
    return taskRows.filter(function (item) {
      if (keys.length && keys.indexOf(item.group) < 0) return false;
      if (state.filters.status && item.status !== state.filters.status) return false;
      if (state.filters.type && item.type !== state.filters.type) return false;
      if (keyword) {
        if (normalize(item.name).indexOf(keyword) < 0) return false;
      }
      if (targetKeyword) {
        var targetText = [item.target, getInspectTableAlias(item.target)].join(' ');
        if (normalize(targetText).indexOf(targetKeyword) < 0) return false;
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

  function getTaskById(id) {
    return taskRows.filter(function (item) { return item.id === id; })[0] || null;
  }

  function getTasksByIds(ids) {
    return ids.map(getTaskById).filter(function (item) { return !!item; });
  }

  function getViewTask() {
    return getTaskById(state.viewTaskId) || taskRows[0];
  }

  function getReportName(item) {
    if (!item) return 'employee_info表手机号码稽查';
    if (item.name.indexOf('手机号码') >= 0) return 'employee_info表手机号码稽查';
    return (item.target || 'employee_info') + '表' + item.name;
  }

  function getReportFrequency(item) {
    if (!item) return '每小时 10';
    if (item.name.indexOf('手机号码') >= 0) return '每小时 10';
    return String(item.frequency || '每小时 10 分').replace(' 分', '');
  }

  function getResultTotal() {
    return 798;
  }

  function getReportRun(index) {
    var item = getViewTask();
    var startDate = new Date(2026, 5, 24, 15, 10, 0);
    startDate.setHours(startDate.getHours() - index);
    var completeDate = new Date(startDate.getTime());
    completeDate.setMinutes(completeDate.getMinutes() + 1);
    completeDate.setSeconds(18 + (index % 7));
    return {
      index: index,
      reportName: getReportName(item),
      startAt: formatDateTime(startDate),
      endAt: formatDateTime(completeDate),
      frequency: getReportFrequency(item),
      executionMode: index % 3 === 0 ? '任务调度' : '自身调度',
      duration: '1分钟',
      status: '执行成功'
    };
  }

  function getFilteredReportRunIndexes() {
    var indexes = [];
    for (var i = 0; i < getResultTotal(); i++) {
      if (state.resultExecutionMode && getReportRun(i).executionMode !== state.resultExecutionMode) continue;
      indexes.push(i);
    }
    return indexes;
  }

  function getVisibleReportRuns() {
    var indexes = getFilteredReportRunIndexes();
    var total = indexes.length;
    var totalPages = Math.max(1, Math.ceil(total / state.resultPageSize));
    state.resultPage = Math.max(1, Math.min(totalPages, state.resultPage));
    var start = (state.resultPage - 1) * state.resultPageSize;
    var count = Math.min(state.resultPageSize, total - start);
    var rows = [];
    for (var i = 0; i < count; i++) rows.push(getReportRun(indexes[start + i]));
    return rows;
  }

  function getSelectedReportRun() {
    return getReportRun(state.reportRunIndex || 0);
  }

  function getReportSql() {
    return [
      'SELECT COUNT(1) as total_num',
      'FROM (',
      '    SELECT',
      '        *',
      '    FROM',
      '        `tms_demo`.`employee_info` a',
      ') T UNION ALL SELECT COUNT(1) as total_num',
      'FROM (SELECT * FROM (SELECT * FROM `tms_demo`.`employee_info` a) t',
      "WHERE t.`id` IS NOT NULL OR t.`id` <> '' OR t.`id` REGEXP '^[3-9][0-9]{9}$') W"
    ].join('\n');
  }

  function getExecutionLog(run) {
    var task = getViewTask();
    var flowId = 'DQ-' + String((run.index || 0) + 100238);
    return [
      '[' + run.startAt + '] INFO  QualityInspectJob - start task ' + flowId,
      '[' + run.startAt + '] INFO  TaskName - ' + getReportName(task),
      '[' + run.startAt + '] INFO  Scheduler - frequency=' + run.frequency + ', trigger=auto',
      '[' + run.startAt + '] INFO  SQLPrepare - parse rule SQL and bind datasource tms_demo.employee_info',
      '[' + run.startAt + '] INFO  ExecuteEngine - submit Spark SQL application app-20260624-' + String(1000 + (run.index || 0)),
      '[' + run.endAt + '] INFO  ExecuteEngine - query finished, scanned ' + reportSummary.total + ' rows',
      '[' + run.endAt + '] INFO  QualityResult - matched=' + reportSummary.passed + ', unmatched=' + reportSummary.failed + ', passRate=' + reportSummary.passRate.toFixed(2) + '%',
      '[' + run.endAt + '] INFO  ReportWriter - write report snapshot to quality_report.employee_info_phone',
      '[' + run.endAt + '] INFO  QualityInspectJob - task finished, status=SUCCESS, cost=' + run.duration
    ].join('\n');
  }

  function renderStatusOptions() {
    return '<option value="">运行状态</option>' + statuses.map(function (status) {
      return '<option value="' + escapeHtml(status) + '"' + (state.filters.status === status ? ' selected' : '') + '>' + escapeHtml(status) + '</option>';
    }).join('');
  }

  function renderTypeOptions() {
    return '<option value="">任务类型</option>' + taskTypes.map(function (type) {
      return '<option value="' + escapeHtml(type) + '"' + (state.filters.type === type ? ' selected' : '') + '>' + escapeHtml(type) + '</option>';
    }).join('');
  }

  function statusClass(status) {
    if (status === '运行中') return 'running';
    if (status === '执行中') return 'executing';
    if (status === '异常') return 'error';
    return 'stopped';
  }

  function renderStatus(status) {
    return '<span class="dqit-status ' + statusClass(status) + '">' + escapeHtml(status) + '</span>';
  }

  function renderTaskType(type) {
    var cls = type === '自定义稽查' ? 'custom' : (type === '基础稽查' ? 'basic' : 'standard');
    return '<span class="dqit-type-badge ' + cls + '">' + escapeHtml(type) + '</span>';
  }

  function renderToolbar() {
    return '<div class="dqit-toolbar">' +
      '<div class="dqit-toolbar-left">' +
        '<button class="btn btn-primary" type="button" data-dqit-action="entry-custom"><i class="bi bi-plus-square"></i><span>自定义稽查</span></button>' +
        '<button class="btn btn-primary" type="button" data-dqit-action="entry-basic"><i class="bi bi-clipboard-check"></i><span>基础稽查</span></button>' +
        '<button class="btn btn-primary" type="button" data-dqit-action="entry-standard"><i class="bi bi-search"></i><span>标准稽查</span></button>' +
        '<span class="dqit-toolbar-divider"></span>' +
        '<button class="btn btn-primary" type="button" data-dqit-action="start-selected"><i class="bi bi-play-fill"></i><span>启动</span></button>' +
        '<button class="btn btn-primary" type="button" data-dqit-action="stop-selected"><i class="bi bi-stop-fill"></i><span>停止</span></button>' +
        '<button class="btn btn-danger" type="button" data-dqit-action="delete-selected"><i class="bi bi-trash3"></i><span>删除</span></button>' +
      '</div>' +
      '<div class="dqit-toolbar-right">' +
        '<select class="dqit-type-select" data-dqit-filter="type" aria-label="任务类型">' + renderTypeOptions() + '</select>' +
        '<select class="dqit-status-select" data-dqit-filter="status" aria-label="运行状态">' + renderStatusOptions() + '</select>' +
        '<div class="dqit-query-box">' +
          '<label class="dqit-query-field"><span>任务名称</span><input id="dqitKeywordInput" type="text" value="' + escapeHtml(state.filters.keyword) + '" placeholder="请输入任务名称" aria-label="任务名称查询"></label>' +
          '<label class="dqit-query-field is-table"><span>稽查表</span><input id="dqitTargetInput" type="text" value="' + escapeHtml(state.filters.targetKeyword) + '" placeholder="请输入英文名/中文名" aria-label="稽查表查询"></label>' +
          '<button class="btn btn-primary" type="button" data-dqit-action="query"><i class="bi bi-search"></i><span>查询</span></button>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  function renderActionButtons(item) {
    var isRunning = item.status === '运行中' || item.status === '执行中';
    return '<div class="dqit-actions">' +
      '<button type="button" data-dqit-action="view-row" data-id="' + escapeHtml(item.id) + '"><i class="bi bi-search"></i><span>查看</span></button>' +
      (isRunning
        ? '<button type="button" data-dqit-action="stop-row" data-id="' + escapeHtml(item.id) + '"><i class="bi bi-stop-circle-fill"></i><span>停止</span></button>'
        : '<button type="button" data-dqit-action="start-row" data-id="' + escapeHtml(item.id) + '"><i class="bi bi-play-circle-fill"></i><span>启动</span></button>') +
      '<button type="button" data-dqit-action="edit-row" data-id="' + escapeHtml(item.id) + '"><i class="bi bi-pencil-square"></i><span>编辑</span></button>' +
      '<button class="danger" type="button" data-dqit-action="delete-row" data-id="' + escapeHtml(item.id) + '"><i class="bi bi-trash3"></i><span>删除</span></button>' +
    '</div>';
  }

  function renderTableRows() {
    var rows = getVisibleRows();
    if (!rows.length) {
      return '<tr class="dqit-empty-row"><td colspan="9">暂无匹配稽查任务</td></tr>';
    }
    return rows.map(function (item) {
      var targetAlias = getInspectTableAlias(item.target);
      var dataSource = getTaskDataSource(item);
      return '<tr>' +
        '<td><input type="checkbox" data-dqit-row-check="' + escapeHtml(item.id) + '"' + (state.selectedIds[item.id] ? ' checked' : '') + ' aria-label="选择稽查任务"></td>' +
        '<td title="' + escapeHtml(item.desc) + '"><a class="dqit-task-name" data-dqit-action="view-row" data-id="' + escapeHtml(item.id) + '">' + escapeHtml(item.name) + '</a></td>' +
        '<td><div class="dqit-task-target"><b title="' + escapeHtml(item.target) + '">' + escapeHtml(item.target) + '</b><span title="' + escapeHtml(targetAlias) + '">' + escapeHtml(targetAlias) + '</span></div></td>' +
        '<td><span class="dqit-data-source" title="' + escapeHtml(dataSource) + '">' + escapeHtml(dataSource) + '</span></td>' +
        '<td>' + renderTaskType(item.type) + '</td>' +
        '<td>' + escapeHtml(item.frequency) + '</td>' +
        '<td>' + renderStatus(item.status) + '</td>' +
        '<td>' + escapeHtml(item.lastRunAt) + '</td>' +
        '<td>' + renderActionButtons(item) + '</td>' +
      '</tr>';
    }).join('');
  }

  function renderTable() {
    var visible = getVisibleRows();
    var checkedCount = visible.filter(function (item) { return state.selectedIds[item.id]; }).length;
    var allChecked = visible.length > 0 && checkedCount === visible.length;
    return '<div class="dqit-table-wrap">' +
      '<table class="ds-table dqit-table">' +
        '<colgroup>' +
          '<col class="dqit-w-check"><col class="dqit-w-name"><col class="dqit-w-target"><col class="dqit-w-source"><col class="dqit-w-type"><col class="dqit-w-frequency"><col class="dqit-w-status">' +
          '<col class="dqit-w-last"><col class="dqit-w-action">' +
        '</colgroup>' +
        '<thead><tr>' +
          '<th class="col-ck"><input type="checkbox" data-dqit-check-all' + (allChecked ? ' checked' : '') + ' aria-label="全选稽查任务"></th>' +
          '<th>任务名称</th><th>稽查表</th><th>所属数据源</th><th>任务类型</th><th>频率</th><th>运行状态</th><th>最后执行时间</th><th>操作</th>' +
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
      nav += '<button type="button" data-dqit-page="' + i + '"' + (state.page === i ? ' class="active"' : '') + '>' + i + '</button>';
    }
    return '<div class="dqit-footer">' +
      '<div class="dqit-footer-left">显示第 ' + start + ' 到第 ' + end + ' 条记录，总共 ' + total + ' 条记录 每页显示 ' +
        '<select data-dqit-page-size><option value="16"' + (state.pageSize === 16 ? ' selected' : '') + '>16</option><option value="24"' + (state.pageSize === 24 ? ' selected' : '') + '>24</option></select> 条记录</div>' +
      '<div class="dqit-page-nav">' +
        '<button type="button" data-dqit-page="prev"' + (state.page <= 1 ? ' disabled' : '') + '><i class="bi bi-chevron-left"></i></button>' +
        nav +
        '<button type="button" data-dqit-page="next"' + (state.page >= totalPages ? ' disabled' : '') + '><i class="bi bi-chevron-right"></i></button>' +
      '</div>' +
    '</div>';
  }

  function renderListShell() {
    return '<aside class="dqit-left-panel">' +
      '<div class="dqit-tree-search">' +
        '<input type="text" data-dqit-tree-search placeholder="关键字搜索" aria-label="关键字搜索" value="' + escapeHtml(state.treeKeyword) + '">' +
        '<button type="button" aria-label="搜索目录"><i class="bi bi-search"></i></button>' +
      '</div>' +
      '<div class="dqit-tree-scroll"><ul class="dqit-tree" data-dqit-tree>' + renderTree() + '</ul></div>' +
    '</aside>' +
    '<section class="dqit-main-panel">' + renderToolbar() + renderTable() + renderFooter() + '</section>';
  }

  function renderResultPageNav(totalPages) {
    var current = state.resultPage;
    var pages = [1, 2, 3, 4, 5].filter(function (page) { return page <= totalPages; });
    var html = '<button type="button" data-dqit-result-page="prev"' + (current <= 1 ? ' disabled' : '') + '><i class="bi bi-chevron-left"></i></button>';
    pages.forEach(function (page) {
      html += '<button type="button" data-dqit-result-page="' + page + '"' + (current === page ? ' class="active"' : '') + '>' + page + '</button>';
    });
    if (totalPages > 6) html += '<span>...</span>';
    if (totalPages > 5) html += '<button type="button" data-dqit-result-page="' + totalPages + '"' + (current === totalPages ? ' class="active"' : '') + '>' + totalPages + '</button>';
    html += '<button type="button" data-dqit-result-page="next"' + (current >= totalPages ? ' disabled' : '') + '><i class="bi bi-chevron-right"></i></button>';
    return html;
  }

  function renderResultFilter() {
    return '<div class="dqit-result-inline-filter">' +
      '<span>执行方式</span>' +
      '<select id="dqitResultExecutionMode" aria-label="执行方式">' +
        '<option value=""' + (!state.resultExecutionMode ? ' selected' : '') + '>全部</option>' +
        '<option value="自身调度"' + (state.resultExecutionMode === '自身调度' ? ' selected' : '') + '>自身调度</option>' +
        '<option value="任务调度"' + (state.resultExecutionMode === '任务调度' ? ' selected' : '') + '>任务调度</option>' +
      '</select>' +
      '<button class="btn btn-primary" type="button" data-dqit-action="query-result-runs"><i class="bi bi-search"></i><span>查询</span></button>' +
    '</div>';
  }

  function renderResultFooter() {
    var total = getFilteredReportRunIndexes().length;
    var totalPages = Math.max(1, Math.ceil(total / state.resultPageSize));
    var start = total ? (state.resultPage - 1) * state.resultPageSize + 1 : 0;
    var end = total ? Math.min(total, state.resultPage * state.resultPageSize) : 0;
    return '<div class="dqit-result-footer">' +
      '<div>显示第 ' + start + ' 到第 ' + end + ' 条记录，总共 ' + total + ' 条记录 每页显示 ' +
        '<select data-dqit-result-page-size><option value="10"' + (state.resultPageSize === 10 ? ' selected' : '') + '>10</option><option value="20"' + (state.resultPageSize === 20 ? ' selected' : '') + '>20</option></select> 条记录</div>' +
      '<div class="dqit-page-nav">' + renderResultPageNav(totalPages) + '</div>' +
    '</div>';
  }

  function renderResultRows() {
    var rows = getVisibleReportRuns();
    if (!rows.length) {
      return '<tr class="dqit-empty-row"><td colspan="8">暂无匹配执行记录</td></tr>';
    }
    return rows.map(function (run) {
      return '<tr>' +
        '<td>' + escapeHtml(run.reportName) + '</td>' +
        '<td>' + escapeHtml(run.startAt) + '</td>' +
        '<td>' + escapeHtml(run.endAt) + '</td>' +
        '<td>' + escapeHtml(run.frequency) + '</td>' +
        '<td>' + escapeHtml(run.executionMode) + '</td>' +
        '<td>' + escapeHtml(run.duration) + '</td>' +
        '<td>' + escapeHtml(run.status) + '</td>' +
        '<td><div class="dqit-result-actions">' +
          '<button type="button" data-dqit-action="open-report-detail" data-run-index="' + run.index + '">报告</button>' +
          '<button type="button" data-dqit-action="open-report-sql" data-run-index="' + run.index + '">SQL</button>' +
          '<button type="button" data-dqit-action="open-report-log" data-run-index="' + run.index + '">执行日志</button>' +
        '</div></td>' +
      '</tr>';
    }).join('');
  }

  function renderResultListShell() {
    var item = getViewTask();
    var title = getReportName(item);
    return '<section class="dqit-form-shell dqit-result-shell">' +
      '<div class="dqit-form-head dqit-result-head">' +
        '<div class="dqit-form-title"><i class="bi bi-list"></i><span>' + escapeHtml(title) + '</span><em class="dqit-result-frequency">频次：' + escapeHtml(getReportFrequency(item)) + '</em></div>' +
        '<div class="dqit-result-head-right">' +
          renderResultFilter() +
          '<button class="btn btn-primary" type="button" data-dqit-action="back-list"><i class="bi bi-arrow-left"></i><span>返回</span></button>' +
        '</div>' +
      '</div>' +
      '<div class="dqit-result-scroll">' +
        '<div class="dqit-result-table-wrap">' +
          '<table class="ds-table dqit-result-table">' +
            '<thead><tr><th>报告名称</th><th>开始时间</th><th>完成时间</th><th>执行频次</th><th>执行方式</th><th>耗时</th><th>状态</th><th>操作</th></tr></thead>' +
            '<tbody>' + renderResultRows() + '</tbody>' +
          '</table>' +
        '</div>' +
        renderResultFooter() +
      '</div>' +
    '</section>';
  }

  function renderReportMetricTable(rows) {
    return '<table class="dqit-report-metric-table"><tbody>' + rows.map(function (row) {
      return '<tr><th>' + escapeHtml(row[0]) + '</th><td class="' + (row[2] || '') + '">' + escapeHtml(row[1]) + '</td></tr>';
    }).join('') + '</tbody></table>';
  }

  function renderReportGauge() {
    return '<div class="dqit-report-gauge-wrap">' +
      '<div id="dqitReportGauge" class="dqit-report-gauge" aria-label="符合规则比例 ' + reportSummary.passRate.toFixed(2) + '%"></div>' +
    '</div>';
  }

  function renderReportDataRows() {
    var rows = [
      ['13978529932', '71001', 'OEwxR1ELbcy', '36', '雷枫芸', '70002', '2021-10-18 11:11:13...', '0', '1980-12-18 11:11:13...', '2021-10-18 11:11:14', '2023-07-18 11:11:14'],
      ['13522143946', '71001', 'JP8I57099IRd', '72', '雷欢霄', '70003', '2022-07-18 11:11:13...', '0', '1987-08-18 10:11:13...', '2022-07-18 11:11:14', '2023-07-18 11:11:14'],
      ['13992373346', '71001', 'nWHHIl5SqYTI', '28', '孟绍功', '70003', '2021-01-18 11:11:13.9', '0', '1975-06-18 11:11:13.9', '2021-01-18 11:11:14', '2023-07-18 11:11:14'],
      ['13715678182', '71001', 'GB8B6qKXAMHj', '61', '狄可姬', '70002', '2019-11-18 11:11:13...', '0', '1987-03-18 11:11:13...', '2019-11-18 11:11:14', '2023-07-18 11:11:14'],
      ['13465112581', '71001', 'u8E0bXM7y8XY', '91', '钟馨之欣', '70004', '2018-10-18 11:11:13...', '0', '1992-05-18 11:11:13...', '2018-10-18 11:11:14', '2023-07-18 11:11:14'],
      ['13593336628', '71001', 'Dh6lUQ5CkkW1', '25', '姜亚', '70003', '2021-06-18 11:11:13.9', '0', '1990-05-18 10:11:13.9', '2021-06-18 11:11:14', '2023-07-18 11:11:14'],
      ['13655285588', '71001', 'jv49xCH7R4FB', '12', '朱波宁', '70002', '2018-07-18 11:11:13...', '0', '1977-12-18 11:11:13...', '2018-07-18 11:11:14', '2023-07-18 11:11:14'],
      ['13524263873', '71001', 'gKF4OOakTXXL', '10', '平雁蓓', '70003', '2020-12-18 11:11:13...', '0', '2002-05-18 11:11:13...', '2020-12-18 11:11:14', '2023-07-18 11:11:14'],
      ['13181483999', '71001', 'jMT6yeacGrdP', '43', '余鸾媛', '70003', '2021-10-18 11:11:13...', '0', '1976-11-18 11:11:13...', '2021-10-18 11:11:14', '2023-07-18 11:11:14'],
      ['13866663691', '71001', 'L5mr6HHUzWtv', '65', '唐昭冰', '70003', '2021-12-18 11:11:13...', '0', '1974-10-18 11:11:13...', '2021-12-18 11:11:14', '2023-07-18 11:11:14']
    ];
    return rows.map(function (row) {
      return '<tr>' + row.map(function (cell, index) {
        return '<td' + (index === 0 ? ' class="dqit-report-danger"' : '') + '>' + escapeHtml(cell) + '</td>';
      }).join('') + '</tr>';
    }).join('');
  }

  function renderReportDetailShell() {
    var run = getSelectedReportRun();
    return '<section class="dqit-form-shell dqit-report-shell">' +
      '<div class="dqit-form-head">' +
        '<div class="dqit-form-title"><i class="bi bi-list"></i><span>查看报告</span></div>' +
        '<button class="btn btn-primary" type="button" data-dqit-action="back-result-list"><i class="bi bi-arrow-left"></i><span>返回</span></button>' +
      '</div>' +
      '<div class="dqit-report-scroll">' +
        '<div class="dqit-report-top">' +
          '<section><div class="dqit-report-card-title">报告概述</div>' + renderReportGauge() + '</section>' +
          '<section><div class="dqit-report-card-title">' + escapeHtml(run.reportName) + '</div>' +
            renderReportMetricTable([
              ['开始时间', run.startAt],
              ['结束时间', run.endAt],
              ['执行耗时', run.duration, 'link'],
              ['执行标准', '有效性', 'link'],
              ['执行实体', '1个', 'link']
            ]) +
          '</section>' +
          '<section><div class="dqit-report-card-title">报告记录</div>' +
            renderReportMetricTable([
              ['总记录数', String(reportSummary.total)],
              ['符合规则记录数', String(reportSummary.passed), 'ok'],
              ['符合规则比例', reportSummary.passRate.toFixed(2) + ' %', 'ok'],
              ['不符合规则记录数', String(reportSummary.failed), 'danger'],
              ['不符合规则比例', reportSummary.failRate.toFixed(2) + ' %', 'danger']
            ]) +
          '</section>' +
        '</div>' +
        '<div class="dqit-report-data-head"><h3>不符合规则数据</h3><div class="dqit-report-filters"><span>稽查实体:</span><select><option>employee_info(employee_info)-phone</option></select><select><option>请选择</option></select><select><option>请选择</option></select><input type="text"><div class="dqit-report-tool-buttons"><button class="btn btn-primary" type="button"><i class="bi bi-search"></i><span>查询</span></button><button class="btn btn-primary" type="button"><i class="bi bi-download"></i><span>导出</span></button><button class="btn btn-outline" type="button"><i class="bi bi-grid-3x3-gap-fill"></i><span>列配置</span></button></div></div></div>' +
        '<div class="dqit-report-data-wrap"><table class="ds-table dqit-report-data-table"><thead><tr><th>phone</th><th>position_type</th><th>username</th><th>id</th><th>real_name</th><th>education</th><th>employment_date</th><th>is_deleted</th><th>birthday</th><th>create_time</th><th>update_time</th></tr></thead><tbody>' + renderReportDataRows() + '</tbody></table></div>' +
        '<div class="dqit-report-data-footer"><span>显示第 1 到第 10 条记录，总共 ' + reportSummary.failed + ' 条记录 每页显示 <select><option>10</option></select> 条记录</span><div class="dqit-page-nav"><button type="button">上一页</button><button type="button" class="active">1</button><button type="button">2</button><button type="button">3</button><button type="button">4</button><button type="button">5</button><span>...</span><button type="button">20</button><button type="button">下一页</button></div></div>' +
      '</div>' +
    '</section>';
  }

  function renderReportLogShell() {
    var run = getSelectedReportRun();
    return '<section class="dqit-form-shell dqit-result-log-shell">' +
      '<div class="dqit-form-head">' +
        '<div class="dqit-form-title"><i class="bi bi-list"></i><span>执行日志</span></div>' +
        '<button class="btn btn-primary" type="button" data-dqit-action="back-result-list"><i class="bi bi-arrow-left"></i><span>返回</span></button>' +
      '</div>' +
      '<div class="dqit-result-log-view">' +
        '<div class="dqit-result-log-header">' +
          '<div><h3>任务处理日志</h3><p title="' + escapeHtml(run.reportName) + '">' + escapeHtml(run.reportName) + ' / ' + escapeHtml(run.startAt) + '</p></div>' +
          '<dl><dt>执行状态</dt><dd>' + escapeHtml(run.status) + '</dd><dt>执行频次</dt><dd>' + escapeHtml(run.frequency) + '</dd><dt>耗时</dt><dd>' + escapeHtml(run.duration) + '</dd></dl>' +
        '</div>' +
        '<pre class="dqit-tech-log dqit-result-tech-log">' + escapeHtml(getExecutionLog(run)) + '</pre>' +
      '</div>' +
    '</section>';
  }

  function getDefaultTemplateSql() {
    return [
      'SELECT',
      '    t.${id}',
      'FROM',
      '    (SELECT',
      '        *',
      '     FROM',
      '        ${standard_rule} a) t',
      'WHERE',
      '    t.${name} IN (',
      '        SELECT',
      '            ${name}',
      '        FROM',
      '            ${standard_rule}',
      '        GROUP BY',
      '            ${name}',
      '        HAVING',
      '            COUNT(*) > 1',
      '    )'
    ].join('\n');
  }

  function getDefaultGeneratedSql(tableName, idField, nameField) {
    tableName = tableName || 'buildinglog';
    idField = idField || 'Id';
    nameField = nameField || 'Name';
    return [
      'SELECT',
      '    t.`' + idField + '`',
      'FROM',
      '    (SELECT',
      '        *',
      '     FROM',
      '        aierp_pro_test.`' + tableName + '` a) t',
      'WHERE',
      '    t.`' + nameField + '` IN (',
      '        SELECT',
      '            `' + nameField + '`',
      '        FROM',
      '            aierp_pro_test.`' + tableName + '`',
      '        GROUP BY',
      '            `' + nameField + '`',
      '        HAVING',
      '            COUNT(*) > 1',
      '    )'
    ].join('\n');
  }

  function getDefaultCustomRuleSql(tableName) {
    tableName = tableName || 'buildinglog';
    return [
      'SELECT',
      '    MIN(a.`Id`) AS sample_id,',
      '    a.`Name`,',
      '    COUNT(1) AS repeat_count',
      'FROM',
      '    aierp_pro_test.`' + tableName + '` a',
      'WHERE',
      '    a.`Name` IS NOT NULL',
      '    AND TRIM(a.`Name`) <> \'\'',
      'GROUP BY',
      '    a.`Name`',
      'HAVING',
      '    COUNT(1) > 1',
      'ORDER BY',
      '    repeat_count DESC'
    ].join('\n');
  }

  function createFormDraft(item) {
    var target = item ? item.target : 'buildinglog';
    var groupKey = item ? item.group : 'business';
    var groupNode = findTreeNode(taskTree, groupKey) || findTreeNode(taskTree, 'business');
    var formDataSource = getFormDataSourceFromTask(item);
    return {
      taskName: item ? item.name : '字段不重复校验',
      businessLayerKey: groupNode ? groupNode.key : 'business',
      businessLayer: groupNode ? groupNode.label : '业务系统',
      weight: item ? String(Math.min(100, Math.max(1, item.ruleCount * 4))) : '20',
      dataSourceKey: formDataSource.key,
      dataSource: formDataSource.label,
      ruleMode: 'existing',
      ruleId: 'rule-repeat',
      ruleName: '筛选出重复的记录',
      params: [
        { name: '${id}', attr: '字段', desc: '主键字段，用于定位重复记录', table: target || 'buildinglog', field: 'Id' },
        { name: '${name}', attr: '字段', desc: '业务名称字段，用于重复分组', table: target || 'buildinglog', field: 'Name' },
        { name: '${standard_rule}', attr: '表', desc: '参与稽查的数据表', table: target || 'buildinglog', field: '' }
      ],
      sqlTemplate: getDefaultTemplateSql(),
      sqlGenerated: getDefaultGeneratedSql(target || 'buildinglog', 'Id', 'Name'),
      sqlCustom: getDefaultCustomRuleSql(target || 'buildinglog'),
      schedule: {
        type: 'hourly',
        minute: '7',
        time: '11:55:32',
        week: '周一',
        day: '1号',
        datetime: '2026-06-24 09:18:48'
      }
    };
  }

  function cloneStandardEntities() {
    return standardEntities.map(function (entity) {
      return {
        name: entity.name,
        alias: entity.alias,
        desc: entity.desc
      };
    });
  }

  function createStandardFormDraft(item) {
    var groupKey = item ? item.group : 'demo';
    var groupNode = findTreeNode(taskTree, groupKey) || findTreeNode(taskTree, 'demo');
    return {
      taskName: item ? item.name : '手机号码稽查',
      businessLayerKey: groupNode ? groupNode.key : 'demo',
      businessLayer: groupNode ? groupNode.label : '中电数治演示',
      standardDataKey: 'phone',
      standardData: '手机号码',
      datasource: item && standardDatasourceOptions.indexOf(item.target) >= 0 ? item.target : 'aierp_pro_test',
      weight: item ? String(Math.min(100, Math.max(1, item.ruleCount * 2))) : '10',
      entities: cloneStandardEntities(),
      qualityRule: '电话号码与手机号码校验(11位)码校验',
      inspectMode: '全量稽查',
      schedule: {
        type: 'daily',
        minute: '7',
        time: '10:18:57',
        week: '周一',
        day: '1号',
        datetime: '2026-06-24 10:18:57'
      }
    };
  }

  function cloneBasicEntities() {
    return basicEntities.map(function (entity) {
      var cloned = {
        name: entity.name,
        alias: entity.alias,
        ruleId: entity.ruleId
      };
      if (entity.paramConfig) cloned.paramConfig = cloneBasicParamDraft(entity.paramConfig);
      return cloned;
    });
  }

  function getBasicRule(ruleId) {
    for (var i = 0; i < basicRuleGroups.length; i++) {
      var found = basicRuleGroups[i].children.filter(function (rule) { return rule.id === ruleId; })[0];
      if (found) return found;
    }
    return basicRuleGroups[1].children[0];
  }

  function isCustomBasicRule(rule) {
    return rule && rule.ruleType === 'custom';
  }

  function getBasicRuleTypeLabel(rule) {
    return isCustomBasicRule(rule) ? '自定义稽查' : '固定稽查';
  }

  function getBasicEntityParts(entity) {
    var name = entity && entity.name ? String(entity.name) : 'tms_demo.express_task_collect.update_time';
    var parts = name.split('.');
    var field = parts.length ? parts[parts.length - 1] : (entity && entity.alias ? entity.alias : 'UpdateTime');
    var table = parts.length >= 2 ? parts[parts.length - 2] : 'express_task_collect';
    return {
      table: table || 'express_task_collect',
      field: field || (entity && entity.alias) || 'UpdateTime'
    };
  }

  function createBasicParamDraft(entity) {
    var parts = getBasicEntityParts(entity);
    return {
      configured: false,
      ruleMode: 'existing',
      params: [
        { name: '${id}', attr: '字段', desc: '主键字段，用于定位问题记录', table: parts.table, field: 'Id' },
        { name: '${name}', attr: '字段', desc: '当前稽查字段，用于规则条件判断', table: parts.table, field: parts.field },
        { name: '${standard_rule}', attr: '表', desc: '参与稽查的数据表', table: parts.table, field: '' }
      ],
      sqlTemplate: getDefaultTemplateSql(),
      sqlGenerated: getDefaultGeneratedSql(parts.table, 'Id', parts.field),
      sqlCustom: getDefaultCustomRuleSql(parts.table)
    };
  }

  function cloneBasicParamDraft(draft) {
    draft = draft || createBasicParamDraft();
    return {
      configured: draft.configured === true,
      ruleMode: draft.ruleMode || 'existing',
      params: (draft.params || []).map(function (param) {
        return {
          name: param.name,
          attr: param.attr,
          desc: param.desc,
          table: param.table || '',
          field: param.field || ''
        };
      }),
      sqlTemplate: draft.sqlTemplate || getDefaultTemplateSql(),
      sqlGenerated: draft.sqlGenerated || getDefaultGeneratedSql(),
      sqlCustom: draft.sqlCustom || getDefaultCustomRuleSql()
    };
  }

  function createConfiguredBasicParamDraft(entity) {
    var draft = createBasicParamDraft(entity);
    var parts = getBasicEntityParts(entity);
    draft.configured = true;
    draft.params = [
      { name: '${id}', attr: '字段', desc: '主键字段，用于定位问题记录', table: parts.table, field: 'Id' },
      { name: '${name}', attr: '字段', desc: '当前稽查字段，用于规则条件判断', table: parts.table, field: parts.field },
      { name: '${standard_rule}', attr: '表', desc: '参与稽查的数据表', table: parts.table, field: '' }
    ];
    draft.sqlTemplate = getDefaultTemplateSql();
    draft.sqlGenerated = getDefaultGeneratedSql(parts.table, 'Id', parts.field);
    draft.sqlCustom = getDefaultCustomRuleSql(parts.table);
    return draft;
  }

  function isBasicParamConfigured(entity) {
    return !!(entity && entity.paramConfig && entity.paramConfig.configured === true);
  }

  function createBasicEditEntities() {
    var entities = cloneBasicEntities();
    if (entities[0]) {
      entities[0].ruleId = 'custom-not-null';
      entities[0].paramConfig = createConfiguredBasicParamDraft(entities[0]);
    }
    if (entities[1]) {
      entities[1].ruleId = 'custom-repeat';
      delete entities[1].paramConfig;
    }
    return entities;
  }

  function getActiveConfigDraft() {
    return state.basicParamModal ? state.basicParamModal.draft : state.form;
  }

  function setDraftSqlValue(draft, key, value) {
    if (!draft) return;
    if (key === 'template') draft.sqlTemplate = value;
    if (key === 'generated') draft.sqlGenerated = value;
    if (key === 'customRule') draft.sqlCustom = value;
    if (key === 'basicCustom') draft.customSql = value;
  }

  function createBasicTimeParams() {
    return {
      startField: 'UpdateTime',
      startDataType: 'datetime',
      startFormat: 'YYYY-MM-DD',
      startOffset: '1',
      startUnit: '天',
      startFixedTime: '00:00:00',
      endField: 'UpdateTime',
      endDataType: 'datetime',
      endFormat: 'YYYY-MM-DD',
      endOffset: '1',
      endUnit: '天',
      endFixedTime: '00:00:00'
    };
  }

  function getDefaultBasicCustomSql() {
    return [
      'SELECT',
      '    *',
      'FROM',
      '    aierp_pro_test.outboundorderlist',
      'WHERE',
      '    UpdateTime >= ${start_time}',
      '    AND UpdateTime < ${end_time}',
      '    AND (Address IS NULL OR Remark IS NULL OR UpdateTime IS NULL)'
    ].join('\n');
  }

  function ensureBasicFormDefaults() {
    if (!state.form) return;
    if (!state.form.inspectMode) state.form.inspectMode = '全量稽查';
    if (!state.form.paramMode) state.form.paramMode = '普通设置';
    if (!state.form.timeParams) state.form.timeParams = createBasicTimeParams();
    else {
      var defaults = createBasicTimeParams();
      Object.keys(defaults).forEach(function (key) {
        if (state.form.timeParams[key] === undefined) state.form.timeParams[key] = defaults[key];
      });
    }
    if (!state.form.customSql) state.form.customSql = getDefaultBasicCustomSql();
  }

  function createBasicFormDraft(item) {
    var groupKey = item ? item.group : 'demo';
    var groupNode = findTreeNode(taskTree, groupKey) || findTreeNode(taskTree, 'demo');
    return {
      taskName: item ? item.name : 'express_task_collect表非空校验',
      businessLayerKey: groupNode ? groupNode.key : 'demo',
      businessLayer: groupNode ? groupNode.label : '中电数治演示',
      inspectObject: '字段',
      weight: item ? String(Math.min(100, Math.max(1, item.ruleCount * 2))) : '10',
      entities: item ? createBasicEditEntities() : cloneBasicEntities(),
      inspectMode: '全量稽查',
      paramMode: '普通设置',
      timeParams: createBasicTimeParams(),
      customSql: getDefaultBasicCustomSql(),
      schedule: {
        type: 'daily',
        minute: '16',
        time: '10:05:02',
        week: '周一',
        day: '1号',
        datetime: '2026-06-24 10:05:02'
      }
    };
  }

  function renderFormRow(label, control, hint, extraClass) {
    return '<div class="dqit-form-row ' + (extraClass || '') + '">' +
      '<label>' + escapeHtml(label) + '</label>' +
      '<div class="dqit-form-control">' + control + '</div>' +
      (hint ? '<div class="dqit-form-hint">' + hint + '</div>' : '') +
    '</div>';
  }

  function renderRequiredFormRow(label, control, hint, extraClass) {
    return '<div class="dqit-form-row ' + (extraClass || '') + '">' +
      '<label><span class="dqit-required">*</span>' + escapeHtml(label) + '</label>' +
      '<div class="dqit-form-control">' + control + '</div>' +
      (hint ? '<div class="dqit-form-hint">' + hint + '</div>' : '') +
    '</div>';
  }

  function renderTreePicker(id, value, key, tree, placeholder) {
    var isOpen = state.openPicker === id;
    var keyword = isOpen ? state.pickerKeyword : '';
    var treeHtml = renderTreeNodes(tree, normalize(keyword), {
      forceOpen: true,
      activeKey: key,
      action: 'toggle-picker-tree',
      selectAction: 'choose-picker-node'
    }) || '<li class="dqit-empty-tree">暂无匹配目录</li>';
    return '<div class="dqit-picker" data-dqit-picker="' + escapeHtml(id) + '">' +
      '<button class="dqit-picker-value' + (value ? '' : ' placeholder') + '" type="button" data-dqit-action="toggle-picker" data-picker="' + escapeHtml(id) + '">' +
        '<span>' + escapeHtml(value || placeholder || '请选择') + '</span><i class="bi bi-chevron-down"></i>' +
      '</button>' +
      (isOpen ? '<div class="dqit-picker-menu">' +
        '<div class="dqit-picker-search"><i class="bi bi-search"></i><input type="text" data-dqit-picker-search data-picker="' + escapeHtml(id) + '" value="' + escapeHtml(keyword) + '" placeholder="关键字搜索"></div>' +
        '<div class="dqit-picker-tree"><ul class="dqit-tree">' + treeHtml + '</ul></div>' +
      '</div>' : '') +
    '</div>';
  }

  function renderOptions(options, value) {
    return options.map(function (option) {
      var item = typeof option === 'string' ? { value: option, label: option } : option;
      return '<option value="' + escapeHtml(item.value) + '"' + (item.value === value ? ' selected' : '') + '>' + escapeHtml(item.label) + '</option>';
    }).join('');
  }

  function renderSearchSelect(id, value, options, placeholder) {
    var isOpen = state.openParamSelect === id;
    var keyword = isOpen ? normalize(state.paramKeyword) : '';
    var items = options.filter(function (item) { return !keyword || normalize(item).indexOf(keyword) >= 0; });
    return '<div class="dqit-search-select" data-dqit-param-select="' + escapeHtml(id) + '">' +
      '<button type="button" class="dqit-search-select-value' + (value ? '' : ' placeholder') + '" data-dqit-action="toggle-param-select" data-select-id="' + escapeHtml(id) + '">' +
        '<span>' + escapeHtml(value || placeholder || '请选择') + '</span><i class="bi bi-chevron-down"></i>' +
      '</button>' +
      (isOpen ? '<div class="dqit-search-select-menu">' +
        '<div class="dqit-search-select-input"><i class="bi bi-search"></i><input type="text" data-dqit-param-search data-select-id="' + escapeHtml(id) + '" value="' + escapeHtml(state.paramKeyword) + '" placeholder="搜索"></div>' +
        '<div class="dqit-search-select-list">' +
          (items.length ? items.map(function (item) {
            return '<button type="button" data-dqit-action="choose-param-option" data-select-id="' + escapeHtml(id) + '" data-value="' + escapeHtml(item) + '"' + (item === value ? ' class="active"' : '') + '>' + escapeHtml(item) + '</button>';
          }).join('') : '<div class="dqit-search-select-empty">暂无匹配数据</div>') +
        '</div>' +
      '</div>' : '') +
    '</div>';
  }

  function renderParamRows(draft) {
    draft = draft || state.form || {};
    var params = draft.params || [];
    return params.map(function (param, index) {
      var tableId = 'param-' + index + '-table';
      var fieldId = 'param-' + index + '-field';
      return '<tr>' +
        '<td>' + escapeHtml(param.name) + '</td>' +
        '<td>' + escapeHtml(param.attr) + '</td>' +
        '<td>' + escapeHtml(param.desc || '') + '</td>' +
        '<td>' +
          '<div class="dqit-param-config-cell">' +
            '<div class="dqit-param-config-group"><span class="dqit-param-config-label">数据库表</span>' + renderSearchSelect(tableId, param.table, tableOptions, '请选择表') + '</div>' +
            (param.attr === '字段' ? '<div class="dqit-param-config-group"><span class="dqit-param-config-label">表字段</span>' + renderSearchSelect(fieldId, param.field, fieldOptions, '请选择字段') + '</div>' : '') +
          '</div>' +
        '</td>' +
      '</tr>';
    }).join('');
  }

  function renderParamConfig(draft) {
    draft = draft || state.form || {};
    var params = draft.params || [];
    return '<div class="dqit-form-section dqit-param-section">' +
      '<div class="dqit-section-label">参数配置</div>' +
      '<div class="dqit-section-main">' +
        '<table class="dqit-param-table">' +
          '<thead><tr><th>参数名</th><th>参数属性</th><th>参数说明</th><th>参数配置</th></tr></thead>' +
          '<tbody>' + renderParamRows(draft) + '</tbody>' +
        '</table>' +
        '<div class="dqit-param-footer">显示第 ' + (params.length ? 1 : 0) + ' 到第 ' + params.length + ' 条记录，总共 ' + params.length + ' 条记录</div>' +
      '</div>' +
    '</div>';
  }

  function renderSqlEditor(key, title, sql) {
    if (!state.sql[key]) state.sql[key] = { theme: 'dark', font: '14px', searchOpen: false };
    var cfg = state.sql[key];
    var isLight = cfg.theme !== 'dark';
    return '<div class="dqit-sql-card">' +
      '<div class="dp-sql-editor dqit-sql-editor ' + (isLight ? 'theme-light' : 'theme-dark') + (cfg.searchOpen ? ' search-open' : '') + '" data-dqit-sql-editor="' + escapeHtml(key) + '" aria-label="' + escapeHtml(title) + '" style="font-size:' + escapeHtml(cfg.font) + ';">' +
        '<div class="dp-sql-editor-toolbar">' +
          '<select class="dp-sql-editor-select" data-dqit-sql-theme="' + escapeHtml(key) + '"><option value="dark"' + (!isLight ? ' selected' : '') + '>暗色 - One Dark</option><option value="light"' + (isLight ? ' selected' : '') + '>亮色 - Light</option></select>' +
          '<select class="dp-sql-editor-select" data-dqit-sql-font="' + escapeHtml(key) + '"><option' + (cfg.font === '12px' ? ' selected' : '') + '>12px</option><option' + (cfg.font === '13px' ? ' selected' : '') + '>13px</option><option' + (cfg.font === '14px' ? ' selected' : '') + '>14px</option><option' + (cfg.font === '15px' ? ' selected' : '') + '>15px</option><option' + (cfg.font === '16px' ? ' selected' : '') + '>16px</option></select>' +
          '<button class="dp-sql-editor-btn" type="button" data-dqit-action="format-sql" data-sql-key="' + escapeHtml(key) + '"><i class="bi bi-sliders"></i><span>格式化</span></button>' +
          '<button class="dp-sql-editor-btn" type="button" data-dqit-action="copy-sql" data-sql-key="' + escapeHtml(key) + '"><i class="bi bi-clipboard"></i><span>复制</span></button>' +
          '<button class="dp-sql-editor-btn" type="button" data-dqit-action="toggle-sql-search" data-sql-key="' + escapeHtml(key) + '"><i class="bi bi-search"></i><span>搜索</span></button>' +
        '</div>' +
        '<div class="dp-sql-editor-searchbar">' +
          '<input class="dp-sql-editor-input" type="text" placeholder="查找...">' +
          '<button class="dp-sql-editor-btn" type="button">下一个</button>' +
          '<button class="dp-sql-editor-btn" type="button">上一个</button>' +
          '<label class="dp-sql-editor-check"><input type="checkbox"> 区分大小写</label>' +
          '<input class="dp-sql-editor-input" type="text" placeholder="替换...">' +
          '<button class="dp-sql-editor-btn" type="button">替换</button>' +
          '<span class="dp-sql-editor-close" data-dqit-action="close-sql-search" data-sql-key="' + escapeHtml(key) + '"><i class="bi bi-x"></i></span>' +
        '</div>' +
        '<div class="dp-sql-editor-wrap">' +
          '<div class="dp-sql-editor-gutter" data-dqit-sql-gutter="' + escapeHtml(key) + '">' + lineNumbers(sql) + '</div>' +
          '<div class="dp-sql-editor-content" data-dqit-sql-content="' + escapeHtml(key) + '" contenteditable="true" spellcheck="false">' + highlightSQL(sql) + '</div>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  function renderSqlSection(draft) {
    draft = draft || state.form || {};
    var isCustomRule = draft.ruleMode === 'custom';
    if (isCustomRule) {
      return '<div class="dqit-form-section dqit-sql-section dqit-sql-section-custom">' +
        '<div class="dqit-section-label">SQL规则</div>' +
        '<div class="dqit-section-main">' +
          '<div class="dqit-sql-layout dqit-sql-layout-custom">' +
            renderSqlEditor('customRule', '自定义SQL', draft.sqlCustom) +
            '<div class="dqit-sql-actions dqit-sql-actions-custom">' +
              '<button class="btn dqit-btn-warning" type="button" data-dqit-action="test-sql"><i class="bi bi-link-45deg"></i><span>测试执行</span></button>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';
    }
    return '<div class="dqit-form-section dqit-sql-section">' +
      '<div class="dqit-section-label">SQL规则</div>' +
      '<div class="dqit-section-main">' +
        '<div class="dqit-sql-layout">' +
          renderSqlEditor('template', '规则SQL', draft.sqlTemplate) +
          '<div class="dqit-sql-actions">' +
            '<button class="btn btn-primary" type="button" data-dqit-action="generate-sql"><i class="bi bi-pc-display"></i><span>生成SQL</span></button>' +
            '<button class="btn dqit-btn-warning" type="button" data-dqit-action="test-sql"><i class="bi bi-link-45deg"></i><span>测试执行</span></button>' +
          '</div>' +
          renderSqlEditor('generated', '执行SQL', draft.sqlGenerated) +
        '</div>' +
      '</div>' +
    '</div>';
  }

  function scheduleTypeLabel(type) {
    var found = scheduleTypes.filter(function (item) { return item.value === type; })[0];
    return found ? found.label : '每小时';
  }

  function renderScheduleHint() {
    var s = state.form.schedule;
    if (s.type === 'hourly') return '每小时第 ' + (s.minute || '0') + ' 分钟启动任务执行';
    if (s.type === 'daily') return '每天' + (s.time || '00:00:00') + ' 启动任务执行';
    if (s.type === 'weekly') return '每周' + (s.week || '周一') + (s.time || '00:00:00') + ' 启动任务执行';
    if (s.type === 'monthly') return '每月' + (s.day || '1号') + (s.time || '00:00:00') + ' 启动任务执行';
    return '根据设置时间，任务只执行一次';
  }

  function renderSchedulePopup(type) {
    if (!state.schedulePopup || state.schedulePopup !== type) return '';
    if (type === 'date') return renderDatePicker();
    return renderTimePicker(type);
  }

  function parseTime(value) {
    var parts = String(value || '00:00:00').split(':');
    return {
      h: parts[0] || '00',
      m: parts[1] || '00',
      s: parts[2] || '00'
    };
  }

  function renderTimeColumn(part, active, action) {
    var values = ['00', '01', '02', '03', '04', '05'];
    var actionName = action || 'pick-time-part';
    return values.map(function (value) {
      return '<button type="button" data-dqit-action="' + escapeHtml(actionName) + '" data-part="' + part + '" data-value="' + value + '"' + (value === active ? ' class="active"' : '') + '>' + value + '</button>';
    }).join('');
  }

  function renderTimePicker(type) {
    var value = type === 'date-time' ? String(state.form.schedule.datetime || '').split(' ')[1] : state.form.schedule.time;
    var time = parseTime(value);
    return '<div class="dqit-time-picker">' +
      '<div class="dqit-time-picker-head">选择时间</div>' +
      '<div class="dqit-time-picker-labels"><span>时</span><span>分</span><span>秒</span></div>' +
      '<div class="dqit-time-picker-cols">' +
        '<div>' + renderTimeColumn('h', time.h) + '</div>' +
        '<div>' + renderTimeColumn('m', time.m) + '</div>' +
        '<div>' + renderTimeColumn('s', time.s) + '</div>' +
      '</div>' +
      '<div class="dqit-picker-footer">' +
        '<button type="button" data-dqit-action="schedule-clear"><span>清空</span></button>' +
        '<button type="button" data-dqit-action="schedule-now"><span>现在</span></button>' +
        '<button type="button" data-dqit-action="schedule-ok"><span>确定</span></button>' +
      '</div>' +
    '</div>';
  }

  function renderDatePicker() {
    var days = [
      { text: '31', muted: true }, { text: '1' }, { text: '2' }, { text: '3' }, { text: '4' }, { text: '5' }, { text: '6' },
      { text: '7' }, { text: '8' }, { text: '9' }, { text: '10' }, { text: '11' }, { text: '12' }, { text: '13' },
      { text: '14' }, { text: '15' }, { text: '16' }, { text: '17' }, { text: '18' }, { text: '19' }, { text: '20' },
      { text: '21' }, { text: '22' }, { text: '23' }, { text: '24', active: true }, { text: '25' }, { text: '26' }, { text: '27' },
      { text: '28' }, { text: '29' }, { text: '30' }, { text: '1', muted: true }, { text: '2', muted: true }, { text: '3', muted: true }, { text: '4', muted: true },
      { text: '5', muted: true }, { text: '6', muted: true }, { text: '7', muted: true }, { text: '8', muted: true }, { text: '9', muted: true }, { text: '10', muted: true }, { text: '11', muted: true }
    ];
    return '<div class="dqit-date-picker">' +
      '<div class="dqit-date-head"><button type="button"><i class="bi bi-chevron-double-left"></i></button><button type="button"><i class="bi bi-chevron-left"></i></button><strong>2026年&nbsp;&nbsp;6月</strong><button type="button"><i class="bi bi-chevron-right"></i></button><button type="button"><i class="bi bi-chevron-double-right"></i></button></div>' +
      '<div class="dqit-date-week"><span>日</span><span>一</span><span>二</span><span>三</span><span>四</span><span>五</span><span>六</span></div>' +
      '<div class="dqit-date-grid">' + days.map(function (day) {
        return '<button type="button" data-dqit-action="pick-date-day" data-day="' + escapeHtml(day.text) + '" class="' + (day.muted ? 'muted ' : '') + (day.active ? 'active' : '') + '">' + escapeHtml(day.text) + '</button>';
      }).join('') + '</div>' +
      '<div class="dqit-date-footer"><span>选择时间</span><div><button type="button" data-dqit-action="schedule-clear"><span>清空</span></button><button type="button" data-dqit-action="schedule-now"><span>现在</span></button><button type="button" data-dqit-action="schedule-ok"><span>确定</span></button></div></div>' +
    '</div>';
  }

  function renderScheduleControls() {
    var s = state.form.schedule;
    var html = '<select class="dqit-schedule-type" data-dqit-schedule-field="type">' + renderOptions(scheduleTypes, s.type) + '</select>';
    if (s.type === 'hourly') {
      html += '<span class="dqit-schedule-inline">第</span><input class="dqit-schedule-number" type="number" min="0" max="59" data-dqit-schedule-field="minute" value="' + escapeHtml(s.minute) + '"><span class="dqit-schedule-inline">分</span>';
    } else if (s.type === 'daily') {
      html += '<div class="dqit-schedule-popover-wrap"><input class="dqit-schedule-input" type="text" readonly data-dqit-schedule-field="time" data-dqit-action="open-schedule-popup" data-popup="time" value="' + escapeHtml(s.time) + '">' + renderSchedulePopup('time') + '</div>';
    } else if (s.type === 'weekly') {
      html += '<select class="dqit-schedule-sub" data-dqit-schedule-field="week">' + renderOptions(weekOptions, s.week) + '</select>' +
        '<div class="dqit-schedule-popover-wrap"><input class="dqit-schedule-input compact" type="text" readonly data-dqit-schedule-field="time" data-dqit-action="open-schedule-popup" data-popup="time" value="' + escapeHtml(s.time) + '">' + renderSchedulePopup('time') + '</div>';
    } else if (s.type === 'monthly') {
      html += '<select class="dqit-schedule-sub" data-dqit-schedule-field="day">' + renderOptions(dayOptions, s.day) + '</select>' +
        '<div class="dqit-schedule-popover-wrap"><input class="dqit-schedule-input compact" type="text" readonly data-dqit-schedule-field="time" data-dqit-action="open-schedule-popup" data-popup="time" value="' + escapeHtml(s.time) + '">' + renderSchedulePopup('time') + '</div>';
    } else {
      html += '<div class="dqit-schedule-popover-wrap"><input class="dqit-schedule-input wide" type="text" readonly data-dqit-schedule-field="datetime" data-dqit-action="open-schedule-popup" data-popup="date" value="' + escapeHtml(s.datetime) + '">' + renderSchedulePopup('date') + '</div>';
    }
    return html + '<div class="dqit-schedule-hint"><i class="bi bi-info-circle-fill"></i><span>' + escapeHtml(renderScheduleHint()) + '</span></div>';
  }

  function renderScheduleSection() {
    return '<div class="dqit-form-section dqit-schedule-section">' +
      '<div class="dqit-section-label">调度配置</div>' +
      '<div class="dqit-section-main">' +
        '<div class="dqit-schedule-row">' + renderScheduleControls() + '</div>' +
      '</div>' +
    '</div>';
  }

  function renderRequiredFormSection(label, body, extraClass) {
    return '<div class="dqit-form-section ' + (extraClass || '') + '">' +
      '<div class="dqit-section-label"><span class="dqit-required">*</span>' + escapeHtml(label) + '</div>' +
      '<div class="dqit-section-main">' + body + '</div>' +
    '</div>';
  }

  function renderStandardEntitySection() {
    var rows = (state.form.entities || []).map(function (entity) {
      return '<tr>' +
        '<td>' + escapeHtml(entity.name) + '</td>' +
        '<td>' + escapeHtml(entity.alias) + '</td>' +
        '<td>' + escapeHtml(entity.desc) + '</td>' +
      '</tr>';
    }).join('');
    return renderRequiredFormSection('关联实体',
      '<table class="dqit-standard-entity-table">' +
        '<thead><tr><th>实体名称</th><th>实体别名</th><th>实体描述</th></tr></thead>' +
        '<tbody>' + rows + '</tbody>' +
      '</table>',
      'dqit-standard-entity-section'
    );
  }

  function renderStandardScheduleSection() {
    return renderRequiredFormSection('调度配置', '<div class="dqit-schedule-row">' + renderScheduleControls() + '</div>', 'dqit-schedule-section');
  }

  function renderBasicRuleTree(entityIndex) {
    var keyword = normalize(state.basicRuleKeyword);
    return basicRuleGroups.map(function (group) {
      var children = group.children.filter(function (rule) {
        return !keyword || normalize(rule.label + ' ' + rule.desc).indexOf(keyword) >= 0;
      });
      if (keyword && !children.length && normalize(group.label).indexOf(keyword) < 0) return '';
      return '<li class="dqit-basic-rule-group">' +
        '<div class="dqit-basic-rule-group-title"><i class="bi bi-chevron-down"></i><i class="bi ' + escapeHtml(group.icon) + '"></i><span>' + escapeHtml(group.label) + '</span></div>' +
        '<ul>' + children.map(function (rule) {
          var typeClass = isCustomBasicRule(rule) ? ' custom' : '';
          return '<li><button type="button" data-dqit-action="choose-basic-rule" data-index="' + entityIndex + '" data-rule-id="' + escapeHtml(rule.id) + '"><i class="bi bi-box-seam"></i><span>' + escapeHtml(rule.label) + '</span><em class="dqit-basic-rule-tag' + typeClass + '">' + escapeHtml(getBasicRuleTypeLabel(rule)) + '</em></button></li>';
        }).join('') + '</ul>' +
      '</li>';
    }).join('') || '<li class="dqit-search-select-empty">暂无匹配规则</li>';
  }

  function renderBasicRuleSelect(entity, index) {
    var selectId = 'basic-rule-' + index;
    var isOpen = state.openBasicRuleSelect === selectId;
    var rule = getBasicRule(entity.ruleId);
    return '<div class="dqit-basic-rule-select">' +
      '<button type="button" class="dqit-basic-rule-value" data-dqit-action="toggle-basic-rule-select" data-select-id="' + escapeHtml(selectId) + '">' +
        '<span>' + escapeHtml(rule.label) + '</span><i class="bi bi-caret-down-fill"></i>' +
      '</button>' +
      (isOpen ? '<div class="dqit-basic-rule-menu">' +
        '<div class="dqit-basic-rule-search"><input type="text" data-dqit-basic-rule-search value="' + escapeHtml(state.basicRuleKeyword) + '" placeholder="关键字搜索"><button type="button" data-dqit-action="query-basic-rule"><i class="bi bi-search"></i></button></div>' +
        '<ul class="dqit-basic-rule-tree">' + renderBasicRuleTree(index) + '</ul>' +
      '</div>' : '') +
    '</div>';
  }

  function renderBasicEntitySection() {
    var rows = (state.form.entities || []).map(function (entity, index) {
      var rule = getBasicRule(entity.ruleId);
      var isConfigured = isBasicParamConfigured(entity);
      var actionHtml = isCustomBasicRule(rule)
        ? '<button class="dqit-basic-param-btn' + (isConfigured ? ' configured' : ' unconfigured') + '" type="button" data-dqit-action="open-basic-param-modal" data-index="' + index + '"><i class="bi bi-sliders"></i><span>参数配置</span><em>' + (isConfigured ? '已配置' : '未配置') + '</em></button>'
        : '';
      return '<tr>' +
        '<td>' + escapeHtml(entity.name) + '</td>' +
        '<td>' + escapeHtml(entity.alias) + '</td>' +
        '<td class="dqit-basic-rule-cell">' + renderBasicRuleSelect(entity, index) + '</td>' +
        '<td>' + escapeHtml(rule.desc || '') + '</td>' +
        '<td><div class="dqit-basic-actions">' + actionHtml + '<button class="dqit-basic-delete-btn" type="button" data-dqit-action="delete-basic-entity" data-index="' + index + '" aria-label="删除稽查字段"><i class="bi bi-trash"></i></button></div></td>' +
      '</tr>';
    }).join('');
    return renderRequiredFormSection('稽查实体',
      '<div class="dqit-basic-entity-toolbar"><button class="btn btn-primary" type="button" data-dqit-action="add-basic-entity"><i class="bi bi-plus-lg"></i><span>添加 稽查字段</span></button></div>' +
      '<table class="dqit-basic-entity-table">' +
        '<thead><tr><th>实体名称</th><th>对象别名</th><th>质量规则</th><th>规则描述</th><th>操作</th></tr></thead>' +
        '<tbody>' + rows + '</tbody>' +
      '</table>',
      'dqit-basic-entity-section'
    );
  }

  function renderBasicTimePicker(fieldKey) {
    if (!state.basicTimePopup || state.basicTimePopup !== fieldKey) return '';
    var value = (state.form.timeParams && state.form.timeParams[fieldKey]) || '00:00:00';
    var time = parseTime(value);
    return '<div class="dqit-time-picker dqit-basic-time-picker">' +
      '<div class="dqit-time-picker-head">选择时间</div>' +
      '<div class="dqit-time-picker-labels"><span>时</span><span>分</span><span>秒</span></div>' +
      '<div class="dqit-time-picker-cols">' +
        '<div>' + renderTimeColumn('h', time.h, 'pick-basic-time-part') + '</div>' +
        '<div>' + renderTimeColumn('m', time.m, 'pick-basic-time-part') + '</div>' +
        '<div>' + renderTimeColumn('s', time.s, 'pick-basic-time-part') + '</div>' +
      '</div>' +
      '<div class="dqit-picker-footer">' +
        '<button type="button" data-dqit-action="basic-time-clear"><span>清空</span></button>' +
        '<button type="button" data-dqit-action="basic-time-now"><span>现在</span></button>' +
        '<button type="button" data-dqit-action="basic-time-ok"><span>确定</span></button>' +
      '</div>' +
    '</div>';
  }

  function renderBasicTimeParamRow(prefix, label) {
    var params = state.form.timeParams || createBasicTimeParams();
    var fieldKey = prefix + 'Field';
    var typeKey = prefix + 'DataType';
    var formatKey = prefix + 'Format';
    var offsetKey = prefix + 'Offset';
    var unitKey = prefix + 'Unit';
    var fixedKey = prefix + 'FixedTime';
    return renderRequiredFormSection(label,
      '<div class="dqit-basic-time-row">' +
        '<select class="dqit-basic-time-field" data-dqit-basic-time-param="' + fieldKey + '">' + renderOptions(basicTimeFieldOptions, params[fieldKey]) + '</select>' +
        '<span class="dqit-basic-time-text">数据类型</span>' +
        '<input class="dqit-basic-time-input dqit-basic-time-type" type="text" data-dqit-basic-time-param="' + typeKey + '" value="' + escapeHtml(params[typeKey]) + '">' +
        '<span class="dqit-basic-time-text">数据格式</span>' +
        '<select class="dqit-basic-time-format" data-dqit-basic-time-param="' + formatKey + '">' + renderOptions(basicDateFormatOptions, params[formatKey]) + '</select>' +
        '<span class="dqit-basic-time-text">偏移值</span>' +
        '<input class="dqit-basic-time-input dqit-basic-time-offset" type="number" data-dqit-basic-time-param="' + offsetKey + '" value="' + escapeHtml(params[offsetKey]) + '">' +
        '<select class="dqit-basic-time-unit" data-dqit-basic-time-param="' + unitKey + '">' + renderOptions(basicOffsetUnitOptions, params[unitKey]) + '</select>' +
        '<span class="dqit-basic-time-text">固定时间:</span>' +
        '<div class="dqit-basic-time-popover-wrap">' +
          '<input class="dqit-basic-fixed-time" type="text" readonly data-dqit-basic-time-param="' + fixedKey + '" data-dqit-action="open-basic-time-popup" data-time-field="' + fixedKey + '" value="' + escapeHtml(params[fixedKey]) + '">' +
          renderBasicTimePicker(fixedKey) +
        '</div>' +
      '</div>',
      'dqit-basic-time-section'
    );
  }

  function renderBasicCustomSqlSection() {
    var sql = state.form.customSql || getDefaultBasicCustomSql();
    return renderRequiredFormSection('自定义SQL',
      '<div class="dqit-basic-custom-sql-wrap">' + renderSqlEditor('basicCustom', '自定义SQL', sql) + '</div>',
      'dqit-basic-custom-sql-section'
    );
  }

  function renderBasicInspectModeHint(mode) {
    if (mode === '增量稽查') {
      return '<i class="bi bi-check-circle-fill"></i><span>增量稽查，稽查实体只能单张表，必须设置时间参数</span>';
    }
    return '<i class="bi bi-info-circle-fill"></i><span>全量稽查按所选稽查实体全量执行，无需配置时间参数</span>';
  }

  function renderBasicParamSection() {
    if (state.form.inspectMode !== '增量稽查') return '';
    var html = renderRequiredFormRow('参数设置',
      '<select data-dqit-basic-field="paramMode">' + renderOptions(basicParamModeOptions, state.form.paramMode) + '</select>',
      '',
      'dqit-basic-param-mode-row'
    );
    if (state.form.paramMode === '自定义SQL') return html + renderBasicCustomSqlSection();
    return html + renderBasicTimeParamRow('start', '开始时间') + renderBasicTimeParamRow('end', '结束时间');
  }

  function basicFieldTreeMatches(node, keyword) {
    if (!keyword) return true;
    if (normalize(node.label).indexOf(keyword) >= 0) return true;
    return (node.children || []).some(function (child) { return basicFieldTreeMatches(child, keyword); });
  }

  function findBasicFieldNode(nodes, key) {
    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      if (node.key === key) return node;
      var found = findBasicFieldNode(node.children || [], key);
      if (found) return found;
    }
    return null;
  }

  function collectBasicFieldTables(node) {
    if (!node) return [];
    if (node.type === 'table') return [node.label];
    return (node.children || []).reduce(function (tables, child) {
      return tables.concat(collectBasicFieldTables(child));
    }, []);
  }

  function getBasicFieldOpenMap() {
    if (!state.basicFieldModal) return {};
    if (!state.basicFieldModal.treeOpen) {
      state.basicFieldModal.treeOpen = {
        ods: true,
        'workorder-ods': true
      };
    }
    return state.basicFieldModal.treeOpen;
  }

  function renderBasicFieldTree(nodes, keyword) {
    return nodes.filter(function (node) {
      return basicFieldTreeMatches(node, keyword);
    }).map(function (node) {
      var children = node.children || [];
      var hasChildren = children.length > 0;
      var treeOpen = getBasicFieldOpenMap();
      var open = hasChildren && (!!keyword || !!treeOpen[node.key]);
      var active = state.basicFieldModal && state.basicFieldModal.treeKey === node.key;
      return '<li class="dqit-basic-field-node ' + (open ? 'open ' : '') + escapeHtml(node.type || '') + '">' +
        '<div class="dqit-basic-field-tree-row' + (active ? ' active' : '') + '">' +
          (hasChildren ? '<button class="dqit-basic-field-toggle" type="button" data-dqit-action="toggle-basic-field-tree" data-key="' + escapeHtml(node.key) + '"><i class="bi ' + (open ? 'bi-chevron-down' : 'bi-chevron-right') + '"></i></button>' : '<span class="dqit-basic-field-toggle"></span>') +
          '<button class="dqit-basic-field-select" type="button" data-dqit-action="select-basic-field-tree" data-key="' + escapeHtml(node.key) + '"><i class="bi ' + escapeHtml(node.icon || 'bi-table') + '"></i><span>' + escapeHtml(node.label) + '</span></button>' +
        '</div>' +
        (hasChildren && open ? '<ul>' + renderBasicFieldTree(children, keyword) + '</ul>' : '') +
      '</li>';
    }).join('');
  }

  function getBasicFieldRows() {
    if (!state.basicFieldModal) return [];
    var keyword = normalize(state.basicFieldModal.keyword);
    var selectedNode = findBasicFieldNode(basicFieldTree, state.basicFieldModal.treeKey);
    var tableNames = collectBasicFieldTables(selectedNode);
    var shouldFilterByTable = !!selectedNode;
    return basicFieldRows.filter(function (item) {
      if (shouldFilterByTable && (!tableNames.length || tableNames.indexOf(item.table) < 0)) return false;
      if (keyword && normalize(item.alias + ' ' + item.enName + ' ' + item.desc).indexOf(keyword) < 0) return false;
      return true;
    });
  }

  function renderBasicFieldModal() {
    if (!state.basicFieldModal) return '';
    var rows = getBasicFieldRows();
    var selectedIds = state.basicFieldModal.selectedIds || {};
    var allChecked = rows.length && rows.every(function (row) { return selectedIds[row.id]; });
    return '<div class="dqit-modal-mask" data-dqit-modal-mask="basic-field">' +
      '<div class="dqit-basic-field-dialog" role="dialog" aria-modal="true" aria-label="添加稽查列表">' +
        '<div class="dqit-rule-head"><strong>添加 稽查列表</strong><button type="button" data-dqit-action="close-basic-field-modal" aria-label="关闭"><i class="bi bi-x-lg"></i></button></div>' +
        '<div class="dqit-basic-field-body">' +
          '<div class="dqit-basic-field-left">' +
            '<div class="dqit-basic-field-search"><input type="text" data-dqit-basic-field-tree-search value="' + escapeHtml(state.basicFieldModal.treeKeyword) + '" placeholder="关键字搜索"><button type="button" data-dqit-action="query-basic-field"><i class="bi bi-search"></i></button></div>' +
            '<div class="dqit-basic-field-tree-wrap"><ul class="dqit-basic-field-tree">' + (renderBasicFieldTree(basicFieldTree, normalize(state.basicFieldModal.treeKeyword)) || '<li class="dqit-search-select-empty">暂无匹配目录</li>') + '</ul></div>' +
          '</div>' +
          '<div class="dqit-basic-field-right">' +
            '<div class="dqit-basic-field-table-wrap">' +
              '<table class="ds-table dqit-basic-field-table"><thead><tr><th><input type="checkbox" data-dqit-action="toggle-basic-field-all" ' + (allChecked ? 'checked' : '') + '></th><th>别名</th><th>英文名称</th><th>描述</th></tr></thead><tbody>' +
                (rows.length ? rows.map(function (row) {
                  return '<tr data-dqit-action="toggle-basic-field-row" data-field-id="' + escapeHtml(row.id) + '">' +
                    '<td><input type="checkbox" ' + (selectedIds[row.id] ? 'checked ' : '') + 'aria-label="选择稽查字段"></td>' +
                    '<td title="' + escapeHtml(row.alias) + '">' + escapeHtml(row.alias) + '</td>' +
                    '<td title="' + escapeHtml(row.enName) + '">' + escapeHtml(row.enName) + '</td>' +
                    '<td title="' + escapeHtml(row.desc) + '">' + escapeHtml(row.desc) + '</td>' +
                  '</tr>';
                }).join('') : '<tr class="dqit-empty-row"><td colspan="4">暂无匹配字段</td></tr>') +
              '</tbody></table>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="dqit-rule-foot">' +
          '<button class="btn btn-primary" type="button" data-dqit-action="choose-basic-fields"><i class="bi bi-plus-lg"></i><span>添加</span></button>' +
          '<button class="btn btn-outline" type="button" data-dqit-action="close-basic-field-modal"><i class="bi bi-x-lg"></i><span>取消</span></button>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  function renderBasicParamModal() {
    if (!state.basicParamModal || !state.form) return '';
    var entity = state.form.entities && state.form.entities[state.basicParamModal.entityIndex];
    if (!entity) return '';
    var rule = getBasicRule(entity.ruleId);
    var draft = state.basicParamModal.draft || createBasicParamDraft(entity);
    return '<div class="dqit-modal-mask" data-dqit-modal-mask="basic-param">' +
      '<div class="dqit-basic-param-dialog" role="dialog" aria-modal="true" aria-label="参数配置">' +
        '<div class="dqit-rule-head"><strong>参数配置</strong><button type="button" data-dqit-action="close-basic-param-modal" aria-label="关闭"><i class="bi bi-x-lg"></i></button></div>' +
        '<div class="dqit-basic-param-body">' +
          '<div class="dqit-basic-param-summary">' +
            '<div><span>稽查实体</span><strong title="' + escapeHtml(entity.name) + '">' + escapeHtml(entity.name) + '</strong></div>' +
            '<div><span>质量规则</span><strong>' + escapeHtml(rule.label) + '</strong></div>' +
            '<div><span>规则类型</span><em>' + escapeHtml(getBasicRuleTypeLabel(rule)) + '</em></div>' +
          '</div>' +
          renderParamConfig(draft) +
          renderSqlSection(draft) +
        '</div>' +
        '<div class="dqit-rule-foot">' +
          '<button class="btn btn-primary" type="button" data-dqit-action="save-basic-param-modal"><i class="bi bi-save"></i><span>保存</span></button>' +
          '<button class="btn btn-outline" type="button" data-dqit-action="close-basic-param-modal"><i class="bi bi-x-lg"></i><span>取消</span></button>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  function renderBasicFormShell() {
    var draft = state.form || createBasicFormDraft();
    state.form = draft;
    ensureBasicFormDefaults();
    var title = state.formMode === 'edit' ? '编辑' : '基础稽查';
    return '<section class="dqit-form-shell dqit-basic-form">' +
      '<div class="dqit-form-head">' +
        '<div class="dqit-form-title"><i class="bi bi-list"></i><span>' + escapeHtml(title) + '</span></div>' +
        '<button class="btn btn-primary" type="button" data-dqit-action="back-list"><i class="bi bi-arrow-left"></i><span>返回</span></button>' +
      '</div>' +
      '<div class="dqit-form-scroll">' +
        renderRequiredFormRow('任务名称', '<input class="dqit-input" type="text" data-dqit-form-field="taskName" value="' + escapeHtml(draft.taskName) + '" placeholder="50个字符以内">', '<i class="bi bi-info-circle-fill"></i><span>50个字符以内，只允许数字，字母，中文，下划线；</span>') +
        renderRequiredFormRow('业务分层', renderTreePicker('businessLayer', draft.businessLayer, draft.businessLayerKey, taskTree, '请选择业务分层')) +
        renderRequiredFormRow('稽查对象', '<select data-dqit-basic-field="inspectObject">' + renderOptions(basicObjectOptions, draft.inspectObject) + '</select>') +
        renderRequiredFormRow('考核权重', '<input class="dqit-input" type="number" min="1" max="100" data-dqit-form-field="weight" value="' + escapeHtml(draft.weight) + '">', '<i class="bi bi-info-circle-fill"></i><span>只允许1-100数字</span>') +
        renderBasicEntitySection() +
        renderRequiredFormRow('稽查机制', '<select data-dqit-basic-field="inspectMode">' + renderOptions(inspectModeOptions, draft.inspectMode) + '</select>', renderBasicInspectModeHint(draft.inspectMode)) +
        renderBasicParamSection() +
        renderStandardScheduleSection() +
        '<div class="dqit-form-actions-bottom">' +
          '<button class="btn btn-primary" type="button" data-dqit-action="save-form"><i class="bi bi-save"></i><span>保存</span></button>' +
          '<button class="btn btn-outline" type="button" data-dqit-action="back-list"><i class="bi bi-x-lg"></i><span>取消</span></button>' +
        '</div>' +
      '</div>' +
    '</section>';
  }

  function renderFormShell() {
    var draft = state.form || createFormDraft();
    if (!draft.ruleMode) draft.ruleMode = 'existing';
    if (!draft.sqlCustom) {
      var customTable = draft.params && draft.params[0] ? draft.params[0].table : 'buildinglog';
      draft.sqlCustom = getDefaultCustomRuleSql(customTable);
    }
    state.form = draft;
    var isCustomRule = draft.ruleMode === 'custom';
    return '<section class="dqit-form-shell">' +
      '<div class="dqit-form-head">' +
        '<div class="dqit-form-title"><i class="bi bi-list"></i><span>自定义稽查</span></div>' +
        '<button class="btn btn-primary" type="button" data-dqit-action="back-list"><i class="bi bi-arrow-left"></i><span>返回</span></button>' +
      '</div>' +
      '<div class="dqit-form-scroll">' +
        renderFormRow('任务名称', '<input class="dqit-input" type="text" data-dqit-form-field="taskName" value="' + escapeHtml(draft.taskName) + '" placeholder="50个字符以内">', '<i class="bi bi-info-circle-fill"></i><span>50个字符以内；</span>') +
        renderFormRow('业务分层', renderTreePicker('businessLayer', draft.businessLayer, draft.businessLayerKey, taskTree, '请选择业务分层')) +
        renderFormRow('考核权重', '<input class="dqit-input" type="number" min="1" max="100" data-dqit-form-field="weight" value="' + escapeHtml(draft.weight) + '">', '<i class="bi bi-info-circle-fill"></i><span>1-100数字</span>') +
        renderFormRow('数据源', renderTreePicker('dataSource', draft.dataSource, draft.dataSourceKey, dataSourceTree, '请选择数据源')) +
        renderFormRow('规则选择', '<select data-dqit-custom-field="ruleMode">' + renderOptions(customRuleModeOptions, draft.ruleMode) + '</select>') +
        (isCustomRule ? '' : renderFormRow('稽查规则', '<div class="dqit-rule-field"><input class="dqit-input" type="text" readonly value="' + escapeHtml(draft.ruleName) + '"><button class="btn btn-primary" type="button" data-dqit-action="open-rule-modal"><i class="bi bi-check-circle"></i><span>选择</span></button></div>') +
        renderParamConfig()) +
        renderSqlSection() +
        renderScheduleSection() +
        '<div class="dqit-form-actions-bottom">' +
          '<button class="btn btn-primary" type="button" data-dqit-action="save-form"><i class="bi bi-save"></i><span>保存</span></button>' +
          '<button class="btn btn-outline" type="button" data-dqit-action="back-list"><i class="bi bi-x-lg"></i><span>取消</span></button>' +
        '</div>' +
      '</div>' +
    '</section>';
  }

  function renderStandardFormShell() {
    var draft = state.form || createStandardFormDraft();
    state.form = draft;
    var title = state.formMode === 'edit' ? '编辑' : '标准稽查';
    return '<section class="dqit-form-shell dqit-standard-form">' +
      '<div class="dqit-form-head">' +
        '<div class="dqit-form-title"><i class="bi bi-list"></i><span>' + escapeHtml(title) + '</span></div>' +
        '<button class="btn btn-primary" type="button" data-dqit-action="back-list"><i class="bi bi-arrow-left"></i><span>返回</span></button>' +
      '</div>' +
      '<div class="dqit-form-scroll">' +
        renderRequiredFormRow('任务名称', '<input class="dqit-input" type="text" data-dqit-form-field="taskName" value="' + escapeHtml(draft.taskName) + '" placeholder="50个字符以内">', '<i class="bi bi-info-circle-fill"></i><span>50个字符以内，只允许数字，字母，中文，下划线；</span>') +
        renderRequiredFormRow('业务分层', renderTreePicker('businessLayer', draft.businessLayer, draft.businessLayerKey, taskTree, '请选择业务分层')) +
        renderRequiredFormRow('标准数据', '<div class="dqit-rule-field dqit-standard-field"><input class="dqit-input dqit-input-readonly" type="text" readonly value="' + escapeHtml(draft.standardData) + '"><button class="btn btn-primary" type="button" data-dqit-action="open-standard-modal"><i class="bi bi-plus-lg"></i><span>选择</span></button></div>') +
        renderRequiredFormRow('关联数据源', '<select data-dqit-standard-field="datasource">' + renderOptions(standardDatasourceOptions, draft.datasource) + '</select>') +
        renderRequiredFormRow('考核权重', '<input class="dqit-input" type="number" min="1" max="100" data-dqit-form-field="weight" value="' + escapeHtml(draft.weight) + '">', '<i class="bi bi-info-circle-fill"></i><span>只允许1-100数字</span>') +
        renderStandardEntitySection() +
        renderRequiredFormRow('质量规则', '<input class="dqit-input dqit-input-readonly" type="text" readonly value="' + escapeHtml(draft.qualityRule) + '">') +
        renderRequiredFormRow('稽查机制', '<select data-dqit-standard-field="inspectMode">' + renderOptions(inspectModeOptions, draft.inspectMode) + '</select>') +
        renderStandardScheduleSection() +
        '<div class="dqit-form-actions-bottom">' +
          '<button class="btn btn-primary" type="button" data-dqit-action="save-form"><i class="bi bi-save"></i><span>保存</span></button>' +
          '<button class="btn btn-outline" type="button" data-dqit-action="back-list"><i class="bi bi-x-lg"></i><span>取消</span></button>' +
        '</div>' +
      '</div>' +
    '</section>';
  }

  function renderOperationModal() {
    if (!state.modal) return '';
    var type = state.modal.type;
    var tasks = getTasksByIds(state.modal.ids);
    var isDelete = type === 'delete';
    var isStop = type === 'stop';
    var title = isDelete ? '删除稽查任务' : (isStop ? '停止稽查任务' : '启动稽查任务');
    var icon = isDelete ? 'bi-trash3' : (isStop ? 'bi-stop-circle' : 'bi-play-circle');
    var tone = isDelete ? 'danger' : (isStop ? 'warning' : 'primary');
    var okText = isDelete ? '确认删除' : (isStop ? '确认停止' : '确认启动');
    var desc = isDelete
      ? '删除后该任务配置将从列表移除，静态原型内不会进入回收站。'
      : (isStop ? '停止后任务将不再按调度频率自动执行，可在列表中再次启动。' : '启动后任务将按配置频率进入调度执行，并更新运行状态。');
    var taskHtml = tasks.slice(0, 6).map(function (item) {
      return '<li><span>' + escapeHtml(item.name) + '</span><em>' + escapeHtml(item.status) + '</em></li>';
    }).join('');
    if (tasks.length > 6) taskHtml += '<li class="more">另有 ' + (tasks.length - 6) + ' 个任务</li>';
    return '<div class="dqit-modal-mask" data-dqit-modal-mask="operation">' +
      '<div class="dqit-confirm" role="dialog" aria-modal="true" aria-label="' + escapeHtml(title) + '">' +
        '<button class="dqit-confirm-close" type="button" data-dqit-action="close-modal" aria-label="关闭"><i class="bi bi-x-lg"></i></button>' +
        '<div class="dqit-confirm-body">' +
          '<div class="dqit-confirm-icon ' + tone + '"><i class="bi ' + icon + '"></i></div>' +
          '<div class="dqit-confirm-main">' +
            '<h3>' + escapeHtml(title) + '</h3>' +
            '<p>确认对 <b>' + tasks.length + '</b> 个稽查任务执行该操作吗？</p>' +
            '<div class="dqit-confirm-desc">' + escapeHtml(desc) + '</div>' +
            '<ul class="dqit-confirm-list">' + taskHtml + '</ul>' +
          '</div>' +
        '</div>' +
        '<div class="dqit-confirm-footer">' +
          '<button class="btn btn-outline" type="button" data-dqit-action="close-modal"><i class="bi bi-x-lg"></i><span>取消</span></button>' +
          '<button class="btn ' + (isDelete ? 'btn-danger' : 'btn-primary') + '" type="button" data-dqit-action="confirm-modal"><i class="bi bi-check-lg"></i><span>' + escapeHtml(okText) + '</span></button>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  function getRuleRows() {
    if (!state.ruleModal) return [];
    var keyword = normalize(state.ruleModal.keyword);
    var selectedKey = state.ruleModal.treeKey;
    var selectedNode = findTreeNode(ruleTree, selectedKey);
    var keys = collectTreeKeys(selectedNode);
    return ruleRows.filter(function (item) {
      if (keys.length && keys.indexOf(item.group) < 0 && selectedKey !== 'rule-business') return false;
      if (keyword && normalize(item.name + ' ' + item.desc).indexOf(keyword) < 0) return false;
      return true;
    });
  }

  function renderRuleModal() {
    if (!state.ruleModal) return '';
    var rows = getRuleRows();
    return '<div class="dqit-modal-mask" data-dqit-modal-mask="rule">' +
      '<div class="dqit-rule-dialog" role="dialog" aria-modal="true" aria-label="稽查规则选择">' +
        '<div class="dqit-rule-head"><strong>稽查规则-选择</strong><button type="button" data-dqit-action="close-rule-modal" aria-label="关闭"><i class="bi bi-x-lg"></i></button></div>' +
        '<div class="dqit-rule-body">' +
          '<div class="dqit-rule-left">' +
            '<div class="dqit-rule-search"><input type="text" data-dqit-rule-tree-search value="' + escapeHtml(state.ruleModal.treeKeyword) + '" placeholder="关键字搜索"><button type="button"><i class="bi bi-search"></i></button></div>' +
            '<div class="dqit-rule-tree-wrap"><ul class="dqit-tree">' + (renderTreeNodes(ruleTree, normalize(state.ruleModal.treeKeyword), { forceOpen: true, activeKey: state.ruleModal.treeKey, action: 'toggle-picker-tree', selectAction: 'select-rule-tree' }) || '<li class="dqit-empty-tree">暂无匹配目录</li>') + '</ul></div>' +
          '</div>' +
          '<div class="dqit-rule-right">' +
            '<div class="dqit-rule-query"><input type="text" data-dqit-rule-keyword value="' + escapeHtml(state.ruleModal.keyword) + '" placeholder="关键字查询"><button class="btn btn-primary" type="button" data-dqit-action="query-rule"><i class="bi bi-search"></i><span>查询</span></button></div>' +
            '<div class="dqit-rule-table-wrap">' +
              '<table class="ds-table dqit-rule-table"><thead><tr><th></th><th>名称</th><th>描述</th></tr></thead><tbody>' +
                (rows.length ? rows.map(function (row) {
                  return '<tr data-dqit-action="select-rule" data-rule-id="' + escapeHtml(row.id) + '">' +
                    '<td><input type="radio" name="dqitRule" ' + (state.ruleModal.selectedId === row.id ? ' checked' : '') + '></td>' +
                    '<td>' + escapeHtml(row.name) + '</td><td>' + escapeHtml(row.desc) + '</td>' +
                  '</tr>';
                }).join('') : '<tr class="dqit-empty-row"><td colspan="3">暂无匹配稽查规则</td></tr>') +
              '</tbody></table>' +
            '</div>' +
            '<div class="dqit-rule-footer-note">显示第 ' + (rows.length ? 1 : 0) + ' 到第 ' + rows.length + ' 条记录，总共 ' + rows.length + ' 条记录</div>' +
          '</div>' +
        '</div>' +
        '<div class="dqit-rule-foot">' +
          '<button class="btn btn-primary" type="button" data-dqit-action="choose-rule"><i class="bi bi-check2-square"></i><span>选择 稽查规则</span></button>' +
          '<button class="btn btn-outline" type="button" data-dqit-action="close-rule-modal"><i class="bi bi-x-lg"></i><span>取消</span></button>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  function getStandardRows() {
    if (!state.standardModal) return [];
    var keyword = normalize(state.standardModal.keyword);
    var selectedKey = state.standardModal.treeKey;
    var selectedNode = findTreeNode(standardTree, selectedKey);
    var keys = collectTreeKeys(selectedNode);
    return standardRows.filter(function (item) {
      if (keys.length && keys.indexOf(item.group) < 0) return false;
      if (keyword && normalize(item.enName + ' ' + item.alias + ' ' + item.desc).indexOf(keyword) < 0) return false;
      return true;
    });
  }

  function renderStandardModal() {
    if (!state.standardModal) return '';
    var rows = getStandardRows();
    var selectedIds = state.standardModal.selectedIds || {};
    var treeHtml = renderTreeNodes(standardTree, normalize(state.standardModal.treeKeyword), {
      forceOpen: true,
      activeKey: state.standardModal.treeKey,
      action: 'toggle-standard-tree',
      selectAction: 'select-standard-tree'
    }) || '<li class="dqit-empty-tree">暂无匹配目录</li>';
    return '<div class="dqit-modal-mask" data-dqit-modal-mask="standard">' +
      '<div class="dqit-standard-dialog" role="dialog" aria-modal="true" aria-label="选择标准">' +
        '<div class="dqit-rule-head"><strong>选择标准</strong><button type="button" data-dqit-action="close-standard-modal" aria-label="关闭"><i class="bi bi-x-lg"></i></button></div>' +
        '<div class="dqit-standard-body">' +
          '<div class="dqit-rule-left">' +
            '<div class="dqit-standard-search"><input type="text" data-dqit-standard-tree-search value="' + escapeHtml(state.standardModal.treeKeyword) + '" placeholder="关键字搜索"><button type="button" data-dqit-action="query-standard"><i class="bi bi-search"></i></button></div>' +
            '<div class="dqit-standard-tree-wrap"><ul class="dqit-tree">' + treeHtml + '</ul></div>' +
          '</div>' +
          '<div class="dqit-rule-right">' +
            '<div class="dqit-standard-query"><input type="text" data-dqit-standard-keyword value="' + escapeHtml(state.standardModal.keyword) + '" placeholder="关键字搜索"><button class="btn btn-primary" type="button" data-dqit-action="query-standard"><i class="bi bi-search"></i><span>搜索</span></button></div>' +
            '<div class="dqit-standard-table-wrap">' +
              '<table class="ds-table dqit-standard-table"><thead><tr><th></th><th>英文名称</th><th>别名</th><th>描述</th></tr></thead><tbody>' +
                (rows.length ? rows.map(function (row) {
                  return '<tr data-dqit-action="toggle-standard-row" data-standard-id="' + escapeHtml(row.id) + '">' +
                    '<td><input type="checkbox" ' + (selectedIds[row.id] ? 'checked ' : '') + 'aria-label="选择标准数据"></td>' +
                    '<td>' + escapeHtml(row.enName) + '</td>' +
                    '<td>' + escapeHtml(row.alias) + '</td>' +
                    '<td>' + escapeHtml(row.desc) + '</td>' +
                  '</tr>';
                }).join('') : '<tr class="dqit-empty-row"><td colspan="4">暂无匹配标准数据</td></tr>') +
              '</tbody></table>' +
            '</div>' +
            '<div class="dqit-standard-footer-note">第' + (rows.length ? 1 : 0) + '到第' + rows.length + '条记录，共' + rows.length + '条记录</div>' +
          '</div>' +
        '</div>' +
        '<div class="dqit-rule-foot">' +
          '<button class="btn btn-primary" type="button" data-dqit-action="choose-standard"><i class="bi bi-plus-lg"></i><span>添加</span></button>' +
          '<button class="btn btn-outline" type="button" data-dqit-action="close-standard-modal"><i class="bi bi-x-lg"></i><span>取消</span></button>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  function getTestSqlRows() {
    return [
      { id: '100238', username: 'zhangyue', password: 'pwd_2026_01', realName: '张悦', idCard: '110101199003127425', phone: '1381023' },
      { id: '100241', username: 'liucheng', password: 'pwd_2026_02', realName: '刘诚', idCard: '320105198811238317', phone: '1398765432' },
      { id: '100257', username: 'wangmin', password: 'pwd_2026_03', realName: '王敏', idCard: '440106199205063628', phone: '131-2048-88' },
      { id: '100263', username: 'chenhao', password: 'pwd_2026_04', realName: '陈浩', idCard: '330102198709184916', phone: '13200000000' },
      { id: '100279', username: 'zhaonan', password: 'pwd_2026_05', realName: '赵楠', idCard: '510104199412301233', phone: '135AB77890' },
      { id: '100286', username: 'sunlei', password: 'pwd_2026_06', realName: '孙磊', idCard: '420106199001154214', phone: '134555' },
      { id: '100291', username: 'zhouxin', password: 'pwd_2026_07', realName: '周欣', idCard: '210102198606217532', phone: '12588889999' },
      { id: '100305', username: 'huangqi', password: 'pwd_2026_08', realName: '黄琪', idCard: '370202199307095821', phone: '1367777888' },
      { id: '100318', username: 'yangfan', password: 'pwd_2026_09', realName: '杨帆', idCard: '610104198912014816', phone: '138 9012 345' },
      { id: '100326', username: 'xumeng', password: 'pwd_2026_10', realName: '许萌', idCard: '350102199608268429', phone: '1392222333' }
    ];
  }

  function getTestSqlColumns() {
    return [
      { key: 'id', label: 'id' },
      { key: 'username', label: 'username' },
      { key: 'password', label: 'password' },
      { key: 'realName', label: 'real_name' },
      { key: 'idCard', label: 'id_card' },
      { key: 'phone', label: 'phone', issue: true }
    ];
  }

  function getBasicTestIssueField() {
    if (!state.basicParamModal || !state.form) return 'actual_collected_time';
    var entity = state.form.entities && state.form.entities[state.basicParamModal.entityIndex];
    var field = getBasicEntityParts(entity).field || 'actual_collected_time';
    return field;
  }

  function getBasicTestSqlRows(issueKey) {
    var rows = [
      { task_id: 'CT20260703001', waybill_no: 'YT7328049126', customer_name: '上海启明商贸有限公司', planned_collect_time: '2026-07-03 09:30:00', status: '待补录' },
      { task_id: 'CT20260703002', waybill_no: 'YT7328049158', customer_name: '杭州青禾科技有限公司', planned_collect_time: '2026-07-03 09:45:00', status: '待复核' },
      { task_id: 'CT20260703003', waybill_no: 'YT7328049183', customer_name: '南京云帆供应链', planned_collect_time: '2026-07-03 10:00:00', status: '待补录' },
      { task_id: 'CT20260703004', waybill_no: 'YT7328049207', customer_name: '苏州联创电子', planned_collect_time: '2026-07-03 10:15:00', status: '待复核' },
      { task_id: 'CT20260703005', waybill_no: 'YT7328049231', customer_name: '无锡华瑞制造', planned_collect_time: '2026-07-03 10:30:00', status: '待补录' },
      { task_id: 'CT20260703006', waybill_no: 'YT7328049266', customer_name: '宁波远航贸易', planned_collect_time: '2026-07-03 10:45:00', status: '待复核' },
      { task_id: 'CT20260703007', waybill_no: 'YT7328049292', customer_name: '合肥星河智能', planned_collect_time: '2026-07-03 11:00:00', status: '待补录' },
      { task_id: 'CT20260703008', waybill_no: 'YT7328049320', customer_name: '厦门明诚物流', planned_collect_time: '2026-07-03 11:15:00', status: '待复核' },
      { task_id: 'CT20260703009', waybill_no: 'YT7328049354', customer_name: '广州南方食品', planned_collect_time: '2026-07-03 11:30:00', status: '待补录' },
      { task_id: 'CT20260703010', waybill_no: 'YT7328049381', customer_name: '深圳优选零售', planned_collect_time: '2026-07-03 11:45:00', status: '待复核' }
    ];
    var issueValues = ['', 'NULL', '0000-00-00 00:00:00', '2026/07/03', '', '异常文本', '1970-01-01 00:00:00', '2026-13-03 11:15:00', '未采集', ''];
    return rows.map(function (row, index) {
      row[issueKey] = issueValues[index];
      return row;
    });
  }

  function getBasicTestSqlColumns(issueKey) {
    return [
      { key: 'task_id', label: 'task_id' },
      { key: 'waybill_no', label: 'waybill_no' },
      { key: 'customer_name', label: 'customer_name' },
      { key: 'planned_collect_time', label: 'planned_collect_time' },
      { key: issueKey, label: issueKey, issue: true },
      { key: 'status', label: 'status' }
    ];
  }

  function createTestSqlModalDraft() {
    if (state.basicParamModal) {
      var issueKey = getBasicTestIssueField();
      return {
        columns: getBasicTestSqlColumns(issueKey),
        rows: getBasicTestSqlRows(issueKey)
      };
    }
    return {
      columns: getTestSqlColumns(),
      rows: getTestSqlRows()
    };
  }

  function renderTestSqlRows(rows, columns) {
    return rows.map(function (row) {
      return '<tr>' + columns.map(function (column) {
        return '<td' + (column.issue ? ' class="dqit-test-issue-cell"' : '') + '>' + escapeHtml(row[column.key] || '') + '</td>';
      }).join('') + '</tr>';
    }).join('');
  }

  function renderTestSqlModal() {
    if (!state.testSqlModal) return '';
    var rows = state.testSqlModal.rows || getTestSqlRows();
    var columns = state.testSqlModal.columns || getTestSqlColumns();
    return '<div class="dqit-modal-mask dqit-test-sql-mask" data-dqit-modal-mask="test-sql">' +
      '<div class="dqit-test-sql-dialog" role="dialog" aria-modal="true" aria-label="测试执行">' +
        '<div class="dqit-test-sql-head"><strong>测试执行(仅显示前10条)</strong><button type="button" data-dqit-action="close-test-sql" aria-label="关闭"><i class="bi bi-x-lg"></i></button></div>' +
        '<div class="dqit-test-sql-body">' +
          '<div class="dqit-test-table-wrap">' +
            '<table class="dqit-test-table">' +
              '<thead><tr>' + columns.map(function (column) { return '<th' + (column.issue ? ' class="dqit-test-issue-head"' : '') + '>' + escapeHtml(column.label) + '</th>'; }).join('') + '</tr></thead>' +
              '<tbody>' + renderTestSqlRows(rows, columns) + '</tbody>' +
            '</table>' +
          '</div>' +
        '</div>' +
        '<div class="dqit-test-sql-foot"><button class="btn btn-primary" type="button" data-dqit-action="close-test-sql"><i class="bi bi-x-lg"></i><span>关闭</span></button></div>' +
      '</div>' +
    '</div>';
  }

  function renderReportSqlModal() {
    if (!state.reportSqlModal) return '';
    var run = getSelectedReportRun();
    return '<div class="dqit-modal-mask" data-dqit-modal-mask="report-sql">' +
      '<div class="dqit-view-sql-dialog" role="dialog" aria-modal="true" aria-label="查看SQL">' +
        '<div class="dqit-rule-head"><strong>查看SQL</strong><button type="button" data-dqit-action="close-report-sql" aria-label="关闭"><i class="bi bi-x-lg"></i></button></div>' +
        '<div class="dqit-view-sql-body">' + renderSqlEditor('reportSql', run.reportName, getReportSql()) + '</div>' +
        '<div class="dqit-rule-foot"><button class="btn btn-primary" type="button" data-dqit-action="close-report-sql"><i class="bi bi-x-lg"></i><span>关闭</span></button></div>' +
      '</div>' +
    '</div>';
  }

  function renderReportLogModal() {
    if (!state.reportLogModal) return '';
    var run = getSelectedReportRun();
    return '<div class="dqit-modal-mask" data-dqit-modal-mask="report-log">' +
      '<div class="dqit-view-log-dialog" role="dialog" aria-modal="true" aria-label="执行日志">' +
        '<div class="dqit-rule-head"><strong>执行日志</strong><button type="button" data-dqit-action="close-report-log" aria-label="关闭"><i class="bi bi-x-lg"></i></button></div>' +
        '<div class="dqit-log-header"><div><h3>' + escapeHtml(run.reportName) + '</h3><p>开始时间：' + escapeHtml(run.startAt) + '　完成时间：' + escapeHtml(run.endAt) + '　状态：' + escapeHtml(run.status) + '</p></div></div>' +
        '<pre class="dqit-tech-log">' + escapeHtml(getExecutionLog(run)) + '</pre>' +
        '<div class="dqit-rule-foot"><button class="btn btn-primary" type="button" data-dqit-action="close-report-log"><i class="bi bi-x-lg"></i><span>关闭</span></button></div>' +
      '</div>' +
    '</div>';
  }

  function disposeReportGauge() {
    if (reportGaugeChart) {
      reportGaugeChart.dispose();
      reportGaugeChart = null;
    }
  }

  function initReportGauge() {
    var el = pageEl ? pageEl.querySelector('#dqitReportGauge') : null;
    if (!el) return;
    if (!window.echarts) {
      el.innerHTML = '<div class="dqit-gauge-fallback"><strong>' + reportSummary.passRate.toFixed(2) + '%</strong><span>符合规则比例</span></div>';
      return;
    }
    var progressColor = window.echarts.graphic
      ? new window.echarts.graphic.LinearGradient(0, 0, 1, 0, [
        { offset: 0, color: '#20c997' },
        { offset: 0.52, color: '#1683ff' },
        { offset: 1, color: '#2f78ff' }
      ])
      : '#1683ff';
    reportGaugeChart = window.echarts.init(el);
    reportGaugeChart.setOption({
      series: [{
        type: 'gauge',
        startAngle: 90,
        endAngle: -270,
        min: 0,
        max: 100,
        center: ['50%', '50%'],
        radius: '82%',
        progress: {
          show: true,
          roundCap: true,
          clip: false,
          width: 18,
          itemStyle: {
            color: progressColor,
            shadowColor: 'rgba(22, 131, 255, 0.22)',
            shadowBlur: 10,
            shadowOffsetY: 2
          }
        },
        axisLine: {
          roundCap: true,
          lineStyle: {
            width: 18,
            color: [[1, '#edf4fb']]
          }
        },
        pointer: {
          show: false
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: false
        },
        axisLabel: {
          show: false
        },
        anchor: {
          show: false
        },
        title: {
          offsetCenter: [0, '22%'],
          color: '#60758b',
          fontSize: 13,
          fontWeight: 400
        },
        detail: {
          valueAnimation: true,
          offsetCenter: [0, '-8%'],
          formatter: function (value) { return Number(value).toFixed(2) + '%'; },
          color: '#1683ff',
          fontSize: 31,
          fontWeight: 700,
          lineHeight: 36
        },
        data: [{ value: reportSummary.passRate, name: '符合规则比例' }]
      }]
    }, true);
    window.setTimeout(function () {
      if (reportGaugeChart) reportGaugeChart.resize();
    }, 0);
  }

  function renderAll() {
    if (!pageEl) return;
    var fullMode = state.view === 'form' || state.view === 'result' || state.view === 'report' || state.view === 'log';
    var content = renderListShell();
    if (state.view === 'form') content = state.formKind === 'standard' ? renderStandardFormShell() : (state.formKind === 'basic' ? renderBasicFormShell() : renderFormShell());
    if (state.view === 'result') content = renderResultListShell();
    if (state.view === 'report') content = renderReportDetailShell();
    if (state.view === 'log') content = renderReportLogShell();
    disposeReportGauge();
    pageEl.classList.toggle('form-mode', fullMode);
    pageEl.innerHTML = content +
      renderOperationModal() + renderRuleModal() + renderStandardModal() + renderBasicFieldModal() + renderBasicParamModal() + renderReportSqlModal() + renderReportLogModal() + renderTestSqlModal();
    if (state.view === 'report') {
      if (window.requestAnimationFrame) window.requestAnimationFrame(initReportGauge);
      else initReportGauge();
    }
  }

  function renderAllKeepFormScroll() {
    var scrollTop = 0;
    var scroller = pageEl ? pageEl.querySelector('.dqit-form-scroll') : null;
    if (scroller) scrollTop = scroller.scrollTop;
    renderAll();
    restoreFormScroll(scrollTop);
    if (window.requestAnimationFrame) window.requestAnimationFrame(function () { restoreFormScroll(scrollTop); });
    window.setTimeout(function () { restoreFormScroll(scrollTop); }, 0);
    window.setTimeout(function () { restoreFormScroll(scrollTop); }, 60);
  }

  function restoreFormScroll(scrollTop) {
    var nextScroller = pageEl ? pageEl.querySelector('.dqit-form-scroll') : null;
    if (nextScroller) nextScroller.scrollTop = scrollTop;
  }

  function showToast(message) {
    var old = pageEl.querySelector('.dqit-toast');
    if (old) old.remove();
    pageEl.insertAdjacentHTML('beforeend', '<div class="dqit-toast"><i class="bi bi-check-circle"></i><span>' + escapeHtml(message) + '</span></div>');
    var toast = pageEl.querySelector('.dqit-toast');
    window.setTimeout(function () { if (toast) toast.classList.add('show'); }, 20);
    window.setTimeout(function () { if (toast && toast.parentNode) toast.remove(); }, 1800);
  }

  function ensureRouteTask(opts) {
    if (!opts || opts.view !== 'edit' || !opts.taskId) return null;
    var item = getTaskById(opts.taskId);
    if (item || !opts.taskName) return item;
    var taskType = taskTypes.indexOf(opts.taskType) >= 0 ? opts.taskType : '自定义稽查';
    item = task(
      opts.taskId,
      opts.taskName,
      opts.taskFrequency || '每天 10:05:02',
      '运行中',
      '任务调度',
      '2026-06-30 10:05:02',
      '2026-06-30 10:05:02',
      'demo',
      taskType,
      opts.taskTarget || 'employee_info',
      1,
      '由任务调度执行详情跳转的规则任务。'
    );
    taskRows.unshift(item);
    return item;
  }

  function openForm(kind, mode, id, options) {
    if (kind !== 'custom' && kind !== 'standard' && kind !== 'basic') {
      id = mode;
      mode = kind;
      kind = 'custom';
    }
    var item = id ? getTaskById(id) : null;
    state.view = 'form';
    state.formKind = kind || 'custom';
    state.formMode = mode || 'create';
    state.editingId = item ? item.id : '';
    state.form = state.formKind === 'standard' ? createStandardFormDraft(item) : (state.formKind === 'basic' ? createBasicFormDraft(item) : createFormDraft(item));
    state.openPicker = '';
    state.openParamSelect = '';
    state.openBasicRuleSelect = '';
    state.basicRuleKeyword = '';
    state.ruleModal = null;
    state.standardModal = null;
    state.basicFieldModal = null;
    state.reportSqlModal = null;
    state.reportLogModal = null;
    state.schedulePopup = '';
    state.basicTimePopup = '';
    state.sql = {
      template: { theme: 'dark', font: '14px', searchOpen: false },
      generated: { theme: 'dark', font: '14px', searchOpen: false },
      customRule: { theme: 'dark', font: '14px', searchOpen: false },
      basicCustom: { theme: 'dark', font: '14px', searchOpen: false },
      reportSql: { theme: 'dark', font: '14px', searchOpen: false }
    };
    if (!options || !options.silent) renderAllKeepFormScroll();
  }

  function backToList() {
    state.view = 'list';
    state.form = null;
    state.formMode = 'create';
    state.formKind = 'custom';
    state.editingId = '';
    state.viewTaskId = '';
    state.reportRunIndex = 0;
    state.resultPage = 1;
    state.resultExecutionMode = '';
    state.ruleModal = null;
    state.standardModal = null;
    state.basicFieldModal = null;
    state.reportSqlModal = null;
    state.reportLogModal = null;
    state.openPicker = '';
    state.openParamSelect = '';
    state.openBasicRuleSelect = '';
    state.basicRuleKeyword = '';
    state.schedulePopup = '';
    state.basicTimePopup = '';
    if (typeof DP.rememberRoute === 'function') {
      DP.rememberRoute('quality-inspect-task', 'governance');
    }
    renderAllKeepFormScroll();
  }

  function openOperation(type, ids) {
    ids = (ids || []).filter(function (id) { return !!getTaskById(id); });
    if (!ids.length) {
      showToast('请先选择需要操作的稽查任务');
      return;
    }
    state.modal = { type: type, ids: ids };
    renderAll();
  }

  function closeModal() {
    state.modal = null;
    renderAll();
  }

  function applyOperation() {
    if (!state.modal) return;
    var type = state.modal.type;
    var ids = state.modal.ids.slice();
    if (type === 'delete') {
      taskRows = taskRows.filter(function (item) { return ids.indexOf(item.id) < 0; });
      state.selectedIds = {};
      state.modal = null;
      renderAllKeepFormScroll();
      showToast('稽查任务已删除');
      return;
    }
    taskRows.forEach(function (item) {
      if (ids.indexOf(item.id) < 0) return;
      item.status = type === 'start' ? '运行中' : '已停止';
      if (type === 'start') item.lastRunAt = formatDateTime(new Date());
    });
    state.selectedIds = {};
    state.modal = null;
    renderAll();
    showToast(type === 'start' ? '稽查任务已启动' : '稽查任务已停止');
  }

  function getSelectedIds() {
    return Object.keys(state.selectedIds);
  }

  function captureFormDraft() {
    if (!state.form || !pageEl) return;
    var taskName = pageEl.querySelector('[data-dqit-form-field="taskName"]');
    var weight = pageEl.querySelector('[data-dqit-form-field="weight"]');
    if (taskName) state.form.taskName = taskName.value.trim();
    if (weight) state.form.weight = weight.value.trim();
    var scheduleFields = pageEl.querySelectorAll('[data-dqit-schedule-field]');
    scheduleFields.forEach(function (field) {
      var key = field.getAttribute('data-dqit-schedule-field');
      state.form.schedule[key] = field.value;
    });
    pageEl.querySelectorAll('[data-dqit-standard-field]').forEach(function (field) {
      state.form[field.getAttribute('data-dqit-standard-field')] = field.value;
    });
    pageEl.querySelectorAll('[data-dqit-custom-field]').forEach(function (field) {
      state.form[field.getAttribute('data-dqit-custom-field')] = field.value;
    });
    pageEl.querySelectorAll('[data-dqit-basic-field]').forEach(function (field) {
      state.form[field.getAttribute('data-dqit-basic-field')] = field.value;
    });
    pageEl.querySelectorAll('[data-dqit-basic-time-param]').forEach(function (field) {
      if (!state.form.timeParams) state.form.timeParams = createBasicTimeParams();
      state.form.timeParams[field.getAttribute('data-dqit-basic-time-param')] = field.value;
    });
    ['template', 'generated', 'customRule', 'basicCustom'].forEach(function (key) {
      var content = pageEl.querySelector('[data-dqit-sql-content="' + key + '"]');
      if (!content) return;
      var draft = state.basicParamModal && key !== 'basicCustom' ? state.basicParamModal.draft : state.form;
      setDraftSqlValue(draft, key, content.innerText || content.textContent || '');
    });
  }

  function getFrequencyText() {
    var s = state.form.schedule;
    if (s.type === 'hourly') return '每小时 ' + String(s.minute || '0').padStart(2, '0') + ' 分';
    if (s.type === 'daily') return '每天 ' + (s.time || '00:00:00');
    if (s.type === 'weekly') return '每周' + (s.week || '周一') + ' ' + (s.time || '00:00:00');
    if (s.type === 'monthly') return '每月' + (s.day || '1号') + ' ' + (s.time || '00:00:00');
    return '执行一次 ' + (s.datetime || '2026-06-24 09:18:48');
  }

  function getBasicEntityTableName() {
    var first = state.form.entities && state.form.entities[0] ? state.form.entities[0].name : 'tms_demo.express_task_collect';
    var parts = String(first).split('.');
    return parts.length >= 3 ? parts[parts.length - 2] : first;
  }

  function saveForm() {
    captureFormDraft();
    if (!state.form.taskName) {
      showToast('请输入任务名称');
      return;
    }
    if (state.formKind === 'basic') {
      var basicTarget = getBasicEntityTableName();
      var basicDesc = state.form.inspectObject + '基础规则稽查，共 ' + (state.form.entities || []).length + ' 个稽查实体。';
      if (state.formMode === 'edit' && state.editingId) {
        var basicItem = getTaskById(state.editingId);
        if (basicItem) {
          basicItem.name = state.form.taskName;
          basicItem.frequency = getFrequencyText();
          basicItem.group = state.form.businessLayerKey;
          basicItem.type = '基础稽查';
          basicItem.target = basicTarget;
          basicItem.dataSource = getDefaultTaskDataSource(basicTarget, state.form.businessLayerKey);
          basicItem.ruleCount = (state.form.entities || []).length;
          basicItem.desc = basicDesc;
        }
      } else {
        taskRows.unshift(task('dqit-' + String(Date.now()).slice(-6), state.form.taskName, getFrequencyText(), '已停止', 'present', formatDateTime(new Date()), '--', state.form.businessLayerKey, '基础稽查', basicTarget, (state.form.entities || []).length, basicDesc, getDefaultTaskDataSource(basicTarget, state.form.businessLayerKey)));
      }
      state.treeKey = state.form.businessLayerKey;
      backToList();
      showToast('基础稽查任务已保存');
      return;
    }
    if (state.formKind === 'standard') {
      var standardTarget = state.form.datasource || 'aierp_pro_test';
      var standardDesc = state.form.qualityRule + '，标准数据：' + state.form.standardData + '。';
      if (state.formMode === 'edit' && state.editingId) {
        var standardItem = getTaskById(state.editingId);
        if (standardItem) {
          standardItem.name = state.form.taskName;
          standardItem.frequency = getFrequencyText();
          standardItem.group = state.form.businessLayerKey;
          standardItem.type = '标准稽查';
          standardItem.target = standardTarget;
          standardItem.dataSource = getDefaultTaskDataSource(standardTarget, state.form.businessLayerKey);
          standardItem.ruleCount = (state.form.entities || []).length;
          standardItem.desc = standardDesc;
        }
      } else {
        taskRows.unshift(task('dqit-' + String(Date.now()).slice(-6), state.form.taskName, getFrequencyText(), '已停止', 'present', formatDateTime(new Date()), '--', state.form.businessLayerKey, '标准稽查', standardTarget, (state.form.entities || []).length, standardDesc, getDefaultTaskDataSource(standardTarget, state.form.businessLayerKey)));
      }
      state.treeKey = state.form.businessLayerKey;
      backToList();
      showToast('标准稽查任务已保存');
      return;
    }
    var target = state.form.params[0] ? state.form.params[0].table : 'buildinglog';
    var isCustomRuleMode = state.form.ruleMode === 'custom';
    var ruleCount = isCustomRuleMode ? 1 : state.form.params.length;
    var ruleDesc = isCustomRuleMode ? '自定义SQL规则' : state.form.ruleName;
    if (state.formMode === 'edit' && state.editingId) {
      var item = getTaskById(state.editingId);
      if (item) {
        item.name = state.form.taskName;
        item.frequency = getFrequencyText();
        item.group = state.form.businessLayerKey;
        item.target = target;
        item.dataSource = getDisplayDataSourceFromForm(target);
        item.ruleCount = ruleCount;
        item.desc = ruleDesc + '，数据源：' + state.form.dataSource + '。';
      }
    } else {
      taskRows.unshift(task('dqit-' + String(Date.now()).slice(-6), state.form.taskName, getFrequencyText(), '已停止', 'present', formatDateTime(new Date()), '--', state.form.businessLayerKey, '自定义稽查', target, ruleCount, ruleDesc + '，数据源：' + state.form.dataSource + '。', getDisplayDataSourceFromForm(target)));
    }
    state.treeKey = state.form.businessLayerKey;
    backToList();
    showToast('自定义稽查任务已保存');
  }

  function setSqlText(key, sql) {
    var draft = state.basicParamModal && key !== 'basicCustom' ? state.basicParamModal.draft : state.form;
    setDraftSqlValue(draft, key, sql);
    var content = pageEl.querySelector('[data-dqit-sql-content="' + key + '"]');
    var gutter = pageEl.querySelector('[data-dqit-sql-gutter="' + key + '"]');
    if (content) content.innerHTML = highlightSQL(sql);
    if (gutter) gutter.innerHTML = lineNumbers(sql);
  }

  function getPlainSqlText(key) {
    var content = pageEl ? pageEl.querySelector('[data-dqit-sql-content="' + key + '"]') : null;
    return content ? (content.innerText || content.textContent || '') : '';
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

  function generateSql() {
    if (state.basicParamModal) captureBasicParamModalDraft();
    else captureFormDraft();
    var draft = getActiveConfigDraft() || {};
    var params = draft.params || [];
    var idField = (params[0] && params[0].field) || 'Id';
    var nameField = (params[1] && params[1].field) || 'Name';
    var tableName = (params[2] && params[2].table) || (params[0] && params[0].table) || 'buildinglog';
    setSqlText('generated', getDefaultGeneratedSql(tableName, idField, nameField));
    showToast('SQL 已生成');
  }

  function updateScheduleHint() {
    var hint = pageEl.querySelector('.dqit-schedule-hint span');
    if (hint) hint.textContent = renderScheduleHint();
  }

  function updateScheduleInputs(field, value) {
    pageEl.querySelectorAll('[data-dqit-schedule-field="' + field + '"]').forEach(function (input) {
      input.value = value;
    });
    updateScheduleHint();
  }

  function syncTimePickerActive(timeValue) {
    var time = parseTime(timeValue);
    pageEl.querySelectorAll('.dqit-time-picker [data-part]').forEach(function (button) {
      var part = button.getAttribute('data-part');
      button.classList.toggle('active', button.getAttribute('data-value') === time[part]);
    });
  }

  function syncDatePickerActive(dayValue) {
    pageEl.querySelectorAll('.dqit-date-grid button').forEach(function (button) {
      button.classList.toggle('active', button.getAttribute('data-day') === dayValue && !button.classList.contains('muted'));
    });
  }

  function closeSchedulePopupDom() {
    state.schedulePopup = '';
    pageEl.querySelectorAll('.dqit-time-picker, .dqit-date-picker').forEach(function (popup) {
      popup.remove();
    });
  }

  function closeBasicTimePopupDom() {
    state.basicTimePopup = '';
    pageEl.querySelectorAll('.dqit-basic-time-picker').forEach(function (popup) {
      popup.remove();
    });
  }

  function updateTimePart(part, value) {
    var field = state.schedulePopup === 'date-time' ? 'datetime' : 'time';
    var source = field === 'datetime' ? (state.form.schedule.datetime.split(' ')[1] || '00:00:00') : state.form.schedule.time;
    var time = parseTime(source);
    time[part] = value;
    var next = time.h + ':' + time.m + ':' + time.s;
    if (field === 'datetime') {
      var date = state.form.schedule.datetime.split(' ')[0] || '2026-06-24';
      state.form.schedule.datetime = date + ' ' + next;
    } else {
      state.form.schedule.time = next;
    }
    updateScheduleInputs(field, field === 'datetime' ? state.form.schedule.datetime : next);
    syncTimePickerActive(next);
  }

  function syncBasicTimePickerActive(timeValue) {
    var time = parseTime(timeValue);
    pageEl.querySelectorAll('.dqit-basic-time-picker [data-part]').forEach(function (button) {
      var part = button.getAttribute('data-part');
      button.classList.toggle('active', button.getAttribute('data-value') === time[part]);
    });
  }

  function updateBasicTimeInputs(field, value) {
    pageEl.querySelectorAll('[data-dqit-basic-time-param="' + field + '"]').forEach(function (input) {
      input.value = value;
    });
    syncBasicTimePickerActive(value || '00:00:00');
  }

  function updateBasicTimePart(part, value) {
    var field = state.basicTimePopup;
    if (!field || !state.form) return;
    ensureBasicFormDefaults();
    var time = parseTime(state.form.timeParams[field]);
    time[part] = value;
    var next = time.h + ':' + time.m + ':' + time.s;
    state.form.timeParams[field] = next;
    updateBasicTimeInputs(field, next);
  }

  function choosePickerNode(actionEl) {
    var key = actionEl.getAttribute('data-key');
    var picker = state.openPicker;
    var tree = picker === 'dataSource' ? dataSourceTree : taskTree;
    var node = findTreeNode(tree, key);
    if (!node || !state.form) return;
    if (picker === 'dataSource') {
      state.form.dataSourceKey = node.key;
      state.form.dataSource = node.label;
    } else {
      state.form.businessLayerKey = node.key;
      state.form.businessLayer = node.label;
    }
    state.openPicker = '';
    state.pickerKeyword = '';
    renderAll();
  }

  function chooseParamOption(actionEl) {
    var selectId = actionEl.getAttribute('data-select-id') || '';
    var value = actionEl.getAttribute('data-value') || '';
    var parts = selectId.split('-');
    var index = Number(parts[1]);
    var field = parts[2];
    var draft = getActiveConfigDraft();
    if (draft && draft.params && draft.params[index]) draft.params[index][field] = value;
    state.openParamSelect = '';
    state.paramKeyword = '';
    renderAll();
  }

  function openRuleModal() {
    state.ruleModal = {
      treeKey: 'rule-business',
      treeKeyword: '',
      keyword: '',
      selectedId: state.form ? state.form.ruleId : 'rule-repeat'
    };
    renderAll();
  }

  function chooseRule() {
    if (!state.ruleModal || !state.form) return;
    var selected = ruleRows.filter(function (row) { return row.id === state.ruleModal.selectedId; })[0] || ruleRows[1];
    state.form.ruleId = selected.id;
    state.form.ruleName = selected.name;
    state.ruleModal = null;
    renderAll();
    showToast('稽查规则已选择');
  }

  function openStandardModal() {
    var selectedIds = {};
    var selectedKey = state.form && state.form.standardDataKey ? state.form.standardDataKey : 'phone';
    selectedIds[selectedKey] = true;
    state.standardModal = {
      treeKey: selectedKey === 'phone' ? 'std-warehouse' : 'std-business',
      treeKeyword: '',
      keyword: '',
      selectedIds: selectedIds
    };
    renderAll();
  }

  function toggleStandardRow(actionEl) {
    if (!state.standardModal) return;
    var id = actionEl.getAttribute('data-standard-id') || '';
    if (!id) return;
    if (!state.standardModal.selectedIds) state.standardModal.selectedIds = {};
    if (state.standardModal.selectedIds[id]) delete state.standardModal.selectedIds[id];
    else state.standardModal.selectedIds[id] = true;
    renderAll();
  }

  function chooseStandard() {
    if (!state.standardModal || !state.form) return;
    var selectedIds = state.standardModal.selectedIds || {};
    var selected = standardRows.filter(function (row) { return selectedIds[row.id]; })[0];
    if (!selected) {
      showToast('请先选择标准数据');
      return;
    }
    state.form.standardDataKey = selected.id;
    state.form.standardData = selected.alias;
    state.form.qualityRule = selected.id === 'phone' ? '电话号码与手机号码校验(11位)码校验' : selected.alias + '标准值域校验';
    state.form.entities = cloneStandardEntities();
    state.standardModal = null;
    renderAll();
    showToast('标准数据已添加');
  }

  function toggleBasicRuleSelect(actionEl) {
    var selectId = actionEl.getAttribute('data-select-id') || '';
    state.openBasicRuleSelect = state.openBasicRuleSelect === selectId ? '' : selectId;
    state.openPicker = '';
    state.openParamSelect = '';
    state.basicRuleKeyword = '';
    state.basicTimePopup = '';
    renderAllKeepFormScroll();
  }

  function chooseBasicRule(actionEl) {
    if (!state.form) return;
    var index = Number(actionEl.getAttribute('data-index'));
    var ruleId = actionEl.getAttribute('data-rule-id') || 'field-not-null';
    var entity = state.form.entities[index];
    if (entity) {
      entity.ruleId = ruleId;
    }
    state.openBasicRuleSelect = '';
    state.basicRuleKeyword = '';
    renderAllKeepFormScroll();
  }

  function openBasicParamModal(actionEl) {
    if (!state.form) return;
    var index = Number(actionEl.getAttribute('data-index'));
    var entity = state.form.entities && state.form.entities[index];
    var rule = entity ? getBasicRule(entity.ruleId) : null;
    if (!entity || !isCustomBasicRule(rule)) {
      showToast('请选择自定义稽查质量规则后再配置参数');
      return;
    }
    state.basicParamModal = {
      entityIndex: index,
      draft: cloneBasicParamDraft(entity.paramConfig || createBasicParamDraft(entity))
    };
    state.openPicker = '';
    state.openParamSelect = '';
    state.openBasicRuleSelect = '';
    state.schedulePopup = '';
    state.basicTimePopup = '';
    renderAllKeepFormScroll();
  }

  function captureBasicParamModalDraft() {
    if (!state.basicParamModal || !pageEl) return;
    var draft = state.basicParamModal.draft;
    ['template', 'generated', 'customRule'].forEach(function (key) {
      var content = pageEl.querySelector('[data-dqit-sql-content="' + key + '"]');
      if (content) setDraftSqlValue(draft, key, content.innerText || content.textContent || '');
    });
  }

  function saveBasicParamModal() {
    if (!state.basicParamModal || !state.form) return;
    captureBasicParamModalDraft();
    var entity = state.form.entities && state.form.entities[state.basicParamModal.entityIndex];
    if (entity) {
      state.basicParamModal.draft.configured = true;
      entity.paramConfig = cloneBasicParamDraft(state.basicParamModal.draft);
    }
    state.basicParamModal = null;
    state.openParamSelect = '';
    renderAllKeepFormScroll();
    showToast('参数配置已保存');
  }

  function addBasicEntity() {
    if (!state.form) return;
    state.basicFieldModal = {
      treeKey: 'dim-order-status',
      treeKeyword: '',
      keyword: '',
      selectedIds: {},
      treeOpen: {
        ods: true,
        'workorder-ods': true
      }
    };
    renderAllKeepFormScroll();
  }

  function deleteBasicEntity(actionEl) {
    if (!state.form) return;
    var index = Number(actionEl.getAttribute('data-index'));
    if (state.form.entities.length <= 1) {
      showToast('至少保留 1 个稽查实体');
      return;
    }
    state.form.entities.splice(index, 1);
    state.openBasicRuleSelect = '';
    renderAllKeepFormScroll();
    showToast('稽查字段已删除');
  }

  function toggleBasicFieldRow(actionEl) {
    if (!state.basicFieldModal) return;
    var id = actionEl.getAttribute('data-field-id') || '';
    if (!id) return;
    if (state.basicFieldModal.selectedIds[id]) delete state.basicFieldModal.selectedIds[id];
    else state.basicFieldModal.selectedIds[id] = true;
    renderAllKeepFormScroll();
  }

  function toggleBasicFieldAll() {
    if (!state.basicFieldModal) return;
    var rows = getBasicFieldRows();
    var selectedIds = state.basicFieldModal.selectedIds || {};
    var allChecked = rows.length && rows.every(function (row) { return selectedIds[row.id]; });
    rows.forEach(function (row) {
      if (allChecked) delete selectedIds[row.id];
      else selectedIds[row.id] = true;
    });
    state.basicFieldModal.selectedIds = selectedIds;
    renderAllKeepFormScroll();
  }

  function chooseBasicFields() {
    if (!state.form || !state.basicFieldModal) return;
    var selectedIds = state.basicFieldModal.selectedIds || {};
    var selected = basicFieldRows.filter(function (row) { return selectedIds[row.id]; });
    if (!selected.length) {
      showToast('请先选择稽查字段');
      return;
    }
    var exists = {};
    (state.form.entities || []).forEach(function (entity) {
      exists[entity.name] = true;
    });
    var added = 0;
    selected.forEach(function (row) {
      var name = 'tms_demo.' + row.table + '.' + row.enName;
      if (exists[name]) return;
      state.form.entities.push({
        name: name,
        alias: row.alias,
        ruleId: 'field-not-null'
      });
      exists[name] = true;
      added++;
    });
    state.basicFieldModal = null;
    state.reportSqlModal = null;
    state.reportLogModal = null;
    state.viewTaskId = '';
    state.reportRunIndex = 0;
    state.resultPage = 1;
    state.resultPageSize = 10;
    renderAllKeepFormScroll();
    showToast(added ? '稽查字段已添加' : '所选字段已存在');
  }

  function openResultList(id) {
    var item = getTaskById(id) || taskRows[0];
    state.view = 'result';
    state.viewTaskId = item ? item.id : '';
    state.resultPage = 1;
    state.resultExecutionMode = '';
    state.reportRunIndex = 0;
    state.reportSqlModal = null;
    state.reportLogModal = null;
    state.selectedIds = {};
    renderAll();
  }

  function openReportDetail(actionEl) {
    state.reportRunIndex = Number(actionEl.getAttribute('data-run-index')) || 0;
    state.view = 'report';
    state.reportSqlModal = null;
    state.reportLogModal = null;
    renderAll();
  }

  function openReportSql(actionEl) {
    state.reportRunIndex = Number(actionEl.getAttribute('data-run-index')) || 0;
    state.reportSqlModal = true;
    state.reportLogModal = null;
    renderAllKeepFormScroll();
  }

  function openReportLog(actionEl) {
    state.reportRunIndex = Number(actionEl.getAttribute('data-run-index')) || 0;
    state.view = 'log';
    state.reportLogModal = null;
    state.reportSqlModal = null;
    renderAll();
  }

  function handleAction(actionEl) {
    var action = actionEl.getAttribute('data-dqit-action');
    var id = actionEl.getAttribute('data-id') || '';
    if (action === 'toggle-tree') {
      var key = actionEl.getAttribute('data-key') || '';
      state.treeOpen[key] = !state.treeOpen[key];
      renderAllKeepFormScroll();
    } else if (action === 'query') {
      var input = pageEl.querySelector('#dqitKeywordInput');
      var targetInput = pageEl.querySelector('#dqitTargetInput');
      state.filters.keyword = input ? input.value.trim() : '';
      state.filters.targetKeyword = targetInput ? targetInput.value.trim() : '';
      state.page = 1;
      state.selectedIds = {};
      renderAllKeepFormScroll();
    } else if (action === 'query-result-runs') {
      var executionModeSelect = pageEl.querySelector('#dqitResultExecutionMode');
      state.resultExecutionMode = executionModeSelect ? executionModeSelect.value : '';
      state.resultPage = 1;
      renderAll();
    } else if (action === 'entry-custom') {
      openForm('custom', 'create');
    } else if (action === 'entry-standard') {
      openForm('standard', 'create');
    } else if (action === 'entry-basic') {
      openForm('basic', 'create');
    } else if (action === 'start-selected') {
      openOperation('start', getSelectedIds());
    } else if (action === 'stop-selected') {
      openOperation('stop', getSelectedIds());
    } else if (action === 'delete-selected') {
      openOperation('delete', getSelectedIds());
    } else if (action === 'start-row') {
      openOperation('start', [id]);
    } else if (action === 'stop-row') {
      openOperation('stop', [id]);
    } else if (action === 'delete-row') {
      openOperation('delete', [id]);
    } else if (action === 'close-modal') {
      closeModal();
    } else if (action === 'confirm-modal') {
      applyOperation();
    } else if (action === 'view-row') {
      openResultList(id);
    } else if (action === 'edit-row') {
      var editItem = getTaskById(id);
      openForm(editItem && editItem.type === '标准稽查' ? 'standard' : (editItem && editItem.type === '基础稽查' ? 'basic' : 'custom'), 'edit', id);
    } else if (action === 'back-list') {
      backToList();
    } else if (action === 'back-result-list') {
      state.view = 'result';
      state.reportSqlModal = null;
      state.reportLogModal = null;
      renderAll();
    } else if (action === 'open-report-detail') {
      openReportDetail(actionEl);
    } else if (action === 'open-report-sql') {
      openReportSql(actionEl);
    } else if (action === 'open-report-log') {
      openReportLog(actionEl);
    } else if (action === 'close-report-sql') {
      state.reportSqlModal = null;
      renderAllKeepFormScroll();
    } else if (action === 'close-report-log') {
      state.reportLogModal = null;
      renderAllKeepFormScroll();
    } else if (action === 'close-test-sql') {
      state.testSqlModal = null;
      renderAllKeepFormScroll();
    } else if (action === 'open-rule-modal') {
      openRuleModal();
    } else if (action === 'close-rule-modal') {
      state.ruleModal = null;
      renderAllKeepFormScroll();
    } else if (action === 'select-rule-tree') {
      state.ruleModal.treeKey = actionEl.getAttribute('data-key') || 'rule-business';
      renderAllKeepFormScroll();
    } else if (action === 'select-rule') {
      state.ruleModal.selectedId = actionEl.getAttribute('data-rule-id') || state.ruleModal.selectedId;
      renderAll();
    } else if (action === 'choose-rule') {
      chooseRule();
    } else if (action === 'query-rule') {
      renderAll();
    } else if (action === 'open-standard-modal') {
      openStandardModal();
    } else if (action === 'close-standard-modal') {
      state.standardModal = null;
      renderAllKeepFormScroll();
    } else if (action === 'select-standard-tree') {
      state.standardModal.treeKey = actionEl.getAttribute('data-key') || 'std-business';
      renderAllKeepFormScroll();
    } else if (action === 'toggle-standard-tree') {
      var standardToggleKey = actionEl.getAttribute('data-key') || '';
      state.treeOpen[standardToggleKey] = !state.treeOpen[standardToggleKey];
      renderAllKeepFormScroll();
    } else if (action === 'toggle-standard-row') {
      toggleStandardRow(actionEl);
    } else if (action === 'choose-standard') {
      chooseStandard();
    } else if (action === 'query-standard') {
      renderAll();
    } else if (action === 'toggle-basic-rule-select') {
      toggleBasicRuleSelect(actionEl);
    } else if (action === 'choose-basic-rule') {
      chooseBasicRule(actionEl);
    } else if (action === 'query-basic-rule') {
      renderAllKeepFormScroll();
    } else if (action === 'open-basic-param-modal') {
      openBasicParamModal(actionEl);
    } else if (action === 'close-basic-param-modal') {
      state.basicParamModal = null;
      state.openParamSelect = '';
      renderAllKeepFormScroll();
    } else if (action === 'save-basic-param-modal') {
      saveBasicParamModal();
    } else if (action === 'add-basic-entity') {
      addBasicEntity();
    } else if (action === 'delete-basic-entity') {
      deleteBasicEntity(actionEl);
    } else if (action === 'close-basic-field-modal') {
      state.basicFieldModal = null;
      renderAllKeepFormScroll();
    } else if (action === 'select-basic-field-tree') {
      var basicFieldKey = actionEl.getAttribute('data-key') || 'dim-order-status';
      var basicFieldNode = findBasicFieldNode(basicFieldTree, basicFieldKey);
      state.basicFieldModal.treeKey = basicFieldKey;
      if (basicFieldNode && (basicFieldNode.children || []).length) {
        var basicTreeOpen = getBasicFieldOpenMap();
        basicTreeOpen[basicFieldKey] = true;
      }
      renderAllKeepFormScroll();
    } else if (action === 'toggle-basic-field-tree') {
      var basicToggleKey = actionEl.getAttribute('data-key') || '';
      var openMap = getBasicFieldOpenMap();
      openMap[basicToggleKey] = !openMap[basicToggleKey];
      renderAllKeepFormScroll();
    } else if (action === 'toggle-basic-field-row') {
      toggleBasicFieldRow(actionEl);
    } else if (action === 'toggle-basic-field-all') {
      toggleBasicFieldAll();
    } else if (action === 'query-basic-field') {
      renderAllKeepFormScroll();
    } else if (action === 'choose-basic-fields') {
      chooseBasicFields();
    } else if (action === 'toggle-picker') {
      var picker = actionEl.getAttribute('data-picker') || '';
      state.openPicker = state.openPicker === picker ? '' : picker;
      state.openParamSelect = '';
      state.openBasicRuleSelect = '';
      state.basicTimePopup = '';
      state.pickerKeyword = '';
      renderAll();
    } else if (action === 'choose-picker-node') {
      choosePickerNode(actionEl);
    } else if (action === 'toggle-picker-tree') {
      var toggleKey = actionEl.getAttribute('data-key') || '';
      state.treeOpen[toggleKey] = !state.treeOpen[toggleKey];
      renderAll();
    } else if (action === 'toggle-param-select') {
      var selectId = actionEl.getAttribute('data-select-id') || '';
      state.openParamSelect = state.openParamSelect === selectId ? '' : selectId;
      state.openPicker = '';
      state.openBasicRuleSelect = '';
      state.basicTimePopup = '';
      state.paramKeyword = '';
      renderAll();
    } else if (action === 'choose-param-option') {
      chooseParamOption(actionEl);
    } else if (action === 'generate-sql') {
      generateSql();
    } else if (action === 'test-sql') {
      state.testSqlModal = createTestSqlModalDraft();
      renderAllKeepFormScroll();
    } else if (action === 'format-sql') {
      var sqlKey = actionEl.getAttribute('data-sql-key') || 'template';
      setSqlText(sqlKey, formatSqlText(getPlainSqlText(sqlKey)));
      showToast('SQL 已格式化');
    } else if (action === 'copy-sql') {
      var copyKey = actionEl.getAttribute('data-sql-key') || 'template';
      var button = actionEl;
      function done() {
        button.innerHTML = '<i class="bi bi-check2"></i><span>已复制</span>';
        window.setTimeout(function () {
          button.innerHTML = '<i class="bi bi-clipboard"></i><span>复制</span>';
        }, 1200);
      }
      if (navigator.clipboard) navigator.clipboard.writeText(getPlainSqlText(copyKey)).then(done).catch(function () { showToast('复制失败'); });
      else done();
    } else if (action === 'toggle-sql-search') {
      var toggleSqlKey = actionEl.getAttribute('data-sql-key') || 'template';
      state.sql[toggleSqlKey].searchOpen = !state.sql[toggleSqlKey].searchOpen;
      renderAll();
    } else if (action === 'close-sql-search') {
      var closeSqlKey = actionEl.getAttribute('data-sql-key') || 'template';
      state.sql[closeSqlKey].searchOpen = false;
      renderAll();
    } else if (action === 'open-schedule-popup') {
      state.schedulePopup = actionEl.getAttribute('data-popup') || '';
      state.basicTimePopup = '';
      renderAllKeepFormScroll();
    } else if (action === 'pick-time-part') {
      updateTimePart(actionEl.getAttribute('data-part'), actionEl.getAttribute('data-value'));
    } else if (action === 'open-basic-time-popup') {
      state.basicTimePopup = actionEl.getAttribute('data-time-field') || '';
      state.schedulePopup = '';
      renderAllKeepFormScroll();
    } else if (action === 'pick-basic-time-part') {
      updateBasicTimePart(actionEl.getAttribute('data-part'), actionEl.getAttribute('data-value'));
    } else if (action === 'basic-time-clear') {
      if (state.basicTimePopup && state.form) {
        ensureBasicFormDefaults();
        state.form.timeParams[state.basicTimePopup] = '';
        updateBasicTimeInputs(state.basicTimePopup, '');
      }
    } else if (action === 'basic-time-now') {
      if (state.basicTimePopup && state.form) {
        ensureBasicFormDefaults();
        state.form.timeParams[state.basicTimePopup] = '11:55:32';
        updateBasicTimeInputs(state.basicTimePopup, '11:55:32');
      }
    } else if (action === 'basic-time-ok') {
      closeBasicTimePopupDom();
    } else if (action === 'pick-date-day') {
      var day = String(actionEl.getAttribute('data-day') || '24').padStart(2, '0');
      var time = state.form.schedule.datetime.split(' ')[1] || '09:18:48';
      state.form.schedule.datetime = '2026-06-' + day + ' ' + time;
      updateScheduleInputs('datetime', state.form.schedule.datetime);
      syncDatePickerActive(actionEl.getAttribute('data-day') || '24');
    } else if (action === 'schedule-clear') {
      if (state.schedulePopup === 'date') {
        state.form.schedule.datetime = '';
        updateScheduleInputs('datetime', '');
      } else {
        state.form.schedule.time = '';
        updateScheduleInputs('time', '');
        syncTimePickerActive('00:00:00');
      }
    } else if (action === 'schedule-now') {
      if (state.schedulePopup === 'date') {
        state.form.schedule.datetime = '2026-06-24 09:18:48';
        updateScheduleInputs('datetime', state.form.schedule.datetime);
        syncDatePickerActive('24');
      } else {
        state.form.schedule.time = '11:55:32';
        updateScheduleInputs('time', state.form.schedule.time);
        syncTimePickerActive(state.form.schedule.time);
      }
    } else if (action === 'schedule-ok') {
      closeSchedulePopupDom();
    } else if (action === 'save-form') {
      saveForm();
    }
  }

  function bindEvents() {
    pageEl.addEventListener('mousedown', function (e) {
      var scheduleTarget = e.target.closest('[data-dqit-action="open-schedule-popup"], [data-dqit-action="open-basic-time-popup"], .dqit-time-picker button, .dqit-date-picker button');
      if (scheduleTarget && pageEl.contains(scheduleTarget)) {
        e.preventDefault();
      }
    });

    pageEl.addEventListener('click', function (e) {
      var mask = e.target.closest('[data-dqit-modal-mask]');
      if (mask && e.target === mask) {
        if (mask.getAttribute('data-dqit-modal-mask') === 'rule') state.ruleModal = null;
        else if (mask.getAttribute('data-dqit-modal-mask') === 'standard') state.standardModal = null;
        else if (mask.getAttribute('data-dqit-modal-mask') === 'basic-field') state.basicFieldModal = null;
        else if (mask.getAttribute('data-dqit-modal-mask') === 'basic-param') {
          state.basicParamModal = null;
          state.openParamSelect = '';
        }
        else if (mask.getAttribute('data-dqit-modal-mask') === 'report-sql') state.reportSqlModal = null;
        else if (mask.getAttribute('data-dqit-modal-mask') === 'report-log') state.reportLogModal = null;
        else if (mask.getAttribute('data-dqit-modal-mask') === 'test-sql') state.testSqlModal = null;
        else state.modal = null;
        renderAllKeepFormScroll();
        return;
      }

      var actionEl = e.target.closest('[data-dqit-action]');
      if (actionEl && pageEl.contains(actionEl)) {
        var action = actionEl.getAttribute('data-dqit-action') || '';
        if (action.indexOf('schedule-') === 0 || action.indexOf('basic-time-') === 0 || action === 'open-schedule-popup' || action === 'open-basic-time-popup' || action === 'pick-time-part' || action === 'pick-basic-time-part' || action === 'pick-date-day') {
          e.preventDefault();
        }
        handleAction(actionEl);
        return;
      }

      var treeRow = e.target.closest('[data-dqit-tree-key]');
      if (treeRow && pageEl.contains(treeRow)) {
        state.treeKey = treeRow.getAttribute('data-dqit-tree-key') || 'demo';
        state.page = 1;
        state.selectedIds = {};
        renderAll();
        return;
      }

      var pageBtn = e.target.closest('[data-dqit-page]');
      if (pageBtn && pageEl.contains(pageBtn) && !pageBtn.disabled) {
        var rows = getFilteredRows();
        var totalPages = Math.max(1, Math.ceil(rows.length / state.pageSize));
        var target = pageBtn.getAttribute('data-dqit-page');
        if (target === 'prev') state.page = Math.max(1, state.page - 1);
        else if (target === 'next') state.page = Math.min(totalPages, state.page + 1);
        else state.page = Number(target) || 1;
        renderAll();
        return;
      }

      var resultPageBtn = e.target.closest('[data-dqit-result-page]');
      if (resultPageBtn && pageEl.contains(resultPageBtn) && !resultPageBtn.disabled) {
        var resultTotalPages = Math.max(1, Math.ceil(getFilteredReportRunIndexes().length / state.resultPageSize));
        var resultTarget = resultPageBtn.getAttribute('data-dqit-result-page');
        if (resultTarget === 'prev') state.resultPage = Math.max(1, state.resultPage - 1);
        else if (resultTarget === 'next') state.resultPage = Math.min(resultTotalPages, state.resultPage + 1);
        else state.resultPage = Number(resultTarget) || 1;
        renderAll();
        return;
      }

      if (state.openPicker || state.openParamSelect || state.openBasicRuleSelect || state.schedulePopup || state.basicTimePopup) {
        state.openPicker = '';
        state.openParamSelect = '';
        state.openBasicRuleSelect = '';
        state.basicRuleKeyword = '';
        state.schedulePopup = '';
        state.basicTimePopup = '';
        renderAll();
      }
    });

    pageEl.addEventListener('change', function (e) {
      if (e.target.matches('[data-dqit-filter]')) {
        var filterKey = e.target.getAttribute('data-dqit-filter');
        state.filters[filterKey] = e.target.value;
        state.page = 1;
        state.selectedIds = {};
        renderAll();
        return;
      }
      if (e.target.matches('[data-dqit-check-all]')) {
        getVisibleRows().forEach(function (item) {
          if (e.target.checked) state.selectedIds[item.id] = true;
          else delete state.selectedIds[item.id];
        });
        renderAll();
        return;
      }
      if (e.target.matches('[data-dqit-row-check]')) {
        var id = e.target.getAttribute('data-dqit-row-check');
        if (e.target.checked) state.selectedIds[id] = true;
        else delete state.selectedIds[id];
        renderAll();
        return;
      }
      if (e.target.matches('[data-dqit-page-size]')) {
        state.pageSize = Number(e.target.value) || 16;
        state.page = 1;
        state.selectedIds = {};
        renderAll();
        return;
      }
      if (e.target.matches('[data-dqit-result-page-size]')) {
        state.resultPageSize = Number(e.target.value) || 10;
        state.resultPage = 1;
        renderAll();
        return;
      }
      if (e.target.matches('[data-dqit-schedule-field]')) {
        if (!state.form) return;
        state.form.schedule[e.target.getAttribute('data-dqit-schedule-field')] = e.target.value;
        state.schedulePopup = '';
        renderAllKeepFormScroll();
        return;
      }
      if (e.target.matches('[data-dqit-custom-field]')) {
        if (!state.form) return;
        var customKey = e.target.getAttribute('data-dqit-custom-field');
        state.form[customKey] = e.target.value;
        if (customKey === 'ruleMode') {
          state.ruleModal = null;
          state.openPicker = '';
          state.openParamSelect = '';
          state.openBasicRuleSelect = '';
          state.pickerKeyword = '';
          state.paramKeyword = '';
          state.basicRuleKeyword = '';
          renderAllKeepFormScroll();
        }
        return;
      }
      if (e.target.matches('[data-dqit-standard-field], [data-dqit-basic-field]')) {
        if (!state.form) return;
        var formKey = e.target.getAttribute('data-dqit-standard-field') || e.target.getAttribute('data-dqit-basic-field');
        state.form[formKey] = e.target.value;
        if (formKey === 'inspectMode' || formKey === 'paramMode') {
          state.schedulePopup = '';
          state.basicTimePopup = '';
          renderAllKeepFormScroll();
        }
        return;
      }
      if (e.target.matches('[data-dqit-basic-time-param]')) {
        if (!state.form) return;
        ensureBasicFormDefaults();
        state.form.timeParams[e.target.getAttribute('data-dqit-basic-time-param')] = e.target.value;
        return;
      }
      if (e.target.matches('[data-dqit-sql-theme]')) {
        var themeKey = e.target.getAttribute('data-dqit-sql-theme');
        state.sql[themeKey].theme = e.target.value === 'light' ? 'light' : 'dark';
        var editor = pageEl.querySelector('[data-dqit-sql-editor="' + themeKey + '"]');
        if (editor) {
          editor.classList.toggle('theme-light', state.sql[themeKey].theme === 'light');
          editor.classList.toggle('theme-dark', state.sql[themeKey].theme !== 'light');
        }
        return;
      }
      if (e.target.matches('[data-dqit-sql-font]')) {
        var fontKey = e.target.getAttribute('data-dqit-sql-font');
        state.sql[fontKey].font = e.target.value || '14px';
        var fontEditor = pageEl.querySelector('[data-dqit-sql-editor="' + fontKey + '"]');
        if (fontEditor) fontEditor.style.fontSize = state.sql[fontKey].font;
      }
    });

    pageEl.addEventListener('input', function (e) {
      if (e.target.matches('[data-dqit-tree-search]')) {
        state.treeKeyword = e.target.value;
        var tree = pageEl.querySelector('[data-dqit-tree]');
        if (tree) tree.innerHTML = renderTree();
        return;
      }
      if (e.target.matches('[data-dqit-picker-search]')) {
        state.pickerKeyword = e.target.value;
        renderAll();
        return;
      }
      if (e.target.matches('[data-dqit-param-search]')) {
        state.paramKeyword = e.target.value;
        renderAll();
        return;
      }
      if (e.target.matches('[data-dqit-rule-tree-search]')) {
        state.ruleModal.treeKeyword = e.target.value;
        renderAll();
        return;
      }
      if (e.target.matches('[data-dqit-rule-keyword]')) {
        state.ruleModal.keyword = e.target.value;
        renderAll();
        return;
      }
      if (e.target.matches('[data-dqit-standard-tree-search]')) {
        if (!state.standardModal) return;
        state.standardModal.treeKeyword = e.target.value;
        renderAll();
        return;
      }
      if (e.target.matches('[data-dqit-standard-keyword]')) {
        if (!state.standardModal) return;
        state.standardModal.keyword = e.target.value;
        renderAll();
        return;
      }
      if (e.target.matches('[data-dqit-basic-rule-search]')) {
        state.basicRuleKeyword = e.target.value;
        renderAllKeepFormScroll();
        return;
      }
      if (e.target.matches('[data-dqit-basic-field-tree-search]')) {
        if (!state.basicFieldModal) return;
        state.basicFieldModal.treeKeyword = e.target.value;
        renderAllKeepFormScroll();
        return;
      }
      if (e.target.matches('[data-dqit-basic-field-keyword]')) {
        if (!state.basicFieldModal) return;
        state.basicFieldModal.keyword = e.target.value;
        renderAllKeepFormScroll();
        return;
      }
      if (e.target.matches('[data-dqit-form-field]')) {
        if (!state.form) return;
        state.form[e.target.getAttribute('data-dqit-form-field')] = e.target.value;
        return;
      }
      if (e.target.matches('[data-dqit-schedule-field]')) {
        if (!state.form) return;
        state.form.schedule[e.target.getAttribute('data-dqit-schedule-field')] = e.target.value;
        updateScheduleHint();
        return;
      }
      if (e.target.matches('[data-dqit-sql-content]')) {
        var key = e.target.getAttribute('data-dqit-sql-content');
        var draft = state.basicParamModal && key !== 'basicCustom' ? state.basicParamModal.draft : state.form;
        setDraftSqlValue(draft, key, e.target.innerText || e.target.textContent || '');
        var gutter = pageEl.querySelector('[data-dqit-sql-gutter="' + key + '"]');
        if (gutter) gutter.innerHTML = lineNumbers(e.target.innerText || e.target.textContent || '');
      }
      if (e.target.matches('[data-dqit-basic-time-param]')) {
        if (!state.form) return;
        ensureBasicFormDefaults();
        state.form.timeParams[e.target.getAttribute('data-dqit-basic-time-param')] = e.target.value;
        return;
      }
    });

    pageEl.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && (e.target.id === 'dqitKeywordInput' || e.target.id === 'dqitTargetInput')) {
        var query = pageEl.querySelector('[data-dqit-action="query"]');
        if (query) query.click();
      }
      if (e.key === 'Escape') {
        if (state.modal || state.ruleModal || state.standardModal || state.basicFieldModal || state.basicParamModal || state.testSqlModal || state.reportSqlModal || state.reportLogModal || state.openPicker || state.openParamSelect || state.openBasicRuleSelect || state.schedulePopup || state.basicTimePopup) {
          state.modal = null;
          state.ruleModal = null;
          state.standardModal = null;
          state.basicFieldModal = null;
          state.basicParamModal = null;
          state.testSqlModal = null;
          state.reportSqlModal = null;
          state.reportLogModal = null;
          state.openPicker = '';
          state.openParamSelect = '';
          state.openBasicRuleSelect = '';
          state.basicRuleKeyword = '';
          state.schedulePopup = '';
          state.basicTimePopup = '';
          renderAll();
        }
      }
    });
  }

  function resetState() {
    state.view = 'list';
    state.formMode = 'create';
    state.formKind = 'custom';
    state.editingId = '';
    state.treeKey = 'demo';
    state.treeKeyword = '';
    state.treeOpen = {
      demo: true,
      'demo-warehouse': true,
      business: true,
      'biz-core': true,
      standard: true,
      'standard-domain': true,
      'ds-root': true,
      'ds-business': true,
      'rule-demo': true,
      'rule-business': true,
      'std-business': true,
      'std-warehouse': true
    };
    state.selectedIds = {};
    state.page = 1;
    state.pageSize = 16;
    state.filters = { status: '', type: '', keyword: '', targetKeyword: '' };
    state.form = null;
    state.modal = null;
    state.ruleModal = null;
    state.standardModal = null;
    state.basicFieldModal = null;
    state.basicParamModal = null;
    state.testSqlModal = null;
    state.viewTaskId = '';
    state.reportRunIndex = 0;
    state.resultPage = 1;
    state.resultPageSize = 10;
    state.resultExecutionMode = '';
    state.openPicker = '';
    state.pickerKeyword = '';
    state.openParamSelect = '';
    state.paramKeyword = '';
    state.openBasicRuleSelect = '';
    state.basicRuleKeyword = '';
    state.schedulePopup = '';
    state.basicTimePopup = '';
    state.sql = {
      template: { theme: 'dark', font: '14px', searchOpen: false },
      generated: { theme: 'dark', font: '14px', searchOpen: false },
      customRule: { theme: 'dark', font: '14px', searchOpen: false },
      basicCustom: { theme: 'dark', font: '14px', searchOpen: false },
      reportSql: { theme: 'dark', font: '14px', searchOpen: false }
    };
  }

  return {
    html: '<div class="page-quality-inspect-task"></div>',
    init: function (opts) {
      pageEl = document.querySelector('.page-quality-inspect-task');
      if (!pageEl) return;
      resetState();
      var routeTask = ensureRouteTask(opts || {});
      if (routeTask) {
        var routeKind = routeTask.type === '标准稽查' ? 'standard' : (routeTask.type === '基础稽查' ? 'basic' : 'custom');
        openForm(routeKind, 'edit', routeTask.id, { silent: true });
      }
      bindEvents();
      renderAll();
    }
  };
})();
