/**
 * 数据中台 V4.0 - 数据资产 / 数据标准管理 / 标准代码
 * 静态高保真原型：标准代码列表 + 代码值维护 + 导入导出记录
 */
window.DP = window.DP || {};
DP.pages = DP.pages || {};

DP.pages.standardCode = (function () {
  var pageEl = null;

  var state = {
    activeTab: 'list',
    mode: 'list',
    treeKey: 'business',
    treeKeyword: '',
    selectedIds: {},
    keyword: '',
    page: 1,
    pageSize: 10,
    sortKey: '',
    sortDir: 'asc',
    formMode: '',
    formId: '',
    formCategoryOpen: false,
    dataRowId: '',
    dataKeyword: '',
    dataSelected: {},
    valueModalId: '',
    datePickerOpen: false,
    ioFilters: {
      attr: '',
      status: '',
      keyword: ''
    }
  };

  var treeRows = [
    { key: 'business', label: '业务部', count: 33, icon: 'bi-archive-fill' },
    { key: 'warehouse', label: '数仓组', count: 1, icon: 'bi-archive-fill' }
  ];

  function makeValues(items) {
    return items.map(function (item) {
      return {
        code: item[0],
        name: item[1],
        desc: item[2] || '',
        property: item[3] || '国家标准',
        valid: item[4] || '有效',
        validDate: item[5] || ''
      };
    });
  }

  var standardCodeRows = [
    {
      id: 'cv0300110',
      code: 'CV03.00.110',
      name: '每年食用的食物食用频率代码表',
      dataType: '普通数据',
      desc: '',
      creator: '演示-测试',
      createdAt: '2026-04-09 18:28:13',
      recordCount: 4,
      group: 'business',
      values: makeValues([
        ['1', '每天'],
        ['2', '每周一次以上'],
        ['21', '5次/周～6次/周'],
        ['22', '3次/周～4次/周'],
        ['23', '1次/周～2次/周'],
        ['3', '偶尔'],
        ['31', '1次/月～3次/月'],
        ['32', '少于1次/月'],
        ['4', '不运动']
      ])
    },
    {
      id: 'cv0300111',
      code: 'CV03.00.111',
      name: '身体活动频率代码表',
      dataType: '普通数据',
      desc: '',
      creator: '演示-测试',
      createdAt: '2026-04-09 18:28:13',
      recordCount: 9,
      group: 'business',
      values: makeValues([
        ['1', '从不'],
        ['2', '偶尔'],
        ['3', '每月'],
        ['4', '每周'],
        ['5', '每天']
      ])
    },
    {
      id: 'cv0300112',
      code: 'CV03.00.112',
      name: '患重性精神疾病对家庭社会的影响代码表',
      dataType: '普通数据',
      desc: '',
      creator: '演示-测试',
      createdAt: '2026-04-09 18:28:13',
      recordCount: 7,
      group: 'business',
      values: makeValues([
        ['1', '无明显影响'],
        ['2', '轻度影响'],
        ['3', '中度影响'],
        ['4', '重度影响']
      ])
    },
    {
      id: 'cv0300113',
      code: 'CV03.00.113',
      name: '艾滋病接触史代码表',
      dataType: '普通数据',
      desc: '',
      creator: '演示-测试',
      createdAt: '2026-04-09 18:28:14',
      recordCount: 11,
      group: 'business',
      values: makeValues([
        ['1', '注射毒品史'],
        ['2', '非婚异性性接触史'],
        ['3', '男男性行为史'],
        ['4', '献血浆史']
      ])
    },
    {
      id: 'cv0300114',
      code: 'CV03.00.114',
      name: '每日饮水量代码表',
      dataType: '普通数据',
      desc: '',
      creator: '演示-测试',
      createdAt: '2026-04-09 18:28:14',
      recordCount: 4,
      group: 'business',
      values: makeValues([
        ['1', '不足500ml'],
        ['2', '500ml～1000ml'],
        ['3', '1000ml～1500ml'],
        ['4', '1500ml以上']
      ])
    },
    {
      id: 'cv0300115',
      code: 'CV03.00.115',
      name: '饮水类别代码表',
      dataType: '普通数据',
      desc: '',
      creator: '演示-测试',
      createdAt: '2026-04-09 18:28:14',
      recordCount: 6,
      group: 'business',
      values: makeValues([
        ['1', '白开水'],
        ['2', '茶水'],
        ['3', '纯净水'],
        ['4', '矿泉水'],
        ['5', '含糖饮料'],
        ['9', '其他']
      ])
    },
    {
      id: 'cv0300116',
      code: 'CV03.00.116',
      name: '个人不良行为接触史代码表',
      dataType: '普通数据',
      desc: '',
      creator: '演示-测试',
      createdAt: '2026-04-09 18:28:15',
      recordCount: 7,
      group: 'business',
      values: makeValues([
        ['1', '吸烟'],
        ['2', '饮酒'],
        ['3', '熬夜'],
        ['4', '久坐'],
        ['9', '其他']
      ])
    },
    {
      id: 'cv0300201',
      code: 'CV03.00.201',
      name: '职业照射种类代码表',
      dataType: '普通数据',
      desc: '',
      creator: '演示-测试',
      createdAt: '2026-04-09 18:28:15',
      recordCount: 35,
      group: 'business',
      values: makeValues([
        ['01', '外照射'],
        ['02', '内照射'],
        ['03', '混合照射']
      ])
    },
    {
      id: 'cv0300202',
      code: 'CV03.00.202',
      name: '受照原因代码表',
      dataType: '普通数据',
      desc: '',
      creator: '演示-测试',
      createdAt: '2026-04-09 18:28:17',
      recordCount: 13,
      group: 'business',
      values: makeValues([
        ['1', '职业受照'],
        ['2', '医疗受照'],
        ['3', '公众受照']
      ])
    },
    {
      id: 'cv0300203',
      code: 'CV03.00.203',
      name: '职业病危害因素类别代码表',
      dataType: '普通数据',
      desc: '',
      creator: '演示-测试',
      createdAt: '2026-04-09 18:28:18',
      recordCount: 111,
      group: 'business',
      values: makeValues([
        ['1', '粉尘'],
        ['2', '化学因素'],
        ['3', '物理因素'],
        ['4', '放射性因素']
      ])
    },
    {
      id: 'cv0201101',
      code: 'CV02.01.101',
      name: '身份证件类别代码表',
      dataType: '普通数据',
      desc: '用于人员主数据、客户档案和实名认证场景。',
      creator: '演示-测试',
      createdAt: '2026-04-09 18:28:02',
      recordCount: 8,
      group: 'business',
      values: makeValues([
        ['01', '居民身份证'],
        ['02', '居民户口簿'],
        ['03', '护照'],
        ['04', '军官证'],
        ['05', '驾驶证'],
        ['06', '港澳居民来往内地通行证'],
        ['07', '台湾居民来往内地通行证'],
        ['99', '其他法定有效证件']
      ])
    },
    {
      id: 'cv0201102',
      code: 'CV02.01.102',
      name: '出生(分娩)地点类别代码表',
      dataType: '普通数据',
      desc: '',
      creator: '演示-测试',
      createdAt: '2026-04-09 18:28:02',
      recordCount: 9,
      group: 'business',
      values: makeValues([
        ['1', '医院'],
        ['2', '妇幼保健院'],
        ['3', '家庭'],
        ['9', '其他']
      ])
    },
    {
      id: 'cv0201103',
      code: 'CV02.01.103',
      name: '死亡地点类别代码表',
      dataType: '普通数据',
      desc: '',
      creator: '演示-测试',
      createdAt: '2026-04-09 18:28:03',
      recordCount: 8,
      group: 'business',
      values: makeValues([
        ['1', '医疗卫生机构'],
        ['2', '来院途中'],
        ['3', '家中'],
        ['9', '其他']
      ])
    },
    {
      id: 'cv0400101',
      code: 'CV04.00.101',
      name: '行政区划层级代码表',
      dataType: '多级数据',
      desc: '用于标准区域层级维护。',
      creator: '演示-测试',
      createdAt: '2026-04-09 18:30:21',
      recordCount: 1,
      group: 'warehouse',
      values: makeValues([
        ['000000', '全国', '国家级根节点']
      ])
    }
  ];

  var additionalNames = [
    '婚姻状况代码表',
    '文化程度代码表',
    '民族类别代码表',
    '职业类别代码表',
    '血型代码表',
    '医疗付费方式代码表',
    '过敏史代码表',
    '既往疾病史代码表',
    '家族史代码表',
    '残疾情况代码表',
    '药物使用频次代码表',
    '就诊类型代码表',
    '检查结果代码表',
    '随访方式代码表',
    '危险因素代码表',
    '健康评价结果代码表',
    '干预措施代码表',
    '治疗依从性代码表',
    '服务机构类型代码表',
    '公共卫生事件类别代码表'
  ];

  additionalNames.forEach(function (name, index) {
    var no = String(301 + index).padStart(3, '0');
    standardCodeRows.push({
      id: 'cv0300' + no,
      code: 'CV03.00.' + no,
      name: name,
      dataType: index % 7 === 0 ? '多级数据' : '普通数据',
      desc: '',
      creator: '演示-测试',
      createdAt: '2026-04-09 18:' + String(29 + Math.floor(index / 2)).padStart(2, '0') + ':' + String(10 + index).padStart(2, '0'),
      recordCount: [4, 6, 7, 9, 11, 13, 18][index % 7],
      group: 'business',
      values: makeValues([
        ['1', '是'],
        ['2', '否'],
        ['9', '不详']
      ])
    });
  });

  var ioRows = [
    { id: 'io-1', fileName: '标准代码导入模板.xls', attr: '导入', status: '处理完成', success: 399, fail: 0, total: 399, operator: '演示-测试', time: '2026-04-09 18:00:45' },
    { id: 'io-2', fileName: '数据标准导入模板.xls', attr: '导入', status: '处理失败', success: 0, fail: 30, total: 30, operator: '演示-测试', time: '2026-04-09 17:57:49' },
    { id: 'io-3', fileName: '数据标准导入模板.xls', attr: '导入', status: '处理失败', success: 0, fail: 30, total: 30, operator: '演示-测试', time: '2026-04-09 17:55:35' },
    { id: 'io-4', fileName: '数据标准导入模板.xls', attr: '导入', status: '处理失败', success: 0, fail: 30, total: 30, operator: '演示-测试', time: '2026-04-09 17:54:54' },
    { id: 'io-5', fileName: '数据标准导入模板.xls', attr: '导入', status: '处理失败', success: 0, fail: 30, total: 30, operator: '演示-测试', time: '2026-04-09 17:52:55' }
  ];

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function normalize(value) {
    return String(value || '').trim().toLowerCase();
  }

  function nowText() {
    return '2026-06-17 16:20:00';
  }

  function getRowById(id) {
    return standardCodeRows.filter(function (item) { return String(item.id) === String(id); })[0] || null;
  }

  function getCurrentDataRow() {
    return getRowById(state.dataRowId) || standardCodeRows[0];
  }

  function getSelectedRows() {
    return Object.keys(state.selectedIds).map(getRowById).filter(Boolean);
  }

  function getFilteredRows() {
    var keyword = normalize(state.keyword);
    var rows = standardCodeRows.filter(function (item) {
      if (state.treeKey && item.group !== state.treeKey) return false;
      if (!keyword) return true;
      return normalize([item.code, item.name, item.dataType, item.desc].join(' ')).indexOf(keyword) >= 0;
    });

    if (!state.sortKey) return rows;
    return rows.slice().sort(function (a, b) {
      var av = String(a[state.sortKey] == null ? '' : a[state.sortKey]);
      var bv = String(b[state.sortKey] == null ? '' : b[state.sortKey]);
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

  function getFilteredValues(item) {
    var keyword = normalize(state.dataKeyword);
    return (item.values || []).filter(function (value) {
      if (!keyword) return true;
      return normalize([value.code, value.name, value.desc, value.property, value.valid].join(' ')).indexOf(keyword) >= 0;
    });
  }

  function getIoRows() {
    var keyword = normalize(state.ioFilters.keyword);
    return ioRows.filter(function (item) {
      if (state.ioFilters.attr && item.attr !== state.ioFilters.attr) return false;
      if (state.ioFilters.status && item.status !== state.ioFilters.status) return false;
      if (!keyword) return true;
      return normalize(item.fileName).indexOf(keyword) >= 0;
    });
  }

  function showToast(text) {
    if (!pageEl) return;
    var old = pageEl.querySelector('.bc-toast');
    if (old) old.remove();
    var toast = document.createElement('div');
    toast.className = 'bc-toast';
    toast.innerHTML = '<i class="bi bi-check-circle"></i><span>' + escapeHtml(text) + '</span>';
    pageEl.appendChild(toast);
    setTimeout(function () { toast.classList.add('show'); }, 10);
    setTimeout(function () {
      toast.classList.remove('show');
      setTimeout(function () { if (toast.parentNode) toast.remove(); }, 180);
    }, 1800);
  }

  function confirmAndRun(message, icon, fn) {
    if (DP.confirm) {
      DP.confirm(message, { icon: icon || 'info', onOk: fn });
    } else {
      fn();
    }
  }

  function updateModeClasses() {
    if (!pageEl) return;
    pageEl.classList.toggle('sc-form-mode', state.mode === 'form');
    pageEl.classList.toggle('sc-data-mode', state.mode === 'data');
  }

  function sortHeader(key, label) {
    return '<button class="bc-th-sort" type="button" data-sc-sort="' + key + '">' +
      '<span>' + label + '</span>' +
      '<span class="bc-sort-stack"><i class="bi bi-caret-up-fill"></i><i class="bi bi-caret-down-fill"></i></span>' +
    '</button>';
  }

  function renderTree() {
    var keyword = normalize(state.treeKeyword);
    return treeRows.filter(function (item) {
      return !keyword || normalize(item.label + ' ' + item.count).indexOf(keyword) >= 0;
    }).map(function (item) {
      return '<li class="bc-tree-node">' +
        '<button class="bc-tree-row' + (state.treeKey === item.key ? ' active' : '') + '" type="button" data-sc-tree="' + item.key + '">' +
          '<i class="bi ' + item.icon + ' bc-tree-icon"></i>' +
          '<span class="bc-tree-name">' + escapeHtml(item.label) + ' (' + item.count + ')</span>' +
        '</button>' +
      '</li>';
    }).join('') || '<li class="bc-empty-tree">暂无匹配分类</li>';
  }

  function renderTabs() {
    return '<div class="bc-tabs">' +
      '<button class="bc-tab' + (state.activeTab === 'list' ? ' active' : '') + '" type="button" data-sc-tab="list">数据列表</button>' +
      '<button class="bc-tab' + (state.activeTab === 'io' ? ' active' : '') + '" type="button" data-sc-tab="io">导入导出</button>' +
    '</div>';
  }

  function renderListView() {
    var visibleRows = getVisibleRows();
    return renderTabs() +
      '<div class="bc-panel active">' +
        '<div class="bc-toolbar">' +
          '<div class="bc-toolbar-left">' +
            '<button class="btn btn-primary" type="button" data-sc-action="new"><i class="bi bi-plus-lg"></i><span>新建</span></button>' +
            '<button class="btn btn-danger" type="button" data-sc-action="delete-selected"><i class="bi bi-trash3"></i><span>删除</span></button>' +
            '<button class="btn btn-primary" type="button" data-sc-action="import"><i class="bi bi-upload"></i><span>导入</span></button>' +
            '<button class="btn btn-primary" type="button" data-sc-action="export"><i class="bi bi-download"></i><span>导出</span></button>' +
          '</div>' +
          '<div class="bc-toolbar-right">' +
            '<div class="bc-query-box"><input id="scKeywordInput" type="text" value="' + escapeHtml(state.keyword) + '" placeholder="编码/名称" aria-label="编码或名称"><button class="btn btn-primary" type="button" data-sc-action="query"><i class="bi bi-search"></i><span>查询</span></button></div>' +
          '</div>' +
        '</div>' +
        '<div class="bc-table-wrap sc-list-table-wrap">' +
          '<table class="bc-table sc-list-table">' +
            '<colgroup><col class="sc-w-check"><col class="sc-w-code"><col class="sc-w-name"><col class="sc-w-type"><col class="sc-w-desc"><col class="sc-w-user"><col class="sc-w-time"><col class="sc-w-count"><col class="sc-w-action"></colgroup>' +
            '<thead><tr>' +
              '<th class="bc-col-check"><input type="checkbox" data-sc-check-all aria-label="全选"></th>' +
              '<th>' + sortHeader('code', '编码') + '</th>' +
              '<th>' + sortHeader('name', '名称') + '</th>' +
              '<th>' + sortHeader('dataType', '数据类型') + '</th>' +
              '<th>' + sortHeader('desc', '描述') + '</th>' +
              '<th>' + sortHeader('creator', '创建人') + '</th>' +
              '<th>' + sortHeader('createdAt', '创建时间') + '</th>' +
              '<th>' + sortHeader('recordCount', '记录数') + '</th>' +
              '<th>操作</th>' +
            '</tr></thead>' +
            '<tbody>' + (visibleRows.length ? visibleRows.map(renderListRow).join('') : '<tr class="bc-empty-row"><td colspan="9">暂无匹配的标准代码</td></tr>') + '</tbody>' +
          '</table>' +
        '</div>' +
        renderPagination() +
      '</div>';
  }

  function renderListRow(item) {
    return '<tr>' +
      '<td class="bc-col-check"><input type="checkbox" data-sc-row-check="' + escapeHtml(item.id) + '"' + (state.selectedIds[item.id] ? ' checked' : '') + ' aria-label="选择标准代码"></td>' +
      '<td title="' + escapeHtml(item.code) + '">' + escapeHtml(item.code) + '</td>' +
      '<td title="' + escapeHtml(item.name) + '">' + escapeHtml(item.name) + '</td>' +
      '<td>' + escapeHtml(item.dataType) + '</td>' +
      '<td title="' + escapeHtml(item.desc) + '">' + escapeHtml(item.desc) + '</td>' +
      '<td>' + escapeHtml(item.creator) + '</td>' +
      '<td>' + escapeHtml(item.createdAt) + '</td>' +
      '<td>' + escapeHtml(item.recordCount) + '</td>' +
      '<td><div class="bc-actions">' +
        '<button class="bc-op-btn" type="button" data-sc-action="edit" data-id="' + escapeHtml(item.id) + '"><i class="bi bi-pencil-square"></i><span>编辑</span></button>' +
        '<button class="bc-op-btn bc-op-data" type="button" data-sc-action="open-data" data-id="' + escapeHtml(item.id) + '"><i class="bi bi-table"></i><span>数据</span></button>' +
        '<button class="bc-op-btn bc-op-danger" type="button" data-sc-action="delete-row" data-id="' + escapeHtml(item.id) + '"><i class="bi bi-trash3"></i><span>删除</span></button>' +
      '</div></td>' +
    '</tr>';
  }

  function renderPagination() {
    var rows = getFilteredRows();
    var total = rows.length;
    var totalPages = Math.max(1, Math.ceil(total / state.pageSize));
    var start = total ? (state.page - 1) * state.pageSize + 1 : 0;
    var end = Math.min(total, state.page * state.pageSize);
    var nums = [];
    for (var i = 1; i <= totalPages; i++) {
      nums.push('<button class="sc-page-num' + (i === state.page ? ' active' : '') + '" type="button" data-sc-page="' + i + '">' + i + '</button>');
    }
    return '<div class="bc-pagination sc-pagination">' +
      '<div class="sc-page-info">显示第 ' + start + ' 到第 ' + end + ' 条记录，总共 ' + total + ' 条记录 每页显示 <select data-sc-page-size><option value="10"' + (state.pageSize === 10 ? ' selected' : '') + '>10</option><option value="20"' + (state.pageSize === 20 ? ' selected' : '') + '>20</option></select> 条记录</div>' +
      '<div class="sc-page-nav">' +
        '<button type="button" data-sc-page="prev" ' + (state.page === 1 ? 'disabled' : '') + '>‹</button>' +
        nums.join('') +
        '<button type="button" data-sc-page="next" ' + (state.page === totalPages ? 'disabled' : '') + '>›</button>' +
        '<input class="sc-page-jump" type="text" value="' + state.page + '" aria-label="页码">' +
        '<button type="button" data-sc-action="page-go">GO</button>' +
      '</div>' +
    '</div>';
  }

  function renderIoView() {
    var rows = getIoRows();
    return renderTabs() +
      '<div class="bc-panel active">' +
        '<div class="bc-log-filter sc-io-filter">' +
          '<select data-sc-io-filter="attr" aria-label="属性"><option value="">属性</option><option value="导入">导入</option><option value="导出">导出</option></select>' +
          '<select data-sc-io-filter="status" aria-label="状态"><option value="">状态</option><option value="处理完成">处理完成</option><option value="处理失败">处理失败</option><option value="处理中">处理中</option></select>' +
          '<div class="bc-query-box"><input type="text" data-sc-io-keyword value="' + escapeHtml(state.ioFilters.keyword) + '" placeholder="文件名" aria-label="文件名"><button class="btn btn-primary" type="button" data-sc-action="query-io"><i class="bi bi-search"></i><span>查询</span></button></div>' +
        '</div>' +
        '<div class="bc-table-wrap sc-io-table-wrap">' +
          '<table class="bc-table sc-io-table">' +
            '<colgroup><col class="sc-io-file"><col class="sc-io-attr"><col class="sc-io-status"><col class="sc-io-count"><col class="sc-io-user"><col class="sc-io-time"><col class="sc-io-action"></colgroup>' +
            '<thead><tr><th>文件名</th><th>属性</th><th>状态</th><th>处理记录数(成功/失败/总量)</th><th>操作者</th><th>时间</th><th>操作</th></tr></thead>' +
            '<tbody>' + (rows.length ? rows.map(renderIoRow).join('') : '<tr class="bc-empty-row"><td colspan="7">暂无导入导出记录</td></tr>') + '</tbody>' +
          '</table>' +
        '</div>' +
        '<div class="bc-pagination">显示第 1 到第 ' + rows.length + ' 条记录，总共 ' + rows.length + ' 条记录</div>' +
      '</div>';
  }

  function renderIoRow(item) {
    var statusClass = item.status === '处理完成' ? 'success' : (item.status === '处理失败' ? 'failed' : 'running');
    return '<tr>' +
      '<td title="' + escapeHtml(item.fileName) + '">' + escapeHtml(item.fileName) + '</td>' +
      '<td><span class="sc-link-text">' + escapeHtml(item.attr) + '</span></td>' +
      '<td><span class="sc-io-status ' + statusClass + '">' + escapeHtml(item.status) + '</span></td>' +
      '<td><span class="bc-count-success">' + item.success + '</span>/<span class="bc-count-fail">' + item.fail + '</span>/' + item.total + '</td>' +
      '<td>' + escapeHtml(item.operator) + '</td>' +
      '<td>' + escapeHtml(item.time) + '</td>' +
      '<td><div class="sc-text-actions"><button type="button" data-sc-action="download-file" data-id="' + escapeHtml(item.id) + '">下载文件</button>' + (item.fail ? '<button class="danger" type="button" data-sc-action="view-log" data-id="' + escapeHtml(item.id) + '">查看日志</button>' : '') + '</div></td>' +
    '</tr>';
  }

  function renderFormView() {
    var item = getRowById(state.formId);
    var isEdit = state.formMode === 'edit' && item;
    var code = isEdit ? item.code : '';
    var name = isEdit ? item.name : '';
    var category = isEdit && item.group === 'warehouse' ? '数仓组' : '业务部';
    var dataType = isEdit ? item.dataType : '普通数据';
    var desc = isEdit ? item.desc : '';
    return '<section class="bc-editor-panel sc-editor-panel">' +
      '<div class="bc-editor-head"><h2><i class="bi bi-list"></i>' + (isEdit ? '编辑' : '新建') + '</h2><button class="bc-return-btn" type="button" data-sc-action="back-list"><i class="bi bi-arrow-left"></i><span>返回</span></button></div>' +
      '<div class="bc-editor-scroll">' +
        '<form class="bc-editor-form sc-standard-form" data-sc-form>' +
          renderFormRow('编码', '<input data-sc-form-field="code" type="text" value="' + escapeHtml(code) + '" placeholder="长度不超过50个字符">', '<i class="bi bi-check-circle-fill"></i><span>50个字符以内</span>') +
          renderFormRow('名称', '<input data-sc-form-field="name" type="text" value="' + escapeHtml(name) + '" placeholder="长度不超过50个字符，允许数字/字母/汉字/下划线，下划线不能开头!">', '<i class="bi bi-check-circle-fill"></i><span>50个字符以内</span>') +
          renderFormRow('数据分类', renderCategoryPicker(category), '') +
          renderFormRow('规则类型', '<select data-sc-form-field="dataType"><option value="普通数据"' + (dataType === '普通数据' ? ' selected' : '') + '>普通数据</option><option value="多级数据"' + (dataType === '多级数据' ? ' selected' : '') + '>多级数据</option></select>', '') +
          renderFormRow('描述', '<textarea data-sc-form-field="desc" placeholder="长度不超过500个字符">' + escapeHtml(desc) + '</textarea>', '<i class="bi bi-check-circle-fill"></i><span>500个字符以内</span>', true) +
          '<div class="bc-editor-actions sc-editor-actions"><button class="btn btn-primary" type="button" data-sc-action="save-form"><i class="bi bi-check-lg"></i><span>保存</span></button><button class="btn btn-outline" type="button" data-sc-action="cancel-form"><i class="bi bi-x-lg"></i><span>取消</span></button></div>' +
        '</form>' +
      '</div>' +
    '</section>';
  }

  function renderFormRow(label, control, hint, isArea) {
    return '<div class="bc-editor-row' + (isArea ? ' sc-editor-row-area' : '') + '">' +
      '<label><span>*</span>' + label + '</label>' +
      '<div class="bc-editor-control">' + control + '</div>' +
      '<div class="bc-editor-hint">' + (hint || '') + '</div>' +
    '</div>';
  }

  function renderCategoryPicker(category) {
    return '<div class="sc-category-picker' + (state.formCategoryOpen ? ' open' : '') + '">' +
      '<button class="sc-category-trigger" type="button" data-sc-action="toggle-category"><span data-sc-category-text>' + escapeHtml(category || '') + '</span><i class="bi bi-diagram-3"></i></button>' +
      '<div class="sc-category-menu">' +
        '<button type="button" data-sc-action="choose-category" data-value="业务部"><i class="bi bi-archive-fill"></i><span>业务部</span></button>' +
        '<button type="button" data-sc-action="choose-category" data-value="数仓组"><i class="bi bi-archive-fill"></i><span>数仓组</span></button>' +
      '</div>' +
      '<input type="hidden" data-sc-form-field="group" value="' + (category === '数仓组' ? 'warehouse' : 'business') + '">' +
    '</div>';
  }

  function renderDataView() {
    var item = getCurrentDataRow();
    var values = getFilteredValues(item);
    return '<section class="bc-data-page sc-data-page-view">' +
      '<div class="bc-data-page-toolbar sc-data-toolbar">' +
        '<div class="bc-data-page-actions">' +
          '<button class="btn btn-primary" type="button" data-sc-action="value-new"><i class="bi bi-plus-lg"></i><span>新建</span></button>' +
          '<button class="btn btn-primary" type="button" data-sc-action="value-edit-selected"><i class="bi bi-pencil-square"></i><span>编辑</span></button>' +
          '<button class="btn btn-primary" type="button" data-sc-action="import-data"><i class="bi bi-upload"></i><span>导入</span></button>' +
          '<button class="btn btn-primary" type="button" data-sc-action="export-data"><i class="bi bi-download"></i><span>导出</span></button>' +
          '<button class="btn btn-danger" type="button" data-sc-action="value-delete-selected"><i class="bi bi-trash3"></i><span>删除</span></button>' +
        '</div>' +
        '<div class="bc-data-page-query bc-query-box">' +
          '<input id="scDataKeyword" type="text" value="' + escapeHtml(state.dataKeyword) + '" placeholder="编码/名称" aria-label="编码或名称">' +
          '<button class="btn btn-primary" type="button" data-sc-action="query-data"><i class="bi bi-search"></i><span>查询</span></button>' +
          '<button class="btn btn-primary" type="button" data-sc-action="back-list"><i class="bi bi-arrow-left"></i><span>返回</span></button>' +
        '</div>' +
      '</div>' +
      '<div class="bc-data-page-table-wrap sc-value-table-wrap">' +
        '<table class="bc-data-page-table sc-value-table">' +
          '<colgroup><col class="sc-v-check"><col class="sc-v-code"><col class="sc-v-name"><col class="sc-v-desc"><col class="sc-v-property"><col class="sc-v-valid"><col class="sc-v-date"><col class="sc-v-action"></colgroup>' +
          '<thead><tr><th class="bc-data-check"><input type="checkbox" data-sc-value-check-all aria-label="全选"></th><th>编码 <i class="bi bi-caret-up-fill sc-sort-mark"></i></th><th>名称 <i class="bi bi-caret-down-fill sc-sort-mark"></i></th><th>描述 <i class="bi bi-caret-down-fill sc-sort-mark"></i></th><th>代码属性 <i class="bi bi-caret-down-fill sc-sort-mark"></i></th><th>是否有效 <i class="bi bi-caret-down-fill sc-sort-mark"></i></th><th>有效日期 <i class="bi bi-caret-down-fill sc-sort-mark"></i></th><th>操作</th></tr></thead>' +
          '<tbody>' + (values.length ? values.map(renderValueRow).join('') : '<tr class="bc-empty-row"><td colspan="8">暂无匹配的代码值</td></tr>') + '</tbody>' +
        '</table>' +
      '</div>' +
      '<div class="bc-data-page-pagination">显示第 1 到第 ' + values.length + ' 条记录，总共 ' + values.length + ' 条记录</div>' +
    '</section>';
  }

  function renderValueRow(value) {
    return '<tr>' +
      '<td class="bc-data-check"><input type="checkbox" data-sc-value-check="' + escapeHtml(value.code) + '"' + (state.dataSelected[value.code] ? ' checked' : '') + ' aria-label="选择代码值"></td>' +
      '<td title="' + escapeHtml(value.code) + '">' + escapeHtml(value.code) + '</td>' +
      '<td title="' + escapeHtml(value.name) + '">' + escapeHtml(value.name) + '</td>' +
      '<td title="' + escapeHtml(value.desc) + '">' + escapeHtml(value.desc) + '</td>' +
      '<td>' + escapeHtml(value.property) + '</td>' +
      '<td>' + escapeHtml(value.valid) + '</td>' +
      '<td>' + escapeHtml(value.validDate) + '</td>' +
      '<td><div class="sc-icon-actions"><button type="button" data-sc-action="value-edit" data-id="' + escapeHtml(value.code) + '" title="编辑"><i class="bi bi-pencil-square"></i></button><button class="danger" type="button" data-sc-action="value-delete" data-id="' + escapeHtml(value.code) + '" title="删除"><i class="bi bi-trash3"></i></button></div></td>' +
    '</tr>';
  }

  function renderMain() {
    updateModeClasses();
    var main = pageEl.querySelector('[data-sc-view]');
    if (!main) return;
    if (state.mode === 'form') {
      main.innerHTML = renderFormView();
    } else if (state.mode === 'data') {
      main.innerHTML = renderDataView();
    } else {
      main.innerHTML = state.activeTab === 'io' ? renderIoView() : renderListView();
    }
    syncControls();
  }

  function syncControls() {
    pageEl.querySelectorAll('[data-sc-sort]').forEach(function (button) {
      var key = button.getAttribute('data-sc-sort');
      if (key === state.sortKey) button.setAttribute('data-sort-dir', state.sortDir);
      else button.removeAttribute('data-sort-dir');
    });

    var checkAll = pageEl.querySelector('[data-sc-check-all]');
    if (checkAll) {
      var visible = getVisibleRows();
      var checked = visible.filter(function (item) { return state.selectedIds[item.id]; }).length;
      checkAll.checked = visible.length > 0 && checked === visible.length;
      checkAll.indeterminate = checked > 0 && checked < visible.length;
    }

    Object.keys(state.ioFilters).forEach(function (key) {
      var control = pageEl.querySelector('[data-sc-io-filter="' + key + '"]');
      if (control) control.value = state.ioFilters[key];
    });

    var valueAll = pageEl.querySelector('[data-sc-value-check-all]');
    if (valueAll && state.mode === 'data') {
      var values = getFilteredValues(getCurrentDataRow());
      var valueChecked = values.filter(function (item) { return state.dataSelected[item.code]; }).length;
      valueAll.checked = values.length > 0 && valueChecked === values.length;
      valueAll.indeterminate = valueChecked > 0 && valueChecked < values.length;
    }
  }

  function renderAll() {
    var tree = pageEl.querySelector('[data-sc-tree]');
    if (tree) tree.innerHTML = renderTree();
    renderMain();
  }

  function openForm(mode, id) {
    state.mode = 'form';
    state.formMode = mode;
    state.formId = id || '';
    state.formCategoryOpen = false;
    renderMain();
  }

  function closeForm() {
    state.mode = 'list';
    state.formMode = '';
    state.formId = '';
    state.formCategoryOpen = false;
    renderAll();
  }

  function saveForm() {
    var form = pageEl.querySelector('[data-sc-form]');
    if (!form) return;
    var values = {};
    form.querySelectorAll('[data-sc-form-field]').forEach(function (control) {
      values[control.getAttribute('data-sc-form-field')] = control.value.trim();
    });
    if (!values.code || !values.name) {
      showToast('请填写编码和名称');
      return;
    }

    if (state.formMode === 'edit') {
      var editRow = getRowById(state.formId);
      if (editRow) {
        editRow.code = values.code;
        editRow.name = values.name;
        editRow.group = values.group || 'business';
        editRow.dataType = values.dataType || '普通数据';
        editRow.desc = values.desc || '';
      }
    } else {
      standardCodeRows.unshift({
        id: 'sc-' + Date.now(),
        code: values.code,
        name: values.name,
        dataType: values.dataType || '普通数据',
        desc: values.desc || '',
        creator: '演示-测试',
        createdAt: nowText(),
        recordCount: 0,
        group: values.group || 'business',
        values: []
      });
    }
    closeForm();
    showToast('标准代码已保存');
  }

  function deleteRows(ids) {
    if (!ids.length) {
      showToast('请先选择需要删除的标准代码');
      return;
    }
    confirmAndRun('确认删除选中的 <b>' + ids.length + '</b> 条标准代码吗？', 'danger', function () {
      standardCodeRows = standardCodeRows.filter(function (item) { return ids.indexOf(String(item.id)) < 0; });
      state.selectedIds = {};
      renderAll();
      showToast('标准代码已删除');
    });
  }

  function openDataPage(id) {
    state.mode = 'data';
    state.dataRowId = id || state.dataRowId || standardCodeRows[0].id;
    state.dataKeyword = '';
    state.dataSelected = {};
    renderAll();
  }

  function backToList() {
    state.mode = 'list';
    state.formMode = '';
    state.formId = '';
    state.dataRowId = '';
    state.dataSelected = {};
    state.datePickerOpen = false;
    renderAll();
  }

  function openImportModal(type) {
    closeModal();
    var modal = document.createElement('div');
    modal.className = 'bc-modal-mask sc-modal-mask';
    modal.setAttribute('data-sc-modal', 'import');
    var isData = type === 'data';
    modal.innerHTML =
      '<div class="bc-modal sc-import-modal" role="dialog" aria-modal="true" aria-label="导入">' +
        '<div class="bc-modal-head sc-modal-head"><h3>导入</h3><button class="bc-modal-close" type="button" data-sc-action="close-modal" aria-label="关闭"><i class="bi bi-x-lg"></i></button></div>' +
        '<div class="bc-modal-body sc-import-body">' +
          '<div class="bc-import-row sc-import-row">' +
            '<label><span>*</span>覆盖机制</label>' +
            '<div class="bc-import-control"><select id="scImportMode"><option>重复覆盖</option><option>重复跳过</option></select></div>' +
            '<button class="bc-import-template" type="button" data-sc-action="download-template"><i class="bi bi-download"></i><span>下载模板</span></button>' +
          '</div>' +
          '<div class="bc-import-row sc-import-row">' +
            '<label><span>*</span>上传文件</label>' +
            '<div class="bc-import-control"><input id="scImportFile" type="file" accept=".xls,.xlsx"></div>' +
            '<div class="bc-import-tip"><i class="bi bi-info-circle-fill"></i><span>文件格式为excel，大小不超过50M</span></div>' +
          '</div>' +
        '</div>' +
        '<div class="bc-modal-footer sc-import-footer"><button class="btn btn-primary" type="button" data-sc-action="' + (isData ? 'save-data-import' : 'save-import') + '"><i class="bi bi-check-lg"></i><span>保存</span></button><button class="btn btn-outline" type="button" data-sc-action="close-modal"><i class="bi bi-x-lg"></i><span>取消</span></button></div>' +
      '</div>';
    pageEl.appendChild(modal);
  }

  function closeModal(keepState) {
    var modal = pageEl.querySelector('[data-sc-modal]');
    if (modal) modal.remove();
    if (!keepState) {
      state.valueModalId = '';
      state.datePickerOpen = false;
    }
  }

  function addIoLog(fileName, status, success, fail, total) {
    ioRows.unshift({
      id: 'io-' + Date.now(),
      fileName: fileName,
      attr: '导入',
      status: status,
      success: success,
      fail: fail,
      total: total,
      operator: '演示-测试',
      time: nowText()
    });
  }

  function saveImport(type) {
    var importFile = pageEl.querySelector('#scImportFile');
    var fileName = importFile && importFile.files && importFile.files.length ? importFile.files[0].name : (type === 'data' ? '标准代码数据导入模板.xls' : '标准代码导入模板.xls');
    addIoLog(fileName, '处理完成', type === 'data' ? 8 : 399, 0, type === 'data' ? 8 : 399);
    closeModal();
    if (type === 'list') {
      state.activeTab = 'io';
      renderMain();
    }
    showToast('导入任务已创建');
  }

  function addExportLog() {
    ioRows.unshift({
      id: 'io-' + Date.now(),
      fileName: '标准代码导出-' + nowText().slice(0, 10).replace(/-/g, '') + '.xls',
      attr: '导出',
      status: '处理完成',
      success: getFilteredRows().length,
      fail: 0,
      total: getFilteredRows().length,
      operator: '演示-测试',
      time: nowText()
    });
    showToast('导出文件已生成');
  }

  function openValueModal(code) {
    closeModal();
    var item = getCurrentDataRow();
    var value = (item.values || []).filter(function (row) { return row.code === code; })[0] || {
      code: '',
      name: '',
      property: '国家标准',
      validDate: '',
      desc: ''
    };
    state.valueModalId = code || '';
    state.datePickerOpen = false;
    var modal = document.createElement('div');
    modal.className = 'bc-modal-mask sc-modal-mask';
    modal.setAttribute('data-sc-modal', 'value');
    modal.innerHTML =
      '<div class="bc-modal sc-value-modal" role="dialog" aria-modal="true" aria-label="修改">' +
        '<div class="bc-modal-head sc-modal-head"><h3>' + (code ? '修改' : '新建') + '</h3><button class="bc-modal-close" type="button" data-sc-action="close-modal" aria-label="关闭"><i class="bi bi-x-lg"></i></button></div>' +
        '<div class="bc-modal-body sc-value-body" data-sc-value-form>' +
          renderValueFormRow('编码', '<input data-sc-value-field="code" type="text" value="' + escapeHtml(value.code) + '" placeholder="长度不超过50个字符">', '<i class="bi bi-check-circle-fill"></i><span>50个字符以内</span>') +
          renderValueFormRow('名称', '<input data-sc-value-field="name" type="text" value="' + escapeHtml(value.name) + '" placeholder="长度不超过50个字符">', '<i class="bi bi-check-circle-fill"></i><span>50个字符以内</span>') +
          renderValueFormRow('代码属性', '<select data-sc-value-field="property"><option' + (value.property === '国家标准' ? ' selected' : '') + '>国家标准</option><option' + (value.property === '自建标准' ? ' selected' : '') + '>自建标准</option><option' + (value.property === '行业标准' ? ' selected' : '') + '>行业标准</option><option' + (value.property === '企业实践' ? ' selected' : '') + '>企业实践</option><option' + (value.property === '企业标准' ? ' selected' : '') + '>企业标准</option><option' + (value.property === '国际标准' ? ' selected' : '') + '>国际标准</option></select>', '') +
          renderValueFormRow('有效期', '<div class="sc-date-control"><input data-sc-value-field="validDate" type="text" value="' + escapeHtml(value.validDate) + '" data-sc-action="toggle-date" readonly>' + renderDatePicker() + '</div>', '') +
          renderValueFormRow('描述', '<textarea data-sc-value-field="desc" placeholder="长度不超过100个字符!">' + escapeHtml(value.desc) + '</textarea>', '<i class="bi bi-check-circle-fill"></i><span>100个字符以内</span>', true) +
        '</div>' +
        '<div class="bc-modal-footer sc-value-footer"><button class="btn btn-primary" type="button" data-sc-action="save-value"><i class="bi bi-check-lg"></i><span>保存</span></button><button class="btn btn-outline" type="button" data-sc-action="close-modal"><i class="bi bi-x-lg"></i><span>关闭</span></button></div>' +
      '</div>';
    pageEl.appendChild(modal);
  }

  function renderValueFormRow(label, control, hint, isArea) {
    return '<div class="sc-value-form-row' + (isArea ? ' area' : '') + '">' +
      '<label>' + (label !== '有效期' ? '<span>*</span>' : '') + label + '</label>' +
      '<div class="sc-value-control">' + control + '</div>' +
      '<div class="sc-value-hint">' + (hint || '') + '</div>' +
    '</div>';
  }

  function renderDatePicker() {
    if (!state.datePickerOpen) return '';
    return '<div class="sc-date-picker">' +
      '<div class="sc-date-head"><button type="button" data-sc-action="date-prev"><i class="bi bi-chevron-double-left"></i></button><button type="button" data-sc-action="date-prev"><i class="bi bi-chevron-left"></i></button><strong>2026年&nbsp;&nbsp;6月</strong><strong>2026年&nbsp;&nbsp;7月</strong><button type="button" data-sc-action="date-next"><i class="bi bi-chevron-right"></i></button><button type="button" data-sc-action="date-next"><i class="bi bi-chevron-double-right"></i></button></div>' +
      '<div class="sc-date-months">' + renderMonth([31,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,1,2,3,4,5,6,7,8,9,10,11], 17) + renderMonth([28,29,30,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,1,2,3,4,5,6,7,8], 0) + '</div>' +
      '<div class="sc-date-foot"><span>选择时间</span><div><button type="button" data-sc-action="date-clear">清空</button><button type="button" data-sc-action="date-ok">确定</button></div></div>' +
    '</div>';
  }

  function renderMonth(days, active) {
    var week = ['日', '一', '二', '三', '四', '五', '六'];
    return '<div class="sc-date-month"><div class="sc-date-week">' + week.map(function (d) { return '<span>' + d + '</span>'; }).join('') + '</div><div class="sc-date-grid">' +
      days.map(function (day, index) {
        var faded = index < 1 || index > 30;
        var activeClass = active && day === active ? ' active' : '';
        return '<button class="' + (faded ? ' muted' : '') + activeClass + '" type="button" data-sc-action="choose-date" data-day="' + day + '">' + day + '</button>';
      }).join('') +
    '</div></div>';
  }

  function saveValue() {
    var form = pageEl.querySelector('[data-sc-value-form]');
    var item = getCurrentDataRow();
    if (!form || !item) return;
    var values = {};
    form.querySelectorAll('[data-sc-value-field]').forEach(function (control) {
      values[control.getAttribute('data-sc-value-field')] = control.value.trim();
    });
    if (!values.code || !values.name) {
      showToast('请填写编码和名称');
      return;
    }
    var duplicated = (item.values || []).some(function (row) {
      return row.code === values.code && row.code !== state.valueModalId;
    });
    if (duplicated) {
      showToast('编码已存在，请调整后保存');
      return;
    }
    var existing = (item.values || []).filter(function (row) { return row.code === state.valueModalId; })[0];
    if (existing) {
      existing.code = values.code;
      existing.name = values.name;
      existing.property = values.property || '国家标准';
      existing.valid = '有效';
      existing.validDate = values.validDate || '';
      existing.desc = values.desc || '';
    } else {
      item.values.unshift({
        code: values.code,
        name: values.name,
        property: values.property || '国家标准',
        valid: '有效',
        validDate: values.validDate || '',
        desc: values.desc || ''
      });
    }
    item.recordCount = item.values.length;
    state.dataSelected = {};
    closeModal();
    renderMain();
    showToast('代码值已保存');
  }

  function deleteValues(codes) {
    var item = getCurrentDataRow();
    if (!item || !codes.length) {
      showToast('请先选择需要删除的代码值');
      return;
    }
    confirmAndRun('确认删除选中的 <b>' + codes.length + '</b> 条代码值吗？', 'danger', function () {
      item.values = (item.values || []).filter(function (row) { return codes.indexOf(row.code) < 0; });
      item.recordCount = item.values.length;
      state.dataSelected = {};
      renderMain();
      showToast('代码值已删除');
    });
  }

  function handleAction(actionEl) {
    var action = actionEl.getAttribute('data-sc-action');
    var id = actionEl.getAttribute('data-id') || '';

    if (action === 'new') {
      openForm('new', '');
    } else if (action === 'edit') {
      openForm('edit', id);
    } else if (action === 'delete-row') {
      deleteRows([id]);
    } else if (action === 'delete-selected') {
      deleteRows(Object.keys(state.selectedIds));
    } else if (action === 'open-data') {
      openDataPage(id);
    } else if (action === 'query') {
      var keyword = pageEl.querySelector('#scKeywordInput');
      state.keyword = keyword ? keyword.value.trim() : '';
      state.page = 1;
      state.selectedIds = {};
      renderMain();
    } else if (action === 'import') {
      openImportModal('list');
    } else if (action === 'export') {
      addExportLog();
    } else if (action === 'back-list' || action === 'cancel-form') {
      if (state.mode === 'form') closeForm();
      else backToList();
    } else if (action === 'save-form') {
      saveForm();
    } else if (action === 'toggle-category') {
      state.formCategoryOpen = !state.formCategoryOpen;
      renderMain();
    } else if (action === 'choose-category') {
      var text = pageEl.querySelector('[data-sc-category-text]');
      var input = pageEl.querySelector('[data-sc-form-field="group"]');
      if (text) text.textContent = actionEl.getAttribute('data-value') || '业务部';
      if (input) input.value = actionEl.getAttribute('data-value') === '数仓组' ? 'warehouse' : 'business';
      state.formCategoryOpen = false;
      var picker = pageEl.querySelector('.sc-category-picker');
      if (picker) picker.classList.remove('open');
    } else if (action === 'query-io') {
      var ioKeyword = pageEl.querySelector('[data-sc-io-keyword]');
      state.ioFilters.keyword = ioKeyword ? ioKeyword.value.trim() : '';
      renderMain();
    } else if (action === 'download-file') {
      showToast('文件已开始下载');
    } else if (action === 'view-log') {
      showToast('日志详情已打开');
    } else if (action === 'page-go') {
      var jump = pageEl.querySelector('.sc-page-jump');
      var totalPages = Math.max(1, Math.ceil(getFilteredRows().length / state.pageSize));
      state.page = Math.max(1, Math.min(totalPages, Number(jump && jump.value) || 1));
      renderMain();
    } else if (action === 'value-new') {
      openValueModal('');
    } else if (action === 'value-edit') {
      openValueModal(id);
    } else if (action === 'value-edit-selected') {
      var selectedCodes = Object.keys(state.dataSelected);
      if (selectedCodes.length !== 1) showToast(selectedCodes.length ? '一次只能编辑一条代码值' : '请先选择需要编辑的代码值');
      else openValueModal(selectedCodes[0]);
    } else if (action === 'value-delete') {
      deleteValues([id]);
    } else if (action === 'value-delete-selected') {
      deleteValues(Object.keys(state.dataSelected));
    } else if (action === 'query-data') {
      var dataKeyword = pageEl.querySelector('#scDataKeyword');
      state.dataKeyword = dataKeyword ? dataKeyword.value.trim() : '';
      state.dataSelected = {};
      renderMain();
    } else if (action === 'import-data') {
      openImportModal('data');
    } else if (action === 'export-data') {
      showToast('当前代码值已导出');
    } else if (action === 'toggle-date') {
      state.datePickerOpen = !state.datePickerOpen;
      var dateControl = pageEl.querySelector('.sc-date-control');
      var oldPicker = dateControl ? dateControl.querySelector('.sc-date-picker') : null;
      if (oldPicker) oldPicker.remove();
      if (state.datePickerOpen && dateControl) dateControl.insertAdjacentHTML('beforeend', renderDatePicker());
    } else if (action === 'choose-date') {
      var inputDate = pageEl.querySelector('[data-sc-value-field="validDate"]');
      if (inputDate) inputDate.value = '2026-06-' + String(actionEl.getAttribute('data-day')).padStart(2, '0');
    } else if (action === 'date-clear') {
      var clearDate = pageEl.querySelector('[data-sc-value-field="validDate"]');
      if (clearDate) clearDate.value = '';
    } else if (action === 'date-ok') {
      state.datePickerOpen = false;
      var dateModal = pageEl.querySelector('[data-sc-modal="value"]');
      if (dateModal) {
        var picker = dateModal.querySelector('.sc-date-picker');
        if (picker) picker.remove();
      }
    } else if (action === 'date-prev' || action === 'date-next') {
      showToast('静态原型中已模拟月份切换');
    } else if (action === 'close-modal') {
      closeModal();
    } else if (action === 'save-import') {
      saveImport('list');
    } else if (action === 'save-data-import') {
      saveImport('data');
    } else if (action === 'download-template') {
      showToast('导入模板已生成');
    } else if (action === 'save-value') {
      saveValue();
    }
  }

  function bindEvents() {
    pageEl.addEventListener('click', function (e) {
      if (e.target.classList.contains('sc-modal-mask')) {
        closeModal();
        return;
      }

      var treeRow = e.target.closest('[data-sc-tree]');
      if (treeRow && pageEl.contains(treeRow)) {
        state.treeKey = treeRow.getAttribute('data-sc-tree');
        state.page = 1;
        state.selectedIds = {};
        if (state.mode === 'data') state.mode = 'list';
        renderAll();
        return;
      }

      var tab = e.target.closest('[data-sc-tab]');
      if (tab && pageEl.contains(tab)) {
        state.activeTab = tab.getAttribute('data-sc-tab');
        state.mode = 'list';
        state.selectedIds = {};
        renderMain();
        return;
      }

      var sortBtn = e.target.closest('[data-sc-sort]');
      if (sortBtn && pageEl.contains(sortBtn)) {
        var key = sortBtn.getAttribute('data-sc-sort');
        if (state.sortKey === key) state.sortDir = state.sortDir === 'asc' ? 'desc' : 'asc';
        else {
          state.sortKey = key;
          state.sortDir = 'asc';
        }
        renderMain();
        return;
      }

      var pageBtn = e.target.closest('[data-sc-page]');
      if (pageBtn && pageEl.contains(pageBtn)) {
        var totalPages = Math.max(1, Math.ceil(getFilteredRows().length / state.pageSize));
        var target = pageBtn.getAttribute('data-sc-page');
        if (target === 'prev') state.page = Math.max(1, state.page - 1);
        else if (target === 'next') state.page = Math.min(totalPages, state.page + 1);
        else state.page = Number(target) || 1;
        renderMain();
        return;
      }

      var actionEl = e.target.closest('[data-sc-action]');
      if (actionEl && pageEl.contains(actionEl)) {
        handleAction(actionEl);
      }
    });

    pageEl.addEventListener('change', function (e) {
      if (e.target.matches('[data-sc-check-all]')) {
        getVisibleRows().forEach(function (item) {
          if (e.target.checked) state.selectedIds[item.id] = true;
          else delete state.selectedIds[item.id];
        });
        renderMain();
        return;
      }
      if (e.target.matches('[data-sc-row-check]')) {
        var id = e.target.getAttribute('data-sc-row-check');
        if (e.target.checked) state.selectedIds[id] = true;
        else delete state.selectedIds[id];
        syncControls();
        return;
      }
      if (e.target.matches('[data-sc-page-size]')) {
        state.pageSize = Number(e.target.value) || 10;
        state.page = 1;
        renderMain();
        return;
      }
      if (e.target.matches('[data-sc-io-filter]')) {
        state.ioFilters[e.target.getAttribute('data-sc-io-filter')] = e.target.value;
        renderMain();
        return;
      }
      if (e.target.matches('[data-sc-value-check-all]')) {
        getFilteredValues(getCurrentDataRow()).forEach(function (item) {
          if (e.target.checked) state.dataSelected[item.code] = true;
          else delete state.dataSelected[item.code];
        });
        renderMain();
        return;
      }
      if (e.target.matches('[data-sc-value-check]')) {
        var code = e.target.getAttribute('data-sc-value-check');
        if (e.target.checked) state.dataSelected[code] = true;
        else delete state.dataSelected[code];
        syncControls();
      }
    });

    pageEl.addEventListener('input', function (e) {
      if (e.target.matches('[data-sc-tree-search]')) {
        state.treeKeyword = e.target.value;
        var tree = pageEl.querySelector('[data-sc-tree]');
        if (tree) tree.innerHTML = renderTree();
      }
    });

    pageEl.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter') return;
      if (e.target.id === 'scKeywordInput') {
        var query = pageEl.querySelector('[data-sc-action="query"]');
        if (query) query.click();
      } else if (e.target.id === 'scDataKeyword') {
        var dataQuery = pageEl.querySelector('[data-sc-action="query-data"]');
        if (dataQuery) dataQuery.click();
      } else if (e.target.matches('[data-sc-io-keyword]')) {
        var ioQuery = pageEl.querySelector('[data-sc-action="query-io"]');
        if (ioQuery) ioQuery.click();
      } else if (e.target.classList.contains('sc-page-jump')) {
        var go = pageEl.querySelector('[data-sc-action="page-go"]');
        if (go) go.click();
      }
    });
  }

  function resetState() {
    state.activeTab = 'list';
    state.mode = 'list';
    state.treeKey = 'business';
    state.treeKeyword = '';
    state.selectedIds = {};
    state.keyword = '';
    state.page = 1;
    state.pageSize = 10;
    state.sortKey = '';
    state.sortDir = 'asc';
    state.formMode = '';
    state.formId = '';
    state.formCategoryOpen = false;
    state.dataRowId = '';
    state.dataKeyword = '';
    state.dataSelected = {};
    state.valueModalId = '';
    state.datePickerOpen = false;
    state.ioFilters = { attr: '', status: '', keyword: '' };
  }

  var html = '<div class="page-business-code page-standard-code">' +
    '<aside class="bc-left-panel sc-left-panel">' +
      '<div class="bc-tree-search">' +
        '<input type="text" data-sc-tree-search placeholder="关键字搜索" aria-label="关键字搜索">' +
        '<button type="button" aria-label="搜索目录"><i class="bi bi-search"></i></button>' +
      '</div>' +
      '<div class="bc-tree-scroll sc-tree-scroll"><ul class="bc-tree sc-tree" data-sc-tree></ul></div>' +
    '</aside>' +
    '<section class="bc-main-panel sc-main-panel" data-sc-view></section>' +
  '</div>';

  return {
    html: html,
    init: function () {
      pageEl = document.querySelector('.page-standard-code');
      if (!pageEl) return;
      resetState();
      bindEvents();
      renderAll();
    }
  };
})();
