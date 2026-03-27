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
              '<button class="btn btn-primary">启动调度</button>' +
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
              '<div class="dd-canvas" id="ddCanvas"></div>' +
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
                      '<tr><td>V1.0</td><td>未配置</td><td>--</td><td>否</td><td>未共享</td><td>深圳数据</td><td><a class="dd-sb-link">共享</a> | <a class="dd-sb-link">启动调度</a> | <a class="dd-sb-link">发布接口</a> | <a class="dd-sb-link text-danger">删除</a></td></tr>' +
                      '<tr><td>V2.0</td><td><span style="color:#fa8c16">未启动</span></td><td><span style="color:var(--primary)">每天 18:30:01</span></td><td>否</td><td>未共享</td><td>广州数据</td><td><a class="dd-sb-link">共享</a> | <a class="dd-sb-link">启动调度</a> | <a class="dd-sb-link">发布接口</a> | <a class="dd-sb-link text-danger">删除</a></td></tr>' +
                      '<tr><td>V3.0</td><td><span style="color:#52c41a">已启动</span></td><td><span style="color:var(--primary)">触发执行</span></td><td>是</td><td><span style="color:#52c41a">已共享</span></td><td>佛山数据</td><td><a class="dd-sb-link text-danger">停止共享</a> | <a class="dd-sb-link text-danger">停止调度</a> | <a class="dd-sb-link text-danger">停止接口</a></td></tr>' +
                    '</tbody>' +
                  '</table>' +
                  '<div class="dd-sb-pagination">' +
                    '<a>上一页</a><span class="dd-page active">1</span><span class="dd-page">2</span><span class="dd-page">3</span><span class="dd-page">4</span><span class="dd-page">5</span><span>...</span><span class="dd-page">89</span><a>下一页</a>' +
                  '</div>' +
                '</div>' +

              '</div>' +
              '<div class="dd-props-strip">' +
                '<div class="dd-sidebar-tab active" data-props-tab="basic">基本信息</div>' +
                '<div class="dd-sidebar-tab" data-props-tab="params">参数设置</div>' +
                '<div class="dd-sidebar-tab" data-props-tab="version">版本管理</div>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +

        /* --- 编辑器视图（隐藏） --- */
        '<div class="dd-editor-panel" id="ddEditorView" style="display:none">' +
          '<div class="dd-editor-left">' +
            '<div class="dd-header dd-header-editor">' +
              '<div class="dd-tabs">' +
                '<a class="dd-tab active">流程配置</a>' +
                '<a class="dd-tab">执行记录</a>' +
                '<a class="dd-tab">影响分析</a>' +
              '</div>' +
              '<div class="dd-actions">' +
                '<button class="btn btn-primary"><i class="bi bi-box-arrow-in-down"></i> 导入</button>' +
                '<button class="btn btn-primary"><i class="bi bi-box-arrow-up"></i> 导出</button>' +
                '<button class="btn btn-primary"><i class="bi bi-save"></i> 保存</button>' +
                '<button class="btn">调试执行</button>' +
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
                '<div class="dd-prop-group"><div class="dd-prop-label">*程序类型：</div><select class="dd-prop-select"><option>SQL</option><option>Python</option><option>Shell</option></select></div>' +
                '<div class="dd-prop-group"><div class="dd-prop-label">*执行环境：</div><select class="dd-prop-select"><option>一级目录1/二级目录1-2/DBnamexxxx</option></select></div>' +
                '<div class="dd-prop-group"><div class="dd-prop-label">备注：</div><textarea class="dd-prop-input" placeholder="200个字符以内"></textarea></div>' +
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

            '</div>' +
            '<div class="dd-sidebar-strip">' +
              '<div class="dd-sidebar-tab active" data-sidebar-tab="basic">基本信息</div>' +
              '<div class="dd-sidebar-tab" data-sidebar-tab="params">参数设置</div>' +
              '<div class="dd-sidebar-tab" data-sidebar-tab="version">版本管理</div>' +
              '<div class="dd-sidebar-tab" data-sidebar-tab="lineage">血缘关系</div>' +
            '</div>' +
          '</div>' + /* dd-editor-sidebar */
        '</div>' +

      '</div>' + /* dd-right-panel */

    '</div>' + /* dd-body */
  '</div>',

  /* ---- 树数据 ---- */
  _treeData: [
    { label: '批量计算业务流程', icon: 'biz', children: [
      { label: '单表采集子流程1-1', icon: 'table' },
      { label: '采集写FTP', icon: 'ftp' },
      { label: '多模态数据采集', icon: 'multi' },
      { label: '采集写HTTP', icon: 'http' },
      { label: '整库采集子流程', icon: 'db' },
      { label: '在线编程子流程1-1', icon: 'code' },
      { label: '上传程序包子流程1-1', icon: 'pkg' },
      { label: '数治子流程1-1', icon: 'govern' }
    ]},
    { label: '流式计算业务流程', icon: 'stream', children: [
      { label: '数据同步-FlinkCDC同步', icon: 'sync' },
      { label: '流式接入流程', icon: 'inlet' },
      { label: '在线编程流程-Flinksql', icon: 'code' },
      { label: '上传程序包流程', icon: 'pkg' },
      { label: '流式处理流程-数易', icon: 'process' }
    ]},
    { label: '业务流程2', icon: 'biz', children: [
      { label: '批量采集业务流程', icon: 'biz', children: [
        { label: 'ods_tabname_hf', icon: 'table' },
        { label: 'ods_tabname_hf', icon: 'table' }
      ]},
      { label: '文件夹', icon: 'folder', children: [
        { label: '数据子流程2-2-1', icon: 'process' },
        { label: '数据子流程2-2-2', icon: 'process' }
      ]}
    ]}
  ],

  /* ---- 流程节点数据（取自批量计算业务流程子节点） ---- */
  _nodesData: [
    { id: 'start', type: 'start', label: '开始',              x: 40,  y: 250 },
    { id: 'n1',    type: 'task',  label: '单表采集子流程1-1',   x: 160, y: 240, icon: 'table' },
    { id: 'n2',    type: 'task',  label: '采集写FTP',           x: 380, y: 140, icon: 'ftp' },
    { id: 'n3',    type: 'task',  label: '采集写HTTP',          x: 380, y: 250, icon: 'http' },
    { id: 'n4',    type: 'task',  label: '多模态数据采集',       x: 380, y: 360, icon: 'multi' },
    { id: 'n5',    type: 'task',  label: '整库采集子流程',       x: 590, y: 190, icon: 'db' },
    { id: 'n6',    type: 'task',  label: '上传程序包子流程1-1',  x: 590, y: 360, icon: 'pkg' },
    { id: 'n7',    type: 'task',  label: '在线编程子流程1-1',    x: 800, y: 250, icon: 'code' },
    { id: 'n8',    type: 'task',  label: '数治子流程1-1',        x: 1010, y: 250, icon: 'govern' },
    { id: 'end',   type: 'end',   label: '结束',              x: 1180, y: 255 }
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
    }
  },

  _currentView: 'flow',

  /* ---- 初始化 ---- */
  init: function () {
    var self = this;
    self._currentView = 'flow';

    self._renderTree();
    self._renderCanvas();
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
    process: 'bi-gear-wide-connected'
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
    process: '#7f8c8d'
  },

  /* ---- 渲染目录树 ---- */
  _renderTree: function () {
    var container = document.getElementById('ddTreeContent');
    if (!container) return;
    var self = this;
    var iconMap = this._iconMap;
    var iconColorMap = this._iconColorMap;

    function buildNode(item, depth) {
      var hasChild = item.children && item.children.length > 0;
      var pad = 10 + depth * 16;
      var bi = iconMap[item.icon] || 'bi-file-earmark';
      var clr = iconColorMap[item.icon] || '#999';
      var html = '<div class="dd-tree-node" style="padding-left:' + pad + 'px" data-label="' + item.label + '">';
      if (hasChild) {
        html += '<span class="dd-tree-arrow open"><i class="bi bi-caret-right-fill"></i></span>';
      } else {
        html += '<span class="dd-tree-arrow empty" style="visibility:hidden"><i class="bi bi-caret-right-fill"></i></span>';
      }
      html += '<i class="bi ' + bi + ' dd-tree-icon" style="color:' + clr + '"></i>';
      html += '<span class="dd-tree-label">' + item.label + '</span></div>';
      if (item.children && item.children.length) {
        html += '<div class="dd-tree-children open">';
        item.children.forEach(function (c) { html += buildNode(c, depth + 1); });
        html += '</div>';
      }
      return html;
    }

    var html = '';
    this._treeData.forEach(function (item) { html += buildNode(item, 0); });
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

      var label = node.getAttribute('data-label');
      if (label === '批量计算业务流程') {
        self._switchToFlowView();
      } else if (label === '在线编程子流程1-1') {
        self._switchToEditorView(label);
      }
    });
  },

  /* ---- 画布状态（供拖动时更新连线） ---- */
  _canvasState: null,

  /* ---- 渲染画布 ---- */
  _renderCanvas: function () {
    var canvas = document.getElementById('ddCanvas');
    if (!canvas) return;
    var self = this;
    var nodeMap = {};

    self._nodesData.forEach(function (nd) {
      var el = document.createElement('div');
      el.className = 'dd-node';
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
        var biCls = self._iconMap[nd.icon] || 'bi-gear';
        var biClr = self._iconColorMap[nd.icon] || '#999';
        el.innerHTML =
          '<div class="dd-node-task">' +
            '<span class="dd-node-port"></span>' +
            '<span class="dd-node-icon" style="background:' + biClr + '"><i class="bi ' + biCls + '"></i></span>' +
            '<span class="dd-node-text">' + nd.label + '</span>' +
            '<span class="dd-node-port"></span>' +
          '</div>';
      }
      canvas.appendChild(el);
      nodeMap[nd.id] = { el: el, data: nd };
    });

    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'dd-connections');
    var defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    var marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
    marker.setAttribute('id', 'ddArrow');
    marker.setAttribute('markerWidth', '8');
    marker.setAttribute('markerHeight', '8');
    marker.setAttribute('refX', '7');
    marker.setAttribute('refY', '4');
    marker.setAttribute('orient', 'auto');
    var mp = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    mp.setAttribute('d', 'M0,1 L7,4 L0,7 Z');
    marker.appendChild(mp);
    defs.appendChild(marker);
    svg.appendChild(defs);
    canvas.insertBefore(svg, canvas.firstChild);

    self._canvasState = { canvas: canvas, svg: svg, nodeMap: nodeMap };

    requestAnimationFrame(function () { self._redrawEdges(); });

    canvas.addEventListener('mousedown', function (e) {
      var nodeEl = e.target.closest('.dd-node');
      if (!nodeEl) return;
      e.preventDefault();
      var id = nodeEl.id.replace('ddNode_', '');
      var info = nodeMap[id];
      if (!info) return;

      var startX = e.clientX, startY = e.clientY;
      var origX = info.data.x, origY = info.data.y;
      nodeEl.style.zIndex = '10';

      function onMove(ev) {
        var dx = ev.clientX - startX;
        var dy = ev.clientY - startY;
        info.data.x = origX + dx;
        info.data.y = origY + dy;
        nodeEl.style.left = info.data.x + 'px';
        nodeEl.style.top = info.data.y + 'px';
        self._redrawEdges();
      }
      function onUp() {
        nodeEl.style.zIndex = '';
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      }
      document.body.style.cursor = 'grabbing';
      document.body.style.userSelect = 'none';
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    });

    canvas.addEventListener('click', function (e) {
      var nodeEl = e.target.closest('.dd-node');
      canvas.querySelectorAll('.dd-node.selected').forEach(function (n) { n.classList.remove('selected'); });
      if (nodeEl) nodeEl.classList.add('selected');
    });
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
    menu.innerHTML =
      '<div class="dd-ctx-menu-item" data-act="new-flow"><i class="bi bi-plus-circle"></i>新建业务流程</div>' +
      '<div class="dd-ctx-menu-item" data-act="edit-flow"><i class="bi bi-pencil-square"></i>编辑业务流程</div>' +
      '<div class="dd-ctx-menu-item" data-act="new-sub"><i class="bi bi-diagram-3"></i>新建子流程<span class="sub-arrow"><i class="bi bi-chevron-right"></i></span></div>' +
      '<div class="dd-ctx-menu-item" data-act="new-folder"><i class="bi bi-folder-plus"></i>新建文件夹</div>' +
      '<div class="dd-ctx-divider"></div>' +
      '<div class="dd-ctx-menu-item" data-act="copy"><i class="bi bi-clipboard"></i>拷贝</div>' +
      '<div class="dd-ctx-menu-item" data-act="share"><i class="bi bi-share"></i>共享/取消共享发布</div>' +
      '<div class="dd-ctx-menu-item" data-act="move"><i class="bi bi-arrows-move"></i>移动</div>' +
      '<div class="dd-ctx-divider"></div>' +
      '<div class="dd-ctx-menu-item" data-act="import"><i class="bi bi-box-arrow-in-down"></i>导入</div>' +
      '<div class="dd-ctx-menu-item" data-act="export"><i class="bi bi-box-arrow-up"></i>导出</div>' +
      '<div class="dd-ctx-divider"></div>' +
      '<div class="dd-ctx-menu-item danger" data-act="delete"><i class="bi bi-trash3"></i>删除</div>' +
      '<div class="dd-ctx-divider"></div>' +
      '<div class="dd-ctx-menu-item" data-act="hotkey"><i class="bi bi-lightning"></i>使用频发【S】</div>';
    document.body.appendChild(menu);

    var treePanel = document.querySelector('.dd-tree-content');
    if (!treePanel) return;

    treePanel.addEventListener('contextmenu', function (e) {
      e.preventDefault();
      e.stopPropagation();
      var node = e.target.closest('.dd-tree-node');
      if (node) {
        treePanel.querySelectorAll('.dd-tree-node.active').forEach(function (n) { n.classList.remove('active'); });
        node.classList.add('active');
      }
      _showMenu(menu, e.clientX, e.clientY);
    });

    menu.querySelectorAll('.dd-ctx-menu-item').forEach(function (item) {
      item.addEventListener('click', function () { menu.classList.remove('show'); });
    });
  },

  /* ---- 画布右键菜单 ---- */
  _initCanvasContextMenu: function () {
    var menu = document.createElement('div');
    menu.className = 'dd-ctx-menu';
    menu.id = 'ddCanvasCtxMenu';
    menu.innerHTML =
      '<div class="dd-ctx-menu-item" data-act="auto-layout"><i class="bi bi-grid-3x3"></i>整体自动布局</div>' +
      '<div class="dd-ctx-menu-item" data-act="auto-connect"><i class="bi bi-bezier2"></i>自动连线</div>' +
      '<div class="dd-ctx-divider"></div>' +
      '<div class="dd-ctx-menu-item" data-act="ins-quality"><i class="bi bi-shield-check"></i>插入质量节点</div>' +
      '<div class="dd-ctx-menu-item" data-act="ins-param"><i class="bi bi-sliders"></i>插入参数节点</div>' +
      '<div class="dd-ctx-menu-item" data-act="ins-pre"><i class="bi bi-skip-start"></i>插入前置任务</div>' +
      '<div class="dd-ctx-menu-item" data-act="ins-summary"><i class="bi bi-table"></i>插入汇总表</div>' +
      '<div class="dd-ctx-divider"></div>' +
      '<div class="dd-ctx-menu-item" data-act="align-left"><i class="bi bi-text-left"></i>左对齐</div>' +
      '<div class="dd-ctx-menu-item" data-act="align-center-h"><i class="bi bi-text-center"></i>左右居中对齐</div>' +
      '<div class="dd-ctx-menu-item" data-act="align-right"><i class="bi bi-text-right"></i>右对齐</div>' +
      '<div class="dd-ctx-menu-item" data-act="align-top"><i class="bi bi-align-top"></i>顶部对齐</div>' +
      '<div class="dd-ctx-menu-item" data-act="align-center-v"><i class="bi bi-align-middle"></i>上下居中对齐</div>' +
      '<div class="dd-ctx-menu-item" data-act="align-bottom"><i class="bi bi-align-bottom"></i>底部对齐</div>' +
      '<div class="dd-ctx-divider"></div>' +
      '<div class="dd-ctx-menu-item" data-act="dist-v"><i class="bi bi-distribute-vertical"></i>垂直平均分布</div>' +
      '<div class="dd-ctx-menu-item" data-act="dist-h"><i class="bi bi-distribute-horizontal"></i>水平平均分布</div>' +
      '<div class="dd-ctx-divider"></div>' +
      '<div class="dd-ctx-menu-item danger" data-act="delete"><i class="bi bi-trash3"></i>删除</div>';
    document.body.appendChild(menu);

    var canvasEl = document.getElementById('ddCanvas');
    if (!canvasEl) return;

    canvasEl.addEventListener('contextmenu', function (e) {
      e.preventDefault();
      e.stopPropagation();
      _showMenu(menu, e.clientX, e.clientY);
    });

    menu.querySelectorAll('.dd-ctx-menu-item').forEach(function (item) {
      item.addEventListener('click', function () { menu.classList.remove('show'); });
    });
  },

  /* ============================================================
     视图切换：流程 ↔ 编辑器（只切换右侧面板内容）
     ============================================================ */

  _switchToFlowView: function () {
    if (this._currentView === 'flow') return;
    this._currentView = 'flow';
    document.getElementById('ddFlowView').style.display = '';
    document.getElementById('ddEditorView').style.display = 'none';
  },

  _switchToEditorView: function (label) {
    this._currentView = 'editor';
    document.getElementById('ddFlowView').style.display = 'none';
    document.getElementById('ddEditorView').style.display = '';
    this._renderEditorContent(label);
  },

  /* ---- 渲染编辑器内容 ---- */
  _renderEditorContent: function (label) {
    var content = this._editorContents[label];
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
    if (codeEl) codeEl.innerHTML = this._highlightSQL(content.code);
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
    }
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
        var keywords = ['SELECT','FROM','WHERE','AND','OR','INSERT','INTO','VALUES','SET','CREATE','TABLE','WITH','AS','NOT','NULL','ORDER','BY','GROUP','HAVING','JOIN','LEFT','RIGHT','INNER','ON','LIMIT','UNION','ALL'];
        var formatted = text.replace(/\r\n/g, '\n');
        keywords.forEach(function (kw) {
          formatted = formatted.replace(new RegExp('\\b' + kw + '\\b', 'gi'), kw);
        });
        codeEl.innerHTML = window.DataDevelop._highlightSQL(formatted);
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
    var strip = document.querySelector('.dd-sidebar-strip');
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
