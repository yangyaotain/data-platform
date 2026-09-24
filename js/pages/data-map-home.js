/**
 * 数据地图 - 首页
 * 独立菜单体系 + 首页静态原型交互
 */
window.DP = window.DP || {};
DP.pages = DP.pages || {};

DP.pages.dataMapHome = (function () {
  var DATA_SETS = {
    public: {
      stats: [
        { label: '目录总量', value: '8', icon: 'bi-folder2-open' },
        { label: 'API总数', value: '26', icon: 'bi-cloud' },
        { label: '接口开发', value: '18', icon: 'bi-code-square' },
        { label: '接口注册', value: '8', icon: 'bi-link-45deg' },
        { label: '数据集', value: '14', icon: 'bi-collection' },
        { label: '申请用户数', value: '42', icon: 'bi-person-check' },
        { label: '申请总量', value: '138', icon: 'bi-file-earmark-text' },
        { label: '月浏览量', value: '1264', icon: 'bi-eye' },
        { label: '月调用量', value: '8920', icon: 'bi-activity' },
        { label: '月均下载量', value: '316', icon: 'bi-cloud-download' }
      ],
      resources: [
        {
          title: '行政区划标准代码API',
          type: '接口开发',
          category: '公共基础目录',
          frequency: '每日',
          onlineAt: '2026-06-18 09:12:30',
          updatedAt: '2026-06-25 18:02:11',
          views: 186,
          applies: 16
        },
        {
          title: '节假日工作日查询API',
          type: '接口注册',
          category: '公共服务目录',
          frequency: '实时',
          onlineAt: '2026-06-17 14:38:21',
          updatedAt: '2026-06-25 16:40:55',
          views: 142,
          applies: 12
        },
        {
          title: '气象预警信息数据集',
          type: '数据集资源注册',
          category: '公共服务目录',
          frequency: '每小时',
          onlineAt: '2026-06-15 10:21:08',
          updatedAt: '2026-06-26 08:10:19',
          views: 119,
          applies: 9
        },
        {
          title: '企业工商登记基础库',
          type: '数据集资源注册',
          category: '市场主体目录',
          frequency: '每日',
          onlineAt: '2026-06-14 11:05:42',
          updatedAt: '2026-06-25 20:18:07',
          views: 98,
          applies: 8
        },
        {
          title: '统一社会信用代码核验API',
          type: '接口注册',
          category: '市场主体目录',
          frequency: '实时',
          onlineAt: '2026-06-12 15:30:18',
          updatedAt: '2026-06-24 17:45:26',
          views: 88,
          applies: 11
        },
        {
          title: '交通路网拥堵指数API',
          type: '接口开发',
          category: '城市运行目录',
          frequency: '每15分钟',
          onlineAt: '2026-06-10 13:16:50',
          updatedAt: '2026-06-26 08:45:33',
          views: 77,
          applies: 7
        },
        {
          title: '公共机构空间位置数据集',
          type: '数据集资源注册',
          category: '城市运行目录',
          frequency: '每周',
          onlineAt: '2026-06-08 16:09:36',
          updatedAt: '2026-06-24 09:32:14',
          views: 65,
          applies: 6
        },
        {
          title: '政策文件公开目录API',
          type: '接口开发',
          category: '公共公开目录',
          frequency: '每日',
          onlineAt: '2026-06-06 09:40:25',
          updatedAt: '2026-06-23 11:25:49',
          views: 54,
          applies: 5
        },
        {
          title: '人口年龄结构统计数据集',
          type: '数据集资源注册',
          category: '统计分析目录',
          frequency: '每月',
          onlineAt: '2026-06-04 10:58:11',
          updatedAt: '2026-06-21 19:06:04',
          views: 43,
          applies: 4
        },
        {
          title: '数据共享申请编排服务',
          type: 'API编排',
          category: '公共服务目录',
          frequency: '实时',
          onlineAt: '2026-06-03 17:18:39',
          updatedAt: '2026-06-20 14:57:31',
          views: 36,
          applies: 3
        }
      ]
    },
    enterprise: {
      stats: [
        { label: '目录总量', value: '12', icon: 'bi-folder2-open' },
        { label: 'API总数', value: '34', icon: 'bi-cloud' },
        { label: '接口开发', value: '22', icon: 'bi-code-square' },
        { label: '接口注册', value: '12', icon: 'bi-link-45deg' },
        { label: '数据集', value: '28', icon: 'bi-collection' },
        { label: '申请用户数', value: '57', icon: 'bi-person-check' },
        { label: '申请总量', value: '206', icon: 'bi-file-earmark-text' },
        { label: '月浏览量', value: '1782', icon: 'bi-eye' },
        { label: '月调用量', value: '12540', icon: 'bi-activity' },
        { label: '月均下载量', value: '428', icon: 'bi-cloud-download' }
      ],
      resources: [
        {
          title: '员工主数据画像API',
          type: '接口开发',
          category: '人力资源目录',
          frequency: '每日',
          onlineAt: '2026-06-19 09:42:15',
          updatedAt: '2026-06-25 19:41:56',
          views: 155,
          applies: 15
        },
        {
          title: '考勤月度汇总数据集',
          type: '数据集资源注册',
          category: '人力资源目录',
          frequency: '每月',
          onlineAt: '2026-06-18 16:20:08',
          updatedAt: '2026-06-24 10:18:31',
          views: 132,
          applies: 13
        },
        {
          title: '供应商资质核验API',
          type: '接口注册',
          category: '供应链目录',
          frequency: '实时',
          onlineAt: '2026-06-16 13:09:22',
          updatedAt: '2026-06-25 13:08:59',
          views: 121,
          applies: 10
        },
        {
          title: '采购订单履约明细数据集',
          type: '数据集资源注册',
          category: '供应链目录',
          frequency: '每日',
          onlineAt: '2026-06-15 11:35:44',
          updatedAt: '2026-06-24 11:32:40',
          views: 104,
          applies: 9
        },
        {
          title: '客户服务工单状态API',
          type: '接口开发',
          category: '客户服务目录',
          frequency: '实时',
          onlineAt: '2026-06-13 15:12:04',
          updatedAt: '2026-06-25 09:11:27',
          views: 96,
          applies: 8
        },
        {
          title: '销售回款对账数据集',
          type: '数据集资源注册',
          category: '财务结算目录',
          frequency: '每日',
          onlineAt: '2026-06-11 10:07:38',
          updatedAt: '2026-06-23 18:24:06',
          views: 82,
          applies: 7
        },
        {
          title: '发票验真编排服务',
          type: 'API编排',
          category: '财务结算目录',
          frequency: '实时',
          onlineAt: '2026-06-10 14:45:12',
          updatedAt: '2026-06-22 16:02:48',
          views: 69,
          applies: 5
        },
        {
          title: '门店销售日报查询API',
          type: '接口开发',
          category: '经营分析目录',
          frequency: '每日',
          onlineAt: '2026-06-08 09:28:43',
          updatedAt: '2026-06-22 09:40:12',
          views: 58,
          applies: 4
        },
        {
          title: '设备巡检记录数据集',
          type: '数据集资源注册',
          category: '设备运维目录',
          frequency: '每日',
          onlineAt: '2026-06-06 17:42:09',
          updatedAt: '2026-06-21 20:16:52',
          views: 46,
          applies: 3
        },
        {
          title: '仓库库存预警API',
          type: '接口注册',
          category: '仓储物流目录',
          frequency: '每小时',
          onlineAt: '2026-06-04 12:30:55',
          updatedAt: '2026-06-20 12:26:18',
          views: 39,
          applies: 3
        }
      ]
    }
  };

  var CATALOGS = [
    { id: 'public', name: '公共目录', count: 8, children: [
      { id: 'public-base', name: '公共基础数据', count: 2 },
      { id: 'public-market', name: '市场主体数据', count: 2 },
      { id: 'public-city', name: '城市运行数据', count: 2 },
      { id: 'public-service', name: '公共服务数据', count: 2 }
    ] },
    { id: 'mine', name: '我的目录', count: 4, children: [
      { id: 'mine-logistics', name: '物流运营数据', count: 2 },
      { id: 'mine-customer', name: '客户服务数据', count: 2 }
    ] }
  ];

  var DIRECTORY_RESOURCES = [
    { id: 1, catalog: 'public-base', type: 'api', title: '行政区划标准代码查询服务', description: '提供国家、省、市、区县四级行政区划代码及名称的标准查询能力。', category: '公共目录 / 公共基础数据', views: 386, applies: 42, releasedAt: '2026-06-18 09:12:30', updatedAt: '2026-09-21 16:42:18', frequency: '每日', version: 'V1.2', favorite: true, applied: false },
    { id: 2, catalog: 'public-base', type: 'api', title: '统一社会信用代码核验服务', description: '根据统一社会信用代码核验市场主体名称、登记状态和登记机关。', category: '公共目录 / 公共基础数据', views: 328, applies: 36, releasedAt: '2026-06-16 14:20:11', updatedAt: '2026-09-22 08:30:06', frequency: '实时', version: 'V2.0', favorite: false, applied: true },
    { id: 3, catalog: 'public-market', type: 'dataset', title: '市场主体登记基础信息数据集', description: '归集企业、个体工商户等市场主体的登记注册与存续状态信息。', category: '公共目录 / 市场主体数据', views: 278, applies: 31, releasedAt: '2026-06-12 11:16:45', updatedAt: '2026-09-21 22:10:38', frequency: '每日', version: 'V1.4', favorite: true, applied: true },
    { id: 4, catalog: 'public-market', type: 'db', title: '企业变更登记信息表', description: '记录市场主体名称、法定代表人、住所和经营范围等变更事项。', category: '公共目录 / 市场主体数据', views: 187, applies: 18, releasedAt: '2026-06-08 15:42:07', updatedAt: '2026-09-21 23:40:15', frequency: '每日', version: 'V1.0', favorite: true, applied: false },
    { id: 5, catalog: 'public-city', type: 'dataset', title: '城市道路运行指数数据集', description: '提供城市主要道路分时段拥堵指数、平均速度和运行等级。', category: '公共目录 / 城市运行数据', views: 246, applies: 22, releasedAt: '2026-05-22 09:30:18', updatedAt: '2026-09-22 09:15:00', frequency: '每15分钟', version: 'V1.3', favorite: false, applied: false },
    { id: 6, catalog: 'public-city', type: 'db', title: '公共设施空间位置表', description: '记录公共停车场、充电站、服务网点等设施的空间位置。', category: '公共目录 / 城市运行数据', views: 168, applies: 14, releasedAt: '2026-05-18 16:12:42', updatedAt: '2026-09-20 18:26:51', frequency: '每周', version: 'V1.0', favorite: false, applied: true },
    { id: 7, catalog: 'public-service', type: 'orchestration', title: '公共服务事项联办查询', description: '编排事项目录、办件进度和结果反馈接口，提供联办查询能力。', category: '公共目录 / 公共服务数据', views: 205, applies: 27, releasedAt: '2026-06-02 13:18:09', updatedAt: '2026-09-21 15:12:44', frequency: '实时', version: 'V1.6', favorite: true, applied: false },
    { id: 8, catalog: 'public-service', type: 'api', title: '气象预警信息查询服务', description: '查询预警类型、等级、影响区域、发布时间及防御指引。', category: '公共目录 / 公共服务数据', views: 232, applies: 29, releasedAt: '2026-05-30 08:35:16', updatedAt: '2026-09-22 09:45:21', frequency: '每小时', version: 'V2.1', favorite: false, applied: false },
    { id: 9, catalog: 'mine-logistics', type: 'api', title: '运输订单轨迹查询服务', description: '根据运输单号查询车辆节点、当前位置及预计到达时间。', category: '我的目录 / 物流运营数据', views: 156, applies: 17, releasedAt: '2026-06-20 10:05:36', updatedAt: '2026-09-22 09:28:10', frequency: '实时', version: 'V1.5', favorite: true, applied: false },
    { id: 10, catalog: 'mine-logistics', type: 'db', title: '仓库库存流水明细表', description: '记录商品入库、出库、调拨、盘点及库存结余等流水信息。', category: '我的目录 / 物流运营数据', views: 144, applies: 13, releasedAt: '2026-06-15 17:40:26', updatedAt: '2026-09-22 08:50:42', frequency: '每小时', version: 'V1.2', favorite: false, applied: true },
    { id: 11, catalog: 'mine-customer', type: 'dataset', title: '客户服务工单主题数据集', description: '汇总咨询、投诉、建议类工单的渠道、时效和处置结果。', category: '我的目录 / 客户服务数据', views: 131, applies: 12, releasedAt: '2026-06-10 09:54:14', updatedAt: '2026-09-21 20:12:31', frequency: '每日', version: 'V1.3', favorite: false, applied: false },
    { id: 12, catalog: 'mine-customer', type: 'orchestration', title: '客户诉求闭环处置服务', description: '编排工单创建、分派、回访和评价接口，支撑诉求闭环处置。', category: '我的目录 / 客户服务数据', views: 118, applies: 10, releasedAt: '2026-06-06 14:26:53', updatedAt: '2026-09-20 16:38:05', frequency: '实时', version: 'V1.1', favorite: true, applied: false }
  ];

  var MY_DATA_RESOURCES = [
    { id: 101, catalog: 'mine-customer', type: 'api', title: '客户画像标签查询服务', englishName: 'customer_profile_tag_query', description: '按客户编号查询基础属性、价值分层、服务偏好和活跃度标签。', category: '公共目录 / 我的目录 / 客户服务数据', views: 236, applies: 18, releasedAt: '2026-07-08 10:18:26', updatedAt: '2026-09-23 17:36:12', frequency: '实时', version: 'V1.3', favorite: false, pinned: false, profile: 'service' },
    { id: 102, catalog: 'mine-logistics', type: 'dataset', title: '运输订单履约主题数据集', englishName: 'transport_order_fulfillment', description: '汇总运输订单、承运车辆、节点轨迹、签收状态及履约时效数据。', category: '公共目录 / 我的目录 / 物流运营数据', views: 198, applies: 15, releasedAt: '2026-07-02 14:25:09', updatedAt: '2026-09-23 08:15:40', frequency: '每日', version: 'V1.2', favorite: false, pinned: false, profile: 'inventory' },
    { id: 103, catalog: 'mine-logistics', type: 'db', title: '仓库库存流水明细表', englishName: 'warehouse_inventory_flow', description: '记录商品入库、出库、调拨、盘点以及库存结余的业务流水。', category: '公共目录 / 我的目录 / 物流运营数据', views: 175, applies: 12, releasedAt: '2026-06-26 09:42:18', updatedAt: '2026-09-23 09:05:26', frequency: '每小时', version: 'V1.2', favorite: false, pinned: false, profile: 'inventory' },
    { id: 104, catalog: 'mine-customer', type: 'dataset', title: '客户服务工单主题数据集', englishName: 'customer_service_work_order', description: '归集咨询、投诉、建议类工单的受理渠道、处置时效和评价结果。', category: '公共目录 / 我的目录 / 客户服务数据', views: 164, applies: 11, releasedAt: '2026-06-20 16:30:42', updatedAt: '2026-09-22 21:18:09', frequency: '每日', version: 'V1.3', favorite: false, pinned: false, profile: 'service' },
    { id: 105, catalog: 'public-city', type: 'api', title: '城市道路运行指数查询服务', englishName: 'urban_road_operation_index', description: '提供主要道路分时段平均速度、拥堵指数和运行等级查询。', category: '公共目录 / 城市运行数据 / 我的目录', views: 152, applies: 9, releasedAt: '2026-06-18 11:08:36', updatedAt: '2026-09-23 09:30:00', frequency: '每15分钟', version: 'V1.5', favorite: false, pinned: false, profile: 'road' },
    { id: 106, catalog: 'public-market', type: 'db', title: '企业变更登记信息表', englishName: 'enterprise_registration_change', description: '记录市场主体名称、法定代表人、住所及经营范围等登记变更事项。', category: '公共目录 / 市场主体数据 / 我的目录', views: 141, applies: 8, releasedAt: '2026-06-12 13:16:55', updatedAt: '2026-09-23 02:10:18', frequency: '每日', version: 'V1.0', favorite: false, pinned: false, profile: 'market' },
    { id: 107, catalog: 'public-market', type: 'api', title: '供应商资质核验服务', englishName: 'supplier_qualification_verify', description: '核验供应商登记状态、行业资质、有效期限与风险提示信息。', category: '公共目录 / 市场主体数据 / 我的目录', views: 128, applies: 7, releasedAt: '2026-06-09 15:28:10', updatedAt: '2026-09-22 18:42:35', frequency: '实时', version: 'V2.0', favorite: false, pinned: false, profile: 'market' },
    { id: 108, catalog: 'public-city', type: 'dataset', title: '城市道路运行监测数据集', englishName: 'urban_road_monitoring', description: '提供路段级交通流量、平均速度、拥堵指数及统计时间数据。', category: '公共目录 / 城市运行数据 / 我的目录', views: 116, applies: 6, releasedAt: '2026-06-05 10:12:47', updatedAt: '2026-09-23 09:15:00', frequency: '每15分钟', version: 'V1.1', favorite: false, pinned: false, profile: 'road' }
  ];

  var AUDIT_ITEMS = [
    { id: 201, resourceId: 101, type: 'data', resourceType: 'API接口', prefix: 'API', objectName: '客户画像标签查询服务', title: '[API][客户画像标签查询服务]的数据申请', description: '按客户编号查询基础属性、价值分层与服务偏好标签。', reason: '用于客户分层运营分析及服务策略优化。', applicant: '李思远', appliedAt: '2026-09-24 09:18:36', completedAt: '', status: 'pending', category: '我的目录 / 客户服务数据', frequency: '实时', useLimit: '使用期限', period: '2026-09-24 至 2027-09-23', callFrequency: '100 次/日', ip: '10.20.16.35', reviewer: '张璐', scopes: ['客户基础属性标签', '客户价值分层标签', '客户服务偏好标签'] },
    { id: 202, resourceId: 103, type: 'db', resourceType: '数据库表', prefix: 'DB', objectName: '仓库库存流水明细表', title: '[DB][仓库库存流水明细表]的库表申请', description: '记录商品入库、出库、调拨、盘点及库存结余流水。', reason: '用于仓储周转效率和库存异常分析。', applicant: '周雨晴', appliedAt: '2026-09-24 08:42:15', completedAt: '', status: 'pending', category: '我的目录 / 物流运营数据', frequency: '每小时', period: '2026-09-24 至 2027-03-23', fields: ['flow_no', 'warehouse_code', 'sku_code', 'business_type', 'quantity', 'happened_at'], reviewer: '张璐' },
    { id: 203, type: 'app', resourceType: '应用申请', prefix: 'APP', objectName: '经营分析驾驶舱', title: '[APP][经营分析驾驶舱]的应用申请', description: '面向经营管理人员展示销售、回款和客户服务综合指标。', reason: '申请接入数据地图平台统一调用能力。', applicant: '王俊杰', appliedAt: '2026-09-23 17:26:48', completedAt: '', status: 'pending', appType: 'Web应用', owner: '经营分析中心', callback: 'https://bi.example.local/oauth/callback' },
    { id: 204, resourceId: 102, type: 'data', resourceType: '数据集', prefix: 'DATASET', objectName: '运输订单履约主题数据集', title: '[DATASET][运输订单履约主题数据集]的数据申请', description: '汇总运输节点轨迹、签收状态与履约时效。', reason: '用于运输异常识别和承运商履约评价。', applicant: '陈嘉宁', appliedAt: '2026-09-23 16:05:22', completedAt: '', status: 'pending', category: '我的目录 / 物流运营数据', frequency: '每日', period: '2026-09-23 至 2027-09-22', application: '供应链运营分析', ip: '10.20.18.46', reviewer: '张璐' },
    { id: 205, resourceId: 2, type: 'data', resourceType: 'API接口', prefix: 'API', objectName: '统一社会信用代码核验服务', title: '[API][统一社会信用代码核验服务]的数据申请', description: '核验市场主体名称、登记状态和登记机关。', reason: '用于供应商准入信息核验。', applicant: '赵文博', appliedAt: '2026-09-23 14:20:09', completedAt: '2026-09-23 14:36:52', status: 'approved', category: '公共目录 / 公共基础数据', frequency: '实时', useLimit: '使用期限+使用次数', period: '2026-09-23 至 2027-09-22', callFrequency: '60 次/分', totalTimes: '50,000 次', ip: '10.20.12.18', reviewer: '张璐', scopes: ['市场主体基础信息', '登记状态信息', '登记机关信息'], operator: '张璐', decision: '业务场景明确，同意授权使用。' },
    { id: 206, resourceId: 106, type: 'db', resourceType: '数据库表', prefix: 'DB', objectName: '企业变更登记信息表', title: '[DB][企业变更登记信息表]的库表申请', description: '记录市场主体登记变更事项。', reason: '用于企业风险画像和变更趋势分析。', applicant: '孙明轩', appliedAt: '2026-09-23 11:08:43', completedAt: '2026-09-23 11:30:17', status: 'approved', category: '公共目录 / 市场主体数据', frequency: '每日', period: '2026-09-23 至 2027-03-22', fields: ['unified_credit_code', 'entity_name', 'change_item', 'before_content', 'after_content', 'change_date'], reviewer: '刘明', operator: '刘明', decision: '数据项范围合理，同意申请。' },
    { id: 207, type: 'app', resourceType: '应用申请', prefix: 'APP', objectName: '移动运营助手', title: '[APP][移动运营助手]的应用申请', description: '提供移动端经营指标查询和异常提醒。', reason: '申请移动应用接入平台认证。', applicant: '林晓雯', appliedAt: '2026-09-22 16:42:26', completedAt: '2026-09-22 17:05:31', status: 'rejected', appType: '移动应用', owner: '数字运营部', callback: 'https://mobile.example.local/auth/callback', operator: '陈燕', decision: '回调地址尚未完成安全域名备案，请补充后重新申请。' },
    { id: 208, resourceId: 108, type: 'data', resourceType: '数据集', prefix: 'DATASET', objectName: '城市道路运行监测数据集', title: '[DATASET][城市道路运行监测数据集]的数据申请', description: '提供路段交通流量、平均速度和拥堵指数。', reason: '用于城市交通运行周报编制。', applicant: '何志鹏', appliedAt: '2026-09-22 10:15:04', completedAt: '2026-09-22 10:32:46', status: 'approved', category: '公共目录 / 城市运行数据', frequency: '每15分钟', period: '2026-09-22 至 2027-09-21', application: '城市运行监测', ip: '10.20.24.11', reviewer: '张璐', operator: '张璐', decision: '符合城市运行分析用途，同意申请。' },
    { id: 209, resourceId: 107, type: 'data', resourceType: 'API接口', prefix: 'API', objectName: '供应商资质核验服务', title: '[API][供应商资质核验服务]的数据申请', description: '核验登记状态、行业资质有效期限和风险提示。', reason: '用于采购供应商年度复审。', applicant: '演示', appliedAt: '2026-09-24 08:36:12', completedAt: '', status: 'pending', category: '公共目录 / 市场主体数据', frequency: '实时', useLimit: '使用期限', period: '2026-09-24 至 2027-09-23', callFrequency: '30 次/分', ip: '10.20.16.35', reviewer: '张璐', scopes: ['企业登记状态', '资质证照信息', '风险提示信息'] },
    { id: 210, type: 'db', resourceType: '数据库表', prefix: 'DB', objectName: '客户服务工单明细表', title: '[DB][客户服务工单明细表]的库表申请', description: '记录工单受理、流转、办结和满意度评价。', reason: '用于服务质量月度复盘。', applicant: '演示', appliedAt: '2026-09-20 15:22:18', completedAt: '2026-09-20 16:03:42', status: 'approved', category: '我的目录 / 客户服务数据', frequency: '每日', period: '2026-09-20 至 2027-03-19', fields: ['work_order_no', 'appeal_type', 'service_channel', 'received_time', 'handle_status', 'completion_time'], operator: '刘明', decision: '同意按申请字段范围授权。' },
    { id: 211, type: 'app', resourceType: '应用申请', prefix: 'APP', objectName: '供应链协同门户', title: '[APP][供应链协同门户]的应用申请', description: '支撑采购订单、承运进度和库存协同查询。', reason: '申请生产环境应用凭证。', applicant: '演示', appliedAt: '2026-09-18 09:45:30', completedAt: '2026-09-18 10:12:08', status: 'rejected', appType: 'Web应用', owner: '供应链管理部', callback: 'https://supply.example.local/oauth/callback', operator: '陈燕', decision: '应用责任人与安全联系人信息不完整。' },
    { id: 212, resourceId: 104, type: 'data', resourceType: '数据集', prefix: 'DATASET', objectName: '客户服务工单主题数据集', title: '[DATASET][客户服务工单主题数据集]的数据申请', description: '汇总咨询、投诉和建议类工单处置情况。', reason: '用于客户服务质量分析。', applicant: '演示', appliedAt: '2026-09-16 14:18:55', completedAt: '2026-09-16 14:40:21', status: 'approved', category: '我的目录 / 客户服务数据', frequency: '每日', period: '2026-09-16 至 2027-09-15', application: '客户服务运营分析', ip: '10.20.16.35', reviewer: '张璐', operator: '张璐', decision: '申请用途与授权范围一致，同意申请。' }
  ];

  var MY_APPLICATIONS = [
    { id: 301, name: '数据治理运营分析', status: 'approved', appId: 'DG20260924001', appKey: 'AK9Q2M7X5T8R4P6N', decryptKey: 'DK7C3L8V2B5H9J4S', description: '用于数据资产盘点、目录运营和治理成效分析。', updatedAt: '2026-09-24 09:36:18', decryptEnabled: true },
    { id: 302, name: '城市运行监测', status: 'reviewing', appId: 'DG20260918002', appKey: 'AK4F8K2D9W6M3Y7Q', decryptKey: '未启用', description: '用于道路运行指标查询与城市事件监测。', updatedAt: '2026-09-23 16:28:42', decryptEnabled: false },
    { id: 303, name: '企业综合服务', status: 'pending', appId: 'DG20260916003', appKey: 'AK6P3N9R2X7C5V8L', decryptKey: 'DK2M8Q4T7H5B9W3F', description: '用于企业登记、信用与资质数据综合核验。', updatedAt: '2026-09-22 11:15:36', decryptEnabled: true },
    { id: 304, name: '供应链协同门户', status: 'rejected', appId: 'DG20260910004', appKey: 'AK8H5B2V7L4Q9C3M', decryptKey: '未启用', description: '用于采购订单、运输进度和库存协同查询。', updatedAt: '2026-09-21 17:46:20', decryptEnabled: false },
    { id: 305, name: '客户服务运营助手', status: 'offline', appId: 'DG20260828005', appKey: 'AK3W7T9M5R2N8F6K', decryptKey: 'DK5V2C8L4Q7H9B3P', description: '用于客户工单进度查询与服务质量分析。', updatedAt: '2026-09-20 14:22:08', decryptEnabled: true },
    { id: 306, name: '数据质量监控看板', status: 'draft', appId: 'DG20260924006', appKey: 'AK7N4C2P8M5T9V3R', decryptKey: '未启用', description: '用于数据质量规则结果与问题整改进度展示。', updatedAt: '2026-09-24 08:52:14', decryptEnabled: false }
  ];

  var ACCOUNT_INFO = { account: 'present', name: '演示', phone: '138 0013 8000', email: 'present@datamap.local', department: '数据治理运营部', status: '正常' };

  var PERSONAL_MESSAGES = [
    { id: 401, unread: true, content: '您的【客户画像标签查询服务数据申请】，已审核通过，请及时关注。' },
    { id: 402, unread: true, content: '您的【企业变更登记信息表库表申请】，已提交申请，请及时关注。' },
    { id: 403, unread: true, content: '您的【数据治理运营分析应用申请】，已审核通过，请及时关注。' },
    { id: 404, unread: false, content: '您的【运输订单履约主题数据集申请】，已提交申请，请及时关注。' },
    { id: 405, unread: false, content: '您的【城市道路运行指数查询服务数据申请】，已审核通过，请及时关注。' },
    { id: 406, unread: false, content: '您的【供应商资质核验服务数据申请】，已审核驳回，请及时关注。' },
    { id: 407, unread: false, content: '您的【仓库库存流水明细表变更申请】，已提交申请，请及时关注。' },
    { id: 408, unread: false, content: '您的应用【城市运行监测】在调用接口【城市道路运行指数查询服务】时调用失败，失败原因：访问凭证已过期。' },
    { id: 409, unread: false, content: '您的【客户服务工单主题数据集申请】，已审核通过，请及时关注。' },
    { id: 410, unread: false, content: '您的【公共服务事项联办查询服务数据申请】，已提交申请，请及时关注。' },
    { id: 411, unread: false, content: '您的【数据质量监控看板应用申请】，已保存为草稿。' },
    { id: 412, unread: false, content: '您的应用【数据治理运营分析】已完成认证密钥更换，请及时更新调用配置。' }
  ];

  var API_MONITOR_ITEMS = [
    { id: 501, resourceId: 101, catalog: 'mine-customer', code: 'DM202609220101', name: '客户画像标签查询服务', englishName: 'customer_profile_tag_query', version: 'V1.3', type: 'api', app: '数据治理运营分析', calls: 12846, avgResponse: '0.086 秒', maxConcurrency: 18, errors: 23, status: 'online', endpoint: 'https://api.datamap.local/share-api/101/customer_profile_tag_query' },
    { id: 502, resourceId: 105, catalog: 'public-city', code: 'DM202609220105', name: '城市道路运行指数查询服务', englishName: 'urban_road_operation_index', version: 'V1.5', type: 'api', app: '城市运行监测', calls: 9684, avgResponse: '0.112 秒', maxConcurrency: 24, errors: 41, status: 'online', endpoint: 'https://api.datamap.local/share-api/105/urban_road_operation_index' },
    { id: 503, resourceId: 107, catalog: 'public-market', code: 'DM202609220107', name: '供应商资质核验服务', englishName: 'supplier_qualification_verify', version: 'V2.0', type: 'api', app: '企业综合服务', calls: 6218, avgResponse: '0.143 秒', maxConcurrency: 12, errors: 17, status: 'online', endpoint: 'https://api.datamap.local/share-api/107/supplier_qualification_verify' },
    { id: 504, resourceId: 1, catalog: 'public-base', code: 'DM202609220001', name: '行政区划标准代码查询服务', englishName: 'administrative_division_query', version: 'V1.2', type: 'api', app: '数据治理运营分析', calls: 4386, avgResponse: '0.064 秒', maxConcurrency: 15, errors: 6, status: 'online', endpoint: 'https://api.datamap.local/share-api/1/administrative_division_query' },
    { id: 505, resourceId: 7, catalog: 'public-service', code: 'DM202609220007', name: '公共服务事项联办查询', englishName: 'public_service_joint_query', version: 'V1.6', type: 'api', app: '客户服务运营助手', calls: 3264, avgResponse: '0.196 秒', maxConcurrency: 9, errors: 38, status: 'offline', endpoint: 'https://api.datamap.local/share-api/7/public_service_joint_query' },
    { id: 506, resourceId: 102, catalog: 'mine-logistics', code: 'DM202609220102', name: '运输订单履约主题数据集', englishName: 'transport_order_fulfillment', version: 'V1.2', type: 'dataset', app: '供应链协同门户', calls: 1842, avgResponse: '1.238 秒', maxConcurrency: 5, errors: 9, status: 'online', endpoint: 'https://api.datamap.local/share-dataset/102/transport_order_fulfillment' },
    { id: 507, resourceId: 104, catalog: 'mine-customer', code: 'DM202609220104', name: '客户服务工单主题数据集', englishName: 'customer_service_work_order', version: 'V1.3', type: 'dataset', app: '客户服务运营助手', calls: 1356, avgResponse: '0.924 秒', maxConcurrency: 4, errors: 3, status: 'online', endpoint: 'https://api.datamap.local/share-dataset/104/customer_service_work_order' },
    { id: 508, resourceId: 108, catalog: 'public-city', code: 'DM202609220108', name: '城市道路运行监测数据集', englishName: 'urban_road_monitoring', version: 'V1.1', type: 'dataset', app: '城市运行监测', calls: 978, avgResponse: '1.416 秒', maxConcurrency: 3, errors: 12, status: 'offline', endpoint: 'https://api.datamap.local/share-dataset/108/urban_road_monitoring' }
  ];

  var API_CALL_RECORDS = [
    { id: 601, monitorId: 501, calledAt: '2026-09-24 14:58:36', app: '数据治理运营分析', account: 'present', response: '0.082 秒', status: 'success', message: '请求成功，返回客户标签数据。' },
    { id: 602, monitorId: 501, calledAt: '2026-09-24 14:51:20', app: '数据治理运营分析', account: 'present', response: '0.091 秒', status: 'success', message: '请求成功，返回客户标签数据。' },
    { id: 603, monitorId: 501, calledAt: '2026-09-24 14:42:15', app: '数据治理运营分析', account: 'present', response: '0.318 秒', status: 'failed', message: '请求参数 customer_id 不能为空。' },
    { id: 604, monitorId: 501, calledAt: '2026-09-24 14:30:48', app: '数据治理运营分析', account: 'present', response: '0.078 秒', status: 'success', message: '请求成功，返回客户标签数据。' },
    { id: 605, monitorId: 501, calledAt: '2026-09-24 14:18:06', app: '数据治理运营分析', account: 'present', response: '0.084 秒', status: 'success', message: '请求成功，返回客户标签数据。' },
    { id: 606, monitorId: 502, calledAt: '2026-09-24 14:55:10', app: '城市运行监测', account: 'present', response: '0.108 秒', status: 'success', message: '请求成功，返回道路运行指数。' },
    { id: 607, monitorId: 502, calledAt: '2026-09-24 14:33:42', app: '城市运行监测', account: 'present', response: '0.462 秒', status: 'failed', message: '访问凭证已过期，请更新 app_Key。' },
    { id: 608, monitorId: 503, calledAt: '2026-09-24 13:48:21', app: '企业综合服务', account: 'present', response: '0.139 秒', status: 'success', message: '请求成功，返回供应商资质信息。' },
    { id: 609, monitorId: 504, calledAt: '2026-09-24 13:12:08', app: '数据治理运营分析', account: 'present', response: '0.061 秒', status: 'success', message: '请求成功，返回行政区划信息。' },
    { id: 610, monitorId: 505, calledAt: '2026-09-23 17:26:50', app: '客户服务运营助手', account: 'present', response: '0.000 秒', status: 'failed', message: '接口已下架，当前无法调用。' }
  ];

  var APPLICATION_RECORDS = [
    { id: 701, monitorId: 501, catalog: 'mine-customer', code: 'DM202609220101', name: '客户画像标签查询服务', englishName: 'customer_profile_tag_query', version: 'V1.3', type: 'api', app: '数据治理运营分析', account: 'present', authMode: '使用期限+使用次数', authValue: '2026-09-24 00:00:00 / 2027-09-23 23:59:59；50,000 次', appliedAt: '2026-09-24 09:18:36', status: 'normal' },
    { id: 702, monitorId: 502, catalog: 'public-city', code: 'DM202609220105', name: '城市道路运行指数查询服务', englishName: 'urban_road_operation_index', version: 'V1.5', type: 'api', app: '城市运行监测', account: 'present', authMode: '使用期限', authValue: '2026-09-23 00:00:00 / 2027-09-22 23:59:59', appliedAt: '2026-09-23 16:05:22', status: 'normal' },
    { id: 703, catalog: 'mine-logistics', code: 'DM202609220102', name: '运输订单履约主题数据集', englishName: 'transport_order_fulfillment', version: 'V1.2', type: 'dataset', app: '供应链协同门户', account: 'present', authMode: '使用期限', authValue: '2026-09-23 00:00:00 / 2027-09-22 23:59:59', appliedAt: '2026-09-23 15:42:16', status: 'normal' },
    { id: 704, catalog: 'public-market', code: 'DM202609220106', name: '企业变更登记信息表', englishName: 'enterprise_registration_change', version: 'V1.0', type: 'db', app: '企业综合服务', account: 'present', authMode: '使用期限', authValue: '2026-09-22 00:00:00 / 2027-03-21 23:59:59', appliedAt: '2026-09-22 11:08:43', status: 'normal' },
    { id: 705, monitorId: 503, catalog: 'public-market', code: 'DM202609220107', name: '供应商资质核验服务', englishName: 'supplier_qualification_verify', version: 'V2.0', type: 'api', app: '企业综合服务', account: 'present', authMode: '使用次数', authValue: '20,000 次', appliedAt: '2026-09-21 10:26:18', status: 'normal' },
    { id: 706, monitorId: 504, catalog: 'public-base', code: 'DM202609220001', name: '行政区划标准代码查询服务', englishName: 'administrative_division_query', version: 'V1.2', type: 'api', app: '数据治理运营分析', account: 'present', authMode: '使用期限', authValue: '2025-09-20 00:00:00 / 2026-09-19 23:59:59', appliedAt: '2025-09-20 14:18:55', status: 'expired' },
    { id: 707, catalog: 'mine-customer', code: 'DM202609220104', name: '客户服务工单主题数据集', englishName: 'customer_service_work_order', version: 'V1.3', type: 'dataset', app: '客户服务运营助手', account: 'present', authMode: '使用期限', authValue: '2025-09-16 00:00:00 / 2026-09-15 23:59:59', appliedAt: '2025-09-16 14:18:55', status: 'expired' },
    { id: 708, monitorId: 505, catalog: 'public-service', code: 'DM202609220007', name: '公共服务事项联办查询', englishName: 'public_service_joint_query', version: 'V1.6', type: 'api', app: '客户服务运营助手', account: 'present', authMode: '使用期限+使用次数', authValue: '2026-09-18 00:00:00 / 2027-09-17 23:59:59；10,000 次', appliedAt: '2026-09-18 09:45:30', status: 'normal' }
  ];

  var DATA_MANAGEMENT_ITEMS = [
    { id: 801, catalog: 'public-base', type: 'api', sourceType: '接口开发', code: 'DM202609180801', title: '行政区划标准代码查询服务', englishName: 'administrative_division_query', description: '提供国家、省、市、区县四级行政区划代码和名称的标准查询能力。', version: 'V1.2', publishStatus: 'online', auditStatus: 'up-approved', category: '公共目录 / 公共基础数据', domain: '公共基础', views: 386, applies: 42, releasedAt: '2026-06-18 09:12:30', updatedAt: '2026-09-24 09:18:36', frequency: '每日', quality: '98 分', pushes: 18420, calls: 32685, manager: '数据治理中心', source: '数据共享交换平台', phone: '0755-88988901', profile: 'service', auditHistory: [['2026-06-18 09:12:30', '张璐', '审核通过', '处理意见：目录信息完整，同意上架'], ['2026-06-18 08:46:12', 'present', '发起申请', '处理意见：发起上架申请']] },
    { id: 802, catalog: 'public-market', type: 'api', sourceType: '接口注册', code: 'DM202609180802', title: '企业登记状态核验接口', englishName: 'enterprise_registration_status', description: '根据统一社会信用代码核验企业登记状态、登记机关及成立日期。', version: 'V2.0', publishStatus: 'composing', auditStatus: 'pending', category: '公共目录 / 市场主体数据', domain: '市场监管', views: 0, applies: 0, releasedAt: '尚未上架', updatedAt: '2026-09-24 10:16:03', frequency: '实时', quality: '96 分', pushes: 0, calls: 0, manager: '市场监管数据中心', source: '市场主体登记系统', phone: '0755-88988902', profile: 'market', auditHistory: [['2026-09-24 10:16:03', 'present', '保存编制', '处理意见：完成接口基本信息编制']] },
    { id: 803, catalog: 'public-service', type: 'orchestration', sourceType: 'API编排', code: 'DM202609180803', title: '公共服务事项联办查询', englishName: 'public_service_joint_query', description: '编排事项目录、办件进度和结果反馈接口，提供联办查询能力。', version: 'V1.6', publishStatus: 'pending', auditStatus: 'up-pending', category: '公共目录 / 公共服务数据', domain: '公共服务', views: 205, applies: 27, releasedAt: '待审核', updatedAt: '2026-09-24 08:42:15', frequency: '实时', quality: '95 分', pushes: 4860, calls: 9326, manager: '政务服务中心', source: '一体化政务服务平台', phone: '0755-88988903', profile: 'service', auditHistory: [['2026-09-24 08:42:15', 'present', '发起申请', '处理意见：发起上架申请'], ['2026-09-23 17:20:08', 'present', '保存编制', '处理意见：完成API编排配置']] },
    { id: 804, catalog: 'public-city', type: 'dataset', sourceType: '数据集资源注册', code: 'DM202609180804', title: '城市道路运行监测数据集', englishName: 'urban_road_monitoring', description: '提供路段级交通流量、平均速度、拥堵指数及统计时间数据。', version: 'V1.1', publishStatus: 'online', auditStatus: 'up-approved', category: '公共目录 / 城市运行数据', domain: '城市运行', views: 246, applies: 22, releasedAt: '2026-06-05 10:12:47', updatedAt: '2026-09-24 09:15:00', frequency: '每15分钟', quality: '97 分', pushes: 28940, calls: 12460, manager: '城市运行中心', source: '交通运行监测平台', phone: '0755-88988904', profile: 'road', auditHistory: [['2026-06-05 10:12:47', '刘明', '审核通过', '处理意见：数据项和更新策略符合要求'], ['2026-06-05 09:36:20', 'present', '发起申请', '处理意见：发起上架申请']] },
    { id: 805, catalog: 'mine-logistics', type: 'dataset', sourceType: '数据集资源注册', code: 'DM202609180805', title: '运输订单履约主题数据集', englishName: 'transport_order_fulfillment', description: '汇总运输订单、承运车辆、节点轨迹、签收状态和履约时效数据。', version: 'V1.2', publishStatus: 'composing', auditStatus: 'pending', category: '我的目录 / 物流运营数据', domain: '仓储物流', views: 0, applies: 0, releasedAt: '尚未上架', updatedAt: '2026-09-24 09:36:40', frequency: '每日', quality: '94 分', pushes: 0, calls: 0, manager: '供应链运营中心', source: '运输管理系统', phone: '0755-88988905', profile: 'inventory', auditHistory: [['2026-09-24 09:36:40', 'present', '保存编制', '处理意见：补充履约时效指标说明']] },
    { id: 806, catalog: 'mine-logistics', type: 'db', sourceType: '数据库表', code: 'DM202609180806', title: '仓库库存流水明细表', englishName: 'warehouse_inventory_flow', description: '记录商品入库、出库、调拨、盘点以及库存结余的业务流水。', version: 'V1.2', publishStatus: 'online', auditStatus: 'up-approved', category: '我的目录 / 物流运营数据', domain: '仓储物流', views: 175, applies: 12, releasedAt: '2026-06-26 09:42:18', updatedAt: '2026-09-24 09:05:26', frequency: '每小时', quality: '96 分', pushes: 21680, calls: 16842, manager: '供应链运营中心', source: '仓储管理系统', phone: '0755-88988906', profile: 'inventory', auditHistory: [['2026-06-26 09:42:18', '张璐', '审核通过', '处理意见：字段说明完整，同意上架'], ['2026-06-26 09:08:36', 'present', '发起申请', '处理意见：发起上架申请']] },
    { id: 807, catalog: 'public-market', type: 'db', sourceType: '数据库表', code: 'DM202609180807', title: '企业变更登记信息表', englishName: 'enterprise_registration_change', description: '记录市场主体名称、法定代表人、住所和经营范围等登记变更事项。', version: 'V1.0', publishStatus: 'pending', auditStatus: 'up-rejected', category: '公共目录 / 市场主体数据', domain: '市场监管', views: 141, applies: 8, releasedAt: '尚未上架', updatedAt: '2026-09-23 16:28:42', frequency: '每日', quality: '92 分', pushes: 0, calls: 0, manager: '市场监管数据中心', source: '市场主体登记系统', phone: '0755-88988907', profile: 'market', auditHistory: [['2026-09-23 16:28:42', '陈燕', '审核驳回', '处理意见：请补充变更前后内容字段说明'], ['2026-09-23 15:46:18', 'present', '发起申请', '处理意见：发起上架申请']] },
    { id: 808, catalog: 'mine-customer', type: 'api', sourceType: '接口开发', code: 'DM202609180808', title: '客户画像标签查询服务', englishName: 'customer_profile_tag_query', description: '按客户编号查询基础属性、价值分层、服务偏好和活跃度标签。', version: 'V1.3', publishStatus: 'online', auditStatus: 'up-approved', category: '我的目录 / 客户服务数据', domain: '客户服务', views: 236, applies: 18, releasedAt: '2026-07-08 10:18:26', updatedAt: '2026-09-24 10:02:16', frequency: '实时', quality: '98 分', pushes: 15260, calls: 28640, manager: '客户服务中心', source: '客户关系管理系统', phone: '0755-88988908', profile: 'service', auditHistory: [['2026-07-08 10:18:26', '刘明', '审核通过', '处理意见：服务范围明确，同意上架'], ['2026-07-08 09:40:12', 'present', '发起申请', '处理意见：发起上架申请']] },
    { id: 809, catalog: 'mine-customer', type: 'dataset', sourceType: '数据集资源注册', code: 'DM202609180809', title: '客户服务工单主题数据集', englishName: 'customer_service_work_order', description: '归集咨询、投诉和建议类工单的受理渠道、处置时效与评价结果。', version: 'V1.3', publishStatus: 'online', auditStatus: 'down-pending', category: '我的目录 / 客户服务数据', domain: '客户服务', views: 164, applies: 11, releasedAt: '2026-06-20 16:30:42', updatedAt: '2026-09-24 08:26:52', frequency: '每日', quality: '95 分', pushes: 13820, calls: 8640, manager: '客户服务中心', source: '客户工单系统', phone: '0755-88988909', profile: 'service', auditHistory: [['2026-09-24 08:26:52', 'present', '发起申请', '处理意见：业务口径调整，申请下架'], ['2026-06-20 16:30:42', '张璐', '审核通过', '处理意见：同意上架']] },
    { id: 810, catalog: 'public-city', type: 'db', sourceType: '数据库表', code: 'DM202609180810', title: '公共设施空间位置表', englishName: 'public_facility_location', description: '记录停车场、充电站、服务网点等公共设施的空间位置。', version: 'V1.0', publishStatus: 'composing', auditStatus: 'pending', category: '公共目录 / 城市运行数据', domain: '城市运行', views: 0, applies: 0, releasedAt: '尚未上架', updatedAt: '2026-09-24 07:58:30', frequency: '每周', quality: '93 分', pushes: 0, calls: 0, manager: '城市运行中心', source: '公共设施管理系统', phone: '0755-88988910', profile: 'road', auditHistory: [['2026-09-24 07:58:30', 'present', '保存编制', '处理意见：完成空间坐标字段配置']] },
    { id: 811, catalog: 'public-service', type: 'api', sourceType: '接口开发', code: 'DM202609180811', title: '气象预警信息查询服务', englishName: 'weather_warning_query', description: '查询预警类型、等级、影响区域、发布时间及防御指引。', version: 'V2.1', publishStatus: 'online', auditStatus: 'down-rejected', category: '公共目录 / 公共服务数据', domain: '公共服务', views: 232, applies: 29, releasedAt: '2026-05-30 08:35:16', updatedAt: '2026-09-23 18:42:35', frequency: '每小时', quality: '97 分', pushes: 19620, calls: 24380, manager: '气象服务中心', source: '气象预警发布系统', phone: '0755-88988911', profile: 'service', auditHistory: [['2026-09-23 18:42:35', '陈燕', '审核驳回', '处理意见：当前仍有应用调用，不同意下架'], ['2026-09-23 18:10:22', 'present', '发起申请', '处理意见：申请下架']] },
    { id: 812, catalog: 'public-base', type: 'dataset', sourceType: '数据集资源注册', code: 'DM202609180812', title: '标准行政区划基础数据集', englishName: 'standard_administrative_division', description: '提供行政区划代码、名称、层级、上级区划和有效状态。', version: 'V1.0', publishStatus: 'pending', auditStatus: 'up-pending', category: '公共目录 / 公共基础数据', domain: '公共基础', views: 0, applies: 0, releasedAt: '待审核', updatedAt: '2026-09-24 08:18:06', frequency: '每月', quality: '99 分', pushes: 0, calls: 0, manager: '数据治理中心', source: '基础数据管理系统', phone: '0755-88988912', profile: 'service', auditHistory: [['2026-09-24 08:18:06', 'present', '发起申请', '处理意见：发起上架申请'], ['2026-09-23 16:42:28', 'present', '保存编制', '处理意见：完成数据项核对']] }
  ];

  var SYSTEM_USERS = [
    { id: 901, account: 'present', name: '演示', gender: '男', department: '数据中台演示 / 我的部门', departmentId: 'my', phone: '13800138001', email: 'present@datamap.local', status: 'enabled', role: '系统管理员' },
    { id: 902, account: 'wangchang1', name: '王畅', gender: '女', department: '数据中台演示 / 我的部门', departmentId: 'my', phone: '13800138002', email: 'wangchang@datamap.local', status: 'enabled', role: '数据运营管理员' },
    { id: 903, account: 'present_test', name: '张红彬', gender: '男', department: '数据中台演示 / 我的部门 / 业务部', departmentId: 'business', phone: '13800138003', email: 'zhanghongbin@datamap.local', status: 'enabled', role: '审核专员' },
    { id: 904, account: 'present_dev', name: '王鹏', gender: '男', department: '数据中台演示 / 我的部门 / 工程部', departmentId: 'engineering', phone: '13800138004', email: 'wangpeng@datamap.local', status: 'enabled', role: '运行监控员' },
    { id: 905, account: 'liujing', name: '刘静', gender: '女', department: '数据中台演示 / 我的部门 / 业务部', departmentId: 'business', phone: '13800138005', email: 'liujing@datamap.local', status: 'enabled', role: '数据运营管理员' },
    { id: 906, account: 'chenming', name: '陈明', gender: '男', department: '数据中台演示 / 我的部门 / 工程部', departmentId: 'engineering', phone: '13800138006', email: 'chenming@datamap.local', status: 'disabled', role: '运行监控员' }
  ];

  var SYSTEM_ROLES = [
    { id: 951, name: '系统管理员', description: '负责平台用户、角色、配置和运行维护。', permissions: ['home.view', 'map.view', 'map.apply', 'map.favorite', 'personal.data.view', 'personal.data.test', 'personal.data.favorite', 'personal.data.pin', 'personal.audit.view', 'personal.audit.process', 'personal.audit.record', 'personal.favorite.view', 'personal.favorite.apply', 'personal.favorite.favorite', 'personal.app.view', 'personal.app.edit', 'personal.app.offline', 'personal.app.delete', 'personal.account.view', 'personal.account.edit', 'personal.message.view', 'personal.message.analysis', 'monitor.api.view', 'monitor.apply.view', 'system.data.view', 'system.data.online', 'system.data.offline', 'system.data.audit', 'system.data.edit', 'system.data.save', 'system.catalog.view', 'system.catalog.add', 'system.catalog.edit', 'system.catalog.delete', 'system.catalog.import', 'system.catalog.export', 'system.user.view', 'system.user.add', 'system.user.edit', 'system.user.delete', 'system.user.import', 'system.user.export', 'system.user.reset', 'system.user.status', 'system.role.view', 'system.role.add', 'system.role.edit', 'system.role.delete', 'system.config.view', 'system.config.edit', 'system.log.view', 'system.audit.view', 'system.audit.process', 'system.audit.record'] },
    { id: 952, name: '数据运营管理员', description: '负责数据资源编制、上架下架和目录运营。', permissions: ['home.view', 'map.view', 'map.apply', 'map.favorite', 'personal.data.view', 'personal.data.test', 'personal.data.favorite', 'personal.data.pin', 'personal.favorite.view', 'personal.favorite.apply', 'personal.favorite.favorite', 'personal.app.view', 'personal.message.view', 'monitor.apply.view', 'system.data.view', 'system.data.online', 'system.data.offline', 'system.data.audit', 'system.data.edit', 'system.data.save', 'system.catalog.view', 'system.catalog.add', 'system.catalog.edit', 'system.catalog.import', 'system.catalog.export'] },
    { id: 953, name: '审核专员', description: '负责数据与应用申请的审核处理和审核记录查询。', permissions: ['home.view', 'map.view', 'personal.audit.view', 'personal.audit.process', 'personal.audit.record', 'personal.message.view', 'system.data.view', 'system.audit.view', 'system.audit.process', 'system.audit.record'] },
    { id: 954, name: '运行监控员', description: '负责API运行情况、调用记录和操作日志巡检。', permissions: ['home.view', 'map.view', 'personal.data.view', 'personal.message.view', 'monitor.api.view', 'monitor.apply.view', 'system.log.view'] }
  ];

  var OPERATION_LOGS = [
    { id: 1001, account: 'present', name: '演示', module: '系统管理', type: 'normal', method: 'GET', content: '查询操作日志列表', error: '无', uri: '/dc/log/list', agent: 'Chrome 140 / Windows 11', ip: '10.20.16.35', createdAt: '2026-09-24 16:12:36' },
    { id: 1002, account: 'present', name: '演示', module: '系统管理', type: 'normal', method: 'GET', content: '查看系统配置', error: '无', uri: '/dc/config/detail', agent: 'Chrome 140 / Windows 11', ip: '10.20.16.35', createdAt: '2026-09-24 16:08:21' },
    { id: 1003, account: 'present', name: '演示', module: '系统管理', type: 'normal', method: 'POST', content: '保存角色权限：审核专员', error: '无', uri: '/dc/role/953/permission', agent: 'Chrome 140 / Windows 11', ip: '10.20.16.35', createdAt: '2026-09-24 15:56:42' },
    { id: 1004, account: 'wangchang1', name: '王畅', module: '数据地图', type: 'normal', method: 'GET', content: '查询数据目录：城市运行数据', error: '无', uri: '/dc/data-map/catalog/public-city', agent: 'Edge 140 / Windows 11', ip: '10.20.16.42', createdAt: '2026-09-24 15:42:16' },
    { id: 1005, account: 'present_test', name: '张红彬', module: '个人中心', type: 'normal', method: 'POST', content: '审核通过数据申请：客户画像标签查询服务', error: '无', uri: '/dc/audit/processing/2201', agent: 'Chrome 140 / Windows 10', ip: '10.20.18.21', createdAt: '2026-09-24 15:26:08' },
    { id: 1006, account: 'present_dev', name: '王鹏', module: '运行监控', type: 'error', method: 'GET', content: '查询城市道路运行指数服务调用日志', error: '调用日志服务响应超时', uri: '/dc/monitor/api/502/logs', agent: 'Chrome 140 / Windows 11', ip: '10.20.17.18', createdAt: '2026-09-24 15:18:55' },
    { id: 1007, account: 'present', name: '演示', module: '系统管理', type: 'normal', method: 'POST', content: '新增用户：刘静', error: '无', uri: '/dc/user/create', agent: 'Chrome 140 / Windows 11', ip: '10.20.16.35', createdAt: '2026-09-24 14:58:30' },
    { id: 1008, account: 'liujing', name: '刘静', module: '个人中心', type: 'normal', method: 'GET', content: '查询我的数据列表', error: '无', uri: '/dc/personal/my-data', agent: 'Edge 140 / Windows 11', ip: '10.20.19.12', createdAt: '2026-09-24 14:36:17' },
    { id: 1009, account: 'present', name: '演示', module: '系统管理', type: 'error', method: 'POST', content: '导入用户信息文件', error: '第6行手机号码格式不正确', uri: '/dc/user/import', agent: 'Chrome 140 / Windows 11', ip: '10.20.16.35', createdAt: '2026-09-24 14:20:43' },
    { id: 1010, account: 'wangchang1', name: '王畅', module: '数据地图', type: 'normal', method: 'POST', content: '收藏运输订单履约主题数据集', error: '无', uri: '/dc/favorite/102', agent: 'Edge 140 / Windows 11', ip: '10.20.16.42', createdAt: '2026-09-24 13:48:12' },
    { id: 1011, account: 'present_dev', name: '王鹏', module: '运行监控', type: 'normal', method: 'GET', content: '查询API监控列表', error: '无', uri: '/dc/monitor/api/list', agent: 'Chrome 140 / Windows 11', ip: '10.20.17.18', createdAt: '2026-09-24 11:32:20' },
    { id: 1012, account: 'present_test', name: '张红彬', module: '系统管理', type: 'normal', method: 'POST', content: '审核通过数据上架：标准行政区划基础数据集', error: '无', uri: '/dc/system-audit/812/process', agent: 'Chrome 140 / Windows 10', ip: '10.20.18.21', createdAt: '2026-09-24 10:18:32' }
  ];

  var TYPE_META = {
    api: { label: 'API接口', className: 'api' },
    dataset: { label: '数据集', className: 'dataset' },
    db: { label: '数据库表', className: 'db' },
    orchestration: { label: 'API编排', className: 'orchestration' }
  };

  var state = {
    view: 'home', homeTab: 'public', catalogId: 'public', openCatalogs: { public: true, mine: false },
    treeKeyword: '', draftKeyword: '', keyword: '', type: 'all', sortKey: '', sortAsc: false,
    page: 1, pageSize: 10, detailResourceId: 0, detailTab: '', detailOrigin: 'directory',
    testResourceId: 0, apiLimit: 'term', applyMode: 'apply',
    auditTab: 'pending', auditStatus: 'all', auditType: 'all', auditDraftKeyword: '', auditKeyword: '',
    auditPage: 1, auditPageSize: 10, auditSelected: {},
    appStatus: 'all', appDraftKeyword: '', appKeyword: '', appPage: 1, appPageSize: 10, appKeyVisible: {},
    messageTab: 'unread', messagePage: 1, messagePageSize: 10,
    monitorPeriod: '1', monitorStart: '2026-09-23 00:00:00', monitorEnd: '2026-09-24 23:59:59', monitorType: 'api', monitorApp: 'all', monitorStatus: 'all', monitorDraftKeyword: '', monitorKeyword: '', monitorPage: 1, monitorPageSize: 10,
    monitorDetailId: 0, monitorDetailOrigin: 'api-monitor', callPeriod: '1', callStart: '2026-09-23 00:00:00', callEnd: '2026-09-24 23:59:59', callApp: 'all', callStatus: 'all', callDraftAccount: '', callAccount: '', callPage: 1, callPageSize: 10,
    recordType: 'all', recordDraftData: '', recordData: '', recordVersion: 'all', recordApp: 'all', recordStatus: 'all', recordDraftAccount: '', recordAccount: '', recordPage: 1, recordPageSize: 10,
    managementTab: 'all', managementPublishStatus: 'all', managementAuditStatus: 'all', managementDraftKeyword: '', managementKeyword: '', managementPage: 1, managementPageSize: 10, managementSelected: {}, managementEditId: 0, managementEditTab: 'api-doc',
    systemAuditTab: 'all', systemAuditPublishStatus: 'all', systemAuditStatus: 'all', systemAuditDraftKeyword: '', systemAuditKeyword: '', systemAuditPage: 1, systemAuditPageSize: 10, systemAuditSelected: {}, systemAuditDetailId: 0, systemAuditDetailTab: 'api-doc',
    systemUserDept: 'all', systemUserStatus: 'all', systemUserDraftKeyword: '', systemUserKeyword: '', systemUserPage: 1, systemUserPageSize: 10, systemUserSelected: {},
    systemRoleKeyword: '', systemRoleSelectedId: 951, systemRoleSelected: {}, systemRoleAdding: false,
    systemConfigMode: 'standard', systemConfigName: '数据目录', systemConfigFooter1: '深圳市傲天科技股份有限公司', systemConfigFooter2: '备案：ICP备05000003号-2 | 公网安备33010502001397号 | 网站标识码：3301000005', systemConfigFooter3: '建议使用1366*768以上分辨率/Chrome、IE9或以上浏览器访问达到最佳效果',
    operationPeriod: '1', operationStart: '2026-09-23 00:00:00', operationEnd: '2026-09-24 23:59:59', operationModule: 'all', operationType: 'all', operationDraftKeyword: '', operationKeyword: '', operationPage: 1, operationPageSize: 10
  };

  var FIELD_PROFILES = {
    market: {
      fields: [
        ['unified_credit_code', '统一社会信用代码', 'TRUE', 'VARCHAR2', '18', '无', '市场主体统一身份标识'],
        ['entity_name', '市场主体名称', '', 'VARCHAR2', '200', '无', '登记注册的市场主体名称'],
        ['entity_type', '主体类型', '', 'VARCHAR2', '50', '无', '企业、个体工商户等主体类型'],
        ['registration_status', '登记状态', '', 'VARCHAR2', '20', '无', '存续、注销、迁出等登记状态'],
        ['establish_date', '成立日期', '', 'DATE', '7', '无', '市场主体成立日期'],
        ['registration_authority', '登记机关', '', 'VARCHAR2', '120', '无', '市场监督管理登记机关'],
        ['registered_capital', '注册资本', '', 'NUMBER', '18', '2', '登记注册资本，单位万元'],
        ['updated_at', '更新时间', '', 'DATE', '7', '无', '数据最后更新时间']
      ],
      rows: [
        ['91440300MA5F8A2X7K', '深圳启航数字科技有限公司', '有限责任公司', '存续', '2018-07-26', '深圳市市场监督管理局', '1200.00', '2026-09-21 22:10:38'],
        ['91440300MA5G3C9P2L', '深圳华创供应链有限公司', '有限责任公司', '存续', '2020-03-11', '深圳市市场监督管理局', '3000.00', '2026-09-21 22:10:38'],
        ['91440300MA5H7D6R4Q', '深圳云岭数据服务有限公司', '有限责任公司', '存续', '2022-01-18', '深圳市市场监督管理局', '800.00', '2026-09-21 22:10:38'],
        ['92440300MA5K2T8W6N', '深圳市南山区明诚商行', '个体工商户', '存续', '2024-04-09', '南山监管局', '50.00', '2026-09-21 22:10:38'],
        ['91440300MA5E9B1M8C', '深圳融通智慧物流有限公司', '有限责任公司', '存续', '2017-05-22', '深圳市市场监督管理局', '5000.00', '2026-09-21 22:10:38']
      ]
    },
    road: {
      fields: [
        ['statistical_time', '统计时间', 'TRUE', 'DATE', '7', '无', '道路运行指标统计时点'],
        ['road_code', '道路编码', 'TRUE', 'VARCHAR2', '32', '无', '城市道路唯一编码'],
        ['road_name', '道路名称', '', 'VARCHAR2', '120', '无', '道路标准名称'],
        ['average_speed', '平均速度', '', 'NUMBER', '8', '2', '平均行驶速度，单位千米/小时'],
        ['congestion_index', '拥堵指数', '', 'NUMBER', '6', '2', '道路拥堵指数'],
        ['traffic_level', '运行等级', '', 'VARCHAR2', '20', '无', '畅通、缓行、拥堵、严重拥堵'],
        ['updated_at', '更新时间', '', 'DATE', '7', '无', '数据最后更新时间']
      ],
      rows: [
        ['2026-09-22 09:00:00', 'RD-10021', '深南大道', '31.26', '1.42', '畅通', '2026-09-22 09:15:00'],
        ['2026-09-22 09:00:00', 'RD-10036', '滨河大道', '24.80', '1.86', '缓行', '2026-09-22 09:15:00'],
        ['2026-09-22 09:00:00', 'RD-10055', '北环大道', '27.15', '1.63', '缓行', '2026-09-22 09:15:00'],
        ['2026-09-22 09:00:00', 'RD-10072', '南海大道', '18.62', '2.31', '拥堵', '2026-09-22 09:15:00'],
        ['2026-09-22 09:00:00', 'RD-10093', '香蜜湖路', '33.48', '1.28', '畅通', '2026-09-22 09:15:00']
      ]
    },
    service: {
      fields: [
        ['work_order_no', '工单编号', 'TRUE', 'VARCHAR2', '32', '无', '客户服务工单唯一编号'],
        ['appeal_type', '诉求类型', '', 'VARCHAR2', '30', '无', '咨询、投诉或建议'],
        ['service_channel', '受理渠道', '', 'VARCHAR2', '20', '无', '热线、网站或移动端'],
        ['received_time', '受理时间', '', 'DATE', '7', '无', '工单受理时间'],
        ['handle_status', '处置状态', '', 'VARCHAR2', '20', '无', '待受理、处理中或已办结'],
        ['completion_time', '办结时间', '', 'DATE', '7', '无', '工单实际办结时间'],
        ['satisfaction_score', '满意度评分', '', 'NUMBER', '2', '0', '用户满意度评分，满分5分']
      ],
      rows: [
        ['WO202609220001', '咨询', '服务热线', '2026-09-22 08:12:36', '已办结', '2026-09-22 09:03:20', '5'],
        ['WO202609220002', '投诉', '移动端', '2026-09-22 08:25:14', '处理中', '—', '—'],
        ['WO202609220003', '建议', '门户网站', '2026-09-22 08:47:08', '处理中', '—', '—'],
        ['WO202609220004', '咨询', '服务热线', '2026-09-22 09:02:41', '已办结', '2026-09-22 09:38:16', '4'],
        ['WO202609220005', '投诉', '移动端', '2026-09-22 09:20:33', '待受理', '—', '—']
      ]
    }
  };

  FIELD_PROFILES.inventory = {
    fields: [
      ['flow_no', '流水编号', 'TRUE', 'VARCHAR2', '32', '无', '库存变动流水唯一编号'],
      ['warehouse_code', '仓库编码', '', 'VARCHAR2', '20', '无', '发生库存变动的仓库编码'],
      ['sku_code', '商品编码', '', 'VARCHAR2', '30', '无', '库存商品唯一编码'],
      ['business_type', '业务类型', '', 'VARCHAR2', '20', '无', '入库、出库、调拨或盘点'],
      ['quantity', '变动数量', '', 'NUMBER', '14', '2', '本次库存变动数量'],
      ['happened_at', '发生时间', '', 'DATE', '7', '无', '业务实际发生时间'],
      ['operator_name', '操作人员', '', 'VARCHAR2', '50', '库存业务操作人员']
    ],
    rows: [
      ['INV202609220001', 'WH-SZ-01', 'SKU-100238', '入库', '320.00', '2026-09-22 08:15:22', '陈明'],
      ['INV202609220002', 'WH-SZ-01', 'SKU-100517', '出库', '-86.00', '2026-09-22 08:32:10', '李静'],
      ['INV202609220003', 'WH-DG-02', 'SKU-100238', '调拨', '120.00', '2026-09-22 08:48:35', '王强'],
      ['INV202609220004', 'WH-SZ-01', 'SKU-100904', '盘点', '-3.00', '2026-09-22 09:05:41', '周敏'],
      ['INV202609220005', 'WH-DG-02', 'SKU-100517', '入库', '500.00', '2026-09-22 09:18:06', '赵峰']
    ]
  };

  function escapeHtml(value) {
    return String(value == null ? '' : value).replace(/[&<>'"]/g, function (char) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char];
    });
  }

  function breadcrumbHtml(items, current) {
    var links = '<a href="#page=datamap-home&amp;dmView=home" data-breadcrumb-view="home"><i class="bi bi-house-door"></i><span>首页</span></a>';
    (items || []).forEach(function (item) {
      links += '<i class="bi bi-chevron-right"></i><a href="#page=datamap-home&amp;dmView=' + item[1] + '" data-breadcrumb-view="' + item[1] + '">' + escapeHtml(item[0]) + '</a>';
    });
    return '<div class="dm-breadcrumb">' + links + '<i class="bi bi-chevron-right"></i><strong>' + escapeHtml(current) + '</strong></div>';
  }

  function enhanceBreadcrumbLinks(root) {
    if (!root || !root.querySelectorAll) return;
    root.querySelectorAll('.dm-breadcrumb').forEach(function (breadcrumb) {
      Array.prototype.slice.call(breadcrumb.children).filter(function (child) { return child.tagName === 'SPAN'; }).forEach(function (span) {
        var label = span.textContent.trim();
        var systemContext = breadcrumb.textContent.indexOf('系统管理') > -1;
        var viewMap = {
          '首页': 'home', '数据地图': 'directory', '个人中心': 'my-data', '我的数据': 'my-data', '我的收藏': 'favorites',
          '运行监控': 'api-monitor', 'API监控': 'api-monitor', '系统管理': 'data-management', '数据管理': 'data-management'
        };
        var view = label === '审核中心' ? (systemContext ? 'system-audit-center' : 'audit-center') : viewMap[label];
        if (!view) return;
        var link = document.createElement('a');
        link.href = '#page=datamap-home&dmView=' + view;
        link.dataset.breadcrumbView = view;
        span.parentNode.replaceChild(link, span);
        if (label === '首页') {
          var homeIcon = link.previousElementSibling;
          if (homeIcon && homeIcon.classList.contains('bi-house-door')) link.appendChild(homeIcon);
        }
        link.appendChild(span);
      });
    });
  }

  function renderStats(tabKey) {
    var data = DATA_SETS[tabKey] || DATA_SETS.public;
    return data.stats.map(function (item) {
      return '' +
        '<div class="dm-stat-card">' +
          '<div class="dm-stat-label">' + item.label + '</div>' +
          '<div class="dm-stat-value">' + item.value + '</div>' +
          '<span class="dm-stat-icon"><i class="bi ' + item.icon + '"></i></span>' +
        '</div>';
    }).join('');
  }

  function renderResources(tabKey) {
    var data = DATA_SETS[tabKey] || DATA_SETS.public;
    return data.resources.map(function (item) {
      return '' +
        '<article class="dm-resource-card" tabindex="0" data-resource-title="' + item.title + '">' +
          '<div class="dm-card-head">' +
            '<h3 class="dm-card-title">' + item.title + '</h3>' +
            '<span class="dm-card-type">' + item.type + '</span>' +
          '</div>' +
          '<div class="dm-card-line">' +
            '<span>数据分类：' + item.category + '</span>' +
            '<span class="dm-card-sep"></span>' +
            '<span>更新频率：' + item.frequency + '</span>' +
          '</div>' +
          '<div class="dm-card-line">' +
            '<span>上架时间：' + item.onlineAt + '</span>' +
            '<span class="dm-card-sep"></span>' +
            '<span>更新时间：' + item.updatedAt + '</span>' +
          '</div>' +
          '<div class="dm-card-foot">' +
            '<span><i class="bi bi-eye"></i>浏览量：' + item.views + '</span>' +
            '<span><i class="bi bi-file-earmark-plus"></i>申请量：' + item.applies + '</span>' +
          '</div>' +
        '</article>';
    }).join('');
  }

  function showToast(message) {
    var toast = document.querySelector('.dm-map-toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(function () {
      toast.classList.remove('show');
    }, 1800);
  }

  function setActiveTab(tabKey) {
    document.querySelectorAll('.dm-tab').forEach(function (tab) {
      tab.classList.toggle('active', tab.dataset.dmTab === tabKey);
    });

    var statsGrid = document.getElementById('dmStatsGrid');
    var resourceGrid = document.getElementById('dmResourceGrid');
    if (statsGrid) statsGrid.innerHTML = renderStats(tabKey);
    if (resourceGrid) resourceGrid.innerHTML = renderResources(tabKey);
    bindResourceCards();
  }

  function runSearch() {
    var input = document.querySelector('.dm-search-input');
    var keyword = input ? input.value.trim() : '';
    showToast(keyword ? '已模拟搜索：' + keyword : '请输入关键字后搜索');
  }

  function bindResourceCards() {
    document.querySelectorAll('.dm-resource-card').forEach(function (card) {
      card.addEventListener('click', function () {
        showToast('已选中资源：' + (card.dataset.resourceTitle || '数据资源'));
      });
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') card.click();
      });
    });
  }

  function homeViewHtml() {
    return '<section class="dm-hero" aria-label="数据地图横幅"></section>' +
      '<section class="dm-search-panel" aria-label="数据搜索"><div class="dm-search-row"><input class="dm-search-input" type="text" aria-label="搜索关键字" placeholder="请输入数据资源名称或简介"><button type="button" class="dm-search-btn" data-home-search><i class="bi bi-search"></i><span>搜索</span></button></div>' +
      '<div class="dm-hot-row"><span class="dm-hot-label">热门搜索：</span><button type="button" class="dm-hot-tag" data-keyword="行政区划">行政区划</button><button type="button" class="dm-hot-tag" data-keyword="信用代码">信用代码</button><button type="button" class="dm-hot-tag" data-keyword="工单">工单</button><button type="button" class="dm-hot-tag" data-keyword="库存">库存</button></div></section>' +
      '<section class="dm-tabs-wrap" aria-label="数据类型切换"><div class="dm-tabs"><button type="button" class="dm-tab ' + (state.homeTab === 'public' ? 'active' : '') + '" data-dm-tab="public">公共数据</button><button type="button" class="dm-tab ' + (state.homeTab === 'enterprise' ? 'active' : '') + '" data-dm-tab="enterprise">企业数据</button></div></section>' +
      '<section class="dm-stats-section" aria-label="数据概览"><div class="dm-stats-grid" id="dmStatsGrid">' + renderStats(state.homeTab) + '</div></section>' +
      '<section class="dm-resource-section" aria-label="数据资源列表"><div class="dm-resource-grid" id="dmResourceGrid">' + renderResources(state.homeTab) + '</div></section>' +
      '<footer class="dm-footer"><div class="dm-company">深圳市傲天科技股份有限公司</div><div class="dm-record"><i class="bi bi-record-circle-fill"></i>备案：ICP备05000003号-2&nbsp;&nbsp;|&nbsp;&nbsp;公网安备33010502001397号&nbsp;&nbsp;|&nbsp;&nbsp;网站标识码：3301000005</div><div class="dm-browser-tip">建议使用1366*768以上分辨率/Chrome、IE9或以上浏览器访问达到最佳效果</div></footer>';
  }

  function catalogIncludes(resourceCatalog, selectedId) {
    if (selectedId === 'public' || selectedId === 'mine') return resourceCatalog.indexOf(selectedId + '-') === 0;
    return resourceCatalog === selectedId;
  }

  function getFilteredResources() {
    var keyword = state.keyword.toLowerCase();
    var list = DIRECTORY_RESOURCES.filter(function (item) {
      var text = [item.title, item.description, item.category, TYPE_META[item.type].label].join(' ').toLowerCase();
      return catalogIncludes(item.catalog, state.catalogId) && (state.type === 'all' || item.type === state.type) && (!keyword || text.indexOf(keyword) > -1);
    });
    if (state.sortKey) {
      list.sort(function (a, b) {
        var av = a[state.sortKey];
        var bv = b[state.sortKey];
        if (typeof av === 'string') return state.sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
        return state.sortAsc ? av - bv : bv - av;
      });
    }
    return list;
  }

  function highlightName(name, keyword) {
    if (!keyword) return escapeHtml(name);
    var safeName = escapeHtml(name);
    var safeKeyword = escapeHtml(keyword);
    return safeName.replace(new RegExp('(' + safeKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig'), '<em>$1</em>');
  }

  function treeMatches(node, keyword) {
    if (!keyword || node.name.toLowerCase().indexOf(keyword.toLowerCase()) > -1) return true;
    return (node.children || []).some(function (child) { return treeMatches(child, keyword); });
  }

  function treeHtml() {
    var keyword = state.treeKeyword.trim();
    var roots = CATALOGS.filter(function (node) { return treeMatches(node, keyword); });
    if (!roots.length) return '<div class="dm-tree-empty"><i class="bi bi-folder-x"></i><span>未找到匹配目录</span></div>';
    return roots.map(function (root) {
      var rootMatch = root.name.toLowerCase().indexOf(keyword.toLowerCase()) > -1;
      var children = root.children.filter(function (child) { return !keyword || rootMatch || treeMatches(child, keyword); });
      var expanded = keyword ? true : !!state.openCatalogs[root.id];
      return '<div class="dm-tree-group"><button type="button" class="dm-tree-node dm-tree-root ' + (state.catalogId === root.id ? 'active' : '') + '" data-catalog="' + root.id + '" data-has-children="true"><i class="bi ' + (expanded ? 'bi-caret-down-fill' : 'bi-caret-right-fill') + ' dm-tree-arrow"></i><i class="bi ' + (expanded ? 'bi-folder2-open' : 'bi-folder') + ' dm-tree-folder"></i><span>' + highlightName(root.name, keyword) + '</span><small>(' + root.count + ')</small></button>' +
        '<div class="dm-tree-children ' + (expanded ? 'expanded' : '') + '">' + children.map(function (child) { return '<button type="button" class="dm-tree-node dm-tree-child ' + (state.catalogId === child.id ? 'active' : '') + '" data-catalog="' + child.id + '"><i class="bi bi-file-earmark-text dm-tree-file"></i><span>' + highlightName(child.name, keyword) + '</span><small>(' + child.count + ')</small></button>'; }).join('') + '</div></div>';
    }).join('');
  }

  function resultItemHtml(item) {
    var meta = TYPE_META[item.type];
    return '<article class="dm-directory-item"><div class="dm-directory-item-head"><div class="dm-directory-title-wrap"><span class="dm-type-tag ' + meta.className + '">' + meta.label + '</span><h3>' + escapeHtml(item.title) + '</h3></div><div class="dm-directory-actions">' +
      (!item.applied ? '<button type="button" class="dm-dir-btn primary" data-apply-id="' + item.id + '"><i class="bi bi-send"></i>申请</button>' : '') +
      '<button type="button" class="dm-dir-btn" data-detail-id="' + item.id + '"><i class="bi bi-eye"></i>查看详情</button><button type="button" class="dm-dir-btn" data-favorite-id="' + item.id + '"><i class="bi ' + (item.favorite ? 'bi-star-fill' : 'bi-star') + '"></i>' + (item.favorite ? '取消收藏' : '加入收藏') + '</button></div></div>' +
      '<p class="dm-directory-desc"><span>数据简介：</span>' + escapeHtml(item.description) + '</p><div class="dm-directory-meta"><span>数据分类：' + escapeHtml(item.category) + '</span><span>浏览量：' + item.views + ' 次</span><span>申请量：' + item.applies + ' 次</span><span>上架时间：' + item.releasedAt + '</span><span>更新时间：' + item.updatedAt + '</span><span>更新频率：' + item.frequency + '</span><span>版本：' + item.version + '</span></div></article>';
  }

  function resultPanelHtml() {
    var list = getFilteredResources();
    var total = list.length;
    var pages = Math.max(1, Math.ceil(total / state.pageSize));
    if (state.page > pages) state.page = pages;
    var start = (state.page - 1) * state.pageSize;
    var pageItems = list.slice(start, start + state.pageSize);
    var pageButtons = '';
    for (var i = 1; i <= pages; i += 1) pageButtons += '<button type="button" class="dm-page-num ' + (i === state.page ? 'active' : '') + '" data-page="' + i + '">' + i + '</button>';
    var tabs = [['all', '全部'], ['api', 'API接口'], ['dataset', '数据集'], ['db', '数据库表']];
    var sorts = [['views', '浏览量'], ['applies', '申请量'], ['releasedAt', '上架时间'], ['updatedAt', '更新时间']];
    return '<div class="dm-directory-toolbar"><div class="dm-directory-tabs">' + tabs.map(function (tab) { return '<button type="button" class="' + (state.type === tab[0] ? 'active' : '') + '" data-resource-type="' + tab[0] + '">' + tab[1] + '</button>'; }).join('') + '</div><div class="dm-sort"><span>排序：</span>' + sorts.map(function (sort) { var active = state.sortKey === sort[0]; return '<button type="button" class="' + (active ? 'active' : '') + '" data-sort="' + sort[0] + '">' + sort[1] + '<i class="bi bi-arrow-' + (active && state.sortAsc ? 'up' : 'down') + '"></i></button>'; }).join('') + '</div></div>' +
      '<div class="dm-directory-list">' + (pageItems.length ? pageItems.map(resultItemHtml).join('') : '<div class="dm-result-empty"><i class="bi bi-inbox"></i><strong>暂无匹配的数据资源</strong><span>请调整目录、类型或搜索关键字</span></div>') + '</div>' +
      '<div class="dm-directory-pagination"><span>共 ' + total + ' 条</span><div class="dm-page-buttons"><button type="button" class="dm-page-arrow" data-page="' + (state.page - 1) + '" ' + (state.page === 1 ? 'disabled' : '') + '><i class="bi bi-chevron-left"></i></button>' + pageButtons + '<button type="button" class="dm-page-arrow" data-page="' + (state.page + 1) + '" ' + (state.page === pages ? 'disabled' : '') + '><i class="bi bi-chevron-right"></i></button><select class="dm-page-size" aria-label="每页条数"><option value="10" ' + (state.pageSize === 10 ? 'selected' : '') + '>10 条/页</option><option value="20" ' + (state.pageSize === 20 ? 'selected' : '') + '>20 条/页</option></select></div></div>';
  }

  function getFilteredFavorites() {
    var keyword = state.keyword.toLowerCase();
    var list = DIRECTORY_RESOURCES.filter(function (item) {
      var typeMatched = state.type === 'all' || item.type === state.type || state.type === 'api' && item.type === 'orchestration';
      var text = [item.title, item.description, item.category, TYPE_META[item.type].label].join(' ').toLowerCase();
      return item.favorite && catalogIncludes(item.catalog, state.catalogId) && typeMatched && (!keyword || text.indexOf(keyword) > -1);
    });
    if (state.sortKey) {
      list.sort(function (a, b) {
        var av = a[state.sortKey];
        var bv = b[state.sortKey];
        if (typeof av === 'string') return state.sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
        return state.sortAsc ? av - bv : bv - av;
      });
    }
    return list;
  }

  function favoriteItemHtml(item) {
    var meta = TYPE_META[item.type];
    return '<article class="dm-directory-item"><div class="dm-directory-item-head"><div class="dm-directory-title-wrap"><span class="dm-type-tag ' + meta.className + '">' + meta.label + '</span><h3>' + escapeHtml(item.title) + '【' + item.version + '】</h3></div><div class="dm-directory-actions">' +
      (!item.applied ? '<button type="button" class="dm-dir-btn primary" data-apply-id="' + item.id + '"><i class="bi bi-send"></i>申请</button>' : '') +
      '<button type="button" class="dm-dir-btn" data-detail-id="' + item.id + '"><i class="bi bi-eye"></i>查看详情</button><button type="button" class="dm-dir-btn" data-favorite-id="' + item.id + '"><i class="bi bi-star-fill"></i>取消收藏</button></div></div>' +
      '<p class="dm-directory-desc"><span>数据简介：</span>' + escapeHtml(item.description) + '</p><div class="dm-directory-meta"><span>数据分类：' + escapeHtml(item.category) + '</span><span>浏览量：' + item.views + ' 次</span><span>申请量：' + item.applies + ' 次</span><span>上架时间：' + item.releasedAt + '</span><span>更新时间：' + item.updatedAt + '</span><span>更新频率：' + item.frequency + '</span><span>版本：' + item.version + '</span></div></article>';
  }

  function favoriteResultPanelHtml() {
    var list = getFilteredFavorites();
    var total = list.length;
    var pages = Math.max(1, Math.ceil(total / state.pageSize));
    if (state.page > pages) state.page = pages;
    var start = (state.page - 1) * state.pageSize;
    var pageItems = list.slice(start, start + state.pageSize);
    var pageButtons = '';
    for (var i = 1; i <= pages; i += 1) pageButtons += '<button type="button" class="dm-page-num ' + (i === state.page ? 'active' : '') + '" data-page="' + i + '">' + i + '</button>';
    var tabs = [['all', '全部'], ['api', 'API接口'], ['dataset', '数据集'], ['db', '数据库表']];
    var sorts = [['views', '浏览量'], ['applies', '申请量'], ['releasedAt', '上架时间'], ['updatedAt', '更新时间']];
    return '<div class="dm-directory-toolbar"><div class="dm-directory-tabs">' + tabs.map(function (tab) { return '<button type="button" class="' + (state.type === tab[0] ? 'active' : '') + '" data-resource-type="' + tab[0] + '">' + tab[1] + '</button>'; }).join('') + '</div><div class="dm-sort"><span>排序：</span>' + sorts.map(function (sort) { var active = state.sortKey === sort[0]; return '<button type="button" class="' + (active ? 'active' : '') + '" data-sort="' + sort[0] + '">' + sort[1] + '<i class="bi bi-arrow-' + (active && state.sortAsc ? 'up' : 'down') + '"></i></button>'; }).join('') + '</div></div>' +
      '<div class="dm-directory-list">' + (pageItems.length ? pageItems.map(favoriteItemHtml).join('') : '<div class="dm-result-empty"><i class="bi bi-inbox"></i><strong>暂无匹配的收藏资源</strong><span>请调整目录、类型或搜索关键字</span></div>') + '</div>' +
      '<div class="dm-directory-pagination"><span>共 ' + total + ' 条</span><div class="dm-page-buttons"><button type="button" class="dm-page-arrow" data-page="' + (state.page - 1) + '" ' + (state.page === 1 ? 'disabled' : '') + '><i class="bi bi-chevron-left"></i></button>' + pageButtons + '<button type="button" class="dm-page-arrow" data-page="' + (state.page + 1) + '" ' + (state.page === pages ? 'disabled' : '') + '><i class="bi bi-chevron-right"></i></button><select class="dm-page-size" aria-label="每页条数"><option value="10" ' + (state.pageSize === 10 ? 'selected' : '') + '>10 条/页</option><option value="20" ' + (state.pageSize === 20 ? 'selected' : '') + '>20 条/页</option></select></div></div>';
  }

  function getFilteredMyData() {
    var keyword = state.keyword.toLowerCase();
    return MY_DATA_RESOURCES.filter(function (item) {
      var rootSelected = state.catalogId === 'public' || state.catalogId === 'mine';
      var text = [item.title, item.description, item.category, TYPE_META[item.type].label].join(' ').toLowerCase();
      return (rootSelected || catalogIncludes(item.catalog, state.catalogId)) &&
        (state.type === 'all' || item.type === state.type) && (!keyword || text.indexOf(keyword) > -1);
    }).sort(function (a, b) {
      if (!!a.pinned !== !!b.pinned) return a.pinned ? -1 : 1;
      return b.updatedAt.localeCompare(a.updatedAt);
    });
  }

  function myDataItemHtml(item) {
    var meta = TYPE_META[item.type];
    return '<article class="dm-directory-item"><div class="dm-directory-item-head"><div class="dm-directory-title-wrap"><span class="dm-type-tag ' + meta.className + '">' + meta.label + '</span><h3>' + escapeHtml(item.title) + '【' + item.version + '】</h3>' + (item.pinned ? '<span class="dm-pinned-mark"><i class="bi bi-pin-angle-fill"></i>已置顶</span>' : '') + '</div><div class="dm-directory-actions dm-my-data-actions">' +
      '<button type="button" class="dm-dir-btn" data-change-id="' + item.id + '"><i class="bi bi-arrow-repeat"></i>变更申请</button>' +
      '<button type="button" class="dm-dir-btn" data-detail-id="' + item.id + '"><i class="bi bi-eye"></i>查看详情</button>' +
      (item.type === 'api' ? '<button type="button" class="dm-dir-btn" data-test-id="' + item.id + '"><i class="bi bi-terminal"></i>接口测试</button>' : '') +
      '<button type="button" class="dm-dir-btn" data-favorite-id="' + item.id + '"><i class="bi ' + (item.favorite ? 'bi-star-fill' : 'bi-star') + '"></i>' + (item.favorite ? '取消收藏' : '加入收藏') + '</button>' +
      '<button type="button" class="dm-dir-btn" data-pin-id="' + item.id + '"><i class="bi ' + (item.pinned ? 'bi-pin-angle-fill' : 'bi-pin-angle') + '"></i>' + (item.pinned ? '取消置顶' : '数据置顶') + '</button></div></div>' +
      '<p class="dm-directory-desc"><span>数据简介：</span>' + escapeHtml(item.description) + '</p><div class="dm-directory-meta"><span>数据分类：' + escapeHtml(item.category) + '</span><span>浏览量：' + item.views + ' 次</span><span>申请量：' + item.applies + ' 次</span><span>上架时间：' + item.releasedAt + '</span><span>更新时间：' + item.updatedAt + '</span><span>更新频率：' + item.frequency + '</span><span>版本：' + item.version + '</span></div></article>';
  }

  function myDataResultPanelHtml() {
    var list = getFilteredMyData();
    var total = list.length;
    var pages = Math.max(1, Math.ceil(total / state.pageSize));
    if (state.page > pages) state.page = pages;
    var start = (state.page - 1) * state.pageSize;
    var pageItems = list.slice(start, start + state.pageSize);
    var pageButtons = '';
    for (var i = 1; i <= pages; i += 1) pageButtons += '<button type="button" class="dm-page-num ' + (i === state.page ? 'active' : '') + '" data-page="' + i + '">' + i + '</button>';
    var tabs = [['all', '全部'], ['api', 'API接口'], ['dataset', '数据集'], ['db', '数据库表']];
    return '<div class="dm-directory-toolbar dm-my-data-toolbar"><div class="dm-directory-tabs">' + tabs.map(function (tab) { return '<button type="button" class="' + (state.type === tab[0] ? 'active' : '') + '" data-resource-type="' + tab[0] + '">' + tab[1] + '</button>'; }).join('') + '</div></div>' +
      '<div class="dm-directory-list">' + (pageItems.length ? pageItems.map(myDataItemHtml).join('') : '<div class="dm-result-empty"><i class="bi bi-inbox"></i><strong>暂无匹配的数据资源</strong><span>请调整目录、类型或搜索关键字</span></div>') + '</div>' +
      '<div class="dm-directory-pagination"><span>共 ' + total + ' 条</span><div class="dm-page-buttons"><button type="button" class="dm-page-arrow" data-page="' + (state.page - 1) + '" ' + (state.page === 1 ? 'disabled' : '') + '><i class="bi bi-chevron-left"></i></button>' + pageButtons + '<button type="button" class="dm-page-arrow" data-page="' + (state.page + 1) + '" ' + (state.page === pages ? 'disabled' : '') + '><i class="bi bi-chevron-right"></i></button><select class="dm-page-size" aria-label="每页条数"><option value="10" ' + (state.pageSize === 10 ? 'selected' : '') + '>10 条/页</option><option value="20" ' + (state.pageSize === 20 ? 'selected' : '') + '>20 条/页</option></select></div></div>';
  }

  function myDataViewHtml() {
    return '<div class="dm-directory-page dm-my-data-page">' + breadcrumbHtml([['个人中心', 'my-data']], '我的数据') + '<div class="dm-directory-layout">' +
      '<aside class="dm-catalog-panel"><h2><i class="bi bi-diagram-3"></i>数据地图</h2><label class="dm-tree-search"><input type="text" value="' + escapeHtml(state.treeKeyword) + '" placeholder="请输入" aria-label="搜索目录"><i class="bi bi-search"></i></label><div class="dm-catalog-tree">' + treeHtml() + '</div></aside>' +
      '<main class="dm-directory-main"><section class="dm-directory-search"><div class="dm-directory-search-row"><input type="text" value="' + escapeHtml(state.draftKeyword) + '" placeholder="请输入数据资源名称或简介" aria-label="搜索我的数据"><button type="button" data-directory-search><i class="bi bi-search"></i>搜索</button></div></section><section class="dm-directory-results">' + myDataResultPanelHtml() + '</section></main></div></div>';
  }

  function favoritesViewHtml() {
    return '<div class="dm-directory-page dm-favorites-page">' + breadcrumbHtml([['个人中心', 'my-data']], '我的收藏') + '<div class="dm-directory-layout">' +
      '<aside class="dm-catalog-panel"><h2><i class="bi bi-diagram-3"></i>数据地图</h2><label class="dm-tree-search"><input type="text" value="' + escapeHtml(state.treeKeyword) + '" placeholder="请输入" aria-label="搜索目录"><i class="bi bi-search"></i></label><div class="dm-catalog-tree">' + treeHtml() + '</div></aside>' +
      '<main class="dm-directory-main"><section class="dm-directory-search"><div class="dm-directory-search-row"><input type="text" value="' + escapeHtml(state.draftKeyword) + '" placeholder="请输入数据资源名称或简介" aria-label="搜索我的收藏"><button type="button" data-directory-search><i class="bi bi-search"></i>搜索</button></div></section><section class="dm-directory-results">' + favoriteResultPanelHtml() + '</section></main></div></div>';
  }

  function directoryViewHtml() {
    return '<div class="dm-directory-page">' + breadcrumbHtml([], '数据地图') + '<div class="dm-directory-layout">' +
      '<aside class="dm-catalog-panel"><h2><i class="bi bi-diagram-3"></i>数据地图</h2><label class="dm-tree-search"><input type="text" value="' + escapeHtml(state.treeKeyword) + '" placeholder="请输入" aria-label="搜索目录"><i class="bi bi-search"></i></label><div class="dm-catalog-tree">' + treeHtml() + '</div></aside>' +
      '<main class="dm-directory-main"><section class="dm-directory-search"><div class="dm-directory-search-row"><input type="text" value="' + escapeHtml(state.draftKeyword) + '" placeholder="请输入数据资源名称或简介" aria-label="搜索数据资源"><button type="button" data-directory-search><i class="bi bi-search"></i>搜索</button></div></section><section class="dm-directory-results">' + resultPanelHtml() + '</section></main></div></div>';
  }

  function getFieldProfile(item) {
    if (item.profile && FIELD_PROFILES[item.profile]) return FIELD_PROFILES[item.profile];
    if (item.id === 5) return FIELD_PROFILES.road;
    if (item.id === 10) return FIELD_PROFILES.inventory;
    if (item.id === 11 || item.id === 12) return FIELD_PROFILES.service;
    return FIELD_PROFILES.market;
  }

  function getDetailInfo(item) {
    var englishNames = {
      1: 'administrative_division_query', 2: 'credit_code_verification', 3: 'market_entity_base', 4: 'enterprise_registration_change',
      5: 'urban_road_operation_index', 6: 'public_facility_location', 7: 'public_service_joint_query', 8: 'weather_warning_query',
      9: 'transport_order_trace', 10: 'warehouse_inventory_flow', 11: 'customer_service_work_order', 12: 'customer_appeal_disposal'
    };
    var domain = item.catalog.indexOf('market') > -1 ? '市场监管' : item.catalog.indexOf('city') > -1 ? '城市运行' : item.catalog.indexOf('logistics') > -1 ? '仓储物流' : item.catalog.indexOf('customer') > -1 ? '客户服务' : '公共基础';
    return {
      code: 'DM' + String(202609220000 + item.id), englishName: item.englishName || englishNames[item.id] || ('data_resource_' + item.id), domain: domain,
      score: (94 + item.id % 5) + ' 分', pushes: 8600 + item.id * 137, calls: 12400 + item.id * 263,
      manager: item.catalog.indexOf('mine-') === 0 ? '企业数据运营中心' : '数据治理中心', source: item.type === 'api' || item.type === 'orchestration' ? '数据共享交换平台' : '主题数据仓库',
      phone: '0755-8898' + String(8900 + item.id), format: item.type === 'api' || item.type === 'orchestration' ? 'API接口' : item.type === 'dataset' ? 'XLSX / CSV' : '数据库表',
      development: item.type === 'db' ? '授权开放' : item.type === 'dataset' ? '文件下载' : '接口调用'
    };
  }

  function detailMetaHtml(item) {
    var info = getDetailInfo(item);
    var rows = [
      ['数据编码', info.code, '数据名称', item.title, '英文名称', info.englishName],
      ['数据简介', item.description, '版本', item.version, '数据分类', item.category],
      ['数据领域', info.domain, '上架时间', item.releasedAt, '更新时间', item.updatedAt],
      ['质量评分', info.score, '浏览量', item.views + ' 次', '申请量', item.applies + ' 次'],
      ['推送量', info.pushes.toLocaleString() + ' 次', '调用量', info.calls.toLocaleString() + ' 次', '更新频率', item.frequency],
      ['数据格式', info.format, '管理单位', info.manager, '数据来源', info.source],
      ['开发方式', info.development, '联系电话', info.phone, '数据量', (11253 + item.id * 381).toLocaleString() + ' 条']
    ];
    return '<div class="dm-detail-meta-table">' + rows.map(function (row, rowIndex) {
      return '<div class="dm-detail-meta-row ' + (rowIndex === 1 ? 'summary-row' : '') + '">' +
        '<span class="label">' + row[0] + '</span><span class="value">' + escapeHtml(row[1]) + '</span>' +
        '<span class="label">' + row[2] + '</span><span class="value">' + escapeHtml(row[3]) + '</span>' +
        '<span class="label">' + row[4] + '</span><span class="value">' + escapeHtml(row[5]) + '</span></div>';
    }).join('') + '</div>';
  }

  function previewTableHtml(profile) {
    return '<div class="dm-data-table-scroll"><table class="dm-detail-table preview"><thead><tr>' + profile.fields.map(function (field) { return '<th>' + field[0] + '</th>'; }).join('') + '</tr></thead><tbody>' +
      profile.rows.map(function (row) { return '<tr>' + row.map(function (value) { return '<td>' + escapeHtml(value) + '</td>'; }).join('') + '</tr>'; }).join('') +
      '</tbody></table></div><div class="dm-preview-note">预览 ' + profile.rows.length + ' 条记录</div>';
  }

  function fieldTableHtml(profile, fullColumns, selectable) {
    var fields = profile.fields;
    if (fullColumns) {
      return '<div class="dm-data-table-scroll"><table class="dm-detail-table fields"><thead><tr>' + (selectable ? '<th class="check"><input type="checkbox" checked data-field-all aria-label="全选数据项"></th>' : '') +
        '<th>英文名称</th><th>别名</th><th>是否主键</th><th>数据类型</th><th>长度</th><th>精度</th><th>描述</th></tr></thead><tbody>' + fields.map(function (field, index) {
        return '<tr>' + (selectable ? '<td class="check"><input type="checkbox" checked data-field-check="' + index + '" aria-label="选择' + escapeHtml(field[1]) + '"></td>' : '') + field.map(function (value) { return '<td>' + (value || '否') + '</td>'; }).join('') + '</tr>';
      }).join('') + '</tbody></table></div>';
    }
    return '<div class="dm-data-table-scroll"><table class="dm-detail-table fields compact"><thead><tr><th>参数名</th><th>数据类型</th><th>描述</th></tr></thead><tbody>' + fields.map(function (field) {
      return '<tr><td>' + field[0] + '</td><td>' + field[3] + '</td><td>' + field[6] + '</td></tr>';
    }).join('') + '</tbody></table></div>';
  }

  function apiDocumentHtml(item) {
    var info = getDetailInfo(item);
    var responseFields = item.id === 1 ? [['code', 'number', '响应状态码'], ['msg', 'string', '响应信息'], ['area_code', 'string', '行政区划代码'], ['area_name', 'string', '行政区划名称'], ['parent_code', 'string', '上级行政区划代码']] :
      item.id === 2 ? [['code', 'number', '响应状态码'], ['msg', 'string', '响应信息'], ['entity_name', 'string', '市场主体名称'], ['registration_status', 'string', '登记状态']] :
      [['code', 'number', '响应状态码'], ['msg', 'string', '响应信息'], ['data', 'object', '查询结果数据']];
    var sample = item.id === 1 ? { code: 200, msg: '成功', data: { area_code: '440305', area_name: '南山区', parent_code: '440300' } } :
      item.id === 2 ? { code: 200, msg: '核验通过', data: { entity_name: '深圳启航数字科技有限公司', registration_status: '存续' } } : { code: 200, msg: '成功', data: { result: item.title, updated_at: item.updatedAt } };
    return '<div class="dm-api-document"><h3><i class="bi bi-info-circle"></i>基本信息</h3><table class="dm-api-info"><tbody>' +
      '<tr><th>接口类型</th><td>REST</td><th>请求方式</th><td>GET</td><th>传输协议</th><td>HTTPS</td></tr><tr><th>数据格式</th><td>JSON</td><th>请求地址</th><td colspan="3">https://api.datamap.local/share-api/' + item.id + '/' + info.englishName + '</td></tr><tr><th>接口描述</th><td colspan="5">' + escapeHtml(item.description) + '</td></tr></tbody></table>' +
      '<h3><i class="bi bi-list-check"></i>请求Head参数</h3><table class="dm-detail-table"><thead><tr><th>参数名</th><th>必填</th><th>数据类型</th><th>默认值</th><th>参数说明</th></tr></thead><tbody><tr><td>access_token</td><td>是</td><td>string</td><td>平台授权令牌</td><td>调用方访问凭证</td></tr><tr><td>request_id</td><td>否</td><td>string</td><td>自动生成</td><td>请求链路唯一标识</td></tr></tbody></table>' +
      '<h3><i class="bi bi-braces"></i>响应参数说明</h3><table class="dm-detail-table"><thead><tr><th>参数名</th><th>数据类型</th><th>参数说明</th></tr></thead><tbody>' + responseFields.map(function (field) { return '<tr><td>' + field[0] + '</td><td>' + field[1] + '</td><td>' + field[2] + '</td></tr>'; }).join('') + '</tbody></table>' +
      '<h3><i class="bi bi-code-square"></i>返回参数示例（Json示例数据）</h3><pre class="dm-json-code">' + escapeHtml(JSON.stringify(sample, null, 2)) + '</pre></div>';
  }

  function apiErrorCodesHtml() {
    var codes = [
      ['1', '成功'], ['-1', '未知异常'], ['40001', '数据重复'], ['40002', '没找到数据'], ['40003', '参数错误'], ['40004', '连接超时'],
      ['40005', '当前用户没有表的权限'], ['44001', '未认证'], ['44002', '认证已过期'], ['50001', '应用不存在'], ['50002', '应用禁止登录'],
      ['50003', '未配置加密算法，不能生成解密密钥'], ['60001', 'API不存在'], ['61001', '当前状态不能执行部署'], ['61002', '操作不能执行'],
      ['61003', 'API编排不完整'], ['62001', 'API未发布'], ['62002', '您未申请此API或者申请已过期'], ['62003', '已超过API使用时间期限'],
      ['62004', '已超过API使用次数'], ['62005', '调用过于频繁'], ['62006', 'IP不匹配'], ['62007', '当前状态不允许变更申请'],
      ['62008', '解密密钥已失效'], ['62009', '加密出错'], ['62010', '此接口加密，应用未申请解密密钥']
    ];
    return '<div class="dm-data-table-scroll"><table class="dm-detail-table dm-error-code-table"><thead><tr><th>错误码</th><th>说明</th></tr></thead><tbody>' + codes.map(function (row) {
      return '<tr><td>' + row[0] + '</td><td>' + row[1] + '</td></tr>';
    }).join('') + '</tbody></table></div>';
  }

  function apiExampleCodeHtml(item) {
    var info = getDetailInfo(item);
    var code = [
      'import com.alibaba.fastjson2.JSONObject;',
      'import org.apache.hc.client5.http.classic.methods.HttpGet;',
      'import org.apache.hc.client5.http.impl.classic.CloseableHttpClient;',
      'import org.apache.hc.client5.http.impl.classic.CloseableHttpResponse;',
      'import org.apache.hc.client5.http.impl.classic.HttpClients;',
      'import org.apache.hc.core5.http.io.entity.EntityUtils;',
      '',
      'import java.nio.charset.StandardCharsets;',
      '',
      'public class DataMapApiExample {',
      '    private static final String API_URL =',
      '        "https://api.datamap.local/share-api/' + item.id + '/' + info.englishName + '";',
      '    private static final String ACCESS_TOKEN = "替换为平台授权令牌";',
      '',
      '    public static void main(String[] args) throws Exception {',
      '        String requestUrl = API_URL + "?limit=10";',
      '        String result = callApiWithToken(requestUrl);',
      '        System.out.println(result);',
      '    }',
      '',
      '    private static String callApiWithToken(String requestUrl) throws Exception {',
      '        try (CloseableHttpClient httpClient = HttpClients.createDefault()) {',
      '            HttpGet request = new HttpGet(requestUrl);',
      '            request.setHeader("access_token", ACCESS_TOKEN);',
      '            request.setHeader("request_id", "customer-analysis-20260924");',
      '',
      '            try (CloseableHttpResponse response = httpClient.execute(request)) {',
      '                String body = EntityUtils.toString(',
      '                    response.getEntity(), StandardCharsets.UTF_8);',
      '                JSONObject result = JSONObject.parseObject(body);',
      '                if (result.getIntValue("code") != 1',
      '                    && result.getIntValue("code") != 200) {',
      '                    throw new ApiException(',
      '                        "API调用失败，错误码：" + result.getIntValue("code")',
      '                        + "，错误信息：" + result.getString("msg"));',
      '                }',
      '                return result.toJSONString();',
      '            }',
      '        }',
      '    }',
      '',
      '    public static class ApiException extends RuntimeException {',
      '        public ApiException(String message) {',
      '            super(message);',
      '        }',
      '    }',
      '}'
    ];
    return '<ol class="dm-api-example-code" aria-label="Java调用示例">' + code.map(function (line) {
      return '<li><code>' + (line ? escapeHtml(line) : '&nbsp;') + '</code></li>';
    }).join('') + '</ol>';
  }

  function myDataStatus(item) {
    if (item.type === 'api') {
      return item.profile === 'road' ? { limit: '使用期限', period: '2026-06-18 至 2027-06-17', frequency: '60 次/分钟', ip: '10.20.24.*', reason: '用于城市道路运行态势监测和拥堵趋势分析。' } :
        item.profile === 'market' ? { limit: '使用期限+使用次数', period: '2026-06-09 至 2027-06-08', frequency: '30 次/分钟', times: '50,000 次', ip: '10.20.12.*', reason: '用于采购供应商准入及年度资质复核。' } :
          { limit: '使用期限+使用次数', period: '2026-07-08 至 2027-07-07', frequency: '120 次/分钟', times: '100,000 次', ip: '10.20.16.*', reason: '用于客户分层运营分析及服务策略优化。' };
    }
    if (item.type === 'dataset') {
      return item.profile === 'road' ? { period: '2026-06-05 至 2027-06-04', application: '城市运行监测应用', ip: '10.20.24.*', reason: '用于道路运行周报和拥堵热点分析。' } :
        item.profile === 'service' ? { period: '2026-06-20 至 2027-06-19', application: '客户服务运营分析应用', ip: '10.20.16.*', reason: '用于客户诉求处置时效和满意度分析。' } :
          { period: '2026-07-02 至 2027-07-01', application: '供应链运营分析应用', ip: '10.20.18.*', reason: '用于运输异常识别和承运商履约评价。' };
    }
    return item.profile === 'market' ? { period: '2026-06-12 至 2027-06-11', reason: '用于企业风险画像、登记变更核验和趋势分析。' } :
      { period: '2026-06-26 至 2027-06-25', reason: '用于仓储周转效率、库存变动和异常流水分析。' };
  }

  function statusRowHtml(label, value, className, required) {
    return '<div class="dm-status-row ' + (className || '') + '"><span>' + (required === false ? '' : '<em>*</em>') + label + '</span><div class="dm-status-control">' + escapeHtml(value) + '</div></div>';
  }

  function statusPermissionHtml(item) {
    var profile = getFieldProfile(item);
    return '<section class="dm-status-permission"><h3>数据项权限：<span>（' + profile.fields.length + '/' + profile.fields.length + '）</span></h3><div class="dm-data-table-scroll"><table class="dm-detail-table fields"><thead><tr><th class="check"><input type="checkbox" checked disabled aria-label="已授权全部数据项"></th><th>英文名称</th><th>别名</th><th>是否主键</th><th>数据类型</th><th>长度</th><th>精度</th><th>描述</th></tr></thead><tbody>' + profile.fields.map(function (field) {
      return '<tr><td class="check"><input type="checkbox" checked disabled aria-label="已授权' + escapeHtml(field[1]) + '"></td>' + field.map(function (value) { return '<td>' + escapeHtml(value || '否') + '</td>'; }).join('') + '</tr>';
    }).join('') + '</tbody></table></div></section>';
  }

  function statusInfoHtml(item) {
    var status = myDataStatus(item);
    var rows = statusRowHtml('使用期限', status.period, 'wide');
    if (item.type === 'api') {
      rows = statusRowHtml('使用限制', status.limit) + rows + statusRowHtml('调用频率', status.frequency) + (status.times ? statusRowHtml('使用次数', status.times) : '') + statusRowHtml('申请IP', status.ip, 'wide', false) + statusRowHtml('申请理由', status.reason, 'wide textarea');
    } else if (item.type === 'dataset') {
      rows += statusRowHtml('使用应用', status.application) + statusRowHtml('申请IP', status.ip, '', false) + statusRowHtml('申请理由', status.reason, 'wide textarea');
    } else {
      rows += statusRowHtml('申请理由', status.reason, 'wide textarea');
    }
    return '<div class="dm-status-info"><div class="dm-status-form">' + rows + '</div>' + (item.type === 'db' ? statusPermissionHtml(item) : '') + '<button type="button" class="dm-dir-btn primary dm-status-change" data-change-id="' + item.id + '"><i class="bi bi-arrow-repeat"></i>变更申请</button></div>';
  }

  function detailTabsHtml(item) {
    var isApi = item.type === 'api' || item.type === 'orchestration';
    var owned = state.detailOrigin === 'my-data';
    var tabs = isApi ? [['api-doc', 'API文档']] : item.type === 'dataset' ? [['fields', '数据项'], ['preview', '数据预览'], ['download', '文件下载']] : [['preview', '数据预览'], ['fields', '数据项']];
    if (owned && isApi) tabs = tabs.concat([['error-codes', '错误码参照'], ['example-code', '示例代码']]);
    if (owned) tabs.push(['status', '状态信息']);
    return '<div class="dm-detail-tabs">' + tabs.map(function (tab) { return '<button type="button" class="' + (state.detailTab === tab[0] ? 'active' : '') + '" data-detail-tab="' + tab[0] + '">' + tab[1] + '</button>'; }).join('') + '</div>';
  }

  function detailContentHtml(item) {
    var profile = getFieldProfile(item);
    var owned = state.detailOrigin === 'my-data';
    if (owned && state.detailTab === 'status') return statusInfoHtml(item);
    if (owned && state.detailTab === 'error-codes' && (item.type === 'api' || item.type === 'orchestration')) return apiErrorCodesHtml();
    if (owned && state.detailTab === 'example-code' && (item.type === 'api' || item.type === 'orchestration')) return apiExampleCodeHtml(item);
    if (item.type === 'api' || item.type === 'orchestration') return apiDocumentHtml(item);
    if (state.detailTab === 'preview') return previewTableHtml(profile);
    if (state.detailTab === 'download') {
      return '<table class="dm-detail-table dm-download-table"><thead><tr><th>序号</th><th>文件名称</th><th>文件格式</th><th>更新时间</th><th>操作</th></tr></thead><tbody><tr><td>1</td><td>' + escapeHtml(item.title) + '.XLSX</td><td>XLSX</td><td>' + item.updatedAt + '</td><td><button type="button" class="dm-table-action" data-download-file="' + item.id + '"><i class="bi bi-download"></i>下载</button></td></tr></tbody></table>';
    }
    return fieldTableHtml(profile, item.type === 'db', false);
  }

  function detailViewHtml() {
    var item = findResource(state.detailResourceId);
    if (!item) return directoryViewHtml();
    var meta = TYPE_META[item.type];
    var owned = state.detailOrigin === 'my-data';
    var breadcrumbItems = owned ? [['个人中心', 'my-data'], ['我的数据', 'my-data']] : state.detailOrigin === 'favorites' ? [['个人中心', 'my-data'], ['我的收藏', 'favorites']] : [['数据地图', 'directory']];
    return '<div class="dm-detail-page">' + breadcrumbHtml(breadcrumbItems, item.title) +
      '<main class="dm-detail-main"><section class="dm-detail-heading"><div><i class="bi bi-list-ul"></i><h2>' + escapeHtml(item.title) + '</h2><span class="dm-type-tag ' + meta.className + '">' + meta.label + '</span></div><div class="dm-detail-actions">' +
        (!owned && !item.applied ? '<button type="button" class="dm-dir-btn primary" data-apply-id="' + item.id + '"><i class="bi bi-send"></i>申请</button>' : '') +
        '<button type="button" class="dm-dir-btn" data-favorite-id="' + item.id + '"><i class="bi ' + (item.favorite ? 'bi-star-fill' : 'bi-star') + '"></i>' + (item.favorite ? '取消收藏' : '加入收藏') + '</button>' +
        '<button type="button" class="dm-dir-btn" data-detail-back><i class="bi bi-arrow-left"></i>返回</button></div></section>' +
      '<section class="dm-detail-meta">' + detailMetaHtml(item) + '</section><section class="dm-detail-data">' + detailTabsHtml(item) + '<div class="dm-detail-tab-panel">' + detailContentHtml(item) + '</div></section></main></div>';
  }

  function apiTestViewHtml() {
    var item = findResource(state.testResourceId);
    if (!item) return myDataViewHtml();
    var info = getDetailInfo(item);
    var profile = getFieldProfile(item);
    var params = profile.fields.slice(0, 3);
    return '<div class="dm-api-test-page">' + breadcrumbHtml([['个人中心', 'my-data'], ['我的数据', 'my-data']], '接口测试') +
      '<main class="dm-api-test-main"><section class="dm-api-test-heading"><h2><i class="bi bi-list-ul"></i>接口测试</h2><button type="button" class="dm-dir-btn" data-test-back><i class="bi bi-arrow-left"></i>返回</button></section>' +
      '<section class="dm-api-test-info"><div><span>数据名称：</span><strong>' + escapeHtml(item.title) + '</strong></div><div><span>传输协议：</span><strong>HTTPS</strong></div><div><span>请求方式：</span><strong>POST</strong></div><div><span>数据格式：</span><strong>JSON</strong></div><div><span>接口类型：</span><strong>REST</strong></div><label><span><em>*</em>app_ID：</span><select><option selected>数据治理运营分析</option><option>城市运行监测</option><option>企业综合服务</option></select></label><div class="dm-api-key"><span>app_Key：</span><strong>********************************</strong><i class="bi bi-eye-slash" aria-label="密钥已隐藏"></i></div><div class="dm-api-address"><span>请求地址：</span><strong>https://api.datamap.local/share-api/' + item.id + '/' + info.englishName + '</strong></div></section>' +
      '<section class="dm-api-test-block"><h3>请求参数</h3><div class="dm-api-test-tabs"><span>Query参数</span></div><div class="dm-data-table-scroll"><table class="dm-detail-table dm-api-test-table"><thead><tr><th>参数名</th><th>必填</th><th>数据类型</th><th>默认值</th><th>参数说明</th></tr></thead><tbody>' + params.map(function (field, index) { return '<tr><td><input value="' + field[0] + '" disabled></td><td><select disabled><option>' + (index === 0 ? '是' : '否') + '</option></select></td><td><select disabled><option>' + field[3].toLowerCase() + '</option></select></td><td><input value="' + (index === 0 ? '10' : index === 1 ? '2026-09-23' : '全部') + '"></td><td><input value="' + escapeHtml(field[6]) + '" disabled></td></tr>'; }).join('') + '</tbody></table></div><button type="button" class="dm-dir-btn primary dm-send-request" data-send-request="' + item.id + '"><i class="bi bi-send"></i>发送请求</button></section>' +
      '<section class="dm-api-test-block dm-response-block"><h3>返回数据</h3><pre class="dm-api-response" data-api-response>{\n  "提示": "请配置请求参数后发送请求",\n  "接口": "' + escapeHtml(info.englishName) + '"\n}</pre></section></main></div>';
  }

  function findAuditItem(id) {
    return AUDIT_ITEMS.find(function (item) { return item.id === Number(id); });
  }

  function auditStatusLabel(status) {
    return status === 'approved' ? '审核通过' : status === 'rejected' ? '审核驳回' : '审核中';
  }

  function getFilteredAuditItems() {
    var keyword = state.auditKeyword.toLowerCase();
    return AUDIT_ITEMS.filter(function (item) {
      var inTab = state.auditTab === 'pending' ? item.status === 'pending' && item.applicant !== '演示' :
        state.auditTab === 'processed' ? item.status !== 'pending' && item.applicant !== '演示' : item.applicant === '演示';
      var text = [item.title, item.objectName, item.description, item.reason, item.applicant].join(' ').toLowerCase();
      return inTab && (state.auditType === 'all' || item.type === state.auditType) &&
        (state.auditStatus === 'all' || item.status === state.auditStatus) && (!keyword || text.indexOf(keyword) > -1);
    }).sort(function (a, b) { return b.appliedAt.localeCompare(a.appliedAt); });
  }

  function auditFilterHtml() {
    var status = state.auditTab === 'pending' ? '' : '<label class="dm-audit-filter"><span>流程状态</span><select data-audit-status><option value="all">请选择</option>' +
      (state.auditTab === 'initiated' ? '<option value="pending" ' + (state.auditStatus === 'pending' ? 'selected' : '') + '>审核中</option>' : '') +
      '<option value="rejected" ' + (state.auditStatus === 'rejected' ? 'selected' : '') + '>审核驳回</option><option value="approved" ' + (state.auditStatus === 'approved' ? 'selected' : '') + '>审核通过</option></select></label>';
    return '<div class="dm-audit-filters">' + status + '<label class="dm-audit-filter"><span>申请类型</span><select data-audit-type><option value="all">请选择</option><option value="data" ' + (state.auditType === 'data' ? 'selected' : '') + '>数据申请</option><option value="app" ' + (state.auditType === 'app' ? 'selected' : '') + '>应用申请</option><option value="db" ' + (state.auditType === 'db' ? 'selected' : '') + '>库表申请</option></select></label>' +
      '<div class="dm-audit-keyword"><input type="text" value="' + escapeHtml(state.auditDraftKeyword) + '" placeholder="标题关键字搜索" aria-label="标题关键字搜索"><button type="button" class="dm-dir-btn primary" data-audit-search><i class="bi bi-search"></i>查询</button></div></div>';
  }

  function auditObjectHtml(item) {
    if (!item.resourceId) return '<span class="dm-audit-object-text">' + escapeHtml(item.objectName) + '</span>';
    return '<a class="dm-audit-object-link" href="#page=datamap-home&amp;dmView=detail&amp;dmResource=' + item.resourceId + '" target="_blank" rel="noopener">' + escapeHtml(item.objectName) + '</a>';
  }

  function auditTableHtml() {
    var list = getFilteredAuditItems();
    var total = list.length;
    var pages = Math.max(1, Math.ceil(total / state.auditPageSize));
    if (state.auditPage > pages) state.auditPage = pages;
    var start = (state.auditPage - 1) * state.auditPageSize;
    var pageItems = list.slice(start, start + state.auditPageSize);
    var allChecked = pageItems.length > 0 && pageItems.every(function (item) { return !!state.auditSelected[item.id]; });
    var pageButtons = '';
    for (var i = 1; i <= pages; i += 1) pageButtons += '<button type="button" class="dm-page-num ' + (state.auditPage === i ? 'active' : '') + '" data-audit-page="' + i + '">' + i + '</button>';
    var rows = pageItems.map(function (item) {
      var processButton = state.auditTab === 'pending' ? '<button type="button" class="dm-table-action" data-audit-row-process="' + item.id + '"><i class="bi bi-check2-square"></i>处理</button>' : '';
      return '<tr><td class="check"><input type="checkbox" data-audit-check="' + item.id + '" ' + (state.auditSelected[item.id] ? 'checked' : '') + ' aria-label="选择' + escapeHtml(item.title) + '"></td>' +
        '<td class="title">' + escapeHtml(item.title) + '</td><td class="summary"><p>申请对象：' + auditObjectHtml(item) + '</p><p>对象简介：' + escapeHtml(item.description) + '</p><p>申请理由：' + escapeHtml(item.reason) + '</p></td>' +
        '<td>' + escapeHtml(item.type === 'app' ? '应用' : item.resourceType) + '</td><td>' + escapeHtml(item.applicant) + '</td><td>' + item.appliedAt + '</td><td>' + (item.completedAt || '—') + '</td><td><span class="dm-audit-status ' + item.status + '">' + auditStatusLabel(item.status) + '</span></td>' +
        '<td><div class="dm-audit-row-actions">' + processButton + '<button type="button" class="dm-table-action" data-audit-record-id="' + item.id + '"><i class="bi bi-file-earmark-text"></i>审核记录</button></div></td></tr>';
    }).join('');
    return '<div class="dm-audit-table-wrap"><table class="dm-audit-table"><thead><tr><th class="check"><input type="checkbox" data-audit-check-all ' + (allChecked ? 'checked' : '') + ' aria-label="全选当前页"></th><th>标题</th><th>申请内容摘要</th><th>类型</th><th>申请人</th><th>申请时间</th><th>完成时间</th><th>流程状态</th><th>操作</th></tr></thead><tbody>' +
      (rows || '<tr><td colspan="9"><div class="dm-result-empty"><i class="bi bi-inbox"></i><strong>暂无匹配的审核任务</strong><span>请调整筛选条件或标题关键字</span></div></td></tr>') + '</tbody></table></div>' +
      '<div class="dm-directory-pagination"><span>共 ' + total + ' 条</span><div class="dm-page-buttons"><button type="button" class="dm-page-arrow" data-audit-page="' + (state.auditPage - 1) + '" ' + (state.auditPage === 1 ? 'disabled' : '') + '><i class="bi bi-chevron-left"></i></button>' + pageButtons + '<button type="button" class="dm-page-arrow" data-audit-page="' + (state.auditPage + 1) + '" ' + (state.auditPage === pages ? 'disabled' : '') + '><i class="bi bi-chevron-right"></i></button><select class="dm-page-size" data-audit-page-size aria-label="审核列表每页条数"><option value="10" ' + (state.auditPageSize === 10 ? 'selected' : '') + '>10 条/页</option><option value="20" ' + (state.auditPageSize === 20 ? 'selected' : '') + '>20 条/页</option></select><label class="dm-page-jump">跳至<input type="number" min="1" max="' + pages + '" data-audit-page-jump>页</label></div></div>';
  }

  function auditCenterViewHtml() {
    var tabs = [['pending', '待处理'], ['processed', '已处理'], ['initiated', '已发起']];
    return '<div class="dm-audit-page">' + breadcrumbHtml([['个人中心', 'my-data']], '审核中心') + '<main class="dm-audit-main">' +
      '<div class="dm-audit-tabs">' + tabs.map(function (tab) { return '<button type="button" class="' + (state.auditTab === tab[0] ? 'active' : '') + '" data-audit-tab="' + tab[0] + '">' + tab[1] + '</button>'; }).join('') + '</div>' +
      '<section class="dm-audit-toolbar"><div>' + (state.auditTab === 'pending' ? '<button type="button" class="dm-dir-btn primary dm-audit-process-btn" data-audit-process><i class="bi bi-check2-square"></i>批量处理</button>' : '') + '</div>' + auditFilterHtml() + '</section>' + auditTableHtml() + '</main></div>';
  }

  function appStatusInfo(status) {
    var map = {
      draft: ['草稿', 'draft'], offline: ['下架', 'offline'], rejected: ['审核驳回', 'rejected'],
      pending: ['待审核', 'pending'], approved: ['审核通过', 'approved'], reviewing: ['审核中', 'reviewing']
    };
    return map[status] || ['草稿', 'draft'];
  }

  function getFilteredApplications() {
    var keyword = state.appKeyword.toLowerCase();
    return MY_APPLICATIONS.filter(function (item) {
      var text = [item.name, item.appId, item.description, appStatusInfo(item.status)[0]].join(' ').toLowerCase();
      return (state.appStatus === 'all' || item.status === state.appStatus) && (!keyword || text.indexOf(keyword) > -1);
    }).sort(function (a, b) { return b.updatedAt.localeCompare(a.updatedAt); });
  }

  function applicationCredentialHtml(item) {
    if (item.status !== 'approved') {
      var note = item.status === 'offline' ? '凭证已失效' : item.status === 'rejected' ? '审核未通过' : '审核通过后生成';
      return '<span class="dm-app-credential-note">' + note + '</span>';
    }
    var visible = !!state.appKeyVisible[item.id];
    return '<div class="dm-app-key"><code>' + (visible ? escapeHtml(item.appKey) : '****************') + '</code>' +
      '<button type="button" class="dm-icon-action" data-app-key-toggle="' + item.id + '" title="' + (visible ? '隐藏密钥' : '显示密钥') + '"><i class="bi ' + (visible ? 'bi-eye-slash' : 'bi-eye') + '"></i></button>' +
      '<button type="button" class="dm-icon-action" data-app-copy="' + item.id + '" title="复制"><i class="bi bi-copy"></i></button>' +
      '<button type="button" class="dm-link-action" data-app-change-key="' + item.id + '">更换</button></div>';
  }

  function applicationsTableHtml() {
    var list = getFilteredApplications();
    var total = list.length;
    var pages = Math.max(1, Math.ceil(total / state.appPageSize));
    if (state.appPage > pages) state.appPage = pages;
    var start = (state.appPage - 1) * state.appPageSize;
    var pageItems = list.slice(start, start + state.appPageSize);
    var pageButtons = '';
    for (var i = 1; i <= pages; i += 1) pageButtons += '<button type="button" class="dm-page-num ' + (state.appPage === i ? 'active' : '') + '" data-app-page="' + i + '">' + i + '</button>';
    var rows = pageItems.map(function (item) {
      var status = appStatusInfo(item.status);
      var decrypt = item.status === 'approved' ? (item.decryptEnabled ? '****************' : '未启用') : item.status === 'offline' ? '已失效' : '待生成';
      return '<tr><td class="name">' + escapeHtml(item.name) + '</td><td><span class="dm-app-status ' + status[1] + '">' + status[0] + '</span></td><td><code>' + escapeHtml(item.appId) + '</code></td><td>' + applicationCredentialHtml(item) + '</td><td><code class="dm-app-decrypt">' + decrypt + '</code></td><td class="description">' + escapeHtml(item.description) + '</td><td>' + item.updatedAt + '</td><td>' + (item.status === 'approved' ? '<button type="button" class="dm-table-action" data-app-offline="' + item.id + '"><i class="bi bi-box-arrow-down"></i>下架</button>' : '<span class="dm-table-placeholder">—</span>') + '</td></tr>';
    }).join('');
    return '<div class="dm-personal-table-wrap"><table class="dm-personal-table dm-app-table"><thead><tr><th>名称</th><th>状态</th><th>app_ID</th><th>app_Key</th><th>解密密钥</th><th>简介</th><th>修改时间</th><th>操作</th></tr></thead><tbody>' +
      (rows || '<tr><td colspan="8"><div class="dm-result-empty"><i class="bi bi-inbox"></i><strong>暂无匹配的应用</strong><span>请调整状态或搜索关键字</span></div></td></tr>') + '</tbody></table></div>' +
      '<div class="dm-directory-pagination"><span>共 ' + total + ' 条</span><div class="dm-page-buttons"><button type="button" class="dm-page-arrow" data-app-page="' + (state.appPage - 1) + '" ' + (state.appPage === 1 ? 'disabled' : '') + '><i class="bi bi-chevron-left"></i></button>' + pageButtons + '<button type="button" class="dm-page-arrow" data-app-page="' + (state.appPage + 1) + '" ' + (state.appPage === pages ? 'disabled' : '') + '><i class="bi bi-chevron-right"></i></button><select class="dm-page-size" data-app-page-size aria-label="应用列表每页条数"><option value="10" ' + (state.appPageSize === 10 ? 'selected' : '') + '>10 条/页</option><option value="20" ' + (state.appPageSize === 20 ? 'selected' : '') + '>20 条/页</option></select></div></div>';
  }

  function applicationsViewHtml() {
    var statuses = [['all', '请选择'], ['draft', '草稿'], ['offline', '下架'], ['rejected', '审核驳回'], ['pending', '待审核'], ['approved', '审核通过'], ['reviewing', '审核中']];
    return '<div class="dm-personal-page dm-applications-page">' + breadcrumbHtml([['个人中心', 'my-data']], '我的应用') + '<main class="dm-personal-main">' +
      '<section class="dm-personal-toolbar"><button type="button" class="dm-dir-btn primary" data-app-new><i class="bi bi-plus-lg"></i>新建</button><div class="dm-personal-filters"><label><span>状态</span><select data-app-status>' + statuses.map(function (option) { return '<option value="' + option[0] + '" ' + (state.appStatus === option[0] ? 'selected' : '') + '>' + option[1] + '</option>'; }).join('') + '</select></label><div class="dm-personal-search"><input type="text" value="' + escapeHtml(state.appDraftKeyword) + '" placeholder="请输入关键字查询" aria-label="应用关键字"><button type="button" class="dm-dir-btn primary" data-app-search><i class="bi bi-search"></i>查询</button></div></div></section>' + applicationsTableHtml() + '</main></div>';
  }

  function accountInfoViewHtml() {
    return '<div class="dm-personal-page dm-account-page">' + breadcrumbHtml([['个人中心', 'my-data']], '账号信息') + '<main class="dm-account-main"><form class="dm-account-form" data-account-form>' +
      '<div class="dm-account-row"><span>账号</span><strong>' + escapeHtml(ACCOUNT_INFO.account) + '</strong></div>' +
      '<label class="dm-account-row"><span><em>*</em>姓名</span><input name="name" value="' + escapeHtml(ACCOUNT_INFO.name) + '" required></label>' +
      '<label class="dm-account-row"><span><em>*</em>手机</span><input name="phone" value="' + escapeHtml(ACCOUNT_INFO.phone) + '" required></label>' +
      '<label class="dm-account-row"><span><em>*</em>邮箱</span><input name="email" type="email" value="' + escapeHtml(ACCOUNT_INFO.email) + '" required></label>' +
      '<label class="dm-account-row"><span>归属</span><input value="' + escapeHtml(ACCOUNT_INFO.department) + '" disabled></label>' +
      '<div class="dm-account-row"><span>账号状态</span><strong class="dm-account-status"><i></i>' + escapeHtml(ACCOUNT_INFO.status) + '</strong></div>' +
      '<div class="dm-account-row"><span>密码</span><button type="button" class="dm-link-action" data-account-password><i class="bi bi-key"></i>修改密码</button></div>' +
      '<div class="dm-account-actions"><button type="submit" class="dm-dir-btn primary"><i class="bi bi-check2-circle"></i>保存</button></div></form></main></div>';
  }

  function messageListHtml() {
    var list = state.messageTab === 'unread' ? PERSONAL_MESSAGES.filter(function (item) { return item.unread; }) : PERSONAL_MESSAGES.slice();
    var total = list.length;
    var pages = Math.max(1, Math.ceil(total / state.messagePageSize));
    if (state.messagePage > pages) state.messagePage = pages;
    var start = (state.messagePage - 1) * state.messagePageSize;
    var pageItems = list.slice(start, start + state.messagePageSize);
    var pageButtons = '';
    for (var i = 1; i <= pages; i += 1) pageButtons += '<button type="button" class="dm-page-num ' + (state.messagePage === i ? 'active' : '') + '" data-message-page="' + i + '">' + i + '</button>';
    return '<div class="dm-message-list">' + (pageItems.length ? pageItems.map(function (item) { return '<article class="dm-message-item ' + (item.unread ? 'unread' : '') + '"><i class="bi bi-envelope' + (item.unread ? '-fill' : '') + '"></i><p>' + escapeHtml(item.content) + '</p></article>'; }).join('') : '<div class="dm-result-empty"><i class="bi bi-envelope-open"></i><strong>暂无未读消息</strong><span>新的审核与调用通知会显示在这里</span></div>') + '</div>' +
      '<div class="dm-directory-pagination"><span>共 ' + total + ' 条</span><div class="dm-page-buttons"><button type="button" class="dm-page-arrow" data-message-page="' + (state.messagePage - 1) + '" ' + (state.messagePage === 1 ? 'disabled' : '') + '><i class="bi bi-chevron-left"></i></button>' + pageButtons + '<button type="button" class="dm-page-arrow" data-message-page="' + (state.messagePage + 1) + '" ' + (state.messagePage === pages ? 'disabled' : '') + '><i class="bi bi-chevron-right"></i></button><select class="dm-page-size" data-message-page-size aria-label="消息列表每页条数"><option value="10" ' + (state.messagePageSize === 10 ? 'selected' : '') + '>10 条/页</option><option value="20" ' + (state.messagePageSize === 20 ? 'selected' : '') + '>20 条/页</option></select><label class="dm-page-jump">跳至<input type="number" min="1" max="' + pages + '" data-message-page-jump>页</label></div></div>';
  }

  function messagesViewHtml() {
    return '<div class="dm-personal-page dm-messages-page">' + breadcrumbHtml([['个人中心', 'my-data']], '我的消息') + '<main class="dm-personal-main"><div class="dm-message-tabs"><button type="button" class="' + (state.messageTab === 'unread' ? 'active' : '') + '" data-message-tab="unread">未读消息</button><button type="button" class="' + (state.messageTab === 'history' ? 'active' : '') + '" data-message-tab="history">消息记录</button></div>' + messageListHtml() + '</main></div>';
  }

  function monitorTypeLabel(type) {
    return type === 'api' ? 'API接口' : type === 'dataset' ? '数据集' : '数据库表';
  }

  function monitorDateRangeHtml(scope, start, end) {
    if (DP.datePicker && DP.datePicker.render) {
      return DP.datePicker.render({ mode: 'range', output: 'datetime', label: '时间范围', start: start, end: end, startAttrs: { 'data-monitor-date': scope + '-start' }, endAttrs: { 'data-monitor-date': scope + '-end' } });
    }
    return '<span class="dm-date-fallback">' + start + ' 至 ' + end + '</span>';
  }

  function monitorPeriodHtml(scope, value) {
    return '<div class="dm-monitor-period"><label><input type="radio" name="' + scope + 'Period" value="1" data-monitor-period="' + scope + '" ' + (value === '1' ? 'checked' : '') + '>近1天</label><label><input type="radio" name="' + scope + 'Period" value="7" data-monitor-period="' + scope + '" ' + (value === '7' ? 'checked' : '') + '>近7天</label><label><input type="radio" name="' + scope + 'Period" value="30" data-monitor-period="' + scope + '" ' + (value === '30' ? 'checked' : '') + '>近30天</label></div>';
  }

  function setMonitorPeriodRange(scope, value) {
    var days = Number(value) || 1;
    var end = new Date(2026, 8, 24);
    var start = new Date(end.getFullYear(), end.getMonth(), end.getDate() - days);
    function format(date) {
      return date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
    }
    if (scope === 'call') {
      state.callPeriod = String(days);
      state.callStart = format(start) + ' 00:00:00';
      state.callEnd = format(end) + ' 23:59:59';
      state.callPage = 1;
    } else {
      state.monitorPeriod = String(days);
      state.monitorStart = format(start) + ' 00:00:00';
      state.monitorEnd = format(end) + ' 23:59:59';
      state.monitorPage = 1;
    }
  }

  function findMonitorItem(id) {
    return API_MONITOR_ITEMS.find(function (item) { return item.id === Number(id); });
  }

  function getFilteredMonitorItems() {
    var keyword = state.monitorKeyword.toLowerCase();
    return API_MONITOR_ITEMS.filter(function (item) {
      var text = [item.code, item.name, item.englishName].join(' ').toLowerCase();
      return catalogIncludes(item.catalog, state.catalogId) && item.type === state.monitorType &&
        (state.monitorApp === 'all' || item.app === state.monitorApp) && (state.monitorStatus === 'all' || item.status === state.monitorStatus) &&
        (!keyword || text.indexOf(keyword) > -1);
    }).sort(function (a, b) { return b.calls - a.calls; });
  }

  function monitorPaginationHtml(total, page, pageSize, pages, attrPrefix) {
    var pageButtons = '';
    for (var i = 1; i <= pages; i += 1) pageButtons += '<button type="button" class="dm-page-num ' + (page === i ? 'active' : '') + '" data-' + attrPrefix + '-page="' + i + '">' + i + '</button>';
    return '<div class="dm-directory-pagination"><span>共 ' + total + ' 条</span><div class="dm-page-buttons"><button type="button" class="dm-page-arrow" data-' + attrPrefix + '-page="' + (page - 1) + '" ' + (page === 1 ? 'disabled' : '') + '><i class="bi bi-chevron-left"></i></button>' + pageButtons + '<button type="button" class="dm-page-arrow" data-' + attrPrefix + '-page="' + (page + 1) + '" ' + (page === pages ? 'disabled' : '') + '><i class="bi bi-chevron-right"></i></button><select class="dm-page-size" data-' + attrPrefix + '-page-size aria-label="列表每页条数"><option value="10" ' + (pageSize === 10 ? 'selected' : '') + '>10 条/页</option><option value="20" ' + (pageSize === 20 ? 'selected' : '') + '>20 条/页</option></select></div></div>';
  }

  function monitorTableHtml() {
    var list = getFilteredMonitorItems();
    var total = list.length;
    var pages = Math.max(1, Math.ceil(total / state.monitorPageSize));
    if (state.monitorPage > pages) state.monitorPage = pages;
    var start = (state.monitorPage - 1) * state.monitorPageSize;
    var rows = list.slice(start, start + state.monitorPageSize).map(function (item) {
      return '<tr><td><code>' + item.code + '</code></td><td class="name">' + escapeHtml(item.name) + '</td><td><code>' + escapeHtml(item.englishName) + '</code></td><td>' + item.version + '</td><td>' + monitorTypeLabel(item.type) + '</td><td>' + escapeHtml(item.app) + '</td><td>' + item.calls.toLocaleString() + '</td><td>' + item.avgResponse + '</td><td>' + item.maxConcurrency + '</td><td class="' + (item.errors ? 'dm-monitor-errors' : '') + '">' + item.errors + '</td><td><span class="dm-monitor-status ' + item.status + '">' + (item.status === 'online' ? '已上架' : '已下架') + '</span></td><td>' + (item.type === 'api' ? '<button type="button" class="dm-table-action" data-monitor-detail="' + item.id + '"><i class="bi bi-eye"></i>查看详情</button>' : '<span class="dm-table-placeholder">—</span>') + '</td></tr>';
    }).join('');
    return '<div class="dm-personal-table-wrap"><table class="dm-personal-table dm-monitor-table"><thead><tr><th>数据编码</th><th>数据名称</th><th>英文名称</th><th>版本</th><th>数据类型</th><th>调用应用</th><th>调用次数</th><th>平均响应时间</th><th>最大并发数</th><th>异常数</th><th>状态</th><th>操作</th></tr></thead><tbody>' +
      (rows || '<tr><td colspan="12"><div class="dm-result-empty"><i class="bi bi-inbox"></i><strong>暂无匹配的监控数据</strong><span>请调整目录、时间或筛选条件</span></div></td></tr>') + '</tbody></table></div>' + monitorPaginationHtml(total, state.monitorPage, state.monitorPageSize, pages, 'monitor');
  }

  function apiMonitorViewHtml() {
    return '<div class="dm-directory-page dm-monitor-page">' + breadcrumbHtml([['运行监控', 'api-monitor']], 'API监控') + '<div class="dm-directory-layout">' +
      '<aside class="dm-catalog-panel"><h2><i class="bi bi-diagram-3"></i>数据地图</h2><label class="dm-tree-search"><input type="text" value="' + escapeHtml(state.treeKeyword) + '" placeholder="请输入" aria-label="搜索目录"><i class="bi bi-search"></i></label><div class="dm-catalog-tree">' + treeHtml() + '</div></aside>' +
      '<main class="dm-directory-main dm-monitor-main"><section class="dm-monitor-filters"><div class="dm-monitor-time">' + monitorPeriodHtml('summary', state.monitorPeriod) + monitorDateRangeHtml('summary', state.monitorStart, state.monitorEnd) + '</div><div class="dm-monitor-filter-row">' +
      '<label><span>数据类型</span><select data-monitor-type><option value="api" ' + (state.monitorType === 'api' ? 'selected' : '') + '>API接口</option><option value="dataset" ' + (state.monitorType === 'dataset' ? 'selected' : '') + '>数据集</option></select></label>' +
      '<label><span>应用</span><select data-monitor-app><option value="all">请选择</option>' + MY_APPLICATIONS.map(function (item) { return '<option value="' + escapeHtml(item.name) + '" ' + (state.monitorApp === item.name ? 'selected' : '') + '>' + escapeHtml(item.name) + '</option>'; }).join('') + '</select></label>' +
      '<label><span>状态</span><select data-monitor-status><option value="all">请选择</option><option value="online" ' + (state.monitorStatus === 'online' ? 'selected' : '') + '>已上架</option><option value="offline" ' + (state.monitorStatus === 'offline' ? 'selected' : '') + '>已下架</option></select></label>' +
      '<div class="dm-monitor-search"><input type="text" value="' + escapeHtml(state.monitorDraftKeyword) + '" placeholder="请输入数据编码/数据名称查询" aria-label="监控数据关键字"><button type="button" class="dm-dir-btn primary" data-monitor-search><i class="bi bi-search"></i>查询</button></div></div></section>' + monitorTableHtml() + '</main></div></div>';
  }

  function getFilteredCallRecords() {
    var keyword = state.callAccount.toLowerCase();
    return API_CALL_RECORDS.filter(function (item) {
      return item.monitorId === state.monitorDetailId && (state.callApp === 'all' || item.app === state.callApp) &&
        (state.callStatus === 'all' || item.status === state.callStatus) && (!state.callStart || item.calledAt >= state.callStart) &&
        (!state.callEnd || item.calledAt <= state.callEnd) && (!keyword || item.account.toLowerCase().indexOf(keyword) > -1);
    }).sort(function (a, b) { return b.calledAt.localeCompare(a.calledAt); });
  }

  function callRecordsHtml() {
    var list = getFilteredCallRecords();
    var total = list.length;
    var pages = Math.max(1, Math.ceil(total / state.callPageSize));
    if (state.callPage > pages) state.callPage = pages;
    var start = (state.callPage - 1) * state.callPageSize;
    var rows = list.slice(start, start + state.callPageSize).map(function (item) {
      return '<tr><td>' + item.calledAt + '</td><td>' + escapeHtml(item.app) + '</td><td>' + escapeHtml(item.account) + '</td><td>' + item.response + '</td><td><span class="dm-call-status ' + item.status + '">' + (item.status === 'success' ? '返回成功' : '返回失败') + '</span></td><td><button type="button" class="dm-table-action" data-call-log="' + item.id + '"><i class="bi bi-journal-text"></i>查看日志</button></td></tr>';
    }).join('');
    return '<div class="dm-personal-table-wrap"><table class="dm-personal-table dm-call-table"><thead><tr><th>调用时间</th><th>调用应用</th><th>调用用户</th><th>响应时间</th><th>调用状态</th><th>操作</th></tr></thead><tbody>' +
      (rows || '<tr><td colspan="6"><div class="dm-result-empty"><i class="bi bi-inbox"></i><strong>暂无匹配的调用记录</strong><span>请调整时间或筛选条件</span></div></td></tr>') + '</tbody></table></div>' + monitorPaginationHtml(total, state.callPage, state.callPageSize, pages, 'call');
  }

  function apiMonitorDetailViewHtml() {
    var item = findMonitorItem(state.monitorDetailId);
    if (!item) return apiMonitorViewHtml();
    return '<div class="dm-personal-page dm-monitor-detail-page">' + breadcrumbHtml([['运行监控', 'api-monitor'], ['API监控', 'api-monitor']], item.name) + '<main class="dm-monitor-detail-main">' +
      '<section class="dm-monitor-detail-heading"><h2><i class="bi bi-activity"></i>' + escapeHtml(item.name) + '</h2><button type="button" class="dm-dir-btn" data-monitor-back><i class="bi bi-arrow-left"></i>返回</button></section>' +
      '<section class="dm-monitor-summary"><div class="wide"><span>接口地址</span><strong>' + escapeHtml(item.endpoint) + '</strong></div><div><span>启用状态</span><strong class="dm-monitor-status ' + item.status + '">' + (item.status === 'online' ? '已上架' : '已下架') + '</strong></div><div><span>调用次数</span><strong>' + item.calls.toLocaleString() + '</strong></div><div><span>平均响应时间</span><strong>' + item.avgResponse + '</strong></div><div><span>最大并发数</span><strong>' + item.maxConcurrency + '</strong></div><div><span>异常数</span><strong>' + item.errors + '</strong></div><div><span>调用应用数</span><strong>' + new Set(API_CALL_RECORDS.filter(function (record) { return record.monitorId === item.id; }).map(function (record) { return record.app; })).size + '</strong></div></section>' +
      '<section class="dm-monitor-calls"><div class="dm-monitor-detail-tabs"><button type="button" class="active">调用记录</button></div><div class="dm-monitor-filters"><div class="dm-monitor-time">' + monitorPeriodHtml('call', state.callPeriod) + monitorDateRangeHtml('call', state.callStart, state.callEnd) + '</div><div class="dm-monitor-filter-row"><label><span>应用</span><select data-call-app><option value="all">请选择</option>' + MY_APPLICATIONS.map(function (app) { return '<option value="' + escapeHtml(app.name) + '" ' + (state.callApp === app.name ? 'selected' : '') + '>' + escapeHtml(app.name) + '</option>'; }).join('') + '</select></label><label><span>状态</span><select data-call-status><option value="all">请选择</option><option value="success" ' + (state.callStatus === 'success' ? 'selected' : '') + '>返回成功</option><option value="failed" ' + (state.callStatus === 'failed' ? 'selected' : '') + '>返回失败</option></select></label><div class="dm-monitor-search"><input type="text" value="' + escapeHtml(state.callDraftAccount) + '" placeholder="请输入调用账号" aria-label="调用账号"><button type="button" class="dm-dir-btn primary" data-call-search><i class="bi bi-search"></i>查询</button></div></div></div>' + callRecordsHtml() + '</section></main></div>';
  }

  function getFilteredApplicationRecords() {
    var dataKeyword = state.recordData.toLowerCase();
    var accountKeyword = state.recordAccount.toLowerCase();
    return APPLICATION_RECORDS.filter(function (item) {
      var dataText = [item.code, item.name, item.englishName].join(' ').toLowerCase();
      return catalogIncludes(item.catalog, state.catalogId) && (state.recordType === 'all' || item.type === state.recordType) &&
        (!dataKeyword || dataText.indexOf(dataKeyword) > -1) && (state.recordVersion === 'all' || item.version === state.recordVersion) &&
        (state.recordApp === 'all' || item.app === state.recordApp) && (state.recordStatus === 'all' || item.status === state.recordStatus) &&
        (!accountKeyword || item.account.toLowerCase().indexOf(accountKeyword) > -1);
    }).sort(function (a, b) { return b.appliedAt.localeCompare(a.appliedAt); });
  }

  function applicationRecordsTableHtml() {
    var list = getFilteredApplicationRecords();
    var total = list.length;
    var pages = Math.max(1, Math.ceil(total / state.recordPageSize));
    if (state.recordPage > pages) state.recordPage = pages;
    var start = (state.recordPage - 1) * state.recordPageSize;
    var rows = list.slice(start, start + state.recordPageSize).map(function (item) {
      return '<tr><td><code>' + item.code + '</code></td><td class="name">' + escapeHtml(item.name) + '</td><td><code>' + escapeHtml(item.englishName) + '</code></td><td>' + item.version + '</td><td>' + monitorTypeLabel(item.type) + '</td><td>' + escapeHtml(item.app) + '</td><td>' + escapeHtml(item.account) + '</td><td>' + item.authMode + '</td><td class="dm-record-auth">' + escapeHtml(item.authValue) + '</td><td>' + item.appliedAt + '</td><td><span class="dm-record-status ' + item.status + '">' + (item.status === 'normal' ? '正常' : '已过期') + '</span></td><td>' + (item.monitorId ? '<button type="button" class="dm-table-action" data-record-detail="' + item.monitorId + '"><i class="bi bi-eye"></i>查看详情</button>' : '<span class="dm-table-placeholder">—</span>') + '</td></tr>';
    }).join('');
    return '<div class="dm-personal-table-wrap"><table class="dm-personal-table dm-record-table"><thead><tr><th>数据编码</th><th>数据名称</th><th>英文名称</th><th>版本</th><th>数据类型</th><th>申请应用</th><th>申请账号</th><th>授权模式</th><th>授权期限/次数</th><th>申请时间</th><th>状态</th><th>操作</th></tr></thead><tbody>' +
      (rows || '<tr><td colspan="12"><div class="dm-result-empty"><i class="bi bi-inbox"></i><strong>暂无匹配的申请记录</strong><span>请调整目录或筛选条件</span></div></td></tr>') + '</tbody></table></div>' + monitorPaginationHtml(total, state.recordPage, state.recordPageSize, pages, 'record');
  }

  function applicationRecordsViewHtml() {
    return '<div class="dm-directory-page dm-monitor-page">' + breadcrumbHtml([['运行监控', 'api-monitor']], '申请记录') + '<div class="dm-directory-layout">' +
      '<aside class="dm-catalog-panel"><h2><i class="bi bi-diagram-3"></i>数据地图</h2><label class="dm-tree-search"><input type="text" value="' + escapeHtml(state.treeKeyword) + '" placeholder="请输入" aria-label="搜索目录"><i class="bi bi-search"></i></label><div class="dm-catalog-tree">' + treeHtml() + '</div></aside>' +
      '<main class="dm-directory-main dm-monitor-main"><section class="dm-record-filters"><div class="dm-record-filter-grid">' +
      '<label><span>数据类型</span><select data-record-type><option value="all">请选择</option><option value="api" ' + (state.recordType === 'api' ? 'selected' : '') + '>API接口</option><option value="dataset" ' + (state.recordType === 'dataset' ? 'selected' : '') + '>数据集</option><option value="db" ' + (state.recordType === 'db' ? 'selected' : '') + '>数据库表</option></select></label>' +
      '<label class="wide"><span>数据</span><input type="text" value="' + escapeHtml(state.recordDraftData) + '" placeholder="数据编码/名称/英文名称" aria-label="申请数据关键字"></label>' +
      '<label><span>版本</span><select data-record-version><option value="all">请选择</option><option value="V1.0" ' + (state.recordVersion === 'V1.0' ? 'selected' : '') + '>V1.0</option><option value="V1.2" ' + (state.recordVersion === 'V1.2' ? 'selected' : '') + '>V1.2</option><option value="V1.3" ' + (state.recordVersion === 'V1.3' ? 'selected' : '') + '>V1.3</option><option value="V1.5" ' + (state.recordVersion === 'V1.5' ? 'selected' : '') + '>V1.5</option><option value="V1.6" ' + (state.recordVersion === 'V1.6' ? 'selected' : '') + '>V1.6</option><option value="V2.0" ' + (state.recordVersion === 'V2.0' ? 'selected' : '') + '>V2.0</option></select></label>' +
      '<label><span>应用</span><select data-record-app><option value="all">请选择</option>' + MY_APPLICATIONS.map(function (item) { return '<option value="' + escapeHtml(item.name) + '" ' + (state.recordApp === item.name ? 'selected' : '') + '>' + escapeHtml(item.name) + '</option>'; }).join('') + '</select></label>' +
      '<label><span>状态</span><select data-record-status><option value="all">请选择</option><option value="normal" ' + (state.recordStatus === 'normal' ? 'selected' : '') + '>正常</option><option value="expired" ' + (state.recordStatus === 'expired' ? 'selected' : '') + '>已过期</option></select></label>' +
      '<div class="dm-monitor-search wide"><input type="text" value="' + escapeHtml(state.recordDraftAccount) + '" placeholder="请输入申请账号查询" aria-label="申请账号"><button type="button" class="dm-dir-btn primary" data-record-search><i class="bi bi-search"></i>查询</button></div></div></section>' + applicationRecordsTableHtml() + '</main></div></div>';
  }

  function managementTypeLabel(item) {
    return item.type === 'orchestration' ? 'API编排' : monitorTypeLabel(item.type);
  }

  function managementPublishLabel(status) {
    return status === 'online' ? '已上架' : status === 'pending' ? '待上架' : '编制';
  }

  function managementAuditLabel(status) {
    var labels = { pending: '待上架', 'up-pending': '上架待审核', 'up-approved': '上架通过', 'up-rejected': '上架驳回', 'down-pending': '下架待审核', 'down-approved': '下架通过', 'down-rejected': '下架驳回' };
    return labels[status] || '待上架';
  }

  function findManagementItem(id) {
    return DATA_MANAGEMENT_ITEMS.find(function (item) { return item.id === Number(id); });
  }

  function getFilteredManagementItems() {
    var keyword = state.managementKeyword.toLowerCase();
    return DATA_MANAGEMENT_ITEMS.filter(function (item) {
      var matchesType = state.managementTab === 'all' || state.managementTab === 'api' && (item.type === 'api' || item.type === 'orchestration') || item.type === state.managementTab;
      var text = [item.code, item.title, item.englishName, item.description, item.sourceType].join(' ').toLowerCase();
      return catalogIncludes(item.catalog, state.catalogId) && matchesType &&
        (state.managementPublishStatus === 'all' || item.publishStatus === state.managementPublishStatus) &&
        (state.managementAuditStatus === 'all' || item.auditStatus === state.managementAuditStatus) &&
        (!keyword || text.indexOf(keyword) > -1);
    }).sort(function (a, b) { return b.updatedAt.localeCompare(a.updatedAt); });
  }

  function managementCardHtml(item) {
    var editable = item.publishStatus !== 'online' && item.auditStatus !== 'up-pending';
    var checked = !!state.managementSelected[item.id];
    return '<article class="dm-management-card"><label class="dm-management-check"><input type="checkbox" data-management-check="' + item.id + '" ' + (checked ? 'checked' : '') + ' aria-label="选择' + escapeHtml(item.title) + '"></label>' +
      '<div class="dm-management-card-body"><div class="dm-management-card-head"><div class="dm-management-badges"><span class="dm-management-publish ' + item.publishStatus + '">' + managementPublishLabel(item.publishStatus) + '</span><span class="dm-management-audit ' + item.auditStatus + '">' + managementAuditLabel(item.auditStatus) + '</span><span class="dm-type-tag ' + (TYPE_META[item.type] || TYPE_META.api).className + '">' + managementTypeLabel(item) + '</span></div><h3>' + escapeHtml(item.title) + '【' + escapeHtml(item.version) + '】</h3><div class="dm-management-actions"><button type="button" class="dm-table-action" data-management-audit="' + item.id + '"><i class="bi bi-journal-text"></i>审核记录</button>' + (editable ? '<button type="button" class="dm-table-action" data-management-edit="' + item.id + '"><i class="bi bi-pencil-square"></i>数据编辑</button>' : '') + '</div></div>' +
      '<p>数据简介：' + escapeHtml(item.description) + '</p><ul><li><span>数据类型</span><strong>' + escapeHtml(item.sourceType) + '</strong></li><li><span>数据分类</span><strong>' + escapeHtml(item.category) + '</strong></li><li><span>浏览量</span><strong>' + item.views.toLocaleString() + ' 次</strong></li><li><span>申请量</span><strong>' + item.applies.toLocaleString() + ' 次</strong></li><li><span>上架时间</span><strong>' + escapeHtml(item.releasedAt) + '</strong></li><li><span>更新时间</span><strong>' + escapeHtml(item.updatedAt) + '</strong></li><li><span>更新频率</span><strong>' + escapeHtml(item.frequency) + '</strong></li></ul></div></article>';
  }

  function managementListHtml() {
    var list = getFilteredManagementItems();
    var total = list.length;
    var pages = Math.max(1, Math.ceil(total / state.managementPageSize));
    if (state.managementPage > pages) state.managementPage = pages;
    var start = (state.managementPage - 1) * state.managementPageSize;
    var pageItems = list.slice(start, start + state.managementPageSize);
    var allChecked = pageItems.length && pageItems.every(function (item) { return state.managementSelected[item.id]; });
    var pageButtons = '';
    for (var i = 1; i <= pages; i += 1) pageButtons += '<button type="button" class="dm-page-num ' + (state.managementPage === i ? 'active' : '') + '" data-management-page="' + i + '">' + i + '</button>';
    return '<section class="dm-management-results"><div class="dm-management-toolbar"><div class="dm-management-batch"><label><input type="checkbox" data-management-check-all ' + (allChecked ? 'checked' : '') + '>全选</label><button type="button" class="dm-dir-btn primary" data-management-action="publish"><i class="bi bi-cloud-arrow-up"></i>数据上架</button><button type="button" class="dm-dir-btn" data-management-action="offline"><i class="bi bi-cloud-arrow-down"></i>数据下架</button></div><div class="dm-management-filters"><label><span>发布状态</span><select data-management-publish-status><option value="all">请选择</option><option value="composing" ' + (state.managementPublishStatus === 'composing' ? 'selected' : '') + '>编制</option><option value="pending" ' + (state.managementPublishStatus === 'pending' ? 'selected' : '') + '>待上架</option><option value="online" ' + (state.managementPublishStatus === 'online' ? 'selected' : '') + '>已上架</option></select></label><label><span>审核状态</span><select data-management-audit-status><option value="all">请选择</option><option value="up-pending" ' + (state.managementAuditStatus === 'up-pending' ? 'selected' : '') + '>上架待审核</option><option value="up-approved" ' + (state.managementAuditStatus === 'up-approved' ? 'selected' : '') + '>上架通过</option><option value="up-rejected" ' + (state.managementAuditStatus === 'up-rejected' ? 'selected' : '') + '>上架驳回</option><option value="down-pending" ' + (state.managementAuditStatus === 'down-pending' ? 'selected' : '') + '>下架待审核</option><option value="down-approved" ' + (state.managementAuditStatus === 'down-approved' ? 'selected' : '') + '>下架通过</option><option value="down-rejected" ' + (state.managementAuditStatus === 'down-rejected' ? 'selected' : '') + '>下架驳回</option></select></label></div></div><div class="dm-management-list">' + (pageItems.length ? pageItems.map(managementCardHtml).join('') : '<div class="dm-result-empty"><i class="bi bi-inbox"></i><strong>暂无匹配的数据资源</strong><span>请调整目录或筛选条件</span></div>') + '</div>' +
      '<div class="dm-directory-pagination"><span>共 ' + total + ' 条</span><div class="dm-page-buttons"><button type="button" class="dm-page-arrow" data-management-page="' + (state.managementPage - 1) + '" ' + (state.managementPage === 1 ? 'disabled' : '') + '><i class="bi bi-chevron-left"></i></button>' + pageButtons + '<button type="button" class="dm-page-arrow" data-management-page="' + (state.managementPage + 1) + '" ' + (state.managementPage === pages ? 'disabled' : '') + '><i class="bi bi-chevron-right"></i></button><select class="dm-page-size" data-management-page-size aria-label="数据管理每页条数"><option value="10" ' + (state.managementPageSize === 10 ? 'selected' : '') + '>10 条/页</option><option value="20" ' + (state.managementPageSize === 20 ? 'selected' : '') + '>20 条/页</option></select><label class="dm-page-jump">跳至<input type="number" min="1" max="' + pages + '" data-management-page-jump>页</label></div></div></section>';
  }

  function dataManagementViewHtml() {
    var tabs = [['all', '全部'], ['api', 'API接口'], ['dataset', '数据集'], ['db', '数据库表']];
    return '<div class="dm-directory-page dm-management-page">' + breadcrumbHtml([['系统管理', 'data-management']], '数据管理') + '<div class="dm-directory-layout"><aside class="dm-catalog-panel"><h2><i class="bi bi-diagram-3"></i>数据地图</h2><label class="dm-tree-search"><input type="text" value="' + escapeHtml(state.treeKeyword) + '" placeholder="请输入" aria-label="搜索目录"><i class="bi bi-search"></i></label><div class="dm-catalog-tree">' + treeHtml() + '</div></aside><main class="dm-directory-main dm-management-main"><section class="dm-management-search"><div><input type="text" value="' + escapeHtml(state.managementDraftKeyword) + '" placeholder="请输入关键字" aria-label="数据管理关键字"><button type="button" class="dm-dir-btn primary" data-management-search><i class="bi bi-search"></i>搜索</button></div></section><div class="dm-management-tabs">' + tabs.map(function (tab) { return '<button type="button" class="' + (state.managementTab === tab[0] ? 'active' : '') + '" data-management-tab="' + tab[0] + '">' + tab[1] + '</button>'; }).join('') + '</div>' + managementListHtml() + '</main></div></div>';
  }

  function managementEditTabsHtml(item) {
    var tabs = item.type === 'api' || item.type === 'orchestration' ? [['api-doc', 'API文档']] : [['fields', '数据项'], ['preview', '数据预览']];
    return '<div class="dm-detail-tabs">' + tabs.map(function (tab) { return '<button type="button" class="' + (state.managementEditTab === tab[0] ? 'active' : '') + '" data-management-edit-tab="' + tab[0] + '">' + tab[1] + '</button>'; }).join('') + '</div>';
  }

  function managementEditContentHtml(item) {
    if (item.type === 'api' || item.type === 'orchestration') return apiDocumentHtml(item);
    var profile = getFieldProfile(item);
    return state.managementEditTab === 'preview' ? previewTableHtml(profile) : fieldTableHtml(profile, item.type === 'db', false);
  }

  function enhanceManagementCategoryPicker(root) {
    if (!root || !root.querySelector) return;
    var input = root.querySelector('.dm-management-edit-form input[name="category"]');
    if (!input) return;
    var label = input.closest('label');
    var datalist = label ? label.querySelector('datalist') : null;
    if (!label) return;
    var categories = [
      ['公共目录', [['public-base', '公共基础数据'], ['public-market', '市场主体数据'], ['public-city', '城市运行数据'], ['public-service', '公共服务数据']]],
      ['我的目录', [['mine-logistics', '物流运营数据'], ['mine-customer', '客户服务数据']]]
    ];
    input.type = 'hidden';
    input.removeAttribute('list');
    if (datalist) datalist.remove();
    input.insertAdjacentHTML('afterend', '<div class="dm-management-category-picker"><button type="button" class="dm-management-category-control" data-management-category-toggle><span data-management-category-label>' + escapeHtml(input.value) + '</span><i class="bi bi-chevron-down"></i></button><div class="dm-management-category-popup"><label class="dm-management-category-search"><i class="bi bi-search"></i><input type="text" placeholder="请输入目录名称" aria-label="搜索数据分类" data-management-category-search></label><div class="dm-management-category-tree">' + categories.map(function (group) { return '<section><h4><i class="bi bi-folder2-open"></i>' + group[0] + '</h4>' + group[1].map(function (category) { var value = group[0] + ' / ' + category[1]; return '<button type="button" data-management-category-value="' + escapeHtml(value) + '" class="' + (input.value === value ? 'active' : '') + '"><i class="bi bi-file-earmark-text"></i><span>' + category[1] + '</span></button>'; }).join('') + '</section>'; }).join('') + '<div class="dm-management-category-empty" hidden>暂无匹配目录</div></div></div></div>');
  }

  function dataManagementEditViewHtml() {
    var item = findManagementItem(state.managementEditId);
    if (!item) return dataManagementViewHtml();
    return '<div class="dm-detail-page dm-management-edit-page"><div class="dm-breadcrumb"><i class="bi bi-house-door"></i><span>首页</span><i class="bi bi-chevron-right"></i><span>系统管理</span><i class="bi bi-chevron-right"></i><span>数据管理</span><i class="bi bi-chevron-right"></i><strong>' + escapeHtml(item.title) + '</strong></div><form class="dm-detail-main" data-management-edit-form data-management-id="' + item.id + '"><section class="dm-detail-heading"><div><i class="bi bi-list-ul"></i><h2>' + escapeHtml(item.title) + '</h2></div><div class="dm-detail-actions"><button type="submit" class="dm-dir-btn primary"><i class="bi bi-save"></i>保存</button><button type="button" class="dm-dir-btn" data-management-back><i class="bi bi-arrow-left"></i>返回</button></div></section><section class="dm-management-edit-form"><label><span>数据编码</span><input value="' + item.code + '" disabled></label><label><span><em>*</em>数据名称</span><input name="title" value="' + escapeHtml(item.title) + '" required></label><label><span>英文名称</span><input name="englishName" value="' + escapeHtml(item.englishName) + '"></label><label class="wide"><span>数据摘要</span><textarea name="description" rows="3">' + escapeHtml(item.description) + '</textarea></label><label><span>版本</span><input value="' + item.version + '" disabled></label><label><span><em>*</em>数据分类</span><input name="category" list="dmManagementCategories" value="' + escapeHtml(item.category) + '" required><datalist id="dmManagementCategories"><option value="公共目录 / 公共基础数据"><option value="公共目录 / 市场主体数据"><option value="公共目录 / 城市运行数据"><option value="公共目录 / 公共服务数据"><option value="我的目录 / 物流运营数据"><option value="我的目录 / 客户服务数据"></datalist></label><label><span><em>*</em>数据领域</span><select name="domain" required><option ' + (item.domain === '公共基础' ? 'selected' : '') + '>公共基础</option><option ' + (item.domain === '市场监管' ? 'selected' : '') + '>市场监管</option><option ' + (item.domain === '城市运行' ? 'selected' : '') + '>城市运行</option><option ' + (item.domain === '公共服务' ? 'selected' : '') + '>公共服务</option><option ' + (item.domain === '仓储物流' ? 'selected' : '') + '>仓储物流</option><option ' + (item.domain === '客户服务' ? 'selected' : '') + '>客户服务</option></select></label><label><span>上架时间</span><input value="' + escapeHtml(item.releasedAt) + '" disabled></label><label><span>更新时间</span><input value="' + escapeHtml(item.updatedAt) + '" disabled></label><label><span>质量评分</span><input value="' + escapeHtml(item.quality) + '" disabled></label><label><span>浏览量</span><input value="' + item.views.toLocaleString() + ' 次" disabled></label><label><span>推送量</span><input value="' + item.pushes.toLocaleString() + ' 次" disabled></label><label><span>调用量</span><input value="' + item.calls.toLocaleString() + ' 次" disabled></label><label><span>管理单位</span><input name="manager" value="' + escapeHtml(item.manager) + '"></label><label><span>数据来源</span><input value="' + escapeHtml(item.source) + '" disabled></label><label><span>联系电话</span><input name="phone" value="' + escapeHtml(item.phone) + '"></label><label><span>更新频率</span><select name="frequency"><option ' + (item.frequency === '实时' ? 'selected' : '') + '>实时</option><option ' + (item.frequency === '每15分钟' ? 'selected' : '') + '>每15分钟</option><option ' + (item.frequency === '每小时' ? 'selected' : '') + '>每小时</option><option ' + (item.frequency === '每日' ? 'selected' : '') + '>每日</option><option ' + (item.frequency === '每周' ? 'selected' : '') + '>每周</option><option ' + (item.frequency === '每月' ? 'selected' : '') + '>每月</option></select></label><label><span>申请量</span><input value="' + item.applies.toLocaleString() + ' 次" disabled></label></section><section class="dm-detail-data">' + managementEditTabsHtml(item) + '<div class="dm-detail-tab-panel">' + managementEditContentHtml(item) + '</div></section></form></div>';
  }

  function openManagementAudit(item) {
    if (!item) return;
    var rows = item.auditHistory.map(function (row) { return '<tr><td>' + escapeHtml(row[0]) + '</td><td>' + escapeHtml(row[1]) + '</td><td>' + escapeHtml(row[2]) + '</td><td>' + escapeHtml(row[3]) + '</td></tr>'; }).join('');
    document.querySelector('.page-data-map').insertAdjacentHTML('beforeend', '<div class="dm-modal-mask" role="dialog" aria-modal="true" aria-label="审核记录"><div class="dm-modal dm-management-audit-modal"><div class="dm-modal-head"><h3>审核记录</h3><button type="button" data-modal-close aria-label="关闭"><i class="bi bi-x-lg"></i></button></div><div class="dm-modal-body"><div class="dm-management-audit-name"><i class="bi bi-info-circle"></i>' + escapeHtml(item.title) + '</div><div class="dm-data-table-scroll"><table class="dm-detail-table"><thead><tr><th>时间</th><th>操作者</th><th>操作内容</th><th>备注</th></tr></thead><tbody>' + rows + '</tbody></table></div><div class="dm-management-audit-page"><button type="button" disabled><i class="bi bi-chevron-left"></i></button><strong>1</strong><button type="button" disabled><i class="bi bi-chevron-right"></i></button></div></div></div></div>');
  }

  function openManagementConfirm(action) {
    var selected = Object.keys(state.managementSelected).filter(function (id) { return state.managementSelected[id]; }).map(findManagementItem).filter(Boolean);
    var eligible = selected.filter(function (item) { return action === 'publish' ? item.publishStatus !== 'online' : item.publishStatus === 'online'; });
    if (!selected.length) { showToast('请先选择需要处理的数据'); return; }
    if (!eligible.length) { showToast(action === 'publish' ? '所选数据当前不能上架' : '所选数据当前不能下架'); return; }
    var label = action === 'publish' ? '发布' : '下架';
    var names = eligible.map(function (item) { return item.title + '[' + item.version + ']'; }).join('、');
    document.querySelector('.page-data-map').insertAdjacentHTML('beforeend', '<div class="dm-modal-mask" role="dialog" aria-modal="true" aria-label="' + label + '"><div class="dm-modal dm-confirm-modal"><div class="dm-modal-head"><h3>' + label + '</h3><button type="button" data-modal-close aria-label="关闭"><i class="bi bi-x-lg"></i></button></div><div class="dm-modal-body"><p class="dm-management-confirm-text">确认' + label + '【' + escapeHtml(names) + '】' + eligible.length + '条数据吗？</p></div><div class="dm-modal-foot"><button type="button" class="dm-dir-btn" data-modal-close><i class="bi bi-x-circle"></i>取消</button><button type="button" class="dm-dir-btn primary" data-management-confirm="' + action + '" data-management-ids="' + eligible.map(function (item) { return item.id; }).join(',') + '"><i class="bi bi-check2-circle"></i>确定</button></div></div></div>');
  }

  function getFilteredSystemAuditItems() {
    var keyword = state.systemAuditKeyword.toLowerCase();
    return DATA_MANAGEMENT_ITEMS.filter(function (item) {
      var matchesType = state.systemAuditTab === 'all' || state.systemAuditTab === 'api' && (item.type === 'api' || item.type === 'orchestration') || item.type === state.systemAuditTab;
      var text = [item.code, item.title, item.englishName, item.description, item.sourceType].join(' ').toLowerCase();
      return item.auditStatus !== 'pending' && catalogIncludes(item.catalog, state.catalogId) && matchesType &&
        (state.systemAuditPublishStatus === 'all' || item.publishStatus === state.systemAuditPublishStatus) &&
        (state.systemAuditStatus === 'all' || item.auditStatus === state.systemAuditStatus) &&
        (!keyword || text.indexOf(keyword) > -1);
    }).sort(function (a, b) { return b.updatedAt.localeCompare(a.updatedAt); });
  }

  function systemAuditCardHtml(item) {
    var checked = !!state.systemAuditSelected[item.id];
    return '<article class="dm-management-card dm-system-audit-card"><label class="dm-management-check"><input type="checkbox" data-system-audit-check="' + item.id + '" ' + (checked ? 'checked' : '') + ' aria-label="选择' + escapeHtml(item.title) + '"></label>' +
      '<div class="dm-management-card-body"><div class="dm-management-card-head"><div class="dm-management-badges"><span class="dm-management-publish ' + item.publishStatus + '">' + managementPublishLabel(item.publishStatus) + '</span><span class="dm-management-audit ' + item.auditStatus + '">' + managementAuditLabel(item.auditStatus) + '</span><span class="dm-type-tag ' + (TYPE_META[item.type] || TYPE_META.api).className + '">' + managementTypeLabel(item) + '</span></div><button type="button" class="dm-system-audit-title" data-system-audit-detail="' + item.id + '">' + escapeHtml(item.title) + '【' + escapeHtml(item.version) + '】</button><div class="dm-management-actions"><button type="button" class="dm-table-action" data-system-audit-record="' + item.id + '"><i class="bi bi-journal-text"></i>审核记录</button></div></div>' +
      '<p>数据简介：' + escapeHtml(item.description) + '</p><ul><li><span>数据类型</span><strong>' + escapeHtml(item.sourceType) + '</strong></li><li><span>数据分类</span><strong>' + escapeHtml(item.category) + '</strong></li><li><span>浏览量</span><strong>' + item.views.toLocaleString() + ' 次</strong></li><li><span>申请量</span><strong>' + item.applies.toLocaleString() + ' 次</strong></li><li><span>上架时间</span><strong>' + escapeHtml(item.releasedAt) + '</strong></li><li><span>更新时间</span><strong>' + escapeHtml(item.updatedAt) + '</strong></li><li><span>更新频率</span><strong>' + escapeHtml(item.frequency) + '</strong></li></ul></div></article>';
  }

  function systemAuditListHtml() {
    var list = getFilteredSystemAuditItems();
    var total = list.length;
    var pages = Math.max(1, Math.ceil(total / state.systemAuditPageSize));
    if (state.systemAuditPage > pages) state.systemAuditPage = pages;
    var start = (state.systemAuditPage - 1) * state.systemAuditPageSize;
    var pageItems = list.slice(start, start + state.systemAuditPageSize);
    var allChecked = pageItems.length && pageItems.every(function (item) { return state.systemAuditSelected[item.id]; });
    var pageButtons = '';
    for (var i = 1; i <= pages; i += 1) pageButtons += '<button type="button" class="dm-page-num ' + (state.systemAuditPage === i ? 'active' : '') + '" data-system-audit-page="' + i + '">' + i + '</button>';
    return '<section class="dm-management-results"><div class="dm-management-toolbar"><div class="dm-management-batch"><label><input type="checkbox" data-system-audit-check-all ' + (allChecked ? 'checked' : '') + '>全选</label><button type="button" class="dm-dir-btn primary" data-system-audit-process><i class="bi bi-check2-square"></i>处理</button></div><div class="dm-management-filters"><label><span>发布状态</span><select data-system-audit-publish-status><option value="all">请选择</option><option value="composing" ' + (state.systemAuditPublishStatus === 'composing' ? 'selected' : '') + '>编制</option><option value="pending" ' + (state.systemAuditPublishStatus === 'pending' ? 'selected' : '') + '>待上架</option><option value="online" ' + (state.systemAuditPublishStatus === 'online' ? 'selected' : '') + '>已上架</option></select></label><label><span>审核状态</span><select data-system-audit-status><option value="all">请选择</option><option value="up-pending" ' + (state.systemAuditStatus === 'up-pending' ? 'selected' : '') + '>上架待审核</option><option value="up-approved" ' + (state.systemAuditStatus === 'up-approved' ? 'selected' : '') + '>上架通过</option><option value="up-rejected" ' + (state.systemAuditStatus === 'up-rejected' ? 'selected' : '') + '>上架驳回</option><option value="down-pending" ' + (state.systemAuditStatus === 'down-pending' ? 'selected' : '') + '>下架待审核</option><option value="down-approved" ' + (state.systemAuditStatus === 'down-approved' ? 'selected' : '') + '>下架通过</option><option value="down-rejected" ' + (state.systemAuditStatus === 'down-rejected' ? 'selected' : '') + '>下架驳回</option></select></label></div></div><div class="dm-management-list">' + (pageItems.length ? pageItems.map(systemAuditCardHtml).join('') : '<div class="dm-result-empty"><i class="bi bi-inbox"></i><strong>暂无匹配的审核数据</strong><span>请调整目录或筛选条件</span></div>') + '</div>' +
      '<div class="dm-directory-pagination"><span>共 ' + total + ' 条</span><div class="dm-page-buttons"><button type="button" class="dm-page-arrow" data-system-audit-page="' + (state.systemAuditPage - 1) + '" ' + (state.systemAuditPage === 1 ? 'disabled' : '') + '><i class="bi bi-chevron-left"></i></button>' + pageButtons + '<button type="button" class="dm-page-arrow" data-system-audit-page="' + (state.systemAuditPage + 1) + '" ' + (state.systemAuditPage === pages ? 'disabled' : '') + '><i class="bi bi-chevron-right"></i></button><select class="dm-page-size" data-system-audit-page-size aria-label="系统审核每页条数"><option value="10" ' + (state.systemAuditPageSize === 10 ? 'selected' : '') + '>10 条/页</option><option value="20" ' + (state.systemAuditPageSize === 20 ? 'selected' : '') + '>20 条/页</option></select><label class="dm-page-jump">跳至<input type="number" min="1" max="' + pages + '" data-system-audit-page-jump>页</label></div></div></section>';
  }

  function systemAuditCenterViewHtml() {
    var tabs = [['all', '全部'], ['api', 'API接口'], ['dataset', '数据集'], ['db', '数据库表']];
    return '<div class="dm-directory-page dm-management-page dm-system-audit-page"><div class="dm-breadcrumb"><i class="bi bi-house-door"></i><span>首页</span><i class="bi bi-chevron-right"></i><span>系统管理</span><i class="bi bi-chevron-right"></i><strong>审核中心</strong></div><div class="dm-directory-layout"><aside class="dm-catalog-panel"><h2><i class="bi bi-diagram-3"></i>数据地图</h2><label class="dm-tree-search"><input type="text" value="' + escapeHtml(state.treeKeyword) + '" placeholder="请输入" aria-label="搜索目录"><i class="bi bi-search"></i></label><div class="dm-catalog-tree">' + treeHtml() + '</div></aside><main class="dm-directory-main dm-management-main"><section class="dm-management-search"><div><input type="text" value="' + escapeHtml(state.systemAuditDraftKeyword) + '" placeholder="请输入关键字" aria-label="系统审核关键字"><button type="button" class="dm-dir-btn primary" data-system-audit-search><i class="bi bi-search"></i>搜索</button></div></section><div class="dm-management-tabs">' + tabs.map(function (tab) { return '<button type="button" class="' + (state.systemAuditTab === tab[0] ? 'active' : '') + '" data-system-audit-tab="' + tab[0] + '">' + tab[1] + '</button>'; }).join('') + '</div>' + systemAuditListHtml() + '</main></div></div>';
  }

  function managementReadonlyMetaHtml(item) {
    var rows = [
      ['数据编码', item.code, '数据名称', item.title, '英文名称', item.englishName],
      ['数据摘要', item.description, '版本', item.version, '数据分类', item.category],
      ['数据领域', item.domain, '上架时间', item.releasedAt, '更新时间', item.updatedAt],
      ['质量评分', item.quality, '浏览量', item.views.toLocaleString() + ' 次', '推送量', item.pushes.toLocaleString() + ' 次'],
      ['调用量', item.calls.toLocaleString() + ' 次', '管理单位', item.manager, '数据来源', item.source],
      ['联系电话', item.phone, '更新频率', item.frequency, '申请量', item.applies.toLocaleString() + ' 次']
    ];
    return '<div class="dm-detail-meta-table">' + rows.map(function (row, rowIndex) { return '<div class="dm-detail-meta-row ' + (rowIndex === 1 ? 'summary-row' : '') + '">' + row.map(function (cell, cellIndex) { return '<span class="' + (cellIndex % 2 === 0 ? 'label' : 'value') + '">' + escapeHtml(cell) + '</span>'; }).join('') + '</div>'; }).join('') + '</div>';
  }

  function systemAuditDetailTabsHtml(item) {
    var tabs = item.type === 'api' || item.type === 'orchestration' ? [['api-doc', 'API文档']] : [['fields', '数据项'], ['preview', '数据预览']];
    return '<div class="dm-detail-tabs">' + tabs.map(function (tab) { return '<button type="button" class="' + (state.systemAuditDetailTab === tab[0] ? 'active' : '') + '" data-system-audit-detail-tab="' + tab[0] + '">' + tab[1] + '</button>'; }).join('') + '</div>';
  }

  function systemAuditDetailContentHtml(item) {
    if (item.type === 'api' || item.type === 'orchestration') return apiDocumentHtml(item);
    var profile = getFieldProfile(item);
    return state.systemAuditDetailTab === 'preview' ? previewTableHtml(profile) : fieldTableHtml(profile, item.type === 'db', false);
  }

  function systemAuditDetailViewHtml() {
    var item = findManagementItem(state.systemAuditDetailId);
    if (!item) return systemAuditCenterViewHtml();
    return '<div class="dm-detail-page dm-system-audit-detail-page"><div class="dm-breadcrumb"><i class="bi bi-house-door"></i><span>首页</span><i class="bi bi-chevron-right"></i><span>系统管理</span><i class="bi bi-chevron-right"></i><span>审核中心</span><i class="bi bi-chevron-right"></i><strong>' + escapeHtml(item.title) + '</strong></div><main class="dm-detail-main"><section class="dm-detail-heading"><div><i class="bi bi-list-check"></i><h2>' + escapeHtml(item.title) + '</h2></div><button type="button" class="dm-dir-btn" data-system-audit-back><i class="bi bi-arrow-left"></i>返回</button></section><section class="dm-detail-meta">' + managementReadonlyMetaHtml(item) + '</section><section class="dm-detail-data">' + systemAuditDetailTabsHtml(item) + '<div class="dm-detail-tab-panel">' + systemAuditDetailContentHtml(item) + '</div></section></main></div>';
  }

  function systemBreadcrumbHtml(title) {
    return breadcrumbHtml([['系统管理', 'data-management']], title);
  }

  function getFilteredSystemUsers() {
    var keyword = state.systemUserKeyword.toLowerCase();
    return SYSTEM_USERS.filter(function (user) {
      var deptMatched = state.systemUserDept === 'all' || state.systemUserDept === 'root' || user.departmentId === state.systemUserDept;
      var text = [user.account, user.name, user.department, user.role, user.phone, user.email].join(' ').toLowerCase();
      return deptMatched && (state.systemUserStatus === 'all' || user.status === state.systemUserStatus) && (!keyword || text.indexOf(keyword) > -1);
    });
  }

  function systemOrgTreeHtml() {
    return '<div class="dm-org-node root ' + (state.systemUserDept === 'root' ? 'active' : '') + '" data-org-name="数据中台演示"><button type="button" data-system-user-dept="root"><i class="bi bi-building"></i>数据中台演示</button><span><button type="button" data-department-add title="新增部门"><i class="bi bi-plus-circle"></i><b>新增</b></button><button type="button" data-department-edit="root" title="修改部门"><i class="bi bi-pencil-square"></i><b>修改</b></button></span></div>' +
      '<div class="dm-org-children"><div class="dm-org-node ' + (state.systemUserDept === 'my' ? 'active' : '') + '" data-org-name="我的部门"><button type="button" data-system-user-dept="my"><i class="bi bi-folder2-open"></i>我的部门</button><span><button type="button" data-department-add="my" title="新增部门"><i class="bi bi-plus-circle"></i><b>新增</b></button><button type="button" data-department-edit="my" title="修改部门"><i class="bi bi-pencil-square"></i><b>修改</b></button></span></div>' +
      '<div class="dm-org-children"><div class="dm-org-node ' + (state.systemUserDept === 'business' ? 'active' : '') + '" data-org-name="业务部"><button type="button" data-system-user-dept="business"><i class="bi bi-file-earmark-text"></i>业务部</button><span><button type="button" data-department-edit="business" title="修改部门"><i class="bi bi-pencil-square"></i><b>修改</b></button></span></div><div class="dm-org-node ' + (state.systemUserDept === 'engineering' ? 'active' : '') + '" data-org-name="工程部"><button type="button" data-system-user-dept="engineering"><i class="bi bi-file-earmark-text"></i>工程部</button><span><button type="button" data-department-edit="engineering" title="修改部门"><i class="bi bi-pencil-square"></i><b>修改</b></button></span></div></div></div><div class="dm-org-empty" hidden>未找到匹配部门</div>';
  }

  function systemUserTableHtml() {
    var list = getFilteredSystemUsers();
    var total = list.length;
    var pages = Math.max(1, Math.ceil(total / state.systemUserPageSize));
    if (state.systemUserPage > pages) state.systemUserPage = pages;
    var start = (state.systemUserPage - 1) * state.systemUserPageSize;
    var pageItems = list.slice(start, start + state.systemUserPageSize);
    var allChecked = pageItems.length && pageItems.every(function (user) { return state.systemUserSelected[user.id]; });
    var rows = pageItems.map(function (user) {
      var nextStatus = user.status === 'enabled' ? 'disabled' : 'enabled';
      return '<tr><td class="check"><input type="checkbox" data-system-user-check="' + user.id + '" ' + (state.systemUserSelected[user.id] ? 'checked' : '') + ' aria-label="选择' + escapeHtml(user.name) + '"></td><td>' + escapeHtml(user.account) + '</td><td>' + escapeHtml(user.name) + '</td><td>' + escapeHtml(user.department) + '</td><td><span class="dm-user-status ' + user.status + '">' + (user.status === 'enabled' ? '正常' : '禁用') + '</span></td><td>' + escapeHtml(user.role) + '</td><td><div class="dm-user-actions"><button type="button" class="dm-table-action" data-system-user-view="' + user.id + '"><i class="bi bi-eye"></i>查看</button><button type="button" class="dm-table-action" data-system-user-edit="' + user.id + '"><i class="bi bi-pencil-square"></i>编辑</button><button type="button" class="dm-table-action" data-system-user-reset="' + user.id + '"><i class="bi bi-key"></i>密码重置</button><button type="button" class="dm-table-action" data-system-user-status-action="' + user.id + '" data-next-status="' + nextStatus + '"><i class="bi ' + (user.status === 'enabled' ? 'bi-slash-circle' : 'bi-check-circle') + '"></i>' + (user.status === 'enabled' ? '禁用' : '启用') + '</button><button type="button" class="dm-table-action danger" data-system-user-delete="' + user.id + '"><i class="bi bi-trash"></i>删除</button></div></td></tr>';
    }).join('');
    var buttons = '';
    for (var i = 1; i <= pages; i += 1) buttons += '<button type="button" class="dm-page-num ' + (state.systemUserPage === i ? 'active' : '') + '" data-system-user-page="' + i + '">' + i + '</button>';
    return '<div class="dm-system-table-scroll"><table class="dm-system-table dm-user-table"><thead><tr><th class="check"><input type="checkbox" data-system-user-check-all ' + (allChecked ? 'checked' : '') + ' aria-label="全选当前页"></th><th>账号</th><th>姓名</th><th>所属部门</th><th>状态</th><th>角色</th><th>操作</th></tr></thead><tbody>' + (rows || '<tr><td colspan="7"><div class="dm-result-empty"><i class="bi bi-inbox"></i><strong>暂无匹配用户</strong><span>请调整部门或查询条件</span></div></td></tr>') + '</tbody></table></div><div class="dm-directory-pagination"><span>共 ' + total + ' 条</span><div class="dm-page-buttons"><button type="button" class="dm-page-arrow" data-system-user-page="' + (state.systemUserPage - 1) + '" ' + (state.systemUserPage === 1 ? 'disabled' : '') + '><i class="bi bi-chevron-left"></i></button>' + buttons + '<button type="button" class="dm-page-arrow" data-system-user-page="' + (state.systemUserPage + 1) + '" ' + (state.systemUserPage === pages ? 'disabled' : '') + '><i class="bi bi-chevron-right"></i></button><select class="dm-page-size" data-system-user-page-size><option value="10" ' + (state.systemUserPageSize === 10 ? 'selected' : '') + '>10 条/页</option><option value="20" ' + (state.systemUserPageSize === 20 ? 'selected' : '') + '>20 条/页</option></select></div></div>';
  }

  function systemUserManagementViewHtml() {
    return '<div class="dm-system-page">' + systemBreadcrumbHtml('用户管理') + '<main class="dm-system-main"><div class="dm-user-layout"><aside class="dm-org-panel"><h2><i class="bi bi-diagram-3"></i>组织机构</h2><label class="dm-tree-search"><input type="text" placeholder="请输入" aria-label="搜索组织机构" data-org-search><i class="bi bi-search"></i></label><div class="dm-org-tree">' + systemOrgTreeHtml() + '</div></aside><section class="dm-user-content"><div class="dm-system-toolbar"><div class="dm-system-actions"><button type="button" class="dm-dir-btn primary" data-system-user-add><i class="bi bi-plus-circle"></i>新增</button><button type="button" class="dm-dir-btn" data-system-user-export><i class="bi bi-download"></i>导出</button><button type="button" class="dm-dir-btn" data-system-user-import><i class="bi bi-upload"></i>导入</button><button type="button" class="dm-dir-btn danger" data-system-user-batch-delete><i class="bi bi-trash"></i>删除</button></div><div class="dm-system-filters"><label><span>状态</span><select data-system-user-status><option value="all">请选择</option><option value="enabled" ' + (state.systemUserStatus === 'enabled' ? 'selected' : '') + '>正常</option><option value="disabled" ' + (state.systemUserStatus === 'disabled' ? 'selected' : '') + '>禁用</option></select></label><div class="dm-system-search"><input type="text" value="' + escapeHtml(state.systemUserDraftKeyword) + '" placeholder="账号/姓名" aria-label="用户账号姓名"><button type="button" class="dm-dir-btn primary" data-system-user-search><i class="bi bi-search"></i>查询</button></div></div></div>' + systemUserTableHtml() + '</section></div></main></div>';
  }

  function systemUserRoleOptions(selected) {
    return SYSTEM_ROLES.map(function (role) { return '<option ' + (role.name === selected ? 'selected' : '') + '>' + escapeHtml(role.name) + '</option>'; }).join('');
  }

  function openSystemUserForm(user, mode) {
    var readonly = mode === 'view';
    var title = mode === 'add' ? '新增' : mode === 'edit' ? '编辑' : '查看';
    var current = user || { id: '', account: '', name: '', gender: '男', departmentId: 'my', phone: '', email: '', status: 'enabled', role: '数据运营管理员' };
    document.querySelector('.page-data-map').insertAdjacentHTML('beforeend', '<div class="dm-modal-mask" role="dialog" aria-modal="true" aria-label="' + title + '"><form class="dm-modal dm-user-form-modal" data-system-user-form data-user-id="' + current.id + '"><div class="dm-modal-head"><h3>' + title + '</h3><button type="button" data-modal-close aria-label="关闭"><i class="bi bi-x-lg"></i></button></div><div class="dm-modal-body"><div class="dm-user-form-grid"><label><span><em>*</em>账号</span><input name="account" value="' + escapeHtml(current.account) + '" ' + (readonly || mode === 'edit' ? 'disabled' : 'required') + ' placeholder="请输入账号"></label><label><span>密码</span><input placeholder="默认手机后8位" disabled></label><label><span><em>*</em>姓名</span><input name="name" value="' + escapeHtml(current.name) + '" ' + (readonly ? 'disabled' : 'required') + '></label><label><span><em>*</em>性别</span><select name="gender" ' + (readonly ? 'disabled' : '') + '><option ' + (current.gender === '男' ? 'selected' : '') + '>男</option><option ' + (current.gender === '女' ? 'selected' : '') + '>女</option></select></label><label><span><em>*</em>归属</span><select name="department" ' + (readonly ? 'disabled' : '') + '><option value="my" ' + (current.departmentId === 'my' ? 'selected' : '') + '>数据中台演示 / 我的部门</option><option value="business" ' + (current.departmentId === 'business' ? 'selected' : '') + '>数据中台演示 / 我的部门 / 业务部</option><option value="engineering" ' + (current.departmentId === 'engineering' ? 'selected' : '') + '>数据中台演示 / 我的部门 / 工程部</option></select></label><label><span><em>*</em>手机</span><input name="phone" value="' + escapeHtml(current.phone) + '" ' + (readonly ? 'disabled' : 'required') + '></label><label><span><em>*</em>邮箱</span><input name="email" type="email" value="' + escapeHtml(current.email) + '" ' + (readonly ? 'disabled' : 'required') + '></label><label><span><em>*</em>状态</span><select name="status" ' + (readonly ? 'disabled' : '') + '><option value="enabled" ' + (current.status === 'enabled' ? 'selected' : '') + '>正常</option><option value="disabled" ' + (current.status === 'disabled' ? 'selected' : '') + '>禁用</option></select></label><label class="wide"><span><em>*</em>角色</span><select name="role" ' + (readonly ? 'disabled' : '') + '>' + systemUserRoleOptions(current.role) + '</select></label></div></div><div class="dm-modal-foot">' + (readonly ? '' : '<button type="submit" class="dm-dir-btn primary"><i class="bi bi-check2-circle"></i>确定</button>') + '<button type="button" class="dm-dir-btn" data-modal-close><i class="bi bi-x-circle"></i>' + (readonly ? '关闭' : '取消') + '</button></div></form></div>');
  }

  function openSystemConfirm(title, message, action, idList) {
    document.querySelector('.page-data-map').insertAdjacentHTML('beforeend', '<div class="dm-modal-mask" role="dialog" aria-modal="true" aria-label="' + escapeHtml(title) + '"><div class="dm-modal dm-confirm-modal"><div class="dm-modal-head"><h3>提示</h3><button type="button" data-modal-close aria-label="关闭"><i class="bi bi-x-lg"></i></button></div><div class="dm-modal-body"><div class="dm-confirm-message"><i class="bi bi-exclamation-circle"></i><p><strong>' + escapeHtml(title) + '</strong><span>' + escapeHtml(message) + '</span></p></div></div><div class="dm-modal-foot"><button type="button" class="dm-dir-btn" data-modal-close><i class="bi bi-x-circle"></i>取消</button><button type="button" class="dm-dir-btn primary" data-system-confirm="' + action + '" data-system-ids="' + idList.join(',') + '"><i class="bi bi-check2-circle"></i>确定</button></div></div></div>');
  }

  var PERMISSION_GROUPS = [
    ['首页', [['home.view', '查看']]],
    ['数据地图', [['map.view', '查看'], ['map.apply', '申请'], ['map.favorite', '收藏']]],
    ['个人中心', [['personal.data.view', '我的数据-查看'], ['personal.data.test', '我的数据-接口测试'], ['personal.data.favorite', '我的数据-收藏'], ['personal.data.pin', '我的数据-置顶'], ['personal.audit.view', '审核中心-查看'], ['personal.audit.process', '审核中心-处理'], ['personal.audit.record', '审核中心-审核记录'], ['personal.favorite.view', '我的收藏-查看'], ['personal.favorite.apply', '我的收藏-申请'], ['personal.favorite.favorite', '我的收藏-收藏'], ['personal.app.view', '我的应用-查看'], ['personal.app.edit', '我的应用-新增修改'], ['personal.app.offline', '我的应用-下架'], ['personal.app.delete', '我的应用-删除'], ['personal.account.view', '账号信息-查看'], ['personal.account.edit', '账号信息-修改'], ['personal.message.view', '我的消息-查看'], ['personal.message.analysis', '我的消息-数据分析']]],
    ['运行监控', [['monitor.api.view', 'API监控-查看'], ['monitor.apply.view', '申请记录-查看']]],
    ['系统管理', [['system.data.view', '数据管理-查看'], ['system.data.online', '数据管理-数据上架'], ['system.data.offline', '数据管理-数据下架'], ['system.data.audit', '数据管理-审核记录'], ['system.data.edit', '数据管理-数据编辑'], ['system.data.save', '数据管理-保存'], ['system.catalog.view', '目录管理-查看'], ['system.catalog.add', '目录管理-新增'], ['system.catalog.edit', '目录管理-修改'], ['system.catalog.delete', '目录管理-删除'], ['system.catalog.import', '目录管理-导入'], ['system.catalog.export', '目录管理-导出'], ['system.user.view', '用户管理-查看'], ['system.user.add', '用户管理-新增'], ['system.user.edit', '用户管理-修改'], ['system.user.delete', '用户管理-删除'], ['system.user.import', '用户管理-导入'], ['system.user.export', '用户管理-导出'], ['system.user.reset', '用户管理-密码重置'], ['system.user.status', '用户管理-启用禁用'], ['system.role.view', '角色管理-查看'], ['system.role.add', '角色管理-新增'], ['system.role.edit', '角色管理-修改'], ['system.role.delete', '角色管理-删除'], ['system.config.view', '系统配置-查看'], ['system.config.edit', '系统配置-修改'], ['system.log.view', '操作日志-查看'], ['system.audit.view', '审核中心-查看'], ['system.audit.process', '审核中心-处理'], ['system.audit.record', '审核中心-审核记录']]]
  ];

  function findSystemRole(id) { return SYSTEM_ROLES.find(function (role) { return role.id === Number(id); }); }

  function permissionTreeHtml(role) {
    return PERMISSION_GROUPS.map(function (group) {
      var checkedCount = group[1].filter(function (permission) { return role && role.permissions.indexOf(permission[0]) > -1; }).length;
      return '<section class="dm-permission-group"><label class="dm-permission-parent"><input type="checkbox" data-permission-group="' + escapeHtml(group[0]) + '" ' + (checkedCount === group[1].length ? 'checked' : '') + '><i class="bi bi-folder2-open"></i>' + escapeHtml(group[0]) + '<span>' + checkedCount + '/' + group[1].length + '</span></label><div class="dm-permission-items">' + group[1].map(function (permission) { return '<label><input type="checkbox" data-role-permission="' + permission[0] + '" data-permission-parent="' + escapeHtml(group[0]) + '" ' + (role && role.permissions.indexOf(permission[0]) > -1 ? 'checked' : '') + '>' + escapeHtml(permission[1]) + '</label>'; }).join('') + '</div></section>';
    }).join('');
  }

  function systemRoleManagementViewHtml() {
    var keyword = state.systemRoleKeyword.toLowerCase();
    var roles = SYSTEM_ROLES.filter(function (role) { return !keyword || [role.name, role.description].join(' ').toLowerCase().indexOf(keyword) > -1; });
    var selectedRole = findSystemRole(state.systemRoleSelectedId) || roles[0] || SYSTEM_ROLES[0];
    if (selectedRole) state.systemRoleSelectedId = selectedRole.id;
    return '<div class="dm-system-page">' + systemBreadcrumbHtml('角色管理') + '<main class="dm-system-main"><div class="dm-role-layout"><aside class="dm-role-panel"><div class="dm-role-panel-head"><h2><i class="bi bi-people"></i>角色列表</h2><div><button type="button" data-role-add title="添加角色"><i class="bi bi-plus-circle"></i><span>添加</span></button><button type="button" data-role-delete title="删除角色"><i class="bi bi-trash"></i><span>删除</span></button></div></div><label class="dm-role-search"><input type="text" value="' + escapeHtml(state.systemRoleKeyword) + '" maxlength="50" placeholder="请输入角色名称，最多50个字符" data-role-search><i class="bi bi-search"></i></label>' + (state.systemRoleAdding ? '<div class="dm-role-add-row"><input type="text" maxlength="50" placeholder="请输入角色名称" data-role-new-name><button type="button" data-role-add-save title="保存"><i class="bi bi-check-lg"></i><span>保存</span></button><button type="button" data-role-add-cancel title="取消"><i class="bi bi-x-lg"></i><span>取消</span></button></div>' : '') + '<div class="dm-role-list">' + roles.map(function (role) { return '<button type="button" class="' + (role.id === state.systemRoleSelectedId ? 'active' : '') + '" data-role-select="' + role.id + '"><span><i class="bi bi-person-badge"></i>' + escapeHtml(role.name) + '</span><small>' + escapeHtml(role.description) + '</small></button>'; }).join('') + '</div></aside><section class="dm-role-permission"><div class="dm-role-title"><div><h2>功能权限</h2><p>' + (selectedRole ? escapeHtml(selectedRole.name + '：' + selectedRole.description) : '请选择角色') + '</p></div><button type="button" class="dm-dir-btn primary" data-role-permission-save><i class="bi bi-save"></i>保存</button></div><div class="dm-permission-tree">' + permissionTreeHtml(selectedRole) + '</div></section></div></main></div>';
  }

  function systemConfigViewHtml() {
    var standard = state.systemConfigMode === 'standard';
    return '<div class="dm-system-page">' + systemBreadcrumbHtml('系统配置') + '<main class="dm-system-main"><form class="dm-config-form" data-system-config-form><section class="dm-config-section"><h2><i class="bi bi-image"></i>Logo+名称</h2><div class="dm-config-row"><label><span><em>*</em>配置方式</span><select name="mode" data-system-config-mode><option value="standard" ' + (standard ? 'selected' : '') + '>标准配置</option><option value="custom" ' + (!standard ? 'selected' : '') + '>自定义配置</option></select></label></div><div class="dm-config-logo-row"><div class="dm-config-field"><span><em>*</em>Logo</span><div><input type="file" accept="image/png" hidden data-system-logo-file><button type="button" class="dm-dir-btn" data-system-logo-upload><i class="bi bi-upload"></i>上传</button><button type="button" class="dm-dir-btn" data-system-logo-default><i class="bi bi-arrow-counterclockwise"></i>恢复默认</button><small>图片尺寸60×60px，5MB以内，png格式</small></div></div><div class="dm-config-preview logo"><span>预览</span><div><img src="img/logo.png" alt="Logo预览"><strong>' + escapeHtml(standard ? state.systemConfigName : '数据目录') + '</strong></div></div></div>' + (standard ? '<div class="dm-config-row"><label><span><em>*</em>名称</span><input name="siteName" maxlength="12" value="' + escapeHtml(state.systemConfigName) + '" placeholder="最多可输入12个字符" data-system-config-name></label><div class="dm-config-live-name"><span>预览</span><strong data-system-config-name-preview>' + escapeHtml(state.systemConfigName) + '</strong></div></div>' : '') + '</section><section class="dm-config-section"><h2><i class="bi bi-layout-text-window-reverse"></i>页面底部说明</h2><div class="dm-config-footer-fields"><label><span><em>*</em>说明1</span><input name="footer1" value="' + escapeHtml(state.systemConfigFooter1) + '" data-system-footer="1"></label><label><span><em>*</em>说明2</span><input name="footer2" value="' + escapeHtml(state.systemConfigFooter2) + '" data-system-footer="2"></label><label><span><em>*</em>说明3</span><input name="footer3" value="' + escapeHtml(state.systemConfigFooter3) + '" data-system-footer="3"></label></div><div class="dm-config-footer-preview"><span>预览</span><strong data-system-footer-preview="1">' + escapeHtml(state.systemConfigFooter1) + '</strong><p data-system-footer-preview="2">' + escapeHtml(state.systemConfigFooter2) + '</p><small data-system-footer-preview="3">' + escapeHtml(state.systemConfigFooter3) + '</small></div></section><div class="dm-config-actions"><button type="submit" class="dm-dir-btn primary"><i class="bi bi-save"></i>保存</button></div></form></main></div>';
  }

  function getFilteredOperationLogs() {
    var keyword = state.operationKeyword.toLowerCase();
    return OPERATION_LOGS.filter(function (item) {
      var text = [item.account, item.name, item.module, item.content, item.error, item.uri, item.ip].join(' ').toLowerCase();
      return item.createdAt >= state.operationStart && item.createdAt <= state.operationEnd && (state.operationModule === 'all' || item.module === state.operationModule) && (state.operationType === 'all' || item.type === state.operationType) && (!keyword || text.indexOf(keyword) > -1);
    }).sort(function (a, b) { return b.createdAt.localeCompare(a.createdAt); });
  }

  function operationDateRangeHtml() {
    if (DP.datePicker && DP.datePicker.render) return DP.datePicker.render({ mode: 'range', output: 'datetime', start: state.operationStart, end: state.operationEnd, startAttrs: { 'data-operation-date': 'start' }, endAttrs: { 'data-operation-date': 'end' } });
    return '<span class="dm-date-fallback">' + state.operationStart + ' 至 ' + state.operationEnd + '</span>';
  }

  function operationLogTableHtml() {
    var list = getFilteredOperationLogs();
    var total = list.length;
    var pages = Math.max(1, Math.ceil(total / state.operationPageSize));
    if (state.operationPage > pages) state.operationPage = pages;
    var start = (state.operationPage - 1) * state.operationPageSize;
    var pageItems = list.slice(start, start + state.operationPageSize);
    var rows = pageItems.map(function (item) { return '<tr><td>' + escapeHtml(item.account) + '</td><td>' + escapeHtml(item.name) + '</td><td>' + escapeHtml(item.module) + '</td><td><span class="dm-log-type ' + item.type + '">' + (item.type === 'normal' ? '正常日志' : '错误日志') + '</span></td><td>' + escapeHtml(item.method) + '</td><td>' + escapeHtml(item.content) + '</td><td>' + escapeHtml(item.error) + '</td><td>' + escapeHtml(item.uri) + '</td><td>' + escapeHtml(item.agent) + '</td><td>' + escapeHtml(item.ip) + '</td><td>' + escapeHtml(item.createdAt) + '</td></tr>'; }).join('');
    var buttons = '';
    for (var i = 1; i <= pages; i += 1) buttons += '<button type="button" class="dm-page-num ' + (state.operationPage === i ? 'active' : '') + '" data-operation-page="' + i + '">' + i + '</button>';
    return '<div class="dm-system-table-scroll dm-log-table-scroll"><table class="dm-system-table dm-log-table"><thead><tr><th>用户账号</th><th>用户姓名</th><th>操作模块</th><th>日志类型</th><th>操作方式</th><th>操作内容</th><th>异常信息</th><th>请求URI</th><th>用户代理</th><th>操作IP地址</th><th>创建时间</th></tr></thead><tbody>' + (rows || '<tr><td colspan="11"><div class="dm-result-empty"><i class="bi bi-inbox"></i><strong>暂无匹配日志</strong><span>请调整时间或查询条件</span></div></td></tr>') + '</tbody></table></div><div class="dm-directory-pagination"><span>共 ' + total + ' 条</span><div class="dm-page-buttons"><button type="button" class="dm-page-arrow" data-operation-page="' + (state.operationPage - 1) + '" ' + (state.operationPage === 1 ? 'disabled' : '') + '><i class="bi bi-chevron-left"></i></button>' + buttons + '<button type="button" class="dm-page-arrow" data-operation-page="' + (state.operationPage + 1) + '" ' + (state.operationPage === pages ? 'disabled' : '') + '><i class="bi bi-chevron-right"></i></button><select class="dm-page-size" data-operation-page-size><option value="10" ' + (state.operationPageSize === 10 ? 'selected' : '') + '>10 条/页</option><option value="20" ' + (state.operationPageSize === 20 ? 'selected' : '') + '>20 条/页</option></select><label class="dm-page-jump">跳至<input type="number" min="1" max="' + pages + '" data-operation-page-jump>页</label></div></div>';
  }

  function systemOperationLogViewHtml() {
    return '<div class="dm-system-page">' + systemBreadcrumbHtml('操作日志') + '<main class="dm-system-main"><section class="dm-operation-filters"><div class="dm-operation-time"><span>时间</span><label><input type="radio" name="operationPeriod" value="1" data-operation-period ' + (state.operationPeriod === '1' ? 'checked' : '') + '>近1天</label><label><input type="radio" name="operationPeriod" value="7" data-operation-period ' + (state.operationPeriod === '7' ? 'checked' : '') + '>近7天</label><label><input type="radio" name="operationPeriod" value="30" data-operation-period ' + (state.operationPeriod === '30' ? 'checked' : '') + '>近30天</label><div class="dm-operation-date">' + operationDateRangeHtml() + '</div></div><div class="dm-operation-query"><label><span>操作模块</span><select data-operation-module><option value="all">请选择</option><option ' + (state.operationModule === '首页' ? 'selected' : '') + '>首页</option><option ' + (state.operationModule === '数据地图' ? 'selected' : '') + '>数据地图</option><option ' + (state.operationModule === '个人中心' ? 'selected' : '') + '>个人中心</option><option ' + (state.operationModule === '运行监控' ? 'selected' : '') + '>运行监控</option><option ' + (state.operationModule === '系统管理' ? 'selected' : '') + '>系统管理</option></select></label><label><span>日志类型</span><select data-operation-type><option value="all">请选择</option><option value="normal" ' + (state.operationType === 'normal' ? 'selected' : '') + '>正常日志</option><option value="error" ' + (state.operationType === 'error' ? 'selected' : '') + '>错误日志</option></select></label><div class="dm-system-search"><input type="text" value="' + escapeHtml(state.operationDraftKeyword) + '" placeholder="请输入关键字查询" aria-label="操作日志关键字"><button type="button" class="dm-dir-btn primary" data-operation-search><i class="bi bi-search"></i>查询</button></div></div></section>' + operationLogTableHtml() + '</main></div>';
  }

  function openSystemAuditProcess() {
    var selected = Object.keys(state.systemAuditSelected).filter(function (id) { return state.systemAuditSelected[id]; }).map(findManagementItem).filter(Boolean);
    var eligible = selected.filter(function (item) { return item.auditStatus === 'up-pending' || item.auditStatus === 'down-pending'; });
    if (!selected.length) { showToast('请先选择需要处理的数据'); return; }
    if (!eligible.length) { showToast('所选数据当前无需审核处理'); return; }
    document.querySelector('.page-data-map').insertAdjacentHTML('beforeend', '<div class="dm-modal-mask" role="dialog" aria-modal="true" aria-label="审核 - 批量处理"><form class="dm-modal dm-system-audit-process-modal" data-system-audit-process-form data-system-audit-ids="' + eligible.map(function (item) { return item.id; }).join(',') + '"><div class="dm-modal-head"><h3>审核 - 批量处理</h3><button type="button" data-modal-close aria-label="关闭"><i class="bi bi-x-lg"></i></button></div><div class="dm-modal-body"><div class="dm-system-audit-selected"><i class="bi bi-info-circle"></i>已选择 ' + eligible.length + ' 条数据</div><label class="dm-form-item"><span><em>*</em>处理意见</span><select name="decision" required><option value="">请选择</option><option value="approved">通过</option><option value="rejected">驳回</option></select></label><div class="dm-system-audit-comment-field"><div class="dm-textarea-wrap"><textarea name="comment" rows="5" maxlength="200" aria-label="处理意见说明" data-system-audit-comment></textarea><small data-system-audit-comment-count>0 / 200</small></div></div></div><div class="dm-modal-foot"><button type="button" class="dm-dir-btn" data-modal-close><i class="bi bi-x-circle"></i>取消</button><button type="submit" class="dm-dir-btn primary"><i class="bi bi-check2-circle"></i>确定</button></div></form></div>');
  }

  function openCallLog(item) {
    if (!item) return;
    if (!DP.logViewer) { showToast('公共日志查看器未加载'); return; }
    var monitorItem = findMonitorItem(item.monitorId);
    var failed = item.status === 'failed';
    var requestId = 'CALL' + String(item.id) + item.calledAt.replace(/[-: ]/g, '').slice(2);
    var endpoint = monitorItem ? monitorItem.endpoint : 'https://api.datamap.local/share-api';
    var lines = [
      '[' + item.calledAt + '.018] INFO  ApiGateway - request received, requestId=' + requestId,
      '[' + item.calledAt + '.026] INFO  AccessAuth - account=' + item.account + ', application=' + item.app + ', authentication=passed',
      '[' + item.calledAt + '.041] INFO  RouteService - endpoint=' + endpoint,
      '[' + item.calledAt + '.058] INFO  RequestContext - method=POST, clientIp=10.20.16.35, contentType=application/json',
      '[' + item.calledAt + '.076] INFO  ServiceInvoke - resource=' + (monitorItem ? monitorItem.englishName : 'shared_resource') + ', version=' + (monitorItem ? monitorItem.version : 'V1.0'),
      '[' + item.calledAt + '.094] ' + (failed ? 'ERROR' : 'INFO ') + ' ResponseHandler - status=' + (failed ? 'FAILED' : 'SUCCESS') + ', responseTime=' + item.response + ', message=' + item.message,
      '[' + item.calledAt + '.102] INFO  AccessLog - requestId=' + requestId + ', completed=true'
    ];
    DP.logViewer.open({
      title: '调用日志',
      subtitle: monitorItem ? monitorItem.name : '数据接口调用',
      fileName: '接口调用日志_' + requestId + '.log',
      content: lines.join('\n'),
      meta: [
        { label: '调用时间', value: item.calledAt },
        { label: '调用应用', value: item.app },
        { label: '调用用户', value: item.account },
        { label: '响应时间', value: item.response },
        { label: '调用状态', value: failed ? '返回失败' : '返回成功', tone: failed ? 'danger' : 'success' }
      ]
    });
  }

  function openApplicationForm() {
    document.querySelector('.page-data-map').insertAdjacentHTML('beforeend', '<div class="dm-modal-mask" role="dialog" aria-modal="true" aria-label="新建应用"><form class="dm-modal dm-app-form-modal" data-app-form><div class="dm-modal-head"><h3>新建</h3><button type="button" data-modal-close aria-label="关闭"><i class="bi bi-x-lg"></i></button></div><div class="dm-modal-body">' +
      '<label class="dm-form-item"><span><em>*</em>名称</span><input name="name" maxlength="50" placeholder="请输入应用名称" required></label>' +
      '<div class="dm-form-item dm-app-permission"><span>权限</span><div><label><input type="checkbox" checked disabled>认证密钥</label><label><input type="checkbox" name="decryptEnabled">解密密钥</label></div></div>' +
      '<label class="dm-form-item"><span><em>*</em>简介</span><div class="dm-textarea-wrap"><textarea name="description" rows="4" maxlength="500" placeholder="500字符以内" required data-app-count></textarea><small>0 / 500</small></div></label>' +
      '<label class="dm-form-item"><span><em>*</em>申请理由</span><div class="dm-textarea-wrap"><textarea name="reason" rows="4" maxlength="500" placeholder="500字符以内" required data-app-count></textarea><small>0 / 500</small></div></label></div>' +
      '<div class="dm-modal-foot"><button type="button" class="dm-dir-btn" data-modal-close><i class="bi bi-x-circle"></i>取消</button><button type="submit" class="dm-dir-btn primary" data-app-submit="apply"><i class="bi bi-send"></i>保存并申请</button><button type="submit" class="dm-dir-btn" data-app-submit="save"><i class="bi bi-save"></i>保存</button></div></form></div>');
  }

  function openPasswordForm() {
    document.querySelector('.page-data-map').insertAdjacentHTML('beforeend', '<div class="dm-modal-mask" role="dialog" aria-modal="true" aria-label="修改密码"><form class="dm-modal dm-password-modal" data-password-form><div class="dm-modal-head"><h3>提示</h3><button type="button" data-modal-close aria-label="关闭"><i class="bi bi-x-lg"></i></button></div><div class="dm-modal-body"><label class="dm-form-item"><span><em>*</em>原始密码</span><input name="oldPassword" type="password" required></label><label class="dm-form-item"><span><em>*</em>新密码</span><input name="newPassword" type="password" minlength="8" maxlength="16" pattern="(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}" placeholder="8-16个字符，含数字、大小写英文和符号" required></label><label class="dm-form-item"><span><em>*</em>确认密码</span><input name="confirmPassword" type="password" minlength="8" maxlength="16" required></label></div><div class="dm-modal-foot"><button type="button" class="dm-dir-btn" data-modal-close><i class="bi bi-x-circle"></i>取消</button><button type="submit" class="dm-dir-btn primary"><i class="bi bi-check2-circle"></i>确定</button></div></form></div>');
  }

  function openAppConfirm(item, action) {
    if (!item) return;
    var changeKey = action === 'change-key';
    var message = changeKey ? '更换后原 app_Key 将立即失效，是否确认更换？' : '下架后该应用将无法继续调用数据接口，是否确认下架？';
    document.querySelector('.page-data-map').insertAdjacentHTML('beforeend', '<div class="dm-modal-mask" role="dialog" aria-modal="true" aria-label="' + (changeKey ? '更换密钥' : '应用下架') + '"><div class="dm-modal dm-confirm-modal"><div class="dm-modal-head"><h3>提示</h3><button type="button" data-modal-close aria-label="关闭"><i class="bi bi-x-lg"></i></button></div><div class="dm-modal-body"><div class="dm-confirm-message"><i class="bi bi-exclamation-circle"></i><p><strong>' + escapeHtml(item.name) + '</strong><span>' + message + '</span></p></div></div><div class="dm-modal-foot"><button type="button" class="dm-dir-btn" data-modal-close><i class="bi bi-x-circle"></i>取消</button><button type="button" class="dm-dir-btn primary" data-confirm-app-action="' + action + '" data-app-id="' + item.id + '"><i class="bi bi-check2-circle"></i>确定</button></div></div></div>');
  }

  function auditModalSummaryHtml(item) {
    if (item.type === 'app') return '';
    var resource = findResource(item.resourceId);
    return '<section class="dm-audit-resource-summary"><h4>' + escapeHtml(item.objectName) + (resource ? '【' + escapeHtml(resource.version) + '】' : '') + '</h4><div class="dm-audit-resource-meta"><span>数据类型：<strong>' + escapeHtml(item.resourceType) + '</strong></span><span>数据分类：<strong>' + escapeHtml(item.category) + '</strong></span><span>发布日期：<strong>' + escapeHtml(resource ? resource.releasedAt.split(' ')[0] : item.appliedAt.split(' ')[0]) + '</strong></span><span>更新频率：<strong>' + escapeHtml(item.frequency) + '</strong></span></div><p>数据简介：' + escapeHtml(item.description) + '</p></section>';
  }

  function auditReadonlyRow(label, value, className) {
    return '<div class="dm-audit-form-row ' + (className || '') + '"><span>' + label + '：</span><div class="dm-audit-readonly-control">' + escapeHtml(value) + '</div></div>';
  }

  function auditDbPermissionHtml(item) {
    var resource = findResource(item.resourceId);
    var profile = resource ? getFieldProfile(resource) : item.objectName.indexOf('工单') > -1 ? FIELD_PROFILES.service : FIELD_PROFILES.inventory;
    var selected = item.fields || [];
    var rows = profile.fields.map(function (field) {
      var checked = selected.indexOf(field[0]) > -1;
      return '<tr><td class="check"><input type="checkbox" disabled ' + (checked ? 'checked' : '') + ' aria-label="' + (checked ? '已选择' : '未选择') + escapeHtml(field[1]) + '"></td>' + field.map(function (value) { return '<td>' + escapeHtml(value || '否') + '</td>'; }).join('') + '</tr>';
    }).join('');
    return '<section class="dm-audit-db-permissions"><h4>数据项权限：<span>（' + selected.length + '/' + profile.fields.length + '）</span></h4><div class="dm-data-table-scroll"><table class="dm-detail-table fields"><thead><tr><th class="check"><input type="checkbox" disabled ' + (selected.length === profile.fields.length ? 'checked' : '') + ' aria-label="全选数据项"></th><th>英文名称</th><th>别名</th><th>是否主键</th><th>数据类型</th><th>长度</th><th>精度</th><th>描述</th></tr></thead><tbody>' + rows + '</tbody></table></div></section>';
  }

  function auditApplicationBodyHtml(item) {
    if (item.type === 'app') {
      return '<section class="dm-audit-type-form dm-audit-app-form">' + auditReadonlyRow('名称', item.objectName) + auditReadonlyRow('简介', item.description, 'textarea') + auditReadonlyRow('申请理由', item.reason, 'textarea') + '</section>';
    }
    if (item.type === 'db') {
      return '<section class="dm-audit-type-form">' + auditReadonlyRow('使用期限', item.period) + auditReadonlyRow('审核人员', item.reviewer || '张璐') + auditReadonlyRow('申请理由', item.reason, 'textarea') + '</section>' + auditDbPermissionHtml(item);
    }
    if (item.resourceType === '数据集') {
      return '<section class="dm-audit-type-form">' + auditReadonlyRow('使用期限', item.period) + auditReadonlyRow('使用应用', item.application) + auditReadonlyRow('审核人员', item.reviewer || '张璐') + auditReadonlyRow('申请理由', item.reason, 'textarea') + '</section>';
    }
    var scopes = (item.scopes || []).map(function (scope) { return '<li><span>' + escapeHtml(scope) + '</span><i class="bi bi-check-lg"></i></li>'; }).join('');
    return '<section class="dm-audit-api-form"><div class="dm-audit-type-form">' + auditReadonlyRow('使用限制', item.useLimit) + auditReadonlyRow('调用频率', item.callFrequency) + auditReadonlyRow('审核人员', item.reviewer || '张璐') + auditReadonlyRow('使用期限', item.period) + (item.totalTimes ? auditReadonlyRow('使用次数', item.totalTimes) : '') + '</div><div class="dm-audit-scope"><h4>数据范围：</h4><ul>' + scopes + '</ul></div></section><section class="dm-audit-type-form dm-audit-api-extra">' + auditReadonlyRow('申请IP', item.ip) + auditReadonlyRow('申请理由', item.reason, 'textarea') + '</section>';
  }

  function auditHistoryHtml(item) {
    var actionName = item.resourceType === '应用申请' ? '应用申请' : item.resourceType + '申请';
    var rows = '<tr><td>' + item.appliedAt + '</td><td>' + escapeHtml(item.applicant) + '</td><td>开始-提交申请</td><td>处理意见：提交' + escapeHtml(actionName) + '</td></tr>';
    if (item.status === 'pending') {
      rows += '<tr><td>' + item.appliedAt + '</td><td>' + escapeHtml(item.reviewer || '张璐') + '</td><td>信息中心审核-待处理</td><td>处理意见：等待审核</td></tr>';
    } else {
      rows += '<tr><td>' + item.completedAt + '</td><td>' + escapeHtml(item.operator || item.reviewer || '审核人员') + '</td><td>信息中心审核-' + (item.status === 'approved' ? '审核通过' : '审核驳回') + '</td><td>处理意见：' + escapeHtml(item.decision || (item.status === 'approved' ? '同意申请' : '驳回申请')) + '</td></tr>';
      if (item.status === 'approved') rows += '<tr><td>' + item.completedAt + '</td><td>' + escapeHtml(item.operator || item.reviewer || '实施人员') + '</td><td>实施人员处理-处理完成</td><td>处理意见：授权已生效</td></tr>';
    }
    return '<section class="dm-audit-history"><h4>审核记录</h4><div class="dm-data-table-scroll"><table class="dm-detail-table"><thead><tr><th>时间</th><th>操作者</th><th>操作内容</th><th>备注</th></tr></thead><tbody>' + rows + '</tbody></table></div></section>';
  }

  function auditDecisionFormHtml(item, batchCount) {
    if (batchCount > 1) {
      return '<div class="dm-audit-batch-count">已选择<strong>' + batchCount + '</strong>条记录</div><label class="dm-form-item dm-audit-decision-select"><span>处理意见：</span><select name="decision"><option value="approved" selected>通过</option><option value="rejected">驳回</option></select></label><label class="dm-form-item dm-audit-comment-only"><span class="sr-only">处理意见说明</span><div class="dm-textarea-wrap"><textarea name="comment" rows="5" maxlength="500" required data-audit-comment placeholder="500字符以内"></textarea></div></label>';
    }
    return '<section class="dm-audit-process-section"><div class="dm-audit-process-top"><div><span>申请人员：</span><strong>' + escapeHtml(item.applicant) + '</strong></div><label><span>处理意见：</span><select name="decision"><option value="approved" selected>通过</option><option value="rejected">驳回</option></select></label></div><div class="dm-textarea-wrap"><textarea name="comment" rows="4" maxlength="500" required data-audit-comment placeholder="500字符以内"></textarea></div><label class="dm-audit-next-handler"><span>下一步处理：</span><input name="nextHandler" list="dmAuditHandlers" placeholder="请选择或搜索处理人" required><datalist id="dmAuditHandlers"><option value="张璐"><option value="刘明"><option value="陈燕"><option value="王强"><option value="赵敏"><option value="孙伟"><option value="周婷"><option value="吴昊"><option value="郑欣"><option value="冯涛"><option value="陈晨"><option value="何志鹏"></datalist></label></section>';
  }

  function openAuditRecord(item) {
    if (!item) return;
    document.querySelector('.page-data-map').insertAdjacentHTML('beforeend', '<div class="dm-modal-mask" role="dialog" aria-modal="true" aria-label="审核记录"><div class="dm-modal dm-audit-record-modal"><div class="dm-modal-head"><h3>审核记录</h3><button type="button" data-modal-close aria-label="关闭"><i class="bi bi-x-lg"></i></button></div><div class="dm-modal-body">' + auditModalSummaryHtml(item) + auditApplicationBodyHtml(item) + auditHistoryHtml(item) + '</div><div class="dm-modal-foot"><button type="button" class="dm-dir-btn primary" data-modal-close><i class="bi bi-x-circle"></i>关闭</button></div></div></div>');
  }

  function openAuditProcess(items) {
    if (!items.length) { showToast('请先选择待处理的审核任务'); return; }
    var isBatch = items.length > 1;
    var content = isBatch ? auditDecisionFormHtml(null, items.length) : auditModalSummaryHtml(items[0]) + auditApplicationBodyHtml(items[0]) + auditDecisionFormHtml(items[0], 1);
    document.querySelector('.page-data-map').insertAdjacentHTML('beforeend', '<div class="dm-modal-mask" role="dialog" aria-modal="true" aria-label="' + (isBatch ? '批量处理' : '审核处理') + '"><form class="dm-modal dm-audit-process-modal ' + (isBatch ? 'is-batch' : '') + '" data-audit-process-form data-audit-ids="' + items.map(function (item) { return item.id; }).join(',') + '"><div class="dm-modal-head"><h3>' + (isBatch ? '批量处理' : '审核处理') + '</h3><button type="button" data-modal-close aria-label="关闭"><i class="bi bi-x-lg"></i></button></div><div class="dm-modal-body">' + content + '</div><div class="dm-modal-foot"><button type="submit" class="dm-dir-btn primary"><i class="bi bi-check2-circle"></i>确定</button><button type="button" class="dm-dir-btn" data-modal-close><i class="bi bi-x-circle"></i>取消</button></div></form></div>');
  }

  function setActiveMenu(menuName, dropdownItem) {
    document.querySelectorAll('.dm-nav-link').forEach(function (item) { item.classList.toggle('active', item.dataset.dmMenu === menuName); });
    document.querySelectorAll('.dm-dropdown button').forEach(function (item) { item.classList.toggle('active', item === dropdownItem); });
  }

  function rememberCurrentView() {
    if (!DP.rememberRoute) return;
    var opts = { dmView: state.view, dmHomeTab: state.homeTab };
    if (state.view === 'audit-center') opts.dmAuditTab = state.auditTab;
    if (state.view === 'messages') opts.dmMessageTab = state.messageTab;
    if (state.view === 'detail') {
      opts.dmResource = state.detailResourceId;
      opts.dmDetailTab = state.detailTab;
      opts.dmOrigin = state.detailOrigin;
    } else if (state.view === 'api-test') {
      opts.dmResource = state.testResourceId;
    } else if (state.view === 'api-monitor-detail') {
      opts.dmMonitorId = state.monitorDetailId;
      opts.dmMonitorOrigin = state.monitorDetailOrigin;
    } else if (state.view === 'data-management-edit') {
      opts.dmManagementId = state.managementEditId;
      opts.dmManagementTab = state.managementEditTab;
    } else if (state.view === 'system-audit-detail') {
      opts.dmSystemAuditId = state.systemAuditDetailId;
      opts.dmSystemAuditTab = state.systemAuditDetailTab;
    }
    DP.rememberRoute('datamap-home', '', opts);
  }

  function renderView() {
    var root = document.querySelector('.dm-view-root');
    if (!root) return;
    root.innerHTML = state.view === 'system-operation-log' ? systemOperationLogViewHtml() : state.view === 'system-config' ? systemConfigViewHtml() : state.view === 'system-role-management' ? systemRoleManagementViewHtml() : state.view === 'system-user-management' ? systemUserManagementViewHtml() : state.view === 'system-audit-detail' ? systemAuditDetailViewHtml() : state.view === 'system-audit-center' ? systemAuditCenterViewHtml() : state.view === 'data-management-edit' ? dataManagementEditViewHtml() : state.view === 'data-management' ? dataManagementViewHtml() : state.view === 'api-monitor-detail' ? apiMonitorDetailViewHtml() : state.view === 'application-records' ? applicationRecordsViewHtml() : state.view === 'api-monitor' ? apiMonitorViewHtml() : state.view === 'audit-center' ? auditCenterViewHtml() : state.view === 'applications' ? applicationsViewHtml() : state.view === 'account-info' ? accountInfoViewHtml() : state.view === 'messages' ? messagesViewHtml() : state.view === 'api-test' ? apiTestViewHtml() : state.view === 'detail' ? detailViewHtml() : state.view === 'favorites' ? favoritesViewHtml() : state.view === 'my-data' ? myDataViewHtml() : state.view === 'directory' ? directoryViewHtml() : homeViewHtml();
    enhanceBreadcrumbLinks(root);
    if (state.view === 'data-management-edit') enhanceManagementCategoryPicker(root);
    var myDataActive = state.view === 'my-data' || state.detailOrigin === 'my-data' && (state.view === 'detail' || state.view === 'api-test');
    var favoritesActive = state.view === 'favorites' || state.detailOrigin === 'favorites' && state.view === 'detail';
    var personalView = state.view === 'audit-center' ? 'audit-center' : state.view === 'applications' ? 'applications' : state.view === 'account-info' ? 'account-info' : state.view === 'messages' ? 'messages' : favoritesActive ? 'favorites' : myDataActive ? 'my-data' : '';
    var personalItem = personalView ? document.querySelector('[data-personal-view="' + personalView + '"]') : null;
    var monitorView = state.view === 'application-records' ? 'application-records' : state.view === 'api-monitor' || state.view === 'api-monitor-detail' ? 'api-monitor' : '';
    var monitorItem = monitorView ? document.querySelector('[data-monitor-view="' + monitorView + '"]') : null;
    var systemView = state.view === 'data-management' || state.view === 'data-management-edit' ? 'data-management' : state.view === 'system-audit-center' || state.view === 'system-audit-detail' ? 'system-audit-center' : ['system-user-management', 'system-role-management', 'system-config', 'system-operation-log'].indexOf(state.view) > -1 ? state.view : '';
    var systemItem = systemView ? document.querySelector('[data-system-view="' + systemView + '"]') : null;
    setActiveMenu(state.view === 'home' ? '首页' : personalView ? '个人中心' : monitorView ? '运行监控' : systemView ? '系统管理' : '数据地图', personalItem || monitorItem || systemItem);
    rememberCurrentView();
  }

  function refreshDirectoryResults() {
    var results = document.querySelector('.dm-directory-results');
    if (results) results.innerHTML = state.view === 'favorites' ? favoriteResultPanelHtml() : state.view === 'my-data' ? myDataResultPanelHtml() : resultPanelHtml();
  }

  function findResource(id) {
    return DIRECTORY_RESOURCES.concat(MY_DATA_RESOURCES).find(function (item) { return item.id === Number(id); });
  }

  function closeModal() {
    var modal = document.querySelector('.dm-modal-mask');
    if (modal) modal.remove();
  }

  function applySummaryHtml(item) {
    var meta = TYPE_META[item.type];
    return '<div class="dm-apply-summary"><strong>' + escapeHtml(item.title) + '【' + item.version + '】</strong><p>数据简介：' + escapeHtml(item.description) + '</p><ul><li>数据类型：' + meta.label + '</li><li>数据分类：' + escapeHtml(item.category) + '</li><li>上架时间：' + item.releasedAt + '</li><li>更新频率：' + item.frequency + '</li></ul></div>';
  }

  function dateRangeHtml(prefix) {
    if (DP.datePicker && DP.datePicker.render) {
      return DP.datePicker.render({ mode: 'range', output: 'datetime', label: '使用期限', start: '2026-09-22 00:00:00', end: '2027-09-21 23:59:59', startAttrs: { 'data-dm-apply-date': prefix + '-start' }, endAttrs: { 'data-dm-apply-date': prefix + '-end' } });
    }
    return '<span class="dm-date-fallback">2026-09-22 至 2027-09-21</span>';
  }

  function reviewerOptions() {
    return '<option value="">请选择</option><option value="zhanglu">张璐</option><option value="liuming">刘明</option><option value="chenyan">陈燕</option><option value="wangqiang">王强</option>';
  }

  function reasonFieldHtml() {
    return '<label class="dm-form-item"><span><em>*</em>申请理由</span><div class="dm-textarea-wrap"><textarea name="reason" rows="4" maxlength="200" placeholder="200个字符以内" required data-apply-reason>用于数据治理平台业务分析与数据核验。</textarea><small data-reason-count>18 / 200</small></div></label>';
  }

  function apiLimitFieldsHtml() {
    var needsTerm = state.apiLimit === 'term' || state.apiLimit === 'both';
    var needsTimes = state.apiLimit === 'times' || state.apiLimit === 'both';
    return (needsTerm ? '<div class="dm-form-item"><span><em>*</em>使用期限</span>' + dateRangeHtml('api') + '</div>' : '') +
      '<label class="dm-form-item"><span><em>*</em>调用频率</span><div class="dm-inline-control"><input name="frequency" type="number" min="1" value="100" required><select name="frequencyUnit" required><option value="">请选择</option><option>次/秒</option><option>次/分</option><option>次/时</option><option selected>次/日</option></select></div></label>' +
      (needsTimes ? '<label class="dm-form-item"><span><em>*</em>使用次数</span><input name="totalTimes" type="number" min="1" value="5000" required></label>' : '');
  }

  function openApiApply(item) {
    var title = item.type === 'orchestration' ? 'API编排申请' : 'API接口申请';
    document.querySelector('.page-data-map').insertAdjacentHTML('beforeend', '<div class="dm-modal-mask" role="dialog" aria-modal="true" aria-label="' + title + '"><form class="dm-modal dm-apply-modal" data-apply-form data-apply-kind="' + state.applyMode + '" data-resource-id="' + item.id + '"><div class="dm-modal-head"><h3>' + title + '</h3><button type="button" data-modal-close aria-label="关闭"><i class="bi bi-x-lg"></i></button></div><div class="dm-modal-body">' + applySummaryHtml(item) +
      '<label class="dm-form-item"><span><em>*</em>使用限制</span><select name="useLimit" data-api-limit required><option value="term" ' + (state.apiLimit === 'term' ? 'selected' : '') + '>使用期限</option><option value="times" ' + (state.apiLimit === 'times' ? 'selected' : '') + '>使用次数</option><option value="both" ' + (state.apiLimit === 'both' ? 'selected' : '') + '>使用期限+使用次数</option></select></label><div data-api-limit-fields>' + apiLimitFieldsHtml() + '</div>' +
      '<label class="dm-form-item"><span>审核人员</span><select name="reviewer">' + reviewerOptions() + '</select></label><label class="dm-form-item"><span>申请IP</span><input name="ip" type="text" value="10.20.16.35" placeholder="多个IP用英文分号隔开，*不限制"></label>' + reasonFieldHtml() + '</div><div class="dm-modal-foot"><button type="button" class="dm-dir-btn" data-modal-close><i class="bi bi-x-circle"></i>取消</button><button type="submit" class="dm-dir-btn primary"><i class="bi bi-check2-circle"></i>确定</button></div></form></div>');
  }

  function openDatasetApply(item) {
    document.querySelector('.page-data-map').insertAdjacentHTML('beforeend', '<div class="dm-modal-mask" role="dialog" aria-modal="true" aria-label="数据集申请"><form class="dm-modal dm-apply-modal" data-apply-form data-apply-kind="' + state.applyMode + '" data-resource-id="' + item.id + '"><div class="dm-modal-head"><h3>数据集申请</h3><button type="button" data-modal-close aria-label="关闭"><i class="bi bi-x-lg"></i></button></div><div class="dm-modal-body">' + applySummaryHtml(item) +
      '<div class="dm-form-item"><span><em>*</em>使用期限</span>' + dateRangeHtml('dataset') + '</div><label class="dm-form-item"><span><em>*</em>使用应用</span><select name="application" required><option value="">请选择</option><option selected>数据治理运营分析</option><option>城市运行监测</option><option>企业综合服务</option></select></label>' +
      '<label class="dm-form-item"><span>审核人员</span><select name="reviewer">' + reviewerOptions() + '</select></label><label class="dm-form-item"><span>申请IP</span><input name="ip" type="text" value="10.20.16.35" placeholder="多个IP用英文分号隔开，*不限制"></label>' + reasonFieldHtml() + '</div><div class="dm-modal-foot"><button type="button" class="dm-dir-btn" data-modal-close><i class="bi bi-x-circle"></i>取消</button><button type="submit" class="dm-dir-btn primary"><i class="bi bi-check2-circle"></i>确定</button></div></form></div>');
  }

  function openDatabaseApply(item) {
    var profile = getFieldProfile(item);
    document.querySelector('.page-data-map').insertAdjacentHTML('beforeend', '<div class="dm-modal-mask" role="dialog" aria-modal="true" aria-label="数据库表申请"><form class="dm-modal dm-db-apply-modal" data-apply-form data-apply-kind="' + state.applyMode + '" data-resource-id="' + item.id + '"><div class="dm-modal-head"><h3>数据库表申请</h3><button type="button" data-modal-close aria-label="关闭"><i class="bi bi-x-lg"></i></button></div><div class="dm-modal-body">' +
      '<div class="dm-db-apply-intro"><h4>' + escapeHtml(item.title) + '［' + item.version + '］</h4><div><span>数据类型：数据库表</span><span>数据分类：' + escapeHtml(item.category) + '</span><span>发布日期：' + item.releasedAt.slice(0, 10) + '</span><span>更新频率：' + item.frequency + '</span></div><p>数据简介：' + escapeHtml(item.description) + '</p></div>' +
      '<div class="dm-db-form"><div class="dm-form-item"><span><em>*</em>使用期限</span>' + dateRangeHtml('db') + '</div><label class="dm-form-item"><span>审核人员</span><select name="reviewer"><option value="">请选择</option><option selected>张璐</option><option>刘明</option><option>陈燕</option></select></label>' + reasonFieldHtml() + '</div>' +
      '<div class="dm-permission-title"><span>数据项权限：</span><strong data-field-count>（' + profile.fields.length + '/' + profile.fields.length + '）</strong></div>' + fieldTableHtml(profile, true, true) + '</div><div class="dm-modal-foot"><button type="submit" class="dm-dir-btn primary"><i class="bi bi-check2-circle"></i>确定</button><button type="button" class="dm-dir-btn" data-modal-close><i class="bi bi-x-circle"></i>取消</button></div></form></div>');
  }

  function openTypeApply(item, mode) {
    if (!item) return;
    state.apiLimit = 'term';
    state.applyMode = mode === 'change' ? 'change' : 'apply';
    if (item.type === 'api' || item.type === 'orchestration') openApiApply(item);
    else if (item.type === 'dataset') openDatasetApply(item);
    else openDatabaseApply(item);
  }

  function handleClick(event) {
    var homeCard = event.target.closest('.dm-resource-card');
    if (homeCard) {
      showToast('已选中资源：' + (homeCard.dataset.resourceTitle || '数据资源'));
      return;
    }
    var target = event.target.closest('button, a');
    if (!target) return;
    if (target.matches('[data-breadcrumb-view]')) {
      event.preventDefault();
      state.view = target.dataset.breadcrumbView;
      renderView();
    } else if (target.matches('.dm-brand, [data-view="home"]')) {
      state.view = 'home';
      renderView();
    } else if (target.dataset.view === 'directory') {
      state.view = 'directory';
      renderView();
    } else if (target.dataset.personalView) {
      var personalGroup = target.closest('.dm-nav-group');
      if (personalGroup) personalGroup.classList.remove('open');
      if (target.dataset.personalView === 'my-data' || target.dataset.personalView === 'favorites') {
        state.view = target.dataset.personalView;
        state.catalogId = 'public';
        state.openCatalogs.public = true;
        state.treeKeyword = '';
        state.draftKeyword = '';
        state.keyword = '';
        state.type = 'all';
        state.page = 1;
        state.pageSize = 10;
      } else if (target.dataset.personalView === 'audit-center') {
        state.view = 'audit-center';
        state.auditTab = 'pending';
        state.auditStatus = 'all';
        state.auditType = 'all';
        state.auditDraftKeyword = '';
        state.auditKeyword = '';
        state.auditPage = 1;
        state.auditSelected = {};
      } else if (target.dataset.personalView === 'applications') {
        state.view = 'applications';
        state.appStatus = 'all';
        state.appDraftKeyword = '';
        state.appKeyword = '';
        state.appPage = 1;
      } else if (target.dataset.personalView === 'account-info') {
        state.view = 'account-info';
      } else if (target.dataset.personalView === 'messages') {
        state.view = 'messages';
        state.messageTab = 'unread';
        state.messagePage = 1;
      }
      renderView();
    } else if (target.dataset.monitorView) {
      var monitorGroup = target.closest('.dm-nav-group');
      if (monitorGroup) monitorGroup.classList.remove('open');
      state.view = target.dataset.monitorView;
      state.catalogId = 'public';
      state.openCatalogs.public = true;
      state.treeKeyword = '';
      if (state.view === 'api-monitor') {
        state.monitorType = 'api';
        state.monitorApp = 'all';
        state.monitorStatus = 'all';
        state.monitorDraftKeyword = '';
        state.monitorKeyword = '';
        state.monitorPage = 1;
      } else {
        state.recordType = 'all';
        state.recordDraftData = '';
        state.recordData = '';
        state.recordVersion = 'all';
        state.recordApp = 'all';
        state.recordStatus = 'all';
        state.recordDraftAccount = '';
        state.recordAccount = '';
        state.recordPage = 1;
      }
      renderView();
    } else if (target.dataset.systemView) {
      var systemGroup = target.closest('.dm-nav-group');
      if (systemGroup) systemGroup.classList.remove('open');
      state.catalogId = 'public';
      state.openCatalogs.public = true;
      state.treeKeyword = '';
      if (target.dataset.systemView === 'data-management') {
        state.view = 'data-management';
        state.managementTab = 'all';
        state.managementPublishStatus = 'all';
        state.managementAuditStatus = 'all';
        state.managementDraftKeyword = '';
        state.managementKeyword = '';
        state.managementPage = 1;
        state.managementSelected = {};
      } else if (target.dataset.systemView === 'system-audit-center') {
        state.view = 'system-audit-center';
        state.systemAuditTab = 'all';
        state.systemAuditPublishStatus = 'all';
        state.systemAuditStatus = 'all';
        state.systemAuditDraftKeyword = '';
        state.systemAuditKeyword = '';
        state.systemAuditPage = 1;
        state.systemAuditSelected = {};
      } else if (target.dataset.systemView === 'system-user-management') {
        state.view = 'system-user-management';
        state.systemUserDept = 'all';
        state.systemUserStatus = 'all';
        state.systemUserDraftKeyword = '';
        state.systemUserKeyword = '';
        state.systemUserPage = 1;
        state.systemUserSelected = {};
      } else if (target.dataset.systemView === 'system-role-management') {
        state.view = 'system-role-management';
        state.systemRoleKeyword = '';
        state.systemRoleAdding = false;
      } else if (target.dataset.systemView === 'system-config') {
        state.view = 'system-config';
      } else if (target.dataset.systemView === 'system-operation-log') {
        state.view = 'system-operation-log';
        state.operationModule = 'all';
        state.operationType = 'all';
        state.operationDraftKeyword = '';
        state.operationKeyword = '';
        state.operationPage = 1;
      }
      renderView();
    } else if (target.matches('.dm-nav-link')) {
      var group = target.closest('.dm-nav-group');
      var dropdown = group && group.querySelector('.dm-dropdown');
      document.querySelectorAll('.dm-nav-group.open').forEach(function (openGroup) { if (openGroup !== group) openGroup.classList.remove('open'); });
      if (dropdown) { group.classList.toggle('open'); setActiveMenu(target.dataset.dmMenu); }
    } else if (target.closest('.dm-dropdown')) {
      var menuGroup = target.closest('.dm-nav-group');
      if (menuGroup) menuGroup.classList.remove('open');
      setActiveMenu(menuGroup.querySelector('.dm-nav-link').dataset.dmMenu, target);
      showToast('该菜单页面暂未在本次设计范围内：' + target.textContent.trim());
    } else if (target.matches('[data-system-user-dept]')) {
      state.systemUserDept = target.dataset.systemUserDept;
      state.systemUserPage = 1;
      state.systemUserSelected = {};
      renderView();
    } else if (target.matches('[data-system-user-search]')) {
      var systemUserInput = document.querySelector('[aria-label="用户账号姓名"]');
      state.systemUserDraftKeyword = systemUserInput ? systemUserInput.value.trim() : '';
      state.systemUserKeyword = state.systemUserDraftKeyword;
      state.systemUserPage = 1;
      state.systemUserSelected = {};
      renderView();
    } else if (target.matches('[data-system-user-page]') && !target.disabled) {
      state.systemUserPage = Number(target.dataset.systemUserPage) || 1;
      renderView();
    } else if (target.matches('[data-system-user-add]')) {
      openSystemUserForm(null, 'add');
    } else if (target.matches('[data-system-user-view], [data-system-user-edit]')) {
      var userId = Number(target.dataset.systemUserView || target.dataset.systemUserEdit);
      var selectedUser = SYSTEM_USERS.find(function (user) { return user.id === userId; });
      if (selectedUser) openSystemUserForm(selectedUser, target.matches('[data-system-user-view]') ? 'view' : 'edit');
    } else if (target.matches('[data-system-user-reset]')) {
      var resetUser = SYSTEM_USERS.find(function (user) { return user.id === Number(target.dataset.systemUserReset); });
      if (resetUser) openSystemConfirm('密码重置', '确认将' + resetUser.name + '的密码重置为手机号码后8位？', 'user-reset', [resetUser.id]);
    } else if (target.matches('[data-system-user-status-action]')) {
      var statusUser = SYSTEM_USERS.find(function (user) { return user.id === Number(target.dataset.systemUserStatusAction); });
      if (statusUser) openSystemConfirm(target.dataset.nextStatus === 'enabled' ? '启用用户' : '禁用用户', '确认' + (target.dataset.nextStatus === 'enabled' ? '启用' : '禁用') + '用户“' + statusUser.name + '”？', 'user-status-' + target.dataset.nextStatus, [statusUser.id]);
    } else if (target.matches('[data-system-user-delete]')) {
      var deleteUser = SYSTEM_USERS.find(function (user) { return user.id === Number(target.dataset.systemUserDelete); });
      if (deleteUser) openSystemConfirm('删除用户', '删除后无法恢复，确认删除用户“' + deleteUser.name + '”？', 'user-delete', [deleteUser.id]);
    } else if (target.matches('[data-system-user-batch-delete]')) {
      var selectedUserIds = Object.keys(state.systemUserSelected).filter(function (id) { return state.systemUserSelected[id]; }).map(Number);
      if (!selectedUserIds.length) showToast('请先选择需要删除的用户');
      else openSystemConfirm('批量删除', '已选择' + selectedUserIds.length + '条记录，删除后无法恢复，是否继续？', 'user-delete', selectedUserIds);
    } else if (target.matches('[data-system-user-export]')) {
      showToast('用户数据已生成导出任务');
    } else if (target.matches('[data-system-user-import]')) {
      document.querySelector('.page-data-map').insertAdjacentHTML('beforeend', '<div class="dm-modal-mask" role="dialog" aria-modal="true" aria-label="导入用户"><form class="dm-modal dm-import-modal" data-system-user-import-form><div class="dm-modal-head"><h3>导入</h3><button type="button" data-modal-close aria-label="关闭"><i class="bi bi-x-lg"></i></button></div><div class="dm-modal-body"><div class="dm-upload-box"><i class="bi bi-cloud-arrow-up"></i><strong>选择用户导入文件</strong><span>支持 XLS、XLSX 格式，文件大小不超过5MB</span><input type="file" name="userFile" accept=".xls,.xlsx" required></div><button type="button" class="dm-table-action" data-user-template><i class="bi bi-download"></i>下载导入模板</button></div><div class="dm-modal-foot"><button type="submit" class="dm-dir-btn primary"><i class="bi bi-upload"></i>导入</button><button type="button" class="dm-dir-btn" data-modal-close><i class="bi bi-x-circle"></i>取消</button></div></form></div>');
    } else if (target.matches('[data-user-template]')) {
      showToast('用户导入模板已生成');
    } else if (target.matches('[data-department-add], [data-department-edit]')) {
      var editDepartment = target.matches('[data-department-edit]');
      var departmentName = target.dataset.departmentEdit === 'business' ? '业务部' : target.dataset.departmentEdit === 'engineering' ? '工程部' : target.dataset.departmentEdit === 'root' ? '数据中台演示' : target.dataset.departmentEdit === 'my' ? '我的部门' : '';
      document.querySelector('.page-data-map').insertAdjacentHTML('beforeend', '<div class="dm-modal-mask" role="dialog" aria-modal="true" aria-label="' + (editDepartment ? '修改部门' : '新增部门') + '"><form class="dm-modal dm-department-modal" data-department-form><div class="dm-modal-head"><h3>' + (editDepartment ? '修改' : '新增') + '</h3><button type="button" data-modal-close aria-label="关闭"><i class="bi bi-x-lg"></i></button></div><div class="dm-modal-body"><label class="dm-form-item"><span><em>*</em>上级部门</span><input value="数据中台演示 / 我的部门" disabled></label><label class="dm-form-item"><span><em>*</em>部门名称</span><input name="departmentName" value="' + escapeHtml(departmentName) + '" maxlength="50" required></label></div><div class="dm-modal-foot"><button type="submit" class="dm-dir-btn primary"><i class="bi bi-check2-circle"></i>确定</button><button type="button" class="dm-dir-btn" data-modal-close><i class="bi bi-x-circle"></i>取消</button></div></form></div>');
    } else if (target.matches('[data-system-confirm]')) {
      var confirmIds = (target.dataset.systemIds || '').split(',').map(Number).filter(Boolean);
      var confirmAction = target.dataset.systemConfirm;
      if (confirmAction === 'user-delete') {
        SYSTEM_USERS = SYSTEM_USERS.filter(function (user) { return confirmIds.indexOf(user.id) === -1; });
        confirmIds.forEach(function (id) { delete state.systemUserSelected[id]; });
      } else if (confirmAction.indexOf('user-status-') === 0) {
        var userStatus = confirmAction.replace('user-status-', '');
        SYSTEM_USERS.forEach(function (user) { if (confirmIds.indexOf(user.id) > -1) user.status = userStatus; });
      } else if (confirmAction === 'role-delete') {
        SYSTEM_ROLES = SYSTEM_ROLES.filter(function (role) { return confirmIds.indexOf(role.id) === -1; });
        state.systemRoleSelectedId = SYSTEM_ROLES.length ? SYSTEM_ROLES[0].id : 0;
      }
      closeModal();
      renderView();
      showToast(confirmAction === 'user-reset' ? '密码已重置为手机号码后8位' : confirmAction === 'role-delete' ? '角色已删除' : confirmAction === 'user-delete' ? '用户已删除' : '用户状态已更新');
    } else if (target.matches('[data-role-add]')) {
      state.systemRoleAdding = true;
      renderView();
    } else if (target.matches('[data-role-add-cancel]')) {
      state.systemRoleAdding = false;
      renderView();
    } else if (target.matches('[data-role-add-save]')) {
      var roleNameInput = document.querySelector('[data-role-new-name]');
      var roleName = roleNameInput ? roleNameInput.value.trim() : '';
      if (!roleName) showToast('请输入角色名称');
      else {
        var nextRoleId = SYSTEM_ROLES.reduce(function (max, role) { return Math.max(max, role.id); }, 950) + 1;
        SYSTEM_ROLES.push({ id: nextRoleId, name: roleName, description: '负责指定业务模块的功能操作。', permissions: ['home.view'] });
        state.systemRoleSelectedId = nextRoleId;
        state.systemRoleAdding = false;
        renderView();
        showToast('角色已添加');
      }
    } else if (target.matches('[data-role-select]')) {
      state.systemRoleSelectedId = Number(target.dataset.roleSelect);
      renderView();
    } else if (target.matches('[data-role-delete]')) {
      var deleteRole = findSystemRole(state.systemRoleSelectedId);
      if (deleteRole) openSystemConfirm('删除角色', '删除后该角色的权限配置将无法恢复，是否继续？', 'role-delete', [deleteRole.id]);
    } else if (target.matches('[data-role-permission-save]')) {
      var permissionRole = findSystemRole(state.systemRoleSelectedId);
      if (permissionRole) permissionRole.permissions = Array.from(document.querySelectorAll('[data-role-permission]:checked')).map(function (input) { return input.dataset.rolePermission; });
      showToast('功能权限已保存');
    } else if (target.matches('[data-system-logo-upload]')) {
      var logoFile = document.querySelector('[data-system-logo-file]');
      if (logoFile) logoFile.click();
    } else if (target.matches('[data-system-logo-default]')) {
      showToast('Logo已恢复默认');
    } else if (target.matches('[data-operation-search]')) {
      var operationInput = document.querySelector('[aria-label="操作日志关键字"]');
      state.operationDraftKeyword = operationInput ? operationInput.value.trim() : '';
      state.operationKeyword = state.operationDraftKeyword;
      state.operationPage = 1;
      renderView();
    } else if (target.matches('[data-operation-page]') && !target.disabled) {
      state.operationPage = Number(target.dataset.operationPage) || 1;
      renderView();
    } else if (target.matches('[data-system-audit-tab]')) {
      state.systemAuditTab = target.dataset.systemAuditTab;
      state.systemAuditPage = 1;
      state.systemAuditSelected = {};
      renderView();
    } else if (target.matches('[data-system-audit-search]')) {
      var systemAuditInput = document.querySelector('[aria-label="系统审核关键字"]');
      state.systemAuditDraftKeyword = systemAuditInput ? systemAuditInput.value.trim() : '';
      state.systemAuditKeyword = state.systemAuditDraftKeyword;
      state.systemAuditPage = 1;
      state.systemAuditSelected = {};
      renderView();
    } else if (target.matches('[data-system-audit-page]') && !target.disabled) {
      state.systemAuditPage = Number(target.dataset.systemAuditPage) || 1;
      renderView();
    } else if (target.matches('[data-system-audit-process]')) {
      openSystemAuditProcess();
    } else if (target.matches('[data-system-audit-record]')) {
      openManagementAudit(findManagementItem(target.dataset.systemAuditRecord));
    } else if (target.matches('[data-system-audit-detail]')) {
      var systemAuditItem = findManagementItem(target.dataset.systemAuditDetail);
      if (systemAuditItem) {
        state.systemAuditDetailId = systemAuditItem.id;
        state.systemAuditDetailTab = systemAuditItem.type === 'api' || systemAuditItem.type === 'orchestration' ? 'api-doc' : 'fields';
        state.view = 'system-audit-detail';
        renderView();
      }
    } else if (target.matches('[data-system-audit-back]')) {
      state.view = 'system-audit-center';
      renderView();
    } else if (target.matches('[data-system-audit-detail-tab]')) {
      state.systemAuditDetailTab = target.dataset.systemAuditDetailTab;
      renderView();
    } else if (target.matches('[data-management-tab]')) {
      state.managementTab = target.dataset.managementTab;
      state.managementPage = 1;
      state.managementSelected = {};
      renderView();
    } else if (target.matches('[data-management-search]')) {
      var managementInput = document.querySelector('[aria-label="数据管理关键字"]');
      state.managementDraftKeyword = managementInput ? managementInput.value.trim() : '';
      state.managementKeyword = state.managementDraftKeyword;
      state.managementPage = 1;
      state.managementSelected = {};
      renderView();
    } else if (target.matches('[data-management-page]') && !target.disabled) {
      state.managementPage = Number(target.dataset.managementPage) || 1;
      renderView();
    } else if (target.matches('[data-management-action]')) {
      openManagementConfirm(target.dataset.managementAction);
    } else if (target.matches('[data-management-audit]')) {
      openManagementAudit(findManagementItem(target.dataset.managementAudit));
    } else if (target.matches('[data-management-edit]')) {
      var editableManagementItem = findManagementItem(target.dataset.managementEdit);
      if (editableManagementItem) {
        state.managementEditId = editableManagementItem.id;
        state.managementEditTab = editableManagementItem.type === 'api' || editableManagementItem.type === 'orchestration' ? 'api-doc' : 'fields';
        state.view = 'data-management-edit';
        renderView();
      }
    } else if (target.matches('[data-management-back]')) {
      state.view = 'data-management';
      renderView();
    } else if (target.matches('[data-management-edit-tab]')) {
      state.managementEditTab = target.dataset.managementEditTab;
      renderView();
    } else if (target.matches('[data-management-category-toggle]')) {
      var categoryPicker = target.closest('.dm-management-category-picker');
      if (categoryPicker) categoryPicker.classList.toggle('open');
    } else if (target.matches('[data-management-category-value]')) {
      var categoryValue = target.dataset.managementCategoryValue;
      var categoryContainer = target.closest('.dm-management-category-picker');
      var categoryField = categoryContainer && categoryContainer.parentElement.querySelector('input[name="category"]');
      var categoryLabel = categoryContainer && categoryContainer.querySelector('[data-management-category-label]');
      if (categoryField) categoryField.value = categoryValue;
      if (categoryLabel) categoryLabel.textContent = categoryValue;
      if (categoryContainer) {
        categoryContainer.querySelectorAll('[data-management-category-value]').forEach(function (option) { option.classList.toggle('active', option === target); });
        categoryContainer.classList.remove('open');
      }
    } else if (target.matches('[data-management-confirm]')) {
      var managementAction = target.dataset.managementConfirm;
      var managementIds = (target.dataset.managementIds || '').split(',').map(Number).filter(Boolean);
      managementIds.forEach(function (id) {
        var managedItem = findManagementItem(id);
        if (!managedItem) return;
        managedItem.updatedAt = '2026-09-24 15:36:18';
        if (managementAction === 'publish') {
          managedItem.publishStatus = 'pending';
          managedItem.auditStatus = 'up-pending';
          managedItem.releasedAt = '待审核';
          managedItem.auditHistory.unshift(['2026-09-24 15:36:18', 'present', '发起申请', '处理意见：发起上架申请']);
        } else {
          managedItem.auditStatus = 'down-pending';
          managedItem.auditHistory.unshift(['2026-09-24 15:36:18', 'present', '发起申请', '处理意见：发起下架申请']);
        }
        delete state.managementSelected[id];
      });
      closeModal();
      renderView();
      showToast(managementAction === 'publish' ? '上架申请已提交' : '下架申请已提交');
    } else if (target.matches('.dm-tab')) {
      state.homeTab = target.dataset.dmTab || 'public';
      renderView();
    } else if (target.matches('[data-audit-tab]')) {
      state.auditTab = target.dataset.auditTab;
      state.auditStatus = 'all';
      state.auditType = 'all';
      state.auditDraftKeyword = '';
      state.auditKeyword = '';
      state.auditPage = 1;
      state.auditSelected = {};
      renderView();
    } else if (target.matches('[data-audit-search]')) {
      var auditInput = document.querySelector('.dm-audit-keyword input');
      state.auditDraftKeyword = auditInput ? auditInput.value.trim() : '';
      state.auditKeyword = state.auditDraftKeyword;
      state.auditPage = 1;
      renderView();
    } else if (target.matches('[data-audit-page]') && !target.disabled) {
      state.auditPage = Number(target.dataset.auditPage) || 1;
      renderView();
    } else if (target.matches('[data-audit-process]')) {
      var selectedAuditItems = Object.keys(state.auditSelected).filter(function (id) { return state.auditSelected[id]; }).map(findAuditItem).filter(Boolean);
      openAuditProcess(selectedAuditItems);
    } else if (target.matches('[data-audit-row-process]')) {
      openAuditProcess([findAuditItem(target.dataset.auditRowProcess)].filter(Boolean));
    } else if (target.matches('[data-audit-record-id]')) {
      openAuditRecord(findAuditItem(target.dataset.auditRecordId));
    } else if (target.matches('[data-app-new]')) {
      openApplicationForm();
    } else if (target.matches('[data-app-search]')) {
      var appInput = document.querySelector('.dm-personal-search input');
      state.appDraftKeyword = appInput ? appInput.value.trim() : '';
      state.appKeyword = state.appDraftKeyword;
      state.appPage = 1;
      renderView();
    } else if (target.matches('[data-app-page]') && !target.disabled) {
      state.appPage = Number(target.dataset.appPage) || 1;
      renderView();
    } else if (target.matches('[data-app-key-toggle]')) {
      var keyId = Number(target.dataset.appKeyToggle);
      state.appKeyVisible[keyId] = !state.appKeyVisible[keyId];
      renderView();
    } else if (target.matches('[data-app-copy]')) {
      showToast('app_Key 已复制');
    } else if (target.matches('[data-app-change-key]')) {
      openAppConfirm(MY_APPLICATIONS.find(function (item) { return item.id === Number(target.dataset.appChangeKey); }), 'change-key');
    } else if (target.matches('[data-app-offline]')) {
      openAppConfirm(MY_APPLICATIONS.find(function (item) { return item.id === Number(target.dataset.appOffline); }), 'offline');
    } else if (target.matches('[data-confirm-app-action]')) {
      var confirmApp = MY_APPLICATIONS.find(function (item) { return item.id === Number(target.dataset.appId); });
      if (confirmApp) {
        if (target.dataset.confirmAppAction === 'change-key') {
          confirmApp.appKey = 'AK' + String(202609240000 + confirmApp.id) + 'X';
          confirmApp.updatedAt = '2026-09-24 10:42:16';
        } else {
          confirmApp.status = 'offline';
          confirmApp.updatedAt = '2026-09-24 10:42:16';
        }
      }
      closeModal();
      renderView();
      showToast(target.dataset.confirmAppAction === 'change-key' ? 'app_Key 已更换' : '应用已下架');
    } else if (target.matches('[data-account-password]')) {
      openPasswordForm();
    } else if (target.matches('[data-message-tab]')) {
      state.messageTab = target.dataset.messageTab;
      state.messagePage = 1;
      renderView();
    } else if (target.matches('[data-message-page]') && !target.disabled) {
      state.messagePage = Number(target.dataset.messagePage) || 1;
      renderView();
    } else if (target.matches('[data-monitor-search]')) {
      var monitorInput = document.querySelector('.dm-monitor-search input[aria-label="监控数据关键字"]');
      state.monitorDraftKeyword = monitorInput ? monitorInput.value.trim() : '';
      state.monitorKeyword = state.monitorDraftKeyword;
      state.monitorPage = 1;
      renderView();
    } else if (target.matches('[data-monitor-page]') && !target.disabled) {
      state.monitorPage = Number(target.dataset.monitorPage) || 1;
      renderView();
    } else if (target.matches('[data-monitor-detail]')) {
      var monitorItem = findMonitorItem(target.dataset.monitorDetail);
      if (monitorItem) {
        state.monitorDetailId = monitorItem.id;
        state.monitorDetailOrigin = 'api-monitor';
        state.callApp = 'all';
        state.callStatus = 'all';
        state.callDraftAccount = '';
        state.callAccount = '';
        state.callPage = 1;
        state.view = 'api-monitor-detail';
        renderView();
      }
    } else if (target.matches('[data-record-search]')) {
      var recordDataInput = document.querySelector('[aria-label="申请数据关键字"]');
      var recordAccountInput = document.querySelector('[aria-label="申请账号"]');
      state.recordDraftData = recordDataInput ? recordDataInput.value.trim() : '';
      state.recordDraftAccount = recordAccountInput ? recordAccountInput.value.trim() : '';
      state.recordData = state.recordDraftData;
      state.recordAccount = state.recordDraftAccount;
      state.recordPage = 1;
      renderView();
    } else if (target.matches('[data-record-page]') && !target.disabled) {
      state.recordPage = Number(target.dataset.recordPage) || 1;
      renderView();
    } else if (target.matches('[data-record-detail]')) {
      var recordMonitorItem = findMonitorItem(target.dataset.recordDetail);
      if (recordMonitorItem) {
        state.monitorDetailId = recordMonitorItem.id;
        state.monitorDetailOrigin = 'application-records';
        state.callApp = 'all';
        state.callStatus = 'all';
        state.callDraftAccount = '';
        state.callAccount = '';
        state.callPage = 1;
        state.view = 'api-monitor-detail';
        renderView();
      }
    } else if (target.matches('[data-monitor-back]')) {
      state.view = state.monitorDetailOrigin;
      renderView();
    } else if (target.matches('[data-call-search]')) {
      var callInput = document.querySelector('.dm-monitor-search input[aria-label="调用账号"]');
      state.callDraftAccount = callInput ? callInput.value.trim() : '';
      state.callAccount = state.callDraftAccount;
      state.callPage = 1;
      renderView();
    } else if (target.matches('[data-call-page]') && !target.disabled) {
      state.callPage = Number(target.dataset.callPage) || 1;
      renderView();
    } else if (target.matches('[data-call-log]')) {
      openCallLog(API_CALL_RECORDS.find(function (item) { return item.id === Number(target.dataset.callLog); }));
    } else if (target.matches('.dm-hot-tag, [data-home-search]')) {
      var homeInput = document.querySelector('.dm-search-input');
      if (target.matches('.dm-hot-tag') && homeInput) homeInput.value = target.dataset.keyword || '';
      state.draftKeyword = homeInput ? homeInput.value.trim() : '';
      state.keyword = state.draftKeyword;
      state.catalogId = state.keyword === '库存' || state.keyword === '工单' ? 'mine' : 'public';
      state.view = 'directory';
      state.page = 1;
      renderView();
    } else if (target.matches('[data-directory-search]')) {
      var directoryInput = document.querySelector('.dm-directory-search input');
      state.draftKeyword = directoryInput ? directoryInput.value.trim() : '';
      state.keyword = state.draftKeyword;
      state.page = 1;
      refreshDirectoryResults();
    } else if (target.matches('[data-catalog]')) {
      var currentInput = document.querySelector('.dm-directory-search input');
      state.draftKeyword = currentInput ? currentInput.value.trim() : state.draftKeyword;
      state.keyword = state.draftKeyword;
      state.catalogId = target.dataset.catalog;
      if (target.dataset.hasChildren) state.openCatalogs[state.catalogId] = !state.openCatalogs[state.catalogId];
      if (state.view === 'api-monitor') state.monitorPage = 1;
      else if (state.view === 'application-records') state.recordPage = 1;
      else if (state.view === 'data-management') { state.managementPage = 1; state.managementSelected = {}; }
      else if (state.view === 'system-audit-center') { state.systemAuditPage = 1; state.systemAuditSelected = {}; }
      else state.page = 1;
      renderView();
    } else if (target.matches('[data-resource-type]')) {
      var typedInput = document.querySelector('.dm-directory-search input');
      state.draftKeyword = typedInput ? typedInput.value.trim() : state.draftKeyword;
      state.keyword = state.draftKeyword;
      state.type = target.dataset.resourceType;
      state.page = 1;
      refreshDirectoryResults();
    } else if (target.matches('[data-sort]')) {
      var sortingInput = document.querySelector('.dm-directory-search input');
      state.draftKeyword = sortingInput ? sortingInput.value.trim() : state.draftKeyword;
      state.keyword = state.draftKeyword;
      if (state.sortKey === target.dataset.sort) state.sortAsc = !state.sortAsc;
      else { state.sortKey = target.dataset.sort; state.sortAsc = false; }
      state.page = 1;
      refreshDirectoryResults();
    } else if (target.matches('[data-page]') && !target.disabled) {
      state.page = Number(target.dataset.page) || 1;
      refreshDirectoryResults();
    } else if (target.matches('[data-favorite-id]')) {
      var favoriteItem = findResource(target.dataset.favoriteId);
      if (favoriteItem) {
        favoriteItem.favorite = !favoriteItem.favorite;
        if (state.view === 'detail') renderView();
        else refreshDirectoryResults();
        showToast(favoriteItem.favorite ? '已加入收藏' : '已取消收藏');
      }
    } else if (target.matches('[data-pin-id]')) {
      var pinItem = findResource(target.dataset.pinId);
      if (pinItem) {
        pinItem.pinned = !pinItem.pinned;
        if (state.view === 'detail') renderView();
        else refreshDirectoryResults();
        showToast(pinItem.pinned ? '数据已置顶' : '已取消置顶');
      }
    } else if (target.matches('[data-detail-id]')) {
      var detailItem = findResource(target.dataset.detailId);
      if (detailItem) {
        state.detailOrigin = state.view === 'my-data' ? 'my-data' : state.view === 'favorites' ? 'favorites' : 'directory';
        state.detailResourceId = detailItem.id;
        state.detailTab = detailItem.type === 'api' || detailItem.type === 'orchestration' ? 'api-doc' : detailItem.type === 'dataset' ? 'fields' : 'preview';
        state.view = 'detail';
        renderView();
      }
    } else if (target.matches('[data-apply-id]')) {
      openTypeApply(findResource(target.dataset.applyId), 'apply');
    } else if (target.matches('[data-change-id]')) {
      openTypeApply(findResource(target.dataset.changeId), 'change');
    } else if (target.matches('[data-test-id]')) {
      var testItem = findResource(target.dataset.testId);
      if (testItem) {
        state.testResourceId = testItem.id;
        state.detailOrigin = 'my-data';
        state.view = 'api-test';
        renderView();
      }
    } else if (target.matches('[data-detail-back]')) {
      state.view = state.detailOrigin;
      renderView();
    } else if (target.matches('[data-test-back]')) {
      state.view = 'my-data';
      renderView();
    } else if (target.matches('[data-send-request]')) {
      var requestItem = findResource(target.dataset.sendRequest);
      var response = document.querySelector('[data-api-response]');
      if (requestItem && response) {
        response.textContent = JSON.stringify({ code: 200, message: '请求成功', data: { resource: requestItem.englishName, total: 10, requestId: 'REQ20260924093618', updatedAt: requestItem.updatedAt } }, null, 2);
        showToast('请求已发送，接口返回成功');
      }
    } else if (target.matches('[data-detail-tab]')) {
      state.detailTab = target.dataset.detailTab;
      renderView();
    } else if (target.matches('[data-download-file]')) {
      showToast('已生成下载任务：' + (findResource(target.dataset.downloadFile) || {}).title + '.XLSX');
    } else if (target.matches('[data-modal-close]')) {
      closeModal();
    }
  }

  function handleInput(event) {
    if (event.target.matches('[data-org-search]')) {
      var orgKeyword = event.target.value.trim().toLowerCase();
      var orgNodes = document.querySelectorAll('.dm-org-node');
      var orgVisible = 0;
      orgNodes.forEach(function (node) {
        var visible = !orgKeyword || (node.dataset.orgName || '').toLowerCase().indexOf(orgKeyword) > -1;
        node.hidden = !visible;
        if (visible) orgVisible += 1;
      });
      var orgEmpty = document.querySelector('.dm-org-empty');
      if (orgEmpty) orgEmpty.hidden = orgVisible > 0;
    } else if (event.target.matches('[aria-label="用户账号姓名"]')) {
      state.systemUserDraftKeyword = event.target.value;
    } else if (event.target.matches('[data-role-search]')) {
      state.systemRoleKeyword = event.target.value;
      renderView();
      var restoredRoleSearch = document.querySelector('[data-role-search]');
      if (restoredRoleSearch) { restoredRoleSearch.focus(); restoredRoleSearch.setSelectionRange(restoredRoleSearch.value.length, restoredRoleSearch.value.length); }
    } else if (event.target.matches('[data-system-config-name]')) {
      state.systemConfigName = event.target.value;
      var namePreview = document.querySelector('[data-system-config-name-preview]');
      if (namePreview) namePreview.textContent = event.target.value || '数据目录';
    } else if (event.target.matches('[data-system-footer]')) {
      var footerPreview = document.querySelector('[data-system-footer-preview="' + event.target.dataset.systemFooter + '"]');
      if (footerPreview) footerPreview.textContent = event.target.value;
    } else if (event.target.matches('[aria-label="操作日志关键字"]')) {
      state.operationDraftKeyword = event.target.value;
    } else if (event.target.matches('.dm-tree-search input')) {
      state.treeKeyword = event.target.value;
      var tree = document.querySelector('.dm-catalog-tree');
      if (tree) tree.innerHTML = treeHtml();
    } else if (event.target.matches('.dm-directory-search input')) {
      state.draftKeyword = event.target.value;
    } else if (event.target.matches('.dm-audit-keyword input')) {
      state.auditDraftKeyword = event.target.value;
    } else if (event.target.matches('.dm-personal-search input')) {
      state.appDraftKeyword = event.target.value;
    } else if (event.target.matches('[aria-label="监控数据关键字"]')) {
      state.monitorDraftKeyword = event.target.value;
    } else if (event.target.matches('[aria-label="申请数据关键字"]')) {
      state.recordDraftData = event.target.value;
    } else if (event.target.matches('[aria-label="申请账号"]')) {
      state.recordDraftAccount = event.target.value;
    } else if (event.target.matches('[aria-label="调用账号"]')) {
      state.callDraftAccount = event.target.value;
    } else if (event.target.matches('[aria-label="数据管理关键字"]')) {
      state.managementDraftKeyword = event.target.value;
    } else if (event.target.matches('[aria-label="系统审核关键字"]')) {
      state.systemAuditDraftKeyword = event.target.value;
    } else if (event.target.matches('[data-management-category-search]')) {
      var categorySearch = event.target.value.trim().toLowerCase();
      var picker = event.target.closest('.dm-management-category-picker');
      var visibleCategoryCount = 0;
      if (picker) {
        picker.querySelectorAll('.dm-management-category-tree section').forEach(function (section) {
          var sectionVisible = 0;
          section.querySelectorAll('[data-management-category-value]').forEach(function (option) {
            var visible = !categorySearch || option.textContent.toLowerCase().indexOf(categorySearch) > -1 || option.dataset.managementCategoryValue.toLowerCase().indexOf(categorySearch) > -1;
            option.hidden = !visible;
            if (visible) { sectionVisible += 1; visibleCategoryCount += 1; }
          });
          section.hidden = !sectionVisible;
        });
        var categoryEmpty = picker.querySelector('.dm-management-category-empty');
        if (categoryEmpty) categoryEmpty.hidden = visibleCategoryCount > 0;
      }
    } else if (event.target.matches('[data-app-count]')) {
      var appCounter = event.target.closest('.dm-textarea-wrap').querySelector('small');
      if (appCounter) appCounter.textContent = event.target.value.length + ' / 500';
    } else if (event.target.matches('[data-apply-reason]')) {
      var counter = event.target.closest('.dm-textarea-wrap').querySelector('[data-reason-count]');
      if (counter) counter.textContent = event.target.value.length + ' / 200';
    } else if (event.target.matches('[data-audit-comment]')) {
      var auditCounter = event.target.closest('.dm-textarea-wrap').querySelector('[data-audit-comment-count]');
      if (auditCounter) auditCounter.textContent = event.target.value.length + ' / ' + (event.target.maxLength || 500);
    } else if (event.target.matches('[data-system-audit-comment]')) {
      var systemAuditCounter = event.target.closest('.dm-textarea-wrap').querySelector('[data-system-audit-comment-count]');
      if (systemAuditCounter) systemAuditCounter.textContent = event.target.value.length + ' / 200';
    }
  }

  function handleKeydown(event) {
    if (event.key === 'Enter' && event.target.closest('.dm-resource-card')) {
      event.preventDefault();
      showToast('已选中资源：' + (event.target.closest('.dm-resource-card').dataset.resourceTitle || '数据资源'));
    } else if (event.key === 'Enter' && event.target.matches('.dm-search-input')) {
      event.preventDefault();
      document.querySelector('[data-home-search]').click();
    } else if (event.key === 'Enter' && event.target.matches('.dm-directory-search input')) {
      event.preventDefault();
      document.querySelector('[data-directory-search]').click();
    } else if (event.key === 'Enter' && event.target.matches('.dm-audit-keyword input')) {
      event.preventDefault();
      document.querySelector('[data-audit-search]').click();
    } else if (event.key === 'Enter' && event.target.matches('.dm-personal-search input')) {
      event.preventDefault();
      document.querySelector('[data-app-search]').click();
    } else if (event.key === 'Enter' && event.target.matches('[aria-label="监控数据关键字"]')) {
      event.preventDefault();
      document.querySelector('[data-monitor-search]').click();
    } else if (event.key === 'Enter' && event.target.matches('[aria-label="申请数据关键字"], [aria-label="申请账号"]')) {
      event.preventDefault();
      document.querySelector('[data-record-search]').click();
    } else if (event.key === 'Enter' && event.target.matches('[aria-label="调用账号"]')) {
      event.preventDefault();
      document.querySelector('[data-call-search]').click();
    } else if (event.key === 'Enter' && event.target.matches('[aria-label="数据管理关键字"]')) {
      event.preventDefault();
      document.querySelector('[data-management-search]').click();
    } else if (event.key === 'Enter' && event.target.matches('[data-management-page-jump]')) {
      event.preventDefault();
      var managementPages = Math.max(1, Math.ceil(getFilteredManagementItems().length / state.managementPageSize));
      state.managementPage = Math.min(managementPages, Math.max(1, Number(event.target.value) || 1));
      renderView();
    } else if (event.key === 'Enter' && event.target.matches('[aria-label="系统审核关键字"]')) {
      event.preventDefault();
      document.querySelector('[data-system-audit-search]').click();
    } else if (event.key === 'Enter' && event.target.matches('[aria-label="用户账号姓名"]')) {
      event.preventDefault();
      document.querySelector('[data-system-user-search]').click();
    } else if (event.key === 'Enter' && event.target.matches('[aria-label="操作日志关键字"]')) {
      event.preventDefault();
      document.querySelector('[data-operation-search]').click();
    } else if (event.key === 'Enter' && event.target.matches('[data-system-user-page-jump]')) {
      event.preventDefault();
      var systemUserPages = Math.max(1, Math.ceil(getFilteredSystemUsers().length / state.systemUserPageSize));
      state.systemUserPage = Math.min(systemUserPages, Math.max(1, Number(event.target.value) || 1));
      renderView();
    } else if (event.key === 'Enter' && event.target.matches('[data-operation-page-jump]')) {
      event.preventDefault();
      var operationPages = Math.max(1, Math.ceil(getFilteredOperationLogs().length / state.operationPageSize));
      state.operationPage = Math.min(operationPages, Math.max(1, Number(event.target.value) || 1));
      renderView();
    } else if (event.key === 'Enter' && event.target.matches('[data-system-audit-page-jump]')) {
      event.preventDefault();
      var systemAuditPages = Math.max(1, Math.ceil(getFilteredSystemAuditItems().length / state.systemAuditPageSize));
      state.systemAuditPage = Math.min(systemAuditPages, Math.max(1, Number(event.target.value) || 1));
      renderView();
    } else if (event.key === 'Enter' && event.target.matches('[data-audit-page-jump]')) {
      event.preventDefault();
      var auditPages = Math.max(1, Math.ceil(getFilteredAuditItems().length / state.auditPageSize));
      state.auditPage = Math.min(auditPages, Math.max(1, Number(event.target.value) || 1));
      renderView();
    } else if (event.key === 'Enter' && event.target.matches('[data-message-page-jump]')) {
      event.preventDefault();
      var messageList = state.messageTab === 'unread' ? PERSONAL_MESSAGES.filter(function (item) { return item.unread; }) : PERSONAL_MESSAGES;
      var messagePages = Math.max(1, Math.ceil(messageList.length / state.messagePageSize));
      state.messagePage = Math.min(messagePages, Math.max(1, Number(event.target.value) || 1));
      renderView();
    } else if (event.key === 'Escape') {
      closeModal();
    }
  }

  function handleChange(event) {
    if (event.target.matches('[data-system-user-status]')) {
      var currentSystemUserInput = document.querySelector('[aria-label="用户账号姓名"]');
      state.systemUserDraftKeyword = currentSystemUserInput ? currentSystemUserInput.value.trim() : state.systemUserDraftKeyword;
      state.systemUserKeyword = state.systemUserDraftKeyword;
      state.systemUserStatus = event.target.value;
      state.systemUserPage = 1;
      state.systemUserSelected = {};
      renderView();
    } else if (event.target.matches('[data-system-user-page-size]')) {
      state.systemUserPageSize = Number(event.target.value) || 10;
      state.systemUserPage = 1;
      renderView();
    } else if (event.target.matches('[data-system-user-check-all]')) {
      var systemUserItems = getFilteredSystemUsers();
      var systemUserStart = (state.systemUserPage - 1) * state.systemUserPageSize;
      systemUserItems.slice(systemUserStart, systemUserStart + state.systemUserPageSize).forEach(function (user) { state.systemUserSelected[user.id] = event.target.checked; });
      renderView();
    } else if (event.target.matches('[data-system-user-check]')) {
      state.systemUserSelected[event.target.dataset.systemUserCheck] = event.target.checked;
    } else if (event.target.matches('[data-permission-group]')) {
      var groupName = event.target.dataset.permissionGroup;
      document.querySelectorAll('[data-permission-parent="' + groupName + '"]').forEach(function (input) { input.checked = event.target.checked; });
    } else if (event.target.matches('[data-role-permission]')) {
      var parentName = event.target.dataset.permissionParent;
      var permissionChildren = Array.from(document.querySelectorAll('[data-permission-parent="' + parentName + '"]'));
      var permissionParent = document.querySelector('[data-permission-group="' + parentName + '"]');
      if (permissionParent) {
        permissionParent.checked = permissionChildren.length > 0 && permissionChildren.every(function (input) { return input.checked; });
        permissionParent.indeterminate = permissionChildren.some(function (input) { return input.checked; }) && !permissionParent.checked;
      }
    } else if (event.target.matches('[data-system-config-mode]')) {
      state.systemConfigMode = event.target.value;
      renderView();
    } else if (event.target.matches('[data-system-logo-file]')) {
      showToast(event.target.files && event.target.files.length ? 'Logo文件已选择，保存后生效' : '未选择Logo文件');
    } else if (event.target.matches('[data-operation-period]')) {
      state.operationPeriod = event.target.value;
      state.operationEnd = '2026-09-24 23:59:59';
      state.operationStart = event.target.value === '30' ? '2026-08-26 00:00:00' : event.target.value === '7' ? '2026-09-18 00:00:00' : '2026-09-23 00:00:00';
      state.operationPage = 1;
      renderView();
    } else if (event.target.matches('[data-operation-date]')) {
      var operationStart = document.querySelector('[data-operation-date="start"]');
      var operationEnd = document.querySelector('[data-operation-date="end"]');
      state.operationStart = operationStart ? operationStart.value : state.operationStart;
      state.operationEnd = operationEnd ? operationEnd.value : state.operationEnd;
      state.operationPeriod = 'custom';
      state.operationPage = 1;
      renderView();
    } else if (event.target.matches('[data-operation-module], [data-operation-type]')) {
      var currentOperationInput = document.querySelector('[aria-label="操作日志关键字"]');
      state.operationDraftKeyword = currentOperationInput ? currentOperationInput.value.trim() : state.operationDraftKeyword;
      state.operationKeyword = state.operationDraftKeyword;
      if (event.target.matches('[data-operation-module]')) state.operationModule = event.target.value;
      if (event.target.matches('[data-operation-type]')) state.operationType = event.target.value;
      state.operationPage = 1;
      renderView();
    } else if (event.target.matches('[data-operation-page-size]')) {
      state.operationPageSize = Number(event.target.value) || 10;
      state.operationPage = 1;
      renderView();
    } else if (event.target.matches('[data-system-audit-publish-status], [data-system-audit-status]')) {
      var currentSystemAuditInput = document.querySelector('[aria-label="系统审核关键字"]');
      state.systemAuditDraftKeyword = currentSystemAuditInput ? currentSystemAuditInput.value.trim() : state.systemAuditDraftKeyword;
      state.systemAuditKeyword = state.systemAuditDraftKeyword;
      if (event.target.matches('[data-system-audit-publish-status]')) state.systemAuditPublishStatus = event.target.value;
      if (event.target.matches('[data-system-audit-status]')) state.systemAuditStatus = event.target.value;
      state.systemAuditPage = 1;
      state.systemAuditSelected = {};
      renderView();
    } else if (event.target.matches('[data-system-audit-page-size]')) {
      state.systemAuditPageSize = Number(event.target.value) || 10;
      state.systemAuditPage = 1;
      renderView();
    } else if (event.target.matches('[data-system-audit-check-all]')) {
      var systemAuditItems = getFilteredSystemAuditItems();
      var systemAuditStart = (state.systemAuditPage - 1) * state.systemAuditPageSize;
      systemAuditItems.slice(systemAuditStart, systemAuditStart + state.systemAuditPageSize).forEach(function (item) { state.systemAuditSelected[item.id] = event.target.checked; });
      renderView();
    } else if (event.target.matches('[data-system-audit-check]')) {
      state.systemAuditSelected[event.target.dataset.systemAuditCheck] = event.target.checked;
    } else if (event.target.matches('[data-management-publish-status], [data-management-audit-status]')) {
      var currentManagementInput = document.querySelector('[aria-label="数据管理关键字"]');
      state.managementDraftKeyword = currentManagementInput ? currentManagementInput.value.trim() : state.managementDraftKeyword;
      state.managementKeyword = state.managementDraftKeyword;
      if (event.target.matches('[data-management-publish-status]')) state.managementPublishStatus = event.target.value;
      if (event.target.matches('[data-management-audit-status]')) state.managementAuditStatus = event.target.value;
      state.managementPage = 1;
      state.managementSelected = {};
      renderView();
    } else if (event.target.matches('[data-management-page-size]')) {
      state.managementPageSize = Number(event.target.value) || 10;
      state.managementPage = 1;
      renderView();
    } else if (event.target.matches('[data-management-check-all]')) {
      var managementItems = getFilteredManagementItems();
      var managementStart = (state.managementPage - 1) * state.managementPageSize;
      managementItems.slice(managementStart, managementStart + state.managementPageSize).forEach(function (item) { state.managementSelected[item.id] = event.target.checked; });
      renderView();
    } else if (event.target.matches('[data-management-check]')) {
      state.managementSelected[event.target.dataset.managementCheck] = event.target.checked;
    } else if (event.target.matches('[data-monitor-period]')) {
      setMonitorPeriodRange(event.target.dataset.monitorPeriod, event.target.value);
      renderView();
    } else if (event.target.matches('[data-monitor-date]')) {
      var dateScope = event.target.dataset.monitorDate.indexOf('call-') === 0 ? 'call' : 'summary';
      var dateStart = document.querySelector('[data-monitor-date="' + dateScope + '-start"]');
      var dateEnd = document.querySelector('[data-monitor-date="' + dateScope + '-end"]');
      if (dateScope === 'call') {
        state.callStart = dateStart ? dateStart.value : state.callStart;
        state.callEnd = dateEnd ? dateEnd.value : state.callEnd;
        state.callPeriod = 'custom';
        state.callPage = 1;
      } else {
        state.monitorStart = dateStart ? dateStart.value : state.monitorStart;
        state.monitorEnd = dateEnd ? dateEnd.value : state.monitorEnd;
        state.monitorPeriod = 'custom';
        state.monitorPage = 1;
      }
      renderView();
    } else if (event.target.matches('[data-monitor-type], [data-monitor-app], [data-monitor-status]')) {
      var currentMonitorInput = document.querySelector('[aria-label="监控数据关键字"]');
      state.monitorDraftKeyword = currentMonitorInput ? currentMonitorInput.value.trim() : state.monitorDraftKeyword;
      state.monitorKeyword = state.monitorDraftKeyword;
      if (event.target.matches('[data-monitor-type]')) state.monitorType = event.target.value;
      if (event.target.matches('[data-monitor-app]')) state.monitorApp = event.target.value;
      if (event.target.matches('[data-monitor-status]')) state.monitorStatus = event.target.value;
      state.monitorPage = 1;
      renderView();
    } else if (event.target.matches('[data-monitor-page-size]')) {
      state.monitorPageSize = Number(event.target.value) || 10;
      state.monitorPage = 1;
      renderView();
    } else if (event.target.matches('[data-call-app], [data-call-status]')) {
      var currentCallInput = document.querySelector('[aria-label="调用账号"]');
      state.callDraftAccount = currentCallInput ? currentCallInput.value.trim() : state.callDraftAccount;
      state.callAccount = state.callDraftAccount;
      if (event.target.matches('[data-call-app]')) state.callApp = event.target.value;
      if (event.target.matches('[data-call-status]')) state.callStatus = event.target.value;
      state.callPage = 1;
      renderView();
    } else if (event.target.matches('[data-call-page-size]')) {
      state.callPageSize = Number(event.target.value) || 10;
      state.callPage = 1;
      renderView();
    } else if (event.target.matches('[data-record-type], [data-record-version], [data-record-app], [data-record-status]')) {
      var currentRecordData = document.querySelector('[aria-label="申请数据关键字"]');
      var currentRecordAccount = document.querySelector('[aria-label="申请账号"]');
      state.recordDraftData = currentRecordData ? currentRecordData.value.trim() : state.recordDraftData;
      state.recordDraftAccount = currentRecordAccount ? currentRecordAccount.value.trim() : state.recordDraftAccount;
      state.recordData = state.recordDraftData;
      state.recordAccount = state.recordDraftAccount;
      if (event.target.matches('[data-record-type]')) state.recordType = event.target.value;
      if (event.target.matches('[data-record-version]')) state.recordVersion = event.target.value;
      if (event.target.matches('[data-record-app]')) state.recordApp = event.target.value;
      if (event.target.matches('[data-record-status]')) state.recordStatus = event.target.value;
      state.recordPage = 1;
      renderView();
    } else if (event.target.matches('[data-record-page-size]')) {
      state.recordPageSize = Number(event.target.value) || 10;
      state.recordPage = 1;
      renderView();
    } else if (event.target.matches('[data-audit-page-size]')) {
      state.auditPageSize = Number(event.target.value) || 10;
      state.auditPage = 1;
      renderView();
    } else if (event.target.matches('[data-app-status]')) {
      var currentAppInput = document.querySelector('.dm-personal-search input');
      state.appDraftKeyword = currentAppInput ? currentAppInput.value.trim() : state.appDraftKeyword;
      state.appKeyword = state.appDraftKeyword;
      state.appStatus = event.target.value;
      state.appPage = 1;
      renderView();
    } else if (event.target.matches('[data-app-page-size]')) {
      state.appPageSize = Number(event.target.value) || 10;
      state.appPage = 1;
      renderView();
    } else if (event.target.matches('[data-message-page-size]')) {
      state.messagePageSize = Number(event.target.value) || 10;
      state.messagePage = 1;
      renderView();
    } else if (event.target.matches('[data-audit-status]')) {
      state.auditStatus = event.target.value;
      state.auditPage = 1;
      state.auditSelected = {};
      renderView();
    } else if (event.target.matches('[data-audit-type]')) {
      state.auditType = event.target.value;
      state.auditPage = 1;
      state.auditSelected = {};
      renderView();
    } else if (event.target.matches('[data-audit-check-all]')) {
      var visibleAuditItems = getFilteredAuditItems();
      var auditStart = (state.auditPage - 1) * state.auditPageSize;
      visibleAuditItems.slice(auditStart, auditStart + state.auditPageSize).forEach(function (item) { state.auditSelected[item.id] = event.target.checked; });
      renderView();
    } else if (event.target.matches('[data-audit-check]')) {
      state.auditSelected[event.target.dataset.auditCheck] = event.target.checked;
    } else if (event.target.matches('.dm-page-size')) {
      state.pageSize = Number(event.target.value) || 10;
      state.page = 1;
      refreshDirectoryResults();
    } else if (event.target.matches('[data-api-limit]')) {
      state.apiLimit = event.target.value;
      var limitFields = document.querySelector('[data-api-limit-fields]');
      if (limitFields) limitFields.innerHTML = apiLimitFieldsHtml();
    } else if (event.target.matches('[data-field-all]')) {
      document.querySelectorAll('[data-field-check]').forEach(function (checkbox) { checkbox.checked = event.target.checked; });
      updatePermissionCount();
    } else if (event.target.matches('[data-field-check]')) {
      var fields = document.querySelectorAll('[data-field-check]');
      var selected = document.querySelectorAll('[data-field-check]:checked');
      var all = document.querySelector('[data-field-all]');
      if (all) { all.checked = selected.length === fields.length; all.indeterminate = selected.length > 0 && selected.length < fields.length; }
      updatePermissionCount();
    }
  }

  function updatePermissionCount() {
    var total = document.querySelectorAll('[data-field-check]').length;
    var selected = document.querySelectorAll('[data-field-check]:checked').length;
    var count = document.querySelector('[data-field-count]');
    if (count) count.textContent = '（' + selected + '/' + total + '）';
  }

  function handleSubmit(event) {
    if (event.target.matches('[data-system-user-form]')) {
      event.preventDefault();
      var editedUserId = Number(event.target.dataset.userId);
      var editedUser = SYSTEM_USERS.find(function (user) { return user.id === editedUserId; });
      var departmentValue = event.target.querySelector('[name="department"]').value;
      var departmentPaths = { my: '数据中台演示 / 我的部门', business: '数据中台演示 / 我的部门 / 业务部', engineering: '数据中台演示 / 我的部门 / 工程部' };
      if (editedUser) {
        editedUser.name = event.target.querySelector('[name="name"]').value.trim();
        editedUser.gender = event.target.querySelector('[name="gender"]').value;
        editedUser.departmentId = departmentValue;
        editedUser.department = departmentPaths[departmentValue];
        editedUser.phone = event.target.querySelector('[name="phone"]').value.trim();
        editedUser.email = event.target.querySelector('[name="email"]').value.trim();
        editedUser.status = event.target.querySelector('[name="status"]').value;
        editedUser.role = event.target.querySelector('[name="role"]').value;
      } else {
        var nextUserId = SYSTEM_USERS.reduce(function (max, user) { return Math.max(max, user.id); }, 900) + 1;
        SYSTEM_USERS.unshift({ id: nextUserId, account: event.target.querySelector('[name="account"]').value.trim(), name: event.target.querySelector('[name="name"]').value.trim(), gender: event.target.querySelector('[name="gender"]').value, department: departmentPaths[departmentValue], departmentId: departmentValue, phone: event.target.querySelector('[name="phone"]').value.trim(), email: event.target.querySelector('[name="email"]').value.trim(), status: event.target.querySelector('[name="status"]').value, role: event.target.querySelector('[name="role"]').value });
      }
      closeModal();
      renderView();
      showToast(editedUser ? '用户信息已保存' : '用户已新增');
      return;
    }
    if (event.target.matches('[data-system-user-import-form]')) {
      event.preventDefault();
      closeModal();
      showToast('用户文件导入完成');
      return;
    }
    if (event.target.matches('[data-department-form]')) {
      event.preventDefault();
      closeModal();
      showToast('部门信息已保存');
      return;
    }
    if (event.target.matches('[data-system-config-form]')) {
      event.preventDefault();
      var configName = event.target.querySelector('[name="siteName"]');
      state.systemConfigMode = event.target.querySelector('[name="mode"]').value;
      if (configName) state.systemConfigName = configName.value.trim();
      state.systemConfigFooter1 = event.target.querySelector('[name="footer1"]').value.trim();
      state.systemConfigFooter2 = event.target.querySelector('[name="footer2"]').value.trim();
      state.systemConfigFooter3 = event.target.querySelector('[name="footer3"]').value.trim();
      var brandTitle = document.querySelector('.dm-brand-title');
      if (brandTitle && state.systemConfigMode === 'standard') brandTitle.textContent = state.systemConfigName;
      renderView();
      showToast('系统配置已保存');
      return;
    }
    if (event.target.matches('[data-system-audit-process-form]')) {
      event.preventDefault();
      var systemAuditDecision = event.target.querySelector('[name="decision"]').value;
      var systemAuditComment = event.target.querySelector('[name="comment"]').value.trim();
      var systemAuditIds = (event.target.dataset.systemAuditIds || '').split(',').map(Number).filter(Boolean);
      systemAuditIds.forEach(function (id) {
        var reviewedItem = findManagementItem(id);
        if (!reviewedItem) return;
        var isUpAudit = reviewedItem.auditStatus === 'up-pending';
        if (isUpAudit) {
          reviewedItem.publishStatus = systemAuditDecision === 'approved' ? 'online' : 'pending';
          reviewedItem.auditStatus = systemAuditDecision === 'approved' ? 'up-approved' : 'up-rejected';
          if (systemAuditDecision === 'approved') reviewedItem.releasedAt = '2026-09-24 16:18:32';
        } else {
          reviewedItem.publishStatus = systemAuditDecision === 'approved' ? 'pending' : 'online';
          reviewedItem.auditStatus = systemAuditDecision === 'approved' ? 'down-approved' : 'down-rejected';
        }
        reviewedItem.updatedAt = '2026-09-24 16:18:32';
        reviewedItem.auditHistory.unshift(['2026-09-24 16:18:32', '演示', systemAuditDecision === 'approved' ? '审核通过' : '审核驳回', '处理意见：' + (systemAuditComment || (systemAuditDecision === 'approved' ? '资料完整，同意处理' : '资料不完整，退回修改'))]);
        delete state.systemAuditSelected[id];
      });
      closeModal();
      renderView();
      showToast(systemAuditDecision === 'approved' ? '审核已通过' : '审核已驳回');
      return;
    }
    if (event.target.matches('[data-management-edit-form]')) {
      event.preventDefault();
      var managementItem = findManagementItem(event.target.dataset.managementId);
      if (!managementItem) return;
      managementItem.title = event.target.querySelector('[name="title"]').value.trim();
      managementItem.englishName = event.target.querySelector('[name="englishName"]').value.trim();
      managementItem.description = event.target.querySelector('[name="description"]').value.trim();
      managementItem.category = event.target.querySelector('[name="category"]').value.trim();
      managementItem.domain = event.target.querySelector('[name="domain"]').value;
      managementItem.manager = event.target.querySelector('[name="manager"]').value.trim();
      managementItem.phone = event.target.querySelector('[name="phone"]').value.trim();
      managementItem.frequency = event.target.querySelector('[name="frequency"]').value;
      managementItem.updatedAt = '2026-09-24 15:42:26';
      managementItem.auditHistory.unshift(['2026-09-24 15:42:26', 'present', '保存编制', '处理意见：保存数据基本信息']);
      state.view = 'data-management';
      renderView();
      showToast('数据已保存');
      return;
    }
    if (event.target.matches('[data-app-form]')) {
      event.preventDefault();
      var appName = event.target.querySelector('[name="name"]');
      var appDescription = event.target.querySelector('[name="description"]');
      var decryptEnabled = event.target.querySelector('[name="decryptEnabled"]');
      var appSubmitter = event.submitter && event.submitter.dataset.appSubmit || 'save';
      var nextId = MY_APPLICATIONS.reduce(function (max, item) { return Math.max(max, item.id); }, 300) + 1;
      MY_APPLICATIONS.unshift({ id: nextId, name: appName.value.trim(), status: appSubmitter === 'apply' ? 'pending' : 'draft', appId: 'DG20260924' + String(nextId).slice(-3), appKey: 'AK8M3Q7V2L9C5T4N', decryptKey: decryptEnabled.checked ? 'DK4P9H2W7B5R8M3C' : '未启用', description: appDescription.value.trim(), updatedAt: '2026-09-24 10:45:18', decryptEnabled: decryptEnabled.checked });
      closeModal();
      renderView();
      showToast(appSubmitter === 'apply' ? '应用已保存并提交申请' : '应用草稿已保存');
      return;
    }
    if (event.target.matches('[data-account-form]')) {
      event.preventDefault();
      ACCOUNT_INFO.name = event.target.querySelector('[name="name"]').value.trim();
      ACCOUNT_INFO.phone = event.target.querySelector('[name="phone"]').value.trim();
      ACCOUNT_INFO.email = event.target.querySelector('[name="email"]').value.trim();
      renderView();
      showToast('账号信息已保存');
      return;
    }
    if (event.target.matches('[data-password-form]')) {
      event.preventDefault();
      var newPassword = event.target.querySelector('[name="newPassword"]');
      var confirmPassword = event.target.querySelector('[name="confirmPassword"]');
      if (newPassword.value !== confirmPassword.value) { showToast('两次输入的新密码不一致'); return; }
      closeModal();
      showToast('密码修改成功');
      return;
    }
    if (event.target.matches('[data-audit-process-form]')) {
      event.preventDefault();
      var decisionInput = event.target.querySelector('[name="decision"]');
      var commentInput = event.target.querySelector('[data-audit-comment]');
      var decision = decisionInput ? decisionInput.value : 'approved';
      var ids = (event.target.dataset.auditIds || '').split(',').map(Number).filter(Boolean);
      ids.forEach(function (id) {
        var auditItem = findAuditItem(id);
        if (!auditItem) return;
        auditItem.status = decision;
        auditItem.completedAt = '2026-09-24 10:28:16';
        auditItem.operator = '演示';
        auditItem.decision = commentInput ? commentInput.value.trim() : '';
        delete state.auditSelected[id];
      });
      closeModal();
      renderView();
      showToast(decision === 'approved' ? '审核已通过' : '审核已驳回');
      return;
    }
    if (!event.target.matches('[data-apply-form]')) return;
    event.preventDefault();
    var item = findResource(event.target.dataset.resourceId);
    var isChange = event.target.dataset.applyKind === 'change';
    if (item) {
      if (!isChange) item.applied = true;
      item.applies += 1;
    }
    closeModal();
    if (state.view === 'detail') renderView();
    else refreshDirectoryResults();
    showToast(isChange ? '变更申请已提交' : '申请已提交');
  }

  return {
    html: '<div class="page-data-map"><header class="dm-header"><div class="dm-header-inner"><a class="dm-brand" href="javascript:;" aria-label="数据地图首页"><span class="dm-brand-mark"><img src="img/logo.png" alt="数据地图"></span><span class="dm-brand-title">数据目录</span></a>' +
      '<nav class="dm-main-nav" aria-label="数据地图菜单"><div class="dm-nav-group"><button type="button" class="dm-nav-link active" data-view="home" data-dm-menu="首页">首页</button></div><div class="dm-nav-group"><button type="button" class="dm-nav-link" data-view="directory" data-dm-menu="数据地图">数据地图</button></div>' +
      '<div class="dm-nav-group"><button type="button" class="dm-nav-link" data-dm-menu="个人中心">个人中心<i class="bi bi-chevron-down"></i></button><div class="dm-dropdown"><button type="button" data-personal-view="my-data">我的数据</button><button type="button" data-personal-view="audit-center">审核中心</button><button type="button" data-personal-view="favorites">我的收藏</button><button type="button" data-personal-view="applications">我的应用</button><button type="button" data-personal-view="account-info">账号信息</button><button type="button" data-personal-view="messages">我的消息</button></div></div>' +
      '<div class="dm-nav-group"><button type="button" class="dm-nav-link" data-dm-menu="运行监控">运行监控<i class="bi bi-chevron-down"></i></button><div class="dm-dropdown"><button type="button" data-monitor-view="api-monitor">API监控</button><button type="button" data-monitor-view="application-records">申请记录</button></div></div>' +
      '<div class="dm-nav-group"><button type="button" class="dm-nav-link" data-dm-menu="系统管理">系统管理<i class="bi bi-chevron-down"></i></button><div class="dm-dropdown"><button type="button" data-system-view="data-management">数据管理</button><button type="button" data-system-view="system-audit-center">审核中心</button><button type="button" data-system-view="system-user-management">用户管理</button><button type="button" data-system-view="system-role-management">角色管理</button><button type="button" data-system-view="system-config">系统配置</button><button type="button" data-system-view="system-operation-log">操作日志</button></div></div></nav>' +
      '<div class="dm-header-user">演示</div></div></header><div class="dm-view-root"></div><div class="dm-map-toast" role="status" aria-live="polite"></div></div>',

    init: function (opts) {
      var allowedViews = ['home', 'directory', 'my-data', 'favorites', 'audit-center', 'applications', 'account-info', 'messages', 'detail', 'api-test', 'api-monitor', 'application-records', 'api-monitor-detail', 'data-management', 'data-management-edit', 'system-audit-center', 'system-audit-detail', 'system-user-management', 'system-role-management', 'system-config', 'system-operation-log'];
      var requestedView = opts && allowedViews.indexOf(opts.dmView) > -1 ? opts.dmView : 'home';
      var requestedResource = opts && opts.dmResource ? findResource(opts.dmResource) : null;
      if ((requestedView === 'detail' || requestedView === 'api-test') && !requestedResource) requestedView = 'directory';
      state.view = requestedView;
      if (requestedView === 'detail' && requestedResource) {
        state.detailResourceId = requestedResource.id;
        state.detailOrigin = opts && ['directory', 'my-data', 'favorites'].indexOf(opts.dmOrigin) > -1 ? opts.dmOrigin : requestedResource.id >= 100 ? 'my-data' : 'directory';
        state.detailTab = opts.dmDetailTab || (requestedResource.type === 'api' || requestedResource.type === 'orchestration' ? 'api-doc' : requestedResource.type === 'dataset' ? 'fields' : 'preview');
      } else if (requestedView === 'api-test' && requestedResource && requestedResource.type === 'api') {
        state.testResourceId = requestedResource.id;
        state.detailOrigin = 'my-data';
      } else if (requestedView === 'api-test') {
        state.view = 'my-data';
      }
      if (requestedView === 'api-monitor-detail') {
        var requestedMonitor = opts && opts.dmMonitorId ? findMonitorItem(opts.dmMonitorId) : null;
        if (requestedMonitor && requestedMonitor.type === 'api') {
          state.monitorDetailId = requestedMonitor.id;
          state.monitorDetailOrigin = opts && ['api-monitor', 'application-records'].indexOf(opts.dmMonitorOrigin) > -1 ? opts.dmMonitorOrigin : 'api-monitor';
        } else {
          state.view = 'api-monitor';
        }
      }
      if (requestedView === 'data-management-edit') {
        var requestedManagementItem = opts && opts.dmManagementId ? findManagementItem(opts.dmManagementId) : null;
        if (requestedManagementItem) {
          state.managementEditId = requestedManagementItem.id;
          var managementTabs = requestedManagementItem.type === 'api' || requestedManagementItem.type === 'orchestration' ? ['api-doc'] : ['fields', 'preview'];
          state.managementEditTab = opts && managementTabs.indexOf(opts.dmManagementTab) > -1 ? opts.dmManagementTab : managementTabs[0];
        } else {
          state.view = 'data-management';
        }
      }
      if (requestedView === 'system-audit-detail') {
        var requestedSystemAuditItem = opts && opts.dmSystemAuditId ? findManagementItem(opts.dmSystemAuditId) : null;
        if (requestedSystemAuditItem && requestedSystemAuditItem.auditStatus !== 'pending') {
          state.systemAuditDetailId = requestedSystemAuditItem.id;
          var systemAuditTabs = requestedSystemAuditItem.type === 'api' || requestedSystemAuditItem.type === 'orchestration' ? ['api-doc'] : ['fields', 'preview'];
          state.systemAuditDetailTab = opts && systemAuditTabs.indexOf(opts.dmSystemAuditTab) > -1 ? opts.dmSystemAuditTab : systemAuditTabs[0];
        } else {
          state.view = 'system-audit-center';
        }
      }
      state.homeTab = opts && (opts.dmHomeTab === 'public' || opts.dmHomeTab === 'enterprise') ? opts.dmHomeTab : 'public';
      state.auditTab = opts && ['pending', 'processed', 'initiated'].indexOf(opts.dmAuditTab) > -1 ? opts.dmAuditTab : 'pending';
      state.messageTab = opts && ['unread', 'history'].indexOf(opts.dmMessageTab) > -1 ? opts.dmMessageTab : 'unread';
      state.treeKeyword = '';
      state.draftKeyword = '';
      state.keyword = '';
      state.type = 'all';
      state.page = 1;
      var page = document.querySelector('.page-data-map');
      if (!page) return;
      renderView();
      page.addEventListener('click', handleClick);
      page.addEventListener('input', handleInput);
      page.addEventListener('keydown', handleKeydown);
      page.addEventListener('change', handleChange);
      page.addEventListener('submit', handleSubmit);
      document.addEventListener('click', function (event) {
        if (!event.target.closest('.dm-nav-group')) document.querySelectorAll('.dm-nav-group.open').forEach(function (group) { group.classList.remove('open'); });
        if (!event.target.closest('.dm-management-category-picker')) document.querySelectorAll('.dm-management-category-picker.open').forEach(function (picker) { picker.classList.remove('open'); });
        if (event.target.classList.contains('dm-modal-mask')) closeModal();
      });
    }
  };

  /* 旧版单首页返回结构保留在源码历史中，不再参与运行。
  return {
    html: `
      <div class="page-data-map">
        <header class="dm-header">
          <div class="dm-header-inner">
            <a class="dm-brand" href="javascript:;" aria-label="数据地图首页">
              <span class="dm-brand-mark"><img src="img/logo.png" alt="数据地图"></span>
              <span class="dm-brand-title">数据地图</span>
            </a>
            <nav class="dm-main-nav" aria-label="数据地图菜单">
              <div class="dm-nav-group">
                <button type="button" class="dm-nav-link active" data-dm-home data-dm-menu="首页">首页</button>
              </div>
              <div class="dm-nav-group">
                <button type="button" class="dm-nav-link" data-dm-menu="数据地图">数据地图</button>
              </div>
              <div class="dm-nav-group">
                <button type="button" class="dm-nav-link" data-dm-menu="个人中心">个人中心<i class="bi bi-chevron-down"></i></button>
                <div class="dm-dropdown">
                  <button type="button" data-dm-menu="我的数据">我的数据</button>
                  <button type="button" data-dm-menu="审核中心">审核中心</button>
                  <button type="button" data-dm-menu="我的收藏">我的收藏</button>
                  <button type="button" data-dm-menu="我的应用">我的应用</button>
                  <button type="button" data-dm-menu="账号信息">账号信息</button>
                  <button type="button" data-dm-menu="我的消息">我的消息</button>
                </div>
              </div>
              <div class="dm-nav-group">
                <button type="button" class="dm-nav-link" data-dm-menu="运行监控">运行监控<i class="bi bi-chevron-down"></i></button>
                <div class="dm-dropdown">
                  <button type="button" data-dm-menu="API监控">API监控</button>
                  <button type="button" data-dm-menu="申请记录">申请记录</button>
                </div>
              </div>
              <div class="dm-nav-group">
                <button type="button" class="dm-nav-link" data-dm-menu="系统管理">系统管理<i class="bi bi-chevron-down"></i></button>
                <div class="dm-dropdown">
                  <button type="button" data-dm-menu="数据管理">数据管理</button>
                  <button type="button" data-dm-menu="审核中心">审核中心</button>
                  <button type="button" data-dm-menu="用户管理">用户管理</button>
                  <button type="button" data-dm-menu="角色管理">角色管理</button>
                  <button type="button" data-dm-menu="系统配置">系统配置</button>
                  <button type="button" data-dm-menu="操作日志">操作日志</button>
                </div>
              </div>
            </nav>
            <div class="dm-header-user">演示-测试</div>
          </div>
        </header>

        <section class="dm-hero" aria-label="数据地图横幅"></section>

        <section class="dm-search-panel" aria-label="数据搜索">
          <div class="dm-search-row">
            <input class="dm-search-input" type="text" aria-label="搜索关键字">
            <button type="button" class="dm-search-btn"><i class="bi bi-search"></i><span>搜索</span></button>
          </div>
          <div class="dm-hot-row">
            <span class="dm-hot-label">热门搜索：</span>
            <button type="button" class="dm-hot-tag" data-keyword="行政区划">行政区划</button>
            <button type="button" class="dm-hot-tag" data-keyword="信用代码">信用代码</button>
            <button type="button" class="dm-hot-tag" data-keyword="考勤">考勤</button>
            <button type="button" class="dm-hot-tag" data-keyword="库存">库存</button>
          </div>
        </section>

        <section class="dm-tabs-wrap" aria-label="数据类型切换">
          <div class="dm-tabs">
            <button type="button" class="dm-tab active" data-dm-tab="public">公共数据</button>
            <button type="button" class="dm-tab" data-dm-tab="enterprise">企业数据</button>
          </div>
        </section>

        <section class="dm-stats-section" aria-label="数据概览">
          <div class="dm-stats-grid" id="dmStatsGrid"></div>
        </section>

        <section class="dm-resource-section" aria-label="数据资源列表">
          <div class="dm-resource-grid" id="dmResourceGrid"></div>
        </section>

        <footer class="dm-footer">
          <div class="dm-company">深圳市傲天科技股份有限公司</div>
          <div class="dm-record"><i class="bi bi-record-circle-fill"></i>备案：ICP备05000003号-2&nbsp;&nbsp;|&nbsp;&nbsp;公网安备33010502001397号&nbsp;&nbsp;|&nbsp;&nbsp;网站标识码：3301000005</div>
          <div class="dm-browser-tip">建议使用1366*768以上分辨率/Chrome、IE9或以上浏览器访问达到最佳效果</div>
        </footer>
        <div class="dm-map-toast" role="status" aria-live="polite"></div>
      </div>
    `,

    init: function () {
      setActiveTab('public');

      document.querySelectorAll('.dm-tab').forEach(function (tab) {
        tab.addEventListener('click', function () {
          setActiveTab(tab.dataset.dmTab || 'public');
        });
      });

      document.querySelector('.dm-search-btn')?.addEventListener('click', runSearch);
      document.querySelector('.dm-search-input')?.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') runSearch();
      });

      document.querySelectorAll('.dm-hot-tag').forEach(function (tag) {
        tag.addEventListener('click', function () {
          var input = document.querySelector('.dm-search-input');
          if (input) input.value = tag.dataset.keyword || tag.textContent.trim();
          runSearch();
        });
      });

      function setActiveMenu(link, dropdownItem) {
        document.querySelectorAll('.dm-nav-link.active').forEach(function (item) {
          item.classList.remove('active');
        });
        document.querySelectorAll('.dm-dropdown button.active').forEach(function (item) {
          item.classList.remove('active');
        });
        if (link) link.classList.add('active');
        if (dropdownItem) dropdownItem.classList.add('active');
      }

      document.querySelectorAll('.dm-nav-group').forEach(function (group) {
        var link = group.querySelector('.dm-nav-link');
        if (!link) return;
        link.addEventListener('click', function () {
          var isDropdown = !!group.querySelector('.dm-dropdown');
          setActiveMenu(link);
          document.querySelectorAll('.dm-nav-group.open').forEach(function (openGroup) {
            if (openGroup !== group) openGroup.classList.remove('open');
          });
          if (isDropdown) group.classList.toggle('open');
          if (!link.hasAttribute('data-dm-home')) showToast('原型仅完成首页：' + (link.dataset.dmMenu || link.textContent.trim()));
        });
      });

      document.querySelectorAll('.dm-dropdown button').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
          e.stopPropagation();
          var group = btn.closest('.dm-nav-group');
          var link = group ? group.querySelector('.dm-nav-link') : null;
          setActiveMenu(link, btn);
          if (group) group.classList.remove('open');
          showToast('原型仅完成首页：' + (btn.dataset.dmMenu || btn.textContent.trim()));
        });
      });

      document.addEventListener('click', function (e) {
        if (!e.target.closest('.dm-nav-group')) {
          document.querySelectorAll('.dm-nav-group.open').forEach(function (group) {
            group.classList.remove('open');
          });
        }
      });
    }
  };
  */
})();
