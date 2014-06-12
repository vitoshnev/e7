var PublicPage={};
var PP=PublicPage;
PublicPage.init=function(){
	Event.on(self,"resize",PublicPage.onWResize);
	PublicPage.onWResize();
}
PublicPage.onWResize=function(){
	Screen.getSize();
}

/*********************************
	Alert functions
*/
PublicPage.isAlertShown=false;
PublicPage.alertCallBack=null;
PublicPage.confirm=function(text,cb){
	PP.alert(text,true,cb);
}
PublicPage.globalFormClass=null;

PublicPage.alert=function(text,isConfirm,cb){
// alert("!");
	if(cb) PublicPage.alertCallBack=cb;
	else PublicPage.alertCallBack=null;

	PublicPage.isAlertShown=true;

	var a=get("alert");
	var t=get("alertText");
	t.innerHTML=text;
	if(isConfirm){
		CSS.a(a,"confirm");
		CSS.r(a,"alert");
	}
	else {
		CSS.r(a,"confirm");
		CSS.a(a,"alert");
	}

	CSS.setOpacity(a,0);
	a.style.display="block";
	PublicPage.placeAlert();
	Fade.show(null,250,"fadeInDark");
	FX.fadeIn(a,1,250,function(){
	});

	Event.off(Fade.fade,"click", function(){PublicPage.closeAlert(false)});
	Event.on(Fade.fade,"click", function(){PublicPage.closeAlert(false)});
	Event.on(self,"keydown",PublicPage.alertKeyHandler);
}
PublicPage.alertKeyHandler=function(e){
	if(e.keyCode=='13'||e.keyCode=='27'){
		// we close form if the escape key was pressed
		Event.off(self,'keydown',PublicPage.alertKeyHandler);
		PublicPage.closeAlert(e.keyCode=='13'?true:false);
	}
}
PublicPage.closeAlert=function(ret){
	if(!PP.isAlertShown)return;

	PP.isAlertShown=false;

	var a=get("alert");
	FX.fadeOut(a,0,150,function(){
		a.style.display="none";
	});
	Fade.hide(function(){
		if(PublicPage.alertCallBack)PublicPage.alertCallBack(ret);
	});
}
PublicPage.placeAlert=function(){
	if(!PublicPage.isAlertShown)return;

	Screen.getSize();
	Screen.getScroll();

	var a=d.getElementById("alert");
	var s=Screen.scrollTop;
	a.style.top=Math.round(s+Screen.height/2-a.offsetHeight/2)+"px";
	a.style.left=Math.round(Screen.width/2-a.offsetWidth/2)+"px";
}

onReadys.push(PublicPage.init);
