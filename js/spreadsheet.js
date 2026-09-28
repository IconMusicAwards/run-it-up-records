(function(){
var ROOT=null,UNIVER=null,FAPI=null,saveTimer=null,workbookRow=null;
var URL='https://uowznuvauqfgeewtqgwo.supabase.co',KEY='sb_publishable_J8u9PnOnfhnUhT1ORgfrgw_TMkTo7J5';
function el(id){return document.getElementById(id)}
function sess(){try{return JSON.parse(sessionStorage.getItem('riu_session')||'null')}catch(e){return null}}
async function api(path,opt){var s=sess();if(!s||!s.token)throw Error('Sign in again.');opt=opt||{};var r=await fetch(URL+path,Object.assign({},opt,{headers:Object.assign({apikey:KEY,Authorization:'Bearer '+s.token,'Content-Type':'application/json'},opt.headers||{})}));if(!r.ok)throw Error(await r.text());var t=await r.text();return t?JSON.parse(t):[]}
function modules(){var U=window.UniverCore,D=window.UniverDesign,UI=window.UniverUi,S=window.UniverSheets,SU=window.UniverSheetsUi,F=window.UniverSheetsFormula,N=window.UniverSheetsNumfmt,NUI=window.UniverSheetsNumfmtUi,FUI=window.UniverSheetsFormulaUi;return {U:U,D:D,UI:UI,S:S,SU:SU,F:F,N:N,NUI:NUI,FUI:FUI}}
function locale(){var out={};[window.UniverDesignEnUS,window.UniverUIEnUS,window.UniverSheetsEnUS,window.UniverSheetsUIEnUS,window.UniverSheetsFormulaUIEnUS,window.UniverSheetsNumfmtUIEnUS].forEach(function(x){if(x)Object.assign(out,x.default||x)});return out}
function blank(){return {id:'riu-finance',name:'RIU Finance Workbook',appVersion:'1.0.0',locale:'enUS',styles:{},sheetOrder:['sheet-1'],sheets:{'sheet-1':{id:'sheet-1',name:'Label Finance',rowCount:1000,columnCount:26,cellData:{0:{0:{v:'RUN IT UP RECORDS — FINANCE',s:{bl:1,fs:16}},1:{v:'Date'},2:{v:'Category'},3:{v:'Description'},4:{v:'Money In'},5:{v:'Money Out'},6:{v:'Balance'}}},rowData:{},columnData:{},mergeData:[],rowHeader:{width:46},columnHeader:{height:24},showGridlines:1,freeze:{startRow:1,startColumn:0,xSplit:0,ySplit:1}}}}}
async function loadRow(){var rows=await api('/rest/v1/finance_workbooks?select=*&order=created_at.asc&limit=1');workbookRow=rows[0];return workbookRow&&workbookRow.snapshot&&Object.keys(workbookRow.snapshot).length?workbookRow.snapshot:blank()}
async function persist(){if(!FAPI||!workbookRow)return;try{var wb=FAPI.getActiveWorkbook(),snap=wb&&wb.save?wb.save():null;if(!snap)return;await api('/rest/v1/finance_workbooks?id=eq.'+workbookRow.id,{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({snapshot:snap,updated_at:new Date().toISOString(),updated_by:sess().uid})});status('SAVED')}catch(e){status('SAVE ERROR')}}
function status(t){var x=el('sheetSaveState');if(x)x.textContent=t}
function queueSave(){status('UNSAVED');clearTimeout(saveTimer);saveTimer=setTimeout(persist,1200)}
function csvExport(){try{var wb=FAPI.getActiveWorkbook(),sh=wb.getActiveSheet(),range=sh.getUsedRange(),vals=range.getValues(),csv=vals.map(function(r){return r.map(function(v){v=v==null?'':String(v);return /[",\n]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v}).join(',')}).join('\n'),a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));a.download=(sh.getName?sh.getName():'RIU-Sheet')+'.csv';a.click();setTimeout(function(){URL.revokeObjectURL(a.href)},1000)}catch(e){alert('CSV export failed: '+e.message)}}
function csvImport(file){if(!file)return;var rd=new FileReader();rd.onload=function(){try{var rows=String(rd.result).split(/\r?\n/).filter(Boolean).map(function(line){var out=[],cur='',q=false;for(var i=0;i<line.length;i++){var ch=line[i];if(ch==='"'&&line[i+1]==='"'&&q){cur+='"';i++}else if(ch==='"')q=!q;else if(ch===','&&!q){out.push(cur);cur=''}else cur+=ch}out.push(cur);return out});var sh=FAPI.getActiveWorkbook().getActiveSheet();sh.getRange(0,0,rows.length,Math.max.apply(null,rows.map(function(r){return r.length}))).setValues(rows);queueSave()}catch(e){alert('CSV import failed: '+e.message)}};rd.readAsText(file)}
async function boot(){if(UNIVER)return;status('STARTING ENGINE');var m=modules();var mount=el('univerMount');try{
if(!window.UniverCore||!window.UniverEngineRender||!window.UniverEngineFormula||!window.UniverUi||!window.UniverDocs||!window.UniverDocsUi||!window.UniverSheets||!window.UniverSheetsUi)throw Error('Required Univer modules are missing');
var snap=await loadRow();
var locales=window.UniverCore.mergeLocales(window.UniverDesignEnUS||{},window.UniverUiEnUS||{},window.UniverSheetsEnUS||{},window.UniverSheetsUiEnUS||{},window.UniverDocsUiEnUS||{},window.UniverSheetsFormulaUiEnUS||{},window.UniverSheetsNumfmtUiEnUS||{});
var univer=new window.UniverCore.Univer({theme:window.UniverThemes&&window.UniverThemes.defaultTheme,locale:window.UniverCore.LocaleType.EN_US,locales:{enUS:locales}});
UNIVER=univer;
univer.registerPlugin(window.UniverEngineRender.UniverRenderEnginePlugin);
univer.registerPlugin(window.UniverEngineFormula.UniverFormulaEnginePlugin);
univer.registerPlugin(window.UniverUi.UniverUIPlugin,{container:'univerMount'});
univer.registerPlugin(window.UniverDocs.UniverDocsPlugin);
univer.registerPlugin(window.UniverDocsUi.UniverDocsUIPlugin);
univer.registerPlugin(window.UniverSheets.UniverSheetsPlugin);
univer.registerPlugin(window.UniverSheetsUi.UniverSheetsUIPlugin);
if(window.UniverSheetsFormula)univer.registerPlugin(window.UniverSheetsFormula.UniverSheetsFormulaPlugin);
if(window.UniverSheetsFormulaUi)univer.registerPlugin(window.UniverSheetsFormulaUi.UniverSheetsFormulaUIPlugin);
if(window.UniverSheetsNumfmt)univer.registerPlugin(window.UniverSheetsNumfmt.UniverSheetsNumfmtPlugin);
if(window.UniverSheetsNumfmtUi)univer.registerPlugin(window.UniverSheetsNumfmtUi.UniverSheetsNumfmtUIPlugin);
univer.createUnit(window.UniverCore.UniverInstanceType.UNIVER_SHEET,snap);
FAPI=window.UniverCoreFacade&&window.UniverCoreFacade.FUniver?window.UniverCoreFacade.FUniver.newAPI(univer):null;
if(!FAPI)throw Error('Univer facade API failed to initialize');
mount.addEventListener('input',queueSave,true);mount.addEventListener('mouseup',queueSave,true);mount.addEventListener('keyup',queueSave,true);status('READY');
}catch(err){console.error('RIU spreadsheet boot error',err);UNIVER=null;FAPI=null;mount.innerHTML='<div class="sheet-error"><b>SPREADSHEET STARTUP ERROR</b><br>'+safeError(err)+'</div>';status('STARTUP ERROR')}}
function safeError(err){var d=document.createElement('div');d.textContent=String(err&&err.message?err.message:err);return d.innerHTML}
window.RIUSpreadsheet={open:async function(){var p=el('sheetPanel');if(!p)return;p.innerHTML='<div class="riu-sheet-head"><div><small>RUN IT UP RECORDS</small><b>FINANCE WORKBOOK</b></div><div class="riu-sheet-tools"><span id="sheetSaveState">LOADING</span><button id="csvIn">IMPORT CSV</button><button id="csvOut">EXPORT CSV</button><button id="sheetSave">SAVE NOW</button><input id="csvFile" type="file" accept=".csv,text/csv" hidden></div></div><div id="univerMount" class="univer-mount"></div>';el('csvIn').onclick=function(){el('csvFile').click()};el('csvFile').onchange=function(){csvImport(this.files[0]);this.value=''};el('csvOut').onclick=csvExport;el('sheetSave').onclick=persist;await boot()}}
})();