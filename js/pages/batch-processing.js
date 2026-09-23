/** 运维监控 / 运维管理 / 批量处理。 */
window.DP = window.DP || {};
DP.pages = DP.pages || {};

DP.pages.batchProcessing = (function () {
  'use strict';

  var pageEl = null;
  var toastTimer = null;
  var state = {
    view: 'list', detailTaskId: '', detailTab: 'history', dependencyDirection: 'all', dependencySelected: [], dependencyMechanism: '', dependencyParamPage: 1, recordRange: 'day',
    listRange: 'day', progressRange: 'day', listMore: false, listPage: 1, pageSize: 10,
    sortKey: 'lastTime', sortDir: 'desc', selected: [], devColumns: null,
    filters: { attribute: '', status: '', lastStatus: '', keyword: '', project: '', env: '', scheduleType: '', monitor: '' },
    progressFilters: { project: '', env: '', status: '', keyword: '' },
    devFilters: { scheduled: '', flowType: '', status: '', project: '', keyword: '' }
  };

  var tasks = [
    { id: 701, name: '门店每日销售指标', attribute: '业务流程', version: 'V3', project: '零售交易数仓', env: '生产环境', plan: '已启动', status: '已启动', fail: 1, total: 168, owner: '周海宁', lastStatus: '执行失败', lastTime: '2026-09-22 08:45:31', duration: '12分16秒', params: '--', schedule: '每天 08:30:00 失败重试:3次 重试间隔:300秒', scheduleType: '周期调度', monitor: '已监控' },
    { id: 702, name: '会员画像标签日更新', attribute: '业务流程', version: 'V5', project: '会员画像中心', env: '生产环境', plan: '已启动', status: '已启动', fail: 0, total: 214, owner: '林晓楠', lastStatus: '执行成功', lastTime: '2026-09-22 07:21:08', duration: '8分42秒', params: 'biz_date=${yesterday}', schedule: '每天 07:10:00 失败重试:2次 重试间隔:180秒', scheduleType: '周期调度', monitor: '已监控' },
    { id: 703, name: '区域库存快照汇总', attribute: '业务流程', version: 'V2', project: '供应链协同分析', env: '生产环境', plan: '已启动', status: '运行中', fail: 2, total: 182, owner: '陈博远', lastStatus: '执行中', lastTime: '2026-09-22 10:05:12', duration: '进行中', params: 'region=ALL', schedule: '每2小时 05分执行 失败重试:2次', scheduleType: '周期调度', monitor: '已监控' },
    { id: 704, name: '渠道结算差异核验', attribute: '任务', version: 'V4', project: '财务结算分析', env: '生产环境', plan: '已启动', status: '已启动', fail: 0, total: 96, owner: '高雪', lastStatus: '执行成功', lastTime: '2026-09-22 06:36:54', duration: '5分38秒', params: 'channel=ALL', schedule: '每天 06:30:00 失败重试:3次 重试间隔:120秒', scheduleType: '周期调度', monitor: '已监控' },
    { id: 705, name: '商品主数据全量加工', attribute: '业务流程', version: 'V6', project: '零售交易数仓', env: '测试环境', plan: '未启动', status: '已停止', fail: 3, total: 42, owner: '王思远', lastStatus: '执行失败', lastTime: '2026-09-21 23:18:03', duration: '18分26秒', params: 'mode=full', schedule: '每天 23:00:00 失败重试:1次', scheduleType: '周期调度', monitor: '未监控' },
    { id: 706, name: '供应商履约评分计算', attribute: '任务', version: 'V2', project: '供应链协同分析', env: '生产环境', plan: '已启动', status: '已启动', fail: 0, total: 73, owner: '赵嘉成', lastStatus: '执行成功', lastTime: '2026-09-22 09:16:20', duration: '6分09秒', params: 'month=202609', schedule: '每月1日 09:00:00 失败重试:2次', scheduleType: '周期调度', monitor: '已监控' },
    { id: 707, name: '物流轨迹异常明细', attribute: '业务流程', version: 'V4', project: '供应链协同分析', env: '生产环境', plan: '已启动', status: '已启动', fail: 1, total: 305, owner: '何安琪', lastStatus: '执行成功', lastTime: '2026-09-22 10:20:44', duration: '3分41秒', params: 'window=2h', schedule: '每30分钟执行 失败重试:2次', scheduleType: '周期调度', monitor: '已监控' },
    { id: 708, name: '客户服务工单宽表', attribute: '任务', version: 'V2', project: '会员画像中心', env: '测试环境', plan: '未启动', status: '已停止', fail: 0, total: 16, owner: '徐可欣', lastStatus: '等待执行', lastTime: '2026-09-22 11:00:00', duration: '--', params: 'tenant=retail', schedule: '手动触发', scheduleType: '手动调度', monitor: '未监控' },
    { id: 709, name: '支付结果日终归集', attribute: '业务流程', version: 'V3', project: '财务结算分析', env: '生产环境', plan: '已启动', status: '已启动', fail: 0, total: 190, owner: '宋致远', lastStatus: '执行成功', lastTime: '2026-09-22 02:12:37', duration: '9分55秒', params: 'biz_date=${yesterday}', schedule: '每天 02:00:00 失败重试:3次 重试间隔:300秒', scheduleType: '周期调度', monitor: '已监控' },
    { id: 710, name: '营销券核销汇总', attribute: '任务', version: 'V1', project: '零售交易数仓', env: '开发环境', plan: '未启动', status: '已停止', fail: 1, total: 11, owner: '姚清', lastStatus: '执行失败', lastTime: '2026-09-20 16:43:02', duration: '2分38秒', params: 'campaign=ALL', schedule: '手动触发', scheduleType: '手动调度', monitor: '未监控' },
    { id: 711, name: '门店经营日报发布', attribute: '业务流程', version: 'V7', project: '零售交易数仓', env: '生产环境', plan: '已启动', status: '已启动', fail: 0, total: 365, owner: '周海宁', lastStatus: '执行成功', lastTime: '2026-09-22 09:02:16', duration: '4分18秒', params: 'scope=store', schedule: '每天 08:55:00 失败重试:2次', scheduleType: '周期调度', monitor: '已监控' },
    { id: 712, name: '会员流失预警样本', attribute: '任务', version: 'V3', project: '会员画像中心', env: '生产环境', plan: '已启动', status: '已启动', fail: 0, total: 58, owner: '林晓楠', lastStatus: '执行成功', lastTime: '2026-09-22 04:27:40', duration: '14分03秒', params: 'sample_days=30', schedule: '每周一 04:10:00 失败重试:2次', scheduleType: '周期调度', monitor: '已监控' }
  ];

  var progressRows = [
    { id: 701, name: '门店每日销售指标', left: 8, width: 18, status: 'failed', caption: '08:45 - 08:57' },
    { id: 702, name: '会员画像标签日更新', left: 19, width: 14, status: 'success', caption: '07:21 - 07:30' },
    { id: 703, name: '区域库存快照汇总', left: 46, width: 24, status: 'running', caption: '10:05 - 执行中' },
    { id: 704, name: '渠道结算差异核验', left: 13, width: 11, status: 'success', caption: '06:36 - 06:42' },
    { id: 706, name: '供应商履约评分计算', left: 34, width: 13, status: 'success', caption: '09:16 - 09:22' },
    { id: 707, name: '物流轨迹异常明细', left: 57, width: 9, status: 'success', caption: '10:20 - 10:24' },
    { id: 709, name: '支付结果日终归集', left: 2, width: 16, status: 'success', caption: '02:12 - 02:22' },
    { id: 711, name: '门店经营日报发布', left: 28, width: 10, status: 'success', caption: '09:02 - 09:06' }
  ];

  var devRows = [
    { id: 22031, sourceDbId: '872', sourceDb: '零售交易业务库', sourceTable: 't_store_info', targetDbId: '902', targetDb: 'StarRocks生产集群', targetTable: 'ods_store_info_df', flowName: '门店基础信息入仓', flowType: '数据采集', project: '零售交易数仓', projectOwner: '周海宁', readUrl: 'jdbc:mysql://10.31.8.21:3306/retail', writeUrl: 'jdbc:mysql://10.31.9.16:9030/dw_retail', readAccount: 'etl_reader', writeAccount: 'dw_writer', layer: 'ODS', flowOwner: '周海宁', scheduled: '已调度', status: '执行成功', time: '2026-09-22 10:32:18' },
    { id: 22030, sourceDbId: '--', sourceDb: '--', sourceTable: '--', targetDbId: '--', targetDb: '--', targetTable: 'ads_store_daily_sales_df', flowName: '门店每日销售指标', flowType: '在线编程(SQL)', project: '零售交易数仓', projectOwner: '周海宁', readUrl: '--', writeUrl: '--', readAccount: '--', writeAccount: '--', layer: 'ADS', flowOwner: '周海宁', scheduled: '已调度', status: '执行失败', time: '2026-09-22 08:45:31' },
    { id: 22029, sourceDbId: '--', sourceDb: '--', sourceTable: '--', targetDbId: '--', targetDb: '--', targetTable: 'dws_member_profile_df', flowName: '会员画像标签日更新', flowType: '在线编程(SQL)', project: '会员画像中心', projectOwner: '林晓楠', readUrl: '--', writeUrl: '--', readAccount: '--', writeAccount: '--', layer: 'DWS', flowOwner: '林晓楠', scheduled: '已调度', status: '执行成功', time: '2026-09-22 07:21:08' },
    { id: 22028, sourceDbId: '881', sourceDb: '供应链业务库', sourceTable: 't_inventory_snapshot', targetDbId: '902', targetDb: 'StarRocks生产集群', targetTable: 'ods_inventory_snapshot_hf', flowName: '区域库存快照汇总', flowType: '数据采集', project: '供应链协同分析', projectOwner: '陈博远', readUrl: 'jdbc:mysql://10.32.6.18:3306/scm', writeUrl: 'jdbc:mysql://10.31.9.16:9030/dw_supply', readAccount: 'scm_reader', writeAccount: 'dw_writer', layer: 'ODS', flowOwner: '陈博远', scheduled: '已调度', status: '执行中', time: '2026-09-22 10:05:12' },
    { id: 22027, sourceDbId: '--', sourceDb: '--', sourceTable: '--', targetDbId: '--', targetDb: '--', targetTable: 'dwd_settlement_diff_di', flowName: '渠道结算差异核验', flowType: '在线编程(SQL)', project: '财务结算分析', projectOwner: '高雪', readUrl: '--', writeUrl: '--', readAccount: '--', writeAccount: '--', layer: 'DWD', flowOwner: '高雪', scheduled: '已调度', status: '执行成功', time: '2026-09-22 06:36:54' },
    { id: 22026, sourceDbId: '893', sourceDb: '物流轨迹库', sourceTable: 't_logistics_track', targetDbId: '902', targetDb: 'StarRocks生产集群', targetTable: 'ods_logistics_track_di', flowName: '物流轨迹异常明细', flowType: '数据采集', project: '供应链协同分析', projectOwner: '何安琪', readUrl: 'jdbc:mysql://10.33.7.12:3306/logistics', writeUrl: 'jdbc:mysql://10.31.9.16:9030/dw_supply', readAccount: 'log_reader', writeAccount: 'dw_writer', layer: 'ODS', flowOwner: '何安琪', scheduled: '已调度', status: '执行成功', time: '2026-09-22 10:20:44' }
  ];

  var devColumns = [
    ['id', '执行ID'], ['sourceDbId', '源库dbId'], ['sourceDb', '源库'], ['sourceTable', '源表'], ['targetDbId', '目标库dbId'], ['targetDb', '目标库'], ['targetTable', '目标表'], ['flowName', '流程名称'], ['flowType', '流程类型'], ['project', '项目名称'], ['projectOwner', '项目创建人'], ['readUrl', '读数据源URL'], ['writeUrl', '写数据源URL'], ['readAccount', '读数据源账号'], ['writeAccount', '写数据源账号'], ['layer', '业务流程'], ['flowOwner', '流程创建人'], ['scheduled', '流程是否启用'], ['status', '执行状态'], ['time', '执行时间']
  ];

  function esc(value) { return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function option(value, label, selected) { return '<option value="' + esc(value) + '"' + (selected === value ? ' selected' : '') + '>' + esc(label) + '</option>'; }
  function unique(key) { return tasks.map(function (item) { return item[key]; }).filter(function (item, index, list) { return list.indexOf(item) === index; }); }
  function status(value) {
    var cls = /成功|已启动|已调度/.test(value) ? 'success' : (/失败|停止|未启动/.test(value) ? 'failed' : (/执行中|运行中/.test(value) ? 'running' : 'waiting'));
    return '<span class="bp-status ' + cls + '">' + esc(value) + '</span>';
  }
  function button(icon, text, attrs, cls) { return '<button type="button" class="' + (cls || '') + '" ' + (attrs || '') + '><i class="bi bi-' + icon + '"></i><span>' + text + '</span></button>'; }
  function datePicker(prefix, start, end) { return DP.datePicker.render({ mode: 'range', label: '执行时间范围', output: 'datetime', start: start, end: end, startAttrs: { 'data-bp-date': prefix + '-start' }, endAttrs: { 'data-bp-date': prefix + '-end' } }); }
  function tabs() {
    return '<div class="bp-tabs" role="tablist">' + [['list','任务列表'],['progress','任务进度'],['dev','开发监控']].map(function (item) {
      return '<button type="button" role="tab" aria-selected="' + (state.view === item[0]) + '" class="' + (state.view === item[0] ? 'active' : '') + '" data-bp-view="' + item[0] + '">' + item[1] + '</button>';
    }).join('') + '</div>';
  }
  function quickRange(current, prefix, values) {
    return '<div class="bp-quick-range" role="group" aria-label="时间范围">' + values.map(function (item) { return '<button type="button" class="' + (current === item[0] ? 'active' : '') + '" data-bp-range="' + prefix + ':' + item[0] + '">' + item[1] + '</button>'; }).join('') + '</div>';
  }

  function render() {
    if (!pageEl) return;
    if (DP.developmentCanvas) DP.developmentCanvas.destroyAll(pageEl);
    if (state.detailTaskId) pageEl.innerHTML = detailHtml(findTask(state.detailTaskId));
    else pageEl.innerHTML = '<div class="bp-shell">' + tabs() + (state.view === 'progress' ? progressHtml() : (state.view === 'dev' ? devHtml() : listHtml())) + '</div>' + modalHtml() + '<div class="bp-toast" data-bp-toast role="status"></div>';
    if (DP.developmentCanvas) DP.developmentCanvas.mountAll(pageEl);
  }

  function listHtml() {
    var projectOptions = '<option value="">请选择</option>' + unique('project').map(function (item) { return option(item,item,state.filters.project); }).join('');
    var envOptions = '<option value="">请选择</option>' + ['生产环境','测试环境','开发环境'].map(function (item) { return option(item,item,state.filters.env); }).join('');
    var rows = filteredTasks();
    var start = (state.listPage - 1) * state.pageSize;
    var visible = rows.slice(start, start + state.pageSize);
    return '<div class="bp-toolbar">' +
      button('arrow-repeat','批量重跑','data-bp-action="bulk-rerun"' + (state.selected.length ? '' : ' disabled'),'btn btn-primary') +
      button('toggle-on','计划状态','data-bp-action="plan-status"' + (state.selected.length ? '' : ' disabled'),'btn btn-primary') +
      button('arrow-clockwise','状态刷新','data-bp-action="refresh"','btn btn-primary') + '</div>' +
      '<form class="bp-filter" data-bp-form="list">' +
        quickRange(state.listRange,'list',[['day','近1天'],['week','近7天'],['month','近30天'],['all','全部']]) +
        '<div class="bp-date">' + datePicker('list','2026-09-21 00:00:00','2026-09-22 23:59:59') + '</div>' +
        '<label><span>属性</span><select data-bp-filter="attribute"><option value="">全部</option>' + option('业务流程','业务流程',state.filters.attribute) + option('任务','任务',state.filters.attribute) + '</select></label>' +
        '<label><span>状态</span><select data-bp-filter="status"><option value="">全部</option>' + ['已启动','运行中','已停止'].map(function (item) { return option(item,item,state.filters.status); }).join('') + '</select></label>' +
        '<label><span>最后执行状态</span><select data-bp-filter="lastStatus"><option value="">全部</option>' + ['执行成功','执行失败','执行中','等待执行'].map(function (item) { return option(item,item,state.filters.lastStatus); }).join('') + '</select></label>' +
        '<label class="bp-keyword"><span class="sr-only">名称关键词</span><input type="text" placeholder="名称关键词" value="' + esc(state.filters.keyword) + '" data-bp-filter="keyword"></label>' +
        '<div class="bp-filter-extra"' + (state.listMore ? '' : ' hidden') + '><label class="bp-project"><span>项目</span><select data-bp-filter="project">' + projectOptions + '</select></label><label><span>环境</span><select data-bp-filter="env">' + envOptions + '</select></label><label><span>调度类型</span><select data-bp-filter="scheduleType"><option value="">全部</option>' + option('周期调度','周期调度',state.filters.scheduleType) + option('手动调度','手动调度',state.filters.scheduleType) + '</select></label><label><span>计划监控</span><select data-bp-filter="monitor"><option value="">请选择</option>' + option('已监控','已监控',state.filters.monitor) + option('未监控','未监控',state.filters.monitor) + '</select></label></div>' +
        '<div class="bp-filter-actions"><button type="submit" class="btn btn-primary"><i class="bi bi-search"></i><span>查询</span></button><button type="button" class="bp-more-link" data-bp-action="more"><i class="bi bi-' + (state.listMore ? 'chevron-up' : 'chevron-down') + '"></i><span>' + (state.listMore ? '收起' : '更多') + '</span></button></div>' +
      '</form><div class="bp-table-wrap"><table class="ds-table bp-table"><thead>' + listHeader() + '</thead><tbody>' + (visible.length ? visible.map(listRow).join('') : '<tr><td colspan="16"><div class="bp-empty"><i class="bi bi-inbox"></i><span>暂无符合条件的任务</span></div></td></tr>') + '</tbody></table></div>' + pagination(rows.length);
  }

  function listHeader() {
    var columns = [['name','任务名称'],['attribute','属性'],['version','版本'],['ownerText','归属'],['plan','计划状态'],['status','状态'],['fail','失败次数'],['total','执行总数'],['owner','最后执行人'],['lastStatus','最后执行状态'],['lastTime','最后执行时间'],['duration','最后执行时长']];
    return '<tr><th><input type="checkbox" data-bp-select-all aria-label="全选任务"' + (state.selected.length === filteredTasks().length && filteredTasks().length ? ' checked' : '') + '></th>' + columns.map(function (column) { var active = state.sortKey === column[0]; return '<th><button type="button" class="bp-sort' + (active ? ' active' : '') + '" data-bp-sort="' + column[0] + '"><span>' + column[1] + '</span><i class="bi bi-' + (active && state.sortDir === 'asc' ? 'sort-up' : 'sort-down') + '"></i></button></th>'; }).join('') + '<th>调度参数</th><th>调度时间配置</th><th class="bp-action-col">操作</th></tr>';
  }
  function listRow(row) {
    return '<tr><td><input type="checkbox" data-bp-select="' + row.id + '" aria-label="选择' + esc(row.name) + '"' + (state.selected.indexOf(row.id) >= 0 ? ' checked' : '') + '></td>' +
      '<td title="' + esc(row.name) + '">' + esc(row.name) + '</td><td>' + row.attribute + '</td><td>' + row.version + '</td><td title="' + esc(row.project + '-' + row.env) + '">' + esc(row.project + '-' + row.env) + '</td><td>' + status(row.plan) + '</td><td>' + status(row.status) + '</td><td>' + row.fail + '</td><td>' + row.total + '</td><td>' + row.owner + '</td><td>' + status(row.lastStatus) + '</td><td>' + row.lastTime + '</td><td>' + row.duration + '</td><td title="' + esc(row.params) + '">' + esc(row.params) + '</td><td title="' + esc(row.schedule) + '">' + esc(row.schedule) + '</td><td class="bp-action-col"><div class="bp-row-actions">' +
      button('file-earmark-text','查看','data-bp-row-action="view" data-id="' + row.id + '"') + button('pencil-square','编辑','data-bp-row-action="edit" data-id="' + row.id + '"') + button('calendar2-week','调度管理','data-bp-row-action="schedule" data-id="' + row.id + '"') + '</div></td></tr>';
  }
  function filteredTasks() {
    var f = state.filters, key = (f.keyword || '').toLowerCase();
    return tasks.filter(function (row) {
      return (!f.attribute || row.attribute === f.attribute) && (!f.status || row.status === f.status) && (!f.lastStatus || row.lastStatus === f.lastStatus) && (!f.project || row.project === f.project) && (!f.env || row.env === f.env) && (!f.scheduleType || row.scheduleType === f.scheduleType) && (!f.monitor || row.monitor === f.monitor) && (!key || (row.name + row.project + row.owner).toLowerCase().indexOf(key) >= 0);
    }).sort(function (a,b) { var left = state.sortKey === 'ownerText' ? a.project + a.env : a[state.sortKey]; var right = state.sortKey === 'ownerText' ? b.project + b.env : b[state.sortKey]; if (left === right) return 0; var result = left > right ? 1 : -1; return state.sortDir === 'asc' ? result : -result; });
  }
  function pagination(total) {
    var pages = Math.max(1,Math.ceil(total/state.pageSize)); if (state.listPage > pages) state.listPage = pages;
    var start = total ? (state.listPage-1)*state.pageSize+1 : 0, end = Math.min(state.listPage*state.pageSize,total);
    return '<div class="bp-pagination"><span>第' + start + '到第' + end + '条，共' + total + '条数据</span><div class="bp-page-nav"><button type="button" data-bp-page="prev"' + (state.listPage === 1 ? ' disabled' : '') + '><i class="bi bi-chevron-left"></i><span>上一页</span></button><button type="button" class="active" data-bp-page="' + state.listPage + '">' + state.listPage + '</button><button type="button" data-bp-page="next"' + (state.listPage === pages ? ' disabled' : '') + '><i class="bi bi-chevron-right"></i><span>下一页</span></button></div><select data-bp-page-size aria-label="每页条数"><option value="10"' + (state.pageSize===10?' selected':'') + '>10 条/页</option><option value="20"' + (state.pageSize===20?' selected':'') + '>20 条/页</option></select><label>跳至 <input type="number" min="1" max="' + pages + '" value="' + state.listPage + '" data-bp-jump> 页</label></div>';
  }

  function progressHtml() {
    var projectOptions = '<option value="">请选择</option>' + unique('project').map(function (item) { return option(item,item,state.progressFilters.project); }).join('');
    var filtered = progressRows.filter(function (row) { var task = findTask(row.id), f = state.progressFilters, key = f.keyword.toLowerCase(); return (!f.project || task.project === f.project) && (!f.env || task.env === f.env) && (!f.status || task.lastStatus === f.status) && (!key || task.name.toLowerCase().indexOf(key)>=0); });
    return '<form class="bp-filter" data-bp-form="progress">' + quickRange(state.progressRange,'progress',[['day','近1天'],['three','近3天'],['week','近7天']]) + '<div class="bp-date">' + datePicker('progress','2026-09-21 00:00:00','2026-09-22 23:59:59') + '</div><label class="bp-project"><span>项目</span><select data-bp-progress="project">' + projectOptions + '</select></label><label><span>环境</span><select data-bp-progress="env"><option value="">请选择</option>' + ['生产环境','测试环境','开发环境'].map(function (item) { return option(item,item,state.progressFilters.env); }).join('') + '</select></label><label><span>状态</span><select data-bp-progress="status"><option value="">全部</option>' + ['执行成功','执行失败','执行中'].map(function (item) { return option(item,item,state.progressFilters.status); }).join('') + '</select></label><label class="bp-keyword"><span class="sr-only">任务关键词</span><input type="text" placeholder="任务名称关键词" data-bp-progress="keyword" value="' + esc(state.progressFilters.keyword) + '"></label><div class="bp-filter-actions"><button type="submit" class="btn btn-primary"><i class="bi bi-search"></i><span>查询</span></button></div></form>' +
      '<div class="bp-table-tools"></div><div class="bp-progress-board"><div class="bp-progress-head"><div>任务</div><div class="bp-progress-axis"><span>00:00</span><span>04:00</span><span>08:00</span><span>12:00</span><span>16:00</span><span>20:00</span></div></div>' + (filtered.length ? filtered.map(function (row) { return '<div class="bp-progress-row"><div class="bp-progress-name"><i class="bi bi-stack"></i><span>' + esc(row.name) + '</span></div><div class="bp-progress-line"><button type="button" class="bp-progress-bar ' + row.status + '" style="left:' + row.left + '%;width:' + row.width + '%" data-bp-progress-log="' + row.id + '" title="查看执行日志">' + row.caption + '</button></div></div>'; }).join('') : '<div class="bp-empty"><i class="bi bi-inbox"></i><span>暂无符合条件的任务进度</span></div>') + '</div><div class="bp-progress-legend"><span><i style="background:#28b982"></i>执行成功</span><span><i style="background:#f05b5b"></i>执行失败</span><span><i style="background:#1683ff"></i>执行中</span></div>';
  }

  function devHtml() {
    if (!state.devColumns) state.devColumns = devColumns.map(function (column) { return column[0]; });
    var visibleColumns = devColumns.filter(function (column) { return state.devColumns.indexOf(column[0]) >= 0; });
    var f = state.devFilters, key = f.keyword.toLowerCase();
    var rows = devRows.filter(function (row) { return (!f.scheduled || row.scheduled === f.scheduled) && (!f.flowType || row.flowType === f.flowType) && (!f.status || row.status === f.status) && (!f.project || row.project === f.project) && (!key || (row.flowName + row.targetTable + row.project).toLowerCase().indexOf(key)>=0); });
    return '<form class="bp-filter" data-bp-form="dev"><label><span>是否启用调度</span><select data-bp-dev="scheduled"><option value="">请选择</option>' + option('已调度','已调度',f.scheduled) + option('未调度','未调度',f.scheduled) + '</select></label><label><span>流程类型</span><select data-bp-dev="flowType"><option value="">全部</option>' + option('数据采集','数据采集',f.flowType) + option('在线编程(SQL)','在线编程(SQL)',f.flowType) + '</select></label><label><span>最后执行状态</span><select data-bp-dev="status"><option value="">全部</option>' + ['执行成功','执行失败','执行中'].map(function (item) { return option(item,item,f.status); }).join('') + '</select></label><label><span>执行时间</span><div class="bp-date">' + datePicker('dev','2026-09-15 00:00:00','2026-09-22 23:59:59') + '</div></label><label class="bp-project"><span>项目</span><select data-bp-dev="project"><option value="">请选择</option>' + unique('project').map(function (item) { return option(item,item,f.project); }).join('') + '</select></label><label class="bp-keyword"><span class="sr-only">开发任务关键词</span><input type="text" placeholder="名称关键词" data-bp-dev="keyword" value="' + esc(f.keyword) + '"></label><div class="bp-filter-actions"><button type="submit" class="btn btn-primary"><i class="bi bi-search"></i><span>查询</span></button><button type="button" class="btn btn-primary" data-bp-action="export-dev"><i class="bi bi-download"></i><span>导出</span></button></div></form>' +
      '<div class="bp-table-tools">' + button('sliders','列筛选','data-bp-action="columns"') + '</div><div class="bp-table-wrap"><table class="ds-table bp-table bp-dev-table"><thead><tr>' + visibleColumns.map(function (column) { return '<th>' + column[1] + '</th>'; }).join('') + '</tr></thead><tbody>' + rows.map(function (row) { return '<tr>' + visibleColumns.map(function (column) { var value = row[column[0]]; if (column[0] === 'status' || column[0] === 'scheduled') return '<td>' + status(value) + '</td>'; if (column[0] === 'flowName') return '<td><button type="button" class="bp-table-link" data-bp-dev-task="' + row.id + '">' + esc(value) + '</button></td>'; return '<td title="' + esc(value) + '">' + esc(value) + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div><div class="bp-pagination"><span>第1到第' + rows.length + '条，共' + rows.length + '条数据</span><div class="bp-page-nav"><button type="button" disabled><i class="bi bi-chevron-left"></i><span>上一页</span></button><button type="button" class="active">1</button><button type="button" disabled><i class="bi bi-chevron-right"></i><span>下一页</span></button></div><select><option>10 条/页</option></select><label>跳至 <input type="number" value="1" min="1" max="1"> 页</label></div>';
  }

  function detailHtml(task) {
    if (!task) { state.detailTaskId = ''; return '<div class="bp-shell">' + tabs() + listHtml() + '</div>'; }
    var success = Math.max(0,task.total-task.fail), successRate = (success/task.total*100).toFixed(2), failRate = (task.fail/task.total*100).toFixed(2);
    return '<div class="bp-detail"><div class="bp-detail-head"><h2>' + esc(task.name) + '</h2><div class="bp-detail-actions">' + button('pencil-square','编辑','data-bp-row-action="edit" data-id="' + task.id + '"','btn btn-primary') + button('arrow-left','返回','data-bp-action="back"','btn btn-primary') + '</div></div><div class="bp-detail-meta">' +
      meta('所属项目',task.project) + meta('环境',task.env) + meta('任务类型','批量处理') + meta('版本',task.version) + meta('子流程个数','4') + meta('创建者',task.owner) + meta('修改时间','2026-09-18 16:22:41') + meta('调度',task.schedule.split(' 失败')[0]) + meta('执行总数',task.total) + meta('执行成功',success + '（' + successRate + '%）') + meta('执行失败','<span class="failed">' + task.fail + '（' + failRate + '%）</span>',true) + meta('执行时长',task.duration === '进行中' ? '6.18min（平均）' : task.duration) + '</div>' +
      '<div class="bp-detail-tabs">' + [['history','历史记录'],['topology','流程拓扑图'],['dependency','任务依赖'],['monitor','监控记录'],['notice','通知记录']].map(function (item) { return '<button type="button" class="' + (state.detailTab===item[0]?'active':'') + '" data-bp-detail-tab="' + item[0] + '">' + item[1] + '</button>'; }).join('') + '</div>' + detailPanel(task) + '</div>' + modalHtml() + '<div class="bp-toast" data-bp-toast role="status"></div>';
  }
  function meta(label,value,raw) { return '<dl><dt>' + label + '</dt><dd>' + (raw?value:esc(value)) + '</dd></dl>'; }
  function detailPanel(task) {
    if (state.detailTab === 'topology') return topologyHtml(task);
    if (state.detailTab === 'dependency') return dependencyHtml(task);
    if (state.detailTab === 'monitor') return monitorHtml(task);
    if (state.detailTab === 'notice') return noticeHtml(task);
    return historyHtml(task);
  }

  function topologyHtml(task) {
    var nodes = [
      { id:'start', type:'start', label:'开始', x:36, y:158 },
      { id:'ods', type:'task', label:'ODS【V1】', icon:'database', x:210, y:158, width:170 },
      { id:'dwd', type:'task', label:'DWD【V1】', icon:'table', x:440, y:158, width:170 },
      { id:'dws', type:'task', label:'DWS【V1】', icon:'process', x:670, y:158, width:170 },
      { id:'ads', type:'task', label:'ADS【V1】', icon:'report', x:900, y:158, width:170 },
      { id:'end', type:'end', label:'结束', x:1140, y:158 }
    ];
    var edges = [{from:'start',to:'ods'},{from:'ods',to:'dwd'},{from:'dwd',to:'dws'},{from:'dws',to:'ads'},{from:'ads',to:'end'}];
    var canvas = DP.developmentCanvas.readOnly({ id:'bpTopologyCanvas', label:'流程拓扑图', panelClass:'bp-development-canvas', worldWidth:1300, worldHeight:360, nodes:nodes, edges:edges });
    return '<div class="bp-topology-layout">' + canvas + '<aside class="bp-task-properties"><h3>任务属性</h3><ul><li><i class="bi bi-card-list"></i><span>项目：' + esc(task.project) + '</span></li><li><i class="bi bi-card-list"></i><span>任务名称：' + esc(task.name) + '</span></li><li><i class="bi bi-card-list"></i><span>运行状态：' + (task.status === '已停止' ? '已停止' : '执行中') + '</span></li><li><i class="bi bi-card-list"></i><span>修改人：' + esc(task.owner) + '</span></li><li><i class="bi bi-card-list"></i><span>创建时间：2026-09-10 10:23:08</span></li><li><i class="bi bi-card-list"></i><span>备注：' + esc(task.name) + '批量加工流程</span></li></ul></aside></div>';
  }

  function dependencyNodeCatalog(task) {
    return [
      { id:'store-source', label:'门店交易明细入仓【V1】', icon:'database', schedule:'每天 07:50:00', status:'执行成功', statusIcon:'check-circle-fill', statusTone:'', direction:'upstream' },
      { id:'product-source', label:'商品主数据同步【V2】', icon:'table', schedule:'每天 06:30:00', status:'执行成功', statusIcon:'check-circle-fill', statusTone:'', direction:'upstream' },
      { id:'current', label:task.name + '【' + task.version + '】', icon:'process', schedule:task.schedule.split(' 失败')[0], status:task.fail ? '部分成功' : task.lastStatus, statusIcon:task.fail ? 'check-circle-fill' : 'check-circle-fill', statusTone:task.fail ? 'warning' : '', direction:'current' },
      { id:'daily-report', label:'门店经营日报发布【V7】', icon:'report', schedule:'每天 08:55:00', status:'执行成功', statusIcon:'check-circle-fill', statusTone:'', direction:'downstream' },
      { id:'sales-dashboard', label:'区域销售趋势看板【V2】', icon:'chart', schedule:'每天 09:10:00', status:'等待执行', statusIcon:'clock-fill', statusTone:'warning', direction:'downstream' }
    ];
  }

  function dependencyGraph(task) {
    var all = dependencyNodeCatalog(task), direction = state.dependencyDirection, nodes = [], edges = [];
    function add(source, x, y) { var node=Object.assign({},source,{x:x,y:y,width:260,selectable:true,recordable:true,checked:state.dependencySelected.indexOf(source.id)>=0}); nodes.push(node); }
    var current=all[2];
    if (direction === 'upstream') {
      add(all[0],90,105); add(all[1],90,285); add(current,570,195); edges=[{from:'store-source',to:'current'},{from:'product-source',to:'current'}];
      return {nodes:nodes,edges:edges,width:930,height:480};
    }
    if (direction === 'downstream') {
      add(current,90,195); add(all[3],570,105); add(all[4],570,285); edges=[{from:'current',to:'daily-report'},{from:'current',to:'sales-dashboard'}];
      return {nodes:nodes,edges:edges,width:930,height:480};
    }
    add(all[0],45,105); add(all[1],45,285); add(current,470,195); add(all[3],895,105); add(all[4],895,285);
    edges=[{from:'store-source',to:'current'},{from:'product-source',to:'current'},{from:'current',to:'daily-report'},{from:'current',to:'sales-dashboard'}];
    return {nodes:nodes,edges:edges,width:1200,height:480};
  }

  function dependencyHtml(task) {
    var graph=dependencyGraph(task);
    var canvas=DP.developmentCanvas.readOnly({ id:'bpDependencyCanvas', label:'任务依赖画布', panelClass:'bp-development-canvas', worldWidth:graph.width, worldHeight:graph.height, nodes:graph.nodes, edges:graph.edges });
    return '<div class="bp-dependency"><div class="bp-dependency-toolbar"><div><span>链路分析：</span>' + [['all','全部'],['upstream','上游'],['downstream','下游']].map(function (item) { return '<label><input type="radio" name="bpDependencyDirection" value="' + item[0] + '" data-bp-dependency-direction' + (state.dependencyDirection === item[0] ? ' checked' : '') + '> ' + item[1] + '</label>'; }).join('') + '</div><button type="button" class="btn btn-primary" data-bp-action="dependency-execute"><i class="bi bi-play-circle"></i><span>批量执行</span></button></div>' + canvas + '</div>';
  }

  function recordFilter(type) {
    var isNotice = type === 'notice';
    return '<form class="bp-detail-filter bp-record-filter" data-bp-form="' + type + '">' + quickRange(state.recordRange,'record',[['day','近1天'],['week','近7天'],['month','近30天']]) + '<div class="bp-date">' + datePicker(type,'2026-09-21 00:00:00','2026-09-22 23:59:59') + '</div><label><span>等级</span><select data-bp-record-select><option>全部</option><option>严重</option><option>警告</option><option>提示</option></select></label>' + (isNotice ? '<label><span>通知</span><select data-bp-record-select><option>全部</option><option>钉钉</option><option>邮件</option></select></label>' : '') + '<label class="bp-keyword"><span class="sr-only">' + (isNotice ? '通知描述' : '描述') + '关键词</span><input type="text" placeholder="' + (isNotice ? '通知描述关键词' : '描述关键词') + '"></label><button type="submit" class="btn btn-primary"><i class="bi bi-search"></i><span>查询</span></button></form>';
  }

  function monitorHtml(task) {
    var description = '项目流程：' + task.project + '-' + task.name + '-' + task.name + '，在' + task.env + '环境，版本号：' + task.version + '，执行结果：执行失败，运行时长：736秒，请处理';
    return recordFilter('monitor') + '<div class="bp-detail-panel bp-record-panel"><table class="bp-simple-table bp-record-table"><thead><tr><th>等级</th><th>描述</th><th>告警时间</th></tr></thead><tbody><tr><td><span class="bp-level severe">严重</span></td><td class="bp-record-description">' + esc(description) + '</td><td>2026-09-22 08:57:47</td></tr><tr><td><span class="bp-level warning">警告</span></td><td class="bp-record-description">项目流程：' + esc(task.project + '-' + task.name) + '，任务执行时长达到预警阈值的 90%</td><td>2026-09-21 08:41:26</td></tr><tr><td><span class="bp-level info">提示</span></td><td class="bp-record-description">项目流程：' + esc(task.project + '-' + task.name) + '，调度任务已开始执行</td><td>2026-09-21 08:30:14</td></tr></tbody></table>' + recordPager(3) + '</div>';
  }

  function noticeHtml(task) {
    var description = '项目流程：' + task.project + '-' + task.name + '-' + task.name + '，在' + task.env + '环境，版本号：' + task.version + '，执行结果：执行失败，运行时长：736秒，请处理';
    return recordFilter('notice') + '<div class="bp-detail-panel bp-record-panel"><table class="bp-simple-table bp-record-table"><thead><tr><th>等级</th><th>通知描述</th><th>通知状态</th><th>通知时间</th></tr></thead><tbody><tr><td><span class="bp-level severe">严重</span></td><td class="bp-record-description">' + esc(description) + '</td><td>钉钉-发送成功；</td><td>2026-09-22 08:57:47</td></tr><tr><td><span class="bp-level warning">警告</span></td><td class="bp-record-description">项目流程：' + esc(task.project + '-' + task.name) + '，执行时长接近告警阈值</td><td>邮件-发送成功；</td><td>2026-09-21 08:41:26</td></tr></tbody></table>' + recordPager(2) + '</div>';
  }

  function recordPager(total) { return '<div class="bp-pagination bp-record-pagination"><span>第1到第' + total + '条，共' + total + '条数据</span><div class="bp-page-nav"><button type="button" disabled><i class="bi bi-chevron-left"></i><span>上一页</span></button><button type="button" class="active">1</button><button type="button" disabled><i class="bi bi-chevron-right"></i><span>下一页</span></button></div><select><option>10 条/页</option></select><label>跳至 <input type="number" value="1" min="1" max="1"> 页</label></div>'; }

  function historyHtml(task) {
    var rowActions = button('file-earmark-code','执行日志','data-bp-history-action="log" data-id="' + task.id + '"') + button('file-earmark-plus','数据补录','data-bp-history-action="supplement" data-id="' + task.id + '"') + button('clock-history','任务重跑','data-bp-history-action="task-rerun" data-id="' + task.id + '"');
    return '<form class="bp-detail-filter" data-bp-form="history">' + quickRange(state.recordRange,'record',[['day','近1天'],['week','近7天'],['month','近30天']]) + '<div class="bp-date">' + datePicker('detail','2026-09-21 00:00:00','2026-09-22 23:59:59') + '</div><label><span>执行方式</span><select data-bp-record-select><option>请选择</option><option>调度执行</option><option>手动执行</option></select></label><label class="bp-duration-range"><span>时长（秒）</span><input type="number" placeholder="最小值"><em>—</em><input type="number" placeholder="最大值"></label><label><span>状态</span><select data-bp-record-select><option>全部状态</option><option>执行成功</option><option>执行失败</option></select></label><label><span class="sr-only">执行ID</span><input type="text" placeholder="执行ID"></label><button type="submit" class="btn btn-primary"><i class="bi bi-search"></i><span>查询</span></button><button type="button" class="btn btn-primary" data-bp-action="history-rerun"><i class="bi bi-arrow-repeat"></i><span>批量重跑</span></button></form><div class="bp-table-wrap"><table class="ds-table bp-table" style="min-width:1420px"><thead><tr><th style="width:44px"><input type="checkbox" aria-label="全选历史记录"></th><th>执行ID</th><th>执行方式</th><th>开始时间</th><th>结束时间</th><th>状态</th><th>时长</th><th style="width:330px">故障原因</th><th class="bp-action-col">操作</th></tr></thead><tbody><tr><td><input type="checkbox"></td><td>BP-20260922084531</td><td>调度执行</td><td>2026-09-22 08:45:31</td><td>2026-09-22 08:57:47</td><td>' + status(task.lastStatus) + '</td><td>' + task.duration + '</td><td title="JDBC 连接超时，重试后仍无法连接目标集群">JDBC 连接超时，重试后仍无法连接目标集群</td><td class="bp-action-col"><div class="bp-row-actions">' + rowActions + '</div></td></tr><tr><td><input type="checkbox"></td><td>BP-20260921083014</td><td>调度执行</td><td>2026-09-21 08:30:14</td><td>2026-09-21 08:39:02</td><td>' + status('执行成功') + '</td><td>8分48秒</td><td>--</td><td class="bp-action-col"><div class="bp-row-actions">' + rowActions + '</div></td></tr></tbody></table></div>';
  }

  function modalHtml() { return '<div class="bp-modal" data-bp-modal hidden><div class="bp-modal-mask" data-bp-close></div><section class="bp-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="bpModalTitle"><div class="bp-modal-head"><h3 id="bpModalTitle"></h3><button type="button" class="bp-modal-x" data-bp-close aria-label="关闭"><i class="bi bi-x-lg"></i></button></div><div class="bp-modal-body" data-bp-modal-body></div><div class="bp-modal-foot" data-bp-modal-foot></div></section></div>'; }
  function openModal(title, body, confirmAction, wide, confirmLabel) {
    var modal = pageEl.querySelector('[data-bp-modal]'); if (!modal) return;
    modal.querySelector('#bpModalTitle').textContent = title; modal.querySelector('[data-bp-modal-body]').innerHTML = body;
    modal.querySelector('[data-bp-modal-foot]').innerHTML = '<button type="button" class="btn btn-default" data-bp-close><i class="bi bi-x-lg"></i><span>取消</span></button>' + (confirmAction ? '<button type="button" class="btn btn-primary" data-bp-confirm="' + confirmAction + '"><i class="bi bi-check-lg"></i><span>' + esc(confirmLabel || '确认') + '</span></button>' : '');
    modal.querySelector('.bp-modal-dialog').classList.toggle('is-wide',!!wide); modal.hidden = false;
  }
  function closeModal() { var modal = pageEl && pageEl.querySelector('[data-bp-modal]'); if (modal) modal.hidden = true; }
  function notify(message) { var el = pageEl && pageEl.querySelector('[data-bp-toast]'); if (!el) return; clearTimeout(toastTimer); el.textContent = message; el.classList.add('show'); toastTimer = setTimeout(function () { el.classList.remove('show'); },2200); }
  function findTask(id) { return tasks.find(function (task) { return String(task.id) === String(id); }); }

  function projectContext(task) {
    var projectMap = { '零售交易数仓':'数仓建设项目', '会员画像中心':'用户画像项目', '供应链协同分析':'供应链项目', '财务结算分析':'报表分析项目' };
    return { project:projectMap[task.project] || '数据中台项目', environment:String(task.env || '开发').replace('环境','') };
  }
  function scheduleFlowId(task) {
    if (/会员/.test(task.name)) return 'member';
    if (/库存|供应商|物流/.test(task.name)) return 'stock';
    if (/商品/.test(task.name)) return 'product';
    if (/核验|质量/.test(task.name)) return 'quality';
    return 'sales';
  }
  function navigateToProjectModule(task, mode) {
    var nav = document.querySelector('.nav-item[data-page="develop"]');
    document.querySelectorAll('.nav-item').forEach(function (item) { item.classList.remove('active'); });
    if (nav) nav.classList.add('active');
    DP.switchMenuGroup('develop');
    var menuKey = mode === 'schedule' ? 'dev-schedule' : 'dev-develop';
    var link = document.querySelector('[data-menu="' + menuKey + '"]');
    if (link) DP.setActiveMenu(link);
    var context = projectContext(task);
    if (mode === 'schedule') context.flowId = scheduleFlowId(task);
    DP.showPage(mode === 'schedule' ? 'dev-schedule' : '数据开发', context);
  }
  function supplementModal(task) { openModal('数据补录','<div class="bp-name-row"><span>名称：</span><b>' + esc(task.name) + '</b></div>','save-supplement',false,'保存'); }
  function taskRerunModal(task) { openModal('任务重跑','<div class="bp-name-row"><span>名称：</span><b>' + esc(task.name) + '</b></div>','save-task-rerun',false,'保存'); }
  function dependencyNode(task,id) { return dependencyNodeCatalog(task).find(function(node){return node.id===id;}); }
  function dependencyRecordModal(task,nodeId) {
    var node=dependencyNode(task,nodeId); if(!node)return;
    var failed=nodeId==='current' && task.fail;
    var body='<div class="bp-dependency-record-name">' + esc(node.label) + '</div><div class="bp-dependency-record-filter"><label><span>状态：</span><select data-bp-record-select><option>请选择</option><option>执行成功</option><option>执行失败</option><option>执行中</option></select></label><div class="bp-date">' + datePicker('dependency-record','2026-09-15 00:00:00','2026-09-22 23:59:59') + '</div></div><div class="bp-table-wrap"><table class="bp-simple-table bp-dependency-record-table"><thead><tr><th>执行ID</th><th>版本</th><th>开始时间</th><th>时长</th><th>状态</th><th>执行方式</th><th>执行参数</th><th>操作</th></tr></thead><tbody><tr><td>DP-202609220' + (nodeId==='current'?'843':'731') + '</td><td>' + esc((node.label.match(/【([^】]+)】/)||['','V1'])[1]) + '</td><td>2026-09-22 08:45:31</td><td>' + (failed?'12分16秒':'6分28秒') + '</td><td>' + status(failed?'执行失败':'执行成功') + '</td><td>调度执行</td><td>biz_date=2026-09-21</td><td><button type="button" class="bp-table-link" data-bp-dependency-log="' + esc(nodeId) + '"><i class="bi bi-file-earmark-code"></i><span>执行日志</span></button></td></tr><tr><td>DP-202609210' + (nodeId==='current'?'830':'718') + '</td><td>' + esc((node.label.match(/【([^】]+)】/)||['','V1'])[1]) + '</td><td>2026-09-21 08:30:14</td><td>8分48秒</td><td>' + status('执行成功') + '</td><td>调度执行</td><td>biz_date=2026-09-20</td><td><button type="button" class="bp-table-link" data-bp-dependency-log="' + esc(nodeId) + '"><i class="bi bi-file-earmark-code"></i><span>执行日志</span></button></td></tr></tbody></table></div>' + recordPager(2);
    openModal('执行日志',body,'close-dependency-record',true,'确定');
  }
  function dependencyExecuteModal(task) {
    var count=state.dependencySelected.length;
    state.dependencyMechanism=''; state.dependencyParamPage=1;
    var body='<div class="bp-dependency-execute-form"><div class="bp-dependency-execute-row"><span>名称：</span><b>' + esc(task.name + '【' + task.version + '】') + '</b></div><div class="bp-dependency-execute-row"><span>选中关联：</span><b>' + count + '个流程</b></div><label><span>执行范围：</span><div class="bp-date">' + datePicker('dependency-execute','2026-09-01 00:00:00','2026-09-22 23:59:59') + '</div></label><div class="bp-dependency-execute-row bp-dependency-mechanism-row"><span>执行机制：</span><div class="bp-dependency-mechanism"><select data-bp-dependency-mechanism><option value="">请选择</option><option value="hourly">每小时</option><option value="daily">每天</option><option value="weekly">每周</option><option value="monthly">每月</option></select><div class="bp-dependency-mechanism-fields" data-bp-dependency-mechanism-fields></div></div></div><div data-bp-dependency-params>' + dependencyParamsHtml('',1) + '</div></div>';
    openModal('批量执行',body,'confirm-dependency-execute',false,'确定');
  }
  function dependencyMechanismFields(mechanism) {
    var time='<label class="bp-dependency-time"><input type="time" step="1" value="00:00:00" data-bp-dependency-time aria-label="执行时间"><i class="bi bi-clock"></i></label>';
    if (mechanism==='hourly') return '<span class="bp-dependency-inline-text">第</span><input class="bp-dependency-minute" type="number" min="0" max="59" value="1" data-bp-dependency-detail aria-label="每小时第几分钟"><span class="bp-dependency-inline-text">分</span>';
    if (mechanism==='daily') return time;
    if (mechanism==='weekly') return '<select class="bp-dependency-cycle-value" data-bp-dependency-detail aria-label="每周执行日期">' + ['周一','周二','周三','周四','周五','周六','周日'].map(function(day,index){return '<option value="' + (index+1) + '">' + day + '</option>';}).join('') + '</select>' + time;
    if (mechanism==='monthly') return '<select class="bp-dependency-cycle-value" data-bp-dependency-detail aria-label="每月执行日期">' + Array.from({length:31},function(_,index){return '<option value="' + (index+1) + '">' + (index+1) + '号</option>';}).join('') + '</select>' + time;
    return '';
  }
  function dependencyDateValue(selector,fallback) {
    var input=pageEl && pageEl.querySelector(selector); return input && input.value ? input.value : fallback;
  }
  function dependencyDate(value) { return new Date(String(value).replace(' ','T')); }
  function dependencyFormatTime(date) {
    function pad(value){return String(value).padStart(2,'0');}
    return date.getFullYear() + '-' + pad(date.getMonth()+1) + '-' + pad(date.getDate()) + ' ' + pad(date.getHours()) + ':' + pad(date.getMinutes()) + ':' + pad(date.getSeconds());
  }
  function dependencyExecutionTimes(mechanism) {
    if(!mechanism)return [];
    var start=dependencyDate(dependencyDateValue('[data-bp-date="dependency-execute-start"]','2026-09-01 00:00:00'));
    var end=dependencyDate(dependencyDateValue('[data-bp-date="dependency-execute-end"]','2026-09-22 23:59:59'));
    if(isNaN(start.getTime()) || isNaN(end.getTime()) || start>end)return [];
    var timeInput=pageEl && pageEl.querySelector('[data-bp-dependency-time]'), timeParts=(timeInput&&timeInput.value?timeInput.value:'00:00:00').split(':');
    var hour=Number(timeParts[0]||0), minute=Number(timeParts[1]||0), second=Number(timeParts[2]||0), cursor=new Date(start), result=[];
    if(mechanism==='hourly') {
      var minuteInput=pageEl && pageEl.querySelector('.bp-dependency-minute'); minute=Number(minuteInput&&minuteInput.value||1);
      cursor.setMinutes(minute,0,0); if(cursor<start)cursor.setHours(cursor.getHours()+1);
      while(cursor<=end && result.length<2400){result.push(dependencyFormatTime(cursor));cursor.setHours(cursor.getHours()+1);} return result;
    }
    cursor.setHours(hour,minute,second,0); if(cursor<start)cursor.setDate(cursor.getDate()+1);
    var detail=pageEl && pageEl.querySelector('[data-bp-dependency-detail]'), detailValue=Number(detail&&detail.value||1);
    while(cursor<=end && result.length<1500) {
      if(mechanism==='daily' || (mechanism==='weekly' && cursor.getDay()===(detailValue%7)) || (mechanism==='monthly' && cursor.getDate()===detailValue)) result.push(dependencyFormatTime(cursor));
      cursor.setDate(cursor.getDate()+1);
    }
    return result;
  }
  function dependencyParameterGroup(index,time) {
    var dateValue=time.slice(0,10) + ' 00:00:00';
    var picker=DP.datePicker.render({ mode:'single', label:'业务日期', value:dateValue, output:'datetime', withTime:true, valueAttrs:{ 'data-bp-dependency-param-date':String(index+1) } });
    return '<section class="bp-dependency-param-group"><header>执行参数：' + (index+1) + '【' + esc(time) + '】</header><div class="bp-dependency-param-fields"><label><span>JVM内存：</span><input type="text" value="-Xms1G -Xmx2G"></label><label><span>业务日期：</span><div class="bp-dependency-param-picker">' + picker + '</div></label><label><span>门店范围：</span><input type="text" value="ALL_STORE"></label><label><span>补数标识：</span><input type="text" value="N"></label></div></section>';
  }
  function dependencyParamPager(page,pages) {
    if (pages<=1) return '';
    var numbers=[];
    for(var i=1;i<=Math.min(5,pages);i+=1) numbers.push('<button type="button" data-bp-param-page="' + i + '" class="' + (page===i?'active':'') + '">' + i + '</button>');
    if(pages>6) numbers.push('<span>…</span>');
    if(pages>5) numbers.push('<button type="button" data-bp-param-page="' + pages + '" class="' + (page===pages?'active':'') + '">' + pages + '</button>');
    return '<div class="bp-dependency-param-pager"><button type="button" data-bp-param-page="prev"' + (page===1?' disabled':'') + '><i class="bi bi-chevron-left"></i><span>上一页</span></button>' + numbers.join('') + '<button type="button" data-bp-param-page="next"' + (page===pages?' disabled':'') + '><span>下一页</span><i class="bi bi-chevron-right"></i></button></div>';
  }
  function dependencyParamsHtml(mechanism,page) {
    var times=dependencyExecutionTimes(mechanism);
    if(!times.length) return '<div class="bp-dependency-params-empty"><i class="bi bi-inbox"></i><span>请选择执行机制后配置执行参数</span></div>';
    var pageSize=2, pages=Math.ceil(times.length/pageSize); page=Math.max(1,Math.min(pages,page||1)); state.dependencyParamPage=page;
    var start=(page-1)*pageSize;
    return '<div class="bp-dependency-params"><div class="bp-dependency-params-head"><span>执行参数</span><button type="button" class="bp-dependency-param-help" aria-label="查看参数说明"><i class="bi bi-info-circle"></i><span class="bp-dependency-param-tip">1、默认值来源第一个流程所在任务的调度配置；<br>2、按执行机制配置，传入执行范围的时间执行；<br>3、只展示当前流程的参数配置。</span></button></div><div class="bp-dependency-param-scroll">' + times.slice(start,start+pageSize).map(function(time,index){return dependencyParameterGroup(start+index,time);}).join('') + '</div>' + dependencyParamPager(page,pages) + '</div>';
  }
  function refreshDependencyExecute() {
    var fields=pageEl.querySelector('[data-bp-dependency-mechanism-fields]'), params=pageEl.querySelector('[data-bp-dependency-params]');
    if(fields) fields.innerHTML=dependencyMechanismFields(state.dependencyMechanism);
    if(params) params.innerHTML=dependencyParamsHtml(state.dependencyMechanism,state.dependencyParamPage);
  }
  function refreshDependencyParams() {
    var params=pageEl.querySelector('[data-bp-dependency-params]');
    if(params)params.innerHTML=dependencyParamsHtml(state.dependencyMechanism,state.dependencyParamPage);
  }
  function columnsModal() { openModal('列筛选','<div class="bp-selection-tip"><i class="bi bi-sliders"></i><span>勾选需要在开发监控列表中展示的字段。</span></div><div class="bp-form">' + devColumns.map(function (column) { return '<label style="flex-direction:row;align-items:center"><input type="checkbox" style="width:16px;height:16px" data-bp-column="' + column[0] + '"' + (state.devColumns.indexOf(column[0])>=0?' checked':'') + '><span>' + column[1] + '</span></label>'; }).join('') + '</div>','save-columns',true); }
  function rerunModal(ids) { var names = ids.map(function (id) { var task=findTask(id); return task ? task.name : ''; }).filter(Boolean); openModal('批量重跑','<div class="bp-selection-tip"><i class="bi bi-info-circle"></i><span>已选择 ' + names.length + ' 个任务，本次重跑使用任务当前版本与已保存参数。</span></div><table class="bp-simple-table"><thead><tr><th>任务名称</th><th>版本</th><th>调度参数</th></tr></thead><tbody>' + ids.map(function (id) { var task=findTask(id); return task ? '<tr><td>' + esc(task.name) + '</td><td>' + task.version + '</td><td>' + esc(task.params) + '</td></tr>' : ''; }).join('') + '</tbody></table>','confirm-rerun',true); }
  function planModal(ids) { openModal('计划状态','<div class="bp-selection-tip"><i class="bi bi-info-circle"></i><span>将统一调整所选 ' + ids.length + ' 个任务的计划状态。</span></div><form class="bp-form"><label class="full"><span>目标状态</span><select data-bp-plan-value><option value="已启动">启动计划</option><option value="未启动">停止计划</option></select></label></form>','confirm-plan'); }

  function logContent(task) {
    return '[2026-09-22 08:45:31.084] INFO  BatchJobRunner - start taskId=' + task.id + ', taskName=' + task.name + '\n[2026-09-22 08:45:31.197] INFO  Scheduler - version=' + task.version + ', owner=' + task.owner + '\n[2026-09-22 08:45:32.420] INFO  SqlExecutor - submit 4 subflows to worker queue\n[2026-09-22 08:48:16.732] INFO  OdsLoadTask - readRows=128460, writeRows=128460\n[2026-09-22 08:53:42.105] WARN  JdbcClient - target connection timeout, retry=1/3\n[2026-09-22 08:54:47.611] WARN  JdbcClient - target connection timeout, retry=2/3\n[2026-09-22 08:57:46.890] ERROR JdbcClient - JDBC_CONNECTION_FAILED sqlState=08001\n[2026-09-22 08:57:47.002] ERROR BatchJobRunner - task failed, duration=736s\n[2026-09-22 08:57:47.018] INFO  NotifyService - failure notification delivered to 数据平台运维组';
  }
  function openLog(id) { var task=findTask(id)||tasks[0]; DP.logViewer.open({ title:'执行日志', subtitle:task.name, fileName:'batch-' + task.id + '-20260922.log', content:logContent(task), meta:[{label:'执行ID',value:'BP-20260922084531'},{label:'任务版本',value:task.version},{label:'执行状态',value:task.lastStatus,tone:/失败/.test(task.lastStatus)?'danger':(/执行中/.test(task.lastStatus)?'info':'success')},{label:'执行时间',value:task.lastTime}] }); }
  function exportDev() {
    var columns = devColumns.filter(function (column) { return state.devColumns.indexOf(column[0])>=0; });
    var csv = '\ufeff' + [columns.map(function (c){return c[1];}).join(',')].concat(devRows.map(function(row){return columns.map(function(c){return '"' + String(row[c[0]]).replace(/"/g,'""') + '"';}).join(',');})).join('\n');
    var url = URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'})), link=document.createElement('a'); link.href=url; link.download='批量处理-开发监控.csv'; document.body.appendChild(link); link.click(); link.remove(); setTimeout(function(){URL.revokeObjectURL(url);},0); notify('开发监控数据已导出');
  }

  function handleClick(event) {
    var target = event.target.closest('button,[data-bp-close]'); if (!target) return;
    if (target.matches('[data-bp-close]')) { closeModal(); return; }
    if (target.dataset.bpView) { state.view=target.dataset.bpView; state.detailTaskId=''; render(); return; }
    if (target.dataset.bpRange) { var parts=target.dataset.bpRange.split(':'); if (parts[0]==='list') state.listRange=parts[1]; else if (parts[0]==='progress') state.progressRange=parts[1]; else if (parts[0]==='record') state.recordRange=parts[1]; render(); return; }
    if (target.dataset.bpSort) { if (state.sortKey===target.dataset.bpSort) state.sortDir=state.sortDir==='asc'?'desc':'asc'; else { state.sortKey=target.dataset.bpSort; state.sortDir='asc'; } render(); return; }
    if (target.dataset.bpPage) { var pages=Math.max(1,Math.ceil(filteredTasks().length/state.pageSize)); if (target.dataset.bpPage==='prev') state.listPage=Math.max(1,state.listPage-1); else if (target.dataset.bpPage==='next') state.listPage=Math.min(pages,state.listPage+1); render(); return; }
    if (target.dataset.bpAction==='more') { state.listMore=!state.listMore; render(); return; }
    if (target.dataset.bpAction==='refresh') { notify('任务状态已刷新'); return; }
    if (target.dataset.bpAction==='bulk-rerun') { rerunModal(state.selected); return; }
    if (target.dataset.bpAction==='plan-status') { planModal(state.selected); return; }
    if (target.dataset.bpAction==='columns') { columnsModal(); return; }
    if (target.dataset.bpAction==='export-dev') { exportDev(); return; }
    if (target.dataset.bpAction==='back') { state.detailTaskId=''; state.detailTab='history'; render(); return; }
    if (target.dataset.bpAction==='history-rerun') { rerunModal([state.detailTaskId]); return; }
    if (target.dataset.bpAction==='dependency-execute') { if(!state.dependencySelected.length){notify('请先勾选需要执行的任务');return;} dependencyExecuteModal(findTask(state.detailTaskId)); return; }
    if (target.dataset.bpParamPage) { var paramPages=Math.ceil(dependencyExecutionTimes(state.dependencyMechanism).length/2); if(target.dataset.bpParamPage==='prev')state.dependencyParamPage=Math.max(1,state.dependencyParamPage-1); else if(target.dataset.bpParamPage==='next')state.dependencyParamPage=Math.min(paramPages,state.dependencyParamPage+1); else state.dependencyParamPage=Number(target.dataset.bpParamPage)||1; refreshDependencyParams(); return; }
    if (target.dataset.bpRowAction) { var task=findTask(target.dataset.id); if (!task) return; if (target.dataset.bpRowAction==='view') { state.detailTaskId=task.id; state.detailTab='history'; render(); } else if (target.dataset.bpRowAction==='edit') navigateToProjectModule(task,'edit'); else if (target.dataset.bpRowAction==='schedule') navigateToProjectModule(task,'schedule'); return; }
    if (target.dataset.bpDetailTab) { state.detailTab=target.dataset.bpDetailTab; render(); return; }
    if (target.dataset.developmentNodeRecord) { dependencyRecordModal(findTask(state.detailTaskId),target.dataset.developmentNodeRecord); return; }
    if (target.dataset.bpDependencyLog) { openLog(state.detailTaskId); return; }
    if (target.dataset.bpHistoryAction==='log') { openLog(target.dataset.id); return; }
    if (target.dataset.bpHistoryAction==='supplement') { supplementModal(findTask(target.dataset.id)); return; }
    if (target.dataset.bpHistoryAction==='task-rerun') { taskRerunModal(findTask(target.dataset.id)); return; }
    if (target.dataset.bpProgressLog) { openLog(target.dataset.bpProgressLog); return; }
    if (target.dataset.bpDevTask) { var match=tasks.find(function(task){return task.name===target.textContent.trim();}); if (match) { state.detailTaskId=match.id; state.detailTab='history'; render(); } return; }
    if (target.dataset.bpConfirm) {
      if (target.dataset.bpConfirm==='confirm-dependency-execute' && !state.dependencyMechanism) { notify('请选择执行机制'); return; }
      if (target.dataset.bpConfirm==='save-columns') {
        var checkedColumns=Array.prototype.map.call(pageEl.querySelectorAll('[data-bp-column]:checked'),function(input){return input.dataset.bpColumn;});
        if (!checkedColumns.length) { notify('请至少保留一个展示字段'); return; }
        state.devColumns=checkedColumns;
      }
      else if (target.dataset.bpConfirm==='confirm-plan') { var value=pageEl.querySelector('[data-bp-plan-value]').value; tasks.forEach(function(task){if(state.selected.indexOf(task.id)>=0) task.plan=value;}); state.selected=[]; }
      closeModal();
      if (target.dataset.bpConfirm==='save-columns') render();
      else if (target.dataset.bpConfirm==='confirm-plan') { render(); notify('计划状态已更新'); }
      else if (target.dataset.bpConfirm==='save-supplement') notify('数据补录任务已保存');
      else if (target.dataset.bpConfirm==='save-task-rerun') notify('任务重跑已保存');
      else if (target.dataset.bpConfirm==='close-dependency-record') return;
      else if (target.dataset.bpConfirm==='confirm-dependency-execute') { state.dependencySelected=[]; render(); notify('批量执行任务已提交'); }
      else notify('重跑任务已提交');
      return;
    }
  }

  function handleChange(event) {
    if (event.target.matches('[data-bp-select]')) { var id=Number(event.target.dataset.bpSelect); if (event.target.checked && state.selected.indexOf(id)<0) state.selected.push(id); if (!event.target.checked) state.selected=state.selected.filter(function(item){return item!==id;}); render(); return; }
    if (event.target.matches('[data-bp-select-all]')) { state.selected=event.target.checked?filteredTasks().map(function(row){return row.id;}):[]; render(); return; }
    if (event.target.matches('[data-bp-filter]') && event.target.dataset.bpFilter!=='keyword') { state.filters[event.target.dataset.bpFilter]=event.target.value; state.listPage=1; render(); return; }
    if (event.target.matches('[data-bp-progress]') && event.target.dataset.bpProgress!=='keyword') { state.progressFilters[event.target.dataset.bpProgress]=event.target.value; render(); return; }
    if (event.target.matches('[data-bp-dev]') && event.target.dataset.bpDev!=='keyword') { state.devFilters[event.target.dataset.bpDev]=event.target.value; render(); return; }
    if (event.target.matches('[data-bp-page-size]')) { state.pageSize=Number(event.target.value)||10; state.listPage=1; render(); return; }
    if (event.target.matches('[data-development-node-select]')) { var dependencyId=event.target.dataset.developmentNodeSelect; if(event.target.checked && state.dependencySelected.indexOf(dependencyId)<0)state.dependencySelected.push(dependencyId); if(!event.target.checked)state.dependencySelected=state.dependencySelected.filter(function(item){return item!==dependencyId;}); return; }
    if (event.target.matches('[data-bp-dependency-direction]')) { state.dependencyDirection=event.target.value; render(); return; }
    if (event.target.matches('[data-bp-dependency-mechanism]')) { state.dependencyMechanism=event.target.value; state.dependencyParamPage=1; refreshDependencyExecute(); return; }
    if (event.target.matches('[data-bp-dependency-time],[data-bp-dependency-detail]')) { state.dependencyParamPage=1; refreshDependencyParams(); return; }
    if (event.target.matches('[data-bp-date]') && String(event.target.dataset.bpDate).indexOf('dependency-execute-')===0) { state.dependencyParamPage=1; refreshDependencyParams(); return; }
    if (event.target.matches('[data-bp-record-select]')) { notify('已按所选条件刷新记录'); return; }
    if (event.target.matches('[data-bp-date]')) { notify('已按所选时间范围刷新'); }
  }
  function handleSubmit(event) {
    var form=event.target.closest('[data-bp-form]'); if (!form) return; event.preventDefault();
    if (form.dataset.bpForm==='list') { var input=form.querySelector('[data-bp-filter="keyword"]'); state.filters.keyword=input?input.value.trim():''; state.listPage=1; render(); }
    else if (form.dataset.bpForm==='progress') { var p=form.querySelector('[data-bp-progress="keyword"]'); state.progressFilters.keyword=p?p.value.trim():''; render(); }
    else if (form.dataset.bpForm==='dev') { var d=form.querySelector('[data-bp-dev="keyword"]'); state.devFilters.keyword=d?d.value.trim():''; render(); }
    else if (form.dataset.bpForm==='monitor') notify('监控记录已按条件刷新');
    else if (form.dataset.bpForm==='notice') notify('通知记录已按条件刷新');
    else notify('历史记录已按条件刷新');
  }
  function handleKeydown(event) { if (event.target.matches('[data-bp-jump]') && event.key==='Enter') { event.preventDefault(); var pages=Math.max(1,Math.ceil(filteredTasks().length/state.pageSize)); state.listPage=Math.min(pages,Math.max(1,Number(event.target.value)||1)); render(); } }

  function init() {
    pageEl=DP.contentArea.querySelector('.page-batch-processing'); if (!pageEl) return;
    state.detailTaskId=''; state.detailTab='history'; state.dependencyDirection='all'; state.dependencySelected=[]; state.dependencyMechanism=''; state.dependencyParamPage=1; state.recordRange='day'; render();
    pageEl.addEventListener('click',handleClick); pageEl.addEventListener('change',handleChange); pageEl.addEventListener('submit',handleSubmit); pageEl.addEventListener('keydown',handleKeydown);
  }
  function destroy() { clearTimeout(toastTimer); if(pageEl && DP.developmentCanvas)DP.developmentCanvas.destroyAll(pageEl); pageEl=null; }
  return { html:'<div class="page-batch-processing"></div>', init:init, destroy:destroy };
}());
