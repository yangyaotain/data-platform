/**
 * 数据开发公共画布。
 * 数据开发页复用 shell() 生成编辑画布外壳；其他页面使用 readOnly() + mountAll()
 * 复用同一套网格、节点、连线、搜索与缩放交互。
 */
window.DP = window.DP || {};

DP.developmentCanvas = (function () {
  'use strict';

  var sequence = 0;
  var iconMap = {
    table: 'bi-table', database: 'bi-database', code: 'bi-code-slash', process: 'bi-diagram-3',
    report: 'bi-file-earmark-bar-graph', chart: 'bi-bar-chart', quality: 'bi-shield-check',
    ftp: 'bi-folder-symlink', http: 'bi-globe2', package: 'bi-box-seam', default: 'bi-gear'
  };

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (char) {
      return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[char];
    });
  }

  function searchHtml(options) {
    if (options.search === false) return '';
    var count = options.searchCount || ('0/' + (options.nodeCount || 0));
    return '<div class="dd-canvas-search development-canvas-search"><div class="dd-search-mini"><span>关键词搜索</span><input type="text" placeholder="" data-development-canvas-search aria-label="画布节点关键词搜索"><span data-development-canvas-search-count>' + esc(count) + '</span><div class="dd-search-nav"><button type="button" data-development-canvas-search-nav="prev" title="上一个匹配节点"><i class="bi bi-chevron-up"></i></button><button type="button" data-development-canvas-search-nav="next" title="下一个匹配节点"><i class="bi bi-chevron-down"></i></button></div></div></div>';
  }

  function zoomHtml(options) {
    var legacy = options.controlPrefix === 'dd';
    function attr(action) { return legacy ? 'data-dd-zoom="' + action + '"' : 'data-development-canvas-zoom="' + action + '"'; }
    var labelAttr = legacy ? 'data-dd-zoom-label' : 'data-development-canvas-zoom-label';
    return '<div class="dd-canvas-zoom" aria-label="画布缩放工具栏"><button type="button" ' + attr('out') + ' title="缩小画布"><i class="bi bi-dash-lg"></i><span>缩小</span></button><button type="button" class="dd-canvas-zoom-value" ' + attr('reset') + ' title="恢复 100%"><i class="bi bi-aspect-ratio"></i><span ' + labelAttr + '>100%</span></button><button type="button" ' + attr('in') + ' title="放大画布"><i class="bi bi-plus-lg"></i><span>放大</span></button><button type="button" ' + attr('fit') + ' title="适应当前画布"><i class="bi bi-arrows-fullscreen"></i><span>适应</span></button></div>';
  }

  function shell(options) {
    options = options || {};
    var id = options.id || ('developmentCanvas' + (++sequence));
    var managedAttrs = options.managed === false ? '' : ' data-development-canvas data-world-width="' + Number(options.worldWidth || 1200) + '" data-world-height="' + Number(options.worldHeight || 520) + '" data-initial-scale="' + esc(options.initialScale || 'fit') + '"';
    return '<div class="dd-canvas-panel development-canvas-panel ' + esc(options.panelClass || '') + '" data-development-canvas-shell>' + searchHtml(options) + '<div class="dd-canvas development-canvas" id="' + esc(id) + '" aria-label="' + esc(options.label || '数据开发画布') + '"' + managedAttrs + '>' + (options.content || '') + '</div>' + zoomHtml(options) + '</div>';
  }

  function nodeSize(node) {
    return { width:Number(node.width || (node.type === 'task' ? 190 : 116)), height:Number(node.height || 44) };
  }

  function nodeHtml(node) {
    var size = nodeSize(node);
    var style = 'left:' + Number(node.x || 0) + 'px;top:' + Number(node.y || 0) + 'px;';
    var inner, before = node.schedule ? '<span class="development-canvas-node-schedule">定时调度: ' + esc(node.schedule) + '</span>' : '';
    var after = node.status ? '<span class="development-canvas-node-status ' + esc(node.statusTone || '') + '"><i class="bi bi-' + esc(node.statusIcon || 'check-circle-fill') + '"></i>' + esc(node.status) + '</span>' : '';
    if (node.type === 'start') {
      inner = '<div class="dd-node-start" style="width:' + size.width + 'px"><span class="dd-node-dot"><i class="bi bi-play-fill"></i></span><span>' + esc(node.label) + '</span>' + (node._hasOutgoing ? '<span class="dd-node-port"></span>' : '') + '</div>';
    } else if (node.type === 'end') {
      inner = '<div class="dd-node-end" style="width:' + size.width + 'px">' + (node._hasIncoming ? '<span class="dd-node-port"></span>' : '') + '<span class="dd-node-dot"><i class="bi bi-stop-fill"></i></span><span>' + esc(node.label) + '</span></div>';
    } else {
      var icon = iconMap[node.icon] || iconMap.default;
      var checkbox = node.selectable ? '<input class="development-canvas-node-check" type="checkbox" data-development-node-select="' + esc(node.id) + '" aria-label="选择' + esc(node.label) + '"' + (node.checked ? ' checked' : '') + '>' : '';
      var record = node.recordable ? '<button class="development-canvas-node-record" type="button" data-development-node-record="' + esc(node.id) + '" aria-label="查看' + esc(node.label) + '执行记录" title="执行记录"><i class="bi bi-file-earmark-text-fill"></i></button>' : '';
      inner = '<div class="dd-node-task" style="width:' + size.width + 'px">' + (node._hasIncoming ? '<span class="dd-node-port"></span>' : '') + checkbox + '<span class="dd-node-icon"><i class="bi ' + icon + '"></i></span><span class="dd-node-text" title="' + esc(node.label) + '">' + esc(node.label) + '</span>' + record + (node._hasOutgoing ? '<span class="dd-node-port"></span>' : '') + '</div>';
    }
    return '<div class="dd-node development-canvas-node" id="' + esc(node.domId) + '" data-development-node-id="' + esc(node.id) + '" data-development-node-label="' + esc(node.label) + '" style="' + style + '">' + before + inner + after + '</div>';
  }

  function edgePath(from, to) {
    var fromSize = nodeSize(from), toSize = nodeSize(to);
    var x1 = Number(from.x || 0) + fromSize.width, y1 = Number(from.y || 0) + fromSize.height / 2;
    var x2 = Number(to.x || 0), y2 = Number(to.y || 0) + toSize.height / 2;
    var bend = Math.max(46, Math.abs(x2 - x1) * .45);
    return 'M' + x1 + ',' + y1 + ' C' + (x1 + bend) + ',' + y1 + ' ' + (x2 - bend) + ',' + y2 + ' ' + x2 + ',' + y2;
  }

  function readOnly(options) {
    options = options || {};
    var id = options.id || ('developmentCanvas' + (++sequence));
    var markerId = id + 'Arrow';
    var nodes = options.nodes || [], edges = options.edges || [];
    var nodeMap = {};
    nodes.forEach(function (node) { node.domId = id + 'Node_' + node.id; node._hasIncoming = false; node._hasOutgoing = false; nodeMap[node.id] = node; });
    edges.forEach(function (edge) {
      if (nodeMap[edge.from] && nodeMap[edge.to]) {
        nodeMap[edge.from]._hasOutgoing = true;
        nodeMap[edge.to]._hasIncoming = true;
      }
    });
    var svg = '<svg class="dd-connections" aria-hidden="true"><defs><marker id="' + esc(markerId) + '" markerWidth="8" markerHeight="8" markerUnits="userSpaceOnUse" refX="7" refY="4" orient="auto"><path d="M0,1 L7,4 L0,7 Z"></path></marker></defs>' + edges.map(function (edge) { var from=nodeMap[edge.from], to=nodeMap[edge.to]; return from && to ? '<path d="' + edgePath(from,to) + '" marker-end="url(#' + esc(markerId) + ')"></path>' : ''; }).join('') + '</svg>';
    var content = '<div class="dd-canvas-stage"><div class="dd-canvas-world development-canvas-world" style="width:' + Number(options.worldWidth || 1200) + 'px;height:' + Number(options.worldHeight || 520) + 'px">' + svg + nodes.map(nodeHtml).join('') + '</div></div>';
    return shell({ id:id, label:options.label, panelClass:(options.panelClass || '') + ' development-canvas-readonly', managed:true, worldWidth:options.worldWidth, worldHeight:options.worldHeight, initialScale:options.initialScale || 'fit', nodeCount:nodes.length, content:content });
  }

  function mount(canvas) {
    if (!canvas || canvas._developmentCanvasCleanup) return;
    var shellEl = canvas.closest('[data-development-canvas-shell]');
    var stage = canvas.querySelector('.dd-canvas-stage');
    var world = canvas.querySelector('.dd-canvas-world');
    if (!shellEl || !stage || !world) return;
    var state = { scale:1, worldWidth:Number(canvas.dataset.worldWidth || 1200), worldHeight:Number(canvas.dataset.worldHeight || 520), padding:24, initialized:false, searchIndex:-1, worldLeft:24, worldTop:24, fitMode:canvas.dataset.initialScale==='fit', resizeFrame:0, clientWidth:-1, clientHeight:-1 };
    if(state.fitMode)canvas.style.overflow='hidden';

    function update(keepScroll) {
      var scaledWidth = state.worldWidth * state.scale, scaledHeight = state.worldHeight * state.scale;
      var stageWidth = Math.max(canvas.clientWidth, scaledWidth + state.padding * 2);
      var stageHeight = Math.max(canvas.clientHeight, scaledHeight + state.padding * 2);
      state.worldLeft = Math.max(state.padding,(stageWidth-scaledWidth)/2);
      state.worldTop = Math.max(state.padding,(stageHeight-scaledHeight)/2);
      stage.style.width = stageWidth + 'px';
      stage.style.height = stageHeight + 'px';
      world.style.left = state.worldLeft + 'px';
      world.style.top = state.worldTop + 'px';
      world.style.transform = 'scale(' + state.scale + ')';
      canvas.style.overflow = state.fitMode ? 'hidden' : 'auto';
      canvas.style.setProperty('--dd-grid-scale',state.scale);
      var label = shellEl.querySelector('[data-development-canvas-zoom-label]');
      if (label) label.textContent = Math.round(state.scale*100) + '%';
      shellEl.querySelectorAll('[data-development-canvas-zoom="out"]').forEach(function (button) { button.disabled = state.scale <= .5; });
      shellEl.querySelectorAll('[data-development-canvas-zoom="in"]').forEach(function (button) { button.disabled = state.scale >= 1.6; });
      if (!state.initialized || keepScroll === false) {
        state.initialized=true;
        canvas.scrollLeft=Math.max(0,(stageWidth-canvas.clientWidth)/2);
        canvas.scrollTop=Math.max(0,(stageHeight-canvas.clientHeight)/2);
      }
    }
    function setScale(next, keepCenter, fitMode) {
      var old=state.scale, centerX=(canvas.scrollLeft+canvas.clientWidth/2-state.worldLeft)/old, centerY=(canvas.scrollTop+canvas.clientHeight/2-state.worldTop)/old;
      if(typeof fitMode==='boolean')state.fitMode=fitMode;
      state.scale=Math.max(.5,Math.min(1.6,Math.round(next*100)/100)); update(true);
      if (keepCenter !== false) { canvas.scrollLeft=state.worldLeft+centerX*state.scale-canvas.clientWidth/2; canvas.scrollTop=state.worldTop+centerY*state.scale-canvas.clientHeight/2; }
    }
    function fit() { var fitScale=Math.min(1,(canvas.clientWidth-state.padding*2)/state.worldWidth,(canvas.clientHeight-state.padding*2)/state.worldHeight); setScale(Math.floor(fitScale*100)/100,false,true); }
    function onZoom(event) { var button=event.target.closest('[data-development-canvas-zoom]'); if (!button || button.disabled) return; var action=button.dataset.developmentCanvasZoom; if (action==='out') setScale(state.scale-.1,true,false); if (action==='in') setScale(state.scale+.1,true,false); if (action==='reset') setScale(1,true,false); if (action==='fit') fit(); }
    function onWheel(event) { if (!event.ctrlKey) return; event.preventDefault(); setScale(state.scale+(event.deltaY<0?.1:-.1),true,false); }
    function onMouseDown(event) {
      if (event.button!==2 || event.target.closest('.dd-node')) return;
      event.preventDefault(); var startX=event.clientX,startY=event.clientY,left=canvas.scrollLeft,top=canvas.scrollTop; canvas.classList.add('is-panning');
      function move(moveEvent) { canvas.scrollLeft=left-(moveEvent.clientX-startX); canvas.scrollTop=top-(moveEvent.clientY-startY); }
      function up() { canvas.classList.remove('is-panning'); document.removeEventListener('mousemove',move); document.removeEventListener('mouseup',up); }
      document.addEventListener('mousemove',move); document.addEventListener('mouseup',up);
    }
    function matches() { var input=shellEl.querySelector('[data-development-canvas-search]'), key=(input?input.value:'').trim().toLowerCase(); var nodes=Array.prototype.slice.call(canvas.querySelectorAll('[data-development-node-label]')); nodes.forEach(function (node) { node.classList.remove('is-search-match','is-search-current'); }); var list=key?nodes.filter(function(node){return (node.dataset.developmentNodeLabel||'').toLowerCase().indexOf(key)>=0;}):[]; if (state.searchIndex>=list.length) state.searchIndex=list.length-1; list.forEach(function(node){node.classList.add('is-search-match');}); if (list[state.searchIndex]) list[state.searchIndex].classList.add('is-search-current'); var count=shellEl.querySelector('[data-development-canvas-search-count]'); if(count) count.textContent=(list.length?(state.searchIndex+1):0)+'/'+list.length; return list; }
    function onSearch() { state.searchIndex=-1; matches(); }
    function onSearchNav(event) { var button=event.target.closest('[data-development-canvas-search-nav]'); if(!button)return; var list=matches(); if(!list.length)return; state.searchIndex=(state.searchIndex+(button.dataset.developmentCanvasSearchNav==='prev'?-1:1)+list.length)%list.length; matches(); }
    function onNodeClick(event) { var node=event.target.closest('.dd-node'); if(!node)return; canvas.querySelectorAll('.dd-node.selected').forEach(function(item){item.classList.remove('selected');}); node.classList.add('selected'); }
    var zoom=shellEl.querySelector('.dd-canvas-zoom'), search=shellEl.querySelector('[data-development-canvas-search]'), searchNav=shellEl.querySelector('.dd-search-nav');
    if(zoom) zoom.addEventListener('click',onZoom); if(search) search.addEventListener('input',onSearch); if(searchNav) searchNav.addEventListener('click',onSearchNav);
    canvas.addEventListener('wheel',onWheel,{passive:false}); canvas.addEventListener('mousedown',onMouseDown); canvas.addEventListener('click',onNodeClick); canvas.addEventListener('contextmenu',function(event){if(!event.target.closest('.dd-node'))event.preventDefault();});
    function onResize() {
      if(state.resizeFrame)cancelAnimationFrame(state.resizeFrame);
      state.resizeFrame=requestAnimationFrame(function(){
        state.resizeFrame=0;
        var width=canvas.clientWidth,height=canvas.clientHeight;
        if(width===state.clientWidth && height===state.clientHeight)return;
        state.clientWidth=width; state.clientHeight=height;
        if(state.fitMode)fit(); else update(true);
      });
    }
    var observer=window.ResizeObserver?new ResizeObserver(onResize):null; if(observer)observer.observe(canvas);
    requestAnimationFrame(function(){ if(canvas.dataset.initialScale==='fit')fit(); else update(false); });
    canvas._developmentCanvasCleanup=function(){if(observer)observer.disconnect(); if(state.resizeFrame)cancelAnimationFrame(state.resizeFrame); if(zoom)zoom.removeEventListener('click',onZoom); if(search)search.removeEventListener('input',onSearch); if(searchNav)searchNav.removeEventListener('click',onSearchNav); canvas.removeEventListener('wheel',onWheel); canvas.removeEventListener('mousedown',onMouseDown); canvas.removeEventListener('click',onNodeClick); delete canvas._developmentCanvasCleanup;};
  }

  function mountAll(root) { (root || document).querySelectorAll('[data-development-canvas]').forEach(mount); }
  function destroyAll(root) { (root || document).querySelectorAll('[data-development-canvas]').forEach(function(canvas){if(canvas._developmentCanvasCleanup)canvas._developmentCanvasCleanup();}); }

  return { shell:shell, readOnly:readOnly, mountAll:mountAll, destroyAll:destroyAll };
}());
