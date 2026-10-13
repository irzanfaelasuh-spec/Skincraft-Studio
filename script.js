(()=>{'use strict';
const CFG={creator:'RAILWAYOP',version:'0.1.0'};
const LANGS={en:'English',id:'Bahasa Indonesia',es:'Español',ar:'العربية',ja:'日本語'};
const K='load,ready,start,motion,lang,langSub,nameT,nameH,next,back,errName,pencil,eraser,fill,pick,line,rect,undo,redo,imp,exp,grid,uv,outer,saved,saving,unsaved,failed,badFile,newSkin,confirm,hint'.split(',');
const D={
en:'Loading|Ready to create?|Start|Motion settings|Choose Your Language|Select the language you want to use throughout the application.|Enter Your Display Name|Use a nickname, not your real name. 3–20 letters, numbers or _|Continue|Back|Name must be 3–20 letters, numbers or underscores|Pencil|Eraser|Fill|Pick|Line|Rect|Undo|Redo|Import|Export|Grid|UV|Outer layer|Saved|Saving…|Unsaved|Save failed|Invalid skin: use a 64×64 or 64×32 PNG|New|Discard the current skin?|Draw on the 2D texture; drag the 3D model to rotate.',
id:'Memuat|Mulai?|Mulai|Pengaturan gerak|Pilih Bahasamu|Pilih bahasa yang ingin kamu gunakan di seluruh aplikasi.|Masukkan nama tampilanmu|Gunakan nama panggilan, bukan nama asli. 3–20 huruf, angka, atau _|Lanjut|Kembali|Nama harus 3–20 huruf, angka, atau garis bawah|Pensil|Penghapus|Isi|Ambil|Garis|Kotak|Urungkan|Ulangi|Impor|Ekspor|Grid|UV|Lapisan luar|Tersimpan|Menyimpan…|Belum disimpan|Gagal menyimpan|Skin tidak valid: gunakan PNG 64×64 atau 64×32|Baru|Buang skin saat ini?|Gambar di tekstur 2D; geser model 3D untuk memutar.',
es:'Cargando|¿Listo para crear?|Empezar|Ajustes de movimiento|Elige tu idioma|Selecciona el idioma que quieres usar en toda la aplicación.|Introduce tu nombre visible|Usa un apodo, no tu nombre real. 3–20 letras, números o _|Continuar|Atrás|El nombre debe tener 3–20 letras, números o guiones bajos|Lápiz|Borrador|Rellenar|Cuentagotas|Línea|Rect.|Deshacer|Rehacer|Importar|Exportar|Cuadrícula|UV|Capa externa|Guardado|Guardando…|Sin guardar|Error al guardar|Skin no válida: usa un PNG de 64×64 o 64×32|Nuevo|¿Descartar la skin actual?|Dibuja en la textura 2D; arrastra el modelo 3D para girarlo.',
ar:'جارٍ التحميل|هل أنت مستعد للإبداع؟|ابدأ|إعدادات الحركة|اختر لغتك|اختر اللغة التي تريد استخدامها في التطبيق بالكامل.|أدخل اسم العرض|استخدم لقبًا وليس اسمك الحقيقي. 3–20 حرفًا أو رقمًا أو _|متابعة|رجوع|يجب أن يتكون الاسم من 3–20 حرفًا أو رقمًا أو شرطة سفلية|قلم|ممحاة|تعبئة|التقاط|خط|مستطيل|تراجع|إعادة|استيراد|تصدير|شبكة|UV|الطبقة الخارجية|تم الحفظ|جارٍ الحفظ…|غير محفوظ|فشل الحفظ|سكن غير صالح: استخدم PNG بحجم 64×64 أو 64×32|جديد|تجاهل السكن الحالي؟|ارسم على الخامة ثنائية الأبعاد؛ اسحب النموذج لتدويره.',
ja:'読み込み中|作成を始めますか？|スタート|モーション設定|言語を選択|アプリ全体で使用する言語を選んでください。|表示名を入力|本名ではなくニックネームを。3〜20文字の英数字か _|続ける|戻る|名前は3〜20文字の英数字かアンダースコアにしてください|鉛筆|消しゴム|塗りつぶし|スポイト|線|四角|元に戻す|やり直す|読み込み|書き出し|グリッド|UV|外側レイヤー|保存済み|保存中…|未保存|保存失敗|無効なスキン：64×64か64×32のPNGを使用|新規|現在のスキンを破棄しますか？|2Dテクスチャに描画し、3Dモデルをドラッグして回転します。'};
for(const l in D)D[l]=D[l].split('|');
const $=s=>document.querySelector(s);
const S={get(k,d){try{const v=localStorage.getItem('msu.'+k);return v===null?d:v}catch{return d}},set(k,v){try{localStorage.setItem('msu.'+k,v);return true}catch{return false}}};
let lang=LANGS[S.get('lang')]?S.get('lang'):'en',model=S.get('model','classic'),color=/^#[0-9a-f]{6}$/i.test(S.get('color','')) ?S.get('color'):'#22d3ee';
let tool='pencil',size=1,saveSt='saved',Z=6;const flags={grid:true,uv:false,outer:true};
const t=k=>(D[lang]&&D[lang][K.indexOf(k)])||D.en[K.indexOf(k)]||k;

/* ---------- i18n ---------- */
function applyLang(){
  document.documentElement.lang=lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr';
  document.querySelectorAll('[data-i]').forEach(e=>{e.textContent=(e.dataset.g?e.dataset.g+' ':'')+t(e.dataset.i)});
  $('#ls').value=lang;$('#prev').textContent=t('ready');$('#msg').textContent=t('load')+'…';
  document.querySelectorAll('.lc').forEach(b=>b.classList.toggle('on',b.dataset.l===lang));showState();
}
function setLang(l){lang=l;S.set('lang',l);applyLang()}

/* ---------- save state ---------- */
let timer;
function showState(){const e=$('#state');e.textContent=t(saveSt);e.dataset.s=saveSt}
function dirty(){saveSt='unsaved';showState();clearTimeout(timer);timer=setTimeout(save,700)}
function save(){
  saveSt='saving';showState();
  try{if(!S.set('skin',skin.toDataURL('image/png')))throw 0;saveSt='saved'}catch{saveSt='failed';toast(t('failed'))}
  showState();
}
function toast(m){const e=$('#toast');e.textContent=m;e.hidden=false;clearTimeout(toast.t);toast.t=setTimeout(()=>e.hidden=true,3500)}

/* ---------- skin model & UV (Minecraft 64x64 layout) ---------- */
// [name,w,h,d,u,v,outerU,outerV,x,y,isArm]
const P=[['head',8,8,8,0,0,32,0,0,28],['body',8,12,4,16,16,16,32,0,18],['rarm',4,12,4,40,16,40,32,-6,18,1],['larm',4,12,4,32,48,48,48,6,18,1],['rleg',4,12,4,0,16,0,32,-2,6],['lleg',4,12,4,16,48,0,48,2,6]];
// face rects in Three.js BoxGeometry order: +x, -x, +y, -y, +z, -z
const faces=(w,h,d,u,v)=>[[u+d+w,v+d,d,h],[u,v+d,d,h],[u+d,v,w,d],[u+d+w,v,w,d],[u+d,v+d,w,h],[u+2*d+w,v+d,w,h]];
const skin=$('#skin'),cx=skin.getContext('2d',{willReadFrequently:true}),gx=$('#guide').getContext('2d');
cx.imageSmoothingEnabled=false;
function blank(){cx.clearRect(0,0,64,64);cx.fillStyle='#8a8f98';P.forEach(([,w,h,d,u,v])=>{cx.fillRect(u,v+d,2*d+2*w,h);cx.fillRect(u+d,v,2*w,d)})}
function drawGuide(){
  gx.clearRect(0,0,512,512);
  if(flags.grid){gx.strokeStyle='rgba(255,255,255,.16)';gx.lineWidth=1;gx.beginPath();for(let i=0;i<=64;i++){gx.moveTo(i*8+.5,0);gx.lineTo(i*8+.5,512);gx.moveTo(0,i*8+.5);gx.lineTo(512,i*8+.5)}gx.stroke()}
  if(flags.uv){gx.font='bold 14px system-ui';P.forEach(([n,w,h,d,u,v,ou,ov,,,arm])=>{
    if(arm&&model==='slim')w=3;
    gx.setLineDash([]);gx.strokeStyle='#22d3ee';gx.lineWidth=2;faces(w,h,d,u,v).forEach(f=>gx.strokeRect(f[0]*8,f[1]*8,f[2]*8,f[3]*8));
    gx.setLineDash([6,4]);gx.strokeStyle='#a78bfa';faces(w,h,d,ou,ov).forEach(f=>gx.strokeRect(f[0]*8,f[1]*8,f[2]*8,f[3]*8));
    gx.fillStyle='#fff';gx.fillText(n,(u+d)*8+4,(v+d)*8+16)});gx.setLineDash([])}
}

/* ---------- 3D viewport ---------- */
let R,scene,cam,tex,mat,grp,need=true,th=.6,ph=1.45,dist=80,has3d=false;
const V={F:[0,1.5708],B:[3.1416,1.5708],L:[1.5708,1.5708],R:[-1.5708,1.5708],T:[0,.05],D:[0,3.09]};
function init3d(){
  if(!window.THREE)throw new Error('three.js');
  const c=$('#gl');R=new THREE.WebGLRenderer({canvas:c,antialias:false,alpha:true});
  scene=new THREE.Scene();cam=new THREE.PerspectiveCamera(40,1,1,500);
  scene.add(new THREE.AmbientLight(0xffffff,.85));const dl=new THREE.DirectionalLight(0xffffff,.6);dl.position.set(20,40,30);scene.add(dl);
  tex=new THREE.CanvasTexture(skin);tex.magFilter=tex.minFilter=THREE.NearestFilter;tex.generateMipmaps=false;
  mat=new THREE.MeshLambertMaterial({map:tex,transparent:true,alphaTest:.02});
  has3d=true;build();
  let dn=false,lx=0,ly=0;
  c.onpointerdown=e=>{dn=true;lx=e.clientX;ly=e.clientY;c.setPointerCapture(e.pointerId)};
  c.onpointermove=e=>{if(!dn)return;th-=(e.clientX-lx)*.012;ph=Math.max(.05,Math.min(3.09,ph-(e.clientY-ly)*.012));lx=e.clientX;ly=e.clientY;need=true};
  c.onpointerup=c.onpointercancel=()=>dn=false;
  c.addEventListener('wheel',e=>{e.preventDefault();dist=Math.max(35,Math.min(150,dist+e.deltaY*.05));need=true},{passive:false});
  new ResizeObserver(()=>{const b=$('#view3d'),w=b.clientWidth,h=b.clientHeight;if(!w||!h)return;R.setPixelRatio(Math.min(devicePixelRatio||1,2));R.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix();need=true}).observe($('#view3d'));
  (function loop(){requestAnimationFrame(loop);if(document.hidden||!need)return;need=false;
    cam.position.set(dist*Math.sin(ph)*Math.sin(th),16+dist*Math.cos(ph),dist*Math.sin(ph)*Math.cos(th));cam.lookAt(0,16,0);R.render(scene,cam)})();
}
function build(){
  if(!has3d)return;
  if(grp){scene.remove(grp);grp.traverse(o=>o.geometry&&o.geometry.dispose())}
  grp=new THREE.Group();
  P.forEach(([,w,h,d,u,v,ou,ov,x,y,arm])=>{
    if(arm&&model==='slim'){w=3;x=x>0?5.5:-5.5}
    [[0,u,v],[.5,ou,ov]].forEach(([e,U,V2],i)=>{
      if(i&&!flags.outer)return;
      const g=new THREE.BoxGeometry(w+e,h+e,d+e),a=g.attributes.uv;
      faces(w,h,d,U,V2).forEach(([X,Y,W,H],f)=>{const u0=X/64,u1=(X+W)/64,v0=1-Y/64,v1=1-(Y+H)/64;
        a.setXY(f*4,u0,v0);a.setXY(f*4+1,u1,v0);a.setXY(f*4+2,u0,v1);a.setXY(f*4+3,u1,v1)});
      const me=new THREE.Mesh(g,mat);me.position.set(x,y,0);me.renderOrder=i;grp.add(me)});
  });
  scene.add(grp);need=true;
}

/* ---------- editor ---------- */
let U=[],Rd=[],drawing=false,last=null,start=null,base=null;
const snap=()=>cx.getImageData(0,0,64,64);
const sync=()=>{if(tex)tex.needsUpdate=true;need=true;dirty()};
const push=()=>{U.push(snap());if(U.length>60)U.shift();Rd=[]};
const restore=i=>{cx.putImageData(i,0,0);sync()};
const undo=()=>{if(U.length){Rd.push(snap());restore(U.pop())}};
const redo=()=>{if(Rd.length){U.push(snap());restore(Rd.pop())}};
const rgb=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
const hex=d=>'#'+[d[0],d[1],d[2]].map(v=>v.toString(16).padStart(2,'0')).join('');
function setColor(h){color=h;$('#col').value=h;S.set('color',h)}
const px=(x,y)=>{cx.fillStyle=color;cx.fillRect(x,y,size,size)};
const er=(x,y)=>cx.clearRect(x,y,size,size);
const dot=(x,y)=>tool==='eraser'?er(x,y):px(x,y);
function ln(a,b,f){let[x0,y0]=a;const[x1,y1]=b,dx=Math.abs(x1-x0),dy=-Math.abs(y1-y0),sx=x0<x1?1:-1,sy=y0<y1?1:-1;let e=dx+dy;
  for(;;){f(x0,y0);if(x0===x1&&y0===y1)break;const e2=2*e;if(e2>=dy){e+=dy;x0+=sx}if(e2<=dx){e+=dx;y0+=sy}}}
function shape(a,b){
  if(tool==='line')return ln(a,b,px);
  const x0=Math.min(a[0],b[0]),x1=Math.max(a[0],b[0]),y0=Math.min(a[1],b[1]),y1=Math.max(a[1],b[1]);
  if(tool==='frect'){cx.fillStyle=color;cx.fillRect(x0,y0,x1-x0+1,y1-y0+1)}
  else{ln([x0,y0],[x1,y0],px);ln([x0,y1],[x1,y1],px);ln([x0,y0],[x0,y1],px);ln([x1,y0],[x1,y1],px)}
}
function flood([x,y]){
  const im=snap(),d=im.data,i0=(y*64+x)*4,tg=d.slice(i0,i0+4),c=rgb(color);
  if(tg[0]===c[0]&&tg[1]===c[1]&&tg[2]===c[2]&&tg[3]===255)return;
  const st=[[x,y]];
  while(st.length){const[a,b]=st.pop();if(a<0||b<0||a>63||b>63)continue;const i=(b*64+a)*4;
    if(d[i]!==tg[0]||d[i+1]!==tg[1]||d[i+2]!==tg[2]||d[i+3]!==tg[3])continue;
    d[i]=c[0];d[i+1]=c[1];d[i+2]=c[2];d[i+3]=255;st.push([a+1,b],[a-1,b],[a,b+1],[a,b-1])}
  cx.putImageData(im,0,0);
}
const pos=e=>{const r=skin.getBoundingClientRect();return[Math.floor((e.clientX-r.left)/r.width*64),Math.floor((e.clientY-r.top)/r.height*64)]};
const sc=$('#scroller');
skin.onpointerdown=e=>{
  e.preventDefault();skin.setPointerCapture(e.pointerId);const p=pos(e);
  if(tool==='pan'){drawing=true;last=[e.clientX,e.clientY];return}
  if(tool==='pick'){const d=cx.getImageData(Math.max(0,Math.min(63,p[0])),Math.max(0,Math.min(63,p[1])),1,1).data;if(d[3])setColor(hex(d));return}
  push();drawing=true;last=start=p;
  if(tool==='fill'){drawing=false;flood(p);sync();return}
  if(['line','rect','frect'].includes(tool))base=snap();else{dot(p[0],p[1]);sync()}
};
skin.onpointermove=e=>{
  if(!drawing)return;
  if(tool==='pan'){sc.scrollLeft-=e.clientX-last[0];sc.scrollTop-=e.clientY-last[1];last=[e.clientX,e.clientY];return}
  const p=pos(e);
  if(base){cx.putImageData(base,0,0);shape(start,p)}else{ln(last,p,dot);last=p}
  sync();
};
skin.onpointerup=skin.onpointercancel=()=>{drawing=false;base=null};

const F=[[4,0,4,4,4,0],[8,0,4,4,8,0],[4,4,4,12,4,4],[12,4,4,12,12,4],[0,4,4,12,8,4],[8,4,4,12,0,4]];
function legacy(){ // 64x32 -> 64x64: mirror right limbs onto left limbs, face by face
  [[16,48,0,16],[32,48,40,16]].forEach(([du,dv,su,sv])=>F.forEach(([dx,dy,w,h,sx,sy])=>{
    cx.save();cx.translate(du+dx+w,dv+dy);cx.scale(-1,1);cx.drawImage(skin,su+sx,sv+sy,w,h,0,0,w,h);cx.restore()}));
}
$('#file').onchange=async e=>{
  const f=e.target.files[0];e.target.value='';if(!f)return;
  try{
    if(f.type!=='image/png'||f.size>1e6)throw 0;
    const url=URL.createObjectURL(f),img=new Image();
    await new Promise((ok,no)=>{img.onload=ok;img.onerror=no;img.src=url});URL.revokeObjectURL(url);
    const w=img.naturalWidth,h=img.naturalHeight;if(w!==64||(h!==64&&h!==32))throw 0;
    if(!confirm(t('confirm')))return;
    push();cx.clearRect(0,0,64,64);cx.drawImage(img,0,0);if(h===32)legacy();sync();
  }catch{toast(t('badFile'))}
};
$('#exp').onclick=()=>skin.toBlob(b=>{const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='my-minecraft-skin.png';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1e3)},'image/png');

const TOOLS=[['pencil','✎'],['eraser','⌫'],['fill','▣'],['pick','◉'],['line','／'],['rect','▭'],['frect','■'],['pan','✥']];
function pickTool(k){tool=k;document.querySelectorAll('#tools button').forEach(b=>b.classList.toggle('on',b.dataset.t===k))}
function setZ(z){Z=Math.max(3,Math.min(16,z));$('#wrap').style.setProperty('--z',Z)}
function setModel(m){model=m;S.set('model',m);$('#mS').classList.toggle('on',m==='classic');$('#mA').classList.toggle('on',m==='slim');build();drawGuide()}
function initEditor(){
  TOOLS.forEach(([k,g])=>{const b=document.createElement('button');b.dataset.t=k;
    if(k==='pan')b.textContent=g;else{b.dataset.g=g;b.dataset.i=k==='frect'?'rect':k}
    b.onclick=()=>pickTool(k);$('#tools').append(b)});
  ['#22d3ee','#7c5cff','#e6f7ff','#111827','#ef4444','#f59e0b','#22c55e','#3b82f6','#a855f7','#ec4899','#7c4a2d','#f2c9a0'].forEach(c=>{
    const b=document.createElement('button');b.style.background=c;b.setAttribute('aria-label',c);b.onclick=()=>setColor(c);$('#sw').append(b)});
  Object.entries(LANGS).forEach(([k,n])=>{
    const o=document.createElement('option');o.value=k;o.textContent=n;$('#ls').append(o);
    const b=document.createElement('button');b.className='lc';b.dataset.l=k;b.textContent=n;b.onclick=()=>setLang(k);$('#lgrid').append(b)});
  $('#ls').onchange=e=>setLang(e.target.value);
  $('#col').value=color;$('#col').oninput=e=>setColor(e.target.value);
  $('#sz').oninput=e=>size=+e.target.value;
  $('#undo').onclick=undo;$('#redo').onclick=redo;
  $('#nw').onclick=()=>{if(confirm(t('confirm'))){push();blank();sync()}};
  $('#imp').onclick=()=>$('#file').click();
  $('#mS').onclick=()=>setModel('classic');$('#mA').onclick=()=>setModel('slim');
  const tg=(id,k,fn)=>$(id).onclick=e=>{flags[k]=!flags[k];e.currentTarget.classList.toggle('on',flags[k]);fn()};
  tg('#gridB','grid',drawGuide);tg('#uvB','uv',drawGuide);tg('#outB','outer',build);
  $('#zi').onclick=()=>setZ(Z+1);$('#zo').onclick=()=>setZ(Z-1);
  $('#views').onclick=e=>{const k=e.target.dataset.v;if(k){[th,ph]=V[k];need=true}};
  addEventListener('keydown',e=>{
    if($('#studio').hidden||/INPUT|SELECT/.test(e.target.tagName))return;
    const m=e.ctrlKey||e.metaKey,k=e.key.toLowerCase();
    if(m&&k==='z'){e.preventDefault();e.shiftKey?redo():undo()}
    else if(m&&k==='s'){e.preventDefault();save()}
    else if(!m){const x={b:'pencil',e:'eraser',g:'fill',i:'pick'}[k];if(x)pickTool(x);if(k==='+'||k==='=')setZ(Z+1);if(k==='-')setZ(Z-1)}
  });
  $('#mS').classList.toggle('on',model==='classic');$('#mA').classList.toggle('on',model==='slim');
  pickTool('pencil');setZ(6);drawGuide();
  document.querySelectorAll('.credit').forEach(e=>e.textContent=`Created by ${CFG.creator} · v${CFG.version} · Independent fan-made tool, not affiliated with Mojang or Microsoft.`);
}

/* ---------- boot & onboarding ---------- */
const show=id=>['loader','lang','name','studio'].forEach(x=>$('#'+x).hidden=x!==id);
const setPct=p=>{$('#fill').style.width=p+'%';$('#pct').textContent=Math.round(p)+'%'};
const wait=ms=>new Promise(r=>setTimeout(r,ms));
function enter(){
  show('studio');$('#who').textContent=S.get('name','Guest');
  const w=sc.clientWidth;if(w)setZ(Math.max(4,Math.min(10,Math.floor((w-18)/64))));
  if(tex)tex.needsUpdate=true;need=true;
}
function loadSaved(){return new Promise(ok=>{
  const s=S.get('skin');if(!s||!s.startsWith('data:image/png')){blank();return ok()}
  const i=new Image();i.onload=()=>{cx.clearRect(0,0,64,64);cx.drawImage(i,0,0);ok()};i.onerror=()=>{blank();ok()};i.src=s})}
async function boot(){
  $('#retry').hidden=true;
  const steps=[()=>{if(S.get('calm')==='1'||matchMedia('(prefers-reduced-motion:reduce)').matches)document.body.classList.add('calm');initEditor();applyLang()},
    loadSaved,()=>{try{init3d();build()}catch{$('#view3d').insertAdjacentHTML('beforeend','<p style="padding:16px">WebGL / three.js unavailable — the 2D editor still works.</p>')}},
    ()=>{drawGuide();if(!S.set('probe','1'))toast('Storage unavailable: work will not be saved.')}];
  try{
    for(let i=0;i<steps.length;i++){await steps[i]();setPct((i+1)/steps.length*100);await wait(220)}
    if(S.get('done')==='1')enter();else $('#ready').hidden=false;
  }catch(e){$('#msg').textContent='⚠ '+(e&&e.message||'Error');$('#retry').hidden=false}
}
$('#retry').onclick=boot;
$('#start').onclick=()=>show('lang');
$('#motion').onclick=()=>{const c=document.body.classList.toggle('calm');S.set('calm',c?'1':'0')};
$('#lback').onclick=()=>show('loader');$('#lnext').onclick=()=>{show('name');$('#name-in').value=S.get('name','');$('#name-in').focus()};
$('#nback').onclick=()=>show('lang');
$('#nnext').onclick=()=>{
  const n=$('#name-in').value.trim();
  if(!/^[A-Za-z0-9_]{3,20}$/.test(n)){$('#err').textContent=t('errName');return}
  $('#err').textContent='';S.set('name',n);S.set('done','1');enter();
};
$('#name-in').onkeydown=e=>{if(e.key==='Enter')$('#nnext').click()};
boot();
})();
