
(function(){
'use strict';
const API='https://acer-cloud-backend.vercel.app';
const $=s=>document.querySelector(s);
const user=()=>{try{return JSON.parse(localStorage.getItem('webdoc_user')||'{}')}catch(e){return {}}};
const req=async(path,opt={})=>{
 const r=await fetch(API+path,{...opt,headers:{'Content-Type':'application/json','Authorization':'Bearer '+localStorage.getItem('webdoc_token'),...(opt.headers||{})}});
 let d={};try{d=await r.json()}catch(e){}
 if(!r.ok)throw new Error(d.error||d.message||'Request failed');return d;
};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const admin=()=>String(user().role||'').toLowerCase()==='admin';
function addStyles(){
 const st=document.createElement('style');st.textContent=`
:root{--wf-accent:#00e58a;--wf-accent2:#00b86b;--wf-glow:rgba(0,229,138,.22)}
#wfLaunch{display:${admin()?'flex':'none'};align-items:center;justify-content:center;gap:10px;width:100%;margin:10px 0;padding:12px 16px;border:1px solid rgba(0,229,138,.55);border-radius:12px;background:linear-gradient(135deg,#073d2a 0%,#075b3b 52%,#063b2b 100%);color:#eafff4;cursor:pointer;font:700 14px/1.2 inherit;text-align:left;box-shadow:0 7px 22px rgba(0,0,0,.24),0 0 18px rgba(0,229,138,.10);transition:.2s}
#wfLaunch:hover{transform:translateY(-1px);border-color:#00ff9d;box-shadow:0 9px 26px rgba(0,0,0,.3),0 0 22px rgba(0,229,138,.2);background:linear-gradient(135deg,#075638,#087849 55%,#064b35)}
#wfShade{display:none;position:fixed;inset:0;z-index:99999;background:rgba(2,9,7,.84);backdrop-filter:blur(12px);padding:3vh 2vw;overflow:auto}
#wfShade.open{display:block}
.wf-panel{max-width:1120px;min-height:88vh;margin:0 auto;background:linear-gradient(145deg,rgba(9,24,18,.98),rgba(7,17,14,.99));color:#e8fff2;border:1px solid rgba(0,229,138,.28);border-radius:20px;box-shadow:0 28px 90px #000c,0 0 38px rgba(0,229,138,.07);padding:24px;font:14px/1.55 Inter,Arial,sans-serif}
.wf-head{display:flex;justify-content:space-between;align-items:center;gap:12px;padding-bottom:17px;border-bottom:1px solid rgba(0,229,138,.17)}.wf-head h2{margin:0;font-size:23px;letter-spacing:.2px;color:#f2fff8}.wf-muted{color:#91b7a4}.wf-close,.wf-btn{border:1px solid #236b4b;border-radius:10px;padding:9px 14px;background:linear-gradient(135deg,#102a20,#163b2b);color:#eafff2;cursor:pointer;transition:.18s}.wf-close:hover,.wf-btn:hover{border-color:#00d982;box-shadow:0 0 15px rgba(0,229,138,.13);transform:translateY(-1px)}.wf-btn.primary{background:linear-gradient(135deg,#00a968,#087b4c);border-color:#00d982;color:#fff;font-weight:700}.wf-btn.danger{background:linear-gradient(135deg,#542126,#35181c);border-color:#9a414a;color:#ffe8e9}
.wf-tabs{display:flex;gap:8px;flex-wrap:wrap;margin:19px 0}.wf-tab{padding:9px 14px;border:1px solid #28533f;background:#10251b;color:#ccebd9;border-radius:10px;cursor:pointer;transition:.18s}.wf-tab:hover{border-color:#00c979;color:#fff}.wf-tab.active{background:linear-gradient(135deg,#087849,#075b3b);border-color:#00e58a;color:#fff;box-shadow:0 0 16px rgba(0,229,138,.12)}
.wf-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:13px;margin:16px 0 22px}.wf-card{background:linear-gradient(145deg,#10251b,#0c1d16);border:1px solid #244b38;border-radius:14px;padding:17px;box-shadow:0 8px 22px rgba(0,0,0,.15)}.wf-card strong{display:block;font-size:27px;color:#00e58a;letter-spacing:.2px}.wf-card span{color:#a8cbb6}.wf-row{display:flex;justify-content:space-between;align-items:center;gap:14px;padding:14px 15px;border-bottom:1px solid #1d3b2c}.wf-row:last-child{border:0}.wf-list{background:rgba(10,27,19,.78);border:1px solid #244b38;border-radius:14px;overflow:hidden}.wf-field{display:grid;gap:7px;margin:14px 0}.wf-field label{color:#b9d8c5;font-weight:700}.wf-field input,.wf-field textarea{background:#07140e;border:1px solid #315b44;border-radius:9px;color:#effff5;padding:11px 12px;font:inherit;outline:none}.wf-field input:focus,.wf-field textarea:focus{border-color:#00d982;box-shadow:0 0 0 3px rgba(0,217,130,.12)}.wf-field textarea{min-height:110px;resize:vertical}.wf-actions{display:flex;gap:9px;flex-wrap:wrap;margin:13px 0}.wf-note{padding:13px 15px;border-radius:11px;background:linear-gradient(120deg,rgba(0,139,82,.17),rgba(0,72,47,.2));border:1px solid rgba(0,217,130,.22);color:#c9f3d9;margin:13px 0}.wf-empty{padding:24px;text-align:center;color:#91b7a4}
.wf-panel h3{color:#dfffee;margin:18px 0 10px}.wf-panel input[type=checkbox]{accent-color:#00d982}
#wfAnnouncementStrip{box-sizing:border-box;width:100%;max-width:100%;min-width:0;min-height:34px;height:34px;margin:0 0 9px;padding:0 12px;display:flex;align-items:center;gap:9px;overflow:hidden;border:1px solid rgba(65,148,255,.34);border-radius:10px;background:linear-gradient(100deg,rgba(8,28,61,.96),rgba(10,22,49,.94));color:#dceaff;box-shadow:0 4px 14px rgba(0,0,0,.18),inset 0 1px rgba(255,255,255,.035);font:600 11px/1.2 Inter,Arial,sans-serif}#wfAnnouncementStrip .wf-ann-icon{flex:0 0 auto;font-size:13px}#wfAnnouncementStrip .wf-ann-title{display:block;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#e5f0ff;letter-spacing:.12px}@media(max-width:800px){#wfAnnouncementStrip{margin:0 0 8px;height:32px;min-height:32px;padding:0 9px}}
@media(max-width:650px){#wfShade{padding:8px}.wf-panel{padding:15px;min-height:96vh}.wf-head{align-items:flex-start;flex-direction:column}.wf-row{align-items:flex-start;flex-direction:column}.wf-tabs{display:grid;grid-template-columns:repeat(2,minmax(0,1fr))}.wf-tab{width:100%}}
`;document.head.append(st);
}
function renderShell(){
 const old=$('#wfLaunch');if(old)return;
 const b=document.createElement('button');b.id='wfLaunch';b.innerHTML='✦ &nbsp; Admin Dashboard';b.onclick=open;
 const anchor=$('#adminSettingsButton');
 if(anchor?.parentElement)anchor.parentElement.insertBefore(b,anchor.nextSibling);
 else document.body.append(b);
 const shade=document.createElement('div');shade.id='wfShade';shade.innerHTML=`
 <section class="wf-panel" role="dialog" aria-modal="true">
 <header class="wf-head"><div><h2>WebDoc Control Center</h2><div class="wf-muted">Overview · Activity · Backups · Announcements · Profile</div></div><button class="wf-close" id="wfClose">✕ Close</button></header>
 <nav class="wf-tabs" id="wfTabs">
 ${['Overview','Activity Logs','Backups','Announcements','Profile'].map((x,i)=>`<button class="wf-tab ${i===0?'active':''}" data-tab="${i}">${x}</button>`).join('')}
 </nav><div id="wfContent"><div class="wf-empty">Loading…</div></div></section>`;
 document.body.append(shade);$('#wfClose').onclick=close;
 shade.addEventListener('click',e=>{if(e.target===shade)close()});
 $('#wfTabs').addEventListener('click',e=>{const t=e.target.closest('[data-tab]');if(!t)return;document.querySelectorAll('.wf-tab').forEach(x=>x.classList.toggle('active',x===t));loadTab(Number(t.dataset.tab))});
}
function open(){if(!admin()){alert('Admin access required.');return}$('#wfShade').classList.add('open');loadTab(0)}
function close(){$('#wfShade').classList.remove('open')}
function content(html){$('#wfContent').innerHTML=html}
async function loadTab(n){
 const c=$('#wfContent');c.innerHTML='<div class="wf-empty">Loading…</div>';
 try{
 if(n===0){const d=await req('/api/admin/overview');const o=d.overview||{};content(`<div class="wf-grid">
 ${[['Registered accounts',o.total_users],['Active accounts',o.active_users],['Inactive accounts',o.inactive_users],['Users with documentation',o.users_with_documentation],['Activity events',o.total_activity_logs]].map(x=>`<div class="wf-card"><strong>${esc(x[1]??0)}</strong><span>${x[0]}</span></div>`).join('')}</div>
 <h3>Recent activity</h3>${activityRows(d.recentActivity||[])}`)}
 if(n===1){const d=await req('/api/admin/activity-logs?limit=150');content(`<h3>Latest activity</h3>${activityRows(d.logs||[])}`)}
 if(n===2){const d=await req('/api/admin/backups');content(`<div class="wf-note">Backups contain documentation records only. Restoring a backup replaces documentation for the users included in that snapshot.</div><div class="wf-actions"><button class="wf-btn primary" id="wfCreateBackup">＋ Create cloud backup now</button></div><div class="wf-list">${(d.backups||[]).map(b=>`<div class="wf-row"><div><b>Backup #${esc(b.id)}</b><div class="wf-muted">${esc(new Date(b.created_at).toLocaleString())} · ${esc(b.created_by_username||'')}</div><small>${esc(b.notes||'')}</small></div><div class="wf-actions"><button class="wf-btn" data-download="${b.id}">Download</button><button class="wf-btn danger" data-restore="${b.id}">Restore</button></div></div>`).join('')||'<div class="wf-empty">No backups yet.</div>'}</div>`);
 $('#wfCreateBackup').onclick=async()=>{const notes=prompt('Backup note (optional):','Manual backup');if(notes===null)return;try{const r=await req('/api/admin/backups',{method:'POST',body:JSON.stringify({notes})});alert('Backup created: #'+r.backup.id);loadTab(2)}catch(e){alert(e.message)}};
 c.querySelectorAll('[data-download]').forEach(b=>b.onclick=async()=>{try{const d=await req('/api/admin/backups/'+b.dataset.download);downloadJson(d.backup,'webdoc-backup-'+b.dataset.download+'.json')}catch(e){alert(e.message)}});
 c.querySelectorAll('[data-restore]').forEach(b=>b.onclick=async()=>{const id=b.dataset.restore;if(!confirm('Restore backup #'+id+'? This will replace documentation records for users included in this backup.'))return;if(!confirm('Final confirmation: continue restoring this backup?'))return;try{await req('/api/admin/backups/'+id,{method:'POST',body:JSON.stringify({confirmRestore:true})});alert('Backup restored.');loadTab(0)}catch(e){alert(e.message)}});
 }
 if(n===3){const d=await req('/api/admin/announcements');content(`<h3>Publish an announcement</h3><div class="wf-field"><label>Title</label><input id="wfAnnTitle" maxlength="120" placeholder="e.g. Scheduled maintenance"></div><div class="wf-field"><label>Message</label><textarea id="wfAnnMessage" maxlength="5000" placeholder="Write an update for the team…"></textarea></div><label><input type="checkbox" id="wfAnnPublished" checked> Publish immediately</label><div class="wf-actions"><button class="wf-btn primary" id="wfAnnCreate">Publish announcement</button></div><h3>Existing announcements</h3><div class="wf-list">${(d.announcements||[]).map(a=>`<div class="wf-row"><div><b>${esc(a.title)}</b><div class="wf-muted">${a.is_published?'Published':'Draft'} · ${esc(new Date(a.created_at).toLocaleString())}</div><div>${esc(a.message)}</div></div><div class="wf-actions"><button class="wf-btn" data-edit-ann="${a.id}">Edit</button><button class="wf-btn danger" data-delete-ann="${a.id}">Delete</button></div></div>`).join('')||'<div class="wf-empty">No announcements yet.</div>'}</div>`);
 $('#wfAnnCreate').onclick=async()=>{try{await req('/api/admin/announcements',{method:'POST',body:JSON.stringify({title:$('#wfAnnTitle').value,message:$('#wfAnnMessage').value,isPublished:$('#wfAnnPublished').checked})});alert('Announcement saved.');loadTab(3)}catch(e){alert(e.message)}};
 c.querySelectorAll('[data-delete-ann]').forEach(b=>b.onclick=async()=>{if(!confirm('Delete this announcement?'))return;try{await req('/api/admin/announcements/'+b.dataset.deleteAnn,{method:'DELETE'});loadTab(3)}catch(e){alert(e.message)}});
 c.querySelectorAll('[data-edit-ann]').forEach(b=>b.onclick=()=>{const a=(d.announcements||[]).find(x=>String(x.id)===b.dataset.editAnn);if(!a)return;const title=prompt('Announcement title:',a.title);if(title===null)return;const message=prompt('Announcement message:',a.message);if(message===null)return;const pub=confirm('Keep this announcement published?');req('/api/admin/announcements/'+a.id,{method:'PATCH',body:JSON.stringify({title,message,isPublished:pub})}).then(()=>loadTab(3)).catch(e=>alert(e.message))});
 }
 if(n===4){const u=user();content(`<h3>Your profile</h3><div class="wf-note">Signed in as <b>${esc(u.username||'')}</b> · ${esc(u.role||'user')}</div><div class="wf-field"><label>Username</label><input id="wfUsername" maxlength="40" value="${esc(u.username||'')}"></div><div class="wf-actions"><button class="wf-btn primary" id="wfSaveProfile">Save username</button><button class="wf-btn" id="wfPassword">Change password</button></div><p class="wf-muted">Changing your password uses the existing secure password-change flow.</p>`);
 $('#wfSaveProfile').onclick=async()=>{try{const d=await req('/api/auth/profile',{method:'PUT',body:JSON.stringify({username:$('#wfUsername').value})});localStorage.setItem('webdoc_user',JSON.stringify({...u,...d.user}));alert('Username updated.');location.reload()}catch(e){alert(e.message)}};
 $('#wfPassword').onclick=()=>{if(typeof changeMyPassword==='function')changeMyPassword();else alert('Use the Change Password option in your profile menu.')};
 }
 }catch(e){content(`<div class="wf-note">Could not load this section: ${esc(e.message)}</div><button class="wf-btn" onclick="location.reload()">Reload page</button>`)}
}
function activityRows(rows){return `<div class="wf-list">${rows.map(x=>`<div class="wf-row"><div><b>${esc(x.action||'Activity')}</b><div class="wf-muted">${esc(x.actor_username||'User')} ${x.target_user_id?'· Target user #'+esc(x.target_user_id):''}</div></div><div class="wf-muted">${esc(x.created_at?new Date(x.created_at).toLocaleString():'')}</div></div>`).join('')||'<div class="wf-empty">No activity recorded yet.</div>'}</div>`}
function downloadJson(data,name){const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();URL.revokeObjectURL(a.href)}
async function showAnnouncements(){
 try{
  const d=await req('/api/announcements');
  const arr=d.announcements||[];
  if(!arr.length)return;
  const host=document.querySelector('.main-shell')||document.querySelector('main')||document.querySelector('.main-content');
  if(!host)return;
  const old=document.getElementById('wfAnnouncementStrip');if(old)old.remove();
  const wrap=document.createElement('div');wrap.id='wfAnnouncementStrip';wrap.setAttribute('role','status');wrap.setAttribute('aria-label','Team announcement');
  wrap.innerHTML='<span class="wf-ann-icon">📢</span><span class="wf-ann-title"></span>';
  wrap.querySelector('.wf-ann-title').textContent=String(arr[0].title||'Announcement');
  const header=host.querySelector('.header');
  if(header)host.insertBefore(wrap,header);else host.prepend(wrap);
 }catch(e){console.warn('Announcements unavailable:',e.message)}
}
function init(){addStyles();renderShell();showAnnouncements()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
