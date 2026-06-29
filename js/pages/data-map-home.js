/**
 * 数据地图 - 首页
 * 独立菜单体系 + 首页静态原型交互
 */
window.DP = window.DP || {};
DP.pages = DP.pages || {};

DP.pages.dataMapHome = (function () {
  var DATA_SETS = {
    public: {
      stats: [
        { label: '目录总量', value: '8', icon: 'bi-folder2-open' },
        { label: 'API总数', value: '26', icon: 'bi-cloud' },
        { label: '接口开发', value: '18', icon: 'bi-code-square' },
        { label: '接口注册', value: '8', icon: 'bi-link-45deg' },
        { label: '数据集', value: '14', icon: 'bi-collection' },
        { label: '申请用户数', value: '42', icon: 'bi-person-check' },
        { label: '申请总量', value: '138', icon: 'bi-file-earmark-text' },
        { label: '月浏览量', value: '1264', icon: 'bi-eye' },
        { label: '月调用量', value: '8920', icon: 'bi-activity' },
        { label: '月均下载量', value: '316', icon: 'bi-cloud-download' }
      ],
      resources: [
        {
          title: '行政区划标准代码API',
          type: '接口开发',
          category: '公共基础目录',
          frequency: '每日',
          onlineAt: '2026-06-18 09:12:30',
          updatedAt: '2026-06-25 18:02:11',
          views: 186,
          applies: 16
        },
        {
          title: '节假日工作日查询API',
          type: '接口注册',
          category: '公共服务目录',
          frequency: '实时',
          onlineAt: '2026-06-17 14:38:21',
          updatedAt: '2026-06-25 16:40:55',
          views: 142,
          applies: 12
        },
        {
          title: '气象预警信息数据集',
          type: '数据集资源注册',
          category: '公共服务目录',
          frequency: '每小时',
          onlineAt: '2026-06-15 10:21:08',
          updatedAt: '2026-06-26 08:10:19',
          views: 119,
          applies: 9
        },
        {
          title: '企业工商登记基础库',
          type: '数据集资源注册',
          category: '市场主体目录',
          frequency: '每日',
          onlineAt: '2026-06-14 11:05:42',
          updatedAt: '2026-06-25 20:18:07',
          views: 98,
          applies: 8
        },
        {
          title: '统一社会信用代码核验API',
          type: '接口注册',
          category: '市场主体目录',
          frequency: '实时',
          onlineAt: '2026-06-12 15:30:18',
          updatedAt: '2026-06-24 17:45:26',
          views: 88,
          applies: 11
        },
        {
          title: '交通路网拥堵指数API',
          type: '接口开发',
          category: '城市运行目录',
          frequency: '每15分钟',
          onlineAt: '2026-06-10 13:16:50',
          updatedAt: '2026-06-26 08:45:33',
          views: 77,
          applies: 7
        },
        {
          title: '公共机构空间位置数据集',
          type: '数据集资源注册',
          category: '城市运行目录',
          frequency: '每周',
          onlineAt: '2026-06-08 16:09:36',
          updatedAt: '2026-06-24 09:32:14',
          views: 65,
          applies: 6
        },
        {
          title: '政策文件公开目录API',
          type: '接口开发',
          category: '公共公开目录',
          frequency: '每日',
          onlineAt: '2026-06-06 09:40:25',
          updatedAt: '2026-06-23 11:25:49',
          views: 54,
          applies: 5
        },
        {
          title: '人口年龄结构统计数据集',
          type: '数据集资源注册',
          category: '统计分析目录',
          frequency: '每月',
          onlineAt: '2026-06-04 10:58:11',
          updatedAt: '2026-06-21 19:06:04',
          views: 43,
          applies: 4
        },
        {
          title: '数据共享申请编排服务',
          type: 'API编排',
          category: '公共服务目录',
          frequency: '实时',
          onlineAt: '2026-06-03 17:18:39',
          updatedAt: '2026-06-20 14:57:31',
          views: 36,
          applies: 3
        }
      ]
    },
    enterprise: {
      stats: [
        { label: '目录总量', value: '12', icon: 'bi-folder2-open' },
        { label: 'API总数', value: '34', icon: 'bi-cloud' },
        { label: '接口开发', value: '22', icon: 'bi-code-square' },
        { label: '接口注册', value: '12', icon: 'bi-link-45deg' },
        { label: '数据集', value: '28', icon: 'bi-collection' },
        { label: '申请用户数', value: '57', icon: 'bi-person-check' },
        { label: '申请总量', value: '206', icon: 'bi-file-earmark-text' },
        { label: '月浏览量', value: '1782', icon: 'bi-eye' },
        { label: '月调用量', value: '12540', icon: 'bi-activity' },
        { label: '月均下载量', value: '428', icon: 'bi-cloud-download' }
      ],
      resources: [
        {
          title: '员工主数据画像API',
          type: '接口开发',
          category: '人力资源目录',
          frequency: '每日',
          onlineAt: '2026-06-19 09:42:15',
          updatedAt: '2026-06-25 19:41:56',
          views: 155,
          applies: 15
        },
        {
          title: '考勤月度汇总数据集',
          type: '数据集资源注册',
          category: '人力资源目录',
          frequency: '每月',
          onlineAt: '2026-06-18 16:20:08',
          updatedAt: '2026-06-24 10:18:31',
          views: 132,
          applies: 13
        },
        {
          title: '供应商资质核验API',
          type: '接口注册',
          category: '供应链目录',
          frequency: '实时',
          onlineAt: '2026-06-16 13:09:22',
          updatedAt: '2026-06-25 13:08:59',
          views: 121,
          applies: 10
        },
        {
          title: '采购订单履约明细数据集',
          type: '数据集资源注册',
          category: '供应链目录',
          frequency: '每日',
          onlineAt: '2026-06-15 11:35:44',
          updatedAt: '2026-06-24 11:32:40',
          views: 104,
          applies: 9
        },
        {
          title: '客户服务工单状态API',
          type: '接口开发',
          category: '客户服务目录',
          frequency: '实时',
          onlineAt: '2026-06-13 15:12:04',
          updatedAt: '2026-06-25 09:11:27',
          views: 96,
          applies: 8
        },
        {
          title: '销售回款对账数据集',
          type: '数据集资源注册',
          category: '财务结算目录',
          frequency: '每日',
          onlineAt: '2026-06-11 10:07:38',
          updatedAt: '2026-06-23 18:24:06',
          views: 82,
          applies: 7
        },
        {
          title: '发票验真编排服务',
          type: 'API编排',
          category: '财务结算目录',
          frequency: '实时',
          onlineAt: '2026-06-10 14:45:12',
          updatedAt: '2026-06-22 16:02:48',
          views: 69,
          applies: 5
        },
        {
          title: '门店销售日报查询API',
          type: '接口开发',
          category: '经营分析目录',
          frequency: '每日',
          onlineAt: '2026-06-08 09:28:43',
          updatedAt: '2026-06-22 09:40:12',
          views: 58,
          applies: 4
        },
        {
          title: '设备巡检记录数据集',
          type: '数据集资源注册',
          category: '设备运维目录',
          frequency: '每日',
          onlineAt: '2026-06-06 17:42:09',
          updatedAt: '2026-06-21 20:16:52',
          views: 46,
          applies: 3
        },
        {
          title: '仓库库存预警API',
          type: '接口注册',
          category: '仓储物流目录',
          frequency: '每小时',
          onlineAt: '2026-06-04 12:30:55',
          updatedAt: '2026-06-20 12:26:18',
          views: 39,
          applies: 3
        }
      ]
    }
  };

  function renderStats(tabKey) {
    var data = DATA_SETS[tabKey] || DATA_SETS.public;
    return data.stats.map(function (item) {
      return '' +
        '<div class="dm-stat-card">' +
          '<div class="dm-stat-label">' + item.label + '</div>' +
          '<div class="dm-stat-value">' + item.value + '</div>' +
          '<span class="dm-stat-icon"><i class="bi ' + item.icon + '"></i></span>' +
        '</div>';
    }).join('');
  }

  function renderResources(tabKey) {
    var data = DATA_SETS[tabKey] || DATA_SETS.public;
    return data.resources.map(function (item) {
      return '' +
        '<article class="dm-resource-card" tabindex="0" data-resource-title="' + item.title + '">' +
          '<div class="dm-card-head">' +
            '<h3 class="dm-card-title">' + item.title + '</h3>' +
            '<span class="dm-card-type">' + item.type + '</span>' +
          '</div>' +
          '<div class="dm-card-line">' +
            '<span>数据分类：' + item.category + '</span>' +
            '<span class="dm-card-sep"></span>' +
            '<span>更新频率：' + item.frequency + '</span>' +
          '</div>' +
          '<div class="dm-card-line">' +
            '<span>上架时间：' + item.onlineAt + '</span>' +
            '<span class="dm-card-sep"></span>' +
            '<span>更新时间：' + item.updatedAt + '</span>' +
          '</div>' +
          '<div class="dm-card-foot">' +
            '<span><i class="bi bi-eye"></i>浏览量：' + item.views + '</span>' +
            '<span><i class="bi bi-file-earmark-plus"></i>申请量：' + item.applies + '</span>' +
          '</div>' +
        '</article>';
    }).join('');
  }

  function showToast(message) {
    var toast = document.querySelector('.dm-toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(function () {
      toast.classList.remove('show');
    }, 1800);
  }

  function setActiveTab(tabKey) {
    document.querySelectorAll('.dm-tab').forEach(function (tab) {
      tab.classList.toggle('active', tab.dataset.dmTab === tabKey);
    });

    var statsGrid = document.getElementById('dmStatsGrid');
    var resourceGrid = document.getElementById('dmResourceGrid');
    if (statsGrid) statsGrid.innerHTML = renderStats(tabKey);
    if (resourceGrid) resourceGrid.innerHTML = renderResources(tabKey);
    bindResourceCards();
  }

  function runSearch() {
    var input = document.querySelector('.dm-search-input');
    var keyword = input ? input.value.trim() : '';
    showToast(keyword ? '已模拟搜索：' + keyword : '请输入关键字后搜索');
  }

  function bindResourceCards() {
    document.querySelectorAll('.dm-resource-card').forEach(function (card) {
      card.addEventListener('click', function () {
        showToast('已选中资源：' + (card.dataset.resourceTitle || '数据资源'));
      });
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') card.click();
      });
    });
  }

  return {
    html: `
      <div class="page-data-map">
        <header class="dm-header">
          <div class="dm-header-inner">
            <a class="dm-brand" href="javascript:;" aria-label="数据地图首页">
              <span class="dm-brand-mark"><img src="img/logo.png" alt="数据地图"></span>
              <span class="dm-brand-title">数据地图</span>
            </a>
            <nav class="dm-main-nav" aria-label="数据地图菜单">
              <div class="dm-nav-group">
                <button type="button" class="dm-nav-link active" data-dm-home data-dm-menu="首页">首页</button>
              </div>
              <div class="dm-nav-group">
                <button type="button" class="dm-nav-link" data-dm-menu="数据地图">数据地图</button>
              </div>
              <div class="dm-nav-group">
                <button type="button" class="dm-nav-link" data-dm-menu="个人中心">个人中心<i class="bi bi-chevron-down"></i></button>
                <div class="dm-dropdown">
                  <button type="button" data-dm-menu="我的数据">我的数据</button>
                  <button type="button" data-dm-menu="审核中心">审核中心</button>
                  <button type="button" data-dm-menu="我的收藏">我的收藏</button>
                  <button type="button" data-dm-menu="我的应用">我的应用</button>
                  <button type="button" data-dm-menu="账号信息">账号信息</button>
                  <button type="button" data-dm-menu="我的消息">我的消息</button>
                </div>
              </div>
              <div class="dm-nav-group">
                <button type="button" class="dm-nav-link" data-dm-menu="运行监控">运行监控<i class="bi bi-chevron-down"></i></button>
                <div class="dm-dropdown">
                  <button type="button" data-dm-menu="API监控">API监控</button>
                  <button type="button" data-dm-menu="申请记录">申请记录</button>
                </div>
              </div>
              <div class="dm-nav-group">
                <button type="button" class="dm-nav-link" data-dm-menu="系统管理">系统管理<i class="bi bi-chevron-down"></i></button>
                <div class="dm-dropdown">
                  <button type="button" data-dm-menu="数据管理">数据管理</button>
                  <button type="button" data-dm-menu="审核中心">审核中心</button>
                  <button type="button" data-dm-menu="用户管理">用户管理</button>
                  <button type="button" data-dm-menu="角色管理">角色管理</button>
                  <button type="button" data-dm-menu="系统配置">系统配置</button>
                  <button type="button" data-dm-menu="操作日志">操作日志</button>
                </div>
              </div>
            </nav>
            <div class="dm-header-user">演示-测试</div>
          </div>
        </header>

        <section class="dm-hero" aria-label="数据地图横幅"></section>

        <section class="dm-search-panel" aria-label="数据搜索">
          <div class="dm-search-row">
            <input class="dm-search-input" type="text" aria-label="搜索关键字">
            <button type="button" class="dm-search-btn"><i class="bi bi-search"></i><span>搜索</span></button>
          </div>
          <div class="dm-hot-row">
            <span class="dm-hot-label">热门搜索：</span>
            <button type="button" class="dm-hot-tag" data-keyword="行政区划">行政区划</button>
            <button type="button" class="dm-hot-tag" data-keyword="信用代码">信用代码</button>
            <button type="button" class="dm-hot-tag" data-keyword="考勤">考勤</button>
            <button type="button" class="dm-hot-tag" data-keyword="库存">库存</button>
          </div>
        </section>

        <section class="dm-tabs-wrap" aria-label="数据类型切换">
          <div class="dm-tabs">
            <button type="button" class="dm-tab active" data-dm-tab="public">公共数据</button>
            <button type="button" class="dm-tab" data-dm-tab="enterprise">企业数据</button>
          </div>
        </section>

        <section class="dm-stats-section" aria-label="数据概览">
          <div class="dm-stats-grid" id="dmStatsGrid"></div>
        </section>

        <section class="dm-resource-section" aria-label="数据资源列表">
          <div class="dm-resource-grid" id="dmResourceGrid"></div>
        </section>

        <footer class="dm-footer">
          <div class="dm-company">深圳市傲天科技股份有限公司</div>
          <div class="dm-record"><i class="bi bi-record-circle-fill"></i>备案：ICP备05000003号-2&nbsp;&nbsp;|&nbsp;&nbsp;公网安备33010502001397号&nbsp;&nbsp;|&nbsp;&nbsp;网站标识码：3301000005</div>
          <div class="dm-browser-tip">建议使用1366*768以上分辨率/Chrome、IE9或以上浏览器访问达到最佳效果</div>
        </footer>
        <div class="dm-toast" role="status" aria-live="polite"></div>
      </div>
    `,

    init: function () {
      setActiveTab('public');

      document.querySelectorAll('.dm-tab').forEach(function (tab) {
        tab.addEventListener('click', function () {
          setActiveTab(tab.dataset.dmTab || 'public');
        });
      });

      document.querySelector('.dm-search-btn')?.addEventListener('click', runSearch);
      document.querySelector('.dm-search-input')?.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') runSearch();
      });

      document.querySelectorAll('.dm-hot-tag').forEach(function (tag) {
        tag.addEventListener('click', function () {
          var input = document.querySelector('.dm-search-input');
          if (input) input.value = tag.dataset.keyword || tag.textContent.trim();
          runSearch();
        });
      });

      function setActiveMenu(link, dropdownItem) {
        document.querySelectorAll('.dm-nav-link.active').forEach(function (item) {
          item.classList.remove('active');
        });
        document.querySelectorAll('.dm-dropdown button.active').forEach(function (item) {
          item.classList.remove('active');
        });
        if (link) link.classList.add('active');
        if (dropdownItem) dropdownItem.classList.add('active');
      }

      document.querySelectorAll('.dm-nav-group').forEach(function (group) {
        var link = group.querySelector('.dm-nav-link');
        if (!link) return;
        link.addEventListener('click', function () {
          var isDropdown = !!group.querySelector('.dm-dropdown');
          setActiveMenu(link);
          document.querySelectorAll('.dm-nav-group.open').forEach(function (openGroup) {
            if (openGroup !== group) openGroup.classList.remove('open');
          });
          if (isDropdown) group.classList.toggle('open');
          if (!link.hasAttribute('data-dm-home')) showToast('原型仅完成首页：' + (link.dataset.dmMenu || link.textContent.trim()));
        });
      });

      document.querySelectorAll('.dm-dropdown button').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
          e.stopPropagation();
          var group = btn.closest('.dm-nav-group');
          var link = group ? group.querySelector('.dm-nav-link') : null;
          setActiveMenu(link, btn);
          if (group) group.classList.remove('open');
          showToast('原型仅完成首页：' + (btn.dataset.dmMenu || btn.textContent.trim()));
        });
      });

      document.addEventListener('click', function (e) {
        if (!e.target.closest('.dm-nav-group')) {
          document.querySelectorAll('.dm-nav-group.open').forEach(function (group) {
            group.classList.remove('open');
          });
        }
      });
    }
  };
})();
