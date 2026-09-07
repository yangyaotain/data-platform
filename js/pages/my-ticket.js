/** 控制台 / 我的工单。系统已核对的功能及未验证边界见 work/my-ticket/reference-notes.md。 */
window.DP = window.DP || {};
DP.pages = DP.pages || {};
DP.pages.myTicket = (function () {
  'use strict';
  var view = DP.logView;
  var currentUser = { id: 'current-user', name: '专用账户' };
  var storageKey = 'dp.my-ticket.decisions.v1';
  var sources = {
    '我的控制台': ['项目新增', '项目信息修改', '成员修改变更', '资源申请修改', '项目启用', '项目关闭'],
    '项目开发': ['流程发布', '数据发布-申请发布'],
    '数据资产': ['数据治理-审核流程', '数据资产-元模型审核流程', '数据治理-标准数据审核流程', '数据资产-数据质量-绩效管理', '数据资产-生命周期-数据清理任务'],
    '协同共享': ['申请审核', '共享审核'],
    '数据服务': ['数据服务-应用审批'],
    '运营管理': ['开发者账号'],
    '数据分析': ['指标审核']
  };
  var statusNames = ['待审核', '审核通过', '审核驳回', '审核完成'];
  var tabs = [['pending', '待办任务'], ['mine', '我的申请'], ['done', '已办任务']];
  var root, records, activeTab = 'pending', activeIds = [], handling = false, returnId = '';
  var selected = new Set();
  var states = { pending: newState(), mine: newState(), done: newState() };

  function newState() { return { source: '', type: '', status: '', keyword: '', draft: '', page: 1, size: 10, scroll: 0 }; }
  function state() { return states[activeTab]; }
  function esc(value) { return view.esc(value); }
  function button(action, icon, label, attrs, cls) {
    return '<button type="button" class="btn ' + (cls || 'btn-outline') + '" data-mt-action="' + action + '" ' + (attrs || '') + '><i class="bi bi-' + icon + '" aria-hidden="true"></i><span>' + esc(label) + '</span></button>';
  }
  function freezeSnapshot(value) {
    if (value && typeof value === 'object') { Object.keys(value).forEach(function (key) { freezeSnapshot(value[key]); }); Object.freeze(value); }
    return value;
  }

  function seedRecords() {
    // 每类工单的业务对象、申请内容均为本原型示例，不读取其他模块的当前业务对象。
    var catalog = [
      ['我的控制台', 0, '新建项目', '项目名称', ['供应链数仓项目', '客户画像二期项目', '经营分析专题项目'], [['所属部门', '数据平台部'], ['建设范围', '整合订单、库存与物流数据，建设业务主题数据集']], '申请开通项目及开发、测试、生产环境，用于主题数据建设。'],
      ['我的控制台', 1, '修改项目信息', '项目名称', ['数据中台项目', '物流数仓项目', '客户画像项目'], [['变更字段', '项目说明、项目负责人'], ['变更后负责人', '王敏']], '业务归属调整，更新项目信息与维护负责人。'],
      ['我的控制台', 2, '项目成员变更', '项目名称', ['数据质量项目', '供应链项目', '经营报表项目'], [['新增成员', '陈晨、周琳'], ['成员角色', '开发人员'], ['所属部门', '数据开发组']], '补充主题数据开发人员，配置项目内开发协作权限。'],
      ['我的控制台', 3, '调整项目资源', '项目名称', ['实时计算项目', '数仓建设项目', '营销分析项目'], [['环境', '生产'], ['CPU 配额', '16 个 → 24 个'], ['内存配额', '32 GB → 48 GB']], '业务数据量增长，申请调整现有项目计算资源。'],
      ['我的控制台', 4, '启用项目', '项目名称', ['库存分析项目', '渠道运营项目', '经营预测项目'], [['启用环境', '开发、测试、生产'], ['项目负责人', '李娜']], '项目资源与成员已核对，申请启用项目。'],
      ['我的控制台', 5, '关闭项目', '项目名称', ['历史营销归档项目', '旧版物流报表项目', '历史订单迁移项目'], [['归档状态', '项目产物已归档'], ['调度状态', '相关周期调度已停止']], '历史数据迁移工作已完成，申请关闭项目。'],
      ['项目开发', 0, '发布流程', '流程名称', ['订单明细每日入仓', '库存快照每日汇总', '物流轨迹增量采集'], [['目标环境', '生产'], ['发布版本', 'V1.3'], ['验证结果', '测试环境执行成功，输入输出记录数一致']], '测试验证已完成，申请将流程发布至生产环境。'],
      ['项目开发', 1, '申请数据发布', '数据集', ['客户订单主题数据集', '门店销售主题数据集', '供应商履约主题数据集'], [['数据分层', 'DWS 汇总层'], ['更新周期', '每日'], ['数据范围', '最近 12 个月业务汇总数据']], '主题数据已完成核对，申请发布供业务分析使用。'],
      ['数据资产', 0, '元数据审核', '数据表', ['dwd_trade_order_detail_di', 'dwd_customer_profile_di', 'dwd_inventory_balance_di'], [['变更内容', '补充业务描述、字段口径和负责人'], ['所属数据层', 'DWD 明细层'], ['变更字段数', '3 个']], '完善核心数据表的业务口径与管理信息。'],
      ['数据资产', 1, '元模型审核', '元模型', ['客户主题域模型', '供应链主题域模型', '物流主题域模型'], [['申请版本', 'V2.0'], ['变更内容', '新增业务实体关系和属性说明']], '统一主题域实体定义，支持后续元数据采集和管理。'],
      ['数据资产', 2, '标准数据审核', '标准组', ['订单金额标准组', '客户标识标准组', '物流状态标准组'], [['标准数量', '4 项'], ['申请版本', 'V1.2'], ['变更内容', '统一名称、数据类型、取值范围和业务口径']], '提交本组数据标准，统一业务系统与数仓字段口径。'],
      ['数据资产', 3, '质量绩效审核', '考核对象', ['订单主题质量绩效', '客户主题质量绩效', '库存主题质量绩效'], [['考核周期', '2026 年 8 月'], ['稽查任务数', '12 个'], ['问题处理', '24 项问题已完成整改复核']], '本期质量问题已完成整改，提交绩效结果审核。'],
      ['数据资产', 4, '数据清理任务审核', '任务名称', ['历史订单临时表清理', '库存核对中间表清理', '历史报表缓存清理'], [['清理范围', '超过 180 天的临时数据'], ['保留策略', '保留最近 180 天'], ['核对结果', '已确认不影响当前下游任务']], '按照生命周期策略清理历史临时数据，申请执行审核。'],
      ['协同共享', 0, '数据使用申请', '数据资源', ['客户订单汇总数据', '门店销售汇总数据', '供应链履约统计数据'], [['使用部门', '经营分析部'], ['使用目的', '开展月度经营分析'], ['授权期限', '2026-09-01 至 2026-12-31']], '申请按业务使用范围访问共享数据资源。'],
      ['协同共享', 1, '数据共享审核', '共享资源', ['区域订单统计数据', '物流时效统计数据', '库存周转统计数据'], [['共享范围', '集团内部'], ['更新频率', '每日'], ['数据处理', '仅共享统计结果，不包含个人明细']], '发布经过核对的业务统计数据，支持跨部门协作。'],
      ['数据服务', 0, '应用审批', '应用名称', ['客户服务门户', '供应商协同门户', '物流运营工作台'], [['申请接口', '订单状态查询、订单汇总查询'], ['调用环境', '生产'], ['使用部门', '业务运营部']], '应用联调完成，申请使用业务查询接口。'],
      ['运营管理', 0, '开发者账号申请', '开发团队', ['物流数据开发组', '供应链数据开发组', '客户数据开发组'], [['所属部门', '数据平台部'], ['账号用途', '开发与测试环境的数据开发'], ['申请角色', '开发人员']], '申请团队开发账号，用于项目开发与接口联调。'],
      ['数据分析', 0, '指标审核', '指标名称', ['订单履约及时率', '库存周转天数', '客户月度复购率'], [['指标分类', '经营分析指标'], ['统计周期', '自然月'], ['变更内容', '补充计算口径、统计范围及负责人']], '指标口径已完成业务核对，申请审核后使用。']
    ];
    var users = [['wangmin', '王敏'], ['zhangwei', '张伟'], ['lina', '李娜'], ['chenchen', '陈晨'], ['zhoulin', '周琳'], ['zhaolei', '赵磊']];
    var groups = [
      ['pending', [8, 0, 6, 10, 2, 15, 13, 7, 3, 9, 17, 12]],
      ['mine', [3, 6, 10, 15, 0, 8, 17, 9, 13, 2, 7, 14]],
      ['done', [1, 4, 5, 11, 14, 16, 8, 6, 10, 0, 15, 17]]
    ];
    var usage = {}, result = [];
    groups.forEach(function (group, groupIndex) {
      group[1].forEach(function (catalogIndex, index) {
        var item = catalog[catalogIndex], occurrence = usage[catalogIndex] || 0;
        usage[catalogIndex] = occurrence + 1;
        var object = item[4][occurrence % item[4].length];
        var applicant = group[0] === 'mine' ? [currentUser.id, currentUser.name] : users[index % users.length];
        var status = group[0] === 'pending' ? '待审核' : group[0] === 'mine' ? statusNames[index % 4] : statusNames[1 + index % 3];
        var day = new Date(Date.UTC(2026, 8, 3 - groupIndex - Math.floor(index / 6))).toISOString().slice(0, 10);
        var applyTime = day + ' ' + String(15 - index % 6).padStart(2, '0') + ':20:00';
        var finishTime = day + ' ' + String(16 - index % 6).padStart(2, '0') + ':35:00';
        var row = {
          id: 'WO202609' + String(1001 + result.length), title: object + ' · ' + item[2],
          source: item[0], type: sources[item[0]][item[1]], status: status,
          applicantId: applicant[0], applicant: applicant[1], applyTime: applyTime,
          assignee: group[0] === 'pending' ? currentUser.id : 'reviewer',
          handledBy: group[0] === 'done' ? currentUser.id : '',
          snapshot: freezeSnapshot({ fields: [[item[3], object]].concat(item[5].map(function (pair) { return pair.slice(); })), reason: item[6] }),
          history: [{ actor: applicant[1], action: '提交申请', time: applyTime, opinion: item[6] }]
        };
        if (status !== '待审核') row.history.push({ actor: group[0] === 'done' ? currentUser.name : users[(index + 2) % users.length][1], action: status, time: finishTime, opinion: status === '审核驳回' ? '请补充申请范围及核对依据后重新发起。' : '申请内容已核对，审核通过。' });
        result.push(row);
      });
    });
    return result;
  }

  function isPending(row) { return row && row.status === '待审核' && row.assignee === currentUser.id && !row.handledBy; }
  function filterRecords(list, tab, filters) {
    var keyword = filters.keyword.trim().toLowerCase();
    return list.filter(function (row) {
      var belongs = tab === 'pending' ? isPending(row) : tab === 'mine' ? row.applicantId === currentUser.id : row.handledBy === currentUser.id;
      return belongs && (!filters.source || row.source === filters.source) && (!filters.type || row.type === filters.type) &&
        (tab === 'pending' || !filters.status || row.status === filters.status) &&
        (!keyword || [row.title, row.type, row.source, row.applicant].some(function (value) { return value.toLowerCase().indexOf(keyword) >= 0; }));
    }).sort(function (a, b) { return b.applyTime.localeCompare(a.applyTime) || b.id.localeCompare(a.id); });
  }
  function filteredRows() { return filterRecords(records, activeTab, state()); }
  function pageRows() { var s = state(); return filteredRows().slice((s.page - 1) * s.size, s.page * s.size); }
  function findRecord(id) { return records.find(function (row) { return row.id === id; }); }
  function applyDecision(ids, result, opinion, time) {
    if (['审核通过', '审核驳回'].indexOf(result) < 0 || (result === '审核驳回' && !opinion.trim()) || opinion.length > 500) return 0;
    var targets = ids.map(findRecord);
    if (!targets.length || new Set(ids).size !== ids.length || targets.some(function (row) { return !isPending(row); })) return 0;
    targets.forEach(function (row) {
      row.status = result;
      row.handledBy = currentUser.id;
      row.decision = { result: result, opinion: opinion.trim() || '同意。', time: time };
      row.history.push({ actor: currentUser.name, action: result, time: time, opinion: row.decision.opinion });
    });
    return targets.length;
  }
  function loadRecords() {
    records = seedRecords();
    try {
      var saved = JSON.parse(window.localStorage.getItem(storageKey) || 'null');
      if (saved && saved.version === 1 && saved.decisions && typeof saved.decisions === 'object') {
        Object.keys(saved.decisions).forEach(function (id) {
          var decision = saved.decisions[id];
          if (decision && typeof decision.opinion === 'string' && /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(decision.time)) {
            var row = findRecord(id);
            if (row && decision.time >= row.applyTime) applyDecision([id], decision.result, decision.opinion, decision.time);
          }
        });
      }
    } catch (error) { /* 存储不可用或数据损坏时，仍可演示当前会话。 */ }
  }
  function persist() {
    var decisions = {};
    records.forEach(function (row) { if (row.decision) decisions[row.id] = row.decision; });
    try { window.localStorage.setItem(storageKey, JSON.stringify({ version: 1, decisions: decisions })); return true; } catch (error) { return false; }
  }
  function now() {
    var date = new Date();
    function pad(value) { return String(value).padStart(2, '0'); }
    return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate()) + ' ' + pad(date.getHours()) + ':' + pad(date.getMinutes()) + ':' + pad(date.getSeconds());
  }
  function statusTag(status) {
    var classes = { '待审核': 'tag-blue', '审核通过': 'tag-green', '审核驳回': 'tag-red', '审核完成': 'tag-purple' };
    return '<span class="tag mt-status ' + classes[status] + '">' + esc(status) + '</span>';
  }
  function options(values, value, placeholder) {
    return '<option value="">' + esc(placeholder) + '</option>' + values.map(function (item) {
      return '<option value="' + esc(item) + '"' + (item === value ? ' selected' : '') + '>' + esc(item) + '</option>';
    }).join('');
  }
  function notice(message, error) {
    var el = root.querySelector('[data-mt-notice]');
    if (!el) return;
    el.textContent = message || '';
    el.classList.toggle('is-error', !!error);
  }
  function captureDraft() {
    var input = root.querySelector('[data-mt-keyword]');
    if (input) state().draft = input.value;
  }
  function renderTabs() {
    return '<div class="pm-tabs mt-tabs" role="tablist" aria-label="我的工单">' + tabs.map(function (tab) {
      return '<button type="button" role="tab" id="mt-tab-' + tab[0] + '" aria-controls="mt-list-panel" aria-selected="' + (activeTab === tab[0]) + '" class="pm-tab' + (activeTab === tab[0] ? ' active' : '') + '" data-mt-action="tab" data-tab="' + tab[0] + '">' + tab[1] + '</button>';
    }).join('') + '</div>';
  }
  function renderList() {
    activeIds = []; handling = false;
    var s = state(), rows = filteredRows(), pages = Math.max(1, Math.ceil(rows.length / s.size));
    s.page = Math.min(Math.max(1, s.page), pages);
    root.innerHTML = renderTabs() + '<section class="mt-list-panel" id="mt-list-panel" role="tabpanel" aria-labelledby="mt-tab-' + activeTab + '">' +
      '<div class="mt-toolbar"><div class="mt-toolbar-left">' + (activeTab === 'pending' ? button('handle-selected', 'check2-square', '办理', '', 'btn-primary') + '<span class="mt-selection" data-mt-selection></span>' : '') + '</div>' +
      '<form class="mt-filters" data-mt-query><select class="lm-control mt-source" data-mt-filter="source" aria-label="来源系统">' + options(Object.keys(sources), s.source, '来源系统：全部') + '</select>' +
      '<select class="lm-control mt-type" data-mt-filter="type" aria-label="工单类型" title="' + esc(s.type || '先选择来源系统，再筛选工单类型') + '"' + (!s.source ? ' disabled' : '') + '>' + options(sources[s.source] || [], s.type, s.source ? '工单类型：全部' : '工单类型（先选来源）') + '</select>' +
      (activeTab === 'pending' ? '' : '<select class="lm-control mt-state" data-mt-filter="status" aria-label="流程状态">' + options(statusNames, s.status, '流程状态：全部') + '</select>') +
      '<input type="search" class="lm-control mt-keyword" data-mt-keyword value="' + esc(s.draft) + '" placeholder="关键字搜索" aria-label="关键字搜索">' +
      '<button type="submit" class="btn btn-primary"><i class="bi bi-search" aria-hidden="true"></i><span>查询</span></button></form></div>' +
      '<div class="mt-notice" data-mt-notice role="status" aria-live="polite"></div>' +
      '<div class="mt-table-wrap"><table class="ds-table mt-table" aria-label="' + esc(tabs.find(function (tab) { return tab[0] === activeTab; })[1]) + '">' + renderTable(pageRows()) + '</table></div>' +
      '<div class="ds-pagination mt-pagination"><span>共 <b>' + rows.length + '</b> 条</span><div class="page-nav">' + button('page', 'chevron-left', '上一页', 'data-page="' + (s.page - 1) + '"' + (s.page === 1 ? ' disabled' : '')) +
      Array.from({ length: pages }, function (_, i) { return '<button type="button" class="page-num' + (s.page === i + 1 ? ' active' : '') + '" data-mt-action="page" data-page="' + (i + 1) + '"' + (s.page === i + 1 ? ' aria-current="page"' : '') + '>' + (i + 1) + '</button>'; }).join('') +
      button('page', 'chevron-right', '下一页', 'data-page="' + (s.page + 1) + '"' + (s.page === pages ? ' disabled' : '')) + '</div><select class="lm-control mt-size" data-mt-size aria-label="每页条数">' + [10, 30, 50].map(function (size) { return '<option value="' + size + '"' + (s.size === size ? ' selected' : '') + '>' + size + ' 条/页</option>'; }).join('') + '</select></div></section>';
    updateSelection();
    root.querySelector('.mt-table-wrap').scrollTop = s.scroll;
  }
  function renderTable(rows) {
    var pending = activeTab === 'pending';
    return '<colgroup>' + (pending ? '<col style="width:42px">' : '') + '<col><col style="width:212px"><col style="width:104px"><col style="width:104px"><col style="width:84px"><col style="width:158px"><col style="width:94px"></colgroup>' +
      '<thead><tr>' + (pending ? '<th class="mt-check"><input type="checkbox" data-mt-all aria-label="选择本页待办工单"' + (rows.length ? '' : ' disabled') + '></th>' : '') +
      ['标题', '工单类型', '来源系统', '流程状态', '申请者', '申请时间', '操作'].map(function (label) { return '<th scope="col">' + label + '</th>'; }).join('') + '</tr></thead><tbody>' +
      (rows.length ? rows.map(function (row) {
        return '<tr data-mt-row="' + row.id + '">' + (pending ? '<td class="mt-check"><input type="checkbox" data-mt-check="' + row.id + '" aria-label="选择' + esc(row.title) + '"' + (selected.has(row.id) ? ' checked' : '') + '></td>' : '') +
          '<td><button type="button" class="mt-title" data-mt-action="detail" data-id="' + row.id + '" title="' + esc(row.title) + '"><i class="bi bi-file-earmark-text" aria-hidden="true"></i><span>' + esc(row.title) + '</span></button></td>' +
          '<td title="' + esc(row.type) + '">' + esc(row.type) + '</td><td>' + esc(row.source) + '</td><td>' + statusTag(row.status) + '</td><td>' + esc(row.applicant) + '</td><td class="mt-time">' + row.applyTime + '</td>' +
          '<td>' + button(pending ? 'handle' : 'detail', pending ? 'check2-square' : 'eye', pending ? '办理' : '查看', 'data-id="' + row.id + '"', 'mt-row-action') + '</td></tr>';
      }).join('') : '<tr><td colspan="' + (pending ? 8 : 7) + '"><div class="lm-empty"><i class="bi bi-inbox" aria-hidden="true"></i><strong>暂无工单</strong><span>' + (state().source || state().status || state().keyword ? '没有符合当前查询条件的工单，请调整条件后查询。' : pending ? '当前没有需要您办理的任务。' : '当前页签暂无工单记录。') + '</span></div></td></tr>') + '</tbody>';
  }
  function updateSelection() {
    if (activeTab !== 'pending' || activeIds.length) return;
    var visible = pageRows(), all = root.querySelector('[data-mt-all]');
    if (all) { all.checked = visible.length > 0 && visible.every(function (row) { return selected.has(row.id); }); all.indeterminate = selected.size > 0 && !all.checked; }
    root.querySelector('[data-mt-selection]').textContent = selected.size ? '已选 ' + selected.size + ' 项' : '';
    root.querySelectorAll('[data-mt-row]').forEach(function (el) { el.classList.toggle('is-selected', selected.has(el.dataset.mtRow)); });
  }
  function query() {
    var s = state(), source = root.querySelector('[data-mt-filter="source"]').value;
    captureDraft();
    s.type = source === s.source ? root.querySelector('[data-mt-filter="type"]').value : '';
    s.source = source;
    var status = root.querySelector('[data-mt-filter="status"]');
    s.status = status ? status.value : '';
    s.keyword = s.draft.trim(); s.page = 1; s.scroll = 0;
    selected.clear(); renderList();
  }
  function renderRecord(row) {
    return '<article class="mt-record"><div class="mt-record-heading"><h3>' + esc(row.title) + '</h3>' + statusTag(row.status) + '</div>' +
      view.fields('基本信息', [['工单类型', row.type], ['来源系统', row.source], ['申请者', row.applicant], ['申请时间', row.applyTime]]) +
      view.fields('申请内容', row.snapshot.fields) + '<section class="lm-detail-section"><h3>申请说明</h3><p class="mt-reason">' + esc(row.snapshot.reason) + '</p></section>' +
      '<section class="lm-detail-section"><h3>办理记录</h3><ol class="mt-history">' + row.history.map(function (entry) {
        return '<li><span class="mt-history-dot"></span><div class="mt-history-heading"><strong>' + esc(entry.action) + '</strong><span>' + esc(entry.actor) + '</span><time>' + esc(entry.time) + '</time></div><p>' + esc(entry.opinion) + '</p></li>';
      }).join('') + '</ol></section></article>';
  }
  function openDetail(ids, handle) {
    var targets = ids.map(findRecord).filter(Boolean);
    if (!targets.length || (handle && targets.some(function (row) { return !isPending(row); }))) { notice('请先勾选待审核的数据！', true); return; }
    captureDraft();
    var table = root.querySelector('.mt-table-wrap');
    if (table) state().scroll = table.scrollTop;
    returnId = ids.length === 1 ? ids[0] : '';
    activeIds = ids.slice(); handling = handle;
    root.innerHTML = '<div class="mt-detail-head"><div><h2>' + (handle ? '工单办理' : '工单详情') + '</h2><span>' + (targets.length > 1 ? '已选择 ' + targets.length + ' 项待办工单，请核对申请内容后办理' : esc(targets[0].type)) + '</span></div>' + button('back', 'arrow-left', '返回列表') + '</div>' +
      '<div class="mt-detail-scroll">' + (targets.length === 1 ? renderRecord(targets[0]) : '<div class="mt-batch-records">' + targets.map(function (row, index) {
        return '<details class="mt-batch-item"' + (index === 0 ? ' open' : '') + '><summary><i class="bi bi-chevron-right" aria-hidden="true"></i><span>' + esc(row.title) + '</span><small>' + esc(row.source) + '</small></summary>' + renderRecord(row) + '</details>';
      }).join('') + '</div>') +
      (handle ? '<form class="mt-approval" id="mt-approval"><h3>办理意见</h3><fieldset><legend>审核结果 <span class="mt-required">*</span></legend><label><input type="radio" name="mt-result" value="审核通过" required> 审核通过</label><label><input type="radio" name="mt-result" value="审核驳回"> 审核驳回</label></fieldset><label class="mt-opinion-label" for="mt-opinion">意见说明<span data-mt-opinion-hint>（驳回时必填）</span></label><textarea id="mt-opinion" name="opinion" maxlength="500" rows="3" placeholder="请输入办理意见" aria-describedby="mt-opinion-error"></textarea><div class="mt-opinion-bottom"><span id="mt-opinion-error" role="alert"></span><span data-mt-opinion-count>0 / 500</span></div></form>' : '') + '</div>' +
      '<div class="mt-detail-footer"><div class="mt-notice" data-mt-notice role="status" aria-live="polite"></div><div>' + button('back', handle ? 'x-lg' : 'arrow-left', handle ? '取消' : '返回列表') +
      (handle ? '<button type="submit" form="mt-approval" class="btn btn-primary"><i class="bi bi-check2" aria-hidden="true"></i><span>提交办理</span></button>' : '') + '</div></div>';
    root.querySelector('.mt-detail-head h2').setAttribute('tabindex', '-1');
    root.querySelector('.mt-detail-head h2').focus();
  }
  function backToList() {
    renderList();
    var target = returnId ? root.querySelector('[data-mt-action="detail"][data-id="' + returnId + '"]') : root.querySelector('[data-mt-action="handle-selected"]');
    if (target) target.focus({ preventScroll: true });
  }
  function submitDecision() {
    if (!handling) return;
    var choice = root.querySelector('input[name="mt-result"]:checked'), input = root.querySelector('#mt-opinion');
    var error = root.querySelector('#mt-opinion-error');
    if (!choice) { error.textContent = '请选择审核结果。'; root.querySelector('input[name="mt-result"]').focus(); return; }
    var opinion = input.value.trim();
    if ((choice.value === '审核驳回' && !opinion) || opinion.length > 500) {
      error.textContent = opinion.length > 500 ? '办理意见不能超过 500 字。' : '请填写驳回原因。';
      input.setAttribute('aria-invalid', 'true'); input.focus(); return;
    }
    var count = applyDecision(activeIds, choice.value, opinion, now());
    if (!count) { notice('工单状态已变化，请返回列表重新选择待办工单。', true); return; }
    var saved = persist(), result = choice.value;
    selected.clear(); renderList();
    notice('已办理 ' + count + ' 项工单：' + result + '，可在“已办任务”中查看。' + (saved ? '' : '当前浏览器无法保存，结果仅保留到本次页面关闭。'));
  }
  function init() {
    root = document.querySelector('.page-my-ticket');
    if (!root) return;
    if (!records) loadRecords();
    selected.clear();
    root.addEventListener('click', function (event) {
      var target = event.target.closest('[data-mt-action]');
      if (!target || target.disabled) return;
      var action = target.dataset.mtAction;
      if (action === 'tab') {
        captureDraft(); activeTab = target.dataset.tab; selected.clear(); renderList();
        root.querySelector('#mt-tab-' + activeTab).focus();
      } else if (action === 'page') {
        captureDraft(); state().page = Number(target.dataset.page); state().scroll = 0; selected.clear(); renderList();
      } else if (action === 'detail' || action === 'handle') openDetail([target.dataset.id], action === 'handle');
      else if (action === 'handle-selected') openDetail(Array.from(selected), true);
      else if (action === 'back') backToList();
    });
    root.addEventListener('change', function (event) {
      var target = event.target;
      if (target.matches('[data-mt-filter]')) query();
      else if (target.matches('[data-mt-size]')) { captureDraft(); state().size = Number(target.value); state().page = 1; state().scroll = 0; selected.clear(); renderList(); }
      else if (target.matches('[data-mt-check]')) { if (target.checked) selected.add(target.dataset.mtCheck); else selected.delete(target.dataset.mtCheck); updateSelection(); }
      else if (target.matches('[data-mt-all]')) {
        pageRows().forEach(function (row) { if (target.checked) selected.add(row.id); else selected.delete(row.id); });
        root.querySelectorAll('[data-mt-check]').forEach(function (input) { input.checked = selected.has(input.dataset.mtCheck); }); updateSelection();
      } else if (target.name === 'mt-result') {
        var opinion = root.querySelector('#mt-opinion');
        opinion.setAttribute('aria-required', String(target.value === '审核驳回'));
        root.querySelector('[data-mt-opinion-hint]').textContent = target.value === '审核驳回' ? '（请填写驳回原因）' : '（选填）';
        root.querySelector('#mt-opinion-error').textContent = ''; opinion.removeAttribute('aria-invalid');
      }
    });
    root.addEventListener('input', function (event) {
      if (event.target.matches('[data-mt-keyword]')) captureDraft();
      else if (event.target.id === 'mt-opinion') {
        root.querySelector('[data-mt-opinion-count]').textContent = event.target.value.length + ' / 500';
        root.querySelector('#mt-opinion-error').textContent = ''; event.target.removeAttribute('aria-invalid');
      }
    });
    root.addEventListener('submit', function (event) {
      event.preventDefault();
      if (event.target.matches('[data-mt-query]')) query();
      else if (event.target.id === 'mt-approval') submitDecision();
    });
    renderList();
  }
  return { html: '<section class="page-my-ticket" aria-label="我的工单"></section>', init: init };
}());
