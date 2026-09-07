/* ==========================================================
   APP EMBLEM (SVG): neutral monogram badge, drawn, no assets.
   Deliberately uses no national symbol / insignia.
   ========================================================== */
function emblemMark(){
  const ink=cssv("--emblem-ink");
  return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="40" fill="none" stroke="${ink}" stroke-width="3"/>
    <text x="50" y="53" text-anchor="middle" dominant-baseline="middle" font-family="Georgia,'Times New Roman',serif" font-weight="700" font-size="40" fill="${ink}">M</text>
    <rect x="34" y="70" width="32" height="3" rx="1.5" fill="${ink}"/></svg>`;
}
document.querySelectorAll("[data-emblem]").forEach(el=>el.innerHTML=emblemMark());

/* ==========================================================
   DATA LAYER  (localStorage-backed, seeded)
   ========================================================== */
/* Current official list: 28 States + 8 Union Territories (post 2019-20 reorganisation) */
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
/* Representative current districts per State/UT (keeps state-district pairing consistent) */
const STATE_DISTRICTS={
  "Andhra Pradesh":["Visakhapatnam","Guntur"],"Arunachal Pradesh":["Tawang","Papum Pare"],"Assam":["Kamrup Metro","Sonitpur"],
  "Bihar":["Patna","Gaya"],"Chhattisgarh":["Raipur","Bastar"],"Goa":["North Goa"],"Gujarat":["Ahmedabad","Kutch"],
  "Haryana":["Gurugram","Ambala"],"Himachal Pradesh":["Shimla","Kangra"],"Jharkhand":["Ranchi","Bokaro"],
  "Karnataka":["Bengaluru Urban","Belagavi"],"Kerala":["Thiruvananthapuram","Ernakulam"],"Madhya Pradesh":["Bhopal","Gwalior"],
  "Maharashtra":["Pune","Nagpur"],"Manipur":["Imphal East","Churachandpur"],"Meghalaya":["East Khasi Hills"],
  "Mizoram":["Aizawl"],"Nagaland":["Kohima","Dimapur"],"Odisha":["Khordha","Cuttack"],"Punjab":["Amritsar","Ludhiana"],
  "Rajasthan":["Jaipur","Barmer","Jaisalmer"],"Sikkim":["Gangtok"],"Tamil Nadu":["Chennai","Coimbatore"],
  "Telangana":["Hyderabad","Medchal-Malkajgiri"],"Tripura":["West Tripura"],"Uttar Pradesh":["Lucknow","Prayagraj","Meerut"],
  "Uttarakhand":["Dehradun","Nainital"],"West Bengal":["Kolkata","Darjeeling"],"Andaman & Nicobar Islands":["South Andaman"],
  "Chandigarh":["Chandigarh"],"Dadra & Nagar Haveli and Daman & Diu":["Daman"],"Delhi":["New Delhi"],
  "Jammu & Kashmir":["Srinagar","Baramulla","Anantnag"],"Ladakh":["Leh","Kargil"],"Lakshadweep":["Kavaratti"],"Puducherry":["Puducherry"]
};
const DISTRICTS=[...new Set(Object.values(STATE_DISTRICTS).flat())].sort();
function distOf(state,i){const d=STATE_DISTRICTS[state]||["-"];return d[i%d.length];}
const STATUS=["Open","Under Review","Approved","Rejected","Transferred"];
const RANKS=["Sep","Nk","Hav","Sub","Nb Sub","Lt","Capt","Maj"];
const SEED_V="2";
const DRAFT_KEY="maark_draft";

function seed(force){
  if(!force && localStorage.getItem("maark_cases") && localStorage.getItem("maark_seed_v")===SEED_V) return;
  const names=["Ramesh Kumar","Suresh Singh","Vijay Sharma","Anil Yadav","Manoj Verma","Rakesh Gupta","Deepak Rawat","Sunil Negi","Pradeep Rana","Ashok Bisht","Naresh Tomar","Dinesh Chauhan","Karan Mehta","Rohit Dubey","Sandeep Nair","Amit Joshi","Vikram Patil","Harish Reddy","Gopal Das","Mahesh Iyer"];
  const cases=[]; let n=1;
  for(let i=0;i<24;i++){
    const st=STATES[i%STATES.length];
    const dt=distOf(st,i);
    const stat=STATUS[i%STATUS.length];
    const amt=[8000,10000,12000,15000,20000][i%5];
    cases.push({
      id:"MAARK/2026/"+String(n++).padStart(4,"0"),
      name:names[i%names.length], rank:RANKS[i%RANKS.length],
      unit:(10+i)+" "+["Rajput","Sikh","Gorkha","Jat","Kumaon","Bihar"][i%6]+" Regt",
      relation:["Widow","Mother","Father","Son"][i%4],
      state:st, district:dt, group:groupOf(st),
      amount:amt, status:stat,
      address:"H.No "+(i+11)+", Sector "+((i%9)+1)+", "+dt,
      complaint:"Delay in disbursement of maintenance allowance for "+["Q1","Q2","Q3","Q4"][i%4]+" FY 2026.",
      family:(2+(i%4))+" dependents",
      created:"2026-0"+((i%6)+1)+"-"+String((i%27)+1).padStart(2,"0"),
      transfer:stat==="Transferred"?{dir:"Out",to:"ADG HR Cell (East)"}:null
    });
  }
  localStorage.setItem("maark_cases",JSON.stringify(cases));
  localStorage.setItem("maark_audit",JSON.stringify([]));
  localStorage.setItem("maark_seq","25");
  localStorage.setItem("maark_seed_v",SEED_V);
  localStorage.setItem("maark_settings",JSON.stringify({title:"MAARK 2.0",banner:"Serving those who serve the nation",theme:"Army Green",backup:"Daily 02:00 IST"}));
}
const DB={
  cases:()=>JSON.parse(localStorage.getItem("maark_cases")||"[]"),
  save:(c)=>localStorage.setItem("maark_cases",JSON.stringify(c)),
  audit:()=>JSON.parse(localStorage.getItem("maark_audit")||"[]"),
  settings:()=>JSON.parse(localStorage.getItem("maark_settings")||"{}"),
  saveSettings:(s)=>localStorage.setItem("maark_settings",JSON.stringify(s)),
  nextId:()=>{let s=parseInt(localStorage.getItem("maark_seq")||"1");localStorage.setItem("maark_seq",s+1);return "MAARK/2026/"+String(s).padStart(4,"0");}
};
function log(action,detail){
  const a=DB.audit();
  a.unshift({ts:new Date().toLocaleString('en-IN'),user:SESSION.name,role:SESSION.role,action,detail,ip:SESSION.ip});
  localStorage.setItem("maark_audit",JSON.stringify(a.slice(0,200)));
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
  User:[["dashboard","Dashboard"],["new","New Case (Data Entry)"],["mycases","Update Regd Cases"],["reports","Reports"],["analytics","Analytics"]],
  Admin:[["dashboard","Dashboard"],["new","New Case"],["allcases","Total Cases"],["transfers","Transferred Cases"],["reports","Reports"],["analytics","Analytics"]],
  "Super Admin":[["dashboard","Dashboard"],["allcases","Total Cases"],["transfers","Transferred Cases"],["reports","Reports"],["analytics","Analytics"],["cms","Content Mgt System"],["audit","Audit Log"]]
};
function buildNav(){
  const nav=document.getElementById("sideNav");
  nav.innerHTML='<div class="grp">Main Menu</div>';
  NAV[SESSION.role].forEach(([k,label])=>{
    const a=document.createElement("a");a.dataset.k=k;
    a.innerHTML=icon(k)+' '+label;
    a.onclick=()=>go(k);nav.appendChild(a);
  });
  const f=document.createElement("div");f.className="side-foot";
  f.innerHTML="MAARK v2.0 &middot; ADG HR<br>IHQ of MoD (Army)<br>&copy; 2026 &middot; Restricted";
  nav.appendChild(f);
}
let CURRENT="dashboard";
function go(k){
  CURRENT=k;
  document.querySelectorAll("#sideNav a").forEach(a=>a.classList.toggle("active",a.dataset.k===k));
  const m=document.getElementById("mainArea");m.scrollTop=0;
  m.classList.remove("fade");void m.offsetWidth;m.classList.add("fade");
  const fn=({dashboard:vDashboard,new:vNewCase,mycases:vCases,allcases:vCases,transfers:vTransfers,reports:vReports,analytics:vAnalytics,cms:vCMS,audit:vAudit}[k]||vDashboard);
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
  const open=cnt("Open"), rev=cnt("Under Review"), appr=cnt("Approved");
  const total=c.reduce((s,x)=>s+x.amount,0);
  const fn=SESSION.name.split("(")[0].trim();
  dashStatus="All"; dashView="count";
  const SEGS=["All","Open","Under Review","Approved","Rejected","Transferred"];
  m.innerHTML=`<div class="hero">
    <div class="cw" data-emblem></div>
    <div class="emblem" data-emblem></div>
    <div>
      <div class="crumb" style="color:rgba(255,255,255,.6)">Additional Directorate General of Human Rights</div>
      <h2>Welcome, ${fn}</h2>
      <p>Command dashboard for maintenance-allowance case management across the Indian Army. All records are encrypted, role-controlled and fully audit-logged on the Army Data Network.</p>
      <div class="chips"><span>${svgIco("pending",13)} ${open+rev} Pending Action</span><span>${svgIco("approved",13)} ${appr} Approved</span><span>${svgIco("money",13)} ₹${total.toLocaleString('en-IN')} Sanctioned</span></div>
    </div>
  </div>`;
  const mAll=monthlyVals(c),mOpen=monthlyVals(c.filter(x=>x.status==="Open")),mAppr=monthlyVals(c.filter(x=>x.status==="Approved"));
  const amtB={};c.forEach(x=>{const mo=(x.created||'').slice(0,7);if(mo)amtB[mo]=(amtB[mo]||0)+(x.amount||0);});const mAmt=Object.keys(amtB).sort().map(k=>amtB[k]);
  m.innerHTML+=`
  <div class="grid kpis" style="margin-bottom:18px">
    ${kpiC("Total Cases",c.length,cssv('--g700'),svgIco("cases",18),"var(--line-2)","view all cases","jumpToQf('all')",mAll)}
    ${kpiC("Pending Action",open+rev,cssv('--warn'),svgIco("pending",18),"#fbf1dd",open+" open &middot; "+rev+" in review","jumpToQf('pending')",mOpen)}
    ${kpiC("Approved",appr,cssv('--ok'),svgIco("approved",18),"#e6f3e7","disbursement ready","jumpToQf('approved')",mAppr)}
    ${kpiC("Sanctioned (₹)",total,cssv('--gold-d'),svgIco("money",18),"var(--gold-soft)","view reports","go('reports')",mAmt,true)}
  </div>
  <div class="card chartcard" style="margin-bottom:18px"><h3><span class="bar"></span> New Cases: Monthly Trend</h3>${lineChart(monthly(c),{color:cssv('--g600')})}</div>
  <div class="row2">
    <div class="card panel">
      <h3><span class="bar"></span> Recent Cases <span id="dashCap" class="muted" style="font-weight:400;font-size:12px;margin-left:auto"></span></h3>
      <div class="segbar" id="segbar">
        ${SEGS.map(s=>`<button class="seg${s===dashStatus?' on':''}" data-s="${s}" onclick="dashSetStatus('${s}')">${s} <b>${cnt(s)}</b></button>`).join("")}
      </div>
      <table class="tbl"><thead><tr><th>Case ID</th><th>Beneficiary</th><th>State</th><th>Status</th></tr></thead><tbody id="recentRows"></tbody></table>
      <div id="dashEmpty" class="muted" style="text-align:center;padding:18px;display:none">No cases in this category.</div>
    </div>
    <div class="card chartcard">
      <h3><span class="bar"></span> Case Status Distribution</h3>
      <p class="muted" style="font-size:11.5px;margin:-8px 0 12px">${svgIco("hint",13)} Click a segment (or legend) to filter the list</p>
      ${donutDash([["Open",open,"#c77800"],["Under Review",rev,"#1565a8"],["Approved",appr,"#2c6e39"],["Rejected",cnt("Rejected"),"#a83232"],["Transferred",cnt("Transferred"),"#6b45b0"]])}
    </div>
  </div>
  <div class="card panel" style="margin-top:18px">
    <h3><span class="bar"></span> Workflow &amp; e-Office Automation Pipeline
      <span class="toggle" style="margin-left:auto">
        <button class="tg on" id="tgCount" onclick="dashSetView('count')">By Count</button>
        <button class="tg" id="tgValue" onclick="dashSetView('value')">By &#8377; Value</button>
      </span>
    </h3>
    <div class="grid" id="wfGrid" style="grid-template-columns:repeat(auto-fit,minmax(180px,1fr))"></div>
  </div>`;
  document.querySelectorAll("#mainArea [data-emblem]").forEach(el=>el.innerHTML=emblemMark());
  dashRenderRows(); dashRenderWF(); runCounts(m);
}
function kpiC(l,v,c,ico,icbg,tr,click,spark,money){return `<div class="card kpi clickable" onclick="${click}"><div class="strip" style="background:${c}"></div><div class="top"><div class="lbl">${l}</div><div class="ico" style="background:${icbg};color:${c}">${ico}</div></div><div class="val">${kpiValHtml(v,money)}</div><div class="tr" style="color:var(--info)">${tr} &rarr;</div>${spark?sparkSVG(spark,c):''}</div>`;}
function dashRenderRows(){
  const rows=document.getElementById("recentRows"); if(!rows) return;
  let c=DB.cases(); if(dashStatus!=="All") c=c.filter(x=>x.status===dashStatus);
  const cap=document.getElementById("dashCap"); if(cap) cap.textContent=dashStatus==="All"?c.length+" total":c.length+" &middot; "+dashStatus;
  document.getElementById("dashEmpty").style.display=c.length?"none":"block";
  rows.innerHTML=c.slice(0,8).map(x=>`<tr style="cursor:pointer" title="Open case" onclick="viewCase('${x.id}')"><td><b>${x.id}</b></td><td>${x.name}<div class="muted" style="font-size:11px">${x.rank} &middot; ${x.relation}</div></td><td>${x.state}</td><td>${statusTag(x.status)}</td></tr>`).join("");
}
function dashRenderWF(){
  const c=DB.cases(); const g=document.getElementById("wfGrid"); if(!g) return;
  const stages=[["1 &middot; Data Entry","Open","var(--warn)"],["2 &middot; Verification","Under Review","var(--info)"],["3 &middot; Approval","Approved","var(--ok)"],["4 &middot; Disbursement","__disb","var(--g700)"]];
  g.innerHTML=stages.map(([l,st,col])=>{
    let list,n,disp;
    if(st==="__disb"){list=c.filter(x=>x.status==="Approved");n=Math.floor(list.length*0.6);
      disp=dashView==="value"?"₹"+Math.floor(list.reduce((s,x)=>s+x.amount,0)*0.6/1000)+"k":n;}
    else{list=c.filter(x=>x.status===st);n=list.length;
      disp=dashView==="value"?"₹"+(list.reduce((s,x)=>s+x.amount,0)/1000)+"k":n;}
    return `<div class="wfcard"><div class="muted" style="font-size:12px;font-weight:600">${l}</div><div style="font-size:26px;font-weight:800;color:${col};font-family:var(--serif)">${disp}</div><div class="mini-bar" style="margin-top:8px"><i style="width:${Math.min(100,n*8)}%"></i></div></div>`;
  }).join("");
}
function statusTag(s){const m={"Open":"t-open","Under Review":"t-review","Approved":"t-appr","Rejected":"t-rej","Transferred":"t-trans"};return '<span class="tag '+m[s]+'">'+s+'</span>';}

/* ---- New Case: single consolidated page ---- */
let wizData={};
function vNewCase(m){
  const draft=JSON.parse(localStorage.getItem(DRAFT_KEY)||"null");
  const hasDraft=draft&&Object.keys(draft).filter(k=>draft[k]&&k!=="id").length>0;
  wizData=hasDraft?draft:{id:DB.nextId()};
  m.innerHTML=head("New Case: Data Entry","Auto Case No: <b>"+wizData.id+"</b> &middot; complete all sections below, then submit","New Case");
  m.innerHTML+=(hasDraft?'<div class="card" style="padding:11px 15px;margin-bottom:14px;border-left:4px solid var(--gold);background:var(--cream);font-size:12.5px;display:flex;align-items:center;gap:10px"><span>${svgIco("save",14)} Draft restored from your last unsaved entry.</span><button class="btn sm ghost" style="margin-left:auto" onclick="discardDraft()">Discard draft</button></div>':'')+
   '<div class="card panel"><div class="formlayout"><div class="formrail" id="formRail"></div><div><div id="formSecs"></div>'+
    '<div class="form-actions"><span class="muted" style="margin-right:auto;font-size:12px">Fields marked <span class="req" style="color:var(--danger)">*</span> are mandatory &middot; entries auto-save</span>'+
    '<button class="btn ghost" onclick="go(SESSION.role===\'User\'?\'mycases\':\'allcases\')">Cancel</button>'+
    '<button class="btn primary" onclick="submitSingle()">'+svgIco('tick',14)+' Submit Case</button></div></div></div></div>';
  renderForm();
}
const WIZ=[
  {t:"Auto Case No",f:[["id","Case Number","text",true,true]]},
  {t:"Personnel Details",f:[["name","Beneficiary Name","text",true],["rank","Rank of Soldier","select",true,false,RANKS],["unit","Unit / Regiment","text",true],["relation","Relation to Soldier","select",true,false,["Widow","Mother","Father","Son","Daughter","Wife"]]]},
  {t:"Address",f:[["state","State","select",true,false,STATES],["district","District","select",true,false,DISTRICTS],["address","Full Address","textarea",true]]},
  {t:"Family Details",f:[["family","Dependents","text",true],["amount","Allowance Claimed (₹)","number",true]]},
  {t:"Complaint Details",f:[["complaint","Complaint / Remarks","textarea",true]]}
];
function submitCase(){
  const c=DB.cases();
  wizData.status="Open";wizData.group=groupOf(wizData.state);
  wizData.created=new Date().toISOString().slice(0,10);wizData.amount=parseInt(wizData.amount)||0;
  c.unshift(wizData);DB.save(c);
  log("CREATE_CASE","Created "+wizData.id+" ("+wizData.name+")");
  toast("Case "+wizData.id+" created &amp; encrypted (AES-256)");
  go("mycases");
}

/* ---- Cases list ---- */
let filterQ="",filterS="",filterG="";
const QF=[["all","All",()=>true],["pending","Pending action",x=>x.status==="Open"||x.status==="Under Review"],["approved","Approved",x=>x.status==="Approved"],["transferred","Transferred",x=>!!x.transfer],["high","High allowance ≥ ₹15k",x=>x.amount>=15000]];
let qfKey="all";
function vCases(m){
  const isAll=CURRENT==="allcases";page=1;selected=new Set();
  m.innerHTML=head(isAll?"Total Cases":"Update Registered Cases",isAll?"All cases across the directorate":"Cases you can view and update",isAll?"Total Cases":"My Cases");
  m.innerHTML+=`<div class="card panel">
    <div class="qfbar">${QF.map(q=>{const qn=DB.cases().filter(q[2]).length;return `<button class="qf${q[0]===qfKey?' on':''}" onclick="setQf('${q[0]}')">${q[1]} <b>${qn}</b></button>`;}).join("")}</div>
    <div class="toolbar">
      <div class="search"><input id="q" value="${filterQ}" placeholder="Search case ID, name, state..." oninput="filterQ=this.value;page=1;drawRows()"></div>
      <select id="fs" onchange="filterS=this.value;page=1;drawRows()" style="padding:10px;border:1px solid var(--line);border-radius:9px;background:#fff">
        <option value="">All Status</option>${STATUS.map(s=>'<option'+(s===filterS?' selected':'')+'>'+s+'</option>').join("")}</select>
      ${(filterG||filterS||filterQ||qfKey!=='all')?'<button class="btn sm" onclick="clearFilters()">${svgIco("close",13)} Clear</button>':''}
      <button class="btn primary sm" onclick="go('new')">+ New Case</button>
    </div>
    ${filterG?'<div class="muted" style="margin:-6px 0 12px;font-size:12px">Showing cases under command: <b>'+filterG+'</b></div>':''}
    <div class="bulkbar" id="bulkbar"></div>
    <div class="tblwrap"><table class="tbl"><thead><tr>
      <th style="width:36px"><input type="checkbox" class="chk" id="chkAll" onclick="toggleAll(this)"></th>
      ${th("id","Case ID")}${th("name","Beneficiary")}${th("state","State / District")}${th("amount","Allowance")}${th("status","Status")}<th>Actions</th>
    </tr></thead><tbody id="rows"></tbody></table></div>
    <div id="empty" style="display:none"></div>
    <div class="pager" id="pager"></div>
  </div>`;
  drawRows();
}
function getFiltered(){
  let c=DB.cases();const qf=QF.find(q=>q[0]===qfKey);if(qf)c=c.filter(qf[2]);
  if(filterQ){const q=filterQ.toLowerCase();c=c.filter(x=>(x.id+x.name+x.state+x.district).toLowerCase().includes(q));}
  if(filterS)c=c.filter(x=>x.status===filterS);
  if(filterG)c=c.filter(x=>x.group===filterG);
  c.sort((a,b)=>{let va=a[sortKey],vb=b[sortKey];if(va==null)va="";if(vb==null)vb="";if(typeof va==="string"){va=va.toLowerCase();vb=(""+vb).toLowerCase();}return(va>vb?1:va<vb?-1:0)*sortDir;});
  return c;
}
function drawRows(){
  const rows=document.getElementById("rows");if(!rows)return;
  const all=getFiltered();const tot=all.length;const pages=Math.max(1,Math.ceil(tot/perPage));if(page>pages)page=pages;
  const emptyEl=document.getElementById("empty");
  if(!tot){rows.innerHTML="";emptyEl.style.display="block";emptyEl.innerHTML=emptyState("No matching cases","Try adjusting your search or filters, or register a new case.","clearFilters()","Clear filters");document.getElementById("pager").innerHTML="";updateBulk();return;}
  emptyEl.style.display="none";
  const canApprove=SESSION.role!=="User";
  rows.innerHTML=all.slice((page-1)*perPage,page*perPage).map(x=>`<tr>
    <td><input type="checkbox" class="chk" ${selected.has(x.id)?'checked':''} onclick="toggleSel('${x.id}',this)"></td>
    <td><b>${x.id}</b><div class="muted" style="font-size:11px">${x.created}</div></td>
    <td>${x.name}<div class="muted" style="font-size:11px">${x.rank} &middot; ${x.relation}</div></td>
    <td>${x.state}<div class="muted" style="font-size:11px">${x.district}</div></td>
    <td><b>₹${x.amount.toLocaleString('en-IN')}</b></td>
    <td>${statusTag(x.status)}</td>
    <td>
      <span class="act" onclick="viewCase('${x.id}')">View</span>
      <span class="act" onclick="editCase('${x.id}')">Edit</span>
      ${canApprove&&x.status!=="Approved"?'<span class="act a" onclick="approveCase(\''+x.id+'\')">Approve</span>':''}
      ${canApprove?'<span class="act t" onclick="transferCase(\''+x.id+'\')">Transfer</span>':''}
      <span class="act d" onclick="delCase('${x.id}')">Delete</span>
    </td></tr>`).join("");
  drawPager(pages,tot);syncChkAll();updateBulk();
}
function updateBulk(){const b=document.getElementById('bulkbar');if(!b)return;
  if(selected.size){b.classList.add('on');b.innerHTML=`<b>${selected.size} selected</b>
    <button class="btn sm" onclick="bulkExport()">${svgIco("download",13)} Export CSV</button>
    ${SESSION.role!=='User'?'<button class="btn sm" onclick="bulkApprove()">${svgIco("tick",13)} Approve</button>':''}
    <button class="btn sm ghost" style="margin-left:auto;color:#fff;border-color:rgba(255,255,255,.45)" onclick="clearSel()">Clear</button>`;}
  else{b.classList.remove('on');b.innerHTML="";}}
function bulkApprove(){const n=selected.size;const c=DB.cases();c.forEach(x=>{if(selected.has(x.id))x.status="Approved";});DB.save(c);log("BULK_APPROVE",n+" cases approved");toast(n+" cases approved");selected=new Set();drawRows();}
function bulkExport(){exportRows(DB.cases().filter(x=>selected.has(x.id)));toast("Exported "+selected.size+" selected cases");}
function exportRows(c){const csv=["Case ID,Name,Rank,State,District,Amount,Status"].concat(c.map(x=>[x.id,x.name,x.rank,x.state,x.district,x.amount,x.status].join(","))).join("\n");
  const blob=new Blob([csv],{type:"text/csv"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="MAARK_cases.csv";a.click();}
function viewCase(id){
  const x=findCase(id);log("VIEW_CASE","Viewed "+id);
  modal("Case "+x.id,`
    <div class="formgrid">
      ${kv("Beneficiary",x.name)}${kv("Rank",x.rank)}
      ${kv("Unit",x.unit)}${kv("Relation",x.relation)}
      ${kv("State",x.state)}${kv("District",x.district)}
      ${kv("Group",x.group)}${kv("Allowance","₹"+x.amount.toLocaleString('en-IN'))}
      ${kv("Status",x.status)}${kv("Created",x.created)}
      <div class="field full">${kv("Address",x.address)}</div>
      <div class="field full">${kv("Family",x.family)}</div>
      <div class="field full">${kv("Complaint",x.complaint)}</div>
    </div>
    <div class="demo-note" style="margin-top:16px">${svgIco("lock",13)} Record stored encrypted (AES-256). Access logged: ${SESSION.name} @ ${SESSION.ip}</div>`,
    [{t:"Close",c:"ghost",fn:closeModal},{t:"Edit",c:"primary",fn:()=>{closeModal();editCase(id);}}]);
}
function editCase(id){
  const x=findCase(id);
  modal("Edit "+x.id,`<div class="formgrid">
    <div class="field"><label>Beneficiary</label><input id="e_name" value="${x.name}"></div>
    <div class="field"><label>Allowance (₹)</label><input id="e_amount" type="number" value="${x.amount}"></div>
    <div class="field"><label>Status</label><select id="e_status">${STATUS.map(s=>'<option '+(s===x.status?'selected':'')+'>'+s+'</option>').join("")}</select></div>
    <div class="field"><label>District</label><input id="e_district" value="${x.district}"></div>
    <div class="field full"><label>Complaint / Remarks</label><textarea id="e_complaint" rows="3">${x.complaint}</textarea></div>
  </div>`,[{t:"Cancel",c:"ghost",fn:closeModal},{t:"Save Changes",c:"primary",fn:()=>{
    const c=DB.cases();const t=c.find(y=>y.id===id);
    t.name=val("e_name");t.amount=parseInt(val("e_amount"))||0;t.status=val("e_status");t.district=val("e_district");t.complaint=val("e_complaint");
    DB.save(c);log("EDIT_CASE","Modified "+id);closeModal();toast("Case "+id+" updated");drawRows();
  }}]);
}
function approveCase(id){const c=DB.cases();c.find(x=>x.id===id).status="Approved";DB.save(c);log("APPROVE_CASE","Approved "+id);toast("Case "+id+" approved");drawRows();}
function delCase(id){modal("Confirm Deletion","<p>Delete case <b>"+id+"</b>? This action is audit-logged and irreversible.</p>",
  [{t:"Cancel",c:"ghost",fn:closeModal},{t:"Delete",c:"danger",fn:()=>{DB.save(DB.cases().filter(x=>x.id!==id));log("DELETE_CASE","Deleted "+id);closeModal();toast("Case "+id+" deleted");drawRows();}}]);}
function transferCase(id){
  modal("Transfer Case "+id,`<div class="field"><label>Direction</label><select id="tr_dir"><option>Out</option><option>In</option></select></div>
    <div class="field" style="margin-top:12px"><label>To / From Cell</label><input id="tr_to" value="ADG HR Cell (East)"></div>`,
  [{t:"Cancel",c:"ghost",fn:closeModal},{t:"Confirm Transfer",c:"primary",fn:()=>{
    const c=DB.cases();const t=c.find(x=>x.id===id);t.status="Transferred";t.transfer={dir:val("tr_dir"),to:val("tr_to")};
    DB.save(c);log("TRANSFER_CASE","Transferred "+id+" "+val("tr_dir")+" to "+val("tr_to"));closeModal();toast("Case "+id+" transferred");drawRows();
  }}]);
}

/* ---- Transfers ---- */
function vTransfers(m){
  const c=DB.cases().filter(x=>x.transfer);
  m.innerHTML=head("Transferred Cases","Transfer In / Transfer Out register","Transferred Cases");
  m.innerHTML+='<div class="card panel"><table class="tbl"><thead><tr><th>Case ID</th><th>Beneficiary</th><th>Direction</th><th>Counterparty</th><th>State</th></tr></thead><tbody>'+
    (c.length?c.map(x=>`<tr><td><b>${x.id}</b></td><td>${x.name}</td><td><span class="tag ${x.transfer.dir==='Out'?'t-trans':'t-review'}">Transfer ${x.transfer.dir}</span></td><td>${x.transfer.to}</td><td>${x.state}</td></tr>`).join(""):'<tr><td colspan="5" class="muted" style="text-align:center;padding:24px">No transferred cases.</td></tr>')+
    '</tbody></table></div>';
}

/* ---- Reports (with digital watermark) ---- */
function vReports(m){
  m.innerHTML=head("Reports","Templated, printable and exportable reports, digitally watermarked.","Reports");
  m.innerHTML+=`<div class="card panel">
    <div class="toolbar">
      <select id="rt" style="padding:10px;border:1px solid var(--line);border-radius:9px;background:#fff">
        <option value="summary">Case Summary Report</option>
        <option value="state">State-wise Allowance Report</option>
        <option value="pending">Pending Approvals Report</option>
      </select>
      <button class="btn primary sm" onclick="genReport()">Generate</button>
      <button class="btn sm" onclick="window.print()">${svgIco("print",13)} Print</button>
      <button class="btn sm" onclick="exportCsv()">${svgIco("download",13)} Export CSV</button>
    </div>
    <div id="reportArea"></div>
  </div>`;
  genReport();
}
function genReport(){
  const type=document.getElementById("rt").value;const c=DB.cases();
  const stamp=new Date().toLocaleString('en-IN');
  let title,rows;
  if(type==="state"){title="State-wise Allowance Report";
    const by={};c.forEach(x=>{by[x.state]=(by[x.state]||0)+x.amount;});
    rows='<table class="tbl"><thead><tr><th>State</th><th>Cases</th><th>Total Allowance</th></tr></thead><tbody>'+
      Object.keys(by).map(s=>'<tr><td>'+s+'</td><td>'+c.filter(x=>x.state===s).length+'</td><td>₹'+by[s].toLocaleString('en-IN')+'</td></tr>').join("")+'</tbody></table>';
  }else if(type==="pending"){title="Pending Approvals Report";
    const p=c.filter(x=>x.status==="Open"||x.status==="Under Review");
    rows='<table class="tbl"><thead><tr><th>Case ID</th><th>Name</th><th>State</th><th>Status</th></tr></thead><tbody>'+
      p.map(x=>'<tr><td>'+x.id+'</td><td>'+x.name+'</td><td>'+x.state+'</td><td>'+x.status+'</td></tr>').join("")+'</tbody></table>';
  }else{title="Case Summary Report";
    rows='<table class="tbl"><thead><tr><th>Case ID</th><th>Beneficiary</th><th>State</th><th>Amount</th><th>Status</th></tr></thead><tbody>'+
      c.slice(0,12).map(x=>'<tr><td>'+x.id+'</td><td>'+x.name+'</td><td>'+x.state+'</td><td>₹'+x.amount.toLocaleString('en-IN')+'</td><td>'+x.status+'</td></tr>').join("")+'</tbody></table>';
  }
  const wmText=(SESSION.name+" · ADG HR · CONFIDENTIAL · "+SESSION.ip+" · ").repeat(120);
  document.getElementById("reportArea").innerHTML=`<div class="report-sheet">
    <div class="wm"><span>${wmText}</span></div>
    <div class="rh"><div class="emblem" data-emblem></div><h3>Additional Directorate General of Human Rights</h3><div class="muted">IHQ of MoD (Army) &middot; MAARK 2.0 &middot; ${title}</div></div>
    ${rows}
    <div class="rf">
      <span>${svgIco("lock",12)} Generated by: <b>${SESSION.name}</b> (${SESSION.role})</span>
      <span>IP: ${SESSION.ip}</span>
      <span>Timestamp: ${stamp}</span>
      <span>Digitally watermarked &middot; IPR: ADG HR</span>
    </div>
  </div>`;
  document.querySelectorAll("#reportArea [data-emblem]").forEach(el=>el.innerHTML=emblemMark());
  log("GENERATE_REPORT",title);
}
function exportCsv(){const c=DB.cases();exportRows(c);log("EXPORT_CSV","Exported "+c.length+" cases");toast("Exported "+c.length+" cases to CSV");}

/* ---- Analytics (interactive, scaled axes + legends) ---- */
const AN_DIMS=[["state","State","state"],["district","District","district"],["command","Command","group"],["status","Status","status"]];
let anDim="state", anMeasure="count";
const STATUS_COL={"Open":"#c77800","Under Review":"#1565a8","Approved":"#2c6e39","Rejected":"#a83232","Transferred":"#6b45b0"};
function vAnalytics(m){
  m.innerHTML=head("Analytics &amp; Visualisation","Pick a dimension and measure, then click any bar, donut segment or legend to drill into those cases.","Analytics");
  m.innerHTML+=`<div class="card panel">
    <div class="an-ctrl">
      <span class="muted" style="font-weight:700;letter-spacing:.4px">GROUP BY</span>
      <select id="anDim" onchange="anDim=this.value;drawAnalytics()">${AN_DIMS.map(d=>`<option value="${d[0]}"${d[0]===anDim?' selected':''}>${d[1]}</option>`).join("")}</select>
      <span class="toggle" style="margin-left:4px">
        <button class="tg on" id="anMc" onclick="anSetMeasure('count')">Case Count</button>
        <button class="tg" id="anMv" onclick="anSetMeasure('value')">Allowance &#8377;</button>
      </span>
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
function anSetMeasure(v){anMeasure=v;document.getElementById("anMc").classList.toggle("on",v==="count");document.getElementById("anMv").classList.toggle("on",v==="value");drawAnalytics();}
function anAgg(field,measure){const c=DB.cases();const o={};c.forEach(x=>{const k=x[field]||"-";o[k]=(o[k]||0)+(measure==="value"?(x.amount||0):1);});return o;}
function drawAnalytics(){
  const dim=AN_DIMS.find(d=>d[0]===anDim);const money=anMeasure==="value";
  const o=anAgg(dim[2],anMeasure);
  const data=Object.keys(o).sort((a,b)=>o[b]-o[a]).map(k=>[k,o[k],k]);
  const color=money?cssv('--gold'):cssv('--g600');
  document.getElementById("anMain").innerHTML=barChartAxis(data,{color,money,onClick:"anJump"});
  const tot=data.reduce((s,d)=>s+d[1],0);
  document.getElementById("anTot").innerHTML=money?"Total ₹"+tot.toLocaleString('en-IN'):tot+" cases · "+data.length+" "+dim[1].toLowerCase()+(data.length>1?"s":"");
  document.getElementById("anLeg").innerHTML=`<span><i style="background:${color}"></i>${money?'Allowance disbursed (₹)':'Number of cases'} by ${dim[1]}</span><span class="muted">${svgIco("hint",13)} Click a bar to view those cases</span>`;
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
  const formation={"Super Admin":"HQ ADG-HR &middot; Records Cell","Admin":"Formation HQ &middot; HR Cell","User":"Unit Orderly Room"}[SESSION.role]||"-";
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
        <button type="button" class="on" onclick="this.classList.toggle('on')"><span class="dot"></span>Approvals &amp; sign-offs</button>
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
    <p class="muted" style="font-size:11px;margin:14px 0 0">Prototype: profile fields are illustrative and read from the demo session. In production these are provisioned by Army IAM (SAML) and are not edited here.</p>`;
  modal("Profile &amp; Settings",body,[{t:"Done",c:"primary",fn:closeModal}]);
}

/* ==========================================================
   CHATBOT (on-prem, canned knowledge)
   ========================================================== */
const BOT={
  name:"MAARK Assistant", app:"MAARK 2.0", entity:"case", entities:"cases",
  idRe:/maark[\s\/]*\d{4}[\s\/]*\d{1,4}/i,
  hello:"Namaste. I am the <b>MAARK Assistant</b>, an on-premise, ETAI-compliant AI that runs fully offline on the Army Data Network. I can explain policies, workflows, roles, security &amp; support, and answer live questions about the case data.<br><span style='color:var(--muted);font-size:11.5px'>Try: &quot;eligibility rules&quot;, &quot;how many approved?&quot;, or &quot;show MAARK/2026/0003&quot;.</span>",
  summary:x=>`<b>${x.id}</b><br>Beneficiary: <b>${x.name}</b> (${x.rank}, ${x.relation})<br>Unit: ${x.unit}<br>State: ${x.state} &middot; District: ${x.district}<br>Allowance: ₹${x.amount.toLocaleString('en-IN')}<br>Status: <b>${x.status}</b> &middot; Registered: ${x.created}`
};
const DEFAULT_SUG=["What is MAARK 2.0?","How many approved?","Eligibility rules","Security features"];
const KB=[
  {t:["hello","hi","hey","namaste","good morning","good evening"],a:()=>"Namaste. How can I help? Ask about policies, using "+BOT.app+", security, or live case data.",n:["What is MAARK 2.0?","How do I register a case?","Is it secure?"]},
  {t:["thank","thanks","great","appreciate"],a:()=>"Happy to help. Anything else on cases, policy or security?"},
  {t:["who are you","what are you","your name","what can you do","help me","capabilities","topics"],a:()=>"I'm the on-premise "+BOT.name+", an offline ETAI-compliant assistant. I cover policies &amp; eligibility, registering/editing cases, roles &amp; access, security (SAML/2FA/AES-256), reports, analytics, migration and support/AMC, plus live data (counts &amp; case look-ups).",n:["Eligibility rules","How many cases?","Security features"]},
  {t:["what is maark","about maark","about the app","what does this","purpose"],a:()=>"<b>MAARK 2.0</b> (Maintenance Allowance Automated Record Keeping) is the upgraded ADG HR web application that digitises maintenance-allowance case management for soldiers' dependents, covering registration, verification, approval and disbursement, with a CMS, analytics and a full audit trail, hosted on the Army Data Network.",n:["Eligibility rules","Workflow stages","Who can use it?"]},
  {t:["scope","version 2","upgrade","re-develop","redevelop","new feature","v2"],a:()=>"Version 2.0 re-develops the legacy PHP/MySQL app with a current, hardened stack, a CMS, e-office workflow automation, encrypted V1 to V2 data migration, API integration with Army applications, digital watermarking and an on-prem AI assistant.",n:["Technology stack","Migration","Security features"]},
  {t:["eligib","policy","who is entitled","who can claim","allowance rule","dependent","beneficiary"],a:()=>"Maintenance allowance is payable to eligible dependents (<b>widow, mother, father or son/daughter</b>) of soldiers. Each claim is registered, verified, approved by the competent authority, then disbursed; amounts are recorded per case.",n:["Workflow stages","How do I register a case?"]},
  {t:["workflow","process","stages","e-office","lifecycle","steps"],a:()=>"The e-office workflow has four stages: <b>1) Data Entry</b> (register), <b>2) Verification</b> (Under Review), <b>3) Approval</b> by Admin/competent authority, <b>4) Disbursement</b>. Live counts appear on the dashboard's Workflow pipeline.",n:["How many under review?","How do I approve a case?"]},
  {t:["role","access","permission","who can use","privilege"],a:()=>"Three roles with least-privilege RBAC: <b>User</b> (register &amp; update cases, view reports/analytics), <b>Admin</b> (all cases + approve + transfer), <b>Super Admin</b> (everything + Content Management + Audit Log).",n:["How do I register a case?","Security features"]},
  {t:["register","new case","add case","create case","data entry","file a case"],a:()=>"Open <b>New Case (Data Entry)</b>. A single consolidated form captures Auto Case No (system-generated), Personnel, Address, Family and Complaint details, all on one page. On submit the record is AES-256 encrypted and enters the workflow as 'Open'.",n:["Workflow stages","Eligibility rules"]},
  {t:["edit","update case","modify","change a case"],a:()=>"Open <b>Update Regd Cases</b> (or Total Cases for admins), click <b>Edit</b>, change the fields and Save. Every change is audit-logged.",n:["Audit log","How do I approve a case?"]},
  {t:["approve","approval","sanction"],a:()=>"Admins/Super Admins can <b>Approve</b> a case from Total Cases; approved cases are ready for disbursement.",n:["How many approved?","Workflow stages"]},
  {t:["transfer","move case","transferred"],a:()=>DB.cases().filter(x=>x.transfer).length+" cases are transferred. Admins can <b>Transfer</b> a case In/Out to another ADG HR cell; they appear in the Transferred Cases register.",n:["How many cases?"]},
  {t:["report","export","csv","print"],a:()=>"<b>Reports</b> offers Case Summary, State-wise Allowance and Pending Approvals. Every report is <b>digitally watermarked</b> with your ID, IP and timestamp, and can be printed or exported to CSV.",n:["Analytics","Watermarking"]},
  {t:["analytic","chart","visual","statistic","graph"],a:()=>"<b>Analytics</b> lets you group cases by State, District, Command or Status, switch between Case Count and Allowance ₹, and click any bar, donut segment or legend to open those cases. Every chart carries a scale and a legend.",n:["How many approved?","Reports"]},
  {t:["migration","version 1","v1","legacy data","old data"],a:()=>"Existing MAARK 1.0 data (PHP/MySQL, encrypted) is migrated to 2.0 by a dedicated <b>migration module</b> that preserves authenticity and integrity. Dry-run it from CMS, then Database Update.",n:["Technology stack","Database"]},
  {t:["security","secure","encryption","aes","2fa","two factor","saml","iaca","iam","rbac","hardening","owasp"],a:()=>"<b>Security:</b> SAML 2.0 login via Army IAM, mandatory <b>IACA-token 2FA</b>, <b>AES-256</b> encryption at rest (nothing stored unencrypted), IACA SSL/HTTPS, role-based access, malicious-upload checks and full audit logging. It runs offline on the ADN, with no internet.",n:["Audit log","Is it offline?","Watermarking"]},
  {t:["audit","who did","activity","trail"],a:()=>"The <b>Audit Log</b> (Super Admin) records every action (logins, views, edits, approvals, deletes, report generation) with user, role, timestamp and IP, for security analysis.",n:["Security features","Roles"]},
  {t:["watermark"],a:()=>"Any printed/PDF output is <b>digitally watermarked</b> with the machine IP, User ID and timestamp, visible across generated reports.",n:["Reports","Security features"]},
  {t:["backup","normalis","normaliz","3nf","bcnf"],a:()=>"Database backups run <b>daily</b> (or on demand from CMS). Data is normalised to <b>3NF/BCNF</b>.",n:["Database","Migration"]},
  {t:["database","data field","how many field","how many user","10000","500 field","capacity"],a:()=>"Database: <b>MS SQL 2022 or MySQL</b>, up to <b>500 data fields</b>, catering for up to <b>10,000 users</b>, 3NF/BCNF normalised, daily backups.",n:["Technology stack","Backup"]},
  {t:["tech","technology","stack","language","framework","built with"],a:()=>"Stack: <b>PHP/Python/.NET</b> with <b>MS SQL 2022/MySQL</b>, on <b>Ubuntu LTS or Windows Server 2025</b> (VM). No external licensed dependencies; libraries are provided in-house.",n:["Deployment","Database"]},
  {t:["deploy","adn","hosting","host","data center","data centre","port","bandwidth"],a:()=>"Deployed on the <b>Army Data Network</b>, hosted at the Central Data Centre, minimal open ports (Army-vetted), federated, within common-user bandwidth, complying with ADN routing.",n:["Is it offline?","Security features"]},
  {t:["support","amc","maintenance","warranty","direct support"],a:()=>"Support: <b>1 year Direct Support</b> (6-hour response, minor changes free) then a <b>5-year AMC</b> covering fixes, patches and upgrades, six years in total.",n:["Training","Technology stack"]},
  {t:["training","train"],a:()=>"On go-live, <b>training for 20 to 25 personnel</b> is provided at ADG HR premises, Delhi.",n:["Support & AMC"]},
  {t:["ipr","intellectual property","ownership","who owns"],a:()=>"The <b>IPR</b> of the developed application rests entirely with the buyer (ADG HR); nothing is shared outside.",n:["About MAARK 2.0"]},
  {t:["chatbot","ai","etai","assistant","llm","model"],a:()=>"This assistant is an <b>on-premise, ETAI-compliant (DRDO/SAG) AI</b> running fully offline on the ADN with no internet. It answers from the application's policies, functions and live data. In production it is served by a self-hosted open-weights model.",n:["Is it offline?","Security features"]},
  {t:["offline","internet","air gap","air-gap","no internet","connectivity"],a:()=>"Yes. The entire application, <b>including this AI assistant, runs fully offline</b> on the Army Data Network with no internet, per the RFP's air-gapped requirement.",n:["Security features","Technology stack"]}
];
let lastNext=null;
function botAnswer(q){
  const low=normalize(q);lastNext=null;
  const idm=q.match(BOT.idRe);
  if(idm){const raw=idm[0].toUpperCase().replace(/\s+/g,"/").replace(/\/+/g,"/");let x=DB.cases().find(c=>c.id.toUpperCase()===raw);
    if(!x){const num=(idm[0].match(/(\d{1,4})\s*$/)||[])[1];if(num)x=DB.cases().find(c=>c.id.endsWith(String(parseInt(num)).padStart(4,"0")));}
    return x?caseSummary(x):"I couldn't find that case number. Please check the number and try again.";}
  const nm=low.match(/\b(?:case|complaint)\s*(?:no\.?|number|#)?\s*(\d{1,4})\b/);
  if(nm){const y=DB.cases().find(c=>c.id.endsWith(String(parseInt(nm[1])).padStart(4,"0")));if(y)return caseSummary(y);}
  if(/\b(how many|count|number of|total number|how much)\b/.test(low))return countAnswer(low);
  if(/\b(list|show me|which|display|show all)\b/.test(low)){const r=listAnswer(low);if(r)return r;}
  let best=null,bs=0;KB.forEach(e=>{const s=scoreEntry(e,low);if(s>bs){bs=s;best=e;}});
  if(best&&bs>0){lastNext=best.n||DEFAULT_SUG;return typeof best.a==="function"?best.a():best.a;}
  lastNext=DEFAULT_SUG;
  return "I can help with <b>policies &amp; eligibility</b>, registering/editing cases, <b>roles &amp; access</b>, <b>security</b> (SAML/2FA/AES-256), reports, analytics, migration and support, plus live data (counts &amp; case look-ups). What would you like to know?";
}

/* ==========================================================
   UI ENHANCEMENT HELPERS (icons, prefs, charts, tables, forms)
   ========================================================== */

/* preferences: dark mode + density */
/* colour themes: live palette swap on :root */
const PAL_KEYS=['--g900','--g800','--g700','--g600','--g500','--gold','--gold-l','--gold-d','--gold-soft','--ink','--muted','--faint','--line','--line-2','--bg','--paper','--cream','--danger','--ok','--warn','--info'];
const DEFAULT_PAL="Army Green";
const PAL_SWATCH={"Army Green":"#2f5233","Navy Blue":"#1b3168","Neutral Grey":"#333840"};
const PALETTES={
  "Army Green":null,
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
applyPrefs();hydrateIcons();
