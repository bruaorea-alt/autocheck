const fm=(n,d=2)=>n.toLocaleString('es-ES',{minimumFractionDigits:d,maximumFractionDigits:d});
const F={consumo:v=>`<b>${fm(v.l/v.km*100)}</b> l/100 km`,
'coste-combustible':v=>`<b>${fm(v.km*v.c/100*v.p)} €</b> · ${fm(v.km*v.c/100,1)} litros`,
'coste-viaje':v=>{const t=v.km*v.c/100*v.p+v.t;return `<b>${fm(t)} €</b> en total · ${fm(t/Math.max(v.n,1))} € por persona`},
mantenimiento:v=>{const a=v.k/v.i*v.r+v.o;return `<b>${fm(a,0)} €</b> al año · ${fm(a/12,0)} € al mes`},
depreciacion:v=>`<b>${fm(v.a-v.b,0)} €</b> perdidos · ${fm((v.a-v.b)/v.y,0)} €/año · ${fm((1-v.b/v.a)*100,1)} %`,
'coste-km':v=>{const t=v.f+v.s+v.m+v.x;return `<b>${fm(t/v.k,3)} €/km</b> · ${fm(t,0)} € al año`}};
document.querySelectorAll('[data-tool]').forEach(c=>{const f=F[c.dataset.tool];if(!f)return;const o=c.querySelector('.out'),u=()=>{const v={};c.querySelectorAll('input').forEach(i=>v[i.name]=parseFloat(i.value));const r=f(v);o.innerHTML=/NaN|Infinity/.test(r)?'Introduce valores válidos mayores que 0.':r};c.addEventListener('input',u);u()});
let DATA;const load=()=>DATA||(DATA=fetch('/assets/cars.json').then(r=>r.json()));
const norm=s=>s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
document.querySelectorAll('[data-search]').forEach(c=>{const q=c.querySelector('input'),r=c.parentNode.querySelector('.res'),fs=c.querySelectorAll('select'),max=+c.dataset.search||8;
const u=async()=>{const d=(await load()).s,t=norm(q.value).split(/\s+/).filter(Boolean),fl={};fs.forEach(s=>fl[s.dataset.f]=s.value);
if(!t.length&&!Object.values(fl).some(Boolean)){r.innerHTML='';return}
const m=d.filter(e=>t.every(w=>e.k.includes(w))&&(!fl.brand||e.b==fl.brand)&&(!fl.fuel||e.f.includes(fl.fuel))&&(!fl.type||e.ty==fl.type)).slice(0,max);
r.innerHTML=m.length?m.map(e=>`<li><a href="${e.u}">${e.t}</a></li>`).join(''):'<li class="nd">Sin resultados. Prueba con otra marca, modelo o año.</li>'};
c.addEventListener('input',u)});
document.querySelectorAll('[data-cmp]').forEach(async c=>{const d=(await load()).c,a=c.querySelector('#ca'),b=c.querySelector('#cb'),o=c.querySelector('#cr');
a.innerHTML=b.innerHTML=d.map((e,i)=>`<option value="${i}">${e.n}</option>`).join('');b.value=Math.min(2,d.length-1);
const R=[['Potencia (CV)','hp',0],['Consumo (l o kWh/100 km)','cons',1],['Peso (kg)','kg',0],['Maletero (L)','trunk',0],['Combustible','fuel'],['Transmisión','gear']],val=(x,k,n)=>x[k]==null?'No disponible':(n==null?x[k]:fm(x[k],n));
const u=()=>{const x=d[a.value],y=d[b.value];o.innerHTML=`<div class="tw"><table><caption class="nd" style="text-align:left;padding:8px 14px">Datos de demostración no verificados</caption><thead><tr><th></th><th>Coche A</th><th>Coche B</th></tr></thead><tbody>${R.map(([n,k,dc])=>{const m=Math.max(x[k]||0,y[k]||0);const bar=z=>typeof z[k]=='number'&&m?`<div style="height:6px;border-radius:6px;background:var(--ac);width:${z[k]/m*100}%;margin-top:6px"></div>`:'';return `<tr><th scope="row">${n}</th><td>${val(x,k,dc)}${bar(x)}</td><td>${val(y,k,dc)}${bar(y)}</td></tr>`}).join('')}<tr><th scope="row">Dimensiones, coste y mantenimiento</th><td class="nd" colspan="2">Datos no disponibles actualmente.</td></tr></tbody></table></div>`};a.onchange=b.onchange=u;u()});
