/** 运维监控 / 监控告警 / 监控事项：列表、表单与规则编辑。 */
window.DP = window.DP || {};
DP.pages = DP.pages || {};
DP.pages.monitorItems = (function () {
  'use strict';
  var storageKey = 'dp.monitor-items.v1';
  var sampleRevision = 3;
  var root, store, draft, readOnly = false, typeDraft = null, returnFocus = null;
  var selected = new Set(), filters = { type: '', keyword: '' }, page = 1, pageSize = 10, serial = 0;
  var messageRange = null;
  var levels = ['轻微', '重要', '严重', '紧急'];
  var timeUnits = [{ value: 'second', label: '秒钟' }, { value: 'minute', label: '分钟' }, { value: 'hour', label: '小时' }];
  var qualityTasks = [
    ['订单号唯一性稽查', 'dwd_order_detail_di', 'order_id', '订单号唯一性'],
    ['手机号码稽查', 'crm_member_base', 'mobile', '手机号码格式'],
    ['订单状态标准代码稽查', 'dim_order_status', 'status_code', '订单状态值域'],
    ['客户证件号格式稽查', 'crm_customer_identity', 'identity_no', '证件号格式'],
    ['工单关闭时间一致性稽查', 'ods_workorder_ticket', 'closed_at', '关闭时间一致性'],
    ['支付金额非负稽查', 'fin_payment_record', 'payment_amount', '金额非负'],
    ['结算金额精度稽查', 'fin_settlement_bill', 'settlement_amount', '金额精度'],
    ['运单签收时间及时性稽查', 'logistics_waybill', 'signed_at', '签收及时性'],
    ['省市区编码一致性稽查', 'logistics_address_area', 'area_code', '行政区划一致性'],
    ['ODS 主键入仓非空稽查', 'ods_order_main', 'order_id', '主键非空'],
    ['会员画像标签取值稽查', 'ads_member_profile_tag', 'member_tag', '标签值域'],
    ['库存快照数量非负稽查', 'dws_inventory_snapshot', 'stock_qty', '库存数量非负']
  ].map(function (row) { return { name: row[0], table: row[1], field: row[2], rule: row[3] }; });
  var qualityNodes = ['订单采集记录监控', '会员字段完整性监控', '支付金额校验', '库存数量校验', '物流时间校验', '商品编码校验'];
  var fields = [
    { key: 'task', label: '任务名称' },
    { key: 'project', label: '项目名称', values: ['交易数据治理', '会员数据治理', '供应链数据集成'] },
    { key: 'version', label: '版本' },
    { key: 'environment', label: '环境', values: ['开发环境', '测试环境', '生产环境'], initial: '开发环境' },
    { key: 'flow', label: '流程名称' },
    { key: 'result', label: '执行结果', values: ['成功', '失败', '异常'] },
    { key: 'duration', label: '任务运行时长', numeric: true, timeUnit: true },
    { key: 'readRecords', label: '读取记录数', numeric: true, integer: true, unitLabel: '记录数' },
    { key: 'writeRecords', label: '写入记录数', numeric: true, integer: true, unitLabel: '记录数' },
    { key: 'startTime', label: '任务开始时间', periodic: true },
    { key: 'endTime', label: '任务结束时间', periodic: true },
    { key: 'apiName', label: '接口名称', values: ['订单查询服务', '订单明细查询', '支付流水查询', '会员信息查询', '会员等级查询', '商品信息查询', '库存快照查询', '物流轨迹查询', '退款记录查询', '门店信息查询', '供应商信息查询', '工单状态查询'] },
    { key: 'apiResponse', label: '接口响应时间', numeric: true, unitLabel: '秒' },
    { key: 'apiStatus', label: '接口调用状态', values: ['成功', '失败'] },
    { key: 'apiConcurrency', label: '接口并发数', numeric: true, integer: true, unitLabel: '记录数' },
    { key: 'planStatus', label: '计划监控状态', values: ['正常(计划状态与运行状态一致)', '异常(计划状态与运行状态不一致)'], initial: '正常(计划状态与运行状态一致)' },
    { key: 'scheduleTimeout', label: '调度超时时间', numeric: true, threshold: true, timeUnit: true },
    { key: 'averageDeviation', label: '平均执行时间偏差', numeric: true, threshold: true, timeUnit: true },
    { key: 'flowType', label: '流程类型', values: ['业务流程', '流式数据采集流程', '流式处理流程', '数据采集', '数据同步(flink-cdc)'] },
    { key: 'database', label: '数据库', database: true },
    { key: 'table', label: '表', table: true },
    { key: 'tableChanged', label: '表结构变更', values: ['是', '否'] },
    { key: 'downloadRows', label: '大数据量下载', numeric: true, integer: true, download: true },
    { key: 'accessWindow', label: '非常规时间访问', accessWindow: true },
    { key: 'qualityTask', label: '质量任务名称', multiple: true, values: qualityTasks.map(function (task) { return task.name; }) },
    { key: 'qualityScore', label: '质量任务评分', messageLabel: '符合质量规则比例', numeric: true, percentage: true, unitLabel: '%' },
    { key: 'qualityStatus', label: '质量任务状态', values: ['成功', '失败'], equalOnly: true },
    { key: 'qualityNode', label: '质量节点名称', multiple: true, values: qualityNodes },
    { key: 'qualityResult', label: '质量节点结果', numeric: true }
  ];
  var messageVariables = ['监控项名称', '类型', '等级', '描述', '告警时间'].concat(fields.filter(function (f) { return !f.download && !f.accessWindow; }).map(function (f) { return f.messageLabel || f.label; }),
    ['用户账号', '用户姓名', '访问IP', '访问资源', '访问时间', '下载条数', '下载阈值', '常规访问时段', '质量稽查表', '质量稽查字段', '质量稽查规则']);
  var periods = [{ value: 'minute', label: '每分钟' }, { value: 'hour', label: '每小时' }, { value: 'day', label: '每天' }, { value: 'week', label: '每周' }, { value: 'month', label: '每月' }];
  var weekdays = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'].map(function (label, i) { return { value: String(i + 1), label: label }; });
  var monthDays = Array.from({ length: 31 }, function (_, i) { return { value: String(i + 1), label: (i + 1) + '号' }; });
  // 原型业务数据沿用数据源管理中的数仓分层和表命名，不接入真实系统的数据。
  var databaseTree = [
    { label: '业务系统', children: [{ id: 'biz-orders', label: '订单业务库', tables: ['order_main', 'order_detail', 'payment_record'] }, { id: 'biz-member', label: '会员业务库', tables: ['member_profile', 'member_level', 'member_address'] }] },
    { label: 'ODS-贴源层', children: [{ id: 'ods-orders', label: '订单采集库', tables: ['order_main', 'order_detail', 'payment_record', 'sys_user', 'product_info', 'inventory_snapshot', 'logistics_tracking', 'order_status_log', 'refund_record', 'coupon_usage', 'store_info', 'supplier_info'] }, { id: 'ods-service', label: '工单采集库', tables: ['service_ticket', 'ticket_process'] }] },
    { label: 'DWD-数据明细层', children: [{ id: 'dwd-trade', label: '交易明细库', tables: ['dwd_order_detail', 'dwd_payment_detail', 'dwd_refund_detail'] }] },
    { label: 'DWS-数据汇总层', children: [{ id: 'dws-trade', label: '交易汇总库', tables: ['dws_trade_daily', 'dws_member_trade'] }] },
    { label: 'ADS-应用层', children: [{ id: 'ads-operation', label: '运营分析库', tables: ['ads_order_overview', 'ads_product_sales'] }, { id: 'ads-new', label: '新建应用库', tables: [] }] }
  ];
  var previewValues = { '项目名称': '交易数据治理', '任务名称': '订单增量采集', '流程名称': '订单明细入仓', '环境': '生产环境', '版本': 'V1.2', '执行结果': '失败', '任务运行时长': '180', '读取记录数': '12800', '写入记录数': '12680', '任务开始时间': '2026-09-04 09:00:00', '任务结束时间': '2026-09-04 09:03:00', '接口名称': '订单查询服务', '接口响应时间': '260', '接口调用状态': '成功', '接口并发数': '12', '计划监控状态': '正常(计划状态与运行状态一致)', '调度超时时间': '60', '平均执行时间偏差': '15', '流程类型': '数据采集', '数据库': 'ODS-贴源层 / 订单采集库', '表': 'order_main', '表结构变更': '是', '告警时间': '2026-09-04 09:03:00' };
  function esc(value) { return String(value == null ? '' : value).replace(/[&<>"']/g, function (s) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[s]; }); }
  function clone(value) { return JSON.parse(JSON.stringify(value)); }
  function uid(prefix) { serial += 1; return prefix + Date.now().toString(36) + '-' + serial; }
  function condition(field, operator, value) { return { id: uid('r'), kind: 'condition', field: field || '', operator: operator || 'eq', value: value == null ? '' : String(value), values: [], unit: ruleField(field) && ruleField(field).timeUnit ? 'minute' : '', valueEnd: '', period: 'minute', offset: '0', day: '', time: '', databaseId: '', accessStart: '', accessEnd: '' }; }
  function group(logic, children) { return { id: uid('g'), kind: 'group', logic: logic || 'and', children: children || [condition()] }; }
  function blankItem() {
    return { id: '', name: '', type: '', level: '', description: '', rules: group('and'), title: '', intro: '', message: '' };
  }
  function seedStore() {
    var sample = blankItem();
    Object.assign(sample, { id: 'MI001', name: '订单采集异常告警', type: 'system', level: '严重', description: '监控订单增量采集失败或异常超时，保障交易数据及时入仓。', operator: '数据运维员', updatedAt: '2026-09-04 09:03:00',
      message: '项目流程：【项目名称】-【任务名称】-【流程名称】，在【环境】，版本号：【版本】，执行结果：【执行结果】，请及时处理。',
      rules: group('or', [condition('result', 'eq', '失败'), group('and', [condition('result', 'eq', '异常'), condition('duration', 'gt', '3')])]) });
    var examples = [
      { id: 'MI002', name: '会员数据采集失败', level: '严重', description: '会员基础信息采集执行失败时告警，保障会员主数据及时更新。',
        conditions: [condition('project', 'eq', '会员数据治理'), condition('task', 'eq', '会员基础信息采集'), condition('result', 'eq', '失败')],
        message: '【项目名称】项目的【任务名称】执行结果为【执行结果】，请检查采集日志和源库连接。' },
      { id: 'MI003', name: '订单明细入仓超时', level: '重要', description: '订单明细入仓流程运行时长超过10分钟时告警。',
        conditions: [condition('project', 'eq', '交易数据治理'), condition('flow', 'eq', '订单明细入仓'), condition('duration', 'gt', '10')],
        message: '【项目名称】项目的【流程名称】运行时长为【任务运行时长】，已超过配置阈值，请检查执行进度。' },
      { id: 'MI004', name: '订单查询接口调用失败', type: 'interface', level: '紧急', description: '订单查询服务调用失败时立即告警，保障订单数据服务可用。',
        conditions: [condition('apiName', 'eq', '订单查询服务'), condition('apiStatus', 'eq', '失败')],
        message: '接口【接口名称】调用状态为【接口调用状态】，请立即检查服务运行状态。' },
      { id: 'MI005', name: '库存快照采集无写入', level: '严重', description: '库存快照采集执行成功但写入记录数为0时告警。',
        conditions: [condition('project', 'eq', '供应链数据集成'), condition('task', 'eq', '库存快照采集'), condition('result', 'eq', '成功'), condition('writeRecords', 'eq', '0')],
        message: '【任务名称】执行结果为【执行结果】，写入记录数为【写入记录数】，请核对源数据和采集范围。' },
      { id: 'MI006', name: '会员信息接口响应缓慢', type: 'interface', level: '重要', description: '会员信息查询接口响应时间超过0.8秒时告警。',
        conditions: [condition('apiName', 'eq', '会员信息查询'), condition('apiResponse', 'gt', '0.8')],
        message: '接口【接口名称】响应时间为【接口响应时间】，已超过配置阈值，请检查查询性能。' },
      { id: 'MI007', name: '交易汇总计划状态异常', level: '紧急', description: '交易日汇总流程的计划状态与实际运行状态不一致时告警。',
        conditions: [condition('project', 'eq', '交易数据治理'), condition('flow', 'eq', '交易日汇总'), condition('planStatus', 'eq', '异常(计划状态与运行状态不一致)')],
        message: '【流程名称】的计划监控状态为【计划监控状态】，请检查调度计划及运行实例。' },
      { id: 'MI008', name: '商品信息接口并发偏高', type: 'interface', level: '轻微', description: '商品信息查询接口并发数超过50时提示关注。',
        conditions: [condition('apiName', 'eq', '商品信息查询'), condition('apiConcurrency', 'gt', '50')],
        message: '接口【接口名称】并发数为【接口并发数】，已超过配置阈值，请关注服务负载。' },
      { id: 'MI009', name: '订单主表结构变更', level: '严重', description: '订单采集库的order_main表结构发生变更时告警。',
        conditions: [condition('database', 'eq', 'ods-orders'), Object.assign(condition('table', 'eq', 'order_main'), { databaseId: 'ods-orders' }), condition('tableChanged', 'eq', '是')],
        message: '数据库【数据库】中的表【表】检测到结构变更，请核对采集映射和下游依赖。' },
      { id: 'MI010', name: '物流数据采集调度超时', level: '重要', description: '物流轨迹采集的调度超时时间不小于2分钟时告警。',
        conditions: [condition('project', 'eq', '供应链数据集成'), condition('task', 'eq', '物流轨迹采集'), condition('scheduleTimeout', 'gte', '2')],
        message: '【任务名称】调度超时时间为【调度超时时间】，已达到配置阈值，请检查调度资源。' },
      { id: 'MI011', name: '订单采集读取量偏低', level: '轻微', description: '订单增量采集成功但读取记录数低于5000时提示关注。',
        conditions: [condition('task', 'eq', '订单增量采集'), condition('result', 'eq', '成功'), condition('readRecords', 'lt', '5000')],
        message: '【任务名称】本次读取记录数为【读取记录数】，低于配置阈值，请核对增量时间范围。' },
      { id: 'MI012', name: '支付流水接口调用失败', type: 'interface', level: '严重', description: '支付流水查询接口调用失败时告警，保障支付对账数据查询。',
        conditions: [condition('apiName', 'eq', '支付流水查询'), condition('apiStatus', 'eq', '失败')],
        message: '接口【接口名称】调用状态为【接口调用状态】，请检查服务连接和查询日志。' },
      { id: 'MI013', name: '库存查询响应时间区间监控', type: 'interface', level: '重要', description: '库存快照查询接口响应时间处于0.5至1秒区间时告警。',
        conditions: [condition('apiName', 'eq', '库存快照查询'), Object.assign(condition('apiResponse', 'range', '0.5'), { valueEnd: '1' })],
        message: '接口【接口名称】响应时间为【接口响应时间】，已进入配置的监控区间，请关注查询性能。' },
      { id: 'MI014', name: '交易日汇总完成时间偏晚', level: '重要', description: '交易日汇总流程每天结束时间晚于07:30:00时告警。',
        conditions: [condition('project', 'eq', '交易数据治理'), condition('flow', 'eq', '交易日汇总'), Object.assign(condition('endTime', 'gt'), { period: 'day', time: '07:30:00' })],
        message: '【流程名称】结束时间为【任务结束时间】，晚于配置时间，请检查上游任务完成情况。' },
      { id: 'MI015', name: '会员画像任务耗时偏差', level: '轻微', description: '会员画像刷新任务的平均执行时间偏差超过1分钟时提示关注。',
        conditions: [condition('project', 'eq', '会员数据治理'), condition('task', 'eq', '会员画像刷新'), condition('averageDeviation', 'gt', '1')],
        message: '【任务名称】的平均执行时间偏差为【平均执行时间偏差】，已超过配置阈值，请关注数据量变化。' },
      { id: 'MI016', name: '工单状态接口调用失败', type: 'interface', level: '严重', description: '工单状态查询接口调用失败时告警，保障工单处理进度查询。',
        conditions: [condition('apiName', 'eq', '工单状态查询'), condition('apiStatus', 'eq', '失败')],
        message: '接口【接口名称】调用状态为【接口调用状态】，请检查服务运行情况。' },
      { id: 'MI017', sampleRevision: 2, name: '交易明细大数据量下载', level: '严重', description: '单次下载数据量大于100000条时告警，关注交易明细数据下载行为。',
        conditions: [condition('downloadRows', 'gt', '100000')],
        message: '用户【用户姓名】（【用户账号】）于【访问时间】从【访问IP】下载【访问资源】，本次下载【下载条数】条，超过配置阈值【下载阈值】条，请核实下载用途。' },
      { id: 'MI018', sampleRevision: 2, name: '数据资产非常规时间访问', level: '重要', description: '每天08:00:00至18:00:00为常规访问时段（北京时间），时段外访问时告警。',
        conditions: [Object.assign(condition('accessWindow', 'outside'), { accessStart: '08:00:00', accessEnd: '18:00:00' })],
        message: '用户【用户姓名】（【用户账号】）于【访问时间】从【访问IP】访问【访问资源】，不在常规访问时段【常规访问时段】内，请核实访问行为。' },
      { id: 'MI019', sampleRevision: 3, name: '订单质量稽查评分偏低', level: '严重', description: '订单号唯一性稽查执行成功，但符合质量规则比例低于80%时告警。',
        conditions: [Object.assign(condition('qualityTask', 'eq'), { values: ['订单号唯一性稽查'] }), condition('qualityStatus', 'eq', '成功'), condition('qualityScore', 'lt', '80')],
        message: '【等级】，【质量任务名称】的质量稽查报告结果为【符合质量规则比例】，小于80%，请及时处理。告警时间：【告警时间】；稽查内容：【质量稽查表】的【质量稽查字段】字段，稽查规则：【质量稽查规则】。' },
      { id: 'MI020', sampleRevision: 3, name: '订单流程质量节点结果偏低', level: '重要', description: '订单采集记录监控节点结果小于100时告警。',
        conditions: [condition('project', 'eq', '交易数据治理'), Object.assign(condition('qualityNode', 'eq'), { values: ['订单采集记录监控'] }), condition('qualityResult', 'lt', '100')],
        message: '【等级】，【项目名称】项目在【环境】的【任务名称】【版本】，质量节点【质量节点名称】的结果为【质量节点结果】，小于100，请及时处理。告警时间：【告警时间】。' }
    ].map(function (item, index) {
      return Object.assign(blankItem(), { id: item.id, sampleRevision: item.sampleRevision || 1, name: item.name, type: item.type || 'system', level: item.level, description: item.description,
        rules: group('and', item.conditions), title: item.name, intro: '请数据运维人员关注以下监控事项。', message: item.message,
        operator: ['数据运维员', '平台管理员', '数据开发员'][index % 3], updatedAt: '2026-09-07 ' + String(10 - Math.floor(index / 6)).padStart(2, '0') + ':' + String(55 - index % 6 * 8).padStart(2, '0') + ':00' });
    });
    return { version: 3, sampleRevision: sampleRevision, types: [{ id: 'system', name: '系统默认' }, { id: 'interface', name: '接口监控' }], items: [sample].concat(examples) };
  }
  function normalizeRule(node) {
    if (!node || typeof node !== 'object') return condition();
    node.id = node.id || uid('r');
    if (node.kind === 'group') {
      node.logic = node.logic === 'or' ? 'or' : 'and';
      node.children = Array.isArray(node.children) && node.children.length ? node.children.map(normalizeRule) : [condition()];
      return node;
    }
    node = Object.assign(condition(), node);
    node.value = node.value == null ? '' : String(node.value);
    if (node.field === 'environment' && ['开发', '测试', '生产'].includes(node.value)) node.value += '环境';
    // 旧版 ≥ / ≤ 转成等价子组，保留阈值的包含边界，不擅自改为 > / <。
    var field = ruleField(node.field);
    if (field && field.numeric && !field.threshold && !field.download && ['gte', 'lte'].includes(node.operator)) {
      return group('or', [Object.assign(clone(node), { id: uid('r'), operator: node.operator === 'gte' ? 'gt' : 'lt' }), Object.assign(clone(node), { id: uid('r'), operator: 'eq' })]);
    }
    return node;
  }
  function loadStore() {
    try {
      var saved = JSON.parse(window.localStorage.getItem(storageKey) || 'null');
      if (saved && [1, 2, 3].includes(saved.version) && Array.isArray(saved.items) && Array.isArray(saved.types)) {
        saved.types = saved.types.filter(function (t) { return t && t.id && typeof t.name === 'string'; });
        [{ id: 'system', name: '系统默认' }, { id: 'interface', name: '接口监控' }].forEach(function (type) { if (!saved.types.some(function (t) { return t.id === type.id; })) saved.types.push(type); });
        saved.items = saved.items.filter(function (item) { return item && item.id; }).map(function (item) {
          var normalized = Object.assign(blankItem(), item);
          normalized.rules = normalizeRule(item.rules);
          if (normalized.rules.kind !== 'group') normalized.rules = group('and', [normalized.rules]);
          delete normalized.recovery;
          delete normalized.templateId;
          return normalized;
        });
        saved.version = 3;
        // 为已使用过原型的浏览器补充本批示例一次，保留已有编辑和删除结果。
        if (!(saved.sampleRevision >= sampleRevision)) {
          var previousRevision = Number(saved.sampleRevision) || 0;
          seedStore().items.slice(1).filter(function (example) { return example.sampleRevision > previousRevision; }).forEach(function (example) {
            if (!saved.items.some(function (item) { return item.id === example.id || item.name.trim().toLowerCase() === example.name.toLowerCase(); })) saved.items.push(example);
          });
          saved.sampleRevision = sampleRevision;
          try { window.localStorage.setItem(storageKey, JSON.stringify(saved)); } catch (error) { /* 存储不可用时保留当前会话数据。 */ }
        }
        return saved;
      }
    } catch (error) { /* 存储不可用时，当前会话仍可演示。 */ }
    return seedStore();
  }
  function persist() {
    try { window.localStorage.setItem(storageKey, JSON.stringify(store)); return true; } catch (error) { return false; }
  }
  function toast(message) {
    var old = document.querySelector('.mi-toast');
    if (old) old.remove();
    var el = document.createElement('div');
    el.className = 'mi-toast'; el.setAttribute('role', 'status');
    el.innerHTML = '<i class="bi bi-check-circle" aria-hidden="true"></i><span>' + esc(message) + '</span>';
    document.body.appendChild(el);
    window.setTimeout(function () { el.remove(); }, 2800);
  }
  function notifySaved(message) { toast(message + (persist() ? '' : '（当前浏览器无法持久保存，刷新后可能丢失）')); }
  function button(action, icon, label, attrs, cls) {
    return '<button type="button" class="' + (cls || 'btn btn-outline') + '" data-mi-action="' + action + '" ' + (attrs || '') + '>' + (icon ? '<i class="bi bi-' + icon + '" aria-hidden="true"></i>' : '') + '<span>' + label + '</span></button>';
  }
  // 下拉选项依靠高亮表达单选状态，不渲染操作按钮图标，避免被误解为多选。
  function selectOption(action, label, attrs, cls) {
    return '<button type="button" class="mi-select-option ' + (cls || 'mi-type-option') + '" data-mi-action="' + action + '" ' + (attrs || '') + '><span>' + label + '</span></button>';
  }
  function options(choices, value, placeholder) {
    return (placeholder ? '<option value="">' + placeholder + '</option>' : '') + choices.map(function (choice) {
      var val = typeof choice === 'string' ? choice : choice.value, label = typeof choice === 'string' ? choice : choice.label;
      return '<option value="' + esc(val) + '"' + (val === value ? ' selected' : '') + '>' + esc(label) + '</option>';
    }).join('');
  }
  function selectControl(label, choices, value, attrs, disabled, placeholder, forceSearch) {
    var rows = choices.map(function (c) { return typeof c === 'string' ? { value: c, label: c } : c; });
    value = String(value == null ? '' : value);
    var current = rows.find(function (c) { return c.value === value; });
    var missing = value && !current;
    var legacyLabel = ({ records: '处理记录数', contains: '包含', notContains: '不包含', gte: '大于等于', lte: '小于等于' })[value] || value;
    placeholder = placeholder || '请选择';
    if (rows.length <= 10 && !forceSearch) return '<select aria-label="' + esc(label) + '" ' + attrs + (disabled ? ' disabled' : '') + '>' + (missing ? '<option value="' + esc(value) + '" selected disabled>' + esc(legacyLabel) + '（历史值，请调整）</option>' : '') + options(rows, value, placeholder) + '</select>';
    if (disabled) return '<input aria-label="' + esc(label) + '" value="' + esc(current ? current.label : legacyLabel) + '" placeholder="' + placeholder + '" disabled>';
    return '<details class="mi-type-picker mi-select-picker" ' + attrs + '><summary aria-label="' + esc(label) + '"><span class="' + (value ? '' : 'mi-select-placeholder') + '">' + esc(current ? current.label : missing ? legacyLabel + '（历史值，请调整）' : placeholder) + '</span><i class="bi bi-chevron-down" aria-hidden="true"></i></summary><div class="mi-type-pop"><input type="search" data-option-search placeholder="搜索' + esc(label) + '" aria-label="搜索' + esc(label) + '"><div class="mi-type-options">' +
      rows.map(function (c) { return selectOption('choose-option', esc(c.label), attrs + ' data-value="' + esc(c.value) + '" data-option-name="' + esc(c.label.toLowerCase()) + '"', 'mi-type-option' + (value === c.value ? ' is-active' : '')); }).join('') + '<div class="mi-option-empty" hidden>无匹配数据</div></div></div></details>';
  }
  function multiControl(node, field) {
    var values = Array.isArray(node.values) ? node.values : [];
    if (readOnly) return '<input aria-label="' + esc(field.label) + '" value="' + esc(values.join('、')) + '" disabled>';
    var choices = field.values.concat(values.filter(function (value) { return !field.values.includes(value); }));
    return '<details class="mi-type-picker mi-multi-picker" data-rule-id="' + esc(node.id) + '"><summary aria-label="' + esc(field.label) + '"><span class="' + (values.length ? '' : 'mi-select-placeholder') + '" data-multi-summary>' + esc(values.length ? values.join('、') : '请选择，可多选') + '</span><i class="bi bi-chevron-down" aria-hidden="true"></i></summary><div class="mi-type-pop"><input type="search" data-option-search placeholder="搜索' + esc(field.label) + '" aria-label="搜索' + esc(field.label) + '"><div class="mi-type-options">' + choices.map(function (value) {
      return '<label class="mi-multi-option" data-option-name="' + esc(value.toLowerCase()) + '"><input type="checkbox" data-multi-value="' + esc(value) + '" data-rule-id="' + esc(node.id) + '"' + (values.includes(value) ? ' checked' : '') + '><span>' + esc(value) + (field.values.includes(value) ? '' : '（历史值，请调整）') + '</span></label>';
    }).join('') + '<div class="mi-option-empty" hidden>无匹配数据</div></div>' + button('clear-multi', 'x-lg', '清除选择', 'data-rule-id="' + esc(node.id) + '"', 'mi-link mi-picker-clear') + '</div></details>';
  }
  function databaseInfo(id) {
    for (var i = 0; i < databaseTree.length; i += 1) {
      var db = databaseTree[i].children.find(function (item) { return item.id === id; });
      if (db) return Object.assign({ path: databaseTree[i].label + ' / ' + db.label }, db);
    }
    return null;
  }
  function databaseNodes(node, keyword) {
    keyword = (keyword || '').trim().toLowerCase();
    var selectedId = node.field === 'table' ? node.databaseId : node.value;
    return databaseTree.map(function (folder) {
      var matchFolder = folder.label.toLowerCase().includes(keyword);
      var children = folder.children.filter(function (db) { return matchFolder || db.label.toLowerCase().includes(keyword); });
      if (!children.length) return '';
      return '<details class="mi-db-folder"' + (keyword || children.some(function (db) { return db.id === selectedId; }) ? ' open' : '') + '><summary><i class="bi bi-caret-right-fill" aria-hidden="true"></i><i class="bi bi-folder-fill" aria-hidden="true"></i><span>' + esc(folder.label) + '</span></summary><div class="mi-db-children">' + children.map(function (db) {
        return button('choose-database', 'database', esc(db.label), 'data-rule-id="' + esc(node.id) + '" data-value="' + esc(db.id) + '"', 'mi-type-option' + (db.id === selectedId ? ' is-active' : ''));
      }).join('') + '</div></details>';
    }).join('') || '<div class="mi-option-empty">无匹配数据</div>';
  }
  function databasePicker(node) {
    var id = node.field === 'table' ? node.databaseId : node.value, db = databaseInfo(id);
    if (readOnly) return '<input aria-label="数据库" value="' + esc(db ? db.path : id) + '" disabled>';
    return '<details class="mi-type-picker mi-db-picker" data-rule-id="' + esc(node.id) + '"><summary aria-label="选择数据库"><span class="' + (id ? '' : 'mi-select-placeholder') + '">' + esc(db ? db.path : id || '请选择数据库') + '</span><i class="bi bi-chevron-down" aria-hidden="true"></i></summary><div class="mi-type-pop"><input type="search" data-database-search placeholder="搜索数据库或目录" aria-label="搜索数据库或目录"><div class="mi-type-options mi-database-nodes">' + databaseNodes(node, '') + '</div>' + button('choose-database', 'x-lg', '清除选择', 'data-rule-id="' + esc(node.id) + '" data-value=""', 'mi-link mi-picker-clear') + '</div></details>';
  }
  function typeName(id) { var type = store.types.find(function (item) { return item.id === id; }); return type ? type.name : ''; }
  function typeOptions(scope, value) {
    var choices = (scope === 'filter' ? [{ id: '', name: '全部类型' }] : []).concat(store.types);
    return choices.map(function (type) { return selectOption('choose-type', esc(type.name), 'data-scope="' + scope + '" data-id="' + esc(type.id) + '" data-type-name="' + esc(type.name.toLowerCase()) + '"', 'mi-type-option' + (value === type.id ? ' is-active' : '')); }).join('') + '<div class="mi-option-empty" hidden>暂无匹配类型</div>';
  }
  function typePicker(scope, value) {
    if (readOnly && scope === 'form') return '<input aria-label="类型" value="' + esc(typeName(value)) + '" disabled>';
    return '<details class="mi-type-picker" data-type-scope="' + scope + '"><summary aria-label="' + (scope === 'filter' ? '筛选类型' : '事项类型') + '"><span class="' + (value ? '' : 'mi-select-placeholder') + '">' + esc(value ? typeName(value) : '请选择') + '</span><i class="bi bi-chevron-down" aria-hidden="true"></i></summary><div class="mi-type-pop"><input type="search" data-type-search placeholder="搜索类型" aria-label="搜索类型"><div class="mi-type-options">' + typeOptions(scope, value) + '</div></div></details>';
  }
  function filteredItems() {
    return store.items.filter(function (item) { return (!filters.type || item.type === filters.type) && (!filters.keyword || item.name.toLowerCase().indexOf(filters.keyword.toLowerCase()) !== -1); });
  }
  function currentRows() { return filteredItems().slice((page - 1) * pageSize, page * pageSize); }
  function renderList() {
    draft = null; typeDraft = null; readOnly = false;
    var records = filteredItems(), pages = Math.max(1, Math.ceil(records.length / pageSize));
    page = Math.max(1, Math.min(page, pages));
    var rows = currentRows(), start = records.length ? (page - 1) * pageSize + 1 : 0, end = Math.min(page * pageSize, records.length);
    var numbers = [];
    for (var n = Math.max(1, page - 2); n <= Math.min(pages, Math.max(5, page + 2)); n += 1) numbers.push('<button type="button" class="page-num' + (n === page ? ' active' : '') + '" data-mi-action="page" data-page="' + n + '"' + (n === page ? ' aria-current="page"' : '') + '>' + n + '</button>');
    root.innerHTML = '<section class="mi-list" aria-label="监控事项列表"><div class="mi-toolbar"><div class="mi-toolbar-actions">' +
      button('new', 'plus-lg', '新建', '', 'btn btn-primary') + button('delete-selected', 'trash', '删除', 'id="miDeleteSelected"' + (selected.size ? '' : ' disabled')) + '</div>' +
      '<form class="mi-query" id="miQuery"><label>类型</label>' + typePicker('filter', filters.type) + '<input id="miKeyword" type="search" placeholder="请输入名称关键词" aria-label="名称关键词" value="' + esc(filters.keyword) + '"><button class="btn btn-primary" type="submit"><i class="bi bi-search" aria-hidden="true"></i><span>查询</span></button></form></div>' +
      '<div class="mi-table-scroll"><table class="ds-table mi-table"><thead><tr><th class="col-ck"><input type="checkbox" id="miCheckAll" aria-label="选择本页全部事项"' + (rows.length ? '' : ' disabled') + '></th><th>名称</th><th>等级</th><th>类型</th><th>描述</th><th>操作者</th><th>更新时间</th><th>操作</th></tr></thead><tbody>' +
      (rows.length ? rows.map(function (item) {
        var tag = ['严重', '紧急'].includes(item.level) ? 'red' : ['重要', '警告'].includes(item.level) ? 'yellow' : 'blue';
        return '<tr data-row-id="' + esc(item.id) + '"' + (selected.has(item.id) ? ' class="is-selected"' : '') + '><td class="col-ck"><input type="checkbox" data-check-id="' + esc(item.id) + '" aria-label="选择' + esc(item.name) + '"' + (selected.has(item.id) ? ' checked' : '') + '></td><td title="' + esc(item.name) + '">' + esc(item.name) + '</td><td><span class="tag tag-' + tag + '">' + esc(item.level) + '</span></td><td title="' + esc(typeName(item.type)) + '">' + esc(typeName(item.type)) + '</td><td title="' + esc(item.description) + '">' + esc(item.description || '—') + '</td><td>' + esc(item.operator) + '</td><td>' + esc(item.updatedAt) + '</td><td class="mi-actions-cell"><div class="mi-actions">' +
          button('detail', 'file-earmark-text', '详情', 'data-id="' + esc(item.id) + '"', 'mi-link') + button('edit', 'pencil-square', '编辑', 'data-id="' + esc(item.id) + '"', 'mi-link') + button('delete', 'trash', '删除', 'data-id="' + esc(item.id) + '"', 'mi-link mi-danger') + '</div></td></tr>';
      }).join('') : '<tr><td colspan="8"><div class="mi-empty"><i class="bi bi-inbox" aria-hidden="true"></i><span>' + (filters.keyword || filters.type ? '暂无符合条件的监控事项' : '暂无监控事项，请点击新建') + '</span></div></td></tr>') + '</tbody></table></div>' +
      '<div class="ds-pagination mi-pagination"><span>第' + start + '到第' + end + '条，共' + records.length + '条数据</span><div class="page-nav">' +
      button('page', 'chevron-left', '上一页', 'data-page="' + (page - 1) + '"' + (page === 1 ? ' disabled' : '')) + numbers.join('') + button('page', 'chevron-right', '下一页', 'data-page="' + (page + 1) + '"' + (page === pages ? ' disabled' : '')) +
      '<select id="miPageSize" aria-label="每页条数">' + options(['10', '20', '50'].map(function (v) { return { value: v, label: v + ' 条/页' }; }), String(pageSize)) + '</select><label>跳至<input id="miPageJump" type="number" min="1" max="' + pages + '" value="' + page + '" aria-label="跳转页码">页</label></div></div></section>';
    syncSelection();
  }
  function query() {
    var input = root.querySelector('#miKeyword');
    filters.keyword = input ? input.value.trim() : filters.keyword;
    page = 1; selected.clear(); renderList();
  }
  function syncSelection() {
    var rows = currentRows(), count = rows.filter(function (item) { return selected.has(item.id); }).length;
    var all = root.querySelector('#miCheckAll'), del = root.querySelector('#miDeleteSelected');
    if (all) { all.checked = rows.length > 0 && count === rows.length; all.indeterminate = count > 0 && count < rows.length; }
    if (del) del.disabled = selected.size === 0;
    root.querySelectorAll('[data-check-id]').forEach(function (el) { el.checked = selected.has(el.dataset.checkId); el.closest('tr').classList.toggle('is-selected', el.checked); });
  }
  function removeItems(ids) {
    var items = store.items.filter(function (item) { return ids.indexOf(item.id) !== -1; });
    if (!items.length) return;
    DP.confirm(items.length === 1 ? '确定删除监控事项“' + esc(items[0].name) + '”吗？' : '确定删除选中的 ' + items.length + ' 条监控事项吗？', {
      icon: 'danger', okText: '<i class="bi bi-trash"></i> 删除', cancelText: '<i class="bi bi-x-lg"></i> 取消', onOk: function () {
        store.items = store.items.filter(function (item) { return ids.indexOf(item.id) === -1; });
        selected.clear(); renderList(); notifySaved('已删除 ' + items.length + ' 条监控事项');
      }
    });
  }
  function ruleField(key) { return fields.find(function (field) { return field.key === key; }); }
  function operators(field) {
    var result = [{ value: 'eq', label: '等于' }, { value: 'ne', label: '不等于' }];
    if (field && field.download) return [{ value: 'gt', label: '大于' }];
    if (field && field.accessWindow) return [{ value: 'outside', label: '不在常规时段内' }];
    if (field && field.equalOnly) return [{ value: 'eq', label: '等于' }];
    if (field && field.threshold) return [{ value: 'gt', label: '大于' }, { value: 'gte', label: '不小于' }];
    if (field && field.periodic) return [{ value: 'eq', label: '等于' }, { value: 'gt', label: '大于' }, { value: 'lt', label: '小于' }];
    if (field && field.numeric) return result.concat([{ value: 'gt', label: '大于' }, { value: 'lt', label: '小于' }, { value: 'range', label: '区间' }]);
    return result;
  }
  function ruleInput(node, part, label, type, extra, placeholder) {
    return '<input type="' + (type || 'text') + '" aria-label="' + esc(label) + '" data-rule-part="' + part + '" data-rule-id="' + esc(node.id) + '" value="' + esc(node[part]) + '" placeholder="' + (placeholder || '请输入') + '" ' + (extra || '') + (readOnly ? ' disabled' : '') + '>';
  }
  function timeSeconds(value) {
    if (!/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/.test(value)) return null;
    var parts = value.split(':').map(Number);
    return parts[0] * 3600 + parts[1] * 60 + (parts[2] || 0);
  }
  function timeText(seconds) {
    return [Math.floor(seconds / 3600), Math.floor(seconds % 3600 / 60), seconds % 60].map(function (part) { return String(part).padStart(2, '0'); }).join(':');
  }
  function accessWindowText(node) {
    var start = timeSeconds(node.accessStart), end = timeSeconds(node.accessEnd);
    if (start === null || end === null || start === end) return '待补全常规访问时段';
    return '每天 ' + timeText(start) + '–' + (end < start ? '次日 ' : '') + timeText(end) + '（北京时间）';
  }
  function ruleHint(node) {
    if (node.field === 'downloadRows') return '按单次下载数据条数判断；正好等于阈值时不触发告警。';
    if (node.field === 'accessWindow') return accessWindowText(node) + '；含开始、不含结束，时段外触发告警。';
    return '';
  }
  function updateRuleHint(node) {
    var el = root.querySelector('[data-rule-hint="' + node.id + '"]');
    if (el) el.textContent = ruleHint(node);
  }
  function renderRuleValue(node, field) {
    var attrs = 'data-rule-id="' + esc(node.id) + '"';
    if (!field) return '<input aria-label="规则值" value="' + esc(node.value) + '" placeholder="请先选择监控字段" disabled>';
    if (field.download) return ruleInput(node, 'value', '单次下载条数阈值', 'number', 'min="1" max="9007199254740991" step="1"', '如：100000') + '<span>条</span>';
    if (field.accessWindow) return '<div class="mi-access-window">' + ruleInput(node, 'accessStart', '常规访问开始时间（北京时间）', 'time', 'step="1"') + '<span class="mi-value-label">至</span>' + ruleInput(node, 'accessEnd', '常规访问结束时间（北京时间）', 'time', 'step="1"') + '</div>';
    if (field.multiple) return multiControl(node, field);
    if (field.database) return databasePicker(node);
    if (field.table) {
      var db = databaseInfo(node.databaseId), tables = db ? db.tables : [];
      return '<div class="mi-table-value">' + databasePicker(node) + selectControl('表', tables, node.value, attrs + ' data-rule-part="value"', readOnly || !tables.length, !db ? '请先选择数据库' : tables.length ? '请选择表' : '该数据库暂无表') + '</div>';
    }
    if (field.periodic) {
      var html = '<span class="mi-value-label">单位</span>' + selectControl('时间单位', periods, node.period, attrs + ' data-rule-part="period"', readOnly);
      if (['minute', 'hour'].includes(node.period)) html += '<span class="mi-value-label">第</span>' + ruleInput(node, 'offset', node.period === 'minute' ? '秒' : '分', 'number', 'min="0" max="59" step="1"', '0–59') + '<span class="mi-value-label">' + (node.period === 'minute' ? '秒' : '分') + '</span>';
      else {
        if (node.period === 'week' || node.period === 'month') html += selectControl(node.period === 'week' ? '星期' : '日期', node.period === 'week' ? weekdays : monthDays, node.day, attrs + ' data-rule-part="day"', readOnly);
        html += ruleInput(node, 'time', '时分秒', 'time', 'step="1"');
      }
      return '<div class="mi-periodic-value">' + html + '</div>';
    }
    if (field.values) return selectControl('规则值', field.values, node.value, attrs + ' data-rule-part="value"', readOnly);
    if (field.numeric) {
      var extra = 'min="0"' + (field.percentage ? ' max="100"' : '') + ' step="' + (field.integer ? '1' : 'any') + '"';
      var numericInput = node.operator === 'range' ? '<div class="mi-range-value">' + ruleInput(node, 'value', '区间下限', 'number', extra, '下限') + '<span>至</span>' + ruleInput(node, 'valueEnd', '区间上限', 'number', extra, '上限') + '</div>' : ruleInput(node, 'value', '规则值', 'number', extra, '输入数字');
      if (field.timeUnit) return '<div class="mi-number-unit">' + numericInput + selectControl('时长单位', timeUnits, node.unit, attrs + ' data-rule-part="unit"', readOnly, '请选择单位') + '</div>';
      return field.unitLabel ? '<div class="mi-number-unit">' + numericInput + '<span class="mi-value-label">' + field.unitLabel + '</span></div>' : numericInput;
    }
    return ruleInput(node, 'value', '规则值', 'text');
  }
  function findRule(id, node, parent, depth) {
    node = node || draft.rules;
    depth = depth || 1;
    if (node.id === id) return { node: node, parent: parent, depth: depth };
    if (node.kind === 'group') {
      for (var i = 0; i < node.children.length; i += 1) { var match = findRule(id, node.children[i], node, depth + (node.children[i].kind === 'group' ? 1 : 0)); if (match) return match; }
    }
    return null;
  }
  function renderRule(node, nested, depth) {
    depth = depth || 1;
    var attrs = ' data-rule-id="' + esc(node.id) + '"', disabled = readOnly ? ' disabled' : '';
    if (node.kind === 'group') {
      var hasLogic = node.children.length > 1;
      return '<div class="mi-rule-node mi-rule-group' + (hasLogic ? ' has-logic' : '') + (nested ? ' is-nested' : '') + '"' + attrs + '>' +
        '<div class="mi-rule-frame">' +
          (nested && !readOnly ? '<div class="mi-rule-group-tools">' + button('remove-rule', 'trash', '删除分组', attrs, 'mi-link mi-danger mi-rule-remove-group') + '</div>' : '') +
          '<div class="mi-rule-children" style="grid-template-rows:repeat(' + (node.children.length * 2) + ', minmax(0, auto))">' + node.children.map(function (child, index) {
            // 每项占两条等高轨道，连接段跨相邻项的各半行，随条件和子组高度自动伸缩。
            var relation = index > 0 ? '<div class="mi-rule-connector' + (node.children[index - 1].kind === 'group' ? ' from-group' : '') + (child.kind === 'group' ? ' to-group' : '') + '" style="grid-row:' + (index * 2) + ' / span 2">' +
              button('logic', '', node.logic === 'and' ? '且' : '或', attrs + disabled + ' aria-label="' + (node.logic === 'and' ? '且：满足组内全部条件，点击切换为或' : '或：满足组内任一条件，点击切换为且') + '" title="' + (node.logic === 'and' ? '点击切换本组全部关系为或' : '点击切换本组全部关系为且') + '"', 'mi-logic') + '</div>' : '';
            return relation + '<div class="mi-rule-branch" style="grid-row:' + (index * 2 + 1) + ' / span 2">' + renderRule(child, true, depth + (child.kind === 'group' ? 1 : 0)) + '</div>';
          }).join('') + '</div>' +
        '</div></div>';
    }
    var field = ruleField(node.field), fixedOperator = field && (field.download || field.accessWindow) && node.operator === operators(field)[0].value, hint = ruleHint(node);
    return '<div class="mi-rule-node mi-rule-row"' + attrs + '>' + selectControl('监控字段', fields.map(function (f) { return { value: f.key, label: f.label }; }), node.field, attrs + ' data-rule-part="field"', readOnly) +
      (fixedOperator ? '<div class="mi-fixed-operator" aria-label="比较方式">' + operators(field)[0].label + '</div>' : selectControl('比较方式', operators(field), node.operator, attrs + ' data-rule-part="operator"', readOnly || !field)) + '<span class="mi-rule-separator">—</span><div class="mi-rule-value">' + renderRuleValue(node, field) + '</div>' +
      (!readOnly ? '<div class="mi-rule-actions">' + button('remove-rule', 'dash-circle-fill', '删除', attrs, 'mi-link mi-danger') + button('add-rule', 'plus-circle-fill', '条件', attrs, 'mi-link mi-success') + button('add-group', 'diagram-3', '分组', attrs + (depth >= 2 ? ' disabled title="最多支持两层分组"' : ''), 'mi-link mi-success') + '</div>' : '') +
      (hint ? '<div class="mi-rule-hint" data-rule-hint="' + esc(node.id) + '">' + esc(hint) + '</div>' : '') + '</div>';
  }
  function renderRules() { root.querySelector('#miRules').innerHTML = renderRule(draft.rules, false); updatePreview(); }
  function formField(label, content, controlClass, required, id) {
    return '<div class="mi-field"><label class="mi-label"' + (id ? ' for="' + id + '"' : '') + '>' + (required ? '<em>*</em>' : '') + label + '</label><div class="mi-control ' + (controlClass || '') + '">' + content + '</div></div>';
  }
  function countedInput(key, label, placeholder) {
    return '<input id="mi-' + key + '" data-field="' + key + '" value="' + esc(draft[key]) + '" maxlength="50" placeholder="' + placeholder + '" aria-label="' + label + '"' + (readOnly ? ' disabled' : '') + '><span class="mi-count" data-count-for="' + key + '">' + draft[key].length + '/50</span>';
  }
  // 仅为消息预览生成符合新增指标的同一次访问示例，不执行真实监控。
  function accessRuleMatches(node, rows, seconds) {
    if (node.kind === 'group') {
      var results = node.children.map(function (child) { return accessRuleMatches(child, rows, seconds); }).filter(function (result) { return result !== null; });
      return results.length ? (node.logic === 'or' ? results.some(Boolean) : results.every(Boolean)) : null;
    }
    if (!['downloadRows', 'accessWindow'].includes(node.field)) return null;
    if (validateRules(node)) return false;
    if (node.field === 'downloadRows') return Number(rows) > Number(node.value);
    var start = timeSeconds(node.accessStart), end = timeSeconds(node.accessEnd);
    var inside = start < end ? seconds >= start && seconds < end : seconds >= start || seconds < end;
    return !inside;
  }
  function accessPreviewValues() {
    var metrics = [];
    function collect(node) {
      if (node.kind === 'group') node.children.forEach(collect);
      else if (['downloadRows', 'accessWindow'].includes(node.field)) metrics.push(node);
    }
    collect(draft.rules);
    var downloads = metrics.filter(function (node) { return node.field === 'downloadRows' && !validateRules(node); });
    var windows = metrics.filter(function (node) { return node.field === 'accessWindow' && !validateRules(node); });
    var threshold = downloads.length ? Math.max.apply(null, downloads.map(function (node) { return Number(node.value); })) : null;
    var rows = threshold === null ? 120000 : threshold + Math.max(1, Math.ceil(threshold * 0.2));
    var candidates = [20 * 3600 + 30 * 60].concat(windows.map(function (node) { return timeSeconds(node.accessEnd); }));
    var seconds = candidates.find(function (candidate) { return windows.every(function (node) { return accessRuleMatches(node, rows, candidate); }); });
    if (seconds === undefined) seconds = candidates.find(function (candidate) { return accessRuleMatches(draft.rules, rows, candidate); });
    var timestamp = seconds === undefined ? '无符合当前规则的访问时间示例' : '2026-09-07 ' + timeText(seconds);
    var values = { '用户账号': 'trade_analyst', '用户姓名': '陈晓', '访问IP': '10.20.30.18', '访问资源': '交易明细数据集', '访问时间': timestamp,
      '下载条数': String(rows), '下载阈值': threshold === null ? '未配置' : String(threshold),
      '常规访问时段': windows.length ? Array.from(new Set(windows.map(accessWindowText))).join('；') : '未配置' };
    if (metrics.length) values['告警时间'] = timestamp;
    return values;
  }
  function preview() {
    var values = Object.assign({}, previewValues, accessPreviewValues(), { '监控项名称': draft.name, '类型': typeName(draft.type), '等级': draft.level, '描述': draft.description,
      '质量任务名称': qualityTasks[0].name, '符合质量规则比例': '62.66%', '质量任务状态': '成功', '质量稽查表': qualityTasks[0].table, '质量稽查字段': qualityTasks[0].field, '质量稽查规则': qualityTasks[0].rule, '质量节点名称': qualityNodes[0], '质量节点结果': '20' });
    var used = new Set();
    function collect(node) {
      if (node.kind === 'group') { node.children.forEach(collect); return; }
      var field = ruleField(node.field);
      if (field && field.timeUnit && !timeUnits.some(function (unit) { return unit.value === node.unit; })) {
        values[field.label] = (node.value || '未填写') + '（单位待核对）'; used.add(field.key); return;
      }
      if (field && field.multiple && !used.has(field.key) && !validateRules(node)) {
        var candidates = field.values.filter(function (value) { return node.operator === 'eq' ? node.values.includes(value) : !node.values.includes(value); });
        values[field.label] = candidates[0] || '无符合条件的示例';
        if (field.key === 'qualityTask') {
          var task = qualityTasks.find(function (item) { return item.name === candidates[0]; });
          values['质量稽查表'] = task ? task.table : '—'; values['质量稽查字段'] = task ? task.field : '—'; values['质量稽查规则'] = task ? task.rule : '—';
        }
        used.add(field.key); return;
      }
      if (field && field.numeric && !field.download && !used.has(field.key) && !validateRules(node)) {
        var value = Number(node.value);
        if (node.operator === 'gt') value += field.integer ? 1 : Math.max(0.01, value * 0.2);
        else if (node.operator === 'lt') value = field.integer ? value - 1 : value * 0.78325;
        else if (node.operator === 'ne') value = field.percentage && value === 100 ? 99 : value + 1;
        else if (node.operator === 'range') value = (value + Number(node.valueEnd)) / 2;
        if (field.integer) value = Math.floor(value);
        var unit = field.timeUnit ? timeUnits.find(function (item) { return item.value === node.unit; }).label : field.unitLabel === '记录数' ? '' : field.unitLabel || '';
        values[field.messageLabel || field.label] = value < 0 || (node.operator === 'lt' && value >= Number(node.value)) || (field.percentage && value > 100) ? '无符合条件的数值示例' : String(Number(value.toFixed(4))) + unit;
        used.add(field.key); return;
      }
      if (!field || field.periodic || node.operator !== 'eq' || !node.value || used.has(field.key)) return;
      if (field.values && !field.values.includes(node.value)) return;
      var db = field.database ? databaseInfo(node.value) : null;
      values[field.label] = db ? db.path : node.value;
      used.add(field.key);
    }
    collect(draft.rules);
    return [draft.title, draft.intro, draft.message].filter(function (part) { return part.trim(); }).join('\n').replace(/【([^】]+)】/g, function (match, key) { return Object.prototype.hasOwnProperty.call(values, key) ? values[key] : match; });
  }
  function updatePreview() {
    var el = root.querySelector('#miPreview'); if (el) el.value = preview();
  }
  function insertVariable(label) {
    if (!draft || readOnly || !messageVariables.includes(label)) return;
    var el = root.querySelector('#mi-message'), token = '【' + label + '】';
    var start = messageRange ? Math.min(messageRange.start, draft.message.length) : draft.message.length;
    var end = messageRange ? Math.min(messageRange.end, draft.message.length) : start;
    var text = draft.message.slice(0, start) + token + draft.message.slice(end);
    if (text.length > 2000) { toast('监控消息不能超过2000个字符'); return; }
    draft.message = text; el.value = text;
    messageRange = { start: start + token.length, end: start + token.length };
    el.focus(); el.setSelectionRange(messageRange.start, messageRange.end); updatePreview();
  }
  function rememberMessageSelection(el) {
    if (el && el.id === 'mi-message') messageRange = { start: el.selectionStart, end: el.selectionEnd };
  }
  function renderForm() {
    var disabled = readOnly ? ' disabled' : '';
    root.innerHTML = '<header class="mi-form-head"><h2>' + (readOnly ? '事项详情' : draft.id ? '修改事项' : '新增事项') + '</h2></header><form id="miForm" class="mi-form' + (readOnly ? ' mi-readonly' : '') + '" novalidate><div id="miFormError" class="mi-error" role="alert" hidden></div>' +
      formField('名称', countedInput('name', '名称', '请输入名称'), 'mi-counted', true, 'mi-name') +
      '<div class="mi-field"><label class="mi-label"><em>*</em>类型</label><div class="mi-type-field">' + typePicker('form', draft.type) + (!readOnly ? button('manage-types', 'gear-fill', '配置', '', 'mi-link') : '') + '</div></div>' +
      formField('等级', selectControl('等级', levels, draft.level, 'id="mi-level" data-field="level"', readOnly), '', true, 'mi-level') +
      formField('描述', '<textarea id="mi-description" data-field="description" placeholder="请输入描述" maxlength="500"' + disabled + '>' + esc(draft.description) + '</textarea>', 'mi-wide', false, 'mi-description') +
      '<div class="mi-field mi-rules-field"><div class="mi-label">监控规则</div><div class="mi-control"><div id="miRules">' + renderRule(draft.rules, false) + '</div>' + (!readOnly ? '<div class="mi-rule-add">' + button('add-root', 'plus-lg', '添加', '', 'btn btn-primary') + '<span class="mi-form-note">最多两层分组；新增关系默认“且”，同组统一切换且／或。</span></div>' : '') + '</div></div>' +
      formField('消息标题', countedInput('title', '消息标题', '50个字符以内'), 'mi-counted', false, 'mi-title') +
      formField('消息引言', '<textarea id="mi-intro" data-field="intro" placeholder="告警消息的开场白" maxlength="500"' + disabled + '>' + esc(draft.intro) + '</textarea>', 'mi-wide', false, 'mi-intro') +
      formField('监控消息', (!readOnly ? selectControl('消息变量', messageVariables, '', 'data-picker-target="message"', false, '请选择消息变量') : '') + '<textarea id="mi-message" data-field="message" aria-label="监控消息内容" maxlength="2000" placeholder="请输入监控消息，可插入【任务名称】等变量"' + disabled + '>' + esc(draft.message) + '</textarea>', 'mi-wide mi-message-controls') +
      formField('消息预览', '<textarea id="miPreview" class="mi-preview" readonly aria-label="消息预览">' + esc(preview()) + '</textarea>', 'mi-wide', false, 'miPreview') +
      '<div class="mi-form-footer">' + (readOnly ? button('edit', 'pencil-square', '编辑', 'data-id="' + esc(draft.id) + '"', 'btn btn-primary') + button('cancel', 'arrow-left', '返回') : '<button type="submit" class="btn btn-primary"><i class="bi bi-check-lg" aria-hidden="true"></i><span>保存</span></button>' + button('cancel', 'x-lg', '取消')) + '</div></form>';
  }
  function openForm(id, detail) {
    var item = id ? store.items.find(function (row) { return row.id === id; }) : null;
    if (id && !item) return;
    draft = item ? clone(item) : blankItem(); readOnly = !!detail; messageRange = null;
    renderForm(); DP.contentArea.scrollTop = 0;
  }
  function validateRules(node, depth) {
    depth = depth || 1;
    if (!node || !node.id) return '监控规则数据不完整';
    if (node.kind === 'group') {
      if (depth > 2) return '监控规则最多支持两层分组，请调整原有嵌套关系后保存';
      if (!['and', 'or'].includes(node.logic) || !Array.isArray(node.children) || !node.children.length) return '每个分组至少需要一条监控规则';
      for (var i = 0; i < node.children.length; i += 1) { var error = validateRules(node.children[i], depth + (node.children[i].kind === 'group' ? 1 : 0)); if (error) return error; }
      return '';
    }
    var field = ruleField(node.field);
    if (node.kind !== 'condition' || !field || !node.operator) return '请补全监控规则的字段、比较方式和规则值，或删除空白条件';
    if (!operators(field).some(function (op) { return op.value === node.operator; })) return '监控规则的比较方式与字段不匹配';
    if (field.multiple) return Array.isArray(node.values) && node.values.length && node.values.every(function (value) { return field.values.includes(value); }) ? '' : '请选择有效的' + field.label + '，至少选择一项';
    if (field.timeUnit && !timeUnits.some(function (unit) { return unit.value === node.unit; })) return '请选择' + field.label + '的单位；历史数值已保留，请核对后保存';
    if (field.accessWindow) {
      var start = timeSeconds(node.accessStart), end = timeSeconds(node.accessEnd);
      if (start === null || end === null) return '请补全常规访问时段的开始和结束时间（北京时间）';
      if (start === end) return '常规访问时段的开始和结束时间不能相同';
      return '';
    }
    if (field.download) {
      if (!Number.isSafeInteger(Number(node.value)) || Number(node.value) <= 0) return '单次下载条数阈值必须为正整数';
      return '';
    }
    if (field.periodic) {
      if (!periods.some(function (p) { return p.value === node.period; })) return '请选择有效的时间单位';
      if (['minute', 'hour'].includes(node.period)) {
        if (String(node.offset).trim() === '' || !Number.isInteger(Number(node.offset)) || Number(node.offset) < 0 || Number(node.offset) > 59) return field.label + '的' + (node.period === 'minute' ? '秒' : '分钟') + '必须为0–59的整数';
      } else {
        if (!/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/.test(node.time)) return '请补全' + field.label + '的时分秒';
        if (node.period === 'week' && !weekdays.some(function (day) { return day.value === node.day; })) return '请选择星期';
        if (node.period === 'month' && !monthDays.some(function (day) { return day.value === node.day; })) return '请选择每月日期';
      }
      return '';
    }
    if (String(node.value == null ? '' : node.value).trim() === '') return '请补全监控规则的字段、比较方式和规则值，或删除空白条件';
    if (field.database && !databaseInfo(node.value)) return '请选择有效的数据库';
    if (field.table) {
      var db = databaseInfo(node.databaseId);
      if (!db || !db.tables.includes(node.value)) return '请先选择数据库，再选择该数据库中的表';
    }
    if (field.values && field.values.indexOf(node.value) === -1) return '请选择有效的监控规则值';
    if (field.numeric) {
      var values = node.operator === 'range' ? [node.value, node.valueEnd] : [node.value];
      if (values.some(function (value) { return String(value == null ? '' : value).trim() === '' || !Number.isFinite(Number(value)) || Number(value) < 0 || (field.integer && !Number.isSafeInteger(Number(value))); })) return field.label + '必须为非负' + (field.integer ? '整数' : '数值') + (node.operator === 'range' ? '，并填写完整区间' : '');
      if (node.operator === 'range' && Number(node.value) > Number(node.valueEnd)) return '区间下限不能大于上限';
      if (field.percentage && values.some(function (value) { return Number(value) > 100; })) return '质量任务评分必须为0–100之间的数值';
    }
    return '';
  }
  function showError(message, target) {
    var el = root.querySelector('#miFormError'); el.textContent = message; el.hidden = false;
    var input = target ? root.querySelector(target) : null;
    if (input) input.focus();
    el.scrollIntoView({ block: 'nearest' });
  }
  function saveItem() {
    if (readOnly || !draft) return;
    var name = draft.name.trim();
    if (!name || name.length > 50) return showError('请输入50个字符以内的事项名称', '#mi-name');
    if (store.items.some(function (item) { return item.id !== draft.id && item.name.toLowerCase() === name.toLowerCase(); })) return showError('该事项名称已存在，请使用其他名称', '#mi-name');
    if (!store.types.some(function (type) { return type.id === draft.type; })) return showError('请选择事项类型');
    if (levels.indexOf(draft.level) === -1) return showError('请选择事项等级', '#mi-level');
    var error = validateRules(draft.rules);
    if (error) return showError(error);
    if (draft.title.length > 50) return showError('消息标题不能超过50个字符', '#mi-title');
    var isNew = !draft.id, now = new Date(), pad = function (n) { return String(n).padStart(2, '0'); };
    draft.name = name; draft.id = draft.id || uid('MI'); draft.operator = '数据运维员';
    draft.updatedAt = now.getFullYear() + '-' + pad(now.getMonth() + 1) + '-' + pad(now.getDate()) + ' ' + pad(now.getHours()) + ':' + pad(now.getMinutes()) + ':' + pad(now.getSeconds());
    var saved = clone(draft), index = store.items.findIndex(function (item) { return item.id === saved.id; });
    if (index < 0) store.items.unshift(saved); else store.items[index] = saved;
    // 保存后确保该事项能在列表中看到，编辑后的名称与类型可能不再满足原筛选。
    filters = { type: '', keyword: '' }; selected.clear(); page = Math.floor(store.items.indexOf(saved) / pageSize) + 1;
    renderList(); notifySaved(isNew ? '监控事项已新增' : '监控事项已保存');
  }
  function changeRule(action, id) {
    if (!draft || readOnly) return;
    if (action === 'add-root') { draft.rules.children.push(condition()); renderRules(); return; }
    var match = findRule(id); if (!match) return;
    var node = match.node, parent = match.parent;
    if (action === 'logic' && node.kind === 'group') node.logic = node.logic === 'and' ? 'or' : 'and';
    else if (action === 'remove-rule' && parent) {
      parent.children = parent.children.filter(function (child) { return child.id !== id; });
      if (!parent.children.length) parent.children.push(condition());
    } else if (action === 'add-rule' && parent) parent.children.splice(parent.children.indexOf(node) + 1, 0, condition());
    else if (action === 'add-group' && parent) {
      if (match.depth >= 2) { toast('监控规则最多支持两层分组'); return; }
      // 将当前条件与新条件组成子分组，保留原条件，便于表达 A 或 (B 且 C)。
      parent.children.splice(parent.children.indexOf(node), 1, group('and', [node, condition()]));
    }
    renderRules();
  }
  function setRulePart(node, part, value) {
    if (part === 'field') {
      var field = ruleField(value);
      Object.assign(node, { field: value, operator: field && field.download ? 'gt' : field && field.accessWindow ? 'outside' : field && field.threshold ? '' : 'eq', value: field && field.initial || '', values: [], unit: field && field.timeUnit ? 'minute' : '', valueEnd: '', period: 'minute', offset: '0', day: '', time: '', databaseId: '',
        accessStart: field && field.accessWindow ? '08:00:00' : '', accessEnd: field && field.accessWindow ? '18:00:00' : '' });
      renderRules();
    } else if (part === 'operator') {
      if (node.operator !== value) node.valueEnd = '';
      node.operator = value; renderRules();
    } else if (part === 'unit') {
      var factors = { second: 1, minute: 60, hour: 3600 };
      if (!factors[value]) return;
      if (factors[node.unit]) ['value', 'valueEnd'].forEach(function (key) {
        if (node[key] !== '' && Number.isFinite(Number(node[key]))) node[key] = String(Number((Number(node[key]) * factors[node.unit] / factors[value]).toPrecision(12)));
      });
      node.unit = value; renderRules();
    } else if (part === 'period') {
      Object.assign(node, { period: value, offset: '0', day: '', time: '' }); renderRules();
    } else if (['value', 'valueEnd', 'offset', 'day', 'time', 'accessStart', 'accessEnd'].includes(part)) {
      node[part] = value;
      if (part === 'day') renderRules();
      else { updateRuleHint(node); updatePreview(); }
    }
  }
  function closeTypeModal() {
    var mask = root.querySelector('.mi-modal-mask'); if (mask) mask.remove();
    typeDraft = null;
    if (returnFocus && returnFocus.isConnected) returnFocus.focus();
    returnFocus = null;
  }
  function renderTypeRows() {
    root.querySelector('#miTypeRows').innerHTML = typeDraft.map(function (type) {
      var builtIn = ['system', 'interface'].includes(type.id);
      return '<div class="mi-type-edit"><input value="' + esc(type.name) + '" data-type-edit="' + esc(type.id) + '" maxlength="20" aria-label="类型名称"' + (builtIn ? ' disabled' : '') + '>' + (builtIn ? '<span class="tag tag-blue">系统内置</span>' : button('remove-type', 'trash', '删除', 'data-id="' + esc(type.id) + '"', 'mi-link mi-danger')) + '</div>';
    }).join('');
  }
  function openTypeModal() {
    typeDraft = clone(store.types); returnFocus = document.activeElement;
    root.insertAdjacentHTML('beforeend', '<div class="mi-modal-mask"><section class="mi-modal" role="dialog" aria-modal="true" aria-labelledby="miTypeTitle"><header><h3 id="miTypeTitle">事项类型配置</h3>' + button('close-types', 'x-lg', '关闭', '', 'mi-link') + '</header><div class="mi-modal-body"><div id="miTypeRows"></div>' + button('add-type', 'plus-lg', '添加类型') + '<div id="miTypeError" class="mi-error" role="alert" hidden></div></div><footer>' + button('save-types', 'check-lg', '保存', '', 'btn btn-primary') + button('close-types', 'x-lg', '取消') + '</footer></section></div>');
    renderTypeRows(); root.querySelector('.mi-modal button').focus();
  }
  function typeError(message) { var el = root.querySelector('#miTypeError'); el.textContent = message; el.hidden = false; }
  function saveTypes() {
    var names = typeDraft.map(function (type) { return type.name.trim(); });
    if (names.some(function (name) { return !name || name.length > 20; })) return typeError('类型名称不能为空，且不超过20个字符');
    if (new Set(names.map(function (name) { return name.toLowerCase(); })).size !== names.length) return typeError('类型名称不能重复');
    store.types = typeDraft.map(function (type, index) { return { id: type.id, name: names[index] }; });
    if (!store.types.some(function (type) { return type.id === draft.type; })) draft.type = '';
    closeTypeModal(); renderForm(); notifySaved('事项类型已保存');
  }
  function onClick(event) {
    rememberMessageSelection(event.target);
    var btn = event.target.closest('[data-mi-action]');
    root.querySelectorAll('.mi-type-picker[open]').forEach(function (picker) { if (!picker.contains(event.target)) picker.open = false; });
    if (event.target.classList.contains('mi-modal-mask')) { closeTypeModal(); return; }
    if (!btn || btn.disabled) return;
    var action = btn.dataset.miAction, id = btn.dataset.id;
    if (action === 'new') openForm();
    else if (action === 'edit' || action === 'detail') openForm(id, action === 'detail');
    else if (action === 'cancel') { renderList(); DP.contentArea.scrollTop = 0; }
    else if (action === 'delete') removeItems([id]);
    else if (action === 'delete-selected') removeItems(Array.from(selected));
    else if (action === 'page') { page = Number(btn.dataset.page); selected.clear(); renderList(); }
    else if (action === 'choose-type') {
      if (btn.dataset.scope === 'filter') { filters.type = id; query(); }
      else { draft.type = id; var picker = btn.closest('.mi-type-picker'); picker.outerHTML = typePicker('form', id); root.querySelector('[data-type-scope="form"] summary').focus(); updatePreview(); }
    } else if (action === 'choose-option' && draft && !readOnly) {
      btn.closest('.mi-type-picker').open = false;
      if (btn.dataset.pickerTarget === 'message') insertVariable(btn.dataset.value);
      else { var match = findRule(btn.dataset.ruleId); if (match) { setRulePart(match.node, btn.dataset.rulePart, btn.dataset.value); if (btn.dataset.rulePart === 'value') renderRules(); } }
    } else if (action === 'choose-database' && draft && !readOnly) {
      var rule = findRule(btn.dataset.ruleId);
      if (!rule || btn.dataset.value && !databaseInfo(btn.dataset.value)) return;
      if (rule.node.field === 'table') {
        if (rule.node.databaseId !== btn.dataset.value) rule.node.value = '';
        rule.node.databaseId = btn.dataset.value;
      } else if (rule.node.field === 'database') rule.node.value = btn.dataset.value;
      renderRules();
    } else if (action === 'clear-multi' && draft && !readOnly) {
      var multiRule = findRule(btn.dataset.ruleId);
      if (multiRule && ruleField(multiRule.node.field).multiple) { multiRule.node.values = []; renderRules(); }
    } else if (['add-root', 'logic', 'remove-rule', 'add-rule', 'add-group'].includes(action)) changeRule(action, btn.dataset.ruleId);
    else if (action === 'manage-types') openTypeModal();
    else if (action === 'close-types') closeTypeModal();
    else if (action === 'add-type') { typeDraft.push({ id: uid('type'), name: '' }); renderTypeRows(); var inputs = root.querySelectorAll('[data-type-edit]'); inputs[inputs.length - 1].focus(); }
    else if (action === 'remove-type') {
      if (['system', 'interface'].includes(id)) return;
      if (store.items.some(function (item) { return item.type === id; }) || draft.type === id) return typeError('该类型正在使用，暂不能删除');
      typeDraft = typeDraft.filter(function (type) { return type.id !== id; }); renderTypeRows();
    } else if (action === 'save-types') saveTypes();
  }
  function onInput(event) {
    var el = event.target;
    if (el.hasAttribute('data-option-search')) {
      var optionPop = el.closest('.mi-type-pop'), visible = 0;
      optionPop.querySelectorAll('[data-option-name]').forEach(function (option) { option.hidden = !option.dataset.optionName.includes(el.value.trim().toLowerCase()); if (!option.hidden) visible += 1; });
      optionPop.querySelector('.mi-option-empty').hidden = visible !== 0; return;
    }
    if (el.hasAttribute('data-database-search')) {
      var databasePop = el.closest('.mi-db-picker'), rule = findRule(databasePop.dataset.ruleId);
      if (rule) databasePop.querySelector('.mi-database-nodes').innerHTML = databaseNodes(rule.node, el.value);
      return;
    }
    if (el.hasAttribute('data-type-search')) {
      var pop = el.closest('.mi-type-pop'), count = 0;
      pop.querySelectorAll('[data-type-name]').forEach(function (option) { option.hidden = option.dataset.typeName.indexOf(el.value.trim().toLowerCase()) === -1; if (!option.hidden) count += 1; });
      pop.querySelector('.mi-option-empty').hidden = count !== 0; return;
    }
    if (el.dataset.typeEdit && typeDraft) { var type = typeDraft.find(function (t) { return t.id === el.dataset.typeEdit; }); if (type) type.name = el.value; return; }
    if (!draft || readOnly) return;
    if (el.dataset.field && el.tagName !== 'SELECT' && el.type !== 'checkbox') {
      draft[el.dataset.field] = el.value;
      var counter = root.querySelector('[data-count-for="' + el.dataset.field + '"]'); if (counter) counter.textContent = el.value.length + '/50';
      rememberMessageSelection(el);
      updatePreview();
    }
    if (['value', 'valueEnd', 'offset', 'time', 'accessStart', 'accessEnd'].includes(el.dataset.rulePart)) { var match = findRule(el.dataset.ruleId); if (match) { match.node[el.dataset.rulePart] = el.value; updateRuleHint(match.node); updatePreview(); } }
  }
  function onChange(event) {
    var el = event.target;
    if (el.id === 'miCheckAll') { currentRows().forEach(function (item) { if (el.checked) selected.add(item.id); else selected.delete(item.id); }); syncSelection(); }
    else if (el.dataset.checkId) { if (el.checked) selected.add(el.dataset.checkId); else selected.delete(el.dataset.checkId); syncSelection(); }
    else if (el.id === 'miPageSize') { pageSize = Number(el.value); page = 1; selected.clear(); renderList(); }
    else if (el.id === 'miPageJump') jumpPage(el);
    else if (draft && !readOnly) {
      if (el.dataset.multiValue !== undefined) {
        var multi = findRule(el.dataset.ruleId), field = multi && ruleField(multi.node.field);
        if (field && field.multiple) {
          var values = Array.isArray(multi.node.values) ? multi.node.values : [];
          multi.node.values = el.checked ? Array.from(new Set(values.concat(el.dataset.multiValue))) : values.filter(function (value) { return value !== el.dataset.multiValue; });
          var summary = el.closest('.mi-multi-picker').querySelector('[data-multi-summary]');
          summary.textContent = multi.node.values.join('、') || '请选择，可多选'; summary.classList.toggle('mi-select-placeholder', !multi.node.values.length);
          updatePreview();
        }
        return;
      }
      if (el.dataset.field) {
        draft[el.dataset.field] = el.type === 'checkbox' ? el.checked : el.value;
        updatePreview();
      }
      if (el.dataset.rulePart) {
        var match = findRule(el.dataset.ruleId); if (!match) return;
        setRulePart(match.node, el.dataset.rulePart, el.value);
      }
    }
  }
  function jumpPage(el) {
    var total = Math.max(1, Math.ceil(filteredItems().length / pageSize));
    page = Math.max(1, Math.min(total, Math.floor(Number(el.value) || 1))); selected.clear(); renderList();
  }
  function onKeyDown(event) {
    var modal = root.querySelector('.mi-modal');
    if (event.key === 'Escape') {
      if (modal) closeTypeModal();
      else root.querySelectorAll('.mi-type-picker[open]').forEach(function (picker) { picker.open = false; picker.querySelector('summary').focus(); });
    }
    if (modal && event.key === 'Tab') {
      var focusable = Array.from(modal.querySelectorAll('button:not(:disabled), input:not(:disabled)')), first = focusable[0], last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
    var picker = event.target.closest('.mi-type-picker');
    if (picker && picker.open && ['ArrowDown', 'ArrowUp', 'Enter'].includes(event.key)) {
      var choices = Array.from(picker.querySelectorAll('[data-mi-action="choose-option"], [data-mi-action="choose-type"], [data-mi-action="choose-database"], [data-multi-value]')).filter(function (el) { return !el.hidden && el.getClientRects().length; });
      var index = choices.indexOf(event.target);
      if (event.key === 'Enter' && event.target.type === 'search') { event.preventDefault(); if (choices[0]) choices[0].click(); }
      else if (event.key !== 'Enter' && choices.length) { event.preventDefault(); choices[(index + (event.key === 'ArrowDown' ? 1 : -1) + choices.length) % choices.length].focus(); }
    }
    if (event.key === 'Enter' && (event.target.type === 'search' && picker || modal && event.target.tagName === 'INPUT')) event.preventDefault();
    if (event.key === 'Enter' && event.target.id === 'miPageJump') { event.preventDefault(); jumpPage(event.target); }
  }
  function init() {
    root = DP.contentArea.querySelector('.page-monitor-items'); if (!root) return;
    store = store || loadStore(); selected.clear();
    root.addEventListener('click', onClick); root.addEventListener('input', onInput); root.addEventListener('change', onChange); root.addEventListener('keydown', onKeyDown);
    root.addEventListener('submit', function (event) { event.preventDefault(); if (event.target.id === 'miQuery') query(); else if (event.target.id === 'miForm') saveItem(); });
    root.addEventListener('select', function (event) { rememberMessageSelection(event.target); });
    root.addEventListener('keyup', function (event) { rememberMessageSelection(event.target); });
    root.addEventListener('focusout', function (event) { rememberMessageSelection(event.target); var picker = event.target.closest('.mi-type-picker'); if (picker && !picker.contains(event.relatedTarget)) picker.open = false; });
    renderList();
  }
  function describe() {
    return clone({ fields: fields.map(function (field) { return Object.assign({}, field, { operators: operators(field) }); }), variables: messageVariables, timeUnits: timeUnits, periods: periods, levels: levels, examples: seedStore().items });
  }
  return { html: '<div class="page-monitor-items"></div>', init: init, describe: describe,
    getCatalog: function () { var current = store || loadStore(); return clone({ types: current.types, items: current.items.map(function (item) { return { id: item.id, name: item.name, type: item.type, description: item.description }; }) }); }
  };
}());
