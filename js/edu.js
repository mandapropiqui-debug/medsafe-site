(function(){
'use strict';
var RM=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var $=function(s,c){return (c||document).querySelector(s)},$$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};
function g(t,m,s){return Math.exp(-Math.pow((t-m)/s,2))}
function qrs(t){if(t<0||t>.8)return 0;return .1*g(t,.15,.04)-.1*g(t,.28,.011)+1*g(t,.30,.011)-.24*g(t,.325,.013)+.26*g(t,.55,.07)}

/* ---------- simulador de plantao ---------- */
var cv=$('#scv');
var selectCourse=function(){};
if(cv){
 var ctx=cv.getContext('2d'),W=0,H=0,dpr=Math.min(2,window.devicePixelRatio||1),ys=[],cx=0,last=0,T=0,scn='ok',beats=[],nextBeat=.2,vis=true,SPEED=150;
 var S={
  ok:{hr:'72',sp:'98',pa:'120/80',al:'Estável',hot:0,txt:'Paciente estável. É o melhor momento para treinar o próximo caso.',c:null,rr:function(){return .83}},
  af:{hr:'134',sp:'94',pa:'108/70',al:'Arritmia',hot:1,txt:'Reconhecer o ritmo é a primeira decisão. O ECG Master treina esse olhar.',c:'ecg',rr:function(){return .3+Math.random()*.42}},
  sh:{hr:'128',sp:'86',pa:'82/50',al:'Choque',hot:1,txt:'Dispneia e choque: o Pocus mostra a causa à beira-leito.',c:'pocus',rr:function(){return .47}},
  vf:{hr:'--',sp:'--',pa:'--',al:'Parada cardíaca',hot:1,txt:'Parada cardíaca: o TECA A, da SBC, treina exatamente esta resposta.',c:'teca',rr:function(){return .83}}
 };
 function size(){var r=cv.getBoundingClientRect();W=Math.round(r.width);H=Math.round(r.height);cv.width=W*dpr;cv.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);ys=new Array(W).fill(H*.6);cx=0}
 function val(t){
  if(scn==='vf'){return (.42*Math.sin(t*30+1.2*Math.sin(t*2.1))+.28*Math.sin(t*44)+.18*Math.sin(t*17.5+2))*(.7+.3*Math.sin(t*1.7))}
  var v=0;for(var i=Math.max(0,beats.length-4);i<beats.length;i++){var a=(scn==='sh'?.62:1);var tt=t-beats[i];if(scn==='af'){v+=a*(g(tt,.30,.011)-.1*g(tt,.28,.011)-.2*g(tt,.325,.013)+.22*g(tt,.55,.07))}else if(scn==='sh'){v+=a*qrs(tt*1.5)}else{v+=qrs(tt)}}
  if(scn==='af')v+=.05*Math.sin(t*60)+.04*Math.sin(t*37);
  return v}
 function frame(ts){
  requestAnimationFrame(frame);
  if(!vis||!W)return;
  var dt=Math.min(.05,(ts-last)/1000||.016);last=ts;
  var from=cx;cx+=SPEED*dt;
  for(var x=Math.floor(from);x<=Math.floor(cx)&&x<W;x++){
   var tt=T+(x-cx)/SPEED+dt;
   while(scn!=='vf'&&tt>=nextBeat){beats.push(nextBeat);nextBeat+=S[scn].rr()}
   ys[x]=H*.62-val(tt)*H*.5}
  T+=dt;
  if(cx>=W){cx=0}
  ctx.clearRect(0,0,W,H);ctx.lineJoin='round';ctx.lineCap='round';
  var cxi=Math.floor(cx),gap=14;
  function seg(a,b,al,lw){if(b<=a)return;ctx.beginPath();ctx.moveTo(a,ys[a]);for(var i=a+1;i<=b;i++)ctx.lineTo(i,ys[i]);ctx.strokeStyle='rgba(95,212,220,'+al+')';ctx.lineWidth=lw;ctx.stroke()}
  seg(0,Math.max(0,cxi-gap-80),.32,1.5);seg(Math.max(0,cxi-gap-80),Math.max(0,cxi-gap),.95,2.4);seg(Math.min(W-1,cxi+gap),W-1,.32,1.5);
  ctx.beginPath();ctx.arc(Math.min(W-1,cxi),ys[Math.min(W-1,cxi)],4,0,6.283);ctx.fillStyle='#eda960';ctx.fill();
 }
 function setScn(k){scn=k;var s=S[k];beats=[];nextBeat=T+.1;
  $('#vhr').textContent=s.hr;$('#vsp').textContent=s.sp;$('#vpa').textContent=s.pa;var al=$('#sal');al.textContent=s.al;al.classList.toggle('hot',!!s.hot);
  $$('.sc .chip').forEach(function(c){c.classList.toggle('on',c.dataset.s===k)});
  $('#rt').textContent=s.txt;var b=$('#rb');if(s.c){b.hidden=false;b.dataset.c=s.c;b.textContent='Ver curso'}else{b.hidden=true}}
 $$('.sc .chip').forEach(function(c){c.addEventListener('click',function(){setScn(c.dataset.s)})});
 $('#rb').addEventListener('click',function(){selectCourse(this.dataset.c)});
 new IntersectionObserver(function(es){vis=es[0].isIntersecting}).observe(cv);
 window.addEventListener('resize',size);size();
 if(RM){for(var x=0;x<W;x++){ys[x]=H*.62-qrs((x%150)/150*.8)*H*.5}ctx.beginPath();ctx.moveTo(0,ys[0]);for(var i=1;i<W;i++)ctx.lineTo(i,ys[i]);ctx.strokeStyle='#5fd4dc';ctx.lineWidth=2;ctx.stroke()}else requestAnimationFrame(frame);
}

/* ---------- quadro de cursos ---------- */
var chs=$$('.e-ch'),ps=$$('.e-p'),usOn=false;
if(chs.length){
 function sel(id,scroll){chs.forEach(function(c){var on=c.dataset.c===id;c.classList.toggle('on',on);c.setAttribute('aria-selected',on);c.tabIndex=on?0:-1});ps.forEach(function(p){p.classList.toggle('on',p.id==='p-'+id)});
  usOn=id==='pocus';if(usOn)usStart();
  if(scroll){var el=$('#cursos');if(el){var y=el.getBoundingClientRect().top+window.pageYOffset-8;window.scrollTo({top:y,behavior:RM?'auto':'smooth'})}}}
 selectCourse=function(id){sel(id,false)};
 chs.forEach(function(c,i){c.tabIndex=i===0?0:-1;c.addEventListener('click',function(){sel(c.dataset.c)});
  c.addEventListener('keydown',function(e){var k=e.key,d=k==='ArrowDown'||k==='ArrowRight'?1:k==='ArrowUp'||k==='ArrowLeft'?-1:0;if(!d)return;e.preventDefault();var n=chs[(i+d+chs.length)%chs.length];n.focus();sel(n.dataset.c)})});
 /* TECA: ritmo de compressao */
 var tb=$('.tapb'),tt=[];
 if(tb){tb.addEventListener('click',function(){var n=performance.now();if(tt.length&&n-tt[tt.length-1]>2500)tt=[];tt.push(n);if(tt.length>7)tt.shift();var rd=$('.rd'),nd=$('.needle');
  if(tt.length<4){rd.textContent='Continue no mesmo ritmo ('+tt.length+' toques)';return}
  var avg=(tt[tt.length-1]-tt[0])/(tt.length-1),cpm=Math.round(60000/avg),pos=Math.max(0,Math.min(100,(cpm-60)));nd.style.left='calc('+pos+'% - 2px)';
  rd.textContent=cpm+' por minuto. '+(cpm<100?'Mais rápido para entrar na faixa.':cpm>120?'Mais devagar para entrar na faixa.':'No ritmo da diretriz.')})}
 /* POCUS: ultrassom */
 var uc=$('.usb canvas');
 if(uc){var ux=uc.getContext('2d'),mode='n',press=0,target=0,pt=.38,noise=document.createElement('canvas'),utime=0,ushift=[0,0],uraf=0,ulast=0,uout=$('.uss output');
  noise.width=420;noise.height=240;(function(){var s=document.createElement('canvas');s.width=140;s.height=80;var sx=s.getContext('2d'),id=sx.createImageData(140,80);for(var i=0;i<id.data.length;i+=4){var v=Math.random()*Math.random()*210;id.data[i]=id.data[i+1]=id.data[i+2]=v;id.data[i+3]=255}sx.putImageData(id,0,0);var nx=noise.getContext('2d');nx.imageSmoothingEnabled=true;nx.drawImage(s,0,0,420,240)})();
  function pos(e){var r=uc.getBoundingClientRect();return Math.max(0,Math.min(1,(e.clientX-r.left)/r.width))}
  uc.addEventListener('pointermove',function(e){pt=pos(e)});
  uc.addEventListener('pointerdown',function(e){pt=pos(e);target=1;try{uc.setPointerCapture(e.pointerId)}catch(_){}});
  ['pointerup','pointercancel'].forEach(function(ev){uc.addEventListener(ev,function(){target=0})});
  $$('.uss .chip').forEach(function(b){b.addEventListener('click',function(){mode=b.dataset.m;$$('.uss .chip').forEach(function(x){x.classList.toggle('on',x===b)})})});
  var lastMsg='';
  function uframe(ts){
   uraf=requestAnimationFrame(uframe);if(!usOn||document.hidden){return}
   var dt=Math.min(.05,(ts-ulast)/1000||.016);ulast=ts;utime+=dt;press+=(target-press)*Math.min(1,dt*9);
   if(ts%160<20){ushift=[Math.random()*60|0,Math.random()*40|0]}
   var sx=(.5-pt)*170,veinX=170+sx,aligned=Math.abs(veinX-210)<46,lift=press*7;
   ux.fillStyle='#02060f';ux.fillRect(0,0,420,240);
   ux.save();ux.beginPath();ux.moveTo(210,4);ux.arc(210,4,238,Math.PI/2-.7,Math.PI/2+.7);ux.closePath();ux.clip();
   ux.globalAlpha=.62;ux.drawImage(noise,-ushift[0],-ushift[1]-lift,420+60,240+40);ux.globalAlpha=1;
   ux.translate(0,-lift);
   var ry=24*(mode==='n'?(1-press*.9):(1-press*.12));
   ux.beginPath();ux.ellipse(veinX,128,36,Math.max(3,ry),0,0,6.283);ux.fillStyle='#010409';ux.fill();
   if(mode==='t'){ux.beginPath();ux.ellipse(veinX+3,130,20,Math.max(2,ry*.6),0,0,6.283);ux.fillStyle='rgba(190,200,210,.55)';ux.fill()}
   ux.lineWidth=1.6;ux.strokeStyle='rgba(255,255,255,.4)';ux.beginPath();ux.ellipse(veinX,128,36,Math.max(3,ry),0,0,6.283);ux.stroke();
   var ar=17+1.6*Math.sin(utime*7);ux.beginPath();ux.arc(250+sx,112,ar,0,6.283);ux.fillStyle='#010409';ux.fill();ux.stroke();
   ux.restore();
   ux.fillStyle='rgba(255,255,255,.85)';ux.font='700 12px Montserrat,sans-serif';
   ux.fillText('V',veinX-4,132-lift);ux.fillText('A',246+sx,116-lift);
   ux.fillStyle='rgba(191,243,247,.9)';ux.fillRect(190,0,40,5);
   var m;if(!aligned)m='Mova o ponteiro até alinhar a veia ao centro do feixe.';else if(press<.7)m='Veia localizada. Segure para pressionar.';else m=mode==='n'?'A veia colabou por completo: compressível, sem sinal de trombose.':'A veia não colabou: sugere trombose venosa profunda (TVP).';
   if(m!==lastMsg){lastMsg=m;uout.textContent=m}
  }
  window.usStart=function(){cancelAnimationFrame(uraf);ulast=performance.now();uraf=requestAnimationFrame(uframe)};
 }
 function usStart(){if(window.usStart)window.usStart()}
 /* ECG: regua */
 var es=$('.ecgs');
 if(es){var d='';for(var k=0;k<4;k++){var o=20+k*160;d+='M'+o+' 100H'+(o+18)+'Q'+(o+30)+' 84 '+(o+42)+' 100H'+(o+54)+'L'+(o+57)+' 106L'+(o+60)+' 28L'+(o+64)+' 114L'+(o+67)+' 100H'+(o+86)+'Q'+(o+108)+' 70 '+(o+130)+' 100H'+(o+160)}
  $('.tr',es).setAttribute('d',d);var cals=$$('.cal',es),cxs=[80,300],ro=$('.ro');
  function upd(){cals.forEach(function(c,i){c.setAttribute('transform','translate('+cxs[i]+' 0)');$('circle',c).setAttribute('cx',0);$('line',c).setAttribute('x1',0);$('line',c).setAttribute('x2',0)});var dx=Math.abs(cxs[1]-cxs[0]),ms=Math.round(dx/200*1000);if(dx<6){ro.textContent='Afaste as réguas para medir';return}var bpm=Math.round(60000/ms);ro.textContent=ms+' ms entre as réguas, '+bpm+' bpm'+(Math.abs(dx-160)<7?'. Pico a pico: ritmo regular.':'')}
  cals.forEach(function(c,i){c.addEventListener('pointerdown',function(e){e.preventDefault();var mv=function(ev){var r=es.getBoundingClientRect();cxs[i]=Math.max(4,Math.min(596,(ev.clientX-r.left)/r.width*600));upd()};var up=function(){window.removeEventListener('pointermove',mv);window.removeEventListener('pointerup',up)};window.addEventListener('pointermove',mv);window.addEventListener('pointerup',up)})});upd()}
 /* Anatomia: camadas */
 var lays=$$('.lay'),lc=$$('.lchips .chip');
 lc.forEach(function(b){b.addEventListener('click',function(){var n=+b.dataset.l;lc.forEach(function(x){x.classList.toggle('on',x===b)});lays.forEach(function(l,i){l.classList.toggle('on',i===n)})})});
}

/* ---------- instrutores: sanfona ---------- */
$$('.folds').forEach(function(box){var fds=Array.prototype.slice.call(box.querySelectorAll('.fd'));fds.forEach(function(f){function op(){fds.forEach(function(x){var on=x===f;x.classList.toggle('on',on);x.setAttribute('aria-expanded',on)})}f.addEventListener('click',op);f.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();op()}});f.addEventListener('mouseenter',function(e){if(window.matchMedia('(hover:hover)').matches)op()})})});
var gch=$$('.gchips .chip');gch.forEach(function(c){c.addEventListener('click',function(){gch.forEach(function(x){var on=x===c;x.classList.toggle('on',on);x.setAttribute('aria-selected',on)});$$('.folds').forEach(function(b){b.hidden=b.dataset.g!==c.dataset.g})})});

/* ---------- revalida: pista ---------- */
var pp=$('#pp'),runner=$('#runner');
if(pp&&runner){var L=pp.getTotalLength(),stn=$$('.stn'),sds=$$('.sd'),ck=0,rpos=0,rtimer,rest=0;
 function place(f){var p=pp.getPointAtLength(L*f);runner.setAttribute('cx',p.x);runner.setAttribute('cy',p.y)}
 function goto(k,user){ck=k;stn.forEach(function(s,i){s.classList.toggle('on',i===k)});sds.forEach(function(s,i){s.classList.toggle('on',i===k)});var from=rpos,to=k/9,s0=performance.now();(function f(n){var p=Math.min(1,(n-s0)/700),e=1-Math.pow(1-p,3);rpos=from+(to-from)*e;place(rpos);if(p<1)requestAnimationFrame(f)})(s0);if(user)rest=Date.now()+9000}
 stn.forEach(function(s,i){s.addEventListener('click',function(){goto(i,true)})});
 place(0);var rv=false;new IntersectionObserver(function(es){rv=es[0].isIntersecting}).observe(pp);
 if(!RM)setInterval(function(){if(rv&&Date.now()>rest)goto((ck+1)%10)},3200);
}

/* ---------- experiencia: lista ativa ---------- */
var xs=$$('.xs'),xi=$$('.xi');
if(xs.length){var xk=0,xrest=0,xv=false;
 function xo(k,user){xk=k;xs.forEach(function(s,i){s.classList.toggle('on',i===k)});xi.forEach(function(s,i){s.classList.toggle('on',i===k)});if(user)xrest=Date.now()+9000}
 xs.forEach(function(s,i){s.addEventListener('click',function(){xo(i,true)});s.addEventListener('mouseenter',function(){xo(i,true)});s.addEventListener('focus',function(){xo(i,true)})});
 new IntersectionObserver(function(es){xv=es[0].isIntersecting}).observe($('#xsl'));
 if(!RM)setInterval(function(){if(xv&&Date.now()>xrest)xo((xk+1)%xs.length)},4200);
}

/* ---------- mapa do piaui ---------- */
var po=$('#po'),pins=$('#pins');
if(po&&pins){
 function pr(p){return [(p[0]+45.99)/5.62*541+10,(-2.74-p[1])/8.19*735+10]}
 var CT={teresina:['Teresina',-42.80,-5.09],parnaiba:['Parnaíba',-41.78,-2.90],picos:['Picos',-41.47,-7.08],floriano:['Floriano',-43.02,-6.77],piripiri:['Piripiri',-41.78,-4.27],oeiras:['Oeiras',-42.13,-7.02]};
 var NS='http://www.w3.org/2000/svg',tabs=$$('.ct'),hs=$$('.hs');
 function city(k){tabs.forEach(function(t){var on=t.dataset.c===k;t.classList.toggle('on',on);t.setAttribute('aria-selected',on)});hs.forEach(function(h){h.classList.toggle('on',h.dataset.c===k)});$$('.pin',pins).forEach(function(p){p.classList.toggle('on',p.dataset.c===k)})}
 Object.keys(CT).forEach(function(k,i){var c=CT[k],xy=pr([c[1],c[2]]),g=document.createElementNS(NS,'g');g.setAttribute('class','pin'+(i===0?' on':''));g.dataset.c=k;g.setAttribute('transform','translate('+xy[0]+' '+xy[1]+')');g.setAttribute('tabindex','0');g.setAttribute('role','button');g.setAttribute('aria-label',c[0]);
  g.innerHTML='<circle class="r" r="9" style="animation-delay:'+(i*.45)+'s"/><circle class="d" r="8"/>'+(k==='oeiras'?'<text x="0" y="32" text-anchor="middle">':'<text x="16" y="7">')+c[0]+'</text>';
  g.addEventListener('click',function(){city(k)});g.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();city(k)}});pins.appendChild(g)});
 tabs.forEach(function(t){t.addEventListener('click',function(){city(t.dataset.c)})});
 var cmEl=$('.cm');new IntersectionObserver(function(es,o){if(es[0].isIntersecting){cmEl.classList.add('in');o.disconnect()}},{threshold:.3}).observe(cmEl);
 /* contagem */
 $$('.cn b').forEach(function(b){var v=+b.dataset.n;new IntersectionObserver(function(es,o){if(es[0].isIntersecting){o.disconnect();if(RM){b.textContent=v;return}var t0=performance.now();(function f(t){var p=Math.min(1,(t-t0)/1500);b.textContent=Math.round(v*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(f)})(t0)}},{threshold:.6}).observe(b)});
}
})();
