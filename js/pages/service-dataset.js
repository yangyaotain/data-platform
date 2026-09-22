/**
 * 数据中台 V4.0 - 数据服务 · 数据集
 * 依据参考系统还原数据集列表、内部/外部数据集注册、元数据信息和下载测试流程。
 */
window.DP = window.DP || {};
DP.pages = DP.pages || {};

DP.pages.serviceDataset = (function () {
  var pageEl;
  var selectedCatalog = '公共目录';
  var zebraEnabled = false;
  var compactEnabled = false;
  var editorState = null;

  var catalogNodes = [
    { name: '经营分析', key: '经营分析' },
    { name: '客户服务', key: '客户服务' },
    { name: '供应链数据', key: '供应链数据' },
    { name: '物联感知', key: '物联感知' }
  ];

  var dataSourceTree = [
    {
      name: '业务系统', children: [
        { name: '客户关系系统', children: [{ name: 'customer_master' }] },
        { name: '营销系统', children: [{ name: 'sales_order' }] },
        { name: '客服系统', children: [{ name: 'service_ticket' }] },
        { name: '供应链系统', children: [{ name: 'supplier_delivery' }] },
        { name: '物联网平台', children: [{ name: 'device_alarm' }] }
      ]
    },
    {
      name: '数仓分层', children: [
        { name: 'ODS贴源层', children: [{ name: 'ods_customer' }, { name: 'ods_sales_order' }] },
        { name: 'DWD明细层', children: [{ name: 'dwd_service_ticket' }] },
        { name: 'DWS汇总层', children: [{ name: 'dws_region_sales_day' }] },
        { name: 'ADS应用层', children: [{ name: 'ads_customer_profile' }] }
      ]
    },
    {
      name: '主数据', children: [
        { name: '客户主数据', children: [{ name: 'mdm_customer' }] },
        { name: '供应商主数据', children: [{ name: 'mdm_supplier' }] }
      ]
    }
  ];

  var datasetRows = [
    {
      id: 'set-001', code: '20260921104612001', name: '区域销售日汇总数据集', enName: 'region_sales_daily',
      category: '公共目录,我的目录/经营分析', type: '文件数据集', version: 'V2', publishStatus: '已上架', auditStatus: '上架通过',
      updateTime: '2026-09-21 10:46:12', desc: '按区域和业务日期汇总销售额、订单量及客户数', sourceType: '内部数据集',
      endpoint: '/region-sales-daily', dataSource: '数仓分层/DWS汇总层/dws_region_sales_day', formats: ['XLSX', 'CSV', 'JSON'],
      sql: 'select region_code, business_date, sales_amount, order_count, customer_count\nfrom dws_region_sales_day\nwhere business_date = ${business_date}',
      domain: '经营分析域', summary: '面向经营分析人员提供区域销售日汇总下载数据', managementUnit: '经营分析中心', phone: '010-55586621', frequency: '每日',
      quality: '96', views: '328', pushes: '46', applications: '18', listedAt: '2026-09-20 16:10:00',
      fields: [
        { name: 'region_code', type: 'VARCHAR', mask: '', crypto: '', desc: '区域编码' },
        { name: 'business_date', type: 'DATE', mask: '', crypto: '', desc: '业务日期' },
        { name: 'sales_amount', type: 'DECIMAL', mask: '', crypto: '', desc: '销售金额' },
        { name: 'order_count', type: 'BIGINT', mask: '', crypto: '', desc: '订单数量' },
        { name: 'customer_count', type: 'BIGINT', mask: '', crypto: '', desc: '客户数量' }
      ],
      preview: [
        ['华东区', '2026-09-20', '2865400.50', '1286', '943'],
        ['华南区', '2026-09-20', '2158730.00', '1048', '802'],
        ['华北区', '2026-09-20', '1986275.80', '926', '731']
      ]
    },
    {
      id: 'set-002', code: '20260920163244002', name: '客户服务工单明细数据集', enName: 'service_ticket_detail',
      category: '我的目录/客户服务', type: '文件数据集', version: 'V1', publishStatus: '开发', auditStatus: '',
      updateTime: '2026-09-20 16:32:44', desc: '客服工单受理、流转和办结明细', sourceType: '内部数据集',
      endpoint: '/service-ticket-detail', dataSource: '业务系统/客服系统/service_ticket', formats: ['CSV', 'JSON'],
      sql: 'select ticket_no, customer_code, issue_type, accept_time, finish_time, ticket_status\nfrom service_ticket\nwhere accept_time >= ${start_time}',
      domain: '客户服务域', summary: '用于客服工单时效分析和问题类型统计', managementUnit: '客户服务中心', phone: '010-55586622', frequency: '每小时',
      quality: '--', views: '0', pushes: '0', applications: '0', listedAt: '',
      fields: [
        { name: 'ticket_no', type: 'VARCHAR', mask: '', crypto: '', desc: '工单编号' },
        { name: 'customer_code', type: 'VARCHAR', mask: '客户编码脱敏', crypto: '', desc: '客户编码' },
        { name: 'issue_type', type: 'VARCHAR', mask: '', crypto: '', desc: '问题类型' },
        { name: 'ticket_status', type: 'VARCHAR', mask: '', crypto: '', desc: '工单状态' }
      ],
      preview: [
        ['WO202609200018', 'C100386', '配送延迟', '2026-09-20 09:18:22', '2026-09-20 11:36:08', '已办结'],
        ['WO202609200027', 'C100572', '商品质量', '2026-09-20 10:42:13', '', '处理中']
      ]
    },
    {
      id: 'set-003', code: '20260919140837003', name: '供应商交付清单数据集', enName: 'supplier_delivery_manifest',
      category: '公共目录,我的目录/供应链数据', type: '文件数据集', version: 'V1', publishStatus: '已上架', auditStatus: '上架通过',
      updateTime: '2026-09-19 14:08:37', desc: '供应商订单交付和签收状态清单', sourceType: '外部数据集',
      endpoint: '/supplier-delivery-manifest', proxy: '统一数据代理', formats: ['XLSX', 'CSV'],
      domain: '供应链域', summary: '向采购和仓储人员提供供应商交付清单下载', managementUnit: '供应链数据中心', phone: '010-55586623', frequency: '每日',
      quality: '93', views: '176', pushes: '29', applications: '11', listedAt: '2026-09-19 17:30:00',
      files: [{ name: 'supplier_delivery_manifest', format: 'CSV', size: '50', unit: 'MB', url: 'https://exchange.example.local/files/supplier-delivery.csv' }],
      headerParams: [{ name: 'X-Access-Key', required: '是', type: 'string', value: '', desc: '数据交换访问密钥' }],
      fields: [
        { name: 'supplier_code', type: 'string', desc: '供应商编码' },
        { name: 'purchase_order_no', type: 'string', desc: '采购订单号' },
        { name: 'delivery_date', type: 'date', desc: '计划交付日期' },
        { name: 'receipt_status', type: 'string', desc: '签收状态' }
      ],
      preview: [
        ['SUP-00218', 'PO202609180036', '2026-09-21', '已签收'],
        ['SUP-00306', 'PO202609180051', '2026-09-22', '运输中']
      ]
    },
    {
      id: 'set-004', code: '20260918112503004', name: '设备告警归档数据集', enName: 'device_alarm_archive',
      category: '我的目录/物联感知', type: '文件数据集', version: 'V1', publishStatus: '待上架', auditStatus: '上架待审核',
      updateTime: '2026-09-18 11:25:03', desc: '设备告警记录及处置结果归档', sourceType: '内部数据集',
      endpoint: '/device-alarm-archive', dataSource: '业务系统/物联网平台/device_alarm', formats: ['CSV', 'JSON', 'XML'],
      sql: 'select device_code, alarm_level, alarm_content, alarm_time, handle_status\nfrom device_alarm\nwhere alarm_time between ${start_time} and ${end_time}',
      domain: '设备域', summary: '提供设备告警归档下载，用于运维复盘', managementUnit: '物联数据中心', phone: '010-55586624', frequency: '每日',
      quality: '91', views: '42', pushes: '6', applications: '3', listedAt: '',
      fields: [
        { name: 'device_code', type: 'VARCHAR', mask: '', crypto: '', desc: '设备编码' },
        { name: 'alarm_level', type: 'VARCHAR', mask: '', crypto: '', desc: '告警级别' },
        { name: 'alarm_time', type: 'DATETIME', mask: '', crypto: '', desc: '告警时间' },
        { name: 'handle_status', type: 'VARCHAR', mask: '', crypto: '', desc: '处置状态' }
      ],
      preview: [
        ['DEV-100286', '高', '温度超过安全阈值', '2026-09-18 09:23:18', '已处置'],
        ['DEV-100471', '中', '采集信号中断', '2026-09-18 10:11:36', '处理中']
      ]
    },
    {
      id: 'set-005', code: '20260917151849005', name: '经营区域主数据导出', enName: 'region_master_export',
      category: '公共目录,我的目录/经营分析', type: '文件数据集', version: 'V1', publishStatus: '编制', auditStatus: '',
      updateTime: '2026-09-17 15:18:49', desc: '经营区域编码、名称和组织归属导出', sourceType: '外部数据集',
      endpoint: '/region-master-export', proxy: '政务外网代理', formats: ['JSON'],
      domain: '公共域', summary: '提供经营区域标准主数据下载', managementUnit: '数据治理中心', phone: '010-55586625', frequency: '每月',
      quality: '--', views: '0', pushes: '0', applications: '0', listedAt: '', files: [], headerParams: [], fields: [], preview: []
    }
  ];

  function escapeHtml(text) {
    return String(text == null ? '' : text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function nextCode() {
    var now = new Date();
    var pad = function (value) { return String(value).padStart(2, '0'); };
    return '' + now.getFullYear() + pad(now.getMonth() + 1) + pad(now.getDate()) + pad(now.getHours()) + pad(now.getMinutes()) + pad(now.getSeconds()) + String(datasetRows.length + 1).padStart(3, '0');
  }

  function statusClass(status) {
    if (status === '已上架' || status === '上架通过' || status === '下架通过') return 'success';
    if (status === '开发') return 'processing';
    if (status === '待上架' || status === '上架待审核' || status === '下架待审核') return 'warning';
    if (status === '上架驳回' || status === '下架驳回') return 'danger';
    return 'default';
  }

  function renderStatus(text) {
    return text ? '<span class="svc-status ' + statusClass(text) + '">' + escapeHtml(text) + '</span>' : '<span class="svc-empty">--</span>';
  }

  function catalogHtml() {
    return '' +
      '<aside class="svc-catalog-panel">' +
        '<div class="svc-catalog-title"><i class="bi bi-list"></i><span>数据目录</span></div>' +
        '<div class="svc-catalog-search"><i class="bi bi-search"></i><input data-set-catalog-search placeholder="请输入目录名称"></div>' +
        '<div class="svc-tree-list" data-set-catalog-tree>' +
          '<div class="svc-tree-row' + (selectedCatalog === '公共目录' ? ' active' : '') + '" data-set-catalog="公共目录"><i class="bi bi-folder-fill"></i><span>公共目录</span></div>' +
          '<div class="svc-tree-row has-children open' + (selectedCatalog === '我的目录' ? ' active' : '') + '" data-set-catalog="我的目录"><i class="bi bi-chevron-right svc-tree-arrow"></i><i class="bi bi-folder-fill"></i><span>我的目录 (' + catalogNodes.length + ')</span></div>' +
          '<div class="svc-tree-children">' + catalogNodes.map(function (node) {
            return '<div class="svc-tree-row child' + (selectedCatalog === node.key ? ' active' : '') + '" data-set-catalog="' + escapeHtml(node.key) + '"><i class="bi bi-folder2"></i><span>' + escapeHtml(node.name) + '</span></div>';
          }).join('') + '</div>' +
          '<div class="svc-tree-empty" data-set-catalog-empty hidden>未找到匹配目录</div>' +
        '</div>' +
      '</aside>';
  }

  function getFilters() {
    var publish = pageEl.querySelector('[data-set-filter="publish"]');
    var audit = pageEl.querySelector('[data-set-filter="audit"]');
    var keyword = pageEl.querySelector('[data-set-filter="keyword"]');
    return {
      publish: publish ? publish.value : '',
      audit: audit ? audit.value : '',
      keyword: keyword ? keyword.value.trim().toLowerCase() : ''
    };
  }

  function getFilteredRows() {
    var filters = getFilters();
    return datasetRows.filter(function (row) {
      if (filters.publish && row.publishStatus !== filters.publish) return false;
      if (filters.audit && row.auditStatus !== filters.audit) return false;
      if (selectedCatalog === '我的目录' && row.category.indexOf('我的目录') < 0) return false;
      if (selectedCatalog !== '公共目录' && selectedCatalog !== '我的目录' && row.category.indexOf(selectedCatalog) < 0) return false;
      if (filters.keyword && [row.code, row.name, row.enName].join(' ').toLowerCase().indexOf(filters.keyword) < 0) return false;
      return true;
    });
  }

  function findRow(id) {
    return datasetRows.find(function (row) { return row.id === id; });
  }

  function renderRow(row) {
    var secondary = row.publishStatus === '已上架'
      ? '<button class="svc-row-action" data-set-row-action="test" data-id="' + row.id + '"><i class="bi bi-link-45deg"></i><span>下载测试</span></button>'
      : (row.publishStatus === '开发' ? '<button class="svc-row-action danger" data-set-row-action="delete" data-id="' + row.id + '"><i class="bi bi-trash3"></i><span>删除</span></button>' : '');
    return '' +
      '<tr data-row-id="' + row.id + '">' +
        '<td class="svc-check-col"><input type="checkbox" class="svc-row-check" data-set-row-check="' + row.id + '"></td>' +
        '<td class="svc-code-col">' + escapeHtml(row.code) + '</td>' +
        '<td class="svc-name-col" title="' + escapeHtml(row.name) + '">' + escapeHtml(row.name) + '</td>' +
        '<td class="svc-en-col" title="' + escapeHtml(row.enName) + '">' + escapeHtml(row.enName) + '</td>' +
        '<td class="svc-category-col" title="' + escapeHtml(row.category) + '">' + escapeHtml(row.category) + '</td>' +
        '<td>' + escapeHtml(row.type) + '</td><td>' + escapeHtml(row.version) + '</td>' +
        '<td>' + renderStatus(row.publishStatus) + '</td><td>' + renderStatus(row.auditStatus) + '</td>' +
        '<td>' + escapeHtml(row.updateTime) + '</td>' +
        '<td class="svc-desc-col" title="' + escapeHtml(row.desc) + '">' + escapeHtml(row.desc) + '</td>' +
        '<td class="svc-action-col"><button class="svc-row-action" data-set-row-action="edit" data-id="' + row.id + '"><i class="bi bi-pencil-square"></i><span>修改</span></button>' + secondary + '</td>' +
      '</tr>';
  }

  function renderTable() {
    var body = pageEl.querySelector('#datasetTbody');
    if (!body) return;
    var rows = getFilteredRows();
    body.innerHTML = rows.length ? rows.map(renderRow).join('') : '<tr><td colspan="12"><div class="svc-empty-state"><i class="bi bi-inbox"></i><span>暂无匹配的数据集</span></div></td></tr>';
    pageEl.querySelector('[data-set-total]').textContent = '共 ' + rows.length + ' 条';
    var checkAll = pageEl.querySelector('#datasetCheckAll');
    if (checkAll) checkAll.checked = false;
  }

  function listPanelHtml() {
    return '' +
      '<section class="svc-list-panel">' +
        '<div class="svc-toolbar">' +
          '<div class="svc-toolbar-left">' +
            '<button class="btn btn-text svc-top-action" data-set-action="add"><i class="bi bi-plus-circle"></i> 新增</button>' +
            '<button class="btn btn-text svc-top-action" data-set-action="deploy"><i class="bi bi-send"></i> 部署测试</button>' +
            '<button class="btn btn-text svc-top-action" data-set-action="undeploy"><i class="bi bi-x-square"></i> 取消部署</button>' +
          '</div>' +
          '<div class="svc-filter-bar">' +
            '<label>发布状态</label><select class="svc-select" data-set-filter="publish"><option value="">请选择</option><option>编制</option><option>开发</option><option>待上架</option><option>已上架</option></select>' +
            '<label>审核状态</label><select class="svc-select" data-set-filter="audit"><option value="">请选择</option><option>上架待审核</option><option>上架通过</option><option>上架驳回</option><option>下架待审核</option><option>下架通过</option><option>下架驳回</option></select>' +
            '<input class="svc-keyword" data-set-filter="keyword" placeholder="数据编码/数据名称/英文名称">' +
            '<button class="btn btn-primary svc-query" data-set-action="search"><i class="bi bi-search"></i> 查询</button>' +
          '</div>' +
        '</div>' +
        '<div class="svc-table-tools">' +
          '<label class="svc-switch" title="表格斑马纹"><input type="checkbox" data-set-zebra' + (zebraEnabled ? ' checked' : '') + '><span class="svc-switch-track"></span><em class="svc-switch-text">' + (zebraEnabled ? '开' : '关') + '</em></label>' +
          '<span class="svc-tool-sep"></span>' +
          '<button class="svc-tool-btn" title="刷新" data-set-tool="refresh"><i class="bi bi-arrow-clockwise"></i></button>' +
          '<button class="svc-tool-btn" title="行高" data-set-tool="density"><i class="bi bi-arrows-expand"></i></button>' +
          '<button class="svc-tool-btn" title="列设置" data-set-tool="columns"><i class="bi bi-gear"></i></button>' +
          '<button class="svc-tool-btn" title="全屏" data-set-tool="fullscreen"><i class="bi bi-arrows-fullscreen"></i></button>' +
        '</div>' +
        '<div class="svc-table-wrap"><table class="ds-table svc-api-table"><thead><tr>' +
          '<th class="svc-check-col"><input type="checkbox" id="datasetCheckAll"></th>' +
          '<th class="svc-code-col">数据编码 <i class="bi bi-caret-up-fill sort-icon"></i><i class="bi bi-caret-down-fill sort-icon"></i></th>' +
          '<th class="svc-name-col">数据名称 <i class="bi bi-caret-up-fill sort-icon"></i><i class="bi bi-caret-down-fill sort-icon"></i></th>' +
          '<th class="svc-en-col">英文名称 <i class="bi bi-caret-up-fill sort-icon"></i><i class="bi bi-caret-down-fill sort-icon"></i></th>' +
          '<th class="svc-category-col">分类</th><th>接口类型</th><th>版本</th><th>发布状态</th><th>审核状态</th><th>更新时间</th><th class="svc-desc-col">描述</th><th class="svc-action-col">操作</th>' +
        '</tr></thead><tbody id="datasetTbody"></tbody></table></div>' +
        '<div class="svc-pagination"><span data-set-total>共 0 条</span><div class="svc-page-controls"><button class="svc-page-btn disabled"><i class="bi bi-chevron-left"></i></button><button class="svc-page-num active">1</button><button class="svc-page-btn disabled"><i class="bi bi-chevron-right"></i></button><select class="svc-page-size"><option>10 条/页</option><option>20 条/页</option><option>50 条/页</option></select></div></div>' +
      '</section>';
  }

  function showToast(text, type) {
    var old = pageEl.querySelector('.svc-toast');
    if (old) old.remove();
    var toast = document.createElement('div');
    toast.className = 'svc-toast ' + (type || 'info');
    toast.innerHTML = '<i class="bi ' + (type === 'success' ? 'bi-check-circle' : type === 'warning' ? 'bi-exclamation-circle' : 'bi-info-circle') + '"></i><span>' + escapeHtml(text) + '</span>';
    pageEl.appendChild(toast);
    window.setTimeout(function () { if (toast.parentNode) toast.remove(); }, 1800);
  }

  function selectedIds() {
    return Array.prototype.map.call(pageEl.querySelectorAll('[data-set-row-check]:checked'), function (item) { return item.dataset.setRowCheck; });
  }

  function renderListPage() {
    editorState = null;
    pageEl.classList.toggle('zebra-table', zebraEnabled);
    pageEl.classList.toggle('compact-table', compactEnabled);
    pageEl.innerHTML = catalogHtml() + listPanelHtml();
    bindCatalogEvents();
    bindListEvents();
    renderTable();
  }

  function bindCatalogEvents() {
    pageEl.querySelectorAll('[data-set-catalog]').forEach(function (row) {
      row.addEventListener('click', function () {
        if (row.classList.contains('has-children')) row.classList.toggle('open');
        pageEl.querySelectorAll('[data-set-catalog].active').forEach(function (item) { item.classList.remove('active'); });
        row.classList.add('active');
        selectedCatalog = row.dataset.setCatalog || '公共目录';
        renderTable();
      });
    });
    var search = pageEl.querySelector('[data-set-catalog-search]');
    if (!search) return;
    search.addEventListener('input', function () {
      var keyword = search.value.trim().toLowerCase();
      var children = Array.prototype.slice.call(pageEl.querySelectorAll('.svc-tree-row.child'));
      var matchedChildren = children.filter(function (child) { return !keyword || child.textContent.toLowerCase().indexOf(keyword) > -1; });
      pageEl.querySelectorAll('.svc-tree-row').forEach(function (row) {
        var matched = !keyword || row.textContent.toLowerCase().indexOf(keyword) > -1;
        if (row.classList.contains('has-children') && keyword) {
          matched = matched || matchedChildren.length > 0;
          if (matched) row.classList.add('open');
        }
        if (row.classList.contains('child')) matched = matchedChildren.indexOf(row) > -1;
        row.hidden = !matched;
      });
      pageEl.querySelector('[data-set-catalog-empty]').hidden = pageEl.querySelectorAll('.svc-tree-row:not([hidden])').length > 0;
    });
  }

  function bindListEvents() {
    pageEl.querySelector('[data-set-action="add"]').addEventListener('click', function () { renderEditorPage(null, true); });
    pageEl.querySelector('[data-set-action="search"]').addEventListener('click', renderTable);
    pageEl.querySelector('[data-set-filter="keyword"]').addEventListener('keydown', function (event) { if (event.key === 'Enter') renderTable(); });
    pageEl.querySelectorAll('[data-set-filter="publish"], [data-set-filter="audit"]').forEach(function (select) { select.addEventListener('change', renderTable); });
    pageEl.querySelector('#datasetCheckAll').addEventListener('change', function (event) { pageEl.querySelectorAll('.svc-row-check').forEach(function (item) { item.checked = event.target.checked; }); });

    pageEl.querySelector('[data-set-action="deploy"]').addEventListener('click', function () {
      var ids = selectedIds();
      if (!ids.length) { showToast('请选择数据', 'warning'); return; }
      ids.forEach(function (id) { var row = findRow(id); if (row && (row.publishStatus === '编制' || row.publishStatus === '开发')) row.publishStatus = '开发'; });
      renderTable();
      showToast('已提交 ' + ids.length + ' 个数据集进行部署测试', 'success');
    });

    pageEl.querySelector('[data-set-action="undeploy"]').addEventListener('click', function () {
      var ids = selectedIds();
      if (!ids.length) { showToast('请选择数据', 'warning'); return; }
      DP.confirm('确认取消部署已选择的 ' + ids.length + ' 个数据集吗？', {
        icon: 'info',
        onOk: function () {
          ids.forEach(function (id) { var row = findRow(id); if (row && row.publishStatus === '开发') row.publishStatus = '编制'; });
          renderTable();
          showToast('已取消部署', 'success');
        }
      });
    });

    pageEl.querySelector('#datasetTbody').addEventListener('click', function (event) {
      var button = event.target.closest('[data-set-row-action]');
      if (!button) return;
      var row = findRow(button.dataset.id);
      if (!row) return;
      if (button.dataset.setRowAction === 'edit') renderEditorPage(row, false);
      else if (button.dataset.setRowAction === 'test') renderTestPage(row);
      else if (button.dataset.setRowAction === 'delete') {
        DP.confirm('确认删除数据集【' + escapeHtml(row.name) + '】吗？', {
          icon: 'danger',
          onOk: function () {
            datasetRows = datasetRows.filter(function (item) { return item.id !== row.id; });
            renderTable();
            showToast('数据集已删除', 'success');
          }
        });
      }
    });

    pageEl.querySelector('[data-set-zebra]').addEventListener('change', function (event) {
      zebraEnabled = event.target.checked;
      pageEl.classList.toggle('zebra-table', zebraEnabled);
      pageEl.querySelector('.svc-switch-text').textContent = zebraEnabled ? '开' : '关';
    });

    pageEl.querySelectorAll('[data-set-tool]').forEach(function (button) {
      button.addEventListener('click', function () {
        var action = button.dataset.setTool;
        if (action === 'refresh') { renderTable(); showToast('列表已刷新', 'success'); }
        else if (action === 'density') { compactEnabled = !compactEnabled; pageEl.classList.toggle('compact-table', compactEnabled); showToast(compactEnabled ? '已切换为紧凑行高' : '已恢复默认行高', 'info'); }
        else if (action === 'columns') showColumnPanel(button);
        else if (action === 'fullscreen') { pageEl.classList.toggle('svc-page-fullscreen'); showToast(pageEl.classList.contains('svc-page-fullscreen') ? '已进入全屏' : '已退出全屏', 'info'); }
      });
    });
  }

  function showColumnPanel(anchor) {
    var old = pageEl.querySelector('.svc-set-column-panel');
    if (old) { old.remove(); return; }
    var panel = document.createElement('div');
    panel.className = 'svc-set-column-panel';
    panel.innerHTML = '<strong>列设置</strong><label><input type="checkbox" checked disabled> 数据编码</label><label><input type="checkbox" checked> 分类</label><label><input type="checkbox" checked> 审核状态</label><label><input type="checkbox" checked> 描述</label>';
    anchor.parentNode.appendChild(panel);
  }

  function makeEditorState(row, isNew) {
    var base = row || {};
    return {
      isNew: isNew,
      rowId: base.id || '',
      activeTab: 'register',
      sourceType: base.sourceType || '内部数据集',
      dataSource: base.dataSource || '',
      proxy: base.proxy || '',
      endpoint: base.endpoint || '/dataset-' + (datasetRows.length + 1),
      formats: (base.formats || []).slice(),
      sql: base.sql || '',
      sqlTested: !isNew && base.sourceType !== '外部数据集',
      dataTab: 'items',
      fields: (base.fields || []).map(function (item) { return Object.assign({}, item); }),
      preview: (base.preview || []).map(function (item) { return item.slice(); }),
      files: (base.files || []).map(function (item) { return Object.assign({}, item); }),
      headerParams: (base.headerParams || []).map(function (item) { return Object.assign({}, item); }),
      meta: {
        code: base.code || '', name: base.name || '', enName: base.enName || '', summary: base.summary || base.desc || '', version: base.version || 'V1',
        category: base.category || '公共目录', domain: base.domain || '经营分析域', listedAt: base.listedAt || '', updatedAt: base.updateTime || '',
        quality: base.quality || '--', views: base.views || '0', pushes: base.pushes || '0', managementUnit: base.managementUnit || '',
        phone: base.phone || '', frequency: base.frequency || '每日', applications: base.applications || '0'
      }
    };
  }

  function lineNumbers(code) {
    var count = Math.max(String(code || '').split('\n').length, 1);
    var html = '';
    for (var i = 1; i <= count; i += 1) html += '<div>' + i + '</div>';
    return html;
  }

  function highlightSql(code) {
    var html = escapeHtml(code || '');
    html = html.replace(/(--.*)$/gm, '<span class="dp-sql-comment">$1</span>');
    html = html.replace(/('(?:''|[^'])*')/g, '<span class="dp-sql-string">$1</span>');
    html = html.replace(/\b(select|from|where|and|or|join|on|group|by|order|limit|as|count|sum|max|min|avg|distinct|between)\b/gi, '<span class="dp-sql-keyword">$1</span>');
    html = html.replace(/(\$\{[\w.]+\})/g, '<span class="dp-sql-var">$1</span>');
    return html;
  }

  function sqlEditorHtml() {
    return '' +
      '<div class="dp-sql-editor svc-sql-editor theme-dark svc-set-sql-editor" data-set-sql-editor>' +
        '<div class="dp-sql-editor-toolbar"><span class="svc-sql-editor-title"></span>' +
          '<select class="dp-sql-editor-select" data-set-code-theme><option value="dark">暗色 - One Dark</option><option value="light">亮色 - Light</option></select>' +
          '<select class="dp-sql-editor-select" data-set-code-size><option>12px</option><option>13px</option><option selected>14px</option><option>15px</option><option>16px</option></select>' +
          '<button class="dp-sql-editor-btn" type="button" data-set-code-action="format"><i class="bi bi-sliders"></i><span>格式化</span></button>' +
          '<button class="dp-sql-editor-btn" type="button" data-set-code-action="copy"><i class="bi bi-clipboard"></i><span>复制</span></button>' +
          '<button class="dp-sql-editor-btn" type="button" data-set-code-action="search"><i class="bi bi-search"></i><span>搜索</span></button>' +
          '<button class="dp-sql-editor-btn" type="button" data-set-code-action="fullscreen"><i class="bi bi-arrows-fullscreen"></i><span>全屏</span></button>' +
        '</div>' +
        '<div class="dp-sql-editor-searchbar"><input class="dp-sql-editor-input" data-set-code-search placeholder="查找..."><button class="dp-sql-editor-btn" type="button" data-set-code-action="close-search"><i class="bi bi-x"></i></button></div>' +
        '<div class="dp-sql-editor-wrap"><div class="dp-sql-editor-gutter">' + lineNumbers(editorState.sql) + '</div><div class="dp-sql-editor-content" contenteditable="true" spellcheck="false">' + highlightSql(editorState.sql) + '</div></div>' +
      '</div>';
  }

  function dataSourceTreeHtml(nodes, parentPath, level) {
    return nodes.map(function (node) {
      var path = parentPath ? parentPath + '/' + node.name : node.name;
      var hasChildren = !!(node.children && node.children.length);
      var inSelectedPath = editorState.dataSource && (editorState.dataSource === path || editorState.dataSource.indexOf(path + '/') === 0);
      var open = level === 0 || inSelectedPath;
      return '<div class="svc-set-ds-node' + (open ? ' open' : '') + '" data-set-ds-node data-set-ds-name="' + escapeHtml(node.name.toLowerCase()) + '" data-set-ds-path="' + escapeHtml(path) + '">' +
        '<button type="button" class="svc-set-ds-row' + (!hasChildren ? ' leaf' : '') + (editorState.dataSource === path ? ' selected' : '') + '" ' + (hasChildren ? 'data-set-ds-toggle' : 'data-set-ds-select="' + escapeHtml(path) + '"') + ' style="padding-left:' + (10 + level * 20) + 'px">' +
          (hasChildren ? '<i class="bi bi-chevron-right svc-set-ds-caret"></i><i class="bi bi-folder-fill"></i>' : '<span class="svc-set-ds-spacer"></span><i class="bi bi-table"></i>') +
          '<span>' + escapeHtml(node.name) + '</span>' +
        '</button>' +
        (hasChildren ? '<div class="svc-set-ds-children">' + dataSourceTreeHtml(node.children, path, level + 1) + '</div>' : '') +
      '</div>';
    }).join('');
  }

  function dataSourcePickerHtml() {
    return '' +
      '<div class="svc-datasource-picker" data-set-ds-picker>' +
        '<input readonly data-set-ds-value value="' + escapeHtml(editorState.dataSource) + '" placeholder="请选择数据源"><i class="bi bi-chevron-down"></i>' +
        '<div class="svc-ds-dropdown" data-set-ds-dropdown hidden>' +
          '<div class="svc-sql-search"><i class="bi bi-search"></i><input data-set-ds-search placeholder="搜索数据源或表名称"></div>' +
          '<div class="svc-set-ds-tree">' + dataSourceTreeHtml(dataSourceTree, '', 0) + '</div>' +
          '<div class="svc-tree-empty" data-set-ds-empty hidden>未找到匹配数据源</div>' +
        '</div>' +
      '</div>';
  }

  function sourceTreeHtml() {
    var names = ['customer_master', 'sales_order', 'service_ticket', 'supplier_delivery', 'device_alarm', 'region_master'];
    return '<div class="svc-sql-left"><div class="svc-sql-search"><i class="bi bi-search"></i><input data-set-source-search placeholder="请输入关键字"></div><div class="svc-tree-list" data-set-source-tree>' +
      names.map(function (name, index) {
        return '<div class="svc-tree-node' + (index === 0 ? ' expanded' : '') + '"><div class="svc-tree-item" data-set-source-toggle><i class="bi bi-chevron-right svc-tree-caret"></i><i class="bi bi-table"></i><span>' + name + '</span></div><div class="svc-tree-fields"><div class="svc-tree-field"><span>A</span><em>id</em></div><div class="svc-tree-field"><span>A</span><em>code</em></div><div class="svc-tree-field"><span>A</span><em>update_time</em></div></div></div>';
      }).join('') + '</div><div class="svc-tree-empty" data-set-source-empty hidden>未找到匹配表</div></div>';
  }

  function formatChecksHtml() {
    return ['XLSX', 'CSV', 'JSON', 'XML', 'RDF'].map(function (format) {
      return '<label><input type="checkbox" data-set-format="' + format + '"' + (editorState.formats.indexOf(format) > -1 ? ' checked' : '') + '> ' + format + '</label>';
    }).join('');
  }

  function internalRegisterHtml() {
    return '' +
      '<div class="svc-set-source-grid">' +
        '<div class="svc-form-item"><label>数据集来源</label><select data-set-source-type><option selected>内部数据集</option><option>外部数据集</option></select></div>' +
        '<div class="svc-form-item"><label>数据源</label>' + dataSourcePickerHtml() + '</div>' +
      '</div>' +
      '<div class="svc-set-url-row"><label><em>*</em> 请求URL</label><div class="svc-url-input"><span>https://api.example.local/share-api/{接口标识}</span><input data-set-field="endpoint" value="' + escapeHtml(editorState.endpoint) + '"></div></div>' +
      '<div class="svc-set-format-row"><span>文件格式</span><div>' + formatChecksHtml() + '</div></div>' +
      '<div class="svc-sql-title svc-set-sql-title"><span>自定义SQL</span><button type="button" data-set-action="run-sql"><i class="bi bi-play-circle"></i> 测试执行</button></div>' +
      '<div class="svc-sql-layout">' + sourceTreeHtml() + sqlEditorHtml() + '</div>' +
      dataAreaHtml();
  }

  function fileBlockHtml(file, index) {
    file = file || { name: '', format: '', size: '', unit: 'MB', url: '' };
    return '<div class="svc-set-file-card" data-set-file-index="' + index + '">' +
      '<div class="svc-form-item"><label>文件名称</label><input data-file-field="name" value="' + escapeHtml(file.name) + '"></div>' +
      '<div class="svc-form-item"><label>文件格式</label><select data-file-field="format"><option value="">请选择</option>' + ['XLSX', 'CSV', 'JSON', 'XML', 'RDF'].map(function (item) { return '<option' + (file.format === item ? ' selected' : '') + '>' + item + '</option>'; }).join('') + '</select></div>' +
      '<div class="svc-form-item"><label>文件大小</label><div class="svc-set-size"><input type="number" data-file-field="size" value="' + escapeHtml(file.size) + '"><select data-file-field="unit"><option' + (file.unit === 'KB' ? ' selected' : '') + '>KB</option><option' + (file.unit === 'MB' ? ' selected' : '') + '>MB</option><option' + (file.unit === 'GB' ? ' selected' : '') + '>GB</option></select></div></div>' +
      '<div class="svc-form-item svc-set-file-url"><label>原始URL</label><input data-file-field="url" value="' + escapeHtml(file.url) + '" placeholder="请输入文件下载地址"></div>' +
      '<button class="btn btn-outline" type="button" data-set-file-test="' + index + '"><i class="bi bi-link-45deg"></i> 地址测试</button>' +
      '<button class="svc-row-action danger" type="button" data-set-file-remove="' + index + '"><i class="bi bi-trash3"></i><span>删除</span></button>' +
    '</div>';
  }

  function externalRegisterHtml() {
    return '' +
      '<div class="svc-set-source-grid">' +
        '<div class="svc-form-item"><label>数据集来源</label><select data-set-source-type><option>内部数据集</option><option selected>外部数据集</option></select></div>' +
        '<div class="svc-form-item"><label>代理服务</label><select data-set-field="proxy"><option value="">请选择</option><option' + (editorState.proxy === '统一数据代理' ? ' selected' : '') + '>统一数据代理</option><option' + (editorState.proxy === '内网数据代理' ? ' selected' : '') + '>内网数据代理</option><option' + (editorState.proxy === '政务外网代理' ? ' selected' : '') + '>政务外网代理</option></select></div>' +
      '</div>' +
      '<div class="svc-set-file-list" data-set-file-list>' + editorState.files.map(fileBlockHtml).join('') + '</div>' +
      '<button class="svc-add-param svc-set-file-add" type="button" data-set-action="add-file"><i class="bi bi-plus-circle"></i> 新增</button>' +
      '<h3 class="svc-section-title svc-set-request-title">请求和认证信息</h3>' +
      '<div class="svc-set-url-row"><label>注册后URL</label><div class="svc-url-input"><span>https://api.example.local/share-api/{接口标识}</span><input data-set-field="endpoint" value="' + escapeHtml(editorState.endpoint) + '"></div></div>' +
      '<div class="svc-param-tabs"><button class="active" type="button">Header参数</button></div>' +
      '<button class="svc-add-param" type="button" data-set-action="add-header"><i class="bi bi-plus-circle"></i> 新增参数</button>' +
      '<table class="svc-param-table svc-set-header-table"><thead><tr><th>参数名</th><th>必填</th><th>数据类型</th><th>默认值</th><th>参数说明</th><th>操作</th></tr></thead><tbody data-set-header-body>' + headerRowsHtml() + '</tbody></table>' +
      dataAreaHtml();
  }

  function headerRowsHtml() {
    if (!editorState.headerParams.length) return '<tr><td colspan="6"><div class="svc-empty-state"><i class="bi bi-inbox"></i><span>暂无数据</span></div></td></tr>';
    return editorState.headerParams.map(function (param, index) {
      return '<tr data-set-header-index="' + index + '"><td><input data-header-field="name" value="' + escapeHtml(param.name) + '"></td><td><select data-header-field="required"><option' + (param.required === '是' ? ' selected' : '') + '>是</option><option' + (param.required === '否' ? ' selected' : '') + '>否</option></select></td><td><select data-header-field="type"><option' + (param.type === 'string' ? ' selected' : '') + '>string</option><option' + (param.type === 'number' ? ' selected' : '') + '>number</option><option' + (param.type === 'boolean' ? ' selected' : '') + '>boolean</option></select></td><td><input data-header-field="value" value="' + escapeHtml(param.value) + '"></td><td><input data-header-field="desc" value="' + escapeHtml(param.desc) + '"></td><td><button class="svc-row-action danger" type="button" data-set-header-remove="' + index + '"><i class="bi bi-trash3"></i><span>删除</span></button></td></tr>';
    }).join('');
  }

  function dataAreaHtml() {
    return '' +
      '<div class="svc-set-data-tabs"><button type="button" class="' + (editorState.dataTab === 'items' ? 'active' : '') + '" data-set-data-tab="items">数据项</button><button type="button" class="' + (editorState.dataTab === 'preview' ? 'active' : '') + '" data-set-data-tab="preview">数据预览</button></div>' +
      '<div data-set-data-panel>' + (editorState.dataTab === 'preview' ? previewHtml() : fieldsHtml()) + '</div>';
  }

  function fieldsHtml() {
    var external = editorState.sourceType === '外部数据集';
    var head = external ? '<tr><th>数据项</th><th>数据类型</th><th>描述</th><th>操作</th></tr>' : '<tr><th>参数</th><th>数据类型</th><th>脱敏规则</th><th>加密规则</th><th>描述</th></tr>';
    var rows = editorState.fields.length ? editorState.fields.map(function (field, index) {
      if (external) return '<tr data-set-field-index="' + index + '"><td><input data-item-field="name" value="' + escapeHtml(field.name) + '"></td><td><select data-item-field="type"><option' + (field.type === 'string' ? ' selected' : '') + '>string</option><option' + (field.type === 'number' ? ' selected' : '') + '>number</option><option' + (field.type === 'date' ? ' selected' : '') + '>date</option><option' + (field.type === 'boolean' ? ' selected' : '') + '>boolean</option></select></td><td><input data-item-field="desc" value="' + escapeHtml(field.desc) + '"></td><td><button class="svc-row-action danger" type="button" data-set-item-remove="' + index + '"><i class="bi bi-trash3"></i><span>删除</span></button></td></tr>';
      return '<tr data-set-field-index="' + index + '"><td>' + escapeHtml(field.name) + '</td><td>' + escapeHtml(field.type) + '</td><td><select data-item-field="mask"><option value="">请选择</option><option' + (field.mask === '客户编码脱敏' ? ' selected' : '') + '>客户编码脱敏</option><option' + (field.mask === '手机号脱敏' ? ' selected' : '') + '>手机号脱敏</option></select></td><td><select data-item-field="crypto"><option value="">请选择</option><option' + (field.crypto === 'AES加密' ? ' selected' : '') + '>AES加密</option><option' + (field.crypto === 'SM4加密' ? ' selected' : '') + '>SM4加密</option></select></td><td><input class="svc-cell-input" data-item-field="desc" value="' + escapeHtml(field.desc || '') + '"></td></tr>';
    }).join('') : '<tr><td colspan="' + (external ? '4' : '5') + '"><div class="svc-empty-state"><i class="bi bi-inbox"></i><span>暂无数据</span></div></td></tr>';
    return '<div class="svc-set-data-actions">' + (external ? '<button class="btn btn-outline" type="button" data-set-action="add-item"><i class="bi bi-plus-circle"></i> 新增</button><button class="btn btn-outline" type="button" data-set-action="import"><i class="bi bi-upload"></i> 导入</button>' : '') + '</div><table class="svc-param-table svc-set-field-table"><thead>' + head + '</thead><tbody>' + rows + '</tbody></table>';
  }

  function previewHtml() {
    if (!editorState.fields.length || !editorState.preview.length) return '<div class="svc-set-preview-empty"><i class="bi bi-inbox"></i><span>暂无数据</span></div>';
    return '<div class="svc-preview-wrap svc-set-preview-wrap"><table class="svc-preview-table"><thead><tr>' + editorState.fields.map(function (field) { return '<th>' + escapeHtml(field.name) + '</th>'; }).join('') + '</tr></thead><tbody>' + editorState.preview.slice(0, 10).map(function (row) { return '<tr>' + row.map(function (value) { return '<td>' + escapeHtml(value) + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div><div class="svc-set-preview-note">预览' + Math.min(editorState.preview.length, 10) + '条记录</div>';
  }

  function classificationPickerHtml(value) {
    var nodes = ['公共目录'].concat(catalogNodes.map(function (node) { return '我的目录/' + node.name; }));
    return '<div class="svc-reg-class-picker" data-set-class-picker><input readonly data-set-meta="category" value="' + escapeHtml(value) + '" placeholder="请选择数据分类"><i class="bi bi-chevron-down"></i><div class="svc-reg-class-popup" hidden><div class="svc-catalog-search"><i class="bi bi-search"></i><input data-set-class-search placeholder="搜索目录名称"></div><div data-set-class-list>' + nodes.map(function (node) { return '<button type="button" data-set-class-option="' + escapeHtml(node) + '"><i class="bi bi-folder2"></i><span>' + escapeHtml(node) + '</span></button>'; }).join('') + '</div><div class="svc-tree-empty" data-set-class-empty hidden>未找到匹配目录</div></div></div>';
  }

  function metadataHtml() {
    var meta = editorState.meta;
    return '<div class="svc-meta-form svc-reg-meta-form svc-set-meta-form">' +
      '<div class="svc-meta-item"><label>数据编码</label><input disabled data-set-meta="code" value="' + escapeHtml(meta.code) + '"></div>' +
      '<div class="svc-meta-item"><label><em>*</em> 数据名称</label><input data-set-meta="name" value="' + escapeHtml(meta.name) + '"></div>' +
      '<div class="svc-meta-item"><label>英文名称</label><input data-set-meta="enName" value="' + escapeHtml(meta.enName) + '"></div>' +
      '<div class="svc-meta-item wide"><label>数据摘要</label><textarea data-set-meta="summary">' + escapeHtml(meta.summary) + '</textarea></div>' +
      '<div class="svc-meta-item"><label>版本</label><input disabled data-set-meta="version" value="' + escapeHtml(meta.version) + '"></div>' +
      '<div class="svc-meta-item"><label><em>*</em> 数据分类</label>' + classificationPickerHtml(meta.category) + '</div>' +
      '<div class="svc-meta-item"><label><em>*</em> 数据领域</label><select data-set-meta="domain"><option>经营分析域</option><option>客户服务域</option><option>供应链域</option><option>设备域</option><option>公共域</option></select></div>' +
      '<div class="svc-meta-item"><label>上架时间</label><input disabled value="' + escapeHtml(meta.listedAt) + '"></div>' +
      '<div class="svc-meta-item"><label>更新时间</label><input disabled value="' + escapeHtml(meta.updatedAt) + '"></div>' +
      '<div class="svc-meta-item"><label>质量评分</label><input disabled value="' + escapeHtml(meta.quality) + '"></div>' +
      '<div class="svc-meta-item"><label>浏览量</label><input disabled value="' + escapeHtml(meta.views) + '"></div>' +
      '<div class="svc-meta-item"><label>推送量</label><input disabled value="' + escapeHtml(meta.pushes) + '"></div>' +
      '<div class="svc-meta-item"><label>管理单位</label><input data-set-meta="managementUnit" value="' + escapeHtml(meta.managementUnit) + '"></div>' +
      '<div class="svc-meta-item"><label>数据来源</label><input disabled value="数据集"></div>' +
      '<div class="svc-meta-item"><label>联系电话</label><input data-set-meta="phone" value="' + escapeHtml(meta.phone) + '"></div>' +
      '<div class="svc-meta-item"><label>更新频率</label><select data-set-meta="frequency"><option>实时</option><option>每小时</option><option>每日</option><option>每周</option><option>每月</option><option>不定期</option></select></div>' +
      '<div class="svc-meta-item"><label>申请量</label><input disabled value="' + escapeHtml(meta.applications) + '"></div>' +
    '</div>';
  }

  function renderEditorPage(row, isNew) {
    editorState = makeEditorState(row, isNew);
    pageEl.innerHTML = '<div class="svc-editor-page svc-reg-editor svc-set-editor">' +
      '<div class="svc-editor-header"><div class="svc-editor-tabs"><button class="active" data-set-editor-tab="register">数据集注册</button><button data-set-editor-tab="meta">元数据信息</button></div>' +
      '<div class="svc-editor-head-actions"><button class="btn btn-outline" data-set-editor-action="cancel"><i class="bi bi-x-circle"></i> 取 消</button>' + (!isNew ? '<button class="btn btn-outline" data-set-editor-action="save-as"><i class="bi bi-files"></i> 另存为</button>' : '') + '<button class="btn btn-primary" data-set-editor-action="save"><i class="bi bi-check2-circle"></i> 保 存</button></div></div>' +
      '<div class="svc-editor-scroll"><section class="svc-editor-tab-panel active" data-set-editor-panel="register"><div data-set-register-content>' + (editorState.sourceType === '外部数据集' ? externalRegisterHtml() : internalRegisterHtml()) + '</div></section><section class="svc-editor-tab-panel" data-set-editor-panel="meta">' + metadataHtml() + '</section></div>' +
    '</div>';
    bindEditorEvents();
  }

  function syncEditorValues() {
    if (!editorState) return;
    var sourceSelect = pageEl.querySelector('[data-set-source-type]');
    if (sourceSelect) editorState.sourceType = sourceSelect.value;
    pageEl.querySelectorAll('[data-set-field]').forEach(function (field) { editorState[field.dataset.setField] = field.value; });
    pageEl.querySelectorAll('[data-set-format]').forEach(function (field) {
      var format = field.dataset.setFormat;
      var pos = editorState.formats.indexOf(format);
      if (field.checked && pos < 0) editorState.formats.push(format);
      if (!field.checked && pos > -1) editorState.formats.splice(pos, 1);
    });
    var editor = pageEl.querySelector('[data-set-sql-editor] .dp-sql-editor-content');
    if (editor) editorState.sql = editor.textContent.trim();
    pageEl.querySelectorAll('[data-set-meta]').forEach(function (field) { editorState.meta[field.dataset.setMeta] = field.value; });
    pageEl.querySelectorAll('[data-set-file-index]').forEach(function (card) {
      var file = editorState.files[Number(card.dataset.setFileIndex)];
      if (!file) return;
      card.querySelectorAll('[data-file-field]').forEach(function (field) { file[field.dataset.fileField] = field.value; });
    });
    pageEl.querySelectorAll('[data-set-header-index]').forEach(function (tr) {
      var param = editorState.headerParams[Number(tr.dataset.setHeaderIndex)];
      if (!param) return;
      tr.querySelectorAll('[data-header-field]').forEach(function (field) { param[field.dataset.headerField] = field.value; });
    });
    pageEl.querySelectorAll('[data-set-field-index]').forEach(function (tr) {
      var fieldData = editorState.fields[Number(tr.dataset.setFieldIndex)];
      if (!fieldData) return;
      tr.querySelectorAll('[data-item-field]').forEach(function (field) { fieldData[field.dataset.itemField] = field.value; });
    });
  }

  function rerenderRegister() {
    var container = pageEl.querySelector('[data-set-register-content]');
    if (!container) return;
    container.innerHTML = editorState.sourceType === '外部数据集' ? externalRegisterHtml() : internalRegisterHtml();
    bindRegisterEvents(container);
  }

  function switchEditorTab(key) {
    editorState.activeTab = key;
    pageEl.querySelectorAll('[data-set-editor-tab]').forEach(function (button) { button.classList.toggle('active', button.dataset.setEditorTab === key); });
    pageEl.querySelectorAll('[data-set-editor-panel]').forEach(function (panel) { panel.classList.toggle('active', panel.dataset.setEditorPanel === key); });
  }

  function switchDataTab(key) {
    syncEditorValues();
    editorState.dataTab = key;
    pageEl.querySelectorAll('[data-set-data-tab]').forEach(function (button) { button.classList.toggle('active', button.dataset.setDataTab === key); });
    var panel = pageEl.querySelector('[data-set-data-panel]');
    panel.innerHTML = key === 'preview' ? previewHtml() : fieldsHtml();
    bindDynamicRegisterEvents(panel);
  }

  function bindEditorEvents() {
    pageEl.querySelectorAll('[data-set-editor-tab]').forEach(function (button) { button.addEventListener('click', function () { syncEditorValues(); switchEditorTab(button.dataset.setEditorTab); }); });
    pageEl.querySelector('[data-set-editor-action="cancel"]').addEventListener('click', renderListPage);
    pageEl.querySelector('[data-set-editor-action="save"]').addEventListener('click', function () { saveEditor(false); });
    var saveAs = pageEl.querySelector('[data-set-editor-action="save-as"]');
    if (saveAs) saveAs.addEventListener('click', function () { saveEditor(true); });
    pageEl.querySelectorAll('[data-set-meta="domain"], [data-set-meta="frequency"]').forEach(function (select) { select.value = editorState.meta[select.dataset.setMeta]; });
    bindClassificationPicker();
    bindRegisterEvents(pageEl.querySelector('[data-set-register-content]'));
  }

  function bindClassificationPicker() {
    var picker = pageEl.querySelector('[data-set-class-picker]');
    if (!picker) return;
    var popup = picker.querySelector('.svc-reg-class-popup');
    picker.querySelector(':scope > input').addEventListener('click', function () { popup.hidden = !popup.hidden; });
    picker.querySelectorAll('[data-set-class-option]').forEach(function (option) {
      option.addEventListener('click', function () { picker.querySelector(':scope > input').value = option.dataset.setClassOption; editorState.meta.category = option.dataset.setClassOption; popup.hidden = true; });
    });
    picker.querySelector('[data-set-class-search]').addEventListener('input', function (event) {
      var keyword = event.target.value.trim().toLowerCase();
      var visible = 0;
      picker.querySelectorAll('[data-set-class-option]').forEach(function (option) { var match = !keyword || option.textContent.toLowerCase().indexOf(keyword) > -1; option.hidden = !match; if (match) visible += 1; });
      picker.querySelector('[data-set-class-empty]').hidden = visible > 0;
    });
  }

  function bindRegisterEvents(scope) {
    if (!scope) return;
    var sourceType = scope.querySelector('[data-set-source-type]');
    if (sourceType) sourceType.addEventListener('change', function () {
      syncEditorValues();
      editorState.sourceType = sourceType.value;
      editorState.dataTab = 'items';
      if (editorState.sourceType === '外部数据集' && !editorState.files.length) editorState.files = [];
      rerenderRegister();
    });

    var picker = scope.querySelector('[data-set-ds-picker]');
    if (picker) {
      var dropdown = picker.querySelector('[data-set-ds-dropdown]');
      picker.querySelector('[data-set-ds-value]').addEventListener('click', function () { dropdown.hidden = !dropdown.hidden; });
      picker.querySelectorAll('[data-set-ds-toggle]').forEach(function (toggle) {
        toggle.addEventListener('click', function () { toggle.closest('[data-set-ds-node]').classList.toggle('open'); });
      });
      picker.querySelectorAll('[data-set-ds-select]').forEach(function (option) {
        option.addEventListener('click', function () {
          editorState.dataSource = option.dataset.setDsSelect;
          picker.querySelector('[data-set-ds-value]').value = editorState.dataSource;
          picker.querySelectorAll('.svc-set-ds-row.selected').forEach(function (row) { row.classList.remove('selected'); });
          option.classList.add('selected');
          dropdown.hidden = true;
        });
      });
      picker.querySelector('[data-set-ds-search]').addEventListener('input', function (event) {
        var keyword = event.target.value.trim().toLowerCase();
        var nodes = Array.prototype.slice.call(picker.querySelectorAll('[data-set-ds-node]')).reverse();
        nodes.forEach(function (node) {
          var ownMatch = !keyword || node.dataset.setDsName.indexOf(keyword) > -1 || node.dataset.setDsPath.toLowerCase().indexOf(keyword) > -1;
          var childMatch = Array.prototype.some.call(node.querySelectorAll(':scope > .svc-set-ds-children > [data-set-ds-node]'), function (child) { return !child.hidden; });
          var matched = ownMatch || childMatch;
          node.hidden = !matched;
          if (keyword && childMatch) node.classList.add('open');
        });
        picker.querySelector('[data-set-ds-empty]').hidden = picker.querySelectorAll('.svc-set-ds-tree > [data-set-ds-node]:not([hidden])').length > 0;
      });
    }

    bindDynamicRegisterEvents(scope);
    bindCodeEditor(scope);
  }

  function bindDynamicRegisterEvents(scope) {
    scope.querySelectorAll('[data-set-data-tab]').forEach(function (button) { button.addEventListener('click', function () { switchDataTab(button.dataset.setDataTab); }); });
    scope.querySelectorAll('[data-set-source-toggle]').forEach(function (item) { item.addEventListener('click', function () { item.closest('.svc-tree-node').classList.toggle('expanded'); }); });
    var sourceSearch = scope.querySelector('[data-set-source-search]');
    if (sourceSearch) sourceSearch.addEventListener('input', function () {
      var keyword = sourceSearch.value.trim().toLowerCase();
      var visible = 0;
      scope.querySelectorAll('[data-set-source-tree] .svc-tree-node').forEach(function (node) { var match = !keyword || node.textContent.toLowerCase().indexOf(keyword) > -1; node.hidden = !match; if (match) { visible += 1; if (keyword) node.classList.add('expanded'); } });
      scope.querySelector('[data-set-source-empty]').hidden = visible > 0;
    });

    var runSql = scope.querySelector('[data-set-action="run-sql"]');
    if (runSql) runSql.addEventListener('click', function () {
      syncEditorValues();
      if (!editorState.dataSource || !editorState.sql) { showToast('请选择数据源并填写自定义SQL', 'warning'); return; }
      editorState.fields = [
        { name: 'region_code', type: 'VARCHAR', mask: '', crypto: '', desc: '区域编码' },
        { name: 'business_date', type: 'DATE', mask: '', crypto: '', desc: '业务日期' },
        { name: 'sales_amount', type: 'DECIMAL', mask: '', crypto: '', desc: '销售金额' },
        { name: 'order_count', type: 'BIGINT', mask: '', crypto: '', desc: '订单数量' }
      ];
      editorState.preview = [['华东区', '2026-09-21', '2865400.50', '1286'], ['华南区', '2026-09-21', '2158730.00', '1048'], ['华北区', '2026-09-21', '1986275.80', '926']];
      editorState.sqlTested = true;
      var panel = scope.querySelector('[data-set-data-panel]');
      if (panel && editorState.dataTab === 'items') { panel.innerHTML = fieldsHtml(); bindDynamicRegisterEvents(panel); }
      showToast('测试执行成功，已读取数据项', 'success');
    });

    var addFile = scope.querySelector('[data-set-action="add-file"]');
    if (addFile) addFile.addEventListener('click', function () { syncEditorValues(); editorState.files.push({ name: '', format: '', size: '', unit: 'MB', url: '' }); rerenderRegister(); });
    scope.querySelectorAll('[data-set-file-remove]').forEach(function (button) { button.addEventListener('click', function () { syncEditorValues(); editorState.files.splice(Number(button.dataset.setFileRemove), 1); rerenderRegister(); }); });
    scope.querySelectorAll('[data-set-file-test]').forEach(function (button) { button.addEventListener('click', function () { syncEditorValues(); var file = editorState.files[Number(button.dataset.setFileTest)]; showToast(file && file.url ? '文件地址连接成功' : '请先填写原始URL', file && file.url ? 'success' : 'warning'); }); });

    var addHeader = scope.querySelector('[data-set-action="add-header"]');
    if (addHeader) addHeader.addEventListener('click', function () { syncEditorValues(); editorState.headerParams.push({ name: '', required: '是', type: 'string', value: '', desc: '' }); rerenderRegister(); });
    scope.querySelectorAll('[data-set-header-remove]').forEach(function (button) { button.addEventListener('click', function () { syncEditorValues(); editorState.headerParams.splice(Number(button.dataset.setHeaderRemove), 1); rerenderRegister(); }); });

    var addItem = scope.querySelector('[data-set-action="add-item"]');
    if (addItem) addItem.addEventListener('click', function () { syncEditorValues(); editorState.fields.push({ name: '', type: 'string', desc: '' }); var panel = pageEl.querySelector('[data-set-data-panel]'); panel.innerHTML = fieldsHtml(); bindDynamicRegisterEvents(panel); });
    scope.querySelectorAll('[data-set-item-remove]').forEach(function (button) { button.addEventListener('click', function () { syncEditorValues(); editorState.fields.splice(Number(button.dataset.setItemRemove), 1); var panel = pageEl.querySelector('[data-set-data-panel]'); panel.innerHTML = fieldsHtml(); bindDynamicRegisterEvents(panel); }); });
    var importButton = scope.querySelector('[data-set-action="import"]');
    if (importButton) importButton.addEventListener('click', showImportModal);
  }

  function bindCodeEditor(scope) {
    var editor = scope.querySelector('[data-set-sql-editor]');
    if (!editor) return;
    var content = editor.querySelector('.dp-sql-editor-content');
    editor.querySelector('[data-set-code-theme]').addEventListener('change', function (event) { editor.classList.toggle('theme-light', event.target.value === 'light'); editor.classList.toggle('theme-dark', event.target.value !== 'light'); });
    editor.querySelector('[data-set-code-size]').addEventListener('change', function (event) { content.style.fontSize = event.target.value; });
    editor.querySelectorAll('[data-set-code-action]').forEach(function (button) {
      button.addEventListener('click', function () {
        var action = button.dataset.setCodeAction;
        if (action === 'format') { content.textContent = content.textContent.replace(/\s+from\s+/i, '\nfrom ').replace(/\s+where\s+/i, '\nwhere '); editorState.sql = content.textContent; showToast('SQL格式化完成', 'success'); }
        else if (action === 'copy') { if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(content.textContent || ''); showToast('SQL已复制', 'success'); }
        else if (action === 'search') editor.classList.add('search-open');
        else if (action === 'close-search') editor.classList.remove('search-open');
        else if (action === 'fullscreen') editor.classList.toggle('is-fullscreen');
      });
    });
  }

  function showImportModal() {
    var mask = document.createElement('div');
    mask.className = 'svc-modal-mask';
    mask.innerHTML = '<div class="svc-modal svc-set-import-modal"><div class="svc-modal-head"><h3>导入</h3><button class="svc-modal-close" data-set-import-close><i class="bi bi-x-lg"></i></button></div><div class="svc-modal-body"><div class="svc-set-import-line"><label><em>*</em> 文件</label><button class="btn btn-outline" type="button" data-set-file-choose><i class="bi bi-upload"></i> 请选择文件</button><button class="btn btn-text" type="button" data-set-template><i class="bi bi-download"></i> 模板下载</button><span data-set-import-name></span></div></div><div class="svc-modal-footer"><button class="btn btn-outline" data-set-import-close><i class="bi bi-x-circle"></i> 取 消</button><button class="btn btn-primary" data-set-import-ok><i class="bi bi-check2-circle"></i> 确 定</button></div></div>';
    pageEl.appendChild(mask);
    mask.querySelectorAll('[data-set-import-close]').forEach(function (button) { button.addEventListener('click', function () { mask.remove(); }); });
    mask.querySelector('[data-set-file-choose]').addEventListener('click', function () { mask.querySelector('[data-set-import-name]').textContent = '数据项导入模板.xlsx'; });
    mask.querySelector('[data-set-template]').addEventListener('click', function () { showToast('数据项导入模板已生成', 'success'); });
    mask.querySelector('[data-set-import-ok]').addEventListener('click', function () {
      if (!mask.querySelector('[data-set-import-name]').textContent) { showToast('请选择导入文件', 'warning'); return; }
      editorState.fields = [{ name: 'record_code', type: 'string', desc: '记录编码' }, { name: 'record_name', type: 'string', desc: '记录名称' }, { name: 'update_time', type: 'date', desc: '更新时间' }];
      mask.remove();
      var panel = pageEl.querySelector('[data-set-data-panel]');
      panel.innerHTML = fieldsHtml();
      bindDynamicRegisterEvents(panel);
      showToast('数据项导入完成', 'success');
    });
  }

  function saveEditor(asCopy) {
    syncEditorValues();
    if (!editorState.endpoint.trim()) { showToast('请填写请求URL', 'warning'); return; }
    if (editorState.sourceType === '内部数据集' && (!editorState.dataSource || !editorState.sql)) { showToast('请选择数据源并填写自定义SQL', 'warning'); return; }
    if (editorState.sourceType === '外部数据集' && !editorState.files.length) { showToast('请至少新增一个外部文件', 'warning'); return; }
    if (!editorState.meta.name.trim()) { switchEditorTab('meta'); showToast('请填写数据名称', 'warning'); return; }
    var target = !asCopy && !editorState.isNew ? findRow(editorState.rowId) : null;
    if (!target) { target = { id: 'set-' + Date.now(), code: nextCode(), publishStatus: '编制', auditStatus: '', type: '文件数据集' }; datasetRows.unshift(target); }
    target.name = editorState.meta.name;
    target.enName = editorState.meta.enName || editorState.endpoint.replace(/^\//, '').replace(/[^a-zA-Z0-9]+/g, '_');
    target.category = editorState.meta.category || '公共目录';
    target.version = asCopy ? 'V' + (Number(String(editorState.meta.version).replace(/\D/g, '')) + 1 || 1) : editorState.meta.version;
    target.updateTime = '2026-09-21 11:50:00';
    target.desc = editorState.meta.summary;
    target.sourceType = editorState.sourceType;
    target.dataSource = editorState.dataSource;
    target.proxy = editorState.proxy;
    target.endpoint = editorState.endpoint;
    target.formats = editorState.formats.slice();
    target.sql = editorState.sql;
    target.files = editorState.files.map(function (item) { return Object.assign({}, item); });
    target.headerParams = editorState.headerParams.map(function (item) { return Object.assign({}, item); });
    target.fields = editorState.fields.map(function (item) { return Object.assign({}, item); });
    target.preview = editorState.preview.map(function (item) { return item.slice(); });
    target.domain = editorState.meta.domain;
    target.summary = editorState.meta.summary;
    target.managementUnit = editorState.meta.managementUnit;
    target.phone = editorState.meta.phone;
    target.frequency = editorState.meta.frequency;
    target.quality = editorState.meta.quality;
    target.views = editorState.meta.views;
    target.pushes = editorState.meta.pushes;
    target.applications = editorState.meta.applications;
    target.listedAt = editorState.meta.listedAt;
    renderListPage();
    showToast(asCopy ? '数据集已另存为新版本' : '数据集信息已保存', 'success');
  }

  function renderTestPage(row) {
    pageEl.innerHTML = catalogHtml() + '<section class="svc-list-panel svc-reg-test-page svc-set-test-page"><div class="svc-reg-test-header"><h3><i class="bi bi-paperclip"></i> 接口测试</h3><button class="btn btn-outline" data-set-test-back><i class="bi bi-arrow-left"></i> 返回</button></div><div class="svc-reg-test-scroll"><div class="svc-reg-test-summary"><div><span>数据名称：</span><strong>' + escapeHtml(row.name) + '</strong></div><div><span>传输协议：</span><strong>HTTP</strong></div><div><span>请求方式：</span><strong>GET</strong></div><div><span>数据格式：</span><strong>' + escapeHtml((row.formats && row.formats[0]) || 'JSON') + '</strong></div><div><span>接口类型：</span><strong>REST</strong></div><div><span>接口地址：</span><strong>' + escapeHtml(row.endpoint) + '</strong></div></div><h3 class="svc-section-title">请求参数</h3><div class="svc-set-test-empty">当前数据集无需请求参数</div><button class="btn btn-primary svc-reg-send" type="button" data-set-download><i class="bi bi-download"></i> 下载测试</button><div class="svc-set-download-result" data-set-download-result hidden><i class="bi bi-check-circle-fill"></i><div><strong>测试文件生成成功</strong><span>' + escapeHtml(row.enName) + '.' + escapeHtml(((row.formats && row.formats[0]) || 'json').toLowerCase()) + ' · 3 条预览记录</span></div></div></div></section>';
    bindCatalogEvents();
    pageEl.querySelector('[data-set-test-back]').addEventListener('click', renderListPage);
    pageEl.querySelector('[data-set-download]').addEventListener('click', function () { pageEl.querySelector('[data-set-download-result]').hidden = false; showToast('下载测试成功', 'success'); });
  }

  return {
    html: '<div class="page-service-api-dev page-service-dataset"></div>',
    init: function () {
      pageEl = document.querySelector('.page-service-dataset');
      if (!pageEl) return;
      selectedCatalog = '公共目录';
      renderListPage();
    }
  };
})();
