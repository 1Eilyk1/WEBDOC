
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
#wfLaunch{display:${admin()?'flex':'none'};align-items:center;gap:8px;width:100%;margin:8px 0;padding:11px 14px;border:1px solid #287c57;border-radius:12px;background:linear-gradient(120deg,#123c2b,#10251e);color:#d9ffe9;cursor:pointer;font:inherit;text-align:left}
#wfShade{display:none;position:fixed;inset:0;z-index:99999;background:#050b0bdc;backdrop-filter:blur(8px);padding:3vh 2vw;overflow:auto}
#wfShade.open{display:block}.wf-panel{max-width:1050px;margin:0 auto;background:#101b19;color:#e8f5ef;border:1px solid #285b45;border-radius:18px;box-shadow:0 25px 80px #000b;padding:22px;font:14px/1.5 Arial,sans-serif}
.wf-head{display:flex;justify-content:space-between;align-items:center;gap:12px}.wf-head h2{margin:0;font-size:22px}.wf-muted{color:#9bb5a8}.wf-close,.wf-btn{border:1px solid #355d4b;border-radius:9px;padding:9px 13px;background:#172b23;color:#eafff2;cursor:pointer}.wf-btn.primary{background:#176b43;border-color:#258b5b}.wf-btn.danger{background:#512525;border-color:#8a4444}
.wf-tabs{display:flex;gap:7px;flex-wrap:wrap;margin:18px 0}.wf-tab{padding:9px 12px;border:1px solid #355d4b;background:#14231d;color:#cce4d6;border-radius:9px;cursor:pointer}.wf-tab.active{background:#1b6744;color:white}
.wf-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:12px;margin:14px 0}.wf-card{background:#14231e;border:1px solid #294b3c;border-radius:12px;padding:15px}.wf-card strong{display:block;font-size:25px;color:#9bf0bd}.wf-card span{color:#a9c5b5}
.wf-row{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:12px;border-bottom:1px solid #294237}.wf-row:last-child{border:0}.wf-list{background:#12201b;border:1px solid #294b3c;border-radius:12px;overflow:hidden}.wf-field{display:grid;gap:6px;margin:12px 0}.wf-field input,.wf-field textarea{background:#0b1511;border:1px solid #365846;border-radius:8px;color:#effff5;padding:10px;font:inherit}.wf-field textarea{min-height:100px;resize:vertical}.wf-actions{display:flex;gap:8px;flex-wrap:wrap;margin:12px 0}.wf-note{padding:12px;border-radius:10px;background:#172b23;color:#bdd8c7;margin:12px 0}.wf-empty{padding:20px;text-align:center;color:#9bb5a8}
@media(max-width:600px){#wfShade{padding:8px}.wf-panel{padding:14px}.wf-row{align-items:flex-start;flex-direction:column}}
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
async function showAnnouncements(){try{const d=await req('/api/announcements');const arr=d.announcements||[];if(!arr.length)return;const wrap=document.createElement('section');wrap.className='wf-panel';wrap.style.margin='14px 0';wrap.innerHTML='<h3>📢 Team announcements</h3>'+arr.map(a=>`<article class="wf-card" style="margin:8px 0"><b>${esc(a.title)}</b><p>${esc(a.message).replace(/\n/g,'<br>')}</p><small class="wf-muted">${esc(new Date(a.created_at).toLocaleString())}</small></article>`).join('');const main=document.querySelector('main')||document.querySelector('.main-content')||document.body;main.prepend(wrap)}catch(e){console.warn('Announcements unavailable:',e.message)}}
function init(){addStyles();renderShell();showAnnouncements()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
