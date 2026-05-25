/**
 * 数据中台 V4.0 - 控制台 · 项目管理页面
 * 卡片式项目列表 + Tab筛选 + 搜索 + 分页
 */
window.DP = window.DP || {};
DP.pages = DP.pages || {};

DP.pages.projectMgr = (function () {
  var activeTab = 'running';
  var pageEl;

  var projects = [
    { status: 'running', name: '物流数仓项目', owner: 'ShangsValley_admin', date: '2023-07-18', icon: 'bi-box-seam', color: 'linear-gradient(135deg,#1890ff,#36cfc9)', enabled: true },
    { status: 'running', name: '营销分析平台', owner: 'DataTeam_zhangsan', date: '2024-03-05', icon: 'bi-graph-up-arrow', color: 'linear-gradient(135deg,#722ed1,#b37feb)', enabled: true },
    { status: 'running', name: '用户画像中心', owner: 'analyst_lisi', date: '2024-01-12', icon: 'bi-database', color: 'linear-gradient(135deg,#13c2c2,#87e8de)', enabled: true },
    { status: 'running', name: '电商交易数仓', owner: 'dev_wangwu', date: '2023-11-20', icon: 'bi-cart3', color: 'linear-gradient(135deg,#eb2f96,#ff85c0)', enabled: true },
    { status: 'pending', name: '财务报表平台', owner: 'finance_zhaoliu', date: '2023-09-08', icon: 'bi-bar-chart-line', color: 'linear-gradient(135deg,#fa8c16,#ffc069)', enabled: false },
    { status: 'pending', name: '供应链分析', owner: 'scm_zhoujiu', date: '2023-12-01', icon: 'bi-truck', color: 'linear-gradient(135deg,#faad14,#ffe58f)', enabled: false },
    { status: 'pending', name: '设备维保分析', owner: 'device_maliu', date: '2024-05-16', icon: 'bi-tools', color: 'linear-gradient(135deg,#2f54eb,#85a5ff)', enabled: false },
    { status: 'closed', name: '实时监控大屏', owner: 'ops_sunqi', date: '2024-06-15', icon: 'bi-speedometer2', color: 'linear-gradient(135deg,#52c41a,#95de64)', enabled: true },
    { status: 'closed', name: '风控数据平台', owner: 'risk_chenba', date: '2024-04-10', icon: 'bi-shield-check', color: 'linear-gradient(135deg,#f5222d,#ff7875)', enabled: true },
    { status: 'closed', name: '数据湖迁移', owner: 'infra_wushi', date: '2025-01-06', icon: 'bi-cloud-arrow-up', color: 'linear-gradient(135deg,#597ef7,#adc6ff)', enabled: true }
  ];

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function getFilteredProjects() {
    var keywordEl = pageEl.querySelector('.pm-search-input');
    var keyword = keywordEl ? keywordEl.value.trim().toLowerCase() : '';
    return projects.filter(function (project) {
      var matchTab = activeTab === 'all' || project.status === activeTab;
      var matchKeyword = !keyword ||
        project.name.toLowerCase().indexOf(keyword) > -1 ||
        project.owner.toLowerCase().indexOf(keyword) > -1;
      return matchTab && matchKeyword;
    });
  }

  function renderCard(project) {
    return '' +
      '<div class="pm-card">' +
        '<div class="pm-card-top">' +
          '<div class="pm-card-title"><span class="pm-card-icon" style="background:' + project.color + ';"><i class="bi ' + project.icon + '"></i></span><span class="pm-card-name">' + escapeHtml(project.name) + '</span></div>' +
          '<label class="pm-switch"><input type="checkbox" ' + (project.enabled ? 'checked' : '') + '><span class="pm-switch-slider"></span></label>' +
        '</div>' +
        '<div class="pm-card-info"><span class="pm-card-meta"><i class="bi bi-person"></i> ' + escapeHtml(project.owner) + '</span><span class="pm-card-meta"><i class="bi bi-calendar3"></i> ' + escapeHtml(project.date) + '</span></div>' +
        '<div class="pm-card-foot"><a class="pm-card-link" href="javascript:;">项目开发</a><span class="pm-card-sep">|</span><a class="pm-card-link" href="javascript:;">项目变更</a></div>' +
      '</div>';
  }

  function renderList() {
    var list = getFilteredProjects();
    var cardList = pageEl.querySelector('.pm-card-list');
    var total = pageEl.querySelector('.pm-page-total');
    if (!cardList || !total) return;
    cardList.innerHTML = list.map(renderCard).join('');
    total.textContent = '共 ' + list.length + ' 条';
  }

  function renderCreateSteps(step) {
    return '' +
      '<div class="pm-create-steps">' +
        '<div class="pm-create-step ' + (step > 1 ? 'done' : 'active') + '"><span class="pm-step-dot">' + (step > 1 ? '<i class="bi bi-check-lg"></i>' : '1') + '</span><span class="pm-step-label">项目信息</span><span class="pm-step-line"></span></div>' +
        '<div class="pm-create-step ' + (step > 2 ? 'done' : (step === 2 ? 'active' : '')) + '"><span class="pm-step-dot">' + (step > 2 ? '<i class="bi bi-check-lg"></i>' : '2') + '</span><span class="pm-step-label">项目成员</span><span class="pm-step-line"></span></div>' +
        '<div class="pm-create-step ' + (step > 3 ? 'done' : (step === 3 ? 'active' : '')) + '"><span class="pm-step-dot">' + (step > 3 ? '<i class="bi bi-check-lg"></i>' : '3') + '</span><span class="pm-step-label">项目资源</span><span class="pm-step-line"></span></div>' +
        '<div class="pm-create-step last ' + (step === 4 ? 'active' : '') + '"><span class="pm-step-dot">4</span><span class="pm-step-label">完成</span></div>' +
      '</div>';
  }

  function renderCreatePage() {
    pageEl.innerHTML = '' +
      '<div class="pm-create-view">' +
        '<div class="pm-create-panel">' +
          renderCreateSteps(1) +
          '<div class="pm-create-form">' +
            '<div class="pm-create-row">' +
              '<label><span class="pm-required">*</span> 项目名称</label>' +
              '<input class="pm-create-input pm-create-name" placeholder="50个字符以内">' +
            '</div>' +
            '<div class="pm-create-row compact">' +
              '<label><span class="pm-required">*</span> 环境信息</label>' +
              '<div class="pm-create-checks">' +
                '<label><input type="checkbox" checked> 开发</label>' +
                '<label><input type="checkbox"> 测试</label>' +
                '<label><input type="checkbox"> 生产</label>' +
              '</div>' +
            '</div>' +
            '<div class="pm-create-row textarea">' +
              '<label>描述</label>' +
              '<textarea class="pm-create-textarea" placeholder="最多500个字"></textarea>' +
            '</div>' +
            '<div class="pm-create-actions"><button class="btn btn-primary" data-pm-action="create-next-member">下一步</button></div>' +
          '</div>' +
        '</div>' +
      '</div>';
    bindCreateEvents();
  }

  function renderPermissionChecks() {
    return '' +
      '<div class="pm-member-perms">' +
        '<label><input type="checkbox" checked> 开发环境</label>' +
        '<label><input type="checkbox"> 测试环境</label>' +
        '<label><input type="checkbox"> 生产环境</label>' +
        '<label><input type="checkbox"> 管理员</label>' +
      '</div>';
  }

  function renderMemberPager(total) {
    return '' +
      '<div class="pm-member-pager">' +
        '<span>共 ' + total + ' 条</span>' +
        '<button class="pm-pager-btn disabled"><i class="bi bi-chevron-left"></i></button>' +
        '<button class="pm-pager-num active">1</button>' +
        '<button class="pm-pager-btn disabled"><i class="bi bi-chevron-right"></i></button>' +
        '<select class="filter-select"><option>10 条/页</option><option>20 条/页</option><option>50 条/页</option></select>' +
      '</div>';
  }

  function renderCreateMemberPage() {
    var users = [
      { account: 'present_dev', name: '王鹏', dept: '工程部' },
      { account: 'present_test', name: '张红彬', dept: '业务部' },
      { account: 'wangchang1', name: '王畅', dept: '我的部门' }
    ];
    var depts = ['我的部门/工程部', '我的部门/业务部'];
    var roles = ['开发人员', '用户'];

    pageEl.innerHTML = '' +
      '<div class="pm-create-view">' +
        '<div class="pm-create-panel members">' +
          renderCreateSteps(2) +
          '<div class="pm-member-config">' +
            '<div class="pm-member-toolbar">' +
              '<div class="pm-member-toolbar-left"><button class="btn btn-primary" data-pm-action="open-member-add">添加</button><button class="btn btn-danger">删除</button></div>' +
              '<div class="pm-search-box pm-member-search"><input class="pm-search-input" placeholder="账号或姓名关键字查询"><button class="btn btn-primary btn-sm">查询</button></div>' +
            '</div>' +
            '<div class="pm-member-section">' +
              '<div class="pm-member-title">用户列表</div>' +
              '<table class="ds-table pm-member-config-table users"><thead><tr><th class="pm-col-check"><input type="checkbox"></th><th>账号</th><th>姓名</th><th>部门</th><th>角色</th><th>人员分配</th><th>操作</th></tr></thead><tbody>' +
                users.map(function (user) {
                  return '<tr><td><input type="checkbox"></td><td>' + escapeHtml(user.account) + '</td><td>' + escapeHtml(user.name) + '</td><td>' + escapeHtml(user.dept) + '</td><td></td><td>' + renderPermissionChecks() + '</td><td><button class="btn btn-primary btn-sm">删除</button></td></tr>';
                }).join('') +
              '</tbody></table>' +
              renderMemberPager(users.length) +
            '</div>' +
            '<div class="pm-member-section">' +
              '<div class="pm-member-title">部门列表</div>' +
              '<table class="ds-table pm-member-config-table simple"><thead><tr><th class="pm-col-check"><input type="checkbox"></th><th>部门</th><th>人员分配</th><th>操作</th></tr></thead><tbody>' +
                depts.map(function (dept) {
                  return '<tr><td><input type="checkbox"></td><td>' + escapeHtml(dept) + '</td><td>' + renderPermissionChecks() + '</td><td><button class="btn btn-primary btn-sm">删除</button></td></tr>';
                }).join('') +
              '</tbody></table>' +
              renderMemberPager(depts.length) +
            '</div>' +
            '<div class="pm-member-section">' +
              '<div class="pm-member-title">角色列表</div>' +
              '<table class="ds-table pm-member-config-table simple"><thead><tr><th class="pm-col-check"><input type="checkbox"></th><th>角色</th><th>人员分配</th><th>操作</th></tr></thead><tbody>' +
                roles.map(function (role) {
                  return '<tr><td><input type="checkbox"></td><td>' + escapeHtml(role) + '</td><td>' + renderPermissionChecks() + '</td><td><button class="btn btn-primary btn-sm">删除</button></td></tr>';
                }).join('') +
              '</tbody></table>' +
              renderMemberPager(roles.length) +
            '</div>' +
          '</div>' +
          '<div class="pm-create-member-actions"><button class="btn btn-outline" data-pm-action="create-prev-info">上一步</button><button class="btn btn-primary" data-pm-action="create-next-resource">下一步</button></div>' +
        '</div>' +
      '</div>';
    bindCreateEvents();
  }

  function renderResourceSelect(text, opts) {
    opts = opts || {};
    return '' +
      '<div class="pm-res-select' + (opts.placeholder ? ' placeholder' : '') + (opts.dropdown ? ' has-dropdown' : '') + '" ' + (opts.dropdown ? 'data-pm-resource-dropdown="' + opts.dropdown + '"' : '') + '>' +
        '<span>' + escapeHtml(text) + '</span>' +
        '<i class="bi bi-chevron-down"></i>' +
        (opts.dropdown === 'cluster' ? renderOptionDropdown(getClusterOptions(opts.env)) : '') +
        (opts.dropdown === 'account' ? renderOptionDropdown(getAccountOptions(opts.env)) : '') +
        (opts.dropdown === 'ds-type-tree' ? renderSearchTreeDropdown(getDatasourceTypeTree()) : '') +
        (opts.dropdown === 'ds-catalog-tree' ? renderSearchTreeDropdown(getDatasourceCatalogTree(opts.env)) : '') +
      '</div>';
  }

  function renderResourceInput(value) {
    return '<input class="pm-res-input" value="' + escapeHtml(value) + '">';
  }

  function getClusterOptions(env) {
    var map = {
      dev: ['dp-dev-yarn-a', 'dp-dev-yarn-b', 'dp-sandbox-yarn-01', 'dp-dev-stream-yarn'],
      test: ['dp-test-yarn-a', 'dp-test-yarn-b', 'dp-pre-yarn-01', 'dp-test-stream-yarn'],
      prod: ['dp-prod-yarn-main', 'dp-prod-yarn-backup', 'dp-prod-stream-yarn', 'dp-prod-ai-yarn']
    };
    return map[env] || map.dev;
  }

  function getAccountOptions(env) {
    var map = {
      dev: ['dp_etl_dev', 'dp_ods_dev', 'dp_report_dev', 'dp_model_dev'],
      test: ['dp_etl_test', 'dp_ods_test', 'dp_report_test', 'dp_model_test'],
      prod: ['dp_etl_prod', 'dp_ods_prod', 'dp_report_prod', 'dp_model_prod']
    };
    return map[env] || map.dev;
  }

  function renderOptionDropdown(items) {
    return '' +
      '<div class="pm-res-dropdown option-list">' +
        '<div class="pm-res-option-list">' +
          items.map(function (item) { return '<button type="button" class="pm-res-option" data-pm-res-value="' + escapeHtml(item) + '">' + escapeHtml(item) + '</button>'; }).join('') +
        '</div>' +
      '</div>';
  }

  function getDatasourceTypeTree() {
    return [
      { text: '数据源类型', depth: 0, icon: 'bi-diagram-3-fill', group: true },
      { text: '关系型数据库', depth: 1, icon: 'bi-folder-fill', group: true },
      { text: 'MySQL', value: '关系型数据库 / MySQL', depth: 2, icon: 'bi-database-fill' },
      { text: 'PostgreSQL', value: '关系型数据库 / PostgreSQL', depth: 2, icon: 'bi-database-fill' },
      { text: 'Oracle', value: '关系型数据库 / Oracle', depth: 2, icon: 'bi-database-fill' },
      { text: 'SQL Server', value: '关系型数据库 / SQL Server', depth: 2, icon: 'bi-database-fill' },
      { text: '分布式数据库', depth: 1, icon: 'bi-folder-fill', group: true },
      { text: 'Doris', value: '分布式数据库 / Doris', depth: 2, icon: 'bi-hdd-stack-fill' },
      { text: 'StarRocks', value: '分布式数据库 / StarRocks', depth: 2, icon: 'bi-hdd-stack-fill' },
      { text: 'ClickHouse', value: '分布式数据库 / ClickHouse', depth: 2, icon: 'bi-hdd-stack-fill' },
      { text: '消息与缓存', depth: 1, icon: 'bi-folder-fill', group: true },
      { text: 'Kafka', value: '消息与缓存 / Kafka', depth: 2, icon: 'bi-broadcast-pin' },
      { text: 'Redis', value: '消息与缓存 / Redis', depth: 2, icon: 'bi-lightning-charge-fill' }
    ];
  }

  function getDatasourceCatalogTree(env) {
    var prefix = env === 'prod' ? 'prod' : (env === 'test' ? 'test' : 'dev');
    return [
      { text: '数据源目录', depth: 0, icon: 'bi-diagram-3-fill', group: true },
      { text: '业务系统', depth: 1, icon: 'bi-stack', group: true },
      { text: '订单中心', depth: 2, icon: 'bi-folder-fill', group: true },
      { text: '订单交易库', value: '业务系统 / 订单中心 / ' + prefix + '_order_main', depth: 3, icon: 'bi-database-fill' },
      { text: '订单明细库', value: '业务系统 / 订单中心 / ' + prefix + '_order_detail', depth: 3, icon: 'bi-database-fill' },
      { text: '客户中心', depth: 2, icon: 'bi-folder-fill', group: true },
      { text: '会员主库', value: '业务系统 / 客户中心 / ' + prefix + '_member_core', depth: 3, icon: 'bi-database-fill' },
      { text: '标签画像库', value: '业务系统 / 客户中心 / ' + prefix + '_tag_profile', depth: 3, icon: 'bi-database-fill' },
      { text: '生产计划', depth: 2, icon: 'bi-folder-fill', group: true },
      { text: 'MES工单库', value: '业务系统 / 生产计划 / ' + prefix + '_mes_workorder', depth: 3, icon: 'bi-database-fill' },
      { text: 'ODS-贴源层', depth: 1, icon: 'bi-stack', group: true },
      { text: '订单域', value: 'ODS-贴源层 / 订单域 / ods_order_' + prefix, depth: 2, icon: 'bi-table' },
      { text: '客户域', value: 'ODS-贴源层 / 客户域 / ods_customer_' + prefix, depth: 2, icon: 'bi-table' },
      { text: '系统业务库', depth: 1, icon: 'bi-stack', group: true },
      { text: '主数据数据库', value: '系统业务库 / 主数据数据库 / mdm_' + prefix, depth: 2, icon: 'bi-database-fill' }
    ];
  }

  function renderSearchTreeDropdown(items) {
    return '' +
      '<div class="pm-res-dropdown search-tree">' +
        '<div class="pm-res-tree-search"><input placeholder="搜索目录或数据源"><i class="bi bi-search"></i></div>' +
        '<div class="pm-res-tree-list">' +
          items.map(function (item) {
            var value = item.value || '';
            var tag = item.group ? 'div' : 'button';
            var attrs = item.group ? '' : ' type="button" data-pm-res-value="' + escapeHtml(value) + '"';
            return '<' + tag + ' class="pm-res-tree-row depth-' + item.depth + (item.group ? ' group' : '') + '"' + attrs + ' data-pm-search-text="' + escapeHtml((item.text + ' ' + value).toLowerCase()) + '">' +
              '<span class="pm-res-tree-arrow">' + (item.group ? '<i class="bi bi-chevron-down"></i>' : '') + '</span>' +
              '<i class="bi ' + item.icon + '"></i>' +
              '<span>' + escapeHtml(item.text) + '</span>' +
            '</' + tag + '>';
          }).join('') +
        '</div>' +
      '</div>';
  }

  function renderDatasourceRow(primary) {
    return '' +
      '<div class="pm-ds-row">' +
        renderResourceSelect(primary ? '关系型数据库 / MySQL' : '请选择', { dropdown: 'ds-type-tree', placeholder: !primary }) +
        renderResourceSelect(primary ? '业务系统 / 订单中心 / dev_order_main' : '请选择', { dropdown: 'ds-catalog-tree', env: 'dev', placeholder: !primary }) +
        renderResourceSelect(primary ? '业务系统 / 订单中心 / test_order_main' : '请选择', { dropdown: 'ds-catalog-tree', env: 'test', placeholder: !primary }) +
        renderResourceSelect(primary ? 'ODS-贴源层 / 订单域 / ods_order_prod' : '请选择', { dropdown: 'ds-catalog-tree', env: 'prod', placeholder: !primary }) +
        '<div class="pm-ds-actions">' +
          (primary ? '<label><input type="checkbox" checked> 数据探索</label>' : '') +
          '<button type="button" data-pm-action="resource-delete-row">删除</button>' +
        '</div>' +
      '</div>';
  }

  function renderCreateResourcePage() {
    pageEl.innerHTML = '' +
      '<div class="pm-create-view">' +
        '<div class="pm-create-panel resources">' +
          renderCreateSteps(3) +
          '<div class="pm-resource-config">' +
            '<table class="pm-resource-table">' +
              '<colgroup><col class="pm-res-col-resource"><col class="pm-res-col-label"><col><col><col></colgroup>' +
              '<thead><tr><th colspan="2">项目资源</th><th>开发环境</th><th>测试环境</th><th>生产环境</th></tr></thead>' +
              '<tbody>' +
                '<tr class="pm-yarn-row"><td colspan="2"><label><input type="checkbox" checked> YARN</label><i class="bi bi-chevron-down"></i></td><td></td><td></td><td></td></tr>' +
                '<tr class="pm-cluster-row"><td></td><td class="pm-res-field-label">归属集群:</td><td>' + renderResourceSelect('dp-dev-yarn-a', { dropdown: 'cluster', env: 'dev' }) + '</td><td>' + renderResourceSelect('dp-test-yarn-a', { dropdown: 'cluster', env: 'test' }) + '</td><td>' + renderResourceSelect('dp-prod-yarn-main', { dropdown: 'cluster', env: 'prod' }) + '</td></tr>' +
                '<tr class="pm-account-start"><td class="pm-res-account-title" rowspan="5">大数据账号 <button type="button"><i class="bi bi-plus-circle-fill"></i></button></td><td class="pm-res-field-label">大数据账号:</td><td>' + renderResourceSelect('dp_etl_dev', { dropdown: 'account', env: 'dev' }) + '</td><td>' + renderResourceSelect('dp_etl_test', { dropdown: 'account', env: 'test' }) + '</td><td>' + renderResourceSelect('dp_etl_prod', { dropdown: 'account', env: 'prod' }) + '</td></tr>' +
                '<tr><td class="pm-res-field-label">CPU（个）:</td><td>' + renderResourceInput('8') + '</td><td>' + renderResourceInput('16') + '</td><td>' + renderResourceInput('32') + '</td></tr>' +
                '<tr><td class="pm-res-field-label">内存（GB）:</td><td>' + renderResourceInput('16') + '</td><td>' + renderResourceInput('32') + '</td><td>' + renderResourceInput('64') + '</td></tr>' +
                '<tr><td class="pm-res-field-label">应用程序最大值（个）:</td><td>' + renderResourceInput('3') + '</td><td>' + renderResourceInput('8') + '</td><td>' + renderResourceInput('12') + '</td></tr>' +
                '<tr class="pm-account-end"><td class="pm-res-field-label">权重（%）:</td><td>' + renderResourceInput('10') + '</td><td>' + renderResourceInput('20') + '</td><td>' + renderResourceInput('30') + '</td></tr>' +
              '</tbody>' +
            '</table>' +
            '<div class="pm-datasource-block">' +
              '<div class="pm-datasource-title">数据源 <i class="bi bi-chevron-down"></i></div>' +
              '<div class="pm-datasource-rows">' +
                renderDatasourceRow(true) +
                renderDatasourceRow(false) +
              '</div>' +
              '<button class="pm-resource-add-row" type="button" data-pm-action="resource-add-row"><i class="bi bi-plus-circle"></i> 添加</button>' +
            '</div>' +
            '<div class="pm-resource-actions">' +
              '<button class="btn btn-outline" data-pm-action="create-prev-member">上一步</button>' +
              '<button class="btn btn-primary" data-pm-action="create-finish">保存</button>' +
              '<button class="btn btn-outline" data-pm-action="create-cancel">取消</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';
    bindCreateEvents();
  }

  function renderCreateCompletePage() {
    pageEl.innerHTML = '' +
      '<div class="pm-create-view">' +
        '<div class="pm-create-panel complete">' +
          renderCreateSteps(4) +
          '<div class="pm-complete-state">' +
            '<div class="pm-complete-check-wrap"><i class="bi bi-check-lg pm-complete-check"></i><span class="pm-complete-shadow"></span></div>' +
            '<div class="pm-complete-title">创建成功</div>' +
            '<div class="pm-complete-code">物流数仓项目</div>' +
            '<button class="btn btn-primary pm-complete-back" data-pm-action="return-project-list">返回项目管理</button>' +
          '</div>' +
        '</div>' +
      '</div>';
    bindCreateEvents();
  }

  function bindCreateEvents() {
    var nextMemberBtn = pageEl.querySelector('[data-pm-action="create-next-member"]');
    var nextResourceBtn = pageEl.querySelector('[data-pm-action="create-next-resource"]');
    var prevInfoBtn = pageEl.querySelector('[data-pm-action="create-prev-info"]');
    var prevMemberBtn = pageEl.querySelector('[data-pm-action="create-prev-member"]');
    var addMemberBtn = pageEl.querySelector('[data-pm-action="open-member-add"]');
    var finishBtn = pageEl.querySelector('[data-pm-action="create-finish"]');
    var cancelBtn = pageEl.querySelector('[data-pm-action="create-cancel"]');
    var returnProjectBtn = pageEl.querySelector('[data-pm-action="return-project-list"]');
    if (nextMemberBtn) nextMemberBtn.addEventListener('click', renderCreateMemberPage);
    if (nextResourceBtn) nextResourceBtn.addEventListener('click', renderCreateResourcePage);
    if (prevInfoBtn) prevInfoBtn.addEventListener('click', renderCreatePage);
    if (prevMemberBtn) prevMemberBtn.addEventListener('click', renderCreateMemberPage);
    if (addMemberBtn) addMemberBtn.addEventListener('click', function () { openMemberAddModal('dept'); });
    if (finishBtn) finishBtn.addEventListener('click', renderCreateCompletePage);
    if (cancelBtn) cancelBtn.addEventListener('click', function () { DP.showPage('project-mgr'); });
    if (returnProjectBtn) returnProjectBtn.addEventListener('click', function () { DP.showPage('project-mgr'); });
    bindResourceEvents();
  }

  function closeResourceDropdowns(except) {
    pageEl.querySelectorAll('.pm-res-select.open').forEach(function (item) {
      if (item !== except) item.classList.remove('open');
    });
  }

  function bindResourceEvents() {
    pageEl.querySelectorAll('.pm-res-select.has-dropdown').forEach(function (select) {
      if (select.dataset.bound) return;
      select.dataset.bound = 'true';
      select.addEventListener('click', function (event) {
        event.stopPropagation();
        var open = select.classList.contains('open');
        closeResourceDropdowns(select);
        select.classList.toggle('open', !open);
      });
    });

    pageEl.querySelectorAll('[data-pm-res-value]').forEach(function (option) {
      if (option.dataset.bound) return;
      option.dataset.bound = 'true';
      option.addEventListener('click', function (event) {
        event.stopPropagation();
        var select = option.closest('.pm-res-select');
        var label = select ? select.children[0] : null;
        if (label) label.textContent = option.dataset.pmResValue || option.textContent.trim();
        if (select) {
          select.classList.remove('placeholder');
          select.classList.remove('open');
        }
      });
    });

    pageEl.querySelectorAll('.pm-res-tree-search input').forEach(function (input) {
      if (input.dataset.bound) return;
      input.dataset.bound = 'true';
      input.addEventListener('click', function (event) { event.stopPropagation(); });
      input.addEventListener('keydown', function (event) { event.stopPropagation(); });
      input.addEventListener('input', function (event) {
        var dropdown = input.closest('.pm-res-dropdown');
        var keyword = input.value.trim().toLowerCase();
        if (!dropdown) return;
        dropdown.querySelectorAll('.pm-res-tree-row').forEach(function (row) {
          var text = row.dataset.pmSearchText || row.textContent.toLowerCase();
          row.style.display = !keyword || text.indexOf(keyword) > -1 ? '' : 'none';
        });
        event.stopPropagation();
      });
    });

    pageEl.querySelectorAll('[data-pm-action="resource-delete-row"]').forEach(function (btn) {
      if (btn.dataset.bound) return;
      btn.dataset.bound = 'true';
      btn.addEventListener('click', function () {
        var row = btn.closest('.pm-ds-row');
        if (row) row.remove();
      });
    });

    var addRowBtn = pageEl.querySelector('[data-pm-action="resource-add-row"]');
    var rows = pageEl.querySelector('.pm-datasource-rows');
    if (addRowBtn && rows) {
      if (!addRowBtn.dataset.bound) {
        addRowBtn.dataset.bound = 'true';
        addRowBtn.addEventListener('click', function () {
          rows.insertAdjacentHTML('beforeend', renderDatasourceRow(false));
          bindResourceEvents();
        });
      }
    }

    var resourceConfig = pageEl.querySelector('.pm-resource-config');
    if (resourceConfig && !resourceConfig.dataset.closeBound) {
      resourceConfig.dataset.closeBound = 'true';
      resourceConfig.addEventListener('click', function () { closeResourceDropdowns(); });
    }
  }

  function renderTreeRow(text, opts) {
    opts = opts || {};
    return '' +
      '<div class="pm-add-tree-row depth-' + (opts.depth || 0) + '">' +
        (opts.arrow ? '<i class="bi bi-chevron-down pm-add-arrow"></i>' : '<span class="pm-add-arrow"></span>') +
        (opts.checkbox ? '<input type="checkbox" ' + (opts.checked ? 'checked' : '') + '>' : '') +
        '<i class="bi ' + (opts.icon || 'bi-folder-fill') + ' ' + (opts.person ? 'person' : 'folder') + '"></i>' +
        '<span>' + escapeHtml(text) + '</span>' +
      '</div>';
  }

  function renderAddLeftTree(tab) {
    if (tab === 'user') {
      return '' +
        renderTreeRow('我的部门', { depth: 0, arrow: true, checkbox: true, checked: true }) +
        renderTreeRow('工程部', { depth: 1, arrow: true, checkbox: true, checked: true }) +
        renderTreeRow('王鹏', { depth: 2, checkbox: true, checked: true, icon: 'bi-person-vcard-fill', person: true }) +
        renderTreeRow('业务部', { depth: 1, arrow: true, checkbox: true, checked: true }) +
        renderTreeRow('张红彬', { depth: 2, checkbox: true, checked: true, icon: 'bi-person-vcard-fill', person: true }) +
        renderTreeRow('演示-测试', { depth: 1, checkbox: true, icon: 'bi-person-vcard-fill', person: true }) +
        renderTreeRow('王畅', { depth: 1, checkbox: true, checked: true, icon: 'bi-person-vcard-fill', person: true });
    }
    if (tab === 'role') {
      return '' +
        renderTreeRow('开发人员', { depth: 0, checkbox: true, checked: true, icon: 'bi-person-vcard-fill', person: true }) +
        renderTreeRow('超级管理员', { depth: 0, checkbox: true, icon: 'bi-person-vcard-fill', person: true }) +
        renderTreeRow('用户', { depth: 0, checkbox: true, checked: true, icon: 'bi-person-vcard-fill', person: true });
    }
    return '' +
      renderTreeRow('我的部门', { depth: 0, arrow: true, checkbox: true }) +
      renderTreeRow('工程部', { depth: 1, arrow: true, checkbox: true, checked: true }) +
      renderTreeRow('业务部', { depth: 1, arrow: true, checkbox: true, checked: true });
  }

  function renderAddSelectedTree(tab) {
    if (tab === 'user') {
      return '' +
        renderTreeRow('我的部门', { depth: 0, arrow: true }) +
        renderTreeRow('工程部', { depth: 1, arrow: true }) +
        renderTreeRow('王鹏', { depth: 2, icon: 'bi-person-vcard-fill', person: true }) +
        renderTreeRow('业务部', { depth: 1, arrow: true }) +
        renderTreeRow('张红彬', { depth: 2, icon: 'bi-person-vcard-fill', person: true }) +
        renderTreeRow('王畅', { depth: 1, icon: 'bi-person-vcard-fill', person: true });
    }
    if (tab === 'role') {
      return '' +
        renderTreeRow('开发人员', { depth: 0, icon: 'bi-person-vcard-fill', person: true }) +
        renderTreeRow('用户', { depth: 0, icon: 'bi-person-vcard-fill', person: true });
    }
    return '' +
      renderTreeRow('我的部门', { depth: 0, arrow: true }) +
      renderTreeRow('工程部', { depth: 1, arrow: true }) +
      renderTreeRow('业务部', { depth: 1, arrow: true });
  }

  function openMemberAddModal(tab) {
    var existed = pageEl.querySelector('.pm-add-modal-mask');
    if (existed) existed.remove();

    var selectedCount = tab === 'user' ? 3 : 2;
    var mask = document.createElement('div');
    mask.className = 'pm-add-modal-mask';
    mask.innerHTML = '' +
      '<div class="pm-add-member-modal">' +
        '<div class="pm-add-modal-head">' +
          '<div class="pm-add-tabs">' +
            '<button class="' + (tab === 'dept' ? 'active' : '') + '" data-member-add-tab="dept">按部门</button>' +
            '<button class="' + (tab === 'user' ? 'active' : '') + '" data-member-add-tab="user">按用户</button>' +
            '<button class="' + (tab === 'role' ? 'active' : '') + '" data-member-add-tab="role">按角色</button>' +
          '</div>' +
          '<button class="pm-add-close" data-member-add-close><i class="bi bi-x-lg"></i></button>' +
        '</div>' +
        '<div class="pm-add-modal-body">' +
          '<div class="pm-add-panel left">' +
            '<div class="pm-add-search"><input><i class="bi bi-search"></i></div>' +
            '<div class="pm-add-tree">' + renderAddLeftTree(tab) + '</div>' +
          '</div>' +
          '<div class="pm-add-panel right">' +
            '<div class="pm-add-selected-head"><span>已选择： ' + selectedCount + '</span><button data-member-add-clear>清空</button></div>' +
            '<div class="pm-add-tree selected">' + renderAddSelectedTree(tab) + '</div>' +
          '</div>' +
        '</div>' +
        '<div class="pm-add-modal-footer">' +
          '<button class="btn btn-outline" data-member-add-close>取消</button>' +
          '<button class="btn btn-primary" data-member-add-close>确定</button>' +
        '</div>' +
      '</div>';
    pageEl.appendChild(mask);
    document.body.classList.add('pm-add-modal-open');

    function closeModal() {
      mask.remove();
      document.body.classList.remove('pm-add-modal-open');
    }

    mask.querySelectorAll('[data-member-add-close]').forEach(function (btn) {
      btn.addEventListener('click', closeModal);
    });
    mask.querySelectorAll('[data-member-add-tab]').forEach(function (btn) {
      btn.addEventListener('click', function () { openMemberAddModal(btn.dataset.memberAddTab); });
    });
    var clearBtn = mask.querySelector('[data-member-add-clear]');
    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        mask.querySelector('.pm-add-selected-head span').textContent = '已选择： 0';
        mask.querySelector('.pm-add-tree.selected').innerHTML = '';
      });
    }
  }

  function bindEvents() {
    pageEl.querySelectorAll('.pm-tab').forEach(function (tab) {
      tab.addEventListener('click', function () {
        pageEl.querySelectorAll('.pm-tab').forEach(function (item) { item.classList.remove('active'); });
        tab.classList.add('active');
        activeTab = tab.dataset.pmTab || 'running';
        renderList();
      });
    });

    var searchInput = pageEl.querySelector('.pm-search-input');
    var searchBtn = pageEl.querySelector('[data-pm-action="search"]');
    var newProjectBtn = pageEl.querySelector('[data-pm-action="new-project"]');
    if (searchBtn) searchBtn.addEventListener('click', renderList);
    if (newProjectBtn) newProjectBtn.addEventListener('click', renderCreatePage);
    if (searchInput) {
      searchInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') renderList();
      });
    }
  }

  return {
    /* ---- HTML 模板 ---- */
    html: '<div class="page-project-mgr">' +

      /* 顶部：Tab + 搜索 + 新建 */
      '<div class="pm-header">' +
        '<div class="pm-tabs">' +
          '<a class="pm-tab active" data-pm-tab="running">进行中的项目</a>' +
          '<a class="pm-tab" data-pm-tab="pending">待审核项目</a>' +
          '<a class="pm-tab" data-pm-tab="closed">已关闭项目</a>' +
          '<a class="pm-tab" data-pm-tab="all">所有项目</a>' +
        '</div>' +
        '<div class="pm-header-right">' +
          '<div class="pm-search-box">' +
            '<input type="text" class="pm-search-input" placeholder="关键字查询">' +
            '<button class="btn btn-primary btn-sm" data-pm-action="search">查询</button>' +
          '</div>' +
          '<button class="btn btn-outline" data-pm-action="new-project"><i class="bi bi-plus-lg"></i> 新建项目</button>' +
        '</div>' +
      '</div>' +

      /* 项目卡片列表（网格） */
      '<div class="pm-card-list"></div>' +

      /* 分页 */
      '<div class="pm-pagination">' +
        '<span class="pm-page-total">共 0 条</span>' +
        '<div class="page-nav">' +
          '<a class="page-btn disabled">&lt;</a>' +
          '<a class="page-num active">1</a>' +
          '<a class="page-btn disabled">&gt;</a>' +
        '</div>' +
        '<div class="pm-page-size">' +
          '<select class="filter-select"><option>8 条/页</option><option>16 条/页</option><option>32 条/页</option></select>' +
        '</div>' +
        '<div class="pm-page-jump">' +
          '<span>跳至</span>' +
          '<input type="text" class="pm-page-jump-input" value="1">' +
          '<span>页</span>' +
        '</div>' +
      '</div>' +

    '</div>',

    /* ---- 页面交互初始化 ---- */
    init: function () {
      pageEl = document.querySelector('.page-project-mgr');
      if (!pageEl) return;
      activeTab = 'running';
      bindEvents();
      renderList();
    }
  };
})();
