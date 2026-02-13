/**
 * 数据中台 V4.0 - 侧边栏
 * 菜单切换、菜单交互、侧边栏收起、项目选择器
 */
window.DP = window.DP || {};

/**
 * 切换菜单组（顶部导航切换时调用）
 */
DP.switchMenuGroup = function (page) {
  // 隐藏所有菜单组
  document.querySelectorAll('.menu-group').forEach(function (g) { g.style.display = 'none'; });
  // 隐藏所有额外组件
  document.querySelectorAll('.menu-group-extra').forEach(function (e) { e.style.display = 'none'; });
  // 显示对应菜单组
  var targetId = DP.menuGroupMap[page];
  if (targetId) {
    var target = document.getElementById(targetId);
    if (target) target.style.display = 'block';
  }
  // 显示对应额外组件
  var extraId = DP.menuGroupExtraMap[page];
  if (extraId) {
    var extra = document.getElementById(extraId);
    if (extra) extra.style.display = 'block';
  }
  // 清除所有菜单激活状态
  document.querySelectorAll('.menu-link.active').forEach(function (el) { el.classList.remove('active'); });
  document.querySelectorAll('.sub-menu li a.active').forEach(function (el) { el.classList.remove('active'); });
  // 关闭展开的子菜单
  document.querySelectorAll('.menu-item.open').forEach(function (el) { el.classList.remove('open'); });
};

/**
 * 设置菜单激活状态
 */
DP.setActiveMenu = function (activeEl) {
  document.querySelectorAll('.menu-link.active').forEach(function (el) { el.classList.remove('active'); });
  document.querySelectorAll('.sub-menu li a.active').forEach(function (el) { el.classList.remove('active'); });
  activeEl.classList.add('active');
};

/**
 * 初始化侧边栏菜单交互
 */
DP.initSidebar = function () {
  // 一级菜单点击
  document.querySelectorAll('.side-menu > .menu-item').forEach(function (item) {
    var link = item.querySelector('.menu-link');
    link.addEventListener('click', function () {
      if (item.classList.contains('has-sub')) {
        item.classList.toggle('open');
      } else {
        DP.setActiveMenu(link);
        var menuKey = link.dataset.menu || '';
        var menuText = link.querySelector('span') ? link.querySelector('span').textContent : '';
        if (menuKey === 'datasource') {
          DP.showPage('datasource');
        } else {
          DP.showPage(menuText);
        }
      }
    });
  });

  // 二级菜单点击
  document.querySelectorAll('.sub-menu li a').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.stopPropagation();
      DP.setActiveMenu(link);
      DP.showPage(link.textContent);
    });
  });

  // 侧边栏收起/展开
  var sidebar = document.getElementById('sidebar');
  var sidebarToggle = document.getElementById('sidebarToggle');
  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', function () {
      sidebar.classList.toggle('collapsed');
    });
  }

  // 收起态 Tooltip
  document.querySelectorAll('.menu-link').forEach(function (link) {
    var span = link.querySelector('span');
    var text = span ? span.textContent : '';
    link.setAttribute('data-tooltip', text);
  });
};

/**
 * 初始化项目/环境选择器
 */
DP.initProjectSelector = function () {
  var devProjCurrent = document.getElementById('devProjCurrent');
  var devProjSelector = document.getElementById('devProjectSelector');
  if (!devProjCurrent || !devProjSelector) return;

  // 展开/收起下拉
  devProjCurrent.addEventListener('click', function () {
    devProjSelector.classList.toggle('open');
  });

  // 点击外部关闭
  document.addEventListener('click', function (e) {
    if (!devProjSelector.contains(e.target)) {
      devProjSelector.classList.remove('open');
    }
  });

  // 左侧项目 hover → 切换右侧环境面板
  devProjSelector.querySelectorAll('.dev-proj-item').forEach(function (item) {
    item.addEventListener('mouseenter', function () {
      devProjSelector.querySelectorAll('.dev-proj-item').forEach(function (i) { i.classList.remove('active'); });
      item.classList.add('active');
      var projName = item.dataset.proj;
      devProjSelector.querySelectorAll('.dev-env-group').forEach(function (g) { g.classList.remove('active'); });
      var target = devProjSelector.querySelector('.dev-env-group[data-proj="' + projName + '"]');
      if (target) target.classList.add('active');
    });
  });

  // 搜索过滤项目
  var devSearchInput = document.getElementById('devProjSearchInput');
  if (devSearchInput) {
    devSearchInput.addEventListener('input', function () {
      var keyword = devSearchInput.value.trim().toLowerCase();
      devProjSelector.querySelectorAll('.dev-proj-item').forEach(function (item) {
        var span = item.querySelector('span');
        var name = span ? span.textContent.toLowerCase() : '';
        item.style.display = name.indexOf(keyword) >= 0 ? 'flex' : 'none';
      });
      // 自动激活第一个可见项目
      var firstVisible = devProjSelector.querySelector('.dev-proj-item[style*="flex"], .dev-proj-item:not([style*="none"])');
      if (firstVisible) firstVisible.dispatchEvent(new Event('mouseenter'));
    });
  }

  // 环境选择
  devProjSelector.querySelectorAll('.dev-proj-env').forEach(function (env) {
    env.addEventListener('click', function () {
      devProjSelector.querySelectorAll('.dev-proj-env').forEach(function (e) { e.classList.remove('active'); });
      env.classList.add('active');
      var projName = env.closest('.dev-env-group').dataset.proj;
      var envName = env.dataset.env;
      document.querySelector('.dev-proj-text').textContent = projName + ' / ' + envName;
      devProjSelector.classList.remove('open');
    });
  });
};
