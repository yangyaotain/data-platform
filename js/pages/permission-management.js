/** 权限管理：角色管理、用户管理、系统管理。功能结构按对照系统还原。 */
window.DP = window.DP || {};
DP.pages = DP.pages || {};

DP.pages.permissionManagement = (function () {
  'use strict';

  var STORAGE_KEY = 'dp.permission-management.v1';
  var root = null;
  var toastTimer = null;

  var PERMISSION_SYSTEMS = [
    { id:'asset', name:'数据资产', icon:'database', modules:[
      { id:'source', name:'数据源', actions:['查询','新增','编辑','删除','导入','导出','数据预览','测试连接'] },
      { id:'layer', name:'业务分层', actions:['查询','新增','编辑','删除'] },
      { id:'metadata', name:'元数据管理', actions:['查询','新增','编辑','同步','导入','导出','标准检验'] },
      { id:'model', name:'数据建模', actions:['查询','新增','编辑','删除'] }
    ] },
    { id:'governance', name:'数据治理', icon:'diagram-3', modules:[
      { id:'plan', name:'治理规划', actions:['查询','新建','编辑','删除','发布'] },
      { id:'task', name:'治理任务', actions:['查询','新建','编辑','删除','启动','停止'] },
      { id:'audit', name:'数据审核', actions:['查询','查看','审核通过','审核驳回'] },
      { id:'quality', name:'数据质量', actions:['规则查询','规则新建','规则编辑','规则删除','报告查看','报告导出'] }
    ] },
    { id:'develop', name:'数据开发', icon:'code-slash', modules:[
      { id:'studio', name:'数据开发', actions:['查询','新建','编辑','删除','保存','发布','执行'] },
      { id:'schedule', name:'调度管理', actions:['查询','新建','编辑','删除','启动','停止','执行一次','执行记录'] },
      { id:'config', name:'开发配置', actions:['查询','编辑','保存'] },
      { id:'file', name:'文件中心', actions:['查询','上传','下载','删除'] },
      { id:'recycle', name:'回收站', actions:['查询','恢复'] }
    ] },
    { id:'explore', name:'数据探索', icon:'search', modules:[
      { id:'query', name:'数据探索', actions:['查询','执行SQL','导出结果','保存查询'] },
      { id:'history', name:'查询历史', actions:['查询','查看','再次执行','删除'] }
    ] },
    { id:'service', name:'数据服务', icon:'cloud-arrow-up', modules:[
      { id:'apiDev', name:'接口开发', actions:['查询','新建','编辑','删除','测试','发布'] },
      { id:'apiReg', name:'接口注册', actions:['查询','注册','取消注册','导入','导出'] },
      { id:'dataset', name:'数据集', actions:['查询','新建','编辑','删除','发布'] },
      { id:'table', name:'库表资源', actions:['查询','预览','申请'] },
      { id:'arrange', name:'API编排', actions:['查询','新建','编辑','删除','发布'] }
    ] },
    { id:'analysis', name:'数据分析', icon:'bar-chart', modules:[
      { id:'board', name:'分析看板', actions:['查询','新建','编辑','删除','发布'] },
      { id:'insight', name:'数据洞察', actions:['查询','生成分析','导出'] }
    ] },
    { id:'monitor', name:'运维监控', icon:'activity', modules:[
      { id:'overview', name:'平台概况', actions:['查看'] },
      { id:'item', name:'监控事项', actions:['查询','新建','编辑','删除','启用','停用'] },
      { id:'notice', name:'通知规则', actions:['查询','新建','编辑','删除'] },
      { id:'center', name:'监控中心', actions:['查询','查看详情','确认告警'] },
      { id:'config', name:'配置管理', actions:['查询','新建','编辑','删除'] }
    ] },
    { id:'permission', name:'权限管理', icon:'shield-lock', modules:[
      { id:'role', name:'角色管理', actions:['查询','新增','删除','权限配置'] },
      { id:'user', name:'用户管理', actions:['查询','新增','编辑','删除','重置密码','激活邮件'] },
      { id:'system', name:'系统管理', actions:['查询','新建','导入','分类管理'] }
    ] }
  ];

  var DEPARTMENTS = [
    { id:'root', name:'数据中台', parent:'' },
    { id:'governance', name:'数据治理部', parent:'root' },
    { id:'develop', name:'数据开发部', parent:'root' },
    { id:'operation', name:'平台运营部', parent:'root' }
  ];

  var state = {
    mode:'role', activeSystem:'asset', selectedRole:'role-super', roleKeyword:'', addingRole:false,
    selectedUser:'user-01', userKeyword:'', userDraft:null, userIsNew:false,
    systemKeyword:'', systemDraftKeyword:'', systemModal:false, systemDraft:null, categoryEditor:null,
    message:''
  };
  var store = null;

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (char) {
      return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[char];
    });
  }
  function clone(value) { return JSON.parse(JSON.stringify(value)); }
  function permissionKey(systemId, moduleId, action) { return systemId + '.' + moduleId + '.' + action; }
  function allPermissionIds(systemId) {
    var systems = systemId ? PERMISSION_SYSTEMS.filter(function (item) { return item.id === systemId; }) : PERMISSION_SYSTEMS;
    var ids = [];
    systems.forEach(function (system) {
      system.modules.forEach(function (module) {
        module.actions.forEach(function (action) { ids.push(permissionKey(system.id, module.id, action)); });
      });
    });
    return ids;
  }
  function seededPermissions(predicate) {
    return allPermissionIds().filter(function (id) { return predicate(id); });
  }
  function seedStore() {
    var all = allPermissionIds();
    return {
      version:1,
      roles:[
        { id:'role-super', name:'超级管理员', builtIn:true, permissions:all },
        { id:'role-asset', name:'数据资产管理员', permissions:seededPermissions(function (id) { return id.indexOf('asset.') === 0 || id.indexOf('governance.') === 0; }) },
        { id:'role-quality', name:'数据质量专员', permissions:seededPermissions(function (id) { return id.indexOf('governance.quality.') === 0 || id.indexOf('governance.audit.') === 0; }) },
        { id:'role-developer', name:'数据开发人员', permissions:seededPermissions(function (id) { return id.indexOf('develop.') === 0 || id.indexOf('explore.') === 0; }) },
        { id:'role-operator', name:'平台运维人员', permissions:seededPermissions(function (id) { return id.indexOf('monitor.') === 0; }) }
      ],
      users:[
        { id:'user-01', account:'zhang.qian', name:'张倩', gender:'女', mobile:'13810682531', email:'zhang.qian@datahub.cn', department:'governance', status:'正常', enterpriseAdmin:false, roleIds:['role-asset','role-quality'] },
        { id:'user-02', account:'li.ming', name:'李明', gender:'男', mobile:'13911863742', email:'li.ming@datahub.cn', department:'develop', status:'正常', enterpriseAdmin:false, roleIds:['role-developer'] },
        { id:'user-03', account:'wang.fang', name:'王芳', gender:'女', mobile:'13710284619', email:'wang.fang@datahub.cn', department:'operation', status:'正常', enterpriseAdmin:false, roleIds:['role-operator'] },
        { id:'user-04', account:'admin', name:'平台管理员', gender:'男', mobile:'13611950328', email:'admin@datahub.cn', department:'operation', status:'正常', enterpriseAdmin:true, roleIds:['role-super'] },
        { id:'user-05', account:'chen.rui', name:'陈睿', gender:'男', mobile:'13510792468', email:'chen.rui@datahub.cn', department:'governance', status:'未激活', enterpriseAdmin:false, roleIds:['role-quality'] }
      ],
      categories:[
        { id:'cat-platform', name:'平台基础系统' },
        { id:'cat-governance', name:'数据治理应用' },
        { id:'cat-service', name:'数据服务应用' },
        { id:'cat-extension', name:'扩展接入系统' }
      ],
      systems:[
        { id:'SYS-001', name:'数据资产中心', categoryId:'cat-platform', url:'/assets', description:'统一管理数据源、元数据、数据标准与数据模型。' },
        { id:'SYS-002', name:'数据治理中心', categoryId:'cat-governance', url:'/governance', description:'承载治理规划、治理任务、审核和质量管理。' },
        { id:'SYS-003', name:'数据开发中心', categoryId:'cat-platform', url:'/develop', description:'提供开发、调度、配置和文件管理能力。' },
        { id:'SYS-004', name:'数据服务中心', categoryId:'cat-service', url:'/service', description:'提供接口、数据集、库表资源和API编排服务。' },
        { id:'SYS-005', name:'运维监控中心', categoryId:'cat-platform', url:'/monitor', description:'统一查看平台运行状态、告警和通知。' },
        { id:'SYS-006', name:'权限管理中心', categoryId:'cat-platform', url:'/permission', description:'统一管理角色、用户和接入系统。' }
      ]
    };
  }
  function loadStore() {
    try {
      var saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if (saved && saved.version === 1 && Array.isArray(saved.roles) && Array.isArray(saved.users) && Array.isArray(saved.systems) && Array.isArray(saved.categories)) return saved;
    } catch (error) { /* 使用完整示例数据 */ }
    return seedStore();
  }
  function persist() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(store)); } catch (error) { /* 静态原型允许无存储环境 */ } }
  function findRole(id) { return store.roles.find(function (role) { return role.id === id; }); }
  function findUser(id) { return store.users.find(function (user) { return user.id === id; }); }
  function findDepartment(id) { return DEPARTMENTS.find(function (item) { return item.id === id; }); }
  function findCategory(id) { return store.categories.find(function (item) { return item.id === id; }); }
  function button(action, icon, text, cls, attrs) {
    return '<button type="button" class="btn ' + (cls || 'btn-outline') + '" data-pm-action="' + action + '" ' + (attrs || '') + '><i class="bi bi-' + icon + '"></i><span>' + text + '</span></button>';
  }
  function notify(message, type) {
    var toast = root && root.querySelector('[data-pm-toast]');
    if (!toast) return;
    toast.className = 'pm-toast show ' + (type === 'error' ? 'error' : 'success');
    toast.innerHTML = '<i class="bi bi-' + (type === 'error' ? 'exclamation-circle' : 'check-circle') + '"></i><span>' + esc(message) + '</span>';
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { if (toast) toast.classList.remove('show'); }, 1800);
  }

  function roleListHtml() {
    var keyword = state.roleKeyword.trim().toLowerCase();
    var roles = store.roles.filter(function (role) { return !keyword || role.name.toLowerCase().indexOf(keyword) >= 0; });
    var add = state.addingRole ? '<form class="pm-inline-add" data-pm-role-add><input type="text" maxlength="20" placeholder="请输入角色名称" aria-label="角色名称" autofocus><button type="submit" title="保存"><i class="bi bi-check-lg"></i></button><button type="button" data-pm-action="cancel-role" title="取消"><i class="bi bi-x-lg"></i></button></form>' : '';
    return '<aside class="pm-role-side"><div class="pm-side-search"><i class="bi bi-search"></i><input type="text" value="' + esc(state.roleKeyword) + '" placeholder="搜索角色" data-pm-role-keyword aria-label="搜索角色"></div>' +
      '<div class="pm-side-actions">' + button('add-role','plus-lg','添加角色','btn-primary') + button('delete-role','trash3','删除','btn-danger') + '</div>' + add +
      '<div class="pm-role-list">' + (roles.length ? roles.map(function (role) {
        return '<button type="button" class="pm-role-item' + (role.id === state.selectedRole ? ' active' : '') + '" data-pm-role="' + role.id + '"><i class="bi bi-person-badge"></i><span>' + esc(role.name) + '</span>' + (role.builtIn ? '<em>内置</em>' : '') + '</button>';
      }).join('') : '<div class="pm-empty compact"><i class="bi bi-search"></i><span>未找到匹配角色</span></div>') + '</div></aside>';
  }
  function roleSystemTabs() {
    return '<div class="pm-system-tabs">' + PERMISSION_SYSTEMS.map(function (system) {
      return '<button type="button" class="' + (state.activeSystem === system.id ? 'active' : '') + '" data-pm-system-tab="' + system.id + '"><i class="bi bi-' + system.icon + '"></i><span>' + esc(system.name) + '</span></button>';
    }).join('') + '</div>';
  }
  function permissionTreeHtml() {
    var role = findRole(state.selectedRole) || store.roles[0];
    var system = PERMISSION_SYSTEMS.find(function (item) { return item.id === state.activeSystem; }) || PERMISSION_SYSTEMS[0];
    var selected = new Set(role.permissions || []);
    return '<div class="pm-permission-groups">' + system.modules.map(function (module) {
      var ids = module.actions.map(function (action) { return permissionKey(system.id, module.id, action); });
      var count = ids.filter(function (id) { return selected.has(id); }).length;
      return '<section class="pm-permission-group"><label class="pm-permission-parent"><input type="checkbox" data-pm-module="' + module.id + '"' + (count === ids.length ? ' checked' : '') + ' data-partial="' + (count > 0 && count < ids.length ? 'true' : 'false') + '"><i class="bi bi-folder2-open"></i><span>' + esc(module.name) + '</span><em>' + count + '/' + ids.length + '</em></label><div class="pm-permission-actions">' + module.actions.map(function (action) {
        var id = permissionKey(system.id, module.id, action);
        return '<label><input type="checkbox" data-pm-permission="' + esc(id) + '"' + (selected.has(id) ? ' checked' : '') + '><span>' + esc(action) + '</span></label>';
      }).join('') + '</div></section>';
    }).join('') + '</div>';
  }
  function rolePage() {
    var role = findRole(state.selectedRole) || store.roles[0];
    return '<div class="pm-role-layout">' + roleListHtml() + '<main class="pm-role-main"><div class="pm-role-toolbar"><div><strong>' + esc(role.name) + '</strong><span>配置菜单与操作权限</span></div><div>' + button('select-all','check2-square','全选','btn-outline') + button('reverse','arrow-left-right','反选','btn-outline') + '</div></div>' + roleSystemTabs() + '<div class="pm-permission-scroll">' + permissionTreeHtml() + '</div></main></div>';
  }

  function departmentTreeHtml() {
    var keyword = state.userKeyword.trim().toLowerCase();
    var users = store.users.filter(function (user) {
      var dept = findDepartment(user.department);
      return !keyword || (user.name + ' ' + user.account + ' ' + (dept ? dept.name : '')).toLowerCase().indexOf(keyword) >= 0;
    });
    var branches = DEPARTMENTS.filter(function (item) { return item.parent === 'root'; }).map(function (dept) {
      var members = users.filter(function (user) { return user.department === dept.id; });
      if (keyword && !members.length && dept.name.toLowerCase().indexOf(keyword) < 0) return '';
      return '<div class="pm-org-branch"><div class="pm-org-label"><i class="bi bi-folder-fill"></i><span>' + esc(dept.name) + '</span></div><div class="pm-org-users">' + (members.length ? members.map(function (user) {
        return '<button type="button" class="pm-user-node' + (user.id === state.selectedUser && !state.userIsNew ? ' active' : '') + '" data-pm-user="' + user.id + '"><i class="bi bi-person-vcard"></i><span>' + esc(user.name) + '</span><small>' + esc(user.account) + '</small></button>';
      }).join('') : '<span class="pm-tree-empty">暂无匹配用户</span>') + '</div></div>';
    }).join('');
    return '<aside class="pm-user-tree"><div class="pm-side-search"><i class="bi bi-search"></i><input type="text" value="' + esc(state.userKeyword) + '" placeholder="搜索部门或用户" data-pm-user-keyword aria-label="搜索部门或用户"></div><div class="pm-org-root"><div class="pm-org-label root"><i class="bi bi-building"></i><span>数据中台</span><em>' + users.length + '人</em></div>' + branches + '</div></aside>';
  }
  function roleChecks(user) {
    return store.roles.map(function (role) {
      return '<label class="pm-check"><input type="checkbox" data-pm-user-role="' + role.id + '"' + ((user.roleIds || []).indexOf(role.id) >= 0 ? ' checked' : '') + '><span>' + esc(role.name) + '</span></label>';
    }).join('');
  }
  function userFormHtml() {
    var user = state.userDraft || clone(findUser(state.selectedUser) || store.users[0]);
    var departments = DEPARTMENTS.filter(function (item) { return item.parent === 'root'; });
    var statuses = ['未激活','正常','锁定'];
    return '<section class="pm-user-panel"><div class="pm-user-toolbar"><div>' + button('add-user','person-plus','添加用户','btn-primary') + (state.userIsNew ? '' : button('delete-user','trash3','删除','btn-danger')) + '</div><div class="pm-user-count"><span>用户数</span><div><i style="width:' + Math.min(100, store.users.length) + '%"></i></div><strong>' + store.users.length + '/100</strong></div></div>' +
      '<form class="pm-user-form" data-pm-user-form><div class="pm-form-row"><label><em>*</em> 账号</label><div><input type="text" maxlength="30" value="' + esc(user.account) + '" placeholder="请输入账号" data-pm-user-field="account"' + (state.userIsNew ? '' : ' readonly') + '></div>' + (state.userIsNew ? '<label class="pm-inline-check"><input type="checkbox" data-pm-user-field="skipActivation"' + (user.skipActivation ? ' checked' : '') + '><span>免邮件激活</span></label>' : '') + '</div>' +
      '<div class="pm-form-row"><label><em>*</em> 姓名</label><div><input type="text" maxlength="20" value="' + esc(user.name) + '" placeholder="请输入姓名" data-pm-user-field="name"></div></div>' +
      '<div class="pm-form-row"><label><em>*</em> 性别</label><div class="pm-radio-row"><label><input type="radio" name="pmGender" value="男" data-pm-user-field="gender"' + (user.gender === '男' ? ' checked' : '') + '><span>男</span></label><label><input type="radio" name="pmGender" value="女" data-pm-user-field="gender"' + (user.gender === '女' ? ' checked' : '') + '><span>女</span></label></div></div>' +
      '<div class="pm-form-row"><label><em>*</em> 手机</label><div><input type="text" maxlength="11" value="' + esc(user.mobile) + '" placeholder="请输入手机号码" data-pm-user-field="mobile"></div></div>' +
      '<div class="pm-form-row"><label><em>*</em> 邮箱</label><div><input type="email" maxlength="60" value="' + esc(user.email) + '" placeholder="请输入邮箱" data-pm-user-field="email"></div>' + (!state.userIsNew ? '<button type="button" class="pm-link" data-pm-action="resend-email"><i class="bi bi-envelope-arrow-up"></i><span>重新发送激活邮件</span></button>' : '') + '</div>' +
      '<div class="pm-form-row"><label>部门</label><div><select data-pm-user-field="department">' + departments.map(function (dept) { return '<option value="' + dept.id + '"' + (dept.id === user.department ? ' selected' : '') + '>' + esc(dept.name) + '</option>'; }).join('') + '</select></div></div>' +
      '<div class="pm-form-row"><label>状态</label><div><select data-pm-user-field="status">' + statuses.map(function (status) { return '<option value="' + status + '"' + (status === user.status ? ' selected' : '') + '>' + status + '</option>'; }).join('') + '</select></div></div>' +
      '<div class="pm-form-row align-start"><label>角色</label><div class="pm-role-checks"><label class="pm-check enterprise"><input type="checkbox" data-pm-user-field="enterpriseAdmin"' + (user.enterpriseAdmin ? ' checked' : '') + '><span>企业管理员</span></label><div>' + roleChecks(user) + '</div></div></div>' +
      '<div class="pm-user-form-error" data-pm-user-error></div><div class="pm-user-form-actions">' + button('save-user','floppy','保存','btn-primary') + (!state.userIsNew ? button('reset-password','key','重置密码','btn-primary') : '') + '</div></form></section>';
  }
  function userPage() { return '<div class="pm-user-layout">' + departmentTreeHtml() + userFormHtml() + '</div>'; }

  function filteredSystems() {
    var keyword = state.systemKeyword.trim().toLowerCase();
    return store.systems.filter(function (system) {
      var category = findCategory(system.categoryId);
      return !keyword || (system.id + ' ' + system.name + ' ' + system.url + ' ' + (category ? category.name : '')).toLowerCase().indexOf(keyword) >= 0;
    });
  }
  function systemTableHtml() {
    var rows = filteredSystems();
    return '<div class="pm-system-table-wrap"><table class="pm-system-table"><thead><tr><th>系统ID</th><th>系统名称</th><th>所属分类</th><th>系统URL</th></tr></thead><tbody>' + (rows.length ? rows.map(function (system) {
      var category = findCategory(system.categoryId);
      return '<tr title="' + esc(system.description) + '"><td><span class="pm-system-id"><i class="bi bi-display"></i>' + esc(system.id) + '</span></td><td>' + esc(system.name) + '</td><td><span class="pm-category-tag">' + esc(category ? category.name : '未分类') + '</span></td><td><code>' + esc(system.url) + '</code></td></tr>';
    }).join('') : '<tr><td colspan="4"><div class="pm-empty"><i class="bi bi-inbox"></i><span>暂无符合条件的系统</span></div></td></tr>') + '</tbody></table></div><div class="pm-system-summary"><span>共 ' + rows.length + ' 个系统</span><span>分类 ' + store.categories.length + ' 个</span></div>';
  }
  function categoryControlHtml() {
    var draft = state.systemDraft;
    if (state.categoryEditor) {
      return '<div class="pm-category-editor"><input type="text" maxlength="10" value="' + esc(state.categoryEditor.value || '') + '" placeholder="10字符以内" data-pm-category-name><button type="button" data-pm-action="save-category"><i class="bi bi-check-lg"></i><span>保存</span></button><button type="button" data-pm-action="cancel-category"><i class="bi bi-x-lg"></i><span>取消</span></button></div>';
    }
    return '<div class="pm-category-control"><select data-pm-system-field="categoryId"><option value="">请选择分类</option>' + store.categories.map(function (category) { return '<option value="' + category.id + '"' + (category.id === draft.categoryId ? ' selected' : '') + '>' + esc(category.name) + '</option>'; }).join('') + '</select><div class="pm-category-actions"><button type="button" data-pm-action="new-category"><i class="bi bi-plus-lg"></i><span>新建</span></button><button type="button" data-pm-action="delete-category"><i class="bi bi-trash3"></i><span>删除</span></button><button type="button" data-pm-action="edit-category"><i class="bi bi-pencil-square"></i><span>修改</span></button></div></div>';
  }
  function systemModalHtml() {
    if (!state.systemModal) return '';
    var draft = state.systemDraft;
    return '<div class="pm-modal"><div class="pm-modal-mask" data-pm-action="close-system-modal"></div><section class="pm-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="pmSystemModalTitle"><header><h3 id="pmSystemModalTitle">新增系统</h3><button type="button" data-pm-action="close-system-modal" aria-label="关闭"><i class="bi bi-x-lg"></i></button></header><form class="pm-system-form" data-pm-system-form><div class="pm-form-row"><label><em>*</em> 系统名称</label><div><input type="text" maxlength="30" placeholder="30字符以内" value="' + esc(draft.name) + '" data-pm-system-field="name"></div></div><div class="pm-form-row"><label><em>*</em> 系统URL</label><div><input type="text" maxlength="200" placeholder="200字符以内" value="' + esc(draft.url) + '" data-pm-system-field="url"></div></div><div class="pm-form-row align-start"><label><em>*</em> 所属分类</label><div>' + categoryControlHtml() + '</div></div><div class="pm-form-row align-start"><label><em>*</em> 系统描述</label><div><textarea maxlength="150" placeholder="150字符以内" data-pm-system-field="description">' + esc(draft.description) + '</textarea><div class="pm-char-count">' + draft.description.length + '/150</div></div></div><div class="pm-system-form-error" data-pm-system-error></div><footer><button type="button" class="btn btn-outline" data-pm-action="close-system-modal"><i class="bi bi-x-lg"></i><span>取消</span></button><button type="submit" class="btn btn-primary"><i class="bi bi-check-lg"></i><span>确定</span></button></footer></form></section></div>';
  }
  function systemPage() {
    return '<section class="pm-system-page"><div class="pm-system-toolbar"><div>' + button('new-system','plus-lg','新建','btn-primary') + '<button type="button" class="btn btn-primary" data-pm-action="import-system"><i class="bi bi-file-earmark-arrow-up"></i><span>导入</span></button><input type="file" accept=".xlsx,.xls,.csv" data-pm-system-file hidden></div><form data-pm-system-query><input type="text" value="' + esc(state.systemDraftKeyword) + '" placeholder="请输入关键字" data-pm-system-keyword aria-label="系统关键字"><button type="submit" class="btn btn-primary"><i class="bi bi-search"></i><span>查询</span></button></form></div>' + systemTableHtml() + '</section>' + systemModalHtml();
  }

  function render() {
    if (!root) return;
    root.innerHTML = (state.mode === 'role' ? rolePage() : (state.mode === 'user' ? userPage() : systemPage())) + '<div class="pm-toast" data-pm-toast role="status"></div>';
    root.querySelectorAll('[data-partial="true"]').forEach(function (input) { input.indeterminate = true; });
    if (state.addingRole) { var addInput = root.querySelector('[data-pm-role-add] input'); if (addInput) addInput.focus(); }
  }

  function setRolePermission(id, checked) {
    var role = findRole(state.selectedRole); if (!role) return;
    var set = new Set(role.permissions || []); checked ? set.add(id) : set.delete(id); role.permissions = Array.from(set); persist(); render();
  }
  function setModulePermissions(moduleId, checked) {
    var role = findRole(state.selectedRole); var system = PERMISSION_SYSTEMS.find(function (item) { return item.id === state.activeSystem; }); if (!role || !system) return;
    var module = system.modules.find(function (item) { return item.id === moduleId; }); var set = new Set(role.permissions || []);
    module.actions.forEach(function (action) { var id = permissionKey(system.id, module.id, action); checked ? set.add(id) : set.delete(id); });
    role.permissions = Array.from(set); persist(); render();
  }
  function selectAllPermissions(reverse) {
    var role = findRole(state.selectedRole); if (!role) return;
    var current = new Set(role.permissions || []); var ids = allPermissionIds(state.activeSystem);
    ids.forEach(function (id) { if (reverse) current.has(id) ? current.delete(id) : current.add(id); else current.add(id); });
    role.permissions = Array.from(current); persist(); render(); notify(reverse ? '当前系统权限已反选' : '当前系统权限已全选');
  }
  function addRole(name) {
    name = name.trim();
    if (!name) { notify('请输入角色名称','error'); return; }
    if (store.roles.some(function (role) { return role.name === name; })) { notify('角色名称已存在','error'); return; }
    var role = { id:'role-' + Date.now(), name:name, permissions:[] }; store.roles.push(role); state.selectedRole = role.id; state.addingRole = false; state.roleKeyword = ''; persist(); render(); notify('角色已添加');
  }
  function deleteRole() {
    var role = findRole(state.selectedRole); if (!role) return;
    if (role.builtIn) { notify('内置超级管理员不可删除','error'); return; }
    DP.confirm('确定删除角色“' + esc(role.name) + '”吗？', { icon:'danger', okText:'<i class="bi bi-trash3"></i> 删除', cancelText:'<i class="bi bi-x-lg"></i> 取消', onOk:function () {
      store.roles = store.roles.filter(function (item) { return item.id !== role.id; });
      store.users.forEach(function (user) { user.roleIds = user.roleIds.filter(function (id) { return id !== role.id; }); });
      state.selectedRole = store.roles[0].id; persist(); render(); notify('角色已删除');
    } });
  }

  function selectUser(id) { var user = findUser(id); if (!user) return; state.selectedUser = id; state.userDraft = clone(user); state.userIsNew = false; render(); }
  function newUser() {
    state.userIsNew = true; state.selectedUser = ''; state.userDraft = { account:'', name:'', gender:'男', mobile:'', email:'', department:'governance', status:'未激活', enterpriseAdmin:false, roleIds:[], skipActivation:false }; render();
  }
  function userError(message) { var error = root.querySelector('[data-pm-user-error]'); if (error) error.textContent = message; }
  function saveUser() {
    var user = state.userDraft; if (!user) return;
    if (!user.account.trim() || !user.name.trim() || !user.mobile.trim() || !user.email.trim()) { userError('请完整填写账号、姓名、手机和邮箱。'); return; }
    if (!/^1\d{10}$/.test(user.mobile.trim())) { userError('请输入11位手机号码。'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email.trim())) { userError('请输入有效邮箱地址。'); return; }
    if (!user.roleIds.length && !user.enterpriseAdmin) { userError('请至少选择一个角色。'); return; }
    if (state.userIsNew) {
      if (store.users.some(function (item) { return item.account.toLowerCase() === user.account.trim().toLowerCase(); })) { userError('账号已存在。'); return; }
      user.id = 'user-' + Date.now(); store.users.push(clone(user)); state.selectedUser = user.id; state.userIsNew = false;
    } else {
      var original = findUser(state.selectedUser); if (original) Object.keys(user).forEach(function (key) { original[key] = clone(user[key]); });
    }
    persist(); state.userDraft = clone(findUser(state.selectedUser)); render(); notify('用户信息已保存');
  }
  function deleteUser() {
    if (state.userIsNew) { selectUser(store.users[0].id); return; }
    var user = findUser(state.selectedUser); if (!user) return;
    DP.confirm('确定删除用户“' + esc(user.name) + '”吗？', { icon:'danger', okText:'<i class="bi bi-trash3"></i> 删除', cancelText:'<i class="bi bi-x-lg"></i> 取消', onOk:function () {
      store.users = store.users.filter(function (item) { return item.id !== user.id; }); state.selectedUser = store.users[0].id; state.userDraft = clone(store.users[0]); persist(); render(); notify('用户已删除');
    } });
  }

  function openSystemModal() {
    state.systemModal = true; state.categoryEditor = null; state.systemDraft = { name:'', url:'', categoryId:store.categories[0].id, description:'' }; render();
  }
  function systemError(message) { var error = root.querySelector('[data-pm-system-error]'); if (error) error.textContent = message; }
  function saveSystem() {
    var draft = state.systemDraft;
    if (!draft.name.trim() || !draft.url.trim() || !draft.categoryId || !draft.description.trim()) { systemError('请完整填写系统名称、系统URL、所属分类和系统描述。'); return; }
    var next = store.systems.reduce(function (max, item) { var value = Number(String(item.id).replace(/\D/g,'')) || 0; return Math.max(max,value); },0) + 1;
    store.systems.push({ id:'SYS-' + String(next).padStart(3,'0'), name:draft.name.trim(), url:draft.url.trim(), categoryId:draft.categoryId, description:draft.description.trim() });
    state.systemModal = false; state.categoryEditor = null; persist(); render(); notify('系统已新建');
  }
  function saveCategory() {
    var input = root.querySelector('[data-pm-category-name]'); var value = input ? input.value.trim() : '';
    if (!value) { systemError('请输入分类名称。'); return; }
    if (store.categories.some(function (item) { return item.name === value && (!state.categoryEditor.id || item.id !== state.categoryEditor.id); })) { systemError('分类名称已存在。'); return; }
    if (state.categoryEditor.mode === 'new') { var category = { id:'cat-' + Date.now(), name:value }; store.categories.push(category); state.systemDraft.categoryId = category.id; }
    else { var current = findCategory(state.categoryEditor.id); if (current) current.name = value; }
    state.categoryEditor = null; persist(); render(); notify('系统分类已保存');
  }
  function deleteCategory() {
    var id = state.systemDraft.categoryId; var category = findCategory(id); if (!category) { systemError('请先选择分类。'); return; }
    if (store.systems.some(function (system) { return system.categoryId === id; })) { systemError('该分类已被系统使用，无法删除。'); return; }
    DP.confirm('确定删除分类“' + esc(category.name) + '”吗？', { icon:'danger', onOk:function () { store.categories = store.categories.filter(function (item) { return item.id !== id; }); state.systemDraft.categoryId = store.categories[0] ? store.categories[0].id : ''; persist(); render(); notify('系统分类已删除'); } });
  }

  function handleClick(event) {
    var roleNode = event.target.closest('[data-pm-role]'); if (roleNode) { state.selectedRole = roleNode.dataset.pmRole; state.addingRole = false; render(); return; }
    var userNode = event.target.closest('[data-pm-user]'); if (userNode) { selectUser(userNode.dataset.pmUser); return; }
    var systemTab = event.target.closest('[data-pm-system-tab]'); if (systemTab) { state.activeSystem = systemTab.dataset.pmSystemTab; render(); return; }
    var actionNode = event.target.closest('[data-pm-action]'); if (!actionNode) return;
    var action = actionNode.dataset.pmAction;
    if (action === 'add-role') { state.addingRole = true; render(); }
    else if (action === 'cancel-role') { state.addingRole = false; render(); }
    else if (action === 'delete-role') deleteRole();
    else if (action === 'select-all') selectAllPermissions(false);
    else if (action === 'reverse') selectAllPermissions(true);
    else if (action === 'add-user') newUser();
    else if (action === 'delete-user') deleteUser();
    else if (action === 'save-user') saveUser();
    else if (action === 'resend-email') notify('激活邮件已重新发送至 ' + state.userDraft.email);
    else if (action === 'reset-password') DP.confirm('确定为用户“' + esc(state.userDraft.name) + '”重置密码吗？', { icon:'info', onOk:function () { notify('密码已重置，临时密码已发送至用户邮箱'); } });
    else if (action === 'new-system') openSystemModal();
    else if (action === 'close-system-modal') { state.systemModal = false; state.categoryEditor = null; render(); }
    else if (action === 'import-system') { var file = root.querySelector('[data-pm-system-file]'); if (file) file.click(); }
    else if (action === 'new-category') { state.categoryEditor = { mode:'new', value:'' }; render(); }
    else if (action === 'edit-category') { var category = findCategory(state.systemDraft.categoryId); if (category) { state.categoryEditor = { mode:'edit', id:category.id, value:category.name }; render(); } else systemError('请先选择分类。'); }
    else if (action === 'delete-category') deleteCategory();
    else if (action === 'cancel-category') { state.categoryEditor = null; render(); }
    else if (action === 'save-category') saveCategory();
  }
  function handleInput(event) {
    var target = event.target;
    if (target.matches('[data-pm-role-keyword]')) {
      state.roleKeyword = target.value; render();
      var roleSearch = root.querySelector('[data-pm-role-keyword]'); if (roleSearch) { roleSearch.focus(); roleSearch.setSelectionRange(roleSearch.value.length,roleSearch.value.length); }
    }
    else if (target.matches('[data-pm-user-keyword]')) {
      state.userKeyword = target.value; render();
      var userSearch = root.querySelector('[data-pm-user-keyword]'); if (userSearch) { userSearch.focus(); userSearch.setSelectionRange(userSearch.value.length,userSearch.value.length); }
    }
    else if (target.matches('[data-pm-system-keyword]')) state.systemDraftKeyword = target.value;
    else if (target.matches('[data-pm-user-field]') && state.userDraft) {
      var userField = target.dataset.pmUserField; if (target.type === 'checkbox') state.userDraft[userField] = target.checked; else if (target.type !== 'radio' || target.checked) state.userDraft[userField] = target.value;
    } else if (target.matches('[data-pm-system-field]') && state.systemDraft) {
      state.systemDraft[target.dataset.pmSystemField] = target.value;
      if (target.dataset.pmSystemField === 'description') { var counter = root.querySelector('.pm-char-count'); if (counter) counter.textContent = target.value.length + '/150'; }
    }
  }
  function handleChange(event) {
    var target = event.target;
    if (target.matches('[data-pm-permission]')) setRolePermission(target.dataset.pmPermission,target.checked);
    else if (target.matches('[data-pm-module]')) setModulePermissions(target.dataset.pmModule,target.checked);
    else if (target.matches('[data-pm-user-role]') && state.userDraft) {
      var roleId = target.dataset.pmUserRole; var set = new Set(state.userDraft.roleIds || []); target.checked ? set.add(roleId) : set.delete(roleId); state.userDraft.roleIds = Array.from(set);
    } else if (target.matches('[data-pm-system-file]') && target.files && target.files[0]) { notify('已选择“' + target.files[0].name + '”，导入校验完成'); target.value = ''; }
    else handleInput(event);
  }
  function handleSubmit(event) {
    if (event.target.matches('[data-pm-role-add]')) { event.preventDefault(); addRole(event.target.querySelector('input').value); }
    else if (event.target.matches('[data-pm-user-form]')) { event.preventDefault(); saveUser(); }
    else if (event.target.matches('[data-pm-system-query]')) { event.preventDefault(); state.systemKeyword = state.systemDraftKeyword.trim(); render(); }
    else if (event.target.matches('[data-pm-system-form]')) { event.preventDefault(); saveSystem(); }
  }
  function handleKeydown(event) {
    if (event.key === 'Escape') {
      if (state.categoryEditor) { state.categoryEditor = null; render(); }
      else if (state.systemModal) { state.systemModal = false; render(); }
      else if (state.addingRole) { state.addingRole = false; render(); }
    }
  }
  function init(mode) {
    root = document.querySelector('.page-permission-management'); if (!root) return;
    clearTimeout(toastTimer); store = loadStore(); state.mode = mode === 'user' ? 'user' : (mode === 'system' ? 'system' : 'role');
    state.activeSystem = 'asset'; state.roleKeyword = ''; state.userKeyword = ''; state.systemKeyword = ''; state.systemDraftKeyword = ''; state.addingRole = false; state.systemModal = false; state.categoryEditor = null;
    if (!findRole(state.selectedRole)) state.selectedRole = store.roles[0].id;
    if (!findUser(state.selectedUser)) state.selectedUser = store.users[0].id;
    state.userDraft = clone(findUser(state.selectedUser)); state.userIsNew = false;
    root.addEventListener('click',handleClick); root.addEventListener('input',handleInput); root.addEventListener('change',handleChange); root.addEventListener('submit',handleSubmit); root.addEventListener('keydown',handleKeydown); render();
  }
  return { html:'<div class="page-permission-management"></div>', init:init };
}());
