/**
 * 数据中台 V4.0 - 数据治理 / 元数据管理 / 业务代码
 * 静态高保真原型：数据目录树 + 数据列表 + 导入导出记录
 */
window.DP = window.DP || {};
DP.pages = DP.pages || {};

DP.pages.businessCode = (function () {
  var pageEl = null;
  var activeTab = 'list';
  var selectedCatalog = 'all';
  var openTree = {
    all: true,
    transport: true,
    order: true,
    capacity: true,
    finance: true,
    customer: true,
    risk: true
  };
  var selectedIds = {};
  var listFilters = {
    keyword: '',
    sortKey: '',
    sortDir: 'asc'
  };
  var logFilters = {
    property: '',
    status: '',
    keyword: ''
  };
  var logDetailId = '';
  var dataDialogState = {
    rowId: '',
    group: 'all'
  };
  var dataPageState = createDataPageState('');
  var editorState = null;
  var syncState = {
    running: false,
    progress: 0,
    timer: null
  };

  function makeValues(items) {
    return items.map(function (item, index) {
      return {
        value: item[0],
        name: item[1],
        group: item[2],
        status: item[3] || '启用',
        sort: index + 1,
        desc: item[4] || ''
      };
    });
  }

  var catalogTree = [
    {
      id: 'all',
      name: '数仓组',
      icon: 'bi-archive-fill',
      children: [
        {
          id: 'transport',
          name: '运输业务域',
          icon: 'bi-folder-fill',
          children: [
            {
              id: 'order',
              name: '订单管理',
              icon: 'bi-folder-fill',
              children: [
                { id: 'order-status', name: '订单状态', icon: 'bi-tags-fill' },
                { id: 'order-source', name: '运单来源', icon: 'bi-tags-fill' },
                { id: 'order-type', name: '工单类型', icon: 'bi-tags-fill' }
              ]
            },
            {
              id: 'capacity',
              name: '运力管理',
              icon: 'bi-folder-fill',
              children: [
                { id: 'vehicle-type', name: '车辆类型', icon: 'bi-tags-fill' },
                { id: 'driver-qualify', name: '司机资质', icon: 'bi-tags-fill' },
                { id: 'fleet-code', name: '车队编码', icon: 'bi-tags-fill' }
              ]
            }
          ]
        },
        {
          id: 'finance',
          name: '财务结算域',
          icon: 'bi-folder-fill',
          children: [
            { id: 'settle-status', name: '结算状态', icon: 'bi-tags-fill' },
            { id: 'fee-type', name: '费用类型', icon: 'bi-tags-fill' }
          ]
        },
        {
          id: 'customer',
          name: '客户服务域',
          icon: 'bi-folder-fill',
          children: [
            { id: 'customer-level', name: '客户等级', icon: 'bi-tags-fill' },
            { id: 'complain-type', name: '投诉类型', icon: 'bi-tags-fill' }
          ]
        },
        {
          id: 'risk',
          name: '运营风控域',
          icon: 'bi-folder-fill',
          children: [
            { id: 'abnormal-event', name: '异常事件类型', icon: 'bi-tags-fill' },
            { id: 'risk-level', name: '风险等级', icon: 'bi-tags-fill' }
          ]
        }
      ]
    }
  ];

  var databaseTree = [
    {
      id: 'demo-platform',
      name: '中电数治演示',
      icon: 'bi-layers-fill',
      open: true,
      children: [
        {
          id: 'demo-warehouse',
          name: '中电数智演示数仓',
          icon: 'bi-box-seam-fill',
          open: true,
          children: [
            {
              id: 'dw-cluster',
              name: '中电数智演示数仓库',
              icon: 'bi-diagram-3-fill',
              open: true,
              children: [
                { id: 'zz_tms_ads', name: 'zz_tms_ads', icon: 'bi-database-fill', leaf: true },
                { id: 'zz_tms_dim', name: 'zz_tms_dim', icon: 'bi-database-fill', leaf: true },
                { id: 'zz_tms_dwd', name: 'zz_tms_dwd', icon: 'bi-database-fill', leaf: true },
                { id: 'zz_tms_dws', name: 'zz_tms_dws', icon: 'bi-database-fill', leaf: true },
                { id: 'zz_tms_ods', name: 'zz_tms_ods', icon: 'bi-database-fill', leaf: true }
              ]
            }
          ]
        },
        {
          id: 'biz-system',
          name: '业务系统',
          icon: 'bi-layers-fill',
          open: true,
          children: [
            { id: 'mock-data', name: '仿真数据', icon: 'bi-folder-fill' },
            {
              id: 'logistics-system',
              name: '物流系统',
              icon: 'bi-box-seam-fill',
              open: true,
              children: [
                {
                  id: 'logistics-db',
                  name: '物流系统',
                  icon: 'bi-diagram-3-fill',
                  open: true,
                  children: [
                    { id: 'iptv', name: 'iptv', icon: 'bi-database-fill', leaf: true },
                    { id: 'train', name: 'train', icon: 'bi-database-fill', leaf: true }
                  ]
                }
              ]
            },
            { id: 'workorder-system', name: '工单系统', icon: 'bi-folder-fill' },
            { id: 'governance-system', name: '中电数治业务系统', icon: 'bi-folder-fill' }
          ]
        },
        {
          id: 'ods-source',
          name: 'ODS-贴源层',
          icon: 'bi-layers-fill',
          open: true,
          children: [
            { id: 'ods_cec', name: '中电数智_ODS', icon: 'bi-database-fill', leaf: true }
          ]
        }
      ]
    }
  ];

  var tableOptions = {
    zz_tms_ads: ['ads_driver_stats', 'ads_express_city_stats', 'ads_express_org_stats', 'ads_express_province_stats', 'ads_express_stats', 'ads_line_stats'],
    zz_tms_dim: ['dim_city', 'dim_driver', 'dim_vehicle', 'dim_region'],
    zz_tms_dwd: ['dwd_order_detail_di', 'dwd_waybill_track_di', 'dwd_trans_finish_detail_di'],
    zz_tms_dws: ['dws_driver_work_1d', 'dws_city_transport_1d', 'dws_driver_quality_1d'],
    zz_tms_ods: ['ods_tms_order', 'ods_tms_driver', 'ods_tms_vehicle'],
    iptv: ['iptv_order', 'iptv_customer'],
    train: ['train_order', 'train_station'],
    ods_cec: ['ods_order', 'ods_vehicle']
  };

  var standardCodeOptions = [
    { code: 'CV03.00.114', name: '每日饮水量代码表' },
    { code: 'CV03.00.110', name: '每年食用的食物食用频次代码表' },
    { code: 'CV03.00.109', name: '每天食用的食物食用频次代码表' },
    { code: 'CV03.00.108', name: '体检项目类型标准代码' },
    { code: 'CV03.00.107', name: '工单类型标准代码' }
  ];

  var tableFields = {
    ads_driver_stats: [
      { alias: 'dt', name: 'dt', type: 'STRING' },
      { alias: 'recent_days', name: 'recent_days', type: 'TINYINT' },
      { alias: 'driver_emp_id', name: 'driver_emp_id', type: 'BIGINT' },
      { alias: 'driver_name', name: 'driver_name', type: 'STRING' },
      { alias: 'trans_finish_count', name: 'trans_finish_count', type: 'BIGINT' },
      { alias: 'trans_finish_distance', name: 'trans_finish_distance', type: 'DECIMAL' },
      { alias: 'trans_finish_dur_sec', name: 'trans_finish_dur_sec', type: 'BIGINT' },
      { alias: 'avg_trans_finish_distance', name: 'avg_trans_finish_distance', type: 'DECIMAL' },
      { alias: 'avg_trans_finish_duration', name: 'avg_trans_finish_duration', type: 'BIGINT' }
    ],
    ads_express_city_stats: [
      { alias: 'city_id', name: 'city_id', type: 'BIGINT' },
      { alias: 'city_name', name: 'city_name', type: 'STRING' },
      { alias: 'deliver_suc_count', name: 'deliver_suc_count', type: 'BIGINT' },
      { alias: 'dt', name: 'dt', type: 'STRING' }
    ],
    dim_city: [
      { alias: 'city_id', name: 'city_id', type: 'BIGINT' },
      { alias: 'city_name', name: 'city_name', type: 'STRING' },
      { alias: 'province_id', name: 'province_id', type: 'BIGINT' },
      { alias: 'province_name', name: 'province_name', type: 'STRING' }
    ]
  };

  var configFieldOptions = ['请选择字段', '编码', '名称', '父类ID', '编码类型名称', '编码类型ID'];

  var rows = [
    {
      id: 'bc-order-status',
      code: 'BC_ORDER_STATUS',
      name: '运输订单状态',
      category: 'order-status',
      recordCount: 8,
      refCount: 5,
      desc: '覆盖下单、揽收、运输、派送、签收和取消等订单生命周期状态。',
      creator: '演示-测试',
      createdAt: '2026-05-20 10:18:32',
      values: makeValues([
        ['WAIT_PICKUP', '待揽收', 'process', '启用', '客户已下单，等待站点揽收'],
        ['PICKED_UP', '已揽收', 'process', '启用', '站点完成揽收登记'],
        ['IN_TRANSIT', '运输中', 'process', '启用', '干线或支线运输中'],
        ['ARRIVED_HUB', '到达分拨', 'process', '启用', '到达下一分拨中心'],
        ['DELIVERING', '派送中', 'process', '启用', '末端网点派送中'],
        ['SIGNED', '已签收', 'terminal', '启用', '收件人已确认签收'],
        ['CANCELLED', '已取消', 'terminal', '停用', '业务取消或用户撤销'],
        ['EXCEPTION_SIGN', '异常签收', 'terminal', '启用', '签收过程存在异常说明']
      ])
    },
    {
      id: 'bc-order-source',
      code: 'BC_ORDER_SOURCE',
      name: '运单来源',
      category: 'order-source',
      recordCount: 6,
      refCount: 2,
      desc: '统一定义外部平台、自营系统、批量导入和人工补录产生的运单来源。',
      creator: '演示-测试',
      createdAt: '2026-05-19 16:42:08',
      values: makeValues([
        ['APP', '移动应用', 'online', '启用'],
        ['MINI_APP', '小程序', 'online', '启用'],
        ['OPEN_API', '开放接口', 'online', '启用'],
        ['ERP_IMPORT', 'ERP批量导入', 'offline', '启用'],
        ['CALL_CENTER', '客服录单', 'offline', '启用'],
        ['MANUAL', '人工补录', 'offline', '启用']
      ])
    },
    {
      id: 'bc-workorder-type',
      code: 'BC_WORKORDER_TYPE',
      name: '工单类型',
      category: 'order-type',
      recordCount: 7,
      refCount: 1,
      desc: '用于客服、调度、异常处理场景的工单类型标准代码。',
      creator: '演示-测试',
      createdAt: '2026-05-18 11:23:46',
      values: makeValues([
        ['ORDER_MODIFY', '订单修改', 'service', '启用'],
        ['ADDRESS_CHANGE', '地址变更', 'service', '启用'],
        ['DELIVERY_URGE', '催派处理', 'service', '启用'],
        ['DAMAGE_CLAIM', '破损理赔', 'exception', '启用'],
        ['LOST_CLAIM', '遗失理赔', 'exception', '启用'],
        ['FEE_RECHECK', '费用复核', 'finance', '启用'],
        ['CUSTOMER_RETURN', '客户退回', 'service', '启用']
      ])
    },
    {
      id: 'bc-vehicle-type',
      code: 'BC_VEHICLE_TYPE',
      name: '车辆类型',
      category: 'vehicle-type',
      recordCount: 6,
      refCount: 2,
      desc: '按运输车辆能力和使用场景定义干线、支线、城配车辆类型。',
      creator: '演示-测试',
      createdAt: '2026-05-17 09:35:21',
      values: makeValues([
        ['VAN', '厢式货车', 'city', '启用'],
        ['LIGHT_TRUCK', '轻型货车', 'city', '启用'],
        ['MEDIUM_TRUCK', '中型货车', 'linehaul', '启用'],
        ['HEAVY_TRUCK', '重型货车', 'linehaul', '启用'],
        ['COLD_CHAIN', '冷链车', 'special', '启用'],
        ['TRAILER', '挂车', 'special', '启用']
      ])
    },
    {
      id: 'bc-driver-qualify',
      code: 'BC_DRIVER_QUALIFY',
      name: '司机资质类型',
      category: 'driver-qualify',
      recordCount: 5,
      refCount: 0,
      desc: '司机准入、运输任务分配、风控校验使用的资质类型。',
      creator: '演示-测试',
      createdAt: '2026-05-16 15:10:05',
      values: makeValues([
        ['A1', 'A1驾驶证', 'license', '启用'],
        ['A2', 'A2驾驶证', 'license', '启用'],
        ['B2', 'B2驾驶证', 'license', '启用'],
        ['DANGER_GOODS', '危险品运输资格', 'permit', '启用'],
        ['COLD_CHAIN', '冷链运输资格', 'permit', '启用']
      ])
    },
    {
      id: 'bc-fleet-code',
      code: 'BC_FLEET_CODE',
      name: '车队编码',
      category: 'fleet-code',
      recordCount: 5,
      refCount: 0,
      desc: '统一维护自营、加盟、临时承运商车队编码。',
      creator: '演示-测试',
      createdAt: '2026-05-15 18:08:55',
      values: makeValues([
        ['FLEET_NORTH', '华北车队', 'self', '启用'],
        ['FLEET_EAST', '华东车队', 'self', '启用'],
        ['FLEET_SOUTH', '华南车队', 'self', '启用'],
        ['FLEET_JOIN_01', '加盟车队一部', 'partner', '启用'],
        ['FLEET_TEMP', '临时运力池', 'partner', '启用']
      ])
    },
    {
      id: 'bc-settle-status',
      code: 'BC_SETTLE_STATUS',
      name: '结算状态',
      category: 'settle-status',
      recordCount: 7,
      refCount: 3,
      desc: '运费、理赔、承运商费用结算过程中的统一状态口径。',
      creator: '演示-测试',
      createdAt: '2026-05-14 14:22:13',
      values: makeValues([
        ['WAIT_SUBMIT', '待提交', 'process', '启用'],
        ['WAIT_AUDIT', '待审核', 'process', '启用'],
        ['AUDITING', '审核中', 'process', '启用'],
        ['REJECTED', '已驳回', 'terminal', '启用'],
        ['CONFIRMED', '已确认', 'process', '启用'],
        ['PAID', '已付款', 'terminal', '启用'],
        ['CLOSED', '已关闭', 'terminal', '启用']
      ])
    },
    {
      id: 'bc-fee-type',
      code: 'BC_FEE_TYPE',
      name: '费用类型',
      category: 'fee-type',
      recordCount: 6,
      refCount: 4,
      desc: '运输干线、支线、装卸、异常赔付等费用分类。',
      creator: '演示-测试',
      createdAt: '2026-05-13 17:57:19',
      values: makeValues([
        ['LINEHAUL', '干线运输费', 'transport', '启用'],
        ['BRANCH', '支线运输费', 'transport', '启用'],
        ['DELIVERY', '末端派送费', 'transport', '启用'],
        ['LOAD_UNLOAD', '装卸费', 'service', '启用'],
        ['CLAIM', '异常赔付', 'exception', '启用'],
        ['OTHER', '其他费用', 'service', '启用']
      ])
    },
    {
      id: 'bc-customer-level',
      code: 'BC_CUSTOMER_LEVEL',
      name: '客户等级',
      category: 'customer-level',
      recordCount: 4,
      refCount: 1,
      desc: '面向客户服务、报价策略和运营分析的客户等级代码。',
      creator: '演示-测试',
      createdAt: '2026-05-12 10:11:03',
      values: makeValues([
        ['NORMAL', '普通客户', 'level', '启用'],
        ['SILVER', '银牌客户', 'level', '启用'],
        ['GOLD', '金牌客户', 'level', '启用'],
        ['PLATINUM', '白金客户', 'level', '启用']
      ])
    },
    {
      id: 'bc-complain-type',
      code: 'BC_COMPLAIN_TYPE',
      name: '投诉类型',
      category: 'complain-type',
      recordCount: 5,
      refCount: 0,
      desc: '客服投诉、满意度分析和责任归因使用的投诉类型代码。',
      creator: '演示-测试',
      createdAt: '2026-05-11 13:44:27',
      values: makeValues([
        ['DELAY', '运输延误', 'service', '启用'],
        ['DAMAGE', '货物破损', 'service', '启用'],
        ['LOST', '货物遗失', 'service', '启用'],
        ['ATTITUDE', '服务态度', 'service', '启用'],
        ['FEE', '费用争议', 'finance', '启用']
      ])
    },
    {
      id: 'bc-abnormal-event',
      code: 'BC_ABNORMAL_EVENT',
      name: '异常事件类型',
      category: 'abnormal-event',
      recordCount: 9,
      refCount: 4,
      desc: '运输过程异常监控、告警联动和治理分析使用的事件类型。',
      creator: '演示-测试',
      createdAt: '2026-05-10 16:02:40',
      values: makeValues([
        ['ROUTE_DEVIATION', '线路偏离', 'transport', '启用'],
        ['TEMP_ABNORMAL', '温控异常', 'transport', '启用'],
        ['OVERTIME', '运输超时', 'transport', '启用'],
        ['VEHICLE_FAULT', '车辆故障', 'capacity', '启用'],
        ['DRIVER_CHANGE', '司机变更', 'capacity', '启用'],
        ['PACKAGE_DAMAGE', '货物破损', 'cargo', '启用'],
        ['PACKAGE_LOST', '货物遗失', 'cargo', '启用'],
        ['PAYMENT_BLOCK', '支付受阻', 'finance', '启用'],
        ['SYSTEM_DELAY', '系统延迟', 'system', '启用']
      ])
    },
    {
      id: 'bc-risk-level',
      code: 'BC_RISK_LEVEL',
      name: '风险等级',
      category: 'risk-level',
      recordCount: 4,
      refCount: 2,
      desc: '风控评分、异常处置和报表展示统一使用的风险等级。',
      creator: '演示-测试',
      createdAt: '2026-05-09 08:58:16',
      values: makeValues([
        ['LOW', '低风险', 'level', '启用'],
        ['MEDIUM', '中风险', 'level', '启用'],
        ['HIGH', '高风险', 'level', '启用'],
        ['CRITICAL', '重大风险', 'level', '启用']
      ])
    }
  ];

  var logs = [
    {
      id: 'log-1',
      fileName: '业务代码_运输订单状态_20260520.xlsx',
      property: '导入',
      status: '处理成功',
      success: 8,
      fail: 0,
      total: 8,
      operator: '演示-测试',
      time: '2026-05-20 11:25:18',
      detail: ['读取文件成功，共 8 条业务代码数据。', '校验编码唯一性通过。', '运输订单状态已写入静态原型列表。']
    },
    {
      id: 'log-2',
      fileName: '业务代码_费用类型_20260519.xlsx',
      property: '导出',
      status: '处理失败',
      success: 6,
      fail: 1,
      total: 7,
      operator: '演示-测试',
      time: '2026-05-19 17:08:52',
      detail: ['导出任务已创建。', '费用类型 OTHER 缺少描述，已标记为失败记录。', '可修正后重新导出。']
    },
    {
      id: 'log-3',
      fileName: '业务代码_客户服务域_20260518.xlsx',
      property: '导入',
      status: '处理成功',
      success: 9,
      fail: 0,
      total: 9,
      operator: '演示-测试',
      time: '2026-05-18 15:36:41',
      detail: ['客户等级、投诉类型两个代码集导入成功。', '关联引用已同步刷新。']
    },
    {
      id: 'log-4',
      fileName: '业务代码_异常事件类型_20260517.xlsx',
      property: '同步',
      status: '处理中',
      success: 5,
      fail: 0,
      total: 9,
      operator: '演示-测试',
      time: '2026-05-17 09:11:20',
      detail: ['同步任务正在执行。', '已完成运输异常、运力异常分组。', '剩余货物异常、财务异常待处理。']
    }
  ];

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

  function nowText() {
    return '2026-05-21 10:00:00';
  }

  function createDataPageState(rowId) {
    return {
      rowId: rowId || '',
      tab: 'list',
      keyword: '',
      selected: {},
      standard: null,
      rowStandards: {},
      picker: {
        type: '',
        rowValue: '',
        keyword: ''
      }
    };
  }

  function walkCatalog(items, cb) {
    items.forEach(function (item) {
      cb(item);
      if (item.children) walkCatalog(item.children, cb);
    });
  }

  function walkTree(items, cb, path) {
    items.forEach(function (item) {
      var currentPath = (path || []).concat(item);
      cb(item, currentPath);
      if (item.children) walkTree(item.children, cb, currentPath);
    });
  }

  function findCatalog(id) {
    var result = null;
    walkCatalog(catalogTree, function (item) {
      if (item.id === id) result = item;
    });
    return result;
  }

  function getCatalogIds(id) {
    if (id === 'all') return rows.map(function (item) { return item.category; });
    var item = findCatalog(id);
    if (!item) return [id];
    var ids = [];
    walkCatalog([item], function (node) {
      ids.push(node.id);
    });
    return ids;
  }

  function getCatalogName(id) {
    var item = findCatalog(id);
    return item ? item.name : '数仓组';
  }

  function getTreePath(items, id) {
    var result = [];
    walkTree(items, function (item, path) {
      if (item.id === id) result = path;
    });
    return result;
  }

  function getDatabaseName(id) {
    var path = getTreePath(databaseTree, id);
    return path.length ? path[path.length - 1].name : id;
  }

  function getDatabasePathText(id) {
    var path = getTreePath(databaseTree, id);
    return path.map(function (item) { return item.name; }).join(' / ');
  }

  function getCatalogCount(id) {
    if (id === 'all') return rows.length;
    var ids = getCatalogIds(id);
    return rows.filter(function (item) {
      return ids.indexOf(item.category) >= 0;
    }).length;
  }

  function getFilteredRows() {
    var ids = getCatalogIds(selectedCatalog);
    var keyword = normalize(listFilters.keyword);
    var filtered = rows.filter(function (item) {
      var inCatalog = selectedCatalog === 'all' || ids.indexOf(item.category) >= 0;
      var text = normalize(item.code + ' ' + item.name + ' ' + item.desc + ' ' + item.creator);
      return inCatalog && (!keyword || text.indexOf(keyword) >= 0);
    });

    if (!listFilters.sortKey) return filtered;
    return filtered.slice().sort(function (a, b) {
      var av = a[listFilters.sortKey];
      var bv = b[listFilters.sortKey];
      if (listFilters.sortKey === 'recordCount' || listFilters.sortKey === 'refCount') {
        av = Number(av) || 0;
        bv = Number(bv) || 0;
      } else {
        av = String(av || '');
        bv = String(bv || '');
      }
      if (av > bv) return listFilters.sortDir === 'asc' ? 1 : -1;
      if (av < bv) return listFilters.sortDir === 'asc' ? -1 : 1;
      return 0;
    });
  }

  function getFilteredLogs() {
    var keyword = normalize(logFilters.keyword);
    return logs.filter(function (item) {
      var inProperty = !logFilters.property || item.property === logFilters.property;
      var inStatus = !logFilters.status || item.status === logFilters.status;
      var text = normalize(item.fileName + ' ' + item.property + ' ' + item.status + ' ' + item.operator);
      return inProperty && inStatus && (!keyword || text.indexOf(keyword) >= 0);
    });
  }

  function findRow(id) {
    return rows.filter(function (item) { return item.id === id; })[0] || null;
  }

  function findLog(id) {
    return logs.filter(function (item) { return item.id === id; })[0] || null;
  }

  function renderTreeNodes(items, keyword) {
    return items.map(function (item) {
      var children = item.children ? renderTreeNodes(item.children, keyword) : '';
      var match = !keyword || normalize(item.name).indexOf(keyword) >= 0;
      if (keyword && !match && !children) return '';

      var hasChildren = item.children && item.children.length;
      var isOpen = !!openTree[item.id] || !!keyword;
      var active = selectedCatalog === item.id ? ' active' : '';
      var open = isOpen ? ' open' : '';
      var icon = item.icon || (hasChildren ? 'bi-folder-fill' : 'bi-tags-fill');
      var toggleIcon = isOpen ? 'bi-chevron-down' : 'bi-chevron-right';
      var count = getCatalogCount(item.id);
      var childHtml = hasChildren ? '<ul class="bc-tree-children">' + children + '</ul>' : '';

      var toggleAttrs = hasChildren ? ' data-bc-action="toggle-tree" data-bc-tree-id="' + item.id + '"' : '';
      return '<li class="bc-tree-node' + (hasChildren ? ' has-children' : '') + open + '">' +
        '<div class="bc-tree-row' + active + '" data-bc-tree-id="' + item.id + '">' +
          '<button class="bc-tree-toggle" type="button"' + toggleAttrs + ' aria-label="展开目录">' +
            '<i class="bi ' + (hasChildren ? toggleIcon : 'bi-dot') + '"></i>' +
          '</button>' +
          '<i class="bi ' + icon + ' bc-tree-icon"></i>' +
          '<span class="bc-tree-name" title="' + escapeHtml(item.name) + '">' + escapeHtml(item.name) + '</span>' +
          '<span class="bc-tree-count">' + count + '</span>' +
        '</div>' +
        childHtml +
      '</li>';
    }).join('');
  }

  function renderTree() {
    var tree = pageEl.querySelector('#bcCatalogTree');
    var input = pageEl.querySelector('#bcTreeSearch');
    var keyword = normalize(input ? input.value : '');
    if (!tree) return;
    tree.innerHTML = renderTreeNodes(catalogTree, keyword) || '<li class="bc-empty-tree">暂无匹配目录</li>';
  }

  function sortHeader(key, label) {
    return '<button class="bc-th-sort" type="button" data-bc-action="sort" data-bc-sort="' + key + '">' +
      '<span>' + label + '</span>' +
      '<span class="bc-sort-stack"><i class="bi bi-caret-up-fill"></i><i class="bi bi-caret-down-fill"></i></span>' +
    '</button>';
  }

  function updateSortHeader() {
    pageEl.querySelectorAll('[data-bc-sort]').forEach(function (button) {
      var key = button.dataset.bcSort;
      if (key === listFilters.sortKey) {
        button.setAttribute('data-sort-dir', listFilters.sortDir);
      } else {
        button.removeAttribute('data-sort-dir');
      }
    });
  }

  function renderListTable() {
    var tbody = pageEl.querySelector('#bcTableBody');
    var info = pageEl.querySelector('#bcListPagination');
    var rowsToRender = getFilteredRows();
    if (!tbody) return;

    tbody.innerHTML = rowsToRender.map(function (item) {
      return '<tr data-bc-row="' + item.id + '">' +
        '<td class="bc-col-check"><input type="checkbox" data-bc-row-check="' + item.id + '"' + (selectedIds[item.id] ? ' checked' : '') + ' aria-label="选择业务代码"></td>' +
        '<td title="' + escapeHtml(item.code) + '">' + escapeHtml(item.code) + '</td>' +
        '<td title="' + escapeHtml(item.name) + '">' + escapeHtml(item.name) + '</td>' +
        '<td>' + item.recordCount + '</td>' +
        '<td><button class="bc-link-btn" type="button" data-bc-action="refs" data-bc-id="' + item.id + '">' + item.refCount + '</button></td>' +
        '<td title="' + escapeHtml(item.desc) + '">' + escapeHtml(item.desc) + '</td>' +
        '<td title="' + escapeHtml(item.creator) + '">' + escapeHtml(item.creator) + '</td>' +
        '<td title="' + escapeHtml(item.createdAt) + '">' + escapeHtml(item.createdAt) + '</td>' +
        '<td><div class="bc-actions">' +
          '<button class="bc-op-btn" type="button" data-bc-action="edit" data-bc-id="' + item.id + '"><i class="bi bi-pencil-square"></i><span>编辑</span></button>' +
          '<button class="bc-op-btn bc-op-data" type="button" data-bc-action="data" data-bc-id="' + item.id + '"><i class="bi bi-table"></i><span>数据</span></button>' +
          '<button class="bc-op-btn bc-op-danger" type="button" data-bc-action="delete-row" data-bc-id="' + item.id + '"><i class="bi bi-trash3"></i><span>删除</span></button>' +
        '</div></td>' +
      '</tr>';
    }).join('');

    if (!rowsToRender.length) {
      tbody.innerHTML = '<tr class="bc-empty-row"><td colspan="9">暂无匹配的业务代码</td></tr>';
    }

    if (info) {
      info.textContent = '显示第 ' + (rowsToRender.length ? 1 : 0) + ' 到第 ' + rowsToRender.length + ' 条记录，总共 ' + rowsToRender.length + ' 条记录';
    }
    updateCheckAll();
    updateSortHeader();
  }

  function renderCountText(item) {
    return '<span class="bc-count-success">' + item.success + '</span>/<span class="bc-count-fail">' + item.fail + '</span>/<span>' + item.total + '</span>';
  }

  function renderLogTable() {
    var tbody = pageEl.querySelector('#bcLogTableBody');
    var info = pageEl.querySelector('#bcLogPagination');
    var rowsToRender = getFilteredLogs();
    if (!tbody) return;

    tbody.innerHTML = rowsToRender.map(function (item) {
      var propClass = item.property === '导出' ? ' tag-yellow' : (item.property === '同步' ? ' tag-purple' : ' tag-blue');
      var statusClass = item.status === '处理成功' ? ' tag-green' : (item.status === '处理失败' ? ' tag-red' : ' tag-yellow');
      return '<tr>' +
        '<td title="' + escapeHtml(item.fileName) + '">' + escapeHtml(item.fileName) + '</td>' +
        '<td><span class="tag' + propClass + '">' + escapeHtml(item.property) + '</span></td>' +
        '<td><span class="tag' + statusClass + '">' + escapeHtml(item.status) + '</span></td>' +
        '<td>' + renderCountText(item) + '</td>' +
        '<td title="' + escapeHtml(item.operator) + '">' + escapeHtml(item.operator) + '</td>' +
        '<td title="' + escapeHtml(item.time) + '">' + escapeHtml(item.time) + '</td>' +
        '<td><button class="bc-log-btn" type="button" data-bc-action="view-log" data-bc-log-id="' + item.id + '"><i class="bi bi-file-text"></i><span>查看日志</span></button></td>' +
      '</tr>';
    }).join('');

    if (!rowsToRender.length) {
      tbody.innerHTML = '<tr class="bc-empty-row"><td colspan="7">暂无匹配的导入导出记录</td></tr>';
    }

    if (info) {
      info.textContent = '显示第 ' + (rowsToRender.length ? 1 : 0) + ' 到第 ' + rowsToRender.length + ' 条记录，总共 ' + rowsToRender.length + ' 条记录';
    }
  }

  function buildLogPrefix(flowId) {
    return '21-05-2026 10:24:18 CST data-code-flow-' + flowId + ' INFO - ';
  }

  function buildBusinessCodeTechnicalLog(item) {
    var rawId = String(item.id || '0').replace(/\D/g, '').slice(-6) || '000001';
    var flowId = 'bc-' + rawId.padStart(6, '0') + '-c4d8f21a9037e65b';
    var prefix = buildLogPrefix(flowId);
    var sourceFile = item.property === '导出' ? '/data/export/business_code/' + item.fileName : '/data/upload/business_code/' + item.fileName;
    var targetTable = item.property === '同步' ? 'dim_business_code_mapping' : (item.property === '导出' ? 'tmp_export_business_code' : 'ods_business_code_import_tmp');
    var lines = [
      prefix + 'Starting job data-code-flow-' + flowId + ' at 1747794258201',
      prefix + 'job JVM args: -Ddataplat.flowid=data-asset-business-code -Ddataplat.execid=' + rawId.padStart(6, '0') + ' -Ddataplat.jobid=' + flowId,
      prefix + 'effective user is metadata_admin',
      prefix + 'Building command job executor.',
      prefix + 'Memory granted for job data-code-flow-' + flowId,
      prefix + 'BusinessCodeTask - operation type: ' + item.property,
      prefix + 'BusinessCodeTask - begin read file: ' + sourceFile,
      prefix + 'BusinessCodeTask - template columns: code,name,parent_id,type_name,type_id,status,remark',
      prefix + 'BusinessCodeTask - total rows parsed: ' + item.total,
      prefix + 'HiveWriter$Task - begin do write...',
      prefix + 'HiveWriter$Task - write to file: hdfs://192.168.5.118:8020/user/dp/tmp/business_code/' + flowId + '/part-00000',
      prefix + 'HiveWriter$Task - insertCmd ---> insert overwrite table metadata.' + targetTable + ' partition(dt=20260521) select code,name,parent_id,type_name,type_id,status,remark from tmp_' + flowId.replace(/-/g, '_'),
      prefix + 'UserGroupInformation - Login successful for user metadata_admin using keytab file /home/dataplat/keytab/metadata.keytab',
      prefix + 'HiveConnection - Will try to open client transport with JDBC Uri: jdbc:hive2://192.168.5.119:10000/metadata;principal=hive/_HOST@DATAPLAT.COM',
      prefix + 'StandAloneJobContainerCommunicator - total ' + item.success + ' records, failed ' + item.fail + ' records, total bytes ' + (Math.max(item.success, 1) * 96) + ', speed 0B/s, progress ' + (item.status === '处理中' ? '62.00%' : '100.00%')
    ];
    (item.detail || []).forEach(function (line) {
      lines.push(prefix + 'BusinessCodeTask - ' + line);
    });
    if (item.status === '处理失败' || item.fail > 0) {
      lines.push(prefix + 'ERROR - duplicate business code detected or required mapping is missing.');
      lines.push(prefix + 'BusinessCodeTask - job finished with validation errors.');
    } else if (item.status === '处理中') {
      lines.push(prefix + 'BusinessCodeTask - waiting for downstream metadata refresh.');
      lines.push(prefix + 'BusinessCodeTask - heartbeat received from worker thread business-code-worker-02.');
    } else {
      lines.push(prefix + 'BusinessCodeTask - commit business code changes success.');
      lines.push(prefix + 'BusinessCodeTask - job finished successfully.');
    }
    return lines.join('\n');
  }

  function renderLogDetailView() {
    var item = findLog(logDetailId);
    if (!item) {
      return '<div class="bc-log-empty"><button class="btn btn-outline" type="button" data-bc-action="back-log"><i class="bi bi-arrow-left"></i><span>返回</span></button><span>未找到日志记录</span></div>';
    }
    return '<div class="bc-log-view">' +
      '<div class="bc-log-header">' +
        '<button class="btn btn-outline" type="button" data-bc-action="back-log"><i class="bi bi-arrow-left"></i><span>返回</span></button>' +
        '<div><h3>任务处理日志</h3><p title="' + escapeHtml(item.fileName) + '">' + escapeHtml(item.fileName) + '</p></div>' +
      '</div>' +
      '<pre class="bc-tech-log">' + escapeHtml(buildBusinessCodeTechnicalLog(item)) + '</pre>' +
    '</div>';
  }

  function renderLogDetail() {
    var panel = pageEl.querySelector('[data-bc-panel="log"]');
    var detail = pageEl.querySelector('#bcLogDetail');
    if (panel) panel.classList.toggle('bc-log-detail-mode', !!logDetailId);
    if (!detail) return;
    detail.innerHTML = logDetailId ? renderLogDetailView() : '';
  }

  function updateCheckAll() {
    var checkAll = pageEl.querySelector('#bcCheckAll');
    var visibleRows = getFilteredRows();
    if (!checkAll) return;
    var checkedCount = visibleRows.filter(function (item) { return selectedIds[item.id]; }).length;
    checkAll.checked = visibleRows.length > 0 && checkedCount === visibleRows.length;
    checkAll.indeterminate = checkedCount > 0 && checkedCount < visibleRows.length;
  }

  function renderTab() {
    pageEl.querySelectorAll('[data-bc-tab]').forEach(function (tab) {
      tab.classList.toggle('active', tab.dataset.bcTab === activeTab);
    });
    pageEl.querySelectorAll('[data-bc-panel]').forEach(function (panel) {
      panel.classList.toggle('active', panel.dataset.bcPanel === activeTab);
    });
    renderLogDetail();
  }

  function renderAll() {
    renderTree();
    renderTab();
    renderListTable();
    renderLogTable();
  }

  function showToast(text) {
    var old = pageEl.querySelector('.bc-toast');
    if (old) old.remove();
    var toast = document.createElement('div');
    toast.className = 'bc-toast';
    toast.innerHTML = '<i class="bi bi-check-circle"></i><span>' + escapeHtml(text) + '</span>';
    pageEl.appendChild(toast);
    setTimeout(function () { toast.classList.add('show'); }, 10);
    setTimeout(function () {
      toast.classList.remove('show');
      setTimeout(function () {
        if (toast.parentNode) toast.remove();
      }, 180);
    }, 1800);
  }

  function getDefaultEditorCategory() {
    var item = findCatalog(selectedCatalog);
    if (item && (!item.children || !item.children.length)) return selectedCatalog;
    return 'order-status';
  }

  function getEditorTables() {
    return tableOptions[editorState && editorState.database] || [];
  }

  function getEditorFields() {
    if (!editorState || !editorState.table) return [];
    return tableFields[editorState.table] || [
      { alias: 'code', name: 'code', type: 'STRING' },
      { alias: 'name', name: 'name', type: 'STRING' },
      { alias: 'parent_id', name: 'parent_id', type: 'BIGINT' },
      { alias: 'type_name', name: 'type_name', type: 'STRING' },
      { alias: 'type_id', name: 'type_id', type: 'BIGINT' }
    ];
  }

  function renderEditorTreeNodes(items, activeId, chooseAction, keyword) {
    return items.map(function (item) {
      var children = item.children ? renderEditorTreeNodes(item.children, activeId, chooseAction, keyword) : '';
      var match = !keyword || normalize(item.name).indexOf(keyword) >= 0;
      if (keyword && !match && !children) return '';
      var hasChildren = item.children && item.children.length;
      var open = hasChildren ? ' open' : '';
      var active = activeId === item.id ? ' active' : '';
      return '<li class="bc-editor-tree-node' + open + '">' +
        '<div class="bc-editor-tree-row' + active + '"' + (!hasChildren ? ' data-bc-action="' + chooseAction + '" data-bc-id="' + escapeHtml(item.id) + '"' : '') + '>' +
          '<i class="bi ' + (hasChildren ? 'bi-chevron-down' : 'bi-dot') + '"></i>' +
          '<i class="bi ' + (item.icon || (hasChildren ? 'bi-folder-fill' : 'bi-tags-fill')) + '"></i>' +
          '<span>' + escapeHtml(item.name) + '</span>' +
        '</div>' +
        (hasChildren ? '<ul>' + children + '</ul>' : '') +
      '</li>';
    }).join('');
  }

  function renderDatabaseTreeNodes(items, keyword) {
    return items.map(function (item) {
      var children = item.children ? renderDatabaseTreeNodes(item.children, keyword) : '';
      var match = !keyword || normalize(item.name).indexOf(keyword) >= 0;
      if (keyword && !match && !children) return '';
      var active = editorState && editorState.database === item.id ? ' active' : '';
      return '<li class="bc-editor-tree-node open">' +
        '<div class="bc-editor-tree-row' + active + '"' + (item.leaf ? ' data-bc-action="choose-editor-db" data-bc-id="' + escapeHtml(item.id) + '"' : '') + '>' +
          '<i class="bi ' + (item.children ? 'bi-chevron-down' : 'bi-dot') + '"></i>' +
          '<i class="bi ' + (item.icon || 'bi-folder-fill') + '"></i>' +
          '<span>' + escapeHtml(item.name) + '</span>' +
        '</div>' +
        (item.children ? '<ul>' + children + '</ul>' : '') +
      '</li>';
    }).join('');
  }

  function renderTableOptionRows(keyword) {
    var options = getEditorTables().filter(function (name) {
      return !keyword || normalize(name).indexOf(keyword) >= 0;
    });
    if (!options.length) {
      return '<li class="bc-editor-empty">暂无匹配表</li>';
    }
    return options.map(function (name) {
      var active = editorState && editorState.table === name ? ' active' : '';
      return '<li>' +
        '<button class="bc-editor-table-option' + active + '" type="button" data-bc-action="choose-editor-table" data-bc-table="' + escapeHtml(name) + '">' +
          '<i class="bi bi-table"></i>' +
          '<span title="' + escapeHtml(name) + '">' + escapeHtml(name) + '</span>' +
        '</button>' +
      '</li>';
    }).join('');
  }

  function renderEditorPicker(type) {
    if (!editorState) return '';
    var isCategory = type === 'category';
    var open = isCategory ? editorState.categoryOpen : editorState.databaseOpen;
    var value = isCategory ? getCatalogName(editorState.category) : getDatabaseName(editorState.database);
    var placeholder = isCategory ? '请选择数据分类' : '请选择数据库';
    var keywordId = isCategory ? 'bcCategorySearch' : 'bcDatabaseSearch';
    var keyword = isCategory ? editorState.categoryKeyword : editorState.databaseKeyword;
    var treeHtml = isCategory
      ? renderEditorTreeNodes(catalogTree, editorState.category, 'choose-editor-category', normalize(keyword))
      : renderDatabaseTreeNodes(databaseTree, normalize(keyword));
    var pathText = isCategory ? '' : getDatabasePathText(editorState.database);

    return '<div class="bc-editor-picker' + (open ? ' open' : '') + '">' +
      '<button class="bc-editor-selectbox" type="button" data-bc-action="toggle-editor-picker" data-bc-picker="' + type + '" aria-label="选择' + (isCategory ? '数据分类' : '数据库') + '" title="' + escapeHtml(pathText || value || placeholder) + '">' +
        '<i class="bi ' + (isCategory ? 'bi-tags' : 'bi-database') + '"></i>' +
        '<span class="' + (value ? '' : 'is-placeholder') + '">' + escapeHtml(value || placeholder) + '</span>' +
        '<i class="bi bi-chevron-down"></i>' +
      '</button>' +
      (open ? '<div class="bc-editor-dropdown">' +
        '<div class="bc-editor-dropdown-search"><input id="' + keywordId + '" type="text" value="' + escapeHtml(keyword) + '" placeholder="输入关键字搜索"><button type="button" aria-label="搜索"><i class="bi bi-search"></i></button></div>' +
        '<ul class="bc-editor-tree">' + (treeHtml || '<li class="bc-editor-empty">暂无匹配目录</li>') + '</ul>' +
      '</div>' : '') +
    '</div>';
  }

  function renderTablePicker() {
    if (!editorState || !editorState.database) {
      return '<div class="bc-editor-table-picker disabled">' +
        '<button class="bc-editor-selectbox" type="button" disabled>' +
          '<i class="bi bi-table"></i><span class="is-placeholder">请先选择数据库</span><i class="bi bi-chevron-down"></i>' +
        '</button>' +
      '</div>';
    }
    var keyword = editorState.tableKeyword || '';
    var value = editorState.table;
    return '<div class="bc-editor-table-picker' + (editorState.tableOpen ? ' open' : '') + '">' +
      '<button class="bc-editor-selectbox" type="button" data-bc-action="toggle-editor-table" aria-label="选择表" title="' + escapeHtml(value || '请选择表') + '">' +
        '<i class="bi bi-table"></i>' +
        '<span class="' + (value ? '' : 'is-placeholder') + '">' + escapeHtml(value || '请选择表') + '</span>' +
        '<i class="bi bi-chevron-down"></i>' +
      '</button>' +
      (editorState.tableOpen ? '<div class="bc-editor-dropdown bc-editor-table-dropdown">' +
        '<div class="bc-editor-dropdown-search"><input id="bcTableSearch" type="text" value="' + escapeHtml(keyword) + '" placeholder="输入表名搜索"><button type="button" aria-label="搜索"><i class="bi bi-search"></i></button></div>' +
        '<ul class="bc-editor-table-list">' + renderTableOptionRows(normalize(keyword)) + '</ul>' +
      '</div>' : '') +
    '</div>';
  }

  function renderConfigSelect(rowIndex, isBatch) {
    var defaults = isBatch ? ['编码', '名称', '父类ID', '编码类型名称', '编码类型ID'] : ['编码', '名称', '父类ID'];
    var options = isBatch ? configFieldOptions : ['请选择字段', '编码', '名称', '父类ID'];
    var selected = defaults[rowIndex] || '';
    return '<select class="bc-config-select">' +
      options.map(function (name) {
        var value = name === '请选择字段' ? '' : name;
        return '<option value="' + escapeHtml(value) + '"' + (value === selected ? ' selected' : '') + '>' + escapeHtml(name) + '</option>';
      }).join('') +
    '</select>';
  }

  function renderConfigTable() {
    var fields = getEditorFields();
    if (!editorState || !editorState.table || !fields.length) return '';
    var isBatch = editorState.addMode === 'batch';
    var rowCount = isBatch ? 5 : 3;
    return '<div class="bc-config-table-wrap">' +
      '<table class="bc-config-table">' +
        '<thead><tr><th>配置</th><th>别名</th><th>英文名称</th><th>数据类型</th></tr></thead>' +
        '<tbody>' +
          fields.slice(0, rowCount).map(function (field, index) {
            return '<tr>' +
              '<td>' + renderConfigSelect(index, isBatch) + '</td>' +
              '<td title="' + escapeHtml(field.alias) + '">' + escapeHtml(field.alias) + '</td>' +
              '<td title="' + escapeHtml(field.name) + '">' + escapeHtml(field.name) + '</td>' +
              '<td>' + escapeHtml(field.type) + '</td>' +
            '</tr>';
          }).join('') +
        '</tbody>' +
      '</table>' +
    '</div>';
  }

  function editorRow(label, control, hint, required, extraClass) {
    return '<div class="bc-editor-row ' + (extraClass || '') + '">' +
      '<label>' + (required ? '<span>*</span>' : '') + label + '</label>' +
      '<div class="bc-editor-control">' + control + '</div>' +
      '<div class="bc-editor-hint">' + (hint || '') + '</div>' +
    '</div>';
  }

  function renderEditor() {
    var panel = pageEl.querySelector('#bcEditorPanel');
    if (!panel || !editorState) return;
    var isBatch = editorState.addMode === 'batch';
    var title = editorState.mode === 'edit' ? '编辑' : '新建';
    var codeRows = isBatch ? '' :
      editorRow('编码',
        '<input id="bcEditCode" value="' + escapeHtml(editorState.code) + '" placeholder="长度不超过50个字符，允许数字/字母/汉字/下划线，下划线不能开头!">',
        '<i class="bi bi-check-circle-fill"></i><span>50个字符以内</span>',
        true) +
      editorRow('名称',
        '<input id="bcEditName" value="' + escapeHtml(editorState.name) + '" placeholder="长度不超过50个字符，允许数字/字母/汉字/下划线，下划线不能开头!">',
        '<i class="bi bi-check-circle-fill"></i><span>50个字符以内</span>',
        true);

    panel.innerHTML =
      '<div class="bc-editor-head">' +
        '<h2><i class="bi bi-list"></i><span>' + title + '</span></h2>' +
        '<button class="bc-return-btn" type="button" data-bc-action="back-editor"><i class="bi bi-arrow-left"></i><span>返回</span></button>' +
      '</div>' +
      '<div class="bc-editor-scroll">' +
        '<div class="bc-editor-form">' +
          editorRow('添加方式',
            '<select id="bcEditAddMode"><option value="single"' + (!isBatch ? ' selected' : '') + '>单个添加</option><option value="batch"' + (isBatch ? ' selected' : '') + '>批量添加</option></select>',
            '',
            true) +
          codeRows +
          editorRow('数据分类', renderEditorPicker('category'), '', true) +
          editorRow('数据库', renderEditorPicker('database'), '', false) +
          editorRow('表', renderTablePicker(), isBatch ? '<i class="bi bi-check-circle-fill"></i><span>根据编码类型ID/类型名称，自动生产多套编码数据</span>' : '', false) +
          editorRow('配置', renderConfigTable(), '', false, 'bc-config-editor-row') +
          editorRow('描述',
            '<textarea id="bcEditDesc" maxlength="500" placeholder="长度不超过500个字符">' + escapeHtml(editorState.desc) + '</textarea>',
            '<i class="bi bi-check-circle-fill"></i><span>500个字符以内</span>',
            true,
            'bc-desc-editor-row') +
          '<div class="bc-editor-actions"><button class="btn btn-primary" type="button" data-bc-action="save-editor"><i class="bi bi-check-lg"></i><span>保存</span></button><button class="btn btn-outline" type="button" data-bc-action="back-editor"><i class="bi bi-x-lg"></i><span>取消</span></button></div>' +
        '</div>' +
      '</div>';
  }

  function syncEditorFromForm() {
    if (!editorState) return;
    var addMode = pageEl.querySelector('#bcEditAddMode');
    var code = pageEl.querySelector('#bcEditCode');
    var name = pageEl.querySelector('#bcEditName');
    var desc = pageEl.querySelector('#bcEditDesc');
    if (addMode) editorState.addMode = addMode.value;
    if (code) editorState.code = code.value;
    if (name) editorState.name = name.value;
    if (desc) editorState.desc = desc.value;
  }

  function openEditor(rowId) {
    var item = findRow(rowId);
    editorState = {
      mode: item ? 'edit' : 'new',
      rowId: rowId || '',
      addMode: 'single',
      code: item ? item.code : '',
      name: item ? item.name : '',
      category: item ? item.category : getDefaultEditorCategory(),
      database: item && item.database ? item.database : 'zz_tms_ads',
      table: item && item.table ? item.table : '',
      desc: item ? item.desc : '',
      categoryOpen: false,
      databaseOpen: false,
      tableOpen: false,
      categoryKeyword: '',
      databaseKeyword: '',
      tableKeyword: ''
    };
    pageEl.classList.add('bc-editor-mode');
    renderEditor();
  }

  function closeEditor() {
    editorState = null;
    pageEl.classList.remove('bc-editor-mode');
    renderAll();
  }

  function saveEditor() {
    syncEditorFromForm();
    if (!editorState) return;
    var isBatch = editorState.addMode === 'batch';
    var code = normalize(editorState.code) ? editorState.code.trim() : '';
    var name = normalize(editorState.name) ? editorState.name.trim() : '';
    var desc = normalize(editorState.desc) ? editorState.desc.trim() : '';
    if (!isBatch && (!code || !name)) {
      showToast('请填写编码和名称');
      return;
    }

    if (isBatch && editorState.table) {
      code = 'BC_' + editorState.table.toUpperCase();
      name = editorState.table + '业务代码';
    }

    var item = findRow(editorState.rowId);
    if (item) {
      item.code = code || item.code;
      item.name = name || item.name;
      item.category = editorState.category;
      item.database = editorState.database;
      item.table = editorState.table;
      item.desc = desc;
      showToast('业务代码已保存');
    } else {
      rows.unshift({
        id: 'bc-' + Date.now(),
        code: code || 'BC_AUTO_' + Date.now().toString().slice(-4),
        name: name || '批量生成业务代码',
        category: editorState.category,
        database: editorState.database,
        table: editorState.table,
        recordCount: isBatch ? getEditorFields().length : 0,
        refCount: 0,
        desc: desc,
        creator: '当前用户',
        createdAt: nowText(),
        values: []
      });
      selectedCatalog = editorState.category;
      showToast('业务代码已新增');
    }
    closeEditor();
  }

  function closeModal(type) {
    var selector = type ? '[data-bc-modal="' + type + '"]' : '.bc-modal-mask';
    var modal = pageEl.querySelector(selector);
    if (modal) modal.remove();
  }

  function getValueGroupName(group) {
    var map = {
      all: '全部数据',
      process: '过程状态',
      terminal: '终态结果',
      online: '线上来源',
      offline: '线下来源',
      service: '服务类',
      exception: '异常类',
      finance: '财务类',
      city: '城配车辆',
      linehaul: '干线车辆',
      special: '特殊车辆',
      license: '驾驶证',
      permit: '从业资格',
      self: '自营车队',
      partner: '外部运力',
      transport: '运输类',
      level: '等级类',
      capacity: '运力类',
      cargo: '货物类',
      system: '系统类'
    };
    return map[group] || group;
  }

  function getValueGroups(item) {
    var groups = {};
    (item.values || []).forEach(function (value) {
      groups[value.group] = true;
    });
    return Object.keys(groups);
  }

  function renderValueTree(item) {
    var groups = getValueGroups(item);
    var active = dataDialogState.group;
    return '<ul class="bc-value-tree">' +
      '<li class="bc-value-node open">' +
        '<div class="bc-value-row' + (active === 'all' ? ' active' : '') + '" data-bc-action="value-tree" data-bc-value-group="all">' +
          '<i class="bi bi-chevron-down"></i><i class="bi bi-folder-fill"></i><span>数据目录</span><b>' + item.values.length + '</b>' +
        '</div>' +
        '<ul>' +
          '<li class="bc-value-node open">' +
            '<div class="bc-value-row"><i class="bi bi-chevron-down"></i><i class="bi bi-folder-fill"></i><span>' + escapeHtml(item.name) + '</span><b>' + item.values.length + '</b></div>' +
            '<ul>' +
              groups.map(function (group) {
                var count = item.values.filter(function (value) { return value.group === group; }).length;
                return '<li class="bc-value-node">' +
                  '<div class="bc-value-row' + (active === group ? ' active' : '') + '" data-bc-action="value-tree" data-bc-value-group="' + escapeHtml(group) + '">' +
                    '<i class="bi bi-dot"></i><i class="bi bi-tags-fill"></i><span>' + escapeHtml(getValueGroupName(group)) + '</span><b>' + count + '</b>' +
                  '</div>' +
                '</li>';
              }).join('') +
            '</ul>' +
          '</li>' +
        '</ul>' +
      '</li>' +
    '</ul>';
  }

  function renderValueRows(item) {
    var group = dataDialogState.group;
    var values = (item.values || []).filter(function (value) {
      return group === 'all' || value.group === group;
    });
    if (!values.length) {
      return '<tr class="bc-empty-row"><td colspan="5">暂无编码值数据</td></tr>';
    }
    return values.map(function (value) {
      return '<tr>' +
        '<td title="' + escapeHtml(value.value) + '">' + escapeHtml(value.value) + '</td>' +
        '<td title="' + escapeHtml(value.name) + '">' + escapeHtml(value.name) + '</td>' +
        '<td>' + escapeHtml(getValueGroupName(value.group)) + '</td>' +
        '<td><span class="tag ' + (value.status === '启用' ? 'tag-green' : 'tag-red') + '">' + escapeHtml(value.status) + '</span></td>' +
        '<td title="' + escapeHtml(value.desc) + '">' + escapeHtml(value.desc || '-') + '</td>' +
      '</tr>';
    }).join('');
  }

  function getDataPageValues(item) {
    var keyword = normalize(dataPageState.keyword);
    return (item.values || []).filter(function (value) {
      var text = normalize(value.value + ' ' + value.name + ' ' + value.desc);
      return !keyword || text.indexOf(keyword) >= 0;
    });
  }

  function getActiveStandard() {
    return dataPageState.standard || standardCodeOptions[4];
  }

  function getRowStandard(value, index) {
    return dataPageState.rowStandards[value.value] || {
      code: String(index + 1),
      name: value.name
    };
  }

  function getStandardOptions(keyword) {
    var key = normalize(keyword);
    return standardCodeOptions.filter(function (item) {
      return !key || normalize(item.name + ' ' + item.code).indexOf(key) >= 0;
    });
  }

  function getRowStandardOptions(item, keyword) {
    var key = normalize(keyword);
    return (item.values || []).map(function (value, index) {
      return { code: String(index + 1), name: value.name };
    }).filter(function (option) {
      return !key || normalize(option.name + ' ' + option.code).indexOf(key) >= 0;
    });
  }

  function renderStandardPickerOptions(type, rowValue, item) {
    var keyword = dataPageState.picker.keyword;
    var options = type === 'row' ? getRowStandardOptions(item, keyword) : getStandardOptions(keyword);
    if (!options.length) return '<div class="bc-std-picker-empty">暂无匹配数据</div>';
    return options.map(function (option, index) {
      var active = index === 1 ? ' active' : '';
      return '<button class="bc-std-picker-option' + active + '" type="button" data-bc-action="choose-standard-option" data-bc-std-type="' + escapeHtml(type) + '" data-bc-row-value="' + escapeHtml(rowValue || '') + '" data-bc-std-code="' + escapeHtml(option.code) + '" data-bc-std-name="' + escapeHtml(option.name) + '">' +
        '<span title="' + escapeHtml(option.name) + '">' + escapeHtml(option.name) + '</span>' +
        '<b>' + escapeHtml(option.code) + '</b>' +
      '</button>';
    }).join('');
  }

  function renderStandardPicker(type, rowValue, item) {
    var isOpen = dataPageState.picker.type === type && (type !== 'row' || dataPageState.picker.rowValue === rowValue);
    if (!isOpen) return '';
    var inputId = type === 'row' ? 'bcRowStandardSearch' : 'bcStandardSearch';
    var placeholder = type === 'row' ? '搜索标准编码' : '搜索标准代码';
    return '<div class="bc-std-picker' + (type === 'row' ? ' bc-std-picker-row' : '') + '">' +
      '<div class="bc-std-picker-search"><input id="' + inputId + '" type="text" value="' + escapeHtml(dataPageState.picker.keyword) + '" placeholder="' + placeholder + '"><button type="button" aria-label="搜索"><i class="bi bi-search"></i></button></div>' +
      '<div class="bc-std-picker-list">' + renderStandardPickerOptions(type, rowValue, item) + '</div>' +
    '</div>';
  }

  function renderDataPageRows(item) {
    var values = getDataPageValues(item);
    if (!values.length) {
      return '<tr class="bc-empty-row"><td colspan="6">暂无匹配的数据</td></tr>';
    }
    return values.map(function (value, index) {
      var standard = getRowStandard(value, index);
      return '<tr>' +
        '<td class="bc-data-check"><input type="checkbox" data-bc-data-check="' + escapeHtml(value.value) + '"' + (dataPageState.selected[value.value] ? ' checked' : '') + ' aria-label="选择数据"></td>' +
        '<td title="' + escapeHtml(value.value) + '">' + escapeHtml(value.value) + '</td>' +
        '<td title="' + escapeHtml(value.name) + '">' + escapeHtml(value.name) + '</td>' +
        '<td>-</td>' +
        '<td class="bc-data-std-cell"><button class="bc-data-link" type="button" data-bc-action="toggle-row-standard-picker" data-bc-row-value="' + escapeHtml(value.value) + '">' + escapeHtml(standard.code) + '</button>' + renderStandardPicker('row', value.value, item) + '</td>' +
        '<td title="' + escapeHtml(standard.name) + '">' + escapeHtml(standard.name) + '</td>' +
      '</tr>';
    }).join('');
  }

  function renderAiRows(item) {
    var rows = [
      { batch: 'AI-' + item.code.slice(-4) + '-001', content: '识别编码名称并补全标准编码映射', status: '处理成功', operator: '当前用户', time: '2026-05-21 10:18:32' },
      { batch: 'AI-' + item.code.slice(-4) + '-002', content: '校验父子级编码关系与重复值', status: '处理成功', operator: '演示-测试', time: '2026-05-20 16:42:08' }
    ];
    return rows.map(function (row) {
      return '<tr>' +
        '<td title="' + escapeHtml(row.batch) + '">' + escapeHtml(row.batch) + '</td>' +
        '<td title="' + escapeHtml(row.content) + '">' + escapeHtml(row.content) + '</td>' +
        '<td><span class="tag tag-green">' + escapeHtml(row.status) + '</span></td>' +
        '<td>' + escapeHtml(row.operator) + '</td>' +
        '<td>' + escapeHtml(row.time) + '</td>' +
      '</tr>';
    }).join('');
  }

  function renderDataPage() {
    var panel = pageEl.querySelector('#bcDataPage');
    if (!panel || !dataPageState.rowId) return;
    var item = findRow(dataPageState.rowId);
    if (!item) return;
    var values = getDataPageValues(item);
    var isAi = dataPageState.tab === 'ai';
    var activeStandard = getActiveStandard();
    panel.innerHTML =
      '<div class="bc-data-page-tabs">' +
        '<button class="bc-data-page-tab' + (!isAi ? ' active' : '') + '" type="button" data-bc-action="data-tab" data-bc-data-tab="list">数据列表</button>' +
        '<button class="bc-data-page-tab' + (isAi ? ' active' : '') + '" type="button" data-bc-action="data-tab" data-bc-data-tab="ai">AI处理记录</button>' +
      '</div>' +
      '<div class="bc-data-page-toolbar">' +
        '<div class="bc-data-page-actions">' +
          '<button class="btn btn-primary" type="button" data-bc-action="data-add"><i class="bi bi-plus-lg"></i><span>新增</span></button>' +
          '<button class="btn btn-primary" type="button" data-bc-action="data-import"><i class="bi bi-upload"></i><span>导入</span></button>' +
          '<button class="btn btn-primary" type="button" data-bc-action="data-export"><i class="bi bi-download"></i><span>导出</span></button>' +
          '<button class="btn btn-danger" type="button" data-bc-action="data-delete"><i class="bi bi-trash3"></i><span>删除</span></button>' +
          '<button class="btn btn-primary" type="button" data-bc-action="data-ai"><i class="bi bi-stars"></i><span>AI智能处理</span></button>' +
        '</div>' +
        '<div class="bc-query-box bc-data-page-query"><input id="bcDataKeyword" type="text" value="' + escapeHtml(dataPageState.keyword) + '" placeholder="编码/名称" aria-label="编码或名称"><button class="btn btn-primary" type="button" data-bc-action="search-data"><i class="bi bi-search"></i><span>查询</span></button><button class="btn btn-primary" type="button" data-bc-action="back-data"><i class="bi bi-arrow-left"></i><span>返回</span></button></div>' +
      '</div>' +
      (!isAi ? '<div class="bc-data-standard"><span>标准代码</span><div class="bc-data-standard-picker"><button class="bc-data-standard-link" type="button" data-bc-action="toggle-standard-picker">' + escapeHtml(activeStandard.name + '（' + activeStandard.code + '）') + '</button>' + renderStandardPicker('standard', '', item) + '</div></div>' +
      '<div class="bc-data-page-table-wrap">' +
        '<table class="bc-data-page-table">' +
          '<colgroup><col class="bc-data-w-check"><col class="bc-data-w-code"><col class="bc-data-w-name"><col class="bc-data-w-parent"><col class="bc-data-w-std-code"><col class="bc-data-w-std-name"></colgroup>' +
          '<thead><tr><th class="bc-data-check"><input id="bcDataCheckAll" type="checkbox" aria-label="全选"></th><th><span>编码</span><i class="bi bi-caret-up-fill bc-data-sort-icon active"></i></th><th><span>名称</span><i class="bi bi-caret-down-fill bc-data-sort-icon"></i></th><th><span>父类编码</span><i class="bi bi-caret-down-fill bc-data-sort-icon"></i></th><th><span>标准编码</span><i class="bi bi-caret-down-fill bc-data-sort-icon"></i></th><th><span>标准名称</span><i class="bi bi-caret-down-fill bc-data-sort-icon"></i></th></tr></thead>' +
          '<tbody>' + renderDataPageRows(item) + '</tbody>' +
        '</table>' +
      '</div>' +
      '<div class="bc-data-page-pagination">显示第 ' + (values.length ? 1 : 0) + ' 到第 ' + values.length + ' 条记录，总共 ' + values.length + ' 条记录</div>'
      : '<div class="bc-data-page-table-wrap">' +
        '<table class="bc-data-page-table bc-ai-page-table">' +
          '<colgroup><col class="bc-ai-w-batch"><col class="bc-ai-w-content"><col class="bc-ai-w-status"><col class="bc-ai-w-user"><col class="bc-ai-w-time"></colgroup>' +
          '<thead><tr><th>处理批次</th><th>处理内容</th><th>状态</th><th>提交人</th><th>处理时间</th></tr></thead>' +
          '<tbody>' + renderAiRows(item) + '</tbody>' +
        '</table>' +
      '</div>' +
      '<div class="bc-data-page-pagination">显示第 1 到第 2 条记录，总共 2 条记录</div>');
  }

  function openDataPage(rowId) {
    if (!findRow(rowId)) return;
    dataPageState = createDataPageState(rowId);
    pageEl.classList.add('bc-data-mode');
    renderDataPage();
  }

  function closeDataPage() {
    dataPageState = createDataPageState('');
    pageEl.classList.remove('bc-data-mode');
    renderAll();
  }

  function refreshDataDialog() {
    var item = findRow(dataDialogState.rowId);
    if (!item) return;
    var tree = pageEl.querySelector('#bcValueTree');
    var body = pageEl.querySelector('#bcValueTableBody');
    var title = pageEl.querySelector('#bcValueGroupTitle');
    if (tree) tree.innerHTML = renderValueTree(item);
    if (body) body.innerHTML = renderValueRows(item);
    if (title) title.textContent = getValueGroupName(dataDialogState.group);
  }

  function openDataDialog(rowId) {
    var item = findRow(rowId);
    if (!item) return;
    dataDialogState.rowId = rowId;
    dataDialogState.group = 'all';
    var modal = document.createElement('div');
    modal.className = 'bc-modal-mask';
    modal.setAttribute('data-bc-modal', 'data');
    modal.innerHTML =
      '<div class="bc-modal bc-data-modal" role="dialog" aria-modal="true" aria-label="业务代码数据">' +
        '<div class="bc-modal-head">' +
          '<h3><i class="bi bi-table"></i><span>' + escapeHtml(item.name) + ' - 数据</span></h3>' +
          '<button class="bc-modal-close" type="button" data-bc-action="close-modal" aria-label="关闭"><i class="bi bi-x-lg"></i></button>' +
        '</div>' +
        '<div class="bc-data-body">' +
          '<aside class="bc-value-side">' +
            '<div class="bc-value-search"><i class="bi bi-search"></i><input id="bcValueSearch" type="text" placeholder="搜索数据目录"></div>' +
            '<div id="bcValueTree" class="bc-value-tree-wrap"></div>' +
          '</aside>' +
          '<main class="bc-value-main">' +
            '<div class="bc-value-head"><div><span class="bc-value-label">当前目录</span><strong id="bcValueGroupTitle">全部数据</strong></div><span>' + escapeHtml(item.code) + '</span></div>' +
            '<div class="bc-value-table-wrap">' +
              '<table class="bc-table bc-value-table">' +
                '<thead><tr><th>值编码</th><th>值名称</th><th>分组</th><th>状态</th><th>描述</th></tr></thead>' +
                '<tbody id="bcValueTableBody"></tbody>' +
              '</table>' +
            '</div>' +
          '</main>' +
        '</div>' +
        '<div class="bc-modal-footer">' +
          '<button class="btn btn-outline" type="button" data-bc-action="close-modal"><i class="bi bi-x-lg"></i><span>关闭</span></button>' +
        '</div>' +
      '</div>';
    pageEl.appendChild(modal);
    refreshDataDialog();
  }

  function openLogDialog(logId) {
    var item = findLog(logId);
    if (!item) return;
    var modal = document.createElement('div');
    modal.className = 'bc-modal-mask';
    modal.setAttribute('data-bc-modal', 'log');
    modal.innerHTML =
      '<div class="bc-modal bc-log-modal" role="dialog" aria-modal="true" aria-label="处理日志">' +
        '<div class="bc-modal-head">' +
          '<h3><i class="bi bi-file-text"></i><span>处理日志</span></h3>' +
          '<button class="bc-modal-close" type="button" data-bc-action="close-modal" aria-label="关闭"><i class="bi bi-x-lg"></i></button>' +
        '</div>' +
        '<div class="bc-log-body">' +
          '<div class="bc-log-summary">' +
            '<span>' + escapeHtml(item.fileName) + '</span>' +
            '<span>' + escapeHtml(item.property) + ' / ' + escapeHtml(item.status) + '</span>' +
            '<span>' + escapeHtml(item.time) + '</span>' +
          '</div>' +
          '<ol class="bc-log-lines">' +
            item.detail.map(function (line) {
              return '<li>' + escapeHtml(line) + '</li>';
            }).join('') +
          '</ol>' +
        '</div>' +
        '<div class="bc-modal-footer">' +
          '<button class="btn btn-outline" type="button" data-bc-action="close-modal"><i class="bi bi-x-lg"></i><span>关闭</span></button>' +
        '</div>' +
      '</div>';
    pageEl.appendChild(modal);
  }

  function openImportDialog() {
    closeModal();
    var modal = document.createElement('div');
    modal.className = 'bc-modal-mask';
    modal.setAttribute('data-bc-modal', 'import');
    modal.innerHTML =
      '<div class="bc-modal bc-import-modal" role="dialog" aria-modal="true" aria-label="导入">' +
        '<div class="bc-modal-head bc-import-head">' +
          '<h3><span>导入</span></h3>' +
          '<button class="bc-modal-close" type="button" data-bc-action="close-modal" aria-label="关闭"><i class="bi bi-x-lg"></i></button>' +
        '</div>' +
        '<div class="bc-import-body">' +
          '<div class="bc-import-row">' +
            '<label><span>*</span>覆盖机制</label>' +
            '<div class="bc-import-control">' +
              '<select id="bcImportMode" aria-label="覆盖机制">' +
                '<option value="overwrite">重复覆盖</option>' +
                '<option value="skip">重复跳过</option>' +
              '</select>' +
            '</div>' +
            '<button class="bc-import-template" type="button" data-bc-action="download-import-template"><i class="bi bi-download"></i><span>下载模板</span></button>' +
          '</div>' +
          '<div class="bc-import-row">' +
            '<label><span>*</span>上传文件</label>' +
            '<div class="bc-import-control">' +
              '<input id="bcImportFile" type="file" accept=".xls,.xlsx" aria-label="上传文件">' +
            '</div>' +
            '<div class="bc-import-tip"><i class="bi bi-info-circle-fill"></i><span>文件格式为excel，大小不超过50M</span></div>' +
          '</div>' +
        '</div>' +
        '<div class="bc-modal-footer bc-import-footer">' +
          '<button class="btn btn-primary" type="button" data-bc-action="save-import"><i class="bi bi-check-lg"></i><span>保存</span></button>' +
          '<button class="btn btn-outline" type="button" data-bc-action="close-modal"><i class="bi bi-x-lg"></i><span>取消</span></button>' +
        '</div>' +
      '</div>';
    pageEl.appendChild(modal);
  }

  function openDataAddDialog() {
    closeModal();
    var item = findRow(dataPageState.rowId);
    var parentOptions = item ? (item.values || []).slice(0, 6) : [];
    var modal = document.createElement('div');
    modal.className = 'bc-modal-mask';
    modal.setAttribute('data-bc-modal', 'data-add');
    modal.innerHTML =
      '<div class="bc-modal bc-data-add-modal" role="dialog" aria-modal="true" aria-label="新建">' +
        '<div class="bc-modal-head bc-data-add-head">' +
          '<h3><span>新建</span></h3>' +
          '<button class="bc-modal-close" type="button" data-bc-action="close-modal" aria-label="关闭"><i class="bi bi-x-lg"></i></button>' +
        '</div>' +
        '<div class="bc-data-add-body">' +
          '<div class="bc-data-form-row"><label><span>*</span>编码</label><input type="text" placeholder="长度不超过50个字符"><div class="bc-data-form-hint"><i class="bi bi-check-circle-fill"></i><span>50个字符以内</span></div></div>' +
          '<div class="bc-data-form-row"><label><span>*</span>名称</label><input type="text" placeholder="长度不超过50个字符，允许数字/字母/汉字/下划线，下划线不能开头!"><div class="bc-data-form-hint"><i class="bi bi-check-circle-fill"></i><span>50个字符以内</span></div></div>' +
          '<div class="bc-data-form-row bc-parent-row"><label>父类编码</label>' +
            '<div class="bc-parent-select">' +
              '<button class="bc-parent-selectbox" type="button" data-bc-action="toggle-parent-picker"><span data-bc-parent-text>请选择</span><i class="bi bi-chevron-down"></i></button>' +
              '<div class="bc-parent-dropdown">' +
                '<div class="bc-parent-search"><input id="bcParentSearch" type="text" placeholder="搜索父类编码" aria-label="搜索父类编码"><button type="button" aria-label="搜索"><i class="bi bi-search"></i></button></div>' +
                '<button class="bc-parent-option active" type="button" data-bc-action="choose-parent-code" data-bc-parent-label="请选择">请选择</button>' +
                parentOptions.map(function (value) {
                  var label = value.name + '(' + value.value + ')';
                  return '<button class="bc-parent-option" type="button" data-bc-action="choose-parent-code" data-bc-parent-label="' + escapeHtml(label) + '">' + escapeHtml(label) + '</button>';
                }).join('') +
              '</div>' +
            '</div><div></div>' +
          '</div>' +
        '</div>' +
        '<div class="bc-modal-footer bc-data-add-footer">' +
          '<button class="btn btn-primary" type="button" data-bc-action="save-data-add"><i class="bi bi-check-lg"></i><span>保存</span></button>' +
          '<button class="btn btn-outline" type="button" data-bc-action="close-modal"><i class="bi bi-x-lg"></i><span>关闭</span></button>' +
        '</div>' +
      '</div>';
    pageEl.appendChild(modal);
  }

  function openDataAiDialog() {
    closeModal();
    var modal = document.createElement('div');
    modal.className = 'bc-modal-mask';
    modal.setAttribute('data-bc-modal', 'data-ai');
    modal.innerHTML =
      '<div class="bc-modal bc-data-ai-modal" role="dialog" aria-modal="true" aria-label="AI智能处理">' +
        '<div class="bc-modal-head bc-data-ai-head">' +
          '<h3><span>AI智能处理</span></h3>' +
          '<button class="bc-modal-close" type="button" data-bc-action="close-modal" aria-label="关闭"><i class="bi bi-x-lg"></i></button>' +
        '</div>' +
        '<div class="bc-data-ai-body">' +
          '<div class="bc-ai-info"><strong>AI智能处理:</strong><span>调用AI大模型，智能标准代码引用关联;</span></div>' +
          '<div class="bc-ai-form-row"><label>填充机制:</label><div class="bc-ai-select">' +
            '<select class="bc-ai-native-select"><option>有值覆盖</option><option>有值跳过</option></select>' +
          '</div></div>' +
        '</div>' +
        '<div class="bc-modal-footer bc-data-ai-footer">' +
          '<button class="btn btn-primary" type="button" data-bc-action="save-data-ai"><i class="bi bi-check-lg"></i><span>确定</span></button>' +
          '<button class="btn btn-outline" type="button" data-bc-action="close-modal"><i class="bi bi-x-lg"></i><span>取消</span></button>' +
        '</div>' +
      '</div>';
    pageEl.appendChild(modal);
  }

  function deleteRows(ids) {
    if (!ids.length) {
      showToast('请先选择要删除的业务代码');
      return;
    }
    DP.confirm('确认删除选中的 <b>' + ids.length + '</b> 条业务代码吗？', {
      icon: 'danger',
      okText: '删除',
      onOk: function () {
        rows = rows.filter(function (item) {
          return ids.indexOf(item.id) < 0;
        });
        selectedIds = {};
        renderAll();
        showToast('业务代码已删除');
      }
    });
  }

  function addLog(property, status, fileName, success, fail, total, detail) {
    logs.unshift({
      id: 'log-' + Date.now(),
      fileName: fileName,
      property: property,
      status: status,
      success: success,
      fail: fail,
      total: total,
      operator: '当前用户',
      time: nowText(),
      detail: detail
    });
    renderLogTable();
  }

  function updateSyncButton() {
    if (!pageEl) return;
    var button = pageEl.querySelector('[data-bc-action="sync"]');
    if (!button) return;
    if (syncState.running) {
      button.disabled = true;
      button.classList.add('bc-syncing');
      button.innerHTML = '<i class="bi bi-arrow-repeat"></i><span>同步中(' + syncState.progress + '%)...</span>';
    } else {
      button.disabled = false;
      button.classList.remove('bc-syncing');
      button.innerHTML = '<i class="bi bi-arrow-repeat"></i><span>同步</span>';
    }
  }

  function startSync() {
    if (syncState.running) return;
    var steps = [12, 28, 43, 56, 72, 88, 100];
    var index = 0;
    syncState.running = true;
    syncState.progress = 0;
    updateSyncButton();
    showToast('同步任务已提交');
    if (syncState.timer) clearInterval(syncState.timer);
    syncState.timer = setInterval(function () {
      syncState.progress = steps[index] || 100;
      updateSyncButton();
      index += 1;
      if (syncState.progress >= 100) {
        clearInterval(syncState.timer);
        syncState.timer = null;
        setTimeout(function () {
          syncState.running = false;
          syncState.progress = 0;
          addLog('同步', '处理成功', '业务代码_同步_' + nowText().slice(0, 10).replace(/-/g, '') + '.xlsx', getFilteredRows().length, 0, getFilteredRows().length, ['同步任务执行完成。', '已比对业务代码与标准代码映射关系。', '同步结果已写入静态原型记录。']);
          updateSyncButton();
          showToast('同步完成');
        }, 280);
      }
    }, 420);
  }

  function handleAction(actionEl) {
    var action = actionEl.dataset.bcAction;
    var id = actionEl.dataset.bcId;

    if (action === 'toggle-tree') {
      var treeId = actionEl.dataset.bcTreeId;
      openTree[treeId] = !openTree[treeId];
      renderTree();
    } else if (action === 'sort') {
      var sortKey = actionEl.dataset.bcSort;
      if (listFilters.sortKey === sortKey) {
        listFilters.sortDir = listFilters.sortDir === 'asc' ? 'desc' : 'asc';
      } else {
        listFilters.sortKey = sortKey;
        listFilters.sortDir = 'asc';
      }
      renderListTable();
    } else if (action === 'new') {
      openEditor('');
    } else if (action === 'import') {
      openImportDialog();
    } else if (action === 'export') {
      addLog('导出', '处理成功', '业务代码_导出_' + nowText().slice(0, 10).replace(/-/g, '') + '.xlsx', getFilteredRows().length, 0, getFilteredRows().length, ['导出范围：当前筛选结果。', '文件已生成，可在导入导出记录中查看。']);
      showToast('导出文件已生成');
    } else if (action === 'download-import-template') {
      showToast('业务代码导入模板已生成');
    } else if (action === 'save-import') {
      var importMode = pageEl.querySelector('#bcImportMode');
      var importFile = pageEl.querySelector('#bcImportFile');
      var fileName = importFile && importFile.files && importFile.files.length ? importFile.files[0].name : '业务代码_导入模板.xlsx';
      var modeText = importMode && importMode.value === 'skip' ? '重复跳过' : '重复覆盖';
      addLog('导入', '处理成功', fileName, 8, 0, 8, ['覆盖机制：' + modeText + '。', '读取文件成功，共 8 条业务代码数据。', '校验编码唯一性通过。']);
      closeModal('import');
      showToast('业务代码导入成功');
    } else if (action === 'sync') {
      startSync();
    } else if (action === 'delete-selected') {
      deleteRows(Object.keys(selectedIds));
    } else if (action === 'search-list') {
      var keywordInput = pageEl.querySelector('#bcKeywordInput');
      listFilters.keyword = keywordInput ? keywordInput.value : '';
      selectedIds = {};
      renderListTable();
    } else if (action === 'search-log') {
      var propertySelect = pageEl.querySelector('#bcLogProperty');
      var statusSelect = pageEl.querySelector('#bcLogStatus');
      var keywordInputLog = pageEl.querySelector('#bcLogKeyword');
      logFilters.property = propertySelect ? propertySelect.value : '';
      logFilters.status = statusSelect ? statusSelect.value : '';
      logFilters.keyword = keywordInputLog ? keywordInputLog.value : '';
      logDetailId = '';
      renderLogDetail();
      renderLogTable();
    } else if (action === 'edit') {
      openEditor(id);
    } else if (action === 'data') {
      openDataPage(id);
    } else if (action === 'back-data') {
      closeDataPage();
    } else if (action === 'data-tab') {
      dataPageState.tab = actionEl.dataset.bcDataTab || 'list';
      dataPageState.picker = { type: '', rowValue: '', keyword: '' };
      renderDataPage();
    } else if (action === 'search-data') {
      var dataKeyword = pageEl.querySelector('#bcDataKeyword');
      dataPageState.keyword = dataKeyword ? dataKeyword.value : '';
      dataPageState.selected = {};
      dataPageState.picker = { type: '', rowValue: '', keyword: '' };
      renderDataPage();
    } else if (action === 'toggle-standard-picker') {
      var isStandardOpen = dataPageState.picker.type === 'standard';
      dataPageState.picker = isStandardOpen ? { type: '', rowValue: '', keyword: '' } : { type: 'standard', rowValue: '', keyword: '' };
      renderDataPage();
    } else if (action === 'toggle-row-standard-picker') {
      var rowValue = actionEl.dataset.bcRowValue || '';
      var isRowOpen = dataPageState.picker.type === 'row' && dataPageState.picker.rowValue === rowValue;
      var dataItemForPicker = findRow(dataPageState.rowId);
      var rowValues = dataItemForPicker ? (dataItemForPicker.values || []) : [];
      var rowIndex = rowValues.findIndex(function (value) { return value.value === rowValue; });
      var rowStandard = rowIndex >= 0 ? getRowStandard(rowValues[rowIndex], rowIndex) : { code: '', name: '' };
      dataPageState.picker = isRowOpen ? { type: '', rowValue: '', keyword: '' } : { type: 'row', rowValue: rowValue, keyword: rowStandard.code };
      renderDataPage();
    } else if (action === 'choose-standard-option') {
      var chosen = {
        code: actionEl.dataset.bcStdCode || '',
        name: actionEl.dataset.bcStdName || ''
      };
      if (actionEl.dataset.bcStdType === 'row') {
        dataPageState.rowStandards[actionEl.dataset.bcRowValue || ''] = chosen;
      } else {
        dataPageState.standard = chosen;
      }
      dataPageState.picker = { type: '', rowValue: '', keyword: '' };
      renderDataPage();
    } else if (action === 'data-add') {
      openDataAddDialog();
    } else if (action === 'data-import') {
      openImportDialog();
    } else if (action === 'data-export') {
      showToast('当前数据已导出');
    } else if (action === 'data-delete') {
      var count = Object.keys(dataPageState.selected || {}).length;
      showToast(count ? '已删除选中的 ' + count + ' 条数据' : '请先选择要删除的数据');
    } else if (action === 'data-ai') {
      openDataAiDialog();
    } else if (action === 'save-data-add') {
      closeModal('data-add');
      showToast('数据已新增');
    } else if (action === 'save-data-ai') {
      closeModal('data-ai');
      dataPageState.tab = 'ai';
      renderDataPage();
      showToast('AI智能处理任务已生成');
    } else if (action === 'toggle-parent-picker') {
      var parentSelect = actionEl.closest('.bc-parent-select');
      if (parentSelect) parentSelect.classList.toggle('open');
    } else if (action === 'choose-parent-code') {
      var parentWrap = actionEl.closest('.bc-parent-select');
      var parentText = parentWrap ? parentWrap.querySelector('[data-bc-parent-text]') : null;
      if (parentText) parentText.textContent = actionEl.dataset.bcParentLabel || '请选择';
      if (parentWrap) {
        parentWrap.querySelectorAll('.bc-parent-option').forEach(function (option) {
          option.classList.toggle('active', option === actionEl);
        });
        parentWrap.classList.remove('open');
      }
    } else if (action === 'refs') {
      var item = findRow(id);
      showToast(item && item.refCount ? item.name + ' 已关联 ' + item.refCount + ' 处引用' : '当前业务代码暂无关联引用');
    } else if (action === 'delete-row') {
      deleteRows([id]);
    } else if (action === 'close-modal') {
      closeModal();
    } else if (action === 'save-editor') {
      saveEditor();
    } else if (action === 'back-editor') {
      closeEditor();
    } else if (action === 'toggle-editor-picker') {
      if (!editorState) return;
      syncEditorFromForm();
      if (actionEl.dataset.bcPicker === 'category') {
        editorState.categoryOpen = !editorState.categoryOpen;
        editorState.databaseOpen = false;
        editorState.tableOpen = false;
      } else {
        editorState.databaseOpen = !editorState.databaseOpen;
        editorState.categoryOpen = false;
        editorState.tableOpen = false;
      }
      renderEditor();
    } else if (action === 'toggle-editor-table') {
      if (!editorState) return;
      syncEditorFromForm();
      editorState.tableOpen = !editorState.tableOpen;
      editorState.categoryOpen = false;
      editorState.databaseOpen = false;
      renderEditor();
    } else if (action === 'choose-editor-category') {
      if (!editorState) return;
      syncEditorFromForm();
      editorState.category = id || editorState.category;
      editorState.categoryOpen = false;
      renderEditor();
    } else if (action === 'choose-editor-db') {
      if (!editorState) return;
      syncEditorFromForm();
      editorState.database = id || '';
      editorState.table = '';
      editorState.tableKeyword = '';
      editorState.databaseOpen = false;
      renderEditor();
    } else if (action === 'choose-editor-table') {
      if (!editorState) return;
      syncEditorFromForm();
      editorState.table = actionEl.dataset.bcTable || '';
      editorState.tableOpen = false;
      renderEditor();
    } else if (action === 'clear-editor-db') {
      if (!editorState) return;
      syncEditorFromForm();
      editorState.database = '';
      editorState.table = '';
      editorState.tableKeyword = '';
      renderEditor();
    } else if (action === 'value-tree') {
      dataDialogState.group = actionEl.dataset.bcValueGroup || 'all';
      refreshDataDialog();
    } else if (action === 'view-log') {
      logDetailId = actionEl.dataset.bcLogId || '';
      activeTab = 'log';
      renderTab();
    } else if (action === 'back-log') {
      logDetailId = '';
      renderLogDetail();
    }
  }

  function bindEvents() {
    pageEl.addEventListener('click', function (e) {
      if (e.target.classList.contains('bc-modal-mask')) {
        closeModal();
        return;
      }

      var tab = e.target.closest('[data-bc-tab]');
      if (tab && pageEl.contains(tab)) {
        activeTab = tab.dataset.bcTab;
        logDetailId = '';
        renderTab();
        return;
      }

      var treeRow = e.target.closest('.bc-tree-row[data-bc-tree-id]');
      var actionEl = e.target.closest('[data-bc-action]');
      if (treeRow && pageEl.contains(treeRow) && !(actionEl && actionEl.dataset.bcAction === 'toggle-tree')) {
        selectedCatalog = treeRow.dataset.bcTreeId;
        selectedIds = {};
        renderAll();
        return;
      }

      if (!actionEl || !pageEl.contains(actionEl)) return;
      handleAction(actionEl);
    });

    pageEl.addEventListener('change', function (e) {
      if (e.target.id === 'bcCheckAll') {
        getFilteredRows().forEach(function (item) {
          if (e.target.checked) selectedIds[item.id] = true;
          else delete selectedIds[item.id];
        });
        renderListTable();
      } else if (e.target.matches('[data-bc-row-check]')) {
        var id = e.target.dataset.bcRowCheck;
        if (e.target.checked) selectedIds[id] = true;
        else delete selectedIds[id];
        updateCheckAll();
      } else if (e.target.id === 'bcDataCheckAll') {
        var item = findRow(dataPageState.rowId);
        var values = item ? getDataPageValues(item) : [];
        values.forEach(function (value) {
          if (e.target.checked) dataPageState.selected[value.value] = true;
          else delete dataPageState.selected[value.value];
        });
        renderDataPage();
      } else if (e.target.matches('[data-bc-data-check]')) {
        var dataId = e.target.dataset.bcDataCheck;
        if (e.target.checked) dataPageState.selected[dataId] = true;
        else delete dataPageState.selected[dataId];
      } else if (e.target.id === 'bcLogProperty' || e.target.id === 'bcLogStatus') {
        var query = pageEl.querySelector('[data-bc-action="search-log"]');
        if (query) query.click();
      } else if (e.target.id === 'bcEditAddMode') {
        syncEditorFromForm();
        renderEditor();
      }
    });

    pageEl.addEventListener('input', function (e) {
      if (e.target.id === 'bcTreeSearch') {
        renderTree();
      } else if (e.target.id === 'bcCategorySearch') {
        if (!editorState) return;
        editorState.categoryKeyword = e.target.value;
        var categoryDrop = e.target.closest('.bc-editor-dropdown');
        var categoryTree = categoryDrop ? categoryDrop.querySelector('.bc-editor-tree') : null;
        if (categoryTree) {
          categoryTree.innerHTML = renderEditorTreeNodes(catalogTree, editorState.category, 'choose-editor-category', normalize(editorState.categoryKeyword)) || '<li class="bc-editor-empty">暂无匹配目录</li>';
        }
      } else if (e.target.id === 'bcDatabaseSearch') {
        if (!editorState) return;
        editorState.databaseKeyword = e.target.value;
        var databaseDrop = e.target.closest('.bc-editor-dropdown');
        var databaseTreeEl = databaseDrop ? databaseDrop.querySelector('.bc-editor-tree') : null;
        if (databaseTreeEl) {
          databaseTreeEl.innerHTML = renderDatabaseTreeNodes(databaseTree, normalize(editorState.databaseKeyword)) || '<li class="bc-editor-empty">暂无匹配目录</li>';
        }
      } else if (e.target.id === 'bcTableSearch') {
        if (!editorState) return;
        editorState.tableKeyword = e.target.value;
        var tableDrop = e.target.closest('.bc-editor-dropdown');
        var tableList = tableDrop ? tableDrop.querySelector('.bc-editor-table-list') : null;
        if (tableList) {
          tableList.innerHTML = renderTableOptionRows(normalize(editorState.tableKeyword));
        }
      } else if (e.target.id === 'bcStandardSearch' || e.target.id === 'bcRowStandardSearch') {
        var dataItem = findRow(dataPageState.rowId);
        dataPageState.picker.keyword = e.target.value;
        var picker = e.target.closest('.bc-std-picker');
        var pickerList = picker ? picker.querySelector('.bc-std-picker-list') : null;
        if (pickerList && dataItem) {
          pickerList.innerHTML = renderStandardPickerOptions(dataPageState.picker.type, dataPageState.picker.rowValue, dataItem);
        }
      } else if (e.target.id === 'bcParentSearch') {
        var parentKeyword = normalize(e.target.value);
        var parentBox = e.target.closest('.bc-parent-dropdown');
        if (parentBox) {
          parentBox.querySelectorAll('.bc-parent-option').forEach(function (option) {
            option.style.display = !parentKeyword || normalize(option.textContent).indexOf(parentKeyword) >= 0 ? '' : 'none';
          });
        }
      } else if (e.target.id === 'bcValueSearch') {
        var keyword = normalize(e.target.value);
        pageEl.querySelectorAll('.bc-value-row[data-bc-value-group]').forEach(function (row) {
          var text = normalize(row.textContent);
          row.parentElement.style.display = !keyword || text.indexOf(keyword) >= 0 ? '' : 'none';
        });
      }
    });

    pageEl.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter') return;
      if (e.target.id === 'bcKeywordInput') {
        var listBtn = pageEl.querySelector('[data-bc-action="search-list"]');
        if (listBtn) listBtn.click();
      } else if (e.target.id === 'bcDataKeyword') {
        var dataBtn = pageEl.querySelector('[data-bc-action="search-data"]');
        if (dataBtn) dataBtn.click();
      } else if (e.target.id === 'bcLogKeyword') {
        var logBtn = pageEl.querySelector('[data-bc-action="search-log"]');
        if (logBtn) logBtn.click();
      }
    });
  }

  var html = '<div class="page-business-code">' +
    '<aside class="bc-left-panel">' +
      '<div class="bc-tree-search">' +
        '<input id="bcTreeSearch" type="text" placeholder="关键字搜索" aria-label="关键字搜索">' +
        '<button type="button" aria-label="搜索目录"><i class="bi bi-search"></i></button>' +
      '</div>' +
      '<div class="bc-tree-title"><i class="bi bi-diagram-3"></i><span>数据目录</span></div>' +
      '<div class="bc-tree-scroll"><ul class="bc-tree" id="bcCatalogTree"></ul></div>' +
    '</aside>' +
    '<section class="bc-main-panel">' +
      '<div class="bc-tabs">' +
        '<button class="bc-tab active" type="button" data-bc-tab="list">数据列表</button>' +
        '<button class="bc-tab" type="button" data-bc-tab="log">导入导出</button>' +
      '</div>' +
      '<div class="bc-panel active" data-bc-panel="list">' +
        '<div class="bc-toolbar">' +
          '<div class="bc-toolbar-left">' +
            '<button class="btn btn-primary" type="button" data-bc-action="new"><i class="bi bi-plus-lg"></i><span>新增</span></button>' +
            '<button class="btn btn-primary" type="button" data-bc-action="import"><i class="bi bi-upload"></i><span>导入</span></button>' +
            '<button class="btn btn-primary" type="button" data-bc-action="export"><i class="bi bi-download"></i><span>导出</span></button>' +
            '<button class="btn btn-primary" type="button" data-bc-action="sync"><i class="bi bi-arrow-repeat"></i><span>同步</span></button>' +
            '<button class="btn btn-danger" type="button" data-bc-action="delete-selected"><i class="bi bi-trash3"></i><span>删除</span></button>' +
          '</div>' +
          '<div class="bc-toolbar-right">' +
            '<div class="bc-query-box"><input id="bcKeywordInput" type="text" placeholder="编码/名称" aria-label="编码或名称"><button class="btn btn-primary" type="button" data-bc-action="search-list"><i class="bi bi-search"></i><span>查询</span></button></div>' +
          '</div>' +
        '</div>' +
        '<div class="bc-table-wrap">' +
          '<table class="bc-table">' +
            '<colgroup><col class="bc-w-check"><col class="bc-w-code"><col class="bc-w-name"><col class="bc-w-count"><col class="bc-w-ref"><col class="bc-w-desc"><col class="bc-w-owner"><col class="bc-w-time"><col class="bc-w-action"></colgroup>' +
            '<thead><tr>' +
              '<th class="bc-col-check"><input id="bcCheckAll" type="checkbox" aria-label="全选"></th>' +
              '<th>' + sortHeader('code', '编码') + '</th>' +
              '<th>' + sortHeader('name', '名称') + '</th>' +
              '<th>' + sortHeader('recordCount', '记录数') + '</th>' +
              '<th>' + sortHeader('refCount', '关联引用') + '</th>' +
              '<th>' + sortHeader('desc', '描述') + '</th>' +
              '<th>' + sortHeader('creator', '创建人') + '</th>' +
              '<th>' + sortHeader('createdAt', '创建时间') + '</th>' +
              '<th>操作</th>' +
            '</tr></thead>' +
            '<tbody id="bcTableBody"></tbody>' +
          '</table>' +
        '</div>' +
        '<div class="bc-pagination" id="bcListPagination"></div>' +
      '</div>' +
      '<div class="bc-panel" data-bc-panel="log">' +
        '<div class="bc-log-filter bc-log-list-part">' +
          '<select id="bcLogProperty" aria-label="属性"><option value="">属性</option><option value="导入">导入</option><option value="导出">导出</option><option value="同步">同步</option></select>' +
          '<select id="bcLogStatus" aria-label="状态"><option value="">状态</option><option value="处理成功">处理成功</option><option value="处理失败">处理失败</option><option value="处理中">处理中</option></select>' +
          '<div class="bc-query-box"><input id="bcLogKeyword" type="text" placeholder="文件名" aria-label="文件名"><button class="btn btn-primary" type="button" data-bc-action="search-log"><i class="bi bi-search"></i><span>查询</span></button></div>' +
        '</div>' +
        '<div class="bc-table-wrap bc-log-table-wrap bc-log-list-part">' +
          '<table class="bc-table bc-log-table">' +
            '<colgroup><col class="bc-log-file"><col class="bc-log-prop"><col class="bc-log-status"><col class="bc-log-count"><col class="bc-log-user"><col class="bc-log-time"><col class="bc-log-action"></colgroup>' +
            '<thead><tr><th>文件名</th><th>属性</th><th>状态</th><th>处理记录数(成功/失败/总量)</th><th>操作者</th><th>时间</th><th>操作</th></tr></thead>' +
            '<tbody id="bcLogTableBody"></tbody>' +
          '</table>' +
        '</div>' +
        '<div class="bc-pagination bc-log-list-part" id="bcLogPagination"></div>' +
        '<div class="bc-log-detail" id="bcLogDetail"></div>' +
      '</div>' +
      '<section class="bc-editor-panel" id="bcEditorPanel"></section>' +
      '<section class="bc-data-page" id="bcDataPage"></section>' +
    '</section>' +
  '</div>';

  return {
    html: html,
    init: function () {
      pageEl = document.querySelector('.page-business-code');
      if (!pageEl) return;
      activeTab = 'list';
      selectedCatalog = 'all';
      selectedIds = {};
      listFilters = { keyword: '', sortKey: '', sortDir: 'asc' };
      logFilters = { property: '', status: '', keyword: '' };
      logDetailId = '';
      dataDialogState = { rowId: '', group: 'all' };
      dataPageState = createDataPageState('');
      editorState = null;
      if (syncState.timer) clearInterval(syncState.timer);
      syncState = { running: false, progress: 0, timer: null };
      bindEvents();
      renderAll();
      updateSyncButton();
    }
  };
})();
