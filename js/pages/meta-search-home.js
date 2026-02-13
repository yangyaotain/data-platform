/**
 * 数据中台 V4.0 - 元数据搜索首页
 * HTML模板 + 页面交互逻辑
 */
window.DP = window.DP || {};
DP.pages = DP.pages || {};

DP.pages.metaSearchHome = {

  /* HTML template - extracted from metaSearchHomeHTML */
  html: `
    <div class="page-meta-home">

      <!-- 顶部指标区 -->
      <div class="mh-stats-row">
        <div class="mh-stat-card">
          <div class="mh-stat-icon"><i class="bi bi-hdd-rack"></i></div>
          <div class="mh-stat-body">
            <div class="mh-stat-num">12</div>
            <div class="mh-stat-label">数据库实例数</div>
          </div>
        </div>
        <div class="mh-stat-card">
          <div class="mh-stat-icon"><i class="bi bi-database"></i></div>
          <div class="mh-stat-body">
            <div class="mh-stat-num">36</div>
            <div class="mh-stat-label">数据库数</div>
          </div>
        </div>
        <div class="mh-stat-card">
          <div class="mh-stat-icon"><i class="bi bi-table"></i></div>
          <div class="mh-stat-body">
            <div class="mh-stat-num">1,856</div>
            <div class="mh-stat-label">表数量</div>
          </div>
        </div>
        <div class="mh-stat-card">
          <div class="mh-stat-icon"><i class="bi bi-input-cursor-text"></i></div>
          <div class="mh-stat-body">
            <div class="mh-stat-num">42,380</div>
            <div class="mh-stat-label">字段数量</div>
          </div>
        </div>
        <div class="mh-stat-card">
          <div class="mh-stat-icon"><i class="bi bi-bar-chart-line"></i></div>
          <div class="mh-stat-body">
            <div class="mh-stat-num">18.6亿</div>
            <div class="mh-stat-label">数据记录数</div>
          </div>
        </div>
      </div>

      <!-- 搜索区 -->
      <div class="mh-search-area">
        <div class="mh-search-box">
          <input type="text" class="mh-search-input" placeholder="输入表名、字段名或描述关键字搜索...">
          <button class="btn btn-primary mh-search-btn" data-action="table-search"><i class="bi bi-table"></i> 表搜索</button>
          <button class="btn btn-outline mh-search-btn" data-action="field-search"><i class="bi bi-input-cursor-text"></i> 字段搜索</button>
        </div>
        <div class="mh-hot-tags">
          <span class="qt-label">热门搜索:</span>
          <a class="qt-tag mh-tag">订单</a>
          <a class="qt-tag mh-tag">用户</a>
          <a class="qt-tag mh-tag">支付</a>
          <a class="qt-tag mh-tag">商品</a>
          <a class="qt-tag mh-tag">库存</a>
          <a class="qt-tag mh-tag">物流</a>
          <a class="qt-tag mh-tag">画像</a>
          <a class="qt-tag mh-tag">报表</a>
        </div>
      </div>

      <!-- TAB卡片区 -->
      <div class="mh-tabs-area">
        <div class="mh-tabs">
          <a class="mh-tab active" data-tab="asset">资产卡片</a>
          <a class="mh-tab" data-tab="resource">资源目录</a>
          <a class="mh-tab" data-tab="datasource">数据源目录</a>
        </div>

        <!-- 资产卡片 -->
        <div class="mh-tab-content active" data-content="asset">
          <div class="mh-cards-grid">
            <div class="mh-card mh-card-clickable">
              <div class="mh-card-top">
                <span class="mh-card-tag tag-blue">ODS</span>
                <span class="mh-card-count">18 张表</span>
              </div>
              <div class="mh-card-title">订单数据</div>
              <div class="mh-card-desc">核心订单交易相关表，包括订单主表、明细、状态日志等</div>
              <div class="mh-card-meta"><span><i class="bi bi-person"></i> 张明</span><span><i class="bi bi-clock"></i> 2026-02-12</span></div>
            </div>
            <div class="mh-card mh-card-clickable">
              <div class="mh-card-top">
                <span class="mh-card-tag tag-blue">ODS</span>
                <span class="mh-card-count">12 张表</span>
              </div>
              <div class="mh-card-title">支付数据</div>
              <div class="mh-card-desc">支付流水、第三方支付回调、对账数据等</div>
              <div class="mh-card-meta"><span><i class="bi bi-person"></i> 李婷</span><span><i class="bi bi-clock"></i> 2026-02-11</span></div>
            </div>
            <div class="mh-card mh-card-clickable">
              <div class="mh-card-top">
                <span class="mh-card-tag tag-yellow">DWD</span>
                <span class="mh-card-count">15 张表</span>
              </div>
              <div class="mh-card-title">用户基础</div>
              <div class="mh-card-desc">用户注册信息、实名认证、账户状态、登录记录</div>
              <div class="mh-card-meta"><span><i class="bi bi-person"></i> 王强</span><span><i class="bi bi-clock"></i> 2026-02-12</span></div>
            </div>
            <div class="mh-card mh-card-clickable">
              <div class="mh-card-top">
                <span class="mh-card-tag tag-green">DWS</span>
                <span class="mh-card-count">12 张表</span>
              </div>
              <div class="mh-card-title">用户画像</div>
              <div class="mh-card-desc">用户标签、偏好分析、消费能力评级、活跃度指标</div>
              <div class="mh-card-meta"><span><i class="bi bi-person"></i> 王强</span><span><i class="bi bi-clock"></i> 2026-02-10</span></div>
            </div>
            <div class="mh-card mh-card-clickable">
              <div class="mh-card-top">
                <span class="mh-card-tag tag-blue">ODS</span>
                <span class="mh-card-count">16 张表</span>
              </div>
              <div class="mh-card-title">商品信息</div>
              <div class="mh-card-desc">商品主数据、SKU属性、分类、品牌、价格体系</div>
              <div class="mh-card-meta"><span><i class="bi bi-person"></i> 赵丽</span><span><i class="bi bi-clock"></i> 2026-02-12</span></div>
            </div>
            <div class="mh-card mh-card-clickable">
              <div class="mh-card-top">
                <span class="mh-card-tag tag-purple">ADS</span>
                <span class="mh-card-count">8 张表</span>
              </div>
              <div class="mh-card-title">营销报表</div>
              <div class="mh-card-desc">活动效果分析、优惠券核销、渠道ROI报表</div>
              <div class="mh-card-meta"><span><i class="bi bi-person"></i> 赵丽</span><span><i class="bi bi-clock"></i> 2026-02-11</span></div>
            </div>
            <div class="mh-card mh-card-clickable">
              <div class="mh-card-top">
                <span class="mh-card-tag tag-blue">ODS</span>
                <span class="mh-card-count">14 张表</span>
              </div>
              <div class="mh-card-title">物流配送</div>
              <div class="mh-card-desc">配送单、物流轨迹、签收记录、异常件处理</div>
              <div class="mh-card-meta"><span><i class="bi bi-person"></i> 张明</span><span><i class="bi bi-clock"></i> 2026-02-12</span></div>
            </div>
            <div class="mh-card mh-card-clickable">
              <div class="mh-card-top">
                <span class="mh-card-tag tag-yellow">DWD</span>
                <span class="mh-card-count">12 张表</span>
              </div>
              <div class="mh-card-title">库存管理</div>
              <div class="mh-card-desc">库存快照、出入库流水、库存预警、盘点记录</div>
              <div class="mh-card-meta"><span><i class="bi bi-person"></i> 李婷</span><span><i class="bi bi-clock"></i> 2026-02-11</span></div>
            </div>
          </div>
        </div>

        <!-- 资源目录 -->
        <div class="mh-tab-content" data-content="resource">
          <div class="mh-cards-grid">
            <div class="mh-card mh-card-clickable mh-card-folder">
              <div class="mh-card-icon"><i class="bi bi-folder2-open"></i></div>
              <div class="mh-card-title">交易域</div>
              <div class="mh-card-desc">42 张表 · 订单、支付、退款、结算</div>
            </div>
            <div class="mh-card mh-card-clickable mh-card-folder">
              <div class="mh-card-icon"><i class="bi bi-folder2-open"></i></div>
              <div class="mh-card-title">用户域</div>
              <div class="mh-card-desc">35 张表 · 用户基础、画像、行为日志</div>
            </div>
            <div class="mh-card mh-card-clickable mh-card-folder">
              <div class="mh-card-icon"><i class="bi bi-folder2-open"></i></div>
              <div class="mh-card-title">商品域</div>
              <div class="mh-card-desc">28 张表 · 商品信息、库存管理</div>
            </div>
            <div class="mh-card mh-card-clickable mh-card-folder">
              <div class="mh-card-icon"><i class="bi bi-folder2-open"></i></div>
              <div class="mh-card-title">物流域</div>
              <div class="mh-card-desc">22 张表 · 配送数据、仓储数据</div>
            </div>
            <div class="mh-card mh-card-clickable mh-card-folder">
              <div class="mh-card-icon"><i class="bi bi-folder2-open"></i></div>
              <div class="mh-card-title">营销域</div>
              <div class="mh-card-desc">18 张表 · 活动数据、优惠券</div>
            </div>
            <div class="mh-card mh-card-clickable mh-card-folder">
              <div class="mh-card-icon"><i class="bi bi-folder2-open"></i></div>
              <div class="mh-card-title">财务域</div>
              <div class="mh-card-desc">11 张表 · 应收应付、成本核算</div>
            </div>
          </div>
        </div>

        <!-- 数据源目录 -->
        <div class="mh-tab-content" data-content="datasource">
          <div class="mh-cards-grid">
            <div class="mh-card mh-card-clickable mh-card-db">
              <div class="mh-card-icon"><i class="bi bi-database"></i></div>
              <div class="mh-card-title">生产数据库</div>
              <div class="mh-card-desc">3 个实例 · prod_mysql_master, prod_mysql_slave, prod_postgresql</div>
            </div>
            <div class="mh-card mh-card-clickable mh-card-db">
              <div class="mh-card-icon"><i class="bi bi-database"></i></div>
              <div class="mh-card-title">数据仓库</div>
              <div class="mh-card-desc">4 个库 · dw_hive_ods, dw_hive_dwd, dw_hive_dws, dw_hive_ads</div>
            </div>
            <div class="mh-card mh-card-clickable mh-card-db">
              <div class="mh-card-icon"><i class="bi bi-database"></i></div>
              <div class="mh-card-title">业务系统</div>
              <div class="mh-card-desc">3 个库 · erp_oracle_db, crm_sqlserver, oa_mysql_db</div>
            </div>
            <div class="mh-card mh-card-clickable mh-card-db">
              <div class="mh-card-icon"><i class="bi bi-broadcast"></i></div>
              <div class="mh-card-title">实时数据源</div>
              <div class="mh-card-desc">2 个集群 · kafka_cluster_01, kafka_cluster_02</div>
            </div>
            <div class="mh-card mh-card-clickable mh-card-db">
              <div class="mh-card-icon"><i class="bi bi-cloud-download"></i></div>
              <div class="mh-card-title">外部数据接入</div>
              <div class="mh-card-desc">2 个接口 · api_weather_source, api_map_service</div>
            </div>
            <div class="mh-card mh-card-clickable mh-card-db">
              <div class="mh-card-icon"><i class="bi bi-hdd"></i></div>
              <div class="mh-card-title">测试环境</div>
              <div class="mh-card-desc">3 个库 · test_mysql_db, test_clickhouse, test_mongodb</div>
            </div>
            <div class="mh-card mh-card-clickable mh-card-db">
              <div class="mh-card-icon"><i class="bi bi-folder2"></i></div>
              <div class="mh-card-title">文件存储</div>
              <div class="mh-card-desc">2 个存储 · hdfs_data_lake, oss_archive</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  `,

  /* Page interaction init - extracted from initMetaSearchHome */
  init: function () {
    // tab 切换
    document.querySelectorAll('.mh-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.mh-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        document.querySelectorAll('.mh-tab-content').forEach(c => c.classList.remove('active'));
        const target = tab.dataset.tab;
        const content = document.querySelector(`.mh-tab-content[data-content="${target}"]`);
        if (content) content.classList.add('active');
      });
    });

    // 搜索按钮 → 进入二级搜索结果页
    document.querySelectorAll('.mh-search-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const input = document.querySelector('.mh-search-input');
        const keyword = input ? input.value.trim() : '';
        const action = btn.dataset.action;   // table-search / field-search
        DP.showPage('元数据搜索结果', { keyword, searchType: action });
      });
    });

    // 热门标签点击 → 搜索
    document.querySelectorAll('.mh-tag').forEach(tag => {
      tag.addEventListener('click', () => {
        DP.showPage('元数据搜索结果', { keyword: tag.textContent, searchType: 'table-search' });
      });
    });

    // 卡片点击 → 进入搜索结果页
    document.querySelectorAll('.mh-card-clickable').forEach(card => {
      card.addEventListener('click', () => {
        const title = card.querySelector('.mh-card-title')?.textContent || '';
        DP.showPage('元数据搜索结果', { keyword: title, searchType: 'table-search' });
      });
    });

    // Enter 键触发搜索
    const searchInput = document.querySelector('.mh-search-input');
    if (searchInput) {
      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const keyword = searchInput.value.trim();
          DP.showPage('元数据搜索结果', { keyword, searchType: 'table-search' });
        }
      });
    }
  }
};
