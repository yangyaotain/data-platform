/**
 * 数据中台 V4.0 - AI 助手交互逻辑
 * 侧边抽屉 + 最大化全屏 + 模拟对话
 */
window.DP = window.DP || {};

DP.initAiAssistant = function () {
  var btn = document.getElementById('aiAssistantBtn');
  var panel = document.getElementById('aiPanel');
  var overlay = document.getElementById('aiOverlay');
  var closeBtn = document.getElementById('aiClose');
  var maxBtn = document.getElementById('aiMaximize');
  var minBtn = document.getElementById('aiMinimize');
  var minDock = document.getElementById('aiMinimizedDock');
  var newChatBtn = document.getElementById('aiNewChat');
  var sendBtn = document.getElementById('aiSendBtn');
  var input = document.getElementById('aiInput');
  var welcome = document.getElementById('aiWelcome');
  var messages = document.getElementById('aiMessages');
  var chatArea = document.getElementById('aiChatArea');
  var historySidebar = document.getElementById('aiHistorySidebar');

  if (!panel || !btn) return;

  function _syncWelcomeView() {
    if (!chatArea || !welcome) return;
    var showWelcome = welcome.style.display !== 'none';
    chatArea.classList.toggle('is-welcome-view', showWelcome);
  }

  var _isMax = false;
  var _wasMaxBeforeMin = false;

  var _genAbort = false;
  var _streamTimers = [];
  var _isGenerating = false;
  var _attachments = [];

  function _clearGenTimers() {
    _streamTimers.forEach(function (id) { clearTimeout(id); });
    _streamTimers = [];
  }
  function _schedule(fn, ms) {
    var id = setTimeout(function () {
      _streamTimers = _streamTimers.filter(function (t) { return t !== id; });
      fn();
    }, ms);
    _streamTimers.push(id);
  }

  function _setSendMode(isStop) {
    _isGenerating = isStop;
    sendBtn.classList.toggle('is-stop', isStop);
    sendBtn.title = isStop ? '停止生成' : '发送';
    var icon = sendBtn.querySelector('i');
    if (icon) icon.className = isStop ? 'bi bi-stop-fill' : 'bi bi-send-fill';
    if (input) input.disabled = !!isStop;
  }

  function _stopGeneration() {
    if (!sendBtn.classList.contains('is-stop') && !document.getElementById('aiThinkingMsg') && !messages.querySelector('.ai-msg.ai-streaming')) {
      return;
    }
    _genAbort = true;
    _clearGenTimers();
    _setSendMode(false);
    var thinking = document.getElementById('aiThinkingMsg');
    if (thinking) thinking.remove();
    var streamMsg = messages.querySelector('.ai-msg.bot.ai-streaming');
    if (streamMsg) {
      streamMsg.classList.remove('ai-streaming');
      var bubble = streamMsg.querySelector('.ai-msg-bubble');
      if (bubble) bubble.classList.remove('ai-stream-cursor');
      streamMsg.classList.add('ai-msg-stopped');
      if (bubble && (bubble.textContent || '').indexOf('已停止') < 0) {
        bubble.innerHTML = (bubble.innerHTML || '') + '<br><span style="color:#fa8c16;font-size:12px;">（已停止生成）</span>';
      }
    }
  }

  function _beginReplyPipeline(question) {
    _genAbort = false;
    _clearGenTimers();
    _setSendMode(true);
    welcome.style.display = 'none';
    messages.style.display = '';
    _syncWelcomeView();

    var thinking = document.createElement('div');
    thinking.id = 'aiThinkingMsg';
    thinking.className = 'ai-msg bot';
    thinking.innerHTML =
      '<div class="ai-msg-avatar"><i class="bi bi-robot"></i></div>' +
      '<div class="ai-msg-content">' +
        '<div class="ai-msg-bubble ai-thinking-bubble">' +
          '<div class="ai-thinking-line"><span class="ai-thinking-dot"></span><span>正在理解您的问题…</span></div>' +
          '<div class="ai-thinking-line"><span class="ai-thinking-dot"></span><span>检索数据中台元数据与知识库…</span></div>' +
          '<div class="ai-thinking-line"><span class="ai-thinking-dot"></span><span>正在组织回答内容…</span></div>' +
        '</div>' +
      '</div>';
    messages.appendChild(thinking);
    chatArea.scrollTop = chatArea.scrollHeight;

    var lines = thinking.querySelectorAll('.ai-thinking-line');
    _schedule(function () { if (!_genAbort && lines[0]) lines[0].classList.add('is-on'); }, 250);
    _schedule(function () { if (!_genAbort && lines[1]) lines[1].classList.add('is-on'); }, 750);
    _schedule(function () { if (!_genAbort && lines[2]) lines[2].classList.add('is-on'); }, 1250);

    _schedule(function () {
      if (_genAbort) return;
      thinking.remove();
      _streamBotReply(question);
    }, 2200);
  }

  function _streamBotReply(question) {
    if (_genAbort) return;
    var reply = _generateReply(question);
    var plain = _htmlToPlain(reply.text);
    var div = document.createElement('div');
    div.className = 'ai-msg bot ai-streaming';
    div.innerHTML =
      '<div class="ai-msg-avatar"><i class="bi bi-robot"></i></div>' +
      '<div class="ai-msg-content">' +
        '<div class="ai-msg-bubble ai-stream-cursor"></div>' +
      '</div>';
    messages.appendChild(div);
    chatArea.scrollTop = chatArea.scrollHeight;

    var bubble = div.querySelector('.ai-msg-bubble');
    var content = div.querySelector('.ai-msg-content');
    var i = 0;
    var delay = 14;

    function tick() {
      if (_genAbort) return;
      if (i < plain.length) {
        bubble.textContent = plain.slice(0, i + 1);
        i++;
        _schedule(tick, delay);
        chatArea.scrollTop = chatArea.scrollHeight;
      } else {
        bubble.classList.remove('ai-stream-cursor');
        bubble.innerHTML = reply.text;
        if (reply.links) {
          content.insertAdjacentHTML('beforeend', _buildLinks(reply.links, reply.linksTitle));
        }
        content.insertAdjacentHTML('beforeend',
          '<div class="ai-msg-toolbar">' +
            '<i class="bi bi-clipboard" title="复制"></i>' +
            '<i class="bi bi-arrow-clockwise" title="重新生成"></i>' +
            '<i class="bi bi-hand-thumbs-up" title="有用"></i>' +
            '<i class="bi bi-hand-thumbs-down" title="无用"></i>' +
            '<span class="ai-msg-time">' + _now() + '</span>' +
          '</div>'
        );
        div.classList.remove('ai-streaming');
        _setSendMode(false);
        chatArea.scrollTop = chatArea.scrollHeight;
      }
    }
    _schedule(tick, 100);
  }

  function _htmlToPlain(html) {
    var s = String(html).replace(/<br\s*\/?>/gi, '\n').replace(/<\/p>/gi, '\n');
    var tmp = document.createElement('div');
    tmp.innerHTML = s;
    return tmp.textContent || tmp.innerText || '';
  }

  function _renderAttachments() {
    var box = document.getElementById('aiAttachments');
    if (!box) return;
    box.innerHTML = '';
    _attachments.forEach(function (a, idx) {
      var chip = document.createElement('span');
      chip.className = 'ai-attach-chip';
      chip.innerHTML =
        '<i class="bi ' + (a.isImg ? 'bi-image' : 'bi-file-earmark') + '"></i>' +
        '<span class="ai-attach-name">' + _escapeHtml(a.name) + '</span>' +
        '<span class="ai-attach-remove" data-i="' + idx + '"><i class="bi bi-x-lg"></i></span>';
      box.appendChild(chip);
    });
    box.querySelectorAll('.ai-attach-remove').forEach(function (el) {
      el.addEventListener('click', function () {
        var i = parseInt(el.getAttribute('data-i'), 10);
        if (!isNaN(i)) {
          _attachments.splice(i, 1);
          _renderAttachments();
        }
      });
    });
  }

  var fileImg = document.getElementById('aiFileImage');
  var fileDoc = document.getElementById('aiFileDoc');
  var btnImg = document.getElementById('aiUploadImg');
  var btnFile = document.getElementById('aiUploadFile');
  if (btnImg && fileImg) {
    btnImg.addEventListener('click', function () { fileImg.click(); });
    fileImg.addEventListener('change', function (e) {
      var fs = e.target.files;
      if (!fs || !fs.length) return;
      for (var i = 0; i < fs.length; i++) {
        _attachments.push({ name: fs[i].name, isImg: true, file: fs[i] });
      }
      e.target.value = '';
      _renderAttachments();
    });
  }
  if (btnFile && fileDoc) {
    btnFile.addEventListener('click', function () { fileDoc.click(); });
    fileDoc.addEventListener('change', function (e) {
      var fs = e.target.files;
      if (!fs || !fs.length) return;
      for (var j = 0; j < fs.length; j++) {
        _attachments.push({ name: fs[j].name, isImg: false, file: fs[j] });
      }
      e.target.value = '';
      _renderAttachments();
    });
  }

  /* ---- 打开面板 ---- */
  btn.addEventListener('click', function () {
    if (panel.classList.contains('open') && !panel.classList.contains('ai-minimized')) {
      _close();
    } else {
      panel.classList.remove('ai-minimized');
      if (minDock) minDock.classList.remove('show');
      panel.classList.add('open');
      btn.classList.add('active');
      if (!_isMax) overlay.classList.add('show');
    }
  });

  /* ---- 关闭 ---- */
  function _close() {
    panel.classList.remove('open');
    panel.classList.remove('maximized');
    panel.classList.remove('ai-minimized');
    if (minDock) minDock.classList.remove('show');
    btn.classList.remove('active');
    overlay.classList.remove('show');
    _isMax = false;
    _wasMaxBeforeMin = false;
    maxBtn.className = 'bi bi-arrows-fullscreen';
    maxBtn.title = '最大化';
  }
  closeBtn.addEventListener('click', _close);
  overlay.addEventListener('click', function () {
    if (!_isMax) _close();
  });

  /* ---- 最大化 / 还原 ---- */
  maxBtn.addEventListener('click', function () {
    _isMax = !_isMax;
    if (_isMax) {
      panel.classList.add('maximized');
      overlay.classList.remove('show');
      maxBtn.className = 'bi bi-fullscreen-exit';
      maxBtn.title = '还原';
    } else {
      panel.classList.remove('maximized');
      overlay.classList.add('show');
      maxBtn.className = 'bi bi-arrows-fullscreen';
      maxBtn.title = '最大化';
    }
  });

  /* ---- 最小化（收起到右下角浮条） ---- */
  if (minBtn && minDock) {
    minBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      _wasMaxBeforeMin = _isMax;
      panel.classList.add('ai-minimized');
      minDock.classList.add('show');
      overlay.classList.remove('show');
      btn.classList.add('active');
    });
    minDock.addEventListener('click', function () {
      panel.classList.remove('ai-minimized');
      minDock.classList.remove('show');
      panel.classList.add('open');
      if (_wasMaxBeforeMin) {
        panel.classList.add('maximized');
        _isMax = true;
        maxBtn.className = 'bi bi-fullscreen-exit';
        maxBtn.title = '还原';
      } else {
        overlay.classList.add('show');
      }
    });
  }

  /* ---- 新建对话 ---- */
  newChatBtn.addEventListener('click', function () {
    _stopGeneration();
    _genAbort = false;
    _clearGenTimers();
    _setSendMode(false);
    welcome.style.display = '';
    messages.style.display = 'none';
    messages.innerHTML = '';
    input.value = '';
    _fitTextarea();
    _attachments = [];
    _renderAttachments();
    _syncWelcomeView();
  });

  /* ---- 发送 / 停止 ---- */
  function _send() {
    var text = input.value.trim();
    if (!text && !_attachments.length) return;

    var userText = text;
    if (_attachments.length) {
      var names = _attachments.map(function (a) { return a.name; }).join('、');
      userText = (text ? text + '\n' : '') + '【附件】' + names;
    }

    welcome.style.display = 'none';
    messages.style.display = '';
    _syncWelcomeView();
    _appendMsg('user', userText);
    input.value = '';
    _fitTextarea();
    var qForBot = text || '（附件咨询）';
    _attachments = [];
    _renderAttachments();
    _beginReplyPipeline(qForBot);
  }

  sendBtn.addEventListener('click', function () {
    if (sendBtn.classList.contains('is-stop')) {
      _stopGeneration();
    } else {
      _send();
    }
  });

  function _fitTextarea() {
    if (!input || input.tagName !== 'TEXTAREA') return;
    input.style.height = 'auto';
    var maxPx = parseFloat(getComputedStyle(input).maxHeight) || 280;
    var minH = 38;
    var h = Math.min(Math.max(input.scrollHeight, minH), maxPx);
    input.style.height = h + 'px';
  }

  input.addEventListener('input', _fitTextarea);
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      if (e.shiftKey) return;
      e.preventDefault();
      if (!sendBtn.classList.contains('is-stop')) _send();
    }
  });

  /* 左缘拖动：调整侧栏宽度（非最大化时） */
  var widthHandle = document.getElementById('aiPanelWidthHandle');
  if (widthHandle && panel) {
    widthHandle.addEventListener('mousedown', function (e) {
      if (e.button !== 0) return;
      if (panel.classList.contains('maximized')) return;
      e.preventDefault();
      e.stopPropagation();
      var startX = e.clientX;
      var startW = panel.offsetWidth;
      var prevTransition = panel.style.transition;
      panel.style.transition = 'none';
      function onMove(ev) {
        ev.preventDefault();
        var dx = startX - ev.clientX;
        var next = Math.max(320, Math.min(800, startW + dx));
        panel.style.setProperty('--ai-panel-width', next + 'px');
      }
      function onUp() {
        panel.style.transition = prevTransition || '';
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      }
      document.body.style.cursor = 'ew-resize';
      document.body.style.userSelect = 'none';
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    });
  }

  _fitTextarea();

  /* ---- 剪贴板粘贴：图片 / 文件（与常见 AI 对话一致） ---- */
  function _addPastedFile(f) {
    if (!f || !(f instanceof File)) return;
    var name = f.name;
    if (!name || name === 'image.png' || name === 'blob') {
      name = 'clipboard-' + Date.now() + (f.type && f.type.indexOf('image/') === 0 ? '.' + (f.type.split('/')[1] || 'png') : '');
    }
    _attachments.push({
      name: name,
      isImg: !!(f.type && f.type.indexOf('image/') === 0),
      file: f
    });
  }
  function _handleInputPaste(e) {
    var cd = e.clipboardData;
    if (!cd) return;
    var added = false;
    if (cd.items && cd.items.length) {
      for (var i = 0; i < cd.items.length; i++) {
        if (cd.items[i].kind === 'file') {
          var f = cd.items[i].getAsFile();
          if (f) {
            _addPastedFile(f);
            added = true;
          }
        }
      }
    }
    if (!added && cd.files && cd.files.length) {
      for (var j = 0; j < cd.files.length; j++) {
        _addPastedFile(cd.files[j]);
        added = true;
      }
    }
    if (added) {
      e.preventDefault();
      e.stopPropagation();
      _renderAttachments();
    }
  }
  var inputArea = panel.querySelector('.ai-input-area');
  if (inputArea) {
    inputArea.addEventListener('paste', _handleInputPaste, true);
  }

  /* ---- 建议问题点击 ---- */
  panel.querySelectorAll('.ai-suggest-item').forEach(function (item) {
    item.addEventListener('click', function () {
      input.value = item.textContent.trim();
      _fitTextarea();
      _send();
    });
  });

  /* ---- 历史记录：初始化 + 置顶 / 重命名 / 删除 ---- */
  var histInput = panel.querySelector('.ai-history-input');
  var histList = document.getElementById('aiHistoryList');

  var _ahMenu = document.createElement('div');
  _ahMenu.className = 'ah-context-menu';
  _ahMenu.innerHTML =
    '<div class="ah-menu-item" data-act="pin"><i class="bi bi-pin-angle"></i><span>置顶</span></div>' +
    '<div class="ah-menu-item" data-act="rename"><i class="bi bi-pencil"></i><span>重命名</span></div>' +
    '<div class="ah-menu-divider"></div>' +
    '<div class="ah-menu-item ah-menu-danger" data-act="delete"><i class="bi bi-trash3"></i><span>删除</span></div>';
  document.body.appendChild(_ahMenu);
  var _ahMenuTarget = null;

  function _historyText(el) {
    var span = el.querySelector('.ah-text');
    return ((span || el).textContent || '').replace(/\s+/g, ' ').trim();
  }

  function _enhanceHistoryItem(item) {
    if (item.querySelector('.ah-text')) return;
    var raw = item.textContent.trim();
    item.textContent = '';
    var span = document.createElement('span');
    span.className = 'ah-text';
    span.textContent = raw;
    item.appendChild(span);
    var moreBtn = document.createElement('span');
    moreBtn.className = 'ah-more-btn';
    moreBtn.innerHTML = '<i class="bi bi-three-dots"></i>';
    item.appendChild(moreBtn);

    span.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (item.querySelector('.ah-rename-input')) return;
      _activateHistory(item);
    });

    moreBtn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      _showCtxMenu(item, moreBtn, e);
    });

    item.addEventListener('contextmenu', function (e) {
      e.preventDefault();
      e.stopPropagation();
      _showCtxMenu(item, moreBtn, e);
    });
  }

  function _activateHistory(item) {
    histList.querySelectorAll('.ai-history-item').forEach(function (h) { h.classList.remove('active'); });
    item.classList.add('active');
    welcome.style.display = 'none';
    messages.style.display = '';
    _syncWelcomeView();
    messages.innerHTML = '';
    var qtext = _historyText(item);
    _appendMsg('user', qtext);
    _beginReplyPipeline(qtext);
  }

  function _showCtxMenu(item, anchor, e) {
    _ahMenuTarget = item;
    var moreBtn = item.querySelector('.ah-more-btn');
    histList.querySelectorAll('.ah-more-btn').forEach(function (b) { b.classList.remove('ah-menu-open'); });
    if (moreBtn) moreBtn.classList.add('ah-menu-open');

    var pinLabel = _ahMenu.querySelector('[data-act="pin"] span');
    if (pinLabel) pinLabel.textContent = item.classList.contains('pinned') ? '取消置顶' : '置顶';
    var pinIcon = _ahMenu.querySelector('[data-act="pin"] i');
    if (pinIcon) pinIcon.className = item.classList.contains('pinned') ? 'bi bi-pin-angle-fill' : 'bi bi-pin-angle';

    _ahMenu.classList.add('show');
    var rect = anchor.getBoundingClientRect();
    var mw = _ahMenu.offsetWidth || 130;
    var mh = _ahMenu.offsetHeight || 120;
    var left = rect.right + 4;
    var top = rect.top;
    if (left + mw > window.innerWidth) left = rect.left - mw - 4;
    if (top + mh > window.innerHeight) top = window.innerHeight - mh - 8;
    _ahMenu.style.left = left + 'px';
    _ahMenu.style.top = top + 'px';
  }

  function _hideCtxMenu() {
    _ahMenu.classList.remove('show');
    histList.querySelectorAll('.ah-more-btn').forEach(function (b) { b.classList.remove('ah-menu-open'); });
    _ahMenuTarget = null;
  }

  document.addEventListener('click', function (e) {
    if (!_ahMenu.contains(e.target)) _hideCtxMenu();
  });
  document.addEventListener('scroll', _hideCtxMenu, true);

  _ahMenu.querySelectorAll('.ah-menu-item').forEach(function (mi) {
    mi.addEventListener('click', function (e) {
      e.stopPropagation();
      if (!_ahMenuTarget) return;
      var act = mi.dataset.act;
      var target = _ahMenuTarget;
      _hideCtxMenu();

      if (act === 'pin') {
        var wasPinned = target.classList.contains('pinned');
        target.classList.toggle('pinned');
        if (!wasPinned) {
          var firstNonPinned = histList.querySelector('.ai-history-item:not(.pinned)');
          if (firstNonPinned) {
            histList.insertBefore(target, firstNonPinned);
          } else {
            histList.appendChild(target);
          }
        }
      } else if (act === 'rename') {
        _beginRename(target);
      } else if (act === 'delete') {
        var wasActive = target.classList.contains('active');
        target.remove();
        if (wasActive) {
          var first = histList.querySelector('.ai-history-item');
          if (first) {
            first.classList.add('active');
          } else {
            welcome.style.display = '';
            messages.style.display = 'none';
            messages.innerHTML = '';
            _syncWelcomeView();
          }
        }
      }
    });
  });

  function _beginRename(item) {
    var textSpan = item.querySelector('.ah-text');
    if (!textSpan) return;
    var oldText = textSpan.textContent.trim();
    var inp = document.createElement('input');
    inp.type = 'text';
    inp.className = 'ah-rename-input';
    inp.value = oldText;
    textSpan.style.display = 'none';
    var moreBtn = item.querySelector('.ah-more-btn');
    if (moreBtn) moreBtn.style.display = 'none';
    item.insertBefore(inp, textSpan);
    inp.focus();
    inp.select();

    function _commit() {
      var v = inp.value.trim();
      if (v) textSpan.textContent = v;
      textSpan.style.display = '';
      if (moreBtn) moreBtn.style.display = '';
      inp.remove();
    }
    inp.addEventListener('blur', _commit);
    inp.addEventListener('keydown', function (ke) {
      if (ke.key === 'Enter') { ke.preventDefault(); inp.blur(); }
      if (ke.key === 'Escape') { inp.value = oldText; inp.blur(); }
    });
  }

  if (histList) {
    histList.querySelectorAll('.ai-history-item').forEach(_enhanceHistoryItem);
  }

  function _filterHistoryList() {
    if (!histList) return;
    var q = (histInput && histInput.value) ? histInput.value.trim().toLowerCase() : '';
    var children = Array.prototype.slice.call(histList.querySelectorAll('.ai-history-item'));
    if (!q) {
      children.forEach(function (el) { el.style.removeProperty('display'); });
      return;
    }
    children.forEach(function (el) {
      var t = _historyText(el).toLowerCase();
      el.style.display = t.indexOf(q) >= 0 ? '' : 'none';
    });
  }
  if (histInput) {
    histInput.addEventListener('input', _filterHistoryList);
    histInput.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { histInput.value = ''; _filterHistoryList(); }
    });
  }

  /* ---- 历史侧边栏拖动调整宽度 ---- */
  var histResizeHandle = document.getElementById('aiHistResizeHandle');
  if (histResizeHandle && historySidebar) {
    histResizeHandle.addEventListener('mousedown', function (e) {
      if (e.button !== 0) return;
      e.preventDefault();
      e.stopPropagation();
      var startX = e.clientX;
      var startW = historySidebar.offsetWidth;
      histResizeHandle.classList.add('dragging');
      document.body.style.cursor = 'ew-resize';
      document.body.style.userSelect = 'none';
      function onMove(ev) {
        ev.preventDefault();
        var next = startW + (ev.clientX - startX);
        next = Math.max(200, Math.min(420, next));
        historySidebar.style.setProperty('--ai-hist-width', next + 'px');
      }
      function onUp() {
        histResizeHandle.classList.remove('dragging');
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
      }
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    });
  }

  /* ---- 追加用户消息 ---- */
  function _appendMsg(role, text) {
    var div = document.createElement('div');
    div.className = 'ai-msg ' + role;
    var icon = role === 'user' ? 'bi-person-fill' : 'bi-robot';
    var body = _escapeHtml(text).replace(/\r\n/g, '\n').replace(/\n/g, '<br>');
    div.innerHTML =
      '<div class="ai-msg-avatar"><i class="bi ' + icon + '"></i></div>' +
      '<div class="ai-msg-content">' +
        '<div class="ai-msg-bubble">' + body + '</div>' +
      '</div>';
    messages.appendChild(div);
    chatArea.scrollTop = chatArea.scrollHeight;
  }

  /* ---- 构建链接列表 ---- */
  function _buildLinks(links, title) {
    var html = '<div class="ai-answer-links"><span class="ai-section-label">' + (title || '分析 5 条关联数据') + '</span>';
    links.forEach(function (l, i) {
      html += '<div class="ai-link-item"><span class="ai-link-name">' + (i + 1) + '. ' + l.name + '</span><span class="ai-link-path">' + l.path + '</span></div>';
    });
    html += '</div>';
    return html;
  }

  /* ---- SQL 代码块渲染（深色 + 语法高亮） ---- */
  function _codeBlock(sql) {
    var h = _escapeHtml(sql);
    h = h.replace(/\b(SELECT|FROM|WHERE|GROUP\s+BY|ORDER\s+BY|JOIN|ON|AS|BETWEEN|AND|OR|SUM|COUNT|DISTINCT|CREATE|TABLE|COMMENT|PARTITIONED\s+BY|LIFECYCLE|BIGINT|DATETIME|STRING|BOOLEAN|INT|DECIMAL|VARCHAR|DESC|ASC|LEFT|RIGHT|INNER)\b/gi, '<span class="kw">$&</span>');
    h = h.replace(/'([^']*)'/g, '<span class="str">\'$1\'</span>');
    return '<div class="ai-code-block"><div class="ai-code-header"><button class="ai-code-action">复制</button><button class="ai-code-action">插入</button><button class="ai-code-action">格式化</button></div><pre class="ai-code-body">' + h + '</pre></div>';
  }

  /* ---- 根据问题生成模拟回复 ---- */
  function _generateReply(q) {
    if (q.indexOf('人员信息') >= 0 || q.indexOf('数据表') >= 0) {
      return {
        text: '人员信息表主要记录了人员相关的各类信息，其内容主要包括以下几个方面：<br><br>' +
          '<b>基本信息：</b>姓名、性别、出生日期、身份证号、籍贯、婚姻状态、联系方式（电话、电子邮箱）等。<br>' +
          '<b>职业信息：</b>员工编号、入职日期、所属部门、岗位、职务、职级、薪资、人员状态、培训及业务归属等。<br>' +
          '<b>教育背景：</b>学历/学位、专业、学历、学位、毕业时间等。<br>' +
          '<b>工作经历：</b>包括过往工作年限、职位、工作时间段及工作内容和职责等详细信息。<br>' +
          '<b>家庭情况：</b>包括亲属关系信息、配置信息（如亲属）等。<br><br>' +
          '此外，根据业务需求，还可能包含联系人、紧急联系与帮扶、社保信息、住房等更多个性化信息。',
        linksTitle: '分析 5 条关联数据',
        links: [
          { name: 'personinfo（人员信息表）', path: '数据资产 · 数据源' },
          { name: '人员信息获取接口', path: '数据发布 · 队列数据' },
          { name: '人员信息数据采集流程', path: '项目开发 · 监控事项' },
          { name: '人员信息获取接口', path: '数据目录 · 共享数据' },
          { name: '人员信息数据清洗流程', path: '项目开发 · 在线编程' }
        ]
      };
    }
    if (q.indexOf('用户画像') >= 0) {
      return {
        text: '用户画像表（user_profile）通常包含以下核心字段：<br><br>' +
          '<b>标识字段：</b>user_id、mobile、id_card<br>' +
          '<b>基础属性：</b>gender、age、city、education<br>' +
          '<b>消费特征：</b>total_amount、avg_order_amount、purchase_frequency、last_purchase_date<br>' +
          '<b>行为标签：</b>active_level、channel_preference、interest_category<br>' +
          '<b>价值评分：</b>rfm_score、lifetime_value、churn_probability',
        linksTitle: '分析 3 条关联数据',
        links: [
          { name: 'dws_user_profile（用户画像宽表）', path: '数据资产 · 数据源' },
          { name: 'user_tag_config（标签配置表）', path: '数据资产 · 数据建模' },
          { name: '用户画像更新任务', path: '项目开发 · 监控事项' }
        ]
      };
    }
    if (q.indexOf('接口') >= 0 || q.indexOf('数据源') >= 0) {
      return {
        text: '该数据源目前注册了以下接口：<br><br>' +
          '1. <b>getDataList</b> — 分页查询数据记录<br>' +
          '2. <b>getDataById</b> — 按主键查询单条记录<br>' +
          '3. <b>syncMetadata</b> — 同步元数据信息<br>' +
          '4. <b>exportData</b> — 批量导出数据<br>' +
          '5. <b>getSchema</b> — 获取表结构定义<br><br>' +
          '以上接口均支持 RESTful 调用，详情可在「数据服务 - API管理」中查看。',
        links: null
      };
    }
    if (q.indexOf('SQL生成') >= 0 || q.indexOf('spu的销售额') >= 0) {
      return {
        text: _codeBlock(
          'SELECT spu_id,\n' +
          '    SUM(sales_amount) AS sales_amount,\n' +
          '    SUM(sales_volume) AS sales_volume,\n' +
          '    COUNT(DISTINCT sku_id) AS sku_count,\n' +
          '    COUNT(DISTINCT seller_id) AS seller_count,\n' +
          '    COUNT(DISTINCT buyer_id) AS buyer_count\n' +
          'FROM\n' +
          '    dwd.wh_etd_create_ord__di\n' +
          'WHERE\n' +
          '    ds BETWEEN \'20250101\' AND \'20250331\'\n' +
          'GROUP BY\n' +
          '    spu_id;'
        ) +
        '<br>这个SQL语句用于统计dwd_ec__trd_create_ord__di表中，从2025年1月1日至2025年3月31日每个spu的销售额(sales_amount)、销量(sales_volume)、sku数量(通过COUNT(DISTINCT sku_id)得到)。卖家数量(通过COUNT(DISTINCT seller_id)得到)、买家数量(通过COUNT(DISTINCT buyer_id)得到)。这里使用了GROUP BY语句对每个spu_id进行分组，并且使用了SUM和COUNT(DISTINCT)函数来计算相应的总和和唯一数量。',
        links: null
      };
    }
    if (q.indexOf('生成注释') >= 0 || q.indexOf('字段添加注释') >= 0) {
      return {
        text: _codeBlock(
          'CREATE TABLE ods_opd_user_info (\n' +
          '    id BIGINT COMMENT \'用户ID\',\n' +
          '    gmt_create DATETIME COMMENT \'创建时间\',\n' +
          '    gmt_modified DATETIME COMMENT \'修改时间\',\n' +
          '    id_card_number STRING COMMENT \'身份证号码\',\n' +
          '    id_card_type STRING COMMENT \'身份证类型\',\n' +
          '    nick STRING COMMENT \'昵称\',\n' +
          '    is_delete BOOLEAN COMMENT \'是否删除\',\n' +
          '    reg_address STRING COMMENT \'注册地址\',\n' +
          '    reg_birthdate DATETIME COMMENT \'注册出生日期\',\n' +
          '    reg_email STRING COMMENT \'注册邮箱\',\n' +
          '    reg_fullname STRING COMMENT \'注册全名\',\n' +
          '    reg_gender STRING COMMENT \'注册性别\',\n' +
          '    reg_mobile_phone STRING COMMENT \'注册手机号码\',\n' +
          '    reg_nation_id BIGINT COMMENT \'注册国家ID\',\n' +
          '    reg_prov_id BIGINT COMMENT \'注册省份ID\',\n' +
          '    user_active_time DATETIME COMMENT \'用户活跃时间\',\n' +
          '    user_active_type STRING COMMENT \'用户活跃类型\',\n' +
          '    user_id BIGINT COMMENT \'用户ID\',\n' +
          '    user_regdate DATETIME COMMENT \'用户注册日期\',\n' +
          '    user_regip STRING COMMENT \'用户注册IP\'\n' +
          ')\n' +
          'PARTITIONED BY (\n' +
          '    dt STRING COMMENT \'日期分区\'\n' +
          ')\n' +
          'LIFECYCLE 365;'
        ),
        links: null
      };
    }
    if (q.indexOf('解释') >= 0 && q.indexOf('SQL') >= 0) {
      return {
        text: '这个SQL语句使用了PIVOT操作，将season列的值转换为列名，并计算每个season的tran_amt总和。具体来说，这个SQL语句将mf_cop.sales表中的数据按照season列进行分组，并计算每个season的tran_amt总和。然后，它将season列的值转换为列名，并将每个season的tran_amt总和放在相应的列中。<br><br>' +
          '例如，假设mf_cop.sales表中有以下数据：<br>' +
          '| season | tran_amt |<br>' +
          '| ---------- | --------- |<br>' +
          '| Q1 | 100 |<br>' +
          '| Q2 | 200 |<br>' +
          '| Q3 | 300 |<br>' +
          '| Q4 | 400 |<br><br>' +
          '那么，这个SQL语句将返回以下结果：<br>' +
          '| spring | summer | autumn | winter |<br>' +
          '| --- | --- | --- | --- |<br>' +
          '| 100 | 200 | 300 | 400 |<br><br>' +
          '这个SQL语句的作用是将mf_cop.sales表中的数据按照season列进行分组，并计算每个season的tran_amt总和。然后，它将season列的值转换为列名，并将每个season的tran_amt总和放在相应的列中。',
        links: null
      };
    }
    if (q.indexOf('SQL改写') >= 0 || q.indexOf('列转置为行') >= 0) {
      return {
        text: _codeBlock(
          'SELECT\n' +
          '    d3,\n' +
          '    spu_id,\n' +
          '    \'total_sales\' AS metric,\n' +
          '    SUM(sales_amt) AS value\n' +
          'FROM\n' +
          '    default.dwd_ec_trd_create_ord_di\n' +
          'WHERE\n' +
          '    order_date BETWEEN \'2025-01-01\' AND \'2025-03-18\'\n' +
          'GROUP BY\n' +
          '    da, spu_id'
        ),
        links: null
      };
    }
    if (q.indexOf('代码优化') >= 0 || q.indexOf('优化下这段SQL') >= 0) {
      return {
        text: _codeBlock(
          'SELECT\n' +
          '    p.product_name,\n' +
          '    p.category,\n' +
          '    SUM(s.quantity) AS total_quantity,\n' +
          '    SUM(s.quantity * s.price) AS total_sales\n' +
          'FROM\n' +
          '    sales_data s\n' +
          'JOIN\n' +
          '    product_info p\n' +
          'ON\n' +
          '    s.product_id = p.product_id\n' +
          'WHERE\n' +
          '    s.sale_date BETWEEN \'2025-01-01\' AND \'2025-6-31\'\n' +
          'GROUP BY\n' +
          '    p.product_name, p.category\n' +
          'ORDER BY\n' +
          '    total_sales DESC;'
        ) +
        '<br>这个优化后的SQL代码直接在sales_data和product_info表上进行操作，避免了不必要的子查询。这样可以提高查询效率，尤其是在处理大数据量时。同时，通过JOIN操作将两个表的数据结合，然后根据产品名称和类别进行分组，最后按照总销售额降序排列。',
        links: null
      };
    }
    if (q.indexOf('SQL纠错') >= 0 || q.indexOf('语法错误') >= 0) {
      return {
        text: '经过检查，发现以下问题：<br><br>' +
          '<b>1. 语法错误</b>：第3行 <code>FORM</code> 应为 <code>FROM</code><br>' +
          '<b>2. 字段拼写</b>：第5行 <code>prodcut_id</code> 应为 <code>product_id</code><br>' +
          '<b>3. 缺少分号</b>：SQL末尾缺少结束分号<br>' +
          '<b>4. 别名冲突</b>：第7行 <code>count</code> 是保留字，建议改为 <code>total_count</code><br><br>' +
          '修正后的SQL：' +
          _codeBlock(
            'SELECT\n' +
            '    product_id,\n' +
            '    product_name,\n' +
            '    SUM(quantity) AS total_count,\n' +
            '    SUM(amount) AS total_amount\n' +
            'FROM\n' +
            '    order_detail\n' +
            'WHERE\n' +
            '    order_date >= \'2025-01-01\'\n' +
            'GROUP BY\n' +
            '    product_id, product_name;'
          ),
        links: null
      };
    }
    if (q.indexOf('代码测试') >= 0 || q.indexOf('测试用例') >= 0) {
      return {
        text: '根据当前SQL逻辑，生成以下测试用例：<br><br>' +
          '<b>测试用例 1 - 正常场景</b><br>' +
          '输入：order_detail 表含 5 条记录，日期在 2025-01-01 ~ 2025-03-31<br>' +
          '预期：返回按 product_id 分组的汇总数据，total_count 和 total_amount 正确<br><br>' +
          '<b>测试用例 2 - 边界条件</b><br>' +
          '输入：order_detail 表为空<br>' +
          '预期：返回空结果集，无异常<br><br>' +
          '<b>测试用例 3 - NULL值处理</b><br>' +
          '输入：quantity 字段包含 NULL 值<br>' +
          '预期：SUM 自动跳过 NULL，结果不包含 NULL<br><br>' +
          '<b>测试用例 4 - 大数据量</b><br>' +
          '输入：100万条记录<br>' +
          '预期：查询在 10 秒内返回结果，无超时<br><br>' +
          '验证SQL：' +
          _codeBlock(
            '-- 用例1: 验证汇总结果\n' +
            'SELECT COUNT(*) AS group_count\n' +
            'FROM (\n' +
            '    SELECT product_id\n' +
            '    FROM order_detail\n' +
            '    WHERE order_date >= \'2025-01-01\'\n' +
            '    GROUP BY product_id\n' +
            ') t;\n\n' +
            '-- 用例2: 验证空表\n' +
            'SELECT COUNT(*) FROM order_detail\n' +
            'WHERE 1 = 0;'
          ),
        links: null
      };
    }
    if (q.indexOf('代码问答') >= 0 || q.indexOf('执行逻辑') >= 0 || q.indexOf('性能风险') >= 0) {
      return {
        text: '<b>执行逻辑分析：</b><br><br>' +
          '1. <b>FROM</b> 阶段：扫描 order_detail 全表数据<br>' +
          '2. <b>WHERE</b> 阶段：过滤 order_date >= \'2025-01-01\' 的记录<br>' +
          '3. <b>GROUP BY</b> 阶段：按 product_id, product_name 分组<br>' +
          '4. <b>SELECT</b> 阶段：计算 SUM(quantity) 和 SUM(amount)<br>' +
          '5. <b>ORDER BY</b> 阶段：按 total_amount 降序排列<br><br>' +
          '<b>性能风险评估：</b><br><br>' +
          '⚠️ <b>全表扫描风险</b>：order_date 字段如果没有索引，WHERE 条件将触发全表扫描<br>' +
          '⚠️ <b>分组开销</b>：GROUP BY 两个字段，如果 product_id 基数很大，排序和分组内存消耗较高<br>' +
          '✅ <b>建议优化</b>：<br>' +
          '&nbsp;&nbsp;- 为 order_date 字段添加索引<br>' +
          '&nbsp;&nbsp;- 如果是分区表，利用分区裁剪减少扫描量<br>' +
          '&nbsp;&nbsp;- 考虑使用物化视图缓存高频查询结果',
        links: null
      };
    }
    return {
      text: '感谢您的提问。根据数据中台的知识库分析，关于「' + _escapeHtml(q) + '」的相关信息如下：<br><br>' +
        '该问题涉及多个数据模块的关联，建议您：<br>' +
        '1. 在「数据资产 - 元数据搜索」中搜索相关表和字段<br>' +
        '2. 通过「数据地图」查看数据血缘关系<br>' +
        '3. 在「数据服务」模块查看可用的 API 接口<br><br>' +
        '如需更精确的回答，请提供更多上下文信息。',
      links: null
    };
  }

  function _escapeHtml(str) {
    var d = document.createElement('div');
    d.appendChild(document.createTextNode(str));
    return d.innerHTML;
  }

  function _now() {
    var d = new Date();
    var pad = function (n) { return n < 10 ? '0' + n : n; };
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + ' ' +
           pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
  }

  _syncWelcomeView();

  DP.openAiAndAsk = function (question) {
    if (!panel) return;
    panel.classList.remove('ai-minimized');
    if (minDock) minDock.classList.remove('show');
    panel.classList.add('open');
    btn.classList.add('active');
    if (!_isMax) overlay.classList.add('show');
    if (question) {
      if (_isGenerating) {
        _stopGeneration();
      }
      input.value = question;
      input.disabled = false;
      setTimeout(function () {
        _send();
        setTimeout(function () {
          if (chatArea) chatArea.scrollTop = chatArea.scrollHeight;
        }, 300);
      }, 200);
    }
  };
};
