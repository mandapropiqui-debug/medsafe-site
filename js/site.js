(function(){
'use strict';
var RM=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var $=function(s,c){return (c||document).querySelector(s)},$$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};

/* menu */
var nav=$('.nav');
if(nav){var bt=$('.burger',nav);bt&&bt.addEventListener('click',function(){var o=nav.classList.toggle('open');bt.setAttribute('aria-expanded',o)});
$$('.drawer a',nav).forEach(function(a){a.addEventListener('click',function(){nav.classList.remove('open')})})}

/* titulos palavra a palavra */
$$('.tw').forEach(function(el){var i=0;(function walk(n){Array.prototype.slice.call(n.childNodes).forEach(function(c){
 if(c.nodeType===3){var f=document.createDocumentFragment();c.textContent.split(/(\s+)/).forEach(function(p){if(!p)return;if(/^\s+$/.test(p)){f.appendChild(document.createTextNode(' '));return}var s=document.createElement('span');s.textContent=p;s.style.setProperty('--i',i++);f.appendChild(s)});n.replaceChild(f,c)}
 else if(c.nodeType===1){walk(c)}})})(el)});

/* revelacao */
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.18,rootMargin:'0px 0px -6% 0px'});
$$('.rv,.tw').forEach(function(el){io.observe(el)});

/* ECG */
var mon=$('#monitor');
if(mon){
 var cv=$('canvas',mon),ctx=cv.getContext('2d'),bpmEl=$('#bpm'),W=0,H=0,dpr=Math.min(2,window.devicePixelRatio||1),ys=[],cx=0,last=0,beatT=9,nextBeat=.4,amp=1,ptr=null,beats=[],visible=true,lastBeatX=-999;
 var SPEED=130;
 function size(){var r=cv.getBoundingClientRect();W=Math.round(r.width);H=Math.round(r.height);cv.width=W*dpr;cv.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);ys=new Array(W).fill(H*.58);cx=0}
 function g(t,m,s){return Math.exp(-Math.pow((t-m)/s,2))}
 function wave(t){if(t<0||t>.8)return 0;return .1*g(t,.15,.04)-.1*g(t,.28,.011)+1*g(t,.30,.011)-.24*g(t,.325,.013)+.26*g(t,.55,.07)}
 function beat(a){beatT=0;amp=a||1;var n=performance.now();beats.push(n);if(beats.length>5)beats.shift()}
 function bpm(){if(beats.length<2)return 62;var d=0;for(var i=1;i<beats.length;i++)d+=beats[i]-beats[i-1];d/=beats.length-1;return Math.max(48,Math.min(150,Math.round(60000/d)))}
 var shown=62;
 function frame(ts){
  requestAnimationFrame(frame);
  if(!visible||!W)return;
  var dt=Math.min(.05,(ts-last)/1000||0.016);last=ts;
  var step=SPEED*dt,from=cx;cx+=step;
  beatT+=dt;nextBeat-=dt;
  if(nextBeat<=0&&!ptr){beat(1);nextBeat=.95+Math.sin(ts/4000)*.08}
  var base=H*.62;
  for(var x=Math.floor(from);x<=Math.floor(cx)&&x<W;x++){
   var t=beatT-((cx-x)/SPEED);var y=base-wave(t)*H*.52*amp;
   if(ptr&&Math.abs(ptr.x-x)<14){y=y*.15+ptr.y*.85}
   ys[x]=y}
  if(cx>=W){cx=0}
  shown+=(bpm()-shown)*.04;bpmEl&&(bpmEl.textContent=Math.round(shown));
  ctx.clearRect(0,0,W,H);
  var gap=16,cxi=Math.floor(cx);
  ctx.lineJoin='round';ctx.lineCap='round';
  function seg(a,b,al,lw){if(b<=a)return;ctx.beginPath();ctx.moveTo(a,ys[a]);for(var i=a+1;i<=b;i++)ctx.lineTo(i,ys[i]);ctx.strokeStyle='rgba(95,212,220,'+al+')';ctx.lineWidth=lw;ctx.stroke()}
  seg(0,Math.max(0,cxi-gap-90),.35,1.6);
  seg(Math.max(0,cxi-gap-90),Math.max(0,cxi-gap),.95,2.6);
  seg(Math.min(W-1,cxi+gap),W-1,.35,1.6);
  var dx=Math.min(W-1,Math.max(0,cxi)),dy=ys[dx];
  ctx.beginPath();ctx.arc(dx,dy,4.5,0,6.283);ctx.fillStyle='#eda960';ctx.fill();
 }
 function pt(e){var r=cv.getBoundingClientRect();return{x:e.clientX-r.left,y:Math.max(14,Math.min(H-14,e.clientY-r.top))}}
 var lastDragBeat=0;
 mon.addEventListener('pointerdown',function(e){ptr=pt(e);beat(1.3);try{mon.setPointerCapture(e.pointerId)}catch(_){}});
 mon.addEventListener('pointermove',function(e){if(!ptr)return;ptr=pt(e);var n=performance.now();if(n-lastDragBeat>420){beat(1.15);lastDragBeat=n}});
 ['pointerup','pointercancel','pointerleave'].forEach(function(ev){mon.addEventListener(ev,function(){ptr=null;nextBeat=.5})});
 new IntersectionObserver(function(es){visible=es[0].isIntersecting}).observe(mon);
 window.addEventListener('resize',size);size();
 if(RM){for(var x=0;x<W;x++){ys[x]=H*.62-wave((x%140)/140*.8)*H*.52}cx=W;shown=72;bpmEl&&(bpmEl.textContent=72);ctx.clearRect(0,0,W,H);ctx.beginPath();ctx.moveTo(0,ys[0]);for(var i=1;i<W;i++)ctx.lineTo(i,ys[i]);ctx.strokeStyle='#5fd4dc';ctx.lineWidth=2;ctx.stroke()}
 else requestAnimationFrame(frame);
}

/* contadores */
function fmt(row,p){var d=row.dataset,v=parseFloat(d.v),dec=parseInt(d.dec||0,10),x=v*p;var s=dec?x.toFixed(dec).replace('.',','):Math.round(x);return (d.pre||'')+s+(d.suf?'<b>'+d.suf+'</b>':'')}
function count(row){var el=$('.v',row);if(RM){el.innerHTML=fmt(row,1);return}var t0=performance.now(),D=1700;(function tick(n){var p=Math.min(1,(n-t0)/D),e=p===1?1:1-Math.pow(2,-10*p);el.innerHTML=fmt(row,e);if(p<1)requestAnimationFrame(tick)})(t0)}
$$('.nrow').forEach(function(row){
 var o=new IntersectionObserver(function(es){if(es[0].isIntersecting){count(row);o.disconnect()}},{threshold:.5});o.observe(row);
 var path=$('svg.ec path',row);if(path){path.style.setProperty('--len',Math.ceil(path.getTotalLength?path.getTotalLength():900))}
 row.addEventListener('click',function(){row.classList.remove('beat');void row.offsetWidth;row.classList.add('beat');count(row);var p=$('svg.ec path',row);if(p){p.style.animation='none';void p.getBoundingClientRect();p.style.animation='draw 1.6s var(--ease) forwards'}})});

/* orbita */
var orb=$('#orb');
if(orb){
 var nodes=$$('.n',orb),cards=$$('#pcard article'),dots=$$('#pdots i'),cur=-1,timer;
 function show(i){cur=(i+nodes.length)%nodes.length;nodes.forEach(function(n,k){n.classList.toggle('on',k===cur)});cards.forEach(function(c,k){c.classList.toggle('on',k===cur)});dots.forEach(function(d,k){d.classList.remove('on');if(k===cur){void d.offsetWidth;d.classList.add('on')}});clearTimeout(timer);timer=setTimeout(function(){show(cur+1)},4200)}
 nodes.forEach(function(n,k){$('button',n).addEventListener('click',function(){show(k)})});
 dots.forEach(function(d,k){d.addEventListener('click',function(){show(k)})});
 var oo=new IntersectionObserver(function(es){if(es[0].isIntersecting){if(cur<0)show(0)}else{clearTimeout(timer);cur=cur<0?-1:cur-0;if(cur>=0){timer=null}}},{threshold:.25});
 oo.observe(orb);
 var oo2=new IntersectionObserver(function(es){if(es[0].isIntersecting&&cur>=0&&!timer){show(cur)}},{threshold:.25});oo2.observe(orb);
 if(RM){show(0);clearTimeout(timer)}
}

/* portas: inclinacao com o ponteiro */
$$('.door').forEach(function(d){var im=$('img',d);
 d.addEventListener('pointermove',function(e){if(e.pointerType==='touch')return;var r=d.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;im.style.transform='scale(1.08) translate('+(-x*18)+'px,'+(-y*14)+'px)'});
 d.addEventListener('pointerleave',function(){im.style.transform=''})});

/* video institucional */
var vid=$('#vid');
if(vid){var play=$('.play',vid);play.addEventListener('click',function(){var v=document.createElement('video');v.src=vid.dataset.src;v.controls=true;v.playsInline=true;v.autoplay=true;v.setAttribute('aria-label','Vídeo institucional Medsafe 2024');vid.appendChild(v);vid.classList.add('on');v.play&&v.play().catch(function(){})})}

/* vidas: matriz de pontos; os 4 numeros se destacam um por vez, devagar */
var cvv=$('#vidas');
if(cvv){
 var sec=cvv.parentNode,cc=cvv.getContext('2d'),dp=Math.min(2,window.devicePixelRatio||1),GAP=30,pts=[],W2=0,H2=0,prog=0,waves=[],vis=false,lastBeat=-9999,hi=-1,rowsN=$$('.nrow',sec),beatsN=0;
 function build(){var r=sec.getBoundingClientRect();W2=r.width;H2=r.height;cvv.width=W2*dp;cvv.height=H2*dp;cc.setTransform(dp,0,0,dp,0,0);pts=[];
  for(var y=GAP/2;y<H2;y+=GAP)for(var x=GAP/2;x<W2;x+=GAP)pts.push({x:x,y:y,o:Math.random(),w:Math.random()*6.28,or:Math.random()<.1})}
 function focusRow(i,ts){hi=i;rowsN.forEach(function(r,k){r.classList.remove('hl');if(k===i){void r.offsetWidth;r.classList.add('hl')}});var rr=rowsN[i].getBoundingClientRect(),sr=sec.getBoundingClientRect();waves.push({t:ts,x:rr.left-sr.left+Math.min(rr.width,420)*.35,y:rr.top-sr.top+rr.height*.35});lastBeat=ts}
 function draw(ts){
  if(!vis)return;
  requestAnimationFrame(draw);
  if(ts-lastBeat>3000){focusRow((hi+1)%rowsN.length,ts)}
  cc.clearRect(0,0,W2,H2);
  waves=waves.filter(function(w){return ts-w.t<3600});
  for(var i=0;i<pts.length;i++){var d=pts[i],lit=d.o<prog*.5,a=.045,r=1.3,boost=0;
   for(var k=0;k<waves.length;k++){var w=waves[k],rad=(ts-w.t)*.3,dx=d.x-w.x,dy=d.y-w.y,dist=Math.abs(Math.sqrt(dx*dx+dy*dy)-rad);if(dist<150){boost=Math.max(boost,(1-dist/150)*(1-(ts-w.t)/3600))}}
   if(lit){a=.13+.07*Math.sin(ts/1400+d.w)}
   a=Math.min(.6,a+boost*.34);r=r+boost*1.7+(lit?.35:0);
   cc.fillStyle=d.or&&lit?'rgba(237,169,96,'+a+')':'rgba(95,212,220,'+a+')';cc.beginPath();cc.arc(d.x,d.y,r,0,6.283);cc.fill()}
 }
 function still(){prog=1;build();cc.clearRect(0,0,W2,H2);pts.forEach(function(d){var lit=d.o<.5;cc.fillStyle=lit?'rgba(95,212,220,.16)':'rgba(95,212,220,.05)';cc.beginPath();cc.arc(d.x,d.y,lit?1.6:1.3,0,6.283);cc.fill()})}
 function grow(){var s=performance.now();(function f(n){var p=Math.min(1,(n-s)/3200);prog=1-Math.pow(1-p,3);if(p<1)requestAnimationFrame(f)})(s)}
 new IntersectionObserver(function(es){var v=es[0].isIntersecting;if(v&&!vis){vis=true;if(RM){still()}else{if(!pts.length)build();requestAnimationFrame(draw)}}else if(!v){vis=false}},{threshold:.05}).observe(sec);
 window.addEventListener('resize',function(){if(pts.length)build()});
 var started=false;rowsN.forEach(function(row,k){new IntersectionObserver(function(es){if(es[0].isIntersecting&&!started){started=true;if(!RM)grow()}},{threshold:.4}).observe(row);
  row.addEventListener('click',function(){focusRow(k,performance.now())})});
}

/* sanfona de casos */
var acc=$('#acc');
if(acc){
 var strips=$$('.strip',acc),ci=0,sound=false,accVis=false;
 function vidOf(s){return $('video',s)}
 function sndOf(s){return $('.snd',s)}
 function paint(){strips.forEach(function(s){var b=sndOf(s),v=vidOf(s),on=sound&&s.classList.contains('on');b.classList.toggle('live',on);$('em',b).textContent=on?'Som ativo':'Ativar som';b.setAttribute('aria-label',on?'Desativar som':'Ativar som');v.muted=!on})}
 function loadS(s){var v=vidOf(s);if(!v.getAttribute('src')){v.src=v.dataset.src}return v}
 function playS(s){var v=loadS(s);v.muted=!sound;var p=v.play();if(p&&p.then){p.then(function(){v.classList.add('live')}).catch(function(){if(!v.muted){sound=false;paint();v.muted=true;v.play().then(function(){v.classList.add('live')}).catch(function(){})}})}}
 function openAt(i,byUser){if(i===ci&&!byUser)return;if(i===ci)return;
  var p=strips[ci];p.classList.remove('on');p.setAttribute('aria-expanded','false');var pv=vidOf(p);pv.pause();pv.classList.remove('live');
  ci=i;var s=strips[i];s.classList.add('on');s.setAttribute('aria-expanded','true');paint();playS(s)}
 strips.forEach(function(s,i){
  s.addEventListener('click',function(e){if($('.snd',s).contains(e.target))return;openAt(i,true)});
  s.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){if(e.target===s){e.preventDefault();openAt(i,true)}}});
  var b=sndOf(s);function tog(e){e.stopPropagation();e.preventDefault();sound=!sound;paint();if(sound){var v=vidOf(s);v.muted=false;v.play().catch(function(){})}}
  b.addEventListener('click',tog);b.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' ')tog(e)})});
 loadS(strips[0]);paint();
 new IntersectionObserver(function(es){accVis=es[0].isIntersecting;var s=strips[ci],v=vidOf(s);if(accVis){if(!RM)playS(s)}else{v.pause()}},{threshold:.35}).observe(acc);
}
})();
/* casos de / sucesso: mesma largura */
(function(){var h=document.querySelector('.cases .chd h2');if(!h)return;var em=h.querySelector('em');if(!em)return;
function fit(){em.style.fontSize='';var sp=Array.prototype.slice.call(h.querySelectorAll('span')).filter(function(s){return !em.contains(s)&&s.children.length===0});if(!sp.length)return;
var l=1e9,r=0;sp.forEach(function(s){var b=s.getBoundingClientRect();l=Math.min(l,b.left);r=Math.max(r,b.right)});var w1=r-l;
var es=Array.prototype.slice.call(em.querySelectorAll('span'));if(!es.length)es=[em];var l2=1e9,r2=0;es.forEach(function(s){var b=s.getBoundingClientRect();l2=Math.min(l2,b.left);r2=Math.max(r2,b.right)});var w2=r2-l2;if(!w2||!w1)return;
var fs=parseFloat(getComputedStyle(em).fontSize);em.style.fontSize=(fs*w1/w2).toFixed(2)+'px'}
function go(){fit();requestAnimationFrame(fit)}
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(go);window.addEventListener('load',go);window.addEventListener('resize',go);go()})();
