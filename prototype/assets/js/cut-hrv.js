/* ==========================================================
   APP EMBLEM (SVG) — neutral monogram badge, drawn, no assets.
   Deliberately uses no national symbol / insignia.
   ========================================================== */
function emblemMark(){
  const ink=cssv("--emblem-ink");
  return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="40" fill="none" stroke="${ink}" stroke-width="3"/>
    <text x="50" y="53" text-anchor="middle" dominant-baseline="middle" font-family="Georgia,'Times New Roman',serif" font-weight="700" font-size="40" fill="${ink}">C</text>
    <rect x="34" y="70" width="32" height="3" rx="1.5" fill="${ink}"/></svg>`;
}
document.querySelectorAll("[data-emblem]").forEach(el=>el.innerHTML=emblemMark());

/* ==========================================================
   DATA LAYER  (localStorage-backed, seeded)
   ========================================================== */
/* Current official list — 28 States + 8 Union Territories (post 2019–20 reorganisation) */
const STATES=["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Andaman & Nicobar Islands","Chandigarh","Dadra & Nagar Haveli and Daman & Diu","Delhi","Jammu & Kashmir","Ladakh","Lakshadweep","Puducherry"];
/* Regional commands (each State/UT mapped to exactly one) */
const GROUPS={
  "Northern Command":["Jammu & Kashmir","Ladakh","Himachal Pradesh","Punjab","Chandigarh"],
  "Western Command":["Haryana","Delhi","Uttarakhand"],
  "South Western Command":["Rajasthan","Gujarat","Dadra & Nagar Haveli and Daman & Diu"],
  "Central Command":["Uttar Pradesh","Madhya Pradesh","Chhattisgarh","Bihar","Jharkhand"],
  "Eastern Command":["West Bengal","Sikkim","Assam","Arunachal Pradesh","Nagaland","Manipur","Mizoram","Tripura","Meghalaya","Odisha","Andaman & Nicobar Islands"],
  "Southern Command":["Maharashtra","Goa","Karnataka","Kerala","Tamil Nadu","Telangana","Andhra Pradesh","Puducherry","Lakshadweep"]
};
const AREAS=["Kashmir Valley","Rajouri-Poonch","LoC North","Barmer Sector","Desert Sector","Eastern AOR","NE Sector","Hinterland"];
const YEARS=["2023","2024","2025","2026"];
const STATUS=["Registered","Under Investigation","Substantiated","Unsubstantiated","Closed"];
const ALLEGATIONS=["Wrongful Confinement","Excessive Use of Force","Property Damage","Custodial Complaint","Harassment","Illegal Detention","Search Grievance"];
const RANKS=["Sep","Nk","Hav","Sub","Nb Sub","Lt","Capt","Maj"];
const VICTIMCAT=["Civilian","Complainant","Detainee","Bystander"];
const SEED_V="2";
const DRAFT_KEY="cuthrv_draft";

function seed(force){
  if(!force && localStorage.getItem("cuthrv_cases") && localStorage.getItem("cuthrv_seed_v")===SEED_V) return;
  const victims=["Ghulam Nabi","Farooq Ahmad","Bashir Khan","Mohd Aslam","Rajesh Meena","Prakash Oraon","Lalthanga","Imran Sheikh","Sukhwinder Singh","Bikram Das","Nitin Rathore","Abdul Rehman","Tenzin Dorjee","Suresh Kumar","Ramla Devi","Joseph Lakra","Karim Bux","Hemant Bora","Pawan Yadav","Sanjay Toppo"];
  const accusedUnits=["12 Rajput","8 Sikh LI","4 Gorkha Rif","19 Jat","6 Kumaon","2 Bihar","15 Dogra","9 Para SF"];
  const villages=["Uri","Nowshera","Machil","Barmer","Bomdila","Tawang","Chakrata"];
  const cases=[]; let n=1;
  for(let i=0;i<24;i++){
    const st=STATES[i%STATES.length];
    const ar=AREAS[i%AREAS.length];
    const yr=YEARS[i%YEARS.length];
    const stat=STATUS[i%STATUS.length];
    const alg=ALLEGATIONS[i%ALLEGATIONS.length];
    const dateStr=yr+"-0"+((i%6)+1)+"-"+String((i%27)+1).padStart(2,"0");
    cases.push({
      id:"CUT-HRV/2026/"+String(n++).padStart(4,"0"),
      victim:victims[i%victims.length], victimCat:VICTIMCAT[i%VICTIMCAT.length],
      operation:["Op Rakshak","Op Meghdoot","Op Alert","Area Domination"][i%4],
      area:ar, year:yr, incidentDate:dateStr,
      accused:accusedUnits[i%accusedUnits.length], accusedRank:RANKS[i%RANKS.length],
      state:st, group:groupOf(st),
      allegationType:alg, status:stat,
      address:"Vill "+villages[i%villages.length]+", "+ar,
      allegation:alg+" reported during "+["cordon & search","routine patrol","checkpoint duty","area domination"][i%4]+" operation.",
      created:dateStr
    });
  }
  localStorage.setItem("cuthrv_cases",JSON.stringify(cases));
  localStorage.setItem("cuthrv_audit",JSON.stringify([]));
  localStorage.setItem("cuthrv_seq","25");
  localStorage.setItem("cuthrv_seed_v",SEED_V);
  localStorage.setItem("cuthrv_settings",JSON.stringify({title:"CUT-HRV 2.0",banner:"Upholding human rights with accountability",theme:"Justice Teal",backup:"Daily 02:00 IST"}));
}
const DB={
  cases:()=>JSON.parse(localStorage.getItem("cuthrv_cases")||"[]"),
  save:(c)=>localStorage.setItem("cuthrv_cases",JSON.stringify(c)),
  audit:()=>JSON.parse(localStorage.getItem("cuthrv_audit")||"[]"),
  settings:()=>JSON.parse(localStorage.getItem("cuthrv_settings")||"{}"),
  saveSettings:(s)=>localStorage.setItem("cuthrv_settings",JSON.stringify(s)),
  nextId:()=>{let s=parseInt(localStorage.getItem("cuthrv_seq")||"1");localStorage.setItem("cuthrv_seq",s+1);return "CUT-HRV/2026/"+String(s).padStart(4,"0");}
};
function log(action,detail){
  const a=DB.audit();
  a.unshift({ts:new Date().toLocaleString('en-IN'),user:SESSION.name,role:SESSION.role,action,detail,ip:SESSION.ip});
  localStorage.setItem("cuthrv_audit",JSON.stringify(a.slice(0,200)));
}

/* ==========================================================
   SESSION / AUTH
   ========================================================== */
let SESSION={role:"User",name:"HR User",ip:"10.0.0.0"};
let pickedRole="User";
document.querySelectorAll("#rolePick button").forEach(b=>b.onclick=()=>{
  document.querySelectorAll("#rolePick button").forEach(x=>x.classList.remove("on"));
  b.classList.add("on");pickedRole=b.dataset.role;
  document.getElementById("loginUser").value=pickedRole==="Super Admin"?"hr.superadmin":pickedRole==="Admin"?"hr.admin":"hr.user";
});

/* ==========================================================
   NAVIGATION (role-based)
   ========================================================== */
const NAV={
  User:[["dashboard","\u{1F3E0}","Dashboard"],["new","\u{1F4DD}","New Case (Data Entry)"],["mycases","\u{1F4C2}","Update Regd Cases"],["reports","\u{1F4CA}","Reports"],["analytics","\u{1F4C8}","Analytics"]],
  Admin:[["dashboard","\u{1F3E0}","Dashboard"],["new","\u{1F4DD}","New Case"],["allcases","\u{1F5C3}","Total Cases"],["reports","\u{1F4CA}","Reports"],["analytics","\u{1F4C8}","Analytics"]],
  "Super Admin":[["dashboard","\u{1F3E0}","Dashboard"],["allcases","\u{1F5C3}","Total Cases"],["reports","\u{1F4CA}","Reports"],["analytics","\u{1F4C8}","Analytics"],["cms","\u{2699}\u{FE0F}","Content Mgt System"],["audit","\u{1F4DC}","Audit Log"]]
};
function buildNav(){
  const nav=document.getElementById("sideNav");
  nav.innerHTML='<div class="grp">Main Menu</div>';
  NAV[SESSION.role].forEach(([k,ic,label])=>{
    const a=document.createElement("a");a.dataset.k=k;
    a.innerHTML=icon(k)+' '+label;
    a.onclick=()=>go(k);nav.appendChild(a);
  });
  const f=document.createElement("div");f.className="side-foot";
  f.innerHTML="CUT-HRV v2.0 &middot; ADG HR<br>IHQ of MoD (Army)<br>&copy; 2026 &middot; Restricted";
  nav.appendChild(f);
}
let CURRENT="dashboard";
function go(k){
  CURRENT=k;
  document.querySelectorAll("#sideNav a").forEach(a=>a.classList.toggle("active",a.dataset.k===k));
  const m=document.getElementById("mainArea");m.scrollTop=0;
  m.classList.remove("fade");void m.offsetWidth;m.classList.add("fade");
  const fn=({dashboard:vDashboard,new:vNewCase,mycases:vCases,allcases:vCases,reports:vReports,analytics:vAnalytics,cms:vCMS,audit:vAudit}[k]||vDashboard);
  m.innerHTML=skeletonView();
  setTimeout(()=>{ if(CURRENT===k) fn(m); },150);
}

/* ==========================================================
   VIEWS
   ========================================================== */

let dashStatus="All", dashView="count";
function vDashboard(m){
  const c=DB.cases();
  const cnt=s=>s==="All"?c.length:c.filter(x=>x.status===s).length;
  const reg=cnt("Registered"), inv=cnt("Under Investigation"), sub=cnt("Substantiated"), clo=cnt("Closed");
  const fn=SESSION.name.split("(")[0].trim();
  dashStatus="All"; dashView="count";
  const SEGS=["All","Registered","Under Investigation","Substantiated","Unsubstantiated","Closed"];
  m.innerHTML=`<div class="hero">
    <div class="cw" data-emblem></div>
    <div class="emblem" data-emblem></div>
    <div>
      <div class="crumb" style="color:rgba(255,255,255,.6)">Additional Directorate General of Human Rights</div>
      <h2>Welcome, ${fn}</h2>
      <p>Command dashboard for tracking and adjudication of Human Rights Violation complaints across the Indian Army. All records are encrypted, role-controlled and fully audit-logged on the Army Data Network.</p>
      <div class="chips"><span>&#128993; ${reg+inv} Under Process</span><span>&#9878;&#65039; ${sub} Substantiated</span><span>&#9989; ${clo} Closed</span></div>
    </div>
  </div>`;
  const mAll=monthlyVals(c),mReg=monthlyVals(c.filter(x=>x.status==="Registered")),mInv=monthlyVals(c.filter(x=>x.status==="Under Investigation")),mSub=monthlyVals(c.filter(x=>x.status==="Substantiated"));
  m.innerHTML+=`
  <div class="grid kpis" style="margin-bottom:18px">
    ${kpiC("Total Complaints",c.length,cssv('--g700'),"&#128203;","var(--line-2)","view all cases","All",mAll)}
    ${kpiC("Newly Registered",reg,cssv('--warn'),"&#128221;","#fbf1dd","awaiting action","Registered",mReg)}
    ${kpiC("Under Investigation",inv,cssv('--info'),"&#128269;","#dbe8f7","in progress","Under Investigation",mInv)}
    ${kpiC("Substantiated",sub,cssv('--danger'),"&#9878;&#65039;","#f7dede","violation confirmed","Substantiated",mSub)}
  </div>
  <div class="card chartcard" style="margin-bottom:18px"><h3><span class="bar"></span> New Complaints &mdash; Monthly Trend</h3>${lineChart(monthly(c),{color:cssv('--g600')})}</div>
  <div class="row2">
    <div class="card panel">
      <h3><span class="bar"></span> Recent Complaints <span id="dashCap" class="muted" style="font-weight:400;font-size:12px;margin-left:auto"></span></h3>
      <div class="segbar" id="segbar">
        ${SEGS.map(s=>`<button class="seg${s===dashStatus?' on':''}" data-s="${s}" onclick="dashSetStatus('${s}')">${s} <b>${cnt(s)}</b></button>`).join("")}
      </div>
      <table class="tbl"><thead><tr><th>Case ID</th><th>Victim</th><th>Allegation</th><th>Status</th></tr></thead><tbody id="recentRows"></tbody></table>
      <div id="dashEmpty" class="muted" style="text-align:center;padding:18px;display:none">No cases in this category.</div>
    </div>
    <div class="card chartcard">
      <h3><span class="bar"></span> Complaint Status Distribution</h3>
      <p class="muted" style="font-size:11.5px;margin:-8px 0 12px">&#128073; Click a segment (or legend) to filter the list</p>
      ${donutDash([["Registered",reg,"#c77800"],["Under Investigation",inv,"#1565a8"],["Substantiated",sub,"#a83232"],["Unsubstantiated",cnt("Unsubstantiated"),"#2c6e39"],["Closed",clo,"#6b45b0"]])}
    </div>
  </div>
  <div class="card panel" style="margin-top:18px">
    <h3><span class="bar"></span> Case Lifecycle &amp; Adjudication Pipeline
      <span class="toggle" style="margin-left:auto">
        <button class="tg on" id="tgCount" onclick="dashSetView('count')">By Count</button>
        <button class="tg" id="tgValue" onclick="dashSetView('value')">By Share %</button>
      </span>
    </h3>
    <div class="grid" id="wfGrid" style="grid-template-columns:repeat(auto-fit,minmax(180px,1fr))"></div>
  </div>`;
  document.querySelectorAll("#mainArea [data-emblem]").forEach(el=>el.innerHTML=emblemMark());
  dashRenderRows(); dashRenderWF(); runCounts(m);
}
function kpiC(l,v,c,ico,icbg,tr,status,spark){return `<div class="card kpi clickable" onclick="jumpCases('${status}')"><div class="strip" style="background:${c}"></div><div class="top"><div class="lbl">${l}</div><div class="ico" style="background:${icbg}">${ico}</div></div><div class="val">${kpiValHtml(v,false)}</div><div class="tr" style="color:var(--info)">${tr} &rarr;</div>${spark?sparkSVG(spark,c):''}</div>`;}
function dashRenderRows(){
  const rows=document.getElementById("recentRows"); if(!rows) return;
  let c=DB.cases(); if(dashStatus!=="All") c=c.filter(x=>x.status===dashStatus);
  const cap=document.getElementById("dashCap"); if(cap) cap.textContent=dashStatus==="All"?c.length+" total":c.length+" &middot; "+dashStatus;
  document.getElementById("dashEmpty").style.display=c.length?"none":"block";
  rows.innerHTML=c.slice(0,8).map(x=>`<tr style="cursor:pointer" title="Open case" onclick="viewCase('${x.id}')"><td><b>${x.id}</b></td><td>${x.victim}<div class="muted" style="font-size:11px">${x.victimCat} &middot; ${x.area}</div></td><td>${x.allegationType}</td><td>${statusTag(x.status)}</td></tr>`).join("");
}
function dashRenderWF(){
  const c=DB.cases(); const g=document.getElementById("wfGrid"); if(!g) return;
  const T=c.length||1;
  const stages=[["1 &middot; Registration",["Registered"],"var(--warn)"],["2 &middot; Investigation",["Under Investigation"],"var(--info)"],["3 &middot; Findings",["Substantiated","Unsubstantiated"],"var(--ok)"],["4 &middot; Closure",["Closed"],"var(--g700)"]];
  g.innerHTML=stages.map(([l,sts,col])=>{
    const n=c.filter(x=>sts.includes(x.status)).length;
    const disp=dashView==="value"?Math.round(n/T*100)+"%":n;
    return `<div class="wfcard"><div class="muted" style="font-size:12px;font-weight:600">${l}</div><div style="font-size:26px;font-weight:800;color:${col};font-family:var(--serif)">${disp}</div><div class="mini-bar" style="margin-top:8px"><i style="width:${Math.min(100,n*8)}%"></i></div></div>`;
  }).join("");
}
function statusTag(s){const m={"Registered":"t-open","Under Investigation":"t-review","Substantiated":"t-rej","Unsubstantiated":"t-appr","Closed":"t-trans"};return '<span class="tag '+(m[s]||'t-open')+'">'+s+'</span>';}

/* ---- New Case — single consolidated page ---- */
let wizData={};
function vNewCase(m){
  const draft=JSON.parse(localStorage.getItem(DRAFT_KEY)||"null");
  const hasDraft=draft&&Object.keys(draft).filter(k=>draft[k]&&k!=="id").length>0;
  wizData=hasDraft?draft:{id:DB.nextId()};
  m.innerHTML=head("New Case &mdash; Data Entry","Auto Case No: <b>"+wizData.id+"</b> &middot; complete all sections below, then submit","New Case");
  m.innerHTML+=(hasDraft?'<div class="card" style="padding:11px 15px;margin-bottom:14px;border-left:4px solid var(--gold);background:var(--cream);font-size:12.5px;display:flex;align-items:center;gap:10px"><span>&#128190; Draft restored from your last unsaved entry.</span><button class="btn sm ghost" style="margin-left:auto" onclick="discardDraft()">Discard draft</button></div>':'')+
   '<div class="card panel"><div class="formlayout"><div class="formrail" id="formRail"></div><div><div id="formSecs"></div>'+
    '<div class="form-actions"><span class="muted" style="margin-right:auto;font-size:12px">Fields marked <span class="req" style="color:var(--danger)">*</span> are mandatory &middot; entries auto-save</span>'+
    '<button class="btn ghost" onclick="go(SESSION.role===\'User\'?\'mycases\':\'allcases\')">Cancel</button>'+
    '<button class="btn primary" onclick="submitSingle()">&#10003; Register Complaint</button></div></div></div></div>';
  renderForm();
}
const WIZ=[
  {t:"Auto Case No",f:[["id","Case Number","text",true,true]]},
  {t:"Operation Details",f:[["operation","Operation / Context","select",true,false,["Op Rakshak","Op Meghdoot","Op Alert","Area Domination"]],["area","Area of Responsibility","select",true,false,AREAS],["incidentDate","Date of Incident","date",true],["year","Year","select",true,false,YEARS]]},
  {t:"Victim Details",f:[["victim","Victim Name","text",true],["victimCat","Victim Category","select",true,false,VICTIMCAT],["state","State","select",true,false,STATES],["address","Address / Village","textarea",true]]},
  {t:"Accused Details",f:[["accused","Accused Unit / Sub-unit","text",true],["accusedRank","Rank of Accused (if known)","select",false,false,RANKS]]},
  {t:"Allegations",f:[["allegationType","Allegation Type","select",true,false,ALLEGATIONS],["allegation","Allegation Details","textarea",true]]}
];
function submitCase(){
  const c=DB.cases();
  wizData.status="Registered";wizData.group=groupOf(wizData.state);
  wizData.created=new Date().toISOString().slice(0,10);
  c.unshift(wizData);DB.save(c);
  log("CREATE_CASE","Registered "+wizData.id+" ("+wizData.victim+")");
  toast("Complaint "+wizData.id+" registered &amp; encrypted (AES-256)");
  go("mycases");
}

/* ---- Cases list ---- */
let filterQ="",filterS="",filterG="";
const QF=[["all","All",()=>true],["open","Open (Reg.+Inv.)",x=>x.status==="Registered"||x.status==="Under Investigation"],["substantiated","Substantiated",x=>x.status==="Substantiated"],["closed","Closed",x=>x.status==="Closed"],["y2026","Year 2026",x=>x.year==="2026"]];
let qfKey="all";
function vCases(m){
  const isAll=CURRENT==="allcases";page=1;selected=new Set();
  m.innerHTML=head(isAll?"Total Cases":"Update Registered Cases",isAll?"All cases across the directorate":"Cases you can view and update",isAll?"Total Cases":"My Cases");
  m.innerHTML+=`<div class="card panel">
    <div class="qfbar">${QF.map(q=>{const qn=DB.cases().filter(q[2]).length;return `<button class="qf${q[0]===qfKey?' on':''}" onclick="setQf('${q[0]}')">${q[1]} <b>${qn}</b></button>`;}).join("")}</div>
    <div class="toolbar">
      <div class="search"><input id="q" value="${filterQ}" placeholder="Search case ID, victim, area, allegation..." oninput="filterQ=this.value;page=1;drawRows()"></div>
      <select id="fs" onchange="filterS=this.value;page=1;drawRows()" style="padding:10px;border:1px solid var(--line);border-radius:9px;background:#fff">
        <option value="">All Status</option>${STATUS.map(s=>'<option'+(s===filterS?' selected':'')+'>'+s+'</option>').join("")}</select>
      ${(filterG||filterS||filterQ||qfKey!=='all')?'<button class="btn sm" onclick="clearFilters()">&#10005; Clear</button>':''}
      <button class="btn primary sm" onclick="go('new')">+ New Case</button>
    </div>
    ${filterG?'<div class="muted" style="margin:-6px 0 12px;font-size:12px">Showing complaints under command: <b>'+filterG+'</b></div>':''}
    <div class="bulkbar" id="bulkbar"></div>
    <div class="tblwrap"><table class="tbl"><thead><tr>
      <th style="width:36px"><input type="checkbox" class="chk" id="chkAll" onclick="toggleAll(this)"></th>
      ${th("id","Case ID")}${th("victim","Victim")}${th("area","Area / State")}${th("allegationType","Allegation")}${th("status","Status")}<th>Actions</th>
    </tr></thead><tbody id="rows"></tbody></table></div>
    <div id="empty" style="display:none"></div>
    <div class="pager" id="pager"></div>
  </div>`;
  drawRows();
}
function getFiltered(){
  let c=DB.cases();const qf=QF.find(q=>q[0]===qfKey);if(qf)c=c.filter(qf[2]);
  if(filterQ){const q=filterQ.toLowerCase();c=c.filter(x=>(x.id+x.victim+x.state+x.area+x.allegationType+x.year).toLowerCase().includes(q));}
  if(filterS)c=c.filter(x=>x.status===filterS);
  if(filterG)c=c.filter(x=>x.group===filterG);
  c.sort((a,b)=>{let va=a[sortKey],vb=b[sortKey];if(va==null)va="";if(vb==null)vb="";if(typeof va==="string"){va=va.toLowerCase();vb=(""+vb).toLowerCase();}return(va>vb?1:va<vb?-1:0)*sortDir;});
  return c;
}
function drawRows(){
  const rows=document.getElementById("rows");if(!rows)return;
  const all=getFiltered();const tot=all.length;const pages=Math.max(1,Math.ceil(tot/perPage));if(page>pages)page=pages;
  const emptyEl=document.getElementById("empty");
  if(!tot){rows.innerHTML="";emptyEl.style.display="block";emptyEl.innerHTML=emptyState("No matching complaints","Try adjusting your search or filters, or register a new complaint.","clearFilters()","Clear filters");document.getElementById("pager").innerHTML="";updateBulk();return;}
  emptyEl.style.display="none";
  const canAdj=SESSION.role!=="User";
  rows.innerHTML=all.slice((page-1)*perPage,page*perPage).map(x=>`<tr>
    <td><input type="checkbox" class="chk" ${selected.has(x.id)?'checked':''} onclick="toggleSel('${x.id}',this)"></td>
    <td><b>${x.id}</b><div class="muted" style="font-size:11px">${x.created}</div></td>
    <td>${x.victim}<div class="muted" style="font-size:11px">${x.victimCat}</div></td>
    <td>${x.area}<div class="muted" style="font-size:11px">${x.state}</div></td>
    <td>${x.allegationType}</td>
    <td>${statusTag(x.status)}</td>
    <td>
      <span class="act" onclick="viewCase('${x.id}')">View</span>
      <span class="act" onclick="editCase('${x.id}')">Edit</span>
      ${canAdj&&x.status!=="Closed"?'<span class="act a" onclick="adjudicateCase(\''+x.id+'\')">Adjudicate</span>':''}
      <span class="act d" onclick="delCase('${x.id}')">Delete</span>
    </td></tr>`).join("");
  drawPager(pages,tot);syncChkAll();updateBulk();
}
function updateBulk(){const b=document.getElementById('bulkbar');if(!b)return;
  if(selected.size){b.classList.add('on');b.innerHTML=`<b>${selected.size} selected</b>
    <button class="btn sm" onclick="bulkExport()">&#11015; Export CSV</button>
    ${SESSION.role!=='User'?'<button class="btn sm" onclick="bulkClose()">&#10003; Close cases</button>':''}
    <button class="btn sm ghost" style="margin-left:auto;color:#fff;border-color:rgba(255,255,255,.45)" onclick="clearSel()">Clear</button>`;}
  else{b.classList.remove('on');b.innerHTML="";}}
function bulkClose(){const n=selected.size;const c=DB.cases();c.forEach(x=>{if(selected.has(x.id))x.status="Closed";});DB.save(c);log("BULK_CLOSE",n+" complaints closed");toast(n+" complaints closed");selected=new Set();drawRows();}
function bulkExport(){exportRows(DB.cases().filter(x=>selected.has(x.id)));toast("Exported "+selected.size+" selected complaints");}
function exportRows(c){const csv=["Case ID,Victim,Category,Area,State,Allegation,Accused,Status"].concat(c.map(x=>[x.id,x.victim,x.victimCat,x.area,x.state,x.allegationType,x.accused,x.status].join(","))).join("\n");
  const blob=new Blob([csv],{type:"text/csv"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="CUT-HRV_cases.csv";a.click();}
function viewCase(id){
  const x=findCase(id);log("VIEW_CASE","Viewed "+id);
  modal("Complaint "+x.id,`
    <div class="formgrid">
      ${kv("Victim",x.victim)}${kv("Victim Category",x.victimCat)}
      ${kv("Operation / Context",x.operation)}${kv("Incident Date",x.incidentDate)}
      ${kv("Area (AOR)",x.area)}${kv("State",x.state)}
      ${kv("Group",x.group)}${kv("Year",x.year)}
      ${kv("Accused Unit",x.accused)}${kv("Accused Rank",x.accusedRank||"—")}
      ${kv("Allegation Type",x.allegationType)}${kv("Status",x.status)}
      <div class="field full">${kv("Address",x.address)}</div>
      <div class="field full">${kv("Allegation Details",x.allegation)}</div>
    </div>
    <div class="demo-note" style="margin-top:16px">&#128274; Record stored encrypted (AES-256). Access logged: ${SESSION.name} @ ${SESSION.ip}</div>`,
    [{t:"Close",c:"ghost",fn:closeModal},{t:"Edit",c:"primary",fn:()=>{closeModal();editCase(id);}}]);
}
function editCase(id){
  const x=findCase(id);
  modal("Edit "+x.id,`<div class="formgrid">
    <div class="field"><label>Victim</label><input id="e_victim" value="${x.victim}"></div>
    <div class="field"><label>Accused Unit</label><input id="e_accused" value="${x.accused}"></div>
    <div class="field"><label>Allegation Type</label><select id="e_alleg">${ALLEGATIONS.map(s=>'<option '+(s===x.allegationType?'selected':'')+'>'+s+'</option>').join("")}</select></div>
    <div class="field"><label>Status</label><select id="e_status">${STATUS.map(s=>'<option '+(s===x.status?'selected':'')+'>'+s+'</option>').join("")}</select></div>
    <div class="field full"><label>Allegation Details</label><textarea id="e_det" rows="3">${x.allegation}</textarea></div>
  </div>`,[{t:"Cancel",c:"ghost",fn:closeModal},{t:"Save Changes",c:"primary",fn:()=>{
    const c=DB.cases();const t=c.find(y=>y.id===id);
    t.victim=val("e_victim");t.accused=val("e_accused");t.allegationType=val("e_alleg");t.status=val("e_status");t.allegation=val("e_det");
    DB.save(c);log("EDIT_CASE","Modified "+id);closeModal();toast("Complaint "+id+" updated");drawRows();
  }}]);
}
function adjudicateCase(id){
  const x=findCase(id);
  modal("Adjudicate "+id,`<p class="muted" style="margin-bottom:12px">Record the finding for allegation: <b>${x.allegationType}</b> (${x.victim}).</p>
    <div class="field"><label>Finding / Status</label><select id="adj_status">${["Under Investigation","Substantiated","Unsubstantiated","Closed"].map(s=>'<option '+(s===x.status?'selected':'')+'>'+s+'</option>').join("")}</select></div>
    <div class="field" style="margin-top:12px"><label>Remarks</label><textarea id="adj_rem" rows="2" placeholder="Board of Officers finding / action taken"></textarea></div>`,
  [{t:"Cancel",c:"ghost",fn:closeModal},{t:"Record Finding",c:"primary",fn:()=>{
    const c=DB.cases();const t=c.find(y=>y.id===id);t.status=val("adj_status");t.finding=val("adj_rem");
    DB.save(c);log("ADJUDICATE_CASE",id+" → "+val("adj_status"));closeModal();toast("Complaint "+id+" — finding recorded: "+val("adj_status"));drawRows();
  }}]);
}
function delCase(id){modal("Confirm Deletion","<p>Delete complaint <b>"+id+"</b>? This action is audit-logged and irreversible.</p>",
  [{t:"Cancel",c:"ghost",fn:closeModal},{t:"Delete",c:"danger",fn:()=>{DB.save(DB.cases().filter(x=>x.id!==id));log("DELETE_CASE","Deleted "+id);closeModal();toast("Complaint "+id+" deleted");drawRows();}}]);}

/* ---- Reports (with digital watermark) ---- */
function vReports(m){
  m.innerHTML=head("Reports","Templated, printable and exportable reports, digitally watermarked.","Reports");
  m.innerHTML+=`<div class="card panel">
    <div class="toolbar">
      <select id="rt" style="padding:10px;border:1px solid var(--line);border-radius:9px;background:#fff">
        <option value="summary">Complaint Summary Report</option>
        <option value="area">Area-wise Complaint Report</option>
        <option value="pending">Pending Investigation Report</option>
      </select>
      <button class="btn primary sm" onclick="genReport()">Generate</button>
      <button class="btn sm" onclick="window.print()">&#128424; Print</button>
      <button class="btn sm" onclick="exportCsv()">&#11015; Export CSV</button>
    </div>
    <div id="reportArea"></div>
  </div>`;
  genReport();
}
function genReport(){
  const type=document.getElementById("rt").value;const c=DB.cases();
  const stamp=new Date().toLocaleString('en-IN');
  let title,rows;
  if(type==="area"){title="Area-wise Complaint Report";
    const by={};c.forEach(x=>{by[x.area]=(by[x.area]||0)+1;});
    const sub={};c.forEach(x=>{if(x.status==="Substantiated")sub[x.area]=(sub[x.area]||0)+1;});
    rows='<table class="tbl"><thead><tr><th>Area (AOR)</th><th>Complaints</th><th>Substantiated</th></tr></thead><tbody>'+
      Object.keys(by).map(s=>'<tr><td>'+s+'</td><td>'+by[s]+'</td><td>'+(sub[s]||0)+'</td></tr>').join("")+'</tbody></table>';
  }else if(type==="pending"){title="Pending Investigation Report";
    const p=c.filter(x=>x.status==="Registered"||x.status==="Under Investigation");
    rows='<table class="tbl"><thead><tr><th>Case ID</th><th>Victim</th><th>Area</th><th>Allegation</th><th>Status</th></tr></thead><tbody>'+
      p.map(x=>'<tr><td>'+x.id+'</td><td>'+x.victim+'</td><td>'+x.area+'</td><td>'+x.allegationType+'</td><td>'+x.status+'</td></tr>').join("")+'</tbody></table>';
  }else{title="Complaint Summary Report";
    rows='<table class="tbl"><thead><tr><th>Case ID</th><th>Victim</th><th>Area</th><th>Allegation</th><th>Status</th></tr></thead><tbody>'+
      c.slice(0,12).map(x=>'<tr><td>'+x.id+'</td><td>'+x.victim+'</td><td>'+x.area+'</td><td>'+x.allegationType+'</td><td>'+x.status+'</td></tr>').join("")+'</tbody></table>';
  }
  const wmText=(SESSION.name+" · ADG HR · CONFIDENTIAL · "+SESSION.ip+" · ").repeat(120);
  document.getElementById("reportArea").innerHTML=`<div class="report-sheet">
    <div class="wm"><span>${wmText}</span></div>
    <div class="rh"><div class="emblem" data-emblem></div><h3>Additional Directorate General of Human Rights</h3><div class="muted">IHQ of MoD (Army) &middot; CUT-HRV 2.0 &middot; ${title}</div></div>
    ${rows}
    <div class="rf">
      <span>&#128274; Generated by: <b>${SESSION.name}</b> (${SESSION.role})</span>
      <span>IP: ${SESSION.ip}</span>
      <span>Timestamp: ${stamp}</span>
      <span>Digitally watermarked &middot; IPR: ADG HR</span>
    </div>
  </div>`;
  document.querySelectorAll("#reportArea [data-emblem]").forEach(el=>el.innerHTML=emblemMark());
  log("GENERATE_REPORT",title);
}
function exportCsv(){const c=DB.cases();exportRows(c);log("EXPORT_CSV","Exported "+c.length+" cases");toast("Exported "+c.length+" complaints to CSV");}

/* ---- Analytics (interactive, scaled axes + legends) ---- */
const AN_DIMS=[["area","Area (AOR)","area"],["year","Year","year"],["command","Command","group"],["allegation","Allegation Type","allegationType"],["status","Status","status"]];
let anDim="area";
const STATUS_COL={"Registered":"#c77800","Under Investigation":"#1565a8","Substantiated":"#a83232","Unsubstantiated":"#2c6e39","Closed":"#6b45b0"};
function vAnalytics(m){
  m.innerHTML=head("Analytics &amp; Visualisation","Pick a dimension and measure, then click any bar, donut segment or legend to drill into those complaints.","Analytics");
  m.innerHTML+=`<div class="card panel">
    <div class="an-ctrl">
      <span class="muted" style="font-weight:700;letter-spacing:.4px">GROUP BY</span>
      <select id="anDim" onchange="anDim=this.value;drawAnalytics()">${AN_DIMS.map(d=>`<option value="${d[0]}"${d[0]===anDim?' selected':''}>${d[1]}</option>`).join("")}</select>
      <span class="muted" id="anTot" style="margin-left:auto;font-weight:600"></span>
    </div>
    <div id="anMain"></div>
    <div class="legend" id="anLeg" style="margin-top:10px"></div>
  </div>
  <div class="row2" style="margin-top:18px">
    <div class="card chartcard"><h3><span class="bar"></span> Command-wise Distribution</h3><div id="anDonut"></div></div>
    <div class="card chartcard"><h3><span class="bar"></span> Status Breakdown</h3><div id="anStatus"></div></div>
  </div>`;
  drawAnalytics(); drawSideCharts();
  log("VIEW_ANALYTICS","Opened analytics dashboard");
}
function anAgg(field){const c=DB.cases();const o={};c.forEach(x=>{const k=x[field]||"—";o[k]=(o[k]||0)+1;});return o;}
function drawAnalytics(){
  const dim=AN_DIMS.find(d=>d[0]===anDim);
  const o=anAgg(dim[2]);
  const data=Object.keys(o).sort((a,b)=>o[b]-o[a]).map(k=>[k,o[k],k]);
  const color=cssv('--g600');
  document.getElementById("anMain").innerHTML=barChartAxis(data,{color,onClick:"anJump"});
  const tot=data.reduce((s,d)=>s+d[1],0);
  document.getElementById("anTot").innerHTML=tot+" complaints · "+data.length+" "+dim[1].toLowerCase().replace(" (aor)","")+(data.length>1?"s":"");
  document.getElementById("anLeg").innerHTML=`<span><i style="background:${color}"></i>Number of complaints by ${dim[1]}</span><span class="muted">&#128073; Click a bar to view those complaints</span>`;
}

/* ---- CMS ---- */

/* ---- Audit ---- */

/* ==========================================================
   MODAL / TOAST
   ========================================================== */
function openProfile(){
  const dark=document.body.classList.contains("dark");
  const cmp=document.body.classList.contains("compact");
  const nm=SESSION.name.split("(")[0].trim();
  const email=nm.toLowerCase().replace(/[^a-z]+/g,".").replace(/(^\.|\.$)/g,"")+"@army.gov.in";
  const initial=(document.getElementById("uAv")||{}).textContent||nm[0]||"U";
  const formation={"Super Admin":"HQ ADG-HR &middot; Records Cell","Admin":"Formation HQ &middot; HR Cell","User":"Unit Orderly Room"}[SESSION.role]||"—";
  const body=`
    <div class="prof-hd">
      <div class="pav">${initial}</div>
      <div><b>${SESSION.name}</b><br><span class="pill">${SESSION.role}</span></div>
    </div>
    <div class="prof-sec"><h4>Account</h4>
      <div class="prof-row"><span class="k">Full name</span><span class="v">${nm}</span></div>
      <div class="prof-row"><span class="k">Role / access</span><span class="v">${SESSION.role}</span></div>
      <div class="prof-row"><span class="k">Email</span><span class="v">${email}</span></div>
      <div class="prof-row"><span class="k">Formation</span><span class="v">${formation}</span></div>
      <div class="prof-row"><span class="k">Signed in from</span><span class="v">${SESSION.ip}</span></div>
      <div class="prof-row"><span class="k">Authentication</span><span class="v">SAML 2.0 + IACA 2FA</span></div>
    </div>
    <div class="prof-sec"><h4>Appearance</h4>
      <div class="prof-tog">
        <button type="button" class="${dark?'on':''}" onclick="toggleTheme();openProfile()"><span class="dot"></span>Dark mode</button>
        <button type="button" class="${cmp?'on':''}" onclick="toggleDensity();openProfile()"><span class="dot"></span>Compact rows</button>
      </div>
      <div class="prof-swatch">${Object.keys(PALETTES).map(nm=>`<button type="button" class="sw${nm===currentPal()?' on':''}" onclick="applyTheme('${nm}');openProfile()"><span class="swx" style="background:${PAL_SWATCH[nm]||'#888'}"></span>${nm}</button>`).join("")}</div>
    </div>
    <div class="prof-sec"><h4>Notifications</h4>
      <div class="prof-tog">
        <button type="button" class="on" onclick="this.classList.toggle('on')"><span class="dot"></span>Case status updates</button>
        <button type="button" class="on" onclick="this.classList.toggle('on')"><span class="dot"></span>Closures &amp; sign-offs</button>
        <button type="button" onclick="this.classList.toggle('on')"><span class="dot"></span>Weekly summary</button>
      </div>
    </div>
    <div class="prof-sec"><h4>Security</h4>
      <div class="prof-tog">
        <button type="button" onclick="closeModal();changePassword()"><span class="dot" style="opacity:1"></span>Change password</button>
        <button type="button" onclick="toast('IACA PIN changes are handled by the Army IAM portal in production.')"><span class="dot" style="opacity:1"></span>Change IACA PIN</button>
        <button type="button" onclick="closeModal();logout()"><span class="dot" style="opacity:1"></span>Sign out</button>
      </div>
    </div>
    <p class="muted" style="font-size:11px;margin:14px 0 0">Prototype &mdash; profile fields are illustrative and read from the demo session. In production these are provisioned by Army IAM (SAML) and are not edited here.</p>`;
  modal("Profile &amp; Settings",body,[{t:"Done",c:"primary",fn:closeModal}]);
}

/* ==========================================================
   CHATBOT (on-prem, canned knowledge)
   ========================================================== */
const BOT={
  name:"CUT-HRV Assistant", app:"CUT-HRV 2.0", entity:"complaint", entities:"complaints",
  idRe:/cut[- ]?hrv[\s\/]*\d{4}[\s\/]*\d{1,4}/i,
  hello:"Namaste \u{1F64F} I'm the <b>CUT-HRV Assistant</b> — an on-premise, ETAI-compliant AI that runs fully offline on the Army Data Network. I can explain HRV policy, the investigation &amp; adjudication workflow, roles, security &amp; support, and answer live questions about the complaint data.<br><span style='color:var(--muted);font-size:11.5px'>Try: “what is a substantiated finding?”, “how many under investigation?”, or “show CUT-HRV/2026/0003”.</span>",
  summary:x=>`<b>${x.id}</b><br>Victim: <b>${x.victim}</b> (${x.victimCat})<br>Allegation: <b>${x.allegationType}</b><br>Operation: ${x.operation} &middot; Area: ${x.area}<br>Accused: ${x.accused}<br>State: ${x.state} &middot; Year: ${x.year}<br>Status: <b>${x.status}</b>`
};
const DEFAULT_SUG=["What is CUT-HRV 2.0?","How many substantiated?","What is a violation?","Security features"];
const KB=[
  {t:["hello","hi","hey","namaste","good morning","good evening"],a:()=>"Namaste 🙏 How can I help? Ask about HRV policy, using "+BOT.app+", security, or live complaint data.",n:["What is CUT-HRV 2.0?","How do I register a complaint?","Is it secure?"]},
  {t:["thank","thanks","great","appreciate"],a:()=>"Happy to help. Anything else on complaints, policy or security?"},
  {t:["who are you","what are you","your name","what can you do","help me","capabilities","topics"],a:()=>"I'm the on-premise "+BOT.name+", an offline ETAI-compliant assistant. I cover HRV policy, the investigation/adjudication workflow, roles &amp; access, security (SAML/2FA/AES-256), reports, analytics, migration and support — plus live data (counts &amp; complaint look-ups).",n:["What is a violation?","How many substantiated?","Security features"]},
  {t:["what is cut","about cut","about the app","what does this","purpose","cut-hrv"],a:()=>"<b>CUT-HRV 2.0</b> (Case Update Tool for Human Rights Violation) is the upgraded ADG HR application to register, investigate and adjudicate human-rights-violation complaints involving the Army — with analytics and a full audit trail on the Army Data Network.",n:["What is a violation?","Workflow stages","Who can use it?"]},
  {t:["scope","version 2","upgrade","re-develop","redevelop","new feature","v2"],a:()=>"Version 2.0 re-develops the legacy PHP/MySQL app with a modern secure stack, a CMS, e-office workflow automation, encrypted V1→V2 data migration, API integration with Army applications, digital watermarking and an on-prem AI assistant.",n:["Technology stack","Migration","Security features"]},
  {t:["what is a violation","hrv policy","how filed","how to complain","what counts","complaint policy","grievance"],a:()=>"An HRV complaint records an alleged violation — e.g. <b>wrongful confinement, excessive use of force, custodial complaint, illegal detention</b> — involving a victim and an accused unit during an operation. It is registered, investigated, and adjudicated as Substantiated or Unsubstantiated, then Closed.",n:["Workflow stages","Allegation types","How do I register a complaint?"]},
  {t:["workflow","process","stages","lifecycle","adjudicat","finding","steps","e-office"],a:()=>"Lifecycle: <b>Registered → Under Investigation → Findings (Substantiated / Unsubstantiated) → Closed</b>. Admins/Super Admins record findings via the <b>Adjudicate</b> action; every step is audit-logged. Live counts appear on the dashboard pipeline.",n:["What is substantiated?","How many under investigation?"]},
  {t:["substantiated","unsubstantiated","status mean","registered","under investigation","closed","what does status"],a:()=>"<b>Registered</b> = newly filed · <b>Under Investigation</b> = enquiry in progress · <b>Substantiated</b> = violation confirmed · <b>Unsubstantiated</b> = not established · <b>Closed</b> = disposed. Currently "+DB.cases().filter(x=>x.status==='Substantiated').length+" substantiated, "+DB.cases().filter(x=>x.status==='Under Investigation').length+" under investigation.",n:["How many closed?","Workflow stages"]},
  {t:["role","access","permission","who can use","privilege"],a:()=>"Three roles with least-privilege RBAC: <b>User</b> (register &amp; update complaints, view reports/analytics), <b>Admin</b> (all complaints + adjudicate), <b>Super Admin</b> (everything + Content Management + Audit Log).",n:["How do I register a complaint?","Security features"]},
  {t:["register","new case","new complaint","add case","file complaint","data entry","file a case"],a:()=>"Open <b>New Case (Data Entry)</b>. A single consolidated form captures Auto Case No, Operation Details, Victim Details, Accused Details and Allegations — all on one page. On submit the record is AES-256 encrypted and enters the workflow as ‘Registered’.",n:["Workflow stages","Allegation types"]},
  {t:["edit","update case","modify","change a case"],a:()=>"Open <b>Update Regd Cases</b> (or Total Cases for admins), click <b>Edit</b>, change the fields and Save. Every change is audit-logged.",n:["Adjudicate a case","Audit log"]},
  {t:["allegation type","types of","categories","kinds of"],a:()=>{const t={};DB.cases().forEach(x=>t[x.allegationType]=(t[x.allegationType]||0)+1);const top=Object.entries(t).sort((a,b)=>b[1]-a[1])[0];return "Allegations span <b>"+Object.keys(t).length+"</b> categories (Wrongful Confinement, Excessive Use of Force, Property Damage, Custodial Complaint, Harassment, Illegal Detention, Search Grievance). Most frequent: <b>"+top[0]+"</b> ("+top[1]+" cases).";},n:["How many substantiated?","Analytics"]},
  {t:["report","export","csv","print"],a:()=>"<b>Reports</b> offers Complaint Summary, Area-wise and Pending Investigation. Every report is <b>digitally watermarked</b> with your ID, IP and timestamp, and can be printed or exported to CSV.",n:["Analytics","Watermarking"]},
  {t:["analytic","chart","visual","statistic","graph"],a:()=>"<b>Analytics</b> is fully interactive — group complaints by Area, Year, Command, Allegation Type or Status, and click any bar, donut segment or legend to drill straight into those complaints. All charts carry proper scales &amp; legends.",n:["How many substantiated?","Reports"]},
  {t:["migration","version 1","v1","legacy data","old data"],a:()=>"Existing CUT-HRV 1.0 data (PHP/MySQL, encrypted) is migrated to 2.0 by a dedicated <b>migration module</b> that preserves authenticity and integrity. Dry-run it from CMS → Database Update.",n:["Technology stack","Database"]},
  {t:["security","secure","encryption","aes","2fa","two factor","saml","iaca","iam","rbac","hardening","owasp"],a:()=>"<b>Security:</b> SAML 2.0 login via Army IAM, mandatory <b>IACA-token 2FA</b>, <b>AES-256</b> encryption at rest (nothing stored unencrypted), IACA SSL/HTTPS, role-based access, malicious-upload checks and comprehensive audit logging. Runs fully offline on the ADN — no internet.",n:["Audit log","Is it offline?","Watermarking"]},
  {t:["audit","who did","activity","trail"],a:()=>"The <b>Audit Log</b> (Super Admin) records every action — logins, views, edits, adjudications, deletes, report generation — with user, role, timestamp and IP, for security analysis.",n:["Security features","Roles"]},
  {t:["watermark"],a:()=>"Any printed/PDF output is <b>digitally watermarked</b> with the machine IP, User ID and timestamp — visible across generated reports.",n:["Reports","Security features"]},
  {t:["backup","normalis","normaliz","3nf","bcnf"],a:()=>"Database backups run <b>daily</b> (or on demand from CMS). Data is normalised to <b>3NF/BCNF</b>.",n:["Database","Migration"]},
  {t:["database","data field","how many field","how many user","10000","500 field","capacity"],a:()=>"Database: <b>MS SQL 2022 or MySQL</b>, up to <b>500 data fields</b>, catering for up to <b>10,000 users</b>, 3NF/BCNF normalised, daily backups.",n:["Technology stack","Backup"]},
  {t:["tech","technology","stack","language","framework","built with"],a:()=>"Stack: <b>PHP/Python/.NET</b> with <b>MS SQL 2022/MySQL</b>, on <b>Ubuntu LTS or Windows Server 2025</b> (VM). No external licensed dependencies — libraries provided in-house.",n:["Deployment","Database"]},
  {t:["deploy","adn","hosting","host","data center","data centre","port","bandwidth"],a:()=>"Deployed on the <b>Army Data Network</b>, hosted at the Central Data Centre, minimal open ports (Army-vetted), federated, within common-user bandwidth, complying with ADN routing.",n:["Is it offline?","Security features"]},
  {t:["support","amc","maintenance","warranty","direct support"],a:()=>"Support: <b>1 year Direct Support</b> (6-hour response, minor changes free) then a <b>5-year AMC</b> covering fixes, patches and upgrades — 6 years total.",n:["Training","Technology stack"]},
  {t:["training","train"],a:()=>"On go-live, in-depth <b>training for 20–25 personnel</b> is provided at ADG HR premises, Delhi.",n:["Support & AMC"]},
  {t:["ipr","intellectual property","ownership","who owns"],a:()=>"The <b>IPR</b> of the developed application rests entirely with the buyer (ADG HR); nothing is shared outside.",n:["About CUT-HRV 2.0"]},
  {t:["chatbot","ai","etai","assistant","llm","model"],a:()=>"This assistant is an <b>on-premise, ETAI-compliant (DRDO/SAG) AI</b> running fully offline on the ADN with no internet — answering from the application's policies, functions and live data. In production it is served by a self-hosted open-weights model.",n:["Is it offline?","Security features"]},
  {t:["offline","internet","air gap","air-gap","no internet","connectivity"],a:()=>"Yes — the entire application, <b>including this AI assistant, runs fully offline</b> on the Army Data Network with no internet, per the RFP's air-gapped requirement.",n:["Security features","Technology stack"]}
];
let lastNext=null;
function botAnswer(q){
  const low=normalize(q);lastNext=null;
  const idm=q.match(BOT.idRe);
  if(idm){const raw=idm[0].toUpperCase().replace(/\s+/g,"/").replace(/\/+/g,"/");let x=DB.cases().find(c=>c.id.toUpperCase()===raw);
    if(!x){const num=(idm[0].match(/(\d{1,4})\s*$/)||[])[1];if(num)x=DB.cases().find(c=>c.id.endsWith(String(parseInt(num)).padStart(4,"0")));}
    return x?caseSummary(x):"I couldn't find that case number — please check and try again.";}
  const nm=low.match(/\b(?:case|complaint)\s*(?:no\.?|number|#)?\s*(\d{1,4})\b/);
  if(nm){const y=DB.cases().find(c=>c.id.endsWith(String(parseInt(nm[1])).padStart(4,"0")));if(y)return caseSummary(y);}
  if(/\b(how many|count|number of|total number|how much)\b/.test(low))return countAnswer(low);
  if(/\b(list|show me|which|display|show all)\b/.test(low)){const r=listAnswer(low);if(r)return r;}
  let best=null,bs=0;KB.forEach(e=>{const s=scoreEntry(e,low);if(s>bs){bs=s;best=e;}});
  if(best&&bs>0){lastNext=best.n||DEFAULT_SUG;return typeof best.a==="function"?best.a():best.a;}
  lastNext=DEFAULT_SUG;
  return "I can help with <b>HRV policy</b>, registering/editing complaints, the <b>investigation &amp; adjudication</b> workflow, <b>roles &amp; access</b>, <b>security</b> (SAML/2FA/AES-256), reports, analytics, migration and support — plus live data (counts &amp; complaint look-ups). What would you like to know?";
}

/* ==========================================================
   UI ENHANCEMENT HELPERS (icons, prefs, charts, tables, forms)
   ========================================================== */
const ICONS={
 /* shared chrome, Iconsax */
 lock:'<path d="M6 10V8c0-3.31 1-6 6-6s6 2.69 6 6v2M17 22H7c-4 0-5-1-5-5v-2c0-4 1-5 5-5h10c4 0 5 1 5 5v2c0 4-1 5-5 5Z"/><path d="M15.996 16h.01M11.995 16h.01M7.995 16h.008"/>',
 /* shared chrome, Iconsax */
 tick:'<path d="M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10Z"/><path d="m7.75 12 2.83 2.83 5.67-5.66"/>',
 /* shared chrome, Iconsax */
 save:'<path d="M12.89 5.88H5.11A3.12 3.12 0 0 0 2 8.99v11.36c0 1.45 1.04 2.07 2.31 1.36l3.93-2.19c.42-.23 1.1-.23 1.51 0l3.93 2.19c1.27.71 2.31.09 2.31-1.36V8.99a3.105 3.105 0 0 0-3.1-3.11Z"/><path d="M16 8.99v11.36c0 1.45-1.04 2.06-2.31 1.36l-3.93-2.19c-.42-.23-1.1-.23-1.52 0l-3.93 2.19c-1.27.7-2.31.09-2.31-1.36V8.99c0-1.71 1.4-3.11 3.11-3.11h7.78c1.71 0 3.11 1.4 3.11 3.11Z"/><path d="M22 5.11v11.36c0 1.45-1.04 2.06-2.31 1.36L16 15.77V8.99c0-1.71-1.4-3.11-3.11-3.11H8v-.77C8 3.4 9.4 2 11.11 2h7.78C20.6 2 22 3.4 22 5.11Z"/>',
 /* shared chrome, Iconsax */
 refresh:'<path d="M22 12c0 5.52-4.48 10-10 10s-8.89-5.56-8.89-5.56m0 0h4.52m-4.52 0v5M2 12C2 6.48 6.44 2 12 2c6.67 0 10 5.56 10 5.56m0 0v-5m0 5h-4.44"/>',
 dashboard:'<path d="M3 11l9-8 9 8"/><path d="M5 10v10h4v-6h6v6h4V10"/>',
 new:'<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z"/>',
 mycases:'<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
 allcases:'<path d="M4 7c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3z"/><path d="M4 7v10c0 1.7 3.6 3 8 3s8-1.3 8-3V7"/><path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
 transfers:'<path d="M4 8h13"/><path d="M13 4l4 4-4 4"/><path d="M20 16H7"/><path d="M11 20l-4-4 4-4"/>',
 reports:'<path d="M4 20V10"/><path d="M10 20V4"/><path d="M16 20v-7"/><path d="M3 20h18"/>',
 analytics:'<path d="M3 17l6-6 4 4 8-8"/><path d="M21 7v6h-6"/>',
 cms:'<path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/><path d="M9 4v4"/><path d="M15 10v4"/><path d="M7 16v4"/>',
 audit:'<path d="M9 4h6v2H9z"/><path d="M8 6H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-2"/><path d="M9 12h6"/><path d="M9 16h6"/>',
 sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.4 1.4M17.6 17.6L19 19M19 5l-1.4 1.4M6.4 17.6L5 19"/>',
 moon:'<path d="M21 12.8A8.5 8.5 0 1 1 11.2 3 6.6 6.6 0 0 0 21 12.8z"/>',
 rows:'<path d="M4 6h16M4 12h16M4 18h16"/>',
 empty:'<path d="M4 7h16M4 12h16M4 17h10"/>'
};

/* preferences: dark mode + density */
/* colour themes — live palette swap on :root */
const PAL_KEYS=['--g900','--g800','--g700','--g600','--g500','--gold','--gold-l','--gold-d','--gold-soft','--ink','--muted','--faint','--line','--line-2','--bg','--paper','--cream','--danger','--ok','--warn','--info'];
const DEFAULT_PAL="Justice Teal";
const PAL_SWATCH={"Justice Teal":"#124C56","Navy Blue":"#1b3168","Neutral Grey":"#333840"};
const PALETTES={
  "Justice Teal":null,
  "Navy Blue":{'--g900':'#0b1836','--g800':'#122250','--g700':'#1b3168','--g600':'#254291','--g500':'#3557b0','--gold':'#C8A64B','--gold-l':'#E6CF88','--gold-d':'#9C7C2E','--gold-soft':'#f3ead0','--ink':'#141b2e','--muted':'#5f6980','--faint':'#8b93a6','--line':'#e2e4ea','--line-2':'#eef0f5','--bg':'#eceef4','--paper':'#ffffff','--cream':'#f6f7fb','--danger':'#b23b3b','--ok':'#2c6e39','--warn':'#b3781a','--info':'#2a5c9c'},
  "Neutral Grey":{'--g900':'#1a1c1f','--g800':'#26292e','--g700':'#333840','--g600':'#454b54','--g500':'#5b626c','--gold':'#B08D57','--gold-l':'#D8BC8A','--gold-d':'#87683a','--gold-soft':'#efe7d8','--ink':'#20232a','--muted':'#6c727b','--faint':'#9aa0a8','--line':'#e5e6e9','--line-2':'#eef0f2','--bg':'#eef0f2','--paper':'#ffffff','--cream':'#f7f6f3','--danger':'#a83232','--ok':'#2c6e39','--warn':'#b3781a','--info':'#3a5a8c'}
};

/* count-up */

/* time series + charts */
const MON=["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

/* styled chart tooltips (event-delegated over [data-tip]) */
let TIP;function ensureTip(){if(!TIP){TIP=document.createElement('div');TIP.id='chartTip';document.body.appendChild(TIP);}return TIP;}
document.addEventListener('mouseover',e=>{const t=e.target.closest&&e.target.closest('[data-tip]');if(t){const tip=ensureTip();tip.innerHTML=t.getAttribute('data-tip');tip.classList.add('on');}});
document.addEventListener('mousemove',e=>{if(TIP&&TIP.classList.contains('on')){let x=e.clientX+14,y=e.clientY-12;if(x>innerWidth-180)x=e.clientX-x+innerWidth-180;TIP.style.left=x+'px';TIP.style.top=y+'px';}});
document.addEventListener('mouseout',e=>{const t=e.target.closest&&e.target.closest('[data-tip]');if(t&&TIP)TIP.classList.remove('on');});

/* searchable select */
const SSEL_OPTS={state:typeof STATES!=='undefined'?STATES:[],district:typeof DISTRICTS!=='undefined'?DISTRICTS:[],area:typeof AREAS!=='undefined'?AREAS:[]};

/* inline validation + form progress rail + autosave */

/* empty state */

/* pagination + sorting + selection (shared) */
let sortKey="id",sortDir=1,page=1,perPage=10,selected=new Set();

/* skeleton */

/* session idle timeout */
let idleTimer;
["click","keydown","mousemove","scroll"].forEach(ev=>document.addEventListener(ev,()=>{const av=document.getElementById("appView");if(av&&!av.classList.contains("hidden"))resetIdle();},{passive:true}));

/* ==========================================================
   BOOT
   ========================================================== */
seed();
applyPrefs();
