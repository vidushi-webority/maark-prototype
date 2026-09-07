/* ================= DATA ================= */
const KEY="maark_portal_v2";
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
 const mk=(id,applicant,relation,armyNo,category,maint,status,command,notings,daysAgo)=>{
   const o=OFFICERS[armyNo]||{rank:"",name:"",unit:"",command:command,salary:0};
   return {id,applicant,relation,ageNow:"48",ageFiling:"46",contact:"98765xxxxx",aadhaar:"XXXX-XXXX-1234",
     address:"Village & PO, District, State", armyNo, rank:o.rank, memberName:o.name, unit:o.unit,
     command:o.command||command, salary:o.salary, category, type:"Spouse maintenance", maintenance:maint,
     appDate:"10-Aug-2026", filedDate:"12-Aug-2026", status, guardian:"", parent:"Smt. Kamla Devi",
     spouseEmployment:"Unemployed", dependentCard:"DC-"+id.slice(-4), csdCard:"CSD-"+id.slice(-4), employability:"No",
     docs:["Proof of marriage.pdf","Affidavit.pdf"], notings:notings||[], history:[{stage:"Unit filed",by:"Unit clerk",when:"12 Aug"}],
     updated:new Date(now-daysAgo*864e5).toLocaleDateString('en-IN')};
 };
 const cases=[
   mk("MNT/2026/0142","Smt. A. Devi","Wife","IC-50231","Maintenance","25%","Active","Western",
     [{by:"Brigade Headquarters",role:"Approver",text:"Verification complete. Marriage proof and affidavit are in order.",colour:"green",frozen:true,when:"28 Aug 2026"},
      {by:"Command (Western)",role:"Admin",text:"Recommend approval. Maintenance proposed at 25 percent of salary.",colour:"yellow",frozen:false,when:"1 Sep 2026"}],5),
   mk("MNT/2026/0139","Smt. K. Bai","Mother","JC-330219","Maintenance","₹ 9,000","Registered","Central",[],5),
   mk("MNT/2026/0137","Smt. R. Kaur","Wife","IC-61144","Maintenance","₹ 12,000","Sub-judice","Northern",
     [{by:"Brigade Headquarters",role:"Approver",text:"Matter is before the civil court; hold pending order.",colour:"green",frozen:true,when:"30 Aug 2026"}],6),
   mk("MNT/2026/0131","Smt. P. Yadav","Wife","JC-441027","Maintenance","20%","Registered","Eastern",[],7),
   mk("MNT/2026/0128","Smt. L. Bai","Mother","IC-58890","Maintenance","20%","Closed","Southern",
     [{by:"ADG HR",role:"Super Admin",text:"Approved and disbursed. Case closed.",colour:"green",frozen:true,when:"25 Aug 2026"}],13),
   mk("MNT/2026/0124","Smt. S. Devi","Wife","IC-58890","Maintenance","15%","Closed","Southern",[],16)
 ];
 const audit=[
   {ts:"7 Sep 2026, 11:42",user:"Maj S. Rao",role:"Command Admin",action:"APPROVE_CASE",detail:"Approved MNT/2026/0139",ip:"10.0.4.21"},
   {ts:"7 Sep 2026, 11:20",user:"Sub R. Kumar",role:"Unit User",action:"CREATE_CASE",detail:"Registered MNT/2026/0142",ip:"10.0.7.14"},
   {ts:"6 Sep 2026, 17:03",user:"Col A. Verma",role:"Super Admin",action:"GENERATE_REPORT",detail:"Case Summary Report",ip:"10.0.1.9"}
 ];
 const cms={portalTitle:"MAARK 2.0",banner:"Maintenance allowance, digitised",theme:"Light Green",notice:"Cases are to be resolved within 180 days.",
   pages:["Home","About ADG HR","Policy and eligibility","Contact","FAQ"]};
 return {cases,audit,cms,seq:143};
}
const DB={
 load(){try{return JSON.parse(localStorage.getItem(KEY))||null}catch(e){return null}},
 save(d){try{localStorage.setItem(KEY,JSON.stringify(d))}catch(e){}},
 get(){let d=this.load();if(!d){d=seed();this.save(d)}return d},
 set(d){this.save(d)}
};
let STATE=DB.get();
let SESSION=null;

/* ================= AUTH ================= */
document.querySelectorAll('#rolepick .rolebtn').forEach(b=>b.onclick=()=>{
 document.querySelectorAll('#rolepick .rolebtn').forEach(x=>x.classList.remove('on'));b.classList.add('on');
 document.getElementById('segHint').textContent=b.dataset.hint;});
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
 ArrowRight2:"<path d='M8.91 19.92l6.52-6.52c.77-.77.77-2.03 0-2.8L8.91 4.08'/>",
 ArrowLeft2:"<path d='M15 19.92L8.48 13.4c-.77-.77-.77-2.03 0-2.8L15 4.08'/>",
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
 Element3:"<path d='M9 2H5C3.34 2 2 3.34 2 5v4c0 1.66 1.34 3 3 3h4c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3ZM19 12h-4c-1.66 0-3 1.34-3 3v4c0 1.66 1.34 3 3 3h4c1.66 0 3-1.34 3-3v-4c0-1.66-1.34-3-3-3Z'/><path opacity='.4' d='M19 2h-4c-1.66 0-3 1.34-3 3v4c0 1.66 1.34 3 3 3h4c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3ZM9 12H5c-1.66 0-3 1.34-3 3v4c0 1.66 1.34 3 3 3h4c1.66 0 3-1.34 3-3v-4c0-1.66-1.34-3-3-3Z'/>"
};
function bic(n,s){return '<svg class="ix bx" viewBox="0 0 24 24" width="'+(s||18)+'" height="'+(s||18)+'" fill="currentColor">'+(BICONS[n]||'')+'</svg>';}
const EYE=ic('Eye',20),EYE_OFF=ic('EyeSlash',20);
document.getElementById('searchIcon').innerHTML=ic('SearchNormal1',17);
document.querySelectorAll('[data-pmic]').forEach(e=>{const k=e.dataset.pmic,z=e.classList.contains('pm-chev')?15:18;e.innerHTML=BICONS[k]?bic(k,z):ic(k,z);});
document.getElementById('aiFab').innerHTML=bic('Magicpen',24);
function toggleProfileMenu(ev){
 if(ev)ev.stopPropagation();
 const m=document.getElementById('pmenu'),open=m.classList.toggle('hidden');
 document.getElementById('uChip').setAttribute('aria-expanded',String(!open));
}
function closeProfileMenu(){document.getElementById('pmenu').classList.add('hidden');document.getElementById('uChip').setAttribute('aria-expanded','false');}
document.addEventListener('click',e=>{if(!e.target.closest('.uwrap'))closeProfileMenu();});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeProfileMenu();});
function pmGo(v){closeProfileMenu();go(v);}
function toggleDense(){
 const on=document.body.classList.toggle('dense');
 const b=document.getElementById('pmDense');b.classList.toggle('on',on);b.setAttribute('aria-checked',String(on));
}
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
 const role=document.querySelector('#rolepick .rolebtn.on').dataset.role;
 const map={"Super Admin":{name:"Col A. Verma",command:null},"Command Admin":{name:"Maj S. Rao",command:"Western"},"Unit User":{name:"Sub R. Kumar",command:"Western"}};
 const m=map[role];
 SESSION={role,name:m.name,command:m.command,ip:"10.0."+(Math.floor(Math.random()*9)+1)+"."+(Math.floor(Math.random()*200)+10)};
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
function addAudit(action,detail){STATE.audit.unshift({ts:new Date().toLocaleString('en-IN',{day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'}),user:SESSION?SESSION.name:'-',role:SESSION?SESSION.role:'-',action,detail,ip:SESSION?SESSION.ip:'-'});DB.set(STATE);}
function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
function emptyState(icon,title,sub){return '<div class="card"><div class="empty"><div class="eic">'+ic(icon,22)+'</div><b>'+title+'</b><span>'+sub+'</span></div></div>';}
function statTag(s){return '<span class="stat s-'+s.replace(/\s/g,'-')+'">'+s+'</span>';}
function toast(msg,type){const t=document.createElement('div');t.className='toast'+(type==='err'?' err':'');t.textContent=msg;document.getElementById('toastWrap').appendChild(t);setTimeout(()=>{t.style.opacity=0;setTimeout(()=>t.remove(),300)},2600);}
function modal(title,bodyHtml,footHtml){document.getElementById('modalRoot').innerHTML='<div class="overlay" onclick="if(event.target===this)closeModal()"><div class="modal"><div class="mh"><h3>'+title+'</h3><button class="x" onclick="closeModal()">&times;</button></div><div class="mb">'+bodyHtml+'</div>'+(footHtml?'<div class="mf">'+footHtml+'</div>':'')+'</div></div>';}
function closeModal(){document.getElementById('modalRoot').innerHTML='';}
function downloadCsv(name,rows){const csv=rows.map(r=>r.map(c=>'"'+String(c==null?'':c).replace(/"/g,'""')+'"').join(',')).join('\r\n');
 const blob=new Blob(['﻿'+csv],{type:'text/csv;charset=utf-8'});const url=URL.createObjectURL(blob);
 const a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);}
function uploadDemo(el,name){el.innerHTML='&#10003; '+name+' attached';el.style.color='var(--success-active)';el.style.borderColor='var(--success-active)';el.style.background='var(--success-10)';}
function previewDoc(id,name){const wm=(SESSION.name+' · '+SESSION.ip+' · CONFIDENTIAL · ').repeat(60);
 modal('Document preview',
  '<div class="muted" style="font-size:12.5px;margin-bottom:10px">'+esc(name)+' &middot; case '+id+'</div>'+
  '<div class="card sheet" style="min-height:300px"><div class="wm"><span>'+wm+'</span></div>'+
   '<div class="rh"><b>Additional Directorate General of Human Rights</b><div>MAARK 2.0 &middot; secure document viewer</div></div>'+
   '<div style="position:relative;font-size:13px;color:var(--text-2);line-height:1.6">This is a watermarked, read-only preview of <b>'+esc(name)+'</b>. In the live system the original PDF is decrypted on the server, stamped with the viewer\'s IP, user ID and timestamp, and streamed for viewing only; printing and download are controlled by role.</div></div>',
  '<button class="btn ghost" onclick="closeModal()">'+ic('CloseCircle',17)+'Close preview</button>');
 addAudit('VIEW_DOCUMENT','Previewed '+name+' on '+id);}
/* ================= NAV / ROUTER ================= */
const NAV={
 "Super Admin":[["dashboard","Dashboard"],["registered","Registered Cases"],["newcase","New Case"],["approvals","Approvals"],["reports","Reports"]],
 "Command Admin":[["dashboard","Dashboard"],["registered","Registered Cases"],["newcase","New Case"],["approvals","Approvals"],["reports","Reports"]],
 "Unit User":[["dashboard","Dashboard"],["registered","Registered Cases"],["newcase","New Case"],["reports","Reports"]]
};
const NAVICON={dashboard:'Element3',registered:'DocumentText',newcase:'AddCircle',approvals:'ClipboardTick',reports:'Chart21',cms:'NoteText',audit:'ShieldTick',assistant:'Messages2'};
let CURRENT="dashboard";
function buildNav(){
 const s=document.getElementById('side');s.innerHTML='<div class="grp">Main Menu</div>';
 NAV[SESSION.role].forEach(([k,label])=>{
   /* build the group header as a node: innerHTML+= would re-parse #side and
      strip the onclick handlers already set on the items above it */
   if(k==='_a'){const g=document.createElement('div');g.className='grp';g.textContent=label;s.appendChild(g);return;}
   const a=document.createElement('div');a.className='nav';a.dataset.k=k;a.innerHTML='<span class="ic">'+ic(NAVICON[k]||'Element3',18)+'</span>'+label;a.onclick=()=>go(k);s.appendChild(a);});
}
const VIEWS={dashboard:vDashboard,registered:vRegistered,newcase:vNewCase,casedetail:vCaseDetail,approvals:vApprovals,reports:vReports,cms:vCms,audit:vAudit,assistant:vAssistant,profile:vProfile};
function vProfile(m){
 const mail=document.getElementById('pmMail').textContent;
 const row=(k,v)=>'<div class="f"><label>'+k+'</label><div style="font-size:13.5px;color:var(--text-1);padding-top:2px">'+esc(v)+'</div></div>';
 m.innerHTML='<div class="crumb">Home / My Profile</div>'+
  '<div class="pagehead"><div><div class="h2">My Profile</div><div class="pagesub">Your account details for this session.</div></div></div>'+
  '<div class="card" style="max-width:640px"><div class="grid2">'+
   row('Name',SESSION.name)+row('Role',SESSION.role)+
   row('Email',mail)+row('Command',SESSION.command||'All commands')+
   row('Session IP',SESSION.ip)+row('Authentication','Army IAM (SAML 2.0) with 2FA')+
  '</div></div>';
}
function go(view,arg){CURRENT=view;document.querySelectorAll('#side .nav').forEach(a=>a.classList.toggle('on',a.dataset.k===view));
 const m=document.getElementById('main');m.scrollTop=0;(VIEWS[view]||vDashboard)(m,arg);}
/* ================= DASHBOARD ================= */
function vDashboard(m){
 const c=scoped();
 const cnt=s=>c.filter(x=>x.status===s).length;
 const byCmd={};COMMANDS.forEach(k=>byCmd[k]=0);c.forEach(x=>{byCmd[x.command]=(byCmd[x.command]||0)+1;});
 const maxB=Math.max(1,...Object.values(byCmd));
 const pend=c.filter(x=>x.status==="Registered");
 m.innerHTML='<div class="crumb">Home / Dashboard</div><div class="pagehead"><div><div class="h2">Dashboard</div><div class="pagesub">A live view of maintenance-allowance cases in your scope.</div></div></div>'+
 '<div class="kpis">'+
   kpi("Total Cases",c.length,"var(--primary)","all","ClipboardText")+
   kpi("Active",cnt("Active"),"var(--success-active)","Active","Clock")+
   kpi("Sub-judice",cnt("Sub-judice"),"var(--warning-active)","Sub-judice","Judge")+
   kpi("Closed",cnt("Closed"),"var(--text-3)","Closed","TickCircle")+
 '</div>'+
 '<div class="row2">'+
   '<div class="card" style="flex:1.5;min-width:280px"><h3><span class="b"></span>Cases by Command</h3>'+
     '<div class="barwrap">'+COMMANDS.map(k=>'<div class="bar" style="height:'+Math.round(byCmd[k]/maxB*100)+'%"><span>'+byCmd[k]+'</span></div>').join('')+'</div>'+
     '<div class="barlbl">'+COMMANDS.map(k=>'<span>'+k.replace('South Western','SW')+'</span>').join('')+'</div></div>'+
   '<div class="card" style="flex:1;min-width:240px"><h3><span class="b"></span>Pending Approvals</h3>'+
     (pend.length?pend.slice(0,6).map(x=>'<div class="aitem" onclick="go(\'casedetail\',\''+x.id+'\')">'+x.id+' &middot; '+esc(x.applicant)+'<span class="lvl">Review &middot; 1 level up</span></div>').join(''):'<div class="empty" style="padding:22px 10px"><div class="eic">'+ic('ClipboardTick',20)+'</div><b>Nothing waiting on you</b><span>New submissions will show up here.</span></div>')+
   '</div>'+
 '</div>'+
 '<div class="card" style="margin-top:16px"><h3><span class="b"></span>Recent Cases</h3><div class="tblwrap"><table class="tbl"><thead><tr><th>Case No</th><th>Applicant</th><th>Command</th><th>Status</th><th>Updated</th></tr></thead><tbody>'+
   c.slice(0,6).map(x=>'<tr style="cursor:pointer" onclick="go(\'casedetail\',\''+x.id+'\')"><td><b>'+x.id+'</b></td><td>'+esc(x.applicant)+' <span class="muted">('+x.relation+')</span></td><td>'+x.command+'</td><td>'+statTag(x.status)+'</td><td>'+x.updated+'</td></tr>').join('')+
 '</tbody></table></div></div>';
}
function kpi(lbl,val,color,jump,icn){return '<div class="kpi" onclick="go(\'registered\',{status:\''+jump+'\'})"><div class="kico" style="background:color-mix(in srgb,'+color+' 12%,#fff);color:'+color+'">'+ic(icn,24)+'</div><div class="kbody"><div class="lbl">'+lbl+'</div><div class="val">'+val+'</div></div></div>';}
/* ================= REGISTERED ================= */
let regFilter={q:"",status:"all"};
function vRegistered(m,arg){
 if(arg&&arg.status)regFilter.status=arg.status;
 const canNew=true;
 const c=scoped();const cnt=s=>c.filter(x=>x.status===s).length;
 m.innerHTML='<div class="crumb">Home / Registered Cases</div>'+
 '<div class="pagehead"><div><div class="h2">Registered Cases</div><div class="pagesub">Every case you can see, across '+(SESSION.command||'all commands')+'.</div></div>'+
   '<div class="acts">'+(canNew?'<button class="btn prim" onclick="go(\'newcase\')">'+ic('AddCircle',17)+'Register new case</button>':'')+'</div></div>'+
 '<div class="tools"><span class="fieldwrap"><span class="fic">'+ic('SearchNormal1',16)+'</span><input class="inp search-i" id="regq" placeholder="Search cases" value="'+esc(regFilter.q)+'" oninput="regFilter.q=this.value;drawReg()"></span>'+
   '<select class="inp" onchange="regFilter.cmd=this.value;drawReg()"><option value="">All Commands</option>'+COMMANDS.map(k=>'<option'+(regFilter.cmd===k?' selected':'')+'>'+k+'</option>').join('')+'</select>'+
   '</div>'+
 '<div class="pills" id="regpills">'+
   ['all','Registered','Active','Sub-judice','Closed'].map(s=>'<span class="pill'+(regFilter.status===s?' on':'')+'" onclick="regFilter.status=\''+s+'\';drawReg()">'+(s==='all'?'All':s)+'<b>'+(s==='all'?c.length:cnt(s))+'</b></span>').join('')+'</div>'+
 '<div id="regtable"></div>';
 drawReg();
}
function regRows(){let c=scoped();if(regFilter.status!=='all')c=c.filter(x=>x.status===regFilter.status);
 if(regFilter.cmd)c=c.filter(x=>x.command===regFilter.cmd);
 if(regFilter.q){const q=regFilter.q.toLowerCase();c=c.filter(x=>(x.id+x.applicant+x.armyNo+x.command).toLowerCase().includes(q));}return c;}
function drawReg(){const c=regRows();const canEdit=SESSION.role!=="Super Admin";
 document.getElementById('regtable').innerHTML=c.length?'<div class="tblwrap"><table class="tbl"><thead><tr><th>Case No</th><th>Applicant</th><th>Member</th><th>Command</th><th>Status</th><th>Updated</th><th>Actions</th></tr></thead><tbody>'+
   c.map(x=>'<tr><td><b>'+x.id+'</b></td><td>'+esc(x.applicant)+' <span class="muted">('+x.relation+')</span></td><td>'+esc(x.memberName)+' <span class="muted">('+x.armyNo+')</span></td><td>'+x.command+'</td><td>'+statTag(x.status)+'</td><td>'+x.updated+'</td><td><span class="act" onclick="go(\'casedetail\',\''+x.id+'\')">'+ic('Eye',15)+'View case</span>'+(canEdit?'<span class="act" onclick="go(\'casedetail\',\''+x.id+'\')">'+ic('Edit2',15)+'Open and edit</span>':'')+'</td></tr>').join('')+
 '</tbody></table></div><div class="pager">Showing '+c.length+' of '+scoped().length+' cases<span style="flex:1"></span><span class="pg">Previous</span><span class="pg on">1</span><span class="pg">Next</span></div>':emptyState('DocumentText','No cases match these filters','Clear a filter or change the search term to see more results.');}
/* ================= NEW CASE ================= */
function vNewCase(m){
 m.innerHTML='<div class="crumb">Home / New Case</div>'+
 '<div class="pagehead"><div><div class="h2" style="margin:0">Register a new case</div><div class="pagesub">Fields marked with an asterisk are required. You can save a draft at any point.</div></div></div>'+
 '<div class="card" style="margin-bottom:16px"><div class="sech"><span class="b"></span>Service Personnel</div><div class="grid3">'+
   f("Army number","nc_army","text","e.g. IC-50231",true,'Enter the Army number, then fetch the service record. Try IC-50231.','<button class="btn ghost sm" style="margin-top:8px" onclick="fetchSvc()">'+ic('SearchNormal1',16)+'Fetch service record</button>')+
   ro("Rank","nc_rank")+ro("Name of member","nc_mname")+ro("Unit","nc_unit")+ro("Command","nc_cmd")+ro("Monthly salary","nc_salary")+
 '</div></div>'+
 '<div class="card" style="margin-bottom:16px"><div class="sech"><span class="b"></span>Applicant Details</div><div class="grid3">'+
   f("Applicant name","nc_app","text","Full name",true)+
   sel("Relation to member","nc_rel",["Wife","Mother","Child"],true)+
   f("Age now","nc_agenow","number","Years")+f("Age at time of filing","nc_agefile","number","Years")+
   f("Contact number","nc_contact","text","10-digit mobile",true)+f("Aadhaar number","nc_aadhaar","text","Validated")+
   '<div class="f full"><label>Correspondence address</label><input id="nc_addr" placeholder="Enter correspondence address"></div>'+
 '</div></div>'+
 '<div class="card" style="margin-bottom:16px"><div class="sech"><span class="b"></span>Case Details</div><div class="grid3">'+
   sel("Case category","nc_cat",["Maintenance","Spouse allowance"],true)+
   sel("Case type","nc_type",["Spouse maintenance","Mother maintenance","Child maintenance","Other"])+
   f("Maintenance sought","nc_maint","text","Amount or percentage")+
   f("Application date","nc_appdate","date","",true)+f("Filed date","nc_filedate","date")+
   '<div class="f"><label>Status on submission</label><div class="rovalue">'+statTag('Registered')+'</div></div>'+
 '</div></div>'+
 '<div class="card" style="margin-bottom:16px"><div class="sech"><span class="b"></span>Dependents and Cards</div><div class="grid3">'+
   f("Guardian name","nc_guard","text","In addition to parent")+f("Parent name","nc_parent")+
   sel("Estranged spouse employment","nc_emp",["Unemployed","Employed","Other"])+
   f("Dependent card number","nc_dep")+f("CSD card number","nc_csd")+sel("Employability","nc_ability",["No","Yes"])+
 '</div></div>'+
 '<div class="card"><div class="sech"><span class="b"></span>Documents</div><div class="grid3">'+
   '<div class="f"><label>Proof of marriage <span class="req">*</span></label><div class="up" style="cursor:pointer" onclick="uploadDemo(this,\'Proof-of-marriage.pdf\')">Click to upload PDF</div></div>'+
   '<div class="f"><label>Affidavit <span class="req">*</span></label><div class="up" style="cursor:pointer" onclick="uploadDemo(this,\'Affidavit.pdf\')">Click to upload PDF</div></div>'+
   '<div class="f"><label>Supporting documents</label><div class="up" style="cursor:pointer" onclick="uploadDemo(this,\'Supporting-documents.pdf\')">Click to upload one or more PDFs</div></div>'+
 '</div></div>'+
 '<div class="formbar"><span class="formbar-note">A draft stays with your unit until you submit it.</span>'+
   '<button class="btn ghost" onclick="submitCase(true)">'+ic('NoteText',17)+'Save as draft</button>'+
   '<button class="btn prim" onclick="submitCase(false)">'+ic('Send2',17)+'Submit case for approval</button></div>';
}
function f(label,id,type,ph,req,hint,extra){const g=(type==='date')?'':'Enter '+label.toLowerCase();return '<div class="f"><label>'+label+(req?' <span class="req">*</span>':'')+'</label><input id="'+id+'" type="'+(type||'text')+'" placeholder="'+g+'">'+(hint?'<div class="hint">'+hint+'</div>':'')+(extra||'')+'</div>';}
function ro(label,id){return '<div class="f"><label>'+label+'</label><input id="'+id+'" class="isro" readonly placeholder="Auto-filled"></div>';}
function sel(label,id,opts,req){return '<div class="f"><label>'+label+(req?' <span class="req">*</span>':'')+'</label><select id="'+id+'"><option value="">Select</option>'+opts.map(o=>'<option>'+o+'</option>').join('')+'</select></div>';}
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
   maintenance:val('nc_maint'),appDate:val('nc_appdate'),filedDate:val('nc_filedate'),status:draft?"Registered":"Registered",
   guardian:val('nc_guard'),parent:val('nc_parent'),spouseEmployment:val('nc_emp'),dependentCard:val('nc_dep'),
   csdCard:val('nc_csd'),employability:val('nc_ability'),docs:["Proof of marriage.pdf","Affidavit.pdf"],
   notings:[],history:[{stage:"Unit filed",by:SESSION.name,when:new Date().toLocaleDateString('en-IN')}],updated:new Date().toLocaleDateString('en-IN')};
 STATE.cases.unshift(cse);DB.set(STATE);addAudit('CREATE_CASE','Registered '+id);
 toast((draft?'Draft saved: ':'Case submitted: ')+id);go('casedetail',id);
}
/* ================= CASE DETAIL ================= */
let cdTab="Details";
function slaChip(x){
 if(x.status==="Closed")return '<span class="timer ok">'+ic('TickCircle',15)+'Closed within the 180 day limit</span>';
 const l=slaLeft(x);if(l==null)return '';
 const cls=l<0?' over':(l<30?'':' ok');
 return '<span class="timer'+cls+'">'+ic('Clock',15)+(l<0?Math.abs(l)+' days past the 180 day limit':l+' of 180 days left')+'</span>';}
function cdRail(x){
 const at={"Registered":2,"Active":3,"Sub-judice":3,"Closed":4}[x.status]||2;
 const steps=[["Filed by unit",x.filedDate||'-'],["Command review",""],["Approved and active",""],["Case closed",""]];
 return '<div class="rail">'+steps.map((s,i)=>{const n=i+1,cls=n<at?'done':(n===at?'now':'');
   const sub=n===1?(s[1]||'completed'):(n<at?'completed':(n===at?'in progress':'not started'));
   return '<div class="rstep '+cls+'"><b>'+s[0]+'</b><span>'+sub+'</span></div>';}).join('')+'</div>';}
function vCaseDetail(m,id){
 const x=findCase(id);if(!x){go('registered');return;}vCaseDetail.id=id;
 const canAct=SESSION.role!=="Unit User";
 const acts=
   (canAct&&x.status==="Registered"?'<button class="btn ghost" onclick="apSendBack(\''+id+'\')">'+ic('ArrowLeft2',16)+'Send back to unit</button><button class="btn prim" onclick="apApprove(\''+id+'\')">'+ic('TickCircle',16)+'Approve case</button>':'')+
   (canAct&&x.status==="Active"?'<button class="btn ghost" onclick="caseAction(\''+id+'\',\'subjudice\')">'+ic('Judge',16)+'Mark as sub-judice</button><button class="btn prim" onclick="caseAction(\''+id+'\',\'close\')">'+ic('CloseCircle',16)+'Close case</button>':'')+
   (canAct&&x.status==="Sub-judice"?'<button class="btn prim" onclick="caseAction(\''+id+'\',\'close\')">'+ic('CloseCircle',16)+'Close case</button>':'');
 const meta=(k,v)=>'<div><div class="k">'+k+'</div><div class="v">'+v+'</div></div>';
 const counts={Details:0,Notings:x.notings.length,Documents:x.docs.length,History:x.history.length};
 m.innerHTML='<div class="crumb">Home / Registered Cases / '+id+'</div>'+
 '<div class="chero"><div class="ctop"><span class="no">'+id+'</span>'+statTag(x.status)+slaChip(x)+
   '<span class="cacts">'+(acts||'<span class="muted" style="font-size:12.5px">No decision is open on this case</span>')+'</span></div>'+
   '<div class="cmeta">'+
     meta('Applicant',esc(x.applicant)+' <span class="muted" style="font-weight:500">('+x.relation+')</span>')+
     meta('Service member',esc(x.memberName)+' <span class="muted" style="font-weight:500">'+(x.rank||'')+' &middot; '+x.armyNo+'</span>')+
     meta('Command and unit',x.command+' <span class="muted" style="font-weight:500">&middot; '+esc(x.unit||'-')+'</span>')+
     meta('Maintenance sought',esc(x.maintenance||'-'))+
   '</div>'+cdRail(x)+'</div>'+
 '<div class="tabs">'+["Details","Notings","Documents","History"].map(t=>'<div class="tab'+(cdTab===t?' on':'')+'" onclick="cdTab=\''+t+'\';go(\'casedetail\',\''+id+'\')">'+t+(counts[t]?'<span class="cnt">'+counts[t]+'</span>':'')+'</div>').join('')+'</div>'+
 '<div class="cols"><div class="lcol">'+cdBody(x)+'</div><div class="rcol">'+
   '<div class="card" style="margin-bottom:14px"><h3><span class="b"></span>Case summary</h3>'+
     kv("Category",x.category)+kv("Case type",x.type||'-')+kv("Maintenance sought",x.maintenance||'-')+
     kv("Application date",x.appDate||'-')+kv("Filed date",x.filedDate||'-')+kv("Last updated",x.updated||'-')+'</div>'+
   '<div class="card"><h3><span class="b"></span>Approval history</h3><div class="htl">'+
     x.history.map(h=>'<div class="hi"><div class="hs">'+esc(h.stage)+'</div><div class="hm">'+esc(h.by||'-')+' &middot; '+h.when+'</div></div>').join('')+
     (x.status==="Registered"?'<div class="hi pend"><div class="hs">Command review</div><div class="hm">waiting on you</div></div>':'')+
   '</div></div>'+
 '</div></div>';
}
function kv(k,v){return '<div class="kv"><span class="k">'+k+'</span><span class="v">'+esc(v)+'</span></div>';}
function cdSection(title,rows){return '<div class="card" style="margin-bottom:14px"><div class="sech"><span class="b"></span>'+title+'</div><div class="kvgrid">'+rows+'</div></div>';}
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
 if(cdTab==="Documents"){return '<div class="card"><h3><span class="b"></span>Documents on file</h3>'+
   (x.docs.length?x.docs.map(d=>'<div class="doc"><span class="dic">'+ic('DocumentText',19)+'</span>'+
     '<div style="flex:1;min-width:0"><div class="dn">'+esc(d)+'</div><div class="dm">PDF &middot; uploaded by the unit &middot; read only</div></div>'+
     '<span class="act" onclick="previewDoc(\''+x.id+'\',\''+d.replace(/'/g,"")+'\')">'+ic('Eye',15)+'Preview</span></div>').join('')
    :'<div class="empty"><div class="eic">'+ic('DocumentText',22)+'</div><b>No documents yet</b><span>Proof of marriage and the affidavit are attached by the unit.</span></div>')+'</div>';}
 if(cdTab==="History"){return '<div class="card"><h3><span class="b"></span>Case history</h3><div class="htl">'+
   x.history.map(h=>'<div class="hi'+(h.stage==="Sent back"?' pend':'')+'"><div class="hs">'+esc(h.stage)+'</div>'+
     '<div class="hm">'+esc(h.by||'-')+' &middot; '+h.when+'</div>'+
     (h.note?'<div class="hn">'+esc(h.note)+'</div>':'')+'</div>').join('')+'</div></div>';}
 return '<div>'+
   (x.notings.length?x.notings.map((n,i)=>note(x.id,n,i)).join('')
    :'<div class="card" style="margin-bottom:14px"><div class="empty"><div class="eic">'+ic('NoteText',22)+'</div><b>No notings yet</b><span>Add the first noting below. Yellow notings can be edited, green notings are frozen.</span></div></div>')+
   (x.status==="Closed"?'':'<div class="composer"><div class="sech" style="margin-bottom:10px"><span class="b"></span>Add a noting</div>'+
     '<textarea id="newnote" placeholder="Record your observation, recommendation or direction"></textarea>'+
     '<div class="cfoot"><span class="stat" style="background:var(--warning-10);color:var(--warning-active)">Yellow &middot; editable</span>'+
     '<label class="chk"><input type="checkbox" id="confmove"> Confirm and move forward, which freezes this noting green</label>'+
     '<button class="btn prim sm" style="margin-left:auto" onclick="addNote(\''+x.id+'\')">'+ic('Send2',16)+'Save noting</button></div></div>')+'</div>';
}
function note(id,n,i){return '<div class="note '+n.colour+'"><div class="top"><span class="who">'+esc(n.by)+'</span>'+
 (n.role?'<span class="muted" style="font-size:11.5px">'+esc(n.role)+'</span>':'')+
 '<span class="badge '+(n.frozen?'frozen':'edit')+'">'+(n.colour==='green'?'Green &middot; frozen':'Yellow &middot; editable')+'</span></div>'+
 '<div class="txt">'+esc(n.text)+'</div><div class="when">'+n.when+' &middot; '+(n.frozen?'frozen at the authority, not amendable':'editable working note')+
 (!n.frozen&&SESSION.role!=="Unit User"?'<span class="freeze" onclick="freezeNote(\''+id+'\','+i+')">Freeze (turn green)</span>':'')+'</div></div>';}
function addNote(id){const x=findCase(id);const t=(document.getElementById('newnote').value||'').trim();if(!t){toast('Type a noting first','err');return;}
 const conf=document.getElementById('confmove').checked;
 x.notings.push({by:SESSION.name+" ("+SESSION.role+")",role:SESSION.role,text:t,colour:conf?'green':'yellow',frozen:conf,when:new Date().toLocaleDateString('en-IN')});
 x.updated=new Date().toLocaleDateString('en-IN');DB.set(STATE);addAudit('ADD_NOTING',(conf?'Frozen noting on ':'Noting on ')+id);toast('Noting saved');go('casedetail',id);}
function freezeNote(id,i){const x=findCase(id);const n=x.notings[i];n.colour='green';n.frozen=true;DB.set(STATE);addAudit('FREEZE_NOTING','Froze a noting on '+id);toast('Noting frozen (green). It can no longer be changed.');go('casedetail',id);}
function caseAction(id,action,reason){const x=findCase(id);
 if(action==='approve'){x.status="Active";x.history.push({stage:"Command approved",by:SESSION.name,when:new Date().toLocaleDateString('en-IN')});addAudit('APPROVE_CASE','Approved '+id);toast('Case approved and set Active');}
 if(action==='sendback'){x.history.push({stage:"Sent back",by:SESSION.name,when:new Date().toLocaleDateString('en-IN'),note:reason||''});addAudit('SENDBACK','Sent back '+id+(reason?': '+reason:''));toast('Case sent back to the unit');}
 if(action==='subjudice'){x.status="Sub-judice";x.history.push({stage:"Marked sub-judice",by:SESSION.name,when:new Date().toLocaleDateString('en-IN')});addAudit('SUBJUDICE','Marked '+id+' sub-judice');toast('Case marked sub-judice');}
 if(action==='close'){x.status="Closed";x.history.push({stage:"Case closed",by:SESSION.name,when:new Date().toLocaleDateString('en-IN')});addAudit('CLOSE_CASE','Closed '+id);toast('Case closed');}
 x.updated=new Date().toLocaleDateString('en-IN');DB.set(STATE);go('casedetail',id);}
/* ================= APPROVALS ================= */
const MONS={jan:0,feb:1,mar:2,apr:3,may:4,jun:5,jul:6,aug:7,sep:8,oct:9,nov:10,dec:11};
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
function apList(){let c=scoped().filter(x=>x.status==="Registered");
 if(apq.cmd)c=c.filter(x=>x.command===apq.cmd);
 if(apq.q){const q=apq.q.toLowerCase();c=c.filter(x=>(x.id+x.applicant+x.memberName+x.armyNo+x.command).toLowerCase().includes(q));}
 return c.slice().sort((a,b)=>waitDays(b)-waitDays(a));}
function vApprovals(m){
 apSel=[];
 const all=scoped().filter(x=>x.status==="Registered");
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
   '<input class="inp search-i" id="apqq" placeholder="Search by case number, applicant or member" value="'+esc(apq.q)+'" oninput="apq.q=this.value;drawAp()"></span>'+
   '<select class="inp" onchange="apq.cmd=this.value;apSel=[];drawAp()"><option value="">All Commands</option>'+COMMANDS.map(k=>'<option'+(apq.cmd===k?' selected':'')+'>'+k+'</option>').join('')+'</select>'+
   '<label class="selall"><input type="checkbox" id="apall" onclick="apToggleAll(this.checked)"> Select all</label>'+
 '</div><div id="apqlist"></div>';
 drawAp();
}
function drawAp(){const c=apList();
 const bulk=apSel.length?'<div class="bulkbar">'+ic('TickCircle',17)+apSel.length+' case'+(apSel.length===1?'':'s')+' selected<span class="sp"></span>'+
   '<button class="btn ghost sm" onclick="apSel=[];drawAp()">Clear selection</button>'+
   '<button class="btn prim sm" onclick="apBulkApprove()">'+ic('TickCircle',16)+'Approve selected</button></div>':'';
 const cell=(k,v)=>'<div><div class="k">'+k+'</div><div class="v">'+v+'</div></div>';
 document.getElementById('apqlist').innerHTML=bulk+(c.length?'<div class="apq">'+c.map(x=>{const on=apSel.indexOf(x.id)>-1;
   return '<div class="apc'+(on?' sel':'')+'">'+
   '<input type="checkbox" class="cbx"'+(on?' checked':'')+' onclick="apToggle(\''+x.id+'\')" aria-label="Select case '+x.id+'">'+
   '<div class="body"><div class="top"><span class="no">'+x.id+'</span>'+statTag(x.status)+ageChip(x)+'</div>'+
   '<div class="apmeta">'+
     cell('Applicant',esc(x.applicant)+' ('+x.relation+')')+
     cell('Service member',esc(x.memberName)+' &middot; '+x.armyNo)+
     cell('Command and unit',x.command+' &middot; '+esc(x.unit))+
     cell('Maintenance sought',esc(x.maintenance||'-'))+
   '</div></div>'+
   '<div class="side2"><button class="btn prim sm" onclick="apApprove(\''+x.id+'\')">'+ic('TickCircle',16)+'Approve case</button>'+
     '<button class="btn ghost sm" onclick="apSendBack(\''+x.id+'\')">'+ic('ArrowLeft2',16)+'Send back to unit</button>'+
     '<span class="act" onclick="go(\'casedetail\',\''+x.id+'\')">'+ic('ArrowRight2',15)+'Open full case</span></div></div>';}).join('')+'</div>'
  :(apq.q||apq.cmd?emptyState('SearchNormal1','No cases match these filters','Clear the search or choose a different command to see more.')
   :emptyState('ClipboardTick','Nothing waiting on you','Cases appear here when a unit submits them for approval.')));
 const a=document.getElementById('apall');if(a)a.checked=c.length>0&&apSel.length===c.length;
}
function apToggle(id){const i=apSel.indexOf(id);if(i>-1)apSel.splice(i,1);else apSel.push(id);drawAp();}
function apToggleAll(on){apSel=on?apList().map(x=>x.id):[];drawAp();}
function apApprove(id){const x=findCase(id);
 modal('Approve this case',
  '<div class="pagesub" style="margin:0 0 14px">The case moves to Active, the unit is notified and the decision is written to the audit log.</div>'+
  '<div class="card" style="background:var(--bg-light)">'+kv('Case number',x.id)+kv('Applicant',x.applicant+' ('+x.relation+')')+
   kv('Service member',x.memberName+' ('+x.armyNo+')')+kv('Command',x.command)+kv('Maintenance sought',x.maintenance||'-')+'</div>',
  '<button class="btn ghost" onclick="closeModal()">Cancel</button>'+
  '<button class="btn prim" onclick="closeModal();caseAction(\''+id+'\',\'approve\');go(\'approvals\')">'+ic('TickCircle',17)+'Confirm approval</button>');}
function apSendBack(id){
 modal('Send back to unit',
  '<div class="pagesub" style="margin:0 0 14px">Case '+id+' returns to the originating unit. It leaves your queue until the unit resubmits it.</div>'+
  '<div class="f"><label>Reason for sending back <span class="req">*</span></label>'+
  '<textarea id="sbreason" style="height:96px" placeholder="Say what the unit must correct or attach"></textarea>'+
  '<div class="hint">The reason is added to the case history and shown to the unit.</div></div>',
  '<button class="btn ghost" onclick="closeModal()">Cancel</button>'+
  '<button class="btn prim" onclick="apSendBackGo(\''+id+'\')">'+ic('ArrowLeft2',17)+'Send back to unit</button>');}
function apSendBackGo(id){const r=(document.getElementById('sbreason').value||'').trim();
 if(r.length<5){toast('Enter a reason of at least five characters','err');return;}
 closeModal();caseAction(id,'sendback',r);go('approvals');}
function apBulkApprove(){const ids=apSel.slice();
 modal('Approve '+ids.length+' cases',
  '<div class="pagesub" style="margin:0 0 14px">Each case below moves to Active and is written to the audit log separately.</div>'+
  '<div class="card" style="background:var(--bg-light)">'+ids.map(i=>{const x=findCase(i);
    return '<div class="kv"><span class="k">'+i+'</span><span class="v">'+esc(x.applicant)+' &middot; '+x.command+'</span></div>';}).join('')+'</div>',
  '<button class="btn ghost" onclick="closeModal()">Cancel</button>'+
  '<button class="btn prim" onclick="apBulkGo()">'+ic('TickCircle',17)+'Approve all '+ids.length+'</button>');}
function apBulkGo(){const ids=apSel.slice();closeModal();
 ids.forEach(i=>{const x=findCase(i);if(!x||x.status!=="Registered")return;
   x.status="Active";x.history.push({stage:"Command approved",by:SESSION.name,when:new Date().toLocaleDateString('en-IN')});
   x.updated=new Date().toLocaleDateString('en-IN');addAudit('APPROVE_CASE','Approved '+i);});
 DB.set(STATE);apSel=[];toast(ids.length+' cases approved and set Active');go('approvals');}
/* ================= REPORTS ================= */
function vReports(m){
 m.innerHTML='<div class="crumb">Home / Reports</div><div class="pagehead"><div><div class="h2">Reports</div><div class="pagesub">Build a filtered report, then export or print it.</div></div></div>'+
 '<div class="card" style="margin-bottom:16px"><div class="tools" style="margin:0">'+
   '<select class="inp" id="rt" style="min-width:230px"><option value="summary">Case Summary Report</option><option value="cmd">Command-wise Report</option><option value="pending">Pending Approvals Report</option></select>'+
   '<select class="inp" id="rcmd"><option value="">All Commands</option>'+COMMANDS.map(k=>'<option>'+k+'</option>').join('')+'</select>'+
   '<select class="inp" id="rstat"><option value="">All Status</option>'+["Registered","Active","Sub-judice","Closed"].map(s=>'<option>'+s+'</option>').join('')+'</select>'+
   '<div class="sp" style="flex:1"></div><button class="btn prim" onclick="genReport()">'+ic('Chart21',17)+'Generate report</button>'+
   '<button class="btn ghost" onclick="exportReportCsv()">'+ic('DocumentDownload',17)+'Export to CSV</button><button class="btn ghost" onclick="window.print()">'+ic('Printer',17)+'Print report</button></div></div>'+
 '<div id="reportArea"></div>';genReport();
}
function reportData(){const type=document.getElementById('rt').value;let c=scoped();
 const cmd=document.getElementById('rcmd').value,st=document.getElementById('rstat').value;
 if(cmd)c=c.filter(x=>x.command===cmd);if(st)c=c.filter(x=>x.status===st);
 if(type==='pending')c=c.filter(x=>x.status==="Registered");
 const title=type==='cmd'?'Command-wise Report':type==='pending'?'Pending Approvals Report':'Case Summary Report';
 return {c,title};}
function exportReportCsv(){const{c,title}=reportData();
 const rows=[['Case No','Applicant','Relation','Member','Army No','Command','Maintenance','Status']]
   .concat(c.map(x=>[x.id,x.applicant,x.relation,x.memberName,x.armyNo,x.command,x.maintenance||'-',x.status]));
 downloadCsv('MAARK-'+title.replace(/\s+/g,'-')+'.csv',rows);addAudit('EXPORT_REPORT',title+' exported to CSV');toast('Report exported to CSV ('+c.length+' rows)');}
function genReport(){const{c,title}=reportData();
 const wm=(SESSION.name+' · ADG HR · CONFIDENTIAL · '+SESSION.ip+' · ').repeat(80);
 document.getElementById('reportArea').innerHTML='<div class="card sheet"><div class="wm"><span>'+wm+'</span></div>'+
   '<div class="rh"><b>Additional Directorate General of Human Rights</b><div>MAARK 2.0 &middot; '+title+' &middot; generated '+new Date().toLocaleDateString('en-IN')+'</div></div>'+
   '<div class="tblwrap"><table class="tbl"><thead><tr><th>Case No</th><th>Applicant</th><th>Member</th><th>Command</th><th>Maintenance</th><th>Status</th></tr></thead><tbody>'+
   (c.length?c.map(x=>'<tr><td>'+x.id+'</td><td>'+esc(x.applicant)+'</td><td>'+esc(x.memberName)+'</td><td>'+x.command+'</td><td>'+(x.maintenance||'-')+'</td><td>'+statTag(x.status)+'</td></tr>').join(''):'<tr><td colspan="6" class="muted" style="text-align:center;padding:20px">No records.</td></tr>')+
   '</tbody></table></div><div style="text-align:center;color:var(--text-4);font-size:12px;margin-top:14px;position:relative">Digitally watermarked with machine IP, user ID and timestamp</div></div>';
 addAudit('GENERATE_REPORT',title);
}
/* ================= CMS ================= */
function vCms(m){const s=STATE.cms;
 m.innerHTML='<div class="crumb">Home / Content Management</div><div class="pagehead"><div><div class="h2">Content Management System</div><div class="pagesub">Text and pages shown to unit users inside the portal.</div></div></div>'+
 '<div class="row2"><div class="card" style="flex:1;min-width:280px"><div class="sech"><span class="b"></span>Web Settings</div>'+
   '<div class="f"><label>Portal title</label><input id="cms_t" value="'+esc(s.portalTitle)+'"></div>'+
   '<div class="f"><label>Home banner text</label><input id="cms_b" value="'+esc(s.banner)+'"></div>'+
   '<div class="f"><label>Theme</label><select id="cms_th"><option '+(s.theme==='Light Green'?'selected':'')+'>Light Green</option><option '+(s.theme==='Dark Green'?'selected':'')+'>Dark Green</option><option '+(s.theme==='Violet'?'selected':'')+'>Violet</option></select></div>'+
   '<div class="f"><label>Notice</label><textarea id="cms_n">'+esc(s.notice)+'</textarea></div>'+
   '<button class="btn prim" onclick="saveCms()">'+ic('TickCircle',17)+'Save Settings</button></div>'+
 '<div class="card" style="flex:1;min-width:280px"><div class="sech"><span class="b"></span>Pages and Content</div>'+
   s.pages.map((p,i)=>'<div class="aitem" style="cursor:default">'+esc(p)+'<span class="act" style="margin-left:auto" onclick="editPageIdx('+i+')">'+ic('Edit2',15)+'Edit content</span><span class="act" onclick="deletePageIdx('+i+')">'+ic('Trash',15)+'Remove page</span></div>').join('')+
   '<button class="btn ghost sm" style="margin-top:12px" onclick="addPage()">'+ic('AddCircle',16)+'Add new page</button></div></div>'+
 '<div class="muted" style="font-size:12.5px;margin-top:12px">Every content change is audit-logged. Access is limited to the Super Admin.</div>';
}
function saveCms(){STATE.cms.portalTitle=val('cms_t');STATE.cms.banner=val('cms_b');STATE.cms.theme=document.getElementById('cms_th').value;STATE.cms.notice=val('cms_n');DB.set(STATE);addAudit('CMS_UPDATE','Updated web settings');toast('Web settings saved');}
function editPageIdx(i){const name=STATE.cms.pages[i];const content=(STATE.cms.content&&STATE.cms.content[name])||('Draft content for the '+name+' page.');
 modal('Edit page: '+esc(name),
  '<div class="f"><label>Page title</label><input id="pg_t" value="'+esc(name)+'"></div>'+
  '<div class="f"><label>Page content</label><textarea id="pg_c" style="height:150px">'+esc(content)+'</textarea></div>',
  '<button class="btn ghost" onclick="closeModal()">Cancel</button><button class="btn prim" onclick="savePageIdx('+i+')">Save page</button>');}
function savePageIdx(i){const old=STATE.cms.pages[i];const nt=(val('pg_t')||old);const c=document.getElementById('pg_c').value;
 STATE.cms.content=STATE.cms.content||{};STATE.cms.pages[i]=nt;if(old!==nt)delete STATE.cms.content[old];STATE.cms.content[nt]=c;
 DB.set(STATE);addAudit('CMS_PAGE','Edited page: '+nt);closeModal();toast('Page saved');go('cms');}
function addPage(){modal('Add new page',
  '<div class="f"><label>Page title</label><input id="pg_nt" placeholder="Enter page title"></div>'+
  '<div class="f"><label>Page content</label><textarea id="pg_nc" style="height:120px" placeholder="Enter page text"></textarea></div>',
  '<button class="btn ghost" onclick="closeModal()">Cancel</button><button class="btn prim" onclick="createPage()">Add page</button>');}
function createPage(){const t=val('pg_nt');if(!t){toast('Enter a page title','err');return;}
 STATE.cms.content=STATE.cms.content||{};STATE.cms.pages.push(t);STATE.cms.content[t]=document.getElementById('pg_nc').value;
 DB.set(STATE);addAudit('CMS_PAGE','Added page: '+t);closeModal();toast('Page added');go('cms');}
function deletePageIdx(i){const name=STATE.cms.pages[i];
 modal('Remove page','<p style="font-size:14px;color:var(--text-2)">Remove the page <b>'+esc(name)+'</b>? This is audit-logged.</p>',
  '<button class="btn ghost" onclick="closeModal()">Cancel</button><button class="btn prim" style="background:var(--error-active)" onclick="confirmDeletePage('+i+')">'+ic('Trash',15)+'Remove page</button>');}
function confirmDeletePage(i){const name=STATE.cms.pages[i];STATE.cms.pages.splice(i,1);if(STATE.cms.content)delete STATE.cms.content[name];
 DB.set(STATE);addAudit('CMS_PAGE','Removed page: '+name);closeModal();toast('Page removed');go('cms');}
/* ================= AUDIT ================= */
function vAudit(m){const a=STATE.audit;
 m.innerHTML='<div class="crumb">Home / Audit Log</div><div class="pagehead"><div><div class="h2">Audit Log</div><div class="pagesub">Every action taken in the portal, with user, role and time.</div></div></div>'+
 '<div class="tools"><span class="fieldwrap"><span class="fic">'+ic('SearchNormal1',16)+'</span><input class="inp search-i" id="auq" placeholder="Search the log" oninput="drawAudit()"></span><div class="sp" style="flex:1"></div><button class="btn ghost" onclick="exportAudit()">'+ic('DocumentDownload',17)+'Export to CSV</button></div>'+
 '<div id="audtable"></div>';drawAudit();
}
function exportAudit(){const rows=[['Timestamp','User','Role','Action','Detail','IP']].concat(STATE.audit.map(x=>[x.ts,x.user,x.role,x.action,x.detail,x.ip]));
 downloadCsv('MAARK-Audit-Log.csv',rows);toast('Audit log exported to CSV ('+STATE.audit.length+' events)');}
function drawAudit(){let a=STATE.audit;const q=(document.getElementById('auq')||{}).value;
 if(q){const s=q.toLowerCase();a=a.filter(x=>(x.action+x.user+x.detail+x.role).toLowerCase().includes(s));}
 if(!a.length){document.getElementById('audtable').innerHTML=emptyState('ShieldTick','No matching events','Try a different search term, or clear the search to see the full log.');return;}
 document.getElementById('audtable').innerHTML='<div class="tblwrap"><table class="tbl"><thead><tr><th>Timestamp</th><th>User</th><th>Role</th><th>Action</th><th>Detail</th><th>IP</th></tr></thead><tbody>'+
   a.map(x=>'<tr><td style="font-size:12.5px">'+esc(x.ts)+'</td><td>'+esc(x.user)+'</td><td><span class="stat s-Closed">'+esc(x.role)+'</span></td><td><b>'+esc(x.action)+'</b></td><td class="muted" style="font-size:12.5px">'+esc(x.detail)+'</td><td style="font-size:12.5px">'+esc(x.ip)+'</td></tr>').join('')+
 '</tbody></table></div><div class="pager">Showing '+a.length+' events<span style="flex:1"></span><span class="pg">Previous</span><span class="pg on">1</span><span class="pg">Next</span></div>';}
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
 '<div class="pagehead"><div><div class="h2">AI Assistant</div><div class="pagesub">Ask about case counts, status rules, policy or how to complete a step. Answers use only the data your role is cleared to see.</div></div></div>'+
 '<div class="aiwrap">'+
  '<div class="aicol">'+
   '<div class="aihead"><div class="av">'+ic('Messages2',20)+'</div>'+
    '<div class="id"><b>MAARK Assistant</b><small><i></i>On-premise and offline, no data leaves the network</small></div>'+
    '<div class="hacts"><button class="btn ghost sm" onclick="exportChat()">'+ic('DocumentDownload',16)+'Export transcript</button>'+
    '<button class="btn ghost sm" onclick="newChat()">'+ic('Refresh2',16)+'New chat</button></div></div>'+
   '<div class="aistream" id="aistream"></div>'+
   '<div class="aicomp"><div class="compbox">'+
     '<textarea id="aiq" rows="1" placeholder="Ask about a case, a rule or a next step" oninput="aiGrow(this)" onkeydown="aiKey(event,this)"></textarea>'+
     '<button class="sendb" id="aisend" onclick="askAi(document.getElementById(\'aiq\').value)" aria-label="Send question">'+ic('Send2',18)+'</button>'+
   '</div><div class="comphint"><span><kbd>Enter</kbd> to send</span><span><kbd>Shift</kbd> + <kbd>Enter</kbd> for a new line</span><span style="margin-left:auto">Answers are guidance, not an order. Verify against the file.</span></div></div>'+
  '</div>'+
  '<div class="airail">'+
   '<div class="rcard"><h4>Your scope</h4>'+
    '<div class="scoperow"><span class="k">Role</span><span class="v">'+esc(SESSION.role)+'</span></div>'+
    '<div class="scoperow"><span class="k">Command</span><span class="v">'+esc(SESSION.command||'All commands')+'</span></div>'+
    '<div class="scoperow"><span class="k">Cases in scope</span><span class="v">'+c.length+'</span></div>'+
    '<div class="scoperow"><span class="k">Active</span><span class="v">'+c.filter(x=>x.status==='Active').length+'</span></div>'+
    '<div class="scoperow"><span class="k">Awaiting approval</span><span class="v">'+c.filter(x=>x.status==='Registered').length+'</span></div>'+
   '</div>'+
   '<div class="rcard"><h4>Suggested questions</h4><div class="qlist">'+
     AI_RAIL.map(x=>'<div class="qi" onclick="askAi('+aiArg(x.q)+')"><span class="qc">'+ic(x.ic,16)+'</span><span>'+x.q+'</span></div>').join('')+
   '</div></div>'+
   '<div class="railnote">The assistant reads the policy set and the case records inside your command only. It cannot open a case for you, change a status or approve anything. Every look-up is written to the audit log.</div>'+
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
   '<div class="startgrid">'+AI_STARTERS.map(x=>'<div class="startc" onclick="askAi('+aiArg(x.q)+')"><span>'+ic(x.ic,14)+x.cat+'</span><b>'+x.q+'</b></div>').join('')+'</div></div>';
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
 if(l.includes('active'))return{html:'You have <b>'+c.filter(x=>x.status==='Active').length+' active cases</b> in scope. Active means the case is registered, approved and still inside the 180 day window.',src:'Case register',chips:['Break my cases down by status','Which cases are near the 180 day limit?']};
 if(l.includes('sub-judice')||l.includes('subjudice'))return{html:'<b>'+c.filter(x=>x.status==='Sub-judice').length+'</b> cases are sub-judice. These are held in court, and no maintenance decision is taken until the court rules.',src:'Case register',chips:['Break my cases down by status']};
 if(l.includes('closed'))return{html:'<b>'+c.filter(x=>x.status==='Closed').length+'</b> cases are closed. A closed case keeps its full noting history for audit.',src:'Case register',chips:['Break my cases down by status']};
 if(l.includes('180')||l.includes('limit')||l.includes('overdue')||l.includes('deadline')){const n=c.filter(x=>x.status==='Active'||x.status==='Registered').length;
  return{html:'A case must be resolved within <b>180 days</b> of registration. '+n+' of your cases are still open against that clock. The Registered Cases screen shows the days left on each one.',src:'Policy set, clause 4.2',chips:['What is pending my approval?','Break my cases down by status']};}
 if(l.includes('pending')||l.includes('approval')||l.includes('approve'))return{html:'<b>'+c.filter(x=>x.status==='Registered').length+'</b> cases are waiting on approval. The Brigade Commander approves first, then the file moves one level up.',src:'Approval queue',chips:['Explain the approval workflow','Break my cases down by status']};
 if(l.includes('how many')||l.includes('total')||l.includes('break')||l.includes('status'))return{html:'You have <b>'+c.length+' cases</b> in scope: '+['Registered','Active','Sub-judice','Closed'].map(s=>'<b>'+c.filter(x=>x.status===s).length+'</b> '+s.toLowerCase()).join(', ')+'.',src:'Case register',chips:['What is pending my approval?','Which cases are near the 180 day limit?']};
 if(l.includes('eligib')||l.includes('policy')||l.includes('maintenance'))return{html:'Maintenance is payable to an eligible dependent: wife, mother or child. The Army steps in within 3 years of the claim. If the applicant is employable, maintenance is not allowed.',src:'Policy set, clause 2.1',chips:['Explain the approval workflow','Which cases are near the 180 day limit?']};
 if(l.includes('noting')||l.includes('note'))return{html:'Open the case, go to the Notings tab and write your remark. A yellow noting is still editable by you. Freezing it turns it green and locks it into the record for good.',src:'User guide',chips:['Explain the approval workflow']};
 if(l.includes('workflow')||l.includes('process')||l.includes('step'))return{html:'The unit files the case. The Brigade Commander approves it. Approval then moves one level up, and ADG HR keeps oversight throughout. Notings are colour coded: yellow is editable, green is frozen.',src:'Policy set, clause 3',chips:['What is pending my approval?','How do I add a noting to a case?']};
 if(l.includes('role')||l.includes('see')||l.includes('access')||l.includes('permission')||l.includes('security'))return{html:'You are signed in as <b>'+esc(SESSION.role)+'</b>'+(SESSION.command?' for '+esc(SESSION.command):'')+'. You see '+c.length+' cases and nothing outside that scope. Every question you ask here is written to the audit log.',src:'Access control',chips:['Break my cases down by status']};
 if(l==='hi'||l.includes('hello')||l.includes('namaste'))return{html:'Namaste. Ask me about eligibility, the approval workflow, or the live case data in your command.',src:'',chips:['How many active cases?','Who is eligible for maintenance?']};
 return{html:'I did not follow that one. I can answer on eligibility and policy, the approval workflow, security and scope, and the live case data: counts, status breakdowns and a case look-up by number.',src:'',chips:['How many active cases?','Explain the approval workflow','Show MNT/2026/0142']};
}
/* ================= SEARCH ================= */
function globalSearch(v){v=(v||'').trim();if(!v){return;}const up=v.toUpperCase();
 if(up.match(/MNT\/2026\/\d{4}/)&&findCase(up.match(/MNT\/2026\/\d{4}/)[0])){go('casedetail',up.match(/MNT\/2026\/\d{4}/)[0]);return;}
 regFilter.q=v;regFilter.status='all';go('registered');}
