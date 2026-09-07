/** 公共日期组件：单日历 / 双日历，完成选择后只发送一次 change。 */
window.DP = window.DP || {};
DP.datePicker = (function () {
  'use strict';
  var active = null;
  var sequence = 0;
  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function pad(value) { return String(value).padStart(2, '0'); }
  function date(year, month, day) {
    var result = new Date(0);
    result.setUTCHours(0, 0, 0, 0);
    result.setUTCFullYear(year, month, day);
    return result;
  }
  function format(value) { return String(value.getUTCFullYear()).padStart(4, '0') + '-' + pad(value.getUTCMonth() + 1) + '-' + pad(value.getUTCDate()); }
  function parse(value) {
    var parts = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value || '');
    if (!parts || Number(parts[1]) < 1) return null;
    var result = date(Number(parts[1]), Number(parts[2]) - 1, Number(parts[3]));
    return format(result) === value ? result : null;
  }
  function dayOf(value) { var day = String(value || '').slice(0, 10); return parse(day) ? day : ''; }
  function today() { var now = new Date(); return now.getFullYear() + '-' + pad(now.getMonth() + 1) + '-' + pad(now.getDate()); }
  function attrs(values) { return Object.keys(values || {}).map(function (key) { return ' ' + key + '="' + esc(values[key]) + '"'; }).join(''); }
  function hidden(part, value, attributes) { return '<input type="hidden" data-dp-date-value="' + part + '" value="' + esc(value) + '"' + attrs(attributes) + '>'; }
  function read(element, part) { var input = element.querySelector('[data-dp-date-value="' + part + '"]'); return input ? input.value : ''; }
  function caption(element) {
    var start = dayOf(read(element, 'start'));
    var end = dayOf(read(element, 'end'));
    return element.dataset.dpDateMode === 'range' ? (start || '开始日期') + ' 至 ' + (end || '结束日期') : start || element.dataset.dpDatePlaceholder;
  }
  function render(options) {
    var range = options.mode === 'range';
    var start = options.start || options.value || '';
    var end = options.end || '';
    if (options.combinedAttrs && options.value) {
      var parts = options.value.match(/\d{4}-\d{2}-\d{2}(?:[ T]\d{2}:\d{2}:\d{2})?/g) || [];
      start = parts[0] || ''; end = parts[1] || '';
    }
    var label = options.label || (range ? '日期范围' : '选择日期');
    var placeholder = options.placeholder || '选择日期';
    var hasValue = !!dayOf(start) || !!dayOf(end);
    var text = range ? (dayOf(start) || '开始日期') + ' 至 ' + (dayOf(end) || '结束日期') : dayOf(start) || placeholder;
    var time = /[ T](\d{2}:\d{2}:\d{2})/.exec(start);
    return '<span class="dp-date-picker' + (range ? ' is-range' : '') + (options.withTime ? ' with-time' : '') + (hasValue ? ' has-value' : '') + '" data-dp-date-picker data-dp-date-mode="' + (range ? 'range' : 'single') + '" data-dp-date-output="' + (options.output === 'datetime' ? 'datetime' : 'date') + '" data-dp-date-label="' + esc(label) + '" data-dp-date-placeholder="' + esc(placeholder) + '" data-dp-date-id="dp-date-' + (++sequence) + '">' +
      hidden('start', start, options.startAttrs || options.valueAttrs) + (range ? hidden('end', end, options.endAttrs) : '') +
      (options.combinedAttrs ? hidden('combined', options.value || '', options.combinedAttrs) : '') +
      '<button type="button" class="dp-date-trigger" data-dp-date-action="open" aria-haspopup="dialog" aria-expanded="false" aria-label="' + esc(label + '：' + text) + '" title="' + esc(text) + '"><i class="bi bi-calendar3" aria-hidden="true"></i><span data-dp-date-caption>' + esc(text) + '</span></button>' +
      (options.withTime ? '<input class="dp-date-time" type="time" step="1" data-dp-date-time value="' + (time ? time[1] : '00:00:00') + '" aria-label="' + esc(label + '时分秒') + '">' : '') +
      '<button type="button" class="dp-date-clear" data-dp-date-action="clear" aria-label="清除' + esc(label) + '" title="清除' + esc(label) + '"' + (hasValue ? '' : ' hidden') + '><i class="bi bi-x-circle" aria-hidden="true"></i><span>清除</span></button></span>';
  }
  function sync(element) {
    var text = caption(element);
    var trigger = element.querySelector('[data-dp-date-action="open"]');
    element.querySelector('[data-dp-date-caption]').textContent = text;
    trigger.title = text;
    trigger.setAttribute('aria-label', element.dataset.dpDateLabel + '：' + text);
    var hasValue = !!read(element, 'start') || !!read(element, 'end');
    element.classList.toggle('has-value', hasValue);
    element.querySelector('[data-dp-date-action="clear"]').hidden = !hasValue;
  }
  function close(restoreFocus) {
    if (!active) return;
    var previous = active;
    active = null;
    previous.observer.disconnect();
    previous.panel.remove();
    previous.trigger.setAttribute('aria-expanded', 'false');
    previous.trigger.removeAttribute('aria-controls');
    if (restoreFocus && previous.trigger.isConnected) previous.trigger.focus();
  }
  function commit(element, start, end) {
    var range = element.dataset.dpDateMode === 'range';
    var time = element.querySelector('[data-dp-date-time]');
    var timeValue = time && time.value ? time.value + (time.value.length === 5 ? ':00' : '') : '00:00:00';
    if (element.dataset.dpDateOutput === 'datetime') {
      start = start ? start + ' ' + (range ? '00:00:00' : timeValue) : '';
      end = end ? end + ' 23:59:59' : '';
    }
    element.querySelector('[data-dp-date-value="start"]').value = start;
    if (range) element.querySelector('[data-dp-date-value="end"]').value = end;
    var combined = element.querySelector('[data-dp-date-value="combined"]');
    if (combined) combined.value = start && end ? start + ' - ' + end : '';
    close(true);
    sync(element);
    element.querySelector('[data-dp-date-action="open"]').focus();
    // 先更新完整范围，再通知页面，避免页面在第一项变化时重绘或发起半区间查询。
    var input = combined || element.querySelector('[data-dp-date-value="' + (range ? 'end' : 'start') + '"]');
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }
  function nav(action, icon, label, delta) {
    return '<button type="button" class="dp-date-nav" data-dp-date-action="' + action + '" data-delta="' + delta + '" aria-label="' + label + '"><i class="bi bi-' + icon + '" aria-hidden="true"></i><span>' + label + '</span></button>';
  }
  function monthHtml(month) {
    var year = month.getUTCFullYear(), number = month.getUTCMonth();
    var html = '<section class="dp-date-month" aria-label="' + year + '年' + (number + 1) + '月"><div class="dp-date-month-title">' + year + '年 ' + (number + 1) + '月</div><div class="dp-date-week">' + ['日', '一', '二', '三', '四', '五', '六'].map(function (day) { return '<span>' + day + '</span>'; }).join('') + '</div><div class="dp-date-grid">';
    var current = today();
    for (var i = 0; i < 42; i++) {
      var value = date(year, number, 1 - month.getUTCDay() + i);
      var key = format(value), disabled = value.getUTCFullYear() < 1 || value.getUTCFullYear() > 9999;
      html += '<button type="button" class="dp-date-day' + (value.getUTCMonth() !== number ? ' is-muted' : '') + (key === current ? ' is-today' : '') + '" data-dp-date-action="day" data-day="' + key + '" data-outside="' + (value.getUTCMonth() !== number) + '" aria-label="' + key + '"' + (disabled ? ' disabled' : '') + '>' + value.getUTCDate() + '</button>';
    }
    return html + '</div></section>';
  }
  function paintRange() {
    if (!active) return;
    var start = active.start, end = active.end || active.hover;
    if (start && end && end < start) { var tmp = start; start = end; end = tmp; }
    active.panel.querySelectorAll('[data-day]').forEach(function (button) {
      var day = button.dataset.day;
      var endpoint = day === start || day === end;
      button.classList.toggle('is-selected', endpoint);
      button.classList.toggle('is-range-start', day === start);
      button.classList.toggle('is-range-end', day === end);
      button.classList.toggle('is-in-range', !!(start && end && day > start && day < end));
      button.setAttribute('aria-pressed', String(endpoint));
    });
  }
  function position() {
    if (!active) return;
    if (!active.element.isConnected) { close(false); return; }
    var rect = active.element.getBoundingClientRect();
    var panel = active.panel, box = panel.getBoundingClientRect();
    var left = Math.max(8, Math.min(rect.left, window.innerWidth - box.width - 8));
    var top = rect.bottom + 6;
    if (top + box.height > window.innerHeight - 8) top = Math.max(8, rect.top - box.height - 6);
    panel.style.left = left + 'px'; panel.style.top = top + 'px';
  }
  function draw(focusDay) {
    var month = active.month;
    var range = active.element.dataset.dpDateMode === 'range';
    var hint = range ? (active.pickingEnd ? '请选择结束日期' : '请选择开始日期') : '点击日期即可选择';
    active.panel.innerHTML = '<div class="dp-date-nav-row"><div>' + nav('month', 'chevron-double-left', '上年', -12) + nav('month', 'chevron-left', '上月', -1) + '</div><span class="dp-date-instruction" role="status">' + hint + '</span><div>' + nav('month', 'chevron-right', '下月', 1) + nav('month', 'chevron-double-right', '下年', 12) + '</div></div><div class="dp-date-months">' + monthHtml(month) + (range ? monthHtml(date(month.getUTCFullYear(), month.getUTCMonth() + 1, 1)) : '') + '</div>';
    paintRange(); position();
    var day = focusDay || active.start || format(active.month);
    var target = active.panel.querySelector('[data-day="' + day + '"][data-outside="false"]') || active.panel.querySelector('[data-outside="false"]');
    active.panel.querySelectorAll('[data-day]').forEach(function (button) { button.tabIndex = button === target ? 0 : -1; });
    if (focusDay && target) target.focus();
  }
  function open(element) {
    if (active && active.element === element) { close(true); return; }
    close(false);
    var start = dayOf(read(element, 'start')), end = dayOf(read(element, 'end'));
    var base = parse(start || end || today());
    var panel = document.createElement('div');
    panel.className = 'dp-date-popover' + (element.dataset.dpDateMode === 'range' ? ' is-range' : '');
    panel.id = element.dataset.dpDateId + '-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', element.dataset.dpDateLabel);
    document.body.appendChild(panel);
    var trigger = element.querySelector('[data-dp-date-action="open"]');
    trigger.setAttribute('aria-expanded', 'true'); trigger.setAttribute('aria-controls', panel.id);
    active = { element: element, trigger: trigger, panel: panel, month: date(base.getUTCFullYear(), base.getUTCMonth(), 1), start: start, end: end, pickingEnd: false, hover: '', observer: new MutationObserver(function () { if (active && !active.element.isConnected) close(false); }) };
    active.observer.observe(document.body, { childList: true, subtree: true });
    draw(start || today());
  }
  function pick(day) {
    if (!active || !parse(day)) return;
    if (active.element.dataset.dpDateMode !== 'range') { commit(active.element, day, ''); return; }
    if (!active.pickingEnd) {
      active.start = day; active.end = ''; active.hover = ''; active.pickingEnd = true; draw(day);
    } else {
      commit(active.element, day < active.start ? day : active.start, day < active.start ? active.start : day);
    }
  }
  document.addEventListener('click', function (event) {
    var button = event.target.closest('[data-dp-date-action]');
    var element = event.target.closest('[data-dp-date-picker]');
    if (!button) { if (active && !active.panel.contains(event.target) && !active.element.contains(event.target)) close(false); return; }
    event.preventDefault(); event.stopPropagation();
    var action = button.dataset.dpDateAction;
    if (action === 'open') open(element);
    else if (action === 'clear') commit(element, '', '');
    else if (active && action === 'day') pick(button.dataset.day);
    else if (active && action === 'month') {
      var next = date(active.month.getUTCFullYear(), active.month.getUTCMonth() + Number(button.dataset.delta), 1);
      if (next.getUTCFullYear() < 1 || next.getUTCFullYear() > 9999 || (active.element.dataset.dpDateMode === 'range' && next.getUTCFullYear() === 9999 && next.getUTCMonth() === 11)) return;
      active.month = next; draw();
      active.panel.querySelector('[data-delta="' + button.dataset.delta + '"]').focus();
    }
  }, true);
  document.addEventListener('mouseover', function (event) {
    if (!active || !active.pickingEnd) return;
    var day = event.target.closest('[data-day]');
    active.hover = day && active.panel.contains(day) ? day.dataset.day : ''; paintRange();
  });
  document.addEventListener('change', function (event) {
    if (!event.target.matches('[data-dp-date-time]')) return;
    event.stopPropagation();
    var element = event.target.closest('[data-dp-date-picker]');
    var selected = dayOf(read(element, 'start'));
    if (selected && event.target.value && event.target.validity.valid) commit(element, selected, '');
  }, true);
  document.addEventListener('focusin', function (event) {
    if (active && !active.panel.contains(event.target) && !active.element.contains(event.target)) close(false);
  });
  document.addEventListener('keydown', function (event) {
    if (!active) return;
    if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); close(true); return; }
    var button = event.target.closest('[data-day]');
    if (!button || !active.panel.contains(button)) return;
    var moves = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
    if (moves[event.key]) {
      event.preventDefault();
      var next = parse(button.dataset.day); next.setUTCDate(next.getUTCDate() + moves[event.key]);
      if (next.getUTCFullYear() < 1 || next.getUTCFullYear() > 9999) return;
      var day = format(next);
      if (!active.panel.querySelector('[data-day="' + day + '"][data-outside="false"]')) active.month = date(next.getUTCFullYear(), next.getUTCMonth(), 1);
      if (active.pickingEnd) active.hover = day;
      draw(day);
    }
  }, true);
  window.addEventListener('resize', position);
  document.addEventListener('scroll', position, true);
  return { render: render, close: function () { close(false); }, parse: parse, format: format };
}());
