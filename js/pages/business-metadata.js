/**
 * 数据中台 V4.0 - 数据治理 / 元数据管理 / 业务元数据
 * 静态高保真原型：数据源/数据目录树 + 数据列表 + 任务查看 + AI处理记录
 */
window.DP = window.DP || {};
DP.pages = DP.pages || {};

DP.pages.businessMetadata = (function () {
  var sourceTree = [
    {
      key: 'src_all',
      label: '数据源目录 (15)',
      icon: 'bi-stack',
      iconClass: 'bm-icon-root',
      open: true,
      children: [
        {
          key: 'src_prod_group',
          label: '生产数据库 (3)',
          icon: 'bi-box-seam',
          iconClass: 'bm-icon-db',
          open: true,
          children: [
            { key: 'src_logistics_mysql', label: 'prod_mysql_master', icon: 'bi-database', iconClass: 'bm-icon-db-small' },
            { key: 'src_settle_mysql', label: 'prod_mysql_slave', icon: 'bi-database', iconClass: 'bm-icon-db-small' },
            { key: 'src_crm_mysql', label: 'prod_postgresql', icon: 'bi-database', iconClass: 'bm-icon-db-small' }
          ]
        },
        {
          key: 'src_tms_hive',
          label: '数据仓库 (4)',
          icon: 'bi-box-seam',
          iconClass: 'bm-icon-db',
          open: true,
          children: [
            { key: 'src_dim', label: 'dw_hive_ods', icon: 'bi-database', iconClass: 'bm-icon-db-small' },
            { key: 'src_dwd', label: 'dw_hive_dwd', icon: 'bi-database', iconClass: 'bm-icon-db-small' },
            { key: 'src_dws', label: 'dw_hive_dws', icon: 'bi-database', iconClass: 'bm-icon-db-small' },
            { key: 'src_ads', label: 'dw_hive_ads', icon: 'bi-database', iconClass: 'bm-icon-db-small' }
          ]
        },
        {
          key: 'src_biz_system',
          label: '业务系统 (3)',
          icon: 'bi-box-seam',
          iconClass: 'bm-icon-db',
          open: true,
          children: [
            { key: 'src_finance_system', label: 'erp_oracle_db', icon: 'bi-database', iconClass: 'bm-icon-db-small' },
            { key: 'src_customer_system', label: 'crm_sqlserver', icon: 'bi-database', iconClass: 'bm-icon-db-small' },
            { key: 'src_logistics', label: 'oa_mysql_db', icon: 'bi-database', iconClass: 'bm-icon-db-small' }
          ]
        },
        {
          key: 'src_realtime_group',
          label: '实时数据源 (2)',
          icon: 'bi-box-seam',
          iconClass: 'bm-icon-db',
          open: true,
          children: [
            { key: 'src_logistics_kafka', label: 'kafka_cluster_01', icon: 'bi-hdd-network', iconClass: 'bm-icon-db-small' },
            { key: 'src_kafka_location', label: 'kafka_cluster_02', icon: 'bi-hdd-network', iconClass: 'bm-icon-db-small' }
          ]
        },
        {
          key: 'src_test_group',
          label: '测试环境 (3)',
          icon: 'bi-box-seam',
          iconClass: 'bm-icon-db',
          open: true,
          children: [
            { key: 'src_test_mysql', label: 'test_mysql_db', icon: 'bi-database', iconClass: 'bm-icon-db-small' },
            { key: 'src_test_clickhouse', label: 'test_clickhouse', icon: 'bi-database', iconClass: 'bm-icon-db-small' },
            { key: 'src_test_mongodb', label: 'test_mongodb', icon: 'bi-database', iconClass: 'bm-icon-db-small' }
          ]
        }
      ]
    }
  ];

  var catalogTree = [
    {
      key: 'cat_all',
      label: '企业数据资产目录 (126)',
      icon: 'bi-journals',
      iconClass: 'bm-icon-root',
      open: true,
      children: [
        {
          key: 'cat_logistics',
          label: '物流履约域 (42)',
          icon: 'bi-folder2-open',
          iconClass: 'bm-icon-folder',
          open: true,
          children: [
            {
              key: 'cat_fulfillment',
              label: '订单履约',
              icon: 'bi-folder2-open',
              iconClass: 'bm-icon-folder',
              open: true,
              children: [
                { key: 'cat_waybill', label: '运单主题', icon: 'bi-bookmark', iconClass: 'bm-icon-catalog' },
                { key: 'cat_dispatch', label: '派送主题', icon: 'bi-bookmark', iconClass: 'bm-icon-catalog' },
                { key: 'cat_timeout', label: '超时预警', icon: 'bi-bookmark', iconClass: 'bm-icon-catalog' }
              ]
            },
            {
              key: 'cat_capacity',
              label: '运力管理',
              icon: 'bi-folder2',
              iconClass: 'bm-icon-folder',
              children: [
                { key: 'cat_driver', label: '司机主题', icon: 'bi-bookmark', iconClass: 'bm-icon-catalog' },
                { key: 'cat_vehicle', label: '车辆主题', icon: 'bi-bookmark', iconClass: 'bm-icon-catalog' },
                { key: 'cat_route', label: '线路主题', icon: 'bi-bookmark', iconClass: 'bm-icon-catalog' }
              ]
            }
          ]
        },
        {
          key: 'cat_customer',
          label: '客户服务域 (28)',
          icon: 'bi-folder2',
          iconClass: 'bm-icon-folder',
          children: [
            {
              key: 'cat_customer_profile',
              label: '客户画像',
              icon: 'bi-folder2',
              iconClass: 'bm-icon-folder',
              children: [
                { key: 'cat_customer_basic', label: '客户基础信息', icon: 'bi-bookmark', iconClass: 'bm-icon-catalog' },
                { key: 'cat_customer_label', label: '客户标签', icon: 'bi-bookmark', iconClass: 'bm-icon-catalog' }
              ]
            },
            {
              key: 'cat_service',
              label: '服务工单',
              icon: 'bi-folder2',
              iconClass: 'bm-icon-folder',
              children: [
                { key: 'cat_complaint', label: '投诉处理', icon: 'bi-bookmark', iconClass: 'bm-icon-catalog' },
                { key: 'cat_satisfaction', label: '满意度回访', icon: 'bi-bookmark', iconClass: 'bm-icon-catalog' }
              ]
            }
          ]
        },
        {
          key: 'cat_finance',
          label: '财务结算域 (31)',
          icon: 'bi-folder2',
          iconClass: 'bm-icon-folder',
          children: [
            {
              key: 'cat_settlement',
              label: '费用结算',
              icon: 'bi-folder2',
              iconClass: 'bm-icon-folder',
              children: [
                { key: 'cat_fee', label: '运费结算', icon: 'bi-bookmark', iconClass: 'bm-icon-catalog' },
                { key: 'cat_invoice', label: '发票开具', icon: 'bi-bookmark', iconClass: 'bm-icon-catalog' }
              ]
            },
            {
              key: 'cat_risk',
              label: '财务风控',
              icon: 'bi-folder2',
              iconClass: 'bm-icon-folder',
              children: [
                { key: 'cat_arrears', label: '欠费预警', icon: 'bi-bookmark', iconClass: 'bm-icon-catalog' },
                { key: 'cat_exception', label: '异常退款', icon: 'bi-bookmark', iconClass: 'bm-icon-catalog' }
              ]
            }
          ]
        },
        {
          key: 'cat_public',
          label: '公共维度域 (25)',
          icon: 'bi-folder2',
          iconClass: 'bm-icon-folder',
          children: [
            { key: 'cat_region', label: '行政区划', icon: 'bi-bookmark', iconClass: 'bm-icon-catalog' },
            { key: 'cat_org', label: '组织机构', icon: 'bi-bookmark', iconClass: 'bm-icon-catalog' },
            { key: 'cat_time', label: '时间周期', icon: 'bi-bookmark', iconClass: 'bm-icon-catalog' }
          ]
        }
      ]
    }
  ];

  function row(code, name, alias, standard, bizCode, metaModel, remark, type, sourceKeys, catalogKeys) {
    return {
      id: 0,
      code: code,
      name: name,
      alias: alias,
      standard: standard,
      bizCode: bizCode,
      metaModel: metaModel,
      remark: remark,
      type: type,
      sourceKeys: sourceKeys,
      catalogKeys: catalogKeys
    };
  }

  var metadataRows = [
    row('BM-DB-TMS-001', 'zz_tms_ads', '运输主题应用库', '--', '--', '库模型', '承载运输履约、城市配送、运力效率等应用层指标', 'database', ['src_all', 'src_tms_hive', 'src_zz_dw', 'src_ads'], ['cat_all', 'cat_logistics']),
    row('BM-TB-DRIVER-001', 'zz_tms_ads.ads_driver_stats', '司机绩效统计表', 'STD_TABLE_DRIVER_PERFORMANCE', '--', '表模型', '按天统计司机接单、履约、超时和里程表现', 'table', ['src_all', 'src_tms_hive', 'src_zz_dw', 'src_ads', 'src_tbl_driver'], ['cat_all', 'cat_logistics', 'cat_capacity', 'cat_driver']),
    row('BM-FD-DRIVER-001', 'zz_tms_ads.ads_driver_stats.driver_emp_id', '司机员工ID', 'STD_EMPLOYEE_ID', 'BC_EMPLOYEE_STATUS', '字段模型', '司机在组织人员主数据中的唯一员工标识', 'field', ['src_all', 'src_tms_hive', 'src_zz_dw', 'src_ads', 'src_tbl_driver'], ['cat_all', 'cat_logistics', 'cat_capacity', 'cat_driver']),
    row('BM-FD-DRIVER-002', 'zz_tms_ads.ads_driver_stats.driver_name', '司机姓名', 'STD_PERSON_NAME', '--', '字段模型', '司机实名信息，用于运营看板展示和责任追溯', 'field', ['src_all', 'src_tms_hive', 'src_zz_dw', 'src_ads', 'src_tbl_driver'], ['cat_all', 'cat_logistics', 'cat_capacity', 'cat_driver']),
    row('BM-FD-DRIVER-003', 'zz_tms_ads.ads_driver_stats.trans_finish_count', '完成运输次数', 'STD_ORDER_COUNT', '--', '字段模型', '指定统计周期内司机完成的运输单量', 'field', ['src_all', 'src_tms_hive', 'src_zz_dw', 'src_ads', 'src_tbl_driver'], ['cat_all', 'cat_logistics', 'cat_capacity', 'cat_driver']),
    row('BM-FD-DRIVER-004', 'zz_tms_ads.ads_driver_stats.avg_trans_finish_distance', '平均运输里程', 'STD_DISTANCE_KM', '--', '字段模型', '完成运输单的平均公里数，单位为公里', 'field', ['src_all', 'src_tms_hive', 'src_zz_dw', 'src_ads', 'src_tbl_driver'], ['cat_all', 'cat_logistics', 'cat_capacity', 'cat_driver']),
    row('BM-FD-DRIVER-005', 'zz_tms_ads.ads_driver_stats.trans_finish_late_count', '超时完成次数', 'STD_TIMEOUT_COUNT', 'BC_TIMEOUT_REASON', '字段模型', '超过承诺履约时效后完成的运输次数', 'field', ['src_all', 'src_tms_hive', 'src_zz_dw', 'src_ads', 'src_tbl_driver'], ['cat_all', 'cat_logistics', 'cat_fulfillment', 'cat_timeout']),
    row('BM-TB-CITY-001', 'zz_tms_ads.ads_express_city_stats', '城市配送统计表', 'STD_TABLE_CITY_DELIVERY', '--', '表模型', '城市维度下的揽收、派送、签收和异常统计', 'table', ['src_all', 'src_tms_hive', 'src_zz_dw', 'src_ads', 'src_tbl_city'], ['cat_all', 'cat_logistics', 'cat_fulfillment', 'cat_dispatch']),
    row('BM-FD-CITY-001', 'zz_tms_ads.ads_express_city_stats.city_id', '城市ID', 'STD_CITY_ID', '--', '字段模型', '行政区划维度中的城市唯一标识', 'field', ['src_all', 'src_tms_hive', 'src_zz_dw', 'src_ads', 'src_tbl_city'], ['cat_all', 'cat_public', 'cat_region', 'cat_dispatch']),
    row('BM-FD-CITY-002', 'zz_tms_ads.ads_express_city_stats.city_name', '城市名称', 'STD_CITY_NAME', '--', '字段模型', '城市中文名称，用于区域统计展示', 'field', ['src_all', 'src_tms_hive', 'src_zz_dw', 'src_ads', 'src_tbl_city'], ['cat_all', 'cat_public', 'cat_region', 'cat_dispatch']),
    row('BM-FD-CITY-003', 'zz_tms_ads.ads_express_city_stats.deliver_suc_count', '派送成功数', 'STD_DELIVERY_SUCCESS_COUNT', '--', '字段模型', '城市范围内成功派送并签收的包裹数量', 'field', ['src_all', 'src_tms_hive', 'src_zz_dw', 'src_ads', 'src_tbl_city'], ['cat_all', 'cat_logistics', 'cat_fulfillment', 'cat_dispatch']),
    row('BM-FD-CITY-004', 'zz_tms_ads.ads_express_city_stats.recent_days', '统计最近天数', 'STD_STAT_PERIOD_DAYS', 'BC_STAT_PERIOD', '字段模型', '统计窗口，支持近7天、近30天、近90天', 'field', ['src_all', 'src_tms_hive', 'src_zz_dw', 'src_ads', 'src_tbl_city'], ['cat_all', 'cat_logistics', 'cat_fulfillment', 'cat_dispatch']),
    row('BM-TB-ROUTE-001', 'zz_tms_ads.ads_route_timeout_stats', '线路超时统计表', 'STD_TABLE_ROUTE_TIMEOUT', '--', '表模型', '按线路汇总运输超时率、超时原因与责任组织', 'table', ['src_all', 'src_tms_hive', 'src_zz_dw', 'src_ads', 'src_tbl_route'], ['cat_all', 'cat_logistics', 'cat_capacity', 'cat_route', 'cat_timeout']),
    row('BM-FD-ROUTE-001', 'zz_tms_ads.ads_route_timeout_stats.route_code', '线路编码', 'STD_ROUTE_CODE', '--', '字段模型', '运输线路的业务唯一编码', 'field', ['src_all', 'src_tms_hive', 'src_zz_dw', 'src_ads', 'src_tbl_route'], ['cat_all', 'cat_logistics', 'cat_capacity', 'cat_route']),
    row('BM-FD-ROUTE-002', 'zz_tms_ads.ads_route_timeout_stats.timeout_rate', '超时率', 'STD_RATE_PERCENT', '--', '字段模型', '超时订单数占总订单数的百分比', 'field', ['src_all', 'src_tms_hive', 'src_zz_dw', 'src_ads', 'src_tbl_route'], ['cat_all', 'cat_logistics', 'cat_fulfillment', 'cat_timeout']),
    row('BM-TB-WAYBILL-001', 'zz_tms_dwd.dwd_waybill_detail_di', '运单明细事实表', 'STD_TABLE_WAYBILL_DETAIL', '--', '表模型', '记录运单从创建、揽收、运输到签收的全链路明细', 'table', ['src_all', 'src_tms_hive', 'src_zz_dw', 'src_dwd', 'src_tbl_waybill'], ['cat_all', 'cat_logistics', 'cat_fulfillment', 'cat_waybill']),
    row('BM-FD-WAYBILL-001', 'zz_tms_dwd.dwd_waybill_detail_di.waybill_no', '运单编号', 'STD_WAYBILL_NO', '--', '字段模型', '外部客户可查询的运单业务编号', 'field', ['src_all', 'src_tms_hive', 'src_zz_dw', 'src_dwd', 'src_tbl_waybill'], ['cat_all', 'cat_logistics', 'cat_fulfillment', 'cat_waybill']),
    row('BM-FD-WAYBILL-002', 'zz_tms_dwd.dwd_waybill_detail_di.order_channel', '下单渠道', 'STD_ORDER_CHANNEL', 'BC_ORDER_CHANNEL', '字段模型', '客户提交订单的渠道来源', 'field', ['src_all', 'src_tms_hive', 'src_zz_dw', 'src_dwd', 'src_tbl_waybill'], ['cat_all', 'cat_logistics', 'cat_fulfillment', 'cat_waybill']),
    row('BM-FD-WAYBILL-003', 'zz_tms_dwd.dwd_waybill_detail_di.pay_amount', '支付金额', 'STD_AMOUNT_CNY', '--', '字段模型', '订单实付金额，币种为人民币', 'field', ['src_all', 'src_tms_hive', 'src_zz_dw', 'src_dwd', 'src_tbl_waybill', 'src_tbl_payment'], ['cat_all', 'cat_finance', 'cat_settlement', 'cat_fee']),
    row('BM-FD-WAYBILL-004', 'zz_tms_dwd.dwd_waybill_detail_di.sign_status', '签收状态', 'STD_SIGN_STATUS', 'BC_SIGN_STATUS', '字段模型', '描述运单当前是否已完成签收', 'field', ['src_all', 'src_tms_hive', 'src_zz_dw', 'src_dwd', 'src_tbl_waybill'], ['cat_all', 'cat_logistics', 'cat_fulfillment', 'cat_dispatch']),
    row('BM-TB-CUSTOMER-001', 'zz_tms_dws.dws_customer_profile_1d', '客户画像日表', 'STD_TABLE_CUSTOMER_PROFILE', '--', '表模型', '沉淀客户等级、活跃度、投诉和消费偏好标签', 'table', ['src_all', 'src_tms_hive', 'src_zz_dw', 'src_dws', 'src_tbl_customer'], ['cat_all', 'cat_customer', 'cat_customer_profile']),
    row('BM-FD-CUSTOMER-001', 'zz_tms_dws.dws_customer_profile_1d.customer_id', '客户ID', 'STD_CUSTOMER_ID', '--', '字段模型', '客户主数据的唯一标识', 'field', ['src_all', 'src_tms_hive', 'src_zz_dw', 'src_dws', 'src_tbl_customer'], ['cat_all', 'cat_customer', 'cat_customer_profile', 'cat_customer_basic']),
    row('BM-FD-CUSTOMER-002', 'zz_tms_dws.dws_customer_profile_1d.customer_level', '客户等级', 'STD_CUSTOMER_LEVEL', 'BC_CUSTOMER_LEVEL', '字段模型', '按照消费频次和履约贡献度划分的客户等级', 'field', ['src_all', 'src_tms_hive', 'src_zz_dw', 'src_dws', 'src_tbl_customer'], ['cat_all', 'cat_customer', 'cat_customer_profile', 'cat_customer_label']),
    row('BM-FD-CUSTOMER-003', 'zz_tms_dws.dws_customer_profile_1d.complaint_cnt_30d', '近30天投诉次数', 'STD_COMPLAINT_COUNT', '--', '字段模型', '客户近30天发起投诉的次数', 'field', ['src_all', 'src_tms_hive', 'src_zz_dw', 'src_dws', 'src_tbl_customer', 'src_service_mysql'], ['cat_all', 'cat_customer', 'cat_service', 'cat_complaint']),
    row('BM-TB-FINANCE-001', 'zz_tms_ads.ads_finance_settle_stats', '财务结算统计表', 'STD_TABLE_FINANCE_SETTLE', '--', '表模型', '按客户、组织、线路统计应收、实收和未结金额', 'table', ['src_all', 'src_tms_hive', 'src_zz_dw', 'src_ads', 'src_tbl_finance', 'src_finance_system'], ['cat_all', 'cat_finance', 'cat_settlement']),
    row('BM-FD-FINANCE-001', 'zz_tms_ads.ads_finance_settle_stats.receivable_amount', '应收金额', 'STD_AMOUNT_CNY', '--', '字段模型', '已确认服务但尚未全部回款的应收金额', 'field', ['src_all', 'src_tms_hive', 'src_zz_dw', 'src_ads', 'src_tbl_finance', 'src_settle_mysql'], ['cat_all', 'cat_finance', 'cat_settlement', 'cat_fee']),
    row('BM-FD-FINANCE-002', 'zz_tms_ads.ads_finance_settle_stats.invoice_status', '开票状态', 'STD_INVOICE_STATUS', 'BC_INVOICE_STATUS', '字段模型', '结算单是否已开票、部分开票或未开票', 'field', ['src_all', 'src_tms_hive', 'src_zz_dw', 'src_ads', 'src_tbl_finance', 'src_invoice_mysql'], ['cat_all', 'cat_finance', 'cat_settlement', 'cat_invoice']),
    row('BM-TB-REGION-001', 'zz_tms_dim.dim_region', '行政区划维表', 'STD_TABLE_REGION_DIM', '--', '表模型', '提供省市区县层级行政区划及区域归属', 'table', ['src_all', 'src_tms_hive', 'src_zz_dw', 'src_dim', 'src_tbl_region'], ['cat_all', 'cat_public', 'cat_region']),
    row('BM-FD-REGION-001', 'zz_tms_dim.dim_region.region_code', '行政区划编码', 'STD_REGION_CODE', '--', '字段模型', '国家统计口径的行政区划编码', 'field', ['src_all', 'src_tms_hive', 'src_zz_dw', 'src_dim', 'src_tbl_region'], ['cat_all', 'cat_public', 'cat_region']),
    row('BM-FD-REGION-002', 'zz_tms_dim.dim_region.parent_region_code', '上级区划编码', 'STD_REGION_CODE', '--', '字段模型', '当前行政区划的上级节点编码', 'field', ['src_all', 'src_tms_hive', 'src_zz_dw', 'src_dim', 'src_tbl_region'], ['cat_all', 'cat_public', 'cat_region']),
    row('BM-TB-ORG-001', 'zz_tms_dim.dim_org', '组织机构维表', 'STD_TABLE_ORG_DIM', '--', '表模型', '维护直营网点、分拨中心、承运商等组织结构', 'table', ['src_all', 'src_tms_hive', 'src_zz_dw', 'src_dim', 'src_tbl_org'], ['cat_all', 'cat_public', 'cat_org']),
    row('BM-FD-ORG-001', 'zz_tms_dim.dim_org.org_code', '组织编码', 'STD_ORG_CODE', '--', '字段模型', '组织机构的统一编码', 'field', ['src_all', 'src_tms_hive', 'src_zz_dw', 'src_dim', 'src_tbl_org'], ['cat_all', 'cat_public', 'cat_org']),
    row('BM-FD-ORG-002', 'zz_tms_dim.dim_org.org_type', '组织类型', 'STD_ORG_TYPE', 'BC_ORG_TYPE', '字段模型', '直营网点、加盟网点、分拨中心、承运商等类型', 'field', ['src_all', 'src_tms_hive', 'src_zz_dw', 'src_dim', 'src_tbl_org'], ['cat_all', 'cat_public', 'cat_org'])
  ];

  metadataRows.forEach(function (item, index) {
    item.id = index + 1;
  });

  var taskRows = [
    { id: 1, fileName: '业务元数据导入-物流履约域-20260520.xlsx', attr: '导入', status: '处理成功', success: 36, fail: 0, total: 36, operator: '王敏', time: '2026-05-20 09:32:18' },
    { id: 2, fileName: '业务元数据导出-运单主题-20260519.xlsx', attr: '导出', status: '处理成功', success: 24, fail: 0, total: 24, operator: '张三', time: '2026-05-19 17:46:05' },
    { id: 3, fileName: '字段元数据补录-财务结算域-20260518.xlsx', attr: '导入', status: '处理失败', success: 18, fail: 2, total: 20, operator: '李倩', time: '2026-05-18 14:12:44' },
    { id: 4, fileName: '标准映射结果导出-客户服务域-20260517.xlsx', attr: '导出', status: '处理成功', success: 31, fail: 0, total: 31, operator: '陈明', time: '2026-05-17 11:26:39' }
  ];

  var aiRows = [
    { id: 1, tableName: 'zz_tms_dwd.dwd_waybill_detail_di', alias: '运单明细事实表', fieldCount: 42, status: '处理完成', done: 39, total: 42, rate: '92.9%', content: '别名填充、标准引用、备注补全', mechanism: '有值跳过', operator: 'zhangsan（张三）', time: '2026-05-20 10:24:18' },
    { id: 2, tableName: 'zz_tms_ads.ads_driver_stats', alias: '司机绩效统计表', fieldCount: 28, status: '处理中', done: 18, total: 28, rate: '--', content: '标准引用、业务代码引用', mechanism: '有值跳过', operator: 'lisi（李四）', time: '2026-05-20 09:41:02' },
    { id: 3, tableName: 'zz_tms_ads.ads_finance_settle_stats', alias: '财务结算统计表', fieldCount: 35, status: '处理完成', done: 33, total: 35, rate: '94.3%', content: '标准引用、数据分类', mechanism: '有值覆盖', operator: 'wangmin（王敏）', time: '2026-05-19 16:38:55' },
    { id: 4, tableName: 'zz_tms_dws.dws_customer_profile_1d', alias: '客户画像日表', fieldCount: 31, status: '处理失败', done: 0, total: 31, rate: '0%', content: '别名填充、备注补全', mechanism: '有值覆盖', operator: 'chenming（陈明）', time: '2026-05-18 15:08:27' },
    { id: 5, tableName: 'zz_tms_dim.dim_region', alias: '行政区划维表', fieldCount: 18, status: '处理完成', done: 18, total: 18, rate: '100%', content: '标准引用', mechanism: '有值跳过', operator: 'zhangsan（张三）', time: '2026-05-17 13:26:10' },
    { id: 6, tableName: 'zz_tms_ads.ads_route_timeout_stats', alias: '线路超时统计表', fieldCount: 26, status: '处理完成', done: 22, total: 26, rate: '84.6%', content: '业务代码引用、备注补全', mechanism: '有值跳过', operator: 'liuqing（刘青）', time: '2026-05-16 18:04:31' }
  ];

  var state = {
    sideTab: 'source',
    activeTab: 'list',
    treeKey: 'src_all',
    page: 1,
    pageSize: 20,
    sortKey: '',
    sortDir: 'asc',
    selectedIds: {},
    filters: {
      metaModel: '',
      standard: '',
      bizCode: '',
      keyword: ''
    },
    taskFilters: {
      attr: '',
      status: '',
      keyword: ''
    },
    aiFilters: {
      status: '',
      keyword: ''
    },
    logContext: null
  };

  function resetState() {
    state.sideTab = 'source';
    state.activeTab = 'list';
    state.treeKey = 'src_all';
    state.page = 1;
    state.pageSize = 20;
    state.sortKey = '';
    state.sortDir = 'asc';
    state.selectedIds = {};
    state.filters = { metaModel: '', standard: '', bizCode: '', keyword: '' };
    state.taskFilters = { attr: '', status: '', keyword: '' };
    state.aiFilters = { status: '', keyword: '' };
    state.logContext = null;
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function hasValue(value) {
    return value && value !== '--';
  }

  function getRowById(id) {
    return metadataRows.filter(function (item) { return String(item.id) === String(id); })[0];
  }

  function currentTree() {
    return state.sideTab === 'catalog' ? catalogTree : sourceTree;
  }

  function treeContainsKey(node, key) {
    if (node.key === key) return true;
    return (node.children || []).some(function (child) {
      return treeContainsKey(child, key);
    });
  }

  function currentRootKey() {
    return state.sideTab === 'catalog' ? 'cat_all' : 'src_all';
  }

  function treeKeyField() {
    return state.sideTab === 'catalog' ? 'catalogKeys' : 'sourceKeys';
  }

  function getFilteredRows() {
    var keyword = state.filters.keyword.trim().toLowerCase();
    var keyField = treeKeyField();
    var rows = metadataRows.filter(function (item) {
      if (state.treeKey && item[keyField].indexOf(state.treeKey) < 0) return false;
      if (state.filters.metaModel && item.metaModel !== state.filters.metaModel) return false;
      if (state.filters.standard === 'linked' && !hasValue(item.standard)) return false;
      if (state.filters.standard === 'unlinked' && hasValue(item.standard)) return false;
      if (state.filters.bizCode === 'linked' && !hasValue(item.bizCode)) return false;
      if (state.filters.bizCode === 'unlinked' && hasValue(item.bizCode)) return false;
      if (!keyword) return true;
      return [item.code, item.name, item.alias, item.standard, item.bizCode, item.remark].join(' ').toLowerCase().indexOf(keyword) >= 0;
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

  function getVisibleRows() {
    var rows = getFilteredRows();
    var totalPages = Math.max(1, Math.ceil(rows.length / state.pageSize));
    if (state.page > totalPages) state.page = totalPages;
    var start = (state.page - 1) * state.pageSize;
    return rows.slice(start, start + state.pageSize);
  }

  function getSelectedRows() {
    return Object.keys(state.selectedIds).map(getRowById).filter(Boolean);
  }

  function renderTreeNodes(nodes) {
    return nodes.map(function (node) {
      var children = node.children || [];
      var hasChildren = children.length > 0;
      var isActive = node.key === state.treeKey;
      var shouldOpen = node.open || isActive || children.some(function (child) { return treeContainsKey(child, state.treeKey); });
      var childHtml = hasChildren ? '<ul>' + renderTreeNodes(children) + '</ul>' : '';
      return '<li class="bm-tree-node' + (shouldOpen ? ' bm-open' : '') + '" data-bm-tree-node>' +
        '<div class="bm-tree-row' + (isActive ? ' active' : '') + '" data-bm-tree-key="' + escapeHtml(node.key) + '">' +
          (hasChildren ? '<button class="bm-tree-toggle" type="button" aria-label="展开"><i class="bi ' + (shouldOpen ? 'bi-chevron-down' : 'bi-chevron-right') + '"></i></button>' : '<span class="bm-tree-spacer"></span>') +
          '<i class="bi ' + node.icon + ' ' + node.iconClass + '"></i>' +
          '<span>' + escapeHtml(node.label) + '</span>' +
        '</div>' +
        childHtml +
      '</li>';
    }).join('');
  }

  function applyTreeSearch(page) {
    var input = page.querySelector('[data-bm-tree-search]');
    var keyword = input ? input.value.trim().toLowerCase() : '';
    page.querySelectorAll('[data-bm-tree-node]').forEach(function (node) {
      var matched = !keyword || node.textContent.toLowerCase().indexOf(keyword) >= 0;
      node.classList.toggle('bm-tree-hidden', !matched);
      if (keyword && matched) {
        node.classList.add('bm-open');
        var icon = node.querySelector(':scope > .bm-tree-row .bm-tree-toggle i');
        if (icon) icon.className = 'bi bi-chevron-down';
      }
    });
  }

  function renderTree(page) {
    var tree = page.querySelector('[data-bm-tree]');
    if (tree) tree.innerHTML = renderTreeNodes(currentTree());
    page.querySelectorAll('[data-bm-side-tab]').forEach(function (tab) {
      tab.classList.toggle('active', tab.getAttribute('data-bm-side-tab') === state.sideTab);
    });
    applyTreeSearch(page);
  }

  function sortHeader(key, label) {
    return '<button class="bm-th-sort" type="button" data-bm-sort="' + key + '">' +
      '<span>' + label + '</span>' +
      '<span class="bm-sort-stack"><i class="bi bi-caret-up-fill"></i><i class="bi bi-caret-down-fill"></i></span>' +
    '</button>';
  }

  function renderPager(total) {
    var totalPages = Math.max(1, Math.ceil(total / state.pageSize));
    var start = total ? (state.page - 1) * state.pageSize + 1 : 0;
    var end = Math.min(state.page * state.pageSize, total);
    var pages = '';
    for (var i = 1; i <= totalPages; i++) {
      if (totalPages > 8 && i > 5 && i < totalPages) {
        if (i === 6) pages += '<span class="bm-page-ellipsis">...</span>';
        continue;
      }
      pages += '<button class="bm-page-num ' + (i === state.page ? 'active' : '') + '" data-bm-page="' + i + '">' + i + '</button>';
    }
    return '<div class="bm-pagination">' +
      '<div class="bm-page-info">显示第 ' + start + ' 到第 ' + end + ' 条记录，共 ' + total + ' 条记录，每页显示 ' +
        '<select class="bm-page-size" data-bm-page-size aria-label="每页显示条数">' +
          '<option value="10"' + (state.pageSize === 10 ? ' selected' : '') + '>10</option>' +
          '<option value="20"' + (state.pageSize === 20 ? ' selected' : '') + '>20</option>' +
          '<option value="50"' + (state.pageSize === 50 ? ' selected' : '') + '>50</option>' +
        '</select> 条记录' +
      '</div>' +
      '<div class="bm-page-nav">' +
        '<button class="bm-page-btn" data-bm-page="prev" ' + (state.page === 1 ? 'disabled' : '') + '>上一页</button>' +
        pages +
        '<button class="bm-page-btn" data-bm-page="next" ' + (state.page === totalPages ? 'disabled' : '') + '>下一页</button>' +
      '</div>' +
    '</div>';
  }

  function renderMainTabs() {
    var activeKey = state.activeTab === 'log' && state.logContext ? state.logContext.previousTab : state.activeTab;
    var tabs = [
      { key: 'list', text: '数据列表' },
      { key: 'task', text: '任务查看' },
      { key: 'ai', text: 'AI处理记录' }
    ];
    return tabs.map(function (tab) {
      return '<button class="bm-main-tab ' + (activeKey === tab.key ? 'active' : '') + '" data-bm-main-tab="' + tab.key + '" type="button">' + tab.text + '</button>';
    }).join('');
  }

  function renderValueLink(value) {
    if (!hasValue(value)) return '<span class="bm-empty-value">--</span>';
    return '<a class="bm-link" href="javascript:;">' + escapeHtml(value) + '</a>';
  }

  function renderDataRow(item) {
    return '<tr data-bm-row="' + item.id + '">' +
      '<td class="bm-col-check"><input type="checkbox" data-bm-row-check="' + item.id + '"' + (state.selectedIds[item.id] ? ' checked' : '') + ' aria-label="选择记录"></td>' +
      '<td title="' + escapeHtml(item.code) + '">' + escapeHtml(item.code) + '</td>' +
      '<td title="' + escapeHtml(item.name) + '">' + escapeHtml(item.name) + '</td>' +
      '<td title="' + escapeHtml(item.alias) + '">' + renderValueLink(item.alias) + '</td>' +
      '<td title="' + escapeHtml(item.standard) + '">' + renderValueLink(item.standard) + '</td>' +
      '<td title="' + escapeHtml(item.bizCode) + '">' + renderValueLink(item.bizCode) + '</td>' +
      '<td title="' + escapeHtml(item.metaModel) + '">' + escapeHtml(item.metaModel) + '</td>' +
      '<td title="' + escapeHtml(item.remark) + '">' + escapeHtml(item.remark) + '</td>' +
      '<td class="bm-actions">' +
        '<button class="bm-action-btn" type="button" data-bm-action="view" data-id="' + item.id + '"><i class="bi bi-search"></i><span>查看</span></button>' +
        '<button class="bm-action-btn" type="button" data-bm-action="edit" data-id="' + item.id + '"><i class="bi bi-pencil-square"></i><span>编辑</span></button>' +
        '<button class="bm-action-btn danger" type="button" data-bm-action="delete-row" data-id="' + item.id + '"><i class="bi bi-trash3"></i><span>删除</span></button>' +
      '</td>' +
    '</tr>';
  }

  function renderDataList() {
    var rows = getFilteredRows();
    var visibleRows = getVisibleRows();
    return '<div class="bm-toolbar">' +
      '<div class="bm-toolbar-left">' +
        '<button class="btn btn-primary" type="button" data-bm-action="import"><i class="bi bi-upload"></i> 导入</button>' +
        '<button class="btn btn-primary" type="button" data-bm-action="export"><i class="bi bi-download"></i> 导出</button>' +
        '<button class="btn btn-danger" type="button" data-bm-action="delete-selected"><i class="bi bi-trash3"></i> 删除</button>' +
        '<button class="btn btn-primary" type="button" data-bm-action="ai-process"><i class="bi bi-robot"></i> AI智能处理</button>' +
        '<button class="btn btn-primary" type="button" data-bm-action="create-standard"><i class="bi bi-plus-lg"></i> 创建标准</button>' +
      '</div>' +
      '<div class="bm-toolbar-right">' +
        '<label class="bm-filter"><span>元数据类型</span><select data-bm-filter="metaModel"><option value="">全部</option><option value="库模型">库模型</option><option value="表模型">表模型</option><option value="字段模型">字段模型</option></select></label>' +
        '<label class="bm-filter"><span>引用标准</span><select data-bm-filter="standard"><option value="">全部</option><option value="linked">已引用</option><option value="unlinked">未引用</option></select></label>' +
        '<label class="bm-filter"><span>引用业务代码</span><select data-bm-filter="bizCode"><option value="">全部</option><option value="linked">已引用</option><option value="unlinked">未引用</option></select></label>' +
        '<div class="bm-keyword-box"><input type="text" data-bm-keyword value="' + escapeHtml(state.filters.keyword) + '" placeholder="编码/名称/别名/备注" aria-label="编码名称别名备注"><button class="btn btn-primary" type="button" data-bm-action="query"><i class="bi bi-search"></i> 查询</button></div>' +
      '</div>' +
    '</div>' +
    '<div class="bm-table-wrap">' +
      '<table class="bm-table">' +
        '<colgroup><col class="bm-w-check"><col class="bm-w-code"><col class="bm-w-name"><col class="bm-w-alias"><col class="bm-w-standard"><col class="bm-w-biz"><col class="bm-w-model"><col class="bm-w-remark"><col class="bm-w-action"></colgroup>' +
        '<thead><tr>' +
          '<th class="bm-col-check"><input type="checkbox" data-bm-check-all aria-label="全选"></th>' +
          '<th>' + sortHeader('code', '编码') + '</th>' +
          '<th>' + sortHeader('name', '名称') + '</th>' +
          '<th>' + sortHeader('alias', '别名') + '</th>' +
          '<th>' + sortHeader('standard', '引用标准') + '</th>' +
          '<th>' + sortHeader('bizCode', '引用业务代码') + '</th>' +
          '<th>' + sortHeader('metaModel', '元模型') + '</th>' +
          '<th>' + sortHeader('remark', '备注') + '</th>' +
          '<th>操作</th>' +
        '</tr></thead>' +
        '<tbody>' + (visibleRows.length ? visibleRows.map(renderDataRow).join('') : '<tr class="bm-empty-row"><td colspan="9">暂无匹配的业务元数据</td></tr>') + '</tbody>' +
      '</table>' +
    '</div>' +
    renderPager(rows.length);
  }

  function renderTaskStatus(status) {
    var cls = status === '处理成功' ? 'success' : (status === '处理中' ? 'running' : 'failed');
    return '<span class="bm-task-status ' + cls + '">' + status + '</span>';
  }

  function getTaskById(id) {
    return taskRows.filter(function (item) { return String(item.id) === String(id); })[0];
  }

  function getAiById(id) {
    return aiRows.filter(function (item) { return String(item.id) === String(id); })[0];
  }

  function getTaskRows() {
    var keyword = state.taskFilters.keyword.trim().toLowerCase();
    return taskRows.filter(function (item) {
      if (state.taskFilters.attr && item.attr !== state.taskFilters.attr) return false;
      if (state.taskFilters.status && item.status !== state.taskFilters.status) return false;
      if (!keyword) return true;
      return item.fileName.toLowerCase().indexOf(keyword) >= 0;
    });
  }

  function renderTaskRow(item) {
    return '<tr>' +
      '<td title="' + escapeHtml(item.fileName) + '">' + escapeHtml(item.fileName) + '</td>' +
      '<td><span class="bm-task-attr">' + escapeHtml(item.attr) + '</span></td>' +
      '<td>' + renderTaskStatus(item.status) + '</td>' +
      '<td><span class="bm-success">' + item.success + '</span>/<span class="bm-fail">' + item.fail + '</span>/' + item.total + '</td>' +
      '<td>' + escapeHtml(item.operator) + '</td>' +
      '<td>' + escapeHtml(item.time) + '</td>' +
      '<td><button class="bm-action-btn" type="button" data-bm-action="task-log" data-id="' + item.id + '"><i class="bi bi-file-text"></i><span>查看日志</span></button></td>' +
    '</tr>';
  }

  function renderTaskView() {
    var rows = getTaskRows();
    return '<div class="bm-toolbar bm-toolbar-compact">' +
      '<div class="bm-toolbar-left"></div>' +
      '<div class="bm-toolbar-right">' +
        '<label class="bm-filter"><select data-bm-task-filter="attr"><option value="">属性</option><option value="导入">导入</option><option value="导出">导出</option></select></label>' +
        '<label class="bm-filter"><select data-bm-task-filter="status"><option value="">状态</option><option value="处理成功">处理成功</option><option value="处理中">处理中</option><option value="处理失败">处理失败</option></select></label>' +
        '<div class="bm-keyword-box"><input type="text" data-bm-task-keyword value="' + escapeHtml(state.taskFilters.keyword) + '" placeholder="文件名" aria-label="文件名"><button class="btn btn-primary" type="button" data-bm-action="query-task"><i class="bi bi-search"></i> 查询</button></div>' +
      '</div>' +
    '</div>' +
    '<div class="bm-table-wrap">' +
      '<table class="bm-table bm-task-table">' +
        '<colgroup><col class="bm-task-file"><col class="bm-task-attr-col"><col class="bm-task-status-col"><col class="bm-task-count"><col class="bm-task-user"><col class="bm-task-time"><col class="bm-task-action"></colgroup>' +
        '<thead><tr><th>文件名</th><th>属性</th><th>状态</th><th>处理记录数(成功/失败/总量)</th><th>操作者</th><th>时间</th><th>操作</th></tr></thead>' +
        '<tbody>' + (rows.length ? rows.map(renderTaskRow).join('') : '<tr class="bm-empty-row"><td colspan="7">暂无匹配的任务记录</td></tr>') + '</tbody>' +
      '</table>' +
    '</div>' +
    '<div class="bm-footnote">显示第 1 到第 ' + rows.length + ' 条记录，共 ' + rows.length + ' 条记录</div>';
  }

  function renderAiStatus(status) {
    var cls = status === '处理完成' ? 'done' : (status === '处理中' ? 'running' : 'failed');
    return '<span class="bm-ai-status ' + cls + '">' + status + '</span>';
  }

  function getAiRows() {
    var keyword = state.aiFilters.keyword.trim().toLowerCase();
    return aiRows.filter(function (item) {
      if (state.aiFilters.status && item.status !== state.aiFilters.status) return false;
      if (!keyword) return true;
      return [item.tableName, item.alias, item.content, item.operator].join(' ').toLowerCase().indexOf(keyword) >= 0;
    });
  }

  function renderAiRow(item) {
    return '<tr>' +
      '<td title="' + escapeHtml(item.tableName) + '">' + escapeHtml(item.tableName) + '</td>' +
      '<td title="' + escapeHtml(item.alias) + '">' + escapeHtml(item.alias) + '</td>' +
      '<td>' + item.fieldCount + '</td>' +
      '<td>' + renderAiStatus(item.status) + '</td>' +
      '<td>' + item.done + '/' + item.total + '</td>' +
      '<td>' + escapeHtml(item.rate) + '</td>' +
      '<td title="' + escapeHtml(item.content) + '">' + escapeHtml(item.content) + '</td>' +
      '<td>' + escapeHtml(item.mechanism) + '</td>' +
      '<td>' + escapeHtml(item.operator) + '</td>' +
      '<td>' + escapeHtml(item.time) + '</td>' +
      '<td><button class="bm-action-btn" type="button" data-bm-action="ai-log" data-id="' + item.id + '"><i class="bi bi-file-text"></i><span>查看日志</span></button></td>' +
    '</tr>';
  }

  function renderAiView() {
    var rows = getAiRows();
    return '<div class="bm-toolbar bm-toolbar-compact">' +
      '<div class="bm-toolbar-left"></div>' +
      '<div class="bm-toolbar-right">' +
        '<label class="bm-filter"><span>状态:</span><select data-bm-ai-filter="status"><option value="">请选择</option><option value="处理中">处理中</option><option value="处理完成">处理完成</option><option value="处理失败">处理失败</option></select></label>' +
        '<div class="bm-keyword-box bm-keyword-wide"><input type="text" data-bm-ai-keyword value="' + escapeHtml(state.aiFilters.keyword) + '" placeholder="名称关键词查询" aria-label="名称关键词查询"><button class="btn btn-primary" type="button" data-bm-action="query-ai"><i class="bi bi-search"></i> 查询</button></div>' +
      '</div>' +
    '</div>' +
    '<div class="bm-table-wrap bm-table-wrap-fit">' +
      '<table class="bm-table bm-ai-table">' +
        '<colgroup><col class="bm-ai-name"><col class="bm-ai-alias"><col class="bm-ai-fields"><col class="bm-ai-status-col"><col class="bm-ai-result"><col class="bm-ai-rate"><col class="bm-ai-content"><col class="bm-ai-mechanism"><col class="bm-ai-user"><col class="bm-ai-time"><col class="bm-ai-action"></colgroup>' +
        '<thead><tr><th>表英文名称</th><th>别名</th><th>字段数</th><th>状态</th><th>结果（已标注/总数）</th><th>标注成功率</th><th>处理内容</th><th>填充机制</th><th>操作者</th><th>时间</th><th>操作</th></tr></thead>' +
        '<tbody>' + (rows.length ? rows.map(renderAiRow).join('') : '<tr class="bm-empty-row"><td colspan="11">暂无匹配的AI处理记录</td></tr>') + '</tbody>' +
      '</table>' +
    '</div>' +
    '<div class="bm-ai-pagination"><span>第1-' + Math.min(rows.length, 10) + '条记录，共' + (rows.length + 122) + '条记录，每页显示</span><select><option>10</option><option>20</option></select><span>记录</span><div class="bm-page-nav"><button class="bm-page-btn disabled">上一页</button><button class="bm-page-num active">1</button><button class="bm-page-num">2</button><button class="bm-page-num">3</button><button class="bm-page-num">4</button><button class="bm-page-num">5</button><span class="bm-page-ellipsis">...</span><button class="bm-page-num">13</button><button class="bm-page-btn">下一页</button></div></div>';
  }

  function buildLogPrefix(flowId) {
    return '21-05-2026 10:24:18 CST data-meta-flow-' + flowId + ' INFO - ';
  }

  function buildTaskTechnicalLog(item) {
    var flowId = 'bm-' + String(item.id).padStart(4, '0') + '-a7c5f09d6b41e28f90c01d2e';
    var prefix = buildLogPrefix(flowId);
    var sourceFile = '/data/upload/business_metadata/' + item.fileName;
    var targetTable = item.attr === '导出' ? 'tmp_export_business_metadata' : 'ods_business_metadata_import_tmp';
    var lines = [
      prefix + 'Starting job data-meta-flow-' + flowId + ' at 1747794258201',
      prefix + 'job JVM args: -Ddataplat.flowid=data-asset-metadata -Ddataplat.execid=' + (180420 + item.id) + ' -Ddataplat.jobid=' + flowId,
      prefix + 'effective user is metadata_admin',
      prefix + 'Building command job executor.',
      prefix + 'Memory granted for job data-meta-flow-' + flowId,
      prefix + '1 commands to execute.',
      prefix + 'cwd=/home/dataplat/executor/metadata/executions/' + (180420 + item.id),
      prefix + 'BusinessMetadataTask - begin read file: ' + sourceFile,
      prefix + 'BusinessMetadataTask - template columns: code,name,alias,standard_code,business_code,metamodel,remark',
      prefix + 'BusinessMetadataTask - total rows parsed: ' + item.total,
      prefix + 'HiveWriter$Task - begin do write...',
      prefix + 'HiveWriter$Task - write to file: hdfs://192.168.5.118:8020/user/dp/tmp/business_metadata/' + flowId + '/part-00000',
      prefix + 'HiveWriter$Task - insertCmd ---> insert overwrite table metadata.' + targetTable + ' partition(dt=20260521) select code,name,alias,standard_code,business_code,metamodel,remark from tmp_' + flowId.replace(/-/g, '_'),
      prefix + 'UserGroupInformation - Login successful for user metadata_admin using keytab file /home/dataplat/keytab/metadata.keytab',
      prefix + 'HiveConnection - Will try to open client transport with JDBC Uri: jdbc:hive2://192.168.5.119:10000/metadata;principal=hive/_HOST@DATAPLAT.COM',
      prefix + 'StandAloneJobContainerCommunicator - total ' + item.success + ' records, failed ' + item.fail + ' records, total bytes ' + (item.success * 128) + ', speed 0B/s, progress 100.00%'
    ];
    if (item.fail > 0) {
      lines.push(prefix + 'ERROR - row 12 standard_code STD_ROUTE_TIMEOUT_RATE_OLD not found in dim_standard_code');
      lines.push(prefix + 'ERROR - row 17 business_code BC_INVOICE_STATUS has empty code value mapping');
      lines.push(prefix + 'BusinessMetadataTask - job finished with validation errors.');
    } else {
      lines.push(prefix + 'BusinessMetadataTask - commit metadata changes success.');
      lines.push(prefix + 'BusinessMetadataTask - job finished successfully.');
    }
    return lines.join('\n');
  }

  function buildAiTechnicalLog(item) {
    var flowId = 'ai-' + String(item.id).padStart(4, '0') + '-e9f7b2d4a8130c55f11fcc0b';
    var prefix = buildLogPrefix(flowId);
    var tableName = item.tableName;
    var lines = [
      prefix + 'Starting job data-meta-flow-' + flowId + ' at 1747794314026',
      prefix + 'job JVM args: -Ddataplat.flowid=ai-business-metadata -Ddataplat.execid=' + (190610 + item.id) + ' -Ddataplat.jobid=' + flowId,
      prefix + 'user.to.proxy property was not set, defaulting to submit user metadata_ai',
      prefix + 'effective user is metadata_ai',
      prefix + 'Building command job executor.',
      prefix + 'Memory granted for job data-meta-flow-' + flowId,
      prefix + 'AIMetadataFillTask - begin scan table: ' + tableName,
      prefix + 'AIMetadataFillTask - process content: ' + item.content,
      prefix + 'AIMetadataFillTask - fill strategy: ' + item.mechanism,
      prefix + 'AIMetadataFillTask - loading field profile from metadata_catalog.field_profile where table_name = "' + tableName + '"',
      prefix + 'AIMetadataFillTask - prompt version: business-meta-fill-v20260521',
      prefix + 'AIMetadataFillTask - matched candidate standards from dim_data_standard and dim_business_code',
      prefix + 'HiveWriter$Task - begin do write...',
      prefix + 'HiveWriter$Task - write to file: hdfs://192.168.5.118:8020/user/dp/tmp/ai_metadata_fill/' + flowId + '/result.json',
      prefix + 'HiveWriter$Task - insertCmd ---> insert overwrite table metadata.ai_fill_result partition(dt=20260521) select table_name,field_name,alias_name,standard_code,business_code,confidence from tmp_ai_fill_' + item.id,
      prefix + 'StandAloneJobContainerCommunicator - total ' + item.total + ' records, marked ' + item.done + ' records, success rate ' + item.rate + ', speed 0B/s, progress ' + (item.status === '处理中' ? '62.00%' : '100.00%')
    ];
    if (item.status === '处理失败') {
      lines.push(prefix + 'ERROR - AI model returned empty business definition for required field group.');
      lines.push(prefix + 'ERROR - AIMetadataFillTask - job failed, please complete table description and retry.');
    } else if (item.status === '处理中') {
      lines.push(prefix + 'AIMetadataFillTask - waiting for standard matching confirmation, task is still running.');
      lines.push(prefix + 'AIMetadataFillTask - heartbeat received from worker thread ai-fill-worker-03.');
    } else {
      lines.push(prefix + 'AIMetadataFillTask - write alias, standard and business code suggestions success.');
      lines.push(prefix + 'AIMetadataFillTask - job finished successfully.');
    }
    return lines.join('\n');
  }

  function renderLogView() {
    var context = state.logContext || {};
    var isAi = context.type === 'ai';
    var item = isAi ? getAiById(context.id) : getTaskById(context.id);
    if (!item) {
      return '<div class="bm-log-empty"><button class="btn btn-outline" type="button" data-bm-action="back-log"><i class="bi bi-arrow-left"></i> 返回</button><span>未找到日志记录</span></div>';
    }
    var title = isAi ? 'AI处理日志' : '任务处理日志';
    var name = isAi ? item.tableName : item.fileName;
    var logText = isAi ? buildAiTechnicalLog(item) : buildTaskTechnicalLog(item);
    return '<div class="bm-log-view">' +
      '<div class="bm-log-header">' +
        '<button class="btn btn-outline" type="button" data-bm-action="back-log"><i class="bi bi-arrow-left"></i> 返回</button>' +
        '<div><h3>' + title + '</h3><p title="' + escapeHtml(name) + '">' + escapeHtml(name) + '</p></div>' +
      '</div>' +
      '<pre class="bm-tech-log">' + escapeHtml(logText) + '</pre>' +
    '</div>';
  }

  function renderContent(page) {
    var tabs = page.querySelector('[data-bm-tabs]');
    var view = page.querySelector('[data-bm-view]');
    if (tabs) tabs.innerHTML = renderMainTabs();
    if (!view) return;
    if (state.activeTab === 'log') view.innerHTML = renderLogView();
    else if (state.activeTab === 'task') view.innerHTML = renderTaskView();
    else if (state.activeTab === 'ai') view.innerHTML = renderAiView();
    else view.innerHTML = renderDataList();

    Object.keys(state.filters).forEach(function (key) {
      var filter = view.querySelector('[data-bm-filter="' + key + '"]');
      if (filter) filter.value = state.filters[key];
    });
    Object.keys(state.taskFilters).forEach(function (key) {
      var filter = view.querySelector('[data-bm-task-filter="' + key + '"]');
      if (filter) filter.value = state.taskFilters[key];
    });
    Object.keys(state.aiFilters).forEach(function (key) {
      var filter = view.querySelector('[data-bm-ai-filter="' + key + '"]');
      if (filter) filter.value = state.aiFilters[key];
    });

    updateCheckAll(page);
    updateSortButtons(page);
  }

  function updateCheckAll(page) {
    var checkAll = page.querySelector('[data-bm-check-all]');
    if (!checkAll) return;
    var visibleRows = getVisibleRows();
    var checked = visibleRows.filter(function (item) { return state.selectedIds[item.id]; }).length;
    checkAll.checked = visibleRows.length > 0 && checked === visibleRows.length;
    checkAll.indeterminate = checked > 0 && checked < visibleRows.length;
  }

  function updateSortButtons(page) {
    page.querySelectorAll('[data-bm-sort]').forEach(function (button) {
      var key = button.getAttribute('data-bm-sort');
      if (key === state.sortKey) button.setAttribute('data-sort-dir', state.sortDir);
      else button.removeAttribute('data-sort-dir');
    });
  }

  function showToast(page, text) {
    var old = page.querySelector('.bm-toast');
    if (old) old.remove();
    var toast = document.createElement('div');
    toast.className = 'bm-toast';
    toast.textContent = text;
    page.appendChild(toast);
    setTimeout(function () { toast.classList.add('show'); }, 10);
    setTimeout(function () {
      toast.classList.remove('show');
      setTimeout(function () { if (toast.parentNode) toast.remove(); }, 180);
    }, 1800);
  }

  function closeModal(page) {
    var modal = page.querySelector('[data-bm-modal-mask]');
    if (modal) modal.remove();
  }

  function renderInfoItem(label, value) {
    return '<div class="bm-info-item"><span>' + escapeHtml(label) + '</span><strong title="' + escapeHtml(value) + '">' + escapeHtml(value) + '</strong></div>';
  }

  function openViewModal(page, rowId) {
    var item = getRowById(rowId);
    if (!item) return;
    closeModal(page);
    page.insertAdjacentHTML('beforeend',
      '<div class="bm-modal-mask" data-bm-modal-mask>' +
        '<div class="bm-modal bm-detail-modal" role="dialog" aria-modal="true" aria-label="业务元数据详情">' +
          '<div class="bm-modal-header"><h3>业务元数据详情</h3><button class="bm-modal-close" data-bm-action="close-modal" type="button" aria-label="关闭"><i class="bi bi-x-lg"></i></button></div>' +
          '<div class="bm-detail-grid">' +
            renderInfoItem('编码', item.code) +
            renderInfoItem('名称', item.name) +
            renderInfoItem('别名', item.alias) +
            renderInfoItem('元模型', item.metaModel) +
            renderInfoItem('引用标准', item.standard) +
            renderInfoItem('引用业务代码', item.bizCode) +
            renderInfoItem('备注', item.remark) +
          '</div>' +
          '<div class="bm-modal-footer"><button class="btn btn-primary" data-bm-action="close-modal" type="button"><i class="bi bi-check-lg"></i> 确定</button></div>' +
        '</div>' +
      '</div>');
  }

  function inputRow(name, label, value) {
    return '<label class="bm-form-row"><span>' + label + '</span><input data-bm-edit="' + name + '" value="' + escapeHtml(value) + '"></label>';
  }

  function openEditModal(page, rowId) {
    var item = getRowById(rowId);
    if (!item) return;
    closeModal(page);
    page.insertAdjacentHTML('beforeend',
      '<div class="bm-modal-mask" data-bm-modal-mask>' +
        '<div class="bm-modal" role="dialog" aria-modal="true" aria-label="编辑业务元数据" data-edit-id="' + item.id + '">' +
          '<div class="bm-modal-header"><h3>编辑业务元数据</h3><button class="bm-modal-close" data-bm-action="close-modal" type="button" aria-label="关闭"><i class="bi bi-x-lg"></i></button></div>' +
          '<div class="bm-modal-body">' +
            inputRow('code', '编码', item.code) +
            inputRow('name', '名称', item.name) +
            inputRow('alias', '别名', item.alias) +
            inputRow('standard', '引用标准', item.standard) +
            inputRow('bizCode', '业务代码', item.bizCode) +
            '<label class="bm-form-row"><span>元模型</span><select data-bm-edit="metaModel"><option value="库模型">库模型</option><option value="表模型">表模型</option><option value="字段模型">字段模型</option></select></label>' +
            '<label class="bm-form-row bm-form-area"><span>备注</span><textarea data-bm-edit="remark">' + escapeHtml(item.remark) + '</textarea></label>' +
          '</div>' +
          '<div class="bm-modal-footer"><button class="btn btn-primary" data-bm-action="save-edit" type="button"><i class="bi bi-save"></i> 保存</button><button class="btn btn-outline" data-bm-action="close-modal" type="button"><i class="bi bi-x-lg"></i> 取消</button></div>' +
        '</div>' +
      '</div>');
    var select = page.querySelector('[data-bm-edit="metaModel"]');
    if (select) select.value = item.metaModel;
  }

  function openImportModal(page) {
    closeModal(page);
    page.insertAdjacentHTML('beforeend',
      '<div class="bm-modal-mask" data-bm-modal-mask>' +
        '<div class="bm-modal" role="dialog" aria-modal="true" aria-label="导入业务元数据">' +
          '<div class="bm-modal-header"><h3>导入业务元数据</h3><button class="bm-modal-close" data-bm-action="close-modal" type="button" aria-label="关闭"><i class="bi bi-x-lg"></i></button></div>' +
          '<div class="bm-modal-body">' +
            '<div class="bm-upload-box"><i class="bi bi-file-earmark-arrow-up"></i><strong>业务元数据导入模板.xlsx</strong><span>支持字段别名、引用标准、业务代码、备注批量维护</span></div>' +
            '<label class="bm-form-row"><span>导入属性</span><select data-bm-import-attr><option>导入</option><option>覆盖导入</option><option>仅校验</option></select></label>' +
            '<label class="bm-form-row"><span>冲突策略</span><select><option>有值跳过</option><option>有值覆盖</option></select></label>' +
          '</div>' +
          '<div class="bm-modal-footer"><button class="btn btn-primary" data-bm-action="save-import" type="button"><i class="bi bi-play-fill"></i> 开始导入</button><button class="btn btn-outline" data-bm-action="close-modal" type="button"><i class="bi bi-x-lg"></i> 取消</button></div>' +
        '</div>' +
      '</div>');
  }

  function openAiModal(page) {
    closeModal(page);
    var count = getSelectedRows().length || getVisibleRows().length;
    page.insertAdjacentHTML('beforeend',
      '<div class="bm-modal-mask" data-bm-modal-mask>' +
        '<div class="bm-modal" role="dialog" aria-modal="true" aria-label="AI智能处理">' +
          '<div class="bm-modal-header"><h3>AI智能处理</h3><button class="bm-modal-close" data-bm-action="close-modal" type="button" aria-label="关闭"><i class="bi bi-x-lg"></i></button></div>' +
          '<div class="bm-modal-body">' +
            '<div class="bm-note">将对当前' + count + '条业务元数据执行智能补全，处理记录会写入AI处理记录。</div>' +
            '<div class="bm-check-grid">' +
              '<label><input type="checkbox" checked> 别名填充</label>' +
              '<label><input type="checkbox" checked> 标准引用</label>' +
              '<label><input type="checkbox" checked> 业务代码引用</label>' +
              '<label><input type="checkbox" checked> 备注补全</label>' +
            '</div>' +
            '<label class="bm-form-row"><span>填充机制</span><select data-bm-ai-mechanism><option>有值跳过</option><option>有值覆盖</option></select></label>' +
          '</div>' +
          '<div class="bm-modal-footer"><button class="btn btn-primary" data-bm-action="save-ai" type="button"><i class="bi bi-robot"></i> 开始处理</button><button class="btn btn-outline" data-bm-action="close-modal" type="button"><i class="bi bi-x-lg"></i> 取消</button></div>' +
        '</div>' +
      '</div>');
  }

  function openStandardModal(page) {
    closeModal(page);
    var count = getSelectedRows().length || getVisibleRows().length;
    page.insertAdjacentHTML('beforeend',
      '<div class="bm-modal-mask" data-bm-modal-mask>' +
        '<div class="bm-modal" role="dialog" aria-modal="true" aria-label="创建标准">' +
          '<div class="bm-modal-header"><h3>创建标准</h3><button class="bm-modal-close" data-bm-action="close-modal" type="button" aria-label="关闭"><i class="bi bi-x-lg"></i></button></div>' +
          '<div class="bm-modal-body">' +
            '<div class="bm-note">将根据' + count + '条业务元数据生成候选数据标准，未引用标准的字段会自动建立引用关系。</div>' +
            '<label class="bm-form-row"><span>标准主题</span><select><option>物流履约标准</option><option>客户服务标准</option><option>财务结算标准</option></select></label>' +
            '<label class="bm-form-row"><span>命名规则</span><select><option>STD_主题_英文名称</option><option>STD_字段英文名</option></select></label>' +
          '</div>' +
          '<div class="bm-modal-footer"><button class="btn btn-primary" data-bm-action="save-standard" type="button"><i class="bi bi-check-lg"></i> 确定</button><button class="btn btn-outline" data-bm-action="close-modal" type="button"><i class="bi bi-x-lg"></i> 取消</button></div>' +
        '</div>' +
      '</div>');
  }

  function deleteRows(page, ids) {
    if (!ids.length) {
      showToast(page, '请先选择记录');
      return;
    }
    var doDelete = function () {
      metadataRows = metadataRows.filter(function (item) { return ids.indexOf(String(item.id)) < 0; });
      state.selectedIds = {};
      renderContent(page);
      showToast(page, '已删除选中的业务元数据');
    };
    if (DP.confirm) {
      DP.confirm('确认删除选中的 ' + ids.length + ' 条业务元数据吗？', { icon: 'danger', onOk: doDelete });
    } else {
      doDelete();
    }
  }

  function saveEdit(page) {
    var modal = page.querySelector('[data-edit-id]');
    if (!modal) return;
    var item = getRowById(modal.getAttribute('data-edit-id'));
    if (!item) return;
    ['code', 'name', 'alias', 'standard', 'bizCode', 'metaModel', 'remark'].forEach(function (key) {
      var input = modal.querySelector('[data-bm-edit="' + key + '"]');
      if (input) item[key] = input.value.trim() || '--';
    });
    closeModal(page);
    renderContent(page);
    showToast(page, '业务元数据已保存');
  }

  function saveImport(page) {
    taskRows.unshift({
      id: Date.now(),
      fileName: '业务元数据导入-数据目录补录-' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '.xlsx',
      attr: '导入',
      status: '处理中',
      success: 0,
      fail: 0,
      total: 28,
      operator: '演示-测试',
      time: '2026-05-21 10:18:26'
    });
    closeModal(page);
    showToast(page, '导入任务已创建，可在任务查看中查看');
  }

  function buildAutoCode(prefix, item) {
    var source = String((item.name || item.code || 'META').split('.').pop());
    var base = source.replace(/[^\w]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '').toUpperCase();
    return prefix + '_' + (base || 'META');
  }

  function saveAi(page) {
    var targets = getSelectedRows();
    if (!targets.length) targets = getVisibleRows().slice();
    targets.forEach(function (item) {
      if (!hasValue(item.standard)) item.standard = buildAutoCode('STD', item);
      if (!hasValue(item.bizCode) && item.alias.indexOf('状态') >= 0) item.bizCode = buildAutoCode('BC', item);
      if (!item.remark || item.remark === '--') item.remark = item.alias + '的业务口径说明';
    });
    aiRows.unshift({
      id: Date.now(),
      tableName: targets[0] ? targets[0].name.replace(/\.[^.]+$/, '') : '当前筛选结果',
      alias: '当前筛选业务元数据',
      fieldCount: targets.length,
      status: '处理中',
      done: 0,
      total: targets.length,
      rate: '--',
      content: '别名填充、标准引用、业务代码引用、备注补全',
      mechanism: '有值跳过',
      operator: 'yanshi（演示）',
      time: '2026-05-21 10:20:14'
    });
    state.selectedIds = {};
    closeModal(page);
    renderContent(page);
    showToast(page, 'AI处理任务已提交');
  }

  function saveStandard(page) {
    var targets = getSelectedRows();
    if (!targets.length) targets = getVisibleRows().slice();
    targets.forEach(function (item) {
      if (!hasValue(item.standard)) item.standard = buildAutoCode('STD', item);
    });
    closeModal(page);
    renderContent(page);
    showToast(page, '候选标准已创建并完成引用');
  }

  function bindEvents(page) {
    page.addEventListener('click', function (e) {
      var sideTab = e.target.closest('[data-bm-side-tab]');
      if (sideTab) {
        state.sideTab = sideTab.getAttribute('data-bm-side-tab');
        state.treeKey = currentRootKey();
        state.page = 1;
        state.selectedIds = {};
        renderTree(page);
        renderContent(page);
        return;
      }

      var treeToggle = e.target.closest('.bm-tree-toggle');
      if (treeToggle) {
        e.stopPropagation();
        var node = treeToggle.closest('[data-bm-tree-node]');
        if (!node) return;
        node.classList.toggle('bm-open');
        var icon = treeToggle.querySelector('i');
        if (icon) icon.className = node.classList.contains('bm-open') ? 'bi bi-chevron-down' : 'bi bi-chevron-right';
        return;
      }

      var treeRow = e.target.closest('[data-bm-tree-key]');
      if (treeRow) {
        state.treeKey = treeRow.getAttribute('data-bm-tree-key');
        state.page = 1;
        state.selectedIds = {};
        renderTree(page);
        renderContent(page);
        return;
      }

      var mainTab = e.target.closest('[data-bm-main-tab]');
      if (mainTab) {
        state.activeTab = mainTab.getAttribute('data-bm-main-tab');
        state.logContext = null;
        renderContent(page);
        return;
      }

      var sortBtn = e.target.closest('[data-bm-sort]');
      if (sortBtn) {
        var key = sortBtn.getAttribute('data-bm-sort');
        if (state.sortKey === key) state.sortDir = state.sortDir === 'asc' ? 'desc' : 'asc';
        else {
          state.sortKey = key;
          state.sortDir = 'asc';
        }
        renderContent(page);
        return;
      }

      var pageBtn = e.target.closest('[data-bm-page]');
      if (pageBtn) {
        var rows = getFilteredRows();
        var totalPages = Math.max(1, Math.ceil(rows.length / state.pageSize));
        var target = pageBtn.getAttribute('data-bm-page');
        if (target === 'prev') state.page = Math.max(1, state.page - 1);
        else if (target === 'next') state.page = Math.min(totalPages, state.page + 1);
        else state.page = Number(target) || 1;
        renderContent(page);
        return;
      }

      var action = e.target.closest('[data-bm-action]');
      if (!action) return;
      var actionName = action.getAttribute('data-bm-action');
      var id = action.getAttribute('data-id');
      if (actionName === 'query') {
        var keyword = page.querySelector('[data-bm-keyword]');
        state.filters.keyword = keyword ? keyword.value.trim() : '';
        state.page = 1;
        renderContent(page);
      } else if (actionName === 'query-task') {
        var taskKeyword = page.querySelector('[data-bm-task-keyword]');
        state.taskFilters.keyword = taskKeyword ? taskKeyword.value.trim() : '';
        renderContent(page);
      } else if (actionName === 'query-ai') {
        var aiKeyword = page.querySelector('[data-bm-ai-keyword]');
        state.aiFilters.keyword = aiKeyword ? aiKeyword.value.trim() : '';
        renderContent(page);
      } else if (actionName === 'import') {
        openImportModal(page);
      } else if (actionName === 'export') {
        taskRows.unshift({ id: Date.now(), fileName: '业务元数据导出-当前筛选结果-20260521.xlsx', attr: '导出', status: '处理中', success: 0, fail: 0, total: getFilteredRows().length, operator: '演示-测试', time: '2026-05-21 10:19:03' });
        showToast(page, '导出任务已创建，可在任务查看中查看');
      } else if (actionName === 'delete-selected') {
        deleteRows(page, Object.keys(state.selectedIds));
      } else if (actionName === 'ai-process') {
        openAiModal(page);
      } else if (actionName === 'create-standard') {
        openStandardModal(page);
      } else if (actionName === 'view') {
        openViewModal(page, id);
      } else if (actionName === 'edit') {
        openEditModal(page, id);
      } else if (actionName === 'delete-row') {
        deleteRows(page, [String(id)]);
      } else if (actionName === 'close-modal') {
        closeModal(page);
      } else if (actionName === 'save-edit') {
        saveEdit(page);
      } else if (actionName === 'save-import') {
        saveImport(page);
      } else if (actionName === 'save-ai') {
        saveAi(page);
      } else if (actionName === 'save-standard') {
        saveStandard(page);
      } else if (actionName === 'task-log') {
        state.logContext = { type: 'task', id: id, previousTab: 'task' };
        state.activeTab = 'log';
        renderContent(page);
      } else if (actionName === 'ai-log') {
        state.logContext = { type: 'ai', id: id, previousTab: 'ai' };
        state.activeTab = 'log';
        renderContent(page);
      } else if (actionName === 'back-log') {
        state.activeTab = state.logContext && state.logContext.previousTab ? state.logContext.previousTab : 'task';
        state.logContext = null;
        renderContent(page);
      }
    });

    page.addEventListener('change', function (e) {
      if (e.target.matches('[data-bm-filter]')) {
        state.filters[e.target.getAttribute('data-bm-filter')] = e.target.value;
        state.page = 1;
        renderContent(page);
        return;
      }
      if (e.target.matches('[data-bm-task-filter]')) {
        state.taskFilters[e.target.getAttribute('data-bm-task-filter')] = e.target.value;
        renderContent(page);
        return;
      }
      if (e.target.matches('[data-bm-ai-filter]')) {
        state.aiFilters[e.target.getAttribute('data-bm-ai-filter')] = e.target.value;
        renderContent(page);
        return;
      }
      if (e.target.matches('[data-bm-page-size]')) {
        state.pageSize = Number(e.target.value) || 20;
        state.page = 1;
        renderContent(page);
        return;
      }
      if (e.target.matches('[data-bm-check-all]')) {
        getVisibleRows().forEach(function (item) {
          if (e.target.checked) state.selectedIds[item.id] = true;
          else delete state.selectedIds[item.id];
        });
        renderContent(page);
        return;
      }
      if (e.target.matches('[data-bm-row-check]')) {
        var id = e.target.getAttribute('data-bm-row-check');
        if (e.target.checked) state.selectedIds[id] = true;
        else delete state.selectedIds[id];
        updateCheckAll(page);
      }
    });

    page.addEventListener('input', function (e) {
      if (e.target.matches('[data-bm-tree-search]')) {
        applyTreeSearch(page);
      }
    });

    page.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter') return;
      if (e.target.matches('[data-bm-keyword]')) {
        var query = page.querySelector('[data-bm-action="query"]');
        if (query) query.click();
      }
      if (e.target.matches('[data-bm-task-keyword]')) {
        var queryTask = page.querySelector('[data-bm-action="query-task"]');
        if (queryTask) queryTask.click();
      }
      if (e.target.matches('[data-bm-ai-keyword]')) {
        var queryAi = page.querySelector('[data-bm-action="query-ai"]');
        if (queryAi) queryAi.click();
      }
    });
  }

  var html = '<div class="page-business-metadata">' +
    '<aside class="bm-left-panel">' +
      '<div class="bm-side-tabs">' +
        '<button class="bm-side-tab active" type="button" data-bm-side-tab="source">数据源</button>' +
        '<button class="bm-side-tab" type="button" data-bm-side-tab="catalog">数据目录</button>' +
      '</div>' +
      '<div class="bm-tree-search">' +
        '<input type="text" data-bm-tree-search placeholder="关键字搜索" aria-label="关键字搜索">' +
        '<button type="button" aria-label="搜索"><i class="bi bi-search"></i></button>' +
      '</div>' +
      '<div class="bm-tree-scroll"><ul class="bm-tree" data-bm-tree></ul></div>' +
    '</aside>' +
    '<section class="bm-right-panel">' +
      '<div class="bm-main-tabs" data-bm-tabs></div>' +
      '<div class="bm-main-view" data-bm-view></div>' +
    '</section>' +
  '</div>';

  return {
    html: html,
    init: function () {
      var page = document.querySelector('.page-business-metadata');
      if (!page) return;
      resetState();
      bindEvents(page);
      renderTree(page);
      renderContent(page);
    }
  };
})();
