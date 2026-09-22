/**
 * 数据中台 V4.0 - 公共 SQL 编辑器组件
 * 统一提供主题、字号、格式化、复制、搜索、替换、全屏与行号能力。
 */
window.DP = window.DP || {};

DP.sqlEditor = (function () {
  function escapeHtml(text) {
    return String(text == null ? '' : text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function highlightSql(sql) {
    var html = escapeHtml(sql || '');
    html = html.replace(/(--[^\n]*)/g, '<span class="dp-sql-comment">$1</span>');
    html = html.replace(/('(?:''|[^'])*')/g, '<span class="dp-sql-string">$1</span>');
    html = html.replace(/(\$\{[^}]+\})/g, '<span class="dp-sql-var">$1</span>');
    html = html.replace(/\b(select|from|where|and|or|left|right|inner|outer|join|on|group|by|order|having|limit|offset|case|when|then|else|end|as|count|sum|max|min|avg|distinct|insert|update|delete|into|values|set|is|not|null|like|in|between|union|all|with|show|desc|explain)\b/gi, '<span class="dp-sql-keyword">$1</span>');
    return html;
  }

  function lineNumbers(sql) {
    var count = Math.max(String(sql || '').split('\n').length, 1);
    var html = '';
    for (var i = 1; i <= count; i += 1) html += '<div>' + i + '</div>';
    return html;
  }

  function actionButton(action, icon, label, primary) {
    return '<button class="dp-sql-editor-btn' + (primary ? ' dp-sql-editor-btn-primary' : '') + '" type="button" data-dp-sql-action="' + escapeHtml(action) + '"><i class="bi bi-' + escapeHtml(icon) + '"></i><span>' + escapeHtml(label) + '</span></button>';
  }

  function render(opts) {
    opts = opts || {};
    var id = opts.id || 'sql-editor';
    var value = opts.value || '';
    var theme = opts.theme === 'light' ? 'light' : 'dark';
    var font = opts.font || '14px';
    var leadingActions = Array.isArray(opts.leadingActions) ? opts.leadingActions : [];
    var leading = leadingActions.map(function (item) {
      return actionButton(item.action, item.icon || 'circle', item.label || item.action, !!item.primary);
    }).join('');
    var sizes = ['12px', '13px', '14px', '15px', '16px', '18px', '20px', '22px', '24px'];

    return '<div class="dp-sql-editor theme-' + theme + '" data-dp-sql-editor="' + escapeHtml(id) + '" style="font-size:' + escapeHtml(font) + ';">' +
      '<div class="dp-sql-editor-toolbar">' +
        '<div class="dp-sql-editor-toolbar-leading">' + leading + '</div>' +
        '<div class="dp-sql-editor-toolbar-tools">' +
          '<select class="dp-sql-editor-select" data-dp-sql-theme aria-label="编辑器主题"><option value="dark"' + (theme === 'dark' ? ' selected' : '') + '>暗色 - One Dark</option><option value="light"' + (theme === 'light' ? ' selected' : '') + '>亮色 - Light</option></select>' +
          '<select class="dp-sql-editor-select" data-dp-sql-font aria-label="编辑器字号">' + sizes.map(function (size) { return '<option' + (size === font ? ' selected' : '') + '>' + size + '</option>'; }).join('') + '</select>' +
          actionButton('format', 'text-indent-left', '格式化') +
          actionButton('copy', 'clipboard', '复制') +
          actionButton('search', 'search', '搜索') +
          actionButton('fullscreen', 'arrows-fullscreen', '全屏') +
        '</div>' +
      '</div>' +
      '<div class="dp-sql-editor-searchbar">' +
        '<input class="dp-sql-editor-input" type="text" data-dp-sql-find placeholder="查找...">' +
        '<button class="dp-sql-editor-btn" type="button" data-dp-sql-action="find-next"><i class="bi bi-chevron-down"></i><span>下一个</span></button>' +
        '<button class="dp-sql-editor-btn" type="button" data-dp-sql-action="find-prev"><i class="bi bi-chevron-up"></i><span>上一个</span></button>' +
        '<button class="dp-sql-editor-btn" type="button" data-dp-sql-action="select-all"><i class="bi bi-check2-all"></i><span>全选</span></button>' +
        '<label class="dp-sql-editor-check"><input type="checkbox" data-dp-sql-case> 区分大小写</label>' +
        '<label class="dp-sql-editor-check"><input type="checkbox" data-dp-sql-regex> 使用正则表达式</label>' +
        '<label class="dp-sql-editor-check"><input type="checkbox" data-dp-sql-whole> 全字匹配</label>' +
        '<input class="dp-sql-editor-input" type="text" data-dp-sql-replace placeholder="替换...">' +
        '<button class="dp-sql-editor-btn" type="button" data-dp-sql-action="replace"><i class="bi bi-arrow-repeat"></i><span>替换</span></button>' +
        '<button class="dp-sql-editor-btn" type="button" data-dp-sql-action="replace-all"><i class="bi bi-arrow-repeat"></i><span>全部替换</span></button>' +
        '<span class="dp-sql-editor-match-count" data-dp-sql-match>0 个结果</span>' +
        '<span class="dp-sql-editor-close" data-dp-sql-action="close-search" title="关闭搜索"><i class="bi bi-x-lg"></i></span>' +
      '</div>' +
      '<div class="dp-sql-editor-wrap">' +
        '<div class="dp-sql-editor-gutter" data-dp-sql-gutter>' + lineNumbers(value) + '</div>' +
        '<div class="dp-sql-editor-content" data-dp-sql-content contenteditable="' + (opts.readonly ? 'false' : 'true') + '" spellcheck="false" role="textbox" aria-multiline="true" aria-label="SQL 编辑区">' + highlightSql(value) + '</div>' +
      '</div>' +
    '</div>';
  }

  function getValue(editor) {
    var content = editor && editor.querySelector('[data-dp-sql-content]');
    return content ? content.innerText.replace(/\u00a0/g, ' ') : '';
  }

  function updateGutter(editor) {
    var gutter = editor.querySelector('[data-dp-sql-gutter]');
    if (gutter) gutter.innerHTML = lineNumbers(getValue(editor));
  }

  function setValue(editor, value, handlers) {
    var content = editor && editor.querySelector('[data-dp-sql-content]');
    if (!content) return;
    content.innerHTML = highlightSql(value || '');
    updateGutter(editor);
    if (handlers && handlers.onChange) handlers.onChange(value || '', editor);
  }

  function getSelectionOffsets(content) {
    var selection = window.getSelection();
    if (!content || !selection || !selection.rangeCount) return null;
    var range = selection.getRangeAt(0);
    if (!content.contains(range.startContainer) || !content.contains(range.endContainer)) return null;
    var startRange = range.cloneRange();
    startRange.selectNodeContents(content);
    startRange.setEnd(range.startContainer, range.startOffset);
    var endRange = range.cloneRange();
    endRange.selectNodeContents(content);
    endRange.setEnd(range.endContainer, range.endOffset);
    return { start: startRange.toString().length, end: endRange.toString().length };
  }

  function rememberCursor(editor) {
    var content = editor && editor.querySelector('[data-dp-sql-content]');
    var offsets = getSelectionOffsets(content);
    if (!offsets) return;
    editor.dataset.dpCursorStart = String(offsets.start);
    editor.dataset.dpCursorEnd = String(offsets.end);
  }

  function focusAt(editor, offset) {
    var content = editor && editor.querySelector('[data-dp-sql-content]');
    if (!content) return;
    var textLength = getValue(editor).length;
    var safeOffset = Math.max(0, Math.min(Number(offset), textLength));
    var position = locateTextOffset(content, safeOffset);
    content.focus();
    var range = document.createRange();
    range.setStart(position.node, position.offset);
    range.collapse(true);
    var selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    editor.dataset.dpCursorStart = String(safeOffset);
    editor.dataset.dpCursorEnd = String(safeOffset);
  }

  function insertAtCursor(editor, text, handlers) {
    if (!editor) return;
    var value = getValue(editor);
    var content = editor.querySelector('[data-dp-sql-content]');
    var offsets = getSelectionOffsets(content);
    var start = offsets ? offsets.start : Number(editor.dataset.dpCursorStart);
    var end = offsets ? offsets.end : Number(editor.dataset.dpCursorEnd);
    if (!Number.isFinite(start)) start = value.length;
    if (!Number.isFinite(end)) end = start;
    var inserted = String(text == null ? '' : text);
    var next = value.slice(0, start) + inserted + value.slice(end);
    setValue(editor, next, handlers);
    focusAt(editor, start + inserted.length);
  }

  function formatSql(sql) {
    return String(sql || '')
      .replace(/\s+/g, ' ')
      .replace(/\s*,\s*/g, ', ')
      .replace(/\s+(FROM|WHERE|LEFT JOIN|RIGHT JOIN|INNER JOIN|OUTER JOIN|JOIN|GROUP BY|ORDER BY|HAVING|LIMIT|UNION ALL|UNION)\s+/gi, '\n$1 ')
      .replace(/\s+(AND|OR)\s+/gi, '\n  $1 ')
      .replace(/;\s*/g, ';\n')
      .trim();
  }

  function findMatches(editor) {
    var input = editor.querySelector('[data-dp-sql-find]');
    var query = input ? input.value : '';
    if (!query) return [];
    var text = getValue(editor);
    var useRegex = editor.querySelector('[data-dp-sql-regex]')?.checked;
    var caseSensitive = editor.querySelector('[data-dp-sql-case]')?.checked;
    var whole = editor.querySelector('[data-dp-sql-whole]')?.checked;
    var flags = caseSensitive ? 'g' : 'gi';
    var source = useRegex ? query : query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (whole) source = '\\b(?:' + source + ')\\b';
    try {
      var regex = new RegExp(source, flags);
      var matches = [];
      var match;
      while ((match = regex.exec(text)) !== null) {
        matches.push({ index: match.index, length: Math.max(match[0].length, 1) });
        if (!match[0].length) regex.lastIndex += 1;
      }
      return matches;
    } catch (error) {
      return [];
    }
  }

  function locateTextOffset(root, offset) {
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    var total = 0;
    var node;
    while ((node = walker.nextNode())) {
      if (total + node.nodeValue.length >= offset) return { node: node, offset: offset - total };
      total += node.nodeValue.length;
    }
    return { node: root, offset: root.childNodes.length };
  }

  function selectMatch(editor, direction) {
    var matches = findMatches(editor);
    var label = editor.querySelector('[data-dp-sql-match]');
    if (!matches.length) {
      if (label) label.textContent = '0 个结果';
      editor.dataset.dpFindIndex = '-1';
      return;
    }
    var current = Number(editor.dataset.dpFindIndex || '-1');
    current = direction < 0 ? (current <= 0 ? matches.length - 1 : current - 1) : (current + 1) % matches.length;
    editor.dataset.dpFindIndex = String(current);
    if (label) label.textContent = (current + 1) + ' / ' + matches.length;
    var content = editor.querySelector('[data-dp-sql-content]');
    var start = locateTextOffset(content, matches[current].index);
    var end = locateTextOffset(content, matches[current].index + matches[current].length);
    var range = document.createRange();
    range.setStart(start.node, start.offset);
    range.setEnd(end.node, end.offset);
    var selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    if (start.node.parentElement) start.node.parentElement.scrollIntoView({ block: 'nearest' });
  }

  function replaceMatches(editor, all, handlers) {
    var input = editor.querySelector('[data-dp-sql-find]');
    var replacement = editor.querySelector('[data-dp-sql-replace]');
    var query = input ? input.value : '';
    if (!query) return;
    var text = getValue(editor);
    var matches = findMatches(editor);
    if (!matches.length) return;
    var next = text;
    if (all) {
      for (var i = matches.length - 1; i >= 0; i -= 1) {
        next = next.slice(0, matches[i].index) + (replacement ? replacement.value : '') + next.slice(matches[i].index + matches[i].length);
      }
    } else {
      var current = Number(editor.dataset.dpFindIndex || '0');
      if (current < 0 || current >= matches.length) current = 0;
      next = text.slice(0, matches[current].index) + (replacement ? replacement.value : '') + text.slice(matches[current].index + matches[current].length);
    }
    setValue(editor, next, handlers);
    editor.dataset.dpFindIndex = '-1';
    selectMatch(editor, 1);
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(text);
    var textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    textarea.remove();
    return Promise.resolve();
  }

  function mount(root, handlers) {
    root = root || document;
    handlers = handlers || {};
    root.querySelectorAll('[data-dp-sql-editor]').forEach(function (editor) {
      if (editor.dataset.dpSqlBound === 'true') return;
      editor.dataset.dpSqlBound = 'true';
      var content = editor.querySelector('[data-dp-sql-content]');
      if (content) {
        content.addEventListener('input', function () {
          updateGutter(editor);
          rememberCursor(editor);
          if (handlers.onChange) handlers.onChange(getValue(editor), editor);
        });
        content.addEventListener('click', function () { rememberCursor(editor); });
        content.addEventListener('keyup', function () { rememberCursor(editor); });
        content.addEventListener('focus', function () { rememberCursor(editor); });
      }
      editor.addEventListener('change', function (event) {
        if (event.target.matches('[data-dp-sql-theme]')) {
          editor.classList.toggle('theme-light', event.target.value === 'light');
          editor.classList.toggle('theme-dark', event.target.value !== 'light');
          if (handlers.onStateChange) handlers.onStateChange('theme', event.target.value, editor);
        } else if (event.target.matches('[data-dp-sql-font]')) {
          editor.style.fontSize = event.target.value;
          if (handlers.onStateChange) handlers.onStateChange('font', event.target.value, editor);
        } else if (event.target.matches('[data-dp-sql-case], [data-dp-sql-regex], [data-dp-sql-whole]')) {
          editor.dataset.dpFindIndex = '-1';
          selectMatch(editor, 1);
        }
      });
      editor.addEventListener('input', function (event) {
        if (event.target.matches('[data-dp-sql-find]')) {
          editor.dataset.dpFindIndex = '-1';
          selectMatch(editor, 1);
        }
      });
      editor.addEventListener('keydown', function (event) {
        if (event.target.matches('[data-dp-sql-find]') && event.key === 'Enter') {
          event.preventDefault();
          selectMatch(editor, event.shiftKey ? -1 : 1);
        }
      });
      editor.addEventListener('click', function (event) {
        var button = event.target.closest('[data-dp-sql-action]');
        if (!button) return;
        var action = button.dataset.dpSqlAction;
        if (action === 'format') setValue(editor, formatSql(getValue(editor)), handlers);
        else if (action === 'copy') copyText(getValue(editor)).then(function () { if (handlers.onNotify) handlers.onNotify('SQL 已复制', 'success'); });
        else if (action === 'search') {
          editor.classList.add('search-open');
          var findInput = editor.querySelector('[data-dp-sql-find]');
          if (findInput) findInput.focus();
        } else if (action === 'close-search') editor.classList.remove('search-open');
        else if (action === 'find-next') selectMatch(editor, 1);
        else if (action === 'find-prev') selectMatch(editor, -1);
        else if (action === 'select-all') {
          var range = document.createRange();
          range.selectNodeContents(content);
          var selection = window.getSelection();
          selection.removeAllRanges();
          selection.addRange(range);
        } else if (action === 'replace') replaceMatches(editor, false, handlers);
        else if (action === 'replace-all') replaceMatches(editor, true, handlers);
        else if (action === 'fullscreen') {
          editor.classList.toggle('is-fullscreen');
          var isFull = editor.classList.contains('is-fullscreen');
          var label = button.querySelector('span');
          var icon = button.querySelector('i');
          if (label) label.textContent = isFull ? '退出全屏' : '全屏';
          if (icon) icon.className = isFull ? 'bi bi-fullscreen-exit' : 'bi bi-arrows-fullscreen';
          if (handlers.onStateChange) handlers.onStateChange('fullscreen', isFull, editor);
        } else if (handlers.onAction) handlers.onAction(action, editor);
      });
    });
  }

  return {
    render: render,
    mount: mount,
    getValue: getValue,
    setValue: setValue,
    insertAtCursor: insertAtCursor,
    focusAt: focusAt,
    formatSql: formatSql
  };
})();
