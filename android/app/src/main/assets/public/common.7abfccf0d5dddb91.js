"use strict";(self.webpackChunkapp=self.webpackChunkapp||[]).push([[2076],{86579:(P,h,s)=>{s.d(h,{c:()=>o});var g=s(94363),e=s(84081),l=s(10405);const o=(n,i)=>{let t,r;const f=(c,w,y)=>{if(typeof document>"u")return;const E=document.elementFromPoint(c,w);E&&i(E)?E!==t&&(a(),_(E,y)):a()},_=(c,w)=>{t=c,r||(r=t);const y=t;(0,g.w)(()=>y.classList.add("ion-activated")),w()},a=(c=!1)=>{if(!t)return;const w=t;(0,g.w)(()=>w.classList.remove("ion-activated")),c&&r!==t&&t.click(),t=void 0};return(0,l.createGesture)({el:n,gestureName:"buttonActiveDrag",threshold:0,onStart:c=>f(c.currentX,c.currentY,e.a),onMove:c=>f(c.currentX,c.currentY,e.b),onEnd:()=>{a(!0),(0,e.h)(),r=void 0}})}},78438:(P,h,s)=>{s.d(h,{g:()=>e});var g=s(28476);const e=()=>{if(void 0!==g.w)return g.w.Capacitor}},95572:(P,h,s)=>{s.d(h,{c:()=>g,i:()=>e});const g=(l,o,n)=>"function"==typeof n?n(l,o):"string"==typeof n?l[n]===o[n]:Array.isArray(o)?o.includes(l):l===o,e=(l,o,n)=>void 0!==l&&(Array.isArray(l)?l.some(i=>g(i,o,n)):g(l,o,n))},63351:(P,h,s)=>{s.d(h,{g:()=>g});const g=(i,t,r,f,_)=>l(i[1],t[1],r[1],f[1],_).map(a=>e(i[0],t[0],r[0],f[0],a)),e=(i,t,r,f,_)=>_*(3*t*Math.pow(_-1,2)+_*(-3*r*_+3*r+f*_))-i*Math.pow(_-1,3),l=(i,t,r,f,_)=>n((f-=_)-3*(r-=_)+3*(t-=_)-(i-=_),3*r-6*t+3*i,3*t-3*i,i).filter(c=>c>=0&&c<=1),n=(i,t,r,f)=>{if(0===i)return((i,t,r)=>{const f=t*t-4*i*r;return f<0?[]:[(-t+Math.sqrt(f))/(2*i),(-t-Math.sqrt(f))/(2*i)]})(t,r,f);const _=(3*(r/=i)-(t/=i)*t)/3,a=(2*t*t*t-9*t*r+27*(f/=i))/27;if(0===_)return[Math.pow(-a,1/3)];if(0===a)return[Math.sqrt(-_),-Math.sqrt(-_)];const c=Math.pow(a/2,2)+Math.pow(_/3,3);if(0===c)return[Math.pow(a/2,.5)-t/3];if(c>0)return[Math.pow(-a/2+Math.sqrt(c),1/3)-Math.pow(a/2+Math.sqrt(c),1/3)-t/3];const w=Math.sqrt(Math.pow(-_/3,3)),y=Math.acos(-a/(2*Math.sqrt(Math.pow(-_/3,3)))),E=2*Math.pow(w,1/3);return[E*Math.cos(y/3)-t/3,E*Math.cos((y+2*Math.PI)/3)-t/3,E*Math.cos((y+4*Math.PI)/3)-t/3]}},25083:(P,h,s)=>{s.d(h,{i:()=>g});const g=e=>e&&""!==e.dir?"rtl"===e.dir.toLowerCase():"rtl"===(null==document?void 0:document.dir.toLowerCase())},13126:(P,h,s)=>{s.r(h),s.d(h,{startFocusVisible:()=>o});const g="ion-focused",l=["Tab","ArrowDown","Space","Escape"," ","Shift","Enter","ArrowLeft","ArrowRight","ArrowUp","Home","End"],o=n=>{let i=[],t=!0;const r=n?n.shadowRoot:document,f=n||document.body,_=b=>{i.forEach(u=>u.classList.remove(g)),b.forEach(u=>u.classList.add(g)),i=b},a=()=>{t=!1,_([])},c=b=>{t=l.includes(b.key),t||_([])},w=b=>{if(t&&void 0!==b.composedPath){const u=b.composedPath().filter(d=>!!d.classList&&d.classList.contains("ion-focusable"));_(u)}},y=()=>{r.activeElement===f&&_([])};return r.addEventListener("keydown",c),r.addEventListener("focusin",w),r.addEventListener("focusout",y),r.addEventListener("touchstart",a,{passive:!0}),r.addEventListener("mousedown",a),{destroy:()=>{r.removeEventListener("keydown",c),r.removeEventListener("focusin",w),r.removeEventListener("focusout",y),r.removeEventListener("touchstart",a),r.removeEventListener("mousedown",a)},setFocus:_}}},8281:(P,h,s)=>{s.d(h,{c:()=>e});var g=s(85638);const e=i=>{const t=i;let r;return{hasLegacyControl:()=>{if(void 0===r){const _=void 0!==t.label||l(t),a=t.hasAttribute("aria-label")||t.hasAttribute("aria-labelledby")&&null===t.shadowRoot,c=(0,g.h)(t);r=!0===t.legacy||!_&&!a&&null!==c}return r}}},l=i=>!!(o.includes(i.tagName)&&null!==i.querySelector('[slot="label"]')||n.includes(i.tagName)&&""!==i.textContent),o=["ION-INPUT","ION-TEXTAREA","ION-SELECT","ION-RANGE"],n=["ION-TOGGLE","ION-CHECKBOX","ION-RADIO"]},84081:(P,h,s)=>{s.d(h,{I:()=>e,a:()=>t,b:()=>r,c:()=>i,d:()=>_,h:()=>f});var g=s(78438),e=function(a){return a.Heavy="HEAVY",a.Medium="MEDIUM",a.Light="LIGHT",a}(e||{});const o={getEngine(){const a=window.TapticEngine;if(a)return a;const c=(0,g.g)();return null!=c&&c.isPluginAvailable("Haptics")?c.Plugins.Haptics:void 0},available(){if(!this.getEngine())return!1;const c=(0,g.g)();return"web"!==(null==c?void 0:c.getPlatform())||typeof navigator<"u"&&void 0!==navigator.vibrate},isCordova:()=>void 0!==window.TapticEngine,isCapacitor:()=>void 0!==(0,g.g)(),impact(a){const c=this.getEngine();if(!c)return;const w=this.isCapacitor()?a.style:a.style.toLowerCase();c.impact({style:w})},notification(a){const c=this.getEngine();if(!c)return;const w=this.isCapacitor()?a.type:a.type.toLowerCase();c.notification({type:w})},selection(){const a=this.isCapacitor()?e.Light:"light";this.impact({style:a})},selectionStart(){const a=this.getEngine();a&&(this.isCapacitor()?a.selectionStart():a.gestureSelectionStart())},selectionChanged(){const a=this.getEngine();a&&(this.isCapacitor()?a.selectionChanged():a.gestureSelectionChanged())},selectionEnd(){const a=this.getEngine();a&&(this.isCapacitor()?a.selectionEnd():a.gestureSelectionEnd())}},n=()=>o.available(),i=()=>{n()&&o.selection()},t=()=>{n()&&o.selectionStart()},r=()=>{n()&&o.selectionChanged()},f=()=>{n()&&o.selectionEnd()},_=a=>{n()&&o.impact(a)}},22885:(P,h,s)=>{s.d(h,{I:()=>i,a:()=>_,b:()=>n,c:()=>w,d:()=>E,f:()=>a,g:()=>f,i:()=>r,p:()=>y,r:()=>b,s:()=>c});var g=s(10467),e=s(85638),l=s(74929);const n="ion-content",i=".ion-content-scroll-host",t=`${n}, ${i}`,r=u=>"ION-CONTENT"===u.tagName,f=function(){var u=(0,g.A)(function*(d){return r(d)?(yield new Promise(v=>(0,e.c)(d,v)),d.getScrollElement()):d});return function(v){return u.apply(this,arguments)}}(),_=u=>u.querySelector(i)||u.querySelector(t),a=u=>u.closest(t),c=(u,d)=>r(u)?u.scrollToTop(d):Promise.resolve(u.scrollTo({top:0,left:0,behavior:d>0?"smooth":"auto"})),w=(u,d,v,p)=>r(u)?u.scrollByPoint(d,v,p):Promise.resolve(u.scrollBy({top:v,left:d,behavior:p>0?"smooth":"auto"})),y=u=>(0,l.b)(u,n),E=u=>{if(r(u)){const v=u.scrollY;return u.scrollY=!1,v}return u.style.setProperty("overflow","hidden"),!0},b=(u,d)=>{r(u)?u.scrollY=d:u.style.removeProperty("overflow")}},36726:(P,h,s)=>{s.d(h,{a:()=>g,b:()=>w,c:()=>t,d:()=>y,e:()=>O,f:()=>i,g:()=>E,h:()=>l,i:()=>e,j:()=>p,k:()=>M,l:()=>r,m:()=>a,n:()=>b,o:()=>_,p:()=>n,q:()=>o,r:()=>v,s:()=>m,t:()=>c,u:()=>u,v:()=>d,w:()=>f});const g="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path stroke-linecap='square' stroke-miterlimit='10' stroke-width='48' d='M244 400L100 256l144-144M120 256h292' class='ionicon-fill-none'/></svg>",e="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='48' d='M112 268l144 144 144-144M256 392V100' class='ionicon-fill-none'/></svg>",l="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path d='M368 64L144 256l224 192V64z'/></svg>",o="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path d='M64 144l192 224 192-224H64z'/></svg>",n="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path d='M448 368L256 144 64 368h384z'/></svg>",i="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path stroke-linecap='round' stroke-linejoin='round' d='M416 128L192 384l-96-96' class='ionicon-fill-none ionicon-stroke-width'/></svg>",t="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='48' d='M328 112L184 256l144 144' class='ionicon-fill-none'/></svg>",r="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='48' d='M112 184l144 144 144-144' class='ionicon-fill-none'/></svg>",f="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path d='M136 208l120-104 120 104M136 304l120 104 120-104' stroke-width='48' stroke-linecap='round' stroke-linejoin='round' class='ionicon-fill-none'/></svg>",_="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='48' d='M184 112l144 144-144 144' class='ionicon-fill-none'/></svg>",a="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='48' d='M184 112l144 144-144 144' class='ionicon-fill-none'/></svg>",c="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path d='M289.94 256l95-95A24 24 0 00351 127l-95 95-95-95a24 24 0 00-34 34l95 95-95 95a24 24 0 1034 34l95-95 95 95a24 24 0 0034-34z'/></svg>",w="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path d='M256 48C141.31 48 48 141.31 48 256s93.31 208 208 208 208-93.31 208-208S370.69 48 256 48zm75.31 260.69a16 16 0 11-22.62 22.62L256 278.63l-52.69 52.68a16 16 0 01-22.62-22.62L233.37 256l-52.68-52.69a16 16 0 0122.62-22.62L256 233.37l52.69-52.68a16 16 0 0122.62 22.62L278.63 256z'/></svg>",y="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path d='M400 145.49L366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49z'/></svg>",E="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><circle cx='256' cy='256' r='192' stroke-linecap='round' stroke-linejoin='round' class='ionicon-fill-none ionicon-stroke-width'/></svg>",b="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><circle cx='256' cy='256' r='48'/><circle cx='416' cy='256' r='48'/><circle cx='96' cy='256' r='48'/></svg>",u="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path stroke-linecap='round' stroke-miterlimit='10' d='M80 160h352M80 256h352M80 352h352' class='ionicon-fill-none ionicon-stroke-width'/></svg>",d="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path d='M64 384h384v-42.67H64zm0-106.67h384v-42.66H64zM64 128v42.67h384V128z'/></svg>",v="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path stroke-linecap='round' stroke-linejoin='round' d='M400 256H112' class='ionicon-fill-none ionicon-stroke-width'/></svg>",p="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path stroke-linecap='round' stroke-linejoin='round' d='M96 256h320M96 176h320M96 336h320' class='ionicon-fill-none ionicon-stroke-width'/></svg>",M="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path stroke-linecap='square' stroke-linejoin='round' stroke-width='44' d='M118 304h276M118 208h276' class='ionicon-fill-none'/></svg>",m="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path d='M221.09 64a157.09 157.09 0 10157.09 157.09A157.1 157.1 0 00221.09 64z' stroke-miterlimit='10' class='ionicon-fill-none ionicon-stroke-width'/><path stroke-linecap='round' stroke-miterlimit='10' d='M338.29 338.29L448 448' class='ionicon-fill-none ionicon-stroke-width'/></svg>",O="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><path d='M464 428L339.92 303.9a160.48 160.48 0 0030.72-94.58C370.64 120.37 298.27 48 209.32 48S48 120.37 48 209.32s72.37 161.32 161.32 161.32a160.48 160.48 0 0094.58-30.72L428 464zM209.32 319.69a110.38 110.38 0 11110.37-110.37 110.5 110.5 0 01-110.37 110.37z'/></svg>"},30275:(P,h,s)=>{s.d(h,{c:()=>o,g:()=>n});var g=s(28476),e=s(85638),l=s(74929);const o=(t,r,f)=>{let _,a;if(void 0!==g.w&&"MutationObserver"in g.w){const E=Array.isArray(r)?r:[r];_=new MutationObserver(b=>{for(const u of b)for(const d of u.addedNodes)if(d.nodeType===Node.ELEMENT_NODE&&E.includes(d.slot))return f(),void(0,e.r)(()=>c(d))}),_.observe(t,{childList:!0})}const c=E=>{var b;a&&(a.disconnect(),a=void 0),a=new MutationObserver(u=>{f();for(const d of u)for(const v of d.removedNodes)v.nodeType===Node.ELEMENT_NODE&&v.slot===r&&y()}),a.observe(null!==(b=E.parentElement)&&void 0!==b?b:E,{subtree:!0,childList:!0})},y=()=>{a&&(a.disconnect(),a=void 0)};return{destroy:()=>{_&&(_.disconnect(),_=void 0),y()}}},n=(t,r,f)=>{const _=null==t?0:t.toString().length,a=i(_,r);if(void 0===f)return a;try{return f(_,r)}catch(c){return(0,l.a)("Exception in provided `counterFormatter`.",c),a}},i=(t,r)=>`${t} / ${r}`},31622:(P,h,s)=>{s.r(h),s.d(h,{KEYBOARD_DID_CLOSE:()=>n,KEYBOARD_DID_OPEN:()=>o,copyVisualViewport:()=>M,keyboardDidClose:()=>u,keyboardDidOpen:()=>E,keyboardDidResize:()=>b,resetKeyboardAssist:()=>_,setKeyboardClose:()=>y,setKeyboardOpen:()=>w,startKeyboardAssist:()=>a,trackViewportChanges:()=>p});var g=s(94379);s(78438),s(28476);const o="ionKeyboardDidShow",n="ionKeyboardDidHide";let t={},r={},f=!1;const _=()=>{t={},r={},f=!1},a=m=>{if(g.K.getEngine())c(m);else{if(!m.visualViewport)return;r=M(m.visualViewport),m.visualViewport.onresize=()=>{p(m),E()||b(m)?w(m):u(m)&&y(m)}}},c=m=>{m.addEventListener("keyboardDidShow",O=>w(m,O)),m.addEventListener("keyboardDidHide",()=>y(m))},w=(m,O)=>{d(m,O),f=!0},y=m=>{v(m),f=!1},E=()=>!f&&t.width===r.width&&(t.height-r.height)*r.scale>150,b=m=>f&&!u(m),u=m=>f&&r.height===m.innerHeight,d=(m,O)=>{const D=new CustomEvent(o,{detail:{keyboardHeight:O?O.keyboardHeight:m.innerHeight-r.height}});m.dispatchEvent(D)},v=m=>{const O=new CustomEvent(n);m.dispatchEvent(O)},p=m=>{t=Object.assign({},r),r=M(m.visualViewport)},M=m=>({width:Math.round(m.width),height:Math.round(m.height),offsetTop:m.offsetTop,offsetLeft:m.offsetLeft,pageTop:m.pageTop,pageLeft:m.pageLeft,scale:m.scale})},94379:(P,h,s)=>{s.d(h,{K:()=>o,a:()=>l});var g=s(78438),e=function(n){return n.Unimplemented="UNIMPLEMENTED",n.Unavailable="UNAVAILABLE",n}(e||{}),l=function(n){return n.Body="body",n.Ionic="ionic",n.Native="native",n.None="none",n}(l||{});const o={getEngine(){const n=(0,g.g)();if(null!=n&&n.isPluginAvailable("Keyboard"))return n.Plugins.Keyboard},getResizeMode(){const n=this.getEngine();return null!=n&&n.getResizeMode?n.getResizeMode().catch(i=>{if(i.code!==e.Unimplemented)throw i}):Promise.resolve(void 0)}}},64731:(P,h,s)=>{s.d(h,{c:()=>i});var g=s(10467),e=s(28476),l=s(94379);const o=t=>{if(void 0===e.d||t===l.a.None||void 0===t)return null;const r=e.d.querySelector("ion-app");return null!=r?r:e.d.body},n=t=>{const r=o(t);return null===r?0:r.clientHeight},i=function(){var t=(0,g.A)(function*(r){let f,_,a,c;const w=function(){var d=(0,g.A)(function*(){const v=yield l.K.getResizeMode(),p=void 0===v?void 0:v.mode;f=()=>{void 0===c&&(c=n(p)),a=!0,y(a,p)},_=()=>{a=!1,y(a,p)},null==e.w||e.w.addEventListener("keyboardWillShow",f),null==e.w||e.w.addEventListener("keyboardWillHide",_)});return function(){return d.apply(this,arguments)}}(),y=(d,v)=>{r&&r(d,E(v))},E=d=>{if(0===c||c===n(d))return;const v=o(d);return null!==v?new Promise(p=>{const m=new ResizeObserver(()=>{v.clientHeight===c&&(m.disconnect(),p())});m.observe(v)}):void 0};return yield w(),{init:w,destroy:()=>{null==e.w||e.w.removeEventListener("keyboardWillShow",f),null==e.w||e.w.removeEventListener("keyboardWillHide",_),f=_=void 0},isKeyboardVisible:()=>a}});return function(f){return t.apply(this,arguments)}}()},67838:(P,h,s)=>{s.d(h,{c:()=>e});var g=s(10467);const e=()=>{let l;return{lock:function(){var n=(0,g.A)(function*(){const i=l;let t;return l=new Promise(r=>t=r),void 0!==i&&(yield i),t});return function(){return n.apply(this,arguments)}}()}}},52172:(P,h,s)=>{s.d(h,{c:()=>l});var g=s(28476),e=s(85638);const l=(o,n,i)=>{let t;const r=()=>!(void 0===n()||void 0!==o.label||null===i()),_=()=>{const c=n();if(void 0===c)return;if(!r())return void c.style.removeProperty("width");const w=i().scrollWidth;if(0===w&&null===c.offsetParent&&void 0!==g.w&&"IntersectionObserver"in g.w){if(void 0!==t)return;const y=t=new IntersectionObserver(E=>{1===E[0].intersectionRatio&&(_(),y.disconnect(),t=void 0)},{threshold:.01,root:o});y.observe(c)}else c.style.setProperty("width",.75*w+"px")};return{calculateNotchWidth:()=>{r()&&(0,e.r)(()=>{_()})},destroy:()=>{t&&(t.disconnect(),t=void 0)}}}},37895:(P,h,s)=>{s.d(h,{S:()=>e});const e={bubbles:{dur:1e3,circles:9,fn:(l,o,n)=>{const i=l*o/n-l+"ms",t=2*Math.PI*o/n;return{r:5,style:{top:32*Math.sin(t)+"%",left:32*Math.cos(t)+"%","animation-delay":i}}}},circles:{dur:1e3,circles:8,fn:(l,o,n)=>{const i=o/n,t=l*i-l+"ms",r=2*Math.PI*i;return{r:5,style:{top:32*Math.sin(r)+"%",left:32*Math.cos(r)+"%","animation-delay":t}}}},circular:{dur:1400,elmDuration:!0,circles:1,fn:()=>({r:20,cx:48,cy:48,fill:"none",viewBox:"24 24 48 48",transform:"translate(0,0)",style:{}})},crescent:{dur:750,circles:1,fn:()=>({r:26,style:{}})},dots:{dur:750,circles:3,fn:(l,o)=>({r:6,style:{left:32-32*o+"%","animation-delay":-110*o+"ms"}})},lines:{dur:1e3,lines:8,fn:(l,o,n)=>({y1:14,y2:26,style:{transform:`rotate(${360/n*o+(o<n/2?180:-180)}deg)`,"animation-delay":l*o/n-l+"ms"}})},"lines-small":{dur:1e3,lines:8,fn:(l,o,n)=>({y1:12,y2:20,style:{transform:`rotate(${360/n*o+(o<n/2?180:-180)}deg)`,"animation-delay":l*o/n-l+"ms"}})},"lines-sharp":{dur:1e3,lines:12,fn:(l,o,n)=>({y1:17,y2:29,style:{transform:`rotate(${30*o+(o<6?180:-180)}deg)`,"animation-delay":l*o/n-l+"ms"}})},"lines-sharp-small":{dur:1e3,lines:12,fn:(l,o,n)=>({y1:12,y2:20,style:{transform:`rotate(${30*o+(o<6?180:-180)}deg)`,"animation-delay":l*o/n-l+"ms"}})}}},46492:(P,h,s)=>{s.r(h),s.d(h,{createSwipeBackGesture:()=>n});var g=s(85638),e=s(25083),l=s(10405);s(18221);const n=(i,t,r,f,_)=>{const a=i.ownerDocument.defaultView;let c=(0,e.i)(i);const y=v=>c?-v.deltaX:v.deltaX;return(0,l.createGesture)({el:i,gestureName:"goback-swipe",gesturePriority:101,threshold:10,canStart:v=>(c=(0,e.i)(i),(v=>{const{startX:M}=v;return c?M>=a.innerWidth-50:M<=50})(v)&&t()),onStart:r,onMove:v=>{const M=y(v)/a.innerWidth;f(M)},onEnd:v=>{const p=y(v),M=a.innerWidth,m=p/M,O=(v=>c?-v.velocityX:v.velocityX)(v),D=O>=0&&(O>.2||p>M/2),T=(D?1-m:m)*M;let I=0;if(T>5){const L=T/Math.abs(O);I=Math.min(L,540)}_(D,m<=0?.01:(0,g.l)(0,m,.9999),I)}})}},2935:(P,h,s)=>{s.d(h,{w:()=>g});const g=(o,n,i)=>{if(typeof MutationObserver>"u")return;const t=new MutationObserver(r=>{i(e(r,n))});return t.observe(o,{childList:!0,subtree:!0}),t},e=(o,n)=>{let i;return o.forEach(t=>{for(let r=0;r<t.addedNodes.length;r++)i=l(t.addedNodes[r],n)||i}),i},l=(o,n)=>{if(1!==o.nodeType)return;const i=o;return(i.tagName===n.toUpperCase()?[i]:Array.from(i.querySelectorAll(n))).find(r=>r.value===i.value)}},8953:(P,h,s)=>{s.r(h),s.d(h,{PasswordRecoveryPage:()=>b,otpType:()=>E});var g=s(10467),e=s(54438),l=s(60177),o=s(89417),n=s(61494),i=s(35933),t=s(16817),r=s(13903),f=s(21626),_=s(60248),a=s(51197);function c(u,d){1&u&&(e.j41(0,"div"),e.EFF(1),e.nI1(2,"translate"),e.k0s()),2&u&&(e.R7$(),e.SpI(" ",e.bMT(2,1,"login.label.email_required")," "))}function w(u,d){1&u&&(e.j41(0,"div"),e.EFF(1),e.nI1(2,"translate"),e.k0s()),2&u&&(e.R7$(),e.SpI(" ",e.bMT(2,1,"login.label.email_invalid")," "))}function y(u,d){if(1&u&&(e.j41(0,"div",16),e.DNE(1,c,3,3,"div",17)(2,w,3,3,"div",17),e.k0s()),2&u){const v=e.XpG();e.R7$(),e.Y8G("ngIf",null==v._email?null:v._email.errors.required),e.R7$(),e.Y8G("ngIf",null==v._email?null:v._email.errors.email)}}const E={newPassword:"new-password"};let b=(()=>{var u;class d{constructor(){this.navController=(0,e.WQX)(n.q9),this.commonService=(0,e.WQX)(_.hf),this.authService=(0,e.WQX)(_.uR),this.router=(0,e.WQX)(t.Ix),this.translate=(0,e.WQX)(r.c$),this.fb=(0,e.WQX)(o.ok),this.resetFormGroup=this.fb.group({email:[this.email,[o.k0.required,o.k0.email]]})}get _email(){return this.resetFormGroup.get("email")}ngOnInit(){}goBack(){this.navController.back()}sendEmail(){var p=this;return(0,g.A)(function*(){if(p.resetFormGroup.valid){yield p.commonService.showLoader();try{var M;p.authService.requestOtp(null===(M=p._email)||void 0===M?void 0:M.value,E.newPassword).then(m=>{var O;p.commonService.hideLoader(),m?(localStorage.setItem("resetpass-email",null===(O=p._email)||void 0===O?void 0:O.value),p.navController.navigateForward("password-recovery-mail-sended")):p.commonService.alertModal("","El email introducido no tiene una cuenta activa en SouncCollect. Puedes acceder como invitado o crear una nueva cuenta.")}).catch(m=>{var O;console.log(null==m||null===(O=m.errors)||void 0===O?void 0:O.message),p.commonService.hideLoader(),p.commonService.alertModal("","Ha ocurrido un error, por favor intente m\xe1s tarde.")}).finally(()=>p.commonService.hideLoader())}catch(m){console.log(m)}}else p.commonService.alertModal("","Debe ingresar un correo electr\xf3nico v\xe1lido.")})()}}return(u=d).\u0275fac=function(p){return new(p||u)},u.\u0275cmp=e.VBU({type:u,selectors:[["app-password-recovery"]],standalone:!0,features:[e.Jv_([f.Qq,_.uR,a.h]),e.aNF],decls:27,vars:15,consts:[[1,"ion-no-border"],["color","ligth",1,"ion-no-margin","ion-no-padding","ion-no-border"],[1,"flex","items-center","justify-between","px-3"],[1,"H2-22-700","self-start","my-text-header"],["tappable","true","src","assets/images/SoundCollect/Iconos/close.svg","alt","back","width","24",1,"mt-1",3,"click"],[3,"fullscreen"],[1,"flex","flex-col","px-3"],["id","resetFormGroup",1,"mt-5","flex","flex-col","justify-between","p-3",3,"ngSubmit","formGroup"],[1,"mb-8"],[1,"H-16-400","my-text-header"],["formControlName","email","type","email","name","email","placeholder","user@email.com",1,"input","ps-3"],["class","validation-msg-error",4,"ngIf"],[1,"ion-no-border","px-3","pt-2"],[1,"flex","w-full","flex-col","justify-evenly","gap-3"],["form","resetFormGroup","type","submit",1,"my-btn-login","mx-auto"],[1,"ion-text-nowrap"],[1,"validation-msg-error"],[4,"ngIf"]],template:function(p,M){1&p&&(e.j41(0,"ion-header",0)(1,"ion-toolbar",1)(2,"div",2)(3,"ion-text",3),e.EFF(4),e.nI1(5,"translate"),e.k0s(),e.j41(6,"img",4),e.bIt("click",function(){return M.goBack()}),e.k0s()()()(),e.j41(7,"ion-content",5)(8,"div",6)(9,"form",7),e.bIt("ngSubmit",function(){return M.sendEmail()}),e.j41(10,"div")(11,"div",8)(12,"label",9),e.EFF(13),e.nI1(14,"translate"),e.k0s()(),e.j41(15,"label",9),e.EFF(16),e.nI1(17,"translate"),e.k0s(),e.nrm(18,"input",10),e.DNE(19,y,3,2,"div",11),e.k0s()()()(),e.j41(20,"ion-footer",0)(21,"div",12)(22,"div",13)(23,"button",14)(24,"ion-text",15),e.EFF(25),e.nI1(26,"translate"),e.k0s()()()()()),2&p&&(e.R7$(4),e.SpI(" ",e.bMT(5,7,"recovery_pass.label.title")," "),e.R7$(3),e.Y8G("fullscreen",!0),e.R7$(2),e.Y8G("formGroup",M.resetFormGroup),e.R7$(4),e.SpI(" ",e.bMT(14,9,"recovery_pass.label.hint")," "),e.R7$(3),e.JRh(e.bMT(17,11,"recovery_pass.label.email")),e.R7$(3),e.Y8G("ngIf",(null==M._email?null:M._email.invalid)&&((null==M._email?null:M._email.dirty)||(null==M._email?null:M._email.touched))),e.R7$(6),e.SpI(" ",e.bMT(26,13,"recovery_pass.btn.btn-recovery")," "))},dependencies:[i.bv,i.W9,i.M0,i.eU,i.IO,i.ai,l.MD,l.bT,o.YN,o.qT,o.me,o.BC,o.cb,r.h,r.D9,o.X1,o.j4,o.JD]}),d})()},33683:(P,h,s)=>{s.r(h),s.d(h,{EditProfilePage:()=>y});var g=s(10467),e=s(54438),l=s(60177),o=s(89417),n=s(35933),i=s(61494),t=s(13903),r=s(4286),f=s(51197),_=s(21626),a=s(3191),c=s(44796);function w(E,b){if(1&E&&(e.j41(0,"option",32),e.EFF(1),e.k0s()),2&E){const u=b.$implicit;e.Y8G("value",u),e.R7$(),e.SpI(" ",u," ")}}let y=(()=>{var E;class b{constructor(){this.translate=(0,e.WQX)(t.c$),this.modalController=(0,e.WQX)(n.W3),this.navController=(0,e.WQX)(i.q9),this.myNumbers=[1900],this.gender_="",this.birth_year_=1900,this.email="";for(let d=1901;d<=2008;d++)this.myNumbers.push(d);this.profileForm=new o.gE({gender:new o.MJ(this.gender_),birth_year:new o.MJ(this.birth_year_)})}ngOnInit(){var d=this;return(0,g.A)(function*(){var v,p;console.log(d.data),null===(v=d.gender)||void 0===v||v.setValue(d.data.gender),null===(p=d.birth_year)||void 0===p||p.setValue(d.data.birth_year),d.email=d.data.email})()}get gender(){return this.profileForm.get("gender")}get birth_year(){return this.profileForm.get("birth_year")}sendProfileForm(){var d=this;return(0,g.A)(function*(){var v,p;const M={gender:null===(v=d.gender)||void 0===v?void 0:v.value,birthYear:null===(p=d.birth_year)||void 0===p?void 0:p.value};yield d.modalController.dismiss(M)})()}goBack(){this.modalController.dismiss()}goToDeleteAccount(){this.modalController.dismiss(),this.navController.navigateForward("/delete-account")}}return(E=b).\u0275fac=function(d){return new(d||E)},E.\u0275cmp=e.VBU({type:E,selectors:[["app-edit-profile"]],inputs:{data:"data"},standalone:!0,features:[e.Jv_([_.Qq,c.u,f.h,r.D,a.q]),e.aNF],decls:62,vars:46,consts:[[1,"ion-no-border"],["color","ligth",1,"ion-no-margin","ion-no-padding","ion-no-border","bg-white"],[1,"flex","items-center","justify-between","p-3"],[1,"H2-22-700","self-start","my-text-header"],["tappable","true","src","assets/images/SoundCollect/Iconos/close.svg","alt","back","width","24",1,"mt-1",3,"click"],[3,"fullscreen"],[1,"flex","flex-col","px-3"],[1,"flex","gap-3","flex-col"],[1,"mt-5","flex","flex-col","justify-content-between","p-3",3,"formGroup"],[1,"H-20-700","my-text-header"],[1,"gender-input","my-4"],["color","primary",1,"H6-14-400-SpaceGrotesk","font-bold"],[1,"p-0"],["lines","full",1,"p-0"],["toggleIcon","chevron-down","formControlName","gender","name","gender","aria-label","Gender","interface","popover",1,"p-0","input",2,"padding","0 0 0 18px",3,"placeholder"],["value","male"],["value","female"],["value","non-binary"],["value","others"],["value","prefer-not-to-say"],[1,"relative","mb-5"],[1,"H6-14-400-SpaceGrotesk","my-text-header"],["name","birth_year","formControlName","birth_year",1,"input","pe-5","ps-3"],["disabled","","selected",""],[3,"value",4,"ngFor","ngForOf"],[1,"relative","mb-5","block"],[1,"H6-14-400-SpaceGrotesk","my-text-header","w-full"],[1,"input","pe-5","ps-3","w-full",2,"width","100% !important"],[1,"flex","w-full","flex-col","justify-evenly","gap-3","mt-32","p-4"],[1,"my-btn-login","mx-auto",3,"click"],[1,"ion-text-nowrap"],[1,"my-btn-login","mx-auto","mt-5",2,"background-color","#d02424",3,"click"],[3,"value"]],template:function(d,v){1&d&&(e.j41(0,"ion-header",0)(1,"ion-toolbar",1)(2,"div",2)(3,"ion-text",3),e.EFF(4),e.nI1(5,"translate"),e.k0s(),e.j41(6,"img",4),e.bIt("click",function(){return v.goBack()}),e.k0s()()()(),e.j41(7,"ion-content",5)(8,"div",6)(9,"section",7)(10,"form",8)(11,"label",9),e.EFF(12),e.nI1(13,"translate"),e.k0s(),e.j41(14,"div",10)(15,"ion-text",11),e.EFF(16),e.nI1(17,"translate"),e.k0s(),e.j41(18,"ion-list",12)(19,"ion-item",13)(20,"ion-select",14),e.nI1(21,"translate"),e.j41(22,"ion-select-option",15),e.EFF(23),e.nI1(24,"translate"),e.k0s(),e.j41(25,"ion-select-option",16),e.EFF(26),e.nI1(27,"translate"),e.k0s(),e.j41(28,"ion-select-option",17),e.EFF(29),e.nI1(30,"translate"),e.k0s(),e.j41(31,"ion-select-option",18),e.EFF(32),e.nI1(33,"translate"),e.k0s(),e.j41(34,"ion-select-option",19),e.EFF(35),e.nI1(36,"translate"),e.k0s()()()()(),e.j41(37,"div",20)(38,"label",21),e.EFF(39),e.nI1(40,"translate"),e.k0s(),e.j41(41,"select",22)(42,"option",23),e.EFF(43),e.nI1(44,"translate"),e.k0s(),e.DNE(45,w,2,2,"option",24),e.k0s()(),e.j41(46,"div",25)(47,"label",26),e.EFF(48),e.nI1(49,"translate"),e.k0s(),e.j41(50,"div",27),e.EFF(51),e.k0s()()()()()(),e.j41(52,"ion-footer",0)(53,"div",28)(54,"button",29),e.bIt("click",function(){return v.sendProfileForm()}),e.j41(55,"ion-text",30),e.EFF(56),e.nI1(57,"translate"),e.k0s()(),e.j41(58,"button",31),e.bIt("click",function(){return v.goToDeleteAccount()}),e.j41(59,"ion-text",30),e.EFF(60),e.nI1(61,"translate"),e.k0s()()()()),2&d&&(e.R7$(4),e.SpI(" ",e.bMT(5,18,"profile.label.edit_profile_title")," "),e.R7$(3),e.Y8G("fullscreen",!0),e.R7$(3),e.Y8G("formGroup",v.profileForm),e.R7$(2),e.JRh(e.bMT(13,20,"register.label.optional_data")),e.R7$(4),e.SpI("",e.bMT(17,22,"about_me.label.gender"),":"),e.R7$(4),e.FS9("placeholder",e.bMT(21,24,"about_me.label.gender")),e.R7$(3),e.JRh(e.bMT(24,26,"profile.label.male")),e.R7$(3),e.JRh(e.bMT(27,28,"profile.label.female")),e.R7$(3),e.JRh(e.bMT(30,30,"profile.label.non-binary")),e.R7$(3),e.JRh(e.bMT(33,32,"profile.label.others")),e.R7$(3),e.JRh(e.bMT(36,34,"profile.label.prefer-not-to-say")),e.R7$(4),e.JRh(e.bMT(40,36,"register.label.birth_year")),e.R7$(4),e.SpI(" ",e.bMT(44,38,"register.label.birth_year")," "),e.R7$(2),e.Y8G("ngForOf",v.myNumbers),e.R7$(3),e.JRh(e.bMT(49,40,"recovery_pass.label.email")),e.R7$(3),e.SpI(" ",v.email," "),e.R7$(5),e.JRh(e.bMT(57,42,"profile.label.button_save")),e.R7$(4),e.JRh(e.bMT(61,44,"profile.label.delete_account")))},dependencies:[n.bv,n.W9,n.M0,n.eU,n.uz,n.nf,n.Nm,n.Ip,n.IO,n.ai,n.Je,l.MD,l.Sq,o.X1,o.qT,o.xH,o.y7,o.wz,o.BC,o.cb,o.j4,o.JD,o.YN,t.h,t.D9],styles:[".gender-input[_ngcontent-%COMP%]   ion-item[_ngcontent-%COMP%]{--padding-start: 0px !important;--padding-end: 0px !important;--padding-top: 0px !important;--padding-bottom: 0px !important;--inner-padding-end: 0px !important;--inner-padding-start: 0px !important}.mt-32[_ngcontent-%COMP%]{margin-top:32vh!important}"]}),b})()},11864:(P,h,s)=>{s.d(h,{u:()=>e});var g=s(54438);let e=(()=>{var l;class o{constructor(){}}return(l=o).\u0275fac=function(i){return new(i||l)},l.\u0275prov=g.jDH({token:l,factory:l.\u0275fac,providedIn:"root"}),o})()},76449:(P,h,s)=>{s.d(h,{S:()=>g});class g{static matchPassword(l){var o,n,f,r;if((null===(o=l.get("password"))||void 0===o?void 0:o.value)===(null===(n=l.get("cpassword"))||void 0===n?void 0:n.value))return null===(f=l.get("cpassword"))||void 0===f||f.setErrors(null),null;null===(r=l.get("cpassword"))||void 0===r||r.setErrors({confirmPassword:!0})}}},56536:(P,h,s)=>{s.d(h,{g:()=>g});class g{static strong(l){let o=/\d/.test(l.value),n=/[A-Z]/.test(l.value),i=/[a-z]/.test(l.value);return o&&n&&i?null:{strong:!0}}}}}]);