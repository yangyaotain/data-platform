/** 控制台日志共用视图：筛选、分页、详情与本地导出。 */
window.DP = window.DP || {};
DP.logView = (function () {
  'use strict';
  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  }
  function button(action, icon, text, extra, cls) {
    return '<button type="button" class="btn ' + (cls || 'btn-outline') + '" data-lm-action="' + action + '" ' + (extra || '') + '><i class="bi bi-' + icon + '" aria-hidden="true"></i><span>' + text + '</span></button>';
  }
  function fields(title, pairs) {
    return '<section class="lm-detail-section"><h3>' + esc(title) + '</h3><dl class="lm-detail-fields">' + pairs.map(function (pair) {
      return '<div><dt>' + esc(pair[0]) + '</dt><dd>' + esc(pair[1] == null || pair[1] === '' ? '—' : pair[1]) + '</dd></div>';
    }).join('') + '</dl></section>';
  }
  function content(title, value, sql) {
    return '<section class="lm-detail-section"><div class="lm-section-head"><h3>' + esc(title) + '</h3>' + (sql ? button('copy-sql', 'clipboard', '复制SQL') : '') + '</div><div class="' + (sql ? 'dp-sql-editor' : 'lm-text-panel') + '"><pre class="lm-full-text">' + esc(value) + '</pre></div></section>';
  }
  function filterRows(rows, filters, keywordKeys) {
    var keyword = (filters.keyword || '').trim().toLowerCase();
    var keys = filters.queryType ? [filters.queryType] : keywordKeys;
    return rows.filter(function (row) {
      var exact = Object.keys(filters).every(function (key) {
        return ['keyword', 'queryType', 'from', 'to'].indexOf(key) >= 0 || !filters[key] || row[key] === filters[key];
      });
      return exact && (!filters.from || row.time >= filters.from) && (!filters.to || row.time <= filters.to) &&
        (!keyword || keys.some(function (key) { return String(row[key] == null ? '' : row[key]).toLowerCase().indexOf(keyword) >= 0; }));
    }).sort(function (a, b) { return b.time.localeCompare(a.time) || b.id.localeCompare(a.id); });
  }
  function toCsv(rows, columns) {
    function cell(value) {
      var text = String(value == null ? '' : value);
      // 在表格软件中按文本打开用户内容，同时保持 SQL 内部换行。
      if (/^[\s]*[=+@-]/.test(text) || /^[\t\r]/.test(text)) text = "'" + text;
      return '"' + text.replace(/"/g, '""') + '"';
    }
    return '\uFEFF' + [columns.map(function (col) { return cell(col.label); }).join(',')].concat(rows.map(function (row) {
      return columns.map(function (col) { return cell(row[col.key]); }).join(',');
    })).join('\r\n');
  }
  function create(options) {
    var root;
    var state = { filters: {}, keyword: '', page: 1, size: 10, hidden: [], record: null };
    var lastFocus;
    var exportHint = options.kind === 'sql' ? '，包含完整SQL' : '';
    var exportButton = options.exportColumns ? button('export', 'download', '导出', 'title="导出当前查询结果的全部记录' + exportHint + '"') : '';
    function notice(message, error) {
      var el = root.querySelector('[data-lm-notice]');
      el.textContent = message;
      el.classList.toggle('is-error', !!error);
    }
    function getOptions(field) { return typeof field.options === 'function' ? field.options(state.filters) : field.options; }
    function pickerOptions(field, keyword) {
      var values = getOptions(field).filter(function (item) { return item.label.toLowerCase().indexOf((keyword || '').toLowerCase()) >= 0; });
      return '<button type="button" class="lm-option" data-lm-option="" data-lm-field="' + field.key + '">全部' + esc(field.label) + '</button>' + values.map(function (item) {
        return '<button type="button" class="lm-option' + (state.filters[field.key] === item.value ? ' selected' : '') + '" data-lm-option="' + esc(item.value) + '" data-lm-field="' + field.key + '">' + esc(item.label) + '</button>';
      }).join('') + (values.length ? '' : '<p class="lm-picker-empty">没有匹配的选项</p>');
    }
    function renderField(field) {
      var values = getOptions(field);
      var value = state.filters[field.key] || '';
      if (values.length > 10) {
        var selected = values.find(function (item) { return item.value === value; });
        return '<div class="lm-picker" data-lm-picker="' + field.key + '"><button type="button" class="lm-control lm-picker-trigger" data-lm-action="picker" aria-expanded="false" aria-label="' + esc(field.label) + '"><span>' + esc(selected ? selected.label : '全部' + field.label) + '</span><i class="bi bi-chevron-down"></i></button><div class="lm-picker-panel" hidden><input type="search" class="lm-control" data-lm-picker-search="' + field.key + '" placeholder="搜索' + esc(field.label) + '" aria-label="搜索' + esc(field.label) + '"><div class="lm-options">' + pickerOptions(field, '') + '</div></div></div>';
      }
      return '<select class="lm-control" data-lm-filter="' + field.key + '" aria-label="' + esc(field.label) + '" title="' + esc(field.label) + '"><option value="">' + (options.filterLayout === 'grouped' ? '全部' : esc(field.label) + '：全部') + '</option>' + values.map(function (item) {
        return '<option value="' + esc(item.value) + '"' + (value === item.value ? ' selected' : '') + '>' + esc(item.label) + '</option>';
      }).join('') + '</select>';
    }
    function renderDateRange() {
      return DP.datePicker.render({ mode: 'range', label: options.timeLabel, output: 'datetime', start: state.filters.from, end: state.filters.to, startAttrs: { 'data-lm-date': 'from' }, endAttrs: { 'data-lm-date': 'to' } });
    }
    function renderFilters() {
      if (options.filterLayout === 'grouped') {
        root.querySelector('[data-lm-filters]').innerHTML = '<div class="lm-filter-primary">' + options.filters.map(function (field) {
          return '<div class="lm-filter-field"><span class="lm-filter-label">' + esc(field.label) + '</span>' + renderField(field) + '</div>';
        }).join('') + '</div><div class="lm-filter-secondary"><div class="lm-filter-field lm-filter-time"><span class="lm-filter-label">' + esc(options.timeLabel) + '</span><div class="lm-date-range">' +
          renderDateRange() + '</div></div>' +
          '<div class="lm-keyword-query"><label class="lm-filter-field lm-filter-keyword"><span class="lm-filter-label">关键词</span><input type="search" class="lm-control lm-keyword" data-lm-keyword value="' + esc(state.keyword) + '" placeholder="' + esc(options.keywordPlaceholder) + '" aria-label="关键词"></label><div class="lm-query-actions">' +
          button('query', 'search', '查询', '', 'btn-primary') + exportButton + '</div></div></div>';
        return;
      }
      root.querySelector('[data-lm-filters]').innerHTML = options.filters.map(renderField).join('') +
        '<input type="search" class="lm-control lm-keyword" data-lm-keyword value="' + esc(state.keyword) + '" placeholder="' + esc(options.keywordPlaceholder) + '" aria-label="关键词">' +
        '<div class="lm-date-range"><span>' + esc(options.timeLabel) + '</span>' + renderDateRange() + '</div>' +
        '<div class="lm-query-actions">' + button('query', 'search', '查询', '', 'btn-primary') + exportButton + '</div>';
    }
    function rows() { return filterRows(options.records, state.filters, options.keywordKeys); }
    function closePanels() {
      root.querySelectorAll('.lm-picker-panel, .lm-column-panel').forEach(function (el) { el.hidden = true; });
      root.querySelectorAll('[aria-expanded]').forEach(function (el) { el.setAttribute('aria-expanded', 'false'); });
    }
    function query() {
      var filters = Object.assign({}, state.filters);
      root.querySelectorAll('[data-lm-filter]').forEach(function (el) { filters[el.dataset.lmFilter] = el.value; });
      root.querySelectorAll('[data-lm-date]').forEach(function (el) {
        var value = el.value.replace('T', ' ');
        filters[el.dataset.lmDate] = value && value.length === 16 ? value + (el.dataset.lmDate === 'to' ? ':59' : ':00') : value;
      });
      filters.keyword = root.querySelector('[data-lm-keyword]').value;
      state.keyword = filters.keyword;
      if (filters.from && filters.to && filters.from > filters.to) { notice('开始时间不能晚于结束时间，请调整后查询。', true); return false; }
      options.filters.forEach(function (field) {
        if (field.parent && filters[field.parent] !== state.filters[field.parent]) filters[field.key] = '';
      });
      state.filters = filters;
      state.page = 1;
      notice('');
      renderFilters();
      renderTable();
      return true;
    }
    function renderColumns() {
      var panel = root.querySelector('.lm-column-panel');
      if (!panel) return;
      panel.innerHTML = '<strong>显示列</strong>' + options.columns.map(function (col) {
        var checked = state.hidden.indexOf(col.key) < 0;
        return '<label><input type="checkbox" data-lm-column="' + col.key + '"' + (checked ? ' checked' : '') + (checked && state.hidden.length === options.columns.length - 1 ? ' disabled' : '') + '>' + esc(col.label) + '</label>';
      }).join('');
    }
    function renderTable() {
      var filtered = rows();
      var count = Math.max(1, Math.ceil(filtered.length / state.size));
      state.page = Math.min(Math.max(1, state.page), count);
      var columns = options.columns.filter(function (col) { return state.hidden.indexOf(col.key) < 0; });
      var start = (state.page - 1) * state.size;
      var minWidth = columns.reduce(function (sum, col) { return sum + col.width; }, 0);
      var table = root.querySelector('[data-lm-table]');
      table.style.minWidth = minWidth + 'px';
      table.innerHTML = '<colgroup>' + columns.map(function (col) { return col.flexible ? '<col>' : '<col style="width:' + col.width + 'px">'; }).join('') + '</colgroup><thead><tr>' + columns.map(function (col) { return '<th scope="col">' + esc(col.label) + '</th>'; }).join('') + '</tr></thead><tbody>' +
        (filtered.length ? filtered.slice(start, start + state.size).map(function (row) {
          return '<tr>' + columns.map(function (col) { return '<td>' + (col.render ? col.render(row) : '<span class="lm-truncate" title="' + esc(row[col.key]) + '">' + esc(row[col.key]) + '</span>') + '</td>'; }).join('') + '</tr>';
        }).join('') : '<tr><td colspan="' + columns.length + '"><div class="lm-empty"><i class="bi bi-search"></i><strong>暂无匹配的日志</strong><span>请调整查询条件后重试</span></div></td></tr>') + '</tbody>';
      var nav = button('page', 'chevron-left', '上一页', 'data-page="' + (state.page - 1) + '"' + (state.page === 1 ? ' disabled' : ''));
      for (var p = 1; p <= count; p++) {
        if (p === 1 || p === count || Math.abs(p - state.page) <= 1) nav += '<button type="button" class="lm-page-number' + (p === state.page ? ' active' : '') + '" data-lm-action="page" data-page="' + p + '" aria-label="第' + p + '页"' + (p === state.page ? ' aria-current="page"' : '') + '>' + p + '</button>';
        else if (p === 2 || p === count - 1) nav += '<span>…</span>';
      }
      nav += button('page', 'chevron-right', '下一页', 'data-page="' + (state.page + 1) + '"' + (state.page === count ? ' disabled' : ''));
      root.querySelector('[data-lm-pagination]').innerHTML = '<span>第 ' + (filtered.length ? start + 1 : 0) + '–' + Math.min(start + state.size, filtered.length) + ' 条，共 ' + filtered.length + ' 条</span><div class="lm-page-nav">' + nav + '</div><select class="lm-control lm-page-size" data-lm-size aria-label="每页条数">' + [10, 20, 50].map(function (size) { return '<option value="' + size + '"' + (size === state.size ? ' selected' : '') + '>' + size + ' 条/页</option>'; }).join('') + '</select><label class="lm-page-jump">跳至 <input type="number" class="lm-control" data-lm-jump min="1" max="' + count + '" value="' + state.page + '" aria-label="跳转页码"> 页</label>' + button('jump', 'arrow-right', '跳转');
      var exportBtn = root.querySelector('[data-lm-action="export"]');
      if (exportBtn) exportBtn.disabled = !filtered.length;
      if (options.resultTitle) root.querySelector('[data-lm-result-count]').textContent = '共 ' + filtered.length + ' 条';
    }
    function closeDetail() {
      root.querySelector('[data-lm-overlay]').innerHTML = '';
      state.record = null;
      if (lastFocus && lastFocus.isConnected) lastFocus.focus();
    }
    function openDetail(id) {
      var record = options.records.find(function (row) { return row.id === id; });
      if (!record) return;
      closePanels();
      lastFocus = document.activeElement;
      state.record = record;
      root.querySelector('[data-lm-overlay]').innerHTML = '<div class="lm-mask" data-lm-mask><section class="lm-drawer" role="dialog" aria-modal="true" aria-labelledby="lm-detail-title"><header class="lm-drawer-head"><div><h2 id="lm-detail-title">' + esc(options.title) + '详情</h2><span>' + esc(record.id) + '</span></div>' + button('close-detail', 'x-lg', '关闭') + '</header><div class="lm-drawer-body">' + options.detail(record) + '</div><footer class="lm-drawer-footer"><span data-lm-copy-notice role="status"></span>' + button('close-detail', 'x-lg', '关闭') + '</footer></section></div>';
      root.querySelector('[data-lm-action="close-detail"]').focus();
    }
    function copySql() {
      var record = state.record;
      if (!record) return;
      var note = root.querySelector('[data-lm-copy-notice]');
      function fallback() {
        var area = document.createElement('textarea');
        area.value = record.sql;
        area.className = 'lm-copy-buffer';
        root.querySelector('.lm-drawer').appendChild(area);
        area.select();
        var ok = false;
        try { ok = document.execCommand('copy'); } catch (err) { ok = false; }
        area.remove();
        if (note.isConnected) note.textContent = ok ? 'SQL已复制' : '复制未成功，请选中SQL文本后复制。';
        if (state.record) root.querySelector('[data-lm-action="copy-sql"]').focus();
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(record.sql).then(function () { if (note.isConnected) note.textContent = 'SQL已复制'; }, function () { if (note.isConnected) fallback(); });
      } else fallback();
    }
    function exportRows() {
      var filtered = rows();
      if (!filtered.length) return;
      var url;
      try {
        url = URL.createObjectURL(new Blob([toCsv(filtered, options.exportColumns)], { type: 'text/csv;charset=utf-8;' }));
        var link = document.createElement('a');
        link.href = url;
        link.download = options.title + '_' + new Date().toISOString().slice(0, 10) + '.csv';
        root.appendChild(link);
        link.click();
        link.remove();
        setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
        notice('已导出当前查询结果，共 ' + filtered.length + ' 条' + exportHint + '。');
      } catch (err) { if (url) URL.revokeObjectURL(url); notice('导出失败，请重试。', true); }
    }
    function jump() {
      var input = root.querySelector('[data-lm-jump]');
      var page = Number(input.value);
      if (!Number.isInteger(page) || page < 1 || page > Number(input.max)) { notice('请输入1至' + input.max + '之间的有效页码。', true); return; }
      notice('');
      state.page = page;
      renderTable();
    }
    function init() {
      root = DP.contentArea.querySelector('.page-log-management');
      state.record = null;
      renderFilters(); renderColumns(); renderTable();
      root.addEventListener('submit', function (e) { e.preventDefault(); query(); });
      root.addEventListener('input', function (e) {
        if (e.target.matches('[data-lm-keyword]')) state.keyword = e.target.value;
        if (e.target.matches('[data-lm-picker-search]')) {
          var field = options.filters.find(function (item) { return item.key === e.target.dataset.lmPickerSearch; });
          e.target.parentNode.querySelector('.lm-options').innerHTML = pickerOptions(field, e.target.value);
        }
      });
      root.addEventListener('change', function (e) {
        var target = e.target;
        if (target.matches('[data-lm-filter], [data-lm-date]')) query();
        else if (target.matches('[data-lm-size]')) { state.size = Number(target.value); state.page = 1; renderTable(); }
        else if (target.matches('[data-lm-column]')) {
          var key = target.dataset.lmColumn;
          if (target.checked) state.hidden = state.hidden.filter(function (item) { return item !== key; });
          else if (state.hidden.length < options.columns.length - 1) state.hidden.push(key);
          renderColumns(); renderTable();
        }
      });
      root.addEventListener('click', function (e) {
        if (e.target.matches('[data-lm-mask]')) { closeDetail(); return; }
        var option = e.target.closest('[data-lm-option]');
        if (option) {
          var key = option.dataset.lmField;
          var previous = state.filters[key];
          state.filters[key] = option.dataset.lmOption;
          if (!query()) state.filters[key] = previous;
          return;
        }
        var action = e.target.closest('[data-lm-action]');
        if (!action) { if (!e.target.closest('.lm-picker, .lm-column-picker')) closePanels(); return; }
        if (action.disabled) return;
        var name = action.dataset.lmAction;
        if (name !== 'picker' && name !== 'columns') closePanels();
        if (name === 'query') query();
        else if (name === 'clear-dates') { root.querySelectorAll('[data-lm-date]').forEach(function (el) { el.value = ''; }); query(); }
        else if (name === 'page') { state.page = Number(action.dataset.page); renderTable(); }
        else if (name === 'jump') jump();
        else if (name === 'detail') openDetail(action.dataset.id);
        else if (name === 'close-detail') closeDetail();
        else if (name === 'copy-sql') copySql();
        else if (name === 'export') exportRows();
        else if (name === 'picker' || name === 'columns') {
          var panel = action.parentNode.querySelector(name === 'picker' ? '.lm-picker-panel' : '.lm-column-panel');
          var open = panel.hidden;
          closePanels(); panel.hidden = !open; action.setAttribute('aria-expanded', String(open));
          if (open && name === 'picker') panel.querySelector('input').focus();
        }
      });
      root.addEventListener('keydown', function (e) {
        if (e.isComposing) return;
        if (e.key === 'Escape') { if (state.record) closeDetail(); else closePanels(); e.preventDefault(); }
        else if (e.key === 'Enter' && e.target.matches('[data-lm-keyword]')) { e.preventDefault(); query(); }
        else if (e.key === 'Enter' && e.target.matches('[data-lm-jump]')) { e.preventDefault(); jump(); }
        else if (e.key === 'Enter' && e.target.matches('[data-lm-picker-search]')) e.preventDefault();
        else if (e.key === 'Tab' && state.record) {
          var focusables = root.querySelector('.lm-drawer').querySelectorAll('button:not([disabled]), [tabindex="0"]');
          var first = focusables[0], last = focusables[focusables.length - 1];
          if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
          else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
      });
    }
    var noticeHtml = '<span class="lm-notice" data-lm-notice role="status" aria-live="polite"></span>';
    var toolbarActions = options.columnPicker ? '<div class="lm-column-picker">' + button('columns', 'sliders', '列筛选', 'aria-expanded="false"', 'btn-text') + '<div class="lm-column-panel" hidden></div></div>' : '';
    var toolbarHtml = options.resultTitle || toolbarActions ? '<div class="lm-toolbar">' + (options.resultTitle ? '<div class="lm-toolbar-summary"><span class="lm-result-title">' + esc(options.resultTitle) + '</span><span class="lm-result-count" data-lm-result-count></span>' + noticeHtml + '</div>' : noticeHtml) + '<div class="lm-toolbar-actions">' + toolbarActions + '</div></div>' : noticeHtml;
    return {
      html: '<section class="page-log-management lm-' + options.kind + '" aria-label="' + esc(options.title) + '"><form class="lm-filters" data-lm-filters></form>' + toolbarHtml + '<div class="lm-table-wrap"><table class="ds-table lm-table" data-lm-table aria-label="' + esc(options.title) + '"></table></div><div class="lm-pagination" data-lm-pagination></div><div data-lm-overlay></div></section>',
      init: init
    };
  }
  return { create: create, esc: esc, button: button, fields: fields, content: content, filterRows: filterRows, toCsv: toCsv };
}());
