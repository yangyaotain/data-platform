/**
 * 数据中台 V4.0 - 数据开发 / 代码检索
 * 提供跨项目、跨环境的静态代码检索与数据开发节点定位演示。
 */
window.DP = window.DP || {};
DP.pages = DP.pages || {};

DP.developmentCodeRecords = [
  {
    id: 'code-batch-dev-sql',
    project: '数据中台项目',
    environment: '开发',
    businessFlowId: 'flow-batch',
    businessFlow: '批量计算业务流程',
    catalogPath: ['批量计算业务流程'],
    subflowId: 'sub-batch-online-sql',
    subflow: '在线编程子流程1-1',
    language: 'SQL',
    version: 'V1.0',
    owner: '王鹏',
    updatedAt: '2026-08-29 16:42',
    code: [
      "SET 'execution.runtime-mode' = 'batch';",
      '',
      'CREATE TABLE mysql_emp_worker1 (',
      "  'phone' VARCHAR(100),",
      "  'csny' VARCHAR(100),",
      "  'idcard' VARCHAR(100),",
      "  'name' VARCHAR(100),",
      "  'telephone' VARCHAR(100),",
      "  'id' BIGINT,",
      "  'email' VARCHAR(100)",
      ') WITH (',
      "  'connector' = 'jdbc',",
      "  'url' = '${url}',",
      "  'table-name' = 'emp_worker1',",
      "  'username' = '${username}',",
      "  'password' = '${password}'",
      ');',
      '',
      '-- 查询员工基础信息',
      'SELECT',
      '  id, name, phone, email',
      'FROM mysql_emp_worker1',
      'WHERE id IS NOT NULL;'
    ].join('\n')
  },
  {
    id: 'code-batch-test-sql',
    project: '数据中台项目',
    environment: '测试',
    businessFlowId: 'flow-batch',
    businessFlow: '批量计算业务流程',
    catalogPath: ['批量计算业务流程'],
    subflowId: 'sub-batch-online-sql',
    subflow: '在线编程子流程1-1',
    language: 'SQL',
    version: 'V1.2',
    owner: '张红彬',
    updatedAt: '2026-08-30 10:15',
    code: [
      '-- 测试环境：员工增量数据校验',
      'WITH latest_worker AS (',
      '  SELECT id, name, phone, update_time',
      '  FROM test_mysql_emp_worker',
      "  WHERE update_time >= '${bizdate}'",
      ')',
      'SELECT',
      '  id,',
      '  name,',
      '  phone',
      'FROM latest_worker',
      'WHERE phone IS NOT NULL;'
    ].join('\n')
  },
  {
    id: 'code-stream-dev-flinksql',
    project: '实时计算项目',
    environment: '开发',
    businessFlowId: 'flow-stream',
    businessFlow: '流式计算业务流程',
    catalogPath: ['流式计算业务流程'],
    subflowId: 'sub-stream-flinksql',
    subflow: '在线编程流程-Flinksql',
    language: 'Flink SQL',
    version: 'V2.1',
    owner: '李晓林',
    updatedAt: '2026-08-31 09:28',
    code: [
      "SET 'table.exec.source.idle-timeout' = '30 s';",
      '',
      'CREATE TABLE ods_order_event (',
      '  order_id BIGINT,',
      '  user_id BIGINT,',
      '  order_amount DECIMAL(18, 2),',
      '  event_time TIMESTAMP(3),',
      '  WATERMARK FOR event_time AS event_time - INTERVAL \'5\' SECOND',
      ') WITH (',
      "  'connector' = 'kafka',",
      "  'topic' = 'order_event'",
      ');',
      '',
      'SELECT',
      '  user_id,',
      '  SUM(order_amount) AS total_amount',
      'FROM ods_order_event',
      'GROUP BY user_id;'
    ].join('\n')
  },
  {
    id: 'code-warehouse-dev-python',
    project: '数仓建设项目',
    environment: '开发',
    businessFlowId: 'flow-business-2',
    businessFlow: '业务流程2',
    catalogPath: ['业务流程2', '文件夹'],
    subflowId: 'sub-data-2-2-1',
    subflow: '数据子流程2-2-1',
    language: 'Python',
    version: 'V1.4',
    owner: '王畅',
    updatedAt: '2026-08-30 18:03',
    code: [
      'from pyspark.sql import SparkSession',
      '',
      'spark = SparkSession.builder.appName("order_detail_job").getOrCreate()',
      '',
      'order_detail = spark.sql("""',
      '  SELECT',
      '    order_id,',
      '    product_id,',
      '    quantity,',
      '    sale_amount',
      '  FROM ods_order_detail',
      "  WHERE dt = '${bizdate}'",
      '""")',
      '',
      'order_detail.write.mode("overwrite").insertInto("dwd_order_detail")'
    ].join('\n')
  },
  {
    id: 'code-warehouse-prod-shell',
    project: '数仓建设项目',
    environment: '生产',
    businessFlowId: 'flow-business-2',
    businessFlow: '业务流程2',
    catalogPath: ['业务流程2', '文件夹'],
    subflowId: 'sub-data-2-2-2',
    subflow: '数据子流程2-2-2',
    language: 'Shell',
    version: 'V3.0',
    owner: '陈明',
    updatedAt: '2026-08-31 22:10',
    code: [
      '#!/bin/bash',
      'set -e',
      '',
      'BIZ_DATE=${bizdate}',
      'TARGET_TABLE=dws_order_daily',
      '',
      'beeline -u "${HIVE_URL}" -e "',
      'INSERT OVERWRITE TABLE ${TARGET_TABLE} PARTITION (dt=\'${BIZ_DATE}\')',
      'SELECT dt, COUNT(1) AS order_count, SUM(order_amount) AS order_amount',
      'FROM dwd_order_fact',
      'WHERE dt=\'${BIZ_DATE}\'',
      'GROUP BY dt;"'
    ].join('\n')
  },
  {
    id: 'code-batch-prod-sql',
    project: '数据中台项目',
    environment: '生产',
    businessFlowId: 'flow-batch',
    businessFlow: '批量计算业务流程',
    catalogPath: ['批量计算业务流程'],
    subflowId: 'sub-batch-online-sql',
    subflow: '在线编程子流程1-1',
    language: 'SQL',
    version: 'V2.0',
    owner: '刘洋',
    updatedAt: '2026-09-01 08:35',
    code: [
      '-- 生产环境：生成在职员工维表',
      'INSERT OVERWRITE TABLE dim_employee_current',
      'SELECT',
      '  id, name, department_id, phone, email',
      'FROM ods_employee',
      "WHERE status = 'ACTIVE'",
      "  AND dt = '${bizdate}';"
    ].join('\n')
  },
  {
    id: 'code-stream-test-flinksql',
    project: '实时计算项目',
    environment: '测试',
    businessFlowId: 'flow-stream',
    businessFlow: '流式计算业务流程',
    catalogPath: ['流式计算业务流程'],
    subflowId: 'sub-stream-flinksql',
    subflow: '在线编程流程-Flinksql',
    language: 'Flink SQL',
    version: 'V2.3',
    owner: '周敏',
    updatedAt: '2026-09-01 09:12',
    code: [
      '-- 测试环境：订单事件分钟聚合',
      'SELECT',
      "  DATE_FORMAT(event_time, 'yyyy-MM-dd HH:mm') AS minute_time,",
      '  COUNT(1) AS order_count,',
      '  SUM(order_amount) AS order_amount',
      'FROM ods_order_event',
      "WHERE event_type = 'CREATE'",
      "GROUP BY DATE_FORMAT(event_time, 'yyyy-MM-dd HH:mm');"
    ].join('\n')
  },
  {
    id: 'code-stream-prod-flinksql',
    project: '实时计算项目',
    environment: '生产',
    businessFlowId: 'flow-stream',
    businessFlow: '流式计算业务流程',
    catalogPath: ['流式计算业务流程'],
    subflowId: 'sub-stream-flinksql',
    subflow: '在线编程流程-Flinksql',
    language: 'Flink SQL',
    version: 'V3.2',
    owner: '赵磊',
    updatedAt: '2026-09-01 10:26',
    code: [
      '-- 生产环境：实时交易风险识别',
      'INSERT INTO dwd_risk_order_stream',
      'SELECT',
      '  order_id, user_id, order_amount, event_time',
      'FROM ods_order_event',
      'WHERE order_amount >= 50000',
      "   OR risk_level = 'HIGH';"
    ].join('\n')
  },
  {
    id: 'code-warehouse-test-python',
    project: '数仓建设项目',
    environment: '测试',
    businessFlowId: 'flow-business-2',
    businessFlow: '业务流程2',
    catalogPath: ['业务流程2', '文件夹'],
    subflowId: 'sub-data-2-2-1',
    subflow: '数据子流程2-2-1',
    language: 'Python',
    version: 'V1.6',
    owner: '孙悦',
    updatedAt: '2026-09-01 11:40',
    code: [
      'from pyspark.sql import SparkSession',
      '',
      'spark = SparkSession.builder.appName("customer_tag_test").getOrCreate()',
      'customer_tag = spark.sql("""',
      '  SELECT customer_id, tag_code, tag_value',
      '  FROM dwd_customer_tag',
      "  WHERE dt = '${bizdate}'",
      '""")',
      'customer_tag.createOrReplaceTempView("tmp_customer_tag")'
    ].join('\n')
  },
  {
    id: 'code-warehouse-prod-python',
    project: '数仓建设项目',
    environment: '生产',
    businessFlowId: 'flow-business-2',
    businessFlow: '业务流程2',
    catalogPath: ['业务流程2', '文件夹'],
    subflowId: 'sub-data-2-2-1',
    subflow: '数据子流程2-2-1',
    language: 'Python',
    version: 'V2.0',
    owner: '吴昊',
    updatedAt: '2026-09-01 13:05',
    code: [
      'from pyspark.sql import SparkSession',
      '',
      'spark = SparkSession.builder.appName("sales_summary").getOrCreate()',
      'sales_summary = spark.sql("""',
      '  SELECT store_id, SUM(sale_amount) AS sale_amount',
      '  FROM dwd_sales_detail',
      "  WHERE dt = '${bizdate}'",
      '  GROUP BY store_id',
      '""")',
      'sales_summary.write.mode("overwrite").insertInto("dws_store_sales_daily")'
    ].join('\n')
  },
  {
    id: 'code-warehouse-dev-shell',
    project: '数仓建设项目',
    environment: '开发',
    businessFlowId: 'flow-business-2',
    businessFlow: '业务流程2',
    catalogPath: ['业务流程2', '文件夹'],
    subflowId: 'sub-data-2-2-2',
    subflow: '数据子流程2-2-2',
    language: 'Shell',
    version: 'V2.4',
    owner: '何杰',
    updatedAt: '2026-09-01 14:18',
    code: [
      '#!/bin/bash',
      'set -e',
      '',
      'beeline -u "${HIVE_URL}" -e "',
      'SELECT channel_code, COUNT(1) AS visit_count',
      'FROM dwd_channel_visit',
      'WHERE dt=\'${bizdate}\'',
      'GROUP BY channel_code;"'
    ].join('\n')
  },
  {
    id: 'code-warehouse-test-shell',
    project: '数仓建设项目',
    environment: '测试',
    businessFlowId: 'flow-business-2',
    businessFlow: '业务流程2',
    catalogPath: ['业务流程2', '文件夹'],
    subflowId: 'sub-data-2-2-2',
    subflow: '数据子流程2-2-2',
    language: 'Shell',
    version: 'V2.7',
    owner: '郑宇',
    updatedAt: '2026-09-01 15:32',
    code: [
      '#!/bin/bash',
      'set -e',
      '',
      'beeline -u "${HIVE_URL}" -e "',
      'SELECT product_id, SUM(quantity) AS sale_quantity',
      'FROM dwd_order_detail',
      'WHERE dt=\'${bizdate}\'',
      'GROUP BY product_id;"'
    ].join('\n')
  }
];

DP.pages.codeSearch = {
  html: [
    '<div class="page-code-search">',
      '<div class="dcs-header">',
        '<div class="dcs-title-row">',
          '<h2 class="dcs-title">代码检索</h2>',
          '<span class="dcs-title-note">全局检索数据开发中有权限访问的代码</span>',
        '</div>',
        '<div class="dcs-query-row">',
          '<div class="dcs-search-row">',
            '<div class="dcs-search-box">',
              '<i class="bi bi-search"></i>',
              '<input id="dcsSearchInput" class="dcs-search-input" type="text" value="SELECT" placeholder="搜索代码内容、变量、表名或注释" autocomplete="off">',
              '<button id="dcsSearchClear" class="dcs-search-clear visible" type="button" title="清空"><i class="bi bi-x-lg"></i></button>',
            '</div>',
            '<button id="dcsSearchBtn" class="btn btn-primary dcs-search-btn" type="button"><i class="bi bi-search"></i> 搜索</button>',
          '</div>',
          '<div class="dcs-filter-row">',
            '<label class="dcs-field"><span>程序类型</span><select id="dcsLanguage" class="dcs-select"><option value="all">全部类型</option><option value="SQL">SQL</option><option value="Flink SQL">Flink SQL</option><option value="Python">Python</option><option value="Shell">Shell</option></select></label>',
            '<span class="dcs-filter-divider" aria-hidden="true"></span>',
            '<label class="dcs-check"><input id="dcsCaseSensitive" type="checkbox"> 区分大小写</label>',
            '<label class="dcs-check"><input id="dcsWholeWord" type="checkbox"> 全字匹配</label>',
          '</div>',
        '</div>',
      '</div>',
      '<div class="dcs-workspace">',
        '<aside class="dcs-results">',
          '<div class="dcs-results-head"><span class="dcs-results-title">检索结果</span><span id="dcsResultsCount" class="dcs-results-count"></span></div>',
          '<div id="dcsResultsList" class="dcs-results-list"></div>',
          '<div id="dcsPagination" class="dcs-pagination" aria-label="检索结果分页"></div>',
        '</aside>',
        '<section id="dcsPreview" class="dcs-preview"></section>',
      '</div>',
    '</div>'
  ].join(''),

  _results: [],
  _flatMatches: [],
  _selectedRecordId: '',
  _selectedLine: 1,
  _keyword: 'SELECT',
  _caseSensitive: false,
  _wholeWord: false,
  _pageSize: 10,
  _currentPage: 1,

  init: function (opts) {
    var self = this;
    opts = opts || {};

    if (DP.setProjectSelectorMode) DP.setProjectSelectorMode('search');

    var input = document.getElementById('dcsSearchInput');
    var searchBtn = document.getElementById('dcsSearchBtn');
    var clearBtn = document.getElementById('dcsSearchClear');
    var language = document.getElementById('dcsLanguage');
    var caseSensitive = document.getElementById('dcsCaseSensitive');
    var wholeWord = document.getElementById('dcsWholeWord');
    var resultsList = document.getElementById('dcsResultsList');
    var pagination = document.getElementById('dcsPagination');
    var preview = document.getElementById('dcsPreview');

    if (input && opts.keyword) input.value = opts.keyword;

    function updateClearButton() {
      if (!input || !clearBtn) return;
      clearBtn.classList.toggle('visible', !!input.value);
    }

    if (input) {
      input.addEventListener('input', updateClearButton);
      input.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') self._runSearch();
      });
    }

    if (searchBtn) searchBtn.addEventListener('click', function () { self._runSearch(); });
    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        if (!input) return;
        input.value = '';
        updateClearButton();
        input.focus();
      });
    }

    if (language) language.addEventListener('change', function () { self._runSearch(); });
    if (caseSensitive) caseSensitive.addEventListener('change', function () { self._runSearch(); });
    if (wholeWord) wholeWord.addEventListener('change', function () { self._runSearch(); });

    if (resultsList) {
      resultsList.addEventListener('click', function (event) {
        var target = event.target.closest('[data-record-id]');
        if (!target) return;
        var recordId = target.getAttribute('data-record-id');
        var line = parseInt(target.getAttribute('data-line'), 10);
        self._selectMatch(recordId, isNaN(line) ? null : line);
      });
    }

    if (pagination) {
      pagination.addEventListener('click', function (event) {
        var button = event.target.closest('[data-page-action]');
        if (!button || button.disabled) return;
        var delta = button.getAttribute('data-page-action') === 'previous' ? -1 : 1;
        self._changePage(self._currentPage + delta);
      });
    }

    if (preview) {
      preview.addEventListener('click', function (event) {
        var actionEl = event.target.closest('[data-action]');
        if (!actionEl) return;
        var action = actionEl.getAttribute('data-action');
        if (action === 'previous-match') self._navigateMatch(-1);
        if (action === 'next-match') self._navigateMatch(1);
        if (action === 'open-node') self._openSelectedNode();
      });
    }

    updateClearButton();
    this._runSearch();
  },

  _escapeHtml: function (value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  },

  _escapeRegExp: function (value) {
    return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  },

  _createMatchRegExp: function (keyword, global) {
    if (!keyword) return null;
    var source = this._escapeRegExp(keyword);
    if (this._wholeWord) {
      if (/^[A-Za-z0-9_]/.test(keyword)) source = '\\b' + source;
      if (/[A-Za-z0-9_]$/.test(keyword)) source += '\\b';
    }
    return new RegExp(source, (global ? 'g' : '') + (this._caseSensitive ? '' : 'i'));
  },

  _getLineMatches: function (record) {
    var keyword = this._keyword;
    var lines = record.code.split('\n');
    var matches = [];

    if (!keyword) {
      var firstLine = 1;
      for (var i = 0; i < lines.length; i++) {
        if (lines[i].trim()) { firstLine = i + 1; break; }
      }
      return [{ line: firstLine, text: lines[firstLine - 1] || '', count: 0 }];
    }

    for (var lineIndex = 0; lineIndex < lines.length; lineIndex++) {
      var regex = this._createMatchRegExp(keyword, true);
      var count = 0;
      var match;
      while (regex && (match = regex.exec(lines[lineIndex]))) {
        count += 1;
        if (!match[0]) regex.lastIndex += 1;
      }
      if (count) matches.push({ line: lineIndex + 1, text: lines[lineIndex], count: count });
    }
    return matches;
  },

  _runSearch: function () {
    var input = document.getElementById('dcsSearchInput');
    var language = document.getElementById('dcsLanguage');
    var caseSensitive = document.getElementById('dcsCaseSensitive');
    var wholeWord = document.getElementById('dcsWholeWord');
    this._keyword = input ? input.value.trim() : '';
    this._caseSensitive = !!(caseSensitive && caseSensitive.checked);
    this._wholeWord = !!(wholeWord && wholeWord.checked);

    var languageValue = language ? language.value : 'all';
    var results = [];
    var totalMatches = 0;

    DP.developmentCodeRecords.forEach(function (record) {
      if (languageValue !== 'all' && record.language !== languageValue) return;

      var lineMatches = this._getLineMatches(record);
      if (this._keyword && !lineMatches.length) return;

      var count = lineMatches.length;
      totalMatches += count;
      results.push({ record: record, matches: lineMatches, count: count });
    }, this);

    this._results = results;
    this._flatMatches = [];
    results.forEach(function (result) {
      result.matches.forEach(function (match) {
        this._flatMatches.push({ recordId: result.record.id, line: match.line });
      }, this);
    }, this);

    var selectedExists = results.some(function (result) { return result.record.id === this._selectedRecordId; }, this);
    if (!selectedExists) {
      this._selectedRecordId = results.length ? results[0].record.id : '';
      this._selectedLine = results.length && results[0].matches.length ? results[0].matches[0].line : 1;
    } else {
      var selectedResult = results.find(function (result) { return result.record.id === this._selectedRecordId; }, this);
      var selectedLineExists = selectedResult.matches.some(function (match) { return match.line === this._selectedLine; }, this);
      if (!selectedLineExists) this._selectedLine = selectedResult.matches.length ? selectedResult.matches[0].line : 1;
    }
    var selectedIndex = results.findIndex(function (result) { return result.record.id === this._selectedRecordId; }, this);
    this._currentPage = selectedIndex >= 0 ? Math.floor(selectedIndex / this._pageSize) + 1 : 1;

    var countEl = document.getElementById('dcsResultsCount');
    if (countEl) {
      countEl.innerHTML = this._keyword
        ? '<b>' + results.length + '</b> 个代码节点 · <b>' + totalMatches + '</b> 行匹配'
        : '<b>' + results.length + '</b> 个代码节点';
    }

    this._renderResults();
    this._renderPreview();
  },

  _markText: function (value) {
    var text = String(value == null ? '' : value);
    var regex = this._createMatchRegExp(this._keyword, true);
    if (!regex) return this._escapeHtml(text);

    var html = '';
    var lastIndex = 0;
    var match;
    while ((match = regex.exec(text))) {
      html += this._escapeHtml(text.slice(lastIndex, match.index));
      html += '<mark class="dcs-hit">' + this._escapeHtml(match[0]) + '</mark>';
      lastIndex = match.index + match[0].length;
      if (!match[0]) regex.lastIndex += 1;
    }
    html += this._escapeHtml(text.slice(lastIndex));
    return html;
  },

  _pathText: function (record) {
    return [record.project, record.environment].concat(record.catalogPath).concat([record.subflow]).join(' / ');
  },

  _renderResults: function () {
    var list = document.getElementById('dcsResultsList');
    var pagination = document.getElementById('dcsPagination');
    if (!list) return;

    if (!this._results.length) {
      list.innerHTML = '<div class="dcs-empty"><i class="bi bi-search"></i><strong>未找到匹配代码</strong><span>请调整关键词、程序类型或匹配选项后重试</span></div>';
      if (pagination) pagination.innerHTML = '';
      return;
    }

    var self = this;
    var html = '';
    var totalPages = Math.max(1, Math.ceil(this._results.length / this._pageSize));
    this._currentPage = Math.min(Math.max(this._currentPage, 1), totalPages);
    var pageStart = (this._currentPage - 1) * this._pageSize;
    var pageEnd = Math.min(pageStart + this._pageSize, this._results.length);
    this._results.slice(pageStart, pageEnd).forEach(function (result) {
      var record = result.record;
      var active = record.id === self._selectedRecordId;
      html += '<div class="dcs-result-group' + (active ? ' active' : '') + '">';
      html += '<div class="dcs-result-main" data-record-id="' + self._escapeHtml(record.id) + '">';
      html += '<div class="dcs-result-title-row"><span class="dcs-lang-icon"><i class="bi bi-code-slash"></i></span>';
      html += '<span class="dcs-result-name" title="' + self._escapeHtml(record.subflow) + '">' + self._escapeHtml(record.subflow) + '</span>';
      html += '<span class="dcs-lang-tag">' + self._escapeHtml(record.language) + '</span>';
      html += '<span class="dcs-result-count">' + (self._keyword ? result.count + ' 行' : '') + '</span></div>';
      html += '<div class="dcs-result-context"><span><i class="bi bi-box"></i>' + self._escapeHtml(record.project) + '</span><span class="dcs-result-env">' + self._escapeHtml(record.environment) + '</span></div>';
      html += '<div class="dcs-result-path" title="' + self._escapeHtml(self._pathText(record)) + '"><i class="bi bi-diagram-3"></i>' + self._escapeHtml(record.catalogPath.concat([record.subflow]).join(' / ')) + '</div>';
      html += '</div>';

      result.matches.slice(0, 3).forEach(function (match) {
        var matchActive = active && match.line === self._selectedLine;
        html += '<div class="dcs-match' + (matchActive ? ' active' : '') + '" data-record-id="' + self._escapeHtml(record.id) + '" data-line="' + match.line + '">';
        html += '<span class="dcs-match-line">' + match.line + '</span><code class="dcs-match-code">' + self._markText(match.text) + '</code></div>';
      });
      if (result.matches.length > 3) html += '<div class="dcs-match-more">另有 ' + (result.matches.length - 3) + ' 行匹配</div>';
      html += '</div>';
    });
    list.innerHTML = html;

    if (pagination) {
      pagination.innerHTML = [
        '<span class="dcs-page-summary">' + (pageStart + 1) + '-' + pageEnd + ' / 共 ' + this._results.length + ' 项</span>',
        '<div class="dcs-page-actions">',
          '<button class="dcs-page-btn" type="button" data-page-action="previous"' + (this._currentPage <= 1 ? ' disabled' : '') + '><i class="bi bi-chevron-left"></i><span>上一页</span></button>',
          '<span class="dcs-page-index">第 ' + this._currentPage + ' / ' + totalPages + ' 页</span>',
          '<button class="dcs-page-btn" type="button" data-page-action="next"' + (this._currentPage >= totalPages ? ' disabled' : '') + '><span>下一页</span><i class="bi bi-chevron-right"></i></button>',
        '</div>'
      ].join('');
    }
  },

  _changePage: function (page) {
    var totalPages = Math.max(1, Math.ceil(this._results.length / this._pageSize));
    var nextPage = Math.min(Math.max(page, 1), totalPages);
    if (nextPage === this._currentPage) return;

    this._currentPage = nextPage;
    var firstResult = this._results[(nextPage - 1) * this._pageSize];
    if (firstResult) {
      this._selectedRecordId = firstResult.record.id;
      this._selectedLine = firstResult.matches.length ? firstResult.matches[0].line : 1;
    }
    this._renderResults();
    this._renderPreview();
  },

  _getSelectedRecord: function () {
    for (var i = 0; i < DP.developmentCodeRecords.length; i++) {
      if (DP.developmentCodeRecords[i].id === this._selectedRecordId) return DP.developmentCodeRecords[i];
    }
    return null;
  },

  _selectMatch: function (recordId, line) {
    this._selectedRecordId = recordId;
    var resultIndex = this._results.findIndex(function (item) { return item.record.id === recordId; });
    if (resultIndex >= 0) this._currentPage = Math.floor(resultIndex / this._pageSize) + 1;
    if (line == null) {
      var result = this._results.find(function (item) { return item.record.id === recordId; });
      line = result && result.matches.length ? result.matches[0].line : 1;
    }
    this._selectedLine = line;
    this._renderResults();
    this._renderPreview();
  },

  _markCodeMatches: function (line) {
    var regex = this._createMatchRegExp(this._keyword, true);
    if (!regex) return line;
    return line.replace(regex, function (match) { return '\u0001' + match + '\u0002'; });
  },

  _highlightCodeLine: function (line, language) {
    var value = this._escapeHtml(this._markCodeMatches(line));
    if (/SQL/i.test(language)) {
      value = value.replace(/(\/\/[^\n]*|--[^\n]*)/g, '<span class="dcs-syntax-comment">$1</span>');
      value = value.replace(/(\/\*.*?\*\/)/g, '<span class="dcs-syntax-comment">$1</span>');
      value = value.replace(/('[^']*')/g, '<span class="dcs-syntax-string">$1</span>');
      value = value.replace(/(\$\{[^}]+\})/g, '<span class="dcs-syntax-var">$1</span>');
      value = value.replace(/\b(SET|CREATE|TABLE|WITH|SELECT|FROM|INSERT|INTO|OVERWRITE|VALUES|WHERE|GROUP|BY|AND|OR|NOT|NULL|IS|AS|SUM|COUNT|VARCHAR|INT|BIGINT|FLOAT|DOUBLE|DECIMAL|DATE|BOOLEAN|TIMESTAMP|WATERMARK|INTERVAL|PARTITION)\b/gi, '<span class="dcs-syntax-keyword">$1</span>');
    }
    return value.replace(/\u0001/g, '<mark class="dcs-hit">').replace(/\u0002/g, '</mark>');
  },

  _renderPreview: function () {
    var preview = document.getElementById('dcsPreview');
    if (!preview) return;
    var record = this._getSelectedRecord();
    if (!record) {
      preview.innerHTML = '<div class="dcs-empty"><i class="bi bi-file-earmark-code"></i><strong>暂无代码预览</strong><span>请先执行检索并选择一条匹配结果</span></div>';
      return;
    }

    var currentIndex = -1;
    for (var i = 0; i < this._flatMatches.length; i++) {
      if (this._flatMatches[i].recordId === record.id && this._flatMatches[i].line === this._selectedLine) {
        currentIndex = i;
        break;
      }
    }

    var pathHtml = [record.project, record.environment].concat(record.catalogPath).concat([record.subflow]).map(function (part) {
      return this._escapeHtml(part);
    }, this).join('<i class="bi bi-chevron-right"></i>');

    var lines = record.code.split('\n');
    var codeHtml = '';
    for (var lineIndex = 0; lineIndex < lines.length; lineIndex++) {
      var lineNo = lineIndex + 1;
      codeHtml += '<div class="dcs-code-line' + (lineNo === this._selectedLine ? ' active' : '') + '" data-preview-line="' + lineNo + '">';
      codeHtml += '<span class="dcs-line-no">' + lineNo + '</span><code class="dcs-code-text">' + (this._highlightCodeLine(lines[lineIndex], record.language) || '&nbsp;') + '</code></div>';
    }

    preview.innerHTML = [
      '<div class="dcs-preview-head">',
        '<div class="dcs-preview-info">',
          '<div class="dcs-preview-name-row"><span class="dcs-preview-name">' + this._escapeHtml(record.subflow) + '</span><span class="dcs-meta-tag">' + this._escapeHtml(record.language) + '</span><span class="dcs-meta-tag">' + this._escapeHtml(record.version) + '</span></div>',
          '<div class="dcs-preview-path" title="' + this._escapeHtml(this._pathText(record)) + '">' + pathHtml + '</div>',
        '</div>',
        '<div class="dcs-preview-actions">',
          '<div class="dcs-match-nav"><span class="dcs-match-pos">' + (currentIndex >= 0 ? currentIndex + 1 : 1) + ' / ' + Math.max(this._flatMatches.length, 1) + '</span><button class="dcs-nav-btn" data-action="previous-match" title="上一处"><i class="bi bi-chevron-up"></i><span>上一处</span></button><button class="dcs-nav-btn" data-action="next-match" title="下一处"><i class="bi bi-chevron-down"></i><span>下一处</span></button></div>',
          '<button class="btn btn-primary dcs-open-btn" data-action="open-node"><i class="bi bi-box-arrow-up-right"></i> 打开节点</button>',
        '</div>',
      '</div>',
      '<div class="dcs-code-toolbar"><span><i class="bi bi-file-earmark-code"></i>' + this._escapeHtml(record.language) + '</span><span><i class="bi bi-diagram-3"></i>' + this._escapeHtml(record.businessFlow) + '</span><span><i class="bi bi-bullseye"></i>第 ' + this._selectedLine + ' 行</span></div>',
      '<div class="dcs-code-scroll">' + codeHtml + '</div>',
      '<div class="dcs-code-status"><span><i class="bi bi-person"></i>修改人：' + this._escapeHtml(record.owner) + '</span><span><i class="bi bi-clock-history"></i>更新时间：' + this._escapeHtml(record.updatedAt) + '</span><span class="dcs-status-spacer"></span><span>共 ' + lines.length + ' 行</span></div>'
    ].join('');

    requestAnimationFrame(function () {
      var activeLine = preview.querySelector('.dcs-code-line.active');
      if (activeLine) activeLine.scrollIntoView({ block: 'center', inline: 'nearest' });
    });
  },

  _navigateMatch: function (delta) {
    if (!this._flatMatches.length) return;
    var currentIndex = this._flatMatches.findIndex(function (item) {
      return item.recordId === this._selectedRecordId && item.line === this._selectedLine;
    }, this);
    if (currentIndex < 0) currentIndex = 0;
    var nextIndex = (currentIndex + delta + this._flatMatches.length) % this._flatMatches.length;
    var next = this._flatMatches[nextIndex];
    this._selectMatch(next.recordId, next.line);
  },

  _openSelectedNode: function () {
    var record = this._getSelectedRecord();
    if (!record) return;

    var developNav = document.querySelector('.nav-item[data-page="develop"]');
    if (developNav) {
      document.querySelectorAll('.nav-item.active').forEach(function (item) { item.classList.remove('active'); });
      developNav.classList.add('active');
    }
    if (DP.switchMenuGroup) DP.switchMenuGroup('develop');

    var developLink = document.querySelector('[data-menu="dev-develop"]');
    if (developLink && DP.setActiveMenu) DP.setActiveMenu(developLink);

    if (DP.setProjectSelectorMode) DP.setProjectSelectorMode('context');
    if (DP.setProjectEnvironment) DP.setProjectEnvironment(record.project, record.environment, { silent: true });

    DP.showPage('数据开发', {
      project: record.project,
      environment: record.environment,
      flowId: record.businessFlowId,
      subflowId: record.subflowId,
      recordId: record.id,
      keyword: this._keyword,
      line: String(this._selectedLine)
    });
  }
};
