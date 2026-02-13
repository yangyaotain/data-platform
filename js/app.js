/* ============================================================
   数据中台 V4.0 - 菜单框架交互
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  const contentArea = document.getElementById('contentArea');

  // 缓存数据源页面 HTML（初始已在 DOM 中）
  const datasourcePageHTML = contentArea.innerHTML;

  /* ============================================================
     元数据搜索首页 HTML
     ============================================================ */
  const metaSearchHomeHTML = `
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
  `;

  /* ============================================================
     元数据检索结果页面 HTML
     ============================================================ */
  const metaSearchPageHTML = `
    <div class="page-meta-search">

      <!-- 顶部搜索区 -->
      <div class="ms-header">
        <div class="ms-header-top">
          <button class="btn btn-text ms-home-btn"><i class="bi bi-arrow-left"></i> 返回搜索首页</button>
          <div class="ms-search-tabs">
            <a class="ms-stab active" data-stype="table"><i class="bi bi-table"></i> 按表搜索</a>
            <a class="ms-stab" data-stype="field"><i class="bi bi-input-cursor-text"></i> 按字段搜索</a>
          </div>
        </div>
        <div class="ms-search-bar">
          <select class="ms-search-scope">
            <option>全部数据源</option>
            <option>生产数据库</option>
            <option>数据仓库</option>
            <option>业务系统</option>
          </select>
          <input type="text" class="ms-search-input" placeholder="输入表名、中文名或描述关键字搜索...">
          <button class="btn btn-primary"><i class="bi bi-search"></i> 搜索</button>
        </div>
        <div class="ms-quick-tags">
          <span class="qt-label">热门:</span>
          <a class="qt-tag">订单</a>
          <a class="qt-tag">用户</a>
          <a class="qt-tag">支付</a>
          <a class="qt-tag">商品</a>
          <a class="qt-tag">库存</a>
          <a class="qt-tag">物流</a>
        </div>
      </div>

      <!-- 主体区域 -->
      <div class="ms-body">

        <!-- 左侧：资源目录 -->
        <div class="ms-catalog">
          <div class="ms-catalog-tabs">
            <a class="ms-ctab active">资源目录</a>
            <a class="ms-ctab">数据源目录</a>
          </div>
          <!-- 资源目录树 -->
          <div class="ms-catalog-tree" id="msCatalogResource">
            <ul class="ms-tree">
              <li class="ms-tnode open">
                <span class="ms-toggle"><i class="bi bi-chevron-down"></i></span>
                <i class="bi bi-folder2-open ms-ticon"></i>
                <span class="ms-ttext">全部资产 (156)</span>
                <ul class="ms-tchildren">
                  <li class="ms-tnode open">
                    <span class="ms-toggle"><i class="bi bi-chevron-down"></i></span>
                    <i class="bi bi-folder2-open ms-ticon"></i>
                    <span class="ms-ttext">交易域 (42)</span>
                    <ul class="ms-tchildren">
                      <li class="ms-tnode active"><i class="bi bi-table ms-ticon-leaf"></i><span class="ms-ttext">订单数据 (18)</span></li>
                      <li class="ms-tnode"><i class="bi bi-table ms-ticon-leaf"></i><span class="ms-ttext">支付数据 (12)</span></li>
                      <li class="ms-tnode"><i class="bi bi-table ms-ticon-leaf"></i><span class="ms-ttext">退款数据 (8)</span></li>
                      <li class="ms-tnode"><i class="bi bi-table ms-ticon-leaf"></i><span class="ms-ttext">结算数据 (4)</span></li>
                    </ul>
                  </li>
                  <li class="ms-tnode">
                    <span class="ms-toggle"><i class="bi bi-chevron-right"></i></span>
                    <i class="bi bi-folder2 ms-ticon"></i>
                    <span class="ms-ttext">用户域 (35)</span>
                    <ul class="ms-tchildren">
                      <li class="ms-tnode"><i class="bi bi-table ms-ticon-leaf"></i><span class="ms-ttext">用户基础 (15)</span></li>
                      <li class="ms-tnode"><i class="bi bi-table ms-ticon-leaf"></i><span class="ms-ttext">用户画像 (12)</span></li>
                      <li class="ms-tnode"><i class="bi bi-table ms-ticon-leaf"></i><span class="ms-ttext">行为日志 (8)</span></li>
                    </ul>
                  </li>
                  <li class="ms-tnode">
                    <span class="ms-toggle"><i class="bi bi-chevron-right"></i></span>
                    <i class="bi bi-folder2 ms-ticon"></i>
                    <span class="ms-ttext">商品域 (28)</span>
                    <ul class="ms-tchildren">
                      <li class="ms-tnode"><i class="bi bi-table ms-ticon-leaf"></i><span class="ms-ttext">商品信息 (16)</span></li>
                      <li class="ms-tnode"><i class="bi bi-table ms-ticon-leaf"></i><span class="ms-ttext">库存管理 (12)</span></li>
                    </ul>
                  </li>
                  <li class="ms-tnode">
                    <span class="ms-toggle"><i class="bi bi-chevron-right"></i></span>
                    <i class="bi bi-folder2 ms-ticon"></i>
                    <span class="ms-ttext">物流域 (22)</span>
                    <ul class="ms-tchildren">
                      <li class="ms-tnode"><i class="bi bi-table ms-ticon-leaf"></i><span class="ms-ttext">配送数据 (14)</span></li>
                      <li class="ms-tnode"><i class="bi bi-table ms-ticon-leaf"></i><span class="ms-ttext">仓储数据 (8)</span></li>
                    </ul>
                  </li>
                  <li class="ms-tnode">
                    <span class="ms-toggle"><i class="bi bi-chevron-right"></i></span>
                    <i class="bi bi-folder2 ms-ticon"></i>
                    <span class="ms-ttext">营销域 (18)</span>
                    <ul class="ms-tchildren">
                      <li class="ms-tnode"><i class="bi bi-table ms-ticon-leaf"></i><span class="ms-ttext">活动数据 (10)</span></li>
                      <li class="ms-tnode"><i class="bi bi-table ms-ticon-leaf"></i><span class="ms-ttext">优惠券 (8)</span></li>
                    </ul>
                  </li>
                  <li class="ms-tnode">
                    <span class="ms-toggle"><i class="bi bi-chevron-right"></i></span>
                    <i class="bi bi-folder2 ms-ticon"></i>
                    <span class="ms-ttext">财务域 (11)</span>
                    <ul class="ms-tchildren">
                      <li class="ms-tnode"><i class="bi bi-table ms-ticon-leaf"></i><span class="ms-ttext">应收应付 (6)</span></li>
                      <li class="ms-tnode"><i class="bi bi-table ms-ticon-leaf"></i><span class="ms-ttext">成本核算 (5)</span></li>
                    </ul>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
          <!-- 数据源目录树 -->
          <div class="ms-catalog-tree" id="msCatalogDatasource" style="display:none;">
            <ul class="ms-tree">
              <li class="ms-tnode open">
                <span class="ms-toggle"><i class="bi bi-chevron-down"></i></span>
                <i class="bi bi-folder2-open ms-ticon"></i>
                <span class="ms-ttext">生产数据库 (3)</span>
                <ul class="ms-tchildren">
                  <li class="ms-tnode active"><i class="bi bi-database ms-ticon-leaf"></i><span class="ms-ttext">prod_mysql_master</span></li>
                  <li class="ms-tnode"><i class="bi bi-database ms-ticon-leaf"></i><span class="ms-ttext">prod_mysql_slave</span></li>
                  <li class="ms-tnode"><i class="bi bi-database ms-ticon-leaf"></i><span class="ms-ttext">prod_postgresql</span></li>
                </ul>
              </li>
              <li class="ms-tnode">
                <span class="ms-toggle"><i class="bi bi-chevron-right"></i></span>
                <i class="bi bi-folder2 ms-ticon"></i>
                <span class="ms-ttext">数据仓库 (4)</span>
                <ul class="ms-tchildren">
                  <li class="ms-tnode"><i class="bi bi-database ms-ticon-leaf"></i><span class="ms-ttext">dw_hive_ods</span></li>
                  <li class="ms-tnode"><i class="bi bi-database ms-ticon-leaf"></i><span class="ms-ttext">dw_hive_dwd</span></li>
                  <li class="ms-tnode"><i class="bi bi-database ms-ticon-leaf"></i><span class="ms-ttext">dw_hive_dws</span></li>
                  <li class="ms-tnode"><i class="bi bi-database ms-ticon-leaf"></i><span class="ms-ttext">dw_hive_ads</span></li>
                </ul>
              </li>
              <li class="ms-tnode">
                <span class="ms-toggle"><i class="bi bi-chevron-right"></i></span>
                <i class="bi bi-folder2 ms-ticon"></i>
                <span class="ms-ttext">业务系统 (3)</span>
                <ul class="ms-tchildren">
                  <li class="ms-tnode"><i class="bi bi-database ms-ticon-leaf"></i><span class="ms-ttext">erp_oracle_db</span></li>
                  <li class="ms-tnode"><i class="bi bi-database ms-ticon-leaf"></i><span class="ms-ttext">crm_sqlserver</span></li>
                  <li class="ms-tnode"><i class="bi bi-database ms-ticon-leaf"></i><span class="ms-ttext">oa_mysql_db</span></li>
                </ul>
              </li>
              <li class="ms-tnode">
                <span class="ms-toggle"><i class="bi bi-chevron-right"></i></span>
                <i class="bi bi-folder2 ms-ticon"></i>
                <span class="ms-ttext">实时数据源 (2)</span>
                <ul class="ms-tchildren">
                  <li class="ms-tnode"><i class="bi bi-database ms-ticon-leaf"></i><span class="ms-ttext">kafka_cluster_01</span></li>
                  <li class="ms-tnode"><i class="bi bi-database ms-ticon-leaf"></i><span class="ms-ttext">kafka_cluster_02</span></li>
                </ul>
              </li>
              <li class="ms-tnode">
                <span class="ms-toggle"><i class="bi bi-chevron-right"></i></span>
                <i class="bi bi-folder2 ms-ticon"></i>
                <span class="ms-ttext">外部数据接入 (2)</span>
                <ul class="ms-tchildren">
                  <li class="ms-tnode"><i class="bi bi-database ms-ticon-leaf"></i><span class="ms-ttext">api_weather_source</span></li>
                  <li class="ms-tnode"><i class="bi bi-database ms-ticon-leaf"></i><span class="ms-ttext">api_map_service</span></li>
                </ul>
              </li>
              <li class="ms-tnode">
                <i class="bi bi-database ms-ticon-leaf" style="margin-left:0"></i>
                <span class="ms-ttext">redis_cache_01</span>
              </li>
              <li class="ms-tnode">
                <span class="ms-toggle"><i class="bi bi-chevron-right"></i></span>
                <i class="bi bi-folder2 ms-ticon"></i>
                <span class="ms-ttext">测试环境 (3)</span>
                <ul class="ms-tchildren">
                  <li class="ms-tnode"><i class="bi bi-database ms-ticon-leaf"></i><span class="ms-ttext">test_mysql_db</span></li>
                  <li class="ms-tnode"><i class="bi bi-database ms-ticon-leaf"></i><span class="ms-ttext">test_clickhouse</span></li>
                  <li class="ms-tnode"><i class="bi bi-database ms-ticon-leaf"></i><span class="ms-ttext">test_mongodb</span></li>
                </ul>
              </li>
              <li class="ms-tnode">
                <span class="ms-toggle"><i class="bi bi-chevron-right"></i></span>
                <i class="bi bi-folder2 ms-ticon"></i>
                <span class="ms-ttext">文件存储 (2)</span>
                <ul class="ms-tchildren">
                  <li class="ms-tnode"><i class="bi bi-database ms-ticon-leaf"></i><span class="ms-ttext">hdfs_data_lake</span></li>
                  <li class="ms-tnode"><i class="bi bi-database ms-ticon-leaf"></i><span class="ms-ttext">oss_archive</span></li>
                </ul>
              </li>
            </ul>
          </div>
        </div>

        <!-- 右侧内容 -->
        <div class="ms-content">

          <!-- 资产卡片视图切换 -->
          <div class="ms-view-bar">
            <div class="ms-view-info">
              <span>共 <b>18</b> 张表</span>
              <span class="ms-view-sep">|</span>
              <span>交易域 / 订单数据</span>
            </div>
            <div class="ms-view-actions">
              <button class="btn btn-outline btn-sm ms-view-btn active" data-view="list"><i class="bi bi-list-ul"></i> 列表</button>
              <button class="btn btn-outline btn-sm ms-view-btn" data-view="card"><i class="bi bi-grid-3x3-gap"></i> 卡片</button>
            </div>
          </div>

          <!-- 列表视图 -->
          <div class="ms-list-view" id="msListView">
            <table class="ds-table">
              <thead>
                <tr>
                  <th>表名</th>
                  <th>中文名称</th>
                  <th>数据源</th>
                  <th>数仓分层</th>
                  <th>记录数</th>
                  <th>负责人</th>
                  <th>更新时间</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr class="ms-row-clickable">
                  <td class="td-link">order_main</td>
                  <td>订单主表</td>
                  <td>prod_mysql_master</td>
                  <td><span class="tag tag-blue">ODS</span></td>
                  <td>1,438,920</td>
                  <td>张明</td>
                  <td>2026-02-12 08:30</td>
                  <td class="td-actions">
                    <i class="bi bi-eye" title="查看详情"></i>
                    <i class="bi bi-diagram-2" title="血缘关系"></i>
                    <i class="bi bi-shield-lock" title="申请权限"></i>
                  </td>
                </tr>
                <tr class="ms-row-clickable">
                  <td class="td-link">order_detail</td>
                  <td>订单明细表</td>
                  <td>prod_mysql_master</td>
                  <td><span class="tag tag-blue">ODS</span></td>
                  <td>3,892,105</td>
                  <td>张明</td>
                  <td>2026-02-12 08:30</td>
                  <td class="td-actions">
                    <i class="bi bi-eye"></i><i class="bi bi-diagram-2"></i><i class="bi bi-shield-lock"></i>
                  </td>
                </tr>
                <tr class="ms-row-clickable">
                  <td class="td-link">order_status_log</td>
                  <td>订单状态变更日志</td>
                  <td>prod_mysql_master</td>
                  <td><span class="tag tag-yellow">DWD</span></td>
                  <td>5,620,340</td>
                  <td>李婷</td>
                  <td>2026-02-11 22:15</td>
                  <td class="td-actions">
                    <i class="bi bi-eye"></i><i class="bi bi-diagram-2"></i><i class="bi bi-shield-lock"></i>
                  </td>
                </tr>
                <tr class="ms-row-clickable">
                  <td class="td-link">dwd_order_fact</td>
                  <td>订单事实宽表</td>
                  <td>dw_hive_dwd</td>
                  <td><span class="tag tag-yellow">DWD</span></td>
                  <td>1,438,920</td>
                  <td>王强</td>
                  <td>2026-02-12 06:00</td>
                  <td class="td-actions">
                    <i class="bi bi-eye"></i><i class="bi bi-diagram-2"></i><i class="bi bi-shield-lock"></i>
                  </td>
                </tr>
                <tr class="ms-row-clickable">
                  <td class="td-link">dws_order_daily</td>
                  <td>订单日汇总表</td>
                  <td>dw_hive_dws</td>
                  <td><span class="tag tag-green">DWS</span></td>
                  <td>12,580</td>
                  <td>王强</td>
                  <td>2026-02-12 07:00</td>
                  <td class="td-actions">
                    <i class="bi bi-eye"></i><i class="bi bi-diagram-2"></i><i class="bi bi-shield-lock"></i>
                  </td>
                </tr>
                <tr class="ms-row-clickable">
                  <td class="td-link">ads_order_overview</td>
                  <td>订单概览报表</td>
                  <td>dw_hive_ads</td>
                  <td><span class="tag tag-purple">ADS</span></td>
                  <td>365</td>
                  <td>赵丽</td>
                  <td>2026-02-12 07:30</td>
                  <td class="td-actions">
                    <i class="bi bi-eye"></i><i class="bi bi-diagram-2"></i><i class="bi bi-shield-lock"></i>
                  </td>
                </tr>
                <tr class="ms-row-clickable">
                  <td class="td-link">order_refund</td>
                  <td>订单退款记录</td>
                  <td>prod_mysql_master</td>
                  <td><span class="tag tag-blue">ODS</span></td>
                  <td>89,450</td>
                  <td>李婷</td>
                  <td>2026-02-11 23:45</td>
                  <td class="td-actions">
                    <i class="bi bi-eye"></i><i class="bi bi-diagram-2"></i><i class="bi bi-shield-lock"></i>
                  </td>
                </tr>
                <tr class="ms-row-clickable">
                  <td class="td-link">order_address</td>
                  <td>收货地址表</td>
                  <td>prod_mysql_master</td>
                  <td><span class="tag tag-blue">ODS</span></td>
                  <td>528,630</td>
                  <td>张明</td>
                  <td>2026-02-12 08:30</td>
                  <td class="td-actions">
                    <i class="bi bi-eye"></i><i class="bi bi-diagram-2"></i><i class="bi bi-shield-lock"></i>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- 卡片视图 -->
          <div class="ms-card-view" id="msCardView" style="display:none;">
            <div class="ms-cards-grid">
              <div class="ms-asset-card ms-row-clickable">
                <div class="ac-header"><i class="bi bi-table"></i> order_main</div>
                <div class="ac-title">订单主表</div>
                <div class="ac-meta"><span><i class="bi bi-database"></i> prod_mysql_master</span><span><i class="bi bi-layers"></i> ODS</span></div>
                <div class="ac-stats"><span>记录数: <b>1,438,920</b></span><span>字段数: <b>32</b></span></div>
                <div class="ac-footer"><span class="ac-owner"><i class="bi bi-person"></i> 张明</span><span class="ac-time">2026-02-12</span></div>
              </div>
              <div class="ms-asset-card ms-row-clickable">
                <div class="ac-header"><i class="bi bi-table"></i> order_detail</div>
                <div class="ac-title">订单明细表</div>
                <div class="ac-meta"><span><i class="bi bi-database"></i> prod_mysql_master</span><span><i class="bi bi-layers"></i> ODS</span></div>
                <div class="ac-stats"><span>记录数: <b>3,892,105</b></span><span>字段数: <b>28</b></span></div>
                <div class="ac-footer"><span class="ac-owner"><i class="bi bi-person"></i> 张明</span><span class="ac-time">2026-02-12</span></div>
              </div>
              <div class="ms-asset-card ms-row-clickable">
                <div class="ac-header"><i class="bi bi-table"></i> order_status_log</div>
                <div class="ac-title">订单状态变更日志</div>
                <div class="ac-meta"><span><i class="bi bi-database"></i> prod_mysql_master</span><span><i class="bi bi-layers"></i> DWD</span></div>
                <div class="ac-stats"><span>记录数: <b>5,620,340</b></span><span>字段数: <b>15</b></span></div>
                <div class="ac-footer"><span class="ac-owner"><i class="bi bi-person"></i> 李婷</span><span class="ac-time">2026-02-11</span></div>
              </div>
              <div class="ms-asset-card ms-row-clickable">
                <div class="ac-header"><i class="bi bi-table"></i> dwd_order_fact</div>
                <div class="ac-title">订单事实宽表</div>
                <div class="ac-meta"><span><i class="bi bi-database"></i> dw_hive_dwd</span><span><i class="bi bi-layers"></i> DWD</span></div>
                <div class="ac-stats"><span>记录数: <b>1,438,920</b></span><span>字段数: <b>56</b></span></div>
                <div class="ac-footer"><span class="ac-owner"><i class="bi bi-person"></i> 王强</span><span class="ac-time">2026-02-12</span></div>
              </div>
              <div class="ms-asset-card ms-row-clickable">
                <div class="ac-header"><i class="bi bi-table"></i> dws_order_daily</div>
                <div class="ac-title">订单日汇总表</div>
                <div class="ac-meta"><span><i class="bi bi-database"></i> dw_hive_dws</span><span><i class="bi bi-layers"></i> DWS</span></div>
                <div class="ac-stats"><span>记录数: <b>12,580</b></span><span>字段数: <b>24</b></span></div>
                <div class="ac-footer"><span class="ac-owner"><i class="bi bi-person"></i> 王强</span><span class="ac-time">2026-02-12</span></div>
              </div>
              <div class="ms-asset-card ms-row-clickable">
                <div class="ac-header"><i class="bi bi-table"></i> ads_order_overview</div>
                <div class="ac-title">订单概览报表</div>
                <div class="ac-meta"><span><i class="bi bi-database"></i> dw_hive_ads</span><span><i class="bi bi-layers"></i> ADS</span></div>
                <div class="ac-stats"><span>记录数: <b>365</b></span><span>字段数: <b>18</b></span></div>
                <div class="ac-footer"><span class="ac-owner"><i class="bi bi-person"></i> 赵丽</span><span class="ac-time">2026-02-12</span></div>
              </div>
            </div>
          </div>

          <!-- 表详情面板（默认隐藏，点击表名后显示） -->
          <div class="ms-detail-panel" id="msDetailPanel" style="display:none;">
            <div class="ms-detail-header">
              <button class="btn btn-outline btn-sm ms-back-btn"><i class="bi bi-arrow-left"></i> 返回列表</button>
              <span class="ms-detail-title" id="msDetailTitle">order_main — 订单主表</span>
              <div class="ms-detail-acts">
                <button class="btn btn-primary btn-sm"><i class="bi bi-shield-lock"></i> 申请表权限</button>
                <button class="btn btn-outline btn-sm"><i class="bi bi-key"></i> 申请字段权限</button>
              </div>
            </div>
            <div class="ms-detail-tabs">
              <a class="ms-dtab active" data-tab="meta-info">元数据详情</a>
              <a class="ms-dtab" data-tab="structure">表结构</a>
              <a class="ms-dtab" data-tab="standard">标准稽查</a>
              <a class="ms-dtab" data-tab="preview">数据预览</a>
              <a class="ms-dtab" data-tab="lineage">血缘关系</a>
              <a class="ms-dtab" data-tab="quality">数据质量</a>
              <a class="ms-dtab" data-tab="security">数据安全</a>
              <a class="ms-dtab" data-tab="history">历史版本</a>
            </div>
            <div class="ms-detail-body" id="msDetailBody">
              <!-- 元数据详情 -->
              <div class="ms-tab-content active" data-content="meta-info">
                <div class="ms-info-grid">
                  <div class="ms-info-item"><span class="info-label">表名</span><span class="info-value">order_main</span></div>
                  <div class="ms-info-item"><span class="info-label">中文名称</span><span class="info-value">订单主表</span></div>
                  <div class="ms-info-item"><span class="info-label">数据源</span><span class="info-value">prod_mysql_master</span></div>
                  <div class="ms-info-item"><span class="info-label">数仓分层</span><span class="info-value">ODS</span></div>
                  <div class="ms-info-item"><span class="info-label">存储引擎</span><span class="info-value">InnoDB</span></div>
                  <div class="ms-info-item"><span class="info-label">字符集</span><span class="info-value">utf8mb4</span></div>
                  <div class="ms-info-item"><span class="info-label">记录数</span><span class="info-value">1,438,920</span></div>
                  <div class="ms-info-item"><span class="info-label">数据量</span><span class="info-value">2.8 GB</span></div>
                  <div class="ms-info-item"><span class="info-label">负责人</span><span class="info-value">张明</span></div>
                  <div class="ms-info-item"><span class="info-label">创建时间</span><span class="info-value">2024-06-15 10:30:00</span></div>
                  <div class="ms-info-item"><span class="info-label">更新时间</span><span class="info-value">2026-02-12 08:30:00</span></div>
                  <div class="ms-info-item"><span class="info-label">描述</span><span class="info-value">核心订单主表，记录所有订单基础信息</span></div>
                </div>
              </div>
              <!-- 表结构 -->
              <div class="ms-tab-content" data-content="structure">
                <table class="ds-table">
                  <thead><tr><th>序号</th><th>字段名</th><th>中文名</th><th>类型</th><th>长度</th><th>允许空</th><th>主键</th><th>描述</th></tr></thead>
                  <tbody>
                    <tr><td>1</td><td class="td-link">order_id</td><td>订单编号</td><td>bigint</td><td>20</td><td>否</td><td><i class="bi bi-key-fill" style="color:#faad14"></i></td><td>订单唯一标识</td></tr>
                    <tr><td>2</td><td class="td-link">user_id</td><td>用户ID</td><td>bigint</td><td>20</td><td>否</td><td>-</td><td>下单用户ID</td></tr>
                    <tr><td>3</td><td class="td-link">order_no</td><td>订单号</td><td>varchar</td><td>64</td><td>否</td><td>-</td><td>业务订单号</td></tr>
                    <tr><td>4</td><td class="td-link">order_status</td><td>订单状态</td><td>tinyint</td><td>4</td><td>否</td><td>-</td><td>0待付款 1已付款 2已发货 3已完成</td></tr>
                    <tr><td>5</td><td class="td-link">total_amount</td><td>订单总金额</td><td>decimal</td><td>12,2</td><td>否</td><td>-</td><td>订单应付总额</td></tr>
                    <tr><td>6</td><td class="td-link">pay_amount</td><td>实付金额</td><td>decimal</td><td>12,2</td><td>是</td><td>-</td><td>用户实际支付金额</td></tr>
                    <tr><td>7</td><td class="td-link">pay_time</td><td>支付时间</td><td>datetime</td><td>-</td><td>是</td><td>-</td><td>支付完成时间</td></tr>
                    <tr><td>8</td><td class="td-link">create_time</td><td>创建时间</td><td>datetime</td><td>-</td><td>否</td><td>-</td><td>订单创建时间</td></tr>
                    <tr><td>9</td><td class="td-link">update_time</td><td>更新时间</td><td>datetime</td><td>-</td><td>否</td><td>-</td><td>最后更新时间</td></tr>
                  </tbody>
                </table>
              </div>
              <!-- 标准稽查 -->
              <div class="ms-tab-content" data-content="standard">
                <div class="ms-empty-hint"><p>标准映射关系与稽查结果</p>
                  <table class="ds-table" style="margin-top:12px;">
                    <thead><tr><th>字段名</th><th>标准编码</th><th>标准名称</th><th>映射状态</th><th>稽查结果</th></tr></thead>
                    <tbody>
                      <tr><td>order_id</td><td>STD_ORDER_001</td><td>订单标识</td><td><span class="tag tag-green">已映射</span></td><td><span class="tag tag-green">通过</span></td></tr>
                      <tr><td>user_id</td><td>STD_USER_001</td><td>用户标识</td><td><span class="tag tag-green">已映射</span></td><td><span class="tag tag-green">通过</span></td></tr>
                      <tr><td>order_status</td><td>STD_STATUS_002</td><td>订单状态码</td><td><span class="tag tag-green">已映射</span></td><td><span class="tag tag-yellow">告警</span></td></tr>
                      <tr><td>total_amount</td><td>-</td><td>-</td><td><span class="tag tag-red">未映射</span></td><td>-</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <!-- 数据预览 -->
              <div class="ms-tab-content" data-content="preview">
                <div class="ms-preview-toolbar"><span class="ms-preview-info">前 5 条记录预览</span></div>
                <table class="ds-table">
                  <thead><tr><th>order_id</th><th>user_id</th><th>order_no</th><th>order_status</th><th>total_amount</th><th>pay_amount</th><th>pay_time</th><th>create_time</th></tr></thead>
                  <tbody>
                    <tr><td>100001</td><td>50821</td><td>ORD20260212001</td><td>3</td><td>299.00</td><td>279.00</td><td>2026-02-12 09:15</td><td>2026-02-12 09:10</td></tr>
                    <tr><td>100002</td><td>32156</td><td>ORD20260212002</td><td>1</td><td>1580.00</td><td>1580.00</td><td>2026-02-12 09:22</td><td>2026-02-12 09:20</td></tr>
                    <tr><td>100003</td><td>78432</td><td>ORD20260212003</td><td>0</td><td>68.50</td><td>NULL</td><td>NULL</td><td>2026-02-12 09:35</td></tr>
                    <tr><td>100004</td><td>12890</td><td>ORD20260212004</td><td>2</td><td>4350.00</td><td>4200.00</td><td>2026-02-12 08:50</td><td>2026-02-12 08:45</td></tr>
                    <tr><td>100005</td><td>65213</td><td>ORD20260212005</td><td>3</td><td>128.00</td><td>118.00</td><td>2026-02-11 22:30</td><td>2026-02-11 22:25</td></tr>
                  </tbody>
                </table>
              </div>
              <!-- 血缘关系 -->
              <div class="ms-tab-content" data-content="lineage">
                <div class="ms-lineage-diagram">
                  <div class="lineage-col">
                    <div class="lineage-title">上游来源</div>
                    <div class="lineage-node ln-src">erp_order_raw</div>
                    <div class="lineage-node ln-src">payment_callback_log</div>
                    <div class="lineage-node ln-src">user_address_info</div>
                  </div>
                  <div class="lineage-arrows"><i class="bi bi-arrow-right"></i></div>
                  <div class="lineage-col">
                    <div class="lineage-title">当前表</div>
                    <div class="lineage-node ln-cur">order_main</div>
                  </div>
                  <div class="lineage-arrows"><i class="bi bi-arrow-right"></i></div>
                  <div class="lineage-col">
                    <div class="lineage-title">下游消费</div>
                    <div class="lineage-node ln-dst">dwd_order_fact</div>
                    <div class="lineage-node ln-dst">dws_order_daily</div>
                    <div class="lineage-node ln-dst">ads_order_overview</div>
                    <div class="lineage-node ln-dst">ads_gmv_summary</div>
                  </div>
                </div>
              </div>
              <!-- 数据质量 -->
              <div class="ms-tab-content" data-content="quality">
                <div class="ms-quality-sub-tabs">
                  <a class="ms-qtab active">质量规则</a>
                  <a class="ms-qtab">质量报告</a>
                </div>
                <table class="ds-table" style="margin-top:10px;">
                  <thead><tr><th>规则名称</th><th>规则类型</th><th>检测字段</th><th>规则描述</th><th>最近结果</th><th>通过率</th></tr></thead>
                  <tbody>
                    <tr><td>非空校验</td><td>完整性</td><td>order_id</td><td>主键不允许为空</td><td><span class="tag tag-green">通过</span></td><td>100%</td></tr>
                    <tr><td>非空校验</td><td>完整性</td><td>user_id</td><td>用户ID不允许为空</td><td><span class="tag tag-green">通过</span></td><td>100%</td></tr>
                    <tr><td>范围校验</td><td>准确性</td><td>total_amount</td><td>金额大于0</td><td><span class="tag tag-green">通过</span></td><td>99.97%</td></tr>
                    <tr><td>枚举校验</td><td>一致性</td><td>order_status</td><td>状态值在0-3范围内</td><td><span class="tag tag-yellow">告警</span></td><td>99.82%</td></tr>
                    <tr><td>唯一性校验</td><td>唯一性</td><td>order_no</td><td>订单号全局唯一</td><td><span class="tag tag-green">通过</span></td><td>100%</td></tr>
                  </tbody>
                </table>
              </div>
              <!-- 数据安全 -->
              <div class="ms-tab-content" data-content="security">
                <div class="ms-quality-sub-tabs">
                  <a class="ms-qtab active">脱敏规则</a>
                  <a class="ms-qtab">加密规则</a>
                </div>
                <table class="ds-table" style="margin-top:10px;">
                  <thead><tr><th>字段名</th><th>安全等级</th><th>规则类型</th><th>规则描述</th><th>状态</th></tr></thead>
                  <tbody>
                    <tr><td>user_id</td><td><span class="tag tag-yellow">L2-敏感</span></td><td>脱敏</td><td>用户ID部分遮蔽显示</td><td><span class="tag tag-green">已启用</span></td></tr>
                    <tr><td>pay_amount</td><td><span class="tag tag-red">L3-机密</span></td><td>加密</td><td>AES-256 加密存储</td><td><span class="tag tag-green">已启用</span></td></tr>
                  </tbody>
                </table>
              </div>
              <!-- 历史版本 -->
              <div class="ms-tab-content" data-content="history">
                <table class="ds-table">
                  <thead><tr><th>版本号</th><th>变更类型</th><th>变更内容</th><th>操作人</th><th>变更时间</th></tr></thead>
                  <tbody>
                    <tr><td>v3.2</td><td><span class="tag tag-blue">结构变更</span></td><td>新增字段 coupon_id</td><td>张明</td><td>2026-02-10 14:20</td></tr>
                    <tr><td>v3.1</td><td><span class="tag tag-yellow">配置变更</span></td><td>修改 total_amount 精度为 12,2</td><td>王强</td><td>2026-01-28 09:15</td></tr>
                    <tr><td>v3.0</td><td><span class="tag tag-blue">结构变更</span></td><td>新增字段 pay_channel</td><td>张明</td><td>2026-01-15 16:40</td></tr>
                    <tr><td>v2.0</td><td><span class="tag tag-purple">重构</span></td><td>表结构重构，拆分明细到 order_detail</td><td>李婷</td><td>2025-11-20 10:00</td></tr>
                    <tr><td>v1.0</td><td><span class="tag tag-green">创建</span></td><td>初始创建订单主表</td><td>张明</td><td>2024-06-15 10:30</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  `;

  /* ---- 页面渲染工具 ---- */
  function showPage(menuKey, opts) {
    if (menuKey === 'datasource') {
      contentArea.innerHTML = datasourcePageHTML;
      initDatasourcePage();
    } else if (menuKey === '元数据搜索') {
      // 默认显示搜索首页
      contentArea.innerHTML = metaSearchHomeHTML;
      initMetaSearchHome();
    } else if (menuKey === '元数据搜索结果') {
      // 搜索结果页（二级）
      contentArea.innerHTML = metaSearchPageHTML;
      initMetaSearchPage(opts);
    } else {
      const activeNav = document.querySelector('.nav-item.active');
      const navName = activeNav?.textContent?.trim() || '';
      const menuName = menuKey || '';
      contentArea.innerHTML = `
        <div class="content-placeholder">
          <div class="placeholder-icon"><i class="bi bi-easel"></i></div>
          <h2>${navName} — ${menuName}</h2>
          <p>页面内容待设计，当前选中：${menuName}。</p>
        </div>`;
    }
  }

  function showPlaceholder(title) {
    contentArea.innerHTML = `
      <div class="content-placeholder">
        <div class="placeholder-icon"><i class="bi bi-easel"></i></div>
        <h2>${title}</h2>
        <p>页面内容待设计，请选择左侧菜单项进行导航。</p>
      </div>`;
  }

  /* ---- 顶部导航切换 ---- */
  const navItems = document.querySelectorAll('.nav-item');
  const menuGroups = document.querySelectorAll('.menu-group');

  const navNames = {
    workbench: '控制台', governance: '数据资产', develop: '数据开发',
    explore: '数据探索', service: '数据服务',
    permission: '权限管理', analysis: '数据分析',
    monitor: '运维监控', datamap: '数据地图',
    panorama: '全景视图', help: '帮助文档',
  };

  // 菜单组与顶部导航的映射
  const menuGroupMap = {
    workbench: 'menuWorkbench',
    governance: 'menuGovernance',
    develop: 'menuDevelop',
    explore: 'menuExplore',
    service: 'menuService',
    monitor: 'menuMonitor',
    permission: 'menuPermission',
    analysis: 'menuAnalysis',
    datamap: 'menuDatamap',
    panorama: 'menuPanorama',
    help: 'menuHelp',
  };

  // 菜单组附带的额外组件（如项目选择器）
  const menuGroupExtraMap = {
    develop: 'devProjectSelector',
    explore: 'devProjectSelector',
  };

  function switchMenuGroup(page) {
    // 隐藏所有菜单组
    menuGroups.forEach(g => g.style.display = 'none');
    // 隐藏所有额外组件
    document.querySelectorAll('.menu-group-extra').forEach(e => e.style.display = 'none');
    // 显示对应菜单组
    const targetId = menuGroupMap[page];
    if (targetId) {
      const target = document.getElementById(targetId);
      if (target) target.style.display = 'block';
    }
    // 显示对应额外组件
    const extraId = menuGroupExtraMap[page];
    if (extraId) {
      const extra = document.getElementById(extraId);
      if (extra) extra.style.display = 'block';
    }
    // 清除所有菜单激活状态
    document.querySelectorAll('.menu-link.active').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.sub-menu li a.active').forEach(el => el.classList.remove('active'));
    // 关闭展开的子菜单
    document.querySelectorAll('.menu-item.open').forEach(el => el.classList.remove('open'));
  }

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      navItems.forEach(n => n.classList.remove('active'));
      item.classList.add('active');
      const page = item.dataset.page;
      const name = navNames[page] || page;

      // 切换菜单组
      switchMenuGroup(page);

      if (page === 'governance') {
        const dsLink = document.querySelector('[data-menu="datasource"]');
        if (dsLink) dsLink.classList.add('active');
        showPage('datasource');
      } else {
        // 通用逻辑：激活第一个菜单项，若有子菜单则展开并选中第一个子项
        const groupId = menuGroupMap[page];
        if (groupId) {
          const group = document.getElementById(groupId);
          if (group) {
            const firstItem = group.querySelector('.menu-item');
            if (firstItem && firstItem.classList.contains('has-sub')) {
              // 展开第一个有子菜单的项
              firstItem.classList.add('open');
              const firstSub = firstItem.querySelector('.sub-menu li a');
              if (firstSub) {
                firstSub.classList.add('active');
                showPlaceholder(firstSub.textContent);
              } else {
                showPlaceholder(name);
              }
            } else if (firstItem) {
              const firstLink = firstItem.querySelector('.menu-link');
              if (firstLink) {
                firstLink.classList.add('active');
                showPlaceholder(firstLink.querySelector('span')?.textContent || name);
              }
            } else {
              showPlaceholder(name);
            }
          } else {
            showPlaceholder(name);
          }
        } else {
          showPlaceholder(name);
        }
      }
    });
  });

  /* ---- 左侧菜单交互 ---- */
  const menuItems = document.querySelectorAll('.side-menu > .menu-item');

  menuItems.forEach(item => {
    const link = item.querySelector('.menu-link');
    link.addEventListener('click', () => {
      if (item.classList.contains('has-sub')) {
        item.classList.toggle('open');
      } else {
        setActiveMenu(link);
        const menuKey = link.dataset.menu || '';
        const menuText = link.querySelector('span')?.textContent || '';
        if (menuKey === 'datasource') {
          showPage('datasource');
        } else {
          showPage(menuText);
        }
      }
    });
  });

  document.querySelectorAll('.sub-menu li a').forEach(link => {
    link.addEventListener('click', (e) => {
      e.stopPropagation();
      setActiveMenu(link);
      showPage(link.textContent);
    });
  });

  function setActiveMenu(activeEl) {
    document.querySelectorAll('.menu-link.active').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.sub-menu li a.active').forEach(el => el.classList.remove('active'));
    activeEl.classList.add('active');
  }

  /* ---- 侧边栏收起/展开 ---- */
  const sidebar = document.getElementById('sidebar');
  const sidebarToggle = document.getElementById('sidebarToggle');
  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
    });
  }

  document.querySelectorAll('.menu-link').forEach(link => {
    const text = link.querySelector('span')?.textContent || '';
    link.setAttribute('data-tooltip', text);
  });

  /* ============================================================
     数据源页面 - 交互
     ============================================================ */
  function initDatasourcePage() {
    document.querySelectorAll('.ds-tree .tree-toggle').forEach(toggle => {
      toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        toggle.closest('.tree-node')?.classList.toggle('open');
      });
    });
    document.querySelectorAll('.ds-tree .tree-node').forEach(node => {
      node.addEventListener('click', () => {
        if (!node.querySelector('.tree-children')) {
          document.querySelectorAll('.ds-tree .tree-node.active').forEach(n => n.classList.remove('active'));
          node.classList.add('active');
        }
      });
    });
    document.querySelectorAll('.ds-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.ds-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
      });
    });
  }

  /* ============================================================
     元数据检索页面 - 交互
     ============================================================ */
  function initMetaSearchPage(opts) {
    opts = opts || {};
    // 填入从首页传来的关键词
    if (opts.keyword) {
      const input = document.querySelector('.ms-search-input');
      if (input) input.value = opts.keyword;
    }
    // 根据搜索类型激活对应tab
    if (opts.searchType === 'field-search') {
      const fieldTab = document.querySelector('.ms-stab[data-stype="field"]');
      if (fieldTab) {
        document.querySelectorAll('.ms-stab').forEach(t => t.classList.remove('active'));
        fieldTab.classList.add('active');
      }
    }

    // 返回搜索首页
    const homeBtn = document.querySelector('.ms-home-btn');
    if (homeBtn) {
      homeBtn.addEventListener('click', () => {
        showPage('元数据搜索');
      });
    }

    // 搜索类型 tab
    document.querySelectorAll('.ms-stab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.ms-stab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const input = document.querySelector('.ms-search-input');
        if (input) input.placeholder = tab.dataset.stype === 'field' ? '输入字段名或描述关键字搜索...' : '输入表名、中文名或描述关键字搜索...';
      });
    });

    // 目录 tab 切换（资源目录 / 数据源目录）
    document.querySelectorAll('.ms-ctab').forEach((tab, idx) => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.ms-ctab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const resTree = document.getElementById('msCatalogResource');
        const dsTree = document.getElementById('msCatalogDatasource');
        if (idx === 0) {
          if (resTree) resTree.style.display = '';
          if (dsTree) dsTree.style.display = 'none';
        } else {
          if (resTree) resTree.style.display = 'none';
          if (dsTree) dsTree.style.display = '';
        }
        // 重新绑定树交互
        bindTreeInteraction();
      });
    });

    // 绑定树交互
    function bindTreeInteraction() {
      document.querySelectorAll('.ms-tree .ms-toggle').forEach(toggle => {
        toggle.replaceWith(toggle.cloneNode(true));
      });
      document.querySelectorAll('.ms-tree .ms-toggle').forEach(toggle => {
        toggle.addEventListener('click', (e) => {
          e.stopPropagation();
          toggle.closest('.ms-tnode')?.classList.toggle('open');
        });
      });
      document.querySelectorAll('.ms-tree .ms-tnode').forEach(node => {
        node.addEventListener('click', (e) => {
          e.stopPropagation();
          if (!node.querySelector('.ms-tchildren')) {
            document.querySelectorAll('.ms-tree .ms-tnode.active').forEach(n => n.classList.remove('active'));
            node.classList.add('active');
          }
        });
      });
    }
    bindTreeInteraction();

    // 列表/卡片视图切换
    document.querySelectorAll('.ms-view-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.ms-view-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const list = document.getElementById('msListView');
        const card = document.getElementById('msCardView');
        const detail = document.getElementById('msDetailPanel');
        if (btn.dataset.view === 'card') {
          if (list) list.style.display = 'none';
          if (card) card.style.display = 'block';
          if (detail) detail.style.display = 'none';
        } else {
          if (list) list.style.display = 'block';
          if (card) card.style.display = 'none';
          if (detail) detail.style.display = 'none';
        }
      });
    });

    // 点击表名或卡片进入详情
    document.querySelectorAll('.ms-row-clickable').forEach(row => {
      row.addEventListener('click', () => {
        const list = document.getElementById('msListView');
        const card = document.getElementById('msCardView');
        const detail = document.getElementById('msDetailPanel');
        const viewBar = document.querySelector('.ms-view-bar');
        if (list) list.style.display = 'none';
        if (card) card.style.display = 'none';
        if (viewBar) viewBar.style.display = 'none';
        if (detail) detail.style.display = 'flex';
      });
    });

    // 返回列表
    const backBtn = document.querySelector('.ms-back-btn');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        const list = document.getElementById('msListView');
        const card = document.getElementById('msCardView');
        const detail = document.getElementById('msDetailPanel');
        const viewBar = document.querySelector('.ms-view-bar');
        const activeView = document.querySelector('.ms-view-btn.active');
        if (detail) detail.style.display = 'none';
        if (viewBar) viewBar.style.display = 'flex';
        if (activeView?.dataset.view === 'card') {
          if (card) card.style.display = 'block';
        } else {
          if (list) list.style.display = 'block';
        }
      });
    }

    // 详情 tab 切换
    document.querySelectorAll('.ms-dtab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.ms-dtab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const target = tab.dataset.tab;
        document.querySelectorAll('.ms-tab-content').forEach(c => c.classList.remove('active'));
        const content = document.querySelector(`.ms-tab-content[data-content="${target}"]`);
        if (content) content.classList.add('active');
      });
    });

    // 质量/安全 子tab
    document.querySelectorAll('.ms-qtab').forEach(tab => {
      tab.addEventListener('click', () => {
        const parent = tab.closest('.ms-quality-sub-tabs');
        if (parent) parent.querySelectorAll('.ms-qtab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
      });
    });

    // 热门标签点击
    document.querySelectorAll('.qt-tag').forEach(tag => {
      tag.addEventListener('click', () => {
        const input = document.querySelector('.ms-search-input');
        if (input) input.value = tag.textContent;
      });
    });
  }

  /* ============================================================
     元数据搜索首页交互
     ============================================================ */
  function initMetaSearchHome() {

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
        showPage('元数据搜索结果', { keyword, searchType: action });
      });
    });

    // 热门标签点击 → 搜索
    document.querySelectorAll('.mh-tag').forEach(tag => {
      tag.addEventListener('click', () => {
        showPage('元数据搜索结果', { keyword: tag.textContent, searchType: 'table-search' });
      });
    });

    // 卡片点击 → 进入搜索结果页
    document.querySelectorAll('.mh-card-clickable').forEach(card => {
      card.addEventListener('click', () => {
        const title = card.querySelector('.mh-card-title')?.textContent || '';
        showPage('元数据搜索结果', { keyword: title, searchType: 'table-search' });
      });
    });

    // Enter 键触发搜索
    const searchInput = document.querySelector('.mh-search-input');
    if (searchInput) {
      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const keyword = searchInput.value.trim();
          showPage('元数据搜索结果', { keyword, searchType: 'table-search' });
        }
      });
    }
  }

  /* ============================================================
     数据开发 - 项目/环境选择器交互
     ============================================================ */
  const devProjCurrent = document.getElementById('devProjCurrent');
  const devProjSelector = document.getElementById('devProjectSelector');

  if (devProjCurrent && devProjSelector) {
    // 展开/收起下拉
    devProjCurrent.addEventListener('click', () => {
      devProjSelector.classList.toggle('open');
    });

    // 点击外部关闭
    document.addEventListener('click', (e) => {
      if (!devProjSelector.contains(e.target)) {
        devProjSelector.classList.remove('open');
      }
    });

    // 左侧项目 hover → 切换右侧环境面板
    devProjSelector.querySelectorAll('.dev-proj-item').forEach(item => {
      item.addEventListener('mouseenter', () => {
        devProjSelector.querySelectorAll('.dev-proj-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        const projName = item.dataset.proj;
        devProjSelector.querySelectorAll('.dev-env-group').forEach(g => g.classList.remove('active'));
        const target = devProjSelector.querySelector(`.dev-env-group[data-proj="${projName}"]`);
        if (target) target.classList.add('active');
      });
    });

    // 搜索过滤项目
    const devSearchInput = document.getElementById('devProjSearchInput');
    if (devSearchInput) {
      devSearchInput.addEventListener('input', () => {
        const keyword = devSearchInput.value.trim().toLowerCase();
        devProjSelector.querySelectorAll('.dev-proj-item').forEach(item => {
          const name = (item.querySelector('span')?.textContent || '').toLowerCase();
          item.style.display = name.includes(keyword) ? 'flex' : 'none';
        });
        // 自动激活第一个可见项目
        const firstVisible = devProjSelector.querySelector('.dev-proj-item[style*="flex"], .dev-proj-item:not([style*="none"])');
        if (firstVisible) firstVisible.dispatchEvent(new Event('mouseenter'));
      });
    }

    // 环境选择
    devProjSelector.querySelectorAll('.dev-proj-env').forEach(env => {
      env.addEventListener('click', () => {
        devProjSelector.querySelectorAll('.dev-proj-env').forEach(e => e.classList.remove('active'));
        env.classList.add('active');
        const projName = env.closest('.dev-env-group').dataset.proj;
        const envName = env.dataset.env;
        document.querySelector('.dev-proj-text').textContent = projName + ' / ' + envName;
        devProjSelector.classList.remove('open');
      });
    });
  }

  // 初始化数据源页面（默认显示）
  initDatasourcePage();
});
