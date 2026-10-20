var sections=[
{id:"about",t:"Про гру",i:"ℹ️"},
{id:"meters",t:"Вимірювачі",i:"📟",children:[
{id:"potuzhnometr",t:"Потужнометр",i:"💪"},
{id:"zradometr",t:"Зрадометр",i:"🐍"},
{id:"mangometr",t:"Мангометр",i:"🥭"},
{id:"bigbob",t:"Ааа орєшкі біг боб",i:"🥜"},
{id:"nakhriukometr",t:"Нахрюкометр",i:"🐷"},
{id:"zrada-peremoha",t:"Зрада/Перемога",i:"⚖️"},
{id:"custom",t:"Кастомний Вимірювач",i:"🎛️"}
]},
{id:"factories",t:"Фабрики Потужності",i:"🏭"},
{id:"geo",t:"Геопотужність",i:"🌍"},
{id:"dog",t:"Потужний Пес",i:"🐕"},
{id:"shake",t:"Потужнотряс",i:"📳"},
{id:"daily",t:"Щоденні Квести",i:"📅"},
{id:"guides",t:"Гайди",i:"💡"}
];
var soon="Тут буде інформація пізніше…";
var view=document.getElementById("view");
var colors=["#34c759","#a6d608","#ffcc00","#ff9500","#ff3b30"];

function esc(s){return s.replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}

function find(path){
var list=sections,node=null,trail=[];
for(var k=0;k<path.length;k++){
node=null;
for(var j=0;j<list.length;j++){if(list[j].id===path[k]){node=list[j];break}}
if(!node)return null;
trail.push(node);
list=node.children||[];
}
return trail;
}

function href(trail){return "#/s/"+trail.map(function(n){return n.id}).join("/")}

function item(n,base,sub){
return '<a class="item" href="'+base+n.id+'"><span class="ic">'+n.i+'</span><span class="t">'+esc(n.t)+(sub?'<small>'+esc(sub)+'</small>':'')+'</span><span class="ch">›</span></a>';
}

function head(title,small){
return '<header class="head"><img src="logo.png" alt="Логотип Потужнометр"><h1>'+esc(title)+(small?'<small>'+esc(small)+'</small>':'')+'</h1></header>';
}

function home(){
var scale=colors.map(function(c){return '<i style="background:'+c+'"></i>'}).join("");
var tiles=sections.map(function(n){
return '<a class="tile glass" href="#/s/'+n.id+'"><span class="ic">'+n.i+'</span><b>'+esc(n.t)+'</b><span>'+(n.children?n.children.length+' вкладок':'Скоро')+'</span></a>';
}).join("");
return head("Потужнометр","Вікі гри")+
'<section class="hero glass"><img src="logo.png" alt=""><div><h2>Ласкаво просимо</h2><p>'+soon+'</p><div class="scale">'+scale+'</div></div></section>'+
'<p class="label">Розділи</p><div class="grid">'+tiles+'</div><button class="egg" id="egg" aria-label="Пасхалка">🥚</button>';
}

function sectionsPage(){
return head("Розділи")+'<div class="list glass">'+sections.map(function(n){return item(n,"#/s/",n.children?n.children.length+" вкладок":null)}).join("")+'</div>';
}

function page(trail){
var n=trail[trail.length-1];
var up=trail.length>1?href(trail.slice(0,-1)):"#/sections";
var upName=trail.length>1?trail[trail.length-2].t:"Розділи";
var out='<a class="back glass" href="'+up+'">‹ '+esc(upName)+'</a>'+
'<header class="head"><h1>'+n.i+' '+esc(n.t)+'</h1></header>'+
'<section class="card glass"><p>'+soon+'</p><div class="sk" style="width:92%"></div><div class="sk" style="width:80%"></div><div class="sk" style="width:86%"></div><div class="sk" style="width:44%"></div></section>';
if(n.children){
out+='<p class="label">Вкладки</p><div class="list glass">'+n.children.map(function(c){return item(c,href(trail)+"/")}).join("")+'</div>';
}
return out;
}

function flat(){
var all=[];
sections.forEach(function(s){
all.push({n:s,h:"#/s/"+s.id,p:""});
(s.children||[]).forEach(function(c){all.push({n:c,h:"#/s/"+s.id+"/"+c.id,p:s.t})});
});
return all;
}

function searchPage(){
view.innerHTML=head("Пошук")+
'<label class="find glass">🔍<input id="q" type="search" placeholder="Пошук по вікі" autocomplete="off" aria-label="Пошук"></label><div id="res"></div>';
var q=document.getElementById("q"),res=document.getElementById("res");
function run(){
var v=q.value.trim().toLowerCase();
var hits=flat().filter(function(x){return !v||x.n.t.toLowerCase().indexOf(v)>-1});
res.innerHTML=hits.length?'<div class="list glass">'+hits.map(function(x){return item(x.n,x.h.replace(x.n.id,"")+"",x.p)}).join("")+'</div>':'<p class="empty">Нічого не знайдено</p>';
}
q.addEventListener("input",run);
run();
q.focus();
}

function openEgg(){
var m=document.createElement("div");
m.className="modal";
m.innerHTML='<div class="box glass"><img src="cat-egg.webp" alt="Кіт у яйці"><b>Пасхалку знайдено!</b><span>Торкніться, щоб закрити</span></div>';
function close(){m.remove();document.removeEventListener("keydown",key)}
function key(e){if(e.key==="Escape")close()}
m.addEventListener("click",close);
document.addEventListener("keydown",key);
document.body.appendChild(m);
}

function route(){
var h=location.hash.replace(/^#\/?/,"");
var parts=h.split("/").filter(Boolean);
var tab="home";
if(parts[0]==="search"){tab="search";searchPage()}
else if(parts[0]==="sections"){tab="sections";view.innerHTML=sectionsPage()}
else if(parts[0]==="s"){
var trail=find(parts.slice(1));
tab="sections";
view.innerHTML=trail?page(trail):home();
}
else{view.innerHTML=home()}
var egg=document.getElementById("egg");
if(egg)egg.addEventListener("click",openEgg);
document.querySelectorAll(".dock a").forEach(function(a){a.classList.toggle("on",a.dataset.tab===tab)});
window.scrollTo(0,0);
}

window.addEventListener("hashchange",route);
route();
