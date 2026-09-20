/** 数据中台 V4.0 - 开发配置（按参考系统还原） */
window.DP = window.DP || {};
DP.pages = DP.pages || {};

DP.pages.developmentConfig = {
  tabs: [
    { key: 'naming', label: '表命名规则' },
    { key: 'partition', label: '分区字段' },
    { key: 'field', label: '新增字段' },
    { key: 'script', label: '脚本模板' },
    { key: 'param', label: '全局参数' },
    { key: 'flag', label: '更新标识' },
    { key: 'permission', label: '开发权限' },
    { key: 'public', label: '公共代码' }
  ],
  namingRules: [
    { id: 'n1', name: '批量采集模版', content: 'ods_[原表名]_[更新标识]' },
    { id: 'n2', name: 'dim命名规则', content: 'dim_tms_[原表名]_[更新标识]' },
    { id: 'n3', name: 'ads命名规则', content: 'ads_tms_[原表名]_[更新标识]' },
    { id: 'n4', name: 'dws命名规则', content: 'dws_tms_[原表名]_[更新标识]' },
    { id: 'n5', name: 'dwd命名规则', content: 'dwd_tms_[原表名]_[更新标识]' },
    { id: 'n6', name: 'ods命名规则', content: 'ods_tms_[原表名]_[更新标识]' }
  ],
  params: [
    { id: 'p1', name: 'run_date', desc: 'run_date', editable: '静态参数不可编辑', format: 'yyyy-MM-dd', dev: '2026-09-07', test: '2026-09-07', prod: '2026-09-07', attr: '平台参数【多项目共用】' },
    { id: 'p2', name: 'g_start_dt', desc: 'g_start_dt', editable: '动态参数可编辑', format: 'yyyy-MM-dd HH:mm:ss', dev: '2026-04-14 00:00:00', test: '2026-04-14 00:00:00', prod: '2026-04-14 00:00:00', attr: '平台参数【多项目共用】' },
    { id: 'p3', name: 'g_end_dt', desc: 'g_end_dt', editable: '动态参数可编辑', format: 'yyyy-MM-dd HH:mm:ss', dev: '2026-04-14 00:00:00', test: '2026-04-14 00:00:00', prod: '2026-04-14 00:00:00', attr: '平台参数【多项目共用】' },
    { id: 'p4', name: 'g_dt', desc: 'g_dt', editable: '动态参数可编辑', format: 'yyyyMMdd', dev: '20260414', test: '20260414', prod: '20260414', attr: '平台参数【多项目共用】' },
    { id: 'p5', name: 'datatm', desc: '时间参数', editable: '动态参数可编辑', format: 'yyyy-MM-dd HH:mm:ss', dev: '2026-04-13 00:00:00', test: '2026-04-13 00:00:00', prod: '2026-04-13 00:00:00', attr: '平台参数【多项目共用】' },
    { id: 'p6', name: 'tm', desc: '时间参数', editable: '动态参数可编辑', format: 'yyyy-MM-dd HH:mm:ss', dev: '2026-04-14 00:00:00', test: '2026-04-13 00:00:00', prod: '2026-04-13 00:00:00', attr: '平台参数【多项目共用】' },
    { id: 'p7', name: 'var', desc: '字符串参数', editable: '动态参数可编辑', format: '字符串', dev: 'system', test: 'system', prod: 'system', attr: '平台参数【多项目共用】' },
    { id: 'p8', name: 'data_tm', desc: '时间参数', editable: '动态参数可编辑', format: 'yyyy-MM-dd HH:mm:ss', dev: '2026-04-13 00:00:00', test: '2026-04-13 00:00:00', prod: '2026-04-13 00:00:00', attr: '平台参数【多项目共用】' }
  ],
  flags: [
    { id: 'f1', name: 'hf', note: '按小时全量（hf）' }, { id: 'f2', name: 'hi', note: '按小时增量（hi）' },
    { id: 'f3', name: 'df', note: '按天全量（df）' }, { id: 'f4', name: 'di', note: '按天增量（di）' },
    { id: 'f5', name: 'wf', note: '按周全量（wf）' }, { id: 'f6', name: 'wi', note: '按周增量（wi）' },
    { id: 'f7', name: 'mf', note: '按月全量（mf）' }, { id: 'f8', name: 'mi', note: '按月增量（mi）' }
  ],
  permissionFlows: [
    { id: 'flow1', name: '门店每日销售指标', type: '业务流程', checked: true, branch: true },
    { id: 'flow2', name: '数据质量_造数据', type: '业务流程', checked: true },
    { id: 'flow3', name: '数据标准采集转化', type: '业务流程', checked: true },
    { id: 'flow4', name: '数据采集流程', type: '业务流程', checked: true },
    { id: 'flow5', name: '数治流式', type: '业务流程', checked: true },
    { id: 'flow6', name: '数据治理', type: '业务流程', checked: true, branch: true },
    { id: 'flow7', name: '测试', type: '业务流程', checked: true },
    { id: 'flow8', name: '血缘演示', type: '业务流程', checked: true, branch: true },
    { id: 'flow9', name: '物流离线数仓', type: '业务流程', checked: true, branch: true },
    { id: 'flow10', name: '项目开发流式处理_演示', type: '业务流程', checked: true },
    { id: 'flow11', name: '数治理流程_演示', type: '业务流程', checked: true, branch: true },
    { id: 'flow12', name: '项目开发程序包_演示', type: '业务流程', checked: true },
    { id: 'flow13', name: '项目开发在线编程_演示', type: '业务流程', checked: true },
    { id: 'flow14', name: '项目开发数据标化_演示', type: '业务流程', checked: true },
    { id: 'flow15', name: '项目开发_任务触发演示', type: '业务流程', checked: true },
    { id: 'flow16', name: '项目开发_共享任务演示', type: '业务流程', checked: true },
    { id: 'flow17', name: '数据采集_质量规则稽查任务', type: '子流程', checked: true },
    { id: 'flow18', name: '中电数智流式数仓', type: '业务流程', checked: true },
    { id: 'flow19', name: '数据采集加密和解密_演示', type: '子流程', checked: true },
    { id: 'flow20', name: '批量处理_批量采集演示', type: '子流程', checked: true }
  ],
  templates: {
    partition: [{ id: 'tp1', name: 'data_tm', db: 'hive', isDefault: true, fields: [{ name: 'tm', alias: '时间参数', type: 'BIGINT', param: 'var(字符串参数)' }] }],
    field: [{ id: 'tf1', name: 'hive新增字段', db: 'hive', isDefault: true, fields: [{ content: 'system', name: 'system', alias: '默认参数', type: 'STRING' }] }]
  },
  publicCodes: [
    { id: 'c1', name: 'ODS通用审计字段', type: 'SQL', note: '补充数据日期、创建时间和来源系统字段', code: 'data_date STRING COMMENT \'数据日期\',\ncreate_time TIMESTAMP COMMENT \'创建时间\',\nsource_system STRING COMMENT \'来源系统\'' },
    { id: 'c2', name: '运单有效数据条件', type: 'SQL', note: '过滤已删除及无效运单记录', code: 'is_deleted = 0\nAND waybill_status <> \'INVALID\'' },
    { id: 'c3', name: 'Hive分区清理语句', type: 'SQL', note: '清理指定日期前的历史分区', code: 'ALTER TABLE ${tablename} DROP IF EXISTS PARTITION (dt < \'${run_date}\');' }
  ],
  databaseTypes: ['hive', 'mysql', 'postgresql', 'oracle', 'starrocks', 'clickhouse'],
  scriptTemplates: {
    'SQL': '--作者：数据开发组\n--时间：2026-09-20\nSELECT waybill_no, order_status, update_time\nFROM ods_tms_waybill_di\nWHERE dt = \'${run_date}\';',
    'Hive SQL': '-- 运单主题日增量装载\nINSERT OVERWRITE TABLE dwd_tms_waybill_detail_di PARTITION (dt=\'${run_date}\')\nSELECT * FROM ods_tms_waybill_di WHERE dt = \'${run_date}\';',
    'python脚本': '# 运单文件数据清洗\nfrom pyspark.sql import SparkSession\n\nspark = SparkSession.builder.appName("waybill_clean").getOrCreate()\ndf = spark.table("ods_tms_waybill_di")\ndf.dropDuplicates(["waybill_no"]).write.mode("overwrite").saveAsTable("dwd_tms_waybill_clean")',
    'R语言脚本': '# 线路时效统计\nwaybill <- read.csv("waybill_duration.csv")\nresult <- aggregate(duration ~ route_code, waybill, mean)\nwrite.csv(result, "route_duration_result.csv", row.names = FALSE)',
    'Sqoop Job': 'sqoop job --create waybill_import -- import \\\n+--connect jdbc:mysql://prod-mysql:3306/tms \\\n+--table t_waybill --target-dir /warehouse/ods/tms_waybill \\\n+--incremental lastmodified --check-column update_time',
    '存储过程': 'CREATE PROCEDURE refresh_waybill_summary(IN p_date DATE)\nBEGIN\n  DELETE FROM ads_waybill_summary WHERE stat_date = p_date;\n  INSERT INTO ads_waybill_summary SELECT p_date, COUNT(*) FROM dwd_waybill WHERE dt = p_date;\nEND;',
    'Spark 程序': 'val waybill = spark.table("dwd_tms_waybill_detail_di")\nval summary = waybill.groupBy("route_code").count()\nsummary.write.mode("overwrite").saveAsTable("dws_route_waybill_1d")',
    'Shell脚本': '#!/bin/bash\nRUN_DATE=${run_date}\nbeeline -u "${HIVE_URL}" -e "MSCK REPAIR TABLE ods_tms_waybill_di;"\necho "waybill partition repaired: ${RUN_DATE}"',
    'Impala脚本': 'INVALIDATE METADATA dwd_tms_waybill_detail_di;\nCOMPUTE STATS dwd_tms_waybill_detail_di PARTITION (dt=\'${run_date}\');'
  },
  html: '<div class="page-development-config" id="developmentConfigPage"></div>',

  init: function () {
    this.state = { tab: 'naming', keyword: '', filter: '', inline: null, newTemplate: null, templateRow: null, scriptType: 'SQL', permissionSide: 'department', permissionNode: '演示-测试', permissionKeyword: '', flowKeyword: '', flowFilter: '', publicModal: null, sqlTheme: 'dark', sqlFont: '14px', sqlSearchOpen: false };
    this.render();
  },
  esc: function (value) {
    return String(value == null ? '' : value).replace(/[&<>\"]/g, function (ch) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]; });
  },
  render: function () {
    var root = document.getElementById('developmentConfigPage');
    if (!root) return;
    root.innerHTML = '<div class="dc-page">' + this.tabsHtml() + '<main class="dc-content">' + this.contentHtml() + '</main>' + this.publicModalHtml() + '<div class="dc-toast" id="dcToast" role="status"></div></div>';
    this.bind();
  },
  tabsHtml: function () {
    var self = this;
    return '<nav class="dc-tabs" aria-label="开发配置分类"><div class="dc-tab-list">' + this.tabs.map(function (tab) { return '<button class="dc-tab ' + (self.state.tab === tab.key ? 'active' : '') + '" type="button" data-dc-tab="' + tab.key + '">' + tab.label + '</button>'; }).join('') + '</div></nav>';
  },
  contentHtml: function () {
    var handlers = { naming: this.namingHtml, partition: this.templateHtml, field: this.templateHtml, script: this.scriptHtml, param: this.paramHtml, flag: this.flagHtml, permission: this.permissionHtml, public: this.publicHtml };
    return handlers[this.state.tab].call(this);
  },
  queryHtml: function (options) {
    options = options || {};
    return '<div class="dc-query ' + (options.start ? 'align-start' : '') + '">' + (options.before || '') + '<input class="dc-input dc-query-input" type="text" data-dc-keyword value="' + this.esc(this.state.keyword) + '" placeholder="' + (options.placeholder || '请输入关键字查询') + '"><button class="btn btn-primary" type="button" data-dc-query><i class="bi bi-search"></i> 查询</button></div>';
  },
  namingHtml: function () {
    var self = this;
    var rows = this.namingRules.filter(function (row) { return (!self.state.keyword || row.name.indexOf(self.state.keyword) > -1 || row.content.indexOf(self.state.keyword) > -1) && (!self.state.filter || row.content.indexOf(self.state.filter) > -1); });
    var before = '<label class="dc-query-label">模板变量：<select class="dc-select" data-dc-filter><option value="">请选择模板变量</option><option value="[原表名]">[原表名]</option><option value="[更新标识]">[更新标识]</option></select></label>';
    var editing = this.state.inline && this.state.inline.kind === 'naming';
    return this.queryHtml({ before: before, placeholder: '名称查询', start: true }) + '<div class="dc-table-shell"><table class="dc-table"><thead><tr><th>模板名称</th><th>模板内容</th><th class="dc-operation-col">操作 <button class="dc-head-add" type="button" data-dc-inline-add="naming" title="新增"><i class="bi bi-plus-lg"></i></button></th></tr></thead><tbody>' + (editing && this.state.inline.isNew ? this.inlineNamingRow() : '') + rows.map(function (row) { if (editing && self.state.inline.id === row.id) return self.inlineNamingRow(); return '<tr><td>' + self.esc(row.name) + '</td><td>' + self.esc(row.content) + '</td><td class="dc-operation-col"><div class="dc-row-actions"><button type="button" data-dc-inline-edit="naming" data-id="' + row.id + '" title="编辑"><i class="bi bi-pencil-square"></i></button><button class="danger" type="button" data-dc-delete="naming" data-id="' + row.id + '" title="删除"><i class="bi bi-trash3"></i></button></div></td></tr>'; }).join('') + '</tbody></table></div>' + this.pager(rows.length);
  },
  inlineNamingRow: function () {
    var row = this.state.inline.row;
    return '<tr class="dc-inline-row"><td><input class="dc-input" data-dc-inline-field="name" maxlength="250" value="' + this.esc(row.name) + '" placeholder="250个字符以内"></td><td><input class="dc-input" data-dc-inline-field="content" value="' + this.esc(row.content) + '" placeholder="自定义文字"></td><td class="dc-operation-col">' + this.inlineActions() + '</td></tr>';
  },
  paramHtml: function () {
    var self = this;
    var rows = this.params.filter(function (row) { return (!self.state.keyword || row.name.indexOf(self.state.keyword) > -1 || row.desc.indexOf(self.state.keyword) > -1) && (!self.state.filter || row.editable === self.state.filter); });
    var before = '<label class="dc-query-label">参数属性：<select class="dc-select" data-dc-filter><option value="">全部</option><option value="静态参数不可编辑">静态参数不可编辑</option><option value="动态参数可编辑">动态参数可编辑</option></select></label>';
    var editing = this.state.inline && this.state.inline.kind === 'param';
    return this.queryHtml({ before: before, placeholder: '参数名查询' }) + '<div class="dc-table-shell"><table class="dc-table dc-param-table"><thead><tr><th>参数名</th><th>参数说明</th><th>编辑属性</th><th>数据格式</th><th>默认值（开发环境）</th><th>默认值（测试环境）</th><th>默认值（生产环境）</th><th>参数属性</th><th class="dc-operation-col">操作 <button class="dc-head-add" type="button" data-dc-inline-add="param" title="新增"><i class="bi bi-plus-lg"></i></button></th></tr></thead><tbody>' + (editing && this.state.inline.isNew ? this.inlineParamRow() : '') + rows.map(function (row) { if (editing && self.state.inline.id === row.id) return self.inlineParamRow(); return '<tr><td>' + row.name + '</td><td>' + row.desc + '</td><td>' + row.editable + '</td><td>' + row.format + '</td><td>' + row.dev + '</td><td>' + row.test + '</td><td>' + row.prod + '</td><td>' + row.attr + '</td><td class="dc-operation-col"><div class="dc-row-actions"><button type="button" data-dc-inline-edit="param" data-id="' + row.id + '" title="编辑"><i class="bi bi-pencil-square"></i></button><button class="danger" type="button" data-dc-delete="param" data-id="' + row.id + '" title="删除"><i class="bi bi-trash3"></i></button></div></td></tr>'; }).join('') + '</tbody></table></div>' + this.pager(rows.length);
  },
  inlineParamRow: function () {
    var row = this.state.inline.row;
    function selected(current, value) { return current === value ? ' selected' : ''; }
    return '<tr class="dc-inline-row"><td><input class="dc-input" data-dc-inline-field="name" maxlength="50" value="' + this.esc(row.name) + '" placeholder="50个字符以内"></td><td><input class="dc-input" data-dc-inline-field="desc" maxlength="50" value="' + this.esc(row.desc) + '" placeholder="50个字符以内"></td><td><select class="dc-select" data-dc-inline-field="editable"><option value="">请选择</option><option' + selected(row.editable, '静态参数不可编辑') + '>静态参数不可编辑</option><option' + selected(row.editable, '动态参数可编辑') + '>动态参数可编辑</option></select></td><td><select class="dc-select" data-dc-inline-field="format"><option' + selected(row.format, 'yyyy-MM-dd HH:mm:ss') + '>yyyy-MM-dd HH:mm:ss</option><option' + selected(row.format, 'yyyy-MM-dd') + '>yyyy-MM-dd</option><option' + selected(row.format, 'yyyyMMdd') + '>yyyyMMdd</option><option' + selected(row.format, '字符串') + '>字符串</option></select></td><td><input class="dc-input" data-dc-inline-field="dev" value="' + this.esc(row.dev) + '"></td><td><input class="dc-input" data-dc-inline-field="test" value="' + this.esc(row.test) + '"></td><td><input class="dc-input" data-dc-inline-field="prod" value="' + this.esc(row.prod) + '"></td><td><select class="dc-select" data-dc-inline-field="attr"><option>平台参数【多项目共用】</option><option>项目参数【当前项目】</option></select></td><td class="dc-operation-col">' + this.inlineActions() + '</td></tr>';
  },
  flagHtml: function () {
    var self = this;
    var rows = this.flags.filter(function (row) { return !self.state.keyword || row.name.indexOf(self.state.keyword) > -1 || row.note.indexOf(self.state.keyword) > -1; });
    var editing = this.state.inline && this.state.inline.kind === 'flag';
    function editRow() { return '<tr class="dc-inline-row"><td><input class="dc-input" data-dc-inline-field="name" maxlength="30" value="' + self.esc(self.state.inline.row.name) + '" placeholder="30个字符以内"></td><td><input class="dc-input" data-dc-inline-field="note" maxlength="100" value="' + self.esc(self.state.inline.row.note) + '" placeholder="100个字符以内"></td><td class="dc-operation-col">' + self.inlineActions() + '</td></tr>'; }
    return this.queryHtml({ placeholder: '更新标识查询' }) + '<div class="dc-table-shell"><table class="dc-table"><thead><tr><th>更新标识</th><th>备注</th><th class="dc-operation-col">操作 <button class="dc-head-add" type="button" data-dc-inline-add="flag" title="新增"><i class="bi bi-plus-lg"></i></button></th></tr></thead><tbody>' + (editing && this.state.inline.isNew ? editRow() : '') + rows.map(function (row) { if (editing && self.state.inline.id === row.id) return editRow(); return '<tr><td>' + row.name + '</td><td>' + row.note + '</td><td class="dc-operation-col"><div class="dc-row-actions"><button type="button" data-dc-inline-edit="flag" data-id="' + row.id + '" title="编辑"><i class="bi bi-pencil-square"></i></button><button class="danger" type="button" data-dc-delete="flag" data-id="' + row.id + '" title="删除"><i class="bi bi-trash3"></i></button></div></td></tr>'; }).join('') + '</tbody></table></div>' + this.pager(rows.length);
  },
  inlineActions: function () {
    return '<div class="dc-row-actions"><button type="button" data-dc-inline-save title="确认"><i class="bi bi-check-lg"></i></button><button type="button" data-dc-inline-cancel title="取消"><i class="bi bi-x-lg"></i></button></div>';
  },
  templateHtml: function () {
    var kind = this.state.tab;
    var cards = [];
    if (this.state.newTemplate && this.state.newTemplate.kind === kind) cards.push(this.templateCardHtml(this.state.newTemplate.row, kind, true));
    for (var i = 0; i < this.templates[kind].length; i += 1) cards.push(this.templateCardHtml(this.templates[kind][i], kind, false));
    return '<div class="dc-template-toolbar"><button class="btn btn-primary" type="button" data-dc-template-add><i class="bi bi-plus-lg"></i> 添加</button></div>' + cards.join('');
  },
  templateCardHtml: function (template, kind, isNew) {
    var isPartition = kind === 'partition';
    var heads = isPartition ? ['英文分区名', '别名', '字段类型', '参数配置'] : ['字段内容', '字段英文名', '字段别名', '字段类型'];
    var rowEdit = this.state.templateRow;
    var self = this;
    var body = (template.fields || []).map(function (field, index) {
      if (rowEdit && rowEdit.templateId === template.id && rowEdit.index === index) return self.templateFieldEditHtml(kind);
      return '<tr>' + (isPartition ? '<td>' + field.name + '</td><td>' + field.alias + '</td><td>' + field.type + '</td><td>' + field.param + '</td>' : '<td>' + field.content + '</td><td>' + field.name + '</td><td>' + field.alias + '</td><td>' + field.type + '</td>') + '<td class="dc-operation-col"><div class="dc-row-actions"><button type="button" data-dc-template-field-edit data-template="' + template.id + '" data-index="' + index + '" title="编辑"><i class="bi bi-pencil-square"></i></button><button class="danger" type="button" data-dc-template-field-delete data-template="' + template.id + '" data-index="' + index + '" title="删除"><i class="bi bi-trash3"></i></button></div></td></tr>';
    }).join('');
    if (rowEdit && rowEdit.templateId === template.id && rowEdit.isNew) body = this.templateFieldEditHtml(kind) + body;
    var dbOptions = this.databaseTypes.map(function (type) { return '<option value="' + type + '" ' + (template.db === type ? 'selected' : '') + '>' + type + '</option>'; }).join('');
    return '<section class="dc-template-card" data-template-card="' + template.id + '"><div class="dc-template-form"><label><span><em>*</em> 模板名称</span><input class="dc-input" data-dc-template-name value="' + this.esc(template.name) + '" placeholder="请输入模板名称"></label><label><span>应用数据库类型</span><select class="dc-select" data-dc-template-db ' + (isNew ? '' : 'disabled') + '>' + dbOptions + '</select></label><div class="dc-template-actions"><button class="btn btn-primary" type="button" data-dc-template-save data-template="' + template.id + '" data-new="' + isNew + '"><i class="bi bi-save"></i> 保存</button><button class="btn btn-danger" type="button" data-dc-template-delete data-template="' + template.id + '" data-new="' + isNew + '"><i class="bi bi-trash3"></i> 删除</button></div><label class="dc-default-radio"><input type="radio" name="dcDefault-' + kind + '" ' + (template.isDefault ? 'checked' : '') + '> 默认模板 <button type="button" data-dc-default-cancel>取消</button></label></div><div class="dc-table-shell"><table class="dc-table"><thead><tr>' + heads.map(function (head) { return '<th>' + head + '</th>'; }).join('') + '<th class="dc-operation-col">操作 <button class="dc-head-add" type="button" data-dc-template-field-add data-template="' + template.id + '" title="新增字段"><i class="bi bi-plus-lg"></i></button></th></tr></thead><tbody>' + (body || this.emptyRow(5)) + '</tbody></table></div></section>';
  },
  templateFieldEditHtml: function (kind) {
    var row = this.state.templateRow.row;
    var partition = kind === 'partition';
    return '<tr class="dc-inline-row">' + (partition ? '<td><input class="dc-input" data-dc-tfield="name" value="' + this.esc(row.name) + '"></td><td><input class="dc-input" data-dc-tfield="alias" value="' + this.esc(row.alias) + '"></td><td><select class="dc-select" data-dc-tfield="type"><option>BIGINT</option><option>STRING</option></select></td><td><select class="dc-select" data-dc-tfield="param"><option>var(字符串参数)</option><option>tm(时间参数)</option></select></td>' : '<td><input class="dc-input" data-dc-tfield="content" value="' + this.esc(row.content) + '"></td><td><input class="dc-input" data-dc-tfield="name" value="' + this.esc(row.name) + '"></td><td><input class="dc-input" data-dc-tfield="alias" value="' + this.esc(row.alias) + '"></td><td><select class="dc-select" data-dc-tfield="type"><option>STRING</option><option>BIGINT</option></select></td>') + '<td class="dc-operation-col"><div class="dc-row-actions"><button type="button" data-dc-template-field-save title="确认"><i class="bi bi-check-lg"></i></button><button type="button" data-dc-template-field-cancel title="取消"><i class="bi bi-x-lg"></i></button></div></td></tr>';
  },
  scriptHtml: function () {
    var self = this;
    var options = Object.keys(this.scriptTemplates).map(function (type) { return '<option value="' + type + '" ' + (self.state.scriptType === type ? 'selected' : '') + '>' + type + '</option>'; }).join('');
    return '<div class="dc-script-config"><select class="dc-select" data-dc-script-type>' + options + '</select><button class="btn btn-primary" type="button" data-dc-script-save><i class="bi bi-save"></i> 保存</button></div>' + this.codeEditorHtml(this.scriptTemplates[this.state.scriptType], 'script');
  },
  codeEditorHtml: function (value, scope) {
    var isLight = this.state.sqlTheme === 'light';
    var self = this;
    var sizes = ['12px', '13px', '14px', '15px', '16px'].map(function (size) { return '<option value="' + size + '"' + (self.state.sqlFont === size ? ' selected' : '') + '>' + size + '</option>'; }).join('');
    return '<div class="dp-sql-editor dc-public-sql-editor ' + (isLight ? 'theme-light' : 'theme-dark') + (this.state.sqlSearchOpen ? ' search-open' : '') + '" data-dc-sql-editor="' + scope + '" style="font-size:' + this.state.sqlFont + ';">' +
      '<div class="dp-sql-editor-toolbar"><select class="dp-sql-editor-select" data-dc-sql-theme aria-label="编辑器主题"><option value="dark"' + (!isLight ? ' selected' : '') + '>暗色 - One Dark</option><option value="light"' + (isLight ? ' selected' : '') + '>亮色 - Light</option></select><select class="dp-sql-editor-select" data-dc-sql-font aria-label="编辑器字号">' + sizes + '</select>' +
      '<button class="dp-sql-editor-btn" type="button" data-dc-editor-action="format"><i class="bi bi-sliders"></i><span>格式化</span></button><button class="dp-sql-editor-btn" type="button" data-dc-editor-action="copy"><i class="bi bi-clipboard"></i><span>复制</span></button><button class="dp-sql-editor-btn" type="button" data-dc-editor-action="search"><i class="bi bi-search"></i><span>搜索</span></button><button class="dp-sql-editor-btn" type="button" data-dc-editor-action="full" aria-pressed="false" title="进入全屏"><i class="bi bi-arrows-fullscreen"></i><span>全屏</span></button></div>' +
      '<div class="dp-sql-editor-searchbar"><input class="dp-sql-editor-input" type="search" data-dc-sql-find placeholder="查找..."><button class="dp-sql-editor-btn" type="button" data-dc-editor-action="find-next"><i class="bi bi-chevron-down"></i><span>下一个</span></button><button class="dp-sql-editor-btn" type="button" data-dc-editor-action="find-prev"><i class="bi bi-chevron-up"></i><span>上一个</span></button><label class="dp-sql-editor-check"><input type="checkbox" data-dc-sql-case> 区分大小写</label><span class="dp-sql-editor-close" data-dc-editor-action="close-search" title="关闭搜索"><i class="bi bi-x"></i></span></div>' +
      '<div class="dp-sql-editor-wrap"><div class="dp-sql-editor-gutter" data-dc-sql-gutter>' + this.sqlLineNumbers(value) + '</div><div class="dp-sql-editor-content" data-dc-sql-content="' + scope + '" contenteditable="true" spellcheck="false">' + this.highlightSql(value) + '</div></div></div>';
  },
  highlightSql: function (code) {
    var html = this.esc(code || '');
    html = html.replace(/(--.*)$/gm, '<span class="dp-sql-comment">$1</span>');
    html = html.replace(/('(?:''|[^'])*')/g, '<span class="dp-sql-string">$1</span>');
    html = html.replace(/(\$\{[^}]+\})/g, '<span class="dp-sql-var">$1</span>');
    html = html.replace(/\b(SELECT|FROM|WHERE|AND|OR|NOT|NULL|AS|CREATE|PROCEDURE|BEGIN|DELETE|ALTER|DROP|TABLE|INSERT|OVERWRITE|INTO|VALUES|PARTITION|GROUP|BY|HAVING|ORDER|JOIN|LEFT|RIGHT|INNER|ON|LIMIT|DISTINCT|COUNT|SUM|MAX|MIN|AVG|CASE|WHEN|THEN|ELSE|END|IF|EXISTS)\b/gi, '<span class="dp-sql-keyword">$1</span>');
    return html;
  },
  sqlLineNumbers: function (code) {
    var total = Math.max(1, String(code || '').split('\n').length), html = '';
    for (var index = 1; index <= total; index += 1) html += '<div>' + index + '</div>';
    return html;
  },
  readSqlEditor: function (scope) {
    var content = document.querySelector('[data-dc-sql-content="' + scope + '"]');
    return content ? String(content.innerText || content.textContent || '').replace(/\u00a0/g, ' ').replace(/\r/g, '') : '';
  },
  updateEditorValue: function (scope, value) {
    if (scope === 'script') this.scriptTemplates[this.state.scriptType] = value;
    if (scope === 'public' && this.state.publicModal) this.state.publicModal.row.code = value;
  },
  permissionHtml: function () {
    var side = this.state.permissionSide;
    var memberTree = side === 'department' ? '<div class="dc-tree"><button class="dc-tree-node expanded" type="button" data-dc-permission-node="我的部门"><i class="bi bi-chevron-down"></i><i class="bi bi-folder-fill root"></i> 我的部门</button><button class="dc-tree-node child ' + (this.state.permissionNode === '演示-测试' ? 'active' : '') + '" type="button" data-dc-permission-node="演示-测试"><i class="bi bi-folder-fill"></i> 演示-测试</button></div>' : '<div class="dc-tree dc-role-tree"><div class="dc-role-group"><strong><i class="bi bi-chevron-down"></i><i class="bi bi-folder-fill root"></i> 开发人员</strong><button type="button" data-dc-permission-node="王畅"><i class="bi bi-person-fill"></i> 王畅</button><button type="button" data-dc-permission-node="张红彬"><i class="bi bi-person-fill"></i> 张红彬</button></div><div class="dc-role-group"><strong><i class="bi bi-chevron-down"></i><i class="bi bi-folder-fill root"></i> 用户</strong><button type="button" data-dc-permission-node="张红彬"><i class="bi bi-person-fill"></i> 张红彬</button><button type="button" data-dc-permission-node="王鹏"><i class="bi bi-person-fill"></i> 王鹏</button></div><div class="dc-role-group"><strong><i class="bi bi-chevron-down"></i><i class="bi bi-folder-fill root"></i> 超级管理员</strong><button type="button" data-dc-permission-node="王鹏"><i class="bi bi-person-fill"></i> 王鹏</button></div></div>';
    var self = this;
    var flows = this.permissionFlows.filter(function (flow) { return (!self.state.flowFilter || flow.type === self.state.flowFilter) && (!self.state.flowKeyword || flow.name.indexOf(self.state.flowKeyword) > -1); });
    var flowTree = this.state.permissionNode ? '<div class="dc-flow-tree"><label class="dc-flow-all"><input type="checkbox" data-dc-flow-all checked><i class="bi bi-globe2"></i> 全部流程</label>' + flows.map(function (flow) { return '<label><span class="dc-flow-branch">' + (flow.branch ? '<i class="bi bi-chevron-right"></i>' : '') + '</span><input type="checkbox" data-dc-flow-id="' + flow.id + '" ' + (flow.checked ? 'checked' : '') + '><i class="bi bi-globe2"></i><span>' + flow.name + '</span></label>'; }).join('') + '</div>' : '<div class="dc-empty dc-flow-empty">请选择项目成员</div>';
    return '<div class="dc-permission"><section class="dc-member-panel"><h3>项目成员</h3><div class="dc-member-tabs"><button type="button" data-dc-permission-side="department" class="' + (side === 'department' ? 'active' : '') + '">部门</button><button type="button" data-dc-permission-side="role" class="' + (side === 'role' ? 'active' : '') + '">角色</button></div><div class="dc-search-box"><input class="dc-input" data-dc-member-search value="' + this.esc(this.state.permissionKeyword) + '" placeholder="请输入搜索关键字"><i class="bi bi-search"></i></div>' + memberTree + '</section><section class="dc-flow-panel"><h3>开发流程</h3><div class="dc-flow-query"><select class="dc-select" data-dc-flow-filter><option value="">全部</option><option value="业务流程">业务流程</option><option value="子流程">子流程</option></select><div class="dc-search-box"><input class="dc-input" data-dc-flow-search value="' + this.esc(this.state.flowKeyword) + '" placeholder="请输入搜索关键字"><i class="bi bi-search"></i></div></div>' + flowTree + '</section></div>';
  },
  publicHtml: function () {
    var self = this;
    var rows = this.publicCodes.filter(function (row) { return (!self.state.keyword || row.name.indexOf(self.state.keyword) > -1 || row.note.indexOf(self.state.keyword) > -1) && (!self.state.filter || row.type === self.state.filter); });
    var before = '<button class="btn btn-primary dc-new-public" type="button" data-dc-public-new><i class="bi bi-plus-lg"></i> 新建</button><label class="dc-query-label">类型：<select class="dc-select" data-dc-filter><option value="">全部</option><option value="SQL">SQL</option></select></label>';
    return this.queryHtml({ before: before, placeholder: '请输入关键字查询', start: true }) + '<div class="dc-table-shell"><table class="dc-table"><thead><tr><th>名称</th><th>类型</th><th>备注</th><th class="dc-operation-col">操作</th></tr></thead><tbody>' + (rows.length ? rows.map(function (row) { return '<tr><td>' + self.esc(row.name) + '</td><td>' + row.type + '</td><td>' + self.esc(row.note) + '</td><td class="dc-operation-col"><div class="dc-row-actions"><button type="button" data-dc-public-edit="' + row.id + '" title="编辑"><i class="bi bi-pencil-square"></i></button><button class="danger" type="button" data-dc-delete="public" data-id="' + row.id + '" title="删除"><i class="bi bi-trash3"></i></button></div></td></tr>'; }).join('') : this.emptyRow(4)) + '</tbody></table></div>' + this.pager(rows.length);
  },
  publicModalHtml: function () {
    var modal = this.state.publicModal;
    if (!modal) return '';
    var row = modal.row;
    return '<div class="dc-modal-mask"><section class="dc-public-modal" role="dialog" aria-modal="true"><header><h3>' + (modal.isNew ? '公共代码新增' : '公共代码编辑') + '</h3><button type="button" data-dc-public-close title="关闭"><i class="bi bi-x-lg"></i></button></header><div class="dc-public-body"><div class="dc-public-grid"><label><span><em>*</em> 名称</span><input class="dc-input" data-dc-public-field="name" maxlength="50" value="' + this.esc(row.name) + '" placeholder="50个字符以内"></label><label><span><em>*</em> 类型</span><select class="dc-select" data-dc-public-field="type"><option>SQL</option></select></label><label class="wide"><span>说明</span><textarea class="dc-input" data-dc-public-field="note" placeholder="请输入说明">' + this.esc(row.note) + '</textarea></label></div><div class="dc-public-code"><label>公共代码</label>' + this.codeEditorHtml(row.code, 'public') + '</div><div class="dc-code-note"><p>1、<strong>${tablename}</strong> 作为固定参数，在数据采集的建表SQL中，会自动替换当前表的表名；</p><p>2、公共代码的使用，在数据开发模块的编辑器中，/键，自动下拉选择块的默认应用；</p></div><p class="dc-form-error" id="dcPublicError"></p></div><footer><button class="btn btn-text" type="button" data-dc-public-close><i class="bi bi-x-lg"></i> 取消</button><button class="btn btn-primary" type="button" data-dc-public-save><i class="bi bi-check-lg"></i> 保存</button></footer></section></div>';
  },
  emptyRow: function (cols) { return '<tr><td colspan="' + cols + '"><div class="dc-empty">暂无数据</div></td></tr>'; },
  pager: function (total) { return '<footer class="dc-pagination"><span>共 ' + total + ' 条</span><button disabled><i class="bi bi-chevron-left"></i></button><button class="active">1</button><button disabled><i class="bi bi-chevron-right"></i></button><select><option>10 条/页</option></select><span>跳至</span><input value="1" aria-label="跳转页码"><span>页</span></footer>'; },

  bind: function () {
    var self = this;
    document.querySelectorAll('[data-dc-tab]').forEach(function (button) { button.addEventListener('click', function () { self.state.tab = this.dataset.dcTab; self.state.keyword = ''; self.state.filter = ''; self.state.inline = null; self.state.templateRow = null; self.render(); }); });
    var keyword = document.querySelector('[data-dc-keyword]');
    var query = document.querySelector('[data-dc-query]');
    if (keyword && query) { query.addEventListener('click', function () { self.state.keyword = keyword.value.trim(); self.render(); }); keyword.addEventListener('keydown', function (event) { if (event.key === 'Enter') { self.state.keyword = keyword.value.trim(); self.render(); } }); }
    var filter = document.querySelector('[data-dc-filter]');
    if (filter) { filter.value = this.state.filter; filter.addEventListener('change', function () { self.state.filter = this.value; self.render(); }); }
    document.querySelectorAll('[data-dc-inline-add]').forEach(function (button) { button.addEventListener('click', function () { self.startInline(this.dataset.dcInlineAdd); }); });
    document.querySelectorAll('[data-dc-inline-edit]').forEach(function (button) { button.addEventListener('click', function () { self.startInline(this.dataset.dcInlineEdit, this.dataset.id); }); });
    var inlineSave = document.querySelector('[data-dc-inline-save]'); if (inlineSave) inlineSave.addEventListener('click', function () { self.saveInline(); });
    var inlineCancel = document.querySelector('[data-dc-inline-cancel]'); if (inlineCancel) inlineCancel.addEventListener('click', function () { self.state.inline = null; self.render(); });
    document.querySelectorAll('[data-dc-delete]').forEach(function (button) { button.addEventListener('click', function () { self.deleteRow(this.dataset.dcDelete, this.dataset.id); }); });
    this.bindTemplate();
    document.querySelectorAll('[data-dc-editor-action]').forEach(function (button) { button.addEventListener('click', function () { var editor = this.closest('[data-dc-sql-editor]'); self.editorAction(this.dataset.dcEditorAction, editor ? editor.dataset.dcSqlEditor : '', editor); }); });
    document.querySelectorAll('[data-dc-sql-content]').forEach(function (content) { content.addEventListener('input', function () { var value = String(this.innerText || this.textContent || '').replace(/\u00a0/g, ' ').replace(/\r/g, ''); self.updateEditorValue(this.dataset.dcSqlContent, value); var gutter = this.closest('[data-dc-sql-editor]').querySelector('[data-dc-sql-gutter]'); if (gutter) gutter.innerHTML = self.sqlLineNumbers(value); }); });
    document.querySelectorAll('[data-dc-sql-theme]').forEach(function (select) { select.addEventListener('change', function () { self.state.sqlTheme = this.value === 'light' ? 'light' : 'dark'; var editor = this.closest('[data-dc-sql-editor]'); editor.classList.toggle('theme-light', self.state.sqlTheme === 'light'); editor.classList.toggle('theme-dark', self.state.sqlTheme !== 'light'); }); });
    document.querySelectorAll('[data-dc-sql-font]').forEach(function (select) { select.addEventListener('change', function () { self.state.sqlFont = this.value || '14px'; this.closest('[data-dc-sql-editor]').style.fontSize = self.state.sqlFont; }); });
    document.querySelectorAll('[data-dc-sql-find]').forEach(function (input) { input.addEventListener('keydown', function (event) { if (event.key === 'Enter') { event.preventDefault(); var editor = this.closest('[data-dc-sql-editor]'); self.editorAction(event.shiftKey ? 'find-prev' : 'find-next', editor.dataset.dcSqlEditor, editor); } }); });
    var page = document.querySelector('.page-development-config .dc-page');
    if (page) page.addEventListener('keydown', function (event) { if (event.key !== 'Escape') return; var fullscreenEditor = this.querySelector('.dc-public-sql-editor.fullscreen'); if (fullscreenEditor) { event.preventDefault(); self.setEditorFullscreen(fullscreenEditor, false); } });
    var scriptType = document.querySelector('[data-dc-script-type]'); if (scriptType) scriptType.addEventListener('change', function () { self.updateEditorValue('script', self.readSqlEditor('script')); self.state.scriptType = this.value; self.state.sqlSearchOpen = false; self.render(); });
    var scriptSave = document.querySelector('[data-dc-script-save]'); if (scriptSave) scriptSave.addEventListener('click', function () { self.updateEditorValue('script', self.readSqlEditor('script')); self.toast('脚本模板已保存'); });
    document.querySelectorAll('[data-dc-permission-side]').forEach(function (button) { button.addEventListener('click', function () { self.state.permissionSide = this.dataset.dcPermissionSide; self.render(); }); });
    document.querySelectorAll('[data-dc-permission-node]').forEach(function (button) { button.addEventListener('click', function () { self.state.permissionNode = this.dataset.dcPermissionNode; self.render(); }); });
    var memberSearch = document.querySelector('[data-dc-member-search]'); if (memberSearch) memberSearch.addEventListener('keydown', function (event) { if (event.key === 'Enter') { self.state.permissionKeyword = this.value.trim(); self.render(); } });
    var flowSearch = document.querySelector('[data-dc-flow-search]'); if (flowSearch) flowSearch.addEventListener('keydown', function (event) { if (event.key === 'Enter') { self.state.flowKeyword = this.value.trim(); self.render(); } });
    var flowFilter = document.querySelector('[data-dc-flow-filter]'); if (flowFilter) { flowFilter.value = self.state.flowFilter; flowFilter.addEventListener('change', function () { self.state.flowFilter = this.value; self.render(); }); }
    document.querySelectorAll('[data-dc-flow-id]').forEach(function (input) { input.addEventListener('change', function () { var flow = self.permissionFlows.find(function (item) { return item.id === input.dataset.dcFlowId; }); if (flow) flow.checked = input.checked; self.toast('开发权限已更新'); }); });
    var flowAll = document.querySelector('[data-dc-flow-all]'); if (flowAll) flowAll.addEventListener('change', function () { self.permissionFlows.forEach(function (flow) { flow.checked = flowAll.checked; }); self.render(); self.toast('开发权限已更新'); });
    var publicNew = document.querySelector('[data-dc-public-new]'); if (publicNew) publicNew.addEventListener('click', function () { self.openPublic(); });
    document.querySelectorAll('[data-dc-public-edit]').forEach(function (button) { button.addEventListener('click', function () { self.openPublic(this.dataset.dcPublicEdit); }); });
    document.querySelectorAll('[data-dc-public-close]').forEach(function (button) { button.addEventListener('click', function () { self.state.publicModal = null; self.render(); }); });
    var publicSave = document.querySelector('[data-dc-public-save]'); if (publicSave) publicSave.addEventListener('click', function () { self.savePublic(); });
    var mask = document.querySelector('.dc-modal-mask'); if (mask) mask.addEventListener('click', function (event) { if (event.target === mask) { self.state.publicModal = null; self.render(); } });
  },
  startInline: function (kind, id) {
    var source = kind === 'naming' ? this.namingRules : kind === 'param' ? this.params : this.flags;
    var existing = source.find(function (row) { return row.id === id; });
    var blank = kind === 'naming' ? { name: '', content: '' } : kind === 'param' ? { name: '', desc: '', editable: '', format: 'yyyy-MM-dd HH:mm:ss', dev: '', test: '', prod: '', attr: '平台参数【多项目共用】' } : { name: '', note: '' };
    this.state.inline = { kind: kind, id: id || '', isNew: !existing, row: Object.assign({}, existing || blank) };
    this.render();
  },
  saveInline: function () {
    var edit = this.state.inline;
    var fields = {};
    document.querySelectorAll('[data-dc-inline-field]').forEach(function (input) { fields[input.dataset.dcInlineField] = input.value.trim(); });
    var valid = fields.name && (edit.kind !== 'naming' || fields.content) && (edit.kind !== 'param' || (fields.desc && fields.editable && fields.dev && fields.test && fields.prod)) && (edit.kind !== 'flag' || fields.note);
    if (!valid) { this.toast('请完整填写必填项'); return; }
    var source = edit.kind === 'naming' ? this.namingRules : edit.kind === 'param' ? this.params : this.flags;
    if (edit.isNew) { fields.id = edit.kind.charAt(0) + Date.now(); source.unshift(fields); } else Object.assign(source.find(function (row) { return row.id === edit.id; }), fields);
    this.state.inline = null; this.render(); this.toast('配置已保存');
  },
  deleteRow: function (kind, id) {
    var self = this;
    var labels = { naming: '表命名规则', param: '全局参数', flag: '更新标识', public: '公共代码' };
    DP.confirm('确认删除该' + labels[kind] + '吗？', { icon: 'danger', onOk: function () { if (kind === 'naming') self.namingRules = self.namingRules.filter(function (row) { return row.id !== id; }); if (kind === 'param') self.params = self.params.filter(function (row) { return row.id !== id; }); if (kind === 'flag') self.flags = self.flags.filter(function (row) { return row.id !== id; }); if (kind === 'public') self.publicCodes = self.publicCodes.filter(function (row) { return row.id !== id; }); self.render(); self.toast(labels[kind] + '已删除'); } });
  },
  bindTemplate: function () {
    var self = this;
    var add = document.querySelector('[data-dc-template-add]'); if (add) add.addEventListener('click', function () { var kind = self.state.tab; self.state.newTemplate = { kind: kind, row: { id: 'new-' + kind, name: '', db: 'hive', isDefault: false, fields: [] } }; self.render(); });
    document.querySelectorAll('[data-dc-template-save]').forEach(function (button) { button.addEventListener('click', function () { self.saveTemplate(this); }); });
    document.querySelectorAll('[data-dc-template-delete]').forEach(function (button) { button.addEventListener('click', function () { self.deleteTemplate(this); }); });
    document.querySelectorAll('[data-dc-template-field-add]').forEach(function (button) { button.addEventListener('click', function () { self.startTemplateField(this.dataset.template); }); });
    document.querySelectorAll('[data-dc-template-field-edit]').forEach(function (button) { button.addEventListener('click', function () { self.startTemplateField(this.dataset.template, Number(this.dataset.index)); }); });
    document.querySelectorAll('[data-dc-template-field-delete]').forEach(function (button) { button.addEventListener('click', function () { self.deleteTemplateField(this.dataset.template, Number(this.dataset.index)); }); });
    var fieldSave = document.querySelector('[data-dc-template-field-save]'); if (fieldSave) fieldSave.addEventListener('click', function () { self.saveTemplateField(); });
    var fieldCancel = document.querySelector('[data-dc-template-field-cancel]'); if (fieldCancel) fieldCancel.addEventListener('click', function () { self.state.templateRow = null; self.render(); });
    document.querySelectorAll('[data-dc-default-cancel]').forEach(function (button) { button.addEventListener('click', function () { this.parentNode.querySelector('input').checked = false; }); });
  },
  findTemplate: function (id) {
    if (this.state.newTemplate && this.state.newTemplate.row.id === id) return this.state.newTemplate.row;
    return this.templates[this.state.tab].find(function (item) { return item.id === id; });
  },
  saveTemplate: function (button) {
    var card = button.closest('[data-template-card]');
    var template = this.findTemplate(button.dataset.template);
    var name = card.querySelector('[data-dc-template-name]').value.trim();
    if (!name) { this.toast('请输入模板名称'); return; }
    template.name = name;
    template.db = card.querySelector('[data-dc-template-db]').value;
    template.isDefault = card.querySelector('input[type="radio"]').checked;
    if (template.isDefault) this.templates[this.state.tab].forEach(function (item) { item.isDefault = false; });
    if (button.dataset.new === 'true') { template.id = this.state.tab.charAt(0) + 't' + Date.now(); this.templates[this.state.tab].unshift(template); this.state.newTemplate = null; }
    this.render(); this.toast('模板已保存');
  },
  deleteTemplate: function (button) {
    var self = this;
    if (button.dataset.new === 'true') { this.state.newTemplate = null; this.render(); return; }
    DP.confirm('确认删除该模板吗？', { icon: 'danger', onOk: function () { self.templates[self.state.tab] = self.templates[self.state.tab].filter(function (item) { return item.id !== button.dataset.template; }); self.render(); self.toast('模板已删除'); } });
  },
  startTemplateField: function (templateId, index) {
    var template = this.findTemplate(templateId);
    var blank = this.state.tab === 'partition' ? { name: '', alias: '', type: 'BIGINT', param: 'var(字符串参数)' } : { content: '', name: '', alias: '', type: 'STRING' };
    var existing = typeof index === 'number' && !isNaN(index) ? template.fields[index] : null;
    this.state.templateRow = { templateId: templateId, index: existing ? index : -1, isNew: !existing, row: Object.assign({}, existing || blank) };
    this.render();
  },
  saveTemplateField: function () {
    var edit = this.state.templateRow;
    var fields = {};
    document.querySelectorAll('[data-dc-tfield]').forEach(function (input) { fields[input.dataset.dcTfield] = input.value.trim(); });
    if (!fields.name || !fields.alias || (this.state.tab === 'field' && !fields.content)) { this.toast('请完整填写字段信息'); return; }
    var template = this.findTemplate(edit.templateId);
    if (edit.isNew) template.fields.unshift(fields); else Object.assign(template.fields[edit.index], fields);
    this.state.templateRow = null; this.render(); this.toast('字段配置已保存');
  },
  deleteTemplateField: function (templateId, index) {
    var self = this;
    DP.confirm('确认删除该字段配置吗？', { icon: 'danger', onOk: function () { self.findTemplate(templateId).fields.splice(index, 1); self.render(); self.toast('字段配置已删除'); } });
  },
  openPublic: function (id) {
    var row = this.publicCodes.find(function (item) { return item.id === id; });
    this.state.publicModal = { isNew: !row, row: Object.assign({}, row || { id: '', name: '', type: 'SQL', note: '', code: '' }) };
    this.render();
  },
  savePublic: function () {
    var modal = this.state.publicModal;
    var fields = {};
    document.querySelectorAll('[data-dc-public-field]').forEach(function (input) { fields[input.dataset.dcPublicField] = input.value.trim(); });
    fields.code = this.readSqlEditor('public');
    if (!fields.name || !fields.type) { document.getElementById('dcPublicError').textContent = '请填写名称和类型'; return; }
    if (modal.isNew) { fields.id = 'c' + Date.now(); this.publicCodes.unshift(fields); } else Object.assign(this.publicCodes.find(function (row) { return row.id === modal.row.id; }), fields);
    this.state.publicModal = null; this.render(); this.toast('公共代码已保存');
  },
  editorAction: function (action, scope, editor) {
    if (!editor || !scope) return;
    var code = this.readSqlEditor(scope);
    if (action === 'copy') { if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(code).catch(function () {}); this.toast('代码已复制'); return; }
    if (action === 'format') {
      var formatted = code.replace(/[ \t]+$/gm, '').replace(/\s+FROM\s+/gi, '\nFROM ').replace(/\s+WHERE\s+/gi, '\nWHERE ').replace(/\s+(GROUP\s+BY|ORDER\s+BY|HAVING|LIMIT)\s+/gi, '\n$1 ').replace(/,\s*/g, ',\n  ');
      this.updateEditorValue(scope, formatted);
      var content = editor.querySelector('[data-dc-sql-content]');
      var gutter = editor.querySelector('[data-dc-sql-gutter]');
      if (content) content.innerHTML = this.highlightSql(formatted);
      if (gutter) gutter.innerHTML = this.sqlLineNumbers(formatted);
      this.toast('代码格式化完成'); return;
    }
    if (action === 'search') { this.state.sqlSearchOpen = true; editor.classList.add('search-open'); var search = editor.querySelector('[data-dc-sql-find]'); if (search) search.focus(); return; }
    if (action === 'close-search') { this.state.sqlSearchOpen = false; editor.classList.remove('search-open'); return; }
    if (action === 'find-next' || action === 'find-prev') { var input = editor.querySelector('[data-dc-sql-find]'); var keyword = input ? input.value : ''; if (!keyword) { this.toast('请输入查找内容'); return; } var caseInput = editor.querySelector('[data-dc-sql-case]'); var found = window.find ? window.find(keyword, !!(caseInput && caseInput.checked), action === 'find-prev', true, false, false, false) : false; if (!found) this.toast('未找到匹配内容'); return; }
    if (action === 'full') this.setEditorFullscreen(editor, !editor.classList.contains('fullscreen'));
  },
  setEditorFullscreen: function (editor, active) {
    if (!editor) return;
    editor.classList.toggle('fullscreen', active);
    var button = editor.querySelector('[data-dc-editor-action="full"]');
    if (!button) return;
    button.setAttribute('aria-pressed', active ? 'true' : 'false');
    button.setAttribute('title', active ? '退出全屏（Esc）' : '进入全屏');
    var icon = button.querySelector('i');
    var label = button.querySelector('span');
    if (icon) icon.className = active ? 'bi bi-fullscreen-exit' : 'bi bi-arrows-fullscreen';
    if (label) label.textContent = active ? '退出全屏' : '全屏';
  },
  toast: function (text) {
    var toast = document.getElementById('dcToast');
    if (!toast) return;
    toast.textContent = text; toast.classList.add('show'); clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 1600);
  }
};
