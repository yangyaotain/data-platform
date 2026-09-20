/** 数据中台 V4.0 - 数据开发 / 回收站（数据开发流程） */
window.DP = window.DP || {};
DP.pages = DP.pages || {};

DP.pages.developmentRecycle = (function () {
  'use strict';

  var root;
  var rows = [];
  var state;
  var seedRows = [
    ['recycle-01', '订单主题ODS增量入仓流程', '李沐阳', '2026-09-20 16:42:18'],
    ['recycle-02', '商品主数据全量采集流程', '陈思远', '2026-09-20 15:36:42'],
    ['recycle-03', '门店经营指标日汇总流程', '周语桐', '2026-09-20 14:28:05'],
    ['recycle-04', '物流轨迹实时明细处理流程', '赵明川', '2026-09-20 11:17:33'],
    ['recycle-05', '承运商账单明细加工流程', '孙嘉禾', '2026-09-19 17:05:26'],
    ['recycle-06', '客户地址信息标准化流程', '李沐阳', '2026-09-19 15:48:11'],
    ['recycle-07', '仓库库存日快照生成流程', '陈思远', '2026-09-19 10:22:57'],
    ['recycle-08', '配送超时异常识别流程', '周语桐', '2026-09-18 16:31:44'],
    ['recycle-09', '运费结算差异核验流程', '赵明川', '2026-09-18 14:09:36'],
    ['recycle-10', '干线运输时效统计流程', '孙嘉禾', '2026-09-18 09:53:20'],
    ['recycle-11', '供应商档案同步流程', '李沐阳', '2026-09-17 17:26:13'],
    ['recycle-12', '交易订单事件接入流程', '陈思远', '2026-09-17 15:14:09'],
    ['recycle-13', '会员消费标签计算流程', '周语桐', '2026-09-17 11:38:52'],
    ['recycle-14', '营销活动转化分析流程', '赵明川', '2026-09-16 16:42:37'],
    ['recycle-15', '供应履约质量评估流程', '孙嘉禾', '2026-09-16 13:20:45'],
    ['recycle-16', '售后服务工单同步流程', '李沐阳', '2026-09-16 09:18:24'],
    ['recycle-17', '区域销售指标汇总流程', '陈思远', '2026-09-15 17:08:56'],
    ['recycle-18', '车辆定位点位清洗流程', '周语桐', '2026-09-15 14:33:19'],
    ['recycle-19', '签收回单数据归档流程', '赵明川', '2026-09-15 10:46:08'],
    ['recycle-20', '冷链温控数据聚合流程', '孙嘉禾', '2026-09-14 16:25:47'],
    ['recycle-21', '资金对账明细汇总流程', '李沐阳', '2026-09-14 11:52:31'],
    ['recycle-22', '渠道订单整库同步流程', '陈思远', '2026-09-13 15:37:16']
  ].map(function (item) { return { id: item[0], name: item[1], operator: item[2], operatedAt: item[3] }; });

  function clone(value) { return JSON.parse(JSON.stringify(value)); }
  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (char) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char];
    });
  }
  function button(action, icon, label, cls, attrs) {
    return '<button type="button" class="btn ' + (cls || 'btn-outline') + '" data-dr-action="' + action + '" ' + (attrs || '') + '><i class="bi bi-' + icon + '" aria-hidden="true"></i><span>' + esc(label) + '</span></button>';
  }
  function filteredRows() {
    var keyword = state.keyword.toLowerCase();
    return rows.filter(function (item) { return !keyword || item.name.toLowerCase().indexOf(keyword) >= 0; });
  }
  function pageData() {
    var filtered = filteredRows();
    var pageCount = Math.max(1, Math.ceil(filtered.length / state.pageSize));
    if (state.page > pageCount) state.page = pageCount;
    var start = (state.page - 1) * state.pageSize;
    return { filtered: filtered, pageCount: pageCount, rows: filtered.slice(start, start + state.pageSize) };
  }
  function modalHtml() {
    if (!state.modal) return '';
    return '<div class="dr-modal-mask"><section class="dr-confirm-modal" role="alertdialog" aria-modal="true" aria-labelledby="drConfirmTitle"><header><h3 id="drConfirmTitle">提示</h3><button type="button" data-dr-action="close-modal" aria-label="关闭"><i class="bi bi-x-lg"></i></button></header><div class="dr-confirm-body"><i class="bi bi-question-circle"></i><p>' + esc(state.modal.message) + '</p></div><footer><button class="btn btn-outline" type="button" data-dr-action="close-modal"><span>取消</span></button><button class="btn btn-primary" type="button" data-dr-action="confirm"><span>确定</span></button></footer></section></div>';
  }
  function paginationHtml(total, pageCount) {
    var pages = '';
    for (var page = 1; page <= pageCount; page += 1) {
      pages += '<button type="button" class="' + (page === state.page ? 'active' : '') + '" data-dr-action="page" data-page="' + page + '">' + page + '</button>';
    }
    return '<footer class="dr-pagination"><span>共 ' + total + ' 条</span><div class="dr-page-controls"><button type="button" data-dr-action="prev" aria-label="上一页"' + (state.page <= 1 ? ' disabled' : '') + '><i class="bi bi-chevron-left"></i></button>' + pages + '<button type="button" data-dr-action="next" aria-label="下一页"' + (state.page >= pageCount ? ' disabled' : '') + '><i class="bi bi-chevron-right"></i></button><select data-dr-page-size aria-label="每页条数"><option value="10"' + (state.pageSize === 10 ? ' selected' : '') + '>10 条/页</option><option value="15"' + (state.pageSize === 15 ? ' selected' : '') + '>15 条/页</option><option value="20"' + (state.pageSize === 20 ? ' selected' : '') + '>20 条/页</option><option value="30"' + (state.pageSize === 30 ? ' selected' : '') + '>30 条/页</option></select><span>跳至</span><input type="text" inputmode="numeric" value="' + state.page + '" data-dr-jump aria-label="跳转页码"><span>页</span></div></footer>';
  }
  function tableHtml() {
    var data = pageData();
    var allChecked = data.rows.length > 0 && data.rows.every(function (item) { return state.selected.has(item.id); });
    var body = data.rows.length ? data.rows.map(function (item) {
      return '<tr class="' + (state.selected.has(item.id) ? 'selected' : '') + '"><td><input type="checkbox" data-dr-check="' + item.id + '" aria-label="选择' + esc(item.name) + '"' + (state.selected.has(item.id) ? ' checked' : '') + '></td><td title="' + esc(item.name) + '"><span class="dr-flow-name">' + esc(item.name) + '</span></td><td>' + esc(item.operator) + '</td><td>' + esc(item.operatedAt) + '</td><td class="dr-sticky-action"><div class="dr-row-actions">' + button('restore-row', 'arrow-counterclockwise', '恢复', 'btn-text', 'data-id="' + item.id + '"') + button('delete-row', 'trash3', '删除', 'btn-text danger', 'data-id="' + item.id + '"') + '</div></td></tr>';
    }).join('') : '<tr><td colspan="5"><div class="dr-empty"><i class="bi bi-inbox"></i><span>暂无数据</span></div></td></tr>';
    return '<div class="dr-table-wrap"><table class="dr-table"><colgroup><col class="dr-col-check"><col class="dr-col-name"><col class="dr-col-operator"><col class="dr-col-time"><col class="dr-col-action"></colgroup><thead><tr><th><input type="checkbox" data-dr-check-all aria-label="全选"' + (allChecked ? ' checked' : '') + '></th><th>名称</th><th>操作者</th><th>操作时间</th><th class="dr-sticky-action">操作</th></tr></thead><tbody>' + body + '</tbody></table></div>' + paginationHtml(data.filtered.length, data.pageCount);
  }
  function render() {
    root.innerHTML = '<div class="dr-page"><div class="dr-toolbar"><div class="dr-toolbar-actions">' + button('batch-restore', 'arrow-counterclockwise', '批量恢复', 'btn-primary') + button('batch-delete', 'trash3', '批量删除', 'btn-outline') + '</div><div class="dr-query"><div class="dr-keyword"><i class="bi bi-search"></i><input type="text" data-dr-keyword value="' + esc(state.keywordDraft) + '" placeholder="名称模糊搜索" aria-label="名称模糊搜索"></div>' + button('query', 'search', '查询', 'btn-primary') + '</div></div><section class="dr-table-section">' + tableHtml() + '</section>' + modalHtml() + '<div class="dr-toast" data-dr-toast role="status"></div></div>';
    bind();
  }
  function toast(message) {
    var element = root.querySelector('[data-dr-toast]');
    if (!element) return;
    element.textContent = message;
    element.classList.add('show');
    clearTimeout(state.toastTimer);
    state.toastTimer = setTimeout(function () { if (element) element.classList.remove('show'); }, 1800);
  }
  function selectedIds() { return Array.from(state.selected).filter(function (id) { return rows.some(function (item) { return item.id === id; }); }); }
  function openBatch(kind) {
    var ids = selectedIds();
    if (!ids.length) { toast('未选择数据'); return; }
    state.modal = { kind: kind, ids: ids, message: kind === 'restore' ? '您确认要恢复选择的' + ids.length + '条记录吗' : '您确认要删除选择的' + ids.length + '条记录吗' };
    render();
  }
  function openRow(kind, id) {
    var row = rows.find(function (item) { return item.id === id; });
    if (!row) return;
    state.modal = { kind: kind, ids: [id], message: kind === 'restore' ? '您确认要恢复【' + row.name + '】吗？' : '您确认要删除【' + row.name + '】吗？' };
    render();
  }
  function confirmAction() {
    var modal = state.modal;
    if (!modal) return;
    var ids = new Set(modal.ids);
    rows = rows.filter(function (item) { return !ids.has(item.id); });
    modal.ids.forEach(function (id) { state.selected.delete(id); });
    state.modal = null;
    render();
    toast(modal.kind === 'restore' ? '恢复成功' : '删除成功');
  }
  function query() {
    state.keyword = state.keywordDraft.trim();
    state.page = 1;
    state.selected.clear();
    render();
  }
  function bind() {
    root.querySelectorAll('[data-dr-action]').forEach(function (control) {
      control.addEventListener('click', function () {
        var action = this.dataset.drAction;
        if (action === 'query') query();
        if (action === 'batch-restore') openBatch('restore');
        if (action === 'batch-delete') openBatch('delete');
        if (action === 'restore-row') openRow('restore', this.dataset.id);
        if (action === 'delete-row') openRow('delete', this.dataset.id);
        if (action === 'close-modal') { state.modal = null; render(); }
        if (action === 'confirm') confirmAction();
        if (action === 'prev' && state.page > 1) { state.page -= 1; render(); }
        if (action === 'next' && state.page < pageData().pageCount) { state.page += 1; render(); }
        if (action === 'page') { state.page = Number(this.dataset.page); render(); }
      });
    });
    var keyword = root.querySelector('[data-dr-keyword]');
    if (keyword) {
      keyword.addEventListener('input', function () { state.keywordDraft = this.value; });
      keyword.addEventListener('keydown', function (event) { if (event.key === 'Enter') { state.keywordDraft = this.value; query(); } });
    }
    var checkAll = root.querySelector('[data-dr-check-all]');
    if (checkAll) checkAll.addEventListener('change', function () { pageData().rows.forEach(function (item) { if (checkAll.checked) state.selected.add(item.id); else state.selected.delete(item.id); }); render(); });
    root.querySelectorAll('[data-dr-check]').forEach(function (input) { input.addEventListener('change', function () { if (this.checked) state.selected.add(this.dataset.drCheck); else state.selected.delete(this.dataset.drCheck); render(); }); });
    var jump = root.querySelector('[data-dr-jump]');
    if (jump) jump.addEventListener('keydown', function (event) { if (event.key === 'Enter') { var target = Number(this.value); var count = pageData().pageCount; if (Number.isFinite(target)) { state.page = Math.min(count, Math.max(1, Math.floor(target))); render(); } } });
    var pageSize = root.querySelector('[data-dr-page-size]');
    if (pageSize) pageSize.addEventListener('change', function () { state.pageSize = Number(this.value); state.page = 1; state.selected.clear(); render(); });
    var mask = root.querySelector('.dr-modal-mask');
    if (mask) mask.addEventListener('click', function (event) { if (event.target === mask) { state.modal = null; render(); } });
  }
  function init() {
    root = DP.contentArea.querySelector('.page-development-recycle');
    if (!root) return;
    rows = clone(seedRows);
    state = { keywordDraft: '', keyword: '', selected: new Set(), page: 1, pageSize: 15, modal: null, toastTimer: null };
    render();
  }

  return { html: '<div class="page-development-recycle"></div>', init: init };
}());
