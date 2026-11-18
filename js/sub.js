(function(){'use strict';var RM=window.matchMedia('(prefers-reduced-motion: reduce)').matches,$=function(s,c){return (c||document).querySelector(s)},$$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};
/* ciclo: item ativo a cada n ms, pausa ao interagir */
function cycle(items,on,ms,box){var i=0,t=null,hold=false;function go(k){i=k;items.forEach(function(x,j){on(x,j===k,j)})}function tick(){if(hold||RM)return;go((i+1)%items.length)}
 function start(){stop();t=setInterval(tick,ms)}function stop(){if(t)clearInterval(t);t=null}
 if(box&&'IntersectionObserver' in window){new IntersectionObserver(function(es){es[0].isIntersecting?start():stop()},{threshold:.3}).observe(box)}else start();
 return{go:go,hold:function(v){hold=v}}}
/* revalida: areas */
var a5=$$('#a5 .ar5');if(a5.length){var cy=cycle(a5,function(x,o){x.classList.toggle('on',o)},2200,$('#a5'));a5.forEach(function(x,k){x.addEventListener('mouseenter',function(){cy.go(k)});x.addEventListener('click',function(){cy.go(k)})});cy.go(0)}
/* revalida: estacoes */
var sb=$$('#stbl .stb'),sd=$$('#stp .std'),bar=$('#stbar');if(sb.length){var T=4200,tm=0,cur=0,raf=0,t0=0;
 function show(k){cur=k;sb.forEach(function(b,j){b.classList.toggle('on',j===k)});sd.forEach(function(d,j){d.classList.toggle('on',j===k)});t0=performance.now()}
 function loop(n){if(!RM&&!hold){var p=Math.min(1,(n-t0)/T);bar.style.width=(p*100)+'%';if(p>=1)show((cur+1)%sb.length)}raf=requestAnimationFrame(loop)}
 var hold=false;sb.forEach(function(b,k){b.addEventListener('click',function(){show(k)});b.addEventListener('mouseenter',function(){hold=true;show(k)});b.addEventListener('mouseleave',function(){hold=false;t0=performance.now()})});
 show(0);if(!RM)raf=requestAnimationFrame(loop);else bar.style.width='100%'}
/* continuada: ganhos */
var gn=$$('#gns .gn');if(gn.length){var cg=cycle(gn,function(x,o){x.classList.toggle('on',o)},2800,$('#gns'));gn.forEach(function(x,k){x.addEventListener('mouseenter',function(){cg.go(k)});x.addEventListener('click',function(){cg.go(k)})});cg.go(0)}
/* chips de filtro: cidades e cursos */
function filt(chipSel,itemSel,attr,match){var cs=$$(chipSel),is=$$(itemSel);if(!cs.length)return;cs.forEach(function(c){c.addEventListener('click',function(){cs.forEach(function(x){x.classList.toggle('on',x===c)});var f=c.dataset.c||c.dataset.f;is.forEach(function(it){it.hidden=!(f==='all'||match(it,f))})})})}
filt('#uchips .chip','#hg2 .hc2','c',function(it,f){return it.dataset.c===f});
filt('#cf .chip','#cg .cc','t',function(it,f){return (' '+it.dataset.t+' ').indexOf(' '+f+' ')>-1});
/* primeira infancia: beneficios (um aberto por vez) */
var bn=$$('#bnl .bn');bn.forEach(function(li){var b=li.querySelector('button');b.addEventListener('click',function(){var open=li.classList.contains('on');bn.forEach(function(x){x.classList.remove('on');x.firstElementChild.setAttribute('aria-expanded','false')});if(!open){li.classList.add('on');b.setAttribute('aria-expanded','true')}})});
/* eixos: pulso nos nos + contador */
var ex=$$('#ex6 .ex');if(ex.length){cycle(ex,function(x,o){x.classList.toggle('on',o)},1200,$('#ex6'))}
$$('.cn40 b').forEach(function(b){var v=+b.dataset.n;new IntersectionObserver(function(es,o){if(!es[0].isIntersecting)return;o.disconnect();if(RM){b.textContent=v;return}var t0=performance.now();(function f(t){var p=Math.min(1,(t-t0)/1600);b.textContent=Math.round(v*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(f)})(t0)},{threshold:.5}).observe(b)});
/* legais: indice que acompanha a leitura */
var lx=$$('#lxl a'),ls=$$('.ls'),lb=$('#lxbar');if(lx.length&&'IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){var k=+e.target.dataset.k;lx.forEach(function(a,j){a.classList.toggle('on',j===k)});if(lb)lb.style.width=((k+1)/ls.length*100)+'%';var a=lx[k];if(a&&a.scrollIntoView&&window.innerWidth<960){var ol=a.parentNode.parentNode;ol.scrollTo({left:a.offsetLeft-20,behavior:RM?'auto':'smooth'})}}})},{rootMargin:'-30% 0px -60% 0px'});ls.forEach(function(s){io.observe(s)})}
})();
