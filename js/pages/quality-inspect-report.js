/**
 * 数据中台 V4.0 - 数据资产 / 数据质量 / 稽查报告
 * 静态高保真原型：按数据源汇总表级稽查报告，支持查看质量报告详情
 */
window.DP = window.DP || {};
DP.pages = DP.pages || {};

DP.pages.qualityInspectReport = (function () {
  var pageEl = null;
  var templateEditorSavedRange = null;
  var templatePieCharts = [];
  var templatePieResizeHandler = null;

  var state = {
    view: 'list',
    section: 'report',
    configKeyword: '',
    configStatus: '',
    configExecStatus: '',
    configDataRangeStatus: '',
    relatedTaskFilter: '',
    relatedTaskDropdownOpen: false,
    relatedTaskKeyword: '',
    editingConfigNameId: '',
    configPage: 1,
    configPageSize: 10,
    selectedConfigId: '',
    treeKey: 'all',
    treeKeyword: '',
    keyword: '',
    page: 1,
    pageSize: 10,
    historyPage: 1,
    historyPageSize: 10,
    scheduleRecordPage: 1,
    scheduleRecordPageSize: 10,
    scheduleDetailPage: 1,
    scheduleDetailPageSize: 10,
    scheduleRecordStatus: '',
    scheduleRecordStartDate: '',
    scheduleRecordEndDate: '',
    scheduleDetailStatus: '',
    scheduleDetailTaskKeyword: '',
    scheduleDetailTableKeyword: '',
    scheduleRunOverrides: {},
    scheduleRuleOverrides: {},
    selectedScheduleRunId: '',
    selectedScheduleRuleRunId: '',
    scheduleLogBackView: 'schedule-records',
    scheduleSqlModalOpen: false,
    scheduleSql: { theme: 'dark', font: '14px', searchOpen: false },
    selectedReportId: '',
    reportViewTab: 'overview',
    rulePages: {},
    rulePageSize: 5,
    templateEditorHtml: '',
    templateZoom: 100,
    reportPreviewZoom: 100,
    templateNameEditing: false,
    templateDescEditing: false,
    templateManageTab: 'template',
    templateEditTarget: 'common',
    templateEditGroupId: '',
    templateScopeKeyword: '',
    templateScopePage: 1,
    templateScopePageSize: 10,
    templateScopeSelected: {},
    templateScopeModalOpen: false,
    templateScopeModalTreeKey: 'all',
    templateScopeModalKeyword: '',
    templateScopeModalSelected: {},
    templateFilterKeyword: '',
    templateFilterActiveGroupId: '',
    templateFilterModalOpen: false,
    templateFilterModalGroupId: '',
    templateFilterModalRowId: '',
    templateFilterModalMode: 'visual',
    templateFilterModalDraft: null,
    templateFilterFieldKeyword: '',
    templateFilterSql: { theme: 'dark', font: '14px', searchOpen: false },
    templateFilterPages: {},
    templateFilterPageSizes: {},
    templateVariableKeyword: '',
    templateVariableCollapsed: false,
    templateOutlineCollapsed: false,
    templateDashboardModalOpen: false,
    templateCopyModalOpen: false,
    templateCopyTargetGroupId: '',
    templateDashboardKeyword: '',
    templateDashboardFilter: 'all',
    templateDashboardPage: 1,
    templateDashboardSelected: {},
    templateScheduleModalOpen: false,
    startScheduleModalOpen: false,
    startScheduleConfigId: '',
    templateScheduleDraft: null,
    treeOpen: {
      all: true,
      production: true,
      warehouse: true,
      business: true,
      test: true
    }
  };

  function normalizeSection(section) {
    return section === 'schedule' ? 'schedule' : 'report';
  }

  function isScheduleSection() {
    return state.section === 'schedule';
  }

  var dataSourceParents = {
    prod_mysql_master: '生产数据库',
    prod_mysql_slave: '生产数据库',
    prod_postgresql: '生产数据库',
    dw_hive_ods: '数据仓库',
    dw_hive_dwd: '数据仓库',
    dw_hive_dws: '数据仓库',
    dw_hive_ads: '数据仓库',
    erp_oracle_db: '业务系统',
    crm_sqlserver: '业务系统',
    oa_mysql_db: '业务系统',
    test_mysql_db: '测试环境',
    test_clickhouse: '测试环境',
    test_mongodb: '测试环境'
  };

  var reportTree = [
    {
      key: 'all',
      label: '数据源目录 (13)',
      icon: 'bi-stack',
      children: [
        {
          key: 'production',
          label: '生产数据库 (3)',
          icon: 'bi-folder2-open',
          children: [
            { key: 'prod_mysql_master', label: 'prod_mysql_master', icon: 'bi-database' },
            { key: 'prod_mysql_slave', label: 'prod_mysql_slave', icon: 'bi-database' },
            { key: 'prod_postgresql', label: 'prod_postgresql', icon: 'bi-database' }
          ]
        },
        {
          key: 'warehouse',
          label: '数据仓库 (4)',
          icon: 'bi-folder2-open',
          children: [
            { key: 'dw_hive_ods', label: 'dw_hive_ods', icon: 'bi-database' },
            { key: 'dw_hive_dwd', label: 'dw_hive_dwd', icon: 'bi-database' },
            { key: 'dw_hive_dws', label: 'dw_hive_dws', icon: 'bi-database' },
            { key: 'dw_hive_ads', label: 'dw_hive_ads', icon: 'bi-database' }
          ]
        },
        {
          key: 'business',
          label: '业务系统 (3)',
          icon: 'bi-folder2-open',
          children: [
            { key: 'erp_oracle_db', label: 'erp_oracle_db', icon: 'bi-database' },
            { key: 'crm_sqlserver', label: 'crm_sqlserver', icon: 'bi-database' },
            { key: 'oa_mysql_db', label: 'oa_mysql_db', icon: 'bi-database' }
          ]
        },
        {
          key: 'test',
          label: '测试环境 (3)',
          icon: 'bi-folder2-open',
          children: [
            { key: 'test_mysql_db', label: 'test_mysql_db', icon: 'bi-database' },
            { key: 'test_clickhouse', label: 'test_clickhouse', icon: 'bi-database' },
            { key: 'test_mongodb', label: 'test_mongodb', icon: 'bi-database' }
          ]
        }
      ]
    }
  ];

  var reportRows = [
    report('rep-order-main', 'order_main', '订单主表', 'prod_mysql_master', 5, 83.2, 38, 1438920, '2026-06-29 14:54:09', '订单核心交易数据质量稽查'),
    report('rep-order-detail', 'order_detail', '订单明细表', 'prod_mysql_master', 6, 88.6, 26, 3892105, '2026-06-29 14:51:22', '订单商品明细完整性稽查'),
    report('rep-order-payment', 'order_payment', '订单支付记录', 'prod_mysql_master', 5, 91.4, 18, 1205680, '2026-06-29 14:46:18', '支付流水一致性稽查'),
    report('rep-order-status-log', 'order_status_log', '订单状态变更日志', 'prod_mysql_master', 4, 79.5, 42, 5620340, '2026-06-29 14:40:03', '订单状态枚举稽查'),
    report('rep-product-info', 'product_info', '商品信息表', 'prod_mysql_slave', 5, 94.7, 9, 86742, '2026-06-29 13:22:10', '商品主数据基础质量稽查'),
    report('rep-dim-region', 'dim_region', '区域维度表', 'prod_mysql_slave', 4, 96.3, 5, 3624, '2026-06-28 13:18:33', '行政区划标准映射稽查'),
    report('rep-inventory-snapshot', 'inventory_snapshot', '库存快照表', 'prod_postgresql', 5, 86.9, 31, 9450200, '2026-06-28 12:55:42', '库存数量范围稽查'),
    report('rep-ods-workorder-ticket', 'ods_workorder_ticket', '工单贴源表', 'dw_hive_ods', 6, 82.1, 47, 2865340, '2026-06-29 03:30:16', '工单贴源完整性稽查'),
    report('rep-ods-user-behavior', 'ods_user_behavior_log', '用户行为日志表', 'dw_hive_ods', 5, 89.8, 22, 89320600, '2026-06-29 03:12:05', '埋点行为日志有效性稽查'),
    report('rep-dwd-order-fact', 'dwd_order_fact', '订单事实宽表', 'dw_hive_dwd', 6, 85.6, 36, 1438920, '2026-06-28 02:45:11', '订单事实宽表一致性稽查'),
    report('rep-dwd-customer-profile', 'dwd_customer_profile', '客户画像明细表', 'dw_hive_dwd', 5, 90.5, 17, 328915, '2026-06-28 02:38:27', '客户画像字段完整性稽查'),
    report('rep-dws-order-daily', 'dws_order_daily', '订单日汇总表', 'dw_hive_dws', 5, 92.8, 12, 12580, '2026-06-27 03:20:00', '订单汇总一致性稽查'),
    report('rep-dws-user-profile', 'dws_user_profile', '用户画像宽表', 'dw_hive_dws', 6, 87.2, 29, 241836, '2026-06-27 03:16:24', '用户标签汇总质量稽查'),
    report('rep-ads-gmv-summary', 'ads_gmv_summary', 'GMV汇总表', 'dw_hive_ads', 5, 93.5, 8, 4580, '2026-06-29 04:10:58', 'GMV指标口径稽查'),
    report('rep-ads-order-overview', 'ads_order_overview', '订单概览报表', 'dw_hive_ads', 4, 95.6, 6, 365, '2026-06-29 04:05:36', '订单概览报表质量稽查'),
    report('rep-employee-info', 'employee_info', '员工信息表', 'erp_oracle_db', 5, 84.9, 34, 18630, '2026-06-28 10:18:57', '员工手机号有效性稽查'),
    report('rep-supplier-contract', 'supplier_contract', '供应商合同表', 'erp_oracle_db', 4, 88.1, 19, 52460, '2026-06-27 10:06:12', '供应商合同日期范围稽查'),
    report('rep-crm-customer-info', 'crm_customer_info', 'CRM客户信息表', 'crm_sqlserver', 5, 81.7, 44, 265890, '2026-06-29 09:45:28', '客户证件与联系方式稽查'),
    report('rep-crm-contact-record', 'crm_contact_record', '客户触达记录表', 'crm_sqlserver', 4, 90.1, 16, 786320, '2026-06-28 09:31:40', '触达记录时间完整性稽查'),
    report('rep-oa-leave-apply', 'oa_leave_apply', '请假申请表', 'oa_mysql_db', 8, 98.0, 860, 42960, '2026-06-30 10:05:02', '请假流程状态稽查'),
    report('rep-oa-sys-department', 'sys_departmen', '部门表', 'oa_mysql_db', 6, 99.5, 12, 2450, '2026-06-30 10:05:02', 'OA组织部门基础数据检核'),
    report('rep-oa-sys-user', 'sys_user', '员工主表', 'oa_mysql_db', 7, 99.3, 18, 2452, '2026-06-30 10:05:02', 'OA员工主数据完整性检核'),
    report('rep-oa-sys-post', 'sys_post', '岗位表', 'oa_mysql_db', 5, 98.7, 3, 238, '2026-06-30 10:05:02', 'OA岗位数据有效性检核'),
    report('rep-oa-sys-role', 'sys_role', '角色表', 'oa_mysql_db', 6, 99.2, 1, 126, '2026-06-30 10:05:02', 'OA角色权限唯一性检核'),
    report('rep-oa-position-grade', 'sys_position_grade', '岗位职级表', 'oa_mysql_db', 4, 98.8, 1, 84, '2026-06-30 10:05:02', 'OA岗位职级基础数据检核'),
    report('rep-oa-user-role', 'sys_user_role', '用户角色关系表', 'oa_mysql_db', 5, 99.4, 29, 5120, '2026-06-30 10:05:02', 'OA用户角色关系一致性检核'),
    report('rep-oa-org-relation', 'sys_org_relation', '组织关系表', 'oa_mysql_db', 5, 99.4, 31, 4860, '2026-06-30 10:05:02', 'OA组织关系完整性检核'),
    report('rep-oa-flow-task', 'oa_flow_task', '流程任务表', 'oa_mysql_db', 8, 97.6, 1640, 68240, '2026-06-30 10:05:02', 'OA流程任务状态一致性检核'),
    report('rep-oa-attendance-record', 'oa_attendance_record', '考勤记录表', 'oa_mysql_db', 8, 95.8, 3860, 92760, '2026-06-30 10:05:02', 'OA考勤记录及时性检核'),
    report('rep-oa-notice-read', 'oa_notice_read', '公告阅读表', 'oa_mysql_db', 5, 99.1, 168, 18360, '2026-06-30 10:05:02', 'OA公告阅读记录完整性检核'),
    report('rep-oa-contract-archive', 'oa_contract_archive', '合同归档表', 'oa_mysql_db', 6, 98.2, 32, 1760, '2026-06-30 10:05:02', 'OA合同归档字段规范性检核'),
    report('rep-oa-asset-card', 'oa_asset_card', '资产卡片表', 'oa_mysql_db', 6, 98.7, 42, 3210, '2026-06-30 10:05:02', 'OA资产卡片编码唯一性检核'),
    report('rep-oa-meeting-room', 'oa_meeting_room', '会议室表', 'oa_mysql_db', 4, 98.5, 1, 68, '2026-06-30 10:05:02', 'OA会议室基础信息检核'),
    report('rep-oa-vehicle-apply', 'oa_vehicle_apply', '用车申请表', 'oa_mysql_db', 6, 96.9, 68, 2190, '2026-06-30 10:05:02', 'OA用车申请流程字段检核'),
    report('rep-test-order-main', 'test_order_main', '测试订单主表', 'test_mysql_db', 4, 78.3, 53, 9280, '2026-06-26 11:20:10', '测试订单基础规则稽查'),
    report('rep-test-clickhouse-log', 'test_event_log_ck', '测试事件日志表', 'test_clickhouse', 4, 82.7, 25, 182640, '2026-06-25 11:08:35', '测试日志字段稽查'),
    report('rep-test-mongodb-profile', 'test_user_profile_doc', '测试用户画像文档', 'test_mongodb', 4, 89.4, 11, 38420, '2026-06-25 10:52:21', '测试画像文档完整性稽查')
  ];

  var oaQualityReportIds = [
    'rep-oa-sys-department',
    'rep-oa-sys-user',
    'rep-oa-sys-post',
    'rep-oa-sys-role',
    'rep-oa-position-grade',
    'rep-oa-user-role',
    'rep-oa-org-relation',
    'rep-oa-leave-apply',
    'rep-oa-flow-task',
    'rep-oa-attendance-record',
    'rep-oa-notice-read',
    'rep-oa-contract-archive',
    'rep-oa-asset-card',
    'rep-oa-meeting-room',
    'rep-oa-vehicle-apply'
  ];

  var configExecutionStatusMap = {
    'cfg-core-trade': '执行成功',
    'cfg-warehouse-layer': '执行中',
    'cfg-customer-service': '执行失败',
    'cfg-master-data': '执行失败',
    'cfg-business-system': '执行成功',
    'cfg-test-env': '执行失败'
  };

  var configTaskNameMap = {
    'cfg-core-trade': 'OA基础数据月度检核任务',
    'cfg-warehouse-layer': '数仓分层质量每日稽查任务',
    'cfg-customer-service': '客户运营数据质量周检任务',
    'cfg-master-data': '主数据标准映射月度稽查任务',
    'cfg-business-system': 'OA业务系统月度稽查任务',
    'cfg-test-env': '测试环境质量周检任务'
  };

  var reportConfigs = [
    reportConfig('cfg-core-trade', 'OA系统数据质量检核报告', 1, 15, 24, '已启动', { type: '每月', day: '1号', time: '10:05:02' }, '2026-06-30 10:05:02', '按月汇总 OA 系统组织、员工、岗位、角色、流程、考勤、资产等基础表的数据质量检核结果。', oaQualityReportIds.slice()),
    reportConfig('cfg-warehouse-layer', '数仓分层质量稽查报告', 4, 36, 82, '已启动', { type: '每天', time: '03:30:00' }, '2026-06-29 03:30:00', '面向 ODS、DWD、DWS、ADS 分层统计稽查任务执行情况，重点关注入仓完整性和汇总口径一致性。', ['rep-ods-workorder-ticket', 'rep-ods-user-behavior', 'rep-dwd-order-fact', 'rep-dwd-customer-profile', 'rep-dws-order-daily', 'rep-dws-user-profile', 'rep-ads-gmv-summary', 'rep-ads-order-overview']),
    reportConfig('cfg-customer-service', '客户运营数据质量周报', 2, 14, 31, '已启动', { type: '每周', weekday: '周一', time: '10:05:02' }, '2026-06-29 10:05:02', '统计客户主数据、触达记录和用户画像类质量任务，辅助客户运营团队跟踪证件、联系方式和标签取值问题。', ['rep-dwd-customer-profile', 'rep-crm-customer-info', 'rep-crm-contact-record', 'rep-dws-user-profile']),
    reportConfig('cfg-master-data', '主数据标准映射稽查报告', 2, 8, 18, '未启动', { type: '每月', day: '1号', time: '10:05:02' }, '2026-06-01 10:05:02', '计划汇总商品、区域、供应商等主数据标准映射稽查结果，用于月度主数据治理例会复盘。', ['rep-product-info', 'rep-dim-region', 'rep-supplier-contract']),
    reportConfig('cfg-business-system', 'OA系统数据质量检核报告', 1, 15, 24, '已启动', { type: '每月', day: '1号', time: '10:05:02' }, '2026-06-01 10:05:02', '按月汇总 OA 系统组织、员工、岗位、角色、流程、考勤、资产等基础表的数据质量检核结果。', oaQualityReportIds.slice()),
    reportConfig('cfg-test-env', '测试环境质量稽查报告', 3, 9, 21, '未启动', { type: '每周', weekday: '周一', time: '10:05:02' }, '2026-06-22 10:05:02', '用于测试库、测试日志和测试画像文档的数据质量演示，当前暂未启用周期生成。', ['rep-test-order-main', 'rep-test-clickhouse-log', 'rep-test-mongodb-profile'])
  ];

  var reportHistories = [
    historyReport('hist-core-trade-20260629', 'cfg-core-trade', '2026-06-29 10:05:02', 0, 1),
    historyReport('hist-core-trade-20260628', 'cfg-core-trade', '2026-06-28 10:05:02', -0.8, 0.97),
    historyReport('hist-core-trade-20260627', 'cfg-core-trade', '2026-06-27 10:05:02', 0.5, 1.03),
    historyReport('hist-core-trade-20260626', 'cfg-core-trade', '2026-06-26 10:05:02', -1.2, 0.94),
    historyReport('hist-warehouse-layer-20260629', 'cfg-warehouse-layer', '2026-06-29 03:30:00', 0, 1),
    historyReport('hist-warehouse-layer-20260628', 'cfg-warehouse-layer', '2026-06-28 03:30:00', -0.6, 0.99),
    historyReport('hist-warehouse-layer-20260627', 'cfg-warehouse-layer', '2026-06-27 03:30:00', 0.4, 1.02),
    historyReport('hist-customer-service-20260629', 'cfg-customer-service', '2026-06-29 10:05:02', 0, 1),
    historyReport('hist-customer-service-20260622', 'cfg-customer-service', '2026-06-22 10:05:02', -0.9, 0.96),
    historyReport('hist-customer-service-20260615', 'cfg-customer-service', '2026-06-15 10:05:02', 0.7, 1.01),
    historyReport('hist-master-data-20260601', 'cfg-master-data', '2026-06-01 10:05:02', 0.3, 0.98),
    historyReport('hist-master-data-20260501', 'cfg-master-data', '2026-05-01 10:05:02', -0.5, 0.95),
    historyReport('hist-business-system-20260601', 'cfg-business-system', '2026-06-01 10:05:02', 0, 1),
    historyReport('hist-business-system-20260501', 'cfg-business-system', '2026-05-01 10:05:02', -0.7, 0.97),
    historyReport('hist-business-system-20260401', 'cfg-business-system', '2026-04-01 10:05:02', 0.6, 1.02),
    historyReport('hist-test-env-20260622', 'cfg-test-env', '2026-06-22 10:05:02', 0.2, 0.9),
    historyReport('hist-test-env-20260615', 'cfg-test-env', '2026-06-15 10:05:02', -0.6, 0.88)
  ];

  var templateFilterGroupsByConfig = {
    'cfg-core-trade': [],
    'cfg-warehouse-layer': [
      {
        id: 'fg-warehouse-ods',
        name: 'ODS有效业务数据',
        desc: '排除测试、逻辑删除和非生产状态记录。',
        editing: false,
        rows: [
          { id: 'fr-warehouse-ods-ticket', reportId: 'rep-ods-workorder-ticket', tableName: 'ods_workorder_ticket', alias: '工单贴源表', condition: "is_deleted = 0 AND env_flag = 'prod'", desc: '仅统计生产环境有效工单。' },
          { id: 'fr-warehouse-ods-behavior', reportId: 'rep-ods-user-behavior', tableName: 'ods_user_behavior_log', alias: '用户行为日志表', condition: "event_type IS NOT NULL AND event_time >= '${biz_date}'", desc: '过滤无事件类型和非本周期行为日志。' }
        ]
      },
      {
        id: 'fg-warehouse-summary',
        name: '汇总层口径过滤',
        desc: '限定订单、GMV 和用户汇总的有效统计口径。',
        editing: false,
        rows: [
          { id: 'fr-warehouse-dwd-order', reportId: 'rep-dwd-order-fact', tableName: 'dwd_order_fact', alias: '订单事实宽表', condition: "order_status NOT IN ('CANCELLED','TEST')", desc: '剔除取消订单和测试订单。' },
          { id: 'fr-warehouse-ads-gmv', reportId: 'rep-ads-gmv-summary', tableName: 'ads_gmv_summary', alias: 'GMV汇总表', condition: 'stat_date BETWEEN ${start_date} AND ${end_date}', desc: '按报告周期限定 GMV 汇总范围。' }
        ]
      }
    ],
    'cfg-customer-service': [
      {
        id: 'fg-customer-master',
        name: '客户主数据有效性',
        desc: '限定可触达客户与有效画像标签。',
        editing: false,
        rows: [
          { id: 'fr-customer-crm-info', reportId: 'rep-crm-customer-info', tableName: 'crm_customer_info', alias: 'CRM客户信息表', condition: "customer_status = 'ACTIVE' AND mobile IS NOT NULL", desc: '仅纳入可运营客户。' },
          { id: 'fr-customer-dwd-profile', reportId: 'rep-dwd-customer-profile', tableName: 'dwd_customer_profile', alias: '客户画像明细表', condition: "tag_version = '${latest_version}'", desc: '使用最新画像标签版本。' }
        ]
      },
      {
        id: 'fg-customer-contact',
        name: '触达记录范围',
        desc: '按运营周期统计有效触达记录。',
        editing: false,
        rows: [
          { id: 'fr-customer-contact-record', reportId: 'rep-crm-contact-record', tableName: 'crm_contact_record', alias: '客户触达记录表', condition: "contact_result <> 'INVALID'", desc: '排除无效触达结果。' }
        ]
      }
    ],
    'cfg-master-data': [
      {
        id: 'fg-master-product',
        name: '商品主数据过滤',
        desc: '只统计上架或待上架商品主数据。',
        editing: false,
        rows: [
          { id: 'fr-master-product', reportId: 'rep-product-info', tableName: 'product_info', alias: '商品信息表', condition: "product_status IN ('ON_SHELF','PENDING')", desc: '排除已删除和历史归档商品。' },
          { id: 'fr-master-region', reportId: 'rep-dim-region', tableName: 'dim_region', alias: '区域维度表', condition: 'region_level <= 4 AND enabled_flag = 1', desc: '纳入有效行政区划层级。' }
        ]
      },
      {
        id: 'fg-master-supplier',
        name: '供应商合同周期',
        desc: '过滤报告周期内仍有效的供应商合同。',
        editing: false,
        rows: [
          { id: 'fr-master-supplier-contract', reportId: 'rep-supplier-contract', tableName: 'supplier_contract', alias: '供应商合同表', condition: "contract_status = 'VALID' AND expire_date >= '${biz_date}'", desc: '仅保留有效合同。' }
        ]
      }
    ],
    'cfg-business-system': [
      {
        id: 'fg-business-org',
        name: 'OA组织人员有效数据',
        desc: '限定启用组织、在岗员工和有效角色关系。',
        editing: false,
        rows: [
          { id: 'fr-business-dept', reportId: 'rep-oa-sys-department', tableName: 'sys_departmen', alias: '部门表', condition: 'del_flag = 0 AND status = 1', desc: '排除停用和逻辑删除部门。' },
          { id: 'fr-business-user', reportId: 'rep-oa-sys-user', tableName: 'sys_user', alias: '员工主表', condition: "employee_status = 'ON_DUTY'", desc: '仅统计在岗员工。' },
          { id: 'fr-business-user-role', reportId: 'rep-oa-user-role', tableName: 'sys_user_role', alias: '用户角色关系表', condition: 'valid_flag = 1', desc: '仅纳入有效授权关系。' }
        ]
      },
      {
        id: 'fg-business-flow',
        name: 'OA流程周期过滤',
        desc: '按报告月份限定流程、考勤和资产相关数据。',
        editing: false,
        rows: [
          { id: 'fr-business-flow-task', reportId: 'rep-oa-flow-task', tableName: 'oa_flow_task', alias: '流程任务表', condition: "created_time >= '${month_start}' AND created_time < '${next_month_start}'", desc: '统计本月发起流程任务。' },
          { id: 'fr-business-attendance', reportId: 'rep-oa-attendance-record', tableName: 'oa_attendance_record', alias: '考勤记录表', condition: "attendance_date BETWEEN '${month_start}' AND '${month_end}'", desc: '限定本月考勤记录。' }
        ]
      }
    ],
    'cfg-test-env': [
      {
        id: 'fg-test-demo',
        name: '测试环境演示过滤',
        desc: '保留测试环境内可演示的数据质量样本。',
        editing: false,
        rows: [
          { id: 'fr-test-order', reportId: 'rep-test-order-main', tableName: 'test_order_main', alias: '测试订单主表', condition: "mock_flag = 0", desc: '剔除自动造数样本。' },
          { id: 'fr-test-log', reportId: 'rep-test-clickhouse-log', tableName: 'test_event_log_ck', alias: '测试事件日志表', condition: 'event_time >= now() - INTERVAL 30 DAY', desc: '只看近30天事件日志。' }
        ]
      },
      {
        id: 'fg-test-profile',
        name: '测试画像文档过滤',
        desc: '排除空画像与废弃测试账号。',
        editing: false,
        rows: [
          { id: 'fr-test-profile', reportId: 'rep-test-mongodb-profile', tableName: 'test_user_profile_doc', alias: '测试用户画像文档', condition: 'profile_tags IS NOT NULL', desc: '仅统计存在标签的画像文档。' }
        ]
      }
    ]
  };

  var templateVariables = [
    { name: '统计范围', desc: '数据源、表、质量任务的汇总范围', sample: '1个数据源，15张表，24个质量任务' },
    { name: '数据源数量', desc: '纳入本报告统计的数据源数量', sample: '1' },
    { name: '表数量', desc: '纳入本报告统计的数据表数量', sample: '15' },
    { name: '字段数', desc: '纳入本报告检核的数据量，按万条展示', sample: '24.49' },
    { name: '质量任务数', desc: '报告关联质量任务总数', sample: '24' },
    { name: '平均通过率', desc: '本周期质量任务平均通过率', sample: '97.24%' },
    { name: '问题总记录数', desc: '本周期发现的问题总记录数量', sample: '6,766' },
    { name: '稽查总数据记录数', desc: '本周期参与检核的数据总记录数', sample: '244,878' },
    { name: '完整性合规比例', desc: '完整性规则检核合规比例', sample: '99.34%' },
    { name: '一致性合规比例', desc: '一致性规则检核合规比例', sample: '99.58%' },
    { name: '唯一性合规', desc: '唯一性规则检核合规比例', sample: '99.91%' },
    { name: '有效性合规比例', desc: '有效性规则检核合规比例', sample: '99.82%' },
    { name: '准确性合规比例', desc: '准确性规则检核合规比例', sample: '99.73%' },
    { name: '及时性合规比例', desc: '及时性规则检核合规比例', sample: '99.88%' },
    { name: '最后生成时间', desc: '报告最近一次生成时间', sample: '2026-06-30 10:05:02' },
    { name: '年份', desc: '报告生成时的当前年份', sample: '2026年' },
    { name: '月份', desc: '报告生成时的当前月份', sample: '2026年7月' },
    { name: '日期', desc: '报告生成时的当前日期', sample: '2026年7月1日' },
    { name: '时间', desc: '报告生成时的当前时间', sample: '12:00:00' },
    { name: '日期时间', desc: '报告生成时的当前日期和时间', sample: '2026年7月1日 12:00:00' }
  ];

  var templateDashboardFilters = [
    { key: 'all', label: '全部', icon: 'bi-grid' },
    { key: 'chart', label: '图表', icon: 'bi-bar-chart-line' },
    { key: 'table', label: '表格', icon: 'bi-table' }
  ];

  var templateDashboardPageSize = 6;

  var templateDashboardInsertMarker = 'qir-dashboard-insert-marker';
  var templateZoomMin = 60;
  var templateZoomMax = 160;
  var templateZoomStep = 10;
  var templateRulePieColors = ['#25577f', '#2f75a8', '#4d94bd', '#6fb0d1', '#9bc8df', '#c7dceb'];
  var templateTrendChartColors = {
    bar: '#3f8fc9',
    barEnd: '#7fc4e8',
    line: '#27a97b',
    lineSoft: 'rgba(39,169,123,.12)'
  };
  var templateScheduleTypes = [
    { value: '每天', label: '每天' },
    { value: '每周', label: '每周' },
    { value: '每月', label: '每月' }
  ];
  var templateScheduleWeekOptions = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
  var templateScheduleDayOptions = [
    '1号', '2号', '3号', '4号', '5号', '6号', '7号', '8号',
    '9号', '10号', '11号', '12号', '13号', '14号', '15号', '16号',
    '17号', '18号', '19号', '20号', '21号', '22号', '23号', '24号',
    '25号', '26号', '27号', '28号', '29号', '30号', '31号', '最后一天'
  ];

  var templateDashboardOptions = [
    { id: 'dash-template-rule-pie', name: '检核规则数量分布', type: 'pie', typeLabel: '饼图仪表盘', icon: 'bi-pie-chart', scope: '数据质量检核总体情况', desc: '基于规则类型分布表的检核问题条数生成占比饼图。', metrics: '6类规则', updateTime: '2026-06-29 10:05:02' },
    { id: 'dash-template-rule-table', name: '规则类型分布表', type: 'table', typeLabel: '表格仪表盘', icon: 'bi-table', scope: '数据质量检核总体情况', desc: '展示完整性、一致性、唯一性等规则类型的合规比例和检核问题条数。', metrics: '3列 / 6行', updateTime: '2026-06-29 10:05:02' },
    { id: 'dash-template-quality-good-top-table', name: '质量好Top10', type: 'table', typeLabel: '表格仪表盘', icon: 'bi-table', scope: '总体概述', desc: '按检核问题率从低到高展示质量最好的10张表。', metrics: '6列 / 10行', updateTime: '2026-06-29 10:05:02' },
    { id: 'dash-template-quality-bad-top-table', name: '数据差Top10', type: 'table', typeLabel: '表格仪表盘', icon: 'bi-table', scope: '总体概述', desc: '按检核问题率从高到低展示质量最差的10张表。', metrics: '6列 / 10行', updateTime: '2026-06-29 10:05:02' },
    { id: 'dash-template-check-table', name: '质量维度检核结果表', type: 'table', typeLabel: '表格仪表盘', icon: 'bi-table', scope: '数据质量检核结果', desc: '按质量维度展示相关表的检核数据条数、问题条数和问题率。', metrics: '5列 / 5行', updateTime: '2026-06-29 10:05:02' },
    { id: 'dash-template-trend-chart', name: '问题整改趋势图', type: 'chart', typeLabel: '柱折图仪表盘', icon: 'bi-bar-chart-line', scope: '问题整改进度', desc: '近12次检核问题条数与整改率双轴趋势图。', metrics: '近12次', updateTime: '2026-06-29 10:05:02' },
    { id: 'dash-template-trend-table', name: '问题整改进度表', type: 'table', typeLabel: '表格仪表盘', icon: 'bi-table', scope: '问题整改进度', desc: '按序号和日期时间展示表数据量、检核问题条数、问题率和整改率变化。', metrics: '7列 / 12行', updateTime: '2026-06-29 10:05:02' }
  ];

  var templateOutlineSections = [
    { number: '1', title: '数据质量检核总体情况', level: 1, page: '1' },
    { number: '1.1', title: '总体概述', level: 2, page: '1' },
    { number: '1.1.1', title: '质量好Top10', level: 3, page: '2' },
    { number: '1.1.2', title: '数据差Top10', level: 3, page: '2' },
    { number: '1.2', title: '检核结果', level: 2, page: '3' },
    { number: '1.2.1', title: '数据完整性', level: 3, page: '3' },
    { number: '1.2.2', title: '数据一致性', level: 3, page: '3' },
    { number: '1.2.3', title: '数据唯一性', level: 3, page: '4' },
    { number: '1.2.4', title: '数据准确性', level: 3, page: '4' },
    { number: '1.2.5', title: '数据有效性', level: 3, page: '5' },
    { number: '1.2.6', title: '数据及时性', level: 3, page: '5' },
    { number: '1.3', title: '问题整改进度', level: 2, page: '6' },
    { number: '2', title: '数据质量检核详细情况', level: 1, page: '7' },
    { number: '2.1', title: 'sys_departmen（部门表）', level: 2, page: '7' },
    { number: '2.2', title: 'sys_user（员工主表）', level: 2, page: '7' },
    { number: '2.3', title: 'sys_post（岗位表）', level: 2, page: '8' },
    { number: '2.4', title: 'sys_role（角色表）', level: 2, page: '8' },
    { number: '2.5', title: 'sys_position_grade（岗位职级表）', level: 2, page: '9' },
    { number: '2.6', title: 'sys_user_role（用户角色关系表）', level: 2, page: '9' },
    { number: '2.7', title: 'sys_org_relation（组织关系表）', level: 2, page: '10' },
    { number: '2.8', title: 'oa_leave_apply（请假申请表）', level: 2, page: '10' },
    { number: '2.9', title: 'oa_flow_task（流程任务表）', level: 2, page: '11' },
    { number: '2.10', title: 'oa_attendance_record（考勤记录表）', level: 2, page: '11' },
    { number: '2.11', title: 'oa_notice_read（公告阅读表）', level: 2, page: '12' },
    { number: '2.12', title: 'oa_contract_archive（合同归档表）', level: 2, page: '12' },
    { number: '2.13', title: 'oa_asset_card（资产卡片表）', level: 2, page: '13' },
    { number: '2.14', title: 'oa_meeting_room（会议室表）', level: 2, page: '13' },
    { number: '2.15', title: 'oa_vehicle_apply（用车申请表）', level: 2, page: '14' }
  ];

  var templateRuleDistributionRows = [
    ['完整性', '99.34%', '35'],
    ['一致性', '99.58%', '28'],
    ['唯一性', '99.91%', '5'],
    ['有效性', '99.82%', '22'],
    ['准确性', '99.73%', '41'],
    ['及时性', '99.88%', '23']
  ];

  var templateQualityDimensionStats = [
    {
      name: '数据完整性',
      rows: [
        ['sys_departmen', '部门表', '2,450', '12', '0.49%'],
        ['sys_user', '员工主表', '2,452', '18', '0.73%'],
        ['sys_post', '岗位表', '238', '3', '1.26%'],
        ['sys_role', '角色表', '126', '2', '1.59%'],
        ['合计', '-', '5,266', '35', '0.66%']
      ]
    },
    {
      name: '数据一致性',
      rows: [
        ['sys_departmen', '部门表', '2,450', '6', '0.24%'],
        ['sys_user', '员工主表', '2,452', '14', '0.57%'],
        ['sys_post', '岗位表', '238', '5', '2.10%'],
        ['sys_role', '角色表', '126', '3', '2.38%'],
        ['合计', '-', '5,266', '28', '0.53%']
      ]
    },
    {
      name: '数据唯一性',
      rows: [
        ['sys_departmen', '部门表', '2,450', '1', '0.04%'],
        ['sys_user', '员工主表', '2,452', '2', '0.08%'],
        ['sys_post', '岗位表', '238', '1', '0.42%'],
        ['sys_role', '角色表', '126', '1', '0.79%'],
        ['合计', '-', '5,266', '5', '0.09%']
      ]
    },
    {
      name: '数据准确性',
      rows: [
        ['sys_departmen', '部门表', '2,450', '8', '0.33%'],
        ['sys_user', '员工主表', '2,452', '25', '1.02%'],
        ['sys_post', '岗位表', '238', '4', '1.68%'],
        ['sys_role', '角色表', '126', '4', '3.17%'],
        ['合计', '-', '5,266', '41', '0.78%']
      ]
    },
    {
      name: '数据有效性',
      rows: [
        ['sys_departmen', '部门表', '2,450', '4', '0.16%'],
        ['sys_user', '员工主表', '2,452', '13', '0.53%'],
        ['sys_post', '岗位表', '238', '3', '1.26%'],
        ['sys_role', '角色表', '126', '2', '1.59%'],
        ['合计', '-', '5,266', '22', '0.42%']
      ]
    },
    {
      name: '数据及时性',
      rows: [
        ['sys_departmen', '部门表', '2,450', '5', '0.20%'],
        ['sys_user', '员工主表', '2,452', '11', '0.45%'],
        ['sys_post', '岗位表', '238', '4', '1.68%'],
        ['sys_role', '角色表', '126', '3', '2.38%'],
        ['合计', '-', '5,266', '23', '0.44%']
      ]
    }
  ];

  var templateRectifyTrendRows = [
    ['第1次', '2025-07-31 10:05:02', '4', '4,812', '168', '3.49%', '58%'],
    ['第2次', '2025-08-31 10:05:02', '4', '4,856', '154', '3.17%', '61%'],
    ['第3次', '2025-09-30 10:05:02', '4', '4,903', '149', '3.04%', '64%'],
    ['第4次', '2025-10-31 10:05:02', '4', '4,956', '136', '2.74%', '67%'],
    ['第5次', '2025-11-30 10:05:02', '4', '4,988', '128', '2.57%', '70%'],
    ['第6次', '2025-12-31 10:05:02', '4', '5,018', '121', '2.41%', '76%'],
    ['第7次', '2026-01-31 10:05:02', '4', '5,086', '116', '2.28%', '78%'],
    ['第8次', '2026-02-28 10:05:02', '4', '5,133', '103', '2.01%', '81%'],
    ['第9次', '2026-03-31 10:05:02', '4', '5,188', '91', '1.75%', '84%'],
    ['第10次', '2026-04-30 10:05:02', '4', '5,224', '73', '1.40%', '88%'],
    ['第11次', '2026-05-31 10:05:02', '4', '5,248', '52', '0.99%', '90%'],
    ['第12次', '2026-06-30 10:05:02', '4', '5,266', '35', '0.66%', '92%']
  ];

  var templateQualityRankSamples = [
    { tableName: 'sys_role', alias: '角色表', recordCount: 126, problemCount: 1, fieldCount: '11' },
    { tableName: 'sys_position_grade', alias: '岗位职级表', recordCount: 84, problemCount: 1, fieldCount: '8' },
    { tableName: 'sys_post', alias: '岗位表', recordCount: 238, problemCount: 3, fieldCount: '9' },
    { tableName: 'sys_departmen', alias: '部门表', recordCount: 2450, problemCount: 12, fieldCount: '14' },
    { tableName: 'sys_user_role', alias: '用户角色关系表', recordCount: 5120, problemCount: 29, fieldCount: '10' },
    { tableName: 'sys_org_relation', alias: '组织关系表', recordCount: 4860, problemCount: 31, fieldCount: '12' },
    { tableName: 'sys_user', alias: '员工主表', recordCount: 2452, problemCount: 18, fieldCount: '22' },
    { tableName: 'oa_meeting_room', alias: '会议室表', recordCount: 68, problemCount: 1, fieldCount: '9' },
    { tableName: 'oa_notice_read', alias: '公告阅读表', recordCount: 18360, problemCount: 168, fieldCount: '15' },
    { tableName: 'oa_asset_card', alias: '资产卡片表', recordCount: 3210, problemCount: 42, fieldCount: '18' },
    { tableName: 'oa_contract_archive', alias: '合同归档表', recordCount: 1760, problemCount: 32, fieldCount: '20' },
    { tableName: 'oa_leave_apply', alias: '请假申请表', recordCount: 42960, problemCount: 860, fieldCount: '19' },
    { tableName: 'oa_flow_task', alias: '流程任务表', recordCount: 68240, problemCount: 1640, fieldCount: '24' },
    { tableName: 'oa_vehicle_apply', alias: '用车申请表', recordCount: 2190, problemCount: 68, fieldCount: '16' },
    { tableName: 'oa_attendance_record', alias: '考勤记录表', recordCount: 92760, problemCount: 3860, fieldCount: '21' }
  ];

  function getQualityRankRate(item) {
    return item && item.recordCount ? item.problemCount / item.recordCount : 0;
  }

  function getQualityRankTotalRecordCount() {
    return templateQualityRankSamples.reduce(function (sum, item) {
      return sum + (Number(item.recordCount) || 0);
    }, 0);
  }

  function getQualityRankProblemCount() {
    return templateQualityRankSamples.reduce(function (sum, item) {
      return sum + (Number(item.problemCount) || 0);
    }, 0);
  }

  function getQualityRankRows(order) {
    var rows = templateQualityRankSamples.slice().sort(function (a, b) {
      var rateDiff = getQualityRankRate(a) - getQualityRankRate(b);
      if (rateDiff === 0) return a.problemCount - b.problemCount;
      return order === 'desc' ? -rateDiff : rateDiff;
    }).slice(0, 10);
    return rows.map(function (item, index) {
      return [
        String(index + 1),
        item.tableName,
        item.alias,
        formatNumber(item.recordCount),
        formatNumber(item.problemCount),
        (getQualityRankRate(item) * 100).toFixed(2) + '%'
      ];
    });
  }

  var templateQualityGoodTopRows = getQualityRankRows('asc');
  var templateQualityBadTopRows = getQualityRankRows('desc');

  var templateDetailSamples = [
    { tableName: 'sys_departmen', alias: '部门表', fieldCount: '14', dataCount: '0.25', issueCount: '12' },
    { tableName: 'sys_user', alias: '员工主表', fieldCount: '22', dataCount: '0.25', issueCount: '18' },
    { tableName: 'sys_post', alias: '岗位表', fieldCount: '9', dataCount: '0.02', issueCount: '3' },
    { tableName: 'sys_role', alias: '角色表', fieldCount: '11', dataCount: '0.01', issueCount: '1' },
    { tableName: 'sys_position_grade', alias: '岗位职级表', fieldCount: '8', dataCount: '0.01', issueCount: '1' },
    { tableName: 'sys_user_role', alias: '用户角色关系表', fieldCount: '10', dataCount: '0.51', issueCount: '29' },
    { tableName: 'sys_org_relation', alias: '组织关系表', fieldCount: '12', dataCount: '0.49', issueCount: '31' },
    { tableName: 'oa_leave_apply', alias: '请假申请表', fieldCount: '19', dataCount: '4.30', issueCount: '860' },
    { tableName: 'oa_flow_task', alias: '流程任务表', fieldCount: '24', dataCount: '6.82', issueCount: '1,640' },
    { tableName: 'oa_attendance_record', alias: '考勤记录表', fieldCount: '21', dataCount: '9.28', issueCount: '3,860' },
    { tableName: 'oa_notice_read', alias: '公告阅读表', fieldCount: '15', dataCount: '1.84', issueCount: '168' },
    { tableName: 'oa_contract_archive', alias: '合同归档表', fieldCount: '20', dataCount: '0.18', issueCount: '32' },
    { tableName: 'oa_asset_card', alias: '资产卡片表', fieldCount: '18', dataCount: '0.32', issueCount: '42' },
    { tableName: 'oa_meeting_room', alias: '会议室表', fieldCount: '9', dataCount: '0.01', issueCount: '1' },
    { tableName: 'oa_vehicle_apply', alias: '用车申请表', fieldCount: '16', dataCount: '0.22', issueCount: '68' }
  ];

  var templateFieldDetailRows = [
    ['REPORT_PHYSICIAN（申请科室）', '非空校验评测', '完整性', '98.06'],
    ['REPORT_PHYSICIAN（手机号码）', '手机号码校验评测', '一致性', '98.22'],
    ['PERFORMED_BY（身份证）', '身份证号码评测', '唯一性', '98.35'],
    ['AUDIT_PHYSICIAN（报告内容）', '长度校验评测', '有效性', '98.87'],
    ['REQ_DATE_TIME（检查类别）', '取值范围约束评测', '准确性', '98.45'],
    ['REQ_DEPT（检验时间）', '及时性评测', '及时性', '98.56']
  ];

  templateDashboardOptions = templateDashboardOptions.concat(templateDetailSamples.map(function (item) {
    return {
      id: getTemplateFieldDashboardId(item),
      name: getTemplateFieldDashboardTitle(item),
      type: 'table',
      typeLabel: '表格仪表盘',
      icon: 'bi-table',
      scope: item.tableName + '（' + item.alias + '）',
      desc: '展示' + item.alias + '字段对象、评测内容、评测标准和评估结论。',
      summary: getTemplateFieldDashboardSummary(item),
      metrics: '4列 / 6行',
      updateTime: '2026-06-29 10:05:02'
    };
  }));

  var issueTemplates = [
    { ruleKey: 'required', ruleName: '关键字段非空校验', type: '完整性', field: '主键字段', rateOffset: 6 },
    { ruleKey: 'unique', ruleName: '业务主键唯一性校验', type: '唯一性', field: '业务编号', rateOffset: 11 },
    { ruleKey: 'range', ruleName: '数值范围校验', type: '准确性', field: '金额/数量字段', rateOffset: 8 },
    { ruleKey: 'enum', ruleName: '状态枚举校验', type: '一致性', field: '状态字段', rateOffset: 13 },
    { ruleKey: 'format', ruleName: '日期与格式校验', type: '规范性', field: '日期/手机号字段', rateOffset: 9 },
    { ruleKey: 'relation', ruleName: '关联完整性校验', type: '完整性', field: '关联ID', rateOffset: 7 }
  ];

  function report(id, tableName, alias, dataSource, ruleCount, avgPassRate, problemRecordCount, fileRecordCount, lastExecutionTime, desc) {
    return {
      id: id,
      tableName: tableName,
      alias: alias,
      dataSource: dataSource,
      dataSourceLabel: (dataSourceParents[dataSource] ? dataSourceParents[dataSource] + '/' : '') + dataSource,
      dataSourceKey: dataSource,
      ruleCount: ruleCount,
      avgPassRate: avgPassRate,
      problemRecordCount: problemRecordCount,
      fileRecordCount: fileRecordCount,
      lastExecutionTime: lastExecutionTime,
      duration: '1分钟',
      desc: desc
    };
  }

  function reportConfig(id, name, dbCount, tableCount, taskCount, status, cycle, lastGeneratedTime, desc, reportIds) {
    return {
      id: id,
      name: name,
      dbCount: dbCount,
      tableCount: tableCount,
      taskCount: taskCount,
      status: status,
      cycle: cycle,
      lastGeneratedTime: lastGeneratedTime,
      lastExecutionStatus: configExecutionStatusMap[id] || (status === '已启动' ? '执行成功' : '执行失败'),
      desc: desc,
      reportIds: reportIds || []
    };
  }

  function historyReport(id, configId, generatedTime, rateShift, volumeFactor) {
    return {
      id: id,
      configId: configId,
      generatedTime: generatedTime,
      rateShift: rateShift || 0,
      volumeFactor: volumeFactor || 1
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

  function normalize(value) {
    return String(value || '').trim().toLowerCase();
  }

  function highlightSQL(code) {
    var h = escapeHtml(code);
    h = h.replace(/(\/\/[^\n]*)/g, '<span class="dp-sql-comment">$1</span>');
    h = h.replace(/(\/\*[\s\S]*?\*\/|\/\*[\s\S]*$)/g, '<span class="dp-sql-comment">$1</span>');
    h = h.replace(/('[^']*'|`[^`]*`)/g, '<span class="dp-sql-string">$1</span>');
    h = h.replace(/(\$\{[^}]+\})/g, '<span class="dp-sql-var">$1</span>');
    h = h.replace(/\b(WITH|SELECT|FROM|WHERE|AND|OR|IN|AS|COUNT|SUM|CASE|WHEN|THEN|ELSE|END|JOIN|LEFT|RIGHT|INNER|ON|GROUP|BY|HAVING|ORDER|LIMIT|IS|NOT|NULL|UNION|ALL)\b/gi,
      '<span class="dp-sql-keyword">$1</span>');
    return h;
  }

  function lineNumbers(code) {
    var total = Math.max(1, String(code || '').split('\n').length);
    var html = '';
    for (var i = 1; i <= total; i++) html += '<div>' + i + '</div>';
    return html;
  }

  function formatNumber(value) {
    return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  function sanitizeReportFileName(value) {
    return String(value == null ? '' : value).replace(/[<>:"/\\|?*\u0000-\u001f]/g, '_');
  }

  function getReportExportDate(report) {
    var parts = String(report.lastExecutionTime || '').split(' ')[0].split('-');
    if (parts.length !== 3) return String(report.lastExecutionTime || '').split(' ')[0];
    return [parts[0], String(Number(parts[1])), String(Number(parts[2]))].join('-');
  }

  function getReportExportFileName(report) {
    return sanitizeReportFileName(report.alias) + '（' + sanitizeReportFileName(report.tableName) + '）质量稽查报告-' + getReportExportDate(report) + '.xlsx';
  }

  function getExportTimestamp() {
    var now = new Date();
    return now.getFullYear() + pad2(now.getMonth() + 1) + pad2(now.getDate()) + pad2(now.getHours()) + pad2(now.getMinutes()) + pad2(now.getSeconds());
  }

  function getAllReportExportFileName(config) {
    config = config || getSelectedReportConfig() || reportConfigs[0];
    return sanitizeReportFileName(config.name || '稽查报告') + '-' + getExportTimestamp() + '.zip';
  }

  function getReportWordExportDate(config) {
    var value = config && config.lastGeneratedTime && config.lastGeneratedTime !== '-' ? config.lastGeneratedTime : '';
    if (value) return value.split(' ')[0];
    var now = new Date();
    return now.getFullYear() + '-' + pad2(now.getMonth() + 1) + '-' + pad2(now.getDate());
  }

  function getReportWordExportFileName(config) {
    config = config || reportConfigs[0];
    return sanitizeReportFileName(config.name || '稽查报告') + '-' + getReportWordExportDate(config) + '.doc';
  }

  function xmlEscape(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function columnName(col) {
    var name = '';
    while (col > 0) {
      var rem = (col - 1) % 26;
      name = String.fromCharCode(65 + rem) + name;
      col = Math.floor((col - 1) / 26);
    }
    return name;
  }

  function textCell(row, col, value, style) {
    return { row: row, col: col, value: value, style: style || 0, type: 'text' };
  }

  function numberCell(row, col, value, style) {
    return { row: row, col: col, value: value, style: style || 0, type: 'number' };
  }

  function sheetCellXml(cell) {
    var ref = columnName(cell.col) + cell.row;
    var style = cell.style ? ' s="' + cell.style + '"' : '';
    if (cell.type === 'number') {
      return '<c r="' + ref + '"' + style + '><v>' + Number(cell.value || 0) + '</v></c>';
    }
    return '<c r="' + ref + '" t="inlineStr"' + style + '><is><t xml:space="preserve">' + xmlEscape(cell.value) + '</t></is></c>';
  }

  function worksheetXml(rows, colWidths, merges, freezeRows) {
    var rowMap = {};
    var maxRow = 1;
    rows.forEach(function (cell) {
      rowMap[cell.row] = rowMap[cell.row] || [];
      rowMap[cell.row].push(cell);
      maxRow = Math.max(maxRow, cell.row);
    });
    var maxCol = colWidths.length || 1;
    var cols = colWidths.map(function (width, index) {
      return '<col min="' + (index + 1) + '" max="' + (index + 1) + '" width="' + width + '" customWidth="1"/>';
    }).join('');
    var sheetViews = '<sheetViews><sheetView workbookViewId="0">';
    if (freezeRows) {
      sheetViews += '<pane ySplit="' + freezeRows + '" topLeftCell="A' + (freezeRows + 1) + '" activePane="bottomLeft" state="frozen"/><selection pane="bottomLeft"/>';
    }
    sheetViews += '</sheetView></sheetViews>';
    var rowXml = Object.keys(rowMap).map(function (rowKey) {
      var row = Number(rowKey);
      var height = row === 1 ? 32 : (row === 3 || row === 8 || row === 11 ? 24 : (row === 6 ? 72 : (row === 5 ? 36 : (maxCol === 8 && row >= 13 ? 54 : 22))));
      return '<row r="' + row + '" ht="' + height + '" customHeight="1">' +
        rowMap[rowKey].sort(function (a, b) { return a.col - b.col; }).map(sheetCellXml).join('') +
      '</row>';
    }).join('');
    var mergeXml = merges.length ? '<mergeCells count="' + merges.length + '">' + merges.map(function (ref) {
      return '<mergeCell ref="' + ref + '"/>';
    }).join('') + '</mergeCells>' : '';
    return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">' +
      sheetViews +
      '<dimension ref="A1:' + columnName(maxCol) + maxRow + '"/>' +
      '<cols>' + cols + '</cols>' +
      '<sheetData>' + rowXml + '</sheetData>' +
      mergeXml +
      '</worksheet>';
  }

  function getInspectionTotal(report, problemTotal) {
    var failRate = Math.max(0.1, 100 - report.avgPassRate);
    return Math.max(problemTotal, Math.round(problemTotal / (failRate / 100)));
  }

  function getRuleSheetName(rule, usedNames) {
    var base = rule.name.replace(/[\\/?*\[\]:]/g, '').slice(0, 31) || 'Sheet';
    var name = base;
    var index = 2;
    while (usedNames[name]) {
      var suffix = '_' + index;
      name = base.slice(0, 31 - suffix.length) + suffix;
      index += 1;
    }
    usedNames[name] = true;
    return name;
  }

  function getExportIssueSummary(summary) {
    var parts = splitRuleSummary(summary);
    return '质量概述：' + parts.overview + '\n质量要求：' + parts.requirement;
  }

  function buildOverviewSheet(report, rules, problemRows) {
    var problemTotal = problemRows.length;
    var inspectionTotal = getInspectionTotal(report, problemTotal);
    var usedNames = { '概述': true };
    var weakRules = rules.filter(function (rule) { return rule.rate < 90; }).map(function (rule) {
      return rule.name + '（' + rule.field + '）';
    }).join('、') || '关键字段完整性与业务一致性';
    var rows = [
      textCell(1, 1, report.alias + '质量稽查报告', 1),
      textCell(3, 1, '顶部概述', 2),
      textCell(4, 1, '稽查对象', 3),
      textCell(4, 2, report.dataSourceLabel + '/' + report.tableName + '（' + report.alias + '）', 4),
      textCell(4, 3, '所属数据源', 3),
      textCell(4, 4, report.dataSourceLabel, 4),
      textCell(5, 1, '稽查内容', 3),
      textCell(5, 2, weakRules, 4),
      textCell(5, 3, '最后执行时间', 3),
      textCell(5, 4, report.lastExecutionTime, 4),
      textCell(6, 1, '稽查结果', 3),
      textCell(6, 2, '本次稽查记录总数 ' + formatNumber(inspectionTotal) + ' 条，问题记录数 ' + formatNumber(problemTotal) + ' 条，平均通过率 ' + report.avgPassRate.toFixed(1) + '%，共执行 ' + report.ruleCount + ' 条质量规则。', 4),
      textCell(6, 3, '报告说明', 3),
      textCell(6, 4, report.desc, 4),
      textCell(8, 1, '指标摘要', 2),
      textCell(9, 1, '总记录数', 5),
      numberCell(9, 2, inspectionTotal, 6),
      textCell(9, 3, '问题记录数', 5),
      numberCell(9, 4, problemTotal, 6),
      textCell(9, 5, '平均通过率', 5),
      numberCell(9, 6, report.avgPassRate / 100, 11),
      textCell(9, 7, '规则数', 5),
      numberCell(9, 8, report.ruleCount, 6),
      textCell(11, 1, '稽查内容清单', 2)
    ];
    ['序号', '稽查内容', '规则类型', '问题字段', '通过率', '问题记录数', '对应 Sheet', '质量概述/质量要求'].forEach(function (header, index) {
      rows.push(textCell(12, index + 1, header, 7));
    });
    rules.forEach(function (rule, index) {
      var issueCount = problemRows.filter(function (item) { return item.ruleKey === rule.key; }).length;
      var row = 13 + index;
      var sheetName = getRuleSheetName(rule, usedNames);
      rows.push(numberCell(row, 1, index + 1, 9));
      rows.push(textCell(row, 2, rule.name, 9));
      rows.push(textCell(row, 3, rule.type, 9));
      rows.push(textCell(row, 4, rule.field, 9));
      rows.push(numberCell(row, 5, rule.rate / 100, 11));
      rows.push(numberCell(row, 6, issueCount, 9));
      rows.push(textCell(row, 7, sheetName, 9));
      rows.push(textCell(row, 8, getExportIssueSummary(rule.summary), 4));
    });
    return worksheetXml(rows, [8, 36, 16, 24, 14, 14, 20, 64], ['A1:H1', 'A3:H3', 'A8:H8', 'A11:H11'], 12);
  }

  function buildRuleSheet(report, rule, sheetName) {
    var fields = getInspectionFields(report);
    var problemRows = getRuleProblemRows(report, rule.key);
    var rows = [
      textCell(1, 1, report.alias + ' - ' + rule.name, 1),
      textCell(3, 1, '规则概述', 2),
      textCell(4, 1, '稽查对象', 3),
      textCell(4, 2, report.dataSourceLabel + '/' + report.tableName + '（' + report.alias + '）', 4),
      textCell(4, 3, '稽查内容', 3),
      textCell(4, 4, rule.name, 4),
      textCell(4, 5, '规则类型', 3),
      textCell(4, 6, rule.type, 4),
      textCell(5, 1, '问题字段', 3),
      textCell(5, 2, rule.field, 4),
      textCell(5, 3, '通过率', 3),
      numberCell(5, 4, rule.rate / 100, 11),
      textCell(5, 5, '问题记录数', 3),
      numberCell(5, 6, problemRows.length, 9),
      textCell(6, 1, '质量概述/质量要求', 3),
      textCell(6, 2, getExportIssueSummary(rule.summary), 4),
      textCell(6, 3, '最后执行时间', 3),
      textCell(6, 4, report.lastExecutionTime, 4),
      textCell(6, 5, 'sheet', 3),
      textCell(6, 6, sheetName, 4),
      textCell(8, 1, '问题清单', 2)
    ];
    fields.forEach(function (field, index) {
      var isIssue = field === rule.field;
      rows.push(textCell(9, index + 1, field + (isIssue ? '（问题列）' : ''), isIssue ? 8 : 7));
    });
    problemRows.forEach(function (item, rowIndex) {
      fields.forEach(function (field, colIndex) {
        rows.push(textCell(10 + rowIndex, colIndex + 1, item.values[field], field === item.issueField ? 10 : 9));
      });
    });
    return worksheetXml(rows, [16, 16, 22, 18, 16, 16, 20, 20, 20], ['A1:I1', 'A3:I3', 'A8:I8'], 9);
  }

  function workbookXml(sheetNames) {
    return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">' +
      '<bookViews><workbookView xWindow="0" yWindow="0" windowWidth="16000" windowHeight="9600"/></bookViews><sheets>' +
      sheetNames.map(function (name, index) {
        return '<sheet name="' + xmlEscape(name) + '" sheetId="' + (index + 1) + '" r:id="rId' + (index + 1) + '"/>';
      }).join('') +
      '</sheets></workbook>';
  }

  function workbookRelsXml(sheetNames) {
    return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
      sheetNames.map(function (name, index) {
        return '<Relationship Id="rId' + (index + 1) + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet' + (index + 1) + '.xml"/>';
      }).join('') +
      '<Relationship Id="rId' + (sheetNames.length + 1) + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>' +
      '</Relationships>';
  }

  function contentTypesXml(sheetCount) {
    var overrides = '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>' +
      '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>';
    for (var i = 1; i <= sheetCount; i++) {
      overrides += '<Override PartName="/xl/worksheets/sheet' + i + '.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>';
    }
    return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
      '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
      '<Default Extension="xml" ContentType="application/xml"/>' + overrides + '</Types>';
  }

  function stylesXml() {
    return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' +
      '<numFmts count="1"><numFmt numFmtId="164" formatCode="0.0%"/></numFmts>' +
      '<fonts count="5">' +
      '<font><sz val="11"/><name val="Carlito"/></font>' +
      '<font><b/><sz val="16"/><color rgb="FFFFFFFF"/><name val="宋体"/></font>' +
      '<font><b/><sz val="11"/><color rgb="FF26384D"/><name val="Carlito"/></font>' +
      '<font><sz val="11"/><color rgb="FFC00000"/><name val="Carlito"/></font>' +
      '<font><b/><sz val="11"/><color rgb="FFAD6800"/><name val="Carlito"/></font>' +
      '</fonts>' +
      '<fills count="9">' +
      '<fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill>' +
      '<fill><patternFill patternType="solid"><fgColor rgb="FF1F4E78"/><bgColor indexed="64"/></patternFill></fill>' +
      '<fill><patternFill patternType="solid"><fgColor rgb="FFD9EAF7"/><bgColor indexed="64"/></patternFill></fill>' +
      '<fill><patternFill patternType="solid"><fgColor rgb="FFF5F7FA"/><bgColor indexed="64"/></patternFill></fill>' +
      '<fill><patternFill patternType="solid"><fgColor rgb="FFF8FBFF"/><bgColor indexed="64"/></patternFill></fill>' +
      '<fill><patternFill patternType="solid"><fgColor rgb="FFEAF2F8"/><bgColor indexed="64"/></patternFill></fill>' +
      '<fill><patternFill patternType="solid"><fgColor rgb="FFFFF2CC"/><bgColor indexed="64"/></patternFill></fill>' +
      '<fill><patternFill patternType="solid"><fgColor rgb="FFFCE4D6"/><bgColor indexed="64"/></patternFill></fill>' +
      '</fills>' +
      '<borders count="3"><border/><border><left style="thin"><color rgb="FFE6EDF4"/></left><right style="thin"><color rgb="FFE6EDF4"/></right><top style="thin"><color rgb="FFE6EDF4"/></top><bottom style="thin"><color rgb="FFE6EDF4"/></bottom></border><border><left style="thin"><color rgb="FFC9D6E2"/></left><right style="thin"><color rgb="FFC9D6E2"/></right><top style="thin"><color rgb="FFC9D6E2"/></top><bottom style="thin"><color rgb="FFC9D6E2"/></bottom></border></borders>' +
      '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>' +
      '<cellXfs count="12">' +
      '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>' +
      '<xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1"><alignment horizontal="left" vertical="center"/></xf>' +
      '<xf numFmtId="0" fontId="2" fillId="3" borderId="2" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="left" vertical="center"/></xf>' +
      '<xf numFmtId="0" fontId="2" fillId="4" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment vertical="center" wrapText="1"/></xf>' +
      '<xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1" applyAlignment="1"><alignment vertical="center" wrapText="1"/></xf>' +
      '<xf numFmtId="0" fontId="2" fillId="5" borderId="2" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>' +
      '<xf numFmtId="0" fontId="0" fillId="5" borderId="2" xfId="0" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>' +
      '<xf numFmtId="0" fontId="2" fillId="6" borderId="2" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center" wrapText="1"/></xf>' +
      '<xf numFmtId="0" fontId="4" fillId="7" borderId="2" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="left" vertical="center" wrapText="1"/></xf>' +
      '<xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1" applyAlignment="1"><alignment vertical="center"/></xf>' +
      '<xf numFmtId="0" fontId="3" fillId="8" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment vertical="center"/></xf>' +
      '<xf numFmtId="164" fontId="0" fillId="5" borderId="2" xfId="0" applyNumberFormat="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>' +
      '</cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>';
  }

  function crc32(bytes) {
    var table = crc32.table || (crc32.table = (function () {
      var result = [];
      for (var n = 0; n < 256; n++) {
        var c = n;
        for (var k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
        result[n] = c >>> 0;
      }
      return result;
    })());
    var crc = -1;
    for (var i = 0; i < bytes.length; i++) crc = (crc >>> 8) ^ table[(crc ^ bytes[i]) & 0xff];
    return (crc ^ -1) >>> 0;
  }

  function u16(value) {
    return new Uint8Array([value & 0xff, (value >>> 8) & 0xff]);
  }

  function u32(value) {
    return new Uint8Array([value & 0xff, (value >>> 8) & 0xff, (value >>> 16) & 0xff, (value >>> 24) & 0xff]);
  }

  function concatBytes(parts) {
    var length = parts.reduce(function (sum, part) { return sum + part.length; }, 0);
    var output = new Uint8Array(length);
    var offset = 0;
    parts.forEach(function (part) {
      output.set(part, offset);
      offset += part.length;
    });
    return output;
  }

  function createZip(files, mimeType) {
    var encoder = new TextEncoder();
    var localParts = [];
    var centralParts = [];
    var offset = 0;
    var now = new Date();
    var utf8FileNameFlag = 0x0800;
    var dosTime = (now.getHours() << 11) | (now.getMinutes() << 5) | Math.floor(now.getSeconds() / 2);
    var dosDate = ((now.getFullYear() - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate();
    files.forEach(function (file) {
      var nameBytes = encoder.encode(file.name);
      var data = typeof file.content === 'string' ? encoder.encode(file.content) : file.content;
      var crc = crc32(data);
      var localHeader = concatBytes([
        u32(0x04034b50), u16(20), u16(utf8FileNameFlag), u16(0), u16(dosTime), u16(dosDate), u32(crc),
        u32(data.length), u32(data.length), u16(nameBytes.length), u16(0), nameBytes
      ]);
      localParts.push(localHeader, data);
      var centralHeader = concatBytes([
        u32(0x02014b50), u16(20), u16(20), u16(utf8FileNameFlag), u16(0), u16(dosTime), u16(dosDate), u32(crc),
        u32(data.length), u32(data.length), u16(nameBytes.length), u16(0), u16(0), u16(0), u16(0), u32(0), u32(offset), nameBytes
      ]);
      centralParts.push(centralHeader);
      offset += localHeader.length + data.length;
    });
    var central = concatBytes(centralParts);
    var local = concatBytes(localParts);
    var end = concatBytes([u32(0x06054b50), u16(0), u16(0), u16(files.length), u16(files.length), u32(central.length), u32(local.length), u16(0)]);
    return new Blob([local, central, end], { type: mimeType || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  }

  function createReportWorkbookBlob(report) {
    var rules = getQualityRules(report);
    var problemRows = makeProblemRows(report);
    var sheetNames = ['概述'];
    var usedNames = { '概述': true };
    var sheetXmls = [buildOverviewSheet(report, rules, problemRows)];
    rules.forEach(function (rule) {
      var sheetName = getRuleSheetName(rule, usedNames);
      sheetNames.push(sheetName);
      sheetXmls.push(buildRuleSheet(report, rule, sheetName));
    });
    var files = [
      { name: '[Content_Types].xml', content: contentTypesXml(sheetNames.length) },
      { name: '_rels/.rels', content: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>' },
      { name: 'xl/workbook.xml', content: workbookXml(sheetNames) },
      { name: 'xl/_rels/workbook.xml.rels', content: workbookRelsXml(sheetNames) },
      { name: 'xl/styles.xml', content: stylesXml() }
    ];
    sheetXmls.forEach(function (content, index) {
      files.push({ name: 'xl/worksheets/sheet' + (index + 1) + '.xml', content: content });
    });
    return createZip(files);
  }

  function downloadBlob(blob, fileName) {
    var url = URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(function () { URL.revokeObjectURL(url); }, 0);
  }

  function exportReport(report) {
    if (!report) return;
    downloadBlob(createReportWorkbookBlob(report), getReportExportFileName(report));
  }

  function getUniqueZipFileName(fileName, usedNames) {
    var base = fileName;
    var ext = '';
    var dotIndex = fileName.lastIndexOf('.');
    if (dotIndex > 0) {
      base = fileName.slice(0, dotIndex);
      ext = fileName.slice(dotIndex);
    }
    var nextName = fileName;
    var index = 2;
    while (usedNames[nextName]) {
      nextName = base + '-' + index + ext;
      index += 1;
    }
    usedNames[nextName] = true;
    return nextName;
  }

  function blobToUint8Array(blob) {
    return blob.arrayBuffer().then(function (buffer) {
      return new Uint8Array(buffer);
    });
  }

  function createAllReportExcelZipBlob(rows) {
    var usedNames = {};
    return Promise.all(rows.map(function (report) {
      var fileName = getUniqueZipFileName(getReportExportFileName(report), usedNames);
      return blobToUint8Array(createReportWorkbookBlob(report)).then(function (content) {
        return { name: fileName, content: content };
      });
    })).then(function (files) {
      return createZip(files, 'application/zip');
    });
  }

  function exportAllDetailReports(triggerEl) {
    var input = pageEl ? pageEl.querySelector('[data-qir-keyword]') : null;
    if (input) state.keyword = input.value.trim();
    var rows = getReportRows();
    if (!rows.length) {
      showToast('暂无可导出的数据详情');
      return;
    }
    if (triggerEl) triggerEl.disabled = true;
    createAllReportExcelZipBlob(rows).then(function (zipBlob) {
      downloadBlob(zipBlob, getAllReportExportFileName(getSelectedReportConfig()));
      showToast('全部导出压缩包已生成');
    }).catch(function (err) {
      if (window.console && console.error) console.error(err);
      showToast('全部导出失败，请稍后重试');
    }).finally(function () {
      if (triggerEl) triggerEl.disabled = false;
    });
  }

  function getReportWordStyles() {
    return [
      '@page Section1{size:21cm 29.7cm;margin:2.54cm 3.17cm;}',
      'div.Section1{page:Section1;}',
      'body{margin:0;background:#fff;color:#000;font-family:"Microsoft YaHei",SimSun,"宋体",Arial,sans-serif;font-size:10.5pt;}',
      'p.MsoNormal{margin-top:0;margin-right:0;margin-bottom:0;margin-left:0;mso-para-margin-top:0;mso-para-margin-bottom:0;text-align:justify;text-justify:inter-ideograph;text-indent:24pt;mso-char-indent-count:2.0;line-height:150%;mso-line-height-rule:auto;mso-pagination:widow-orphan;font-family:"Microsoft YaHei",SimSun,"宋体",Arial,sans-serif;font-size:10.5pt;color:#000;}',
      '.qir-word-page{width:100%;}',
      '.qir-word-page-break{height:0;margin:0;padding:0;font-size:1pt;line-height:1pt;page-break-before:always;mso-special-character:line-break;}',
      '.qir-template-doc-page{width:100%;min-height:23.5cm;page-break-inside:avoid;box-sizing:border-box;color:#26384d;}',
      '.qir-template-doc-page:last-child{page-break-after:auto;break-after:auto;}',
      '.qir-template-cover-page{height:23.5cm;text-align:center;page-break-inside:avoid;}',
      '.qir-template-cover-content{height:21cm;text-align:center;}',
      '.qir-template-page h1{margin:0 0 12pt;color:#1f2d3d;font-size:22pt;line-height:1.35;text-align:center;font-family:"Microsoft YaHei",SimSun,"宋体",Arial,sans-serif;}',
      '.qir-template-page h2{margin:20pt 0 8pt;color:#1f2d3d;font-size:15pt;line-height:1.45;font-family:"Microsoft YaHei",SimSun,"宋体",Arial,sans-serif;}',
      '.qir-template-page h3{margin:14pt 0 7pt;color:#26384d;font-size:12.5pt;line-height:1.45;font-weight:650;font-family:"Microsoft YaHei",SimSun,"宋体",Arial,sans-serif;}',
      '.qir-template-page h4{margin:12pt 0 6pt;color:#26384d;font-size:11.5pt;line-height:1.45;font-weight:650;font-family:"Microsoft YaHei",SimSun,"宋体",Arial,sans-serif;}',
      '.qir-template-page p{margin-top:0;margin-bottom:0;mso-para-margin-top:0;mso-para-margin-bottom:0;color:#000;font-family:"Microsoft YaHei",SimSun,"宋体",Arial,sans-serif;font-size:10.5pt;line-height:150%;mso-line-height-rule:auto;text-indent:24pt;mso-char-indent-count:2.0;text-align:justify;text-justify:inter-ideograph;}',
      '.qir-template-doc-system{display:block;margin:0 0 4pt;color:inherit;font-size:inherit;font-weight:inherit;}',
      '.qir-template-meta{padding-bottom:8pt;border-bottom:1pt solid #edf1f6;color:#7b8fa8!important;}',
      '.qir-template-report-date{margin-top:11cm!important;text-align:center!important;text-indent:0!important;mso-char-indent-count:0!important;color:#526579!important;}',
      '.qir-template-detail-title{color:#26384d;font-weight:650;text-indent:0!important;}',
      '.qir-template-doc-table{width:100%;border-collapse:collapse;margin:8pt 0 12pt;color:#37465a;font-family:"Microsoft YaHei",SimSun,"宋体",Arial,sans-serif;font-size:8pt;line-height:1.35;table-layout:fixed;mso-table-layout-alt:fixed;mso-table-lspace:0pt;mso-table-rspace:0pt;}',
      '.qir-template-doc-table th,.qir-template-doc-table td{height:22pt;padding:3pt 4pt;border:.5pt solid #d9dfe6;mso-border-alt:solid #d9dfe6 .5pt;text-align:left;vertical-align:middle;}',
      '.qir-template-doc-table th{background:#f3f6fa;color:#26384d;font-weight:650;}',
      '.qir-template-doc-table tr.is-total td{background:#fafafa;color:#1f2d3d;font-weight:650;}',
      '.qir-template-field-table th:nth-child(1),.qir-template-field-table td:nth-child(1){width:43%;}',
      '.qir-template-field-table th:nth-child(2),.qir-template-field-table td:nth-child(2){width:28%;}',
      '.qir-template-field-table th:nth-child(3),.qir-template-field-table td:nth-child(3){width:14%;text-align:center;}',
      '.qir-template-field-table th:nth-child(4),.qir-template-field-table td:nth-child(4){width:15%;text-align:center;}',
      '.qir-template-kpi-row{display:table;width:100%;border-spacing:8pt;margin:8pt 0;}',
      '.qir-template-kpi-row div{display:table-cell;min-height:54pt;padding:10pt;border:1pt solid #dce9f8;background:#f8fbff;}',
      '.qir-template-kpi-row span{display:block;color:#6f8298;font-size:9pt;}',
      '.qir-template-kpi-row b{display:block;margin-top:4pt;color:#1677ff;font-size:18pt;font-weight:650;}',
      '.qir-template-inserted-dashboard{margin:10pt 0;padding:10pt;border:1pt solid #dce9f8;background:#fbfdff;color:#26384d;}',
      '.qir-inserted-dashboard-head{margin-bottom:8pt;}',
      '.qir-inserted-dashboard-head strong{color:#1f2d3d;font-size:12pt;font-weight:650;}',
      '.qir-inserted-dashboard-summary{margin:-2pt 0 8pt;color:#526579;font-size:10pt;line-height:1.5;text-indent:0!important;mso-char-indent-count:0!important;}',
      '.qir-inserted-dashboard-body{padding:10pt;border:1pt solid #e6eff8;background:#fff;}',
      '.qir-template-table-dashboard .qir-inserted-dashboard-body{min-height:auto;padding:8pt;}',
      '.qir-template-pie-dashboard .qir-inserted-dashboard-head{text-align:center;}',
      '.qir-template-pie-dashboard .qir-inserted-dashboard-head strong{color:#29445f;font-size:15pt;font-weight:500;}',
      '.qir-template-pie-dashboard .qir-inserted-dashboard-body{padding:8pt;background:#fff;}',
      '.qir-rule-pie-chart,.qir-rectify-trend-chart{margin:0 auto;background:#fff;text-align:center;}',
      '.qir-word-chart-img{display:block;width:390pt;height:auto;margin:2pt auto;border:0;}',
      '.qir-word-chart-fallback{margin:0;padding:18pt 8pt;border:1pt dashed #c7d9ec;background:#f8fbff;color:#526579;font-size:9pt;text-align:center;}',
      '.qir-chart-fallback{height:100%;display:table;width:100%;color:#8aa0b7;font-size:9pt;text-align:center;}',
      '.qir-chart-fallback:before{content:"ECharts 图表将在页面预览中渲染";display:table-cell;vertical-align:middle;}',
      '.qir-inserted-kpi-grid{display:table;width:100%;border-spacing:8pt;}',
      '.qir-inserted-kpi-grid div{display:table-cell;padding:10pt;border:1pt solid #dce9f8;background:#f8fbff;}',
      '.qir-inserted-kpi-grid span,.qir-inserted-kpi-grid em{display:block;color:#6f8298;font-size:9pt;font-style:normal;}',
      '.qir-inserted-kpi-grid b{display:block;margin:5pt 0;color:#1677ff;font-size:18pt;}',
      '.qir-inserted-table{width:100%;border-collapse:collapse;color:#44566c;font-size:8pt;}',
      '.qir-inserted-table.qir-template-doc-table{margin:0;}',
      '.qir-inserted-table th,.qir-inserted-table td{height:22pt;padding:3pt 4pt;border:.5pt solid #d9dfe6;mso-border-alt:solid #d9dfe6 .5pt;text-align:left;}',
      '.qir-inserted-table th{background:#f7f9fc;color:#26384d;font-weight:650;}',
      '.qir-inserted-bars div{margin:6pt 0;color:#526579;font-size:9pt;}',
      '.qir-inserted-bars b{display:inline-block;height:8pt;background:#1677ff;}',
      '.qir-inserted-pie,.qir-inserted-trend-line{border:1pt solid #e6eff8;background:#f8fbff;}'
    ].join('');
  }

  function formatReportWordGeneratedDateTime(config) {
    var value = config && config.lastGeneratedTime && config.lastGeneratedTime !== '-' ? String(config.lastGeneratedTime) : '';
    var parts;
    var dateParts;
    if (!value) return '';
    parts = value.split(' ');
    dateParts = parts[0].split('-');
    if (dateParts.length === 3) {
      return Number(dateParts[0]) + '年' + Number(dateParts[1]) + '月' + Number(dateParts[2]) + '日' + (parts[1] ? ' ' + parts[1] : '');
    }
    return value;
  }

  function getReportWordPreviewOverrides(config) {
    var generatedTime = formatReportWordGeneratedDateTime(config);
    if (!generatedTime) return null;
    return {
      '日期时间': generatedTime,
      '最后生成时间': config.lastGeneratedTime
    };
  }

  function getReportWordChartKey(node) {
    var dashboard = node && node.closest ? node.closest('.qir-template-inserted-dashboard') : null;
    var dashboardId = dashboard ? dashboard.getAttribute('data-dashboard-id') : '';
    return dashboardId || (node ? (node.getAttribute('data-qir-echart') || '') : '');
  }

  function getReportWordChartSize(node) {
    var chartType = node ? node.getAttribute('data-qir-echart') : '';
    if (chartType === 'rectify-trend') {
      return {
        exportWidth: 680,
        exportHeight: 330,
        displayWidthPx: 520,
        displayWidthPt: 390,
        displayHeightPt: 189
      };
    }
    return {
      exportWidth: 680,
      exportHeight: 340,
      displayWidthPx: 520,
      displayWidthPt: 390,
      displayHeightPt: 195
    };
  }

  function parseReportWordImageDataUrl(dataUrl) {
    var match = /^data:(image\/[a-z0-9.+-]+);base64,(.+)$/i.exec(String(dataUrl || ''));
    if (!match) return null;
    return {
      mimeType: match[1],
      base64: match[2]
    };
  }

  function collectReportWordChartAssets() {
    var assets = {};
    var index = 1;
    var nodes;
    if (!window.echarts || !pageEl) return assets;
    nodes = Array.prototype.slice.call(pageEl.querySelectorAll('[data-qir-report-preview-page] [data-qir-echart]'));
    nodes.forEach(function (node) {
      var chart = window.echarts.getInstanceByDom ? window.echarts.getInstanceByDom(node) : null;
      var dataUrl;
      var parsed;
      var key;
      var size = getReportWordChartSize(node);
      var oldStyle = node.getAttribute('style');
      if (!chart || !chart.getDataURL) return;
      try {
        node.style.width = size.exportWidth + 'px';
        node.style.height = size.exportHeight + 'px';
        if (chart.resize) chart.resize({ width: size.exportWidth, height: size.exportHeight });
        dataUrl = chart.getDataURL({
          type: 'png',
          pixelRatio: 1.5,
          backgroundColor: '#fff'
        });
      } catch (err) {
        dataUrl = '';
      } finally {
        if (oldStyle == null) {
          node.removeAttribute('style');
        } else {
          node.setAttribute('style', oldStyle);
        }
        try {
          if (chart && chart.resize) chart.resize();
        } catch (resizeErr) {}
      }
      parsed = parseReportWordImageDataUrl(dataUrl);
      key = getReportWordChartKey(node);
      if (!parsed || !key) return;
      assets[key] = {
        location: 'qir-word-chart-' + index + '.png',
        mimeType: parsed.mimeType,
        base64: parsed.base64,
        alt: node.getAttribute('aria-label') || '报告图表',
        displayWidthPx: size.displayWidthPx,
        displayWidthPt: size.displayWidthPt,
        displayHeightPt: size.displayHeightPt
      };
      index += 1;
    });
    return assets;
  }

  function renderReportWordChartFallback(node) {
    var chartType = node ? node.getAttribute('data-qir-echart') : '';
    var message = chartType === 'rectify-trend'
      ? '问题整改趋势图未捕获，详见下方问题整改进度表。'
      : '检核规则数量分布图未捕获，详见下方规则类型分布表。';
    return '<div class="qir-word-chart-fallback">' + escapeHtml(message) + '</div>';
  }

  function applyReportWordChartImages(html, chartAssets) {
    var wrap = document.createElement('div');
    wrap.innerHTML = html || '';
    wrap.querySelectorAll('[data-qir-echart]').forEach(function (node) {
      var key = getReportWordChartKey(node);
      var asset = chartAssets && chartAssets[key];
      if (asset) {
        var img = document.createElement('img');
        img.className = 'qir-word-chart-img';
        img.setAttribute('src', asset.location);
        img.setAttribute('alt', asset.alt);
        img.setAttribute('width', String(asset.displayWidthPx || 520));
        img.setAttribute('style', 'display:block;width:' + (asset.displayWidthPt || 390) + 'pt;height:auto;max-height:' + (asset.displayHeightPt || 195) + 'pt;margin:2pt auto;border:0;');
        node.innerHTML = '';
        node.setAttribute('style', 'width:' + (asset.displayWidthPt || 390) + 'pt;height:' + (asset.displayHeightPt || 195) + 'pt;margin:0 auto;text-align:center;overflow:hidden;background:#fff;');
        node.appendChild(img);
        node.classList.add('qir-word-chart-exported');
      } else {
        node.innerHTML = renderReportWordChartFallback(node);
      }
      node.removeAttribute('data-qir-echart');
      node.removeAttribute('data-qir-chart-data');
      node.removeAttribute('_echarts_instance_');
    });
    return wrap.innerHTML;
  }

  function getReportWordAssetList(chartAssets) {
    return Object.keys(chartAssets || {}).map(function (key) {
      return chartAssets[key];
    }).filter(function (asset) {
      return asset && asset.base64 && asset.location;
    });
  }

  function foldReportWordBase64(base64) {
    return String(base64 || '').replace(/(.{76})/g, '$1\r\n');
  }

  function createReportWordMhtmlBlob(html, assets) {
    var boundary = '----=_NextPart_' + Date.now();
    var lines = [
      'MIME-Version: 1.0',
      'Content-Type: multipart/related; boundary="' + boundary + '"; type="text/html"',
      '',
      '--' + boundary,
      'Content-Type: text/html; charset="utf-8"',
      'Content-Transfer-Encoding: 8bit',
      'Content-Location: report.htm',
      '',
      '\ufeff' + html
    ];
    assets.forEach(function (asset) {
      lines.push(
        '--' + boundary,
        'Content-Type: ' + asset.mimeType,
        'Content-Transfer-Encoding: base64',
        'Content-Location: ' + asset.location,
        'Content-ID: <' + asset.location + '>',
        '',
        foldReportWordBase64(asset.base64)
      );
    });
    lines.push('--' + boundary + '--');
    return new Blob([lines.join('\r\n')], { type: 'application/msword;charset=utf-8' });
  }

  function getReportWordTableLayout(table) {
    if (!table || !table.classList) return null;
    if (table.classList.contains('qir-template-quality-rank-table')) {
      return { widths: [8, 28, 18, 18, 14, 14], center: [0, 3, 4, 5], fontSize: '7.5pt' };
    }
    if (table.classList.contains('qir-template-trend-table')) {
      return { widths: [10, 25, 8, 15, 15, 13, 14], center: [0, 2, 3, 4, 5, 6], fontSize: '7pt', noWrapBody: true, cellPadding: '2pt 3pt' };
    }
    if (table.classList.contains('qir-template-check-table')) {
      return { widths: [30, 18, 20, 18, 14], center: [2, 3, 4], fontSize: '7.8pt' };
    }
    if (table.classList.contains('qir-template-field-table')) {
      return { widths: [43, 27, 15, 15], center: [2, 3], fontSize: '8pt' };
    }
    if (table.classList.contains('qir-template-rule-table')) {
      return { widths: [36, 28, 36], center: [1, 2], fontSize: '8.2pt' };
    }
    return null;
  }

  function applyReportWordTableLayouts(root) {
    var tableBaseStyle = [
      'width:100%',
      'border-collapse:collapse',
      'table-layout:fixed',
      'mso-table-layout-alt:fixed',
      'mso-table-lspace:0pt',
      'mso-table-rspace:0pt',
      'margin:0',
      'font-family:"Microsoft YaHei",SimSun,"宋体",Arial,sans-serif',
      'color:#37465a'
    ].join(';');
    var borderStyle = 'border:.5pt solid #d9dfe6;mso-border-alt:solid #d9dfe6 .5pt;';
    var headerBaseStyle = [
      borderStyle,
      'padding:3pt 3pt',
      'background:#f3f6fa',
      'color:#26384d',
      'font-weight:650',
      'line-height:1.3',
      'text-indent:0',
      'mso-char-indent-count:0',
      'vertical-align:middle',
      'mso-height-source:auto'
    ].join(';');
    var tableParagraphStyle = [
      'margin-top:0',
      'margin-right:0',
      'margin-bottom:0',
      'margin-left:0',
      'mso-para-margin-top:0',
      'mso-para-margin-bottom:0',
      'text-indent:0',
      'mso-char-indent-count:0',
      'line-height:1.35',
      'mso-line-height-rule:auto'
    ].join(';');
    (root ? root.querySelectorAll('table.qir-template-doc-table') : []).forEach(function (table) {
      var layout = getReportWordTableLayout(table);
      var widths = layout ? layout.widths : [];
      var centerCols = layout ? layout.center : [];
      var fontSize = layout ? layout.fontSize : '8pt';
      var cellPadding = layout && layout.cellPadding ? layout.cellPadding : '3pt 3pt';
      var cellBaseStyle = [
        borderStyle,
        'padding:' + cellPadding,
        'color:#37465a',
        'line-height:1.35',
        'text-indent:0',
        'mso-char-indent-count:0',
        'vertical-align:middle',
        'mso-height-source:auto',
        layout && layout.noWrapBody ? 'white-space:nowrap;mso-no-wrap:yes;word-break:normal' : 'word-break:break-all'
      ].join(';');
      var oldColgroup = table.querySelector('colgroup');
      var colgroup = document.createElement('colgroup');
      if (oldColgroup) oldColgroup.remove();
      table.setAttribute('style', tableBaseStyle + ';font-size:' + fontSize);
      widths.forEach(function (width) {
        var col = document.createElement('col');
        col.setAttribute('style', 'width:' + width + '%');
        colgroup.appendChild(col);
      });
      if (widths.length) {
        table.insertBefore(colgroup, table.firstChild);
      }
      table.querySelectorAll('tr').forEach(function (row) {
        row.removeAttribute('style');
      });
      table.querySelectorAll('th,td').forEach(function (cell) {
        var colIndex = cell.cellIndex || 0;
        var isHead = cell.tagName && cell.tagName.toLowerCase() === 'th';
        var widthStyle = widths[colIndex] ? 'width:' + widths[colIndex] + '%;' : '';
        var align = (isHead || centerCols.indexOf(colIndex) >= 0) ? 'center' : 'left';
        cell.setAttribute('style', widthStyle + (isHead ? headerBaseStyle : cellBaseStyle) + ';font-size:' + fontSize + ';text-align:' + align);
        cell.querySelectorAll('p').forEach(function (paragraph) {
          paragraph.setAttribute('style', tableParagraphStyle + ';font-size:' + fontSize + ';text-align:' + align + ';color:' + (isHead ? '#26384d' : '#37465a'));
        });
      });
    });
  }

  function applyReportWordPageBreaks(docPages) {
    docPages.forEach(function (page, index) {
      var breakEl;
      var isLast = index === docPages.length - 1;
      var isCover = page.classList && page.classList.contains('qir-template-cover-page');
      page.setAttribute('style', [
        'width:100%',
        'min-height:23.5cm',
        'page-break-after:auto',
        'break-after:auto',
        'page-break-inside:avoid',
        'box-sizing:border-box',
        'color:#26384d',
        isCover ? 'height:23.5cm' : ''
      ].filter(Boolean).join(';'));
      if (index === 0 || !page.parentNode) return;
      breakEl = page.ownerDocument.createElement('br');
      breakEl.className = 'qir-word-page-break';
      breakEl.setAttribute('clear', 'all');
      breakEl.setAttribute('style', 'page-break-before:always;mso-special-character:line-break;height:0;margin:0;padding:0;font-size:1pt;line-height:1pt;');
      page.parentNode.insertBefore(breakEl, page);
    });
  }

  function normalizeReportWordContent(html) {
    var wrap = document.createElement('div');
    var paragraphStyle = [
      'margin-top:0',
      'margin-right:0',
      'margin-bottom:0',
      'margin-left:0',
      'mso-para-margin-top:0',
      'mso-para-margin-bottom:0',
      'text-align:justify',
      'text-justify:inter-ideograph',
      'text-indent:24pt',
      'mso-char-indent-count:2.0',
      'line-height:150%',
      'mso-line-height-rule:auto',
      'mso-pagination:widow-orphan',
      'font-family:"Microsoft YaHei",SimSun,"宋体",Arial,sans-serif',
      'mso-ascii-font-family:"Microsoft YaHei"',
      'mso-hansi-font-family:"Microsoft YaHei"',
      'font-size:10.5pt',
      'color:#000'
    ].join(';');
    var titleStyle = [
      'margin-top:0',
      'margin-right:0',
      'margin-bottom:12pt',
      'margin-left:0',
      'text-align:center',
      'line-height:1.35',
      'font-family:"Microsoft YaHei",SimSun,"宋体",Arial,sans-serif',
      'font-size:22pt',
      'font-weight:650',
      'color:#1f2d3d'
    ].join(';');
    var coverTitleStyle = [
      'margin-top:4cm',
      'margin-right:0',
      'margin-bottom:0',
      'margin-left:0',
      'text-align:center',
      'line-height:1.35',
      'font-family:"Microsoft YaHei",SimSun,"宋体",Arial,sans-serif',
      'font-size:22pt',
      'font-weight:650',
      'color:#1f2d3d'
    ].join(';');
    var h2Style = [
      'margin-top:20pt',
      'margin-right:0',
      'margin-bottom:8pt',
      'margin-left:0',
      'line-height:1.45',
      'font-family:"Microsoft YaHei",SimSun,"宋体",Arial,sans-serif',
      'font-size:15pt',
      'font-weight:650',
      'color:#1f2d3d'
    ].join(';');
    var h3Style = [
      'margin-top:14pt',
      'margin-right:0',
      'margin-bottom:7pt',
      'margin-left:0',
      'line-height:1.45',
      'font-family:"Microsoft YaHei",SimSun,"宋体",Arial,sans-serif',
      'font-size:12.5pt',
      'font-weight:650',
      'color:#26384d'
    ].join(';');
    var h4Style = [
      'margin-top:12pt',
      'margin-right:0',
      'margin-bottom:6pt',
      'margin-left:0',
      'line-height:1.45',
      'font-family:"Microsoft YaHei",SimSun,"宋体",Arial,sans-serif',
      'font-size:11.5pt',
      'font-weight:650',
      'color:#26384d'
    ].join(';');
    var reportDateStyle = [
      'margin-top:11cm',
      'margin-right:0',
      'margin-bottom:0',
      'margin-left:0',
      'text-align:center',
      'text-indent:0',
      'mso-char-indent-count:0',
      'line-height:180%',
      'mso-line-height-rule:auto',
      'font-family:"Microsoft YaHei",SimSun,"宋体",Arial,sans-serif',
      'mso-ascii-font-family:"Microsoft YaHei"',
      'mso-hansi-font-family:"Microsoft YaHei"',
      'font-size:10.5pt',
      'color:#526579'
    ].join(';');
    var dashboardSummaryStyle = [
      'margin-top:-2pt',
      'margin-right:0',
      'margin-bottom:8pt',
      'margin-left:0',
      'text-align:justify',
      'text-justify:inter-ideograph',
      'text-indent:0',
      'mso-char-indent-count:0',
      'line-height:150%',
      'mso-line-height-rule:auto',
      'font-family:"Microsoft YaHei",SimSun,"宋体",Arial,sans-serif',
      'mso-ascii-font-family:"Microsoft YaHei"',
      'mso-hansi-font-family:"Microsoft YaHei"',
      'font-size:10pt',
      'color:#526579'
    ].join(';');
    wrap.innerHTML = html || '';
    applyReportWordTableLayouts(wrap);
    var docPages = Array.prototype.slice.call(wrap.querySelectorAll('.qir-template-doc-page'));
    applyReportWordPageBreaks(docPages);
    wrap.querySelectorAll('h1').forEach(function (heading) {
      var isCoverTitle = heading.closest && heading.closest('.qir-template-cover-page');
      heading.setAttribute('style', isCoverTitle ? coverTitleStyle : titleStyle);
    });
    wrap.querySelectorAll('h2').forEach(function (heading) {
      heading.setAttribute('style', h2Style);
    });
    wrap.querySelectorAll('h3').forEach(function (heading) {
      heading.setAttribute('style', h3Style);
    });
    wrap.querySelectorAll('h4').forEach(function (heading) {
      heading.setAttribute('style', h4Style);
    });
    wrap.querySelectorAll('p').forEach(function (paragraph) {
      var oldClass = paragraph.getAttribute('class') || '';
      var isReportDate = paragraph.classList.contains('qir-template-report-date');
      var isDashboardSummary = paragraph.classList.contains('qir-inserted-dashboard-summary');
      paragraph.setAttribute('class', ('MsoNormal ' + oldClass).trim());
      paragraph.setAttribute('style', isReportDate ? reportDateStyle : (isDashboardSummary ? dashboardSummaryStyle : paragraphStyle));
    });
    return wrap.innerHTML;
  }

  function createReportWordBlob(config) {
    config = config || reportConfigs[0];
    var chartAssets = collectReportWordChartAssets();
    var assetList = getReportWordAssetList(chartAssets);
    var previewData = getTemplatePreviewData(config, getReportWordPreviewOverrides(config));
    var wordContent = normalizeReportWordContent(applyReportWordChartImages(previewData.html, chartAssets));
    var title = escapeHtml(config.name || '稽查报告');
    var wordSettings = '<!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View><w:Zoom>100</w:Zoom><w:DoNotOptimizeForBrowser/></w:WordDocument></xml><![endif]-->';
    var html = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">' +
      '<head><meta charset="utf-8"><meta name="ProgId" content="Word.Document"><meta name="Generator" content="Microsoft Word"><title>' + title + '</title>' + wordSettings + '<style>' + getReportWordStyles() + '</style></head>' +
      '<body lang="ZH-CN"><div class="Section1"><article class="qir-template-page qir-word-page">' + wordContent + '</article></div></body></html>';
    if (assetList.length) {
      return createReportWordMhtmlBlob(html, assetList);
    }
    return new Blob(['\ufeff', html], { type: 'application/msword;charset=utf-8' });
  }

  function exportReportWord() {
    var config = getSelectedReportConfig() || reportConfigs[0];
    downloadBlob(createReportWordBlob(config), getReportWordExportFileName(config));
    showToast('Word 报告已生成');
  }

  function showToast(message) {
    if (!pageEl) return;
    var old = pageEl.querySelector('.qir-toast');
    if (old) old.remove();
    pageEl.insertAdjacentHTML('beforeend', '<div class="qir-toast"><i class="bi bi-check-circle"></i><span>' + escapeHtml(message) + '</span></div>');
    var toast = pageEl.querySelector('.qir-toast');
    window.setTimeout(function () { if (toast) toast.classList.add('show'); }, 20);
    window.setTimeout(function () {
      if (toast && toast.parentNode) toast.remove();
    }, 1800);
  }

  function isSameIdList(left, right) {
    var leftList = (left || []).slice().sort();
    var rightList = (right || []).slice().sort();
    if (leftList.length !== rightList.length) return false;
    return leftList.every(function (id, index) { return id === rightList[index]; });
  }

  function isOaQualityReportConfig(config) {
    if (!config) return false;
    var name = String(config.name || '');
    return config.id === 'cfg-core-trade' ||
      config.id === 'cfg-business-system' ||
      name.indexOf('OA系统数据质量检核报告') >= 0;
  }

  function normalizeOaQualityReportConfig(config) {
    if (!isOaQualityReportConfig(config)) return config;
    config.dbCount = 1;
    config.tableCount = oaQualityReportIds.length;
    config.taskCount = 24;
    if (!isSameIdList(config.reportIds, oaQualityReportIds)) {
      config.reportIds = oaQualityReportIds.slice();
    }
    if (config.id === 'cfg-core-trade') {
      if (!config.nameEdited) config.name = 'OA系统数据质量检核报告';
      if (!config.descEdited) config.desc = '按月汇总 OA 系统组织、员工、岗位、角色、流程、考勤、资产等基础表的数据质量检核结果。';
      if (!config.cycle || !config.cycle.type) config.cycle = { type: '每月', day: '1号', time: '10:05:02' };
      config.lastGeneratedTime = '2026-06-30 10:05:02';
    }
    return config;
  }

  function normalizeOaQualityReportConfigs() {
    reportConfigs.forEach(normalizeOaQualityReportConfig);
  }

  function getConfigBaseId(id) {
    return String(id || '').split('::filter::')[0];
  }

  function getConfigFilterGroupId(id) {
    var parts = String(id || '').split('::filter::');
    return parts.length > 1 ? parts[1] : '';
  }

  function cloneConfigForDataRangeGroup(config, group) {
    var clone = {};
    Object.keys(config || {}).forEach(function (key) {
      clone[key] = config[key];
    });
    clone.id = config.id + '::filter::' + group.id;
    clone.baseConfigId = config.id;
    clone.dataRangeGroupId = group.id;
    clone.dataRangeGroupName = group.name;
    clone.name = config.name + '-' + group.name;
    clone.reportIds = (config.reportIds || []).slice();
    return clone;
  }

  function getReportConfigRowsForReportList() {
    var rows = [];
    reportConfigs.forEach(function (item) {
      var config = normalizeOaQualityReportConfig(item);
      var groups = templateFilterGroupsByConfig[config.id] || [];
      if (groups.length) {
        groups.forEach(function (group) {
          rows.push(cloneConfigForDataRangeGroup(config, group));
        });
      } else {
        rows.push(config);
      }
    });
    return rows;
  }

  function getReportConfigById(id) {
    var baseId = getConfigBaseId(id);
    var config = normalizeOaQualityReportConfig(reportConfigs.filter(function (item) { return item.id === baseId; })[0] || null);
    var groupId = getConfigFilterGroupId(id);
    if (config && groupId) {
      var group = (templateFilterGroupsByConfig[config.id] || []).filter(function (item) { return item.id === groupId; })[0];
      if (group) return cloneConfigForDataRangeGroup(config, group);
    }
    return config;
  }

  function getSelectedReportConfig() {
    return getReportConfigById(state.selectedConfigId);
  }

  function getEditableReportConfigById(id) {
    var baseId = getConfigBaseId(id);
    return reportConfigs.filter(function (item) { return item.id === baseId; })[0] || null;
  }

  function createNewTemplateConfig() {
    var id = 'cfg-template-' + String(Date.now()).slice(-6);
    var item = reportConfig(id, 'OA系统数据质量检核报告模板', 1, 15, 24, '未启动', { type: '每月', day: '1号', time: '10:05:02' }, '-', '按月汇总 OA 系统组织、员工、岗位、角色、流程、考勤、资产等基础表的数据质量检核结果。', oaQualityReportIds.slice());
    reportConfigs.unshift(item);
    return item;
  }

  function clampHistoryRate(value) {
    var rate = Number(value);
    if (!isFinite(rate)) rate = 0;
    return Math.max(60, Math.min(99.9, Math.round(rate * 10) / 10));
  }

  function getConfigBaseReportRows(config) {
    config = config || reportConfigs[0];
    var selectedIds = config && config.reportIds ? config.reportIds : [];
    var rows = reportRows.filter(function (item) {
      return !selectedIds.length || selectedIds.indexOf(item.id) >= 0;
    });
    rows.sort(function (a, b) { return b.lastExecutionTime.localeCompare(a.lastExecutionTime); });
    return rows;
  }

  function getHistoryReportById(id) {
    var item = reportHistories.filter(function (history) { return history.id === id; })[0] || null;
    if (!item) return null;
    var clone = {};
    Object.keys(item).forEach(function (key) { clone[key] = item[key]; });
    if (state.selectedConfigId && getConfigBaseId(state.selectedConfigId) === item.configId) {
      clone.contextConfigId = state.selectedConfigId;
    }
    return clone;
  }

  function getHistoryDate(history) {
    return String(history && history.generatedTime ? history.generatedTime : '').split(' ')[0] || '-';
  }

  function getHistoryDateValues(generatedTime) {
    var value = String(generatedTime || '');
    var datePart = value.split(' ')[0] || '';
    var timePart = value.split(' ')[1] || '00:00:00';
    var parts = datePart.split('-');
    var year = parts.length === 3 ? Number(parts[0]) : new Date().getFullYear();
    var month = parts.length === 3 ? Number(parts[1]) : new Date().getMonth() + 1;
    var day = parts.length === 3 ? Number(parts[2]) : new Date().getDate();
    var date = year + '年' + month + '月' + day + '日';
    return {
      year: year,
      month: month,
      day: day,
      time: timePart,
      date: date,
      dateTime: date + ' ' + timePart
    };
  }

  function getHistoryReportName(history) {
    var contextConfigId = history.contextConfigId || (state.selectedConfigId && getConfigBaseId(state.selectedConfigId) === history.configId ? state.selectedConfigId : history.configId);
    var config = getReportConfigById(contextConfigId) || reportConfigs[0];
    return (config ? config.name : '稽查报告') + '-' + getHistoryDate(history);
  }

  function getHistoryScopeText(history) {
    var contextConfigId = history.contextConfigId || (state.selectedConfigId && getConfigBaseId(state.selectedConfigId) === history.configId ? state.selectedConfigId : history.configId);
    var config = getReportConfigById(contextConfigId) || reportConfigs[0];
    return (config.dbCount || 0) + '个数据源，' + (config.tableCount || 0) + '张表，' + (config.taskCount || 0) + '个质量任务';
  }

  function getHistoryReportRows(history) {
    history = history || reportHistories[0];
    var contextConfigId = history.contextConfigId || (state.selectedConfigId && getConfigBaseId(state.selectedConfigId) === history.configId ? state.selectedConfigId : history.configId);
    var config = getReportConfigById(contextConfigId) || reportConfigs[0];
    var factor = history.volumeFactor || 1;
    return getConfigBaseReportRows(config).map(function (item, index) {
      var clone = {};
      Object.keys(item).forEach(function (key) {
        clone[key] = item[key];
      });
      var rateWave = ((index % 3) - 1) * 0.25;
      var rate = clampHistoryRate(item.avgPassRate + (history.rateShift || 0) + rateWave);
      var totalCount = Math.max(1, Math.round(item.fileRecordCount * factor));
      var problemCount = Math.max(0, Math.round(totalCount * Math.max(0, 100 - rate) / 100));
      clone.avgPassRate = rate;
      clone.fileRecordCount = totalCount;
      clone.problemRecordCount = problemCount;
      clone.lastExecutionTime = history.generatedTime;
      return clone;
    });
  }

  function getHistoryMetrics(history) {
    var rows = getHistoryReportRows(history);
    var totalRecordCount = rows.reduce(function (sum, item) {
      return sum + Number(item.fileRecordCount || 0);
    }, 0);
    var problemRecordCount = rows.reduce(function (sum, item) {
      return sum + Number(item.problemRecordCount || 0);
    }, 0);
    var avgPassRate = totalRecordCount ? clampHistoryRate(100 - problemRecordCount / totalRecordCount * 100) : 0;
    return {
      totalRecordCount: totalRecordCount,
      problemRecordCount: problemRecordCount,
      avgPassRate: avgPassRate,
      rowCount: rows.length
    };
  }

  function getHistoryRows() {
    var configId = state.selectedConfigId || (reportConfigs[0] && reportConfigs[0].id) || '';
    var baseConfigId = getConfigBaseId(configId);
    var rows = reportHistories.filter(function (item) { return item.configId === baseConfigId; }).map(function (item) {
      var clone = {};
      Object.keys(item).forEach(function (key) { clone[key] = item[key]; });
      clone.contextConfigId = configId;
      return clone;
    });
    rows.sort(function (a, b) { return String(b.generatedTime).localeCompare(String(a.generatedTime)); });
    return rows;
  }

  function clampHistoryPage(total) {
    var totalPages = Math.max(1, Math.ceil(total / state.historyPageSize));
    state.historyPage = Math.max(1, Math.min(totalPages, state.historyPage));
    return totalPages;
  }

  function getVisibleHistoryRows() {
    var rows = getHistoryRows();
    clampHistoryPage(rows.length);
    var start = (state.historyPage - 1) * state.historyPageSize;
    return rows.slice(start, start + state.historyPageSize);
  }

  function parseDateTime(value) {
    var text = String(value || '').trim();
    var match = text.match(/^(\d{4})-(\d{2})-(\d{2})(?:\s+(\d{2}):(\d{2}):(\d{2}))?/);
    if (!match) return new Date(2026, 5, 30, 10, 5, 2);
    return new Date(
      Number(match[1]),
      Number(match[2]) - 1,
      Number(match[3]),
      Number(match[4] || 0),
      Number(match[5] || 0),
      Number(match[6] || 0)
    );
  }

  function addSeconds(date, seconds) {
    return new Date(date.getTime() + seconds * 1000);
  }

  function parseDurationSeconds(duration) {
    var text = String(duration || '');
    var hours = text.match(/(\d+)小时/);
    var minutes = text.match(/(\d+)分/);
    var seconds = text.match(/(\d+)秒/);
    return (hours ? Number(hours[1]) * 3600 : 0) +
      (minutes ? Number(minutes[1]) * 60 : 0) +
      (seconds ? Number(seconds[1]) : 0);
  }

  function formatDurationText(seconds) {
    var total = Math.max(1, Math.round(Number(seconds) || 0));
    var hours = Math.floor(total / 3600);
    var minutes = Math.floor((total % 3600) / 60);
    var rest = total % 60;
    if (hours) return hours + '小时' + minutes + '分' + rest + '秒';
    if (minutes) return minutes + '分' + rest + '秒';
    return rest + '秒';
  }

  function getScheduleCycleTime(config) {
    return (config && config.cycle && config.cycle.time) || '10:05:02';
  }

  function getScheduleRunOverrideKey(configId, runId) {
    return String(configId || '') + '::' + String(runId || '');
  }

  function getScheduleRuleOverrideKey(configId, ruleRunId) {
    return String(configId || '') + '::' + String(ruleRunId || '');
  }

  function applyScheduleRunOverride(row) {
    var override = state.scheduleRunOverrides[getScheduleRunOverrideKey(row.configId, row.id)];
    if (!override) return row;
    Object.keys(override).forEach(function (key) {
      row[key] = override[key];
    });
    return row;
  }

  function applyScheduleRuleOverride(row) {
    var override = state.scheduleRuleOverrides[getScheduleRuleOverrideKey(row.configId, row.id)];
    if (!override) return row;
    Object.keys(override).forEach(function (key) {
      row[key] = override[key];
    });
    return row;
  }

  function getAllScheduleRecordRows() {
    var config = getSelectedReportConfig() || reportConfigs[0];
    var baseTime = config && config.lastGeneratedTime && config.lastGeneratedTime !== '-'
      ? config.lastGeneratedTime
      : '2026-06-30 ' + getScheduleCycleTime(config);
    var baseDate = parseDateTime(baseTime);
    var currentStatus = getConfigExecutionStatus(config);
    var durations = ['56秒', '1分32秒', '1小时2分35秒', '47秒', '3分08秒', '18分46秒', '1小时12分08秒', '2分15秒', '38秒', '4分21秒', '1小时05分18秒', '59秒'];
    var statuses = ['执行中', currentStatus, '执行成功', '执行失败', '执行成功', '执行成功', '执行失败', '执行成功', '执行成功', '执行成功', '执行失败', '执行成功'];
    return durations.map(function (duration, index) {
      var startDate = new Date(baseDate.getTime() - index * 24 * 60 * 60 * 1000);
      var status = statuses[index] || '执行成功';
      var running = status === '执行中';
      return applyScheduleRunOverride({
        id: 'schedule-run-' + index,
        index: index,
        taskName: getScheduleTaskName(config),
        startAt: formatDateTime(startDate),
        endAt: running ? '-' : formatDateTime(addSeconds(startDate, parseDurationSeconds(duration))),
        duration: running ? '0秒' : duration,
        status: status,
        cycle: getCycleText(config && config.cycle),
        configId: config ? config.id : ''
      });
    });
  }

  function getScheduleRecordRows() {
    var rows = getAllScheduleRecordRows();
    if (state.scheduleRecordStatus) {
      rows = rows.filter(function (item) { return item.status === state.scheduleRecordStatus; });
    }
    var startDate = state.scheduleRecordStartDate;
    var endDate = state.scheduleRecordEndDate;
    if (startDate) {
      rows = rows.filter(function (item) { return item.startAt.slice(0, 10) >= startDate; });
    }
    if (endDate) {
      rows = rows.filter(function (item) { return item.startAt.slice(0, 10) <= endDate; });
    }
    return rows;
  }

  function clampScheduleRecordPage(total) {
    var totalPages = Math.max(1, Math.ceil(total / state.scheduleRecordPageSize));
    state.scheduleRecordPage = Math.max(1, Math.min(totalPages, state.scheduleRecordPage));
    return totalPages;
  }

  function getVisibleScheduleRecordRows() {
    var rows = getScheduleRecordRows();
    clampScheduleRecordPage(rows.length);
    var start = (state.scheduleRecordPage - 1) * state.scheduleRecordPageSize;
    return rows.slice(start, start + state.scheduleRecordPageSize);
  }

  function getSelectedScheduleRecordRun() {
    var rows = getAllScheduleRecordRows();
    return rows.filter(function (item) { return item.id === state.selectedScheduleRunId; })[0] || rows[0];
  }

  function getScheduleRuleTaskName(report, index) {
    var labels = [
      '字段非空校验',
      '唯一性校验',
      '标准代码值域校验',
      '数据格式校验',
      '时间范围校验',
      '引用完整性校验',
      '数值范围校验',
      '重复记录校验'
    ];
    var prefix = report ? report.alias || report.tableName : '数据表';
    return prefix + '-' + labels[index % labels.length];
  }

  function getScheduleRuleTaskId(report, index) {
    var reportId = report && report.id ? report.id : 'report';
    return 'dqit-link-' + reportId + '-' + index;
  }

  function getTaskConfigEditUrl(item) {
    var baseUrl = window.location.href.replace(/#.*$/, '');
    var params = new URLSearchParams();
    params.set('nav', 'governance');
    params.set('page', 'quality-inspect-task');
    params.set('view', 'edit');
    params.set('taskId', item.taskId);
    params.set('taskName', item.ruleTask);
    params.set('taskTarget', item.tableName || '');
    params.set('taskType', item.taskType || '自定义稽查');
    params.set('taskFrequency', item.cycle || '');
    return baseUrl + '#' + params.toString();
  }

  function getScheduleRuleExecutionRows(run) {
    run = run || getSelectedScheduleRecordRun();
    var config = getReportConfigById(run && run.configId) || getSelectedReportConfig() || reportConfigs[0];
    var reports = getConfigBaseReportRows(config);
    if (!reports.length) reports = reportRows.slice(0, 1);
    var total = Math.max(1, Number(config && config.taskCount) || reports.length);
    var durationSeconds = [18, 24, 37, 56, 72, 93, 118, 146, 205, 312, 641, 1295];
    var rows = [];
    function appendRuleRow(report, ruleIndex) {
      if (rows.length >= total) return;
      var rowIndex = rows.length;
      var startAt = addSeconds(parseDateTime(run && run.startAt), rowIndex * 5);
      var status = '执行成功';
      if (run && run.status === '执行中') status = rowIndex < 3 ? '执行成功' : '执行中';
      else if (run && run.status === '执行失败' && rowIndex % 7 === 3) status = '执行失败';
      var seconds = durationSeconds[(rowIndex + ((run && run.index) || 0)) % durationSeconds.length];
      var ruleTaskName = getScheduleRuleTaskName(report, ruleIndex);
      var row = {
        id: (run && run.id ? run.id : 'schedule-run') + '-rule-' + rowIndex,
        runId: run && run.id ? run.id : '',
        configId: config ? config.id : '',
        reportId: report ? report.id : '',
        tableName: report ? report.tableName : '',
        alias: report ? report.alias : '',
        ruleCode: 'DQ_RULE_' + String(rowIndex + 1).padStart(3, '0'),
        ruleTask: ruleTaskName,
        taskId: getScheduleRuleTaskId(report, ruleIndex),
        taskType: '自定义稽查',
        startAt: formatDateTime(startAt),
        endAt: status === '执行中' ? '-' : formatDateTime(addSeconds(startAt, seconds)),
        duration: formatDurationText(seconds),
        status: status,
        cycle: run && run.cycle ? run.cycle : getCycleText(config && config.cycle),
        index: rowIndex,
        batchIndex: run && run.index != null ? run.index : 0
      };
      rows.push(applyScheduleRuleOverride(row));
    }
    reports.forEach(function (report) {
      var ruleCount = Math.max(1, Number(report.ruleCount) || 1);
      for (var i = 0; i < ruleCount && rows.length < total; i++) {
        appendRuleRow(report, i);
      }
    });
    while (rows.length < total) {
      var fallbackReport = reports[rows.length % reports.length];
      var fallbackRuleCount = Math.max(1, Number(fallbackReport && fallbackReport.ruleCount) || 1);
      appendRuleRow(fallbackReport, rows.length % fallbackRuleCount);
    }
    return rows;
  }

  function getSelectedScheduleRuleRun() {
    var rows = getScheduleRuleExecutionRows(getSelectedScheduleRecordRun());
    return rows.filter(function (item) { return item.id === state.selectedScheduleRuleRunId; })[0] || rows[0];
  }

  function clampScheduleDetailPage(total) {
    var totalPages = Math.max(1, Math.ceil(total / state.scheduleDetailPageSize));
    state.scheduleDetailPage = Math.max(1, Math.min(totalPages, state.scheduleDetailPage));
    return totalPages;
  }

  function getScheduleDetailRows() {
    var rows = getScheduleRuleExecutionRows(getSelectedScheduleRecordRun());
    var taskKeyword = normalize(state.scheduleDetailTaskKeyword);
    var tableKeyword = normalize(state.scheduleDetailTableKeyword);
    if (state.scheduleDetailStatus) {
      rows = rows.filter(function (item) { return item.status === state.scheduleDetailStatus; });
    }
    if (taskKeyword) {
      rows = rows.filter(function (item) {
        return normalize(item.ruleTask).indexOf(taskKeyword) >= 0 ||
          normalize(item.ruleCode).indexOf(taskKeyword) >= 0;
      });
    }
    if (tableKeyword) {
      rows = rows.filter(function (item) {
        return normalize(item.tableName).indexOf(tableKeyword) >= 0 ||
          normalize(item.alias).indexOf(tableKeyword) >= 0;
      });
    }
    return rows;
  }

  function getVisibleScheduleRuleExecutionRows() {
    var rows = getScheduleDetailRows();
    clampScheduleDetailPage(rows.length);
    var start = (state.scheduleDetailPage - 1) * state.scheduleDetailPageSize;
    return rows.slice(start, start + state.scheduleDetailPageSize);
  }

  function getConfigRows() {
    var rows = isScheduleSection() ? reportConfigs.slice() : getReportConfigRowsForReportList();
    var keyword = state.configKeyword.trim().toLowerCase();
    if (!isScheduleSection() && state.relatedTaskFilter) {
      rows = rows.filter(function (item) { return getScheduleTaskName(item) === state.relatedTaskFilter; });
    }
    if (isScheduleSection() && state.configStatus) {
      rows = rows.filter(function (item) { return item.status === state.configStatus; });
    }
    if (isScheduleSection() && state.configExecStatus) {
      rows = rows.filter(function (item) { return getConfigExecutionStatus(item) === state.configExecStatus; });
    }
    if (isScheduleSection() && state.configDataRangeStatus) {
      rows = rows.filter(function (item) {
        var configured = getConfigDataRangeCount(item) > 0;
        return state.configDataRangeStatus === 'configured' ? configured : !configured;
      });
    }
    if (keyword) {
      rows = rows.filter(function (item) {
        var displayName = isScheduleSection() ? getScheduleTaskName(item) : item.name;
        var taskName = getScheduleTaskName(item);
        return displayName.toLowerCase().indexOf(keyword) >= 0 ||
          item.name.toLowerCase().indexOf(keyword) >= 0 ||
          taskName.toLowerCase().indexOf(keyword) >= 0 ||
          item.desc.toLowerCase().indexOf(keyword) >= 0 ||
          (isScheduleSection() && item.status.toLowerCase().indexOf(keyword) >= 0) ||
          (isScheduleSection() && getConfigExecutionStatus(item).toLowerCase().indexOf(keyword) >= 0) ||
          (isScheduleSection() && getConfigDataRangeText(item).toLowerCase().indexOf(keyword) >= 0);
      });
    }
    rows.sort(function (a, b) {
      if (a.lastGeneratedTime === '-') return 1;
      if (b.lastGeneratedTime === '-') return -1;
      return b.lastGeneratedTime.localeCompare(a.lastGeneratedTime);
    });
    return rows;
  }

  function clampConfigPage(total) {
    var totalPages = Math.max(1, Math.ceil(total / state.configPageSize));
    state.configPage = Math.max(1, Math.min(totalPages, state.configPage));
    return totalPages;
  }

  function getVisibleConfigRows() {
    var rows = getConfigRows();
    clampConfigPage(rows.length);
    var start = (state.configPage - 1) * state.configPageSize;
    return rows.slice(start, start + state.configPageSize);
  }

  function deleteReportConfig(id) {
    var item = getReportConfigById(id);
    if (!item) return;
    var entityName = isScheduleSection() ? '任务调度' : '稽查报告';
    var displayName = isScheduleSection() ? getScheduleTaskName(item) : item.name;
    function doDelete() {
      reportConfigs = reportConfigs.filter(function (config) { return config.id !== id; });
      if (state.selectedConfigId === id) state.selectedConfigId = '';
      clampConfigPage(getConfigRows().length);
      renderAll();
      showToast(entityName + '已删除');
    }
    if (window.DP && typeof DP.confirm === 'function') {
      DP.confirm('确认删除' + entityName + ' <b>' + escapeHtml(displayName) + '</b> 吗？', {
        icon: 'danger',
        okText: '删除',
        onOk: doDelete
      });
    } else if (window.confirm('确认删除' + entityName + ' ' + displayName + ' 吗？')) {
      doDelete();
    }
  }

  function confirmConfigScheduleAction(id, actionType) {
    var item = getReportConfigById(id);
    if (!item) return;
    var isStart = actionType === 'start';
    if (isStart) {
      state.startScheduleModalOpen = true;
      state.startScheduleConfigId = getConfigBaseId(item.id);
      state.templateScheduleModalOpen = false;
      state.templateScheduleDraft = createTemplateScheduleDraft(item);
      renderAll();
      return;
    }
    var title = isStart ? '确认启动任务调度' : '确认停止任务调度';
    var okText = isStart ? '启动调度' : '停止调度';
    var nextStatus = isStart ? '已启动' : '未启动';
    var displayName = getScheduleTaskName(item);
    var message = title + ' <b>' + escapeHtml(displayName) + '</b> 吗？' +
      (isStart ? '启动后将按调度周期自动生成报告。' : '停止后将不再按调度周期自动生成报告。');
    function applyStatus() {
      item.status = nextStatus;
      renderAll();
      showToast('任务调度已' + okText);
    }
    if (window.DP && typeof DP.confirm === 'function') {
      DP.confirm(message, {
        icon: isStart ? 'info' : 'warning',
        okText: okText,
        onOk: applyStatus
      });
    } else if (window.confirm(message.replace(/<[^>]+>/g, ''))) {
      applyStatus();
    }
  }

  function formatDateTime(date) {
    function pad(value) {
      return String(value).padStart(2, '0');
    }
    return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate()) + ' ' +
      pad(date.getHours()) + ':' + pad(date.getMinutes()) + ':' + pad(date.getSeconds());
  }

  function escapeSqlLiteral(value) {
    return String(value == null ? '' : value).replace(/'/g, "''");
  }

  function confirmConfigExecuteOnce(id) {
    var item = getReportConfigById(id);
    if (!item) return;
    var displayName = getScheduleTaskName(item);
    var message = '确认立即执行任务调度 <b>' + escapeHtml(displayName) + '</b> 吗？执行后将提交一次即时稽查，列表状态更新为执行中。';
    function applyExecute() {
      item.lastExecutionStatus = '执行中';
      item.lastGeneratedTime = formatDateTime(new Date());
      renderAll();
      showToast('任务调度已提交执行');
    }
    if (window.DP && typeof DP.confirm === 'function') {
      DP.confirm(message, {
        icon: 'info',
        okText: '执行',
        onOk: applyExecute
      });
    } else if (window.confirm(message.replace(/<[^>]+>/g, ''))) {
      applyExecute();
    }
  }

  function getScheduleRecordSql(run) {
    var config = getReportConfigById(run && run.configId) || getSelectedReportConfig() || reportConfigs[0];
    var reportIds = run && run.reportId ? [run.reportId] : (config && config.reportIds && config.reportIds.length ? config.reportIds : oaQualityReportIds).slice(0, 5);
    var tableNames = reportIds.map(function (id) {
      var report = reportRows.filter(function (item) { return item.id === id; })[0];
      return report ? "'" + escapeSqlLiteral(report.tableName) + "'" : "'" + escapeSqlLiteral(id) + "'";
    }).join(', ');
    var ruleFilter = run && run.ruleCode ? "        AND rule_code = '" + escapeSqlLiteral(run.ruleCode) + "'" : '';
    return [
      'WITH quality_scope AS (',
      '    SELECT',
      '        table_name,',
      '        rule_code,',
      '        check_sql,',
      '        enabled_flag',
      '    FROM',
      '        dq_quality_rule_config',
      '    WHERE',
      '        table_name IN (' + tableNames + ')',
      ruleFilter,
      '        AND enabled_flag = 1',
      '), run_result AS (',
      '    SELECT',
      '        s.table_name,',
      '        s.rule_code,',
      '        COUNT(1) AS total_count,',
      "        SUM(CASE WHEN r.check_status = 'FAILED' THEN 1 ELSE 0 END) AS problem_count",
      '    FROM',
      '        quality_scope s',
      '        LEFT JOIN dq_quality_check_result r',
      '            ON s.table_name = r.table_name',
      '            AND s.rule_code = r.rule_code',
      '    WHERE',
      "        r.batch_no = 'BATCH_" + String((run && run.batchIndex != null ? run.batchIndex : (run && run.index) || 0)).padStart(4, '0') + "'",
      '    GROUP BY',
      '        s.table_name, s.rule_code',
      ')',
      'SELECT',
      '    table_name,',
      '    rule_code,',
      '    total_count,',
      '    problem_count,',
      '    ROUND((1 - problem_count / NULLIF(total_count, 0)) * 100, 2) AS pass_rate',
      'FROM',
      '    run_result',
      'ORDER BY',
      '    problem_count DESC;'
    ].join('\n');
  }

  function getScheduleExecutionLog(run) {
    var config = getReportConfigById(run && run.configId) || getSelectedReportConfig() || reportConfigs[0];
    var endAt = run && run.endAt && run.endAt !== '-' ? run.endAt : formatDateTime(addSeconds(parseDateTime(run && run.startAt), parseDurationSeconds(run && run.duration)));
    var statusText = run && run.status === '执行失败' ? 'FAILED' : (run && run.status === '执行中' ? 'RUNNING' : 'SUCCESS');
    var isRuleRun = !!(run && run.ruleTask);
    var title = isRuleRun ? run.ruleTask : getScheduleTaskName(config);
    var scopeText = isRuleRun
      ? 'run rule ' + escapeHtml(run.ruleCode) + ' on ' + escapeHtml(run.tableName)
      : 'load ' + escapeHtml(config ? config.tableCount : '-') + ' tables and ' + escapeHtml(config ? config.taskCount : '-') + ' quality tasks';
    var appIndex = run && run.batchIndex != null ? run.batchIndex : ((run && run.index) || 0);
    return [
      '[' + escapeHtml(run && run.startAt) + '] INFO  ScheduleEngine - receive quality schedule task ' + escapeHtml(title),
      '[' + escapeHtml(run && run.startAt) + '] INFO  Scheduler - cycle=' + escapeHtml(getCycleText(config && config.cycle)) + ', trigger=manual_or_timer',
      '[' + escapeHtml(run && run.startAt) + '] INFO  QualityScope - ' + scopeText,
      '[' + escapeHtml(run && run.startAt) + '] INFO  SQLPrepare - compile execution SQL and bind datasource catalog',
      '[' + escapeHtml(run && run.startAt) + '] INFO  ExecuteEngine - submit Spark SQL application app-dq-' + String(1000 + appIndex),
      '[' + escapeHtml(endAt) + '] INFO  QualityResult - write task result, status=' + statusText,
      '[' + escapeHtml(endAt) + '] INFO  ScheduleEngine - task cost=' + escapeHtml(run && run.duration)
    ].join('\n');
  }

  function formatSqlText(sql) {
    return String(sql || '')
      .replace(/\s+(FROM|WHERE|GROUP BY|ORDER BY|HAVING|LEFT JOIN|RIGHT JOIN|INNER JOIN|JOIN)\b/gi, '\n$1')
      .replace(/\s+(AND|OR)\b/gi, '\n    $1')
      .replace(/,\s*/g, ',\n        ')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }

  function renderScheduleSqlEditor(sql) {
    var cfg = state.scheduleSql || { theme: 'dark', font: '14px', searchOpen: false };
    var isLight = cfg.theme === 'light';
    return '<div class="dp-sql-editor qir-schedule-sql-editor ' + (isLight ? 'theme-light' : 'theme-dark') + (cfg.searchOpen ? ' search-open' : '') + '" data-qir-schedule-sql-editor style="font-size:' + escapeHtml(cfg.font) + ';">' +
      '<div class="dp-sql-editor-toolbar">' +
        '<select class="dp-sql-editor-select" data-qir-schedule-sql-theme><option value="dark"' + (!isLight ? ' selected' : '') + '>暗色 - One Dark</option><option value="light"' + (isLight ? ' selected' : '') + '>亮色 - Light</option></select>' +
        '<select class="dp-sql-editor-select" data-qir-schedule-sql-font><option' + (cfg.font === '12px' ? ' selected' : '') + '>12px</option><option' + (cfg.font === '13px' ? ' selected' : '') + '>13px</option><option' + (cfg.font === '14px' ? ' selected' : '') + '>14px</option><option' + (cfg.font === '15px' ? ' selected' : '') + '>15px</option><option' + (cfg.font === '16px' ? ' selected' : '') + '>16px</option></select>' +
        '<button class="dp-sql-editor-btn" type="button" data-qir-action="format-schedule-sql"><i class="bi bi-sliders"></i><span>格式化</span></button>' +
        '<button class="dp-sql-editor-btn" type="button" data-qir-action="copy-schedule-sql"><i class="bi bi-clipboard"></i><span>复制</span></button>' +
        '<button class="dp-sql-editor-btn" type="button" data-qir-action="toggle-schedule-sql-search"><i class="bi bi-search"></i><span>搜索</span></button>' +
      '</div>' +
      '<div class="dp-sql-editor-searchbar">' +
        '<input class="dp-sql-editor-input" type="text" placeholder="查找...">' +
        '<button class="dp-sql-editor-btn" type="button">下一个</button>' +
        '<button class="dp-sql-editor-btn" type="button">上一个</button>' +
        '<label class="dp-sql-editor-check"><input type="checkbox"> 区分大小写</label>' +
        '<input class="dp-sql-editor-input" type="text" placeholder="替换...">' +
        '<button class="dp-sql-editor-btn" type="button">替换</button>' +
        '<span class="dp-sql-editor-close" data-qir-action="close-schedule-sql-search"><i class="bi bi-x"></i></span>' +
      '</div>' +
      '<div class="dp-sql-editor-wrap">' +
        '<div class="dp-sql-editor-gutter" data-qir-schedule-sql-gutter>' + lineNumbers(sql) + '</div>' +
        '<div class="dp-sql-editor-content" data-qir-schedule-sql-content contenteditable="true" spellcheck="false">' + highlightSQL(sql) + '</div>' +
      '</div>' +
    '</div>';
  }

  function getDescendantKeys(key, nodes) {
    var keys = [];
    nodes.forEach(function (node) {
      if (node.key === key) {
        keys.push(node.key);
        (node.children || []).forEach(function collect(child) {
          keys.push(child.key);
          (child.children || []).forEach(collect);
        });
      } else if (node.children) {
        keys = keys.concat(getDescendantKeys(key, node.children));
      }
    });
    return keys;
  }

  function getTreeSearchMatch(node) {
    var keyword = state.treeKeyword.trim().toLowerCase();
    if (!keyword) return true;
    if (node.label.toLowerCase().indexOf(keyword) >= 0) return true;
    return (node.children || []).some(getTreeSearchMatch);
  }

  function getReportRows() {
    var selectedConfig = getSelectedReportConfig();
    var selectedIds = selectedConfig ? selectedConfig.reportIds : [];
    var rows = reportRows.filter(function (item) {
      return !selectedIds.length || selectedIds.indexOf(item.id) >= 0;
    });
    var keyword = state.keyword.trim().toLowerCase();
    if (keyword) {
      rows = rows.filter(function (item) {
        return item.tableName.toLowerCase().indexOf(keyword) >= 0 ||
          item.alias.toLowerCase().indexOf(keyword) >= 0 ||
          item.dataSourceLabel.toLowerCase().indexOf(keyword) >= 0;
      });
    }
    rows.sort(function (a, b) { return b.lastExecutionTime.localeCompare(a.lastExecutionTime); });
    return rows;
  }

  function getSelectedReport() {
    return reportRows.filter(function (item) { return item.id === state.selectedReportId; })[0] ||
      getReportRows()[0] ||
      reportRows[0];
  }

  function clampPage(total) {
    var totalPages = Math.max(1, Math.ceil(total / state.pageSize));
    state.page = Math.max(1, Math.min(totalPages, state.page));
    return totalPages;
  }

  function getVisibleRows() {
    var rows = getReportRows();
    clampPage(rows.length);
    var start = (state.page - 1) * state.pageSize;
    return rows.slice(start, start + state.pageSize);
  }

  function getTemplateScopeRows() {
    var config = getSelectedReportConfig() || reportConfigs[0];
    var selectedIds = config && config.reportIds ? config.reportIds : [];
    var rows = reportRows.filter(function (item) {
      return selectedIds.indexOf(item.id) >= 0;
    });
    var keyword = state.templateScopeKeyword.trim().toLowerCase();
    if (keyword) {
      rows = rows.filter(function (item) {
        return item.tableName.toLowerCase().indexOf(keyword) >= 0 ||
          item.alias.toLowerCase().indexOf(keyword) >= 0 ||
          item.dataSourceLabel.toLowerCase().indexOf(keyword) >= 0 ||
          item.desc.toLowerCase().indexOf(keyword) >= 0 ||
          String(item.summary || '').toLowerCase().indexOf(keyword) >= 0;
      });
    }
    rows.sort(function (a, b) { return b.lastExecutionTime.localeCompare(a.lastExecutionTime); });
    return rows;
  }

  function clampTemplateScopePage(total) {
    var totalPages = Math.max(1, Math.ceil(total / state.templateScopePageSize));
    state.templateScopePage = Math.max(1, Math.min(totalPages, state.templateScopePage));
    return totalPages;
  }

  function getVisibleTemplateScopeRows() {
    var rows = getTemplateScopeRows();
    clampTemplateScopePage(rows.length);
    var start = (state.templateScopePage - 1) * state.templateScopePageSize;
    return rows.slice(start, start + state.templateScopePageSize);
  }

  function getTemplateScopeSelectedCount() {
    return Object.keys(state.templateScopeSelected || {}).filter(function (id) {
      return !!state.templateScopeSelected[id];
    }).length;
  }

  function clearTemplateScopeSelection() {
    state.templateScopeSelected = {};
  }

  function removeTemplateScopeRows(ids) {
    var config = getSelectedReportConfig() || reportConfigs[0];
    if (!config || !ids.length) return;
    var removeMap = {};
    ids.forEach(function (id) { removeMap[id] = true; });
    config.reportIds = (config.reportIds || []).filter(function (id) { return !removeMap[id]; });
    clearTemplateScopeSelection();
    clampTemplateScopePage(getTemplateScopeRows().length);
    renderAll();
    showToast('已移除 ' + ids.length + ' 条统计范围');
  }

  function getTemplateScopeCandidateRows() {
    var config = getSelectedReportConfig() || reportConfigs[0];
    var selectedMap = {};
    (config && config.reportIds ? config.reportIds : []).forEach(function (id) {
      selectedMap[id] = true;
    });
    var treeKey = state.templateScopeModalTreeKey || 'all';
    var scopeKeys = treeKey === 'all' ? [] : getDescendantKeys(treeKey, reportTree);
    var keyword = state.templateScopeModalKeyword.trim().toLowerCase();
    var rows = reportRows.filter(function (item) {
      if (selectedMap[item.id]) return false;
      if (scopeKeys.length && scopeKeys.indexOf(item.dataSourceKey) < 0) return false;
      if (!keyword) return true;
      return item.tableName.toLowerCase().indexOf(keyword) >= 0 ||
        item.alias.toLowerCase().indexOf(keyword) >= 0 ||
        item.dataSourceLabel.toLowerCase().indexOf(keyword) >= 0 ||
        item.desc.toLowerCase().indexOf(keyword) >= 0;
    });
    rows.sort(function (a, b) {
      var sourceCompare = a.dataSourceLabel.localeCompare(b.dataSourceLabel);
      return sourceCompare || a.tableName.localeCompare(b.tableName);
    });
    return rows;
  }

  function getTemplateScopeModalSelectedCount() {
    return Object.keys(state.templateScopeModalSelected || {}).filter(function (id) {
      return !!state.templateScopeModalSelected[id];
    }).length;
  }

  function closeTemplateScopeModal() {
    state.templateScopeModalOpen = false;
    state.templateScopeModalKeyword = '';
    state.templateScopeModalTreeKey = 'all';
    state.templateScopeModalSelected = {};
    renderAll();
  }

  function addTemplateScopeRowsFromModal() {
    var config = getSelectedReportConfig() || reportConfigs[0];
    var ids = Object.keys(state.templateScopeModalSelected || {}).filter(function (id) {
      return !!state.templateScopeModalSelected[id];
    });
    if (!config || !ids.length) {
      showToast('请先选择数据表');
      return;
    }
    config.reportIds = config.reportIds || [];
    var used = {};
    (config.reportIds || []).forEach(function (id) { used[id] = true; });
    ids.forEach(function (id) {
      if (!used[id]) {
        config.reportIds.push(id);
        used[id] = true;
      }
    });
    state.templateScopeModalOpen = false;
    state.templateScopeModalKeyword = '';
    state.templateScopeModalTreeKey = 'all';
    state.templateScopeModalSelected = {};
    state.templateScopePage = 1;
    clearTemplateScopeSelection();
    renderAll();
    showToast('已添加 ' + ids.length + ' 张表');
  }

  function getTemplateFilterScopeRows(config) {
    config = config || getSelectedReportConfig() || reportConfigs[0];
    var selectedIds = config && config.reportIds ? config.reportIds : [];
    var rows = reportRows.filter(function (item) {
      return selectedIds.indexOf(item.id) >= 0;
    });
    rows.sort(function (a, b) {
      var sourceCompare = a.dataSourceLabel.localeCompare(b.dataSourceLabel);
      return sourceCompare || a.tableName.localeCompare(b.tableName);
    });
    return rows;
  }

  function getTemplateFilterGroups(config) {
    config = config || getSelectedReportConfig() || reportConfigs[0];
    if (!config || !config.id) return [];
    if (!templateFilterGroupsByConfig[config.id]) {
      templateFilterGroupsByConfig[config.id] = [];
    }
    return templateFilterGroupsByConfig[config.id];
  }

  function getTemplateFilterGroup(config, groupId) {
    var groups = getTemplateFilterGroups(config);
    if (!groups.length) return null;
    return groups.filter(function (item) { return item.id === groupId; })[0] || groups[0];
  }

  function getTemplateFilterGroupById(groupId) {
    return getTemplateFilterGroup(getSelectedReportConfig() || reportConfigs[0], groupId);
  }

  function getTemplateApplyMode(config) {
    return config && config.templateApplyMode === 'group' ? 'group' : 'common';
  }

  function setTemplateApplyMode(config, mode) {
    if (!config) return;
    config.templateApplyMode = mode === 'group' ? 'group' : 'common';
    if (config.templateApplyMode === 'common') {
      state.templateEditTarget = 'common';
      state.templateEditGroupId = '';
    }
  }

  function getTemplateGroupById(config, groupId) {
    return getTemplateFilterGroups(config).filter(function (item) { return item.id === groupId; })[0] || null;
  }

  function getTemplateCommonHtml(config) {
    return (config && config.templateCommonHtml) || '';
  }

  function getTemplateGroupHtml(group) {
    return (group && group.templateHtml) || '';
  }

  function getTemplateEditorStorageHtml(config, target, groupId) {
    if (target === 'group') {
      return getTemplateGroupHtml(getTemplateGroupById(config, groupId));
    }
    return getTemplateCommonHtml(config);
  }

  function getTemplateEditorFallbackHtml(config) {
    return getTemplateCommonHtml(config) || renderTemplateEditorDefaultContent();
  }

  function persistTemplateEditorContent() {
    var config = getSelectedReportConfig() || reportConfigs[0];
    if (!config) return;
    if (state.templateEditTarget === 'group' && state.templateEditGroupId) {
      var group = getTemplateGroupById(config, state.templateEditGroupId);
      if (group) {
        group.templateHtml = state.templateEditorHtml || getTemplateEditorFallbackHtml(config);
        group.templateUpdatedAt = formatDateTime(new Date());
      }
      return;
    }
    config.templateCommonHtml = state.templateEditorHtml || renderTemplateEditorDefaultContent();
    config.templateCommonUpdatedAt = formatDateTime(new Date());
  }

  function loadTemplateEditorContent(config, target, groupId, options) {
    config = config || getSelectedReportConfig() || reportConfigs[0];
    target = target === 'group' ? 'group' : 'common';
    var group = target === 'group' ? getTemplateGroupById(config, groupId) : null;
    state.templateEditTarget = group ? 'group' : 'common';
    state.templateEditGroupId = group ? group.id : '';
    state.templateEditorHtml = getTemplateEditorStorageHtml(config, state.templateEditTarget, state.templateEditGroupId);
    if (options && options.copyCommon && group) {
      group.templateHtml = getTemplateEditorFallbackHtml(config);
      group.templateUpdatedAt = formatDateTime(new Date());
      state.templateEditorHtml = group.templateHtml;
    } else if (options && options.useCommonFallback && group && !state.templateEditorHtml) {
      state.templateEditorHtml = getTemplateEditorFallbackHtml(config);
    }
  }

  function loadFirstTemplateGroupEditor(config) {
    config = config || getSelectedReportConfig() || reportConfigs[0];
    var groups = getTemplateFilterGroups(config);
    if (!groups.length) {
      loadTemplateEditorContent(config, 'common');
      return;
    }
    var group = getTemplateGroupById(config, state.templateEditGroupId) || groups[0];
    loadTemplateEditorContent(config, 'group', group.id, { useCommonFallback: true });
  }

  function getTemplateEditLabel(config) {
    if (state.templateEditTarget === 'group' && state.templateEditGroupId) {
      var group = getTemplateGroupById(config, state.templateEditGroupId);
      return group ? group.name + '模板' : '分组模板';
    }
    return '通用模板';
  }

  function ensureTemplateEditorTarget(config) {
    config = config || getSelectedReportConfig() || reportConfigs[0];
    if (getTemplateApplyMode(config) !== 'group') {
      if (state.templateEditTarget !== 'common') {
        loadTemplateEditorContent(config, 'common');
      }
      return;
    }
    if (state.templateEditTarget !== 'group' || !getTemplateGroupById(config, state.templateEditGroupId)) {
      loadFirstTemplateGroupEditor(config);
    }
  }

  function getTemplateFilterRow(group, rowId) {
    return (group && group.rows ? group.rows : []).filter(function (item) { return item.id === rowId; })[0] || null;
  }

  function createTemplateFilterRowFromScope(group, scopeRow) {
    return {
      id: 'fr-' + group.id + '-' + scopeRow.id,
      reportId: scopeRow.id,
      tableName: scopeRow.tableName,
      alias: scopeRow.alias,
      condition: '',
      desc: '请点击编辑配置过滤条件。'
    };
  }

  function syncTemplateFilterGroupRows(config, group) {
    if (!group) return [];
    var existingMap = {};
    (group.rows || []).forEach(function (item) {
      existingMap[item.reportId] = item;
    });
    group.rows = getTemplateFilterScopeRows(config).map(function (scopeRow) {
      var current = existingMap[scopeRow.id] || createTemplateFilterRowFromScope(group, scopeRow);
      current.reportId = scopeRow.id;
      current.tableName = scopeRow.tableName;
      current.alias = scopeRow.alias;
      if (!current.desc) current.desc = '请点击编辑配置过滤条件。';
      return current;
    });
    return group.rows;
  }

  function getTemplateFilterConditionCount(groups) {
    return (groups || []).reduce(function (total, group) {
      return total + ((group.rows || []).length);
    }, 0);
  }

  function getTemplateFilterPageSize(group) {
    var groupId = group && group.id ? group.id : '';
    return Number(state.templateFilterPageSizes[groupId]) || 10;
  }

  function getTemplateFilterGroupPage(group) {
    var groupId = group && group.id ? group.id : '';
    return Number(state.templateFilterPages[groupId]) || 1;
  }

  function getTemplateFilterFilteredRows(group) {
    var rows = (group && group.rows ? group.rows : []).slice();
    var keyword = state.templateFilterKeyword.trim().toLowerCase();
    if (keyword) {
      rows = rows.filter(function (item) {
        return item.tableName.toLowerCase().indexOf(keyword) >= 0 ||
          item.alias.toLowerCase().indexOf(keyword) >= 0 ||
          item.condition.toLowerCase().indexOf(keyword) >= 0 ||
          item.desc.toLowerCase().indexOf(keyword) >= 0;
      });
    }
    return rows;
  }

  function clampTemplateFilterGroupPage(group, total) {
    var groupId = group && group.id ? group.id : '';
    var pageSize = getTemplateFilterPageSize(group);
    var totalPages = Math.max(1, Math.ceil(total / pageSize));
    state.templateFilterPages[groupId] = Math.max(1, Math.min(totalPages, getTemplateFilterGroupPage(group)));
    return totalPages;
  }

  function getVisibleTemplateFilterRows(group) {
    var rows = getTemplateFilterFilteredRows(group);
    var pageSize = getTemplateFilterPageSize(group);
    clampTemplateFilterGroupPage(group, rows.length);
    var start = (getTemplateFilterGroupPage(group) - 1) * pageSize;
    return rows.slice(start, start + pageSize);
  }

  function createTemplateFilterGroup(config) {
    config = config || getSelectedReportConfig() || reportConfigs[0];
    var groups = getTemplateFilterGroups(config);
    var index = groups.length + 1;
    var id = 'fg-' + (config && config.id ? config.id : 'template') + '-' + Date.now();
    var group = {
      id: id,
      name: '数据过滤组' + index,
      desc: '用于配置第 ' + index + ' 组数据过滤条件。',
      editing: false,
      editingField: 'name',
      rows: []
    };
    syncTemplateFilterGroupRows(config, group);
    groups.push(group);
    state.templateFilterActiveGroupId = id;
    state.templateFilterPages[id] = 1;
    state.templateFilterPageSizes[id] = 10;
    return group;
  }

  function saveTemplateFilterGroupField(input) {
    var group = getTemplateFilterGroupById(input.getAttribute('data-group-id') || '');
    if (!group) return;
    if (input.matches('[data-qir-template-filter-group-name]')) {
      group.name = input.value.trim() || '未命名过滤组';
    } else if (input.matches('[data-qir-template-filter-group-desc]')) {
      group.desc = input.value.trim() || '暂无描述';
    }
  }

  function deleteTemplateFilterGroup(groupId) {
    var config = getSelectedReportConfig() || reportConfigs[0];
    var groups = getTemplateFilterGroups(config);
    var groupIndex = groups.findIndex(function (item) { return item.id === groupId; });
    if (groupIndex < 0) return;
    var group = groups[groupIndex];

    function doDelete() {
      var currentGroups = getTemplateFilterGroups(config);
      var currentIndex = currentGroups.findIndex(function (item) { return item.id === groupId; });
      if (currentIndex < 0) return;
      currentGroups.splice(currentIndex, 1);

      delete state.templateFilterPages[groupId];
      delete state.templateFilterPageSizes[groupId];
      if (state.templateFilterActiveGroupId === groupId) {
        var nextActiveGroup = currentGroups[Math.min(currentIndex, currentGroups.length - 1)] || null;
        state.templateFilterActiveGroupId = nextActiveGroup ? nextActiveGroup.id : '';
      }
      if (state.templateFilterModalGroupId === groupId) {
        state.templateFilterModalOpen = false;
        state.templateFilterModalGroupId = '';
        state.templateFilterModalRowId = '';
        state.templateFilterModalDraft = null;
      }
      if (state.templateCopyTargetGroupId === groupId) {
        state.templateCopyTargetGroupId = '';
      }

      if (!currentGroups.length) {
        setTemplateApplyMode(config, 'common');
        loadTemplateEditorContent(config, 'common');
      } else if (state.templateEditTarget === 'group' && state.templateEditGroupId === groupId) {
        var nextEditGroup = currentGroups[Math.min(currentIndex, currentGroups.length - 1)];
        loadTemplateEditorContent(config, 'group', nextEditGroup.id, { useCommonFallback: true });
      }

      renderAll();
      showToast('数据过滤分组已删除');
    }

    var message = '确认删除数据过滤分组 <b>' + escapeHtml(group.name) + '</b> 吗？删除后，该分组的过滤条件和分组模板将一并删除。';
    if (window.DP && typeof DP.confirm === 'function') {
      DP.confirm(message, {
        icon: 'danger',
        okText: '删除',
        onOk: doDelete
      });
    } else if (window.confirm(message.replace(/<[^>]+>/g, ''))) {
      doDelete();
    }
  }

  function findReportRowById(id) {
    return reportRows.filter(function (item) { return item.id === id; })[0] || null;
  }

  function getTemplateFilterAvailableScopeRow(config, group) {
    var used = {};
    (group && group.rows ? group.rows : []).forEach(function (item) {
      used[item.reportId] = true;
    });
    var scopeRows = getTemplateFilterScopeRows(config);
    return scopeRows.filter(function (item) { return !used[item.id]; })[0] || scopeRows[0] || reportRows[0];
  }

  function getTemplateFilterFieldOptions() {
    return [
      { name: 'is_deleted', label: '逻辑删除标识' },
      { name: 'status', label: '业务状态' },
      { name: 'biz_date', label: '业务日期' },
      { name: 'tenant_id', label: '租户编码' },
      { name: 'org_code', label: '组织编码' },
      { name: 'data_status', label: '数据状态' },
      { name: 'created_time', label: '创建时间' },
      { name: 'updated_time', label: '更新时间' }
    ];
  }

  function guessTemplateFilterField(condition) {
    var lower = String(condition || '').toLowerCase();
    var fields = getTemplateFilterFieldOptions();
    for (var i = 0; i < fields.length; i++) {
      if (lower.indexOf(fields[i].name.toLowerCase()) >= 0) return fields[i].name;
    }
    return fields[0].name;
  }

  function createTemplateFilterModalDraft(config, group, row) {
    var table = findReportRowById(row && row.reportId) || getTemplateFilterAvailableScopeRow(config, group);
    var condition = row && row.condition ? row.condition : 'is_deleted = 0';
    return {
      tableId: table ? table.id : '',
      field: guessTemplateFilterField(condition),
      operator: '等于',
      value: row && row.condition ? '' : '0',
      desc: row && row.desc ? row.desc : '限定有效业务数据。',
      applyScope: 'current',
      sql: condition
    };
  }

  function openTemplateFilterModal(groupId, rowId) {
    var config = getSelectedReportConfig() || reportConfigs[0];
    var group = getTemplateFilterGroup(config, groupId);
    if (!group) {
      group = createTemplateFilterGroup(config);
    }
    var row = getTemplateFilterRow(group, rowId);
    state.templateFilterModalOpen = true;
    state.templateFilterModalGroupId = group.id;
    state.templateFilterModalRowId = row ? row.id : '';
    state.templateFilterModalMode = 'visual';
    state.templateFilterModalDraft = createTemplateFilterModalDraft(config, group, row);
    state.templateFilterFieldKeyword = '';
    state.templateFilterSql = { theme: 'dark', font: '14px', searchOpen: false };
    renderAll();
  }

  function closeTemplateFilterModal() {
    state.templateFilterModalOpen = false;
    state.templateFilterModalGroupId = '';
    state.templateFilterModalRowId = '';
    state.templateFilterModalMode = 'visual';
    state.templateFilterModalDraft = null;
    state.templateFilterFieldKeyword = '';
    state.templateFilterSql = { theme: 'dark', font: '14px', searchOpen: false };
    renderAll();
  }

  function captureTemplateFilterModalDraft() {
    var draft = state.templateFilterModalDraft || {};
    if (!pageEl) return draft;
    var fieldSelect = pageEl.querySelector('[data-qir-template-filter-field]');
    var operatorSelect = pageEl.querySelector('[data-qir-template-filter-operator]');
    var valueInput = pageEl.querySelector('[data-qir-template-filter-value]');
    var descInput = pageEl.querySelector('[data-qir-template-filter-desc]');
    var applyScopeInput = pageEl.querySelector('[name="qir-template-filter-apply-scope"]:checked');
    var sqlContent = pageEl.querySelector('[data-qir-template-filter-sql-content]');
    if (fieldSelect) draft.field = fieldSelect.value;
    if (operatorSelect) draft.operator = operatorSelect.value;
    if (valueInput) draft.value = valueInput.value;
    if (descInput) draft.desc = descInput.value;
    if (applyScopeInput) draft.applyScope = applyScopeInput.value === 'all' ? 'all' : 'current';
    if (sqlContent) draft.sql = sqlContent.textContent || '';
    state.templateFilterModalDraft = draft;
    return draft;
  }

  function formatTemplateFilterValue(value) {
    var text = String(value == null ? '' : value).trim();
    if (!text) return "''";
    if (/^\$\{[^}]+\}$/.test(text) || /^-?\d+(\.\d+)?$/.test(text) || /^(true|false|null)$/i.test(text)) {
      return text;
    }
    return "'" + text.replace(/'/g, "''") + "'";
  }

  function buildTemplateFilterConditionFromDraft(draft) {
    draft = draft || {};
    var field = draft.field || 'is_deleted';
    var operator = draft.operator || '等于';
    var value = String(draft.value == null ? '' : draft.value).trim();
    if (state.templateFilterModalMode === 'sql') {
      return String(draft.sql || '').trim() || field + ' = 0';
    }
    if (operator === '为空') return field + ' IS NULL';
    if (operator === '不为空') return field + ' IS NOT NULL';
    if (operator === '包含') return field + ' LIKE ' + formatTemplateFilterValue('%' + value + '%');
    if (operator === '不包含') return field + ' NOT LIKE ' + formatTemplateFilterValue('%' + value + '%');
    var symbolMap = {
      '等于': '=',
      '不等于': '<>',
      '大于': '>',
      '小于': '<',
      '大于等于': '>=',
      '小于等于': '<='
    };
    return field + ' ' + (symbolMap[operator] || '=') + ' ' + formatTemplateFilterValue(value);
  }

  function saveTemplateFilterModal() {
    var config = getSelectedReportConfig() || reportConfigs[0];
    var group = getTemplateFilterGroup(config, state.templateFilterModalGroupId);
    if (!group) {
      showToast('请先新增过滤分组');
      return;
    }
    var draft = captureTemplateFilterModalDraft();
    syncTemplateFilterGroupRows(config, group);
    var row = getTemplateFilterRow(group, state.templateFilterModalRowId) || group.rows[0];
    var table = findReportRowById((row && row.reportId) || draft.tableId) || getTemplateFilterAvailableScopeRow(config, group);
    if (!table || !row) {
      showToast('暂无可配置的数据表');
      return;
    }
    var condition = buildTemplateFilterConditionFromDraft(draft);
    var desc = String(draft.desc || '').trim() || '暂无备注描述';
    if (draft.applyScope === 'all') {
      group.rows.forEach(function (item) {
        item.condition = condition;
        item.desc = desc;
      });
    } else {
      row.reportId = table.id;
      row.tableName = table.tableName;
      row.alias = table.alias;
      row.condition = condition;
      row.desc = desc;
    }
    state.templateFilterModalOpen = false;
    state.templateFilterModalGroupId = '';
    state.templateFilterModalRowId = '';
    state.templateFilterModalDraft = null;
    state.templateFilterFieldKeyword = '';
    renderAll();
    showToast('过滤条件已保存');
  }

  function clearTemplateFilterRow(groupId, rowId) {
    var group = getTemplateFilterGroupById(groupId);
    var row = getTemplateFilterRow(group, rowId);
    if (!row) return;
    row.condition = '';
    row.desc = '请点击编辑配置过滤条件。';
    renderAll();
    showToast('过滤条件已移除');
  }

  function renderTemplateFilterSqlEditor(sql) {
    var cfg = state.templateFilterSql || { theme: 'dark', font: '14px', searchOpen: false };
    var isLight = cfg.theme === 'light';
    return '<div class="dp-sql-editor qir-filter-sql-editor ' + (isLight ? 'theme-light' : 'theme-dark') + (cfg.searchOpen ? ' search-open' : '') + '" data-qir-template-filter-sql-editor style="font-size:' + escapeHtml(cfg.font) + ';">' +
      '<div class="dp-sql-editor-toolbar">' +
        '<select class="dp-sql-editor-select" data-qir-template-filter-sql-theme><option value="dark"' + (!isLight ? ' selected' : '') + '>暗色 - One Dark</option><option value="light"' + (isLight ? ' selected' : '') + '>亮色 - Light</option></select>' +
        '<select class="dp-sql-editor-select" data-qir-template-filter-sql-font><option' + (cfg.font === '12px' ? ' selected' : '') + '>12px</option><option' + (cfg.font === '13px' ? ' selected' : '') + '>13px</option><option' + (cfg.font === '14px' ? ' selected' : '') + '>14px</option><option' + (cfg.font === '15px' ? ' selected' : '') + '>15px</option><option' + (cfg.font === '16px' ? ' selected' : '') + '>16px</option></select>' +
        '<button class="dp-sql-editor-btn" type="button" data-qir-action="format-template-filter-sql"><i class="bi bi-sliders"></i><span>格式化</span></button>' +
        '<button class="dp-sql-editor-btn" type="button" data-qir-action="copy-template-filter-sql"><i class="bi bi-clipboard"></i><span>复制</span></button>' +
        '<button class="dp-sql-editor-btn" type="button" data-qir-action="toggle-template-filter-sql-search"><i class="bi bi-search"></i><span>搜索</span></button>' +
      '</div>' +
      '<div class="dp-sql-editor-searchbar">' +
        '<input class="dp-sql-editor-input" type="text" placeholder="查找...">' +
        '<button class="dp-sql-editor-btn" type="button">下一个</button>' +
        '<button class="dp-sql-editor-btn" type="button">上一个</button>' +
        '<label class="dp-sql-editor-check"><input type="checkbox"> 区分大小写</label>' +
        '<input class="dp-sql-editor-input" type="text" placeholder="替换...">' +
        '<button class="dp-sql-editor-btn" type="button">替换</button>' +
        '<span class="dp-sql-editor-close" data-qir-action="close-template-filter-sql-search"><i class="bi bi-x"></i></span>' +
      '</div>' +
      '<div class="dp-sql-editor-wrap">' +
        '<div class="dp-sql-editor-gutter" data-qir-template-filter-sql-gutter>' + lineNumbers(sql) + '</div>' +
        '<div class="dp-sql-editor-content" data-qir-template-filter-sql-content contenteditable="true" spellcheck="false">' + highlightSQL(sql) + '</div>' +
      '</div>' +
    '</div>';
  }

  function getQualityRules(report) {
    var count = Math.max(3, Math.min(issueTemplates.length, report.ruleCount));
    var fields = getInspectionFields(report);
    return issueTemplates.slice(0, count).map(function (tpl, index) {
      var rate = Math.max(52, Math.min(100, Math.round((report.avgPassRate + 10 - tpl.rateOffset + index * 1.3) * 10) / 10));
      var issueField = getIssueFieldForRule(fields, tpl.ruleKey);
      var issueCount = Math.floor(report.problemRecordCount / count) + (index < report.problemRecordCount % count ? 1 : 0);
      return {
        key: tpl.ruleKey,
        name: tpl.ruleName,
        type: tpl.type,
        field: issueField,
        desc: issueField + ' 需满足' + tpl.type + '规则，稽查对象为 ' + report.tableName + '。',
        rate: rate,
        summary: '质量概述：' + report.alias + '的 ' + issueField + ' 字段在“' + tpl.ruleName + '”中命中问题记录 ' + issueCount + ' 条，通过率为 ' + rate + '%。' + getRuleIssueSummary(tpl.ruleKey, issueField)
      };
    });
  }

  function getRuleIssueSummary(ruleKey, issueField) {
    return '质量要求：' + getRuleRequirementSummary(ruleKey, issueField);
  }

  function getRuleRequirementSummary(ruleKey, issueField) {
    var enumRequirements = {
      order_status: '合法枚举值为：0（其他）、1（一级）、2（二级）、3（三级），不允许出现 -1、99、NULL 或未配置状态码。',
      status: '合法枚举值为：0（停用）、1（启用）、2（冻结）、3（注销），不允许出现未配置状态码。',
      stock_status: '合法枚举值为：0（下架）、1（在售）、2（缺货）、3（预售），不允许出现未配置状态码。',
      customer_level: '合法枚举值为：0（普通）、1（银牌）、2（金牌）、3（铂金），不允许出现未配置等级。',
      approve_status: '合法枚举值为：0（待审批）、1（审批中）、2（已通过）、3（已驳回），不允许出现未配置审批状态。',
      region_level: '合法枚举值为：0（国家）、1（省级）、2（市级）、3（区县级），不允许出现未配置层级。',
      event_type: '合法枚举值为：0（其他）、1（浏览）、2（点击）、3（提交），不允许出现未配置事件类型。'
    };
    if (ruleKey === 'required') {
      return issueField + ' 为必填字段，不能为空、不能为 NULL，主键、业务关键字段和关联字段必须在入库时完成写入。';
    }
    if (ruleKey === 'unique') {
      return issueField + ' 在本次稽查范围内必须唯一，不允许多条记录共用同一个业务键；重复值需要回溯上游生成逻辑或去重策略。';
    }
    if (ruleKey === 'range') {
      if (issueField.indexOf('amount') >= 0 || issueField.indexOf('price') >= 0) {
        return issueField + ' 合理取值应大于等于 0，不能为负数；金额类字段应保留两位小数，不能出现无业务含义的异常金额。';
      }
      if (issueField.indexOf('qty') >= 0) {
        return issueField + ' 合理取值应为大于等于 0 的整数，不能为负数，库存或数量类字段不能出现无业务含义的异常数量。';
      }
      if (issueField.indexOf('days') >= 0) {
        return issueField + ' 合理取值应大于 0 且不超过 365，不能为 0、负数或明显超出业务周期的天数。';
      }
      if (issueField.indexOf('score') >= 0) {
        return issueField + ' 合理取值范围为 0 到 100，不能为负数，也不能超过评分上限。';
      }
      if (issueField.indexOf('duration') >= 0) {
        return issueField + ' 合理取值应大于等于 0 且处于业务可接受范围内，不能为负数或明显超出正常处理时长。';
      }
      if (issueField.indexOf('year') >= 0) {
        return issueField + ' 合理取值应大于等于 0 且符合员工实际年限，不能为负数或明显超出合理工作年限。';
      }
      if (issueField === 'sort_no') {
        return issueField + ' 合理取值应为大于等于 0 的排序数字，不能为负数或异常大的无意义排序值。';
      }
      return issueField + ' 合理取值应落在业务规则配置的上下限范围内，不能为负数、0 值异常或超出上限的异常值。';
    }
    if (ruleKey === 'enum') {
      return enumRequirements[issueField] || issueField + ' 必须使用已配置的标准枚举编码，不允许出现未配置编码、空值或临时状态码。';
    }
    if (ruleKey === 'format') {
      if (issueField.indexOf('mobile') >= 0 || issueField.indexOf('phone') >= 0) {
        return issueField + ' 必须为 11 位手机号格式，需以 1 开头且全部为数字，不能出现 PHONE_ERROR、13812ABC、少位、超长或包含非数字字符。';
      }
      if (issueField.indexOf('card') >= 0) {
        return issueField + ' 必须符合 18 位身份证号格式，出生日期段必须为有效日期，不能出现 ID_CARD_ERROR、非法日期段或校验位不合法的证件号。';
      }
      return issueField + ' 必须使用 yyyy-MM-dd HH:mm:ss 格式且为真实存在的日期时间，不能出现 INVALID_DATE、2026/99/99 99:99:99、月份越界、日期越界或时分秒越界。';
    }
    if (ruleKey === 'relation') {
      return issueField + ' 必须能在对应主数据、维表或上游业务实体中找到有效记录，不允许使用 999999、0、空值等无法关联的占位值。';
    }
    return issueField + ' 必须满足当前质量规则配置的合法取值、格式和业务约束。';
  }

  function getInspectionFields(report) {
    if (report.tableName.indexOf('employee') >= 0) {
      return ['employee_id', 'employee_no', 'real_name', 'phone', 'department_id', 'position_type', 'work_years', 'hire_date', 'status', 'update_time'];
    }
    if (report.tableName.indexOf('customer') >= 0 || report.tableName.indexOf('crm') >= 0) {
      return ['customer_id', 'customer_no', 'customer_name', 'mobile', 'id_card_no', 'customer_level', 'credit_score', 'source_channel', 'create_time', 'update_time'];
    }
    if (report.tableName.indexOf('product') >= 0) {
      return ['product_id', 'sku_code', 'product_name', 'category_id', 'sale_price', 'stock_status', 'is_deleted', 'create_time', 'update_time'];
    }
    if (report.tableName.indexOf('inventory') >= 0) {
      return ['snapshot_id', 'warehouse_id', 'sku_code', 'available_qty', 'locked_qty', 'stock_status', 'snapshot_date', 'batch_no', 'create_time', 'update_time'];
    }
    if (report.tableName.indexOf('region') >= 0) {
      return ['region_id', 'parent_id', 'region_code', 'region_name', 'region_level', 'sort_no', 'is_enabled', 'create_time', 'update_time'];
    }
    if (report.tableName.indexOf('profile') >= 0) {
      return ['user_id', 'member_no', 'real_name', 'mobile', 'tag_code', 'tag_value', 'score', 'create_time', 'update_time'];
    }
    if (report.tableName.indexOf('contract') >= 0) {
      return ['contract_id', 'supplier_id', 'contract_no', 'contract_amount', 'start_date', 'end_date', 'approve_status', 'create_time', 'update_time'];
    }
    if (report.tableName.indexOf('leave') >= 0) {
      return ['apply_id', 'employee_id', 'leave_type', 'start_time', 'end_time', 'leave_days', 'approve_status', 'create_time', 'update_time'];
    }
    if (report.tableName.indexOf('log') >= 0) {
      return ['log_id', 'event_id', 'user_id', 'event_type', 'event_time', 'event_duration_ms', 'device_id', 'payload_hash', 'create_time', 'update_time'];
    }
    return ['order_id', 'user_id', 'order_no', 'order_status', 'total_amount', 'pay_amount', 'pay_time', 'create_time', 'update_time'];
  }

  function getIssueFieldForRule(fields, ruleKey) {
    var candidates = {
      required: ['order_id', 'user_id', 'employee_id', 'customer_id', 'product_id', 'snapshot_id', 'region_id', 'contract_id', 'apply_id', 'log_id'],
      unique: ['order_no', 'employee_no', 'customer_no', 'member_no', 'sku_code', 'contract_no', 'region_code', 'event_id', 'apply_id'],
      range: ['total_amount', 'pay_amount', 'sale_price', 'available_qty', 'locked_qty', 'credit_score', 'score', 'contract_amount', 'leave_days', 'work_years', 'sort_no', 'event_duration_ms'],
      enum: ['order_status', 'status', 'stock_status', 'customer_level', 'approve_status', 'region_level', 'event_type', 'position_type', 'leave_type', 'tag_code', 'is_deleted', 'is_enabled', 'source_channel'],
      format: ['pay_time', 'hire_date', 'mobile', 'phone', 'id_card_no', 'snapshot_date', 'start_date', 'end_date', 'event_time', 'start_time', 'end_time', 'create_time', 'update_time'],
      relation: ['user_id', 'department_id', 'category_id', 'warehouse_id', 'parent_id', 'supplier_id', 'employee_id', 'device_id']
    }[ruleKey] || [];
    var fallbackPatterns = {
      required: [/_id$/],
      unique: [/_no$/, /_code$/, /^event_id$/, /_id$/],
      range: [/amount/, /price/, /qty/, /days/, /score/, /sort_no/, /duration/, /year/, /count/, /num/],
      enum: [/status/, /level/, /type/, /^is_/, /source_channel/, /tag_code/],
      format: [/time/, /date/, /mobile/, /phone/, /card/],
      relation: [/_id$/]
    }[ruleKey] || [];
    for (var i = 0; i < candidates.length; i++) {
      if (fields.indexOf(candidates[i]) >= 0) return candidates[i];
    }
    for (var j = 0; j < fields.length; j++) {
      for (var k = 0; k < fallbackPatterns.length; k++) {
        if (fallbackPatterns[k].test(fields[j])) return fields[j];
      }
    }
    return fields[Math.min(2, fields.length - 1)];
  }

  function getRawIssueValue(ruleKey, field, index, report) {
    var prefix = report.tableName.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 3) || 'TAB';
    if (ruleKey === 'required') return 'NULL';
    if (ruleKey === 'unique') {
      if (field.indexOf('id') >= 0 && field.indexOf('card') < 0) return '70001';
      return prefix + '20260624001';
    }
    if (ruleKey === 'range') {
      if (field.indexOf('amount') >= 0 || field.indexOf('price') >= 0) return index % 2 ? '-99999.99' : '-0.01';
      if (field.indexOf('qty') >= 0) return index % 2 ? '-999' : '-1';
      if (field.indexOf('days') >= 0) return index % 2 ? '-99' : '999';
      if (field.indexOf('score') >= 0) return index % 2 ? '150' : '-20';
      if (field.indexOf('duration') >= 0) return index % 2 ? '-999' : '999999999';
      if (field.indexOf('year') >= 0) return index % 2 ? '-5' : '999';
      return '-999';
    }
    if (ruleKey === 'enum') return index % 2 ? '99' : '-1';
    if (ruleKey === 'format') {
      if (field.indexOf('mobile') >= 0 || field.indexOf('phone') >= 0) return index % 2 ? 'PHONE_ERROR' : '13812ABC';
      if (field.indexOf('card') >= 0) return 'ID_CARD_ERROR';
      return index % 2 ? 'INVALID_DATE' : '2026/99/99 99:99:99';
    }
    if (ruleKey === 'relation') return '999999';
    return 'NULL';
  }

  function makeFieldValues(report, fields, index, issueField, issueValue) {
    var values = {};
    fields.forEach(function (field) {
      if (field.indexOf('id') >= 0 && field.indexOf('card') < 0) values[field] = String(70000 + index * 11);
      else if (field === 'sort_no' || field.indexOf('qty') >= 0 || field.indexOf('days') >= 0 || field.indexOf('score') >= 0 || field.indexOf('duration') >= 0 || field.indexOf('year') >= 0 || field.indexOf('count') >= 0 || field.indexOf('num') >= 0) values[field] = String(10 + index % 80);
      else if (field.indexOf('card') >= 0) values[field] = '110101199001011234';
      else if (field.indexOf('no') >= 0 || field.indexOf('code') >= 0) values[field] = report.tableName.toUpperCase().slice(0, 3) + String(2026060000 + index * 13);
      else if (field.indexOf('name') >= 0) values[field] = ['张明', '李婷', '王强', '赵丽', '陈晨'][index % 5];
      else if (field.indexOf('mobile') >= 0 || field.indexOf('phone') >= 0) values[field] = '13' + String(500000000 + index * 7913).slice(0, 9);
      else if (field.indexOf('amount') >= 0 || field.indexOf('price') >= 0) values[field] = (68 + index * 3.7).toFixed(2);
      else if (field.indexOf('status') >= 0 || field.indexOf('level') >= 0 || field.indexOf('type') >= 0) values[field] = String(index % 4);
      else if (field.indexOf('time') >= 0 || field.indexOf('date') >= 0) values[field] = '2026-06-' + String(20 + index % 8).padStart(2, '0') + ' ' + String(8 + index % 10).padStart(2, '0') + ':15:00';
      else if (field.indexOf('hash') >= 0) values[field] = 'HASH' + String(900000 + index * 17);
      else values[field] = String(1000 + index * 9);
    });
    values[issueField] = issueValue;
    return values;
  }

  function makeProblemRows(report) {
    var rows = [];
    var rules = getQualityRules(report);
    var namePrefix = report.tableName.replace(/[^a-zA-Z0-9]/g, '').slice(0, 3).toUpperCase() || 'TAB';
    var fields = getInspectionFields(report);
    for (var i = 0; i < report.problemRecordCount; i++) {
      var rule = rules[i % rules.length];
      var day = 24 - (i % 6);
      var hour = 9 + (i % 8);
      var issueField = getIssueFieldForRule(fields, rule.key);
      var rawIssueValue = getRawIssueValue(rule.key, issueField, i + 1, report);
      rows.push({
        index: i + 1,
        ruleKey: rule.key,
        ruleName: rule.name,
        issueField: issueField,
        recordId: namePrefix + String(100000 + i * 17).slice(-6),
        businessKey: report.tableName + '_' + String(2026060000 + i * 13),
        values: makeFieldValues(report, fields, i + 1, issueField, rawIssueValue),
        foundAt: '2026-06-' + String(day).padStart(2, '0') + ' ' + String(hour).padStart(2, '0') + ':' + String((i * 7) % 60).padStart(2, '0') + ':00',
        status: i % 4 === 0 ? '待处理' : (i % 4 === 1 ? '已分派' : '待复核')
      });
    }
    return rows;
  }

  function getRuleProblemRows(report, ruleKey) {
    return makeProblemRows(report).filter(function (item) {
      return item.ruleKey === ruleKey;
    });
  }

  function getRulePage(ruleKey, total) {
    var totalPages = Math.max(1, Math.ceil(total / state.rulePageSize));
    var current = state.rulePages[ruleKey] || 1;
    current = Math.max(1, Math.min(totalPages, current));
    state.rulePages[ruleKey] = current;
    return current;
  }

  function getRateClass(rate) {
    if (rate < 80) return 'qir-rate-low';
    if (rate < 90) return 'qir-rate-mid';
    return 'qir-rate-high';
  }

  function renderRate(rate) {
    return '<span class="qir-rate ' + getRateClass(rate) + '">' +
      '<i style="width:' + Math.max(0, Math.min(100, rate)) + '%"></i>' +
      '<b>' + escapeHtml(rate.toFixed(1)) + '%</b>' +
    '</span>';
  }

  function splitRuleSummary(summary) {
    var text = String(summary || '')
      .replace(/^质量问题说明：/, '质量概述：')
      .replace(/问题表现：/g, '')
      .replace(/规则要求：/g, '质量要求：');
    var overviewMarker = '质量概述：';
    var requirementMarker = '质量要求：';
    var overviewIndex = text.indexOf(overviewMarker);
    var overviewText = overviewIndex >= 0 ? text.slice(overviewIndex + overviewMarker.length) : text;
    var requirementIndex = overviewText.indexOf(requirementMarker);
    if (requirementIndex < 0) {
      return { overview: overviewText.trim(), requirement: '' };
    }
    return {
      overview: overviewText.slice(0, requirementIndex).trim(),
      requirement: overviewText.slice(requirementIndex + requirementMarker.length).trim()
    };
  }

  function renderRuleSummary(rule) {
    var summary = splitRuleSummary(rule.summary);
    return '<div class="qir-issue-summary">' +
      '<p><b>质量概述：</b><span>' + escapeHtml(summary.overview || '当前字段存在不符合质量规则的异常数据。') + '</span></p>' +
      '<p><b>质量要求：</b><span>' + escapeHtml(summary.requirement || rule.desc) + '</span></p>' +
    '</div>';
  }

  function renderTree(nodes, level) {
    level = level || 0;
    return nodes.filter(getTreeSearchMatch).map(function (node) {
      var hasChildren = node.children && node.children.length;
      var isOpen = state.treeOpen[node.key] || !!state.treeKeyword.trim();
      var isActive = state.treeKey === node.key;
      return '<li>' +
        '<div class="qir-tree-node' + (isActive ? ' active' : '') + '" style="padding-left:' + (8 + level * 18) + 'px;">' +
          '<button class="qir-tree-toggle" type="button" data-qir-action="toggle-tree" data-key="' + escapeHtml(node.key) + '">' + (hasChildren ? '<i class="bi ' + (isOpen ? 'bi-chevron-down' : 'bi-chevron-right') + '"></i>' : '') + '</button>' +
          '<button class="qir-tree-label" type="button" data-qir-action="select-tree" data-key="' + escapeHtml(node.key) + '"><i class="bi ' + escapeHtml(node.icon || 'bi-folder-fill') + '"></i><span>' + escapeHtml(node.label) + '</span></button>' +
        '</div>' +
        (hasChildren && isOpen ? '<ul>' + renderTree(node.children, level + 1) + '</ul>' : '') +
      '</li>';
    }).join('');
  }

  function renderConfigScope(item) {
    return '<div class="qir-scope">' +
      '<span><b>' + escapeHtml(item.dbCount) + '</b>个数据源</span>' +
      '<span><b>' + escapeHtml(item.tableCount) + '</b>张表</span>' +
      '<span><b>' + escapeHtml(item.taskCount) + '</b>个质量任务</span>' +
    '</div>';
  }

  function getConfigDataRangeCount(item) {
    var groups = templateFilterGroupsByConfig[item && item.id] || [];
    return groups.length;
  }

  function getConfigDataRangeText(item) {
    var count = getConfigDataRangeCount(item);
    return count ? '已配置（' + count + '）' : '无配置';
  }

  function renderConfigDataRange(item) {
    var count = getConfigDataRangeCount(item);
    return '<span class="qir-data-range ' + (count ? 'configured' : 'none') + '">' + escapeHtml(getConfigDataRangeText(item)) + '</span>';
  }

  function renderConfigStatus(status) {
    var cls = status === '已启动' ? 'started' : 'stopped';
    var icon = 'bi-circle-fill';
    return '<span class="qir-status ' + cls + '"><i class="bi ' + icon + '"></i><span>' + escapeHtml(status) + '</span></span>';
  }

  function getConfigExecutionStatus(item) {
    if (!item) return '执行失败';
    return item.lastExecutionStatus || configExecutionStatusMap[item.id] || (item.status === '已启动' ? '执行成功' : '执行失败');
  }

  function getScheduleTaskName(item) {
    if (item && item.taskName) return String(item.taskName).trim();
    var configId = item && item.id ? getConfigBaseId(item.id) : '';
    if (configId && configTaskNameMap[configId]) return configTaskNameMap[configId];
    var name = String(item && item.name ? item.name : '未命名').trim();
    var baseName = name
      .replace(/稽查报告模板$/, '')
      .replace(/稽查报告$/, '')
      .replace(/检核报告模板$/, '')
      .replace(/检核报告$/, '')
      .replace(/质量周报$/, '质量')
      .replace(/周报$/, '')
      .replace(/报告模板$/, '')
      .replace(/报告$/, '')
      .replace(/模板$/, '')
      .trim();
    if (!baseName) baseName = '未命名';
    return /的任务$/.test(baseName) ? baseName : baseName + '的任务';
  }

  function getRelatedTaskOptions() {
    var seen = {};
    var options = [];
    getReportConfigRowsForReportList().forEach(function (item) {
      var taskName = getScheduleTaskName(item);
      if (taskName && !seen[taskName]) {
        seen[taskName] = true;
        options.push(taskName);
      }
    });
    return options;
  }

  function getFilteredRelatedTaskOptions() {
    var keyword = normalize(state.relatedTaskKeyword);
    return getRelatedTaskOptions().filter(function (item) {
      return !keyword || normalize(item).indexOf(keyword) >= 0;
    });
  }

  function renderRelatedTaskFilter() {
    var selected = state.relatedTaskFilter;
    var isOpen = !!state.relatedTaskDropdownOpen;
    var options = getFilteredRelatedTaskOptions();
    return '<span class="qir-query-label qir-query-label-gap">关联任务</span>' +
      '<div class="qir-search-select' + (isOpen ? ' open' : '') + '" data-qir-related-task-select>' +
        '<button class="qir-search-select-value' + (selected ? '' : ' placeholder') + '" type="button" data-qir-action="toggle-related-task-filter" aria-label="关联任务筛选">' +
          '<span>' + escapeHtml(selected || '全部任务') + '</span><i class="bi bi-chevron-down"></i>' +
        '</button>' +
        (isOpen ? '<div class="qir-search-select-menu">' +
          '<div class="qir-search-select-input"><i class="bi bi-search"></i><input type="text" data-qir-related-task-search value="' + escapeHtml(state.relatedTaskKeyword) + '" placeholder="搜索关联任务"></div>' +
          '<div class="qir-search-select-list">' +
            '<button type="button" data-qir-action="choose-related-task-filter" data-value=""' + (!selected ? ' class="active"' : '') + '><span>全部任务</span></button>' +
            (options.length ? options.map(function (item) {
              return '<button type="button" data-qir-action="choose-related-task-filter" data-value="' + escapeHtml(item) + '"' + (item === selected ? ' class="active"' : '') + '><span>' + escapeHtml(item) + '</span></button>';
            }).join('') : '<div class="qir-search-select-empty">暂无匹配任务</div>') +
          '</div>' +
        '</div>' : '') +
      '</div>';
  }

  function renderRelatedScheduleTaskLink(item) {
    var taskName = getScheduleTaskName(item);
    return '<button class="qir-related-task-link" type="button" data-qir-action="open-related-schedule" data-id="' + escapeHtml(item.id) + '" title="跳转任务调度：' + escapeHtml(taskName) + '">' +
      '<i class="bi bi-diagram-3"></i><span>' + escapeHtml(taskName) + '</span>' +
    '</button>';
  }

  function renderConfigNameCell(item, configName, scheduleMode) {
    if (scheduleMode) {
      return '<div class="qir-config-name"><b>' + escapeHtml(configName) + '</b></div>';
    }
    if (state.editingConfigNameId === item.id) {
      var editableConfig = getEditableReportConfigById(item.id) || item;
      var suffix = item.dataRangeGroupName ? '<span class="qir-config-name-edit-suffix">-' + escapeHtml(item.dataRangeGroupName) + '</span>' : '';
      return '<div class="qir-config-name editing"><input class="qir-config-name-input" type="text" data-qir-config-name-input data-id="' + escapeHtml(item.id) + '" value="' + escapeHtml(editableConfig.name || configName) + '" aria-label="编辑报告名称">' + suffix + '</div>';
    }
    return '<div class="qir-config-name">' +
      '<div class="qir-config-title-row">' +
        '<b title="' + escapeHtml(configName) + '">' + escapeHtml(configName) + '</b>' +
        '<button class="qir-config-name-edit" type="button" data-qir-action="edit-config-name" data-id="' + escapeHtml(item.id) + '" title="编辑报告名称" aria-label="编辑报告名称"><i class="bi bi-pencil-square"></i></button>' +
      '</div>' +
    '</div>';
  }

  function renderConfigExecutionStatus(status) {
    var success = status === '执行成功';
    var running = status === '执行中';
    var cls = running ? 'running' : (success ? 'success' : 'failure');
    var icon = running ? 'bi-arrow-repeat' : (success ? 'bi-check-circle-fill' : 'bi-x-circle-fill');
    return '<span class="qir-status ' + cls + '"><i class="bi ' + icon + '"></i><span>' + escapeHtml(status) + '</span></span>';
  }

  function renderConfigCycle(cycle) {
    cycle = cycle || {};
    var parts = [];
    if (cycle.weekday) parts.push(cycle.weekday);
    if (cycle.day) parts.push(cycle.day);
    if (cycle.time) parts.push(cycle.time);
    return '<div class="qir-cycle"><b>' + escapeHtml(cycle.type || '-') + '</b><span>' + escapeHtml(parts.join(' / ') || '-') + '</span></div>';
  }

  function getCycleText(cycle) {
    cycle = cycle || {};
    var parts = [cycle.type || '-'];
    if (cycle.weekday) parts.push(cycle.weekday);
    if (cycle.day) parts.push(cycle.day);
    if (cycle.time) parts.push(cycle.time);
    return parts.join(' / ');
  }

  function renderTemplateScheduleOptions(options, value) {
    return options.map(function (item) {
      var optionValue = typeof item === 'string' ? item : item.value;
      var label = typeof item === 'string' ? item : item.label;
      return '<option value="' + escapeHtml(optionValue) + '"' + (optionValue === value ? ' selected' : '') + '>' + escapeHtml(label) + '</option>';
    }).join('');
  }

  function createTemplateScheduleDraft(config) {
    var cycle = (config && config.cycle) || {};
    return {
      type: cycle.type || '每天',
      weekday: cycle.weekday || '周一',
      day: cycle.day || '1号',
      time: cycle.time || '10:05:02'
    };
  }

  function normalizeTemplateScheduleDraft(draft) {
    draft = draft || createTemplateScheduleDraft(getSelectedReportConfig() || reportConfigs[0]);
    if (draft.type !== '每天' && draft.type !== '每周' && draft.type !== '每月') draft.type = '每天';
    if (!draft.weekday) draft.weekday = '周一';
    if (!draft.day) draft.day = '1号';
    if (!draft.time) draft.time = '10:05:02';
    return draft;
  }

  function captureTemplateScheduleDraft() {
    var draft = normalizeTemplateScheduleDraft(state.templateScheduleDraft);
    if (!pageEl) return draft;
    pageEl.querySelectorAll('[data-qir-template-schedule-field]').forEach(function (field) {
      draft[field.getAttribute('data-qir-template-schedule-field')] = field.value;
    });
    state.templateScheduleDraft = normalizeTemplateScheduleDraft(draft);
    return state.templateScheduleDraft;
  }

  function getTemplateScheduleHint(draft) {
    draft = normalizeTemplateScheduleDraft(draft);
    if (draft.type === '每周') return '每周' + draft.weekday + ' ' + draft.time + ' 自动生成报告';
    if (draft.type === '每月') return '每月' + draft.day + ' ' + draft.time + ' 自动生成报告';
    return '每天 ' + draft.time + ' 自动生成报告';
  }

  function updateTemplateScheduleHintDom() {
    var draft = captureTemplateScheduleDraft();
    var hint = pageEl ? pageEl.querySelector('.qir-schedule-hint span') : null;
    if (hint) hint.textContent = getTemplateScheduleHint(draft);
    var summary = pageEl ? pageEl.querySelector('[data-qir-template-schedule-summary]') : null;
    if (summary) summary.textContent = getTemplateScheduleHint(draft);
  }

  function applyTemplateScheduleDraft() {
    var config = getSelectedReportConfig() || reportConfigs[0];
    var draft = captureTemplateScheduleDraft();
    var nextCycle = { type: draft.type, time: draft.time };
    if (draft.type === '每周') nextCycle.weekday = draft.weekday || '周一';
    if (draft.type === '每月') nextCycle.day = draft.day || '1号';
    config.cycle = nextCycle;
    state.templateScheduleModalOpen = false;
    state.templateScheduleDraft = null;
    renderAll();
    showToast('调度周期配置已保存');
  }

  function applyStartScheduleDraft() {
    var config = getReportConfigById(state.startScheduleConfigId) || reportConfigs[0];
    if (!config) return;
    var draft = captureTemplateScheduleDraft();
    var nextCycle = { type: draft.type, time: draft.time };
    if (draft.type === '每周') nextCycle.weekday = draft.weekday || '周一';
    if (draft.type === '每月') nextCycle.day = draft.day || '1号';
    config.cycle = nextCycle;
    config.status = '已启动';
    state.startScheduleModalOpen = false;
    state.startScheduleConfigId = '';
    state.templateScheduleDraft = null;
    renderAll();
    showToast('任务调度已启动');
  }

  function getTemplateVariableRows() {
    var keyword = String(state.templateVariableKeyword || '').trim().toLowerCase();
    if (!keyword) return templateVariables.slice();
    return templateVariables.filter(function (item) {
      return item.name.toLowerCase().indexOf(keyword) >= 0 ||
        item.desc.toLowerCase().indexOf(keyword) >= 0 ||
        item.sample.toLowerCase().indexOf(keyword) >= 0;
    });
  }

  function renderTemplateVariableList() {
    var rows = getTemplateVariableRows();
    if (!rows.length) {
      return '<div class="qir-template-variable-empty"><i class="bi bi-search"></i><span>暂无匹配变量</span></div>';
    }
    return rows.map(function (item) {
      return '<button class="qir-template-variable" type="button" data-qir-template-variable-name="' + escapeHtml(item.name) + '" title="双击插入变量">' +
        '<span class="qir-variable-token">${' + escapeHtml(item.name) + '}</span>' +
        '<em>' + escapeHtml(item.desc) + '</em>' +
        '<small>示例：' + escapeHtml(item.sample) + '</small>' +
      '</button>';
    }).join('');
  }

  function renderTemplateResourcePanel(config) {
    config = config || getSelectedReportConfig() || reportConfigs[0];
    var collapsed = !!state.templateVariableCollapsed;
    return '<div class="qir-template-left-stack' + (collapsed ? ' collapsed' : '') + '">' +
      renderTemplateStrategyPanel(config) +
      '<aside class="qir-template-left' + (collapsed ? ' collapsed' : '') + '">' +
        '<div class="qir-template-side-head">' +
          '<div class="qir-template-head-main"><h3>指标变量</h3><p>变量占位展示：${变量名}</p></div>' +
          '<button class="qir-template-panel-toggle" type="button" data-qir-action="toggle-template-variable-panel" title="' + (collapsed ? '展开指标变量' : '收起指标变量') + '" aria-label="' + (collapsed ? '展开指标变量' : '收起指标变量') + '"><i class="bi ' + (collapsed ? 'bi-chevron-right' : 'bi-chevron-left') + '"></i></button>' +
        '</div>' +
        '<div class="qir-template-collapsed-label"><i class="bi bi-braces"></i><span>指标变量</span></div>' +
        (collapsed ? '' : '<div class="qir-template-side-scroll">' +
          '<label class="qir-template-variable-search"><i class="bi bi-search"></i><input type="text" data-qir-template-variable-search value="' + escapeHtml(state.templateVariableKeyword) + '" placeholder="搜索变量名称、说明或示例"></label>' +
          '<div class="qir-template-variable-list">' + renderTemplateVariableList() + '</div>' +
        '</div>') +
      '</aside>' +
    '</div>';
  }

  function getTemplateDashboardRows() {
    var rows = templateDashboardOptions.slice();
    var filter = state.templateDashboardFilter || 'all';
    var keyword = String(state.templateDashboardKeyword || '').trim().toLowerCase();
    if (filter !== 'all') {
      rows = rows.filter(function (item) {
        if (filter === 'chart') return item.type === 'chart' || item.type === 'pie';
        return item.type === filter;
      });
    }
    if (keyword) {
      rows = rows.filter(function (item) {
        return item.name.toLowerCase().indexOf(keyword) >= 0 ||
          item.typeLabel.toLowerCase().indexOf(keyword) >= 0 ||
          item.scope.toLowerCase().indexOf(keyword) >= 0 ||
          item.desc.toLowerCase().indexOf(keyword) >= 0;
      });
    }
    return rows;
  }

  function clampTemplateDashboardPage(total) {
    var totalPages = Math.max(1, Math.ceil(total / templateDashboardPageSize));
    state.templateDashboardPage = Math.max(1, Math.min(totalPages, state.templateDashboardPage || 1));
    return totalPages;
  }

  function getVisibleTemplateDashboards() {
    var rows = getTemplateDashboardRows();
    clampTemplateDashboardPage(rows.length);
    var start = (state.templateDashboardPage - 1) * templateDashboardPageSize;
    return rows.slice(start, start + templateDashboardPageSize);
  }

  function getTemplateDashboardSelectedCount() {
    return Object.keys(state.templateDashboardSelected || {}).filter(function (id) {
      return state.templateDashboardSelected[id];
    }).length;
  }

  function getTemplateFieldDashboardId(item) {
    var tableName = item && item.tableName ? item.tableName : 'table';
    return 'dash-template-field-table-' + String(tableName).replace(/[^a-zA-Z0-9_-]/g, '-');
  }

  function getTemplateFieldDashboardTitle(item) {
    if (!item) return '字段评估明细表';
    return item.tableName + '（' + item.alias + '）-字段评估明细表';
  }

  function getTemplateFieldDashboardSummary(item) {
    if (!item) return '';
    return '该表涉及评测' + item.fieldCount + '个字段，' + item.dataCount + '万条数据，涉及数据质量校验规则共' + item.issueCount + '条。';
  }

  function getSelectedTemplateDashboards() {
    return templateDashboardOptions.filter(function (item) {
      return !!(state.templateDashboardSelected || {})[item.id];
    });
  }

  function getTemplateEditorEl() {
    return pageEl ? pageEl.querySelector('[data-qir-template-editor]') : null;
  }

  function cleanTemplateEchartRuntime(root) {
    if (!root) return;
    root.querySelectorAll('[data-qir-echart]').forEach(function (node) {
      node.innerHTML = '';
      node.removeAttribute('_echarts_instance_');
      node.removeAttribute('style');
    });
  }

  function cleanTemplateRuntimeMarkers(root) {
    if (!root) return;
    root.querySelectorAll('[data-qir-dashboard-scroll-target]').forEach(function (node) {
      node.removeAttribute('data-qir-dashboard-scroll-target');
    });
  }

  function getTemplateEditorSerializableHtml(editor) {
    if (!editor) return '';
    var clone = editor.cloneNode(true);
    cleanTemplateEchartRuntime(clone);
    cleanTemplateRuntimeMarkers(clone);
    return clone.innerHTML;
  }

  function saveTemplateEditorContent() {
    var editor = getTemplateEditorEl();
    if (editor) {
      state.templateEditorHtml = getTemplateEditorSerializableHtml(editor);
      persistTemplateEditorContent();
    }
  }

  function isRangeInsideTemplateEditor(range, editor) {
    if (!range || !editor) return false;
    var node = range.commonAncestorContainer;
    if (node && node.nodeType !== 1) node = node.parentNode;
    return node === editor || (node && editor.contains(node));
  }

  function saveTemplateEditorSelection() {
    var editor = getTemplateEditorEl();
    var selection = window.getSelection ? window.getSelection() : null;
    if (!editor || !selection || !selection.rangeCount) return;
    var range = selection.getRangeAt(0);
    if (isRangeInsideTemplateEditor(range, editor)) {
      templateEditorSavedRange = range.cloneRange();
    }
  }

  function focusTemplateEditor(editor) {
    if (!editor || !editor.focus) return;
    try {
      editor.focus({ preventScroll: true });
    } catch (err) {
      editor.focus();
    }
  }

  function restoreTemplateEditorSelection(editor) {
    var selection = window.getSelection ? window.getSelection() : null;
    if (!editor || !selection) return null;
    focusTemplateEditor(editor);
    var range = templateEditorSavedRange && isRangeInsideTemplateEditor(templateEditorSavedRange, editor)
      ? templateEditorSavedRange.cloneRange()
      : document.createRange();
    if (!templateEditorSavedRange || !isRangeInsideTemplateEditor(templateEditorSavedRange, editor)) {
      range.selectNodeContents(editor);
      range.collapse(false);
    }
    selection.removeAllRanges();
    selection.addRange(range);
    return range;
  }

  function clearSelectedTemplateDashboards(editor) {
    var changed = false;
    (editor ? editor.querySelectorAll('.qir-template-inserted-dashboard.selected') : []).forEach(function (item) {
      item.classList.remove('selected');
      changed = true;
    });
    return changed;
  }

  function clearSelectedTemplateVariables(editor) {
    var changed = false;
    (editor ? editor.querySelectorAll('.qir-variable-token.selected, .qir-template-token.selected') : []).forEach(function (item) {
      item.classList.remove('selected');
      changed = true;
    });
    return changed;
  }

  function renderEditorVariableToken(name, className) {
    var safeName = escapeHtml(name);
    return '<span class="' + (className || 'qir-variable-token') + '" contenteditable="false" data-qir-template-variable-token="' + safeName + '">${' + safeName + '}</span>';
  }

  function insertTemplateVariableAtCursor(name) {
    var editor = getTemplateEditorEl();
    if (!editor || !name) return false;
    clearSelectedTemplateDashboards(editor);
    clearSelectedTemplateVariables(editor);
    var range = restoreTemplateEditorSelection(editor);
    if (!range) return false;
    var wrap = document.createElement('span');
    wrap.innerHTML = renderEditorVariableToken(name);
    var token = wrap.firstChild;
    var spacer = document.createTextNode(' ');
    range.deleteContents();
    range.insertNode(token);
    range.setStartAfter(token);
    range.collapse(true);
    range.insertNode(spacer);
    range.setStartAfter(spacer);
    range.collapse(true);
    var selection = window.getSelection ? window.getSelection() : null;
    if (selection) {
      selection.removeAllRanges();
      selection.addRange(range);
    }
    templateEditorSavedRange = range.cloneRange();
    state.templateEditorHtml = getTemplateEditorSerializableHtml(editor);
    showToast('已插入变量：${' + name + '}');
    return true;
  }

  function saveTemplateConfig() {
    var editor = getTemplateEditorEl();
    if (!editor) {
      showToast('保存失败：未找到模板编辑器，请稍后重试');
      return;
    }
    var text = (editor.textContent || '').replace(/\s+/g, '');
    var hasDashboard = !!editor.querySelector('.qir-template-inserted-dashboard');
    if (!text && !hasDashboard) {
      showToast('保存失败：模板内容不能为空');
      return;
    }
    state.templateEditorHtml = getTemplateEditorSerializableHtml(editor);
    persistTemplateEditorContent();
    showToast('保存成功：' + getTemplateEditLabel(getSelectedReportConfig() || reportConfigs[0]) + '已保存');
  }

  function saveTemplateNameFromInput(input, options) {
    if (!state.templateNameEditing) return;
    var config = getSelectedReportConfig() || reportConfigs[0];
    if (!config || !input) return;
    config.name = input.value.trim() || '未命名任务调度';
    config.nameEdited = true;
    state.templateNameEditing = false;
    showToast('名称已保存');
    if (!options || options.render !== false) {
      renderAll();
    }
  }

  function saveTemplateDescFromInput(input, options) {
    if (!state.templateDescEditing) return;
    var config = getSelectedReportConfig() || reportConfigs[0];
    if (!config || !input) return;
    config.desc = input.value.trim() || '暂无报告描述';
    config.descEdited = true;
    state.templateDescEditing = false;
    showToast('描述已保存');
    if (!options || options.render !== false) {
      renderAll();
    }
  }

  function normalizeTemplateHeadingText(text) {
    return String(text || '').replace(/\s+/g, ' ').trim();
  }

  function findTemplateSectionTarget(number, title) {
    var editor = getTemplateEditorEl();
    if (!editor) return null;
    var expected = normalizeTemplateHeadingText(number + ' ' + title);
    var safeNumber = normalizeTemplateHeadingText(number);
    var safeTitle = normalizeTemplateHeadingText(title);
    var headings = Array.prototype.slice.call(editor.querySelectorAll('h1, h2, h3, h4'));
    var exact = headings.filter(function (heading) {
      return normalizeTemplateHeadingText(heading.textContent) === expected;
    })[0];
    if (exact) return exact;
    var byNumberAndTitle = headings.filter(function (heading) {
      var text = normalizeTemplateHeadingText(heading.textContent);
      return text.indexOf(safeNumber + ' ') === 0 && text.indexOf(safeTitle) >= 0;
    })[0];
    if (byNumberAndTitle) return byNumberAndTitle;
    return headings.filter(function (heading) {
      return normalizeTemplateHeadingText(heading.textContent).indexOf(safeTitle) >= 0;
    })[0] || null;
  }

  function jumpToTemplateOutlineSection(actionEl) {
    if (!actionEl) return;
    var target = findTemplateSectionTarget(actionEl.getAttribute('data-number') || '', actionEl.getAttribute('data-title') || '');
    if (!target) {
      showToast('未找到对应章节');
      return;
    }
    saveTemplateEditorContent();
    pageEl.querySelectorAll('.qir-template-outline-item.active').forEach(function (item) {
      item.classList.remove('active');
    });
    actionEl.classList.add('active');
    target.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
  }

  function removeSelectedTemplateVariable(e) {
    if (e.key !== 'Delete' && e.key !== 'Backspace') return false;
    var editor = getTemplateEditorEl();
    if (!editor) return false;
    var selectedVariable = editor.querySelector('.qir-variable-token.selected, .qir-template-token.selected');
    if (!selectedVariable) return false;
    var target = e.target;
    var activeEl = document.activeElement;
    var interactiveSelector = 'input, textarea, select, button, [contenteditable="false"]:not(.qir-variable-token):not(.qir-template-token)';
    if (target && target.matches && target.matches(interactiveSelector)) return false;
    if (activeEl && activeEl.matches && activeEl.matches(interactiveSelector)) return false;
    if (target && target.nodeType === 1 && target !== editor && !editor.contains(target) && activeEl !== editor && !editor.contains(activeEl)) return false;
    e.preventDefault();
    selectedVariable.remove();
    state.templateEditorHtml = getTemplateEditorSerializableHtml(editor);
    focusTemplateEditor(editor);
    saveTemplateEditorSelection();
    showToast('已删除选中的变量');
    return true;
  }

  function removeSelectedTemplateDashboard(e) {
    if (e.key !== 'Delete' && e.key !== 'Backspace') return false;
    var editor = getTemplateEditorEl();
    if (!editor) return false;
    var selectedDashboard = editor.querySelector('.qir-template-inserted-dashboard.selected');
    if (!selectedDashboard) return false;
    var target = e.target;
    var activeEl = document.activeElement;
    var interactiveSelector = 'input, textarea, select, button, [contenteditable="false"]:not(.qir-template-inserted-dashboard)';
    if (target && target.matches && target.matches(interactiveSelector)) return false;
    if (activeEl && activeEl.matches && activeEl.matches(interactiveSelector)) return false;
    if (target && target.nodeType === 1 && target !== editor && !editor.contains(target) && activeEl !== editor && !editor.contains(activeEl)) return false;
    e.preventDefault();
    selectedDashboard.remove();
    state.templateEditorHtml = getTemplateEditorSerializableHtml(editor);
    focusTemplateEditor(editor);
    showToast('已删除选中的仪表盘');
    return true;
  }

  function clampTemplateZoom(value) {
    var zoom = Number(value) || 100;
    return Math.max(templateZoomMin, Math.min(templateZoomMax, Math.round(zoom)));
  }

  function getTemplateZoomValue() {
    state.templateZoom = clampTemplateZoom(state.templateZoom);
    return state.templateZoom;
  }

  function applyTemplateZoom() {
    var zoom = getTemplateZoomValue();
    var editor = getTemplateEditorEl();
    if (editor) {
      editor.style.zoom = (zoom / 100).toFixed(2);
    }
    var slider = pageEl ? pageEl.querySelector('[data-qir-template-zoom-range]') : null;
    if (slider) slider.value = zoom;
    var valueEl = pageEl ? pageEl.querySelector('[data-qir-template-zoom-value]') : null;
    if (valueEl) valueEl.textContent = zoom + '%';
    var outBtn = pageEl ? pageEl.querySelector('[data-qir-action="template-zoom-out"]') : null;
    var inBtn = pageEl ? pageEl.querySelector('[data-qir-action="template-zoom-in"]') : null;
    if (outBtn) outBtn.disabled = zoom <= templateZoomMin;
    if (inBtn) inBtn.disabled = zoom >= templateZoomMax;
  }

  function setTemplateZoom(value) {
    saveTemplateEditorContent();
    state.templateZoom = clampTemplateZoom(value);
    applyTemplateZoom();
  }

  function getReportPreviewZoomValue() {
    state.reportPreviewZoom = clampTemplateZoom(state.reportPreviewZoom);
    return state.reportPreviewZoom;
  }

  function applyReportPreviewZoom() {
    var zoom = getReportPreviewZoomValue();
    var page = pageEl ? pageEl.querySelector('[data-qir-report-preview-page]') : null;
    if (page) {
      page.style.zoom = (zoom / 100).toFixed(2);
    }
    var slider = pageEl ? pageEl.querySelector('[data-qir-report-preview-zoom-range]') : null;
    if (slider) slider.value = zoom;
    var valueEl = pageEl ? pageEl.querySelector('[data-qir-report-preview-zoom-value]') : null;
    if (valueEl) valueEl.textContent = zoom + '%';
    var outBtn = pageEl ? pageEl.querySelector('[data-qir-action="report-preview-zoom-out"]') : null;
    var inBtn = pageEl ? pageEl.querySelector('[data-qir-action="report-preview-zoom-in"]') : null;
    if (outBtn) outBtn.disabled = zoom <= templateZoomMin;
    if (inBtn) inBtn.disabled = zoom >= templateZoomMax;
  }

  function setReportPreviewZoom(value) {
    state.reportPreviewZoom = clampTemplateZoom(value);
    applyReportPreviewZoom();
  }

  function getLastTemplateDashboardBlock(editor) {
    var blocks = editor ? editor.querySelectorAll('.qir-template-dashboard-block, .qir-template-inserted-dashboard') : [];
    return blocks.length ? blocks[blocks.length - 1] : null;
  }

  function removeTemplateDashboardInsertMarker() {
    var editor = getTemplateEditorEl();
    if (editor) {
      var markers = editor.querySelectorAll('[data-qir-dashboard-insert-marker]');
      markers.forEach(function (marker) { marker.remove(); });
      state.templateEditorHtml = getTemplateEditorSerializableHtml(editor);
      return;
    }
    if (state.templateEditorHtml) {
      var wrap = document.createElement('div');
      wrap.innerHTML = state.templateEditorHtml;
      wrap.querySelectorAll('[data-qir-dashboard-insert-marker]').forEach(function (marker) { marker.remove(); });
      state.templateEditorHtml = wrap.innerHTML;
    }
  }

  function placeTemplateDashboardInsertMarker() {
    var editor = getTemplateEditorEl();
    if (!editor) return;
    editor.querySelectorAll('[data-qir-dashboard-insert-marker]').forEach(function (marker) { marker.remove(); });
    var marker = document.createElement('span');
    marker.className = 'qir-dashboard-insert-marker';
    marker.setAttribute('data-qir-dashboard-insert-marker', templateDashboardInsertMarker);
    marker.setAttribute('contenteditable', 'false');
    var selection = window.getSelection ? window.getSelection() : null;
    if (selection && selection.rangeCount) {
      var range = selection.getRangeAt(0);
      if (editor.contains(range.commonAncestorContainer) || editor === range.commonAncestorContainer) {
        range.deleteContents();
        range.insertNode(marker);
        state.templateEditorHtml = getTemplateEditorSerializableHtml(editor);
        return;
      }
    }
    var dashboardBlock = getLastTemplateDashboardBlock(editor);
    if (dashboardBlock && dashboardBlock.parentNode) {
      dashboardBlock.parentNode.insertBefore(marker, dashboardBlock.nextSibling);
    } else {
      editor.appendChild(marker);
    }
    state.templateEditorHtml = getTemplateEditorSerializableHtml(editor);
  }

  function renderDashboardTableHtml(headers, rows, className) {
    var headHtml = headers.map(function (item) {
      return '<th>' + escapeHtml(item) + '</th>';
    }).join('');
    var bodyHtml = rows.map(function (row) {
      var isTotal = row[0] === '合计';
      return '<tr' + (isTotal ? ' class="is-total"' : '') + '>' + row.map(function (cell) {
        return '<td>' + escapeHtml(cell) + '</td>';
      }).join('') + '</tr>';
    }).join('');
    return '<table class="qir-inserted-table qir-template-doc-table ' + (className || '') + '"><thead><tr>' + headHtml + '</tr></thead><tbody>' + bodyHtml + '</tbody></table>';
  }

  function getTemplateDashboardOptionById(id) {
    return templateDashboardOptions.filter(function (item) { return item.id === id; })[0] || null;
  }

  function parseTemplateMetricNumber(value) {
    var number = Number(String(value || '').replace(/,/g, '').replace(/%/g, ''));
    return isFinite(number) && number > 0 ? number : 0;
  }

  function getRuleTypePieChartData(rows) {
    return (rows || []).map(function (row) {
      var rawName = String(row[0] || '');
      return {
        name: rawName.indexOf('数据') === 0 ? rawName : '数据' + rawName,
        value: parseTemplateMetricNumber(row[2])
      };
    }).filter(function (item) {
      return item.value > 0;
    });
  }

  function getRuleTypePieRichStyles() {
    var rich = {
      name: {
        color: '#26384d',
        fontSize: 14,
        fontFamily: 'Microsoft YaHei, Arial, sans-serif',
        fontWeight: 500,
        lineHeight: 22
      },
      value: {
        color: '#1f2d3d',
        fontSize: 14,
        fontFamily: 'Microsoft YaHei, Arial, sans-serif',
        fontWeight: 650,
        lineHeight: 22
      },
      pct: {
        color: '#6f8298',
        fontSize: 13,
        fontFamily: 'Microsoft YaHei, Arial, sans-serif',
        lineHeight: 20
      },
      blank: {
        width: 17
      }
    };
    templateRulePieColors.forEach(function (color, index) {
      rich['marker' + index] = {
        width: 8,
        height: 8,
        borderRadius: 2,
        backgroundColor: color
      };
    });
    return rich;
  }

  function getRuleTypePieChartOption(data) {
    return {
      color: templateRulePieColors,
      animationDuration: 650,
      animationEasing: 'cubicOut',
      tooltip: {
        trigger: 'item',
        confine: true,
        backgroundColor: 'rgba(255,255,255,.97)',
        borderColor: '#d6e2ef',
        borderWidth: 1,
        padding: [9, 12],
        extraCssText: 'border-radius:6px;box-shadow:0 10px 24px rgba(31,45,61,.12);',
        textStyle: {
          color: '#26384d',
          fontSize: 12,
          fontFamily: 'Microsoft YaHei, Arial, sans-serif'
        },
        formatter: function (params) {
          var percent = Number(params.percent || 0).toFixed(2);
          return params.name + '<br/>检核问题条数：' + params.value + '<br/>占比：' + percent + '%';
        }
      },
      series: [{
        type: 'pie',
        radius: ['0%', '50%'],
        center: ['50%', '52%'],
        startAngle: 90,
        clockwise: true,
        minAngle: 4,
        avoidLabelOverlap: true,
        stillShowZeroSum: false,
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 4,
          borderRadius: 3,
          shadowBlur: 3,
          shadowColor: 'rgba(31,45,61,.08)'
        },
        emphasis: {
          scaleSize: 5,
          itemStyle: {
            shadowBlur: 16,
            shadowOffsetY: 4,
            shadowColor: 'rgba(31,45,61,.18)'
          }
        },
        label: {
          show: true,
          position: 'outside',
          alignTo: 'edge',
          edgeDistance: 22,
          bleedMargin: 8,
          distanceToLabelLine: 6,
          lineHeight: 22,
          formatter: function (params) {
            var markerIndex = params.dataIndex % templateRulePieColors.length;
            var percent = Number(params.percent || 0).toFixed(2);
            return '{marker' + markerIndex + '|} {name|' + params.name + '}{value|, ' + params.value + ',}\n{blank|} {pct|' + percent + '%}';
          },
          rich: getRuleTypePieRichStyles()
        },
        labelLine: {
          show: true,
          length: 22,
          length2: 44,
          smooth: 0.12,
          lineStyle: {
            color: '#9aaabb',
            width: 1.2
          }
        },
        labelLayout: {
          hideOverlap: false,
          moveOverlap: 'shiftY'
        },
        data: data
      }]
    };
  }

  function renderRuleTypePieChart(rows) {
    var data = getRuleTypePieChartData(rows);
    if (!data.length) return '';
    return '<div class="qir-rule-pie-chart" data-qir-echart="rule-type-pie" data-qir-chart-data="' + escapeHtml(encodeURIComponent(JSON.stringify(data))) + '" role="img" aria-label="检核规则数量分布"></div>';
  }

  function getRectifyTrendChartData(rows) {
    return (rows || []).map(function (row) {
      return {
        label: String(row[0] || ''),
        dateTime: String(row[1] || ''),
        problemCount: parseTemplateMetricNumber(row[4]),
        rectifyRate: parseTemplateMetricNumber(row[6])
      };
    }).filter(function (item) {
      return item.dateTime && (item.problemCount > 0 || item.rectifyRate > 0);
    });
  }

  function getRectifyTrendChartOption(data) {
    var barColor = window.echarts && window.echarts.graphic
      ? new window.echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: templateTrendChartColors.barEnd },
        { offset: 1, color: templateTrendChartColors.bar }
      ])
      : templateTrendChartColors.bar;
    return {
      color: [templateTrendChartColors.bar, templateTrendChartColors.line],
      animationDuration: 650,
      animationEasing: 'cubicOut',
      tooltip: {
        trigger: 'axis',
        confine: true,
        axisPointer: {
          type: 'shadow',
          shadowStyle: { color: 'rgba(47,117,168,.08)' }
        },
        backgroundColor: 'rgba(255,255,255,.97)',
        borderColor: '#d6e2ef',
        borderWidth: 1,
        padding: [9, 12],
        extraCssText: 'border-radius:6px;box-shadow:0 10px 24px rgba(31,45,61,.12);',
        textStyle: {
          color: '#26384d',
          fontSize: 12,
          fontFamily: 'Microsoft YaHei, Arial, sans-serif'
        },
        formatter: function (params) {
          var list = Array.isArray(params) ? params : [params];
          var label = list[0] ? list[0].axisValue : '';
          var row = data.filter(function (item) { return item.label === label; })[0] || {};
          var html = '<b>' + label + '</b>';
          if (row.dateTime) html += '<br>' + row.dateTime;
          list.forEach(function (item) {
            var unit = item.seriesName === '整改率' ? '%' : '条';
            html += '<br>' + (item.marker || '') + item.seriesName + '：<b>' + item.value + unit + '</b>';
          });
          return html;
        }
      },
      legend: {
        top: 8,
        left: 'center',
        itemGap: 36,
        itemWidth: 14,
        itemHeight: 9,
        selectedMode: false,
        textStyle: {
          color: '#526579',
          fontSize: 12,
          fontFamily: 'Microsoft YaHei, Arial, sans-serif'
        },
        data: ['检核问题条数', '整改率']
      },
      grid: {
        left: 54,
        right: 58,
        top: 56,
        bottom: 48
      },
      xAxis: {
        type: 'category',
        data: data.map(function (item) { return item.label; }),
        axisTick: { show: false },
        axisLine: { lineStyle: { color: '#d9e4f0' } },
        axisLabel: {
          color: '#6f8298',
          fontSize: 11,
          interval: 0,
          rotate: 0,
          margin: 12
        }
      },
      yAxis: [
        {
          type: 'value',
          name: '检核问题条数',
          nameTextStyle: {
            color: '#6f8298',
            fontSize: 12,
            padding: [0, 0, 8, 0]
          },
          min: 0,
          axisLabel: {
            color: '#6f8298',
            formatter: '{value}条'
          },
          splitLine: {
            lineStyle: {
              color: '#edf2f7',
              type: 'dashed'
            }
          }
        },
        {
          type: 'value',
          name: '整改率',
          nameTextStyle: {
            color: '#6f8298',
            fontSize: 12,
            padding: [0, 0, 8, 0]
          },
          min: 0,
          max: 100,
          axisLabel: {
            color: '#6f8298',
            formatter: '{value}%'
          },
          splitLine: { show: false }
        }
      ],
      series: [
        {
          name: '检核问题条数',
          type: 'bar',
          yAxisIndex: 0,
          barWidth: 18,
          data: data.map(function (item) { return item.problemCount; }),
          itemStyle: {
            color: barColor,
            borderRadius: [4, 4, 0, 0]
          }
        },
        {
          name: '整改率',
          type: 'line',
          yAxisIndex: 1,
          smooth: true,
          symbol: 'circle',
          symbolSize: 7,
          data: data.map(function (item) { return item.rectifyRate; }),
          lineStyle: {
            width: 3,
            color: templateTrendChartColors.line
          },
          itemStyle: {
            color: '#fff',
            borderColor: templateTrendChartColors.line,
            borderWidth: 2
          },
          areaStyle: {
            color: templateTrendChartColors.lineSoft
          }
        }
      ]
    };
  }

  function renderRectifyTrendChart(rows) {
    var data = getRectifyTrendChartData(rows);
    if (!data.length) return '';
    return '<div class="qir-rectify-trend-chart" data-qir-echart="rectify-trend" data-qir-chart-data="' + escapeHtml(encodeURIComponent(JSON.stringify(data))) + '" role="img" aria-label="问题整改趋势图"></div>';
  }

  function readTemplateEchartData(el) {
    var raw = el ? el.getAttribute('data-qir-chart-data') : '';
    if (!raw) return [];
    try {
      return JSON.parse(decodeURIComponent(raw));
    } catch (err) {
      return [];
    }
  }

  function disposeTemplatePieCharts() {
    templatePieCharts.forEach(function (chart) {
      if (chart && chart.dispose) {
        try {
          chart.dispose();
        } catch (err) {}
      }
    });
    templatePieCharts = [];
    if (templatePieResizeHandler) {
      window.removeEventListener('resize', templatePieResizeHandler);
      templatePieResizeHandler = null;
    }
  }

  function resizeTemplatePieCharts() {
    templatePieCharts.forEach(function (chart) {
      if (chart && chart.resize) {
        try {
          chart.resize();
        } catch (err) {}
      }
    });
  }

  function initTemplatePieCharts(root) {
    var scope = root || pageEl || document;
    var nodes = Array.prototype.slice.call(scope.querySelectorAll('[data-qir-echart]'));
    if (!nodes.length) return;
    nodes.forEach(function (node) {
      var chartType = node.getAttribute('data-qir-echart') || '';
      var data = readTemplateEchartData(node);
      if (!data.length) return;
      if (!window.echarts) {
        node.innerHTML = '<div class="qir-chart-fallback">ECharts 加载后显示图表</div>';
        return;
      }
      var oldChart = window.echarts.getInstanceByDom ? window.echarts.getInstanceByDom(node) : null;
      if (oldChart && oldChart.dispose) oldChart.dispose();
      node.innerHTML = '';
      var chart = window.echarts.init(node);
      if (chartType === 'rectify-trend') {
        chart.setOption(getRectifyTrendChartOption(data), true);
      } else {
        chart.setOption(getRuleTypePieChartOption(data), true);
      }
      templatePieCharts.push(chart);
    });
    if (templatePieCharts.length && !templatePieResizeHandler) {
      templatePieResizeHandler = resizeTemplatePieCharts;
      window.addEventListener('resize', templatePieResizeHandler);
    }
  }

  function getTemplateDashboardTableData(id) {
    if (id === 'dash-template-rule-table') {
      return {
        headers: ['规则类型', '合规比例', '检核问题条数'],
        rows: templateRuleDistributionRows,
        className: 'qir-template-rule-table'
      };
    }
    if (id === 'dash-template-quality-good-top-table') {
      return {
        headers: ['序号', '表名称', '中文名', '检核数据条数', '检核问题条数', '检核问题率'],
        rows: templateQualityGoodTopRows,
        className: 'qir-template-quality-rank-table'
      };
    }
    if (id === 'dash-template-quality-bad-top-table') {
      return {
        headers: ['序号', '表名称', '中文名', '检核数据条数', '检核问题条数', '检核问题率'],
        rows: templateQualityBadTopRows,
        className: 'qir-template-quality-rank-table'
      };
    }
    if (id === 'dash-template-check-table') {
      return {
        headers: ['表名称', '中文名', '检核数据条数', '检核问题条数', '检核问题率'],
        rows: (templateQualityDimensionStats[0] || {}).rows || [],
        className: 'qir-template-check-table'
      };
    }
    if (id === 'dash-template-trend-table') {
      return {
        headers: ['序号', '日期时间', '表数据量', '检核数据条数', '检核问题条数', '检核问题率', '整改率'],
        rows: templateRectifyTrendRows,
        className: 'qir-template-trend-table'
      };
    }
    if (id === 'dash-template-field-table' || String(id || '').indexOf('dash-template-field-table-') === 0) {
      return {
        headers: ['评测字段（对象）', '评测内容', '评测标准', '评估结论'],
        rows: templateFieldDetailRows,
        className: 'qir-template-field-table'
      };
    }
    return {
      headers: ['质量任务', '稽查对象', '通过率', '问题记录'],
      rows: [
        ['关键字段非空校验', 'sys_user', '93.2%', '18'],
        ['业务主键唯一性校验', 'sys_departmen', '99.6%', '2'],
        ['状态枚举校验', 'sys_role', '91.1%', '4']
      ],
      className: ''
    };
  }

  function renderInsertedDashboardVisual(item) {
    if (item.id === 'dash-template-rule-pie') {
      return renderRuleTypePieChart(templateRuleDistributionRows);
    }
    if (item.id === 'dash-template-trend-chart') {
      return renderRectifyTrendChart(templateRectifyTrendRows);
    }
    var tableData = getTemplateDashboardTableData(item.id);
    return renderDashboardTableHtml(tableData.headers, tableData.rows, tableData.className);
  }

  function renderInsertedDashboardBlock(item, options) {
    options = options && typeof options === 'object' ? options : {};
    var dashboardClass = item.type === 'pie'
      ? 'qir-template-pie-dashboard'
      : (item.type === 'chart' ? 'qir-template-chart-dashboard qir-template-trend-dashboard' : 'qir-template-table-dashboard');
    var scrollTargetAttr = options.scrollTarget ? ' data-qir-dashboard-scroll-target="inserted"' : '';
    var summaryHtml = item.summary ? '<p class="qir-inserted-dashboard-summary">' + escapeHtml(item.summary) + '</p>' : '';
    return '<div class="qir-template-inserted-dashboard ' + dashboardClass + '" contenteditable="false" data-dashboard-id="' + escapeHtml(item.id) + '" data-dashboard-type="' + escapeHtml(item.type) + '"' + scrollTargetAttr + '>' +
      '<div class="qir-inserted-dashboard-head">' +
        '<strong>' + escapeHtml(item.name) + '</strong>' +
      '</div>' +
      summaryHtml +
      '<div class="qir-inserted-dashboard-body">' + renderInsertedDashboardVisual(item) + '</div>' +
    '</div>';
  }

  function insertSelectedTemplateDashboards() {
    var items = getSelectedTemplateDashboards();
    if (!items.length) return 0;
    var editor = getTemplateEditorEl();
    if (editor) saveTemplateEditorContent();
    var html = items.map(function (item, index) {
      return renderInsertedDashboardBlock(item, { scrollTarget: index === 0 });
    }).join('') + '<p><br></p>';
    var wrap = document.createElement('div');
    wrap.innerHTML = state.templateEditorHtml || (editor ? getTemplateEditorSerializableHtml(editor) : '');
    var marker = wrap.querySelector('[data-qir-dashboard-insert-marker]');
    if (marker) {
      marker.insertAdjacentHTML('beforebegin', html);
      marker.remove();
    } else {
      var dashboardBlock = getLastTemplateDashboardBlock(wrap);
      if (dashboardBlock) {
        dashboardBlock.insertAdjacentHTML('afterend', html);
      } else {
        wrap.insertAdjacentHTML('beforeend', html);
      }
    }
    state.templateEditorHtml = wrap.innerHTML;
    return items.length;
  }

  function renderTemplateDashboardFilters() {
    return templateDashboardFilters.map(function (item) {
      var active = (state.templateDashboardFilter || 'all') === item.key ? ' active' : '';
      return '<button class="qir-dashboard-filter' + active + '" type="button" data-qir-action="template-dashboard-filter" data-filter="' + escapeHtml(item.key) + '"><i class="bi ' + escapeHtml(item.icon) + '"></i><span>' + escapeHtml(item.label) + '</span></button>';
    }).join('');
  }

  function renderTemplateDashboardCards() {
    var rows = getVisibleTemplateDashboards();
    if (!rows.length) {
      return '<div class="qir-dashboard-empty"><i class="bi bi-inboxes"></i><span>暂无匹配仪表盘</span></div>';
    }
    return rows.map(function (item) {
      var selected = !!(state.templateDashboardSelected || {})[item.id];
      return '<button class="qir-dashboard-card' + (selected ? ' selected' : '') + '" type="button" data-qir-action="template-dashboard-toggle" data-id="' + escapeHtml(item.id) + '">' +
        '<span class="qir-dashboard-check"><i class="bi ' + (selected ? 'bi-check-circle-fill' : 'bi-circle') + '"></i></span>' +
        '<div class="qir-dashboard-preview"><i class="bi ' + escapeHtml(item.icon) + '"></i><span>' + escapeHtml(item.typeLabel) + '</span></div>' +
        '<div class="qir-dashboard-card-main">' +
          '<div class="qir-dashboard-card-title"><b>' + escapeHtml(item.name) + '</b><em>' + escapeHtml(item.metrics) + '</em></div>' +
          '<p>' + escapeHtml(item.desc) + '</p>' +
          '<div class="qir-dashboard-card-meta"><span>' + escapeHtml(item.scope) + '</span><span>' + escapeHtml(item.updateTime) + '</span></div>' +
        '</div>' +
      '</button>';
    }).join('');
  }

  function renderTemplateDashboardPagination(totalPages) {
    var current = state.templateDashboardPage || 1;
    var html = '<button type="button" data-qir-action="template-dashboard-page" data-page="prev"' + (current <= 1 ? ' disabled' : '') + '><i class="bi bi-chevron-left"></i></button>';
    for (var i = 1; i <= totalPages; i++) {
      html += '<button type="button" data-qir-action="template-dashboard-page" data-page="' + i + '"' + (current === i ? ' class="active"' : '') + '>' + i + '</button>';
    }
    html += '<button type="button" data-qir-action="template-dashboard-page" data-page="next"' + (current >= totalPages ? ' disabled' : '') + '><i class="bi bi-chevron-right"></i></button>';
    return html;
  }

  function renderTemplateDashboardModal() {
    if (!state.templateDashboardModalOpen) return '';
    var total = getTemplateDashboardRows().length;
    var totalPages = clampTemplateDashboardPage(total);
    var selectedCount = getTemplateDashboardSelectedCount();
    var start = total ? (state.templateDashboardPage - 1) * templateDashboardPageSize + 1 : 0;
    var end = total ? Math.min(total, state.templateDashboardPage * templateDashboardPageSize) : 0;
    return '<div class="qir-dashboard-modal-mask" data-qir-action="close-template-dashboard-modal"></div>' +
      '<section class="qir-dashboard-modal" role="dialog" aria-modal="true" aria-label="插入仪表盘">' +
        '<div class="qir-dashboard-modal-head">' +
          '<div><h3>插入仪表盘</h3><p>选择需要写入报告模板的仪表盘</p></div>' +
          '<button class="qir-dashboard-modal-close" type="button" data-qir-action="close-template-dashboard-modal" aria-label="关闭"><i class="bi bi-x-lg"></i></button>' +
        '</div>' +
        '<div class="qir-dashboard-modal-body">' +
          '<div class="qir-dashboard-modal-toolbar">' +
            '<label class="qir-dashboard-search"><i class="bi bi-search"></i><input type="text" data-qir-dashboard-search value="' + escapeHtml(state.templateDashboardKeyword) + '" placeholder="搜索仪表盘名称、范围或说明"></label>' +
            '<div class="qir-dashboard-filters">' + renderTemplateDashboardFilters() + '</div>' +
          '</div>' +
          '<div class="qir-dashboard-grid">' + renderTemplateDashboardCards() + '</div>' +
          '<div class="qir-dashboard-modal-pager"><span>显示第 ' + start + ' 到第 ' + end + ' 项，共 ' + total + ' 项</span><div class="qir-dashboard-page-nav">' + renderTemplateDashboardPagination(totalPages) + '</div></div>' +
        '</div>' +
        '<div class="qir-dashboard-modal-foot">' +
          '<span>已选择 <b>' + selectedCount + '</b> 个仪表盘</span>' +
          '<div><button class="btn btn-outline" type="button" data-qir-action="close-template-dashboard-modal"><i class="bi bi-x-lg"></i><span>取消</span></button><button class="btn btn-primary" type="button" data-qir-action="template-dashboard-confirm"' + (!selectedCount ? ' disabled' : '') + '><i class="bi bi-plus-square"></i><span>确定插入</span></button></div>' +
        '</div>' +
      '</section>';
  }

  function renderTemplateScheduleControls() {
    var draft = normalizeTemplateScheduleDraft(state.templateScheduleDraft);
    var html = '<select class="qir-schedule-type" data-qir-template-schedule-field="type">' + renderTemplateScheduleOptions(templateScheduleTypes, draft.type) + '</select>';
    if (draft.type === '每周') {
      html += '<select class="qir-schedule-sub" data-qir-template-schedule-field="weekday">' + renderTemplateScheduleOptions(templateScheduleWeekOptions, draft.weekday) + '</select>';
    } else if (draft.type === '每月') {
      html += '<select class="qir-schedule-sub" data-qir-template-schedule-field="day">' + renderTemplateScheduleOptions(templateScheduleDayOptions, draft.day) + '</select>';
    }
    html += '<span class="qir-schedule-inline">执行时间</span>' +
      '<input class="qir-schedule-time" type="text" data-qir-template-schedule-field="time" value="' + escapeHtml(draft.time) + '" placeholder="HH:mm:ss">' +
      '<div class="qir-schedule-hint"><i class="bi bi-info-circle-fill"></i><span>' + escapeHtml(getTemplateScheduleHint(draft)) + '</span></div>';
    return html;
  }

  function renderTemplateScheduleModal() {
    if (!state.templateScheduleModalOpen) return '';
    var config = getSelectedReportConfig() || reportConfigs[0];
    state.templateScheduleDraft = normalizeTemplateScheduleDraft(state.templateScheduleDraft || createTemplateScheduleDraft(config));
    return '<div class="qir-schedule-modal-mask" data-qir-action="close-template-schedule-modal"></div>' +
      '<section class="qir-schedule-modal" role="dialog" aria-modal="true" aria-label="配置调度周期">' +
        '<div class="qir-dashboard-modal-head">' +
          '<div><h3>配置调度周期</h3><p>参考任务调度配置，设置报告模板自动生成时间</p></div>' +
          '<button class="qir-dashboard-modal-close" type="button" data-qir-action="close-template-schedule-modal" aria-label="关闭"><i class="bi bi-x-lg"></i></button>' +
        '</div>' +
        '<div class="qir-schedule-modal-body">' +
          '<div class="qir-schedule-current">' +
            '<span>当前报告</span><b>' + escapeHtml(config ? config.name : '稽查报告模板') + '</b>' +
            '<em>当前周期：' + escapeHtml(getCycleText(config ? config.cycle : {})) + '</em>' +
          '</div>' +
          '<div class="qir-schedule-form-section">' +
            '<div class="qir-schedule-label"><span>*</span>调度配置</div>' +
            '<div class="qir-schedule-main"><div class="qir-schedule-row">' + renderTemplateScheduleControls() + '</div></div>' +
          '</div>' +
          '<div class="qir-schedule-note"><i class="bi bi-lightning-charge"></i><span>保存后从下一次调度周期开始生效，已生成的历史报告不受影响。</span></div>' +
        '</div>' +
        '<div class="qir-dashboard-modal-foot">' +
          '<span>调度周期：<b data-qir-template-schedule-summary>' + escapeHtml(getTemplateScheduleHint(state.templateScheduleDraft)) + '</b></span>' +
          '<div><button class="btn btn-outline" type="button" data-qir-action="close-template-schedule-modal"><i class="bi bi-x-lg"></i><span>取消</span></button><button class="btn btn-primary" type="button" data-qir-action="template-schedule-save"><i class="bi bi-check-lg"></i><span>保存配置</span></button></div>' +
        '</div>' +
      '</section>';
  }

  function renderStartScheduleModal() {
    if (!state.startScheduleModalOpen) return '';
    var config = getReportConfigById(state.startScheduleConfigId) || reportConfigs[0];
    state.templateScheduleDraft = normalizeTemplateScheduleDraft(state.templateScheduleDraft || createTemplateScheduleDraft(config));
    return '<div class="qir-schedule-modal-mask" data-qir-action="close-start-schedule-modal"></div>' +
      '<section class="qir-schedule-modal qir-start-schedule-modal" role="dialog" aria-modal="true" aria-label="启动调度">' +
        '<div class="qir-dashboard-modal-head">' +
          '<div><h3>启动调度</h3><p>启动前可配置或调整调度周期，保存后立即启用任务调度</p></div>' +
          '<button class="qir-dashboard-modal-close" type="button" data-qir-action="close-start-schedule-modal" aria-label="关闭"><i class="bi bi-x-lg"></i></button>' +
        '</div>' +
        '<div class="qir-schedule-modal-body">' +
          '<div class="qir-schedule-current">' +
            '<span>当前任务</span><b>' + escapeHtml(getScheduleTaskName(config)) + '</b>' +
            '<em>当前周期：' + escapeHtml(getCycleText(config ? config.cycle : {})) + '</em>' +
          '</div>' +
          '<div class="qir-schedule-form-section">' +
            '<div class="qir-schedule-label"><span>*</span>调度配置</div>' +
            '<div class="qir-schedule-main"><div class="qir-schedule-row">' + renderTemplateScheduleControls() + '</div></div>' +
          '</div>' +
          '<div class="qir-schedule-note"><i class="bi bi-lightning-charge"></i><span>确认启动后将按当前调度周期自动生成报告，可在编辑页面继续调整。</span></div>' +
        '</div>' +
        '<div class="qir-dashboard-modal-foot">' +
          '<span>调度周期：<b data-qir-template-schedule-summary>' + escapeHtml(getTemplateScheduleHint(state.templateScheduleDraft)) + '</b></span>' +
          '<div><button class="btn btn-outline" type="button" data-qir-action="close-start-schedule-modal"><i class="bi bi-x-lg"></i><span>取消</span></button><button class="btn btn-primary" type="button" data-qir-action="confirm-start-schedule"><i class="bi bi-play-circle"></i><span>启动调度</span></button></div>' +
        '</div>' +
      '</section>';
  }

  function renderTemplateOutline() {
    var collapsed = !!state.templateOutlineCollapsed;
    return '<aside class="qir-template-outline' + (collapsed ? ' collapsed' : '') + '">' +
      '<div class="qir-template-outline-head">' +
        '<div class="qir-template-head-main"><h3>报告目录</h3><p>模板章节结构</p></div>' +
        '<button class="qir-template-panel-toggle" type="button" data-qir-action="toggle-template-outline-panel" title="' + (collapsed ? '展开报告目录' : '收起报告目录') + '" aria-label="' + (collapsed ? '展开报告目录' : '收起报告目录') + '"><i class="bi ' + (collapsed ? 'bi-chevron-right' : 'bi-chevron-left') + '"></i></button>' +
      '</div>' +
      '<div class="qir-template-collapsed-label"><i class="bi bi-list-ul"></i><span>报告目录</span></div>' +
      (collapsed ? '' : '<div class="qir-template-outline-list">' + templateOutlineSections.map(function (item, index) {
        var icon = item.level === 1 ? 'bi-list-ol' : (item.level === 2 ? 'bi-chevron-right' : 'bi-dot');
        return '<button class="' + (index === 0 ? 'active ' : '') + 'qir-template-outline-item level-' + item.level + '" type="button" data-qir-action="template-outline-jump" data-number="' + escapeHtml(item.number) + '" data-title="' + escapeHtml(item.title) + '"><i class="bi ' + icon + '"></i><span class="qir-outline-num">' + escapeHtml(item.number) + '</span><span class="qir-outline-text">' + escapeHtml(item.title) + '</span></button>';
      }).join('') + '</div>') +
    '</aside>';
  }

  function renderTemplateEditorToolbar() {
    return '<div class="qir-template-editor-toolbar">' +
      '<div class="qir-template-toolbar-group">' +
        '<select class="qir-template-select-block" aria-label="段落"><option>正文</option><option>标题 1</option><option>标题 2</option><option>标题 3</option><option>引用</option></select>' +
        '<select class="qir-template-select-font" aria-label="字体"><option>微软雅黑</option><option>宋体</option><option>黑体</option><option>Arial</option><option>Consolas</option></select>' +
        '<select class="qir-template-select-size" aria-label="字号"><option>12px</option><option selected>14px</option><option>16px</option><option>18px</option><option>24px</option></select>' +
      '</div>' +
      '<span class="qir-template-toolbar-divider"></span>' +
      '<div class="qir-template-toolbar-group">' +
        '<button type="button" title="撤销" data-qir-action="template-action-placeholder"><i class="bi bi-arrow-counterclockwise"></i></button>' +
        '<button type="button" title="重做" data-qir-action="template-action-placeholder"><i class="bi bi-arrow-clockwise"></i></button>' +
      '</div>' +
      '<span class="qir-template-toolbar-divider"></span>' +
      '<div class="qir-template-toolbar-group">' +
        '<button type="button" title="加粗" data-qir-action="template-action-placeholder"><i class="bi bi-type-bold"></i></button>' +
        '<button type="button" title="斜体" data-qir-action="template-action-placeholder"><i class="bi bi-type-italic"></i></button>' +
        '<button type="button" title="下划线" data-qir-action="template-action-placeholder"><i class="bi bi-type-underline"></i></button>' +
        '<button type="button" title="删除线" data-qir-action="template-action-placeholder"><i class="bi bi-type-strikethrough"></i></button>' +
        '<button type="button" title="清除格式" data-qir-action="template-action-placeholder"><i class="bi bi-eraser"></i></button>' +
      '</div>' +
      '<span class="qir-template-toolbar-divider"></span>' +
      '<div class="qir-template-toolbar-group">' +
        '<button class="qir-template-color-btn" type="button" title="文字颜色" data-qir-action="template-action-placeholder"><i class="bi bi-palette"></i><span class="qir-template-color-line is-text"></span><i class="bi bi-caret-down-fill"></i></button>' +
        '<button class="qir-template-color-btn" type="button" title="背景颜色" data-qir-action="template-action-placeholder"><i class="bi bi-highlighter"></i><span class="qir-template-color-line is-bg"></span><i class="bi bi-caret-down-fill"></i></button>' +
      '</div>' +
      '<span class="qir-template-toolbar-divider"></span>' +
      '<div class="qir-template-toolbar-group">' +
        '<button type="button" title="左对齐" data-qir-action="template-action-placeholder"><i class="bi bi-text-left"></i></button>' +
        '<button type="button" title="居中" data-qir-action="template-action-placeholder"><i class="bi bi-text-center"></i></button>' +
        '<button type="button" title="右对齐" data-qir-action="template-action-placeholder"><i class="bi bi-text-right"></i></button>' +
        '<button type="button" title="两端对齐" data-qir-action="template-action-placeholder"><i class="bi bi-justify"></i></button>' +
      '</div>' +
      '<span class="qir-template-toolbar-divider"></span>' +
      '<div class="qir-template-toolbar-group">' +
        '<button type="button" title="项目符号" data-qir-action="template-action-placeholder"><i class="bi bi-list-ul"></i></button>' +
        '<button type="button" title="编号列表" data-qir-action="template-action-placeholder"><i class="bi bi-list-ol"></i></button>' +
        '<button type="button" title="减少缩进" data-qir-action="template-action-placeholder"><i class="bi bi-text-indent-left"></i></button>' +
        '<button type="button" title="增加缩进" data-qir-action="template-action-placeholder"><i class="bi bi-text-indent-right"></i></button>' +
        '<button class="qir-template-wide-btn" type="button" title="行距" data-qir-action="template-action-placeholder"><i class="bi bi-list"></i><span>行距</span><i class="bi bi-caret-down-fill"></i></button>' +
      '</div>' +
      '<span class="qir-template-toolbar-divider"></span>' +
      '<div class="qir-template-toolbar-group">' +
        '<button type="button" title="插入链接" data-qir-action="template-action-placeholder"><i class="bi bi-link-45deg"></i></button>' +
        '<button type="button" title="插入图片" data-qir-action="template-action-placeholder"><i class="bi bi-image"></i></button>' +
        '<button type="button" title="插入表格" data-qir-action="template-action-placeholder"><i class="bi bi-table"></i></button>' +
        '<button type="button" title="插入分割线" data-qir-action="template-action-placeholder"><i class="bi bi-hr"></i></button>' +
        '<button type="button" title="引用块" data-qir-action="template-action-placeholder"><i class="bi bi-quote"></i></button>' +
        '<button type="button" title="代码块" data-qir-action="template-action-placeholder"><i class="bi bi-code-square"></i></button>' +
      '</div>' +
      '<span class="qir-template-toolbar-divider"></span>' +
      '<div class="qir-template-toolbar-group">' +
        '<button class="qir-template-wide-btn" type="button" title="查找" data-qir-action="template-action-placeholder"><i class="bi bi-search"></i><span>查找</span></button>' +
        '<button class="qir-template-wide-btn" type="button" title="插入变量" data-qir-action="template-action-placeholder"><i class="bi bi-braces"></i><span>变量</span></button>' +
        '<button class="qir-template-dashboard-insert" type="button" data-qir-action="open-template-dashboard-modal"><i class="bi bi-grid-1x2"></i><span>插入仪表盘</span></button>' +
      '</div>' +
    '</div>';
  }

  function renderTemplateZoomToolbar() {
    var zoom = getTemplateZoomValue();
    return '<div class="qir-template-zoom-toolbar" aria-label="编辑器缩放工具条">' +
      '<button type="button" data-qir-action="template-zoom-out" title="缩小" aria-label="缩小"' + (zoom <= templateZoomMin ? ' disabled' : '') + '><i class="bi bi-dash-lg"></i></button>' +
      '<input type="range" min="' + templateZoomMin + '" max="' + templateZoomMax + '" step="' + templateZoomStep + '" value="' + zoom + '" data-qir-template-zoom-range aria-label="缩放比例">' +
      '<button type="button" data-qir-action="template-zoom-in" title="放大" aria-label="放大"' + (zoom >= templateZoomMax ? ' disabled' : '') + '><i class="bi bi-plus-lg"></i></button>' +
      '<button class="qir-template-zoom-value" type="button" data-qir-action="template-zoom-reset" title="恢复 100%" aria-label="恢复 100%"><i class="bi bi-aspect-ratio"></i><span data-qir-template-zoom-value>' + zoom + '%</span></button>' +
    '</div>';
  }

  function renderReportPreviewZoomToolbar() {
    var zoom = getReportPreviewZoomValue();
    return '<div class="qir-template-zoom-toolbar qir-report-zoom-toolbar" aria-label="报告预览缩放工具条">' +
      '<button type="button" data-qir-action="report-preview-zoom-out" title="缩小" aria-label="缩小"' + (zoom <= templateZoomMin ? ' disabled' : '') + '><i class="bi bi-dash-lg"></i></button>' +
      '<input type="range" min="' + templateZoomMin + '" max="' + templateZoomMax + '" step="' + templateZoomStep + '" value="' + zoom + '" data-qir-report-preview-zoom-range aria-label="缩放比例">' +
      '<button type="button" data-qir-action="report-preview-zoom-in" title="放大" aria-label="放大"' + (zoom >= templateZoomMax ? ' disabled' : '') + '><i class="bi bi-plus-lg"></i></button>' +
      '<button class="qir-template-zoom-value" type="button" data-qir-action="report-preview-zoom-reset" title="恢复 100%" aria-label="恢复 100%"><i class="bi bi-aspect-ratio"></i><span data-qir-report-preview-zoom-value>' + zoom + '%</span></button>' +
    '</div>';
  }

  function pad2(value) {
    return String(value).padStart(2, '0');
  }

  function getTemplatePreviewValues(config, overrides) {
    config = config || reportConfigs[0];
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    var time = pad2(now.getHours()) + ':' + pad2(now.getMinutes()) + ':' + pad2(now.getSeconds());
    var date = year + '年' + month + '月' + day + '日';
    var dateTime = date + ' ' + time;
    var dbCount = config.dbCount || 1;
    var tableCount = templateDetailSamples.length;
    var taskCount = config.taskCount || 24;
    var totalRecordCount = getQualityRankTotalRecordCount();
    var problemRecordCount = getQualityRankProblemCount();
    var avgPassRate = totalRecordCount ? (100 - problemRecordCount / totalRecordCount * 100) : 0;
    var values = {
      '模板名称': config.name,
      '统计范围': dbCount + '个数据源，' + tableCount + '张表，' + taskCount + '个质量任务',
      '数据源数量': dbCount,
      '数据库数量': dbCount,
      '表数量': tableCount,
      '字段数': (totalRecordCount / 10000).toFixed(2),
      '质量任务数': taskCount,
      '平均通过率': avgPassRate.toFixed(2) + '%',
      '问题总记录数': formatNumber(problemRecordCount),
      '问题记录数': formatNumber(problemRecordCount),
      '稽查问题总记录数': formatNumber(problemRecordCount),
      '稽查总数据记录数': formatNumber(totalRecordCount),
      '完整性合规比例': '99.34%',
      '一致性合规比例': '99.58%',
      '唯一性合规': '99.91%',
      '有效性合规比例': '99.82%',
      '准确性合规比例': '99.73%',
      '及时性合规比例': '99.88%',
      '生成周期': getCycleText(config.cycle),
      '调度周期': getCycleText(config.cycle),
      '最后生成时间': config.lastGeneratedTime && config.lastGeneratedTime !== '-' ? config.lastGeneratedTime : dateTime,
      '年份': year + '年',
      '月份': year + '年' + month + '月',
      '日期': date,
      '时间': time,
      '日期时间': dateTime
    };
    Object.keys(overrides || {}).forEach(function (key) {
      values[key] = overrides[key];
    });
    return values;
  }

  function replaceTemplatePlaceholders(root, values) {
    function walk(node) {
      if (node.nodeType === 3) {
        node.nodeValue = node.nodeValue.replace(/\$\{([^}]+)\}/g, function (match, key) {
          return values[key] != null ? values[key] : match;
        });
        return;
      }
      Array.prototype.slice.call(node.childNodes || []).forEach(walk);
    }
    walk(root);
  }

  function unwrapTemplatePreviewTokens(root) {
    root.querySelectorAll('.qir-template-token, .qir-variable-token').forEach(function (node) {
      node.parentNode.replaceChild(document.createTextNode(node.textContent), node);
    });
  }

  function replacePreviewDashboardPlaceholders(root, config, values) {
    root.querySelectorAll('.qir-template-dashboard-block').forEach(function (node) {
      var item = {
        id: 'dash-template-rule-table',
        name: '规则类型分布表',
        type: 'table',
        typeLabel: '表格仪表盘',
        scope: config.name,
        desc: '展示完整性、一致性、唯一性等规则类型的合规比例和检核问题条数。',
        updateTime: config.lastGeneratedTime && config.lastGeneratedTime !== '-' ? config.lastGeneratedTime : values['日期时间']
      };
      node.outerHTML = renderInsertedDashboardBlock(item);
    });
  }

  function buildTemplatePreviewToc(root) {
    var headings = Array.prototype.filter.call(root.querySelectorAll('h1, h2, h3, h4'), function (heading) {
      return !heading.closest('.qir-template-doc-toc');
    });
    if (!headings.length) return '<div class="qir-preview-toc-empty">暂无目录</div>';
    return Array.prototype.map.call(headings, function (heading, index) {
      var id = 'preview-section-' + (index + 1);
      var tag = heading.tagName ? heading.tagName.toLowerCase() : 'h2';
      var icon = tag === 'h1' ? 'bi-file-earmark-text' : (tag === 'h2' ? 'bi-chevron-right' : (tag === 'h3' ? 'bi-dot' : 'bi-dash'));
      heading.id = id;
      return '<a class="qir-preview-toc-item level-' + tag + '" href="#' + id + '" data-qir-preview-anchor><i class="bi ' + icon + '"></i><b>' + escapeHtml(heading.textContent || ('章节 ' + (index + 1))) + '</b></a>';
    }).join('');
  }

  function getTemplatePreviewData(config, overrides) {
    saveTemplateEditorContent();
    var wrap = document.createElement('div');
    wrap.innerHTML = state.templateEditorHtml || renderTemplateEditorDefaultContent();
    wrap.querySelectorAll('[data-qir-dashboard-insert-marker]').forEach(function (node) { node.remove(); });
    wrap.querySelectorAll('[contenteditable]').forEach(function (node) { node.removeAttribute('contenteditable'); });
    wrap.querySelectorAll('.selected').forEach(function (node) { node.classList.remove('selected'); });
    var values = getTemplatePreviewValues(config, overrides);
    replaceTemplatePlaceholders(wrap, values);
    unwrapTemplatePreviewTokens(wrap);
    replacePreviewDashboardPlaceholders(wrap, config || reportConfigs[0], values);
    return {
      toc: buildTemplatePreviewToc(wrap),
      html: wrap.innerHTML
    };
  }

  function getTemplatePreviewStyles() {
    return [
      'html,body{height:100%;}',
      'body{margin:0;overflow:hidden;background:#d8dadd;color:#26384d;font-family:"Microsoft YaHei",Arial,sans-serif;}',
      '.qir-preview-app{height:100vh;display:grid;grid-template-columns:300px minmax(0,1fr);background:#d8dadd;}',
      '.qir-preview-toc{height:100vh;min-width:0;display:flex;flex-direction:column;border-right:1px solid #c9cdd3;background:#eceff3;box-sizing:border-box;}',
      '.qir-preview-toc h2{height:48px;display:flex;align-items:center;gap:8px;margin:0;padding:0 14px;border-bottom:1px solid #d8dde5;color:#1f2d3d;font-size:14px;font-weight:650;box-sizing:border-box;}',
      '.qir-preview-toc h2 i{color:#1677ff;font-size:16px;}',
      '.qir-preview-toc nav{flex:1;min-height:0;overflow:auto;display:block;padding:8px 8px 18px;box-sizing:border-box;}',
      '.qir-preview-toc-item{min-height:30px;display:grid;grid-template-columns:16px minmax(0,1fr);align-items:center;gap:5px;padding:4px 8px;border-radius:4px;color:#37465a;font-size:12px;line-height:1.45;text-decoration:none;box-sizing:border-box;}',
      '.qir-preview-toc-item:hover,.qir-preview-toc-item.active{background:#d4d8de;color:#1f2d3d;}',
      '.qir-preview-toc-item i{color:#6f7d8d;font-size:12px;}',
      '.qir-preview-toc-item b{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:500;}',
      '.qir-preview-toc-item.level-h1{margin-top:2px;font-weight:650;}',
      '.qir-preview-toc-item.level-h1 b{font-weight:650;}',
      '.qir-preview-toc-item.level-h2{padding-left:24px;}',
      '.qir-preview-toc-item.level-h3{padding-left:42px;color:#526579;}',
      '.qir-preview-toc-item.level-h4{padding-left:58px;color:#64748b;}',
      '.qir-preview-toc-empty{padding:14px;color:#8aa0b7;font-size:13px;text-align:center;}',
      '.qir-preview-stage{position:relative;min-width:0;height:100vh;overflow:auto;padding:28px 52px 92px;background:#d8dadd;box-sizing:border-box;}',
      '.qir-preview-page-wrap{min-width:920px;display:flex;justify-content:center;align-items:flex-start;}',
      '.qir-template-page{width:860px;margin:0 auto;display:flex;flex-direction:column;gap:22px;box-sizing:border-box;transform-origin:top center;}',
      '.qir-template-doc-page{width:100%;min-height:1180px;padding:72px 78px 86px;border:1px solid #c6cbd2;border-radius:0;background:#fff;box-shadow:0 2px 10px rgba(15,23,42,.16);box-sizing:border-box;}',
      '.qir-template-cover-page{display:flex;align-items:stretch;justify-content:center;text-align:center;}',
      '.qir-template-cover-content{width:100%;min-height:1000px;display:flex;flex-direction:column;justify-content:space-between;padding:120px 0 96px;transform:none;box-sizing:border-box;}',
      '.qir-template-page .qir-template-cover-page h1{margin-bottom:0;font-size:28px;}',
      '.qir-template-report-date{margin:30px 0 0!important;color:#526579!important;font-size:15px!important;line-height:1.8!important;text-align:center!important;text-indent:0!important;}',
      '.qir-template-page h1{margin:0 0 14px;color:#1f2d3d;font-size:26px;line-height:1.35;text-align:center;}',
      '.qir-template-page h2{margin:28px 0 12px;color:#1f2d3d;font-size:18px;line-height:1.45;}',
      '.qir-template-page h3{margin:18px 0 8px;color:#26384d;font-size:15px;line-height:1.45;font-weight:650;}',
      '.qir-template-page h4{margin:14px 0 7px;color:#26384d;font-size:14px;line-height:1.45;font-weight:650;}',
      '.qir-template-page p{margin:9px 0;color:#44566c;font-size:14px;line-height:1.9;}',
      '.qir-template-doc-system{display:block;margin-bottom:4px;color:inherit;font-size:inherit;font-weight:inherit;}',
      '.qir-template-doc-toc{margin:20px 0 26px;padding:0 0 16px;border-bottom:1px solid #dfe5ec;}',
      '.qir-template-doc-toc h2{margin:0 0 12px;color:#1f2d3d;font-size:18px;text-align:center;}',
      '.qir-template-doc-toc-row{height:24px;display:grid;grid-template-columns:auto minmax(18px,1fr) 28px;align-items:end;gap:6px;color:#37465a;font-size:13px;}',
      '.qir-template-doc-toc-row.level-2{padding-left:22px;}',
      '.qir-template-doc-toc-row.level-3{padding-left:42px;color:#526579;}',
      '.qir-template-doc-toc-leader{height:1px;border-bottom:1px dotted #9aa7b5;transform:translateY(-5px);}',
      '.qir-template-doc-toc-row em{color:#526579;font-style:normal;text-align:right;}',
      '.qir-template-detail-title{font-weight:650;color:#26384d!important;}',
      '.qir-template-doc-table{width:100%;border-collapse:collapse;margin:10px 0 14px;color:#37465a;font-size:13px;line-height:1.5;}',
      '.qir-template-doc-table th,.qir-template-doc-table td{height:34px;padding:6px 9px;border:1px solid #d9dfe6;text-align:left;vertical-align:middle;}',
      '.qir-template-doc-table th{background:#f3f6fa;color:#26384d;font-weight:650;}',
      '.qir-template-doc-table tr.is-total td{background:#fafafa;color:#1f2d3d;font-weight:650;}',
      '.qir-template-field-table th:nth-child(1),.qir-template-field-table td:nth-child(1){width:43%;}',
      '.qir-template-field-table th:nth-child(2),.qir-template-field-table td:nth-child(2){width:28%;}',
      '.qir-template-field-table th:nth-child(3),.qir-template-field-table td:nth-child(3){width:14%;text-align:center;}',
      '.qir-template-field-table th:nth-child(4),.qir-template-field-table td:nth-child(4){width:15%;text-align:center;}',
      '.qir-preview-close-btn{position:fixed;top:16px;right:24px;z-index:22;height:32px;display:inline-flex;align-items:center;gap:6px;padding:0 10px;border:1px solid #cfd6df;border-radius:4px;background:#fff;color:#334155;font-family:inherit;font-size:13px;box-shadow:0 4px 14px rgba(15,23,42,.14);cursor:pointer;}',
      '.qir-preview-close-btn:hover{border-color:#c7e2ff;background:#eaf4ff;color:#1677ff;}',
      '.qir-preview-close-btn i{font-size:14px;}',
      '.qir-preview-zoom-toolbar{position:fixed;right:24px;bottom:18px;z-index:20;height:34px;display:inline-flex;align-items:center;gap:6px;padding:4px 7px;border:1px solid #cfd6df;border-radius:4px;background:#fff;box-shadow:0 4px 14px rgba(15,23,42,.16);box-sizing:border-box;}',
      '.qir-preview-zoom-toolbar button{width:26px;height:26px;display:inline-flex;align-items:center;justify-content:center;padding:0;border:1px solid transparent;border-radius:3px;background:#fff;color:#334155;font-family:inherit;cursor:pointer;}',
      '.qir-preview-zoom-toolbar button:hover{border-color:#c7e2ff;background:#eaf4ff;color:#1677ff;}',
      '.qir-preview-zoom-toolbar button:disabled{opacity:.45;cursor:not-allowed;}',
      '.qir-preview-zoom-toolbar i{font-size:14px;}',
      '.qir-preview-zoom-toolbar input{width:104px;accent-color:#1677ff;}',
      '.qir-preview-zoom-value{width:auto!important;min-width:54px;gap:4px;padding:0 6px!important;color:#44566c!important;font-size:12px;}',
      '.qir-template-meta{padding-bottom:12px;border-bottom:1px solid #edf1f6;color:#7b8fa8!important;}',
      '.qir-variable-token,.qir-template-token{display:inline-flex;align-items:center;min-height:22px;padding:0 7px;border:1px solid #91caff;border-radius:3px;background:#e6f4ff;color:#0958d9;font-family:Consolas,Monaco,monospace;font-size:12px;font-weight:650;white-space:nowrap;}',
      '.qir-template-kpi-row{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin:12px 0;}',
      '.qir-template-kpi-row div{min-height:72px;display:flex;flex-direction:column;justify-content:center;gap:6px;padding:12px;border:1px solid #dce9f8;border-radius:6px;background:#f8fbff;}',
      '.qir-template-kpi-row span{color:#6f8298;font-size:12px;}.qir-template-kpi-row b{color:#1677ff;font-size:20px;font-weight:650;}',
      '.qir-template-dashboard-block{margin:12px 0;border:1px solid #dfe5ec;border-radius:6px;overflow:hidden;}',
      '.qir-template-dashboard-head{min-height:42px;display:flex;align-items:center;gap:8px;padding:0 12px;border-bottom:1px solid #edf1f6;background:#f7f9fc;color:#26384d;font-weight:650;}',
      '.qir-template-dashboard-head i{color:#1677ff;}.qir-template-dashboard-head em{margin-left:auto;color:#7b8fa8;font-size:12px;font-style:normal;font-weight:400;}',
      '.qir-template-dashboard-body{padding:12px;background:#fff;}.qir-template-dashboard-body p{margin:4px 0;}',
      '.qir-template-inserted-dashboard{position:relative;margin:14px 0;padding:12px;border:1px solid #dce9f8;border-radius:6px;background:#fbfdff;color:#26384d;box-shadow:0 6px 16px rgba(15,23,42,.05);}',
      '.qir-inserted-dashboard-head{min-height:28px;display:flex;align-items:center;gap:8px;margin-bottom:10px;}.qir-inserted-dashboard-head strong{min-width:0;color:#1f2d3d;font-size:15px;font-weight:650;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}',
      '.qir-inserted-dashboard-summary{margin:-2px 0 10px;color:#526579;font-size:13px;line-height:1.6;text-indent:0;}',
      '.qir-inserted-dashboard-head em,.qir-inserted-dashboard-tag,.qir-inserted-dashboard-sub{display:none!important;}',
      '.qir-inserted-dashboard-body{min-height:180px;padding:12px;border:1px solid #e6eff8;border-radius:6px;background:#fff;}',
      '.qir-template-table-dashboard .qir-inserted-dashboard-body{min-height:0;padding:10px;overflow:auto;}',
      '.qir-template-pie-dashboard .qir-inserted-dashboard-head{justify-content:center;margin-bottom:6px;}.qir-template-pie-dashboard .qir-inserted-dashboard-head strong{color:#29445f;font-size:20px;font-weight:500;letter-spacing:0;}.qir-template-pie-dashboard .qir-inserted-dashboard-body{min-height:0;padding:6px 10px 12px;overflow:visible;border-color:#dce8f4;background:linear-gradient(180deg,#fbfdff 0%,#fff 42%);}',
      '.qir-rule-pie-chart{width:100%;max-width:720px;height:360px;margin:0 auto;background:transparent;}.qir-template-chart-dashboard .qir-inserted-dashboard-head{justify-content:center;margin-bottom:6px;}.qir-template-chart-dashboard .qir-inserted-dashboard-head strong{color:#29445f;font-size:18px;font-weight:600;letter-spacing:0;}.qir-template-chart-dashboard .qir-inserted-dashboard-body{min-height:0;padding:8px 12px 14px;overflow:visible;border-color:#dce8f4;background:linear-gradient(180deg,#fbfdff 0%,#fff 48%);}.qir-rectify-trend-chart{width:100%;height:330px;margin:0 auto;background:transparent;}.qir-chart-fallback{height:100%;min-height:180px;display:flex;align-items:center;justify-content:center;color:#8aa0b7;font-size:13px;}',
      '.qir-inserted-kpi-grid{height:156px;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;}.qir-inserted-kpi-grid div{display:flex;flex-direction:column;justify-content:center;gap:8px;padding:14px;border:1px solid #dce9f8;border-radius:6px;background:#f8fbff;}.qir-inserted-kpi-grid span,.qir-inserted-kpi-grid em{color:#6f8298;font-size:12px;font-style:normal;}.qir-inserted-kpi-grid b{color:#1677ff;font-size:24px;font-weight:650;}',
      '.qir-inserted-trend{height:156px;display:flex;flex-direction:column;justify-content:flex-end;gap:8px;}.qir-inserted-trend-line{height:124px;display:grid;grid-template-columns:repeat(7,minmax(0,1fr));align-items:end;gap:12px;padding:12px 14px 0;border-bottom:1px solid #e6ebf2;background:repeating-linear-gradient(to top,#fff,#fff 30px,#f2f6fb 31px);}.qir-inserted-trend-line span{display:block;min-height:24px;border-radius:4px 4px 0 0;background:linear-gradient(180deg,#69b1ff,#1677ff);}.qir-inserted-chart-axis{display:flex;align-items:center;justify-content:space-between;color:#8aa0b7;font-size:12px;}',
      '.qir-inserted-bars{display:grid;gap:13px;padding-top:4px;}.qir-inserted-bars div{display:grid;grid-template-columns:72px minmax(0,1fr) 44px;align-items:center;gap:10px;color:#526579;font-size:12px;}.qir-inserted-bars b{height:12px;border-radius:6px;background:linear-gradient(90deg,#1677ff,#69b1ff);}.qir-inserted-bars em{color:#26384d;font-style:normal;font-weight:650;text-align:right;}',
      '.qir-inserted-pie-wrap{height:156px;display:grid;grid-template-columns:180px minmax(0,1fr);align-items:center;gap:20px;}.qir-inserted-pie{width:126px;height:126px;margin:0 auto;border-radius:50%;background:conic-gradient(#1677ff 0 36%,#36cfc9 36% 64%,#faad14 64% 85%,#ff7875 85% 100%);box-shadow:inset 0 0 0 24px #fff,0 0 0 1px #e6eff8;}.qir-inserted-legend{display:grid;gap:10px;color:#526579;font-size:12px;}.qir-inserted-legend span{display:inline-flex;align-items:center;gap:7px;}.qir-inserted-legend i{width:9px;height:9px;border-radius:2px;background:#1677ff;}.qir-inserted-legend span:nth-child(2) i{background:#36cfc9;}.qir-inserted-legend span:nth-child(3) i{background:#faad14;}.qir-inserted-legend span:nth-child(4) i{background:#ff7875;}',
      '.qir-inserted-table{width:100%;border-collapse:collapse;color:#44566c;font-size:12px;}.qir-inserted-table.qir-template-doc-table{margin:0;}.qir-inserted-table th,.qir-inserted-table td{height:36px;padding:0 10px;border:1px solid #edf1f6;text-align:left;}.qir-inserted-table th{background:#f7f9fc;color:#26384d;font-weight:650;}.qir-template-table-dashboard .qir-inserted-table tr.is-total td{background:#fafafa;color:#1f2d3d;font-weight:650;}',
      '@media (max-width:900px){body{overflow:auto}.qir-preview-app{height:auto;min-height:100vh;grid-template-columns:1fr}.qir-preview-toc{height:auto;max-height:240px;border-right:none;border-bottom:1px solid #c9cdd3}.qir-preview-stage{height:auto;min-height:calc(100vh - 240px);padding:18px 14px 78px}.qir-preview-page-wrap{min-width:0}.qir-template-page{width:100%;gap:16px}.qir-template-doc-page{min-height:860px;padding:34px 28px}.qir-template-cover-content{min-height:760px;padding:72px 0 56px}.qir-preview-close-btn{top:12px;right:14px}.qir-preview-zoom-toolbar{right:14px;bottom:14px}}',
      '@media print{body{overflow:auto;background:#fff}.qir-preview-toc,.qir-preview-close-btn,.qir-preview-zoom-toolbar{display:none!important}.qir-preview-app{display:block;height:auto;background:#fff}.qir-preview-stage{height:auto;overflow:visible;padding:0;background:#fff}.qir-preview-page-wrap{min-width:0;display:block}.qir-template-page{zoom:1!important;width:auto;display:block;gap:0}.qir-template-doc-page{min-height:auto;border:none;box-shadow:none;page-break-after:always}.qir-template-doc-page:last-child{page-break-after:auto}}'
    ].join('');
  }

  function getTemplatePreviewScripts() {
    return [
      '(function(){',
      'var page=document.querySelector("[data-qir-preview-page]");',
      'var range=document.querySelector("[data-qir-preview-zoom-range]");',
      'var value=document.querySelector("[data-qir-preview-zoom-value]");',
      'var outBtn=document.querySelector("[data-qir-preview-zoom-out]");',
      'var inBtn=document.querySelector("[data-qir-preview-zoom-in]");',
      'var resetBtn=document.querySelector("[data-qir-preview-zoom-reset]");',
      'var closeBtn=document.querySelector("[data-qir-preview-close]");',
      'var rulePieCharts=[];',
      'var rulePieColors=["#25577f","#2f75a8","#4d94bd","#6fb0d1","#9bc8df","#c7dceb"];',
      'var trendColors={bar:"#3f8fc9",barEnd:"#7fc4e8",line:"#27a97b",lineSoft:"rgba(39,169,123,.12)"};',
      'var min=60,max=180,step=10,zoom=100;',
      'function clamp(next){next=Number(next)||100;return Math.max(min,Math.min(max,Math.round(next/step)*step));}',
      'function apply(next){zoom=clamp(next);if(page){page.style.zoom=(zoom/100).toFixed(2);}if(range){range.value=zoom;}if(value){value.textContent=zoom+"%";}if(outBtn){outBtn.disabled=zoom<=min;}if(inBtn){inBtn.disabled=zoom>=max;}resizeRulePieCharts();}',
      'function readRulePieData(node){var raw=node?node.getAttribute("data-qir-chart-data"):"";if(!raw){return [];}try{return JSON.parse(decodeURIComponent(raw));}catch(err){return [];}}',
      'function getRulePieRich(){var rich={name:{color:"#26384d",fontSize:14,fontFamily:"Microsoft YaHei, Arial, sans-serif",fontWeight:500,lineHeight:22},value:{color:"#1f2d3d",fontSize:14,fontFamily:"Microsoft YaHei, Arial, sans-serif",fontWeight:650,lineHeight:22},pct:{color:"#6f8298",fontSize:13,fontFamily:"Microsoft YaHei, Arial, sans-serif",lineHeight:20},blank:{width:17}};rulePieColors.forEach(function(color,index){rich["marker"+index]={width:8,height:8,borderRadius:2,backgroundColor:color};});return rich;}',
      'function getRulePieOption(data){return {color:rulePieColors,animationDuration:650,animationEasing:"cubicOut",tooltip:{trigger:"item",confine:true,backgroundColor:"rgba(255,255,255,.97)",borderColor:"#d6e2ef",borderWidth:1,padding:[9,12],extraCssText:"border-radius:6px;box-shadow:0 10px 24px rgba(31,45,61,.12);",textStyle:{color:"#26384d",fontSize:12,fontFamily:"Microsoft YaHei, Arial, sans-serif"},formatter:function(params){var percent=Number(params.percent||0).toFixed(2);return params.name+"<br/>检核问题条数："+params.value+"<br/>占比："+percent+"%";}},series:[{type:"pie",radius:["0%","50%"],center:["50%","52%"],startAngle:90,clockwise:true,minAngle:4,avoidLabelOverlap:true,stillShowZeroSum:false,itemStyle:{borderColor:"#fff",borderWidth:4,borderRadius:3,shadowBlur:3,shadowColor:"rgba(31,45,61,.08)"},emphasis:{scaleSize:5,itemStyle:{shadowBlur:16,shadowOffsetY:4,shadowColor:"rgba(31,45,61,.18)"}},label:{show:true,position:"outside",alignTo:"edge",edgeDistance:22,bleedMargin:8,distanceToLabelLine:6,lineHeight:22,formatter:function(params){var markerIndex=params.dataIndex%rulePieColors.length;var percent=Number(params.percent||0).toFixed(2);return "{marker"+markerIndex+"|} {name|"+params.name+"}{value|, "+params.value+",}\\n{blank|} {pct|"+percent+"%}";},rich:getRulePieRich()},labelLine:{show:true,length:22,length2:44,smooth:.12,lineStyle:{color:"#9aaabb",width:1.2}},labelLayout:{hideOverlap:false,moveOverlap:"shiftY"},data:data}]};}',
      'function getTrendOption(data){var barColor=window.echarts&&window.echarts.graphic?new window.echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:trendColors.barEnd},{offset:1,color:trendColors.bar}]):trendColors.bar;return {color:[trendColors.bar,trendColors.line],animationDuration:650,animationEasing:"cubicOut",tooltip:{trigger:"axis",confine:true,axisPointer:{type:"shadow",shadowStyle:{color:"rgba(47,117,168,.08)"}},backgroundColor:"rgba(255,255,255,.97)",borderColor:"#d6e2ef",borderWidth:1,padding:[9,12],extraCssText:"border-radius:6px;box-shadow:0 10px 24px rgba(31,45,61,.12);",textStyle:{color:"#26384d",fontSize:12,fontFamily:"Microsoft YaHei, Arial, sans-serif"},formatter:function(params){var list=Array.isArray(params)?params:[params];var label=list[0]?list[0].axisValue:"";var row=data.filter(function(item){return item.label===label;})[0]||{};var html="<b>"+label+"</b>";if(row.dateTime){html+="<br>"+row.dateTime;}list.forEach(function(item){var unit=item.seriesName==="整改率"?"%":"条";html+="<br>"+(item.marker||"")+item.seriesName+"：<b>"+item.value+unit+"</b>";});return html;}},legend:{top:8,left:"center",itemGap:36,itemWidth:14,itemHeight:9,selectedMode:false,textStyle:{color:"#526579",fontSize:12,fontFamily:"Microsoft YaHei, Arial, sans-serif"},data:["检核问题条数","整改率"]},grid:{left:54,right:58,top:56,bottom:48},xAxis:{type:"category",data:data.map(function(item){return item.label;}),axisTick:{show:false},axisLine:{lineStyle:{color:"#d9e4f0"}},axisLabel:{color:"#6f8298",fontSize:11,interval:0,rotate:0,margin:12}},yAxis:[{type:"value",name:"检核问题条数",nameTextStyle:{color:"#6f8298",fontSize:12,padding:[0,0,8,0]},min:0,axisLabel:{color:"#6f8298",formatter:"{value}条"},splitLine:{lineStyle:{color:"#edf2f7",type:"dashed"}}},{type:"value",name:"整改率",nameTextStyle:{color:"#6f8298",fontSize:12,padding:[0,0,8,0]},min:0,max:100,axisLabel:{color:"#6f8298",formatter:"{value}%"},splitLine:{show:false}}],series:[{name:"检核问题条数",type:"bar",yAxisIndex:0,barWidth:18,data:data.map(function(item){return item.problemCount;}),itemStyle:{color:barColor,borderRadius:[4,4,0,0]}},{name:"整改率",type:"line",yAxisIndex:1,smooth:true,symbol:"circle",symbolSize:7,data:data.map(function(item){return item.rectifyRate;}),lineStyle:{width:3,color:trendColors.line},itemStyle:{color:"#fff",borderColor:trendColors.line,borderWidth:2},areaStyle:{color:trendColors.lineSoft}}]};}',
      'function resizeRulePieCharts(){rulePieCharts.forEach(function(chart){if(chart&&chart.resize){try{chart.resize();}catch(err){}}});}',
      'function initRulePieCharts(root){var scope=root||document;var nodes=Array.prototype.slice.call(scope.querySelectorAll("[data-qir-echart]"));nodes.forEach(function(node){var chartType=node.getAttribute("data-qir-echart")||"";var data=readRulePieData(node);if(!data.length){return;}if(!window.echarts){node.innerHTML="<div class=\\"qir-chart-fallback\\">ECharts 加载后显示图表</div>";return;}var oldChart=window.echarts.getInstanceByDom?window.echarts.getInstanceByDom(node):null;if(oldChart&&oldChart.dispose){oldChart.dispose();}node.innerHTML="";var chart=window.echarts.init(node);chart.setOption(chartType==="rectify-trend"?getTrendOption(data):getRulePieOption(data),true);rulePieCharts.push(chart);});}',
      'if(range){range.addEventListener("input",function(){apply(this.value);});}',
      'if(outBtn){outBtn.addEventListener("click",function(){apply(zoom-step);});}',
      'if(inBtn){inBtn.addEventListener("click",function(){apply(zoom+step);});}',
      'if(resetBtn){resetBtn.addEventListener("click",function(){apply(100);});}',
      'if(closeBtn){closeBtn.addEventListener("click",function(){window.close();});}',
      'var firstLink=document.querySelector(".qir-preview-toc a");if(firstLink){firstLink.classList.add("active");}',
      'document.querySelectorAll(".qir-preview-toc a").forEach(function(link){link.addEventListener("click",function(e){var selector=link.getAttribute("href");var target=selector?document.querySelector(selector):null;if(target){e.preventDefault();document.querySelectorAll(".qir-preview-toc a.active").forEach(function(item){item.classList.remove("active");});link.classList.add("active");target.scrollIntoView({behavior:"smooth",block:"start"});}});});',
      'initRulePieCharts(document);',
      'window.addEventListener("resize",resizeRulePieCharts);',
      'apply(100);',
      '})();'
    ].join('');
  }

  function openTemplatePreview() {
    var config = getSelectedReportConfig() || reportConfigs[0];
    var previewData = getTemplatePreviewData(config);
    var title = (config ? config.name : '稽查报告模板') + ' - 预览';
    var previewWindow = window.open('', '_blank');
    if (!previewWindow) {
      showToast('浏览器已拦截预览窗口');
      return;
    }
    previewWindow.document.open();
    previewWindow.document.write('<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>' + escapeHtml(title) + '</title><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"><script src="https://cdn.jsdelivr.net/npm/echarts@5.5.1/dist/echarts.min.js"></script><style>' + getTemplatePreviewStyles() + '</style></head><body><div class="qir-preview-app"><aside class="qir-preview-toc"><h2><i class="bi bi-list-ul"></i><span>报告目录</span></h2><nav>' + previewData.toc + '</nav></aside><main class="qir-preview-stage"><div class="qir-preview-page-wrap"><article class="qir-template-page" data-qir-preview-page>' + previewData.html + '</article></div></main></div><button class="qir-preview-close-btn" type="button" data-qir-preview-close title="关闭预览" aria-label="关闭预览"><i class="bi bi-x-lg"></i><span>关闭</span></button><div class="qir-preview-zoom-toolbar" aria-label="预览缩放工具条"><button type="button" data-qir-preview-zoom-out title="缩小" aria-label="缩小"><i class="bi bi-dash-lg"></i></button><input type="range" min="60" max="180" step="10" value="100" data-qir-preview-zoom-range aria-label="缩放比例"><button type="button" data-qir-preview-zoom-in title="放大" aria-label="放大"><i class="bi bi-plus-lg"></i></button><button class="qir-preview-zoom-value" type="button" data-qir-preview-zoom-reset title="恢复 100%" aria-label="恢复 100%"><i class="bi bi-aspect-ratio"></i><span data-qir-preview-zoom-value>100%</span></button></div><script>' + getTemplatePreviewScripts() + '</script></body></html>');
    previewWindow.document.close();
    previewWindow.focus();
  }

  function getHistoryPreviewConfig(history) {
    var config = getReportConfigById(history.configId) || reportConfigs[0];
    var previewConfig = {};
    Object.keys(config || {}).forEach(function (key) {
      previewConfig[key] = config[key];
    });
    previewConfig.name = getHistoryReportName(history);
    previewConfig.lastGeneratedTime = history.generatedTime;
    return previewConfig;
  }

  function getHistoryTemplateOverrides(history) {
    var config = getReportConfigById(history.configId) || reportConfigs[0];
    var metrics = getHistoryMetrics(history);
    var dateValues = getHistoryDateValues(history.generatedTime);
    var avg = metrics.avgPassRate;
    return {
      '模板名称': getHistoryReportName(history),
      '统计范围': getHistoryScopeText(history),
      '数据源数量': config.dbCount || 0,
      '数据库数量': config.dbCount || 0,
      '表数量': config.tableCount || metrics.rowCount,
      '字段数': (metrics.totalRecordCount / 10000).toFixed(2),
      '质量任务数': config.taskCount || 0,
      '平均通过率': avg.toFixed(1) + '%',
      '问题总记录数': formatNumber(metrics.problemRecordCount),
      '问题记录数': formatNumber(metrics.problemRecordCount),
      '稽查问题总记录数': formatNumber(metrics.problemRecordCount),
      '稽查总数据记录数': formatNumber(metrics.totalRecordCount),
      '完整性合规比例': clampHistoryRate(avg + 0.4).toFixed(2) + '%',
      '一致性合规比例': clampHistoryRate(avg + 0.1).toFixed(2) + '%',
      '唯一性合规': clampHistoryRate(avg + 0.6).toFixed(2) + '%',
      '有效性合规比例': clampHistoryRate(avg - 0.2).toFixed(2) + '%',
      '准确性合规比例': clampHistoryRate(avg - 0.4).toFixed(2) + '%',
      '及时性合规比例': clampHistoryRate(avg + 0.2).toFixed(2) + '%',
      '生成周期': getCycleText(config.cycle),
      '调度周期': getCycleText(config.cycle),
      '最后生成时间': history.generatedTime,
      '年份': dateValues.year + '年',
      '月份': dateValues.year + '年' + dateValues.month + '月',
      '日期': dateValues.date,
      '时间': dateValues.time,
      '日期时间': dateValues.dateTime
    };
  }

  function getHistoryTemplatePreviewData(history) {
    return getTemplatePreviewData(getHistoryPreviewConfig(history), getHistoryTemplateOverrides(history));
  }

  function renderHistoryWindowDataRows(history) {
    var rows = getHistoryReportRows(history);
    if (!rows.length) {
      return '<tr class="qir-history-empty-row"><td colspan="6">暂无表级稽查数据</td></tr>';
    }
    return rows.map(function (item) {
      var searchText = [item.tableName, item.alias, item.dataSourceLabel, item.desc].join(' ').toLowerCase();
      return '<tr data-history-data-row data-search="' + escapeHtml(searchText) + '">' +
        '<td><div class="qir-history-table-name"><b>' + escapeHtml(item.tableName) + '</b><span>' + escapeHtml(item.alias) + '</span></div></td>' +
        '<td>' + escapeHtml(item.dataSourceLabel) + '</td>' +
        '<td>' + escapeHtml(formatNumber(item.fileRecordCount)) + '</td>' +
        '<td><span class="qir-problem-count">' + escapeHtml(formatNumber(item.problemRecordCount)) + '</span></td>' +
        '<td>' + renderRate(item.avgPassRate) + '</td>' +
        '<td>' + escapeHtml(item.lastExecutionTime) + '</td>' +
      '</tr>';
    }).join('');
  }

  function renderHistoryWindowDataTab(history) {
    var metrics = getHistoryMetrics(history);
    return '<section class="qir-history-report-panel qir-history-data-panel" data-history-panel="data">' +
      '<div class="qir-history-data-toolbar">' +
        '<div class="qir-history-data-title"><strong>表级稽查数据</strong><span>共 ' + escapeHtml(metrics.rowCount) + ' 张表，稽查总记录数 ' + escapeHtml(formatNumber(metrics.totalRecordCount)) + ' 条</span></div>' +
        '<div class="qir-history-query"><span>表名称</span><input type="text" data-history-keyword placeholder="请输入表名称/数据源" aria-label="表名称或数据源查询"><button type="button" data-history-query><i class="bi bi-search"></i><b>查询</b></button></div>' +
      '</div>' +
      '<div class="qir-history-data-table-wrap">' +
        '<table class="qir-history-data-table">' +
          '<thead><tr><th>表名称</th><th>所属数据源</th><th>稽查总记录数</th><th>问题记录数</th><th>平均通过率</th><th>最后执行时间</th></tr></thead>' +
          '<tbody>' + renderHistoryWindowDataRows(history) + '</tbody>' +
        '</table>' +
      '</div>' +
    '</section>';
  }

  function getHistoryReportWindowStyles() {
    return getTemplatePreviewStyles() + [
      '.qir-history-report-window{height:100vh;display:flex;flex-direction:column;overflow:hidden;background:#f4f7fb;color:#26384d;}',
      '.qir-history-report-topbar{height:57px;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:10px 14px;border-bottom:1px solid #d9e2ec;background:#fff;box-sizing:border-box;flex-shrink:0;}',
      '.qir-history-report-title{min-width:0;display:flex;flex-direction:column;gap:2px;margin-right:auto;}',
      '.qir-history-report-title strong,.qir-history-report-title span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}',
      '.qir-history-report-title strong{color:#1f2d3d;font-size:14px;font-weight:650;}',
      '.qir-history-report-title span{color:#7b8fa8;font-size:12px;}',
      '.qir-history-report-tabs{display:inline-flex;align-items:center;gap:2px;padding:3px;border:1px solid #d9e4f0;border-radius:4px;background:#f7f9fc;flex-shrink:0;}',
      '.qir-history-report-tabs button{height:32px;display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:0 14px;border:1px solid transparent;border-radius:3px;background:transparent;color:#526579;font-family:inherit;font-size:13px;cursor:pointer;}',
      '.qir-history-report-tabs button:hover{color:#1677ff;background:#eaf4ff;}',
      '.qir-history-report-tabs button.active{border-color:#91caff;background:#fff;color:#1677ff;box-shadow:0 2px 6px rgba(22,119,255,.08);}',
      '.qir-history-report-close{height:32px;display:inline-flex;align-items:center;gap:6px;padding:0 12px;border:1px solid #d9e4f0;border-radius:3px;background:#fff;color:#526579;font-family:inherit;font-size:13px;cursor:pointer;}',
      '.qir-history-report-close:hover{border-color:#91caff;background:#eaf4ff;color:#1677ff;}',
      '.qir-history-report-body{flex:1;min-height:0;overflow:hidden;}',
      '.qir-history-report-panel{display:none;height:calc(100vh - 57px);min-height:0;}',
      '.qir-history-report-panel.active{display:block;}',
      '.qir-history-report-window .qir-preview-app{height:calc(100vh - 57px);grid-template-columns:280px minmax(0,1fr);}',
      '.qir-history-report-window .qir-preview-toc{height:calc(100vh - 57px);}',
      '.qir-history-report-window .qir-preview-stage{height:calc(100vh - 57px);}',
      '.qir-history-data-panel.active{display:flex;flex-direction:column;background:#f4f7fb;}',
      '.qir-history-data-toolbar{min-height:56px;display:flex;align-items:center;justify-content:space-between;gap:16px;margin:0 14px;padding:10px 0;border-bottom:1px solid #dfe5ec;background:#fff;box-sizing:border-box;flex-shrink:0;}',
      '.qir-history-data-title{min-width:0;display:flex;flex-direction:column;gap:3px;}',
      '.qir-history-data-title strong{color:#1f2d3d;font-size:14px;font-weight:650;}',
      '.qir-history-data-title span{color:#7b8fa8;font-size:12px;}',
      '.qir-history-query{display:flex;align-items:center;margin-left:auto;}',
      '.qir-history-query span{height:34px;display:inline-flex;align-items:center;padding:0 9px;border:1px solid #d9dfe6;border-right:none;border-radius:2px 0 0 2px;background:#f7f9fc;color:#44566c;font-size:13px;white-space:nowrap;}',
      '.qir-history-query input{width:240px;height:34px;padding:0 10px;border:1px solid #d9dfe6;border-right:none;border-radius:0;color:#1f2d3d;font-family:inherit;font-size:13px;outline:none;box-sizing:border-box;}',
      '.qir-history-query input:focus{border-color:#1677ff;}',
      '.qir-history-query button{height:34px;display:inline-flex;align-items:center;justify-content:center;gap:6px;min-width:70px;padding:0 13px;border:1px solid #1677ff;border-radius:0 2px 2px 0;background:#1677ff;color:#fff;font-family:inherit;font-size:13px;cursor:pointer;}',
      '.qir-history-query button b{font-weight:500;}',
      '.qir-history-data-table-wrap{flex:1;min-height:0;overflow:auto;margin:12px 14px;border:1px solid #dfe5ec;background:#fff;}',
      '.qir-history-data-table{width:100%;min-width:1080px;border-collapse:collapse;table-layout:fixed;}',
      '.qir-history-data-table th,.qir-history-data-table td{height:42px;padding:0 10px;border-right:1px solid #e4e9f0;border-bottom:1px solid #edf1f6;color:#26384d;text-align:left;white-space:nowrap;font-size:13px;}',
      '.qir-history-data-table th{background:#f7f9fc;color:#25364a;font-weight:600;}',
      '.qir-history-data-table tbody tr:nth-child(even){background:#f7f7f7;}',
      '.qir-history-data-table th:last-child,.qir-history-data-table td:last-child{border-right:none;}',
      '.qir-history-table-name{min-width:0;display:flex;flex-direction:column;justify-content:center;gap:2px;}',
      '.qir-history-table-name b,.qir-history-table-name span{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}',
      '.qir-history-table-name b{color:#1677ff;font-weight:650;}',
      '.qir-history-table-name span{color:#7b8fa8;font-size:12px;}',
      '.qir-rate{position:relative;width:112px;height:24px;display:inline-flex;align-items:center;justify-content:center;overflow:hidden;border:1px solid #e2eaf3;border-radius:12px;background:#f5f7fa;vertical-align:middle;}',
      '.qir-rate i{position:absolute;left:0;top:0;bottom:0;opacity:.24;}',
      '.qir-rate b{position:relative;z-index:1;font-size:12px;font-weight:650;}',
      '.qir-rate-high i{background:#52c41a}.qir-rate-high b{color:#237804}.qir-rate-mid i{background:#faad14}.qir-rate-mid b{color:#ad6800}.qir-rate-low i{background:#ff4d4f}.qir-rate-low b,.qir-problem-count{color:#cf1322!important;}',
      '.qir-history-empty-row td{text-align:center;color:#8aa0b7;}',
      '.qir-history-window-toast{position:fixed;left:50%;bottom:24px;z-index:20;transform:translate(-50%,8px);opacity:0;padding:9px 16px;border-radius:4px;background:rgba(31,45,61,.9);color:#fff;font-size:13px;transition:opacity .18s ease,transform .18s ease;pointer-events:none;}',
      '.qir-history-window-toast.show{opacity:1;transform:translate(-50%,0);}',
      'body.history-data-active .qir-preview-zoom-toolbar{display:none!important;}',
      '@media (max-width:900px){.qir-history-report-topbar{height:auto;align-items:flex-start;flex-wrap:wrap}.qir-history-report-panel{height:calc(100vh - 98px)}.qir-history-report-window .qir-preview-app{height:calc(100vh - 98px);grid-template-columns:1fr}.qir-history-report-window .qir-preview-toc{height:auto;max-height:220px}.qir-history-report-window .qir-preview-stage{height:auto;min-height:calc(100vh - 318px)}.qir-history-data-panel.active{height:calc(100vh - 98px)}.qir-history-data-toolbar{align-items:flex-start;flex-direction:column}.qir-history-query{width:100%;margin-left:0}.qir-history-query input{width:100%;min-width:0}}'
    ].join('');
  }

  function getHistoryReportWindowScripts() {
    return [
      '(function(){',
      'function setTab(key){document.querySelectorAll("[data-history-tab]").forEach(function(btn){btn.classList.toggle("active",btn.getAttribute("data-history-tab")===key);});document.querySelectorAll("[data-history-panel]").forEach(function(panel){panel.classList.toggle("active",panel.getAttribute("data-history-panel")===key);});document.body.classList.toggle("history-data-active",key==="data");}',
      'document.querySelectorAll("[data-history-tab]").forEach(function(btn){btn.addEventListener("click",function(){setTab(btn.getAttribute("data-history-tab")||"overview");});});',
      'var input=document.querySelector("[data-history-keyword]");',
      'function filterRows(){var keyword=input?input.value.trim().toLowerCase():"";document.querySelectorAll("[data-history-data-row]").forEach(function(row){var text=row.getAttribute("data-search")||"";row.style.display=!keyword||text.indexOf(keyword)>=0?"":"none";});}',
      'if(input){input.addEventListener("input",filterRows);input.addEventListener("keydown",function(e){if(e.key==="Enter"){filterRows();}});}',
      'var queryBtn=document.querySelector("[data-history-query]");if(queryBtn){queryBtn.addEventListener("click",filterRows);}',
      'setTab("overview");',
      '})();'
    ].join('');
  }

  function openHistoryReportView(id) {
    var history = getHistoryReportById(id);
    if (!history) {
      showToast('未找到历史报告');
      return;
    }
    var previewData = getHistoryTemplatePreviewData(history);
    var title = getHistoryReportName(history);
    var previewWindow = window.open('', '_blank');
    if (!previewWindow) {
      showToast('浏览器已拦截历史报告窗口');
      return;
    }
    previewWindow.document.open();
    previewWindow.document.write('<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>' + escapeHtml(title) + '</title><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"><script src="https://cdn.jsdelivr.net/npm/echarts@5.5.1/dist/echarts.min.js"></script><style>' + getHistoryReportWindowStyles() + '</style></head><body><div class="qir-history-report-window"><header class="qir-history-report-topbar"><div class="qir-history-report-tabs"><button class="active" type="button" data-history-tab="overview"><i class="bi bi-file-earmark-richtext"></i><span>报告概述</span></button><button type="button" data-history-tab="data"><i class="bi bi-table"></i><span>数据详情</span></button></div><div class="qir-history-report-title"><strong>' + escapeHtml(title) + '</strong><span>生成时间：' + escapeHtml(history.generatedTime) + ' · 统计范围：' + escapeHtml(getHistoryScopeText(history)) + '</span></div><button class="qir-history-report-close" type="button" data-qir-preview-close><i class="bi bi-x-lg"></i><span>关闭</span></button></header><main class="qir-history-report-body"><section class="qir-history-report-panel active" data-history-panel="overview"><div class="qir-preview-app"><aside class="qir-preview-toc"><h2><i class="bi bi-list-ul"></i><span>报告目录</span></h2><nav>' + previewData.toc + '</nav></aside><main class="qir-preview-stage"><div class="qir-preview-page-wrap"><article class="qir-template-page" data-qir-preview-page>' + previewData.html + '</article></div></main></div></section>' + renderHistoryWindowDataTab(history) + '</main></div><div class="qir-preview-zoom-toolbar" aria-label="预览缩放工具条"><button type="button" data-qir-preview-zoom-out title="缩小" aria-label="缩小"><i class="bi bi-dash-lg"></i></button><input type="range" min="60" max="180" step="10" value="100" data-qir-preview-zoom-range aria-label="缩放比例"><button type="button" data-qir-preview-zoom-in title="放大" aria-label="放大"><i class="bi bi-plus-lg"></i></button><button class="qir-preview-zoom-value" type="button" data-qir-preview-zoom-reset title="恢复 100%" aria-label="恢复 100%"><i class="bi bi-aspect-ratio"></i><span data-qir-preview-zoom-value>100%</span></button></div><script>' + getTemplatePreviewScripts() + getHistoryReportWindowScripts() + '</script></body></html>');
    previewWindow.document.close();
    previewWindow.focus();
  }

  function renderTemplateDocTocBlock() {
    return '<section class="qir-template-doc-toc">' +
      '<h2>目录</h2>' +
      templateOutlineSections.map(function (item) {
        return '<div class="qir-template-doc-toc-row level-' + item.level + '"><span>' + escapeHtml(item.number + ' ' + item.title) + '</span><i class="qir-template-doc-toc-leader"></i><em>' + escapeHtml(item.page) + '</em></div>';
      }).join('') +
    '</section>';
  }

  function renderTemplateDocTable(headers, rows, className, title, dashboardId, summary) {
    var safeTitle = title || '表格仪表盘';
    var summaryHtml = summary ? '<p class="qir-inserted-dashboard-summary">' + escapeHtml(summary) + '</p>' : '';
    return '<div class="qir-template-inserted-dashboard qir-template-table-dashboard" contenteditable="false" data-dashboard-id="' + escapeHtml(dashboardId || 'dash-template-doc-table') + '" data-dashboard-type="table">' +
      '<div class="qir-inserted-dashboard-head"><strong>' + escapeHtml(safeTitle) + '</strong></div>' +
      summaryHtml +
      '<div class="qir-inserted-dashboard-body">' + renderDashboardTableHtml(headers, rows, className) + '</div>' +
    '</div>';
  }

  function renderTemplateDashboardById(id) {
    var item = getTemplateDashboardOptionById(id);
    return item ? renderInsertedDashboardBlock(item) : '';
  }

  function renderTemplateQualityDimensionBlocks(startIndex, endIndex) {
    var start = typeof startIndex === 'number' ? startIndex : 0;
    var rows = templateQualityDimensionStats.slice(start, typeof endIndex === 'number' ? endIndex : undefined);
    return rows.map(function (item, index) {
      return '<h4>1.2.' + (start + index + 1) + ' ' + escapeHtml(item.name) + '</h4>' +
        '<p>' + escapeHtml(item.name) + '涉及相关表统计如下：</p>' +
        renderTemplateDocTable(['表名称', '中文名', '检核数据条数', '检核问题条数', '检核问题率'], item.rows, 'qir-template-check-table', item.name + '检核结果表', 'dash-template-check-table-' + (start + index + 1));
    }).join('');
  }

  function renderTemplateFieldDetailTable(item) {
    return renderTemplateDocTable(['评测字段（对象）', '评测内容', '评测标准', '评估结论'], templateFieldDetailRows, 'qir-template-field-table', getTemplateFieldDashboardTitle(item), getTemplateFieldDashboardId(item), getTemplateFieldDashboardSummary(item));
  }

  function renderTemplateDetailBlocks(startIndex, endIndex) {
    var start = typeof startIndex === 'number' ? startIndex : 0;
    var rows = templateDetailSamples.slice(start, typeof endIndex === 'number' ? endIndex : undefined);
    return rows.map(function (item, index) {
      return '<h3>2.' + (start + index + 1) + ' ' + escapeHtml(item.tableName) + '（' + escapeHtml(item.alias) + '）</h3>' +
        renderTemplateFieldDetailTable(item);
    }).join('');
  }

  function renderTemplateDetailPages() {
    var pages = [];
    var chunkSize = 2;
    for (var start = 0; start < templateDetailSamples.length; start += chunkSize) {
      var content = (start === 0 ? '<h2>2 数据质量检核详细情况</h2>' : '') +
        renderTemplateDetailBlocks(start, start + chunkSize);
      pages.push(renderTemplateDocPage(content));
    }
    return pages.join('');
  }

  function renderTemplateDocPage(content, className) {
    return '<section class="qir-template-doc-page ' + (className || 'qir-template-content-page') + '">' + content + '</section>';
  }

  function renderTemplateEditorDefaultContent() {
    var coverPage = '<div class="qir-template-cover-content">' +
      '<h1><span class="qir-template-doc-system">OA系统</span>数据质量检核报告</h1>' +
      '<p class="qir-template-report-date">报告生成日期：' + renderEditorVariableToken('日期时间', 'qir-template-token') + '</p>' +
      '</div>';
    var overviewPage = '<h2>1 数据质量检核总体情况</h2>' +
      '<h3>1.1 总体概述</h3>' +
      '<p>本轮稽查已完成对OA系统的数据质量进行了完整性、一致性、唯一性、有效性、准确性、及时性的数据质量评估。</p>' +
      '<p>共执行' + renderEditorVariableToken('质量任务数', 'qir-template-token') + '个质量任务，平均通过率为' + renderEditorVariableToken('平均通过率', 'qir-template-token') + '。</p>' +
      '<p>检核范围涉及' + renderEditorVariableToken('数据源数量', 'qir-template-token') + '个数据源、' + renderEditorVariableToken('表数量', 'qir-template-token') + '张表、' + renderEditorVariableToken('字段数', 'qir-template-token') + '万条数据，涉及数据质量校验规则共' + renderEditorVariableToken('问题总记录数', 'qir-template-token') + '条，检核规则分布如下表所示：</p>' +
      renderTemplateDashboardById('dash-template-rule-pie') +
      renderTemplateDocTable(['规则类型', '合规比例', '检核问题条数'], templateRuleDistributionRows, 'qir-template-rule-table', '规则类型分布表', 'dash-template-rule-table') +
      '<p>其中：完整性' + renderEditorVariableToken('完整性合规比例', 'qir-template-token') + '、一致性' + renderEditorVariableToken('一致性合规比例', 'qir-template-token') + '、唯一性' + renderEditorVariableToken('唯一性合规', 'qir-template-token') + '、有效性' + renderEditorVariableToken('有效性合规比例', 'qir-template-token') + '、准确性' + renderEditorVariableToken('准确性合规比例', 'qir-template-token') + '、及时性' + renderEditorVariableToken('及时性合规比例', 'qir-template-token') + '。</p>' +
      '<p>本次评估总记录数：' + renderEditorVariableToken('稽查总数据记录数', 'qir-template-token') + '条；</p>' +
      '<p>评测完成时间：' + renderEditorVariableToken('日期时间', 'qir-template-token') + '。</p>';
    var topPage = '<h4>1.1.1 质量好Top10</h4>' +
      '<p>数据质量总体评估最好的表Top统计如下：</p>' +
      renderTemplateDocTable(['序号', '表名称', '中文名', '检核数据条数', '检核问题条数', '检核问题率'], templateQualityGoodTopRows, 'qir-template-quality-rank-table', '质量好Top10', 'dash-template-quality-good-top-table') +
      '<h4>1.1.2 数据差Top10</h4>' +
      '<p>数据质量总体评估最差的表Top统计如下：</p>' +
      renderTemplateDocTable(['序号', '表名称', '中文名', '检核数据条数', '检核问题条数', '检核问题率'], templateQualityBadTopRows, 'qir-template-quality-rank-table', '数据差Top10', 'dash-template-quality-bad-top-table');
    var resultFirstPage = '<h3>1.2 检核结果</h3>' + renderTemplateQualityDimensionBlocks(0, 2);
    var resultSecondPage = renderTemplateQualityDimensionBlocks(2, 4);
    var resultThirdPage = renderTemplateQualityDimensionBlocks(4) +
      '<h3>1.3 问题整改进度</h3>' +
      renderTemplateDashboardById('dash-template-trend-chart') +
      renderTemplateDocTable(['序号', '日期时间', '表数据量', '检核数据条数', '检核问题条数', '检核问题率', '整改率'], templateRectifyTrendRows, 'qir-template-trend-table', '问题整改进度表', 'dash-template-trend-table');
    return renderTemplateDocPage(coverPage, 'qir-template-cover-page') +
      renderTemplateDocPage(overviewPage) +
      renderTemplateDocPage(topPage) +
      renderTemplateDocPage(resultFirstPage) +
      renderTemplateDocPage(resultSecondPage) +
      renderTemplateDocPage(resultThirdPage) +
      renderTemplateDetailPages();
  }

  function renderTemplateEditor(config) {
    var content = state.templateEditorHtml || renderTemplateEditorDefaultContent();
    return '<section class="qir-template-editor-shell">' +
      renderTemplateEditorToolbar() +
      '<div class="qir-template-editor-canvas">' +
        '<article class="qir-template-page" contenteditable="true" spellcheck="false" data-qir-template-editor style="zoom:' + (getTemplateZoomValue() / 100).toFixed(2) + '">' + content + '</article>' +
      '</div>' +
      renderTemplateZoomToolbar() +
    '</section>';
  }

  function renderTemplateManageTabs(activeTab) {
    var tabs = [
      { key: 'template', label: '报告模板', icon: 'bi-file-earmark-richtext' },
      { key: 'scope', label: '统计范围', icon: 'bi-diagram-3' },
      { key: 'filter', label: '数据过滤', icon: 'bi-funnel' }
    ];
    return '<div class="qir-template-config-tabs">' + tabs.map(function (tab) {
      return '<button class="' + (activeTab === tab.key ? 'active' : '') + '" type="button" data-qir-action="template-manage-tab" data-tab="' + escapeHtml(tab.key) + '"><i class="bi ' + escapeHtml(tab.icon) + '"></i><span>' + escapeHtml(tab.label) + '</span></button>';
    }).join('') + '</div>';
  }

  function renderTemplateNameControl(config) {
    config = config || getSelectedReportConfig() || reportConfigs[0];
    var desc = config.desc || '暂无报告描述';
    var nameHtml = state.templateNameEditing
      ? '<input type="text" data-qir-template-name-input value="' + escapeHtml(config.name) + '" maxlength="50" aria-label="报告名称">'
      : '<b title="' + escapeHtml(config.name) + '">' + escapeHtml(config.name) + '</b><button class="qir-template-meta-edit" type="button" data-qir-action="edit-template-name" title="编辑报告名称" aria-label="编辑报告名称"><i class="bi bi-pencil-square"></i></button>';
    var descHtml = state.templateDescEditing
      ? '<input type="text" data-qir-template-desc-input value="' + escapeHtml(desc) + '" maxlength="120" aria-label="报告描述">'
      : '<em title="' + escapeHtml(desc) + '">' + escapeHtml(desc) + '</em><button class="qir-template-meta-edit" type="button" data-qir-action="edit-template-desc" title="编辑报告描述" aria-label="编辑报告描述"><i class="bi bi-pencil-square"></i></button>';
    return '<div class="qir-template-meta">' +
      '<div class="qir-template-name' + (state.templateNameEditing ? ' is-editing' : '') + '"><span>名称：</span>' + nameHtml + '</div>' +
      '<div class="qir-template-desc' + (state.templateDescEditing ? ' is-editing' : '') + '"><span>描述：</span>' + descHtml + '</div>' +
    '</div>';
  }

  function renderTemplateModeButtons(config) {
    var mode = getTemplateApplyMode(config);
    var groups = getTemplateFilterGroups(config);
    var groupDisabled = !groups.length;
    return '<div class="qir-template-mode" role="radiogroup" aria-label="模板应用方式">' +
      '<label class="qir-template-radio' + (mode === 'common' ? ' active' : '') + '"><input type="radio" name="qir-template-apply-mode" data-qir-template-apply-mode value="common"' + (mode === 'common' ? ' checked' : '') + '><span>通用模板</span></label>' +
      '<label class="qir-template-radio' + (mode === 'group' ? ' active' : '') + (groupDisabled ? ' disabled' : '') + '"><input type="radio" name="qir-template-apply-mode" data-qir-template-apply-mode value="group"' + (mode === 'group' ? ' checked' : '') + (groupDisabled ? ' disabled' : '') + '><span>分组模板</span></label>' +
    '</div>';
  }

  function renderTemplateTargetOptions(config) {
    var groups = getTemplateFilterGroups(config);
    var currentValue = state.templateEditTarget === 'group' && state.templateEditGroupId ? 'group:' + state.templateEditGroupId : 'common';
    return groups.map(function (group) {
      var value = 'group:' + group.id;
      return '<option value="' + escapeHtml(value) + '"' + (currentValue === value ? ' selected' : '') + '>' + escapeHtml(group.name) + '</option>';
    }).join('');
  }

  function renderTemplateCurrentEditorControl(config) {
    if (getTemplateApplyMode(config) !== 'group') {
      return '<input class="qir-template-current-input" type="text" value="通用模板" disabled aria-label="当前编辑模板">';
    }
    var groups = getTemplateFilterGroups(config);
    if (!groups.length) {
      return '<input class="qir-template-current-input" type="text" value="暂无数据过滤分组" disabled aria-label="当前编辑模板">';
    }
    return '<select class="qir-template-current-select" data-qir-template-edit-target aria-label="当前编辑模板">' + renderTemplateTargetOptions(config) + '</select>';
  }

  function renderTemplateStrategyPanel(config) {
    return '<section class="qir-template-strategy">' +
      '<div class="qir-template-strategy-row">' +
        '<span class="qir-template-strategy-label">应用模式：</span>' +
        renderTemplateModeButtons(config) +
      '</div>' +
      '<div class="qir-template-strategy-row">' +
        '<span class="qir-template-strategy-label">当前编辑：</span>' +
        renderTemplateCurrentEditorControl(config) +
      '</div>' +
    '</section>';
  }

  function getDefaultTemplateCopyTargetGroupId(config) {
    var groups = getTemplateFilterGroups(config);
    if (!groups.length) return '';
    if (state.templateCopyTargetGroupId && getTemplateGroupById(config, state.templateCopyTargetGroupId)) {
      return state.templateCopyTargetGroupId;
    }
    if (state.templateEditTarget === 'group' && state.templateEditGroupId && groups.length > 1) {
      var nextGroup = groups.filter(function (group) { return group.id !== state.templateEditGroupId; })[0];
      if (nextGroup) return nextGroup.id;
    }
    return groups[0].id;
  }

  function renderTemplateCopyTargetOptions(config) {
    var targetGroupId = getDefaultTemplateCopyTargetGroupId(config);
    return getTemplateFilterGroups(config).map(function (group) {
      return '<option value="' + escapeHtml(group.id) + '"' + (group.id === targetGroupId ? ' selected' : '') + '>' + escapeHtml(group.name) + '</option>';
    }).join('');
  }

  function openTemplateCopyModal() {
    saveTemplateEditorContent();
    var config = getSelectedReportConfig() || reportConfigs[0];
    if (getTemplateApplyMode(config) !== 'group') {
      showToast('分组模板模式下才支持复制');
      return;
    }
    var groups = getTemplateFilterGroups(config);
    if (!groups.length) {
      showToast('请先在数据过滤中新增分组');
      return;
    }
    state.templateCopyTargetGroupId = getDefaultTemplateCopyTargetGroupId(config);
    state.templateCopyModalOpen = true;
    state.templateDashboardModalOpen = false;
    state.templateScheduleModalOpen = false;
    renderAll();
  }

  function confirmTemplateCopy() {
    saveTemplateEditorContent();
    var config = getSelectedReportConfig() || reportConfigs[0];
    if (getTemplateApplyMode(config) !== 'group') {
      state.templateCopyModalOpen = false;
      state.templateCopyTargetGroupId = '';
      renderAll();
      showToast('分组模板模式下才支持复制');
      return;
    }
    var targetGroupId = state.templateCopyTargetGroupId || getDefaultTemplateCopyTargetGroupId(config);
    var targetGroup = getTemplateGroupById(config, targetGroupId);
    if (!targetGroup) {
      showToast('请选择目标分组');
      return;
    }
    targetGroup.templateHtml = state.templateEditorHtml || getTemplateEditorFallbackHtml(config);
    targetGroup.templateUpdatedAt = formatDateTime(new Date());
    state.templateCopyModalOpen = false;
    state.templateCopyTargetGroupId = '';
    renderAll();
    showToast('已复制到：' + targetGroup.name);
  }

  function renderTemplateCopyModal(config) {
    if (!state.templateCopyModalOpen) return '';
    config = config || getSelectedReportConfig() || reportConfigs[0];
    if (getTemplateApplyMode(config) !== 'group') return '';
    var targetGroupId = getDefaultTemplateCopyTargetGroupId(config);
    state.templateCopyTargetGroupId = targetGroupId;
    var sourceLabel = getTemplateEditLabel(config);
    return '<div class="qir-dashboard-modal-mask" data-qir-action="close-template-copy-modal"></div>' +
      '<section class="qir-copy-modal" role="dialog" aria-modal="true" aria-label="复制模板内容">' +
        '<div class="qir-dashboard-modal-head">' +
          '<div><h3>复制模板内容</h3><p>将当前正在编辑的模板内容复制到指定数据过滤分组。</p></div>' +
          '<button class="qir-dashboard-modal-close" type="button" data-qir-action="close-template-copy-modal" aria-label="关闭"><i class="bi bi-x-lg"></i></button>' +
        '</div>' +
        '<div class="qir-copy-modal-body">' +
          '<div class="qir-copy-current"><span>当前模板</span><b>' + escapeHtml(sourceLabel) + '</b></div>' +
          '<label class="qir-copy-field"><span>目标分组</span><select data-qir-template-copy-target aria-label="目标分组">' + renderTemplateCopyTargetOptions(config) + '</select></label>' +
          '<div class="qir-copy-note"><i class="bi bi-info-circle"></i><span>确认后将覆盖目标分组已有模板内容，当前编辑模板不切换。</span></div>' +
        '</div>' +
        '<div class="qir-dashboard-modal-foot">' +
          '<span>复制目标：<b>' + escapeHtml((getTemplateGroupById(config, targetGroupId) || {}).name || '-') + '</b></span>' +
          '<div><button class="btn btn-outline" type="button" data-qir-action="close-template-copy-modal"><i class="bi bi-x-lg"></i><span>取消</span></button><button class="btn btn-primary" type="button" data-qir-action="confirm-template-copy"><i class="bi bi-check-lg"></i><span>确认复制</span></button></div>' +
        '</div>' +
      '</section>';
  }

  function renderTemplateReportContent(config) {
    config = config || getSelectedReportConfig() || reportConfigs[0];
    ensureTemplateEditorTarget(config);
    var copyAction = getTemplateApplyMode(config) === 'group'
      ? '<button class="btn btn-outline" type="button" data-qir-action="open-template-copy-modal"><i class="bi bi-copy"></i><span>复制</span></button>'
      : '';
    return renderTemplateResourcePanel(config) +
      '<section class="qir-template-main">' +
        '<div class="qir-template-topbar">' +
          '<div class="qir-template-topbar-left">' + renderTemplateNameControl(config) + '</div>' +
          '<div class="qir-template-actions">' +
            copyAction +
            '<button class="btn btn-outline" type="button" data-qir-action="template-preview"><i class="bi bi-eye"></i><span>预览</span></button>' +
            '<button class="btn btn-outline" type="button" data-qir-action="template-action-placeholder"><i class="bi bi-file-earmark-word"></i><span>导入Word模板</span></button>' +
            '<button class="btn btn-primary" type="button" data-qir-action="template-save"><i class="bi bi-save"></i><span>保存</span></button>' +
            '<button class="btn btn-outline" type="button" data-qir-action="template-back-list"><i class="bi bi-arrow-left"></i><span>返回</span></button>' +
          '</div>' +
        '</div>' +
        '<div class="qir-template-workspace' + (state.templateOutlineCollapsed ? ' outline-collapsed' : '') + '">' + renderTemplateOutline() + renderTemplateEditor(config) + '</div>' +
      '</section>' +
      renderTemplateDashboardModal() +
      renderTemplateCopyModal(config);
  }

  function renderTemplateScopePlaceholder(config) {
    config = config || getSelectedReportConfig() || reportConfigs[0];
    var selectedCount = getTemplateScopeSelectedCount();
    return '<section class="qir-template-scope-panel">' +
      '<div class="qir-template-scope-head">' +
        '<div><h3>统计范围配置</h3><p>设置查看报告数据详情列表中纳入统计的数据表范围。</p></div>' +
        '<div class="qir-template-scope-actions">' +
          '<div class="qir-query-box qir-template-scope-query"><span class="qir-query-label">表名称</span><input type="text" data-qir-template-scope-keyword value="' + escapeHtml(state.templateScopeKeyword) + '" placeholder="请输入表英文名/中文名/数据源/描述" aria-label="统计范围查询"><button class="btn btn-primary" type="button" data-qir-action="query-template-scope"><i class="bi bi-search"></i><span>查询</span></button></div>' +
          '<button class="btn btn-primary btn-sm" type="button" data-qir-action="template-scope-add"><i class="bi bi-plus-lg"></i><span>添加</span></button>' +
          '<button class="btn btn-outline btn-sm" type="button" data-qir-action="template-scope-remove-selected"' + (selectedCount ? '' : ' disabled') + '><i class="bi bi-dash-circle"></i><span>移除</span></button>' +
          '<button class="btn btn-outline btn-sm" type="button" data-qir-action="template-back-list"><i class="bi bi-arrow-left"></i><span>返回</span></button>' +
        '</div>' +
      '</div>' +
      '<div class="qir-template-scope-summary"><em>已配置 ' + getTemplateScopeRows().length + ' 张表，选中 ' + selectedCount + ' 条</em></div>' +
      renderTemplateScopeTable() +
      renderTemplateScopeFooter() +
    '</section>';
  }

  function renderTemplateScopeTable() {
    var rows = getVisibleTemplateScopeRows();
    var visibleAllSelected = rows.length && rows.every(function (item) { return !!state.templateScopeSelected[item.id]; });
    var emptyText = state.templateScopeKeyword.trim() ? '暂无匹配统计范围' : '暂无统计范围数据';
    return '<div class="qir-table-wrap qir-template-scope-table-wrap">' +
      '<table class="ds-table qir-table qir-template-scope-table">' +
        '<thead><tr><th><input type="checkbox" data-qir-template-scope-check-all' + (visibleAllSelected ? ' checked' : '') + ' aria-label="全选当前页"></th><th>表英文名</th><th>中文名</th><th>所属数据源</th><th>备注描述</th><th>规则数</th><th>操作</th></tr></thead>' +
        '<tbody>' + (rows.length ? rows.map(function (item) {
          return '<tr>' +
            '<td><input type="checkbox" data-qir-template-scope-check="' + escapeHtml(item.id) + '"' + (state.templateScopeSelected[item.id] ? ' checked' : '') + ' aria-label="选择' + escapeHtml(item.tableName) + '"></td>' +
            '<td><b>' + escapeHtml(item.tableName) + '</b></td>' +
            '<td>' + escapeHtml(item.alias) + '</td>' +
            '<td>' + escapeHtml(item.dataSourceLabel) + '</td>' +
            '<td><div class="qir-template-scope-desc" title="' + escapeHtml(item.desc) + '">' + escapeHtml(item.desc) + '</div></td>' +
            '<td>' + escapeHtml(item.ruleCount) + '</td>' +
            '<td><div class="qir-table-actions"><button class="qir-view-btn qir-danger-link" type="button" data-qir-action="template-scope-remove" data-id="' + escapeHtml(item.id) + '"><i class="bi bi-dash-circle"></i><span>移除</span></button></div></td>' +
          '</tr>';
        }).join('') : '<tr class="qir-empty-row"><td colspan="7">' + emptyText + '</td></tr>') +
        '</tbody>' +
      '</table>' +
    '</div>';
  }

  function renderTemplateScopeFooter() {
    var rows = getTemplateScopeRows();
    var total = rows.length;
    var totalPages = clampTemplateScopePage(total);
    var start = total ? (state.templateScopePage - 1) * state.templateScopePageSize + 1 : 0;
    var end = total ? Math.min(total, state.templateScopePage * state.templateScopePageSize) : 0;
    return '<div class="qir-footer qir-template-scope-footer">' +
      '<div>显示第 ' + start + ' 到第 ' + end + ' 条记录，总共 ' + total + ' 条记录 每页显示 <select data-qir-template-scope-page-size><option value="10"' + (state.templateScopePageSize === 10 ? ' selected' : '') + '>10</option><option value="20"' + (state.templateScopePageSize === 20 ? ' selected' : '') + '>20</option></select> 条记录</div>' +
      '<div class="qir-page-nav">' + renderPageNav(totalPages, state.templateScopePage, 'data-qir-template-scope-page') + '</div>' +
    '</div>';
  }

  function renderTemplateScopeModalTree(nodes, level) {
    level = level || 0;
    return nodes.map(function (node) {
      var hasChildren = node.children && node.children.length;
      var isOpen = state.treeOpen[node.key] || node.key === 'all';
      var isActive = (state.templateScopeModalTreeKey || 'all') === node.key;
      return '<li>' +
        '<div class="qir-tree-node' + (isActive ? ' active' : '') + '" style="padding-left:' + (8 + level * 18) + 'px;">' +
          '<button class="qir-tree-toggle" type="button" data-qir-action="toggle-template-scope-tree" data-key="' + escapeHtml(node.key) + '">' + (hasChildren ? '<i class="bi ' + (isOpen ? 'bi-chevron-down' : 'bi-chevron-right') + '"></i>' : '') + '</button>' +
          '<button class="qir-tree-label" type="button" data-qir-action="select-template-scope-tree" data-key="' + escapeHtml(node.key) + '"><i class="bi ' + escapeHtml(node.icon || 'bi-folder-fill') + '"></i><span>' + escapeHtml(node.label) + '</span></button>' +
        '</div>' +
        (hasChildren && isOpen ? '<ul>' + renderTemplateScopeModalTree(node.children, level + 1) + '</ul>' : '') +
      '</li>';
    }).join('');
  }

  function renderTemplateScopeModalRows() {
    var rows = getTemplateScopeCandidateRows();
    if (!rows.length) {
      return '<tr class="qir-empty-row"><td colspan="6">' + (state.templateScopeModalKeyword.trim() ? '暂无匹配数据表' : '当前目录下暂无可添加数据表') + '</td></tr>';
    }
    return rows.map(function (item) {
      return '<tr>' +
        '<td><input type="checkbox" data-qir-template-scope-modal-check="' + escapeHtml(item.id) + '"' + (state.templateScopeModalSelected[item.id] ? ' checked' : '') + ' aria-label="选择' + escapeHtml(item.tableName) + '"></td>' +
        '<td><b>' + escapeHtml(item.tableName) + '</b></td>' +
        '<td>' + escapeHtml(item.alias) + '</td>' +
        '<td>' + escapeHtml(item.dataSourceLabel) + '</td>' +
        '<td><div class="qir-template-scope-desc" title="' + escapeHtml(item.desc) + '">' + escapeHtml(item.desc) + '</div></td>' +
        '<td>' + escapeHtml(item.ruleCount) + '</td>' +
      '</tr>';
    }).join('');
  }

  function renderTemplateScopeModal() {
    if (!state.templateScopeModalOpen) return '';
    var rows = getTemplateScopeCandidateRows();
    var allSelected = rows.length && rows.every(function (item) { return !!state.templateScopeModalSelected[item.id]; });
    var selectedCount = getTemplateScopeModalSelectedCount();
    return '<div class="qir-scope-modal-mask" data-qir-action="close-template-scope-modal"></div>' +
      '<section class="qir-scope-modal" role="dialog" aria-modal="true" aria-label="添加统计范围">' +
        '<div class="qir-dashboard-modal-head">' +
          '<div><h3>添加统计范围</h3><p>从数据源目录中选择需要纳入报告数据详情的数据表。</p></div>' +
          '<button class="qir-dashboard-modal-close" type="button" data-qir-action="close-template-scope-modal" aria-label="关闭"><i class="bi bi-x-lg"></i></button>' +
        '</div>' +
        '<div class="qir-scope-modal-body">' +
          '<aside class="qir-scope-modal-left">' +
            '<div class="qir-scope-modal-search"><input type="text" data-qir-template-scope-modal-keyword value="' + escapeHtml(state.templateScopeModalKeyword) + '" placeholder="关键字搜索" aria-label="关键字搜索"><button type="button" data-qir-action="query-template-scope-modal"><i class="bi bi-search"></i></button></div>' +
            '<div class="qir-scope-modal-tree"><ul class="qir-tree">' + renderTemplateScopeModalTree(reportTree, 0) + '</ul></div>' +
          '</aside>' +
          '<section class="qir-scope-modal-right">' +
            '<div class="qir-scope-modal-table-wrap">' +
              '<table class="ds-table qir-table qir-scope-modal-table">' +
                '<thead><tr><th><input type="checkbox" data-qir-template-scope-modal-check-all' + (allSelected ? ' checked' : '') + ' aria-label="全选可见数据表"></th><th>表英文名</th><th>中文名</th><th>所属数据源</th><th>备注描述</th><th>规则数</th></tr></thead>' +
                '<tbody>' + renderTemplateScopeModalRows() + '</tbody>' +
              '</table>' +
            '</div>' +
          '</section>' +
        '</div>' +
        '<div class="qir-dashboard-modal-foot">' +
          '<b>已选择 ' + selectedCount + ' 张表</b>' +
          '<div><button class="btn btn-outline" type="button" data-qir-action="close-template-scope-modal"><i class="bi bi-x-lg"></i><span>取消</span></button><button class="btn btn-primary" type="button" data-qir-action="template-scope-modal-confirm"' + (!selectedCount ? ' disabled' : '') + '><i class="bi bi-plus-lg"></i><span>添加</span></button></div>' +
        '</div>' +
      '</section>';
  }

  function renderTemplateFilterEmpty(config) {
    config = config || getSelectedReportConfig() || reportConfigs[0];
    return '<section class="qir-template-filter-panel">' +
      '<div class="qir-template-filter-head">' +
        '<div><h3>数据过滤配置</h3><p>设置报告统计范围内各数据表的过滤条件。</p></div>' +
        '<div class="qir-template-filter-actions"><button class="btn btn-outline btn-sm" type="button" data-qir-action="template-back-list"><i class="bi bi-arrow-left"></i><span>返回</span></button></div>' +
      '</div>' +
      '<div class="qir-template-filter-empty">' +
        '<i class="bi bi-funnel"></i>' +
        '<strong>请增加数据过滤条件</strong>' +
        '<button class="btn btn-primary qir-template-filter-empty-add" type="button" data-qir-action="template-filter-create"><i class="bi bi-plus-lg"></i><span>新增</span></button>' +
      '</div>' +
    '</section>';
  }

  function renderTemplateFilterGroupMeta(group) {
    var editingField = group.editingField || (group.editing ? 'name' : '');
    var nameHtml = editingField === 'name'
      ? '<input class="qir-template-filter-name-input" type="text" data-qir-template-filter-group-name data-group-id="' + escapeHtml(group.id) + '" value="' + escapeHtml(group.name) + '" maxlength="40" aria-label="过滤组名称">'
      : '<b title="' + escapeHtml(group.name) + '">' + escapeHtml(group.name) + '</b><button type="button" data-qir-action="template-filter-edit-group" data-group-id="' + escapeHtml(group.id) + '" data-field="name" aria-label="编辑名称"><i class="bi bi-pencil-square"></i></button>';
    var descHtml = editingField === 'desc'
      ? '<input class="qir-template-filter-desc-input" type="text" data-qir-template-filter-group-desc data-group-id="' + escapeHtml(group.id) + '" value="' + escapeHtml(group.desc) + '" maxlength="80" aria-label="过滤组描述">'
      : '<em title="' + escapeHtml(group.desc) + '">' + escapeHtml(group.desc) + '</em><button type="button" data-qir-action="template-filter-edit-group" data-group-id="' + escapeHtml(group.id) + '" data-field="desc" aria-label="编辑描述"><i class="bi bi-pencil-square"></i></button>';
    return '<div class="qir-template-filter-group-meta">' +
      '<div class="qir-template-filter-group-info">' +
        '<div class="qir-template-filter-group-name">' + nameHtml + '</div>' +
        '<div class="qir-template-filter-group-desc">' + descHtml + '</div>' +
      '</div>' +
    '</div>';
  }

  function renderTemplateFilterRows(group) {
    var rows = getVisibleTemplateFilterRows(group);
    if (!rows.length) {
      return '<tr class="qir-empty-row"><td colspan="5">' + (state.templateFilterKeyword.trim() ? '暂无匹配过滤条件' : '暂无过滤条件') + '</td></tr>';
    }
    return rows.map(function (item) {
      return '<tr>' +
        '<td><b>' + escapeHtml(item.tableName) + '</b></td>' +
        '<td>' + escapeHtml(item.alias) + '</td>' +
        '<td><div class="qir-template-filter-condition' + (item.condition ? '' : ' is-empty') + '" title="' + escapeHtml(item.condition || '未配置过滤条件') + '">' + escapeHtml(item.condition || '未配置过滤条件') + '</div></td>' +
        '<td><div class="qir-template-filter-desc" title="' + escapeHtml(item.desc) + '">' + escapeHtml(item.desc) + '</div></td>' +
        '<td><div class="qir-table-actions qir-template-filter-row-actions">' +
          '<button class="qir-view-btn" type="button" data-qir-action="template-filter-edit-row" data-group-id="' + escapeHtml(group.id) + '" data-row-id="' + escapeHtml(item.id) + '"><i class="bi bi-pencil-square"></i><span>编辑</span></button>' +
          '<button class="qir-view-btn qir-danger-link" type="button" data-qir-action="template-filter-clear-row" data-group-id="' + escapeHtml(group.id) + '" data-row-id="' + escapeHtml(item.id) + '"><i class="bi bi-dash-circle"></i><span>移除</span></button>' +
        '</div></td>' +
      '</tr>';
    }).join('');
  }

  function renderTemplateFilterPageNav(totalPages, current, groupId) {
    var idAttr = ' data-group-id="' + escapeHtml(groupId) + '"';
    var html = '<button type="button" data-qir-template-filter-page="prev"' + idAttr + (current <= 1 ? ' disabled' : '') + '><i class="bi bi-chevron-left"></i></button>';
    var maxVisible = Math.min(totalPages, 7);
    for (var i = 1; i <= maxVisible; i++) {
      html += '<button type="button" data-qir-template-filter-page="' + i + '"' + idAttr + (current === i ? ' class="active"' : '') + '>' + i + '</button>';
    }
    if (totalPages > 7) {
      html += '<span>...</span><button type="button" data-qir-template-filter-page="' + totalPages + '"' + idAttr + (current === totalPages ? ' class="active"' : '') + '>' + totalPages + '</button>';
    }
    html += '<button type="button" data-qir-template-filter-page="next"' + idAttr + (current >= totalPages ? ' disabled' : '') + '><i class="bi bi-chevron-right"></i></button>';
    return html;
  }

  function renderTemplateFilterFooter(group) {
    var rows = getTemplateFilterFilteredRows(group);
    var total = rows.length;
    var pageSize = getTemplateFilterPageSize(group);
    var totalPages = clampTemplateFilterGroupPage(group, total);
    var currentPage = getTemplateFilterGroupPage(group);
    var start = total ? (currentPage - 1) * pageSize + 1 : 0;
    var end = total ? Math.min(total, currentPage * pageSize) : 0;
    return '<div class="qir-footer qir-template-filter-footer">' +
      '<div>显示第 ' + start + ' 到第 ' + end + ' 条记录，总共 ' + total + ' 条记录 每页显示 <select data-qir-template-filter-page-size data-group-id="' + escapeHtml(group.id) + '"><option value="10"' + (pageSize === 10 ? ' selected' : '') + '>10</option><option value="20"' + (pageSize === 20 ? ' selected' : '') + '>20</option></select> 条记录</div>' +
      '<div class="qir-page-nav">' + renderTemplateFilterPageNav(totalPages, currentPage, group.id) + '</div>' +
    '</div>';
  }

  function renderTemplateFilterGroup(group, index) {
    return '<section class="qir-template-filter-group" data-qir-template-filter-group-id="' + escapeHtml(group.id) + '">' +
      '<div class="qir-template-filter-group-top">' +
        renderTemplateFilterGroupMeta(group) +
        '<div class="qir-template-filter-group-actions">' +
          '<button class="btn btn-danger btn-sm" type="button" data-qir-action="template-filter-delete-group" data-group-id="' + escapeHtml(group.id) + '"><i class="bi bi-trash3"></i><span>删除分组</span></button>' +
          '<div class="qir-query-box qir-template-filter-query"><input type="text" data-qir-template-filter-keyword value="' + escapeHtml(state.templateFilterKeyword) + '" placeholder="请输入表英文名/中文名/备注描述" aria-label="数据过滤查询"><button class="btn btn-primary" type="button" data-qir-action="query-template-filter"><i class="bi bi-search"></i><span>查询</span></button></div>' +
        '</div>' +
      '</div>' +
      '<div class="qir-template-filter-table-wrap">' +
        '<table class="ds-table qir-table qir-template-filter-table">' +
          '<thead><tr><th>表英文名</th><th>中文名</th><th>过滤条件</th><th>备注描述</th><th>操作</th></tr></thead>' +
          '<tbody>' + renderTemplateFilterRows(group) + '</tbody>' +
        '</table>' +
      '</div>' +
      renderTemplateFilterFooter(group) +
    '</section>';
  }

  function renderTemplateFilterPanel(config) {
    config = config || getSelectedReportConfig() || reportConfigs[0];
    var groups = getTemplateFilterGroups(config);
    if (!groups.length) return renderTemplateFilterEmpty(config);
    groups.forEach(function (group) { syncTemplateFilterGroupRows(config, group); });
    var conditionCount = getTemplateFilterConditionCount(groups);
    return '<section class="qir-template-filter-panel">' +
      '<div class="qir-template-filter-head">' +
        '<div><h3>数据过滤配置</h3><p>配置多组过滤条件，报告生成时按组应用到对应数据表。</p></div>' +
        '<div class="qir-template-filter-actions">' +
          '<button class="btn btn-primary btn-sm" type="button" data-qir-action="template-filter-add-group"><i class="bi bi-plus-lg"></i><span>新增分组</span></button>' +
          '<button class="btn btn-outline btn-sm" type="button" data-qir-action="template-back-list"><i class="bi bi-arrow-left"></i><span>返回</span></button>' +
        '</div>' +
      '</div>' +
      '<div class="qir-template-filter-summary"><em>已配置 ' + groups.length + ' 组过滤条件，共 ' + conditionCount + ' 条</em></div>' +
      '<div class="qir-template-filter-groups">' + groups.map(renderTemplateFilterGroup).join('') + '</div>' +
    '</section>';
  }

  function renderTemplateFilterModalTabs() {
    var mode = state.templateFilterModalMode === 'sql' ? 'sql' : 'visual';
    return '<div class="qir-filter-modal-tabs">' +
      '<button class="' + (mode === 'visual' ? 'active' : '') + '" type="button" data-qir-action="template-filter-modal-tab" data-mode="visual"><i class="bi bi-ui-checks-grid"></i><span>可视化</span></button>' +
      '<button class="' + (mode === 'sql' ? 'active' : '') + '" type="button" data-qir-action="template-filter-modal-tab" data-mode="sql"><i class="bi bi-code-square"></i><span>SQL语句</span></button>' +
    '</div>';
  }

  function renderTemplateFilterVisualPanel(draft) {
    var fields = getTemplateFilterFieldOptions();
    var operators = ['等于', '不等于', '大于', '小于', '大于等于', '小于等于', '包含', '不包含', '为空', '不为空'];
    return '<div class="qir-filter-visual-panel">' +
      '<label><span>字段</span><select data-qir-template-filter-field>' + fields.map(function (item) {
        return '<option value="' + escapeHtml(item.name) + '"' + (draft.field === item.name ? ' selected' : '') + '>' + escapeHtml(item.name) + '（' + escapeHtml(item.label) + '）</option>';
      }).join('') + '</select></label>' +
      '<label><span>操作符</span><select data-qir-template-filter-operator>' + operators.map(function (item) {
        return '<option value="' + escapeHtml(item) + '"' + (draft.operator === item ? ' selected' : '') + '>' + escapeHtml(item) + '</option>';
      }).join('') + '</select></label>' +
      '<label><span>条件值</span><input type="text" data-qir-template-filter-value value="' + escapeHtml(draft.value) + '" maxlength="80" placeholder="请输入值"></label>' +
      '<label><span>备注描述</span><input type="text" data-qir-template-filter-desc value="' + escapeHtml(draft.desc) + '" maxlength="100" placeholder="请输入备注描述"></label>' +
      '<div class="qir-filter-apply-scope"><span>应用范围</span><label><input type="radio" name="qir-template-filter-apply-scope" data-qir-template-filter-apply-scope value="current"' + (draft.applyScope === 'all' ? '' : ' checked') + '> 当前表</label><label><input type="radio" name="qir-template-filter-apply-scope" data-qir-template-filter-apply-scope value="all"' + (draft.applyScope === 'all' ? ' checked' : '') + '> 所有表</label></div>' +
    '</div>';
  }

  function renderTemplateFilterSqlFieldList(draft) {
    var keyword = state.templateFilterFieldKeyword.trim().toLowerCase();
    var fields = getTemplateFilterFieldOptions().filter(function (item) {
      if (!keyword) return true;
      return item.name.toLowerCase().indexOf(keyword) >= 0 || item.label.toLowerCase().indexOf(keyword) >= 0;
    });
    if (!fields.length) {
      return '<div class="qir-filter-sql-field-empty">暂无匹配字段</div>';
    }
    return fields.map(function (item) {
      return '<button class="' + (draft.field === item.name ? 'active' : '') + '" type="button" data-qir-action="template-filter-pick-field" data-field="' + escapeHtml(item.name) + '"><i class="bi bi-circle-fill"></i><span>' + escapeHtml(item.name) + '</span><em>' + escapeHtml(item.label) + '</em></button>';
    }).join('');
  }

  function renderTemplateFilterSqlPanel(draft) {
    return '<div class="qir-filter-sql-panel">' +
      '<aside class="qir-filter-sql-fields">' +
        '<div class="qir-filter-sql-field-search"><i class="bi bi-search"></i><input type="text" data-qir-template-filter-field-keyword value="' + escapeHtml(state.templateFilterFieldKeyword) + '" placeholder="请输入字段名"></div>' +
        '<div class="qir-filter-sql-field-list">' + renderTemplateFilterSqlFieldList(draft) + '</div>' +
      '</aside>' +
      '<section class="qir-filter-sql-main">' +
        '<div class="qir-filter-sql-editor-wrap">' + renderTemplateFilterSqlEditor(draft.sql || 'is_deleted = 0') + '</div>' +
        '<div class="qir-filter-apply-scope qir-filter-sql-apply-scope"><span>应用范围</span><label><input type="radio" name="qir-template-filter-apply-scope" data-qir-template-filter-apply-scope value="current"' + (draft.applyScope === 'all' ? '' : ' checked') + '> 当前表</label><label><input type="radio" name="qir-template-filter-apply-scope" data-qir-template-filter-apply-scope value="all"' + (draft.applyScope === 'all' ? ' checked' : '') + '> 所有表</label></div>' +
      '</section>' +
    '</div>';
  }

  function renderTemplateFilterModal() {
    if (!state.templateFilterModalOpen) return '';
    var config = getSelectedReportConfig() || reportConfigs[0];
    var group = getTemplateFilterGroup(config, state.templateFilterModalGroupId) || createTemplateFilterGroup(config);
    var draft = state.templateFilterModalDraft || createTemplateFilterModalDraft(config, group, getTemplateFilterRow(group, state.templateFilterModalRowId));
    var row = getTemplateFilterRow(group, state.templateFilterModalRowId);
    var modalSubTitle = group.name || '数据过滤组';
    if (row) modalSubTitle += ' / ' + row.tableName + '（' + row.alias + '）';
    return '<div class="qir-filter-modal-mask" data-qir-action="close-template-filter-modal"></div>' +
      '<section class="qir-filter-modal" role="dialog" aria-modal="true" aria-label="过滤条件">' +
        '<div class="qir-dashboard-modal-head">' +
          '<div><h3>过滤条件</h3><p>' + escapeHtml(modalSubTitle) + '</p></div>' +
          '<button class="qir-dashboard-modal-close" type="button" data-qir-action="close-template-filter-modal" aria-label="关闭"><i class="bi bi-x-lg"></i></button>' +
        '</div>' +
        '<div class="qir-filter-modal-body">' +
          renderTemplateFilterModalTabs() +
          (state.templateFilterModalMode === 'sql' ? renderTemplateFilterSqlPanel(draft) : renderTemplateFilterVisualPanel(draft)) +
        '</div>' +
        '<div class="qir-dashboard-modal-foot qir-filter-modal-foot">' +
          '<span></span>' +
          '<div><button class="btn btn-outline" type="button" data-qir-action="close-template-filter-modal"><i class="bi bi-x-lg"></i><span>取消</span></button><button class="btn btn-primary" type="button" data-qir-action="template-filter-modal-save"><i class="bi bi-save"></i><span>保存</span></button></div>' +
        '</div>' +
      '</section>';
  }

  function renderTemplateShell() {
    var config = getSelectedReportConfig() || reportConfigs[0];
    var activeTab = state.templateManageTab === 'scope' || state.templateManageTab === 'filter' ? state.templateManageTab : 'template';
    var content = activeTab === 'scope' ? renderTemplateScopePlaceholder(config) : (activeTab === 'filter' ? renderTemplateFilterPanel(config) : renderTemplateReportContent(config));
    return '<section class="qir-template-config-shell">' +
      '<div class="qir-template-config-topbar">' + renderTemplateManageTabs(activeTab) + '</div>' +
      '<div class="qir-template-config-body ' + activeTab + '-tab">' + content + '</div>' +
    '</section>' +
    renderTemplateScopeModal() +
    renderTemplateFilterModal();
  }

  function renderHistoryRows() {
    var rows = getVisibleHistoryRows();
    if (!rows.length) {
      return '<tr class="qir-empty-row"><td colspan="7">暂无历史报告</td></tr>';
    }
    return rows.map(function (item) {
      var metrics = getHistoryMetrics(item);
      return '<tr>' +
        '<td><div class="qir-history-report-name" title="' + escapeHtml(getHistoryReportName(item)) + '">' + escapeHtml(getHistoryReportName(item)) + '</div></td>' +
        '<td>' + escapeHtml(item.generatedTime) + '</td>' +
        '<td><div class="qir-history-scope" title="' + escapeHtml(getHistoryScopeText(item)) + '">' + escapeHtml(getHistoryScopeText(item)) + '</div></td>' +
        '<td>' + escapeHtml(formatNumber(metrics.totalRecordCount)) + '</td>' +
        '<td><span class="qir-problem-count">' + escapeHtml(formatNumber(metrics.problemRecordCount)) + '</span></td>' +
        '<td>' + renderRate(metrics.avgPassRate) + '</td>' +
        '<td><div class="qir-table-actions"><button class="qir-view-btn" type="button" data-qir-action="open-history-report" data-id="' + escapeHtml(item.id) + '"><i class="bi bi-eye"></i><span>查看</span></button></div></td>' +
      '</tr>';
    }).join('');
  }

  function renderHistoryTable() {
    return '<div class="qir-table-wrap qir-history-table-wrap">' +
      '<table class="ds-table qir-table qir-history-table">' +
        '<thead><tr><th>报告名称</th><th>生成时间</th><th>统计范围</th><th>稽查总记录数</th><th>问题记录数</th><th>平均通过率</th><th>操作</th></tr></thead>' +
        '<tbody>' + renderHistoryRows() + '</tbody>' +
      '</table>' +
    '</div>';
  }

  function renderHistoryFooter() {
    var rows = getHistoryRows();
    var total = rows.length;
    var totalPages = clampHistoryPage(total);
    var start = total ? (state.historyPage - 1) * state.historyPageSize + 1 : 0;
    var end = total ? Math.min(total, state.historyPage * state.historyPageSize) : 0;
    return '<div class="qir-footer qir-history-footer">' +
      '<div>显示第 ' + start + ' 到第 ' + end + ' 条记录，总共 ' + total + ' 条记录 每页显示 <select data-qir-history-page-size><option value="10"' + (state.historyPageSize === 10 ? ' selected' : '') + '>10</option><option value="20"' + (state.historyPageSize === 20 ? ' selected' : '') + '>20</option></select> 条记录</div>' +
      '<div class="qir-page-nav">' + renderPageNav(totalPages, state.historyPage, 'data-qir-history-page') + '</div>' +
    '</div>';
  }

  function renderHistoryListShell() {
    var config = getSelectedReportConfig() || reportConfigs[0];
    return '<section class="qir-main-panel qir-main-panel-full qir-history-panel">' +
      '<div class="qir-toolbar qir-drill-toolbar">' +
        '<div class="qir-toolbar-title qir-drill-title"><button class="btn btn-outline btn-sm" type="button" data-qir-action="back-summary"><i class="bi bi-arrow-left"></i><span>返回列表</span></button><div><span>' + escapeHtml(config ? config.name : '历史报告') + '</span><em>历史报告按生成时间倒序展示，查看将在新浏览器页面打开</em></div></div>' +
      '</div>' +
      renderHistoryTable() +
      renderHistoryFooter() +
    '</section>';
  }

  function renderScheduleRecordSummary(config) {
    return '<div class="qir-schedule-record-summary">' +
      '<dl><dt>任务名称</dt><dd>' + escapeHtml(getScheduleTaskName(config)) + '</dd></dl>' +
      '<dl><dt>状态</dt><dd>' + renderConfigStatus(config.status) + '</dd></dl>' +
      '<dl><dt>调度周期</dt><dd>' + renderConfigCycle(config.cycle) + '</dd></dl>' +
    '</div>';
  }

  function renderExecutionStatusOptions(value) {
    var options = ['执行成功', '执行中', '执行失败'];
    return '<option value="">全部</option>' + options.map(function (status) {
      return '<option value="' + escapeHtml(status) + '"' + (value === status ? ' selected' : '') + '>' + escapeHtml(status) + '</option>';
    }).join('');
  }

  function renderScheduleRecordRows() {
    var rows = getVisibleScheduleRecordRows();
    if (!rows.length) {
      return '<tr class="qir-empty-row"><td colspan="5">暂无匹配执行记录</td></tr>';
    }
    return rows.map(function (item) {
      return '<tr>' +
        '<td>' + escapeHtml(item.startAt) + '</td>' +
        '<td>' + escapeHtml(item.endAt) + '</td>' +
        '<td>' + escapeHtml(item.duration) + '</td>' +
        '<td>' + renderConfigExecutionStatus(item.status) + '</td>' +
        '<td><div class="qir-table-actions qir-schedule-record-actions">' +
          '<button class="qir-view-btn" type="button" data-qir-action="open-schedule-run-detail" data-run-id="' + escapeHtml(item.id) + '"><i class="bi bi-list-task"></i><span>执行详情</span></button>' +
          (item.status === '执行中' ? '<button class="qir-view-btn qir-warning-link" type="button" data-qir-action="stop-schedule-run" data-run-id="' + escapeHtml(item.id) + '"><i class="bi bi-stop-circle"></i><span>停止</span></button>' : '') +
          '<button class="qir-view-btn qir-success-link" type="button" data-qir-action="rerun-schedule-run" data-run-id="' + escapeHtml(item.id) + '"><i class="bi bi-arrow-clockwise"></i><span>重新执行</span></button>' +
        '</div></td>' +
      '</tr>';
    }).join('');
  }

  function renderScheduleRecordTable() {
    return '<div class="qir-table-wrap qir-schedule-record-table-wrap">' +
      '<table class="ds-table qir-table qir-schedule-record-table">' +
        '<thead><tr><th>开始时间</th><th>完成时间</th><th>耗时</th><th>状态</th><th>操作</th></tr></thead>' +
        '<tbody>' + renderScheduleRecordRows() + '</tbody>' +
      '</table>' +
    '</div>';
  }

  function renderScheduleRecordDetailSummary(config, run) {
    return '<div class="qir-schedule-record-summary qir-schedule-detail-summary">' +
      '<dl><dt>任务名称</dt><dd>' + escapeHtml(getScheduleTaskName(config)) + '</dd></dl>' +
      '<dl><dt>执行批次</dt><dd>' + escapeHtml(run ? run.startAt : '-') + '</dd></dl>' +
      '<dl><dt>状态</dt><dd>' + renderConfigExecutionStatus(run ? run.status : '执行失败') + '</dd></dl>' +
      '<dl><dt>调度周期</dt><dd>' + renderConfigCycle(config && config.cycle) + '</dd></dl>' +
    '</div>';
  }

  function renderScheduleRecordDetailRows() {
    var rows = getVisibleScheduleRuleExecutionRows();
    if (!rows.length) {
      return '<tr class="qir-empty-row"><td colspan="7">暂无规则任务执行记录</td></tr>';
    }
    return rows.map(function (item) {
      return '<tr>' +
        '<td><div class="qir-rule-task-cell"><a class="qir-rule-task-link" href="' + escapeHtml(getTaskConfigEditUrl(item)) + '" target="_blank" rel="noopener" title="新开页面编辑任务配置：' + escapeHtml(item.ruleTask) + '"><span>' + escapeHtml(item.ruleTask) + '</span><i class="bi bi-box-arrow-up-right" aria-hidden="true"></i></a></div></td>' +
        '<td><div class="qir-rule-task-cell"><b title="' + escapeHtml(item.tableName) + '">' + escapeHtml(item.tableName) + '</b><span>' + escapeHtml(item.alias || '-') + '</span></div></td>' +
        '<td>' + escapeHtml(item.startAt) + '</td>' +
        '<td>' + escapeHtml(item.endAt) + '</td>' +
        '<td>' + escapeHtml(item.duration) + '</td>' +
        '<td>' + renderConfigExecutionStatus(item.status) + '</td>' +
        '<td><div class="qir-table-actions qir-schedule-record-actions">' +
          '<button class="qir-view-btn" type="button" data-qir-action="open-schedule-sql" data-run-id="' + escapeHtml(item.runId) + '" data-rule-run-id="' + escapeHtml(item.id) + '"><i class="bi bi-code-square"></i><span>执行SQL</span></button>' +
          '<button class="qir-view-btn" type="button" data-qir-action="open-schedule-log" data-run-id="' + escapeHtml(item.runId) + '" data-rule-run-id="' + escapeHtml(item.id) + '"><i class="bi bi-file-text"></i><span>执行日志</span></button>' +
          (item.status === '执行中' ? '<button class="qir-view-btn qir-warning-link" type="button" data-qir-action="stop-schedule-rule-run" data-run-id="' + escapeHtml(item.runId) + '" data-rule-run-id="' + escapeHtml(item.id) + '"><i class="bi bi-stop-circle"></i><span>停止</span></button>' : '') +
        '</div></td>' +
      '</tr>';
    }).join('');
  }

  function renderScheduleRecordDetailTable() {
    return '<div class="qir-table-wrap qir-schedule-record-table-wrap">' +
      '<table class="ds-table qir-table qir-schedule-record-table qir-schedule-detail-table">' +
        '<thead><tr><th>规则任务</th><th>稽查表</th><th>开始时间</th><th>完成时间</th><th>耗时</th><th>状态</th><th>操作</th></tr></thead>' +
        '<tbody>' + renderScheduleRecordDetailRows() + '</tbody>' +
      '</table>' +
    '</div>';
  }

  function renderScheduleRecordDetailFooter() {
    var rows = getScheduleDetailRows();
    var total = rows.length;
    var totalPages = clampScheduleDetailPage(total);
    var start = total ? (state.scheduleDetailPage - 1) * state.scheduleDetailPageSize + 1 : 0;
    var end = total ? Math.min(total, state.scheduleDetailPage * state.scheduleDetailPageSize) : 0;
    return '<div class="qir-footer qir-schedule-record-footer qir-schedule-detail-footer">' +
      '<div>显示第 ' + start + ' 到第 ' + end + ' 条记录，总共 ' + total + ' 条记录 每页显示 <select data-qir-schedule-detail-page-size><option value="10"' + (state.scheduleDetailPageSize === 10 ? ' selected' : '') + '>10</option><option value="20"' + (state.scheduleDetailPageSize === 20 ? ' selected' : '') + '>20</option></select> 条记录</div>' +
      '<div class="qir-page-nav">' + renderPageNav(totalPages, state.scheduleDetailPage, 'data-qir-schedule-detail-page') + '</div>' +
    '</div>';
  }

  function renderScheduleRecordFooter() {
    var rows = getScheduleRecordRows();
    var total = rows.length;
    var totalPages = clampScheduleRecordPage(total);
    var start = total ? (state.scheduleRecordPage - 1) * state.scheduleRecordPageSize + 1 : 0;
    var end = total ? Math.min(total, state.scheduleRecordPage * state.scheduleRecordPageSize) : 0;
    return '<div class="qir-footer qir-schedule-record-footer">' +
      '<div>显示第 ' + start + ' 到第 ' + end + ' 条记录，总共 ' + total + ' 条记录 每页显示 <select data-qir-schedule-record-page-size><option value="10"' + (state.scheduleRecordPageSize === 10 ? ' selected' : '') + '>10</option><option value="20"' + (state.scheduleRecordPageSize === 20 ? ' selected' : '') + '>20</option></select> 条记录</div>' +
      '<div class="qir-page-nav">' + renderPageNav(totalPages, state.scheduleRecordPage, 'data-qir-schedule-record-page') + '</div>' +
    '</div>';
  }

  function renderScheduleSqlModal() {
    if (!state.scheduleSqlModalOpen) return '';
    var run = state.selectedScheduleRuleRunId ? getSelectedScheduleRuleRun() : getSelectedScheduleRecordRun();
    return '<div class="qir-sql-modal-mask" data-qir-action="close-schedule-sql"></div>' +
      '<section class="qir-sql-modal" role="dialog" aria-modal="true" aria-label="执行SQL">' +
        '<div class="qir-sql-modal-head"><strong>执行SQL</strong><button type="button" data-qir-action="close-schedule-sql" aria-label="关闭"><i class="bi bi-x-lg"></i></button></div>' +
        '<div class="qir-sql-modal-body">' + renderScheduleSqlEditor(getScheduleRecordSql(run)) + '</div>' +
        '<div class="qir-sql-modal-foot"><button class="btn btn-primary" type="button" data-qir-action="close-schedule-sql"><i class="bi bi-x-lg"></i><span>关闭</span></button></div>' +
      '</section>';
  }

  function renderScheduleRecordDetailShell() {
    var config = getSelectedReportConfig() || reportConfigs[0];
    var run = getSelectedScheduleRecordRun();
    return '<section class="qir-main-panel qir-main-panel-full qir-schedule-record-panel qir-schedule-detail-panel">' +
      '<div class="qir-schedule-record-head">' +
        '<div><h3>执行详情</h3><p>查看本次调度下每个规则任务的执行记录</p></div>' +
        '<button class="btn btn-outline btn-sm" type="button" data-qir-action="back-schedule-records"><i class="bi bi-arrow-left"></i><span>返回执行记录</span></button>' +
      '</div>' +
      renderScheduleRecordDetailSummary(config, run) +
      '<div class="qir-toolbar qir-schedule-record-toolbar">' +
        '<div class="qir-toolbar-title">规则任务执行记录</div>' +
        '<div class="qir-query-box qir-schedule-record-query qir-schedule-detail-query">' +
          '<span class="qir-query-label">执行状态</span>' +
          '<select class="qir-query-select" data-qir-schedule-detail-status aria-label="执行状态">' + renderExecutionStatusOptions(state.scheduleDetailStatus) + '</select>' +
          '<span class="qir-query-label qir-query-label-gap">稽查任务</span>' +
          '<input type="text" data-qir-schedule-detail-task value="' + escapeHtml(state.scheduleDetailTaskKeyword) + '" placeholder="请输入稽查任务" aria-label="稽查任务">' +
          '<span class="qir-query-label qir-query-label-gap">稽查表</span>' +
          '<input type="text" data-qir-schedule-detail-table value="' + escapeHtml(state.scheduleDetailTableKeyword) + '" placeholder="请输入稽查表" aria-label="稽查表">' +
          '<button class="btn btn-primary" type="button" data-qir-action="query-schedule-detail"><i class="bi bi-search"></i><span>查询</span></button>' +
        '</div>' +
      '</div>' +
      renderScheduleRecordDetailTable() +
      renderScheduleRecordDetailFooter() +
    '</section>' +
    renderScheduleSqlModal();
  }

  function renderScheduleRecordShell() {
    var config = getSelectedReportConfig() || reportConfigs[0];
    return '<section class="qir-main-panel qir-main-panel-full qir-schedule-record-panel">' +
      '<div class="qir-schedule-record-head">' +
        '<div><h3>执行记录</h3><p>查看任务调度每次触发后的执行明细</p></div>' +
        '<button class="btn btn-outline btn-sm" type="button" data-qir-action="back-summary"><i class="bi bi-arrow-left"></i><span>返回列表</span></button>' +
      '</div>' +
      renderScheduleRecordSummary(config) +
      '<div class="qir-toolbar qir-schedule-record-toolbar">' +
        '<div class="qir-toolbar-title">执行记录列表</div>' +
        '<div class="qir-query-box qir-schedule-record-query">' +
          '<span class="qir-query-label">执行状态</span>' +
          '<select class="qir-query-select" data-qir-schedule-record-status aria-label="执行状态">' + renderExecutionStatusOptions(state.scheduleRecordStatus) + '</select>' +
          '<span class="qir-query-label qir-query-label-gap">开始时间</span>' +
          '<input class="qir-schedule-date-input" type="date" data-qir-schedule-start-date value="' + escapeHtml(state.scheduleRecordStartDate) + '" aria-label="开始日期">' +
          '<span class="qir-date-separator">至</span>' +
          '<input class="qir-schedule-date-input" type="date" data-qir-schedule-end-date value="' + escapeHtml(state.scheduleRecordEndDate) + '" aria-label="结束日期">' +
          '<button class="btn btn-primary" type="button" data-qir-action="query-schedule-records"><i class="bi bi-search"></i><span>查询</span></button>' +
        '</div>' +
      '</div>' +
      renderScheduleRecordTable() +
      renderScheduleRecordFooter() +
    '</section>' +
    renderScheduleSqlModal();
  }

  function renderScheduleLogShell() {
    var config = getSelectedReportConfig() || reportConfigs[0];
    var run = state.selectedScheduleRuleRunId ? getSelectedScheduleRuleRun() : getSelectedScheduleRecordRun();
    var isRuleRun = !!(run && run.ruleTask);
    var backAction = state.scheduleLogBackView === 'schedule-record-detail' ? 'back-schedule-record-detail' : 'back-schedule-records';
    var backText = state.scheduleLogBackView === 'schedule-record-detail' ? '返回执行详情' : '返回执行记录';
    var title = isRuleRun ? run.ruleTask : getScheduleTaskName(config);
    return '<section class="qir-main-panel qir-main-panel-full qir-schedule-log-panel">' +
      '<div class="qir-schedule-record-head">' +
        '<div><h3>执行日志</h3><p>' + escapeHtml(title) + ' / ' + escapeHtml(run.startAt) + '</p></div>' +
        '<button class="btn btn-outline btn-sm" type="button" data-qir-action="' + backAction + '"><i class="bi bi-arrow-left"></i><span>' + backText + '</span></button>' +
      '</div>' +
      '<div class="qir-schedule-log-view">' +
        '<div class="qir-schedule-log-header">' +
          '<div><h3>任务处理日志</h3><p>开始时间：' + escapeHtml(run.startAt) + '　完成时间：' + escapeHtml(run.endAt) + '</p></div>' +
          '<dl><dt>执行状态</dt><dd>' + renderConfigExecutionStatus(run.status) + '</dd><dt>调度周期</dt><dd>' + escapeHtml(run.cycle || getCycleText(config.cycle)) + '</dd><dt>耗时</dt><dd>' + escapeHtml(run.duration) + '</dd></dl>' +
        '</div>' +
        '<pre class="qir-schedule-tech-log">' + escapeHtml(getScheduleExecutionLog(run)) + '</pre>' +
      '</div>' +
    '</section>';
  }

  function renderConfigRows() {
    var rows = getVisibleConfigRows();
    var scheduleMode = isScheduleSection();
    if (!rows.length) {
      return '<tr class="qir-empty-row"><td colspan="' + (scheduleMode ? '8' : '7') + '">' + (scheduleMode ? '暂无匹配任务调度' : '暂无匹配稽查报告') + '</td></tr>';
    }
    return rows.map(function (item) {
      var configName = scheduleMode ? getScheduleTaskName(item) : item.name;
      var actionHtml = scheduleMode
        ? '<button class="qir-view-btn qir-run-link" type="button" data-qir-action="execute-config-once" data-id="' + escapeHtml(item.id) + '"><i class="bi bi-play-fill"></i><span>执行一次</span></button>' +
          '<button class="qir-view-btn" type="button" data-qir-action="open-schedule-records" data-id="' + escapeHtml(item.id) + '"><i class="bi bi-clock-history"></i><span>执行记录</span></button>' +
          '<button class="qir-view-btn" type="button" data-qir-action="template-placeholder" data-id="' + escapeHtml(item.id) + '"><i class="bi bi-pencil-square"></i><span>编辑</span></button>' +
          (item.status === '已启动'
          ? '<button class="qir-view-btn qir-warning-link" type="button" data-qir-action="stop-config" data-id="' + escapeHtml(item.id) + '"><i class="bi bi-pause-circle"></i><span>停止调度</span></button>'
          : '<button class="qir-view-btn qir-success-link" type="button" data-qir-action="start-config" data-id="' + escapeHtml(item.id) + '"><i class="bi bi-play-circle"></i><span>启动调度</span></button>') +
          '<button class="qir-view-btn qir-danger-link" type="button" data-qir-action="delete-config" data-id="' + escapeHtml(item.id) + '"><i class="bi bi-trash3"></i><span>删除</span></button>'
        : '<button class="qir-view-btn" type="button" data-qir-action="open-report-view" data-id="' + escapeHtml(item.id) + '"><i class="bi bi-file-earmark-text"></i><span>查看报告</span></button>' +
          '<button class="qir-view-btn" type="button" data-qir-action="open-history-list" data-id="' + escapeHtml(item.id) + '"><i class="bi bi-clock-history"></i><span>历史报告</span></button>';
      return '<tr>' +
        '<td>' + renderConfigNameCell(item, configName, scheduleMode) + '</td>' +
        '<td>' + renderConfigScope(item) + '</td>' +
        (scheduleMode ? '<td>' + renderConfigDataRange(item) + '</td>' : '') +
        (scheduleMode ? '<td>' + renderConfigStatus(item.status) + '</td>' : '') +
        (!scheduleMode ? '<td><div class="qir-config-desc" title="' + escapeHtml(item.desc) + '">' + escapeHtml(item.desc) + '</div></td>' : '') +
        (!scheduleMode ? '<td>' + renderRelatedScheduleTaskLink(item) + '</td>' : '') +
        '<td>' + renderConfigCycle(item.cycle) + '</td>' +
        (scheduleMode ? '<td>' + renderConfigExecutionStatus(getConfigExecutionStatus(item)) + '</td>' : '') +
        '<td>' + escapeHtml(item.lastGeneratedTime) + '</td>' +
        '<td><div class="qir-table-actions">' + actionHtml + '</div></td>' +
      '</tr>';
    }).join('');
  }

  function renderConfigTable() {
    var headHtml = isScheduleSection()
      ? '<tr><th>名称</th><th>统计范围</th><th>数据范围</th><th>状态</th><th>调度周期</th><th>最后执行状态</th><th>最后执行时间</th><th>操作</th></tr>'
      : '<tr><th>名称</th><th>统计范围</th><th>报告描述</th><th>关联任务</th><th>生成周期</th><th>最后生成时间</th><th>操作</th></tr>';
    return '<div class="qir-table-wrap qir-config-table-wrap">' +
      '<table class="ds-table qir-table qir-config-table ' + (isScheduleSection() ? 'qir-config-table-schedule' : 'qir-config-table-report') + '">' +
        '<thead>' + headHtml + '</thead>' +
        '<tbody>' + renderConfigRows() + '</tbody>' +
      '</table>' +
    '</div>';
  }

  function renderListTable() {
    var rows = getVisibleRows();
    return '<div class="qir-table-wrap">' +
      '<table class="ds-table qir-table qir-detail-list-table">' +
        '<thead><tr><th>表名称</th><th>所属数据源</th><th>规则数</th><th>平均通过率</th><th>问题记录数</th><th>最后执行时间</th><th>操作</th></tr></thead>' +
        '<tbody>' + (rows.length ? rows.map(function (item) {
          return '<tr>' +
            '<td><div class="qir-table-name"><b>' + escapeHtml(item.tableName) + '</b><span>' + escapeHtml(item.alias) + '</span></div></td>' +
            '<td>' + escapeHtml(item.dataSourceLabel) + '</td>' +
            '<td>' + escapeHtml(item.ruleCount) + '</td>' +
            '<td>' + renderRate(item.avgPassRate) + '</td>' +
            '<td><span class="qir-problem-count">' + escapeHtml(item.problemRecordCount) + '</span></td>' +
            '<td>' + escapeHtml(item.lastExecutionTime) + '</td>' +
            '<td><div class="qir-table-actions">' +
              '<button class="qir-view-btn" type="button" data-qir-action="open-detail" data-id="' + escapeHtml(item.id) + '" title="详情" aria-label="详情"><i class="bi bi-file-earmark-text"></i><span>详情</span></button>' +
              '<button class="qir-view-btn qir-export-link" type="button" data-qir-action="export-report" data-id="' + escapeHtml(item.id) + '" title="导出 Excel" aria-label="导出 Excel"><i class="bi bi-file-earmark-excel"></i><span>导出</span></button>' +
            '</div></td>' +
          '</tr>';
        }).join('') : '<tr class="qir-empty-row"><td colspan="7">暂无匹配稽查报告</td></tr>') +
        '</tbody>' +
      '</table>' +
    '</div>';
  }

  function renderPageNav(totalPages, current, attr) {
    var html = '<button type="button" ' + attr + '="prev"' + (current <= 1 ? ' disabled' : '') + '><i class="bi bi-chevron-left"></i></button>';
    var maxVisible = Math.min(totalPages, 7);
    for (var i = 1; i <= maxVisible; i++) {
      html += '<button type="button" ' + attr + '="' + i + '"' + (current === i ? ' class="active"' : '') + '>' + i + '</button>';
    }
    if (totalPages > 7) {
      html += '<span>...</span><button type="button" ' + attr + '="' + totalPages + '"' + (current === totalPages ? ' class="active"' : '') + '>' + totalPages + '</button>';
    }
    html += '<button type="button" ' + attr + '="next"' + (current >= totalPages ? ' disabled' : '') + '><i class="bi bi-chevron-right"></i></button>';
    return html;
  }

  function renderFooter() {
    var rows = getReportRows();
    var total = rows.length;
    var totalPages = clampPage(total);
    var start = total ? (state.page - 1) * state.pageSize + 1 : 0;
    var end = total ? Math.min(total, state.page * state.pageSize) : 0;
    return '<div class="qir-footer">' +
      '<div>显示第 ' + start + ' 到第 ' + end + ' 条记录，总共 ' + total + ' 条记录 每页显示 <select data-qir-page-size><option value="10"' + (state.pageSize === 10 ? ' selected' : '') + '>10</option><option value="20"' + (state.pageSize === 20 ? ' selected' : '') + '>20</option></select> 条记录</div>' +
      '<div class="qir-page-nav">' + renderPageNav(totalPages, state.page, 'data-qir-page') + '</div>' +
    '</div>';
  }

  function renderConfigFooter() {
    var rows = getConfigRows();
    var total = rows.length;
    var totalPages = clampConfigPage(total);
    var start = total ? (state.configPage - 1) * state.configPageSize + 1 : 0;
    var end = total ? Math.min(total, state.configPage * state.configPageSize) : 0;
    return '<div class="qir-footer">' +
      '<div>显示第 ' + start + ' 到第 ' + end + ' 条记录，总共 ' + total + ' 条记录 每页显示 <select data-qir-config-page-size><option value="10"' + (state.configPageSize === 10 ? ' selected' : '') + '>10</option><option value="20"' + (state.configPageSize === 20 ? ' selected' : '') + '>20</option></select> 条记录</div>' +
      '<div class="qir-page-nav">' + renderPageNav(totalPages, state.configPage, 'data-qir-config-page') + '</div>' +
    '</div>';
  }

  function renderListShell() {
    var scheduleMode = isScheduleSection();
    var leadingContent = isScheduleSection()
      ? '<div class="qir-toolbar-actions"><button class="btn btn-primary" type="button" data-qir-action="template-placeholder"><i class="bi bi-plus-lg"></i><span>新增</span></button></div>'
      : '<div class="qir-toolbar-title">稽查报告列表</div>';
    var scheduleQueryPrefix = scheduleMode
      ? '<span class="qir-query-label">状态</span><select class="qir-query-select" data-qir-config-status aria-label="状态查询"><option value="">全部</option><option value="已启动"' + (state.configStatus === '已启动' ? ' selected' : '') + '>已启动</option><option value="未启动"' + (state.configStatus === '未启动' ? ' selected' : '') + '>未启动</option></select>' +
        '<span class="qir-query-label qir-query-label-gap">最后执行状态</span><select class="qir-query-select qir-query-select-wide" data-qir-config-exec-status aria-label="最后执行状态查询"><option value="">全部</option><option value="执行成功"' + (state.configExecStatus === '执行成功' ? ' selected' : '') + '>执行成功</option><option value="执行中"' + (state.configExecStatus === '执行中' ? ' selected' : '') + '>执行中</option><option value="执行失败"' + (state.configExecStatus === '执行失败' ? ' selected' : '') + '>执行失败</option></select>' +
        '<span class="qir-query-label qir-query-label-gap">数据范围</span><select class="qir-query-select" data-qir-config-data-range-status aria-label="数据范围查询"><option value="">全部</option><option value="none"' + (state.configDataRangeStatus === 'none' ? ' selected' : '') + '>无配置</option><option value="configured"' + (state.configDataRangeStatus === 'configured' ? ' selected' : '') + '>已配置</option></select>'
      : '';
    var reportQueryPrefix = scheduleMode ? '' : renderRelatedTaskFilter();
    var queryPrefix = scheduleQueryPrefix + reportQueryPrefix;
    return '<section class="qir-main-panel qir-main-panel-full">' +
      '<div class="qir-toolbar">' + leadingContent + '<div class="qir-query-box">' + queryPrefix + '<span class="qir-query-label' + (queryPrefix ? ' qir-query-label-gap' : '') + '">名称</span><input type="text" data-qir-config-keyword value="' + escapeHtml(state.configKeyword) + '" placeholder="请输入名称/描述" aria-label="名称或描述查询"><button class="btn btn-primary" type="button" data-qir-action="query-config"><i class="bi bi-search"></i><span>查询</span></button></div></div>' +
      renderConfigTable() +
      renderConfigFooter() +
    '</section>' +
    (scheduleMode ? renderStartScheduleModal() : '');
  }

  function renderReportListShell() {
    var config = getSelectedReportConfig();
    return '<section class="qir-main-panel qir-main-panel-full qir-drill-panel">' +
      '<div class="qir-toolbar qir-drill-toolbar">' +
        '<div class="qir-toolbar-title qir-drill-title"><button class="btn btn-outline btn-sm" type="button" data-qir-action="back-summary"><i class="bi bi-arrow-left"></i><span>返回列表</span></button><div><span>' + escapeHtml(config ? config.name : '稽查报告详情') + '</span><em>当前报告包含的表级稽查明细</em></div></div>' +
        '<div class="qir-query-box qir-detail-query-box"><span class="qir-query-label">表名称</span><input type="text" data-qir-keyword value="' + escapeHtml(state.keyword) + '" placeholder="请输入表名称" aria-label="表名称模糊查询"><button class="btn btn-primary qir-query-btn" type="button" data-qir-action="query"><i class="bi bi-search"></i><span>查询</span></button><button class="btn btn-outline qir-query-export-btn" type="button" data-qir-action="export-detail-all"><i class="bi bi-file-zip"></i><span>全部导出</span></button></div>' +
      '</div>' +
      renderListTable() +
      renderFooter() +
    '</section>';
  }

  function renderReportViewTabs(activeTab) {
    var tabs = [
      { key: 'overview', label: '报告概述', icon: 'bi-file-earmark-richtext' },
      { key: 'data', label: '数据详情', icon: 'bi-table' }
    ];
    return '<div class="qir-report-tabs">' + tabs.map(function (tab) {
      return '<button class="' + (activeTab === tab.key ? 'active' : '') + '" type="button" data-qir-action="report-view-tab" data-tab="' + escapeHtml(tab.key) + '"><i class="bi ' + escapeHtml(tab.icon) + '"></i><span>' + escapeHtml(tab.label) + '</span></button>';
    }).join('') + '</div>';
  }

  function renderReportOverviewTab(config) {
    var previewData = getTemplatePreviewData(config || reportConfigs[0]);
    var toc = previewData.toc.replace('qir-preview-toc-item', 'qir-preview-toc-item active');
    return '<div class="qir-report-preview-embedded">' +
      '<aside class="qir-report-preview-toc">' +
        '<div class="qir-report-preview-toc-head"><i class="bi bi-list-ul"></i><span>报告目录</span></div>' +
        '<nav>' + toc + '</nav>' +
      '</aside>' +
      '<main class="qir-report-preview-stage">' +
        '<div class="qir-report-preview-page-wrap">' +
          '<article class="qir-template-page qir-report-preview-page" data-qir-report-preview-page style="zoom:' + (getReportPreviewZoomValue() / 100).toFixed(2) + '">' + previewData.html + '</article>' +
        '</div>' +
      '</main>' +
      renderReportPreviewZoomToolbar() +
    '</div>';
  }

  function renderReportDataTab() {
    return '<div class="qir-report-data-tab">' +
      '<div class="qir-toolbar qir-report-data-toolbar">' +
        '<div class="qir-toolbar-title">表级稽查数据</div>' +
        '<div class="qir-query-box qir-detail-query-box"><span class="qir-query-label">表名称</span><input type="text" data-qir-keyword value="' + escapeHtml(state.keyword) + '" placeholder="请输入表名称" aria-label="表名称模糊查询"><button class="btn btn-primary qir-query-btn" type="button" data-qir-action="query"><i class="bi bi-search"></i><span>查询</span></button><button class="btn btn-outline qir-query-export-btn" type="button" data-qir-action="export-detail-all"><i class="bi bi-file-zip"></i><span>全部导出</span></button></div>' +
      '</div>' +
      renderListTable() +
      renderFooter() +
    '</div>';
  }

  function renderReportViewShell() {
    var config = getSelectedReportConfig() || reportConfigs[0];
    var activeTab = state.reportViewTab === 'data' ? 'data' : 'overview';
    var tabContent = activeTab === 'data' ? renderReportDataTab(config) : renderReportOverviewTab(config);
    var overviewAction = activeTab === 'overview' ? '<button class="btn btn-primary btn-sm" type="button" data-qir-action="export-report-word"><i class="bi bi-file-earmark-word"></i><span>导出Word</span></button>' : '';
    return '<section class="qir-report-view-shell">' +
      '<div class="qir-report-view-topbar">' +
        renderReportViewTabs(activeTab) +
        '<div class="qir-report-view-actions">' + overviewAction + '<button class="btn btn-outline btn-sm" type="button" data-qir-action="back-summary"><i class="bi bi-arrow-left"></i><span>返回列表</span></button></div>' +
      '</div>' +
      '<div class="qir-report-view-body">' + tabContent + '</div>' +
    '</section>';
  }

  function renderQualityOverview(report) {
    var problemTotal = makeProblemRows(report).length;
    var failRate = Math.max(0.1, 100 - report.avgPassRate);
    var inspectionTotal = Math.max(problemTotal, Math.round(problemTotal / (failRate / 100)));
    var rules = getQualityRules(report);
    var weakRules = rules.filter(function (rule) { return rule.rate < 90; }).map(function (rule) {
      return rule.name + '（' + rule.field + '）';
    }).join('、');
    var overviewLines = [
      '<p><b>稽查对象：</b>' + escapeHtml(report.dataSourceLabel) + '/' + escapeHtml(report.tableName) + '（' + escapeHtml(report.alias) + '）</p>',
      '<p><b>稽查内容：</b>' + escapeHtml(weakRules || '关键字段完整性与业务一致性') + '。</p>',
      '<p><b>稽查结果：</b>最近执行时间 ' + escapeHtml(report.lastExecutionTime) + '，本次稽查记录总数 ' + escapeHtml(formatNumber(inspectionTotal)) + ' 条，问题记录数 ' + escapeHtml(formatNumber(problemTotal)) + ' 条，平均通过率 ' + report.avgPassRate.toFixed(1) + '%，本次共执行 ' + report.ruleCount + ' 条质量规则。</p>'
    ].join('');
    return '<section class="gt-quality-overview qir-quality-overview">' +
      '<div class="gt-quality-overview-text qir-overview-text"><h4>' + escapeHtml(report.alias) + '质量稽查概述</h4><div class="qir-overview-lines">' + overviewLines + '</div></div>' +
      '<div class="gt-quality-stat"><span>规则数</span><b>' + escapeHtml(report.ruleCount) + '</b></div>' +
      '<div class="gt-quality-stat"><span>平均通过率</span><b>' + escapeHtml(report.avgPassRate.toFixed(1)) + '%</b></div>' +
      '<div class="gt-quality-stat"><span>问题记录数</span><b>' + escapeHtml(formatNumber(problemTotal)) + '</b></div>' +
    '</section>';
  }

  function renderRuleProblemRows(report, rule) {
    var rows = getRuleProblemRows(report, rule.key);
    var fields = getInspectionFields(report);
    var current = getRulePage(rule.key, rows.length);
    var start = (current - 1) * state.rulePageSize;
    var visible = rows.slice(start, start + state.rulePageSize);
    if (!visible.length) {
      return '<tr class="gt-quality-empty-row"><td colspan="' + fields.length + '">未发现不符合规则的数据</td></tr>';
    }
    return visible.map(function (item) {
      var cells = fields.map(function (field) {
        var cls = field === item.issueField ? ' class="qir-issue-cell"' : '';
        return '<td' + cls + '>' + escapeHtml(item.values[field]) + '</td>';
      }).join('');
      return '<tr>' + cells + '</tr>';
    }).join('');
  }

  function renderRuleProblemHead(report, rule) {
    var fields = getInspectionFields(report);
    return '<tr>' + fields.map(function (field) {
      var cls = field === rule.field ? ' class="qir-issue-column-head"' : '';
      var tag = field === rule.field ? '<span class="qir-issue-column-tag">问题列</span>' : '';
      return '<th' + cls + '><span>' + escapeHtml(field) + '</span>' + tag + '</th>';
    }).join('') + '</tr>';
  }

  function renderRuleProblemFooter(report, rule) {
    var rows = getRuleProblemRows(report, rule.key);
    var total = rows.length;
    var current = getRulePage(rule.key, total);
    var totalPages = Math.max(1, Math.ceil(total / state.rulePageSize));
    var start = total ? (current - 1) * state.rulePageSize + 1 : 0;
    var end = total ? Math.min(total, current * state.rulePageSize) : 0;
    return '<div class="qir-rule-footer">' +
      '<span>显示第 ' + start + ' 到第 ' + end + ' 条记录，总共 ' + total + ' 条记录 每页显示 <select data-qir-rule-page-size><option value="5"' + (state.rulePageSize === 5 ? ' selected' : '') + '>5</option><option value="10"' + (state.rulePageSize === 10 ? ' selected' : '') + '>10</option><option value="20"' + (state.rulePageSize === 20 ? ' selected' : '') + '>20</option></select> 条记录</span>' +
      '<div class="qir-page-nav">' + renderRulePageNav(totalPages, current, rule.key) + '</div>' +
    '</div>';
  }

  function renderRulePageNav(totalPages, current, ruleKey) {
    var html = '<button type="button" data-qir-rule-page="prev" data-rule-key="' + escapeHtml(ruleKey) + '"' + (current <= 1 ? ' disabled' : '') + '><i class="bi bi-chevron-left"></i></button>';
    var maxVisible = Math.min(totalPages, 5);
    for (var i = 1; i <= maxVisible; i++) {
      html += '<button type="button" data-qir-rule-page="' + i + '" data-rule-key="' + escapeHtml(ruleKey) + '"' + (current === i ? ' class="active"' : '') + '>' + i + '</button>';
    }
    if (totalPages > 5) {
      html += '<span>...</span><button type="button" data-qir-rule-page="' + totalPages + '" data-rule-key="' + escapeHtml(ruleKey) + '"' + (current === totalPages ? ' class="active"' : '') + '>' + totalPages + '</button>';
    }
    html += '<button type="button" data-qir-rule-page="next" data-rule-key="' + escapeHtml(ruleKey) + '"' + (current >= totalPages ? ' disabled' : '') + '><i class="bi bi-chevron-right"></i></button>';
    return html;
  }

  function renderQualitySections(report) {
    return getQualityRules(report).map(function (rule) {
      return '<section class="gt-quality-report-section qir-quality-section">' +
        '<div class="gt-quality-section-head"><div class="qir-quality-section-main"><h4>' + escapeHtml(rule.name) + '</h4>' + renderRuleSummary(rule) + '</div>' + renderRate(rule.rate) + '</div>' +
        '<div class="qir-rule-table-wrap"><table class="ds-table gt-quality-problem-table qir-rule-problem-table">' +
          '<thead>' + renderRuleProblemHead(report, rule) + '</thead>' +
          '<tbody>' + renderRuleProblemRows(report, rule) + '</tbody>' +
        '</table></div>' +
        renderRuleProblemFooter(report, rule) +
      '</section>';
    }).join('');
  }

  function renderDetailShell() {
    var report = getSelectedReport();
    return '<section class="dqit-form-shell dqit-report-shell qir-detail-shell">' +
      '<div class="ms-detail-header qir-detail-header">' +
        '<div class="qir-detail-titlebar"><button class="btn btn-outline btn-sm" type="button" data-qir-action="back-list"><i class="bi bi-arrow-left"></i><span>返回列表</span></button><span class="ms-detail-title">' + escapeHtml(report.tableName) + ' - ' + escapeHtml(report.alias) + '质量报告</span></div>' +
        '<button class="btn btn-primary btn-sm qir-export-btn" type="button" data-qir-action="export-report" data-id="' + escapeHtml(report.id) + '"><i class="bi bi-file-earmark-excel"></i><span>导出 Excel</span></button>' +
      '</div>' +
      '<div class="ms-detail-body qir-detail-scroll">' +
        '<div class="gt-quality-report qir-quality-report">' + renderQualityOverview(report) + renderQualitySections(report) + '</div>' +
      '</div>' +
    '</section>';
  }

  function restoreTemplateDashboardInsertPosition() {
    if (!pageEl || state.view !== 'template') return;
    var target = pageEl.querySelector('[data-qir-dashboard-scroll-target]');
    if (!target) return;
    window.setTimeout(function () {
      if (!pageEl || !pageEl.contains(target)) return;
      target.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'nearest' });
      target.removeAttribute('data-qir-dashboard-scroll-target');
      var editor = getTemplateEditorEl();
      if (editor) {
        state.templateEditorHtml = getTemplateEditorSerializableHtml(editor);
      }
    }, 0);
  }

  function renderAll() {
    if (!pageEl) return;
    disposeTemplatePieCharts();
    pageEl.classList.toggle('detail-mode', state.view === 'detail');
    pageEl.classList.toggle('template-mode', state.view === 'template');
    pageEl.classList.toggle('report-view-mode', state.view === 'report-view');
    pageEl.classList.toggle('history-mode', state.view === 'history-list');
    pageEl.classList.toggle('schedule-record-mode', state.view === 'schedule-records');
    pageEl.classList.toggle('schedule-record-detail-mode', state.view === 'schedule-record-detail');
    pageEl.classList.toggle('schedule-log-mode', state.view === 'schedule-log');
    if (state.view === 'detail') {
      pageEl.innerHTML = renderDetailShell();
    } else if (state.view === 'report-view') {
      pageEl.innerHTML = renderReportViewShell();
    } else if (state.view === 'history-list') {
      pageEl.innerHTML = renderHistoryListShell();
    } else if (state.view === 'schedule-records') {
      pageEl.innerHTML = renderScheduleRecordShell();
    } else if (state.view === 'schedule-record-detail') {
      pageEl.innerHTML = renderScheduleRecordDetailShell();
    } else if (state.view === 'schedule-log') {
      pageEl.innerHTML = renderScheduleLogShell();
    } else if (state.view === 'report-list') {
      pageEl.innerHTML = renderReportListShell();
    } else if (state.view === 'template') {
      pageEl.innerHTML = renderTemplateShell();
    } else {
      pageEl.innerHTML = renderListShell();
    }
    initTemplatePieCharts(pageEl);
    restoreTemplateDashboardInsertPosition();
  }

  function applyConfigQueryFromDom(keywordValue) {
    var configInput = pageEl.querySelector('[data-qir-config-keyword]');
    var configStatus = pageEl.querySelector('[data-qir-config-status]');
    var configExecStatus = pageEl.querySelector('[data-qir-config-exec-status]');
    var configDataRangeStatus = pageEl.querySelector('[data-qir-config-data-range-status]');
    state.configKeyword = keywordValue != null ? String(keywordValue).trim() : (configInput ? configInput.value.trim() : '');
    state.configStatus = configStatus ? configStatus.value : '';
    state.configExecStatus = configExecStatus ? configExecStatus.value : '';
    state.configDataRangeStatus = configDataRangeStatus ? configDataRangeStatus.value : '';
    state.relatedTaskDropdownOpen = false;
    state.relatedTaskKeyword = '';
    state.editingConfigNameId = '';
    state.configPage = 1;
    renderAll();
  }

  function focusConfigNameInput() {
    window.setTimeout(function () {
      var input = pageEl ? pageEl.querySelector('[data-qir-config-name-input]') : null;
      if (!input) return;
      input.focus();
      input.select();
    }, 0);
  }

  function saveConfigNameFromInput(input, options) {
    if (!input) return;
    var rowId = input.getAttribute('data-id') || '';
    var config = getEditableReportConfigById(rowId);
    if (!config) {
      state.editingConfigNameId = '';
      return;
    }
    var nextName = input.value.trim() || config.name || '未命名稽查报告';
    var changed = nextName !== config.name;
    config.name = nextName;
    config.nameEdited = true;
    state.editingConfigNameId = '';
    if (!options || options.render !== false) renderAll();
    if (changed) showToast('报告名称已保存');
  }

  function activateScheduleMenu() {
    var scheduleLink = document.querySelector('[data-menu="quality-inspect-schedule"]');
    if (!scheduleLink) return;
    var parent = scheduleLink.closest('.menu-item.has-sub');
    if (parent) parent.classList.add('open');
    if (window.DP && typeof DP.setActiveMenu === 'function') {
      DP.setActiveMenu(scheduleLink);
    } else {
      scheduleLink.classList.add('active');
    }
  }

  function openRelatedSchedule(id) {
    var config = getReportConfigById(id);
    if (!config) return;
    var taskName = getScheduleTaskName(config);
    if (window.DP && typeof DP.showPage === 'function') {
      activateScheduleMenu();
      DP.showPage('quality-inspect-schedule', { configKeyword: taskName });
      showToast('已跳转任务调度并按关联任务过滤');
      return;
    }
    state.section = 'schedule';
    state.configKeyword = taskName;
    state.configStatus = '';
    state.configExecStatus = '';
    state.configDataRangeStatus = '';
    state.configPage = 1;
    state.view = 'list';
    renderAll();
  }

  function applyScheduleRecordQueryFromDom() {
    var statusInput = pageEl.querySelector('[data-qir-schedule-record-status]');
    var startDateInput = pageEl.querySelector('[data-qir-schedule-start-date]');
    var endDateInput = pageEl.querySelector('[data-qir-schedule-end-date]');
    state.scheduleRecordStatus = statusInput ? statusInput.value : '';
    state.scheduleRecordStartDate = startDateInput ? startDateInput.value : '';
    state.scheduleRecordEndDate = endDateInput ? endDateInput.value : '';
    state.scheduleRecordPage = 1;
    state.scheduleDetailPage = 1;
    state.selectedScheduleRunId = '';
    state.selectedScheduleRuleRunId = '';
    state.scheduleLogBackView = 'schedule-records';
    state.scheduleSqlModalOpen = false;
    renderAll();
  }

  function applyScheduleDetailQueryFromDom() {
    var statusInput = pageEl.querySelector('[data-qir-schedule-detail-status]');
    var taskInput = pageEl.querySelector('[data-qir-schedule-detail-task]');
    var tableInput = pageEl.querySelector('[data-qir-schedule-detail-table]');
    state.scheduleDetailStatus = statusInput ? statusInput.value : '';
    state.scheduleDetailTaskKeyword = taskInput ? taskInput.value.trim() : '';
    state.scheduleDetailTableKeyword = tableInput ? tableInput.value.trim() : '';
    state.scheduleDetailPage = 1;
    state.selectedScheduleRuleRunId = '';
    state.scheduleSqlModalOpen = false;
    renderAll();
  }

  function updateScheduleRunStatus(actionEl, status) {
    var runId = actionEl.getAttribute('data-run-id') || '';
    var run = getAllScheduleRecordRows().filter(function (item) { return item.id === runId; })[0];
    if (!run) return;
    var nowText = formatDateTime(new Date());
    var override = {
      status: status,
      endAt: status === '执行中' ? '-' : nowText,
      duration: status === '执行中' ? '0秒' : run.duration
    };
    if (status === '执行中') {
      override.startAt = nowText;
    }
    state.scheduleRunOverrides[getScheduleRunOverrideKey(run.configId, run.id)] = override;
    state.selectedScheduleRunId = run.id;
    state.selectedScheduleRuleRunId = '';
    state.scheduleDetailPage = 1;
    renderAll();
    showToast(status === '执行中' ? '执行记录已重新提交' : '执行记录已停止');
  }

  function stopScheduleRuleRun(actionEl) {
    var runId = actionEl.getAttribute('data-run-id') || '';
    var ruleRunId = actionEl.getAttribute('data-rule-run-id') || '';
    var run = getAllScheduleRecordRows().filter(function (item) { return item.id === runId; })[0] || getSelectedScheduleRecordRun();
    if (!ruleRunId || !run) return;
    state.scheduleRuleOverrides[getScheduleRuleOverrideKey(run.configId, ruleRunId)] = {
      status: '执行失败',
      endAt: formatDateTime(new Date())
    };
    state.selectedScheduleRunId = run.id;
    state.selectedScheduleRuleRunId = '';
    renderAll();
    showToast('规则任务已停止');
  }

  function bindEvents() {
    pageEl.addEventListener('mousedown', function (e) {
      var insertBtn = e.target.closest('[data-qir-action="open-template-dashboard-modal"]');
      if (insertBtn && pageEl.contains(insertBtn)) {
        placeTemplateDashboardInsertMarker();
        e.preventDefault();
        return;
      }
      var editor = getTemplateEditorEl();
      var templateToken = e.target.closest('.qir-variable-token, .qir-template-token');
      if (templateToken && editor && editor.contains(templateToken)) {
        e.preventDefault();
      }
    });

    pageEl.addEventListener('dblclick', function (e) {
      var variableBtn = e.target.closest('[data-qir-template-variable-name]');
      if (variableBtn && pageEl.contains(variableBtn)) {
        e.preventDefault();
        insertTemplateVariableAtCursor(variableBtn.getAttribute('data-qir-template-variable-name') || '');
      }
    });

    pageEl.addEventListener('click', function (e) {
      var clickedRelatedTaskSelect = !!e.target.closest('[data-qir-related-task-select]');
      var actionEl = e.target.closest('[data-qir-action]');
      if (actionEl && pageEl.contains(actionEl)) {
        var action = actionEl.getAttribute('data-qir-action');
        var key = actionEl.getAttribute('data-key') || '';
        if (action === 'toggle-tree') {
          state.treeOpen[key] = !state.treeOpen[key];
          renderAll();
        } else if (action === 'select-tree') {
          state.treeKey = key || state.treeKey;
          state.page = 1;
          renderAll();
        } else if (action === 'query-config') {
          applyConfigQueryFromDom();
        } else if (action === 'edit-config-name') {
          state.editingConfigNameId = actionEl.getAttribute('data-id') || '';
          state.relatedTaskDropdownOpen = false;
          state.relatedTaskKeyword = '';
          renderAll();
          focusConfigNameInput();
        } else if (action === 'open-related-schedule') {
          openRelatedSchedule(actionEl.getAttribute('data-id') || '');
        } else if (action === 'toggle-related-task-filter') {
          state.relatedTaskDropdownOpen = !state.relatedTaskDropdownOpen;
          state.relatedTaskKeyword = '';
          renderAll();
          var relatedSearch = pageEl.querySelector('[data-qir-related-task-search]');
          if (relatedSearch) relatedSearch.focus();
          return;
        } else if (action === 'choose-related-task-filter') {
          state.relatedTaskFilter = actionEl.getAttribute('data-value') || '';
          state.relatedTaskDropdownOpen = false;
          state.relatedTaskKeyword = '';
          state.configPage = 1;
          renderAll();
          return;
        } else if (action === 'query-schedule-records') {
          applyScheduleRecordQueryFromDom();
        } else if (action === 'query-schedule-detail') {
          applyScheduleDetailQueryFromDom();
        } else if (action === 'query') {
          var input = pageEl.querySelector('[data-qir-keyword]');
          state.keyword = input ? input.value.trim() : '';
          state.page = 1;
          renderAll();
        } else if (action === 'tree-search') {
          var treeInput = pageEl.querySelector('[data-qir-tree-search]');
          state.treeKeyword = treeInput ? treeInput.value.trim() : '';
          renderAll();
        } else if (action === 'query-template-scope') {
          var scopeInput = pageEl.querySelector('[data-qir-template-scope-keyword]');
          state.templateScopeKeyword = scopeInput ? scopeInput.value.trim() : '';
          state.templateScopePage = 1;
          clearTemplateScopeSelection();
          renderAll();
        } else if (action === 'open-report-view' || action === 'open-report-list') {
          state.selectedConfigId = actionEl.getAttribute('data-id') || '';
          state.selectedReportId = '';
          state.keyword = '';
          state.page = 1;
          state.reportPreviewZoom = 100;
          state.reportViewTab = action === 'open-report-list' ? 'data' : 'overview';
          state.view = 'report-view';
          renderAll();
        } else if (action === 'open-history-list') {
          state.selectedConfigId = actionEl.getAttribute('data-id') || '';
          state.selectedReportId = '';
          state.historyPage = 1;
          state.view = 'history-list';
          renderAll();
        } else if (action === 'open-schedule-records') {
          state.selectedConfigId = actionEl.getAttribute('data-id') || '';
          state.selectedScheduleRunId = '';
          state.selectedScheduleRuleRunId = '';
          state.scheduleLogBackView = 'schedule-records';
          state.scheduleRecordStartDate = '';
          state.scheduleRecordEndDate = '';
          state.scheduleRecordStatus = '';
          state.scheduleDetailStatus = '';
          state.scheduleDetailTaskKeyword = '';
          state.scheduleDetailTableKeyword = '';
          state.scheduleRecordPage = 1;
          state.scheduleDetailPage = 1;
          state.scheduleSqlModalOpen = false;
          state.scheduleSql = { theme: 'dark', font: '14px', searchOpen: false };
          state.view = 'schedule-records';
          renderAll();
        } else if (action === 'open-history-report') {
          openHistoryReportView(actionEl.getAttribute('data-id') || '');
        } else if (action === 'report-view-tab') {
          state.reportViewTab = actionEl.getAttribute('data-tab') === 'data' ? 'data' : 'overview';
          renderAll();
        } else if (action === 'template-manage-tab') {
          saveTemplateEditorContent();
          var targetManageTab = actionEl.getAttribute('data-tab') || 'template';
          state.templateManageTab = targetManageTab === 'scope' || targetManageTab === 'filter' ? targetManageTab : 'template';
          state.templateDashboardModalOpen = false;
          state.templateCopyModalOpen = false;
          state.templateCopyTargetGroupId = '';
          state.templateScheduleModalOpen = false;
          state.templateScheduleDraft = null;
          state.templateScopeModalOpen = false;
          state.templateFilterModalOpen = false;
          state.templateFilterModalDraft = null;
          renderAll();
        } else if (action === 'template-placeholder') {
          var templateId = actionEl.getAttribute('data-id') || '';
          if (!templateId) {
            var newConfig = createNewTemplateConfig();
            templateId = newConfig.id;
            state.configPage = 1;
          }
          state.selectedConfigId = templateId;
          state.templateZoom = 100;
          state.templateNameEditing = !actionEl.getAttribute('data-id');
          state.templateDescEditing = false;
          state.templateVariableKeyword = '';
          state.templateManageTab = 'template';
          state.templateEditTarget = 'common';
          state.templateEditGroupId = '';
          state.templateCopyModalOpen = false;
          state.templateCopyTargetGroupId = '';
          state.templateScopeKeyword = '';
          state.templateScopePage = 1;
          state.templateScopeSelected = {};
          state.templateScopeModalOpen = false;
          state.templateScopeModalKeyword = '';
          state.templateScopeModalTreeKey = 'all';
          state.templateScopeModalSelected = {};
          state.templateFilterKeyword = '';
          state.templateFilterActiveGroupId = '';
          state.templateFilterModalOpen = false;
          state.templateFilterModalGroupId = '';
          state.templateFilterModalRowId = '';
          state.templateFilterModalMode = 'visual';
          state.templateFilterModalDraft = null;
          state.templateFilterFieldKeyword = '';
          state.templateFilterSql = { theme: 'dark', font: '14px', searchOpen: false };
          state.templateFilterPages = {};
          state.templateFilterPageSizes = {};
          state.templateVariableCollapsed = false;
          state.templateOutlineCollapsed = false;
          state.templateScheduleModalOpen = false;
          state.templateScheduleDraft = null;
          state.view = 'template';
          loadTemplateEditorContent(getSelectedReportConfig() || reportConfigs[0], 'common');
          renderAll();
          if (state.templateNameEditing) {
            window.setTimeout(function () {
              var nameInput = pageEl ? pageEl.querySelector('[data-qir-template-name-input]') : null;
              if (nameInput) {
                nameInput.focus();
                nameInput.select();
              }
            }, 0);
          }
        } else if (action === 'edit-template-name') {
          state.templateNameEditing = true;
          state.templateDescEditing = false;
          renderAll();
          window.setTimeout(function () {
            var editNameInput = pageEl ? pageEl.querySelector('[data-qir-template-name-input]') : null;
            if (editNameInput) {
              editNameInput.focus();
              editNameInput.select();
            }
          }, 0);
        } else if (action === 'edit-template-desc') {
          state.templateDescEditing = true;
          state.templateNameEditing = false;
          renderAll();
          window.setTimeout(function () {
            var editDescInput = pageEl ? pageEl.querySelector('[data-qir-template-desc-input]') : null;
            if (editDescInput) {
              editDescInput.focus();
              editDescInput.select();
            }
          }, 0);
        } else if (action === 'set-template-mode') {
          saveTemplateEditorContent();
          var mode = actionEl.getAttribute('data-mode') || 'common';
          var modeConfig = getSelectedReportConfig() || reportConfigs[0];
          if (mode === 'group' && !getTemplateFilterGroups(modeConfig).length) {
            showToast('请先在数据过滤中新增分组');
          } else {
            setTemplateApplyMode(modeConfig, mode);
            if (mode === 'group') {
              loadFirstTemplateGroupEditor(modeConfig);
            } else {
              loadTemplateEditorContent(modeConfig, 'common');
              state.templateCopyModalOpen = false;
              state.templateCopyTargetGroupId = '';
            }
            renderAll();
            showToast(mode === 'group' ? '已启用按数据过滤分组配置模板' : '已切换为通用模板');
          }
        } else if (action === 'template-zoom-out') {
          setTemplateZoom(getTemplateZoomValue() - templateZoomStep);
        } else if (action === 'template-zoom-in') {
          setTemplateZoom(getTemplateZoomValue() + templateZoomStep);
        } else if (action === 'template-zoom-reset') {
          setTemplateZoom(100);
        } else if (action === 'report-preview-zoom-out') {
          setReportPreviewZoom(getReportPreviewZoomValue() - templateZoomStep);
        } else if (action === 'report-preview-zoom-in') {
          setReportPreviewZoom(getReportPreviewZoomValue() + templateZoomStep);
        } else if (action === 'report-preview-zoom-reset') {
          setReportPreviewZoom(100);
        } else if (action === 'toggle-template-variable-panel') {
          saveTemplateEditorContent();
          state.templateVariableCollapsed = !state.templateVariableCollapsed;
          renderAll();
        } else if (action === 'toggle-template-outline-panel') {
          saveTemplateEditorContent();
          state.templateOutlineCollapsed = !state.templateOutlineCollapsed;
          renderAll();
        } else if (action === 'open-template-schedule-modal') {
          saveTemplateEditorContent();
          state.templateDashboardModalOpen = false;
          state.templateCopyModalOpen = false;
          state.startScheduleModalOpen = false;
          state.startScheduleConfigId = '';
          state.templateScheduleModalOpen = true;
          state.templateScheduleDraft = createTemplateScheduleDraft(getSelectedReportConfig() || reportConfigs[0]);
          renderAll();
        } else if (action === 'close-template-schedule-modal') {
          state.templateScheduleModalOpen = false;
          state.templateScheduleDraft = null;
          renderAll();
        } else if (action === 'template-schedule-save') {
          applyTemplateScheduleDraft();
        } else if (action === 'close-start-schedule-modal') {
          state.startScheduleModalOpen = false;
          state.startScheduleConfigId = '';
          state.templateScheduleDraft = null;
          renderAll();
        } else if (action === 'confirm-start-schedule') {
          applyStartScheduleDraft();
        } else if (action === 'open-template-copy-modal') {
          openTemplateCopyModal();
        } else if (action === 'close-template-copy-modal') {
          state.templateCopyModalOpen = false;
          state.templateCopyTargetGroupId = '';
          renderAll();
        } else if (action === 'confirm-template-copy') {
          confirmTemplateCopy();
        } else if (action === 'template-preview') {
          openTemplatePreview();
        } else if (action === 'template-back-list') {
          saveTemplateEditorContent();
          state.view = 'list';
          state.selectedConfigId = '';
          state.selectedReportId = '';
          state.templateNameEditing = false;
          state.templateDescEditing = false;
          state.templateEditTarget = 'common';
          state.templateEditGroupId = '';
          state.templateDashboardModalOpen = false;
          state.templateCopyModalOpen = false;
          state.templateCopyTargetGroupId = '';
          state.templateScheduleModalOpen = false;
          state.startScheduleModalOpen = false;
          state.startScheduleConfigId = '';
          state.templateScheduleDraft = null;
          state.templateScopeModalOpen = false;
          state.templateScopeModalSelected = {};
          state.templateFilterModalOpen = false;
          state.templateFilterModalDraft = null;
          renderAll();
        } else if (action === 'template-save') {
          saveTemplateConfig();
        } else if (action === 'open-template-dashboard-modal') {
          if (!state.templateEditorHtml || state.templateEditorHtml.indexOf(templateDashboardInsertMarker) < 0) {
            placeTemplateDashboardInsertMarker();
          }
          state.templateDashboardModalOpen = true;
          state.templateCopyModalOpen = false;
          state.templateDashboardKeyword = '';
          state.templateDashboardFilter = 'all';
          state.templateDashboardPage = 1;
          state.templateDashboardSelected = {};
          renderAll();
        } else if (action === 'close-template-dashboard-modal') {
          removeTemplateDashboardInsertMarker();
          state.templateDashboardModalOpen = false;
          renderAll();
        } else if (action === 'template-dashboard-filter') {
          saveTemplateEditorContent();
          state.templateDashboardFilter = actionEl.getAttribute('data-filter') || 'all';
          state.templateDashboardPage = 1;
          renderAll();
        } else if (action === 'template-dashboard-toggle') {
          saveTemplateEditorContent();
          var dashboardId = actionEl.getAttribute('data-id') || '';
          if (dashboardId) {
            state.templateDashboardSelected[dashboardId] = !state.templateDashboardSelected[dashboardId];
          }
          renderAll();
        } else if (action === 'template-dashboard-page') {
          saveTemplateEditorContent();
          var dashboardRows = getTemplateDashboardRows();
          var dashboardPages = Math.max(1, Math.ceil(dashboardRows.length / templateDashboardPageSize));
          var dashboardTarget = actionEl.getAttribute('data-page');
          if (dashboardTarget === 'prev') state.templateDashboardPage = Math.max(1, state.templateDashboardPage - 1);
          else if (dashboardTarget === 'next') state.templateDashboardPage = Math.min(dashboardPages, state.templateDashboardPage + 1);
          else state.templateDashboardPage = Number(dashboardTarget) || 1;
          renderAll();
        } else if (action === 'template-dashboard-confirm') {
          var selectedCount = getTemplateDashboardSelectedCount();
          if (!selectedCount) {
            showToast('请先选择仪表盘');
          } else {
            actionEl.disabled = true;
            var insertedCount = insertSelectedTemplateDashboards();
            state.templateDashboardModalOpen = false;
            state.templateDashboardSelected = {};
            renderAll();
            showToast('已插入 ' + insertedCount + ' 个仪表盘');
          }
        } else if (action === 'template-outline-jump') {
          jumpToTemplateOutlineSection(actionEl);
        } else if (action === 'template-action-placeholder') {
          showToast('编辑功能后续设计');
        } else if (action === 'template-scope-add') {
          state.templateScopeModalOpen = true;
          state.templateScopeModalTreeKey = 'all';
          state.templateScopeModalKeyword = '';
          state.templateScopeModalSelected = {};
          renderAll();
        } else if (action === 'close-template-scope-modal') {
          closeTemplateScopeModal();
        } else if (action === 'query-template-scope-modal') {
          var modalKeywordInput = pageEl.querySelector('[data-qir-template-scope-modal-keyword]');
          state.templateScopeModalKeyword = modalKeywordInput ? modalKeywordInput.value.trim() : '';
          state.templateScopeModalSelected = {};
          renderAll();
        } else if (action === 'toggle-template-scope-tree') {
          state.treeOpen[key] = !state.treeOpen[key];
          renderAll();
        } else if (action === 'select-template-scope-tree') {
          state.templateScopeModalTreeKey = key || 'all';
          state.templateScopeModalSelected = {};
          renderAll();
        } else if (action === 'template-scope-modal-confirm') {
          addTemplateScopeRowsFromModal();
        } else if (action === 'template-scope-remove') {
          var removeId = actionEl.getAttribute('data-id') || '';
          if (removeId) removeTemplateScopeRows([removeId]);
        } else if (action === 'template-scope-remove-selected') {
          var selectedIds = Object.keys(state.templateScopeSelected || {}).filter(function (id) {
            return !!state.templateScopeSelected[id];
          });
          if (selectedIds.length) removeTemplateScopeRows(selectedIds);
        } else if (action === 'template-filter-create' || action === 'template-filter-add-group') {
          var createdFilterGroup = createTemplateFilterGroup(getSelectedReportConfig() || reportConfigs[0]);
          renderAll();
          window.setTimeout(function () {
            var createdGroupEl = pageEl ? pageEl.querySelector('[data-qir-template-filter-group-id="' + createdFilterGroup.id + '"]') : null;
            if (createdGroupEl) {
              createdGroupEl.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
            }
          }, 0);
        } else if (action === 'template-filter-edit-group') {
          var editGroup = getTemplateFilterGroupById(actionEl.getAttribute('data-group-id') || '');
          if (editGroup) {
            var editField = actionEl.getAttribute('data-field') === 'desc' ? 'desc' : 'name';
            editGroup.editing = false;
            editGroup.editingField = editField;
            renderAll();
            window.setTimeout(function () {
              var editSelector = editField === 'desc' ? '[data-qir-template-filter-group-desc]' : '[data-qir-template-filter-group-name]';
              var editGroupInput = pageEl ? pageEl.querySelector('[data-group-id="' + editGroup.id + '"]' + editSelector) : null;
              if (editGroupInput) {
                editGroupInput.focus();
                editGroupInput.select();
              }
            }, 0);
          }
        } else if (action === 'template-filter-delete-group') {
          deleteTemplateFilterGroup(actionEl.getAttribute('data-group-id') || '');
        } else if (action === 'query-template-filter') {
          var filterGroupEl = actionEl.closest('.qir-template-filter-group');
          var filterInput = filterGroupEl ? filterGroupEl.querySelector('[data-qir-template-filter-keyword]') : pageEl.querySelector('[data-qir-template-filter-keyword]');
          state.templateFilterKeyword = filterInput ? filterInput.value.trim() : '';
          Object.keys(state.templateFilterPages || {}).forEach(function (groupId) {
            state.templateFilterPages[groupId] = 1;
          });
          renderAll();
        } else if (action === 'template-filter-edit-row') {
          openTemplateFilterModal(actionEl.getAttribute('data-group-id') || '', actionEl.getAttribute('data-row-id') || '');
        } else if (action === 'template-filter-clear-row') {
          clearTemplateFilterRow(actionEl.getAttribute('data-group-id') || '', actionEl.getAttribute('data-row-id') || '');
        } else if (action === 'close-template-filter-modal') {
          closeTemplateFilterModal();
        } else if (action === 'template-filter-modal-tab') {
          var nextFilterModalMode = actionEl.getAttribute('data-mode') === 'sql' ? 'sql' : 'visual';
          var nextFilterDraft = captureTemplateFilterModalDraft();
          if (nextFilterModalMode === 'sql' && state.templateFilterModalMode !== 'sql') {
            nextFilterDraft.sql = buildTemplateFilterConditionFromDraft(nextFilterDraft);
            state.templateFilterModalDraft = nextFilterDraft;
          }
          state.templateFilterModalMode = nextFilterModalMode;
          renderAll();
        } else if (action === 'template-filter-modal-save') {
          saveTemplateFilterModal();
        } else if (action === 'template-filter-pick-field') {
          var pickedField = actionEl.getAttribute('data-field') || '';
          var pickedDraft = captureTemplateFilterModalDraft();
          if (pickedField) {
            pickedDraft.field = pickedField;
            pickedDraft.sql = pickedField + ' = ';
            state.templateFilterModalDraft = pickedDraft;
            renderAll();
          }
        } else if (action === 'format-template-filter-sql') {
          var filterSqlContent = pageEl.querySelector('[data-qir-template-filter-sql-content]');
          var filterSqlGutter = pageEl.querySelector('[data-qir-template-filter-sql-gutter]');
          if (filterSqlContent) {
            var formattedFilterSql = formatSqlText(filterSqlContent.textContent || '');
            filterSqlContent.innerHTML = highlightSQL(formattedFilterSql);
            if (filterSqlGutter) filterSqlGutter.innerHTML = lineNumbers(formattedFilterSql);
            captureTemplateFilterModalDraft();
            showToast('SQL 已格式化');
          }
        } else if (action === 'copy-template-filter-sql') {
          var filterCopyContent = pageEl.querySelector('[data-qir-template-filter-sql-content]');
          var filterCopyText = filterCopyContent ? filterCopyContent.textContent : '';
          function filterCopied() { showToast('SQL 已复制'); }
          if (navigator.clipboard && filterCopyText) navigator.clipboard.writeText(filterCopyText).then(filterCopied).catch(function () { showToast('复制失败'); });
          else showToast(filterCopyText ? '请手动复制SQL' : '暂无可复制SQL');
        } else if (action === 'toggle-template-filter-sql-search') {
          captureTemplateFilterModalDraft();
          state.templateFilterSql.searchOpen = !state.templateFilterSql.searchOpen;
          renderAll();
        } else if (action === 'close-template-filter-sql-search') {
          captureTemplateFilterModalDraft();
          state.templateFilterSql.searchOpen = false;
          renderAll();
        } else if (action === 'open-detail') {
          state.selectedReportId = actionEl.getAttribute('data-id') || '';
          state.view = 'detail';
          state.rulePages = {};
          renderAll();
        } else if (action === 'back-list') {
          state.view = state.selectedConfigId ? 'report-view' : 'list';
          if (state.selectedConfigId) state.reportViewTab = 'data';
          state.rulePages = {};
          renderAll();
        } else if (action === 'back-schedule-records') {
          state.view = 'schedule-records';
          state.selectedScheduleRuleRunId = '';
          state.scheduleLogBackView = 'schedule-records';
          state.scheduleSqlModalOpen = false;
          renderAll();
        } else if (action === 'back-schedule-record-detail') {
          state.view = 'schedule-record-detail';
          state.scheduleLogBackView = 'schedule-record-detail';
          state.scheduleSqlModalOpen = false;
          renderAll();
        } else if (action === 'back-summary') {
          state.view = 'list';
          state.selectedConfigId = '';
          state.selectedReportId = '';
          state.selectedScheduleRunId = '';
          state.selectedScheduleRuleRunId = '';
          state.scheduleLogBackView = 'schedule-records';
          state.keyword = '';
          state.page = 1;
          state.historyPage = 1;
          state.scheduleRecordPage = 1;
          state.scheduleDetailPage = 1;
          state.scheduleRecordStartDate = '';
          state.scheduleRecordEndDate = '';
          state.scheduleRecordStatus = '';
          state.scheduleDetailStatus = '';
          state.scheduleDetailTaskKeyword = '';
          state.scheduleDetailTableKeyword = '';
          state.scheduleSqlModalOpen = false;
          state.reportViewTab = 'overview';
          renderAll();
        } else if (action === 'export-report') {
          var reportId = actionEl.getAttribute('data-id') || state.selectedReportId;
          var exportTarget = reportRows.filter(function (item) { return item.id === reportId; })[0] || getSelectedReport();
          exportReport(exportTarget);
        } else if (action === 'export-report-word') {
          exportReportWord();
        } else if (action === 'export-detail-all') {
          exportAllDetailReports(actionEl);
        } else if (action === 'open-schedule-run-detail') {
          state.selectedScheduleRunId = actionEl.getAttribute('data-run-id') || '';
          state.selectedScheduleRuleRunId = '';
          state.scheduleDetailStatus = '';
          state.scheduleDetailTaskKeyword = '';
          state.scheduleDetailTableKeyword = '';
          state.scheduleDetailPage = 1;
          state.scheduleLogBackView = 'schedule-record-detail';
          state.scheduleSqlModalOpen = false;
          state.view = 'schedule-record-detail';
          renderAll();
        } else if (action === 'stop-schedule-run') {
          updateScheduleRunStatus(actionEl, '执行失败');
        } else if (action === 'rerun-schedule-run') {
          updateScheduleRunStatus(actionEl, '执行中');
        } else if (action === 'stop-schedule-rule-run') {
          stopScheduleRuleRun(actionEl);
        } else if (action === 'delete-config') {
          deleteReportConfig(actionEl.getAttribute('data-id') || '');
        } else if (action === 'open-schedule-sql') {
          state.selectedScheduleRunId = actionEl.getAttribute('data-run-id') || '';
          state.selectedScheduleRuleRunId = actionEl.getAttribute('data-rule-run-id') || '';
          state.scheduleLogBackView = state.selectedScheduleRuleRunId ? 'schedule-record-detail' : 'schedule-records';
          state.scheduleSqlModalOpen = true;
          state.scheduleSql.theme = state.scheduleSql.theme || 'dark';
          renderAll();
        } else if (action === 'close-schedule-sql') {
          state.scheduleSqlModalOpen = false;
          renderAll();
        } else if (action === 'open-schedule-log') {
          state.selectedScheduleRunId = actionEl.getAttribute('data-run-id') || '';
          state.selectedScheduleRuleRunId = actionEl.getAttribute('data-rule-run-id') || '';
          state.scheduleLogBackView = state.selectedScheduleRuleRunId ? 'schedule-record-detail' : 'schedule-records';
          state.scheduleSqlModalOpen = false;
          state.view = 'schedule-log';
          renderAll();
        } else if (action === 'format-schedule-sql') {
          var sqlContent = pageEl.querySelector('[data-qir-schedule-sql-content]');
          var sqlGutter = pageEl.querySelector('[data-qir-schedule-sql-gutter]');
          if (sqlContent) {
            var formattedSql = formatSqlText(sqlContent.textContent || '');
            sqlContent.innerHTML = highlightSQL(formattedSql);
            if (sqlGutter) sqlGutter.innerHTML = lineNumbers(formattedSql);
            showToast('SQL 已格式化');
          }
        } else if (action === 'copy-schedule-sql') {
          var copyContent = pageEl.querySelector('[data-qir-schedule-sql-content]');
          var copyText = copyContent ? copyContent.textContent : '';
          function copied() { showToast('SQL 已复制'); }
          if (navigator.clipboard && copyText) navigator.clipboard.writeText(copyText).then(copied).catch(function () { showToast('复制失败'); });
          else showToast(copyText ? '请手动复制SQL' : '暂无可复制SQL');
        } else if (action === 'toggle-schedule-sql-search') {
          state.scheduleSql.searchOpen = !state.scheduleSql.searchOpen;
          renderAll();
        } else if (action === 'close-schedule-sql-search') {
          state.scheduleSql.searchOpen = false;
          renderAll();
        } else if (action === 'execute-config-once') {
          confirmConfigExecuteOnce(actionEl.getAttribute('data-id') || '');
        } else if (action === 'start-config') {
          confirmConfigScheduleAction(actionEl.getAttribute('data-id') || '', 'start');
        } else if (action === 'stop-config') {
          confirmConfigScheduleAction(actionEl.getAttribute('data-id') || '', 'stop');
        }
        return;
      }

      var previewTocLink = e.target.closest('[data-qir-preview-anchor]');
      if (previewTocLink && pageEl.contains(previewTocLink)) {
        var selector = previewTocLink.getAttribute('href') || '';
        var target = selector ? pageEl.querySelector(selector) : null;
        if (target) {
          e.preventDefault();
          pageEl.querySelectorAll('.qir-report-preview-toc .qir-preview-toc-item.active').forEach(function (item) {
            item.classList.remove('active');
          });
          previewTocLink.classList.add('active');
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        return;
      }

      var configPageBtn = e.target.closest('[data-qir-config-page]');
      if (configPageBtn && pageEl.contains(configPageBtn) && !configPageBtn.disabled) {
        var totalConfigPages = Math.max(1, Math.ceil(getConfigRows().length / state.configPageSize));
        var configTarget = configPageBtn.getAttribute('data-qir-config-page');
        if (configTarget === 'prev') state.configPage = Math.max(1, state.configPage - 1);
        else if (configTarget === 'next') state.configPage = Math.min(totalConfigPages, state.configPage + 1);
        else state.configPage = Number(configTarget) || 1;
        renderAll();
        return;
      }

      var historyPageBtn = e.target.closest('[data-qir-history-page]');
      if (historyPageBtn && pageEl.contains(historyPageBtn) && !historyPageBtn.disabled) {
        var totalHistoryPages = Math.max(1, Math.ceil(getHistoryRows().length / state.historyPageSize));
        var historyTarget = historyPageBtn.getAttribute('data-qir-history-page');
        if (historyTarget === 'prev') state.historyPage = Math.max(1, state.historyPage - 1);
        else if (historyTarget === 'next') state.historyPage = Math.min(totalHistoryPages, state.historyPage + 1);
        else state.historyPage = Number(historyTarget) || 1;
        renderAll();
        return;
      }

      var scheduleRecordPageBtn = e.target.closest('[data-qir-schedule-record-page]');
      if (scheduleRecordPageBtn && pageEl.contains(scheduleRecordPageBtn) && !scheduleRecordPageBtn.disabled) {
        var totalScheduleRecordPages = Math.max(1, Math.ceil(getScheduleRecordRows().length / state.scheduleRecordPageSize));
        var scheduleRecordTarget = scheduleRecordPageBtn.getAttribute('data-qir-schedule-record-page');
        if (scheduleRecordTarget === 'prev') state.scheduleRecordPage = Math.max(1, state.scheduleRecordPage - 1);
        else if (scheduleRecordTarget === 'next') state.scheduleRecordPage = Math.min(totalScheduleRecordPages, state.scheduleRecordPage + 1);
        else state.scheduleRecordPage = Number(scheduleRecordTarget) || 1;
        renderAll();
        return;
      }

      var scheduleDetailPageBtn = e.target.closest('[data-qir-schedule-detail-page]');
      if (scheduleDetailPageBtn && pageEl.contains(scheduleDetailPageBtn) && !scheduleDetailPageBtn.disabled) {
        var totalScheduleDetailPages = Math.max(1, Math.ceil(getScheduleRuleExecutionRows(getSelectedScheduleRecordRun()).length / state.scheduleDetailPageSize));
        var scheduleDetailTarget = scheduleDetailPageBtn.getAttribute('data-qir-schedule-detail-page');
        if (scheduleDetailTarget === 'prev') state.scheduleDetailPage = Math.max(1, state.scheduleDetailPage - 1);
        else if (scheduleDetailTarget === 'next') state.scheduleDetailPage = Math.min(totalScheduleDetailPages, state.scheduleDetailPage + 1);
        else state.scheduleDetailPage = Number(scheduleDetailTarget) || 1;
        renderAll();
        return;
      }

      var pageBtn = e.target.closest('[data-qir-page]');
      if (pageBtn && pageEl.contains(pageBtn) && !pageBtn.disabled) {
        var totalPages = Math.max(1, Math.ceil(getReportRows().length / state.pageSize));
        var target = pageBtn.getAttribute('data-qir-page');
        if (target === 'prev') state.page = Math.max(1, state.page - 1);
        else if (target === 'next') state.page = Math.min(totalPages, state.page + 1);
        else state.page = Number(target) || 1;
        renderAll();
        return;
      }

      var scopePageBtn = e.target.closest('[data-qir-template-scope-page]');
      if (scopePageBtn && pageEl.contains(scopePageBtn) && !scopePageBtn.disabled) {
        var scopeTotalPages = Math.max(1, Math.ceil(getTemplateScopeRows().length / state.templateScopePageSize));
        var scopeTarget = scopePageBtn.getAttribute('data-qir-template-scope-page');
        if (scopeTarget === 'prev') state.templateScopePage = Math.max(1, state.templateScopePage - 1);
        else if (scopeTarget === 'next') state.templateScopePage = Math.min(scopeTotalPages, state.templateScopePage + 1);
        else state.templateScopePage = Number(scopeTarget) || 1;
        renderAll();
        return;
      }

      var filterPageBtn = e.target.closest('[data-qir-template-filter-page]');
      if (filterPageBtn && pageEl.contains(filterPageBtn) && !filterPageBtn.disabled) {
        var filterGroupId = filterPageBtn.getAttribute('data-group-id') || '';
        var filterGroup = getTemplateFilterGroupById(filterGroupId);
        if (filterGroup) {
          var filterTotalPages = Math.max(1, Math.ceil(getTemplateFilterFilteredRows(filterGroup).length / getTemplateFilterPageSize(filterGroup)));
          var filterTarget = filterPageBtn.getAttribute('data-qir-template-filter-page');
          var filterCurrentPage = getTemplateFilterGroupPage(filterGroup);
          if (filterTarget === 'prev') state.templateFilterPages[filterGroup.id] = Math.max(1, filterCurrentPage - 1);
          else if (filterTarget === 'next') state.templateFilterPages[filterGroup.id] = Math.min(filterTotalPages, filterCurrentPage + 1);
          else state.templateFilterPages[filterGroup.id] = Number(filterTarget) || 1;
          renderAll();
        }
        return;
      }

      var editor = getTemplateEditorEl();
      var templateToken = e.target.closest('.qir-variable-token, .qir-template-token');
      if (templateToken && editor && editor.contains(templateToken)) {
        clearSelectedTemplateDashboards(editor);
        clearSelectedTemplateVariables(editor);
        templateToken.setAttribute('contenteditable', 'false');
        templateToken.classList.add('selected');
        focusTemplateEditor(editor);
        saveTemplateEditorContent();
        return;
      }

      var insertedDashboard = e.target.closest('.qir-template-inserted-dashboard');
      if (insertedDashboard && pageEl.contains(insertedDashboard)) {
        editor = getTemplateEditorEl();
        if (editor) {
          clearSelectedTemplateDashboards(editor);
          clearSelectedTemplateVariables(editor);
          insertedDashboard.classList.add('selected');
          focusTemplateEditor(editor);
          saveTemplateEditorContent();
        }
        return;
      }

      var clickedTemplateEditor = e.target.closest('[data-qir-template-editor]');
      if (clickedTemplateEditor && pageEl.contains(clickedTemplateEditor)) {
        var cleared = clearSelectedTemplateDashboards(clickedTemplateEditor);
        cleared = clearSelectedTemplateVariables(clickedTemplateEditor) || cleared;
        saveTemplateEditorSelection();
        if (cleared) {
          saveTemplateEditorContent();
        }
      }

      var rulePageBtn = e.target.closest('[data-qir-rule-page]');
      if (rulePageBtn && pageEl.contains(rulePageBtn) && !rulePageBtn.disabled) {
        var ruleKey = rulePageBtn.getAttribute('data-rule-key') || '';
        var rows = getRuleProblemRows(getSelectedReport(), ruleKey);
        var totalRulePages = Math.max(1, Math.ceil(rows.length / state.rulePageSize));
        var ruleTarget = rulePageBtn.getAttribute('data-qir-rule-page');
        var currentRulePage = state.rulePages[ruleKey] || 1;
        if (ruleTarget === 'prev') state.rulePages[ruleKey] = Math.max(1, currentRulePage - 1);
        else if (ruleTarget === 'next') state.rulePages[ruleKey] = Math.min(totalRulePages, currentRulePage + 1);
        else state.rulePages[ruleKey] = Number(ruleTarget) || 1;
        renderAll();
      }

      if (!clickedRelatedTaskSelect && state.relatedTaskDropdownOpen) {
        state.relatedTaskDropdownOpen = false;
        state.relatedTaskKeyword = '';
        renderAll();
      }
    });

    pageEl.addEventListener('input', function (e) {
      if (e.target.matches('[data-qir-tree-search]')) {
        state.treeKeyword = e.target.value;
        renderAll();
      } else if (e.target.matches('[data-qir-related-task-search]')) {
        state.relatedTaskKeyword = e.target.value;
        renderAll();
        var relatedSearch = pageEl.querySelector('[data-qir-related-task-search]');
        if (relatedSearch) {
          relatedSearch.focus();
          relatedSearch.setSelectionRange(relatedSearch.value.length, relatedSearch.value.length);
        }
      } else if (e.target.matches('[data-qir-dashboard-search]')) {
        saveTemplateEditorContent();
        state.templateDashboardKeyword = e.target.value;
        state.templateDashboardPage = 1;
        renderAll();
        var dashboardSearch = pageEl.querySelector('[data-qir-dashboard-search]');
        if (dashboardSearch) {
          dashboardSearch.focus();
          dashboardSearch.setSelectionRange(dashboardSearch.value.length, dashboardSearch.value.length);
        }
      } else if (e.target.matches('[data-qir-template-zoom-range]')) {
        setTemplateZoom(e.target.value);
      } else if (e.target.matches('[data-qir-report-preview-zoom-range]')) {
        setReportPreviewZoom(e.target.value);
      } else if (e.target.matches('[data-qir-template-variable-search]')) {
        saveTemplateEditorContent();
        state.templateVariableKeyword = e.target.value;
        renderAll();
        var variableSearch = pageEl.querySelector('[data-qir-template-variable-search]');
        if (variableSearch) {
          variableSearch.focus();
          variableSearch.setSelectionRange(variableSearch.value.length, variableSearch.value.length);
        }
      } else if (e.target.matches('[data-qir-template-schedule-field]')) {
        var draft = normalizeTemplateScheduleDraft(state.templateScheduleDraft);
        draft[e.target.getAttribute('data-qir-template-schedule-field')] = e.target.value;
        state.templateScheduleDraft = draft;
        updateTemplateScheduleHintDom();
      } else if (e.target.matches('[data-qir-template-filter-field-keyword]')) {
        state.templateFilterFieldKeyword = e.target.value;
        renderAll();
        var filterFieldSearch = pageEl.querySelector('[data-qir-template-filter-field-keyword]');
        if (filterFieldSearch) {
          filterFieldSearch.focus();
          filterFieldSearch.setSelectionRange(filterFieldSearch.value.length, filterFieldSearch.value.length);
        }
      } else if (e.target.matches('[data-qir-template-filter-value], [data-qir-template-filter-desc]') || e.target.closest('[data-qir-template-filter-sql-content]')) {
        captureTemplateFilterModalDraft();
      } else if (e.target.closest('[data-qir-template-editor]')) {
        saveTemplateEditorContent();
        saveTemplateEditorSelection();
      }
    });

    pageEl.addEventListener('mouseup', function (e) {
      if (e.target.closest('[data-qir-template-editor]')) {
        saveTemplateEditorSelection();
      }
    });

    pageEl.addEventListener('keyup', function (e) {
      if (e.target.closest('[data-qir-template-editor]')) {
        saveTemplateEditorSelection();
      }
    });

    pageEl.addEventListener('focusout', function (e) {
      if (e.target.matches('[data-qir-template-name-input]')) {
        saveTemplateNameFromInput(e.target, { render: false });
        window.setTimeout(renderAll, 0);
      } else if (e.target.matches('[data-qir-template-desc-input]')) {
        saveTemplateDescFromInput(e.target, { render: false });
        window.setTimeout(renderAll, 0);
      } else if (e.target.matches('[data-qir-config-name-input]')) {
        saveConfigNameFromInput(e.target, { render: false });
        window.setTimeout(renderAll, 0);
      } else if (e.target.matches('[data-qir-template-filter-group-name], [data-qir-template-filter-group-desc]')) {
        saveTemplateFilterGroupField(e.target);
        var filterMeta = e.target.closest('.qir-template-filter-group-meta');
        var nextFocus = e.relatedTarget;
        if (!filterMeta || !nextFocus || !filterMeta.contains(nextFocus)) {
          var savedFilterGroup = getTemplateFilterGroupById(e.target.getAttribute('data-group-id') || '');
          if (savedFilterGroup) {
            savedFilterGroup.editing = false;
            savedFilterGroup.editingField = '';
          }
          window.setTimeout(renderAll, 0);
        }
      }
    });

    pageEl.addEventListener('change', function (e) {
      if (e.target.matches('[data-qir-template-schedule-field]')) {
        captureTemplateScheduleDraft();
        renderAll();
      } else if (e.target.matches('[data-qir-template-apply-mode]')) {
        saveTemplateEditorContent();
        var applyModeConfig = getSelectedReportConfig() || reportConfigs[0];
        var applyMode = e.target.value === 'group' ? 'group' : 'common';
        if (applyMode === 'group' && !getTemplateFilterGroups(applyModeConfig).length) {
          showToast('请先在数据过滤中新增分组');
        } else {
          setTemplateApplyMode(applyModeConfig, applyMode);
          if (applyMode === 'group') {
            loadFirstTemplateGroupEditor(applyModeConfig);
          } else {
            loadTemplateEditorContent(applyModeConfig, 'common');
            state.templateCopyModalOpen = false;
            state.templateCopyTargetGroupId = '';
          }
          renderAll();
        }
      } else if (e.target.matches('[data-qir-template-edit-target]')) {
        saveTemplateEditorContent();
        var editTargetConfig = getSelectedReportConfig() || reportConfigs[0];
        var editTargetValue = e.target.value || 'common';
        if (editTargetValue.indexOf('group:') === 0) {
          var editTargetGroupId = editTargetValue.replace('group:', '');
          var editTargetGroup = getTemplateGroupById(editTargetConfig, editTargetGroupId);
          if (editTargetGroup) {
            setTemplateApplyMode(editTargetConfig, 'group');
            loadTemplateEditorContent(editTargetConfig, 'group', editTargetGroupId, { useCommonFallback: true });
          }
        } else {
          loadTemplateEditorContent(editTargetConfig, 'common');
        }
        renderAll();
      } else if (e.target.matches('[data-qir-template-copy-target]')) {
        state.templateCopyTargetGroupId = e.target.value || '';
        renderAll();
      } else if (e.target.matches('[data-qir-config-page-size]')) {
        state.configPageSize = Number(e.target.value) || 10;
        state.configPage = 1;
        renderAll();
      } else if (e.target.matches('[data-qir-history-page-size]')) {
        state.historyPageSize = Number(e.target.value) || 10;
        state.historyPage = 1;
        renderAll();
      } else if (e.target.matches('[data-qir-schedule-record-page-size]')) {
        state.scheduleRecordPageSize = Number(e.target.value) || 10;
        state.scheduleRecordPage = 1;
        state.scheduleDetailPage = 1;
        state.selectedScheduleRunId = '';
        state.selectedScheduleRuleRunId = '';
        state.scheduleLogBackView = 'schedule-records';
        state.scheduleSqlModalOpen = false;
        renderAll();
      } else if (e.target.matches('[data-qir-schedule-detail-page-size]')) {
        state.scheduleDetailPageSize = Number(e.target.value) || 10;
        state.scheduleDetailPage = 1;
        renderAll();
      } else if (e.target.matches('[data-qir-page-size]')) {
        state.pageSize = Number(e.target.value) || 10;
        state.page = 1;
        renderAll();
      } else if (e.target.matches('[data-qir-config-status], [data-qir-config-exec-status], [data-qir-config-data-range-status]')) {
        applyConfigQueryFromDom();
      } else if (e.target.matches('[data-qir-schedule-record-status], [data-qir-schedule-start-date], [data-qir-schedule-end-date]')) {
        applyScheduleRecordQueryFromDom();
      } else if (e.target.matches('[data-qir-schedule-detail-status]')) {
        applyScheduleDetailQueryFromDom();
      } else if (e.target.matches('[data-qir-schedule-sql-theme]')) {
        state.scheduleSql.theme = e.target.value === 'light' ? 'light' : 'dark';
        var scheduleSqlEditor = pageEl.querySelector('[data-qir-schedule-sql-editor]');
        if (scheduleSqlEditor) {
          scheduleSqlEditor.classList.toggle('theme-light', state.scheduleSql.theme === 'light');
          scheduleSqlEditor.classList.toggle('theme-dark', state.scheduleSql.theme !== 'light');
        }
      } else if (e.target.matches('[data-qir-schedule-sql-font]')) {
        state.scheduleSql.font = e.target.value || '14px';
        var scheduleFontEditor = pageEl.querySelector('[data-qir-schedule-sql-editor]');
        if (scheduleFontEditor) scheduleFontEditor.style.fontSize = state.scheduleSql.font;
      } else if (e.target.matches('[data-qir-template-filter-sql-theme]')) {
        state.templateFilterSql.theme = e.target.value === 'light' ? 'light' : 'dark';
        var filterSqlEditor = pageEl.querySelector('[data-qir-template-filter-sql-editor]');
        if (filterSqlEditor) {
          filterSqlEditor.classList.toggle('theme-light', state.templateFilterSql.theme === 'light');
          filterSqlEditor.classList.toggle('theme-dark', state.templateFilterSql.theme !== 'light');
        }
      } else if (e.target.matches('[data-qir-template-filter-sql-font]')) {
        state.templateFilterSql.font = e.target.value || '14px';
        var filterFontEditor = pageEl.querySelector('[data-qir-template-filter-sql-editor]');
        if (filterFontEditor) filterFontEditor.style.fontSize = state.templateFilterSql.font;
      } else if (e.target.matches('[data-qir-template-filter-field], [data-qir-template-filter-operator], [data-qir-template-filter-apply-scope]')) {
        captureTemplateFilterModalDraft();
      } else if (e.target.matches('[data-qir-template-scope-page-size]')) {
        state.templateScopePageSize = Number(e.target.value) || 10;
        state.templateScopePage = 1;
        renderAll();
      } else if (e.target.matches('[data-qir-template-filter-page-size]')) {
        var filterPageSizeGroupId = e.target.getAttribute('data-group-id') || '';
        if (filterPageSizeGroupId) {
          state.templateFilterPageSizes[filterPageSizeGroupId] = Number(e.target.value) || 10;
          state.templateFilterPages[filterPageSizeGroupId] = 1;
        }
        renderAll();
      } else if (e.target.matches('[data-qir-template-scope-check-all]')) {
        getVisibleTemplateScopeRows().forEach(function (item) {
          state.templateScopeSelected[item.id] = e.target.checked;
        });
        renderAll();
      } else if (e.target.matches('[data-qir-template-scope-check]')) {
        var scopeId = e.target.getAttribute('data-qir-template-scope-check') || '';
        if (scopeId) state.templateScopeSelected[scopeId] = e.target.checked;
        renderAll();
      } else if (e.target.matches('[data-qir-template-scope-modal-check-all]')) {
        getTemplateScopeCandidateRows().forEach(function (item) {
          state.templateScopeModalSelected[item.id] = e.target.checked;
        });
        renderAll();
      } else if (e.target.matches('[data-qir-template-scope-modal-check]')) {
        var modalScopeId = e.target.getAttribute('data-qir-template-scope-modal-check') || '';
        if (modalScopeId) state.templateScopeModalSelected[modalScopeId] = e.target.checked;
        renderAll();
      } else if (e.target.matches('[data-qir-rule-page-size]')) {
        state.rulePageSize = Number(e.target.value) || 5;
        state.rulePages = {};
        renderAll();
      }
    });

    pageEl.addEventListener('keydown', function (e) {
      if (removeSelectedTemplateVariable(e) || removeSelectedTemplateDashboard(e)) {
        return;
      }
      if (e.key === 'Escape' && state.templateFilterModalOpen) {
        closeTemplateFilterModal();
      } else if (e.key === 'Escape' && state.templateScopeModalOpen) {
        closeTemplateScopeModal();
      } else if (e.key === 'Escape' && state.templateDashboardModalOpen) {
        removeTemplateDashboardInsertMarker();
        state.templateDashboardModalOpen = false;
        renderAll();
      } else if (e.key === 'Escape' && state.templateCopyModalOpen) {
        state.templateCopyModalOpen = false;
        state.templateCopyTargetGroupId = '';
        renderAll();
      } else if (e.key === 'Escape' && state.templateScheduleModalOpen) {
        state.templateScheduleModalOpen = false;
        state.templateScheduleDraft = null;
        renderAll();
      } else if (e.key === 'Escape' && state.startScheduleModalOpen) {
        state.startScheduleModalOpen = false;
        state.startScheduleConfigId = '';
        state.templateScheduleDraft = null;
        renderAll();
      } else if (e.key === 'Escape' && state.scheduleSqlModalOpen) {
        state.scheduleSqlModalOpen = false;
        renderAll();
      } else if (e.key === 'Escape' && state.relatedTaskDropdownOpen) {
        state.relatedTaskDropdownOpen = false;
        state.relatedTaskKeyword = '';
        renderAll();
      } else if (e.key === 'Enter' && e.target.matches('[data-qir-template-name-input]')) {
        e.preventDefault();
        saveTemplateNameFromInput(e.target);
      } else if (e.key === 'Enter' && e.target.matches('[data-qir-config-keyword]')) {
        applyConfigQueryFromDom(e.target.value);
      } else if (e.key === 'Enter' && e.target.matches('[data-qir-config-name-input]')) {
        e.preventDefault();
        saveConfigNameFromInput(e.target);
      } else if (e.key === 'Enter' && e.target.matches('[data-qir-related-task-search]')) {
        e.preventDefault();
        var firstRelatedTask = getFilteredRelatedTaskOptions()[0] || '';
        if (firstRelatedTask) {
          state.relatedTaskFilter = firstRelatedTask;
          state.relatedTaskDropdownOpen = false;
          state.relatedTaskKeyword = '';
          state.configPage = 1;
          renderAll();
        }
      } else if (e.key === 'Enter' && (e.target.matches('[data-qir-schedule-start-date]') || e.target.matches('[data-qir-schedule-end-date]'))) {
        applyScheduleRecordQueryFromDom();
      } else if (e.key === 'Enter' && (e.target.matches('[data-qir-schedule-detail-task]') || e.target.matches('[data-qir-schedule-detail-table]'))) {
        applyScheduleDetailQueryFromDom();
      } else if (e.key === 'Enter' && e.target.matches('[data-qir-keyword]')) {
        state.keyword = e.target.value.trim();
        state.page = 1;
        renderAll();
      } else if (e.key === 'Enter' && e.target.matches('[data-qir-template-name-input]')) {
        e.preventDefault();
        saveTemplateNameFromInput(e.target);
      } else if (e.key === 'Enter' && e.target.matches('[data-qir-template-desc-input]')) {
        e.preventDefault();
        saveTemplateDescFromInput(e.target);
      } else if (e.key === 'Enter' && e.target.matches('[data-qir-template-scope-keyword]')) {
        state.templateScopeKeyword = e.target.value.trim();
        state.templateScopePage = 1;
        clearTemplateScopeSelection();
        renderAll();
      } else if (e.key === 'Enter' && e.target.matches('[data-qir-template-filter-keyword]')) {
        state.templateFilterKeyword = e.target.value.trim();
        renderAll();
      } else if (e.key === 'Enter' && e.target.matches('[data-qir-template-scope-modal-keyword]')) {
        state.templateScopeModalKeyword = e.target.value.trim();
        state.templateScopeModalSelected = {};
        renderAll();
      }
    });
  }

  function resetState(opts) {
    var section = opts && typeof opts === 'object' ? (opts.section || opts.mode) : opts;
    var configKeyword = opts && typeof opts === 'object' && opts.configKeyword != null ? String(opts.configKeyword).trim() : '';
    state.view = 'list';
    state.section = normalizeSection(section);
    state.configKeyword = configKeyword;
    state.configStatus = '';
    state.configExecStatus = '';
    state.configDataRangeStatus = '';
    state.relatedTaskFilter = '';
    state.relatedTaskDropdownOpen = false;
    state.relatedTaskKeyword = '';
    state.editingConfigNameId = '';
    state.configPage = 1;
    state.configPageSize = 10;
    state.selectedConfigId = '';
    state.treeKey = 'all';
    state.treeKeyword = '';
    state.keyword = '';
    state.page = 1;
    state.pageSize = 10;
    state.historyPage = 1;
    state.historyPageSize = 10;
    state.scheduleRecordPage = 1;
    state.scheduleRecordPageSize = 10;
    state.scheduleDetailPage = 1;
    state.scheduleDetailPageSize = 10;
    state.scheduleRecordStatus = '';
    state.scheduleRecordStartDate = '';
    state.scheduleRecordEndDate = '';
    state.scheduleDetailStatus = '';
    state.scheduleDetailTaskKeyword = '';
    state.scheduleDetailTableKeyword = '';
    state.scheduleRunOverrides = {};
    state.selectedScheduleRunId = '';
    state.selectedScheduleRuleRunId = '';
    state.scheduleLogBackView = 'schedule-records';
    state.scheduleSqlModalOpen = false;
    state.scheduleSql = { theme: 'dark', font: '14px', searchOpen: false };
    state.selectedReportId = '';
    state.reportViewTab = 'overview';
    state.rulePages = {};
    state.rulePageSize = 5;
    state.templateEditorHtml = '';
    state.templateZoom = 100;
    state.reportPreviewZoom = 100;
    state.templateNameEditing = false;
    state.templateDescEditing = false;
    state.templateManageTab = 'template';
    state.templateEditTarget = 'common';
    state.templateEditGroupId = '';
    state.templateScopeKeyword = '';
    state.templateScopePage = 1;
    state.templateScopePageSize = 10;
    state.templateScopeSelected = {};
    state.templateScopeModalOpen = false;
    state.templateScopeModalTreeKey = 'all';
    state.templateScopeModalKeyword = '';
    state.templateScopeModalSelected = {};
    state.templateFilterKeyword = '';
    state.templateFilterActiveGroupId = '';
    state.templateFilterModalOpen = false;
    state.templateFilterModalGroupId = '';
    state.templateFilterModalRowId = '';
    state.templateFilterModalMode = 'visual';
    state.templateFilterModalDraft = null;
    state.templateFilterFieldKeyword = '';
    state.templateFilterSql = { theme: 'dark', font: '14px', searchOpen: false };
    state.templateFilterPages = {};
    state.templateFilterPageSizes = {};
    state.templateVariableKeyword = '';
    state.templateVariableCollapsed = false;
    state.templateOutlineCollapsed = false;
    state.templateDashboardModalOpen = false;
    state.templateCopyModalOpen = false;
    state.templateCopyTargetGroupId = '';
    state.templateDashboardKeyword = '';
    state.templateDashboardFilter = 'all';
    state.templateDashboardPage = 1;
    state.templateDashboardSelected = {};
    state.templateScheduleModalOpen = false;
    state.startScheduleModalOpen = false;
    state.startScheduleConfigId = '';
    state.templateScheduleDraft = null;
    state.treeOpen = {
      all: true,
      production: true,
      warehouse: true,
      business: true,
      test: true
    };
  }

  return {
    html: '<div class="page-quality-inspect-report"></div>',
    init: function (opts) {
      pageEl = document.querySelector('.page-quality-inspect-report');
      if (!pageEl) return;
      resetState(opts || {});
      normalizeOaQualityReportConfigs();
      bindEvents();
      renderAll();
    }
  };
})();
