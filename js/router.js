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
  if (DP.pages.requirements) DP.pages.requirements.destroy();

  document.body.classList.toggle('datamap-standalone', menuKey === 'datamap-home' || menuKey === '数据地图');
  if (DP.setProjectSelectorMode) {
    DP.setProjectSelectorMode(menuKey === 'dev-code-search' || menuKey === '代码检索' ? 'search' : 'context');
  }

  if (menuKey === 'datasource') {
    c.innerHTML = DP.pages.datasource.html;
    DP.pages.datasource.init();
  } else if (menuKey === 'business-layer' || menuKey === 'biz-category' || menuKey === '业务分层' || menuKey === '业务分类') {
    c.innerHTML = DP.pages.businessLayer.html;
    DP.pages.businessLayer.init();
  } else if (menuKey === 'big-data-account' || menuKey === '大数据账号') {
    c.innerHTML = DP.pages.bigDataService.html;
    DP.pages.bigDataService.init('account');
  } else if (menuKey === 'big-data-cluster' || menuKey === '集群配置') {
    c.innerHTML = DP.pages.bigDataService.html;
    DP.pages.bigDataService.init('cluster');
  } else if (menuKey === 'data-modeling-plan' || menuKey === '数仓规划') {
    c.innerHTML = DP.pages.dataModeling.html;
    DP.pages.dataModeling.init('plan', opts);
  } else if (menuKey === 'data-modeling-model') {
    c.innerHTML = DP.pages.dataModeling.html;
    DP.pages.dataModeling.init('model', opts);
  } else if (menuKey === 'data-modeling-materialization' || menuKey === '物化管理') {
    c.innerHTML = DP.pages.dataModeling.html;
    DP.pages.dataModeling.init('material', opts);
  } else if (menuKey === 'data-modeling-reverse' || menuKey === '逆向建模') {
    c.innerHTML = DP.pages.dataModeling.html;
    DP.pages.dataModeling.init('reverse', opts);
  } else if (menuKey === 'data-permission-config' || menuKey === '权限配置') {
    c.innerHTML = DP.pages.dataPermission.html;
    DP.pages.dataPermission.init('permission');
  } else if (menuKey === 'data-permission-domain' || menuKey === '分权分域') {
    c.innerHTML = DP.pages.dataPermission.html;
    DP.pages.dataPermission.init('domain');
  } else if (menuKey === 'perm-role' || menuKey === '角色管理') {
    c.innerHTML = DP.pages.permissionManagement.html;
    DP.pages.permissionManagement.init('role');
  } else if (menuKey === 'perm-user' || menuKey === '用户管理') {
    c.innerHTML = DP.pages.permissionManagement.html;
    DP.pages.permissionManagement.init('user');
  } else if (menuKey === 'perm-system' || menuKey === '系统管理') {
    c.innerHTML = DP.pages.permissionManagement.html;
    DP.pages.permissionManagement.init('system');
  } else if (menuKey === 'class-management' || menuKey === '分类管理') {
    c.innerHTML = DP.pages.dataClassGrade.html;
    DP.pages.dataClassGrade.init('class');
  } else if (menuKey === 'grade-management' || menuKey === '分级管理') {
    c.innerHTML = DP.pages.dataClassGrade.html;
    DP.pages.dataClassGrade.init('grade');
  } else if (menuKey === 'security-mask-rule' || menuKey === '脱敏规则') {
    c.innerHTML = DP.pages.dataSecurity.html;
    DP.pages.dataSecurity.init('mask');
  } else if (menuKey === 'security-crypto-rule' || menuKey === '加密规则') {
    c.innerHTML = DP.pages.dataSecurity.html;
    DP.pages.dataSecurity.init('crypto');
  } else if (menuKey === 'security-management' || menuKey === '安全管理') {
    c.innerHTML = DP.pages.dataSecurity.html;
    DP.pages.dataSecurity.init('management');
  } else if (menuKey === 'lineage' || menuKey === '血缘关系') {
    c.innerHTML = DP.pages.lineage.html;
    DP.pages.lineage.init();
  } else if (menuKey === 'system-data-source-type' || menuKey === '配置管理') {
    c.innerHTML = DP.pages.systemManagement.html;
    DP.pages.systemManagement.init('source-type');
  } else if (menuKey === 'system-recycle-bin' || menuKey === '回收站') {
    c.innerHTML = DP.pages.systemManagement.html;
    DP.pages.systemManagement.init('recycle-bin');
  } else if (menuKey === 'datamap-home' || menuKey === '数据地图') {
    c.innerHTML = DP.pages.dataMapHome.html;
    DP.pages.dataMapHome.init(opts);
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
  } else if (menuKey === 'my-ticket' || menuKey === '我的工单') {
    c.innerHTML = DP.pages.myTicket.html;
    DP.pages.myTicket.init();
  } else if (menuKey === 'doc-mgr' || menuKey === '文档管理') {
    c.innerHTML = DP.pages.documentManagement.html;
    DP.pages.documentManagement.init();
  } else if (menuKey === 'flow-mgr' || menuKey === '流程管理') {
    c.innerHTML = DP.pages.processManagement.html;
    DP.pages.processManagement.init();
  } else if (menuKey === 'flow-config' || menuKey === '流程配置') {
    c.innerHTML = DP.pages.processConfig.html;
    DP.pages.processConfig.init();
  } else if (menuKey === 'console-operation-log') {
    c.innerHTML = DP.pages.operationLog.html;
    DP.pages.operationLog.init();
  } else if (menuKey === 'console-sql-audit-log') {
    c.innerHTML = DP.pages.sqlAuditLog.html;
    DP.pages.sqlAuditLog.init();
  } else if (typeof menuKey === 'string' && menuKey.indexOf('requirements-') === 0) {
    c.innerHTML = DP.pages.requirements.html;
    DP.pages.requirements.init(menuKey.slice('requirements-'.length));
  } else if (menuKey === 'monitor-items' || menuKey === '监控事项') {
    c.innerHTML = DP.pages.monitorItems.html;
    DP.pages.monitorItems.init();
  } else if (menuKey === 'notification-rules' || menuKey === '通知规则') {
    c.innerHTML = DP.pages.notificationRules.html;
    DP.pages.notificationRules.init();
  } else if (menuKey === 'notification-center' || menuKey === '通知中心') {
    c.innerHTML = DP.pages.notificationCenter.html;
    DP.pages.notificationCenter.init();
  } else if (menuKey === 'monitor-center' || menuKey === '监控中心') {
    c.innerHTML = DP.pages.monitorCenter.html;
    DP.pages.monitorCenter.init();
  } else if (menuKey === 'platform-overview' || menuKey === '平台概况') {
    c.innerHTML = DP.pages.platformOverview.html;
    DP.pages.platformOverview.init();
  } else if (menuKey === 'monitor-overview' || menuKey === '监控概览') {
    c.innerHTML = DP.pages.monitorOverview.html;
    DP.pages.monitorOverview.init();
  } else if (menuKey === 'api-overview' || menuKey === 'API概览') {
    c.innerHTML = DP.pages.apiOverview.html;
    DP.pages.apiOverview.init();
  } else if (menuKey === 'collection-monitor' || menuKey === '采集监控') {
    c.innerHTML = DP.pages.collectionMonitor.html;
    DP.pages.collectionMonitor.init();
  } else if (menuKey === 'batch-processing' || menuKey === '批量处理') {
    c.innerHTML = DP.pages.batchProcessing.html;
    DP.pages.batchProcessing.init();
  } else if (menuKey === 'monitor-config-management') {
    c.innerHTML = DP.pages.monitorConfigManagement.html;
    DP.pages.monitorConfigManagement.init();
  } else if (menuKey === '数据开发') {
    c.innerHTML = DP.pages.dataDevelop.html;
    DP.pages.dataDevelop.init(opts || {});
  } else if (menuKey === 'explore-main' || menuKey === '数据探索') {
    c.innerHTML = DP.pages.dataExplore.html;
    DP.pages.dataExplore.init(opts || {});
  } else if (menuKey === 'dev-schedule' || menuKey === '调度管理') {
    c.innerHTML = DP.pages.scheduleManagement.html;
    DP.pages.scheduleManagement.init(opts || {});
  } else if (menuKey === 'dev-config' || menuKey === '开发配置') {
    c.innerHTML = DP.pages.developmentConfig.html;
    DP.pages.developmentConfig.init(opts || {});
  } else if (menuKey === 'dev-file' || menuKey === '文件中心') {
    c.innerHTML = DP.pages.fileCenter.html;
    DP.pages.fileCenter.init(opts || {});
  } else if (menuKey === 'dev-recycle') {
    c.innerHTML = DP.pages.developmentRecycle.html;
    DP.pages.developmentRecycle.init(opts || {});
  } else if (menuKey === 'dev-code-search' || menuKey === '代码检索') {
    c.innerHTML = DP.pages.codeSearch.html;
    DP.pages.codeSearch.init(opts || {});
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
  } else if (menuKey === 'quality-analysis' || menuKey === '质量分析') {
    c.innerHTML = DP.pages.dataQualityAnalysis.html;
    DP.pages.dataQualityAnalysis.init();
  } else if (menuKey === 'quality-rule' || menuKey === '质量规则') {
    c.innerHTML = DP.pages.dataQualityRule.html;
    DP.pages.dataQualityRule.init();
  } else if (menuKey === 'quality-inspect-report' || menuKey === '稽查报告') {
    c.innerHTML = DP.pages.qualityInspectReport.html;
    DP.pages.qualityInspectReport.init({
      section: 'report',
      configKeyword: opts && opts.configKeyword
    });
  } else if (menuKey === 'quality-report-send' || menuKey === '报告发送') {
    c.innerHTML = DP.pages.qualityReportSend.html;
    DP.pages.qualityReportSend.init(opts || {});
  } else if (menuKey === 'quality-inspect-schedule' || menuKey === '任务调度') {
    c.innerHTML = DP.pages.qualityInspectReport.html;
    DP.pages.qualityInspectReport.init({
      section: 'schedule',
      configKeyword: opts && opts.configKeyword
    });
  } else if (menuKey === 'quality-inspect-task' || menuKey === '任务配置' || menuKey === '稽查任务') {
    c.innerHTML = DP.pages.qualityInspectTask.html;
    DP.pages.qualityInspectTask.init(opts || {});
  } else if (menuKey === 'svc-api-dev' || menuKey === '接口开发') {
    c.innerHTML = DP.pages.serviceApiDev.html;
    DP.pages.serviceApiDev.init();
  } else if (menuKey === 'svc-api-reg' || menuKey === '接口注册') {
    c.innerHTML = DP.pages.serviceApiRegistration.html;
    DP.pages.serviceApiRegistration.init();
  } else if (menuKey === 'svc-dataset' || menuKey === '数据集') {
    c.innerHTML = DP.pages.serviceDataset.html;
    DP.pages.serviceDataset.init();
  } else if (menuKey === 'svc-table-res' || menuKey === '库表资源') {
    c.innerHTML = DP.pages.serviceTableResource.html;
    DP.pages.serviceTableResource.init();
  } else if (menuKey === 'svc-api-arrange' || menuKey === 'API编排') {
    c.innerHTML = DP.pages.serviceApiArrange.html;
    DP.pages.serviceApiArrange.init();
  } else if (menuKey === 'svc-system-class') {
    c.innerHTML = DP.pages.serviceSystemManagement.html;
    DP.pages.serviceSystemManagement.init('class');
  } else if (menuKey === 'svc-system-domain') {
    c.innerHTML = DP.pages.serviceSystemManagement.html;
    DP.pages.serviceSystemManagement.init('domain');
  } else if (menuKey === 'svc-system-model') {
    c.innerHTML = DP.pages.serviceSystemManagement.html;
    DP.pages.serviceSystemManagement.init('model');
  } else if (menuKey === 'svc-system-sdk') {
    c.innerHTML = DP.pages.serviceSystemManagement.html;
    DP.pages.serviceSystemManagement.init('sdk');
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
  if (DP.pages.requirements) DP.pages.requirements.destroy();
  c.innerHTML =
    '<div class="content-placeholder">' +
      '<div class="placeholder-icon"><i class="bi bi-easel"></i></div>' +
      '<h2>' + title + '</h2>' +
      '<p>页面内容待设计，请选择左侧菜单项进行导航。</p>' +
    '</div>';
};
