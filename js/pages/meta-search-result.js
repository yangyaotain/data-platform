/**
 * 鏁版嵁涓彴 V4.0 - 鍏冩暟鎹悳绱㈢粨鏋滈〉
 * 鍖呭惈琛ㄦ悳绱㈠拰瀛楁鎼滅储涓ょ妯″紡
 */
window.DP = window.DP || {};
DP.pages = DP.pages || {};

/* 瀛楁鎼滅储 - 鍒楄〃瑙嗗浘HTML */
var _fieldSearchListHTML = `<table class="ds-table">
              <thead>
                <tr><th>字段名称</th><th>字段类型</th><th>别名</th><th>归属表</th><th>归属库</th><th>数据标签</th><th>描述</th><th>负责人</th><th>更新时间</th><th>操作</th></tr>
              </thead>
              <tbody>
                <tr class="ms-row-clickable" data-table="order_main" data-field="order_id">
                  <td class="td-link"><mark class="ms-hl">order</mark>_id</td>
                  <td><span class="tag tag-type">bigint</span></td>
                  <td><mark class="ms-hl">订单</mark>编号</td>
                  <td class="td-link-sub">order_main</td>
                  <td>prod_mysql_master</td>
                  <td><span class="tag tag-green">核心指标</span> <span class="tag tag-purple">已认证</span></td>
                  <td class="td-desc"><mark class="ms-hl">订单</mark>唯一标识，自增主键</td>
                  <td>张明</td>
                  <td>2026-02-12 08:30</td>
                  <td class="td-actions"><i class="bi bi-eye" title="查看"></i></td>
                </tr>
                <tr class="ms-row-clickable" data-table="order_main" data-field="order_no">
                  <td class="td-link"><mark class="ms-hl">order</mark>_no</td>
                  <td><span class="tag tag-type">varchar(64)</span></td>
                  <td><mark class="ms-hl">订单</mark>号</td>
                  <td class="td-link-sub">order_main</td>
                  <td>prod_mysql_master</td>
                  <td><span class="tag tag-green">核心指标</span></td>
                  <td class="td-desc">业务<mark class="ms-hl">订单</mark>号，唯一索引</td>
                  <td>张明</td>
                  <td>2026-02-12 08:30</td>
                  <td class="td-actions"><i class="bi bi-eye" title="查看"></i></td>
                </tr>
                <tr class="ms-row-clickable" data-table="order_main" data-field="order_status">
                  <td class="td-link"><mark class="ms-hl">order</mark>_status</td>
                  <td><span class="tag tag-type">tinyint</span></td>
                  <td><mark class="ms-hl">订单</mark>状态</td>
                  <td class="td-link-sub">order_main</td>
                  <td>prod_mysql_master</td>
                  <td><span class="tag tag-blue">事实表</span></td>
                  <td class="td-desc"><mark class="ms-hl">订单</mark>状态码 0待付款 1已付款 2已发货</td>
                  <td>张明</td>
                  <td>2026-02-12 08:30</td>
                  <td class="td-actions"><i class="bi bi-eye" title="查看"></i></td>
                </tr>
                <tr class="ms-row-clickable" data-table="order_detail" data-field="order_amount">
                  <td class="td-link"><mark class="ms-hl">order</mark>_amount</td>
                  <td><span class="tag tag-type">decimal(12,2)</span></td>
                  <td><mark class="ms-hl">订单</mark>金额</td>
                  <td class="td-link-sub">order_detail</td>
                  <td>prod_mysql_master</td>
                  <td><span class="tag tag-green">核心指标</span> <span class="tag tag-red">敏感数据</span></td>
                  <td class="td-desc"><mark class="ms-hl">订单</mark>商品金额合计</td>
                  <td>张明</td>
                  <td>2026-02-12 08:30</td>
                  <td class="td-actions"><i class="bi bi-eye" title="查看"></i></td>
                </tr>
                <tr class="ms-row-clickable" data-table="order_main" data-field="pay_time">
                  <td class="td-link">pay_time</td>
                  <td><span class="tag tag-type">datetime</span></td>
                  <td>支付时间</td>
                  <td class="td-link-sub">order_main</td>
                  <td>prod_mysql_master</td>
                  <td><span class="tag tag-blue">事实表</span> <span class="tag tag-yellow">增量同步</span></td>
                  <td class="td-desc"><mark class="ms-hl">订单</mark>支付完成时间</td>
                  <td>张明</td>
                  <td>2026-02-12 08:30</td>
                  <td class="td-actions"><i class="bi bi-eye" title="查看"></i></td>
                </tr>
                <tr class="ms-row-clickable" data-table="dwd_order_fact" data-field="order_type">
                  <td class="td-link"><mark class="ms-hl">order</mark>_type</td>
                  <td><span class="tag tag-type">int</span></td>
                  <td><mark class="ms-hl">订单</mark>类型</td>
                  <td class="td-link-sub">dwd_order_fact</td>
                  <td>dw_hive_dwd</td>
                  <td><span class="tag tag-blue">维度表</span> <span class="tag tag-purple">已认证</span></td>
                  <td class="td-desc"><mark class="ms-hl">订单</mark>分类：普通、团购、秒杀</td>
                  <td>王强</td>
                  <td>2026-02-12 06:00</td>
                  <td class="td-actions"><i class="bi bi-eye" title="查看"></i></td>
                </tr>
                <tr class="ms-row-clickable" data-table="dwd_order_fact" data-field="order_source">
                  <td class="td-link"><mark class="ms-hl">order</mark>_source</td>
                  <td><span class="tag tag-type">varchar(32)</span></td>
                  <td><mark class="ms-hl">订单</mark>来源</td>
                  <td class="td-link-sub">dwd_order_fact</td>
                  <td>dw_hive_dwd</td>
                  <td><span class="tag tag-blue">维度表</span></td>
                  <td class="td-desc"><mark class="ms-hl">订单</mark>来源渠道 APP/PC/H5/小程序</td>
                  <td>王强</td>
                  <td>2026-02-12 06:00</td>
                  <td class="td-actions"><i class="bi bi-eye" title="查看"></i></td>
                </tr>
                <tr class="ms-row-clickable" data-table="dws_order_daily" data-field="order_count">
                  <td class="td-link"><mark class="ms-hl">order</mark>_count</td>
                  <td><span class="tag tag-type">bigint</span></td>
                  <td><mark class="ms-hl">订单</mark>数量</td>
                  <td class="td-link-sub">dws_order_daily</td>
                  <td>dw_hive_dws</td>
                  <td><span class="tag tag-green">核心指标</span> <span class="tag tag-blue">聚合表</span></td>
                  <td class="td-desc">按天汇总<mark class="ms-hl">订单</mark>总数</td>
                  <td>王强</td>
                  <td>2026-02-12 07:00</td>
                  <td class="td-actions"><i class="bi bi-eye" title="查看"></i></td>
                </tr>
                <tr class="ms-row-clickable" data-table="dws_order_daily" data-field="order_gmv">
                  <td class="td-link"><mark class="ms-hl">order</mark>_gmv</td>
                  <td><span class="tag tag-type">decimal(14,2)</span></td>
                  <td><mark class="ms-hl">订单</mark>GMV</td>
                  <td class="td-link-sub">dws_order_daily</td>
                  <td>dw_hive_dws</td>
                  <td><span class="tag tag-green">核心指标</span></td>
                  <td class="td-desc"><mark class="ms-hl">订单</mark>GMV每日汇总金额</td>
                  <td>王强</td>
                  <td>2026-02-12 07:00</td>
                  <td class="td-actions"><i class="bi bi-eye" title="查看"></i></td>
                </tr>
                <tr class="ms-row-clickable" data-table="ads_order_overview" data-field="order_channel">
                  <td class="td-link"><mark class="ms-hl">order</mark>_channel</td>
                  <td><span class="tag tag-type">varchar(20)</span></td>
                  <td><mark class="ms-hl">订单</mark>渠道</td>
                  <td class="td-link-sub">ads_order_overview</td>
                  <td>dw_hive_ads</td>
                  <td><span class="tag tag-blue">维度表</span></td>
                  <td class="td-desc"><mark class="ms-hl">订单</mark>渠道分布统计维度</td>
                  <td>赵丽</td>
                  <td>2026-02-12 07:30</td>
                  <td class="td-actions"><i class="bi bi-eye" title="查看"></i></td>
                </tr>
              </tbody>
            </table>`;

/* 瀛楁鎼滅储 - 鍗＄墖瑙嗗浘HTML */
var _fieldSearchCardHTML = `<div class="ms-cards-grid">
              <div class="ms-asset-card ms-row-clickable" data-table="order_main" data-field="order_id">
                <div class="ac-header"><i class="bi bi-input-cursor-text"></i> <mark class="ms-hl">order</mark>_id <span class="tag tag-type-sm">bigint</span></div>
                <div class="ac-title"><mark class="ms-hl">订单</mark>编号</div>
                <div class="ac-meta"><span><i class="bi bi-table"></i> order_main</span><span><i class="bi bi-database"></i> prod_mysql_master</span></div>
                <div class="ac-tags"><span class="tag tag-green">核心指标</span> <span class="tag tag-purple">已认证</span></div>
                <div class="ac-footer"><span class="ac-owner"><i class="bi bi-person"></i> 张明</span><span class="ac-time">2026-02-12</span></div>
              </div>
              <div class="ms-asset-card ms-row-clickable" data-table="order_main" data-field="order_no">
                <div class="ac-header"><i class="bi bi-input-cursor-text"></i> <mark class="ms-hl">order</mark>_no <span class="tag tag-type-sm">varchar(64)</span></div>
                <div class="ac-title"><mark class="ms-hl">订单</mark>号</div>
                <div class="ac-meta"><span><i class="bi bi-table"></i> order_main</span><span><i class="bi bi-database"></i> prod_mysql_master</span></div>
                <div class="ac-tags"><span class="tag tag-green">核心指标</span></div>
                <div class="ac-footer"><span class="ac-owner"><i class="bi bi-person"></i> 张明</span><span class="ac-time">2026-02-12</span></div>
              </div>
              <div class="ms-asset-card ms-row-clickable" data-table="order_main" data-field="order_status">
                <div class="ac-header"><i class="bi bi-input-cursor-text"></i> <mark class="ms-hl">order</mark>_status <span class="tag tag-type-sm">tinyint</span></div>
                <div class="ac-title"><mark class="ms-hl">订单</mark>状态</div>
                <div class="ac-meta"><span><i class="bi bi-table"></i> order_main</span><span><i class="bi bi-database"></i> prod_mysql_master</span></div>
                <div class="ac-tags"><span class="tag tag-blue">事实表</span></div>
                <div class="ac-footer"><span class="ac-owner"><i class="bi bi-person"></i> 张明</span><span class="ac-time">2026-02-12</span></div>
              </div>
              <div class="ms-asset-card ms-row-clickable" data-table="order_detail" data-field="order_amount">
                <div class="ac-header"><i class="bi bi-input-cursor-text"></i> <mark class="ms-hl">order</mark>_amount <span class="tag tag-type-sm">decimal(12,2)</span></div>
                <div class="ac-title"><mark class="ms-hl">订单</mark>金额</div>
                <div class="ac-meta"><span><i class="bi bi-table"></i> order_detail</span><span><i class="bi bi-database"></i> prod_mysql_master</span></div>
                <div class="ac-tags"><span class="tag tag-green">核心指标</span> <span class="tag tag-red">敏感数据</span></div>
                <div class="ac-footer"><span class="ac-owner"><i class="bi bi-person"></i> 张明</span><span class="ac-time">2026-02-12</span></div>
              </div>
              <div class="ms-asset-card ms-row-clickable" data-table="order_main" data-field="pay_time">
                <div class="ac-header"><i class="bi bi-input-cursor-text"></i> pay_time <span class="tag tag-type-sm">datetime</span></div>
                <div class="ac-title">支付时间</div>
                <div class="ac-meta"><span><i class="bi bi-table"></i> order_main</span><span><i class="bi bi-database"></i> prod_mysql_master</span></div>
                <div class="ac-tags"><span class="tag tag-blue">事实表</span> <span class="tag tag-yellow">增量同步</span></div>
                <div class="ac-footer"><span class="ac-owner"><i class="bi bi-person"></i> 张明</span><span class="ac-time">2026-02-12</span></div>
              </div>
              <div class="ms-asset-card ms-row-clickable" data-table="dwd_order_fact" data-field="order_type">
                <div class="ac-header"><i class="bi bi-input-cursor-text"></i> <mark class="ms-hl">order</mark>_type <span class="tag tag-type-sm">int</span></div>
                <div class="ac-title"><mark class="ms-hl">订单</mark>类型</div>
                <div class="ac-meta"><span><i class="bi bi-table"></i> dwd_order_fact</span><span><i class="bi bi-database"></i> dw_hive_dwd</span></div>
                <div class="ac-tags"><span class="tag tag-blue">维度表</span> <span class="tag tag-purple">已认证</span></div>
                <div class="ac-footer"><span class="ac-owner"><i class="bi bi-person"></i> 王强</span><span class="ac-time">2026-02-12</span></div>
              </div>
              <div class="ms-asset-card ms-row-clickable" data-table="dwd_order_fact" data-field="order_source">
                <div class="ac-header"><i class="bi bi-input-cursor-text"></i> <mark class="ms-hl">order</mark>_source <span class="tag tag-type-sm">varchar(32)</span></div>
                <div class="ac-title"><mark class="ms-hl">订单</mark>来源</div>
                <div class="ac-meta"><span><i class="bi bi-table"></i> dwd_order_fact</span><span><i class="bi bi-database"></i> dw_hive_dwd</span></div>
                <div class="ac-tags"><span class="tag tag-blue">维度表</span></div>
                <div class="ac-footer"><span class="ac-owner"><i class="bi bi-person"></i> 王强</span><span class="ac-time">2026-02-12</span></div>
              </div>
              <div class="ms-asset-card ms-row-clickable" data-table="dws_order_daily" data-field="order_count">
                <div class="ac-header"><i class="bi bi-input-cursor-text"></i> <mark class="ms-hl">order</mark>_count <span class="tag tag-type-sm">bigint</span></div>
                <div class="ac-title"><mark class="ms-hl">订单</mark>数量</div>
                <div class="ac-meta"><span><i class="bi bi-table"></i> dws_order_daily</span><span><i class="bi bi-database"></i> dw_hive_dws</span></div>
                <div class="ac-tags"><span class="tag tag-green">核心指标</span> <span class="tag tag-blue">聚合表</span></div>
                <div class="ac-footer"><span class="ac-owner"><i class="bi bi-person"></i> 王强</span><span class="ac-time">2026-02-12</span></div>
              </div>
              <div class="ms-asset-card ms-row-clickable" data-table="dws_order_daily" data-field="order_gmv">
                <div class="ac-header"><i class="bi bi-input-cursor-text"></i> <mark class="ms-hl">order</mark>_gmv <span class="tag tag-type-sm">decimal(14,2)</span></div>
                <div class="ac-title"><mark class="ms-hl">订单</mark>GMV</div>
                <div class="ac-meta"><span><i class="bi bi-table"></i> dws_order_daily</span><span><i class="bi bi-database"></i> dw_hive_dws</span></div>
                <div class="ac-tags"><span class="tag tag-green">核心指标</span></div>
                <div class="ac-footer"><span class="ac-owner"><i class="bi bi-person"></i> 王强</span><span class="ac-time">2026-02-12</span></div>
              </div>
              <div class="ms-asset-card ms-row-clickable" data-table="ads_order_overview" data-field="order_channel">
                <div class="ac-header"><i class="bi bi-input-cursor-text"></i> <mark class="ms-hl">order</mark>_channel <span class="tag tag-type-sm">varchar(20)</span></div>
                <div class="ac-title"><mark class="ms-hl">订单</mark>渠道</div>
                <div class="ac-meta"><span><i class="bi bi-table"></i> ads_order_overview</span><span><i class="bi bi-database"></i> dw_hive_ads</span></div>
                <div class="ac-tags"><span class="tag tag-blue">维度表</span></div>
                <div class="ac-footer"><span class="ac-owner"><i class="bi bi-person"></i> 赵丽</span><span class="ac-time">2026-02-12</span></div>
              </div>
            </div>`;

DP.pages.metaSearchResult = {

  /* 鎼滅储缁撴灉椤礖TML妯℃澘 */
  html: `
    <div class="page-meta-search">

      <!-- 主体区域：左目录 + 右内容 -->
      <div class="ms-body">

        <!-- 左侧：数据目录 -->
        <div class="ms-catalog">
          <div class="ms-catalog-tabs">
            <a class="ms-ctab active">数据目录</a>
            <a class="ms-ctab">数据源目录</a>
          </div>
          <!-- 数据目录树 -->
          <div class="ms-catalog-tree" id="msCatalogResource">
            <ul class="ms-tree">
              <li class="ms-tnode open">
                <span class="ms-toggle"><i class="bi bi-chevron-down"></i></span>
                <i class="bi bi-journals ms-ticon"></i>
                <span class="ms-ttext">企业数据资产目录 (126)</span>
                <ul class="ms-tchildren">
                  <li class="ms-tnode open">
                    <span class="ms-toggle"><i class="bi bi-chevron-down"></i></span>
                    <i class="bi bi-folder2-open ms-ticon"></i>
                    <span class="ms-ttext">物流履约域 (42)</span>
                    <ul class="ms-tchildren">
                      <li class="ms-tnode open">
                        <span class="ms-toggle"><i class="bi bi-chevron-down"></i></span>
                        <i class="bi bi-folder2-open ms-ticon"></i>
                        <span class="ms-ttext">订单履约 (24)</span>
                        <ul class="ms-tchildren">
                          <li class="ms-tnode active"><i class="bi bi-bookmark ms-ticon-leaf"></i><span class="ms-ttext">运单主题 (10)</span></li>
                          <li class="ms-tnode"><i class="bi bi-bookmark ms-ticon-leaf"></i><span class="ms-ttext">派送主题 (8)</span></li>
                          <li class="ms-tnode"><i class="bi bi-bookmark ms-ticon-leaf"></i><span class="ms-ttext">超时预警 (6)</span></li>
                        </ul>
                      </li>
                      <li class="ms-tnode open">
                        <span class="ms-toggle"><i class="bi bi-chevron-down"></i></span>
                        <i class="bi bi-folder2-open ms-ticon"></i>
                        <span class="ms-ttext">运力管理 (18)</span>
                        <ul class="ms-tchildren">
                          <li class="ms-tnode"><i class="bi bi-bookmark ms-ticon-leaf"></i><span class="ms-ttext">司机主题 (7)</span></li>
                          <li class="ms-tnode"><i class="bi bi-bookmark ms-ticon-leaf"></i><span class="ms-ttext">车辆主题 (5)</span></li>
                          <li class="ms-tnode"><i class="bi bi-bookmark ms-ticon-leaf"></i><span class="ms-ttext">线路主题 (6)</span></li>
                        </ul>
                      </li>
                    </ul>
                  </li>
                  <li class="ms-tnode open">
                    <span class="ms-toggle"><i class="bi bi-chevron-down"></i></span>
                    <i class="bi bi-folder2-open ms-ticon"></i>
                    <span class="ms-ttext">客户服务域 (28)</span>
                    <ul class="ms-tchildren">
                      <li class="ms-tnode open">
                        <span class="ms-toggle"><i class="bi bi-chevron-down"></i></span>
                        <i class="bi bi-folder2-open ms-ticon"></i>
                        <span class="ms-ttext">客户画像 (15)</span>
                        <ul class="ms-tchildren">
                          <li class="ms-tnode"><i class="bi bi-bookmark ms-ticon-leaf"></i><span class="ms-ttext">客户基础信息 (8)</span></li>
                          <li class="ms-tnode"><i class="bi bi-bookmark ms-ticon-leaf"></i><span class="ms-ttext">客户标签 (7)</span></li>
                        </ul>
                      </li>
                      <li class="ms-tnode open">
                        <span class="ms-toggle"><i class="bi bi-chevron-down"></i></span>
                        <i class="bi bi-folder2-open ms-ticon"></i>
                        <span class="ms-ttext">服务工单 (13)</span>
                        <ul class="ms-tchildren">
                          <li class="ms-tnode"><i class="bi bi-bookmark ms-ticon-leaf"></i><span class="ms-ttext">投诉处理 (8)</span></li>
                          <li class="ms-tnode"><i class="bi bi-bookmark ms-ticon-leaf"></i><span class="ms-ttext">满意度回访 (5)</span></li>
                        </ul>
                      </li>
                    </ul>
                  </li>
                  <li class="ms-tnode open">
                    <span class="ms-toggle"><i class="bi bi-chevron-down"></i></span>
                    <i class="bi bi-folder2-open ms-ticon"></i>
                    <span class="ms-ttext">财务结算域 (31)</span>
                    <ul class="ms-tchildren">
                      <li class="ms-tnode open">
                        <span class="ms-toggle"><i class="bi bi-chevron-down"></i></span>
                        <i class="bi bi-folder2-open ms-ticon"></i>
                        <span class="ms-ttext">费用结算 (17)</span>
                        <ul class="ms-tchildren">
                          <li class="ms-tnode"><i class="bi bi-bookmark ms-ticon-leaf"></i><span class="ms-ttext">运费结算 (10)</span></li>
                          <li class="ms-tnode"><i class="bi bi-bookmark ms-ticon-leaf"></i><span class="ms-ttext">发票开具 (7)</span></li>
                        </ul>
                      </li>
                      <li class="ms-tnode open">
                        <span class="ms-toggle"><i class="bi bi-chevron-down"></i></span>
                        <i class="bi bi-folder2-open ms-ticon"></i>
                        <span class="ms-ttext">财务风控 (14)</span>
                        <ul class="ms-tchildren">
                          <li class="ms-tnode"><i class="bi bi-bookmark ms-ticon-leaf"></i><span class="ms-ttext">欠费预警 (8)</span></li>
                          <li class="ms-tnode"><i class="bi bi-bookmark ms-ticon-leaf"></i><span class="ms-ttext">异常退款 (6)</span></li>
                        </ul>
                      </li>
                    </ul>
                  </li>
                  <li class="ms-tnode open">
                    <span class="ms-toggle"><i class="bi bi-chevron-down"></i></span>
                    <i class="bi bi-folder2-open ms-ticon"></i>
                    <span class="ms-ttext">公共维度域 (25)</span>
                    <ul class="ms-tchildren">
                      <li class="ms-tnode"><i class="bi bi-bookmark ms-ticon-leaf"></i><span class="ms-ttext">行政区划 (9)</span></li>
                      <li class="ms-tnode"><i class="bi bi-bookmark ms-ticon-leaf"></i><span class="ms-ttext">组织机构 (8)</span></li>
                      <li class="ms-tnode"><i class="bi bi-bookmark ms-ticon-leaf"></i><span class="ms-ttext">时间周期 (8)</span></li>
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
              <li class="ms-tnode open">
                <span class="ms-toggle"><i class="bi bi-chevron-down"></i></span>
                <i class="bi bi-folder2-open ms-ticon"></i>
                <span class="ms-ttext">数据仓库 (4)</span>
                <ul class="ms-tchildren">
                  <li class="ms-tnode"><i class="bi bi-database ms-ticon-leaf"></i><span class="ms-ttext">dw_hive_ods</span></li>
                  <li class="ms-tnode"><i class="bi bi-database ms-ticon-leaf"></i><span class="ms-ttext">dw_hive_dwd</span></li>
                  <li class="ms-tnode"><i class="bi bi-database ms-ticon-leaf"></i><span class="ms-ttext">dw_hive_dws</span></li>
                  <li class="ms-tnode"><i class="bi bi-database ms-ticon-leaf"></i><span class="ms-ttext">dw_hive_ads</span></li>
                </ul>
              </li>
              <li class="ms-tnode open">
                <span class="ms-toggle"><i class="bi bi-chevron-down"></i></span>
                <i class="bi bi-folder2-open ms-ticon"></i>
                <span class="ms-ttext">业务系统 (3)</span>
                <ul class="ms-tchildren">
                  <li class="ms-tnode"><i class="bi bi-database ms-ticon-leaf"></i><span class="ms-ttext">erp_oracle_db</span></li>
                  <li class="ms-tnode"><i class="bi bi-database ms-ticon-leaf"></i><span class="ms-ttext">crm_sqlserver</span></li>
                  <li class="ms-tnode"><i class="bi bi-database ms-ticon-leaf"></i><span class="ms-ttext">oa_mysql_db</span></li>
                </ul>
              </li>
              <li class="ms-tnode open">
                <span class="ms-toggle"><i class="bi bi-chevron-down"></i></span>
                <i class="bi bi-folder2-open ms-ticon"></i>
                <span class="ms-ttext">实时数据源 (2)</span>
                <ul class="ms-tchildren">
                  <li class="ms-tnode"><i class="bi bi-database ms-ticon-leaf"></i><span class="ms-ttext">kafka_cluster_01</span></li>
                  <li class="ms-tnode"><i class="bi bi-database ms-ticon-leaf"></i><span class="ms-ttext">kafka_cluster_02</span></li>
                </ul>
              </li>
              <li class="ms-tnode open">
                <span class="ms-toggle"><i class="bi bi-chevron-down"></i></span>
                <i class="bi bi-folder2-open ms-ticon"></i>
                <span class="ms-ttext">测试环境 (3)</span>
                <ul class="ms-tchildren">
                  <li class="ms-tnode"><i class="bi bi-database ms-ticon-leaf"></i><span class="ms-ttext">test_mysql_db</span></li>
                  <li class="ms-tnode"><i class="bi bi-database ms-ticon-leaf"></i><span class="ms-ttext">test_clickhouse</span></li>
                  <li class="ms-tnode"><i class="bi bi-database ms-ticon-leaf"></i><span class="ms-ttext">test_mongodb</span></li>
                </ul>
              </li>
            </ul>
          </div>
        </div>

        <!-- 右侧内容 -->
        <div class="ms-content">

          <!-- 搜索/筛选/排序区 -->
          <div class="ms-content-header">
            <div class="ms-search-bar ms-search-bar-v2">
              <input type="text" class="ms-search-input" placeholder="输入表名、别名或描述关键字搜索...">
              <button class="btn ms-search-type-btn active" data-stype="table"><i class="bi bi-table"></i> 表搜索</button>
              <button class="btn ms-search-type-btn" data-stype="field"><i class="bi bi-input-cursor-text"></i> 字段搜索</button>
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
            <div class="ms-filter-section">
              <div class="ms-filter-row" data-filter="asset">
                <span class="ms-filter-label">资产卡片：</span>
                <div class="ms-filter-tags-wrap">
                  <div class="ms-filter-tags" id="filterAssetTags">
                    <a class="ms-filter-tag active" data-val="all">不限</a>
                    <a class="ms-filter-tag" data-val="订单数据">订单数据</a>
                    <a class="ms-filter-tag" data-val="支付数据">支付数据</a>
                    <a class="ms-filter-tag" data-val="用户基础">用户基础</a>
                    <a class="ms-filter-tag" data-val="用户画像">用户画像</a>
                    <a class="ms-filter-tag" data-val="商品信息">商品信息</a>
                    <a class="ms-filter-tag" data-val="营销报表">营销报表</a>
                    <a class="ms-filter-tag" data-val="物流配送">物流配送</a>
                    <a class="ms-filter-tag" data-val="库存管理">库存管理</a>
                  </div>
                  <a class="ms-filter-expand" data-target="filterAssetTags"><i class="bi bi-chevron-down"></i> 展开</a>
                </div>
              </div>
              <div class="ms-filter-row" data-filter="label">
                <span class="ms-filter-label">数据标签：</span>
                <div class="ms-filter-tags-wrap">
                  <div class="ms-filter-tags" id="filterLabelTags">
                    <a class="ms-filter-tag active" data-val="all">不限</a>
                    <a class="ms-filter-tag" data-val="核心指标">核心指标</a>
                    <a class="ms-filter-tag" data-val="实时数据">实时数据</a>
                    <a class="ms-filter-tag" data-val="敏感数据">敏感数据</a>
                    <a class="ms-filter-tag" data-val="脱敏字段">脱敏字段</a>
                    <a class="ms-filter-tag" data-val="主数据">主数据</a>
                    <a class="ms-filter-tag" data-val="维度表">维度表</a>
                    <a class="ms-filter-tag" data-val="事实表">事实表</a>
                    <a class="ms-filter-tag" data-val="聚合表">聚合表</a>
                    <a class="ms-filter-tag" data-val="全量快照">全量快照</a>
                    <a class="ms-filter-tag" data-val="增量同步">增量同步</a>
                    <a class="ms-filter-tag" data-val="已认证">已认证</a>
                    <a class="ms-filter-tag" data-val="待治理">待治理</a>
                    <a class="ms-filter-tag" data-val="高热度">高热度</a>
                  </div>
                  <a class="ms-filter-expand" data-target="filterLabelTags"><i class="bi bi-chevron-down"></i> 展开</a>
                </div>
              </div>
            </div>
            <div class="ms-sort-bar">
              <span class="ms-sort-label">排序：</span>
              <a class="ms-sort-item active" data-sort="hot" data-dir="desc"><i class="bi bi-fire"></i> 搜索热度 <span class="ms-sort-arrows"><i class="bi bi-caret-up-fill"></i><i class="bi bi-caret-down-fill ms-arrow-active"></i></span></a>
              <a class="ms-sort-item" data-sort="create" data-dir="desc"><i class="bi bi-calendar-plus"></i> 创建时间 <span class="ms-sort-arrows"><i class="bi bi-caret-up-fill"></i><i class="bi bi-caret-down-fill"></i></span></a>
              <a class="ms-sort-item" data-sort="update" data-dir="desc"><i class="bi bi-clock-history"></i> 更新时间 <span class="ms-sort-arrows"><i class="bi bi-caret-up-fill"></i><i class="bi bi-caret-down-fill"></i></span></a>
              <a class="ms-sort-item" data-sort="records" data-dir="desc"><i class="bi bi-bar-chart"></i> 记录数 <span class="ms-sort-arrows"><i class="bi bi-caret-up-fill"></i><i class="bi bi-caret-down-fill"></i></span></a>
            </div>
          </div>

          <!-- 视图切换+结果数 -->
          <div class="ms-view-bar">
            <div class="ms-view-info">
              <span>共 <b>156</b> 张表</span>
              <span class="ms-view-sep">|</span>
              <span>资产卡片 / 订单数据</span>
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
                  <th>别名</th>
                  <th>描述</th>
                  <th>数据源</th>
                  <th>资产卡片</th>
                  <th>数据标签</th>
                  <th>记录数</th>
                  <th>负责人</th>
                  <th>更新时间</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr class="ms-row-clickable">
                  <td class="td-link"><mark class="ms-hl">order</mark>_main</td>
                  <td><mark class="ms-hl">订单</mark>主表</td>
                  <td class="td-desc">核心<mark class="ms-hl">订单</mark>交易主表，记录所有订单基础信息</td>
                  <td>prod_mysql_master</td>
                  <td><span class="tag tag-blue">订单数据</span></td>
                  <td><span class="tag tag-green">核心指标</span> <span class="tag tag-purple">已认证</span></td>
                  <td>1,438,920</td>
                  <td>张明</td>
                  <td>2026-02-12 08:30</td>
                  <td class="td-actions"><i class="bi bi-eye" title="查看"></i></td>
                </tr>
                <tr class="ms-row-clickable">
                  <td class="td-link"><mark class="ms-hl">order</mark>_detail</td>
                  <td><mark class="ms-hl">订单</mark>明细表</td>
                  <td class="td-desc"><mark class="ms-hl">订单</mark>商品明细，包含SKU、数量、金额</td>
                  <td>prod_mysql_master</td>
                  <td><span class="tag tag-blue">订单数据</span></td>
                  <td><span class="tag tag-green">核心指标</span></td>
                  <td>3,892,105</td>
                  <td>张明</td>
                  <td>2026-02-12 08:30</td>
                  <td class="td-actions"><i class="bi bi-eye" title="查看"></i></td>
                </tr>
                <tr class="ms-row-clickable">
                  <td class="td-link"><mark class="ms-hl">order</mark>_status_log</td>
                  <td><mark class="ms-hl">订单</mark>状态变更日志</td>
                  <td class="td-desc">记录<mark class="ms-hl">订单</mark>状态流转的完整日志</td>
                  <td>prod_mysql_master</td>
                  <td><span class="tag tag-blue">订单数据</span></td>
                  <td><span class="tag tag-blue">事实表</span> <span class="tag tag-yellow">增量同步</span></td>
                  <td>5,620,340</td>
                  <td>李婷</td>
                  <td>2026-02-11 22:15</td>
                  <td class="td-actions"><i class="bi bi-eye" title="查看"></i></td>
                </tr>
                <tr class="ms-row-clickable">
                  <td class="td-link">dwd_<mark class="ms-hl">order</mark>_fact</td>
                  <td><mark class="ms-hl">订单</mark>事实宽表</td>
                  <td class="td-desc">关联用户、商品、支付的<mark class="ms-hl">订单</mark>宽表</td>
                  <td>dw_hive_dwd</td>
                  <td><span class="tag tag-blue">订单数据</span></td>
                  <td><span class="tag tag-blue">事实表</span> <span class="tag tag-purple">已认证</span></td>
                  <td>1,438,920</td>
                  <td>王强</td>
                  <td>2026-02-12 06:00</td>
                  <td class="td-actions"><i class="bi bi-eye" title="查看"></i></td>
                </tr>
                <tr class="ms-row-clickable">
                  <td class="td-link">dws_<mark class="ms-hl">order</mark>_daily</td>
                  <td><mark class="ms-hl">订单</mark>日汇总表</td>
                  <td class="td-desc">按天汇总<mark class="ms-hl">订单</mark>数、GMV、客单价等指标</td>
                  <td>dw_hive_dws</td>
                  <td><span class="tag tag-blue">订单数据</span></td>
                  <td><span class="tag tag-green">核心指标</span> <span class="tag tag-blue">聚合表</span></td>
                  <td>12,580</td>
                  <td>王强</td>
                  <td>2026-02-12 07:00</td>
                  <td class="td-actions"><i class="bi bi-eye" title="查看"></i></td>
                </tr>
                <tr class="ms-row-clickable">
                  <td class="td-link">ads_<mark class="ms-hl">order</mark>_overview</td>
                  <td><mark class="ms-hl">订单</mark>概览报表</td>
                  <td class="td-desc">面向管理层的<mark class="ms-hl">订单</mark>业务全局报表</td>
                  <td>dw_hive_ads</td>
                  <td><span class="tag tag-purple">营销报表</span></td>
                  <td><span class="tag tag-green">核心指标</span></td>
                  <td>365</td>
                  <td>赵丽</td>
                  <td>2026-02-12 07:30</td>
                  <td class="td-actions"><i class="bi bi-eye" title="查看"></i></td>
                </tr>
                <tr class="ms-row-clickable">
                  <td class="td-link"><mark class="ms-hl">order</mark>_refund</td>
                  <td><mark class="ms-hl">订单</mark>退款记录</td>
                  <td class="td-desc">退款申请、审核结果、退款金额明细</td>
                  <td>prod_mysql_master</td>
                  <td><span class="tag tag-blue">支付数据</span></td>
                  <td><span class="tag tag-red">敏感数据</span></td>
                  <td>89,450</td>
                  <td>李婷</td>
                  <td>2026-02-11 23:45</td>
                  <td class="td-actions"><i class="bi bi-eye" title="查看"></i></td>
                </tr>
                <tr class="ms-row-clickable">
                  <td class="td-link"><mark class="ms-hl">order</mark>_address</td>
                  <td>收货地址表</td>
                  <td class="td-desc">用户<mark class="ms-hl">订单</mark>关联的收货地址信息</td>
                  <td>prod_mysql_master</td>
                  <td><span class="tag tag-yellow">用户基础</span></td>
                  <td><span class="tag tag-red">敏感数据</span> <span class="tag tag-yellow">脱敏字段</span></td>
                  <td>528,630</td>
                  <td>张明</td>
                  <td>2026-02-12 08:30</td>
                  <td class="td-actions"><i class="bi bi-eye" title="查看"></i></td>
                </tr>
                <tr class="ms-row-clickable">
                  <td class="td-link"><mark class="ms-hl">order</mark>_payment</td>
                  <td><mark class="ms-hl">订单</mark>支付记录</td>
                  <td class="td-desc">支付流水、支付渠道、支付状态记录</td>
                  <td>prod_mysql_master</td>
                  <td><span class="tag tag-blue">支付数据</span></td>
                  <td><span class="tag tag-red">敏感数据</span> <span class="tag tag-purple">已认证</span></td>
                  <td>1,205,680</td>
                  <td>李婷</td>
                  <td>2026-02-12 08:30</td>
                  <td class="td-actions"><i class="bi bi-eye" title="查看"></i></td>
                </tr>
                <tr class="ms-row-clickable">
                  <td class="td-link"><mark class="ms-hl">order</mark>_coupon</td>
                  <td><mark class="ms-hl">订单</mark>优惠券关联</td>
                  <td class="td-desc"><mark class="ms-hl">订单</mark>使用的优惠券、满减规则关联</td>
                  <td>prod_mysql_master</td>
                  <td><span class="tag tag-purple">营销报表</span></td>
                  <td><span class="tag tag-blue">维度表</span></td>
                  <td>762,340</td>
                  <td>赵丽</td>
                  <td>2026-02-12 07:45</td>
                  <td class="td-actions"><i class="bi bi-eye" title="查看"></i></td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- 卡片视图 -->
          <div class="ms-card-view" id="msCardView" style="display:none;">
            <div class="ms-cards-grid">
              <div class="ms-asset-card ms-row-clickable">
                <div class="ac-header"><i class="bi bi-table"></i> <mark class="ms-hl">order</mark>_main</div>
                <div class="ac-title"><mark class="ms-hl">订单</mark>主表</div>
                <div class="ac-meta"><span><i class="bi bi-database"></i> prod_mysql_master</span><span><i class="bi bi-layers"></i> ODS</span></div>
                <div class="ac-stats"><span>记录数: <b>1,438,920</b></span><span>字段数: <b>32</b></span></div>
                <div class="ac-footer"><span class="ac-owner"><i class="bi bi-person"></i> 张明</span><span class="ac-time">2026-02-12</span></div>
              </div>
              <div class="ms-asset-card ms-row-clickable">
                <div class="ac-header"><i class="bi bi-table"></i> <mark class="ms-hl">order</mark>_detail</div>
                <div class="ac-title"><mark class="ms-hl">订单</mark>明细表</div>
                <div class="ac-meta"><span><i class="bi bi-database"></i> prod_mysql_master</span><span><i class="bi bi-layers"></i> ODS</span></div>
                <div class="ac-stats"><span>记录数: <b>3,892,105</b></span><span>字段数: <b>28</b></span></div>
                <div class="ac-footer"><span class="ac-owner"><i class="bi bi-person"></i> 张明</span><span class="ac-time">2026-02-12</span></div>
              </div>
              <div class="ms-asset-card ms-row-clickable">
                <div class="ac-header"><i class="bi bi-table"></i> <mark class="ms-hl">order</mark>_status_log</div>
                <div class="ac-title"><mark class="ms-hl">订单</mark>状态变更日志</div>
                <div class="ac-meta"><span><i class="bi bi-database"></i> prod_mysql_master</span><span><i class="bi bi-layers"></i> DWD</span></div>
                <div class="ac-stats"><span>记录数: <b>5,620,340</b></span><span>字段数: <b>15</b></span></div>
                <div class="ac-footer"><span class="ac-owner"><i class="bi bi-person"></i> 李婷</span><span class="ac-time">2026-02-11</span></div>
              </div>
              <div class="ms-asset-card ms-row-clickable">
                <div class="ac-header"><i class="bi bi-table"></i> dwd_<mark class="ms-hl">order</mark>_fact</div>
                <div class="ac-title"><mark class="ms-hl">订单</mark>事实宽表</div>
                <div class="ac-meta"><span><i class="bi bi-database"></i> dw_hive_dwd</span><span><i class="bi bi-layers"></i> DWD</span></div>
                <div class="ac-stats"><span>记录数: <b>1,438,920</b></span><span>字段数: <b>56</b></span></div>
                <div class="ac-footer"><span class="ac-owner"><i class="bi bi-person"></i> 王强</span><span class="ac-time">2026-02-12</span></div>
              </div>
              <div class="ms-asset-card ms-row-clickable">
                <div class="ac-header"><i class="bi bi-table"></i> dws_<mark class="ms-hl">order</mark>_daily</div>
                <div class="ac-title"><mark class="ms-hl">订单</mark>日汇总表</div>
                <div class="ac-meta"><span><i class="bi bi-database"></i> dw_hive_dws</span><span><i class="bi bi-layers"></i> DWS</span></div>
                <div class="ac-stats"><span>记录数: <b>12,580</b></span><span>字段数: <b>24</b></span></div>
                <div class="ac-footer"><span class="ac-owner"><i class="bi bi-person"></i> 王强</span><span class="ac-time">2026-02-12</span></div>
              </div>
              <div class="ms-asset-card ms-row-clickable">
                <div class="ac-header"><i class="bi bi-table"></i> ads_<mark class="ms-hl">order</mark>_overview</div>
                <div class="ac-title"><mark class="ms-hl">订单</mark>概览报表</div>
                <div class="ac-meta"><span><i class="bi bi-database"></i> dw_hive_ads</span><span><i class="bi bi-layers"></i> ADS</span></div>
                <div class="ac-stats"><span>记录数: <b>365</b></span><span>字段数: <b>18</b></span></div>
                <div class="ac-footer"><span class="ac-owner"><i class="bi bi-person"></i> 赵丽</span><span class="ac-time">2026-02-12</span></div>
              </div>
              <div class="ms-asset-card ms-row-clickable">
                <div class="ac-header"><i class="bi bi-table"></i> <mark class="ms-hl">order</mark>_refund</div>
                <div class="ac-title"><mark class="ms-hl">订单</mark>退款记录</div>
                <div class="ac-meta"><span><i class="bi bi-database"></i> prod_mysql_master</span><span><i class="bi bi-layers"></i> ODS</span></div>
                <div class="ac-stats"><span>记录数: <b>89,450</b></span><span>字段数: <b>12</b></span></div>
                <div class="ac-footer"><span class="ac-owner"><i class="bi bi-person"></i> 李婷</span><span class="ac-time">2026-02-11</span></div>
              </div>
              <div class="ms-asset-card ms-row-clickable">
                <div class="ac-header"><i class="bi bi-table"></i> <mark class="ms-hl">order</mark>_address</div>
                <div class="ac-title">收货地址表</div>
                <div class="ac-meta"><span><i class="bi bi-database"></i> prod_mysql_master</span><span><i class="bi bi-layers"></i> ODS</span></div>
                <div class="ac-stats"><span>记录数: <b>528,630</b></span><span>字段数: <b>18</b></span></div>
                <div class="ac-footer"><span class="ac-owner"><i class="bi bi-person"></i> 张明</span><span class="ac-time">2026-02-12</span></div>
              </div>
              <div class="ms-asset-card ms-row-clickable">
                <div class="ac-header"><i class="bi bi-table"></i> <mark class="ms-hl">order</mark>_payment</div>
                <div class="ac-title"><mark class="ms-hl">订单</mark>支付记录</div>
                <div class="ac-meta"><span><i class="bi bi-database"></i> prod_mysql_master</span><span><i class="bi bi-layers"></i> ODS</span></div>
                <div class="ac-stats"><span>记录数: <b>1,205,680</b></span><span>字段数: <b>22</b></span></div>
                <div class="ac-footer"><span class="ac-owner"><i class="bi bi-person"></i> 李婷</span><span class="ac-time">2026-02-12</span></div>
              </div>
              <div class="ms-asset-card ms-row-clickable">
                <div class="ac-header"><i class="bi bi-table"></i> <mark class="ms-hl">order</mark>_coupon</div>
                <div class="ac-title"><mark class="ms-hl">订单</mark>优惠券关联</div>
                <div class="ac-meta"><span><i class="bi bi-database"></i> prod_mysql_master</span><span><i class="bi bi-layers"></i> ODS</span></div>
                <div class="ac-stats"><span>记录数: <b>762,340</b></span><span>字段数: <b>14</b></span></div>
                <div class="ac-footer"><span class="ac-owner"><i class="bi bi-person"></i> 赵丽</span><span class="ac-time">2026-02-12</span></div>
              </div>
            </div>
          </div>

          <!-- 分页 -->
          <div class="ms-pagination" id="msPagination">
            <div class="page-info">共 156 条记录，每页 10 条</div>
            <div class="page-nav">
              <span class="page-btn disabled"><i class="bi bi-chevron-left"></i></span>
              <span class="page-num active">1</span>
              <span class="page-num">2</span>
              <span class="page-num">3</span>
              <span class="page-num">4</span>
              <span class="page-num">5</span>
              <span class="page-btn">...</span>
              <span class="page-num">16</span>
              <span class="page-btn"><i class="bi bi-chevron-right"></i></span>
            </div>
          </div>

          <!-- 表详情面板（默认隐藏，点击表名后显示） -->
          <div class="ms-detail-panel" id="msDetailPanel" style="display:none;">
            <div class="ms-detail-header">
              <button class="btn btn-outline btn-sm ms-back-btn"><i class="bi bi-arrow-left"></i> 返回列表</button>
              <span class="ms-detail-title" id="msDetailTitle">order_main — 订单主表</span>
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
                  <div class="ms-info-item"><span class="info-label">别名</span><span class="info-value">订单主表</span></div>
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
                  <thead><tr><th>序号</th><th>字段名</th><th>别名</th><th>类型</th><th>长度</th><th>允许空</th><th>主键</th><th>描述</th></tr></thead>
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
  `,

  /* 椤甸潰浜や簰鍒濆鍖?*/
  init: function (opts) {
    opts = opts || {};
    let _searchType = opts.searchType || 'table-search';

    // 填入从首页传来的关键词
    if (opts.keyword) {
      const input = document.querySelector('.ms-search-input');
      if (input) input.value = opts.keyword;
    }
    // 根据搜索类型激活对应按钮
    if (_searchType === 'field-search') {
      const fieldBtn = document.querySelector('.ms-search-type-btn[data-stype="field"]');
      const tableBtn = document.querySelector('.ms-search-type-btn[data-stype="table"]');
      if (fieldBtn && tableBtn) {
        tableBtn.classList.remove('active');
        fieldBtn.classList.add('active');
      }
    }

    // 保存原始表搜索HTML（用于切换回来）
    const _msListView = document.getElementById('msListView');
    const _msCardView = document.getElementById('msCardView');
    const _tableListHTML = _msListView ? _msListView.innerHTML : '';
    const _tableCardHTML = _msCardView ? _msCardView.innerHTML : '';

    function _normalizeActionCells() {
      document.querySelectorAll('#msListView .td-actions').forEach(cell => {
        cell.innerHTML = '<i class="bi bi-eye" title="查看"></i>';
      });
    }

    function _cleanText(text) {
      return String(text || '').replace(/\s+/g, ' ').trim();
    }

    const _tagColorPalette = ['blue', 'green', 'teal', 'purple', 'orange', 'red'];
    let _tagOptions = [
      { name: '核心指标', color: 'green' },
      { name: '已认证', color: 'purple' },
      { name: '事实表', color: 'blue' },
      { name: '增量同步', color: 'orange' },
      { name: '聚合表', color: 'blue' },
      { name: '敏感数据', color: 'red' },
      { name: '脱敏字段', color: 'orange' },
      { name: '维度表', color: 'blue' }
    ];
    let _activeTagCell = null;
    let _tagPopover = null;
    let _assetCardOptions = [
      { name: '订单数据', color: 'blue' },
      { name: '支付数据', color: 'teal' },
      { name: '用户基础', color: 'orange' },
      { name: '用户画像', color: 'purple' },
      { name: '商品信息', color: 'green' },
      { name: '营销报表', color: 'purple' },
      { name: '物流配送', color: 'teal' },
      { name: '库存管理', color: 'green' }
    ];
    let _activeAssetCell = null;
    let _assetPopover = null;

    function _escapeHTML(value) {
      return String(value || '').replace(/[&<>"']/g, ch => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[ch]));
    }

    function _tagColorFromClass(el) {
      if (!el) return 'blue';
      const classText = Array.from(el.classList || []).join(' ');
      if (classText.includes('tag-green') || classText.includes('ms-tag-green')) return 'green';
      if (classText.includes('tag-purple') || classText.includes('ms-tag-purple')) return 'purple';
      if (classText.includes('tag-red') || classText.includes('ms-tag-red')) return 'red';
      if (classText.includes('tag-yellow') || classText.includes('ms-tag-orange')) return 'orange';
      if (classText.includes('ms-tag-teal')) return 'teal';
      return 'blue';
    }

    function _tagOption(name, fallbackColor) {
      const tagName = _cleanText(name);
      if (!tagName) return null;
      let option = _tagOptions.find(item => item.name === tagName);
      if (!option) {
        option = { name: tagName, color: fallbackColor || 'blue' };
        _tagOptions.push(option);
      } else if (fallbackColor && !option.color) {
        option.color = fallbackColor;
      }
      return option;
    }

    function _readTagState(cell) {
      if (!cell) return [];
      if (cell.dataset.msTags) {
        try {
          return JSON.parse(cell.dataset.msTags).filter(item => item && item.name);
        } catch (err) {
          cell.removeAttribute('data-ms-tags');
        }
      }
      const tags = Array.from(cell.querySelectorAll('.tag, .ms-row-tag'))
        .map(tag => {
          const name = _cleanText(tag.dataset.msTag || tag.textContent.replace(/[×x]$/, ''));
          const option = _tagOption(name, _tagColorFromClass(tag));
          return option ? { name: option.name, color: option.color } : null;
        })
        .filter(Boolean);
      const unique = [];
      tags.forEach(tag => {
        if (!unique.some(item => item.name === tag.name)) unique.push(tag);
      });
      return unique;
    }

    function _saveTagState(cell, tags) {
      if (!cell) return;
      const unique = [];
      (tags || []).forEach(tag => {
        const option = _tagOption(tag.name, tag.color);
        if (option && !unique.some(item => item.name === option.name)) {
          unique.push({ name: option.name, color: option.color });
        }
      });
      cell.dataset.msTags = JSON.stringify(unique);
    }

    function _renderTagCell(cell, tags) {
      if (!cell) return;
      _saveTagState(cell, tags);
      const state = _readTagState(cell);
      cell.classList.add('ms-tag-table-cell');
      cell.innerHTML = `
        <div class="ms-tag-editor-cell" data-ms-tag-cell>
          <div class="ms-row-tag-list">
            ${state.map(tag => `
              <span class="ms-row-tag ms-tag-${tag.color}" data-ms-tag="${_escapeHTML(tag.name)}" title="${_escapeHTML(tag.name)}">
                <span class="ms-row-tag-text">${_escapeHTML(tag.name)}</span>
                <button type="button" class="ms-row-tag-remove" data-ms-tag-action="remove" title="删除标签">
                  <i class="bi bi-x"></i>
                </button>
              </span>
            `).join('')}
            <button type="button" class="ms-tag-add" data-ms-tag-action="open" title="添加标签">
              <i class="bi bi-plus"></i>
            </button>
          </div>
        </div>`;
    }

    function _enhanceTagCells() {
      document.querySelectorAll('#msListView table').forEach(table => {
        const headers = Array.from(table.querySelectorAll('thead th')).map(th => _cleanText(th.textContent));
        const tagIndex = headers.findIndex(text => text === '数据标签');
        if (tagIndex < 0) return;
        table.querySelectorAll('tbody tr').forEach(row => {
          const cell = row.querySelectorAll('td')[tagIndex];
          if (!cell || cell.querySelector('[data-ms-tag-cell]')) return;
          _renderTagCell(cell, _readTagState(cell));
        });
      });
    }

    function _positionTagPopover(anchor) {
      if (!_tagPopover || !anchor || !anchor.isConnected) return;
      const rect = anchor.getBoundingClientRect();
      const width = 342;
      const gap = 8;
      let left = rect.left;
      let top = rect.bottom + gap;
      left = Math.max(12, Math.min(left, window.innerWidth - width - 12));
      if (top + 360 > window.innerHeight) {
        top = Math.max(12, rect.top - 360 - gap);
      }
      _tagPopover.style.left = `${left}px`;
      _tagPopover.style.top = `${top}px`;
    }

    function _ensureTagPopover() {
      if (_tagPopover) return _tagPopover;
      _tagPopover = document.createElement('div');
      _tagPopover.className = 'ms-tag-popover';
      document.body.appendChild(_tagPopover);
      return _tagPopover;
    }

    function _closeTagPopover() {
      if (!_tagPopover) return;
      _tagPopover.remove();
      _tagPopover = null;
      _activeTagCell = null;
    }

    function _showTagToast(text) {
      const oldToast = document.querySelector('.ms-tag-toast');
      if (oldToast) oldToast.remove();
      const toast = document.createElement('div');
      toast.className = 'ms-tag-toast';
      toast.textContent = text;
      document.body.appendChild(toast);
      window.setTimeout(() => toast.classList.add('show'), 20);
      window.setTimeout(() => {
        toast.classList.remove('show');
        window.setTimeout(() => toast.remove(), 180);
      }, 1600);
    }

    function _addTagToCell(cell, option) {
      if (!cell || !option) return;
      const tags = _readTagState(cell);
      if (!tags.some(tag => tag.name === option.name)) {
        tags.push({ name: option.name, color: option.color });
        _renderTagCell(cell, tags);
      }
    }

    function _removeTagFromCell(cell, tagName) {
      if (!cell || !tagName) return;
      const nextTags = _readTagState(cell).filter(tag => tag.name !== tagName);
      _renderTagCell(cell, nextTags);
      _showTagToast('已删除标签');
    }

    function _renderTagPicker(anchor, keyword) {
      if (!_activeTagCell) return;
      const popover = _ensureTagPopover();
      const searchText = _cleanText(keyword);
      const selected = new Set(_readTagState(_activeTagCell).map(tag => tag.name));
      const list = _tagOptions.filter(tag => !searchText || tag.name.toLowerCase().includes(searchText.toLowerCase()));
      popover.innerHTML = `
        <div class="ms-tag-picker" data-ms-tag-popover>
          <div class="ms-tag-picker-search">
            <div class="ms-tag-search-box">
              <i class="bi bi-search"></i>
              <input type="text" class="ms-tag-search-input" placeholder="搜索标签" value="${_escapeHTML(searchText)}">
            </div>
            <button type="button" class="ms-tag-popover-add" data-ms-pop-action="create" title="新建标签">
              <i class="bi bi-plus-circle"></i>
            </button>
          </div>
          <div class="ms-tag-option-list">
            ${list.map(tag => `
              <div class="ms-tag-option ${selected.has(tag.name) ? 'selected' : ''}" data-ms-tag-name="${_escapeHTML(tag.name)}">
                <button type="button" class="ms-tag-option-main" data-ms-pop-action="toggle" title="${selected.has(tag.name) ? '已添加' : '添加标签'}">
                  <span class="ms-tag-dot ms-tag-dot-${tag.color}"></span>
                  <span class="ms-tag-option-name">${_escapeHTML(tag.name)}</span>
                  <i class="bi bi-check ms-tag-option-check"></i>
                </button>
                <button type="button" class="ms-tag-option-edit" data-ms-pop-action="edit" title="编辑标签">
                  <i class="bi bi-pencil"></i>
                </button>
              </div>
            `).join('') || '<div class="ms-tag-empty">没有匹配标签，可新建标签</div>'}
          </div>
        </div>`;
      _positionTagPopover(anchor);
      const input = popover.querySelector('.ms-tag-search-input');
      if (input) {
        input.focus();
        const len = input.value.length;
        input.setSelectionRange(len, len);
      }
      popover.onclick = (event) => {
        event.stopPropagation();
        const actionEl = event.target.closest('[data-ms-pop-action]');
        if (!actionEl) return;
        const action = actionEl.dataset.msPopAction;
        const optionName = actionEl.closest('.ms-tag-option')?.dataset.msTagName;
        const option = _tagOptions.find(tag => tag.name === optionName);
        if (action === 'create') {
          _renderTagEditor(anchor);
          return;
        }
        if (action === 'edit' && option) {
          _renderTagEditor(anchor, option.name);
          return;
        }
        if (action === 'toggle' && option) {
          const selectedTags = _readTagState(_activeTagCell);
          if (selectedTags.some(tag => tag.name === option.name)) {
            _renderTagCell(_activeTagCell, selectedTags.filter(tag => tag.name !== option.name));
            _showTagToast('已移除标签');
          } else {
            _addTagToCell(_activeTagCell, option);
            _showTagToast('已添加标签');
          }
          _renderTagPicker(anchor, searchText);
        }
      };
      popover.oninput = (event) => {
        if (event.target.matches('.ms-tag-search-input')) {
          _renderTagPicker(anchor, event.target.value);
        }
      };
    }

    function _renderTagEditor(anchor, tagName) {
      if (!_activeTagCell) return;
      const option = tagName ? _tagOptions.find(tag => tag.name === tagName) : null;
      const isCreate = !option;
      let selectedColor = option?.color || 'blue';
      const popover = _ensureTagPopover();
      popover.innerHTML = `
        <div class="ms-tag-editor-panel" data-ms-tag-popover>
          <div class="ms-tag-editor-head">
            <button type="button" class="ms-tag-icon-btn" data-ms-pop-action="back" title="返回">
              <i class="bi bi-chevron-left"></i>
            </button>
            <strong>${isCreate ? '新建标签' : '编辑标签'}</strong>
            <button type="button" class="ms-tag-icon-btn" data-ms-pop-action="close" title="关闭">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
          <div class="ms-tag-editor-body">
            <input type="text" class="ms-tag-name-input" placeholder="标签名称" value="${_escapeHTML(option?.name || '')}">
            <div class="ms-tag-color-row">
              ${_tagColorPalette.map(color => `
                <button type="button" class="ms-tag-color ms-tag-dot-${color} ${color === selectedColor ? 'active' : ''}" data-ms-color="${color}" title="选择颜色">
                  <i class="bi bi-check"></i>
                </button>
              `).join('')}
            </div>
            <div class="ms-tag-editor-actions">
              ${isCreate ? '' : '<button type="button" class="btn btn-outline btn-sm ms-tag-delete-btn" data-ms-pop-action="delete"><i class="bi bi-trash"></i>删除</button>'}
              <button type="button" class="btn btn-primary btn-sm ms-tag-save-btn" data-ms-pop-action="save" ${isCreate ? 'disabled' : ''}>
                <i class="bi bi-check2"></i>${isCreate ? '创建' : '完成'}
              </button>
            </div>
          </div>
        </div>`;
      _positionTagPopover(anchor);
      const input = popover.querySelector('.ms-tag-name-input');
      const saveBtn = popover.querySelector('.ms-tag-save-btn');
      const refreshSaveState = () => {
        if (saveBtn) saveBtn.disabled = !_cleanText(input?.value);
      };
      popover.querySelectorAll('.ms-tag-color').forEach(btn => {
        btn.addEventListener('click', event => {
          event.stopPropagation();
          selectedColor = btn.dataset.msColor;
          popover.querySelectorAll('.ms-tag-color').forEach(item => item.classList.remove('active'));
          btn.classList.add('active');
        });
      });
      if (input) {
        input.focus();
        input.addEventListener('input', refreshSaveState);
        input.setSelectionRange(input.value.length, input.value.length);
      }
      popover.onclick = (event) => {
        event.stopPropagation();
        const action = event.target.closest('[data-ms-pop-action]')?.dataset.msPopAction;
        if (!action) return;
        const currentName = _cleanText(input?.value);
        if (action === 'back') {
          _renderTagPicker(anchor, '');
          return;
        }
        if (action === 'close') {
          _closeTagPopover();
          return;
        }
        if (action === 'delete' && option) {
          _tagOptions = _tagOptions.filter(tag => tag.name !== option.name);
          document.querySelectorAll('#msListView .ms-tag-table-cell').forEach(cell => {
            _renderTagCell(cell, _readTagState(cell).filter(tag => tag.name !== option.name));
          });
          _showTagToast('已删除标签');
          _renderTagPicker(anchor, '');
          return;
        }
        if (action === 'save' && currentName) {
          const existing = _tagOptions.find(tag => tag.name === currentName);
          if (isCreate) {
            const created = existing || { name: currentName, color: selectedColor };
            if (!existing) _tagOptions.push(created);
            _addTagToCell(_activeTagCell, created);
            _showTagToast('已创建并添加标签');
            _renderTagPicker(anchor, '');
          } else if (option) {
            const oldName = option.name;
            let targetOption = option;
            if (existing && existing !== option) {
              existing.color = selectedColor;
              _tagOptions = _tagOptions.filter(tag => tag !== option);
              targetOption = existing;
            } else {
              option.name = currentName;
              option.color = selectedColor;
            }
            document.querySelectorAll('#msListView .ms-tag-table-cell').forEach(cell => {
              const nextTags = _readTagState(cell).map(tag => tag.name === oldName ? { name: targetOption.name, color: targetOption.color } : tag);
              _renderTagCell(cell, nextTags);
            });
            _showTagToast('已更新标签');
            _renderTagPicker(anchor, targetOption.name);
          }
        }
      };
      refreshSaveState();
    }

    function _openTagPicker(cell, anchor) {
      _closeAssetPopover();
      _activeTagCell = cell;
      _renderTagPicker(anchor, '');
    }

    function _bindTagInteractions() {
      if (!_msListView || _msListView.dataset.msTagBound) return;
      _msListView.dataset.msTagBound = 'true';
      _msListView.addEventListener('click', event => {
        const actionEl = event.target.closest('[data-ms-tag-action]');
        if (!actionEl) return;
        const cell = actionEl.closest('td');
        if (!cell) return;
        event.preventDefault();
        event.stopPropagation();
        if (actionEl.dataset.msTagAction === 'remove') {
          const tagName = actionEl.closest('.ms-row-tag')?.dataset.msTag;
          _removeTagFromCell(cell, tagName);
          return;
        }
        _openTagPicker(cell, actionEl);
      });
      _msListView.addEventListener('click', event => {
        const tag = event.target.closest('.ms-row-tag');
        if (!tag || event.target.closest('.ms-row-tag-remove')) return;
        const cell = tag.closest('td');
        if (!cell) return;
        event.preventDefault();
        event.stopPropagation();
        _openTagPicker(cell, tag);
      });
      document.addEventListener('click', event => {
        if (!_tagPopover) return;
        if (_tagPopover.contains(event.target) || event.target.closest('[data-ms-tag-action], .ms-row-tag')) return;
        _closeTagPopover();
      });
      document.addEventListener('keydown', event => {
        if (event.key === 'Escape') _closeTagPopover();
      });
    }

    function _assetCardOption(name, fallbackColor) {
      const cardName = _cleanText(name);
      if (!cardName) return null;
      let option = _assetCardOptions.find(item => item.name === cardName);
      if (!option) {
        option = { name: cardName, color: fallbackColor || 'blue' };
        _assetCardOptions.push(option);
      } else if (fallbackColor && !option.color) {
        option.color = fallbackColor;
      }
      return option;
    }

    function _readAssetCardState(cell) {
      if (!cell) return null;
      if (cell.dataset.msAssetCard) {
        try {
          const state = JSON.parse(cell.dataset.msAssetCard);
          return _assetCardOption(state.name, state.color);
        } catch (err) {
          cell.removeAttribute('data-ms-asset-card');
        }
      }
      const source = cell.querySelector('.ms-asset-card-pill, .tag') || cell;
      return _assetCardOption(source.dataset.msAssetCard || source.textContent, _tagColorFromClass(source));
    }

    function _renderAssetCardCell(cell, option) {
      if (!cell || !option) return;
      const current = _assetCardOption(option.name, option.color);
      cell.dataset.msAssetCard = JSON.stringify(current);
      cell.classList.add('ms-asset-table-cell');
      cell.innerHTML = `
        <button type="button" class="ms-asset-card-pill ms-tag-${current.color}" data-ms-asset-action="open" data-ms-asset-card="${_escapeHTML(current.name)}" title="切换资产卡片">
          <i class="bi bi-collection"></i>
          <span>${_escapeHTML(current.name)}</span>
          <i class="bi bi-chevron-down"></i>
        </button>`;
    }

    function _enhanceAssetCardCells() {
      document.querySelectorAll('#msListView table').forEach(table => {
        const headers = Array.from(table.querySelectorAll('thead th')).map(th => _cleanText(th.textContent));
        const assetIndex = headers.findIndex(text => text === '资产卡片');
        if (assetIndex < 0) return;
        table.querySelectorAll('tbody tr').forEach(row => {
          const cell = row.querySelectorAll('td')[assetIndex];
          if (!cell || cell.querySelector('[data-ms-asset-action]')) return;
          _renderAssetCardCell(cell, _readAssetCardState(cell));
        });
      });
    }

    function _positionAssetPopover(anchor) {
      if (!_assetPopover || !anchor || !anchor.isConnected) return;
      const rect = anchor.getBoundingClientRect();
      const width = 342;
      const gap = 8;
      let left = rect.left;
      let top = rect.bottom + gap;
      left = Math.max(12, Math.min(left, window.innerWidth - width - 12));
      if (top + 360 > window.innerHeight) {
        top = Math.max(12, rect.top - 360 - gap);
      }
      _assetPopover.style.left = `${left}px`;
      _assetPopover.style.top = `${top}px`;
    }

    function _ensureAssetPopover() {
      if (_assetPopover) return _assetPopover;
      _assetPopover = document.createElement('div');
      _assetPopover.className = 'ms-tag-popover ms-asset-popover';
      document.body.appendChild(_assetPopover);
      return _assetPopover;
    }

    function _closeAssetPopover() {
      if (!_assetPopover) return;
      _assetPopover.remove();
      _assetPopover = null;
      _activeAssetCell = null;
    }

    function _renderAssetCardPicker(anchor, keyword) {
      if (!_activeAssetCell) return;
      const popover = _ensureAssetPopover();
      const searchText = _cleanText(keyword);
      const selectedName = _readAssetCardState(_activeAssetCell)?.name;
      const list = _assetCardOptions.filter(card => !searchText || card.name.toLowerCase().includes(searchText.toLowerCase()));
      popover.innerHTML = `
        <div class="ms-tag-picker ms-asset-picker" data-ms-asset-popover>
          <div class="ms-tag-picker-search">
            <div class="ms-tag-search-box">
              <i class="bi bi-search"></i>
              <input type="text" class="ms-tag-search-input ms-asset-search-input" placeholder="搜索资产卡片" value="${_escapeHTML(searchText)}">
            </div>
            <button type="button" class="ms-tag-popover-add" data-ms-asset-pop-action="create" title="新建资产卡片">
              <i class="bi bi-plus-circle"></i>
            </button>
          </div>
          <div class="ms-tag-option-list">
            ${list.map(card => `
              <div class="ms-tag-option ${selectedName === card.name ? 'selected' : ''}" data-ms-asset-name="${_escapeHTML(card.name)}">
                <button type="button" class="ms-tag-option-main" data-ms-asset-pop-action="select" title="选择资产卡片">
                  <span class="ms-tag-dot ms-tag-dot-${card.color}"></span>
                  <span class="ms-tag-option-name">${_escapeHTML(card.name)}</span>
                  <i class="bi bi-check ms-tag-option-check"></i>
                </button>
                <button type="button" class="ms-tag-option-edit" data-ms-asset-pop-action="edit" title="编辑资产卡片">
                  <i class="bi bi-pencil"></i>
                </button>
              </div>
            `).join('') || '<div class="ms-tag-empty">没有匹配资产卡片，可新建资产卡片</div>'}
          </div>
        </div>`;
      _positionAssetPopover(anchor);
      const input = popover.querySelector('.ms-asset-search-input');
      if (input) {
        input.focus();
        input.setSelectionRange(input.value.length, input.value.length);
      }
      popover.onclick = (event) => {
        event.stopPropagation();
        const actionEl = event.target.closest('[data-ms-asset-pop-action]');
        if (!actionEl) return;
        const action = actionEl.dataset.msAssetPopAction;
        const optionName = actionEl.closest('.ms-tag-option')?.dataset.msAssetName;
        const option = _assetCardOptions.find(card => card.name === optionName);
        if (action === 'create') {
          _renderAssetCardEditor(anchor);
          return;
        }
        if (action === 'edit' && option) {
          _renderAssetCardEditor(anchor, option.name);
          return;
        }
        if (action === 'select' && option) {
          _renderAssetCardCell(_activeAssetCell, option);
          _showTagToast('已切换资产卡片');
          _closeAssetPopover();
        }
      };
      popover.oninput = (event) => {
        if (event.target.matches('.ms-asset-search-input')) {
          _renderAssetCardPicker(anchor, event.target.value);
        }
      };
    }

    function _renderAssetCardEditor(anchor, cardName) {
      if (!_activeAssetCell) return;
      const option = cardName ? _assetCardOptions.find(card => card.name === cardName) : null;
      const isCreate = !option;
      let selectedColor = option?.color || 'blue';
      const popover = _ensureAssetPopover();
      popover.innerHTML = `
        <div class="ms-tag-editor-panel ms-asset-editor-panel" data-ms-asset-popover>
          <div class="ms-tag-editor-head">
            <button type="button" class="ms-tag-icon-btn" data-ms-asset-pop-action="back" title="返回">
              <i class="bi bi-chevron-left"></i>
            </button>
            <strong>${isCreate ? '新建资产卡片' : '编辑资产卡片'}</strong>
            <button type="button" class="ms-tag-icon-btn" data-ms-asset-pop-action="close" title="关闭">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
          <div class="ms-tag-editor-body">
            <input type="text" class="ms-tag-name-input ms-asset-name-input" placeholder="资产卡片名称" value="${_escapeHTML(option?.name || '')}">
            <div class="ms-tag-color-row">
              ${_tagColorPalette.map(color => `
                <button type="button" class="ms-tag-color ms-tag-dot-${color} ${color === selectedColor ? 'active' : ''}" data-ms-color="${color}" title="选择颜色">
                  <i class="bi bi-check"></i>
                </button>
              `).join('')}
            </div>
            <div class="ms-tag-editor-actions">
              ${isCreate ? '' : '<button type="button" class="btn btn-outline btn-sm ms-tag-delete-btn" data-ms-asset-pop-action="delete"><i class="bi bi-trash"></i>删除</button>'}
              <button type="button" class="btn btn-primary btn-sm ms-tag-save-btn" data-ms-asset-pop-action="save" ${isCreate ? 'disabled' : ''}>
                <i class="bi bi-check2"></i>${isCreate ? '创建' : '完成'}
              </button>
            </div>
          </div>
        </div>`;
      _positionAssetPopover(anchor);
      const input = popover.querySelector('.ms-asset-name-input');
      const saveBtn = popover.querySelector('.ms-tag-save-btn');
      const refreshSaveState = () => {
        if (saveBtn) saveBtn.disabled = !_cleanText(input?.value);
      };
      popover.querySelectorAll('.ms-tag-color').forEach(btn => {
        btn.addEventListener('click', event => {
          event.stopPropagation();
          selectedColor = btn.dataset.msColor;
          popover.querySelectorAll('.ms-tag-color').forEach(item => item.classList.remove('active'));
          btn.classList.add('active');
        });
      });
      if (input) {
        input.focus();
        input.addEventListener('input', refreshSaveState);
        input.setSelectionRange(input.value.length, input.value.length);
      }
      popover.onclick = (event) => {
        event.stopPropagation();
        const action = event.target.closest('[data-ms-asset-pop-action]')?.dataset.msAssetPopAction;
        if (!action) return;
        const currentName = _cleanText(input?.value);
        if (action === 'back') {
          _renderAssetCardPicker(anchor, '');
          return;
        }
        if (action === 'close') {
          _closeAssetPopover();
          return;
        }
        if (action === 'delete' && option) {
          _assetCardOptions = _assetCardOptions.filter(card => card.name !== option.name);
          const fallback = _assetCardOptions[0] || { name: '订单数据', color: 'blue' };
          document.querySelectorAll('#msListView .ms-asset-table-cell').forEach(cell => {
            const current = _readAssetCardState(cell);
            if (current?.name === option.name) _renderAssetCardCell(cell, fallback);
          });
          _showTagToast('已删除资产卡片');
          _closeAssetPopover();
          return;
        }
        if (action === 'save' && currentName) {
          const existing = _assetCardOptions.find(card => card.name === currentName);
          if (isCreate) {
            const created = existing || { name: currentName, color: selectedColor };
            if (!existing) _assetCardOptions.push(created);
            _renderAssetCardCell(_activeAssetCell, created);
            _showTagToast('已创建并切换资产卡片');
            _closeAssetPopover();
          } else if (option) {
            const oldName = option.name;
            let targetOption = option;
            if (existing && existing !== option) {
              existing.color = selectedColor;
              _assetCardOptions = _assetCardOptions.filter(card => card !== option);
              targetOption = existing;
            } else {
              option.name = currentName;
              option.color = selectedColor;
            }
            document.querySelectorAll('#msListView .ms-asset-table-cell').forEach(cell => {
              const current = _readAssetCardState(cell);
              if (current?.name === oldName || current?.name === targetOption.name) {
                _renderAssetCardCell(cell, targetOption);
              }
            });
            _showTagToast('已更新资产卡片');
            _closeAssetPopover();
          }
        }
      };
      refreshSaveState();
    }

    function _openAssetCardPicker(cell, anchor) {
      _closeTagPopover();
      _activeAssetCell = cell;
      _renderAssetCardPicker(anchor, '');
    }

    function _bindAssetCardInteractions() {
      if (!_msListView || _msListView.dataset.msAssetBound) return;
      _msListView.dataset.msAssetBound = 'true';
      _msListView.addEventListener('click', event => {
        const actionEl = event.target.closest('[data-ms-asset-action]');
        if (!actionEl) return;
        const cell = actionEl.closest('td');
        if (!cell) return;
        event.preventDefault();
        event.stopPropagation();
        _openAssetCardPicker(cell, actionEl);
      });
      document.addEventListener('click', event => {
        if (!_assetPopover) return;
        if (_assetPopover.contains(event.target) || event.target.closest('[data-ms-asset-action]')) return;
        _closeAssetPopover();
      });
      document.addEventListener('keydown', event => {
        if (event.key === 'Escape') _closeAssetPopover();
      });
    }

    function _detailItemFromRow(row) {
      const tds = row.querySelectorAll('td');
      const isCard = row.classList.contains('ms-asset-card');
      const tableName = row.dataset.table || _cleanText((isCard ? row.querySelector('.ac-header') : tds[0])?.textContent || 'order_main');
      const alias = _searchType === 'field-search' ? '' : (isCard ? (row.querySelector('.ac-title')?.textContent || '') : (tds[1]?.textContent || ''));
      const comment = _searchType === 'field-search' ? '' : (isCard ? '' : (tds[2]?.textContent || ''));
      const dataSource = _searchType === 'field-search'
        ? (isCard ? row.querySelector('.ac-meta span:nth-child(2)')?.textContent : tds[4]?.textContent)
        : (isCard ? row.querySelector('.ac-meta span:first-child')?.textContent : tds[3]?.textContent);
      const layer = _searchType === 'field-search' ? '' : (isCard ? row.querySelector('.ac-meta span:nth-child(2)')?.textContent : tds[4]?.textContent);
      const recordText = _searchType === 'field-search' ? '' : (isCard ? row.querySelector('.ac-stats b')?.textContent : tds[6]?.textContent);
      const owner = isCard ? row.querySelector('.ac-owner')?.textContent : tds[7]?.textContent;
      const updateTime = isCard ? row.querySelector('.ac-time')?.textContent : tds[8]?.textContent;

      return {
        tableName: _cleanText(tableName) || 'order_main',
        alias: _cleanText(alias) || undefined,
        comment: _cleanText(comment) || undefined,
        dataSource: _cleanText(dataSource) || undefined,
        layer: _cleanText(layer) || undefined,
        recordCount: _cleanText(recordText) || undefined,
        owner: _cleanText(owner) || undefined,
        updateTime: _cleanText(updateTime) || undefined
      };
    }

    function _renderCommonDetail(item) {
      const detail = document.getElementById('msDetailPanel');
      if (!detail || !DP.components || !DP.components.tableDetailView) return;
      detail.classList.add('gt-detail-view');
      detail.innerHTML = DP.components.tableDetailView.renderInner(item, {
        backClass: 'btn btn-outline btn-sm ms-back-btn',
        titleId: 'msDetailTitle'
      });
      DP.components.tableDetailView.bind(detail);
    }

    _renderCommonDetail({ tableName: 'order_main', alias: '订单主表', comment: '核心订单交易主表，记录所有订单基础信息' });

    // ==== 切换搜索内容（表搜索 ↔ 字段搜索） ====
    function _applySearchContent(type) {
      _searchType = type;
      if (!_msListView || !_msCardView) return;
      _closeTagPopover();
      _closeAssetPopover();
      if (type === 'field-search') {
        _msListView.innerHTML = _fieldSearchListHTML;
        _msCardView.innerHTML = _fieldSearchCardHTML;
        const vi = document.querySelector('.ms-view-info span:first-child');
        if (vi) vi.innerHTML = '共 <b>328</b> 个字段';
        const pi = document.querySelector('#msPagination .page-info');
        if (pi) pi.textContent = '共 328 条记录，每页 10 条';
        const inp = document.querySelector('.ms-search-input');
        if (inp) inp.placeholder = '输入字段名或描述关键字搜索...';
      } else {
        _msListView.innerHTML = _tableListHTML;
        _msCardView.innerHTML = _tableCardHTML;
        const vi = document.querySelector('.ms-view-info span:first-child');
        if (vi) vi.innerHTML = '共 <b>156</b> 张表';
        const pi = document.querySelector('#msPagination .page-info');
        if (pi) pi.textContent = '共 156 条记录，每页 10 条';
        const inp = document.querySelector('.ms-search-input');
        if (inp) inp.placeholder = '输入表名、别名或描述关键字搜索...';
      }
      // 重置到列表视图
      const detail = document.getElementById('msDetailPanel');
      const viewBar = document.querySelector('.ms-view-bar');
      const pagination = document.getElementById('msPagination');
      if (detail) detail.style.display = 'none';
      if (viewBar) viewBar.style.display = 'flex';
      if (pagination) pagination.style.display = 'flex';
      _msListView.style.display = 'block';
      _msCardView.style.display = 'none';
      document.querySelectorAll('.ms-view-btn').forEach(b => b.classList.remove('active'));
      document.querySelector('.ms-view-btn[data-view="list"]')?.classList.add('active');
      _normalizeActionCells();
      _enhanceAssetCardCells();
      _enhanceTagCells();
      _bindRowClicks();
    }

    // ==== 绑定结果行/卡片点击 → 进入详情 ====
    function _bindRowClicks() {
      document.querySelectorAll('#msListView .ms-row-clickable, #msCardView .ms-row-clickable').forEach(row => {
        row.addEventListener('click', (event) => {
          if (row.closest('#msListView') && !event.target.closest('.td-link, .td-actions .bi-eye')) return;
          const list = document.getElementById('msListView');
          const card = document.getElementById('msCardView');
          const detail = document.getElementById('msDetailPanel');
          const viewBar = document.querySelector('.ms-view-bar');
          const pagination = document.getElementById('msPagination');
          const detailItem = _detailItemFromRow(row);
          _renderCommonDetail(detailItem);
          if (list) list.style.display = 'none';
          if (card) card.style.display = 'none';
          if (viewBar) viewBar.style.display = 'none';
          if (pagination) pagination.style.display = 'none';
          if (detail) detail.style.display = 'flex';

          if (_searchType === 'field-search') {
            const fieldName = row.dataset.field;
            const tableName = detailItem.tableName;
            // 更新详情标题
            const detailTitle = document.getElementById('msDetailTitle');
            if (detailTitle && tableName) {
              detailTitle.innerHTML = tableName + ' — <span class="ms-field-from">字段: ' + (fieldName || '') + '</span>';
            }
            // 自动切换到"表结构"tab
            document.querySelectorAll('.ms-dtab').forEach(t => t.classList.remove('active'));
            const structTab = document.querySelector('.ms-dtab[data-tab="structure"]');
            if (structTab) structTab.classList.add('active');
            document.querySelectorAll('.ms-tab-content').forEach(c => c.classList.remove('active'));
            const structContent = document.querySelector('.ms-tab-content[data-content="structure"]');
            if (structContent) structContent.classList.add('active');
            // 高亮对应字段行
            document.querySelectorAll('.ms-tab-content[data-content="structure"] tbody tr').forEach(tr => {
              tr.classList.remove('ms-field-active');
              const tdField = tr.querySelectorAll('td')[1];
              if (tdField && tdField.textContent.trim() === fieldName) {
                tr.classList.add('ms-field-active');
              }
            });
          } else {
            // 表搜索 - 默认显示元数据详情tab
            document.querySelectorAll('.ms-field-active').forEach(el => el.classList.remove('ms-field-active'));
            document.querySelectorAll('.ms-dtab').forEach(t => t.classList.remove('active'));
            const metaTab = document.querySelector('.ms-dtab[data-tab="meta-info"]');
            if (metaTab) metaTab.classList.add('active');
            document.querySelectorAll('.ms-tab-content').forEach(c => c.classList.remove('active'));
            const metaContent = document.querySelector('.ms-tab-content[data-content="meta-info"]');
            if (metaContent) metaContent.classList.add('active');
          }
        });
      });
    }

    // 搜索类型按钮切换（同时切换列表/卡片内容）
    document.querySelectorAll('.ms-search-type-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.ms-search-type-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const newType = btn.dataset.stype === 'field' ? 'field-search' : 'table-search';
        if (newType !== _searchType) {
          _applySearchContent(newType);
        }
      });
    });

    // 筛选条件 - 展开/收起
    document.querySelectorAll('.ms-filter-expand').forEach(expandBtn => {
      expandBtn.addEventListener('click', () => {
        const targetId = expandBtn.dataset.target;
        const tagsEl = document.getElementById(targetId);
        if (!tagsEl) return;
        const isExpanded = tagsEl.classList.contains('expanded');
        if (isExpanded) {
          tagsEl.classList.remove('expanded');
          expandBtn.classList.remove('expanded');
          expandBtn.innerHTML = '<i class="bi bi-chevron-down"></i> 展开';
        } else {
          tagsEl.classList.add('expanded');
          expandBtn.classList.add('expanded');
          expandBtn.innerHTML = '<i class="bi bi-chevron-up"></i> 收起';
        }
      });
    });

    // 筛选条件 - 多选（"不限"互斥逻辑）
    document.querySelectorAll('.ms-filter-tags').forEach(tagsContainer => {
      tagsContainer.querySelectorAll('.ms-filter-tag').forEach(tag => {
        tag.addEventListener('click', () => {
          const val = tag.dataset.val;
          if (val === 'all') {
            // 点击"不限"→ 取消其余所有选中，仅激活"不限"
            tagsContainer.querySelectorAll('.ms-filter-tag').forEach(t => t.classList.remove('active'));
            tag.classList.add('active');
          } else {
            // 点击其他标签 → 取消"不限"
            const allTag = tagsContainer.querySelector('.ms-filter-tag[data-val="all"]');
            if (allTag) allTag.classList.remove('active');
            // 切换当前标签的选中状态
            tag.classList.toggle('active');
            // 如果没有任何标签被选中，则恢复"不限"
            const anyActive = tagsContainer.querySelector('.ms-filter-tag.active');
            if (!anyActive && allTag) allTag.classList.add('active');
          }
        });
      });
    });

    // 排序条件切换（支持升降序箭头）
    document.querySelectorAll('.ms-sort-item').forEach(sortItem => {
      sortItem.addEventListener('click', () => {
        const wasActive = sortItem.classList.contains('active');
        if (wasActive) {
          // 已激活：切换升降序
          const dir = sortItem.dataset.dir === 'desc' ? 'asc' : 'desc';
          sortItem.dataset.dir = dir;
          const arrows = sortItem.querySelector('.ms-sort-arrows');
          if (arrows) {
            arrows.querySelectorAll('i').forEach(i => i.classList.remove('ms-arrow-active'));
            if (dir === 'asc') {
              arrows.querySelector('.bi-caret-up-fill')?.classList.add('ms-arrow-active');
            } else {
              arrows.querySelector('.bi-caret-down-fill')?.classList.add('ms-arrow-active');
            }
          }
        } else {
          // 未激活：切换到此排序，默认降序
          document.querySelectorAll('.ms-sort-item').forEach(s => {
            s.classList.remove('active');
            const a = s.querySelector('.ms-sort-arrows');
            if (a) a.querySelectorAll('i').forEach(i => i.classList.remove('ms-arrow-active'));
          });
          sortItem.classList.add('active');
          sortItem.dataset.dir = 'desc';
          const arrows = sortItem.querySelector('.ms-sort-arrows');
          if (arrows) {
            arrows.querySelector('.bi-caret-down-fill')?.classList.add('ms-arrow-active');
          }
        }
      });
    });

    // 分页交互
    document.querySelectorAll('.ms-pagination .page-num').forEach(num => {
      num.addEventListener('click', () => {
        document.querySelectorAll('.ms-pagination .page-num').forEach(n => n.classList.remove('active'));
        num.classList.add('active');
      });
    });

    // 目录 tab 切换（数据目录 / 数据源目录）
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
          const node = toggle.closest('.ms-tnode');
          node?.classList.toggle('open');
          const icon = toggle.querySelector('i');
          if (icon && node) icon.className = node.classList.contains('open') ? 'bi bi-chevron-down' : 'bi bi-chevron-right';
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
          _closeTagPopover();
          _closeAssetPopover();
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

    // 点击表名或卡片进入详情（初始绑定，后续由 _applySearchContent 重新绑定）
    _normalizeActionCells();
    _enhanceAssetCardCells();
    _enhanceTagCells();
    _bindAssetCardInteractions();
    _bindTagInteractions();
    _bindRowClicks();

    // 返回列表
    const detailPanel = document.getElementById('msDetailPanel');
    if (detailPanel) {
      detailPanel.addEventListener('click', (event) => {
        if (!event.target.closest('.ms-back-btn')) return;
        const list = document.getElementById('msListView');
        const card = document.getElementById('msCardView');
        const detail = document.getElementById('msDetailPanel');
        const viewBar = document.querySelector('.ms-view-bar');
        const pagination = document.getElementById('msPagination');
        const activeView = document.querySelector('.ms-view-btn.active');
        if (detail) detail.style.display = 'none';
        if (viewBar) viewBar.style.display = 'flex';
        if (pagination) pagination.style.display = 'flex';
        // 清除字段高亮
        document.querySelectorAll('.ms-field-active').forEach(el => el.classList.remove('ms-field-active'));
        // 恢复详情标题
        const detailTitle = document.getElementById('msDetailTitle');
        if (detailTitle) detailTitle.textContent = 'order_main — 订单主表';
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

    // 初始化：如果是字段搜索则切换内容
    if (_searchType === 'field-search') {
      _applySearchContent('field-search');
    }
    }
};
