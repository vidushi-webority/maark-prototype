/* ============================================================
   Shared prototype core - MAARK 2.0 + CUT-HRV 2.0
   Functions byte-identical in both apps: charts (lineChart, barChartAxis,
   donut, sparkSVG), modal/toast, searchable selects, form validation,
   theme + density preferences, auth simulation, chat plumbing.
   Load this BEFORE the app script. Declarations only, no side effects.
   ============================================================ */
function anCmdJump(key){filterQ="";filterS="";filterG=key;qfKey="";page=1;go(SESSION.role==="User"?"mycases":"allcases");}
function anJump(key){filterQ="";filterS="";filterG="";qfKey="";page=1;
  if(anDim==="status")filterS=key;else if(anDim==="command")filterG=key;else filterQ=key;
  go(SESSION.role==="User"?"mycases":"allcases");}
function anStatusJump(key){filterQ="";filterG="";filterS=key;qfKey="";page=1;go(SESSION.role==="User"?"mycases":"allcases");}
function applyPrefs(){
  setPalTokens(currentPal());
  const dark=localStorage.getItem("ui_theme")==="dark";document.body.classList.toggle("dark",dark);
  const cmp=localStorage.getItem("ui_density")==="compact";document.body.classList.toggle("compact",cmp);
  const tb=document.getElementById("themeBtn");if(tb){tb.innerHTML=svgIco(dark?"sun":"moon");tb.title=dark?"Switch to light mode":"Switch to dark mode";}
  const db=document.getElementById("densBtn");if(db){db.innerHTML=svgIco("rows");db.title=cmp?"Comfortable rows":"Compact rows";db.style.opacity=cmp?"1":".7";}
}
function applyTheme(name){
  if(PALETTES[name]===undefined)name=DEFAULT_PAL;
  localStorage.setItem("ui_palette",name);setPalTokens(name);
  try{const s=DB.settings();s.theme=name;DB.saveSettings(s);}catch(e){}
  const av=document.getElementById("appView");
  if(av&&!av.classList.contains("hidden")&&typeof CURRENT!=="undefined")go(CURRENT);
}
function arc(cx,cy,r,ir,a1,a2){
  const p=(ang,rad)=>[cx+rad*Math.cos(ang*Math.PI/180),cy+rad*Math.sin(ang*Math.PI/180)];
  const[x1,y1]=p(a1,r),[x2,y2]=p(a2,r),[x3,y3]=p(a2,ir),[x4,y4]=p(a1,ir);
  const big=a2-a1>180?1:0;
  return `M${x1} ${y1} A${r} ${r} 0 ${big} 1 ${x2} ${y2} L${x3} ${y3} A${ir} ${ir} 0 ${big} 0 ${x4} ${y4} Z`;
}
function backToLogin(){document.getElementById("otpStep").classList.add("hidden");document.getElementById("loginStep").classList.remove("hidden");}
function barChartAxis(data,opts){
  opts=opts||{};const baseColor=opts.color||cssv('--g600');const money=opts.money;
  const fmt=v=>money?'₹'+kfmt(v):v;
  const n=data.length||1;
  const maxV=Math.max(...data.map(d=>d[1]),1);const top=niceCeil(maxV);
  const slot=Math.max(58,Math.min(150,Math.floor(840/n)));
  const maxChars=Math.max(7,Math.floor(slot/6.2));
  const labels=data.map(d=>wrapLabel(d[0],maxChars));
  const maxLines=Math.max(1,...labels.map(l=>l.length));
  const padL=52,padR=18,padT=20,plotH=190;const padB=20+maxLines*12;
  const w=padL+padR+n*slot;const H=padT+plotH+padB;const y0=padT+plotH;const ticks=4;
  let grid="";
  for(let t=0;t<=ticks;t++){const val=top*t/ticks;const yy=y0-(val/top)*plotH;
    grid+=`<line x1="${padL}" y1="${yy.toFixed(1)}" x2="${w-padR}" y2="${yy.toFixed(1)}" stroke="${cssv('--line')}" ${t?'stroke-dasharray="3 4"':''}/>`;
    grid+=`<text x="${padL-8}" y="${(yy+3).toFixed(1)}" text-anchor="end" font-size="9" fill="${cssv('--faint')}">${money?'₹'+kfmt(val):Math.round(val)}</text>`;}
  let bars="";
  data.forEach((d,i)=>{
    const bh=(d[1]/top)*plotH;const bw=slot*0.56;const bx=padL+i*slot+(slot-bw)/2;const by=y0-bh;
    const col=d[3]||baseColor;const key=String(d[2]!=null?d[2]:d[0]).replace(/'/g,"\\'");
    const clk=opts.onClick?` style="cursor:pointer" onclick="${opts.onClick}('${key}')"`:'';
    const cx=(bx+bw/2).toFixed(1);
    bars+=`<g class="bar-int"${clk}><rect x="${bx.toFixed(1)}" y="${by.toFixed(1)}" width="${bw.toFixed(1)}" height="${Math.max(0,bh).toFixed(1)}" rx="4" fill="${col}" data-tip="<b>${esc(d[0])}</b> &middot; ${fmt(d[1])}"></rect>`;
    bars+=`<text x="${cx}" y="${(by-6).toFixed(1)}" text-anchor="middle" font-size="10" font-weight="700" fill="${cssv('--g800')}">${fmt(d[1])}</text>`;
    labels[i].forEach((ln,li)=>{bars+=`<text x="${cx}" y="${(y0+14+li*11).toFixed(1)}" text-anchor="middle" font-size="8.6" fill="${cssv('--muted')}">${esc(ln)}</text>`;});
    bars+=`</g>`;
  });
  const axis=`<line x1="${padL}" y1="${padT}" x2="${padL}" y2="${y0}" stroke="${cssv('--faint')}"/><line x1="${padL}" y1="${y0}" x2="${w-padR}" y2="${y0}" stroke="${cssv('--faint')}"/>`;
  return `<div class="chart-wrap"><svg width="${w}" height="${H}" viewBox="0 0 ${w} ${H}">${grid}${axis}${bars}</svg></div>`;
}
function bot(html){const b=document.getElementById("chatBody");const d=document.createElement("div");d.className="bub bot";d.innerHTML=html;b.appendChild(d);b.scrollTop=b.scrollHeight;}
function caseSummary(x){lastNext=DEFAULT_SUG;return BOT.summary(x);}
function changePassword(){
  modal("Change Password",`
    <div class="field"><label>Current password</label><input id="cp_old" type="password" placeholder="Enter current password"></div>
    <div class="field" style="margin-top:12px"><label>New password</label><input id="cp_new" type="password" placeholder="Min 8 characters, at least 1 number" oninput="cpStrength()"></div>
    <div class="pw-meter"><i id="cp_bar"></i></div>
    <div class="field" style="margin-top:12px"><label>Confirm new password</label><input id="cp_conf" type="password" placeholder="Re-enter the new password"></div>
    <div id="cp_msg" class="cp-msg"></div>
    <div class="demo-note" style="margin-top:14px">${svgIco("lock",13)} Passwords are validated locally in this prototype. In production, changes are enforced through Army IAM (SAML) policy.</div>`,
   [{t:"Cancel",c:"ghost",fn:closeModal},{t:"Update password",c:"primary",fn:submitPassword}]);
}
function clearDraft(){localStorage.removeItem(DRAFT_KEY);}
function clearFilters(){filterQ="";filterS="";filterG="";qfKey="all";page=1;go(CURRENT);}
function clearSel(){selected=new Set();drawRows();}
function closeModal(){document.getElementById("modalRoot").innerHTML="";}
function collectAll(){WIZ.forEach(s=>s.f.forEach(([k])=>{const el=document.getElementById("wz_"+k);if(el)wizData[k]=el.value;}));}
function countAnswer(low){
  const c=DB.cases();let f=c.slice();let lbl="";
  const st=STATUS.find(s=>low.indexOf(s.toLowerCase())>=0);if(st){f=f.filter(x=>x.status===st);lbl=st+" ";}
  const locs=[].concat(STATES, typeof AREAS!=='undefined'?AREAS:[], typeof DISTRICTS!=='undefined'?DISTRICTS:[]);
  const loc=locs.find(a=>low.indexOf(a.toLowerCase())>=0);if(loc){f=f.filter(x=>x.state===loc||x.area===loc||x.district===loc);lbl+="in "+loc+" ";}
  if(typeof ALLEGATIONS!=='undefined'){const al=ALLEGATIONS.find(a=>low.indexOf(a.toLowerCase())>=0);if(al){f=f.filter(x=>x.allegationType===al);lbl+=al+" ";}}
  lastNext=DEFAULT_SUG;return "There are <b>"+f.length+"</b> "+lbl+BOT.entities+" (of "+c.length+" total).";
}
function countUp(el){const to=+el.dataset.to||0,money=el.dataset.money==="1",t0=performance.now(),dur=650;
  (function tick(t){const p=Math.min(1,(t-t0)/dur);const e=1-Math.pow(1-p,3);const v=to*e;
    el.textContent=money?("₹"+Math.round(v).toLocaleString('en-IN')):Math.round(v).toLocaleString('en-IN');
    if(p<1)requestAnimationFrame(tick);})(t0);}
function cpStrength(){const v=(document.getElementById("cp_new")||{}).value||"";let s=0;if(v.length>=8)s++;if(/\d/.test(v))s++;if(/[A-Z]/.test(v))s++;if(/[^A-Za-z0-9]/.test(v))s++;
  const bar=document.getElementById("cp_bar");if(bar){bar.style.width=(s*25)+"%";bar.style.background=s<=1?"var(--danger)":s<=2?"var(--warn)":"var(--ok)";}}
function cssv(n){return getComputedStyle(document.documentElement).getPropertyValue(n).trim()||"#333";}
function currentPal(){const p=localStorage.getItem("ui_palette");return (p&&PALETTES[p]!==undefined)?p:DEFAULT_PAL;}
function dashHighlightDonut(){
  document.querySelectorAll("#dashDonut .dseg").forEach(p=>{p.style.opacity=(dashStatus==="All"||p.dataset.s===dashStatus)?"1":".22";});
}
function dashSetStatus(s){
  dashStatus=(dashStatus===s&&s!=="All")?"All":s;
  document.querySelectorAll("#segbar .seg").forEach(b=>b.classList.toggle("on",b.dataset.s===dashStatus));
  dashRenderRows(); dashHighlightDonut();
}
function dashSetView(v){dashView=v;document.getElementById("tgCount").classList.toggle("on",v==="count");document.getElementById("tgValue").classList.toggle("on",v==="value");dashRenderWF();}
function dbRow(k,v,c){return '<div style="display:flex;justify-content:space-between;align-items:center;padding:11px 14px;background:linear-gradient(180deg,#f8f9f4,#f2f4ec);border-radius:9px;border:1px solid var(--line-2)"><span class="muted" style="font-weight:600">'+k+'</span><span style="font-weight:700;color:'+c+'">'+v+'</span></div>';}
function discardDraft(){clearDraft();go("new");toast("Draft discarded");}
function doLogin(){
  document.getElementById("loginStep").classList.add("hidden");
  document.getElementById("otpStep").classList.remove("hidden");
  const box=document.getElementById("otpBoxes");box.innerHTML="";
  for(let i=0;i<6;i++){const inp=document.createElement("input");inp.maxLength=1;inp.inputMode="numeric";
    inp.oninput=()=>{if(inp.value&&inp.nextElementSibling)inp.nextElementSibling.focus();};
    box.appendChild(inp);}
  box.firstChild.focus();
}
function donut(data,opts){
  opts=opts||{};
  const total=data.reduce((s,d)=>s+d[1],0)||1;let a=-90;const cx=92,cy=92,r=72,ir=44;
  let paths="";data.forEach(d=>{if(d[1]<=0)return;const ang=d[1]/total*360;const a2=a+ang;const pct=Math.round(d[1]/total*100);
    const clk=opts.onClick?` style="cursor:pointer" onclick="${opts.onClick}('${String(d[0]).replace(/'/g,"\\'")}')"`:'';
    paths+=`<path d="${arc(cx,cy,r,ir,a,a2)}" fill="${d[2]}"${clk} data-tip="<b>${d[0]}</b> &middot; ${d[1]} (${pct}%)"></path>`;a=a2;});
  const leg=data.map(d=>{const pct=Math.round(d[1]/total*100);
    return `<span class="${opts.onClick?'leg-click':''}"${opts.onClick?` onclick="${opts.onClick}('${String(d[0]).replace(/'/g,"\\'")}')"`:''}><i style="background:${d[2]}"></i>${d[0]}: <b>${d[1]}</b> (${pct}%)</span>`;}).join("");
  return `<div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap"><svg width="184" height="184" viewBox="0 0 184 184">${paths}<text x="92" y="88" text-anchor="middle" font-size="24" font-weight="800" fill="${cssv('--g800')}" font-family="Georgia,serif">${total}</text><text x="92" y="106" text-anchor="middle" font-size="10" fill="${cssv('--muted')}" letter-spacing="1">TOTAL</text></svg><div class="legend" style="flex-direction:column;gap:7px">${leg}</div></div>`;
}
function donutDash(data){
  const total=data.reduce((s,d)=>s+d[1],0)||1;let a=-90;const cx=92,cy=92,r=72,ir=44;
  let paths="";data.forEach(d=>{
    if(d[1]<=0)return;const ang=d[1]/total*360;const a2=a+ang;
    paths+=`<path d="${arc(cx,cy,r,ir,a,a2)}" fill="${d[2]}" class="dseg" data-s="${d[0]}" style="cursor:pointer;transition:opacity .2s" onclick="dashSetStatus('${d[0]}')" data-tip="<b>${d[0]}</b> &middot; ${d[1]} &middot; click to filter"></path>`;
    a=a2;
  });
  const leg=data.map(d=>`<span style="cursor:pointer" onclick="dashSetStatus('${d[0]}')"><i style="background:${d[2]}"></i>${d[0]} (${d[1]})</span>`).join("");
  return `<div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap"><svg width="184" height="184" viewBox="0 0 184 184" id="dashDonut">${paths}<text x="92" y="88" text-anchor="middle" font-size="24" font-weight="800" fill="${cssv('--g800')}" font-family="Georgia,serif">${total}</text><text x="92" y="106" text-anchor="middle" font-size="10" fill="${cssv('--muted')}" letter-spacing="1">TOTAL</text></svg><div class="legend" style="flex-direction:column;gap:7px">${leg}</div></div>`;
}
function drawPager(pages,tot){const p=document.getElementById("pager");if(!p)return;
  let show=[];for(let i=1;i<=pages;i++)show.push(i);
  if(pages>7){show=[1];const s=Math.max(2,page-1),e=Math.min(pages-1,page+1);if(s>2)show.push("…");for(let i=s;i<=e;i++)show.push(i);if(e<pages-1)show.push("…");show.push(pages);}
  const btns=show.map(n=>n==="…"?'<button disabled>…</button>':`<button class="${n===page?'on':''}" onclick="gotoPage(${n})">${n}</button>`).join("");
  p.innerHTML=`<span class="pinfo">Showing ${(page-1)*perPage+1}-${Math.min(page*perPage,tot)} of ${tot}</span><button onclick="gotoPage(${page-1})" ${page<=1?'disabled':''}>‹</button>${btns}<button onclick="gotoPage(${page+1})" ${page>=pages?'disabled':''}>›</button>`;}
function drawSideCharts(){
  const c=DB.cases();
  const byGrp={};c.forEach(x=>{byGrp[x.group]=(byGrp[x.group]||0)+1;});
  const pal=[cssv('--g800'),cssv('--g600'),cssv('--g500'),cssv('--gold'),"#1c5c96","#6b45b0","#b3781a","#2c6e39"];
  const gd=Object.keys(byGrp).sort((a,b)=>byGrp[b]-byGrp[a]).map((g,i)=>[g,byGrp[g],pal[i%pal.length]]);
  document.getElementById("anDonut").innerHTML=donut(gd,{onClick:"anCmdJump"});
  const sdata=STATUS.map(s=>[s,c.filter(x=>x.status===s).length,s,STATUS_COL[s]||cssv('--g600')]);
  document.getElementById("anStatus").innerHTML=barChartAxis(sdata,{onClick:"anStatusJump"});
}
function emptyState(title,msg,onclick,btn){return `<div class="empty-st"><div class="ei">${svgIco("empty",26)}</div><h4>${title}</h4><p>${msg}</p>${btn?`<button class="btn primary" onclick="${onclick}">${btn}</button>`:''}</div>`;}
function esc(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");}
function fieldHtml([k,label,type,req,ro,opts]){
  const v=wizData[k]||"";const r=req?' <span class="req">*</span>':'';
  let inp;
  if(type==="select"){
    if(opts&&SSEL_OPTS[k]&&opts.length>12) inp=searchSelectHtml(k,v);
    else inp='<select id="wz_'+k+'" onchange="validateField(\''+k+'\');saveDraft()"><option value="">Select...</option>'+opts.map(o=>'<option '+(v===o?'selected':'')+'>'+o+'</option>').join("")+'</select>';
  }
  else if(type==="textarea") inp='<textarea id="wz_'+k+'" rows="3" onblur="validateField(\''+k+'\')" oninput="saveDraft()">'+v+'</textarea>';
  else inp='<input id="wz_'+k+'" type="'+type+'" value="'+v+'" '+(ro?'readonly style="background:var(--line-2);font-weight:700;color:var(--g700)"':'onblur="validateField(\''+k+'\')" oninput="saveDraft()"')+'>';
  return '<div class="field '+(type==="textarea"?'full':'')+'" style="position:relative"><label>'+label+r+'</label>'+inp+'<div class="fmsg"></div></div>';
}
function fieldMeta(k){return WIZ.flatMap(s=>s.f).find(f=>f[0]===k);}
function findCase(id){return DB.cases().find(x=>x.id===id);}
function gotoPage(n){page=n;drawRows();}
function groupOf(state){for(const g in GROUPS)if(GROUPS[g].includes(state))return g;return "Other";}
function head(title,sub,crumb){return '<div class="crumb">Home &nbsp;/&nbsp; '+crumb+'</div><div class="pagehead"><h2>'+title+'</h2>'+(sub?'<div class="sub">'+sub+'</div>':'')+'</div>';}
function icon(k){return '<span class="navic"><svg viewBox="0 0 24 24">'+(ICONS[k]||'')+'</svg></span>';}
function initChat(){document.getElementById("chatBody").innerHTML="";bot(BOT.hello);refreshSug(DEFAULT_SUG);}
function jumpCases(status){filterS=status==="All"?"":status;filterQ="";filterG="";qfKey=status==="All"?"all":"";page=1;go(SESSION.role==="User"?"mycases":"allcases");}
function jumpToQf(qf){qfKey=qf;filterS="";filterQ="";filterG="";page=1;go(SESSION.role==="User"?"mycases":"allcases");}
function kfmt(v){return v>=1000?(Math.round(v/100)/10)+'k':v;}
function kpi(l,v,c,ico,icbg,tr,dir,spark,money){return `<div class="card kpi"><div class="strip" style="background:${c}"></div><div class="top"><div class="lbl">${l}</div><div class="ico" style="background:${icbg}">${ico}</div></div><div class="val">${kpiValHtml(v,money)}</div><div class="tr ${dir||''}">${tr}</div>${spark?sparkSVG(spark,c):''}</div>`;}
function kpiValHtml(v,money){return typeof v==="number"?`<span data-count data-to="${v}" data-money="${money?1:0}">0</span>`:v;}
function kv(k,v){return '<div class="field"><label>'+k+'</label><div style="padding:8px 0;font-weight:700;color:var(--ink)">'+v+'</div></div>';}
function lineChart(points,opts){
  opts=opts||{};const color=opts.color||cssv('--g600');
  if(!points.length)points=[["",0]];
  const n=points.length;const top=niceCeil(Math.max(...points.map(p=>p[1]),1));
  const padL=44,padR=18,padT=16,padB=40,plotH=170;
  const w=Math.max(360,padL+padR+(n-1)*Math.max(60,Math.min(130,540/Math.max(1,n-1))));
  const H=padT+plotH+padB,y0=padT+plotH;
  const X=i=>padL+(n===1?(w-padL-padR)/2:i*(w-padL-padR)/(n-1));const Y=v=>y0-(v/top)*plotH;
  let grid="";for(let t=0;t<=4;t++){const val=top*t/4,yy=Y(val);
    grid+=`<line x1="${padL}" y1="${yy.toFixed(1)}" x2="${w-padR}" y2="${yy.toFixed(1)}" stroke="${cssv('--line')}" ${t?'stroke-dasharray="3 4"':''}/>`;
    grid+=`<text x="${padL-8}" y="${(yy+3).toFixed(1)}" text-anchor="end" font-size="9" fill="${cssv('--faint')}">${Math.round(val)}</text>`;}
  const P=points.map((p,i)=>[X(i),Y(p[1])]);
  const line=P.map((q,i)=>(i?'L':'M')+q[0].toFixed(1)+' '+q[1].toFixed(1)).join(' ');
  const area=`M${P[0][0].toFixed(1)} ${y0} `+P.map(q=>'L'+q[0].toFixed(1)+' '+q[1].toFixed(1)).join(' ')+` L${P[n-1][0].toFixed(1)} ${y0} Z`;
  let dots="";points.forEach((p,i)=>{dots+=`<circle cx="${P[i][0].toFixed(1)}" cy="${P[i][1].toFixed(1)}" r="4" fill="var(--paper)" stroke="${color}" stroke-width="2.5" data-tip="<b>${moLabel(p[0])}</b> &middot; ${p[1]} cases"></circle>`;
    dots+=`<text x="${P[i][0].toFixed(1)}" y="${y0+16}" text-anchor="middle" font-size="9" fill="${cssv('--muted')}">${moLabel(p[0])}</text>`;});
  return `<div class="chart-wrap"><svg width="${w}" height="${H}" viewBox="0 0 ${w} ${H}"><defs><linearGradient id="lg1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${color}" stop-opacity=".22"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></linearGradient></defs>${grid}<path d="${area}" fill="url(#lg1)"/><path d="${line}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>${dots}</svg></div>`;
}
function listAnswer(low){
  const c=DB.cases();let f=c.slice();
  const st=STATUS.find(s=>low.indexOf(s.toLowerCase())>=0);if(st)f=f.filter(x=>x.status===st);
  const locs=[].concat(STATES, typeof AREAS!=='undefined'?AREAS:[], typeof DISTRICTS!=='undefined'?DISTRICTS:[]);
  const loc=locs.find(a=>low.indexOf(a.toLowerCase())>=0);if(loc)f=f.filter(x=>x.state===loc||x.area===loc||x.district===loc);
  if(!st&&!loc)return null;lastNext=DEFAULT_SUG;
  if(!f.length)return "No matching "+BOT.entities+".";
  return "Showing "+Math.min(6,f.length)+" of "+f.length+":<br>"+f.slice(0,6).map(x=>"• <b>"+x.id+"</b>: "+(x.name||x.victim)+" ("+x.status+")").join("<br>");
}
function logout(){log("LOGOUT","Session ended");location.reload();}
function me(t){const b=document.getElementById("chatBody");const d=document.createElement("div");d.className="bub me";d.textContent=t;b.appendChild(d);b.scrollTop=b.scrollHeight;}
function moLabel(k){const p=(k||"").split("-");return p.length===2?MON[+p[1]]+" "+p[0].slice(2):k;}
function modal(title,body,buttons){
  const btns=(buttons||[{t:"Close",c:"primary",fn:closeModal}]).map((b,i)=>'<button class="btn '+(b.c||'')+'" data-i="'+i+'">'+b.t+'</button>').join("");
  document.getElementById("modalRoot").innerHTML=`<div class="overlay" onclick="if(event.target===this)closeModal()"><div class="modal"><div class="tricolor"></div><div class="mh"><h3>${title}</h3><button class="x" onclick="closeModal()">&times;</button></div><div class="mb">${body}</div><div class="mf">${btns}</div></div></div>`;
  (buttons||[]).forEach((b,i)=>{document.querySelector('.mf [data-i="'+i+'"]').onclick=b.fn;});
}
function monthly(cs){const b={};cs.forEach(x=>{const mo=(x.created||"").slice(0,7);if(mo)b[mo]=(b[mo]||0)+1;});return Object.keys(b).sort().map(k=>[k,b[k]]);}
function monthlyVals(cs){return monthly(cs).map(p=>p[1]);}
function niceCeil(v){if(v<=5)return 5;const pow=Math.pow(10,Math.floor(Math.log10(v)));const nn=v/pow;let step;if(nn<=1)step=1;else if(nn<=2)step=2;else if(nn<=2.5)step=2.5;else if(nn<=5)step=5;else step=10;return step*pow;}
function normalize(s){return " "+s.toLowerCase().replace(/[^a-z0-9\/ ]/g," ").replace(/\s+/g," ").trim()+" ";}
function pageSlice(){return getFiltered().slice((page-1)*perPage,page*perPage);}
function quick(el){document.getElementById("chatIn").value=el.textContent;sendChat();}
function refreshCarets(){document.querySelectorAll('.tbl th.sortable').forEach(t=>{const k=t.getAttribute('data-k');t.classList.toggle('sorted',k===sortKey);const c=t.querySelector('.caret');if(c)c.textContent=k===sortKey?(sortDir>0?'▲':'▼'):'▲';});}
function refreshSug(list){document.getElementById("chatSug").innerHTML=(list||DEFAULT_SUG).map(s=>'<button onclick="quick(this)">'+s+'</button>').join("");}
function renderForm(){
  document.getElementById("formSecs").innerHTML=WIZ.map((s,i)=>
    '<div class="formsec"><div class="formsec-h"><span class="secn">'+(i+1)+'</span>'+s.t+'</div>'+
    '<div class="formgrid">'+s.f.map(f=>fieldHtml(f)).join("")+'</div></div>').join("");
  const rail=document.getElementById("formRail");
  if(rail)rail.innerHTML='<div class="crumb" style="margin-bottom:8px">Sections</div>'+WIZ.map((s,i)=>`<div class="rl" onclick="scrollSec(${i})"><span class="rd">${i+1}</span><div><div class="rt">${s.t}</div><div class="rc">${s.f.filter(f=>f[3]).length} required</div></div></div>`).join("");
  updateRail();
}
function resetIdle(){clearTimeout(idleTimer);idleTimer=setTimeout(sessionTimeout,10*60*1000);}
function resolveColor(c){return c&&c.indexOf('var(')===0?cssv(c.slice(4,-1)):c;}
function rndIp(){return "10."+(1+Math.floor(new Date().getSeconds()/6))+"."+(new Date().getMinutes())+"."+(1+new Date().getSeconds());}
function runBackup(){log("DB_BACKUP","Manual encrypted backup triggered");toast("Encrypted backup completed at "+new Date().toLocaleTimeString('en-IN'));}
function runCounts(scope){(scope||document).querySelectorAll('[data-count]').forEach(countUp);}
function saveCms(){const s=DB.settings();s.title=val("cms_title");s.banner=val("cms_banner");s.theme=val("cms_theme");DB.saveSettings(s);log("CMS_UPDATE","Updated web settings");toast("Web settings saved");}
function saveDraft(){collectAll();localStorage.setItem(DRAFT_KEY,JSON.stringify(wizData));}
function scoreEntry(e,low){let sc=0;e.t.forEach(term=>{const t=term.trim();const hit=t.length<=3?low.indexOf(" "+t+" ")>=0:low.indexOf(t)>=0;if(hit)sc+=t.split(" ").length*3;});return sc;}
function scrollSec(i){const s=document.querySelectorAll(".formsec")[i];if(s)s.scrollIntoView({behavior:"smooth",block:"center"});}
function searchSelectHtml(k,v){return `<div class="ssel" data-k="${k}"><input type="hidden" id="wz_${k}" value="${(v||'').replace(/"/g,'&quot;')}">`+
  `<input class="ssel-inp" id="ss_${k}" autocomplete="off" placeholder="Type to search…" value="${(v||'').replace(/"/g,'&quot;')}" `+
  `oninput="sselRender('${k}',this.value);document.getElementById('sm_${k}').classList.add('open')" onfocus="sselOpen('${k}')" onblur="sselCloseSoon('${k}')"><div class="ssel-menu" id="sm_${k}"></div></div>`;}
function sendChat(){
  const inp=document.getElementById("chatIn");const q=inp.value.trim();if(!q)return;me(q);inp.value="";log("CHATBOT_QUERY",q);
  const b=document.getElementById("chatBody");const t=document.createElement("div");t.className="bub bot";t.innerHTML="<span style='opacity:.5'>typing…</span>";b.appendChild(t);b.scrollTop=b.scrollHeight;
  setTimeout(()=>{t.remove();bot(botAnswer(q));refreshSug(lastNext||DEFAULT_SUG);},420);
}
function sessionTimeout(){log("SESSION_TIMEOUT","Idle auto-logout (10 min)");
  modal("Session Timed Out",`<div style="text-align:center;padding:8px 4px"><div style="color:var(--gold-d)">${svgIco("lock",38)}</div><p style="margin-top:8px">Your session was ended after 10 minutes of inactivity, per Army security policy. Please sign in again.</p></div>`,[{t:"Sign in again",c:"primary",fn:()=>location.reload()}]);}
function setPalTokens(name){
  const root=document.documentElement;PAL_KEYS.forEach(k=>root.style.removeProperty(k));
  const p=PALETTES[name];if(p)PAL_KEYS.forEach(k=>{if(p[k])root.style.setProperty(k,p[k]);});
}
function setQf(k){qfKey=k;page=1;go(CURRENT);}
function setSort(k){if(sortKey===k)sortDir*=-1;else{sortKey=k;sortDir=1;}refreshCarets();drawRows();}
function skeletonView(){return '<div class="pagehead" style="border:none;margin-bottom:16px"><div class="skel" style="width:230px;height:26px"></div></div>'+
  '<div class="grid kpis" style="margin-bottom:18px">'+Array(4).fill('<div class="card" style="padding:18px"><div class="skel" style="width:55%;height:12px;margin-bottom:14px"></div><div class="skel" style="width:38%;height:28px"></div></div>').join("")+'</div>'+
  '<div class="card" style="padding:20px">'+Array(6).fill('<div class="skel skel-row"></div>').join("")+'</div>';}
function sparkSVG(vals,color){color=resolveColor(color);if(!vals.length)vals=[0,0];const w=118,h=30,n=vals.length,max=Math.max(...vals,1);
  const X=i=>(n===1?w/2:i*w/(n-1)),Y=v=>h-2-(v/max)*(h-7);
  const P=vals.map((v,i)=>[X(i),Y(v)]);
  const line=P.map((q,i)=>(i?'L':'M')+q[0].toFixed(1)+' '+q[1].toFixed(1)).join(' ');
  const area=`M0 ${h} `+P.map(q=>'L'+q[0].toFixed(1)+' '+q[1].toFixed(1)).join(' ')+` L${w} ${h} Z`;
  return `<svg class="spark" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><path d="${area}" fill="${color}" opacity=".13"/><path d="${line}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;}
function sselCloseSoon(k){setTimeout(()=>{const m=document.getElementById("sm_"+k);if(m)m.classList.remove("open");sselReconcile(k);},160);}
function sselOpen(k){const inp=document.getElementById("ss_"+k);sselRender(k,inp?inp.value:"");document.getElementById("sm_"+k).classList.add("open");}
function sselPick(k,v){document.getElementById("wz_"+k).value=v;document.getElementById("ss_"+k).value=v;document.getElementById("sm_"+k).classList.remove("open");validateField(k);saveDraft();}
function sselReconcile(k){const inp=document.getElementById("ss_"+k);if(!inp)return;const opts=SSEL_OPTS[k]||[];
  const match=opts.find(o=>o.toLowerCase()===inp.value.trim().toLowerCase());
  if(match){document.getElementById("wz_"+k).value=match;inp.value=match;}else{inp.value=document.getElementById("wz_"+k).value;}
  validateField(k);}
function sselRender(k,q){const opts=SSEL_OPTS[k]||[];const low=(q||"").toLowerCase();const list=opts.filter(o=>o.toLowerCase().includes(low));
  const m=document.getElementById("sm_"+k);if(!m)return;
  m.innerHTML=list.length?list.map(o=>`<div class="ssel-opt" onmousedown="sselPick('${k}',this.textContent)">${o}</div>`).join(""):'<div class="ssel-opt none">No match</div>';}
function submitPassword(){
  const o=val("cp_old"),n=val("cp_new"),c=val("cp_conf");const msg=document.getElementById("cp_msg");
  if(!o){msg.textContent="Enter your current password.";return;}
  if(n.length<8||!/\d/.test(n)){msg.textContent="New password must be at least 8 characters and include a number.";return;}
  if(n===o){msg.textContent="New password must be different from the current password.";return;}
  if(n!==c){msg.textContent="New password and confirmation do not match.";return;}
  log("CHANGE_PASSWORD","Account password updated");closeModal();toast("Password updated successfully");
}
function submitSingle(){
  collectAll();let firstBad=null;
  WIZ.forEach(s=>s.f.forEach(([k])=>{const ok=validateField(k);if(!ok&&!firstBad)firstBad=k;}));
  if(firstBad){toast("Please complete the highlighted required fields","err");
    const el=document.getElementById("ss_"+firstBad)||document.getElementById("wz_"+firstBad);
    if(el){const f=el.closest(".field");if(f)f.scrollIntoView({behavior:"smooth",block:"center"});if(el.focus)el.focus();}return;}
  clearDraft();submitCase();
}
/* fills [data-ico] slots in static markup, which cannot call svgIco() itself */
function hydrateIcons(scope){(scope||document).querySelectorAll("[data-ico]").forEach(el=>{el.innerHTML=svgIco(el.dataset.ico,+el.dataset.sz||14);});}
function svgIco(k,sz){sz=sz||17;return '<svg viewBox="0 0 24 24" style="width:'+sz+'px;height:'+sz+'px;stroke:currentColor;fill:none;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round">'+(ICONS[k]||'')+'</svg>';}
function syncChkAll(){const ca=document.getElementById('chkAll');if(ca){const sl=pageSlice();ca.checked=sl.length>0&&sl.every(x=>selected.has(x.id));}}
function th(k,label){const on=sortKey===k;return `<th class="sortable${on?' sorted':''}" data-k="${k}" onclick="setSort('${k}')">${label}<span class="caret">${on?(sortDir>0?'▲':'▼'):'▲'}</span></th>`;}
function toast(msg,type){
  const t=document.createElement("div");t.className="toast"+(type==="err"?" err":"");t.innerHTML=msg;
  document.getElementById("toastWrap").appendChild(t);
  setTimeout(()=>{t.style.opacity=0;setTimeout(()=>t.remove(),300);},3200);
}
function toggleAll(el){pageSlice().forEach(x=>{if(el.checked)selected.add(x.id);else selected.delete(x.id);});drawRows();}
function toggleChat(){document.getElementById("chatWin").classList.toggle("hidden");document.getElementById("chatFab").classList.toggle("hidden");}
function toggleDensity(){localStorage.setItem("ui_density",document.body.classList.contains("compact")?"comfortable":"compact");applyPrefs();}
function toggleSel(id,el){if(el.checked)selected.add(id);else selected.delete(id);syncChkAll();updateBulk();}
function toggleTheme(){localStorage.setItem("ui_theme",document.body.classList.contains("dark")?"light":"dark");applyPrefs();}
function updateRail(){document.querySelectorAll(".formrail .rl").forEach((rl,i)=>{const sec=WIZ[i];if(!sec)return;
  const done=sec.f.every(([k,l,t,req])=>{const el=document.getElementById("wz_"+k);return !req||(el&&el.value);});rl.classList.toggle("done",done);
  const c=rl.querySelector(".rd");if(c)c.innerHTML=done?svgIco("tick",13):(i+1);});}
function vAudit(m){
  const a=DB.audit();
  m.innerHTML=head("Audit Log","Full activity and security logging (all events)","Audit Log");
  m.innerHTML+='<div class="card panel"><table class="tbl"><thead><tr><th>Timestamp</th><th>User</th><th>Role</th><th>Action</th><th>Detail</th><th>IP</th></tr></thead><tbody>'+
    (a.length?a.map(x=>`<tr><td style="font-size:12px">${x.ts}</td><td>${x.user}</td><td><span class="pill">${x.role}</span></td><td><b>${x.action}</b></td><td class="muted">${x.detail}</td><td style="font-size:12px">${x.ip}</td></tr>`).join(""):'<tr><td colspan="6" class="muted" style="text-align:center;padding:24px">No activity yet.</td></tr>')+
    '</tbody></table></div>';
}
function vCMS(m){
  const s=DB.settings();
  m.innerHTML=head("Content Management System","Web settings &amp; database administration","CMS");
  m.innerHTML+=`<div class="row2">
    <div class="card panel"><h3><span class="bar"></span> Web Settings</h3>
      <div class="field"><label>Portal Title</label><input id="cms_title" value="${s.title}"></div>
      <div class="field" style="margin-top:12px"><label>Home Banner Text</label><input id="cms_banner" value="${s.banner}"></div>
      <div class="field" style="margin-top:12px"><label>Theme <span class="muted" style="font-weight:400;text-transform:none;letter-spacing:0">(applies instantly)</span></label><select id="cms_theme" onchange="applyTheme(this.value)">${Object.keys(PALETTES).map(t=>`<option${t===currentPal()?' selected':''}>${t}</option>`).join("")}</select></div>
      <button class="btn primary" style="margin-top:16px" onclick="saveCms()">Save Settings</button>
    </div>
    <div class="card panel"><h3><span class="bar"></span> Database Update</h3>
      <div style="display:flex;flex-direction:column;gap:10px">
        ${dbRow("Encryption","AES-256 (active)","var(--ok)")}
        ${dbRow("Normalisation","3NF / BCNF","var(--ok)")}
        ${dbRow("Backup Schedule",s.backup,"var(--info)")}
        ${dbRow("Registered Users","1,000 / 10,000 capacity","var(--warn)")}
        ${dbRow("Data Fields","175 / 500 max","var(--info)")}
      </div>
      <div style="display:flex;gap:11px;margin-top:16px;flex-wrap:wrap">
        <button class="btn gold" onclick="runBackup()">${svgIco("save",13)} Run Backup Now</button>
        <button class="btn" onclick="toast('Migration module: V1.0 to V2.0 dry-run OK (encrypted)')">${svgIco("refresh",13)} Test V1 to V2 Migration</button>
      </div>
    </div>
  </div>`;
}
function val(id){return document.getElementById(id).value;}
function validateField(k){const hid=document.getElementById("wz_"+k);if(!hid)return true;const field=hid.closest(".field");const meta=fieldMeta(k);if(!field||!meta)return true;
  const req=meta[3],val=hid.value;field.classList.remove("ok","bad");const fm=field.querySelector(".fmsg");
  if(req&&!val){field.classList.add("bad");if(fm)fm.textContent=meta[1]+" is required";updateRail();return false;}
  if(val)field.classList.add("ok");updateRail();return true;}
function verifyOtp(){
  const code=[...document.querySelectorAll("#otpBoxes input")].map(i=>i.value).join("");
  if(code.replace(/\D/g,"").length<6){toast("Enter all 6 digits of the IACA token","err");return;}
  SESSION={role:pickedRole,
    name:pickedRole==="Super Admin"?"Col A. Verma (Super Admin)":pickedRole==="Admin"?"Maj S. Rao (Admin)":"Sub R. Kumar (User)",
    ip:rndIp()};
  document.getElementById("loginView").classList.add("hidden");
  document.getElementById("appView").classList.remove("hidden");
  document.getElementById("uName").textContent=SESSION.name;
  document.getElementById("uRole").textContent=SESSION.role;
  document.getElementById("uAv").textContent=SESSION.name.replace(/^(Col|Maj|Sub)\s/,'')[0];
  log("LOGIN","Authenticated via SAML 2.0 + IACA 2FA");
  buildNav();go("dashboard");
  toast("Access granted: "+SESSION.role);
  initChat();applyPrefs();resetIdle();
}
function wrapLabel(s,maxLen){
  s=String(s);if(s.length<=maxLen)return[s];
  const words=s.split(/\s+/);if(words.length===1)return[s];
  let l1="",l2="";
  for(const w of words){if(!l2&&(l1?l1+" "+w:w).length<=maxLen){l1=l1?l1+" "+w:w;}else{l2=l2?l2+" "+w:w;}}
  return l2?[l1,l2]:[l1];
}
