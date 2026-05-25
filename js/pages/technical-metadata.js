/**
 * 数据中台 V4.0 - 数据治理 / 元数据管理 / 技术元数据
 * 静态高保真原型：目录树 + 筛选工具栏 + 技术元数据表格
 */
window.DP = window.DP || {};
DP.pages = DP.pages || {};

DP.pages.technicalMetadata = (function () {
  var seedRows = [
    { id: 1, code: 'TM-DB-ADS-001', name: 'zz_tms_ads', alias: 'zz_tms_ads', status: '已关联', dataType: '-', precision: '-', length: '-', remark: '运输主题应用库' },
    { id: 2, code: 'TM-TB-ADS-001', name: 'zz_tms_ads.ads_driver_stats', alias: 'ads_driver_stats', status: '已关联', dataType: '-', precision: '-', length: '-', remark: '司机主题' },
    { id: 3, code: 'TM-FD-ADS-001', name: 'zz_tms_ads.ads_driver_stats.avg_trans_finish_distance', alias: 'avg_trans_finish_distance', status: '已关联', dataType: 'DECIMAL', precision: '2', length: '16', remark: '平均交易完成距离' },
    { id: 4, code: 'TM-FD-ADS-002', name: 'zz_tms_ads.ads_driver_stats.avg_trans_finish_duration', alias: 'avg_trans_finish_duration', status: '未关联', dataType: 'BIGINT', precision: '0', length: '19', remark: '平均交易完成时长' },
    { id: 5, code: 'TM-FD-ADS-003', name: 'zz_tms_ads.ads_driver_stats.driver_emp_id', alias: 'driver_emp_id', status: '已关联', dataType: 'BIGINT', precision: '0', length: '19', remark: '司机员工ID' },
    { id: 6, code: 'TM-FD-ADS-004', name: 'zz_tms_ads.ads_driver_stats.driver_name', alias: 'driver_name', status: '已关联', dataType: 'STRING', precision: '0', length: '2147483647', remark: '司机姓名' },
    { id: 7, code: 'TM-FD-ADS-005', name: 'zz_tms_ads.ads_driver_stats.dt', alias: 'dt', status: '未关联', dataType: 'STRING', precision: '0', length: '2147483647', remark: '分区日期' },
    { id: 8, code: 'TM-FD-ADS-006', name: 'zz_tms_ads.ads_driver_stats.ins_by', alias: 'ins_by', status: '未关联', dataType: 'STRING', precision: '0', length: '2147483647', remark: '创建人' },
    { id: 9, code: 'TM-FD-ADS-007', name: 'zz_tms_ads.ads_driver_stats.ins_dt', alias: 'ins_dt', status: '未关联', dataType: 'STRING', precision: '0', length: '2147483647', remark: '创建时间' },
    { id: 10, code: 'TM-FD-ADS-008', name: 'zz_tms_ads.ads_driver_stats.recent_days', alias: 'recent_days', status: '已关联', dataType: 'TINYINT', precision: '0', length: '3', remark: '统计最近天数：7/30/90' },
    { id: 11, code: 'TM-FD-ADS-009', name: 'zz_tms_ads.ads_driver_stats.trans_finish_count', alias: 'trans_finish_count', status: '未关联', dataType: 'BIGINT', precision: '0', length: '19', remark: '完成运输次数' },
    { id: 12, code: 'TM-FD-ADS-010', name: 'zz_tms_ads.ads_driver_stats.trans_finish_distance', alias: 'trans_finish_distance', status: '未关联', dataType: 'DECIMAL', precision: '2', length: '16', remark: '完成运输里程' },
    { id: 13, code: 'TM-FD-ADS-011', name: 'zz_tms_ads.ads_driver_stats.trans_finish_dur_sec', alias: 'trans_finish_dur_sec', status: '未关联', dataType: 'BIGINT', precision: '0', length: '19', remark: '总运输时长秒' },
    { id: 14, code: 'TM-FD-ADS-012', name: 'zz_tms_ads.ads_driver_stats.trans_finish_late_count', alias: 'trans_finish_late_count', status: '未关联', dataType: 'BIGINT', precision: '0', length: '19', remark: '超时完成次数' },
    { id: 15, code: 'TM-TB-ADS-002', name: 'zz_tms_ads.ads_express_city_stats', alias: 'ads_express_city_stats', status: '已关联', dataType: '-', precision: '-', length: '-', remark: '各城市快递统计' },
    { id: 16, code: 'TM-FD-ADS-013', name: 'zz_tms_ads.ads_express_city_stats.city_id', alias: 'city_id', status: '已关联', dataType: 'BIGINT', precision: '0', length: '19', remark: '城市ID' },
    { id: 17, code: 'TM-FD-ADS-014', name: 'zz_tms_ads.ads_express_city_stats.city_name', alias: 'city_name', status: '已关联', dataType: 'STRING', precision: '0', length: '2147483647', remark: '城市名称' },
    { id: 18, code: 'TM-FD-ADS-015', name: 'zz_tms_ads.ads_express_city_stats.deliver_suc_count', alias: 'deliver_suc_count', status: '未关联', dataType: 'BIGINT', precision: '0', length: '19', remark: '派送成功数' },
    { id: 19, code: 'TM-FD-ADS-016', name: 'zz_tms_ads.ads_express_city_stats.dt', alias: 'dt', status: '未关联', dataType: 'STRING', precision: '0', length: '2147483647', remark: '分区日期' },
    { id: 20, code: 'TM-FD-ADS-017', name: 'zz_tms_ads.ads_express_city_stats.ins_by', alias: 'ins_by', status: '已关联', dataType: 'STRING', precision: '0', length: '2147483647', remark: '创建人' },
    { id: 21, code: 'TM-FD-ADS-018', name: 'zz_tms_ads.ads_express_city_stats.ins_dt', alias: 'ins_dt', status: '未关联', dataType: 'STRING', precision: '0', length: '2147483647', remark: '创建时间' },
    { id: 22, code: 'TM-TB-DIM-001', name: 'zz_tms_dim.dim_city', alias: 'dim_city', status: '已关联', dataType: '-', precision: '-', length: '-', remark: '城市维度表' },
    { id: 23, code: 'TM-FD-DIM-001', name: 'zz_tms_dim.dim_city.city_id', alias: 'city_id', status: '已关联', dataType: 'BIGINT', precision: '0', length: '19', remark: '城市主键' },
    { id: 24, code: 'TM-FD-DIM-002', name: 'zz_tms_dim.dim_city.city_name', alias: 'city_name', status: '已关联', dataType: 'STRING', precision: '0', length: '2147483647', remark: '城市名称' },
    { id: 25, code: 'TM-TB-DWD-001', name: 'zz_tms_dwd.dwd_order_detail_di', alias: 'dwd_order_detail_di', status: '未关联', dataType: '-', precision: '-', length: '-', remark: '订单明细事实表' },
    { id: 26, code: 'TM-FD-DWD-001', name: 'zz_tms_dwd.dwd_order_detail_di.order_id', alias: 'order_id', status: '未关联', dataType: 'STRING', precision: '0', length: '128', remark: '运单编号' },
    { id: 27, code: 'TM-FD-DWD-002', name: 'zz_tms_dwd.dwd_order_detail_di.customer_id', alias: 'customer_id', status: '未关联', dataType: 'BIGINT', precision: '0', length: '19', remark: '客户ID' },
    { id: 28, code: 'TM-FD-DWD-003', name: 'zz_tms_dwd.dwd_order_detail_di.pay_amount', alias: 'pay_amount', status: '未关联', dataType: 'DECIMAL', precision: '2', length: '18', remark: '支付金额' },
    { id: 29, code: 'TM-TB-DWS-001', name: 'zz_tms_dws.dws_driver_work_1d', alias: 'dws_driver_work_1d', status: '未关联', dataType: '-', precision: '-', length: '-', remark: '司机工作量日汇总' },
    { id: 30, code: 'TM-FD-DWS-001', name: 'zz_tms_dws.dws_driver_work_1d.work_order_cnt', alias: 'work_order_cnt', status: '未关联', dataType: 'BIGINT', precision: '0', length: '19', remark: '工作运单数' }
  ];

  var generatedTables = [
    'ads_transport_route_stats',
    'ads_customer_service_stats',
    'ads_warehouse_dispatch_stats',
    'dws_city_transport_1d',
    'dws_driver_quality_1d',
    'dwd_waybill_track_di',
    'dwd_trans_finish_detail_di',
    'ods_tms_order',
    'ods_tms_driver',
    'ods_tms_vehicle',
    'dim_driver',
    'dim_vehicle',
    'dim_region',
    'dim_org',
    'ads_finance_settle_stats',
    'ads_route_timeout_stats'
  ];
  var generatedFields = [
    { alias: 'id', dataType: 'BIGINT', precision: '0', length: '19', remark: '主键ID' },
    { alias: 'org_id', dataType: 'BIGINT', precision: '0', length: '19', remark: '组织ID' },
    { alias: 'route_code', dataType: 'STRING', precision: '0', length: '128', remark: '线路编码' },
    { alias: 'province_name', dataType: 'STRING', precision: '0', length: '2147483647', remark: '省份名称' },
    { alias: 'order_cnt', dataType: 'BIGINT', precision: '0', length: '19', remark: '运单数量' },
    { alias: 'finish_rate', dataType: 'DECIMAL', precision: '4', length: '12', remark: '完成率' },
    { alias: 'amount', dataType: 'DECIMAL', precision: '2', length: '18', remark: '统计金额' },
    { alias: 'dt', dataType: 'STRING', precision: '0', length: '2147483647', remark: '分区日期' }
  ];
  var metadataRows = seedRows.slice();
  var nextId = metadataRows.length + 1;
  function buildMetaCode(schema, tableName, fieldAlias, index) {
    var layer = schema.replace('zz_tms_', '').toUpperCase();
    var target = fieldAlias ? 'FD' : 'TB';
    var sequence = String(index).padStart(3, '0');
    return 'TM-' + target + '-' + layer + '-' + sequence;
  }
  generatedTables.forEach(function (tableName, tableIndex) {
    var schema = tableName.indexOf('ods_') === 0 ? 'zz_tms_ods' : (tableName.indexOf('dwd_') === 0 ? 'zz_tms_dwd' : (tableName.indexOf('dws_') === 0 ? 'zz_tms_dws' : (tableName.indexOf('dim_') === 0 ? 'zz_tms_dim' : 'zz_tms_ads')));
    metadataRows.push({
      id: nextId++,
      code: buildMetaCode(schema, tableName, '', tableIndex + 31),
      name: schema + '.' + tableName,
      alias: tableName,
      status: tableIndex % 5 === 0 ? '已关联' : '未关联',
      dataType: '-',
      precision: '-',
      length: '-',
      remark: tableName.indexOf('dim_') === 0 ? '维度主题表' : '主题统计表'
    });
    generatedFields.forEach(function (field, fieldIndex) {
      if (metadataRows.length >= 112) return;
      metadataRows.push({
        id: nextId++,
        code: buildMetaCode(schema, tableName, field.alias, tableIndex * generatedFields.length + fieldIndex + 31),
        name: schema + '.' + tableName + '.' + field.alias,
        alias: field.alias,
        status: fieldIndex === 0 && tableIndex % 5 === 0 ? '已关联' : '未关联',
        dataType: field.dataType,
        precision: field.precision,
        length: field.length,
        remark: field.remark
      });
    });
  });

  var state = {
    page: 1,
    pageSize: 20,
    status: '',
    keyword: '',
    sortKey: '',
    sortDir: 'asc',
    selectedIds: {}
  };

  function resetState() {
    state.page = 1;
    state.pageSize = 20;
    state.status = '';
    state.keyword = '';
    state.sortKey = '';
    state.sortDir = 'asc';
    state.selectedIds = {};
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function getFilteredRows() {
    var keyword = state.keyword.toLowerCase();
    var rows = metadataRows.filter(function (row) {
      if (state.status && row.status !== state.status) return false;
      if (!keyword) return true;
      return [row.code, row.name, row.alias, row.remark].join(' ').toLowerCase().indexOf(keyword) >= 0;
    });
    if (!state.sortKey) return rows;
    return rows.slice().sort(function (a, b) {
      var av = String(a[state.sortKey] || '');
      var bv = String(b[state.sortKey] || '');
      if (state.sortKey === 'precision' || state.sortKey === 'length') {
        av = av === '-' ? -1 : Number(av);
        bv = bv === '-' ? -1 : Number(bv);
      }
      if (av > bv) return state.sortDir === 'asc' ? 1 : -1;
      if (av < bv) return state.sortDir === 'asc' ? -1 : 1;
      return 0;
    });
  }

  function getVisibleRows() {
    var rows = getFilteredRows();
    var totalPages = Math.max(1, Math.ceil(rows.length / state.pageSize));
    if (state.page > totalPages) state.page = totalPages;
    var start = (state.page - 1) * state.pageSize;
    return rows.slice(start, start + state.pageSize);
  }

  function renderStatus(status) {
    return '<span class="tm-status tm-status-' + (status === '已关联' ? 'linked' : 'unlinked') + '">' + status + '</span>';
  }

  function renderRow(row) {
    return '<tr data-tm-row-id="' + row.id + '">' +
      '<td class="tm-col-check"><input type="checkbox" data-tm-row-check="' + row.id + '"' + (state.selectedIds[row.id] ? ' checked' : '') + ' aria-label="选择记录"></td>' +
      '<td title="' + escapeHtml(row.code) + '">' + escapeHtml(row.code) + '</td>' +
      '<td title="' + escapeHtml(row.name) + '">' + escapeHtml(row.name) + '</td>' +
      '<td title="' + escapeHtml(row.alias) + '">' + escapeHtml(row.alias) + '</td>' +
      '<td>' + renderStatus(row.status) + '</td>' +
      '<td title="' + escapeHtml(row.dataType) + '">' + escapeHtml(row.dataType) + '</td>' +
      '<td title="' + escapeHtml(row.precision) + '">' + escapeHtml(row.precision) + '</td>' +
      '<td title="' + escapeHtml(row.length) + '">' + escapeHtml(row.length) + '</td>' +
      '<td title="' + escapeHtml(row.remark) + '">' + escapeHtml(row.remark) + '</td>' +
    '</tr>';
  }

  function updateSortButtons(page) {
    page.querySelectorAll('[data-tm-sort]').forEach(function (button) {
      var key = button.getAttribute('data-tm-sort');
      if (key === state.sortKey) {
        button.setAttribute('data-sort-dir', state.sortDir);
      } else {
        button.removeAttribute('data-sort-dir');
      }
    });
  }

  function updateCheckAll(page, visibleRows) {
    var checkAll = page.querySelector('[data-tm-check-all]');
    if (!checkAll) return;
    var checkedCount = visibleRows.filter(function (row) { return state.selectedIds[row.id]; }).length;
    checkAll.checked = visibleRows.length > 0 && checkedCount === visibleRows.length;
    checkAll.indeterminate = checkedCount > 0 && checkedCount < visibleRows.length;
  }

  function renderPager(page, total) {
    var totalPages = Math.max(1, Math.ceil(total / state.pageSize));
    var start = total ? (state.page - 1) * state.pageSize + 1 : 0;
    var end = Math.min(state.page * state.pageSize, total);
    var info = page.querySelector('[data-tm-page-info]');
    var nav = page.querySelector('[data-tm-page-nav]');
    if (info) {
      info.innerHTML = '显示第 ' + start + ' 到第 ' + end + ' 条记录，每页显示 ' +
        '<select class="tm-page-size" data-tm-page-size aria-label="每页显示条数">' +
          '<option value="20"' + (state.pageSize === 20 ? ' selected' : '') + '>20</option>' +
          '<option value="50"' + (state.pageSize === 50 ? ' selected' : '') + '>50</option>' +
          '<option value="100"' + (state.pageSize === 100 ? ' selected' : '') + '>100</option>' +
        '</select> 条记录';
    }
    if (!nav) return;
    var html = '<button class="tm-page-btn" data-tm-page="prev" ' + (state.page === 1 ? 'disabled' : '') + ' aria-label="上一页">‹</button>';
    for (var i = 1; i <= totalPages; i++) {
      html += '<button class="tm-page-num ' + (i === state.page ? 'active' : '') + '" data-tm-page="' + i + '">' + i + '</button>';
    }
    html += '<button class="tm-page-btn" data-tm-page="next" ' + (state.page === totalPages ? 'disabled' : '') + ' aria-label="下一页">›</button>';
    nav.innerHTML = html;
  }

  function renderTable(page) {
    var rows = getFilteredRows();
    var visibleRows = getVisibleRows();
    var tbody = page.querySelector('[data-tm-table-body]');
    if (tbody) {
      tbody.innerHTML = visibleRows.length
        ? visibleRows.map(renderRow).join('')
        : '<tr class="tm-empty-row"><td colspan="9">暂无匹配的技术元数据</td></tr>';
    }
    renderPager(page, rows.length);
    updateSortButtons(page);
    updateCheckAll(page, visibleRows);
  }

  function getSelectedRows() {
    var ids = Object.keys(state.selectedIds);
    return ids.map(function (id) {
      return metadataRows.filter(function (row) { return String(row.id) === String(id); })[0];
    }).filter(Boolean);
  }

  function getCreateCount() {
    var selectedRows = getSelectedRows();
    return selectedRows.length || 19;
  }

  function renderCreateModal(count) {
    return '<div class="tm-modal-mask" data-tm-modal-mask>' +
      '<div class="tm-modal" role="dialog" aria-modal="true" aria-label="创建业务元数据">' +
        '<div class="tm-modal-header">' +
          '<h3>创建业务元数据</h3>' +
          '<button class="tm-modal-close" data-tm-action="close-modal" aria-label="关闭"><i class="bi bi-x-lg"></i></button>' +
        '</div>' +
        '<div class="tm-modal-body">' +
          '<div class="tm-form-row"><label>范围:</label><select data-tm-range><option value="selected">已选记录</option><option value="all">全部记录</option></select></div>' +
          '<div class="tm-form-row tm-form-text-row"><label>记录数:</label><div class="tm-record-count" data-tm-record-count>您已选择' + count + '条记录</div></div>' +
          '<div class="tm-form-row"><label>库模型:</label><select><option>库模型</option><option>Hive库模型</option><option>MySQL库模型</option></select></div>' +
          '<div class="tm-form-row"><label>表模型:</label><select><option>表模型（默认）</option><option>事实表模型</option><option>维度表模型</option><option>汇总表模型</option></select></div>' +
          '<div class="tm-form-row"><label>字段模型:</label><select autofocus><option>字段模型</option><option>公共字段模型</option><option>指标字段模型</option></select></div>' +
        '</div>' +
        '<div class="tm-modal-footer">' +
          '<button class="btn btn-primary" data-tm-action="save-business-meta">确定</button>' +
          '<button class="btn btn-outline" data-tm-action="close-modal">取消</button>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  function openCreateModal(page) {
    closeCreateModal(page);
    page.insertAdjacentHTML('beforeend', renderCreateModal(getCreateCount()));
    var fieldModelSelect = page.querySelector('.tm-form-row:last-child select');
    if (fieldModelSelect) {
      setTimeout(function () {
        fieldModelSelect.focus();
      }, 0);
    }
  }

  function closeCreateModal(page) {
    var modal = page.querySelector('[data-tm-modal-mask]');
    if (modal) modal.remove();
  }

  function updateModalRecordCount(page) {
    var rangeSelect = page.querySelector('[data-tm-range]');
    var countText = page.querySelector('[data-tm-record-count]');
    if (!rangeSelect || !countText) return;
    if (rangeSelect.value === 'all') {
      countText.textContent = '共' + metadataRows.length + '条记录';
    } else {
      countText.textContent = '您已选择' + getCreateCount() + '条记录';
    }
  }

  function showToast(page, text) {
    var old = page.querySelector('.tm-toast');
    if (old) old.remove();
    var toast = document.createElement('div');
    toast.className = 'tm-toast';
    toast.textContent = text;
    page.appendChild(toast);
    setTimeout(function () {
      toast.classList.add('show');
    }, 10);
    setTimeout(function () {
      toast.classList.remove('show');
      setTimeout(function () {
        if (toast.parentNode) toast.remove();
      }, 180);
    }, 1800);
  }

  function markLinked(rowId) {
    metadataRows.forEach(function (row) {
      if (String(row.id) === String(rowId)) {
        row.status = '已关联';
        if (row.code === '-') row.code = 'TMD202605' + String(row.id).padStart(3, '0');
      }
    });
    delete state.selectedIds[rowId];
  }

  function bindTree(page) {
    page.querySelectorAll('.tm-tree-toggle').forEach(function (toggle) {
      toggle.addEventListener('click', function (e) {
        e.stopPropagation();
        var node = toggle.closest('.tm-tree-node');
        if (!node) return;
        node.classList.toggle('tm-open');
        var icon = toggle.querySelector('i');
        if (icon) {
          icon.className = node.classList.contains('tm-open') ? 'bi bi-chevron-down' : 'bi bi-chevron-right';
        }
      });
    });

    page.querySelectorAll('.tm-tree-row').forEach(function (row) {
      row.addEventListener('click', function () {
        page.querySelectorAll('.tm-tree-row.active').forEach(function (active) {
          active.classList.remove('active');
        });
        row.classList.add('active');
      });
    });

    var treeSearch = page.querySelector('[data-tm-tree-search]');
    if (treeSearch) {
      treeSearch.addEventListener('input', function () {
        var keyword = treeSearch.value.trim().toLowerCase();
        page.querySelectorAll('.tm-tree-node').forEach(function (node) {
          var text = node.textContent.toLowerCase();
          node.classList.toggle('tm-tree-hidden', keyword && text.indexOf(keyword) < 0);
          if (keyword && text.indexOf(keyword) >= 0) node.classList.add('tm-open');
        });
      });
    }

    var treeSearchBtn = page.querySelector('[data-tm-tree-search-btn]');
    if (treeSearchBtn && treeSearch) {
      treeSearchBtn.addEventListener('click', function () {
        treeSearch.dispatchEvent(new Event('input'));
      });
    }
  }

  function bindEvents(page) {
    bindTree(page);
    page.addEventListener('click', function (e) {
      var sortBtn = e.target.closest('[data-tm-sort]');
      if (sortBtn) {
        var sortKey = sortBtn.getAttribute('data-tm-sort');
        if (state.sortKey === sortKey) {
          state.sortDir = state.sortDir === 'asc' ? 'desc' : 'asc';
        } else {
          state.sortKey = sortKey;
          state.sortDir = 'asc';
        }
        renderTable(page);
        return;
      }

      var queryBtn = e.target.closest('[data-tm-action="query"]');
      if (queryBtn) {
        var statusSelect = page.querySelector('[data-tm-status]');
        var keywordInput = page.querySelector('[data-tm-keyword]');
        state.status = statusSelect ? statusSelect.value : '';
        state.keyword = keywordInput ? keywordInput.value.trim() : '';
        state.page = 1;
        renderTable(page);
        return;
      }

      var pageBtn = e.target.closest('[data-tm-page]');
      if (pageBtn) {
        var rows = getFilteredRows();
        var totalPages = Math.max(1, Math.ceil(rows.length / state.pageSize));
        var target = pageBtn.getAttribute('data-tm-page');
        if (target === 'prev') state.page = Math.max(1, state.page - 1);
        else if (target === 'next') state.page = Math.min(totalPages, state.page + 1);
        else state.page = Number(target) || 1;
        renderTable(page);
        return;
      }

      var createBtn = e.target.closest('[data-tm-action="create-business-meta"]');
      if (createBtn) {
        openCreateModal(page);
        return;
      }

      var closeModalBtn = e.target.closest('[data-tm-action="close-modal"]');
      if (closeModalBtn || e.target.hasAttribute('data-tm-modal-mask')) {
        closeCreateModal(page);
        return;
      }

      var saveBtn = e.target.closest('[data-tm-action="save-business-meta"]');
      if (saveBtn) {
        var rangeSelect = page.querySelector('[data-tm-range]');
        var rowsToLink = rangeSelect && rangeSelect.value === 'all' ? metadataRows.slice() : getSelectedRows();
        if (!rowsToLink.length) rowsToLink = getVisibleRows().slice(0, 19);
        rowsToLink.forEach(function (row) {
          markLinked(row.id);
        });
        closeCreateModal(page);
        renderTable(page);
        showToast(page, '业务元数据已创建');
      }
    });

    page.addEventListener('change', function (e) {
      if (e.target.matches('[data-tm-range]')) {
        updateModalRecordCount(page);
        return;
      }

      var checkAll = e.target.closest('[data-tm-check-all]');
      if (checkAll) {
        getVisibleRows().forEach(function (row) {
          if (checkAll.checked) state.selectedIds[row.id] = true;
          else delete state.selectedIds[row.id];
        });
        renderTable(page);
        return;
      }

      if (e.target.matches('[data-tm-row-check]')) {
        var rowId = e.target.getAttribute('data-tm-row-check');
        if (e.target.checked) state.selectedIds[rowId] = true;
        else delete state.selectedIds[rowId];
        updateCheckAll(page, getVisibleRows());
        return;
      }

      if (e.target.matches('[data-tm-page-size]')) {
        state.pageSize = Number(e.target.value) || 20;
        state.page = 1;
        renderTable(page);
      }
    });

    var keywordInput = page.querySelector('[data-tm-keyword]');
    if (keywordInput) {
      keywordInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          var queryBtn = page.querySelector('[data-tm-action="query"]');
          if (queryBtn) queryBtn.click();
        }
      });
    }
  }

  function sortHeader(key, label) {
    return '<button class="tm-th-sort" type="button" data-tm-sort="' + key + '">' +
      '<span>' + label + '</span>' +
      '<span class="tm-sort-stack"><i class="bi bi-caret-up-fill"></i><i class="bi bi-caret-down-fill"></i></span>' +
    '</button>';
  }

  var html = '<div class="page-technical-metadata">' +
    '<aside class="tm-left-panel">' +
      '<div class="tm-tree-search">' +
        '<input type="text" data-tm-tree-search placeholder="关键字搜索" aria-label="关键字搜索">' +
        '<button type="button" data-tm-tree-search-btn aria-label="搜索"><i class="bi bi-search"></i></button>' +
      '</div>' +
      '<div class="tm-tree-scroll">' +
        '<ul class="tm-tree">' +
          '<li class="tm-tree-node tm-open">' +
            '<div class="tm-tree-row active"><button class="tm-tree-toggle" type="button" aria-label="展开"><i class="bi bi-chevron-down"></i></button><i class="bi bi-stack tm-icon-root"></i><span>数据源目录 (15)</span></div>' +
            '<ul>' +
              '<li class="tm-tree-node tm-open">' +
                '<div class="tm-tree-row"><button class="tm-tree-toggle" type="button" aria-label="展开"><i class="bi bi-chevron-down"></i></button><i class="bi bi-box tm-icon-db"></i><span>生产数据库 (3)</span></div>' +
                '<ul>' +
                  '<li class="tm-tree-node"><div class="tm-tree-row"><span class="tm-tree-spacer"></span><i class="bi bi-database tm-icon-db-small"></i><span>prod_mysql_master</span></div></li>' +
                  '<li class="tm-tree-node"><div class="tm-tree-row"><span class="tm-tree-spacer"></span><i class="bi bi-database tm-icon-db-small"></i><span>prod_mysql_slave</span></div></li>' +
                  '<li class="tm-tree-node"><div class="tm-tree-row"><span class="tm-tree-spacer"></span><i class="bi bi-database tm-icon-db-small"></i><span>prod_postgresql</span></div></li>' +
                '</ul>' +
              '</li>' +
              '<li class="tm-tree-node tm-open"><div class="tm-tree-row"><button class="tm-tree-toggle" type="button" aria-label="展开"><i class="bi bi-chevron-down"></i></button><i class="bi bi-box tm-icon-db"></i><span>数据仓库 (4)</span></div><ul>' +
                '<li class="tm-tree-node"><div class="tm-tree-row"><span class="tm-tree-spacer"></span><i class="bi bi-database tm-icon-db-small"></i><span>dw_hive_ods</span></div></li>' +
                '<li class="tm-tree-node"><div class="tm-tree-row"><span class="tm-tree-spacer"></span><i class="bi bi-database tm-icon-db-small"></i><span>dw_hive_dwd</span></div></li>' +
                '<li class="tm-tree-node"><div class="tm-tree-row"><span class="tm-tree-spacer"></span><i class="bi bi-database tm-icon-db-small"></i><span>dw_hive_dws</span></div></li>' +
                '<li class="tm-tree-node"><div class="tm-tree-row"><span class="tm-tree-spacer"></span><i class="bi bi-database tm-icon-db-small"></i><span>dw_hive_ads</span></div></li>' +
              '</ul></li>' +
              '<li class="tm-tree-node tm-open"><div class="tm-tree-row"><button class="tm-tree-toggle" type="button" aria-label="展开"><i class="bi bi-chevron-down"></i></button><i class="bi bi-box tm-icon-db"></i><span>业务系统 (3)</span></div><ul>' +
                '<li class="tm-tree-node"><div class="tm-tree-row"><span class="tm-tree-spacer"></span><i class="bi bi-database tm-icon-db-small"></i><span>erp_oracle_db</span></div></li>' +
                '<li class="tm-tree-node"><div class="tm-tree-row"><span class="tm-tree-spacer"></span><i class="bi bi-database tm-icon-db-small"></i><span>crm_sqlserver</span></div></li>' +
                '<li class="tm-tree-node"><div class="tm-tree-row"><span class="tm-tree-spacer"></span><i class="bi bi-database tm-icon-db-small"></i><span>oa_mysql_db</span></div></li>' +
              '</ul></li>' +
              '<li class="tm-tree-node tm-open"><div class="tm-tree-row"><button class="tm-tree-toggle" type="button" aria-label="展开"><i class="bi bi-chevron-down"></i></button><i class="bi bi-box tm-icon-db"></i><span>实时数据源 (2)</span></div><ul>' +
                '<li class="tm-tree-node"><div class="tm-tree-row"><span class="tm-tree-spacer"></span><i class="bi bi-hdd-network tm-icon-db-small"></i><span>kafka_cluster_01</span></div></li>' +
                '<li class="tm-tree-node"><div class="tm-tree-row"><span class="tm-tree-spacer"></span><i class="bi bi-hdd-network tm-icon-db-small"></i><span>kafka_cluster_02</span></div></li>' +
              '</ul></li>' +
              '<li class="tm-tree-node tm-open"><div class="tm-tree-row"><button class="tm-tree-toggle" type="button" aria-label="展开"><i class="bi bi-chevron-down"></i></button><i class="bi bi-box tm-icon-db"></i><span>测试环境 (3)</span></div><ul>' +
                '<li class="tm-tree-node"><div class="tm-tree-row"><span class="tm-tree-spacer"></span><i class="bi bi-database tm-icon-db-small"></i><span>test_mysql_db</span></div></li>' +
                '<li class="tm-tree-node"><div class="tm-tree-row"><span class="tm-tree-spacer"></span><i class="bi bi-database tm-icon-db-small"></i><span>test_clickhouse</span></div></li>' +
                '<li class="tm-tree-node"><div class="tm-tree-row"><span class="tm-tree-spacer"></span><i class="bi bi-database tm-icon-db-small"></i><span>test_mongodb</span></div></li>' +
              '</ul></li>' +
            '</ul>' +
          '</li>' +
        '</ul>' +
      '</div>' +
    '</aside>' +
    '<section class="tm-right-panel">' +
      '<div class="tm-toolbar">' +
        '<div class="tm-toolbar-left">' +
          '<button class="btn btn-primary tm-create-btn" type="button" data-tm-action="create-business-meta">创建业务元数据</button>' +
        '</div>' +
        '<div class="tm-toolbar-right">' +
          '<label class="tm-filter"><span>状态:</span><select data-tm-status><option value="">请选择</option><option value="已关联">已关联</option><option value="未关联">未关联</option></select></label>' +
          '<div class="tm-keyword-box"><input type="text" data-tm-keyword placeholder="编码/名称/别名/备注" aria-label="编码名称别名备注"><button class="btn btn-primary" type="button" data-tm-action="query">查询</button></div>' +
        '</div>' +
      '</div>' +
      '<div class="tm-table-wrap">' +
        '<table class="tm-table">' +
          '<colgroup><col class="tm-w-check"><col class="tm-w-code"><col class="tm-w-name"><col class="tm-w-alias"><col class="tm-w-status"><col class="tm-w-type"><col class="tm-w-precision"><col class="tm-w-length"><col class="tm-w-remark"></colgroup>' +
          '<thead><tr>' +
            '<th class="tm-col-check"><input type="checkbox" data-tm-check-all aria-label="全选"></th>' +
            '<th>' + sortHeader('code', '编码') + '</th>' +
            '<th>' + sortHeader('name', '名称') + '</th>' +
            '<th>' + sortHeader('alias', '别名') + '</th>' +
            '<th>' + sortHeader('status', '状态') + '</th>' +
            '<th>' + sortHeader('dataType', '数据类型') + '</th>' +
            '<th>' + sortHeader('precision', '精度') + '</th>' +
            '<th>' + sortHeader('length', '长度') + '</th>' +
            '<th>' + sortHeader('remark', '备注') + '</th>' +
          '</tr></thead>' +
          '<tbody data-tm-table-body></tbody>' +
        '</table>' +
      '</div>' +
      '<div class="tm-pagination">' +
        '<div class="tm-page-info" data-tm-page-info></div>' +
        '<div class="tm-page-nav" data-tm-page-nav></div>' +
      '</div>' +
    '</section>' +
  '</div>';

  return {
    html: html,
    init: function () {
      var page = document.querySelector('.page-technical-metadata');
      if (!page) return;
      resetState();
      bindEvents(page);
      renderTable(page);
    }
  };
})();
