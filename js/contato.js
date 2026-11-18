(function(){var f=document.getElementById('cform');if(!f)return;var pv=document.getElementById('cpv');
function msg(){var d=new FormData(f),n=(d.get('n')||'').trim(),i=(d.get('i')||'').trim(),m=(d.get('m')||'').trim(),L=['Olá, equipe Medsafe!'];if(n)L.push('Meu nome é '+n+'.');if(i)L.push('Sou de: '+i+'.');L.push('Assunto: '+d.get('a')+'.');if(m)L.push(m);L.push('Aguardo o retorno. Obrigado!');return L}
function up(){pv.textContent=msg().join('\n')}f.addEventListener('input',up);f.addEventListener('change',up);up();
f.addEventListener('submit',function(e){e.preventDefault();var n=f.elements.n;if(!n.value.trim()){n.focus();n.classList.add('bad');return}n.classList.remove('bad');window.open('https://wa.me/5586988839921?text='+encodeURIComponent(msg().join('\n')),'_blank','noopener')})})();
