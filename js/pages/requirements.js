/** 监控项关键点说明：指标要求、消息项、模板与示例。 */
window.DP = window.DP || {};
DP.pages = DP.pages || {};
DP.pages.requirements = (function () {
  'use strict';
  var previousTitle;
  var commonVariables = ['监控项名称', '类型', '等级', '描述', '告警时间'];
  var groups = [
    {
      title: '任务流程监控说明',
      rules: [
        [['task', 'flow', 'version'], '文本框；'],
        [['project'], '项目下拉框，单选；'],
        [['environment'], '下拉框（开发环境／测试环境／生产环境），默认开发环境；'],
        [['flowType'], '下拉框（业务流程／流式数据采集流程／流式处理流程／数据采集／数据同步(flink-cdc)）；'],
        [['result'], '下拉框（成功／失败／异常）；'],
        [['duration'], '数字框，单位下拉框（秒钟／分钟／小时），默认分钟；'],
        [['readRecords', 'writeRecords'], '数字框，非负整数，单位：记录数；'],
        [['startTime', 'endTime'], '周期下拉框（每分钟／每小时／每天／每周／每月），联动选择分、秒或日期及时分秒。']
      ],
      variables: ['项目名称', '环境', '任务名称', '版本', '流程名称', '流程类型', '执行结果', '任务运行时长', '读取记录数', '写入记录数', '任务开始时间', '任务结束时间'],
      template: '【等级】【项目名称】的【环境】中，【任务名称】【版本】的【流程名称】执行结果为【执行结果】，告警时间：【告警时间】，请及时处理。',
      example: '严重，交易数据治理的生产环境中，订单增量采集V1.2的订单明细入仓执行结果为失败，告警时间：2026-09-07 09:03:00，请及时处理。'
    },
    {
      title: '接口监控说明',
      rules: [
        [['apiName'], '下拉搜索，单选；'],
        [['apiResponse'], '数字框，允许非负小数，单位：秒；'],
        [['apiConcurrency'], '数字框，非负整数，单位：记录数；'],
        [['apiStatus'], '下拉框（成功／失败）。']
      ],
      variables: ['接口名称', '接口响应时间', '接口并发数', '接口调用状态'],
      template: '【等级】接口【接口名称】响应时间为【接口响应时间】，大于0.8秒，告警时间：【告警时间】，请及时处理。',
      example: '重要，接口会员信息查询响应时间为0.96秒，大于0.8秒，告警时间：2026-09-07 09:03:00，请及时处理。'
    },
    {
      title: '计划调度监控说明',
      rules: [
        [['planStatus'], '下拉框（正常／异常）；正常表示计划状态与运行状态一致，异常表示不一致；'],
        [['scheduleTimeout', 'averageDeviation'], '数字框，单位下拉框（秒钟／分钟／小时），默认分钟；大于不含阈值，不小于包含阈值。']
      ],
      variables: ['计划监控状态', '调度超时时间', '平均执行时间偏差'],
      template: '【等级】【任务名称】的计划监控状态为【计划监控状态】，告警时间：【告警时间】，请检查调度计划及运行实例。',
      example: '紧急，交易日汇总的计划监控状态为异常（计划状态与运行状态不一致），告警时间：2026-09-07 09:03:00，请检查调度计划及运行实例。'
    },
    {
      title: '表结构变更监控说明',
      rules: [
        [['tableChanged'], '下拉框（是／否）；'],
        [['database'], '可搜索下拉目录树，选择数据库；'],
        [['table'], '先选数据库，再选择所属表，单选；切换数据库后清空已选表。']
      ],
      variables: ['数据库', '表', '表结构变更'],
      template: '【等级】数据库【数据库】中的【表】发生表结构变更，告警时间：【告警时间】，请核对采集映射和下游依赖。',
      example: '严重，数据库ODS-贴源层／订单采集库中的order_main发生表结构变更，告警时间：2026-09-07 09:03:00，请核对采集映射和下游依赖。'
    },
    {
      title: '数据资产—质量任务监控说明',
      rules: [
        [['qualityTask'], '下拉搜索，多选；'],
        [['qualityScore'], '数字框，单位：%，取值0–100，允许小数；'],
        [['qualityStatus'], '下拉框（成功／失败）。']
      ],
      variables: ['质量任务名称', '质量任务状态', '符合质量规则比例', '质量稽查表', '质量稽查字段', '质量稽查规则'],
      template: '【等级】【质量任务名称】的质量稽查报告结果为【符合质量规则比例】，小于80%，请及时处理；告警时间：【告警时间】；稽查内容：【质量稽查表】的【质量稽查字段】字段，规则：【质量稽查规则】。',
      example: '严重，订单号唯一性稽查的质量稽查报告结果为62.66%，小于80%，请及时处理；告警时间：2026-09-07 09:03:00；稽查内容：dwd_order_detail_di的order_id字段，规则：订单号唯一性。'
    },
    {
      title: '项目开发—流程质量节点监控说明',
      rules: [
        [['qualityNode'], '下拉搜索，多选；'],
        [['qualityResult'], '数字框，按节点输出数值比较。']
      ],
      variables: ['质量节点名称', '质量节点结果'],
      template: '【等级】【项目名称】的【环境】中，【任务名称】【版本】的【质量节点名称】结果为【质量节点结果】，小于100，请及时处理；告警时间：【告警时间】。',
      example: '重要，交易数据治理的生产环境中，订单增量采集V1.2的订单采集记录监控结果为20，小于100，请及时处理；告警时间：2026-09-07 09:03:00。'
    },
    {
      title: '大数据量下载监控说明',
      rules: [[['downloadRows'], '数字框，正整数，单位：条；按单次下载条数判断，等于阈值不触发。']],
      variables: ['用户账号', '用户姓名', '访问IP', '访问资源', '访问时间', '下载条数', '下载阈值'],
      template: '【等级】用户【用户姓名】（【用户账号】）于【访问时间】从【访问IP】下载【访问资源】，共【下载条数】条，大于阈值【下载阈值】条，请核实。',
      example: '严重，用户陈晓（trade_analyst）于2026-09-07 20:30:00从10.20.30.18下载交易明细数据集，共120000条，大于阈值100000条，请核实。'
    },
    {
      title: '非常规时间访问监控说明',
      rules: [[['accessWindow'], '时间范围，按每天、北京时间配置；默认08:00:00–18:00:00，含开始、不含结束；支持跨午夜，起止时间不能相同。']],
      variables: ['用户账号', '用户姓名', '访问IP', '访问资源', '访问时间', '常规访问时段'],
      template: '【等级】用户【用户姓名】（【用户账号】）于【访问时间】从【访问IP】访问【访问资源】，不在常规访问时段【常规访问时段】内，请核实。',
      example: '重要，用户陈晓（trade_analyst）于2026-09-07 20:30:00从10.20.30.18访问交易明细数据集，不在每天08:00:00–18:00:00（北京时间）的常规访问时段内，请核实。'
    }
  ];
  function esc(value) { return String(value).replace(/[&<>"']/g, function (s) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[s]; }); }
  function messageVariables(names) { return names.map(function (name) { return '<span data-message-variable="' + esc(name) + '">' + esc(name) + '</span>'; }).join('、'); }
  function content() {
    var spec = DP.pages.monitorItems.describe();
    return '<article class="rd-document" id="rd-monitor-items"><h1>监控项说明</h1><p><strong>规则关系：</strong>最多两层分组，默认“且”，同组关系统一，可切换“且／或”。</p><p><strong>通用消息项：</strong>' + messageVariables(commonVariables) + '。</p>' + groups.map(function (group) {
      return '<section class="rd-section"><h2>' + group.title + '</h2><p class="rd-subtitle">1、监控规则：</p><div class="rd-rules">' + group.rules.map(function (row) {
        var fields = row[0].map(function (key) { return spec.fields.find(function (field) { return field.key === key; }); });
        return '<p>' + fields.map(function (field) { return '<span data-metric-key="' + field.key + '">' + esc(field.label) + '</span>'; }).join('／') + '：' + esc(fields[0].operators.map(function (op) { return op.label; }).join('／')) + '—' + esc(row[1]) + '</p>';
      }).join('') + '</div><p class="rd-subtitle">2、监控消息：</p><p>消息项：' + messageVariables(group.variables) + '。</p><p class="rd-message"><strong>模板：</strong>' + esc(group.template) + '</p><p class="rd-message"><strong>示例：</strong>' + esc(group.example) + '</p></section>';
    }).join('') + '</article>';
  }
  function destroy() {
    if (previousTitle) document.title = previousTitle;
    previousTitle = null;
  }
  function init() {
    destroy();
    var container = DP.contentArea;
    container.querySelector('.page-requirements').innerHTML = content();
    container.scrollTop = 0;
    previousTitle = document.title; document.title = '监控项说明 · 数据中台 V4.0';
    var menu = document.querySelector('#menuRequirements .menu-item'); if (menu) menu.classList.add('open');
    document.querySelectorAll('#menuRequirements [data-menu]').forEach(function (link) {
      var active = link.dataset.menu === 'requirements-monitor-items';
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'page'); else link.removeAttribute('aria-current');
    });
    // 旧章节链接仍可打开本文，统一归入监控项入口。
    if (DP.rememberRoute) DP.rememberRoute('requirements-monitor-items', 'requirements');
  }
  return { html: '<div class="page-requirements"></div>', init: init, destroy: destroy, content: content };
}());
