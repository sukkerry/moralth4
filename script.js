'use strict';
/* ============================================================
   DUNIA BUNYI — Modul Interaktif Pendidikan Khas
   Standard Kandungan 3.1.2 : Mengecam bunyi yang didengar
   (i) haiwan · (ii) manusia · (iii) kenderaan
   Aras: Mudah · Sederhana · Mencabar — 7 aktiviti setiap aras
   ============================================================ */

/* ---------- 1. ENJIN AUDIO (Web Audio API, tiada fail luaran) ---------- */
let AC = null;
function ac(){
  if(!AC){ const C = window.AudioContext || window.webkitAudioContext; if(C) AC = new C(); }
  if(AC && AC.state === 'suspended') AC.resume();
  return AC;
}
function tone(o){
  if(!ac()) return;
  const t0 = AC.currentTime + (o.t||0);
  const d = o.d||.25, v = (o.v==null)?.2:o.v, atk = o.a||.02;
  const rel = Math.min(o.rel==null?.1:o.rel, d*.5);
  const osc = AC.createOscillator(), g = AC.createGain();
  osc.type = o.type||'sine';
  osc.frequency.setValueAtTime(Math.max(o.f,1), t0);
  if(o.f2) osc.frequency.exponentialRampToValueAtTime(Math.max(o.f2,1), t0+(o.slide||d));
  g.gain.setValueAtTime(.0001, t0);
  g.gain.exponentialRampToValueAtTime(v, t0+atk);
  g.gain.setValueAtTime(v, Math.max(t0+atk, t0+d-rel));
  g.gain.exponentialRampToValueAtTime(.0001, t0+d);
  osc.connect(g); g.connect(AC.destination);
  osc.start(t0); osc.stop(t0+d+.06);
}
function noise(o){
  if(!ac()) return;
  const t0 = AC.currentTime + (o.t||0);
  const d = o.d||.15, v = (o.v==null)?.25:o.v, atk = o.a||.01;
  const rel = o.rel==null ? Math.min(.1, d*.4) : o.rel;
  const len = Math.max(1, Math.ceil(AC.sampleRate*(d+.05)));
  const buf = AC.createBuffer(1, len, AC.sampleRate);
  const ch = buf.getChannelData(0);
  for(let i=0;i<len;i++) ch[i] = Math.random()*2-1;
  const src = AC.createBufferSource(); src.buffer = buf;
  const f = AC.createBiquadFilter(); f.type='bandpass';
  f.frequency.value = o.fq||1000; f.Q.value = o.q==null?1:o.q;
  const g = AC.createGain();
  g.gain.setValueAtTime(.0001, t0);
  g.gain.exponentialRampToValueAtTime(v, t0+atk);
  g.gain.setValueAtTime(v, Math.max(t0+atk, t0+d-rel));
  g.gain.exponentialRampToValueAtTime(.0001, t0+d);
  src.connect(f); f.connect(g); g.connect(AC.destination);
  src.start(t0); src.stop(t0+d+.05);
}
/* Bunyi maklum balas (lembut, mesra pelajar pendidikan khas) */
const sfx = {
  blip(){ tone({f:560,f2:840,d:.06,type:'triangle',v:.09}); },
  pop(){ tone({f:380,f2:720,d:.09,type:'sine',v:.16}); },
  flip(){ tone({f:660,f2:430,d:.07,type:'sine',v:.1}); },
  snap(){ noise({d:.06,fq:1300,v:.22,q:1.2}); tone({f:880,f2:620,d:.05,type:'triangle',v:.07}); },
  correct(){ [523,659,784].forEach((f,i)=>tone({t:i*.08,f,d:.14,type:'triangle',v:.16})); tone({t:.24,f:1047,d:.28,type:'triangle',v:.16}); },
  wrong(){ tone({f:330,f2:247,d:.16,type:'triangle',v:.13}); tone({t:.16,f:247,f2:180,d:.3,type:'triangle',v:.13}); },
  win(){ [523,659,784,1047,1319].forEach((f,i)=>tone({t:i*.11,f,d:.3,type:'triangle',v:.17})); noise({t:.05,d:.5,fq:2800,v:.05,q:.7}); noise({t:.35,d:.5,fq:2800,v:.05,q:.7}); }
};

/* ---------- 2. ILUSTRASI SVG (dilukis sendiri, gaya sticker) ---------- */
const INK = '#3A2E39';
function art(bg, inner){
  return `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><rect x="2.5" y="2.5" width="115" height="115" rx="18" fill="${bg}" stroke="${INK}" stroke-width="3"/><g fill="none" stroke="${INK}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">${inner}</g></svg>`;
}
const ART = {
kucing: art('#FFF0DC',`
 <path d="M28 50 L22 20 L52 37 Z" fill="#F79D44"/><path d="M92 50 L98 20 L68 37 Z" fill="#F79D44"/>
 <path d="M31 43 L28 29 L43 38 Z" fill="#E85D75" stroke="none"/><path d="M89 43 L92 29 L77 38 Z" fill="#E85D75" stroke="none"/>
 <ellipse cx="60" cy="66" rx="36" ry="32" fill="#F79D44"/>
 <path d="M52 37 v7 M60 35 v9 M68 37 v7" stroke-width="2.6"/>
 <circle cx="47" cy="60" r="4.5" fill="${INK}" stroke="none"/><circle cx="73" cy="60" r="4.5" fill="${INK}" stroke="none"/>
 <path d="M55 68 L65 68 L60 74 Z" fill="#E85D75"/>
 <path d="M60 74 Q54 82 46 78 M60 74 Q66 82 74 78"/>
 <path d="M22 64 Q32 60 40 64 M23 74 Q32 78 40 72 M98 64 Q88 60 80 64 M97 74 Q88 78 80 72" stroke-width="2.4"/>`),
anjing: art('#E1F0FA',`
 <ellipse cx="29" cy="58" rx="12" ry="21" fill="#8A5A33" transform="rotate(15 29 58)"/>
 <ellipse cx="91" cy="58" rx="12" ry="21" fill="#8A5A33" transform="rotate(-15 91 58)"/>
 <ellipse cx="60" cy="64" rx="35" ry="31" fill="#C68B59"/>
 <circle cx="60" cy="44" r="6" fill="#8A5A33" stroke="none"/>
 <circle cx="46" cy="59" r="4.2" fill="${INK}" stroke="none"/><circle cx="74" cy="59" r="4.2" fill="${INK}" stroke="none"/>
 <ellipse cx="60" cy="78" rx="19" ry="14" fill="#F3D9B8"/>
 <ellipse cx="60" cy="72" rx="7.5" ry="6" fill="${INK}" stroke="none"/>
 <path d="M60 78 Q54 86 47 82 M60 78 Q66 86 73 82"/>
 <path d="M56 85 q4 8 8 0 z" fill="#E85D75"/>`),
lembu: art('#E8F6E8',`
 <path d="M28 38 Q14 30 15 16 Q30 20 34 34 Z" fill="#E4D3B0"/><path d="M92 38 Q106 30 105 16 Q90 20 86 34 Z" fill="#E4D3B0"/>
 <ellipse cx="26" cy="54" rx="12" ry="8" fill="#FFF" transform="rotate(-20 26 54)"/>
 <ellipse cx="94" cy="54" rx="12" ry="8" fill="#FFF" transform="rotate(20 94 54)"/>
 <ellipse cx="60" cy="64" rx="34" ry="30" fill="#FFF"/>
 <circle cx="76" cy="48" r="8" fill="#C68B59" stroke="none"/><circle cx="46" cy="46" r="6" fill="#C68B59" stroke="none"/>
 <circle cx="47" cy="62" r="4" fill="${INK}" stroke="none"/><circle cx="73" cy="62" r="4" fill="${INK}" stroke="none"/>
 <ellipse cx="60" cy="82" rx="21" ry="12" fill="#F4A9B8"/>
 <ellipse cx="52" cy="82" rx="3.5" ry="5" fill="${INK}" stroke="none"/><ellipse cx="68" cy="82" rx="3.5" ry="5" fill="${INK}" stroke="none"/>`),
ayam: art('#FFF3CF',`
 <circle cx="51" cy="31" r="5" fill="#E5455F"/><circle cx="60" cy="27" r="6" fill="#E5455F"/><circle cx="69" cy="31" r="5" fill="#E5455F"/>
 <circle cx="60" cy="45" r="15" fill="#FFF"/><ellipse cx="60" cy="75" rx="31" ry="24" fill="#FFF"/>
 <circle cx="53" cy="43" r="2.8" fill="${INK}" stroke="none"/><circle cx="67" cy="43" r="2.8" fill="${INK}" stroke="none"/>
 <path d="M54 50 L66 50 L60 57 Z" fill="#F79D44"/><path d="M56 57 q4 9 8 0 z" fill="#E5455F"/>
 <path d="M32 74 q4 -12 15 -6 q-2 12 -15 6 z" fill="#F0E3CB"/><path d="M88 74 q-4 -12 -15 -6 q2 12 15 6 z" fill="#F0E3CB"/>
 <path d="M52 99 v6 M68 99 v6 M46 108 h12 M62 108 h12"/>`),
burung: art('#E3EFFC',`
 <rect x="22" y="90" width="76" height="8" rx="4" fill="#8A5A33"/>
 <path d="M30 86 q-4 -12 6 -16 q6 10 -6 16 z" fill="#4CB963"/>
 <path d="M40 66 q-18 -8 -24 0 q6 12 24 4 z" fill="#2E5FA3"/>
 <ellipse cx="58" cy="68" rx="27" ry="24" fill="#4A90D9"/>
 <circle cx="74" cy="56" r="11" fill="#FFF" stroke-width="2.6"/>
 <path d="M84 52 L98 57 L84 61 Z" fill="#F79D44"/>
 <circle cx="75" cy="54" r="3" fill="${INK}" stroke="none"/><circle cx="76" cy="53" r="1" fill="#FFF" stroke="none"/>
 <path d="M44 68 q12 -10 22 0 q-8 12 -22 0 z" fill="#2E5FA3"/>
 <path d="M54 92 v-16 M64 92 v-12"/>`),
itik: art('#DDF2EE',`
 <path d="M22 100 q8 -7 16 0 t16 0 t16 0 t16 0" fill="none" stroke="#4A90D9" stroke-width="4"/>
 <path d="M38 76 q-12 -8 -10 -18 q10 2 12 12 z" fill="#FFD166"/>
 <ellipse cx="64" cy="78" rx="28" ry="19" fill="#FFD166"/>
 <circle cx="42" cy="52" r="14" fill="#FFD166"/>
 <path d="M28 48 L12 44 L28 56 Z" fill="#F79D44"/>
 <circle cx="43" cy="48" r="2.8" fill="${INK}" stroke="none"/>
 <path d="M60 74 q14 -8 22 2 q-10 10 -22 -2 z" fill="#F0B429"/>`),
ketawa: art('#FFEFB5',`
 <circle cx="60" cy="62" r="34" fill="#FFD166"/>
 <path d="M44 52 q6 -8 12 0 M64 52 q6 -8 12 0"/>
 <circle cx="40" cy="66" r="6" fill="#FF9E80" stroke="none"/><circle cx="80" cy="66" r="6" fill="#FF9E80" stroke="none"/>
 <path d="M44 64 q16 26 32 0 z" fill="#A93B55"/>
 <path d="M53 76 q7 10 14 0 z" fill="#E85D75" stroke="none"/>
 <path d="M22 36 l7 -7 M28 48 l9 -4 M98 36 l-7 -7 M92 48 l-9 -4" stroke-width="3"/>`),
menangis: art('#E2EAF6',`
 <path d="M34 46 q4 -24 26 -24 q22 0 26 24 q-12 -10 -26 -10 q-14 0 -26 10 z" fill="#6B4A33"/>
 <circle cx="60" cy="64" r="34" fill="#FFDCB8"/>
 <path d="M43 52 q6 -5 12 -1 M65 51 q6 -4 12 1" stroke-width="2.6"/>
 <circle cx="49" cy="61" r="3.5" fill="${INK}" stroke="none"/><circle cx="71" cy="61" r="3.5" fill="${INK}" stroke="none"/>
 <path d="M49 67 C44 78 43 84 49 86 C55 84 54 78 49 67 z" fill="#4A90D9" stroke="none"/>
 <path d="M71 67 C66 78 65 84 71 86 C77 84 76 78 71 67 z" fill="#4A90D9" stroke="none"/>
 <path d="M50 84 q10 -10 20 0"/>`),
bersin: art('#FCE3E7',`
 <circle cx="60" cy="62" r="34" fill="#FFAC75"/>
 <path d="M44 52 q6 6 12 0 M64 52 q6 6 12 0"/>
 <circle cx="40" cy="64" r="6" fill="#FF7043" stroke="none"/><circle cx="80" cy="64" r="6" fill="#FF7043" stroke="none"/>
 <ellipse cx="60" cy="77" rx="11" ry="9" fill="#A93B55"/>
 <path d="M24 58 l-9 -4 M25 70 l-10 2 M96 58 l9 -4 M95 70 l10 2" stroke-width="3"/>
 <circle cx="30" cy="82" r="2" fill="${INK}" stroke="none"/><circle cx="90" cy="82" r="2" fill="${INK}" stroke="none"/>`),
tepukan: art('#FFE6D5',`
 <g><rect x="20" y="34" width="9" height="24" rx="4.5" fill="#F3C292"/><rect x="31" y="30" width="9" height="28" rx="4.5" fill="#F3C292"/><rect x="42" y="30" width="9" height="28" rx="4.5" fill="#F3C292"/><rect x="53" y="34" width="9" height="24" rx="4.5" fill="#F3C292"/><ellipse cx="41" cy="68" rx="15" ry="16" fill="#F3C292"/><rect x="44" y="56" width="9" height="20" rx="4.5" fill="#F3C292" transform="rotate(-38 48 66)"/></g>
 <g transform="translate(120 0) scale(-1 1)"><rect x="20" y="34" width="9" height="24" rx="4.5" fill="#F3C292"/><rect x="31" y="30" width="9" height="28" rx="4.5" fill="#F3C292"/><rect x="42" y="30" width="9" height="28" rx="4.5" fill="#F3C292"/><rect x="53" y="34" width="9" height="24" rx="4.5" fill="#F3C292"/><ellipse cx="41" cy="68" rx="15" ry="16" fill="#F3C292"/><rect x="44" y="56" width="9" height="20" rx="4.5" fill="#F3C292" transform="rotate(-38 48 66)"/></g>
 <path d="M60 28 v-9 M50 30 l-5 -9 M70 30 l5 -9" stroke-width="3"/>`),
kereta: art('#FFE1DC',`
 <path d="M34 60 L41 36 Q43 31 48 31 L72 31 Q77 31 79 36 L86 60 Z" fill="#E5455F"/>
 <rect x="17" y="58" width="86" height="27" rx="11" fill="#E5455F"/>
 <path d="M43 37 L39 55 L56 55 L56 37 Z" fill="#BEE3F2" stroke-width="2.6"/>
 <path d="M63 37 L63 55 L79 55 L75 37 Z" fill="#BEE3F2" stroke-width="2.6"/>
 <circle cx="37" cy="86" r="11" fill="${INK}" stroke-width="2.6"/><circle cx="37" cy="86" r="4.5" fill="#D9D9D9" stroke="none"/>
 <circle cx="83" cy="86" r="11" fill="${INK}" stroke-width="2.6"/><circle cx="83" cy="86" r="4.5" fill="#D9D9D9" stroke="none"/>
 <rect x="97" y="63" width="8" height="9" rx="3" fill="#FFD166" stroke-width="2.4"/>
 <path d="M60 60 v22" stroke-width="2.4"/>`),
bas: art('#FFF2C9',`
 <rect x="13" y="32" width="94" height="48" rx="9" fill="#FFC94D"/>
 <rect x="21" y="40" width="17" height="17" rx="3" fill="#BEE3F2" stroke-width="2.6"/>
 <rect x="43" y="40" width="17" height="17" rx="3" fill="#BEE3F2" stroke-width="2.6"/>
 <rect x="65" y="40" width="17" height="17" rx="3" fill="#BEE3F2" stroke-width="2.6"/>
 <rect x="87" y="40" width="14" height="17" rx="3" fill="#BEE3F2" stroke-width="2.6"/>
 <path d="M13 62 h94 v10 a9 9 0 0 1 -9 8 H22 a9 9 0 0 1 -9 -8 z" fill="#E5455F"/>
 <circle cx="36" cy="82" r="10.5" fill="${INK}" stroke-width="2.6"/><circle cx="36" cy="82" r="4" fill="#D9D9D9" stroke="none"/>
 <circle cx="88" cy="82" r="10.5" fill="${INK}" stroke-width="2.6"/><circle cx="88" cy="82" r="4" fill="#D9D9D9" stroke="none"/>`),
motosikal: art('#E9EEF6',`
 <circle cx="29" cy="84" r="14" fill="${INK}"/><circle cx="29" cy="84" r="5.5" fill="#D9D9D9" stroke="none"/>
 <circle cx="91" cy="84" r="14" fill="${INK}"/><circle cx="91" cy="84" r="5.5" fill="#D9D9D9" stroke="none"/>
 <path d="M29 84 Q40 52 62 58" fill="none" stroke="#E5455F" stroke-width="7"/>
 <path d="M62 58 Q88 62 91 84" fill="none" stroke="#E5455F" stroke-width="7"/>
 <ellipse cx="58" cy="56" rx="13" ry="10" fill="#E5455F"/>
 <rect x="38" y="44" width="22" height="9" rx="4.5" fill="${INK}"/>
 <path d="M68 48 q12 -4 14 -16" fill="none" stroke="${INK}" stroke-width="5"/>
 <circle cx="86" cy="56" r="5.5" fill="#FFD166"/>
 <rect x="62" y="74" width="20" height="7" rx="3.5" fill="#9AA1AC" stroke-width="2.4"/>`),
ambulans: art('#E0F4EF',`
 <path d="M12 66 h96 v10 a6 6 0 0 1 -6 6 H18 a6 6 0 0 1 -6 -6 z" fill="#E5455F"/>
 <rect x="12" y="40" width="96" height="32" rx="7" fill="#FFF"/>
 <rect x="84" y="46" width="16" height="15" rx="3" fill="#BEE3F2" stroke-width="2.6"/>
 <rect x="42" y="44" width="11" height="26" rx="2.5" fill="#E5455F"/><rect x="34.5" y="51.5" width="26" height="11" rx="2.5" fill="#E5455F"/>
 <rect x="30" y="28" width="18" height="11" rx="4" fill="#3D7BD9"/>
 <path d="M24 24 l-7 -6 M39 22 v-9 M54 24 l7 -6" stroke-width="3"/>
 <circle cx="32" cy="82" r="10.5" fill="${INK}" stroke-width="2.6"/><circle cx="32" cy="82" r="4" fill="#D9D9D9" stroke="none"/>
 <circle cx="90" cy="82" r="10.5" fill="${INK}" stroke-width="2.6"/><circle cx="90" cy="82" r="4" fill="#D9D9D9" stroke="none"/>`),
kapalterbang: art('#E2EAF8',`
 <circle cx="90" cy="26" r="6.5" fill="#FFF" stroke-width="2.4"/><circle cx="99" cy="29" r="5" fill="#FFF" stroke-width="2.4"/><circle cx="82" cy="29" r="4.5" fill="#FFF" stroke-width="2.4"/>
 <path d="M28 54 Q22 32 32 32 L44 50 Z" fill="#4A90D9"/>
 <path d="M22 62 Q22 52 40 50 L88 47 Q107 47 108 60 Q107 71 88 71 L40 69 Q22 67 22 62 z" fill="#FFF"/>
 <path d="M50 60 L38 88 L52 88 L64 63 z" fill="#4A90D9"/>
 <circle cx="54" cy="58" r="3" fill="#BEE3F2" stroke-width="2"/><circle cx="67" cy="58" r="3" fill="#BEE3F2" stroke-width="2"/>
 <circle cx="80" cy="58" r="3" fill="#BEE3F2" stroke-width="2"/><circle cx="93" cy="58" r="3" fill="#BEE3F2" stroke-width="2"/>`)
};

/* ---------- 3. DATA ITEM (bunyi dijana secara sintetik) ---------- */
const ITEMS = [
 {id:'kucing', name:'Kucing', cat:'haiwan', color:'#F79D44', dur:.6, art:ART.kucing,
  sound(){ tone({f:660,f2:520,d:.22,v:.22}); tone({t:.2,f:520,f2:790,d:.3,v:.22}); }},
 {id:'anjing', name:'Anjing', cat:'haiwan', color:'#C68B59', dur:.6, art:ART.anjing,
  sound(){ [0,.28].forEach(t=>{ tone({t,f:180,f2:110,d:.13,type:'sawtooth',v:.22}); noise({t,d:.09,fq:600,v:.1,q:.8}); }); }},
 {id:'lembu', name:'Lembu', cat:'haiwan', color:'#7FAF7F', dur:1.1, art:ART.lembu,
  sound(){ tone({f:135,f2:92,d:1.05,type:'sawtooth',v:.16,slide:.95}); tone({t:.02,f:139,f2:96,d:1,type:'sawtooth',v:.1}); }},
 {id:'ayam', name:'Ayam', cat:'haiwan', color:'#E5455F', dur:1, art:ART.ayam,
  sound(){ [0,.15,.3].forEach((t,i)=>tone({t,f:980-i*90,f2:720,d:.09,type:'triangle',v:.16})); tone({t:.5,f:1150,f2:480,d:.45,type:'triangle',v:.16}); }},
 {id:'burung', name:'Burung', cat:'haiwan', color:'#4A90D9', dur:.95, art:ART.burung,
  sound(){ [0,.16,.34,.56,.74].forEach((t,i)=>tone({t,f:2500+(i%2)*400,f2:3300+(i%2)*300,d:.08,v:.14})); }},
 {id:'itik', name:'Itik', cat:'haiwan', color:'#F0B429', dur:.95, art:ART.itik,
  sound(){ [0,.22,.44,.66].forEach(t=>tone({t,f:460,f2:290,d:.15,type:'sawtooth',v:.16})); }},
 {id:'ketawa', name:'Ketawa', cat:'manusia', color:'#E8A93C', dur:.85, art:ART.ketawa,
  sound(){ [0,.15,.3,.45,.6].forEach(t=>{ tone({t,f:240,f2:185,d:.1,type:'triangle',v:.24}); noise({t:t+.01,d:.07,fq:800,v:.05,q:.5}); }); }},
 {id:'menangis', name:'Menangis', cat:'manusia', color:'#5B8DD9', dur:1.15, art:ART.menangis,
  sound(){ tone({f:560,f2:420,d:.3,v:.18}); tone({t:.3,f:430,f2:560,d:.22,v:.18}); tone({t:.52,f:560,f2:360,d:.55,v:.18}); }},
 {id:'bersin', name:'Bersin', cat:'manusia', color:'#FF7043', dur:.6, art:ART.bersin,
  sound(){ tone({f:480,f2:860,d:.38,v:.14}); noise({t:.36,d:.16,fq:1600,v:.35,q:.7}); tone({t:.36,f:620,f2:280,d:.16,type:'triangle',v:.12}); }},
 {id:'tepukan', name:'Tepukan', cat:'manusia', color:'#E0975C', dur:1, art:ART.tepukan,
  sound(){ [0,.28,.56,.84].forEach(t=>{ noise({t,d:.08,fq:1300,v:.4,q:1.4}); noise({t:t+.01,d:.05,fq:2600,v:.15}); }); }},
 {id:'kereta', name:'Kereta', cat:'kenderaan', color:'#E5455F', dur:.6, art:ART.kereta,
  sound(){ const h=t=>{ tone({t,f:440,d:.2,type:'square',v:.09}); tone({t,f:554,d:.2,type:'square',v:.07}); tone({t,f:220,d:.2,type:'triangle',v:.12}); }; h(0); h(.32); }},
 {id:'bas', name:'Bas', cat:'kenderaan', color:'#F0B429', dur:1.1, art:ART.bas,
  sound(){ tone({f:196,d:.55,type:'square',v:.09}); tone({f:247,d:.55,type:'square',v:.07}); tone({t:.7,f:196,d:.3,type:'square',v:.09}); tone({t:.7,f:247,d:.3,type:'square',v:.07}); }},
 {id:'motosikal', name:'Motosikal', cat:'kenderaan', color:'#6D7B8A', dur:1.9, art:ART.motosikal,
  sound(){ noise({t:0,d:1.6,fq:280,v:.07,q:.6}); tone({f:85,f2:240,d:.55,type:'sawtooth',v:.13,slide:.5}); tone({t:.55,f:240,f2:130,d:.4,type:'sawtooth',v:.13,slide:.35}); tone({t:.95,f:130,f2:250,d:.5,type:'sawtooth',v:.13,slide:.45}); tone({t:1.45,f:250,f2:90,d:.3,type:'sawtooth',v:.11,slide:.25}); }},
 {id:'ambulans', name:'Ambulans', cat:'kenderaan', color:'#3D7BD9', dur:1.95, art:ART.ambulans,
  sound(){ for(let i=0;i<3;i++){ tone({t:i*.62,f:620,f2:940,d:.3,v:.13,slide:.28}); tone({t:i*.62+.3,f:940,f2:620,d:.3,v:.13,slide:.28}); } }},
 {id:'kapalterbang', name:'Kapal Terbang', cat:'kenderaan', color:'#7FA8E3', dur:2.5, art:ART.kapalterbang,
  sound(){ noise({t:0,d:2.4,fq:220,v:.16,a:.5,q:.5,rel:.8}); tone({f:78,d:2.4,type:'sawtooth',v:.06,a:.4,rel:.8}); }}
];
const byId = Object.fromEntries(ITEMS.map(i=>[i.id,i]));
function svgOf(item, vb){ return vb ? item.art.replace('viewBox="0 0 120 120"', `viewBox="${vb}"`) : item.art; }

/* ---------- 4. ARAS & AKTIVITI ---------- */
const LEVELS = {
 mudah:      {key:'mudah', nama:'Mudah', color:'#4CB963', bintang:1, tag:'2 pilihan · bantuan penuh',
   pool:['kucing','anjing','lembu','ayam','kereta','bas','ketawa','tepukan'],
   cfg:{choices:2, soal:5, padanan:3, drag:3, mem:3, tf:5, seq:3, puzzle:2, puzzleNum:true, showName:true}},
 sederhana:  {key:'sederhana', nama:'Sederhana', color:'#FF9642', bintang:2, tag:'3 pilihan · bantuan sederhana',
   pool:['kucing','anjing','lembu','ayam','burung','itik','kereta','bas','motosikal','ketawa','tepukan','bersin'],
   cfg:{choices:3, soal:6, padanan:4, drag:4, mem:4, tf:6, seq:4, puzzle:2, puzzleNum:false, showName:true}},
 mencabar:   {key:'mencabar', nama:'Mencabar', color:'#FF5D5D', bintang:3, tag:'4 pilihan · tanpa bantuan',
   pool:['kucing','anjing','lembu','ayam','burung','itik','ketawa','menangis','bersin','tepukan','kereta','bas','motosikal','ambulans','kapalterbang'],
   cfg:{choices:4, soal:8, padanan:5, drag:5, mem:6, tf:8, seq:5, puzzle:3, puzzleNum:false, showName:false}}
};
Object.values(LEVELS).forEach(l=>{ l.pool = l.pool.map(id=>byId[id]); });

const ICONS = {
 speaker:`<svg viewBox="0 0 24 24"><path d="M11 5 6 9H2v6h4l5 4z" fill="currentColor" stroke="none"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.6 5.6a9 9 0 0 1 0 12.8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
 link:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M10 14a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7-7l-1.2 1.1"/><path d="M14 10a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7 7l1.2-1.1"/></svg>`,
 move:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18M3 12h18M12 3l-3 3M12 3l3 3M12 21l-3-3M12 21l3-3M3 12l3-3M3 12l3 3M21 12l-3-3M21 12l-3 3"/></svg>`,
 cards:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><rect x="4" y="7" width="9" height="13" rx="2"/><rect x="11" y="4" width="9" height="13" rx="2"/><path d="M15.5 8.5h.01M15.5 12h.01M15.5 15.5h.01" stroke-linecap="round" stroke-width="3"/></svg>`,
 check:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 12.5l5 5L20 6.5"/></svg>`,
 cross:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>`,
 order:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M4 6h2v2H4zM4 11h2v2H4zM4 16h2v2H4z" fill="currentColor" stroke="none"/><path d="M9 7h11M9 12h8M9 17h11"/></svg>`,
 puzzle:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><rect x="3.5" y="3.5" width="7.5" height="7.5" rx="1.5"/><rect x="13" y="3.5" width="7.5" height="7.5" rx="1.5"/><rect x="3.5" y="13" width="7.5" height="7.5" rx="1.5"/><path d="M13 13h7.5v7.5H13z" fill="currentColor" stroke="none" opacity=".35"/></svg>`,
 trophy:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 21h8M12 17v4M7 4h10v6a5 5 0 0 1-10 0z"/><path d="M7 6H4a3 3 0 0 0 3 5M17 6h3a3 3 0 0 1-3 5"/></svg>`
};
const ACTS = [
 {key:'mengecam',  no:1, nama:'Mengecam Bunyi', color:'#FF5D5D', icon:'speaker',
  desc:'Dengar bunyi dan pilih gambar yang betul.',
  arahan:'Aktiviti mengecam. Dengar bunyi dengan teliti, kemudian tekan gambar yang sepadan dengan bunyi itu.'},
 {key:'padanan',   no:2, nama:'Padanan Bunyi', color:'#4A90D9', icon:'link',
  desc:'Padankan kad bunyi dengan kad gambar.',
  arahan:'Aktiviti padanan. Tekan kad bunyi untuk mendengar bunyinya, kemudian padankan dengan gambar yang betul.'},
 {key:'dragdrop',  no:3, nama:'Tarik dan Letak', color:'#4CB963', icon:'move',
  desc:'Letakkan nama pada gambar yang betul.',
  arahan:'Aktiviti tarik dan letak. Tarik perkataan ke kotak di bawah gambar yang betul. Tekan gambar jika mahu mendengar bunyinya.'},
 {key:'memori',    no:4, nama:'Memori Bunyi', color:'#FF9642', icon:'cards',
  desc:'Cari pasangan bunyi dan gambar yang sama.',
  arahan:'Aktiviti memori. Buka kad untuk mendengar bunyi atau melihat gambar. Cari pasangan bunyi dan gambar yang sama.'},
 {key:'betulsalah',no:5, nama:'Betul atau Salah', color:'#E86A92', icon:'check',
  desc:'Adakah bunyi itu sepadan dengan ayat?',
  arahan:'Aktiviti betul atau salah. Dengar bunyi, kemudian tekan betul jika ayat itu betul, atau salah jika ayat itu salah.'},
 {key:'urutan',    no:6, nama:'Menyusun Urutan', color:'#2EC4B6', icon:'order',
  desc:'Susun gambar mengikut urutan bunyi.',
  arahan:'Aktiviti menyusun urutan. Dengar urutan bunyi dengan teliti, kemudian susun gambar mengikut urutan yang sama.'},
 {key:'puzzle',    no:7, nama:'Puzzle Gambar', color:'#FFC94D', icon:'puzzle',
  desc:'Susun 4 keping menjadi satu gambar.',
  arahan:'Aktiviti puzzle. Tekan dua keping gambar untuk menukar tempatnya. Susun semua keping sehingga menjadi satu gambar yang lengkap.'}
];

/* ---------- 5. KEMAJUAN (localStorage) ---------- */
function loadProg(){ try{ return JSON.parse(localStorage.getItem('duniaBunyiProg_v1'))||{}; }catch(e){ return {}; } }
function saveProg(){ try{ localStorage.setItem('duniaBunyiProg_v1', JSON.stringify(prog)); }catch(e){} }
let prog = loadProg();

/* ---------- 6. UTILITI ---------- */
const state = { level:null, act:null, actIndex:0 };
const LV = ()=>LEVELS[state.level];
const pick = a=>a[Math.floor(Math.random()*a.length)];
function shuffle(a){ a=a.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }
const sample = (a,n)=>shuffle(a).slice(0,n);
function el(html){ const t=document.createElement('template'); t.innerHTML=html.trim(); return t.content.firstElementChild; }

let toastT;
function toast(msg){ const t=document.getElementById('toast'); t.textContent=msg; t.classList.add('show'); clearTimeout(toastT); toastT=setTimeout(()=>t.classList.remove('show'),2400); }

const speechOK = ('speechSynthesis' in window) && ('SpeechSynthesisUtterance' in window);
function speak(text){
  if(!speechOK) return false;
  try{
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang='ms-MY'; u.rate=.95; u.pitch=1.05;
    const v = speechSynthesis.getVoices().find(v=>/^ms/i.test(v.lang));
    if(v) u.voice=v;
    speechSynthesis.speak(u);
    return true;
  }catch(e){ return false; }
}

function starSVG(on, small){ return `<svg viewBox="0 0 24 24" class="star ${on?'on':'off'} ${small?'sm':''}"><path d="M12 1.6l3.1 6.3 6.9 1-5 4.9 1.2 6.9-6.2-3.3-6.2 3.3 1.2-6.9-5-4.9 6.9-1z"/></svg>`; }

/* Main bunyi item + animasi butang & penyama gelombang */
function playItem(item, btn, eq){
  ac(); item.sound();
  const d = (item.dur||1)*1000;
  [btn,eq].forEach(e=>e&&e.classList.add('playing'));
  clearTimeout(item._t);
  item._t = setTimeout(()=>[btn,eq].forEach(e=>e&&e.classList.remove('playing')), d);
}

/* Konfeti (jalur, bulatan & segitiga pelbagai warna) */
function confetti(n){
  const colors=['#FF5D5D','#FF9642','#FFC94D','#4CB963','#2EC4B6','#4A90D9','#E86A92'];
  const layer=document.createElement('div'); layer.className='confetti-layer'; document.body.appendChild(layer);
  const H=innerHeight;
  for(let i=0;i<n;i++){
    const p=document.createElement('i'); const c=colors[i%colors.length];
    if(i%3===0) p.style.cssText=`width:${5+Math.random()*5}px;height:${10+Math.random()*10}px;background:${c};border-radius:3px;`;
    else if(i%3===1) p.style.cssText=`width:${7+Math.random()*5}px;height:${7+Math.random()*5}px;background:${c};border-radius:50%;`;
    else p.style.cssText=`width:0;height:0;border-left:7px solid transparent;border-right:7px solid transparent;border-bottom:12px solid ${c};`;
    p.style.left=(Math.random()*100)+'vw'; p.style.top='-30px';
    layer.appendChild(p);
    p.animate([
      {transform:'translateY(0) translateX(0) rotate(0deg)',opacity:1},
      {transform:`translateY(${H+120}px) translateX(${(Math.random()-.5)*180}px) rotate(${(Math.random()<.5?-1:1)*(360+Math.random()*720)}deg)`,opacity:.9}
    ],{duration:1900+Math.random()*2300, delay:Math.random()*500, easing:'cubic-bezier(.25,.5,.6,1)', fill:'forwards'});
  }
  setTimeout(()=>layer.remove(),5200);
}
/* Letusan kecil di lokasi elemen (maklum balas tepat) */
function burstAt(x,y,n){
  const colors=['#FF5D5D','#FF9642','#FFC94D','#4CB963','#2EC4B6','#4A90D9','#E86A92'];
  for(let i=0;i<n;i++){
    const p=document.createElement('i'); p.className='fx-dot';
    const s=6+Math.random()*7;
    p.style.cssText=`left:${x}px;top:${y}px;width:${s}px;height:${s}px;background:${colors[i%colors.length]};${i%2?'border-radius:50%;':''}`;
    document.body.appendChild(p);
    const ang=Math.random()*Math.PI*2, d=50+Math.random()*80;
    p.animate([
      {transform:'translate(-50%,-50%) scale(1)',opacity:1},
      {transform:`translate(calc(-50% + ${Math.cos(ang)*d}px),calc(-50% + ${Math.sin(ang)*d+46}px)) scale(.3) rotate(${Math.random()*360}deg)`,opacity:0}
    ],{duration:650+Math.random()*350, easing:'cubic-bezier(.2,.7,.4,1)', fill:'forwards'}).onfinish=()=>p.remove();
  }
}
function burstAtEl(elm,n){ const r=elm.getBoundingClientRect(); burstAt(r.left+r.width/2, r.top+r.height/2, n); }
function bigMark(ok){
  const m=el(`<div class="big-mark ${ok?'good':'bad'}">${ok?ICONS.check:ICONS.cross}</div>`);
  document.body.appendChild(m); setTimeout(()=>m.remove(),900);
}

/* ---------- 7. NAVIGASI & RENDER SKRIN ---------- */
function go(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo({top:0,behavior:'smooth'});
}
function setProgress(i,total,color){
  const p=document.getElementById('actProgress'); p.innerHTML='';
  for(let k=0;k<total;k++){
    const s=document.createElement('span');
    if(k<i) s.className='done';
    else if(k===i){ s.className='cur'; s.style.background=color; }
    p.appendChild(s);
  }
}
function actShell(bubble){
  const a=document.getElementById('activityArea');
  a.innerHTML='';
  a.appendChild(el(`<div class="prompt-bubble">${bubble}</div>`));
  return a;
}
function soundStage(label){
  return el(`<div class="listen-stage"><div class="sound-col"><button class="btn-sound" data-noblip>${ICONS.speaker}</button>${label?`<span class="sound-label">${label}</span>`:''}</div><div class="eq"><i></i><i></i><i></i><i></i><i></i></div></div>`);
}

function renderLevels(){
  const g=document.getElementById('levelGrid'); g.innerHTML='';
  Object.values(LEVELS).forEach(lv=>{
    const got=Object.values(prog[lv.key]||{}).reduce((s,r)=>s+(r.stars||0),0);
    const card=el(`<button class="level-card" style="--lc:${lv.color}">
      <span class="lv-badge">${[1,2,3].map(i=>starSVG(i<=lv.bintang)).join('')}</span>
      <h3>${lv.nama}</h3>
      <p class="lv-tag">${lv.tag}</p>
      <p class="lv-prog">${got?`Bintang diperoleh: ${got} / 21`:'Belum bermula'}</p>
      <span class="lv-cta">Pilih aras ini →</span>
    </button>`);
    card.onclick=()=>{ state.level=lv.key; sfx.pop(); renderMenu(); go('screen-menu'); };
    g.appendChild(card);
  });
}
function renderMenu(){
  const lv=LEVELS[state.level];
  const chip=document.getElementById('menuLevelChip');
  chip.textContent=lv.nama; chip.style.background=lv.color;
  const recs=prog[state.level]||{};
  const done=ACTS.filter(a=>recs[a.key]).length;
  document.getElementById('menuProgress').textContent=`${done} / 7 aktiviti selesai`;
  const g=document.getElementById('actGrid'); g.innerHTML='';
  ACTS.forEach(a=>{
    const rec=recs[a.key];
    const card=el(`<button class="act-card" style="--ac:${a.color}">
      <span class="act-badge">${a.no}</span>
      ${rec?`<span class="done-tick">${ICONS.check}</span>`:''}
      <span class="act-ico">${ICONS[a.icon]}</span>
      <span class="act-name">${a.nama}</span>
      <span class="act-desc">${a.desc}</span>
      <span class="act-stars">${[1,2,3].map(i=>starSVG(i<=(rec?rec.stars:0),true)).join('')}</span>
    </button>`);
    card.onclick=()=>{ sfx.pop(); openActivity(a.key); };
    g.appendChild(card);
  });
}
function openActivity(key){
  const a=ACTS.find(x=>x.key===key);
  state.act=a; state.actIndex=ACTS.indexOf(a);
  document.getElementById('actNo').textContent=a.no;
  document.getElementById('actNo').style.background=a.color;
  document.getElementById('actTitle').textContent=a.nama;
  document.getElementById('actProgress').innerHTML='';
  const vb=document.getElementById('btnVoice');
  vb.style.display = speechOK ? 'inline-flex' : 'none';
  vb.onclick=()=>{ speak(a.arahan) ? toast('Arahan sedang dibacakan...') : toast('Perakam suara tidak tersedia.'); };
  go('screen-activity');
  RUN[key]();
}

/* ---------- 8. TUJUH AKTIVITI ---------- */

/* 1 · MENGECAM BUNYI */
function runMengecam(){
  const cfg=LV().cfg, pool=LV().pool;
  const qs=sample(pool,cfg.soal);
  let idx=0, score=0, lock=false, autoT=0;
  const A=actShell('Dengar bunyi dengan teliti, kemudian tekan gambar yang <b>sepadan</b> dengan bunyi itu.');
  const stage=soundStage('Dengar'); A.appendChild(stage);
  const btn=stage.querySelector('.btn-sound'), eq=stage.querySelector('.eq');
  const grid=el('<div class="choice-grid"></div>'); A.appendChild(grid);
  btn.onclick=()=>playItem(qs[idx],btn,eq);
  (function render(){
    setProgress(idx,qs.length,state.act.color);
    clearTimeout(autoT);
    const item=qs[idx];
    autoT=setTimeout(()=>playItem(item,btn,eq),650);
    grid.innerHTML='';
    const opts=shuffle([item, ...sample(pool.filter(p=>p.id!==item.id), cfg.choices-1)]);
    opts.forEach(o=>{
      const c=el(`<button class="choice-card">${svgOf(o)}${cfg.showName?`<span class="choice-name">${o.name}</span>`:''}</button>`);
      c.onclick=()=>{
        if(lock) return;
        if(o.id===item.id){
          lock=true; c.classList.add('correct'); sfx.correct(); burstAtEl(c,18); score++;
          setTimeout(()=>{ idx++; lock=false; idx>=qs.length ? finishActivity(score,qs.length,'betul') : render(); },1150);
        }else{
          c.classList.remove('wrong'); void c.offsetWidth; c.classList.add('wrong'); sfx.wrong();
        }
      };
      grid.appendChild(c);
    });
  })();
}

/* 2 · PADANAN BUNYI */
function runPadanan(){
  const cfg=LV().cfg, pool=LV().pool;
  const pairs=sample(pool,cfg.padanan);
  let selPic=null, selSnd=null, done=0, wrong=0, lock=false;
  const A=actShell('Tekan kad <b>bunyi</b> untuk mendengarnya, kemudian padankan dengan <b>gambar</b> yang betul!');
  A.appendChild(el('<div class="match-legend"><span class="leg pic">Gambar</span><span class="leg snd">Bunyi</span></div>'));
  const wrap=el('<div class="match-wrap"></div>'); A.appendChild(wrap);
  const colP=el('<div class="match-col"></div>'), colS=el('<div class="match-col"></div>');
  wrap.append(colP,colS);
  setProgress(0,pairs.length,state.act.color);
  shuffle(pairs.slice()).forEach(it=>{
    const c=el(`<button class="match-card pic">${svgOf(it)}<span class="mc-name">${it.name}</span></button>`);
    c.onclick=()=>{
      if(lock||c.classList.contains('locked')) return;
      colP.querySelectorAll('.selected').forEach(x=>x.classList.remove('selected'));
      c.classList.add('selected'); selPic=it; check();
    };
    colP.appendChild(c);
  });
  shuffle(pairs.slice()).forEach(it=>{
    const c=el(`<button class="match-card snd" data-noblip>
      <span class="mc-ico" style="color:${it.color}">${ICONS.speaker}</span>
      <span class="mini-eq"><i></i><i></i><i></i></span>
      <span class="mc-name hidden">${it.name}</span></button>`);
    c.onclick=()=>{
      playItem(it,c,null);
      if(lock||c.classList.contains('locked')) return;
      colS.querySelectorAll('.selected').forEach(x=>x.classList.remove('selected'));
      c.classList.add('selected'); selSnd=it; check();
    };
    colS.appendChild(c);
  });
  function check(){
    if(!(selPic&&selSnd)) return;
    lock=true;
    const pc=[...colP.children].find(x=>x.classList.contains('selected'));
    const sc=[...colS.children].find(x=>x.classList.contains('selected'));
    if(selPic.id===selSnd.id){
      setTimeout(()=>{
        pc.classList.remove('selected'); sc.classList.remove('selected');
        pc.classList.add('locked'); sc.classList.add('locked');
        sc.querySelector('.mc-name').classList.remove('hidden');
        sc.style.setProperty('--mc', selPic.color);
        sfx.correct(); burstAtEl(pc,14);
        done++; setProgress(done,pairs.length,state.act.color);
        selPic=selSnd=null; lock=false;
        if(done===pairs.length) setTimeout(()=>finishActivity(pairs,pairs+wrong,'padanan tepat'),900);
      },650);
    }else{
      setTimeout(()=>{
        [pc,sc].forEach(x=>{ x.classList.remove('wrong'); void x.offsetWidth; x.classList.add('wrong'); });
        sfx.wrong(); wrong++;
        pc.classList.remove('selected'); sc.classList.remove('selected');
        selPic=selSnd=null; lock=false;
      },500);
    }
  }
}

/* 3 · TARIK DAN LETAK (seret ATAU tekan-tekan — mesra sentuhan) */
function runDragdrop(){
  const cfg=LV().cfg, pool=LV().pool;
  const items=sample(pool,cfg.drag);
  let mistakes=0, placed=0, selChip=null;
  const A=actShell('Tarik perkataan ke kotak di bawah gambar yang betul. Tekan gambar untuk mendengar bunyinya! <span class="hint">Boleh juga tekan perkataan dahulu, kemudian tekan kotaknya.</span>');
  const slotsEl=el('<div class="dd-slots"></div>'); A.appendChild(slotsEl);
  const tray=el('<div class="dd-tray"></div>'); A.appendChild(tray);
  setProgress(0,items.length,state.act.color);
  shuffle(items.slice()).forEach(it=>{
    const s=el(`<div class="dd-slot" data-id="${it.id}">
      <button class="dd-pic" data-noblip title="Dengar bunyi">${svgOf(it)}</button>
      <div class="dd-drop"><span>Letak di sini</span></div></div>`);
    const pic=s.querySelector('.dd-pic');
    pic.onclick=()=>playItem(it,pic,null);
    s.querySelector('.dd-drop').addEventListener('click',()=>{
      if(selChip && !s.classList.contains('filled')){ const c=selChip; clearSel(); place(c,s); }
    });
    slotsEl.appendChild(s);
  });
  function clearSel(){ document.querySelectorAll('.dd-chip.selected').forEach(x=>x.classList.remove('selected')); selChip=null; }
  function slotFromPoint(x,y){ const t=document.elementFromPoint(x,y); return t?t.closest('.dd-slot'):null; }
  function place(chip,slot){
    const it=byId[chip.dataset.id];
    if(chip.dataset.id===slot.dataset.id){
      chip.classList.add('placed'); chip.classList.remove('selected');
      const drop=slot.querySelector('.dd-drop');
      drop.innerHTML=''; drop.appendChild(chip);
      slot.classList.add('filled'); drop.classList.add('filled');
      sfx.correct(); burstAtEl(drop,14);
      placed++; setProgress(placed,items.length,state.act.color);
      setTimeout(()=>playItem(it,slot.querySelector('.dd-pic'),null),400);
      if(placed===items.length) setTimeout(()=>finishActivity(items.length,items.length+mistakes,'padanan betul'),1100);
    }else{
      sfx.wrong(); mistakes++;
      slot.classList.remove('shake-x'); void slot.offsetWidth; slot.classList.add('shake-x');
      setTimeout(()=>slot.classList.remove('shake-x'),520);
    }
  }
  shuffle(items.slice()).forEach(it=>{
    const chip=el(`<button class="dd-chip" data-id="${it.id}">${it.name}</button>`);
    let ds=null;
    chip.addEventListener('pointerdown',e=>{
      if(chip.classList.contains('placed')) return;
      e.preventDefault(); ac();
      ds={x:e.clientX,y:e.clientY,moved:false};
      try{ chip.setPointerCapture(e.pointerId); }catch(_){}
    });
    chip.addEventListener('pointermove',e=>{
      if(!ds) return;
      if(!ds.moved && Math.hypot(e.clientX-ds.x,e.clientY-ds.y)>8){
        ds.moved=true; chip.classList.add('dragging'); clearSel();
      }
      if(ds.moved){
        chip.style.left=e.clientX+'px'; chip.style.top=e.clientY+'px';
        document.querySelectorAll('.dd-slot.over').forEach(x=>x.classList.remove('over'));
        const s=slotFromPoint(e.clientX,e.clientY);
        if(s && !s.classList.contains('filled')) s.classList.add('over');
      }
    });
    chip.addEventListener('pointerup',e=>{
      if(!ds) return;
      const moved=ds.moved; ds=null;
      chip.classList.remove('dragging'); chip.style.left=chip.style.top='';
      document.querySelectorAll('.dd-slot.over').forEach(x=>x.classList.remove('over'));
      if(moved){
        const s=slotFromPoint(e.clientX,e.clientY);
        if(s && !s.classList.contains('filled')) place(chip,s);
      }else{
        clearSel(); chip.classList.add('selected'); selChip=chip;
      }
    });
    chip.addEventListener('pointercancel',()=>{
      if(ds){ ds=null; chip.classList.remove('dragging'); chip.style.left=chip.style.top=''; }
    });
    tray.appendChild(chip);
  });
}

/* 4 · MEMORI BUNYI (kad bunyi memainkan bunyi apabila dibalikkan) */
function runMemori(){
  const cfg=LV().cfg, pool=LV().pool;
  const items=sample(pool,cfg.mem);
  const cols=cfg.mem<=3?3:4;
  let open1=null, lock=false, attempts=0, matched=0;
  const A=actShell('Buka kad untuk <b>mendengar bunyi</b> atau melihat <b>gambar</b>. Cari pasangan bunyi dan gambar yang sama!');
  const grid=el(`<div class="mem-grid" style="--cols:${cols}"></div>`); A.appendChild(grid);
  setProgress(0,items.length,state.act.color);
  function mk(it,type){
    const back = type==='pic' ? svgOf(it) : `<span class="snd-face" style="color:${it.color}">${ICONS.speaker}<b>BUNYI</b></span>`;
    const c=el(`<button class="mem-card ${type}" data-id="${it.id}" data-noblip>
      <div class="mem-inner">
        <div class="mem-face front"><b>?</b></div>
        <div class="mem-face back">${back}</div>
      </div></button>`);
    c.onclick=()=>{
      if(lock||c.classList.contains('matched')||c===open1) return;
      c.classList.add('open'); sfx.flip();
      if(type==='snd') setTimeout(()=>{ ac(); it.sound(); },300);
      if(!open1){ open1=c; return; }
      const a=open1, b=c; open1=null; attempts++; lock=true;
      if(a.dataset.id===b.dataset.id){
        setTimeout(()=>{
          a.classList.add('matched'); b.classList.add('matched');
          sfx.correct(); burstAtEl(b,12);
          matched++; setProgress(matched,items.length,state.act.color);
          lock=false;
          if(matched===items.length) setTimeout(()=>finishActivity(items.length,Math.max(attempts,items.length),'padanan tepat'),900);
        },500);
      }else{
        setTimeout(()=>sfx.wrong(),200);
        setTimeout(()=>{ a.classList.remove('open'); b.classList.remove('open'); lock=false; },1000);
      }
    };
    return c;
  }
  const cards=[]; items.forEach(it=>{ cards.push(mk(it,'pic')); cards.push(mk(it,'snd')); });
  shuffle(cards).forEach(c=>grid.appendChild(c));
}

/* 5 · BETUL ATAU SALAH */
function runBetulSalah(){
  const cfg=LV().cfg, pool=LV().pool;
  const base=sample(pool,cfg.tf);
  const flags=shuffle(base.map((_,i)=>i<Math.ceil(base.length/2)));
  const qs=base.map((it,i)=>{
    let show=it;
    if(!flags[i]) show=pick(pool.filter(p=>p.id!==it.id));
    return {snd:it, show, truth:flags[i]};
  });
  let idx=0, score=0, lock=false, autoT=0;
  const A=actShell('Dengar bunyi, kemudian tekan <b>BETUL</b> jika ayat itu betul atau <b>SALAH</b> jika ia salah.');
  const stage=soundStage('Dengar'); A.appendChild(stage);
  const btn=stage.querySelector('.btn-sound'), eq=stage.querySelector('.eq');
  const card=el(`<div class="tf-card"><div class="tf-pic"></div><p class="tf-sent">Bunyi ini ialah <b class="tf-name">—</b>.</p></div>`);
  A.appendChild(card);
  const acts=el(`<div class="tf-actions">
    <button class="tf-btn yes">${ICONS.check}<span>BETUL</span></button>
    <button class="tf-btn no">${ICONS.cross}<span>SALAH</span></button></div>`);
  A.appendChild(acts);
  btn.onclick=()=>playItem(qs[idx].snd,btn,eq);
  function render(){
    setProgress(idx,qs.length,state.act.color);
    const q=qs[idx]; clearTimeout(autoT);
    card.querySelector('.tf-pic').innerHTML=svgOf(q.show);
    card.querySelector('.tf-name').textContent=q.show.name.toUpperCase();
    card.classList.remove('good','bad');
    autoT=setTimeout(()=>playItem(q.snd,btn,eq),650);
  }
  function ans(saidYes){
    if(lock) return; lock=true;
    const q=qs[idx];
    const ok=(saidYes===q.truth);
    if(ok){ score++; sfx.correct(); bigMark(true); card.classList.add('good'); }
    else{ sfx.wrong(); bigMark(false); card.classList.add('bad'); toast(`Bunyi itu sebenarnya ialah ${q.snd.name}.`); }
    setTimeout(()=>{ idx++; lock=false; idx>=qs.length ? finishActivity(score,qs.length,'jawapan tepat') : render(); },1900);
  }
  acts.querySelector('.yes').onclick=()=>ans(true);
  acts.querySelector('.no').onclick=()=>ans(false);
  render();
}

/* 6 · MENYUSUN URUTAN */
function runUrutan(){
  const cfg=LV().cfg, pool=LV().pool;
  const seq=sample(pool,cfg.seq);
  let filled=0, attempts=0, playing=false;
  const A=actShell('Dengar <b>urutan bunyi</b> dengan teliti, kemudian susun gambar mengikut urutan yang sama. Tekan gambar dalam kotak untuk mengeluarkannya semula.');
  const stage=soundStage('Main Urutan'); A.appendChild(stage);
  const btn=stage.querySelector('.btn-sound'), eq=stage.querySelector('.eq');
  const live=el(`<div class="seq-live"><b>—</b><span>Bunyi</span></div>`); A.appendChild(live);
  const slots=el(`<div class="seq-slots" style="--k:${cfg.seq}"></div>`); A.appendChild(slots);
  const poolEl=el('<div class="seq-pool"></div>'); A.appendChild(poolEl);
  const btnCheck=el(`<button class="btn btn-primary btn-check" disabled>Semak Jawapan</button>`); A.appendChild(btnCheck);
  setProgress(0,cfg.seq,state.act.color);
  const fills=[];
  for(let i=0;i<cfg.seq;i++){
    const s=el(`<button class="seq-slot" data-noblip><span class="slot-no">${i+1}</span><span class="slot-fill"></span></button>`);
    s.onclick=()=>{
      const f=s.querySelector('.slot-fill');
      if(f.dataset.id){
        const tile=poolEl.querySelector(`.seq-tile[data-id="${f.dataset.id}"]`);
        if(tile) tile.classList.remove('used');
        f.innerHTML=''; delete f.dataset.id; filled--;
        btnCheck.disabled=true; setProgress(filled,cfg.seq,state.act.color);
      }
    };
    slots.appendChild(s); fills.push(s);
  }
  shuffle(seq.slice()).forEach(it=>{
    const t=el(`<button class="seq-tile" data-id="${it.id}" data-noblip>${svgOf(it)}${cfg.showName?`<span class="tile-name">${it.name}</span>`:''}</button>`);
    t.onclick=()=>{
      if(t.classList.contains('used')) return;
      const s=fills.find(x=>!x.querySelector('.slot-fill').dataset.id);
      if(!s) return;
      t.classList.add('used'); sfx.pop();
      const f=s.querySelector('.slot-fill'); f.dataset.id=it.id;
      f.innerHTML=`<span class="slot-pop">${svgOf(it)}</span>`;
      filled++; setProgress(filled,cfg.seq,state.act.color);
      btnCheck.disabled = filled<cfg.seq;
    };
    poolEl.appendChild(t);
  });
  btn.onclick=()=>{
    if(playing) return; playing=true;
    let t=400;
    seq.forEach((it,i)=>{
      setTimeout(()=>{
        live.querySelector('b').textContent=i+1;
        live.classList.remove('pop'); void live.offsetWidth; live.classList.add('pop');
        ac(); it.sound();
      },t);
      t+=(it.dur+.65)*1000;
    });
    setTimeout(()=>{ playing=false; }, t+200);
  };
  setTimeout(()=>btn.onclick(),800); /* main sekali secara automatik */
  btnCheck.onclick=()=>{
    if(playing) return;
    const ok=fills.every((s,i)=>s.querySelector('.slot-fill').dataset.id===seq[i].id);
    attempts++;
    if(ok){
      playing=true; sfx.correct();
      fills.forEach((s,i)=>setTimeout(()=>{
        s.classList.add('good');
        const p=s.querySelector('.slot-pop'); if(p) p.classList.add('jump');
        ac(); seq[i].sound();
      }, i*700));
      setTimeout(()=>finishActivity(Math.max(1,cfg.seq-(attempts-1)),cfg.seq,'markah'), cfg.seq*700+1200);
    }else{
      sfx.wrong();
      slots.classList.remove('shake-x'); void slots.offsetWidth; slots.classList.add('shake-x');
      toast('Urutan belum betul. Dengar semula dan cuba lagi!');
    }
  };
}

/* 7 · PUZZLE 4 KEPING */
function runPuzzle(){
  const cfg=LV().cfg, pool=LV().pool;
  const puzzles=sample(pool,cfg.puzzle);
  let pIdx=0, swaps=0, peeks=0;
  const A=actShell('Tekan <b>dua keping</b> untuk menukar tempatnya. Susun semua keping sehingga menjadi satu gambar yang lengkap!');
  const head=el(`<div class="pz-head"><span class="pz-count">Puzzle 1 / ${cfg.puzzle}</span><button class="btn btn-ghost btn-peek" data-noblip>Pandang Gambar</button></div>`);
  A.appendChild(head);
  const board=el('<div class="pz-board"></div>'); A.appendChild(board);
  const countEl=head.querySelector('.pz-count'), peekBtn=head.querySelector('.btn-peek');
  let slotOf=[], pieces=[], sel=null, done=false;
  setProgress(0,cfg.puzzle,state.act.color);
  peekBtn.onclick=()=>{
    if(done) return; peeks++;
    const it=puzzles[pIdx];
    const peek=el(`<div class="pz-peek">${svgOf(it)}<b>${it.name}</b></div>`);
    board.appendChild(peek);
    setTimeout(()=>peek.remove(),2400);
  };
  function setPos(pc){ const s=slotOf[+pc.dataset.p]; pc.style.setProperty('--x', s%2); pc.style.setProperty('--y', Math.floor(s/2)); }
  function setup(){
    done=false; countEl.textContent=`Puzzle ${pIdx+1} / ${cfg.puzzle}`;
    board.classList.remove('done'); board.innerHTML='';
    setProgress(pIdx,cfg.puzzle,state.act.color);
    let ord; do{ ord=shuffle([0,1,2,3]); }while(ord.every((v,i)=>v===i));
    slotOf=ord.slice(); pieces=[]; sel=null;
    if(cfg.puzzleNum){
      for(let i=0;i<4;i++){
        board.appendChild(el(`<span class="pz-hintno" style="--x:${i%2};--y:${Math.floor(i/2)}">${i+1}</span>`));
      }
    }
    for(let p=0;p<4;p++){
      const x0=(p%2)*60, y0=Math.floor(p/2)*60;
      const piece=el(`<button class="pz-piece" data-noblip data-p="${p}" style="--x:${slotOf[p]%2};--y:${Math.floor(slotOf[p]/2)}">
        ${svgOf(puzzles[pIdx],`${x0} ${y0} 60 60`)}
        ${cfg.puzzleNum?`<span class="pz-num">${p+1}</span>`:''}</button>`);
      piece.onclick=()=>{
        if(done) return;
        if(sel===null){ sel=piece; piece.classList.add('lift'); sfx.blip(); }
        else if(sel===piece){ piece.classList.remove('lift'); sel=null; }
        else{
          const a=sel, b=piece; sel=null; a.classList.remove('lift');
          const sa=slotOf[+a.dataset.p], sb=slotOf[+b.dataset.p];
          slotOf[+a.dataset.p]=sb; slotOf[+b.dataset.p]=sa;
          setPos(a); setPos(b); swaps++; sfx.snap();
          setTimeout(check,420);
        }
      };
      board.appendChild(piece); pieces.push(piece);
    }
  }
  function check(){
    if(!pieces.every(pc=>slotOf[+pc.dataset.p]===+pc.dataset.p)) return;
    done=true;
    board.classList.add('done');
    pieces.forEach(p=>p.classList.add('done'));
    const it=puzzles[pIdx];
    setTimeout(()=>{
      sfx.win(); confetti(50); ac(); it.sound();
      board.appendChild(el(`<div class="pz-complete"><b>${it.name}</b><span>Tahniah! Dengar bunyinya!</span></div>`));
    },600);
    setTimeout(()=>{
      pIdx++;
      if(pIdx>=puzzles.length){
        const per=swaps/puzzles.length;
        const st=(peeks===0&&per<=3.2)?3:(peeks<=2&&per<=5.5)?2:1;
        finishActivity(st,3,'bintang');
      } else setup();
    },2600);
  }
  setup();
}

const RUN = { mengecam:runMengecam, padanan:runPadanan, dragdrop:runDragdrop,
              memori:runMemori, betulsalah:runBetulSalah, urutan:runUrutan, puzzle:runPuzzle };

/* ---------- 9. TAMAT AKTIVITI, MODAL & SIJIL ---------- */
function showModal(node){
  const box=document.getElementById('modalBox');
  box.innerHTML=''; box.appendChild(node);
  document.getElementById('overlay').classList.add('show');
}
function hideModal(){ document.getElementById('overlay').classList.remove('show'); }

function finishActivity(correct,total,label){
  const pct=total>0?correct/total:1;
  const st=pct>=.9?3:pct>=.55?2:1;
  const lv=prog[state.level]||(prog[state.level]={});
  const old=lv[state.act.key];
  if(!old||old.stars<st) lv[state.act.key]={stars:st,best:Math.round(pct*100)};
  saveProg();
  sfx.win(); confetti(50+st*25);
  const msgs={3:['Cemerlang!','Hebat sekali!','Terbaik!'],2:['Bagus!','Hampir sempurna!','Teruskan usaha!'],1:['Cuba lagi, anda pasti boleh!','Jangan berputus asa!','Latihan menjadikan hebat!']};
  const next=ACTS[state.actIndex+1];
  const allDone=ACTS.every(a=>prog[state.level][a.key]);
  const m=el(`<div>
    <div class="m-stars">${[1,2,3].map(i=>`<span class="mstar" style="--i:${i}">${starSVG(i<=st)}</span>`).join('')}</div>
    <h3 class="m-title">${pick(msgs[st])}</h3>
    <p class="m-score">${correct} / ${total} <span>${label}</span></p>
    ${allDone?`<p class="m-alldone">${ICONS.trophy} Semua 7 aktiviti aras ini telah selesai!</p>`:''}
    <div class="m-btns">
      <button class="btn" data-m="again">Main Lagi</button>
      ${next?`<button class="btn btn-primary" data-m="next">Aktiviti Seterusnya</button>`:''}
      ${allDone?`<button class="btn btn-primary" data-m="cert">Lihat Sijil</button>`:''}
      <button class="btn" data-m="menu">Menu Aktiviti</button>
    </div></div>`);
  m.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>{
    const k=b.dataset.m; hideModal();
    if(k==='again') RUN[state.act.key]();
    else if(k==='next') openActivity(next.key);
    else if(k==='cert') showCert();
    else{ renderMenu(); go('screen-menu'); }
  });
  setTimeout(()=>showModal(m),350);
}

function showCert(){
  const lv=LEVELS[state.level];
  const got=ACTS.reduce((s,a)=>s+((prog[state.level][a.key]||{}).stars||0),0);
  const c=el(`<div class="cert">
    <div class="cert-frame">
      <span class="badge">Sijil Pencapaian</span>
      <div class="cert-trophy">${ICONS.trophy}</div>
      <h2>Tahniah!</h2>
      <p>Anda telah melengkapkan kesemua <b>7 aktiviti</b><br>pada aras <b>${lv.nama}</b>.</p>
      <div class="cert-stars">${got} <small>/ 21 bintang</small></div>
      <div class="cert-note">Dunia Bunyi · Standard Kandungan 3.1.2<br>Mengecam Bunyi yang Didengar</div>
    </div>
    <div class="m-btns">
      <button class="btn btn-primary" data-c="level">Pilih Aras Lain</button>
      <button class="btn" data-c="menu">Menu Aktiviti</button>
    </div></div>`);
  c.querySelectorAll('[data-c]').forEach(b=>b.onclick=()=>{
    hideModal();
    if(b.dataset.c==='level'){ renderLevels(); go('screen-level'); }
    else{ renderMenu(); go('screen-menu'); }
  });
  sfx.win(); confetti(120);
  showModal(c);
}

/* ---------- 10. DEKORASI & INIT ---------- */
function decorSVG(t,c){
  if(t==='note') return `<svg viewBox="0 0 24 24"><g fill="${c}" stroke="#3A2E39" stroke-width="1.4"><ellipse cx="7" cy="18" rx="4.6" ry="3.5" transform="rotate(-18 7 18)"/><rect x="10.4" y="3.5" width="2.6" height="14.5" rx="1.3"/><path d="M13 4.5q5.5 1 6.5 6" fill="none" stroke-width="1.8"/></g></svg>`;
  if(t==='note2') return `<svg viewBox="0 0 24 24"><g fill="${c}" stroke="#3A2E39" stroke-width="1.4"><ellipse cx="5.5" cy="19" rx="4" ry="3" transform="rotate(-18 5.5 19)"/><ellipse cx="16.5" cy="18" rx="4" ry="3" transform="rotate(-18 16.5 18)"/><rect x="8.6" y="4" width="2.4" height="15" rx="1.2"/><rect x="18.2" y="3" width="2.4" height="15" rx="1.2"/><path d="M8.6 4.4l12-1.6v3.2l-12 1.6z"/></g></svg>`;
  return `<svg viewBox="0 0 24 24"><path d="M2.5 12q3-6.5 6 0t6 0 6 0" fill="none" stroke="${c}" stroke-width="2.8" stroke-linecap="round"/></svg>`;
}
function buildDecor(){
  const wrap=document.getElementById('floatDecor');
  [
    {x:3,y:18,t:'note',c:'#FF9642',s:38,r:-10,d:7},{x:88,y:10,t:'wave',c:'#2EC4B6',s:44,r:6,d:8},
    {x:6,y:62,t:'wave',c:'#E86A92',s:34,r:-6,d:6.5},{x:92,y:55,t:'note2',c:'#4CB963',s:40,r:8,d:7.5},
    {x:45,y:6,t:'note',c:'#4A90D9',s:26,r:12,d:6},{x:80,y:84,t:'wave',c:'#FFC94D',s:30,r:-8,d:9},
    {x:12,y:88,t:'note2',c:'#FF5D5D',s:30,r:6,d:8.5},{x:55,y:90,t:'note',c:'#2EC4B6',s:24,r:-12,d:7}
  ].forEach((f,i)=>{
    const d=el(`<span class="fl" style="left:${f.x}%;top:${f.y}%;--r:${f.r}deg;--d:${f.d}s;--dl:${-i*.9}s">${decorSVG(f.t,f.c)}</span>`);
    d.style.width=f.s+'px';
    wrap.appendChild(d);
  });
}

function init(){
  buildDecor();
  renderLevels();
  document.getElementById('btnStart').onclick=()=>{ sfx.pop(); go('screen-level'); };
  document.getElementById('btnBackLevel').onclick=()=>{ renderLevels(); go('screen-level'); };
  document.getElementById('btnActBack').onclick=()=>{ renderMenu(); go('screen-menu'); };
  document.getElementById('btnReset').onclick=()=>{
    if(state.level){ delete prog[state.level]; saveProg(); renderMenu(); toast('Skor aras ini telah dikosongkan.'); sfx.pop(); }
  };
  /* Pemain Bunyi Misteri pada skrin pertama */
  const btnM=document.getElementById('btnMystery'), eqM=document.getElementById('mysteryEq'), rev=document.getElementById('mysteryReveal');
  let lastM=-1;
  btnM.onclick=()=>{
    let i; do{ i=Math.floor(Math.random()*ITEMS.length); }while(i===lastM&&ITEMS.length>1);
    lastM=i; const it=ITEMS[i];
    rev.innerHTML='<span class="reveal-q">?</span>';
    playItem(it,btnM,eqM);
    setTimeout(()=>{ rev.innerHTML=`<span class="reveal-card">${svgOf(it)}<b>${it.name}</b></span>`; },600);
  };
  /* Buka kunci audio pada sentuhan pertama */
  document.addEventListener('pointerdown',()=>ac(),{passive:true});
  /* Bunyi klik lembut untuk semua butang (maklum balas auditori) */
  document.addEventListener('click',e=>{
    const b=e.target.closest('button');
    if(b && !b.dataset.noblip) sfx.blip();
  });
}
init();
