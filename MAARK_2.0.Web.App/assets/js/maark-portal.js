/* ================= DATA ================= */
const KEY="maark_portal_v8";
const STATUSES=["Draft","In Progress","Resolved","Closed"];
const COMMANDS=["Northern","Western","Central","Eastern","Southern","South Western"];
const OFFICERS={
 "IC-50231":{rank:"Maj",name:"S. Rao",unit:"12 RAJRIF",command:"Western",salary:128000},
 "IC-61144":{rank:"Capt",name:"J. Singh",unit:"7 SIKH",command:"Northern",salary:96000},
 "JC-330219":{rank:"Sub",name:"K. Lal",unit:"18 GRENADIERS",command:"Central",salary:74000},
 "IC-58890":{rank:"Maj",name:"A. Kumar",unit:"4 MADRAS",command:"Southern",salary:121000},
 "JC-441027":{rank:"Hav",name:"P. Yadav",unit:"2 BIHAR",command:"Eastern",salary:61000}
};
function seed(){
 const now=Date.now();
 const mk=(id,applicant,relation,armyNo,category,maint,status,command,notings,daysAgo,extra)=>{
   const o=OFFICERS[armyNo]||{rank:"",name:"",unit:"",command:command,salary:0};
   return Object.assign({id,applicant,relation,ageNow:"48",ageFiling:"46",contact:"98765xxxxx",aadhaar:"XXXX-XXXX-1234",
     address:"Village & PO, District, State", armyNo, rank:o.rank, memberName:o.name, unit:o.unit,
     command:o.command||command, salary:o.salary, category, type:"Spouse maintenance", maintenance:maint,
     appDate:"10-Aug-2026", filedDate:"12-Aug-2026", status, guardian:"", parent:"Smt. Kamla Devi",
     spouseEmployment:"Unemployed", dependentCard:"DC-"+id.slice(-4), csdCard:"CSD-"+id.slice(-4), employability:"No",
     docs:["Proof of marriage.pdf","Affidavit.pdf"], notings:notings||[], history:[{stage:"Unit filed",by:"Unit clerk",when:"12-Aug-2026"}],
     approved:false, subJudice:false, court:null, resolution:null,
     updated:fmtDate(new Date(now-daysAgo*864e5))},extra||{});
 };
 const cases=[
   mk("MNT/2026/0142","Smt. A. Devi","Wife","IC-50231","Maintenance","25%","In Progress","Western",
     [{by:"Brigade Commander",role:"Approver",hq:false,text:"Verification complete. Marriage proof and affidavit are in order.",colour:"yellow",when:"28-Aug-2026"},
      {by:"Command (Western)",role:"Command Admin",hq:false,text:"Recommend approval. Maintenance proposed at 25 percent of salary.",colour:"yellow",when:"01-Sep-2026"}],5,
     {approved:true,history:[{stage:"Unit filed",by:"Unit clerk",when:"12-Aug-2026"},{stage:"Command approved",by:"Col A. Verma",when:"28-Aug-2026"}]}),
   mk("MNT/2026/0139","Smt. K. Bai","Mother","JC-330219","Maintenance","₹ 9,000","In Progress","Central",[],5),
   mk("MNT/2026/0137","Smt. R. Kaur","Wife","IC-61144","Maintenance","₹ 12,000","In Progress","Northern",
     [{by:"Brigade Commander",role:"Approver",hq:false,text:"Matter is before the civil court, hold pending order.",colour:"yellow",when:"30-Aug-2026"}],6,
     {approved:true,subJudice:true,
      court:{court:"High Court",courtName:"High Court, Punjab and Haryana",caseNo:"CRM/88/2026",since:"18-Aug-2026",lastHearing:"02-Sep-2026",nextHearing:"24-Sep-2026",disposed:false,judgedOn:"",finalOrder:"",
       events:[{kind:"referred",when:"18-Aug-2026",court:"District Court",courtName:"District Court, Jalandhar",by:"Col A. Verma",note:"Court case number MC/412/2026."},
        {kind:"hearing",when:"26-Aug-2026",court:"District Court",courtName:"District Court, Jalandhar",by:"Col A. Verma",note:"Notice issued to the service member. Reply sought on the maintenance claim."},
        {kind:"hearing",when:"02-Sep-2026",court:"District Court",courtName:"District Court, Jalandhar",by:"Col A. Verma",note:"Reply taken on record. Matter listed for arguments."},
        {kind:"transfer",when:"04-Sep-2026",court:"High Court",courtName:"High Court, Punjab and Haryana",by:"Col A. Verma",note:"Moved from District Court, Jalandhar. Transfer petition allowed on the applicant's plea."}]},
      history:[{stage:"Unit filed",by:"Unit clerk",when:"12-Aug-2026"},{stage:"Command approved",by:"Col A. Verma",when:"26-Aug-2026"},{stage:"Marked sub-judice",by:"Col A. Verma",when:"30-Aug-2026",note:"District Court, Jalandhar"}]}),
   mk("MNT/2026/0131","Smt. P. Yadav","Wife","JC-441027","Maintenance","20%","In Progress","Eastern",[],7),
   mk("MNT/2026/0128","Smt. L. Bai","Mother","IC-58890","Maintenance","20%","Closed","Southern",
     [{by:"Command (Southern)",role:"Command Admin",hq:false,text:"Entitlement verified at 20 percent. Recommended for sanction.",colour:"green",when:"21-Aug-2026"},
      {by:"ADG HR",role:"Super Admin",hq:true,text:"Approved and disbursed. Case closed.",colour:"green",when:"25-Aug-2026"}],13,
     {approved:true,resolution:{outcome:"Closed",reason:"Maintenance approved at 20 percent and disbursed in full. Nothing further is due to the applicant.",by:"Col A. Verma",when:"25-Aug-2026"},
      history:[{stage:"Unit filed",by:"Unit clerk",when:"12-Aug-2026"},{stage:"Command approved",by:"Col A. Verma",when:"20-Aug-2026"},{stage:"Case closed",by:"Col A. Verma",when:"25-Aug-2026",note:"Maintenance approved at 20 percent and disbursed in full."}]}),
   mk("MNT/2026/0124","Smt. S. Devi","Wife","IC-58890","Maintenance","15%","Resolved","Southern",[],16,
     {approved:true,resolution:{outcome:"Resolved",reason:"Entitlement settled at 15 percent of salary. The disbursement order is issued and the first credit is awaited before closure.",by:"Col A. Verma",when:"22-Aug-2026"},
      history:[{stage:"Unit filed",by:"Unit clerk",when:"12-Aug-2026"},{stage:"Command approved",by:"Col A. Verma",when:"18-Aug-2026"},{stage:"Case resolved",by:"Col A. Verma",when:"22-Aug-2026",note:"Entitlement settled at 15 percent of salary."}]}),
   mk("MNT/2026/0121","Smt. M. Devi","Mother","IC-61144","Maintenance","","Draft","Northern",[],1)
 ];
 const audit=[
   {ts:"07-Sep-2026, 11:42",user:"Maj S. Rao",role:"Command Admin",action:"APPROVE_CASE",detail:"Approved MNT/2026/0139",ip:"10.0.4.21"},
   {ts:"07-Sep-2026, 11:20",user:"Sub R. Kumar",role:"Unit User",action:"CREATE_CASE",detail:"Registered MNT/2026/0142",ip:"10.0.7.14"},
   {ts:"06-Sep-2026, 17:03",user:"Col A. Verma",role:"Super Admin",action:"GENERATE_REPORT",detail:"Case Summary Report",ip:"10.0.1.9"}
 ];
 const day=n=>fmtDate(new Date(now-n*864e5));
 const kb=[
  {id:"KB-0108",title:"Who is eligible for maintenance",cat:"Eligibility",source:"Policy set, clause 2.1",status:"Published",
   tags:"eligible eligibility dependent wife mother child employable claim",
   body:"Maintenance is payable to an eligible dependent of a serving member: the wife, the mother or a child. The Army steps in within 3 years of the claim. If the applicant is employable, maintenance is not allowed. Eligibility is checked against the dependent card and the service record before the case leaves the unit.",updated:day(3)},
  {id:"KB-0107",title:"The 180 day resolution window",cat:"Policy",source:"Policy set, clause 4.2",status:"Published",
   tags:"180 days limit deadline overdue window timeline resolve",
   body:"A case must be resolved within 180 days of registration. The clock starts on the filed date, not the application date. The Registered Cases screen shows the days left on each open case. A case that crosses the window stays open and is reported to Command every month until it is closed.",updated:day(4)},
  {id:"KB-0106",title:"Approval workflow from unit to headquarters",cat:"Workflow",source:"Policy set, clause 3",status:"Published",
   tags:"workflow approval process steps chain command brigade adg pending",
   body:"The unit files the case. The Brigade Commander approves it first. Approval then moves one level up, and ADG HR keeps oversight throughout. A case sent back returns to the unit with the reason on the file. Nothing is disbursed until the approval chain is complete.",updated:day(6)},
  {id:"KB-0105",title:"How to add a noting to a case",cat:"FAQ",source:"User guide, section 5",status:"Published",
   tags:"noting note remark comment colour yellow green verdict",
   body:"Open the case, go to the Notings tab and write your remark. A noting raised anywhere in the chain of command is yellow. When headquarters gives its verdict that noting is green, and every earlier noting on the case turns green with it. A noting cannot be deleted once saved.",updated:day(8)},
  {id:"KB-0104",title:"Sub-judice cases and court proceedings",cat:"Policy",source:"Policy set, clause 6.4",status:"Published",
   tags:"sub-judice subjudice court hearing judgement transfer stay legal",
   body:"A case before a civil or criminal court is marked sub-judice. No maintenance decision is taken while the matter is held in court. Every hearing, court transfer and the final judgement is recorded on the case in the Sub-judice tab, so the proceedings trail stays with the file.",updated:day(9)},
  {id:"KB-0103",title:"Roles and what each role can see",cat:"Security",source:"Access control matrix",status:"Published",
   tags:"role access permission scope security visible command see data",
   body:"A Unit User sees the cases of the unit. A Command Admin sees every case of the command. The Super Admin sees all commands and the content and audit screens. Roles and command scope are set in Army IAM, not in this portal. Every look-up is written to the audit log.",updated:day(11)},
  {id:"KB-0102",title:"Documents required with a maintenance claim",cat:"FAQ",source:"User guide, section 2",status:"Draft",
   tags:"document upload proof marriage affidavit attachment file",
   body:"Proof of marriage and a signed affidavit are required with every claim. A dependent card and a CSD card number are recorded where they exist. Documents are held encrypted and opened in the read-only viewer, which stamps the viewer, the IP and the time on each page.",updated:day(2)},
  {id:"KB-0101",title:"Rate of maintenance and how it is worked out",cat:"Policy",source:"Policy set, clause 2.4",status:"Draft",
   tags:"rate percent salary amount calculation quantum entitlement",
   body:"Maintenance is set either as a share of the basic pay of the member or as a fixed monthly amount. The recommended share is entered by the command and sanctioned by headquarters. The sanctioned figure is stamped on the case summary and carried into the disbursement order.",updated:day(5)}
 ];
 const cms={portalTitle:"MAARK 2.0",banner:"Maintenance allowance, digitised",primary:"Army Green",notice:"Cases are to be resolved within 180 days.",
   pages:["Home","About ADG HR","Policy and eligibility","Contact","FAQ"]};
 return {cases,audit,cms,kb,seq:143};
}
const DB={
 load(){try{return JSON.parse(localStorage.getItem(KEY))||null}catch(e){return null}},
 save(d){try{localStorage.setItem(KEY,JSON.stringify(d))}catch(e){}},
 get(){let d=this.load();if(!d){d=seed();this.save(d)}return d},
 set(d){this.save(d)}
};
let STATE=DB.get();
let SESSION=null;

/* ================= PRIMARY COLOUR ================= */
const PALETTE={"Army Green":"#184A2C","Deep Navy":"#143A6B","Regimental Maroon":"#6B1F2A","Teal":"#0F4C4A","Indigo":"#2E2F7A","Bronze":"#6B4A16","Violet":"#4B2A7A","Graphite":"#2B3138"};
function hx(r,g,b){const c=n=>Math.max(0,Math.min(255,Math.round(n))).toString(16).padStart(2,'0');return '#'+c(r)+c(g)+c(b);}
function applyPrimary(name){const base=PALETTE[name]||PALETTE["Army Green"];
 const r=parseInt(base.substr(1,2),16),g=parseInt(base.substr(3,2),16),b=parseInt(base.substr(5,2),16);
 const tint=p=>hx(r*p+255*(1-p),g*p+255*(1-p),b*p+255*(1-p)),scale=f=>hx(r*f,g*f,b*f);
 const s=document.documentElement.style;
 s.setProperty('--primary',base);
 [50,30,20,15,10,5].forEach(p=>s.setProperty('--primary-'+p,tint(p/100)));
 s.setProperty('--primary-hover',scale(1.34));s.setProperty('--primary-pressed',scale(.66));}
applyPrimary(STATE.cms&&STATE.cms.primary);

/* ================= AUTH ================= */
const EMAIL_RE=/^[^@\s]+@[^@\s]+\.[^@\s]+$/;
function emailGate(){document.getElementById('continueBtn').disabled=!EMAIL_RE.test(document.getElementById('loginEmail').value.trim());}
function fErr(id,msg){const e=document.getElementById(id);e.textContent=msg||'';e.classList.toggle('on',!!msg);}
function goPassword(){
 const em=document.getElementById('loginEmail'),v=em.value.trim();
 if(!EMAIL_RE.test(v)){fErr('emailErr','Enter a valid service email, for example name@army.mil.in');em.focus();return;}
 fErr('emailErr','');
 document.getElementById('idEmail').textContent=v;
 document.getElementById('idAv').textContent=v[0];
 document.getElementById('step1').classList.add('hidden');
 document.getElementById('step2').classList.remove('hidden');
 document.getElementById('loginPwd').focus();
}
function backToEmail(){
 document.getElementById('step2').classList.add('hidden');
 document.getElementById('step1').classList.remove('hidden');
 document.getElementById('loginPwd').value='';fErr('pwdErr','');
 document.getElementById('loginEmail').focus();emailGate();
}
/* ===== Iconsax (Linear) icon set - paths inlined, no CDN ===== */
const ICONS={
 AddCircle:"<path d='M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10ZM8 12h8M12 16V8'/>",
 ArrowSwapVertical:"<path d='M9.57 5.93 6.14 2.5 2.71 5.93M6.14 21.5v-19M14.43 18.07l3.43 3.43 3.43-3.43M17.86 2.5v19'/>",
 ArrowUp2:"<path d='M19.92 15.05l-6.52-6.52c-.77-.77-2.03-.77-2.8 0l-6.52 6.52'/>",
 ArrowDown2:"<path d='M19.92 8.95l-6.52 6.52c-.77.77-2.03.77-2.8 0L4.08 8.95'/>",
 ArrowRight2:"<path d='M8.91 19.92l6.52-6.52c.77-.77.77-2.03 0-2.8L8.91 4.08'/>",
 ArrowLeft2:"<path d='M15 19.92L8.48 13.4c-.77-.77-.77-2.03 0-2.8L15 4.08'/>",
 Tick:"<path d='m7.75 12 2.83 2.83 5.67-5.66'/>",
 DocumentUpload:"<path d='M9 17v-6l-2 2M9 11l2 2'/><path d='M22 10v5c0 5-2 7-7 7H9c-5 0-7-2-7-7V9c0-5 2-7 7-7h5'/><path d='M22 10h-4c-3 0-4-1-4-4V2l8 8Z'/>",
 Book1:"<path d='M22 16.74V4.67c0-1.2-.98-2.09-2.17-1.99h-.06c-2.1.18-5.29 1.25-7.07 2.37l-.17.11c-.29.18-.77.18-1.06 0l-.25-.15C9.44 3.9 6.26 2.84 4.16 2.67 2.97 2.57 2 3.47 2 4.66v12.08c0 .96.78 1.86 1.74 1.98l.29.04c2.17.29 5.52 1.39 7.44 2.44l.04.02c.27.15.7.15.96 0 1.92-1.06 5.28-2.17 7.46-2.46l.33-.04c.96-.12 1.74-1.02 1.74-1.98ZM12 5.49v15M7.75 8.49H5.5M8.5 11.49h-3'/>",
 Chart21:"<path d='M7 10.74v3.2M12 9v6.68M17 10.74v3.2M9 22h6c5 0 7-2 7-7V9c0-5-2-7-7-7H9C4 2 2 4 2 9v6c0 5 2 7 7 7Z'/>",
 ClipboardText:"<path d='M8 12.2h7M8 16.2h4.38M10 6h4c2 0 2-1 2-2 0-2-1-2-2-2h-4C9 2 8 2 8 4s1 2 2 2Z'/><path d='M16 4.02c3.33.18 5 1.41 5 5.98v6c0 4-1 6-6 6H9c-5 0-6-2-6-6v-6c0-4.56 1.67-5.8 5-5.98'/>",
 ClipboardTick:"<path d='m9.31 14.7 1.5 1.5 4-4'/><path d='M10 6h4c2 0 2-1 2-2 0-2-1-2-2-2h-4C9 2 8 2 8 4s1 2 2 2Z'/><path d='M16 4.02c3.33.18 5 1.41 5 5.98v6c0 4-1 6-6 6H9c-5 0-6-2-6-6v-6c0-4.56 1.67-5.8 5-5.98'/>",
 Clock:"<path d='M22 12c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2s10 4.48 10 10Z'/><path d='m15.71 15.18-3.1-1.85c-.54-.32-.98-1.09-.98-1.72v-4.1'/>",
 CloseCircle:"<path d='M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10ZM9.17 14.83l5.66-5.66M14.83 14.83 9.17 9.17'/>",
 DocumentDownload:"<path d='M9 11v6l2-2M9 17l-2-2'/><path d='M22 10v5c0 5-2 7-7 7H9c-5 0-7-2-7-7V9c0-5 2-7 7-7h5'/><path d='M22 10h-4c-3 0-4-1-4-4V2l8 8Z'/>",
 DocumentText:"<path d='M21 7v10c0 3-1.5 5-5 5H8c-3.5 0-5-2-5-5V7c0-3 1.5-5 5-5h8c3.5 0 5 2 5 5Z'/><path d='M14.5 4.5v2c0 1.1.9 2 2 2h2M8 13h4M8 17h8'/>",
 Edit2:"<path d='m13.26 3.6-8.21 8.69c-.31.33-.61.98-.67 1.43l-.37 3.24c-.13 1.17.71 1.97 1.87 1.77l3.22-.55c.45-.08 1.08-.41 1.39-.75l8.21-8.69c1.42-1.5 2.06-3.21-.15-5.3-2.2-2.07-3.87-1.34-5.29.16Z'/><path d='M11.89 5.05a6.126 6.126 0 0 0 5.45 5.15M3 22h18'/>",
 Element3:"<path d='M22 8.52V3.98C22 2.57 21.36 2 19.77 2h-4.04c-1.59 0-2.23.57-2.23 1.98v4.53c0 1.42.64 1.98 2.23 1.98h4.04c1.59.01 2.23-.56 2.23-1.97ZM22 19.77v-4.04c0-1.59-.64-2.23-2.23-2.23h-4.04c-1.59 0-2.23.64-2.23 2.23v4.04c0 1.59.64 2.23 2.23 2.23h4.04c1.59 0 2.23-.64 2.23-2.23ZM10.5 8.52V3.98C10.5 2.57 9.86 2 8.27 2H4.23C2.64 2 2 2.57 2 3.98v4.53c0 1.42.64 1.98 2.23 1.98h4.04c1.59.01 2.23-.56 2.23-1.97ZM10.5 19.77v-4.04c0-1.59-.64-2.23-2.23-2.23H4.23c-1.59 0-2.23.64-2.23 2.23v4.04C2 21.36 2.64 22 4.23 22h4.04c1.59 0 2.23-.64 2.23-2.23Z'/>",
 Eye:"<path d='M15.58 12c0 1.98-1.6 3.58-3.58 3.58S8.42 13.98 8.42 12s1.6-3.58 3.58-3.58 3.58 1.6 3.58 3.58Z'/><path d='M12 20.27c3.53 0 6.82-2.08 9.11-5.68.9-1.41.9-3.78 0-5.19-2.29-3.6-5.58-5.68-9.11-5.68-3.53 0-6.82 2.08-9.11 5.68-.9 1.41-.9 3.78 0 5.19 2.29 3.6 5.58 5.68 9.11 5.68Z'/>",
 EyeSlash:"<path d='m14.53 9.47-5.06 5.06a3.576 3.576 0 1 1 5.06-5.06Z'/><path d='M17.82 5.77C16.07 4.45 14.07 3.73 12 3.73c-3.53 0-6.82 2.08-9.11 5.68-.9 1.41-.9 3.78 0 5.19.79 1.24 1.71 2.31 2.71 3.17M8.42 19.53c1.14.48 2.35.74 3.58.74 3.53 0 6.82-2.08 9.11-5.68.9-1.41.9-3.78 0-5.19-.33-.52-.69-1.01-1.06-1.47'/><path d='M15.51 12.7a3.565 3.565 0 0 1-2.82 2.82'/><path d='M9.47 14.53 2 22M22 2l-7.47 7.47'/>",
 InfoCircle:"<path d='M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10ZM12 8v5'/><path d='M11.995 16h.009'/>",
 Judge:"<path d='m20.01 18.51-4.95-4.95M15.06 13.56l-3.54 3.54c-.78.78-2.05.78-2.83 0l-4.24-4.24c-.78-.78-.78-2.05 0-2.83l7.07-7.07c.78-.78 2.05-.78 2.83 0l4.24 4.24c.78.78.78 2.05 0 2.83l-3.53 3.53ZM2 21h6M6.56 7.92l7.07 7.07'/>",
 LogoutCurve:"<path d='M8.9 7.56c.31-3.6 2.16-5.07 6.21-5.07h.13c4.47 0 6.26 1.79 6.26 6.26v6.52c0 4.47-1.79 6.26-6.26 6.26h-.13c-4.02 0-5.87-1.45-6.2-4.99M15 12H3.62M5.85 8.65L2.5 12l3.35 3.35'/>",
 Magicpen:"<path d='M3.5 20.5c.83.83 2.17.83 3 0l13-13c.83-.83.83-2.17 0-3-.83-.83-2.17-.83-3 0l-13 13c-.83.83-.83 2.17 0 3zM18.01 8.99l-3-3'/><path d='M8.5 2.44L10 2l-.44 1.5L10 5l-1.5-.44L7 5l.44-1.5L7 2l1.5.44zM4.5 8.44L6 8l-.44 1.5L6 11l-1.5-.44L3 11l.44-1.5L3 8l1.5.44zM19.5 13.44L21 13l-.44 1.5L21 16l-1.5-.44L18 16l.44-1.5L18 13l1.5.44z'/>",
 Messages2:"<path d='m18.47 16.83.39 3.16c.1.83-.79 1.41-1.5.98l-4.19-2.49c-.46 0-.91-.03-1.35-.09A4.86 4.86 0 0 0 13 15.23c0-2.84-2.46-5.14-5.5-5.14-1.16 0-2.23.33-3.12.91-.03-.25-.04-.5-.04-.76C4.34 5.69 8.29 2 13.17 2S22 5.69 22 10.24c0 2.7-1.39 5.09-3.53 6.59Z'/><path d='M13 15.23c0 1.19-.44 2.29-1.18 3.16-.99 1.2-2.56 1.97-4.32 1.97l-2.61 1.55c-.44.27-1-.1-.94-.61l.25-1.97C2.86 18.4 2 16.91 2 15.23c0-1.76.94-3.31 2.38-4.23.89-.58 1.96-.91 3.12-.91 3.04 0 5.5 2.3 5.5 5.14Z'/>",
 NoteText:"<path d='M8 2v3M16 2v3M21 8.5V17c0 3-1.5 5-5 5H8c-3.5 0-5-2-5-5V8.5c0-3 1.5-5 5-5h8c3.5 0 5 2 5 5ZM8 11h8M8 16h4'/>",
 Printer:"<path d='M7.25 7h9.5V5c0-2-.75-3-3-3h-3.5c-2.25 0-3 1-3 3v2ZM16 15v4c0 2-1 3-3 3h-2c-2 0-3-1-3-3v-4h8Z'/><path d='M21 10v5c0 2-1 3-3 3h-2v-3H8v3H6c-2 0-3-1-3-3v-5c0-2 1-3 3-3h12c2 0 3 1 3 3ZM17 15H7M7 11h3'/>",
 Profile:"<path d='M12.16 10.87c-.1-.01-.22-.01-.33 0a4.42 4.42 0 0 1-4.27-4.43C7.56 3.99 9.54 2 12 2a4.435 4.435 0 0 1 .16 8.87ZM7.16 14.56c-2.42 1.62-2.42 4.26 0 5.87 2.75 1.84 7.26 1.84 10.01 0 2.42-1.62 2.42-4.26 0-5.87-2.74-1.83-7.25-1.83-10.01 0Z'/>",
 Refresh2:"<path d='M14.55 21.67C18.84 20.54 22 16.64 22 12c0-5.52-4.44-10-10-10C5.33 2 2 7.56 2 7.56m0 0V3m0 4.56H6.44'/><path d='M2 12c0 5.52 4.48 10 10 10'/>",
 SearchNormal1:"<path d='M11.5 21a9.5 9.5 0 1 0 0-19 9.5 9.5 0 0 0 0 19ZM22 22l-2-2'/>",
 Send2:"<path d='m7.4 6.32 8.49-2.83c3.81-1.27 5.88.81 4.62 4.62l-2.83 8.49c-1.9 5.71-5.02 5.71-6.92 0l-.84-2.52-2.52-.84c-5.71-1.9-5.71-5.01 0-6.92ZM10.11 13.65l3.58-3.59'/>",
 Setting2:"<path d='M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z'/><path d='M2 12.88v-1.76c0-1.04.85-1.9 1.9-1.9 1.81 0 2.55-1.28 1.64-2.85-.52-.9-.21-2.07.7-2.59l1.73-.99c.79-.47 1.81-.19 2.28.6l.11.19c.9 1.57 2.38 1.57 3.29 0l.11-.19c.47-.79 1.49-1.07 2.28-.6l1.73.99c.91.52 1.22 1.69.7 2.59-.91 1.57-.17 2.85 1.64 2.85 1.04 0 1.9.85 1.9 1.9v1.76c0 1.04-.85 1.9-1.9 1.9-1.81 0-2.55 1.28-1.64 2.85.52.91.21 2.07-.7 2.59l-1.73.99c-.79.47-1.81.19-2.28-.6l-.11-.19c-.9-1.57-2.38-1.57-3.29 0l-.11.19c-.47.79-1.49 1.07-2.28.6l-1.73-.99a1.899 1.899 0 0 1-.7-2.59c.91-1.57.17-2.85-1.64-2.85-1.05 0-1.9-.86-1.9-1.9Z'/>",
 ShieldTick:"<path d='M10.49 2.23 5.5 4.11c-1.15.43-2.09 1.79-2.09 3.01v7.43c0 1.18.78 2.73 1.73 3.44l4.3 3.21c1.41 1.06 3.73 1.06 5.14 0l4.3-3.21c.95-.71 1.73-2.26 1.73-3.44V7.12c0-1.23-.94-2.59-2.09-3.02l-4.99-1.87c-.85-.31-2.21-.31-3.04 0Z'/><path d='m9.05 11.87 1.61 1.61 4.3-4.3'/>",
 TickCircle:"<path d='M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10Z'/><path d='m7.75 12 2.83 2.83 5.67-5.66'/>",
 Trash:"<path d='M21 5.98c-3.33-.33-6.68-.5-10.02-.5-1.98 0-3.96.1-5.94.3L3 5.98M8.5 4.97l.22-1.31C8.88 2.71 9 2 10.69 2h2.62c1.69 0 1.82.75 1.97 1.67l.22 1.3M18.85 9.14l-.65 10.07C18.09 20.78 18 22 15.21 22H8.79C6 22 5.91 20.78 5.8 19.21L5.15 9.14M10.33 16.5h3.33M9.5 12.5h5'/>",
 Verify:"<path d='m8.38 12 2.41 2.42 4.83-4.84'/><path d='M10.75 2.45c.69-.59 1.82-.59 2.52 0l1.58 1.36c.3.26.86.47 1.26.47h1.7c1.06 0 1.93.87 1.93 1.93v1.7c0 .39.21.96.47 1.26l1.36 1.58c.59.69.59 1.82 0 2.52l-1.36 1.58c-.26.3-.47.86-.47 1.26v1.7c0 1.06-.87 1.93-1.93 1.93h-1.7c-.39 0-.96.21-1.26.47l-1.58 1.36c-.69.59-1.82.59-2.52 0l-1.58-1.36c-.3-.26-.86-.47-1.26-.47H6.18c-1.06 0-1.93-.87-1.93-1.93V16.1c0-.39-.21-.95-.46-1.25l-1.35-1.59c-.58-.69-.58-1.81 0-2.5l1.35-1.59c.25-.3.46-.86.46-1.25V6.2c0-1.06.87-1.93 1.93-1.93h1.73c.39 0 .96-.21 1.26-.47l1.58-1.35Z'/>",
};
function ic(n,s){return '<svg class="ix" viewBox="0 0 24 24" width="'+(s||18)+'" height="'+(s||18)+'" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">'+(ICONS[n]||'')+'</svg>';}
const BICONS={
 Profile:"<path d='M12 2c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5Z'/><path opacity='.4' d='M17.08 14.15c-2.79-1.86-7.34-1.86-10.15 0-1.27.85-1.97 2-1.97 3.23s.7 2.37 1.96 3.21C8.32 21.53 10.16 22 12 22s3.68-.47 5.08-1.41c1.26-.85 1.96-1.99 1.96-3.23s-.7-2.37-1.96-3.21Z'/>",
 NoteText:"<path opacity='.4' d='M21 7v10c0 3-1.5 5-5 5H8c-3.5 0-5-2-5-5V7c0-3 1.5-5 5-5h8c3.5 0 5 2 5 5Z'/><path d='M16.5 8.75h-9a.75.75 0 0 1 0-1.5h9a.75.75 0 0 1 0 1.5ZM14.5 12.75h-7a.75.75 0 0 1 0-1.5h7a.75.75 0 0 1 0 1.5ZM11.5 16.75h-4a.75.75 0 0 1 0-1.5h4a.75.75 0 0 1 0 1.5Z'/>",
 Magicpen:"<path opacity='.4' d='M13.83 6.01 6.01 13.83c-.32.32-.63.94-.69 1.39l-.42 2.96c-.16 1.07.6 1.82 1.66 1.67l2.96-.42c.44-.06 1.06-.37 1.39-.69l7.82-7.82-4.9-4.91Z'/><path d='m20.4 7.7-1.24 1.24-4.9-4.9L15.5 2.8c1.02-1.02 2.14-.9 3.06.02l1.83 1.83c.93.92 1.04 2.04.01 3.05ZM4.4 6.85l.83.28c.19.06.33.2.39.39l.28.83c.7.22.39.22.46 0l.28-.83c.06-.19.2-.33.39-.39l.83-.28c.22-.7.22-.39 0-.46l-.83-.28a.62.62 0 0 1-.39-.39l-.28-.83c-.07-.22-.39-.22-.46 0l-.28.83c-.6.19-.2.33-.39.39l-.83.28c-.22.7-.22.39 0 .46Z'/>",
 AiStar:"<path d='M11.05 3.4a1 1 0 0 1 1.9 0l1.53 4.12 4.12 1.53a1 1 0 0 1 0 1.9l-4.12 1.53-1.53 4.12a1 1 0 0 1-1.9 0l-1.53-4.12-4.12-1.53a1 1 0 0 1 0-1.9l4.12-1.53 1.53-4.12Z'/><path opacity='.4' d='M17.63 15.19a.6.6 0 0 1 1.14 0l.55 1.49 1.49.55a.6.6 0 0 1 0 1.14l-1.49.55-.55 1.49a.6.6 0 0 1-1.14 0l-.55-1.49-1.49-.55a.6.6 0 0 1 0-1.14l1.49-.55.55-1.49Z'/>",
 Element3:"<path d='M9 2H5C3.34 2 2 3.34 2 5v4c0 1.66 1.34 3 3 3h4c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3ZM19 12h-4c-1.66 0-3 1.34-3 3v4c0 1.66 1.34 3 3 3h4c1.66 0 3-1.34 3-3v-4c0-1.66-1.34-3-3-3Z'/><path opacity='.4' d='M19 2h-4c-1.66 0-3 1.34-3 3v4c0 1.66 1.34 3 3 3h4c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3ZM9 12H5c-1.66 0-3 1.34-3 3v4c0 1.66 1.34 3 3 3h4c1.66 0 3-1.34 3-3v-4c0-1.66-1.34-3-3-3Z'/>"
};
function bic(n,s){return '<svg class="ix bx" viewBox="0 0 24 24" width="'+(s||18)+'" height="'+(s||18)+'" fill="currentColor">'+(BICONS[n]||'')+'</svg>';}
const EYE=ic('Eye',20),EYE_OFF=ic('EyeSlash',20);
document.getElementById('searchIcon').innerHTML=ic('SearchNormal1',17);
document.querySelectorAll('[data-pmic]').forEach(e=>{const k=e.dataset.pmic,z=e.classList.contains('pm-chev')?15:18;e.innerHTML=BICONS[k]?bic(k,z):ic(k,z);});
document.getElementById('aiFab').innerHTML=bic('AiStar',24);
document.getElementById('pmSw').innerHTML=Object.keys(PALETTE).map(k=>'<span class="sw'+(k===STATE.cms.primary?' on':'')+'" data-k="'+k+'" title="'+esc(k)+'" style="background:'+PALETTE[k]+'" onclick="setPrimary(\''+k+'\')"></span>').join('');
function setPrimary(k){STATE.cms.primary=k;applyPrimary(k);DB.set(STATE);previewPrimary(k,1);if(CURRENT==='cms')go('cms');}
function toggleProfileMenu(ev){
 if(ev)ev.stopPropagation();
 const m=document.getElementById('pmenu'),open=m.classList.toggle('hidden');
 document.getElementById('uChip').setAttribute('aria-expanded',String(!open));
}
function closeProfileMenu(){document.getElementById('pmenu').classList.add('hidden');document.getElementById('uChip').setAttribute('aria-expanded','false');}
document.addEventListener('click',e=>{if(!e.target.closest('.uwrap'))closeProfileMenu();});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeProfileMenu();});
function pmGo(v){closeProfileMenu();go(v);}
function togglePwd(){
 const p=document.getElementById('loginPwd'),b=document.getElementById('peye');
 const show=p.type==='password';p.type=show?'text':'password';
 b.innerHTML=show?EYE_OFF:EYE;b.setAttribute('aria-label',show?'Hide password':'Show password');b.title=show?'Hide password':'Show password';
 p.focus();
}
document.getElementById('peye').innerHTML=EYE;
function doLogin(){
 const pw=document.getElementById('loginPwd');
 if(pw.value.length<4){fErr('pwdErr','Enter your password to continue');pw.focus();return;}
 fErr('pwdErr','');
 const role="Super Admin";
 const map={"Super Admin":{name:"Col A. Verma",command:null},"Command Admin":{name:"Maj S. Rao",command:"Western"},"Unit User":{name:"Sub R. Kumar",command:"Western"}};
 const m=map[role];
 SESSION={role,name:m.name,command:m.command,since:new Date(),ip:"10.0."+(Math.floor(Math.random()*9)+1)+"."+(Math.floor(Math.random()*200)+10)};
 document.getElementById('loginView').classList.add('hidden');
 document.getElementById('appView').classList.remove('hidden');
 document.getElementById('uName').textContent=SESSION.name;
 document.getElementById('uRole').textContent=role;
 const ini=SESSION.name.replace(/^\w+\s/,'')[0];
 document.getElementById('uAv').textContent=ini;
 document.getElementById('pmAv').textContent=ini;
 document.getElementById('pmName').textContent=SESSION.name;
 document.getElementById('pmTag').textContent=role;
 document.getElementById('pmMail').textContent=SESSION.name.replace(/^\w+\s/,'').toLowerCase().replace(/[^a-z ]/g,'').trim().split(/\s+/).join('.')+'@adghr.army.in';
 addAudit('LOGIN','Signed in via Army IAM');
 buildNav();go('dashboard');
}
function logout(){SESSION=null;location.reload();}
/* ================= SCOPE / HELPERS ================= */
function scoped(){const c=STATE.cases;if(!SESSION||SESSION.role==="Super Admin")return c;return c.filter(x=>x.command===SESSION.command);}
function findCase(id){return STATE.cases.find(x=>x.id===id);}
function canSee(route){return (NAV[SESSION&&SESSION.role]||[]).some(item=>item[0]===route);}
function addAudit(action,detail){STATE.audit.unshift({ts:fmtDT(new Date()),user:SESSION?SESSION.name:'-',role:SESSION?SESSION.role:'-',action,detail,ip:SESSION?SESSION.ip:'-'});DB.set(STATE);}
function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
function emptyState(icon,title,sub){return '<div class="card"><div class="empty"><div class="eic">'+ic(icon,22)+'</div><b>'+title+'</b><span>'+sub+'</span></div></div>';}
/* ---- Column sorting. One state per table namespace; th's carry the Iconsax glyph. ---- */
const SORT={dash:{key:'updated',dir:-1},reg:{key:'updated',dir:-1},aud:{key:'ts',dir:-1},rep:{key:'id',dir:1},ap:{key:'wait',dir:-1},kb:{key:'updated',dir:-1}};
function sortVal(x,k){
 if(k==='wait')return waitDays(x);
 if(k==='updated')return (pdate(x.updated)||new Date(0)).getTime();
 if(k==='member')return String(x.memberName||'').toLowerCase();
 if(k==='maintenance'){const n=parseFloat(String(x.maintenance||'').replace(/[^0-9.]/g,''));return isNaN(n)?-1:n;}
 if(k==='ts'){const p=String(x.ts||'').split(',');const d=pdate(p[0].trim());const t=(p[1]||'').trim().split(':');
   return (d?d.getTime():0)+((+t[0]||0)*60+(+t[1]||0))*60000;}
 return String(x[k]||'').toLowerCase();
}
function sortRows(ns,rows){const s=SORT[ns];if(!s||!s.key)return rows;
 return rows.slice().sort((a,b)=>{const va=sortVal(a,s.key),vb=sortVal(b,s.key);
   return (va<vb?-1:va>vb?1:0)*s.dir;});}
function th(ns,key,label,cls){const s=SORT[ns],on=s.key===key;
 return '<th class="sortable'+(cls?' '+cls:'')+(on?' sorted':'')+'" onclick="sortBy(&quot;'+ns+'&quot;,&quot;'+key+'&quot;)">'+label+
   '<span class="sic">'+ic(on?(s.dir>0?'ArrowUp2':'ArrowDown2'):'ArrowSwapVertical',14)+'</span></th>';}
function sortBy(ns,key){const s=SORT[ns];if(s.key===key)s.dir=-s.dir;else{s.key=key;s.dir=1;}
 if(ns==='reg')drawReg();else if(ns==='aud')drawAudit();else if(ns==='rep')genReport();else if(ns==='ap')drawAp();else if(ns==='kb')drawKb();else go('dashboard');}
function pendingCase(x){return x.status==="In Progress"&&!x.approved&&!x.subJudice;}
function sjTag(){return '<span class="stat s-Sub-judice sj-dot" title="Sub-judice">'+ic('Judge',13)+'</span>';}
function statCell(x){return statTag(x.status)+(x.subJudice?sjTag():'');}
function statTag(s){return '<span class="stat s-'+s.replace(/\s/g,'-')+'">'+s+'</span>';}
function toast(msg,type){const t=document.createElement('div');t.className='toast'+(type==='err'?' err':'');t.textContent=msg;document.getElementById('toastWrap').appendChild(t);setTimeout(()=>{t.style.opacity=0;setTimeout(()=>t.remove(),300)},2600);}
function modal(title,bodyHtml,footHtml){document.getElementById('modalRoot').innerHTML='<div class="overlay" onclick="if(event.target===this)closeModal()"><div class="modal"><div class="mh"><h3>'+title+'</h3><button class="x" onclick="closeModal()">&times;</button></div><div class="mb">'+bodyHtml+'</div>'+(footHtml?'<div class="mf">'+footHtml+'</div>':'')+'</div></div>';}
function successModal(title,line,detailHtml,footHtml){
 document.getElementById('modalRoot').innerHTML='<div class="overlay" onclick="if(event.target===this)closeModal()">'+
  '<div class="modal sokm"><button class="sx" onclick="closeModal()" title="Close">&times;</button>'+
  '<div class="sok"><span class="sbadge">'+ic('TickCircle',36)+'</span>'+
  '<h3>'+title+'</h3><p>'+line+'</p>'+(detailHtml||'')+'</div>'+
  (footHtml?'<div class="mf">'+footHtml+'</div>':'')+'</div></div>';}
function sokRow(k,v){return '<div class="sokid"><div class="k">'+k+'</div><div class="v">'+esc(v)+'</div></div>';}
function closeModal(){document.getElementById('modalRoot').innerHTML='';}
function downloadCsv(name,rows){const csv=rows.map(r=>r.map(c=>'"'+String(c==null?'':c).replace(/"/g,'""')+'"').join(',')).join('\r\n');
 const blob=new Blob(['﻿'+csv],{type:'text/csv;charset=utf-8'});const url=URL.createObjectURL(blob);
 const a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);}
function uploadDemo(el,name){el.classList.add('done');el.innerHTML='&#10003; '+name+' attached';el.style.color='var(--success-active)';el.style.borderColor='var(--success-active)';el.style.background='var(--success-10)';}
/* Watermark. Each row is ONE continuous nowrap line of the repeated mark, wider
   than the block it sits in, so a row never ends inside the sheet. Wrapping
   separate marks instead leaves every row ragged at the same place, and those
   ends line up into blank diagonal channels across the page. Rows are pulled
   left on a three step cycle so the repeats do not stack into columns either.
   The block is twice the sheet and offset back by half, because a block sized
   to the sheet loses its corners the moment it is rotated. */
function wmSpans(mark){const t=esc('CONFIDENTIAL · '+mark+' · ');
 const line=t.repeat(20);let h='';
 for(let i=0;i<84;i++)h+='<span style="margin-left:-'+((i%3)*190)+'px">'+line+'</span>';
 return h;}
function previewDoc(id,name){const wm=wmSpans(SESSION.name+' · '+SESSION.role+' · '+SESSION.ip);
 modal('Document Preview',
  '<div class="muted" style="font-size:12.5px;margin-bottom:10px">'+esc(name)+' &middot; case '+id+'</div>'+
  '<div class="card sheet" style="min-height:300px"><div class="wm">'+wm+'</div>'+
   '<div class="rh compact"><div class="rh-top"><div class="rh-brand"><span class="rh-mark">MAARK</span>'+
     '<div><b>Additional Directorate General of Human Rights</b><small>MAARK 2.0 &middot; secure document viewer</small></div></div>'+
     '<span class="rh-stamp">'+ic('ShieldTick',13)+'Confidential</span></div></div>'+
   '<div style="position:relative;font-size:13px;color:var(--text-2);line-height:1.6">This is a watermarked, read-only preview of <b>'+esc(name)+'</b>. In the live system the original PDF is decrypted on the server, stamped with the viewer\'s IP, user ID and timestamp, and streamed for viewing only; printing and download are controlled by role.</div></div>',
  '<button class="btn ghost" onclick="closeModal()">'+ic('CloseCircle',17)+'Close Preview</button>');
 addAudit('VIEW_DOCUMENT','Previewed '+name+' on '+id);}
/* ================= NAV / ROUTER ================= */
const NAV={
 "Super Admin":[["dashboard","Dashboard"],["registered","Registered Cases"],["newcase","New Case"],["approvals","Approvals"],["reports","Reports"],["kb","Knowledge Base"],["audit","Audit Log"]],
 "Command Admin":[["dashboard","Dashboard"],["registered","Registered Cases"],["newcase","New Case"],["approvals","Approvals"],["reports","Reports"]],
 "Unit User":[["dashboard","Dashboard"],["registered","Registered Cases"],["newcase","New Case"],["reports","Reports"]]
};
const NAVICON={dashboard:'Element3',registered:'DocumentText',newcase:'AddCircle',approvals:'ClipboardTick',reports:'Chart21',cms:'NoteText',kb:'Book1',audit:'ShieldTick',assistant:'Messages2'};
let CURRENT="dashboard";
/* Iconsax Bulk variant, used for the active sidebar item only.
   d4 = soft body at 40 percent, d = solid shape, l = stroked detail. */
const ICONS_BULK={
 Element3:{d4:"M10.5 8.52V3.98C10.5 2.57 9.86 2 8.27 2H4.23C2.64 2 2 2.57 2 3.98v4.53c0 1.42.64 1.98 2.23 1.98h4.04c1.59.01 2.23-.56 2.23-1.97ZM22 19.77v-4.04c0-1.59-.64-2.23-2.23-2.23h-4.04c-1.59 0-2.23.64-2.23 2.23v4.04c0 1.59.64 2.23 2.23 2.23h4.04c1.59 0 2.23-.64 2.23-2.23Z",
   d:"M22 8.52V3.98C22 2.57 21.36 2 19.77 2h-4.04c-1.59 0-2.23.57-2.23 1.98v4.53c0 1.42.64 1.98 2.23 1.98h4.04c1.59.01 2.23-.56 2.23-1.97ZM10.5 19.77v-4.04c0-1.59-.64-2.23-2.23-2.23H4.23c-1.59 0-2.23.64-2.23 2.23v4.04C2 21.36 2.64 22 4.23 22h4.04c1.59 0 2.23-.64 2.23-2.23Z"},
 DocumentText:{d4:"M21 7v10c0 3-1.5 5-5 5H8c-3.5 0-5-2-5-5V7c0-3 1.5-5 5-5h8c3.5 0 5 2 5 5Z",
   l:"M14.5 4.5v2c0 1.1.9 2 2 2h2M8 13h4M8 17h8"},
 AddCircle:{d4:"M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10Z",
   l:"M8 12h8M12 16V8"},
 ClipboardTick:{d4:"M16 4.02c3.33.18 5 1.41 5 5.98v6c0 4-1 6-6 6H9c-5 0-6-2-6-6v-6c0-4.56 1.67-5.8 5-5.98Z",
   d:"M10 6h4c2 0 2-1 2-2 0-2-1-2-2-2h-4C9 2 8 2 8 4s1 2 2 2Z",
   l:"m9.31 14.7 1.5 1.5 4-4"},
 Chart21:{d4:"M9 22h6c5 0 7-2 7-7V9c0-5-2-7-7-7H9C4 2 2 4 2 9v6c0 5 2 7 7 7Z",
   l:"M7 10.74v3.2M12 9v6.68M17 10.74v3.2"},
 Book1:{d4:"M22 4.67v12.07c0 .96-.78 1.86-1.74 1.98l-.33.04c-2.18.29-5.54 1.4-7.46 2.46-.26.15-.69.15-.96 0l-.04-.02c-1.92-1.05-5.27-2.15-7.44-2.44l-.29-.04C2.78 18.6 2 17.7 2 16.74V4.66c0-1.19.97-2.09 2.16-1.99 2.1.17 5.28 1.23 7.06 2.34l.25.15c.29.18.77.18 1.06 0l.17-.11c1.78-1.12 4.97-2.19 7.07-2.37h.06c1.19-.1 2.17.79 2.17 1.99Z",
   l:"M12 5.49v15M7.75 8.49H5.5M8.5 11.49h-3"},
 NoteText:{d4:"M21 8.5V17c0 3-1.5 5-5 5H8c-3.5 0-5-2-5-5V8.5c0-3 1.5-5 5-5h8c3.5 0 5 2 5 5Z",
   l:"M8 2v3M16 2v3M8 11h8M8 16h4"},
 ShieldTick:{d4:"M10.49 2.23 5.5 4.11c-1.15.43-2.09 1.79-2.09 3.01v7.43c0 1.18.78 2.73 1.73 3.44l4.3 3.21c1.41 1.06 3.73 1.06 5.14 0l4.3-3.21c.95-.71 1.73-2.26 1.73-3.44V7.12c0-1.23-.94-2.59-2.09-3.02l-4.99-1.87c-.85-.31-2.21-.31-3.04 0Z",
   l:"m9.05 11.87 1.61 1.61 4.3-4.3"},
 Messages2:{d4:"M18.47 16.83l.39 3.16c.1.83-.79 1.41-1.5.98l-4.19-2.49c-.46 0-.91-.03-1.35-.09A4.86 4.86 0 0 0 13 15.23c0-2.84-2.46-5.14-5.5-5.14-1.16 0-2.23.33-3.12.91-.03-.25-.04-.5-.04-.76C4.34 5.69 8.29 2 13.17 2S22 5.69 22 10.24c0 2.7-1.39 5.09-3.53 6.59Z",
   d:"M13 15.23c0 1.19-.44 2.29-1.18 3.16-.99 1.2-2.56 1.97-4.32 1.97l-2.61 1.55c-.44.27-1-.1-.94-.61l.25-1.97C2.86 18.4 2 16.91 2 15.23c0-1.76.94-3.31 2.38-4.23.89-.58 1.96-.91 3.12-.91 3.04 0 5.5 2.3 5.5 5.14Z"}
};
function icB(n,s){const b=ICONS_BULK[n];if(!b)return ic(n,s);const z=s||18;
 return '<svg class="ix" viewBox="0 0 24 24" width="'+z+'" height="'+z+'" fill="none">'+
  (b.d4?'<path fill="currentColor" opacity=".4" d="'+b.d4+'"/>':'')+
  (b.d?'<path fill="currentColor" d="'+b.d+'"/>':'')+
  (b.l?'<path stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" d="'+b.l+'"/>':'')+
 '</svg>';}
function navIcon(k,on){return (on?icB:ic)(NAVICON[k]||'Element3',20);}
function buildNav(){
 const s=document.getElementById('side');s.innerHTML='';
 NAV[SESSION.role].forEach(([k,label])=>{
   /* build the group header as a node: innerHTML+= would re-parse #side and
      strip the onclick handlers already set on the items above it */
   if(k==='_a'){const g=document.createElement('div');g.className='grp';g.textContent=label;s.appendChild(g);return;}
   const a=document.createElement('div');a.className='nav';a.dataset.k=k;a.innerHTML='<span class="ic">'+ic(NAVICON[k]||'Element3',20)+'</span>'+label;a.onclick=()=>go(k);s.appendChild(a);});
}
const VIEWS={dashboard:vDashboard,registered:vRegistered,newcase:vNewCase,casedetail:vCaseDetail,approvals:vApprovals,reports:vReports,cms:vCms,kb:vKb,audit:vAudit,assistant:vAssistant,profile:vProfile};
function vProfile(m){
 const mail=document.getElementById('pmMail').textContent;
 const av=document.getElementById('uAv').textContent;
 const since=SESSION.since?SESSION.since.toLocaleString('en-IN',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'}):'-';
 const fld=(k,v,sub)=>'<div class="pf"><div class="pk">'+k+'</div><div class="pv">'+esc(v)+'</div>'+(sub?'<div class="ps">'+sub+'</div>':'')+'</div>';
 m.innerHTML='<div class="crumb">Home / My Profile</div>'+
  '<div class="pagehead"><div><div class="h2">My Profile</div><div class="pagesub">Your account, scope and session for this sign-in.</div></div></div>'+
  '<div class="pgrid">'+
   '<div class="card pid">'+
     '<div class="pav">'+esc(av)+'</div>'+
     '<div class="pname">'+esc(SESSION.name)+'</div>'+
     '<span class="prole">'+esc(SESSION.role)+'</span>'+
     '<div class="pline">'+ic('Messages2',15)+'<span>'+esc(mail)+'</span></div>'+
     '<div class="pline">'+ic('Element3',15)+'<span>'+esc(SESSION.command||'All commands')+'</span></div>'+
     '<div class="pline">'+ic('ShieldTick',15)+'<span>Signed in '+esc(since)+'</span></div>'+
     '<div class="pquick">'+
       (canSee('audit')?'<button class="btn ghost sm" id="pfAudit">'+ic('ShieldTick',16)+'Audit Trail</button>':'')+
       '<button class="btn ghost sm" id="pfAi">'+ic('Magicpen',16)+'AI Assistant</button>'+
     '</div>'+
     '<button class="btn ghost sm pfout" id="pfOut">'+ic('LogoutCurve',16)+'Log Out</button>'+
   '</div>'+
   '<div class="pcol">'+
     '<div class="card"><h3>'+ic('Profile',18)+'Account Details</h3><div class="pfgrid">'+
       fld('Full name',SESSION.name)+fld('Role',SESSION.role,'Set by Army IAM, not editable here')+
       fld('Command scope',SESSION.command||'All commands',SESSION.command?'You see cases of this command only':'You see cases across every command')+
       fld('Email',mail)+
     '</div></div>'+
     '<div class="card"><h3>'+ic('ShieldTick',18)+'Session and Security</h3><div class="pfgrid">'+
       fld('Authentication','Army IAM (SAML 2.0) with 2FA')+fld('Session IP',SESSION.ip)+
       fld('Signed in at',since)+fld('Session state','Active','Idle sessions are signed out automatically')+
     '</div>'+
     '<div class="pnote">'+ic('InfoCircle',16)+'<span>Passwords, roles and command scope are managed in Army IAM. Raise a request with your unit IT cell to change them.</span></div>'+
     '</div>'+
   '</div>'+
  '</div>';
 const pfa=document.getElementById('pfAudit');if(pfa)pfa.onclick=()=>go('audit');
 document.getElementById('pfAi').onclick=()=>go('assistant');
 document.getElementById('pfOut').onclick=()=>logout();
}
function go(view,arg){CURRENT=view;{const fb=document.getElementById('aiFab');if(fb)fb.classList.toggle('hidden',view==='assistant');}document.querySelectorAll('#side .nav').forEach(a=>{const on=a.dataset.k===view;a.classList.toggle('on',on);
   const slot=a.querySelector('.ic');if(slot)slot.innerHTML=navIcon(a.dataset.k,on);});
 /* breadcrumb only on inner pages, never on a top-level nav destination */
 document.body.classList.toggle('toplevel',(NAV[SESSION.role]||[]).some(n=>n[0]===view));
 const m=document.getElementById('main');m.scrollTop=0;(VIEWS[view]||vDashboard)(m,arg);}
/* ================= DASHBOARD ================= */
function vDashboard(m){
 const c=scoped();
 const cnt=s=>c.filter(x=>x.status===s).length;
 const byCmd={};COMMANDS.forEach(k=>byCmd[k]=0);c.forEach(x=>{byCmd[x.command]=(byCmd[x.command]||0)+1;});
 const maxB=Math.max(1,...Object.values(byCmd));
 const pend=c.filter(pendingCase);
 m.innerHTML='<div class="crumb">Home / Dashboard</div><div class="pagehead"><div><div class="h2">Dashboard</div><div class="pagesub">A live view of maintenance-allowance cases in your scope.</div></div></div>'+
 '<div class="kpis">'+
   kpi("Total Cases",c.length,"var(--primary)","all","ClipboardText")+
   kpi("Draft",cnt("Draft"),"var(--text-3)","Draft","NoteText")+
   kpi("In Progress",cnt("In Progress"),"var(--info-active)","In Progress","Clock")+
   kpi("Resolved",cnt("Resolved"),"var(--success-active)","Resolved","ClipboardTick")+
   kpi("Closed",cnt("Closed"),"var(--text-3)","Closed","TickCircle")+
 '</div>'+
 '<div class="row2">'+
   '<div class="card" style="flex:1.5;min-width:300px"><div class="cardhead"><h3>Cases by Command</h3><span class="ch-sub">'+c.length+' case'+(c.length===1?'':'s')+' in scope</span></div>'+
     '<div class="hbars">'+COMMANDS.slice().sort((a,b)=>(byCmd[b]||0)-(byCmd[a]||0)).map(k=>{
       const v=byCmd[k]||0,pct=v?Math.max(Math.round(v/maxB*100),4):0;
       return '<div class="hbar'+(v?'':' zero')+'" onclick="go(&quot;registered&quot;,{cmd:&quot;'+k+'&quot;})" title="Open '+k+' Command cases">'+
         '<span class="hb-l">'+k+'</span><span class="hb-t"><i style="width:'+pct+'%"></i></span><b class="hb-v">'+v+'</b></div>';}).join('')+
     '</div></div>'+
   '<div class="card" style="flex:1;min-width:260px"><div class="cardhead"><h3>Pending Approvals</h3>'+
     (pend.length?'<span class="ch-link" onclick="go(&quot;approvals&quot;)">View all'+ic('ArrowRight2',13)+'</span>':'')+'</div>'+
     (pend.length?'<div class="alist">'+pend.slice(0,5).map(x=>'<div class="aitem" onclick="go(&quot;casedetail&quot;,&quot;'+x.id+'&quot;)">'+
       '<span class="ai-main"><b>'+x.id+'</b><small>'+esc(x.applicant)+' &middot; '+x.command+'</small></span>'+
       ageChip(x)+'<span class="ai-go">'+ic('ArrowRight2',14)+'</span></div>').join('')+'</div>'
      :'<div class="empty" style="padding:22px 10px"><div class="eic">'+ic('ClipboardTick',20)+'</div><b>Nothing waiting on you</b><span>New submissions will show up here.</span></div>')+
   '</div>'+
 '</div>'+
 '<div class="card" style="margin-top:16px"><h3>Recent Cases</h3><div class="tblwrap"><table class="tbl"><thead><tr>'+
   th('dash','id','Case No')+th('dash','applicant','Applicant')+th('dash','command','Command')+th('dash','status','Status')+th('dash','updated','Updated')+
 '</tr></thead><tbody>'+
   sortRows('dash',c).slice(0,6).map(x=>'<tr style="cursor:pointer" onclick="go(\'casedetail\',\''+x.id+'\')"><td><b>'+x.id+'</b></td><td>'+esc(x.applicant)+' <span class="muted">('+x.relation+')</span></td><td>'+x.command+'</td><td>'+statCell(x)+'</td><td>'+x.updated+'</td></tr>').join('')+
 '</tbody></table></div></div>';
}
function kpi(lbl,val,color,jump,icn){return '<div class="kpi" onclick="go(\'registered\',{status:\''+jump+'\'})"><div class="kico" style="background:color-mix(in srgb,'+color+' 12%,#fff);color:'+color+'">'+ic(icn,19)+'</div><div class="kbody"><div class="val">'+val+'</div><div class="lbl">'+lbl+'</div></div></div>';}
function tblFoot(ns,page,per,total){
 const last=Math.max(1,Math.ceil(total/per));
 const from=total?((page-1)*per+1):0,to=Math.min(page*per,total);
 return '<div class="pager"><span class="rpp">Rows per page'+
  dd('rpp_'+ns,[10,25,50].map(n=>({v:String(n),l:String(n)})),String(per),ns+'Per(v)','sm rpp-dd',String(per))+'</span>'+
  '<span class="range">'+from+' to '+to+' of '+total+'</span>'+
  '<span class="pgc'+(page<=1?' off':'')+'" onclick="'+ns+'Page('+(page-1)+')" title="Previous page">'+ic('ArrowLeft2',15)+'</span>'+
  '<span class="pgc'+(page>=last?' off':'')+'" onclick="'+ns+'Page('+(page+1)+')" title="Next page">'+ic('ArrowRight2',15)+'</span></div>';}
function pageSlice(rows,page,per){return rows.slice((page-1)*per,page*per);}
/* ================= REGISTERED ================= */
let regFilter={q:"",status:"all",cmd:"",page:1,per:10};
function regPage(n){const t=regRows().length,last=Math.max(1,Math.ceil(t/regFilter.per));regFilter.page=Math.min(Math.max(1,n),last);drawReg();}
function regPer(v){regFilter.per=+v;regFilter.page=1;drawReg();}
function vRegistered(m,arg){
 if(arg&&arg.status)regFilter.status=arg.status;
 if(arg&&arg.cmd){regFilter.cmd=arg.cmd;regFilter.status='all';regFilter.page=1;}
 const canNew=true;
 const c=scoped();const cnt=s=>c.filter(x=>x.status===s).length;
 m.innerHTML='<div class="crumb">Home / Registered Cases</div>'+
 '<div class="pagehead"><div><div class="h2">Registered Cases</div><div class="pagesub">Every case you can see, across '+(SESSION.command||'all commands')+'.</div></div>'+
   '<div class="acts">'+(canNew?'<button class="btn prim" onclick="go(\'newcase\')">'+ic('AddCircle',17)+'Register New Case</button>':'')+'</div></div>'+
 '<div class="tools"><span class="fieldwrap"><span class="fic">'+ic('SearchNormal1',16)+'</span><input class="inp search-i" id="regq" placeholder="Search cases" value="'+esc(regFilter.q)+'" oninput="regFilter.q=this.value;regFilter.page=1;drawReg()"></span>'+
   dd('regcmd',[{v:'',l:'All Commands'}].concat(COMMANDS),'All Commands','regFilter.cmd=v;regFilter.page=1;drawReg()','sm',regFilter.cmd)+
   '</div>'+
 '<div id="regtable"></div>';
 drawReg();
}
function regRows(){let c=scoped();if(regFilter.status!=='all')c=c.filter(x=>x.status===regFilter.status);
 if(regFilter.cmd)c=c.filter(x=>x.command===regFilter.cmd);
 if(regFilter.q){const q=regFilter.q.toLowerCase();c=c.filter(x=>(x.id+x.applicant+x.armyNo+x.command).toLowerCase().includes(q));}return c;}
function regTabs(){const c=scoped();const cnt=st=>c.filter(x=>x.status===st).length;
 return '<div class="ltabs">'+['all'].concat(STATUSES).map(st=>
   '<span class="ltab'+(regFilter.status===st?' on':'')+'" onclick="regFilter.page=1;regFilter.status=&quot;'+st+'&quot;;drawReg()">'+
   (st==='all'?'All':st)+'<b>'+(st==='all'?c.length:cnt(st))+'</b></span>').join('')+'</div>';}
function drawReg(){const all=sortRows('reg',regRows());const canEdit=SESSION.role!=="Super Admin";
 const last=Math.max(1,Math.ceil(all.length/regFilter.per));if(regFilter.page>last)regFilter.page=last;
 const c=pageSlice(all,regFilter.page,regFilter.per);
 document.getElementById('regtable').innerHTML='<div class="card tblcard">'+regTabs()+(all.length?'<div class="tblwrap"><table class="tbl"><thead><tr>'+
   th('reg','id','Case No')+th('reg','applicant','Applicant')+th('reg','member','Member')+th('reg','command','Command')+th('reg','status','Status')+th('reg','updated','Updated','num')+
   '<th>Actions</th></tr></thead><tbody>'+
   c.map(x=>'<tr><td><b>'+x.id+'</b></td><td>'+esc(x.applicant)+' <span class="muted">('+x.relation+')</span></td><td>'+esc(x.memberName)+' <span class="muted">('+x.armyNo+')</span></td><td>'+x.command+'</td><td>'+statCell(x)+'</td><td class="num">'+x.updated+'</td><td><span class="act" onclick="go(\'casedetail\',\''+x.id+'\')">'+ic('Eye',15)+'View case</span>'+(canEdit?'<span class="act" onclick="go(\'casedetail\',\''+x.id+'\')">'+ic('Edit2',15)+'Open and edit</span>':'')+'</td></tr>').join('')+
 '</tbody></table></div>'+tblFoot('reg',regFilter.page,regFilter.per,all.length)
   :emptyState('DocumentText','No cases match these filters','Clear a filter or change the search term to see more results.'))+'</div>';}
/* ================= NEW CASE ================= */
/* Wizard. Every step stays in the DOM, only the current one is shown, so each
   getElementById read in submitCase keeps working whatever step you are on. */
const NC_STEPS=[
 {t:"Service personnel",d:"Fetch the service record from the Army number."},
 {t:"Applicant details",d:"Who is applying and how to reach them."},
 {t:"Case details",d:"Category, type and the dates on record."},
 {t:"Dependents and cards",d:"Guardian, parent and card numbers."},
 {t:"Documents",d:"Proof of marriage, affidavit and support."},
 {t:"Review and submit",d:"Check the entries, then send for approval."}];
let NC_STEP=0;
function vNewCase(m){
 NC_STEP=0;
 m.innerHTML='<div class="crumb">Home / New Case</div>'+
 '<div class="pagehead"><div><div class="h2" style="margin:0">Register a New Case</div><div class="pagesub">Six short steps. Fields marked with an asterisk are required, and you can save a draft at any point.</div></div></div>'+
 '<div class="wiz">'+
  '<div class="wmain">'+
   '<div class="card formcard wcard">'+
    '<div class="wtop" id="ncnav"></div>'+
    wstep(0,'<div class="grid3">'+
      f("Army number","nc_army","text","e.g. IC-50231",true,'Enter the Army number, then fetch the service record. Try IC-50231.','<button class="btn ghost sm" style="margin-top:8px" onclick="fetchSvc()">'+ic('SearchNormal1',16)+'Fetch Service Record</button>')+
      ro("Rank","nc_rank")+ro("Name of member","nc_mname")+ro("Unit","nc_unit")+ro("Command","nc_cmd")+ro("Monthly salary","nc_salary")+
    '</div>')+
    wstep(1,'<div class="grid3">'+
      f("Applicant name","nc_app","text","Full name",true)+
      sel("Relation to member","nc_rel",["Wife","Mother","Child"],true)+
      f("Age now","nc_agenow","number","Years")+f("Age at time of filing","nc_agefile","number","Years")+
      f("Contact number","nc_contact","text","10-digit mobile",true)+f("Aadhaar number","nc_aadhaar","text","Validated")+
      '<div class="f full"><label>Correspondence address</label><input id="nc_addr" placeholder="Enter correspondence address"></div>'+
    '</div>')+
    wstep(2,'<div class="grid3">'+
      sel("Case category","nc_cat",["Maintenance","Spouse allowance"],true)+
      sel("Case type","nc_type",["Spouse maintenance","Mother maintenance","Child maintenance","Other"])+
      f("Maintenance sought","nc_maint","text","Amount or percentage")+
      f("Application date","nc_appdate","date","",true)+f("Filed date","nc_filedate","date")+
      '<div class="f"><label>Status on submission</label><div class="rovalue">'+statTag('In Progress')+'</div></div>'+
    '</div>')+
    wstep(3,'<div class="grid3">'+
      f("Guardian name","nc_guard","text","In addition to parent")+f("Parent name","nc_parent")+
      sel("Estranged spouse employment","nc_emp",["Unemployed","Employed","Other"])+
      f("Dependent card number","nc_dep")+f("CSD card number","nc_csd")+sel("Employability","nc_ability",["No","Yes"])+
    '</div>')+
    wstep(4,'<div class="grid3">'+
      '<div class="f"><label>Proof of marriage <span class="req">*</span></label><div class="up" style="cursor:pointer" onclick="uploadDemo(this,\'Proof-of-marriage.pdf\')">Click to upload PDF</div></div>'+
      '<div class="f"><label>Affidavit <span class="req">*</span></label><div class="up" style="cursor:pointer" onclick="uploadDemo(this,\'Affidavit.pdf\')">Click to upload PDF</div></div>'+
      '<div class="f"><label>Supporting documents</label><div class="up" style="cursor:pointer" onclick="uploadDemo(this,\'Supporting-documents.pdf\')">Click to upload one or more PDFs</div></div>'+
    '</div>')+
    wstep(5,'<div id="nc_review"></div>')+
   '</div>'+
   '<div class="formbar" id="ncbar"></div>'+
  '</div>'+
 '</div>';
 ncPaint();
}
function wstep(i,body){return '<section class="wpane'+(i===0?' on':'')+'" data-i="'+i+'">'+
 '<div class="wsh"><div class="wst">'+NC_STEPS[i].t+'</div><div class="wsd">'+NC_STEPS[i].d+'</div></div>'+body+'</section>';}
function ncPaint(){
 const n=NC_STEPS.length,last=NC_STEP===n-1;
 document.getElementById('ncnav').innerHTML='<div class="wsteps">'+
  NC_STEPS.map((s,i)=>{const st=i<NC_STEP?'done':(i===NC_STEP?'now':'todo');
   return '<div class="wsi '+st+'" onclick="ncGo('+i+')" title="'+esc(s.d)+'">'+
    '<span class="wsrow"><span class="wsn">'+(st==='done'?ic('Tick',16):'')+'</span>'+
     (i<n-1?'<span class="wsline"></span>':'')+'</span>'+
    '<span class="wsx"><i>Step '+(i+1)+'</i><b>'+s.t+'</b><em>'+(st==='done'?'Completed':st==='now'?'In progress':'Pending')+'</em></span>'+
   '</div>';}).join('')+'</div>';
 document.getElementById('ncbar').innerHTML=
  (NC_STEP?'<button class="btn ghost" onclick="ncGo('+(NC_STEP-1)+')">'+ic('ArrowLeft2',17)+'Back</button>':'')+
  '<span class="formbar-note">A draft stays with your unit until you submit it.</span>'+
  '<button class="btn ghost" onclick="submitCase(true)">'+ic('NoteText',17)+'Save as Draft</button>'+
  (last?'<button class="btn prim" onclick="submitCase(false)">'+ic('Send2',17)+'Submit Case for Approval</button>'
      :'<button class="btn prim" onclick="ncGo('+(NC_STEP+1)+')">Continue'+ic('ArrowRight2',17)+'</button>');
 document.querySelectorAll('.wpane').forEach(p=>p.classList.toggle('on',+p.dataset.i===NC_STEP));
 if(last)ncReview();
 window.scrollTo({top:0,behavior:'smooth'});
}
function ncGo(i){if(i<0||i>=NC_STEPS.length)return;NC_STEP=i;ncPaint();}
function ncReview(){
 const dash='-',v=id=>val(id)||dash,vd=id=>val(id)?fmtDate(val(id)):dash;
 const row=(l,x)=>'<div class="rvi"><span>'+l+'</span><b>'+esc(x)+'</b></div>';
 const grp=(i,rows)=>'<div class="rvg"><div class="rvh">'+NC_STEPS[i].t+
   '<span class="act" onclick="ncGo('+i+')">'+ic('Edit2',15)+'Edit</span></div>'+rows+'</div>';
 const ups=Array.prototype.slice.call(document.querySelectorAll('.wpane[data-i="4"] .up'));
 document.getElementById('nc_review').innerHTML=
  grp(0,row('Army number',v('nc_army'))+row('Rank',v('nc_rank'))+row('Name of member',v('nc_mname'))+row('Unit',v('nc_unit'))+row('Command',v('nc_cmd'))+row('Monthly salary',v('nc_salary')))+
  grp(1,row('Applicant name',v('nc_app'))+row('Relation to member',v('nc_rel'))+row('Age now',v('nc_agenow'))+row('Age at time of filing',v('nc_agefile'))+row('Contact number',v('nc_contact'))+row('Aadhaar number',v('nc_aadhaar'))+row('Correspondence address',v('nc_addr')))+
  grp(2,row('Case category',v('nc_cat'))+row('Case type',v('nc_type'))+row('Maintenance sought',v('nc_maint'))+row('Application date',vd('nc_appdate'))+row('Filed date',vd('nc_filedate')))+
  grp(3,row('Guardian name',v('nc_guard'))+row('Parent name',v('nc_parent'))+row('Estranged spouse employment',v('nc_emp'))+row('Dependent card number',v('nc_dep'))+row('CSD card number',v('nc_csd'))+row('Employability',v('nc_ability')))+
  grp(4,['Proof of marriage','Affidavit','Supporting documents'].map((l,i)=>row(l,ups[i]&&ups[i].classList.contains('done')?ups[i].textContent.trim():'Not uploaded')).join(''));
}
function f(label,id,type,ph,req,hint,extra){const g=(type==='date')?'':'Enter '+label.toLowerCase();return '<div class="f"><label>'+label+(req?' <span class="req">*</span>':'')+'</label><input id="'+id+'" type="'+(type||'text')+'" placeholder="'+g+'">'+(hint?'<div class="hint">'+hint+'</div>':'')+(extra||'')+'</div>';}
function ro(label,id){return '<div class="f"><label>'+label+'</label><input id="'+id+'" class="isro" readonly placeholder="Auto-filled"></div>';}
function sel(label,id,opts,req){return '<div class="f"><label>'+label+(req?' <span class="req">*</span>':'')+'</label>'+dd(id,opts,'Select')+'</div>';}
/* Custom dropdown. Keeps a hidden input under the same id, so every existing
   getElementById(id).value read keeps working. opts take 'Text' or {v,l}. */
function dd(id,opts,ph,cb,cls,cur){cur=cur||'';
 const o=opts.map(x=>(typeof x==='object')?x:{v:x,l:x});
 const hit=o.filter(x=>x.v===cur)[0];
 return '<div class="dd'+(cls?' '+cls:'')+'"'+(cb?' data-cb="'+cb.replace(/"/g,'&quot;')+'"':'')+'>'+
  '<input type="hidden" id="'+id+'" value="'+esc(cur)+'">'+
  '<button type="button" class="ddt" onclick="ddToggle(this)" onkeydown="ddKey(event,this)" aria-haspopup="listbox" aria-expanded="false">'+
   '<span class="ddv'+(hit?'':' ph')+'">'+esc(hit?hit.l:ph)+'</span><span class="ddc">'+ic('ArrowDown2',16)+'</span></button>'+
  '<div class="ddp" role="listbox">'+o.map(x=>'<div class="ddo'+(x.v===cur?' on':'')+'" role="option" tabindex="-1" data-v="'+esc(x.v)+'" onclick="ddPick(this)" onkeydown="ddKey(event,this)">'+
   '<span>'+esc(x.l)+'</span>'+(x.v===cur?'<span class="ddk">'+ic('TickCircle',16)+'</span>':'')+'</div>').join('')+'</div></div>';}
function ddClose(except){document.querySelectorAll('.dd.open').forEach(d=>{if(d!==except){d.classList.remove('open');const b=d.querySelector('.ddt');if(b)b.setAttribute('aria-expanded','false');}});}
function ddToggle(btn){const d=btn.parentNode,was=d.classList.contains('open');ddClose(d);
 d.classList.toggle('open',!was);btn.setAttribute('aria-expanded',String(!was));
 if(!was){const on=d.querySelector('.ddo.on')||d.querySelector('.ddo');if(on)on.focus();}}
function ddPick(el){const d=el.parentNode.parentNode,v=el.dataset.v,l=el.querySelector('span').textContent;
 d.querySelector('input').value=v;
 const lab=d.querySelector('.ddv');lab.textContent=v?l:lab.textContent;lab.classList.toggle('ph',!v);
 if(!v)lab.textContent=l;
 d.querySelectorAll('.ddo').forEach(o=>{o.classList.toggle('on',o===el);const k=o.querySelector('.ddk');if(k)k.remove();});
 el.insertAdjacentHTML('beforeend','<span class="ddk">'+ic('TickCircle',16)+'</span>');
 d.classList.remove('open');const b=d.querySelector('.ddt');b.setAttribute('aria-expanded','false');b.focus();
 if(d.dataset.cb)new Function('v',d.dataset.cb)(v);}
function ddKey(e,el){const d=el.parentNode.classList.contains('dd')?el.parentNode:el.parentNode.parentNode;
 const items=Array.prototype.slice.call(d.querySelectorAll('.ddo'));
 if(e.key==='Escape'){d.classList.remove('open');d.querySelector('.ddt').focus();return;}
 if(e.key==='Enter'||e.key===' '){if(el.classList.contains('ddo')){e.preventDefault();ddPick(el);}return;}
 if(e.key!=='ArrowDown'&&e.key!=='ArrowUp')return;
 e.preventDefault();
 if(!d.classList.contains('open')){ddToggle(d.querySelector('.ddt'));return;}
 const i=items.indexOf(el),n=e.key==='ArrowDown'?i+1:i-1;
 if(items[n])items[n].focus();}
document.addEventListener('click',e=>{if(!e.target.closest('.dd'))ddClose();});
function fetchSvc(){const a=(document.getElementById('nc_army').value||'').trim().toUpperCase();const o=OFFICERS[a];
 if(!o){toast('No record for that Army number. Try IC-50231.','err');return;}
 document.getElementById('nc_rank').value=o.rank;document.getElementById('nc_mname').value=o.name;
 document.getElementById('nc_unit').value=o.unit;document.getElementById('nc_cmd').value=o.command;
 document.getElementById('nc_salary').value='₹ '+o.salary.toLocaleString('en-IN');toast('Service details fetched');}
function val(id){const e=document.getElementById(id);return e?e.value.trim():'';}
function submitCase(draft){
 const app=val('nc_app'),rel=val('nc_rel'),army=val('nc_army').toUpperCase();
 if(!draft&&(!app||!rel||!army)){toast('Fill applicant name, relation and Army number','err');return;}
 STATE.seq++;const id="MNT/2026/"+String(STATE.seq).padStart(4,'0');
 const o=OFFICERS[army]||{rank:val('nc_rank'),name:val('nc_mname'),unit:val('nc_unit'),command:val('nc_cmd')||SESSION.command||"Western",salary:0};
 const cse={id,applicant:app||"(draft)",relation:rel||"Wife",ageNow:val('nc_agenow'),ageFiling:val('nc_agefile'),
   contact:val('nc_contact'),aadhaar:val('nc_aadhaar'),address:val('nc_addr'),armyNo:army,rank:o.rank,memberName:o.name,
   unit:o.unit,command:o.command,salary:o.salary,category:val('nc_cat')||"Maintenance",type:val('nc_type')||"Spouse maintenance",
   maintenance:val('nc_maint'),appDate:fmtDate(val('nc_appdate')),filedDate:fmtDate(val('nc_filedate')),status:draft?"Draft":"In Progress",approved:false,subJudice:false,court:null,resolution:null,
   guardian:val('nc_guard'),parent:val('nc_parent'),spouseEmployment:val('nc_emp'),dependentCard:val('nc_dep'),
   csdCard:val('nc_csd'),employability:val('nc_ability'),docs:["Proof of marriage.pdf","Affidavit.pdf"],
   notings:[],history:[{stage:"Unit filed",by:SESSION.name,when:fmtDate(new Date())}],updated:fmtDate(new Date())};
 STATE.cases.unshift(cse);DB.set(STATE);addAudit('CREATE_CASE','Registered '+id);
 if(draft){successModal('Draft saved',
   'The draft stays with your unit until you submit it. You can pick it up again from Registered Cases.',
   sokRow('Case number',id),
   '<button class="btn ghost" onclick="closeModal();go(\'registered\')">Back to Cases</button>'+
   '<button class="btn prim" onclick="closeModal();go(\'casedetail\',\''+id+'\')">'+ic('ArrowRight2',17)+'Open the Draft</button>');
 }else{successModal('Case submitted for approval',
   'The case is with Command for review. You can follow its progress on the case page at any time.',
   sokRow('Case number',id)+sokRow('Applicant',cse.applicant+' ('+cse.relation+')'),
   '<button class="btn ghost" onclick="closeModal();go(\'newcase\')">'+ic('AddCircle',17)+'Register Another</button>'+
   '<button class="btn prim" onclick="closeModal();go(\'casedetail\',\''+id+'\')">'+ic('ArrowRight2',17)+'Open the Case</button>');}
}
/* ================= CASE DETAIL ================= */
let cdTab="Details";
function slaChip(x){
 if(x.status==="Closed")return '<span class="timer ok">'+ic('TickCircle',15)+'Closed within the 180 day limit</span>';
 if(x.status==="Resolved")return '<span class="timer ok">'+ic('TickCircle',15)+'Resolved within the 180 day limit</span>';
 if(x.status==="Draft")return '';
 const l=slaLeft(x);if(l==null)return '';
 const cls=l<0?' over':(l<30?'':' ok');
 return '<span class="timer'+cls+'">'+ic('Clock',15)+(l<0?Math.abs(l)+' days past the 180 day limit':l+' of 180 days left')+'</span>';}
function cdRail(x){
 const at=x.status==="Draft"?1:(x.status==="Closed"?5:(x.status==="Resolved"?4:(x.approved?3:2)));
 const steps=[["Filed by unit",x.status==="Draft"?'draft with the unit':(x.filedDate||'-')],["Command review",""],["In progress",""],["Resolved",""],["Case closed",""]];
 return '<div class="rail">'+steps.map((s,i)=>{const n=i+1,cls=n<at?'done':(n===at?'now':'');
   const sub=n===1?(s[1]||'completed'):(n<at?'completed':(n===at?'in progress':'not started'));
   return '<div class="rstep '+cls+'"><b>'+s[0]+'</b><span>'+sub+'</span></div>';}).join('')+'</div>';}
function vCaseDetail(m,id){
 const x=findCase(id);if(!x){go('registered');return;}vCaseDetail.id=id;
 const canAct=SESSION.role!=="Unit User";
 const acts=
   (x.status==="Draft"?'<button class="btn prim" onclick="submitDraft(\''+id+'\')">'+ic('Send2',16)+'Submit for Approval</button>':'')+
   (canAct&&pendingCase(x)?'<button class="btn ghost" onclick="apSendBack(\''+id+'\')">'+ic('ArrowLeft2',16)+'Send Back to Unit</button><button class="btn prim" onclick="apApprove(\''+id+'\')">'+ic('TickCircle',16)+'Approve Case</button>':'')+
   (canAct&&!x.subJudice&&x.status==="In Progress"&&x.approved?'<button class="btn ghost" onclick="caseCloseModal(\''+id+'\',\'resolve\')">'+ic('TickCircle',16)+'Mark Resolved</button><button class="btn prim" onclick="caseCloseModal(\''+id+'\',\'close\')">'+ic('CloseCircle',16)+'Close Case</button>':'')+
   (canAct&&!x.subJudice&&x.status==="Resolved"?'<button class="btn prim" onclick="caseCloseModal(\''+id+'\',\'close\')">'+ic('CloseCircle',16)+'Close Case</button>':'');
 const meta=(k,v)=>'<div><div class="k">'+k+'</div><div class="v">'+v+'</div></div>';
 const counts={Details:0,"Sub-judice":sjEvents(x).length,Notings:x.notings.length,Documents:x.docs.length,History:x.history.length};
 m.innerHTML='<div class="crumb">Home / Registered Cases / '+id+'</div>'+
 '<div class="chero"><div class="cback" onclick="go(\'registered\')">'+ic('ArrowLeft2',15)+'Back to registered cases</div><div class="ctop"><span class="no">'+id+'</span>'+statTag(x.status)+(x.subJudice?'<span class="stat s-Sub-judice">'+ic('Judge',14)+'Sub-judice</span>':'')+slaChip(x)+
   '<span class="cacts">'+(acts||'<span class="muted" style="font-size:12.5px">'+(x.subJudice?'No maintenance decision is taken until the court rules':'No decision is open on this case')+'</span>')+'</span></div>'+
   '<div class="cmeta">'+
     meta('Applicant',esc(x.applicant)+' <span class="muted" style="font-weight:500">('+x.relation+')</span>')+
     meta('Service member',esc(x.memberName)+' <span class="muted" style="font-weight:500">'+(x.rank||'')+' &middot; '+x.armyNo+'</span>')+
     meta('Command and unit',x.command+' <span class="muted" style="font-weight:500">&middot; '+esc(x.unit||'-')+'</span>')+
     meta('Maintenance sought',esc(x.maintenance||'-'))+
   '</div>'+cdRail(x)+
   '<div class="tabs">'+["Details","Sub-judice","Notings","Documents","History"].map(t=>'<div class="tab'+(cdTab===t?' on':'')+'" onclick="cdTab=\''+t+'\';go(\'casedetail\',\''+id+'\')">'+t+(counts[t]?'<span class="cnt">'+counts[t]+'</span>':'')+'</div>').join('')+'</div>'+'</div>'+
 '<div class="cols"><div class="lcol">'+cdBody(x)+'</div><div class="rcol">'+
   '<div class="card" style="margin-bottom:14px"><h3>Case Summary</h3>'+
     kv("Category",x.category)+kv("Case type",x.type||'-')+kv("Maintenance sought",x.maintenance||'-')+
     kv("Application date",x.appDate||'-')+kv("Filed date",x.filedDate||'-')+kv("Last updated",x.updated||'-')+
     kv("Court",sjLine(x))+
     (x.resolution?kv(x.resolution.outcome==="Resolved"?"Reason for resolution":"Reason for closure",x.resolution.reason)+kv("Recorded by",x.resolution.by+' \u00b7 '+x.resolution.when):'')+'</div>'+
   '<div class="card"><h3>Approval History</h3><div class="htl">'+
     x.history.map(h=>'<div class="hi"><div class="hs">'+esc(h.stage)+'</div><div class="hm">'+esc(h.by||'-')+' &middot; '+h.when+'</div></div>').join('')+
     (pendingCase(x)?'<div class="hi pend"><div class="hs">Command review</div><div class="hm">waiting on you</div></div>':'')+
   '</div></div>'+
 '</div></div>';
}
function kv(k,v){return '<div class="kv"><span class="k">'+k+'</span><span class="v">'+esc(v)+'</span></div>';}
function cdSection(title,rows){return '<div class="card" style="margin-bottom:14px"><div class="sech">'+title+'</div><div class="kvgrid">'+rows+'</div></div>';}
function cdBody(x){
 if(cdTab==="Details"){return ''+
   cdSection('Applicant',
     kv("Name",x.applicant)+kv("Relation to member",x.relation)+
     kv("Age now",x.ageNow||'-')+kv("Age at time of filing",x.ageFiling||'-')+
     kv("Contact number",x.contact||'-')+kv("Aadhaar number",x.aadhaar||'-')+
     kv("Correspondence address",x.address||'-')+kv("Guardian or parent",(x.guardian||x.parent||'-')))+
   cdSection('Service member',
     kv("Name",x.memberName||'-')+kv("Army number",x.armyNo||'-')+
     kv("Rank",x.rank||'-')+kv("Unit",x.unit||'-')+
     kv("Command",x.command||'-')+kv("Monthly salary",x.salary?'₹ '+x.salary.toLocaleString('en-IN'):'-'))+
   cdSection('Eligibility and entitlement',
     kv("Estranged spouse employment",x.spouseEmployment||'-')+kv("Employability",x.employability||'-')+
     kv("Dependent card",x.dependentCard||'-')+kv("CSD card",x.csdCard||'-'));}
 if(cdTab==="Sub-judice"){return cdSubJudice(x);}
 if(cdTab==="Documents"){return '<div class="card"><h3>Documents on File</h3>'+
   (x.docs.length?x.docs.map(d=>'<div class="doc"><span class="dic">'+ic('DocumentText',19)+'</span>'+
     '<div style="flex:1;min-width:0"><div class="dn">'+esc(d)+'</div><div class="dm">PDF &middot; uploaded by the unit &middot; read only</div></div>'+
     '<span class="act" onclick="previewDoc(\''+x.id+'\',\''+d.replace(/'/g,"")+'\')">'+ic('Eye',15)+'Preview</span></div>').join('')
    :'<div class="empty"><div class="eic">'+ic('DocumentText',22)+'</div><b>No documents yet</b><span>Proof of marriage and the affidavit are attached by the unit.</span></div>')+'</div>';}
 if(cdTab==="History"){return '<div class="card"><h3>Case History</h3><div class="htl">'+
   x.history.map(h=>'<div class="hi'+(h.stage==="Sent back"?' pend':'')+'"><div class="hs">'+esc(h.stage)+'</div>'+
     '<div class="hm">'+esc(h.by||'-')+' &middot; '+h.when+'</div>'+
     (h.note?'<div class="hn">'+esc(h.note)+'</div>':'')+'</div>').join('')+'</div></div>';}
 return '<div>'+
   (x.notings.length?x.notings.map((n,i)=>note(x.id,n,i)).join('')
    :'<div class="card" style="margin-bottom:14px"><div class="empty"><div class="eic">'+ic('NoteText',22)+'</div><b>No notings yet</b><span>Add the first noting below. Notings raised in the chain of command are yellow. They turn green once headquarters gives its verdict.</span></div></div>')+
   (x.status==="Closed"?'':'<div class="composer"><div class="sech" style="margin-bottom:10px">Add a noting</div>'+
     '<textarea id="newnote" placeholder="Record your observation, recommendation or direction"></textarea>'+
     '<div class="cfoot">'+(isHq()?'<span class="stat" style="background:var(--success-10);color:var(--success-active)">Green &middot; headquarters</span>'+
       '<span class="muted" style="font-size:12px">This is the headquarters verdict. It is recorded green and every earlier noting on the case turns green with it.</span>'
      :'<span class="stat" style="background:var(--warning-10);color:var(--warning-active)">Yellow &middot; chain of command</span>'+
       '<span class="muted" style="font-size:12px">Notings from the chain of command stay yellow until headquarters gives its verdict.</span>')+
     '<button class="btn prim sm" style="margin-left:auto" onclick="addNote(\''+x.id+'\')">'+ic('Send2',16)+'Save Noting</button></div></div>')+'</div>';
}
function sjF(label,id,v,type,ph,req){return '<div class="f"><label>'+label+(req?' <span class="req">*</span>':'')+'</label><input id="'+id+'" type="'+(type||'text')+'" value="'+esc(v||'')+'" placeholder="'+(ph||'')+'"></div>';}
/* ---- Sub-judice: one court proceeding with a trail of hearings and transfers ---- */
const SJ_COURTS=["District Court","High Court","Supreme Court"];
const SJ_KINDS={referred:'Referred to court',hearing:'Hearing held',transfer:'Case transferred',judgement:'Final judgement'};
function sjName(court,name){return court==="Supreme Court"?"Supreme Court of India":((name||'').trim()||court||'-');}
function sjEvents(x){return (x.court&&x.court.events)||[];}
function sjCount(x,k){return sjEvents(x).filter(e=>e.kind===k).length;}
function sjLine(x){if(!x.court)return '-';const c=x.court;
 return sjName(c.court,c.courtName)+(c.disposed?' · judgement passed':(c.nextHearing?' · next hearing '+c.nextHearing:''));}
function cdSubJudice(x){
 const canAct=SESSION.role!=="Unit User"&&x.status!=="Closed",c=x.court;
 if(!c)return '<div class="card"><div class="empty"><div class="eic">'+ic('Judge',22)+'</div><b>Not sub-judice</b>'+
   '<span>No court proceeding has been recorded on this case. Refer it to a court once the matter goes before one.</span>'+
   (canAct?'<div style="margin-top:16px"><button class="btn prim" onclick="sjReferModal(\''+x.id+'\')">'+ic('Judge',16)+'Refer to Court</button></div>':'')+'</div></div>';
 const st=c.disposed?'<span class="stat s-Resolved">'+ic('Verify',14)+'Judgement passed</span>'
   :'<span class="stat s-Sub-judice">'+ic('Judge',14)+'Pending before the court</span>';
 return '<div class="card" style="margin-bottom:14px">'+
  '<div class="sech">Court Proceeding '+st+'</div>'+
  '<div class="kvgrid">'+
   kv(c.disposed?"Court that ruled":"Court now hearing it",sjName(c.court,c.courtName))+
   kv("Court case number",c.caseNo||'-')+
   kv("Before a court since",c.since||'-')+
   kv("Hearings held",String(sjCount(x,'hearing')))+
   kv(c.disposed?"Date of judgement":"Next hearing date",(c.disposed?c.judgedOn:c.nextHearing)||'-')+
   kv("Courts so far",String(1+sjCount(x,'transfer')))+
  '</div>'+
  (c.disposed&&c.finalOrder?'<div class="sjorder"><b>Operative part of the order</b><p>'+esc(c.finalOrder)+'</p></div>':'')+
  '</div>'+
  (canAct&&!c.disposed?'<div class="formbar"><span class="formbar-note">No maintenance decision is taken until the court rules.</span>'+
   '<button class="btn ghost" onclick="sjHearingModal(\''+x.id+'\')">'+ic('Clock',16)+'Record Hearing</button>'+
   '<button class="btn ghost" onclick="sjTransferModal(\''+x.id+'\')">'+ic('Refresh2',16)+'Transfer Court</button>'+
   '<button class="btn prim" onclick="sjJudgeModal(\''+x.id+'\')">'+ic('Verify',16)+'Record Judgement</button></div>':'')+
  sjTrail(x);}
function sjTrail(x){const c=x.court,ev=sjEvents(x);
 return '<div class="card" style="margin-top:14px"><h3>Proceedings Trail</h3><div class="htl">'+
  (ev.length?ev.map(e=>'<div class="hi'+(e.kind==='transfer'?' pend':'')+'"><div class="hs">'+(SJ_KINDS[e.kind]||'Hearing held')+'</div>'+
    '<div class="hm">'+esc(e.when||'-')+' &middot; '+esc(sjName(e.court,e.courtName))+(e.by?' &middot; '+esc(e.by):'')+'</div>'+
    (e.note?'<div class="hn">'+esc(e.note)+'</div>':'')+'</div>').join('')
   :'<div class="hi"><div class="hs">Referred to court</div><div class="hm">'+esc(c.since||'-')+'</div></div>')+
  (!c.disposed&&c.nextHearing?'<div class="hi pend"><div class="hs">Next hearing</div>'+
    '<div class="hm">'+esc(c.nextHearing)+' &middot; '+esc(sjName(c.court,c.courtName))+' &middot; scheduled</div></div>':'')+
 '</div></div>';}
function sjCourt(v){const w=document.getElementById('sj_cname_wrap');if(w)w.hidden=(v==="Supreme Court");}
function sjCourtT(v){const w=document.getElementById('sj_t_cname_wrap');if(w)w.hidden=(v==="Supreme Court");}
function sjMf(id,label,fn,icon){return '<button class="btn ghost" onclick="closeModal()">Cancel</button>'+
 '<button class="btn prim" onclick="'+fn+'(\''+id+'\')">'+ic(icon,16)+label+'</button>';}
function sjReferModal(id){
 modal('Refer the Case to a Court',
  '<p class="pagesub" style="margin:-2px 0 14px">Saving this marks the case sub-judice. Every hearing after it is recorded on the trail.</p>'+
  '<div class="grid2">'+
   '<div class="f"><label>Court <span class="req">*</span></label>'+dd('sj_court',SJ_COURTS,'Select court','sjCourt(v)','','')+'</div>'+
   '<div class="f" id="sj_cname_wrap"><label>Name of the court</label><input id="sj_cname" placeholder="e.g. District Court, Jalandhar"></div>'+
   sjF('Court case number','sj_no','','text','e.g. MC/412/2026')+
   sjF('Date it went to court','sj_start','','date','',true)+
   sjF('Next hearing date','sj_next','','date')+
  '</div>',sjMf(id,'Mark sub-judice','sjSaveRefer','Judge'));}
function sjSaveRefer(id){const x=findCase(id),court=val('sj_court');
 if(!court){toast('Select the court first','err');return;}
 if(court!=="Supreme Court"&&!val('sj_cname')){toast('Enter the name of the court','err');return;}
 if(!val('sj_start')){toast('Enter the date the case went to court','err');return;}
 const nm=sjName(court,val('sj_cname')),now=fmtDate(new Date()),when=fmtDate(val('sj_start'))||now;
 x.court={court:court,courtName:nm,caseNo:val('sj_no'),since:when,lastHearing:'',nextHearing:fmtDate(val('sj_next')),
   disposed:false,judgedOn:'',finalOrder:'',
   events:[{kind:'referred',when:when,court:court,courtName:nm,by:SESSION.name,
     note:'Court case number '+(val('sj_no')||'not recorded on the file')+'.'}]};
 x.subJudice=true;x.updated=now;
 x.history.push({stage:"Marked sub-judice",by:SESSION.name,when:now,note:nm});
 DB.set(STATE);addAudit('SUBJUDICE','Marked '+id+' sub-judice before '+nm);
 closeModal();toast('Case marked sub-judice');cdTab="Sub-judice";go('casedetail',id);}
function sjHearingModal(id){const x=findCase(id),c=x.court;
 modal('Record a Hearing',
  '<p class="pagesub" style="margin:-2px 0 14px">Before '+esc(sjName(c.court,c.courtName))+'. The case stays sub-judice.</p>'+
  '<div class="grid2">'+
   sjF('Date of the hearing','sj_h_date','','date','',true)+
   sjF('Next hearing date','sj_h_next','','date')+
   '<div class="f full"><label>What the court said</label><textarea id="sj_h_note" placeholder="Record what happened at the hearing"></textarea></div>'+
  '</div>',sjMf(id,'Save hearing','sjSaveHearing','Clock'));}
function sjSaveHearing(id){const x=findCase(id),c=x.court,d=fmtDate(val('sj_h_date'));
 if(!d){toast('Enter the date of the hearing','err');return;}
 c.events.push({kind:'hearing',when:d,court:c.court,courtName:c.courtName,by:SESSION.name,
   note:(document.getElementById('sj_h_note').value||'').trim()});
 c.lastHearing=d;c.nextHearing=fmtDate(val('sj_h_next'));
 x.updated=fmtDate(new Date());DB.set(STATE);
 addAudit('SJ_HEARING','Recorded a hearing on '+id+' before '+c.courtName);
 closeModal();toast('Hearing recorded');go('casedetail',id);}
function sjTransferModal(id){const x=findCase(id),c=x.court;
 modal('Transfer the Case to Another Court',
  '<p class="pagesub" style="margin:-2px 0 14px">The matter moves from '+esc(sjName(c.court,c.courtName))+'. The earlier hearings stay on the trail.</p>'+
  '<div class="grid2">'+
   '<div class="f"><label>New court <span class="req">*</span></label>'+dd('sj_t_court',SJ_COURTS,'Select court','sjCourtT(v)','','')+'</div>'+
   '<div class="f" id="sj_t_cname_wrap"><label>Name of the court</label><input id="sj_t_cname" placeholder="e.g. High Court, Chandigarh"></div>'+
   sjF('New court case number','sj_t_no','','text','e.g. CRM/88/2026')+
   sjF('Date of the transfer','sj_t_date','','date','',true)+
   sjF('Next hearing date','sj_t_next','','date')+
   '<div class="f full"><label>Reason for the transfer</label><textarea id="sj_t_note" placeholder="Why the matter moved to this court"></textarea></div>'+
  '</div>',sjMf(id,'Transfer court','sjSaveTransfer','Refresh2'));}
function sjSaveTransfer(id){const x=findCase(id),c=x.court,court=val('sj_t_court'),d=fmtDate(val('sj_t_date'));
 if(!court){toast('Select the new court first','err');return;}
 if(court!=="Supreme Court"&&!val('sj_t_cname')){toast('Enter the name of the court','err');return;}
 if(!d){toast('Enter the date of the transfer','err');return;}
 const nm=sjName(court,val('sj_t_cname')),from=sjName(c.court,c.courtName);
 const why=(document.getElementById('sj_t_note').value||'').trim();
 c.events.push({kind:'transfer',when:d,court:court,courtName:nm,by:SESSION.name,
   note:'Moved from '+from+'.'+(why?' '+why:'')});
 c.court=court;c.courtName=nm;c.caseNo=val('sj_t_no')||c.caseNo;c.nextHearing=fmtDate(val('sj_t_next'));
 x.updated=fmtDate(new Date());
 x.history.push({stage:"Court changed",by:SESSION.name,when:x.updated,note:from+' to '+nm});
 DB.set(STATE);addAudit('SJ_TRANSFER','Moved '+id+' from '+from+' to '+nm);
 closeModal();toast('Case transferred to '+nm);go('casedetail',id);}
function sjJudgeModal(id){const x=findCase(id),c=x.court;
 modal('Record the Final Judgement',
  '<p class="pagesub" style="margin:-2px 0 14px">Recorded against '+esc(sjName(c.court,c.courtName))+'. The case stops being sub-judice and the maintenance decision can proceed.</p>'+
  '<div class="grid2">'+
   sjF('Date of the judgement','sj_j_date','','date','',true)+
   '<div class="f full"><label>Operative part of the order <span class="req">*</span></label>'+
    '<textarea id="sj_j_note" placeholder="Record the operative part of the order"></textarea></div>'+
  '</div>',sjMf(id,'Record judgement','sjSaveJudge','Verify'));}
function sjSaveJudge(id){const x=findCase(id),c=x.court,d=fmtDate(val('sj_j_date'));
 const txt=(document.getElementById('sj_j_note').value||'').trim();
 if(!d){toast('Enter the date of the judgement','err');return;}
 if(!txt){toast('Record the operative part of the order','err');return;}
 c.events.push({kind:'judgement',when:d,court:c.court,courtName:c.courtName,by:SESSION.name,note:txt});
 c.disposed=true;c.judgedOn=d;c.finalOrder=txt;c.nextHearing='';
 x.subJudice=false;x.updated=fmtDate(new Date());
 x.history.push({stage:"Court judgement recorded",by:SESSION.name,when:x.updated,note:txt});
 DB.set(STATE);addAudit('SJ_JUDGEMENT','Recorded the judgement of '+c.courtName+' on '+id);
 closeModal();toast('Judgement recorded. The case is no longer sub-judice.');go('casedetail',id);}
function note(id,n,i){const g=(n.colour==='green');
 return '<div class="note '+n.colour+'"><div class="top"><span class="who">'+esc(n.by)+'</span>'+
 (n.role?'<span class="muted" style="font-size:11.5px">'+esc(n.role)+'</span>':'')+
 '<span class="badge '+(g?'frozen':'edit')+'">'+(g?'Green &middot; headquarters':'Yellow &middot; chain of command')+'</span></div>'+
 '<div class="txt">'+esc(n.text)+'</div><div class="when">'+n.when+' &middot; '+
 (n.hq?'issued by headquarters':(g?'carried green by the headquarters verdict':'raised in the chain of command, awaiting the headquarters verdict'))+
 '</div></div>';}
/* Headquarters is ADG HR. Its notings are green and they carry every earlier
   noting on the case green with them. Everyone below files yellow. */
function isHq(){return SESSION.role==="Super Admin";}
function addNote(id){const x=findCase(id);const t=(document.getElementById('newnote').value||'').trim();if(!t){toast('Type a noting first','err');return;}
 const hq=isHq();
 if(hq)x.notings.forEach(p=>{p.colour='green';});
 x.notings.push({by:SESSION.name+" ("+SESSION.role+")",role:SESSION.role,hq:hq,text:t,colour:hq?'green':'yellow',when:fmtDate(new Date())});
 x.updated=fmtDate(new Date());DB.set(STATE);
 addAudit('ADD_NOTING',(hq?'Headquarters verdict noting on ':'Noting on ')+id);
 toast(hq?'Verdict recorded. Every noting on this case is now green.':'Noting saved');go('casedetail',id);}
function caseAction(id,action,reason){const x=findCase(id),now=fmtDate(new Date());
 if(action==='approve'){x.status="In Progress";x.approved=true;x.history.push({stage:"Command approved",by:SESSION.name,when:now});addAudit('APPROVE_CASE','Approved '+id);toast('Case approved and now in progress');}
 if(action==='sendback'){x.history.push({stage:"Sent back",by:SESSION.name,when:now,note:reason||''});addAudit('SENDBACK','Sent back '+id+(reason?': '+reason:''));toast('Case sent back to the unit');}
 if(action==='resolve'){x.status="Resolved";x.resolution={outcome:"Resolved",reason:reason||'',by:SESSION.name,when:now};x.history.push({stage:"Case resolved",by:SESSION.name,when:now,note:reason||''});addAudit('RESOLVE_CASE','Resolved '+id);toast('Case marked resolved');}
 if(action==='close'){x.status="Closed";x.resolution={outcome:"Closed",reason:reason||'',by:SESSION.name,when:now};x.history.push({stage:"Case closed",by:SESSION.name,when:now,note:reason||''});addAudit('CLOSE_CASE','Closed '+id);toast('Case closed');}
 x.updated=now;DB.set(STATE);go('casedetail',id);}
function submitDraft(id){const x=findCase(id),now=fmtDate(new Date());
 if(x.applicant==="(draft)"||!x.armyNo){toast('Fill the applicant name and Army number on the case first','err');return;}
 x.status="In Progress";x.approved=false;x.filedDate=x.filedDate||now;x.updated=now;
 x.history.push({stage:"Submitted for approval",by:SESSION.name,when:now});
 DB.set(STATE);addAudit('SUBMIT_CASE','Submitted '+id+' for approval');
 toast('Case submitted. It is with Command for review.');go('casedetail',id);}
function caseCloseModal(id,mode){const isRes=(mode==='resolve');
 modal(isRes?'Mark This Case Resolved':'Close This Case',
  '<div class="pagesub" style="margin:0 0 14px">'+(isRes?'A resolved case has a decision on record and stays open until it is closed.':'Closing is final. The notings and the history stay on record for audit.')+'</div>'+
  '<div class="f"><label>Reason <span class="req">*</span></label>'+
  '<textarea id="clreason" style="height:96px" placeholder="'+(isRes?'Say what was decided and on what ground':'Say why the case is being closed')+'"></textarea>'+
  '<div class="hint">The reason is written to the case summary, the case history and the audit log.</div></div>',
  '<button class="btn ghost" onclick="closeModal()">Cancel</button>'+
  '<button class="btn prim" onclick="caseCloseGo(\''+id+'\',\''+mode+'\')">'+ic(isRes?'TickCircle':'CloseCircle',17)+(isRes?'Mark Resolved':'Close Case')+'</button>');}
function caseCloseGo(id,mode){const r=(document.getElementById('clreason').value||'').trim();
 if(r.length<5){toast('Enter a reason of at least five characters','err');return;}
 closeModal();caseAction(id,mode,r);}
/* ================= APPROVALS ================= */
const MONS={jan:0,feb:1,mar:2,apr:3,may:4,jun:5,jul:6,aug:7,sep:8,oct:9,nov:10,dec:11};
/* Dates are shown DD-MMM-YYYY everywhere (Indian convention); pdate() reads that back. */
function fmtDate(d){if(!d)return '';const x=(d instanceof Date)?d:(pdate(d)||new Date(d));if(isNaN(x))return String(d);
 const MM=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
 return String(x.getDate()).padStart(2,'0')+'-'+MM[x.getMonth()]+'-'+x.getFullYear();}
function fmtDT(d){const x=(d instanceof Date)?d:new Date(d);
 return fmtDate(x)+', '+x.toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit',hour12:false});}
function pdate(s){if(!s)return null;s=String(s).trim();let m;
 if((m=s.match(/^(\d{1,2})-([A-Za-z]{3})-(\d{4})$/)))return new Date(+m[3],MONS[m[2].toLowerCase()],+m[1]);
 if((m=s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/)))return new Date(+m[1],+m[2]-1,+m[3]);
 if((m=s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)))return new Date(+m[3],+m[2]-1,+m[1]);
 return null;}
function daysAgoOf(s){const d=pdate(s);return d?Math.max(0,Math.round((Date.now()-d)/864e5)):null;}
function waitDays(x){let d=daysAgoOf(x.updated);if(d==null)d=daysAgoOf(x.filedDate);return d==null?0:d;}
function slaLeft(x){const d=pdate(x.filedDate)||pdate(x.appDate);return d?180-Math.round((Date.now()-d)/864e5):null;}
function ageChip(x){const d=waitDays(x);const cls=d>7?' over':(d>3?' due':'');
 return '<span class="age'+cls+'">'+ic('Clock',13)+(d===0?'Filed today':'Waiting '+d+' day'+(d===1?'':'s'))+'</span>';}
let apq={q:"",cmd:""};
let apSel=[];
function apList(){let c=scoped().filter(pendingCase);
 if(apq.cmd)c=c.filter(x=>x.command===apq.cmd);
 if(apq.q){const q=apq.q.toLowerCase();c=c.filter(x=>(x.id+x.applicant+x.memberName+x.armyNo+x.command).toLowerCase().includes(q));}
 return sortRows('ap',c);}
let apPg={page:1,per:10};
function apPage(n){const t=apList().length,last=Math.max(1,Math.ceil(t/apPg.per));apPg.page=Math.min(Math.max(1,n),last);drawAp();}
function apPer(v){apPg.per=+v;apPg.page=1;drawAp();}
function vApprovals(m){
 apSel=[];
 const all=scoped().filter(pendingCase);
 const oldest=all.length?Math.max.apply(null,all.map(waitDays)):0;
 const cmds=all.filter((x,i,a)=>a.findIndex(y=>y.command===x.command)===i).length;
 const tile=(icon,val,lbl,warn)=>'<div class="qstat'+(warn?' warn':'')+'"><span class="qic">'+ic(icon,19)+'</span><div><div class="qv">'+val+'</div><div class="ql">'+lbl+'</div></div></div>';
 m.innerHTML='<div class="crumb">Home / Approvals</div>'+
 '<div class="pagehead"><div><div class="h2">Approvals</div><div class="pagesub">Cases waiting for your decision, oldest first. Approve, or send back to the unit with a reason.</div></div></div>'+
 '<div class="qsum">'+
   tile('ClipboardTick',all.length,'Waiting on you')+
   tile('Clock',oldest+(oldest===1?' day':' days'),'Longest wait',oldest>7)+
   tile('ShieldTick',cmds,cmds===1?'Command involved':'Commands involved')+
 '</div>'+
 '<div class="tools"><span class="fieldwrap"><span class="fic">'+ic('SearchNormal1',16)+'</span>'+
   '<input class="inp search-i" id="apqq" placeholder="Search by case number, applicant or member" value="'+esc(apq.q)+'" oninput="apq.q=this.value;apPg.page=1;drawAp()"></span>'+
   dd('apcmd',[{v:'',l:'All Commands'}].concat(COMMANDS),'All Commands','apq.cmd=v;apSel=[];apPg.page=1;drawAp()','sm',apq.cmd)+
   '<label class="selall"><input type="checkbox" id="apall" onclick="apToggleAll(this.checked)"> Select all</label>'+
 '</div><div id="apqlist"></div>';
 drawAp();
}
function drawAp(){const all=apList();
 const last=Math.max(1,Math.ceil(all.length/apPg.per));if(apPg.page>last)apPg.page=last;
 const c=pageSlice(all,apPg.page,apPg.per);
 const bulk=apSel.length?'<div class="bulkbar">'+ic('TickCircle',17)+apSel.length+' case'+(apSel.length===1?'':'s')+' selected<span class="sp"></span>'+
   '<button class="btn ghost sm" onclick="apSel=[];drawAp()">Clear Selection</button>'+
   '<button class="btn prim sm" onclick="apBulkApprove()">'+ic('TickCircle',16)+'Approve Selected</button></div>':'';
 document.getElementById('apqlist').innerHTML=bulk+(all.length?'<div class="card tblcard">'+
   '<div class="tblhead">Pending Cases<b>'+all.length+'</b></div>'+
   '<div class="tblwrap"><table class="tbl"><thead><tr>'+
   '<th class="cbxcol"><input type="checkbox" class="cbx" id="apallth" onclick="apToggleAll(this.checked)" aria-label="Select every case on this page"></th>'+
   th('ap','id','Case No')+th('ap','applicant','Applicant')+th('ap','member','Service member')+th('ap','command','Command and unit')+
   th('ap','maintenance','Maintenance','num')+th('ap','wait','Waiting')+'<th>Actions</th>'+
 '</tr></thead><tbody>'+
   c.map(x=>{const on=apSel.indexOf(x.id)>-1;
   return '<tr'+(on?' class="sel"':'')+'>'+
     '<td class="cbxcol"><input type="checkbox" class="cbx"'+(on?' checked':'')+' onclick="apToggle(&quot;'+x.id+'&quot;)" aria-label="Select case '+x.id+'"></td>'+
     '<td><b>'+x.id+'</b></td>'+
     '<td>'+esc(x.applicant)+' <span class="muted">('+x.relation+')</span></td>'+
     '<td>'+esc(x.memberName)+' <span class="muted">('+x.armyNo+')</span></td>'+
     '<td>'+x.command+' <span class="muted">&middot; '+esc(x.unit)+'</span></td>'+
     '<td class="num">'+esc(x.maintenance||'-')+'</td>'+
     '<td>'+ageChip(x)+'</td>'+
     '<td class="nowrap"><button class="btn prim sm" onclick="apApprove(&quot;'+x.id+'&quot;)">'+ic('TickCircle',15)+'Approve</button>'+
       '<span class="act" onclick="go(&quot;casedetail&quot;,&quot;'+x.id+'&quot;)">'+ic('Eye',15)+'View case</span></td>'+
   '</tr>';}).join('')+
 '</tbody></table></div>'+tblFoot('ap',apPg.page,apPg.per,all.length)+'</div>'
  :(apq.q||apq.cmd?emptyState('SearchNormal1','No cases match these filters','Clear the search or choose a different command to see more.')
   :emptyState('ClipboardTick','Nothing waiting on you','Cases appear here when a unit submits them for approval.')));
 const done=c.length>0&&c.every(x=>apSel.indexOf(x.id)>-1);
 const a=document.getElementById('apall');if(a)a.checked=done;
 const t=document.getElementById('apallth');if(t)t.checked=done;
}
function apToggle(id){const i=apSel.indexOf(id);if(i>-1)apSel.splice(i,1);else apSel.push(id);drawAp();}
function apToggleAll(on){apSel=on?pageSlice(apList(),apPg.page,apPg.per).map(x=>x.id):[];drawAp();}
function apApprove(id){const x=findCase(id);
 modal('Approve This Case',
  '<div class="pagesub" style="margin:0 0 14px">The case is approved and stays in progress, the unit is notified and the decision is written to the audit log.</div>'+
  '<div class="card" style="background:var(--bg-light)">'+kv('Case number',x.id)+kv('Applicant',x.applicant+' ('+x.relation+')')+
   kv('Service member',x.memberName+' ('+x.armyNo+')')+kv('Command',x.command)+kv('Maintenance sought',x.maintenance||'-')+'</div>',
  '<button class="btn ghost" onclick="closeModal()">Cancel</button>'+
  '<button class="btn prim" onclick="closeModal();caseAction(\''+id+'\',\'approve\');go(\'approvals\')">'+ic('TickCircle',17)+'Confirm Approval</button>');}
function apSendBack(id){
 modal('Send Back to Unit',
  '<div class="pagesub" style="margin:0 0 14px">Case '+id+' returns to the originating unit. It leaves your queue until the unit resubmits it.</div>'+
  '<div class="f"><label>Reason for sending back <span class="req">*</span></label>'+
  '<textarea id="sbreason" style="height:96px" placeholder="Say what the unit must correct or attach"></textarea>'+
  '<div class="hint">The reason is added to the case history and shown to the unit.</div></div>',
  '<button class="btn ghost" onclick="closeModal()">Cancel</button>'+
  '<button class="btn prim" onclick="apSendBackGo(\''+id+'\')">'+ic('ArrowLeft2',17)+'Send Back to Unit</button>');}
function apSendBackGo(id){const r=(document.getElementById('sbreason').value||'').trim();
 if(r.length<5){toast('Enter a reason of at least five characters','err');return;}
 closeModal();caseAction(id,'sendback',r);go('approvals');}
function apBulkApprove(){const ids=apSel.slice();
 modal('Approve '+ids.length+' Cases',
  '<div class="pagesub" style="margin:0 0 14px">Each case below is approved and is written to the audit log separately.</div>'+
  '<div class="card" style="background:var(--bg-light)">'+ids.map(i=>{const x=findCase(i);
    return '<div class="kv"><span class="k">'+i+'</span><span class="v">'+esc(x.applicant)+' &middot; '+x.command+'</span></div>';}).join('')+'</div>',
  '<button class="btn ghost" onclick="closeModal()">Cancel</button>'+
  '<button class="btn prim" onclick="apBulkGo()">'+ic('TickCircle',17)+'Approve All '+ids.length+'</button>');}
function apBulkGo(){const ids=apSel.slice();closeModal();
 ids.forEach(i=>{const x=findCase(i);if(!x||!pendingCase(x))return;
   x.approved=true;x.history.push({stage:"Command approved",by:SESSION.name,when:fmtDate(new Date())});
   x.updated=fmtDate(new Date());addAudit('APPROVE_CASE','Approved '+i);});
 DB.set(STATE);apSel=[];toast(ids.length+' cases approved and now in progress');go('approvals');}
/* ================= REPORTS ================= */
function vReports(m){
 m.innerHTML='<div class="crumb">Home / Reports</div><div class="pagehead"><div><div class="h2">Reports</div><div class="pagesub">Build a filtered report, then export or print it.</div></div></div>'+
 '<div class="card" style="margin-bottom:16px"><div class="tools" style="margin:0">'+
   dd('rt',[{v:'summary',l:'Case Summary Report'},{v:'cmd',l:'Command-wise Report'},{v:'pending',l:'Pending Approvals Report'}],'Case Summary Report','','sm rt-dd','summary')+
   dd('rcmd',[{v:'',l:'All Commands'}].concat(COMMANDS),'All Commands','','sm')+
   dd('rstat',[{v:'',l:'All Status'}].concat(STATUSES).concat(['Sub-judice']),'All Status','','sm')+
   '<div class="sp" style="flex:1"></div><button class="btn prim" onclick="genReport()">'+ic('Chart21',17)+'Generate Report</button>'+
   '<button class="btn ghost" onclick="exportReportPdf()">'+ic('DocumentDownload',17)+'Export to PDF</button><button class="btn ghost" onclick="exportReportPdf()">'+ic('Printer',17)+'Print Report</button></div></div>'+
 '<div id="reportArea"></div>';genReport();
}
function reportData(){const type=document.getElementById('rt').value;let c=scoped();
 const cmd=document.getElementById('rcmd').value,st=document.getElementById('rstat').value;
 if(cmd)c=c.filter(x=>x.command===cmd);
 if(st==='Sub-judice')c=c.filter(x=>x.subJudice);else if(st)c=c.filter(x=>x.status===st);
 if(type==='pending')c=c.filter(pendingCase);
 const title=type==='cmd'?'Command-wise Report':type==='pending'?'Pending Approvals Report':'Case Summary Report';
 return {c,title};}
/* Renders the report into a standalone A4 sheet and hands it to the browser
   print dialog, where "Save as PDF" writes the file. No library, nothing fetched. */
function exportReportPdf(){
 const r=reportData(),c=r.c,title=r.title;
 const cmd=(document.getElementById('rcmd')||{}).value||'All commands';
 const st=(document.getElementById('rstat')||{}).value||'All statuses';
 const when=fmtDate(new Date());
 const mark=esc(SESSION.name+' . '+SESSION.role+' . '+SESSION.ip);
 const meta=(k,v)=>'<div><span>'+k+'</span><b>'+esc(v)+'</b></div>';
 const body=c.length?c.map(x=>'<tr><td class="mono">'+esc(x.id)+'</td><td>'+esc(x.applicant)+' <i>('+esc(x.relation)+')</i></td>'+
   '<td>'+esc(x.memberName)+' <i>'+esc(x.armyNo)+'</i></td><td>'+esc(x.command)+'</td>'+
   '<td class="num">'+esc(x.maintenance||'-')+'</td><td>'+esc(x.status)+(x.subJudice?' <i>(sub-judice)</i>':'')+'</td></tr>').join('')
   :'<tr><td colspan="6" class="none">No records match this filter.</td></tr>';
 const html='<!doctype html><html><head><meta charset="utf-8"><title>MAARK - '+esc(title)+'</title><style>'+
  '@page{size:A4 portrait;margin:0}'+
  '*{box-sizing:border-box;margin:0;padding:0;font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;-webkit-print-color-adjust:exact;print-color-adjust:exact}'+
  'body{color:#252F4A;font-size:10.5px;line-height:1.45;background:#6B7280;padding:20px 0}'+
  '.bar{position:fixed;top:0;left:0;right:0;height:48px;z-index:5;background:#071437;color:#fff;display:flex;align-items:center;gap:10px;padding:0 16px;font-size:12px}'+
  '.bar b{font-weight:600}.bar .sp{flex:1}'+
  '.bar button{height:32px;padding:0 14px;border:none;border-radius:7px;background:#184A2C;color:#fff;font-size:12px;font-weight:600;cursor:pointer}'+
  '.bar button.gh{background:rgba(255,255,255,.14)}'+
  '.page{position:relative;width:210mm;min-height:297mm;margin:68px auto 0;background:#fff;padding:14mm 12mm 16mm;box-shadow:0 10px 30px rgba(0,0,0,.35);overflow:hidden}'+
  '.wm{position:absolute;top:-50%;left:-50%;width:200%;height:200%;z-index:0;pointer-events:none;display:flex;flex-direction:column;align-items:flex-start;gap:26px;transform:rotate(-32deg)}'+
  '.wm span{display:block;flex:none;font-size:13px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:rgba(24,74,44,.07);white-space:nowrap}'+
  '@media print{body{background:#fff;padding:0}.bar{display:none}.page{width:auto;min-height:0;margin:0;padding:14mm 12mm 16mm;box-shadow:none;overflow:visible}.wm{position:fixed}}'+
  '.sheet{position:relative;z-index:1}'+
  '.hd{display:flex;align-items:flex-start;gap:10px;border-bottom:2px solid #184A2C;padding-bottom:10px}'+
  '.mk{flex:none;background:#184A2C;color:#fff;font-size:10px;font-weight:800;letter-spacing:1.4px;padding:7px 10px;border-radius:5px}'+
  '.hd b{display:block;font-size:12.5px;color:#071437}.hd small{display:block;font-size:9.5px;color:#78829D;margin-top:1px}'+
  '.conf{margin-left:auto;border:1px solid #F8285A;color:#E82646;font-size:8.5px;font-weight:700;letter-spacing:1px;padding:3px 8px;border-radius:20px;text-transform:uppercase}'+
  '.ti{display:flex;align-items:baseline;gap:8px;margin-top:12px}'+
  '.ti h1{font-size:15px;font-weight:700;color:#071437}.ti em{font-style:normal;font-size:9.5px;color:#78829D}'+
  '.mt{display:grid;grid-template-columns:repeat(4,1fr);gap:6px 14px;margin:10px 0 12px;padding:8px 10px;background:#F4F6F8;border-radius:6px}'+
  '.mt span{display:block;font-size:8px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;color:#99A1B7}'+
  '.mt b{display:block;font-size:10px;color:#071437;margin-top:1px}'+
  'table{width:100%;border-collapse:collapse}'+
  'thead{display:table-header-group}tr{page-break-inside:avoid}'+
  'th{text-align:left;font-size:8.5px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;color:#4B5675;background:#EBEDF3;padding:7px 8px;border-bottom:1px solid #C4CADA}'+
  'td{padding:7px 8px;border-bottom:1px solid #EBEDF3;font-size:10px;color:#252F4A;vertical-align:top}'+
  'td i{font-style:normal;color:#78829D}td.mono{font-weight:600;color:#071437;white-space:nowrap}'+
  'th.num,td.num{text-align:right;white-space:nowrap}'+
  'td.none{text-align:center;color:#78829D;padding:18px}'+
  '.ft{margin-top:12px;padding-top:8px;border-top:1px solid #EBEDF3;display:flex;gap:10px;font-size:8.5px;color:#99A1B7}'+
  '.ft span:last-child{margin-left:auto}'+
  '</style></head><body>'+
  '<div class="bar"><b>'+esc(title)+'</b><span>A4 portrait &middot; '+c.length+(c.length===1?' record':' records')+'</span><span class="sp"></span>'+
  '<button onclick="window.print()">Save as PDF</button><button class="gh" onclick="window.close()">Close</button></div>'+
  '<div class="page"><div class="wm">'+wmSpans(SESSION.name+' · '+SESSION.role+' · '+SESSION.ip)+'</div><div class="sheet">'+
  '<div class="hd"><span class="mk">MAARK</span><div><b>Additional Directorate General of Human Rights</b>'+
  '<small>MAARK 2.0 &middot; maintenance allowance case system</small></div><span class="conf">Confidential</span></div>'+
  '<div class="ti"><h1>'+esc(title)+'</h1><em>'+c.length+(c.length===1?' record':' records')+'</em></div>'+
  '<div class="mt">'+meta('Generated on',when)+meta('Generated by',SESSION.name+' ('+SESSION.role+')')+meta('Command',cmd)+meta('Status',st)+'</div>'+
  '<table><thead><tr><th>Case No</th><th>Applicant</th><th>Member</th><th>Command</th><th class="num">Maintenance</th><th>Status</th></tr></thead>'+
  '<tbody>'+body+'</tbody></table>'+
  '<div class="ft"><span>Watermarked with user ID, machine IP and timestamp &middot; '+mark+'</span><span>'+when+'</span></div>'+
  '</div></div></body></html>';
 const w=window.open('','_blank');
 if(!w){toast('Allow pop-ups to export the PDF','err');return;}
 w.document.open();w.document.write(html);w.document.close();
 w.focus();setTimeout(()=>w.print(),350);
 addAudit('EXPORT_REPORT',title+' exported to PDF');
 toast('A4 report ready. Choose Save as PDF in the print dialog.');
}
function rptHead(title,c){
 const cmd=(document.getElementById('rcmd')||{}).value||'All commands';
 const st=(document.getElementById('rstat')||{}).value||'All statuses';
 const meta=(k,v)=>'<div><span class="k">'+k+'</span><span class="v">'+esc(v)+'</span></div>';
 return '<div class="rh">'+
  '<div class="rh-top"><div class="rh-brand"><span class="rh-mark">MAARK</span>'+
   '<div><b>Additional Directorate General of Human Rights</b><small>MAARK 2.0 &middot; maintenance allowance case system</small></div></div>'+
   '<span class="rh-stamp">'+ic('ShieldTick',13)+'Confidential</span></div>'+
  '<div class="rh-title"><h4>'+title+'</h4><span class="rh-count">'+c.length+(c.length===1?' record':' records')+'</span></div>'+
  '<div class="rh-meta">'+meta('Generated on',fmtDate(new Date()))+meta('Generated by',SESSION.name+' ('+SESSION.role+')')+
   meta('Command',cmd)+meta('Status',st)+'</div></div>';}
function genReport(){const{c,title}=reportData();
 const wm=wmSpans(SESSION.name+' · '+SESSION.role+' · '+SESSION.ip);
 document.getElementById('reportArea').innerHTML='<div class="card sheet"><div class="wm">'+wm+'</div>'+
   rptHead(title,c)+
   '<div class="tblwrap"><table class="tbl"><thead><tr>'+
   th('rep','id','Case No')+th('rep','applicant','Applicant')+th('rep','member','Member')+th('rep','command','Command')+th('rep','maintenance','Maintenance','num')+th('rep','status','Status')+
   '</tr></thead><tbody>'+
   (c.length?sortRows('rep',c).map(x=>'<tr><td>'+x.id+'</td><td>'+esc(x.applicant)+'</td><td>'+esc(x.memberName)+'</td><td>'+x.command+'</td><td class="num">'+(x.maintenance||'-')+'</td><td>'+statCell(x)+'</td></tr>').join(''):'<tr><td colspan="6" class="muted" style="text-align:center;padding:20px">No records.</td></tr>')+
   '</tbody></table></div><div style="text-align:center;color:var(--text-4);font-size:12px;margin-top:14px;position:relative">Digitally watermarked with machine IP, user ID and timestamp</div></div>';
 addAudit('GENERATE_REPORT',title);
}
/* ================= CMS ================= */
function vCms(m){const s=STATE.cms;
 m.innerHTML='<div class="crumb">Home / Content Management</div><div class="pagehead"><div><div class="h2">Content Management System</div><div class="pagesub">Text and pages shown to unit users inside the portal.</div></div></div>'+
 '<div class="row2"><div class="card" style="flex:1;min-width:280px"><div class="sech">Web Settings</div>'+
   '<div class="f"><label>Portal title</label><input id="cms_t" value="'+esc(s.portalTitle)+'"></div>'+
   '<div class="f"><label>Home banner text</label><input id="cms_b" value="'+esc(s.banner)+'"></div>'+
   '<div class="f"><label>Primary colour</label>'+dd('cms_pc',Object.keys(PALETTE),'Select','previewPrimary(v)','',s.primary)+
     '<div class="swrow">'+Object.keys(PALETTE).map(k=>'<span class="sw'+(k===s.primary?' on':'')+'" data-k="'+k+'" title="'+esc(k)+'" style="background:'+PALETTE[k]+'" onclick="previewPrimary(\''+k+'\',1)"></span>').join('')+'</div>'+
     '<div class="hint">Preview applies at once. Save Settings to keep it.</div></div>'+
   '<div class="f"><label>Notice</label><textarea id="cms_n">'+esc(s.notice)+'</textarea></div>'+
   '<button class="btn prim" onclick="saveCms()">'+ic('TickCircle',17)+'Save Settings</button></div>'+
 '<div class="card" style="flex:1;min-width:280px"><div class="sech">Pages and Content</div>'+
   s.pages.map((p,i)=>'<div class="aitem" style="cursor:default">'+esc(p)+'<span class="act" style="margin-left:auto" onclick="editPageIdx('+i+')">'+ic('Edit2',15)+'Edit content</span><span class="act" onclick="deletePageIdx('+i+')">'+ic('Trash',15)+'Remove Page</span></div>').join('')+
   '<button class="btn ghost sm" style="margin-top:12px" onclick="addPage()">'+ic('AddCircle',16)+'Add New Page</button></div></div>'+
 '<div class="muted" style="font-size:12.5px;margin-top:12px">Every content change is audit-logged. Access is limited to the Super Admin.</div>';
}
function previewPrimary(k,sync){applyPrimary(k);
 if(sync){const h=document.getElementById('cms_pc');if(h){h.value=k;const d=h.parentNode;d.querySelector('.ddv').textContent=k;d.querySelector('.ddv').classList.remove('ph');
  d.querySelectorAll('.ddo').forEach(o=>{const on=o.dataset.v===k;o.classList.toggle('on',on);const t=o.querySelector('.ddk');if(t)t.remove();if(on)o.insertAdjacentHTML('beforeend','<span class="ddk">'+ic('TickCircle',16)+'</span>');});}}
 document.querySelectorAll('.swrow .sw').forEach(s=>s.classList.toggle('on',s.dataset.k===k));}
function saveCms(){STATE.cms.portalTitle=val('cms_t');STATE.cms.banner=val('cms_b');STATE.cms.primary=document.getElementById('cms_pc').value;STATE.cms.notice=val('cms_n');applyPrimary(STATE.cms.primary);DB.set(STATE);addAudit('CMS_UPDATE','Updated web settings');toast('Web settings saved');}
function editPageIdx(i){const name=STATE.cms.pages[i];const content=(STATE.cms.content&&STATE.cms.content[name])||('Draft content for the '+name+' page.');
 modal('Edit Page: '+esc(name),
  '<div class="f"><label>Page title</label><input id="pg_t" value="'+esc(name)+'"></div>'+
  '<div class="f"><label>Page content</label><textarea id="pg_c" style="height:150px">'+esc(content)+'</textarea></div>',
  '<button class="btn ghost" onclick="closeModal()">Cancel</button><button class="btn prim" onclick="savePageIdx('+i+')">Save Page</button>');}
function savePageIdx(i){const old=STATE.cms.pages[i];const nt=(val('pg_t')||old);const c=document.getElementById('pg_c').value;
 STATE.cms.content=STATE.cms.content||{};STATE.cms.pages[i]=nt;if(old!==nt)delete STATE.cms.content[old];STATE.cms.content[nt]=c;
 DB.set(STATE);addAudit('CMS_PAGE','Edited page: '+nt);closeModal();toast('Page saved');go('cms');}
function addPage(){modal('Add New Page',
  '<div class="f"><label>Page title</label><input id="pg_nt" placeholder="Enter page title"></div>'+
  '<div class="f"><label>Page content</label><textarea id="pg_nc" style="height:120px" placeholder="Enter page text"></textarea></div>',
  '<button class="btn ghost" onclick="closeModal()">Cancel</button><button class="btn prim" onclick="createPage()">Add Page</button>');}
function createPage(){const t=val('pg_nt');if(!t){toast('Enter a page title','err');return;}
 STATE.cms.content=STATE.cms.content||{};STATE.cms.pages.push(t);STATE.cms.content[t]=document.getElementById('pg_nc').value;
 DB.set(STATE);addAudit('CMS_PAGE','Added page: '+t);closeModal();toast('Page added');go('cms');}
function deletePageIdx(i){const name=STATE.cms.pages[i];
 modal('Remove Page','<p style="font-size:14px;color:var(--text-2)">Remove the page <b>'+esc(name)+'</b>? This is audit-logged.</p>',
  '<button class="btn ghost" onclick="closeModal()">Cancel</button><button class="btn prim" style="background:var(--error-active)" onclick="confirmDeletePage('+i+')">'+ic('Trash',15)+'Remove Page</button>');}
function confirmDeletePage(i){const name=STATE.cms.pages[i];STATE.cms.pages.splice(i,1);if(STATE.cms.content)delete STATE.cms.content[name];
 DB.set(STATE);addAudit('CMS_PAGE','Removed page: '+name);closeModal();toast('Page removed');go('cms');}
/* ================= KNOWLEDGE BASE =================
   The article set the AI Assistant reads. Published articles answer questions
   in the assistant, drafts are held back until they are published. */
const KB_CATS=["Policy","Eligibility","Workflow","Security","FAQ"];
const KB_STATUS=["Published","Draft"];
let kbFilter={q:"",status:"all",cat:"",page:1,per:10};
function kbList(){if(!STATE.kb)STATE.kb=[];return STATE.kb;}
function kbFind(id){return kbList().filter(x=>x.id===id)[0];}
function kbPage(n){const t=kbRows().length,last=Math.max(1,Math.ceil(t/kbFilter.per));kbFilter.page=Math.min(Math.max(1,n),last);drawKb();}
function kbPer(v){kbFilter.per=+v;kbFilter.page=1;drawKb();}
function kbRows(){let r=kbList().slice();
 if(kbFilter.status!=='all')r=r.filter(x=>x.status===kbFilter.status);
 if(kbFilter.cat)r=r.filter(x=>x.cat===kbFilter.cat);
 if(kbFilter.q){const q=kbFilter.q.toLowerCase();
   r=r.filter(x=>(x.title+' '+x.cat+' '+x.source+' '+(x.tags||'')+' '+x.body).toLowerCase().includes(q));}
 return r;}
function kbChip(s){return '<span class="achip a-'+(s==='Published'?'success':'muted')+'">'+ic(s==='Published'?'TickCircle':'Edit2',14)+s+'</span>';}
function kbKpi(lbl,v,color,icn){return '<div class="kpi" style="cursor:default"><div class="kico" style="background:color-mix(in srgb,'+color+' 12%,#fff);color:'+color+'">'+ic(icn,19)+'</div><div class="kbody"><div class="val">'+v+'</div><div class="lbl">'+lbl+'</div></div></div>';}
function vKb(m){const a=kbList();
 m.innerHTML='<div class="crumb">Home / Knowledge Base</div>'+
 '<div class="pagehead"><div><div class="h2">Knowledge Base</div><div class="pagesub">The policy and guidance articles the AI Assistant answers from. Published articles are read by the assistant, drafts are not.</div></div>'+
  '<div class="acts"><button class="btn ghost" onclick="go(\'assistant\')">'+ic('Messages2',17)+'Open Assistant</button>'+
   '<button class="btn ghost" onclick="kbAdd(\'upload\')">'+ic('DocumentUpload',17)+'Upload Document</button>'+
   '<button class="btn prim" onclick="kbAdd()">'+ic('AddCircle',17)+'Add Article</button></div></div>'+
 '<div class="kpis">'+
   kbKpi('Articles',a.length,'var(--primary)','Book1')+
   kbKpi('Published',a.filter(x=>x.status==='Published').length,'var(--success-active)','TickCircle')+
   kbKpi('Drafts',a.filter(x=>x.status==='Draft').length,'var(--warning-active)','Edit2')+
   kbKpi('Categories',KB_CATS.length,'var(--info-active)','Element3')+
 '</div>'+
 '<div class="tools"><span class="fieldwrap"><span class="fic">'+ic('SearchNormal1',16)+'</span><input class="inp search-i" id="kbq" placeholder="Search articles" value="'+esc(kbFilter.q)+'" oninput="kbFilter.q=this.value;kbFilter.page=1;drawKb()"></span>'+
   dd('kbcat',[{v:'',l:'All Categories'}].concat(KB_CATS),'All Categories','kbFilter.cat=v;kbFilter.page=1;drawKb()','sm',kbFilter.cat)+
 '</div>'+
 '<div id="kbtable"></div>'+
 '<div class="muted" style="font-size:12.5px;margin-top:12px">Every article change is audit-logged. The assistant answers from published articles only, and quotes the source line back to the reader.</div>';
 drawKb();
}
function kbTabs(){const a=kbList();const cnt=s=>a.filter(x=>x.status===s).length;
 return '<div class="ltabs">'+['all'].concat(KB_STATUS).map(s=>
   '<span class="ltab'+(kbFilter.status===s?' on':'')+'" onclick="kbFilter.page=1;kbFilter.status=&quot;'+s+'&quot;;drawKb()">'+
   (s==='all'?'All':s)+'<b>'+(s==='all'?a.length:cnt(s))+'</b></span>').join('')+'</div>';}
function drawKb(){const all=sortRows('kb',kbRows());
 const last=Math.max(1,Math.ceil(all.length/kbFilter.per));if(kbFilter.page>last)kbFilter.page=last;
 const r=pageSlice(all,kbFilter.page,kbFilter.per);
 document.getElementById('kbtable').innerHTML='<div class="card tblcard">'+kbTabs()+(all.length?'<div class="tblwrap"><table class="tbl"><thead><tr>'+
   th('kb','title','Article')+th('kb','cat','Category')+th('kb','source','Source')+th('kb','status','Status')+th('kb','updated','Updated','num')+
   '<th>Actions</th></tr></thead><tbody>'+
   r.map(x=>'<tr><td><b>'+esc(x.title)+'</b><div class="muted" style="font-size:12px">'+esc(x.id)+
     (x.file?'<span class="kbfile" title="Source document">'+ic('DocumentText',13)+esc(x.file)+'</span>':'')+'</div></td>'+
     '<td>'+esc(x.cat)+'</td><td class="muted">'+esc(x.source)+'</td><td>'+kbChip(x.status)+'</td><td class="num">'+esc(x.updated)+'</td>'+
     '<td class="nowrap"><span class="act" onclick="kbView(\''+x.id+'\')">'+ic('Eye',15)+'Read</span>'+
     '<span class="act" onclick="kbEdit(\''+x.id+'\')">'+ic('Edit2',15)+'Edit</span>'+
     '<span class="act" onclick="kbRemove(\''+x.id+'\')">'+ic('Trash',15)+'Remove</span></td></tr>').join('')+
 '</tbody></table></div>'+tblFoot('kb',kbFilter.page,kbFilter.per,all.length)
   :emptyState('Book1','No articles match these filters','Clear a filter or change the search term, or add a new article.'))+'</div>';}
function kbForm(x,mode){x=x||{};
 const up=mode==='upload'||!!x.file;
 return (x.id?'':'<div class="kbmode">'+
   '<span class="kbm'+(mode==='upload'?'':' on')+'" onclick="kbAdd()">'+ic('Edit2',15)+'Write article</span>'+
   '<span class="kbm'+(mode==='upload'?' on':'')+'" onclick="kbAdd(\'upload\')">'+ic('DocumentUpload',15)+'Upload document</span></div>')+
  (up?'<div class="f"><label>Document</label>'+
    '<div class="up'+(x.file?' done':'')+'" id="kb_up" style="cursor:pointer" onclick="kbPickFile(this)">'+(x.file?'&#10003; '+esc(x.file)+' attached':'Click to attach a PDF, a Word file or a scanned policy letter')+'</div>'+
    '<input type="hidden" id="kb_file" value="'+esc(x.file||'')+'">'+
    '<div class="hint">The text is read out of the document on upload. Check it below before you publish.</div></div>':'')+
  '<div class="f"><label>Title<span class="req">*</span></label><input id="kb_t" value="'+esc(x.title||'')+'" placeholder="For example, who is eligible for maintenance"></div>'+
  '<div class="grid2">'+
   '<div class="f"><label>Category</label>'+dd('kb_c',KB_CATS,'Select category','','',x.cat||'Policy')+'</div>'+
   '<div class="f"><label>Status</label>'+dd('kb_s',KB_STATUS,'Select status','','',x.status||'Draft')+'</div>'+
  '</div>'+
  '<div class="f"><label>Source reference</label><input id="kb_src" value="'+esc(x.source||'')+'" placeholder="For example, Policy set, clause 2.1"><div class="hint">Shown under every assistant answer that uses this article.</div></div>'+
  '<div class="f"><label>Keywords</label><input id="kb_tg" value="'+esc(x.tags||'')+'" placeholder="Separate words with a space"><div class="hint">The assistant matches a question against the title and these words.</div></div>'+
  '<div class="f"><label>Article text<span class="req">*</span></label><textarea id="kb_b" style="height:150px" placeholder="Write the answer in plain English">'+esc(x.body||'')+'</textarea></div>';}
function kbRead(){const f=document.getElementById('kb_file');
 return {title:val('kb_t'),cat:document.getElementById('kb_c').value||'Policy',status:document.getElementById('kb_s').value||'Draft',
  source:val('kb_src')||'-',tags:val('kb_tg'),body:document.getElementById('kb_b').value.trim(),file:f?f.value:''};}
/* Prototype file picker. Nothing leaves the machine, the name is kept on the
   article and the text area is filled with the read-out placeholder. */
const KB_FILES=["Policy-set-clause.pdf","ADG-HR-letter.pdf","Maintenance-guidelines.docx","Court-order-extract.pdf","Standing-instruction.pdf"];
function kbPickFile(el){const n=KB_FILES[Math.floor(Math.random()*KB_FILES.length)];
 uploadDemo(el,n);
 const h=document.getElementById('kb_file');if(h)h.value=n;
 const src=document.getElementById('kb_src');if(src&&!src.value)src.value=n;
 const t=document.getElementById('kb_t');if(t&&!t.value)t.value=n.replace(/[.][a-z]+$/i,'').replace(/-/g,' ');
 const b=document.getElementById('kb_b');if(b&&!b.value.trim())b.value='Text read from '+n+'. Check it, edit anything the reader should not see, then set the status to Published.';
 toast('Document attached, text read out');}
function kbWide(){const m=document.querySelector('#modalRoot .modal');if(m)m.classList.add('wide');}
function kbAdd(mode){modal(mode==='upload'?'Upload Document':'Add Article',kbForm(null,mode),
 '<button class="btn ghost" onclick="closeModal()">Cancel</button><button class="btn prim" onclick="kbCreate()">'+ic('TickCircle',17)+'Save Article</button>');kbWide();}
function kbCreate(){const d=kbRead();
 if(!d.title||!d.body){toast('Enter a title and the article text','err');return;}
 STATE.seq=(STATE.seq||143)+1;
 d.id='KB-'+String(1000+STATE.seq).slice(-4);d.updated=fmtDate(new Date());
 kbList().unshift(d);DB.set(STATE);addAudit('KB_ADD','Added article: '+d.title);closeModal();toast('Article added');go('kb');}
function kbEdit(id){const x=kbFind(id);if(!x)return;
 modal('Edit Article',kbForm(x),
  '<button class="btn ghost" onclick="closeModal()">Cancel</button><button class="btn prim" onclick="kbSave(\''+id+'\')">'+ic('TickCircle',17)+'Save Article</button>');kbWide();}
function kbSave(id){const x=kbFind(id);if(!x)return;const d=kbRead();
 if(!d.title||!d.body){toast('Enter a title and the article text','err');return;}
 Object.assign(x,d,{updated:fmtDate(new Date())});
 DB.set(STATE);addAudit('KB_EDIT','Edited article: '+x.title);closeModal();toast('Article saved');go('kb');}
function kbView(id){const x=kbFind(id);if(!x)return;
 modal(esc(x.title),
  '<div class="kvgrid">'+kv('Article',x.id)+kv('Category',x.cat)+kv('Source',x.source)+kv('Status',x.status)+kv('Updated',x.updated)+'</div>'+
  '<div class="f" style="margin-top:12px"><label>Article text</label><div class="kbtext">'+esc(x.body)+'</div></div>'+
  (x.file?'<div class="doc" style="margin-top:12px"><span class="dic">'+ic('DocumentText',16)+'</span><span class="dn">'+esc(x.file)+'</span>'+
    '<span class="act" style="margin-left:auto" onclick="previewDoc(\''+x.id+'\',\''+esc(x.file)+'\')">'+ic('Eye',15)+'Preview</span></div>':'')+
  (x.tags?'<div class="mfollow">'+x.tags.split(/\s+/).filter(Boolean).map(t=>'<span class="pill" style="cursor:default">'+esc(t)+'</span>').join('')+'</div>':''),
  '<button class="btn ghost" onclick="closeModal()">Close</button><button class="btn prim" onclick="closeModal();kbEdit(\''+id+'\')">'+ic('Edit2',17)+'Edit Article</button>');kbWide();}
function kbRemove(id){const x=kbFind(id);if(!x)return;
 modal('Remove Article','<p style="font-size:14px;color:var(--text-2)">Remove <b>'+esc(x.title)+'</b> from the knowledge base? The assistant will stop answering from it. This is audit-logged.</p>',
  '<button class="btn ghost" onclick="closeModal()">Cancel</button><button class="btn prim" style="background:var(--error-active)" onclick="kbConfirmRemove(\''+id+'\')">'+ic('Trash',15)+'Remove Article</button>');}
function kbConfirmRemove(id){const x=kbFind(id);if(!x)return;
 STATE.kb=kbList().filter(a=>a.id!==id);DB.set(STATE);addAudit('KB_DELETE','Removed article: '+x.title);closeModal();toast('Article removed');go('kb');}
/* Question matching for the assistant. Scores the published set on the words of
   the question against title, keywords and category, best article wins. */
function kbMatch(q){
 const stop=['what','which','who','how','the','and','for','are','is','do','does','can','my','me','in','on','of','a','an','to','i','it','about','tell','show','explain'];
 const w=String(q||'').toLowerCase().replace(/[^a-z0-9 ]/g,' ').split(/\s+/).filter(t=>t.length>2&&stop.indexOf(t)<0);
 if(!w.length)return null;
 let best=null,score=0;
 kbList().filter(x=>x.status==='Published').forEach(x=>{
  const t=(x.title+' '+(x.tags||'')+' '+x.cat).toLowerCase(),b=x.body.toLowerCase();
  let s=0;w.forEach(k=>{if(t.indexOf(k)>=0)s+=3;else if(b.indexOf(k)>=0)s+=1;});
  if(s>score){score=s;best=x;}});
 return score>=3?best:null;}
/* ================= AUDIT ================= */
const AUD_META={
 LOGIN:{l:'Signed in',g:'access',ic:'Profile',c:'info'},
 VIEW_DOCUMENT:{l:'Document viewed',g:'access',ic:'Eye',c:'info'},
 CREATE_CASE:{l:'Case registered',g:'case',ic:'AddCircle',c:'primary'},
 ADD_NOTING:{l:'Noting added',g:'case',ic:'NoteText',c:'primary'},
 APPROVE_CASE:{l:'Case approved',g:'approval',ic:'TickCircle',c:'success'},
 SUBMIT_CASE:{l:'Case submitted',g:'approval',ic:'Send2',c:'primary'},
 SENDBACK:{l:'Sent back',g:'approval',ic:'ArrowLeft2',c:'warning'},
 SUBJUDICE:{l:'Marked sub-judice',g:'approval',ic:'Judge',c:'warning'},
 SJ_HEARING:{l:'Hearing recorded',g:'approval',ic:'Clock',c:'warning'},
 SJ_TRANSFER:{l:'Court changed',g:'approval',ic:'Refresh2',c:'warning'},
 SJ_JUDGEMENT:{l:'Judgement recorded',g:'approval',ic:'Verify',c:'success'},
 CLOSE_CASE:{l:'Case closed',g:'approval',ic:'CloseCircle',c:'muted'},
 GENERATE_REPORT:{l:'Report generated',g:'report',ic:'Chart21',c:'info'},
 EXPORT_REPORT:{l:'Report exported',g:'report',ic:'DocumentDownload',c:'info'},
 CMS_UPDATE:{l:'Settings changed',g:'content',ic:'Setting2',c:'primary'},
 CMS_PAGE:{l:'Page changed',g:'content',ic:'NoteText',c:'primary'},
 KB_ADD:{l:'Article added',g:'content',ic:'Book1',c:'primary'},
 KB_EDIT:{l:'Article edited',g:'content',ic:'Book1',c:'primary'},
 KB_DELETE:{l:'Article removed',g:'content',ic:'Trash',c:'muted'}};
const AUD_GROUPS=[['all','All events'],['access','Access'],['case','Cases'],['approval','Approvals'],['report','Reports'],['content','Content']];
function audMeta(a){return AUD_META[a]||{l:String(a||'').replace(/_/g,' ').toLowerCase().replace(/^./,m=>m.toUpperCase()),g:'other',ic:'InfoCircle',c:'muted'};}
let audPg={page:1,per:10,q:'',grp:'all'};
function vAudit(m){
 if(!canSee('audit')){go('dashboard');return;}
 m.innerHTML='<div class="crumb">Home / Audit Log</div>'+
 '<div class="pagehead"><div><div class="h2">Audit Log</div><div class="pagesub">Every portal action with the user, role, time and source address. Append only.</div></div>'+
  '<div class="acts"><button class="btn ghost" onclick="exportAudit()">'+ic('DocumentDownload',17)+'Export to CSV</button></div></div>'+
 '<div class="kpis" id="audkpis"></div>'+
 '<div class="tools"><span class="fieldwrap"><span class="fic">'+ic('SearchNormal1',16)+'</span>'+
   '<input class="inp search-i" id="auq" placeholder="Search by user, action, detail or address" value="'+esc(audPg.q)+'" oninput="audSearch(this.value)"></span>'+
 '</div>'+
 '<div id="audtable"></div>';
 drawAudit();
}
function audSearch(v){audPg.q=v;audPg.page=1;drawAudit();}
function audGroup(g){audPg.grp=g;audPg.page=1;drawAudit();}
function audCount(g){if(g==='all')return STATE.audit.length;return STATE.audit.filter(x=>audMeta(x.action).g===g).length;}
function audPage(n){const t=audRows().length,last=Math.max(1,Math.ceil(t/audPg.per));audPg.page=Math.min(Math.max(1,n),last);drawAudit();}
function audPer(v){audPg.per=+v;audPg.page=1;drawAudit();}
function audRows(){let a=STATE.audit;
 if(audPg.grp!=='all')a=a.filter(x=>audMeta(x.action).g===audPg.grp);
 const q=audPg.q;
 if(q){const s=q.toLowerCase();a=a.filter(x=>(x.action+x.user+x.detail+x.role+x.ip+audMeta(x.action).l).toLowerCase().includes(s));}
 return a;}
function exportAudit(){const rows=[['Timestamp','User','Role','Action','Action code','Detail','IP']].concat(
  STATE.audit.map(x=>[x.ts,x.user,x.role,audMeta(x.action).l,x.action,x.detail,x.ip]));
 downloadCsv('MAARK-Audit-Log.csv',rows);toast('Audit log exported to CSV ('+STATE.audit.length+' events)');}
function audKpis(){const a=STATE.audit,g=k=>a.filter(x=>audMeta(x.action).g===k).length;
 const today=fmtDate(new Date()),users=new Set(a.map(x=>x.user)).size;
 const box=document.getElementById('audkpis');if(!box)return;
 const card=(lbl,val,color,icn,grp)=>'<div class="kpi" onclick="audGroup(\''+grp+'\')"><div class="kico" style="background:color-mix(in srgb,'+color+' 12%,#fff);color:'+color+'">'+ic(icn,19)+'</div><div class="kbody"><div class="val">'+val+'</div><div class="lbl">'+lbl+'</div></div></div>';
 box.innerHTML=card('Events logged',a.length,'var(--primary)','ShieldTick','all')+
  card('Events today',a.filter(x=>String(x.ts).indexOf(today)===0).length,'var(--info)','Clock','all')+
  card('Approval actions',g('approval'),'var(--success-active)','ClipboardTick','approval')+
  card('Report actions',g('report'),'var(--warning-active)','Chart21','report')+
  card('Users active',users,'var(--text-2)','Profile','all');
}
function drawAudit(){audKpis();const all=sortRows('aud',audRows());const box=document.getElementById('audtable');if(!box)return;
 const head='<div class="tblhead">'+ic('ShieldTick',18)+'Event trail<b>'+all.length+'</b><span class="thsub">Newest first. Times are IST.</span></div>'+
  '<div class="tabs linetabs">'+AUD_GROUPS.map(g=>'<div class="tab'+(audPg.grp===g[0]?' on':'')+'" onclick="audGroup(\''+g[0]+'\')">'+g[1]+
   '<span class="cnt">'+audCount(g[0])+'</span></div>').join('')+'</div>';
 if(!all.length){box.innerHTML='<div class="card tblcard">'+head+'<div class="empty"><div class="eic">'+ic('SearchNormal1',22)+'</div><b>No matching events</b><span>Try a different search term, or pick All events to see the full log.</span></div></div>';return;}
 const last=Math.max(1,Math.ceil(all.length/audPg.per));if(audPg.page>last)audPg.page=last;
 const a=pageSlice(all,audPg.page,audPg.per);
 box.innerHTML='<div class="card tblcard">'+head+'<div class="tblwrap"><table class="tbl"><thead><tr>'+
   th('aud','ts','Timestamp')+th('aud','user','User')+th('aud','action','Action')+
   '<th>Detail</th><th class="num">Source address</th></tr></thead><tbody>'+
   a.map(x=>{const p=String(x.ts||'').split(','),mt=audMeta(x.action);
    return '<tr><td class="tstamp"><b>'+esc(p[0]||x.ts)+'</b><span>'+esc((p[1]||'').trim())+'</span></td>'+
     '<td class="ucell"><span class="uav">'+esc(String(x.user||'-').replace(/[^A-Za-z ]/g,'').trim().slice(0,1)||'-')+'</span><span class="ub"><b>'+esc(x.user)+'</b><span>'+esc(x.role)+'</span></span></td>'+
     '<td><span class="achip a-'+mt.c+'" title="'+esc(x.action)+'">'+ic(mt.ic,14)+esc(mt.l)+'</span></td>'+
     '<td class="muted" style="font-size:13px">'+esc(x.detail)+'</td>'+
     '<td class="num ipc">'+esc(x.ip)+'</td></tr>';}).join('')+
 '</tbody></table></div>'+tblFoot('aud',audPg.page,audPg.per,all.length)+'</div>';}
/* ================= AI ASSISTANT ================= */
const AI_STARTERS=[
 {cat:'Case data',ic:'Chart21',q:'How many active cases?'},
 {cat:'Approvals',ic:'ClipboardTick',q:'What is pending my approval?'},
 {cat:'Case look-up',ic:'DocumentText',q:'Show MNT/2026/0142'},
 {cat:'Policy',ic:'Judge',q:'Who is eligible for maintenance?'},
 {cat:'Workflow',ic:'Refresh2',q:'Explain the approval workflow'},
 {cat:'Security',ic:'ShieldTick',q:'What data can I see in my role?'}];
const AI_RAIL=[
 {ic:'Chart21',q:'Break my cases down by status'},
 {ic:'Clock',q:'Which cases are near the 180 day limit?'},
 {ic:'ClipboardTick',q:'What is pending my approval?'},
 {ic:'Judge',q:'Who is eligible for maintenance?'},
 {ic:'Refresh2',q:'Explain the approval workflow'},
 {ic:'NoteText',q:'How do I add a noting to a case?'}];
let chat=[],aiBusy=false;
function aiTime(){return new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'});}
function vAssistant(m){const c=scoped();
 m.innerHTML='<div class="crumb">Home / AI Assistant</div>'+
 '<div class="pagehead"><div><div class="h2">AI Assistant</div><div class="pagesub">Ask about cases, rules or policy. Answers stay within the data your role can see.</div></div></div>'+
 '<div class="aiwrap">'+
  '<div class="aicol">'+
   '<div class="aihead"><div class="av">'+ic('Messages2',20)+'</div>'+
    '<div class="id"><b>MAARK Assistant</b><small><i></i>On-premise and offline, no data leaves the network</small></div>'+
    '<div class="hacts"><button class="btn ghost sm" onclick="exportChat()">'+ic('DocumentDownload',16)+'Export Transcript</button>'+
    '<button class="btn ghost sm" onclick="newChat()">'+ic('Refresh2',16)+'New Chat</button></div></div>'+
   '<div class="aistream" id="aistream"></div>'+
   '<div class="aicomp"><div class="compbox">'+
     '<textarea id="aiq" rows="1" placeholder="Ask about a case, a rule or a next step" oninput="aiGrow(this)" onkeydown="aiKey(event,this)"></textarea>'+
     '<button class="sendb" id="aisend" onclick="askAi(document.getElementById(\'aiq\').value)" aria-label="Send question">'+ic('Send2',18)+'</button>'+
   '</div><div class="comphint"><span><kbd>Enter</kbd> to send</span><span><kbd>Shift</kbd> + <kbd>Enter</kbd> for a new line</span><span style="margin-left:auto">Answers are guidance, not an order. Verify against the file.</span></div></div>'+
  '</div>'+
  '<div class="airail">'+
   '<div class="rcard"><h4>'+ic('ShieldTick',14)+'Your Scope</h4>'+
    '<div class="scoperow"><span class="k">Role</span><span class="v">'+esc(SESSION.role)+'</span></div>'+
    '<div class="scoperow"><span class="k">Command</span><span class="v">'+esc(SESSION.command||'All commands')+'</span></div>'+
    '<div class="scopestats">'+
      '<div class="ss"><b>'+c.length+'</b><span>In scope</span></div>'+
      '<div class="ss ok"><b>'+c.filter(x=>x.status==='In Progress').length+'</b><span>In progress</span></div>'+
      '<div class="ss warn"><b>'+c.filter(pendingCase).length+'</b><span>Awaiting</span></div>'+
    '</div></div>'+
   '<div class="rcard"><h4>'+ic('Book1',14)+'Knowledge Base</h4>'+
    '<div class="scoperow"><span class="k">Articles read</span><span class="v">'+kbList().filter(x=>x.status==='Published').length+'</span></div>'+
    '<div class="scoperow"><span class="k">Drafts held back</span><span class="v">'+kbList().filter(x=>x.status==='Draft').length+'</span></div>'+
    (canSee('kb')?'<div class="qi" style="margin-top:10px" onclick="go(\'kb\')"><span class="qc">'+ic('Setting2',16)+'</span><span class="qt">Manage articles</span><span class="qg">'+ic('ArrowRight2',14)+'</span></div>':'')+
   '</div>'+
   '<div class="rcard"><h4>'+ic('Magicpen',14)+'Suggested Questions</h4><div class="qlist">'+
     AI_RAIL.map(x=>'<div class="qi" onclick="askAi('+aiArg(x.q)+')"><span class="qc">'+ic(x.ic,16)+'</span><span class="qt">'+x.q+'</span><span class="qg">'+ic('ArrowRight2',14)+'</span></div>').join('')+
   '</div></div>'+
   '<div class="railnote"><span class="rn-ic">'+ic('InfoCircle',15)+'</span><span>The assistant reads the published knowledge base articles and the case records inside your command only. It cannot open a case for you, change a status or approve anything. Every look-up is written to the audit log.</span></div>'+
  '</div>'+
 '</div>';
 drawChat();
}
function aiArg(q){return "'"+q.replace(/'/g,'').replace(/"/g,'&quot;')+"'";}
function aiGrow(t){t.style.height='auto';t.style.height=Math.min(t.scrollHeight,132)+'px';}
function aiKey(e,t){if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();askAi(t.value);}}
function drawChat(){const s=document.getElementById('aistream');if(!s)return;
 if(!chat.length&&!aiBusy){
  s.innerHTML='<div class="aiblank"><div class="bic">'+ic('Messages2',24)+'</div>'+
   '<b>Namaste, '+esc((SESSION.name||'').split(' ').slice(-1)[0]||'there')+'</b>'+
   '<p>Ask a question in plain English, or start with one of these.</p>'+
   '<div class="startgrid">'+AI_STARTERS.map(x=>'<div class="startc" onclick="askAi('+aiArg(x.q)+')"><span class="sic">'+ic(x.ic,17)+'</span>'+
   '<span class="scat">'+x.cat+'</span><b>'+x.q+'</b><span class="sgo">'+ic('ArrowRight2',15)+'</span></div>').join('')+'</div></div>';
  return;}
 s.innerHTML=chat.map(c=>{
  if(c.who==='me')return '<div class="ml me"><div class="mav">'+esc((SESSION.name||'U').replace(/[^A-Za-z ]/g,'').trim().slice(0,1))+'</div><div class="mbody"><div class="msg">'+c.text+'</div><div class="mmeta">'+c.ts+'</div></div></div>';
  return '<div class="ml"><div class="mav">'+ic('Messages2',15)+'</div><div class="mbody"><div class="msg">'+c.text+'</div>'+
   '<div class="mmeta">'+c.ts+(c.src?'<span class="msrc">'+ic('ShieldTick',12)+c.src+'</span>':'')+'</div>'+
   (c.chips&&c.chips.length?'<div class="mfollow">'+c.chips.map(q=>'<span class="pill" onclick="askAi('+aiArg(q)+')">'+q+'</span>').join('')+'</div>':'')+
   '</div></div>';}).join('')+
  (aiBusy?'<div class="ml"><div class="mav">'+ic('Messages2',15)+'</div><div class="mbody"><div class="msg" style="padding:0"><div class="typing"><i></i><i></i><i></i></div></div></div></div>':'');
 s.scrollTop=s.scrollHeight;
}
function askAi(q){q=(q||'').trim();if(!q||aiBusy)return;
 const box=document.getElementById('aiq');if(box){box.value='';box.style.height='auto';}
 chat.push({who:'me',text:esc(q),ts:aiTime()});aiBusy=true;drawChat();
 const b=document.getElementById('aisend');if(b)b.disabled=true;
 setTimeout(()=>{const a=aiAnswer(q);aiBusy=false;
  chat.push({who:'bot',text:a.html,src:a.src,chips:a.chips,ts:aiTime()});
  const sb=document.getElementById('aisend');if(sb)sb.disabled=false;
  drawChat();},520);
}
function newChat(){chat=[];aiBusy=false;drawChat();toast('Started a new chat');}
function exportChat(){if(!chat.length){toast('Nothing to export yet','err');return;}
 const strip=h=>String(h).replace(/<[^>]*>/g,'').replace(/&middot;/g,'-').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&');
 downloadCsv('MAARK-Assistant-Transcript.csv',[['Time','Speaker','Message']].concat(chat.map(c=>[c.ts,c.who==='me'?SESSION.name:'MAARK Assistant',strip(c.text)])));
 toast('Transcript exported to CSV');}
function aiAnswer(q){const l=q.toLowerCase();const c=scoped();
 const idm=q.toUpperCase().match(/MNT\/2026\/\d{4}/);
 if(/^open mnt/i.test(q)&&idm&&findCase(idm[0])){setTimeout(()=>go('casedetail',idm[0]),300);return{html:'Opening <b>'+idm[0]+'</b>.',src:'Case register'};}
 if(idm){const x=findCase(idm[0]);
  if(x)return{html:'<b>'+x.id+'</b>, '+esc(x.applicant)+' ('+esc(x.relation)+'), '+esc(x.command)+' '+statTag(x.status)+'<br>Member '+esc(x.memberName)+' ('+esc(x.armyNo)+'). Maintenance '+esc(x.maintenance||'-')+'.',
   src:'Case register',chips:['Open '+x.id,'Explain the approval workflow']};
  return{html:'No case '+idm[0]+' sits inside your scope. Check the number, or ask your command HQ to share it.',src:'Case register',chips:['How many cases do I have?']};}
 if(l.includes('active')||l.includes('in progress'))return{html:'You have <b>'+c.filter(x=>x.status==='In Progress').length+' cases in progress</b> in scope. In progress means the case is filed and still inside the 180 day window, whether or not Command has approved it yet.',src:'Case register',chips:['Break my cases down by status','Which cases are near the 180 day limit?']};
 if(l.includes('sub-judice')||l.includes('subjudice')||l.includes('court'))return{html:'<b>'+c.filter(x=>x.subJudice).length+'</b> cases are sub-judice. These are held in court, and no maintenance decision is taken until the court rules.',src:'Case register',chips:['Break my cases down by status']};
 if(l.includes('closed'))return{html:'<b>'+c.filter(x=>x.status==='Closed').length+'</b> cases are closed and <b>'+c.filter(x=>x.status==='Resolved').length+'</b> are resolved. Every closed and resolved case carries the reason on its case summary, and keeps its full noting history for audit.',src:'Case register',chips:['Break my cases down by status']};
 if(l.includes('180')||l.includes('limit')||l.includes('overdue')||l.includes('deadline')){const n=c.filter(x=>x.status==='In Progress').length;
  return{html:'A case must be resolved within <b>180 days</b> of registration. '+n+' of your cases are still open against that clock. The Registered Cases screen shows the days left on each one.',src:'Policy set, clause 4.2',chips:['What is pending my approval?','Break my cases down by status']};}
 if(l.includes('pending')||l.includes('approval')||l.includes('approve'))return{html:'<b>'+c.filter(pendingCase).length+'</b> cases are waiting on approval. The Brigade Commander approves first, then the file moves one level up.',src:'Approval queue',chips:['Explain the approval workflow','Break my cases down by status']};
 if(l.includes('how many')||l.includes('total')||l.includes('break')||l.includes('status'))return{html:'You have <b>'+c.length+' cases</b> in scope: '+STATUSES.map(s=>'<b>'+c.filter(x=>x.status===s).length+'</b> '+s.toLowerCase()).join(', ')+'.',src:'Case register',chips:['What is pending my approval?','Which cases are near the 180 day limit?']};
 const kbHit=kbMatch(q);
 if(kbHit)return{html:esc(kbHit.body)+'<br><span class="muted">From the knowledge base article <b>'+esc(kbHit.title)+'</b>.</span>',src:kbHit.source||'Knowledge base',
  chips:kbList().filter(x=>x.status==='Published'&&x.id!==kbHit.id&&x.cat===kbHit.cat).slice(0,2).map(x=>x.title)};
 if(l.includes('eligib')||l.includes('policy')||l.includes('maintenance'))return{html:'Maintenance is payable to an eligible dependent: wife, mother or child. The Army steps in within 3 years of the claim. If the applicant is employable, maintenance is not allowed.',src:'Policy set, clause 2.1',chips:['Explain the approval workflow','Which cases are near the 180 day limit?']};
 if(l.includes('noting')||l.includes('note'))return{html:'Open the case, go to the Notings tab and write your remark. A noting raised anywhere in the chain of command is yellow. When headquarters gives its verdict that noting is green, and every earlier noting on the case turns green with it.',src:'User guide',chips:['Explain the approval workflow']};
 if(l.includes('workflow')||l.includes('process')||l.includes('step'))return{html:'The unit files the case. The Brigade Commander approves it. Approval then moves one level up, and ADG HR keeps oversight throughout. Notings are colour coded: yellow is raised in the chain of command, green is the headquarters verdict.',src:'Policy set, clause 3',chips:['What is pending my approval?','How do I add a noting to a case?']};
 if(l.includes('role')||l.includes('see')||l.includes('access')||l.includes('permission')||l.includes('security'))return{html:'You are signed in as <b>'+esc(SESSION.role)+'</b>'+(SESSION.command?' for '+esc(SESSION.command):'')+'. You see '+c.length+' cases and nothing outside that scope. Every question you ask here is written to the audit log.',src:'Access control',chips:['Break my cases down by status']};
 if(l==='hi'||l.includes('hello')||l.includes('namaste'))return{html:'Namaste. Ask me about eligibility, the approval workflow, or the live case data in your command.',src:'',chips:['How many active cases?','Who is eligible for maintenance?']};
 return{html:'I did not follow that one. I can answer on eligibility and policy, the approval workflow, security and scope, and the live case data: counts, status breakdowns and a case look-up by number.',src:'',chips:['How many cases are in progress?','Explain the approval workflow','Show MNT/2026/0142']};
}
/* ================= SEARCH ================= */
function globalSearch(v){v=(v||'').trim();if(!v){return;}const up=v.toUpperCase();
 if(up.match(/MNT\/2026\/\d{4}/)&&findCase(up.match(/MNT\/2026\/\d{4}/)[0])){go('casedetail',up.match(/MNT\/2026\/\d{4}/)[0]);return;}
 regFilter.q=v;regFilter.status='all';go('registered');}
