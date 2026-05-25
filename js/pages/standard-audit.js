/**
 * 数据中台 V4.0 - 数据治理 / 标准审核
 */
window.DP = window.DP || {};
DP.pages = DP.pages || {};

DP.pages.standardAudit = (function () {
  var rows = {
    pending: [
      {
        title: 'shipping_method（配送方式）【交易域/订单交易/dw_ods（贴源库）/ods_order_main（订单主表）】',
        object: 'ods_order_main',
        objectCode: 'MD202605110001',
        reason: '新增配送方式字段，需同步更新表结构元数据',
        changeType: '发布',
        beforeVersion: '--',
        afterVersion: 'V1.0',
        applicant: '张伟',
        applyTime: '2026-05-10 09:30:00',
        finishTime: '--',
        status: '待审核',
        statusClass: 'ma-status-blue'
      },
      {
        title: 'customer_phone（客户手机号）【客户域/客户信息/dw_dwd（明细库）/dwd_customer_base（客户基础表）】',
        object: 'customer_phone',
        objectCode: 'MD202605100082',
        reason: '补充字段口径和脱敏说明，便于业务侧查询理解',
        changeType: '变更',
        beforeVersion: 'V1.0',
        afterVersion: 'V1.1',
        applicant: '王敏',
        applyTime: '2026-05-10 10:18:00',
        finishTime: '--',
        status: '待审核',
        statusClass: 'ma-status-blue'
      },
      {
        title: 'customer_id（客户编号）【客户域/客户信息/meta_model（元模型库）/customer_domain_model（客户域模型）】',
        object: 'customer_domain_model',
        objectCode: 'MD202605090126',
        reason: '发布客户域元模型 V2.1，支持后续资产标准化采集',
        changeType: '发布',
        beforeVersion: '--',
        afterVersion: 'V1.0',
        applicant: '李娜',
        applyTime: '2026-05-09 16:42:00',
        finishTime: '--',
        status: '待审核',
        statusClass: 'ma-status-blue'
      },
      {
        title: 'sku_id（商品编号）【交易域/订单交易/dw_dwd（明细库）/dwd_trade_order_detail_di（交易订单明细表）】',
        object: 'dwd_trade_order_detail_di',
        objectCode: 'MD202605090088',
        reason: '补充中文名称、业务说明和负责人信息',
        changeType: '变更',
        beforeVersion: 'V1.2',
        afterVersion: 'V1.3',
        applicant: '赵磊',
        applyTime: '2026-05-09 11:05:00',
        finishTime: '--',
        status: '待审核',
        statusClass: 'ma-status-blue'
      },
      {
        title: 'id_card_no（身份证号码）【客户域/身份认证/dw_dwd（明细库）/dwd_customer_identity（客户身份表）】',
        object: 'id_card_no',
        objectCode: 'MD202605080037',
        reason: '申请下线身份证号码字段，删除历史冗余元数据',
        changeType: '废止',
        beforeVersion: 'V1.0',
        afterVersion: '--',
        applicant: '陈晨',
        applyTime: '2026-05-08 14:26:00',
        finishTime: '--',
        status: '待审核',
        statusClass: 'ma-status-blue'
      }
    ],
    processed: [
      {
        title: 'order_status（订单状态）【交易域/订单交易/dw_ods（贴源库）/ods_order_main（订单主表）】',
        object: 'ods_order_main',
        objectCode: 'MD202605060021',
        reason: '补充字段变更说明并同步采集时间',
        changeType: '变更',
        beforeVersion: 'V1.0',
        afterVersion: 'V1.1',
        applicant: '张伟',
        applyTime: '2026-05-06 10:00:00',
        finishTime: '2026-05-07 11:20:00',
        status: '审核通过',
        statusClass: 'ma-status-green'
      },
      {
        title: 'gmv_amount（GMV交易金额）【经营域/经营分析/dw_dws（汇总库）/dws_trade_summary_1d（交易汇总表）】',
        object: 'gmv_amount',
        objectCode: 'MD202605050063',
        reason: '统一退款订单扣减口径，避免报表口径不一致',
        changeType: '变更',
        beforeVersion: 'V2.0',
        afterVersion: 'V2.1',
        applicant: '王敏',
        applyTime: '2026-05-05 15:10:00',
        finishTime: '2026-05-06 09:45:00',
        status: '审核通过',
        statusClass: 'ma-status-green'
      },
      {
        title: 'member_address（会员收货地址）【客户域/客户信息/dw_ods（贴源库）/ods_member_address（会员地址表）】',
        object: 'member_address',
        objectCode: 'MD202605030019',
        reason: '敏感级别说明不完整，需补充使用范围',
        changeType: '废止',
        beforeVersion: 'V1.0',
        afterVersion: '--',
        applicant: '熊华',
        applyTime: '2026-05-03 09:22:00',
        finishTime: '2026-05-04 13:35:00',
        status: '审核驳回',
        statusClass: 'ma-status-orange'
      },
      {
        title: 'campaign_id（活动编号）【营销域/活动运营/meta_model（元模型库）/marketing_domain（营销主题域）】',
        object: 'marketing_domain',
        objectCode: 'MD202605020077',
        reason: '主题域边界需调整，增加渠道投放实体',
        changeType: '发布',
        beforeVersion: '--',
        afterVersion: 'V1.0',
        applicant: '李娜',
        applyTime: '2026-05-02 17:08:00',
        finishTime: '2026-05-03 10:30:00',
        status: '审核通过',
        statusClass: 'ma-status-green'
      },
      {
        title: 'sale_date（销售日期）【经营域/经营分析/dw_ads（应用库）/ads_sales_daily_report（销售日报表）】',
        object: 'ads_sales_daily_report',
        objectCode: 'MD202604300018',
        reason: '资产负责人由营销组调整为经营分析组',
        changeType: '变更',
        beforeVersion: 'V1.0',
        afterVersion: 'V1.1',
        applicant: '赵磊',
        applyTime: '2026-04-30 13:56:00',
        finishTime: '2026-05-01 09:10:00',
        status: '审核驳回',
        statusClass: 'ma-status-orange'
      }
    ],
    started: [
      {
        title: 'pay_channel_code（支付渠道编码）【交易域/支付结算/dw_ods（贴源库）/ods_payment_record（支付流水表）】',
        object: 'ods_payment_record',
        objectCode: 'MD202605090102',
        reason: '新增支付渠道编码字段，申请同步元数据说明',
        changeType: '发布',
        beforeVersion: '--',
        afterVersion: 'V1.0',
        applicant: '张伟',
        applyTime: '2026-05-09 10:00:00',
        finishTime: '2026-05-10 10:00:00',
        status: '待审核',
        statusClass: 'ma-status-blue'
      },
      {
        title: 'product_category_name（商品类目名称）【商品域/商品基础/dw_dim（维度库）/dim_product_category（商品类目维表）】',
        object: 'product_category_name',
        objectCode: 'MD202605080075',
        reason: '修正字段释义，明确一级、二级类目展示规则',
        changeType: '变更',
        beforeVersion: 'V1.0',
        afterVersion: 'V1.1',
        applicant: '王敏',
        applyTime: '2026-05-08 10:00:00',
        finishTime: '2026-05-09 10:00:00',
        status: '待审核',
        statusClass: 'ma-status-blue'
      },
      {
        title: 'supplier_id（供应商编号）【供应链域/供应商管理/meta_model（元模型库）/supply_chain_model（供应链模型）】',
        object: 'supply_chain_model',
        objectCode: 'MD202605070044',
        reason: '申请发布供应链元模型，用于资源目录归类',
        changeType: '发布',
        beforeVersion: '--',
        afterVersion: 'V1.0',
        applicant: '李娜',
        applyTime: '2026-05-07 10:00:00',
        finishTime: '2026-05-08 10:00:00',
        status: '审核通过',
        statusClass: 'ma-status-green'
      },
      {
        title: 'region_code（区域编码）【公共域/行政区划/dw_dim（维度库）/dim_region（区域维度表）】',
        object: 'dim_region',
        objectCode: 'MD202605060031',
        reason: '补充表中文名称、业务描述和数据负责人',
        changeType: '变更',
        beforeVersion: 'V1.0',
        afterVersion: 'V1.1',
        applicant: '赵磊',
        applyTime: '2026-05-06 10:00:00',
        finishTime: '2026-05-07 10:00:00',
        status: '审核驳回',
        statusClass: 'ma-status-orange'
      },
      {
        title: 'bank_card_no（银行卡号）【交易域/支付结算/dw_dwd（明细库）/dwd_payment_account（支付账户表）】',
        object: 'bank_card_no',
        objectCode: 'MD202605050066',
        reason: '申请调整为高敏感字段，并绑定展示脱敏策略',
        changeType: '变更',
        beforeVersion: 'V1.1',
        afterVersion: 'V1.2',
        applicant: '陈晨',
        applyTime: '2026-05-05 10:00:00',
        finishTime: '2026-05-06 10:00:00',
        status: '审核通过',
        statusClass: 'ma-status-green'
      },
      {
        title: 'active_member_tag（活跃会员标签）【客户域/客户标签/dw_dws（汇总库）/dws_member_tag_1d（会员标签汇总表）】',
        object: 'active_member_tag',
        objectCode: 'MD202605040025',
        reason: '更新活跃会员统计周期和标签定义说明',
        changeType: '变更',
        beforeVersion: 'V1.0',
        afterVersion: 'V1.1',
        applicant: '周琳',
        applyTime: '2026-05-04 10:00:00',
        finishTime: '2026-05-05 10:00:00',
        status: '审核驳回',
        statusClass: 'ma-status-orange'
      },
      {
        title: 'profile_score（画像评分）【客户域/客户画像/dw_dws（汇总库）/dws_customer_profile_1d（客户画像日汇总表）】',
        object: 'dws_customer_profile_1d',
        objectCode: 'MD202605030089',
        reason: '调整资源目录归属至客户域画像目录',
        changeType: '变更',
        beforeVersion: 'V2.0',
        afterVersion: 'V2.1',
        applicant: '孙琪',
        applyTime: '2026-05-03 10:00:00',
        finishTime: '2026-05-04 10:00:00',
        status: '审核通过',
        statusClass: 'ma-status-green'
      }
    ]
  };

  function parseTitle(title) {
    var match = String(title || '').match(/^(.+?)【(.+?)\/(.+?)\/(.+?)\/(.+?)】$/);
    if (!match) {
      return { fieldName: title || '--', layer: '--', database: '--', tableName: '--' };
    }
    return {
      fieldName: match[1],
      layer: match[2] + '/' + match[3],
      database: match[4],
      tableName: match[5]
    };
  }

  function renderApplyContent(row) {
    var info = parseTitle(row.title);
    return '<div class="ma-apply-content">' +
      '<div><span>字段：</span>' + info.fieldName + '</div>' +
      '<div><span>表：</span>' + info.tableName + '</div>' +
      '<div><span>归属：</span>' + info.layer + '/' + info.database + '</div>' +
      '</div>';
  }

  function renderCurrentFieldLine(row) {
    var info = parseTitle(row.title);
    return '<div class="ma-current-field">' +
      '<span><b>字段：</b>' + info.fieldName + '</span>' +
      '<span><b>表：</b>' + info.tableName + '</span>' +
      '<span><b>归属：</b>' + info.layer + '/' + info.database + '</span>' +
      '</div>';
  }

  function renderSummary(row) {
    return '<div class="ma-reason">' + row.reason + '</div>';
  }

  function getChangeTypeClass(changeType) {
    if (changeType === '发布') return 'ma-change-add';
    if (changeType === '废止') return 'ma-change-delete';
    return 'ma-change-edit';
  }

  function renderChangeType(row) {
    return '<span class="ma-change-type ' + getChangeTypeClass(row.changeType) + '">' + row.changeType + '</span>';
  }

  function renderRows(type) {
    var showCheckbox = type === 'pending';
    var showFinishTime = type !== 'pending';
    var data = rows[type] || [];
    var html = data.map(function (row, index) {
      return '<tr>' +
        (showCheckbox ? '<td class="ma-col-ck"><input type="checkbox" data-ma-row-check data-ma-index="' + index + '" aria-label="选择第' + (index + 1) + '条"></td>' : '') +
        '<td class="ma-col-content">' + renderApplyContent(row) + '</td>' +
        '<td class="ma-col-summary">' + renderSummary(row) + '</td>' +
        '<td class="ma-col-change">' + renderChangeType(row) + '</td>' +
        '<td class="ma-col-status"><span class="ma-status ' + row.statusClass + '">' + row.status + '</span></td>' +
        '<td class="ma-col-user">' + row.applicant + '</td>' +
        '<td class="ma-col-time">' + row.applyTime + '</td>' +
        (showFinishTime ? '<td class="ma-col-time">' + row.finishTime + '</td>' : '') +
        '<td class="ma-col-action">' + (type === 'pending' ? '<button class="ma-op-btn" data-ma-action="handle" data-ma-tab="' + type + '" data-ma-index="' + index + '"><i class="bi bi-check2-square"></i><span>处理</span></button>' : '<button class="ma-op-btn" data-ma-action="detail" data-ma-tab="' + type + '" data-ma-index="' + index + '"><i class="bi bi-eye"></i><span>查看详情</span></button>') + '</td>' +
      '</tr>';
    }).join('');

    for (var i = data.length; i < 10; i++) {
      var emptyCellCount = getColumns(type).length;
      html += '<tr class="ma-empty-row">' +
        (showCheckbox ? '<td class="ma-col-ck"></td>' : '') +
        Array(emptyCellCount - (showCheckbox ? 1 : 0)).fill('<td></td>').join('') +
      '</tr>';
    }
    return html;
  }

  function getColumns(type) {
    var showCheckbox = type === 'pending';
    var showFinishTime = type !== 'pending';
    var columns = [];
    if (showCheckbox) columns.push({ cls: 'ma-col-ck', title: '<input type="checkbox" data-ma-check-all aria-label="全选">', width: 46, min: 46 });
    columns.push({ cls: 'ma-col-content', title: '申请内容', width: 300, min: 240 });
    columns.push({ cls: 'ma-col-summary', title: '申请理由', width: null, min: 180, flexible: true });
    columns.push({ cls: 'ma-col-change', title: '类型', width: 78, min: 70 });
    columns.push({ cls: 'ma-col-status', title: '流转状态', width: 138, min: 118 });
    columns.push({ cls: 'ma-col-user', title: '申请人', width: 120, min: 100 });
    columns.push({ cls: 'ma-col-time', title: '申请时间', width: 145, min: 125 });
    if (showFinishTime) columns.push({ cls: 'ma-col-time', title: '完成时间', width: 145, min: 125 });
    columns.push({ cls: 'ma-col-action', title: '操作', width: 152, min: 132 });
    return columns;
  }

  function renderColgroup(columns) {
    return '<colgroup>' + columns.map(function (col) {
      var style = col.width ? ' style="width:' + col.width + 'px;"' : '';
      var flex = col.flexible ? ' data-flexible="true"' : '';
      return '<col class="' + col.cls + '"' + style + ' data-min-width="' + col.min + '"' + flex + '>';
    }).join('') + '</colgroup>';
  }

  function renderHeader(columns) {
    return '<thead><tr>' + columns.map(function (col) {
      return '<th class="' + col.cls + '">' + col.title + '</th>';
    }).join('') + '</tr></thead>';
  }

  function renderTable(type) {
    var columns = getColumns(type);
    return '<table class="ma-table">' +
      renderColgroup(columns) +
      renderHeader(columns) +
      '<tbody id="maTableBody">' + renderRows(type) + '</tbody>' +
    '</table>';
  }

  function initResizableColumns(page) {
    var table = page.querySelector('.ma-table');
    var wrap = page.querySelector('.ma-table-wrap');
    if (!table) return;
    var cols = table.querySelectorAll('col');
    var flexibleCol = table.querySelector('col[data-flexible="true"]');

    function getFixedWidth(excludedCol) {
      return Array.prototype.reduce.call(cols, function (sum, col) {
        if (col === flexibleCol || col === excludedCol) return sum;
        return sum + (parseInt(col.style.width, 10) || col.offsetWidth || 0);
      }, 0);
    }

    function getMaxWidth(col) {
      var wrapWidth = wrap ? wrap.clientWidth : 0;
      var minReasonWidth = flexibleCol ? (parseInt(flexibleCol.getAttribute('data-min-width'), 10) || 180) : 0;
      if (!wrapWidth || col === flexibleCol) return Infinity;
      return Math.max(parseInt(col.getAttribute('data-min-width'), 10) || 80, wrapWidth - getFixedWidth(col) - minReasonWidth);
    }

    table.querySelectorAll('th').forEach(function (th, index) {
      var col = cols[index];
      if (!col) return;
      if (col.getAttribute('data-flexible') === 'true') return;
      var handle = document.createElement('span');
      handle.className = 'ma-col-resizer';
      th.appendChild(handle);

      handle.addEventListener('mousedown', function (e) {
        e.preventDefault();
        e.stopPropagation();

        var startX = e.clientX;
        var startWidth = parseInt(col.style.width, 10) || th.offsetWidth;
        var minWidth = parseInt(col.getAttribute('data-min-width'), 10) || 80;
        var maxWidth = getMaxWidth(col);
        table.classList.add('resizing');

        function onMove(moveEvent) {
          var delta = moveEvent.clientX - startX;
          var nextWidth = Math.min(maxWidth, Math.max(minWidth, startWidth + delta));
          col.style.width = nextWidth + 'px';
        }

        function onUp() {
          table.classList.remove('resizing');
          document.removeEventListener('mousemove', onMove);
          document.removeEventListener('mouseup', onUp);
        }

        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
      });
    });
  }

  var lastListTab = 'pending';

  function renderTabs(type) {
    var activeType = type || 'pending';
    return '<div class="ma-tabs">' +
      '<a class="ma-tab ' + (activeType === 'pending' ? 'active' : '') + '" data-ma-tab="pending">待处理</a>' +
      '<a class="ma-tab ' + (activeType === 'processed' ? 'active' : '') + '" data-ma-tab="processed">已处理</a>' +
      '<a class="ma-tab ' + (activeType === 'started' ? 'active' : '') + '" data-ma-tab="started">已发起</a>' +
    '</div>';
  }

  function renderToolbar(type) {
    return '<div class="ma-toolbar-left">' +
      (type === 'pending' ? '<button class="btn btn-primary ma-batch-btn" data-ma-action="batch-handle" disabled><i class="bi bi-check2-square"></i> 批量处理</button><span class="ma-selected-count">已选 0 条</span>' : '') +
    '</div>' +
    '<div class="ma-toolbar-right">' +
      '<div class="ma-filter"><span>类型:</span><select class="ma-select ma-select-sm"><option>请选择</option><option>发布</option><option>变更</option><option>废止</option></select></div>' +
      '<div class="ma-filter"><span>流程状态:</span><select class="ma-select"><option>请选择</option><option>待审核</option><option>审核通过</option><option>审核驳回</option></select></div>' +
      '<div class="ma-search-box"><input class="ma-search" type="text" placeholder="标题关键字搜索"><button class="btn btn-primary">查询</button></div>' +
    '</div>';
  }

  function setTab(page, type) {
    lastListTab = type || 'pending';
    page.querySelectorAll('.ma-tab').forEach(function (tab) {
      tab.classList.toggle('active', tab.getAttribute('data-ma-tab') === type);
    });
    page.querySelector('.ma-toolbar').innerHTML = renderToolbar(type);
    page.querySelector('.ma-table-wrap').innerHTML = renderTable(type);
    initResizableColumns(page);
    updateBatchState(page);
  }

  function getMetaGroups(row) {
    var info = parseTitle(row.title);
    return [
      {
        title: '业态分类',
        items: [
          { name: '华润中心', before: '华润置地', after: '华润置地' },
          { name: '业态', before: '商业地产', after: '商业地产' }
        ]
      },
      {
        title: '主题分类',
        items: [
          { name: '业务主题', before: '客户管理', after: '客户管理' },
          { name: '业务子主题', before: '客户资料', after: '客户信息', changed: true },
          { name: '业务细分类别', before: '客户基础资料', after: '客户基础信息', changed: true }
        ]
      },
      {
        title: '基础信息',
        items: [
          { name: '标准项编码', before: row.objectCode, after: row.objectCode },
          { name: '中文名称', before: '客户电话', after: '客户手机号', changed: true },
          { name: '英文名称', before: row.object, after: info.fieldName },
          { name: '常用名称', before: '手机', after: '手机号码', changed: true },
          { name: '代码编号', before: 'CUS_PHONE', after: 'CUS_MOBILE', changed: true },
          { name: '代码名称', before: '客户电话代码', after: '客户手机号代码', changed: true }
        ]
      },
      {
        title: '技术信息',
        items: [
          { name: '业务定义', before: '客户联系电话，用于业务人员联系客户。', after: '客户手机号，用于客户身份确认、业务联系和服务通知。', changed: true },
          { name: '业务规则', before: '允许为空，按原系统同步。', after: '非空时必须符合大陆手机号格式，展示时按敏感规则脱敏。', changed: true },
          { name: '参考标准', before: 'GB/T 35273-2020 个人信息安全规范', after: 'GB/T 35273-2020 个人信息安全规范' },
          { name: '定义依据', before: '客户主数据管理规范 V1.0', after: '客户主数据管理规范 V1.1', changed: true },
          { name: '数据类型', before: 'varchar', after: 'varchar' },
          { name: '数据格式', before: '文本', after: '手机号格式', changed: true },
          { name: '数据长度', before: '32', after: '20', changed: true }
        ]
      },
      {
        title: '管控信息',
        items: [
          { name: '业务责任部门', before: '客户运营部', after: '客户运营部' },
          { name: '参与编制部门', before: '数据治理部', after: '数据治理部' },
          { name: '版本', before: row.beforeVersion || 'V1.0', after: row.afterVersion || 'V1.1', changed: true },
          { name: '修订人', before: '王敏', after: row.applicant, changed: true },
          { name: '修订时间', before: '2026-03-15 10:00:00', after: row.applyTime, changed: true }
        ]
      },
      {
        title: '其它',
        items: [
          { name: '备注', before: '沿用原标准说明。', after: row.reason, changed: true }
        ]
      }
    ];
  }

  function renderMetaChangeRows(row) {
    var groups = getMetaGroups(row);
    return groups.map(function (group) {
      var rowsHtml = group.items.map(function (item) {
        return '<tr' + (item.changed ? ' class="ma-diff-row"' : '') + '>' +
          '<td class="ma-diff-name">' + item.name + (item.changed ? '<span>变更</span>' : '') + '</td>' +
          '<td class="ma-diff-before">' + item.before + '</td>' +
          '<td class="ma-diff-after">' + item.after + '</td>' +
        '</tr>';
      }).join('');
      return '<tr class="ma-diff-group"><td colspan="3">' + group.title + '</td></tr>' + rowsHtml;
    }).join('');
  }

  function renderMetaCurrentRows(row) {
    var groups = getMetaGroups(row);
    var valueKey = row.changeType === '废止' ? 'before' : 'after';
    return groups.map(function (group) {
      var rowsHtml = group.items.map(function (item) {
        return '<tr>' +
          '<td class="ma-diff-name">' + item.name + '</td>' +
          '<td class="ma-current-value">' + item[valueKey] + '</td>' +
        '</tr>';
      }).join('');
      return '<tr class="ma-diff-group"><td colspan="2">' + group.title + '</td></tr>' + rowsHtml;
    }).join('');
  }

  function renderAuditRecords(row, mode) {
    if (mode === 'detail') {
      var recordStateClass = row.status === '审核通过' ? 'success' : (row.status === '审核驳回' ? 'reject' : '');
      return '<div class="ma-record-list">' +
        '<div class="ma-record-item"><div class="ma-record-dot"></div><div class="ma-record-main"><div class="ma-record-top"><span class="ma-record-state ' + recordStateClass + '">' + row.status + '</span><b>王敏</b><span>' + row.finishTime + '</span></div><div class="ma-record-desc">处理说明：' + (row.status === '审核通过' ? '审核通过，标准内容符合治理规范。' : (row.status === '审核驳回' ? '审核驳回，请补充依据后重新提交。' : '等待当前审核人处理。')) + '</div></div></div>' +
        '<div class="ma-record-item"><div class="ma-record-dot"></div><div class="ma-record-main"><div class="ma-record-top"><span class="ma-record-state success">审核通过</span><b>李娜</b><span>2026-05-10 10:05:00</span></div><div class="ma-record-desc">处理说明：一级审核通过，标准口径调整合理。</div></div></div>' +
        '<div class="ma-record-item"><div class="ma-record-dot"></div><div class="ma-record-main"><div class="ma-record-top"><span class="ma-record-state submit">提交申请</span><b>张伟</b><span>' + row.applyTime + '</span></div><div class="ma-record-desc">申请说明：' + row.reason + '</div></div></div>' +
      '</div>';
    }
    return '<div class="ma-record-list">' +
      '<div class="ma-record-item"><div class="ma-record-dot muted"></div><div class="ma-record-main"><div class="ma-record-top"><span class="ma-record-state">待审核</span><b>王敏</b><span>--</span></div><div class="ma-record-desc">处理说明：等待当前审核人处理。</div></div></div>' +
      '<div class="ma-record-item"><div class="ma-record-dot"></div><div class="ma-record-main"><div class="ma-record-top"><span class="ma-record-state success">审核通过</span><b>李娜</b><span>2026-05-10 10:05:00</span></div><div class="ma-record-desc">处理说明：一级审核通过，标准口径调整合理。</div></div></div>' +
      '<div class="ma-record-item"><div class="ma-record-dot"></div><div class="ma-record-main"><div class="ma-record-top"><span class="ma-record-state submit">提交申请</span><b>张伟</b><span>' + row.applyTime + '</span></div><div class="ma-record-desc">申请说明：' + row.reason + '</div></div></div>' +
    '</div>';
  }

  function renderVersionTag(version, extraClass) {
    return '<span class="ma-version-tag ' + (extraClass || '') + '">' + (version || '--') + '</span>';
  }

  function renderHandlePage(row, mode) {
    mode = mode || 'handle';
    var isDetail = mode === 'detail';
    var isModify = row.changeType === '变更';
    var auditContentTable = isModify
      ? '<table class="ma-diff-table"><thead><tr><th>标准属性</th><th>修改前 ' + renderVersionTag(row.beforeVersion, 'ma-version-old') + '</th><th>修改后 ' + renderVersionTag(row.afterVersion, 'ma-version-next') + '</th></tr></thead><tbody>' + renderMetaChangeRows(row) + '</tbody></table>'
      : '<table class="ma-diff-table ma-current-table"><thead><tr><th>标准属性</th><th>当前内容</th></tr></thead><tbody>' + renderMetaCurrentRows(row) + '</tbody></table>';
    return '<div class="ma-handle-page">' +
      '<div class="ma-handle-header">' +
        '<div class="ma-handle-title"><button class="btn btn-outline btn-sm" data-ma-action="back-list"><i class="bi bi-arrow-left"></i> 返回</button><span>' + (isDetail ? '标准审核详情' : '标准审核处理') + '</span><span class="ma-status ' + row.statusClass + '">' + row.status + '</span></div>' +
        '<div class="ma-handle-sub"><span class="ma-current-label">当前字段：</span>' + renderCurrentFieldLine(row) + '</div>' +
      '</div>' +
      '<div class="ma-handle-body">' +
        '<section class="ma-compare-panel">' +
          '<div class="ma-panel-header"><span><i class="bi bi-file-diff"></i> 待审核内容 ' + renderChangeType(row) + '</span></div>' +
          '<div class="ma-diff-wrap">' + auditContentTable + '</div>' +
        '</section>' +
        '<aside class="ma-handle-side">' +
          '<section class="ma-apply-reason-card">' +
            '<div class="ma-panel-header"><span><i class="bi bi-chat-square-text"></i> 申请理由</span></div>' +
            '<div class="ma-apply-reason-text">' + row.reason + '</div>' +
          '</section>' +
          (isDetail ? '' : '<section class="ma-approve-panel">' +
            '<div class="ma-panel-header"><span><i class="bi bi-check2-square"></i> 审核操作</span></div>' +
            '<div class="ma-approve-body">' +
              '<div class="ma-approve-row"><span class="ma-approve-label">处理意见</span><select class="ma-approve-select"><option>审核通过</option><option>审核驳回</option></select></div>' +
              '<div class="ma-approve-label">处理说明</div>' +
              '<textarea class="ma-approve-textarea" placeholder="请输入处理说明"></textarea>' +
              '<div class="ma-approve-actions"><button class="btn btn-outline" data-ma-action="back-list">取消</button><button class="btn btn-primary" data-ma-action="submit-handle">提交处理</button></div>' +
            '</div>' +
          '</section>') +
          '<section class="ma-record-panel">' +
            '<div class="ma-panel-header"><span><i class="bi bi-clock-history"></i> 审核记录</span></div>' +
            renderAuditRecords(row, mode) +
          '</section>' +
        '</aside>' +
      '</div>' +
    '</div>';
  }

  function getSelectedPendingRows(page) {
    return Array.prototype.map.call(page.querySelectorAll('[data-ma-row-check]:checked'), function (checkbox) {
      var index = parseInt(checkbox.getAttribute('data-ma-index'), 10);
      return rows.pending[index];
    }).filter(Boolean);
  }

  function updateBatchState(page) {
    var rowChecks = page.querySelectorAll('[data-ma-row-check]');
    var checkedCount = page.querySelectorAll('[data-ma-row-check]:checked').length;
    var checkAll = page.querySelector('[data-ma-check-all]');
    var batchBtn = page.querySelector('[data-ma-action="batch-handle"]');
    var selectedCount = page.querySelector('.ma-selected-count');

    if (checkAll) {
      checkAll.checked = rowChecks.length > 0 && checkedCount === rowChecks.length;
      checkAll.indeterminate = checkedCount > 0 && checkedCount < rowChecks.length;
    }
    if (batchBtn) {
      batchBtn.disabled = checkedCount === 0;
    }
    if (selectedCount) {
      selectedCount.textContent = '已选 ' + checkedCount + ' 条';
    }
  }

  function renderBatchModal(count) {
    return '<div class="ma-batch-mask" data-ma-batch-mask>' +
      '<div class="ma-batch-modal" role="dialog" aria-modal="true" aria-label="批量处理">' +
        '<div class="ma-batch-header">' +
          '<div><h3>批量处理</h3><p>您选择 <b>' + count + '</b> 条记录</p></div>' +
          '<button class="ma-batch-close" data-ma-action="close-batch" aria-label="关闭"><i class="bi bi-x-lg"></i></button>' +
        '</div>' +
        '<div class="ma-batch-body">' +
          '<div class="ma-approve-row"><span class="ma-approve-label">处理意见</span><select class="ma-approve-select"><option>审核通过</option><option>审核驳回</option></select></div>' +
          '<div class="ma-approve-label">处理说明</div>' +
          '<textarea class="ma-approve-textarea" placeholder="请输入处理说明"></textarea>' +
        '</div>' +
        '<div class="ma-batch-footer">' +
          '<button class="btn btn-outline" data-ma-action="close-batch">取消</button>' +
          '<button class="btn btn-primary" data-ma-action="submit-batch">提交处理</button>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  function openBatchModal(page) {
    var selectedRows = getSelectedPendingRows(page);
    if (!selectedRows.length) return;
    closeBatchModal(page);
    page.insertAdjacentHTML('beforeend', renderBatchModal(selectedRows.length));
  }

  function closeBatchModal(page) {
    var modal = page.querySelector('[data-ma-batch-mask]');
    if (modal) modal.remove();
  }

  function clearSelection(page) {
    page.querySelectorAll('[data-ma-row-check]').forEach(function (checkbox) {
      checkbox.checked = false;
    });
    updateBatchState(page);
  }

  function showHandlePage(page, row, mode) {
    page.innerHTML = renderHandlePage(row, mode);
  }

  function showListPage(page, type) {
    var activeType = type || lastListTab || 'pending';
    lastListTab = activeType;
    page.innerHTML =
      renderTabs(activeType) +
      '<div class="ma-toolbar">' + renderToolbar(activeType) + '</div>' +
      '<div class="ma-table-wrap">' + renderTable(activeType) + '</div>' +
      '<div class="ma-pagination">' +
        '<div class="ma-page-left"><span>第1-10条记录，共128条记录，每页显示</span><select class="ma-page-size"><option>10</option><option>20</option><option>50</option></select><span>记录</span></div>' +
        '<div class="ma-page-nav"><a class="ma-page-btn">上一页</a><a class="ma-page-num active">1</a><a class="ma-page-num">2</a><a class="ma-page-num">3</a><a class="ma-page-num">4</a><a class="ma-page-num">5</a><span class="ma-page-ellipsis">...</span><a class="ma-page-num">89</a><a class="ma-page-btn">下一页</a></div>' +
        '<div></div>' +
      '</div>';
    bindListEvents(page);
    initResizableColumns(page);
    updateBatchState(page);
  }

  function bindListEvents(page) {
    page.querySelectorAll('.ma-tab').forEach(function (tab) {
      tab.addEventListener('click', function () {
        setTab(page, tab.getAttribute('data-ma-tab'));
      });
    });
  }

  return {
    html: '<div class="page-meta-audit page-standard-audit">' +
      renderTabs('pending') +
      '<div class="ma-toolbar">' + renderToolbar('pending') + '</div>' +
      '<div class="ma-table-wrap">' + renderTable('pending') + '</div>' +
      '<div class="ma-pagination">' +
        '<div class="ma-page-left"><span>第1-10条记录，共128条记录，每页显示</span><select class="ma-page-size"><option>10</option><option>20</option><option>50</option></select><span>记录</span></div>' +
        '<div class="ma-page-nav"><a class="ma-page-btn">上一页</a><a class="ma-page-num active">1</a><a class="ma-page-num">2</a><a class="ma-page-num">3</a><a class="ma-page-num">4</a><a class="ma-page-num">5</a><span class="ma-page-ellipsis">...</span><a class="ma-page-num">89</a><a class="ma-page-btn">下一页</a></div>' +
        '<div></div>' +
      '</div>' +
    '</div>',

    init: function () {
      var page = document.querySelector('.page-standard-audit');
      if (!page) return;
      bindListEvents(page);
      page.addEventListener('click', function (e) {
        var batchBtn = e.target.closest('[data-ma-action="batch-handle"]');
        if (batchBtn) {
          openBatchModal(page);
          return;
        }
        var closeBatchBtn = e.target.closest('[data-ma-action="close-batch"]');
        if (closeBatchBtn || e.target.hasAttribute('data-ma-batch-mask')) {
          closeBatchModal(page);
          return;
        }
        var submitBatchBtn = e.target.closest('[data-ma-action="submit-batch"]');
        if (submitBatchBtn) {
          closeBatchModal(page);
          clearSelection(page);
          return;
        }
        var handleBtn = e.target.closest('[data-ma-action="handle"]');
        if (handleBtn) {
          lastListTab = 'pending';
          var row = rows.pending[parseInt(handleBtn.getAttribute('data-ma-index'), 10)] || rows.pending[0];
          showHandlePage(page, row);
          return;
        }
        var detailBtn = e.target.closest('[data-ma-action="detail"]');
        if (detailBtn) {
          var tabKey = detailBtn.getAttribute('data-ma-tab') || 'processed';
          lastListTab = tabKey;
          var detailRow = (rows[tabKey] || rows.processed)[parseInt(detailBtn.getAttribute('data-ma-index'), 10)] || rows.processed[0];
          showHandlePage(page, detailRow, 'detail');
          return;
        }
        var backBtn = e.target.closest('[data-ma-action="back-list"]');
        if (backBtn) {
          showListPage(page, lastListTab);
          return;
        }
        var submitBtn = e.target.closest('[data-ma-action="submit-handle"]');
        if (submitBtn) {
          showListPage(page, lastListTab);
        }
      });
      page.addEventListener('change', function (e) {
        var checkAll = e.target.closest('[data-ma-check-all]');
        if (checkAll) {
          page.querySelectorAll('[data-ma-row-check]').forEach(function (checkbox) {
            checkbox.checked = checkAll.checked;
          });
          updateBatchState(page);
          return;
        }
        if (e.target.matches('[data-ma-row-check]')) {
          updateBatchState(page);
        }
      });
      initResizableColumns(page);
      updateBatchState(page);
    }
  };
})();
