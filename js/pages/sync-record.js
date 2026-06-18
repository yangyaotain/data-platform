/**
 * 数据中台 V4.0 - 数据资产 / 元数据管理 / 同步记录
 */
window.DP = window.DP || {};
DP.pages = DP.pages || {};

DP.pages.syncRecord = (function () {
  var state = {
    selectedSource: 'all',
    selectedLabel: '全部',
    keyword: '',
    page: 1,
    pageSize: 10
  };

  var sourceTree = [
    { id: 'all', label: '全部', value: 'all', icon: 'bi-database', iconClass: 'root' },
    {
      id: 'zd-demo', label: '中电数治演示', value: '中电数治演示', icon: 'bi-stack', iconClass: 'stack', open: true, children: [
        { id: 'hdfs', label: 'HDFS', value: '中电数治演示/HDFS', icon: 'bi-cloud-fill', iconClass: 'hdfs' },
        { id: 'oracle', label: 'oracle数据源', value: '中电数治演示/oracle数据源', icon: 'bi-database-fill', iconClass: 'oracle' },
        { id: 'hive-link', label: 'hive链接', value: '中电数治演示/hive链接', icon: 'bi-plugin', iconClass: 'hive' },
        {
          id: 'warehouse-root', label: '中电数智演示数仓库', value: '中电数治演示/中电数智演示数仓库', icon: 'bi-box-seam-fill', iconClass: 'warehouse', open: true, children: [
            {
              id: 'warehouse-db', label: '中电数智演示数仓库', value: '中电数治演示/中电数智演示数仓库/中电数智演示数仓库', icon: 'bi-diagram-3-fill', iconClass: 'db', open: true, children: [
                { id: 'zz_tms_ads', label: 'zz_tms_ads', value: '中电数治演示/中电数智演示数仓库/zz_tms_ads', icon: 'bi-key-fill', iconClass: 'table' },
                { id: 'zz_tms_dim', label: 'zz_tms_dim', value: '中电数治演示/中电数智演示数仓库/zz_tms_dim', icon: 'bi-key-fill', iconClass: 'table' },
                { id: 'zz_tms_dwd', label: 'zz_tms_dwd', value: '中电数治演示/中电数智演示数仓库/zz_tms_dwd', icon: 'bi-key-fill', iconClass: 'table' },
                { id: 'zz_tms_dws', label: 'zz_tms_dws', value: '中电数治演示/中电数智演示数仓库/zz_tms_dws', icon: 'bi-key-fill', iconClass: 'table' },
                { id: 'zz_tms_ods', label: 'zz_tms_ods', value: '中电数治演示/中电数智演示数仓库/zz_tms_ods', icon: 'bi-key-fill', iconClass: 'table' }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'biz-system', label: '业务系统', value: '业务系统', icon: 'bi-stack', iconClass: 'stack', open: true, children: [
        { id: 'sim-data', label: '仿真数据', value: '业务系统/仿真数据', icon: 'bi-folder-fill', iconClass: 'folder' },
        {
          id: 'logistics-root', label: '物流系统', value: '业务系统/物流系统', icon: 'bi-box-seam-fill', iconClass: 'warehouse', open: true, children: [
            {
              id: 'logistics-db', label: '物流系统', value: '业务系统/物流系统/物流系统', icon: 'bi-diagram-3-fill', iconClass: 'db', open: true, children: [
                { id: 'iptv', label: 'iptv', value: '业务系统/物流系统/iptv', icon: 'bi-folder-fill', iconClass: 'folder' }
              ]
            }
          ]
        },
        {
          id: 'work-order', label: '工单系统', value: '业务系统/工单系统', icon: 'bi-box-seam-fill', iconClass: 'warehouse', open: true, children: [
            { id: 'aierp_pro_test', label: 'aierp_pro_test', value: '业务系统/工单系统/aierp_pro_test', icon: 'bi-database-fill', iconClass: 'db' }
          ]
        }
      ]
    }
  ];

  var records = [
    row('中电数治演示/hive链接/zz_tms_ads', '2026-05-29 14:32:04', '2026-05-29 14:32:04', '0s', 12),
    row('中电数治演示/hive链接/zz_tms_ads', '2026-05-29 13:54:35', '2026-05-29 13:54:36', '1s', 15),
    row('业务系统/工单系统/aierp_pro_test', '2026-05-22 09:45:02', '2026-05-22 09:45:02', '0s', 14),
    row('业务系统/工单系统/aierp_pro_test', '2026-05-22 09:44:36', '2026-05-22 09:44:36', '0s', 12),
    row('业务系统/工单系统/aierp_pro_test', '2026-05-22 09:43:42', '2026-05-22 09:43:43', '1s', 11),
    row('业务系统/工单系统/aierp_pro_test', '2026-05-22 09:42:43', '2026-05-22 09:42:44', '1s', 5),
    row('中电数治演示/中电数智演示数仓库/zz_tms_ods', '2026-05-22 09:31:15', '2026-05-22 09:31:16', '1s', 21),
    row('中电数治演示/中电数智演示数仓库/zz_tms_ods', '2026-05-22 09:30:56', '2026-05-22 09:30:57', '1s', 29),
    row('中电数治演示/中电数智演示数仓库/zz_tms_ods', '2026-05-22 09:30:39', '2026-05-22 09:30:40', '1s', 13),
    row('中电数治演示/中电数智演示数仓库/zz_tms_ods', '2026-05-22 09:30:24', '2026-05-22 09:30:25', '1s', 14),
    row('中电数治演示/中电数智演示数仓库/zz_tms_dwd', '2026-05-21 18:12:11', '2026-05-21 18:12:12', '1s', 18),
    row('中电数治演示/中电数智演示数仓库/zz_tms_dws', '2026-05-21 18:11:03', '2026-05-21 18:11:04', '1s', 16),
    row('中电数治演示/中电数智演示数仓库/zz_tms_dim', '2026-05-21 17:52:48', '2026-05-21 17:52:49', '1s', 8),
    row('中电数治演示/oracle数据源/tms_order_core', '2026-05-20 16:28:22', '2026-05-20 16:28:23', '1s', 10),
    row('中电数治演示/HDFS/dwd_customer_profile', '2026-05-20 15:16:08', '2026-05-20 15:16:09', '1s', 22),
    row('业务系统/物流系统/iptv', '2026-05-19 10:08:31', '2026-05-19 10:08:31', '0s', 7),
    row('业务系统/仿真数据/sim_trade_detail', '2026-05-18 11:24:53', '2026-05-18 11:24:54', '1s', 17),
    row('中电数治演示/hive链接/zz_tms_ads', '2026-05-17 14:06:48', '2026-05-17 14:06:49', '1s', 19)
  ];

  while (records.length < 53) {
    var seed = records[records.length % 18];
    var index = records.length + 1;
    records.push(row(seed.source, '2026-05-' + pad(16 - (index % 12)) + ' ' + pad(8 + (index % 10)) + ':' + pad(10 + (index % 48)) + ':' + pad(index % 60), '2026-05-' + pad(16 - (index % 12)) + ' ' + pad(8 + (index % 10)) + ':' + pad(10 + (index % 48)) + ':' + pad((index + 1) % 60), (index % 4 === 0 ? '0s' : '1s'), 5 + (index % 27)));
  }

  function row(source, startTime, endTime, duration, count) {
    return {
      source: source,
      startTime: startTime,
      endTime: endTime,
      duration: duration,
      status: '执行完成',
      count: count,
      action: '--'
    };
  }

  function pad(num) {
    return String(num).padStart(2, '0');
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function flattenTree(items, output) {
    output = output || [];
    items.forEach(function (item) {
      output.push(item);
      if (item.children) flattenTree(item.children, output);
    });
    return output;
  }

  function sourceMatches(record) {
    if (state.selectedSource === 'all') return true;
    return record.source.indexOf(state.selectedSource) === 0 || record.source.indexOf(state.selectedLabel) >= 0;
  }

  function getFilteredRows() {
    return records.filter(sourceMatches);
  }

  function renderTree(items, depth) {
    return items.map(function (item) {
      var hasChildren = item.children && item.children.length;
      var openClass = hasChildren && item.open ? ' open' : '';
      var activeClass = state.selectedSource === item.value ? ' active' : '';
      var searchText = (item.label + ' ' + item.value).toLowerCase();
      return '<li class="sr-tree-node' + openClass + '" data-sr-node="' + escapeHtml(item.id) + '" data-sr-depth="' + depth + '" data-sr-search="' + escapeHtml(searchText) + '">' +
        '<div class="sr-tree-row' + activeClass + '" data-sr-source="' + escapeHtml(item.value) + '" data-sr-label="' + escapeHtml(item.label) + '">' +
          (hasChildren ? '<span class="sr-tree-toggle" data-sr-toggle="' + escapeHtml(item.id) + '"><i class="bi ' + (item.open ? 'bi-chevron-down' : 'bi-chevron-right') + '"></i></span>' : '<span class="sr-tree-spacer"></span>') +
          '<i class="bi ' + item.icon + ' sr-tree-icon ' + item.iconClass + '"></i>' +
          '<span class="sr-tree-text" title="' + escapeHtml(item.value) + '">' + escapeHtml(item.label) + '</span>' +
        '</div>' +
        (hasChildren ? '<ul style="' + (item.open ? '' : 'display:none;') + '">' + renderTree(item.children, depth + 1) + '</ul>' : '') +
      '</li>';
    }).join('');
  }

  function renderRows(rows) {
    var start = (state.page - 1) * state.pageSize;
    var pageRows = rows.slice(start, start + state.pageSize);
    return pageRows.map(function (item) {
      return '<tr>' +
        '<td title="' + escapeHtml(item.source) + '">' + escapeHtml(item.source) + '</td>' +
        '<td title="' + escapeHtml(item.startTime) + '">' + escapeHtml(item.startTime) + '</td>' +
        '<td title="' + escapeHtml(item.endTime) + '">' + escapeHtml(item.endTime) + '</td>' +
        '<td>' + escapeHtml(item.duration) + '</td>' +
        '<td><span class="sr-status-success">' + escapeHtml(item.status) + '</span></td>' +
        '<td>' + escapeHtml(item.count) + '</td>' +
        '<td><span class="sr-action-empty">' + escapeHtml(item.action) + '</span></td>' +
      '</tr>';
    }).join('');
  }

  function renderPagination(rows) {
    var total = rows.length;
    var pageCount = Math.max(1, Math.ceil(total / state.pageSize));
    var start = total ? (state.page - 1) * state.pageSize + 1 : 0;
    var end = Math.min(state.page * state.pageSize, total);
    var buttons = [];
    buttons.push('<button type="button" data-sr-page="' + Math.max(1, state.page - 1) + '">‹</button>');
    for (var i = 1; i <= Math.min(6, pageCount); i++) {
      buttons.push('<button type="button" class="' + (i === state.page ? 'active' : '') + '" data-sr-page="' + i + '">' + i + '</button>');
    }
    buttons.push('<button type="button" data-sr-page="' + Math.min(pageCount, state.page + 1) + '">›</button>');

    return '<div class="sr-page-left">' +
        '<span class="sr-page-summary">显示第 ' + start + ' 到第 ' + end + ' 条记录，总共 ' + total + ' 条记录&nbsp; 每页显示</span>' +
        '<select class="sr-page-size" data-sr-page-size>' +
          '<option value="10"' + (state.pageSize === 10 ? ' selected' : '') + '>10</option>' +
          '<option value="20"' + (state.pageSize === 20 ? ' selected' : '') + '>20</option>' +
          '<option value="50"' + (state.pageSize === 50 ? ' selected' : '') + '>50</option>' +
        '</select>' +
        '<span>条记录</span>' +
      '</div>' +
      '<div class="sr-page-right">' +
        '<div class="sr-page-nav">' + buttons.join('') + '</div>' +
        '<div class="sr-page-jump"><input value="' + state.page + '" data-sr-jump aria-label="页码"><button type="button" data-sr-go>GO</button></div>' +
      '</div>';
  }

  function refresh(pageEl) {
    var rows = getFilteredRows();
    var pageCount = Math.max(1, Math.ceil(rows.length / state.pageSize));
    state.page = Math.min(Math.max(1, state.page), pageCount);
    pageEl.querySelector('[data-sr-source-text]').textContent = state.selectedLabel;
    pageEl.querySelector('[data-sr-tree]').innerHTML = renderTree(sourceTree, 0);
    pageEl.querySelector('[data-sr-table-body]').innerHTML = renderRows(rows);
    pageEl.querySelector('[data-sr-pagination]').innerHTML = renderPagination(rows);
  }

  function filterTree(pageEl, keyword) {
    var value = keyword.trim().toLowerCase();
    pageEl.querySelectorAll('.sr-tree-node').forEach(function (node) {
      node.classList.remove('hidden');
    });
    if (!value) return;

    pageEl.querySelectorAll('.sr-tree-node').forEach(function (node) {
      var text = node.getAttribute('data-sr-search') || '';
      var childMatch = Array.prototype.some.call(node.querySelectorAll('.sr-tree-node'), function (child) {
        return (child.getAttribute('data-sr-search') || '').indexOf(value) >= 0;
      });
      var matched = text.indexOf(value) >= 0 || childMatch;
      node.classList.toggle('hidden', !matched);
      if (matched) {
        var childList = node.querySelector(':scope > ul');
        var toggle = node.querySelector(':scope > .sr-tree-row .sr-tree-toggle i');
        if (childList) childList.style.display = '';
        if (toggle) {
          toggle.classList.remove('bi-chevron-right');
          toggle.classList.add('bi-chevron-down');
        }
      }
    });
  }

  function findSource(value) {
    return flattenTree(sourceTree).filter(function (item) {
      return item.value === value;
    })[0];
  }

  function bind(pageEl) {
    var picker = pageEl.querySelector('[data-sr-source-picker]');
    var trigger = pageEl.querySelector('[data-sr-source-trigger]');
    var search = pageEl.querySelector('[data-sr-tree-search]');

    trigger.addEventListener('click', function () {
      picker.classList.toggle('open');
      if (picker.classList.contains('open')) search.focus();
    });

    document.addEventListener('click', function (event) {
      if (!pageEl.contains(event.target) || !picker.contains(event.target)) {
        picker.classList.remove('open');
      }
    });

    search.addEventListener('input', function () {
      filterTree(pageEl, search.value);
    });

    pageEl.addEventListener('click', function (event) {
      var toggle = event.target.closest('[data-sr-toggle]');
      if (toggle) {
        event.stopPropagation();
        var node = toggle.closest('.sr-tree-node');
        var list = node.querySelector(':scope > ul');
        var icon = toggle.querySelector('i');
        var isOpen = list && list.style.display !== 'none';
        if (list) list.style.display = isOpen ? 'none' : '';
        if (icon) {
          icon.classList.toggle('bi-chevron-right', isOpen);
          icon.classList.toggle('bi-chevron-down', !isOpen);
        }
        return;
      }

      var sourceRow = event.target.closest('[data-sr-source]');
      if (sourceRow) {
        state.selectedSource = sourceRow.getAttribute('data-sr-source');
        state.selectedLabel = sourceRow.getAttribute('data-sr-label');
        state.page = 1;
        picker.classList.remove('open');
        refresh(pageEl);
        return;
      }

      var pageButton = event.target.closest('[data-sr-page]');
      if (pageButton) {
        state.page = Number(pageButton.getAttribute('data-sr-page')) || 1;
        refresh(pageEl);
        return;
      }

      if (event.target.closest('[data-sr-go]')) {
        var jump = pageEl.querySelector('[data-sr-jump]');
        state.page = Number(jump.value) || 1;
        refresh(pageEl);
        return;
      }

      if (event.target.closest('[data-sr-query]')) {
        var selected = findSource(state.selectedSource);
        state.selectedLabel = selected ? selected.label : '全部';
        state.page = 1;
        refresh(pageEl);
      }
    });

    pageEl.addEventListener('change', function (event) {
      if (event.target.matches('[data-sr-page-size]')) {
        state.pageSize = Number(event.target.value) || 10;
        state.page = 1;
        refresh(pageEl);
      }
    });
  }

  return {
    html: '<div class="page-sync-record">' +
      '<div class="sr-filter-bar">' +
        '<label class="sr-filter-field"><span class="sr-label">数据源:</span>' +
          '<span class="sr-source-picker" data-sr-source-picker>' +
            '<button class="sr-source-trigger" type="button" data-sr-source-trigger><span data-sr-source-text>全部</span><i class="bi bi-chevron-down"></i></button>' +
            '<div class="sr-source-dropdown">' +
              '<div class="sr-tree-search"><input type="text" data-sr-tree-search aria-label="搜索数据源"><i class="bi bi-search"></i></div>' +
              '<div class="sr-tree-scroll"><ul class="sr-tree" data-sr-tree></ul></div>' +
            '</div>' +
          '</span>' +
        '</label>' +
        '<label class="sr-filter-field"><span class="sr-label">选择时间:</span><input class="sr-date-input" type="text" value="2026-05-17 14:06:48 - 2026-06-17 14:06:48" aria-label="选择时间"></label>' +
        '<button class="btn btn-primary sr-query-btn" type="button" data-sr-query><i class="bi bi-search"></i> 查询</button>' +
      '</div>' +
      '<div class="sr-table-wrap">' +
        '<table class="sr-table">' +
          '<colgroup><col style="width:18%"><col style="width:16%"><col style="width:15%"><col style="width:14%"><col style="width:13%"><col style="width:13%"><col style="width:11%"></colgroup>' +
          '<thead><tr><th>数据源</th><th>开始时间</th><th>完成时间</th><th>耗时</th><th>状态</th><th>同步记录</th><th>操作</th></tr></thead>' +
          '<tbody data-sr-table-body></tbody>' +
        '</table>' +
      '</div>' +
      '<div class="sr-pagination" data-sr-pagination></div>' +
    '</div>',
    init: function () {
      var pageEl = document.querySelector('.page-sync-record');
      if (!pageEl) return;
      state.selectedSource = 'all';
      state.selectedLabel = '全部';
      state.page = 1;
      state.pageSize = 10;
      refresh(pageEl);
      bind(pageEl);
    }
  };
})();
