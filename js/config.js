/**
 * 数据中台 V4.0 - 全局配置
 * 定义命名空间、菜单映射等共享配置
 */
window.DP = window.DP || {};
DP.pages = {};

// 顶部导航名称映射
DP.navNames = {
  workbench: '控制台',
  governance: '数据资产',
  develop: '数据开发',
  explore: '数据探索',
  service: '数据服务',
  permission: '权限管理',
  analysis: '数据分析',
  monitor: '运维监控',
  datamap: '数据地图',
  panorama: '全景视图',
  help: '帮助文档',
};

// 菜单组与顶部导航的映射
DP.menuGroupMap = {
  workbench: 'menuWorkbench',
  governance: 'menuGovernance',
  develop: 'menuDevelop',
  explore: 'menuExplore',
  service: 'menuService',
  monitor: 'menuMonitor',
  permission: 'menuPermission',
  analysis: 'menuAnalysis',
  datamap: 'menuDatamap',
  panorama: 'menuPanorama',
  help: 'menuHelp',
};

// 菜单组附带的额外组件（如项目选择器）
DP.menuGroupExtraMap = {
  develop: 'devProjectSelector',
  explore: 'devProjectSelector',
};
