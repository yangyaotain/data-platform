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
  } else if (menuKey === '技术元数据') {
    c.innerHTML = DP.pages.technicalMetadata.html;
    DP.pages.technicalMetadata.init();
  } else if (menuKey === '业务元数据') {
    c.innerHTML = DP.pages.businessMetadata.html;
    DP.pages.businessMetadata.init();
  } else if (menuKey === '业务代码') {
    c.innerHTML = DP.pages.businessCode.html;
    DP.pages.businessCode.init();
  } else if (menuKey === '数据标准') {
    c.innerHTML = DP.pages.dataStandard.html;
    DP.pages.dataStandard.init();
  } else if (menuKey === '标准代码') {
    c.innerHTML = DP.pages.standardCode.html;
    DP.pages.standardCode.init();
  } else if (menuKey === '元模型') {
    c.innerHTML = DP.pages.metaModel.html;
    DP.pages.metaModel.init();
  } else if (menuKey === '元数据监控') {
    DP.pages.metadataMonitor.init();
  } else if (menuKey === '同步记录') {
    c.innerHTML = DP.pages.syncRecord.html;
    DP.pages.syncRecord.init();
  } else if (menuKey === 'project-mgr') {
    c.innerHTML = DP.pages.projectMgr.html;
    DP.pages.projectMgr.init();
  } else if (menuKey === '数据开发') {
    c.innerHTML = DP.pages.dataDevelop.html;
    DP.pages.dataDevelop.init();
  } else if (menuKey === '资产概览') {
    c.innerHTML = DP.pages.metaSearchHome.html;
    DP.pages.metaSearchHome.init();
  } else if (menuKey === '治理规划') {
    c.innerHTML = DP.pages.governancePlan.html;
    DP.pages.governancePlan.init();
  } else if (menuKey === '治理任务') {
    c.innerHTML = DP.pages.governanceTask.html;
    DP.pages.governanceTask.init(opts);
  } else if (menuKey === '元数据审核') {
    c.innerHTML = DP.pages.metaAudit.html;
    DP.pages.metaAudit.init();
  } else if (menuKey === '标准审核' || menuKey === '标准稽查') {
    c.innerHTML = DP.pages.standardAudit.html;
    DP.pages.standardAudit.init();
  } else if (menuKey === '维度管理') {
    c.innerHTML = DP.pages.dimensionManagement.html;
    DP.pages.dimensionManagement.init();
  } else if (menuKey === '元数据搜索' || menuKey === '元数据搜索结果') {
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
