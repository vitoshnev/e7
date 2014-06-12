/*********************************
	Fade functions
*/
var Fade={};
Fade.FADING_SPEED=200;
Fade.DEFAULT_CSS_CLASS_FADE_IN="fadeIn";
Fade.lastCSS=null;

Fade.fade=null;
Fade.isLocked=false;
Fade.isShown=false;
Fade.show=function(callback,time,css){
	if(Fade.isShown)return;
	var f=Fade.get();

	css=css?css:Fade.DEFAULT_CSS_CLASS_FADE_IN;

	//Fade.place();
	f.style.display="block";
	setTimeout(function(){
		if(time)Fade.fade.style.transition="all "+(time/1000)+"s ease-out 0s";
		Fade.lastCSS=css;
		CSS.a(Fade.get(),css);
		if(callback)setTimeout(callback,time?time:Fade.FADING_SPEED);
	},25);

	Fade.isShown=true;
}
Fade.place=function(){
/*	var f=Fade.get();
	f.style.top="0px";//Screen.scrollTop+"px";
	f.style.left="0px";

	var w=d.body.offsetWidth;
	//if(w<Screen.scrollLeft+Screen.width)w=Screen.scrollLeft+Screen.width;
	f.style.width=w+"px";

	var h=d.body.offsetHeight;
	//if(h<Screen.scrollTop+Screen.height)h=Screen.scrollTop+Screen.height;
	f.style.height=h+"px";*/
};
Fade.hide=function(callback,time){
	if(Fade.isLocked)return;
	var f=Fade.get();

	CSS.r(f,Fade.lastCSS);
	setTimeout(function(){
		Fade.get().style.display="none";
		if(callback)callback();
	},time?time:Fade.FADING_SPEED);

	Fade.isShown=false;
};
Fade.get=function(){
	if(!Fade.fade){
		Fade.fade=document.createElement("div");
		document.body.appendChild(Fade.fade);
		Fade.fade.id="fade";
		Fade.fade.style.display="none";
		Fade.fade.style.position="fixed";
		Fade.fade.style.top="0px";
		Fade.fade.style.left="0px";
		Fade.fade.style.width="100%";
		Fade.fade.style.height="100%";
		Fade.fade.style.transition="all "+(Fade.FADING_SPEED/1000)+"s ease-out 0s";
	}
	return Fade.fade;
};