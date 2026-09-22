/**
 * 数据中台 V4.0 - 数据服务 · 接口注册
 * 依据参考系统还原接口注册列表、注册编辑、元数据信息和接口测试流程。
 */
window.DP = window.DP || {};
DP.pages = DP.pages || {};

DP.pages.serviceApiRegistration = (function () {
  var pageEl;
  var selectedCatalog = '公共目录';
  var zebraEnabled = false;
  var editorState = null;

  var apiRows = [
    {
      id: 'reg-001', code: '20260921103726001', name: '客户主数据查询服务', enName: 'customer_master_query',
      category: '公共目录', type: '注册接口', version: 'V1', publishStatus: '已上架', auditStatus: '上架通过',
      updateTime: '2026-09-21 10:37:26', desc: '按客户编码查询统一客户主数据', method: 'GET',
      originalUrl: 'https://mdm.example.local/api/customers/{customerCode}', endpoint: '/customer-master/query',
      dataDomain: '客户域', summary: '为业务系统提供统一客户主数据查询能力', managementUnit: '数据资产运营中心', phone: '010-55586601', frequency: '实时'
    },
    {
      id: 'reg-002', code: '20260920165812002', name: '经营区域编码查询', enName: 'region_code_lookup',
      category: '公共目录,我的目录/经营分析', type: '注册接口', version: 'V2', publishStatus: '编制', auditStatus: '',
      updateTime: '2026-09-20 16:58:12', desc: '查询行政区划及经营区域映射关系', method: 'POST',
      originalUrl: 'https://master.example.local/api/regions/search', endpoint: '/region-code/search',
      dataDomain: '公共域', summary: '统一提供行政区划和经营区域映射查询', managementUnit: '数据治理中心', phone: '010-55586602', frequency: '每日'
    },
    {
      id: 'reg-003', code: '20260919142648003', name: '工单处理进度查询', enName: 'ticket_progress_query',
      category: '我的目录/工单数据', type: '注册接口', version: 'V1', publishStatus: '开发', auditStatus: '',
      updateTime: '2026-09-19 14:26:48', desc: '查询服务工单当前节点及处理进度', method: 'GET',
      originalUrl: 'https://service.example.local/api/tickets/{ticketNo}/progress', endpoint: '/ticket/progress',
      dataDomain: '服务域', summary: '面向客服和运营人员提供工单进度查询', managementUnit: '客户服务中心', phone: '010-55586603', frequency: '实时'
    },
    {
      id: 'reg-004', code: '20260918110933004', name: '供应商档案查询', enName: 'supplier_profile_query',
      category: '我的目录/供应链数据', type: '注册接口', version: 'V1', publishStatus: '待上架', auditStatus: '上架待审核',
      updateTime: '2026-09-18 11:09:33', desc: '查询供应商基础档案及合作状态', method: 'POST',
      originalUrl: 'https://scm.example.local/api/suppliers/profile', endpoint: '/supplier/profile',
      dataDomain: '供应链域', summary: '提供供应商统一档案及合作状态查询', managementUnit: '供应链数据中心', phone: '010-55586604', frequency: '每日'
    },
    {
      id: 'reg-005', code: '20260917150815005', name: '设备运行状态查询', enName: 'device_runtime_status',
      category: '我的目录/物联感知', type: '注册接口', version: 'V1', publishStatus: '已上架', auditStatus: '上架通过',
      updateTime: '2026-09-17 15:08:15', desc: '按设备编码查询在线状态和最新采集时间', method: 'GET',
      originalUrl: 'https://iot.example.local/api/devices/{deviceCode}/status', endpoint: '/device/runtime-status',
      dataDomain: '设备域', summary: '提供设备在线状态和最新采集时间查询', managementUnit: '物联数据中心', phone: '010-55586605', frequency: '实时'
    }
  ];

  var catalogNodes = [
    { name: '经营分析', key: '经营分析' },
    { name: '工单数据', key: '工单数据' },
    { name: '供应链数据', key: '供应链数据' },
    { name: '物联感知', key: '物联感知' }
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
    return '' + now.getFullYear() + pad(now.getMonth() + 1) + pad(now.getDate()) + pad(now.getHours()) + pad(now.getMinutes()) + pad(now.getSeconds()) + String(apiRows.length + 1).padStart(3, '0');
  }

  function statusClass(status) {
    if (status === '已上架' || status === '上架通过' || status === '下架通过') return 'success';
    if (status === '开发') return 'processing';
    if (status === '待上架' || status === '上架待审核' || status === '下架待审核') return 'warning';
    if (status === '上架驳回' || status === '下架驳回') return 'danger';
    return 'default';
  }

  function renderStatus(text) {
    if (!text) return '<span class="svc-empty">--</span>';
    return '<span class="svc-status ' + statusClass(text) + '">' + escapeHtml(text) + '</span>';
  }

  function catalogHtml() {
    return '' +
      '<aside class="svc-catalog-panel">' +
        '<div class="svc-catalog-title"><i class="bi bi-list"></i><span>数据目录</span></div>' +
        '<div class="svc-catalog-search"><i class="bi bi-search"></i><input data-reg-catalog-search placeholder="请输入目录名称"></div>' +
        '<div class="svc-tree-list" data-reg-catalog-tree>' +
          '<div class="svc-tree-row' + (selectedCatalog === '公共目录' ? ' active' : '') + '" data-catalog="公共目录"><i class="bi bi-folder-fill"></i><span>公共目录</span></div>' +
          '<div class="svc-tree-row has-children open' + (selectedCatalog === '我的目录' ? ' active' : '') + '" data-catalog="我的目录"><i class="bi bi-chevron-right svc-tree-arrow"></i><i class="bi bi-folder-fill"></i><span>我的目录 (' + catalogNodes.length + ')</span></div>' +
          '<div class="svc-tree-children">' + catalogNodes.map(function (node) {
            return '<div class="svc-tree-row child' + (selectedCatalog === node.key ? ' active' : '') + '" data-catalog="' + escapeHtml(node.key) + '"><i class="bi bi-folder2"></i><span>' + escapeHtml(node.name) + '</span></div>';
          }).join('') + '</div>' +
          '<div class="svc-tree-empty" data-reg-catalog-empty hidden>未找到匹配目录</div>' +
        '</div>' +
      '</aside>';
  }

  function getFilters() {
    return {
      publish: pageEl.querySelector('[data-reg-filter="publish"]') ? pageEl.querySelector('[data-reg-filter="publish"]').value : '',
      audit: pageEl.querySelector('[data-reg-filter="audit"]') ? pageEl.querySelector('[data-reg-filter="audit"]').value : '',
      keyword: pageEl.querySelector('[data-reg-filter="keyword"]') ? pageEl.querySelector('[data-reg-filter="keyword"]').value.trim().toLowerCase() : ''
    };
  }

  function getFilteredRows() {
    var filters = getFilters();
    return apiRows.filter(function (row) {
      if (filters.publish && row.publishStatus !== filters.publish) return false;
      if (filters.audit && row.auditStatus !== filters.audit) return false;
      if (selectedCatalog === '我的目录' && row.category.indexOf('我的目录') < 0) return false;
      if (selectedCatalog !== '公共目录' && selectedCatalog !== '我的目录' && row.category.indexOf(selectedCatalog) < 0) return false;
      if (filters.keyword && [row.code, row.name, row.enName].join(' ').toLowerCase().indexOf(filters.keyword) < 0) return false;
      return true;
    });
  }

  function renderRow(row) {
    var secondary = row.publishStatus === '开发'
      ? '<button class="svc-row-action danger" data-reg-row-action="delete" data-id="' + row.id + '"><i class="bi bi-trash3"></i><span>删除</span></button>'
      : '<button class="svc-row-action" data-reg-row-action="test" data-id="' + row.id + '"><i class="bi bi-link-45deg"></i><span>接口测试</span></button>';
    return '' +
      '<tr data-row-id="' + row.id + '">' +
        '<td class="svc-check-col"><input type="checkbox" class="svc-row-check" data-reg-row-check="' + row.id + '"></td>' +
        '<td class="svc-code-col">' + escapeHtml(row.code) + '</td>' +
        '<td class="svc-name-col" title="' + escapeHtml(row.name) + '">' + escapeHtml(row.name) + '</td>' +
        '<td class="svc-en-col" title="' + escapeHtml(row.enName) + '">' + escapeHtml(row.enName) + '</td>' +
        '<td class="svc-category-col" title="' + escapeHtml(row.category) + '">' + escapeHtml(row.category) + '</td>' +
        '<td>' + escapeHtml(row.type) + '</td>' +
        '<td>' + escapeHtml(row.version) + '</td>' +
        '<td>' + renderStatus(row.publishStatus) + '</td>' +
        '<td>' + renderStatus(row.auditStatus) + '</td>' +
        '<td>' + escapeHtml(row.updateTime) + '</td>' +
        '<td class="svc-desc-col" title="' + escapeHtml(row.desc) + '">' + escapeHtml(row.desc) + '</td>' +
        '<td class="svc-action-col">' +
          '<button class="svc-row-action" data-reg-row-action="edit" data-id="' + row.id + '"><i class="bi bi-pencil-square"></i><span>修改</span></button>' + secondary +
        '</td>' +
      '</tr>';
  }

  function renderTable() {
    var body = pageEl.querySelector('#regApiTbody');
    if (!body) return;
    var rows = getFilteredRows();
    body.innerHTML = rows.length ? rows.map(renderRow).join('') : '<tr><td colspan="12"><div class="svc-empty-state"><i class="bi bi-inbox"></i><span>暂无匹配的接口注册记录</span></div></td></tr>';
    pageEl.querySelector('[data-reg-total]').textContent = '共 ' + rows.length + ' 条';
    var checkAll = pageEl.querySelector('#regApiCheckAll');
    if (checkAll) checkAll.checked = false;
  }

  function listPanelHtml() {
    return '' +
      '<section class="svc-list-panel">' +
        '<div class="svc-toolbar">' +
          '<div class="svc-toolbar-left">' +
            '<button class="btn btn-text svc-top-action" data-reg-action="add"><i class="bi bi-plus-circle"></i> 新增</button>' +
            '<button class="btn btn-text svc-top-action" data-reg-action="deploy"><i class="bi bi-send"></i> 部署测试</button>' +
            '<button class="btn btn-text svc-top-action" data-reg-action="undeploy"><i class="bi bi-x-square"></i> 取消部署</button>' +
          '</div>' +
          '<div class="svc-filter-bar">' +
            '<label>发布状态</label><select class="svc-select" data-reg-filter="publish"><option value="">请选择</option><option>编制</option><option>开发</option><option>待上架</option><option>已上架</option></select>' +
            '<label>审核状态</label><select class="svc-select" data-reg-filter="audit"><option value="">请选择</option><option>上架待审核</option><option>上架通过</option><option>上架驳回</option><option>下架待审核</option><option>下架通过</option><option>下架驳回</option></select>' +
            '<input class="svc-keyword" data-reg-filter="keyword" placeholder="数据编码/数据名称/英文名称">' +
            '<button class="btn btn-primary svc-query" data-reg-action="search"><i class="bi bi-search"></i> 查询</button>' +
          '</div>' +
        '</div>' +
        '<div class="svc-table-tools">' +
          '<label class="svc-switch" title="表格斑马纹"><input type="checkbox" data-reg-zebra' + (zebraEnabled ? ' checked' : '') + '><span class="svc-switch-track"></span><em class="svc-switch-text">' + (zebraEnabled ? '开' : '关') + '</em></label>' +
          '<span class="svc-tool-sep"></span>' +
          '<button class="svc-tool-btn" title="刷新" data-reg-tool="refresh"><i class="bi bi-arrow-clockwise"></i></button>' +
          '<button class="svc-tool-btn" title="行高" data-reg-tool="density"><i class="bi bi-arrows-expand"></i></button>' +
          '<button class="svc-tool-btn" title="列设置" data-reg-tool="columns"><i class="bi bi-gear"></i></button>' +
          '<button class="svc-tool-btn" title="全屏" data-reg-tool="fullscreen"><i class="bi bi-arrows-fullscreen"></i></button>' +
        '</div>' +
        '<div class="svc-table-wrap">' +
          '<table class="ds-table svc-api-table"><thead><tr>' +
            '<th class="svc-check-col"><input type="checkbox" id="regApiCheckAll"></th>' +
            '<th class="svc-code-col">数据编码 <i class="bi bi-caret-up-fill sort-icon"></i><i class="bi bi-caret-down-fill sort-icon"></i></th>' +
            '<th class="svc-name-col">数据名称 <i class="bi bi-caret-up-fill sort-icon"></i><i class="bi bi-caret-down-fill sort-icon"></i></th>' +
            '<th class="svc-en-col">英文名称 <i class="bi bi-caret-up-fill sort-icon"></i><i class="bi bi-caret-down-fill sort-icon"></i></th>' +
            '<th class="svc-category-col">分类</th><th>接口类型</th><th>版本</th><th>发布状态</th><th>审核状态</th><th>更新时间</th><th class="svc-desc-col">描述</th><th class="svc-action-col">操作</th>' +
          '</tr></thead><tbody id="regApiTbody"></tbody></table>' +
        '</div>' +
        '<div class="svc-pagination"><span data-reg-total>共 0 条</span><div class="svc-page-controls"><button class="svc-page-btn disabled"><i class="bi bi-chevron-left"></i></button><button class="svc-page-num active">1</button><button class="svc-page-btn disabled"><i class="bi bi-chevron-right"></i></button><select class="svc-page-size"><option>10 条/页</option><option>20 条/页</option><option>50 条/页</option></select></div></div>' +
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
    return Array.prototype.map.call(pageEl.querySelectorAll('[data-reg-row-check]:checked'), function (item) { return item.dataset.regRowCheck; });
  }

  function findRow(id) {
    return apiRows.find(function (row) { return row.id === id; });
  }

  function renderListPage() {
    pageEl.classList.toggle('zebra-table', zebraEnabled);
    pageEl.innerHTML = catalogHtml() + listPanelHtml();
    bindCatalogEvents();
    bindListEvents();
    renderTable();
  }

  function bindCatalogEvents() {
    pageEl.querySelectorAll('.svc-tree-row').forEach(function (row) {
      row.addEventListener('click', function () {
        if (row.classList.contains('has-children')) row.classList.toggle('open');
        pageEl.querySelectorAll('.svc-tree-row.active').forEach(function (item) { item.classList.remove('active'); });
        row.classList.add('active');
        selectedCatalog = row.dataset.catalog || '公共目录';
        renderTable();
      });
    });
    var search = pageEl.querySelector('[data-reg-catalog-search]');
    if (!search) return;
    search.addEventListener('input', function () {
      var keyword = search.value.trim().toLowerCase();
      var visibleCount = 0;
      pageEl.querySelectorAll('.svc-tree-row').forEach(function (row) {
        var matched = !keyword || row.textContent.trim().toLowerCase().indexOf(keyword) > -1;
        if (row.classList.contains('has-children') && keyword) {
          matched = matched || Array.prototype.some.call(pageEl.querySelectorAll('.svc-tree-row.child'), function (child) { return child.textContent.trim().toLowerCase().indexOf(keyword) > -1; });
          if (matched) row.classList.add('open');
        }
        if (row.classList.contains('child') && keyword && row.textContent.trim().toLowerCase().indexOf(keyword) < 0) matched = false;
        row.style.display = matched ? '' : 'none';
        if (matched) visibleCount += 1;
      });
      pageEl.querySelector('[data-reg-catalog-empty]').hidden = visibleCount > 0;
    });
  }

  function bindListEvents() {
    pageEl.querySelector('[data-reg-action="add"]').addEventListener('click', function () { renderEditorPage(null, true); });
    pageEl.querySelector('[data-reg-action="search"]').addEventListener('click', renderTable);
    pageEl.querySelector('[data-reg-filter="keyword"]').addEventListener('keydown', function (event) { if (event.key === 'Enter') renderTable(); });
    pageEl.querySelectorAll('[data-reg-filter="publish"], [data-reg-filter="audit"]').forEach(function (select) { select.addEventListener('change', renderTable); });
    pageEl.querySelector('#regApiCheckAll').addEventListener('change', function (event) { pageEl.querySelectorAll('.svc-row-check').forEach(function (item) { item.checked = event.target.checked; }); });

    pageEl.querySelector('[data-reg-action="deploy"]').addEventListener('click', function () {
      var ids = selectedIds();
      if (!ids.length) { showToast('请选择数据', 'warning'); return; }
      ids.forEach(function (id) { var row = findRow(id); if (row && (row.publishStatus === '编制' || row.publishStatus === '开发')) row.publishStatus = '开发'; });
      renderTable();
      showToast('已提交 ' + ids.length + ' 个接口进行部署测试', 'success');
    });

    pageEl.querySelector('[data-reg-action="undeploy"]').addEventListener('click', function () {
      var ids = selectedIds();
      if (!ids.length) { showToast('请选择数据', 'warning'); return; }
      DP.confirm('确认取消部署已选择的 ' + ids.length + ' 个接口吗？', {
        icon: 'info',
        onOk: function () {
          ids.forEach(function (id) { var row = findRow(id); if (row && row.publishStatus === '开发') row.publishStatus = '编制'; });
          renderTable();
          showToast('已取消部署', 'success');
        }
      });
    });

    pageEl.querySelector('#regApiTbody').addEventListener('click', function (event) {
      var button = event.target.closest('[data-reg-row-action]');
      if (!button) return;
      var row = findRow(button.dataset.id);
      if (!row) return;
      if (button.dataset.regRowAction === 'edit') renderEditorPage(row, false);
      if (button.dataset.regRowAction === 'test') renderTestPage(row);
      if (button.dataset.regRowAction === 'delete') {
        DP.confirm('确认删除接口【' + escapeHtml(row.name) + '】吗？', {
          icon: 'danger',
          onOk: function () {
            apiRows = apiRows.filter(function (item) { return item.id !== row.id; });
            renderTable();
            showToast('接口已删除', 'success');
          }
        });
      }
    });

    pageEl.querySelector('[data-reg-zebra]').addEventListener('change', function (event) {
      zebraEnabled = event.target.checked;
      pageEl.classList.toggle('zebra-table', zebraEnabled);
      pageEl.querySelector('.svc-switch-text').textContent = zebraEnabled ? '开' : '关';
    });

    pageEl.querySelectorAll('[data-reg-tool]').forEach(function (button) {
      button.addEventListener('click', function () {
        var action = button.dataset.regTool;
        if (action === 'refresh') { renderTable(); showToast('列表已刷新', 'success'); }
        else if (action === 'density') { pageEl.classList.toggle('compact-table'); showToast(pageEl.classList.contains('compact-table') ? '已切换为紧凑行高' : '已恢复默认行高', 'info'); }
        else if (action === 'fullscreen') { pageEl.classList.toggle('svc-page-fullscreen'); showToast(pageEl.classList.contains('svc-page-fullscreen') ? '已进入全屏' : '已退出全屏', 'info'); }
        else showToast('可在列设置中控制表格字段显示', 'info');
      });
    });
  }

  function emptyParam() {
    return { name: '', required: '是', type: 'string', value: '', desc: '' };
  }

  function makeEditorState(row, isNew) {
    row = row || {};
    var isPost = row.method === 'POST';
    return {
      rowId: row.id || '', isNew: !!isNew, activeTab: 'register', activeParam: isPost ? 'body' : 'header',
      method: row.method || 'GET', originalUrl: row.originalUrl || '', endpoint: row.endpoint || '/customer-profile', cache: '否', proxy: '',
      params: {
        header: row.id ? [{ name: 'X-Request-Id', required: '否', type: 'string', value: '', desc: '请求链路标识' }] : [],
        path: row.method === 'GET' ? [{ name: row.enName && row.enName.indexOf('device') > -1 ? 'deviceCode' : 'customerCode', required: '是', type: 'string', value: '', desc: '业务主键' }] : [],
        query: [],
        body: isPost ? [
          { name: 'pageIndex', required: '否', type: 'number', value: '1', desc: '页码' },
          { name: 'pageSize', required: '否', type: 'number', value: '20', desc: '每页条数' }
        ] : []
      },
      bodyType: 'json', bodyText: isPost ? '{\n  "pageIndex": 1,\n  "pageSize": 20,\n  "keyword": ""\n}' : '', responseReady: false,
      meta: {
        code: row.code || '', name: row.name || '', enName: row.enName || '', summary: row.summary || row.desc || '',
        version: row.version || 'V1', category: row.category || '公共目录', dataDomain: row.dataDomain || '客户域',
        listedAt: row.publishStatus === '已上架' ? row.updateTime : '', updatedAt: row.updateTime || '', quality: '--', views: row.id ? '36' : '0', pushes: row.id ? '8' : '0', calls: row.id ? '128' : '0',
        managementUnit: row.managementUnit || '数据资产运营中心', source: '接口注册', phone: row.phone || '', frequency: row.frequency || '实时', applications: row.id ? '3' : '0'
      }
    };
  }

  function codeEditorHtml(code, attr) {
    return '' +
      '<div class="svc-reg-codebox" ' + (attr || '') + '>' +
        '<div class="svc-reg-code-toolbar">' +
          '<select data-reg-code-theme><option value="dark">暗色 - One Dark</option><option value="light">亮色 - Light</option></select>' +
          '<select data-reg-code-size><option>12px</option><option selected>14px</option><option>16px</option><option>18px</option></select>' +
          '<button type="button" data-reg-code-action="format"><i class="bi bi-brush"></i> 格式化</button>' +
          '<button type="button" data-reg-code-action="copy"><i class="bi bi-clipboard"></i> 复制</button>' +
          '<button type="button" data-reg-code-action="search"><i class="bi bi-search"></i> 搜索</button>' +
          '<button type="button" data-reg-code-action="fullscreen"><i class="bi bi-arrows-fullscreen"></i> 全屏</button>' +
        '</div>' +
        '<div class="svc-reg-code-search" hidden><input placeholder="查找内容"><button type="button" data-reg-code-action="close-search"><i class="bi bi-x"></i></button></div>' +
        '<div class="svc-reg-code-content" contenteditable="true" spellcheck="false">' + escapeHtml(code || '') + '</div>' +
      '</div>';
  }

  function dataTypeOptions(value) {
    return ['string', 'number', 'boolean', 'object', 'array'].map(function (item) { return '<option' + (item === value ? ' selected' : '') + '>' + item + '</option>'; }).join('');
  }

  function paramRowsHtml(rows, withDelete) {
    if (!rows.length) return '<tr><td colspan="6"><div class="svc-empty-state"><i class="bi bi-inbox"></i><span>暂无数据</span></div></td></tr>';
    return rows.map(function (row, index) {
      return '' +
        '<tr data-reg-param-row="' + index + '">' +
          '<td><input data-reg-param-field="name" value="' + escapeHtml(row.name) + '" placeholder="请输入参数名"></td>' +
          '<td><select data-reg-param-field="required"><option' + (row.required === '是' ? ' selected' : '') + '>是</option><option' + (row.required === '否' ? ' selected' : '') + '>否</option></select></td>' +
          '<td><select data-reg-param-field="type">' + dataTypeOptions(row.type) + '</select></td>' +
          '<td><input data-reg-param-field="value" value="' + escapeHtml(row.value) + '" placeholder="请输入默认值"></td>' +
          '<td><input data-reg-param-field="desc" value="' + escapeHtml(row.desc) + '" placeholder="请输入参数说明"></td>' +
          '<td>' + (withDelete ? '<button class="svc-row-action danger" type="button" data-reg-param-delete="' + index + '"><i class="bi bi-trash3"></i><span>删除</span></button>' : '') + '</td>' +
        '</tr>';
    }).join('');
  }

  function renderParamArea() {
    var area = pageEl.querySelector('[data-reg-param-area]');
    if (!area) return;
    var tabs = ['header', 'path', 'query'];
    if (editorState.method === 'POST') tabs.push('body');
    if (tabs.indexOf(editorState.activeParam) < 0) editorState.activeParam = 'header';
    var labels = { header: 'Header参数', path: 'Path参数', query: 'Query参数', body: 'Body参数' };
    var html = '<div class="svc-param-tabs">' + tabs.map(function (key) { return '<button type="button" class="' + (editorState.activeParam === key ? 'active' : '') + '" data-reg-param-tab="' + key + '">' + labels[key] + '</button>'; }).join('') + '</div>';
    if (editorState.activeParam === 'body') {
      html += '' +
        '<div class="svc-reg-radio-row"><label><input type="radio" name="regBodyType" value="json"' + (editorState.bodyType === 'json' ? ' checked' : '') + '> json</label><label><input type="radio" name="regBodyType" value="xml"' + (editorState.bodyType === 'xml' ? ' checked' : '') + '> xml</label><label><input type="radio" name="regBodyType" value="x-www-form-urlencoded"' + (editorState.bodyType === 'x-www-form-urlencoded' ? ' checked' : '') + '> x-www-form-urlencoded</label></div>' +
        '<div class="svc-reg-body-grid"><div>' + codeEditorHtml(editorState.bodyText, 'data-reg-body-editor') + '<button class="btn btn-warning svc-reg-parse" type="button" data-reg-parse-body><i class="bi bi-braces"></i> 参数解析</button></div>' +
          '<div class="svc-reg-body-table"><table class="svc-param-table"><thead><tr><th>参数名</th><th>必填</th><th>数据类型</th><th>参数值</th><th>参数说明</th><th></th></tr></thead><tbody>' + paramRowsHtml(editorState.params.body, false) + '</tbody></table></div></div>';
    } else {
      html += '<button class="svc-add-param" type="button" data-reg-add-param><i class="bi bi-plus-circle"></i> 新增参数</button>' +
        '<table class="svc-param-table"><thead><tr><th>参数名</th><th>必填</th><th>数据类型</th><th>默认值</th><th>参数说明</th><th>操作</th></tr></thead><tbody>' + paramRowsHtml(editorState.params[editorState.activeParam], true) + '</tbody></table>';
    }
    area.innerHTML = html;
    bindParamEvents();
    bindCodeEditors(area);
  }

  function bindParamEvents() {
    var area = pageEl.querySelector('[data-reg-param-area]');
    if (!area) return;
    area.querySelectorAll('[data-reg-param-tab]').forEach(function (button) {
      button.addEventListener('click', function () { editorState.activeParam = button.dataset.regParamTab; renderParamArea(); });
    });
    var addButton = area.querySelector('[data-reg-add-param]');
    if (addButton) addButton.addEventListener('click', function () { editorState.params[editorState.activeParam].push(emptyParam()); renderParamArea(); });
    area.querySelectorAll('[data-reg-param-delete]').forEach(function (button) {
      button.addEventListener('click', function () { editorState.params[editorState.activeParam].splice(Number(button.dataset.regParamDelete), 1); renderParamArea(); });
    });
    area.querySelectorAll('[data-reg-param-field]').forEach(function (field) {
      field.addEventListener('input', function () {
        var row = field.closest('[data-reg-param-row]');
        if (!row) return;
        editorState.params[editorState.activeParam][Number(row.dataset.regParamRow)][field.dataset.regParamField] = field.value;
      });
    });
    area.querySelectorAll('input[name="regBodyType"]').forEach(function (radio) { radio.addEventListener('change', function () { editorState.bodyType = radio.value; }); });
    var parseButton = area.querySelector('[data-reg-parse-body]');
    if (parseButton) parseButton.addEventListener('click', function () {
      var content = area.querySelector('[data-reg-body-editor] .svc-reg-code-content');
      try {
        var value = JSON.parse(content.textContent || '{}');
        editorState.bodyText = JSON.stringify(value, null, 2);
        editorState.params.body = Object.keys(value).map(function (key) { return { name: key, required: '否', type: Array.isArray(value[key]) ? 'array' : (value[key] === null ? 'string' : typeof value[key]), value: value[key] == null ? '' : String(value[key]), desc: '' }; });
        renderParamArea();
        showToast('请求体参数解析完成', 'success');
      } catch (error) { showToast('请求体不是有效的 JSON', 'warning'); }
    });
  }

  function metadataHtml() {
    var meta = editorState.meta;
    return '' +
      '<div class="svc-meta-form svc-reg-meta-form">' +
        '<div class="svc-meta-item"><label>数据编码</label><input disabled data-reg-meta="code" value="' + escapeHtml(meta.code) + '"></div>' +
        '<div class="svc-meta-item"><label><em>*</em> 数据名称</label><input data-reg-meta="name" value="' + escapeHtml(meta.name) + '"></div>' +
        '<div class="svc-meta-item"><label>英文名称</label><input data-reg-meta="enName" value="' + escapeHtml(meta.enName) + '"></div>' +
        '<div class="svc-meta-item wide"><label>数据摘要</label><textarea data-reg-meta="summary">' + escapeHtml(meta.summary) + '</textarea></div>' +
        '<div class="svc-meta-item"><label>版本</label><input disabled data-reg-meta="version" value="' + escapeHtml(meta.version) + '"></div>' +
        '<div class="svc-meta-item"><label><em>*</em> 数据分类</label>' + classificationPickerHtml(meta.category) + '</div>' +
        '<div class="svc-meta-item"><label><em>*</em> 数据领域</label><select data-reg-meta="dataDomain"><option>客户域</option><option>公共域</option><option>服务域</option><option>供应链域</option><option>设备域</option></select></div>' +
        '<div class="svc-meta-item"><label>上架时间</label><input disabled value="' + escapeHtml(meta.listedAt) + '"></div>' +
        '<div class="svc-meta-item"><label>更新时间</label><input disabled value="' + escapeHtml(meta.updatedAt) + '"></div>' +
        '<div class="svc-meta-item"><label>质量评分</label><input disabled value="' + escapeHtml(meta.quality) + '"></div>' +
        '<div class="svc-meta-item"><label>浏览量</label><input disabled value="' + escapeHtml(meta.views) + '"></div>' +
        '<div class="svc-meta-item"><label>推送量</label><input disabled value="' + escapeHtml(meta.pushes) + '"></div>' +
        '<div class="svc-meta-item"><label>调用量</label><input disabled value="' + escapeHtml(meta.calls) + '"></div>' +
        '<div class="svc-meta-item"><label>管理单位</label><input data-reg-meta="managementUnit" value="' + escapeHtml(meta.managementUnit) + '"></div>' +
        '<div class="svc-meta-item"><label>数据来源</label><input disabled value="接口注册"></div>' +
        '<div class="svc-meta-item"><label>联系电话</label><input data-reg-meta="phone" value="' + escapeHtml(meta.phone) + '"></div>' +
        '<div class="svc-meta-item"><label>更新频率</label><select data-reg-meta="frequency"><option>实时</option><option>每日</option><option>每周</option><option>每月</option><option>不定期</option></select></div>' +
        '<div class="svc-meta-item"><label>申请量</label><input disabled value="' + escapeHtml(meta.applications) + '"></div>' +
      '</div>';
  }

  function classificationPickerHtml(value) {
    var nodes = ['公共目录'].concat(catalogNodes.map(function (node) { return '我的目录/' + node.name; }));
    return '' +
      '<div class="svc-reg-class-picker" data-reg-class-picker>' +
        '<input readonly data-reg-meta="category" value="' + escapeHtml(value) + '" placeholder="请选择数据分类"><i class="bi bi-chevron-down"></i>' +
        '<div class="svc-reg-class-popup" hidden>' +
          '<div class="svc-catalog-search"><i class="bi bi-search"></i><input data-reg-class-search placeholder="搜索目录名称"></div>' +
          '<div data-reg-class-list>' + nodes.map(function (node) { return '<button type="button" data-reg-class-option="' + escapeHtml(node) + '"><i class="bi bi-folder2"></i><span>' + escapeHtml(node) + '</span></button>'; }).join('') + '</div>' +
          '<div class="svc-tree-empty" data-reg-class-empty hidden>未找到匹配目录</div>' +
        '</div>' +
      '</div>';
  }

  function responseSectionHtml() {
    var response = editorState.responseReady ? '{\n  "code": 200,\n  "msg": "success",\n  "data": {\n    "total": 1,\n    "records": [{ "id": "CUST-10028", "status": "有效" }]\n  }\n}' : '';
    return '' +
      '<button class="btn btn-outline svc-reg-test-btn" type="button" data-reg-editor-test><i class="bi bi-link-45deg"></i> 接口测试</button>' +
      '<h3 class="svc-section-title">返回数据示例</h3>' + codeEditorHtml(response, 'data-reg-response-editor') +
      '<h3 class="svc-section-title">返回数据</h3>' +
      '<table class="svc-return-table"><thead><tr><th>参数名</th><th>数据类型</th><th>描述</th></tr></thead><tbody>' +
        (editorState.responseReady ? '<tr><td>msg</td><td>string</td><td>返回描述</td></tr><tr><td>code</td><td>number</td><td>返回码</td></tr><tr><td>data</td><td>object</td><td>业务数据</td></tr>' : '<tr><td colspan="3"><div class="svc-empty-state"><i class="bi bi-inbox"></i><span>暂无数据</span></div></td></tr>') +
      '</tbody></table>' +
      '<div class="svc-reg-result-head"><h3 class="svc-section-title">结果代码</h3><button class="svc-add-param" type="button" data-reg-add-result><i class="bi bi-plus-circle"></i> 新增参数</button></div>' +
      '<div class="svc-form-item svc-reg-result-key"><label>结果码字段</label><select><option>请选择</option><option' + (editorState.responseReady ? ' selected' : '') + '>code</option><option>msg</option></select></div>' +
      '<table class="svc-return-table"><thead><tr><th>结果码</th><th>成功码</th><th>说明</th><th>操作</th></tr></thead><tbody><tr><td colspan="4"><div class="svc-empty-state"><i class="bi bi-inbox"></i><span>暂无数据</span></div></td></tr></tbody></table>';
  }

  function renderEditorPage(row, isNew) {
    editorState = makeEditorState(row, isNew);
    pageEl.innerHTML = '' +
      '<div class="svc-editor-page svc-reg-editor">' +
        '<div class="svc-editor-header">' +
          '<div class="svc-editor-tabs"><button class="active" data-reg-editor-tab="register">接口注册</button><button data-reg-editor-tab="meta">元数据信息</button></div>' +
          '<div class="svc-editor-head-actions"><button class="btn btn-outline" data-reg-editor-action="cancel"><i class="bi bi-x-circle"></i> 取 消</button>' +
            (!isNew ? '<button class="btn btn-outline" data-reg-editor-action="save-as"><i class="bi bi-files"></i> 另存为</button>' : '') +
            '<button class="btn btn-primary" data-reg-editor-action="save"><i class="bi bi-check2-circle"></i> 保 存</button></div>' +
        '</div>' +
        '<div class="svc-editor-scroll">' +
          '<section class="svc-editor-tab-panel active" data-reg-editor-panel="register">' +
            '<div class="svc-dev-form svc-reg-form">' +
              '<div class="svc-form-item"><label>接口方式</label><select disabled><option>REST</option></select></div>' +
              '<div class="svc-form-item"><label>请求方式</label><select data-reg-field="method"><option' + (editorState.method === 'GET' ? ' selected' : '') + '>GET</option><option' + (editorState.method === 'POST' ? ' selected' : '') + '>POST</option></select></div>' +
              '<div class="svc-form-item"><label>数据格式</label><select disabled><option>JSON</option></select></div>' +
              '<div class="svc-form-item wide"><label><em>*</em> 原始URL</label><input data-reg-field="originalUrl" value="' + escapeHtml(editorState.originalUrl) + '" placeholder="请输入原始接口地址"></div>' +
              '<div class="svc-form-item"><label>接口缓存</label><select data-reg-field="cache"><option>否</option><option>是</option></select></div>' +
              '<div class="svc-form-item wide"><label><em>*</em> 注册后URL</label><div class="svc-url-input"><span>https://api.example.local/share/{接口标识}</span><input data-reg-field="endpoint" value="' + escapeHtml(editorState.endpoint) + '"></div></div>' +
              '<div class="svc-form-item"><label></label><span></span></div>' +
              '<div class="svc-form-item"><label>代理服务</label><select data-reg-field="proxy"><option value="">请选择</option><option>统一接口代理</option><option>内网数据代理</option><option>政务外网代理</option></select></div>' +
            '</div>' +
            '<div class="svc-reg-param-area" data-reg-param-area></div>' +
            '<div data-reg-response-section>' + responseSectionHtml() + '</div>' +
          '</section>' +
          '<section class="svc-editor-tab-panel" data-reg-editor-panel="meta">' + metadataHtml() + '</section>' +
        '</div>' +
      '</div>';
    bindEditorEvents();
    renderParamArea();
    bindCodeEditors(pageEl);
  }

  function syncEditorValues() {
    pageEl.querySelectorAll('[data-reg-field]').forEach(function (field) { editorState[field.dataset.regField] = field.value; });
    pageEl.querySelectorAll('[data-reg-meta]').forEach(function (field) { editorState.meta[field.dataset.regMeta] = field.value; });
    var body = pageEl.querySelector('[data-reg-body-editor] .svc-reg-code-content');
    if (body) editorState.bodyText = body.textContent;
  }

  function saveEditor(asCopy) {
    syncEditorValues();
    if (!editorState.originalUrl.trim() || !editorState.endpoint.trim()) { showToast('请完善原始URL和注册后URL', 'warning'); return; }
    if (!editorState.meta.name.trim()) {
      switchEditorTab('meta');
      showToast('请填写数据名称', 'warning');
      return;
    }
    var target = !asCopy && !editorState.isNew ? findRow(editorState.rowId) : null;
    if (!target) {
      target = { id: 'reg-' + Date.now(), code: nextCode(), publishStatus: '编制', auditStatus: '', type: '注册接口' };
      apiRows.unshift(target);
    }
    target.name = editorState.meta.name;
    target.enName = editorState.meta.enName || editorState.endpoint.replace(/^\//, '').replace(/[^a-zA-Z0-9]+/g, '_');
    target.category = editorState.meta.category || '公共目录';
    target.version = asCopy ? 'V' + (Number(String(editorState.meta.version).replace(/\D/g, '')) + 1 || 1) : editorState.meta.version;
    target.updateTime = '2026-09-21 11:30:00';
    target.desc = editorState.meta.summary;
    target.method = editorState.method;
    target.originalUrl = editorState.originalUrl;
    target.endpoint = editorState.endpoint;
    target.dataDomain = editorState.meta.dataDomain;
    target.summary = editorState.meta.summary;
    target.managementUnit = editorState.meta.managementUnit;
    target.phone = editorState.meta.phone;
    target.frequency = editorState.meta.frequency;
    renderListPage();
    showToast(asCopy ? '接口已另存为新版本' : '接口注册信息已保存', 'success');
  }

  function switchEditorTab(key) {
    editorState.activeTab = key;
    pageEl.querySelectorAll('[data-reg-editor-tab]').forEach(function (button) { button.classList.toggle('active', button.dataset.regEditorTab === key); });
    pageEl.querySelectorAll('[data-reg-editor-panel]').forEach(function (panel) { panel.classList.toggle('active', panel.dataset.regEditorPanel === key); });
  }

  function bindEditorEvents() {
    pageEl.querySelectorAll('[data-reg-editor-tab]').forEach(function (button) { button.addEventListener('click', function () { syncEditorValues(); switchEditorTab(button.dataset.regEditorTab); }); });
    pageEl.querySelector('[data-reg-editor-action="cancel"]').addEventListener('click', renderListPage);
    pageEl.querySelector('[data-reg-editor-action="save"]').addEventListener('click', function () { saveEditor(false); });
    var saveAs = pageEl.querySelector('[data-reg-editor-action="save-as"]');
    if (saveAs) saveAs.addEventListener('click', function () { saveEditor(true); });
    pageEl.querySelector('[data-reg-field="method"]').addEventListener('change', function (event) { editorState.method = event.target.value; editorState.activeParam = editorState.method === 'POST' ? 'body' : 'header'; renderParamArea(); });
    pageEl.querySelectorAll('[data-reg-meta="dataDomain"], [data-reg-meta="frequency"]').forEach(function (select) { select.value = editorState.meta[select.dataset.regMeta]; });

    var picker = pageEl.querySelector('[data-reg-class-picker]');
    var popup = picker.querySelector('.svc-reg-class-popup');
    picker.querySelector(':scope > input').addEventListener('click', function () { popup.hidden = !popup.hidden; });
    picker.querySelectorAll('[data-reg-class-option]').forEach(function (option) {
      option.addEventListener('click', function () { picker.querySelector(':scope > input').value = option.dataset.regClassOption; editorState.meta.category = option.dataset.regClassOption; popup.hidden = true; });
    });
    picker.querySelector('[data-reg-class-search]').addEventListener('input', function (event) {
      var keyword = event.target.value.trim().toLowerCase();
      var visible = 0;
      picker.querySelectorAll('[data-reg-class-option]').forEach(function (option) { var matched = !keyword || option.textContent.toLowerCase().indexOf(keyword) > -1; option.hidden = !matched; if (matched) visible += 1; });
      picker.querySelector('[data-reg-class-empty]').hidden = visible > 0;
    });

    pageEl.addEventListener('click', function closePicker(event) { if (picker && !picker.contains(event.target)) popup.hidden = true; }, { once: false });
    bindResponseEvents();
  }

  function bindResponseEvents() {
    var testButton = pageEl.querySelector('[data-reg-editor-test]');
    if (testButton) testButton.addEventListener('click', function () {
      editorState.responseReady = true;
      var section = pageEl.querySelector('[data-reg-response-section]');
      section.innerHTML = responseSectionHtml();
      bindResponseEvents();
      bindCodeEditors(section);
      showToast('接口测试成功，已解析返回数据', 'success');
    });
    var addResult = pageEl.querySelector('[data-reg-add-result]');
    if (addResult) addResult.addEventListener('click', function () { showToast('已新增一行结果代码配置', 'success'); });
  }

  function bindCodeEditors(scope) {
    (scope || pageEl).querySelectorAll('.svc-reg-codebox').forEach(function (editor) {
      if (editor.dataset.regBound === 'true') return;
      editor.dataset.regBound = 'true';
      var content = editor.querySelector('.svc-reg-code-content');
      editor.querySelector('[data-reg-code-theme]').addEventListener('change', function (event) { editor.classList.toggle('theme-light', event.target.value === 'light'); });
      editor.querySelector('[data-reg-code-size]').addEventListener('change', function (event) { content.style.fontSize = event.target.value; });
      editor.querySelectorAll('[data-reg-code-action]').forEach(function (button) {
        button.addEventListener('click', function () {
          var action = button.dataset.regCodeAction;
          if (action === 'format') {
            try { content.textContent = JSON.stringify(JSON.parse(content.textContent || '{}'), null, 2); showToast('格式化完成', 'success'); } catch (error) { showToast('当前内容无法格式化', 'warning'); }
          } else if (action === 'copy') {
            if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(content.textContent || '');
            showToast('代码已复制', 'success');
          } else if (action === 'search') editor.querySelector('.svc-reg-code-search').hidden = false;
          else if (action === 'close-search') editor.querySelector('.svc-reg-code-search').hidden = true;
          else if (action === 'fullscreen') editor.classList.toggle('is-fullscreen');
        });
      });
    });
  }

  function renderTestPage(row) {
    var requestCode = row.method === 'POST' ? '{\n  "pageIndex": 1,\n  "pageSize": 20,\n  "keyword": ""\n}' : '{\n  "customerCode": "CUST-10028"\n}';
    pageEl.innerHTML = catalogHtml() +
      '<section class="svc-list-panel svc-reg-test-page">' +
        '<div class="svc-reg-test-header"><h3><i class="bi bi-paperclip"></i> 接口测试</h3><button class="btn btn-outline" data-reg-test-back><i class="bi bi-arrow-left"></i> 返回</button></div>' +
        '<div class="svc-reg-test-scroll">' +
          '<div class="svc-reg-test-summary"><div><span>数据名称：</span><strong>' + escapeHtml(row.name) + '</strong></div><div><span>传输协议：</span><strong>HTTP</strong></div><div><span>请求方式：</span><strong>' + escapeHtml(row.method) + '</strong></div><div><span>数据格式：</span><strong>JSON</strong></div><div><span>接口类型：</span><strong>REST</strong></div><div><span>接口地址：</span><strong>' + escapeHtml(row.endpoint) + '</strong></div></div>' +
          '<h3 class="svc-section-title">请求参数</h3>' +
          '<div class="svc-param-tabs"><button class="active">' + (row.method === 'POST' ? 'Body参数' : 'Path参数') + '</button></div>' +
          '<div class="svc-reg-body-grid"><div>' + codeEditorHtml(requestCode, 'data-reg-test-request') + '<button class="btn btn-warning svc-reg-parse" type="button"><i class="bi bi-braces"></i> 参数解析</button></div>' +
            '<div class="svc-reg-body-table"><table class="svc-param-table"><thead><tr><th>参数名</th><th>必填</th><th>数据类型</th><th>参数值</th><th>参数说明</th><th></th></tr></thead><tbody>' +
              paramRowsHtml(row.method === 'POST' ? [{ name: 'pageIndex', required: '否', type: 'number', value: '1', desc: '页码' }, { name: 'pageSize', required: '否', type: 'number', value: '20', desc: '每页条数' }, { name: 'keyword', required: '否', type: 'string', value: '', desc: '查询关键字' }] : [{ name: 'customerCode', required: '是', type: 'string', value: 'CUST-10028', desc: '客户编码' }], false) +
            '</tbody></table></div></div>' +
          '<button class="btn btn-primary svc-reg-send" type="button" data-reg-send-request><i class="bi bi-send"></i> 发送请求</button>' +
          '<h3 class="svc-section-title">返回数据</h3><div data-reg-test-response>' + codeEditorHtml('', 'data-reg-test-result') + '</div>' +
        '</div>' +
      '</section>';
    bindCatalogEvents();
    bindCodeEditors(pageEl);
    pageEl.querySelector('[data-reg-test-back]').addEventListener('click', renderListPage);
    pageEl.querySelector('[data-reg-send-request]').addEventListener('click', function () {
      var response = '{\n  "code": 200,\n  "msg": "success",\n  "data": {\n    "requestId": "REQ-20260921-103726",\n    "records": [{ "name": "' + escapeHtml(row.name) + '", "status": "有效" }]\n  }\n}';
      pageEl.querySelector('[data-reg-test-result] .svc-reg-code-content').textContent = response;
      showToast('请求发送成功', 'success');
    });
  }

  return {
    html: '<div class="page-service-api-dev page-service-api-reg"></div>',
    init: function () {
      pageEl = document.querySelector('.page-service-api-reg');
      if (!pageEl) return;
      selectedCatalog = '公共目录';
      renderListPage();
    }
  };
})();
