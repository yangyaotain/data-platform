/**
 * 数据中台 V4.0 - 页面路由
 * 根据菜单键渲染对应页面内容
 */
window.DP = window.DP || {};

/**
 * 渲染指定页面
 * @param {string} menuKey - 页面标识
 * @param {object} opts    - 可选参数（如搜索关键词、搜索类型等）
 */
DP.showPage = function (menuKey, opts) {
  var c = DP.contentArea;
  if (!c) return;

  if (menuKey === 'datasource') {
    c.innerHTML = DP.pages.datasource.html;
    DP.pages.datasource.init();
  } else if (menuKey === 'project-mgr') {
    c.innerHTML = DP.pages.projectMgr.html;
    DP.pages.projectMgr.init();
  } else if (menuKey === '元数据搜索') {
    c.innerHTML = DP.pages.metaSearchHome.html;
    DP.pages.metaSearchHome.init();
  } else if (menuKey === '元数据搜索结果') {
    c.innerHTML = DP.pages.metaSearchResult.html;
    DP.pages.metaSearchResult.init(opts);
  } else {
    var activeNav = document.querySelector('.nav-item.active');
    var navName = activeNav ? activeNav.textContent.trim() : '';
    var menuName = menuKey || '';
    c.innerHTML =
      '<div class="content-placeholder">' +
        '<div class="placeholder-icon"><i class="bi bi-easel"></i></div>' +
        '<h2>' + navName + ' — ' + menuName + '</h2>' +
        '<p>页面内容待设计，当前选中：' + menuName + '。</p>' +
      '</div>';
  }
};

/**
 * 显示占位页面
 */
DP.showPlaceholder = function (title) {
  var c = DP.contentArea;
  if (!c) return;
  c.innerHTML =
    '<div class="content-placeholder">' +
      '<div class="placeholder-icon"><i class="bi bi-easel"></i></div>' +
      '<h2>' + title + '</h2>' +
      '<p>页面内容待设计，请选择左侧菜单项进行导航。</p>' +
    '</div>';
};
