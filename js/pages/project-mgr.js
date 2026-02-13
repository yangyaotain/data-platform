/**
 * 数据中台 V4.0 - 控制台 · 项目管理页面
 * 卡片式项目列表 + Tab筛选 + 搜索 + 分页
 */
window.DP = window.DP || {};
DP.pages = DP.pages || {};

DP.pages.projectMgr = {

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
          '<button class="btn btn-primary btn-sm">查询</button>' +
        '</div>' +
        '<button class="btn btn-outline"><i class="bi bi-plus-lg"></i> 新建项目</button>' +
      '</div>' +
    '</div>' +

    /* 项目卡片列表（网格） */
    '<div class="pm-card-list">' +

      /* 1 */
      '<div class="pm-card">' +
        '<div class="pm-card-top">' +
          '<div class="pm-card-title"><span class="pm-card-icon" style="background:linear-gradient(135deg,#1890ff,#36cfc9);"><i class="bi bi-box-seam"></i></span><span class="pm-card-name">物流数仓项目</span></div>' +
          '<label class="pm-switch"><input type="checkbox" checked><span class="pm-switch-slider"></span></label>' +
        '</div>' +
        '<div class="pm-card-info"><span class="pm-card-meta"><i class="bi bi-person"></i> ShangsValley_admin</span><span class="pm-card-meta"><i class="bi bi-calendar3"></i> 2023-07-18</span></div>' +
        '<div class="pm-card-foot"><a class="pm-card-link" href="javascript:;">项目开发</a><span class="pm-card-sep">|</span><a class="pm-card-link" href="javascript:;">项目变更</a></div>' +
      '</div>' +

      /* 2 */
      '<div class="pm-card">' +
        '<div class="pm-card-top">' +
          '<div class="pm-card-title"><span class="pm-card-icon" style="background:linear-gradient(135deg,#722ed1,#b37feb);"><i class="bi bi-graph-up-arrow"></i></span><span class="pm-card-name">营销分析平台</span></div>' +
          '<label class="pm-switch"><input type="checkbox" checked><span class="pm-switch-slider"></span></label>' +
        '</div>' +
        '<div class="pm-card-info"><span class="pm-card-meta"><i class="bi bi-person"></i> DataTeam_zhangsan</span><span class="pm-card-meta"><i class="bi bi-calendar3"></i> 2024-03-05</span></div>' +
        '<div class="pm-card-foot"><a class="pm-card-link" href="javascript:;">项目开发</a><span class="pm-card-sep">|</span><a class="pm-card-link" href="javascript:;">项目变更</a></div>' +
      '</div>' +

      /* 3 */
      '<div class="pm-card">' +
        '<div class="pm-card-top">' +
          '<div class="pm-card-title"><span class="pm-card-icon" style="background:linear-gradient(135deg,#13c2c2,#87e8de);"><i class="bi bi-database"></i></span><span class="pm-card-name">用户画像中心</span></div>' +
          '<label class="pm-switch"><input type="checkbox" checked><span class="pm-switch-slider"></span></label>' +
        '</div>' +
        '<div class="pm-card-info"><span class="pm-card-meta"><i class="bi bi-person"></i> analyst_lisi</span><span class="pm-card-meta"><i class="bi bi-calendar3"></i> 2024-01-12</span></div>' +
        '<div class="pm-card-foot"><a class="pm-card-link" href="javascript:;">项目开发</a><span class="pm-card-sep">|</span><a class="pm-card-link" href="javascript:;">项目变更</a></div>' +
      '</div>' +

      /* 4 */
      '<div class="pm-card">' +
        '<div class="pm-card-top">' +
          '<div class="pm-card-title"><span class="pm-card-icon" style="background:linear-gradient(135deg,#eb2f96,#ff85c0);"><i class="bi bi-cart3"></i></span><span class="pm-card-name">电商交易数仓</span></div>' +
          '<label class="pm-switch"><input type="checkbox" checked><span class="pm-switch-slider"></span></label>' +
        '</div>' +
        '<div class="pm-card-info"><span class="pm-card-meta"><i class="bi bi-person"></i> dev_wangwu</span><span class="pm-card-meta"><i class="bi bi-calendar3"></i> 2023-11-20</span></div>' +
        '<div class="pm-card-foot"><a class="pm-card-link" href="javascript:;">项目开发</a><span class="pm-card-sep">|</span><a class="pm-card-link" href="javascript:;">项目变更</a></div>' +
      '</div>' +

      /* 5 */
      '<div class="pm-card">' +
        '<div class="pm-card-top">' +
          '<div class="pm-card-title"><span class="pm-card-icon" style="background:linear-gradient(135deg,#fa8c16,#ffc069);"><i class="bi bi-bar-chart-line"></i></span><span class="pm-card-name">财务报表平台</span></div>' +
          '<label class="pm-switch"><input type="checkbox"><span class="pm-switch-slider"></span></label>' +
        '</div>' +
        '<div class="pm-card-info"><span class="pm-card-meta"><i class="bi bi-person"></i> finance_zhaoliu</span><span class="pm-card-meta"><i class="bi bi-calendar3"></i> 2023-09-08</span></div>' +
        '<div class="pm-card-foot"><a class="pm-card-link" href="javascript:;">项目开发</a><span class="pm-card-sep">|</span><a class="pm-card-link" href="javascript:;">项目变更</a></div>' +
      '</div>' +

      /* 6 */
      '<div class="pm-card">' +
        '<div class="pm-card-top">' +
          '<div class="pm-card-title"><span class="pm-card-icon" style="background:linear-gradient(135deg,#52c41a,#95de64);"><i class="bi bi-speedometer2"></i></span><span class="pm-card-name">实时监控大屏</span></div>' +
          '<label class="pm-switch"><input type="checkbox" checked><span class="pm-switch-slider"></span></label>' +
        '</div>' +
        '<div class="pm-card-info"><span class="pm-card-meta"><i class="bi bi-person"></i> ops_sunqi</span><span class="pm-card-meta"><i class="bi bi-calendar3"></i> 2024-06-15</span></div>' +
        '<div class="pm-card-foot"><a class="pm-card-link" href="javascript:;">项目开发</a><span class="pm-card-sep">|</span><a class="pm-card-link" href="javascript:;">项目变更</a></div>' +
      '</div>' +

      /* 7 */
      '<div class="pm-card">' +
        '<div class="pm-card-top">' +
          '<div class="pm-card-title"><span class="pm-card-icon" style="background:linear-gradient(135deg,#2f54eb,#85a5ff);"><i class="bi bi-people"></i></span><span class="pm-card-name">HR人事数据</span></div>' +
          '<label class="pm-switch"><input type="checkbox" checked><span class="pm-switch-slider"></span></label>' +
        '</div>' +
        '<div class="pm-card-info"><span class="pm-card-meta"><i class="bi bi-person"></i> hr_admin</span><span class="pm-card-meta"><i class="bi bi-calendar3"></i> 2024-02-28</span></div>' +
        '<div class="pm-card-foot"><a class="pm-card-link" href="javascript:;">项目开发</a><span class="pm-card-sep">|</span><a class="pm-card-link" href="javascript:;">项目变更</a></div>' +
      '</div>' +

      /* 8 */
      '<div class="pm-card">' +
        '<div class="pm-card-top">' +
          '<div class="pm-card-title"><span class="pm-card-icon" style="background:linear-gradient(135deg,#f5222d,#ff7875);"><i class="bi bi-shield-check"></i></span><span class="pm-card-name">风控数据平台</span></div>' +
          '<label class="pm-switch"><input type="checkbox" checked><span class="pm-switch-slider"></span></label>' +
        '</div>' +
        '<div class="pm-card-info"><span class="pm-card-meta"><i class="bi bi-person"></i> risk_chenba</span><span class="pm-card-meta"><i class="bi bi-calendar3"></i> 2024-04-10</span></div>' +
        '<div class="pm-card-foot"><a class="pm-card-link" href="javascript:;">项目开发</a><span class="pm-card-sep">|</span><a class="pm-card-link" href="javascript:;">项目变更</a></div>' +
      '</div>' +

      /* 9 */
      '<div class="pm-card">' +
        '<div class="pm-card-top">' +
          '<div class="pm-card-title"><span class="pm-card-icon" style="background:linear-gradient(135deg,#faad14,#ffe58f);"><i class="bi bi-truck"></i></span><span class="pm-card-name">供应链分析</span></div>' +
          '<label class="pm-switch"><input type="checkbox"><span class="pm-switch-slider"></span></label>' +
        '</div>' +
        '<div class="pm-card-info"><span class="pm-card-meta"><i class="bi bi-person"></i> scm_zhoujiu</span><span class="pm-card-meta"><i class="bi bi-calendar3"></i> 2023-12-01</span></div>' +
        '<div class="pm-card-foot"><a class="pm-card-link" href="javascript:;">项目开发</a><span class="pm-card-sep">|</span><a class="pm-card-link" href="javascript:;">项目变更</a></div>' +
      '</div>' +

      /* 10 */
      '<div class="pm-card">' +
        '<div class="pm-card-top">' +
          '<div class="pm-card-title"><span class="pm-card-icon" style="background:linear-gradient(135deg,#597ef7,#adc6ff);"><i class="bi bi-cloud-arrow-up"></i></span><span class="pm-card-name">数据湖迁移</span></div>' +
          '<label class="pm-switch"><input type="checkbox" checked><span class="pm-switch-slider"></span></label>' +
        '</div>' +
        '<div class="pm-card-info"><span class="pm-card-meta"><i class="bi bi-person"></i> infra_wushi</span><span class="pm-card-meta"><i class="bi bi-calendar3"></i> 2025-01-06</span></div>' +
        '<div class="pm-card-foot"><a class="pm-card-link" href="javascript:;">项目开发</a><span class="pm-card-sep">|</span><a class="pm-card-link" href="javascript:;">项目变更</a></div>' +
      '</div>' +

    '</div>' +

    /* 分页 */
    '<div class="pm-pagination">' +
      '<span class="pm-page-total">共 10 条</span>' +
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
    var page = document.querySelector('.page-project-mgr');
    if (!page) return;

    /* Tab 切换 */
    var tabs = page.querySelectorAll('.pm-tab');
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');
      });
    });

    /* 开关切换 */
    page.querySelectorAll('.pm-switch input').forEach(function (sw) {
      sw.addEventListener('change', function () {
        // 切换视觉反馈（纯前端演示）
      });
    });
  }
};
