/**
 * 数据中台 V4.0 - 数据资产 / 元数据管理 / 元数据监控
 */
window.DP = window.DP || {};
DP.pages = DP.pages || {};

DP.pages.metadataMonitor = (function () {
  var state = {
    pageSize: 5,
    page: 1,
    filters: {
      item: '变更项',
      type: '类型',
      attr: '变更属性'
    }
  };

  var records = [
    row(1, 'HDFS', '数据源', '中电数治演示/HDFS', '新增', '【新增】HDFS', '2026-06-15 09:56:17'),
    row(2, 'C##AT_LOGMINER', '数据源', '中电数治演示/oracle数据源', '新增', '【新增】C##AT_LOGMINER', '2026-05-29 14:39:33'),
    row(3, 'zz_tms_ads.ods_ods_user_address.city_id', '数据源', '中电数治演示/hive链接', '新增', '【新增】zz_tms_ads.ods_ods_user_address...', '2026-05-29 14:32:04'),
    row(4, 'zz_tms_ads.ods_ods_user_address.is_default', '数据源', '中电数治演示/hive链接', '新增', '【新增】zz_tms_ads.ods_ods_user_address...', '2026-05-29 14:32:04'),
    row(5, 'zz_tms_ads.ods_ods_user_address.id', '数据源', '中电数治演示/hive链接', '新增', '【新增】zz_tms_ads.ods_ods_user_address...', '2026-05-29 14:32:04')
  ];

  var sourceTree = [
    {
      label: '中电数治演示', value: '中电数治演示', icon: 'bi-stack', iconClass: 'stack', open: true, children: [
        { label: 'HDFS', value: '中电数治演示/HDFS', icon: 'bi-cloud-fill', iconClass: 'hdfs' },
        { label: 'oracle数据源', value: '中电数治演示/oracle数据源', icon: 'bi-database-fill', iconClass: 'oracle' },
        { label: 'hive链接', value: '中电数治演示/hive链接', icon: 'bi-plugin', iconClass: 'hive' },
        {
          label: '中电数智演示数仓库', value: '中电数治演示/中电数智演示数仓库', icon: 'bi-box-seam-fill', iconClass: 'warehouse', open: true, children: [
            {
              label: '中电数智演示数仓库', value: '中电数治演示/中电数智演示数仓库/中电数智演示数仓库', icon: 'bi-diagram-3-fill', iconClass: 'db', open: true, children: [
                { label: 'zz_tms_ads', value: '中电数治演示/中电数智演示数仓库/zz_tms_ads', icon: 'bi-key-fill', iconClass: 'table' },
                { label: 'zz_tms_dim', value: '中电数治演示/中电数智演示数仓库/zz_tms_dim', icon: 'bi-key-fill', iconClass: 'table' },
                { label: 'zz_tms_dwd', value: '中电数治演示/中电数智演示数仓库/zz_tms_dwd', icon: 'bi-key-fill', iconClass: 'table' },
                { label: 'zz_tms_dws', value: '中电数治演示/中电数智演示数仓库/zz_tms_dws', icon: 'bi-key-fill', iconClass: 'table' },
                { label: 'zz_tms_ods', value: '中电数治演示/中电数智演示数仓库/zz_tms_ods', icon: 'bi-key-fill', iconClass: 'table' }
              ]
            }
          ]
        }
      ]
    },
    {
      label: '业务系统', value: '业务系统', icon: 'bi-stack', iconClass: 'stack', open: true, children: [
        { label: '仿真数据', value: '业务系统/仿真数据', icon: 'bi-folder-fill', iconClass: 'folder' },
        {
          label: '物流系统', value: '业务系统/物流系统', icon: 'bi-box-seam-fill', iconClass: 'warehouse', open: true, children: [
            {
              label: '物流系统', value: '业务系统/物流系统/物流系统', icon: 'bi-diagram-3-fill', iconClass: 'db', open: true, children: [
                { label: 'iptv', value: '业务系统/物流系统/iptv', icon: 'bi-folder-fill', iconClass: 'folder' }
              ]
            }
          ]
        },
        {
          label: '工单系统', value: '业务系统/工单系统', icon: 'bi-box-seam-fill', iconClass: 'warehouse', children: [
            { label: 'aierp_pro_test', value: '业务系统/工单系统/aierp_pro_test', icon: 'bi-database-fill', iconClass: 'db' }
          ]
        }
      ]
    }
  ];

  function row(no, item, type, source, attr, content, time) {
    return { no: no, item: item, type: type, source: source, attr: attr, content: content, time: time };
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function renderSelect(name, label, options, wide) {
    return '<div class="mmn-select' + (wide ? ' mmn-select-wide' : '') + '" data-mmn-select="' + name + '">' +
      '<button class="mmn-select-trigger" type="button"><span>' + escapeHtml(label) + '</span><i class="bi bi-chevron-down"></i></button>' +
      '<div class="mmn-select-menu">' +
        options.map(function (option, index) {
          return '<div class="mmn-option' + (index === 0 ? ' active' : '') + '" data-mmn-option="' + escapeHtml(option) + '">' + escapeHtml(option) + '</div>';
        }).join('') +
      '</div>' +
    '</div>';
  }

  function renderSourcePicker() {
    return '<div class="mmn-source-picker" data-mmn-source-picker>' +
      '<input class="mmn-input mmn-source-input" data-mmn-source-trigger readonly placeholder="归属数据源">' +
      '<div class="mmn-source-dropdown">' +
        '<div class="mmn-source-search"><input type="text" data-mmn-source-search placeholder="关键字搜索"><button type="button"><i class="bi bi-search"></i></button></div>' +
        '<div class="mmn-source-tree-scroll"><ul class="mmn-source-tree">' + renderSourceTree(sourceTree, 0) + '</ul></div>' +
      '</div>' +
    '</div>';
  }

  function renderSourceTree(items, depth) {
    return items.map(function (item) {
      var hasChildren = item.children && item.children.length;
      var searchText = (item.label + ' ' + item.value).toLowerCase();
      return '<li class="mmn-source-node' + (item.open ? ' open' : '') + '" data-mmn-source-node data-mmn-source-search-text="' + escapeHtml(searchText) + '">' +
        '<div class="mmn-source-row depth-' + depth + '" data-mmn-source-value="' + escapeHtml(item.value) + '" data-mmn-source-label="' + escapeHtml(item.label) + '">' +
          (hasChildren ? '<span class="mmn-source-toggle" data-mmn-source-toggle><i class="bi ' + (item.open ? 'bi-chevron-down' : 'bi-chevron-right') + '"></i></span>' : '<span class="mmn-source-spacer"></span>') +
          '<i class="bi ' + item.icon + ' mmn-source-icon ' + item.iconClass + '"></i>' +
          '<span class="mmn-source-text" title="' + escapeHtml(item.value) + '">' + escapeHtml(item.label) + '</span>' +
        '</div>' +
        (hasChildren ? '<ul style="' + (item.open ? '' : 'display:none;') + '">' + renderSourceTree(item.children, depth + 1) + '</ul>' : '') +
      '</li>';
    }).join('');
  }

  function filterSourceTree(picker, keyword) {
    var value = keyword.trim().toLowerCase();
    picker.querySelectorAll('[data-mmn-source-node]').forEach(function (node) {
      node.classList.remove('hidden');
    });
    if (!value) return;
    picker.querySelectorAll('[data-mmn-source-node]').forEach(function (node) {
      var text = node.getAttribute('data-mmn-source-search-text') || '';
      var childMatched = Array.prototype.some.call(node.querySelectorAll('[data-mmn-source-node]'), function (child) {
        return (child.getAttribute('data-mmn-source-search-text') || '').indexOf(value) >= 0;
      });
      var matched = text.indexOf(value) >= 0 || childMatched;
      node.classList.toggle('hidden', !matched);
      if (matched) {
        var list = node.querySelector(':scope > ul');
        var icon = node.querySelector(':scope > .mmn-source-row [data-mmn-source-toggle] i');
        if (list) list.style.display = '';
        if (icon) {
          icon.classList.remove('bi-chevron-right');
          icon.classList.add('bi-chevron-down');
        }
      }
    });
  }

  function renderCalendar() {
    var week = ['日', '一', '二', '三', '四', '五', '六'];
    var may = ['26', '27', '28', '29', '30', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '1', '2', '3', '4', '5', '6'];
    var june = ['31', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'];
    function month(days, activeIndex, mutedBefore, rangeStart, rangeEnd) {
      return '<div class="mmn-cal-month"><div class="mmn-cal-grid">' +
        week.map(function (d) { return '<strong>' + d + '</strong>'; }).join('') +
        days.map(function (d, index) {
          var cls = [];
          if (index < mutedBefore || index > 34) cls.push('muted');
          if (index >= rangeStart && index <= rangeEnd) cls.push('range');
          if (index === activeIndex) cls.push('active');
          return '<span class="' + cls.join(' ') + '">' + d + '</span>';
        }).join('') +
      '</div></div>';
    }
    return '<div class="mmn-date-pop">' +
      '<div class="mmn-cal-head">' +
        '<div class="mmn-cal-title"><i class="bi bi-chevron-double-left"></i><i class="bi bi-chevron-left"></i><span>2026年&nbsp;&nbsp;5月</span><span></span></div>' +
        '<div class="mmn-cal-title"><span></span><span>2026年&nbsp;&nbsp;6月</span><i class="bi bi-chevron-right"></i><i class="bi bi-chevron-double-right"></i></div>' +
      '</div>' +
      '<div class="mmn-cal-body">' + month(may, 21, 5, 21, 34) + month(june, 17, 1, 1, 20) + '</div>' +
      '<div class="mmn-cal-footer"><span data-mmn-date-tip></span><button type="button" data-mmn-date-clear>清空</button><button type="button" data-mmn-date-ok>确定</button></div>' +
    '</div>';
  }

  function renderRows() {
    return records.map(function (item) {
      return '<tr>' +
        '<td>' + item.no + '</td>' +
        '<td title="' + escapeHtml(item.item) + '">' + escapeHtml(item.item) + '</td>' +
        '<td>' + escapeHtml(item.type) + '</td>' +
        '<td title="' + escapeHtml(item.source) + '">' + escapeHtml(item.source) + '</td>' +
        '<td>' + escapeHtml(item.attr) + '</td>' +
        '<td title="' + escapeHtml(item.content) + '">' + escapeHtml(item.content) + '</td>' +
        '<td>' + escapeHtml(item.time) + '</td>' +
        '<td><button type="button" class="mmn-history-link" data-mmn-history="' + item.no + '">历史版本</button></td>' +
      '</tr>';
    }).join('');
  }

  function renderMain() {
    return '<div class="page-metadata-monitor">' +
      '<div class="mmn-panel">' +
        '<div class="mmn-section-head">' +
          '<div class="mmn-title">元数据统计概况</div>' +
          '<div class="mmn-top-query">' +
            '<div class="mmn-date-wrap" data-mmn-date-wrap>' +
              '<input class="mmn-input mmn-date-top" data-mmn-date-input readonly value="2026-05-17 - 2026-06-17">' +
              renderCalendar() +
            '</div>' +
            '<button class="btn btn-primary mmn-btn" type="button"><i class="bi bi-search"></i> 查询</button>' +
          '</div>' +
        '</div>' +
        '<div class="mmn-overview-body">' +
          '<div class="mmn-stat-card">' +
            stat('数据库实例', '2', '个', 'bi-hexagon-fill') +
            stat('数据库', '22', '个', 'bi-server') +
            stat('表', '535', '张', 'bi-table') +
            stat('字段', '6798', '个', 'bi-file-earmark-binary') +
          '</div>' +
          '<div class="mmn-chart-area"><div class="mmn-echarts" data-mmn-echarts><div class="mmn-chart-legend">元数据数量</div><div class="mmn-chart-axis-label">数量</div><canvas class="mmn-chart" data-mmn-chart></canvas><div class="mmn-chart-tooltip" data-mmn-chart-tooltip></div></div></div>' +
        '</div>' +
      '</div>' +
      '<div class="mmn-panel mmn-record-panel">' +
        '<div class="mmn-record-head">' +
          '<div class="mmn-title">元数据变更记录</div>' +
          '<div class="mmn-toolbar">' +
            renderSelect('item', state.filters.item, ['变更项', '库', '表', '字段']) +
            renderSourcePicker() +
            renderSelect('type', state.filters.type, ['类型', '元数据', '数据源']) +
            renderSelect('attr', state.filters.attr, ['变更属性', '修改', '删除', '新增'], true) +
            '<span class="mmn-field-label">变更时间</span>' +
            '<div class="mmn-date-wrap" data-mmn-date-wrap>' +
              '<input class="mmn-input mmn-date-mid" data-mmn-date-input readonly value="2026-05-17 14:22:01 - 2026-06-17 14:22:01">' +
              renderCalendar() +
            '</div>' +
            '<input class="mmn-input mmn-keyword" placeholder="关键字模糊查询">' +
            '<button class="btn btn-primary mmn-btn" type="button"><i class="bi bi-search"></i> 查询</button>' +
            '<button class="btn btn-primary mmn-btn" type="button"><i class="bi bi-download"></i> 导出</button>' +
          '</div>' +
        '</div>' +
        '<div class="mmn-table-wrap">' +
          '<table class="mmn-table">' +
            '<colgroup><col style="width:8%"><col style="width:19%"><col style="width:6.5%"><col style="width:14%"><col style="width:5%"><col style="width:25%"><col style="width:12.5%"><col style="width:10%"></colgroup>' +
            '<thead><tr><th>序号</th><th>变更项</th><th>类型</th><th>归属数据源</th><th>变更属性</th><th>变更内容</th><th>变更时间</th><th>操作</th></tr></thead>' +
            '<tbody>' + renderRows() + '</tbody>' +
          '</table>' +
        '</div>' +
        '<div class="mmn-pagination">' +
          '<div class="mmn-page-left"><span>显示第 1 到第 5 条记录，总共 473 条记录&nbsp; 每页显示</span><button class="mmn-page-size" type="button">5 <i class="bi bi-caret-up-fill"></i></button><span>条记录</span></div>' +
          '<div class="mmn-page-right"><div class="mmn-page-nav"><button type="button">‹</button><button type="button" class="active">1</button><button type="button">2</button><button type="button">3</button><button type="button">4</button><button type="button">5</button><button type="button">...</button><button type="button">95</button><button type="button">›</button></div><div class="mmn-page-jump"><input value="1"><button type="button">GO</button></div></div>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  function stat(name, value, unit, icon) {
    return '<div class="mmn-stat-item"><div class="mmn-stat-name">' + name + '</div><div class="mmn-stat-value"><span>' + value + '</span><small>' + unit + '</small></div><div class="mmn-stat-icon"><i class="bi ' + icon + '"></i></div></div>';
  }

  function createMetadataEcharts(el, option) {
    var canvas = el.querySelector('[data-mmn-chart]');
    var tooltip = el.querySelector('[data-mmn-chart-tooltip]');
    var points = [];
    var chart = {
      resize: function () {
        draw();
      }
    };

    function draw(activeIndex) {
      var rect = canvas.getBoundingClientRect();
      var ratio = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.floor(rect.width * ratio));
      canvas.height = Math.max(1, Math.floor(rect.height * ratio));
      var ctx = canvas.getContext('2d');
      ctx.scale(ratio, ratio);
      var w = rect.width;
      var h = rect.height;
      var left = 54;
      var right = 20;
      var top = 12;
      var bottom = 30;
      var plotW = w - left - right;
      var plotH = h - top - bottom;
      var labels = option.xAxis.data;
      var data = option.series[0].data;
      var max = option.yAxis.max;

      function y(v) { return top + plotH - (v / max) * plotH; }
      function x(i) { return left + (plotW / (labels.length - 1)) * i; }

      points = data.map(function (value, index) {
        return { x: x(index), y: y(value), label: labels[index], value: value };
      });

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = '#e8eef6';
      ctx.lineWidth = 1;
      ctx.fillStyle = '#9aa9bc';
      ctx.font = '12px Microsoft YaHei, Arial';
      for (var gv = 0; gv <= 7000; gv += 1000) {
        var gy = y(gv);
        ctx.beginPath();
        ctx.setLineDash([4, 6]);
        ctx.moveTo(left, gy);
        ctx.lineTo(w - right, gy);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillText(gv.toLocaleString(), left - 46, gy + 4);
      }
      labels.forEach(function (label, i) {
        var gx = x(i);
        ctx.strokeStyle = '#edf2f8';
        ctx.beginPath();
        ctx.moveTo(gx, top);
        ctx.lineTo(gx, top + plotH);
        ctx.stroke();
        ctx.fillStyle = '#9aa9bc';
        ctx.fillText(label, gx - 15, h - 8);
      });
      ctx.beginPath();
      points.forEach(function (point, i) {
        if (i === 0) ctx.moveTo(point.x, point.y);
        else ctx.lineTo(point.x, point.y);
      });
      ctx.lineTo(points[points.length - 1].x, top + plotH);
      ctx.lineTo(points[0].x, top + plotH);
      ctx.closePath();
      var fill = ctx.createLinearGradient(0, top, 0, top + plotH);
      fill.addColorStop(0, 'rgba(64,146,255,0.28)');
      fill.addColorStop(1, 'rgba(64,146,255,0.04)');
      ctx.fillStyle = fill;
      ctx.fill();
      ctx.beginPath();
      points.forEach(function (point, i) {
        if (i === 0) ctx.moveTo(point.x, point.y);
        else ctx.lineTo(point.x, point.y);
      });
      ctx.strokeStyle = '#4092ff';
      ctx.lineWidth = 2;
      ctx.stroke();

      if (activeIndex >= 0 && points[activeIndex]) {
        var active = points[activeIndex];
        ctx.strokeStyle = 'rgba(64,146,255,0.45)';
        ctx.beginPath();
        ctx.moveTo(active.x, top);
        ctx.lineTo(active.x, top + plotH);
        ctx.stroke();
        ctx.fillStyle = '#fff';
        ctx.strokeStyle = '#4092ff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(active.x, active.y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
    }

    canvas.addEventListener('mousemove', function (event) {
      var rect = canvas.getBoundingClientRect();
      var mouseX = event.clientX - rect.left;
      var nearest = points.reduce(function (prev, point, index) {
        var dist = Math.abs(point.x - mouseX);
        return !prev || dist < prev.dist ? { index: index, point: point, dist: dist } : prev;
      }, null);
      if (!nearest) return;
      draw(nearest.index);
      tooltip.innerHTML = '<strong>' + nearest.point.label + '</strong><span>元数据数量：' + nearest.point.value.toLocaleString() + '</span>';
      tooltip.style.display = 'block';
      tooltip.style.left = Math.min(rect.width - 150, nearest.point.x + 12) + 'px';
      tooltip.style.top = Math.max(8, nearest.point.y - 48) + 'px';
    });

    canvas.addEventListener('mouseleave', function () {
      tooltip.style.display = 'none';
      draw();
    });

    draw();
    return chart;
  }

  function initMetadataChart(pageEl) {
    var chartEl = pageEl.querySelector('[data-mmn-echarts]');
    if (!chartEl) return;
    var option = {
      xAxis: { data: ['05/17', '05/18', '05/19', '05/20', '05/21', '05/22', '05/23', '05/24', '05/25', '05/26', '05/27', '05/28', '05/29', '05/30', '05/31', '06/01', '06/02', '06/03', '06/04', '06/05', '06/06', '06/07', '06/08', '06/09', '06/10', '06/11', '06/12', '06/13', '06/14', '06/15', '06/16', '06/17'] },
      yAxis: { max: 7600 },
      series: [{ name: '元数据数量', data: [6800, 6800, 6800, 7100, 7120, 7100, 7250, 7250, 7252, 7255, 7260, 7260, 7245, 7285, 7285, 7300, 7302, 7302, 7304, 7308, 7310, 7312, 7314, 7317, 7318, 7320, 7322, 7324, 7325, 7327, 7330, 7332] }]
    };
    if (window.echarts) {
      chartEl.innerHTML = '';
      var chart = window.echarts.init(chartEl);
      var areaColor = window.echarts.graphic
        ? new window.echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(64,146,255,0.28)' },
            { offset: 1, color: 'rgba(64,146,255,0.04)' }
          ])
        : 'rgba(64,146,255,0.16)';
      chart.setOption({
        tooltip: { trigger: 'axis', backgroundColor: 'rgba(255,255,255,0.96)', borderColor: '#d8e4f2', borderWidth: 1, textStyle: { color: '#26384d', fontSize: 12 } },
        legend: { top: 2, left: 'center', itemWidth: 18, itemHeight: 8, textStyle: { color: '#4d5e73', fontSize: 13 }, data: ['元数据数量'] },
        grid: { left: 54, right: 20, top: 58, bottom: 30 },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: option.xAxis.data,
          axisTick: { show: false },
          axisLine: { lineStyle: { color: '#e8eef6' } },
          axisLabel: { color: '#9aa9bc', fontSize: 12 },
          splitLine: { show: true, lineStyle: { color: '#edf2f8' } }
        },
        yAxis: {
          type: 'value',
          min: 0,
          max: option.yAxis.max,
          interval: 1000,
          axisLabel: { color: '#9aa9bc', fontSize: 12 },
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: { lineStyle: { color: '#e8eef6', type: 'dashed' } }
        },
        series: [{
          name: '元数据数量',
          type: 'line',
          smooth: true,
          showSymbol: false,
          symbol: 'circle',
          symbolSize: 8,
          lineStyle: { width: 2, color: '#4092ff' },
          itemStyle: { color: '#4092ff' },
          areaStyle: { color: areaColor },
          data: option.series[0].data
        }]
      });
      window.addEventListener('resize', function () { chart.resize(); });
      return;
    }
    var chart = createMetadataEcharts(chartEl, option);
    window.setTimeout(chart.resize, 0);
  }

  function bindMain(pageEl) {
    pageEl.addEventListener('click', function (event) {
      var sourcePicker = event.target.closest('[data-mmn-source-picker]');
      pageEl.querySelectorAll('.mmn-source-picker.open').forEach(function (item) {
        if (item !== sourcePicker) item.classList.remove('open');
      });
      if (event.target.closest('[data-mmn-source-trigger]') && sourcePicker) {
        sourcePicker.classList.toggle('open');
        var searchInput = sourcePicker.querySelector('[data-mmn-source-search]');
        if (sourcePicker.classList.contains('open') && searchInput) searchInput.focus();
        return;
      }
      var sourceToggle = event.target.closest('[data-mmn-source-toggle]');
      if (sourceToggle) {
        event.stopPropagation();
        var sourceNode = sourceToggle.closest('[data-mmn-source-node]');
        var sourceChildren = sourceNode ? sourceNode.querySelector(':scope > ul') : null;
        var sourceIcon = sourceToggle.querySelector('i');
        var isOpen = sourceChildren && sourceChildren.style.display !== 'none';
        if (sourceChildren) sourceChildren.style.display = isOpen ? 'none' : '';
        if (sourceIcon) {
          sourceIcon.classList.toggle('bi-chevron-right', isOpen);
          sourceIcon.classList.toggle('bi-chevron-down', !isOpen);
        }
        return;
      }
      var sourceRow = event.target.closest('[data-mmn-source-value]');
      if (sourceRow && sourcePicker) {
        var input = sourcePicker.querySelector('[data-mmn-source-trigger]');
        if (input) input.value = sourceRow.getAttribute('data-mmn-source-value') || sourceRow.getAttribute('data-mmn-source-label') || '';
        sourcePicker.querySelectorAll('.mmn-source-row.active').forEach(function (item) { item.classList.remove('active'); });
        sourceRow.classList.add('active');
        sourcePicker.classList.remove('open');
        return;
      }
      var select = event.target.closest('[data-mmn-select]');
      pageEl.querySelectorAll('.mmn-select.open').forEach(function (item) {
        if (item !== select) item.classList.remove('open');
      });
      if (event.target.closest('.mmn-select-trigger') && select) {
        select.classList.toggle('open');
        return;
      }
      var option = event.target.closest('[data-mmn-option]');
      if (option && select) {
        var value = option.getAttribute('data-mmn-option');
        select.querySelector('.mmn-select-trigger span').textContent = value;
        select.querySelectorAll('.mmn-option').forEach(function (item) { item.classList.remove('active'); });
        option.classList.add('active');
        select.classList.remove('open');
        return;
      }
      var dateInput = event.target.closest('[data-mmn-date-input]');
      var dateWrap = event.target.closest('[data-mmn-date-wrap]');
      pageEl.querySelectorAll('.mmn-date-wrap.open').forEach(function (item) {
        if (item !== dateWrap) item.classList.remove('open');
      });
      if (dateInput && dateWrap) {
        dateWrap.classList.toggle('open');
        return;
      }
      if (event.target.closest('[data-mmn-date-ok]') || event.target.closest('[data-mmn-date-clear]')) {
        var wrap = event.target.closest('[data-mmn-date-wrap]');
        if (wrap) wrap.classList.remove('open');
        return;
      }
      var history = event.target.closest('[data-mmn-history]');
      if (history) {
        showDetail(Number(history.getAttribute('data-mmn-history')) || 1);
        return;
      }
      if (!event.target.closest('.mmn-select')) {
        pageEl.querySelectorAll('.mmn-select.open').forEach(function (item) { item.classList.remove('open'); });
      }
      if (!event.target.closest('[data-mmn-date-wrap]')) {
        pageEl.querySelectorAll('.mmn-date-wrap.open').forEach(function (item) { item.classList.remove('open'); });
      }
      if (!event.target.closest('[data-mmn-source-picker]')) {
        pageEl.querySelectorAll('.mmn-source-picker.open').forEach(function (item) { item.classList.remove('open'); });
      }
    });

    pageEl.addEventListener('input', function (event) {
      if (event.target.matches('[data-mmn-source-search]')) {
        var picker = event.target.closest('[data-mmn-source-picker]');
        if (picker) filterSourceTree(picker, event.target.value);
      }
    });
  }

  function detailRow(label, v1, v2, changed) {
    return '<div class="mmn-detail-row">' +
      '<div class="mmn-detail-label">' + label + '</div>' +
      '<div class="mmn-detail-value' + (changed ? ' changed' : '') + '">' + escapeHtml(v1) + '</div>' +
      '<div class="mmn-detail-value' + (changed ? ' changed' : '') + '">' + escapeHtml(v2) + '</div>' +
      '<div class="mmn-detail-note"><i class="bi bi-info-circle-fill"></i>' + label + '</div>' +
    '</div>';
  }

  function detailSection(title, rows) {
    return '<div class="mmn-detail-section"><div class="mmn-detail-section-title"><span>' + title + '</span><span></span><span></span><span></span></div>' + rows.join('') + '</div>';
  }

  function renderDetail() {
    return '<div class="page-metadata-monitor-detail">' +
      '<div class="mmn-detail-head"><div class="mmn-detail-title"><i class="bi bi-list"></i>查看详情</div><button type="button" class="mmn-back-btn" data-mmn-back>返回</button></div>' +
      '<div class="mmn-version-bar">' +
        '<div><div class="mmn-version-label">V1.0</div><div class="mmn-version-time"><button class="mmn-version-arrow" type="button">‹</button><span>2026-04-13 09:50:49</span></div></div>' +
        '<div><div class="mmn-version-label">V2.0</div><div class="mmn-version-time"><span>2026-05-22 10:13:00</span><button class="mmn-version-arrow next" type="button">›</button></div></div>' +
      '</div>' +
      detailSection('基本信息', [
        detailRow('编码', '', '', false),
        detailRow('英文名', 'Telephone', 'Telephone', false),
        detailRow('别名', 'Telephone', 'Telephone', false),
        detailRow('描述', '联系电话', '联系电话', false)
      ]) +
      detailSection('技术信息', [
        detailRow('数据类型', 'varchar', 'varchar', false),
        detailRow('长度', '11', '11', false),
        detailRow('精度', '0', '0', false),
        detailRow('引用标准', '', '手机号码(date_00000029)', true),
        detailRow('引用业务代码', '', '', false),
        detailRow('脱敏规则', '', '', false),
        detailRow('质量规则', '', '', false),
        detailRow('加密规则', '', '', false)
      ]) +
      detailSection('业务信息', [
        detailRow('数据分类', '', '', false),
        detailRow('数据分级', '', '', false)
      ]) +
    '</div>';
  }

  function showMain() {
    DP.contentArea.innerHTML = renderMain();
    var pageEl = DP.contentArea.querySelector('.page-metadata-monitor');
    bindMain(pageEl);
    initMetadataChart(pageEl);
  }

  function showDetail() {
    DP.contentArea.innerHTML = renderDetail();
    var pageEl = DP.contentArea.querySelector('.page-metadata-monitor-detail');
    pageEl.addEventListener('click', function (event) {
      if (event.target.closest('[data-mmn-back]')) showMain();
    });
  }

  return {
    html: '',
    init: showMain
  };
})();
