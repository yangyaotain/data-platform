/** 控制台 / 日志管理 / 操作日志。 */
window.DP = window.DP || {};
DP.pages = DP.pages || {};
DP.pages.operationLog = (function () {
  'use strict';
  var view = DP.logView;
  var definitions = {
    project: ['控制台', '项目管理', '[项目管理列表查询] 项目状态(1=进行中的项目 2=待启动项目 3=已结束项目)：1；项目名称：全部', '/myconsole-api/projectManage/getProjectPage', { status: 1, pageNum: 1, pageSize: 10 }],
    deleteFlow: ['数据开发', '数据开发', '[业务流程删除] 业务流程名字：flinkcdc演示；项目：数据中台项目', '/project-dev-api/busi-flow/del-busi', { projectId: 'data-platform', flowId: 'flow-flinkcdc-demo' }],
    createFlow: ['数据开发', '数据开发', '[创建子流程] 流程名称：新建子流程；所属流程：订单数据加工', '/project-dev-api/sub-flow/create', { flowId: 'flow-batch', name: '新建子流程', type: 'SQL' }],
    standard: ['数据资产', '数据标准', '[申请审核数据标准] 操作类型(2=发布待审核 5=取消待审核)：2；标准名称：统一社会信用代码', '/metadata/standard-model/dataaudit', { standardId: 'STD00018', operationType: 2, reason: '统一企业标识字段口径' }],
    flowConfig: ['控制台', '流程配置', '查询[流程配置]；流程管理列表查询', '/myconsole-api/processConfig/getList', { keyword: '', pageNum: 1, pageSize: 10 }],
    source: ['数据资产', '数据源', '[数据源连接测试] 数据源名称：prod_mysql_master；连接结果：成功', '/metadata/datasource/testConnection', { datasourceId: 'DS001', datasourceName: 'prod_mysql_master' }],
    metadata: ['数据资产', '元数据管理', '[元数据搜索] 搜索关键词：订单；元数据类型：数据表', '/metadata/search/query', { keyword: '订单', type: 'table', pageNum: 1 }],
    rule: ['数据治理', '质量规则', '[质量规则保存] 规则名称：订单金额范围校验；保存方式：另存新版本；版本：V1.4', '/quality/rule/save', { ruleId: 'QR003', saveMode: 'newVersion', version: 'V1.4' }],
    task: ['数据治理', '任务配置', '[稽查任务参数配置] 任务名称：订单明细完整性稽查；数据表：dwd_order_detail_di', '/quality/task/saveParams', { taskId: 'QT018', table: 'dwd_order_detail_di', ruleVersion: 'V1.4' }],
    api: ['数据服务', '接口开发', '[接口保存] 接口名称：客户订单查询；请求方式：GET', '/data-service/api/save', { apiId: 'API0012', name: '客户订单查询', method: 'GET' }],
    explore: ['数据探索', '数据探索', '[SQL查询] 数据源：hive_warehouse；数据库：zz_tms_dwd；执行状态：成功', '/data-explore/query/execute', { executionId: 'SQL202609030008', datasource: 'hive_warehouse', database: 'zz_tms_dwd' }]
  };
  var seeds = [
    ['2026-09-04 10:56:14', 'project'],
    ['2026-09-03 13:46:17', 'project'],
    ['2026-09-03 13:45:29', 'deleteFlow'],
    ['2026-09-03 13:41:22', 'createFlow'],
    ['2026-09-03 13:41:09', 'project'],
    ['2026-09-03 11:23:05', 'standard'],
    ['2026-09-03 11:22:44', 'standard'],
    ['2026-09-03 11:22:03', 'flowConfig'],
    ['2026-09-03 11:21:33', 'project'],
    ['2026-09-01 15:05:00', 'createFlow'],
    ['2026-09-01 14:52:30', 'source', 1],
    ['2026-09-01 14:30:18', 'metadata', 2],
    ['2026-09-01 13:42:09', 'rule', 3],
    ['2026-09-01 11:32:06', 'task', 3],
    ['2026-09-01 10:40:21', 'api', 1],
    ['2026-09-01 09:18:42', 'explore', 2],
    ['2026-08-31 17:25:08', 'project', 1],
    ['2026-08-31 16:14:37', 'standard', 3],
    ['2026-08-31 15:38:24', 'source', 1],
    ['2026-08-31 14:50:02', 'flowConfig', 0],
    ['2026-08-31 11:42:18', 'api', 1],
    ['2026-08-31 10:18:54', 'rule', 3],
    ['2026-08-31 09:24:16', 'metadata', 2],
    ['2026-08-30 16:35:11', 'task', 3],
    ['2026-08-30 15:42:07', 'explore', 2],
    ['2026-08-30 14:26:33', 'createFlow', 1],
    ['2026-08-30 11:08:25', 'project', 0],
    ['2026-08-30 09:32:18', 'source', 1]
  ];
  var users = [['present', '演示'], ['dev_wangwu', '王五'], ['analyst_lisi', '李四'], ['quality_zhangsan', '张三']];
  var records = seeds.map(function (seed, i) {
    var data = definitions[seed[1]], user = users[seed[2] || 0];
    var params = JSON.stringify(data[4], null, 2);
    return { id: 'OP202609' + String(100028 - i), time: seed[0], system: data[0], module: data[1], user: user[0], name: user[1],
      ip: (seed[2] ? '10.244.0.' + (20 + seed[2]) : '10.244.0.0') + ':' + (data[0] === '数据开发' ? '31602' : data[0] === '数据资产' ? '30301' : '30333'),
      content: data[2], path: data[3], params: params, request: data[3] + '\n' + params };
  });
  function choices(values) { return Array.from(new Set(values)).map(function (value) { return { label: value, value: value }; }); }
  function detailCell(row, text) {
    return '<button type="button" class="lm-cell-link" data-lm-action="detail" data-id="' + row.id + '" title="' + view.esc(text) + '"><i class="bi bi-file-text" aria-hidden="true"></i><span class="lm-truncate">' + view.esc(text) + '</span></button>';
  }
  return view.create({
    kind: 'operation', title: '操作日志', records: records,
    filters: [
      { key: 'system', label: '系统模块', options: choices(records.map(function (r) { return r.system; })) },
      { key: 'module', label: '操作模块', parent: 'system', options: function (filters) { return choices(records.filter(function (r) { return !filters.system || r.system === filters.system; }).map(function (r) { return r.module; })); } },
      { key: 'queryType', label: '查询类型', options: [
        { value: 'user', label: '用户账号' }, { value: 'name', label: '用户姓名' }, { value: 'ip', label: '用户IP地址及端口' },
        { value: 'content', label: '操作内容' }, { value: 'request', label: '请求参数' }
      ] }
    ],
    keywordPlaceholder: '请输入关键词', timeLabel: '操作时间', keywordKeys: ['user', 'name', 'ip', 'content', 'request'],
    columns: [
      { key: 'time', label: '操作时间', width: 164 }, { key: 'module', label: '操作模块', width: 104 },
      { key: 'user', label: '用户账号', width: 128 }, { key: 'name', label: '用户姓名', width: 84 },
      { key: 'ip', label: '用户IP地址及端口', width: 164 },
      { key: 'content', label: '操作内容', width: 320, render: function (row) { return detailCell(row, row.content); } },
      { key: 'request', label: '请求参数', width: 340, render: function (row) { return detailCell(row, row.path); } }
    ],
    exportColumns: [
      { key: 'time', label: '操作时间' }, { key: 'module', label: '操作模块' },
      { key: 'user', label: '用户账号' }, { key: 'name', label: '用户姓名' },
      { key: 'ip', label: '用户IP地址及端口' }, { key: 'content', label: '操作内容' },
      { key: 'request', label: '请求参数' }
    ],
    detail: function (row) {
      return view.fields('操作信息', [['操作时间', row.time], ['系统模块', row.system], ['操作模块', row.module], ['用户账号', row.user], ['用户姓名', row.name], ['用户IP地址及端口', row.ip]]) +
        view.content('操作内容', row.content) + view.content('请求地址', row.path) + view.content('请求参数', row.params);
    }
  });
}());
