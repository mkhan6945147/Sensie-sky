const K='sensei-qr-v2',$=s=>document.querySelector(s),app=$('#app');
const D=()=>{const cs=[['Starters','images/starter.jpg'],['Soup','images/soup.jpg'],['Hotpot','images/hotpot.jpg'],['Burgers','images/burger.jpg'],['Sandwiches','images/sandwiches.jpg'],['Pasta','images/pasta.jpg'],['Drinks','images/drink.jpg']];
const it=[[0,'Crispy Chicken Bites','Golden fried chicken, house dip',650],[0,'Loaded Fries','Cheesy fries with herbs',550],[1,'Hot & Sour Soup','Warm, tangy and peppery',450],[1,'Chicken Corn Soup','Silky and comforting',400],[2,'Chicken Hotpot','Bubbling broth, fresh vegetables',1800],[2,'Seafood Hotpot','Prawns, fish and noodles',2400],[3,'Zinger Burger','Crunchy fillet, creamy sauce',750],[3,'Smash Beef Burger','Double patty, melted cheddar',950],[4,'Club Sandwich','Triple-layer, toasted',700],[4,'Grilled Chicken Sandwich','Herb chicken, garlic mayo',650],[5,'Creamy Alfredo Pasta','Parmesan cream sauce',900],[5,'Penne Arrabbiata','Spicy tomato and basil',800],[6,'Lavender Lemonade','Floral and refreshing',350],[6,'Rose Milk','Chilled, lightly sweet',300]];
return{name:'Sensei Sky',tag:'Beyond Dining',logo:'',wa:'923001234567',cur:'Rs.',cats:cs.map((x,i)=>({id:'c'+i,n:x[0],m:x[1]})),items:it.map((x,k)=>({id:'i'+k,c:'c'+x[0],n:x[1],d:x[2],p:x[3],a:true,m:''})),orders:[]}};
let S;try{S=JSON.parse(localStorage.getItem(K))}catch(e){}if(!S)S=D();
let cart={},type='Dine-in',f={name:'',phone:'',table:'',addr:'',note:''},io,lastUrl='';
const uid=()=>Math.random().toString(36).slice(2,9);
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const fm=n=>S.cur+' '+Number(n).toLocaleString('en-US');
const menuUrl=()=>{let u=(S.url||'').trim()||location.href;return u.split('#')[0]+'#menu'};
const waurl=t=>'https://wa.me/'+S.wa.replace(/\D/g,'')+'?text='+encodeURIComponent(t);
const save=()=>{try{localStorage.setItem(K,JSON.stringify(S))}catch(e){toast('Storage full – use smaller media')}};
const toast=t=>{const d=document.createElement('div');d.className='toast';d.textContent=t;document.body.appendChild(d);setTimeout(()=>d.remove(),2600)};
const media=(o,cls='')=>{const m=o.m;if(m&&m.startsWith('data:video'))return `<div class="md ${cls}"><video src="${m}" autoplay muted loop playsinline></video></div>`;
if(m)return `<div class="md ${cls}"><img class="kb" src="${m}" alt="${esc(o.n)}"></div>`;return `<div class="md ph ${cls}"><b>${esc((o.n||'?')[0])}</b></div>`};
const logo=()=>`<div class="logo">${S.logo?`<img src="${S.logo}" alt="">`:esc((S.name||'?')[0])}</div>`;
const tot=()=>S.items.reduce((s,i)=>s+(cart[i.id]||0)*i.p,0),cnt=()=>Object.values(cart).reduce((a,b)=>a+b,0);
const act=i=>!i.a?'<em class="mut">Sold out</em>':cart[i.id]?`<span class="step"><button data-act="dec" data-id="${i.id}">−</button><b>${cart[i.id]}</b><button data-act="inc" data-id="${i.id}">+</button></span>`:`<button class="add" data-act="inc" data-id="${i.id}">ADD</button>`;
const I=i=>i.m?i:{...i,m:(S.cats.find(c=>c.id==i.c)||{}).m||''};
const card=i=>`<article class="card ${i.a?'':'off'}">${media(I(i),'cm')}<div class="ci"><h3>${esc(i.n)}</h3><p>${esc(i.d)}</p><div class="row"><b class="pr">${fm(i.p)}</b><span id="a${i.id}">${act(i)}</span></div></div></article>`;
const land=()=>`<div class="pg land">${logo()}<h1>${esc(S.name)}</h1><div class="mut serif" style="font-size:20px">${esc(S.tag)}</div>
<div class="qrbox"><div id="qr"></div><div class="scan"></div></div><div class="lbl">SCAN TO VIEW MENU</div><div class="mut" style="font-size:11px;word-break:break-all;padding:0 12px">${esc(menuUrl())}</div>${/^https?:/.test(menuUrl())?'':'<p style="color:#c0456f;font-size:13px;margin:0 12px">This QR only works on this device. Host the site, then paste its public link in Admin.</p>'}
<button class="btn" data-act="go" data-id="menu" style="max-width:300px;margin:6px auto 0">OPEN MENU</button><a class="st" data-act="go" data-id="admin">STAFF</a></div>`;
const menu=()=>`<div class="pg"><header class="top">${logo()}<h1>${esc(S.name)}</h1><p>${esc(S.tag)}</p><a class="btn wa" style="display:block;text-align:center;text-decoration:none;max-width:250px;margin:12px auto 0;padding:11px 18px;font-size:13px" target="_blank" rel="noopener" href="${waurl('Hello '+S.name+', I have a question.')}">CHAT ON WHATSAPP</a></header>
<nav class="tabs">${S.cats.map(c=>`<button class="tab" id="t${c.id}" data-act="cat" data-id="${c.id}">${media(c)}${esc(c.n)}</button>`).join('')}</nav>
${S.cats.map(c=>`<section class="sec" id="s${c.id}" data-id="${c.id}"><h2>${esc(c.n)}</h2>${S.items.filter(i=>i.c==c.id).map(card).join('')||'<p class="mut">Coming soon.</p>'}</section>`).join('')}</div><div class="bar" id="bar"></div>`;
const bar=()=>{const b=$('#bar');if(!b)return;const n=cnt();b.classList.toggle('show',n>0);if(n)b.innerHTML=`<div><small>${n} item${n>1?'s':''} selected</small><b>${fm(tot())}</b></div><button data-act="go" data-id="checkout">VIEW ORDER</button>`};
const checkout=()=>{const L=S.items.filter(i=>cart[i.id]);return `<div class="pg"><header class="top"><h1>Your Order</h1><p>${esc(S.name)}</p></header>
<div class="panel"><h2>Summary</h2>${L.map(i=>`<div class="ln"><div><b>${esc(i.n)}</b><div class="mut">${fm(i.p)} each</div></div><span class="step"><button data-act="dec" data-id="${i.id}">−</button><b>${cart[i.id]}</b><button data-act="inc" data-id="${i.id}">+</button></span><b>${fm(i.p*cart[i.id])}</b></div>`).join('')}<div class="tot"><span>Total</span><b>${fm(tot())}</b></div></div>
<div class="panel"><h2>Your Details</h2><label class="f">Name</label><input type="text" data-f="name" value="${esc(f.name)}" autocomplete="name">
<label class="f">Phone number</label><input type="tel" data-f="phone" value="${esc(f.phone)}" autocomplete="tel">
<label class="f">Order type</label><div class="seg">${['Dine-in','Takeaway','Delivery'].map(t=>`<button class="${t==type?'on':''}" data-act="type" data-id="${t}">${t}</button>`).join('')}</div>
${type=='Dine-in'?`<label class="f">Table number</label><input type="text" data-f="table" value="${esc(f.table)}">`:''}
${type=='Delivery'?`<label class="f">Delivery address</label><textarea rows="2" data-f="addr">${esc(f.addr)}</textarea>`:''}
<label class="f">Special instructions (optional)</label><textarea rows="3" data-f="note">${esc(f.note)}</textarea></div>
<div class="panel"><h2>WhatsApp Message</h2><div class="ord" id="pv">${esc(msg())}</div></div>
<div class="gap"><button class="btn wa" data-act="send">SEND ORDER ON WHATSAPP</button><button class="btn ghost" data-act="go" data-id="menu">BACK TO MENU</button></div></div>`};
const inp=(sc,id,k,v,t='text')=>`<input type="${t}" data-ed="${sc}" data-id="${id}" data-k="${k}" value="${esc(v)}">`;
const upl=(sc,id,k)=>`<label class="up">Upload photo / GIF / video<input type="file" hidden accept="image/*,video/*" data-up="${sc}" data-id="${id}" data-k="${k}"></label>`;
const admin=()=>`<div class="pg"><header class="top"><h1>Admin</h1><p>Restaurant settings</p></header><button class="btn ghost" data-act="go" data-id="menu">OPEN MENU</button>
<div class="panel"><h2>Restaurant</h2><label class="f">Name</label>${inp('s','','name',S.name)}<label class="f">Tagline</label>${inp('s','','tag',S.tag)}
<label class="f">WhatsApp number (country code, no + or spaces, e.g. 923001234567)</label>${inp('s','','wa',S.wa,'tel')}<label class="f">Currency label</label>${inp('s','','cur',S.cur)}<label class="f">Public menu link (the QR opens this)</label>${inp('s','','url',S.url||'')}
<label class="f">Logo</label>${logo()}${upl('s','','logo')}</div>
<div class="panel"><h2>Categories</h2>${S.cats.map(c=>`<div class="ad">${media(c)}<div>${inp('c',c.id,'n',c.n)}${upl('c',c.id,'m')}<br><button class="del" data-act="delc" data-id="${c.id}">Delete category</button></div></div>`).join('')}<button class="btn" style="margin-top:12px" data-act="addc">ADD CATEGORY</button></div>
<div class="panel"><h2>Menu items</h2>${S.items.map(i=>`<div class="ad">${media(I(i))}<div>${inp('i',i.id,'n',i.n)}<label class="f">Price</label>${inp('i',i.id,'p',i.p,'number')}<label class="f">Description</label>${inp('i',i.id,'d',i.d)}
<label class="f">Category</label><select data-ed="i" data-id="${i.id}" data-k="c">${S.cats.map(c=>`<option value="${c.id}" ${c.id==i.c?'selected':''}>${esc(c.n)}</option>`).join('')}</select>
<label class="chk"><input type="checkbox" data-ed="i" data-id="${i.id}" data-k="a" ${i.a?'checked':''}> Available</label>${upl('i',i.id,'m')}<br><button class="del" data-act="deli" data-id="${i.id}">Delete item</button></div></div>`).join('')}<button class="btn" style="margin-top:12px" data-act="addi">ADD MENU ITEM</button></div>
<div class="panel"><h2>Orders (${S.orders.length})</h2>${S.orders.map(o=>`<div class="ord"><b>${esc(o.t)}</b> · ${esc(o.n)} · ${esc(o.ty)} · ${fm(o.total)}\n${esc(o.text)}</div>`).join('')||'<p class="mut">No orders sent from this device yet.</p>'}${S.orders.length?'<button class="del" data-act="clro">Clear orders</button>':''}</div></div>`;
function R(){const h=location.hash.slice(1);if(io)io.disconnect();
app.innerHTML=h=='menu'?menu():h=='checkout'?(cnt()?checkout():menu()):h=='admin'?admin():h=='done'&&lastUrl?done():land();window.scrollTo(0,0);
if(!h||h=='')try{new QRCode($('#qr'),{text:menuUrl(),width:210,height:210,colorDark:'#3a2a4d',colorLight:'#ffffff'})}catch(e){}
if(h=='menu'){bar();io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){const id=e.target.dataset.id;document.querySelectorAll('.tab').forEach(t=>t.classList.toggle('on',t.id=='t'+id));const t=$('#t'+id);t&&t.scrollIntoView({inline:'center',block:'nearest'})}}),{rootMargin:'-30% 0px -60% 0px'});document.querySelectorAll('.sec').forEach(s=>io.observe(s))}}
const go=h=>{if(location.hash.slice(1)==h)R();else location.hash=h};
addEventListener('hashchange',R);
function sync(id){if(location.hash=='#checkout'){const y=scrollY;if(cnt()){R();scrollTo(0,y)}else go('menu');return}
const i=S.items.find(x=>x.id==id),el=$('#a'+id);if(el){el.innerHTML=act(i);const b=el.firstElementChild;b&&b.classList.add('pop')}bar()}
function msg(){const L=S.items.filter(i=>cart[i.id]);let m=`*${S.name}* – New Order\n\nName: ${f.name||'-'}\nPhone: ${f.phone||'-'}\nOrder type: ${type}\n`;
if(type=='Dine-in')m+=`Table: ${f.table||'-'}\n`;if(type=='Delivery')m+=`Address: ${f.addr||'-'}\n`;
m+=`\n`+L.map(i=>`${cart[i.id]} x ${i.n} – ${fm(i.p*cart[i.id])} (${fm(i.p)} each)`).join('\n');if(f.note.trim())m+=`\n\nSpecial instructions: ${f.note}`;m+=`\n\n*Grand total: ${fm(tot())}*`;return m}
function send(){if(!f.name.trim()||!f.phone.trim())return toast('Please enter your name and phone');if(type=='Dine-in'&&!f.table.trim())return toast('Please enter your table number');if(type=='Delivery'&&!f.addr.trim())return toast('Please enter your delivery address');
const m=msg();S.orders.unshift({t:new Date().toLocaleString(),n:f.name,ty:type,total:tot(),text:m});save();lastUrl=waurl(m);window.open(lastUrl,'_blank');cart={};go('done')}
const done=()=>`<div class="pg land">${logo()}<h1>Thank you!</h1><p class="mut">WhatsApp should open with your order ready to send. If it did not, tap the button below.</p><a class="btn wa" style="display:block;text-decoration:none;max-width:300px;margin:6px auto" target="_blank" rel="noopener" href="${lastUrl}">OPEN WHATSAPP</a><button class="btn ghost" style="max-width:300px;margin:0 auto" data-act="go" data-id="menu">BACK TO MENU</button></div>`;
document.addEventListener('click',e=>{const t=e.target.closest('[data-act]');if(!t)return;const a=t.dataset.act,id=t.dataset.id;
if(a=='go')go(id);else if(a=='inc'){cart[id]=(cart[id]||0)+1;sync(id)}else if(a=='dec'){cart[id]--;if(cart[id]<1)delete cart[id];sync(id)}
else if(a=='cat'){$('#s'+id).scrollIntoView({behavior:'smooth'})}else if(a=='type'){type=id;R()}else if(a=='send')send();
else if(a=='addc'){S.cats.push({id:uid(),n:'New category',m:''});save();R()}
else if(a=='addi'){S.items.push({id:uid(),c:S.cats[0]?S.cats[0].id:'',n:'New item',d:'',p:0,a:true,m:''});save();R()}
else if(a=='delc'){S.cats=S.cats.filter(c=>c.id!=id);S.items=S.items.filter(i=>i.c!=id);save();R()}
else if(a=='deli'){S.items=S.items.filter(i=>i.id!=id);delete cart[id];save();R()}else if(a=='clro'){S.orders=[];save();R()}});
document.addEventListener('input',e=>{const k=e.target.dataset.f;if(k){f[k]=e.target.value;const p=$('#pv');if(p)p.textContent=msg()}});
const tgt=(sc,id)=>sc=='s'?S:(sc=='c'?S.cats:S.items).find(x=>x.id==id);
document.addEventListener('change',e=>{const el=e.target,d=el.dataset;
if(d.ed){const o=tgt(d.ed,d.id);o[d.k]=el.type=='checkbox'?el.checked:d.k=='p'?(+el.value||0):el.value;save()}
else if(d.up&&el.files[0])rd(el.files[0],r=>{tgt(d.up,d.id)[d.k]=r;save();R()})});
function rd(file,cb){if(/video|gif/.test(file.type)){if(file.size>1.5e6)return toast('File too large (max 1.5 MB)');const r=new FileReader();r.onload=()=>cb(r.result);r.readAsDataURL(file);return}
const im=new Image();im.onload=()=>{const k=Math.min(1,700/im.width),c=document.createElement('canvas');c.width=im.width*k;c.height=im.height*k;c.getContext('2d').drawImage(im,0,0,c.width,c.height);cb(c.toDataURL('image/jpeg',.8))};im.src=URL.createObjectURL(file)}
R();