/**
 * 数据中台 V4.0 - 数据服务 · API编排
 * 参考数据服务列表结构，并复用数据开发画布的缩放、平移、多选和右键交互。
 */
window.DP = window.DP || {};
DP.pages = DP.pages || {};

DP.pages.serviceApiArrange = (function () {
  var pageEl;
  var selectedCatalog = '公共目录';
  var editorState = null;
  var nodeSequence = 20;

  var rows = [
    {
      code: '20260921093612001',
      name: '区域运力指标编排',
      enName: 'region_capacity_index',
      category: '公共目录,我的目录/物流数据',
      type: 'API编排',
      version: 'V2',
      publishStatus: '开发',
      auditStatus: '',
      updateTime: '2026-09-21 09:36:12',
      desc: '聚合区域车辆、承运商与订单履约指标'
    },
    {
      code: '20260918081445008',
      name: '工单处置状态编排',
      enName: 'workorder_status_flow',
      category: '公共目录,我的目录/工单数据',
      type: 'API编排',
      version: 'V1',
      publishStatus: '已上架',
      auditStatus: '上架通过',
      updateTime: '2026-09-20 17:42:08',
      desc: '查询工单状态并按处置结果分流'
    }
  ];

  var apiOptions = [
    { name: '区域订单汇总接口', version: 'V2', mode: '开发接口', protocol: 'HTTP', format: 'JSON', method: 'POST', url: '/api/v2/order/region-summary', desc: '按区域汇总订单数量与履约金额' },
    { name: '承运商服务状态接口', version: 'V1', mode: '注册接口', protocol: 'HTTP', format: 'JSON', method: 'GET', url: '/api/v1/carrier/service-status', desc: '查询承运商当前服务状态' },
    { name: '区域运力库存接口', version: 'V3', mode: '开发接口', protocol: 'HTTP', format: 'JSON', method: 'POST', url: '/api/v3/capacity/region-stock', desc: '查询区域可调度车辆与司机数量' },
    { name: '工单详情查询接口', version: 'V2', mode: '开发接口', protocol: 'HTTP', format: 'JSON', method: 'GET', url: '/api/v2/workorder/detail', desc: '查询指定工单基础信息与处置状态' },
    { name: '工单轨迹查询接口', version: 'V1', mode: '注册接口', protocol: 'HTTP', format: 'JSON', method: 'GET', url: '/api/v1/workorder/timeline', desc: '查询工单全流程处理轨迹' },
    { name: '设备在线状态接口', version: 'V1', mode: '开发接口', protocol: 'HTTP', format: 'JSON', method: 'GET', url: '/api/v1/device/online-status', desc: '查询设备实时在线状态' },
    { name: '车辆定位查询接口', version: 'V2', mode: '注册接口', protocol: 'HTTPS', format: 'JSON', method: 'POST', url: '/api/v2/vehicle/location', desc: '查询车辆最新定位信息' },
    { name: '仓库库存查询接口', version: 'V2', mode: '开发接口', protocol: 'HTTP', format: 'JSON', method: 'POST', url: '/api/v2/warehouse/stock', desc: '查询仓库商品可用库存' },
    { name: '配送时效统计接口', version: 'V1', mode: '开发接口', protocol: 'HTTP', format: 'JSON', method: 'GET', url: '/api/v1/delivery/timeliness', desc: '统计配送准时率与平均时长' },
    { name: '客户地址校验接口', version: 'V1', mode: '注册接口', protocol: 'HTTPS', format: 'JSON', method: 'POST', url: '/api/v1/customer/address-check', desc: '校验客户地址完整性与行政区划' },
    { name: '网点信息查询接口', version: 'V1', mode: '开发接口', protocol: 'HTTP', format: 'JSON', method: 'GET', url: '/api/v1/site/info', desc: '查询物流网点基础信息' },
    { name: '异常订单查询接口', version: 'V2', mode: '开发接口', protocol: 'HTTP', format: 'JSON', method: 'POST', url: '/api/v2/order/exception-list', desc: '查询指定范围内的异常订单' }
  ];

  function esc(text) {
    return String(text == null ? '' : text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function statusClass(status) {
    if (status === '已上架' || status === '上架通过') return 'success';
    if (status === '开发') return 'processing';
    if (status === '待上架' || status === '上架待审核') return 'warning';
    if (status === '上架驳回') return 'danger';
    return 'default';
  }

  function statusHtml(text) {
    if (!text) return '<span class="svc-empty">--</span>';
    return '<span class="svc-status ' + statusClass(text) + '">' + esc(text) + '</span>';
  }

  function toast(message, type) {
    var old = pageEl.querySelector('.svc-toast');
    if (old) old.remove();
    var item = document.createElement('div');
    item.className = 'svc-toast ' + (type || 'info');
    item.innerHTML = '<i class="bi bi-info-circle"></i><span>' + esc(message) + '</span>';
    pageEl.appendChild(item);
    window.setTimeout(function () { if (item.parentNode) item.remove(); }, 1800);
  }

  function filteredRows() {
    var publish = pageEl.querySelector('[data-soa-filter="publish"]').value;
    var audit = pageEl.querySelector('[data-soa-filter="audit"]').value;
    var keyword = pageEl.querySelector('[data-soa-filter="keyword"]').value.trim().toLowerCase();
    return rows.filter(function (row) {
      if (publish && row.publishStatus !== publish) return false;
      if (audit && row.auditStatus !== audit) return false;
      if (selectedCatalog !== '公共目录' && row.category.indexOf(selectedCatalog) < 0) return false;
      if (keyword && [row.code, row.name, row.enName].join(' ').toLowerCase().indexOf(keyword) < 0) return false;
      return true;
    });
  }

  function rowHtml(row, index) {
    var secondary = row.publishStatus === '开发'
      ? '<button class="svc-row-action danger" type="button" data-soa-row-action="delete" data-index="' + index + '"><i class="bi bi-trash3"></i><span>删除</span></button>'
      : '<button class="svc-row-action" type="button" data-soa-row-action="test" data-index="' + index + '"><i class="bi bi-link-45deg"></i><span>接口测试</span></button>';
    return '<tr>' +
      '<td class="svc-check-col"><input class="soa-row-check" type="checkbox"></td>' +
      '<td class="svc-code-col">' + esc(row.code) + '</td>' +
      '<td class="svc-name-col" title="' + esc(row.name) + '">' + esc(row.name) + '</td>' +
      '<td class="svc-en-col" title="' + esc(row.enName) + '">' + esc(row.enName) + '</td>' +
      '<td class="svc-category-col" title="' + esc(row.category) + '">' + esc(row.category) + '</td>' +
      '<td>' + esc(row.type) + '</td>' +
      '<td>' + esc(row.version) + '</td>' +
      '<td>' + statusHtml(row.publishStatus) + '</td>' +
      '<td>' + statusHtml(row.auditStatus) + '</td>' +
      '<td>' + esc(row.updateTime) + '</td>' +
      '<td class="svc-desc-col" title="' + esc(row.desc) + '">' + esc(row.desc) + '</td>' +
      '<td class="svc-action-col"><button class="svc-row-action" type="button" data-soa-row-action="edit" data-index="' + index + '"><i class="bi bi-pencil-square"></i><span>修改</span></button>' + secondary + '</td>' +
    '</tr>';
  }

  function renderTable() {
    var list = filteredRows();
    var body = pageEl.querySelector('[data-soa-table-body]');
    if (!body) return;
    body.innerHTML = list.length ? list.map(rowHtml).join('') : '<tr><td colspan="12" class="svc-empty-row">暂无匹配的API编排记录</td></tr>';
    pageEl.querySelector('[data-soa-total]').textContent = '共 ' + list.length + ' 条';
    pageEl.querySelector('[data-soa-check-all]').checked = false;
  }

  function selectedCount() {
    return pageEl.querySelectorAll('.soa-row-check:checked').length;
  }

  function catalogHtml() {
    return '<aside class="svc-catalog-panel">' +
      '<div class="svc-catalog-title"><i class="bi bi-list"></i><span>数据目录</span></div>' +
      '<div class="svc-catalog-search"><i class="bi bi-search"></i><input data-soa-catalog-search placeholder="请输入"></div>' +
      '<div class="svc-tree-list" data-soa-catalog-tree>' +
        '<div class="svc-tree-row active" data-catalog="公共目录"><i class="bi bi-folder-fill"></i><span>公共目录</span></div>' +
        '<div class="svc-tree-row has-children open" data-catalog="我的目录"><i class="bi bi-chevron-right svc-tree-arrow"></i><i class="bi bi-folder-fill"></i><span>我的目录 (3)</span></div>' +
        '<div class="svc-tree-children">' +
          '<div class="svc-tree-row child" data-catalog="物流数据"><i class="bi bi-folder2"></i><span>物流数据</span></div>' +
          '<div class="svc-tree-row child" data-catalog="中电数据"><i class="bi bi-folder2"></i><span>中电数据</span></div>' +
          '<div class="svc-tree-row child" data-catalog="工单数据"><i class="bi bi-folder2"></i><span>工单数据</span></div>' +
        '</div>' +
      '</div>' +
    '</aside>';
  }

  function listHtml() {
    return catalogHtml() + '<section class="svc-list-panel">' +
      '<div class="svc-toolbar">' +
        '<div class="svc-toolbar-left">' +
          '<button class="btn btn-text svc-top-action" type="button" data-soa-action="add"><i class="bi bi-plus-circle"></i> 新增</button>' +
          '<button class="btn btn-text svc-top-action" type="button" data-soa-action="deploy"><i class="bi bi-send"></i> 部署测试</button>' +
          '<button class="btn btn-text svc-top-action" type="button" data-soa-action="undeploy"><i class="bi bi-x-square"></i> 取消部署</button>' +
        '</div>' +
        '<div class="svc-filter-bar">' +
          '<label>发布状态</label><select class="svc-select" data-soa-filter="publish"><option value="">请选择</option><option>编制</option><option>开发</option><option>待上架</option><option>已上架</option></select>' +
          '<label>审核状态</label><select class="svc-select" data-soa-filter="audit"><option value="">请选择</option><option>上架待审核</option><option>上架通过</option><option>上架驳回</option></select>' +
          '<input class="svc-keyword" data-soa-filter="keyword" placeholder="数据编码/数据名称/英文名称">' +
          '<button class="btn btn-primary svc-query" type="button" data-soa-action="search"><i class="bi bi-search"></i> 查询</button>' +
        '</div>' +
      '</div>' +
      '<div class="svc-table-tools">' +
        '<label class="svc-switch"><input type="checkbox" data-soa-compact><span class="svc-switch-track"></span><em class="svc-switch-text">关</em></label>' +
        '<span class="svc-tool-sep"></span>' +
        '<button class="svc-tool-btn" type="button" title="刷新" data-soa-tool="刷新"><i class="bi bi-arrow-clockwise"></i></button>' +
        '<button class="svc-tool-btn" type="button" title="行高" data-soa-tool="行高"><i class="bi bi-arrows-expand"></i></button>' +
        '<button class="svc-tool-btn" type="button" title="列设置" data-soa-tool="列设置"><i class="bi bi-gear"></i></button>' +
        '<button class="svc-tool-btn" type="button" title="全屏" data-soa-tool="全屏"><i class="bi bi-arrows-fullscreen"></i></button>' +
      '</div>' +
      '<div class="svc-table-wrap"><table class="ds-table svc-api-table"><thead><tr>' +
        '<th class="svc-check-col"><input type="checkbox" data-soa-check-all></th>' +
        '<th class="svc-code-col">数据编码 <i class="bi bi-caret-up-fill sort-icon"></i><i class="bi bi-caret-down-fill sort-icon"></i></th>' +
        '<th class="svc-name-col">数据名称 <i class="bi bi-caret-up-fill sort-icon"></i><i class="bi bi-caret-down-fill sort-icon"></i></th>' +
        '<th class="svc-en-col">英文名称 <i class="bi bi-caret-up-fill sort-icon"></i><i class="bi bi-caret-down-fill sort-icon"></i></th>' +
        '<th class="svc-category-col">分类</th><th>接口类型</th><th>版本</th><th>发布状态</th><th>审核状态</th><th>更新时间</th><th class="svc-desc-col">描述</th><th class="svc-action-col">操作</th>' +
      '</tr></thead><tbody data-soa-table-body></tbody></table></div>' +
      '<div class="svc-pagination"><span data-soa-total>共 0 条</span><div class="svc-page-controls"><button class="svc-page-btn disabled" type="button"><i class="bi bi-chevron-left"></i></button><button class="svc-page-num active" type="button">1</button><button class="svc-page-btn disabled" type="button"><i class="bi bi-chevron-right"></i></button><select class="svc-page-size"><option>10 条/页</option><option>20 条/页</option><option>50 条/页</option></select></div></div>' +
    '</section>';
  }

  function renderList() {
    editorState = null;
    pageEl.innerHTML = listHtml();
    bindListEvents();
    renderTable();
  }

  function testCodeEditorHtml() {
    return '<div class="soa-test-code"><div class="soa-test-code-toolbar"><select aria-label="主题" data-soa-test-code-theme><option value="dark">暗色 - One Dark</option><option value="light">亮色</option></select><select aria-label="字体大小" data-soa-test-code-size><option value="14">14px</option><option value="16">16px</option></select><button type="button" data-soa-test-code-action="format"><i class="bi bi-sliders"></i><span>格式化</span></button><button type="button" data-soa-test-code-action="copy"><i class="bi bi-copy"></i><span>复制</span></button><button type="button" data-soa-test-code-action="search"><i class="bi bi-search"></i><span>搜索</span></button><button type="button" data-soa-test-code-action="fullscreen"><i class="bi bi-arrows-fullscreen"></i><span>全屏</span></button></div><div class="soa-test-code-search" hidden><i class="bi bi-search"></i><input type="text" placeholder="搜索返回内容" data-soa-test-code-keyword><button type="button" aria-label="关闭搜索" data-soa-test-code-action="close-search"><i class="bi bi-x-lg"></i></button></div><div class="soa-test-code-main"><div class="soa-test-code-lines" data-soa-test-lines>1</div><pre data-soa-test-result></pre></div></div>';
  }

  function updateTestCode(response) {
    var result = pageEl.querySelector('[data-soa-test-result]');
    var gutter = pageEl.querySelector('[data-soa-test-lines]');
    if (!result || !gutter) return;
    result.textContent = response;
    gutter.innerHTML = response ? response.split('\n').map(function (_, index) { return index + 1; }).join('<br>') : '1';
  }

  function renderTestPage(row) {
    pageEl.innerHTML = catalogHtml() +
      '<section class="svc-list-panel svc-reg-test-page soa-api-test-page">' +
        '<div class="svc-reg-test-header"><h3><i class="bi bi-paperclip"></i> 接口测试</h3><button class="btn btn-outline" type="button" data-soa-test-back><i class="bi bi-arrow-left"></i> 返回</button></div>' +
        '<div class="svc-reg-test-scroll">' +
          '<div class="svc-reg-test-summary"><div><span>数据名称：</span><strong>' + esc(row.name) + '</strong></div><div><span>传输协议：</span><strong>HTTP</strong></div><div><span>请求方式：</span><strong>POST</strong></div><div><span>数据格式：</span><strong>JSON</strong></div><div><span>接口类型：</span><strong>REST</strong></div><div><span>接口地址：</span><strong>/575/' + esc(row.enName) + '</strong></div></div>' +
          '<div class="soa-test-flow"><div class="soa-canvas" data-soa-canvas aria-label="API 编排流程预览"><div class="soa-world" data-soa-world></div></div></div>' +
          '<h3 class="svc-section-title">请求参数</h3>' +
          '<div class="soa-test-send-row"><button class="btn btn-primary soa-test-send" type="button" data-soa-test-send><i class="bi bi-send"></i> 发送请求</button><span class="soa-test-success" data-soa-test-success hidden><i class="bi bi-check-circle-fill"></i> 成功</span></div>' +
          '<h3 class="svc-section-title">返回数据</h3>' + testCodeEditorHtml() +
        '</div>' +
      '</section>';
    editorState = {
      row: row,
      isNew: false,
      nodes: initialNodes(row, false),
      edges: initialEdges(false),
      selected: [],
      scale: 1,
      panX: 12,
      panY: 28,
      worldWidth: 1500,
      worldHeight: 760,
      activeNodeId: null,
      dragType: '',
      readOnly: true,
      testActiveNodeIds: [],
      testActiveEdgeKeys: []
    };
    renderCanvas();
    autoLayoutCanvas();
    renderCanvas();
    fitCanvas();
    bindCatalogEvents();
    pageEl.querySelector('[data-soa-test-back]').addEventListener('click', renderList);
    pageEl.querySelector('[data-soa-test-send]').addEventListener('click', function () {
      editorState.testActiveNodeIds = ['main', 'api-1', 'decision-1', 'api-3'];
      editorState.testActiveEdgeKeys = ['main>api-1', 'api-1>decision-1', 'decision-1>api-3'];
      renderCanvas();
      pageEl.querySelector('[data-soa-test-success]').hidden = false;
      updateTestCode('{\n  "code": 200,\n  "msg": "success",\n  "data": {\n    "requestId": "REQ-20260921-112408",\n    "availableVehicle": 18,\n    "fulfillmentRate": 0.910\n  }\n}');
      toast('请求发送成功', 'success');
    });
    var testEditor = pageEl.querySelector('.soa-test-code');
    testEditor.querySelector('[data-soa-test-code-theme]').addEventListener('change', function (event) {
      testEditor.classList.toggle('theme-light', event.target.value === 'light');
    });
    testEditor.querySelector('[data-soa-test-code-size]').addEventListener('change', function (event) {
      testEditor.querySelector('[data-soa-test-result]').style.fontSize = event.target.value + 'px';
    });
    pageEl.querySelectorAll('[data-soa-test-code-action]').forEach(function (button) {
      button.addEventListener('click', function () {
        var action = button.dataset.soaTestCodeAction;
        var result = testEditor.querySelector('[data-soa-test-result]');
        if (action === 'format') {
          try {
            updateTestCode(JSON.stringify(JSON.parse(result.textContent || '{}'), null, 2));
            toast('格式化完成', 'success');
          } catch (error) {
            toast('当前内容无法格式化', 'warning');
          }
        } else if (action === 'copy') {
          if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(result.textContent || '');
          toast('返回数据已复制', 'success');
        } else if (action === 'search') {
          testEditor.querySelector('.soa-test-code-search').hidden = false;
          testEditor.querySelector('[data-soa-test-code-keyword]').focus();
        } else if (action === 'close-search') {
          testEditor.querySelector('.soa-test-code-search').hidden = true;
        } else if (action === 'fullscreen') {
          testEditor.classList.toggle('is-fullscreen');
        }
      });
    });
    testEditor.querySelector('[data-soa-test-code-keyword]').addEventListener('keydown', function (event) {
      if (event.key !== 'Enter') return;
      var keyword = event.target.value.trim();
      var count = keyword ? testEditor.querySelector('[data-soa-test-result]').textContent.split(keyword).length - 1 : 0;
      toast(keyword ? '找到 ' + count + ' 处匹配内容' : '请输入搜索内容', keyword && count ? 'success' : 'info');
    });
  }

  function initialNodes(row, isNew) {
    if (isNew) {
      return [
        { id: 'main', type: 'main', label: '主服务接口', x: 90, y: 250, api: null }
      ];
    }
    if (row && row.enName === 'workorder_status_flow') {
      return [
        { id: 'main', type: 'main', label: '主服务接口', x: 80, y: 248 },
        { id: 'api-1', type: 'api', label: '工单详情查询接口', x: 330, y: 250, api: apiOptions[3] },
        { id: 'decision-1', type: 'decision', label: '状态判断', x: 625, y: 238, expression: "status == 'closed'" },
        { id: 'api-2', type: 'api', label: '工单轨迹查询接口', x: 900, y: 160, api: apiOptions[4] },
        { id: 'api-3', type: 'api', label: '异常订单查询接口', x: 900, y: 350, api: apiOptions[11] }
      ];
    }
    return [
      { id: 'main', type: 'main', label: '主服务接口', x: 80, y: 248 },
      { id: 'api-1', type: 'api', label: '区域订单汇总接口', x: 330, y: 250, api: apiOptions[0] },
      { id: 'decision-1', type: 'decision', label: '运力阈值判断', x: 625, y: 238, expression: 'availableVehicle > 30 && fulfillmentRate >= 0.95' },
      { id: 'api-2', type: 'api', label: '区域运力库存接口', x: 900, y: 160, api: apiOptions[2] },
      { id: 'api-3', type: 'api', label: '承运商服务状态接口', x: 900, y: 350, api: apiOptions[1] }
    ];
  }

  function initialEdges(isNew) {
    if (isNew) return [];
    return [
      { from: 'main', to: 'api-1' },
      { from: 'api-1', to: 'decision-1' },
      { from: 'decision-1', to: 'api-2', label: '满足条件', expression: 'code == 0' },
      { from: 'decision-1', to: 'api-3', label: '不满足条件', expression: 'code != 0' }
    ];
  }

  function metadataHtml(row, isNew) {
    row = row || {};
    var code = isNew ? '' : row.code;
    var name = isNew ? '' : row.name;
    var enName = isNew ? '' : row.enName;
    var desc = isNew ? '' : row.desc;
    var category = isNew ? '' : (row.category.indexOf('物流数据') > -1 ? '我的目录 / 物流数据' : '我的目录 / 工单数据');
    return '<div class="soa-meta-form">' +
      '<div class="soa-meta-item"><label>数据编码</label><input value="' + esc(code) + '" placeholder="保存后自动生成" disabled></div>' +
      '<div class="soa-meta-item"><label><em>*</em> 数据名称</label><input data-soa-meta="name" value="' + esc(name) + '" placeholder="请输入数据名称"></div>' +
      '<div class="soa-meta-item"><label>英文名称</label><input data-soa-meta="enName" value="' + esc(enName) + '" placeholder="请输入英文名称"></div>' +
      '<div class="soa-meta-item wide"><label>数据摘要</label><textarea data-soa-meta="desc" placeholder="请输入数据摘要">' + esc(desc) + '</textarea></div>' +
      '<div class="soa-meta-item"><label>版本</label><input value="' + esc(isNew ? 'V1' : row.version) + '" disabled></div>' +
      '<div class="soa-meta-item"><label><em>*</em> 数据分类</label>' + categoryPickerHtml(category) + '</div>' +
      '<div class="soa-meta-item"><label><em>*</em> 数据领域</label><select data-soa-meta="domain"><option value="">请选择</option><option selected>物流运输</option><option>工单服务</option><option>设备管理</option><option>公共管理</option></select></div>' +
      '<div class="soa-meta-item"><label>上架时间</label><input value="' + (isNew ? '' : '2026-09-20 17:42:08') + '" disabled></div>' +
      '<div class="soa-meta-item"><label>更新时间</label><input value="' + (isNew ? '' : row.updateTime) + '" disabled></div>' +
      '<div class="soa-meta-item"><label>质量评分</label><input value="' + (isNew ? '' : '96') + '" disabled></div>' +
      '<div class="soa-meta-item"><label>浏览量</label><input value="' + (isNew ? '' : '286') + '" disabled></div>' +
      '<div class="soa-meta-item"><label>推送量</label><input value="' + (isNew ? '' : '12') + '" disabled></div>' +
      '<div class="soa-meta-item"><label>调用量</label><input value="' + (isNew ? '' : '1,842') + '" disabled></div>' +
      '<div class="soa-meta-item"><label>管理单位</label><input data-soa-meta="unit" value="数据运营中心"></div>' +
      '<div class="soa-meta-item"><label>数据来源</label><input value="API编排" disabled></div>' +
      '<div class="soa-meta-item"><label>联系电话</label><input data-soa-meta="phone" value="0755-88001234"></div>' +
      '<div class="soa-meta-item"><label>更新频率</label><select data-soa-meta="frequency"><option>实时</option><option selected>每日</option><option>每周</option><option>每月</option></select></div>' +
      '<div class="soa-meta-item"><label>申请量</label><input value="' + (isNew ? '' : '8') + '" disabled></div>' +
    '</div>';
  }

  function categoryPickerHtml(value) {
    return '<div class="soa-category-picker" data-soa-category-picker>' +
      '<button type="button" data-soa-category-toggle><span data-soa-category-value>' + esc(value || '请选择') + '</span><i class="bi bi-chevron-down"></i></button>' +
      '<div class="soa-category-pop" data-soa-category-pop hidden>' +
        '<div class="soa-category-search"><i class="bi bi-search"></i><input type="search" data-soa-category-search placeholder="搜索数据分类"></div>' +
        '<div class="soa-category-tree" data-soa-category-tree>' +
          '<div class="soa-category-node" data-name="公共目录"><i class="bi bi-folder-fill"></i><span>公共目录</span></div>' +
          '<div class="soa-category-node" data-name="我的目录"><i class="bi bi-folder-fill"></i><span>我的目录</span></div>' +
          '<div class="soa-category-node child" data-name="我的目录 / 物流数据"><i class="bi bi-folder2"></i><span>物流数据</span></div>' +
          '<div class="soa-category-node child" data-name="我的目录 / 中电数据"><i class="bi bi-folder2"></i><span>中电数据</span></div>' +
          '<div class="soa-category-node child" data-name="我的目录 / 工单数据"><i class="bi bi-folder2"></i><span>工单数据</span></div>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  function editorHtml(row, isNew) {
    return '<section class="soa-editor">' +
      '<header class="soa-editor-head">' +
        '<div class="soa-tabs"><button class="soa-tab active" type="button" data-soa-tab="design">API编排</button><button class="soa-tab" type="button" data-soa-tab="meta">元数据信息</button></div>' +
        '<div class="soa-head-actions"><button class="btn" type="button" data-soa-editor-action="cancel"><i class="bi bi-x-lg"></i> 取消</button><button class="btn" type="button" data-soa-editor-action="save-as"><i class="bi bi-files"></i> 另存为</button><button class="btn btn-primary" type="button" data-soa-editor-action="save"><i class="bi bi-check2"></i> 保存</button></div>' +
      '</header>' +
      '<div class="soa-panel soa-design-panel active" data-soa-panel="design">' +
        '<div class="soa-canvas-shell">' +
          '<div class="soa-canvas" data-soa-canvas aria-label="API编排画布"><div class="soa-world" data-soa-world></div><div class="soa-marquee" data-soa-marquee hidden></div></div>' +
          '<div class="soa-palette" aria-label="节点面板">' +
            '<button class="soa-palette-item" type="button" draggable="true" data-soa-node-type="decision"><span class="soa-palette-icon">' + nodeSymbolSvg('decision') + '</span><span>判断节点</span></button>' +
            '<button class="soa-palette-item" type="button" draggable="true" data-soa-node-type="api"><span class="soa-palette-icon">' + nodeSymbolSvg('api') + '</span><span>API调用</span></button>' +
          '</div>' +
          '<div class="soa-zoom-tools" aria-label="画布缩放工具栏">' +
            '<button type="button" data-soa-zoom="out" title="缩小"><i class="bi bi-dash-lg"></i><span>缩小</span></button>' +
            '<button type="button" data-soa-zoom="reset" title="恢复100%"><i class="bi bi-aspect-ratio"></i><span data-soa-zoom-label>100%</span></button>' +
            '<button type="button" data-soa-zoom="in" title="放大"><i class="bi bi-plus-lg"></i><span>放大</span></button>' +
            '<button type="button" data-soa-zoom="fit" title="适应画布"><i class="bi bi-arrows-fullscreen"></i><span>适应</span></button>' +
          '</div>' +
          '<div class="soa-canvas-hint"><i class="bi bi-mouse2"></i><span>拖动节点 · 框选或 Ctrl/Shift 多选 · 右键拖动画布 · Ctrl+滚轮缩放</span></div>' +
          '<div class="soa-minimap" data-soa-minimap title="点击定位画布"><div data-soa-mini-nodes></div><span class="soa-mini-viewport" data-soa-mini-viewport></span></div>' +
          '<div class="soa-property-backdrop" data-soa-property-backdrop></div>' +
          '<aside class="soa-property-panel" data-soa-property-panel><header class="soa-property-head"><strong data-soa-property-caption>节点属性配置</strong><button class="soa-property-close" type="button" data-soa-property-close aria-label="关闭"><i class="bi bi-x-lg"></i></button></header><div class="soa-property-body" data-soa-property-body></div></aside>' +
        '</div>' +
      '</div>' +
      '<div class="soa-panel soa-meta-panel" data-soa-panel="meta">' + metadataHtml(row, isNew) + '</div>' +
      '<div class="soa-context-menu" data-soa-context-menu></div>' +
    '</section>';
  }

  function renderEditor(row, isNew) {
    pageEl.innerHTML = editorHtml(row, isNew);
    editorState = {
      row: row || null,
      isNew: !!isNew,
      nodes: initialNodes(row, isNew),
      edges: initialEdges(isNew),
      selected: [],
      scale: 1,
      panX: 12,
      panY: 28,
      worldWidth: 1500,
      worldHeight: 760,
      activeNodeId: null,
      dragType: ''
    };
    bindEditorEvents();
    renderCanvas();
  }

  function findNode(id) {
    return editorState && editorState.nodes.find(function (node) { return node.id === id; });
  }

  function nodeSymbolSvg(type) {
    if (type === 'decision') {
      return '<svg class="soa-node-symbol is-decision" viewBox="0 0 32 32" aria-hidden="true" focusable="false">' +
        '<path d="M4 16h9M13 16c4 0 3-8 8-8h6M13 16c4 0 3 8 8 8h6"></path>' +
        '<path d="m23 4 4 4-4 4M23 20l4 4-4 4"></path>' +
        '<circle cx="13" cy="16" r="2"></circle>' +
      '</svg>';
    }
    return '<svg class="soa-node-symbol is-api" viewBox="0 0 32 32" aria-hidden="true" focusable="false">' +
      '<rect x="4.5" y="6" width="23" height="20" rx="2.5"></rect>' +
      '<path d="M5 11h22"></path>' +
      '<circle cx="8" cy="8.5" r=".8"></circle><circle cx="11" cy="8.5" r=".8"></circle><circle cx="14" cy="8.5" r=".8"></circle>' +
      '<text x="16" y="21.5" text-anchor="middle">API</text>' +
    '</svg>';
  }

  function nodeHtml(node) {
    var testActive = (editorState.testActiveNodeIds || []).indexOf(node.id) > -1;
    var classes = 'soa-node is-' + node.type + (editorState.selected.indexOf(node.id) > -1 ? ' selected' : '') + (testActive ? ' is-test-active' : '');
    var title = editorState.readOnly ? '流程节点' : '点击配置，拖动调整位置';
    return '<div class="' + classes + '" data-soa-node="' + esc(node.id) + '" style="left:' + node.x + 'px;top:' + node.y + 'px" title="' + title + '">' +
      (node.type === 'main' ? '' : '<span class="soa-port in"></span>') +
      '<span class="soa-node-icon">' + nodeSymbolSvg(node.type) + '</span>' +
      '<span class="soa-node-label">' + esc(node.label) + '</span>' +
      '<span class="soa-port out"></span>' +
    '</div>';
  }

  function renderCanvas() {
    var world = pageEl.querySelector('[data-soa-world]');
    if (!world || !editorState) return;
    world.innerHTML = '<svg class="soa-connections" data-soa-connections aria-hidden="true"><defs><marker id="soaArrow" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto"><path d="M0,1 L8,4.5 L0,8 Z" fill="#1683ee"></path></marker><marker id="soaTestArrow" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto"><path d="M0,1 L8,4.5 L0,8 Z" fill="#22ce82"></path></marker></defs><g data-soa-edge-layer></g></svg>' + editorState.nodes.map(nodeHtml).join('');
    updateCanvasTransform();
    redrawEdges();
    renderMinimap();
  }

  function redrawEdges() {
    var layer = pageEl.querySelector('[data-soa-edge-layer]');
    if (!layer || !editorState) return;
    layer.innerHTML = editorState.edges.map(function (edge) {
      var from = findNode(edge.from);
      var to = findNode(edge.to);
      if (!from || !to) return '';
      var fromEl = pageEl.querySelector('[data-soa-node="' + edge.from + '"]');
      var toEl = pageEl.querySelector('[data-soa-node="' + edge.to + '"]');
      var fw = fromEl ? fromEl.offsetWidth : 148;
      var fh = fromEl ? fromEl.offsetHeight : 48;
      var th = toEl ? toEl.offsetHeight : 48;
      var x1 = from.x + fw;
      var y1 = from.y + fh / 2;
      var x2 = to.x;
      var y2 = to.y + th / 2;
      var distance = Math.max(50, Math.abs(x2 - x1) * .42);
      var path = 'M' + x1 + ',' + y1 + ' C' + (x1 + distance) + ',' + y1 + ' ' + (x2 - distance) + ',' + y2 + ' ' + x2 + ',' + y2;
      var edgeKey = edge.from + '>' + edge.to;
      var testActive = (editorState.testActiveEdgeKeys || []).indexOf(edgeKey) > -1;
      var label = edge.label ? '<text class="soa-edge-label' + (testActive ? ' is-test-active' : '') + '" x="' + ((x1 + x2) / 2) + '" y="' + (((y1 + y2) / 2) - 8) + '" text-anchor="middle">' + esc(edge.label) + '</text>' : '';
      return '<path class="soa-edge' + (testActive ? ' is-test-active' : '') + '" d="' + path + '" marker-end="url(#' + (testActive ? 'soaTestArrow' : 'soaArrow') + ')"></path>' + label;
    }).join('');
  }

  function updateCanvasTransform() {
    if (!editorState) return;
    var world = pageEl.querySelector('[data-soa-world]');
    var canvas = pageEl.querySelector('[data-soa-canvas]');
    if (!world || !canvas) return;
    world.style.transform = 'translate(' + editorState.panX + 'px,' + editorState.panY + 'px) scale(' + editorState.scale + ')';
    canvas.style.setProperty('--soa-grid-scale', editorState.scale);
    canvas.style.setProperty('--soa-grid-x', editorState.panX + 'px');
    canvas.style.setProperty('--soa-grid-y', editorState.panY + 'px');
    var label = pageEl.querySelector('[data-soa-zoom-label]');
    if (label) label.textContent = Math.round(editorState.scale * 100) + '%';
    pageEl.querySelectorAll('[data-soa-zoom="out"]').forEach(function (button) { button.disabled = editorState.scale <= .5; });
    pageEl.querySelectorAll('[data-soa-zoom="in"]').forEach(function (button) { button.disabled = editorState.scale >= 1.6; });
    updateMinimapViewport();
  }

  function setScale(next, clientX, clientY) {
    if (!editorState) return;
    var canvas = pageEl.querySelector('[data-soa-canvas]');
    var rect = canvas.getBoundingClientRect();
    var old = editorState.scale;
    var scale = Math.max(.5, Math.min(1.6, Math.round(next * 10) / 10));
    var anchorX = clientX == null ? rect.width / 2 : clientX - rect.left;
    var anchorY = clientY == null ? rect.height / 2 : clientY - rect.top;
    var worldX = (anchorX - editorState.panX) / old;
    var worldY = (anchorY - editorState.panY) / old;
    editorState.scale = scale;
    editorState.panX = anchorX - worldX * scale;
    editorState.panY = anchorY - worldY * scale;
    updateCanvasTransform();
  }

  function fitCanvas() {
    var canvas = pageEl.querySelector('[data-soa-canvas]');
    if (!canvas || !editorState) return;
    var used = editorState.nodes.reduce(function (box, node) {
      box.minX = Math.min(box.minX, node.x);
      box.minY = Math.min(box.minY, node.y);
      box.maxX = Math.max(box.maxX, node.x + (node.type === 'decision' ? 112 : 210));
      box.maxY = Math.max(box.maxY, node.y + (node.type === 'decision' ? 100 : 48));
      return box;
    }, { minX: Infinity, minY: Infinity, maxX: 0, maxY: 0 });
    var width = Math.max(300, used.maxX - used.minX + 120);
    var height = Math.max(220, used.maxY - used.minY + 120);
    editorState.scale = Math.max(.5, Math.min(1.2, Math.min(canvas.clientWidth / width, canvas.clientHeight / height)));
    editorState.scale = Math.round(editorState.scale * 10) / 10;
    editorState.panX = (canvas.clientWidth - (used.maxX - used.minX) * editorState.scale) / 2 - used.minX * editorState.scale;
    editorState.panY = (canvas.clientHeight - (used.maxY - used.minY) * editorState.scale) / 2 - used.minY * editorState.scale;
    updateCanvasTransform();
  }

  function renderMinimap() {
    if (!editorState) return;
    var host = pageEl.querySelector('[data-soa-mini-nodes]');
    if (!host) return;
    var edgeHtml = editorState.edges.map(function (edge) {
      var from = findNode(edge.from);
      var to = findNode(edge.to);
      if (!from || !to) return '';
      var fromWidth = from.type === 'decision' ? 112 : 160;
      var fromHeight = from.type === 'decision' ? 72 : 48;
      var toWidth = to.type === 'decision' ? 112 : 160;
      var toHeight = to.type === 'decision' ? 72 : 48;
      var x1 = from.x + fromWidth / 2;
      var y1 = from.y + fromHeight / 2;
      var x2 = to.x + toWidth / 2;
      var y2 = to.y + toHeight / 2;
      var middle = (x1 + x2) / 2;
      return '<path d="M' + x1 + ',' + y1 + ' C' + middle + ',' + y1 + ' ' + middle + ',' + y2 + ' ' + x2 + ',' + y2 + '"></path>';
    }).join('');
    host.innerHTML = '<svg class="soa-mini-edges" viewBox="0 0 ' + editorState.worldWidth + ' ' + editorState.worldHeight + '" preserveAspectRatio="none" aria-hidden="true">' + edgeHtml + '</svg>' + editorState.nodes.map(function (node) {
      var left = node.x / editorState.worldWidth * 100;
      var top = node.y / editorState.worldHeight * 100;
      return '<i class="soa-mini-node ' + (node.type === 'decision' ? 'decision' : '') + '" style="left:' + left + '%;top:' + top + '%"></i>';
    }).join('');
    updateMinimapViewport();
  }

  function updateMinimapViewport() {
    if (!editorState) return;
    var canvas = pageEl.querySelector('[data-soa-canvas]');
    var mini = pageEl.querySelector('[data-soa-minimap]');
    var viewport = pageEl.querySelector('[data-soa-mini-viewport]');
    if (!canvas || !mini || !viewport) return;
    var worldLeft = Math.max(0, -editorState.panX / editorState.scale);
    var worldTop = Math.max(0, -editorState.panY / editorState.scale);
    var width = Math.min(editorState.worldWidth, canvas.clientWidth / editorState.scale);
    var height = Math.min(editorState.worldHeight, canvas.clientHeight / editorState.scale);
    viewport.style.left = Math.min(mini.clientWidth - 8, worldLeft / editorState.worldWidth * mini.clientWidth) + 'px';
    viewport.style.top = Math.min(mini.clientHeight - 8, worldTop / editorState.worldHeight * mini.clientHeight) + 'px';
    viewport.style.width = Math.max(12, width / editorState.worldWidth * mini.clientWidth) + 'px';
    viewport.style.height = Math.max(10, height / editorState.worldHeight * mini.clientHeight) + 'px';
  }

  function selectNodes(ids) {
    if (!editorState) return;
    editorState.selected = ids.slice();
    pageEl.querySelectorAll('[data-soa-node]').forEach(function (item) {
      item.classList.toggle('selected', ids.indexOf(item.dataset.soaNode) > -1);
    });
  }

  function worldPoint(clientX, clientY) {
    var canvas = pageEl.querySelector('[data-soa-canvas]');
    var rect = canvas.getBoundingClientRect();
    return {
      x: (clientX - rect.left - editorState.panX) / editorState.scale,
      y: (clientY - rect.top - editorState.panY) / editorState.scale
    };
  }

  function addNode(type, point) {
    nodeSequence += 1;
    var node = {
      id: type + '-' + nodeSequence,
      type: type,
      label: type === 'decision' ? '判断节点' : 'API调用',
      x: Math.max(12, Math.min(editorState.worldWidth - 220, Math.round(point.x))),
      y: Math.max(12, Math.min(editorState.worldHeight - 100, Math.round(point.y)))
    };
    if (type === 'decision') node.expression = '';
    editorState.nodes.push(node);
    selectNodes([node.id]);
    renderCanvas();
    openProperties(node.id);
  }

  function propertyApiOptions(keyword) {
    keyword = String(keyword || '').trim().toLowerCase();
    var filtered = apiOptions.filter(function (item) { return item.name.toLowerCase().indexOf(keyword) > -1; });
    if (!filtered.length) return '<div class="soa-api-option-empty">未找到匹配的 API</div>';
    return filtered.map(function (item, index) {
      var realIndex = apiOptions.indexOf(item);
      return '<button type="button" data-soa-api-option="' + realIndex + '"><span>' + esc(item.name) + '（' + esc(item.version) + '）</span></button>';
    }).join('');
  }

  function apiPickerHtml(node) {
    return '<div class="soa-api-picker" data-soa-api-picker>' +
      '<button type="button" data-soa-api-toggle><span data-soa-api-value>' + esc(node.api ? node.api.name : '请选择') + '</span><i class="bi bi-chevron-down"></i></button>' +
      '<div class="soa-api-options" data-soa-api-options hidden>' +
        '<div class="soa-api-options-search"><i class="bi bi-search"></i><input type="search" data-soa-api-search placeholder="搜索 API 名称"></div>' +
        '<div class="soa-api-option-list" data-soa-api-option-list>' + propertyApiOptions('') + '</div>' +
      '</div>' +
    '</div>';
  }

  function apiPropertyHtml(node) {
    var api = node.api || { version: '', protocol: '', format: '', method: '', url: '', desc: '' };
    var response = '{\n  "code": 0,\n  "msg": "成功",\n  "obj": {\n    "regionCode": "440300",\n    "availableVehicle": 86,\n    "fulfillmentRate": 0.972\n  }\n}';
    return '<div class="soa-property-grid">' +
      '<div class="soa-form-row"><label><em>*</em> API名称</label>' + apiPickerHtml(node) + '</div>' +
      '<div class="soa-form-row"><label>版本</label><select data-soa-api-field="version"><option value="">请选择</option><option' + (api.version === 'V1' ? ' selected' : '') + '>V1</option><option' + (api.version === 'V2' ? ' selected' : '') + '>V2</option><option' + (api.version === 'V3' ? ' selected' : '') + '>V3</option></select></div>' +
      '<div class="soa-form-row"><label>接口方式</label><input value="REST" disabled></div>' +
      '<div class="soa-form-row"><label>传输协议</label><input data-soa-api-field="protocol" value="' + esc((api.protocol || '').toLowerCase()) + '" disabled></div>' +
      '<div class="soa-form-row"><label>数据格式</label><input data-soa-api-field="format" value="' + esc(api.format) + '" disabled></div>' +
      '<div class="soa-form-row"><label>请求方式</label><input data-soa-api-field="method" value="' + esc(api.method) + '" disabled></div>' +
      '<div class="soa-form-row wide"><label>接口地址</label><input data-soa-api-field="url" value="' + esc(api.url) + '" disabled></div>' +
      '<div class="soa-form-row align-start wide"><label>接口说明</label><textarea data-soa-api-field="desc" disabled>' + esc(api.desc) + '</textarea></div>' +
      '<div class="wide"><div class="soa-section-title">返回数据</div><div class="soa-code-box"><div class="soa-code-toolbar"><button type="button" data-soa-code-action="format"><i class="bi bi-sliders"></i> 格式化</button><button type="button" data-soa-code-action="copy"><i class="bi bi-copy"></i> 复制</button><button type="button" data-soa-code-action="search"><i class="bi bi-search"></i> 搜索</button><button type="button" data-soa-code-action="fullscreen"><i class="bi bi-arrows-fullscreen"></i> 全屏</button></div><pre>' + esc(response) + '</pre></div></div>' +
      '<div class="soa-property-actions wide"><button class="btn btn-primary" type="button" data-soa-property-save><i class="bi bi-check2"></i> 保存</button></div>' +
    '</div>';
  }

  function decisionPropertyHtml(node) {
    var branches = editorState.edges.filter(function (edge) { return edge.from === node.id; });
    var branchHtml = branches.map(function (edge, index) {
      var target = findNode(edge.to);
      var expression = edge.expression || '';
      return '<div class="soa-branch-row" data-soa-branch="' + esc(edge.to) + '">' +
        '<span class="soa-branch-index">' + (index + 1) + '</span>' +
        '<div class="soa-branch-expression"><input type="text" maxlength="200" data-soa-branch-expression value="' + esc(expression) + '"><small>' + expression.length + ' / 200</small></div>' +
        '<span class="soa-branch-arrow"></span>' +
        '<span class="soa-branch-target"><span class="soa-branch-target-icon">' + nodeSymbolSvg('api') + '</span><span>' + esc(target ? target.label : '未连接节点') + '</span></span>' +
      '</div>';
    }).join('');
    return '<div class="soa-property-grid">' +
      '<div class="soa-form-row wide" style="max-width:570px"><label><em>*</em> 名称</label><input data-soa-node-name value="' + esc(node.label) + '" maxlength="50"></div>' +
      '<div class="wide"><div class="soa-section-title">可配置参数：</div>' +
      '<table class="soa-param-table"><thead><tr><th>参数名</th><th>说明</th></tr></thead><tbody><tr><td>code</td><td>返回码</td></tr><tr><td>msg</td><td>返回描述</td></tr></tbody></table></div>' +
      '<div class="wide"><div class="soa-section-title">条件判断表达式：</div>' +
      '<div class="soa-info-note"><i class="bi bi-info-circle"></i><span><strong>说明：</strong>基于 OGNL 的表达式，条件判断表达式需要最终返回一个布尔值，支持比较运算符 ==、!=、&gt;、&lt;、&gt;=、&lt;= 和逻辑运算符 and(&amp;&amp;)、or(||)、! 以及括号组合。</span></div>' +
      '<div class="soa-info-note"><i class="bi bi-info-circle"></i><span><strong>提示：</strong>如果取值 key 存在 size 或 isEmpty 时，需要使用单引号加中括号，如 page[\'size\']、obj[\'isEmpty\'].key1.key2。</span></div>' +
      '<div class="soa-branch-list">' + branchHtml + '</div></div>' +
      '<div class="soa-property-actions wide"><button class="btn btn-primary" type="button" data-soa-property-save><i class="bi bi-check2"></i> 保存</button></div>' +
    '</div>';
  }

  function mainPropertyHtml(node) {
    var path = editorState.row ? '/' + editorState.row.enName : '';
    var bodyExample = '{\n  "regionCode": "440300",\n  "statDate": "2026-09-21",\n  "includeInactive": false\n}';
    return '<div class="soa-property-grid">' +
      '<div class="soa-form-row"><label>接口方式</label><input value="REST" disabled></div>' +
      '<div class="soa-form-row"><label>传输协议</label><select><option value="">请选择</option><option>http</option><option>https</option></select></div>' +
      '<div class="soa-form-row"><label>数据格式</label><input value="JSON" disabled></div>' +
      '<div class="soa-form-row"><label>请求方式</label><select><option>POST</option><option>GET</option></select></div>' +
      '<div class="soa-form-row"><label>数据编码</label><select><option>UTF-8</option><option>GBK</option></select></div>' +
      '<div class="soa-form-row"><label>接口缓存</label><select><option value="">请选择</option><option>开启</option><option>关闭</option></select></div>' +
      '<div class="soa-form-row"><label>请求URL</label><input value="http://192.168.61.111:30080/share-api/{接口标识}" disabled></div>' +
      '<div class="soa-form-row"><label>缓存有效期</label><div style="display:grid;grid-template-columns:1fr 160px;gap:10px"><input type="number" value="0" min="0"><select><option value="">请选择</option><option>分钟</option><option>小时</option><option>天</option></select></div></div>' +
      '<div class="soa-form-row wide"><label></label><input data-soa-main-path value="' + esc(path) + '" placeholder="请输入接口路径"></div>' +
      '<div class="soa-form-row align-start wide"><label>接口说明</label><textarea maxlength="500">' + esc(editorState.row ? editorState.row.enName : '') + '</textarea></div>' +
      '<div class="wide"><div class="soa-section-title">请求参数：</div>' +
        '<div class="soa-request-tabs" data-soa-request-tabs><button class="active" type="button" data-soa-request-tab="header">Herder参数</button><button type="button" data-soa-request-tab="path">Path参数</button><button type="button" data-soa-request-tab="query">Query参数</button><button type="button" data-soa-request-tab="body">Body参数</button></div>' +
        '<div data-soa-request-panel="standard">' +
          '<div class="soa-request-toolbar"><button type="button" data-soa-add-param><i class="bi bi-plus-circle"></i> 新增参数</button></div>' +
          '<table class="soa-param-table"><thead><tr><th>参数名</th><th>必填</th><th>数据类型</th><th>默认值</th><th>参数说明</th><th style="width:70px">操作</th></tr></thead><tbody data-soa-request-body><tr data-soa-empty-param><td colspan="6" class="soa-param-empty">暂无数据</td></tr></tbody></table>' +
        '</div>' +
        '<div class="soa-body-panel" data-soa-request-panel="body" hidden>' +
          '<div class="soa-body-topbar"><div class="soa-body-formats" data-soa-body-formats><label class="active"><input type="radio" name="soa-body-format" value="json" checked><span>json</span></label><label><input type="radio" name="soa-body-format" value="xml"><span>xml</span></label><label><input type="radio" name="soa-body-format" value="form"><span>x-www-form-urlencoded</span></label></div><button class="soa-parse-button" type="button" data-soa-body-parse><i class="bi bi-braces"></i><span>参数解析</span></button></div>' +
          '<div class="soa-body-workspace">' +
            '<div class="soa-body-editor"><div class="soa-body-code-toolbar"><select aria-label="代码主题"><option>暗色 - One Dark</option></select><select aria-label="代码字号"><option>14px</option><option>16px</option></select><button type="button" data-soa-code-action="format" title="格式化代码"><i class="bi bi-paint-bucket"></i></button><button type="button" data-soa-code-action="copy" title="复制代码"><i class="bi bi-copy"></i></button><button type="button" data-soa-code-action="search" title="搜索"><i class="bi bi-search"></i></button><button type="button" data-soa-code-action="fullscreen" title="全屏"><i class="bi bi-arrows-fullscreen"></i></button></div><textarea data-soa-body-code spellcheck="false">' + esc(bodyExample) + '</textarea></div>' +
            '<div class="soa-body-result"><table class="soa-param-table"><thead><tr><th>参数名</th><th>必填</th><th>数据类型</th><th>参数值</th><th>参数说明</th></tr></thead><tbody data-soa-body-result><tr data-soa-body-empty><td colspan="5" class="soa-param-empty">暂无数据</td></tr></tbody></table></div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="soa-property-actions wide"><button class="btn btn-primary" type="button" data-soa-property-save><i class="bi bi-check2"></i> 保存</button></div>' +
    '</div>';
  }

  function openProperties(nodeId) {
    var node = findNode(nodeId);
    if (!node) return;
    editorState.activeNodeId = nodeId;
    var panel = pageEl.querySelector('[data-soa-property-panel]');
    var body = pageEl.querySelector('[data-soa-property-body]');
    var caption = pageEl.querySelector('[data-soa-property-caption]');
    if (caption) caption.textContent = node.type === 'main' ? '主服务接口属性' : (node.type === 'decision' ? '判断节点属性' : 'API 调用节点属性');
    body.innerHTML = node.type === 'decision' ? decisionPropertyHtml(node) : (node.type === 'main' ? mainPropertyHtml(node) : apiPropertyHtml(node));
    panel.classList.add('show');
    pageEl.querySelector('[data-soa-property-backdrop]').classList.add('show');
    bindPropertyEvents();
  }

  function closeProperties() {
    var panel = pageEl.querySelector('[data-soa-property-panel]');
    if (panel) panel.classList.remove('show');
    var backdrop = pageEl.querySelector('[data-soa-property-backdrop]');
    if (backdrop) backdrop.classList.remove('show');
  }

  function bindPropertyEvents() {
    var body = pageEl.querySelector('[data-soa-property-body]');
    if (!body) return;
    var saveButton = body.querySelector('[data-soa-property-save]');
    if (saveButton) saveButton.addEventListener('click', saveActiveProperty);
    var toggle = body.querySelector('[data-soa-api-toggle]');
    if (toggle) {
      toggle.addEventListener('click', function () {
        var pop = body.querySelector('[data-soa-api-options]');
        pop.hidden = !pop.hidden;
        if (!pop.hidden) {
          var search = body.querySelector('[data-soa-api-search]');
          search.focus();
        }
      });
      body.querySelector('[data-soa-api-search]').addEventListener('input', function (event) {
        body.querySelector('[data-soa-api-option-list]').innerHTML = propertyApiOptions(event.target.value);
      });
      body.addEventListener('click', function (event) {
        var option = event.target.closest('[data-soa-api-option]');
        if (!option) return;
        var api = apiOptions[Number(option.dataset.soaApiOption)];
        var node = findNode(editorState.activeNodeId);
        if (!node || !api) return;
        node.api = api;
        node.label = api.name;
        body.querySelector('[data-soa-api-value]').textContent = api.name;
        ['version', 'protocol', 'format', 'method', 'url', 'desc'].forEach(function (field) {
          var input = body.querySelector('[data-soa-api-field="' + field + '"]');
          if (input) input.value = field === 'protocol' ? api[field].toLowerCase() : api[field];
        });
        body.querySelector('[data-soa-api-options]').hidden = true;
        var label = pageEl.querySelector('[data-soa-node="' + node.id + '"] .soa-node-label');
        if (label) label.textContent = node.label;
        renderMinimap();
      });
    }

    body.querySelectorAll('[data-soa-code-action]').forEach(function (button) {
      button.addEventListener('click', function () {
        var labels = { copy: '返回数据已复制', format: '返回数据已格式化', search: '已打开代码搜索', fullscreen: '返回数据编辑器已全屏' };
        toast(labels[button.dataset.soaCodeAction] || '操作已完成', 'success');
      });
    });

    body.querySelectorAll('[data-soa-branch-expression]').forEach(function (input) {
      input.addEventListener('input', function () {
        input.parentNode.querySelector('small').textContent = input.value.length + ' / 200';
      });
    });

    var requestTabs = body.querySelector('[data-soa-request-tabs]');
    if (requestTabs) {
      requestTabs.addEventListener('click', function (event) {
        var tab = event.target.closest('button');
        if (!tab) return;
        requestTabs.querySelectorAll('button').forEach(function (item) { item.classList.toggle('active', item === tab); });
        body.querySelectorAll('[data-soa-request-panel]').forEach(function (panel) {
          panel.hidden = tab.dataset.soaRequestTab === 'body' ? panel.dataset.soaRequestPanel !== 'body' : panel.dataset.soaRequestPanel !== 'standard';
        });
      });
    }
    var bodyFormats = body.querySelector('[data-soa-body-formats]');
    if (bodyFormats) {
      bodyFormats.addEventListener('change', function (event) {
        if (!event.target.matches('input[type="radio"]')) return;
        bodyFormats.querySelectorAll('label').forEach(function (label) { label.classList.toggle('active', label.contains(event.target)); });
      });
    }
    var parseBody = body.querySelector('[data-soa-body-parse]');
    if (parseBody) {
      parseBody.addEventListener('click', function () {
        var result = body.querySelector('[data-soa-body-result]');
        result.innerHTML = '<tr><td>regionCode</td><td>是</td><td>String</td><td>440300</td><td>行政区划编码</td></tr>' +
          '<tr><td>statDate</td><td>是</td><td>String</td><td>2026-09-21</td><td>统计日期</td></tr>' +
          '<tr><td>includeInactive</td><td>否</td><td>Boolean</td><td>false</td><td>是否包含停用数据</td></tr>';
        toast('Body 参数解析完成', 'success');
      });
    }
    var addParam = body.querySelector('[data-soa-add-param]');
    if (addParam) {
      addParam.addEventListener('click', function () {
        var tbody = body.querySelector('[data-soa-request-body]');
        var empty = tbody.querySelector('[data-soa-empty-param]');
        if (empty) empty.remove();
        tbody.insertAdjacentHTML('beforeend', '<tr><td><input value="regionCode" aria-label="参数名"></td><td><select aria-label="必填"><option>是</option><option>否</option></select></td><td><select aria-label="数据类型"><option>String</option><option>Integer</option><option>Boolean</option></select></td><td><input value="440300" aria-label="默认值"></td><td><input value="行政区划编码" aria-label="参数说明"></td><td><button class="svc-row-action danger" type="button" data-soa-remove-param><i class="bi bi-trash3"></i><span>删除</span></button></td></tr>');
      });
      body.addEventListener('click', function (event) {
        var remove = event.target.closest('[data-soa-remove-param]');
        if (!remove) return;
        remove.closest('tr').remove();
      });
    }
  }

  function saveActiveProperty() {
    var node = findNode(editorState.activeNodeId);
    var body = pageEl.querySelector('[data-soa-property-body]');
    if (!node || !body) return;
    var nameInput = body.querySelector('[data-soa-node-name]');
    if (nameInput) {
      var nextName = nameInput.value.trim();
      if (!nextName) {
        toast('请输入节点名称', 'warning');
        nameInput.focus();
        return;
      }
      node.label = nextName;
    }
    body.querySelectorAll('[data-soa-branch]').forEach(function (row) {
      var edge = editorState.edges.find(function (item) { return item.from === node.id && item.to === row.dataset.soaBranch; });
      var input = row.querySelector('[data-soa-branch-expression]');
      if (edge && input) edge.expression = input.value.trim();
    });
    if (node.type === 'api' && !node.api) {
      toast('请选择 API', 'warning');
      return;
    }
    renderCanvas();
    closeProperties();
    toast('节点属性已保存', 'success');
  }

  function deleteSelected() {
    if (!editorState) return;
    var deletable = editorState.selected.filter(function (id) {
      var node = findNode(id);
      return node && node.type !== 'main';
    });
    if (!deletable.length) {
      toast('主服务接口不能删除', 'warning');
      return;
    }
    editorState.nodes = editorState.nodes.filter(function (node) { return deletable.indexOf(node.id) < 0; });
    editorState.edges = editorState.edges.filter(function (edge) { return deletable.indexOf(edge.from) < 0 && deletable.indexOf(edge.to) < 0; });
    editorState.selected = [];
    closeProperties();
    renderCanvas();
    toast('已删除 ' + deletable.length + ' 个节点', 'success');
  }

  function hideContextMenu() {
    var menu = pageEl.querySelector('[data-soa-context-menu]');
    if (menu) menu.classList.remove('show');
  }

  function contextItem(action, icon, label, disabled, danger) {
    return '<button type="button" data-soa-context-action="' + action + '"' + (disabled ? ' disabled' : '') + (danger ? ' class="danger"' : '') + '><i class="bi ' + icon + '"></i><span>' + label + '</span></button>';
  }

  function contextMenuHtml(selectedCount) {
    if (!selectedCount) {
      return contextItem('auto-layout', 'bi-grid-3x3', '整体自动布局');
    }
    return contextItem('align-left', 'bi-text-left', '左对齐', selectedCount < 2) +
      contextItem('align-center-h', 'bi-text-center', '水平居中对齐', selectedCount < 2) +
      contextItem('align-right', 'bi-text-right', '右对齐', selectedCount < 2) +
      '<div class="separator"></div>' +
      contextItem('align-top', 'bi-align-top', '顶对齐', selectedCount < 2) +
      contextItem('align-center-v', 'bi-align-middle', '垂直居中对齐', selectedCount < 2) +
      contextItem('align-bottom', 'bi-align-bottom', '底对齐', selectedCount < 2) +
      '<div class="separator"></div>' +
      contextItem('dist-h', 'bi-distribute-horizontal', '水平平均分布', selectedCount < 3) +
      contextItem('dist-v', 'bi-distribute-vertical', '垂直平均分布', selectedCount < 3) +
      '<div class="separator"></div>' +
      contextItem('delete', 'bi-trash3', '删除选中节点', false, true);
  }

  function showContextMenu(clientX, clientY) {
    var menu = pageEl.querySelector('[data-soa-context-menu]');
    if (!menu) return;
    menu.innerHTML = contextMenuHtml(editorState.selected.length);
    menu.classList.add('show');
    menu.style.left = Math.max(8, Math.min(clientX, window.innerWidth - menu.offsetWidth - 8)) + 'px';
    menu.style.top = Math.max(8, Math.min(clientY, window.innerHeight - menu.offsetHeight - 8)) + 'px';
  }

  function nodeSize(node) {
    var element = pageEl.querySelector('[data-soa-node="' + node.id + '"]');
    return { width: element ? element.offsetWidth : (node.type === 'decision' ? 112 : 190), height: element ? element.offsetHeight : (node.type === 'decision' ? 72 : 48) };
  }

  function autoLayoutCanvas() {
    var nodes = editorState.nodes.slice();
    if (!nodes.length) return;
    var main = nodes.find(function (node) { return node.type === 'main'; });
    var nodeMap = {};
    var indegree = {};
    var depth = {};
    var outgoing = {};
    var incoming = {};
    nodes.forEach(function (node) {
      nodeMap[node.id] = node;
      indegree[node.id] = 0;
      depth[node.id] = node.id === (main && main.id) ? 0 : 1;
      outgoing[node.id] = [];
      incoming[node.id] = [];
    });
    editorState.edges.forEach(function (edge) {
      if (!nodeMap[edge.from] || !nodeMap[edge.to]) return;
      outgoing[edge.from].push(edge);
      incoming[edge.to].push(edge);
      indegree[edge.to] += 1;
    });

    var queue = nodes.filter(function (node) { return indegree[node.id] === 0; }).sort(function (a, b) {
      if (a === main) return -1;
      if (b === main) return 1;
      return a.x - b.x || a.y - b.y;
    });
    var visited = {};
    while (queue.length) {
      var current = queue.shift();
      visited[current.id] = true;
      outgoing[current.id].forEach(function (edge) {
        depth[edge.to] = Math.max(depth[edge.to], depth[current.id] + 1);
        indegree[edge.to] -= 1;
        if (indegree[edge.to] === 0) queue.push(nodeMap[edge.to]);
      });
    }

    var maxVisitedDepth = Math.max.apply(null, Object.keys(visited).map(function (id) { return depth[id]; }).concat([0]));
    nodes.filter(function (node) { return !visited[node.id]; }).sort(function (a, b) { return a.x - b.x || a.y - b.y; }).forEach(function (node) {
      depth[node.id] = maxVisitedDepth + 1;
    });

    var layers = {};
    nodes.forEach(function (node) {
      var level = depth[node.id];
      if (!layers[level]) layers[level] = [];
      layers[level].push(node);
    });
    var levels = Object.keys(layers).map(Number).sort(function (a, b) { return a - b; });
    var layoutRank = {};
    var layerX = 80;
    var previousWidth = 0;
    levels.forEach(function (level, levelIndex) {
      var layer = layers[level];
      if (levelIndex) layerX += previousWidth + 140;
      layer.sort(function (a, b) {
        function desiredRank(node) {
          var parents = incoming[node.id];
          if (!parents.length) return node.y / 1000;
          return parents.reduce(function (total, edge) {
            var siblings = outgoing[edge.from];
            var branchIndex = siblings.indexOf(edge);
            var branchOffset = siblings.length > 1 ? (branchIndex - (siblings.length - 1) / 2) / siblings.length : 0;
            return total + (layoutRank[edge.from] == null ? 0 : layoutRank[edge.from]) + branchOffset;
          }, 0) / parents.length;
        }
        var rankDiff = desiredRank(a) - desiredRank(b);
        return rankDiff || a.y - b.y || a.x - b.x;
      });
      var sizes = layer.map(nodeSize);
      var gap = layer.length > 3 ? 58 : 96;
      var totalHeight = sizes.reduce(function (sum, size) { return sum + size.height; }, 0) + gap * Math.max(0, layer.length - 1);
      var cursorY = Math.max(50, (editorState.worldHeight - totalHeight) / 2);
      var maxWidth = 0;
      layer.forEach(function (node, index) {
        node.x = layerX;
        node.y = cursorY;
        layoutRank[node.id] = index;
        cursorY += sizes[index].height + gap;
        maxWidth = Math.max(maxWidth, sizes[index].width);
      });
      previousWidth = maxWidth;
    });
  }

  function applyCanvasAction(action) {
    var selected = editorState.selected.map(findNode).filter(Boolean);
    if (action === 'delete') { deleteSelected(); return; }
    if (action === 'auto-layout') {
      autoLayoutCanvas();
      renderCanvas();
      fitCanvas();
      toast('已按接口调用关系完成整体布局', 'success');
      return;
    }
    if (selected.length >= 2 && action.indexOf('align-') === 0) {
      var sizes = selected.map(function (node) { return { node: node, size: nodeSize(node) }; });
      var boundLeft = Math.min.apply(null, sizes.map(function (item) { return item.node.x; }));
      var boundRight = Math.max.apply(null, sizes.map(function (item) { return item.node.x + item.size.width; }));
      var boundTop = Math.min.apply(null, sizes.map(function (item) { return item.node.y; }));
      var boundBottom = Math.max.apply(null, sizes.map(function (item) { return item.node.y + item.size.height; }));
      if (action === 'align-left') {
        selected.forEach(function (node) { node.x = boundLeft; });
      }
      if (action === 'align-right') {
        sizes.forEach(function (item) { item.node.x = boundRight - item.size.width; });
      }
      if (action === 'align-center-h') {
        var centerX = (boundLeft + boundRight) / 2;
        sizes.forEach(function (item) { item.node.x = centerX - item.size.width / 2; });
      }
      if (action === 'align-top') {
        selected.forEach(function (node) { node.y = boundTop; });
      }
      if (action === 'align-bottom') {
        sizes.forEach(function (item) { item.node.y = boundBottom - item.size.height; });
      }
      if (action === 'align-center-v') {
        var centerY = (boundTop + boundBottom) / 2;
        sizes.forEach(function (item) { item.node.y = centerY - item.size.height / 2; });
      }
    }
    if (selected.length >= 3 && (action === 'dist-h' || action === 'dist-v')) {
      var distribution = selected.map(function (node) { return { node: node, size: nodeSize(node) }; });
      if (action === 'dist-h') {
        distribution.sort(function (a, b) { return a.node.x - b.node.x; });
        var firstX = distribution[0].node.x + distribution[0].size.width / 2;
        var lastX = distribution[distribution.length - 1].node.x + distribution[distribution.length - 1].size.width / 2;
        distribution.forEach(function (item, index) { item.node.x = firstX + (lastX - firstX) * index / (distribution.length - 1) - item.size.width / 2; });
      } else {
        distribution.sort(function (a, b) { return a.node.y - b.node.y; });
        var firstY = distribution[0].node.y + distribution[0].size.height / 2;
        var lastY = distribution[distribution.length - 1].node.y + distribution[distribution.length - 1].size.height / 2;
        distribution.forEach(function (item, index) { item.node.y = firstY + (lastY - firstY) * index / (distribution.length - 1) - item.size.height / 2; });
      }
    }
    renderCanvas();
    toast('画布操作已完成', 'success');
  }

  function bindCanvasEvents() {
    var canvas = pageEl.querySelector('[data-soa-canvas]');
    var marquee = pageEl.querySelector('[data-soa-marquee]');
    if (!canvas) return;

    pageEl.querySelectorAll('[data-soa-node-type]').forEach(function (item) {
      item.addEventListener('dragstart', function (event) {
        editorState.dragType = item.dataset.soaNodeType;
        if (event.dataTransfer) {
          event.dataTransfer.effectAllowed = 'copy';
          event.dataTransfer.setData('text/plain', editorState.dragType);
        }
      });
      item.addEventListener('dblclick', function () {
        var rect = canvas.getBoundingClientRect();
        addNode(item.dataset.soaNodeType, worldPoint(rect.left + rect.width / 2, rect.top + rect.height / 2));
      });
    });

    canvas.addEventListener('dragover', function (event) {
      event.preventDefault();
      if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy';
    });
    canvas.addEventListener('drop', function (event) {
      event.preventDefault();
      var type = event.dataTransfer ? event.dataTransfer.getData('text/plain') : editorState.dragType;
      if (type === 'api' || type === 'decision') addNode(type, worldPoint(event.clientX, event.clientY));
      editorState.dragType = '';
    });

    canvas.addEventListener('wheel', function (event) {
      if (!event.ctrlKey) return;
      event.preventDefault();
      setScale(editorState.scale + (event.deltaY < 0 ? .1 : -.1), event.clientX, event.clientY);
    }, { passive: false });

    canvas.addEventListener('contextmenu', function (event) {
      event.preventDefault();
      event.stopPropagation();
      if (editorState.suppressContextMenu) return;
      var nodeEl = event.target.closest('[data-soa-node]');
      if (nodeEl) {
        var id = nodeEl.dataset.soaNode;
        if (editorState.selected.indexOf(id) < 0) selectNodes([id]);
      } else {
        selectNodes([]);
      }
      showContextMenu(event.clientX, event.clientY);
    });

    canvas.addEventListener('mousedown', function (event) {
      hideContextMenu();
      var nodeEl = event.target.closest('[data-soa-node]');

      var port = event.target.closest('.soa-port');
      if (event.button === 0 && nodeEl && port) {
        event.preventDefault();
        var portNodeId = nodeEl.dataset.soaNode;
        if (port.classList.contains('out')) {
          editorState.connectingFrom = portNodeId;
          selectNodes([portNodeId]);
          toast('请选择目标节点的输入连接点', 'info');
        } else if (editorState.connectingFrom && editorState.connectingFrom !== portNodeId) {
          var exists = editorState.edges.some(function (edge) { return edge.from === editorState.connectingFrom && edge.to === portNodeId; });
          if (!exists) {
            var source = findNode(editorState.connectingFrom);
            var sourceEdges = editorState.edges.filter(function (edge) { return edge.from === editorState.connectingFrom; });
            editorState.edges.push({
              from: editorState.connectingFrom,
              to: portNodeId,
              label: source && source.type === 'decision' ? (sourceEdges.length ? '不满足条件' : '满足条件') : '',
              expression: source && source.type === 'decision' ? (sourceEdges.length ? 'code != 0' : 'code == 0') : ''
            });
            redrawEdges();
            toast('节点连接已创建', 'success');
          }
          editorState.connectingFrom = null;
        }
        return;
      }

      if (event.button === 2 && !nodeEl) {
        event.preventDefault();
        var panStartX = event.clientX;
        var panStartY = event.clientY;
        var startPanX = editorState.panX;
        var startPanY = editorState.panY;
        var didPan = false;
        canvas.classList.add('is-panning');
        function panMove(moveEvent) {
          if (Math.abs(moveEvent.clientX - panStartX) > 3 || Math.abs(moveEvent.clientY - panStartY) > 3) didPan = true;
          editorState.panX = startPanX + moveEvent.clientX - panStartX;
          editorState.panY = startPanY + moveEvent.clientY - panStartY;
          updateCanvasTransform();
        }
        function panEnd() {
          canvas.classList.remove('is-panning');
          if (didPan) {
            editorState.suppressContextMenu = true;
            window.setTimeout(function () { if (editorState) editorState.suppressContextMenu = false; }, 180);
          }
          document.removeEventListener('mousemove', panMove);
          document.removeEventListener('mouseup', panEnd);
        }
        document.addEventListener('mousemove', panMove);
        document.addEventListener('mouseup', panEnd);
        return;
      }

      if (event.button !== 0) return;
      event.preventDefault();

      if (nodeEl) {
        var id = nodeEl.dataset.soaNode;
        var additive = event.ctrlKey || event.metaKey || event.shiftKey;
        var selected = editorState.selected.slice();
        if (additive) {
          if (selected.indexOf(id) > -1) {
            selected.splice(selected.indexOf(id), 1);
            selectNodes(selected);
            return;
          }
          selected.push(id);
        } else if (selected.indexOf(id) < 0) {
          selected = [id];
        }
        selectNodes(selected);
        var startX = event.clientX;
        var startY = event.clientY;
        var startPositions = editorState.selected.map(function (selectedId) {
          var node = findNode(selectedId);
          return { node: node, x: node.x, y: node.y };
        });
        var moved = false;
        function nodeMove(moveEvent) {
          var dx = (moveEvent.clientX - startX) / editorState.scale;
          var dy = (moveEvent.clientY - startY) / editorState.scale;
          if (Math.abs(dx) > 2 || Math.abs(dy) > 2) moved = true;
          startPositions.forEach(function (item) {
            item.node.x = Math.max(0, Math.min(editorState.worldWidth - 220, item.x + dx));
            item.node.y = Math.max(0, Math.min(editorState.worldHeight - 100, item.y + dy));
            var element = pageEl.querySelector('[data-soa-node="' + item.node.id + '"]');
            if (element) {
              element.style.left = item.node.x + 'px';
              element.style.top = item.node.y + 'px';
            }
          });
          redrawEdges();
          renderMinimap();
        }
        function nodeEnd() {
          document.removeEventListener('mousemove', nodeMove);
          document.removeEventListener('mouseup', nodeEnd);
          if (!moved && editorState.selected.length === 1) openProperties(id);
        }
        document.addEventListener('mousemove', nodeMove);
        document.addEventListener('mouseup', nodeEnd);
        return;
      }

      closeProperties();
      var additiveSelection = event.ctrlKey || event.metaKey || event.shiftKey;
      var initialSelection = editorState.selected.slice();
      if (!additiveSelection) selectNodes([]);
      var canvasRect = canvas.getBoundingClientRect();
      var sx = event.clientX - canvasRect.left;
      var sy = event.clientY - canvasRect.top;
      marquee.hidden = false;
      marquee.style.left = sx + 'px';
      marquee.style.top = sy + 'px';
      marquee.style.width = '0px';
      marquee.style.height = '0px';
      function marqueeMove(moveEvent) {
        var ex = moveEvent.clientX - canvasRect.left;
        var ey = moveEvent.clientY - canvasRect.top;
        var left = Math.min(sx, ex);
        var top = Math.min(sy, ey);
        var right = Math.max(sx, ex);
        var bottom = Math.max(sy, ey);
        marquee.style.left = left + 'px';
        marquee.style.top = top + 'px';
        marquee.style.width = (right - left) + 'px';
        marquee.style.height = (bottom - top) + 'px';
        var screenLeft = canvasRect.left + left;
        var screenTop = canvasRect.top + top;
        var screenRight = canvasRect.left + right;
        var screenBottom = canvasRect.top + bottom;
        var ids = [];
        pageEl.querySelectorAll('[data-soa-node]').forEach(function (candidate) {
          var rect = candidate.getBoundingClientRect();
          var intersects = rect.right >= screenLeft && rect.left <= screenRight && rect.bottom >= screenTop && rect.top <= screenBottom;
          var nodeId = candidate.dataset.soaNode;
          if (intersects || (additiveSelection && initialSelection.indexOf(nodeId) > -1)) ids.push(nodeId);
        });
        selectNodes(ids);
      }
      function marqueeEnd(endEvent) {
        if (Math.abs(endEvent.clientX - (canvasRect.left + sx)) <= 3 && Math.abs(endEvent.clientY - (canvasRect.top + sy)) <= 3 && !additiveSelection) selectNodes([]);
        marquee.hidden = true;
        document.removeEventListener('mousemove', marqueeMove);
        document.removeEventListener('mouseup', marqueeEnd);
      }
      document.addEventListener('mousemove', marqueeMove);
      document.addEventListener('mouseup', marqueeEnd);
    });
  }

  function bindCategoryPicker() {
    var picker = pageEl.querySelector('[data-soa-category-picker]');
    if (!picker) return;
    var pop = picker.querySelector('[data-soa-category-pop]');
    var tree = picker.querySelector('[data-soa-category-tree]');
    picker.querySelector('[data-soa-category-toggle]').addEventListener('click', function () {
      pop.hidden = !pop.hidden;
      if (!pop.hidden) picker.querySelector('[data-soa-category-search]').focus();
    });
    picker.querySelector('[data-soa-category-search]').addEventListener('input', function (event) {
      var keyword = event.target.value.trim().toLowerCase();
      var visible = 0;
      var nodes = tree.querySelectorAll('[data-name]');
      nodes.forEach(function (node) {
        var match = !keyword || node.dataset.name.toLowerCase().indexOf(keyword) > -1;
        node.style.display = match ? '' : 'none';
        if (match) visible += 1;
      });
      var matchedChild = Array.prototype.some.call(tree.querySelectorAll('.soa-category-node.child'), function (node) { return node.style.display !== 'none'; });
      if (keyword && matchedChild) {
        var parent = Array.prototype.find.call(nodes, function (node) { return node.dataset.name === '我的目录'; });
        if (parent && parent.style.display === 'none') {
          parent.style.display = '';
          visible += 1;
        }
      }
      var empty = tree.querySelector('.soa-category-empty');
      if (!visible && !empty) tree.insertAdjacentHTML('beforeend', '<div class="soa-category-empty">未找到匹配的数据分类</div>');
      if (visible && empty) empty.remove();
    });
    tree.addEventListener('click', function (event) {
      var node = event.target.closest('[data-name]');
      if (!node) return;
      picker.querySelector('[data-soa-category-value]').textContent = node.dataset.name;
      pop.hidden = true;
    });
  }

  function bindEditorEvents() {
    bindCanvasEvents();
    bindCategoryPicker();

    pageEl.querySelectorAll('[data-soa-tab]').forEach(function (tab) {
      tab.addEventListener('click', function () {
        pageEl.querySelectorAll('[data-soa-tab]').forEach(function (item) { item.classList.toggle('active', item === tab); });
        pageEl.querySelectorAll('[data-soa-panel]').forEach(function (panel) { panel.classList.toggle('active', panel.dataset.soaPanel === tab.dataset.soaTab); });
        closeProperties();
        hideContextMenu();
        if (tab.dataset.soaTab === 'design') window.setTimeout(function () { updateCanvasTransform(); redrawEdges(); renderMinimap(); }, 0);
      });
    });

    pageEl.querySelector('[data-soa-property-close]').addEventListener('click', closeProperties);
    pageEl.querySelector('[data-soa-property-backdrop]').addEventListener('click', closeProperties);

    pageEl.querySelectorAll('[data-soa-zoom]').forEach(function (button) {
      button.addEventListener('click', function () {
        var action = button.dataset.soaZoom;
        if (action === 'in') setScale(editorState.scale + .1);
        if (action === 'out') setScale(editorState.scale - .1);
        if (action === 'reset') {
          editorState.scale = 1;
          editorState.panX = 12;
          editorState.panY = 28;
          updateCanvasTransform();
        }
        if (action === 'fit') fitCanvas();
      });
    });

    pageEl.querySelector('[data-soa-minimap]').addEventListener('click', function (event) {
      var mini = event.currentTarget;
      var rect = mini.getBoundingClientRect();
      var canvas = pageEl.querySelector('[data-soa-canvas]');
      var worldX = (event.clientX - rect.left) / rect.width * editorState.worldWidth;
      var worldY = (event.clientY - rect.top) / rect.height * editorState.worldHeight;
      editorState.panX = canvas.clientWidth / 2 - worldX * editorState.scale;
      editorState.panY = canvas.clientHeight / 2 - worldY * editorState.scale;
      updateCanvasTransform();
    });

    pageEl.querySelector('[data-soa-context-menu]').addEventListener('click', function (event) {
      var button = event.target.closest('[data-soa-context-action]');
      if (!button || button.disabled) return;
      var action = button.dataset.soaContextAction;
      hideContextMenu();
      applyCanvasAction(action);
    });

    pageEl.addEventListener('click', function (event) {
      if (!event.target.closest('[data-soa-context-menu]')) hideContextMenu();
      if (!event.target.closest('[data-soa-api-picker]')) {
        var pop = pageEl.querySelector('[data-soa-api-options]');
        if (pop) pop.hidden = true;
      }
      if (!event.target.closest('[data-soa-category-picker]')) {
        var categoryPop = pageEl.querySelector('[data-soa-category-pop]');
        if (categoryPop) categoryPop.hidden = true;
      }
    });

    pageEl.querySelectorAll('[data-soa-editor-action]').forEach(function (button) {
      button.addEventListener('click', function () {
        var action = button.dataset.soaEditorAction;
        if (action === 'cancel') {
          renderList();
          return;
        }
        var nameInput = pageEl.querySelector('[data-soa-meta="name"]');
        var enNameInput = pageEl.querySelector('[data-soa-meta="enName"]');
        var descInput = pageEl.querySelector('[data-soa-meta="desc"]');
        var categoryText = pageEl.querySelector('[data-soa-category-value]').textContent.trim();
        var name = nameInput.value.trim();
        var enName = enNameInput.value.trim();
        if (!name || categoryText === '请选择') {
          pageEl.querySelector('[data-soa-tab="meta"]').click();
          toast(!name ? '请填写数据名称' : '请选择数据分类', 'warning');
          (!name ? nameInput : pageEl.querySelector('[data-soa-category-toggle]')).focus();
          return;
        }
        if (editorState.nodes.length < 2) {
          pageEl.querySelector('[data-soa-tab="design"]').click();
          toast('请至少添加一个 API 调用或判断节点', 'warning');
          return;
        }
        var nowText = '2026-09-21 11:20:00';
        if (action === 'save-as' || editorState.isNew) {
          rows.unshift({
            code: '20260921112000' + String(rows.length + 1),
            name: action === 'save-as' ? name + ' 副本' : name,
            enName: enName || 'api_orchestration_flow',
            category: categoryText.replace(' / ', '/'),
            type: 'API编排',
            version: 'V1',
            publishStatus: '开发',
            auditStatus: '',
            updateTime: nowText,
            desc: descInput.value.trim()
          });
        } else {
          editorState.row.name = name;
          editorState.row.enName = enName;
          editorState.row.desc = descInput.value.trim();
          editorState.row.updateTime = nowText;
        }
        renderList();
        toast(action === 'save-as' ? '已另存为新的 API 编排' : 'API 编排已保存', 'success');
      });
    });
  }

  function bindListEvents() {
    pageEl.querySelector('[data-soa-action="add"]').addEventListener('click', function () { renderEditor(null, true); });
    pageEl.querySelector('[data-soa-action="search"]').addEventListener('click', renderTable);
    pageEl.querySelector('[data-soa-filter="keyword"]').addEventListener('keydown', function (event) { if (event.key === 'Enter') renderTable(); });
    pageEl.querySelectorAll('[data-soa-filter="publish"], [data-soa-filter="audit"]').forEach(function (select) { select.addEventListener('change', renderTable); });

    pageEl.querySelector('[data-soa-action="deploy"]').addEventListener('click', function () {
      var count = selectedCount();
      if (!count) { toast('请先选择需要部署测试的 API 编排', 'warning'); return; }
      toast('已提交 ' + count + ' 条 API 编排进行部署测试', 'success');
    });
    pageEl.querySelector('[data-soa-action="undeploy"]').addEventListener('click', function () {
      var count = selectedCount();
      if (!count) { toast('请先选择需要取消部署的 API 编排', 'warning'); return; }
      toast('已取消 ' + count + ' 条 API 编排的测试部署', 'success');
    });

    pageEl.querySelector('[data-soa-check-all]').addEventListener('change', function (event) {
      pageEl.querySelectorAll('.soa-row-check').forEach(function (checkbox) { checkbox.checked = event.target.checked; });
    });

    pageEl.querySelector('[data-soa-table-body]').addEventListener('click', function (event) {
      var button = event.target.closest('[data-soa-row-action]');
      if (!button) return;
      var list = filteredRows();
      var row = list[Number(button.dataset.index)];
      if (!row) return;
      var action = button.dataset.soaRowAction;
      if (action === 'edit') renderEditor(row, false);
      if (action === 'test') renderTestPage(row);
      if (action === 'delete') {
        var removeRow = function () {
          rows = rows.filter(function (item) { return item !== row; });
          renderTable();
          toast('API 编排已删除', 'success');
        };
        if (DP.confirm) DP.confirm('确认删除 API 编排【' + esc(row.name) + '】吗？', { icon: 'danger', onOk: removeRow });
        else removeRow();
      }
    });

    pageEl.querySelectorAll('[data-soa-tool]').forEach(function (button) {
      button.addEventListener('click', function () {
        if (button.dataset.soaTool === '刷新') renderTable();
        toast(button.dataset.soaTool + '已触发', 'info');
      });
    });
    pageEl.querySelector('[data-soa-compact]').addEventListener('change', function (event) {
      pageEl.classList.toggle('compact-table', event.target.checked);
      pageEl.querySelector('.svc-switch-text').textContent = event.target.checked ? '开' : '关';
    });

    bindCatalogEvents(renderTable);
  }

  function bindCatalogEvents(onSelect) {
    pageEl.querySelectorAll('[data-soa-catalog-tree] .svc-tree-row').forEach(function (node) {
      node.addEventListener('click', function () {
        if (node.classList.contains('has-children')) node.classList.toggle('open');
        pageEl.querySelectorAll('[data-soa-catalog-tree] .svc-tree-row.active').forEach(function (item) { item.classList.remove('active'); });
        node.classList.add('active');
        selectedCatalog = node.dataset.catalog || '公共目录';
        if (onSelect) onSelect();
      });
    });
    pageEl.querySelector('[data-soa-catalog-search]').addEventListener('input', function (event) {
      var keyword = event.target.value.trim().toLowerCase();
      var tree = pageEl.querySelector('[data-soa-catalog-tree]');
      var rowsEls = tree.querySelectorAll('.svc-tree-row');
      rowsEls.forEach(function (node) {
        node.style.display = !keyword || node.textContent.trim().toLowerCase().indexOf(keyword) > -1 ? '' : 'none';
      });
      var children = tree.querySelector('.svc-tree-children');
      var childVisible = Array.prototype.some.call(children.querySelectorAll('.svc-tree-row'), function (node) { return node.style.display !== 'none'; });
      var parent = tree.querySelector('.svc-tree-row.has-children');
      if (keyword && childVisible) {
        parent.style.display = '';
        parent.classList.add('open');
        children.style.display = '';
      } else {
        children.style.display = '';
      }
    });
  }

  return {
    html: '<div class="page-service-api-dev page-service-api-arrange"></div>',
    init: function () {
      pageEl = document.querySelector('.page-service-api-arrange');
      if (!pageEl) return;
      selectedCatalog = '公共目录';
      renderList();
    }
  };
})();
