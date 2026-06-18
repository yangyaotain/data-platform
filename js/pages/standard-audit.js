/**
 * 数据中台 V4.0 - 数据资产 / 元数据管理 / 标准稽查
 * 静态高保真原型：稽查结果列表、标准替换确认、右侧详情切换
 */
window.DP = window.DP || {};
DP.pages = DP.pages || {};

DP.pages.standardAudit = (function () {
  var state = {
    selectedIds: {},
    treeKey: 'master_id',
    keyword: '',
    detailId: null
  };

  var treeData = [
    {
      key: 'biz',
      label: '业务部 (1)',
      icon: 'bi-folder-fill',
      open: true,
      children: [
        { key: 'master_id', label: '主数据编码', icon: 'bi-card-list', active: true }
      ]
    },
    {
      key: 'dw',
      label: '数仓组 (2)',
      icon: 'bi-folder-fill',
      open: true,
      children: [
        { key: 'phone', label: '手机号码', icon: 'bi-card-list' },
        { key: 'grid_id', label: '网格id', icon: 'bi-card-list' }
      ]
    }
  ];

  var rows = [
    {
      id: 1,
      code: 'order_00000026',
      englishName: 'tms_demo.a_template_city_distance.id',
      metaEnglish: 'id',
      standardEnglish: 'master_id',
      standardCode: 'order_00000008',
      alias: '主数据编码',
      description: '主数据编码',
      category: '业务部',
      consistency: { match: 7, mismatch: 4, total: 11, rate: '63.64%' },
      remark: '主数据编码',
      dataType: 'bigint',
      length: '19',
      precision: '0',
      desensitizeRule: '',
      qualityRule: '',
      encryptRule: '',
      dataLevel: '',
      dataClass: '业务部 (order)'
    },
    {
      id: 2,
      code: 'order_00000025',
      englishName: 'aierp_pro_test.appversion.Id',
      metaEnglish: 'Id',
      standardEnglish: 'master_id',
      standardCode: 'order_00000008',
      alias: '主数据编码',
      description: '主数据编码',
      category: '业务部',
      consistency: { match: 7, mismatch: 4, total: 11, rate: '63.64%' },
      remark: '主数据编码',
      dataType: 'bigint',
      length: '19',
      precision: '0',
      desensitizeRule: '',
      qualityRule: '',
      encryptRule: '',
      dataLevel: '',
      dataClass: '业务部 (order)'
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

  function getCurrentStandard() {
    return {
      name: '主数据编码',
      english: 'master_id',
      code: 'order_00000008',
      schedule: '5 28 14 17 6 ? 2026'
    };
  }

  function getFilteredRows() {
    var keyword = state.keyword.trim().toLowerCase();
    if (!keyword) return rows.slice();
    return rows.filter(function (item) {
      return [item.code, item.englishName, item.alias, item.remark].some(function (text) {
        return String(text).toLowerCase().indexOf(keyword) >= 0;
      });
    });
  }

  function getSelectedRows() {
    return rows.filter(function (item) { return state.selectedIds[item.id]; });
  }

  function getRowById(id) {
    return rows.filter(function (item) { return String(item.id) === String(id); })[0] || rows[0];
  }

  function renderTreeNodes(nodes) {
    return nodes.map(function (node) {
      var hasChildren = node.children && node.children.length;
      var childHtml = hasChildren ? '<ul>' + renderTreeNodes(node.children) + '</ul>' : '';
      return '<li class="sa-tree-node ' + (node.open ? 'open' : '') + '">' +
        '<button class="sa-tree-row ' + (state.treeKey === node.key ? 'active' : '') + '" type="button" data-sa-tree="' + node.key + '">' +
          (hasChildren ? '<i class="bi bi-chevron-down sa-tree-arrow"></i>' : '<span class="sa-tree-spacer"></span>') +
          '<i class="bi ' + node.icon + ' sa-tree-icon"></i>' +
          '<span>' + escapeHtml(node.label) + '</span>' +
        '</button>' +
        childHtml +
      '</li>';
    }).join('');
  }

  function renderLeftPanel() {
    return '<aside class="sa-left-panel">' +
      '<div class="sa-tree-search">' +
        '<input type="text" placeholder="关键字搜索" data-sa-tree-search>' +
        '<button type="button" data-sa-action="tree-search" aria-label="搜索"><i class="bi bi-search"></i></button>' +
      '</div>' +
      '<div class="sa-tree-wrap"><ul class="sa-tree">' + renderTreeNodes(treeData) + '</ul></div>' +
    '</aside>';
  }

  function renderStatusHeader() {
    var standard = getCurrentStandard();
    return '<div class="sa-summary">' +
      '<div class="sa-summary-main">' +
        '<h2>' + standard.name + '【' + standard.english + '】【' + standard.code + '】</h2>' +
        '<div class="sa-summary-meta">' +
          '<span>稽查结果（一致/不一致/全部）： <b class="ok">0</b> / <b class="bad">2</b> / <b>2</b></span>' +
          '<span>一致率： <b>0%</b></span>' +
          '<span>调度任务： ' + standard.schedule + ' 执行 <a href="javascript:;" data-sa-action="schedule">启动调度</a></span>' +
          '<span>状态： <b class="success">执行成功</b></span>' +
        '</div>' +
      '</div>' +
      '<button class="btn btn-primary sa-run-btn" type="button" data-sa-action="run-now"><i class="bi bi-play-fill"></i> 立即执行</button>' +
    '</div>';
  }

  function renderToolbar() {
    return '<div class="sa-toolbar">' +
      '<button class="btn btn-primary" type="button" data-sa-action="batch-replace"><i class="bi bi-arrow-repeat"></i> 标准替换</button>' +
      '<div class="sa-search-box">' +
        '<input type="text" value="' + escapeHtml(state.keyword) + '" placeholder="编码/名称/备注" data-sa-keyword>' +
        '<button class="btn btn-primary" type="button" data-sa-action="query"><i class="bi bi-search"></i> 查询</button>' +
      '</div>' +
    '</div>';
  }

  function renderConsistency(item) {
    return '<span class="sa-rate"><b>' + item.consistency.match + '</b>/<em>' + item.consistency.mismatch + '</em>/' + item.consistency.total + '(' + item.consistency.rate + ')</span>';
  }

  function renderTableRows() {
    var data = getFilteredRows();
    return data.map(function (item) {
      return '<tr>' +
        '<td class="sa-col-check"><input type="checkbox" data-sa-row-check="' + item.id + '" ' + (state.selectedIds[item.id] ? 'checked' : '') + ' aria-label="选择' + escapeHtml(item.code) + '"></td>' +
        '<td>' + escapeHtml(item.code) + '</td>' +
        '<td title="' + escapeHtml(item.englishName) + '">' + escapeHtml(item.englishName) + '</td>' +
        '<td>' + escapeHtml(item.alias) + '</td>' +
        '<td>' + escapeHtml(item.category) + '</td>' +
        '<td>' + renderConsistency(item) + '</td>' +
        '<td>' + escapeHtml(item.remark) + '</td>' +
        '<td class="sa-actions">' +
          '<button type="button" data-sa-action="single-replace" data-id="' + item.id + '"><i class="bi bi-arrow-repeat"></i> 标准替换</button>' +
          '<button type="button" data-sa-action="view-detail" data-id="' + item.id + '"><i class="bi bi-eye"></i> 查看详情</button>' +
        '</td>' +
      '</tr>';
    }).join('');
  }

  function renderListView() {
    return renderStatusHeader() +
      renderToolbar() +
      '<div class="sa-table-wrap">' +
        '<table class="sa-table">' +
          '<colgroup><col class="sa-w-check"><col class="sa-w-code"><col class="sa-w-name"><col class="sa-w-alias"><col class="sa-w-category"><col class="sa-w-rate"><col class="sa-w-remark"><col class="sa-w-action"></colgroup>' +
          '<thead><tr>' +
            '<th class="sa-col-check"><input type="checkbox" data-sa-check-all aria-label="全选"></th>' +
            '<th>编码</th><th>英文名称</th><th>别名</th><th>数据分类</th><th>一致性</th><th>备注</th><th>操作</th>' +
          '</tr></thead>' +
          '<tbody>' + renderTableRows() + '</tbody>' +
        '</table>' +
      '</div>' +
      '<div class="sa-footnote">显示第 1 到第 ' + getFilteredRows().length + ' 条记录，总共 ' + getFilteredRows().length + ' 条记录</div>';
  }

  function infoTip(text, blocked) {
    var copy = blocked ? text + ' 元数据技术属性不能替换' : text;
    return '<span class="sa-field-tip"><i class="bi bi-info-circle-fill"></i> ' + escapeHtml(copy) + '</span>';
  }

  function renderField(label, meta, standard, options) {
    options = options || {};
    var tag = options.area ? 'textarea' : (options.select ? 'select' : 'div');
    var metaClass = options.diff ? ' diff' : '';
    var standardClass = options.diff ? ' diff' : '';
    var metaControl = tag === 'textarea'
      ? '<textarea class="sa-field-control' + metaClass + '" readonly>' + escapeHtml(meta) + '</textarea>'
      : tag === 'select'
        ? '<select class="sa-field-control" disabled><option>' + escapeHtml(meta || '') + '</option></select>'
        : '<div class="sa-field-control' + metaClass + '">' + escapeHtml(meta) + '</div>';
    var standardControl = tag === 'textarea'
      ? '<textarea class="sa-field-control' + standardClass + '" readonly>' + escapeHtml(standard) + '</textarea>'
      : tag === 'select'
        ? '<select class="sa-field-control" disabled><option>' + escapeHtml(standard || '') + '</option></select>'
        : '<div class="sa-field-control' + standardClass + '">' + escapeHtml(standard) + '</div>';
    return '<div class="sa-detail-row ' + (options.area ? 'area' : '') + '">' +
      '<div class="sa-detail-label">' + escapeHtml(label) + ':</div>' +
      metaControl +
      standardControl +
      infoTip(label, options.blocked) +
    '</div>';
  }

  function renderDetailGroup(title, rowsHtml) {
    return '<section class="sa-detail-section"><h3>' + escapeHtml(title) + '</h3>' + rowsHtml + '</section>';
  }

  function renderDetailView(row) {
    row = row || rows[0];
    return '<div class="sa-detail-view" data-sa-detail-id="' + row.id + '">' +
      '<div class="sa-detail-top">' +
        '<div class="sa-detail-headings"><span>元数据</span><span>数据标准</span></div>' +
        '<div class="sa-detail-actions">' +
          '<button class="btn btn-primary" type="button" data-sa-action="single-replace" data-id="' + row.id + '"><i class="bi bi-arrow-repeat"></i> 标准替换</button>' +
          '<button class="btn btn-outline" type="button" data-sa-action="back-list"><i class="bi bi-arrow-left"></i> 返回</button>' +
        '</div>' +
      '</div>' +
      '<div class="sa-detail-scroll">' +
        renderDetailGroup('基本信息',
          renderField('编码', row.code, row.standardCode, { blocked: true }) +
          renderField('英文名', row.metaEnglish, row.standardEnglish, { diff: true, blocked: true }) +
          renderField('别名', row.alias, row.alias) +
          renderField('描述', row.description, row.remark, { area: true })
        ) +
        renderDetailGroup('技术信息',
          renderField('数据类型', row.dataType, '', { diff: true, blocked: true }) +
          renderField('长度', row.length, '', { diff: true, blocked: true }) +
          renderField('精度', row.precision, '', { diff: true, blocked: true }) +
          renderField('脱敏规则', row.desensitizeRule, '', { select: true }) +
          renderField('质量规则', row.qualityRule, '', { select: true }) +
          renderField('加密规则', row.encryptRule, '', { select: true })
        ) +
        renderDetailGroup('业务信息',
          renderField('数据分类', row.dataClass, row.dataClass, { select: true }) +
          renderField('数据分级', row.dataLevel, '', { select: true })
        ) +
      '</div>' +
    '</div>';
  }

  function renderRight(page) {
    var right = page.querySelector('[data-sa-right]');
    if (!right) return;
    right.innerHTML = state.detailId ? renderDetailView(getRowById(state.detailId)) : renderListView();
    updateCheckAll(page);
  }

  function updateCheckAll(page) {
    var checkAll = page.querySelector('[data-sa-check-all]');
    var visible = getFilteredRows();
    var checked = visible.filter(function (item) { return state.selectedIds[item.id]; }).length;
    if (checkAll) {
      checkAll.checked = visible.length > 0 && checked === visible.length;
      checkAll.indeterminate = checked > 0 && checked < visible.length;
    }
  }

  function showToast(page, text) {
    var oldToast = page.querySelector('.sa-toast');
    if (oldToast) oldToast.remove();
    page.insertAdjacentHTML('beforeend', '<div class="sa-toast">' + escapeHtml(text) + '</div>');
    var toast = page.querySelector('.sa-toast');
    setTimeout(function () { toast.classList.add('show'); }, 20);
    setTimeout(function () { if (toast) toast.remove(); }, 1800);
  }

  function renderConfirmModal(type, row) {
    var message = type === 'batch'
      ? '<strong>确定要替换这些记录吗</strong><span>替换后将无法恢复，请谨慎操作！</span>'
      : '<strong>您确定要将' + escapeHtml(row.metaEnglish) + '【' + escapeHtml(row.alias) + '】的<br>元数据替换成标准吗?</strong>';
    return '<div class="sa-confirm-mask" data-sa-confirm-mask>' +
      '<div class="sa-confirm" role="dialog" aria-modal="true" aria-label="标准替换确认">' +
        '<button class="sa-confirm-close" type="button" data-sa-action="close-confirm" aria-label="关闭"><i class="bi bi-x-lg"></i></button>' +
        '<div class="sa-confirm-body">' +
          '<div class="sa-confirm-icon"><i class="bi bi-exclamation-lg"></i></div>' +
          '<div class="sa-confirm-text">' + message + '</div>' +
        '</div>' +
        '<div class="sa-confirm-footer">' +
          '<button class="btn btn-outline" type="button" data-sa-action="close-confirm"><i class="bi bi-x-lg"></i> 取消</button>' +
          '<button class="btn btn-primary" type="button" data-sa-action="confirm-replace"><i class="bi bi-check-lg"></i> 确定</button>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  function openConfirm(page, type, row) {
    closeConfirm(page);
    page.setAttribute('data-sa-confirm-type', type);
    page.setAttribute('data-sa-confirm-row', row ? row.id : '');
    page.insertAdjacentHTML('beforeend', renderConfirmModal(type, row));
  }

  function closeConfirm(page) {
    var mask = page.querySelector('[data-sa-confirm-mask]');
    if (mask) mask.remove();
  }

  function applyReplace(page) {
    var type = page.getAttribute('data-sa-confirm-type');
    var rowId = page.getAttribute('data-sa-confirm-row');
    var targets = type === 'batch' ? getSelectedRows() : [getRowById(rowId)];
    targets.forEach(function (item) {
      if (!item) return;
      item.metaEnglish = item.standardEnglish;
      item.code = item.standardCode;
      item.dataType = '';
      item.length = '';
      item.precision = '';
      item.consistency = { match: 11, mismatch: 0, total: 11, rate: '100%' };
    });
    state.selectedIds = {};
    closeConfirm(page);
    renderRight(page);
    showToast(page, type === 'batch' ? '已完成批量标准替换' : '已完成标准替换');
  }

  function bindEvents(page) {
    page.addEventListener('click', function (e) {
      var actionEl = e.target.closest('[data-sa-action]');
      var treeRow = e.target.closest('[data-sa-tree]');

      if (treeRow) {
        state.treeKey = treeRow.getAttribute('data-sa-tree');
        page.querySelectorAll('.sa-tree-row').forEach(function (item) { item.classList.remove('active'); });
        treeRow.classList.add('active');
        return;
      }

      if (!actionEl) return;
      var action = actionEl.getAttribute('data-sa-action');
      var id = actionEl.getAttribute('data-id');

      if (action === 'query') {
        var keyword = page.querySelector('[data-sa-keyword]');
        state.keyword = keyword ? keyword.value : '';
        renderRight(page);
      } else if (action === 'batch-replace') {
        var selected = getSelectedRows();
        if (!selected.length) {
          showToast(page, '请先勾选需要替换的记录');
          return;
        }
        openConfirm(page, 'batch');
      } else if (action === 'single-replace') {
        openConfirm(page, 'single', getRowById(id));
      } else if (action === 'view-detail') {
        state.detailId = id;
        renderRight(page);
      } else if (action === 'back-list') {
        state.detailId = null;
        renderRight(page);
      } else if (action === 'close-confirm') {
        closeConfirm(page);
      } else if (action === 'confirm-replace') {
        applyReplace(page);
      } else if (action === 'run-now') {
        showToast(page, '稽查任务已开始执行');
      } else if (action === 'schedule') {
        showToast(page, '调度任务已启动');
      }
    });

    page.addEventListener('change', function (e) {
      if (e.target.matches('[data-sa-check-all]')) {
        getFilteredRows().forEach(function (item) {
          if (e.target.checked) state.selectedIds[item.id] = true;
          else delete state.selectedIds[item.id];
        });
        renderRight(page);
      } else if (e.target.matches('[data-sa-row-check]')) {
        var id = e.target.getAttribute('data-sa-row-check');
        if (e.target.checked) state.selectedIds[id] = true;
        else delete state.selectedIds[id];
        updateCheckAll(page);
      }
    });

    page.addEventListener('input', function (e) {
      if (!e.target.matches('[data-sa-tree-search]')) return;
      var keyword = e.target.value.trim().toLowerCase();
      page.querySelectorAll('.sa-tree-node').forEach(function (node) {
        var text = node.textContent.toLowerCase();
        node.style.display = !keyword || text.indexOf(keyword) >= 0 ? '' : 'none';
      });
    });

    page.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && e.target.matches('[data-sa-keyword]')) {
        var queryBtn = page.querySelector('[data-sa-action="query"]');
        if (queryBtn) queryBtn.click();
      }
    });
  }

  return {
    html: '<div class="page-standard-audit">' +
      '<div class="sa-layout">' +
        renderLeftPanel() +
        '<section class="sa-right-panel" data-sa-right></section>' +
      '</div>' +
    '</div>',

    init: function () {
      var page = document.querySelector('.page-standard-audit');
      if (!page) return;
      state.selectedIds = {};
      state.keyword = '';
      state.detailId = null;
      bindEvents(page);
      renderRight(page);
    }
  };
})();
