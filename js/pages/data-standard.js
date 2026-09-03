/**
 * 数据中台 V4.0 - 数据资产 / 数据标准管理 / 数据标准
 * 静态高保真原型：标准列表 + 新建编辑查看 + 导入导出 + 日志查看
 */
window.DP = window.DP || {};
DP.pages = DP.pages || {};

DP.pages.dataStandard = (function () {
  var pageEl = null;

  var standardTree = [
    {
      key: 'biz',
      label: '业务部',
      count: 25,
      icon: 'bi-folder-fill',
      children: [
        {
          key: 'trade',
          label: '交易域',
          count: 9,
          icon: 'bi-folder2-open',
          children: [
            { key: 'trade_order', label: '订单履约', count: 5, icon: 'bi-bookmark-fill' },
            { key: 'trade_settle', label: '支付结算', count: 4, icon: 'bi-bookmark-fill' }
          ]
        },
        {
          key: 'customer',
          label: '客户域',
          count: 6,
          icon: 'bi-folder2-open',
          children: [
            { key: 'customer_profile', label: '客户画像', count: 3, icon: 'bi-bookmark-fill' },
            { key: 'customer_service', label: '服务工单', count: 3, icon: 'bi-bookmark-fill' }
          ]
        },
        {
          key: 'public_domain',
          label: '公共域',
          count: 5,
          icon: 'bi-folder2-open',
          children: [
            { key: 'public_master', label: '主数据标识', count: 2, icon: 'bi-bookmark-fill' },
            { key: 'public_common', label: '通用属性', count: 3, icon: 'bi-bookmark-fill' }
          ]
        },
        {
          key: 'risk',
          label: '风控域',
          count: 5,
          icon: 'bi-folder2-open',
          children: [
            { key: 'risk_asset', label: '资源识别', count: 2, icon: 'bi-bookmark-fill' },
            { key: 'risk_security', label: '安全合规', count: 3, icon: 'bi-bookmark-fill' }
          ]
        }
      ]
    },
    {
      key: 'warehouse',
      label: '数仓组',
      count: 2,
      icon: 'bi-folder-fill',
      children: [
        { key: 'warehouse_ods', label: 'ODS贴源层', count: 5, icon: 'bi-database-fill' },
        { key: 'warehouse_dwd', label: 'DWD明细层', count: 7, icon: 'bi-database-fill' },
        { key: 'warehouse_dws', label: 'DWS汇总层', count: 6, icon: 'bi-database-fill' },
        { key: 'warehouse_ads', label: 'ADS应用层', count: 8, icon: 'bi-database-fill' },
        { key: 'warehouse_dim', label: 'DIM维表层', count: 4, icon: 'bi-database-fill' }
      ]
    }
  ];

  function row(code, englishName, alias, objectType, metaModel, meaning, publishStatus, auditStatus, groupKey, extra) {
    extra = extra || {};
    return {
      id: '',
      code: code,
      englishName: englishName,
      alias: alias,
      objectType: objectType,
      metaModel: metaModel,
      meaning: meaning,
      publishStatus: publishStatus,
      auditStatus: auditStatus,
      groupKey: groupKey,
      dataType: extra.dataType || '',
      length: extra.length || '',
      precision: extra.precision || '',
      desensitizeRule: extra.desensitizeRule || '请选择',
      qualityRule: extra.qualityRule || '请选择',
      encryptRule: extra.encryptRule || '请选择',
      dataClass: extra.dataClass || (groupKey === 'warehouse' ? '数仓组' : '业务部'),
      dataLevel: extra.dataLevel || '请选择',
      description: extra.description || meaning
    };
  }

  var standardRows = [
    row('order_00000004', 'REVENUE', '当日收入', '字段', '字段模型', '当日收入', '已废止', '废止审批通过', 'trade_settle', { dataType: 'decimal', length: '18', precision: '2', qualityRule: '金额非负校验(金额字段必须大于等于0)', dataLevel: '对内公开(L2)' }),
    row('order_00000006', 'IR_PVMN', 'ir_pvmn', '字段', '字段模型', 'ir_pvmn', '已发布', '发布通过', 'risk_asset', { dataType: 'varchar', length: '64', dataLevel: '对内公开(L2)' }),
    row('order_00000008', 'master_id', '主数据编码', '字段', '字段模型', '主数据编码', '已发布', '发布通过', 'public_master', { dataType: 'varchar', length: '32', qualityRule: '唯一性校验(主数据编码不可重复)' }),
    row('order_00000009', 'cw_number', '标价', '字段', '字段模型', '标价', '已发布', '发布通过', 'trade_settle', { dataType: 'decimal', length: '18', precision: '2', qualityRule: '金额非负校验(金额字段必须大于等于0)' }),
    row('order_00000010', 'UPDATE_TIME', '更新时间', '字段', '字段模型', '更新时间', '已发布', '发布通过', 'public_common', { dataType: 'timestamp', length: '19', qualityRule: '及时性校验(更新时间不得晚于当前时间)' }),
    row('order_00000011', 'IP', '活跃资源IP信息', '字段', '字段模型', '活跃资源IP信息', '已发布', '发布通过', 'risk_security', { dataType: 'varchar', length: '32', desensitizeRule: 'IP地址(IP地址正则脱敏)', dataLevel: '机密数据(L3)' }),
    row('order_00000012', 'CRETAE_TIME', '创建时间', '字段', '字段模型', '创建时间', '已发布', '发布通过', 'public_common', { dataType: 'timestamp', length: '19' }),
    row('order_00000007', 'ID', '主键ID', '字段', '字段模型', '主键ID', '已发布', '发布通过', 'public_master', { dataType: 'bigint', length: '20', qualityRule: '唯一性校验(主键ID不可重复)' }),
    row('order_00000014', 'DESCRIPTION', '备注说明', '字段', '字段模型', '备注说明', '已发布', '发布通过', 'public_common', { dataType: 'varchar', length: '500' }),
    row('order_00000015', 'create_date', '创建日期时间', '字段', '字段模型', '创建日期时间', '已发布', '发布通过', 'public_common', { dataType: 'date', length: '10' }),
    row('db_00000001', 'zz_tms_ads', '运输主题应用库', '库', '库模型', '承载运输履约、城市配送、运力效率等应用层指标', '编制', '待提交', 'warehouse_ads'),
    row('table_00000001', 'ads_driver_stats', '司机绩效统计表', '表', '表模型', '按天统计司机接单、履约、超时和里程表现', '编制', '待提交', 'warehouse_ads'),
    row('order_00000016', 'pay_amount', '支付金额', '字段', '字段模型', '订单实际支付金额', '编制', '待提交', 'trade_settle', { dataType: 'decimal', length: '18', precision: '2', qualityRule: '金额非负校验(金额字段必须大于等于0)' }),
    row('order_00000017', 'order_status', '订单状态', '字段', '字段模型', '订单全生命周期状态', '已发布', '发布通过', 'trade_order', { dataType: 'varchar', length: '20', qualityRule: '取值范围约束(订单状态必须在标准代码内)' }),
    row('order_00000018', 'customer_id', '客户ID', '字段', '字段模型', '客户主数据唯一标识', '已发布', '发布通过', 'customer_profile', { dataType: 'varchar', length: '32', dataLevel: '机密数据(L3)' }),
    row('order_00000001', 'REFUND_AMOUNT', '退款金额', '字段', '字段模型', '订单发生退款时实际退回的金额', '编制', '待提交', 'trade_settle', { dataType: 'decimal', length: '18', precision: '2', qualityRule: '金额非负校验(金额字段必须大于等于0)', dataLevel: '对内公开(L2)' }),
    row('order_00000002', 'RECEIVER_PHONE', '收货人手机号', '字段', '字段模型', '订单收货联系人使用的手机号码', '编制', '待提交', 'trade_order', { dataType: 'varchar', length: '32', desensitizeRule: '手机号(手机号正则脱敏)', dataLevel: '机密数据(L3)' }),
    row('order_00000003', 'CUSTOMER_LEVEL', '客户等级', '字段', '字段模型', '客户当前所属的运营等级', '编制', '待提交', 'customer_profile', { dataType: 'varchar', length: '20', qualityRule: '取值范围约束(字段值必须在标准范围内)', dataLevel: '对内公开(L2)' }),
    row('table_00000002', 'customer_grade_rule', '客户等级规则表', '表', '表模型', '维护客户等级代码、名称及适用条件', '编制', '待提交', 'customer_profile', { dataClass: '业务部' })
  ];

  standardRows.forEach(function (item, index) {
    item.id = index + 1;
  });

  var versionFieldKeys = ['code', 'englishName', 'alias', 'meaning', 'dataType', 'length', 'precision', 'desensitizeRule', 'qualityRule', 'encryptRule', 'dataClass', 'dataLevel'];

  function snapshotStandardFields(item) {
    var snapshot = {
      code: item.code,
      englishName: item.englishName,
      alias: item.alias,
      objectType: item.objectType,
      metaModel: item.metaModel,
      meaning: item.meaning,
      groupKey: item.groupKey,
      dataType: item.dataType || '',
      length: item.length || '',
      precision: item.precision || '',
      desensitizeRule: item.desensitizeRule || '请选择',
      qualityRule: item.qualityRule || '请选择',
      encryptRule: item.encryptRule || '请选择',
      dataClass: item.dataClass || '',
      dataLevel: item.dataLevel || '请选择'
    };
    return snapshot;
  }

  function applyStandardSnapshot(item, snapshot) {
    versionFieldKeys.forEach(function (key) {
      if (snapshot[key] != null) item[key] = snapshot[key];
    });
    item.description = item.meaning;
  }

  function getNextVersion(version) {
    if (!version || version === '--') return 'V1.0';
    var matched = /^V(\d+)\.(\d+)$/.exec(version);
    if (!matched) return 'V1.0';
    return 'V' + matched[1] + '.' + (Number(matched[2]) + 1);
  }

  function initializeVersionHistory(item, index) {
    item.versionDraft = null;
    item.lifecycleEvents = [];
    if (item.publishStatus === '编制') {
      item.currentVersion = '--';
      item.versions = [];
      return;
    }
    var count = 2 + (index % 2);
    var currentSnapshot = snapshotStandardFields(item);
    item.versions = [];
    for (var step = 0; step < count; step++) {
      var versionNo = 'V1.' + step;
      var snapshot = Object.assign({}, currentSnapshot);
      if (step < count - 1) {
        snapshot.meaning = item.meaning + (step === 0 ? '（初始口径）' : '（已补充适用范围）');
      }
      item.versions.push({
        versionNo: versionNo,
        status: step === count - 1 ? (item.publishStatus === '已废止' ? '已废止' : '当前版本') : '历史版本',
        source: step === 0 ? '初始发布' : '标准变更',
        baseVersion: step === 0 ? '--' : 'V1.' + (step - 1),
        summary: step === 0 ? '数据标准首次发布。' : '完善标准业务定义及适用范围。',
        operator: step === 0 ? '张晨' : (step % 2 ? '李明' : '王芳'),
        changeTime: '2026-' + String(Math.min(8, 2 + step + (index % 3))).padStart(2, '0') + '-' + String(8 + (index % 12)).padStart(2, '0') + ' 10:20:16',
        publisher: step === 0 ? '陈静' : '刘志远',
        publishTime: '2026-' + String(Math.min(8, 2 + step + (index % 3))).padStart(2, '0') + '-' + String(8 + (index % 12)).padStart(2, '0') + ' 16:35:42',
        approvalOrderId: '',
        snapshot: snapshot
      });
    }
    item.currentVersion = item.versions[item.versions.length - 1].versionNo;
    if (item.publishStatus === '已废止') {
      item.lifecycleEvents.push({ action: '标准废止', operator: '周建国', time: '2026-08-31 14:17:06', result: '已通过' });
    }
  }

  standardRows.forEach(initializeVersionHistory);

  var ioRows = [
    { id: 1, fileName: '字段模型-20260617151930.xls', attr: '导出', status: '处理失败', success: 10, fail: 0, total: 10, operator: '演示-测试', time: '2026-06-17 15:19:34' },
    { id: 2, fileName: '数据标准导入模板.xls', attr: '导入', status: '处理中', success: 0, fail: 0, total: 0, operator: '演示-测试', time: '2026-04-09 17:58:17' }
  ];

  var approvalConfig = {
    enabled: true,
    flows: {
      publish: '数据标准发布审批流程',
      abolish: '数据标准废止审批流程'
    }
  };

  function getApprovalTypeMeta(type) {
    if (type === 'abolish') {
      return {
        key: 'abolish',
        label: '废止审批',
        actionLabel: '废止',
        flowName: approvalConfig.flows.abolish,
        fileNamePrefix: '数据标准废止文件-',
        pendingStatus: '待废止',
        successStatus: '已废止',
        rejectedStatus: '继续有效'
      };
    }
    return {
      key: 'publish',
      label: '发布审批',
      actionLabel: '发布',
      flowName: approvalConfig.flows.publish,
      fileNamePrefix: '数据标准发布文件-',
      pendingStatus: '待发布',
      successStatus: '已发布',
      rejectedStatus: '未发布'
    };
  }

  function snapshotStandard(item) {
    var snapshot = snapshotStandardFields(item);
    snapshot.id = item.id;
    snapshot.currentVersion = item.currentVersion || (item.publishStatus === '编制' ? '--' : 'V1.0');
    snapshot.targetVersion = item.versionDraft ? item.versionDraft.versionNo : (item.publishStatus === '编制' ? 'V1.0' : snapshot.currentVersion);
    snapshot.versionSource = item.versionDraft ? item.versionDraft.source : (item.publishStatus === '编制' ? '初始发布' : '当前版本');
    return snapshot;
  }

  var approvalOrders = [
    {
      id: 'BPM-DS-20260902-001',
      approvalType: 'publish',
      fileNo: 'DSF-20260902-001',
      fileName: '数据标准发布文件-20260902-001.xlsx',
      flowName: approvalConfig.flows.publish,
      applicant: '张晨',
      applyTime: '2026-09-02 09:18:36',
      currentNode: '数据治理负责人',
      auditStatus: '审批中',
      auditResult: '待定',
      businessStatus: '待发布',
      effectiveTime: '--',
      reason: '发布交易域支付结算标准，统一订单支付金额定义。',
      standards: [snapshotStandard(standardRows[12])],
      groupKeys: ['trade_settle'],
      timeline: [
        { name: '开始', status: 'done', actor: '张晨', time: '2026-09-02 09:18:36', result: '已提交' },
        { name: '数据标准管理员', status: 'done', actor: '陈静', time: '2026-09-02 10:03:21', result: '通过' },
        { name: '数据治理负责人', status: 'current', actor: '刘志远', time: '--', result: '办理中' },
        { name: '结束', status: 'pending', actor: '系统', time: '--', result: '待处理' }
      ],
      records: [
        { node: '开始', reviewer: '张晨', result: '提交', opinion: '发布交易域支付结算标准，统一订单支付金额定义。', time: '2026-09-02 09:18:36' },
        { node: '数据标准管理员', reviewer: '陈静', result: '通过', opinion: '标准定义完整，技术与业务属性符合管理规范。', time: '2026-09-02 10:03:21' }
      ]
    },
    {
      id: 'BPM-DS-20260901-002',
      approvalType: 'publish',
      fileNo: 'DSF-20260901-002',
      fileName: '数据标准发布文件-20260901-002.xlsx',
      flowName: approvalConfig.flows.publish,
      applicant: '李明',
      applyTime: '2026-09-01 14:20:16',
      currentNode: '结束',
      auditStatus: '已结束',
      auditResult: '通过',
      businessStatus: '已发布',
      effectiveTime: '2026-09-01 16:42:08',
      reason: '发布公共域主数据标识及通用属性标准。',
      standards: [snapshotStandard(standardRows[2]), snapshotStandard(standardRows[7])],
      groupKeys: ['public_master'],
      timeline: [
        { name: '开始', status: 'done', actor: '李明', time: '2026-09-01 14:20:16', result: '已提交' },
        { name: '数据标准管理员', status: 'done', actor: '王璐', time: '2026-09-01 15:08:44', result: '通过' },
        { name: '数据治理负责人', status: 'done', actor: '赵海峰', time: '2026-09-01 16:40:35', result: '通过' },
        { name: '结束', status: 'done', actor: '系统', time: '2026-09-01 16:42:08', result: '已结束' }
      ],
      records: [
        { node: '开始', reviewer: '李明', result: '提交', opinion: '发布公共域主数据标识及通用属性标准。', time: '2026-09-01 14:20:16' },
        { node: '数据标准管理员', reviewer: '王璐', result: '通过', opinion: '标准内容完整，建议提交下一审批节点。', time: '2026-09-01 15:08:44' },
        { node: '数据治理负责人', reviewer: '赵海峰', result: '通过', opinion: '同意发布。', time: '2026-09-01 16:40:35' },
        { node: '结束', reviewer: '系统', result: '已结束', opinion: 'BPM流程结束，系统已自动完成标准发布。', time: '2026-09-01 16:42:08' }
      ]
    },
    {
      id: 'BPM-DS-20260831-003',
      approvalType: 'abolish',
      fileNo: 'DSF-20260831-003',
      fileName: '数据标准废止文件-20260831-003.xlsx',
      flowName: approvalConfig.flows.abolish,
      applicant: '王芳',
      applyTime: '2026-08-31 10:05:42',
      currentNode: '数据治理负责人',
      auditStatus: '已结束',
      auditResult: '驳回',
      businessStatus: '继续有效',
      effectiveTime: '--',
      reason: '订单状态标准已不符合现行业务规则，申请废止。',
      standards: [snapshotStandard(standardRows[13])],
      groupKeys: ['trade_order'],
      timeline: [
        { name: '开始', status: 'done', actor: '王芳', time: '2026-08-31 10:05:42', result: '已提交' },
        { name: '数据标准管理员', status: 'done', actor: '郑敏', time: '2026-08-31 11:26:50', result: '通过' },
        { name: '数据治理负责人', status: 'rejected', actor: '周建国', time: '2026-08-31 14:17:06', result: '驳回' },
        { name: '结束', status: 'terminated', actor: '系统', time: '2026-08-31 14:17:06', result: '已终止' }
      ],
      records: [
        { node: '开始', reviewer: '王芳', result: '提交', opinion: '订单状态标准已不符合现行业务规则，申请废止。', time: '2026-08-31 10:05:42' },
        { node: '数据标准管理员', reviewer: '郑敏', result: '通过', opinion: '标准信息完整。', time: '2026-08-31 11:26:50' },
        { node: '数据治理负责人', reviewer: '周建国', result: '驳回', opinion: '废止影响范围说明不完整，请补充后重新提交。', time: '2026-08-31 14:17:06' },
        { node: '结束', reviewer: '系统', result: '已终止', opinion: '审批被驳回，BPM流程终止，标准继续有效。', time: '2026-08-31 14:17:06' }
      ]
    }
  ];

  function buildApprovalSample(seed) {
    var meta = getApprovalTypeMeta(seed.type || 'publish');
    var compact = seed.date.replace(/-/g, '');
    var serial = String(seed.serial).padStart(3, '0');
    var isPassed = seed.state === 'pass';
    var isRejected = seed.state === 'reject';
    var isReviewing = seed.state === 'review';
    var auditStatus = isPassed || isRejected ? '已结束' : (isReviewing ? '审核中' : '审批中');
    var auditResult = isPassed ? '通过' : (isRejected ? '驳回' : '待定');
    var standards = seed.rowIndexes.map(function (index) { return snapshotStandard(standardRows[index]); });
    var groupKeys = standards.reduce(function (keys, item) {
      if (keys.indexOf(item.groupKey) < 0) keys.push(item.groupKey);
      return keys;
    }, []);
    var applyTime = seed.date + ' 09:' + padNumber(10 + (seed.serial % 30)) + ':18';
    var reviewTime = seed.date + ' 10:' + padNumber(12 + (seed.serial % 30)) + ':42';
    var approveTime = seed.date + ' 14:' + padNumber(8 + (seed.serial % 30)) + ':25';
    var effectiveTime = seed.date + ' 14:' + padNumber(10 + (seed.serial % 30)) + ':06';
    var standardManagers = ['陈静', '王璐', '郑敏', '孙悦'];
    var governanceLeads = ['刘志远', '赵海峰', '周建国', '许志强'];
    var standardManager = standardManagers[seed.serial % standardManagers.length];
    var governanceLead = governanceLeads[seed.serial % governanceLeads.length];
    var timeline = [
      { name: '开始', status: 'done', actor: seed.applicant, time: applyTime, result: '已提交' },
      { name: '数据标准管理员', status: isReviewing ? 'current' : 'done', actor: standardManager, time: isReviewing ? '--' : reviewTime, result: isReviewing ? '办理中' : '通过' },
      { name: '数据治理负责人', status: isRejected ? 'rejected' : (seed.state === 'approve' ? 'current' : (isPassed ? 'done' : 'pending')), actor: governanceLead, time: isPassed || isRejected ? approveTime : '--', result: isPassed ? '通过' : (isRejected ? '驳回' : (seed.state === 'approve' ? '办理中' : '待处理')) },
      { name: '结束', status: isPassed ? 'done' : (isRejected ? 'terminated' : 'pending'), actor: '系统', time: isPassed ? effectiveTime : (isRejected ? approveTime : '--'), result: isPassed ? '已结束' : (isRejected ? '已终止' : '待处理') }
    ];
    var records = [
      { node: '开始', reviewer: seed.applicant, result: '提交', opinion: seed.reason, time: applyTime }
    ];
    if (!isReviewing) records.push({ node: '数据标准管理员', reviewer: standardManager, result: '通过', opinion: '标准内容及业务口径符合审核要求。', time: reviewTime });
    if (isPassed) {
      records.push({ node: '数据治理负责人', reviewer: governanceLead, result: '通过', opinion: '同意' + meta.actionLabel + '。', time: approveTime });
      records.push({ node: '结束', reviewer: '系统', result: '已结束', opinion: 'BPM流程结束，系统已自动完成标准' + meta.actionLabel + '。', time: effectiveTime });
    } else if (isRejected) {
      records.push({ node: '数据治理负责人', reviewer: governanceLead, result: '驳回', opinion: meta.actionLabel + '影响范围说明不完整，请补充后重新提交。', time: approveTime });
      records.push({ node: '结束', reviewer: '系统', result: '已终止', opinion: '审批被驳回，BPM流程终止，未触发标准' + meta.actionLabel + '。', time: approveTime });
    }
    return {
      id: 'BPM-DS-' + compact + '-' + serial,
      approvalType: meta.key,
      fileNo: 'DSF-' + compact + '-' + serial,
      fileName: meta.fileNamePrefix + compact + '-' + serial + '.xlsx',
      flowName: meta.flowName,
      applicant: seed.applicant,
      applyTime: applyTime,
      currentNode: isReviewing ? '数据标准管理员' : (isPassed ? '结束' : '数据治理负责人'),
      auditStatus: auditStatus,
      auditResult: auditResult,
      businessStatus: isPassed ? meta.successStatus : (isRejected ? meta.rejectedStatus : meta.pendingStatus),
      effectiveTime: isPassed ? effectiveTime : '--',
      reason: seed.reason,
      standards: standards,
      groupKeys: groupKeys,
      timeline: timeline,
      records: records
    };
  }

  approvalOrders = approvalOrders.concat([
    { date: '2026-08-30', serial: 4, type: 'publish', applicant: '赵磊', state: 'pass', rowIndexes: [13, 14], reason: '发布订单履约与客户标识相关标准。' },
    { date: '2026-08-29', serial: 5, type: 'publish', applicant: '周敏', state: 'review', rowIndexes: [9], reason: '发布公共域创建时间标准。' },
    { date: '2026-08-28', serial: 6, type: 'abolish', applicant: '陈涛', state: 'approve', rowIndexes: [1, 4], reason: '相关字段已被新标准替代，申请废止。' },
    { date: '2026-08-27', serial: 7, type: 'abolish', applicant: '刘倩', state: 'reject', rowIndexes: [5], reason: '安全管理规则调整，申请废止旧IP字段标准。' },
    { date: '2026-08-26', serial: 8, type: 'publish', applicant: '孙浩', state: 'pass', rowIndexes: [6], reason: '发布主键ID标准。' },
    { date: '2026-08-25', serial: 9, type: 'abolish', applicant: '何静', state: 'pass', rowIndexes: [8], reason: '备注字段定义已合并到统一说明标准，申请废止。' },
    { date: '2026-08-24', serial: 10, type: 'publish', applicant: '许峰', state: 'approve', rowIndexes: [3], reason: '发布支付结算标价标准。' },
    { date: '2026-08-23', serial: 11, type: 'publish', applicant: '吴雪', state: 'pass', rowIndexes: [2], reason: '发布主数据编码标准。' },
    { date: '2026-08-22', serial: 12, type: 'abolish', applicant: '郑宇', state: 'review', rowIndexes: [14], reason: '客户标识规则升级，申请废止现行标准。' },
    { date: '2026-08-21', serial: 13, type: 'publish', applicant: '郭琳', state: 'pass', rowIndexes: [4, 9], reason: '发布公共域时间属性标准。' },
    { date: '2026-08-20', serial: 14, type: 'publish', applicant: '唐杰', state: 'reject', rowIndexes: [10], reason: '发布数仓应用库标准。' },
    { date: '2026-08-19', serial: 15, type: 'abolish', applicant: '蒋欣', state: 'pass', rowIndexes: [11], reason: '统计表已完成模型迁移，申请废止旧表标准。' }
  ].map(buildApprovalSample));

  function approvalFileStandard(code, englishName, alias, meaning, dataType, length) {
    return {
      id: code,
      code: code,
      englishName: englishName,
      alias: alias,
      objectType: '字段',
      metaModel: '字段模型',
      meaning: meaning,
      groupKey: 'warehouse_ads',
      dataType: dataType,
      length: length,
      precision: dataType === 'decimal' ? '2' : '',
      desensitizeRule: '请选择',
      qualityRule: '非空校验(字段值不能为空)',
      encryptRule: '请选择',
      dataClass: '数仓组',
      dataLevel: '对内公开(L2)'
    };
  }

  var businessApprovalStandards = [
    {
      id: 'db_00000101', code: 'db_00000101', englishName: 'trade_subject', alias: '交易主题库', objectType: '库', metaModel: '库模型',
      meaning: '承载订单履约与支付结算主题数据', groupKey: 'trade_order', dataType: '', length: '', precision: '', desensitizeRule: '请选择',
      qualityRule: '请选择', encryptRule: '请选择', dataClass: '业务部', dataLevel: '对内公开(L2)'
    },
    {
      id: 'table_00000101', code: 'table_00000101', englishName: 'dwd_order_detail', alias: '订单明细表', objectType: '表', metaModel: '表模型',
      meaning: '记录订单创建、支付、履约及完成过程明细', groupKey: 'trade_order', dataType: '', length: '', precision: '', desensitizeRule: '请选择',
      qualityRule: '请选择', encryptRule: '请选择', dataClass: '业务部', dataLevel: '对内公开(L2)'
    }
  ].concat(standardRows.filter(function (item) {
    return item.groupKey.indexOf('warehouse_') !== 0;
  }).map(snapshotStandard));
  var warehouseApprovalStandards = [snapshotStandard(standardRows[10]), snapshotStandard(standardRows[11])].concat([
    approvalFileStandard('order_00000101', 'driver_id', '司机ID', '司机主数据唯一标识', 'varchar', '32'),
    approvalFileStandard('order_00000102', 'stat_date', '统计日期', '绩效统计所属业务日期', 'date', '10'),
    approvalFileStandard('order_00000103', 'completed_order_count', '完成订单数', '司机当日完成的订单数量', 'bigint', '20'),
    approvalFileStandard('order_00000104', 'on_time_rate', '准时履约率', '司机订单按时完成比例', 'decimal', '8'),
    approvalFileStandard('order_00000105', 'total_distance', '总里程', '司机当日累计行驶里程', 'decimal', '12'),
    approvalFileStandard('order_00000106', 'timeout_order_count', '超时订单数', '司机当日超时完成订单数量', 'bigint', '20'),
    approvalFileStandard('order_00000107', 'avg_delivery_duration', '平均配送时长', '司机订单平均配送耗时', 'decimal', '10'),
    approvalFileStandard('order_00000108', 'city_code', '城市编码', '运输业务所属城市标准编码', 'varchar', '12')
  ]);

  approvalOrders.forEach(function (order, orderIndex) {
    var isWarehouseOrder = order.groupKeys.some(function (key) { return key.indexOf('warehouse_') === 0; });
    var pool = isWarehouseOrder ? warehouseApprovalStandards : businessApprovalStandards;
    var expanded = order.standards.slice();
    var targetCount = 8 + (orderIndex % 3);
    for (var offset = 0; expanded.length < targetCount && offset < pool.length * 2; offset++) {
      var candidate = pool[(orderIndex + offset) % pool.length];
      var exists = expanded.some(function (item) { return item.code === candidate.code; });
      if (!exists) expanded.push(snapshotStandard(candidate));
    }
    order.standards = expanded;
    order.groupKeys = expanded.reduce(function (keys, item) {
      if (keys.indexOf(item.groupKey) < 0) keys.push(item.groupKey);
      return keys;
    }, []);
  });

  standardRows[12].auditStatus = '发布审批中';
  standardRows[12].approvalOrderId = approvalOrders[0].id;
  standardRows[12].currentApprovalOrderId = approvalOrders[0].id;
  standardRows[12].currentApprovalType = 'publish';
  standardRows[2].auditStatus = '发布审批通过';
  standardRows[2].approvalOrderId = approvalOrders[1].id;
  standardRows[7].auditStatus = '发布审批通过';
  standardRows[7].approvalOrderId = approvalOrders[1].id;
  standardRows[13].auditStatus = '废止审批驳回';
  standardRows[13].approvalOrderId = approvalOrders[2].id;

  standardRows.forEach(function (item) {
    item.approvalOrderIds = item.approvalOrderId ? [item.approvalOrderId] : [];
    if (!item.approvalOrderId) return;
    var linkedOrder = approvalOrders.filter(function (order) { return order.id === item.approvalOrderId; })[0];
    if (linkedOrder && linkedOrder.approvalType === 'publish' && item.versions.length) {
      item.versions[item.versions.length - 1].approvalOrderId = linkedOrder.id;
    }
  });

  function seedVersionDraft(item, options) {
    var draftSnapshot = snapshotStandardFields(item);
    draftSnapshot.meaning = options.meaning || item.meaning;
    item.versionDraft = {
      versionNo: getNextVersion(item.currentVersion),
      status: options.status,
      source: '标准变更',
      baseVersion: item.currentVersion,
      sourceVersion: '',
      summary: options.summary,
      operator: options.operator,
      changeTime: options.changeTime,
      approvalOrderId: options.approvalOrderId || '',
      snapshot: draftSnapshot
    };
    item.auditStatus = options.auditStatus;
    if (!options.approvalOrderId) return;
    item.approvalOrderId = options.approvalOrderId;
    item.approvalOrderIds = item.approvalOrderIds || [];
    if (item.approvalOrderIds.indexOf(options.approvalOrderId) < 0) item.approvalOrderIds.push(options.approvalOrderId);
    if (options.status === '审批中') {
      item.currentApprovalOrderId = options.approvalOrderId;
      item.currentApprovalType = 'publish';
    }
    var order = approvalOrders.filter(function (entry) { return entry.id === options.approvalOrderId; })[0];
    if (!order) return;
    var approvalSnapshot = snapshotStandardFields(draftSnapshot);
    approvalSnapshot.id = item.id;
    approvalSnapshot.currentVersion = item.currentVersion;
    approvalSnapshot.targetVersion = item.versionDraft.versionNo;
    approvalSnapshot.versionSource = item.versionDraft.source;
    var standardIndex = order.standards.findIndex(function (standard) { return standard.code === item.code; });
    if (standardIndex >= 0) order.standards[standardIndex] = approvalSnapshot;
    else order.standards.push(approvalSnapshot);
    if (order.groupKeys.indexOf(item.groupKey) < 0) order.groupKeys.push(item.groupKey);
  }

  seedVersionDraft(standardRows[1], {
    status: '变更草稿',
    auditStatus: '变更草稿',
    summary: '补充活跃资源IP信息的适用系统范围。',
    meaning: '用于标识当前活跃资源对应的IP地址及适用系统范围',
    operator: '李明',
    changeTime: '2026-09-02 11:12:08'
  });
  seedVersionDraft(standardRows[3], {
    status: '审批中',
    auditStatus: '变更发布审批中',
    summary: '统一标价字段的币种和小数精度说明。',
    meaning: '订单商品标价金额，默认币种为人民币，保留两位小数',
    operator: '王芳',
    changeTime: '2026-08-24 09:22:18',
    approvalOrderId: 'BPM-DS-20260824-010'
  });
  seedVersionDraft(standardRows[5], {
    status: '审批驳回',
    auditStatus: '变更发布审批驳回',
    summary: '调整活跃资源IP信息的数据分级和使用范围。',
    meaning: '记录活跃资源IP及其安全使用范围',
    operator: '陈涛',
    changeTime: '2026-08-20 09:24:18',
    approvalOrderId: 'BPM-DS-20260820-014'
  });

  var state = {
    activeTab: 'list',
    treeKey: 'biz',
    treeKeyword: '',
    selectedIds: {},
    page: 1,
    pageSize: 10,
    sortKey: 'code',
    sortDir: 'asc',
    filters: {
      metaModel: '',
      objectType: '',
      publishStatus: '',
      auditStatus: '',
      keyword: ''
    },
    ioFilters: {
      attr: '',
      status: '',
      keyword: ''
    },
    bpmFilters: {
      type: '',
      status: '',
      result: '',
      keyword: ''
    },
    bpmPage: 1,
    bpmPageSize: 10,
    bpmStandardFilters: { keyword: '' },
    bpmStandardPage: 1,
    bpmStandardPageSize: 5,
    createMenuOpen: false,
    formMode: '',
    formType: 'field',
    editRowId: '',
    viewRowId: '',
    logId: '',
    bpmDetailId: '',
    bpmStandardDetail: null,
    versionStandardId: '',
    versionMode: 'list',
    versionViewNo: '',
    versionSelected: {},
    versionFilters: { status: '', startDate: '', endDate: '', keyword: '' },
    versionOnlyDiff: false,
    pendingRollback: null,
    pendingApproval: null
  };

  function resetState() {
    state.activeTab = 'list';
    state.treeKey = 'biz';
    state.treeKeyword = '';
    state.selectedIds = {};
    state.page = 1;
    state.pageSize = 10;
    state.sortKey = 'code';
    state.sortDir = 'asc';
    state.filters = { metaModel: '', objectType: '', publishStatus: '', auditStatus: '', keyword: '' };
    state.ioFilters = { attr: '', status: '', keyword: '' };
    state.bpmFilters = { type: '', status: '', result: '', keyword: '' };
    state.bpmPage = 1;
    state.bpmPageSize = 10;
    state.bpmStandardFilters = { keyword: '' };
    state.bpmStandardPage = 1;
    state.bpmStandardPageSize = 5;
    state.createMenuOpen = false;
    state.formMode = '';
    state.formType = 'field';
    state.editRowId = '';
    state.viewRowId = '';
    state.logId = '';
    state.bpmDetailId = '';
    state.bpmStandardDetail = null;
    state.versionStandardId = '';
    state.versionMode = 'list';
    state.versionViewNo = '';
    state.versionSelected = {};
    state.versionFilters = { status: '', startDate: '', endDate: '', keyword: '' };
    state.versionOnlyDiff = false;
    state.pendingRollback = null;
    state.pendingApproval = null;
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function typeToMeta(type) {
    if (type === 'database') return { objectType: '库', metaModel: '库模型', title: '库模型' };
    if (type === 'table') return { objectType: '表', metaModel: '表模型', title: '表模型' };
    return { objectType: '字段', metaModel: '字段模型', title: '字段模型' };
  }

  function getTypeFromRow(row) {
    if (!row) return 'field';
    if (row.objectType === '库') return 'database';
    if (row.objectType === '表') return 'table';
    return 'field';
  }

  function getRowById(id) {
    return standardRows.filter(function (item) { return String(item.id) === String(id); })[0] || null;
  }

  function getIoById(id) {
    return ioRows.filter(function (item) { return String(item.id) === String(id); })[0] || null;
  }

  function getApprovalOrderById(id) {
    return approvalOrders.filter(function (item) { return String(item.id) === String(id); })[0] || null;
  }

  function getSelectedRows() {
    return Object.keys(state.selectedIds).map(getRowById).filter(Boolean);
  }

  function findTreeNode(nodes, key) {
    for (var i = 0; i < nodes.length; i++) {
      if (nodes[i].key === key) return nodes[i];
      var child = findTreeNode(nodes[i].children || [], key);
      if (child) return child;
    }
    return null;
  }

  function collectTreeKeys(node) {
    if (!node) return [];
    return [node.key].concat((node.children || []).reduce(function (keys, child) {
      return keys.concat(collectTreeKeys(child));
    }, []));
  }

  function getActiveTreeKeys() {
    return collectTreeKeys(findTreeNode(standardTree, state.treeKey));
  }

  function isInActiveTree(item) {
    var keys = getActiveTreeKeys();
    return !state.treeKey || keys.indexOf(item.groupKey) >= 0;
  }

  function getFilteredRows() {
    var keyword = state.filters.keyword.trim().toLowerCase();
    var rows = standardRows.filter(function (item) {
      if (!isInActiveTree(item)) return false;
      if (state.filters.metaModel && item.metaModel !== state.filters.metaModel) return false;
      if (state.filters.objectType && item.objectType !== state.filters.objectType) return false;
      if (state.filters.publishStatus && item.publishStatus !== state.filters.publishStatus) return false;
      if (state.filters.auditStatus && item.auditStatus !== state.filters.auditStatus) return false;
      if (!keyword) return true;
      return [item.code, item.englishName, item.alias, item.objectType, item.metaModel, item.meaning].join(' ').toLowerCase().indexOf(keyword) >= 0;
    });

    if (!state.sortKey) return rows;
    return rows.slice().sort(function (a, b) {
      var av = String(a[state.sortKey] || '');
      var bv = String(b[state.sortKey] || '');
      if (av > bv) return state.sortDir === 'asc' ? 1 : -1;
      if (av < bv) return state.sortDir === 'asc' ? -1 : 1;
      return 0;
    });
  }

  function getVisibleRows() {
    var rows = getFilteredRows();
    var totalPages = Math.max(1, Math.ceil(rows.length / state.pageSize));
    if (state.page > totalPages) state.page = totalPages;
    var start = (state.page - 1) * state.pageSize;
    return rows.slice(start, start + state.pageSize);
  }

  function getIoRows() {
    var keyword = state.ioFilters.keyword.trim().toLowerCase();
    return ioRows.filter(function (item) {
      if (state.ioFilters.attr && item.attr !== state.ioFilters.attr) return false;
      if (state.ioFilters.status && item.status !== state.ioFilters.status) return false;
      if (!keyword) return true;
      return item.fileName.toLowerCase().indexOf(keyword) >= 0;
    });
  }

  function getFilteredApprovalOrders() {
    var keyword = state.bpmFilters.keyword.trim().toLowerCase();
    var activeKeys = getActiveTreeKeys();
    return approvalOrders.filter(function (item) {
      var inTree = !state.treeKey || item.groupKeys.some(function (key) { return activeKeys.indexOf(key) >= 0; });
      if (!inTree) return false;
      if (state.bpmFilters.type && item.approvalType !== state.bpmFilters.type) return false;
      if (state.bpmFilters.status && item.auditStatus !== state.bpmFilters.status) return false;
      if (state.bpmFilters.result && item.auditResult !== state.bpmFilters.result) return false;
      if (!keyword) return true;
      return [item.id, item.fileNo, item.fileName, item.applicant, item.currentNode].join(' ').toLowerCase().indexOf(keyword) >= 0;
    });
  }

  function getVisibleApprovalOrders() {
    var rows = getFilteredApprovalOrders();
    var totalPages = Math.max(1, Math.ceil(rows.length / state.bpmPageSize));
    if (state.bpmPage > totalPages) state.bpmPage = totalPages;
    var start = (state.bpmPage - 1) * state.bpmPageSize;
    return rows.slice(start, start + state.bpmPageSize);
  }

  function showToast(text) {
    if (!pageEl) return;
    var old = pageEl.querySelector('.dsd-toast');
    if (old) old.remove();
    var toast = document.createElement('div');
    toast.className = 'dsd-toast';
    toast.innerHTML = '<i class="bi bi-check-circle"></i><span>' + escapeHtml(text) + '</span>';
    pageEl.appendChild(toast);
    setTimeout(function () { toast.classList.add('show'); }, 10);
    setTimeout(function () {
      toast.classList.remove('show');
      setTimeout(function () { if (toast.parentNode) toast.remove(); }, 180);
    }, 1800);
  }

  function updateContent() {
    if (!pageEl) return;
    var tabs = pageEl.querySelector('[data-dsd-tabs]');
    var view = pageEl.querySelector('[data-dsd-view]');
    if (tabs) tabs.innerHTML = renderTabs();
    if (view) view.innerHTML = renderActiveView();
    syncFilterControls();
    updateCheckAll();
    updateSortButtons();
  }

  function treeNodeMatches(node, keyword) {
    if (!keyword) return true;
    var text = (node.label + ' ' + (node.count || '')).toLowerCase();
    if (text.indexOf(keyword) >= 0) return true;
    return (node.children || []).some(function (child) {
      return treeNodeMatches(child, keyword);
    });
  }

  function renderTreeNodes(nodes, keyword, forceShowChildren) {
    return nodes.filter(function (node) {
      return forceShowChildren || treeNodeMatches(node, keyword);
    }).map(function (node) {
      var ownMatched = !keyword || (node.label + ' ' + (node.count || '')).toLowerCase().indexOf(keyword) >= 0;
      var children = node.children || [];
      var childHtml = children.length
        ? '<ul class="dsd-tree-children">' + renderTreeNodes(children, keyword, forceShowChildren || ownMatched) + '</ul>'
        : '';
      return '<li class="dsd-tree-node">' +
        '<button class="dsd-tree-row' + (state.treeKey === node.key ? ' active' : '') + '" type="button" data-dsd-tree-key="' + node.key + '">' +
          '<i class="bi ' + node.icon + '"></i><span class="dsd-tree-name">' + escapeHtml(node.label) + '</span>' +
          '<span class="dsd-tree-count">' + escapeHtml(node.count || 0) + '</span>' +
        '</button>' +
        childHtml +
      '</li>';
    }).join('');
  }

  function renderTree() {
    if (!pageEl) return;
    var tree = pageEl.querySelector('[data-dsd-tree]');
    if (!tree) return;
    var keyword = state.treeKeyword.trim().toLowerCase();
    var html = renderTreeNodes(standardTree, keyword, false);
    tree.innerHTML = html || '<li class="dsd-tree-empty">暂无匹配分类</li>';
  }

  function renderTabs() {
    var active = state.activeTab === 'log' ? 'io' : state.activeTab;
    return [
      { key: 'list', text: '数据列表' },
      { key: 'io', text: '导入导出' },
      { key: 'bpm', text: 'BPM审批' }
    ].map(function (tab) {
      return '<button class="dsd-tab' + (active === tab.key ? ' active' : '') + '" type="button" data-dsd-tab="' + tab.key + '">' + tab.text + '</button>';
    }).join('');
  }

  function renderActiveView() {
    if (state.formMode) return renderFormPage();
    if (state.versionStandardId) return renderVersionView();
    if (state.activeTab === 'log') return renderLogView();
    if (state.activeTab === 'io') return renderIoView();
    if (state.activeTab === 'bpm') return renderBpmView();
    return renderListView();
  }

  function sortHeader(key, label) {
    return '<button class="dsd-th-sort" type="button" data-dsd-sort="' + key + '">' +
      '<span>' + label + '</span>' +
      '<span class="dsd-sort-stack"><i class="bi bi-caret-up-fill"></i><i class="bi bi-caret-down-fill"></i></span>' +
    '</button>';
  }

  function renderCreateMenu() {
    return '<div class="dsd-create-menu' + (state.createMenuOpen ? ' open' : '') + '">' +
      '<button class="btn btn-primary" type="button" data-dsd-action="toggle-create"><i class="bi bi-plus-lg"></i><span>新建</span><i class="bi bi-caret-down-fill"></i></button>' +
      '<div class="dsd-create-dropdown">' +
        '<button type="button" data-dsd-action="create" data-type="field"><i class="bi bi-card-text"></i><span>字段模型（字段）</span></button>' +
        '<button type="button" data-dsd-action="create" data-type="database"><i class="bi bi-database"></i><span>库模型（库）</span></button>' +
        '<button type="button" data-dsd-action="create" data-type="table"><i class="bi bi-table"></i><span>表模型（表）</span></button>' +
      '</div>' +
    '</div>';
  }

  function renderListView() {
    var rows = getFilteredRows();
    var visibleRows = getVisibleRows();
    var publishAction = approvalConfig.enabled
      ? '<button class="btn btn-primary" type="button" data-dsd-action="submit-publish-approval-selected"><i class="bi bi-send-check"></i><span>发布审批</span></button>'
      : '<button class="btn btn-primary" type="button" data-dsd-action="publish-selected"><i class="bi bi-send-check"></i><span>发布</span></button>';
    var abolishAction = approvalConfig.enabled
      ? '<button class="btn btn-danger" type="button" data-dsd-action="submit-abolish-approval-selected"><i class="bi bi-slash-circle"></i><span>废止审批</span></button>'
      : '<button class="btn btn-danger" type="button" data-dsd-action="abolish-selected"><i class="bi bi-slash-circle"></i><span>废止</span></button>';
    return '<div class="dsd-toolbar">' +
      '<div class="dsd-toolbar-left">' +
        renderCreateMenu() +
        '<button class="btn btn-primary" type="button" data-dsd-action="import"><i class="bi bi-upload"></i><span>导入</span></button>' +
        '<button class="btn btn-primary" type="button" data-dsd-action="export"><i class="bi bi-download"></i><span>导出</span></button>' +
        publishAction +
        abolishAction +
        '<button class="btn btn-danger" type="button" data-dsd-action="delete-selected"><i class="bi bi-trash3"></i><span>删除</span></button>' +
      '</div>' +
      '<div class="dsd-toolbar-right">' +
        '<select class="dsd-filter" data-dsd-filter="metaModel" aria-label="元模型"><option value="">元模型</option><option value="字段模型">字段模型</option><option value="库模型">库模型</option><option value="表模型">表模型</option></select>' +
        '<select class="dsd-filter" data-dsd-filter="objectType" aria-label="对象"><option value="">对象</option><option value="字段">字段</option><option value="库">库</option><option value="表">表</option></select>' +
        '<select class="dsd-filter" data-dsd-filter="publishStatus" aria-label="发布状态"><option value="">发布状态</option><option value="编制">编制</option><option value="已发布">已发布</option><option value="已废止">已废止</option></select>' +
        '<select class="dsd-filter" data-dsd-filter="auditStatus" aria-label="审核状态"><option value="">审核状态</option><option value="待提交">待提交</option><option value="发布审批中">发布审批中</option><option value="发布审批通过">发布审批通过</option><option value="发布审批驳回">发布审批驳回</option><option value="废止审批中">废止审批中</option><option value="废止审批通过">废止审批通过</option><option value="废止审批驳回">废止审批驳回</option><option value="免审发布">免审发布</option><option value="免审废止">免审废止</option></select>' +
        '<div class="dsd-query"><input type="text" data-dsd-keyword value="' + escapeHtml(state.filters.keyword) + '" placeholder="编码/英文名/别名" aria-label="编码英文名别名"><button class="btn btn-primary" type="button" data-dsd-action="query"><i class="bi bi-search"></i><span>查询</span></button></div>' +
      '</div>' +
    '</div>' +
    '<div class="dsd-table-wrap dsd-list-table-wrap">' +
      '<table class="dsd-table dsd-list-table">' +
        '<colgroup><col class="dsd-w-check"><col class="dsd-w-code"><col class="dsd-w-name"><col class="dsd-w-alias"><col class="dsd-w-object"><col class="dsd-w-model"><col class="dsd-w-meaning"><col class="dsd-w-version"><col class="dsd-w-status"><col class="dsd-w-audit"><col class="dsd-w-action"></colgroup>' +
        '<thead><tr>' +
          '<th class="dsd-col-check"><input type="checkbox" data-dsd-check-all aria-label="全选"></th>' +
          '<th>' + sortHeader('code', '编码') + '</th>' +
          '<th>' + sortHeader('englishName', '英文名称') + '</th>' +
          '<th>' + sortHeader('alias', '别名') + '</th>' +
          '<th>' + sortHeader('objectType', '对象') + '</th>' +
          '<th>' + sortHeader('metaModel', '元模型') + '</th>' +
          '<th>' + sortHeader('meaning', '含义说明') + '</th>' +
          '<th>当前版本</th>' +
          '<th>' + sortHeader('publishStatus', '发布状态') + '</th>' +
          '<th>' + sortHeader('auditStatus', '审核状态') + '</th>' +
          '<th>操作</th>' +
        '</tr></thead>' +
        '<tbody>' + (visibleRows.length ? visibleRows.map(renderDataRow).join('') : '<tr class="dsd-empty-row"><td colspan="11">暂无匹配的数据标准</td></tr>') + '</tbody>' +
      '</table>' +
    '</div>' +
    renderPager(rows.length);
  }

  function renderDataRow(item) {
    var locked = isInApproval(item);
    return '<tr>' +
      '<td class="dsd-col-check"><input type="checkbox" data-dsd-row-check="' + item.id + '"' + (state.selectedIds[item.id] ? ' checked' : '') + (locked ? ' disabled title="审批中的标准不可选择"' : '') + ' aria-label="选择记录"></td>' +
      '<td title="' + escapeHtml(item.code) + '">' + escapeHtml(item.code) + '</td>' +
      '<td title="' + escapeHtml(item.englishName) + '">' + escapeHtml(item.englishName) + '</td>' +
      '<td title="' + escapeHtml(item.alias) + '">' + escapeHtml(item.alias) + '</td>' +
      '<td>' + escapeHtml(item.objectType) + '</td>' +
      '<td>' + escapeHtml(item.metaModel) + '</td>' +
      '<td title="' + escapeHtml(item.meaning) + '">' + escapeHtml(item.meaning) + '</td>' +
      '<td title="' + escapeHtml(item.versionDraft ? item.currentVersion + ' → ' + item.versionDraft.versionNo + ' 草稿' : item.currentVersion) + '"><span class="dsd-version-value' + (item.currentVersion === '--' ? ' draft' : '') + '">' + escapeHtml(item.versionDraft ? item.currentVersion + ' → ' + item.versionDraft.versionNo + '草稿' : item.currentVersion) + '</span></td>' +
      '<td>' + renderPublishStatus(item.publishStatus) + '</td>' +
      '<td>' + renderAuditStatus(item.auditStatus) + '</td>' +
      '<td>' + renderRowActions(item) + '</td>' +
    '</tr>';
  }

  function renderPublishStatus(status) {
    var cls = status === '已发布' ? ' published' : (status === '已废止' ? ' abolished' : ' draft');
    return '<span class="dsd-status' + cls + '">' + escapeHtml(status) + '</span>';
  }

  function renderAuditStatus(status) {
    var cls = status.indexOf('通过') >= 0 ? ' pass'
        : (status.indexOf('驳回') >= 0 ? ' rejected'
        : (status.indexOf('中') >= 0 ? ' process'
          : (status.indexOf('免审') === 0 ? ' exempt' : ' waiting')));
    return '<span class="dsd-audit' + cls + '">' + escapeHtml(status) + '</span>';
  }

  function renderRowActions(item) {
    var common = '<button class="dsd-action-btn" type="button" data-dsd-action="view" data-id="' + item.id + '"><i class="bi bi-file-earmark-text"></i><span>查看</span></button>';
    var approvalHistory = item.approvalOrderId ? '<button class="dsd-action-btn" type="button" data-dsd-action="view-approval" data-order-id="' + escapeHtml(item.approvalOrderId) + '"><i class="bi bi-clipboard-check"></i><span>审批记录</span></button>' : '';
    var versionHistory = item.currentVersion !== '--' || item.versionDraft ? '<button class="dsd-action-btn" type="button" data-dsd-action="version-history" data-id="' + item.id + '"><i class="bi bi-clock-history"></i><span>版本记录</span></button>' : '';
    var inApproval = isInApproval(item);
    if (inApproval) {
      return '<div class="dsd-actions">' + common + versionHistory + approvalHistory + '</div>';
    }
    if (item.publishStatus === '已发布') {
      if (item.versionDraft) {
        var draftReleaseAction = approvalConfig.enabled
          ? '<button class="dsd-action-btn" type="button" data-dsd-action="submit-publish-approval-row" data-id="' + item.id + '"><i class="bi bi-send-check"></i><span>发布审批</span></button>'
          : '<button class="dsd-action-btn" type="button" data-dsd-action="publish-row" data-id="' + item.id + '"><i class="bi bi-share-fill"></i><span>发布版本</span></button>';
        return '<div class="dsd-actions">' + common +
          '<button class="dsd-action-btn" type="button" data-dsd-action="edit-version-draft" data-id="' + item.id + '"><i class="bi bi-pencil-square"></i><span>继续变更</span></button>' +
          versionHistory + approvalHistory + draftReleaseAction +
        '</div>';
      }
      var abolishAction = approvalConfig.enabled
        ? '<button class="dsd-action-btn danger" type="button" data-dsd-action="submit-abolish-approval-row" data-id="' + item.id + '"><i class="bi bi-slash-circle"></i><span>废止审批</span></button>'
        : '<button class="dsd-action-btn danger" type="button" data-dsd-action="abolish-row" data-id="' + item.id + '"><i class="bi bi-slash-circle"></i><span>废止</span></button>';
      return '<div class="dsd-actions">' + common +
        '<button class="dsd-action-btn" type="button" data-dsd-action="change-standard" data-id="' + item.id + '"><i class="bi bi-pencil-square"></i><span>变更</span></button>' +
        versionHistory + approvalHistory + abolishAction +
      '</div>';
    }
    if (item.publishStatus !== '编制') {
      return '<div class="dsd-actions">' + common + versionHistory + approvalHistory + '</div>';
    }
    var releaseAction = approvalConfig.enabled
      ? '<button class="dsd-action-btn" type="button" data-dsd-action="submit-publish-approval-row" data-id="' + item.id + '"><i class="bi bi-send-check"></i><span>发布审批</span></button>'
      : '<button class="dsd-action-btn" type="button" data-dsd-action="publish-row" data-id="' + item.id + '"><i class="bi bi-share-fill"></i><span>发布</span></button>';
    return '<div class="dsd-actions">' + common +
      approvalHistory +
      '<button class="dsd-action-btn" type="button" data-dsd-action="edit" data-id="' + item.id + '"><i class="bi bi-pencil-square"></i><span>编辑</span></button>' +
      releaseAction +
      '<button class="dsd-action-btn danger" type="button" data-dsd-action="delete-row" data-id="' + item.id + '"><i class="bi bi-trash3"></i><span>删除</span></button>' +
    '</div>';
  }

  function renderPager(total) {
    var totalPages = Math.max(1, Math.ceil(total / state.pageSize));
    var start = total ? (state.page - 1) * state.pageSize + 1 : 0;
    var end = Math.min(state.page * state.pageSize, total);
    var pageBtns = '';
    for (var i = 1; i <= totalPages; i++) {
      pageBtns += '<button class="dsd-page-num' + (i === state.page ? ' active' : '') + '" type="button" data-dsd-page="' + i + '">' + i + '</button>';
    }
    return '<div class="dsd-pagination">' +
      '<div class="dsd-page-info">显示第 ' + start + ' 到第 ' + end + ' 条记录，总共 ' + total + ' 条记录&nbsp;&nbsp;每页显示' +
        '<select class="dsd-page-size" data-dsd-page-size aria-label="每页显示条数">' +
          '<option value="10"' + (state.pageSize === 10 ? ' selected' : '') + '>10</option>' +
          '<option value="20"' + (state.pageSize === 20 ? ' selected' : '') + '>20</option>' +
          '<option value="50"' + (state.pageSize === 50 ? ' selected' : '') + '>50</option>' +
        '</select>条记录</div>' +
      '<div class="dsd-page-nav">' +
        '<button class="dsd-page-btn" type="button" data-dsd-page="prev"' + (state.page === 1 ? ' disabled' : '') + '><i class="bi bi-chevron-left"></i></button>' +
        pageBtns +
        '<button class="dsd-page-btn" type="button" data-dsd-page="next"' + (state.page === totalPages ? ' disabled' : '') + '><i class="bi bi-chevron-right"></i></button>' +
        '<input class="dsd-page-jump" value="' + state.page + '" aria-label="跳转页码"><button class="dsd-page-go" type="button" data-dsd-action="page-go">GO</button>' +
      '</div>' +
    '</div>';
  }

  function defaultFormData(type) {
    var meta = typeToMeta(type);
    var prefix = type === 'database' ? 'db_' : (type === 'table' ? 'table_' : 'order_');
    var nextNo = String(standardRows.length + 1).padStart(8, '0');
    return {
      code: prefix + nextNo,
      englishName: '',
      alias: '',
      objectType: meta.objectType,
      metaModel: meta.metaModel,
      meaning: '',
      dataType: '',
      length: '',
      precision: '',
      desensitizeRule: '请选择',
      qualityRule: '请选择',
      encryptRule: '请选择',
      dataClass: state.treeKey === 'warehouse' ? '数仓组' : '业务部',
      dataLevel: '请选择'
    };
  }

  function getFormData() {
    var item = state.formMode === 'create' ? null : getRowById(state.editRowId || state.viewRowId);
    if (!item) return defaultFormData(state.formType);
    var source = state.formMode === 'change' && item.versionDraft ? item.versionDraft.snapshot : item;
    var data = snapshotStandardFields(source);
    data.changeSummary = item.versionDraft ? item.versionDraft.summary : '';
    return data;
  }

  function editTextField(name, label, value, required, disabled) {
    return '<div class="dsd-edit-row">' +
      '<label class="dsd-edit-label" for="dsd-edit-' + name + '">' + (required ? '<em>*</em>' : '') + label + '</label>' +
      '<input id="dsd-edit-' + name + '" class="dsd-edit-control" data-dsd-edit="' + name + '" value="' + escapeHtml(value) + '"' + (disabled ? ' disabled' : '') + '>' +
      '<span class="dsd-edit-tip"><i class="bi bi-info-circle-fill"></i>' + label + ';</span>' +
    '</div>';
  }

  function editTextarea(name, label, value, disabled) {
    return '<div class="dsd-edit-row dsd-edit-row-area">' +
      '<label class="dsd-edit-label" for="dsd-edit-' + name + '">' + label + '</label>' +
      '<textarea id="dsd-edit-' + name + '" class="dsd-edit-control" data-dsd-edit="' + name + '"' + (disabled ? ' disabled' : '') + '>' + escapeHtml(value) + '</textarea>' +
      '<span class="dsd-edit-tip"><i class="bi bi-info-circle-fill"></i>' + label + ';</span>' +
    '</div>';
  }

  function editSelectField(name, label, value, options, disabled) {
    if (disabled) return editTextField(name, label, value, false, true);
    if (value && options.indexOf(value) < 0) options = [value].concat(options);
    return '<div class="dsd-edit-row">' +
      '<label class="dsd-edit-label" for="dsd-edit-' + name + '">' + label + '</label>' +
      '<div class="dsd-combo" data-dsd-combo>' +
        '<input id="dsd-edit-' + name + '" type="hidden" data-dsd-edit="' + name + '" value="' + escapeHtml(value) + '">' +
        '<button class="dsd-edit-control dsd-combo-trigger" type="button" data-dsd-combo-trigger><span data-dsd-combo-text>' + escapeHtml(value || '请选择') + '</span><i class="bi bi-caret-down-fill"></i></button>' +
        '<div class="dsd-combo-panel">' +
          '<input class="dsd-combo-search" type="text" data-dsd-combo-search aria-label="' + label + '搜索">' +
          '<div class="dsd-combo-options">' + options.map(function (option) {
            return '<button class="dsd-combo-option' + (option === value ? ' active' : '') + '" type="button" data-dsd-combo-option data-value="' + escapeHtml(option) + '">' + escapeHtml(option) + '</button>';
          }).join('') + '</div>' +
        '</div>' +
      '</div>' +
      '<span class="dsd-edit-tip"><i class="bi bi-info-circle-fill"></i>' + label + ';</span>' +
    '</div>';
  }

  function renderBasicSection(data, readonly) {
    return '<section class="dsd-edit-section">' +
      '<h3>基本信息</h3>' +
      editTextField('code', '编码', data.code, true, true) +
      editTextField('englishName', '英文名', data.englishName, true, readonly) +
      editTextField('alias', '别名', data.alias, true, readonly) +
      editTextarea('meaning', '描述', data.meaning, readonly) +
    '</section>';
  }

  function renderTechnicalSection(data, readonly) {
    return '<section class="dsd-edit-section">' +
      '<h3>技术信息</h3>' +
      editTextField('dataType', '数据类型', data.dataType, false, readonly) +
      editTextField('length', '长度', data.length, false, readonly) +
      editTextField('precision', '精度', data.precision, false, readonly) +
      editSelectField('desensitizeRule', '脱敏规则', data.desensitizeRule, ['请选择', '手机号(手机号正则脱敏)', '身份证号(身份证号正则脱敏)', 'IP地址(IP地址正则脱敏)', '地址(地址正则脱敏)', '银行卡号(银行卡号正则脱敏)'], readonly) +
      editSelectField('qualityRule', '质量规则', data.qualityRule, ['请选择', '长度校验(模型字段长度规范值)', '唯一性校验(字段值不可重复)', '取值范围约束(字段值必须在标准范围内)', '金额非负校验(金额字段必须大于等于0)', '及时性校验(时间字段不得晚于当前时间)'], readonly) +
      editSelectField('encryptRule', '加密规则', data.encryptRule, ['请选择', '国密SM2(国密SM2)', 'AES192加密(AES192加密)', '3DES加密(3DES加密)', 'MD5加密(MD5加密)'], readonly) +
    '</section>';
  }

  function renderBusinessSection(data, readonly, isFieldModel) {
    var saveText = state.formMode === 'change' ? '保存变更草稿' : '保存';
    return '<section class="dsd-edit-section dsd-edit-section-last">' +
      '<h3>业务信息</h3>' +
      editSelectField('dataClass', '数据分类', data.dataClass, ['业务部', '数仓组', '财务结算域', '客户服务域', '公共维度域'], readonly) +
      (isFieldModel ? editSelectField('dataLevel', '数据分级', data.dataLevel, ['请选择', '绝密数据(L4)', '机密数据(L3)', '对内公开(L2)', '公开数据(L1)'], readonly) : '') +
      (readonly ? '' : '<div class="dsd-edit-footer">' +
        '<button class="btn btn-primary" type="button" data-dsd-action="save-form"><i class="bi bi-save"></i><span>' + saveText + '</span></button>' +
        '<button class="btn btn-outline" type="button" data-dsd-action="cancel-form"><i class="bi bi-x-lg"></i><span>取消</span></button>' +
      '</div>') +
    '</section>';
  }

  function renderFormPage() {
    var data = getFormData();
    var readonly = state.formMode === 'view';
    var type = state.formMode === 'create' ? state.formType : getTypeFromRow(getRowById(state.editRowId || state.viewRowId));
    var meta = typeToMeta(type);
    var item = getRowById(state.editRowId || state.viewRowId);
    var title = readonly ? '查看' : (state.formMode === 'create' ? '新建' + meta.title : (state.formMode === 'change' ? '标准变更' : '修改'));
    var versionTitle = item && item.currentVersion !== '--' ? '<em class="dsd-edit-version">' + escapeHtml(item.currentVersion) + '</em>' : '';
    var changePanel = state.formMode === 'change' && item ? '<section class="dsd-version-change-panel">' +
      '<div><span>当前有效版本</span><strong>' + escapeHtml(item.currentVersion) + '</strong></div>' +
      '<div><span>目标版本</span><strong>' + escapeHtml(item.versionDraft ? item.versionDraft.versionNo : getNextVersion(item.currentVersion)) + '</strong></div>' +
      '<div><span>版本来源</span><strong>' + escapeHtml(item.versionDraft ? item.versionDraft.source : '标准变更') + '</strong></div>' +
      '<label><span><em>*</em>变更说明</span><textarea data-dsd-edit="changeSummary" maxlength="200" placeholder="请输入本次标准变更说明">' + escapeHtml(data.changeSummary || '') + '</textarea></label>' +
    '</section>' : '';
    return '<div class="dsd-edit-page" data-dsd-form="' + state.formMode + '">' +
      '<div class="dsd-edit-head">' +
        '<div class="dsd-edit-title"><i class="bi bi-list"></i><span>' + title + '</span>' + versionTitle + '</div>' +
        '<button class="btn btn-primary" type="button" data-dsd-action="back-list"><i class="bi bi-arrow-left"></i><span>返回</span></button>' +
      '</div>' +
      '<div class="dsd-edit-scroll">' +
        changePanel +
        renderBasicSection(data, readonly) +
        (type === 'field' ? renderTechnicalSection(data, readonly) : '') +
        renderBusinessSection(data, readonly, type === 'field') +
      '</div>' +
    '</div>';
  }

  function compareVersionNumbers(a, b) {
    function parts(value) {
      var matched = /^V(\d+)\.(\d+)$/.exec(value || '');
      return matched ? [Number(matched[1]), Number(matched[2])] : [0, 0];
    }
    var av = parts(a);
    var bv = parts(b);
    return av[0] === bv[0] ? av[1] - bv[1] : av[0] - bv[0];
  }

  function getVersionRecords(item) {
    var records = (item.versions || []).slice();
    if (item.versionDraft) {
      records.push({
        versionNo: item.versionDraft.versionNo,
        status: item.versionDraft.status,
        source: item.versionDraft.source,
        baseVersion: item.versionDraft.baseVersion,
        sourceVersion: item.versionDraft.sourceVersion || '',
        summary: item.versionDraft.summary,
        operator: item.versionDraft.operator,
        changeTime: item.versionDraft.changeTime,
        publisher: '--',
        publishTime: '--',
        approvalOrderId: item.versionDraft.approvalOrderId || '',
        snapshot: item.versionDraft.snapshot,
        isDraft: true
      });
    }
    return records.sort(function (a, b) { return compareVersionNumbers(b.versionNo, a.versionNo); });
  }

  function getVersionRecord(item, versionNo) {
    return getVersionRecords(item).filter(function (record) { return record.versionNo === versionNo; })[0] || null;
  }

  function getFilteredVersionRecords(item) {
    var keyword = state.versionFilters.keyword.trim().toLowerCase();
    return getVersionRecords(item).filter(function (record) {
      if (state.versionFilters.status && record.status !== state.versionFilters.status) return false;
      if (state.versionFilters.startDate && record.changeTime.slice(0, 10) < state.versionFilters.startDate) return false;
      if (state.versionFilters.endDate && record.changeTime.slice(0, 10) > state.versionFilters.endDate) return false;
      if (!keyword) return true;
      return [record.versionNo, record.source, record.summary, record.operator, record.approvalOrderId].join(' ').toLowerCase().indexOf(keyword) >= 0;
    });
  }

  function renderVersionStatus(status) {
    var cls = status === '当前版本' ? ' current' : (status === '历史版本' ? ' history' : (status === '已废止' ? ' abolished' : ' draft'));
    return '<span class="dsd-version-status' + cls + '">' + escapeHtml(status) + '</span>';
  }

  function renderVersionHistoryRow(item, record) {
    var canRollback = record.status === '历史版本' && item.publishStatus === '已发布' && !item.versionDraft && !isInApproval(item);
    var draftActions = record.isDraft && !isInApproval(item)
      ? '<button class="dsd-action-btn" type="button" data-dsd-action="edit-version-draft" data-id="' + item.id + '"><i class="bi bi-pencil-square"></i><span>编辑</span></button>' +
        (approvalConfig.enabled
          ? '<button class="dsd-action-btn" type="button" data-dsd-action="submit-version-approval" data-id="' + item.id + '"><i class="bi bi-send-check"></i><span>发布审批</span></button>'
          : '<button class="dsd-action-btn" type="button" data-dsd-action="publish-row" data-id="' + item.id + '"><i class="bi bi-share-fill"></i><span>发布版本</span></button>')
      : '';
    var sourceText = record.sourceVersion ? record.source + '（' + record.sourceVersion + '）' : record.source;
    return '<tr>' +
      '<td class="dsd-col-check"><input type="checkbox" data-dsd-version-check="' + escapeHtml(record.versionNo) + '"' + (state.versionSelected[record.versionNo] ? ' checked' : '') + ' aria-label="选择' + escapeHtml(record.versionNo) + '"></td>' +
      '<td><strong class="dsd-version-number">' + escapeHtml(record.versionNo) + '</strong></td>' +
      '<td>' + renderVersionStatus(record.status) + '</td>' +
      '<td title="' + escapeHtml(sourceText) + '">' + escapeHtml(sourceText) + '</td>' +
      '<td>' + escapeHtml(record.baseVersion || '--') + '</td>' +
      '<td title="' + escapeHtml(record.summary) + '">' + escapeHtml(record.summary) + '</td>' +
      '<td>' + escapeHtml(record.operator) + '</td>' +
      '<td>' + escapeHtml(record.changeTime) + '</td>' +
      '<td>' + escapeHtml(record.publisher || '--') + '</td>' +
      '<td>' + escapeHtml(record.publishTime || '--') + '</td>' +
      '<td><div class="dsd-actions"><button class="dsd-action-btn" type="button" data-dsd-action="view-version" data-version-no="' + escapeHtml(record.versionNo) + '"><i class="bi bi-eye"></i><span>查看</span></button>' +
        draftActions +
        (canRollback ? '<button class="dsd-action-btn danger" type="button" data-dsd-action="rollback-version" data-id="' + item.id + '" data-version-no="' + escapeHtml(record.versionNo) + '"><i class="bi bi-arrow-counterclockwise"></i><span>回滚</span></button>' : '') +
      '</div></td>' +
    '</tr>';
  }

  function renderVersionHistory(item) {
    var records = getFilteredVersionRecords(item);
    var selectedCount = Object.keys(state.versionSelected).length;
    return '<div class="dsd-version-page">' +
      '<div class="dsd-edit-head">' +
        '<div class="dsd-edit-title"><i class="bi bi-clock-history"></i><span>版本记录</span><em class="dsd-edit-version">' + escapeHtml(item.code) + '</em></div>' +
        '<button class="btn btn-primary" type="button" data-dsd-action="back-version-list"><i class="bi bi-arrow-left"></i><span>返回</span></button>' +
      '</div>' +
      '<div class="dsd-version-summary">' +
        '<div><span>标准名称</span><strong>' + escapeHtml(item.alias) + '</strong></div>' +
        '<div><span>当前版本</span><strong>' + escapeHtml(item.currentVersion) + '</strong></div>' +
        '<div><span>发布状态</span><strong>' + renderPublishStatus(item.publishStatus) + '</strong></div>' +
        '<div><span>历史版本数</span><strong>' + (item.versions || []).filter(function (record) { return record.status === '历史版本'; }).length + '</strong></div>' +
      '</div>' +
      '<div class="dsd-toolbar dsd-version-toolbar">' +
        '<div class="dsd-toolbar-left"><button class="btn btn-primary" type="button" data-dsd-action="compare-versions"' + (selectedCount === 2 ? '' : ' disabled') + '><i class="bi bi-layout-split"></i><span>版本比较' + (selectedCount ? '（' + selectedCount + '/2）' : '') + '</span></button></div>' +
        '<div class="dsd-toolbar-right">' +
          '<select class="dsd-filter" data-dsd-version-filter="status" aria-label="版本状态"><option value="">版本状态</option><option value="当前版本">当前版本</option><option value="历史版本">历史版本</option><option value="变更草稿">变更草稿</option><option value="审批中">审批中</option><option value="审批驳回">审批驳回</option><option value="已废止">已废止</option></select>' +
          '<label class="dsd-version-date"><span>变更时间</span><input type="date" data-dsd-version-filter="startDate" value="' + escapeHtml(state.versionFilters.startDate) + '" aria-label="变更开始日期"><em>至</em><input type="date" data-dsd-version-filter="endDate" value="' + escapeHtml(state.versionFilters.endDate) + '" aria-label="变更结束日期"></label>' +
          '<div class="dsd-query dsd-version-query"><input type="text" data-dsd-version-keyword value="' + escapeHtml(state.versionFilters.keyword) + '" placeholder="版本号/说明/变更人" aria-label="版本号说明变更人"><button class="btn btn-primary" type="button" data-dsd-action="query-versions"><i class="bi bi-search"></i><span>查询</span></button></div>' +
        '</div>' +
      '</div>' +
      '<div class="dsd-table-wrap dsd-version-table-wrap"><table class="dsd-table dsd-version-table">' +
        '<thead><tr><th></th><th>版本号</th><th>版本状态</th><th>版本来源</th><th>基于版本</th><th>变更摘要</th><th>变更人</th><th>变更时间</th><th>发布人</th><th>发布时间</th><th>操作</th></tr></thead>' +
        '<tbody>' + (records.length ? records.map(function (record) { return renderVersionHistoryRow(item, record); }).join('') : '<tr class="dsd-empty-row"><td colspan="11">暂无匹配的历史版本</td></tr>') + '</tbody>' +
      '</table></div>' +
      '<div class="dsd-footnote">显示第 1 到第 ' + records.length + ' 条记录，总共 ' + records.length + ' 条记录</div>' +
    '</div>';
  }

  function renderVersionDetail(item, record) {
    if (!record) return renderVersionHistory(item);
    var type = getTypeFromRow(record.snapshot);
    return '<div class="dsd-edit-page">' +
      '<div class="dsd-edit-head">' +
        '<div class="dsd-edit-title"><i class="bi bi-file-earmark-text"></i><span>版本详情</span><em class="dsd-edit-version">' + escapeHtml(record.versionNo) + '</em></div>' +
        '<button class="btn btn-primary" type="button" data-dsd-action="back-versions"><i class="bi bi-arrow-left"></i><span>返回</span></button>' +
      '</div>' +
      '<div class="dsd-edit-scroll">' +
        '<section class="dsd-version-detail-meta"><div><span>版本状态</span>' + renderVersionStatus(record.status) + '</div><div><span>版本来源</span><strong>' + escapeHtml(record.source) + '</strong></div><div><span>基于版本</span><strong>' + escapeHtml(record.baseVersion || '--') + '</strong></div><div><span>变更人</span><strong>' + escapeHtml(record.operator) + '</strong></div><div class="wide"><span>变更摘要</span><strong>' + escapeHtml(record.summary) + '</strong></div></section>' +
        renderBasicSection(record.snapshot, true) +
        (type === 'field' ? renderTechnicalSection(record.snapshot, true) : '') +
        renderBusinessSection(record.snapshot, true, type === 'field') +
      '</div>' +
    '</div>';
  }

  var versionCompareFields = [
    { key: 'code', label: '编码', section: '基本信息' },
    { key: 'englishName', label: '英文名', section: '基本信息' },
    { key: 'alias', label: '别名', section: '基本信息' },
    { key: 'meaning', label: '描述', section: '基本信息' },
    { key: 'dataType', label: '数据类型', section: '技术信息' },
    { key: 'length', label: '长度', section: '技术信息' },
    { key: 'precision', label: '精度', section: '技术信息' },
    { key: 'desensitizeRule', label: '脱敏规则', section: '技术信息' },
    { key: 'qualityRule', label: '质量规则', section: '技术信息' },
    { key: 'encryptRule', label: '加密规则', section: '技术信息' },
    { key: 'dataClass', label: '数据分类', section: '业务信息' },
    { key: 'dataLevel', label: '数据分级', section: '业务信息' }
  ];

  function renderVersionCompare(item) {
    var versionNos = Object.keys(state.versionSelected).sort(compareVersionNumbers);
    if (versionNos.length !== 2) return renderVersionHistory(item);
    var left = getVersionRecord(item, versionNos[0]);
    var right = getVersionRecord(item, versionNos[1]);
    if (!left || !right) return renderVersionHistory(item);
    var fields = versionCompareFields.filter(function (field) {
      return !state.versionOnlyDiff || String(left.snapshot[field.key] || '') !== String(right.snapshot[field.key] || '');
    });
    var lastSection = '';
    var rows = fields.map(function (field) {
      var leftValue = String(left.snapshot[field.key] || '--');
      var rightValue = String(right.snapshot[field.key] || '--');
      var changed = leftValue !== rightValue;
      var sectionCell = field.section !== lastSection ? '<span>' + escapeHtml(field.section) + '</span>' : '';
      lastSection = field.section;
      return '<tr class="' + (changed ? 'changed' : '') + '"><td>' + sectionCell + '</td><td>' + escapeHtml(field.label) + '</td><td>' + escapeHtml(leftValue) + '</td><td>' + escapeHtml(rightValue) + '</td><td>' + (changed ? '<span class="dsd-version-change-tag">已修改</span>' : '<span class="dsd-muted">无变化</span>') + '</td></tr>';
    }).join('');
    return '<div class="dsd-version-page">' +
      '<div class="dsd-edit-head"><div class="dsd-edit-title"><i class="bi bi-layout-split"></i><span>版本比较</span><em class="dsd-edit-version">' + escapeHtml(item.code) + '</em></div><button class="btn btn-primary" type="button" data-dsd-action="back-versions"><i class="bi bi-arrow-left"></i><span>返回</span></button></div>' +
      '<div class="dsd-version-compare-head"><div><span>对比版本</span><strong>' + escapeHtml(left.versionNo) + '</strong><i class="bi bi-arrow-right"></i><strong>' + escapeHtml(right.versionNo) + '</strong></div><label><input type="checkbox" data-dsd-version-only-diff' + (state.versionOnlyDiff ? ' checked' : '') + '><span>只看差异</span></label></div>' +
      '<div class="dsd-version-compare-table-wrap"><table class="dsd-version-compare-table"><thead><tr><th>信息分组</th><th>属性</th><th>' + escapeHtml(left.versionNo) + '</th><th>' + escapeHtml(right.versionNo) + '</th><th>变化</th></tr></thead><tbody>' + (rows || '<tr><td colspan="5" class="dsd-version-compare-empty">所选版本没有字段差异</td></tr>') + '</tbody></table></div>' +
    '</div>';
  }

  function renderVersionView() {
    var item = getRowById(state.versionStandardId);
    if (!item) {
      state.versionStandardId = '';
      return renderListView();
    }
    if (state.versionMode === 'detail') return renderVersionDetail(item, getVersionRecord(item, state.versionViewNo));
    if (state.versionMode === 'compare') return renderVersionCompare(item);
    return renderVersionHistory(item);
  }

  function renderIoView() {
    var rows = getIoRows();
    return '<div class="dsd-toolbar dsd-toolbar-compact">' +
      '<div class="dsd-toolbar-left"></div>' +
      '<div class="dsd-toolbar-right">' +
        '<select class="dsd-filter" data-dsd-io-filter="attr" aria-label="属性"><option value="">属性</option><option value="导入">导入</option><option value="导出">导出</option></select>' +
        '<select class="dsd-filter" data-dsd-io-filter="status" aria-label="状态"><option value="">状态</option><option value="处理中">处理中</option><option value="处理成功">处理成功</option><option value="处理失败">处理失败</option></select>' +
        '<div class="dsd-query"><input type="text" data-dsd-io-keyword value="' + escapeHtml(state.ioFilters.keyword) + '" placeholder="文件名" aria-label="文件名"><button class="btn btn-primary" type="button" data-dsd-action="query-io"><i class="bi bi-search"></i><span>查询</span></button></div>' +
      '</div>' +
    '</div>' +
    '<div class="dsd-table-wrap">' +
      '<table class="dsd-table dsd-io-table">' +
        '<colgroup><col class="dsd-io-file"><col class="dsd-io-attr"><col class="dsd-io-status"><col class="dsd-io-count"><col class="dsd-io-user"><col class="dsd-io-time"><col class="dsd-io-action"></colgroup>' +
        '<thead><tr><th>文件名</th><th>属性</th><th>状态</th><th>处理记录数(成功/失败/总量)</th><th>操作者</th><th>时间</th><th>操作</th></tr></thead>' +
        '<tbody>' + (rows.length ? rows.map(renderIoRow).join('') : '<tr class="dsd-empty-row"><td colspan="7">暂无匹配的导入导出记录</td></tr>') + '</tbody>' +
      '</table>' +
    '</div>' +
    '<div class="dsd-footnote">显示第 1 到第 ' + rows.length + ' 条记录，总共 ' + rows.length + ' 条记录</div>';
  }

  function renderIoRow(item) {
    return '<tr>' +
      '<td title="' + escapeHtml(item.fileName) + '">' + escapeHtml(item.fileName) + '</td>' +
      '<td><span class="dsd-io-attr-text">' + escapeHtml(item.attr) + '</span></td>' +
      '<td>' + renderIoStatus(item.status) + '</td>' +
      '<td><span class="dsd-success">' + item.success + '</span>/<span class="dsd-fail">' + item.fail + '</span>/' + item.total + '</td>' +
      '<td>' + escapeHtml(item.operator) + '</td>' +
      '<td>' + escapeHtml(item.time) + '</td>' +
      '<td>' + (item.status === '处理中' ? '<span class="dsd-muted">--</span>' : '<button class="dsd-action-btn danger" type="button" data-dsd-action="view-log" data-id="' + item.id + '"><i class="bi bi-file-text"></i><span>查看日志</span></button>') + '</td>' +
    '</tr>';
  }

  function renderIoStatus(status) {
    var cls = status === '处理成功' ? ' success' : (status === '处理中' ? ' running' : ' failed');
    return '<span class="dsd-io-status-text' + cls + '">' + escapeHtml(status) + '</span>';
  }

  function renderBpmStatus(status) {
    var cls = status === '已结束' ? ' completed' : (status === '审批中' || status === '审核中' ? ' process' : ' waiting');
    return '<span class="dsd-bpm-status' + cls + '">' + escapeHtml(status) + '</span>';
  }

  function renderBpmResult(result) {
    var cls = result === '通过' || result === '提交' || result === '已发布' || result === '已结束' ? ' pass' : (result === '驳回' || result === '已终止' ? ' rejected' : ' pending');
    return '<span class="dsd-bpm-result' + cls + '">' + escapeHtml(result) + '</span>';
  }

  function renderBpmApprovalType(type) {
    var meta = getApprovalTypeMeta(type);
    return '<span class="dsd-bpm-type ' + meta.key + '">' + escapeHtml(meta.label) + '</span>';
  }

  function renderBpmBusinessStatus(status) {
    var cls = status === '已废止' ? ' abolished' : (status === '已发布' ? ' completed' : (status === '待发布' || status === '待废止' ? ' pending' : ' stopped'));
    return '<span class="dsd-bpm-business ' + cls + '">' + escapeHtml(status) + '</span>';
  }

  function renderBpmConfig() {
    var enabledText = approvalConfig.enabled ? '已开启' : '已关闭';
    var description = approvalConfig.enabled
      ? '发布与废止分别进入对应BPM流程，审批通过后自动完成业务处理。'
      : '新发起的发布和废止操作直接生效；已在途工单继续执行。';
    return '<div class="dsd-bpm-config">' +
      '<div class="dsd-bpm-config-icon"><i class="bi bi-diagram-3"></i></div>' +
      '<div class="dsd-bpm-config-main"><div><h3>流程审批</h3><span class="dsd-bpm-config-state' + (approvalConfig.enabled ? ' enabled' : '') + '">' + enabledText + '</span></div><p>' + description + '</p></div>' +
      '<div class="dsd-bpm-config-flows">' +
        '<div class="dsd-bpm-config-flow"><span>发布审批</span><strong>' + escapeHtml(approvalConfig.flows.publish) + '</strong></div>' +
        '<div class="dsd-bpm-config-flow abolish"><span>废止审批</span><strong>' + escapeHtml(approvalConfig.flows.abolish) + '</strong></div>' +
      '</div>' +
      '<label class="dsd-bpm-switch"><input type="checkbox" data-dsd-approval-switch' + (approvalConfig.enabled ? ' checked' : '') + ' aria-label="流程审批开关"><span></span></label>' +
    '</div>';
  }

  function renderBpmToolbar() {
    return '<div class="dsd-toolbar dsd-bpm-toolbar">' +
      '<div class="dsd-toolbar-left"><span class="dsd-bpm-list-title"><i class="bi bi-list-check"></i>审批工单</span></div>' +
      '<div class="dsd-toolbar-right">' +
        '<select class="dsd-filter dsd-bpm-filter" data-dsd-bpm-filter="type" aria-label="审批类型"><option value="">审批类型</option><option value="publish">发布审批</option><option value="abolish">废止审批</option></select>' +
        '<select class="dsd-filter dsd-bpm-filter" data-dsd-bpm-filter="status" aria-label="审核状态"><option value="">审核状态</option><option value="审核中">审核中</option><option value="审批中">审批中</option><option value="已结束">已结束</option></select>' +
        '<select class="dsd-filter dsd-bpm-filter" data-dsd-bpm-filter="result" aria-label="审核结果"><option value="">审核结果</option><option value="待定">待定</option><option value="通过">通过</option><option value="驳回">驳回</option></select>' +
        '<div class="dsd-query dsd-bpm-query"><input type="text" data-dsd-bpm-keyword value="' + escapeHtml(state.bpmFilters.keyword) + '" placeholder="工单编号/文件名称/发起人" aria-label="工单编号文件名称发起人"><button class="btn btn-primary" type="button" data-dsd-action="query-bpm"><i class="bi bi-search"></i><span>查询</span></button></div>' +
      '</div>' +
    '</div>';
  }

  function renderBpmRow(item) {
    return '<tr>' +
      '<td title="' + escapeHtml(item.id) + '">' + escapeHtml(item.id) + '</td>' +
      '<td>' + renderBpmApprovalType(item.approvalType) + '</td>' +
      '<td><div class="dsd-bpm-file"><i class="bi bi-file-earmark-spreadsheet"></i><span><b title="' + escapeHtml(item.fileName) + '">' + escapeHtml(item.fileName) + '</b></span></div></td>' +
      '<td class="dsd-bpm-count">' + item.standards.length + '</td>' +
      '<td title="' + escapeHtml(item.flowName) + '">' + escapeHtml(item.flowName) + '</td>' +
      '<td><div class="dsd-bpm-applicant"><b>' + escapeHtml(item.applicant) + '</b><small>' + escapeHtml(item.applyTime) + '</small></div></td>' +
      '<td>' + escapeHtml(item.currentNode) + '</td>' +
      '<td>' + renderBpmStatus(item.auditStatus) + '</td>' +
      '<td>' + renderBpmResult(item.auditResult) + '</td>' +
      '<td>' + renderBpmBusinessStatus(item.businessStatus) + '</td>' +
      '<td><button class="dsd-action-btn" type="button" data-dsd-action="view-bpm" data-order-id="' + escapeHtml(item.id) + '"><i class="bi bi-eye"></i><span>查看</span></button></td>' +
    '</tr>';
  }

  function renderBpmPager(total) {
    var totalPages = Math.max(1, Math.ceil(total / state.bpmPageSize));
    var start = total ? (state.bpmPage - 1) * state.bpmPageSize + 1 : 0;
    var end = Math.min(state.bpmPage * state.bpmPageSize, total);
    var pageButtons = '';
    for (var i = 1; i <= totalPages; i++) {
      pageButtons += '<button class="dsd-page-num' + (i === state.bpmPage ? ' active' : '') + '" type="button" data-dsd-bpm-page="' + i + '">' + i + '</button>';
    }
    return '<div class="dsd-pagination">' +
      '<div class="dsd-page-info">显示第 ' + start + ' 到第 ' + end + ' 条记录，总共 ' + total + ' 条记录&nbsp;&nbsp;每页显示' +
        '<select class="dsd-page-size" data-dsd-bpm-page-size aria-label="每页显示条数">' +
          '<option value="10"' + (state.bpmPageSize === 10 ? ' selected' : '') + '>10</option>' +
          '<option value="20"' + (state.bpmPageSize === 20 ? ' selected' : '') + '>20</option>' +
          '<option value="50"' + (state.bpmPageSize === 50 ? ' selected' : '') + '>50</option>' +
        '</select>条记录</div>' +
      '<div class="dsd-page-nav">' +
        '<button class="dsd-page-btn" type="button" data-dsd-bpm-page="prev"' + (state.bpmPage === 1 ? ' disabled' : '') + '><i class="bi bi-chevron-left"></i></button>' +
        pageButtons +
        '<button class="dsd-page-btn" type="button" data-dsd-bpm-page="next"' + (state.bpmPage === totalPages ? ' disabled' : '') + '><i class="bi bi-chevron-right"></i></button>' +
      '</div>' +
    '</div>';
  }

  function renderBpmList() {
    var rows = getFilteredApprovalOrders();
    var visibleRows = getVisibleApprovalOrders();
    return renderBpmConfig() + renderBpmToolbar() +
      '<div class="dsd-table-wrap dsd-bpm-table-wrap">' +
        '<table class="dsd-table dsd-bpm-table">' +
          '<colgroup><col class="dsd-bpm-w-id"><col class="dsd-bpm-w-type"><col class="dsd-bpm-w-file"><col class="dsd-bpm-w-count"><col class="dsd-bpm-w-flow"><col class="dsd-bpm-w-applicant"><col class="dsd-bpm-w-node"><col class="dsd-bpm-w-status"><col class="dsd-bpm-w-result"><col class="dsd-bpm-w-business"><col class="dsd-bpm-w-action"></colgroup>' +
          '<thead><tr><th>工单编号</th><th>审批类型</th><th>标准文件</th><th>标准数量</th><th>BPM流程</th><th>发起人 / 发起时间</th><th>当前节点</th><th>审核状态</th><th>审核结果</th><th>业务处理状态</th><th>操作</th></tr></thead>' +
          '<tbody>' + (visibleRows.length ? visibleRows.map(renderBpmRow).join('') : '<tr class="dsd-empty-row"><td colspan="11">暂无匹配的BPM审批工单</td></tr>') + '</tbody>' +
        '</table>' +
      '</div>' +
      renderBpmPager(rows.length);
  }

  function getFilteredBpmStandards(item) {
    var keyword = state.bpmStandardFilters.keyword.trim().toLowerCase();
    return item.standards.filter(function (standard) {
      if (!keyword) return true;
      return [standard.code, standard.englishName, standard.alias, standard.meaning].join(' ').toLowerCase().indexOf(keyword) >= 0;
    });
  }

  function getVisibleBpmStandards(item) {
    var rows = getFilteredBpmStandards(item);
    var totalPages = Math.max(1, Math.ceil(rows.length / state.bpmStandardPageSize));
    if (state.bpmStandardPage > totalPages) state.bpmStandardPage = totalPages;
    var start = (state.bpmStandardPage - 1) * state.bpmStandardPageSize;
    return rows.slice(start, start + state.bpmStandardPageSize);
  }

  function renderBpmStandardPager(total) {
    var totalPages = Math.max(1, Math.ceil(total / state.bpmStandardPageSize));
    var start = total ? (state.bpmStandardPage - 1) * state.bpmStandardPageSize + 1 : 0;
    var end = Math.min(state.bpmStandardPage * state.bpmStandardPageSize, total);
    var buttons = '';
    for (var i = 1; i <= totalPages; i++) {
      buttons += '<button class="dsd-page-num' + (i === state.bpmStandardPage ? ' active' : '') + '" type="button" data-dsd-bpm-standard-page="' + i + '">' + i + '</button>';
    }
    return '<div class="dsd-pagination dsd-bpm-standard-pagination">' +
      '<div class="dsd-page-info">显示第 ' + start + ' 到第 ' + end + ' 条记录，总共 ' + total + ' 条记录&nbsp;&nbsp;每页显示' +
        '<select class="dsd-page-size" data-dsd-bpm-standard-page-size aria-label="标准文件每页显示条数">' +
          '<option value="5"' + (state.bpmStandardPageSize === 5 ? ' selected' : '') + '>5</option>' +
          '<option value="10"' + (state.bpmStandardPageSize === 10 ? ' selected' : '') + '>10</option>' +
          '<option value="20"' + (state.bpmStandardPageSize === 20 ? ' selected' : '') + '>20</option>' +
        '</select>条记录</div>' +
      '<div class="dsd-page-nav">' +
        '<button class="dsd-page-btn" type="button" data-dsd-bpm-standard-page="prev"' + (state.bpmStandardPage === 1 ? ' disabled' : '') + '><i class="bi bi-chevron-left"></i></button>' +
        buttons +
        '<button class="dsd-page-btn" type="button" data-dsd-bpm-standard-page="next"' + (state.bpmStandardPage === totalPages ? ' disabled' : '') + '><i class="bi bi-chevron-right"></i></button>' +
      '</div>' +
    '</div>';
  }

  function renderBpmStandardFile(item) {
    var rows = getFilteredBpmStandards(item);
    var visibleRows = getVisibleBpmStandards(item);
    return '<section class="dsd-bpm-detail-section">' +
      '<div class="dsd-bpm-section-head"><h3><i class="bi bi-file-earmark-spreadsheet"></i>标准文件</h3><div><strong>' + escapeHtml(item.fileName) + '</strong><span>共 ' + item.standards.length + ' 项标准</span></div></div>' +
      '<div class="dsd-bpm-standard-toolbar">' +
        '<div class="dsd-query dsd-bpm-standard-query"><input type="text" data-dsd-bpm-standard-keyword value="' + escapeHtml(state.bpmStandardFilters.keyword) + '" placeholder="标准编码/英文名称/别名" aria-label="标准编码英文名称别名"><button class="btn btn-primary" type="button" data-dsd-action="query-bpm-standard"><i class="bi bi-search"></i><span>查询</span></button></div>' +
      '</div>' +
      '<div class="dsd-bpm-detail-table-wrap"><table class="dsd-bpm-detail-table dsd-bpm-standard-table"><thead><tr><th>标准编码</th><th>英文名称</th><th>别名</th><th>对象</th><th>元模型</th><th>当前版本</th><th>目标版本</th><th>含义说明</th><th>操作</th></tr></thead><tbody>' + (visibleRows.length ? visibleRows.map(function (standard) {
        return '<tr><td>' + escapeHtml(standard.code) + '</td><td>' + escapeHtml(standard.englishName) + '</td><td>' + escapeHtml(standard.alias) + '</td><td>' + escapeHtml(standard.objectType) + '</td><td>' + escapeHtml(standard.metaModel) + '</td><td>' + escapeHtml(standard.currentVersion || '--') + '</td><td><strong class="dsd-target-version">' + escapeHtml(standard.targetVersion || standard.currentVersion || '--') + '</strong></td><td title="' + escapeHtml(standard.meaning) + '">' + escapeHtml(standard.meaning) + '</td><td><button class="dsd-action-btn" type="button" data-dsd-action="view-bpm-standard" data-order-id="' + escapeHtml(item.id) + '" data-standard-code="' + escapeHtml(standard.code) + '"><i class="bi bi-eye"></i><span>查看</span></button></td></tr>';
      }).join('') : '<tr><td colspan="9" class="dsd-bpm-standard-empty">暂无匹配的数据标准</td></tr>') + '</tbody></table></div>' +
      renderBpmStandardPager(rows.length) +
    '</section>';
  }

  function renderBpmNodeStatus(status) {
    var labels = { done: '已完成', current: '办理中', rejected: '已驳回', pending: '待处理', terminated: '已终止' };
    return '<span class="dsd-bpm-node-status ' + status + '">' + (labels[status] || '待处理') + '</span>';
  }

  function getBpmProcessRecords(item) {
    return item.timeline.map(function (node) {
      var record = item.records.filter(function (entry) {
        return entry.node === node.name;
      })[0];
      return {
        node: node.name,
        reviewer: record ? record.reviewer : node.actor,
        nodeStatus: node.status,
        result: record ? record.result : '待定',
        opinion: record ? record.opinion : (node.status === 'current' ? '等待当前节点办理。' : '尚未进入该节点。'),
        time: record ? record.time : node.time
      };
    });
  }

  function renderBpmDetail(item) {
    if (!item) return '<div class="dsd-log-empty"><button class="btn btn-outline" type="button" data-dsd-action="back-bpm"><i class="bi bi-arrow-left"></i><span>返回</span></button><span>未找到审批工单</span></div>';
    var meta = getApprovalTypeMeta(item.approvalType);
    return '<div class="dsd-bpm-detail">' +
      '<div class="dsd-edit-head">' +
        '<div class="dsd-bpm-detail-title"><div class="dsd-edit-title"><i class="bi bi-clipboard-check"></i><span>审批工单详情</span></div><div>' + renderBpmApprovalType(item.approvalType) + renderBpmStatus(item.auditStatus) + renderBpmResult(item.auditResult) + '</div></div>' +
        '<button class="btn btn-primary" type="button" data-dsd-action="back-bpm"><i class="bi bi-arrow-left"></i><span>返回</span></button>' +
      '</div>' +
      '<div class="dsd-bpm-detail-scroll">' +
        '<section class="dsd-bpm-detail-section">' +
          '<h3><i class="bi bi-info-circle"></i>基本信息</h3>' +
          '<div class="dsd-bpm-info-grid">' +
            '<div><span>工单编号</span><strong>' + escapeHtml(item.id) + '</strong></div>' +
            '<div><span>审批类型</span><strong>' + escapeHtml(meta.label) + '</strong></div>' +
            '<div><span>标准文件编号</span><strong>' + escapeHtml(item.fileNo) + '</strong></div>' +
            '<div><span>BPM流程</span><strong>' + escapeHtml(item.flowName) + '</strong></div>' +
            '<div><span>当前节点</span><strong>' + escapeHtml(item.currentNode) + '</strong></div>' +
            '<div><span>发起人</span><strong>' + escapeHtml(item.applicant) + '</strong></div>' +
            '<div><span>发起时间</span><strong>' + escapeHtml(item.applyTime) + '</strong></div>' +
            '<div><span>标准数量</span><strong>' + item.standards.length + '</strong></div>' +
            '<div><span>' + meta.actionLabel + '时间</span><strong>' + escapeHtml(item.effectiveTime) + '</strong></div>' +
            '<div><span>业务处理状态</span><strong>' + renderBpmBusinessStatus(item.businessStatus) + '</strong></div>' +
            '<div class="wide-half"><span>' + meta.actionLabel + (meta.key === 'abolish' ? '原因' : '说明') + '</span><strong>' + escapeHtml(item.reason || '--') + '</strong></div>' +
          '</div>' +
        '</section>' +
        renderBpmStandardFile(item) +
        '<section class="dsd-bpm-detail-section dsd-bpm-detail-section-last"><h3><i class="bi bi-clipboard-check"></i>审批记录</h3>' +
          '<div class="dsd-bpm-detail-table-wrap"><table class="dsd-bpm-detail-table dsd-bpm-record-table"><thead><tr><th>审批节点</th><th>办理人</th><th>节点状态</th><th>审批结果</th><th>审批意见</th><th>操作时间</th></tr></thead><tbody>' + getBpmProcessRecords(item).map(function (record) {
            return '<tr><td>' + escapeHtml(record.node) + '</td><td>' + escapeHtml(record.reviewer) + '</td><td>' + renderBpmNodeStatus(record.nodeStatus) + '</td><td>' + renderBpmResult(record.result) + '</td><td title="' + escapeHtml(record.opinion) + '">' + escapeHtml(record.opinion) + '</td><td>' + escapeHtml(record.time) + '</td></tr>';
          }).join('') + '</tbody></table></div>' +
        '</section>' +
      '</div>' +
    '</div>';
  }

  function renderBpmStandardDetailPage() {
    var detail = state.bpmStandardDetail;
    var order = detail && getApprovalOrderById(detail.orderId);
    var standard = order && order.standards.filter(function (item) {
      return item.code === detail.standardCode;
    })[0];
    if (!standard) {
      return '<div class="dsd-log-empty"><button class="btn btn-outline" type="button" data-dsd-action="back-bpm-order"><i class="bi bi-arrow-left"></i><span>返回</span></button><span>未找到标准详情</span></div>';
    }
    var type = getTypeFromRow(standard);
    return '<div class="dsd-edit-page" data-dsd-form="view">' +
      '<div class="dsd-edit-head">' +
        '<div class="dsd-edit-title"><i class="bi bi-list"></i><span>查看</span></div>' +
        '<button class="btn btn-primary" type="button" data-dsd-action="back-bpm-order"><i class="bi bi-arrow-left"></i><span>返回</span></button>' +
      '</div>' +
      '<div class="dsd-edit-scroll">' +
        renderBasicSection(standard, true) +
        (type === 'field' ? renderTechnicalSection(standard, true) : '') +
        renderBusinessSection(standard, true, type === 'field') +
      '</div>' +
    '</div>';
  }

  function renderBpmView() {
    if (state.bpmStandardDetail) return renderBpmStandardDetailPage();
    return state.bpmDetailId ? renderBpmDetail(getApprovalOrderById(state.bpmDetailId)) : renderBpmList();
  }

  function buildLogText(item) {
    var flowId = 'standard-' + String(item.id).padStart(4, '0') + '-20260617';
    var prefix = '17-06-2026 ' + item.time.slice(11) + ' CST data-standard-flow-' + flowId + ' INFO - ';
    var lines = [
      prefix + 'Starting job data-standard-flow-' + flowId,
      prefix + 'effective user is standard_admin',
      prefix + 'DataStandardTask - begin ' + (item.attr === '导出' ? 'export' : 'import') + ' file: /data/upload/standard/' + item.fileName,
      prefix + 'DataStandardTask - template columns: code,english_name,alias,object_type,meta_model,meaning,publish_status,audit_status',
      prefix + 'DataStandardTask - total rows parsed: ' + item.total,
      prefix + 'HiveWriter$Task - begin do write...',
      prefix + 'HiveWriter$Task - write to table: governance.dim_data_standard',
      prefix + 'StandAloneJobContainerCommunicator - total ' + item.total + ' records, success ' + item.success + ' records, failed ' + item.fail + ' records'
    ];
    if (item.status === '处理失败') {
      lines.push(prefix + 'WARN - export file generated with validation warnings.');
      lines.push(prefix + 'ERROR - row 7 field code order_00000012 spelling CRETAE_TIME needs manual confirmation.');
      lines.push(prefix + 'DataStandardTask - job finished with validation errors.');
    } else if (item.status === '处理中') {
      lines.push(prefix + 'DataStandardTask - task is still running, waiting for worker heartbeat.');
    } else {
      lines.push(prefix + 'DataStandardTask - commit standard changes success.');
      lines.push(prefix + 'DataStandardTask - job finished successfully.');
    }
    return lines.join('\n');
  }

  function renderLogView() {
    var item = getIoById(state.logId);
    if (!item) {
      return '<div class="dsd-log-empty"><button class="btn btn-outline" type="button" data-dsd-action="back-io"><i class="bi bi-arrow-left"></i><span>返回</span></button><span>未找到日志记录</span></div>';
    }
    return '<div class="dsd-log-view">' +
      '<div class="dsd-log-header">' +
        '<button class="btn btn-outline" type="button" data-dsd-action="back-io"><i class="bi bi-arrow-left"></i><span>返回</span></button>' +
        '<div><h3>任务处理日志</h3><p title="' + escapeHtml(item.fileName) + '">' + escapeHtml(item.fileName) + '</p></div>' +
      '</div>' +
      '<pre class="dsd-tech-log">' + escapeHtml(buildLogText(item)) + '</pre>' +
    '</div>';
  }

  function syncFilterControls() {
    Object.keys(state.filters).forEach(function (key) {
      var filter = pageEl.querySelector('[data-dsd-filter="' + key + '"]');
      if (filter) filter.value = state.filters[key];
    });
    Object.keys(state.ioFilters).forEach(function (key) {
      var filter = pageEl.querySelector('[data-dsd-io-filter="' + key + '"]');
      if (filter) filter.value = state.ioFilters[key];
    });
    Object.keys(state.bpmFilters).forEach(function (key) {
      var filter = pageEl.querySelector('[data-dsd-bpm-filter="' + key + '"]');
      if (filter) filter.value = state.bpmFilters[key];
    });
    Object.keys(state.versionFilters).forEach(function (key) {
      var filter = pageEl.querySelector('[data-dsd-version-filter="' + key + '"]');
      if (filter) filter.value = state.versionFilters[key];
    });
  }

  function updateCheckAll() {
    var checkAll = pageEl.querySelector('[data-dsd-check-all]');
    if (!checkAll) return;
    var visibleRows = getVisibleRows().filter(function (item) { return !isInApproval(item); });
    var checked = visibleRows.filter(function (item) { return state.selectedIds[item.id]; }).length;
    checkAll.checked = visibleRows.length > 0 && checked === visibleRows.length;
    checkAll.indeterminate = checked > 0 && checked < visibleRows.length;
  }

  function updateSortButtons() {
    pageEl.querySelectorAll('[data-dsd-sort]').forEach(function (button) {
      var key = button.getAttribute('data-dsd-sort');
      if (key === state.sortKey) button.setAttribute('data-sort-dir', state.sortDir);
      else button.removeAttribute('data-sort-dir');
    });
  }

  function closeCombos(except) {
    pageEl.querySelectorAll('[data-dsd-combo].open').forEach(function (combo) {
      if (combo !== except) combo.classList.remove('open');
    });
  }

  function filterCombo(combo, keyword) {
    keyword = keyword.trim().toLowerCase();
    combo.querySelectorAll('[data-dsd-combo-option]').forEach(function (option) {
      option.style.display = !keyword || option.textContent.toLowerCase().indexOf(keyword) >= 0 ? '' : 'none';
    });
  }

  function selectComboValue(combo, value) {
    var input = combo.querySelector('[data-dsd-edit]');
    var text = combo.querySelector('[data-dsd-combo-text]');
    if (input) input.value = value;
    if (text) text.textContent = value || '请选择';
    combo.querySelectorAll('.active').forEach(function (item) { item.classList.remove('active'); });
    combo.querySelectorAll('[data-value]').forEach(function (item) {
      if (item.getAttribute('data-value') === value) item.classList.add('active');
    });
    combo.classList.remove('open');
  }

  function closeModal() {
    var modal = pageEl.querySelector('[data-dsd-modal]');
    if (modal) {
      if (modal.getAttribute('data-dsd-modal') === 'approval') state.pendingApproval = null;
      if (modal.getAttribute('data-dsd-modal') === 'version-rollback') state.pendingRollback = null;
      modal.remove();
    }
  }

  function openVersionRollbackModal(rowId, versionNo) {
    var item = getRowById(rowId);
    var target = item ? getVersionRecord(item, versionNo) : null;
    if (!item || !target || target.status === '当前版本' || target.status === '变更草稿' || target.status === '审批中') {
      showToast('未找到可回滚的历史版本');
      return;
    }
    if (item.publishStatus !== '已发布' || item.versionDraft || isInApproval(item)) {
      showToast('当前标准存在变更草稿或在途审批，暂不能发起回滚');
      return;
    }
    closeModal();
    state.pendingRollback = {
      rowId: item.id,
      targetVersion: target.versionNo,
      newVersion: getNextVersion(item.currentVersion)
    };
    var modal = document.createElement('div');
    modal.className = 'dsd-modal-mask';
    modal.setAttribute('data-dsd-modal', 'version-rollback');
    modal.innerHTML =
      '<div class="dsd-modal dsd-version-rollback-modal" role="dialog" aria-modal="true" aria-label="版本回滚">' +
        '<div class="dsd-modal-header"><h3>版本回滚</h3><button class="dsd-modal-close" type="button" data-dsd-action="close-modal" aria-label="关闭"><i class="bi bi-x-lg"></i></button></div>' +
        '<div class="dsd-version-rollback-body">' +
          '<div class="dsd-approval-note"><i class="bi bi-info-circle-fill"></i><span>回滚不会覆盖历史记录，系统将以目标版本内容生成新的变更草稿，完成发布审批后生效。</span></div>' +
          '<div class="dsd-version-rollback-grid">' +
            '<label><span>当前生效版本</span><input type="text" value="' + escapeHtml(item.currentVersion) + '" disabled></label>' +
            '<label><span>回滚目标版本</span><input type="text" value="' + escapeHtml(target.versionNo) + '" disabled></label>' +
            '<label class="wide"><span>新版本号</span><input type="text" value="' + escapeHtml(state.pendingRollback.newVersion) + '" disabled></label>' +
            '<label class="wide"><span><em>*</em>回滚原因</span><textarea data-dsd-rollback-reason maxlength="200" placeholder="请输入回滚原因，便于后续审计追溯"></textarea></label>' +
          '</div>' +
        '</div>' +
        '<div class="dsd-modal-footer"><button class="btn btn-primary" type="button" data-dsd-action="confirm-version-rollback"><i class="bi bi-arrow-counterclockwise"></i><span>生成回滚草稿</span></button><button class="btn btn-outline" type="button" data-dsd-action="close-modal"><i class="bi bi-x-lg"></i><span>取消</span></button></div>' +
      '</div>';
    pageEl.appendChild(modal);
  }

  function confirmVersionRollback() {
    if (!state.pendingRollback) return;
    var item = getRowById(state.pendingRollback.rowId);
    var target = item ? getVersionRecord(item, state.pendingRollback.targetVersion) : null;
    var reasonInput = pageEl.querySelector('[data-dsd-rollback-reason]');
    var reason = reasonInput ? reasonInput.value.trim() : '';
    if (!reason) {
      showToast('请填写回滚原因');
      if (reasonInput) reasonInput.focus();
      return;
    }
    if (!item || !target || item.publishStatus !== '已发布' || item.versionDraft || isInApproval(item)) {
      closeModal();
      showToast('标准状态已变化，暂不能生成回滚草稿');
      return;
    }
    item.versionDraft = {
      versionNo: getNextVersion(item.currentVersion),
      status: '变更草稿',
      source: '版本回滚',
      baseVersion: item.currentVersion,
      sourceVersion: target.versionNo,
      summary: reason,
      operator: '张晨',
      changeTime: getDateParts().time,
      approvalOrderId: '',
      snapshot: snapshotStandardFields(target.snapshot)
    };
    item.auditStatus = '变更草稿';
    state.pendingRollback = null;
    closeModal();
    state.versionMode = 'list';
    state.versionSelected = {};
    updateContent();
    showToast('回滚草稿已生成，请确认后发起发布审批');
  }

  function openImportModal() {
    closeModal();
    var modal = document.createElement('div');
    modal.className = 'dsd-modal-mask';
    modal.setAttribute('data-dsd-modal', 'import');
    modal.innerHTML =
      '<div class="dsd-modal dsd-import-modal" role="dialog" aria-modal="true" aria-label="导入">' +
        '<div class="dsd-modal-header"><h3>导入</h3><button class="dsd-modal-close" type="button" data-dsd-action="close-modal" aria-label="关闭"><i class="bi bi-x-lg"></i></button></div>' +
        '<div class="dsd-modal-body">' +
          '<div class="dsd-import-note">' +
            '<div><i class="bi bi-info-circle-fill"></i><span>请先导出数据，作为模板或者 <a href="javascript:;" data-dsd-action="download-template">下载空模板</a> 再导入；请勿修改模板结构</span></div>' +
            '<div><i class="bi bi-info-circle-fill"></i><span>数据导入为异步处理，请稍后在导入导出查看处理结果</span></div>' +
          '</div>' +
          '<label class="dsd-modal-row"><span><em>*</em>覆盖机制</span><select><option>重复覆盖</option><option>有值跳过</option></select></label>' +
          '<label class="dsd-modal-row"><span><em>*</em>上传文件</span><div class="dsd-file-box"><button class="dsd-file-picker" type="button" data-dsd-action="choose-file">选择文件</button><span class="dsd-file-name">未选择任何文件</span><button class="dsd-upload-link" type="button" data-dsd-action="mock-upload"><i class="bi bi-upload"></i><span>上传</span></button><strong><i class="bi bi-info-circle-fill"></i> 文件格式为excel，大小不超过50M</strong></div></label>' +
        '</div>' +
        '<div class="dsd-modal-footer"><button class="btn btn-primary" type="button" data-dsd-action="save-import"><i class="bi bi-check-lg"></i><span>确定</span></button><button class="btn btn-outline" type="button" data-dsd-action="close-modal"><i class="bi bi-x-lg"></i><span>取消</span></button></div>' +
      '</div>';
    pageEl.appendChild(modal);
  }

  function padNumber(value) {
    return String(value).padStart(2, '0');
  }

  function getDateParts() {
    var now = new Date();
    var compact = now.getFullYear() + padNumber(now.getMonth() + 1) + padNumber(now.getDate());
    var time = now.getFullYear() + '-' + padNumber(now.getMonth() + 1) + '-' + padNumber(now.getDate()) + ' ' + padNumber(now.getHours()) + ':' + padNumber(now.getMinutes()) + ':' + padNumber(now.getSeconds());
    return { compact: compact, time: time };
  }

  function isInApproval(item) {
    return !!(item && (item.currentApprovalOrderId || item.auditStatus === '审核中' || item.auditStatus === '审批中' || item.auditStatus.indexOf('审批中') >= 0));
  }

  function isApprovalEligible(item, type) {
    if (!item || isInApproval(item)) return false;
    if (type === 'abolish') return item.publishStatus === '已发布' && !item.versionDraft;
    return item.publishStatus === '编制' || (item.publishStatus === '已发布' && !!item.versionDraft);
  }

  function getApprovalVersionInfo(item, type) {
    if (type === 'abolish') {
      return { currentVersion: item.currentVersion || '--', targetVersion: item.currentVersion || '--', source: '标准废止' };
    }
    if (item.versionDraft) {
      return { currentVersion: item.currentVersion || '--', targetVersion: item.versionDraft.versionNo, source: item.versionDraft.source };
    }
    return { currentVersion: item.currentVersion || '--', targetVersion: 'V1.0', source: '初始发布' };
  }

  function snapshotForApproval(item, type) {
    var versionInfo = getApprovalVersionInfo(item, type);
    var snapshot = snapshotStandardFields(type === 'publish' && item.versionDraft ? item.versionDraft.snapshot : item);
    snapshot.id = item.id;
    snapshot.currentVersion = versionInfo.currentVersion;
    snapshot.targetVersion = versionInfo.targetVersion;
    snapshot.versionSource = versionInfo.source;
    return snapshot;
  }

  function openApprovalModal(rows, type) {
    var meta = getApprovalTypeMeta(type);
    if (!approvalConfig.enabled) {
      showToast('流程审批已关闭，请使用' + meta.actionLabel + '操作');
      return;
    }
    rows = rows.filter(function (item) { return isApprovalEligible(item, meta.key); });
    if (!rows.length) {
      showToast(meta.key === 'abolish'
        ? '废止审批只能选择“已发布”、无变更草稿且未处于审批中的数据标准'
        : '发布审批只能选择“编制”或已有变更草稿且未处于审批中的数据标准');
      return;
    }
    closeModal();
    var date = getDateParts();
    var serial = String(approvalOrders.length + 1).padStart(3, '0');
    state.pendingApproval = {
      type: meta.key,
      rowIds: rows.map(function (item) { return item.id; }),
      orderId: 'BPM-DS-' + date.compact + '-' + serial,
      fileNo: 'DSF-' + date.compact + '-' + serial,
      fileName: meta.fileNamePrefix + date.compact + '-' + serial + '.xlsx'
    };
    var modal = document.createElement('div');
    modal.className = 'dsd-modal-mask';
    modal.setAttribute('data-dsd-modal', 'approval');
    modal.innerHTML =
      '<div class="dsd-modal dsd-approval-modal" role="dialog" aria-modal="true" aria-label="发起' + meta.label + '">' +
        '<div class="dsd-modal-header"><h3>发起' + meta.label + '</h3><button class="dsd-modal-close" type="button" data-dsd-action="close-modal" aria-label="关闭"><i class="bi bi-x-lg"></i></button></div>' +
        '<div class="dsd-approval-modal-body">' +
          '<div class="dsd-approval-note' + (meta.key === 'abolish' ? ' abolish' : '') + '"><i class="bi bi-info-circle-fill"></i><span>所选标准将生成' + meta.actionLabel + '文件快照。审批期间不可重复发起，BPM审批通过后由平台自动' + meta.actionLabel + (meta.key === 'abolish' ? '；审批期间标准继续有效。' : '。') + '</span></div>' +
          '<div class="dsd-approval-form-grid">' +
            '<label><span>标准文件编号</span><input type="text" value="' + escapeHtml(state.pendingApproval.fileNo) + '" disabled></label>' +
            '<label><span>BPM流程</span><input type="text" value="' + escapeHtml(meta.flowName) + '" disabled></label>' +
            '<label class="wide"><span>标准文件名称</span><input type="text" value="' + escapeHtml(state.pendingApproval.fileName) + '" disabled></label>' +
            '<label class="wide"><span>' + (meta.key === 'abolish' ? '<em>*</em>废止原因' : '发布说明') + '</span><textarea data-dsd-approval-reason maxlength="200" placeholder="请输入本次标准' + meta.actionLabel + (meta.key === 'abolish' ? '原因' : '说明（选填）') + '"></textarea></label>' +
          '</div>' +
          '<div class="dsd-approval-file-head"><div><i class="bi bi-file-earmark-spreadsheet"></i><span><strong>' + escapeHtml(state.pendingApproval.fileName) + '</strong><small>共 ' + rows.length + ' 项标准</small></span></div><em>已生成</em></div>' +
          '<div class="dsd-approval-table-wrap"><table class="dsd-approval-table"><thead><tr><th>标准编码</th><th>英文名称</th><th>别名</th><th>对象</th><th>元模型</th><th>当前版本</th><th>目标版本</th></tr></thead><tbody>' + rows.map(function (item) {
            var versionInfo = getApprovalVersionInfo(item, meta.key);
            return '<tr><td>' + escapeHtml(item.code) + '</td><td>' + escapeHtml(item.englishName) + '</td><td>' + escapeHtml(item.alias) + '</td><td>' + escapeHtml(item.objectType) + '</td><td>' + escapeHtml(item.metaModel) + '</td><td>' + escapeHtml(versionInfo.currentVersion) + '</td><td><strong class="dsd-target-version">' + escapeHtml(versionInfo.targetVersion) + '</strong></td></tr>';
          }).join('') + '</tbody></table></div>' +
        '</div>' +
        '<div class="dsd-modal-footer"><button class="btn ' + (meta.key === 'abolish' ? 'btn-danger' : 'btn-primary') + '" type="button" data-dsd-action="confirm-submit-approval"><i class="bi bi-send-check"></i><span>提交' + meta.label + '</span></button><button class="btn btn-outline" type="button" data-dsd-action="close-modal"><i class="bi bi-x-lg"></i><span>取消</span></button></div>' +
      '</div>';
    pageEl.appendChild(modal);
  }

  function submitApproval() {
    if (!state.pendingApproval) return;
    var meta = getApprovalTypeMeta(state.pendingApproval.type);
    var rows = state.pendingApproval.rowIds.map(getRowById).filter(Boolean);
    if (!rows.length || rows.some(function (item) { return !isApprovalEligible(item, meta.key); })) {
      closeModal();
      state.pendingApproval = null;
      showToast('标准状态已变化，请重新选择后提交');
      return;
    }
    var reasonInput = pageEl.querySelector('[data-dsd-approval-reason]');
    var reasonValue = reasonInput ? reasonInput.value.trim() : '';
    if (meta.key === 'abolish' && !reasonValue) {
      showToast('请填写废止原因');
      if (reasonInput) reasonInput.focus();
      return;
    }
    var reason = reasonValue || '申请发布所选数据标准。';
    var now = getDateParts().time;
    var order = {
      id: state.pendingApproval.orderId,
      approvalType: meta.key,
      fileNo: state.pendingApproval.fileNo,
      fileName: state.pendingApproval.fileName,
      flowName: meta.flowName,
      applicant: '张晨',
      applyTime: now,
      currentNode: '数据标准管理员',
      auditStatus: '审核中',
      auditResult: '待定',
      businessStatus: meta.pendingStatus,
      effectiveTime: '--',
      reason: reason,
      standards: rows.map(function (item) { return snapshotForApproval(item, meta.key); }),
      groupKeys: rows.reduce(function (keys, item) {
        if (keys.indexOf(item.groupKey) < 0) keys.push(item.groupKey);
        return keys;
      }, []),
      timeline: [
        { name: '开始', status: 'done', actor: '张晨', time: now, result: '已提交' },
        { name: '数据标准管理员', status: 'current', actor: '陈静', time: '--', result: '办理中' },
        { name: '数据治理负责人', status: 'pending', actor: '刘志远', time: '--', result: '待处理' },
        { name: '结束', status: 'pending', actor: '系统', time: '--', result: '待处理' }
      ],
      records: [
        { node: '开始', reviewer: '张晨', result: '提交', opinion: reason, time: now }
      ]
    };
    approvalOrders.unshift(order);
    rows.forEach(function (item) {
      item.auditStatus = meta.label + '中';
      item.approvalOrderId = order.id;
      item.currentApprovalOrderId = order.id;
      item.currentApprovalType = meta.key;
      item.approvalOrderIds = item.approvalOrderIds || [];
      item.approvalOrderIds.push(order.id);
      if (meta.key === 'publish' && item.versionDraft) {
        item.versionDraft.status = '审批中';
        item.versionDraft.approvalOrderId = order.id;
      }
    });
    state.selectedIds = {};
    state.pendingApproval = null;
    state.activeTab = 'bpm';
    state.versionStandardId = '';
    state.versionMode = 'list';
    state.versionSelected = {};
    state.bpmDetailId = '';
    state.bpmStandardDetail = null;
    state.bpmFilters = { type: '', status: '', result: '', keyword: '' };
    state.bpmPage = 1;
    closeModal();
    updateContent();
    showToast(meta.actionLabel + '文件已生成并提交BPM审批');
  }

  function selectedOrWarn(actionText) {
    var selected = getSelectedRows();
    if (!selected.length) {
      showToast('请先选择需要' + actionText + '的数据标准');
      return null;
    }
    return selected;
  }

  function activateVersion(item, approvalOrderId) {
    var draft = item.versionDraft;
    var versionNo = draft ? draft.versionNo : (item.currentVersion === '--' ? 'V1.0' : getNextVersion(item.currentVersion));
    var source = draft ? draft.source : '初始发布';
    var snapshot = snapshotStandardFields(draft ? draft.snapshot : item);
    (item.versions || []).forEach(function (record) {
      if (record.status === '当前版本') record.status = '历史版本';
    });
    var now = getDateParts().time;
    item.versions = item.versions || [];
    item.versions.push({
      versionNo: versionNo,
      status: '当前版本',
      source: source,
      baseVersion: draft ? draft.baseVersion : '--',
      sourceVersion: draft ? (draft.sourceVersion || '') : '',
      summary: draft ? draft.summary : '数据标准首次发布。',
      operator: draft ? draft.operator : '张晨',
      changeTime: draft ? draft.changeTime : now,
      publisher: '张晨',
      publishTime: now,
      approvalOrderId: approvalOrderId || '',
      snapshot: snapshot
    });
    applyStandardSnapshot(item, snapshot);
    item.currentVersion = versionNo;
    item.versionDraft = null;
    item.publishStatus = '已发布';
  }

  function publishRows(rows, auditStatus) {
    rows.forEach(function (item) {
      activateVersion(item, '');
      item.auditStatus = auditStatus || '免审发布';
      item.currentApprovalOrderId = '';
      item.currentApprovalType = '';
    });
    state.selectedIds = {};
    updateContent();
    showToast('数据标准已发布');
  }

  function abolishRows(rows) {
    rows.forEach(function (item) {
      item.publishStatus = '已废止';
      item.auditStatus = '免审废止';
      item.currentApprovalOrderId = '';
      item.currentApprovalType = '';
      (item.versions || []).forEach(function (record) {
        if (record.versionNo === item.currentVersion) record.status = '已废止';
      });
      item.lifecycleEvents = item.lifecycleEvents || [];
      item.lifecycleEvents.push({ action: '标准废止', operator: '张晨', time: getDateParts().time, result: '免审废止' });
    });
    state.selectedIds = {};
    updateContent();
    showToast('数据标准已废止');
  }

  function deleteRows(rows) {
    var ids = rows.map(function (item) { return String(item.id); });
    standardRows = standardRows.filter(function (item) { return ids.indexOf(String(item.id)) < 0; });
    state.selectedIds = {};
    state.formMode = '';
    state.editRowId = '';
    state.viewRowId = '';
    updateContent();
    showToast('数据标准已删除');
  }

  function confirmAndRun(message, icon, fn) {
    if (DP.confirm) {
      DP.confirm(message, { icon: icon || 'info', onOk: fn });
    } else {
      fn();
    }
  }

  function changeApprovalConfig(enabled) {
    var applyChange = function () {
      approvalConfig.enabled = enabled;
      updateContent();
      showToast(enabled ? '流程审批已开启' : '流程审批已关闭');
    };
    var message = enabled
      ? '确认开启流程审批吗？开启后，数据标准发布与废止均需经对应BPM流程审批通过后生效。'
      : '确认关闭流程审批吗？关闭后，新发起的发布与废止操作将直接生效；已进入BPM的工单不受影响。';
    if (DP.confirm) {
      DP.confirm(message, { icon: enabled ? 'info' : 'warn', onOk: applyChange });
    } else {
      applyChange();
    }
  }

  function openForm(mode, id, type, preserveVersion) {
    var item = getRowById(id);
    state.formMode = mode;
    state.editRowId = mode === 'edit' || mode === 'change' ? id : '';
    state.viewRowId = mode === 'view' ? id : '';
    state.formType = type || getTypeFromRow(item);
    state.activeTab = 'list';
    state.logId = '';
    if (!preserveVersion) state.versionStandardId = '';
    state.createMenuOpen = false;
    updateContent();
  }

  function backToList() {
    state.formMode = '';
    state.editRowId = '';
    state.viewRowId = '';
    state.activeTab = 'list';
    updateContent();
  }

  function saveForm() {
    var form = pageEl.querySelector('[data-dsd-form]');
    if (!form) return;
    var savedAsVersion = state.formMode === 'change';
    var values = {};
    form.querySelectorAll('[data-dsd-edit]').forEach(function (input) {
      values[input.getAttribute('data-dsd-edit')] = input.value.trim();
    });
    if (!values.englishName || !values.alias) {
      showToast('请填写英文名和别名');
      return;
    }
    if (state.formMode === 'change' && !values.changeSummary) {
      showToast('请填写变更说明');
      return;
    }
    if (state.formMode === 'create') {
      var meta = typeToMeta(state.formType);
      var newRow = row(
        values.code || defaultFormData(state.formType).code,
        values.englishName,
        values.alias,
        meta.objectType,
        meta.metaModel,
        values.meaning || values.alias,
        '编制',
        '待提交',
        state.treeKey || 'biz',
        {
          dataType: values.dataType,
          length: values.length,
          precision: values.precision,
          desensitizeRule: values.desensitizeRule,
          qualityRule: values.qualityRule,
          encryptRule: values.encryptRule,
          dataClass: values.dataClass,
          dataLevel: values.dataLevel
        }
      );
      newRow.id = standardRows.reduce(function (max, item) { return Math.max(max, Number(item.id)); }, 0) + 1;
      newRow.currentVersion = '--';
      newRow.versions = [];
      newRow.versionDraft = null;
      newRow.lifecycleEvents = [];
      newRow.approvalOrderIds = [];
      standardRows.unshift(newRow);
    } else if (state.formMode === 'change') {
      var changeItem = getRowById(state.editRowId);
      if (!changeItem || changeItem.publishStatus !== '已发布' || isInApproval(changeItem)) {
        showToast('当前标准状态已变化，无法保存变更');
        return;
      }
      var changeSnapshot = snapshotStandardFields(changeItem);
      versionFieldKeys.forEach(function (key) {
        if (values[key] != null) changeSnapshot[key] = values[key] || '';
      });
      var existingDraft = changeItem.versionDraft;
      changeItem.versionDraft = {
        versionNo: existingDraft ? existingDraft.versionNo : getNextVersion(changeItem.currentVersion),
        status: '变更草稿',
        source: existingDraft ? existingDraft.source : '标准变更',
        baseVersion: existingDraft ? existingDraft.baseVersion : changeItem.currentVersion,
        sourceVersion: existingDraft ? (existingDraft.sourceVersion || '') : '',
        summary: values.changeSummary,
        operator: '张晨',
        changeTime: getDateParts().time,
        approvalOrderId: existingDraft ? existingDraft.approvalOrderId : '',
        snapshot: changeSnapshot
      };
      changeItem.auditStatus = '变更草稿';
    } else {
      var item = getRowById(state.editRowId);
      if (!item) return;
      ['code', 'englishName', 'alias', 'meaning', 'dataType', 'length', 'precision', 'desensitizeRule', 'qualityRule', 'encryptRule', 'dataClass', 'dataLevel'].forEach(function (key) {
        if (values[key] != null) item[key] = values[key] || '';
      });
      item.description = item.meaning;
    }
    state.formMode = '';
    state.editRowId = '';
    state.viewRowId = '';
    state.page = 1;
    updateContent();
    renderTree();
    showToast(savedAsVersion ? '版本草稿已保存' : '数据标准已保存');
  }

  function addExportLog() {
    ioRows.unshift({
      id: Date.now(),
      fileName: '字段模型-' + '20260617151930' + '.xls',
      attr: '导出',
      status: '处理中',
      success: 0,
      fail: 0,
      total: getFilteredRows().length,
      operator: '演示-测试',
      time: '2026-06-17 15:19:30'
    });
    showToast('导出任务已创建，可在导入导出查看');
  }

  function saveImport() {
    ioRows.unshift({
      id: Date.now(),
      fileName: '数据标准导入模板.xls',
      attr: '导入',
      status: '处理中',
      success: 0,
      fail: 0,
      total: 0,
      operator: '演示-测试',
      time: '2026-06-17 15:20:12'
    });
    closeModal();
    state.activeTab = 'io';
    updateContent();
    showToast('导入任务已创建');
  }

  function bindEvents() {
    pageEl.addEventListener('click', function (e) {
      var comboTrigger = e.target.closest('[data-dsd-combo-trigger]');
      if (comboTrigger) {
        var combo = comboTrigger.closest('[data-dsd-combo]');
        var isOpen = combo.classList.contains('open');
        closeCombos(combo);
        combo.classList.toggle('open', !isOpen);
        var search = combo.querySelector('[data-dsd-combo-search]');
        if (!isOpen && search) {
          search.value = '';
          filterCombo(combo, '');
          setTimeout(function () { search.focus(); }, 0);
        }
        return;
      }

      var comboOption = e.target.closest('[data-dsd-combo-option]');
      if (comboOption) {
        var optionCombo = comboOption.closest('[data-dsd-combo]');
        selectComboValue(optionCombo, comboOption.getAttribute('data-value') || comboOption.textContent.trim());
        return;
      }

      if (!e.target.closest('[data-dsd-combo]')) closeCombos();

      var treeRow = e.target.closest('[data-dsd-tree-key]');
      if (treeRow) {
        state.treeKey = treeRow.getAttribute('data-dsd-tree-key');
        state.page = 1;
        state.bpmPage = 1;
        state.selectedIds = {};
        state.bpmDetailId = '';
        state.bpmStandardDetail = null;
        state.versionStandardId = '';
        state.versionMode = 'list';
        state.versionSelected = {};
        renderTree();
        updateContent();
        return;
      }

      var tab = e.target.closest('[data-dsd-tab]');
      if (tab) {
        state.activeTab = tab.getAttribute('data-dsd-tab');
        state.formMode = '';
        state.editRowId = '';
        state.viewRowId = '';
        state.logId = '';
        state.bpmDetailId = '';
        state.bpmStandardDetail = null;
        state.versionStandardId = '';
        state.versionMode = 'list';
        state.versionSelected = {};
        state.createMenuOpen = false;
        updateContent();
        return;
      }

      var sortBtn = e.target.closest('[data-dsd-sort]');
      if (sortBtn) {
        var key = sortBtn.getAttribute('data-dsd-sort');
        if (state.sortKey === key) state.sortDir = state.sortDir === 'asc' ? 'desc' : 'asc';
        else {
          state.sortKey = key;
          state.sortDir = 'asc';
        }
        updateContent();
        return;
      }

      var pageBtn = e.target.closest('[data-dsd-page]');
      if (pageBtn) {
        var totalPages = Math.max(1, Math.ceil(getFilteredRows().length / state.pageSize));
        var target = pageBtn.getAttribute('data-dsd-page');
        if (target === 'prev') state.page = Math.max(1, state.page - 1);
        else if (target === 'next') state.page = Math.min(totalPages, state.page + 1);
        else state.page = Number(target) || 1;
        updateContent();
        return;
      }

      var bpmPageBtn = e.target.closest('[data-dsd-bpm-page]');
      if (bpmPageBtn) {
        var bpmTotalPages = Math.max(1, Math.ceil(getFilteredApprovalOrders().length / state.bpmPageSize));
        var bpmTarget = bpmPageBtn.getAttribute('data-dsd-bpm-page');
        if (bpmTarget === 'prev') state.bpmPage = Math.max(1, state.bpmPage - 1);
        else if (bpmTarget === 'next') state.bpmPage = Math.min(bpmTotalPages, state.bpmPage + 1);
        else state.bpmPage = Number(bpmTarget) || 1;
        updateContent();
        return;
      }

      var bpmStandardPageBtn = e.target.closest('[data-dsd-bpm-standard-page]');
      if (bpmStandardPageBtn) {
        var detailOrder = getApprovalOrderById(state.bpmDetailId);
        if (!detailOrder) return;
        var standardTotalPages = Math.max(1, Math.ceil(getFilteredBpmStandards(detailOrder).length / state.bpmStandardPageSize));
        var standardTarget = bpmStandardPageBtn.getAttribute('data-dsd-bpm-standard-page');
        if (standardTarget === 'prev') state.bpmStandardPage = Math.max(1, state.bpmStandardPage - 1);
        else if (standardTarget === 'next') state.bpmStandardPage = Math.min(standardTotalPages, state.bpmStandardPage + 1);
        else state.bpmStandardPage = Number(standardTarget) || 1;
        updateContent();
        return;
      }

      var actionEl = e.target.closest('[data-dsd-action]');
      if (!actionEl) {
        if (!e.target.closest('.dsd-create-menu')) {
          state.createMenuOpen = false;
          var menu = pageEl.querySelector('.dsd-create-menu');
          if (menu) menu.classList.remove('open');
        }
        return;
      }
      var action = actionEl.getAttribute('data-dsd-action');
      var id = actionEl.getAttribute('data-id');

      if (action === 'toggle-create') {
        state.createMenuOpen = !state.createMenuOpen;
        updateContent();
      } else if (action === 'create') {
        openForm('create', '', actionEl.getAttribute('data-type') || 'field');
      } else if (action === 'import') {
        openImportModal();
      } else if (action === 'export') {
        addExportLog();
      } else if (action === 'query') {
        var keyword = pageEl.querySelector('[data-dsd-keyword]');
        state.filters.keyword = keyword ? keyword.value.trim() : '';
        state.page = 1;
        updateContent();
      } else if (action === 'query-io') {
        var ioKeyword = pageEl.querySelector('[data-dsd-io-keyword]');
        state.ioFilters.keyword = ioKeyword ? ioKeyword.value.trim() : '';
        updateContent();
      } else if (action === 'query-bpm') {
        var bpmKeyword = pageEl.querySelector('[data-dsd-bpm-keyword]');
        state.bpmFilters.keyword = bpmKeyword ? bpmKeyword.value.trim() : '';
        state.bpmPage = 1;
        updateContent();
      } else if (action === 'query-bpm-standard') {
        var standardKeyword = pageEl.querySelector('[data-dsd-bpm-standard-keyword]');
        state.bpmStandardFilters.keyword = standardKeyword ? standardKeyword.value.trim() : '';
        state.bpmStandardPage = 1;
        updateContent();
      } else if (action === 'query-versions') {
        var versionKeyword = pageEl.querySelector('[data-dsd-version-keyword]');
        state.versionFilters.keyword = versionKeyword ? versionKeyword.value.trim() : '';
        updateContent();
      } else if (action === 'view') {
        openForm('view', id);
      } else if (action === 'edit') {
        openForm('edit', id);
      } else if (action === 'change-standard') {
        openForm('change', id);
      } else if (action === 'edit-version-draft') {
        openForm('change', id, '', !!state.versionStandardId);
      } else if (action === 'version-history') {
        state.activeTab = 'list';
        state.formMode = '';
        state.versionStandardId = id;
        state.versionMode = 'list';
        state.versionViewNo = '';
        state.versionSelected = {};
        state.versionFilters = { status: '', startDate: '', endDate: '', keyword: '' };
        state.versionOnlyDiff = false;
        updateContent();
      } else if (action === 'back-version-list') {
        state.versionStandardId = '';
        state.versionMode = 'list';
        state.versionViewNo = '';
        state.versionSelected = {};
        state.activeTab = 'list';
        updateContent();
      } else if (action === 'view-version') {
        state.versionViewNo = actionEl.getAttribute('data-version-no') || '';
        state.versionMode = 'detail';
        updateContent();
      } else if (action === 'back-versions') {
        state.versionMode = 'list';
        state.versionViewNo = '';
        state.versionOnlyDiff = false;
        updateContent();
      } else if (action === 'compare-versions') {
        if (Object.keys(state.versionSelected).length !== 2) {
          showToast('请选择两个版本进行比较');
        } else {
          state.versionMode = 'compare';
          state.versionOnlyDiff = false;
          updateContent();
        }
      } else if (action === 'rollback-version') {
        openVersionRollbackModal(id, actionEl.getAttribute('data-version-no') || '');
      } else if (action === 'confirm-version-rollback') {
        confirmVersionRollback();
      } else if (action === 'submit-version-approval') {
        var versionApprovalRow = getRowById(id);
        if (versionApprovalRow) openApprovalModal([versionApprovalRow], 'publish');
      } else if (action === 'submit-publish-approval-row') {
        var publishApprovalRow = getRowById(id);
        if (publishApprovalRow) openApprovalModal([publishApprovalRow], 'publish');
      } else if (action === 'submit-abolish-approval-row') {
        var abolishApprovalRow = getRowById(id);
        if (abolishApprovalRow) openApprovalModal([abolishApprovalRow], 'abolish');
      } else if (action === 'submit-publish-approval-selected') {
        var rowsToPublishApproval = selectedOrWarn('发起发布审批');
        if (rowsToPublishApproval) openApprovalModal(rowsToPublishApproval, 'publish');
      } else if (action === 'submit-abolish-approval-selected') {
        var rowsToAbolishApproval = selectedOrWarn('发起废止审批');
        if (rowsToAbolishApproval) openApprovalModal(rowsToAbolishApproval, 'abolish');
      } else if (action === 'publish-row') {
        var publishRow = getRowById(id);
        if (publishRow && isApprovalEligible(publishRow, 'publish')) confirmAndRun('确认发布数据标准 <b>' + escapeHtml(publishRow.alias) + '</b> 吗？', 'info', function () { publishRows([publishRow], '免审发布'); });
      } else if (action === 'abolish-row') {
        var abolishRow = getRowById(id);
        if (abolishRow && isApprovalEligible(abolishRow, 'abolish')) confirmAndRun('确认废止数据标准 <b>' + escapeHtml(abolishRow.alias) + '</b> 吗？', 'danger', function () { abolishRows([abolishRow]); });
      } else if (action === 'delete-row') {
        var deleteRow = getRowById(id);
        if (deleteRow) confirmAndRun('确认删除数据标准 <b>' + escapeHtml(deleteRow.alias) + '</b> 吗？', 'danger', function () { deleteRows([deleteRow]); });
      } else if (action === 'publish-selected') {
        var rowsToPublish = selectedOrWarn('发布');
        if (rowsToPublish && rowsToPublish.some(function (item) { return !isApprovalEligible(item, 'publish'); })) {
          showToast('只能发布“编制”或已有变更草稿且未处于审批中的数据标准');
        } else if (rowsToPublish) {
          confirmAndRun('确认发布选中的 <b>' + rowsToPublish.length + '</b> 条数据标准吗？', 'info', function () { publishRows(rowsToPublish, '免审发布'); });
        }
      } else if (action === 'abolish-selected') {
        var rowsToAbolish = selectedOrWarn('废止');
        if (rowsToAbolish && rowsToAbolish.some(function (item) { return !isApprovalEligible(item, 'abolish'); })) {
          showToast('只能废止无变更草稿且未处于审批中的“已发布”数据标准');
        } else if (rowsToAbolish) {
          confirmAndRun('确认废止选中的 <b>' + rowsToAbolish.length + '</b> 条数据标准吗？', 'danger', function () { abolishRows(rowsToAbolish); });
        }
      } else if (action === 'delete-selected') {
        var rowsToDelete = selectedOrWarn('删除');
        if (rowsToDelete) confirmAndRun('确认删除选中的 <b>' + rowsToDelete.length + '</b> 条数据标准吗？', 'danger', function () { deleteRows(rowsToDelete); });
      } else if (action === 'back-list' || action === 'cancel-form') {
        backToList();
      } else if (action === 'save-form') {
        saveForm();
      } else if (action === 'view-log') {
        state.logId = id;
        state.activeTab = 'log';
        state.formMode = '';
        updateContent();
      } else if (action === 'back-io') {
        state.logId = '';
        state.activeTab = 'io';
        updateContent();
      } else if (action === 'view-bpm' || action === 'view-approval') {
        state.activeTab = 'bpm';
        state.versionStandardId = '';
        state.versionMode = 'list';
        state.versionSelected = {};
        state.bpmDetailId = actionEl.getAttribute('data-order-id') || '';
        state.bpmStandardDetail = null;
        state.bpmStandardFilters = { keyword: '' };
        state.bpmStandardPage = 1;
        state.bpmStandardPageSize = 5;
        state.formMode = '';
        updateContent();
      } else if (action === 'view-bpm-standard') {
        state.bpmStandardDetail = {
          orderId: actionEl.getAttribute('data-order-id') || '',
          standardCode: actionEl.getAttribute('data-standard-code') || ''
        };
        updateContent();
      } else if (action === 'back-bpm-order') {
        state.bpmStandardDetail = null;
        state.activeTab = 'bpm';
        updateContent();
      } else if (action === 'back-bpm') {
        state.bpmDetailId = '';
        state.bpmStandardDetail = null;
        state.activeTab = 'bpm';
        updateContent();
      } else if (action === 'close-modal') {
        closeModal();
      } else if (action === 'confirm-submit-approval') {
        submitApproval();
      } else if (action === 'save-import') {
        saveImport();
      } else if (action === 'download-template') {
        showToast('空模板已准备下载');
      } else if (action === 'choose-file') {
        showToast('静态原型中已模拟文件选择');
      } else if (action === 'mock-upload') {
        showToast('请选择本地 Excel 文件');
      } else if (action === 'page-go') {
        var jump = pageEl.querySelector('.dsd-page-jump');
        var total = Math.max(1, Math.ceil(getFilteredRows().length / state.pageSize));
        state.page = Math.max(1, Math.min(total, Number(jump && jump.value) || 1));
        updateContent();
      }
    });

    pageEl.addEventListener('change', function (e) {
      if (e.target.matches('[data-dsd-filter]')) {
        state.filters[e.target.getAttribute('data-dsd-filter')] = e.target.value;
        var listKeyword = pageEl.querySelector('[data-dsd-keyword]');
        state.filters.keyword = listKeyword ? listKeyword.value.trim() : state.filters.keyword;
        state.page = 1;
        updateContent();
        return;
      }
      if (e.target.matches('[data-dsd-version-filter]')) {
        state.versionFilters[e.target.getAttribute('data-dsd-version-filter')] = e.target.value;
        var versionKeyword = pageEl.querySelector('[data-dsd-version-keyword]');
        state.versionFilters.keyword = versionKeyword ? versionKeyword.value.trim() : state.versionFilters.keyword;
        updateContent();
        return;
      }
      if (e.target.matches('[data-dsd-version-check]')) {
        var versionNo = e.target.getAttribute('data-dsd-version-check');
        if (e.target.checked) {
          if (Object.keys(state.versionSelected).length >= 2) {
            e.target.checked = false;
            showToast('版本比较最多选择两个版本');
            return;
          }
          state.versionSelected[versionNo] = true;
        } else {
          delete state.versionSelected[versionNo];
        }
        updateContent();
        return;
      }
      if (e.target.matches('[data-dsd-version-only-diff]')) {
        state.versionOnlyDiff = e.target.checked;
        updateContent();
        return;
      }
      if (e.target.matches('[data-dsd-io-filter]')) {
        state.ioFilters[e.target.getAttribute('data-dsd-io-filter')] = e.target.value;
        var ioKeyword = pageEl.querySelector('[data-dsd-io-keyword]');
        state.ioFilters.keyword = ioKeyword ? ioKeyword.value.trim() : state.ioFilters.keyword;
        updateContent();
        return;
      }
      if (e.target.matches('[data-dsd-bpm-filter]')) {
        state.bpmFilters[e.target.getAttribute('data-dsd-bpm-filter')] = e.target.value;
        var bpmKeyword = pageEl.querySelector('[data-dsd-bpm-keyword]');
        state.bpmFilters.keyword = bpmKeyword ? bpmKeyword.value.trim() : state.bpmFilters.keyword;
        state.bpmPage = 1;
        updateContent();
        return;
      }
      if (e.target.matches('[data-dsd-approval-switch]')) {
        var enabled = e.target.checked;
        e.target.checked = approvalConfig.enabled;
        changeApprovalConfig(enabled);
        return;
      }
      if (e.target.matches('[data-dsd-check-all]')) {
        getVisibleRows().forEach(function (item) {
          if (isInApproval(item)) return;
          if (e.target.checked) state.selectedIds[item.id] = true;
          else delete state.selectedIds[item.id];
        });
        updateContent();
        return;
      }
      if (e.target.matches('[data-dsd-row-check]')) {
        var id = e.target.getAttribute('data-dsd-row-check');
        if (e.target.checked) state.selectedIds[id] = true;
        else delete state.selectedIds[id];
        updateCheckAll();
        return;
      }
      if (e.target.matches('[data-dsd-page-size]')) {
        state.pageSize = Number(e.target.value) || 10;
        state.page = 1;
        updateContent();
        return;
      }
      if (e.target.matches('[data-dsd-bpm-page-size]')) {
        state.bpmPageSize = Number(e.target.value) || 10;
        state.bpmPage = 1;
        updateContent();
        return;
      }
      if (e.target.matches('[data-dsd-bpm-standard-page-size]')) {
        state.bpmStandardPageSize = Number(e.target.value) || 5;
        state.bpmStandardPage = 1;
        updateContent();
      }
    });

    pageEl.addEventListener('input', function (e) {
      if (e.target.matches('[data-dsd-tree-search]')) {
        state.treeKeyword = e.target.value;
        renderTree();
      }
      if (e.target.matches('[data-dsd-combo-search]')) {
        var combo = e.target.closest('[data-dsd-combo]');
        if (combo) filterCombo(combo, e.target.value);
      }
    });

    pageEl.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter') return;
      if (e.target.matches('[data-dsd-keyword]')) {
        var query = pageEl.querySelector('[data-dsd-action="query"]');
        if (query) query.click();
      }
      if (e.target.matches('[data-dsd-io-keyword]')) {
        var ioQuery = pageEl.querySelector('[data-dsd-action="query-io"]');
        if (ioQuery) ioQuery.click();
      }
      if (e.target.matches('[data-dsd-bpm-keyword]')) {
        var bpmQuery = pageEl.querySelector('[data-dsd-action="query-bpm"]');
        if (bpmQuery) bpmQuery.click();
      }
      if (e.target.matches('[data-dsd-bpm-standard-keyword]')) {
        var standardQuery = pageEl.querySelector('[data-dsd-action="query-bpm-standard"]');
        if (standardQuery) standardQuery.click();
      }
      if (e.target.matches('[data-dsd-version-keyword]')) {
        var versionQuery = pageEl.querySelector('[data-dsd-action="query-versions"]');
        if (versionQuery) versionQuery.click();
      }
      if (e.target.matches('.dsd-page-jump')) {
        var go = pageEl.querySelector('[data-dsd-action="page-go"]');
        if (go) go.click();
      }
    });
  }

  var html = '<div class="page-data-standard">' +
    '<aside class="dsd-left-panel">' +
      '<div class="dsd-tree-search">' +
        '<input type="text" data-dsd-tree-search placeholder="关键字搜索" aria-label="关键字搜索">' +
        '<button type="button" aria-label="搜索"><i class="bi bi-search"></i></button>' +
      '</div>' +
      '<div class="dsd-tree-scroll"><ul class="dsd-tree" data-dsd-tree></ul></div>' +
    '</aside>' +
    '<section class="dsd-main-panel">' +
      '<div class="dsd-tabs" data-dsd-tabs></div>' +
      '<div class="dsd-view" data-dsd-view></div>' +
    '</section>' +
  '</div>';

  return {
    html: html,
    init: function () {
      pageEl = document.querySelector('.page-data-standard');
      if (!pageEl) return;
      resetState();
      bindEvents();
      renderTree();
      updateContent();
    }
  };
})();
