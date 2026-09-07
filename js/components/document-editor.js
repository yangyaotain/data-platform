/** 公共文档富文本编辑器：沿用平台字体和按钮，保留参考系统的基础编辑工具。 */
window.DP = window.DP || {};
DP.documentEditor = (function () {
  'use strict';
  var tools = [
    ['emoji', 'emoji-smile', '表情'], ['heading', 'type-h1', '标题'], ['bold', 'type-bold', '粗体'],
    ['italic', 'type-italic', '斜体'], ['strikeThrough', 'type-strikethrough', '删除线'], ['link', 'link-45deg', '链接'],
    ['insertUnorderedList', 'list-ul', '无序列表'], ['insertOrderedList', 'list-ol', '有序列表'], ['task', 'check2-square', '任务列表'],
    ['outdent', 'text-indent-left', '反向缩进'], ['indent', 'text-indent-right', '缩进'], ['quote', 'quote', '引用'],
    ['rule', 'hr', '分隔线'], ['codeblock', 'code-square', '代码块'], ['code', 'code', '行内代码'],
    ['start', 'box-arrow-in-up', '起始插入行'], ['end', 'box-arrow-in-down', '末尾插入行'], ['table', 'table', '表格'],
    ['undo', 'arrow-counterclockwise', '撤销'], ['redo', 'arrow-clockwise', '重做']
  ];
  var allowed = ['P', 'DIV', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'B', 'STRONG', 'I', 'EM', 'S', 'STRIKE', 'DEL', 'A', 'UL', 'OL', 'LI', 'BLOCKQUOTE', 'PRE', 'CODE', 'HR', 'BR', 'TABLE', 'THEAD', 'TBODY', 'TR', 'TH', 'TD', 'SPAN', 'INPUT'];
  function esc(value) { return String(value == null ? '' : value).replace(/[&<>"']/g, function (ch) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]; }); }
  function safeLink(value) {
    var text = String(value || '').trim();
    if (!text || /[\u0000-\u0020]/.test(text)) return false;
    if (text[0] === '#') return true;
    if (/^mailto:/i.test(text)) return /^mailto:[^@]+@[^@]+\.[^@]+$/i.test(text);
    if (!/^https?:\/\//i.test(text)) return false;
    try { return !!new URL(text).hostname; } catch (error) { return false; }
  }
  function sanitize(source) {
    var holder = document.createElement('div'); holder.innerHTML = source || '';
    holder.querySelectorAll('script, style, iframe, object, embed, svg, math, form, meta, link, img, video, audio').forEach(function (node) { node.remove(); });
    Array.from(holder.querySelectorAll('*')).reverse().forEach(function (node) {
      if (allowed.indexOf(node.tagName) < 0) { node.replaceWith.apply(node, Array.from(node.childNodes)); return; }
      if (node.tagName === 'INPUT' && node.getAttribute('type') !== 'checkbox') { node.remove(); return; }
      var href = node.getAttribute('href'), checked = node.hasAttribute('checked'), colspan = node.getAttribute('colspan');
      Array.from(node.attributes).forEach(function (attr) { node.removeAttribute(attr.name); });
      if (node.tagName === 'A' && safeLink(href)) { node.setAttribute('href', href.trim()); node.setAttribute('target', '_blank'); node.setAttribute('rel', 'noopener noreferrer'); }
      if (node.tagName === 'INPUT') { node.setAttribute('type', 'checkbox'); node.setAttribute('aria-label', '任务完成状态'); if (checked) node.setAttribute('checked', ''); }
      if ((node.tagName === 'TH' || node.tagName === 'TD') && /^[1-9]\d?$/.test(colspan || '')) node.setAttribute('colspan', colspan);
    });
    return holder.innerHTML;
  }
  function button(action, icon, label, attrs) {
    return '<button type="button" class="dre-tool" data-dre-action="' + action + '" title="' + esc(label) + '" ' + (attrs || '') + '><i class="bi bi-' + icon + '" aria-hidden="true"></i><span>' + esc(label) + '</span></button>';
  }
  function create(host, options) {
    options = options || {};
    var readOnly = !!options.readOnly, range = null, history = [], position = 0;
    host.innerHTML = '<div class="dp-document-editor' + (readOnly ? ' is-readonly' : '') + '">' + (readOnly ? '' : '<div class="dre-toolbar" role="toolbar" aria-label="文档编辑工具">' + tools.map(function (tool) { return button(tool[0], tool[1], tool[2]); }).join('') + '</div><div class="dre-popover" hidden></div>') +
      '<div class="dre-content"' + (readOnly ? '' : ' contenteditable="true" role="textbox" aria-multiline="true" aria-label="文档内容" data-placeholder="请输入文档内容"') + '>' + sanitize(options.html) + '</div></div>';
    var root = host.querySelector('.dp-document-editor'), editor = host.querySelector('.dre-content'), pop = host.querySelector('.dre-popover');
    if (readOnly) { editor.querySelectorAll('input').forEach(function (input) { input.disabled = true; }); return { getHTML: function () { return sanitize(editor.innerHTML); }, focus: function () {}, destroy: function () {} }; }
    history = [editor.innerHTML];
    function remember() {
      var selection = window.getSelection();
      if (selection && selection.rangeCount && editor.contains(selection.getRangeAt(0).commonAncestorContainer)) range = selection.getRangeAt(0).cloneRange();
    }
    function restore(atEnd) {
      editor.focus(); var selection = window.getSelection();
      if (!selection) return;
      if (!range || !editor.contains(range.commonAncestorContainer) || atEnd) { range = document.createRange(); range.selectNodeContents(editor); range.collapse(false); }
      selection.removeAllRanges(); selection.addRange(range);
    }
    function commit() {
      var html = editor.innerHTML;
      if (html !== history[position]) { history = history.slice(0, position + 1); history.push(html); if (history.length > 80) history.shift(); position = history.length - 1; }
      root.querySelector('[data-dre-action="undo"]').disabled = position === 0;
      root.querySelector('[data-dre-action="redo"]').disabled = position === history.length - 1;
      if (options.onChange) options.onChange(sanitize(html));
      remember();
    }
    function closePopover() { pop.hidden = true; pop.innerHTML = ''; }
    function execute(command, value) {
      restore();
      document.execCommand('styleWithCSS', false, false);
      document.execCommand(command, false, value == null ? null : value);
      commit();
    }
    function insert(html) { execute('insertHTML', sanitize(html)); }
    function selectedText() { restore(); return String(window.getSelection() || ''); }
    function showPopover(action) {
      remember();
      var html = '';
      if (action === 'emoji') html = '<div class="dre-emoji-options">' + ['😀', '👍', '✅', '📌', '📊', '📁', '⚠️', '💡'].map(function (emoji) { return button('insert-emoji', 'emoji-smile', emoji, 'data-value="' + emoji + '"'); }).join('') + '</div>';
      if (action === 'heading') html = '<div class="dre-heading-options">' + ['正文', '标题 1', '标题 2', '标题 3', '标题 4', '标题 5', '标题 6'].map(function (label, i) { return button('set-heading', 'type', label, 'data-value="' + (i ? 'h' + i : 'p') + '"'); }).join('') + '</div>';
      if (action === 'link') html = '<label>链接文字<input class="dre-input" data-dre-link-text value="' + esc(selectedText()) + '" placeholder="请输入链接文字"></label><label>链接地址<input class="dre-input" data-dre-link-url placeholder="https://"></label><p class="dre-error" role="alert"></p>' + button('insert-link', 'check2', '插入链接');
      if (action === 'table') html = '<div class="dre-table-inputs"><label>行数<input class="dre-input" type="number" data-dre-rows min="1" max="20" value="3"></label><label>列数<input class="dre-input" type="number" data-dre-cols min="1" max="10" value="3"></label></div><p class="dre-error" role="alert"></p>' + button('insert-table', 'table', '插入表格');
      pop.innerHTML = '<div class="dre-pop-head"><strong>' + esc(tools.find(function (tool) { return tool[0] === action; })[2]) + '</strong>' + button('close', 'x-lg', '关闭') + '</div>' + html;
      pop.hidden = false;
      pop.style.top = (root.querySelector('.dre-toolbar').offsetHeight + 4) + 'px';
      var input = pop.querySelector('input'); if (input) input.focus();
    }
    function action(name, value) {
      if (['emoji', 'heading', 'link', 'table'].indexOf(name) >= 0) { showPopover(name); return; }
      if (name === 'close') { closePopover(); restore(); return; }
      if (name === 'undo' || name === 'redo') {
        var next = position + (name === 'undo' ? -1 : 1);
        if (next >= 0 && next < history.length) { position = next; editor.innerHTML = history[position]; range = null; restore(true); commit(); }
        return;
      }
      if (name === 'insert-link') {
        var url = pop.querySelector('[data-dre-link-url]').value.trim(), label = pop.querySelector('[data-dre-link-text]').value.trim();
        if (!safeLink(url) || !label) { pop.querySelector('.dre-error').textContent = '请填写链接文字和有效的 HTTP、HTTPS 或邮件地址。'; return; }
        insert('<a href="' + esc(url) + '">' + esc(label) + '</a>'); closePopover(); return;
      }
      if (name === 'insert-table') {
        var rows = Number(pop.querySelector('[data-dre-rows]').value), cols = Number(pop.querySelector('[data-dre-cols]').value);
        if (!Number.isInteger(rows) || !Number.isInteger(cols) || rows < 1 || rows > 20 || cols < 1 || cols > 10) { pop.querySelector('.dre-error').textContent = '请输入 1–20 行、1–10 列。'; return; }
        var html = '<table><tbody>';
        for (var r = 0; r < rows; r++) { html += '<tr>'; for (var c = 0; c < cols; c++) html += r === 0 ? '<th>列' + (c + 1) + '</th>' : '<td><br></td>'; html += '</tr>'; }
        insert(html + '</tbody></table><p><br></p>'); closePopover(); return;
      }
      if (name === 'insert-emoji') { insert(esc(value)); closePopover(); return; }
      if (name === 'set-heading') { execute('formatBlock', value); closePopover(); return; }
      if (name === 'task') { insert('<ul><li><input type="checkbox"> 待办事项</li></ul><p><br></p>'); return; }
      if (name === 'quote') { execute('formatBlock', 'blockquote'); return; }
      if (name === 'rule') { insert('<hr><p><br></p>'); return; }
      if (name === 'codeblock') { insert('<pre><code>' + esc(selectedText() || '请输入代码') + '</code></pre><p><br></p>'); return; }
      if (name === 'code') { insert('<code>' + esc(selectedText() || '代码') + '</code> '); return; }
      if (name === 'start' || name === 'end') { range = document.createRange(); range.selectNodeContents(editor); range.collapse(name === 'start'); insert('<p><br></p>'); return; }
      if (['bold', 'italic', 'strikeThrough', 'insertUnorderedList', 'insertOrderedList', 'outdent', 'indent'].indexOf(name) >= 0) execute(name);
    }
    root.addEventListener('mousedown', function (event) {
      if (event.target.closest('.dre-toolbar')) { remember(); event.preventDefault(); }
    });
    root.addEventListener('click', function (event) {
      var target = event.target.closest('[data-dre-action]');
      if (target && !target.disabled) { action(target.dataset.dreAction, target.dataset.value); return; }
      if (event.target.closest('.dre-content')) closePopover();
    });
    editor.addEventListener('mouseup', remember);
    editor.addEventListener('keyup', remember);
    editor.addEventListener('input', commit);
    editor.addEventListener('change', function (event) {
      if (event.target.type === 'checkbox') { if (event.target.checked) event.target.setAttribute('checked', ''); else event.target.removeAttribute('checked'); commit(); }
    });
    editor.addEventListener('paste', function (event) {
      if (!event.clipboardData) return;
      event.preventDefault(); remember();
      var html = event.clipboardData.getData('text/html');
      insert(html ? sanitize(html) : esc(event.clipboardData.getData('text/plain')).replace(/\r?\n/g, '<br>'));
    });
    var shortcuts = { e: 'emoji', h: 'heading', b: 'bold', i: 'italic', d: 'strikeThrough', k: 'link', l: 'insertUnorderedList', o: 'insertOrderedList', j: 'task', ';': 'quote', u: 'codeblock', g: 'code', m: 'table', z: 'undo', y: 'redo' };
    editor.addEventListener('keydown', function (event) {
      if (!event.ctrlKey && !event.metaKey) return;
      var key = event.key.toLowerCase(), command = shortcuts[key];
      if (event.shiftKey) command = { i: 'outdent', o: 'indent', h: 'rule', b: 'start', e: 'end', z: 'redo' }[key];
      if (command) { event.preventDefault(); remember(); action(command); }
    });
    root.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && !pop.hidden) { event.preventDefault(); event.stopPropagation(); closePopover(); restore(); }
      if (event.key === 'Enter' && event.target.closest('.dre-popover')) { event.preventDefault(); var submit = pop.querySelector('[data-dre-action="insert-link"], [data-dre-action="insert-table"]'); if (submit) submit.click(); }
    });
    commit();
    return { getHTML: function () { return sanitize(editor.innerHTML); }, focus: function () { restore(true); }, destroy: function () { closePopover(); range = null; }, command: action };
  }
  return { create: create, sanitize: sanitize, safeLink: safeLink, tools: tools };
}());
