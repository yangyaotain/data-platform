/** 运维监控 / 运维概况 / 平台概况。 */
window.DP = window.DP || {};
DP.pages = DP.pages || {};

DP.pages.platformOverview = (function () {
  'use strict';

  var root;
  var state;
  var tabDefs = [
    { key: 'users', label: '用户' },
    { key: 'governance', label: '数据治理' },
    { key: 'projects', label: '项目开发' },
    { key: 'services', label: '数据服务' }
  ];

  var userRows = [
    { role: '平台管理员', enabled: 3, disabled: 0, logins: 48 },
    { role: '数据开发工程师', enabled: 9, disabled: 1, logins: 72 },
    { role: '数据治理专员', enabled: 6, disabled: 0, logins: 41 },
    { role: '数据质量管理员', enabled: 4, disabled: 0, logins: 27 },
    { role: '数据服务开发', enabled: 5, disabled: 0, logins: 31 },
    { role: '运维管理员', enabled: 3, disabled: 0, logins: 18 },
    { role: '业务分析人员', enabled: 4, disabled: 1, logins: 22 },
    { role: '安全审计员', enabled: 2, disabled: 0, logins: 11 }
  ];

  var sourceRows = [
    { name: '业务系统 → 订单中心', type: 'MySQL', total: 126, registered: 126 },
    { name: '业务系统 → 会员中心', type: 'MySQL', total: 84, registered: 80 },
    { name: 'ODS贴源层 → 交易ODS', type: 'Hive', total: 96, registered: 92 },
    { name: 'ODS贴源层 → 物流ODS', type: 'Hive', total: 58, registered: 55 },
    { name: 'DWD明细层 → 交易明细', type: 'Hive', total: 72, registered: 70 },
    { name: 'DWS汇总层 → 经营汇总', type: 'Hive', total: 46, registered: 44 },
    { name: 'ADS应用层 → 运营数据集市', type: 'StarRocks', total: 38, registered: 36 },
    { name: '实时计算 → 订单实时库', type: 'Kafka', total: 24, registered: 24 },
    { name: '客户服务 → 工单分析库', type: 'PostgreSQL', total: 35, registered: 33 },
    { name: '供应链系统 → 库存中心', type: 'Oracle', total: 42, registered: 40 },
    { name: '财务系统 → 结算主题库', type: 'Oracle', total: 31, registered: 29 },
    { name: '文件交换区 → 合作方数据', type: 'FTP', total: 18, registered: 15 }
  ];

  var projectRows = [
    { name: '零售交易数仓', sources: 6, batch: 34, stream: 5, collectFlow: 4, batchCollect: 12, governance: 8, quality: 16, learning: 2, online: 7, packages: 5, failed: 2, runs: 386 },
    { name: '会员画像中心', sources: 4, batch: 21, stream: 3, collectFlow: 2, batchCollect: 8, governance: 6, quality: 11, learning: 4, online: 5, packages: 3, failed: 1, runs: 248 },
    { name: '供应链协同分析', sources: 5, batch: 27, stream: 2, collectFlow: 5, batchCollect: 10, governance: 7, quality: 13, learning: 1, online: 6, packages: 4, failed: 3, runs: 315 },
    { name: '经营决策驾驶舱', sources: 3, batch: 18, stream: 1, collectFlow: 2, batchCollect: 6, governance: 5, quality: 9, learning: 2, online: 4, packages: 2, failed: 0, runs: 192 },
    { name: '客户服务分析', sources: 3, batch: 16, stream: 2, collectFlow: 3, batchCollect: 5, governance: 4, quality: 8, learning: 1, online: 4, packages: 2, failed: 1, runs: 174 },
    { name: '财务结算分析', sources: 4, batch: 22, stream: 1, collectFlow: 2, batchCollect: 7, governance: 6, quality: 10, learning: 0, online: 3, packages: 3, failed: 1, runs: 221 }
  ];

  var serviceRows = [
    { name: '零售交易数仓', interactive: 7, subscription: 3, applications: 13, calls: 9680, pushes: 2310, interactiveErrors: 2, subscriptionErrors: 1 },
    { name: '会员画像中心', interactive: 5, subscription: 2, applications: 9, calls: 7216, pushes: 1680, interactiveErrors: 1, subscriptionErrors: 0 },
    { name: '供应链协同分析', interactive: 4, subscription: 3, applications: 8, calls: 5842, pushes: 1946, interactiveErrors: 3, subscriptionErrors: 1 },
    { name: '经营决策驾驶舱', interactive: 3, subscription: 1, applications: 7, calls: 4680, pushes: 910, interactiveErrors: 1, subscriptionErrors: 0 },
    { name: '客户服务分析', interactive: 3, subscription: 2, applications: 6, calls: 3128, pushes: 1054, interactiveErrors: 2, subscriptionErrors: 1 },
    { name: '财务结算分析', interactive: 2, subscription: 1, applications: 4, calls: 1310, pushes: 526, interactiveErrors: 0, subscriptionErrors: 0 }
  ];

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (char) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char];
    });
  }

  function sum(rows, key) {
    return rows.reduce(function (total, row) { return total + Number(row[key] || 0); }, 0);
  }

  function fmt(value) {
    return Number(value).toLocaleString('zh-CN');
  }

  function overviewGroup(title, icon, items, compact) {
    return '<section class="pso-overview-group' + (compact ? ' is-compact' : '') + '">' +
      '<div class="pso-group-title"><i class="bi bi-' + icon + '" aria-hidden="true"></i><span>' + title + '</span></div>' +
      '<div class="pso-metric-list">' + items.map(function (item) {
        return '<div class="pso-metric"><div class="pso-metric-name">' + item[0] + '</div>' +
          '<div class="pso-metric-value">' + fmt(item[1]) + '</div>' +
          '<div class="pso-metric-trend"><span>较昨日</span><b class="' + (item[2] < 0 ? 'is-down' : '') + '">' + (item[2] >= 0 ? '+' : '') + item[2] + '</b></div></div>';
      }).join('') + '</div></section>';
  }

  function renderOverview() {
    return '<div class="pso-overview-scroll"><div class="pso-overview-grid">' +
      overviewGroup('用户', 'people', [['角色', userRows.length, 1], ['用户', sum(userRows, 'enabled') + sum(userRows, 'disabled'), 3]], true) +
      overviewGroup('数据治理', 'database-gear', [['新建库', 5, 1], ['数据库实例', 8, 0], ['数据库链接', sourceRows.length, 2], ['接口数据', 6, 1]]) +
      overviewGroup('项目开发', 'code-square', [['项目数', projectRows.length, 1], ['批量处理', sum(projectRows, 'batch'), 7], ['调度任务', 34, 2], ['流式计算', sum(projectRows, 'stream'), 1]]) +
      overviewGroup('数据服务', 'hdd-network', [['申请次数', sum(serviceRows, 'applications'), 6], ['调用次数', sum(serviceRows, 'calls'), 2840], ['发布接口', sum(serviceRows, 'interactive') + sum(serviceRows, 'subscription'), 4], ['共享api', 24, 2]]) +
    '</div></div>';
  }

  function queryBar(options) {
    var select = options.select ? '<label class="pso-field"><span>' + options.select.label + '</span><select class="pso-control" data-pso-select aria-label="' + options.select.label + '">' + options.select.options.map(function (option) {
      return '<option value="' + esc(option) + '"' + (state.sourceType === option ? ' selected' : '') + '>' + esc(option) + '</option>';
    }).join('') + '</select></label>' : '';
    return '<div class="pso-query">' + select + '<div class="pso-search"><input type="search" class="pso-control" data-pso-keyword aria-label="' + esc(options.placeholder) + '" placeholder="' + esc(options.placeholder) + '" value="' + esc(state.draft[state.tab]) + '"><button type="button" class="btn btn-primary" data-pso-action="query"><i class="bi bi-search" aria-hidden="true"></i><span>查询</span></button></div></div>';
  }

  function table(headers, rows, className, footer) {
    return '<div class="pso-table-wrap"><table class="ds-table pso-table ' + (className || '') + '"><thead><tr>' + headers.map(function (header) {
      return '<th scope="col">' + header + '</th>';
    }).join('') + '</tr></thead><tbody>' + rows.join('') + (footer || '') + '</tbody></table></div>';
  }

  function emptyRow(colspan) {
    return '<tr><td colspan="' + colspan + '"><div class="pso-empty"><i class="bi bi-inbox" aria-hidden="true"></i><span>暂无匹配数据</span></div></td></tr>';
  }

  function renderUsers() {
    var keyword = state.applied.users.toLowerCase();
    var rows = userRows.filter(function (row) { return !keyword || row.role.toLowerCase().indexOf(keyword) >= 0; });
    var body = rows.map(function (row) {
      return '<tr><td><span class="pso-role"><i class="bi bi-person-badge" aria-hidden="true"></i>' + esc(row.role) + '</span></td><td>' + row.enabled + '</td><td>' + row.disabled + '</td><td>' + row.logins + '</td></tr>';
    });
    if (!body.length) body.push(emptyRow(4));
    var footer = rows.length ? '<tr class="pso-total-row"><td>合计</td><td>' + sum(rows, 'enabled') + '</td><td>' + sum(rows, 'disabled') + '</td><td>' + sum(rows, 'logins') + '</td></tr>' : '';
    return '<div class="pso-detail-head"><div><h3>用户与角色</h3><p>(注: 由于一个用户可配置多个角色，合计用户数的统计和登录次数统计，并不是各个角色的统计之和)</p></div>' + queryBar({ placeholder: '角色名称' }) + '</div>' +
      table(['角色', '用户(正常)', '用户(禁用)', '登录次数'], body, '', footer);
  }

  function sourceSummary() {
    var registered = sum(sourceRows, 'registered');
    return '<div class="pso-source-summary">' + [
      ['database', '数据源', sourceRows.length, '个'],
      ['table', '注册数据', registered, '张表'],
      ['device-ssd', '存储消耗', '286.742', 'GB'],
      ['columns-gap', '指标表字段总数', '1,482', '个']
    ].map(function (item) {
      return '<div class="pso-summary-item"><i class="bi bi-' + item[0] + '" aria-hidden="true"></i><div><span>' + item[1] + '</span><strong>' + item[2] + '</strong><small>' + item[3] + '</small></div></div>';
    }).join('') + '</div>';
  }

  function renderGovernance() {
    var keyword = state.applied.governance.toLowerCase();
    var rows = sourceRows.filter(function (row) {
      return (state.sourceType === '全部' || row.type === state.sourceType) && (!keyword || row.name.toLowerCase().indexOf(keyword) >= 0);
    });
    var pages = Math.max(1, Math.ceil(rows.length / state.size));
    state.page = Math.min(state.page, pages);
    var start = (state.page - 1) * state.size;
    var paged = rows.slice(start, start + state.size);
    var body = paged.map(function (row) {
      var unregistered = row.total - row.registered;
      return '<tr><td class="pso-source-name">' + esc(row.name) + '</td><td><span class="tag tag-blue">' + esc(row.type) + '</span></td><td><span class="pso-register-stat">表总量：<b>' + row.total + '</b>；已注册：<b class="is-ok">' + row.registered + '</b>；未注册：<b class="' + (unregistered ? 'is-warn' : '') + '">' + unregistered + '</b></span></td></tr>';
    });
    if (!body.length) body.push(emptyRow(3));
    var types = ['全部'].concat(Array.from(new Set(sourceRows.map(function (row) { return row.type; }))));
    return sourceSummary() + '<div class="pso-detail-head pso-governance-head"><div><h3>数据源明细</h3></div>' + queryBar({ placeholder: '数据源名称', select: { label: '数据源类型', options: types } }) + '</div>' +
      table(['数据源名称', '类型', '描述'], body, 'pso-source-table') + renderPagination(rows.length, pages);
  }

  function renderPagination(total, pages) {
    if (!total) return '';
    var nums = [];
    for (var i = 1; i <= pages; i += 1) nums.push('<button type="button" class="page-num' + (state.page === i ? ' active' : '') + '" data-pso-action="page" data-page="' + i + '">' + i + '</button>');
    return '<div class="ds-pagination pso-pagination"><div class="page-info">第 ' + ((state.page - 1) * state.size + 1) + '–' + Math.min(state.page * state.size, total) + ' 条，共 ' + total + ' 条数据</div><div class="page-nav"><button type="button" class="page-btn' + (state.page === 1 ? ' disabled' : '') + '" data-pso-action="prev"><i class="bi bi-chevron-left" aria-hidden="true"></i><span>上一页</span></button>' + nums.join('') + '<button type="button" class="page-btn' + (state.page === pages ? ' disabled' : '') + '" data-pso-action="next"><span>下一页</span><i class="bi bi-chevron-right" aria-hidden="true"></i></button><select class="pso-page-size" data-pso-size aria-label="每页条数"><option value="5"' + (state.size === 5 ? ' selected' : '') + '>5 条/页</option><option value="10"' + (state.size === 10 ? ' selected' : '') + '>10 条/页</option></select></div></div>';
  }

  function renderProjects() {
    var keyword = state.applied.projects.toLowerCase();
    var rows = projectRows.filter(function (row) { return !keyword || row.name.toLowerCase().indexOf(keyword) >= 0; });
    var body = rows.map(function (row) {
      return '<tr><td class="pso-project-name">' + esc(row.name) + '</td><td>' + row.sources + '</td><td>' + row.batch + '</td><td>' + row.stream + '</td><td>' + row.collectFlow + '</td><td>' + row.batchCollect + '</td><td>' + row.governance + '</td><td>' + row.quality + '</td><td>' + row.learning + '</td><td>' + row.online + '</td><td>' + row.packages + '</td><td><span class="pso-run-result' + (row.failed ? ' has-failed' : '') + '">' + row.failed + ' / ' + row.runs + '</span></td></tr>';
    });
    if (!body.length) body.push(emptyRow(12));
    return '<div class="pso-detail-head"><div><h3>项目列表</h3></div>' + queryBar({ placeholder: '项目名称' }) + '</div>' +
      table(['项目名称', '使用数据源', '批量处理', '流式计算', '采集子流程', '批量采集', '数据治理', '质量节点', '深度学习', '在线编程', '上传程序包', '调度执行(失败/总次数)'], body, 'pso-project-table');
  }

  function renderServices() {
    var keyword = state.applied.services.toLowerCase();
    var rows = serviceRows.filter(function (row) { return !keyword || row.name.toLowerCase().indexOf(keyword) >= 0; });
    var body = rows.map(function (row) {
      return '<tr><td class="pso-project-name">' + esc(row.name) + '</td><td>' + row.interactive + '</td><td>' + row.subscription + '</td><td>' + row.applications + '</td><td>' + fmt(row.calls) + '</td><td>' + fmt(row.pushes) + '</td><td><span class="pso-error-count">' + row.interactiveErrors + ' / ' + row.subscriptionErrors + '</span></td></tr>';
    });
    if (!body.length) body.push(emptyRow(7));
    var footer = rows.length ? '<tr class="pso-total-row"><td>合计</td><td>' + sum(rows, 'interactive') + '</td><td>' + sum(rows, 'subscription') + '</td><td>' + sum(rows, 'applications') + '</td><td>' + fmt(sum(rows, 'calls')) + '</td><td>' + fmt(sum(rows, 'pushes')) + '</td><td>' + sum(rows, 'interactiveErrors') + ' / ' + sum(rows, 'subscriptionErrors') + '</td></tr>' : '';
    return '<div class="pso-detail-head"><div><h3>共享API</h3></div>' + queryBar({ placeholder: '项目名称' }) + '</div>' +
      table(['项目名称', '交互型接口', '订阅型接口', '申请数量', '接口调用次数', '订阅推送次数', '接口服务异常数(交互/订阅)'], body, 'pso-service-table', footer);
  }

  function renderDetails() {
    var content = state.tab === 'users' ? renderUsers() : state.tab === 'governance' ? renderGovernance() : state.tab === 'projects' ? renderProjects() : renderServices();
    root.querySelector('[data-pso-detail]').innerHTML = '<div class="pso-tabs" role="tablist" aria-label="租户监控详情">' + tabDefs.map(function (tab) {
      return '<button type="button" role="tab" class="pso-tab' + (state.tab === tab.key ? ' active' : '') + '" aria-selected="' + (state.tab === tab.key) + '" data-pso-action="tab" data-tab="' + tab.key + '">' + tab.label + '</button>';
    }).join('') + '</div><div class="pso-tab-panel" role="tabpanel">' + content + '</div>';
  }

  function render() {
    root.innerHTML = '<div class="pso-overview">' + renderOverview() + '</div><section class="pso-detail-card"><h2><i class="bi bi-building-gear" aria-hidden="true"></i><span>租户监控详情</span></h2><div data-pso-detail></div></section>';
    renderDetails();
  }

  function applyQuery() {
    state.applied[state.tab] = state.draft[state.tab].trim();
    state.page = 1;
    renderDetails();
  }

  function onClick(event) {
    var button = event.target.closest('[data-pso-action]');
    if (!button) return;
    var action = button.dataset.psoAction;
    if (action === 'tab') {
      state.tab = button.dataset.tab;
      state.page = 1;
      renderDetails();
    } else if (action === 'query') applyQuery();
    else if (action === 'page') { state.page = Number(button.dataset.page); renderDetails(); }
    else if (action === 'prev' && state.page > 1) { state.page -= 1; renderDetails(); }
    else if (action === 'next') {
      var filtered = sourceRows.filter(function (row) {
        return (state.sourceType === '全部' || row.type === state.sourceType) && (!state.applied.governance || row.name.toLowerCase().indexOf(state.applied.governance.toLowerCase()) >= 0);
      });
      if (state.page < Math.ceil(filtered.length / state.size)) { state.page += 1; renderDetails(); }
    }
  }

  function onChange(event) {
    if (event.target.matches('[data-pso-select]')) {
      state.sourceType = event.target.value;
      state.page = 1;
      renderDetails();
    } else if (event.target.matches('[data-pso-size]')) {
      state.size = Number(event.target.value);
      state.page = 1;
      renderDetails();
    }
  }

  function init() {
    root = DP.contentArea.querySelector('.page-platform-overview');
    if (!root) return;
    state = {
      tab: 'users',
      sourceType: '全部',
      page: 1,
      size: 10,
      draft: { users: '', governance: '', projects: '', services: '' },
      applied: { users: '', governance: '', projects: '', services: '' }
    };
    root.addEventListener('click', onClick);
    root.addEventListener('change', onChange);
    root.addEventListener('input', function (event) {
      if (event.target.matches('[data-pso-keyword]')) state.draft[state.tab] = event.target.value;
    });
    root.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' && event.target.matches('[data-pso-keyword]')) {
        event.preventDefault();
        applyQuery();
      }
    });
    render();
  }

  return { html: '<div class="page-platform-overview"></div>', init: init };
}());
