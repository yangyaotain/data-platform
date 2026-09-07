/** 控制台 / 日志管理 / SQL审计日志：人工触发执行的静态审计示例。 */
window.DP = window.DP || {};
DP.pages = DP.pages || {};
DP.pages.sqlAuditLog = (function () {
  'use strict';
  var view = DP.logView;
  // 每条示例对应一次语句提交；同一批次的多条语句共享 batchId。
  var templates = [
    { source: '数据探索', scene: 'SQL查询', project: '数据中台项目', environment: '生产', datasource: 'prod_mysql_master', database: 'order_center', type: 'SELECT', node: '客户订单分析 / 订单明细查询',
      sql: "SELECT order_id, customer_id, total_amount, order_status\nFROM order_detail\nWHERE order_date >= '2026-09-01'\n  AND order_status = '已完成'\nORDER BY order_date DESC\nLIMIT 100;", params: '{}', result: 100 },
    { source: '数据探索', scene: '执行选中语句', project: '物流数仓项目', environment: '开发', datasource: 'hive_warehouse', database: 'zz_tms_dwd', type: 'SELECT', node: '运单分析 / 运输时效统计',
      sql: "SELECT carrier_code, COUNT(*) AS waybill_count,\n       AVG(delivery_hours) AS avg_delivery_hours\nFROM dwd_waybill_detail_di\nWHERE dt = '2026-09-03'\nGROUP BY carrier_code;", params: '{"dt":"2026-09-03"}', result: 18 },
    { source: '数据开发', scene: '测试执行', project: '数据中台项目', environment: '开发', datasource: 'dev_mysql_order', database: 'dwd', type: 'INSERT', node: '订单数据加工 / 在线编程子流程1-1',
      sql: "INSERT INTO dwd_order_detail_di (order_id, customer_id, total_amount, dt)\nSELECT order_id, customer_id, total_amount, '${biz_date}'\nFROM ods_order_detail\nWHERE dt = '${biz_date}' AND order_id IS NOT NULL;", params: '{"biz_date":"2026-09-03"}', result: 12860 },
    { source: '数据开发', scene: '调试执行', project: '实时计算项目', environment: '开发', datasource: 'flink_realtime', database: 'realtime_order', type: 'INSERT', node: '实时订单处理 / 在线编程流程-Flinksql',
      sql: "INSERT INTO dws_order_payment_rt\nSELECT shop_id, COUNT(*) AS paid_orders, SUM(pay_amount) AS paid_amount\nFROM ods_order_payment_rt\nWHERE pay_status = 'SUCCESS'\nGROUP BY shop_id;", params: '{"checkpoint_interval":"60s"}', result: 2400 },
    { source: '数据质量', scene: 'SQL测试', project: '物流数仓项目', environment: '测试', datasource: 'test_mysql_quality', database: 'quality_check', type: 'SELECT', node: '任务配置 / 运单编号非空校验',
      sql: "SELECT waybill_no, customer_name, planned_collect_time\nFROM dwd_waybill_detail_di\nWHERE waybill_no IS NULL OR TRIM(waybill_no) = ''\nLIMIT 10;", params: '{}', result: 8 },
    { source: '数据服务', scene: '接口测试', project: '数据中台项目', environment: '测试', datasource: 'postgres_service', database: 'service_data', type: 'SELECT', node: '接口开发 / 客户订单查询',
      sql: "SELECT customer_id, customer_name, order_count, total_amount\nFROM customer_order_summary\nWHERE customer_id = :customer_id;", params: '{"customer_id":"C10086"}', result: 1 },
    { source: '数据开发', scene: '执行脚本', project: '物流数仓项目', environment: '开发', datasource: 'hive_warehouse', database: 'zz_tms_dws', type: 'CREATE', node: '运输日报加工 / 承运商日报建表',
      sql: "CREATE TABLE IF NOT EXISTS dws_carrier_daily (\n  carrier_code STRING,\n  waybill_count BIGINT,\n  total_weight DECIMAL(18, 2)\n) PARTITIONED BY (dt STRING)\nSTORED AS PARQUET;", params: '{}', result: 0 },
    { source: '数据开发', scene: '执行脚本', project: '物流数仓项目', environment: '开发', datasource: 'hive_warehouse', database: 'zz_tms_dws', type: 'INSERT', node: '运输日报加工 / 承运商日报写入',
      sql: "INSERT OVERWRITE TABLE dws_carrier_daily PARTITION (dt='2026-09-03')\nSELECT carrier_code, COUNT(*) AS waybill_count, SUM(weight) AS total_weight\nFROM zz_tms_dwd.dwd_waybill_detail_di\nWHERE dt = '2026-09-03'\nGROUP BY carrier_code;", params: '{"dt":"2026-09-03"}', result: 18 },
    { source: '数据探索', scene: 'SQL查询', project: '营销分析平台', environment: '生产', datasource: 'clickhouse_analysis', database: 'marketing', type: 'SELECT', node: '营销看板 / 活动转化分析',
      sql: "SELECT campaign_id, COUNT(DISTINCT user_id) AS visitors,\n       SUM(converted) AS conversions\nFROM campaign_events\nWHERE event_date = '2026-09-03'\nGROUP BY campaign_id;", params: '{}', result: 26 },
    { source: '数据质量', scene: '人工执行稽查', project: '数据中台项目', environment: '生产', datasource: 'spark_quality', database: 'dwd', type: 'SELECT', node: '稽查任务 / 订单金额准确性稽查',
      sql: "SELECT COUNT(*) AS total_records,\n       SUM(CASE WHEN total_amount <= 0 THEN 1 ELSE 0 END) AS issue_records\nFROM dwd_order_detail_di\nWHERE dt = '${biz_date}';", params: '{"biz_date":"2026-09-03"}', result: 1 },
    { source: '数据探索', scene: '查看执行计划', project: '数据中台项目', environment: '开发', datasource: 'oracle_crm', database: 'CRM', type: 'EXPLAIN', node: '客户分析 / 客户活跃度查询',
      sql: "EXPLAIN PLAN FOR\nSELECT customer_id, customer_name, last_active_time\nFROM crm_customer\nWHERE last_active_time >= DATE '2026-09-01';", params: '{}', result: 0 },
    { source: '数据开发', scene: '测试执行', project: '物流数仓项目', environment: '测试', datasource: 'sqlserver_logistics', database: 'logistics_test', type: 'UPDATE', node: '运单状态修复 / 测试状态更新',
      sql: "UPDATE waybill_test\nSET status = '已签收', updated_at = GETDATE()\nWHERE waybill_no = 'YT7328049183' AND status = '运输中';", params: '{}', result: 1 },
    { source: '数据开发', scene: '调试执行', project: '营销分析平台', environment: '开发', datasource: 'doris_marketing', database: 'marketing_dev', type: 'DELETE', node: '营销测试数据 / 清理临时结果',
      sql: "DELETE FROM campaign_result_test\nWHERE batch_id = 'TEST_20260903' AND is_test = 1;", params: '{}', result: 35 },
    { source: '数据探索', scene: 'SQL查询', project: '物流数仓项目', environment: '生产', datasource: 'trino_lake', database: 'lakehouse.dwd', type: 'SELECT', node: '数据湖分析 / 运单汇总',
      sql: "SELECT region_code, COUNT(*) AS waybill_count\nFROM lakehouse.dwd.waybill_detail\nWHERE dt BETWEEN DATE '2026-09-01' AND DATE '2026-09-03'\nGROUP BY region_code;", params: '{}', result: 31 },
    { source: '数据探索', scene: 'SQL查询', project: '营销分析平台', environment: '测试', datasource: 'starrocks_ads', database: 'ads_test', type: 'SHOW', node: '广告效果分析 / 查看汇总表结构',
      sql: 'SHOW CREATE TABLE ads_campaign_daily;', params: '{}', result: 1 }
  ];
  var seeds = [
    ['2026-09-04 10:58:12', 3, '执行中'], ['2026-09-04 10:56:10', 0, '成功'],
    ['2026-09-04 10:48:35', 5, '成功'], ['2026-09-04 10:42:05', 7, '成功', 'BATCH202609040004', 2],
    ['2026-09-04 10:42:00', 6, '成功', 'BATCH202609040004', 1], ['2026-09-04 10:36:28', 2, '失败'],
    ['2026-09-04 10:28:18', 4, '成功'], ['2026-09-04 10:12:06', 8, '已取消'],
    ['2026-09-04 09:54:30', 9, '成功'], ['2026-09-04 09:32:45', 1, '成功'],
    ['2026-09-04 09:18:42', 10, '成功'], ['2026-09-04 09:05:10', 11, '成功'],
    ['2026-09-03 17:48:22', 12, '成功'], ['2026-09-03 17:12:38', 13, '失败'],
    ['2026-09-03 16:38:11', 14, '成功'], ['2026-09-03 16:15:06', 0, '成功'],
    ['2026-09-03 15:45:33', 2, '成功'], ['2026-09-03 15:06:42', 5, '失败'],
    ['2026-09-03 14:26:07', 1, '成功'], ['2026-09-03 11:38:19', 4, '成功'],
    ['2026-09-03 10:12:55', 8, '成功'], ['2026-09-02 17:28:16', 9, '成功'],
    ['2026-09-02 16:18:32', 10, '成功'], ['2026-09-02 15:42:19', 11, '失败'],
    ['2026-09-02 14:35:08', 12, '成功'], ['2026-09-02 13:20:14', 13, '已取消'],
    ['2026-09-02 11:46:27', 14, '成功'], ['2026-09-02 10:15:38', 0, '成功'],
    ['2026-09-01 16:52:12', 2, '成功'], ['2026-09-01 14:32:48', 5, '成功'],
    ['2026-09-01 11:24:16', 4, '成功'], ['2026-09-01 09:18:22', 1, '成功']
  ];
  var users = {
    '数据探索': ['analyst_lisi', '李四'], '数据开发': ['dev_wangwu', '王五'],
    '数据质量': ['quality_zhangsan', '张三'], '数据服务': ['service_zhaoliu', '赵六']
  };
  function endTime(time, duration) {
    var date = new Date(time.replace(' ', 'T') + '+08:00');
    return new Date(date.getTime() + duration + 8 * 3600000).toISOString().slice(0, 19).replace('T', ' ');
  }
  var records = seeds.map(function (seed, i) {
    var template = templates[seed[1]], status = seed[2], user = users[template.source];
    var businessDate = new Date(new Date(seed[0].slice(0, 10) + 'T00:00:00Z').getTime() - 86400000).toISOString().slice(0, 10);
    var duration = [12000, 320, 180, 8240, 1200, 860, 460, 15400, 2160, 680][i % 10];
    var id = 'SQL' + seed[0].slice(0, 10).replace(/-/g, '') + String(10000 + (seeds.length - i)).slice(1);
    var error = '';
    if (status === '失败') {
      error = seed[1] === 2 ? 'SQLSTATE 42S02：目标表 dwd_order_detail_di 不存在，请检查数据库和表名。' :
        seed[1] === 13 ? 'QUERY_TIMEOUT：查询超过60秒执行时限，任务已终止。' :
        seed[1] === 5 ? 'PARAMETER_MISSING：缺少必填参数 customer_id，SQL执行失败。' : 'PERMISSION_DENIED：当前用户没有目标表的 UPDATE 权限。';
      if (seed[1] === 13) duration = 60000;
    }
    return Object.assign({}, template, {
      sql: template.sql.replace(/2026-09-03/g, businessDate).replace(/TEST_20260903/g, 'TEST_' + businessDate.replace(/-/g, '')),
      id: id, time: seed[0], batchId: seed[3] || 'BATCH' + id.slice(3), statementIndex: seed[4] || 1,
      statementCount: seed[3] ? 2 : 1, user: user[0], name: user[1], ip: '10.244.0.' + (21 + i % 4) + ':30333',
      status: status, duration: status === '执行中' ? '—' : duration + ' ms', durationMs: status === '执行中' ? null : duration,
      endTime: status === '执行中' ? '' : endTime(seed[0], duration), rows: status === '成功' ? template.result : null,
      params: status === '失败' && seed[1] === 5 ? '{}' : template.params.replace(/2026-09-03/g, businessDate),
      resultMessage: status === '成功' ? '语句执行成功' : status === '失败' ? '语句执行失败，详见错误信息' : status === '已取消' ? '用户主动取消本次查询，执行已终止' : '执行请求已提交，正在运行', error: error
    });
  });
  function choices(key, source) {
    return Array.from(new Set(records.filter(function (row) { return !source || row.source === source; }).map(function (row) { return row[key]; }))).map(function (value) { return { label: value, value: value }; });
  }
  function stacked(main, sub) { return '<span class="lm-truncate" title="' + view.esc(main) + '">' + view.esc(main) + '</span><span class="lm-cell-sub" title="' + view.esc(sub) + '">' + view.esc(sub) + '</span>'; }
  var statuses = { '成功': ['success', 'check-circle'], '失败': ['failed', 'x-circle'], '已取消': ['cancelled', 'dash-circle'], '执行中': ['running', 'clock'] };
  function statusBadge(row) {
    var status = statuses[row.status];
    return '<span class="lm-status lm-status-' + status[0] + '"><i class="bi bi-' + status[1] + '" aria-hidden="true"></i>' + view.esc(row.status) + '</span>';
  }
  return view.create({
    kind: 'sql', title: 'SQL审计日志', records: records, keywordPlaceholder: '用户 / SQL / 任务或节点 / 执行ID', timeLabel: '执行时间',
    filterLayout: 'grouped',
    keywordKeys: ['user', 'name', 'sql', 'node', 'id', 'batchId'],
    filters: [
      { key: 'source', label: '模块', options: choices('source') },
      { key: 'scene', label: '功能', parent: 'source', options: function (filters) { return choices('scene', filters.source); } },
      { key: 'project', label: '项目', options: choices('project') },
      { key: 'environment', label: '环境', options: choices('environment') },
      { key: 'datasource', label: '数据源', options: choices('datasource') },
      { key: 'type', label: 'SQL类型', options: choices('type') },
      { key: 'status', label: '执行状态', options: choices('status') }
    ],
    columns: [
      { key: 'time', label: '执行时间', width: 104, render: function (row) { return stacked(row.time.slice(0, 10), row.time.slice(11)); } },
      { key: 'sql', label: 'SQL内容', width: 260, flexible: true, render: function (row) {
        return '<button type="button" class="lm-cell-link" data-lm-action="detail" data-id="' + row.id + '" title="' + view.esc(row.sql) + '"><i class="bi bi-code-square" aria-hidden="true"></i><span class="lm-truncate lm-sql-text">' + view.esc(row.sql.replace(/\s+/g, ' ')) + '</span></button>' +
          '<div class="lm-sql-meta"><span class="lm-type">' + view.esc(row.type) + '</span><span class="lm-cell-sub" title="' + view.esc(row.node) + '">' + view.esc(row.node) + '</span></div>';
      } },
      { key: 'source', label: '模块 / 功能', width: 100, render: function (row) { return stacked(row.source, row.scene); } },
      { key: 'project', label: '项目 / 环境', width: 110, render: function (row) { return stacked(row.project, row.environment); } },
      { key: 'user', label: '执行用户', width: 118, render: function (row) { return stacked(row.user, row.name); } },
      { key: 'datasource', label: '数据源 / 数据库', width: 142, render: function (row) { return stacked(row.datasource, row.database); } },
      { key: 'status', label: '执行状态', width: 86, render: statusBadge },
      { key: 'metrics', label: '执行指标', width: 100, render: function (row) {
        var count = row.rows == null ? '—' : row.rows.toLocaleString('zh-CN');
        return '<span class="lm-metric" title="耗时：' + view.esc(row.duration) + '"><span class="lm-metric-label">耗时</span>' + view.esc(row.duration) + '</span><span class="lm-cell-sub" title="返回/影响行数：' + count + '">行数 ' + count + '</span>';
      } },
      { key: 'detail', label: '操作', width: 76, render: function (row) { return view.button('detail', 'file-text', '详情', 'data-id="' + row.id + '"', 'btn-text lm-detail-btn'); } }
    ],
    detail: function (row) {
      return '<div class="lm-sql-overview">' + view.fields('执行摘要', [['执行状态', row.status], ['开始时间', row.time], ['结束时间', row.endTime], ['耗时', row.duration], ['返回/影响行数', row.rows], ['SQL类型', row.type]]) + '</div>' +
        view.content('完整SQL', row.sql, true) + view.content('执行结果', row.resultMessage) +
        (row.error ? '<div class="lm-sql-error">' + view.content('错误信息', row.error) + '</div>' : '') +
        view.fields('模块与操作人', [['执行ID', row.id], ['执行批次', row.batchId], ['批次语句', '第 ' + row.statementIndex + ' 条 / 共 ' + row.statementCount + ' 条'], ['模块', row.source], ['功能', row.scene], ['所属项目', row.project], ['执行环境', row.environment], ['来源任务 / 节点', row.node], ['用户账号', row.user], ['用户姓名', row.name], ['用户IP地址及端口', row.ip], ['数据源', row.datasource], ['数据库', row.database]]) +
        view.content('执行参数', JSON.stringify(JSON.parse(row.params), null, 2));
    },
    exportColumns: [
      { key: 'id', label: '执行ID' }, { key: 'batchId', label: '执行批次' }, { key: 'statementIndex', label: '语句序号' }, { key: 'statementCount', label: '批次语句总数' },
      { key: 'time', label: '开始时间' }, { key: 'endTime', label: '结束时间' }, { key: 'source', label: '模块' }, { key: 'scene', label: '功能' },
      { key: 'project', label: '所属项目' }, { key: 'environment', label: '执行环境' }, { key: 'node', label: '来源任务/节点' },
      { key: 'user', label: '用户账号' }, { key: 'name', label: '用户姓名' }, { key: 'ip', label: '用户IP地址及端口' },
      { key: 'datasource', label: '数据源' }, { key: 'database', label: '数据库' }, { key: 'type', label: 'SQL类型' },
      { key: 'sql', label: '完整SQL' }, { key: 'params', label: '执行参数' }, { key: 'status', label: '执行状态' },
      { key: 'durationMs', label: '耗时(ms)' }, { key: 'rows', label: '返回/影响行数' }, { key: 'resultMessage', label: '执行结果' }, { key: 'error', label: '错误信息' }
    ]
  });
}());
