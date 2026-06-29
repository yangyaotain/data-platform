/**
 * 数据中台 V4.0 - 数据服务 · 接口开发
 * 还原演示系统的接口开发列表、开发编辑页和测试弹窗。
 */
window.DP = window.DP || {};
DP.pages = DP.pages || {};

DP.pages.serviceApiDev = (function () {
  var pageEl;
  var selectedCatalog = '公共目录';

  var apiRows = [
    {
      code: '20260410101451926',
      name: 'buildertable可视化接api',
      enName: 'buildertable',
      category: '公共目录,我的目录/工单数据',
      type: '开发接口',
      version: 'V2',
      publishStatus: '开发',
      auditStatus: '',
      updateTime: '2026-04-10 18:38:46',
      desc: 'buildertable可视化接api'
    },
    {
      code: '20260410103647154',
      name: 'employee_total_bynameAPI接口',
      enName: 'employee_total_byname',
      category: '公共目录,我的目录,我的目录/物流数据,我的目录/中电数据,我的目录/工单数据',
      type: '开发接口',
      version: 'V2',
      publishStatus: '已上架',
      auditStatus: '上架通过',
      updateTime: '2026-04-10 10:16:54',
      desc: 'employee_total_byname'
    },
    {
      code: '20260410103647154',
      name: 'employee_total_bynameAPI接口',
      enName: 'employee_total_byname',
      category: '公共目录,我的目录,我的目录/物流数据,我的目录/中电数据,我的目录/工单数据',
      type: '开发接口',
      version: 'V1',
      publishStatus: '已上架',
      auditStatus: '上架通过',
      updateTime: '2026-04-10 10:16:36',
      desc: 'employee_total_byname'
    },
    {
      code: '20260410102500484',
      name: 'devicegroupaddressAPI接口',
      enName: 'devicegroupaddress',
      category: '公共目录,我的目录/中电数据,我的目录/工单数据',
      type: '开发接口',
      version: 'V1',
      publishStatus: '已上架',
      auditStatus: '上架通过',
      updateTime: '2026-04-10 09:57:35',
      desc: 'devicegroupaddress'
    },
    {
      code: '20260410101451926',
      name: 'buildertable可视化接api',
      enName: 'buildertable',
      category: '公共目录,我的目录/工单数据',
      type: '开发接口',
      version: 'V1',
      publishStatus: '已上架',
      auditStatus: '上架通过',
      updateTime: '2026-04-10 09:47:31',
      desc: 'buildertable可视化接api'
    }
  ];

  function escapeHtml(text) {
    return String(text == null ? '' : text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function statusClass(status) {
    if (status === '已上架' || status === '上架通过') return 'success';
    if (status === '开发') return 'processing';
    if (status === '待上架' || status === '上架待审核' || status === '下架待审核') return 'warning';
    if (status === '上架驳回' || status === '下架驳回') return 'danger';
    return 'default';
  }

  function getFilteredRows() {
    var publish = pageEl.querySelector('[data-svc-filter="publish"]').value;
    var audit = pageEl.querySelector('[data-svc-filter="audit"]').value;
    var keyword = pageEl.querySelector('[data-svc-filter="keyword"]').value.trim().toLowerCase();
    return apiRows.filter(function (row) {
      if (publish && row.publishStatus !== publish) return false;
      if (audit && row.auditStatus !== audit) return false;
      if (selectedCatalog && selectedCatalog !== '公共目录' && row.category.indexOf(selectedCatalog) < 0) return false;
      if (keyword) {
        var haystack = [row.code, row.name, row.enName].join(' ').toLowerCase();
        if (haystack.indexOf(keyword) < 0) return false;
      }
      return true;
    });
  }

  function renderStatus(text, extraClass) {
    if (!text) return '<span class="svc-empty">--</span>';
    return '<span class="svc-status ' + statusClass(text) + (extraClass ? ' ' + extraClass : '') + '">' + escapeHtml(text) + '</span>';
  }

  function renderRow(row, index) {
    var action = row.publishStatus === '开发'
      ? '<button class="svc-row-action danger" data-svc-action="delete" data-index="' + index + '"><i class="bi bi-trash3"></i><span>删除</span></button>'
      : '<button class="svc-row-action" data-svc-action="test" data-index="' + index + '"><i class="bi bi-link-45deg"></i><span>测试</span></button>';
    return '' +
      '<tr>' +
        '<td class="svc-check-col"><input type="checkbox" class="svc-row-check"></td>' +
        '<td class="svc-code-col">' + escapeHtml(row.code) + '</td>' +
        '<td class="svc-name-col" title="' + escapeHtml(row.name) + '">' + escapeHtml(row.name) + '</td>' +
        '<td class="svc-en-col" title="' + escapeHtml(row.enName) + '">' + escapeHtml(row.enName) + '</td>' +
        '<td class="svc-category-col" title="' + escapeHtml(row.category) + '">' + escapeHtml(row.category) + '</td>' +
        '<td>' + escapeHtml(row.type) + '</td>' +
        '<td>' + escapeHtml(row.version) + '</td>' +
        '<td>' + renderStatus(row.publishStatus) + '</td>' +
        '<td>' + renderStatus(row.auditStatus) + '</td>' +
        '<td>' + escapeHtml(row.updateTime) + '</td>' +
        '<td class="svc-desc-col" title="' + escapeHtml(row.desc) + '">' + escapeHtml(row.desc) + '</td>' +
        '<td class="svc-action-col">' +
          '<button class="svc-row-action" data-svc-action="edit" data-index="' + index + '"><i class="bi bi-pencil-square"></i><span>修改</span></button>' +
          action +
        '</td>' +
      '</tr>';
  }

  function renderTable() {
    var tbody = pageEl.querySelector('#svcApiTbody');
    var total = pageEl.querySelector('[data-svc-total]');
    if (!tbody || !total) return;
    var rows = getFilteredRows();
    if (!rows.length) {
      tbody.innerHTML = '<tr><td colspan="12" class="svc-empty-row">暂无匹配的接口开发记录</td></tr>';
    } else {
      tbody.innerHTML = rows.map(renderRow).join('');
    }
    total.textContent = '共 ' + rows.length + ' 条';
    var checkAll = pageEl.querySelector('#svcApiCheckAll');
    if (checkAll) checkAll.checked = false;
  }

  function showToast(text, type) {
    var old = pageEl.querySelector('.svc-toast');
    if (old) old.remove();
    var toast = document.createElement('div');
    toast.className = 'svc-toast ' + (type || 'info');
    toast.innerHTML = '<i class="bi bi-info-circle"></i><span>' + escapeHtml(text) + '</span>';
    pageEl.appendChild(toast);
    window.setTimeout(function () {
      if (toast.parentNode) toast.remove();
    }, 1800);
  }

  function selectedCount() {
    return pageEl.querySelectorAll('.svc-row-check:checked').length;
  }

  function editorValue(row, key, fallback) {
    return escapeHtml(row && row[key] ? row[key] : fallback);
  }

  function lineNumbers(code) {
    var count = Math.max(String(code || '').split('\n').length, 1);
    var html = '';
    for (var i = 1; i <= count; i += 1) {
      html += '<div>' + i + '</div>';
    }
    return html;
  }

  function highlightCode(code, language) {
    var html = escapeHtml(code || '');
    if (language === 'sql') {
      html = html.replace(/(--.*)$/gm, '<span class="dp-sql-comment">$1</span>');
      html = html.replace(/('(?:''|[^'])*')/g, '<span class="dp-sql-string">$1</span>');
      html = html.replace(/\b(select|from|where|and|or|left|right|inner|join|on|group|by|order|limit|offset|case|when|then|else|end|as|count|sum|max|min|avg|distinct|insert|update|delete|into|values|set|is|not|null|like|in)\b/gi, '<span class="dp-sql-keyword">$1</span>');
      html = html.replace(/(\$\{[\w.]+\})/g, '<span class="dp-sql-var">$1</span>');
      return html;
    }
    if (language === 'python') {
      html = html.replace(/(#.*)$/gm, '<span class="dp-sql-comment">$1</span>');
      html = html.replace(/\b(def|return|import|from|as|if|elif|else|for|while|in|try|except|with|class|True|False|None)\b/g, '<span class="dp-sql-keyword">$1</span>');
      html = html.replace(/(&quot;.*?&quot;|&#39;.*?&#39;)/g, '<span class="dp-sql-string">$1</span>');
      return html;
    }
    return html;
  }

  function renderCodeEditor(opts) {
    opts = opts || {};
    var code = opts.code || '';
    var title = opts.title || '';
    var language = opts.language || 'sql';
    return '' +
      '<div class="dp-sql-editor svc-sql-editor theme-dark" data-svc-public-editor style="font-size:14px;">' +
        '<div class="dp-sql-editor-toolbar">' +
          '<span class="svc-sql-editor-title">' + escapeHtml(title) + '</span>' +
          '<select class="dp-sql-editor-select" data-svc-editor-theme><option value="dark" selected>暗色 - One Dark</option><option value="light">亮色 - Light</option></select>' +
          '<select class="dp-sql-editor-select" data-svc-editor-font><option>12px</option><option>13px</option><option selected>14px</option><option>15px</option><option>16px</option><option>18px</option><option>20px</option><option>22px</option><option>24px</option></select>' +
          '<button class="dp-sql-editor-btn" type="button" data-svc-editor-action="format"><i class="bi bi-sliders"></i><span>格式化</span></button>' +
          '<button class="dp-sql-editor-btn" type="button" data-svc-editor-action="copy"><i class="bi bi-clipboard"></i><span>复制</span></button>' +
          '<button class="dp-sql-editor-btn" type="button" data-svc-editor-action="search"><i class="bi bi-search"></i><span>搜索</span></button>' +
          '<button class="dp-sql-editor-btn" type="button" data-svc-editor-action="fullscreen"><i class="bi bi-arrows-fullscreen"></i><span>全屏</span></button>' +
        '</div>' +
        '<div class="dp-sql-editor-searchbar">' +
          '<input class="dp-sql-editor-input" type="text" placeholder="查找...">' +
          '<button class="dp-sql-editor-btn" type="button">下一个</button>' +
          '<button class="dp-sql-editor-btn" type="button">上一个</button>' +
          '<label class="dp-sql-editor-check"><input type="checkbox"> 区分大小写</label>' +
          '<input class="dp-sql-editor-input" type="text" placeholder="替换...">' +
          '<button class="dp-sql-editor-btn" type="button">替换</button>' +
          '<span class="dp-sql-editor-close" data-svc-editor-action="close-search"><i class="bi bi-x"></i></span>' +
        '</div>' +
        '<div class="dp-sql-editor-wrap">' +
          '<div class="dp-sql-editor-gutter">' + lineNumbers(code) + '</div>' +
          '<div class="dp-sql-editor-content" contenteditable="true" spellcheck="false">' + highlightCode(code, language) + '</div>' +
        '</div>' +
      '</div>';
  }

  function isVisualRow(row) {
    return !!(row && String(row.name || '').indexOf('可视化') > -1);
  }

  function renderSourceTree(mode) {
    var sqlTables = [
      'a_template_city_distance',
      'ads_trans_order_stats',
      'base_complex',
      'base_dic',
      'base_organ',
      'base_region_info',
      'employee_info',
      'employee_total',
      'employee_total_byname',
      'express_courier',
      'express_courier_complex',
      'transport_task',
      'truck_driver',
      'user_address'
    ];
    var visualTables = [
      'application',
      'appversion',
      'attributes',
      'attributevalues',
      'attrtypes',
      'buildertable',
      'buildertablecolumn',
      'building',
      'buildinglog',
      'businessdevicetype',
      'category'
    ];
    var rows = mode === 'visual' ? visualTables : sqlTables;
    var fields = mode === 'visual'
      ? ['Id', 'TableName', 'Comment', 'DetailTableName', 'DetailComment', 'ClassName']
      : ['id', 'city_no1', 'city_no2', 'distance', 'remark'];
    return '' +
      '<div class="svc-sql-left">' +
        '<div class="svc-sql-search"><i class="bi bi-search"></i><input placeholder="请输入关键字"></div>' +
        '<div class="svc-tree-list">' +
          rows.map(function (name, index) {
            var selected = mode === 'visual' && name === 'buildertable';
            var expanded = index === 0 || selected;
            return '' +
              '<div class="svc-tree-node' + (expanded ? ' expanded' : '') + '">' +
                '<div class="svc-tree-item' + (selected ? ' selected' : '') + '" data-svc-tree-toggle>' +
                  '<i class="bi bi-chevron-right svc-tree-caret"></i>' +
                  (mode === 'visual' ? '<span class="svc-tree-check' + (selected ? ' checked' : '') + '"><i class="bi bi-check"></i></span>' : '') +
                  '<i class="bi bi-table"></i>' +
                  '<span title="' + escapeHtml(name) + '">' + escapeHtml(name) + '</span>' +
                '</div>' +
                '<div class="svc-tree-fields">' +
                  fields.map(function (field) {
                    return '<div class="svc-tree-field"><span>A</span><em>' + escapeHtml(field) + '</em></div>';
                  }).join('') +
                '</div>' +
              '</div>';
          }).join('') +
        '</div>' +
      '</div>';
  }

  function renderDataSourcePicker(value) {
    var items = [
      ['中电数治演示', 0, true],
      ['业务系统', 1, true],
      ['ODS-贴源层', 1, false],
      ['DWS-数据汇总层', 1, false],
      ['ADS-应用层', 1, false],
      ['系统业务库', 1, true],
      ['DWD-数据明细层', 1, false]
    ];
    return '' +
      '<div class="svc-datasource-picker" data-svc-ds-picker>' +
        '<input readonly value="' + escapeHtml(value || '') + '" placeholder="请选择数据源" data-svc-ds-value>' +
        '<i class="bi bi-chevron-down"></i>' +
        '<div class="svc-ds-dropdown" data-svc-ds-dropdown hidden>' +
          '<div class="svc-sql-search"><i class="bi bi-search"></i><input placeholder="请输入关键字" data-svc-ds-search></div>' +
          '<div class="svc-ds-tree">' +
            items.map(function (item) {
              return '' +
                '<div class="svc-ds-option" data-svc-ds-option="' + escapeHtml(item[0]) + '" style="padding-left:' + (12 + item[1] * 20) + 'px">' +
                  (item[2] ? '<i class="bi bi-chevron-down"></i>' : '<span class="svc-ds-spacer"></span>') +
                  '<span>' + escapeHtml(item[0]) + '</span>' +
                '</div>';
            }).join('') +
          '</div>' +
        '</div>' +
      '</div>';
  }

  function renderVisualPreviewTable() {
    var rows = [
      ['002b3f2c-135f...', 'UserJobExperi...', '', '', '', 'UserJobExperi...', 'AIERP.Repository'],
      ['004a2a9b-419...', 'WorkOrderGo...', '', '', '', 'WorkOrderGo...', 'AIERP.Repository'],
      ['046e63f4-fb9f...', 'Building', '', '', '', 'Building', 'AIERP.Repository'],
      ['04ff6b66-f96a...', 'SysClientDuty', '', '', '', 'SysClientDuty', 'AIERP.Repository'],
      ['07039d4d-9af...', 'Skill', '', '', '', 'Skill', 'AIERP.Repository'],
      ['0abdd41f-cbf6...', 'SysPostRank', '', '', '', 'SysPostRank', 'AIERP.Repository'],
      ['10501639-9bf5...', 'ReportProject...', '', '', '', 'ReportProject...', 'AIERP.Repository'],
      ['10b4f0a0-3f13...', 'InboundOrder...', '', '', '', 'InboundOrder...', 'AIERP.Repository'],
      ['11bda799-f96a...', 'SysDecisionCh...', '', '', '', 'SysDecisionCh...', 'AIERP.Repository'],
      ['1751d517-6d2...', 'Category', '', '', '', 'Category', 'AIERP.Repository']
    ];
    return '' +
      '<div class="svc-preview-wrap">' +
        '<table class="svc-preview-table">' +
          '<thead><tr><th>Id</th><th>TableName</th><th>Comment</th><th>DetailTableNa...</th><th>DetailComment</th><th>ClassName</th><th>Namespace</th></tr></thead>' +
          '<tbody>' + rows.map(function (row) {
            return '<tr>' + row.map(function (cell) { return '<td>' + escapeHtml(cell) + '</td>'; }).join('') + '</tr>';
          }).join('') + '</tbody>' +
        '</table>' +
      '</div>';
  }

  function renderModePanel(mode, row, isNew) {
    row = row || {};
    if (mode === 'python') {
      return '' +
        '<div class="svc-sql-title">' +
          '<span>Python脚本</span>' +
          '<button type="button" data-svc-editor-action="run-test"><i class="bi bi-play-circle"></i> 测试执行</button>' +
        '</div>' +
        '<div class="svc-sql-layout">' +
          renderSourceTree('python') +
          renderCodeEditor({
            language: 'python',
            code: isNew ? 'def main(params):\n    result = []\n    return {\n        "code": "200",\n        "msg": "success",\n        "obj": result\n    }' : 'def main(params):\n    name = params.get("name")\n    rows = query("select * from ' + (row.enName || 'api_table') + ' where name = ${name}")\n    return {\n        "code": "200",\n        "msg": "success",\n        "obj": rows\n    }'
          }) +
        '</div>';
    }

    if (mode === 'visual') {
      return '' +
        '<div class="svc-sql-title svc-visual-title">' +
          '<span>可视化配置</span>' +
          '<button type="button" data-svc-editor-action="run-test"' + (isNew ? ' disabled' : '') + '><i class="bi bi-play-circle"></i> 测试执行</button>' +
          '<em>仅预览前10条数据</em>' +
        '</div>' +
        '<div class="svc-visual-layout">' +
          renderSourceTree('visual') +
          renderVisualPreviewTable() +
        '</div>';
    }

    return '' +
      '<div class="svc-sql-title">' +
        '<span>自定义SQL（参数引入格式：${param}）</span>' +
        '<strong>如果查询结果集较大时请增加分页参数，否则可能导致查询崩溃</strong>' +
        '<button type="button" data-svc-editor-action="run-test"><i class="bi bi-play-circle"></i> 测试执行</button>' +
      '</div>' +
      '<div class="svc-sql-layout">' +
        renderSourceTree('sql') +
        renderCodeEditor({
          language: 'sql',
          code: isNew ? '' : 'select * from tms_demo.' + (row.enName || 'employee_total_byname') + ' LIMIT ${limit}'
        }) +
      '</div>';
  }

  function renderParamTable(mode, activeKey, row, isNew) {
    if (mode === 'visual') {
      return '' +
        '<div class="svc-param-panel">' +
          '<button type="button" class="svc-add-param" data-svc-editor-action="add-param"><i class="bi bi-plus-circle"></i> 新增参数</button>' +
          '<table class="svc-param-table svc-param-table-visual">' +
            '<thead><tr><th>参数名</th><th>关联字段</th><th>逻辑操作</th><th>必填</th><th>数据类型</th><th>默认值</th><th>参数说明</th><th>操作</th></tr></thead>' +
            '<tbody><tr><td colspan="8"><div class="svc-empty-state"><i class="bi bi-inbox"></i><span>暂无数据</span></div></td></tr></tbody>' +
          '</table>' +
        '</div>';
    }
    var hasLimit = !isNew && activeKey === 'query';
    return '' +
      '<div class="svc-param-panel">' +
        '<button type="button" class="svc-add-param" data-svc-editor-action="add-param"><i class="bi bi-plus-circle"></i> 新增参数</button>' +
        '<table class="svc-param-table">' +
          '<thead><tr><th>参数名</th><th>必填</th><th>数据类型</th><th>默认值</th><th>参数说明</th><th>操作</th></tr></thead>' +
          '<tbody>' + (hasLimit
            ? '<tr><td><input value="limit" placeholder="50个字符以内"></td><td><select><option selected>是</option><option>否</option></select></td><td><select><option selected>string</option><option>number</option><option>object</option></select></td><td><input value="10" placeholder="100个字符以内"></td><td><input placeholder="100个字符以内"></td><td><button type="button" class="svc-row-action danger" data-svc-editor-action="remove-param"><i class="bi bi-trash3"></i><span>删除</span></button></td></tr>'
            : '<tr><td colspan="6"><div class="svc-empty-state"><i class="bi bi-inbox"></i><span>暂无数据</span></div></td></tr>') + '</tbody>' +
        '</table>' +
      '</div>';
  }

  function renderParamSection(mode, row, isNew) {
    var activeKey = !isNew && mode === 'sql' ? 'query' : 'header';
    var tabs = mode === 'visual'
      ? [['header', 'Header参数'], ['path', 'Path参数'], ['query', 'Query参数']]
      : [['header', 'Header参数'], ['path', 'Path参数'], ['query', 'Query参数'], ['body', 'Body参数']];
    return '' +
      '<div class="svc-param-tabs">' +
        tabs.map(function (tab) {
          return '<button class="' + (tab[0] === activeKey ? 'active' : '') + '" data-svc-param-tab="' + tab[0] + '">' + tab[1] + '</button>';
        }).join('') +
      '</div>' +
      '<div class="svc-param-panel-wrap">' +
        renderParamTable(mode, activeKey, row, isNew) +
      '</div>';
  }

  function renderSecureRows(mode, row, isNew) {
    if (isNew) {
      return '<tr><td colspan="6"><div class="svc-empty-state"><i class="bi bi-inbox"></i><span>暂无数据</span></div></td></tr>';
    }
    var rows = mode === 'visual'
      ? [['Id', 'varchar'], ['TableName', 'varchar'], ['Comment', 'varchar'], ['DetailTableName', 'varchar'], ['DetailComment', 'varchar'], ['ClassName', 'varchar']]
      : [['realname', 'VARCHAR'], ['cnt', 'INT'], ['createTime', 'DATETIME']];
    return rows.map(function (item) {
      return '' +
        '<tr>' +
          '<td>' + escapeHtml(item[0]) + '</td>' +
          '<td>' + escapeHtml(item[1]) + '</td>' +
          '<td><div class="svc-cell-picker"><input><i class="bi bi-chevron-down"></i></div></td>' +
          '<td>未设置</td>' +
          '<td><div class="svc-cell-picker"><input><i class="bi bi-chevron-down"></i></div></td>' +
          '<td><input class="svc-cell-input" placeholder="500个字符以内"></td>' +
        '</tr>';
    }).join('');
  }

  function renderReturnExample(mode, row, isNew) {
    if (isNew) return '{\n  "code": "200",\n  "msg": "success",\n  "obj": []\n}';
    if (mode === 'visual') {
      return '{\n  "code": 1,\n  "msg": "成功",\n  "obj": [\n    {\n      "Id": "002b3f2c-135f...",\n      "TableName": "UserJobExperience",\n      "ClassName": "UserJobExperience"\n    }\n  ]\n}';
    }
    return '{\n  "code": 1,\n  "msg": "成功",\n  "obj": [\n    {\n      "realname": "上官娅琦",\n      "cnt": "1",\n      "createTime": ""\n    }\n  ]\n}';
  }

  function renderEditorPage(row, isNew) {
    row = row || {};
    var currentMode = isVisualRow(row) ? 'visual' : 'sql';
    var endpoint = row.enName ? '/' + row.enName : '/121';
    var requestMethod = !isNew && currentMode === 'sql' ? 'POST' : 'GET';
    var cacheEnabled = !isNew && currentMode === 'visual';
    var dataSourceName = isNew ? '' : (currentMode === 'visual' ? '系统业务库' : '业务系统/中电数治业务系统');
    pageEl.innerHTML = '' +
      '<div class="svc-editor-page">' +
        '<div class="svc-editor-header">' +
          '<div class="svc-editor-tabs">' +
            '<button class="active" data-svc-editor-tab="develop">接口开发</button>' +
            '<button data-svc-editor-tab="meta">元数据信息</button>' +
          '</div>' +
          '<div class="svc-editor-head-actions">' +
            '<button class="btn btn-outline" data-svc-editor-action="cancel"><i class="bi bi-x-circle"></i> 取 消</button>' +
            (!isNew ? '<button class="btn btn-outline" data-svc-editor-action="save-as"><i class="bi bi-files"></i> 另存为</button>' : '') +
            '<button class="btn btn-primary" data-svc-editor-action="save"><i class="bi bi-check2-circle"></i> 保 存</button>' +
          '</div>' +
        '</div>' +
        '<div class="svc-editor-scroll">' +
          '<section class="svc-editor-tab-panel active" data-svc-editor-panel="develop">' +
            '<div class="svc-dev-form">' +
              '<div class="svc-form-item"><label>接口方式</label><select disabled><option>REST</option></select></div>' +
              '<div class="svc-form-item"><label>数据格式</label><select disabled><option>JSON</option></select></div>' +
              '<div class="svc-form-item"><label><em>*</em> 数据编码</label><select><option>UTF-8</option><option>GBK</option><option>ISO-8859-1</option></select></div>' +
              '<div class="svc-form-item wide"><label><em>*</em> 请求URL</label><div class="svc-url-input"><span>http://192.168.61.111:30042/{接口标识}</span><input value="' + escapeHtml(endpoint) + '"></div></div>' +
              '<div class="svc-form-item"><label><em>*</em> 请求方式</label><select><option' + (requestMethod === 'GET' ? ' selected' : '') + '>GET</option><option' + (requestMethod === 'POST' ? ' selected' : '') + '>POST</option></select></div>' +
              '<div class="svc-form-item"><label>接口缓存</label><select data-svc-cache-select><option' + (!cacheEnabled ? ' selected' : '') + '>否</option><option' + (cacheEnabled ? ' selected' : '') + '>是</option></select></div>' +
              '<div class="svc-form-item svc-cache-extra" data-svc-cache-extra hidden><label>缓存有效期</label><input type="number" placeholder="请输入"></div>' +
              '<div class="svc-form-item svc-cache-extra svc-cache-unit" data-svc-cache-extra hidden><label></label><select><option>请选择</option><option>秒</option><option>分钟</option><option>小时</option><option>天</option></select></div>' +
              '<div class="svc-form-item"><label>数据加密</label><select><option>否</option><option>是</option></select></div>' +
              '<div class="svc-form-item svc-break-row"><label>数据源</label>' + renderDataSourcePicker(dataSourceName) + '</div>' +
              '<div class="svc-form-item"><label></label><select data-svc-mode-select>' +
                '<option value="visual"' + (currentMode === 'visual' ? ' selected' : '') + '>可视化配置</option>' +
                '<option value="sql"' + (currentMode === 'sql' ? ' selected' : '') + '>自定义SQL</option>' +
                '<option value="python"' + (currentMode === 'python' ? ' selected' : '') + '>Python脚本</option>' +
              '</select></div>' +
            '</div>' +
            '<div class="svc-mode-panel" data-svc-mode-panel>' + renderModePanel(currentMode, row, isNew) + '</div>' +
            '<div class="svc-param-section" data-svc-param-section>' + renderParamSection(currentMode, row, isNew) + '</div>' +
            '<h3 class="svc-section-title">返回数据</h3>' +
            '<table class="svc-return-table">' +
              '<thead><tr><th>参数</th><th>类型</th><th>说明</th></tr></thead>' +
              '<tbody><tr><td>code</td><td>String</td><td>返回码</td></tr><tr><td>msg</td><td>String</td><td>返回描述</td></tr><tr><td>obj</td><td>obj</td><td>返回数据</td></tr></tbody>' +
            '</table>' +
            '<table class="svc-return-table svc-secure-table">' +
              '<thead><tr><th>参数</th><th>数据类型</th><th>脱敏规则</th><th>脱敏例外</th><th>加密规则</th><th>描述</th></tr></thead>' +
              '<tbody>' + renderSecureRows(currentMode, row, isNew) + '</tbody>' +
            '</table>' +
            '<h3 class="svc-section-title">返回数据示例</h3>' +
            renderCodeEditor({ language: 'json', code: renderReturnExample(currentMode, row, isNew) }) +
          '</section>' +
          '<section class="svc-editor-tab-panel" data-svc-editor-panel="meta">' +
            '<div class="svc-meta-form">' +
              '<div class="svc-meta-item"><label>数据编码</label><input disabled value="' + editorValue(row, 'code', '') + '"></div>' +
              '<div class="svc-meta-item"><label><em>*</em> 数据名称</label><input value="' + editorValue(row, 'name', '') + '"></div>' +
              '<div class="svc-meta-item"><label>英文名称</label><input value="' + editorValue(row, 'enName', '') + '"></div>' +
              '<div class="svc-meta-item wide"><label>数据摘要</label><textarea>' + editorValue(row, 'desc', '') + '</textarea></div>' +
              '<div class="svc-meta-item"><label>版本</label><input disabled value="' + editorValue(row, 'version', 'V1') + '"></div>' +
              '<div class="svc-meta-item"><label><em>*</em> 数据分类</label><div class="svc-picker"><input value="' + editorValue(row, 'category', '') + '"><i class="bi bi-chevron-down"></i></div></div>' +
              '<div class="svc-meta-item"><label><em>*</em> 数据领域</label><select><option>工单数据</option><option>物流数据</option><option>中电数据</option></select></div>' +
              '<div class="svc-meta-item"><label>上架时间</label><input disabled value="' + (row.publishStatus === '已上架' ? '2026-04-10 10:16:54' : '') + '"></div>' +
              '<div class="svc-meta-item"><label>更新时间</label><input disabled value="' + editorValue(row, 'updateTime', '') + '"></div>' +
              '<div class="svc-meta-item"><label>质量评分</label><input disabled value="--"></div>' +
              '<div class="svc-meta-item"><label>浏览量</label><input disabled value="0"></div>' +
              '<div class="svc-meta-item"><label>推送量</label><input disabled value="0"></div>' +
              '<div class="svc-meta-item"><label>调用量</label><input disabled value="12"></div>' +
              '<div class="svc-meta-item"><label>管理单位</label><input value="数据运营中心"></div>' +
              '<div class="svc-meta-item"><label>数据来源</label><input disabled value="接口开发"></div>' +
              '<div class="svc-meta-item"><label>联系电话</label><input value="0571-88886666"></div>' +
              '<div class="svc-meta-item"><label>更新频率</label><select><option>实时</option><option>每日</option><option>每周</option><option>不定期</option></select></div>' +
              '<div class="svc-meta-item"><label>申请量</label><input disabled value="0"></div>' +
            '</div>' +
          '</section>' +
        '</div>' +
      '</div>';
    bindEditorEvents(row, isNew);
  }

  function bindEditorActionButtons(scope) {
    (scope || pageEl).querySelectorAll('[data-svc-editor-action]').forEach(function (btn) {
      var action = btn.dataset.svcEditorAction;
      if (action === 'cancel' || action === 'save' || btn.dataset.svcActionBound === 'true') return;
      btn.dataset.svcActionBound = 'true';
      btn.addEventListener('click', function () {
        if (action === 'add-param') showToast('已新增一行参数配置', 'success');
        else if (action === 'run-test') showToast('测试执行成功', 'success');
        else if (action === 'search') {
          var editor = btn.closest('.dp-sql-editor');
          if (editor) editor.classList.toggle('search-open');
        }
        else if (action === 'close-search') {
          var targetEditor = btn.closest('.dp-sql-editor');
          if (targetEditor) targetEditor.classList.remove('search-open');
        }
        else showToast(btn.textContent.trim() + '已触发', 'info');
      });
    });

    (scope || pageEl).querySelectorAll('[data-svc-editor-theme]').forEach(function (select) {
      if (select.dataset.svcThemeBound === 'true') return;
      select.dataset.svcThemeBound = 'true';
      select.addEventListener('change', function () {
        var editor = select.closest('.dp-sql-editor');
        if (!editor) return;
        editor.classList.toggle('theme-light', select.value === 'light');
        editor.classList.toggle('theme-dark', select.value !== 'light');
      });
    });

    (scope || pageEl).querySelectorAll('[data-svc-editor-font]').forEach(function (select) {
      if (select.dataset.svcFontBound === 'true') return;
      select.dataset.svcFontBound = 'true';
      select.addEventListener('change', function () {
        var editor = select.closest('.dp-sql-editor');
        if (editor) editor.style.fontSize = select.value;
      });
    });
  }

  function bindEditorWidgets(scope, row, isNew) {
    (scope || pageEl).querySelectorAll('[data-svc-tree-toggle]').forEach(function (item) {
      if (item.dataset.svcTreeBound === 'true') return;
      item.dataset.svcTreeBound = 'true';
      item.addEventListener('click', function () {
        var node = item.closest('.svc-tree-node');
        if (node) node.classList.toggle('expanded');
      });
    });

    pageEl.querySelectorAll('[data-svc-ds-picker]').forEach(function (picker) {
      if (picker.dataset.svcDsBound === 'true') return;
      picker.dataset.svcDsBound = 'true';
      var dropdown = picker.querySelector('[data-svc-ds-dropdown]');
      var valueInput = picker.querySelector('[data-svc-ds-value]');
      picker.addEventListener('click', function (event) {
        event.stopPropagation();
        if (event.target.closest('[data-svc-ds-option]')) return;
        if (dropdown) dropdown.hidden = !dropdown.hidden;
      });
      picker.querySelectorAll('[data-svc-ds-option]').forEach(function (option) {
        option.addEventListener('click', function (event) {
          event.stopPropagation();
          var text = option.dataset.svcDsOption || option.textContent.trim();
          if (valueInput) valueInput.value = text.indexOf('/') > -1 ? text : (text === '业务系统' ? '业务系统/中电数治业务系统' : text);
          if (dropdown) dropdown.hidden = true;
          var modeSelect = pageEl.querySelector('[data-svc-mode-select]');
          var panel = pageEl.querySelector('[data-svc-mode-panel]');
          if (modeSelect && panel) {
            panel.innerHTML = renderModePanel(modeSelect.value, row, isNew);
            bindEditorActionButtons(panel);
            bindEditorWidgets(panel, row, isNew);
          }
        });
      });
      var search = picker.querySelector('[data-svc-ds-search]');
      if (search) {
        search.addEventListener('input', function () {
          var keyword = search.value.trim().toLowerCase();
          picker.querySelectorAll('[data-svc-ds-option]').forEach(function (option) {
            option.style.display = !keyword || option.textContent.toLowerCase().indexOf(keyword) > -1 ? '' : 'none';
          });
        });
      }
    });
  }

  function bindParamTabs(row, isNew) {
    var modeSelect = pageEl.querySelector('[data-svc-mode-select]');
    var mode = modeSelect ? modeSelect.value : 'sql';
    pageEl.querySelectorAll('[data-svc-param-tab]').forEach(function (tab) {
      if (tab.dataset.svcParamBound === 'true') return;
      tab.dataset.svcParamBound = 'true';
      tab.addEventListener('click', function () {
        pageEl.querySelectorAll('[data-svc-param-tab]').forEach(function (item) { item.classList.remove('active'); });
        tab.classList.add('active');
        var wrap = pageEl.querySelector('.svc-param-panel-wrap');
        if (wrap) wrap.innerHTML = renderParamTable(mode, tab.dataset.svcParamTab, row, isNew);
        bindEditorEventsForDynamic();
      });
    });
  }

  function bindEditorEvents(row, isNew) {
    pageEl.querySelectorAll('[data-svc-editor-tab]').forEach(function (tab) {
      tab.addEventListener('click', function () {
        var key = tab.dataset.svcEditorTab;
        pageEl.querySelectorAll('[data-svc-editor-tab]').forEach(function (item) { item.classList.remove('active'); });
        pageEl.querySelectorAll('[data-svc-editor-panel]').forEach(function (panel) { panel.classList.remove('active'); });
        tab.classList.add('active');
        var target = pageEl.querySelector('[data-svc-editor-panel="' + key + '"]');
        if (target) target.classList.add('active');
      });
    });

    pageEl.querySelector('[data-svc-editor-action="cancel"]').addEventListener('click', function () {
      DP.showPage('svc-api-dev');
    });
    pageEl.querySelector('[data-svc-editor-action="save"]').addEventListener('click', function () {
      showToast('保存成功，已回到接口开发列表', 'success');
      window.setTimeout(function () { DP.showPage('svc-api-dev'); }, 700);
    });
    var cacheSelect = pageEl.querySelector('[data-svc-cache-select]');
    var cacheExtras = pageEl.querySelectorAll('[data-svc-cache-extra]');
    function updateCacheFields() {
      var enabled = cacheSelect && cacheSelect.value === '是';
      cacheExtras.forEach(function (item) { item.hidden = !enabled; });
    }
    if (cacheSelect) {
      cacheSelect.addEventListener('change', updateCacheFields);
      updateCacheFields();
    }
    var modeSelect = pageEl.querySelector('[data-svc-mode-select]');
    if (modeSelect) {
      modeSelect.addEventListener('change', function () {
        var panel = pageEl.querySelector('[data-svc-mode-panel]');
        if (panel) {
          panel.innerHTML = renderModePanel(modeSelect.value, row, isNew);
          bindEditorActionButtons(panel);
          bindEditorWidgets(panel, row, isNew);
        }
        var paramSection = pageEl.querySelector('[data-svc-param-section]');
        if (paramSection) {
          paramSection.innerHTML = renderParamSection(modeSelect.value, row, isNew);
          bindParamTabs(row, isNew);
          bindEditorEventsForDynamic();
        }
      });
    }
    bindEditorActionButtons(pageEl);
    bindEditorWidgets(pageEl, row, isNew);
    bindParamTabs(row, isNew);
    if (pageEl && pageEl.dataset.svcDocCloseBound !== 'true') {
      pageEl.dataset.svcDocCloseBound = 'true';
      document.addEventListener('click', function () {
        if (!pageEl) return;
        pageEl.querySelectorAll('[data-svc-ds-dropdown]').forEach(function (dropdown) { dropdown.hidden = true; });
      });
    }
  }

  function bindEditorEventsForDynamic() {
    bindEditorActionButtons(pageEl);
  }

  function openApiModal(row, isNew) {
    row = row || {};
    var mask = document.createElement('div');
    mask.className = 'svc-modal-mask';
    mask.innerHTML = '' +
      '<div class="svc-modal api-form">' +
        '<div class="svc-modal-head">' +
          '<h3>' + (isNew ? '新增接口' : '修改接口') + '</h3>' +
          '<button class="svc-modal-close" data-svc-modal-close><i class="bi bi-x-lg"></i></button>' +
        '</div>' +
        '<div class="svc-modal-body">' +
          '<div class="svc-form-grid">' +
            '<label><span>*</span> 数据名称</label><input value="' + escapeHtml(row.name || '') + '" placeholder="请输入数据名称">' +
            '<label><span>*</span> 英文名称</label><input value="' + escapeHtml(row.enName || '') + '" placeholder="请输入英文名称">' +
            '<label> 分类</label><select><option>公共目录</option><option>我的目录/物流数据</option><option>我的目录/中电数据</option><option>我的目录/工单数据</option></select>' +
            '<label> 接口类型</label><select><option>开发接口</option><option>注册接口</option></select>' +
            '<label> 版本</label><input value="' + escapeHtml(row.version || 'V1') + '">' +
            '<label> 描述</label><textarea placeholder="请输入描述">' + escapeHtml(row.desc || '') + '</textarea>' +
          '</div>' +
        '</div>' +
        '<div class="svc-modal-footer">' +
          '<button class="btn btn-outline" data-svc-modal-close><i class="bi bi-x-circle"></i> 取消</button>' +
          '<button class="btn btn-primary" data-svc-modal-save><i class="bi bi-check2-circle"></i> 保存</button>' +
        '</div>' +
      '</div>';
    pageEl.appendChild(mask);
    bindModalClose(mask);
    mask.querySelector('[data-svc-modal-save]').addEventListener('click', function () {
      mask.remove();
      showToast(isNew ? '新增接口已保存到原型列表' : '接口信息已保存', 'success');
    });
  }

  function openTestModal(row) {
    var mask = document.createElement('div');
    mask.className = 'svc-modal-mask';
    mask.innerHTML = '' +
      '<div class="svc-modal test-modal">' +
        '<div class="svc-modal-head">' +
          '<h3>接口测试</h3>' +
          '<button class="svc-modal-close" data-svc-modal-close><i class="bi bi-x-lg"></i></button>' +
        '</div>' +
        '<div class="svc-test-summary">' +
          '<div><span>接口名称</span><strong>' + escapeHtml(row.name) + '</strong></div>' +
          '<div><span>请求方式</span><strong>GET</strong></div>' +
          '<div><span>版本</span><strong>' + escapeHtml(row.version) + '</strong></div>' +
        '</div>' +
        '<div class="svc-modal-body">' +
          '<div class="svc-test-line"><label>请求地址</label><input readonly value="/api/service/' + escapeHtml(row.enName) + '"></div>' +
          '<div class="svc-test-line"><label>请求参数</label><textarea>{"page":1,"pageSize":10}</textarea></div>' +
          '<div class="svc-response-box"><div class="svc-response-title">响应结果</div><pre>{\n  "code": 200,\n  "message": "success",\n  "data": [{ "total": 128, "name": "' + escapeHtml(row.enName) + '" }]\n}</pre></div>' +
        '</div>' +
        '<div class="svc-modal-footer">' +
          '<button class="btn btn-outline" data-svc-modal-close><i class="bi bi-x-circle"></i> 关闭</button>' +
          '<button class="btn btn-primary" data-svc-run-test><i class="bi bi-play-circle"></i> 执行测试</button>' +
        '</div>' +
      '</div>';
    pageEl.appendChild(mask);
    bindModalClose(mask);
    mask.querySelector('[data-svc-run-test]').addEventListener('click', function () {
      showToast('接口测试执行成功', 'success');
    });
  }

  function bindModalClose(mask) {
    mask.querySelectorAll('[data-svc-modal-close]').forEach(function (btn) {
      btn.addEventListener('click', function () { mask.remove(); });
    });
    mask.addEventListener('click', function (event) {
      if (event.target === mask) mask.remove();
    });
  }

  function bindEvents() {
    pageEl.querySelector('[data-svc-action="add"]').addEventListener('click', function () {
      renderEditorPage(null, true);
    });

    pageEl.querySelector('[data-svc-action="deploy"]').addEventListener('click', function () {
      var count = selectedCount();
      if (!count) {
        showToast('请先选择需要部署测试的接口', 'warning');
        return;
      }
      showToast('已发起 ' + count + ' 个接口的部署测试', 'success');
    });

    pageEl.querySelector('[data-svc-action="undeploy"]').addEventListener('click', function () {
      var count = selectedCount();
      if (!count) {
        showToast('请先选择需要取消部署的接口', 'warning');
        return;
      }
      DP.confirm('确认取消部署已选择的 ' + count + ' 个接口吗？', {
        icon: 'info',
        onOk: function () { showToast('已取消部署', 'success'); }
      });
    });

    pageEl.querySelector('[data-svc-action="search"]').addEventListener('click', renderTable);
    pageEl.querySelector('[data-svc-filter="keyword"]').addEventListener('keydown', function (event) {
      if (event.key === 'Enter') renderTable();
    });
    pageEl.querySelectorAll('[data-svc-filter="publish"], [data-svc-filter="audit"]').forEach(function (select) {
      select.addEventListener('change', renderTable);
    });

    pageEl.querySelector('#svcApiCheckAll').addEventListener('change', function (event) {
      pageEl.querySelectorAll('.svc-row-check').forEach(function (ck) {
        ck.checked = event.target.checked;
      });
    });

    pageEl.querySelector('#svcApiTbody').addEventListener('click', function (event) {
      var btn = event.target.closest('[data-svc-action]');
      if (!btn) return;
      var action = btn.dataset.svcAction;
      var row = getFilteredRows()[Number(btn.dataset.index)];
      if (action === 'edit') renderEditorPage(row, false);
      if (action === 'test') openTestModal(row);
      if (action === 'delete') {
        DP.confirm('确认删除接口【' + escapeHtml(row.name) + '】吗？', {
          icon: 'danger',
          onOk: function () { showToast('删除操作已在原型中模拟完成', 'success'); }
        });
      }
    });

    pageEl.querySelectorAll('.svc-tool-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        showToast(btn.getAttribute('title') + '已触发', 'info');
      });
    });

    var compactSwitch = pageEl.querySelector('.svc-switch input');
    compactSwitch.addEventListener('change', function () {
      pageEl.classList.toggle('compact-table', compactSwitch.checked);
      pageEl.querySelector('.svc-switch-text').textContent = compactSwitch.checked ? '开' : '关';
    });

    pageEl.querySelectorAll('.svc-tree-row').forEach(function (row) {
      row.addEventListener('click', function () {
        var group = row.classList.contains('has-children');
        if (group) row.classList.toggle('open');
        pageEl.querySelectorAll('.svc-tree-row.active').forEach(function (item) { item.classList.remove('active'); });
        row.classList.add('active');
        selectedCatalog = row.dataset.catalog || '公共目录';
        renderTable();
      });
    });

    pageEl.querySelector('[data-svc-catalog-search]').addEventListener('input', function (event) {
      var keyword = event.target.value.trim().toLowerCase();
      pageEl.querySelectorAll('.svc-tree-row').forEach(function (row) {
        var text = row.textContent.trim().toLowerCase();
        row.style.display = !keyword || text.indexOf(keyword) > -1 ? '' : 'none';
      });
    });
  }

  return {
    html: '' +
      '<div class="page-service-api-dev">' +
        '<aside class="svc-catalog-panel">' +
          '<div class="svc-catalog-title"><i class="bi bi-list"></i><span>数据目录</span></div>' +
          '<div class="svc-catalog-search"><i class="bi bi-search"></i><input data-svc-catalog-search placeholder="请输入"></div>' +
          '<div class="svc-tree-list">' +
            '<div class="svc-tree-row active" data-catalog="公共目录"><i class="bi bi-folder-fill"></i><span>公共目录</span></div>' +
            '<div class="svc-tree-row has-children open" data-catalog="我的目录"><i class="bi bi-chevron-right svc-tree-arrow"></i><i class="bi bi-folder-fill"></i><span>我的目录 (3)</span></div>' +
            '<div class="svc-tree-children">' +
              '<div class="svc-tree-row child" data-catalog="物流数据"><i class="bi bi-folder2"></i><span>物流数据</span></div>' +
              '<div class="svc-tree-row child" data-catalog="中电数据"><i class="bi bi-folder2"></i><span>中电数据</span></div>' +
              '<div class="svc-tree-row child" data-catalog="工单数据"><i class="bi bi-folder2"></i><span>工单数据</span></div>' +
            '</div>' +
          '</div>' +
        '</aside>' +
        '<section class="svc-list-panel">' +
          '<div class="svc-toolbar">' +
            '<div class="svc-toolbar-left">' +
              '<button class="btn btn-text svc-top-action" data-svc-action="add"><i class="bi bi-plus-circle"></i> 新增</button>' +
              '<button class="btn btn-text svc-top-action" data-svc-action="deploy"><i class="bi bi-send"></i> 部署测试</button>' +
              '<button class="btn btn-text svc-top-action" data-svc-action="undeploy"><i class="bi bi-x-square"></i> 取消部署</button>' +
            '</div>' +
            '<div class="svc-filter-bar">' +
              '<label>发布状态</label><select class="svc-select" data-svc-filter="publish"><option value="">请选择</option><option>编制</option><option>开发</option><option>待上架</option><option>已上架</option></select>' +
              '<label>审核状态</label><select class="svc-select" data-svc-filter="audit"><option value="">请选择</option><option>上架待审核</option><option>上架通过</option><option>上架驳回</option><option>下架待审核</option><option>下架通过</option><option>下架驳回</option></select>' +
              '<input class="svc-keyword" data-svc-filter="keyword" placeholder="数据编码/数据名称/英文名称">' +
              '<button class="btn btn-primary svc-query" data-svc-action="search"><i class="bi bi-search"></i> 查询</button>' +
            '</div>' +
          '</div>' +
          '<div class="svc-table-tools">' +
            '<label class="svc-switch"><input type="checkbox"><span class="svc-switch-track"></span><em class="svc-switch-text">关</em></label>' +
            '<span class="svc-tool-sep"></span>' +
            '<button class="svc-tool-btn" title="刷新"><i class="bi bi-arrow-clockwise"></i></button>' +
            '<button class="svc-tool-btn" title="行高"><i class="bi bi-arrows-expand"></i></button>' +
            '<button class="svc-tool-btn" title="列设置"><i class="bi bi-gear"></i></button>' +
            '<button class="svc-tool-btn" title="全屏"><i class="bi bi-arrows-fullscreen"></i></button>' +
          '</div>' +
          '<div class="svc-table-wrap">' +
            '<table class="ds-table svc-api-table">' +
              '<thead><tr>' +
                '<th class="svc-check-col"><input type="checkbox" id="svcApiCheckAll"></th>' +
                '<th class="svc-code-col">数据编码 <i class="bi bi-caret-up-fill sort-icon"></i><i class="bi bi-caret-down-fill sort-icon"></i></th>' +
                '<th class="svc-name-col">数据名称 <i class="bi bi-caret-up-fill sort-icon"></i><i class="bi bi-caret-down-fill sort-icon"></i></th>' +
                '<th class="svc-en-col">英文名称 <i class="bi bi-caret-up-fill sort-icon"></i><i class="bi bi-caret-down-fill sort-icon"></i></th>' +
                '<th class="svc-category-col">分类</th>' +
                '<th>接口类型</th>' +
                '<th>版本</th>' +
                '<th>发布状态</th>' +
                '<th>审核状态</th>' +
                '<th>更新时间</th>' +
                '<th class="svc-desc-col">描述</th>' +
                '<th class="svc-action-col">操作</th>' +
              '</tr></thead>' +
              '<tbody id="svcApiTbody"></tbody>' +
            '</table>' +
          '</div>' +
          '<div class="svc-pagination">' +
            '<span data-svc-total>共 0 条</span>' +
            '<div class="svc-page-controls"><button class="svc-page-btn disabled"><i class="bi bi-chevron-left"></i></button><button class="svc-page-num active">1</button><button class="svc-page-btn disabled"><i class="bi bi-chevron-right"></i></button><select class="svc-page-size"><option>10 条/页</option><option>20 条/页</option><option>50 条/页</option></select></div>' +
          '</div>' +
        '</section>' +
      '</div>',

    init: function () {
      pageEl = document.querySelector('.page-service-api-dev');
      if (!pageEl) return;
      selectedCatalog = '公共目录';
      bindEvents();
      renderTable();
    }
  };
})();
