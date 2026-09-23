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
    { id: 4, catalog: 'public-market', type: 'db', title: '企业变更登记信息表', description: '记录市场主体名称、法定代表人、住所和经营范围等变更事项。', category: '公共目录 / 市场主体数据', views: 187, applies: 18, releasedAt: '2026-06-08 15:42:07', updatedAt: '2026-09-21 23:40:15', frequency: '每日', version: 'V1.0', favorite: false, applied: false },
    { id: 5, catalog: 'public-city', type: 'dataset', title: '城市道路运行指数数据集', description: '提供城市主要道路分时段拥堵指数、平均速度和运行等级。', category: '公共目录 / 城市运行数据', views: 246, applies: 22, releasedAt: '2026-05-22 09:30:18', updatedAt: '2026-09-22 09:15:00', frequency: '每15分钟', version: 'V1.3', favorite: false, applied: false },
    { id: 6, catalog: 'public-city', type: 'db', title: '公共设施空间位置表', description: '记录公共停车场、充电站、服务网点等设施的空间位置。', category: '公共目录 / 城市运行数据', views: 168, applies: 14, releasedAt: '2026-05-18 16:12:42', updatedAt: '2026-09-20 18:26:51', frequency: '每周', version: 'V1.0', favorite: false, applied: true },
    { id: 7, catalog: 'public-service', type: 'orchestration', title: '公共服务事项联办查询', description: '编排事项目录、办件进度和结果反馈接口，提供联办查询能力。', category: '公共目录 / 公共服务数据', views: 205, applies: 27, releasedAt: '2026-06-02 13:18:09', updatedAt: '2026-09-21 15:12:44', frequency: '实时', version: 'V1.6', favorite: true, applied: false },
    { id: 8, catalog: 'public-service', type: 'api', title: '气象预警信息查询服务', description: '查询预警类型、等级、影响区域、发布时间及防御指引。', category: '公共目录 / 公共服务数据', views: 232, applies: 29, releasedAt: '2026-05-30 08:35:16', updatedAt: '2026-09-22 09:45:21', frequency: '每小时', version: 'V2.1', favorite: false, applied: false },
    { id: 9, catalog: 'mine-logistics', type: 'api', title: '运输订单轨迹查询服务', description: '根据运输单号查询车辆节点、当前位置及预计到达时间。', category: '我的目录 / 物流运营数据', views: 156, applies: 17, releasedAt: '2026-06-20 10:05:36', updatedAt: '2026-09-22 09:28:10', frequency: '实时', version: 'V1.5', favorite: true, applied: false },
    { id: 10, catalog: 'mine-logistics', type: 'db', title: '仓库库存流水明细表', description: '记录商品入库、出库、调拨、盘点及库存结余等流水信息。', category: '我的目录 / 物流运营数据', views: 144, applies: 13, releasedAt: '2026-06-15 17:40:26', updatedAt: '2026-09-22 08:50:42', frequency: '每小时', version: 'V1.2', favorite: false, applied: true },
    { id: 11, catalog: 'mine-customer', type: 'dataset', title: '客户服务工单主题数据集', description: '汇总咨询、投诉、建议类工单的渠道、时效和处置结果。', category: '我的目录 / 客户服务数据', views: 131, applies: 12, releasedAt: '2026-06-10 09:54:14', updatedAt: '2026-09-21 20:12:31', frequency: '每日', version: 'V1.3', favorite: false, applied: false },
    { id: 12, catalog: 'mine-customer', type: 'orchestration', title: '客户诉求闭环处置服务', description: '编排工单创建、分派、回访和评价接口，支撑诉求闭环处置。', category: '我的目录 / 客户服务数据', views: 118, applies: 10, releasedAt: '2026-06-06 14:26:53', updatedAt: '2026-09-20 16:38:05', frequency: '实时', version: 'V1.1', favorite: true, applied: false }
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
    page: 1, pageSize: 10, detailResourceId: 0, detailTab: '', apiLimit: 'term'
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
    var toast = document.querySelector('.dm-toast');
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

  function directoryViewHtml() {
    return '<div class="dm-directory-page"><div class="dm-breadcrumb"><i class="bi bi-house-door"></i><span>首页</span><i class="bi bi-chevron-right"></i><strong>数据地图</strong></div><div class="dm-directory-layout">' +
      '<aside class="dm-catalog-panel"><h2><i class="bi bi-diagram-3"></i>数据地图</h2><label class="dm-tree-search"><input type="text" value="' + escapeHtml(state.treeKeyword) + '" placeholder="请输入" aria-label="搜索目录"><i class="bi bi-search"></i></label><div class="dm-catalog-tree">' + treeHtml() + '</div></aside>' +
      '<main class="dm-directory-main"><section class="dm-directory-search"><div class="dm-directory-search-row"><input type="text" value="' + escapeHtml(state.draftKeyword) + '" placeholder="请输入数据资源名称或简介" aria-label="搜索数据资源"><button type="button" data-directory-search><i class="bi bi-search"></i>搜索</button></div></section><section class="dm-directory-results">' + resultPanelHtml() + '</section></main></div></div>';
  }

  function getFieldProfile(item) {
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
      code: 'DM' + String(202609220000 + item.id), englishName: englishNames[item.id] || ('data_resource_' + item.id), domain: domain,
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

  function detailTabsHtml(item) {
    var isApi = item.type === 'api' || item.type === 'orchestration';
    var tabs = isApi ? [['api-doc', 'API文档']] : item.type === 'dataset' ? [['fields', '数据项'], ['preview', '数据预览'], ['download', '文件下载']] : [['preview', '数据预览'], ['fields', '数据项']];
    return '<div class="dm-detail-tabs">' + tabs.map(function (tab) { return '<button type="button" class="' + (state.detailTab === tab[0] ? 'active' : '') + '" data-detail-tab="' + tab[0] + '">' + tab[1] + '</button>'; }).join('') + '</div>';
  }

  function detailContentHtml(item) {
    var profile = getFieldProfile(item);
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
    return '<div class="dm-detail-page"><div class="dm-breadcrumb"><i class="bi bi-house-door"></i><span>首页</span><i class="bi bi-chevron-right"></i><span>数据地图</span><i class="bi bi-chevron-right"></i><strong>' + escapeHtml(item.title) + '</strong></div>' +
      '<main class="dm-detail-main"><section class="dm-detail-heading"><div><i class="bi bi-list-ul"></i><h2>' + escapeHtml(item.title) + '</h2><span class="dm-type-tag ' + meta.className + '">' + meta.label + '</span></div><div class="dm-detail-actions">' +
        (!item.applied ? '<button type="button" class="dm-dir-btn primary" data-apply-id="' + item.id + '"><i class="bi bi-send"></i>申请</button>' : '') +
        '<button type="button" class="dm-dir-btn" data-favorite-id="' + item.id + '"><i class="bi ' + (item.favorite ? 'bi-star-fill' : 'bi-star') + '"></i>' + (item.favorite ? '取消收藏' : '加入收藏') + '</button>' +
        '<button type="button" class="dm-dir-btn" data-detail-back><i class="bi bi-arrow-left"></i>返回</button></div></section>' +
      '<section class="dm-detail-meta">' + detailMetaHtml(item) + '</section><section class="dm-detail-data">' + detailTabsHtml(item) + '<div class="dm-detail-tab-panel">' + detailContentHtml(item) + '</div></section></main></div>';
  }

  function setActiveMenu(menuName, dropdownItem) {
    document.querySelectorAll('.dm-nav-link').forEach(function (item) { item.classList.toggle('active', item.dataset.dmMenu === menuName); });
    document.querySelectorAll('.dm-dropdown button').forEach(function (item) { item.classList.toggle('active', item === dropdownItem); });
  }

  function renderView() {
    var root = document.querySelector('.dm-view-root');
    if (!root) return;
    root.innerHTML = state.view === 'detail' ? detailViewHtml() : state.view === 'directory' ? directoryViewHtml() : homeViewHtml();
    setActiveMenu(state.view === 'home' ? '首页' : '数据地图');
  }

  function refreshDirectoryResults() {
    var results = document.querySelector('.dm-directory-results');
    if (results) results.innerHTML = resultPanelHtml();
  }

  function findResource(id) {
    return DIRECTORY_RESOURCES.find(function (item) { return item.id === Number(id); });
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
    document.querySelector('.page-data-map').insertAdjacentHTML('beforeend', '<div class="dm-modal-mask" role="dialog" aria-modal="true" aria-label="' + title + '"><form class="dm-modal dm-apply-modal" data-apply-form data-resource-id="' + item.id + '"><div class="dm-modal-head"><h3>' + title + '</h3><button type="button" data-modal-close aria-label="关闭"><i class="bi bi-x-lg"></i></button></div><div class="dm-modal-body">' + applySummaryHtml(item) +
      '<label class="dm-form-item"><span><em>*</em>使用限制</span><select name="useLimit" data-api-limit required><option value="term" ' + (state.apiLimit === 'term' ? 'selected' : '') + '>使用期限</option><option value="times" ' + (state.apiLimit === 'times' ? 'selected' : '') + '>使用次数</option><option value="both" ' + (state.apiLimit === 'both' ? 'selected' : '') + '>使用期限+使用次数</option></select></label><div data-api-limit-fields>' + apiLimitFieldsHtml() + '</div>' +
      '<label class="dm-form-item"><span>审核人员</span><select name="reviewer">' + reviewerOptions() + '</select></label><label class="dm-form-item"><span>申请IP</span><input name="ip" type="text" value="10.20.16.35" placeholder="多个IP用英文分号隔开，*不限制"></label>' + reasonFieldHtml() + '</div><div class="dm-modal-foot"><button type="button" class="dm-dir-btn" data-modal-close><i class="bi bi-x-circle"></i>取消</button><button type="submit" class="dm-dir-btn primary"><i class="bi bi-check2-circle"></i>确定</button></div></form></div>');
  }

  function openDatasetApply(item) {
    document.querySelector('.page-data-map').insertAdjacentHTML('beforeend', '<div class="dm-modal-mask" role="dialog" aria-modal="true" aria-label="数据集申请"><form class="dm-modal dm-apply-modal" data-apply-form data-resource-id="' + item.id + '"><div class="dm-modal-head"><h3>数据集申请</h3><button type="button" data-modal-close aria-label="关闭"><i class="bi bi-x-lg"></i></button></div><div class="dm-modal-body">' + applySummaryHtml(item) +
      '<div class="dm-form-item"><span><em>*</em>使用期限</span>' + dateRangeHtml('dataset') + '</div><label class="dm-form-item"><span><em>*</em>使用应用</span><select name="application" required><option value="">请选择</option><option selected>数据治理运营分析</option><option>城市运行监测</option><option>企业综合服务</option></select></label>' +
      '<label class="dm-form-item"><span>审核人员</span><select name="reviewer">' + reviewerOptions() + '</select></label><label class="dm-form-item"><span>申请IP</span><input name="ip" type="text" value="10.20.16.35" placeholder="多个IP用英文分号隔开，*不限制"></label>' + reasonFieldHtml() + '</div><div class="dm-modal-foot"><button type="button" class="dm-dir-btn" data-modal-close><i class="bi bi-x-circle"></i>取消</button><button type="submit" class="dm-dir-btn primary"><i class="bi bi-check2-circle"></i>确定</button></div></form></div>');
  }

  function openDatabaseApply(item) {
    var profile = getFieldProfile(item);
    document.querySelector('.page-data-map').insertAdjacentHTML('beforeend', '<div class="dm-modal-mask" role="dialog" aria-modal="true" aria-label="数据库表申请"><form class="dm-modal dm-db-apply-modal" data-apply-form data-resource-id="' + item.id + '"><div class="dm-modal-head"><h3>数据库表申请</h3><button type="button" data-modal-close aria-label="关闭"><i class="bi bi-x-lg"></i></button></div><div class="dm-modal-body">' +
      '<div class="dm-db-apply-intro"><h4>' + escapeHtml(item.title) + '［' + item.version + '］</h4><div><span>数据类型：数据库表</span><span>数据分类：' + escapeHtml(item.category) + '</span><span>发布日期：' + item.releasedAt.slice(0, 10) + '</span><span>更新频率：' + item.frequency + '</span></div><p>数据简介：' + escapeHtml(item.description) + '</p></div>' +
      '<div class="dm-db-form"><div class="dm-form-item"><span><em>*</em>使用期限</span>' + dateRangeHtml('db') + '</div><label class="dm-form-item"><span>审核人员</span><select name="reviewer"><option value="">请选择</option><option selected>张璐</option><option>刘明</option><option>陈燕</option></select></label>' + reasonFieldHtml() + '</div>' +
      '<div class="dm-permission-title"><span>数据项权限：</span><strong data-field-count>（' + profile.fields.length + '/' + profile.fields.length + '）</strong></div>' + fieldTableHtml(profile, true, true) + '</div><div class="dm-modal-foot"><button type="submit" class="dm-dir-btn primary"><i class="bi bi-check2-circle"></i>确定</button><button type="button" class="dm-dir-btn" data-modal-close><i class="bi bi-x-circle"></i>取消</button></div></form></div>');
  }

  function openTypeApply(item) {
    if (!item) return;
    state.apiLimit = 'term';
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
    if (target.matches('.dm-brand, [data-view="home"]')) {
      state.view = 'home';
      renderView();
    } else if (target.dataset.view === 'directory') {
      state.view = 'directory';
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
    } else if (target.matches('.dm-tab')) {
      state.homeTab = target.dataset.dmTab || 'public';
      renderView();
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
      state.page = 1;
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
    } else if (target.matches('[data-detail-id]')) {
      var detailItem = findResource(target.dataset.detailId);
      if (detailItem) {
        state.detailResourceId = detailItem.id;
        state.detailTab = detailItem.type === 'api' || detailItem.type === 'orchestration' ? 'api-doc' : detailItem.type === 'dataset' ? 'fields' : 'preview';
        state.view = 'detail';
        renderView();
      }
    } else if (target.matches('[data-apply-id]')) {
      openTypeApply(findResource(target.dataset.applyId));
    } else if (target.matches('[data-detail-back]')) {
      state.view = 'directory';
      renderView();
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
    if (event.target.matches('.dm-tree-search input')) {
      state.treeKeyword = event.target.value;
      var tree = document.querySelector('.dm-catalog-tree');
      if (tree) tree.innerHTML = treeHtml();
    } else if (event.target.matches('.dm-directory-search input')) {
      state.draftKeyword = event.target.value;
    } else if (event.target.matches('[data-apply-reason]')) {
      var counter = event.target.closest('.dm-textarea-wrap').querySelector('[data-reason-count]');
      if (counter) counter.textContent = event.target.value.length + ' / 200';
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
    } else if (event.key === 'Escape') {
      closeModal();
    }
  }

  function handleChange(event) {
    if (event.target.matches('.dm-page-size')) {
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
    if (!event.target.matches('[data-apply-form]')) return;
    event.preventDefault();
    var item = findResource(event.target.dataset.resourceId);
    if (item) { item.applied = true; item.applies += 1; }
    closeModal();
    if (state.view === 'detail') renderView();
    else refreshDirectoryResults();
    showToast('申请已提交');
  }

  return {
    html: '<div class="page-data-map"><header class="dm-header"><div class="dm-header-inner"><a class="dm-brand" href="javascript:;" aria-label="数据地图首页"><span class="dm-brand-mark"><img src="img/logo.png" alt="数据地图"></span><span class="dm-brand-title">数据目录</span></a>' +
      '<nav class="dm-main-nav" aria-label="数据地图菜单"><div class="dm-nav-group"><button type="button" class="dm-nav-link active" data-view="home" data-dm-menu="首页">首页</button></div><div class="dm-nav-group"><button type="button" class="dm-nav-link" data-view="directory" data-dm-menu="数据地图">数据地图</button></div>' +
      '<div class="dm-nav-group"><button type="button" class="dm-nav-link" data-dm-menu="个人中心">个人中心<i class="bi bi-chevron-down"></i></button><div class="dm-dropdown"><button type="button">我的数据</button><button type="button">审核中心</button><button type="button">我的收藏</button><button type="button">我的应用</button><button type="button">账号信息</button><button type="button">我的消息</button></div></div>' +
      '<div class="dm-nav-group"><button type="button" class="dm-nav-link" data-dm-menu="运行监控">运行监控<i class="bi bi-chevron-down"></i></button><div class="dm-dropdown"><button type="button">API监控</button><button type="button">申请记录</button></div></div>' +
      '<div class="dm-nav-group"><button type="button" class="dm-nav-link" data-dm-menu="系统管理">系统管理<i class="bi bi-chevron-down"></i></button><div class="dm-dropdown"><button type="button">数据管理</button><button type="button">审核中心</button><button type="button">用户管理</button><button type="button">角色管理</button><button type="button">系统配置</button><button type="button">操作日志</button></div></div></nav>' +
      '<div class="dm-header-user">演示</div></div></header><div class="dm-view-root"></div><div class="dm-toast" role="status" aria-live="polite"></div></div>',

    init: function () {
      state.view = 'home';
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
        <div class="dm-toast" role="status" aria-live="polite"></div>
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
