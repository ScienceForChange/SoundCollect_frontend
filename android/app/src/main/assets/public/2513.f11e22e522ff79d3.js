"use strict";(self.webpackChunkapp=self.webpackChunkapp||[]).push([[2513],{92513:(U,I,l)=>{l.r(I),l.d(I,{PasswordRecoveryMailSendedPage:()=>B});var p=l(10467),e=l(54438),b=l(60177),i=l(89417),P=l(61494),v=l(35933),E=l(16817),w=l(13903),M=l(21626),R=l(76449),h=l(60248),S=l(51197),T=l(8953),k=l(56536);function j(r,m){1&r&&(e.j41(0,"div"),e.EFF(1),e.nI1(2,"translate"),e.k0s()),2&r&&(e.R7$(),e.SpI(" ",e.bMT(2,1,"register.error.password_required")," "))}function F(r,m){1&r&&(e.j41(0,"div"),e.EFF(1),e.nI1(2,"translate"),e.k0s()),2&r&&(e.R7$(),e.SpI(" ",e.bMT(2,1,"register.error.password_min_length")," "))}function O(r,m){1&r&&(e.j41(0,"div"),e.EFF(1),e.nI1(2,"translate"),e.k0s()),2&r&&(e.R7$(),e.SpI(" ",e.bMT(2,1,"register.error.password_strong")," "))}function x(r,m){if(1&r&&(e.j41(0,"div",39),e.DNE(1,j,3,3,"div",40)(2,F,3,3,"div",40)(3,O,3,3,"div",40),e.k0s()),2&r){const d=e.XpG();e.R7$(),e.Y8G("ngIf",null==d.password?null:d.password.errors.required),e.R7$(),e.Y8G("ngIf",null==d.password?null:d.password.errors.minlength),e.R7$(),e.Y8G("ngIf",null==d.password?null:d.password.errors.strong)}}function D(r,m){1&r&&(e.j41(0,"div"),e.EFF(1),e.nI1(2,"translate"),e.k0s()),2&r&&(e.R7$(),e.SpI(" ",e.bMT(2,1,"change_pass.error.password_no_match")," "))}function C(r,m){if(1&r&&(e.j41(0,"div",41),e.DNE(1,D,3,3,"div",40),e.k0s()),2&r){const d=e.XpG();e.R7$(),e.Y8G("ngIf",null==d.cpassword?null:d.cpassword.errors.confirmPassword)}}let B=(()=>{var r;class m{constructor(){this.navController=(0,e.WQX)(P.q9),this.authService=(0,e.WQX)(h.uR),this.commonService=(0,e.WQX)(h.hf),this.router=(0,e.WQX)(E.Ix),this.translate=(0,e.WQX)(w.c$),this.fb=(0,e.WQX)(i.ok),this.cryptoJS=(0,e.WQX)(h.jW),this.myEye=["eye","eye"],this.myType=["password","password"],this.processing=!1,this.model={password:"",cpassword:""},this.newFormGroup=this.fb.group({password:[this.model.password,[i.k0.required,i.k0.minLength(8),k.g.strong]],cpassword:[this.model.cpassword,[i.k0.required,i.k0.minLength(8)]],code1:["",[i.k0.required]],code2:["",[i.k0.required]],code3:["",[i.k0.required]],code4:["",[i.k0.required]]},{validator:R.S.matchPassword})}ngOnInit(){var o,n;const a=null===(o=this.router.getCurrentNavigation())||void 0===o?void 0:o.extras;this.email=null===(n=a.state)||void 0===n?void 0:n.email}get password(){return this.newFormGroup.get("password")}get cpassword(){return this.newFormGroup.get("cpassword")}get _code1(){return this.newFormGroup.get("code1")}get _code2(){return this.newFormGroup.get("code2")}get _code3(){return this.newFormGroup.get("code3")}get _code4(){return this.newFormGroup.get("code4")}resendOtpEmail(){var o=this;return(0,p.A)(function*(){const n=localStorage.getItem("resetpass-email");yield o.commonService.showLoader();try{o.authService.requestOtp(n,T.otpType.newPassword).then(function(){var a=(0,p.A)(function*(t){var s;"success"===(null==t?void 0:t.status)&&(yield o.commonService.hideLoader(),o.commonService.alertModal("",null==t||null===(s=t.data)||void 0===s?void 0:s.message))});return function(t){return a.apply(this,arguments)}}()).catch(function(){var a=(0,p.A)(function*(t){var s;if("fail"===(null==t||null===(s=t.error)||void 0===s?void 0:s.status)){var c;const g=yield o.translate.instant(null==t||null===(c=t.error)||void 0===c||null===(c=c.data)||void 0===c?void 0:c.message);o.commonService.alertModal("",g)}yield o.commonService.hideLoader()});return function(t){return a.apply(this,arguments)}}()).finally(()=>o.commonService.hideLoader())}catch(a){console.log(a)}})()}changeImage(o){"eye"===this.myEye[o]?(this.myEye[o]="eye_open",this.myType[o]="test"):"eye_open"===this.myEye[o]&&(this.myEye[o]="eye",this.myType[o]="password")}setFocus(o){return(0,p.A)(function*(){o instanceof v.$w&&(yield o.setFocus())})()}submit(){var o=this;return(0,p.A)(function*(){if(o.newFormGroup.invalid)console.log(o.newFormGroup.errors),o.commonService.alertModal("Error","Debe completar todos los datos para continuar.");else{var n,a,t,s,c,g;yield o.commonService.showLoader();const G=localStorage.getItem("resetpass-email"),L=null===(n=o.password)||void 0===n?void 0:n.value,N=null===(a=o.cpassword)||void 0===a?void 0:a.value,W=`${null===(t=o._code1)||void 0===t?void 0:t.value}${null===(s=o._code2)||void 0===s?void 0:s.value}${null===(c=o._code3)||void 0===c?void 0:c.value}${null===(g=o._code4)||void 0===g?void 0:g.value}`;try{o.authService.resetPassword(G,L,N,W).then(function(){var f=(0,p.A)(function*(u){yield o.commonService.hideLoader();const y=yield o.translate.instant("global_error.label.header");if("success"===u.status){const _=yield o.translate.instant("recovery_pass.label.password_changed");o.commonService.alertModal(y,_),yield o.goTo("login")}});return function(u){return f.apply(this,arguments)}}()).catch(function(){var f=(0,p.A)(function*(u){var y;if("fail"===(null==u||null===(y=u.error)||void 0===y?void 0:y.status)){var _;const A=yield o.translate.instant(null==u||null===(_=u.error)||void 0===_||null===(_=_.data)||void 0===_?void 0:_.message);o.commonService.alertModal("Error",A)}yield o.commonService.hideLoader()});return function(u){return f.apply(this,arguments)}}())}catch(f){yield o.commonService.hideLoader(),console.error(f)}}})()}goTo(o){var n=this;return(0,p.A)(function*(){yield n.navController.navigateRoot([o],{replaceUrl:!0})})()}goBack(){this.navController.back()}}return(r=m).\u0275fac=function(o){return new(o||r)},r.\u0275cmp=e.VBU({type:r,selectors:[["app-password-recovery-mail-sended"]],standalone:!0,features:[e.Jv_([M.Qq,h.uR,S.h]),e.aNF],decls:66,vars:41,consts:[["code1",""],["code2",""],["code3",""],["code4",""],["field5",""],["color","ligth",1,"ion-no-margin","ion-no-padding","ion-no-border","bg-white"],[1,"p-3"],[1,"flex","items-center","justify-between"],[1,"H2-22-700","self-start","my-text-header"],["tappable","true","src","assets/images/SoundCollect/Iconos/close.svg","alt","back","width","24",1,"mt-1",3,"click"],[3,"fullscreen"],[1,"flex","items-center","flex-col","justify-between","w-full","h-full"],[1,"d-flex","flex-column","p-3"],[1,"H6-14-700SpaceGrotesk"],[1,"d-flex","w-100","flex-column","justify-content-between","h-100"],[1,"H6-14-400SpaceGrotesk","my-text-dark"],[3,"formGroup"],[1,"mx-auto","gap-5","mb-4","flex","justify-between","w-72"],["clearOnEdit","true","enterkeyhint","next","autofocus","true","formControlName","code1","type","number","placeholder","",1,"text-center","input","ion-no-margin","ion-no-padding",2,"background","#f3f6f5","width","66px","height","55px",3,"ionInput"],["clearOnEdit","true","enterkeyhint","next","formControlName","code2","maxlength","1","type","number","placeholder","",1,"text-center","input","ion-no-margin","ion-no-padding",2,"background","#f3f6f5","width","66px","height","55px",3,"ionInput"],["clearOnEdit","true","enterkeyhint","next","formControlName","code3","type","number","placeholder","",1,"text-center","input","ion-no-margin","ion-no-padding",2,"background","#f3f6f5","width","66px","height","55px",3,"ionInput"],["clearOnEdit","true","enterkeyhint","next","formControlName","code4","type","number","placeholder","",1,"text-center","input","ion-no-margin","ion-no-padding",2,"background","#f3f6f5","width","66px","height","55px",3,"ionInput"],[1,"ion-padding-horizontal","mt-10"],[1,"relative"],[1,"w-80"],[1,"H6-14-400-SpaceGrotesk","my-text-header","mb-5"],["formControlName","password","placeholder","Nueva contrase\xf1a","name","password",1,"input","pe-5","ps-3",3,"type"],["alt","eye",1,"absolute",2,"right","13px","top","25px","bottom","0","margin","auto",3,"click","src"],["class","validation-msg-error",4,"ngIf"],[1,"w-80","mt-4"],["formControlName","cpassword","placeholder","Repetir contrase\xf1a","name","cpassword",1,"input","pe-5","ps-3",3,"type"],["alt","eye",1,"absolute",2,"right","13px","top","0","bottom","0","margin","auto",3,"click","src"],["class","validation-msg-error mb-5",4,"ngIf"],[1,"p-3","flex","flex-col","mb-10","w-100","mt-5"],["type","button",1,"my-btn-login",3,"click","disabled"],[1,"p-3","flex","flex-col","mb-64","w-100"],[1,"flex","flex-col","p-3"],[1,"H6-14-400SpaceGrotesk","my-text-dark","mt-3"],[1,"bg-transparent","my-text-red","H6-14-400SpaceGrotesk",3,"click"],[1,"validation-msg-error"],[4,"ngIf"],[1,"validation-msg-error","mb-5"]],template:function(o,n){if(1&o){const a=e.RV6();e.j41(0,"ion-header")(1,"ion-toolbar",5)(2,"div",6)(3,"div",7)(4,"ion-text",8),e.EFF(5),e.nI1(6,"translate"),e.k0s(),e.j41(7,"img",9),e.bIt("click",function(){return e.eBV(a),e.Njj(n.goBack())}),e.k0s()()()()(),e.j41(8,"ion-content",10)(9,"div",11)(10,"div",12)(11,"ion-text",13),e.EFF(12),e.nI1(13,"translate"),e.k0s()(),e.j41(14,"div",14)(15,"div",12)(16,"ion-text",15),e.EFF(17),e.nI1(18,"translate"),e.k0s()(),e.j41(19,"form",16)(20,"div",17)(21,"ion-input",18,0),e.bIt("ionInput",function(){e.eBV(a);const s=e.sdS(24);return e.Njj(n.setFocus(s))}),e.k0s(),e.j41(23,"ion-input",19,1),e.bIt("ionInput",function(){e.eBV(a);const s=e.sdS(26);return e.Njj(n.setFocus(s))}),e.k0s(),e.j41(25,"ion-input",20,2),e.bIt("ionInput",function(){e.eBV(a);const s=e.sdS(28);return e.Njj(n.setFocus(s))}),e.k0s(),e.j41(27,"ion-input",21,3),e.bIt("ionInput",function(){e.eBV(a);const s=e.sdS(36);return e.Njj(n.setFocus(s))}),e.k0s()(),e.j41(29,"div",22)(30,"div",23)(31,"div",24)(32,"label",25),e.EFF(33),e.nI1(34,"translate"),e.k0s()(),e.nrm(35,"input",26,4),e.j41(37,"img",27),e.bIt("click",function(){return e.eBV(a),e.Njj(n.changeImage(0))}),e.k0s()(),e.DNE(38,x,4,3,"div",28),e.j41(39,"div",29)(40,"label",25),e.EFF(41),e.nI1(42,"translate"),e.k0s()(),e.j41(43,"div",23),e.nrm(44,"input",30),e.j41(45,"img",31),e.bIt("click",function(){return e.eBV(a),e.Njj(n.changeImage(1))}),e.k0s()(),e.DNE(46,C,2,1,"div",32),e.k0s(),e.j41(47,"div",33)(48,"button",34),e.bIt("click",function(){return e.eBV(a),e.Njj(n.submit())}),e.j41(49,"ion-text"),e.EFF(50),e.nI1(51,"translate"),e.k0s()()()()(),e.j41(52,"div",35)(53,"div",36)(54,"ion-text",37),e.EFF(55),e.nI1(56,"translate"),e.j41(57,"b"),e.EFF(58),e.nI1(59,"translate"),e.k0s()(),e.j41(60,"ion-text",37),e.EFF(61),e.nI1(62,"translate"),e.j41(63,"button",38),e.bIt("click",function(){return e.eBV(a),e.Njj(n.resendOtpEmail())}),e.EFF(64),e.nI1(65,"translate"),e.k0s()()()()()()}2&o&&(e.R7$(5),e.SpI(" ",e.bMT(6,21,"recovery_pass.label.title")," "),e.R7$(3),e.Y8G("fullscreen",!0),e.R7$(4),e.SpI(" ",e.bMT(13,23,"recovery_pass.label.email_sended")," "),e.R7$(5),e.JRh(e.bMT(18,25,"recovery_pass.label.sub_title3")),e.R7$(2),e.Y8G("formGroup",n.newFormGroup),e.R7$(14),e.JRh(e.bMT(34,27,"recovery_pass.label.label_new_password")),e.R7$(2),e.Y8G("type",n.myType[0]),e.R7$(2),e.Mz_("src","assets/images/SoundCollect/Iconos/",n.myEye[0],".svg",e.B4B),e.R7$(),e.Y8G("ngIf",(null==n.password?null:n.password.invalid)&&((null==n.password?null:n.password.dirty)||(null==n.password?null:n.password.touched))),e.R7$(3),e.JRh(e.bMT(42,29,"recovery_pass.label.label_new_password_verify")),e.R7$(3),e.Y8G("type",n.myType[1]),e.R7$(),e.Mz_("src","assets/images/SoundCollect/Iconos/",n.myEye[1],".svg",e.B4B),e.R7$(),e.Y8G("ngIf",(null==n.cpassword?null:n.cpassword.invalid)&&((null==n.cpassword?null:n.cpassword.dirty)||(null==n.cpassword?null:n.cpassword.touched))),e.R7$(2),e.Y8G("disabled",n.processing),e.R7$(2),e.SpI(" ",e.bMT(51,31,"recovery_pass.btn.btn-verify"),""),e.R7$(5),e.SpI("",e.bMT(56,33,"recovery_pass.label.expires_msg")," "),e.R7$(3),e.JRh(e.bMT(59,35,"recovery_pass.label.hours_msg")),e.R7$(3),e.SpI(" ",e.bMT(62,37,"recovery_pass.label.footer_msg")," "),e.R7$(3),e.SpI(" ",e.bMT(65,39,"recovery_pass.label.try_again")," "))},dependencies:[v.bv,v.W9,v.eU,v.$w,v.IO,v.ai,v.su,b.MD,b.bT,i.YN,i.qT,i.me,i.BC,i.cb,i.tU,w.h,w.D9,i.X1,i.j4,i.JD]}),m})()}}]);