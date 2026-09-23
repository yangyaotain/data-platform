/**
 * 数据中台 V4.0 - 公共日志查看器
 * 用于执行日志、任务日志和运行日志的只读查看，统一提供主题、字号、格式化、搜索、复制、下载和全屏能力。
 */
window.DP = window.DP || {};

DP.logViewer = (function () {
  'use strict';

  var root = null;
  var currentContent = '';
  var currentFileName = '运行日志.log';
  var previousFocus = null;
  var noticeTimer = null;
  var theme = 'dark';
  var fontSize = '13px';
  var searchIndex = -1;

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (char) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char];
    });
  }

  function button(action, icon, label, primary) {
    return '<button type="button" class="dp-log-viewer-btn' + (primary ? ' is-primary' : '') + '" data-dp-log-action="' + action + '"><i class="bi bi-' + icon + '" aria-hidden="true"></i><span>' + label + '</span></button>';
  }

  function selectOptions(values, selected) {
    return values.map(function (value) { return '<option value="' + esc(value) + '"' + (value === selected ? ' selected' : '') + '>' + esc(value) + '</option>'; }).join('');
  }

  function ensureRoot() {
    if (root && root.isConnected) return root;
    root = document.createElement('div');
    root.className = 'dp-log-viewer';
    root.hidden = true;
    root.innerHTML = '<div class="dp-log-viewer-mask" data-dp-log-action="close"></div>' +
      '<section class="dp-log-viewer-dialog theme-dark" role="dialog" aria-modal="true" aria-labelledby="dpLogViewerTitle">' +
        '<header class="dp-log-viewer-head"><div><h3 id="dpLogViewerTitle">运行日志</h3><p data-dp-log-subtitle></p></div><button type="button" class="dp-log-viewer-close" data-dp-log-action="close" aria-label="关闭日志查看器"><i class="bi bi-x-lg" aria-hidden="true"></i></button></header>' +
        '<div class="dp-log-viewer-meta" data-dp-log-meta></div>' +
        '<div class="dp-log-viewer-toolbar"><select class="dp-log-viewer-select" data-dp-log-theme aria-label="日志主题"><option value="dark">暗色 - One Dark</option><option value="light">亮色 - Light</option></select><select class="dp-log-viewer-select" data-dp-log-font aria-label="日志字号">' + selectOptions(['12px', '13px', '14px', '15px', '16px', '18px', '20px', '22px', '24px'], fontSize) + '</select>' + button('format', 'text-indent-left', '格式化') + button('copy', 'clipboard', '复制日志') + button('search', 'search', '搜索') + button('download', 'download', '下载日志') + button('fullscreen', 'arrows-fullscreen', '全屏查看') + '</div>' +
        '<div class="dp-log-viewer-searchbar"><input type="text" class="dp-log-viewer-input" data-dp-log-search placeholder="查找日志内容..." aria-label="查找日志内容">' + button('find-next', 'chevron-down', '下一个') + button('find-prev', 'chevron-up', '上一个') + '<label><input type="checkbox" data-dp-log-case> 区分大小写</label><span data-dp-log-match>0 个结果</span><button type="button" class="dp-log-viewer-search-close" data-dp-log-action="close-search" aria-label="关闭搜索"><i class="bi bi-x-lg" aria-hidden="true"></i></button></div>' +
        '<div class="dp-log-viewer-content"><pre tabindex="0" data-dp-log-content></pre></div>' +
        '<footer class="dp-log-viewer-foot"><span data-dp-log-summary></span>' + button('close', 'x-lg', '关闭', true) + '</footer>' +
        '<div class="dp-log-viewer-notice" data-dp-log-notice role="status" aria-live="polite"></div>' +
      '</section>';
    document.body.appendChild(root);
    root.addEventListener('click', handleClick);
    root.addEventListener('change', handleChange);
    root.addEventListener('input', handleInput);
    root.addEventListener('keydown', handleKeydown);
    return root;
  }

  function renderMeta(meta) {
    var target = root.querySelector('[data-dp-log-meta]');
    var items = Array.isArray(meta) ? meta : [];
    target.innerHTML = items.map(function (item) {
      var tone = item.tone ? ' is-' + esc(item.tone) : '';
      return '<span class="dp-log-viewer-meta-item"><em>' + esc(item.label) + '</em><b class="' + tone + '">' + esc(item.value) + '</b></span>';
    }).join('');
    target.hidden = !items.length;
  }

  function normalizeFileName(value) {
    var name = String(value || '运行日志.log').replace(/[\\/:*?"<>|]/g, '_').trim();
    if (!name) name = '运行日志.log';
    return /\.log$/i.test(name) ? name : name + '.log';
  }

  function formatLog(value) {
    var normalized = String(value == null ? '' : value).replace(/\r\n?/g, '\n');
    var trimmed = normalized.split('\n').map(function (line) { return line.replace(/[ \t]+$/g, ''); }).join('\n').trim();
    if (!trimmed) return '暂无日志内容';
    try { return JSON.stringify(JSON.parse(trimmed), null, 2); } catch (error) { return trimmed.replace(/\n{3,}/g, '\n\n'); }
  }

  function updateSummary() {
    var lineCount = currentContent.split(/\r?\n/).length;
    root.querySelector('[data-dp-log-summary]').textContent = '共 ' + lineCount + ' 行 · ' + currentContent.length.toLocaleString('zh-CN') + ' 个字符';
  }

  function searchMatches() {
    var input = root.querySelector('[data-dp-log-search]');
    var query = input ? input.value : '';
    if (!query) return [];
    var caseSensitive = root.querySelector('[data-dp-log-case]').checked;
    var source = caseSensitive ? currentContent : currentContent.toLowerCase();
    var needle = caseSensitive ? query : query.toLowerCase();
    var matches = [];
    var from = 0;
    while (from <= source.length - needle.length) {
      var index = source.indexOf(needle, from);
      if (index < 0) break;
      matches.push({ index: index, length: needle.length });
      from = index + Math.max(needle.length, 1);
    }
    return matches;
  }

  function renderContent(scrollToMatch) {
    var content = root.querySelector('[data-dp-log-content]');
    var matches = searchMatches();
    var counter = root.querySelector('[data-dp-log-match]');
    if (!matches.length) {
      searchIndex = -1;
      content.textContent = currentContent;
      counter.textContent = '0 个结果';
      return;
    }
    if (searchIndex < 0 || searchIndex >= matches.length) searchIndex = 0;
    var cursor = 0;
    var html = '';
    matches.forEach(function (match, index) {
      html += esc(currentContent.slice(cursor, match.index));
      html += '<mark' + (index === searchIndex ? ' class="is-current"' : '') + ' data-dp-log-match-index="' + index + '">' + esc(currentContent.slice(match.index, match.index + match.length)) + '</mark>';
      cursor = match.index + match.length;
    });
    content.innerHTML = html + esc(currentContent.slice(cursor));
    counter.textContent = (searchIndex + 1) + ' / ' + matches.length;
    if (scrollToMatch) {
      var active = content.querySelector('mark.is-current');
      if (active) active.scrollIntoView({ block: 'center', inline: 'nearest' });
    }
  }

  function moveMatch(direction) {
    var matches = searchMatches();
    if (!matches.length) { searchIndex = -1; renderContent(false); return; }
    searchIndex = direction < 0 ? (searchIndex <= 0 ? matches.length - 1 : searchIndex - 1) : (searchIndex + 1) % matches.length;
    renderContent(true);
  }

  function closeSearch() {
    var dialog = root.querySelector('.dp-log-viewer-dialog');
    var input = root.querySelector('[data-dp-log-search]');
    dialog.classList.remove('search-open');
    input.value = '';
    searchIndex = -1;
    renderContent(false);
  }

  function notify(message, failed) {
    var notice = root.querySelector('[data-dp-log-notice]');
    notice.classList.toggle('is-error', !!failed);
    notice.innerHTML = '<i class="bi bi-' + (failed ? 'exclamation-circle' : 'check-circle') + '" aria-hidden="true"></i><span>' + esc(message) + '</span>';
    notice.classList.add('show');
    window.clearTimeout(noticeTimer);
    noticeTimer = window.setTimeout(function () { notice.classList.remove('show'); }, 1800);
  }

  function fallbackCopy() {
    var textarea = document.createElement('textarea');
    textarea.value = currentContent;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    var copied = false;
    try { copied = document.execCommand('copy'); } catch (error) { copied = false; }
    textarea.remove();
    if (copied) notify('日志已复制'); else notify('复制失败，请手动选择日志内容复制', true);
  }

  function copyLog() {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(currentContent).then(function () { notify('日志已复制'); }, fallbackCopy);
    } else fallbackCopy();
  }

  function downloadLog() {
    var url = '';
    try {
      url = URL.createObjectURL(new Blob(['\ufeff' + currentContent], { type: 'text/plain;charset=utf-8' }));
      var link = document.createElement('a');
      link.href = url; link.download = currentFileName;
      document.body.appendChild(link); link.click(); link.remove();
      window.setTimeout(function () { URL.revokeObjectURL(url); }, 0);
      notify('日志已下载');
    } catch (error) {
      if (url) URL.revokeObjectURL(url);
      notify('下载失败，请重试', true);
    }
  }

  function setFullscreen(fullscreen) {
    var dialog = root.querySelector('.dp-log-viewer-dialog');
    var buttonEl = root.querySelector('[data-dp-log-action="fullscreen"]');
    dialog.classList.toggle('is-fullscreen', fullscreen);
    buttonEl.querySelector('span').textContent = fullscreen ? '退出全屏' : '全屏查看';
    buttonEl.querySelector('i').className = 'bi bi-' + (fullscreen ? 'fullscreen-exit' : 'arrows-fullscreen');
    buttonEl.setAttribute('aria-pressed', String(fullscreen));
  }

  function setTheme(value) {
    theme = value === 'light' ? 'light' : 'dark';
    var dialog = root.querySelector('.dp-log-viewer-dialog');
    dialog.classList.toggle('theme-light', theme === 'light');
    dialog.classList.toggle('theme-dark', theme !== 'light');
    root.querySelector('[data-dp-log-theme]').value = theme;
  }

  function setFontSize(value) {
    var allowed = ['12px', '13px', '14px', '15px', '16px', '18px', '20px', '22px', '24px'];
    fontSize = allowed.indexOf(value) >= 0 ? value : '13px';
    root.querySelector('[data-dp-log-content]').style.fontSize = fontSize;
    root.querySelector('[data-dp-log-font]').value = fontSize;
  }

  function close() {
    if (!root || root.hidden) return;
    setFullscreen(false);
    closeSearch();
    root.hidden = true;
    document.body.classList.remove('dp-log-viewer-open');
    if (previousFocus && previousFocus.isConnected) previousFocus.focus();
    previousFocus = null;
  }

  function handleClick(event) {
    var action = event.target.closest('[data-dp-log-action]');
    if (!action) return;
    var name = action.dataset.dpLogAction;
    if (name === 'close') close();
    else if (name === 'format') { currentContent = formatLog(currentContent); searchIndex = -1; renderContent(false); updateSummary(); notify('日志已格式化'); }
    else if (name === 'copy') copyLog();
    else if (name === 'search') { root.querySelector('.dp-log-viewer-dialog').classList.add('search-open'); root.querySelector('[data-dp-log-search]').focus(); }
    else if (name === 'close-search') closeSearch();
    else if (name === 'find-next') moveMatch(1);
    else if (name === 'find-prev') moveMatch(-1);
    else if (name === 'download') downloadLog();
    else if (name === 'fullscreen') setFullscreen(!root.querySelector('.dp-log-viewer-dialog').classList.contains('is-fullscreen'));
  }

  function handleChange(event) {
    if (event.target.matches('[data-dp-log-theme]')) setTheme(event.target.value);
    else if (event.target.matches('[data-dp-log-font]')) setFontSize(event.target.value);
    else if (event.target.matches('[data-dp-log-case]')) { searchIndex = -1; moveMatch(1); }
  }

  function handleInput(event) {
    if (!event.target.matches('[data-dp-log-search]')) return;
    searchIndex = -1;
    moveMatch(1);
  }

  function handleKeydown(event) {
    if (event.target.matches('[data-dp-log-search]') && event.key === 'Enter') {
      event.preventDefault();
      moveMatch(event.shiftKey ? -1 : 1);
    }
  }

  function open(options) {
    options = options || {};
    ensureRoot();
    previousFocus = document.activeElement;
    currentContent = String(options.content || '暂无日志内容');
    currentFileName = normalizeFileName(options.fileName);
    root.querySelector('#dpLogViewerTitle').textContent = options.title || '运行日志';
    var subtitle = root.querySelector('[data-dp-log-subtitle]');
    subtitle.textContent = options.subtitle || '';
    subtitle.hidden = !options.subtitle;
    renderMeta(options.meta);
    closeSearch();
    setTheme(options.theme || theme);
    setFontSize(options.fontSize || fontSize);
    renderContent(false);
    updateSummary();
    setFullscreen(false);
    root.hidden = false;
    document.body.classList.add('dp-log-viewer-open');
    var closeButton = root.querySelector('.dp-log-viewer-close');
    if (closeButton) closeButton.focus();
  }

  document.addEventListener('keydown', function (event) {
    if (!root || root.hidden) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      if (root.querySelector('.dp-log-viewer-dialog').classList.contains('search-open')) closeSearch();
      else if (root.querySelector('.dp-log-viewer-dialog').classList.contains('is-fullscreen')) setFullscreen(false);
      else close();
    }
  });

  document.addEventListener('click', function (event) {
    if (root && !root.hidden && event.target.closest('[data-menu]')) close();
  }, true);

  return { open: open, close: close, format: formatLog, isOpen: function () { return !!(root && !root.hidden); } };
}());
