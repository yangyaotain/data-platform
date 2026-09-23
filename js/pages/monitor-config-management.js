/** 运维监控 / 系统管理 / 配置管理。 */
window.DP = window.DP || {};
DP.pages = DP.pages || {};

DP.pages.monitorConfigManagement = (function () {
  'use strict';

  var pageEl = null;
  var toastTimer = null;
  var state = { keyword: '', page: 1, pageSize: 10, modal: '', editingId: '', optionRows: 0 };
  var rows = [
    { id:'cfg-01', key:'businessFlowName', name:'任务名称', type:'暂无', remark:'业务流程名称', builtIn:true },
    { id:'cfg-02', key:'projectId', name:'项目名称', type:'暂无', remark:'项目名称', builtIn:true },
    { id:'cfg-03', key:'version', name:'版本', type:'字符串类型', remark:'流程版本号', builtIn:true },
    { id:'cfg-04', key:'envId', name:'环境', type:'选项类型', remark:'监控校验时，1 研发环境，2 测试环境，3 生产环境', builtIn:true },
    { id:'cfg-05', key:'flowName', name:'流程名称', type:'暂无', remark:'子流程名称', builtIn:true },
    { id:'cfg-06', key:'jobStatus', name:'执行结果', type:'选项类型', remark:'流程状态 2：成功，3：失败', builtIn:true },
    { id:'cfg-07', key:'duration', name:'任务运行时长', type:'数字类型', remark:'运行时长', builtIn:true },
    { id:'cfg-08', key:'inputRecords', name:'读取记录数', type:'数字类型', remark:'读取记录数', builtIn:true },
    { id:'cfg-09', key:'outputRecords', name:'写入记录数', type:'数字类型', remark:'输出记录数', builtIn:true },
    { id:'cfg-10', key:'startTime', name:'任务开始时间', type:'时间类型', remark:'开始时间', builtIn:true },
    { id:'cfg-11', key:'endTime', name:'任务结束时间', type:'时间类型', remark:'结束时间', builtIn:true },
    { id:'cfg-12', key:'interfaceName', name:'接口名称', type:'字符串类型', remark:'接口名称', builtIn:true },
    { id:'cfg-13', key:'responseTime', name:'接口响应时间', type:'数字类型', remark:'接口响应时间', builtIn:true },
    { id:'cfg-14', key:'callStatus', name:'接口调用状态', type:'选项类型', remark:'接口调用状态 1：成功，2：失败', builtIn:true },
    { id:'cfg-15', key:'interfaceConcurrency', name:'接口并发数', type:'数字类型', remark:'接口并发数', builtIn:true },
    { id:'cfg-16', key:'planJobStatus', name:'计划监控状态', type:'选项类型', remark:'监控校验时，1 正常（计划状态与运行状态一致），0 异常', builtIn:true },
    { id:'cfg-17', key:'scheduleOverTime', name:'调度超时时间', type:'数字类型', remark:'调度超时时间', builtIn:true },
    { id:'cfg-18', key:'avgExecuteTime', name:'平均执行时间偏差', type:'数字类型', remark:'执行时间偏差（执行时间－平均执行时间）', builtIn:true },
    { id:'cfg-19', key:'flowType', name:'流程类型', type:'选项类型', remark:'业务流程类型', builtIn:true },
    { id:'cfg-20', key:'database', name:'数据库', type:'暂无', remark:'数据库名称', builtIn:true },
    { id:'cfg-21', key:'table', name:'表', type:'暂无', remark:'数据表名称', builtIn:true },
    { id:'cfg-22', key:'changeFlag', name:'表结构变更', type:'选项类型', remark:'表结构是否变更，1 是，0 否', builtIn:true }
  ];

  function esc(value) { return String(value == null ? '' : value).replace(/[&<>"']/g, function (char) { return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[char]; }); }
  function option(value, selected) { return '<option value="' + esc(value) + '"' + (value === selected ? ' selected' : '') + '>' + esc(value) + '</option>'; }
  function findRow(id) { return rows.find(function (row) { return row.id === id; }); }
  function filteredRows() {
    var keyword=state.keyword.trim().toLowerCase();
    return keyword ? rows.filter(function (row) { return (row.key + ' ' + row.name).toLowerCase().indexOf(keyword) >= 0; }) : rows.slice();
  }

  function shellHtml() {
    return '<div class="mcm-layout"><aside class="mcm-category"><button type="button" class="active"><i class="bi bi-sliders"></i><span>监控事项参数</span></button></aside><section class="mcm-panel"><div class="mcm-toolbar"><button type="button" class="btn btn-primary" data-mcm-action="create"><i class="bi bi-plus-lg"></i><span>新建</span></button><form data-mcm-query><label class="mcm-keyword"><i class="bi bi-search"></i><input type="text" placeholder="请输入名称关键词" data-mcm-keyword></label><button type="submit" class="btn btn-primary"><i class="bi bi-search"></i><span>查询</span></button></form></div><div data-mcm-table></div></section></div>' + modalHtml() + '<div class="mcm-toast" data-mcm-toast role="status"></div>';
  }

  function tableHtml() {
    var data=filteredRows(), pages=Math.max(1,Math.ceil(data.length/state.pageSize));
    state.page=Math.min(state.page,pages);
    var start=(state.page-1)*state.pageSize, visible=data.slice(start,start+state.pageSize);
    var body=visible.length ? visible.map(function (row) {
      var actions=row.builtIn ? '<span class="mcm-built-in">--</span>' : '<div class="mcm-row-actions"><button type="button" data-mcm-row-action="edit" data-id="' + esc(row.id) + '"><i class="bi bi-pencil-square"></i><span>修改</span></button><button type="button" data-mcm-row-action="delete" data-id="' + esc(row.id) + '"><i class="bi bi-trash"></i><span>删除</span></button></div>';
      return '<tr><td>' + esc(row.key) + '</td><td>' + esc(row.name) + '</td><td>' + esc(row.type) + '</td><td title="' + esc(row.remark) + '">' + esc(row.remark) + '</td><td>' + actions + '</td></tr>';
    }).join('') : '<tr><td colspan="5"><div class="mcm-empty"><i class="bi bi-inbox"></i><span>暂无符合条件的参数</span></div></td></tr>';
    return '<div class="mcm-table-wrap"><table class="ds-table mcm-table"><thead><tr><th>KEY</th><th>参数名称</th><th>数据类型</th><th>备注</th><th>操作</th></tr></thead><tbody>' + body + '</tbody></table></div>' + paginationHtml(data.length,pages,start,visible.length);
  }

  function paginationHtml(total,pages,start,count) {
    var buttons=[];
    for(var page=1;page<=pages;page+=1)buttons.push('<button type="button" data-mcm-page="' + page + '" class="' + (page===state.page?'active':'') + '">' + page + '</button>');
    return '<div class="mcm-pagination"><span>' + (total ? '第' + (start+1) + '到第' + (start+count) + '条，共' + total + '条数据' : '共0条数据') + '</span><div class="mcm-page-nav"><button type="button" data-mcm-page="prev"' + (state.page===1?' disabled':'') + '><i class="bi bi-chevron-left"></i><span>上一页</span></button>' + buttons.join('') + '<button type="button" data-mcm-page="next"' + (state.page===pages?' disabled':'') + '><span>下一页</span><i class="bi bi-chevron-right"></i></button></div><select data-mcm-page-size>' + [10,20,50].map(function(size){return '<option value="' + size + '"' + (state.pageSize===size?' selected':'') + '>' + size + ' 条/页</option>';}).join('') + '</select><label>跳至 <input type="number" value="' + state.page + '" min="1" max="' + pages + '" data-mcm-jump> 页</label></div>';
  }

  function modalHtml() {
    return '<div class="mcm-modal" data-mcm-modal hidden><div class="mcm-modal-mask" data-mcm-close></div><section class="mcm-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="mcmModalTitle"><header class="mcm-modal-head"><h3 id="mcmModalTitle"></h3><button type="button" class="mcm-modal-x" data-mcm-close aria-label="关闭"><i class="bi bi-x-lg"></i></button></header><div class="mcm-modal-body" data-mcm-modal-body></div><footer class="mcm-modal-foot" data-mcm-modal-foot></footer></section></div>';
  }
  function openModal(title,body,foot) {
    var modal=pageEl.querySelector('[data-mcm-modal]');
    modal.querySelector('#mcmModalTitle').textContent=title;
    modal.querySelector('[data-mcm-modal-body]').innerHTML=body;
    modal.querySelector('[data-mcm-modal-foot]').innerHTML=foot;
    modal.hidden=false;
  }
  function closeModal() { var modal=pageEl.querySelector('[data-mcm-modal]'); if(modal)modal.hidden=true; state.modal=''; state.editingId=''; state.optionRows=0; }
  function modalButtons(action) { return '<button type="button" class="btn btn-default" data-mcm-close><i class="bi bi-x-lg"></i><span>取消</span></button><button type="button" class="btn btn-primary" data-mcm-confirm="' + action + '"><i class="bi bi-check-lg"></i><span>确定</span></button>'; }

  function optionRowsHtml(values) {
    values=values || [];
    return values.map(function (item,index) { return '<div class="mcm-option-row" data-mcm-option-row><input type="text" maxlength="50" placeholder="输入选项名称" value="' + esc(item.name || '') + '"><input type="text" maxlength="50" placeholder="输入选项值" value="' + esc(item.value || '') + '">' + (index ? '<button type="button" data-mcm-option-remove aria-label="删除该选项"><i class="bi bi-trash"></i></button>' : '<span></span>') + '</div>'; }).join('');
  }
  function parameterModal(row) {
    var editing=!!row, values=editing && row.options ? row.options : [];
    state.modal='parameter'; state.editingId=editing?row.id:''; state.optionRows=values.length;
    var type=editing?row.type:'字符串类型';
    var body='<form class="mcm-form" data-mcm-parameter-form><label><span><em>*</em> KEY：</span><input type="text" maxlength="50" placeholder="英文，50个字符以内" value="' + esc(editing?row.key:'') + '" data-mcm-field="key"' + (editing?' disabled':'') + '></label><label><span><em>*</em> 参数名称：</span><input type="text" maxlength="50" placeholder="50个字符以内" value="' + esc(editing?row.name:'') + '" data-mcm-field="name"></label><label><span><em>*</em> 数据类型：</span><select data-mcm-field="type">' + ['字符串类型','选项类型','数字类型','时间类型'].map(function(item){return option(item,type);}).join('') + '</select></label><div class="mcm-options" data-mcm-options' + (type==='选项类型'?'':' hidden') + '><div data-mcm-option-list>' + optionRowsHtml(values) + '</div><button type="button" class="btn btn-primary mcm-add-option" data-mcm-action="add-option"><i class="bi bi-plus-lg"></i><span>添加</span></button></div><label class="mcm-remark"><span>备注：</span><textarea maxlength="200" placeholder="200个字符以内" data-mcm-field="remark">' + esc(editing?row.remark:'') + '</textarea></label><div class="mcm-form-error" data-mcm-form-error role="alert"></div></form>';
    openModal('新增-修改',body,modalButtons('save'));
  }
  function deleteModal(row) {
    state.modal='delete'; state.editingId=row.id;
    openModal('删除','<div class="mcm-delete-confirm"><i class="bi bi-exclamation-circle"></i><p>您确定要删除【' + esc(row.name) + '】吗？</p></div>',modalButtons('delete'));
  }

  function readOptions() {
    return Array.prototype.map.call(pageEl.querySelectorAll('[data-mcm-option-row]'),function(row){var inputs=row.querySelectorAll('input');return {name:inputs[0].value.trim(),value:inputs[1].value.trim()};});
  }
  function saveParameter() {
    var form=pageEl.querySelector('[data-mcm-parameter-form]'), error=form.querySelector('[data-mcm-form-error]');
    var editing=!!state.editingId;
    var key=form.querySelector('[data-mcm-field="key"]').value.trim(), name=form.querySelector('[data-mcm-field="name"]').value.trim(), type=form.querySelector('[data-mcm-field="type"]').value, remark=form.querySelector('[data-mcm-field="remark"]').value.trim();
    if(!key || !/^[A-Za-z][A-Za-z0-9_]*$/.test(key)){error.textContent='KEY 必须以英文字母开头，仅支持英文字母、数字和下划线。';return;}
    if(!name){error.textContent='请输入参数名称。';return;}
    if(!state.editingId && rows.some(function(row){return row.key.toLowerCase()===key.toLowerCase();})){error.textContent='KEY 已存在，请更换后重试。';return;}
    var values=type==='选项类型'?readOptions():[];
    if(type==='选项类型' && (!values.length || values.some(function(item){return !item.name || !item.value;}))){error.textContent='请至少完整填写一个选项名称和选项值。';return;}
    if(editing){var row=findRow(state.editingId);row.name=name;row.type=type;row.remark=remark||'--';row.options=values;}else{rows.push({id:'custom-'+Date.now(),key:key,name:name,type:type,remark:remark||'--',options:values,builtIn:false});}
    closeModal(); state.keyword=''; state.page=Math.ceil(rows.length/state.pageSize); renderTable(); notify(editing?'参数已修改':'参数已新增');
  }
  function deleteParameter() { var row=findRow(state.editingId); if(!row||row.builtIn)return; rows=rows.filter(function(item){return item.id!==row.id;}); closeModal(); renderTable(); notify('参数已删除'); }

  function renderTable() { var target=pageEl.querySelector('[data-mcm-table]'); if(target)target.innerHTML=tableHtml(); var input=pageEl.querySelector('[data-mcm-keyword]'); if(input)input.value=state.keyword; }
  function notify(message) { var toast=pageEl.querySelector('[data-mcm-toast]'); toast.innerHTML='<i class="bi bi-check-circle"></i><span>' + esc(message) + '</span>'; toast.classList.add('show'); clearTimeout(toastTimer); toastTimer=setTimeout(function(){toast.classList.remove('show');},1800); }

  function handleClick(event) {
    var close=event.target.closest('[data-mcm-close]'); if(close){closeModal();return;}
    var action=event.target.closest('[data-mcm-action]');
    if(action){if(action.dataset.mcmAction==='create')parameterModal(null);else if(action.dataset.mcmAction==='add-option'){var list=pageEl.querySelector('[data-mcm-option-list]');var values=readOptions();values.push({name:'',value:''});state.optionRows=values.length;list.innerHTML=optionRowsHtml(values);}return;}
    var remove=event.target.closest('[data-mcm-option-remove]'); if(remove){remove.closest('[data-mcm-option-row]').remove();return;}
    var rowAction=event.target.closest('[data-mcm-row-action]'); if(rowAction){var row=findRow(rowAction.dataset.id);if(!row)return;if(rowAction.dataset.mcmRowAction==='edit')parameterModal(row);else deleteModal(row);return;}
    var page=event.target.closest('[data-mcm-page]'); if(page){var pages=Math.max(1,Math.ceil(filteredRows().length/state.pageSize)),value=page.dataset.mcmPage;state.page=value==='prev'?Math.max(1,state.page-1):(value==='next'?Math.min(pages,state.page+1):Number(value));renderTable();return;}
    var confirm=event.target.closest('[data-mcm-confirm]'); if(confirm){if(confirm.dataset.mcmConfirm==='save')saveParameter();else deleteParameter();}
  }
  function handleChange(event) {
    if(event.target.matches('[data-mcm-field="type"]')){var options=pageEl.querySelector('[data-mcm-options]');options.hidden=event.target.value!=='选项类型';if(event.target.value==='选项类型' && !pageEl.querySelector('[data-mcm-option-row]')){state.optionRows=0;}return;}
    if(event.target.matches('[data-mcm-page-size]')){state.pageSize=Number(event.target.value)||10;state.page=1;renderTable();}
  }
  function handleSubmit(event) { if(!event.target.matches('[data-mcm-query]'))return;event.preventDefault();state.keyword=event.target.querySelector('[data-mcm-keyword]').value;state.page=1;renderTable(); }
  function handleKeydown(event) { if(event.key==='Escape'){closeModal();return;}if(event.key==='Enter'&&event.target.matches('[data-mcm-jump]')){event.preventDefault();var pages=Math.max(1,Math.ceil(filteredRows().length/state.pageSize));state.page=Math.min(pages,Math.max(1,Number(event.target.value)||1));renderTable();} }

  return {
    html:'<div class="page-monitor-config-management"></div>',
    init:function(){pageEl=DP.contentArea.querySelector('.page-monitor-config-management');if(!pageEl)return;state.keyword='';state.page=1;state.pageSize=10;pageEl.innerHTML=shellHtml();renderTable();pageEl.addEventListener('click',handleClick);pageEl.addEventListener('change',handleChange);pageEl.addEventListener('submit',handleSubmit);pageEl.addEventListener('keydown',handleKeydown);},
    destroy:function(){clearTimeout(toastTimer);pageEl=null;}
  };
}());
