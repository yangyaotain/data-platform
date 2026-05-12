/**
 * 数据中台 V4.0 - 数据治理 / 资产概览
 */
window.DP = window.DP || {};
DP.pages = DP.pages || {};

DP.pages.governanceOverview = {
  html: `
    <div class="page-governance-overview">
      <div class="gov-overview-header">
        <div>
          <div class="gov-overview-kicker">数据治理 / 资产概览</div>
          <div class="gov-overview-title">
            <i class="bi bi-speedometer2"></i>
            <div>
              <h1>资产概览</h1>
              <div class="gov-overview-subtitle">统一查看治理资产覆盖、审核事项、治理任务和资源使用情况。</div>
            </div>
          </div>
        </div>
        <div class="gov-overview-actions">
          <button class="btn btn-outline"><i class="bi bi-arrow-clockwise"></i> 刷新</button>
          <button class="btn btn-outline"><i class="bi bi-download"></i> 导出</button>
          <button class="btn btn-primary"><i class="bi bi-plus-lg"></i> 发起治理</button>
        </div>
      </div>

      <div class="gov-overview-body">
        <div class="gov-kpi-grid">
          <div class="gov-kpi-card">
            <div class="gov-kpi-icon"><i class="bi bi-boxes"></i></div>
            <div><div class="gov-kpi-value">12,846</div><div class="gov-kpi-label">资产总量</div><div class="gov-kpi-trend">较上月 +8.2%</div></div>
          </div>
          <div class="gov-kpi-card">
            <div class="gov-kpi-icon"><i class="bi bi-shield-check"></i></div>
            <div><div class="gov-kpi-value">86.5%</div><div class="gov-kpi-label">治理覆盖率</div><div class="gov-kpi-trend">较上月 +3.1%</div></div>
          </div>
          <div class="gov-kpi-card">
            <div class="gov-kpi-icon"><i class="bi bi-hourglass-split"></i></div>
            <div><div class="gov-kpi-value">38</div><div class="gov-kpi-label">待审核事项</div><div class="gov-kpi-trend">今日新增 6</div></div>
          </div>
          <div class="gov-kpi-card">
            <div class="gov-kpi-icon"><i class="bi bi-check2-circle"></i></div>
            <div><div class="gov-kpi-value">92.4%</div><div class="gov-kpi-label">任务完成率</div><div class="gov-kpi-trend">较上周 +4.6%</div></div>
          </div>
        </div>

        <div class="gov-layout-grid">
          <section class="gov-panel">
            <div class="gov-panel-header">
              <div class="gov-panel-title"><i class="bi bi-clipboard-data"></i><span>治理域覆盖情况</span></div>
              <button class="btn btn-outline btn-sm">查看详情</button>
            </div>
            <div class="gov-panel-body">
              <div class="gov-progress-list">
                <div class="gov-progress-item"><div class="gov-progress-name">元数据治理</div><div class="gov-progress-track"><div class="gov-progress-bar" style="width:92%;"></div></div><div class="gov-progress-value">92%</div></div>
                <div class="gov-progress-item"><div class="gov-progress-name">标准落标</div><div class="gov-progress-track"><div class="gov-progress-bar" style="width:76%;"></div></div><div class="gov-progress-value">76%</div></div>
                <div class="gov-progress-item"><div class="gov-progress-name">质量规则</div><div class="gov-progress-track"><div class="gov-progress-bar" style="width:68%;"></div></div><div class="gov-progress-value">68%</div></div>
                <div class="gov-progress-item"><div class="gov-progress-name">资源使用</div><div class="gov-progress-track"><div class="gov-progress-bar" style="width:81%;"></div></div><div class="gov-progress-value">81%</div></div>
                <div class="gov-progress-item"><div class="gov-progress-name">项目纳管</div><div class="gov-progress-track"><div class="gov-progress-bar" style="width:88%;"></div></div><div class="gov-progress-value">88%</div></div>
              </div>
            </div>
          </section>

          <section class="gov-panel">
            <div class="gov-panel-header">
              <div class="gov-panel-title"><i class="bi bi-inbox"></i><span>待处理事项</span></div>
              <span class="tag tag-yellow">38 项</span>
            </div>
            <div class="gov-panel-body">
              <div class="gov-task-list">
                <div class="gov-task-item"><div class="gov-task-icon"><i class="bi bi-tags"></i></div><div class="gov-task-main"><div class="gov-task-title">客户域字段标准待审核</div><div class="gov-task-meta">标准审核 · 李婷提交 · 今天 10:24</div></div><span class="tag tag-yellow">待审</span></div>
                <div class="gov-task-item"><div class="gov-task-icon"><i class="bi bi-search"></i></div><div class="gov-task-main"><div class="gov-task-title">订单主题元数据变更审核</div><div class="gov-task-meta">元数据审核 · 张明提交 · 今天 09:18</div></div><span class="tag tag-blue">处理中</span></div>
                <div class="gov-task-item"><div class="gov-task-icon"><i class="bi bi-kanban"></i></div><div class="gov-task-main"><div class="gov-task-title">营销域治理规划待确认</div><div class="gov-task-meta">治理规划 · 王强负责 · 昨天</div></div><span class="tag tag-purple">确认中</span></div>
                <div class="gov-task-item"><div class="gov-task-icon"><i class="bi bi-hdd-stack"></i></div><div class="gov-task-main"><div class="gov-task-title">实时项目资源使用超阈值</div><div class="gov-task-meta">资源概览 · 平台自动发现 · 昨天</div></div><span class="tag tag-red">预警</span></div>
              </div>
            </div>
          </section>
        </div>

        <div class="gov-bottom-grid">
          <section class="gov-panel">
            <div class="gov-panel-header">
              <div class="gov-panel-title"><i class="bi bi-layers"></i><span>资产分层统计</span></div>
            </div>
            <div class="gov-panel-body">
              <div class="gov-layer-grid">
                <div class="gov-layer-card"><div class="gov-layer-name"><b>ODS</b><span>贴源层</span></div><div class="gov-layer-count">4,286</div></div>
                <div class="gov-layer-card"><div class="gov-layer-name"><b>DWD</b><span>明细层</span></div><div class="gov-layer-count">3,142</div></div>
                <div class="gov-layer-card"><div class="gov-layer-name"><b>DWS</b><span>汇总层</span></div><div class="gov-layer-count">1,806</div></div>
                <div class="gov-layer-card"><div class="gov-layer-name"><b>DIM</b><span>维度层</span></div><div class="gov-layer-count">924</div></div>
                <div class="gov-layer-card"><div class="gov-layer-name"><b>ADS</b><span>应用层</span></div><div class="gov-layer-count">1,228</div></div>
                <div class="gov-layer-card"><div class="gov-layer-name"><b>DM</b><span>集市层</span></div><div class="gov-layer-count">486</div></div>
              </div>
            </div>
          </section>

          <section class="gov-panel">
            <div class="gov-panel-header">
              <div class="gov-panel-title"><i class="bi bi-bar-chart-line"></i><span>项目资源使用排行</span></div>
              <button class="btn btn-outline btn-sm">资源管理</button>
            </div>
            <div class="gov-panel-body">
              <div class="gov-resource-row"><div class="gov-resource-name">电商交易数仓</div><div class="gov-progress-track"><div class="gov-progress-bar" style="width:86%;"></div></div><div>86%</div></div>
              <div class="gov-resource-row"><div class="gov-resource-name">实时监控项目</div><div class="gov-progress-track"><div class="gov-progress-bar" style="width:74%;"></div></div><div>74%</div></div>
              <div class="gov-resource-row"><div class="gov-resource-name">用户画像中心</div><div class="gov-progress-track"><div class="gov-progress-bar" style="width:69%;"></div></div><div>69%</div></div>
              <div class="gov-resource-row"><div class="gov-resource-name">营销分析平台</div><div class="gov-progress-track"><div class="gov-progress-bar" style="width:63%;"></div></div><div>63%</div></div>
              <div class="gov-resource-row"><div class="gov-resource-name">财务报表平台</div><div class="gov-progress-track"><div class="gov-progress-bar" style="width:51%;"></div></div><div>51%</div></div>
            </div>
          </section>
        </div>
      </div>
    </div>
  `,

  init: function () {}
};
