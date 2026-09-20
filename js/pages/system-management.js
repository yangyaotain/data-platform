/** 数据资产 / 系统管理：数据源类型配置与回收站。 */
window.DP = window.DP || {};
DP.pages = DP.pages || {};

DP.pages.systemManagement = (function () {
  var root = null;
  var categorySeed = [
    { id: 'hadoop', name: 'Hadoop', icon: 'folder-fill', typeIds: ['hbase', 'hive'] },
    { id: 'rdbms', name: '关系型数据库', icon: 'folder-fill', typeIds: ['kingbase', 'oracle', 'mysql5', 'sqlserver', 'postgresql', 'informix', 'gaussdb', 'hana', 'oscardb'] },
    { id: 'nosql', name: 'NoSQL', icon: 'folder-fill', typeIds: ['mongodb', 'elasticsearch', 'redis'] },
    { id: 'mpp', name: 'MPP', icon: 'folder-fill', typeIds: ['impala', 'presto', 'greenplum', 'starrocks'] },
    { id: 'message', name: '消息系统', icon: 'folder-fill', typeIds: ['kafka', 'mqtt', 'activemq', 'ibmmq', 'rabbitmq'] },
    { id: 'file', name: '文件系统', icon: 'folder-fill', typeIds: ['hdfs', 'ftp', 'sftp'] },
    { id: 'timeseries', name: '时序数据库', icon: 'folder-fill', typeIds: ['iotdb'] },
    { id: 'other', name: '其他', icon: 'folder-fill', typeIds: [] }
  ];
  var categories = [];
  var baseTypeNames = [
    'KingBase', 'Oracle', 'MySQL5', 'Hive', 'phoenix', 'SqlServer', 'PostgreSQL', 'Impala',
    'MongoDB', 'HBase', 'Elasticsearch', 'Redis', 'Presto', 'Kafka', 'MQTT', 'Greenplum',
    'Informix', 'HDFS', 'ActiveMQ', 'IBMMQ', 'FTP', 'RabbitMQ', 'SFTP', 'gaussdb', 'HANA',
    'StarRocks', 'OscarDB', 'IoTDB'
  ];
  var driverOptions = [
    'hbase-client-2.4.17.jar', 'hive-jdbc-3.1.3.jar', 'mysql-connector-j-8.0.33.jar',
    'postgresql-42.7.3.jar', 'ojdbc8-19.21.jar', 'starrocks-jdbc-2.5.19.jar'
  ];
  var readWriteOptions = ['FlinkCDC', '单表采集', '流式采集', '批量采集子流程', '批量采集业务流程', '数治'];
  var seedRecycleRows = [
    { id: 'rb-1', name: '订单履约系统_MySQL', operator: '数据源管理员', time: '2026-09-16 17:42:18' },
    { id: 'rb-2', name: '供应商协同库_PostgreSQL', operator: '数据源管理员', time: '2026-09-16 15:26:43' },
    { id: 'rb-3', name: '历史订单库_Oracle', operator: '系统管理员', time: '2026-09-15 18:08:32' },
    { id: 'rb-4', name: '客户主数据_MongoDB', operator: '数据源管理员', time: '2026-09-15 14:33:09' },
    { id: 'rb-5', name: '采购分析库_StarRocks', operator: '数据开发专员', time: '2026-09-14 11:20:57' },
    { id: 'rb-6', name: '实时订单消息_Kafka', operator: '数据开发专员', time: '2026-09-13 16:45:22' },
    { id: 'rb-7', name: '供应链分析库_Greenplum', operator: '数据源管理员', time: '2026-09-12 10:12:48' },
    { id: 'rb-8', name: '数据湖明细区_HDFS', operator: '系统管理员', time: '2026-09-11 09:38:15' },
    { id: 'rb-9', name: '订单查询缓存_Redis', operator: '数据源管理员', time: '2026-09-10 16:29:41' },
    { id: 'rb-10', name: '库存管理库_SqlServer', operator: '数据源管理员', time: '2026-09-10 11:04:36' },
    { id: 'rb-11', name: '设备运行时序库_IoTDB', operator: '数据开发专员', time: '2026-09-09 14:51:07' },
    { id: 'rb-12', name: '文件交换服务_SFTP', operator: '系统管理员', time: '2026-09-08 10:25:19' }
  ];
  var typeSeed = [];
  var recycleRows = [];
  var state = {};

  function clone(value) { return JSON.parse(JSON.stringify(value)); }
  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (char) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char];
    });
  }
  function slug(value) { return String(value).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
  function findCategory(id) { return categories.find(function (item) { return item.id === id; }); }
  function findType(id) { return typeSeed.find(function (item) { return item.id === id; }); }
  function typeByBaseName(name) { return typeSeed.find(function (item) { return item.baseType === name; }); }
  function button(action, icon, label, cls, attrs) {
    return '<button type="button" class="btn ' + (cls || 'btn-outline') + '" data-sm-action="' + action + '" ' + (attrs || '') + '><i class="bi bi-' + icon + '"></i><span>' + label + '</span></button>';
  }
  function makeType(id, name, categoryId, overrides) {
    var defaults = {
      id: id,
      name: name,
      code: name,
      categoryId: categoryId,
      baseType: name,
      drivers: [],
      driverClass: '',
      bigData: categoryId === 'hadoop' || categoryId === 'mpp',
      urlTemplate: '主机地址:端口/数据库名',
      readTypes: ['单表采集', '数治'],
      writeTypes: ['单表采集', '数治']
    };
    Object.keys(overrides || {}).forEach(function (key) { defaults[key] = overrides[key]; });
    return defaults;
  }
  function createTypeSeed() {
    return [
      makeType('hbase', 'HBase', 'hadoop', { drivers: ['hbase-client-2.4.17.jar'], driverClass: 'org.apache.hadoop.hbase.client.ConnectionFactory', urlTemplate: '集群地址1,集群地址2,集群地址3', readTypes: ['单表采集', '流式采集', '数治'], writeTypes: ['单表采集', '流式采集', '数治'] }),
      makeType('hive', 'Hive', 'hadoop', { drivers: ['hive-jdbc-3.1.3.jar'], driverClass: 'org.apache.hive.jdbc.HiveDriver', urlTemplate: 'jdbc:hive2://主机地址:端口/数据库名' }),
      makeType('kingbase', 'KingBase', 'rdbms'), makeType('oracle', 'Oracle', 'rdbms', { drivers: ['ojdbc8-19.21.jar'], driverClass: 'oracle.jdbc.OracleDriver', urlTemplate: 'jdbc:oracle:thin:@主机地址:端口:服务名' }),
      makeType('mysql5', 'MySQL5', 'rdbms', { drivers: ['mysql-connector-j-8.0.33.jar'], driverClass: 'com.mysql.cj.jdbc.Driver', bigData: false, urlTemplate: 'jdbc:mysql://主机地址:端口/数据库名', readTypes: ['FlinkCDC', '单表采集', '批量采集子流程', '数治'], writeTypes: ['FlinkCDC', '单表采集', '批量采集子流程', '数治'] }),
      makeType('sqlserver', 'SqlServer', 'rdbms'), makeType('postgresql', 'PostgreSQL', 'rdbms', { drivers: ['postgresql-42.7.3.jar'], driverClass: 'org.postgresql.Driver', bigData: false, urlTemplate: 'jdbc:postgresql://主机地址:端口/数据库名' }),
      makeType('informix', 'Informix', 'rdbms'), makeType('gaussdb', 'gaussdb', 'rdbms'), makeType('hana', 'HANA', 'rdbms'), makeType('oscardb', 'OscarDB', 'rdbms'),
      makeType('mongodb', 'MongoDB', 'nosql'), makeType('elasticsearch', 'Elasticsearch', 'nosql'), makeType('redis', 'Redis', 'nosql'),
      makeType('impala', 'Impala', 'mpp'), makeType('presto', 'Presto', 'mpp'), makeType('greenplum', 'Greenplum', 'mpp'), makeType('starrocks', 'StarRocks', 'mpp', { drivers: ['starrocks-jdbc-2.5.19.jar'], driverClass: 'com.mysql.cj.jdbc.Driver', urlTemplate: 'jdbc:mysql://FE地址:查询端口/数据库名' }),
      makeType('kafka', 'Kafka', 'message'), makeType('mqtt', 'MQTT', 'message'), makeType('activemq', 'ActiveMQ', 'message'), makeType('ibmmq', 'IBMMQ', 'message'), makeType('rabbitmq', 'RabbitMQ', 'message'),
      makeType('hdfs', 'HDFS', 'file'), makeType('ftp', 'FTP', 'file'), makeType('sftp', 'SFTP', 'file'),
      makeType('iotdb', 'IoTDB', 'timeseries')
    ];
  }
  function dataTypes(name) {
    var map = {
      HBase: ['bigdecimal', 'boolean', 'bytes', 'double', 'float', 'int', 'long', 'short', 'string'],
      Hive: ['bigint', 'boolean', 'binary', 'double', 'float', 'int', 'smallint', 'string', 'timestamp'],
      MySQL5: ['bigint', 'binary', 'blob', 'char', 'date', 'datetime', 'decimal', 'double', 'float', 'int', 'json', 'text', 'timestamp', 'varchar'],
      PostgreSQL: ['bigint', 'boolean', 'bytea', 'date', 'decimal', 'double precision', 'integer', 'jsonb', 'numeric', 'text', 'timestamp', 'varchar'],
      StarRocks: ['bigint', 'boolean', 'char', 'date', 'datetime', 'decimal', 'double', 'float', 'int', 'json', 'largeint', 'string', 'varchar']
    };
    return map[name] || ['bigint', 'boolean', 'date', 'decimal', 'double', 'float', 'int', 'string', 'timestamp', 'varchar'];
  }
  function resetState(mode) {
    categories = clone(categorySeed);
    typeSeed = createTypeSeed();
    recycleRows = clone(seedRecycleRows);
    state = {
      mode: mode,
      tab: 'config',
      configSearchDraft: '',
      configSearch: '',
      treeSearchDraft: '',
      treeSearch: '',
      expanded: new Set(['hadoop']),
      selectedId: 'hbase',
      editorMode: 'edit',
      draft: clone(findType('hbase')),
      driverOpen: false,
      targetPickerOpen: false,
      targetKeyword: '',
      targetExpanded: new Set(['hadoop']),
      targetId: 'hbase',
      mappings: {},
      recycleDraft: '',
      recycleKeyword: '',
      recycleSelected: new Set(),
      recyclePage: 1,
      recyclePageSize: 8,
      message: ''
    };
  }
  function notice() {
    return state.message ? '<div class="sm-notice" role="status"><i class="bi bi-info-circle"></i><span>' + esc(state.message) + '</span></div>' : '';
  }
  function configSelector() {
    var visible = !state.configSearch || '数据源类型'.indexOf(state.configSearch) >= 0;
    return '<aside class="sm-config-selector"><div class="sm-config-search"><input type="text" data-sm-config-search value="' + esc(state.configSearchDraft) + '" placeholder="关键词搜索" aria-label="配置项关键词">' + button('query-config', 'search', '查询', 'btn-primary') + '</div>' +
      '<div class="sm-config-items">' + (visible ? '<button type="button" class="sm-config-item active"><i class="bi bi-card-list"></i><span>数据源类型</span></button>' : '<div class="sm-empty compact"><i class="bi bi-search"></i><span>暂无匹配配置项</span></div>') + '</div></aside>';
  }
  function treeMarkup(context) {
    var keyword = (state.treeSearch || '').trim().toLowerCase();
    var isMapping = context === 'mapping';
    var html = '';
    categories.forEach(function (category) {
      var matches = category.typeIds.map(findType).filter(Boolean).filter(function (item) {
        return !keyword || item.name.toLowerCase().indexOf(keyword) >= 0 || category.name.toLowerCase().indexOf(keyword) >= 0;
      });
      if (keyword && !matches.length && category.name.toLowerCase().indexOf(keyword) < 0) return;
      if (!keyword) matches = category.typeIds.map(findType).filter(Boolean);
      var open = !!keyword || state.expanded.has(category.id);
      html += '<li class="sm-tree-category"><div class="sm-tree-row category"><button type="button" class="sm-tree-toggle" data-sm-action="toggle-category" data-id="' + category.id + '" aria-label="' + (open ? '收起' : '展开') + esc(category.name) + '" aria-expanded="' + open + '"><i class="bi bi-chevron-right"></i></button><i class="bi bi-' + category.icon + '"></i><span>' + esc(category.name) + '</span></div>';
      if (open && matches.length) {
        html += '<ul>' + matches.map(function (item) {
          var activeId = isMapping ? state.selectedId : state.selectedId;
          return '<li><button type="button" class="sm-tree-type' + (activeId === item.id ? ' active' : '') + '" data-sm-action="select-type" data-id="' + item.id + '"><i class="bi bi-hdd-stack"></i><span>' + esc(item.name) + '</span></button></li>';
        }).join('') + '</ul>';
      }
      html += '</li>';
    });
    return html || '<li class="sm-empty compact"><i class="bi bi-search"></i><span>暂无匹配类型</span></li>';
  }
  function typeTree(context) {
    return '<div class="sm-type-tree-wrap"><div class="sm-tree-title"><strong>数据源类型</strong>' + (context === 'config' ? button('new-type', 'plus-lg', '新增', 'btn-outline') : '') + '</div>' +
      '<div class="sm-tree-search"><input type="text" data-sm-tree-search value="' + esc(state.treeSearchDraft) + '" placeholder="搜索类型" aria-label="搜索数据源类型"><button type="button" data-sm-action="query-tree" aria-label="查询"><i class="bi bi-search"></i></button></div>' +
      '<ul class="sm-type-tree">' + treeMarkup(context) + '</ul></div>';
  }
  function selectOptions(values, selected, includeEmpty) {
    return (includeEmpty ? '<option value="">请选择</option>' : '') + values.map(function (value) {
      return '<option value="' + esc(value) + '"' + (value === selected ? ' selected' : '') + '>' + esc(value) + '</option>';
    }).join('');
  }
  function driverPicker(draft) {
    var label = draft.drivers.length ? draft.drivers.join('、') : '可多选';
    return '<div class="sm-driver-picker' + (state.driverOpen ? ' open' : '') + '"><button type="button" class="sm-control sm-driver-trigger" data-sm-action="toggle-drivers"><span>' + esc(label) + '</span><i class="bi bi-chevron-down"></i></button>' +
      '<div class="sm-driver-menu">' + driverOptions.map(function (driver) {
        return '<label><input type="checkbox" data-sm-driver value="' + esc(driver) + '"' + (draft.drivers.indexOf(driver) >= 0 ? ' checked' : '') + '><span>' + esc(driver) + '</span></label>';
      }).join('') + '</div></div>';
  }
  function checkGroup(field, values) {
    return '<div class="sm-check-grid">' + readWriteOptions.map(function (label) {
      return '<label><input type="checkbox" data-sm-check-group="' + field + '" value="' + esc(label) + '"' + (values.indexOf(label) >= 0 ? ' checked' : '') + '><span>' + esc(label) + '</span></label>';
    }).join('') + '</div>';
  }
  function typeForm() {
    var draft = state.draft;
    if (!draft) return '<div class="sm-empty"><i class="bi bi-hdd-stack"></i><span>请选择左侧数据源类型</span></div>';
    var categoryNames = categories.map(function (item) { return item.id; });
    var classOptions = categoryNames.map(function (id) {
      var category = findCategory(id);
      return '<option value="' + id + '"' + (id === draft.categoryId ? ' selected' : '') + '>' + esc(category.name) + '</option>';
    }).join('');
    var driverClasses = ['', 'org.apache.hadoop.hbase.client.ConnectionFactory', 'org.apache.hive.jdbc.HiveDriver', 'com.mysql.cj.jdbc.Driver', 'org.postgresql.Driver', 'oracle.jdbc.OracleDriver'];
    return '<div class="sm-type-form"><div class="sm-form-row"><label for="smTypeName"><b>*</b> 名称</label><div><input id="smTypeName" class="sm-control" maxlength="50" data-sm-field="name" value="' + esc(draft.name) + '"><small><i class="bi bi-info-circle-fill"></i> 50字符以内</small></div></div>' +
      '<div class="sm-form-row"><label for="smTypeCode"><b>*</b> 编码</label><div><input id="smTypeCode" class="sm-control" maxlength="50" data-sm-field="code" value="' + esc(draft.code) + '"><small><i class="bi bi-info-circle-fill"></i> 英文/数字/下划线，50个字符以内</small></div></div>' +
      '<div class="sm-form-row"><label for="smTypeCategory"><b>*</b> 所属分类</label><div><select id="smTypeCategory" class="sm-control" data-sm-field="categoryId">' + classOptions + '</select></div></div>' +
      '<div class="sm-form-row"><label for="smBaseType"><b>*</b> 所属类型</label><div><select id="smBaseType" class="sm-control" data-sm-field="baseType"' + (state.editorMode === 'edit' ? ' disabled' : '') + '>' + selectOptions(baseTypeNames, draft.baseType, true) + '</select></div></div>' +
      '<div class="sm-form-row"><label>驱动</label><div>' + driverPicker(draft) + '</div></div>' +
      '<div class="sm-form-row"><label for="smDriverClass">驱动Class</label><div class="sm-inline-control"><select id="smDriverClass" class="sm-control" data-sm-field="driverClass">' + selectOptions(driverClasses, draft.driverClass, false) + '</select>' + button('read-driver-class', 'arrow-repeat', '获取驱动Class', 'btn-outline') + '</div></div>' +
      '<div class="sm-form-row"><label>大数据管理</label><div class="sm-radio-row"><label><input type="radio" name="smBigData" data-sm-field="bigData" value="true"' + (draft.bigData ? ' checked' : '') + '>是</label><label><input type="radio" name="smBigData" data-sm-field="bigData" value="false"' + (!draft.bigData ? ' checked' : '') + '>否</label></div></div>' +
      '<div class="sm-form-row"><label for="smUrlTemplate">URL模板</label><div><input id="smUrlTemplate" class="sm-control" maxlength="200" data-sm-field="urlTemplate" value="' + esc(draft.urlTemplate) + '"><small><i class="bi bi-info-circle-fill"></i> 200字符以内</small></div></div>' +
      '<div class="sm-form-row wide"><label>支持读的类型</label><div>' + checkGroup('readTypes', draft.readTypes) + '</div></div>' +
      '<div class="sm-form-row wide"><label>支持写的类型</label><div>' + checkGroup('writeTypes', draft.writeTypes) + '</div></div>' +
      '<div class="sm-form-actions">' + button('save-type', 'floppy', '保存', 'btn-primary') + button('delete-type', 'trash3', '删除', 'btn-danger', state.editorMode === 'new' ? 'disabled' : '') + (state.editorMode === 'new' ? button('cancel-new-type', 'x-lg', '取消', 'btn-outline') : '') + '</div></div>';
  }
  function typeConfigTab() {
    return '<div class="sm-type-workspace">' + typeTree('config') + '<div class="sm-type-detail">' + typeForm() + '</div></div>';
  }
  function targetTreeMarkup() {
    var keyword = state.targetKeyword.trim().toLowerCase();
    var html = '';
    categories.forEach(function (category) {
      var types = category.typeIds.map(findType).filter(Boolean);
      var categoryMatch = category.name.toLowerCase().indexOf(keyword) >= 0;
      var matches = types.filter(function (item) { return !keyword || categoryMatch || item.name.toLowerCase().indexOf(keyword) >= 0; });
      if (keyword && !categoryMatch && !matches.length) return;
      var open = !!keyword || state.targetExpanded.has(category.id);
      html += '<div class="sm-target-tree-category"><button type="button" class="sm-target-tree-parent" data-sm-action="toggle-target-category" data-id="' + category.id + '" aria-expanded="' + open + '"><i class="bi bi-chevron-right sm-target-tree-arrow"></i><i class="bi bi-folder-fill"></i><span>' + esc(category.name) + '</span></button>';
      if (open && matches.length) {
        html += '<div class="sm-target-tree-children">' + matches.map(function (item) {
          return '<button type="button" data-sm-action="choose-target" data-id="' + item.id + '" class="sm-target-tree-node' + (item.id === state.targetId ? ' active' : '') + '"><i class="bi bi-hdd-stack"></i><span>' + esc(item.name) + '</span></button>';
        }).join('') + '</div>';
      }
      html += '</div>';
    });
    return html || '<div class="sm-empty compact">暂无匹配类型</div>';
  }
  function targetPicker() {
    if (!state.targetPickerOpen) return '';
    return '<div class="sm-target-picker"><input type="search" class="sm-control" data-sm-target-keyword value="' + esc(state.targetKeyword) + '" placeholder="搜索目标库类型" aria-label="搜索目标库类型"><div class="sm-target-list">' + targetTreeMarkup() + '</div></div>';
  }
  function mappingKey(sourceId, targetId) { return sourceId + '::' + targetId; }
  function getMappings(source, target) {
    var key = mappingKey(source.id, target.id);
    if (!state.mappings[key]) {
      var targetTypes = dataTypes(target.baseType);
      state.mappings[key] = dataTypes(source.baseType).map(function (type) {
        return { type: targetTypes.indexOf(type) >= 0 ? type : (targetTypes[0] || ''), length: '-', precision: '-' };
      });
    }
    return state.mappings[key];
  }
  function mappingTable() {
    var source = findType(state.selectedId) || findType('hbase');
    var target = findType(state.targetId) || source;
    var sourceTypes = dataTypes(source.baseType);
    var targetTypes = dataTypes(target.baseType);
    var mappings = getMappings(source, target);
    return '<div class="sm-mapping-board"><section class="sm-mapping-side"><div class="sm-mapping-label"><span>源库类型</span><input class="sm-control" value="' + esc(source.name) + '" disabled></div><div class="sm-mapping-table-wrap"><table class="sm-mapping-table"><thead><tr><th>数据类型</th><th>长度</th><th>精度</th></tr></thead><tbody>' + sourceTypes.map(function (type) {
      return '<tr><td>' + esc(type) + '</td><td>-</td><td>-</td></tr>';
    }).join('') + '</tbody></table></div></section>' +
      '<div class="sm-mapping-arrows" aria-hidden="true">' + sourceTypes.map(function () { return '<i class="bi bi-arrow-left"></i>'; }).join('') + '</div>' +
      '<section class="sm-mapping-side target"><div class="sm-mapping-label"><span>目标库类型</span><div class="sm-target-control"><input class="sm-control" value="' + esc(target.name) + '" readonly data-sm-action="toggle-target-picker"><button type="button" data-sm-action="toggle-target-picker" aria-label="选择目标库类型"><i class="bi bi-diagram-3"></i></button>' + targetPicker() + '</div></div><div class="sm-mapping-table-wrap"><table class="sm-mapping-table"><thead><tr><th>数据类型</th><th>长度</th><th>精度</th></tr></thead><tbody>' + sourceTypes.map(function (type, index) {
        return '<tr><td><select class="sm-map-input" data-sm-map-index="' + index + '" data-sm-map-field="type" aria-label="' + esc(type) + '映射类型">' + selectOptions(targetTypes, mappings[index].type, true) + '</select></td><td><input class="sm-map-input" data-sm-map-index="' + index + '" data-sm-map-field="length" value="' + esc(mappings[index].length) + '" aria-label="长度"></td><td><input class="sm-map-input" data-sm-map-index="' + index + '" data-sm-map-field="precision" value="' + esc(mappings[index].precision) + '" aria-label="精度"></td></tr>';
      }).join('') + '</tbody></table></div></section></div>';
  }
  function typeMappingTab() {
    return '<div class="sm-type-workspace mapping">' + typeTree('mapping') + '<div class="sm-type-detail mapping">' + mappingTable() + '</div></div>';
  }
  function configPage() {
    return '<section class="sm-config-page">' + configSelector() + '<main class="sm-config-main"><nav class="sm-tabs"><button type="button" data-sm-action="switch-tab" data-tab="config" class="' + (state.tab === 'config' ? 'active' : '') + '">类型配置</button><button type="button" data-sm-action="switch-tab" data-tab="mapping" class="' + (state.tab === 'mapping' ? 'active' : '') + '">类型映射</button></nav>' + (state.tab === 'config' ? typeConfigTab() : typeMappingTab()) + '</main></section>';
  }
  function filteredRecycleRows() {
    var keyword = state.recycleKeyword.trim().toLowerCase();
    return recycleRows.filter(function (item) {
      return !keyword || item.name.toLowerCase().indexOf(keyword) >= 0 || item.operator.toLowerCase().indexOf(keyword) >= 0;
    });
  }
  function recyclePage() {
    var filtered = filteredRecycleRows();
    var pageCount = Math.max(1, Math.ceil(filtered.length / state.recyclePageSize));
    if (state.recyclePage > pageCount) state.recyclePage = pageCount;
    var start = (state.recyclePage - 1) * state.recyclePageSize;
    var rows = filtered.slice(start, start + state.recyclePageSize);
    var allChecked = rows.length && rows.every(function (item) { return state.recycleSelected.has(item.id); });
    return '<section class="sm-recycle-page"><div class="sm-recycle-toolbar"><div>' + button('restore-selected', 'arrow-counterclockwise', '恢复', 'btn-primary', state.recycleSelected.size ? '' : 'disabled') + '</div><div class="sm-recycle-query"><input type="text" class="sm-control" data-sm-recycle-search value="' + esc(state.recycleDraft) + '" placeholder="关键字模糊查询" aria-label="回收站关键字">' + button('query-recycle', 'search', '查询', 'btn-primary') + '</div></div>' +
      '<div class="sm-recycle-table-wrap"><table class="sm-recycle-table"><colgroup><col class="sm-col-check"><col class="sm-col-name"><col class="sm-col-user"><col class="sm-col-time"><col class="sm-col-action"></colgroup><thead><tr><th><input type="checkbox" data-sm-recycle-all' + (allChecked ? ' checked' : '') + ' aria-label="全选"></th><th>名称</th><th>操作者</th><th>操作时间</th><th>操作</th></tr></thead><tbody>' + (rows.length ? rows.map(function (item) {
        return '<tr><td><input type="checkbox" data-sm-recycle-check value="' + item.id + '"' + (state.recycleSelected.has(item.id) ? ' checked' : '') + ' aria-label="选择' + esc(item.name) + '"></td><td><span class="sm-recycle-name"><i class="bi bi-database"></i>' + esc(item.name) + '</span></td><td>' + esc(item.operator) + '</td><td>' + esc(item.time) + '</td><td>' + button('restore-row', 'arrow-counterclockwise', '恢复', 'btn-text', 'data-id="' + item.id + '"') + '</td></tr>';
      }).join('') : '<tr><td colspan="5"><div class="sm-empty table"><i class="bi bi-inbox"></i><span>没有找到匹配的记录</span></div></td></tr>') + '</tbody></table></div>' +
      '<footer class="sm-recycle-pagination"><span>共 ' + filtered.length + ' 条</span><div><button type="button" data-sm-action="recycle-prev"' + (state.recyclePage <= 1 ? ' disabled' : '') + '><i class="bi bi-chevron-left"></i></button><span>' + state.recyclePage + ' / ' + pageCount + '</span><button type="button" data-sm-action="recycle-next"' + (state.recyclePage >= pageCount ? ' disabled' : '') + '><i class="bi bi-chevron-right"></i></button></div></footer></section>';
  }
  function render() {
    if (!root) return;
    root.innerHTML = notice() + (state.mode === 'recycle-bin' ? recyclePage() : configPage());
  }
  function selectType(id) {
    var item = findType(id);
    if (!item) return;
    state.selectedId = id;
    state.editorMode = 'edit';
    state.draft = clone(item);
    state.driverOpen = false;
    state.message = '';
    render();
  }
  function saveType() {
    var draft = state.draft;
    draft.name = draft.name.trim(); draft.code = draft.code.trim(); draft.urlTemplate = draft.urlTemplate.trim();
    if (!draft.name || !draft.code || !draft.categoryId || !draft.baseType) { state.message = '请完整填写名称、编码、所属分类和所属类型'; render(); return; }
    if (!/^[A-Za-z0-9_]+$/.test(draft.code)) { state.message = '编码仅支持英文、数字和下划线'; render(); return; }
    if (typeSeed.some(function (item) { return item.id !== draft.id && item.code.toLowerCase() === draft.code.toLowerCase(); })) { state.message = '数据源类型编码已存在'; render(); return; }
    if (state.editorMode === 'new') {
      draft.id = slug(draft.code) + '-' + Date.now();
      typeSeed.push(clone(draft));
      findCategory(draft.categoryId).typeIds.push(draft.id);
      state.selectedId = draft.id;
      state.editorMode = 'edit';
    } else {
      var original = findType(draft.id);
      if (!original) return;
      if (original.categoryId !== draft.categoryId) {
        var oldCategory = findCategory(original.categoryId);
        if (oldCategory) oldCategory.typeIds = oldCategory.typeIds.filter(function (id) { return id !== draft.id; });
        findCategory(draft.categoryId).typeIds.push(draft.id);
      }
      Object.keys(draft).forEach(function (key) { original[key] = clone(draft[key]); });
    }
    state.expanded.add(draft.categoryId);
    state.draft = clone(findType(state.selectedId));
    state.message = '数据源类型已保存';
    render();
  }
  function deleteType() {
    var item = findType(state.selectedId);
    if (!item) return;
    DP.confirm('确定删除数据源类型“' + esc(item.name) + '”吗？', { icon: 'danger', okText: '<i class="bi bi-trash3"></i> 删除', cancelText: '<i class="bi bi-x-lg"></i> 取消', onOk: function () {
      typeSeed = typeSeed.filter(function (row) { return row.id !== item.id; });
      var category = findCategory(item.categoryId);
      if (category) category.typeIds = category.typeIds.filter(function (id) { return id !== item.id; });
      var fallback = typeSeed[0];
      state.selectedId = fallback ? fallback.id : '';
      state.draft = fallback ? clone(fallback) : null;
      state.message = '数据源类型已删除';
      render();
    } });
  }
  function restore(ids) {
    var rows = recycleRows.filter(function (item) { return ids.indexOf(item.id) >= 0; });
    if (!rows.length) { state.message = '请先勾选需要恢复的记录'; render(); return; }
    DP.confirm(rows.length === 1 ? '确定恢复“' + esc(rows[0].name) + '”吗？' : '确定恢复选中的 ' + rows.length + ' 条记录吗？', { icon: 'info', okText: '<i class="bi bi-arrow-counterclockwise"></i> 恢复', cancelText: '<i class="bi bi-x-lg"></i> 取消', onOk: function () {
      recycleRows = recycleRows.filter(function (item) { return ids.indexOf(item.id) < 0; });
      ids.forEach(function (id) { state.recycleSelected.delete(id); });
      state.message = '已恢复 ' + rows.length + ' 条记录';
      render();
    } });
  }
  function onClick(event) {
    var actionNode = event.target.closest('[data-sm-action]');
    if (!actionNode || !root.contains(actionNode)) {
      if (state.driverOpen && !event.target.closest('.sm-driver-picker')) { state.driverOpen = false; render(); }
      if (state.targetPickerOpen && !event.target.closest('.sm-target-control')) { state.targetPickerOpen = false; render(); }
      return;
    }
    var action = actionNode.dataset.smAction;
    if (action === 'query-config') { state.configSearch = state.configSearchDraft.trim(); render(); }
    else if (action === 'switch-tab') { state.tab = actionNode.dataset.tab; state.message = ''; state.driverOpen = false; state.targetPickerOpen = false; render(); }
    else if (action === 'query-tree') { state.treeSearch = state.treeSearchDraft.trim(); render(); }
    else if (action === 'toggle-category') { var categoryId = actionNode.dataset.id; state.expanded.has(categoryId) ? state.expanded.delete(categoryId) : state.expanded.add(categoryId); render(); }
    else if (action === 'select-type') selectType(actionNode.dataset.id);
    else if (action === 'new-type') {
      state.editorMode = 'new'; state.draft = { id: '', name: '', code: '', categoryId: 'hadoop', baseType: '', drivers: [], driverClass: '', bigData: false, urlTemplate: '', readTypes: [], writeTypes: [] };
      state.driverOpen = false; state.message = ''; render();
    } else if (action === 'cancel-new-type') selectType(state.selectedId || 'hbase');
    else if (action === 'toggle-drivers') { state.driverOpen = !state.driverOpen; render(); }
    else if (action === 'read-driver-class') {
      var match = state.draft.drivers[0] || '';
      if (match.indexOf('hbase') >= 0) state.draft.driverClass = 'org.apache.hadoop.hbase.client.ConnectionFactory';
      else if (match.indexOf('hive') >= 0) state.draft.driverClass = 'org.apache.hive.jdbc.HiveDriver';
      else if (match.indexOf('mysql') >= 0 || match.indexOf('starrocks') >= 0) state.draft.driverClass = 'com.mysql.cj.jdbc.Driver';
      else if (match.indexOf('postgresql') >= 0) state.draft.driverClass = 'org.postgresql.Driver';
      else if (match.indexOf('ojdbc') >= 0) state.draft.driverClass = 'oracle.jdbc.OracleDriver';
      state.message = match ? '已读取驱动Class' : '请先选择驱动'; render();
    } else if (action === 'save-type') saveType();
    else if (action === 'delete-type') deleteType();
    else if (action === 'toggle-target-picker') { state.targetPickerOpen = !state.targetPickerOpen; render(); }
    else if (action === 'toggle-target-category') { var targetCategoryId = actionNode.dataset.id; state.targetExpanded.has(targetCategoryId) ? state.targetExpanded.delete(targetCategoryId) : state.targetExpanded.add(targetCategoryId); render(); }
    else if (action === 'choose-target') { state.targetId = actionNode.dataset.id; state.targetPickerOpen = false; state.targetKeyword = ''; render(); }
    else if (action === 'query-recycle') { state.recycleKeyword = state.recycleDraft.trim(); state.recyclePage = 1; state.recycleSelected.clear(); render(); }
    else if (action === 'restore-selected') restore(Array.from(state.recycleSelected));
    else if (action === 'restore-row') restore([actionNode.dataset.id]);
    else if (action === 'recycle-prev' && state.recyclePage > 1) { state.recyclePage -= 1; render(); }
    else if (action === 'recycle-next') { var count = Math.ceil(filteredRecycleRows().length / state.recyclePageSize); if (state.recyclePage < count) state.recyclePage += 1; render(); }
  }
  function onInput(event) {
    var target = event.target;
    if (target.matches('[data-sm-config-search]')) state.configSearchDraft = target.value;
    else if (target.matches('[data-sm-tree-search]')) state.treeSearchDraft = target.value;
    else if (target.matches('[data-sm-target-keyword]')) { state.targetKeyword = target.value; var picker = target.closest('.sm-target-picker'); if (picker) { var list = picker.querySelector('.sm-target-list'); if (list) list.innerHTML = targetTreeMarkup(); } }
    else if (target.matches('[data-sm-recycle-search]')) state.recycleDraft = target.value;
    else if (target.matches('[data-sm-field]') && state.draft) {
      var field = target.dataset.smField;
      state.draft[field] = field === 'bigData' ? target.value === 'true' : target.value;
    } else if (target.matches('[data-sm-map-index]')) {
      var source = findType(state.selectedId), destination = findType(state.targetId);
      var mapping = getMappings(source, destination)[Number(target.dataset.smMapIndex)];
      mapping[target.dataset.smMapField] = target.value;
    }
  }
  function onChange(event) {
    var target = event.target;
    if (target.matches('[data-sm-driver]') && state.draft) {
      if (target.checked && state.draft.drivers.indexOf(target.value) < 0) state.draft.drivers.push(target.value);
      if (!target.checked) state.draft.drivers = state.draft.drivers.filter(function (value) { return value !== target.value; });
      render();
    } else if (target.matches('[data-sm-check-group]') && state.draft) {
      var field = target.dataset.smCheckGroup;
      if (target.checked && state.draft[field].indexOf(target.value) < 0) state.draft[field].push(target.value);
      if (!target.checked) state.draft[field] = state.draft[field].filter(function (value) { return value !== target.value; });
    } else if (target.matches('[data-sm-recycle-all]')) {
      var rows = filteredRecycleRows().slice((state.recyclePage - 1) * state.recyclePageSize, state.recyclePage * state.recyclePageSize);
      rows.forEach(function (item) { target.checked ? state.recycleSelected.add(item.id) : state.recycleSelected.delete(item.id); });
      render();
    } else if (target.matches('[data-sm-recycle-check]')) {
      target.checked ? state.recycleSelected.add(target.value) : state.recycleSelected.delete(target.value);
      render();
    } else if (target.matches('[data-sm-map-index]')) {
      var source = findType(state.selectedId), destination = findType(state.targetId);
      var mapping = getMappings(source, destination)[Number(target.dataset.smMapIndex)];
      mapping[target.dataset.smMapField] = target.value;
    }
  }
  function onKeydown(event) {
    if (event.key === 'Escape') {
      if (state.driverOpen || state.targetPickerOpen) { state.driverOpen = false; state.targetPickerOpen = false; render(); }
      return;
    }
    if (event.key !== 'Enter') return;
    if (event.target.matches('[data-sm-config-search]')) { event.preventDefault(); state.configSearch = state.configSearchDraft.trim(); render(); }
    else if (event.target.matches('[data-sm-tree-search]')) { event.preventDefault(); state.treeSearch = state.treeSearchDraft.trim(); render(); }
    else if (event.target.matches('[data-sm-recycle-search]')) { event.preventDefault(); state.recycleKeyword = state.recycleDraft.trim(); state.recyclePage = 1; state.recycleSelected.clear(); render(); }
  }
  function init(mode) {
    root = document.querySelector('.page-system-management');
    if (!root) return;
    resetState(mode === 'recycle-bin' ? 'recycle-bin' : 'source-type');
    root.addEventListener('click', onClick);
    root.addEventListener('input', onInput);
    root.addEventListener('change', onChange);
    root.addEventListener('keydown', onKeydown);
    render();
  }
  return { html: '<div class="page-system-management"></div>', init: init };
}());
