/** 独立版本示例。固定标识只补充缺失记录，已有编辑和删除状态由版本仓库保留。 */
window.DP = window.DP || {};
DP.qualityVersionExamples = (function () {
  'use strict';
  var clone = DP.qualityVersions.clone;
  var ruleIds = ['qr-version-demo-completeness', 'qr-version-demo-uniqueness', 'qr-version-demo-length'];

  function history(id, configs, amended, descriptions, isTask, restoreLast) {
    var dates = isTask
      ? ['2026-08-02 10:00:00', '2026-08-03 13:00:00', '2026-08-04 10:00:00', '2026-08-05 10:00:00', '2026-08-07 10:00:00', '2026-08-12 10:00:00', '2026-08-14 10:00:00']
      : ['2026-08-01 09:00:00', '2026-08-03 09:00:00', '2026-08-04 15:00:00', '2026-08-06 09:00:00', '2026-08-08 09:00:00', '2026-08-11 09:00:00', '2026-08-13 09:00:00'];
    var item = { id: id, creator: '数据治理部', createdAt: dates[0], versionSchema: 2, versionExample: true, revision: 0, currentVersion: '', config: null, versions: [], events: [] };
    function save(type, version, config, summary) {
      var time = dates[item.events.length];
      var operator = ['数据治理部', '王敏', '李工', '王敏', '质量管理员', '王敏', '质量管理员'][item.events.length];
      var record = item.versions.find(function (v) { return v.version === version; });
      if (!record) {
        record = { version: version, createdAt: time, createdBy: operator };
        item.versions.push(record);
      }
      if (type !== 'rollback') {
        record.saveId = id + ':sample:' + item.events.length;
        record.time = time;
        record.operator = operator;
        record.summary = summary;
        record.snapshot = clone(config);
      }
      item.events.push({ type: type, from: item.currentVersion, to: version, saveId: record.saveId, reason: summary, time: time, operator: operator, before: item.config ? clone(item.config) : null, snapshot: clone(record.snapshot) });
      item.currentVersion = version;
      item.config = clone(record.snapshot);
      item.modifiedAt = time;
      item.revision = item.events.length - 1;
    }
    save('create', 'V1.0', configs[0], descriptions[0]);
    save('new', 'V1.1', configs[1], descriptions[1]);
    save('update', 'V1.1', amended, descriptions[2]);
    save('new', 'V1.2', configs[2], descriptions[3]);
    save('rollback', 'V1.1', null, descriptions[4]);
    save('new', 'V1.3', configs[3], descriptions[5]);
    if (restoreLast) save('rollback', 'V1.2', null, descriptions[6]);
    return item;
  }

  function ruleConfig(name, standard, sql, desc, fixed) {
    return { name: name, standard: standard, dbType: 'Mysql8', ruleType: fixed ? '标准稽查（固定检查）' : '质量稽查（自定义稽查）', group: 'system-basic', groupPath: '系统规则 / 基础字段校验', catalog: 'quality_catalog', schema: 'biz', sql: sql, desc: desc,
      params: [{ name: '${schema}', attr: 'Schema', desc: '业务数据库名称' }, { name: '${tableName}', attr: '表', desc: '待检查的数据表' }, { name: '${fieldName}', attr: '字段', desc: '待检查的业务字段' }] };
  }
  function rules() {
    var source = '${schema}.${tableName}';
    var field = '${fieldName}';
    var emptyConditions = [field + ' IS NULL', field + " IS NULL OR " + field + " = ''", field + " IS NULL OR LOWER(TRIM(" + field + ")) IN ('', 'null')", field + " IS NULL OR LOWER(TRIM(" + field + ")) IN ('', 'null', 'n/a')"];
    var emptyDescriptions = ['检查数据库空值', '增加空字符串检查', '识别字符串 null 占位值', '增加 n/a 占位值识别'];
    var empty = emptyConditions.map(function (condition, i) { return ruleConfig('关键字段非空校验（版本示例）', '完整性', 'SELECT *\nFROM ' + source + '\nWHERE ' + condition + ';', emptyDescriptions[i]); });
    var emptyAmended = ruleConfig(empty[0].name, '完整性', 'SELECT *\nFROM ' + source + '\nWHERE ' + field + " IS NULL OR TRIM(" + field + ") = '';", '空值、空字符串及纯空格均视为缺失');

    function duplicate(expression, filter, desc) {
      return ruleConfig('业务编码唯一性校验（版本示例）', '唯一性', 'SELECT ' + expression + ' AS business_code, COUNT(*) AS repeat_count\nFROM ' + source + (filter ? '\nWHERE ' + filter : '') + '\nGROUP BY ' + expression + '\nHAVING COUNT(*) > 1;', desc);
    }
    var validCode = field + " IS NOT NULL AND TRIM(" + field + ") <> ''";
    var duplicates = [duplicate(field, '', '按原始业务编码查重'), duplicate('TRIM(' + field + ')', '', '去除首尾空格后查重'), duplicate('UPPER(TRIM(' + field + '))', validCode, '统一大小写，排除空编码后查重'), duplicate('UPPER(REPLACE(TRIM(' + field + "), ' ', ''))", validCode, '统一大小写并去除编码中的空格后查重')];
    var duplicateAmended = duplicate('TRIM(' + field + ')', validCode, '保留大小写口径，排除空编码后查重');

    function lengthRule(limit, trim) {
      return ruleConfig('业务编码长度校验（版本示例）', '有效性', 'SELECT *\nFROM ' + source + '\nWHERE CHAR_LENGTH(' + (trim ? 'TRIM(' + field + ')' : field) + ') > ' + limit + ';', (trim ? '去除首尾空格后，' : '') + '业务编码长度不得超过 ' + limit + ' 个字符', true);
    }
    var lengths = [lengthRule(8, false), lengthRule(10, false), lengthRule(12, true), lengthRule(16, true)];
    return [
      history(ruleIds[0], empty, emptyAmended, ['建立关键字段非空检查', '新增空字符串检查口径', '修正纯空格识别，保存当前版本', '新增 null 占位值检查', '占位值定义待确认，恢复 V1.1', '确认 null、n/a 口径，生成新版本'], false, false),
      history(ruleIds[1], duplicates, duplicateAmended, ['建立业务编码重复检查', '增加首尾空格清理', '排除空编码，保存当前版本', '增加大小写归一检查', '大小写口径待评估，恢复 V1.1', '增加编码内部空格清理', '内部空格允许保留，恢复 V1.2'], false, true),
      history(ruleIds[2], lengths, lengthRule(10, true), ['编码长度上限设为 8', '编码长度上限调整为 10', '计数前去除首尾空格，保存当前版本', '编码长度上限调整为 12', '标准修订暂缓，恢复 V1.1', '采用已确认的 16 字符标准'], false, false)
    ];
  }

  function referenceAt(rule, eventIndex) {
    var event = rule.events[eventIndex];
    return { id: rule.id, version: event.to, saveId: event.saveId, savedAt: event.time, snapshot: clone(event.snapshot) };
  }
  function boundRule(ref, table, field) {
    var params = ref.snapshot.params.map(function (p) { return Object.assign({}, p, { table: table, field: field, value: p.attr === 'Schema' ? ref.snapshot.schema : '' }); });
    var generated = ref.snapshot.sql.replace(/\$\{[^}]+\}/g, function (token) {
      var p = params.find(function (param) { return param.name === token; });
      return p.attr === '字段' ? p.field : (p.attr === '表' ? p.table : p.value);
    });
    return { configured: true, ruleMode: 'existing', params: params, sqlTemplate: ref.snapshot.sql, sqlGenerated: generated, sqlCustom: '' };
  }
  function taskConfig(kind, ref, stage) {
    var names = { custom: '订单号唯一性稽查（版本示例）', basic: '客户关键字段稽查（版本示例）', standard: '网格编码标准稽查（版本示例）' };
    var form = { taskName: names[kind], businessLayerKey: 'demo-dwd', businessLayer: 'DWD 明细层', weight: String([20, 30, 40, 50][stage]), dataSource: '业务系统/prod_mysql_master', schedule: { type: stage === 3 ? 'hourly' : 'daily', minute: '10', time: ['00:10:00', '01:10:00', '02:10:00', '03:10:00'][stage], week: '周一', day: '1号', datetime: '2026-08-12 16:10:00' } };
    if (kind === 'custom') {
      var bound = boundRule(ref, 'dwd_order_detail_di', 'OrderNo');
      form.dataSourceKey = 'ds-business';
      form.dataSource = '业务系统数据源';
      form.ruleMode = 'existing';
      form.ruleId = ref.id;
      form.ruleName = ref.snapshot.name;
      form.ruleRef = clone(ref);
      form.customStandard = '唯一性';
      form.customDescription = '';
      form.params = bound.params;
      form.sqlTemplate = bound.sqlTemplate;
      form.sqlGenerated = bound.sqlGenerated;
      form.sqlCustom = '';
    } else if (kind === 'basic') {
      form.inspectObject = '字段';
      form.inspectMode = stage >= 2 ? '增量稽查' : '全量稽查';
      form.paramMode = '普通设置';
      form.timeParams = { startField: 'CreateTime', endField: 'CreateTime', startDataType: 'datetime', endDataType: 'datetime', startFormat: 'YYYY-MM-DD', endFormat: 'YYYY-MM-DD', startOffset: '1', endOffset: '0', startUnit: '天', endUnit: '天', startFixedTime: '00:00:00', endFixedTime: '00:00:00' };
      form.customSql = 'SELECT * FROM biz.crm_member_base\nWHERE CreateTime >= ${start_time} AND CreateTime < ${end_time};';
      form.entities = ['Id', 'Name', 'Status'].slice(0, stage === 0 ? 1 : (stage === 3 ? 3 : 2)).map(function (field) {
        return { name: 'biz.crm_member_base.' + field, alias: { Id: '客户编号', Name: '客户姓名', Status: '客户状态' }[field], ruleId: ref.id, ruleRef: clone(ref), paramConfig: boundRule(ref, 'crm_member_base', field) };
      });
    } else {
      form.standardDataKey = 'code_id';
      form.standardData = '网格id';
      form.datasource = 'crm_member_base';
      form.qualityRule = ref.snapshot.name;
      form.ruleRef = clone(ref);
      form.inspectMode = stage >= 2 ? '增量稽查' : '全量稽查';
      form.entities = [{ name: 'biz.crm_member_base.CodeId', alias: 'CodeId', desc: '客户所属网格编码' }];
      if (stage >= 2) form.entities.push({ name: 'biz.crm_member_base.ServiceGridId', alias: 'ServiceGridId', desc: '客户服务网格编码' });
    }
    return { kind: kind, type: kind === 'basic' ? '基础稽查' : (kind === 'standard' ? '标准稽查' : '自定义稽查'), form: form };
  }
  function tasks() {
    // 使用固定示例中的原始保存记录生成引用，避免用户后续修改规则时改写历史演示数据。
    var ruleExamples = rules();
    return ['custom', 'basic', 'standard'].map(function (kind) {
      var rule = ruleExamples[kind === 'custom' ? 1 : (kind === 'basic' ? 0 : 2)];
      var configs = [0, 1, 2, 5].map(function (eventIndex, stage) { return taskConfig(kind, referenceAt(rule, eventIndex), stage); });
      var amended = clone(configs[1]);
      amended.form.weight = '35';
      var extra = kind === 'basic'
        ? ['增加客户姓名字段，权重调整为 30', '采用修订后的规则，切换为增量稽查', '增加客户状态字段，每小时执行']
        : kind === 'standard' ? ['采用 10 字符规则，调整执行时间', '采用去空格口径，增加服务网格编码', '采用 16 字符规则，每小时执行']
        : ['采用去空格查重口径，调整执行时间', '采用排除空编码口径，调整考核权重', '采用编码归一查重口径，每小时执行'];
      var item = history('dqit-version-demo-' + kind, configs, amended, ['建立任务并绑定规则 V1.0', extra[0], '考核权重调整为 35，保存当前版本', extra[1], '稽查口径待评估，恢复 V1.1 及原规则引用', extra[2], '恢复双字段稽查范围，回滚至 V1.2'], true, kind === 'basic');
      item.status = '已停止';
      item.lastRunAt = '2026-08-12 16:10:00';
      var executed = item.versions.find(function (record) { return record.version === 'V1.3'; });
      item.executionSnapshot = { name: configs[3].form.taskName, target: kind === 'custom' ? 'dwd_order_detail_di' : 'crm_member_base', frequency: '每小时 10 分', taskVersion: 'V1.3', saveId: executed.saveId, savedAt: executed.time, startedAt: item.lastRunAt, runCount: 6, config: clone(executed.snapshot) };
      return item;
    });
  }
  return { rules: rules, tasks: tasks };
})();
