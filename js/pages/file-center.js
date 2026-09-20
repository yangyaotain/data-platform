/** 数据中台 V4.0 - 数据开发 / 文件中心（按参考系统还原） */
window.DP = window.DP || {};
DP.pages = DP.pages || {};

DP.pages.fileCenter = (function () {
  'use strict';

  var root;
  var fileTypes = ['HiveSQL', 'Python脚本', 'Sqoop Job', 'Java 程序', 'Shell 脚本', 'Spark 程序', 'FlinkSQL脚本', 'Flink Java程序', 'ImpalaSQL'];
  var departmentUsers = [
    { group: '工程部', users: ['王畅', '张红彬'] },
    { group: '业务部', users: ['王鹏'] }
  ];
  var initialFolders = [
    { id: 'root', parent: '', code: 'FILE_CENTER', name: '文件中心', description: '', owners: [] },
    { id: 'offline', parent: 'root', code: 'OFFLINE_DEV', name: '离线开发', description: '离线数据加工开发文件', owners: ['王畅', '张红彬'] },
    { id: 'hive-sql', parent: 'offline', code: 'HIVE_SQL', name: 'HiveSQL脚本', description: '离线数仓 HiveSQL 脚本', owners: ['王畅'] },
    { id: 'python', parent: 'offline', code: 'PYTHON_SCRIPT', name: 'Python脚本', description: '数据清洗与校验 Python 脚本', owners: ['张红彬'] },
    { id: 'java-batch', parent: 'offline', code: 'JAVA_BATCH', name: 'Java程序包', description: '离线任务 Java 程序包', owners: ['王畅', '张红彬'] },
    { id: 'realtime', parent: 'root', code: 'REALTIME_DEV', name: '实时开发', description: '实时计算开发文件', owners: ['王畅', '王鹏'] },
    { id: 'flink-sql', parent: 'realtime', code: 'FLINK_SQL', name: 'FlinkSQL脚本', description: '实时计算 FlinkSQL 脚本', owners: ['王畅'] },
    { id: 'flink-java', parent: 'realtime', code: 'FLINK_JAVA', name: 'Flink程序包', description: '实时计算 Flink Java 程序包', owners: ['王鹏'] },
    { id: 'collection', parent: 'root', code: 'DATA_COLLECTION', name: '数据采集', description: '数据采集任务文件', owners: ['张红彬', '王鹏'] },
    { id: 'sqoop', parent: 'collection', code: 'SQOOP_JOB', name: 'Sqoop任务', description: '批量数据采集任务文件', owners: ['张红彬'] },
    { id: 'shell', parent: 'collection', code: 'SHELL_SCRIPT', name: 'Shell脚本', description: '采集与归档 Shell 脚本', owners: ['王鹏'] },
    { id: 'shared', parent: 'root', code: 'PUBLIC_RESOURCE', name: '公共资源', description: '项目公共开发资源', owners: ['王畅', '张红彬', '王鹏'] },
    { id: 'spark', parent: 'shared', code: 'SPARK_JOB', name: 'Spark程序', description: '通用 Spark 计算程序', owners: ['张红彬'] },
    { id: 'impala', parent: 'shared', code: 'IMPALA_SQL', name: 'ImpalaSQL脚本', description: '交互分析 ImpalaSQL 脚本', owners: ['王鹏'] }
  ];
  var initialFiles = [
    { id: 'file-1', folderId: 'hive-sql', name: 'ods_waybill_increment.hql', type: 'HiveSQL', path: '/1894aa49c7274d4f9086e7734309002c/2026/09/20/4b86ecac634b4bd395e944f3ed9274f3_ods_waybill_increment.hql', uploadedAt: '2026-09-20 15:21:36', remark: '运单增量数据装载脚本' },
    { id: 'file-2', folderId: 'hive-sql', name: 'dwd_waybill_detail.hql', type: 'HiveSQL', path: '/1894aa49c7274d4f9086e7734309002c/2026/09/20/aa3c42bc82944538b736a75289779b62_dwd_waybill_detail.hql', uploadedAt: '2026-09-20 15:18:12', remark: '运单明细宽表加工脚本' },
    { id: 'file-3', folderId: 'python', name: 'waybill_clean.py', type: 'Python脚本', path: '/1894aa49c7274d4f9086e7734309002c/2026/09/20/5c29c859d6b441bca4a2ac3618ed8da2_waybill_clean.py', uploadedAt: '2026-09-20 15:12:09', remark: '运单明细清洗脚本' },
    { id: 'file-4', folderId: 'python', name: 'route_duration_stat.py', type: 'Python脚本', path: '/1894aa49c7274d4f9086e7734309002c/2026/09/20/e483184c863f4e40a30b137be3c118af_route_duration_stat.py', uploadedAt: '2026-09-20 15:08:45', remark: '线路运输时效统计脚本' },
    { id: 'file-5', folderId: 'java-batch', name: 'tms-waybill-job.jar', type: 'Java 程序', path: '/1894aa49c7274d4f9086e7734309002c/2026/09/20/2bbac3d8c1584d92a03eb040f80c06c1_tms-waybill-job.jar', uploadedAt: '2026-09-20 14:58:31', remark: '运单离线处理程序' },
    { id: 'file-6', folderId: 'java-batch', name: 'tms-quality-rule.jar', type: 'Java 程序', path: '/1894aa49c7274d4f9086e7734309002c/2026/09/20/8d87b0c524414e2f80ed7d18d21d2030_tms-quality-rule.jar', uploadedAt: '2026-09-20 14:53:17', remark: '运输数据质量规则程序' },
    { id: 'file-7', folderId: 'flink-sql', name: 'realtime_waybill_status.sql', type: 'FlinkSQL脚本', path: '/1894aa49c7274d4f9086e7734309002c/2026/09/20/f63253bc28f94209a5f44059e2e35b1a_realtime_waybill_status.sql', uploadedAt: '2026-09-20 14:46:52', remark: '运单状态实时汇总脚本' },
    { id: 'file-8', folderId: 'flink-java', name: 'flink-tms-realtime.jar', type: 'Flink Java程序', path: '/1894aa49c7274d4f9086e7734309002c/2026/09/20/e73fb48c78d94ed3a31a83bc64aab46e_flink-tms-realtime.jar', uploadedAt: '2026-09-20 14:44:50', remark: '物流轨迹实时处理程序' },
    { id: 'file-9', folderId: 'sqoop', name: 'tms_waybill_import.job', type: 'Sqoop Job', path: '/1894aa49c7274d4f9086e7734309002c/2026/09/20/24a08ce1bcd84046bf9711d5a9227a32_tms_waybill_import.job', uploadedAt: '2026-09-20 14:38:26', remark: '业务库运单数据采集任务' },
    { id: 'file-10', folderId: 'shell', name: 'archive_partition.sh', type: 'Shell 脚本', path: '/1894aa49c7274d4f9086e7734309002c/2026/09/20/cd972083fbba420f97f53b63f40f1f63_archive_partition.sh', uploadedAt: '2026-09-20 14:31:03', remark: '历史分区归档脚本' },
    { id: 'file-11', folderId: 'shell', name: 'data_quality_check.sh', type: 'Shell 脚本', path: '/1894aa49c7274d4f9086e7734309002c/2026/09/20/38b0e17e917841108eae3b196ce2aeaf_data_quality_check.sh', uploadedAt: '2026-09-20 14:27:49', remark: '调度前置数据质量检查' },
    { id: 'file-12', folderId: 'spark', name: 'route-metric-spark.jar', type: 'Spark 程序', path: '/1894aa49c7274d4f9086e7734309002c/2026/09/20/9d1179396276464baf61e8cdb547296f_route-metric-spark.jar', uploadedAt: '2026-09-20 14:19:14', remark: '线路指标批量计算程序' },
    { id: 'file-13', folderId: 'impala', name: 'impala_waybill_summary.sql', type: 'ImpalaSQL', path: '/1894aa49c7274d4f9086e7734309002c/2026/09/20/4f68beff4e90428d81a8ed8a4f540679_impala_waybill_summary.sql', uploadedAt: '2026-09-20 14:12:32', remark: '运单主题交互分析脚本' }
  ];
  var folders = [];
  var files = [];
  var state;

  function clone(value) { return JSON.parse(JSON.stringify(value)); }
  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (char) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char];
    });
  }
  function button(action, icon, label, attrs, cls) {
    return '<button type="button" class="btn ' + (cls || 'btn-outline') + '" data-fc-action="' + action + '" ' + (attrs || '') + '><i class="bi bi-' + icon + '" aria-hidden="true"></i><span>' + esc(label) + '</span></button>';
  }
  function option(value, current) {
    return '<option value="' + esc(value) + '"' + (value === current ? ' selected' : '') + '>' + esc(value) + '</option>';
  }
  function nowString() {
    var date = new Date();
    function pad(value) { return String(value).padStart(2, '0'); }
    return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate()) + ' ' + pad(date.getHours()) + ':' + pad(date.getMinutes()) + ':' + pad(date.getSeconds());
  }
  function uid(prefix) { return prefix + '-' + Date.now().toString(36) + '-' + Math.random().toString(16).slice(2, 8); }
  function generatedPath(name) {
    return '/1894aa49c7274d4f9086e7734309002c/2026/09/20/' + Math.random().toString(16).slice(2).padEnd(32, '0').slice(0, 32) + '_' + name;
  }
  function findFolder(id) { return folders.find(function (item) { return item.id === id; }); }
  function findFile(id) { return files.find(function (item) { return item.id === id; }); }
  function descendants(id) {
    var result = [id];
    folders.filter(function (item) { return item.parent === id; }).forEach(function (item) { result = result.concat(descendants(item.id)); });
    return result;
  }
  function folderPath(id) {
    var names = [], item = findFolder(id);
    while (item) { names.unshift(item.name); item = item.parent ? findFolder(item.parent) : null; }
    return names.join(' / ');
  }
  function selectedRows() { return files.filter(function (item) { return state.selected.has(item.id); }); }
  function visibleRows() {
    var folderIds = new Set(descendants(state.folderId));
    var key = state.keyword.toLowerCase();
    return files.filter(function (item) {
      return folderIds.has(item.folderId) && (!state.type || item.type === state.type) && (!key || item.name.toLowerCase().indexOf(key) >= 0 || item.remark.toLowerCase().indexOf(key) >= 0);
    });
  }
  function toast(message) {
    var toastEl = root && root.querySelector('[data-fc-toast]');
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add('show');
    clearTimeout(state.toastTimer);
    state.toastTimer = setTimeout(function () { if (toastEl) toastEl.classList.remove('show'); }, 1800);
  }

  function treeHtml() {
    var keyword = state.treeKeyword.toLowerCase();
    function visible(folder) {
      if (!keyword) return true;
      if (folder.name.toLowerCase().indexOf(keyword) >= 0) return true;
      return descendants(folder.id).some(function (id) { var child = findFolder(id); return child && child.name.toLowerCase().indexOf(keyword) >= 0; });
    }
    function branch(parent, level) {
      return folders.filter(function (item) { return item.parent === parent && visible(item); }).map(function (item) {
        var children = folders.some(function (child) { return child.parent === item.id && visible(child); });
        var open = state.expanded.has(item.id) || !!keyword;
        return '<li><div class="fc-tree-row ' + (state.folderId === item.id ? 'active' : '') + '" style="--fc-level:' + level + '" data-fc-folder="' + item.id + '" tabindex="0" title="' + esc(item.name) + '">' +
          (children ? '<button type="button" data-fc-action="toggle-folder" data-id="' + item.id + '" aria-label="' + (open ? '收起' : '展开') + esc(item.name) + '"><i class="bi bi-chevron-' + (open ? 'down' : 'right') + '"></i></button>' : '<span class="fc-tree-space"></span>') +
          '<i class="bi bi-' + (open && children ? 'folder2-open' : 'folder-fill') + '"></i><span>' + esc(item.name) + '</span></div>' +
          (children && open ? '<ul>' + branch(item.id, level + 1) + '</ul>' : '') + '</li>';
      }).join('');
    }
    var rootFolder = findFolder('root');
    if (!rootFolder || !visible(rootFolder)) return '<div class="fc-tree-empty">无匹配目录</div>';
    var rootHasChildren = folders.some(function (item) { return item.parent === 'root' && visible(item); });
    var rootOpen = state.expanded.has('root') || !!keyword;
    return '<ul class="fc-tree"><li><div class="fc-tree-row ' + (state.folderId === 'root' ? 'active' : '') + '" style="--fc-level:0" data-fc-folder="root" tabindex="0" title="文件中心">' +
      (rootHasChildren ? '<button type="button" data-fc-action="toggle-folder" data-id="root" aria-label="' + (rootOpen ? '收起' : '展开') + '文件中心"><i class="bi bi-chevron-' + (rootOpen ? 'down' : 'right') + '"></i></button>' : '<span class="fc-tree-space"></span>') +
      '<i class="bi bi-folder2-open"></i><span>文件中心</span></div>' + (rootHasChildren && rootOpen ? '<ul>' + branch('root', 1) + '</ul>' : '') + '</li></ul>';
  }

  function contextMenuHtml() {
    if (!state.contextMenu) return '';
    var id = state.contextMenu.id;
    return '<div class="fc-context-menu" data-fc-context style="left:' + state.contextMenu.x + 'px;top:' + state.contextMenu.y + 'px">' +
      '<button type="button" data-fc-action="new-folder" data-id="' + id + '"><i class="bi bi-folder-plus"></i><span>新建文档分类</span></button>' +
      (id === 'root' ? '' : '<button type="button" data-fc-action="edit-folder" data-id="' + id + '"><i class="bi bi-pencil-square"></i><span>编辑</span></button><button type="button" class="danger" data-fc-action="delete-folder" data-id="' + id + '"><i class="bi bi-trash3"></i><span>删除</span></button>') + '</div>';
  }

  function tableHtml() {
    var rows = visibleRows();
    var allChecked = rows.length > 0 && rows.every(function (item) { return state.selected.has(item.id); });
    return '<div class="fc-table-shell"><table class="fc-table"><colgroup><col class="fc-col-check"><col class="fc-col-name"><col class="fc-col-type"><col class="fc-col-path"><col class="fc-col-time"><col class="fc-col-note"><col class="fc-col-action"></colgroup><thead><tr>' +
      '<th><input type="checkbox" data-fc-check-all aria-label="全选"' + (allChecked ? ' checked' : '') + '></th><th>名称</th><th>类型</th><th>引用地址</th><th>上传时间</th><th>备注</th><th class="fc-sticky-action">操作</th></tr></thead><tbody>' +
      (rows.length ? rows.map(function (item) {
        return '<tr class="' + (state.selected.has(item.id) ? 'selected' : '') + '"><td><input type="checkbox" data-fc-check="' + item.id + '" aria-label="选择' + esc(item.name) + '"' + (state.selected.has(item.id) ? ' checked' : '') + '></td><td title="' + esc(item.name) + '">' + esc(item.name) + '</td><td>' + esc(item.type) + '</td><td><div class="fc-path-cell"><span title="' + esc(item.path) + '">' + esc(item.path) + '</span><button type="button" data-fc-action="copy" data-id="' + item.id + '">复制</button></div></td><td>' + item.uploadedAt + '</td><td title="' + esc(item.remark) + '">' + esc(item.remark) + '</td><td class="fc-sticky-action"><div class="fc-row-actions"><button type="button" data-fc-action="edit-file" data-id="' + item.id + '" title="编辑"><i class="bi bi-pencil-square"></i></button><span class="fc-delete-anchor"><button type="button" class="danger" data-fc-action="ask-delete-file" data-id="' + item.id + '" title="删除"><i class="bi bi-trash3"></i></button>' + (state.rowConfirm === item.id ? '<span class="fc-popconfirm"><strong>确定要删除?</strong><span><button type="button" data-fc-action="cancel-row-delete">取消</button><button type="button" class="primary" data-fc-action="confirm-row-delete" data-id="' + item.id + '">确定</button></span></span>' : '') + '</span></div></td></tr>';
      }).join('') : '<tr><td colspan="7"><div class="fc-empty">暂无数据</div></td></tr>') + '</tbody></table></div>' + paginationHtml(rows.length);
  }

  function paginationHtml(total) {
    return '<footer class="fc-pagination"><span>共 ' + total + ' 条</span><button type="button" disabled aria-label="上一页"><i class="bi bi-chevron-left"></i></button><button type="button" class="active">1</button><button type="button" disabled aria-label="下一页"><i class="bi bi-chevron-right"></i></button><select aria-label="每页条数"><option>15 条/页</option></select><span>跳至</span><input value="1" aria-label="跳转页码"><span>页</span></footer>';
  }

  function folderPickerHtml(modal) {
    if (!modal.pickerOpen) return '';
    var keyword = modal.folderKeyword.toLowerCase();
    var available = folders.filter(function (item) { return item.name.toLowerCase().indexOf(keyword) >= 0 && item.id !== modal.folderId; });
    return '<div class="fc-folder-picker"><div class="fc-picker-search"><i class="bi bi-search"></i><input type="search" data-fc-folder-search value="' + esc(modal.folderKeyword) + '" placeholder="搜索所属目录"></div><div class="fc-picker-list">' +
      (available.length ? available.map(function (item) { return '<button type="button" data-fc-action="choose-parent" data-id="' + item.id + '"><i class="bi bi-folder"></i><span>' + esc(folderPath(item.id)) + '</span></button>'; }).join('') : '<div>无匹配目录</div>') + '</div></div>';
  }

  function ownerPanelHtml(modal) {
    var keyword = modal.ownerKeyword.toLowerCase();
    var users = departmentUsers.reduce(function (all, group) { return all.concat(group.users); }, []).filter(function (name, index, all) { return all.indexOf(name) === index; });
    var left = modal.ownerTab === 'department' ? departmentUsers.map(function (group) {
      var matching = group.users.filter(function (name) { return name.toLowerCase().indexOf(keyword) >= 0; });
      if (!matching.length) return '';
      return '<div class="fc-owner-group"><strong><i class="bi bi-chevron-down"></i><i class="bi bi-folder-fill"></i>' + group.group + '</strong>' + matching.map(function (name) { return '<label><input type="checkbox" data-fc-owner="' + esc(name) + '"' + (modal.owners.indexOf(name) >= 0 ? ' checked' : '') + '><i class="bi bi-person-fill"></i><span>' + esc(name) + '</span></label>'; }).join('') + '</div>';
    }).join('') : users.filter(function (name) { return name.toLowerCase().indexOf(keyword) >= 0; }).map(function (name) { return '<label class="fc-owner-user"><input type="checkbox" data-fc-owner="' + esc(name) + '"' + (modal.owners.indexOf(name) >= 0 ? ' checked' : '') + '><i class="bi bi-person-fill"></i><span>' + esc(name) + '</span></label>'; }).join('');
    return '<div class="fc-owner-selector"><section><div class="fc-owner-tabs"><button type="button" class="' + (modal.ownerTab === 'department' ? 'active' : '') + '" data-fc-action="owner-tab" data-tab="department">按部门</button><button type="button" class="' + (modal.ownerTab === 'user' ? 'active' : '') + '" data-fc-action="owner-tab" data-tab="user">按用户</button></div><div class="fc-owner-search"><i class="bi bi-search"></i><input data-fc-owner-search value="' + esc(modal.ownerKeyword) + '" placeholder="请输入关键字"></div><div class="fc-owner-list">' + (left || '<div class="fc-owner-empty">暂无数据</div>') + '</div></section><section><h4>已选用户</h4><div class="fc-owner-search"><i class="bi bi-search"></i><input disabled placeholder="已选用户"></div><div class="fc-selected-owners">' + (modal.owners.length ? modal.owners.map(function (name) { return '<span><i class="bi bi-person-fill"></i>' + esc(name) + '<button type="button" data-fc-action="remove-owner" data-name="' + esc(name) + '"><i class="bi bi-x"></i></button></span>'; }).join('') : '<div class="fc-owner-empty">暂无数据</div>') + '</div></section></div>';
  }

  function folderModalHtml(modal) {
    return '<div class="fc-modal-mask"><section class="fc-modal fc-folder-modal" role="dialog" aria-modal="true"><header><h3>' + (modal.isNew ? '新建分层业务' : '编辑') + '</h3><button type="button" data-fc-action="close-modal" aria-label="关闭"><i class="bi bi-x-lg"></i></button></header><div class="fc-modal-body"><div class="fc-folder-fields">' +
      '<label><span><em>*</em> 编码：</span><input class="fc-control" data-fc-folder-field="code" maxlength="50" value="' + esc(modal.code) + '" placeholder="50个字以内"></label>' +
      '<label><span><em>*</em> 名称：</span><input class="fc-control" data-fc-folder-field="name" maxlength="50" value="' + esc(modal.name) + '" placeholder="50个字以内"></label>' +
      '<label class="fc-relative"><span><em>*</em> 所属目录：</span><button type="button" class="fc-control fc-parent-trigger" data-fc-action="toggle-folder-picker"' + (!modal.isNew ? ' disabled' : '') + '><span>' + esc(folderPath(modal.parent)) + '</span><i class="bi bi-chevron-down"></i></button>' + folderPickerHtml(modal) + '</label>' +
      '<label><span>描述：</span><textarea class="fc-control" data-fc-folder-field="description" maxlength="100" placeholder="100个字以内">' + esc(modal.description) + '</textarea></label>' +
      '<div class="fc-owner-field"><span>ower：</span>' + ownerPanelHtml(modal) + '</div></div><p class="fc-form-error" data-fc-form-error></p></div><footer><button class="btn btn-outline" type="button" data-fc-action="close-modal"><i class="bi bi-x-lg"></i><span>取消</span></button><button class="btn btn-primary" type="button" data-fc-action="save-folder"><i class="bi bi-check-lg"></i><span>保存</span></button></footer></section></div>';
  }

  function uploadRowsHtml(modal) {
    return modal.pendingFiles.length ? modal.pendingFiles.map(function (item, index) { return '<tr><td title="' + esc(item.name) + '">' + esc(item.name) + '</td><td><input class="fc-control" data-fc-upload-remark="' + index + '" value="' + esc(item.remark) + '" placeholder="请输入备注"></td></tr>'; }).join('') : '<tr><td colspan="2"><div class="fc-empty">暂无数据</div></td></tr>';
  }

  function uploadModalHtml(modal) {
    return '<div class="fc-modal-mask"><section class="fc-modal fc-upload-modal" role="dialog" aria-modal="true"><header><h3>上传</h3><button type="button" data-fc-action="close-modal" aria-label="关闭"><i class="bi bi-x-lg"></i></button></header><div class="fc-modal-body"><div class="fc-upload-line"><label><span>类型：</span><select class="fc-control" data-fc-upload-type>' + fileTypes.map(function (type) { return option(type, modal.type); }).join('') + '</select></label><label class="btn btn-primary fc-file-picker"><i class="bi bi-folder2-open"></i><span>选择文件</span><input type="file" data-fc-upload-files multiple hidden></label></div><p class="fc-upload-hint">一次最多支持20个文件上传，单个300M以内；</p><div class="fc-upload-table"><table><thead><tr><th>名称</th><th>备注</th></tr></thead><tbody>' + uploadRowsHtml(modal) + '</tbody></table></div><p class="fc-form-error" data-fc-form-error></p></div><footer><button class="btn btn-outline" type="button" data-fc-action="close-modal"><i class="bi bi-x-lg"></i><span>取消</span></button><button class="btn btn-primary" type="button" data-fc-action="save-upload"><i class="bi bi-check-lg"></i><span>保存</span></button></footer></section></div>';
  }

  function editModalHtml(modal) {
    var item = modal.row;
    return '<div class="fc-modal-mask"><section class="fc-modal fc-edit-modal" role="dialog" aria-modal="true"><header><h3>修改</h3><button type="button" data-fc-action="close-modal" aria-label="关闭"><i class="bi bi-x-lg"></i></button></header><div class="fc-modal-body"><div class="fc-edit-fields"><div class="fc-edit-row"><span>名称：</span><div class="fc-edit-file-value"><strong class="fc-readonly-value"><i class="bi bi-file-earmark-code"></i><span>' + esc(modal.replacementName || item.name) + '</span></strong><label class="btn btn-primary fc-file-picker"><i class="bi bi-folder2-open"></i><span>选择文件</span><input type="file" data-fc-replacement hidden></label></div><small class="fc-edit-help">单个文件300M以内</small></div><div class="fc-edit-row"><span>类型：</span><strong class="fc-readonly-value">' + esc(item.type) + '</strong></div><div class="fc-edit-row"><span>引用地址：</span><strong class="fc-readonly-value fc-edit-path">' + esc(item.path) + '</strong></div><label class="fc-edit-row fc-edit-note"><span>备注：</span><textarea class="fc-control" data-fc-edit-remark maxlength="100" placeholder="100个字以内">' + esc(item.remark) + '</textarea></label></div><p class="fc-form-error" data-fc-form-error></p></div><footer><button class="btn btn-outline" type="button" data-fc-action="close-modal"><i class="bi bi-x-lg"></i><span>取消</span></button><button class="btn btn-primary" type="button" data-fc-action="save-edit"><i class="bi bi-check-lg"></i><span>保存</span></button></footer></section></div>';
  }

  function confirmModalHtml(modal) {
    return '<div class="fc-modal-mask"><section class="fc-confirm-modal" role="alertdialog" aria-modal="true"><header><h3>提示</h3><button type="button" data-fc-action="close-modal" aria-label="关闭"><i class="bi bi-x-lg"></i></button></header><div><i class="bi bi-exclamation-circle"></i><p>' + esc(modal.message) + '</p></div><footer><button class="btn btn-outline" type="button" data-fc-action="close-modal"><span>取消</span></button><button class="btn btn-primary" type="button" data-fc-action="confirm-delete"><span>确定</span></button></footer></section></div>';
  }

  function modalHtml() {
    if (!state.modal) return '';
    if (state.modal.kind === 'folder') return folderModalHtml(state.modal);
    if (state.modal.kind === 'upload') return uploadModalHtml(state.modal);
    if (state.modal.kind === 'edit') return editModalHtml(state.modal);
    return confirmModalHtml(state.modal);
  }

  function captureModalDraft() {
    if (!root || !state.modal) return;
    if (state.modal.kind === 'folder') {
      root.querySelectorAll('[data-fc-folder-field]').forEach(function (input) { state.modal[input.dataset.fcFolderField] = input.value; });
    }
    if (state.modal.kind === 'edit') {
      var remark = root.querySelector('[data-fc-edit-remark]');
      if (remark) state.modal.row.remark = remark.value;
    }
    if (state.modal.kind === 'upload') {
      root.querySelectorAll('[data-fc-upload-remark]').forEach(function (input) {
        var item = state.modal.pendingFiles[Number(input.dataset.fcUploadRemark)];
        if (item) item.remark = input.value;
      });
    }
  }

  function render() {
    if (!root) return;
    captureModalDraft();
    var rows = visibleRows();
    root.innerHTML = '<div class="fc-page"><aside class="fc-directory"><div class="fc-tree-search"><i class="bi bi-search"></i><input type="search" data-fc-tree-search value="' + esc(state.treeKeyword) + '" placeholder="关键字搜索"></div><div class="fc-tree-scroll">' + treeHtml() + '</div></aside><main class="fc-main"><div class="fc-toolbar"><div class="fc-toolbar-actions">' + button('open-upload', 'upload', '上传', '', 'btn-primary') + button('batch-delete', 'trash3', '删除', (state.selected.size ? '' : 'disabled'), 'btn-outline fc-batch-delete') + '</div><div class="fc-query"><label><span>类型：</span><select class="fc-control" data-fc-type><option value="">全部</option>' + fileTypes.map(function (type) { return option(type, state.type); }).join('') + '</select></label><div class="fc-keyword"><i class="bi bi-search"></i><input class="fc-control" data-fc-keyword value="' + esc(state.keywordDraft) + '" placeholder="请输入关键词查询"></div>' + button('query', 'search', '查询', '', 'btn-primary') + '</div></div>' + tableHtml() + '</main>' + contextMenuHtml() + modalHtml() + '<div class="fc-toast" data-fc-toast role="status"></div></div>';
    bind();
  }

  function openFolderModal(parentId, editId) {
    var item = editId ? findFolder(editId) : null;
    state.contextMenu = null;
    state.modal = {
      kind: 'folder', isNew: !item, folderId: item ? item.id : '', code: item ? item.code : '', name: item ? item.name : '',
      parent: item ? item.parent : parentId, description: item ? item.description : '', owners: item ? item.owners.slice() : [],
      ownerTab: 'department', ownerKeyword: '', pickerOpen: false, folderKeyword: ''
    };
    render();
  }
  function closeModal() { state.modal = null; render(); }
  function showError(text) { var error = root.querySelector('[data-fc-form-error]'); if (error) error.textContent = text; }
  function saveFolder() {
    var modal = state.modal;
    root.querySelectorAll('[data-fc-folder-field]').forEach(function (input) { modal[input.dataset.fcFolderField] = input.value.trim(); });
    if (!modal.code || !modal.name || !modal.parent) { showError('请完整填写必填项'); return; }
    if (modal.isNew) folders.push({ id: uid('folder'), parent: modal.parent, code: modal.code, name: modal.name, description: modal.description, owners: modal.owners.slice() });
    else Object.assign(findFolder(modal.folderId), { code: modal.code, name: modal.name, description: modal.description, owners: modal.owners.slice() });
    state.expanded.add(modal.parent); state.modal = null; render(); toast('文档分类已保存');
  }
  function askDeleteFolder(id) {
    var folder = findFolder(id); if (!folder || id === 'root') return;
    state.contextMenu = null;
    state.modal = { kind: 'confirm-folder', folderId: id, message: '您确定要删除数据吗？' };
    render();
  }
  function deleteFolder(id) {
    var childIds = descendants(id);
    files = files.filter(function (item) { return childIds.indexOf(item.folderId) < 0; });
    folders = folders.filter(function (item) { return childIds.indexOf(item.id) < 0; });
    if (childIds.indexOf(state.folderId) >= 0) state.folderId = 'root';
    state.selected.clear();
  }
  function saveUpload() {
    var modal = state.modal;
    if (!modal.pendingFiles.length) { showError('请选择文件'); return; }
    root.querySelectorAll('[data-fc-upload-remark]').forEach(function (input) { modal.pendingFiles[Number(input.dataset.fcUploadRemark)].remark = input.value.trim(); });
    modal.pendingFiles.forEach(function (item) { files.unshift({ id: uid('file'), folderId: state.folderId, name: item.name, type: modal.type, path: generatedPath(item.name), uploadedAt: nowString(), remark: item.remark }); });
    var count = modal.pendingFiles.length; state.modal = null; render(); toast('已上传 ' + count + ' 个文件');
  }
  function saveEdit() {
    var modal = state.modal, item = findFile(modal.row.id), remark = root.querySelector('[data-fc-edit-remark]').value.trim();
    if (!item) return closeModal();
    item.remark = remark;
    if (modal.replacementName) { item.name = modal.replacementName; item.path = generatedPath(modal.replacementName); item.uploadedAt = nowString(); }
    state.modal = null; render(); toast('文件已保存');
  }
  function performConfirmedDelete() {
    var modal = state.modal;
    if (modal.kind === 'confirm-batch') { var ids = new Set(modal.ids); files = files.filter(function (item) { return !ids.has(item.id); }); state.selected.clear(); }
    if (modal.kind === 'confirm-folder') deleteFolder(modal.folderId);
    state.modal = null; render(); toast('删除成功');
  }
  function deleteRow(id) { files = files.filter(function (item) { return item.id !== id; }); state.selected.delete(id); state.rowConfirm = ''; render(); toast('删除成功'); }

  function bind() {
    root.querySelectorAll('[data-fc-folder]').forEach(function (row) {
      row.addEventListener('click', function (event) { if (event.target.closest('[data-fc-action="toggle-folder"]')) return; state.folderId = this.dataset.fcFolder; state.selected.clear(); state.rowConfirm = ''; render(); });
      row.addEventListener('contextmenu', function (event) { event.preventDefault(); var box = root.getBoundingClientRect(); state.contextMenu = { id: this.dataset.fcFolder, x: Math.max(8, Math.min(event.clientX - box.left, box.width - 184)), y: Math.max(8, Math.min(event.clientY - box.top, box.height - 126)) }; render(); });
    });
    root.querySelectorAll('[data-fc-action]').forEach(function (control) {
      control.addEventListener('click', function (event) {
        var action = this.dataset.fcAction, id = this.dataset.id;
        event.stopPropagation();
        if (action === 'toggle-folder') { if (state.expanded.has(id)) state.expanded.delete(id); else state.expanded.add(id); render(); }
        if (action === 'new-folder') openFolderModal(id, '');
        if (action === 'edit-folder') openFolderModal('', id);
        if (action === 'delete-folder') askDeleteFolder(id);
        if (action === 'open-upload') { state.modal = { kind: 'upload', type: 'HiveSQL', pendingFiles: [] }; render(); }
        if (action === 'batch-delete' && state.selected.size) { state.modal = { kind: 'confirm-batch', ids: Array.from(state.selected), message: '您确定要删除数据吗？' }; render(); }
        if (action === 'query') { state.keyword = state.keywordDraft.trim(); state.selected.clear(); render(); }
        if (action === 'copy') { var file = findFile(id); if (file && navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(file.path).catch(function () {}); toast('引用地址已复制'); }
        if (action === 'edit-file') { var edit = findFile(id); state.modal = { kind: 'edit', row: clone(edit), replacementName: '' }; render(); }
        if (action === 'ask-delete-file') { state.rowConfirm = id; render(); }
        if (action === 'cancel-row-delete') { state.rowConfirm = ''; render(); }
        if (action === 'confirm-row-delete') deleteRow(id);
        if (action === 'close-modal') closeModal();
        if (action === 'save-folder') saveFolder();
        if (action === 'toggle-folder-picker' && state.modal && state.modal.isNew) { state.modal.pickerOpen = !state.modal.pickerOpen; render(); }
        if (action === 'choose-parent') { state.modal.parent = id; state.modal.pickerOpen = false; render(); }
        if (action === 'owner-tab') { state.modal.ownerTab = this.dataset.tab; render(); }
        if (action === 'remove-owner') { state.modal.owners = state.modal.owners.filter(function (name) { return name !== control.dataset.name; }); render(); }
        if (action === 'save-upload') saveUpload();
        if (action === 'save-edit') saveEdit();
        if (action === 'confirm-delete') performConfirmedDelete();
      });
    });
    var treeSearch = root.querySelector('[data-fc-tree-search]');
    if (treeSearch) treeSearch.addEventListener('input', function () { state.treeKeyword = this.value; render(); var next = root.querySelector('[data-fc-tree-search]'); if (next) { next.focus(); next.setSelectionRange(next.value.length, next.value.length); } });
    var keyword = root.querySelector('[data-fc-keyword]');
    if (keyword) { keyword.addEventListener('input', function () { state.keywordDraft = this.value; }); keyword.addEventListener('keydown', function (event) { if (event.key === 'Enter') { state.keywordDraft = this.value; state.keyword = this.value.trim(); state.selected.clear(); render(); } }); }
    var type = root.querySelector('[data-fc-type]');
    if (type) type.addEventListener('change', function () { state.type = this.value; state.keyword = state.keywordDraft.trim(); state.selected.clear(); render(); });
    var checkAll = root.querySelector('[data-fc-check-all]');
    if (checkAll) checkAll.addEventListener('change', function () { visibleRows().forEach(function (item) { if (checkAll.checked) state.selected.add(item.id); else state.selected.delete(item.id); }); render(); });
    root.querySelectorAll('[data-fc-check]').forEach(function (input) { input.addEventListener('change', function () { if (this.checked) state.selected.add(this.dataset.fcCheck); else state.selected.delete(this.dataset.fcCheck); render(); }); });
    var uploadType = root.querySelector('[data-fc-upload-type]'); if (uploadType) uploadType.addEventListener('change', function () { state.modal.type = this.value; });
    var uploadFiles = root.querySelector('[data-fc-upload-files]'); if (uploadFiles) uploadFiles.addEventListener('change', function () { var picked = Array.from(this.files || []); if (picked.length > 20) { showError('一次最多支持20个文件上传'); return; } if (picked.some(function (file) { return file.size > 300 * 1024 * 1024; })) { showError('单个文件不能超过300M'); return; } state.modal.pendingFiles = picked.map(function (file) { return { name: file.name, remark: '' }; }); render(); });
    var replacement = root.querySelector('[data-fc-replacement]'); if (replacement) replacement.addEventListener('change', function () { var file = this.files && this.files[0]; if (!file) return; if (file.size > 300 * 1024 * 1024) { showError('文件不能超过300M'); return; } state.modal.replacementName = file.name; render(); });
    root.querySelectorAll('[data-fc-owner]').forEach(function (input) { input.addEventListener('change', function () { var name = this.dataset.fcOwner; if (this.checked && state.modal.owners.indexOf(name) < 0) state.modal.owners.push(name); if (!this.checked) state.modal.owners = state.modal.owners.filter(function (item) { return item !== name; }); render(); }); });
    var ownerSearch = root.querySelector('[data-fc-owner-search]'); if (ownerSearch) ownerSearch.addEventListener('input', function () { state.modal.ownerKeyword = this.value; render(); var next = root.querySelector('[data-fc-owner-search]'); if (next) { next.focus(); next.setSelectionRange(next.value.length, next.value.length); } });
    var folderSearch = root.querySelector('[data-fc-folder-search]'); if (folderSearch) folderSearch.addEventListener('input', function () { state.modal.folderKeyword = this.value; render(); var next = root.querySelector('[data-fc-folder-search]'); if (next) { next.focus(); next.setSelectionRange(next.value.length, next.value.length); } });
    var mask = root.querySelector('.fc-modal-mask'); if (mask) mask.addEventListener('click', function (event) { if (event.target === mask) closeModal(); });
    var page = root.querySelector('.fc-page'); if (page) page.addEventListener('click', function (event) { if (state.contextMenu && !event.target.closest('[data-fc-context]') && !event.target.closest('[data-fc-folder]')) { state.contextMenu = null; render(); } });
  }

  function init() {
    root = DP.contentArea.querySelector('.page-file-center');
    if (!root) return;
    folders = clone(initialFolders);
    files = clone(initialFiles);
    state = { folderId: 'root', expanded: new Set(['root', 'offline', 'realtime', 'collection', 'shared']), treeKeyword: '', keywordDraft: '', keyword: '', type: '', selected: new Set(), contextMenu: null, rowConfirm: '', modal: null, toastTimer: null };
    render();
  }

  return { html: '<div class="page-file-center"></div>', init: init };
}());
