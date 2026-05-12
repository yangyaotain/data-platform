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
  'governance-ops': '数据治理',
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
  'governance-ops': 'menuDataGovernance',
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

/**
 * 公共确认弹窗
 * @param {string} msg - 提示文字（支持 HTML）
 * @param {object} opts - 可选配置 { icon: 'warn'|'danger'|'info'|'success', onOk: fn, onCancel: fn, okText, cancelText }
 */
DP.confirm = function (msg, opts) {
  opts = opts || {};
  var iconCls = 'bi-exclamation-circle';
  var iconExtra = '';
  if (opts.icon === 'danger')  { iconCls = 'bi-x-circle'; iconExtra = ' icon-danger'; }
  if (opts.icon === 'info')    { iconCls = 'bi-info-circle'; iconExtra = ' icon-info'; }
  if (opts.icon === 'success') { iconCls = 'bi-check-circle'; iconExtra = ' icon-success'; }

  var mask = document.createElement('div');
  mask.className = 'dp-modal-mask';
  mask.innerHTML =
    '<div class="dp-modal">' +
      '<div class="dp-modal-body">' +
        '<i class="bi ' + iconCls + ' dp-modal-icon' + iconExtra + '"></i>' +
        '<div class="dp-modal-text">' + msg + '</div>' +
      '</div>' +
      '<div class="dp-modal-footer">' +
        '<button class="btn dp-modal-cancel">' + (opts.cancelText || '取消') + '</button>' +
        '<button class="btn btn-primary dp-modal-ok">' + (opts.okText || '确认') + '</button>' +
      '</div>' +
    '</div>';
  document.body.appendChild(mask);

  function close() { if (mask.parentNode) mask.remove(); }
  mask.querySelector('.dp-modal-cancel').addEventListener('click', function () { close(); if (opts.onCancel) opts.onCancel(); });
  mask.querySelector('.dp-modal-ok').addEventListener('click', function () { close(); if (opts.onOk) opts.onOk(); });
  mask.addEventListener('click', function (e) { if (e.target === mask) close(); });
  return { close: close };
};
