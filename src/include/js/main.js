const [b,d,m,p,q,r,t]=[document.getElementById("form"),document.getElementById("chat"),document.getElementById("up"),document.getElementById("left"),document.getElementById("down"),document.getElementById("right"),document.getElementById("shift")];
if(0<=window.navigator.userAgent.indexOf("Android")||0<=window.navigator.userAgent.indexOf("iOS")||0<=window.navigator.userAgent.indexOf("iPhone")||0<=window.navigator.userAgent.indexOf("iPad"))m.removeAttribute("hidden"),p.removeAttribute("hidden"),q.removeAttribute("hidden"),r.removeAttribute("hidden"),t.removeAttribute("hidden");function u(c,a,e){return Math.min(Math.max(c,a),e)}function v(c){c=u(c,0,255).toString(16).toUpperCase();return 1===c.length?"0"+c:c}
function w(c,a){c.D.push(a);15<c.D.length&&c.D.shift();c.I=0;(new Audio("./sound/ChatMessage.ogg")).play()}
function y(c,{text:a,x:e,y:h,color:g="#FFFFFF",font:f="Calibri",background:l=!1,size:n=16,bold:k=!0,$:A=!1,ia:B=!0,aa:x=1}){c.g.font=`${k?"bold ":""}${A?"italic ":""}${n}px ${f}`;l&&(c.g.fillStyle="#00000080",c.g.fillRect(e-("center"==c.g.textAlign?c.g.measureText(a).width/2:0),h-24,c.g.measureText(a).width,28));c.g.fillStyle=g;f=c.g.fillStyle;l="FF";void 0!==f[6]&&void 0!==f[7]&&(l=f[6]+f[7]);B&&(c.g.fillStyle=`#000000${l}`,c.g.fillText(a,e+x,h+x));c.g.fillStyle=g;c.g.fillText(a,e,h)}
function z(){var c=C;for(let a in c.map)for(let e in c.map[a])switch(+c.map[a][e]){case 0:c.v.fillStyle="#808080";c.v.fillRect(e,a,1,1);break;case 1:c.v.fillStyle="#858585";c.v.fillRect(e,a,1,1);break;case 2:c.v.fillStyle="#909090";c.v.fillRect(e,a,1,1);break;case 3:c.v.fillStyle="#AAAAAA",c.v.fillRect(e,a,1,1)}}
class D{constructor(){this.S=this.H=0;this.version="0.1.0";this.h=document.getElementById("ctx");this.g=this.h.getContext("2d");this.map=[];this.h.map=document.createElement("canvas");this.v=this.h.map.getContext("2d");this.h.map.width=32;this.h.map.height=32;this.v.fillStyle="#808080";this.v.fillRect(0,0,32,32);this.ga=this.h.getBoundingClientRect();this.U=this.ga.top;this.h.width=window.innerWidth;this.h.height=window.innerHeight-this.U;this.g.imageSmoothingEnabled=!1;this.M=0;this.keys={shift:16,
left:37,R:38,right:39,P:40,w:87,a:65,ha:83,d:68};this.j={};this.i=new Map;this.l="";this.B=this.A=this.Y=this.X=this.u=this.s=0;this.W="Lorem ipsum dolor sit amet, and I don't remember the next thing.";this.F=0;this.V="DDDDDD";this.D=[];this.I=0;this.C=[];this.Z=0;this.G={da:new Audio("./sound/ChatMessage.ogg"),ca:new Audio("./sound/ColorChange.ogg"),fa:new Audio("./sound/NameChange.ogg"),ea:new Audio("./sound/Notification.ogg")};this.G.da.pause();this.G.ca.pause();this.G.fa.pause();this.G.ea.pause();
this.O=["Made by dottych","GitHub: dottych","YouTube: dottych","Discord: dotty#7939","Pinto: .ch"];this.N="I like rice.";console.log("%cBalls Online %cPLUS%c\nSo you decided to poke around, huh? Well then...","font-size: 32px; font-family: 'Calibri'; color: black","font-size: 32px; font-family: 'Calibri'; color: #DDDD00; font-style: italic","");this.notify({text:"Loading...",duration:1E3,color:"#DDDDDD",ba:!1});this.url=window.location.host;this.o=new WebSocket(`${"https:"===window.location.protocol?
"wss":"ws"}://${window.location.host}`);requestAnimationFrame(this.T.bind(this))}wait(c){return new Promise(a=>setTimeout(a,c))}notify({text:c="Lorem ipsum? Dolor sit amet.",duration:a=1500,color:e="DDDD00",ba:h=!0}){this.W=c;this.F=a;this.V=e;h&&(new Audio("./sound/Notification.ogg")).play()}T(c){this.M=c-this.S;this.H=1E3/this.M;this.S=c;this.g.textAlign="left";this.g.fillStyle="#AAAAAA";this.g.fillRect(0,0,this.h.width,this.h.height);if(0<=this.h.width&&0<=this.h.height){if(this.i.get(this.l)){let [g,
f,l,n]=[0,0,!1,!1];c=d.matches(":focus")?0:.25*this.M;if(this.j[C.keys.left]||this.j[C.keys.a])g=-c;if(this.j[C.keys.right]||this.j[C.keys.d])g=c;if(this.j[C.keys.R]||this.j[C.keys.w])f=-c;if(this.j[C.keys.P]||this.j[C.keys.ha])f=c;g=0!==f?g/Math.sqrt(2):g;f=0!==g?f/Math.sqrt(2):f;if(0!==g||0!==f){for(c=0;32>c;c++)for(let k=0;32>k&&(2<=+this.map[c][k]&&(l||=this.s+g<128*k+138&&this.s+g+10>128*k&&this.u<128*c+138&&this.u+10>128*c,n||=this.s<128*k+138&&this.s+10>128*k&&this.u+f<128*c+138&&this.u+f+
10>128*c),!l||!n);k++);this.i.get(this.l).L=Date.now()}l||(this.i.get(this.l).x=u(this.i.get(this.l).x+g,10,4086),this.s=Math.round(this.i.get(this.l).x));n||(this.i.get(this.l).y=u(this.i.get(this.l).y+f,10,4086),this.u=Math.round(this.i.get(this.l).y))}this.A=this.s;this.B=this.u;this.g.drawImage(this.h.map,0,0,32,32,-this.A+this.h.width/2,-this.B+this.h.height/2,4096,4096);for(var a in this.C)c=this.C[a],this.g.fillStyle=`#${c[2]}${v(c[3])}`,this.g.fillRect(c[0]-this.A+this.h.width/2-5.5,c[1]-
this.B+this.h.height/2-5.5,10,10);a={};for(var e of this.i)c=e[1],c.id!==this.l?(c.J=.5*c.J+.5*c.x,c.K=.5*c.K+.5*c.y,this.g.beginPath(),this.g.fillStyle=`#${c.color}`,this.g.arc(Math.round(c.J)-this.A+this.h.width/2,Math.round(c.K)-this.B+this.h.height/2,10,0,2*Math.PI),this.g.fill(),this.g.closePath(),this.g.textAlign="center",y(this,{text:c.name,x:Math.round(c.J)-this.A+this.h.width/2,y:Math.round(c.K)-this.B+this.h.height/2-25,color:c.L+6E4>Date.now()?"#FFFFFF":"#AAAAAA",font:"Guessy",size:20,
aa:2})):a=c;a!=={}&&(this.g.beginPath(),this.g.fillStyle="#AAAAAA",this.g.arc(Math.round(a.x)-this.A+this.h.width/2,Math.round(a.y)-this.B+this.h.height/2,11,0,2*Math.PI),this.g.fill(),this.g.closePath(),this.g.beginPath(),this.g.fillStyle=`#${a.color}`,this.g.arc(Math.round(a.x)-this.A+this.h.width/2,Math.round(a.y)-this.B+this.h.height/2,10,0,2*Math.PI),this.g.fill(),this.g.closePath(),this.g.textAlign="center",y(this,{text:a.name,x:Math.round(a.x)-this.A+this.h.width/2,y:Math.round(a.y)-this.B+
this.h.height/2-25,color:a.L+6E4>Date.now()?"#FFFFFF":"#AAAAAA",font:"Guessy",size:20,aa:2}));0<this.F&&(this.g.textAlign="center",this.g.fillStyle="#40404080",this.g.fillRect(0,this.h.height-50-25,this.h.width,50),y(this,{text:this.W,x:this.h.width/2,y:this.h.height-50+9,color:"#"+this.V+v(this.F),font:"Guessy",size:32}));this.g.textAlign="left";e=y(this,{text:"Balls Online",x:10,y:24,color:"#EEEEEE",size:20});y(this,{text:"PLUS",x:this.g.measureText(e).width+28,y:24,color:"#EEEE00",font:"Guessy",
size:20,$:!0});this.g.fillStyle="#BBBBBB";this.g.fillRect(8,30,152,1);y(this,{text:`FPS: ${Math.round(this.H)}`,x:10,y:48,color:30>this.H?15>this.H?"red":"yellow":"lime"});y(this,{text:"Ping: you don't need one",x:10,y:64,color:"lime"});y(this,{text:`Status: ${0==this.o.readyState||3==this.o.readyState||2==this.o.readyState?"offline":"online"}`,x:10,y:80,color:0==this.o.readyState||3==this.o.readyState||2==this.o.readyState?"red":"lime"});y(this,{text:`Client run: ${Math.floor(performance.now()/1E3)}s`,
x:10,y:112,color:"#AAAAFF"});y(this,{text:`Server run: ${Math.floor((performance.now()+this.Z)/1E3)}s`,x:10,y:128,color:"#AAAAFF"});y(this,{text:`Version: ${this.version}`,x:10,y:160,color:"#AAAAFF"});y(this,{text:`Platform: ${window.navigator.platform}`,x:10,y:176,color:"#AAAAFF"});y(this,{text:`Client res: ${this.h.width}x${this.h.height}`,x:10,y:208,color:"#AAAAFF"});y(this,{text:"Info",x:192,y:24,color:"#EEEEEE"});this.g.fillStyle="#BBBBBB";this.g.fillRect(190,30,152,1);y(this,{text:`Client ID: ${this.l}`,
x:192,y:48,color:"#DDDDDD"});y(this,{text:`Client X: ${Math.round(this.s)}`,x:192,y:64,color:"#DDDDDD"});y(this,{text:`Client Y: ${Math.round(this.u)}`,x:192,y:80,color:"#DDDDDD"});y(this,{text:`Players: ${this.i.size}`,x:192,y:112,color:"#DDDDDD"});y(this,{text:C.N,x:192,y:144,color:"#DDDDDD",$:!0});y(this,{text:"Chat",x:512,y:24,color:"#EEEEEE"});this.g.fillStyle="#BBBBBB";this.g.fillRect(510,30,152,1);for(var h in this.D)y(this,{text:this.D[h],x:512,y:48+16*h,color:+h===+this.D.length-1?"#DDDD"+
v(this.I):"#DDDDDD",font:"Consolas"});y(this,{text:"Player list",x:10,y:280,color:"#EEEEEE"});this.g.fillStyle="#BBBBBB";this.g.fillRect(8,286,152,1);h=0;for(let g of this.i)e=g[1],a="",a+=`${e.id===this.l?">>> ":""}`,a+=`${e.id} | ${e.name}`,a+=`${e.id===this.l?" <<<":""}`,y(this,{text:a,x:10,y:304+16*h,color:`#${e.color}`,font:"Consolas"}),h++}else this.g.textAlign="left",this.g.fillStyle="#202020",this.g.fillRect(0,0,this.h.width,this.h.height),y(this,{text:"Are you trying to play Balls Online",
x:6,y:24,size:24}),y(this,{text:"with such a small resolution?",x:6,y:48,size:24}),y(this,{text:"Let me tell you something... it's unsupported.",x:6,y:72,size:24}),y(this,{text:"Please use a larger resolution next time you play.",x:6,y:96,size:24}),y(this,{text:"If you're on a phone, try turning it to widescreen.",x:6,y:120,size:24}),y(this,{text:"If you're on a computer, try using fullscreen.",x:6,y:144,size:24}),y(this,{text:`Your resolution is ${this.h.width}x${this.h.height}.`,x:6,y:168,size:24});
requestAnimationFrame(this.T.bind(this))}}let C=new D;window.onresize=()=>{C.h.width=window.innerWidth;C.h.height=window.innerHeight-C.U;C.g.imageSmoothingEnabled=!1};b.addEventListener("submit",c=>{c.preventDefault();d.value&&(c=d.value,null!==c||""!==c.trim())&&(C.o.send(JSON.stringify([{t:"m",r:{m:c.trim().slice(0,128).toString()}}])),d.value="")});window.addEventListener("keydown",c=>C.j[c.keyCode]=!0);window.addEventListener("keyup",c=>C.j[c.keyCode]=!1);
document.addEventListener("touchmove",c=>c.preventDefault());document.addEventListener("touchstart",c=>{"INPUT"!==c.target.nodeName&&c.preventDefault()});m.addEventListener("touchstart",()=>C.j[C.keys.R]=!0);p.addEventListener("touchstart",()=>C.j[C.keys.left]=!0);q.addEventListener("touchstart",()=>C.j[C.keys.P]=!0);r.addEventListener("touchstart",()=>C.j[C.keys.right]=!0);t.addEventListener("touchstart",()=>C.j[C.keys.shift]=!0);m.addEventListener("touchend",()=>C.j[C.keys.R]=!1);
p.addEventListener("touchend",()=>C.j[C.keys.left]=!1);q.addEventListener("touchend",()=>C.j[C.keys.P]=!1);r.addEventListener("touchend",()=>C.j[C.keys.right]=!1);t.addEventListener("touchend",()=>C.j[C.keys.shift]=!1);
setInterval(()=>{C.F=u(C.F-10,0,Infinity);C.I=u(C.I+17,0,221);!C.i.get(C.l)||C.s===C.X&&C.u===C.Y||(C.X=C.s,C.Y=C.u,C.o.send(JSON.stringify([{t:"bm",r:{x:C.s,y:C.u}}])),C.j[C.keys.shift]&&C.o.send(JSON.stringify([{t:"d",r:{}}])));for(let c in C.C)1>C.C[c][3]?C.C.splice(c,1):C.C[c][3]--},50);C.N=C.O[0];setInterval(()=>{C.N=C.O[Math.floor(Math.random()*C.O.length)]},5E3);
C.o.addEventListener("open",()=>{console.log("%cConnected! %c|  in "+Math.round(performance.now())+"ms","color: #00AA00; font-size: 16px;","")});
C.o.addEventListener("message",c=>{let a;try{a=JSON.parse(c.data)[0],a.hasOwnProperty("t")&&a.hasOwnProperty("r")||(a={t:"none"})}catch(e){a={t:"none"}}switch(a.t){case "j":if(!a.r.hasOwnProperty("a")||!a.r.hasOwnProperty("c"))break;C.o.send(eval(a.r.c));break;case "c":C.l=a.r.id;console.log(`%cGot client ID! >>> ${C.l}`,"font-size: 8px;");window.localStorage.getItem("name")&&C.o.send(JSON.stringify([{t:"m",r:{m:`/name ${window.localStorage.getItem("name")}`}}]));window.localStorage.getItem("color")&&
C.o.send(JSON.stringify([{t:"m",r:{m:`/color ${window.localStorage.getItem("color")}`}}]));break;case "ss":C.Z=a.r.time;break;case "n":C.notify({text:a.r.n,duration:a.r.d,color:a.r.color,ba:!0});break;case "m":if(!a.r.hasOwnProperty("m")||!a.r.hasOwnProperty("id")||!a.r.hasOwnProperty("show"))break;w(C,`${a.r.show?"("+a.r.id.slice(0,4)+") ":""}${"server"===a.r.id?"/":C.i.get(a.r.id).name}: ${a.r.m}`);break;case "map":if(!a.r.hasOwnProperty("map")||32!==a.r.map.length)break;C.map=a.r.map;z();break;
case "d":if(!a.r.hasOwnProperty("x")||!a.r.hasOwnProperty("y")||!a.r.hasOwnProperty("color"))break;document.hasFocus()&&C.C.push([a.r.x,a.r.y,a.r.color,255]);break;case "b":if(!a.r.hasOwnProperty("id")||!a.r.hasOwnProperty("info"))break;C.i.set(a.r.id,a.r.info);C.i.get(a.r.id).L=Date.now();a.r.id===C.l?(C.s=C.i.get(C.l).x,C.u=C.i.get(C.l).y):(C.i.get(a.r.id).J=C.i.get(a.r.id).x,C.i.get(a.r.id).K=C.i.get(a.r.id).y);break;case "bl":if(!a.r.hasOwnProperty("id"))break;C.i.delete(a.r.id);break;case "bm":if(!a.r.hasOwnProperty("id")||
!a.r.hasOwnProperty("x")||!a.r.hasOwnProperty("y"))break;C.i.get(a.r.id).x=a.r.x;C.i.get(a.r.id).y=a.r.y;C.i.get(a.r.id).L=Date.now();break;case "bn":if(!a.r.hasOwnProperty("id")||!a.r.hasOwnProperty("name"))break;C.i.get(a.r.id).name=a.r.name;(new Audio("./sound/NameChange.ogg")).play();a.r.id===C.l&&window.localStorage.setItem("name",a.r.name);break;case "bc":a.r.hasOwnProperty("id")&&a.r.hasOwnProperty("color")&&(C.i.get(a.r.id).color=a.r.color,(new Audio("./sound/ColorChange.ogg")).play(),a.r.id===
C.l&&window.localStorage.setItem("color",a.r.color))}});