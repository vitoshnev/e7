var HomeMenu={};
var HM=HomeMenu;
HM.SLIDE_WIDTH_SHARE=0.02;	//%% of slide width is total move of slide
HM.AUTO_ROLL_DELAY=8000;
HM.ROLL_STEPS=25;
HM.ROLL_STEPS_FAST=10;
HM.rollStep=0;
HM.rollIndex=0;
HM.rollCurrent=null;
HM.rollCurrentText=null;
HM.rollPrev=null;
HM.rollPrevText=null;
HM.intervalRoll=null;
HM.rollInterval=null;
HM.autoRollIndex=0;
HM.parentWidth=0;
HM.dir=1;

HM.outHideThumbs=null;
HM.showThumbs=function(){
	if(BrowserDetect.OS=="iPad"||BrowserDetect.OS=="iPhone") return;

	FX.fadeIn(get("homeMenuThumbs"),1,250);
	FX.fadeIn(get("btnRollL"),1,250);
	FX.fadeIn(get("btnRollR"),1,250);

	if(HM.outHideThumbs)clearTimeout(HM.outHideThumbs);
}
HM.hideThumbs=function(){
	if(BrowserDetect.OS=="iPad"||BrowserDetect.OS=="iPhone") return;

	if(HM.outHideThumbs)clearTimeout(HM.outHideThumbs);
	HM.outHideThumbs=setTimeout("HM.hideThumbsDelayed()",3000);
}
HM.hideThumbsDelayed=function(){
	FX.fadeOut(get("homeMenuThumbs"),0,1000,function(){
		if(HM.totalImages>1&&!HM.rollInterval)HM.rollInterval=setInterval("HM.autoRoll()",HM.AUTO_ROLL_DELAY);
	});
	FX.fadeOut(get("btnRollL"),0,1000);
	FX.fadeOut(get("btnRollR"),0,1000);
}
HM.roll=function(toIndex){
	if(HM.intervalRoll)return;
	if(toIndex==HM.rollIndex)return;

	HM.rollStep=0;
	var image0=get("image0");
	var text0=get("text0");

	HM.rollPrev=get("image"+HM.rollIndex);
	HM.rollPrevText=get("text"+HM.rollIndex);

	CSS.r(get("thumb"+HM.rollIndex),"current");

	// what item is next?
	HM.rollCurrent=get("image"+toIndex);
	HM.rollCurrentText=get("text"+toIndex);
	HM.rollIndex=toIndex;

	CSS.a(get("thumb"+HM.rollIndex),"current");

	Screen.getSize();

	HM.rollCurrent.style.position="absolute";
	HM.rollPrev.style.position="absolute";
	HM.rollPrev.style.left=Math.round(HM.parentWidth/2-HM.slideWidth/2)+"px";

	// place next item to top:
	HM.rollCurrent.style.top=0;

	// IE8- dow not dsupport opacity properly:
	if(BrowserDetect.browser=="Explorer"&&BrowserDetect.version<=8) {
		HM.rollPrevText.style.display="none";
		HM.rollPrev.style.visibility="hidden";
	}
	else {
		// set opacity to 0:
		CSS.setOpacity(HM.rollCurrent,0);
		CSS.setOpacity(HM.rollCurrentText,0);

		// start fade in animation:
		HM.intervalRoll=setInterval("HM.animRoll()",25);
	}

	// show new current item:
	HM.rollCurrent.style.visibility="visible";
	HM.rollCurrentText.style.display="block";
}
HM.animRoll=function(){
	Screen.getSize();

	HM.rollStep++;

	var x=Math.round(Math.sin((HM.rollStep/HM.ROLL_STEPS)*(Math.PI/2))*100)/100;
	var finalStep=HM.ROLL_STEPS;

	//var startX=Math.round(HM.parentWidth/2-HM.slideWidth/2);

	if(HM.rollStep>=finalStep){
		clearInterval(HM.intervalRoll);
		HM.intervalRoll=0;

		//HM.rollCurrent.style.left=startX+"px";
		//HM.rollCurrent.style.position="static";

		CSS.setOpacity(HM.rollCurrent,1);
		CSS.setOpacity(HM.rollCurrentText,1);

		HM.rollPrev.style.visibility="hidden";
		HM.rollPrevText.style.display="none";
	}
	else {
		var totalMove=HM.slideWidth*HM.SLIDE_WIDTH_SHARE;

		/*if(HM.dir>0){
			HM.rollCurrent.style.left=Math.round(startX+totalMove*(1-x))+"px";
			HM.rollPrev.style.left=Math.round(startX-totalMove*x)+"px";
		}
		else {
			HM.rollCurrent.style.left=Math.round(startX-totalMove*(1-x))+"px";
			HM.rollPrev.style.left=Math.round(startX+totalMove*x)+"px";
		}*/

		CSS.setOpacity(HM.rollCurrent,x);
		CSS.setOpacity(HM.rollPrev,(1-x));

		CSS.setOpacity(HM.rollCurrentText,x);
		CSS.setOpacity(HM.rollPrevText,(1-x));
	}
}
HM.rollMan=function(dir){
	var i=HM.rollIndex+dir;

	HM.rollTo(i);
	HM.showThumbs();
}
HM.rollTo=function(i){
	clearInterval(HM.rollInterval);
	HM.rollInterval=null;

	HM.dir=i<HM.rollIndex?-1:1;

	if(i<0)i=HM.totalImages-1;
	else if(i>=HM.totalImages)i=0;

	var thumb=get("thumb"+i);
	if(thumb.className.indexOf("hidden")!=-1){
		HM.rollTo(i+HM.dir);
		return;
	}

	HM.roll(i);
}
HM.autoRoll=function(){
	HM.autoRollIndex++;
	if(HM.autoRollIndex>=HM.totalImages)HM.autoRollIndex=0;

	var thumb=get("thumb"+HM.autoRollIndex);
	if(thumb.className.indexOf("hidden")!=-1){
		HM.autoRoll();
		return;
	}

	HM.roll(HM.autoRollIndex);
}
HM.onWResize=function(){
	if(!get("homeMenuImages"))return;
	//HM.parentWidth=Screen.width;
	HM.parentWidth=get("homeMenuImages").offsetWidth;

	HM.slideWidth=HM.rollCurrent.offsetWidth;
	HM.rollCurrent.style.left=Math.round(HM.parentWidth/2-HM.slideWidth/2)+"px";
}
HM.init=function(){
	if(!get("homeMenuImages"))return;

	if(HM.rollInterval){
		clearInterval(HM.rollInterval);
		HM.rollInterval=null;
	}
	HM.autoRollIndex=HM.rollIndex;

	HM.rollCurrent=get("image0");
	HM.rollCurrentText=get("text0");

	HM.onWResize();
	Event.on(self,"resize",HM.onWResize);

	var ul=get("homeMenuImages");
	var lis=ul.getElementsByTagName("li");
	HM.totalImages=lis.length;
	if(HM.totalImages>1)HM.rollInterval=setInterval("HM.autoRoll()",HM.AUTO_ROLL_DELAY);
}
onReadys.push(HM.init);