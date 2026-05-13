/**
 * 数据中台 V4.0 - 数据治理 / 治理任务
 */
window.DP = window.DP || {};
DP.pages = DP.pages || {};

DP.pages.governanceTask = (function () {
  var pageSize = 8;
  var currentPage = 1;
  var activePlanId = 'gp-001';
  var filters = {
    keyword: '',
    metadataFill: 'all',
    standardMap: 'all',
    standardAudit: 'all',
    dataQuality: 'all'
  };

  var plans = [
    { id: 'gp-001', name: '客户域核心资产治理规划', rate: 68 },
    { id: 'gp-003', name: '营销域标签数据治理规划', rate: 54 },
    { id: 'gp-004', name: '供应链主题资产治理规划', rate: 0 },
    { id: 'gp-005', name: '财务报表口径治理规划', rate: 72 },
    { id: 'gp-007', name: '公共维表字段治理规划', rate: 61 },
    { id: 'gp-008', name: '实时数据链路治理规划', rate: 46 },
    { id: 'gp-011', name: '数据安全分级治理规划', rate: 39 }
  ];

  var planTables = {
    'gp-001': [
      row('order_main', '订单主表', '核心订单交易主表，记录所有订单基础信息', 100, 100, 100, 45),
      row('order_detail', '订单明细表', '订单商品明细，包含SKU、数量、金额', 100, 85, 62, 30),
      row('dwd_customer_base', '客户基础信息表', '客户主数据基础属性与会员标识信息', 100, 72, 38, 20),
      row('ods_member_address', '会员地址表', '会员收货地址、默认地址与地址标签', 48, 36, 12, 0),
      row('ads_user_tag_profile', '用户标签画像表', '客户标签画像与营销圈选结果宽表', 100, 100, 100, 100),
      row('dwd_customer_identity', '客户身份认证表', '客户实名、证件与认证状态信息', 100, 64, 40, 100),
      row('dim_member_level', '会员等级维表', '会员等级、成长值区间与权益说明', 56, 100, 34, 18),
      row('asset_owner_relation', '资产责任关系表', '客户域资产负责人、业务归属与维护关系', 100, 100, 100, 76),
      row('resource_apply_record', '资源申请记录表', '客户域资源申请、授权与使用留痕', 28, 15, 0, 0)
    ],
    'gp-003': [
      row('dwd_campaign_touch_di', '活动触达明细表', '营销活动触达用户、渠道和触达结果', 100, 100, 70, 42),
      row('dws_marketing_conversion_1d', '营销转化汇总表', '按天统计营销触达、点击和转化情况', 100, 58, 40, 100),
      row('ads_user_tag_profile', '用户标签画像表', '用户标签结果、标签版本与可用范围', 100, 100, 100, 100),
      row('dim_channel', '渠道维表', '渠道编码、渠道名称与渠道层级', 60, 100, 28, 10),
      row('ads_order_overview', '订单概览报表', '面向营销复盘的订单概览报表', 100, 100, 46, 100)
    ],
    'gp-004': [
      row('ods_supplier_main', '供应商主表', '供应商基础资料、资质与状态', 100, 24, 0, 0),
      row('dwd_inventory_snapshot_di', '库存快照表', '商品库存每日快照与库存地点', 18, 0, 0, 0),
      row('dwd_purchase_order_detail', '采购订单明细表', '采购订单、物料、数量与金额明细', 100, 100, 36, 12),
      row('dim_warehouse', '仓库维表', '仓库编码、区域、类型与负责人', 100, 100, 100, 58)
    ],
    'gp-005': [
      row('ads_finance_income_report', '收入分析报表', '财务收入、退款与折扣统计口径', 100, 100, 68, 100),
      row('dwd_refund_detail_di', '退款明细表', '订单退款申请、审核和退款金额', 100, 42, 30, 16),
      row('dws_cost_summary_1d', '成本日汇总表', '按日汇总商品成本、履约成本和营销费用', 100, 100, 100, 75),
      row('dim_account_subject', '会计科目维表', '会计科目编码、名称和核算层级', 54, 100, 22, 0)
    ],
    'gp-007': [
      row('dim_date', '日期维表', '自然日、工作日、周月季度和节假日信息', 100, 100, 100, 100),
      row('dim_region', '区域维表', '国家、省市区与区域层级', 100, 100, 64, 38),
      row('dim_org', '组织维表', '组织编码、组织层级和负责人', 45, 30, 20, 0),
      row('dim_channel', '渠道维表', '渠道编码、渠道名称与渠道层级', 100, 100, 100, 72)
    ],
    'gp-008': [
      row('ods_event_log_rt', '实时事件日志表', '实时采集的用户行为事件明细', 100, 35, 20, 0),
      row('dwd_order_fact_rt', '实时订单事实表', '实时订单宽表产出链路', 100, 100, 58, 100),
      row('dws_realtime_metric_1m', '实时指标分钟表', '按分钟汇总实时交易与访问指标', 30, 18, 0, 0),
      row('ads_realtime_dashboard', '实时看板报表', '实时经营看板展示数据', 100, 100, 100, 100)
    ],
    'gp-011': [
      row('order_payment', '订单支付记录', '支付流水、支付渠道、支付状态记录', 100, 100, 56, 100),
      row('order_address', '收货地址表', '用户订单关联的收货地址信息', 100, 42, 24, 18),
      row('dwd_customer_identity', '客户身份认证表', '客户实名、证件与认证状态信息', 100, 100, 100, 66),
      row('asset_security_level', '资产安全分级表', '资产敏感等级、脱敏策略与授权边界', 26, 15, 0, 0)
    ]
  };

  function row(tableName, alias, comment, metadataFill, standardMap, standardAudit, dataQuality) {
    return {
      tableName: tableName,
      alias: alias,
      comment: comment,
      metadataFill: metadataFill,
      standardMap: standardMap,
      standardAudit: standardAudit,
      dataQuality: dataQuality
    };
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function normalize(value) {
    return String(value || '').trim().toLowerCase();
  }

  function getActivePlan() {
    return plans.find(function (plan) { return plan.id === activePlanId; }) || plans[0];
  }

  function getActiveRows() {
    return (planTables[activePlanId] || []).slice();
  }

  function findTable(tableName) {
    return getActiveRows().find(function (item) {
      return item.tableName === tableName;
    }) || getActiveRows()[0];
  }

  function matchText(value, keyword) {
    return !keyword || normalize(value).indexOf(keyword) >= 0;
  }

  function matchStatus(value, status) {
    if (status === 'all') return true;
    return status === 'done' ? value >= 100 : value < 100;
  }

  function getFilteredRows() {
    var keyword = normalize(filters.keyword);

    return getActiveRows().filter(function (item) {
      var searchText = item.tableName + ' ' + item.alias + ' ' + item.comment;
      return matchText(searchText, keyword) &&
        matchStatus(item.metadataFill, filters.metadataFill) &&
        matchStatus(item.standardMap, filters.standardMap) &&
        matchStatus(item.standardAudit, filters.standardAudit) &&
        matchStatus(item.dataQuality, filters.dataQuality);
    });
  }

  function getCompletionRate(rows) {
    var total = rows.length * 4;
    if (!total) return 0;
    var done = rows.reduce(function (sum, item) {
      return sum +
        item.metadataFill +
        item.standardMap +
        item.standardAudit +
        item.dataQuality;
    }, 0);
    return Math.round(done / total);
  }

  function renderPlans() {
    var keyword = normalize((document.getElementById('gtPlanSearch') || {}).value || '');
    var html = plans.filter(function (plan) {
      return matchText(plan.name, keyword);
    }).map(function (plan) {
      return '<button class="gt-plan-item' + (plan.id === activePlanId ? ' active' : '') + '" type="button" data-gt-plan="' + plan.id + '">' +
        '<span class="gt-plan-name" title="' + escapeHtml(plan.name) + '">' + escapeHtml(plan.name) + '</span>' +
        '<span class="gt-plan-rate">' + plan.rate + '%</span>' +
        '<span class="gt-plan-progress"><span style="width:' + plan.rate + '%;"></span></span>' +
      '</button>';
    }).join('');

    return html || '<div class="gt-empty-side">未找到进行中的治理规划</div>';
  }

  function renderStatusSelect(key, label) {
    return '<label class="gt-filter-field gt-filter-field-sm"><span>' + label + '</span>' +
      '<select class="ma-select" data-gt-filter="' + key + '">' +
        '<option value="all"' + (filters[key] === 'all' ? ' selected' : '') + '>全部</option>' +
        '<option value="todo"' + (filters[key] === 'todo' ? ' selected' : '') + '>未完成</option>' +
        '<option value="done"' + (filters[key] === 'done' ? ' selected' : '') + '>已完成</option>' +
      '</select></label>';
  }

  function renderFilters() {
    return '<div class="gt-filter-grid">' +
      renderStatusSelect('metadataFill', '元数据填充') +
      renderStatusSelect('standardMap', '标准映射') +
      renderStatusSelect('standardAudit', '标准稽查') +
      renderStatusSelect('dataQuality', '数据质量') +
      '<label class="gt-filter-field gt-keyword-field"><input class="ma-search" data-gt-filter="keyword" type="text" value="' + escapeHtml(filters.keyword) + '" placeholder="搜索表名、别名、注释"></label>' +
      '<div class="gt-filter-actions">' +
        '<button class="btn btn-primary" type="button" data-gt-action="search"><i class="bi bi-search"></i> 查询</button>' +
        '<button class="btn btn-outline" type="button" data-gt-action="reset"><i class="bi bi-arrow-counterclockwise"></i> 重置</button>' +
      '</div>' +
    '</div>';
  }

  function renderRate(rate) {
    var tagClass = rate >= 100 ? 'tag-green' : rate > 0 ? 'tag-yellow' : 'tag-red';
    return '<span class="gt-rate-cell">' +
      '<span class="tag ' + tagClass + '">' + rate + '%</span>' +
      '<span class="gt-rate-track"><span style="width:' + rate + '%;"></span></span>' +
    '</span>';
  }

  function renderTable() {
    var rows = getFilteredRows();
    var totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
    currentPage = Math.min(Math.max(1, currentPage), totalPages);
    var start = (currentPage - 1) * pageSize;
    var pageRows = rows.slice(start, start + pageSize);

    var body = pageRows.map(function (item) {
      return '<tr>' +
        '<td class="td-link" title="' + escapeHtml(item.tableName) + '">' + escapeHtml(item.tableName) + '</td>' +
        '<td title="' + escapeHtml(item.alias) + '">' + escapeHtml(item.alias) + '</td>' +
        '<td class="td-desc" title="' + escapeHtml(item.comment) + '">' + escapeHtml(item.comment) + '</td>' +
        '<td>' + renderRate(item.metadataFill) + '</td>' +
        '<td>' + renderRate(item.standardMap) + '</td>' +
        '<td>' + renderRate(item.standardAudit) + '</td>' +
        '<td>' + renderRate(item.dataQuality) + '</td>' +
        '<td class="td-actions"><button class="ma-op-btn" type="button" data-gt-action="view" data-gt-table="' + escapeHtml(item.tableName) + '"><i class="bi bi-eye"></i><span>查看</span></button></td>' +
      '</tr>';
    }).join('');

    if (!body) {
      body = '<tr><td colspan="8" class="gt-empty-table">暂无符合条件的治理任务</td></tr>';
    }

    return '<table class="ds-table">' +
      '<thead><tr>' +
        '<th>表名</th><th>别名</th><th>注释</th><th>元数据填充</th><th>标准映射</th><th>标准稽查</th><th>数据质量</th><th>操作</th>' +
      '</tr></thead>' +
      '<tbody>' + body + '</tbody>' +
    '</table>';
  }

  function renderPagination() {
    var rows = getFilteredRows();
    var total = rows.length;
    var totalPages = Math.max(1, Math.ceil(total / pageSize));
    currentPage = Math.min(Math.max(1, currentPage), totalPages);
    var pages = [];
    var start = total ? (currentPage - 1) * pageSize + 1 : 0;
    var end = Math.min(currentPage * pageSize, total);

    for (var i = 1; i <= totalPages; i += 1) {
      pages.push('<a class="page-num' + (i === currentPage ? ' active' : '') + '" data-gt-page="' + i + '">' + i + '</a>');
    }

    return '<div class="page-info">第 ' + start + '-' + end + ' 条，共 ' + total + ' 条，每页 ' + pageSize + ' 条</div>' +
      '<div class="page-nav">' +
        '<a class="page-btn' + (currentPage === 1 ? ' disabled' : '') + '" data-gt-page="' + (currentPage - 1) + '">上一页</a>' +
        pages.join('') +
        '<a class="page-btn' + (currentPage === totalPages ? ' disabled' : '') + '" data-gt-page="' + (currentPage + 1) + '">下一页</a>' +
      '</div>';
  }

  function getLayer(tableName) {
    if (tableName.indexOf('ods_') === 0 || tableName.indexOf('order_') === 0) return 'ODS';
    if (tableName.indexOf('dwd_') === 0) return 'DWD';
    if (tableName.indexOf('dws_') === 0) return 'DWS';
    if (tableName.indexOf('ads_') === 0) return 'ADS';
    if (tableName.indexOf('dim_') === 0) return 'DIM';
    return 'ODS';
  }

  function getDataSource(tableName) {
    if (tableName.indexOf('order_') === 0) return 'prod_mysql_master';
    if (tableName.indexOf('ads_') === 0) return 'dw_hive_ads';
    if (tableName.indexOf('dws_') === 0) return 'dw_hive_dws';
    if (tableName.indexOf('dwd_') === 0) return 'dw_hive_dwd';
    if (tableName.indexOf('dim_') === 0) return 'dw_hive_dim';
    return 'prod_mysql_master';
  }

  function getRecordCount(tableName) {
    var counts = {
      order_main: '1,438,920',
      order_detail: '3,892,105',
      order_payment: '1,205,680',
      order_address: '528,630',
      ads_user_tag_profile: '862,400',
      ads_order_overview: '365'
    };
    return counts[tableName] || '128,640';
  }

  function renderDetailInfo(label, value) {
    return '<div class="ms-info-item"><span class="info-label">' + label + '</span><span class="info-value">' + escapeHtml(value) + '</span></div>';
  }

  function renderDetail(tableName) {
    var item = findTable(tableName);
    if (!item) return '';
    var layer = getLayer(item.tableName);
    var source = getDataSource(item.tableName);

    return '<div class="gt-detail-view ms-detail-panel">' +
      '<div class="ms-detail-header">' +
        '<button class="btn btn-outline btn-sm" type="button" data-gt-action="back-list"><i class="bi bi-arrow-left"></i> 返回列表</button>' +
        '<span class="ms-detail-title">' + escapeHtml(item.tableName) + ' — ' + escapeHtml(item.alias) + '</span>' +
      '</div>' +
      '<div class="ms-detail-tabs">' +
        '<a class="ms-dtab active" data-tab="meta-info">元数据详情</a>' +
        '<a class="ms-dtab" data-tab="structure">表结构</a>' +
        '<a class="ms-dtab" data-tab="standard">标准稽查</a>' +
        '<a class="ms-dtab" data-tab="preview">数据预览</a>' +
        '<a class="ms-dtab" data-tab="lineage">血缘关系</a>' +
        '<a class="ms-dtab" data-tab="quality">数据质量</a>' +
        '<a class="ms-dtab" data-tab="security">数据安全</a>' +
        '<a class="ms-dtab" data-tab="history">历史版本</a>' +
      '</div>' +
      '<div class="ms-detail-body">' +
        '<div class="ms-tab-content active" data-content="meta-info">' +
          '<div class="ms-info-grid">' +
            renderDetailInfo('表名', item.tableName) +
            renderDetailInfo('别名', item.alias) +
            renderDetailInfo('数据源', source) +
            renderDetailInfo('数仓分层', layer) +
            renderDetailInfo('存储引擎', source === 'prod_mysql_master' ? 'InnoDB' : 'Hive') +
            renderDetailInfo('字符集', source === 'prod_mysql_master' ? 'utf8mb4' : 'UTF-8') +
            renderDetailInfo('记录数', getRecordCount(item.tableName)) +
            renderDetailInfo('数据量', item.tableName === 'order_main' ? '2.8 GB' : '1.2 GB') +
            renderDetailInfo('负责人', item.tableName === 'order_main' ? '张明' : '李婷') +
            renderDetailInfo('创建时间', '2024-06-15 10:30:00') +
            renderDetailInfo('更新时间', '2026-02-12 08:30:00') +
            renderDetailInfo('描述', item.comment) +
          '</div>' +
        '</div>' +
        '<div class="ms-tab-content" data-content="structure">' +
          '<table class="ds-table">' +
            '<thead><tr><th>序号</th><th>字段名</th><th>别名</th><th>类型</th><th>长度</th><th>允许空</th><th>主键</th><th>描述</th></tr></thead>' +
            '<tbody>' +
              '<tr><td>1</td><td class="td-link">order_id</td><td>订单编号</td><td>bigint</td><td>20</td><td>否</td><td><i class="bi bi-key-fill" style="color:#faad14"></i></td><td>订单唯一标识</td></tr>' +
              '<tr><td>2</td><td class="td-link">user_id</td><td>用户ID</td><td>bigint</td><td>20</td><td>否</td><td>-</td><td>下单用户ID</td></tr>' +
              '<tr><td>3</td><td class="td-link">order_no</td><td>订单号</td><td>varchar</td><td>64</td><td>否</td><td>-</td><td>业务订单号</td></tr>' +
              '<tr><td>4</td><td class="td-link">order_status</td><td>订单状态</td><td>tinyint</td><td>4</td><td>否</td><td>-</td><td>0待付款 1已付款 2已发货 3已完成</td></tr>' +
              '<tr><td>5</td><td class="td-link">total_amount</td><td>订单总金额</td><td>decimal</td><td>12,2</td><td>否</td><td>-</td><td>订单应付总额</td></tr>' +
              '<tr><td>6</td><td class="td-link">pay_amount</td><td>实付金额</td><td>decimal</td><td>12,2</td><td>是</td><td>-</td><td>用户实际支付金额</td></tr>' +
              '<tr><td>7</td><td class="td-link">pay_time</td><td>支付时间</td><td>datetime</td><td>-</td><td>是</td><td>-</td><td>支付完成时间</td></tr>' +
              '<tr><td>8</td><td class="td-link">create_time</td><td>创建时间</td><td>datetime</td><td>-</td><td>否</td><td>-</td><td>订单创建时间</td></tr>' +
              '<tr><td>9</td><td class="td-link">update_time</td><td>更新时间</td><td>datetime</td><td>-</td><td>否</td><td>-</td><td>最后更新时间</td></tr>' +
            '</tbody>' +
          '</table>' +
        '</div>' +
        '<div class="ms-tab-content" data-content="standard">' +
          '<div class="ms-empty-hint"><p>标准映射关系与稽查结果</p>' +
            '<table class="ds-table" style="margin-top:12px;">' +
              '<thead><tr><th>字段名</th><th>标准编码</th><th>标准名称</th><th>映射状态</th><th>稽查结果</th></tr></thead>' +
              '<tbody>' +
                '<tr><td>order_id</td><td>STD_ORDER_001</td><td>订单标识</td><td><span class="tag tag-green">已映射</span></td><td><span class="tag tag-green">通过</span></td></tr>' +
                '<tr><td>user_id</td><td>STD_USER_001</td><td>用户标识</td><td><span class="tag tag-green">已映射</span></td><td><span class="tag tag-green">通过</span></td></tr>' +
                '<tr><td>order_status</td><td>STD_STATUS_002</td><td>订单状态码</td><td><span class="tag tag-green">已映射</span></td><td><span class="tag tag-yellow">告警</span></td></tr>' +
                '<tr><td>total_amount</td><td>-</td><td>-</td><td><span class="tag tag-red">未映射</span></td><td>-</td></tr>' +
              '</tbody>' +
            '</table>' +
          '</div>' +
        '</div>' +
        '<div class="ms-tab-content" data-content="preview">' +
          '<div class="ms-preview-toolbar"><span class="ms-preview-info">前 5 条记录预览</span></div>' +
          '<table class="ds-table">' +
            '<thead><tr><th>order_id</th><th>user_id</th><th>order_no</th><th>order_status</th><th>total_amount</th><th>pay_amount</th><th>pay_time</th><th>create_time</th></tr></thead>' +
            '<tbody>' +
              '<tr><td>100001</td><td>50821</td><td>ORD20260212001</td><td>3</td><td>299.00</td><td>279.00</td><td>2026-02-12 09:15</td><td>2026-02-12 09:10</td></tr>' +
              '<tr><td>100002</td><td>32156</td><td>ORD20260212002</td><td>1</td><td>1580.00</td><td>1580.00</td><td>2026-02-12 09:22</td><td>2026-02-12 09:20</td></tr>' +
              '<tr><td>100003</td><td>78432</td><td>ORD20260212003</td><td>0</td><td>68.50</td><td>NULL</td><td>NULL</td><td>2026-02-12 09:35</td></tr>' +
              '<tr><td>100004</td><td>12890</td><td>ORD20260212004</td><td>2</td><td>4350.00</td><td>4200.00</td><td>2026-02-12 08:50</td><td>2026-02-12 08:45</td></tr>' +
              '<tr><td>100005</td><td>65213</td><td>ORD20260212005</td><td>3</td><td>128.00</td><td>118.00</td><td>2026-02-11 22:30</td><td>2026-02-11 22:25</td></tr>' +
            '</tbody>' +
          '</table>' +
        '</div>' +
        '<div class="ms-tab-content" data-content="lineage">' +
          '<div class="ms-lineage-diagram">' +
            '<div class="lineage-col"><div class="lineage-title">上游来源</div><div class="lineage-node ln-src">erp_order_raw</div><div class="lineage-node ln-src">payment_callback_log</div><div class="lineage-node ln-src">user_address_info</div></div>' +
            '<div class="lineage-arrows"><i class="bi bi-arrow-right"></i></div>' +
            '<div class="lineage-col"><div class="lineage-title">当前表</div><div class="lineage-node ln-cur">order_main</div></div>' +
            '<div class="lineage-arrows"><i class="bi bi-arrow-right"></i></div>' +
            '<div class="lineage-col"><div class="lineage-title">下游消费</div><div class="lineage-node ln-dst">dwd_order_fact</div><div class="lineage-node ln-dst">dws_order_daily</div><div class="lineage-node ln-dst">ads_order_overview</div><div class="lineage-node ln-dst">ads_gmv_summary</div></div>' +
          '</div>' +
        '</div>' +
        '<div class="ms-tab-content" data-content="quality">' +
          '<div class="ms-quality-sub-tabs"><a class="ms-qtab active">质量规则</a><a class="ms-qtab">质量报告</a></div>' +
          '<table class="ds-table" style="margin-top:10px;">' +
            '<thead><tr><th>规则名称</th><th>规则类型</th><th>检测字段</th><th>规则描述</th><th>最近结果</th><th>通过率</th></tr></thead>' +
            '<tbody>' +
              '<tr><td>非空校验</td><td>完整性</td><td>order_id</td><td>主键不允许为空</td><td><span class="tag tag-green">通过</span></td><td>100%</td></tr>' +
              '<tr><td>非空校验</td><td>完整性</td><td>user_id</td><td>用户ID不允许为空</td><td><span class="tag tag-green">通过</span></td><td>100%</td></tr>' +
              '<tr><td>范围校验</td><td>准确性</td><td>total_amount</td><td>金额大于0</td><td><span class="tag tag-green">通过</span></td><td>99.97%</td></tr>' +
              '<tr><td>枚举校验</td><td>一致性</td><td>order_status</td><td>状态值在0-3范围内</td><td><span class="tag tag-yellow">告警</span></td><td>99.82%</td></tr>' +
              '<tr><td>唯一性校验</td><td>唯一性</td><td>order_no</td><td>订单号全局唯一</td><td><span class="tag tag-green">通过</span></td><td>100%</td></tr>' +
            '</tbody>' +
          '</table>' +
        '</div>' +
        '<div class="ms-tab-content" data-content="security">' +
          '<div class="ms-quality-sub-tabs"><a class="ms-qtab active">脱敏规则</a><a class="ms-qtab">加密规则</a></div>' +
          '<table class="ds-table" style="margin-top:10px;">' +
            '<thead><tr><th>字段名</th><th>安全等级</th><th>规则类型</th><th>规则描述</th><th>状态</th></tr></thead>' +
            '<tbody>' +
              '<tr><td>user_id</td><td><span class="tag tag-yellow">L2-敏感</span></td><td>脱敏</td><td>用户ID部分遮蔽显示</td><td><span class="tag tag-green">已启用</span></td></tr>' +
              '<tr><td>pay_amount</td><td><span class="tag tag-red">L3-机密</span></td><td>加密</td><td>AES-256 加密存储</td><td><span class="tag tag-green">已启用</span></td></tr>' +
            '</tbody>' +
          '</table>' +
        '</div>' +
        '<div class="ms-tab-content" data-content="history">' +
          '<table class="ds-table">' +
            '<thead><tr><th>版本号</th><th>变更类型</th><th>变更内容</th><th>操作人</th><th>变更时间</th></tr></thead>' +
            '<tbody>' +
              '<tr><td>v3.2</td><td><span class="tag tag-blue">结构变更</span></td><td>新增字段 coupon_id</td><td>张明</td><td>2026-02-10 14:20</td></tr>' +
              '<tr><td>v3.1</td><td><span class="tag tag-yellow">配置变更</span></td><td>修改 total_amount 精度为 12,2</td><td>王强</td><td>2026-01-28 09:15</td></tr>' +
              '<tr><td>v3.0</td><td><span class="tag tag-blue">结构变更</span></td><td>新增字段 pay_channel</td><td>张明</td><td>2026-01-15 16:40</td></tr>' +
              '<tr><td>v2.0</td><td><span class="tag tag-purple">重构</span></td><td>表结构重构，拆分明细到 order_detail</td><td>李婷</td><td>2025-11-20 10:00</td></tr>' +
              '<tr><td>v1.0</td><td><span class="tag tag-green">创建</span></td><td>初始创建订单主表</td><td>张明</td><td>2024-06-15 10:30</td></tr>' +
            '</tbody>' +
          '</table>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  function syncFiltersFromDom() {
    Object.keys(filters).forEach(function (key) {
      var el = document.querySelector('[data-gt-filter="' + key + '"]');
      if (el) filters[key] = el.value;
    });
  }

  function renderMain() {
    var rows = getActiveRows();
    var plan = getActivePlan();
    var tableWrap = document.getElementById('gtTableWrap');
    var pagination = document.getElementById('gtPagination');
    var summary = document.getElementById('gtSummary');

    if (summary) {
      summary.innerHTML = '<span><i class="bi bi-kanban"></i> ' + escapeHtml(plan.name) + '</span>' +
        '<span>治理表 ' + rows.length + ' 张</span>' +
        '<span>任务完成率 ' + getCompletionRate(rows) + '%</span>';
    }
    if (tableWrap) tableWrap.innerHTML = renderTable();
    if (pagination) {
      pagination.innerHTML = renderPagination();
      pagination.style.display = 'flex';
    }
  }

  function renderListShell(page) {
    page.classList.remove('gt-detail-mode');
    page.innerHTML =
      '<aside class="gt-plan-panel">' +
        '<div class="gt-panel-title"><i class="bi bi-diagram-3"></i><span>进行中的规划</span></div>' +
        '<div class="gt-plan-search"><i class="bi bi-search"></i><input id="gtPlanSearch" type="text" placeholder="搜索治理规划"></div>' +
        '<div class="gt-plan-list">' + renderPlans() + '</div>' +
      '</aside>' +
      '<section class="gt-task-panel">' +
        '<div class="gt-filter-panel">' + renderFilters() + '</div>' +
        '<div class="gt-task-head">' +
          '<div class="gt-summary" id="gtSummary"></div>' +
        '</div>' +
        '<div class="gt-table-wrap" id="gtTableWrap"></div>' +
        '<div class="ds-pagination gt-pagination" id="gtPagination"></div>' +
      '</section>';
    renderMain();
  }

  function showDetail(page, tableName) {
    var tableWrap = document.getElementById('gtTableWrap');
    var pagination = document.getElementById('gtPagination');
    if (tableWrap) tableWrap.innerHTML = renderDetail(tableName);
    if (pagination) pagination.style.display = 'none';
  }

  function resetFilters() {
    filters = {
      keyword: '',
      metadataFill: 'all',
      standardMap: 'all',
      standardAudit: 'all',
      dataQuality: 'all'
    };
  }

  function bindEvents(page) {
    page.addEventListener('click', function (e) {
      var planBtn = e.target.closest('[data-gt-plan]');
      if (planBtn) {
        activePlanId = planBtn.dataset.gtPlan;
        currentPage = 1;
        resetFilters();
        page.querySelector('.gt-filter-panel').innerHTML = renderFilters();
        page.querySelector('.gt-plan-list').innerHTML = renderPlans();
        renderMain();
        return;
      }

      var detailTab = e.target.closest('.gt-detail-view .ms-dtab');
      if (detailTab) {
        page.querySelectorAll('.gt-detail-view .ms-dtab').forEach(function (tab) {
          tab.classList.remove('active');
        });
        detailTab.classList.add('active');
        page.querySelectorAll('.gt-detail-view .ms-tab-content').forEach(function (content) {
          content.classList.remove('active');
        });
        var target = detailTab.dataset.tab;
        var targetContent = page.querySelector('.gt-detail-view .ms-tab-content[data-content="' + target + '"]');
        if (targetContent) targetContent.classList.add('active');
        return;
      }

      var qualityTab = e.target.closest('.gt-detail-view .ms-qtab');
      if (qualityTab) {
        var parent = qualityTab.closest('.ms-quality-sub-tabs');
        if (parent) {
          parent.querySelectorAll('.ms-qtab').forEach(function (tab) {
            tab.classList.remove('active');
          });
        }
        qualityTab.classList.add('active');
        return;
      }

      var actionBtn = e.target.closest('[data-gt-action]');
      if (actionBtn) {
        var action = actionBtn.dataset.gtAction;
        if (action === 'search') {
          syncFiltersFromDom();
          currentPage = 1;
          renderMain();
        } else if (action === 'reset') {
          resetFilters();
          currentPage = 1;
          page.querySelector('.gt-filter-panel').innerHTML = renderFilters();
          renderMain();
        } else if (action === 'view') {
          showDetail(page, actionBtn.dataset.gtTable || '');
        } else if (action === 'back-list') {
          renderMain();
        }
        return;
      }

      var pageBtn = e.target.closest('[data-gt-page]');
      if (pageBtn && !pageBtn.classList.contains('disabled')) {
        currentPage = Number(pageBtn.dataset.gtPage) || 1;
        renderMain();
      }
    });

    page.addEventListener('input', function (e) {
      if (e.target && e.target.id === 'gtPlanSearch') {
        page.querySelector('.gt-plan-list').innerHTML = renderPlans();
      }
    });

    page.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && e.target && e.target.matches('[data-gt-filter]')) {
        syncFiltersFromDom();
        currentPage = 1;
        renderMain();
      }
    });
  }

  return {
    html: '<div class="page-governance-task"></div>',
    init: function () {
      currentPage = 1;
      activePlanId = activePlanId || plans[0].id;
      resetFilters();
      var page = document.querySelector('.page-governance-task');
      if (!page) return;
      bindEvents(page);
      renderListShell(page);
    }
  };
})();
