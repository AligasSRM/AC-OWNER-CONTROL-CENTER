const nav=document.getElementById('nav'),view=document.getElementById('view'),clock=document.getElementById('clock'),toast=document.getElementById('toast'),ownerStatus=document.getElementById('ownerStatus'),connectionState=document.getElementById('connectionState');
const data={overview:{title:'Overview',cards:[['🟢','12','Online Now'],['👥','1,284','Users'],['🎬','342','Videos'],['👁','18,492','Views'],['❤️','6,731','Likes'],['💰','$4,820','Payments'],['💸','$1,260','Payouts'],['🔐','SECURE','Security']]},users:{title:'Users',rows:['🟢 user_1284 — Online now','🟢 user_1198 — Online 2m','⚪ user_1190 — Left 3m','🟢 user_1104 — Online 4m']},videos:{title:'Videos',rows:['video_0342 — Uploaded 1m','video_0318 — Published 4m','video_0309 — Processing 7m','video_0298 — Published 12m']},views:{title:'Views',rows:['18,492 total views','1,284 active users','92 qualified views today','4,820 watch sessions']},likes:{title:'Likes',rows:['6,731 total likes','+48 today','video_0318 — +12','video_0298 — +8']},payments:{title:'Payments',rows:['$4,820 completed','$520 pending','$140 failed','Provider status: monitored']},payouts:{title:'Payouts',rows:['$1,260 paid','2 requests under review','$340 processing','No failed payouts']},security:{title:'Security',rows:['Owner session — SECURE','Passkey — READY','Failed logins — 0','Alerts — 1 informational']},audit:{title:'Audit Log',rows:['23:44 OWNER_LOGIN','23:43 USER_LOGIN user_1284','23:42 VIDEO_UPLOADED video_0342','23:41 VIEW_COUNTED video_0318']},alerts:{title:'Alerts',rows:['INFO — New user session','INFO — Video upload received','OK — No critical security alerts','OK — No service outage']},health:{title:'System Health',rows:['Frontend — ONLINE','Database — READY (local test)','Event pipeline — READY','Integration — DISCONNECTED (planned)']}};
const keys=Object.keys(data);
let locked=false,filter='all';
const state={events:JSON.parse(localStorage.getItem('ac_owner_events')||'[]')};
function showToast(t){toast.textContent=t;toast.style.display='block';clearTimeout(showToast.t);showToast.t=setTimeout(()=>toast.style.display='none',2200)}
function logEvent(action,target='owner'){const item={time:new Date().toLocaleTimeString([], {hour12:false}),action,target};state.events.unshift(item);state.events=state.events.slice(0,30);localStorage.setItem('ac_owner_events',JSON.stringify(state.events));}
function renderNav(active){nav.innerHTML=keys.map(k=>'<button class="'+(k===active?'active':'')+'" data-k="'+k+'">'+data[k].title+'</button>').join('');nav.querySelectorAll('button').forEach(b=>b.onclick=()=>render(b.dataset.k))}
function filteredRows(rows){if(filter==='all')return rows;return rows.filter(x=>x.toLowerCase().includes(filter))}
function moduleRows(d){return filteredRows(d.rows||[]).map(x=>'<div class="row"><span>'+x+'</span><span class="ok">●</span></div>').join('')||'<div class="row"><span>No matching test records</span><span class="warn">—</span></div>'}
async function loadBackendData(){
  if(!backendUrl)return false;
  try{
    const endpoints={overview:'/api/overview',users:'/api/users',videos:'/api/videos',views:'/api/views',likes:'/api/likes',payments:'/api/payments',payouts:'/api/payouts',events:'/api/events',audit:'/api/audit',alerts:'/api/alerts',health:'/api/health'};
    for(const [key,endpoint] of Object.entries(endpoints)){
      const response=await fetch(backendUrl+endpoint,{credentials:'include',cache:'no-store'});
      if(!response.ok)throw new Error(key);
      const result=await response.json();
      if(key==='overview'&&result.data){
        const o=result.data;
        data.overview.cards=[['🟢',String(o.online??0),'Online Now'],['👥',String(o.users??0),'Users'],['🎬',String(o.videos??0),'Videos'],['👁',String(o.views??0),'Views'],['❤️',String(o.likes??0),'Likes'],['💰','renderNav(k);const d=data[k];
 if(k==='overview'){
  const events=state.events.length?state.events.slice(0,4).map(e=>'⚡ '+e.action+' — '+e.target):['🟢 User entered — user_1284','🎬 Video uploaded — video_0342','❤️ Like received — video_0318','🚪 User left — user_1190'];
  view.innerHTML='<div class="section-title"><h2>'+d.title+'</h2><small>All systems monitored</small></div><div class="stats">'+d.cards.map(x=>'<article class="card"><span>'+x[0]+'</span><strong>'+x[1]+'</strong><small>'+x[2]+'</small></article>').join('')+'</div><section class="panel"><div class="section-title"><h2>⚡ Live Activity</h2><small>'+events.length+' events</small></div>'+events.map(x=>'<div class="row"><span>'+x+'</span><span class="ok">LIVE</span></div>').join('')+'</section><div class="grid">'+keys.slice(1).map(k=>'<button class="action" data-k="'+k+'"><b>'+data[k].title+'</b><small>Open module</small></button>').join('')+'</div><button id="stop" class="danger">STOP ALL</button><button id="refresh" class="secondary">↻ REFRESH LOCAL STATE</button>';
  view.querySelectorAll('.action').forEach(b=>b.onclick=()=>render(b.dataset.k));
  document.getElementById('stop').onclick=()=>{if(locked){showToast('Owner control is locked');return}if(confirm('STOP ALL actions?')){logEvent('STOP_ALL','control-center');showToast('STOP ALL recorded — backend control is not connected')}};document.getElementById('refresh').onclick=()=>{showToast('Local state refreshed');render('overview')};
 }else if(k==='audit'){
  const rows=state.events.length?state.events.map(e=>e.time+' '+e.action+' '+e.target):d.rows;
  view.innerHTML='<div class="section-title"><h2>Audit Log</h2><small>Local test audit</small></div><section class="panel">'+filteredRows(rows).map(x=>'<div class="row"><span>'+x+'</span><span class="ok">LOG</span></div>').join('')+'</section><button class="secondary" id="clearAudit">Clear local test events</button>';document.getElementById('clearAudit').onclick=()=>{state.events=[];localStorage.removeItem('ac_owner_events');logEvent('AUDIT_RESET','local-test');showToast('Local test audit reset');render('audit')};
 }else{view.innerHTML='<div class="section-title"><h2>'+d.title+'</h2><small>Independent test data</small></div><div class="toolbar"><select id="filter" class="filter"><option value="all">All records</option><option value="online">Online</option><option value="ok">OK</option><option value="pending">Pending</option><option value="failed">Failed</option></select><button id="moduleRefresh" class="filter">↻ Refresh</button></div><section class="panel">'+moduleRows(d)+'</section>';document.getElementById('filter').value=filter;document.getElementById('filter').onchange=e=>{filter=e.target.value;render(k)};document.getElementById('moduleRefresh').onclick=()=>showToast(d.title+' refreshed (test data)')}}
function setLock(next){locked=next;ownerStatus.textContent=locked?'LOCKED':'SECURE';ownerStatus.className=locked?'bad':'ok';document.body.classList.toggle('locked',locked);logEvent(locked?'OWNER_LOCK':'OWNER_UNLOCK','control-center');showToast(locked?'Owner control locked':'Owner control unlocked');}
function tick(){clock.textContent=new Date().toLocaleTimeString([], {hour12:false})}
tick();setInterval(tick,1000);
document.getElementById('lockBtn').onclick=()=>setLock(!locked);
if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
render();
const BACKEND_KEY='ac_owner_backend_url';
let backendUrl=(localStorage.getItem(BACKEND_KEY)||'').replace(/\\/$/,'');
function setConnection(text){connectionState.textContent=text}
async function backendHealth(){
  if(!backendUrl){setConnection('LOCAL TEST MODE');return false}
  setConnection('BACKEND CHECK…');
  try{const r=await fetch(backendUrl+'/api/health',{credentials:'include',cache:'no-store'});if(!r.ok)throw new Error('health');setConnection('BACKEND ONLINE');return true}catch(e){setConnection('BACKEND OFFLINE');return false}
}
async function configureBackend(){
  const current=backendUrl||'none';
  const value=prompt('Backend URL (example: http://127.0.0.1:8787). Leave empty for local test mode.',current==='none'?'':current);
  if(value===null)return;
  backendUrl=value.trim().replace(/\\/$/,'');
  if(backendUrl)localStorage.setItem(BACKEND_KEY,backendUrl);else localStorage.removeItem(BACKEND_KEY);
  document.getElementById('backendBtn').textContent=backendUrl?'⚙ BACKEND: '+backendUrl:'⚙ BACKEND: LOCAL TEST';
  const ok=await backendHealth();
loadBackendData().then(ok=>{if(ok)render('overview')});
  showToast(ok?'Backend connected (health check)':'Backend not reachable — local test remains active');
}
document.getElementById('backendBtn').onclick=configureBackend;
document.getElementById('backendBtn').textContent=backendUrl?'⚙ BACKEND: '+backendUrl:'⚙ BACKEND: LOCAL TEST';
backendHealth();
+String(o.payments??0),'Payments'],['💸','renderNav(k);const d=data[k];
 if(k==='overview'){
  const events=state.events.length?state.events.slice(0,4).map(e=>'⚡ '+e.action+' — '+e.target):['🟢 User entered — user_1284','🎬 Video uploaded — video_0342','❤️ Like received — video_0318','🚪 User left — user_1190'];
  view.innerHTML='<div class="section-title"><h2>'+d.title+'</h2><small>All systems monitored</small></div><div class="stats">'+d.cards.map(x=>'<article class="card"><span>'+x[0]+'</span><strong>'+x[1]+'</strong><small>'+x[2]+'</small></article>').join('')+'</div><section class="panel"><div class="section-title"><h2>⚡ Live Activity</h2><small>'+events.length+' events</small></div>'+events.map(x=>'<div class="row"><span>'+x+'</span><span class="ok">LIVE</span></div>').join('')+'</section><div class="grid">'+keys.slice(1).map(k=>'<button class="action" data-k="'+k+'"><b>'+data[k].title+'</b><small>Open module</small></button>').join('')+'</div><button id="stop" class="danger">STOP ALL</button><button id="refresh" class="secondary">↻ REFRESH LOCAL STATE</button>';
  view.querySelectorAll('.action').forEach(b=>b.onclick=()=>render(b.dataset.k));
  document.getElementById('stop').onclick=()=>{if(locked){showToast('Owner control is locked');return}if(confirm('STOP ALL actions?')){logEvent('STOP_ALL','control-center');showToast('STOP ALL recorded — backend control is not connected')}};document.getElementById('refresh').onclick=()=>{showToast('Local state refreshed');render('overview')};
 }else if(k==='audit'){
  const rows=state.events.length?state.events.map(e=>e.time+' '+e.action+' '+e.target):d.rows;
  view.innerHTML='<div class="section-title"><h2>Audit Log</h2><small>Local test audit</small></div><section class="panel">'+filteredRows(rows).map(x=>'<div class="row"><span>'+x+'</span><span class="ok">LOG</span></div>').join('')+'</section><button class="secondary" id="clearAudit">Clear local test events</button>';document.getElementById('clearAudit').onclick=()=>{state.events=[];localStorage.removeItem('ac_owner_events');logEvent('AUDIT_RESET','local-test');showToast('Local test audit reset');render('audit')};
 }else{view.innerHTML='<div class="section-title"><h2>'+d.title+'</h2><small>Independent test data</small></div><div class="toolbar"><select id="filter" class="filter"><option value="all">All records</option><option value="online">Online</option><option value="ok">OK</option><option value="pending">Pending</option><option value="failed">Failed</option></select><button id="moduleRefresh" class="filter">↻ Refresh</button></div><section class="panel">'+moduleRows(d)+'</section>';document.getElementById('filter').value=filter;document.getElementById('filter').onchange=e=>{filter=e.target.value;render(k)};document.getElementById('moduleRefresh').onclick=()=>showToast(d.title+' refreshed (test data)')}}
function setLock(next){locked=next;ownerStatus.textContent=locked?'LOCKED':'SECURE';ownerStatus.className=locked?'bad':'ok';document.body.classList.toggle('locked',locked);logEvent(locked?'OWNER_LOCK':'OWNER_UNLOCK','control-center');showToast(locked?'Owner control locked':'Owner control unlocked');}
function tick(){clock.textContent=new Date().toLocaleTimeString([], {hour12:false})}
tick();setInterval(tick,1000);
document.getElementById('lockBtn').onclick=()=>setLock(!locked);
if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
render();
const BACKEND_KEY='ac_owner_backend_url';
let backendUrl=(localStorage.getItem(BACKEND_KEY)||'').replace(/\\/$/,'');
function setConnection(text){connectionState.textContent=text}
async function backendHealth(){
  if(!backendUrl){setConnection('LOCAL TEST MODE');return false}
  setConnection('BACKEND CHECK…');
  try{const r=await fetch(backendUrl+'/api/health',{credentials:'include',cache:'no-store'});if(!r.ok)throw new Error('health');setConnection('BACKEND ONLINE');return true}catch(e){setConnection('BACKEND OFFLINE');return false}
}
async function configureBackend(){
  const current=backendUrl||'none';
  const value=prompt('Backend URL (example: http://127.0.0.1:8787). Leave empty for local test mode.',current==='none'?'':current);
  if(value===null)return;
  backendUrl=value.trim().replace(/\\/$/,'');
  if(backendUrl)localStorage.setItem(BACKEND_KEY,backendUrl);else localStorage.removeItem(BACKEND_KEY);
  document.getElementById('backendBtn').textContent=backendUrl?'⚙ BACKEND: '+backendUrl:'⚙ BACKEND: LOCAL TEST';
  const ok=await backendHealth();
  showToast(ok?'Backend connected (health check)':'Backend not reachable — local test remains active');
}
document.getElementById('backendBtn').onclick=configureBackend;
document.getElementById('backendBtn').textContent=backendUrl?'⚙ BACKEND: '+backendUrl:'⚙ BACKEND: LOCAL TEST';
backendHealth();
+String(o.payouts??0),'Payouts'],['🔐',String(o.security??'SECURE'),'Security']];
      } else if(Array.isArray(result.data)) data[key].rows=result.data.map(x=>typeof x==='string'?x:JSON.stringify(x));
    }
    setConnection('BACKEND ONLINE');
    return true;
  }catch(e){setConnection('BACKEND OFFLINE — LOCAL TEST');return false}
}
function render(k='overview'){renderNav(k);const d=data[k];
 if(k==='overview'){
  const events=state.events.length?state.events.slice(0,4).map(e=>'⚡ '+e.action+' — '+e.target):['🟢 User entered — user_1284','🎬 Video uploaded — video_0342','❤️ Like received — video_0318','🚪 User left — user_1190'];
  view.innerHTML='<div class="section-title"><h2>'+d.title+'</h2><small>All systems monitored</small></div><div class="stats">'+d.cards.map(x=>'<article class="card"><span>'+x[0]+'</span><strong>'+x[1]+'</strong><small>'+x[2]+'</small></article>').join('')+'</div><section class="panel"><div class="section-title"><h2>⚡ Live Activity</h2><small>'+events.length+' events</small></div>'+events.map(x=>'<div class="row"><span>'+x+'</span><span class="ok">LIVE</span></div>').join('')+'</section><div class="grid">'+keys.slice(1).map(k=>'<button class="action" data-k="'+k+'"><b>'+data[k].title+'</b><small>Open module</small></button>').join('')+'</div><button id="stop" class="danger">STOP ALL</button><button id="refresh" class="secondary">↻ REFRESH LOCAL STATE</button>';
  view.querySelectorAll('.action').forEach(b=>b.onclick=()=>render(b.dataset.k));
  document.getElementById('stop').onclick=()=>{if(locked){showToast('Owner control is locked');return}if(confirm('STOP ALL actions?')){logEvent('STOP_ALL','control-center');showToast('STOP ALL recorded — backend control is not connected')}};document.getElementById('refresh').onclick=()=>{showToast('Local state refreshed');render('overview')};
 }else if(k==='audit'){
  const rows=state.events.length?state.events.map(e=>e.time+' '+e.action+' '+e.target):d.rows;
  view.innerHTML='<div class="section-title"><h2>Audit Log</h2><small>Local test audit</small></div><section class="panel">'+filteredRows(rows).map(x=>'<div class="row"><span>'+x+'</span><span class="ok">LOG</span></div>').join('')+'</section><button class="secondary" id="clearAudit">Clear local test events</button>';document.getElementById('clearAudit').onclick=()=>{state.events=[];localStorage.removeItem('ac_owner_events');logEvent('AUDIT_RESET','local-test');showToast('Local test audit reset');render('audit')};
 }else{view.innerHTML='<div class="section-title"><h2>'+d.title+'</h2><small>Independent test data</small></div><div class="toolbar"><select id="filter" class="filter"><option value="all">All records</option><option value="online">Online</option><option value="ok">OK</option><option value="pending">Pending</option><option value="failed">Failed</option></select><button id="moduleRefresh" class="filter">↻ Refresh</button></div><section class="panel">'+moduleRows(d)+'</section>';document.getElementById('filter').value=filter;document.getElementById('filter').onchange=e=>{filter=e.target.value;render(k)};document.getElementById('moduleRefresh').onclick=()=>showToast(d.title+' refreshed (test data)')}}
function setLock(next){locked=next;ownerStatus.textContent=locked?'LOCKED':'SECURE';ownerStatus.className=locked?'bad':'ok';document.body.classList.toggle('locked',locked);logEvent(locked?'OWNER_LOCK':'OWNER_UNLOCK','control-center');showToast(locked?'Owner control locked':'Owner control unlocked');}
function tick(){clock.textContent=new Date().toLocaleTimeString([], {hour12:false})}
tick();setInterval(tick,1000);
document.getElementById('lockBtn').onclick=()=>setLock(!locked);
if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
render();
const BACKEND_KEY='ac_owner_backend_url';
let backendUrl=(localStorage.getItem(BACKEND_KEY)||'').replace(/\\/$/,'');
function setConnection(text){connectionState.textContent=text}
async function backendHealth(){
  if(!backendUrl){setConnection('LOCAL TEST MODE');return false}
  setConnection('BACKEND CHECK…');
  try{const r=await fetch(backendUrl+'/api/health',{credentials:'include',cache:'no-store'});if(!r.ok)throw new Error('health');setConnection('BACKEND ONLINE');return true}catch(e){setConnection('BACKEND OFFLINE');return false}
}
async function configureBackend(){
  const current=backendUrl||'none';
  const value=prompt('Backend URL (example: http://127.0.0.1:8787). Leave empty for local test mode.',current==='none'?'':current);
  if(value===null)return;
  backendUrl=value.trim().replace(/\\/$/,'');
  if(backendUrl)localStorage.setItem(BACKEND_KEY,backendUrl);else localStorage.removeItem(BACKEND_KEY);
  document.getElementById('backendBtn').textContent=backendUrl?'⚙ BACKEND: '+backendUrl:'⚙ BACKEND: LOCAL TEST';
  const ok=await backendHealth();
  showToast(ok?'Backend connected (health check)':'Backend not reachable — local test remains active');
}
document.getElementById('backendBtn').onclick=configureBackend;
document.getElementById('backendBtn').textContent=backendUrl?'⚙ BACKEND: '+backendUrl:'⚙ BACKEND: LOCAL TEST';
backendHealth();
