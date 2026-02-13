/**
 * 数据中台 V4.0 - 数据源管理页面
 * 布局：左侧（Tab + 目录树） | 右侧（工具栏 + 表格）
 * 包含两个 Tab：数据源、数仓分层
 */
window.DP = window.DP || {};
DP.pages = DP.pages || {};

DP.pages.datasource = {

  /* ---- HTML 模板 ---- */
  html: '<div class="page-datasource">' +

    /* ========== 左侧面板：Tab + 目录树 ========== */
    '<div class="ds-left-panel">' +

      /* Tab 切换 */
      '<div class="ds-tabs">' +
        '<a class="ds-tab active" data-ds-tab="datasource">数据源</a>' +
        '<a class="ds-tab" data-ds-tab="layer">数仓分层</a>' +
      '</div>' +

      /* --- 数据源目录树 --- */
      '<div class="ds-tree-content" id="dsTreeDatasource">' +
        '<div class="ds-tree-search"><input type="text" class="ds-tree-search-input" placeholder="搜索数据源..."><i class="bi bi-funnel filter-icon"></i></div>' +
        '<div class="ds-tree-scroll"><ul class="ds-tree">' +
          '<li class="tree-node open">' +
            '<span class="tree-toggle"><i class="bi bi-chevron-down"></i></span>' +
            '<i class="bi bi-folder2-open tree-icon"></i>' +
            '<span class="tree-text">生产数据库 (3)</span>' +
            '<ul class="tree-children">' +
              '<li class="tree-node active"><i class="bi bi-database tree-icon"></i><span class="tree-text">prod_mysql_master</span></li>' +
              '<li class="tree-node"><i class="bi bi-database tree-icon"></i><span class="tree-text">prod_mysql_slave</span></li>' +
              '<li class="tree-node"><i class="bi bi-database tree-icon"></i><span class="tree-text">prod_postgresql</span></li>' +
            '</ul>' +
          '</li>' +
          '<li class="tree-node">' +
            '<span class="tree-toggle"><i class="bi bi-chevron-right"></i></span>' +
            '<i class="bi bi-folder2 tree-icon"></i>' +
            '<span class="tree-text">数据仓库 (4)</span>' +
            '<ul class="tree-children">' +
              '<li class="tree-node"><i class="bi bi-database tree-icon"></i><span class="tree-text">dw_hive_ods</span></li>' +
              '<li class="tree-node"><i class="bi bi-database tree-icon"></i><span class="tree-text">dw_hive_dwd</span></li>' +
              '<li class="tree-node"><i class="bi bi-database tree-icon"></i><span class="tree-text">dw_hive_dws</span></li>' +
              '<li class="tree-node"><i class="bi bi-database tree-icon"></i><span class="tree-text">dw_hive_ads</span></li>' +
            '</ul>' +
          '</li>' +
          '<li class="tree-node">' +
            '<span class="tree-toggle"><i class="bi bi-chevron-right"></i></span>' +
            '<i class="bi bi-folder2 tree-icon"></i>' +
            '<span class="tree-text">业务系统 (3)</span>' +
            '<ul class="tree-children">' +
              '<li class="tree-node"><i class="bi bi-database tree-icon"></i><span class="tree-text">erp_oracle_db</span></li>' +
              '<li class="tree-node"><i class="bi bi-database tree-icon"></i><span class="tree-text">crm_sqlserver</span></li>' +
              '<li class="tree-node"><i class="bi bi-database tree-icon"></i><span class="tree-text">oa_mysql_db</span></li>' +
            '</ul>' +
          '</li>' +
          '<li class="tree-node">' +
            '<span class="tree-toggle"><i class="bi bi-chevron-right"></i></span>' +
            '<i class="bi bi-folder2 tree-icon"></i>' +
            '<span class="tree-text">实时数据源 (2)</span>' +
            '<ul class="tree-children">' +
              '<li class="tree-node"><i class="bi bi-database tree-icon"></i><span class="tree-text">kafka_cluster_01</span></li>' +
              '<li class="tree-node"><i class="bi bi-database tree-icon"></i><span class="tree-text">kafka_cluster_02</span></li>' +
            '</ul>' +
          '</li>' +
          '<li class="tree-node">' +
            '<span class="tree-toggle"><i class="bi bi-chevron-right"></i></span>' +
            '<i class="bi bi-folder2 tree-icon"></i>' +
            '<span class="tree-text">外部数据接入 (2)</span>' +
            '<ul class="tree-children">' +
              '<li class="tree-node"><i class="bi bi-database tree-icon"></i><span class="tree-text">api_weather_source</span></li>' +
              '<li class="tree-node"><i class="bi bi-database tree-icon"></i><span class="tree-text">api_map_service</span></li>' +
            '</ul>' +
          '</li>' +
          '<li class="tree-node"><i class="bi bi-database tree-icon leaf-indent"></i><span class="tree-text">redis_cache_01</span></li>' +
          '<li class="tree-node">' +
            '<span class="tree-toggle"><i class="bi bi-chevron-right"></i></span>' +
            '<i class="bi bi-folder2 tree-icon"></i>' +
            '<span class="tree-text">测试环境 (3)</span>' +
            '<ul class="tree-children">' +
              '<li class="tree-node"><i class="bi bi-database tree-icon"></i><span class="tree-text">test_mysql_db</span></li>' +
              '<li class="tree-node"><i class="bi bi-database tree-icon"></i><span class="tree-text">test_clickhouse</span></li>' +
              '<li class="tree-node"><i class="bi bi-database tree-icon"></i><span class="tree-text">test_mongodb</span></li>' +
            '</ul>' +
          '</li>' +
          '<li class="tree-node">' +
            '<span class="tree-toggle"><i class="bi bi-chevron-right"></i></span>' +
            '<i class="bi bi-folder2 tree-icon"></i>' +
            '<span class="tree-text">文件存储 (2)</span>' +
            '<ul class="tree-children">' +
              '<li class="tree-node"><i class="bi bi-database tree-icon"></i><span class="tree-text">hdfs_data_lake</span></li>' +
              '<li class="tree-node"><i class="bi bi-database tree-icon"></i><span class="tree-text">oss_archive</span></li>' +
            '</ul>' +
          '</li>' +
        '</ul></div>' +
      '</div>' +

      /* --- 数仓分层目录树 --- */
      '<div class="ds-tree-content" id="dsTreeLayer" style="display:none;">' +
        '<div class="ds-tree-search"><input type="text" class="ds-tree-search-input" placeholder="搜索分层 / 业务域..."><i class="bi bi-funnel filter-icon"></i></div>' +
        '<div class="ds-tree-scroll"><ul class="ds-tree">' +

          /* STG */
          '<li class="tree-node">' +
            '<span class="tree-toggle"><i class="bi bi-chevron-right"></i></span>' +
            '<i class="bi bi-folder2 tree-icon" style="color:#95a5a6;"></i>' +
            '<span class="tree-text"><span class="dw-layer-tag" style="background:#ecf0f1;color:#7f8c8d;">STG</span> 缓冲层</span>' +
            '<ul class="tree-children">' +
              '<li class="tree-node"><i class="bi bi-archive tree-icon" style="color:#95a5a6;"></i><span class="tree-text">交易域 (4)</span></li>' +
              '<li class="tree-node"><i class="bi bi-archive tree-icon" style="color:#95a5a6;"></i><span class="tree-text">用户域 (2)</span></li>' +
              '<li class="tree-node"><i class="bi bi-archive tree-icon" style="color:#95a5a6;"></i><span class="tree-text">商品域 (1)</span></li>' +
              '<li class="tree-node"><i class="bi bi-archive tree-icon" style="color:#95a5a6;"></i><span class="tree-text">物流域 (1)</span></li>' +
              '<li class="tree-node"><i class="bi bi-archive tree-icon" style="color:#95a5a6;"></i><span class="tree-text">营销域 (1)</span></li>' +
            '</ul>' +
          '</li>' +

          /* ODS */
          '<li class="tree-node open">' +
            '<span class="tree-toggle"><i class="bi bi-chevron-down"></i></span>' +
            '<i class="bi bi-folder2-open tree-icon" style="color:#e67e22;"></i>' +
            '<span class="tree-text"><span class="dw-layer-tag" style="background:#fef5e7;color:#e67e22;">ODS</span> 贴源层</span>' +
            '<ul class="tree-children">' +
              '<li class="tree-node active"><i class="bi bi-archive tree-icon" style="color:#e67e22;"></i><span class="tree-text">交易域 (5)</span></li>' +
              '<li class="tree-node"><i class="bi bi-archive tree-icon" style="color:#e67e22;"></i><span class="tree-text">用户域 (3)</span></li>' +
              '<li class="tree-node"><i class="bi bi-archive tree-icon" style="color:#e67e22;"></i><span class="tree-text">商品域 (2)</span></li>' +
              '<li class="tree-node"><i class="bi bi-archive tree-icon" style="color:#e67e22;"></i><span class="tree-text">物流域 (2)</span></li>' +
              '<li class="tree-node"><i class="bi bi-archive tree-icon" style="color:#e67e22;"></i><span class="tree-text">营销域 (2)</span></li>' +
              '<li class="tree-node"><i class="bi bi-archive tree-icon" style="color:#e67e22;"></i><span class="tree-text">库存域 (1)</span></li>' +
            '</ul>' +
          '</li>' +

          /* DWD */
          '<li class="tree-node">' +
            '<span class="tree-toggle"><i class="bi bi-chevron-right"></i></span>' +
            '<i class="bi bi-folder2 tree-icon" style="color:#2980b9;"></i>' +
            '<span class="tree-text"><span class="dw-layer-tag" style="background:#ebf5fb;color:#2980b9;">DWD</span> 明细层</span>' +
            '<ul class="tree-children">' +
              '<li class="tree-node"><i class="bi bi-archive tree-icon" style="color:#2980b9;"></i><span class="tree-text">交易域 (4)</span></li>' +
              '<li class="tree-node"><i class="bi bi-archive tree-icon" style="color:#2980b9;"></i><span class="tree-text">用户域 (2)</span></li>' +
              '<li class="tree-node"><i class="bi bi-archive tree-icon" style="color:#2980b9;"></i><span class="tree-text">物流域 (1)</span></li>' +
              '<li class="tree-node"><i class="bi bi-archive tree-icon" style="color:#2980b9;"></i><span class="tree-text">库存域 (1)</span></li>' +
              '<li class="tree-node"><i class="bi bi-archive tree-icon" style="color:#2980b9;"></i><span class="tree-text">营销域 (1)</span></li>' +
            '</ul>' +
          '</li>' +

          /* DIM */
          '<li class="tree-node">' +
            '<span class="tree-toggle"><i class="bi bi-chevron-right"></i></span>' +
            '<i class="bi bi-folder2 tree-icon" style="color:#27ae60;"></i>' +
            '<span class="tree-text"><span class="dw-layer-tag" style="background:#eafaf1;color:#27ae60;">DIM</span> 维度层</span>' +
            '<ul class="tree-children">' +
              '<li class="tree-node"><i class="bi bi-archive tree-icon" style="color:#27ae60;"></i><span class="tree-text">公共维度 (4)</span></li>' +
              '<li class="tree-node"><i class="bi bi-archive tree-icon" style="color:#27ae60;"></i><span class="tree-text">交易维度 (2)</span></li>' +
              '<li class="tree-node"><i class="bi bi-archive tree-icon" style="color:#27ae60;"></i><span class="tree-text">商品维度 (1)</span></li>' +
            '</ul>' +
          '</li>' +

          /* DWS */
          '<li class="tree-node">' +
            '<span class="tree-toggle"><i class="bi bi-chevron-right"></i></span>' +
            '<i class="bi bi-folder2 tree-icon" style="color:#8e44ad;"></i>' +
            '<span class="tree-text"><span class="dw-layer-tag" style="background:#f5eef8;color:#8e44ad;">DWS</span> 汇总层</span>' +
            '<ul class="tree-children">' +
              '<li class="tree-node"><i class="bi bi-archive tree-icon" style="color:#8e44ad;"></i><span class="tree-text">交易域 (2)</span></li>' +
              '<li class="tree-node"><i class="bi bi-archive tree-icon" style="color:#8e44ad;"></i><span class="tree-text">用户域 (2)</span></li>' +
              '<li class="tree-node"><i class="bi bi-archive tree-icon" style="color:#8e44ad;"></i><span class="tree-text">商品域 (1)</span></li>' +
              '<li class="tree-node"><i class="bi bi-archive tree-icon" style="color:#8e44ad;"></i><span class="tree-text">流量域 (1)</span></li>' +
            '</ul>' +
          '</li>' +

          /* ADS */
          '<li class="tree-node">' +
            '<span class="tree-toggle"><i class="bi bi-chevron-right"></i></span>' +
            '<i class="bi bi-folder2 tree-icon" style="color:#c0392b;"></i>' +
            '<span class="tree-text"><span class="dw-layer-tag" style="background:#fdedec;color:#c0392b;">ADS</span> 应用层</span>' +
            '<ul class="tree-children">' +
              '<li class="tree-node"><i class="bi bi-archive tree-icon" style="color:#c0392b;"></i><span class="tree-text">经营分析 (3)</span></li>' +
              '<li class="tree-node"><i class="bi bi-archive tree-icon" style="color:#c0392b;"></i><span class="tree-text">用户分析 (2)</span></li>' +
              '<li class="tree-node"><i class="bi bi-archive tree-icon" style="color:#c0392b;"></i><span class="tree-text">商品分析 (1)</span></li>' +
              '<li class="tree-node"><i class="bi bi-archive tree-icon" style="color:#c0392b;"></i><span class="tree-text">实时监控 (1)</span></li>' +
            '</ul>' +
          '</li>' +

          /* DM */
          '<li class="tree-node">' +
            '<span class="tree-toggle"><i class="bi bi-chevron-right"></i></span>' +
            '<i class="bi bi-folder2 tree-icon" style="color:#f39c12;"></i>' +
            '<span class="tree-text"><span class="dw-layer-tag" style="background:#fef9e7;color:#f39c12;">DM</span> 集市层</span>' +
            '<ul class="tree-children">' +
              '<li class="tree-node"><i class="bi bi-archive tree-icon" style="color:#f39c12;"></i><span class="tree-text">财务集市 (3)</span></li>' +
              '<li class="tree-node"><i class="bi bi-archive tree-icon" style="color:#f39c12;"></i><span class="tree-text">营销集市 (2)</span></li>' +
              '<li class="tree-node"><i class="bi bi-archive tree-icon" style="color:#f39c12;"></i><span class="tree-text">供应链集市 (2)</span></li>' +
              '<li class="tree-node"><i class="bi bi-archive tree-icon" style="color:#f39c12;"></i><span class="tree-text">客户集市 (1)</span></li>' +
            '</ul>' +
          '</li>' +

        '</ul></div>' +
      '</div>' +

    '</div>' +

    /* ========== 右侧面板：工具栏 + 共享表格 ========== */
    '<div class="ds-right-panel">' +

      /* 工具栏：按钮(左) + 搜索条件(右) 一行展示 */
      '<div class="ds-toolbar">' +
        '<div class="ds-toolbar-left" id="dsToolbarBtns">' +
          '<button class="btn btn-primary"><i class="bi bi-plus-lg"></i> 添加数据源</button>' +
          '<button class="btn btn-primary"><i class="bi bi-download"></i> 批量导出</button>' +
          '<button class="btn btn-primary"><i class="bi bi-upload"></i> 批量导入</button>' +
          '<button class="btn btn-primary"><i class="bi bi-file-earmark-spreadsheet"></i> 导出表格数据</button>' +
          '<button class="btn btn-primary"><i class="bi bi-journal-check"></i> 注册管理</button>' +
          '<button class="btn btn-primary"><i class="bi bi-pencil"></i> 编辑</button>' +
          '<button class="btn btn-primary"><i class="bi bi-arrow-repeat"></i> 同步</button>' +
          '<button class="btn btn-primary"><i class="bi bi-layers"></i> 数仓规划</button>' +
          '<button class="btn btn-danger"><i class="bi bi-trash"></i> 删除</button>' +
        '</div>' +
        '<div class="ds-toolbar-right">' +
          '<div class="ds-filter-group"><span class="filter-label">类型:</span><select class="filter-select"><option>全部</option><option>表</option><option>视图</option><option>物化视图</option><option>同义词</option><option>索引</option><option>主题</option><option>集合</option><option>队列</option><option>子表</option><option>超级表</option><option>节点</option><option>边</option></select></div>' +
          '<div class="ds-filter-group"><span class="filter-label">表类型:</span><select class="filter-select"><option>请选择</option><option>业务表</option><option>贴源表</option><option>维度表</option><option>明细表</option><option>汇总表</option><option>应用表</option><option>输出表</option><option>其他表</option></select></div>' +
          '<div class="ds-search-box"><input type="text" class="ds-search-input" placeholder="输入英文关键字"><button class="btn btn-primary btn-sm">查询</button></div>' +
        '</div>' +
      '</div>' +

      /* 共享表格 */
      '<div class="ds-table-wrap"><table class="ds-table">' +
        '<thead><tr>' +
          '<th class="col-ck"><input type="checkbox"></th>' +
          '<th>英文名称 <i class="bi bi-arrow-down-up sort-icon"></i></th>' +
          '<th>中文名称</th><th>别名</th>' +
          '<th>类型 <i class="bi bi-arrow-down-up sort-icon"></i></th>' +
          '<th>数仓分层 <i class="bi bi-arrow-down-up sort-icon"></i></th>' +
          '<th>表类型 <i class="bi bi-arrow-down-up sort-icon"></i></th>' +
          '<th>库名</th><th>描述</th><th>记录数</th><th>操作</th>' +
        '</tr></thead>' +
        '<tbody>' +
          '<tr><td><input type="checkbox"></td><td class="td-link">sys_user</td><td class="td-link">用户信息表</td><td>-</td><td><span class="tag tag-yellow">表</span></td><td>ODS</td><td>事实表</td><td>prod_mysql_master</td><td>系统用户基础信息</td><td>52,386</td><td class="td-actions"><i class="bi bi-eye"></i><i class="bi bi-pencil"></i><i class="bi bi-search"></i><i class="bi bi-diagram-2"></i></td></tr>' +
          '<tr><td><input type="checkbox"></td><td class="td-link">order_main</td><td class="td-link">订单主表</td><td>-</td><td><span class="tag tag-yellow">表</span></td><td>ODS</td><td>事实表</td><td>prod_mysql_master</td><td>核心订单数据</td><td>1,438,920</td><td class="td-actions"><i class="bi bi-eye"></i><i class="bi bi-pencil"></i><i class="bi bi-search"></i><i class="bi bi-diagram-2"></i></td></tr>' +
          '<tr><td><input type="checkbox"></td><td class="td-link">order_detail</td><td class="td-link">订单明细表</td><td>-</td><td><span class="tag tag-yellow">表</span></td><td>ODS</td><td>事实表</td><td>prod_mysql_master</td><td>订单商品明细</td><td>3,892,105</td><td class="td-actions"><i class="bi bi-eye"></i><i class="bi bi-pencil"></i><i class="bi bi-search"></i><i class="bi bi-diagram-2"></i></td></tr>' +
          '<tr><td><input type="checkbox"></td><td class="td-link">product_info</td><td class="td-link">商品信息表</td><td>-</td><td><span class="tag tag-yellow">表</span></td><td>DWD</td><td>维度表</td><td>prod_mysql_master</td><td>商品基础信息维度</td><td>86,742</td><td class="td-actions"><i class="bi bi-eye"></i><i class="bi bi-pencil"></i><i class="bi bi-search"></i><i class="bi bi-diagram-2"></i></td></tr>' +
          '<tr><td><input type="checkbox"></td><td class="td-link">payment_record</td><td class="td-link">支付流水表</td><td>pay_log</td><td><span class="tag tag-yellow">表</span></td><td>ODS</td><td>事实表</td><td>prod_mysql_master</td><td>支付交易流水记录</td><td>2,156,830</td><td class="td-actions"><i class="bi bi-eye"></i><i class="bi bi-pencil"></i><i class="bi bi-search"></i><i class="bi bi-diagram-2"></i></td></tr>' +
          '<tr><td><input type="checkbox"></td><td class="td-link">dim_region</td><td class="td-link">区域维度表</td><td>-</td><td><span class="tag tag-yellow">表</span></td><td>DWD</td><td>维度表</td><td>prod_mysql_master</td><td>省市区三级区域</td><td>3,624</td><td class="td-actions"><i class="bi bi-eye"></i><i class="bi bi-pencil"></i><i class="bi bi-search"></i><i class="bi bi-diagram-2"></i></td></tr>' +
          '<tr><td><input type="checkbox"></td><td class="td-link">customer_profile</td><td class="td-link">客户画像宽表</td><td>-</td><td><span class="tag tag-yellow">表</span></td><td>DWS</td><td>汇总表</td><td>prod_mysql_master</td><td>客户标签画像汇总</td><td>328,915</td><td class="td-actions"><i class="bi bi-eye"></i><i class="bi bi-pencil"></i><i class="bi bi-search"></i><i class="bi bi-diagram-2"></i></td></tr>' +
          '<tr><td><input type="checkbox"></td><td class="td-link">inventory_snapshot</td><td class="td-link">库存快照表</td><td>-</td><td><span class="tag tag-yellow">表</span></td><td>ODS</td><td>事实表</td><td>prod_mysql_master</td><td>每日库存快照</td><td>9,450,200</td><td class="td-actions"><i class="bi bi-eye"></i><i class="bi bi-pencil"></i><i class="bi bi-search"></i><i class="bi bi-diagram-2"></i></td></tr>' +
          '<tr><td><input type="checkbox"></td><td class="td-link">v_sales_daily_report</td><td class="td-link">日销售报表视图</td><td>-</td><td><span class="tag tag-blue">视图</span></td><td>ADS</td><td>-</td><td>prod_mysql_master</td><td>每日销售汇总报表</td><td>-</td><td class="td-actions"><i class="bi bi-eye"></i><i class="bi bi-pencil"></i><i class="bi bi-search"></i><i class="bi bi-diagram-2"></i></td></tr>' +
          '<tr><td><input type="checkbox"></td><td class="td-link">logistics_tracking</td><td class="td-link">物流轨迹表</td><td>-</td><td><span class="tag tag-yellow">表</span></td><td>ODS</td><td>事实表</td><td>prod_mysql_master</td><td>物流配送轨迹信息</td><td>15,672,400</td><td class="td-actions"><i class="bi bi-eye"></i><i class="bi bi-pencil"></i><i class="bi bi-search"></i><i class="bi bi-diagram-2"></i></td></tr>' +
          '<tr><td><input type="checkbox"></td><td class="td-link">ads_gmv_summary</td><td class="td-link">GMV汇总表</td><td>-</td><td><span class="tag tag-yellow">表</span></td><td>ADS</td><td>汇总表</td><td>prod_mysql_master</td><td>交易额多维汇总</td><td>4,580</td><td class="td-actions"><i class="bi bi-eye"></i><i class="bi bi-pencil"></i><i class="bi bi-search"></i><i class="bi bi-diagram-2"></i></td></tr>' +
          '<tr><td><input type="checkbox"></td><td class="td-link">user_behavior_log</td><td class="td-link">用户行为日志表</td><td>-</td><td><span class="tag tag-yellow">表</span></td><td>ODS</td><td>事实表</td><td>prod_mysql_master</td><td>埋点行为日志采集</td><td>89,320,600</td><td class="td-actions"><i class="bi bi-eye"></i><i class="bi bi-pencil"></i><i class="bi bi-search"></i><i class="bi bi-diagram-2"></i></td></tr>' +
        '</tbody>' +
      '</table></div>' +
      '<div class="ds-pagination">' +
        '<span class="page-info">显示第 1 到第 12 条记录，总共 36 条记录，每页显示 20 <i class="bi bi-caret-down-fill"></i> 条记录</span>' +
        '<div class="page-nav"><a class="page-btn disabled">上一页</a><a class="page-num active">1</a><a class="page-num">2</a><a class="page-btn">下一页</a></div>' +
      '</div>' +

    '</div>' +
  '</div>',

  /* ---- 页面交互初始化 ---- */
  init: function () {
    var page = document.querySelector('.page-datasource');
    if (!page) return;

    /* Tab 切换：切换左侧树 + 按钮行显隐 */
    var tabs = page.querySelectorAll('.ds-tab');
    var toolbarBtns = document.getElementById('dsToolbarBtns');
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');
        var target = tab.dataset.dsTab;

        // 切换左侧树
        document.getElementById('dsTreeDatasource').style.display = (target === 'datasource') ? '' : 'none';
        document.getElementById('dsTreeLayer').style.display = (target === 'layer') ? '' : 'none';

        // 数仓分层隐藏操作按钮行，搜索条件行始终保留
        if (toolbarBtns) toolbarBtns.style.display = (target === 'datasource') ? '' : 'none';
      });
    });

    /* 通用：树形目录展开/折叠 */
    page.querySelectorAll('.ds-tree .tree-toggle').forEach(function (toggle) {
      toggle.addEventListener('click', function (e) {
        e.stopPropagation();
        var node = toggle.closest('.tree-node');
        if (node) node.classList.toggle('open');
      });
    });

    /* 通用：树节点选中 */
    page.querySelectorAll('.ds-tree .tree-node').forEach(function (node) {
      node.addEventListener('click', function () {
        if (!node.querySelector('.tree-children')) {
          var tree = node.closest('.ds-tree');
          if (tree) tree.querySelectorAll('.tree-node.active').forEach(function (n) { n.classList.remove('active'); });
          node.classList.add('active');
        }
      });
    });
  }
};
