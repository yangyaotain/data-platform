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

  /* ---- 顶部导航切换 ---- */
  var navItems = document.querySelectorAll('.nav-item');

  navItems.forEach(function (item) {
    item.addEventListener('click', function () {
      // 切换激活态
      navItems.forEach(function (n) { n.classList.remove('active'); });
      item.classList.add('active');

      var page = item.dataset.page;
      var name = DP.navNames[page] || page;

      // 切换侧边栏菜单组
      DP.switchMenuGroup(page);

      // 根据模块加载默认页面
      if (page === 'governance') {
        // 数据资产 → 默认选中"数据源"
        var dsLink = document.querySelector('[data-menu="datasource"]');
        if (dsLink) dsLink.classList.add('active');
        DP.showPage('datasource');
      } else if (page === 'workbench') {
        // 控制台 → 默认选中"项目管理"
        var pmLink = document.querySelector('[data-menu="project-mgr"]');
        if (pmLink) pmLink.classList.add('active');
        DP.showPage('project-mgr');
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

  /* ---- 加载默认页面（数据资产 - 数据源） ---- */
  DP.showPage('datasource');
});
