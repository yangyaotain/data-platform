/**
 * 数据中台 V4.0 - 数据开发页面
 * 左侧面板（Tab + 目录树）始终不变，右侧面板按选中节点切换内容
 */
window.DP = window.DP || {};
DP.pages = DP.pages || {};

DP.pages.dataDevelop = {

  /* ---- HTML 模板 ---- */
  html: '<div class="page-data-develop">' +
    '<div class="dd-body">' +

      /* ========== 左侧面板（始终不变） ========== */
      '<div class="dd-tree-panel dd-left-panel">' +
        '<div class="dd-left-tabs dd-tabs">' +
          '<a class="dd-tab active" data-dd-tab="flow">流程开发</a>' +
          '<a class="dd-tab" data-dd-tab="catalog">数据目录</a>' +
        '</div>' +
        '<div class="dd-tree-search">' +
          '<input type="text" placeholder="关键字搜索">' +
          '<i class="bi bi-search"></i>' +
        '</div>' +
        '<div class="dd-tree-content" id="ddTreeContent"></div>' +
      '</div>' +

      '<div class="dd-resize-col dd-resize-left" id="ddResizeLeft"></div>' +

      /* ========== 右侧面板 ========== */
      '<div class="dd-right-panel">' +

        /* --- 流程视图 --- */
        '<div class="dd-flow-view" id="ddFlowView">' +
          '<div class="dd-header dd-flow-header">' +
            '<div class="dd-flow-top-tabs dd-tabs">' +
              '<a class="dd-tab active" data-dd-tab="monitor">流程编排</a>' +
              '<a class="dd-tab" data-dd-tab="history">执行记录</a>' +
            '</div>' +
            '<div class="dd-actions">' +
              '<button class="btn btn-primary" type="button" data-dd-action="schedule"><i class="bi bi-clock-history"></i> 启动调度</button>' +
              '<button class="btn">执行</button>' +
              '<button class="btn">导出</button>' +
              '<button class="btn btn-success">发布</button>' +
              '<button class="btn btn-primary">保存</button>' +
            '</div>' +
          '</div>' +
          '<div class="dd-flow-body">' +
            '<div class="dd-canvas-panel">' +
              '<div class="dd-canvas-search">' +
                '<div class="dd-search-mini">' +
                  '<span>关键词搜索</span>' +
                  '<input type="text" placeholder="">' +
                  '<span>1/12</span>' +
                  '<div class="dd-search-nav">' +
                    '<i class="bi bi-chevron-up"></i>' +
                    '<i class="bi bi-chevron-down"></i>' +
                  '</div>' +
                '</div>' +
              '</div>' +
              '<div class="dd-canvas" id="ddCanvas" aria-label="流程编排画布"></div>' +
              '<div class="dd-canvas-zoom" aria-label="画布缩放工具栏">' +
                '<button type="button" data-dd-zoom="out" title="缩小画布"><i class="bi bi-dash-lg"></i><span>缩小</span></button>' +
                '<button type="button" class="dd-canvas-zoom-value" data-dd-zoom="reset" title="恢复 100%"><i class="bi bi-aspect-ratio"></i><span data-dd-zoom-label>100%</span></button>' +
                '<button type="button" data-dd-zoom="in" title="放大画布"><i class="bi bi-plus-lg"></i><span>放大</span></button>' +
                '<button type="button" data-dd-zoom="fit" title="适应当前画布"><i class="bi bi-arrows-fullscreen"></i><span>适应</span></button>' +
              '</div>' +
            '</div>' +
            '<div class="dd-resize-col dd-resize-props" id="ddResizeProps"></div>' +
            '<div class="dd-props-panel">' +
              '<div class="dd-props-body">' +

                /* -- 基本信息 -- */
                '<div class="dd-props-tab-content active" data-props-content="basic">' +
                  '<div class="dd-prop-group"><div class="dd-prop-label">名称：</div><input class="dd-prop-input" type="text" placeholder="50个字符以内"></div>' +
                  '<div class="dd-prop-group"><div class="dd-prop-label">版本：</div><div class="dd-prop-row"><select class="dd-prop-select"><option>V1.0（含计xxx）</option><option>V2.0</option></select><button class="dd-prop-btn-sm">另存为</button></div></div>' +
                  '<div class="dd-prop-group"><div class="dd-prop-label">备注：</div><textarea class="dd-prop-input" placeholder="200个字符以内"></textarea></div>' +
                  '<div class="dd-prop-group"><div class="dd-prop-label">调度信息：</div><div class="dd-prop-info"><span class="status-running">启动中</span></div></div>' +
                  '<div class="dd-prop-group"><div class="dd-prop-label">定时调度：</div><div class="dd-prop-info">每天 00:00:00 执行</div></div>' +
                '</div>' +

                /* -- 参数设置 -- */
                '<div class="dd-props-tab-content" data-props-content="params">' +
                  '<h4 class="dd-sb-heading">执行机制</h4>' +
                  '<div class="dd-sb-field"><span class="dd-sb-field-label">失败选项</span> 当任务流程中首次出现失败时，选择执行行为：</div>' +
                  '<div class="dd-sb-radios">' +
                    '<label><input type="radio" name="failOpt" checked> 完成当前运行：仅完成当前的元子，不开始执行任何新的元子</label>' +
                    '<label><input type="radio" name="failOpt"> 取消全部：立即kill掉所有元子，任务失败</label>' +
                    '<label><input type="radio" name="failOpt"> 完成所有可能：只要满足依赖关系，将继续执行元子</label>' +
                  '</div>' +
                  '<div class="dd-sb-field"><span class="dd-sb-field-label">并发选项</span> 当任务流程正在运行，选择以下并发执行选项：</div>' +
                  '<div class="dd-sb-radios">' +
                    '<label><input type="radio" name="concOpt" checked> 跳过执行：如果已经运行，不要运行任务</label>' +
                    '<label><input type="radio" name="concOpt"> 运行并行：运行任务，以前的任务不受影响</label>' +
                    '<label><input type="radio" name="concOpt"> 管道方式：任务管道，确保任务不会超限</label>' +
                  '</div>' +
                  '<h4 class="dd-sb-heading">动态参数【时间】</h4>' +
                  '<table class="dd-sb-table">' +
                    '<thead><tr><th>参数名</th><th>参数说明</th><th>数据格式</th><th>偏移值</th><th>时间类型</th><th>固定时间</th></tr></thead>' +
                    '<tbody>' +
                      '<tr><td>st_Time</td><td>开始时间</td><td>yyyy-MM-dd</td><td>1</td><td>秒</td><td>00:00:00</td></tr>' +
                      '<tr><td>end_Time</td><td>结束时间</td><td>yyyy-MM-dd</td><td>0</td><td>秒</td><td>00:00:00</td></tr>' +
                    '</tbody>' +
                  '</table>' +
                  '<h4 class="dd-sb-heading">动态参数【字符串】</h4>' +
                  '<table class="dd-sb-table">' +
                    '<thead><tr><th>参数名</th><th>参数说明</th><th>数据格式</th><th>参数值</th></tr></thead>' +
                    '<tbody>' +
                      '<tr><td>depart</td><td>部门</td><td>字符串</td><td><b>业务中心</b></td></tr>' +
                      '<tr><td>area</td><td>地区</td><td>字符串</td><td><b>深圳</b></td></tr>' +
                    '</tbody>' +
                  '</table>' +
                '</div>' +

                /* -- 版本管理 -- */
                '<div class="dd-props-tab-content" data-props-content="version">' +
                  '<div class="dd-sb-toolbar">' +
                    '<span class="dd-sb-title" style="margin:0">xxx业务流程名称</span>' +
                    '<span style="margin-left:auto">调度状态：</span><select class="dd-prop-select" style="width:auto"><option>请选择</option></select>' +
                    '<span>共享状态：</span><select class="dd-prop-select" style="width:auto"><option>请选择</option></select>' +
                    '<span>接口状态：</span><select class="dd-prop-select" style="width:auto"><option>请选择</option></select>' +
                  '</div>' +
                  '<table class="dd-sb-table">' +
                    '<thead><tr><th>版本</th><th>调度状态</th><th>调度配置</th><th>接口状态</th><th>共享状态</th><th>版本说明</th><th>操作</th></tr></thead>' +
                    '<tbody>' +
                      '<tr><td>V1.0</td><td>未配置</td><td>--</td><td>否</td><td>未共享</td><td>深圳数据</td><td><a class="dd-sb-link">共享</a> | <a class="dd-sb-link" data-dd-action="schedule">启动调度</a> | <a class="dd-sb-link">发布接口</a> | <a class="dd-sb-link text-danger">删除</a></td></tr>' +
                      '<tr><td>V2.0</td><td><span style="color:#fa8c16">未启动</span></td><td><span style="color:var(--primary)">每天 18:30:01</span></td><td>否</td><td>未共享</td><td>广州数据</td><td><a class="dd-sb-link">共享</a> | <a class="dd-sb-link" data-dd-action="schedule">启动调度</a> | <a class="dd-sb-link">发布接口</a> | <a class="dd-sb-link text-danger">删除</a></td></tr>' +
                      '<tr><td>V3.0</td><td><span style="color:#52c41a">已启动</span></td><td><span style="color:var(--primary)">触发执行</span></td><td>是</td><td><span style="color:#52c41a">已共享</span></td><td>佛山数据</td><td><a class="dd-sb-link text-danger">停止共享</a> | <a class="dd-sb-link text-danger">停止调度</a> | <a class="dd-sb-link text-danger">停止接口</a></td></tr>' +
                    '</tbody>' +
                  '</table>' +
                  '<div class="dd-sb-pagination">' +
                    '<a>上一页</a><span class="dd-page active">1</span><span class="dd-page">2</span><span class="dd-page">3</span><span class="dd-page">4</span><span class="dd-page">5</span><span>...</span><span class="dd-page">89</span><a>下一页</a>' +
                  '</div>' +
                  '</div>' +

                /* -- 画布专属节点配置（质量 / 参数 / 前置任务 / 汇总表） -- */
                '<div class="dd-special-node-props" id="ddSpecialNodeProps" style="display:none"></div>' +

              '</div>' +
              '<div class="dd-props-strip">' +
                '<div class="dd-sidebar-tab active" data-props-tab="basic">基本信息</div>' +
                '<div class="dd-sidebar-tab" data-props-tab="params">参数设置</div>' +
                '<div class="dd-sidebar-tab" data-props-tab="version">版本管理</div>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +

        /* --- 流式计算任务列表（隐藏） --- */
        '<div class="dd-stream-view" id="ddStreamView" style="display:none">' +
          '<div class="dd-header dd-stream-header">' +
            '<div class="dd-stream-title">流式计算任务</div>' +
            '<div class="dd-actions">' +
              '<button class="btn btn-primary" type="button" data-stream-action="start"><i class="bi bi-play-circle"></i> 启动</button>' +
              '<button class="btn" type="button" data-stream-action="stop"><i class="bi bi-stop-circle"></i> 停止</button>' +
              '<button class="btn" type="button" data-stream-action="export"><i class="bi bi-box-arrow-up"></i> 导出</button>' +
              '<button class="btn" type="button" data-stream-action="import"><i class="bi bi-box-arrow-in-down"></i> 导入</button>' +
              '<button class="btn btn-success" type="button" data-stream-action="publish"><i class="bi bi-cloud-arrow-up"></i> 发布</button>' +
            '</div>' +
          '</div>' +
          '<div class="dd-stream-body">' +
            '<div class="dd-stream-filter">' +
              '<label><span>状态</span><select id="ddStreamStatus"><option value="">全部</option><option value="已启动">已启动</option><option value="未启动">未启动</option></select></label>' +
              '<label class="dd-stream-keyword"><span>关键词</span><input id="ddStreamKeyword" type="text" placeholder="ID和名称关键字"></label>' +
              '<button class="btn btn-primary" id="ddStreamQuery" type="button"><i class="bi bi-search"></i> 查询</button>' +
            '</div>' +
            '<div class="dd-stream-table-wrap">' +
              '<table class="dd-stream-table">' +
                '<thead><tr><th class="dd-stream-check"><input id="ddStreamCheckAll" type="checkbox" aria-label="全选当前页"></th><th>ID</th><th>名称</th><th>版本</th><th>状态</th><th>开始时间</th><th>结束时间</th><th>运行时长</th><th class="dd-stream-operation">操作</th></tr></thead>' +
                '<tbody id="ddStreamTableBody"></tbody>' +
              '</table>' +
            '</div>' +
            '<div class="dd-stream-pagination" id="ddStreamPagination"></div>' +
          '</div>' +
          '<div class="dd-stream-toast" id="ddStreamToast" role="status" aria-live="polite"></div>' +
        '</div>' +

        /* --- 数据采集子流程配置（隐藏） --- */
        '<div class="dd-collection-view" id="ddCollectionView" style="display:none">' +
          '<div class="dd-collection-main">' +
            '<div class="dd-header dd-collection-header">' +
              '<div class="dd-tabs"><a class="dd-tab active" data-collection-tab="properties">任务属性</a><a class="dd-tab" data-collection-tab="logs">任务日志</a><a class="dd-tab" data-collection-tab="impact">影响分析</a></div>' +
              '<div class="dd-actions"><button class="btn btn-primary" type="button" data-collection-action="schedule"><i class="bi bi-clock-history"></i> 启动调度</button><button class="btn btn-primary" type="button" data-collection-action="save"><i class="bi bi-save"></i> 保存</button><button class="btn" type="button" data-collection-action="execute"><i class="bi bi-play-circle"></i> 执行</button><button class="btn" type="button" data-collection-action="import"><i class="bi bi-box-arrow-in-down"></i> 导入流程</button><button class="btn" type="button" data-collection-action="export"><i class="bi bi-box-arrow-up"></i> 导出流程</button></div>' +
            '</div>' +

            '<div class="dd-collection-content active" data-collection-content="properties">' +
              '<section class="dd-collection-section">' +
                '<button class="dd-collection-section-title" type="button" data-collection-collapse="read"><span class="dd-collection-step">1</span><span>读数据配置</span><i class="bi bi-chevron-up"></i></button>' +
                '<div class="dd-collection-section-body" data-collection-section="read"><div class="dd-collection-config-layout"><div class="dd-collection-form-grid">' +
                  '<label data-collection-help-key="readType"><span><em>*</em> 读数据类型</span><select id="ddCollectionReadType"><option>DB2</option><option>DM8</option><option>Doris</option><option>Elasticsearch</option><option>FTP</option><option>Gaussdb</option><option>Greenplum</option><option>HANA</option><option>HBase</option><option>HDFS</option><option>Hive</option><option>Http</option><option>Iceberg</option><option>Impala</option><option>Informix</option><option>IoTDB</option><option>KADB</option><option>KingBase</option><option>Mariadb</option><option>MongoDB</option><option selected>MySQL</option><option>MySQL8</option><option>NebulaGraph</option><option>OceanBase</option><option>Oracle</option><option>Oscar</option><option>PolarDB</option><option>postgis</option><option>PostgreSQL</option><option>Presto</option><option>SqlServer</option><option>StarRocks</option><option>TDengine</option><option>TDSQL</option><option>TiDB</option></select></label>' +
                  '<div class="dd-collection-dynamic-fields" id="ddCollectionReadFields"></div>' +
                '</div><aside class="dd-collection-help" data-collection-help="read"><div class="dd-collection-help-empty"><strong>配置参数查看说明</strong><span>点击左侧配置参数，可查看各参数相关的帮助说明。</span></div></aside></div></div>' +
              '</section>' +

              '<section class="dd-collection-section">' +
                '<button class="dd-collection-section-title" type="button" data-collection-collapse="write"><span class="dd-collection-step">2</span><span>写数据配置</span><i class="bi bi-chevron-up"></i></button>' +
                '<div class="dd-collection-section-body" data-collection-section="write"><div class="dd-collection-config-layout"><div class="dd-collection-form-grid">' +
                  '<label data-collection-help-key="writeType"><span><em>*</em> 写数据类型</span><select id="ddCollectionWriteType"><option>DB2</option><option>DM8</option><option>Doris</option><option>Elasticsearch</option><option>Gaussdb</option><option>Greenplum</option><option>HANA</option><option>HBase</option><option>HDFS</option><option selected>Hive</option><option>Iceberg</option><option>Impala</option><option>IoTDB</option><option>KADB</option><option>Kafka</option><option>KingBase</option><option>Mariadb</option><option>MongoDB</option><option>MySQL</option><option>MySQL8</option><option>NebulaGraph</option><option>OceanBase</option><option>Oracle</option><option>Oscar</option><option>PolarDB</option><option>postgis</option><option>PostgreSQL</option><option>Presto</option><option>SqlServer</option><option>StarRocks</option><option>TDengine</option><option>TDSQL</option><option>TiDB</option></select></label>' +
                  '<div class="dd-collection-dynamic-fields" id="ddCollectionWriteFields"></div>' +
                '</div><aside class="dd-collection-help" data-collection-help="write"><div class="dd-collection-help-empty"><strong>配置参数查看说明</strong><span>点击左侧配置参数，可查看各参数相关的帮助说明。</span></div></aside></div></div>' +
              '</section>' +

              '<section class="dd-collection-section">' +
                '<button class="dd-collection-section-title" type="button" data-collection-collapse="mapping"><span class="dd-collection-step">3</span><span>字段匹配</span><i class="bi bi-chevron-up"></i></button>' +
                '<div class="dd-collection-section-body" data-collection-section="mapping"><div class="dd-collection-match-toolbar"><span>字段匹配</span><button class="active" type="button" data-collection-match="name"><i class="bi bi-braces"></i> 名称匹配</button><button type="button" data-collection-match="order"><i class="bi bi-list-ol"></i> 顺序匹配</button></div><div class="dd-collection-mapping">' +
                  '<div class="dd-collection-field-table"><div class="dd-collection-field-title"><span>数据源字段</span></div><table><thead><tr><th>数据源字段</th><th>字段中文名</th><th>字段类型</th></tr></thead><tbody id="ddCollectionSourceFields"></tbody></table><button class="dd-collection-add-row" type="button" data-collection-action="add-field"><i class="bi bi-plus-circle"></i> 新增一行</button></div>' +
                  '<div class="dd-collection-field-links" id="ddCollectionFieldLinks" aria-label="字段映射连线"></div>' +
                  '<div class="dd-collection-field-table target"><div class="dd-collection-field-title"><span>目标表</span><span id="ddCollectionTargetCaption"></span></div><table><thead><tr><th>目标表字段</th><th>字段中文名</th><th>字段类型</th></tr></thead><tbody id="ddCollectionTargetFields"></tbody></table></div>' +
                '</div></div>' +
              '</section>' +
            '</div>' +

            '<div class="dd-collection-content" data-collection-content="logs"><div class="dd-collection-log-toolbar"><button class="btn" type="button" data-collection-action="refresh-log"><i class="bi bi-arrow-clockwise"></i> 刷新</button><div class="dd-collection-log-meta"><span>执行ID：<b id="ddCollectionExecutionId">COL20260917001</b></span><span>开始：2026-09-17 09:32:16</span><span>结束：2026-09-17 09:32:24</span><span>时长：8 s</span><span>状态：<b class="status-success">成功</b></span></div><button class="btn" type="button" data-collection-action="download-log"><i class="bi bi-download"></i> 下载</button></div><div class="dd-collection-log-editor"><div class="dd-collection-editor-toolbar"><select><option>暗色 - One Dark</option><option>亮色</option></select><select><option>14px</option><option>13px</option><option>16px</option></select><button type="button" data-collection-action="copy-log"><i class="bi bi-clipboard"></i> 复制</button><button type="button" data-collection-action="search-log"><i class="bi bi-search"></i> 搜索</button><button type="button" data-collection-action="fullscreen-log" title="全屏"><i class="bi bi-arrows-fullscreen"></i></button></div><pre id="ddCollectionLogText">[09:32:16] 开始执行单表采集子流程：单表采集子流程1-1\n[09:32:17] 读取数据源：业务系统 → 测试业务系统 / t_sales_order\n[09:32:18] 字段映射校验完成，共 8 个字段\n[09:32:20] 写入目标：ODS-贴源层 → 中电数智_ODS / ods_sales_order\n[09:32:24] 采集完成，读取 12,680 条，写入 12,680 条，失败 0 条</pre></div></div>' +

            '<div class="dd-collection-content" data-collection-content="impact"><div class="dd-collection-impact-toolbar"><span>影响分析：</span><label><input type="radio" name="collectionImpact" value="all" checked> 全部</label><label><input type="radio" name="collectionImpact" value="upstream"> 上游</label><label><input type="radio" name="collectionImpact" value="downstream"> 下游</label><button class="btn btn-primary" type="button" data-collection-action="batch-execute"><i class="bi bi-play-circle"></i> 批量执行</button></div><div class="dd-collection-impact-canvas"><div class="dd-impact-node upstream" data-impact-direction="upstream"><i class="bi bi-database"></i><span>t_sales_order<small>测试业务系统</small></span></div><i class="bi bi-arrow-right dd-impact-arrow upstream" data-impact-direction="upstream"></i><div class="dd-impact-process"><span class="dd-impact-schedule">定时调度：未配置调度</span><div><input type="checkbox" aria-label="选择单表采集子流程"><i class="bi bi-table"></i><strong id="ddCollectionImpactName">单表采集子流程1-1 [V1]</strong></div><span class="dd-impact-status"><i class="bi bi-exclamation-circle-fill"></i> 未执行</span></div><i class="bi bi-arrow-right dd-impact-arrow downstream" data-impact-direction="downstream"></i><div class="dd-impact-node downstream" data-impact-direction="downstream"><i class="bi bi-table"></i><span>ods_sales_order<small>中电数智_ODS</small></span></div></div></div>' +
          '</div>' +

          '<div class="dd-resize-col dd-resize-collection" id="ddCollectionResizeProps" title="拖动调整配置区宽度"></div>' +
          '<div class="dd-collection-sidebar"><div class="dd-collection-sidebar-content">' +
            '<div class="dd-collection-side-panel active" data-collection-side="basic"><h3>基本信息</h3><label><span>流程名称</span><input id="ddCollectionName" type="text" value="单表采集子流程1-1"></label><label><span>版本</span><div class="dd-collection-side-row"><input type="text" value="V1" disabled><button type="button" data-collection-action="save-as">另存为</button></div></label><div class="dd-collection-side-info"><span>调度信息</span><strong>未调度</strong></div><label><span>流程描述</span><textarea id="ddCollectionDescription" rows="4">采集销售订单明细至 ODS 贴源层。</textarea></label><button class="btn btn-primary dd-collection-save-flow" type="button" data-collection-action="save-flow"><i class="bi bi-save"></i> 保存流程</button></div>' +
            '<div class="dd-collection-side-panel" data-collection-side="version"><h3>版本信息</h3><div class="dd-collection-side-table-wrap"><table><thead><tr><th>版本号</th><th>版本说明</th><th>创建者</th><th>创建时间</th><th>修改者</th><th>修改时间</th><th>操作</th></tr></thead><tbody><tr><td>V1</td><td>销售订单采集初始版本</td><td>演示</td><td>2026-09-17 09:20:18</td><td>演示</td><td>2026-09-17 09:28:46</td><td></td></tr><tr><td><a data-collection-action="switch-version" data-version="V0.9">V0.9</a></td><td>调整订单金额字段映射</td><td>演示</td><td>2026-09-16 15:12:06</td><td>演示</td><td>2026-09-16 16:05:31</td><td><button class="dd-collection-icon-action danger" type="button" title="删除" data-collection-action="delete-version"><i class="bi bi-x-lg"></i></button></td></tr></tbody></table></div></div>' +
            '<div class="dd-collection-side-panel" data-collection-side="lineage"><h3>血缘关系</h3><div class="dd-collection-lineage-topology"><div class="source"><i class="bi bi-database"></i><span id="ddCollectionLineageSource">t_sales_order<small>业务系统 → 测试业务系统</small></span></div><div class="dd-collection-lineage-arrow named"><span><b id="ddCollectionLineageName">单表采集子流程1-1</b></span><i class="bi bi-chevron-right"></i></div><div class="target"><i class="bi bi-table"></i><span id="ddCollectionLineageTarget">ods_sales_order<small>ODS-贴源层 → 中电数智_ODS</small></span></div></div></div>' +
            '<div class="dd-collection-side-panel" data-collection-side="params"><div class="dd-collection-side-heading"><h3>参数</h3><button class="btn btn-primary" type="button" data-collection-action="add-param"><i class="bi bi-plus-circle"></i> 添加参数</button></div><div class="dd-collection-param-table-wrap"><table class="dd-collection-param-table"><thead><tr><th>参数名</th><th>参数说明</th><th>数据格式</th><th>默认值</th><th>操作</th></tr></thead><tbody id="ddCollectionParamBody"><tr><td><input type="text" value="biz_date" maxlength="15" data-collection-param-name></td><td><input type="text" value="业务日期" maxlength="50"></td><td><select data-collection-param-format><option>字符串</option><option>密码</option><option>函数</option><option>mm</option><option>HH</option><option>dd</option><option>MM</option><option>yyyy</option><option>yyyy-MM</option><option selected>yyyy-MM-dd</option><option>yyyy-MM-dd HH</option><option>yyyy-MM-dd HH:mm</option><option>yyyy-MM-dd HH:mm:ss</option><option>yyyyMM</option><option>yyyyMMdd</option><option>yyyyMMddHH</option><option>yyyyMMddHHmm</option><option>yyyyMMddHHmmss</option><option>yyyy/MM</option><option>yyyy/MM/dd</option><option>yyyy/MM/dd HH</option><option>yyyy/MM/dd HH:mm</option><option>yyyy/MM/dd HH:mm:ss</option><option>时间戳</option></select></td><td><input type="date" value="2026-09-17" data-collection-param-value></td><td><button class="dd-collection-icon-action danger" type="button" title="删除" data-collection-action="delete-param"><i class="bi bi-x-lg"></i></button></td></tr></tbody></table></div><p class="dd-collection-rule">字母、数字、下划线，必须以字母开头，15个字符以内；</p></div>' +
            '<div class="dd-collection-side-panel" data-collection-side="dependency"><div class="dd-collection-dependency-head"><strong>前置任务</strong><span>（最多100个）</span><button class="btn btn-primary" type="button" data-collection-action="add-dependency"><i class="bi bi-plus-lg"></i> 添加</button></div><div id="ddCollectionDependencyList" class="dd-collection-dependency-list"></div></div>' +
          '</div><div class="dd-sidebar-strip dd-collection-side-tabs"><div class="dd-sidebar-tab active" data-collection-side-tab="basic">基本信息</div><div class="dd-sidebar-tab" data-collection-side-tab="version">版本信息</div><div class="dd-sidebar-tab" data-collection-side-tab="lineage">血缘关系</div><div class="dd-sidebar-tab" data-collection-side-tab="params">参数</div><div class="dd-sidebar-tab" data-collection-side-tab="dependency">前置依赖</div></div></div>' +

          '<div class="dd-collection-modal-mask" id="ddCollectionPreviewModal"><section class="dd-collection-modal dd-collection-preview-modal" role="dialog" aria-modal="true"><header><h3>数据预览</h3><button type="button" data-collection-close="preview" title="关闭"><i class="bi bi-x-lg"></i></button></header><div class="dd-collection-preview-scroll"><table><thead><tr><th>order_id</th><th>store_id</th><th>order_amount</th><th>order_status</th><th>create_time</th></tr></thead><tbody><tr><td>SO202609170001</td><td>SZ001</td><td>286.50</td><td>PAID</td><td>2026-09-17 08:15:32</td></tr><tr><td>SO202609170002</td><td>GZ006</td><td>128.00</td><td>SHIPPED</td><td>2026-09-17 08:17:09</td></tr><tr><td>SO202609170003</td><td>FS003</td><td>459.90</td><td>PAID</td><td>2026-09-17 08:20:41</td></tr></tbody></table></div><footer><span>共预览 3 条记录</span><button class="btn" type="button" data-collection-close="preview"><i class="bi bi-x-lg"></i> 关闭</button></footer></section></div>' +

          '<div class="dd-collection-modal-mask" id="ddCollectionFilterModal"><section class="dd-collection-modal dd-collection-filter-modal" role="dialog" aria-modal="true"><header><h3>数据筛选（<span id="ddCollectionFilterField">字段</span>）</h3><button type="button" data-collection-close="filter"><i class="bi bi-x-lg"></i></button></header><div class="dd-collection-filter-tabs"><button class="active" type="button" data-filter-tab="range">数据范围</button><button type="button" data-filter-tab="fixed">固定时间</button><button type="button" data-filter-tab="param">动态参数应用</button><button type="button" data-filter-tab="time">动态时间</button><button type="button" data-filter-tab="expression">过滤表达式</button><button type="button" data-filter-tab="convert">字段类型转换</button></div><div class="dd-collection-filter-content" data-filter-content="range"><label><span>筛选条件</span><select id="ddCollectionFilterOperator"><option value="">请选择</option><option>非空</option><option>为空</option><option>包含</option><option>不包含</option><option>等于</option><option>不等于</option><option>大于</option><option>大于等于</option><option>小于</option><option>小于等于</option><option>like</option><option>区间内</option><option>区间外</option></select></label><label><span>过滤值</span><input id="ddCollectionFilterValue" type="text"></label><div class="dd-collection-filter-note"><strong>注释</strong><p>1、筛选条件选择区间内，筛选数据包含最大值和最小值</p><p>2、筛选条件选择区间外，筛选数据不包含最大值和最小值</p><p>3、区间内和区间外的最小值、最大值允许其中1个为空</p></div></div><div class="dd-collection-filter-placeholder" data-filter-placeholder>请选择上方筛选类型配置当前字段。</div><footer><button class="btn" type="button" data-collection-action="clear-filter"><i class="bi bi-eraser"></i> 清空</button><button class="btn btn-primary" type="button" data-collection-action="confirm-filter"><i class="bi bi-check-lg"></i> 确定</button></footer></section></div>' +

          '<div class="dd-collection-modal-mask" id="ddCollectionTableModal"><section class="dd-collection-drawer" role="dialog" aria-modal="true"><header><h3>新建表</h3><button type="button" data-collection-close="table"><i class="bi bi-x-lg"></i></button></header><div class="dd-collection-create-modes"><label><input type="radio" name="collectionCreateMode" value="param" checked> 参数建表</label><label><input type="radio" name="collectionCreateMode" value="sql"> SQL建表</label></div><div class="dd-collection-create-body" data-create-mode="param"><div class="dd-collection-create-form"><label><span>表名</span><div><select><option>自定义</option></select><input id="ddCollectionNewTableName" type="text" value="ods_sales_order_detail"></div></label><label><span>更新标识</span><select><option>按小时全量（hf）</option></select></label><label class="wide"><span>表说明</span><input type="text" value="销售订单明细贴源表"></label></div><div class="dd-collection-create-section"><div><strong>分区</strong><button class="btn" type="button" data-collection-action="add-partition"><i class="bi bi-plus-lg"></i> 新增</button></div><table><thead><tr><th>中文字段名</th><th>英文分区名</th><th>数据类型</th><th>操作</th></tr></thead><tbody id="ddCollectionPartitionBody"><tr><td><input value="业务日期"></td><td><input value="dt"></td><td><select><option>STRING</option></select></td><td><button type="button" data-collection-action="remove-create-row"><i class="bi bi-trash"></i></button></td></tr></tbody></table></div><div class="dd-collection-create-section"><div><strong>输出列设置</strong><span><button class="btn" type="button" data-collection-action="add-output-column"><i class="bi bi-plus-lg"></i> 新增列</button><button class="btn" type="button" data-collection-action="uppercase-fields"><i class="bi bi-type"></i> 字段大写</button></span></div><div class="dd-collection-create-table-wrap"><table><thead><tr><th>中文字段</th><th>英文字段</th><th>数据类型</th><th>字段长度</th><th>精度</th><th>描述</th><th>操作</th></tr></thead><tbody id="ddCollectionOutputBody"></tbody></table></div></div><button class="dd-collection-advanced" type="button" data-collection-action="table-advanced"><i class="bi bi-chevron-down"></i> 高级设置</button><label class="dd-collection-auto-sql"><input type="checkbox"> 自动生成【SQL建表】语句</label></div><div class="dd-collection-create-body dd-collection-create-sql" data-create-mode="sql"><div class="dd-collection-mini-editor"><div class="dd-collection-editor-toolbar"><select><option>暗色 - One Dark</option></select><button type="button" data-collection-editor-action="format"><i class="bi bi-text-indent-left"></i> 格式化</button><button type="button" data-collection-editor-action="copy"><i class="bi bi-clipboard"></i> 复制</button></div><textarea spellcheck="false">CREATE TABLE ods_sales_order_detail (\n  order_id STRING,\n  store_id STRING,\n  order_amount DECIMAL(18,2),\n  create_time TIMESTAMP\n) PARTITIONED BY (dt STRING);</textarea></div></div><footer><button class="btn" type="button" data-collection-action="reset-table"><i class="bi bi-arrow-counterclockwise"></i> 恢复默认</button><button class="btn btn-primary" type="button" data-collection-action="confirm-table"><i class="bi bi-check-lg"></i> 确定</button></footer></section></div>' +

          '<div class="dd-collection-toast" id="ddCollectionToast" role="status" aria-live="polite"></div>' +
        '</div>' +

        /* --- 程序包子流程配置（隐藏） --- */
        '<div class="dd-package-view" id="ddPackageView" style="display:none">' +
          '<div class="dd-package-main">' +
            '<div class="dd-header dd-package-header">' +
              '<div class="dd-tabs"><a class="dd-tab active">流程编辑</a><a class="dd-tab">测试日志</a><a class="dd-tab" data-package-batch-only>影响分析</a></div>' +
              '<div class="dd-actions">' +
                '<button class="btn btn-primary" type="button" data-config-action="启动调度" data-package-batch-only><i class="bi bi-clock-history"></i> 启动调度</button>' +
                '<button class="btn" type="button" data-config-action="导入"><i class="bi bi-box-arrow-in-down"></i> 导入</button>' +
                '<button class="btn" type="button" data-config-action="导出"><i class="bi bi-box-arrow-up"></i> 导出</button>' +
                '<button class="btn" type="button" data-config-action="执行"><i class="bi bi-play-circle"></i> 执行</button>' +
              '</div>' +
            '</div>' +
            '<div class="dd-package-content">' +
              '<div class="dd-config-card">' +
                '<div class="dd-config-title"><i class="bi bi-box-seam"></i><span>程序包配置</span></div>' +
                '<div class="dd-config-form-grid">' +
                  '<label><span><em>*</em> 流程类型</span><select id="ddPackageFlowType"><option>批量数据采集流程</option><option>流式数据处理流程</option></select></label>' +
                  '<label><span><em>*</em> 程序类型</span><select id="ddPackageProgramType"><option>Java程序</option><option>Flink Java</option><option>Sqoop Job</option><option>Shell脚本</option><option>ImpalaSQL</option><option>HiveSQL</option><option>python脚本</option></select></label>' +
                  '<div class="dd-config-radio wide"><span>上传方式</span><label><input type="radio" name="ddPackageUpload" checked> 选择已有程序包</label><label><input type="radio" name="ddPackageUpload"> 上传新程序包</label></div>' +
                  '<label class="wide"><span><em>*</em> 程序文件</span><div class="dd-config-file"><button class="btn" type="button" data-config-action="上传程序包"><i class="bi bi-upload"></i> 上传程序包</button><strong id="ddPackageFile">order-etl-job.jar</strong></div></label>' +
                  '<label><span>主脚本/包名称</span><input id="ddPackageMain" type="text" value="order-etl-job.jar"></label>' +
                  '<label><span>启动类</span><input id="ddPackageClass" type="text" value="com.company.trade.OrderEtlMain"></label>' +
                  '<label class="wide"><span>传入的参数</span><input id="ddPackageArgs" type="text" value="${biz_date},${batch_no}"></label>' +
                '</div>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div class="dd-config-sidebar">' +
            '<div class="dd-config-side-content">' +
              '<div class="dd-config-side-panel active" data-package-side="basic"><h3>基本信息</h3><label><span>流程名称</span><input id="ddPackageName" type="text" value="上传程序包子流程1-1"></label><label><span>版本</span><div class="dd-config-inline"><input type="text" value="V1" disabled><button type="button" data-config-action="另存为"><i class="bi bi-files"></i> 另存为</button></div></label><div class="dd-config-info"><span>调度信息</span><strong>未调度</strong></div><label><span>流程描述</span><textarea id="ddPackageDescription" rows="4">运行订单主题数据加工程序包。</textarea></label><button class="btn btn-primary dd-config-save" type="button" data-config-action="保存流程"><i class="bi bi-save"></i> 保存流程</button></div>' +
              '<div class="dd-config-side-panel" data-package-side="version"><h3>版本信息</h3><table><thead><tr><th>版本号</th><th>创建者</th><th>修改时间</th></tr></thead><tbody><tr><td>V1</td><td>王晓峰</td><td>2026-09-17 10:15:26</td></tr></tbody></table></div>' +
              '<div class="dd-config-side-panel" data-package-side="params"><h3>参数</h3><table><thead><tr><th>参数名</th><th>参数值</th></tr></thead><tbody><tr><td>biz_date</td><td>${biz_date}</td></tr><tr><td>batch_no</td><td>${batch_no}</td></tr></tbody></table></div>' +
              '<div class="dd-config-side-panel" data-package-side="lineage" data-package-stream-only style="display:none"><h3>血缘关系</h3><div class="dd-config-empty"><i class="bi bi-diagram-3"></i><span>运行后生成流式血缘关系</span></div></div>' +
              '<div class="dd-config-side-panel" data-package-side="dependency" data-package-batch-only><h3>依赖任务</h3><div class="dd-config-empty"><i class="bi bi-link-45deg"></i><span>暂无依赖任务</span></div></div>' +
            '</div>' +
            '<div class="dd-sidebar-strip"><div class="dd-sidebar-tab active" data-package-side-tab="basic">基本信息</div><div class="dd-sidebar-tab" data-package-side-tab="version">版本信息</div><div class="dd-sidebar-tab" data-package-side-tab="lineage" data-package-stream-only style="display:none">血缘关系</div><div class="dd-sidebar-tab" data-package-side-tab="params">参数</div><div class="dd-sidebar-tab" data-package-side-tab="dependency" data-package-batch-only>依赖任务</div></div>' +
          '</div>' +
          '<div class="dd-config-toast" data-config-toast role="status" aria-live="polite"></div>' +
        '</div>' +

        /* --- 前置任务节点配置（隐藏） --- */
        '<div class="dd-trigger-view" id="ddTriggerView" style="display:none">' +
          '<div class="dd-header dd-trigger-header"><div class="dd-trigger-title"><i class="bi bi-signpost-split"></i><span>前置任务配置</span></div><div class="dd-actions"><button class="btn btn-primary" type="button" data-config-action="保存前置任务"><i class="bi bi-save"></i> 保存</button></div></div>' +
          '<div class="dd-trigger-body">' +
            '<div class="dd-config-card dd-trigger-card">' +
              '<div class="dd-config-title"><i class="bi bi-diagram-2"></i><span>任务触发条件</span></div>' +
              '<div class="dd-trigger-name"><label><span><em>*</em> 名称</span><input id="ddTriggerName" type="text" value="前置任务"></label></div>' +
              '<div class="dd-trigger-section-head"><div><strong>前置任务</strong><span>（最多100个）</span></div><button class="btn" type="button" data-trigger-add><i class="bi bi-plus-circle"></i> 添加</button></div>' +
              '<div class="dd-trigger-list" id="ddTriggerList">' +
                '<div class="dd-trigger-row"><select><option>数据中台演示</option></select><select><option>项目开发_演示</option></select><select class="wide"><option>项目开发_共享任务演示</option></select><select><option>V1</option></select><button type="button" data-trigger-remove title="移除"><i class="bi bi-trash3"></i><span>移除</span></button></div>' +
              '</div>' +
              '<div class="dd-trigger-note"><i class="bi bi-info-circle"></i><span>所选前置任务成功完成后，当前业务流程才能继续执行。</span></div>' +
            '</div>' +
          '</div>' +
          '<div class="dd-config-toast" data-config-toast role="status" aria-live="polite"></div>' +
        '</div>' +

        /* --- 流式子流程定制（隐藏；业务流程根节点仍使用列表） --- */
        '<div class="dd-stream-designer-view" id="ddStreamDesignerView" style="display:none">' +
          '<div class="dd-stream-designer-tabs"><a class="active">流程定制</a><a>运行日志</a><a>流程监控</a><a>Spark日志</a></div>' +
          '<div class="dd-stream-designer-body">' +
            '<aside class="dd-atom-panel"><div class="dd-atom-search"><input type="text" placeholder="搜索元子"><i class="bi bi-search"></i></div><div class="dd-atom-list"><details open><summary><i class="bi bi-folder-fill"></i>输入</summary><span>流式读ES</span><span>流式读kudu</span><span>流式读ActiveMQ</span><span>读数据库</span><span>读kafka</span><span>读HBase</span><span>读MongoDB</span><span>读Hive</span></details><details><summary><i class="bi bi-folder-fill"></i>过滤</summary><span>窗口过滤</span><span>空值过滤</span><span>字段过滤</span><span>时间过滤</span></details><details><summary><i class="bi bi-folder-fill"></i>抽取</summary><span>时间抽取</span><span>正则提取</span></details><details><summary><i class="bi bi-folder-fill"></i>转换</summary><span>半结构数据解析</span><span>字符集转码</span><span>类型转换</span><span>字段定义</span><span>流式数据分列</span><span>合并列</span><span>时间转换</span><span>替换</span><span>空值填充</span></details><details><summary><i class="bi bi-folder-fill"></i>处理</summary><span>数据延迟配置</span><span>流式汇总统计</span><span>窗口统计</span><span>流式数据集关联</span><span>数据集合并</span></details><details><summary><i class="bi bi-folder-fill"></i>输出</summary><span>流式写kudu</span><span>流式写MongoDB</span><span>流式写HIVE</span><span>流式写HBase</span><span>流式写HDFS</span><span>流式写kafka</span><span>流式写数据库</span><span>流式写Elasticsearch</span><span>流式写ActiveMQ</span></details><details><summary><i class="bi bi-folder-fill"></i>自定义</summary><span>获取json中最后一个value</span><span>增加UUID11121</span></details></div></aside>' +
            '<main class="dd-stream-design-main">' +
              '<div class="dd-stream-design-actions"><button class="btn" type="button" data-config-action="另存流程"><i class="bi bi-files"></i> 另存流程</button><button class="btn" type="button" data-config-action="导出流程"><i class="bi bi-box-arrow-up"></i> 导出流程</button><button class="btn" type="button" data-config-action="流程截屏"><i class="bi bi-camera"></i> 流程截屏</button><button class="btn btn-primary" type="button" data-config-action="运行"><i class="bi bi-play-circle"></i> 运行</button></div>' +
              '<div class="dd-stream-design-canvas"><svg id="ddStreamDesignEdges" aria-hidden="true"></svg><div id="ddStreamDesignNodes"></div></div>' +
            '</main>' +
            '<aside class="dd-stream-design-sidebar">' +
              '<div class="dd-stream-side-content"><div class="dd-stream-side-panel active" data-stream-design-side="basic"><h3>基本信息</h3><label><span>流程名称 <em>*</em></span><input id="ddStreamDesignName" type="text"></label><label><span>备注</span><input id="ddStreamDesignRemark" type="text" value="实时接入并处理业务事件流"></label><label><span>运行参数设置</span><textarea rows="8">--num-executors=2\n--executor-memory=1G\n--master=yarn\n--deploy-mode=client</textarea></label><button class="dd-stream-advanced" type="button" data-config-action="高级设置"><i class="bi bi-chevron-up"></i> 高级设置</button><button class="btn btn-primary dd-config-save" type="button" data-config-action="保存流程"><i class="bi bi-save"></i> 保存流程</button></div><div class="dd-stream-side-panel" data-stream-design-side="version"><h3>版本信息</h3><table><thead><tr><th>版本</th><th>状态</th><th>更新时间</th></tr></thead><tbody><tr><td>V1</td><td>未启动</td><td>2026-09-17 10:32:08</td></tr></tbody></table></div><div class="dd-stream-side-panel" data-stream-design-side="lineage"><h3>血缘关系</h3><div class="dd-config-empty"><i class="bi bi-diagram-3"></i><span>运行后生成流式血缘关系</span></div></div></div>' +
              '<div class="dd-sidebar-strip"><div class="dd-sidebar-tab active" data-stream-design-side-tab="basic">基本信息</div><div class="dd-sidebar-tab" data-stream-design-side-tab="version">版本信息</div><div class="dd-sidebar-tab" data-stream-design-side-tab="lineage">血缘关系</div></div>' +
            '</aside>' +
          '</div>' +
          '<div class="dd-config-toast" data-config-toast role="status" aria-live="polite"></div>' +
        '</div>' +

        /* --- 流式数据采集流程（系统表单） --- */
        '<div class="dd-special-view" id="ddStreamCollectView" style="display:none">' +
          '<div class="dd-special-main">' +
            '<div class="dd-header dd-special-header"><div class="dd-tabs"><a class="dd-tab active" data-special-tab="properties">任务属性</a><a class="dd-tab" data-special-tab="logs">任务日志</a></div><div class="dd-actions"><button class="btn btn-primary" type="button" data-config-action="保存"><i class="bi bi-save"></i> 保存</button><button class="btn" type="button" data-config-action="运行"><i class="bi bi-play-circle"></i> 运行</button><button class="btn btn-success" type="button" data-config-action="发布"><i class="bi bi-cloud-arrow-up"></i> 发布</button><button class="btn" type="button" data-config-action="导入流程"><i class="bi bi-box-arrow-in-down"></i> 导入流程</button><button class="btn" type="button" data-config-action="导出流程"><i class="bi bi-box-arrow-up"></i> 导出流程</button></div></div>' +
            '<div class="dd-special-scroll" data-special-content="properties">' +
              '<section class="dd-special-card"><header><b>1</b><span>获取数据源</span></header><div class="dd-special-grid">' +
                '<label><span><em>*</em> 数据源</span><select id="ddStreamSourceType"><option>activeMq</option><option>DB2</option><option>DM8</option><option>Doris</option><option>Elasticsearch</option><option>FTP</option><option>Gaussdb</option><option>Greenplum</option><option>HANA</option><option>HBase</option><option>HDFS</option><option>Hive</option><option>Http</option><option>IBMMQ</option><option>Iceberg</option><option>Impala</option><option>Informix</option><option>KADB</option><option selected>Kafka</option><option>KingBase</option><option>Mariadb</option><option>MongoDB</option><option>MQTT</option><option>MySQL</option><option>MySQL8</option><option>OceanBase</option><option>Oracle</option><option>Oscar</option><option>PolarDB</option><option>postgis</option><option>PostgreSQL</option><option>Presto</option><option>Rabbitmq</option><option>SqlServer</option><option>StarRocks</option><option>TDengine</option><option>TDSQL</option><option>TiDB</option></select></label>' +
                '<div class="dd-stream-dynamic-fields wide" id="ddStreamSourceFields"></div>' +
              '</div></section>' +
              '<section class="dd-special-card"><header><b>2</b><span>写数据配置</span></header><div class="dd-special-grid">' +
                '<label><span><em>*</em> 数据源</span><select id="ddStreamWriterType"><option>activeMq</option><option>DB2</option><option>DM8</option><option>Doris</option><option>Elasticsearch</option><option>FTP</option><option>Gaussdb</option><option>Greenplum</option><option>HANA</option><option>HBase</option><option>HDFS</option><option>Hive</option><option>IBMMQ</option><option>Iceberg</option><option>Impala</option><option>Informix</option><option>KADB</option><option selected>Kafka</option><option>KingBase</option><option>Mariadb</option><option>MongoDB</option><option>MQTT</option><option>MySQL</option><option>MySQL8</option><option>OceanBase</option><option>Oracle</option><option>Oscar</option><option>PolarDB</option><option>postgis</option><option>PostgreSQL</option><option>Presto</option><option>Rabbitmq</option><option>SqlServer</option><option>StarRocks</option><option>TDengine</option><option>TDSQL</option><option>TiDB</option></select></label>' +
                '<div class="dd-stream-dynamic-fields wide" id="ddStreamWriterFields"></div>' +
              '</div></section>' +
              '<section class="dd-special-card"><header><b>3</b><span>参数&amp;写表字段匹配</span></header><div class="dd-field-match" id="ddStreamFieldMapping"></div></section>' +
            '</div>' +
            '<div class="dd-special-log" data-special-content="logs" style="display:none"><div class="dd-config-empty"><i class="bi bi-journal-text"></i><span>运行后展示任务日志</span></div></div>' +
          '</div>' +
          '<div class="dd-resize-col dd-resize-special" id="ddStreamCollectResize"></div>' +
          '<aside class="dd-special-sidebar"><div class="dd-special-side-content"><div class="dd-special-side-panel active" data-stream-collect-side="basic"><h3>基本信息</h3><label><span>流程名称</span><input id="ddStreamCollectName" value="流式数据采集流程-订单事件"></label><label><span>版本</span><div class="dd-config-inline"><input value="V1" disabled><button type="button" data-config-action="另存为">另存为</button></div></label><label><span>流程描述</span><textarea rows="4">采集订单事件并写入实时消息主题。</textarea></label><button class="btn btn-primary dd-config-save" type="button" data-config-action="保存流程"><i class="bi bi-save"></i> 保存流程</button></div><div class="dd-special-side-panel" data-stream-collect-side="version"><h3>版本信息</h3><table><thead><tr><th>版本</th><th>状态</th><th>修改时间</th></tr></thead><tbody><tr><td>V1</td><td>未启动</td><td>2026-09-20 09:18:26</td></tr></tbody></table></div><div class="dd-special-side-panel" data-stream-collect-side="lineage"><h3>血缘关系</h3><div class="dd-special-lineage"><span id="ddStreamLineageSource">Kafka · trade_order_event</span><i class="bi bi-arrow-right"></i><b id="ddStreamLineageProcess">流式数据采集流程-订单事件</b><i class="bi bi-arrow-right"></i><span id="ddStreamLineageTarget">Kafka · dwd_order_event</span></div></div></div><div class="dd-sidebar-strip"><div class="dd-sidebar-tab active" data-stream-collect-side-tab="basic">基本信息</div><div class="dd-sidebar-tab" data-stream-collect-side-tab="version">版本信息</div><div class="dd-sidebar-tab" data-stream-collect-side-tab="lineage">血缘关系</div></div></aside>' +
          '<div class="dd-config-toast" data-config-toast role="status" aria-live="polite"></div>' +
        '</div>' +

        /* --- 数据同步（Flink CDC）表单 --- */
        '<div class="dd-special-view" id="ddFlinkCdcView" style="display:none">' +
          '<div class="dd-special-main"><div class="dd-header dd-special-header"><div class="dd-tabs"><a class="dd-tab active" data-special-tab="properties">任务属性</a><a class="dd-tab" data-special-tab="logs">测试日志</a></div><div class="dd-actions"><button class="btn" type="button" data-config-action="执行"><i class="bi bi-play-circle"></i> 执行</button><button class="btn btn-primary" type="button" data-config-action="保存"><i class="bi bi-save"></i> 保存</button></div></div>' +
            '<div class="dd-special-scroll" data-special-content="properties">' +
              '<section class="dd-special-card"><header><b>1</b><span>读数据配置</span></header><div class="dd-special-grid"><label><span><em>*</em> 数据类型</span><select id="ddCdcReadType"><option>Doris</option><option>Greenplum</option><option>Hive</option><option>Impala</option><option>KingBase</option><option selected>MySQL</option><option>MySQL8</option><option>Oracle</option><option>PostgreSQL</option><option>SqlServer</option><option>StarRocks</option><option>TiDB</option></select></label><div class="dd-cdc-dynamic-fields wide" id="ddCdcReadFields"></div></div></section>' +
              '<section class="dd-special-card"><header><b>2</b><span>写数据配置</span></header><div class="dd-special-grid"><label><span><em>*</em> 数据类型</span><select id="ddCdcWriteType"><option>DM8</option><option>Doris</option><option>Greenplum</option><option selected>Hive</option><option>Impala</option><option>Kafka</option><option>KingBase</option><option>MySQL</option><option>MySQL8</option><option>Oracle</option><option>PostgreSQL</option><option>SqlServer</option><option>StarRocks</option><option>TiDB</option></select></label><div class="dd-cdc-dynamic-fields wide" id="ddCdcWriteFields"></div></div></section>' +
              '<section class="dd-special-card"><header><b>3</b><span>表配置</span></header><div id="ddCdcTableConfig"></div></section>' +
              '<section class="dd-special-card"><header><b>4</b><span>运行参数配置</span></header><div class="dd-cdc-run-title"><span>运行参数</span><button class="btn" type="button" data-cdc-action="restore-params"><i class="bi bi-arrow-counterclockwise"></i> 恢复默认</button></div><div class="dd-run-param"><div class="dd-collection-editor-toolbar"><select aria-label="编辑器主题"><option>暗色 - One Dark</option></select><select aria-label="编辑器字号"><option selected>14px</option></select><button type="button" data-cdc-action="format-params"><i class="bi bi-sliders"></i> 格式化</button><button type="button" data-cdc-action="copy-params"><i class="bi bi-clipboard"></i> 复制</button><button type="button" data-cdc-action="search-params"><i class="bi bi-search"></i> 搜索</button><button type="button" data-cdc-action="fullscreen-params"><i class="bi bi-arrows-fullscreen"></i> 全屏</button></div><textarea id="ddCdcRunParams" spellcheck="false"># ==================== 并行度配置 ====================\n# 每个TaskManager的slot数量 默认值: 1\ntaskmanager.numberOfTaskSlots=1\n# YARN容器vcore数量 默认值: 取决于slot数\n# yarn.containers.vcores=2\n# Schema操作RPC超时时间 默认值: 30s\n# pipeline.schema-operator.rpc-timeout=30s\n\n# ==================== 内存配置 ====================\n# JobManager进程总内存大小 默认值: 1600m\n# jobmanager.memory.process.size=2000m\n# JobManager JVM堆内存大小 默认值: 由process.size自动计算\n# jobmanager.memory.heap.size=1024m\n# TaskManager进程总内存大小 默认值: 1728m\n# taskmanager.memory.process.size=3000m\n# TaskManager JVM Overhead最小值，报错时可修改范围 默认值: 192m\n# taskmanager.memory.jvm-overhead.min=64m\n# TaskManager JVM Overhead最大值，报错时可修改范围 默认值: 1024m\n# taskmanager.memory.jvm-overhead.max=1024m\n# TaskManager JVM堆内存大小 默认值: 由process.size自动计算\n# taskmanager.memory.task.heap.size=512m\n# TaskManager托管内存大小，用于RocksDB等 默认值: 由process.size的40%计算\n# taskmanager.memory.managed.size=512m\n# 托管内存占比 默认值: 0.4(40%)\n# taskmanager.memory.managed.fraction=0.4\n# 网络缓冲区内存占比 默认值: 0.1(10%)\n# taskmanager.memory.network.fraction=0.1\n\n# ==================== Checkpoint 配置 ====================\n# checkpoint触发间隔(毫秒)，建议生产环境设置为60000-300000ms 默认值: 无(需显式配置)，推荐值: 60000\nexecution.checkpointing.interval=60000\n# checkpoint模式: EXACTLY_ONCE(精确一次) 或 AT_LEAST_ONCE(至少一次) 默认值: EXACTLY_ONCE\n# execution.checkpointing.mode=EXACTLY_ONCE\n# checkpoint超时时间(毫秒)，超过此时间checkpoint将被丢弃 默认值: 600000(10分钟)\n# execution.checkpointing.timeout=600000\n# 两次checkpoint之间的最小间隔(毫秒)，避免checkpoint过于频繁 默认值: 0\nexecution.checkpointing.min-pause=500\n# 同时允许的最大checkpoint数量 默认值: 1\n# execution.checkpointing.max-concurrent-checkpoints=1</textarea></div><p class="dd-special-tip">提示：运行参数将在FlinkCDC任务启动时使用，支持Flink原生参数配置。</p></section>' +
            '</div><div class="dd-special-log" data-special-content="logs" style="display:none"><div class="dd-config-empty"><i class="bi bi-terminal"></i><span>执行测试后展示测试日志</span></div></div>' +
          '</div>' +
          '<div class="dd-resize-col dd-resize-special" id="ddFlinkCdcResize"></div>' +
          '<aside class="dd-special-sidebar"><div class="dd-special-side-content"><div class="dd-special-side-panel active" data-cdc-side="basic"><h3>基本信息</h3><label><span>流程名称</span><input id="ddFlinkCdcName" value="数据同步(Flink CDC)-订单增量"></label><label><span>版本</span><div class="dd-config-inline"><input value="V1" disabled><button type="button" data-config-action="另存为">另存为</button></div></label><label><span>流程描述</span><textarea rows="4">实时同步订单与门店主数据变更。</textarea></label><button class="btn btn-primary dd-config-save" type="button" data-config-action="保存流程"><i class="bi bi-save"></i> 保存流程</button></div><div class="dd-special-side-panel" data-cdc-side="version"><h3>版本信息</h3><table><thead><tr><th>版本</th><th>状态</th><th>修改时间</th></tr></thead><tbody><tr><td>V1</td><td>未启动</td><td>2026-09-20 09:26:40</td></tr></tbody></table></div><div class="dd-special-side-panel" data-cdc-side="lineage"><h3>血缘关系</h3><div class="dd-special-lineage"><span id="ddCdcLineageSource">MySQL · t_sales_order</span><i class="bi bi-arrow-right"></i><b id="ddCdcLineageProcess">数据同步(Flink CDC)-订单增量</b><i class="bi bi-arrow-right"></i><span id="ddCdcLineageTarget">Hive · ods_t_sales_order_hf</span></div></div><div class="dd-special-side-panel" data-cdc-side="runtime"><h3>运行参数</h3><table><tbody><tr><th>并行度</th><td>1</td></tr><tr><th>Checkpoint</th><td>60000ms</td></tr><tr><th>最小间隔</th><td>500ms</td></tr></tbody></table></div></div><div class="dd-sidebar-strip"><div class="dd-sidebar-tab active" data-cdc-side-tab="basic">基本信息</div><div class="dd-sidebar-tab" data-cdc-side-tab="version">版本信息</div><div class="dd-sidebar-tab" data-cdc-side-tab="lineage">血缘关系</div><div class="dd-sidebar-tab" data-cdc-side-tab="runtime">运行参数</div></div></aside>' +
          '<div class="dd-cdc-add-mask" id="ddCdcAddTableModal" aria-hidden="true"><section class="dd-cdc-add-drawer" role="dialog" aria-modal="true" aria-labelledby="ddCdcAddTitle"><header><h3 id="ddCdcAddTitle">添加表</h3><button type="button" data-cdc-action="close-table-modal" title="关闭"><i class="bi bi-x-lg"></i></button></header><div class="dd-cdc-add-body"><div class="dd-cdc-add-tools"><button class="btn" type="button" data-cdc-action="select-all-available"><i class="bi bi-check2-square"></i> 全选</button><div><input id="ddCdcAvailableSearch" placeholder="请输入表名"><button class="btn btn-primary" type="button" data-cdc-action="search-available"><i class="bi bi-search"></i> 查询</button></div></div><div class="dd-cdc-add-table" id="ddCdcAvailableTables"></div></div><footer><button class="btn" type="button" data-cdc-action="close-table-modal">取消</button><button class="btn btn-primary" type="button" data-cdc-action="confirm-add-tables">确定</button></footer></section></div>' +
          '<div class="dd-config-toast" data-config-toast role="status" aria-live="polite"></div>' +
        '</div>' +

        /* --- 编辑器视图（隐藏） --- */
        '<div class="dd-editor-panel" id="ddEditorView" style="display:none">' +
          '<div class="dd-editor-left">' +
            '<div class="dd-header dd-header-editor">' +
              '<div class="dd-tabs">' +
                '<a class="dd-tab active" data-editor-tab="config">流程配置</a>' +
                '<a class="dd-tab" data-editor-tab="log">执行记录</a>' +
                '<a class="dd-tab" data-editor-tab="impact">影响分析</a>' +
              '</div>' +
              '<div class="dd-actions">' +
                '<button class="btn btn-primary" data-editor-action="import"><i class="bi bi-box-arrow-in-down"></i> 导入</button>' +
                '<button class="btn btn-primary" data-editor-action="export"><i class="bi bi-box-arrow-up"></i> 导出</button>' +
                '<button class="btn btn-primary" data-editor-action="save"><i class="bi bi-save"></i> 保存</button>' +
                '<button class="btn" data-editor-action="execute">调试执行</button>' +
              '</div>' +
            '</div>' +
            '<div class="dd-code-area" id="ddCodeArea">' +
              '<div class="dd-code-toolbar" id="ddCodeToolbar">' +
                '<select class="dd-ct-sel" id="ddCtTheme"><option value="dark">暗色 - One Dark</option><option value="light">亮色 - Light</option></select>' +
                '<select class="dd-ct-sel dd-ct-sel-sm" id="ddCtFontSize"><option>12px</option><option>13px</option><option selected>14px</option><option>15px</option><option>16px</option><option>18px</option><option>20px</option></select>' +
                '<button class="dd-ct-btn" id="ddCtFormat"><i class="bi bi-sliders"></i> 格式化</button>' +
                '<button class="dd-ct-btn" id="ddCtCopy"><i class="bi bi-clipboard"></i> 复制</button>' +
                '<button class="dd-ct-btn" id="ddCtSearch"><i class="bi bi-search"></i> 搜索</button>' +
                '<button class="dd-ct-btn" id="ddCtFullscreen"><i class="bi bi-arrows-fullscreen"></i> 全屏</button>' +
              '</div>' +
              '<div class="dd-code-searchbar" id="ddCodeSearchbar" style="display:none">' +
                '<input class="dd-cs-input" type="text" placeholder="查找...">' +
                '<button class="dd-cs-btn">下一个</button>' +
                '<button class="dd-cs-btn">上一个</button>' +
                '<button class="dd-cs-btn">全选</button>' +
                '<label class="dd-cs-check"><input type="checkbox"> 区分大小写</label>' +
                '<label class="dd-cs-check"><input type="checkbox"> 使用正则表达式</label>' +
                '<label class="dd-cs-check"><input type="checkbox"> 全字匹配</label>' +
                '<input class="dd-cs-input" type="text" placeholder="替换...">' +
                '<button class="dd-cs-btn">替换</button>' +
                '<button class="dd-cs-btn">全部替换</button>' +
                '<span class="dd-cs-close" id="ddCsClose"><i class="bi bi-x"></i></span>' +
              '</div>' +
              '<div class="dd-code-editor-wrap">' +
                '<div class="dd-code-gutter" id="ddCodeGutter"></div>' +
                '<div class="dd-code-content" id="ddCodeContent" contenteditable="true" spellcheck="false"></div>' +
              '</div>' +
            '</div>' +
            '<div class="dd-editor-bottom" id="ddEditorBottom">' +
              '<div class="dd-editor-resize" id="ddEditorResize"></div>' +
              '<div class="dd-editor-bottom-tabs">' +
                '<a class="dd-bottom-tab active" data-tab="info">执行信息</a>' +
                '<a class="dd-bottom-tab" data-tab="result">执行结果</a>' +
              '</div>' +
              '<div class="dd-editor-output" id="ddEditorOutput"></div>' +
            '</div>' +
          '</div>' + /* dd-editor-left */
          '<div class="dd-resize-col dd-resize-right" id="ddResizeRight"></div>' +
          '<div class="dd-editor-sidebar">' +
            '<div class="dd-sidebar-content" id="ddSidebarContent">' +

              /* -- 基本信息 -- */
              '<div class="dd-sidebar-panel active" data-sidebar="basic">' +
                '<div class="dd-prop-group"><div class="dd-prop-label">*名称：</div><input class="dd-prop-input" type="text" placeholder="50个字符以内"></div>' +
                '<div class="dd-prop-group"><div class="dd-prop-label">*版本：</div><div class="dd-prop-row"><select class="dd-prop-select"><option>V1.0（备注xxx）</option><option>V2.0</option></select><button class="dd-prop-btn-sm">另存为</button></div></div>' +
                '<div class="dd-prop-group"><div class="dd-prop-label">*程序类型：</div><select class="dd-prop-select" data-editor-program-type><option>HiveSQL</option><option>python脚本</option><option>Sqoop Job</option><option>存储过程</option><option>ImpalaSQL</option><option>SQL</option><option>FlinkSQL</option><option>Shell脚本</option></select></div>' +
                '<div class="dd-prop-group" data-editor-batch-only><div class="dd-prop-label">*执行环境：</div><select class="dd-prop-select"><option>一级目录1/二级目录1-2/DBnamexxxx</option></select></div>' +
                '<div class="dd-prop-group"><div class="dd-prop-label">备注：</div><textarea class="dd-prop-input" placeholder="200个字符以内"></textarea></div>' +
                '<button class="btn btn-primary dd-editor-stream-save" type="button" data-editor-stream-only style="display:none"><i class="bi bi-save"></i> 保存流程</button>' +
              '</div>' +

              /* -- 参数设置 -- */
              '<div class="dd-sidebar-panel" data-sidebar="params">' +
                '<div class="dd-sb-toolbar"><button class="btn btn-primary btn-sm">添加参数</button></div>' +
                '<table class="dd-sb-table">' +
                  '<thead><tr><th>参数名</th><th>参数说明</th><th>数据格式</th><th>默认值</th><th>操作</th></tr></thead>' +
                  '<tbody>' +
                    '<tr><td>st_Time</td><td>开始时间</td><td>yyyy-MM-dd</td><td>2022-9-19</td><td><i class="bi bi-calendar3"></i> <i class="bi bi-trash3 text-danger"></i></td></tr>' +
                    '<tr><td>end_Time</td><td>结束时间</td><td>yyyyMMdd</td><td>请选择</td><td><i class="bi bi-calendar3"></i> <i class="bi bi-trash3 text-danger"></i></td></tr>' +
                    '<tr><td>depart</td><td>部门</td><td>字符串</td><td>业务中心</td><td><i class="bi bi-trash3 text-danger"></i></td></tr>' +
                    '<tr><td>URL</td><td>xx链接地址</td><td>字符串</td><td>http://192.168.21.160:30080/zhizhi/</td><td></td></tr>' +
                    '<tr><td>username</td><td>xx用户名</td><td>字符串</td><td>zhangsan</td><td></td></tr>' +
                    '<tr><td>password</td><td>xx密码</td><td>密码</td><td>**************</td><td></td></tr>' +
                  '</tbody>' +
                '</table>' +
                '<div class="dd-sb-note">字母、数字、下划线，必须以字母开头，15个字符以内；</div>' +
              '</div>' +

              /* -- 版本管理 -- */
              '<div class="dd-sidebar-panel" data-sidebar="version">' +
                '<div class="dd-sb-title">xxx流程名称</div>' +
                '<table class="dd-sb-table">' +
                  '<thead><tr><th>版本号</th><th>作者</th><th>备注</th><th>修改时间</th><th>操作</th></tr></thead>' +
                  '<tbody>' +
                    '<tr><td>V1.0</td><td>admin</td><td>执行广州数据</td><td>2022-9-15 00:00:00</td><td><i class="bi bi-trash3 text-danger"></i></td></tr>' +
                    '<tr><td>V2.0</td><td>admin</td><td>执行深圳数据</td><td>2022-9-16 00:00:00</td><td><i class="bi bi-trash3 text-danger"></i></td></tr>' +
                    '<tr><td>V3.0</td><td>admin</td><td>执行佛山数据</td><td>2022-9-17 00:00:00</td><td><i class="bi bi-trash3 text-danger"></i></td></tr>' +
                  '</tbody>' +
                '</table>' +
              '</div>' +

              /* -- 血缘关系 -- */
              '<div class="dd-sidebar-panel" data-sidebar="lineage">' +
                '<div class="dd-sb-toolbar"><span class="dd-sb-title" style="margin:0">xxx流程名称</span><button class="btn btn-sm">血缘解析</button><button class="btn btn-sm">导入</button><button class="btn btn-sm">增加关系</button></div>' +
                '<div class="dd-sb-section"><span class="dd-sb-section-label">数据来源</span><a class="dd-sb-link">添加</a></div>' +
                '<div class="dd-sb-row"><select class="dd-prop-select dd-sb-sel"><option>1级目录/1-1级目录/DB-Name</option></select><select class="dd-prop-select dd-sb-sel"><option>TableNamexxxx</option></select><i class="bi bi-trash3 text-danger"></i></div>' +
                '<div class="dd-sb-row"><select class="dd-prop-select dd-sb-sel"><option>1级目录/1-1级目录/DB-Name</option></select><select class="dd-prop-select dd-sb-sel"><option>TableNamexxxx</option></select><i class="bi bi-trash3 text-danger"></i></div>' +
                '<div class="dd-sb-section"><span class="dd-sb-section-label">数据存储</span><a class="dd-sb-link">添加</a></div>' +
                '<div class="dd-sb-row"><select class="dd-prop-select dd-sb-sel"><option>1级目录/1-1级目录/DB-Name</option></select><select class="dd-prop-select dd-sb-sel"><option>TableNamexxxx</option></select><i class="bi bi-trash3 text-danger"></i></div>' +
                '<div class="dd-lineage-diagram">' +
                  '<div class="dd-lineage-group">' +
                    '<div class="dd-lineage-sources"><div class="dd-lineage-node"><i class="bi bi-table"></i> tbname<div class="dd-lineage-db">库名xxx</div></div><div class="dd-lineage-node"><i class="bi bi-table"></i> tbname<div class="dd-lineage-db">库名xxx</div></div></div>' +
                    '<div class="dd-lineage-arrow"><div class="dd-lineage-process">流程名称xxx</div><i class="bi bi-arrow-right"></i></div>' +
                    '<div class="dd-lineage-targets"><div class="dd-lineage-node target"><i class="bi bi-table"></i> tbname<div class="dd-lineage-db">库名xxx</div></div></div>' +
                  '</div>' +
                  '<div class="dd-lineage-group">' +
                    '<div class="dd-lineage-sources"><div class="dd-lineage-node"><i class="bi bi-table"></i> tbname<div class="dd-lineage-db">库名xxx</div></div></div>' +
                    '<div class="dd-lineage-arrow"><div class="dd-lineage-process">流程名称xxx</div><i class="bi bi-arrow-right"></i></div>' +
                    '<div class="dd-lineage-targets"><div class="dd-lineage-node target"><i class="bi bi-table"></i> tbname<div class="dd-lineage-db">库名xxx</div></div></div>' +
                  '</div>' +
                '</div>' +
              '</div>' +

              /* -- 前置依赖 -- */
              '<div class="dd-sidebar-panel" data-sidebar="dependency" data-editor-batch-only>' +
                '<div class="dd-sb-title">前置依赖</div>' +
                '<div class="dd-sb-empty"><i class="bi bi-link-45deg"></i><span>暂无前置依赖</span></div>' +
              '</div>' +

            '</div>' +
            '<div class="dd-sidebar-strip">' +
              '<div class="dd-sidebar-tab active" data-sidebar-tab="basic">基本信息</div>' +
              '<div class="dd-sidebar-tab" data-sidebar-tab="params">参数设置</div>' +
              '<div class="dd-sidebar-tab" data-sidebar-tab="version">版本管理</div>' +
              '<div class="dd-sidebar-tab" data-sidebar-tab="lineage">血缘关系</div>' +
              '<div class="dd-sidebar-tab" data-sidebar-tab="dependency" data-editor-batch-only>前置依赖</div>' +
            '</div>' +
          '</div>' + /* dd-editor-sidebar */
        '</div>' +

        '<div class="dd-schedule-mask" id="ddScheduleModal" aria-hidden="true"><section class="dd-schedule-modal" role="dialog" aria-modal="true" aria-labelledby="ddScheduleTitle"><header><h3 id="ddScheduleTitle">调度管理</h3><button type="button" data-dd-schedule-close title="关闭"><i class="bi bi-x-lg"></i></button></header><div class="dd-schedule-body">' +
          '<div class="dd-schedule-row dd-schedule-name-row"><label for="ddScheduleName">名称：</label><div class="dd-schedule-name-fields"><input id="ddScheduleName" type="text" value="批量计算业务流程" disabled><span>版本：</span><select id="ddScheduleVersion"><option>V1</option><option>V0.9</option></select><b id="ddScheduleVersionText">V1</b></div></div>' +
          '<div class="dd-schedule-row dd-schedule-exec-row" data-dd-schedule-exec><label>执行方式：</label><div class="dd-schedule-radios"><label><input type="radio" name="ddScheduleExecWay" value="schedule_exec" checked> 定时调度</label><label data-dd-trigger-exec><input type="radio" name="ddScheduleExecWay" value="trigger_exec"> 触发执行（前置任务完成后，立即执行）</label></div></div>' +
          '<div class="dd-schedule-row dd-schedule-config-row"><label for="ddScheduleCycle">调度配置：</label><div class="dd-schedule-config"><select id="ddScheduleCycle"><option value="">请选择</option><option value="m">每分钟</option><option value="h">每小时</option><option value="d">每天</option><option value="w">每周</option><option value="mon">每月</option><option value="cron">cron</option><option value="once" data-dd-collection-cycle>执行一次</option></select><span class="dd-schedule-inline" data-dd-schedule-field="hour">第 <input id="ddScheduleHourMinute" type="number" min="0" max="60" value="1"> 分</span><select class="dd-schedule-inline" id="ddScheduleWeekday" data-dd-schedule-field="weekday"><option value="2">周一</option><option value="3">周二</option><option value="4">周三</option><option value="5">周四</option><option value="6">周五</option><option value="7">周六</option><option value="1">周日</option></select><select class="dd-schedule-inline" id="ddScheduleMonthday" data-dd-schedule-field="monthday"><option value="1">1号</option><option value="2">2号</option><option value="3">3号</option><option value="4">4号</option><option value="5">5号</option><option value="6">6号</option><option value="7">7号</option><option value="8">8号</option><option value="9">9号</option><option value="10">10号</option><option value="11">11号</option><option value="12">12号</option><option value="13">13号</option><option value="14">14号</option><option value="15">15号</option><option value="16">16号</option><option value="17">17号</option><option value="18">18号</option><option value="19">19号</option><option value="20">20号</option><option value="21">21号</option><option value="22">22号</option><option value="23">23号</option><option value="24">24号</option><option value="25">25号</option><option value="26">26号</option><option value="27">27号</option><option value="28">28号</option><option value="29">29号</option><option value="30">30号</option><option value="31">31号</option><option value="lastday">最后一天</option></select><input class="dd-schedule-inline" id="ddScheduleTime" data-dd-schedule-field="time" type="time" step="1" value="00:00:00"><input class="dd-schedule-inline dd-schedule-cron" id="ddScheduleCron" data-dd-schedule-field="cron" type="text" placeholder="请输入 cron 表达式"><input class="dd-schedule-inline dd-schedule-once" id="ddScheduleOnce" data-dd-schedule-field="once" type="datetime-local" step="1"></div></div>' +
          '<div class="dd-schedule-row" data-dd-business-retry-switch><label for="ddScheduleRetryEnabled">失败重试：</label><label class="dd-switch"><input id="ddScheduleRetryEnabled" type="checkbox" checked><span></span></label></div>' +
          '<div class="dd-schedule-row" data-dd-retry-detail><label for="ddScheduleRetries">重试次数：</label><input id="ddScheduleRetries" type="number" min="1" max="10" value="3"></div>' +
          '<div class="dd-schedule-row" data-dd-retry-detail><label for="ddScheduleRetryBackoff">重试间隔(秒)：</label><input id="ddScheduleRetryBackoff" type="number" min="1" max="300" value="300"></div>' +
          '<div class="dd-schedule-row"><label for="ddScheduleInit"><span data-dd-init-label>初始化：</span></label><div class="dd-schedule-init"><label class="dd-switch"><input id="ddScheduleInit" type="checkbox"><span></span></label><i class="bi bi-info-circle-fill"></i><small data-dd-init-help>调度第一次执行，忽略动态参数</small></div></div>' +
        '</div><footer><button class="btn btn-text" type="button" data-dd-schedule-close>取消</button><button class="btn btn-primary" type="button" data-dd-schedule-confirm>确定</button></footer></section></div>' +
        '<div class="dd-schedule-toast" id="ddScheduleToast" role="status" aria-live="polite"></div>' +

      '</div>' + /* dd-right-panel */

    '</div>' + /* dd-body */
  '</div>',

  /* ---- 树数据 ---- */
  _treeData: [
    { id: 'flow-batch', kind: 'flow', mode: 'batch', label: '批量计算业务流程', icon: 'biz', children: [
      { id: 'sub-batch-single-table', kind: 'collection', label: '单表采集子流程1-1', icon: 'table' },
      { id: 'sub-batch-ftp-read', kind: 'collection', label: 'FTP文件读取-门店订单', icon: 'ftp' },
      { id: 'sub-batch-http-read', kind: 'collection', label: 'Http接口采集-供应链订单', icon: 'http' },
      { id: 'sub-batch-hdfs-write', kind: 'collection', label: 'HDFS文件落仓-销售明细', icon: 'db' },
      { id: 'sub-batch-kafka-write', kind: 'collection', label: 'Kafka主题写入-订单事件', icon: 'inlet' },
      { id: 'sub-batch-hbase-read-write', kind: 'collection', label: 'HBase读写-会员标签', icon: 'db' },
      { id: 'sub-batch-ftp', kind: 'collection', label: '采集写FTP', icon: 'ftp' },
      { id: 'sub-batch-multimodal', kind: 'collection', label: '多模态数据采集', icon: 'multi' },
      { id: 'sub-batch-http', kind: 'collection', label: '采集写HTTP', icon: 'http' },
      { id: 'sub-batch-database', kind: 'collection', label: '整库采集子流程', icon: 'db' },
      { id: 'sub-batch-governance-new', kind: 'batch-design', label: '数据治理流程-订单标准化', icon: 'govern' },
      { id: 'sub-batch-deep-learning', kind: 'batch-design', label: '深度学习流程-销量预测', icon: 'process' },
      { id: 'sub-batch-batch-collect', kind: 'collection', label: '批量采集流程-门店主数据', icon: 'db' },
      { id: 'sub-batch-online-sql', kind: 'code', label: '在线编程子流程1-1', icon: 'code' },
      { id: 'sub-code-hivesql', kind: 'code', label: '订单明细加工_HiveSQL', icon: 'code' },
      { id: 'sub-code-sqoop', kind: 'code', label: '库存快照同步_Sqoop Job', icon: 'code' },
      { id: 'sub-code-impala', kind: 'code', label: '销售指标即席分析_ImpalaSQL', icon: 'code' },
      { id: 'sub-code-python', kind: 'code', label: '客户标签计算_Python', icon: 'code' },
      { id: 'sub-code-sql', kind: 'code', label: '门店销售汇总_SQL', icon: 'code' },
      { id: 'sub-code-flinksql', kind: 'code', label: '配送时效监控_FlinkSQL', icon: 'code' },
      { id: 'sub-code-shell', kind: 'code', label: '采集文件归档_Shell', icon: 'code' },
      { id: 'sub-code-procedure', kind: 'code', label: '订单日结_存储过程', icon: 'code' },
      { id: 'sub-batch-package', kind: 'package', label: '上传程序包子流程1-1', icon: 'pkg', children: [
        { id: 'sub-package-java', kind: 'package', label: '订单加工程序包_Java', icon: 'pkg' },
        { id: 'sub-package-flink', kind: 'package', label: '实时指标程序包_Flink', icon: 'pkg' },
        { id: 'sub-package-sqoop', kind: 'package', label: '库存同步程序包_Sqoop Job', icon: 'pkg' },
        { id: 'sub-package-shell', kind: 'package', label: '采集归档程序包_Shell', icon: 'pkg' },
        { id: 'sub-package-impala', kind: 'package', label: '经营分析程序包_ImpalaSQL', icon: 'pkg' },
        { id: 'sub-package-hive', kind: 'package', label: '销售汇总程序包_HiveSQL', icon: 'pkg' },
        { id: 'sub-package-python', kind: 'package', label: '标签计算程序包_Python', icon: 'pkg' }
      ]},
      { id: 'sub-batch-shared', kind: 'collection', label: '共享采集任务', icon: 'table' },
      { id: 'sub-batch-quality', kind: 'collection', label: '质量规则稽查采集', icon: 'quality' },
      { id: 'sub-batch-standard', kind: 'collection', label: '数据标化采集', icon: 'standard' },
      { id: 'sub-batch-governance', kind: 'batch-design', label: '数治子流程1-1', icon: 'govern' }
    ]},
    { id: 'flow-stream', kind: 'flow', mode: 'stream', label: '流式计算业务流程', icon: 'stream', children: [
      { id: 'sub-stream-ingest', kind: 'stream-collect', label: '流式数据采集流程-订单事件', icon: 'inlet' },
      { id: 'sub-stream-activemq', kind: 'stream-collect', label: '流式采集-ActiveMQ工单消息', icon: 'inlet' },
      { id: 'sub-stream-rabbitmq', kind: 'stream-collect', label: '流式采集-RabbitMQ设备告警', icon: 'inlet' },
      { id: 'sub-stream-database', kind: 'stream-collect', label: '流式采集-数据库变更样例', icon: 'db' },
      { id: 'sub-stream-process', kind: 'stream-design', label: '流式处理流程-订单清洗', icon: 'process' },
      { id: 'sub-stream-cdc', kind: 'stream-cdc', label: '数据同步(Flink CDC)-订单增量', icon: 'sync' },
      { id: 'sub-stream-code-hive', kind: 'stream-code', label: '订单明细流式落仓_HiveSQL', icon: 'code' },
      { id: 'sub-stream-code-python', kind: 'stream-code', label: '实时异常识别_python脚本', icon: 'code' },
      { id: 'sub-stream-code-sqoop', kind: 'stream-code', label: '实时快照同步_Sqoop Job', icon: 'code' },
      { id: 'sub-stream-code-procedure', kind: 'stream-code', label: '实时指标入库_存储过程', icon: 'code' },
      { id: 'sub-stream-code-flinksql', kind: 'stream-code', label: '在线编程流程-FlinkSQL', icon: 'code' },
      { id: 'sub-stream-code-impala', kind: 'stream-code', label: '实时明细查询_ImpalaSQL', icon: 'code' },
      { id: 'sub-stream-package-hive', kind: 'stream-package', label: '流式落仓程序包_HiveSQL', icon: 'pkg' },
      { id: 'sub-stream-package-python', kind: 'stream-package', label: '异常识别程序包_python脚本', icon: 'pkg' },
      { id: 'sub-stream-package-sqoop', kind: 'stream-package', label: '增量同步程序包_Sqoop Job', icon: 'pkg' },
      { id: 'sub-stream-package-java', kind: 'stream-package', label: '订单事件程序包_Java程序', icon: 'pkg' },
      { id: 'sub-stream-package-flink', kind: 'stream-package', label: '实时指标程序包_Flink Java', icon: 'pkg' },
      { id: 'sub-stream-package-impala', kind: 'stream-package', label: '实时查询程序包_ImpalaSQL', icon: 'pkg' }
    ]},
    { id: 'flow-business-2', kind: 'flow', label: '业务流程2', icon: 'biz', children: [
      { id: 'flow-business-2-collect', label: '批量采集业务流程', icon: 'biz', children: [
        { id: 'sub-business-2-ods-1', kind: 'collection', label: 'ods_tabname_hf', icon: 'table' },
        { id: 'sub-business-2-ods-2', kind: 'collection', label: 'ods_tabname_hf', icon: 'table' }
      ]},
      { id: 'folder-business-2-code', label: '文件夹', icon: 'folder', children: [
        { id: 'sub-data-2-2-1', kind: 'code', label: '数据子流程2-2-1', icon: 'process' },
        { id: 'sub-data-2-2-2', kind: 'code', label: '数据子流程2-2-2', icon: 'process' }
      ]}
    ]}
  ],

  /* ---- 流程节点数据（取自批量计算业务流程子节点） ---- */
  _nodesData: [
    { id: 'start', type: 'start', label: '开始',               x: 32,   y: 288 },
    { id: 'n1',    type: 'task',  label: '单表采集子流程1-1',    x: 180,  y: 288, icon: 'table' },
    { id: 'n2',    type: 'task',  label: '采集写FTP',            x: 430,  y: 150, icon: 'ftp' },
    { id: 'n3',    type: 'task',  label: '采集写HTTP',           x: 430,  y: 288, icon: 'http' },
    { id: 'n4',    type: 'task',  label: '多模态数据采集',        x: 430,  y: 426, icon: 'multi' },
    { id: 'n5',    type: 'task',  label: '整库采集子流程',        x: 670,  y: 205, icon: 'db' },
    { id: 'n6',    type: 'task',  label: '上传程序包子流程1-1',   x: 670,  y: 400, icon: 'pkg' },
    { id: 'n7',    type: 'task',  label: '在线编程子流程1-1',     x: 905,  y: 288, icon: 'code' },
    { id: 'n8',    type: 'task',  label: '数治子流程1-1',         x: 1125, y: 288, icon: 'govern' },
    { id: 'end',   type: 'end',   label: '结束',               x: 1310, y: 288 }
  ],

  /* ---- 连线数据 ---- */
  _edgesData: [
    { from: 'start', to: 'n1' },
    { from: 'n1', to: 'n2' },
    { from: 'n1', to: 'n3' },
    { from: 'n1', to: 'n4' },
    { from: 'n2', to: 'n5' },
    { from: 'n3', to: 'n5' },
    { from: 'n4', to: 'n6' },
    { from: 'n5', to: 'n7' },
    { from: 'n6', to: 'n7' },
    { from: 'n7', to: 'n8' },
    { from: 'n8', to: 'end' }
  ],

  /* ---- 编辑器内容（按子流程名称索引） ---- */
  _editorContents: {
    '在线编程子流程1-1': {
      language: 'SQL',
      description: '在线编写并调试数据加工SQL。',
      code:
        "SET\n" +
        "  /*+client execution result mode = 'tableau';\n" +
        "CREATE TABLE mysql_emp_worker1 (\n" +
        "  'phone' varchar(100),\n" +
        "  'csny' varchar(100),\n" +
        "  'idcard' varchar(100),\n" +
        "  'name' varchar(100),\n" +
        "  'telephone' varchar(100),\n" +
        "  'id' varchar(100),\n" +
        "  'bankcard' varchar(100),\n" +
        "  'email' varchar(100)\n" +
        ") WITH (\n" +
        "  'connector' = 'jdbc',\n" +
        "  'url' = '${url}',\n" +
        "  'table-name' = 'emp_worker1',\n" +
        "  'username' = '${username}',\n" +
        "  'password' = '${password}'\n" +
        ");\n" +
        "\n" +
        "SELECT\n" +
        "  *\n" +
        "FROM\n" +
        "  mysql_emp_worker1;\n" +
        "\n" +
        "//代码块的应用\n" +
        "/*",
      output: [
        { type: 'cmd', text: '> SELECT * FROM aracaode_test_20200828' },
        { type: 'ok',  text: '> OK' },
        { type: 'time', text: '> 查询时间: 0.004s' },
        { type: 'empty' },
        { type: 'sql', text: "INSERT INTO 'aotains'.'product' ('number', 'ts_code', 'symbol', 'exchange', 'name', 'fut_code', 'multiplier', 'trade_unit', 'per_unit', 'quote_unit', 'quote_unit_desc', 'd_mode_desc', 'list_date', 'delist_date', 'd_month', 'last_ddate', 'trade_time_desc') VALUES ('11', 'SC2104.INE', 'SC2104', 'INE', '\u539f\u6cb92104', 'SC', NULL, '\u6876', 1000, '0.1\u4eba\u6c11\u5e01\u5143/\u6876', '0.1\u4eba\u6c11\u5e01\u5143/\u6876', '\u5b9e\u7269\u4ea4\u5272', '20210331', '20210331', '202104', '20210407', '\u4e0a\u534809:00-10:15, 10:30-11:30, \u4e0b\u534813:30-15:00,\u6bcf\u5468\u4e00\u81f3\u5468\u4e94\u4e0b\u534821:00-\u6b21\u65e502:30(\u591c\u76d8)')" },
        { type: 'empty' },
        { type: 'err', text: "> 1064 : You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near 'INSERT INTO aotains.product (number, ts_code, symbol...' at line 1" },
        { type: 'empty' },
        { type: 'time', text: '> 查询时间: 0.007s' }
      ]
    },
    '订单明细加工_HiveSQL': {
      language: 'HiveSQL',
      description: '按业务日期加工订单明细并写入DWD层。',
      code:
        "SET hive.exec.dynamic.partition = true;\n" +
        "SET hive.exec.dynamic.partition.mode = nonstrict;\n\n" +
        "INSERT OVERWRITE TABLE dwd.dwd_order_detail\n" +
        "PARTITION (dt = '${biz_date}')\n" +
        "SELECT\n" +
        "  order_id,\n" +
        "  store_id,\n" +
        "  customer_id,\n" +
        "  order_amount,\n" +
        "  order_status,\n" +
        "  create_time\n" +
        "FROM ods.ods_order_detail\n" +
        "WHERE dt = '${biz_date}';"
    },
    '库存快照同步_Sqoop Job': {
      language: 'Sqoop Job',
      description: '将仓储系统库存快照同步至Hive贴源层。',
      code:
        "job.name=inventory_snapshot_sync\n" +
        "source.type=mysql\n" +
        "source.datasource=warehouse_mysql\n" +
        "source.table=t_inventory_snapshot\n" +
        "source.where=snapshot_date='${biz_date}'\n\n" +
        "target.type=hive\n" +
        "target.database=ods_supply\n" +
        "target.table=ods_inventory_snapshot\n" +
        "target.partition=dt=${biz_date}\n" +
        "write.mode=overwrite"
    },
    '销售指标即席分析_ImpalaSQL': {
      language: 'ImpalaSQL',
      description: '计算门店销售指标，供即席分析查询使用。',
      code:
        "INVALIDATE METADATA ads.ads_store_sales_day;\n\n" +
        "INSERT OVERWRITE ads.ads_store_sales_day\n" +
        "PARTITION (biz_date = '${biz_date}')\n" +
        "SELECT\n" +
        "  store_id,\n" +
        "  COUNT(DISTINCT order_id) AS order_count,\n" +
        "  SUM(order_amount) AS sales_amount,\n" +
        "  AVG(order_amount) AS avg_order_amount\n" +
        "FROM dwd.dwd_order_detail\n" +
        "WHERE dt = '${biz_date}'\n" +
        "GROUP BY store_id;"
    },
    '客户标签计算_Python': {
      language: 'Python',
      description: '基于订单行为计算客户活跃度与价值标签。',
      code:
        "from pyspark.sql import SparkSession\n" +
        "from pyspark.sql import functions as F\n\n" +
        "spark = SparkSession.builder.appName('customer_tag_job').getOrCreate()\n" +
        "biz_date = '${biz_date}'\n\n" +
        "orders = spark.table('dwd.dwd_order_detail').filter(F.col('dt') == biz_date)\n" +
        "tags = orders.groupBy('customer_id').agg(\n" +
        "    F.countDistinct('order_id').alias('order_count'),\n" +
        "    F.sum('order_amount').alias('total_amount')\n" +
        ")\n" +
        "tags.write.mode('overwrite').insertInto('ads.ads_customer_value_tag')\n" +
        "spark.stop()"
    },
    '门店销售汇总_SQL': {
      language: 'SQL',
      description: '汇总门店每日销售额、订单量和客单价。',
      code:
        "INSERT INTO ads_store_sales_summary (\n" +
        "  biz_date, store_id, order_count, sales_amount, avg_order_amount\n" +
        ")\n" +
        "SELECT\n" +
        "  '${biz_date}',\n" +
        "  store_id,\n" +
        "  COUNT(DISTINCT order_id),\n" +
        "  SUM(order_amount),\n" +
        "  AVG(order_amount)\n" +
        "FROM dwd_order_detail\n" +
        "WHERE biz_date = '${biz_date}'\n" +
        "GROUP BY store_id;"
    },
    '配送时效监控_FlinkSQL': {
      language: 'FlinkSQL',
      description: '实时计算配送耗时并输出超时配送事件。',
      code:
        "CREATE TABLE delivery_event_source (\n" +
        "  delivery_id STRING,\n" +
        "  store_id STRING,\n" +
        "  event_type STRING,\n" +
        "  event_time TIMESTAMP(3),\n" +
        "  WATERMARK FOR event_time AS event_time - INTERVAL '5' SECOND\n" +
        ") WITH ('connector' = 'kafka', 'topic' = 'delivery_event');\n\n" +
        "INSERT INTO delivery_timeout_sink\n" +
        "SELECT delivery_id, store_id, MIN(event_time), MAX(event_time)\n" +
        "FROM delivery_event_source\n" +
        "GROUP BY delivery_id, store_id;"
    },
    '在线编程流程-Flinksql': {
      language: 'FlinkSQL',
      description: '实时处理订单与配送事件。',
      code:
        "CREATE TABLE order_event_source (\n" +
        "  order_id STRING,\n" +
        "  store_id STRING,\n" +
        "  order_amount DECIMAL(18, 2),\n" +
        "  event_time TIMESTAMP(3)\n" +
        ") WITH ('connector' = 'kafka', 'topic' = 'order_event');\n\n" +
        "INSERT INTO realtime_store_sales\n" +
        "SELECT store_id, COUNT(*), SUM(order_amount)\n" +
        "FROM order_event_source\n" +
        "GROUP BY store_id;"
    },
    '采集文件归档_Shell': {
      language: 'Shell脚本',
      description: '归档已完成采集的数据文件并记录处理结果。',
      code:
        "#!/bin/bash\n" +
        "BIZ_DATE='${biz_date}'\n" +
        "SOURCE_DIR=/data/collect/${BIZ_DATE}\n" +
        "ARCHIVE_DIR=/data/archive/${BIZ_DATE}\n\n" +
        "mkdir -p ${ARCHIVE_DIR}\n" +
        "find ${SOURCE_DIR} -type f -name '*.done' -print0 | while IFS= read -r -d '' file; do\n" +
        "  mv \"${file}\" ${ARCHIVE_DIR}/\n" +
        "done\n\n" +
        "echo \"${BIZ_DATE} 采集文件归档完成\""
    },
    '订单日结_存储过程': {
      language: '存储过程',
      description: '执行订单主题日结与汇总入库。',
      code:
        "CALL proc_order_daily_close('${biz_date}', '${batch_no}');"
    }
  },

  _streamEditorConfigs: {
    '订单明细流式落仓_HiveSQL': { language: 'HiveSQL', description: '将订单事件明细写入Hive明细表。', code: "INSERT INTO dwd.dwd_order_event\nSELECT * FROM realtime_order_event;" },
    '实时异常识别_python脚本': { language: 'python脚本', description: '识别实时订单事件中的金额与状态异常。', code: "from pyflink.datastream import StreamExecutionEnvironment\n\nenv = StreamExecutionEnvironment.get_execution_environment()\n# 读取订单事件并输出异常记录\nenv.execute('realtime_order_anomaly')" },
    '实时快照同步_Sqoop Job': { language: 'Sqoop Job', description: '同步流式任务运行所需的维表快照。', code: "job.name=realtime_dimension_snapshot\nsource.table=t_store_info\ntarget.table=dim_store_snapshot" },
    '实时指标入库_存储过程': { language: '存储过程', description: '调用存储过程完成实时指标入库。', code: "CALL proc_realtime_metric_merge('${window_end}');" },
    '在线编程流程-FlinkSQL': { language: 'FlinkSQL', description: '实时处理订单事件并计算门店销售指标。', code: "CREATE TABLE order_event_source (\n  order_id STRING,\n  store_id STRING,\n  order_amount DECIMAL(18,2),\n  event_time TIMESTAMP(3)\n) WITH ('connector'='kafka','topic'='order_event');\n\nINSERT INTO realtime_store_sales\nSELECT store_id, COUNT(*), SUM(order_amount)\nFROM order_event_source\nGROUP BY store_id;" },
    '实时明细查询_ImpalaSQL': { language: 'ImpalaSQL', description: '查询流式落仓后的订单事件明细。', code: "SELECT store_id, COUNT(*) AS event_count\nFROM dwd.dwd_order_event\nWHERE dt='${biz_date}'\nGROUP BY store_id;" }
  },

  /* ---- 程序包与流式子流程示例配置（字段结构来自系统，示例内容按当前主题生成） ---- */
  _packageConfigs: {
    '上传程序包子流程1-1': { flowType: '批量数据采集流程', type: 'Java程序', file: 'order-etl-job.jar', main: 'order-etl-job.jar', entry: 'com.company.trade.OrderEtlMain', args: '${biz_date},${batch_no}', description: '运行订单主题数据加工程序包。' },
    '订单加工程序包_Java': { type: 'Java程序', file: 'order-etl-job.jar', main: 'order-etl-job.jar', entry: 'com.company.trade.OrderEtlMain', args: '${biz_date},${batch_no}', description: '加工订单明细并生成订单主题数据。' },
    '实时指标程序包_Flink': { type: 'Flink Java', file: 'realtime-metric-job.jar', main: 'realtime-metric-job.jar', entry: 'com.company.realtime.MetricJob', args: '--env prod --checkpoint 60000', description: '计算门店实时经营指标。' },
    '库存同步程序包_Sqoop Job': { type: 'Sqoop Job', file: 'inventory_snapshot.sqoop', main: 'inventory_snapshot.sqoop', entry: '--', args: '--date ${biz_date}', description: '同步每日库存快照。' },
    '采集归档程序包_Shell': { type: 'Shell脚本', file: 'archive_collect_file.sh', main: 'archive_collect_file.sh', entry: '--', args: '${biz_date}', description: '归档采集完成的数据文件。' },
    '经营分析程序包_ImpalaSQL': { type: 'ImpalaSQL', file: 'sales_analysis.sql', main: 'sales_analysis.sql', entry: '--', args: '${biz_date}', description: '执行门店经营指标即席分析。' },
    '销售汇总程序包_HiveSQL': { type: 'HiveSQL', file: 'store_sales_summary.sql', main: 'store_sales_summary.sql', entry: '--', args: '${biz_date}', description: '汇总门店日销售数据。' },
    '标签计算程序包_Python': { type: 'python脚本', file: 'customer_tag_job.py', main: 'customer_tag_job.py', entry: 'main', args: '--biz-date ${biz_date}', description: '计算客户分层与活跃度标签。' },
    '流式落仓程序包_HiveSQL': { flowType: '流式数据处理流程', type: 'HiveSQL', file: 'stream_order_sink.sql', main: 'stream_order_sink.sql', entry: '--', args: '${biz_date}', description: '执行订单事件流式落仓。' },
    '异常识别程序包_python脚本': { flowType: '流式数据处理流程', type: 'python脚本', file: 'stream_anomaly.py', main: 'stream_anomaly.py', entry: 'main', args: '--env prod', description: '识别订单事件中的实时异常。' },
    '增量同步程序包_Sqoop Job': { flowType: '流式数据处理流程', type: 'Sqoop Job', file: 'dimension_snapshot.sqoop', main: 'dimension_snapshot.sqoop', entry: '--', args: '--date ${biz_date}', description: '同步实时任务所需维表快照。' },
    '订单事件程序包_Java程序': { flowType: '流式数据处理流程', type: 'Java程序', file: 'stream-order-job.jar', main: 'stream-order-job.jar', entry: 'com.company.stream.OrderJob', args: '--env prod', description: '运行订单事件Java处理程序。' },
    '实时指标程序包_Flink Java': { flowType: '流式数据处理流程', type: 'Flink Java', file: 'realtime-metric-job.jar', main: 'realtime-metric-job.jar', entry: 'com.company.realtime.MetricJob', args: '--env prod --checkpoint 60000', description: '计算门店实时经营指标。' },
    '实时查询程序包_ImpalaSQL': { flowType: '流式数据处理流程', type: 'ImpalaSQL', file: 'realtime_query.sql', main: 'realtime_query.sql', entry: '--', args: '${biz_date}', description: '查询实时落仓后的订单事件。' }
  },

  _streamDesignConfigs: {
    '流式处理流程-订单清洗': { name: '流式处理流程-订单清洗', nodes: ['开始', '读kafka', '半结构数据解析', '窗口过滤', '流式写数据库', '结束'] },
    '数据治理流程-订单标准化': { name: '数据治理流程-订单标准化', nodes: ['开始', '读取ODS订单', '字段定义', '数据标准化', '写入DWD', '结束'] },
    '深度学习流程-销量预测': { name: '深度学习流程-销量预测', nodes: ['开始', '读取训练数据', '特征处理', '模型训练', '预测输出', '结束'] }
  },

  /* ---- 流式计算任务数据 ---- */
  _streamTasks: [
    { id: 'STREAM-1001', name: '订单增量同步_FlinkCDC', version: 'V3', status: '已启动', startTime: '2026-09-17 08:00:12', endTime: '--', duration: '持续运行' },
    { id: 'STREAM-1002', name: '门店销售流水实时接入', version: 'V2', status: '已启动', startTime: '2026-09-17 08:05:36', endTime: '--', duration: '持续运行' },
    { id: 'STREAM-1003', name: '物流轨迹事件实时清洗', version: 'V2', status: '未启动', startTime: '2026-09-16 14:20:08', endTime: '2026-09-16 18:42:51', duration: '4小时22分' },
    { id: 'STREAM-1004', name: '客户主数据变更分发', version: 'V1', status: '未启动', startTime: '--', endTime: '--' },
    { id: 'STREAM-1005', name: '库存变动实时汇总', version: 'V4', status: '已启动', startTime: '2026-09-17 07:58:43', endTime: '--', duration: '持续运行' },
    { id: 'STREAM-1006', name: '质量异常实时监测', version: 'V1', status: '未启动', startTime: '2026-09-15 10:12:29', endTime: '2026-09-15 16:30:17', duration: '6小时17分' },
    { id: 'STREAM-1007', name: '设备采集事件处理', version: 'V2', status: '未启动', startTime: '--', endTime: '--' },
    { id: 'STREAM-1008', name: '告警日志流式接入', version: 'V1', status: '已启动', startTime: '2026-09-17 09:10:05', endTime: '--', duration: '持续运行' },
    { id: 'STREAM-1009', name: '订单状态实时宽表', version: 'V3', status: '未启动', startTime: '2026-09-14 09:06:44', endTime: '2026-09-14 21:15:20', duration: '12小时08分' },
    { id: 'STREAM-1010', name: '配送时效实时计算', version: 'V2', status: '未启动', startTime: '--', endTime: '--' },
    { id: 'STREAM-1011', name: '标准编码实时转换', version: 'V1', status: '已启动', startTime: '2026-09-17 08:30:18', endTime: '--', duration: '持续运行' },
    { id: 'STREAM-1012', name: '数据服务调用日志处理', version: 'V2', status: '未启动', startTime: '2026-09-13 11:26:32', endTime: '2026-09-13 19:44:09', duration: '8小时17分' }
  ],

  _streamState: {
    status: '',
    keyword: '',
    page: 1,
    pageSize: 5,
    selected: []
  },

  _currentView: 'flow',

  /* ---- 初始化 ---- */
  init: function (opts) {
    var self = this;
    opts = opts || {};
    self._currentView = 'flow';

    if (DP.setProjectSelectorMode) DP.setProjectSelectorMode('context');
    if (opts.project && opts.environment && DP.setProjectEnvironment) {
      DP.setProjectEnvironment(opts.project, opts.environment, { mode: 'context', silent: true });
    }

    self._renderTree();
    self._renderCanvas();
    self._initStreamList();
    self._initCollectionView();
    self._initScheduleDialog();
    self._initSupplementViews();
    self._initTabs();
    self._initTreeContextMenu();
    self._initCanvasContextMenu();
    self._initEditorContextMenu();
    self._initEditorBottomResize();
    self._initColResize();
    self._initCodeToolbar();
    self._initEditorSidebarTabs();
    self._initEditorBottomTabs();
    self._initPropsTabs();
    self._initSpecialNodeProps();

    if (opts.subflowId || opts.recordId) self._openTarget(opts);
  },

  /* ---- Tab 切换（按父容器隔离） ---- */
  _initTabs: function () {
    document.querySelectorAll('.dd-tab').forEach(function (tab) {
      tab.addEventListener('click', function () {
        var parent = tab.closest('.dd-tabs');
        if (parent) {
          parent.querySelectorAll('.dd-tab').forEach(function (t) { t.classList.remove('active'); });
        }
        tab.classList.add('active');
      });
    });
  },

  /* ---- 图标映射（树 + 画布共享） ---- */
  _iconMap: {
    biz:     'bi-diagram-3',
    stream:  'bi-water',
    folder:  'bi-folder-fill',
    table:   'bi-table',
    ftp:     'bi-hdd-network-fill',
    http:    'bi-globe2',
    multi:   'bi-layers-fill',
    db:      'bi-server',
    code:    'bi-code-slash',
    pkg:     'bi-box-seam-fill',
    govern:  'bi-shield-check',
    sync:    'bi-arrow-left-right',
    inlet:   'bi-box-arrow-in-right',
    process: 'bi-gear-wide-connected',
    trigger: 'bi-signpost-split',
    param:   'bi-sliders',
    summary: 'bi-table',
    quality: 'bi-shield-check',
    standard: 'bi-ui-checks-grid'
  },
  _iconColorMap: {
    biz:     '#9b59b6',
    stream:  '#3498db',
    folder:  '#f5a623',
    table:   '#3b82f6',
    ftp:     '#e67e22',
    http:    '#2ecc71',
    multi:   '#8e44ad',
    db:      '#e74c3c',
    code:    '#1abc9c',
    pkg:     '#f39c12',
    govern:  '#2980b9',
    sync:    '#27ae60',
    inlet:   '#3498db',
    process: '#7f8c8d',
    trigger: '#1677ff',
    param:   '#5f6f81',
    summary: '#1683f8',
    quality: '#13a8a8',
    standard: '#722ed1'
  },

  /* ---- 渲染目录树 ---- */
  _renderTree: function () {
    var container = document.getElementById('ddTreeContent');
    if (!container) return;
    var self = this;
    var iconMap = this._iconMap;
    var iconColorMap = this._iconColorMap;

    function buildNode(item, depth, inheritedMode) {
      var hasChild = item.children && item.children.length > 0;
      var flowMode = item.mode || inheritedMode || '';
      var pad = 10 + depth * 16;
      var bi = iconMap[item.icon] || 'bi-file-earmark';
      var clr = iconColorMap[item.icon] || '#999';
      var html = '<div class="dd-tree-node" style="padding-left:' + pad + 'px" data-label="' + item.label + '" data-node-id="' + (item.id || '') + '" data-node-kind="' + (item.kind || '') + '" data-flow-mode="' + flowMode + '">';
      if (hasChild) {
        html += '<span class="dd-tree-arrow open"><i class="bi bi-caret-right-fill"></i></span>';
      } else {
        html += '<span class="dd-tree-arrow empty" style="visibility:hidden"><i class="bi bi-caret-right-fill"></i></span>';
      }
      html += '<i class="bi ' + bi + ' dd-tree-icon" style="color:' + clr + '"></i>';
      html += '<span class="dd-tree-label">' + item.label + '</span></div>';
      if (item.children && item.children.length) {
        html += '<div class="dd-tree-children open">';
        item.children.forEach(function (c) { html += buildNode(c, depth + 1, flowMode); });
        html += '</div>';
      }
      return html;
    }

    var html = '';
    this._treeData.forEach(function (item) { html += buildNode(item, 0, item.mode || ''); });
    container.innerHTML = html;

    var firstNode = container.querySelector('.dd-tree-node');
    if (firstNode) firstNode.classList.add('active');

    container.addEventListener('click', function (e) {
      /* 点击箭头图标 → 只做展开/折叠 */
      var arrowEl = e.target.closest('.dd-tree-arrow:not(.empty)');
      if (arrowEl) {
        var parentNode = arrowEl.closest('.dd-tree-node');
        var childBlock = parentNode ? parentNode.nextElementSibling : null;
        if (parentNode && childBlock && childBlock.classList.contains('dd-tree-children')) {
          arrowEl.classList.toggle('open');
          childBlock.classList.toggle('open');
        }
        return;
      }

      /* 点击节点其余区域 → 选中 + 视图切换 */
      var node = e.target.closest('.dd-tree-node');
      if (!node) return;
      container.querySelectorAll('.dd-tree-node.active').forEach(function (n) { n.classList.remove('active'); });
      node.classList.add('active');

      var nodeId = node.getAttribute('data-node-id');
      var label = node.getAttribute('data-label');
      var kind = node.getAttribute('data-node-kind');
      if (nodeId === 'flow-stream') {
        self._switchToStreamView();
      } else if (kind === 'flow') {
        self._switchToFlowView();
      } else if (kind === 'collection') {
        self._switchToCollectionView(label);
      } else if (kind === 'package' || kind === 'stream-package') {
        self._switchToPackageView(label, kind === 'stream-package' ? 'stream' : 'batch');
      } else if (kind === 'trigger') {
        self._switchToTriggerView(label);
      } else if (kind === 'stream-design') {
        self._switchToStreamDesignerView(label, null, 'stream');
      } else if (kind === 'batch-design') {
        self._switchToStreamDesignerView(label, null, 'batch');
      } else if (kind === 'stream-collect') {
        self._switchToStreamCollectView(label);
      } else if (kind === 'stream-cdc') {
        self._switchToFlinkCdcView(label);
      } else if (kind === 'stream-code') {
        self._switchToEditorView(label, null, 'stream');
      } else if (kind === 'code' || self._editorContents[label]) {
        self._switchToEditorView(label, null, 'batch');
      }
    });
  },

  /* ---- 画布状态（供拖动时更新连线） ---- */
  _canvasState: null,

  _canvasScaleMin: 0.5,
  _canvasScaleMax: 1.6,
  _canvasScaleStep: 0.1,

  _setCanvasScale: function (nextScale, keepCenter) {
    var st = this._canvasState;
    if (!st) return;
    var canvas = st.canvas;
    var oldScale = st.scale || 1;
    var scale = Math.max(this._canvasScaleMin, Math.min(this._canvasScaleMax, Number(nextScale) || 1));
    scale = Math.round(scale * 100) / 100;

    var centerX = (canvas.scrollLeft + canvas.clientWidth / 2 - st.offsetX) / oldScale;
    var centerY = (canvas.scrollTop + canvas.clientHeight / 2 - st.offsetY) / oldScale;
    st.scale = scale;
    this._updateCanvasTransform();

    if (keepCenter !== false) {
      canvas.scrollLeft = st.offsetX + centerX * scale - canvas.clientWidth / 2;
      canvas.scrollTop = st.offsetY + centerY * scale - canvas.clientHeight / 2;
    }
  },

  _updateCanvasTransform: function () {
    var st = this._canvasState;
    if (!st) return;
    var scale = st.scale || 1;
    var panPadding = st.panPadding || 0;
    var scaledWidth = st.worldWidth * scale;
    var scaledHeight = st.worldHeight * scale;
    st.stage.style.width = (Math.max(st.canvas.clientWidth, scaledWidth) + panPadding * 2) + 'px';
    st.stage.style.height = (Math.max(st.canvas.clientHeight, scaledHeight) + panPadding * 2) + 'px';
    st.offsetX = panPadding + Math.max(0, (st.canvas.clientWidth - scaledWidth) / 2);
    st.offsetY = panPadding + Math.max(0, (st.canvas.clientHeight - scaledHeight) / 2);
    st.world.style.left = st.offsetX + 'px';
    st.world.style.top = st.offsetY + 'px';
    st.world.style.transform = 'scale(' + scale + ')';
    st.canvas.style.setProperty('--dd-grid-scale', scale);

    if (!st.panInitialized) {
      st.panInitialized = true;
      st.canvas.scrollLeft = panPadding;
      st.canvas.scrollTop = panPadding;
    }

    var label = document.querySelector('[data-dd-zoom-label]');
    if (label) label.textContent = Math.round(scale * 100) + '%';
    document.querySelectorAll('[data-dd-zoom="out"]').forEach(function (btn) { btn.disabled = scale <= 0.5; });
    document.querySelectorAll('[data-dd-zoom="in"]').forEach(function (btn) { btn.disabled = scale >= 1.6; });
  },

  _fitCanvas: function () {
    var st = this._canvasState;
    if (!st) return;
    var scale = Math.min(1, (st.canvas.clientWidth - 56) / st.worldWidth, (st.canvas.clientHeight - 56) / st.worldHeight);
    this._setCanvasScale(scale, false);
    st.canvas.scrollLeft = st.panPadding || 0;
    st.canvas.scrollTop = st.panPadding || 0;
  },

  _createCanvasNodeElement: function (nd) {
    var el = document.createElement('div');
    el.className = 'dd-node' + (nd.specialKind ? ' dd-node-special' : '');
    el.id = 'ddNode_' + nd.id;
    el.style.left = nd.x + 'px';
    el.style.top = nd.y + 'px';

    if (nd.type === 'start') {
      el.innerHTML =
        '<div class="dd-node-start">' +
          '<span class="dd-node-dot"><i class="bi bi-play-fill"></i></span>' +
          '<span>' + nd.label + '</span>' +
          '<span class="dd-node-port"></span>' +
        '</div>';
    } else if (nd.type === 'end') {
      el.innerHTML =
        '<div class="dd-node-end">' +
          '<span class="dd-node-port"></span>' +
          '<span class="dd-node-dot"><i class="bi bi-stop-fill"></i></span>' +
          '<span>' + nd.label + '</span>' +
        '</div>';
    } else {
      var biCls = this._iconMap[nd.icon] || 'bi-gear';
      var biClr = this._iconColorMap[nd.icon] || '#999';
      el.innerHTML =
        '<div class="dd-node-task">' +
          '<span class="dd-node-port"></span>' +
          '<span class="dd-node-icon" style="background:' + biClr + '"><i class="bi ' + biCls + '"></i></span>' +
          '<span class="dd-node-text">' + nd.label + '</span>' +
          '<span class="dd-node-port"></span>' +
        '</div>';
    }
    return el;
  },

  _showFlowProperties: function () {
    var body = document.querySelector('.dd-props-body');
    var strip = document.querySelector('.dd-props-strip');
    var special = document.getElementById('ddSpecialNodeProps');
    if (!body || !strip || !special) return;
    special.style.display = 'none';
    strip.style.display = '';
    strip.querySelectorAll('.dd-sidebar-tab').forEach(function (tab) {
      tab.classList.toggle('active', tab.getAttribute('data-props-tab') === 'basic');
    });
    body.querySelectorAll('.dd-props-tab-content').forEach(function (panel) {
      panel.classList.toggle('active', panel.getAttribute('data-props-content') === 'basic');
    });
    var basic = body.querySelector('[data-props-content="basic"]');
    if (basic && this._flowPropsSnapshot) {
      var name = basic.querySelector('.dd-prop-input');
      var version = basic.querySelector('.dd-prop-select');
      var status = basic.querySelector('.dd-prop-info');
      if (name) {
        name.value = this._flowPropsSnapshot.name;
        name.disabled = this._flowPropsSnapshot.nameDisabled;
      }
      if (version) version.innerHTML = this._flowPropsSnapshot.versionHtml;
      if (status) status.innerHTML = this._flowPropsSnapshot.statusHtml;
    }
  },

  _showCanvasNodeProperties: function (nodeInfo) {
    if (!nodeInfo) return;
    if (nodeInfo.data.specialKind) {
      this._renderSpecialNodeProperties(nodeInfo.data);
      return;
    }

    this._showFlowProperties();
    var basic = document.querySelector('[data-props-content="basic"]');
    if (!basic) return;
    var name = basic.querySelector('.dd-prop-input');
    var version = basic.querySelector('.dd-prop-select');
    var status = basic.querySelector('.dd-prop-info');
    if (!this._flowPropsSnapshot) {
      this._flowPropsSnapshot = {
        name: name ? name.value : '',
        nameDisabled: name ? name.disabled : false,
        versionHtml: version ? version.innerHTML : '',
        statusHtml: status ? status.innerHTML : ''
      };
    }
    if (name) {
      name.value = nodeInfo.data.label || '';
      name.disabled = true;
    }
    if (version) version.innerHTML = '<option>V1</option>';
    if (status) status.innerHTML = '<span class="status-running">未调度</span>';
  },

  _openCanvasNodeDetail: function (nodeInfo) {
    if (!nodeInfo || nodeInfo.data.specialKind || nodeInfo.data.type === 'start' || nodeInfo.data.type === 'end') return;
    var tree = document.getElementById('ddTreeContent');
    var treeNode = null;
    if (tree) {
      treeNode = Array.prototype.find.call(tree.querySelectorAll('.dd-tree-node'), function (node) {
        return node.getAttribute('data-label') === nodeInfo.data.label;
      });
    }
    var kind = nodeInfo.data.kind || (treeNode ? treeNode.getAttribute('data-node-kind') : '');
    if (!kind) return;
    if (tree && treeNode) {
      tree.querySelectorAll('.dd-tree-node.active').forEach(function (node) { node.classList.remove('active'); });
      treeNode.classList.add('active');
    }
    if (kind === 'collection') this._switchToCollectionView(nodeInfo.data.label);
    else if (kind === 'package') this._switchToPackageView(nodeInfo.data.label, 'batch');
    else if (kind === 'code') this._switchToEditorView(nodeInfo.data.label, null, 'batch');
    else if (kind === 'batch-design') this._switchToStreamDesignerView(nodeInfo.data.label, null, 'batch');
  },

  _insertSpecialCanvasNode: function (kind, label, point, extra) {
    var st = this._canvasState;
    if (!st) return null;
    this._specialNodeSeq = (this._specialNodeSeq || 0) + 1;
    var iconMap = { quality: 'quality', param: 'param', pre: 'trigger', summary: 'summary' };
    var node = Object.assign({
      id: 'special-' + kind + '-' + this._specialNodeSeq,
      type: 'task',
      specialKind: kind,
      label: label,
      icon: iconMap[kind] || 'process',
      x: Math.max(0, Math.min(st.worldWidth - 190, Math.round((point && point.x) || 520))),
      y: Math.max(0, Math.min(st.worldHeight - 54, Math.round((point && point.y) || 250)))
    }, extra || {});
    var el = this._createCanvasNodeElement(node);
    st.world.appendChild(el);
    st.nodeMap[node.id] = { el: el, data: node };
    this._nodesData.push(node);
    st.canvas.querySelectorAll('.dd-node.selected').forEach(function (item) { item.classList.remove('selected'); });
    el.classList.add('selected');
    this._showCanvasNodeProperties(st.nodeMap[node.id]);
    this._redrawEdges();
    return node;
  },

  /* ---- 渲染画布 ---- */
  _renderCanvas: function () {
    var canvas = document.getElementById('ddCanvas');
    if (!canvas) return;
    var self = this;
    var nodeMap = {};
    if (self._canvasState && self._canvasState.resizeObserver) self._canvasState.resizeObserver.disconnect();
    var stage = document.createElement('div');
    var world = document.createElement('div');
    stage.className = 'dd-canvas-stage';
    world.className = 'dd-canvas-world';
    stage.appendChild(world);
    canvas.appendChild(stage);

    self._nodesData.forEach(function (nd) {
      var el = self._createCanvasNodeElement(nd);
      world.appendChild(el);
      nodeMap[nd.id] = { el: el, data: nd };
    });

    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'dd-connections');
    var defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    var marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
    marker.setAttribute('id', 'ddArrow');
    marker.setAttribute('markerWidth', '8');
    marker.setAttribute('markerHeight', '8');
    marker.setAttribute('markerUnits', 'userSpaceOnUse');
    marker.setAttribute('refX', '7');
    marker.setAttribute('refY', '4');
    marker.setAttribute('orient', 'auto');
    var mp = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    mp.setAttribute('d', 'M0,1 L7,4 L0,7 Z');
    marker.appendChild(mp);
    defs.appendChild(marker);
    svg.appendChild(defs);
    world.insertBefore(svg, world.firstChild);

    self._canvasState = {
      canvas: canvas,
      stage: stage,
      world: world,
      svg: svg,
      nodeMap: nodeMap,
      worldWidth: 1460,
      worldHeight: 620,
      panPadding: 320,
      panInitialized: false,
      scale: 1,
      offsetX: 0,
      offsetY: 0
    };

    if (window.ResizeObserver) {
      self._canvasState.resizeObserver = new ResizeObserver(function () { self._updateCanvasTransform(); });
      self._canvasState.resizeObserver.observe(canvas);
    }

    requestAnimationFrame(function () {
      self._redrawEdges();
      self._updateCanvasTransform();
    });

    canvas.addEventListener('mousedown', function (e) {
      var nodeEl = e.target.closest('.dd-node');

      /* 空白处按住右键拖动画布；发生位移后不弹出右键菜单。 */
      if (e.button === 2 && !nodeEl) {
        e.preventDefault();
        var panStartX = e.clientX;
        var panStartY = e.clientY;
        var startScrollLeft = canvas.scrollLeft;
        var startScrollTop = canvas.scrollTop;
        var didPan = false;
        canvas.classList.add('is-panning');
        function onPanMove(ev) {
          ev.preventDefault();
          var moveX = ev.clientX - panStartX;
          var moveY = ev.clientY - panStartY;
          if (Math.abs(moveX) > 3 || Math.abs(moveY) > 3) didPan = true;
          canvas.scrollLeft = startScrollLeft - moveX;
          canvas.scrollTop = startScrollTop - moveY;
        }
        function onPanUp() {
          canvas.classList.remove('is-panning');
          if (didPan) {
            self._suppressCanvasContextMenu = true;
            setTimeout(function () { self._suppressCanvasContextMenu = false; }, 180);
          }
          document.removeEventListener('mousemove', onPanMove);
          document.removeEventListener('mouseup', onPanUp);
        }
        document.addEventListener('mousemove', onPanMove);
        document.addEventListener('mouseup', onPanUp);
        return;
      }

      if (e.button !== 0) return;
      e.preventDefault();

      /* 点击并拖动节点：若节点属于多选集合，则整组一起移动。 */
      if (nodeEl) {
        var additive = e.ctrlKey || e.metaKey || e.shiftKey;
        if (additive) {
          nodeEl.classList.toggle('selected');
          if (!nodeEl.classList.contains('selected')) return;
        } else if (!nodeEl.classList.contains('selected')) {
          canvas.querySelectorAll('.dd-node.selected').forEach(function (node) { node.classList.remove('selected'); });
          nodeEl.classList.add('selected');
        }

        var selected = Array.prototype.map.call(canvas.querySelectorAll('.dd-node.selected'), function (selectedEl) {
          var selectedId = selectedEl.id.replace('ddNode_', '');
          var selectedInfo = nodeMap[selectedId];
          return selectedInfo ? {
            info: selectedInfo,
            x: selectedInfo.data.x,
            y: selectedInfo.data.y,
            width: selectedEl.offsetWidth,
            height: selectedEl.offsetHeight
          } : null;
        }).filter(Boolean);
        var startX = e.clientX;
        var startY = e.clientY;
        var didNodeDrag = false;
        var minX = Math.min.apply(null, selected.map(function (item) { return item.x; }));
        var minY = Math.min.apply(null, selected.map(function (item) { return item.y; }));
        var maxRight = Math.max.apply(null, selected.map(function (item) { return item.x + item.width; }));
        var maxBottom = Math.max.apply(null, selected.map(function (item) { return item.y + item.height; }));
        selected.forEach(function (item) { item.info.el.style.zIndex = '10'; });

        function onNodeMove(ev) {
          var scale = self._canvasState.scale || 1;
          var dx = (ev.clientX - startX) / scale;
          var dy = (ev.clientY - startY) / scale;
          if (Math.abs(ev.clientX - startX) > 3 || Math.abs(ev.clientY - startY) > 3) didNodeDrag = true;
          dx = Math.max(-minX, Math.min(self._canvasState.worldWidth - maxRight, dx));
          dy = Math.max(-minY, Math.min(self._canvasState.worldHeight - maxBottom, dy));
          selected.forEach(function (item) {
            item.info.data.x = item.x + dx;
            item.info.data.y = item.y + dy;
            item.info.el.style.left = item.info.data.x + 'px';
            item.info.el.style.top = item.info.data.y + 'px';
          });
          self._redrawEdges();
        }
        function onNodeUp() {
          selected.forEach(function (item) { item.info.el.style.zIndex = ''; });
          if (didNodeDrag) {
            self._suppressCanvasNodeOpen = true;
            setTimeout(function () { self._suppressCanvasNodeOpen = false; }, 120);
          }
          document.removeEventListener('mousemove', onNodeMove);
          document.removeEventListener('mouseup', onNodeUp);
          document.body.style.cursor = '';
          document.body.style.userSelect = '';
        }
        document.body.style.cursor = 'grabbing';
        document.body.style.userSelect = 'none';
        document.addEventListener('mousemove', onNodeMove);
        document.addEventListener('mouseup', onNodeUp);
        return;
      }

      /* 空白处左键拖动：绘制选择框并选中相交节点。 */
      var additiveSelection = e.ctrlKey || e.metaKey || e.shiftKey;
      var initialSelection = {};
      canvas.querySelectorAll('.dd-node.selected').forEach(function (node) {
        initialSelection[node.id] = true;
        if (!additiveSelection) node.classList.remove('selected');
      });
      var canvasRect = canvas.getBoundingClientRect();
      var boxStartX = e.clientX;
      var boxStartY = e.clientY;
      var selectionBox = document.createElement('div');
      selectionBox.className = 'dd-selection-box';
      stage.appendChild(selectionBox);
      var didBoxSelect = false;

      function onBoxMove(ev) {
        var left = Math.min(boxStartX, ev.clientX);
        var top = Math.min(boxStartY, ev.clientY);
        var right = Math.max(boxStartX, ev.clientX);
        var bottom = Math.max(boxStartY, ev.clientY);
        if (right - left > 3 || bottom - top > 3) didBoxSelect = true;
        selectionBox.style.left = (left - canvasRect.left + canvas.scrollLeft) + 'px';
        selectionBox.style.top = (top - canvasRect.top + canvas.scrollTop) + 'px';
        selectionBox.style.width = (right - left) + 'px';
        selectionBox.style.height = (bottom - top) + 'px';

        Object.keys(nodeMap).forEach(function (id) {
          var candidate = nodeMap[id].el;
          var rect = candidate.getBoundingClientRect();
          var intersects = rect.right >= left && rect.left <= right && rect.bottom >= top && rect.top <= bottom;
          candidate.classList.toggle('selected', intersects || (additiveSelection && initialSelection[candidate.id]));
        });
      }
      function onBoxUp() {
        selectionBox.remove();
        if (!didBoxSelect && !additiveSelection) {
          canvas.querySelectorAll('.dd-node.selected').forEach(function (node) { node.classList.remove('selected'); });
        }
        document.removeEventListener('mousemove', onBoxMove);
        document.removeEventListener('mouseup', onBoxUp);
        document.body.style.userSelect = '';
      }
      document.body.style.userSelect = 'none';
      document.addEventListener('mousemove', onBoxMove);
      document.addEventListener('mouseup', onBoxUp);
    });

    canvas.addEventListener('click', function (e) {
      if (self._suppressCanvasNodeOpen || e.ctrlKey || e.metaKey || e.shiftKey) return;
      var nodeEl = e.target.closest('.dd-node');
      if (!nodeEl) {
        self._showFlowProperties();
        return;
      }
      var nodeId = nodeEl.id.replace('ddNode_', '');
      var nodeInfo = nodeMap[nodeId];
      if (nodeInfo) self._showCanvasNodeProperties(nodeInfo);
    });

    canvas.addEventListener('dblclick', function (e) {
      if (self._suppressCanvasNodeOpen || e.ctrlKey || e.metaKey || e.shiftKey) return;
      var nodeEl = e.target.closest('.dd-node');
      if (!nodeEl) return;
      var nodeId = nodeEl.id.replace('ddNode_', '');
      self._openCanvasNodeDetail(nodeMap[nodeId]);
    });

    canvas.addEventListener('wheel', function (e) {
      if (!e.ctrlKey) return;
      e.preventDefault();
      self._setCanvasScale((self._canvasState.scale || 1) + (e.deltaY < 0 ? self._canvasScaleStep : -self._canvasScaleStep), true);
    }, { passive: false });

    var zoomTools = document.querySelector('.dd-canvas-zoom');
    if (zoomTools) {
      zoomTools.addEventListener('click', function (e) {
        var button = e.target.closest('[data-dd-zoom]');
        if (!button || button.disabled) return;
        var action = button.getAttribute('data-dd-zoom');
        var scale = self._canvasState.scale || 1;
        if (action === 'out') self._setCanvasScale(scale - self._canvasScaleStep, true);
        if (action === 'in') self._setCanvasScale(scale + self._canvasScaleStep, true);
        if (action === 'reset') self._setCanvasScale(1, true);
        if (action === 'fit') self._fitCanvas();
      });
    }
  },

  /* ---- 重绘所有连线 ---- */
  _redrawEdges: function () {
    var st = this._canvasState;
    if (!st) return;
    var svg = st.svg;
    var nodeMap = st.nodeMap;

    var paths = svg.querySelectorAll('path:not(marker path)');
    paths.forEach(function (p) { p.remove(); });

    function getPort(id, side) {
      var info = nodeMap[id];
      if (!info) return { x: 0, y: 0 };
      var selector = side === 'right' ? '.dd-node-port:last-child' : '.dd-node-port:first-child';
      var port = info.el.querySelector(selector);
      if (port && st.world) {
        var scale = st.scale || 1;
        var portRect = port.getBoundingClientRect();
        var worldRect = st.world.getBoundingClientRect();
        return {
          x: ((side === 'right' ? portRect.right : portRect.left) - worldRect.left) / scale,
          y: (portRect.top + portRect.height / 2 - worldRect.top) / scale
        };
      }
      var inner = info.el.firstElementChild;
      var w = inner ? inner.offsetWidth : 80;
      var h = inner ? inner.offsetHeight : 34;
      if (side === 'right') return { x: info.data.x + w, y: info.data.y + h / 2 };
      return { x: info.data.x, y: info.data.y + h / 2 };
    }

    this._edgesData.forEach(function (edge) {
      var from = getPort(edge.from, 'right');
      var to = getPort(edge.to, 'left');
      var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      var mx = (from.x + to.x) / 2;
      path.setAttribute('d',
        'M' + from.x + ',' + from.y +
        ' C' + mx + ',' + from.y + ' ' + mx + ',' + to.y + ' ' + to.x + ',' + to.y
      );
      path.setAttribute('marker-end', 'url(#ddArrow)');
      svg.appendChild(path);
    });
  },

  /* ---- 左侧树右键菜单 ---- */
  _initTreeContextMenu: function () {
    var menu = document.createElement('div');
    menu.className = 'dd-ctx-menu';
    menu.id = 'ddTreeCtxMenu';
    document.body.appendChild(menu);

    var treePanel = document.querySelector('.dd-tree-content');
    if (!treePanel) return;

    var menuTypes = {
      batch: {
        visual: [
          ['数据采集流程', 'sub-batch-single-table'],
          ['数据治理流程', 'sub-batch-governance-new'],
          ['深度学习流程', 'sub-batch-deep-learning'],
          ['批量采集流程', 'sub-batch-batch-collect']
        ],
        online: [
          ['HiveSQL', 'sub-code-hivesql'], ['python脚本', 'sub-code-python'], ['Sqoop Job', 'sub-code-sqoop'], ['存储过程', 'sub-code-procedure'],
          ['Shell脚本', 'sub-code-shell'], ['SQL', 'sub-code-sql'], ['FlinkSQL', 'sub-code-flinksql'], ['ImpalaSQL', 'sub-code-impala']
        ],
        package: [
          ['HiveSQL', 'sub-package-hive'], ['python脚本', 'sub-package-python'], ['Sqoop Job', 'sub-package-sqoop'], ['Java程序', 'sub-package-java'],
          ['Shell脚本', 'sub-package-shell'], ['Flink Java', 'sub-package-flink'], ['ImpalaSQL', 'sub-package-impala']
        ]
      },
      stream: {
        visual: [
          ['流式数据采集流程', 'sub-stream-ingest'], ['流式处理流程', 'sub-stream-process'], ['数据同步(Flink CDC)', 'sub-stream-cdc']
        ],
        online: [
          ['HiveSQL', 'sub-stream-code-hive'], ['python脚本', 'sub-stream-code-python'], ['Sqoop Job', 'sub-stream-code-sqoop'],
          ['存储过程', 'sub-stream-code-procedure'], ['FlinkSQL', 'sub-stream-code-flinksql'], ['ImpalaSQL', 'sub-stream-code-impala']
        ],
        package: [
          ['HiveSQL', 'sub-stream-package-hive'], ['python脚本', 'sub-stream-package-python'], ['Sqoop Job', 'sub-stream-package-sqoop'],
          ['Java程序', 'sub-stream-package-java'], ['Flink Java', 'sub-stream-package-flink'], ['ImpalaSQL', 'sub-stream-package-impala']
        ]
      }
    };

    function submenuItems(items) {
      return items.map(function (item) {
        return '<div class="dd-ctx-menu-item" data-open-node="' + item[1] + '"><i class="bi bi-file-earmark-plus"></i>' + item[0] + '</div>';
      }).join('');
    }

    function category(label, icon, items) {
      return '<div class="dd-ctx-submenu-wrap"><div class="dd-ctx-menu-item"><i class="bi ' + icon + '"></i>' + label + '<span class="sub-arrow"><i class="bi bi-chevron-right"></i></span></div><div class="dd-ctx-submenu">' + submenuItems(items) + '</div></div>';
    }

    function renderMenu(mode) {
      var types = menuTypes[mode] || menuTypes.batch;
      return '<div class="dd-ctx-menu-title">' + (mode === 'stream' ? '流式计算业务流程' : '批量计算业务流程') + '</div>' +
        '<div class="dd-ctx-menu-item" data-act="new-flow"><i class="bi bi-plus-circle"></i>新建业务流程</div>' +
        '<div class="dd-ctx-menu-item" data-act="import-flow"><i class="bi bi-box-arrow-in-down"></i>导入业务流程</div>' +
        '<div class="dd-ctx-menu-item" data-act="edit-flow"><i class="bi bi-pencil-square"></i>编辑业务流程</div>' +
        '<div class="dd-ctx-menu-item" data-act="move"><i class="bi bi-arrows-move"></i>移动</div>' +
        '<div class="dd-ctx-menu-item" data-act="new-folder"><i class="bi bi-folder-plus"></i>新建文件夹</div>' +
        '<div class="dd-ctx-submenu-wrap"><div class="dd-ctx-menu-item" data-act="new-sub"><i class="bi bi-diagram-3"></i>新建子流程<span class="sub-arrow"><i class="bi bi-chevron-right"></i></span></div><div class="dd-ctx-submenu dd-ctx-type-menu">' +
          category('可视化编程', 'bi-bezier2', types.visual) + category('在线编程', 'bi-code-slash', types.online) + category('上传程序包', 'bi-box-seam', types.package) +
        '</div></div>' +
        '<div class="dd-ctx-menu-item" data-act="export"><i class="bi bi-box-arrow-up"></i>导出</div>' +
        '<div class="dd-ctx-menu-item" data-act="copy"><i class="bi bi-copy"></i>复制</div>' +
        '<div class="dd-ctx-menu-item" data-act="publish"><i class="bi bi-cloud-arrow-up"></i>发布</div>' +
        '<div class="dd-ctx-divider"></div>' +
        '<div class="dd-ctx-menu-item danger" data-act="delete"><i class="bi bi-trash3"></i>删除</div>';
    }

    function openExampleNode(nodeId) {
      var target = treePanel.querySelector('[data-node-id="' + nodeId + '"]');
      if (!target) return;
      var branch = target.closest('.dd-tree-children');
      while (branch) {
        branch.classList.add('open');
        var parent = branch.previousElementSibling;
        if (parent) {
          var arrow = parent.querySelector('.dd-tree-arrow');
          if (arrow) arrow.classList.add('open');
        }
        branch = branch.parentElement ? branch.parentElement.closest('.dd-tree-children') : null;
      }
      target.click();
      target.scrollIntoView({ block: 'nearest' });
    }

    treePanel.addEventListener('contextmenu', function (e) {
      e.preventDefault();
      e.stopPropagation();
      var node = e.target.closest('.dd-tree-node');
      if (node) {
        treePanel.querySelectorAll('.dd-tree-node.active').forEach(function (n) { n.classList.remove('active'); });
        node.classList.add('active');
      }
      var mode = node ? node.getAttribute('data-flow-mode') : 'batch';
      menu.setAttribute('data-flow-mode', mode || 'batch');
      menu.innerHTML = renderMenu(mode || 'batch');
      _showMenu(menu, e.clientX, e.clientY);
    });

    menu.addEventListener('click', function (event) {
      var item = event.target.closest('.dd-ctx-menu-item');
      if (!item) return;
      var targetId = item.getAttribute('data-open-node');
      if (targetId) openExampleNode(targetId);
      menu.classList.remove('show');
    });
  },

  _executeCanvasAction: function (action) {
    var st = this._canvasState;
    if (!st) return;
    var self = this;
    var insertMap = {
      'ins-quality': { kind: 'quality', label: '质量节点' },
      'ins-param': { kind: 'param', label: '参数节点' },
      'ins-pre': { kind: 'pre', label: '前置任务' }
    };
    if (insertMap[action]) {
      var target = insertMap[action];
      self._insertSpecialCanvasNode(target.kind, target.label, self._canvasContextPoint);
      return;
    }
    if (action === 'ins-summary') {
      self._openSummaryInsertDialog(self._canvasContextPoint);
      return;
    }
    var selected = Array.prototype.map.call(st.canvas.querySelectorAll('.dd-node.selected'), function (el) {
      var id = el.id.replace('ddNode_', '');
      var info = st.nodeMap[id];
      return info ? { id: id, el: el, data: info.data, width: el.offsetWidth, height: el.offsetHeight } : null;
    }).filter(Boolean);

    if (action === 'auto-layout') {
      var defaults = {
        start: [32, 288], n1: [180, 288], n2: [430, 150], n3: [430, 288], n4: [430, 426],
        n5: [670, 205], n6: [670, 400], n7: [905, 288], n8: [1125, 288], end: [1310, 288]
      };
      Object.keys(st.nodeMap).forEach(function (id) {
        if (!defaults[id]) return;
        var info = st.nodeMap[id];
        info.data.x = defaults[id][0];
        info.data.y = defaults[id][1];
        info.el.style.left = info.data.x + 'px';
        info.el.style.top = info.data.y + 'px';
      });
      self._redrawEdges();
      return;
    }

    if (action === 'delete' && selected.length) {
      var removed = {};
      selected.forEach(function (item) {
        removed[item.id] = true;
        item.el.remove();
        delete st.nodeMap[item.id];
      });
      self._nodesData = self._nodesData.filter(function (node) { return !removed[node.id]; });
      self._edgesData = self._edgesData.filter(function (edge) { return !removed[edge.from] && !removed[edge.to]; });
      self._showFlowProperties();
      self._redrawEdges();
      return;
    }

    if (selected.length < 2 || action.indexOf('align-') !== 0 && action.indexOf('dist-') !== 0) return;
    var left = Math.min.apply(null, selected.map(function (item) { return item.data.x; }));
    var right = Math.max.apply(null, selected.map(function (item) { return item.data.x + item.width; }));
    var top = Math.min.apply(null, selected.map(function (item) { return item.data.y; }));
    var bottom = Math.max.apply(null, selected.map(function (item) { return item.data.y + item.height; }));
    var centerX = (left + right) / 2;
    var centerY = (top + bottom) / 2;

    if (action === 'align-left') selected.forEach(function (item) { item.data.x = left; });
    if (action === 'align-center-h') selected.forEach(function (item) { item.data.x = centerX - item.width / 2; });
    if (action === 'align-right') selected.forEach(function (item) { item.data.x = right - item.width; });
    if (action === 'align-top') selected.forEach(function (item) { item.data.y = top; });
    if (action === 'align-center-v') selected.forEach(function (item) { item.data.y = centerY - item.height / 2; });
    if (action === 'align-bottom') selected.forEach(function (item) { item.data.y = bottom - item.height; });
    if (action === 'dist-h' && selected.length >= 3) {
      selected.sort(function (a, b) { return a.data.x + a.width / 2 - (b.data.x + b.width / 2); });
      var firstCenterX = selected[0].data.x + selected[0].width / 2;
      var lastCenterX = selected[selected.length - 1].data.x + selected[selected.length - 1].width / 2;
      selected.forEach(function (item, index) {
        item.data.x = firstCenterX + (lastCenterX - firstCenterX) * index / (selected.length - 1) - item.width / 2;
      });
    }
    if (action === 'dist-v' && selected.length >= 3) {
      selected.sort(function (a, b) { return a.data.y + a.height / 2 - (b.data.y + b.height / 2); });
      var firstCenterY = selected[0].data.y + selected[0].height / 2;
      var lastCenterY = selected[selected.length - 1].data.y + selected[selected.length - 1].height / 2;
      selected.forEach(function (item, index) {
        item.data.y = firstCenterY + (lastCenterY - firstCenterY) * index / (selected.length - 1) - item.height / 2;
      });
    }

    selected.forEach(function (item) {
      item.el.style.left = item.data.x + 'px';
      item.el.style.top = item.data.y + 'px';
    });
    self._redrawEdges();
  },

  /* ---- 画布右键菜单 ---- */
  _initCanvasContextMenu: function () {
    var oldMenu = document.getElementById('ddCanvasCtxMenu');
    if (oldMenu) oldMenu.remove();
    var menu = document.createElement('div');
    menu.className = 'dd-ctx-menu';
    menu.id = 'ddCanvasCtxMenu';
    document.body.appendChild(menu);

    var canvasEl = document.getElementById('ddCanvas');
    if (!canvasEl) return;
    var self = this;

    function item(action, icon, label, disabled, danger) {
      return '<div class="dd-ctx-menu-item' + (disabled ? ' disabled' : '') + (danger ? ' danger' : '') + '" data-act="' + action + '"' + (disabled ? ' aria-disabled="true"' : '') + '><i class="bi ' + icon + '"></i><span>' + label + '</span></div>';
    }

    function renderMenu(selectedCount) {
      if (!selectedCount) {
        return item('auto-layout', 'bi-grid-3x3', '整体自动布局') +
          item('auto-connect', 'bi-bezier2', '自动连线') +
          item('auto-parallel-connect', 'bi-signpost-split', '自动并发连线') +
          '<div class="dd-ctx-divider"></div>' +
          item('ins-quality', 'bi-shield-check', '插入质量节点') +
          item('ins-param', 'bi-sliders', '插入参数节点') +
          item('ins-pre', 'bi-skip-start', '插入前置任务') +
          item('ins-summary', 'bi-table', '插入汇总表');
      }
      return item('auto-connect', 'bi-bezier2', '自动连线') +
        item('auto-parallel-connect', 'bi-signpost-split', '自动并发连线') +
        '<div class="dd-ctx-divider"></div>' +
        item('align-left', 'bi-text-left', '左对齐', selectedCount < 2) +
        item('align-center-h', 'bi-text-center', '水平居中对齐', selectedCount < 2) +
        item('align-right', 'bi-text-right', '右对齐', selectedCount < 2) +
        '<div class="dd-ctx-divider"></div>' +
        item('align-top', 'bi-align-top', '顶对齐', selectedCount < 2) +
        item('align-center-v', 'bi-align-middle', '垂直居中对齐', selectedCount < 2) +
        item('align-bottom', 'bi-align-bottom', '底对齐', selectedCount < 2) +
        '<div class="dd-ctx-divider"></div>' +
        item('dist-h', 'bi-distribute-horizontal', '水平平均分布', selectedCount < 3) +
        item('dist-v', 'bi-distribute-vertical', '垂直平均分布', selectedCount < 3) +
        '<div class="dd-ctx-divider"></div>' +
        item('delete', 'bi-trash3', '删除选中节点', false, true);
    }

    canvasEl.addEventListener('contextmenu', function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (self._suppressCanvasContextMenu) return;
      var targetNode = e.target.closest('.dd-node');
      if (targetNode && !targetNode.classList.contains('selected')) {
        canvasEl.querySelectorAll('.dd-node.selected').forEach(function (node) { node.classList.remove('selected'); });
        targetNode.classList.add('selected');
      } else if (!targetNode) {
        canvasEl.querySelectorAll('.dd-node.selected').forEach(function (node) { node.classList.remove('selected'); });
        var st = self._canvasState;
        var rect = canvasEl.getBoundingClientRect();
        var scale = st && st.scale ? st.scale : 1;
        self._canvasContextPoint = {
          x: (canvasEl.scrollLeft + e.clientX - rect.left - (st ? st.offsetX : 0)) / scale - 85,
          y: (canvasEl.scrollTop + e.clientY - rect.top - (st ? st.offsetY : 0)) / scale - 24
        };
      }
      var selectedCount = canvasEl.querySelectorAll('.dd-node.selected').length;
      menu.innerHTML = renderMenu(selectedCount);
      _showMenu(menu, e.clientX, e.clientY);
    });

    menu.addEventListener('click', function (e) {
      var command = e.target.closest('.dd-ctx-menu-item');
      if (!command || command.classList.contains('disabled')) return;
      self._executeCanvasAction(command.getAttribute('data-act'));
      menu.classList.remove('show');
    });
  },

  _qualityLogicRowHtml: function () {
    return '<tr>' +
      '<td><select data-quality-logic><option value="">请选择</option><option>非空</option><option>为空</option><option>等于</option><option>不等于</option><option>大于</option><option>大于等于</option><option>小于</option><option>小于等于</option><option>区间内</option><option>区间外</option></select></td>' +
      '<td><input type="text" placeholder="请输入判断值"></td>' +
      '<td><select><option value="">请选择</option><option>将任务设置为失败</option></select></td>' +
      '<td><button class="dd-special-icon-btn danger" type="button" data-special-action="remove-quality-row" title="删除"><i class="bi bi-trash3"></i></button></td>' +
    '</tr>';
  },

  _dependencyRowHtml: function () {
    return '<div class="dd-special-dependency-row">' +
      '<select data-dep-level="project"><option value="">请选择项目</option><option>物流数据演示系统</option><option>数据中台演示</option></select>' +
      '<div class="dd-special-dependency-picker" data-dep-directory-picker data-value=""><button type="button" data-special-action="toggle-dep-directory" disabled><span>请选择目录</span><i class="bi bi-chevron-down"></i></button><div class="dd-special-dependency-menu"><div class="dd-special-tree-search"><i class="bi bi-search"></i><input type="text" placeholder="关键词搜索" data-dep-directory-search></div><div data-dep-directory-list><div class="dd-special-empty">请先选择项目</div></div></div></div>' +
      '<select data-dep-level="task" disabled><option value="">请选择任务</option></select>' +
      '<select data-dep-level="version" disabled><option value="">请选择版本</option></select>' +
      '<button class="dd-special-icon-btn danger" type="button" data-special-action="remove-dependency" title="删除"><i class="bi bi-trash3"></i></button>' +
    '</div>';
  },

  _dependencyTasksFor: function (directory) {
    var tasks = {
      '物流离线数仓': ['物流订单采集', '运输时效汇总'],
      '中电数智流式数仓': ['物流事件流处理'],
      ODS: ['ods_t_store_info_df', 'ods_t_sales_order_df'],
      DWD: ['dwd_sales_order_detail'],
      DWS: ['dws_store_sales_day'],
      ADS: ['ads_store_operation']
    };
    return tasks[directory] || [];
  },

  _renderSpecialNodeProperties: function (node) {
    var body = document.querySelector('.dd-props-body');
    var strip = document.querySelector('.dd-props-strip');
    var panel = document.getElementById('ddSpecialNodeProps');
    if (!body || !strip || !panel) return;
    strip.style.display = 'none';
    body.querySelectorAll('.dd-props-tab-content').forEach(function (item) { item.classList.remove('active'); });
    panel.style.display = 'block';
    panel.setAttribute('data-special-node-id', node.id);

    var head = '<div class="dd-special-node-title"><i class="bi ' + (this._iconMap[node.icon] || 'bi-gear') + '"></i><strong>' + node.label + '</strong></div>';
    var save = '<button class="btn btn-primary dd-special-save" type="button" data-special-action="save"><i class="bi bi-save"></i> 保存</button><div class="dd-special-node-toast" role="status"></div>';

    if (node.specialKind === 'quality') {
      panel.innerHTML = head +
        '<div class="dd-special-form-group"><label><em>*</em> 名称</label><input type="text" value="' + node.label + '" data-node-name></div>' +
        '<div class="dd-special-form-group dd-quality-rule-field"><label>选择规则</label><button class="dd-special-select-trigger" type="button" data-special-action="toggle-quality-rule"><span>请选择</span><i class="bi bi-chevron-down"></i></button>' +
          '<div class="dd-quality-rule-menu"><div class="dd-special-tree-search"><i class="bi bi-search"></i><input type="text" placeholder="关键词搜索" data-special-rule-search></div>' +
            '<details open><summary>系统规则</summary><button type="button" data-quality-rule="长度校验">长度校验</button><button type="button" data-quality-rule="取值范围约束">取值范围约束</button><button type="button" data-quality-rule="大小值校验">大小值校验</button><button type="button" data-quality-rule="身份证号校验(18位)">身份证号校验(18位)</button><button type="button" data-quality-rule="及时性校验">及时性校验</button><button type="button" data-quality-rule="唯一性校验">唯一性校验</button><button type="button" data-quality-rule="非空校验">非空校验</button></details>' +
            '<details><summary>数据质量-报告</summary><button type="button" data-quality-rule="完整性_非空稽查_mysql">完整性_非空稽查_mysql</button><button type="button" data-quality-rule="有效性_正则格式稽查_mysql">有效性_正则格式稽查_mysql</button><button type="button" data-quality-rule="准确性_数量乘单价等于记录金额稽查_mysql_v2">准确性_数量乘单价等于记录金额稽查_mysql_v2</button></details>' +
            '<details><summary>业务系统</summary><button type="button" data-quality-rule="字段非空校验">字段非空校验</button><button type="button" data-quality-rule="长度不能超过 10 个字符">长度不能超过 10 个字符</button><button type="button" data-quality-rule="筛选出重复的记录">筛选出重复的记录</button></details>' +
          '</div></div>' +
        '<div class="dd-special-code-box"><div class="dd-special-editor-toolbar"><select aria-label="编辑器主题"><option>暗色 - One Dark</option></select><select aria-label="编辑器字号"><option>14px</option></select><button type="button"><i class="bi bi-magic"></i> 格式化</button><button type="button"><i class="bi bi-copy"></i> 复制</button><button type="button"><i class="bi bi-search"></i> 搜索</button><button type="button" title="全屏"><i class="bi bi-arrows-fullscreen"></i></button></div><textarea spellcheck="false" aria-label="规则脚本"></textarea></div>' +
        '<div class="dd-special-section-head"><strong>执行逻辑</strong><button class="dd-special-icon-btn" type="button" data-special-action="add-quality-row" title="新增一行"><i class="bi bi-plus-square"></i></button></div>' +
        '<div class="dd-special-table-wrap"><table class="dd-special-table"><thead><tr><th>逻辑判断</th><th>判断值</th><th>处理机制</th><th>操作</th></tr></thead><tbody data-quality-logic-body>' + this._qualityLogicRowHtml() + '</tbody></table></div>' + save;
    } else if (node.specialKind === 'param') {
      panel.innerHTML = head +
        '<div class="dd-special-form-group"><label><em>*</em> 名称</label><input type="text" value="' + node.label + '" data-node-name></div>' +
        '<div class="dd-special-form-group"><label>配置方式</label><select><option>数据库SQL获取</option></select></div>' +
        '<div class="dd-special-form-group"><label>数据库</label><details class="dd-special-db-picker"><summary>请选择数据库</summary><div class="dd-special-db-pop"><div class="dd-special-tree-search"><i class="bi bi-search"></i><input type="text" placeholder="关键词搜索" data-special-db-search></div><div data-special-db-list><details open><summary>ODS-贴源层</summary><button type="button">业务系统 / 测试业务系统</button><button type="button">物流_ODS</button></details><details open><summary>DWD-数据明细层</summary><button type="button">DWD_数据</button></details><details><summary>DWS-数据汇总层</summary><button type="button">DWS_数据汇总</button></details><details><summary>ADS-应用层</summary><button type="button">ADS_数据超市</button></details><details><summary>数据质量-报告</summary><button type="button">itas_tmp3</button></details></div></div></details></div>' +
        '<div class="dd-special-form-group"><label>执行SQL <span>支持全局参数${param}格式</span></label><div class="dd-special-code-box"><div class="dd-special-editor-toolbar"><select aria-label="编辑器主题"><option>暗色 - One Dark</option></select><select aria-label="编辑器字号"><option>14px</option></select><button type="button"><i class="bi bi-magic"></i> 格式化</button><button type="button"><i class="bi bi-copy"></i> 复制</button><button type="button"><i class="bi bi-search"></i> 搜索</button><button type="button" title="全屏"><i class="bi bi-arrows-fullscreen"></i></button></div><textarea spellcheck="false" data-param-sql>SELECT store_code, biz_date\nFROM ods_store_daily\nWHERE biz_date = ${biz_date}</textarea></div></div>' +
        '<button class="btn" type="button" data-special-action="preview-param"><i class="bi bi-play-circle"></i> 执行预览</button>' +
        '<div class="dd-special-section-head dd-param-match-head"><strong>关系匹配</strong><span>参数禁用之后不再从该节点取值</span></div>' +
        '<div class="dd-param-match-grid"><div><table class="dd-special-table"><thead><tr><th>字段名称</th><th>数值</th></tr></thead><tbody data-param-field-preview><tr><td colspan="2" class="dd-special-empty">暂无数据</td></tr></tbody></table></div><div><table class="dd-special-table"><thead><tr><th>参数名称</th><th>参数说明</th><th>操作</th></tr></thead><tbody data-param-match-preview><tr><td colspan="3" class="dd-special-empty">暂无数据</td></tr></tbody></table></div></div>' + save;
    } else if (node.specialKind === 'pre') {
      panel.innerHTML = head +
        '<div class="dd-special-form-group"><label><em>*</em> 名称</label><input type="text" value="' + node.label + '" data-node-name></div>' +
        '<div class="dd-special-section-head"><div><strong>前置任务</strong><span>（最多100个）</span></div><button class="btn" type="button" data-special-action="add-dependency"><i class="bi bi-plus-lg"></i> 添加</button></div>' +
        '<div class="dd-special-dependency-list" data-dependency-list>' + this._dependencyRowHtml() + '</div>' + save;
    } else {
      panel.innerHTML = head +
        '<div class="dd-special-form-group"><label><em>*</em> 名称</label><input type="text" value="' + node.label + '" data-node-name></div>' +
        '<div class="dd-special-form-group"><label><em>*</em> 汇总表任务</label><select data-summary-task><option value="">请选择</option><option>门店日销售汇总任务</option><option>区域销售指标汇总任务</option><option>商品销量汇总任务</option></select></div>' + save;
      var summarySelect = panel.querySelector('[data-summary-task]');
      if (summarySelect && node.summaryTask) summarySelect.value = node.summaryTask;
    }
    body.scrollTop = 0;
  },

  _initSpecialNodeProps: function () {
    var panel = document.getElementById('ddSpecialNodeProps');
    if (!panel) return;
    var self = this;
    panel.addEventListener('click', function (event) {
      var rule = event.target.closest('[data-quality-rule]');
      if (rule) {
        var trigger = panel.querySelector('[data-special-action="toggle-quality-rule"] span');
        if (trigger) trigger.textContent = rule.getAttribute('data-quality-rule');
        var menu = panel.querySelector('.dd-quality-rule-menu');
        if (menu) menu.classList.remove('show');
        return;
      }
      var dbItem = event.target.closest('[data-special-db-list] button');
      if (dbItem) {
        var picker = dbItem.closest('.dd-special-db-picker');
        var summary = picker ? picker.querySelector('summary') : null;
        if (summary) summary.textContent = dbItem.textContent.trim();
        if (picker) picker.open = false;
        return;
      }
      var directoryItem = event.target.closest('[data-dep-directory]');
      if (directoryItem) {
        var dependencyRow = directoryItem.closest('.dd-special-dependency-row');
        var directoryPicker = dependencyRow.querySelector('[data-dep-directory-picker]');
        var directoryTrigger = directoryPicker.querySelector('[data-special-action="toggle-dep-directory"]');
        var dependencyTask = dependencyRow.querySelector('[data-dep-level="task"]');
        var dependencyVersion = dependencyRow.querySelector('[data-dep-level="version"]');
        var directoryValue = directoryItem.getAttribute('data-dep-directory');
        directoryPicker.setAttribute('data-value', directoryValue);
        directoryTrigger.querySelector('span').textContent = directoryValue;
        directoryPicker.classList.remove('open');
        dependencyTask.innerHTML = '<option value="">请选择任务</option>' + self._dependencyTasksFor(directoryValue).map(function (item) { return '<option>' + item + '</option>'; }).join('');
        dependencyTask.disabled = false;
        dependencyVersion.innerHTML = '<option value="">请选择版本</option>';
        dependencyVersion.disabled = true;
        return;
      }
      var actionEl = event.target.closest('[data-special-action]');
      if (!actionEl) return;
      var action = actionEl.getAttribute('data-special-action');
      if (action === 'toggle-quality-rule') {
        var ruleMenu = panel.querySelector('.dd-quality-rule-menu');
        if (ruleMenu) ruleMenu.classList.toggle('show');
      } else if (action === 'add-quality-row') {
        var logicBody = panel.querySelector('[data-quality-logic-body]');
        if (logicBody) logicBody.insertAdjacentHTML('beforeend', self._qualityLogicRowHtml());
      } else if (action === 'remove-quality-row') {
        var logicRows = panel.querySelectorAll('[data-quality-logic-body] tr');
        if (logicRows.length > 1) actionEl.closest('tr').remove();
      } else if (action === 'preview-param') {
        var fieldBody = panel.querySelector('[data-param-field-preview]');
        var matchBody = panel.querySelector('[data-param-match-preview]');
        if (fieldBody) fieldBody.innerHTML = '<tr><td>store_code</td><td>SZ001</td></tr><tr><td>biz_date</td><td>2026-09-20</td></tr>';
        if (matchBody) matchBody.innerHTML = '<tr><td>store_code</td><td>门店编码</td><td><label class="dd-special-switch"><input type="checkbox" checked><span></span></label></td></tr><tr><td>biz_date</td><td>业务日期</td><td><label class="dd-special-switch"><input type="checkbox" checked><span></span></label></td></tr>';
      } else if (action === 'add-dependency') {
        var list = panel.querySelector('[data-dependency-list]');
        if (list && list.children.length < 100) list.insertAdjacentHTML('beforeend', self._dependencyRowHtml());
      } else if (action === 'remove-dependency') {
        var dependencyList = panel.querySelector('[data-dependency-list]');
        if (dependencyList && dependencyList.children.length > 1) actionEl.closest('.dd-special-dependency-row').remove();
      } else if (action === 'toggle-dep-directory') {
        if (!actionEl.disabled) actionEl.closest('[data-dep-directory-picker]').classList.toggle('open');
      } else if (action === 'save') {
        var id = panel.getAttribute('data-special-node-id');
        var info = self._canvasState && self._canvasState.nodeMap[id];
        var nameInput = panel.querySelector('[data-node-name]');
        if (info && nameInput && nameInput.value.trim()) {
          info.data.label = nameInput.value.trim();
          var label = info.el.querySelector('.dd-node-text');
          if (label) label.textContent = info.data.label;
          if (info.data.specialKind === 'summary') {
            var task = panel.querySelector('[data-summary-task]');
            info.data.summaryTask = task ? task.value : '';
          }
        }
        var toast = panel.querySelector('.dd-special-node-toast');
        if (toast) {
          toast.textContent = '配置已保存';
          toast.classList.add('show');
          setTimeout(function () { toast.classList.remove('show'); }, 1600);
        }
      }
    });

    panel.addEventListener('input', function (event) {
      if (event.target.hasAttribute('data-special-rule-search')) {
        var keyword = event.target.value.trim().toLowerCase();
        panel.querySelectorAll('[data-quality-rule]').forEach(function (item) {
          item.style.display = !keyword || item.textContent.toLowerCase().indexOf(keyword) > -1 ? '' : 'none';
        });
      }
      if (event.target.hasAttribute('data-special-db-search')) {
        var dbKeyword = event.target.value.trim().toLowerCase();
        panel.querySelectorAll('[data-special-db-list] button').forEach(function (item) {
          item.style.display = !dbKeyword || item.textContent.toLowerCase().indexOf(dbKeyword) > -1 ? '' : 'none';
        });
      }
      if (event.target.hasAttribute('data-dep-directory-search')) {
        var directoryKeyword = event.target.value.trim().toLowerCase();
        var directoryPicker = event.target.closest('[data-dep-directory-picker]');
        directoryPicker.querySelectorAll('[data-dep-directory]').forEach(function (item) {
          item.style.display = !directoryKeyword || item.textContent.toLowerCase().indexOf(directoryKeyword) > -1 ? '' : 'none';
        });
      }
    });

    panel.addEventListener('change', function (event) {
      var level = event.target.getAttribute('data-dep-level');
      if (!level) return;
      var row = event.target.closest('.dd-special-dependency-row');
      var project = row.querySelector('[data-dep-level="project"]');
      var directoryPicker = row.querySelector('[data-dep-directory-picker]');
      var directoryTrigger = directoryPicker.querySelector('[data-special-action="toggle-dep-directory"]');
      var directoryList = directoryPicker.querySelector('[data-dep-directory-list]');
      var task = row.querySelector('[data-dep-level="task"]');
      var version = row.querySelector('[data-dep-level="version"]');
      var directories = project.value === '物流数据演示系统' ? ['物流离线数仓', '中电数智流式数仓'] : ['ODS', 'DWD', 'DWS', 'ADS'];
      if (level === 'project') {
        directoryPicker.setAttribute('data-value', '');
        directoryPicker.classList.remove('open');
        directoryTrigger.disabled = !project.value;
        directoryTrigger.querySelector('span').textContent = '请选择目录';
        directoryList.innerHTML = project.value ? directories.map(function (item) { return '<button type="button" data-dep-directory="' + item + '"><i class="bi bi-folder-fill"></i>' + item + '</button>'; }).join('') : '<div class="dd-special-empty">请先选择项目</div>';
        task.innerHTML = '<option value="">请选择任务</option>';
        task.disabled = true;
        version.innerHTML = '<option value="">请选择版本</option>';
        version.disabled = true;
      } else if (level === 'task') {
        version.innerHTML = '<option value="">请选择版本</option><option>V1</option><option>V2</option>';
        version.disabled = !task.value;
      }
    });
  },

  _summaryInsertRowHtml: function (index) {
    return '<div class="dd-summary-insert-row">' +
      '<label><span>名称：</span><input type="text" data-summary-name placeholder="请输入节点名称"></label>' +
      '<label><span>汇总表任务：</span><select data-summary-task><option value="">请选择</option><option>门店日销售汇总任务</option><option>区域销售指标汇总任务</option><option>商品销量汇总任务</option></select></label>' +
      (index === 0 ? '<button class="dd-summary-row-action" type="button" data-summary-action="add" title="增加"><i class="bi bi-plus-lg"></i></button>' : '<button class="dd-summary-row-action danger" type="button" data-summary-action="remove" title="删除"><i class="bi bi-trash3"></i></button>') +
    '</div>';
  },

  _openSummaryInsertDialog: function (point) {
    point = point || { x: 520, y: 250 };
    var old = document.getElementById('ddSummaryInsertMask');
    if (old) old.remove();
    var mask = document.createElement('div');
    mask.className = 'dd-summary-modal-mask show';
    mask.id = 'ddSummaryInsertMask';
    mask.innerHTML = '<section class="dd-summary-modal" role="dialog" aria-modal="true" aria-labelledby="ddSummaryInsertTitle"><header><h3 id="ddSummaryInsertTitle">插入汇总表节点</h3><button type="button" data-summary-action="cancel" title="关闭"><i class="bi bi-x-lg"></i></button></header><div class="dd-summary-insert-body" data-summary-rows>' + this._summaryInsertRowHtml(0) + '</div><footer><button class="btn" type="button" data-summary-action="cancel">取消</button><button class="btn btn-primary" type="button" data-summary-action="confirm">确定</button></footer></section>';
    document.body.appendChild(mask);
    var self = this;
    mask.addEventListener('click', function (event) {
      if (event.target === mask) return;
      var actionEl = event.target.closest('[data-summary-action]');
      if (!actionEl) return;
      var action = actionEl.getAttribute('data-summary-action');
      if (action === 'cancel') mask.remove();
      if (action === 'add') {
        var rows = mask.querySelector('[data-summary-rows]');
        rows.insertAdjacentHTML('beforeend', self._summaryInsertRowHtml(rows.children.length));
      }
      if (action === 'remove') actionEl.closest('.dd-summary-insert-row').remove();
      if (action === 'confirm') {
        var rows = Array.prototype.slice.call(mask.querySelectorAll('.dd-summary-insert-row'));
        var invalid = false;
        rows.forEach(function (row) {
          var name = row.querySelector('[data-summary-name]');
          var task = row.querySelector('[data-summary-task]');
          name.classList.toggle('invalid', !name.value.trim());
          task.classList.toggle('invalid', !task.value);
          if (!name.value.trim() || !task.value) invalid = true;
        });
        if (invalid) return;
        rows.forEach(function (row, index) {
          var name = row.querySelector('[data-summary-name]').value.trim();
          var task = row.querySelector('[data-summary-task]').value;
          self._insertSpecialCanvasNode('summary', name, { x: point.x + index * 24, y: point.y + index * 62 }, { summaryTask: task });
        });
        mask.remove();
      }
    });
  },

  /* ============================================================
     流式计算任务列表
     ============================================================ */

  _getFilteredStreamTasks: function () {
    var state = this._streamState;
    var keyword = (state.keyword || '').toLowerCase();
    return this._streamTasks.filter(function (task) {
      var matchesStatus = !state.status || task.status === state.status;
      var matchesKeyword = !keyword || task.id.toLowerCase().indexOf(keyword) > -1 || task.name.toLowerCase().indexOf(keyword) > -1;
      return matchesStatus && matchesKeyword;
    });
  },

  _renderStreamList: function () {
    var body = document.getElementById('ddStreamTableBody');
    var pagination = document.getElementById('ddStreamPagination');
    if (!body || !pagination) return;

    var state = this._streamState;
    var filtered = this._getFilteredStreamTasks();
    var pageCount = Math.max(1, Math.ceil(filtered.length / state.pageSize));
    state.page = Math.min(Math.max(1, state.page), pageCount);
    var start = (state.page - 1) * state.pageSize;
    var pageRows = filtered.slice(start, start + state.pageSize);

    if (!pageRows.length) {
      body.innerHTML = '<tr><td colspan="9"><div class="dd-stream-empty"><i class="bi bi-inbox"></i><span>暂无符合条件的流式计算任务</span></div></td></tr>';
    } else {
      body.innerHTML = pageRows.map(function (task) {
        var checked = state.selected.indexOf(task.id) > -1 ? ' checked' : '';
        var statusClass = task.status === '已启动' ? 'running' : 'waiting';
        var toggleAction = task.status === '已启动' ? 'stop' : 'start';
        var toggleText = task.status === '已启动' ? '停止' : '启动';
        var logActions = task.status === '已启动' ? '<span>|</span><button type="button" data-stream-row-action="log" data-stream-id="' + task.id + '">日志</button><span>|</span><button type="button" data-stream-row-action="yarn" data-stream-id="' + task.id + '">yarn日志</button>' : '';
        return '<tr>' +
          '<td class="dd-stream-check"><input type="checkbox" data-stream-select="' + task.id + '" aria-label="选择' + task.name + '"' + checked + '></td>' +
          '<td><span class="dd-stream-id">' + task.id + '</span></td>' +
          '<td><span class="dd-stream-name">' + task.name + '</span></td>' +
          '<td>' + task.version + '</td>' +
          '<td><span class="dd-stream-status ' + statusClass + '"><i></i>' + task.status + '</span></td>' +
          '<td>' + task.startTime + '</td>' +
          '<td>' + task.endTime + '</td>' +
          '<td>' + (task.duration || '--') + '</td>' +
          '<td class="dd-stream-operation"><button type="button" data-stream-row-action="view" data-stream-id="' + task.id + '">查看</button><span>|</span><button type="button" data-stream-row-action="' + toggleAction + '" data-stream-id="' + task.id + '">' + toggleText + '</button>' + logActions + '</td>' +
        '</tr>';
      }).join('');
    }

    var pageButtons = '';
    for (var page = 1; page <= pageCount; page++) {
      pageButtons += '<button type="button" data-stream-page="' + page + '" class="' + (page === state.page ? 'active' : '') + '">' + page + '</button>';
    }
    pagination.innerHTML =
      '<span>共 ' + filtered.length + ' 条</span>' +
      '<button type="button" data-stream-page="prev"' + (state.page === 1 ? ' disabled' : '') + '><i class="bi bi-chevron-left"></i></button>' +
      pageButtons +
      '<button type="button" data-stream-page="next"' + (state.page === pageCount ? ' disabled' : '') + '><i class="bi bi-chevron-right"></i></button>' +
      '<select id="ddStreamPageSize" aria-label="每页条数"><option value="5"' + (state.pageSize === 5 ? ' selected' : '') + '>5条/页</option><option value="10"' + (state.pageSize === 10 ? ' selected' : '') + '>10条/页</option></select>' +
      '<label>跳至 <input id="ddStreamJumpPage" type="number" min="1" max="' + pageCount + '" value="' + state.page + '"> 页</label>';

    var checkAll = document.getElementById('ddStreamCheckAll');
    if (checkAll) {
      var selectedOnPage = pageRows.filter(function (task) { return state.selected.indexOf(task.id) > -1; }).length;
      checkAll.checked = pageRows.length > 0 && selectedOnPage === pageRows.length;
      checkAll.indeterminate = selectedOnPage > 0 && selectedOnPage < pageRows.length;
    }
  },

  _showStreamToast: function (message) {
    var toast = document.getElementById('ddStreamToast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(this._streamToastTimer);
    this._streamToastTimer = setTimeout(function () { toast.classList.remove('show'); }, 1800);
  },

  _updateStreamTaskStatus: function (ids, nextStatus) {
    if (!ids.length) {
      this._showStreamToast('请先选择流式计算任务');
      return;
    }
    var now = new Date();
    var pad = function (value) { return String(value).padStart(2, '0'); };
    var timestamp = now.getFullYear() + '-' + pad(now.getMonth() + 1) + '-' + pad(now.getDate()) + ' ' + pad(now.getHours()) + ':' + pad(now.getMinutes()) + ':' + pad(now.getSeconds());
    this._streamTasks.forEach(function (task) {
      if (ids.indexOf(task.id) === -1) return;
      task.status = nextStatus;
      if (nextStatus === '已启动') {
        task.startTime = timestamp;
        task.endTime = '--';
        task.duration = '持续运行';
      } else {
        task.endTime = timestamp;
        task.duration = '--';
      }
    });
    this._renderStreamList();
    this._showStreamToast('已' + (nextStatus === '已启动' ? '启动' : '停止') + ' ' + ids.length + ' 个流式计算任务');
  },

  _initStreamList: function () {
    var self = this;
    var view = document.getElementById('ddStreamView');
    if (!view) return;
    self._streamState = { status: '', keyword: '', page: 1, pageSize: 5, selected: [] };
    self._renderStreamList();

    view.addEventListener('change', function (event) {
      if (event.target.id === 'ddStreamStatus') {
        self._streamState.status = event.target.value;
        var currentKeyword = document.getElementById('ddStreamKeyword');
        self._streamState.keyword = currentKeyword ? currentKeyword.value.trim() : '';
        self._streamState.page = 1;
        self._renderStreamList();
        return;
      }
      if (event.target.id === 'ddStreamCheckAll') {
        var currentRows = Array.prototype.slice.call(view.querySelectorAll('[data-stream-select]')).map(function (input) { return input.getAttribute('data-stream-select'); });
        currentRows.forEach(function (id) {
          var index = self._streamState.selected.indexOf(id);
          if (event.target.checked && index === -1) self._streamState.selected.push(id);
          if (!event.target.checked && index > -1) self._streamState.selected.splice(index, 1);
        });
        self._renderStreamList();
        return;
      }
      if (event.target.hasAttribute('data-stream-select')) {
        var taskId = event.target.getAttribute('data-stream-select');
        var selectedIndex = self._streamState.selected.indexOf(taskId);
        if (event.target.checked && selectedIndex === -1) self._streamState.selected.push(taskId);
        if (!event.target.checked && selectedIndex > -1) self._streamState.selected.splice(selectedIndex, 1);
        self._renderStreamList();
        return;
      }
      if (event.target.id === 'ddStreamPageSize') {
        self._streamState.pageSize = parseInt(event.target.value, 10) || 5;
        self._streamState.page = 1;
        self._renderStreamList();
      }
    });

    view.addEventListener('click', function (event) {
      var queryButton = event.target.closest('#ddStreamQuery');
      if (queryButton) {
        var keywordInput = document.getElementById('ddStreamKeyword');
        self._streamState.keyword = keywordInput ? keywordInput.value.trim() : '';
        self._streamState.page = 1;
        self._renderStreamList();
        return;
      }

      var pageButton = event.target.closest('[data-stream-page]');
      if (pageButton && !pageButton.disabled) {
        var value = pageButton.getAttribute('data-stream-page');
        var pageCount = Math.max(1, Math.ceil(self._getFilteredStreamTasks().length / self._streamState.pageSize));
        if (value === 'prev') self._streamState.page -= 1;
        else if (value === 'next') self._streamState.page += 1;
        else self._streamState.page = parseInt(value, 10) || 1;
        self._streamState.page = Math.min(Math.max(1, self._streamState.page), pageCount);
        self._renderStreamList();
        return;
      }

      var rowAction = event.target.closest('[data-stream-row-action]');
      if (rowAction) {
        var rowTaskId = rowAction.getAttribute('data-stream-id');
        var action = rowAction.getAttribute('data-stream-row-action');
        var task = self._streamTasks.find(function (item) { return item.id === rowTaskId; });
        if (action === 'view') {
          if (!task) {
            self._showStreamToast('未找到该任务');
            return;
          }
          if (task.id === 'STREAM-1001') self._switchToFlinkCdcView('数据同步(Flink CDC)-订单增量');
          else if (task.id === 'STREAM-1002') self._switchToStreamCollectView('流式数据采集流程-订单事件');
          else self._switchToStreamDesignerView('流式处理流程-订单清洗', task.name, 'stream');
        } else if (action === 'log' || action === 'yarn') {
          self._showStreamToast(action === 'yarn' ? '已打开yarn日志' : '已打开任务日志');
        } else {
          self._updateStreamTaskStatus([rowTaskId], action === 'start' ? '已启动' : '未启动');
        }
        return;
      }

      var toolbarAction = event.target.closest('[data-stream-action]');
      if (!toolbarAction) return;
      var toolbarType = toolbarAction.getAttribute('data-stream-action');
      if (toolbarType === 'start' || toolbarType === 'stop') {
        self._updateStreamTaskStatus(self._streamState.selected.slice(), toolbarType === 'start' ? '已启动' : '未启动');
      } else if (toolbarType === 'export') {
        self._showStreamToast('流式计算任务已导出');
      } else if (toolbarType === 'import') {
        self._showStreamToast('请选择需要导入的流式计算任务文件');
      } else if (toolbarType === 'publish') {
        self._showStreamToast(self._streamState.selected.length ? '已发布选中的流式计算任务' : '请先选择需要发布的流式计算任务');
      }
    });

    var keyword = document.getElementById('ddStreamKeyword');
    if (keyword) {
      keyword.addEventListener('keydown', function (event) {
        if (event.key !== 'Enter') return;
        self._streamState.keyword = keyword.value.trim();
        self._streamState.page = 1;
        self._renderStreamList();
      });
    }

    view.addEventListener('keydown', function (event) {
      if (event.target.id !== 'ddStreamJumpPage' || event.key !== 'Enter') return;
      var maxPage = Math.max(1, Math.ceil(self._getFilteredStreamTasks().length / self._streamState.pageSize));
      self._streamState.page = Math.min(Math.max(1, parseInt(event.target.value, 10) || 1), maxPage);
      self._renderStreamList();
    });
  },

  /* ============================================================
     数据采集子流程配置
     ============================================================ */

  _collectionSources: [
    { group: 'ODS-贴源层', name: '工单_ODS', path: 'ODS-贴源层 → 工单_ODS', tables: ['ods_ods_user_address', 'ods_work_order', 'ods_ticket_record'] },
    { group: '业务系统', name: '测试业务系统', path: '业务系统 → 测试业务系统', tables: ['employee_info', 't_demo_gender', 't_demo_gender1', 't_sales_order', 't_store_info'] },
    { group: '业务系统', name: '仿真数据', path: '业务系统 → 仿真数据', tables: ['simulation_order', 'simulation_store'] },
    { group: '业务系统', name: '工单系统', path: '业务系统 → 工单系统', tables: ['ticket_info', 'ticket_detail'] },
    { group: '业务系统 / 物流系统', name: '物流系统', path: '业务系统 → 物流系统 → 物流系统', tables: ['tms_order', 'tms_route', 'tms_vehicle'] }
  ],

  _collectionDatabases: [
    { group: 'DWS-数据汇总层', name: 'DWS_数据汇总', path: 'DWS-数据汇总层 → DWS_数据汇总', tables: ['dws_store_sales_day', 'dws_order_summary'] },
    { group: 'ODS-贴源层', name: '物流_ODS', path: 'ODS-贴源层 → 物流_ODS', tables: ['ods_tms_order', 'ods_tms_route'] },
    { group: 'ODS-贴源层', name: '中电数智_ODS', path: 'ODS-贴源层 → 中电数智_ODS', tables: ['ods_sales_order', 'ods_store_info', 'ods_employee_info'] },
    { group: '系统业务库', name: 'hive链接', path: '系统业务库 → hive链接', tables: ['hive_sales_detail', 'hive_store_daily'] },
    { group: 'ADS-应用层', name: 'ADS_数据超市', path: 'ADS-应用层 → ADS_数据超市', tables: ['ads_store_operation', 'ads_sales_overview'] },
    { group: '演示 / 中电数智演示数仓库', name: 'zz_tms_ads', path: '演示 → 中电数智演示数仓库 → zz_tms_ads', tables: ['ads_tms_overview'] },
    { group: '演示 / 中电数智演示数仓库', name: 'zz_tms_dim', path: '演示 → 中电数智演示数仓库 → zz_tms_dim', tables: ['dim_store', 'dim_region'] },
    { group: '演示 / 中电数智演示数仓库', name: 'zz_tms_dwd', path: '演示 → 中电数智演示数仓库 → zz_tms_dwd', tables: ['dwd_sales_order_detail'] },
    { group: '演示 / 中电数智演示数仓库', name: 'zz_tms_dws', path: '演示 → 中电数智演示数仓库 → zz_tms_dws', tables: ['dws_sales_order_day'] },
    { group: '演示 / 中电数智演示数仓库', name: 'zz_tms_ods', path: '演示 → 中电数智演示数仓库 → zz_tms_ods', tables: ['ods_sales_order'] },
    { group: 'DWD-数据明细层', name: 'DWD_数据', path: 'DWD-数据明细层 → DWD_数据', tables: ['dwd_order_detail', 'dwd_store_sales'] }
  ],

  _collectionBaseFields: [
    { name: 'order_id', cn: '订单编号', sourceType: 'varchar', targetType: 'STRING' },
    { name: 'store_id', cn: '门店编号', sourceType: 'varchar', targetType: 'STRING' },
    { name: 'customer_id', cn: '客户编号', sourceType: 'bigint', targetType: 'BIGINT' },
    { name: 'order_amount', cn: '订单金额', sourceType: 'decimal', targetType: 'DECIMAL(18,2)' },
    { name: 'order_status', cn: '订单状态', sourceType: 'varchar', targetType: 'STRING' },
    { name: 'create_time', cn: '创建时间', sourceType: 'timestamp', targetType: 'TIMESTAMP' },
    { name: 'update_time', cn: '更新时间', sourceType: 'timestamp', targetType: 'TIMESTAMP' },
    { name: 'is_deleted', cn: '删除标识', sourceType: 'tinyint', targetType: 'SMALLINT' }
  ],

  _collectionHelp: {
    readType: ['数据类型', '数据源类型', '必填，需要读取的数据源类型。'],
    readMode: ['读取方式', '读取数据的配置方式', '选择表按数据源和表读取；查询sql使用 SQL 编辑器读取。'],
    source: ['选择数据源', '读取数据源', '选择结果受读数据类型限制，目录支持按名称搜索。'],
    sourceTable: ['选择表', '读取表', '必填，选择数据源后加载该数据源下的表。'],
    querySql: ['查询sql', '读取 SQL', '必填，支持格式化、复制、搜索和全屏编辑。'],
    speed: ['速度', '读取速度控制', '可按通道数或字节数限制读取速度。'],
    jvm: ['Jvm内存', '运行内存参数', '必填，默认 -Xms1G -Xmx1G。'],
    writeType: ['数据类型', '写数据源类型', '必填，需要写入的数据源类型。'],
    database: ['选择库', '目标数据库', '选择结果受写数据类型限制，切换类型后需要重新选择。'],
    targetTable: ['选择表', '目标表', '必填，选择库后加载目标表，也可进入新建表配置。'],
    writeMode: ['写类型', '写数据库的类型', '必填，不可为空。'],
    tableMode: ['写入表模式', '写入过程', '选择先写中间表再导入，或直接写入目标表。'],
    collectionMode: ['采集方式', '数据采集类型', '系统支持数据采集和标准采集。'],
    security: ['安全机制', '写入安全策略', '选项由当前数据类型、数据库和表配置联动生成。'],
    batchSize: ['批处理大小', '单批写入记录数', '默认 2048。'],
    preSql: ['前置SQL', '写入前执行 SQL', '在写入目标表之前执行。'],
    postSql: ['后置SQL', '写入后执行 SQL', '在写入目标表之后执行。'],
    encoding: ['编码选项', '字符编码', '默认 UTF-8。'],
    cluster: ['集群配置', '写入集群参数', '按目标数据源配置集群信息。'],
    errorLimit: ['错误记录数上限', '容错阈值', '可按记录数或百分比设置。']
  },

  _collectionState: {
    sourcePath: '业务系统 → 测试业务系统',
    sourceTables: ['employee_info', 't_demo_gender', 't_demo_gender1', 't_sales_order', 't_store_info'],
    sourceTable: 't_sales_order',
    databasePath: 'ODS-贴源层 → 中电数智_ODS',
    targetTables: ['ods_sales_order', 'ods_store_info', 'ods_employee_info'],
    targetTable: 'ods_sales_order',
    fields: [],
    filters: {}
  },

  _collectionTreeSelectHtml: function (type, label) {
    var isSource = type === 'source';
    var triggerId = isSource ? 'ddCollectionSourceTrigger' : 'ddCollectionDatabaseTrigger';
    return '<label class="wide" data-collection-help-key="' + (isSource ? 'source' : 'database') + '"><span><em>*</em> ' + label + '</span><div class="dd-collection-tree-select"><button id="' + triggerId + '" type="button" data-collection-tree-trigger="' + type + '"><span>' + (isSource ? '请选择数据源' : '请选择数据库') + '</span><i class="bi bi-chevron-down"></i></button><div class="dd-collection-tree-popup" data-collection-tree-popup="' + type + '"><div class="dd-collection-tree-search"><i class="bi bi-search"></i><input type="text" placeholder="请输入关键字搜索" data-collection-tree-search="' + type + '"></div><div class="dd-collection-tree-options" data-collection-tree-options="' + type + '"></div></div></div></label>';
  },

  _collectionAdvancedButtonHtml: function (type) {
    return '<button class="dd-collection-advanced" type="button" data-collection-action="' + type + '-advanced"><i class="bi bi-chevron-down"></i> 高级设置</button>';
  },

  _syncDataSourceSelectControl: function (select) {
    if (!select) return;
    var wrapper = select.parentNode.querySelector('[data-dd-source-select="' + select.id + '"]');
    if (!wrapper) return;
    var text = wrapper.querySelector('[data-dd-source-select-text]');
    if (text) text.textContent = select.value || '请选择';
    wrapper.querySelectorAll('[data-dd-source-select-option]').forEach(function (option) {
      option.classList.toggle('active', option.getAttribute('data-value') === select.value);
    });
  },

  _upgradeDataSourceSelect: function (selectId) {
    var self = this;
    var select = document.getElementById(selectId);
    if (!select || select.getAttribute('data-dd-source-select-ready') === 'true') return select;
    select.setAttribute('data-dd-source-select-ready', 'true');
    select.hidden = true;
    var wrapper = document.createElement('div');
    wrapper.className = 'dd-source-search-select';
    wrapper.setAttribute('data-dd-source-select', selectId);
    var options = Array.prototype.map.call(select.options, function (option) {
      var value = option.value || option.textContent;
      return '<button class="dd-source-search-option' + (value === select.value ? ' active' : '') + '" type="button" data-dd-source-select-option data-value="' + self._escapeCollectionText(value) + '">' + self._escapeCollectionText(option.textContent) + '</button>';
    }).join('');
    wrapper.innerHTML = '<button class="dd-source-search-trigger" type="button" data-dd-source-select-trigger role="combobox" aria-haspopup="listbox" aria-expanded="false"><span data-dd-source-select-text>' + self._escapeCollectionText(select.value || '请选择') + '</span><i class="bi bi-chevron-down"></i></button><div class="dd-source-search-panel"><div class="dd-source-search-input"><i class="bi bi-search"></i><input type="text" placeholder="输入关键字搜索" data-dd-source-select-search></div><div class="dd-source-search-options" role="listbox">' + options + '<div class="dd-source-search-empty" data-dd-source-select-empty>无匹配结果</div></div></div>';
    select.parentNode.insertBefore(wrapper, select.nextSibling);

    wrapper.addEventListener('click', function (event) {
      var trigger = event.target.closest('[data-dd-source-select-trigger]');
      if (trigger) {
        var willOpen = !wrapper.classList.contains('open');
        document.querySelectorAll('.dd-source-search-select.open').forEach(function (item) { if (item !== wrapper) item.classList.remove('open'); });
        wrapper.classList.toggle('open', willOpen);
        trigger.setAttribute('aria-expanded', String(willOpen));
        if (willOpen) {
          var search = wrapper.querySelector('[data-dd-source-select-search]');
          search.value = '';
          wrapper.querySelectorAll('[data-dd-source-select-option]').forEach(function (option) { option.style.display = ''; });
          wrapper.querySelector('[data-dd-source-select-empty]').style.display = 'none';
          setTimeout(function () { search.focus(); }, 0);
        }
        return;
      }
      var option = event.target.closest('[data-dd-source-select-option]');
      if (!option) return;
      select.value = option.getAttribute('data-value');
      self._syncDataSourceSelectControl(select);
      wrapper.classList.remove('open');
      wrapper.querySelector('[data-dd-source-select-trigger]').setAttribute('aria-expanded', 'false');
      select.dispatchEvent(new Event('change', { bubbles: true }));
    });
    wrapper.querySelector('[data-dd-source-select-search]').addEventListener('input', function (event) {
      var keyword = event.target.value.trim().toLowerCase();
      var visible = 0;
      wrapper.querySelectorAll('[data-dd-source-select-option]').forEach(function (option) {
        var matched = !keyword || option.textContent.toLowerCase().indexOf(keyword) > -1;
        option.style.display = matched ? '' : 'none';
        if (matched) visible += 1;
      });
      wrapper.querySelector('[data-dd-source-select-empty]').style.display = visible ? 'none' : 'block';
    });
    document.addEventListener('click', function (event) {
      if (!wrapper.contains(event.target)) {
        wrapper.classList.remove('open');
        wrapper.querySelector('[data-dd-source-select-trigger]').setAttribute('aria-expanded', 'false');
      }
    });
    return select;
  },

  _renderCollectionReadFields: function (type) {
    var container = document.getElementById('ddCollectionReadFields');
    if (!container) return;
    var html = '';
    if (type === 'FTP') {
      html = '<label><span><em>*</em> 选择连接实例</span><select><option>采集文件服务器</option><option>供应商交换服务器</option></select></label>' +
        '<label><span><em>*</em> 连接模式</span><select><option>主动模式</option><option>被动模式</option></select></label>' +
        '<label><span><em>*</em> 文件类型</span><select><option>csv</option><option>txt</option><option>excel</option></select></label>' +
        '<label><span><em>*</em> 目录路径</span><input value="/data/retail/order/"></label>' +
        '<label class="wide"><span><em>*</em> 文件通配符</span><div class="dd-collection-input-action"><input value="order_*.csv" data-collection-lineage-source><button type="button" data-collection-action="preview"><i class="bi bi-table"></i> 数据预览</button></div></label>' +
        '<label><span>字段分隔符</span><input value="|"></label><label><span>服务器编码</span><select><option>UTF-8</option><option>GBK</option></select></label>' +
        '<label><span>数据编码</span><select><option>UTF-8</option><option>GBK</option></select></label><label><span>压缩类型</span><select><option>无</option><option>gzip</option><option>zip</option></select></label>' +
        this._collectionAdvancedButtonHtml('read') + '<div class="dd-collection-advanced-panel" id="ddCollectionReadAdvanced"><label><span>读取起始行</span><input type="number" value="1"></label><label><span>空值转换</span><select><option>保留空值</option><option>转为空字符串</option></select></label></div>';
    } else if (type === 'HDFS') {
      html = this._collectionTreeSelectHtml('source', '选择数据源') +
        '<label><span><em>*</em> 目录路径</span><input value="/warehouse/ods/retail/"></label>' +
        '<label><span><em>*</em> 文件名</span><div class="dd-collection-input-action"><input value="order_${biz_date}.csv" data-collection-lineage-source><button type="button" data-collection-action="preview"><i class="bi bi-table"></i> 数据预览</button></div></label>' +
        '<label><span>字段分隔符</span><input value=","></label><label><span>数据编码</span><select><option>UTF-8</option><option>GBK</option></select></label>' +
        '<label><span>文件格式</span><select><option>text</option><option>orc</option><option>parquet</option><option>csv</option></select></label>' +
        this._collectionAdvancedButtonHtml('read') + '<div class="dd-collection-advanced-panel" id="ddCollectionReadAdvanced"><label><span>压缩类型</span><select><option>无</option><option>gzip</option><option>snappy</option></select></label><label><span>递归读取</span><select><option>否</option><option>是</option></select></label></div>';
    } else if (type === 'Http') {
      html = '<label><span><em>*</em> 连接方式</span><select><option>协同共享系统</option><option>自定义接口</option></select></label>' +
        '<label><span><em>*</em> 连接协同共享系统</span><select><option>供应链协同系统</option><option>会员服务平台</option></select></label>' +
        '<label><span><em>*</em> 业务分层</span><select><option>订单服务</option><option>商品服务</option></select></label><label><span><em>*</em> 接口名称</span><select data-collection-lineage-source><option>订单增量查询</option><option>门店资料查询</option></select></label>' +
        '<label><span>传输协议</span><select><option>HTTP</option><option>HTTPS</option></select></label><label><span>接口方式</span><select><option>GET</option><option>POST</option></select></label>' +
        '<label><span>接口类型</span><select><option>REST</option></select></label><label><span>数据编码</span><select><option>UTF-8</option><option>GBK</option></select></label>' +
        '<label class="wide"><span><em>*</em> url地址</span><div class="dd-collection-input-action"><input value="http://10.20.16.45/api/orders"><button type="button" data-config-action="测试连接"><i class="bi bi-link-45deg"></i> 测试连接</button></div></label>' +
        '<div class="dd-connector-param-panel wide"><div class="dd-connector-param-title"><span>接口参数设置</span><button type="button" data-config-action="添加接口参数"><i class="bi bi-plus-circle"></i> 添加</button></div><table><thead><tr><th>参数区域</th><th>参数名</th><th>参数值</th></tr></thead><tbody><tr><td>请求头设置</td><td>Content-Type</td><td>application/json</td></tr><tr><td>固定参数</td><td>tenantCode</td><td>retail</td></tr><tr><td>请求参数设置</td><td>bizDate</td><td>${biz_date}</td></tr></tbody></table></div>' +
        '<label><span>数据格式</span><select><option>json</option><option>xml</option></select></label><label><span>数据预览</span><button class="btn dd-special-left" type="button" data-collection-action="preview"><i class="bi bi-table"></i> 数据预览</button></label>' +
        this._collectionAdvancedButtonHtml('read') + '<div class="dd-collection-advanced-panel" id="ddCollectionReadAdvanced"><label><span>连接超时</span><input type="number" value="30"></label><label><span>重试次数</span><input type="number" value="3"></label></div>';
    } else if (type === 'Elasticsearch') {
      html = '<label><span><em>*</em> 连接方式</span><select><option>连接数据资产系统</option><option>自定义连接</option></select></label><label><span><em>*</em> 连接数据资产系统</span><select><option>数据资产管理平台</option></select></label>' +
        this._collectionTreeSelectHtml('source', '选择数据源') +
        '<label class="wide" id="ddCollectionSourceTableRow" data-collection-help-key="sourceTable"><span><em>*</em> 选择表</span><div class="dd-collection-input-action"><select id="ddCollectionSourceTable"></select><button type="button" data-collection-action="preview"><i class="bi bi-table"></i> 数据预览</button></div></label>' +
        this._collectionAdvancedButtonHtml('read') + '<div class="dd-collection-advanced-panel" id="ddCollectionReadAdvanced"><label><span>查询批次</span><input type="number" value="1000"></label><label><span>滚动超时</span><input value="5m"></label></div>';
    } else if (type === 'HBase') {
      html = '<label><span>数据编码</span><select><option>UTF-8</option><option>GBK</option></select></label>' + this._collectionTreeSelectHtml('source', '选择库') +
        '<label class="wide" id="ddCollectionSourceTableRow"><span><em>*</em> 选择表</span><div class="dd-collection-input-action"><select id="ddCollectionSourceTable"></select><button type="button" data-collection-action="preview"><i class="bi bi-table"></i> 数据预览</button></div></label>' +
        '<label><span>族名列名</span><input value="info:*"></label>' +
        this._collectionAdvancedButtonHtml('read') + '<div class="dd-collection-advanced-panel" id="ddCollectionReadAdvanced"><label><span>Jvm内存</span><input value="-Xms1G -Xmx1G"></label><label><span>读取模式</span><select><option>normal</option></select></label><label><span>rowkey范围</span><input placeholder="startRow,endRow"></label><label><span>二进制ROWKEY</span><select><option>false</option><option>true</option></select></label><label><span>读取的行数</span><input type="number" placeholder="不限制"></label><label><span>读取的列数</span><input type="number" placeholder="不限制"></label></div>';
    } else {
      html = '<label data-collection-help-key="readMode"><span><em>*</em> 读取方式</span><select id="ddCollectionReadMode"><option value="table">选择表</option><option value="sql">查询sql</option></select></label>' +
        this._collectionTreeSelectHtml('source', '选择数据源') +
        '<label class="wide" id="ddCollectionSourceTableRow" data-collection-help-key="sourceTable"><span><em>*</em> 选择表</span><div class="dd-collection-input-action"><select id="ddCollectionSourceTable"></select><button type="button" data-collection-action="preview"><i class="bi bi-table"></i> 数据预览</button></div></label>' +
        '<label class="wide dd-collection-sql-field" id="ddCollectionSqlRow" data-collection-help-key="querySql"><span><em>*</em> 查询sql</span><div class="dd-collection-mini-editor"><div class="dd-collection-editor-toolbar"><button type="button" data-collection-editor-action="format"><i class="bi bi-text-indent-left"></i> 格式化</button><button type="button" data-collection-editor-action="copy"><i class="bi bi-clipboard"></i> 复制</button><button type="button" data-collection-editor-action="search"><i class="bi bi-search"></i> 搜索</button><button type="button" data-collection-editor-action="fullscreen"><i class="bi bi-arrows-fullscreen"></i></button></div><textarea>SELECT * FROM t_sales_order WHERE biz_date = ${biz_date}</textarea></div></label>' +
        this._collectionAdvancedButtonHtml('read') + '<div class="dd-collection-advanced-panel" id="ddCollectionReadAdvanced"><label data-collection-help-key="speed"><span>速度</span><select><option>不限速</option><option>通道数</option><option>字节数</option></select></label><label data-collection-help-key="jvm"><span>Jvm内存</span><input value="-Xms1G -Xmx1G"></label></div>';
    }
    container.innerHTML = html;
    this._renderCollectionTree('source', '');
  },

  _renderCollectionWriteFields: function (type) {
    var container = document.getElementById('ddCollectionWriteFields');
    if (!container) return;
    var html = '';
    if (type === 'HDFS') {
      html = this._collectionTreeSelectHtml('database', '选择数据源') + '<label><span><em>*</em> 目录路径</span><input value="/warehouse/dwd/order/"></label><label><span><em>*</em> 文件名</span><input value="order_${biz_date}.parquet" data-collection-lineage-target></label>' +
        '<label><span>文件格式</span><select><option>parquet</option><option>orc</option><option>text</option><option>csv</option></select></label><label><span>写类型</span><select><option>覆盖</option><option>追加</option></select></label><label><span>编码选项</span><select><option>UTF-8</option><option>GBK</option></select></label>' +
        this._collectionAdvancedButtonHtml('write') + '<div class="dd-collection-advanced-panel" id="ddCollectionWriteAdvanced"><label><span>压缩类型</span><select><option>snappy</option><option>gzip</option><option>无</option></select></label><label data-collection-help-key="errorLimit"><span>错误记录数上限</span><input type="number" value="0"></label></div>';
    } else if (type === 'Kafka') {
      html = '<label><span><em>*</em> 连接方式</span><select><option>连接数据资产系统</option><option>自定义连接</option></select></label><label><span><em>*</em> 连接数据资产系统</span><select><option>数据资产管理平台</option></select></label>' +
        this._collectionTreeSelectHtml('database', '选择数据源') + '<label class="wide"><span><em>*</em> 选择topic</span><div class="dd-collection-input-action"><select data-collection-lineage-target><option>dwd_order_event</option><option>ods_store_event</option></select><button type="button" data-config-action="新建topic"><i class="bi bi-plus-circle"></i> 新建topic</button></div></label><label><span>安全机制</span><select><option>无</option><option>SASL_PLAINTEXT</option><option>SASL_SSL</option></select></label>' +
        this._collectionAdvancedButtonHtml('write') + '<div class="dd-collection-advanced-panel" id="ddCollectionWriteAdvanced"><label><span>批处理大小</span><input type="number" value="2048"></label><label><span>失败时重发</span><input type="number" value="3"></label><label><span>文件格式</span><select><option>json</option><option>csv</option></select></label><label><span>字段分隔符</span><input value=","></label><label><span>keySerializer</span><input value="org.apache.kafka.common.serialization.StringSerializer"></label><label><span>valueSerializer</span><input value="org.apache.kafka.common.serialization.StringSerializer"></label><label data-collection-help-key="errorLimit"><span>错误记录数上限</span><input type="number" value="0"></label></div>';
    } else if (type === 'Elasticsearch') {
      html = this._collectionTreeSelectHtml('database', '选择数据源') + '<label class="wide"><span><em>*</em> 选择表</span><div class="dd-collection-input-action"><select id="ddCollectionTargetTable"></select><button type="button" data-collection-action="new-table"><i class="bi bi-plus-circle"></i> 新建表</button></div></label><label><span>写入模式</span><select><option>normal</option></select></label><label><span>安全机制</span><select><option>无</option></select></label>' +
        this._collectionAdvancedButtonHtml('write') + '<div class="dd-collection-advanced-panel" id="ddCollectionWriteAdvanced"><label><span>批处理数据条数</span><input type="number" value="1000"></label><label><span>失败后重试次数</span><input type="number" value="3"></label><label><span>客户端超时时间</span><input type="number" value="30000"></label><label><span>忽略写入错误</span><select><option>false</option><option>true</option></select></label><label><span>忽略解析错误</span><select><option>false</option><option>true</option></select></label><label><span>分隔符</span><input value=","></label></div>';
    } else if (type === 'HBase') {
      html = this._collectionTreeSelectHtml('database', '选择数据源') + '<label class="wide"><span><em>*</em> 选择表</span><div class="dd-collection-input-action"><select id="ddCollectionTargetTable"></select><button type="button" data-collection-action="new-table"><i class="bi bi-plus-circle"></i> 新建表</button></div></label><label><span>写入模式</span><select><option>normal</option></select></label><label><span>安全机制</span><select><option>无</option></select></label>' +
        this._collectionAdvancedButtonHtml('write') + '<div class="dd-collection-advanced-panel" id="ddCollectionWriteAdvanced"><label><span>空值处理</span><select><option>忽略空值</option><option>写入空值</option></select></label><label><span>编码选项</span><select><option>UTF-8</option><option>GBK</option></select></label><label data-collection-help-key="errorLimit"><span>错误记录数上限</span><input type="number" value="0"></label></div>';
    } else {
      html = this._collectionTreeSelectHtml('database', '选择库') + '<label class="wide" data-collection-help-key="targetTable"><span><em>*</em> 选择表</span><div class="dd-collection-input-action"><select id="ddCollectionTargetTable"></select><button type="button" data-collection-action="new-table"><i class="bi bi-plus-circle"></i> 新建表</button></div></label>' +
        '<label data-collection-help-key="writeMode"><span><em>*</em> 写类型</span><select><option>增加</option><option>覆盖</option><option>更新</option></select></label><div class="dd-collection-radio-group wide" data-collection-help-key="tableMode"><span>写入表模式</span><label><input type="radio" name="ddCollectionTableMode" checked> 直接写入目标表</label><label><input type="radio" name="ddCollectionTableMode"> 先写中间表再导入</label></div>' +
        '<label data-collection-help-key="collectionMode"><span>采集方式</span><select><option>数据采集</option><option>标准采集</option></select></label><label data-collection-help-key="security"><span>安全机制</span><select><option>请选择</option><option>Kerberos</option></select></label>' +
        this._collectionAdvancedButtonHtml('write') + '<div class="dd-collection-advanced-panel" id="ddCollectionWriteAdvanced"><label data-collection-help-key="batchSize"><span>批处理大小</span><input type="number" value="2048"></label><label data-collection-help-key="encoding"><span>编码选项</span><select><option>UTF-8</option><option>GBK</option></select></label><label class="wide" data-collection-help-key="preSql"><span>前置SQL</span><textarea placeholder="写入目标表前执行"></textarea></label><label class="wide" data-collection-help-key="postSql"><span>后置SQL</span><textarea placeholder="写入目标表后执行"></textarea></label></div>';
    }
    container.innerHTML = html;
    this._renderCollectionTree('database', '');
  },

  _applyCollectionFieldPreset: function (readType) {
    var presets = {
      FTP: [
        { name: 'file_name', cn: '文件名称', sourceType: 'varchar', targetType: 'STRING' },
        { name: 'order_id', cn: '订单编号', sourceType: 'varchar', targetType: 'STRING' },
        { name: 'store_id', cn: '门店编号', sourceType: 'varchar', targetType: 'STRING' },
        { name: 'order_amount', cn: '订单金额', sourceType: 'decimal', targetType: 'DECIMAL(18,2)' },
        { name: 'biz_date', cn: '业务日期', sourceType: 'date', targetType: 'DATE' }
      ],
      HDFS: [
        { name: 'order_id', cn: '订单编号', sourceType: 'string', targetType: 'STRING' },
        { name: 'store_id', cn: '门店编号', sourceType: 'string', targetType: 'STRING' },
        { name: 'order_amount', cn: '订单金额', sourceType: 'decimal', targetType: 'DECIMAL(18,2)' },
        { name: 'event_time', cn: '事件时间', sourceType: 'timestamp', targetType: 'TIMESTAMP' }
      ],
      Http: [
        { name: 'request_id', cn: '请求编号', sourceType: 'varchar', targetType: 'STRING' },
        { name: 'order_id', cn: '订单编号', sourceType: 'varchar', targetType: 'STRING' },
        { name: 'order_status', cn: '订单状态', sourceType: 'varchar', targetType: 'STRING' },
        { name: 'update_time', cn: '更新时间', sourceType: 'timestamp', targetType: 'TIMESTAMP' }
      ],
      HBase: [
        { name: 'rowkey', cn: '行键', sourceType: 'binary', targetType: 'STRING' },
        { name: 'info:member_id', cn: '会员编号', sourceType: 'binary', targetType: 'STRING' },
        { name: 'info:tag_code', cn: '标签编码', sourceType: 'binary', targetType: 'STRING' },
        { name: 'info:update_time', cn: '更新时间', sourceType: 'binary', targetType: 'TIMESTAMP' }
      ]
    };
    var fields = presets[readType] || this._collectionBaseFields;
    this._collectionState.fields = fields.map(function (field) {
      return { name: field.name, cn: field.cn, sourceType: field.sourceType, targetType: field.targetType };
    });
    this._collectionState.filters = {};
  },

  _showCollectionToast: function (message) {
    var toast = document.getElementById('ddCollectionToast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(this._collectionToastTimer);
    this._collectionToastTimer = setTimeout(function () { toast.classList.remove('show'); }, 1800);
  },

  _escapeCollectionText: function (value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (char) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char];
    });
  },

  _renderCollectionTree: function (type, keyword) {
    var self = this;
    var data = type === 'source' ? this._collectionSources : this._collectionDatabases;
    var container = document.querySelector('[data-collection-tree-options="' + type + '"]');
    if (!container) return;
    var term = String(keyword || '').trim().toLowerCase();
    var groups = {};
    data.forEach(function (item) {
      if (term && (item.name + ' ' + item.group + ' ' + item.path).toLowerCase().indexOf(term) < 0) return;
      if (!groups[item.group]) groups[item.group] = [];
      groups[item.group].push(item);
    });
    var html = '';
    Object.keys(groups).forEach(function (group) {
      html += '<div class="dd-collection-tree-group"><div class="dd-collection-tree-group-title"><i class="bi bi-folder2-open"></i>' + self._escapeCollectionText(group) + '</div>';
      groups[group].forEach(function (item) {
        html += '<button type="button" data-collection-tree-option="' + type + '" data-path="' + self._escapeCollectionText(item.path) + '"><i class="bi bi-database"></i><span>' + self._escapeCollectionText(item.name) + '</span><small>' + self._escapeCollectionText(item.path) + '</small></button>';
      });
      html += '</div>';
    });
    container.innerHTML = html || '<div class="dd-collection-tree-empty">无匹配结果</div>';
  },

  _populateCollectionSelect: function (element, values, selected, placeholder) {
    if (!element) return;
    var self = this;
    var html = placeholder ? '<option value="">' + self._escapeCollectionText(placeholder) + '</option>' : '';
    values.forEach(function (value) {
      html += '<option' + (value === selected ? ' selected' : '') + '>' + self._escapeCollectionText(value) + '</option>';
    });
    element.innerHTML = html;
  },

  _renderCollectionFields: function () {
    var self = this;
    var sourceBody = document.getElementById('ddCollectionSourceFields');
    var targetBody = document.getElementById('ddCollectionTargetFields');
    var links = document.getElementById('ddCollectionFieldLinks');
    var caption = document.getElementById('ddCollectionTargetCaption');
    if (!sourceBody || !targetBody || !links) return;
    var fields = this._collectionState.fields;
    var options = fields.map(function (field) { return '<option>' + self._escapeCollectionText(field.name) + '</option>'; }).join('');
    sourceBody.innerHTML = fields.map(function (field) {
      var filtered = self._collectionState.filters[field.name];
      return '<tr><td><div class="dd-collection-source-field"><select data-field-select="' + self._escapeCollectionText(field.name) + '">' + options.replace('>' + self._escapeCollectionText(field.name) + '<', ' selected>' + self._escapeCollectionText(field.name) + '<') + '</select><button class="' + (filtered ? 'active' : '') + '" type="button" title="数据筛选" data-collection-action="filter" data-field="' + self._escapeCollectionText(field.name) + '"><i class="bi bi-' + (filtered ? 'funnel-fill' : 'three-dots-vertical') + '"></i></button></div></td><td>' + self._escapeCollectionText(field.cn) + '</td><td>' + self._escapeCollectionText(field.sourceType) + '</td></tr>';
    }).join('');
    targetBody.innerHTML = fields.map(function (field) {
      return '<tr><td>' + self._escapeCollectionText(field.name) + '</td><td>' + self._escapeCollectionText(field.cn) + '</td><td>' + self._escapeCollectionText(field.targetType) + '</td></tr>';
    }).join('');
    links.innerHTML = fields.map(function () { return '<div><span></span><i class="bi bi-arrow-right"></i></div>'; }).join('');
    if (caption) caption.textContent = this._collectionState.targetTable;
  },

  _renderCollectionOutputRows: function () {
    var self = this;
    var body = document.getElementById('ddCollectionOutputBody');
    if (!body) return;
    body.innerHTML = this._collectionState.fields.map(function (field) {
      return '<tr><td><input value="' + self._escapeCollectionText(field.cn) + '"></td><td><input value="' + self._escapeCollectionText(field.name) + '"></td><td><select><option>' + self._escapeCollectionText(field.targetType) + '</option><option>STRING</option><option>BIGINT</option><option>TIMESTAMP</option></select></td><td><input type="number" value="' + (field.targetType === 'STRING' ? '255' : '') + '"></td><td><input type="number"></td><td><input value="' + self._escapeCollectionText(field.cn) + '"></td><td><button type="button" data-collection-action="remove-create-row"><i class="bi bi-trash"></i></button></td></tr>';
    }).join('');
  },

  _updateCollectionLinkage: function () {
    var state = this._collectionState;
    this._populateCollectionSelect(document.getElementById('ddCollectionSourceTable'), state.sourceTables, state.sourceTable, '请选择表');
    this._populateCollectionSelect(document.getElementById('ddCollectionTargetTable'), state.targetTables, state.targetTable, '请选择表');
    var sourceTrigger = document.querySelector('#ddCollectionSourceTrigger span');
    var databaseTrigger = document.querySelector('#ddCollectionDatabaseTrigger span');
    if (sourceTrigger) sourceTrigger.textContent = state.sourcePath || '请选择数据源';
    if (databaseTrigger) databaseTrigger.textContent = state.databasePath || '请选择数据库';
    var sourceLineage = document.getElementById('ddCollectionLineageSource');
    var targetLineage = document.getElementById('ddCollectionLineageTarget');
    if (sourceLineage) sourceLineage.innerHTML = this._escapeCollectionText(state.sourceTable || '未选择源表') + '<small>' + this._escapeCollectionText(state.sourcePath || '未选择数据源') + '</small>';
    if (targetLineage) targetLineage.innerHTML = this._escapeCollectionText(state.targetTable || '未选择目标表') + '<small>' + this._escapeCollectionText(state.databasePath || '未选择数据库') + '</small>';
    this._renderCollectionFields();
  },

  _showCollectionModal: function (name, visible) {
    var ids = { preview: 'ddCollectionPreviewModal', filter: 'ddCollectionFilterModal', table: 'ddCollectionTableModal' };
    var modal = document.getElementById(ids[name]);
    if (modal) modal.classList.toggle('show', visible !== false);
  },

  _getCollectionParamFormatOptions: function (selected) {
    var formats = ['字符串', '密码', '函数', 'mm', 'HH', 'dd', 'MM', 'yyyy', 'yyyy-MM', 'yyyy-MM-dd', 'yyyy-MM-dd HH', 'yyyy-MM-dd HH:mm', 'yyyy-MM-dd HH:mm:ss', 'yyyyMM', 'yyyyMMdd', 'yyyyMMddHH', 'yyyyMMddHHmm', 'yyyyMMddHHmmss', 'yyyy/MM', 'yyyy/MM/dd', 'yyyy/MM/dd HH', 'yyyy/MM/dd HH:mm', 'yyyy/MM/dd HH:mm:ss', '时间戳'];
    return formats.map(function (format) { return '<option' + (format === selected ? ' selected' : '') + '>' + format + '</option>'; }).join('');
  },

  _addCollectionParamRow: function () {
    var body = document.getElementById('ddCollectionParamBody');
    if (!body) return;
    body.insertAdjacentHTML('beforeend', '<tr><td><input type="text" maxlength="15" placeholder="请输入参数名" data-collection-param-name></td><td><input type="text" maxlength="50" placeholder="请输入参数说明"></td><td><select data-collection-param-format>' + this._getCollectionParamFormatOptions('字符串') + '</select></td><td><input type="text" maxlength="100" placeholder="请输入默认值" data-collection-param-value></td><td><button class="dd-collection-icon-action danger" type="button" title="删除" data-collection-action="delete-param"><i class="bi bi-x-lg"></i></button></td></tr>');
  },

  _buildCollectionDependencyRow: function () {
    return '<div class="dd-collection-dependency-row">' +
      '<label><select aria-label="公司" data-dependency-company><option value="">请选择公司</option><option value="aotain">傲天科技</option><option value="sz-data">深圳数据运营中心</option></select></label>' +
      '<label><select aria-label="项目" data-dependency-project disabled><option value="">请选择项目</option></select></label>' +
      '<div class="dd-collection-dependency-task"><button type="button" data-dependency-task-trigger disabled><span>请选择目录</span><i class="bi bi-chevron-down"></i></button><div class="dd-collection-dependency-tree"><div class="dd-collection-tree-search"><i class="bi bi-search"></i><input type="text" placeholder="关键字搜索" data-dependency-task-search></div><div class="dd-collection-dependency-tree-list" data-dependency-task-list></div></div></div>' +
      '<label><select aria-label="版本" data-dependency-version disabled><option value="">请选择版本</option></select></label>' +
      '<button class="dd-collection-icon-action danger" type="button" title="删除" data-collection-action="delete-dependency"><i class="bi bi-trash3"></i></button>' +
    '</div>';
  },

  _getCollectionDependencyTasks: function (project) {
    var data = {
      governance: [
        { folder: '批量计算业务流程', name: '门店主数据同步' },
        { folder: '批量计算业务流程', name: '商品主数据同步' },
        { folder: '公共初始化任务', name: '销售日期初始化' }
      ],
      warehouse: [
        { folder: 'ODS入仓任务', name: '订单基础数据准备' },
        { folder: '维度数据任务', name: '门店维度初始化' }
      ],
      operations: [
        { folder: '运营数据任务', name: '经营日历初始化' },
        { folder: '运营数据任务', name: '区域组织同步' }
      ]
    };
    return data[project] || [];
  },

  _renderCollectionDependencyTasks: function (row, keyword) {
    var project = row.querySelector('[data-dependency-project]').value;
    var list = row.querySelector('[data-dependency-task-list]');
    if (!list) return;
    var tasks = this._getCollectionDependencyTasks(project);
    var query = (keyword || '').trim().toLowerCase();
    tasks = tasks.filter(function (task) { return !query || task.name.toLowerCase().indexOf(query) > -1 || task.folder.toLowerCase().indexOf(query) > -1; });
    if (!tasks.length) {
      list.innerHTML = '<div class="dd-collection-dependency-empty">无匹配结果</div>';
      return;
    }
    var groups = {};
    tasks.forEach(function (task) { (groups[task.folder] || (groups[task.folder] = [])).push(task); });
    list.innerHTML = Object.keys(groups).map(function (folder) {
      return '<div class="dd-collection-dependency-folder"><strong><i class="bi bi-folder2-open"></i>' + folder + '</strong>' + groups[folder].map(function (task) { return '<button type="button" data-dependency-task-option="' + task.name + '"><i class="bi bi-diagram-3"></i>' + task.name + '</button>'; }).join('') + '</div>';
    }).join('');
  },

  _copyCollectionText: function (text, successMessage) {
    var self = this;
    function done() { self._showCollectionToast(successMessage || '内容已复制'); }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, done);
    } else {
      done();
    }
  },

  _initCollectionView: function () {
    var self = this;
    var view = document.getElementById('ddCollectionView');
    if (!view) return;

    this._collectionState.fields = this._collectionBaseFields.map(function (field) {
      return { name: field.name, cn: field.cn, sourceType: field.sourceType, targetType: field.targetType };
    });
    this._renderCollectionReadFields(document.getElementById('ddCollectionReadType').value);
    this._renderCollectionWriteFields(document.getElementById('ddCollectionWriteType').value);
    this._renderCollectionTree('source', '');
    this._renderCollectionTree('database', '');
    this._updateCollectionLinkage();
    this._upgradeDataSourceSelect('ddCollectionReadType');
    this._upgradeDataSourceSelect('ddCollectionWriteType');
    var defaultCreatePanel = view.querySelector('[data-create-mode="param"]');
    if (defaultCreatePanel) defaultCreatePanel.classList.add('active');

    view.addEventListener('click', function (event) {
      var editorButton = event.target.closest('[data-collection-editor-action]');
      if (editorButton) {
        var editor = editorButton.closest('.dd-collection-mini-editor');
        var textarea = editor ? editor.querySelector('textarea') : null;
        var editorAction = editorButton.getAttribute('data-collection-editor-action');
        if (!textarea) return;
        if (editorAction === 'copy') self._copyCollectionText(textarea.value, 'SQL 已复制');
        if (editorAction === 'format') {
          textarea.value = textarea.value.replace(/\s+FROM\s+/gi, '\nFROM ').replace(/\s+WHERE\s+/gi, '\nWHERE ');
          self._showCollectionToast('SQL 已格式化');
        }
        if (editorAction === 'search') self._showCollectionToast('SQL 搜索已开启');
        if (editorAction === 'fullscreen') editor.classList.toggle('fullscreen');
        return;
      }
      var topTab = event.target.closest('[data-collection-tab]');
      if (topTab) {
        var tabName = topTab.getAttribute('data-collection-tab');
        view.querySelectorAll('[data-collection-tab]').forEach(function (tab) { tab.classList.toggle('active', tab === topTab); });
        view.querySelectorAll('[data-collection-content]').forEach(function (panel) { panel.classList.toggle('active', panel.getAttribute('data-collection-content') === tabName); });
        return;
      }

      var sideTab = event.target.closest('[data-collection-side-tab]');
      if (sideTab) {
        var sideName = sideTab.getAttribute('data-collection-side-tab');
        view.querySelectorAll('[data-collection-side-tab]').forEach(function (tab) { tab.classList.toggle('active', tab === sideTab); });
        view.querySelectorAll('[data-collection-side]').forEach(function (panel) { panel.classList.toggle('active', panel.getAttribute('data-collection-side') === sideName); });
        return;
      }

      var treeTrigger = event.target.closest('[data-collection-tree-trigger]');
      if (treeTrigger) {
        var treeType = treeTrigger.getAttribute('data-collection-tree-trigger');
        var popup = view.querySelector('[data-collection-tree-popup="' + treeType + '"]');
        view.querySelectorAll('.dd-collection-tree-popup.show').forEach(function (item) { if (item !== popup) item.classList.remove('show'); });
        if (popup) popup.classList.toggle('show');
        return;
      }

      var treeOption = event.target.closest('[data-collection-tree-option]');
      if (treeOption) {
        var type = treeOption.getAttribute('data-collection-tree-option');
        var path = treeOption.getAttribute('data-path');
        var collection = type === 'source' ? self._collectionSources : self._collectionDatabases;
        var selectedItem = collection.filter(function (item) { return item.path === path; })[0];
        if (selectedItem) {
          if (type === 'source') {
            self._collectionState.sourcePath = selectedItem.path;
            self._collectionState.sourceTables = selectedItem.tables.slice();
            var directSource = view.querySelector('[data-collection-lineage-source]');
            self._collectionState.sourceTable = directSource ? directSource.value : (selectedItem.tables[0] || '');
          } else {
            self._collectionState.databasePath = selectedItem.path;
            self._collectionState.targetTables = selectedItem.tables.slice();
            var directTarget = view.querySelector('[data-collection-lineage-target]');
            self._collectionState.targetTable = directTarget ? directTarget.value : (selectedItem.tables[0] || '');
          }
          self._updateCollectionLinkage();
        }
        treeOption.closest('.dd-collection-tree-popup').classList.remove('show');
        return;
      }

      var dependencyTaskTrigger = event.target.closest('[data-dependency-task-trigger]');
      if (dependencyTaskTrigger) {
        if (dependencyTaskTrigger.disabled) return;
        var dependencyTaskRow = dependencyTaskTrigger.closest('.dd-collection-dependency-row');
        var dependencyTaskTree = dependencyTaskRow.querySelector('.dd-collection-dependency-tree');
        view.querySelectorAll('.dd-collection-dependency-tree.show').forEach(function (tree) {
          if (tree !== dependencyTaskTree) tree.classList.remove('show');
        });
        self._renderCollectionDependencyTasks(dependencyTaskRow, dependencyTaskRow.querySelector('[data-dependency-task-search]').value);
        dependencyTaskTree.classList.toggle('show');
        if (dependencyTaskTree.classList.contains('show')) dependencyTaskRow.querySelector('[data-dependency-task-search]').focus();
        return;
      }

      var dependencyTaskOption = event.target.closest('[data-dependency-task-option]');
      if (dependencyTaskOption) {
        var selectedDependencyRow = dependencyTaskOption.closest('.dd-collection-dependency-row');
        var selectedTaskName = dependencyTaskOption.getAttribute('data-dependency-task-option');
        selectedDependencyRow.querySelector('[data-dependency-task-trigger] span').textContent = selectedTaskName;
        selectedDependencyRow.querySelector('[data-dependency-task-trigger]').setAttribute('data-selected-task', selectedTaskName);
        selectedDependencyRow.querySelector('[data-dependency-version]').disabled = false;
        selectedDependencyRow.querySelector('[data-dependency-version]').innerHTML = '<option value="">请选择版本</option><option value="V1">V1</option><option value="V0.9">V0.9</option>';
        selectedDependencyRow.querySelector('.dd-collection-dependency-tree').classList.remove('show');
        return;
      }

      var collapseButton = event.target.closest('[data-collection-collapse]');
      if (collapseButton) {
        var sectionName = collapseButton.getAttribute('data-collection-collapse');
        var section = view.querySelector('[data-collection-section="' + sectionName + '"]');
        if (section) {
          var collapsed = section.classList.toggle('collapsed');
          collapseButton.classList.toggle('collapsed', collapsed);
        }
        return;
      }

      var matchButton = event.target.closest('[data-collection-match]');
      if (matchButton) {
        view.querySelectorAll('[data-collection-match]').forEach(function (button) { button.classList.toggle('active', button === matchButton); });
        self._showCollectionToast(matchButton.getAttribute('data-collection-match') === 'name' ? '已按字段名称完成匹配' : '已按字段顺序完成匹配');
        return;
      }

      var closeButton = event.target.closest('[data-collection-close]');
      if (closeButton) {
        self._showCollectionModal(closeButton.getAttribute('data-collection-close'), false);
        return;
      }

      var filterTab = event.target.closest('[data-filter-tab]');
      if (filterTab) {
        view.querySelectorAll('[data-filter-tab]').forEach(function (button) { button.classList.toggle('active', button === filterTab); });
        var filterType = filterTab.getAttribute('data-filter-tab');
        var isRange = filterType === 'range';
        var rangeContent = view.querySelector('[data-filter-content="range"]');
        var placeholder = view.querySelector('[data-filter-placeholder]');
        if (rangeContent) rangeContent.style.display = isRange ? '' : 'none';
        if (placeholder) {
          var filterPanels = {
            fixed: '<div class="dd-collection-filter-form"><label><span>提取时间格式</span><select data-filter-input="fixed-format"><option value="">请选择</option><option>timestamp(10)</option><option>timestamp(13)</option><option>yyyy</option><option>yyyy-MM</option><option>yyyy-MM-dd</option><option>yyyy-MM-dd HH</option><option>yyyy-MM-dd HH:mm</option><option>yyyy-MM-dd HH:mm:ss</option><option>yyyyMM</option><option>yyyyMMdd</option><option>yyyyMMddHH</option><option>yyyyMMddHHmm</option><option>yyyyMMddHHmmss</option><option>yyyy/MM</option><option>yyyy/MM/dd</option><option>yyyy/MM/dd HH</option><option>yyyy/MM/dd HH:mm</option><option>yyyy/MM/dd HH:mm:ss</option></select></label><label><span>提取时间范围</span><div class="dd-collection-filter-range"><input data-filter-input="fixed-start" placeholder="开始时间"><span>至</span><input data-filter-input="fixed-end" placeholder="结束时间"></div></label></div><div class="dd-collection-filter-note"><strong>注释</strong><p>1、“提取时间范围”的填写格式必须与“提取时间格式”所选项相同</p><p>2、开始、结束时间选择同一个，例如2018-7-20，表示提取单日的数据</p></div>',
            param: '<div class="dd-collection-filter-table-toolbar"><button class="btn" type="button" data-collection-action="add-filter-param"><i class="bi bi-plus-lg"></i> 新增一行</button></div><table class="dd-collection-filter-table"><thead><tr><th>字段名称</th><th>条件</th><th>动态参数</th><th>操作</th></tr></thead><tbody data-filter-param-body><tr class="empty"><td colspan="4"><i class="bi bi-inbox"></i><span>暂无数据</span></td></tr></tbody></table>',
            time: '<div class="dd-collection-filter-form"><label><span>提取时间格式</span><select data-filter-input="time-format"><option value="">请选择</option><option>timestamp(10)</option><option>timestamp(13)</option><option>yyyy</option><option>yyyy-MM</option><option>yyyy-MM-dd</option><option>yyyy-MM-dd HH</option><option>yyyy-MM-dd HH:mm</option><option>yyyy-MM-dd HH:mm:ss</option><option>yyyyMM</option><option>yyyyMMdd</option><option>yyyyMMddHH</option><option>yyyyMMddHHmm</option><option>yyyyMMddHHmmss</option><option>yyyy/MM</option><option>yyyy/MM/dd</option><option>yyyy/MM/dd HH</option><option>yyyy/MM/dd HH:mm</option><option>yyyy/MM/dd HH:mm:ss</option></select></label><label><span>提取时间范围</span><div class="dd-collection-time-config"><span class="dd-collection-time-label">开始时间</span><input data-filter-input="time-start" placeholder="请选择"><span class="dd-collection-time-label">最近</span><input data-filter-input="time-recent" type="number" min="1" max="999999" placeholder="正整数，最大值999999"><select data-filter-input="time-recent-unit"><option value="">请选择</option><option>分钟</option><option>小时</option><option>天</option><option>月</option><option>年</option></select><span class="dd-collection-time-label">时移</span><input data-filter-input="time-offset" type="number" min="1" max="999999" placeholder="正整数，最大值999999"><select data-filter-input="time-offset-unit"><option value="">请选择</option><option>分钟</option><option>小时</option><option>天</option><option>月</option><option>年</option></select></div></label></div><div class="dd-collection-filter-note"><strong>注释</strong><p>选定提取时间格式后，提取时间范围的单位自动适配。</p></div>',
            expression: '<div class="dd-collection-filter-textarea"><label><span>过滤表达式</span><textarea data-filter-input="expression" placeholder="请输入过滤表达式，例如：name != \'张三\' and name like \'李%\'"></textarea></label></div>',
            convert: '<div class="dd-collection-filter-textarea"><label><span>字段类型转换</span><textarea data-filter-input="convert" placeholder="请输入字段类型转换表达式，例如：cast(\'2024-09-10\' as date) as new_date"></textarea></label></div>'
          };
          placeholder.style.display = isRange ? 'none' : 'block';
          placeholder.innerHTML = isRange ? '' : (filterPanels[filterType] || '');
        }
        return;
      }

      if (event.target.name === 'collectionCreateMode') {
        var createMode = event.target.value;
        view.querySelectorAll('[data-create-mode]').forEach(function (panel) { panel.classList.toggle('active', panel.getAttribute('data-create-mode') === createMode); });
        return;
      }

      var configActionButton = event.target.closest('[data-config-action]');
      if (configActionButton) {
        self._showCollectionToast(configActionButton.getAttribute('data-config-action') + '操作已就绪');
        return;
      }
      var actionButton = event.target.closest('[data-collection-action]');
      if (!actionButton) return;
      var action = actionButton.getAttribute('data-collection-action');
      if (action === 'schedule') {
        self._openScheduleDialog('collection');
        return;
      }
      if (action === 'preview') {
        self._showCollectionModal('preview', true);
        return;
      }
      if (action === 'add-field') {
        self._collectionState.fields.push({ name: 'custom_field_' + (self._collectionState.fields.length + 1), cn: '自定义字段', sourceType: 'varchar', targetType: 'STRING' });
        self._renderCollectionFields();
        return;
      }
      if (action === 'filter') {
        var filterField = actionButton.getAttribute('data-field') || '字段';
        document.getElementById('ddCollectionFilterField').textContent = filterField;
        document.getElementById('ddCollectionFilterModal').setAttribute('data-current-field', filterField);
        self._showCollectionModal('filter', true);
        return;
      }
      if (action === 'clear-filter') {
        var currentFilter = document.getElementById('ddCollectionFilterModal').getAttribute('data-current-field');
        delete self._collectionState.filters[currentFilter];
        document.getElementById('ddCollectionFilterOperator').value = '';
        document.getElementById('ddCollectionFilterValue').value = '';
        view.querySelectorAll('[data-filter-input]').forEach(function (input) { input.value = ''; });
        var filterParamBody = view.querySelector('[data-filter-param-body]');
        if (filterParamBody) filterParamBody.innerHTML = '<tr class="empty"><td colspan="4"><i class="bi bi-inbox"></i><span>暂无数据</span></td></tr>';
        self._renderCollectionFields();
        return;
      }
      if (action === 'confirm-filter') {
        var filterModal = document.getElementById('ddCollectionFilterModal');
        var currentField = filterModal.getAttribute('data-current-field');
        self._collectionState.filters[currentField] = {
          operator: document.getElementById('ddCollectionFilterOperator').value,
          value: document.getElementById('ddCollectionFilterValue').value
        };
        self._showCollectionModal('filter', false);
        self._renderCollectionFields();
        self._showCollectionToast('字段筛选已配置');
        return;
      }
      if (action === 'add-filter-param') {
        var dynamicBody = view.querySelector('[data-filter-param-body]');
        if (dynamicBody) {
          var emptyFilterRow = dynamicBody.querySelector('.empty');
          if (emptyFilterRow) emptyFilterRow.remove();
          dynamicBody.insertAdjacentHTML('beforeend', '<tr><td><select data-filter-input="param-field"><option>create_time</option><option>update_time</option><option>order_id</option></select></td><td><select data-filter-input="param-condition"><option>等于</option><option>不等于</option><option>大于</option><option>小于</option><option>大于等于</option><option>小于等于</option></select></td><td><select data-filter-input="param-value"><option>${biz_date}</option><option>${start_time}</option><option>${end_time}</option></select></td><td><button type="button" data-collection-action="remove-filter-param"><i class="bi bi-trash"></i></button></td></tr>');
        }
        return;
      }
      if (action === 'remove-filter-param') {
        var filterParamRow = actionButton.closest('tr');
        var filterParamRows = filterParamRow && filterParamRow.parentNode;
        if (filterParamRow) filterParamRow.remove();
        if (filterParamRows && !filterParamRows.children.length) filterParamRows.innerHTML = '<tr class="empty"><td colspan="4"><i class="bi bi-inbox"></i><span>暂无数据</span></td></tr>';
        return;
      }
      if (action === 'new-table') {
        if (!self._collectionState.databasePath) {
          self._showCollectionToast('请选择数据库');
          return;
        }
        self._renderCollectionOutputRows();
        self._showCollectionModal('table', true);
        return;
      }
      if (action === 'add-output-column') {
        var outputBody = document.getElementById('ddCollectionOutputBody');
        outputBody.insertAdjacentHTML('beforeend', '<tr><td><input placeholder="中文字段"></td><td><input placeholder="英文字段"></td><td><select><option>STRING</option><option>BIGINT</option><option>TIMESTAMP</option></select></td><td><input type="number"></td><td><input type="number"></td><td><input placeholder="描述"></td><td><button type="button" data-collection-action="remove-create-row"><i class="bi bi-trash"></i></button></td></tr>');
        return;
      }
      if (action === 'add-partition') {
        document.getElementById('ddCollectionPartitionBody').insertAdjacentHTML('beforeend', '<tr><td><input placeholder="中文字段名"></td><td><input placeholder="英文分区名"></td><td><select><option>STRING</option><option>DATE</option></select></td><td><button type="button" data-collection-action="remove-create-row"><i class="bi bi-trash"></i></button></td></tr>');
        return;
      }
      if (action === 'remove-create-row') {
        var createRow = actionButton.closest('tr');
        if (createRow) createRow.remove();
        return;
      }
      if (action === 'uppercase-fields') {
        document.querySelectorAll('#ddCollectionOutputBody tr td:nth-child(2) input').forEach(function (input) { input.value = input.value.toUpperCase(); });
        return;
      }
      if (action === 'reset-table') {
        self._renderCollectionOutputRows();
        self._showCollectionToast('新建表配置已恢复默认');
        return;
      }
      if (action === 'table-advanced') {
        var autoSqlOption = actionButton.nextElementSibling;
        actionButton.classList.toggle('expanded');
        if (autoSqlOption) autoSqlOption.classList.toggle('show');
        return;
      }
      if (action === 'confirm-table') {
        var newName = document.getElementById('ddCollectionNewTableName').value.trim();
        if (!newName) { self._showCollectionToast('请输入表名'); return; }
        if (self._collectionState.targetTables.indexOf(newName) < 0) self._collectionState.targetTables.push(newName);
        self._collectionState.targetTable = newName;
        self._updateCollectionLinkage();
        self._showCollectionModal('table', false);
        self._showCollectionToast('目标表已创建并选中');
        return;
      }
      if (action === 'read-advanced' || action === 'write-advanced') {
        var advancedId = action === 'read-advanced' ? 'ddCollectionReadAdvanced' : 'ddCollectionWriteAdvanced';
        var advanced = document.getElementById(advancedId);
        if (advanced) advanced.classList.toggle('show');
        actionButton.classList.toggle('expanded');
        return;
      }
      if (action === 'add-param') {
        self._addCollectionParamRow();
        return;
      }
      if (action === 'delete-param') {
        var paramRow = actionButton.closest('tr');
        if (paramRow) paramRow.remove();
        return;
      }
      if (action === 'add-dependency') {
        var dependencyList = document.getElementById('ddCollectionDependencyList');
        if (!dependencyList) return;
        if (dependencyList.children.length >= 100) { self._showCollectionToast('前置任务最多添加100个'); return; }
        dependencyList.insertAdjacentHTML('beforeend', self._buildCollectionDependencyRow());
        self._updateScheduleContextOptions('collection');
        return;
      }
      if (action === 'delete-dependency') {
        var dependencyRow = actionButton.closest('.dd-collection-dependency-row');
        if (dependencyRow) dependencyRow.remove();
        self._updateScheduleContextOptions('collection');
        return;
      }
      if (action === 'switch-version') {
        self._showCollectionToast('已切换至' + actionButton.getAttribute('data-version'));
        return;
      }
      if (action === 'delete-version') {
        var versionRow = actionButton.closest('tr');
        if (versionRow) versionRow.remove();
        self._showCollectionToast('版本已删除');
        return;
      }
      if (action === 'refresh-log') {
        self._showCollectionToast('任务日志已刷新');
        return;
      }
      if (action === 'copy-log') {
        self._copyCollectionText(document.getElementById('ddCollectionLogText').textContent, '任务日志已复制');
        return;
      }
      if (action === 'download-log') {
        var logText = document.getElementById('ddCollectionLogText').textContent;
        var logUrl = URL.createObjectURL(new Blob([logText], { type: 'text/plain;charset=utf-8' }));
        var logLink = document.createElement('a');
        logLink.href = logUrl;
        logLink.download = '单表采集任务日志_COL20260917001.txt';
        logLink.click();
        URL.revokeObjectURL(logUrl);
        self._showCollectionToast('任务日志已下载');
        return;
      }
      if (action === 'search-log') {
        document.querySelector('.dd-collection-log-editor').classList.toggle('searching');
        self._showCollectionToast('日志搜索已开启');
        return;
      }
      if (action === 'fullscreen-log') {
        document.querySelector('.dd-collection-log-editor').classList.toggle('fullscreen');
        return;
      }
      if (action === 'batch-execute') {
        var status = view.querySelector('.dd-impact-status');
        if (status) { status.className = 'dd-impact-status running'; status.innerHTML = '<i class="bi bi-arrow-repeat"></i> 执行中'; }
        self._showCollectionToast('已提交选中的影响任务');
        return;
      }

      var messages = {
        save: '任务属性已保存',
        execute: '采集任务已提交执行',
        import: '请选择需要导入的流程文件',
        export: '采集流程已导出',
        'save-as': '已创建当前流程的版本副本',
        'save-flow': '数据采集流程已保存'
      };
      if (messages[action]) self._showCollectionToast(messages[action]);
    });

    var nameInput = document.getElementById('ddCollectionName');
    if (nameInput) {
      nameInput.addEventListener('input', function () {
        var lineageName = document.getElementById('ddCollectionLineageName');
        if (lineageName) lineageName.textContent = nameInput.value || '数据采集子流程';
        var impactName = document.getElementById('ddCollectionImpactName');
        if (impactName) impactName.textContent = (nameInput.value || '数据采集子流程') + ' [V1]';
      });
    }

    view.addEventListener('input', function (event) {
      var treeSearch = event.target.getAttribute('data-collection-tree-search');
      if (treeSearch) self._renderCollectionTree(treeSearch, event.target.value);
      if (event.target.hasAttribute('data-collection-lineage-source')) {
        self._collectionState.sourceTable = event.target.value;
        self._updateCollectionLinkage();
      }
      if (event.target.hasAttribute('data-collection-lineage-target')) {
        self._collectionState.targetTable = event.target.value;
        self._updateCollectionLinkage();
      }
      if (event.target.hasAttribute('data-dependency-task-search')) {
        self._renderCollectionDependencyTasks(event.target.closest('.dd-collection-dependency-row'), event.target.value);
      }
      if (event.target.hasAttribute('data-collection-param-name')) {
        event.target.setCustomValidity(/^[A-Za-z][A-Za-z0-9_]{0,14}$/.test(event.target.value) || !event.target.value ? '' : '字母、数字、下划线，必须以字母开头，15个字符以内');
      }
    });

    view.addEventListener('change', function (event) {
      if (event.target.hasAttribute('data-collection-lineage-source')) {
        self._collectionState.sourceTable = event.target.value;
        self._updateCollectionLinkage();
      } else if (event.target.hasAttribute('data-collection-lineage-target')) {
        self._collectionState.targetTable = event.target.value;
        self._updateCollectionLinkage();
      } else if (event.target.hasAttribute('data-dependency-company')) {
        var companyRow = event.target.closest('.dd-collection-dependency-row');
        var projectSelect = companyRow.querySelector('[data-dependency-project]');
        var companyProjects = event.target.value === 'aotain' ? [
          { value: 'governance', text: '数据中台项目' },
          { value: 'warehouse', text: '冷链数仓项目' }
        ] : (event.target.value === 'sz-data' ? [{ value: 'operations', text: '运营分析项目' }] : []);
        projectSelect.innerHTML = '<option value="">请选择项目</option>' + companyProjects.map(function (project) { return '<option value="' + project.value + '">' + project.text + '</option>'; }).join('');
        projectSelect.disabled = !companyProjects.length;
        companyRow.querySelector('[data-dependency-task-trigger]').disabled = true;
        companyRow.querySelector('[data-dependency-task-trigger] span').textContent = '请选择目录';
        companyRow.querySelector('[data-dependency-task-trigger]').removeAttribute('data-selected-task');
        companyRow.querySelector('[data-dependency-version]').disabled = true;
        companyRow.querySelector('[data-dependency-version]').innerHTML = '<option value="">请选择版本</option>';
      } else if (event.target.hasAttribute('data-dependency-project')) {
        var projectRow = event.target.closest('.dd-collection-dependency-row');
        var taskTrigger = projectRow.querySelector('[data-dependency-task-trigger]');
        taskTrigger.disabled = !event.target.value;
        taskTrigger.querySelector('span').textContent = '请选择目录';
        taskTrigger.removeAttribute('data-selected-task');
        projectRow.querySelector('[data-dependency-task-search]').value = '';
        projectRow.querySelector('[data-dependency-version]').disabled = true;
        projectRow.querySelector('[data-dependency-version]').innerHTML = '<option value="">请选择版本</option>';
        self._renderCollectionDependencyTasks(projectRow, '');
      } else if (event.target.hasAttribute('data-collection-param-format')) {
        var paramValue = event.target.closest('tr').querySelector('[data-collection-param-value]');
        var paramFormat = event.target.value;
        paramValue.type = paramFormat === '密码' ? 'password' : (paramFormat === 'yyyy-MM-dd' ? 'date' : 'text');
        paramValue.value = '';
        paramValue.placeholder = paramFormat === '函数' ? '请输入函数表达式' : '请输入默认值';
      } else if (event.target.id === 'ddCollectionReadMode') {
        var sqlMode = event.target.value === 'sql';
        var sourceTableRow = document.getElementById('ddCollectionSourceTableRow');
        var sqlRow = document.getElementById('ddCollectionSqlRow');
        if (sourceTableRow) sourceTableRow.style.display = sqlMode ? 'none' : '';
        if (sqlRow) sqlRow.classList.toggle('show', sqlMode);
      } else if (event.target.id === 'ddCollectionReadType') {
        self._collectionState.sourcePath = '';
        self._collectionState.sourceTables = [];
        self._collectionState.sourceTable = '';
        self._renderCollectionReadFields(event.target.value);
        self._applyCollectionFieldPreset(event.target.value);
        self._updateCollectionLinkage();
      } else if (event.target.id === 'ddCollectionWriteType') {
        self._collectionState.databasePath = '';
        self._collectionState.targetTables = [];
        self._collectionState.targetTable = '';
        self._renderCollectionWriteFields(event.target.value);
        self._updateCollectionLinkage();
      } else if (event.target.id === 'ddCollectionSourceTable') {
        self._collectionState.sourceTable = event.target.value;
        self._updateCollectionLinkage();
      } else if (event.target.id === 'ddCollectionTargetTable') {
        self._collectionState.targetTable = event.target.value;
        self._updateCollectionLinkage();
      } else if (event.target.name === 'collectionImpact') {
        var direction = event.target.value;
        view.querySelectorAll('[data-impact-direction]').forEach(function (item) {
          item.classList.toggle('hidden', direction !== 'all' && item.getAttribute('data-impact-direction') !== direction);
        });
      }
    });

    view.addEventListener('focusin', function (event) {
      var field = event.target.closest('[data-collection-help-key]');
      if (!field) return;
      var key = field.getAttribute('data-collection-help-key');
      var help = self._collectionHelp[key];
      var section = field.closest('[data-collection-section]');
      var helpPanel = section ? section.querySelector('[data-collection-help]') : null;
      if (!help || !helpPanel) return;
      helpPanel.innerHTML = '<strong>' + self._escapeCollectionText(help[0]) + '</strong><dl><dt>• 参数定义</dt><dd>' + self._escapeCollectionText(help[1]) + '</dd><dt>• 参数描述</dt><dd>' + self._escapeCollectionText(help[2]) + '</dd></dl>';
    });

    view.addEventListener('click', function (event) {
      if (!event.target.closest('.dd-collection-tree-select')) view.querySelectorAll('.dd-collection-tree-popup.show').forEach(function (popup) { popup.classList.remove('show'); });
      if (!event.target.closest('.dd-collection-dependency-task')) view.querySelectorAll('.dd-collection-dependency-tree.show').forEach(function (tree) { tree.classList.remove('show'); });
    });

  },

  _updateScheduleContextOptions: function (context) {
    var modal = document.getElementById('ddScheduleModal');
    if (!modal) return;
    context = context || modal.getAttribute('data-schedule-context') || 'flow';
    var isCollection = context === 'collection';
    var dependencyCount = isCollection ? document.querySelectorAll('#ddCollectionDependencyList .dd-collection-dependency-row').length : document.querySelectorAll('.dd-dependency-item').length;
    var execRow = modal.querySelector('[data-dd-schedule-exec]');
    var triggerExec = modal.querySelector('[data-dd-trigger-exec]');
    var onceOption = modal.querySelector('[data-dd-collection-cycle]');
    var versionSelect = document.getElementById('ddScheduleVersion');
    var versionText = document.getElementById('ddScheduleVersionText');
    var retrySwitchRow = modal.querySelector('[data-dd-business-retry-switch]');
    var initLabel = modal.querySelector('[data-dd-init-label]');
    var initHelp = modal.querySelector('[data-dd-init-help]');
    if (execRow) execRow.style.display = dependencyCount ? '' : 'none';
    if (triggerExec) triggerExec.style.display = isCollection ? 'none' : '';
    if (onceOption) onceOption.hidden = !isCollection;
    if (versionSelect) versionSelect.style.display = isCollection ? '' : 'none';
    if (versionText) versionText.style.display = isCollection ? 'none' : '';
    if (retrySwitchRow) retrySwitchRow.style.display = isCollection ? 'none' : '';
    if (initLabel) initLabel.textContent = isCollection ? '是否调度初始化：' : '初始化：';
    if (initHelp) initHelp.textContent = isCollection ? '调度第一次执行忽略动态参数' : '调度第一次执行，忽略动态参数';
    this._updateScheduleFields();
  },

  _updateScheduleFields: function () {
    var cycle = document.getElementById('ddScheduleCycle');
    var modal = document.getElementById('ddScheduleModal');
    if (!cycle || !modal) return;
    var type = cycle.value;
    var execWay = modal.querySelector('input[name="ddScheduleExecWay"]:checked');
    var isTrigger = execWay && execWay.value === 'trigger_exec';
    var configRow = modal.querySelector('.dd-schedule-config-row');
    var isCollection = modal.getAttribute('data-schedule-context') === 'collection';
    if (configRow) configRow.style.display = isTrigger ? 'none' : '';
    modal.querySelectorAll('[data-dd-schedule-field]').forEach(function (field) {
      var name = field.getAttribute('data-dd-schedule-field');
      var visible = !isTrigger && ((name === 'hour' && type === 'h') ||
        (name === 'time' && (type === 'd' || type === 'w' || type === 'mon')) ||
        (name === 'weekday' && type === 'w') ||
        (name === 'monthday' && type === 'mon') ||
        name === type);
      field.classList.toggle('show', visible);
    });
    var retryEnabled = document.getElementById('ddScheduleRetryEnabled');
    modal.querySelectorAll('[data-dd-retry-detail]').forEach(function (row) {
      row.style.display = isCollection || (retryEnabled && retryEnabled.checked) ? '' : 'none';
    });
  },

  _openScheduleDialog: function (context) {
    var modal = document.getElementById('ddScheduleModal');
    if (!modal) return;
    context = context || 'flow';
    modal.setAttribute('data-schedule-context', context);
    var isCollection = context === 'collection';
    var collectionName = document.getElementById('ddCollectionName');
    document.getElementById('ddScheduleName').value = isCollection && collectionName ? collectionName.value : '批量计算业务流程';
    document.getElementById('ddScheduleVersion').value = 'V1';
    document.getElementById('ddScheduleCycle').value = '';
    document.getElementById('ddScheduleHourMinute').value = '1';
    document.getElementById('ddScheduleWeekday').value = '2';
    document.getElementById('ddScheduleMonthday').value = '1';
    document.getElementById('ddScheduleTime').value = '00:00:00';
    document.getElementById('ddScheduleCron').value = '';
    var onceDate = new Date(Date.now() + 5 * 60000);
    var localOnce = new Date(onceDate.getTime() - onceDate.getTimezoneOffset() * 60000).toISOString().slice(0, 19);
    document.getElementById('ddScheduleOnce').value = localOnce;
    document.querySelector('input[name="ddScheduleExecWay"][value="schedule_exec"]').checked = true;
    document.getElementById('ddScheduleRetryEnabled').checked = true;
    document.getElementById('ddScheduleRetries').value = '3';
    document.getElementById('ddScheduleRetryBackoff').value = '300';
    document.getElementById('ddScheduleInit').checked = false;
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    this._updateScheduleContextOptions(context);
  },

  _closeScheduleDialog: function () {
    var modal = document.getElementById('ddScheduleModal');
    if (!modal) return;
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
  },

  _getScheduleSummary: function () {
    var cycle = document.getElementById('ddScheduleCycle');
    var execWay = document.querySelector('input[name="ddScheduleExecWay"]:checked');
    if (execWay && execWay.value === 'trigger_exec') return '触发执行';
    var type = cycle ? cycle.value : '';
    if (type === 'm') return '每分钟';
    if (type === 'h') return '每小时 第' + document.getElementById('ddScheduleHourMinute').value + '分钟';
    if (type === 'd') return '每天 ' + document.getElementById('ddScheduleTime').value;
    if (type === 'w') return '每' + document.getElementById('ddScheduleWeekday').options[document.getElementById('ddScheduleWeekday').selectedIndex].text + ' ' + document.getElementById('ddScheduleTime').value;
    if (type === 'mon') return '每月' + document.getElementById('ddScheduleMonthday').options[document.getElementById('ddScheduleMonthday').selectedIndex].text + ' ' + document.getElementById('ddScheduleTime').value;
    if (type === 'cron') return document.getElementById('ddScheduleCron').value.trim();
    if (type === 'once') return '执行一次 ' + document.getElementById('ddScheduleOnce').value.replace('T', ' ');
    return '';
  },

  _showScheduleToast: function (message) {
    var toast = document.getElementById('ddScheduleToast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(this._scheduleToastTimer);
    this._scheduleToastTimer = setTimeout(function () { toast.classList.remove('show'); }, 1800);
  },

  _initScheduleDialog: function () {
    var self = this;
    var page = document.querySelector('.page-data-develop');
    var modal = document.getElementById('ddScheduleModal');
    var cycle = document.getElementById('ddScheduleCycle');
    if (!page || !modal || !cycle) return;

    cycle.addEventListener('change', function () { self._updateScheduleFields(); });
    modal.addEventListener('change', function (event) {
      if (event.target.name === 'ddScheduleExecWay' || event.target.id === 'ddScheduleRetryEnabled') self._updateScheduleFields();
    });
    page.addEventListener('click', function (event) {
      var flowSchedule = event.target.closest('[data-dd-action="schedule"]');
      if (flowSchedule) {
        self._openScheduleDialog('flow');
        return;
      }
      if (event.target.closest('[data-dd-schedule-close]') || event.target === modal) {
        self._closeScheduleDialog();
        return;
      }
      if (!event.target.closest('[data-dd-schedule-confirm]')) return;
      var context = modal.getAttribute('data-schedule-context');
      var isCollection = context === 'collection';
      var execWay = modal.querySelector('input[name="ddScheduleExecWay"]:checked').value;
      var type = cycle.value;
      if (execWay === 'schedule_exec' && !type) {
        self._showScheduleToast('请配置调度配置');
        return;
      }
      if (type === 'cron' && !document.getElementById('ddScheduleCron').value.trim()) { self._showScheduleToast('请输入 cron 表达式'); return; }
      if (type === 'once') {
        var onceValue = document.getElementById('ddScheduleOnce').value;
        if (!onceValue) { self._showScheduleToast('请选择执行时间'); return; }
        if (new Date(onceValue).getTime() < Date.now() + 60000) { self._showScheduleToast('执行时间至少晚于当前时间1分钟'); return; }
      }
      var retryEnabled = document.getElementById('ddScheduleRetryEnabled').checked;
      var retries = Number(document.getElementById('ddScheduleRetries').value);
      var retryBackoff = Number(document.getElementById('ddScheduleRetryBackoff').value);
      if ((isCollection || retryEnabled) && (!retries || retries < 1 || retries > 10)) { self._showScheduleToast('重试次数范围为1-10'); return; }
      if ((isCollection || retryEnabled) && (!retryBackoff || retryBackoff < 1 || retryBackoff > 300)) { self._showScheduleToast('重试间隔范围为1-300秒'); return; }
      var summary = self._getScheduleSummary();
      if (context === 'collection') {
        var collectionStatus = document.querySelector('.dd-collection-side-info strong');
        var impactSchedule = document.querySelector('.dd-impact-schedule');
        if (collectionStatus) collectionStatus.textContent = '已启动';
        if (impactSchedule) impactSchedule.textContent = '定时调度：' + summary;
      } else {
        var flowInfo = document.querySelectorAll('.dd-props-tab-content[data-props-content="basic"] .dd-prop-info');
        if (flowInfo[0]) flowInfo[0].innerHTML = '<span class="status-success">已启动</span>';
        if (flowInfo[1]) flowInfo[1].textContent = summary + ' 执行';
      }
      self._closeScheduleDialog();
      self._showScheduleToast(context === 'collection' ? '启动成功' : '调度成功');
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && modal.classList.contains('show')) self._closeScheduleDialog();
    });
    self._updateScheduleFields();
  },

  /* ============================================================
     程序包、前置任务与流式子流程定制
     ============================================================ */

  _showConfigToast: function (view, message) {
    if (!view) return;
    var toast = view.querySelector('[data-config-toast]');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(this._configToastTimer);
    this._configToastTimer = setTimeout(function () { toast.classList.remove('show'); }, 1800);
  },

  _streamCommonSourceFields: function () {
    return '<label class="wide"><span><em>*</em> 示例数据</span><textarea class="dd-stream-example-data" rows="5" placeholder="请输入json或xml格式的示例数据">{\n  "order_id": "SO202609200001",\n  "store_id": "SZ001",\n  "order_amount": 286.50,\n  "event_time": "2026-09-20 10:18:26"\n}</textarea></label>' +
      '<label><span><em>*</em> 数据类型</span><select><option>json</option><option>xml</option></select></label>' +
      '<div class="dd-special-radio"><span>是否扁平化</span><label><input type="radio" name="ddStreamFlatten" checked> 扁平化</label><label><input type="radio" name="ddStreamFlatten"> 不扁平化</label></div>' +
      '<label><span>解析开始节点</span><input value="data"></label><label><span>解析结束节点</span><input placeholder="请输入解析结束节点"></label>';
  },

  _renderStreamSourceFields: function (type) {
    var container = document.getElementById('ddStreamSourceFields');
    if (!container) return;
    var html = '';
    if (type === 'Kafka') {
      html = '<label><span><em>*</em> 数据类型</span><select><option>json</option><option>xml</option></select></label>' +
        '<div class="dd-special-radio"><span>是否扁平化</span><label><input type="radio" name="ddStreamFlatten" checked> 扁平化</label><label><input type="radio" name="ddStreamFlatten"> 不扁平化</label></div>' +
        '<label><span>验证方式</span><select><option>无</option><option>SASL_PLAINTEXT</option><option>SASL_SSL</option></select></label>' +
        '<label class="wide"><span><em>*</em> Bootstrap Server</span><div class="dd-special-inline"><input value="10.20.16.31:9092"><button class="btn" type="button" data-config-action="测试链接"><i class="bi bi-link-45deg"></i> 测试链接</button></div></label>' +
        '<label><span><em>*</em> topic</span><input value="trade_order_event"></label><label><span><em>*</em> offset</span><select><option>latest</option><option>earliest</option></select></label>' +
        '<label class="wide"><span>数据预览</span><button class="btn dd-special-left" type="button" data-config-action="数据预览"><i class="bi bi-table"></i> 数据预览</button></label>' +
        '<label><span>解析开始节点</span><input value="data"></label><label><span>解析结束节点</span><input placeholder="请输入解析结束节点"></label>';
    } else if (type === 'activeMq') {
      html = this._streamCommonSourceFields().replace('<label><span>解析开始节点</span>', '<label class="wide"><span><em>*</em> 连接地址</span><div class="dd-special-inline"><input value="tcp://10.20.16.32:61616"><button class="btn" type="button" data-config-action="测试链接"><i class="bi bi-link-45deg"></i> 测试链接</button></div></label><label><span>消息类型</span><select><option>topic</option><option>queue</option></select></label><label><span><em>*</em> 主题/topic</span><input value="order_event"></label><label><span>用户名</span><input value="stream_user"></label><label><span>密码</span><input type="password" value="123456"></label><label><span>解析开始节点</span>');
    } else if (type === 'Rabbitmq') {
      html = this._streamCommonSourceFields().replace('<label><span>解析开始节点</span>', '<label class="wide"><span><em>*</em> 连接地址</span><div class="dd-special-inline"><input value="amqp://10.20.16.33:5672"><button class="btn" type="button" data-config-action="测试链接"><i class="bi bi-link-45deg"></i> 测试链接</button></div></label><label><span>用户名</span><input value="stream_user"></label><label><span>密码</span><input type="password" value="123456"></label><label><span><em>*</em> 队列名称</span><input value="device_alarm_queue"></label><label><span>虚拟地址</span><input value="/"></label><label><span>交换机名称</span><input value="device_alarm_exchange"></label><label><span>解析开始节点</span>');
    } else {
      html = this._streamCommonSourceFields();
    }
    container.innerHTML = html;
  },

  _isStreamDatabaseWriter: function (type) {
    return ['DB2', 'DM8', 'Doris', 'Gaussdb', 'Greenplum', 'HANA', 'Hive', 'Iceberg', 'Impala', 'Informix', 'KADB', 'KingBase', 'Mariadb', 'MySQL', 'MySQL8', 'OceanBase', 'Oracle', 'Oscar', 'PolarDB', 'postgis', 'PostgreSQL', 'Presto', 'SqlServer', 'StarRocks', 'TDengine', 'TDSQL', 'TiDB'].indexOf(type) > -1;
  },

  _renderStreamWriterFields: function (type) {
    var container = document.getElementById('ddStreamWriterFields');
    if (!container) return;
    var html = '';
    if (type === 'Kafka') {
      html = '<label class="wide"><span><em>*</em> Bootstrap Server</span><div class="dd-special-inline"><input value="10.20.16.31:9092"><button class="btn" type="button" data-config-action="测试连接"><i class="bi bi-link-45deg"></i> 测试连接</button></div></label>' +
        '<label><span><em>*</em> topic</span><div class="dd-special-inline"><input value="dwd_order_event"><button class="btn" type="button" data-config-action="新建Topic"><i class="bi bi-plus-circle"></i> 新建Topic</button></div></label><label><span>选择输出列</span><select><option>全部字段</option></select></label>' +
        '<label><span>文件格式</span><select><option>json</option><option>csv</option></select></label><div class="dd-special-radio"><span>是否分割写入</span><label><input type="radio" name="ddSplitWrite" checked> 否</label><label><input type="radio" name="ddSplitWrite"> 是</label></div><label><span>分割写入行分隔符</span><input value="\\n"></label>';
    } else if (type === 'activeMq') {
      html = '<label class="wide"><span><em>*</em> 连接地址</span><div class="dd-special-inline"><input value="tcp://10.20.16.32:61616"><button class="btn" type="button" data-config-action="测试链接"><i class="bi bi-link-45deg"></i> 测试链接</button></div></label>' +
        '<label><span>消息类型</span><select><option>queue</option></select></label><label><span><em>*</em> queue</span><div class="dd-special-inline"><input value="order_event"><button class="btn" type="button" data-config-action="新建"><i class="bi bi-plus-circle"></i> 新建</button></div></label>' +
        '<label><span>用户名</span><input value="stream_user"></label><label><span>密码</span><input type="password" value="123456"></label><label><span>文件格式</span><select><option>json</option><option>xml</option></select></label><label><span>选择输出列</span><select><option>全部字段</option></select></label>';
    } else if (this._isStreamDatabaseWriter(type)) {
      html = '<label><span><em>*</em> 选择库</span><select><option>DWD-明细层 → 交易主题库</option></select></label><label><span><em>*</em> 选择表</span><div class="dd-special-inline"><select><option>dwd_order_event</option><option>dwd_device_alarm</option></select><button class="btn" type="button" data-config-action="新建表"><i class="bi bi-plus-circle"></i> 新建表</button></div></label><label><span>写类型</span><select><option>增加</option></select></label><label><span>错误处理机制</span><select><option>停止</option></select></label>';
    } else {
      html = '<label><span><em>*</em> 写数据类型</span><input value="' + this._escapeCollectionText(type) + '" readonly></label><div class="dd-stream-empty-config wide"><i class="bi bi-inbox"></i><span>当前数据源在系统中无附加配置项</span></div>';
    }
    container.innerHTML = html;
  },

  _renderStreamFieldMapping: function (sourceType, writerType) {
    var container = document.getElementById('ddStreamFieldMapping');
    if (!container) return;
    var hasMapping = writerType === 'Kafka' || writerType === 'activeMq' || this._isStreamDatabaseWriter(writerType);
    if (!hasMapping) {
      container.innerHTML = '<div class="dd-stream-empty-config"><i class="bi bi-inbox"></i><span>暂无数据</span></div>';
    } else {
      container.innerHTML = '<table><thead><tr><th>源字段</th><th>字段类型</th><th>目标字段</th><th>字段类型</th></tr></thead><tbody><tr><td>order_id</td><td>STRING</td><td>order_id</td><td>STRING</td></tr><tr><td>store_id</td><td>STRING</td><td>store_id</td><td>STRING</td></tr><tr><td>order_amount</td><td>DECIMAL</td><td>order_amount</td><td>DECIMAL</td></tr><tr><td>event_time</td><td>TIMESTAMP</td><td>event_time</td><td>TIMESTAMP</td></tr></tbody></table>';
    }
    var source = document.getElementById('ddStreamLineageSource');
    var target = document.getElementById('ddStreamLineageTarget');
    var sourceDetail = sourceType === 'Kafka' ? 'trade_order_event' : (sourceType === 'activeMq' ? 'order_event' : (sourceType === 'Rabbitmq' ? 'device_alarm_queue' : '示例数据'));
    var targetDetail = writerType === 'Kafka' ? 'dwd_order_event' : (writerType === 'activeMq' ? 'order_event' : (this._isStreamDatabaseWriter(writerType) ? 'dwd_order_event' : '暂无目标配置'));
    if (source) source.textContent = sourceType + ' · ' + sourceDetail;
    if (target) target.textContent = writerType + ' · ' + targetDetail;
  },

  _cdcDatabaseTreeData: function (role) {
    if (role === 'read') return [
      { name: 'ODS-贴源层', children: [{ name: '工单_ODS' }] },
      { name: '业务系统', children: [{ name: '测试业务系统' }, { name: '仿真数据' }, { name: '工单系统' }, { name: '物流系统', children: [{ name: '物流系统', children: [{ name: 'train' }] }] }] },
      { name: '数据质量-报告', children: [{ name: 'mysql数据源' }] }
    ];
    return [
      { name: 'DWS-数据汇总层', children: [{ name: 'DWS_数据汇总' }] },
      { name: 'ODS-贴源层', children: [{ name: '物流_ODS' }, { name: '中电数智_ODS' }] },
      { name: '系统业务库', children: [{ name: 'hive链接' }] },
      { name: 'ADS-应用层', children: [{ name: 'ADS_数据超市' }] },
      { name: '演示', children: [{ name: '中电数智演示数仓库', children: [{ name: '中电数智演示数仓库', children: [{ name: 'zz_tms_ads' }, { name: 'zz_tms_dim' }, { name: 'zz_tms_dwd' }, { name: 'zz_tms_dws' }, { name: 'zz_tms_ods' }] }] }] },
      { name: 'DWD-数据明细层', children: [{ name: 'DWD_数据' }] }
    ];
  },

  _cdcDatabaseTreeNodesHtml: function (nodes, role, parentPath, level) {
    var self = this;
    return nodes.map(function (node) {
      var path = parentPath ? parentPath + '->' + node.name : node.name;
      if (node.children && node.children.length) {
        return '<div class="dd-cdc-tree-branch" data-cdc-tree-branch data-search-text="' + self._escapeCollectionText(path.toLowerCase()) + '"><button class="dd-cdc-tree-branch-title" type="button" data-cdc-action="toggle-db-branch" style="padding-left:' + (12 + level * 18) + 'px"><i class="bi bi-chevron-down"></i><i class="bi bi-layers-fill"></i><span>' + self._escapeCollectionText(node.name) + '</span></button><div class="dd-cdc-tree-children">' + self._cdcDatabaseTreeNodesHtml(node.children, role, path, level + 1) + '</div></div>';
      }
      return '<button class="dd-cdc-tree-leaf" type="button" data-cdc-action="select-database" data-cdc-db-option="' + role + '" data-value="' + self._escapeCollectionText(path) + '" data-search-text="' + self._escapeCollectionText(path.toLowerCase()) + '" style="padding-left:' + (31 + level * 18) + 'px"><i class="bi bi-folder-fill"></i><span>' + self._escapeCollectionText(node.name) + '</span></button>';
    }).join('');
  },

  _cdcDatabaseTreeSelectHtml: function (type, role, label) {
    var defaultValue = role === 'read' && (type === 'MySQL' || type === 'MySQL8') ? 'ODS-贴源层->工单_ODS' : (role === 'write' && type === 'Hive' ? 'ODS-贴源层->中电数智_ODS' : '');
    var inputId = role === 'read' ? 'ddCdcReadDatabase' : 'ddCdcWriteDatabase';
    var nodes = this._cdcDatabaseTreeNodesHtml(this._cdcDatabaseTreeData(role), role, '', 0);
    return '<label><span><em>*</em> ' + label + '</span><div class="dd-cdc-tree-select" data-cdc-db-select="' + role + '"><div class="dd-cdc-tree-control"><input id="' + inputId + '" value="' + this._escapeCollectionText(defaultValue) + '" placeholder="请选择数据库" autocomplete="off" data-cdc-db-search="' + role + '" data-selected-value="' + this._escapeCollectionText(defaultValue) + '"><button type="button" data-cdc-action="toggle-db-tree" data-cdc-db-role="' + role + '" aria-label="展开' + label + '"><i class="bi bi-chevron-down"></i></button></div><div class="dd-cdc-tree-popup" data-cdc-db-popup="' + role + '"><div class="dd-cdc-tree-list">' + nodes + '<div class="dd-cdc-tree-empty" data-cdc-tree-empty>暂无匹配数据</div></div></div></div></label>';
  },

  _renderCdcReadFields: function (type) {
    var container = document.getElementById('ddCdcReadFields');
    if (!container) return;
    var serverId = (type === 'MySQL' || type === 'MySQL8') ? '<label><span>serverId</span><input value="5400-6400"></label>' : '';
    container.innerHTML = this._cdcDatabaseTreeSelectHtml(type, 'read', '数据库') +
      '<label><span><em>*</em> 并行度</span><input id="ddCdcParallelism" type="number" min="1" value="1"></label>' +
      '<label><span><em>*</em> 启动模式</span><select><option selected>全量</option><option>增量</option></select></label>' +
      '<label><span><em>*</em> 批次大小</span><input type="number" min="1" value="2048"></label>' +
      '<label><span><em>*</em> 大字段处理</span><select><option>不过滤</option><option selected>过滤该字段</option><option>过滤该表</option></select></label>' +
      serverId +
      '<div class="dd-cdc-advanced-row"><span>高级设置</span><button class="dd-cdc-advanced-toggle" type="button" data-cdc-action="toggle-advanced" aria-expanded="false"><i class="bi bi-chevron-down"></i> 高级设置</button></div>' +
      '<div class="dd-cdc-advanced-panel" data-cdc-advanced-panel style="display:none"><div class="dd-cdc-advanced-toolbar"><button class="btn btn-primary" type="button" data-cdc-action="add-debezium"><i class="bi bi-plus-lg"></i> 新增</button></div><table><thead><tr><th>Debezium连接器属性</th><th>属性值</th><th>操作</th></tr></thead><tbody id="ddCdcDebeziumRows"><tr data-cdc-empty-row><td colspan="3"><div class="dd-cdc-table-empty"><i class="bi bi-inbox"></i><span>暂无数据</span></div></td></tr></tbody></table></div>';
    this._updateCdcLineage();
  },

  _renderCdcWriteFields: function (type) {
    var container = document.getElementById('ddCdcWriteFields');
    if (!container) return;
    if (type === 'Kafka') {
      container.innerHTML = this._cdcDatabaseTreeSelectHtml(type, 'write', 'Kafka 数据源') +
        '<label><span>表命名规则</span><select id="ddCdcNamingRule"><option selected>沿用原表名</option></select></label>' +
        '<label><span>Topic 命名规则内容</span><input id="ddCdcNamingPreview" value="[原表名]"><small>按所选规则生成 Topic，保留大小写；可在表配置中单独指定。</small></label>' +
        '<label><span><em>*</em> 投递方式</span><select><option selected>至少一次</option></select><small>恢复时可能重复，下游需幂等处理。</small></label>' +
        '<label><span>Checkpoint 间隔</span><div class="dd-cdc-number-unit"><input type="number" min="10" max="300" value="30"><span>秒</span></div><small>10～300 秒</small></label>' +
        '<div class="dd-cdc-info wide"><i class="bi bi-info-circle-fill"></i><span>保留主键及增删改事件。切换数据源或命名规则后，如需补发历史数据，请关闭恢复点并进行全量采集。</span></div>' +
        '<label><span><em>*</em> 恢复点</span><select><option selected>开启</option><option>关闭</option></select></label>' +
        '<label><span>选择恢复点</span><input placeholder="默认使用最新恢复点"><small><i class="bi bi-info-circle"></i> 暂无可用的 Savepoint 记录，将使用最新的 Checkpoint</small></label>';
    } else {
      var selectedRule = type === 'Hive' ? 'ods命名规则' : 'dwd命名规则';
      var ruleOptions = ['批量采集模版', 'dim命名规则', 'ads命名规则', 'dws命名规则', 'dwd命名规则', 'ods命名规则'].map(function (rule) { return '<option' + (rule === selectedRule ? ' selected' : '') + '>' + rule + '</option>'; }).join('');
      var storageFields = '';
      if (type === 'Hive' || type === 'StarRocks') storageFields += '<label><span>分桶字段</span><input placeholder="请选择分桶字段"></label><label><span>分桶数</span><input type="number" min="1" placeholder="请输入分桶数"></label>';
      if (type === 'StarRocks') storageFields += '<label><span>副本数</span><input type="number" min="1" placeholder="请输入副本数"></label>';
      container.innerHTML = this._cdcDatabaseTreeSelectHtml(type, 'write', '数据库') +
        '<label><span><em>*</em> 表命名规则</span><select id="ddCdcNamingRule">' + ruleOptions + '</select></label>' +
        '<label><span>命名规则内容</span><input id="ddCdcNamingPreview" value="' + (type === 'Hive' ? 'ods_[原表名]_[更新标识]' : 'dwd_[原表名]_[更新标识]') + '" disabled></label>' +
        '<label><span><em>*</em> 更新标识</span><select id="ddCdcUpdateMark"><option selected>按小时全量（hf）</option><option>按小时增量（hi）</option><option>按天全量（df）</option><option>按天增量（di）</option><option>按周全量（wf）</option><option>按周增量（wi）</option><option>按月全量（mf）</option><option>按月增量（mi）</option></select></label>' +
        storageFields +
        '<label><span><em>*</em> 处理机制</span><select><option selected>数据同步</option></select></label>' +
        '<label><span><em>*</em> savepoint开启</span><select><option selected>true</option><option>false</option></select></label>' +
        '<label><span>选择恢复点</span><input placeholder="选择恢复点（不选则使用最新的，默认不选择）"><small><i class="bi bi-info-circle"></i> 暂无可用的 Savepoint 记录，将使用最新的 Checkpoint</small></label>';
    }
    this._renderCdcTableConfig(type);
    this._updateCdcLineage();
  },

  _ensureCdcTableState: function () {
    if (!this._cdcTables) this._cdcTables = [
      { name: 't_sales_order', alias: '销售订单', description: '销售订单主表' },
      { name: 't_store_info', alias: '门店资料', description: '门店基础信息' }
    ];
    if (!this._cdcAvailableTables) this._cdcAvailableTables = [
      { name: 't_sales_order_detail', alias: '订单明细', description: '销售订单商品明细' },
      { name: 't_goods_info', alias: '商品资料', description: '商品基础信息' },
      { name: 't_member_info', alias: '会员资料', description: '会员基础信息' }
    ];
  },

  _cdcTargetName: function (table, writeType) {
    if (writeType === 'Kafka') return table.name;
    var mark = document.getElementById('ddCdcUpdateMark');
    var rule = document.getElementById('ddCdcNamingRule');
    var codeMatch = mark && mark.value.match(/（([^）]+)）/);
    var code = codeMatch ? codeMatch[1] : 'hf';
    var ruleName = rule ? rule.value : 'dwd命名规则';
    if (ruleName === '批量采集模版') return table.name + '_' + code;
    if (ruleName === 'dim命名规则') return 'dim_' + table.name;
    var prefix = ruleName.replace('命名规则', '') || 'dwd';
    return prefix + '_' + table.name + '_' + code;
  },

  _renderCdcTableConfig: function (writeType, keyword) {
    var container = document.getElementById('ddCdcTableConfig');
    if (!container) return;
    this._ensureCdcTableState();
    var self = this;
    var term = String(keyword || '').trim().toLowerCase();
    var rows = this._cdcTables.filter(function (table) { return !term || (table.name + table.alias).toLowerCase().indexOf(term) > -1; }).map(function (table) {
      var target = self._cdcTargetName(table, writeType);
      if (writeType === 'Kafka') return '<tr><td><input type="checkbox" data-cdc-table-check="' + self._escapeCollectionText(table.name) + '"></td><td>' + self._escapeCollectionText(table.name) + '</td><td>' + self._escapeCollectionText(table.alias) + '</td><td><input value="' + self._escapeCollectionText(target) + '" aria-label="目标 Topic"></td></tr>';
      return '<tr><td><input type="checkbox" data-cdc-table-check="' + self._escapeCollectionText(table.name) + '"></td><td>' + self._escapeCollectionText(table.name) + '</td><td>' + self._escapeCollectionText(table.alias) + '</td><td><div class="dd-cdc-target-actions"><span>选择</span><button class="btn btn-text" type="button" data-cdc-action="target-setting" data-target="' + self._escapeCollectionText(target) + '">设置</button></div></td><td><button class="btn btn-text" type="button" data-cdc-action="field-mapping">默认映射</button></td></tr>';
    }).join('');
    var lastHeader = writeType === 'Kafka' ? '<th>目标 Topic（留空使用默认规则）</th>' : '<th>目标表自定义</th><th>表映射</th>';
    var colspan = writeType === 'Kafka' ? 4 : 5;
    container.innerHTML = '<div class="dd-special-table-toolbar"><button class="btn btn-primary" type="button" data-cdc-action="open-table-modal"><i class="bi bi-plus-lg"></i> 添加表</button><button class="btn" type="button" data-cdc-action="delete-tables"><i class="bi bi-trash3"></i> 删除</button><div><input id="ddCdcTableSearch" value="' + this._escapeCollectionText(keyword || '') + '" placeholder="名称和别名模糊查询"><button class="dd-cdc-search-button" type="button" data-cdc-action="search-tables"><i class="bi bi-search"></i> 查询</button></div></div><div class="dd-field-match dd-cdc-table-wrap"><table><thead><tr><th><input type="checkbox" data-cdc-action="toggle-all-tables" aria-label="全选"></th><th>表名称</th><th>别名</th>' + lastHeader + '</tr></thead><tbody>' + (rows || '<tr><td colspan="' + colspan + '"><div class="dd-cdc-table-empty"><i class="bi bi-inbox"></i><span>暂无数据</span></div></td></tr>') + '</tbody></table><div class="dd-cdc-pager"><span>共 ' + this._cdcTables.length + ' 条</span><button type="button" disabled><i class="bi bi-chevron-left"></i></button><b>1</b><button type="button" disabled><i class="bi bi-chevron-right"></i></button><select><option>10 条/页</option></select></div></div>';
  },

  _renderCdcAvailableTables: function (keyword) {
    var container = document.getElementById('ddCdcAvailableTables');
    if (!container) return;
    this._ensureCdcTableState();
    var self = this;
    var existing = this._cdcTables.map(function (item) { return item.name; });
    var term = String(keyword || '').trim().toLowerCase();
    var rows = this._cdcAvailableTables.filter(function (table) { return existing.indexOf(table.name) < 0 && (!term || (table.name + table.alias + table.description).toLowerCase().indexOf(term) > -1); }).map(function (table) {
      return '<tr><td><input type="checkbox" data-cdc-available-check="' + self._escapeCollectionText(table.name) + '"></td><td>' + self._escapeCollectionText(table.name) + '</td><td>' + self._escapeCollectionText(table.alias) + '</td><td>' + self._escapeCollectionText(table.description) + '</td></tr>';
    }).join('');
    container.innerHTML = '<table><thead><tr><th><input type="checkbox" data-cdc-action="select-all-available" aria-label="全选"></th><th>表名</th><th>别名</th><th>描述</th></tr></thead><tbody>' + (rows || '<tr><td colspan="4"><div class="dd-cdc-table-empty"><i class="bi bi-inbox"></i><span>暂无数据</span></div></td></tr>') + '</tbody></table><div class="dd-cdc-pager"><span>共 ' + (rows ? rows.split('<tr>').length - 1 : 0) + ' 条</span><button type="button" disabled><i class="bi bi-chevron-left"></i></button><b>1</b><button type="button" disabled><i class="bi bi-chevron-right"></i></button><select><option>10 条/页</option></select></div>';
  },

  _updateCdcNamingPreview: function () {
    var rule = document.getElementById('ddCdcNamingRule');
    var preview = document.getElementById('ddCdcNamingPreview');
    if (!rule || !preview || rule.value === '沿用原表名') return;
    var rules = {
      '批量采集模版': '[原表名]_[更新标识]', 'dim命名规则': 'dim_[原表名]', 'ads命名规则': 'ads_[原表名]_[更新标识]',
      'dws命名规则': 'dws_[原表名]_[更新标识]', 'dwd命名规则': 'dwd_[原表名]_[更新标识]', 'ods命名规则': 'ods_[原表名]_[更新标识]'
    };
    preview.value = rules[rule.value] || '[原表名]';
  },

  _setCdcDatabaseTreeOpen: function (role, open) {
    var selector = document.querySelector('[data-cdc-db-select="' + role + '"]');
    if (!selector) return;
    document.querySelectorAll('.dd-cdc-tree-select.open').forEach(function (item) {
      if (item === selector) return;
      item.classList.remove('open');
      var otherField = item.querySelector('[data-cdc-db-search]');
      if (otherField) otherField.value = otherField.getAttribute('data-selected-value') || '';
    });
    selector.classList.toggle('open', open);
    if (open) {
      var input = selector.querySelector('[data-cdc-db-search]');
      if (input) {
        input.value = '';
        this._filterCdcDatabaseTree(role, '');
        var selectedValue = input.getAttribute('data-selected-value') || '';
        selector.querySelectorAll('[data-cdc-db-option]').forEach(function (option) { option.classList.toggle('active', option.getAttribute('data-value') === selectedValue); });
        input.focus();
      }
    } else {
      var field = selector.querySelector('[data-cdc-db-search]');
      if (field) field.value = field.getAttribute('data-selected-value') || '';
    }
  },

  _filterCdcDatabaseTree: function (role, keyword) {
    var selector = document.querySelector('[data-cdc-db-select="' + role + '"]');
    if (!selector) return;
    var term = String(keyword || '').trim().toLowerCase();
    var visible = 0;
    selector.querySelectorAll('[data-cdc-db-option]').forEach(function (leaf) {
      var matched = !term || (leaf.getAttribute('data-search-text') || '').indexOf(term) > -1;
      leaf.style.display = matched ? '' : 'none';
      if (matched) visible += 1;
    });
    var branches = Array.prototype.slice.call(selector.querySelectorAll('[data-cdc-tree-branch]')).reverse();
    branches.forEach(function (branch) {
      var titleMatched = !term || (branch.getAttribute('data-search-text') || '').indexOf(term) > -1;
      var childMatched = Array.prototype.some.call(branch.querySelectorAll('[data-cdc-db-option]'), function (leaf) { return leaf.style.display !== 'none'; });
      branch.style.display = titleMatched || childMatched ? '' : 'none';
      if (term && childMatched) branch.classList.remove('collapsed');
    });
    var empty = selector.querySelector('[data-cdc-tree-empty]');
    if (empty) empty.style.display = visible ? 'none' : 'block';
  },

  _selectCdcDatabase: function (role, path) {
    var selector = document.querySelector('[data-cdc-db-select="' + role + '"]');
    if (!selector) return;
    var input = selector.querySelector('[data-cdc-db-search]');
    if (input) {
      input.value = path;
      input.setAttribute('data-selected-value', path);
    }
    selector.querySelectorAll('[data-cdc-db-option]').forEach(function (option) { option.classList.toggle('active', option.getAttribute('data-value') === path); });
    selector.classList.remove('open');
    if (role === 'read') {
      this._cdcTables = [];
      var writeType = document.getElementById('ddCdcWriteType');
      this._renderCdcTableConfig(writeType ? writeType.value : 'Hive');
    }
    this._updateCdcLineage();
  },

  _updateCdcLineage: function () {
    var readType = document.getElementById('ddCdcReadType');
    var writeType = document.getElementById('ddCdcWriteType');
    var source = document.getElementById('ddCdcLineageSource');
    var target = document.getElementById('ddCdcLineageTarget');
    var readDb = document.getElementById('ddCdcReadDatabase');
    var writeDb = document.getElementById('ddCdcWriteDatabase');
    var readName = readDb && readDb.getAttribute('data-selected-value') ? readDb.getAttribute('data-selected-value').split('->').pop() : '请选择数据库';
    var writeName = writeDb && writeDb.getAttribute('data-selected-value') ? writeDb.getAttribute('data-selected-value').split('->').pop() : (writeType && writeType.value === 'Kafka' ? '请选择Kafka数据源' : '请选择数据库');
    if (source && readType) source.textContent = readType.value + ' · ' + readName + ' / t_sales_order';
    if (target && writeType) target.textContent = writeType.value + ' · ' + writeName + ' / ' + (writeType.value === 'Kafka' ? 't_sales_order' : this._cdcTargetName({ name: 't_sales_order' }, writeType.value));
  },

  _handleCdcAction: function (action, button, view) {
    var modal = document.getElementById('ddCdcAddTableModal');
    var writeType = document.getElementById('ddCdcWriteType');
    var type = writeType ? writeType.value : 'Hive';
    if (action === 'toggle-db-tree') {
      var role = button.getAttribute('data-cdc-db-role');
      var selector = role && document.querySelector('[data-cdc-db-select="' + role + '"]');
      this._setCdcDatabaseTreeOpen(role, selector ? !selector.classList.contains('open') : false);
    } else if (action === 'toggle-db-branch') {
      var branch = button.closest('[data-cdc-tree-branch]');
      if (branch) branch.classList.toggle('collapsed');
    } else if (action === 'select-database') {
      this._selectCdcDatabase(button.getAttribute('data-cdc-db-option'), button.getAttribute('data-value'));
    } else if (action === 'toggle-advanced') {
      var panel = view.querySelector('[data-cdc-advanced-panel]');
      var open = panel && panel.style.display === 'none';
      if (panel) panel.style.display = open ? '' : 'none';
      button.classList.toggle('open', open);
      button.setAttribute('aria-expanded', String(open));
    } else if (action === 'add-debezium') {
      var body = document.getElementById('ddCdcDebeziumRows');
      var empty = body && body.querySelector('[data-cdc-empty-row]');
      if (empty) empty.remove();
      if (body) body.insertAdjacentHTML('beforeend', '<tr><td><input placeholder="请输入连接器属性"></td><td><input placeholder="请输入属性值"></td><td><button class="btn btn-text" type="button" data-cdc-action="remove-debezium"><i class="bi bi-trash3"></i> 删除</button></td></tr>');
    } else if (action === 'remove-debezium') {
      var row = button.closest('tr');
      var tbody = row && row.parentNode;
      if (row) row.remove();
      if (tbody && !tbody.children.length) tbody.innerHTML = '<tr data-cdc-empty-row><td colspan="3"><div class="dd-cdc-table-empty"><i class="bi bi-inbox"></i><span>暂无数据</span></div></td></tr>';
    } else if (action === 'open-table-modal') {
      var readDatabase = document.getElementById('ddCdcReadDatabase');
      if (!readDatabase || !readDatabase.getAttribute('data-selected-value')) {
        this._showConfigToast(view, '请先选择读端数据库');
        return;
      }
      this._renderCdcAvailableTables('');
      if (modal) { modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false'); }
    } else if (action === 'close-table-modal') {
      if (modal) { modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); }
    } else if (action === 'search-available') {
      var availableSearch = document.getElementById('ddCdcAvailableSearch');
      this._renderCdcAvailableTables(availableSearch ? availableSearch.value : '');
    } else if (action === 'select-all-available') {
      var available = view.querySelectorAll('[data-cdc-available-check]');
      var shouldCheck = Array.prototype.some.call(available, function (item) { return !item.checked; });
      available.forEach(function (item) { item.checked = shouldCheck; });
    } else if (action === 'confirm-add-tables') {
      this._ensureCdcTableState();
      var self = this;
      view.querySelectorAll('[data-cdc-available-check]:checked').forEach(function (item) {
        var found = self._cdcAvailableTables.find(function (table) { return table.name === item.getAttribute('data-cdc-available-check'); });
        if (found && !self._cdcTables.some(function (table) { return table.name === found.name; })) self._cdcTables.push(found);
      });
      this._renderCdcTableConfig(type);
      if (modal) { modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); }
      this._showConfigToast(view, '已添加所选表');
    } else if (action === 'toggle-all-tables') {
      var checks = view.querySelectorAll('[data-cdc-table-check]');
      var allChecked = Array.prototype.every.call(checks, function (item) { return item.checked; });
      checks.forEach(function (item) { item.checked = !allChecked; });
    } else if (action === 'delete-tables') {
      var selected = Array.prototype.map.call(view.querySelectorAll('[data-cdc-table-check]:checked'), function (item) { return item.getAttribute('data-cdc-table-check'); });
      if (!selected.length) { this._showConfigToast(view, '请先选择要删除的表'); return; }
      this._cdcTables = this._cdcTables.filter(function (table) { return selected.indexOf(table.name) < 0; });
      this._renderCdcTableConfig(type);
      this._showConfigToast(view, '已删除所选表');
    } else if (action === 'search-tables') {
      var search = document.getElementById('ddCdcTableSearch');
      this._renderCdcTableConfig(type, search ? search.value : '');
    } else if (action === 'field-mapping') {
      this._showConfigToast(view, '当前使用默认映射');
    } else if (action === 'target-setting') {
      this._showConfigToast(view, '目标表自定义设置已打开');
    } else if (action === 'restore-params') {
      var params = document.getElementById('ddCdcRunParams');
      if (params && params.getAttribute('data-default-value')) params.value = params.getAttribute('data-default-value');
      this._showConfigToast(view, '运行参数已恢复默认');
    } else if (action === 'format-params') {
      var editor = document.getElementById('ddCdcRunParams');
      if (editor) editor.value = editor.value.split('\n').map(function (line) { return line.trim(); }).join('\n');
      this._showConfigToast(view, '运行参数已格式化');
    } else if (action === 'copy-params') {
      var textArea = document.getElementById('ddCdcRunParams');
      if (textArea) this._copyCollectionText(textArea.value, '运行参数已复制');
    } else if (action === 'search-params') {
      this._showConfigToast(view, '参数搜索已开启');
    } else if (action === 'fullscreen-params') {
      var runParam = button.closest('.dd-run-param');
      if (runParam) runParam.classList.toggle('fullscreen');
    }
  },

  _initSupplementViews: function () {
    var self = this;
    var packageView = document.getElementById('ddPackageView');
    var triggerView = document.getElementById('ddTriggerView');
    var streamDesigner = document.getElementById('ddStreamDesignerView');
    var specialViews = [document.getElementById('ddStreamCollectView'), document.getElementById('ddFlinkCdcView')].filter(Boolean);

    if (packageView) {
      packageView.addEventListener('click', function (event) {
        var sideTab = event.target.closest('[data-package-side-tab]');
        if (sideTab) {
          var side = sideTab.getAttribute('data-package-side-tab');
          packageView.querySelectorAll('[data-package-side-tab]').forEach(function (tab) { tab.classList.toggle('active', tab === sideTab); });
          packageView.querySelectorAll('[data-package-side]').forEach(function (panel) { panel.classList.toggle('active', panel.getAttribute('data-package-side') === side); });
          return;
        }
        var action = event.target.closest('[data-config-action]');
        if (action) self._showConfigToast(packageView, action.getAttribute('data-config-action') + '操作已就绪');
      });
    }

    if (triggerView) {
      triggerView.addEventListener('click', function (event) {
        var addButton = event.target.closest('[data-trigger-add]');
        if (addButton) {
          var list = document.getElementById('ddTriggerList');
          if (list) {
            var row = document.createElement('div');
            row.className = 'dd-trigger-row';
            row.innerHTML = '<select><option>数据中台演示</option></select><select><option>项目开发_演示</option></select><select class="wide"><option>门店每日销售指标</option><option>项目开发_共享任务演示</option></select><select><option>V1</option></select><button type="button" data-trigger-remove title="移除"><i class="bi bi-trash3"></i><span>移除</span></button>';
            list.appendChild(row);
          }
          return;
        }
        var removeButton = event.target.closest('[data-trigger-remove]');
        if (removeButton) {
          var rows = triggerView.querySelectorAll('.dd-trigger-row');
          if (rows.length === 1) {
            self._showConfigToast(triggerView, '至少保留一个前置任务');
          } else {
            removeButton.closest('.dd-trigger-row').remove();
          }
          return;
        }
        var action = event.target.closest('[data-config-action]');
        if (action) self._showConfigToast(triggerView, '前置任务配置已保存');
      });
    }

    if (streamDesigner) {
      streamDesigner.addEventListener('click', function (event) {
        var topTab = event.target.closest('.dd-stream-designer-tabs a');
        if (topTab) {
          streamDesigner.querySelectorAll('.dd-stream-designer-tabs a').forEach(function (tab) { tab.classList.toggle('active', tab === topTab); });
          return;
        }
        var sideTab = event.target.closest('[data-stream-design-side-tab]');
        if (sideTab) {
          var side = sideTab.getAttribute('data-stream-design-side-tab');
          streamDesigner.querySelectorAll('[data-stream-design-side-tab]').forEach(function (tab) { tab.classList.toggle('active', tab === sideTab); });
          streamDesigner.querySelectorAll('[data-stream-design-side]').forEach(function (panel) { panel.classList.toggle('active', panel.getAttribute('data-stream-design-side') === side); });
          return;
        }
        var atom = event.target.closest('.dd-atom-list span');
        if (atom) {
          streamDesigner.querySelectorAll('.dd-atom-list span').forEach(function (item) { item.classList.toggle('active', item === atom); });
          return;
        }
        var action = event.target.closest('[data-config-action]');
        if (action) self._showConfigToast(streamDesigner, action.getAttribute('data-config-action') + '操作已就绪');
      });
      var atomSearch = streamDesigner.querySelector('.dd-atom-search input');
      if (atomSearch) atomSearch.addEventListener('input', function () {
        var keyword = atomSearch.value.trim().toLowerCase();
        streamDesigner.querySelectorAll('.dd-atom-list span').forEach(function (item) {
          item.style.display = !keyword || item.textContent.toLowerCase().indexOf(keyword) > -1 ? '' : 'none';
        });
      });
    }

    specialViews.forEach(function (view) {
      view.addEventListener('click', function (event) {
        var tab = event.target.closest('[data-special-tab]');
        if (tab) {
          var target = tab.getAttribute('data-special-tab');
          view.querySelectorAll('[data-special-tab]').forEach(function (item) { item.classList.toggle('active', item === tab); });
          view.querySelectorAll('[data-special-content]').forEach(function (content) { content.style.display = content.getAttribute('data-special-content') === target ? '' : 'none'; });
          return;
        }
        var collectSideTab = event.target.closest('[data-stream-collect-side-tab]');
        if (collectSideTab) {
          var collectSide = collectSideTab.getAttribute('data-stream-collect-side-tab');
          view.querySelectorAll('[data-stream-collect-side-tab]').forEach(function (item) { item.classList.toggle('active', item === collectSideTab); });
          view.querySelectorAll('[data-stream-collect-side]').forEach(function (panel) { panel.classList.toggle('active', panel.getAttribute('data-stream-collect-side') === collectSide); });
          return;
        }
        var cdcSideTab = event.target.closest('[data-cdc-side-tab]');
        if (cdcSideTab) {
          var cdcSide = cdcSideTab.getAttribute('data-cdc-side-tab');
          view.querySelectorAll('[data-cdc-side-tab]').forEach(function (item) { item.classList.toggle('active', item === cdcSideTab); });
          view.querySelectorAll('[data-cdc-side]').forEach(function (panel) { panel.classList.toggle('active', panel.getAttribute('data-cdc-side') === cdcSide); });
          return;
        }
        var cdcDatabaseSearch = event.target.closest('[data-cdc-db-search]');
        if (cdcDatabaseSearch && view.id === 'ddFlinkCdcView') {
          self._setCdcDatabaseTreeOpen(cdcDatabaseSearch.getAttribute('data-cdc-db-search'), true);
          return;
        }
        var cdcAction = event.target.closest('[data-cdc-action]');
        if (cdcAction && view.id === 'ddFlinkCdcView') {
          self._handleCdcAction(cdcAction.getAttribute('data-cdc-action'), cdcAction, view);
          return;
        }
        var action = event.target.closest('[data-config-action]');
        if (action) self._showConfigToast(view, action.getAttribute('data-config-action') + '操作已就绪');
        if (view.id === 'ddFlinkCdcView' && !event.target.closest('.dd-cdc-tree-select')) {
          view.querySelectorAll('.dd-cdc-tree-select.open').forEach(function (item) { self._setCdcDatabaseTreeOpen(item.getAttribute('data-cdc-db-select'), false); });
        }
      });
    });

    var sourceType = self._upgradeDataSourceSelect('ddStreamSourceType');
    var writerType = self._upgradeDataSourceSelect('ddStreamWriterType');
    var syncStreamSource = function () {
      if (!sourceType) return;
      self._renderStreamSourceFields(sourceType.value);
      self._renderStreamFieldMapping(sourceType.value, writerType ? writerType.value : 'Kafka');
    };
    var syncStreamWriter = function () {
      if (!writerType) return;
      self._renderStreamWriterFields(writerType.value);
      self._renderStreamFieldMapping(sourceType ? sourceType.value : 'Kafka', writerType.value);
    };
    if (sourceType) {
      sourceType.addEventListener('change', syncStreamSource);
      syncStreamSource();
    }
    if (writerType) {
      writerType.addEventListener('change', syncStreamWriter);
      syncStreamWriter();
    }

    var cdcView = document.getElementById('ddFlinkCdcView');
    var cdcReadType = self._upgradeDataSourceSelect('ddCdcReadType');
    var cdcWriteType = self._upgradeDataSourceSelect('ddCdcWriteType');
    if (cdcReadType) {
      cdcReadType.addEventListener('change', function () {
        self._cdcTables = [];
        self._renderCdcReadFields(cdcReadType.value);
        self._renderCdcTableConfig(cdcWriteType ? cdcWriteType.value : 'Hive');
      });
      self._renderCdcReadFields(cdcReadType.value);
    }
    if (cdcWriteType) {
      cdcWriteType.addEventListener('change', function () {
        self._cdcTables = [];
        self._renderCdcWriteFields(cdcWriteType.value);
      });
      self._renderCdcWriteFields(cdcWriteType.value);
    }
    if (cdcView) {
      cdcView.addEventListener('input', function (event) {
        if (event.target && event.target.hasAttribute('data-cdc-db-search')) self._filterCdcDatabaseTree(event.target.getAttribute('data-cdc-db-search'), event.target.value);
      });
      cdcView.addEventListener('change', function (event) {
        if (event.target && event.target.id === 'ddCdcNamingRule') {
          self._updateCdcNamingPreview();
          self._renderCdcTableConfig(cdcWriteType ? cdcWriteType.value : 'Hive');
          self._updateCdcLineage();
        }
        if (event.target && event.target.id === 'ddCdcUpdateMark') {
          self._renderCdcTableConfig(cdcWriteType ? cdcWriteType.value : 'Hive');
          self._updateCdcLineage();
        }
      });
      cdcView.addEventListener('keydown', function (event) {
        if (event.key !== 'Enter') return;
        if (event.target && event.target.id === 'ddCdcTableSearch') {
          event.preventDefault();
          self._renderCdcTableConfig(cdcWriteType ? cdcWriteType.value : 'Hive', event.target.value);
        }
        if (event.target && event.target.id === 'ddCdcAvailableSearch') {
          event.preventDefault();
          self._renderCdcAvailableTables(event.target.value);
        }
      });
      var cdcParams = document.getElementById('ddCdcRunParams');
      if (cdcParams) cdcParams.setAttribute('data-default-value', cdcParams.value);
    }
  },

  _renderPackageConfig: function (label, mode) {
    var config = this._packageConfigs[label] || this._packageConfigs['上传程序包子流程1-1'];
    var view = document.getElementById('ddPackageView');
    var isStream = mode === 'stream';
    var name = document.getElementById('ddPackageName');
    var flowType = document.getElementById('ddPackageFlowType');
    var type = document.getElementById('ddPackageProgramType');
    var file = document.getElementById('ddPackageFile');
    var main = document.getElementById('ddPackageMain');
    var entry = document.getElementById('ddPackageClass');
    var args = document.getElementById('ddPackageArgs');
    var description = document.getElementById('ddPackageDescription');
    if (view) {
      view.classList.toggle('stream-mode', isStream);
      view.querySelectorAll('[data-package-stream-only]').forEach(function (item) { item.style.display = isStream ? '' : 'none'; });
      view.querySelectorAll('[data-package-batch-only]').forEach(function (item) { item.style.display = isStream ? 'none' : ''; });
      view.querySelectorAll('[data-package-side-tab]').forEach(function (tab) { tab.classList.toggle('active', tab.getAttribute('data-package-side-tab') === 'basic'); });
      view.querySelectorAll('[data-package-side]').forEach(function (panel) { panel.classList.toggle('active', panel.getAttribute('data-package-side') === 'basic'); });
    }
    if (type) {
      var allowed = isStream ? ['HiveSQL', 'python脚本', 'Sqoop Job', 'Java程序', 'Flink Java', 'ImpalaSQL'] : ['HiveSQL', 'python脚本', 'Sqoop Job', 'Java程序', 'Shell脚本', 'Flink Java', 'ImpalaSQL'];
      type.innerHTML = allowed.map(function (item) { return '<option>' + item + '</option>'; }).join('');
    }
    if (name) name.value = label || '上传程序包子流程';
    if (flowType) flowType.value = config.flowType || (isStream ? '流式数据处理流程' : '批量数据采集流程');
    if (type) type.value = config.type;
    if (file) file.textContent = config.file;
    if (main) main.value = config.main;
    if (entry) entry.value = config.entry;
    if (args) args.value = config.args;
    if (description) description.value = config.description;
  },

  _renderStreamDesigner: function (label, taskName) {
    var config = this._streamDesignConfigs[label] || {
      name: taskName || label || '流式处理流程',
      nodes: ['开始', '读Kafka', '半结构数据解析', '流式写数据库', '结束']
    };
    var nameInput = document.getElementById('ddStreamDesignName');
    var nodeWrap = document.getElementById('ddStreamDesignNodes');
    var edgeSvg = document.getElementById('ddStreamDesignEdges');
    if (nameInput) nameInput.value = taskName || config.name;
    if (!nodeWrap || !edgeSvg) return;

    var width = 860;
    var step = config.nodes.length > 1 ? (width - 140) / (config.nodes.length - 1) : 0;
    var points = [];
    nodeWrap.innerHTML = config.nodes.map(function (node, index) {
      var x = 34 + step * index;
      var y = index > 0 && index < config.nodes.length - 1 ? (index % 2 ? 150 : 250) : 205;
      points.push({ x: x + 60, y: y + 24 });
      var icon = index === 0 ? 'bi-play-fill' : (index === config.nodes.length - 1 ? 'bi-stop-fill' : 'bi-diagram-2');
      return '<button class="dd-stream-atom-node" type="button" style="left:' + x + 'px;top:' + y + 'px"><i class="bi ' + icon + '"></i><span>' + node + '</span></button>';
    }).join('');
    edgeSvg.setAttribute('viewBox', '0 0 860 470');
    edgeSvg.innerHTML = '<defs><marker id="ddStreamArrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,1 L7,4 L0,7 Z"></path></marker></defs>' + points.slice(0, -1).map(function (point, index) {
      var next = points[index + 1];
      var mid = (point.x + next.x) / 2;
      return '<path d="M' + point.x + ',' + point.y + ' C' + mid + ',' + point.y + ' ' + mid + ',' + next.y + ' ' + next.x + ',' + next.y + '" marker-end="url(#ddStreamArrow)"></path>';
    }).join('');
  },

  _renderDesignerPalette: function (mode) {
    var palette = document.querySelector('#ddStreamDesignerView .dd-atom-list');
    if (!palette) return;
    var categories = mode === 'batch' ? {
      '输入': ['读数据库', '读Hive', '读HDFS', '读Kafka'],
      '清洗': ['空值过滤', '字段过滤', '数据去重', '数据标准化'],
      '转换': ['字段定义', '类型转换', '时间转换', '数据分组'],
      '处理': ['数据集关联', '汇总统计', '排序', '自定义SQL'],
      '输出': ['写数据库', '写Hive', '写HDFS', '写Kafka'],
      '模型': ['特征处理', '模型训练', '模型预测']
    } : {
      '输入': ['流式读ES', '流式读kudu', '流式读ActiveMQ', '读数据库', '读kafka', '读HBase', '读MongoDB', '读Hive'],
      '过滤': ['窗口过滤', '空值过滤', '字段过滤', '时间过滤'],
      '抽取': ['时间抽取', '正则提取'],
      '转换': ['半结构数据解析', '字符集转码', '类型转换', '字段定义', '流式数据分列', '合并列', '时间转换', '替换', '空值填充'],
      '处理': ['数据延迟配置', '流式汇总统计', '窗口统计', '流式数据集关联', '数据集合并'],
      '输出': ['流式写kudu', '流式写MongoDB', '流式写HIVE', '流式写HBase', '流式写HDFS', '流式写kafka', '流式写数据库', '流式写Elasticsearch', '流式写ActiveMQ'],
      '自定义': ['获取json中最后一个value', '增加UUID11121']
    };
    palette.innerHTML = Object.keys(categories).map(function (category, index) {
      return '<details' + (index === 0 ? ' open' : '') + '><summary><i class="bi bi-folder-fill"></i>' + category + '</summary>' + categories[category].map(function (item) { return '<span>' + item + '</span>'; }).join('') + '</details>';
    }).join('');
  },

  /* ============================================================
     视图切换：批量流程 ↔ 流式列表 ↔ 各类子流程配置
     ============================================================ */

  _showOnlyView: function (viewId, viewName) {
    ['ddFlowView', 'ddStreamView', 'ddCollectionView', 'ddPackageView', 'ddTriggerView', 'ddStreamDesignerView', 'ddStreamCollectView', 'ddFlinkCdcView', 'ddEditorView'].forEach(function (id) {
      var view = document.getElementById(id);
      if (view) view.style.display = id === viewId ? '' : 'none';
    });
    this._currentView = viewName;
  },

  _switchToFlowView: function () {
    if (this._currentView !== 'flow') this._showOnlyView('ddFlowView', 'flow');
    this._showFlowProperties();
    if (this._canvasState) {
      this._canvasState.canvas.querySelectorAll('.dd-node.selected').forEach(function (node) { node.classList.remove('selected'); });
    }
  },

  _switchToStreamView: function () {
    if (this._currentView === 'stream') return;
    this._showOnlyView('ddStreamView', 'stream');
    this._renderStreamList();
  },

  _switchToCollectionView: function (label) {
    this._showOnlyView('ddCollectionView', 'collection');
    var name = label || '数据采集子流程';
    var nameInput = document.getElementById('ddCollectionName');
    var lineageName = document.getElementById('ddCollectionLineageName');
    var description = document.getElementById('ddCollectionDescription');
    var readType = 'MySQL';
    var writeType = 'Hive';
    var config = {
      source: 't_order_detail',
      target: 'ods_order_detail',
      sourcePath: '业务系统 → 订单中心',
      targetPath: 'ODS-贴源层 → 中电数智_ODS',
      description: '将订单中心的订单明细采集至ODS贴源层。'
    };
    if (name.indexOf('FTP') > -1) {
      readType = 'FTP';
      config = { source: 'order_*.csv', target: 'ods_sales_order', sourcePath: '采集文件服务器 → /data/retail/order/', targetPath: 'ODS-贴源层 → 中电数智_ODS', description: '读取门店订单交换文件并写入ODS贴源层。' };
    }
    if (name.indexOf('Http') > -1 || name.indexOf('HTTP') > -1) {
      readType = 'Http';
      config = { source: '订单增量查询', target: 'ods_sales_order', sourcePath: '供应链协同系统 → 订单服务', targetPath: 'ODS-贴源层 → 中电数智_ODS', description: '通过供应链协同接口获取订单增量数据。' };
    }
    if (name.indexOf('HDFS') > -1) {
      writeType = 'HDFS';
      config = { source: 't_sales_order', target: 'order_${biz_date}.parquet', sourcePath: '业务系统 → 测试业务系统', targetPath: '数据湖存储 → /warehouse/dwd/order/', description: '读取销售订单并按业务日期写入HDFS目录。' };
    }
    if (name.indexOf('Kafka') > -1) {
      writeType = 'Kafka';
      config = { source: 't_sales_order', target: 'dwd_order_event', sourcePath: '业务系统 → 测试业务系统', targetPath: '实时消息平台 → 订单主题', description: '读取订单明细并写入Kafka订单事件主题。' };
    }
    if (name.indexOf('HBase') > -1) {
      readType = 'HBase';
      writeType = 'HBase';
      config = { source: 'member_tag', target: 'member_tag_archive', sourcePath: '实时业务库 → hbase_member', targetPath: '标签归档库 → hbase_archive', description: '读取会员标签列族并写入HBase归档表。' };
    }
    if (name.indexOf('质量规则') > -1) config = { source: 'dq_rule_audit_result', target: 'dwd_quality_audit_result', sourcePath: '数据质量 → 稽查结果', targetPath: 'DWD-数据明细层 → DWD_数据', description: '采集质量规则稽查结果并写入质量问题明细表。' };
    if (name.indexOf('数据标化') > -1) config = { source: 'ods_order_detail', target: 'dwd_order_detail_standard', sourcePath: 'ODS-贴源层 → 中电数智_ODS', targetPath: 'DWD-数据明细层 → DWD_数据', description: '按数据标准统一订单编码、状态与业务口径。' };
    if (name.indexOf('共享') > -1) config.description = '复用订单明细采集任务，供共享业务流程调用。';
    var readTypeControl = document.getElementById('ddCollectionReadType');
    var writeTypeControl = document.getElementById('ddCollectionWriteType');
    if (readTypeControl) {
      readTypeControl.value = readType;
      this._syncDataSourceSelectControl(readTypeControl);
    }
    if (writeTypeControl) {
      writeTypeControl.value = writeType;
      this._syncDataSourceSelectControl(writeTypeControl);
    }
    this._collectionState.sourcePath = config.sourcePath;
    this._collectionState.sourceTables = [config.source];
    this._collectionState.sourceTable = config.source;
    this._collectionState.databasePath = config.targetPath;
    this._collectionState.targetTables = [config.target];
    this._collectionState.targetTable = config.target;
    this._renderCollectionReadFields(readType);
    this._renderCollectionWriteFields(writeType);
    this._applyCollectionFieldPreset(readType);
    this._updateCollectionLinkage();
    if (nameInput) nameInput.value = name;
    if (lineageName) lineageName.textContent = name;
    if (description) description.value = config.description;
  },

  _switchToPackageView: function (label, mode) {
    this._showOnlyView('ddPackageView', 'package');
    this._renderPackageConfig(label, mode || 'batch');
  },

  _switchToTriggerView: function (label) {
    this._showOnlyView('ddTriggerView', 'trigger');
    var name = document.getElementById('ddTriggerName');
    if (name) name.value = label || '前置任务';
  },

  _switchToStreamDesignerView: function (label, taskName, mode) {
    this._showOnlyView('ddStreamDesignerView', 'stream-design');
    var view = document.getElementById('ddStreamDesignerView');
    if (view) view.classList.toggle('batch-mode', mode === 'batch');
    this._renderDesignerPalette(mode === 'batch' ? 'batch' : 'stream');
    this._renderStreamDesigner(label, taskName);
  },

  _switchToStreamCollectView: function (label) {
    this._showOnlyView('ddStreamCollectView', 'stream-collect');
    var name = document.getElementById('ddStreamCollectName');
    var processName = label || '流式数据采集流程';
    var sourceType = 'Kafka';
    var writerType = 'Kafka';
    if (processName.indexOf('ActiveMQ') > -1) {
      sourceType = 'activeMq';
      writerType = 'activeMq';
    } else if (processName.indexOf('RabbitMQ') > -1) {
      sourceType = 'Rabbitmq';
      writerType = 'Rabbitmq';
    } else if (processName.indexOf('数据库') > -1) {
      sourceType = 'MySQL';
      writerType = 'MySQL';
    }
    var sourceControl = document.getElementById('ddStreamSourceType');
    var writerControl = document.getElementById('ddStreamWriterType');
    if (sourceControl) {
      sourceControl.value = sourceType;
      this._syncDataSourceSelectControl(sourceControl);
    }
    if (writerControl) {
      writerControl.value = writerType;
      this._syncDataSourceSelectControl(writerControl);
    }
    this._renderStreamSourceFields(sourceType);
    this._renderStreamWriterFields(writerType);
    this._renderStreamFieldMapping(sourceType, writerType);
    if (name) name.value = processName;
    var lineageProcess = document.getElementById('ddStreamLineageProcess');
    if (lineageProcess) lineageProcess.textContent = processName;
  },

  _switchToFlinkCdcView: function (label) {
    this._showOnlyView('ddFlinkCdcView', 'stream-cdc');
    var name = document.getElementById('ddFlinkCdcName');
    var process = document.getElementById('ddCdcLineageProcess');
    var value = label || '数据同步(Flink CDC)';
    if (name) name.value = value;
    if (process) process.textContent = value;
    this._updateCdcLineage();
  },

  _switchToEditorView: function (label, record, mode) {
    this._showOnlyView('ddEditorView', 'editor');
    var view = document.getElementById('ddEditorView');
    var isStream = mode === 'stream';
    if (view) {
      view.classList.toggle('stream-mode', isStream);
      view.querySelectorAll('[data-editor-stream-only]').forEach(function (item) { item.style.display = isStream ? '' : 'none'; });
      view.querySelectorAll('[data-editor-batch-only]').forEach(function (item) { item.style.display = isStream ? 'none' : ''; });
      var configTab = view.querySelector('[data-editor-tab="config"]');
      var logTab = view.querySelector('[data-editor-tab="log"]');
      var impactTab = view.querySelector('[data-editor-tab="impact"]');
      var saveButton = view.querySelector('[data-editor-action="save"]');
      var executeButton = view.querySelector('[data-editor-action="execute"]');
      if (configTab) configTab.textContent = isStream ? '流程定制' : '流程配置';
      if (logTab) logTab.textContent = isStream ? '测试日志' : '执行记录';
      if (impactTab) impactTab.style.display = isStream ? 'none' : '';
      if (saveButton) saveButton.style.display = isStream ? 'none' : '';
      if (executeButton) executeButton.textContent = isStream ? '执行' : '调试执行';
      var programType = view.querySelector('[data-editor-program-type]');
      if (programType) {
        var allowedTypes = isStream ? ['HiveSQL', 'python脚本', 'Sqoop Job', '存储过程', 'FlinkSQL', 'ImpalaSQL'] : ['HiveSQL', 'python脚本', 'Sqoop Job', '存储过程', 'Shell脚本', 'SQL', 'FlinkSQL', 'ImpalaSQL'];
        programType.innerHTML = allowedTypes.map(function (type) { return '<option>' + type + '</option>'; }).join('');
      }
      var strip = view.querySelector('.dd-editor-sidebar .dd-sidebar-strip');
      if (strip) {
        var tabMap = {};
        strip.querySelectorAll('[data-sidebar-tab]').forEach(function (tab) { tabMap[tab.getAttribute('data-sidebar-tab')] = tab; });
        (isStream ? ['basic', 'version', 'lineage', 'params', 'dependency'] : ['basic', 'params', 'version', 'lineage', 'dependency']).forEach(function (key) {
          if (tabMap[key]) strip.appendChild(tabMap[key]);
        });
        if (tabMap.params) tabMap.params.textContent = isStream ? '参数' : '参数设置';
        if (tabMap.version) tabMap.version.textContent = isStream ? '版本信息' : '版本管理';
      }
    }
    this._renderEditorContent(label, record, mode || 'batch');
  },

  _findCodeRecord: function (opts) {
    if (!window.DP.developmentCodeRecords) return null;
    opts = opts || {};
    return DP.developmentCodeRecords.find(function (record) {
      if (opts.recordId) return record.id === opts.recordId;
      return record.project === opts.project &&
        record.environment === opts.environment &&
        record.businessFlowId === opts.flowId &&
        record.subflowId === opts.subflowId;
    }) || null;
  },

  _openTarget: function (opts) {
    var container = document.getElementById('ddTreeContent');
    if (!container) return;
    var record = this._findCodeRecord(opts);
    var targetId = opts.subflowId || (record && record.subflowId);
    var targetNode = Array.prototype.find.call(container.querySelectorAll('.dd-tree-node'), function (node) {
      return node.getAttribute('data-node-id') === targetId;
    });
    if (!targetNode) return;

    var branch = targetNode.closest('.dd-tree-children');
    while (branch) {
      branch.classList.add('open');
      var parentNode = branch.previousElementSibling;
      if (parentNode) {
        var arrow = parentNode.querySelector('.dd-tree-arrow');
        if (arrow) arrow.classList.add('open');
      }
      branch = branch.parentElement ? branch.parentElement.closest('.dd-tree-children') : null;
    }

    container.querySelectorAll('.dd-tree-node.active').forEach(function (node) { node.classList.remove('active'); });
    targetNode.classList.add('active');
    targetNode.scrollIntoView({ block: 'center' });
    this._switchToEditorView(targetNode.getAttribute('data-label'), record);

    var targetLine = parseInt(opts.line, 10);
    if (!isNaN(targetLine) && targetLine > 0) {
      var gutterLines = document.querySelectorAll('#ddCodeGutter > div');
      gutterLines.forEach(function (line) { line.classList.remove('dd-code-gutter-line-active'); });
      if (gutterLines[targetLine - 1]) gutterLines[targetLine - 1].classList.add('dd-code-gutter-line-active');
      var editorWrap = document.querySelector('.dd-code-editor-wrap');
      if (editorWrap) editorWrap.scrollTop = Math.max(0, (targetLine - 1) * 22 - 110);
    }
  },

  /* ---- 渲染编辑器内容 ---- */
  _renderEditorContent: function (label, record, mode) {
    var baseContent = mode === 'stream' ? this._streamEditorConfigs[label] : this._editorContents[label];
    var content = record ? {
      code: record.code,
      language: record.language || (baseContent && baseContent.language) || 'SQL',
      description: record.description || (baseContent && baseContent.description) || '',
      output: record.id === 'code-batch-dev-sql' && baseContent ? baseContent.output : null
    } : baseContent;
    var gutter = document.getElementById('ddCodeGutter');
    var codeEl = document.getElementById('ddCodeContent');
    var output = document.getElementById('ddEditorOutput');

    if (!content) {
      if (gutter) gutter.innerHTML = '<div>1</div><div>2</div>';
      if (codeEl) codeEl.innerHTML = this._highlightSQL('-- ' + label + '\n-- 暂未配置编辑内容，敬请期待');
      if (output) output.innerHTML = '<div class="out-time">> 等待执行...</div>';
      return;
    }

    var lines = content.code.split('\n');
    if (gutter) {
      var gh = '';
      for (var i = 0; i < lines.length; i++) gh += '<div>' + (i + 1) + '</div>';
      gutter.innerHTML = gh;
    }
    if (codeEl) {
      codeEl.setAttribute('data-language', content.language || 'SQL');
      codeEl.innerHTML = this._highlightEditorCode(content.code, content.language || 'SQL');
    }
    if (output && content.output) {
      var oh = '';
      content.output.forEach(function (item) {
        if (item.type === 'empty') {
          oh += '<div>&nbsp;</div>';
        } else {
          oh += '<div class="out-' + item.type + '">' + item.text + '</div>';
        }
      });
      output.innerHTML = oh;
    } else if (output) {
      output.innerHTML = '<div class="out-time">' + (record ? '> 已从代码检索定位到当前代码，等待执行...' : '> 等待执行...') + '</div>';
    }

    var basicPanel = document.querySelector('.dd-sidebar-panel[data-sidebar="basic"]');
    if (basicPanel) {
      var nameInput = basicPanel.querySelector('.dd-prop-input[type="text"]');
      if (nameInput) nameInput.value = label;
      var programType = basicPanel.querySelector('[data-editor-program-type]');
      if (programType) {
        var language = content.language || 'SQL';
        if (language === 'Flink SQL') language = 'FlinkSQL';
        if (language === 'Shell') language = 'Shell脚本';
        if (language === 'Python') language = mode === 'stream' ? 'python脚本' : 'python脚本';
        programType.value = language;
      }
      var description = basicPanel.querySelector('textarea.dd-prop-input');
      if (description) description.value = content.description || '';
    }

    document.querySelectorAll('#ddEditorView .dd-sb-title').forEach(function (title) {
      if (title.closest('[data-sidebar="dependency"]')) return;
      title.textContent = label;
    });
  },

  _highlightEditorCode: function (code, language) {
    if (language === 'Python' || language === 'python脚本' || language === 'Shell脚本' || language === 'Sqoop Job') {
      var plain = code
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      plain = plain.replace(/(^|\n)(\s*#[^\n]*)/g, '$1<span class="sql-comment">$2</span>');
      plain = plain.replace(/(\$\{[^}]+\})/g, '<span class="sql-var">$1</span>');
      return plain;
    }
    return this._highlightSQL(code);
  },

  /* ---- 简易 SQL 语法高亮 ---- */
  _highlightSQL: function (code) {
    var h = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    h = h.replace(/(\/\/[^\n]*)/g, '<span class="sql-comment">$1</span>');
    h = h.replace(/(\/\*[\s\S]*?\*\/|\/\*[\s\S]*$)/g, '<span class="sql-comment">$1</span>');
    h = h.replace(/('[^']*')/g, '<span class="sql-string">$1</span>');
    h = h.replace(/(\$\{[^}]+\})/g, '<span class="sql-var">$1</span>');
    h = h.replace(/\b(SET|CREATE|TABLE|WITH|SELECT|FROM|INSERT|INTO|VALUES|WHERE|AND|OR|NOT|NULL|AS|VARCHAR|INT|BIGINT|FLOAT|DOUBLE|DECIMAL|DATE|BOOLEAN)\b/gi,
      '<span class="sql-keyword">$1</span>');
    return h;
  },

  /* ---- 编辑器右键菜单（含 AI 助手子菜单） ---- */
  _initEditorContextMenu: function () {
    var menu = document.createElement('div');
    menu.className = 'dd-ctx-menu dd-editor-ctx';
    menu.id = 'ddEditorCtxMenu';
    menu.innerHTML =
      '<div class="dd-ctx-menu-title">右键</div>' +
      '<div class="dd-ctx-divider"></div>' +
      '<div class="dd-ctx-menu-item"><i class="bi bi-clipboard"></i>复制</div>' +
      '<div class="dd-ctx-menu-item"><i class="bi bi-clipboard-check"></i>粘贴</div>' +
      '<div class="dd-ctx-submenu-wrap">' +
        '<div class="dd-ctx-menu-item"><i class="bi bi-robot"></i>AI 助手<span class="sub-arrow"><i class="bi bi-chevron-right"></i></span></div>' +
        '<div class="dd-ctx-submenu">' +
          '<div class="dd-ctx-menu-item dd-ai-trigger" data-ai-action="generate">SQL 生成</div>' +
          '<div class="dd-ctx-menu-item dd-ai-trigger" data-ai-action="rewrite">SQL 改写</div>' +
          '<div class="dd-ctx-menu-item dd-ai-trigger" data-ai-action="optimize">SQL 优化</div>' +
          '<div class="dd-ctx-menu-item dd-ai-trigger" data-ai-action="fix">SQL 纠错</div>' +
          '<div class="dd-ctx-menu-item dd-ai-trigger" data-ai-action="comment">SQL 注释</div>' +
          '<div class="dd-ctx-menu-item dd-ai-trigger" data-ai-action="explain">SQL 解释</div>' +
          '<div class="dd-ctx-menu-item dd-ai-trigger" data-ai-action="test">代码测试</div>' +
          '<div class="dd-ctx-menu-item dd-ai-trigger" data-ai-action="qa">代码问答</div>' +
        '</div>' +
      '</div>' +
      '<div class="dd-ctx-divider"></div>' +
      '<div class="dd-ctx-menu-item danger"><i class="bi bi-trash3"></i>删除</div>';
    document.body.appendChild(menu);

    var codeArea = document.getElementById('ddCodeArea');
    if (codeArea) {
      codeArea.addEventListener('contextmenu', function (e) {
        e.preventDefault();
        e.stopPropagation();
        _showMenu(menu, e.clientX, e.clientY);
      });
    }

    menu.querySelectorAll('.dd-ctx-menu-item').forEach(function (item) {
      if (!item.closest('.dd-ctx-submenu-wrap') || item.closest('.dd-ctx-submenu')) {
        item.addEventListener('click', function () { menu.classList.remove('show'); });
      }
    });

    var self = this;
    menu.querySelectorAll('.dd-ai-trigger').forEach(function (item) {
      item.addEventListener('click', function () {
        var action = item.getAttribute('data-ai-action');
        self._triggerAiAssistant(action);
      });
    });
  },

  _aiQuestionMap: {
    generate: 'SQL生成：帮我写一段SQL，查询dwd_ec__trd_create_ord__di表中，从2025年1月1日至2025年3月31日每个spu的销售额',
    rewrite: 'SQL改写：帮我把这段SQL改写一下，将列转置为行',
    optimize: '代码优化：帮我优化下这段SQL',
    fix: 'SQL纠错：帮我检查并修正这段SQL中的语法错误',
    comment: '生成注释：帮我为以下SQL的字段添加注释',
    explain: '帮我解释下这段SQL的含义',
    test: '代码测试：帮我生成这段SQL的测试用例',
    qa: '代码问答：这段SQL的执行逻辑是什么，有什么性能风险'
  },

  _triggerAiAssistant: function (action) {
    var question = this._aiQuestionMap[action];
    if (!question) return;
    if (typeof DP.openAiAndAsk === 'function') {
      DP.openAiAndAsk(question);
    }
  },

  /* ---- 编辑器底部面板拖拽调整高度 ---- */
  _initColResize: function () {
    function makeColResize(handleId, leftEl, prop, minW, maxW) {
      var handle = document.getElementById(handleId);
      if (!handle || !leftEl) return;
      handle.addEventListener('mousedown', function (e) {
        e.preventDefault();
        var startX = e.clientX;
        var startW = leftEl.offsetWidth;
        handle.classList.add('dragging');
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
        function onMove(ev) {
          var dx = ev.clientX - startX;
          var next = Math.max(minW, Math.min(maxW, startW + dx));
          leftEl.style[prop] = next + 'px';
        }
        function onUp() {
          handle.classList.remove('dragging');
          document.body.style.cursor = '';
          document.body.style.userSelect = '';
          document.removeEventListener('mousemove', onMove);
          document.removeEventListener('mouseup', onUp);
        }
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
      });
    }

    var treePanel = document.querySelector('.dd-tree-panel.dd-left-panel');
    makeColResize('ddResizeLeft', treePanel, 'width', 160, 400);

    var sidebar = document.querySelector('.dd-sidebar-content');
    var sidebarHandle = document.getElementById('ddResizeRight');
    if (sidebarHandle && sidebar) {
      sidebarHandle.addEventListener('mousedown', function (e) {
        e.preventDefault();
        var startX = e.clientX;
        var startW = sidebar.offsetWidth;
        sidebarHandle.classList.add('dragging');
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
        function onMove(ev) {
          var dx = startX - ev.clientX;
          var next = Math.max(200, Math.min(600, startW + dx));
          sidebar.style.width = next + 'px';
        }
        function onUp() {
          sidebarHandle.classList.remove('dragging');
          document.body.style.cursor = '';
          document.body.style.userSelect = '';
          document.removeEventListener('mousemove', onMove);
          document.removeEventListener('mouseup', onUp);
        }
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
      });
    }

    var collectionSidebar = document.querySelector('.dd-collection-sidebar-content');
    var collectionHandle = document.getElementById('ddCollectionResizeProps');
    if (collectionHandle && collectionSidebar) {
      collectionHandle.addEventListener('mousedown', function (e) {
        e.preventDefault();
        var startX = e.clientX;
        var startW = collectionSidebar.offsetWidth;
        collectionHandle.classList.add('dragging');
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
        function onMove(ev) {
          var dx = startX - ev.clientX;
          var next = Math.max(240, Math.min(960, startW + dx));
          collectionSidebar.style.width = next + 'px';
        }
        function onUp() {
          collectionHandle.classList.remove('dragging');
          document.body.style.cursor = '';
          document.body.style.userSelect = '';
          document.removeEventListener('mousemove', onMove);
          document.removeEventListener('mouseup', onUp);
        }
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
      });
    }

    function bindRightResize(handleId, sidebarSelector) {
      var handle = document.getElementById(handleId);
      var sidebar = document.querySelector(sidebarSelector);
      if (!handle || !sidebar) return;
      handle.addEventListener('mousedown', function (e) {
        e.preventDefault();
        var startX = e.clientX;
        var startW = sidebar.offsetWidth;
        handle.classList.add('dragging');
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
        function onMove(ev) {
          var next = Math.max(270, Math.min(760, startW + startX - ev.clientX));
          sidebar.style.width = next + 'px';
        }
        function onUp() {
          handle.classList.remove('dragging');
          document.body.style.cursor = '';
          document.body.style.userSelect = '';
          document.removeEventListener('mousemove', onMove);
          document.removeEventListener('mouseup', onUp);
        }
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
      });
    }
    bindRightResize('ddStreamCollectResize', '#ddStreamCollectView .dd-special-sidebar');
    bindRightResize('ddFlinkCdcResize', '#ddFlinkCdcView .dd-special-sidebar');
  },

  _initCodeToolbar: function () {
    var themeSel = document.getElementById('ddCtTheme');
    if (themeSel) {
      themeSel.addEventListener('change', function () {
        var area = document.getElementById('ddCodeArea');
        if (!area) return;
        if (themeSel.value === 'light') {
          area.classList.add('theme-light');
        } else {
          area.classList.remove('theme-light');
        }
      });
    }

    var searchBtn = document.getElementById('ddCtSearch');
    var searchbar = document.getElementById('ddCodeSearchbar');
    var closeBtn = document.getElementById('ddCsClose');
    if (searchBtn && searchbar) {
      searchBtn.addEventListener('click', function () {
        var isHidden = searchbar.style.display === 'none' || !searchbar.style.display;
        searchbar.style.display = isHidden ? 'flex' : 'none';
        if (isHidden) {
          var firstInput = searchbar.querySelector('.dd-cs-input');
          if (firstInput) firstInput.focus();
        }
      });
    }
    if (closeBtn && searchbar) {
      closeBtn.addEventListener('click', function () { searchbar.style.display = 'none'; });
    }

    var fontSel = document.getElementById('ddCtFontSize');
    if (fontSel) {
      fontSel.addEventListener('change', function () {
        var area = document.getElementById('ddCodeArea');
        if (area) area.style.fontSize = fontSel.value;
      });
    }

    var formatBtn = document.getElementById('ddCtFormat');
    if (formatBtn) {
      formatBtn.addEventListener('click', function () {
        var codeEl = document.getElementById('ddCodeContent');
        if (!codeEl) return;
        var text = codeEl.innerText || '';
        var language = codeEl.getAttribute('data-language') || 'SQL';
        var keywords = ['SELECT','FROM','WHERE','AND','OR','INSERT','INTO','VALUES','SET','CREATE','TABLE','WITH','AS','NOT','NULL','ORDER','BY','GROUP','HAVING','JOIN','LEFT','RIGHT','INNER','ON','LIMIT','UNION','ALL'];
        var formatted = text.replace(/\r\n/g, '\n');
        if (language !== 'Python' && language !== 'Shell脚本' && language !== 'Sqoop Job') {
          keywords.forEach(function (kw) {
            formatted = formatted.replace(new RegExp('\\b' + kw + '\\b', 'gi'), kw);
          });
        }
        codeEl.innerHTML = window.DataDevelop._highlightEditorCode(formatted, language);
        var gutterEl = document.getElementById('ddCodeGutter');
        if (gutterEl) {
          var lines = formatted.split('\n');
          var gh = '';
          for (var i = 0; i < lines.length; i++) gh += '<div>' + (i + 1) + '</div>';
          gutterEl.innerHTML = gh;
        }
      });
    }

    var copyBtn = document.getElementById('ddCtCopy');
    if (copyBtn) {
      copyBtn.addEventListener('click', function () {
        var codeEl = document.getElementById('ddCodeContent');
        if (!codeEl) return;
        var text = codeEl.innerText || codeEl.textContent;
        if (navigator.clipboard) {
          navigator.clipboard.writeText(text).then(function () {
            copyBtn.innerHTML = '<i class="bi bi-check2"></i> 已复制';
            setTimeout(function () {
              copyBtn.innerHTML = '<i class="bi bi-clipboard"></i> 复制';
            }, 1500);
          }).catch(function () {});
        }
      });
    }

    var fullBtn = document.getElementById('ddCtFullscreen');
    if (fullBtn) {
      fullBtn.addEventListener('click', function () {
        var area = document.getElementById('ddCodeArea');
        if (!area) return;
        if (!document.fullscreenElement) {
          area.requestFullscreen().catch(function () {});
          fullBtn.innerHTML = '<i class="bi bi-fullscreen-exit"></i> 退出';
        } else {
          document.exitFullscreen();
          fullBtn.innerHTML = '<i class="bi bi-arrows-fullscreen"></i> 全屏';
        }
      });
      document.addEventListener('fullscreenchange', function () {
        if (!document.fullscreenElement) {
          fullBtn.innerHTML = '<i class="bi bi-arrows-fullscreen"></i> 全屏';
        }
      });
    }

    var codeEl = document.getElementById('ddCodeContent');
    var gutterEl = document.getElementById('ddCodeGutter');
    if (codeEl && gutterEl) {
      codeEl.addEventListener('input', function () {
        var text = codeEl.innerText || '';
        var lines = text.split('\n');
        var gh = '';
        for (var i = 0; i < lines.length; i++) gh += '<div>' + (i + 1) + '</div>';
        gutterEl.innerHTML = gh;
      });

      var wrap = document.querySelector('.dd-code-editor-wrap');
      if (wrap) {
        codeEl.addEventListener('scroll', function () { gutterEl.scrollTop = codeEl.scrollTop; });
        wrap.addEventListener('scroll', function () { gutterEl.style.top = wrap.scrollTop + 'px'; });
      }
    }
  },

  _initEditorBottomResize: function () {
    var handle = document.getElementById('ddEditorResize');
    var bottom = document.getElementById('ddEditorBottom');
    if (!handle || !bottom) return;

    handle.addEventListener('mousedown', function (e) {
      e.preventDefault();
      var startY = e.clientY;
      var startH = bottom.offsetHeight;
      document.body.style.cursor = 'ns-resize';
      document.body.style.userSelect = 'none';

      function onMove(ev) {
        var dy = startY - ev.clientY;
        var next = Math.max(80, Math.min(500, startH + dy));
        bottom.style.height = next + 'px';
      }
      function onUp() {
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
      }
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    });
  },

  /* ---- 编辑器右侧 Sidebar Tab 切换 ---- */
  _initEditorSidebarTabs: function () {
    var strip = document.querySelector('.dd-editor-sidebar .dd-sidebar-strip');
    if (!strip) return;
    var content = document.getElementById('ddSidebarContent');
    strip.addEventListener('click', function (e) {
      var tab = e.target.closest('.dd-sidebar-tab');
      if (!tab) return;
      var key = tab.getAttribute('data-sidebar-tab');
      strip.querySelectorAll('.dd-sidebar-tab').forEach(function (t) { t.classList.remove('active'); });
      tab.classList.add('active');
      if (content) {
        content.querySelectorAll('.dd-sidebar-panel').forEach(function (p) { p.classList.remove('active'); });
        var target = content.querySelector('[data-sidebar="' + key + '"]');
        if (target) target.classList.add('active');
      }
    });
  },

  /* ---- 编辑器底部 Tab 切换 ---- */
  _initEditorBottomTabs: function () {
    var tabBar = document.querySelector('.dd-editor-bottom-tabs');
    if (!tabBar) return;
    tabBar.addEventListener('click', function (e) {
      var tab = e.target.closest('.dd-bottom-tab');
      if (!tab) return;
      tabBar.querySelectorAll('.dd-bottom-tab').forEach(function (t) { t.classList.remove('active'); });
      tab.classList.add('active');
    });
  },

  _initPropsTabs: function () {
    var strip = document.querySelector('.dd-props-strip');
    if (!strip) return;
    var body = document.querySelector('.dd-props-body');
    strip.addEventListener('click', function (e) {
      var tab = e.target.closest('.dd-sidebar-tab');
      if (!tab) return;
      var key = tab.getAttribute('data-props-tab');
      if (!key) return;
      strip.querySelectorAll('.dd-sidebar-tab').forEach(function (t) { t.classList.remove('active'); });
      tab.classList.add('active');
      if (body) {
        body.querySelectorAll('.dd-props-tab-content').forEach(function (c) { c.classList.remove('active'); });
        var target = body.querySelector('[data-props-content="' + key + '"]');
        if (target) target.classList.add('active');
      }
    });

    var propsPanel = document.querySelector('.dd-props-panel');
    var handle = document.getElementById('ddResizeProps');
    if (handle && propsPanel) {
      handle.addEventListener('mousedown', function (e) {
        e.preventDefault();
        var startX = e.clientX;
        var startW = propsPanel.offsetWidth;
        handle.classList.add('dragging');
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
        function onMove(ev) {
          var dx = startX - ev.clientX;
          var next = Math.max(200, Math.min(800, startW + dx));
          propsPanel.style.width = next + 'px';
        }
        function onUp() {
          handle.classList.remove('dragging');
          document.body.style.cursor = '';
          document.body.style.userSelect = '';
          document.removeEventListener('mousemove', onMove);
          document.removeEventListener('mouseup', onUp);
        }
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
      });
    }
  }
};

/* ---- 共用：显示/隐藏右键菜单 ---- */
function _showMenu(menu, x, y) {
  document.querySelectorAll('.dd-ctx-menu.show').forEach(function (m) { m.classList.remove('show'); });
  menu.classList.add('show');
  var mw = menu.offsetWidth || 168;
  var mh = menu.offsetHeight || 200;
  if (x + mw > window.innerWidth) x = window.innerWidth - mw - 8;
  if (y + mh > window.innerHeight) y = window.innerHeight - mh - 8;
  menu.style.left = x + 'px';
  menu.style.top = y + 'px';
}

document.addEventListener('click', function () {
  document.querySelectorAll('.dd-ctx-menu.show').forEach(function (m) { m.classList.remove('show'); });
});
