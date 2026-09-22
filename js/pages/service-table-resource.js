/**
 * 数据中台 V4.0 - 数据服务 · 库表资源
 * 依据参考系统还原数据源/数据目录导航、数据源管理、状态筛选与资源列表。
 */
window.DP = window.DP || {};
DP.pages = DP.pages || {};

DP.pages.serviceTableResource = (function () {
  var pageEl;
  var navMode = 'source';
  var selectedNode = '业务系统';
  var zebraEnabled = false;
  var compactEnabled = false;
  var editorState = null;

  var sourceTree = [
    {
      name: '业务系统', count: 4, open: true, children: [
        { name: '客户关系系统', count: 2 },
        { name: '客服工单系统', count: 2 },
        { name: '供应链系统', count: 2 },
        { name: '物联网平台', count: 2 }
      ]
    },
    {
      name: '数仓分层', count: 4, children: [
        { name: 'ODS贴源层', count: 2 },
        { name: 'DWD明细层', count: 1 },
        { name: 'DWS汇总层', count: 1 }
      ]
    }
  ];

  var catalogTree = [
    {
      name: '我的目录', count: 4, open: true, children: [
        { name: '经营分析', count: 2 },
        { name: '客户服务', count: 2 },
        { name: '供应链数据', count: 2 },
        { name: '物联感知', count: 2 }
      ]
    }
  ];

  var managerSourceTree = [
    { name: '数据质量-报告', children: [{ name: 'quality_report', count: 12 }] },
    { name: '业务系统', children: [
      { name: '客户关系系统', children: [{ name: 'crm_prod', count: 68 }] },
      { name: '客服工单系统', children: [{ name: 'ticket_center', count: 181 }] },
      { name: '供应链系统', children: [{ name: 'supply_chain', count: 92 }] },
      { name: '物联网平台', children: [{ name: 'iot_platform', count: 40 }] }
    ] },
    { name: 'ODS-贴源层', children: [{ name: 'ods_business', count: 126 }] },
    { name: 'DWS-数据汇总层', children: [{ name: 'dws_summary', count: 34 }] },
    { name: 'ADS-应用层', children: [{ name: 'ads_analysis', count: 27 }] },
    { name: '演示', children: [{ name: 'demo_service', count: 8 }] },
    { name: 'DWD-数据明细层', children: [{ name: 'dwd_detail', count: 86 }] },
    { name: '系统业务库', children: [{ name: 'platform_core', count: 31 }] }
  ];

  var managedSourceNames = ['crm_prod', 'ticket_center', 'supply_chain', 'iot_platform', 'demo_service'];

  var rows = [
    { id: 'table-001', code: '20260921000128', name: '客户主信息表', enName: 'customer_master', category: '我的目录/经营分析,我的目录/客户服务', version: 'V1', publish: '已上架', audit: '上架通过', updatedAt: '2026-09-21 09:36:28', desc: '客户基本属性、等级及归属组织', source: '客户关系系统' },
    { id: 'table-002', code: '20260921000135', name: '客户联系信息表', enName: 'customer_contact', category: '我的目录/客户服务', version: 'V1', publish: '编制', audit: '', updatedAt: '2026-09-21 09:34:16', desc: '客户联系方式及联系偏好', source: '客户关系系统' },
    { id: 'table-003', code: '20260920000096', name: '客服工单明细表', enName: 'service_ticket', category: '我的目录/客户服务', version: 'V2', publish: '已上架', audit: '上架通过', updatedAt: '2026-09-20 18:22:41', desc: '客服工单受理、流转及办结明细', source: '客服工单系统' },
    { id: 'table-004', code: '20260920000107', name: '工单处置记录表', enName: 'ticket_handle_record', category: '', version: 'V1', publish: '编制', audit: '', updatedAt: '2026-09-20 17:48:09', desc: '工单各环节处置记录', source: '客服工单系统' },
    { id: 'table-005', code: '20260919000072', name: '供应商交付明细表', enName: 'supplier_delivery', category: '我的目录/供应链数据', version: 'V1', publish: '待上架', audit: '上架待审核', updatedAt: '2026-09-19 14:16:52', desc: '供应商订单交付和签收状态', source: '供应链系统' },
    { id: 'table-006', code: '20260919000081', name: '采购订单表', enName: 'purchase_order', category: '我的目录/供应链数据,我的目录/经营分析', version: 'V1', publish: '已上架', audit: '上架通过', updatedAt: '2026-09-19 11:05:37', desc: '采购订单主信息及履约状态', source: '供应链系统' },
    { id: 'table-007', code: '20260918000043', name: '设备告警记录表', enName: 'device_alarm', category: '我的目录/物联感知', version: 'V1', publish: '编制', audit: '', updatedAt: '2026-09-18 16:42:19', desc: '设备告警内容、级别及处置结果', source: '物联网平台' },
    { id: 'table-008', code: '20260918000051', name: '设备运行状态表', enName: 'device_runtime_status', category: '我的目录/物联感知', version: 'V1', publish: '已上架', audit: '上架通过', updatedAt: '2026-09-18 15:20:06', desc: '设备运行状态实时采集结果', source: '物联网平台' },
    { id: 'table-009', code: '20260917000038', name: '销售订单贴源表', enName: 'ods_sales_order', category: '我的目录/经营分析', version: 'V1', publish: '编制', audit: '', updatedAt: '2026-09-17 10:18:33', desc: '销售订单系统每日同步明细', source: 'ODS贴源层' },
    { id: 'table-010', code: '20260916000029', name: '区域销售日汇总表', enName: 'dws_region_sales_day', category: '我的目录/经营分析', version: 'V3', publish: '已上架', audit: '上架通过', updatedAt: '2026-09-16 20:05:48', desc: '按区域与业务日期汇总销售指标', source: 'DWS汇总层' }
  ];

  function escapeHtml(text) {
    return String(text == null ? '' : text)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function statusClass(status) {
    if (status === '已上架' || status === '上架通过' || status === '下架通过') return 'success';
    if (status === '待上架' || status === '上架待审核' || status === '下架待审核') return 'warning';
    if (status === '上架驳回' || status === '下架驳回') return 'danger';
    return 'default';
  }

  function renderStatus(status) {
    return status ? '<span class="svc-status ' + statusClass(status) + '">' + escapeHtml(status) + '</span>' : '<span class="svc-empty">--</span>';
  }

  function treeNodesHtml(nodes, parentPath, mode) {
    return nodes.map(function (node) {
      var path = parentPath ? parentPath + '/' + node.name : node.name;
      var hasChildren = !!(node.children && node.children.length);
      return '<div class="svc-tr-tree-node' + (hasChildren && node.open ? ' open' : '') + '" data-tr-tree-node data-name="' + escapeHtml(node.name.toLowerCase()) + '" data-path="' + escapeHtml(path.toLowerCase()) + '">' +
        '<button class="svc-tree-row' + (hasChildren ? ' has-children open' : '') + (selectedNode === node.name ? ' active' : '') + '" type="button" data-tr-node="' + escapeHtml(node.name) + '" data-tr-mode="' + mode + '">' +
          (hasChildren ? '<i class="bi bi-chevron-right svc-tree-arrow"></i>' : '<span class="svc-tr-tree-spacer"></span>') +
          '<i class="bi ' + (hasChildren ? 'bi-stack' : 'bi-database') + '"></i><span>' + escapeHtml(node.name) + (node.count != null ? ' (' + node.count + ')' : '') + '</span>' +
        '</button>' +
        (hasChildren ? '<div class="svc-tr-tree-children">' + treeNodesHtml(node.children, path, mode) + '</div>' : '') +
      '</div>';
    }).join('');
  }

  function navigationHtml() {
    var tree = navMode === 'source' ? sourceTree : catalogTree;
    return '<aside class="svc-catalog-panel svc-tr-navigation">' +
      '<div class="svc-tr-nav-tabs"><button type="button" class="' + (navMode === 'source' ? 'active' : '') + '" data-tr-nav="source">数据源</button><button type="button" class="' + (navMode === 'catalog' ? 'active' : '') + '" data-tr-nav="catalog">数据目录</button></div>' +
      '<div class="svc-catalog-search"><i class="bi bi-search"></i><input data-tr-tree-search placeholder="请输入"></div>' +
      '<div class="svc-tree-list" data-tr-tree>' + treeNodesHtml(tree, '', navMode) + '<div class="svc-tree-empty" data-tr-tree-empty hidden>未找到匹配目录</div></div>' +
    '</aside>';
  }

  function filteredRows() {
    var publish = pageEl.querySelector('[data-tr-filter="publish"]');
    var audit = pageEl.querySelector('[data-tr-filter="audit"]');
    var keyword = pageEl.querySelector('[data-tr-filter="keyword"]');
    var publishValue = publish ? publish.value : '';
    var auditValue = audit ? audit.value : '';
    var keywordValue = keyword ? keyword.value.trim().toLowerCase() : '';
    return rows.filter(function (row) {
      if (publishValue && row.publish !== publishValue) return false;
      if (auditValue && row.audit !== auditValue) return false;
      if (navMode === 'source' && selectedNode) {
        if (selectedNode === '业务系统' && ['客户关系系统', '客服工单系统', '供应链系统', '物联网平台'].indexOf(row.source) < 0) return false;
        if (selectedNode === '数仓分层' && ['ODS贴源层', 'DWD明细层', 'DWS汇总层'].indexOf(row.source) < 0) return false;
        if (selectedNode !== '业务系统' && selectedNode !== '数仓分层' && row.source !== selectedNode) return false;
      }
      if (navMode === 'catalog' && selectedNode) {
        if (selectedNode === '我的目录' && !row.category) return false;
        if (selectedNode !== '我的目录' && row.category.indexOf(selectedNode) < 0) return false;
      }
      if (keywordValue && [row.code, row.name, row.enName].join(' ').toLowerCase().indexOf(keywordValue) < 0) return false;
      return true;
    });
  }

  function rowHtml(row) {
    return '<tr>' +
      '<td class="svc-code-col">' + escapeHtml(row.code) + '</td>' +
      '<td class="svc-name-col" title="' + escapeHtml(row.name) + '">' + escapeHtml(row.name) + '</td>' +
      '<td class="svc-en-col" title="' + escapeHtml(row.enName) + '">' + escapeHtml(row.enName) + '</td>' +
      '<td class="svc-category-col" title="' + escapeHtml(row.category) + '">' + (row.category ? escapeHtml(row.category) : '<span class="svc-empty">--</span>') + '</td>' +
      '<td>' + escapeHtml(row.version) + '</td><td>' + renderStatus(row.publish) + '</td><td>' + renderStatus(row.audit) + '</td>' +
      '<td>' + escapeHtml(row.updatedAt) + '</td><td class="svc-desc-col" title="' + escapeHtml(row.desc) + '">' + escapeHtml(row.desc) + '</td>' +
      '<td class="svc-action-col">' + (row.publish === '编制' ? '<button class="svc-row-action" type="button" data-tr-edit="' + row.id + '"><i class="bi bi-pencil-square"></i><span>编辑</span></button>' : '') + '</td>' +
    '</tr>';
  }

  function renderTable() {
    var body = pageEl.querySelector('#tableResourceTbody');
    if (!body) return;
    var result = filteredRows();
    body.innerHTML = result.length ? result.map(rowHtml).join('') : '<tr><td colspan="10"><div class="svc-empty-state"><i class="bi bi-inbox"></i><span>暂无匹配的库表资源</span></div></td></tr>';
    pageEl.querySelector('[data-tr-total]').textContent = '共 ' + result.length + ' 条';
  }

  function listHtml() {
    return '<section class="svc-list-panel">' +
      '<div class="svc-toolbar svc-tr-toolbar"><div class="svc-toolbar-left">' +
        (navMode === 'source' ? '<button class="btn btn-text svc-top-action" type="button" data-tr-manage><i class="bi bi-database-gear"></i><span>数据源管理</span></button>' : '') +
      '</div><div class="svc-filter-bar">' +
        '<label>发布状态</label><select class="svc-select" data-tr-filter="publish"><option value="">请选择</option><option>编制</option><option>待上架</option><option>已上架</option></select>' +
        '<label>审核状态</label><select class="svc-select" data-tr-filter="audit"><option value="">请选择</option><option>上架待审核</option><option>上架通过</option><option>上架驳回</option><option>下架待审核</option><option>下架通过</option><option>下架驳回</option></select>' +
        '<input class="svc-keyword" data-tr-filter="keyword" placeholder="数据编码/数据名称/英文名称"><button class="btn btn-primary svc-query" type="button" data-tr-query><i class="bi bi-search"></i><span>查询</span></button>' +
      '</div></div>' +
      '<div class="svc-table-tools"><label class="svc-switch" title="表格斑马纹"><input type="checkbox" data-tr-zebra' + (zebraEnabled ? ' checked' : '') + '><span class="svc-switch-track"></span><em class="svc-switch-text">' + (zebraEnabled ? '开' : '关') + '</em></label><span class="svc-tool-sep"></span>' +
        '<button class="svc-tool-btn" type="button" title="刷新" data-tr-tool="refresh"><i class="bi bi-arrow-clockwise"></i></button><button class="svc-tool-btn" type="button" title="行高" data-tr-tool="density"><i class="bi bi-arrows-expand"></i></button><button class="svc-tool-btn" type="button" title="列设置" data-tr-tool="columns"><i class="bi bi-gear"></i></button><button class="svc-tool-btn" type="button" title="全屏" data-tr-tool="fullscreen"><i class="bi bi-arrows-fullscreen"></i></button>' +
      '</div>' +
      '<div class="svc-table-wrap"><table class="ds-table svc-api-table svc-table-resource-table"><thead><tr><th class="svc-code-col">数据编码 <i class="bi bi-caret-up-fill sort-icon"></i><i class="bi bi-caret-down-fill sort-icon"></i></th><th class="svc-name-col">数据名称 <i class="bi bi-caret-up-fill sort-icon"></i><i class="bi bi-caret-down-fill sort-icon"></i></th><th class="svc-en-col">英文名称 <i class="bi bi-caret-up-fill sort-icon"></i><i class="bi bi-caret-down-fill sort-icon"></i></th><th class="svc-category-col">分类</th><th>版本</th><th>发布状态</th><th>审核状态</th><th>更新时间</th><th class="svc-desc-col">描述</th><th class="svc-action-col">操作</th></tr></thead><tbody id="tableResourceTbody"></tbody></table></div>' +
      '<div class="svc-pagination"><span data-tr-total>共 0 条</span><div class="svc-page-controls"><button class="svc-page-btn disabled" type="button"><i class="bi bi-chevron-left"></i></button><button class="svc-page-num active" type="button">1</button><button class="svc-page-btn disabled" type="button"><i class="bi bi-chevron-right"></i></button><select class="svc-page-size"><option>10 条/页</option><option>20 条/页</option><option>50 条/页</option></select></div></div>' +
    '</section>';
  }

  function showToast(text, type) {
    var old = pageEl.querySelector('.svc-toast');
    if (old) old.remove();
    var toast = document.createElement('div');
    toast.className = 'svc-toast ' + (type || 'info');
    toast.innerHTML = '<i class="bi ' + (type === 'success' ? 'bi-check-circle' : type === 'warning' ? 'bi-exclamation-circle' : 'bi-info-circle') + '"></i><span>' + escapeHtml(text) + '</span>';
    pageEl.appendChild(toast);
    window.setTimeout(function () { if (toast.parentNode) toast.remove(); }, 1800);
  }

  function findRow(id) {
    return rows.find(function (row) { return row.id === id; });
  }

  function defaultFields(row) {
    var fieldSets = {
      customer_contact: [
        ['customer_id', '客户编码', '是', 'varchar', '32', '0', '客户唯一编码'],
        ['contact_type', '联系方式类型', '否', 'varchar', '20', '0', '手机、邮箱或固定电话'],
        ['contact_value', '联系方式', '否', 'varchar', '100', '0', '客户联系方式内容'],
        ['preferred_flag', '首选标识', '否', 'char', '1', '0', '是否为首选联系方式'],
        ['updated_at', '更新时间', '否', 'datetime', '19', '0', '记录最后更新时间']
      ],
      ticket_handle_record: [
        ['record_id', '处置记录编号', '是', 'varchar', '32', '0', '工单处置记录唯一编号'],
        ['ticket_no', '工单编号', '否', 'varchar', '32', '0', '关联客服工单编号'],
        ['handler_id', '处置人员编码', '否', 'varchar', '32', '0', '当前处置人员编码'],
        ['handle_action', '处置动作', '否', 'varchar', '50', '0', '受理、转派、处理或办结'],
        ['handle_result', '处置结果', '否', 'varchar', '500', '0', '本次处置结果说明'],
        ['handled_at', '处置时间', '否', 'datetime', '19', '0', '处置动作发生时间']
      ],
      device_alarm: [
        ['alarm_id', '告警编号', '是', 'varchar', '32', '0', '设备告警唯一编号'],
        ['device_code', '设备编码', '否', 'varchar', '40', '0', '告警设备编码'],
        ['alarm_level', '告警级别', '否', 'varchar', '10', '0', '高、中、低告警级别'],
        ['alarm_content', '告警内容', '否', 'varchar', '500', '0', '设备告警详细内容'],
        ['alarm_time', '告警时间', '否', 'datetime', '19', '0', '告警触发时间'],
        ['handle_status', '处置状态', '否', 'varchar', '20', '0', '告警当前处置状态']
      ],
      ods_sales_order: [
        ['order_no', '订单编号', '是', 'varchar', '32', '0', '销售订单唯一编号'],
        ['customer_code', '客户编码', '否', 'varchar', '32', '0', '下单客户编码'],
        ['order_amount', '订单金额', '否', 'decimal', '16', '2', '订单含税金额'],
        ['order_time', '下单时间', '否', 'datetime', '19', '0', '订单创建时间'],
        ['etl_time', '同步时间', '否', 'datetime', '19', '0', '贴源数据同步时间']
      ]
    };
    var source = fieldSets[row.enName] || [
      ['id', '主键编码', '是', 'varchar', '32', '0', '记录唯一标识'],
      ['name', '名称', '否', 'varchar', '100', '0', row.name + '名称'],
      ['updated_at', '更新时间', '否', 'datetime', '19', '0', '记录最后更新时间']
    ];
    return source.map(function (item) {
      return { name: item[0], alias: item[1], primary: item[2], type: item[3], length: item[4], precision: item[5], desc: item[6] };
    });
  }

  function makeEditorState(row) {
    var fields = (row.fields || defaultFields(row)).map(function (field) { return Object.assign({}, field); });
    return {
      rowId: row.id,
      activeTab: 'items',
      fields: fields,
      preview: defaultPreview(row, fields),
      meta: {
        code: row.code,
        name: row.name,
        enName: row.enName,
        summary: row.desc,
        version: row.version,
        category: row.category ? row.category.split(',')[0] : '我的目录/客户服务',
        domain: row.source.indexOf('供应链') > -1 ? '供应链域' : row.source.indexOf('物联网') > -1 ? '设备域' : row.source.indexOf('客服') > -1 ? '客户服务域' : '经营分析域',
        listedAt: row.publish === '已上架' ? row.updatedAt : '',
        updatedAt: row.updatedAt,
        quality: row.publish === '已上架' ? '96' : '--',
        amount: row.publish === '已上架' ? '128,650' : '0',
        views: row.publish === '已上架' ? '236' : '0',
        managementUnit: row.source.indexOf('客服') > -1 ? '客户服务中心' : '数据运营中心',
        dataSource: row.source,
        phone: '010-55586620',
        frequency: '每日',
        applications: row.publish === '已上架' ? '18' : '0'
      },
      categoryOpen: false
    };
  }

  function defaultPreview(row, fields) {
    var actions = ['受理', '转派', '处理中', '补充材料', '办结'];
    var results = ['已核验客户诉求并完成登记', '已转派至责任部门处理', '已联系客户确认处理方案', '已补充业务凭证和处理说明', '问题已解决并完成回访'];
    var alarmContents = ['冷链温度超过安全阈值', '设备采集信号中断', '运行电压出现异常波动', '网关心跳连续丢失', '设备离线时间超过阈值'];
    var customerNames = ['华辰商贸', '启航科技', '盛达供应链', '远景制造', '新源零售', '嘉禾食品', '博远物流', '恒瑞设备', '云海服务', '泰和实业'];
    function pad(value, size) { return String(value).padStart(size || 2, '0'); }
    function valueFor(field, index) {
      var number = index + 1;
      var day = pad(11 + index);
      var time = '2026-09-' + day + ' ' + pad(8 + (index % 9)) + ':' + pad(12 + index) + ':' + pad(18 + index);
      var values = {
        customer_id: 'CUS202609' + pad(number, 4),
        contact_type: index % 3 === 0 ? '邮箱' : '手机',
        contact_value: index % 3 === 0 ? 'contact' + number + '@example.com' : '13' + (6 + index % 3) + '****' + pad(2860 + index, 4),
        preferred_flag: index % 3 === 0 ? '0' : '1',
        record_id: 'HDR202609' + pad(number, 4),
        ticket_no: 'WO202609' + pad(2100 + number, 6),
        handler_id: 'EMP' + pad(320 + index, 5),
        handle_action: actions[index % actions.length],
        handle_result: results[index % results.length],
        handled_at: time,
        alarm_id: 'ALM202609' + pad(number, 5),
        device_code: 'DEV-' + pad(100280 + index, 6),
        alarm_level: ['高', '中', '低'][index % 3],
        alarm_content: alarmContents[index % alarmContents.length],
        alarm_time: time,
        handle_status: ['待处理', '处理中', '已处置'][index % 3],
        order_no: 'SO202609' + pad(1800 + number, 6),
        customer_code: 'CUS' + pad(10280 + index, 6),
        order_amount: (12860.5 + index * 2367.35).toFixed(2),
        order_time: time,
        etl_time: '2026-09-' + day + ' 23:30:00',
        id: row.enName.toUpperCase().slice(0, 4) + '-' + pad(number, 5),
        name: customerNames[index],
        updated_at: time
      };
      if (Object.prototype.hasOwnProperty.call(values, field.name)) return values[field.name];
      if (field.type === 'decimal') return (8600 + index * 725.6).toFixed(Number(field.precision) || 2);
      if (field.type === 'bigint' || field.type === 'int' || field.type === 'tinyint') return String(100 + index * 17);
      if (field.type === 'datetime' || field.type === 'timestamp') return time;
      return field.alias + number;
    }
    return Array.from({ length: 10 }, function (_, index) {
      return fields.map(function (field) { return valueFor(field, index); });
    });
  }

  function dataItemsHtml() {
    return '<div class="svc-table-wrap svc-tr-editor-table-wrap"><table class="ds-table svc-tr-field-table"><thead><tr><th>英文名称</th><th>别名</th><th>是否主键</th><th>数据类型</th><th>长度</th><th>精度</th><th>描述</th></tr></thead><tbody>' + editorState.fields.map(function (field, index) {
      return '<tr><td>' + escapeHtml(field.name) + '</td><td><input data-tr-field="alias" data-index="' + index + '" value="' + escapeHtml(field.alias) + '"></td><td>' + escapeHtml(field.primary) + '</td><td>' + escapeHtml(field.type) + '</td><td>' + escapeHtml(field.length) + '</td><td>' + escapeHtml(field.precision) + '</td><td><input data-tr-field="desc" data-index="' + index + '" value="' + escapeHtml(field.desc) + '"></td></tr>';
    }).join('') + '</tbody></table></div>';
  }

  function dataPreviewHtml() {
    return '<div class="svc-tr-preview"><div class="svc-tr-preview-note"><i class="bi bi-table"></i><span>示例预览数据，共 10 条</span></div><div class="svc-tr-preview-table-wrap"><table class="ds-table svc-tr-preview-table"><thead><tr>' + editorState.fields.map(function (field) {
      return '<th title="' + escapeHtml(field.alias) + '">' + escapeHtml(field.name) + '</th>';
    }).join('') + '</tr></thead><tbody>' + editorState.preview.map(function (record) {
      return '<tr>' + record.map(function (value) { return '<td title="' + escapeHtml(value) + '">' + escapeHtml(value) + '</td>'; }).join('') + '</tr>';
    }).join('') + '</tbody></table></div></div>';
  }

  function categoryTreeHtml() {
    var categories = [
      { name: '我的目录', children: [
        { name: '经营分析' }, { name: '客户服务' }, { name: '供应链数据' }, { name: '物联感知' }
      ] }
    ];
    function render(nodes, parent, level) {
      return nodes.map(function (node) {
        var path = parent ? parent + '/' + node.name : node.name;
        var hasChildren = !!(node.children && node.children.length);
        return '<div class="svc-tr-category-node' + (hasChildren ? ' open' : '') + '" data-tr-category-node data-name="' + escapeHtml(node.name.toLowerCase()) + '" data-path="' + escapeHtml(path.toLowerCase()) + '">' +
          '<button type="button" data-tr-category-row data-path="' + escapeHtml(path) + '" data-has-children="' + hasChildren + '" style="padding-left:' + (8 + level * 18) + 'px">' +
            (hasChildren ? '<i class="bi bi-chevron-right"></i>' : '<span></span>') + '<i class="bi ' + (hasChildren ? 'bi-folder-fill' : 'bi-folder2') + '"></i><em>' + escapeHtml(node.name) + '</em></button>' +
          (hasChildren ? '<div class="svc-tr-category-children">' + render(node.children, path, level + 1) + '</div>' : '') +
        '</div>';
      }).join('');
    }
    return render(categories, '', 0);
  }

  function metadataHtml() {
    var meta = editorState.meta;
    function input(label, key, required, disabled) {
      return '<label class="svc-tr-meta-item"><span>' + (required ? '<em>*</em>' : '') + label + '</span><input data-tr-meta="' + key + '" value="' + escapeHtml(meta[key]) + '"' + (disabled ? ' disabled' : '') + '></label>';
    }
    return '<div class="svc-tr-meta-scroll"><div class="svc-tr-meta-form">' +
      input('数据编码', 'code', false, true) + input('数据名称', 'name', true, false) + input('英文名称', 'enName', false, true) +
      '<label class="svc-tr-meta-item wide"><span>数据摘要</span><textarea data-tr-meta="summary">' + escapeHtml(meta.summary) + '</textarea></label>' +
      input('版本', 'version', false, true) +
      '<label class="svc-tr-meta-item"><span><em>*</em>数据分类</span><div class="svc-tr-category-picker"><button type="button" data-tr-category-toggle><span>' + escapeHtml(meta.category) + '</span><i class="bi bi-chevron-down"></i></button>' +
        '<div class="svc-tr-category-popup"' + (editorState.categoryOpen ? '' : ' hidden') + '><div class="svc-catalog-search"><i class="bi bi-search"></i><input data-tr-category-search placeholder="请输入"></div><div class="svc-tr-category-tree">' + categoryTreeHtml() + '<div class="svc-tree-empty" data-tr-category-empty hidden>未找到匹配目录</div></div></div></div></label>' +
      '<label class="svc-tr-meta-item"><span><em>*</em>数据领域</span><select data-tr-meta="domain"><option>经营分析域</option><option>客户服务域</option><option>供应链域</option><option>设备域</option></select></label>' +
      input('上架时间', 'listedAt', false, true) + input('更新时间', 'updatedAt', false, true) + input('质量评分', 'quality', false, true) + input('数据量', 'amount', false, true) + input('浏览量', 'views', false, true) +
      input('管理单位', 'managementUnit', false, false) + input('数据来源', 'dataSource', false, true) + input('联系电话', 'phone', false, false) +
      '<label class="svc-tr-meta-item"><span>更新频率</span><select data-tr-meta="frequency"><option>实时</option><option>每小时</option><option>每日</option><option>每周</option><option>每月</option></select></label>' +
      input('申请量', 'applications', false, true) +
    '</div></div>';
  }

  function renderEditor() {
    var content = editorState.activeTab === 'items' ? dataItemsHtml() : editorState.activeTab === 'preview' ? dataPreviewHtml() : metadataHtml();
    pageEl.innerHTML = '<section class="svc-editor-page svc-tr-editor"><div class="svc-editor-header"><div class="svc-editor-tabs"><button type="button" data-tr-editor-tab="items" class="' + (editorState.activeTab === 'items' ? 'active' : '') + '">数据项</button><button type="button" data-tr-editor-tab="preview" class="' + (editorState.activeTab === 'preview' ? 'active' : '') + '">数据预览</button><button type="button" data-tr-editor-tab="metadata" class="' + (editorState.activeTab === 'metadata' ? 'active' : '') + '">元数据信息</button></div><div class="svc-editor-head-actions"><button class="btn btn-outline" type="button" data-tr-editor-cancel><i class="bi bi-x"></i><span>取消</span></button><button class="btn btn-primary" type="button" data-tr-editor-save><i class="bi bi-check2"></i><span>保存</span></button></div></div><div class="svc-tr-editor-content">' + content + '</div></section>';
    bindEditor();
  }

  function bindEditor() {
    pageEl.querySelectorAll('[data-tr-editor-tab]').forEach(function (button) {
      button.addEventListener('click', function () { editorState.activeTab = button.dataset.trEditorTab; editorState.categoryOpen = false; renderEditor(); });
    });
    pageEl.querySelector('[data-tr-editor-cancel]').addEventListener('click', renderPage);
    pageEl.querySelector('[data-tr-editor-save]').addEventListener('click', function () {
      if (!editorState.meta.name.trim() || !editorState.meta.category || !editorState.meta.domain) { showToast('请完善必填信息', 'warning'); return; }
      var row = findRow(editorState.rowId);
      row.name = editorState.meta.name.trim();
      row.desc = editorState.meta.summary.trim();
      row.category = editorState.meta.category;
      row.updatedAt = '2026-09-21 16:35:00';
      row.fields = editorState.fields.map(function (field) { return Object.assign({}, field); });
      renderPage();
      showToast('库表资源信息已保存', 'success');
    });
    pageEl.querySelectorAll('[data-tr-field]').forEach(function (input) {
      input.addEventListener('input', function () { editorState.fields[Number(input.dataset.index)][input.dataset.trField] = input.value; });
    });
    pageEl.querySelectorAll('[data-tr-meta]').forEach(function (control) {
      control.value = editorState.meta[control.dataset.trMeta];
      control.addEventListener('input', function () { editorState.meta[control.dataset.trMeta] = control.value; });
      control.addEventListener('change', function () { editorState.meta[control.dataset.trMeta] = control.value; });
    });
    var toggle = pageEl.querySelector('[data-tr-category-toggle]');
    if (!toggle) return;
    toggle.addEventListener('click', function () { editorState.categoryOpen = !editorState.categoryOpen; renderEditor(); });
    pageEl.querySelectorAll('[data-tr-category-row]').forEach(function (button) {
      button.addEventListener('click', function () {
        var node = button.closest('[data-tr-category-node]');
        if (button.dataset.hasChildren === 'true') node.classList.toggle('open');
        else { editorState.meta.category = button.dataset.path; editorState.categoryOpen = false; renderEditor(); }
      });
    });
    var search = pageEl.querySelector('[data-tr-category-search]');
    if (search) search.addEventListener('input', function () {
      var keyword = search.value.trim().toLowerCase();
      var visible = 0;
      pageEl.querySelectorAll('[data-tr-category-node]').forEach(function (node) {
        var ownMatch = !keyword || node.dataset.name.indexOf(keyword) > -1;
        var childMatch = Array.prototype.some.call(node.querySelectorAll('.svc-tr-category-node'), function (child) { return !keyword || child.dataset.name.indexOf(keyword) > -1; });
        node.hidden = !(ownMatch || childMatch);
        if (keyword && childMatch) node.classList.add('open');
        if (!node.hidden) visible += 1;
      });
      pageEl.querySelector('[data-tr-category-empty]').hidden = visible > 0;
    });
  }

  function renderPage() {
    editorState = null;
    pageEl.classList.toggle('zebra-table', zebraEnabled);
    pageEl.classList.toggle('compact-table', compactEnabled);
    pageEl.innerHTML = navigationHtml() + listHtml();
    bindNavigation();
    bindList();
    renderTable();
  }

  function bindNavigation() {
    pageEl.querySelectorAll('[data-tr-nav]').forEach(function (button) {
      button.addEventListener('click', function () {
        navMode = button.dataset.trNav;
        selectedNode = navMode === 'source' ? '业务系统' : '我的目录';
        renderPage();
      });
    });
    pageEl.querySelectorAll('[data-tr-node]').forEach(function (button) {
      button.addEventListener('click', function () {
        var treeNode = button.closest('[data-tr-tree-node]');
        if (button.classList.contains('has-children')) {
          button.classList.toggle('open');
          treeNode.classList.toggle('open');
        }
        pageEl.querySelectorAll('[data-tr-node].active').forEach(function (item) { item.classList.remove('active'); });
        button.classList.add('active');
        selectedNode = button.dataset.trNode;
        renderTable();
      });
    });
    var search = pageEl.querySelector('[data-tr-tree-search]');
    search.addEventListener('input', function () {
      var keyword = search.value.trim().toLowerCase();
      var visibleCount = 0;
      pageEl.querySelectorAll('[data-tr-tree-node]').forEach(function (node) {
        var matched = !keyword || node.dataset.name.indexOf(keyword) > -1 || node.dataset.path.indexOf(keyword) > -1;
        var childMatched = Array.prototype.some.call(node.querySelectorAll(':scope > .svc-tr-tree-children [data-tr-tree-node]'), function (child) { return !keyword || child.dataset.name.indexOf(keyword) > -1; });
        node.hidden = !(matched || childMatched);
        if (keyword && childMatched) node.classList.add('open');
        if (!node.hidden) visibleCount += 1;
      });
      pageEl.querySelector('[data-tr-tree-empty]').hidden = visibleCount > 0;
    });
  }

  function bindList() {
    var manage = pageEl.querySelector('[data-tr-manage]');
    if (manage) manage.addEventListener('click', showSourceManager);
    pageEl.querySelector('[data-tr-query]').addEventListener('click', renderTable);
    pageEl.querySelector('[data-tr-filter="keyword"]').addEventListener('keydown', function (event) { if (event.key === 'Enter') renderTable(); });
    pageEl.querySelectorAll('[data-tr-filter="publish"], [data-tr-filter="audit"]').forEach(function (select) { select.addEventListener('change', renderTable); });
    pageEl.querySelector('#tableResourceTbody').addEventListener('click', function (event) {
      var button = event.target.closest('[data-tr-edit]');
      if (!button) return;
      var row = findRow(button.dataset.trEdit);
      if (!row) return;
      editorState = makeEditorState(row);
      renderEditor();
    });
    pageEl.querySelector('[data-tr-zebra]').addEventListener('change', function (event) {
      zebraEnabled = event.target.checked;
      pageEl.classList.toggle('zebra-table', zebraEnabled);
      pageEl.querySelector('.svc-switch-text').textContent = zebraEnabled ? '开' : '关';
    });
    pageEl.querySelectorAll('[data-tr-tool]').forEach(function (button) {
      button.addEventListener('click', function () {
        var action = button.dataset.trTool;
        if (action === 'refresh') { renderTable(); showToast('列表已刷新', 'success'); }
        else if (action === 'density') { compactEnabled = !compactEnabled; pageEl.classList.toggle('compact-table', compactEnabled); showToast(compactEnabled ? '已切换为紧凑行高' : '已恢复默认行高', 'info'); }
        else if (action === 'columns') toggleColumnPanel(button);
        else if (action === 'fullscreen') { pageEl.classList.toggle('svc-page-fullscreen'); showToast(pageEl.classList.contains('svc-page-fullscreen') ? '已进入全屏' : '已退出全屏', 'info'); }
      });
    });
  }

  function toggleColumnPanel(anchor) {
    var old = pageEl.querySelector('.svc-tr-column-panel');
    if (old) { old.remove(); return; }
    var panel = document.createElement('div');
    panel.className = 'svc-set-column-panel svc-tr-column-panel';
    panel.innerHTML = '<strong>列设置</strong><label><input type="checkbox" checked disabled> 数据编码</label><label><input type="checkbox" checked> 分类</label><label><input type="checkbox" checked> 审核状态</label><label><input type="checkbox" checked> 描述</label>';
    anchor.parentNode.appendChild(panel);
  }

  function managerTreeHtml(nodes, side, parentPath, level) {
    return nodes.map(function (node) {
      var hasChildren = !!(node.children && node.children.length);
      var path = parentPath ? parentPath + '/' + node.name : node.name;
      var childrenHtml = hasChildren ? managerTreeHtml(node.children, side, path, level + 1) : '';
      if (side === 'right' && !hasChildren && managedSourceNames.indexOf(node.name) < 0) return '';
      if (side === 'right' && hasChildren && !childrenHtml) return '';
      return '<div class="svc-tr-manager-node' + (side === 'right' ? ' open' : '') + '" data-tr-manager-node data-name="' + escapeHtml(node.name.toLowerCase()) + '" data-path="' + escapeHtml(path.toLowerCase()) + '">' +
        (hasChildren
          ? '<button class="svc-tr-manager-row folder" type="button" data-tr-manager-toggle style="padding-left:' + (8 + level * 18) + 'px"><i class="bi bi-chevron-right"></i><i class="bi bi-stack"></i><span>' + escapeHtml(node.name) + '</span></button>'
          : '<label class="svc-tr-manager-row leaf" style="padding-left:' + (8 + level * 18) + 'px"><span class="svc-tr-manager-spacer"></span><input type="checkbox" data-tr-transfer-check="' + side + '" value="' + escapeHtml(node.name) + '"><i class="bi bi-database"></i><span>' + escapeHtml(node.name) + (node.count != null ? ' (' + node.count + ')' : '') + '</span></label>') +
        (hasChildren ? '<div class="svc-tr-manager-children">' + childrenHtml + '</div>' : '') +
      '</div>';
    }).join('');
  }

  function showSourceManager() {
    var mask = document.createElement('div');
    mask.className = 'svc-modal-mask';
    mask.innerHTML = '<div class="svc-modal svc-tr-source-modal"><div class="svc-modal-head"><h3>数据源管理</h3><button class="svc-modal-close" type="button" data-tr-modal-close><i class="bi bi-x-lg"></i></button></div><div class="svc-modal-body svc-tr-transfer">' +
      '<section><h4>待选择</h4><div class="svc-catalog-search"><i class="bi bi-search"></i><input data-tr-transfer-search="left" placeholder="请输入"></div><div class="svc-tr-transfer-tree" data-tr-transfer-tree="left"></div></section>' +
      '<div class="svc-tr-transfer-actions"><button type="button" data-tr-move="right" title="移入已选择"><i class="bi bi-chevron-right"></i></button><button type="button" data-tr-move="left" title="移回待选择"><i class="bi bi-chevron-left"></i></button></div>' +
      '<section><h4>已选择</h4><div class="svc-catalog-search"><i class="bi bi-search"></i><input data-tr-transfer-search="right" placeholder="请输入"></div><div class="svc-tr-transfer-tree" data-tr-transfer-tree="right"></div></section>' +
    '</div><div class="svc-modal-footer"><button class="btn btn-outline" type="button" data-tr-modal-close><i class="bi bi-x"></i><span>取消</span></button><button class="btn btn-primary" type="button" data-tr-modal-save><i class="bi bi-check2"></i><span>确定</span></button></div></div>';
    pageEl.appendChild(mask);
    renderManagerTrees(mask);
    bindSourceManager(mask);
  }

  function filterManagerTree(pane, keyword) {
    var visible = 0;
    pane.querySelectorAll('[data-tr-manager-node]').forEach(function (node) {
      var ownMatch = !keyword || node.dataset.name.indexOf(keyword) > -1;
      var childMatch = Array.prototype.some.call(node.querySelectorAll('.svc-tr-manager-node'), function (child) { return !keyword || child.dataset.name.indexOf(keyword) > -1; });
      node.hidden = !(ownMatch || childMatch);
      if (keyword && childMatch) node.classList.add('open');
      if (!node.hidden) visible += 1;
    });
    var empty = pane.querySelector('[data-tr-transfer-empty]');
    if (empty) empty.hidden = visible > 0;
  }

  function renderManagerTrees(mask) {
    ['left', 'right'].forEach(function (side) {
      var pane = mask.querySelector('[data-tr-transfer-tree="' + side + '"]');
      pane.innerHTML = managerTreeHtml(managerSourceTree, side, '', 0) + '<div class="svc-tree-empty" data-tr-transfer-empty="' + side + '" hidden>未找到匹配数据源</div>';
      pane.querySelectorAll('[data-tr-manager-toggle]').forEach(function (button) {
        button.addEventListener('click', function () { button.closest('[data-tr-manager-node]').classList.toggle('open'); });
      });
      var input = mask.querySelector('[data-tr-transfer-search="' + side + '"]');
      filterManagerTree(pane, input.value.trim().toLowerCase());
    });
  }

  function bindSourceManager(mask) {
    function close() { mask.remove(); }
    mask.querySelectorAll('[data-tr-modal-close]').forEach(function (button) { button.addEventListener('click', close); });
    mask.addEventListener('click', function (event) { if (event.target === mask) close(); });
    mask.querySelectorAll('[data-tr-transfer-search]').forEach(function (input) {
      input.addEventListener('input', function () {
        var side = input.dataset.trTransferSearch;
        filterManagerTree(mask.querySelector('[data-tr-transfer-tree="' + side + '"]'), input.value.trim().toLowerCase());
      });
    });
    mask.querySelectorAll('[data-tr-move]').forEach(function (button) {
      button.addEventListener('click', function () {
        var direction = button.dataset.trMove;
        var from = direction === 'right' ? 'left' : 'right';
        var checked = mask.querySelectorAll('[data-tr-transfer-check="' + from + '"]:checked');
        if (!checked.length) { showToast('请选择数据源', 'warning'); return; }
        checked.forEach(function (input) {
          var index = managedSourceNames.indexOf(input.value);
          if (direction === 'right' && index < 0) managedSourceNames.push(input.value);
          if (direction === 'left' && index > -1) managedSourceNames.splice(index, 1);
        });
        renderManagerTrees(mask);
      });
    });
    mask.querySelector('[data-tr-modal-save]').addEventListener('click', function () { close(); showToast('数据源选择已保存', 'success'); });
  }

  return {
    html: '<div class="page-service-api-dev page-service-table-resource"></div>',
    init: function () {
      pageEl = document.querySelector('.page-service-table-resource');
      if (!pageEl) return;
      navMode = 'source';
      selectedNode = '业务系统';
      renderPage();
    }
  };
})();
