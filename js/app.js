/**
 * 数据中台 V4.0 - 主入口
 *
 * 依赖加载顺序：
 *   1. config.js       → 全局命名空间 & 菜单配置
 *   2. pages/*.js       → 各页面模板 & 交互
 *   3. sidebar.js       → 侧边栏逻辑
 *   4. router.js        → 页面路由
 *   5. app.js (本文件)  → 初始化入口
 */
document.addEventListener('DOMContentLoaded', function () {

  /* ---- 缓存内容区域引用 ---- */
  DP.contentArea = document.getElementById('contentArea');

  /* ---- 轻量 hash 路由：刷新后恢复当前模块/页面 ---- */
  function getNodeText(el) {
    if (!el) return '';
    var span = el.querySelector('span');
    return (span ? span.textContent : el.textContent).trim();
  }

  function getActiveNavKey() {
    var activeNav = document.querySelector('.nav-item.active');
    return activeNav ? activeNav.dataset.page : '';
  }

  function getNavKeyByGroupId(groupId) {
    for (var key in DP.menuGroupMap) {
      if (Object.prototype.hasOwnProperty.call(DP.menuGroupMap, key) && DP.menuGroupMap[key] === groupId) {
        return key;
      }
    }
    return '';
  }

  function getNavKeyByMenuLink(link) {
    var group = link ? link.closest('.menu-group') : null;
    return group ? getNavKeyByGroupId(group.id) : '';
  }

  function parseHashRoute() {
    var hash = (location.hash || '').replace(/^#/, '');
    if (!hash) return null;

    var params = new URLSearchParams(hash);
    var page = params.get('page');
    var nav = params.get('nav');
    if (!page && hash.indexOf('=') < 0) {
      page = decodeURIComponent(hash);
    }

    if (!page) return null;
    return { nav: nav || '', page: page };
  }

  function normalizeRoutePage(route) {
    if (!route) return '';
    if (route.page === 'data-develop') {
      route.nav = route.nav || 'develop';
      return '数据开发';
    }
    return route.page;
  }

  function findMenuLink(menuKey, navKey) {
    var scope = document;
    if (navKey && DP.menuGroupMap[navKey]) {
      scope = document.getElementById(DP.menuGroupMap[navKey]) || document;
    }

    return Array.prototype.find.call(scope.querySelectorAll('.menu-link, .sub-menu li a'), function (link) {
      return link.dataset.menu === menuKey || getNodeText(link) === menuKey;
    }) || null;
  }

  function getRenderableMenuKey(link, fallbackKey) {
    var menuKey = link ? (link.dataset.menu || '') : '';
    var menuText = getNodeText(link);
    if (!link) return fallbackKey || '';
    if (link.closest('.sub-menu')) return menuKey || menuText || fallbackKey;
    if (menuKey === 'datasource' || menuKey === 'project-mgr' || menuKey === 'svc-api-dev') return menuKey;
    return menuText || menuKey || fallbackKey;
  }

  function activateNavOnly(navKey) {
    if (!navKey) return false;
    var nav = document.querySelector('.nav-item[data-page="' + navKey + '"]');
    if (!nav) return false;

    navItems.forEach(function (n) { n.classList.remove('active'); });
    nav.classList.add('active');
    DP.switchMenuGroup(navKey);
    return true;
  }

  function activateMenuLink(link) {
    if (!link) return;
    var parent = link.closest('.menu-item.has-sub');
    if (parent) parent.classList.add('open');
    DP.setActiveMenu(link);
  }

  DP.rememberRoute = function (menuKey, navKey) {
    if (!menuKey) return;
    var currentNav = navKey || getActiveNavKey();
    var params = new URLSearchParams();
    if (currentNav) params.set('nav', currentNav);
    params.set('page', menuKey);

    var nextHash = '#' + params.toString();
    if (location.hash === nextHash) return;
    history.replaceState(null, '', location.pathname + location.search + nextHash);
  };

  var rawShowPage = DP.showPage;
  DP.showPage = function (menuKey, opts) {
    rawShowPage.call(DP, menuKey, opts);
    if (!opts || !opts.skipRoute) {
      DP.rememberRoute(menuKey);
    }
  };

  var rawShowPlaceholder = DP.showPlaceholder;
  DP.showPlaceholder = function (title, opts) {
    rawShowPlaceholder.call(DP, title);
    if (!opts || !opts.skipRoute) {
      DP.rememberRoute(title);
    }
  };

  function restoreRouteFromHash() {
    var route = parseHashRoute();
    if (!route) return false;

    var pageKey = normalizeRoutePage(route);
    var link = findMenuLink(pageKey, route.nav);
    var navKey = route.nav || getNavKeyByMenuLink(link);

    if (navKey) {
      activateNavOnly(navKey);
      if (!link) link = findMenuLink(pageKey, navKey);
    }

    if (link) {
      activateMenuLink(link);
      DP.showPage(getRenderableMenuKey(link, pageKey));
    } else {
      DP.showPage(pageKey);
    }

    return true;
  }

  /* ---- 顶部导航切换 ---- */
  var navItems = document.querySelectorAll('.nav-item');

  navItems.forEach(function (item) {
    item.addEventListener('click', function () {
      var page = item.dataset.page;

      if (page === 'datamap') {
        var baseUrl = location.href.replace(/#.*$/, '');
        var params = new URLSearchParams();
        params.set('nav', 'datamap');
        params.set('page', 'datamap-home');
        window.open(baseUrl + '#' + params.toString(), '_blank');
        return;
      }

      // 切换激活态
      navItems.forEach(function (n) { n.classList.remove('active'); });
      item.classList.add('active');

      var name = DP.navNames[page] || page;

      // 切换侧边栏菜单组
      DP.switchMenuGroup(page);

      // 根据模块加载默认页面
      if (page === 'governance') {
        // 数据资产 → 默认选中"数据源"
        var dsLink = document.querySelector('[data-menu="datasource"]');
        if (dsLink) dsLink.classList.add('active');
        DP.showPage('datasource');
      } else if (page === 'governance-ops') {
        // 数据治理 → 默认进入"资产概览"
        var govOverviewLink = document.querySelector('[data-menu="governance-overview"]');
        if (govOverviewLink) govOverviewLink.classList.add('active');
        DP.showPage('资产概览');
      } else if (page === 'workbench') {
        // 控制台 → 默认选中"项目管理"
        var pmLink = document.querySelector('[data-menu="project-mgr"]');
        if (pmLink) pmLink.classList.add('active');
        DP.showPage('project-mgr');
      } else if (page === 'develop') {
        var devLink = document.querySelector('[data-menu="dev-develop"]');
        if (devLink) devLink.classList.add('active');
        DP.showPage('数据开发');
      } else if (page === 'service') {
        var serviceApiDevLink = document.querySelector('[data-menu="svc-api-dev"]');
        if (serviceApiDevLink) serviceApiDevLink.classList.add('active');
        DP.showPage('svc-api-dev');
      } else if (page === 'analysis') {
        var dimLink = Array.prototype.find.call(document.querySelectorAll('#menuAnalysis .sub-menu li a'), function (link) {
          return link.textContent.trim() === '维度管理';
        });
        if (dimLink) {
          var dimParent = dimLink.closest('.menu-item.has-sub');
          if (dimParent) dimParent.classList.add('open');
          dimLink.classList.add('active');
          DP.showPage('维度管理');
        } else {
          DP.showPlaceholder(name);
        }
      } else {
        // 通用逻辑：激活第一个菜单项
        var groupId = DP.menuGroupMap[page];
        if (groupId) {
          var group = document.getElementById(groupId);
          if (group) {
            var firstItem = group.querySelector('.menu-item');
            if (firstItem && firstItem.classList.contains('has-sub')) {
              firstItem.classList.add('open');
              var firstSub = firstItem.querySelector('.sub-menu li a');
              if (firstSub) {
                firstSub.classList.add('active');
                DP.showPlaceholder(firstSub.textContent);
              } else {
                DP.showPlaceholder(name);
              }
            } else if (firstItem) {
              var firstLink = firstItem.querySelector('.menu-link');
              if (firstLink) {
                firstLink.classList.add('active');
                var span = firstLink.querySelector('span');
                DP.showPlaceholder(span ? span.textContent : name);
              }
            } else {
              DP.showPlaceholder(name);
            }
          } else {
            DP.showPlaceholder(name);
          }
        } else {
          DP.showPlaceholder(name);
        }
      }
    });
  });

  /* ---- 初始化侧边栏 ---- */
  DP.initSidebar();

  /* ---- 初始化项目选择器 ---- */
  DP.initProjectSelector();

  /* ---- 初始化 AI 助手 ---- */
  DP.initAiAssistant();

  /* ---- 根据 hash 参数或默认加载页面 ---- */
  if (!restoreRouteFromHash()) {
    var workbenchNav = document.querySelector('[data-page="workbench"]');
    if (workbenchNav) {
      workbenchNav.click();
    } else {
      DP.showPage('project-mgr');
    }
  }
});
