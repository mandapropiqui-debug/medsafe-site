(function(){'use strict';var RM=window.matchMedia('(prefers-reduced-motion: reduce)').matches,$=function(s,c){return (c||document).querySelector(s)},$$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};
/* hero pulso */
var tp=$('.tpl'),td=$('.tdot');if(tp&&td&&!RM){var L=tp.getTotalLength(),t0=performance.now();(function f(n){var p=((n-t0)/4200)%1,pt=tp.getPointAtLength(L*p);td.setAttribute('cx',pt.x);td.setAttribute('cy',pt.y);requestAnimationFrame(f)})(t0)}
/* caminho */
var sec=$('.t-trail'),pp=$('#tp'),pf=$('#tpf'),amb=$('#amb');
if(sec&&pp){var Lp=pp.getTotalLength(),sts=$$('.tst'),dts=$$('.td'),pts=$('#tpts'),NS='http://www.w3.org/2000/svg',fr=[0,.34,.68,1];
 pf.style.strokeDasharray=Lp;pf.style.strokeDashoffset=Lp;
 fr.forEach(function(f,k){var p=pp.getPointAtLength(Lp*f),c=document.createElementNS(NS,'circle');c.setAttribute('cx',p.x);c.setAttribute('cy',p.y);c.setAttribute('r',9);c.setAttribute('class','pt');pts.appendChild(c)});
 var cur=-1,tgt=0,shown=0;
 function setK(k){if(k===cur)return;cur=k;sts.forEach(function(s,i){s.classList.toggle('on',i===k);s.classList.toggle('past',i<k)});dts.forEach(function(s,i){s.classList.toggle('on',i<=k)});$$('.pt',pts).forEach(function(c,i){c.classList.toggle('on',i<=k)})}
 function calc(){var r=sec.getBoundingClientRect(),h=sec.offsetHeight-window.innerHeight;tgt=Math.max(0,Math.min(1,-r.top/h))}
 function draw(){var p=shown,pt=pp.getPointAtLength(Lp*p),pt2=pp.getPointAtLength(Math.min(Lp,Lp*p+2)),a=Math.atan2(pt2.y-pt.y,pt2.x-pt.x)*180/Math.PI;amb.setAttribute('transform','translate('+pt.x+' '+pt.y+')');pf.style.strokeDashoffset=Lp*(1-p);setK(Math.min(3,Math.round(p*3)))}
 (function loop(){shown+=(tgt-shown)*(RM?1:.12);if(Math.abs(tgt-shown)<.0005)shown=tgt;draw();requestAnimationFrame(loop)})();
 window.addEventListener('scroll',calc,{passive:true});window.addEventListener('resize',calc);calc();
}
/* contador */
$$('.rn b').forEach(function(b){var v=+b.dataset.n,dc=+b.dataset.d||0,fmt=function(x){return x.toFixed(dc).replace('.',',')};new IntersectionObserver(function(es,o){if(!es[0].isIntersecting)return;o.disconnect();if(RM){b.textContent=fmt(v);return}var t0=performance.now();(function f(t){var p=Math.min(1,(t-t0)/1800);b.textContent=fmt(v*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(f)})(t0)},{threshold:.5}).observe(b)});
/* beneficios */
var bt=$$('.tbt .chip'),bp=$$('.tbp');bt.forEach(function(c){c.addEventListener('click',function(){bt.forEach(function(x){var on=x===c;x.classList.toggle('on',on);x.setAttribute('aria-selected',on)});bp.forEach(function(p){p.classList.toggle('on',p.dataset.b===c.dataset.b)})})});
/* demo */
var f=$('#dform'),pv=$('#dpv');if(f){function msg(){var d=new FormData(f),n=((d.get('n')||'')+' '+(d.get('s')||'')).trim(),i=(d.get('i')||'').trim(),c=(d.get('c')||'').trim(),ph=(d.get('p')||'').trim(),em=(d.get('e')||'').trim(),ms=(d.get('m')||'').trim(),L=['Olá, equipe Medsafe!'];if(n)L.push('Meu nome é '+n+'.');if(i)L.push('Instituição: '+i+'.');if(c)L.push('Cidade: '+c+'.');if(ph)L.push('Telefone: '+ph+'.');if(em)L.push('E-mail: '+em+'.');L.push('Interesse: '+d.get('t')+'.');if(ms)L.push(ms);L.push('Gostaria de agendar uma demonstração. Obrigado!');return L}
 function up(){pv.textContent=msg().join('\n')}f.addEventListener('input',up);f.addEventListener('change',up);up();
 f.addEventListener('submit',function(e){e.preventDefault();var n=f.elements.n;if(!n.value.trim()){n.focus();n.classList.add('bad');return}n.classList.remove('bad');window.open('https://wa.me/5586988839921?text='+encodeURIComponent(msg().join('\n')),'_blank','noopener')})}
})();
