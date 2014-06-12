var BrandPage={};
var BP=BrandPage;
/*
BP.rollInterval=null;
BP.selectCarImage=function(j, obj) {
	var ul = get("smallCarImagesFull");
	
	var elems = ul.getElementsByTagName('li');
	for (i=0; i<elems.length; i++){
		if (i==j) elems[i].style.display = "block";
		else elems[i].style.display = "none";
	}
	var div = get("smallCarImageThumb");
	var els = div.getElementsByTagName('li');
	for (i=0; i<els.length; i++){
		els[i].setAttribute('class', 'notActive');
	}
	obj.setAttribute('class', 'active');
	 // alert(elems);
}*/

BP.SLIDE_WIDTH_SHARE=0.02;	//%% of slide width is total move of slide
BP.AUTO_ROLL_DELAY=8000;
BP.ROLL_STEPS=25;
BP.ROLL_STEPS_FAST=10;
BP.rollStep=0;
BP.rollIndex=0;
BP.rollCurrent=null;
// BP.rollCurrentText=null;
BP.rollPrev=null;
BP.rollPrevText=null;
BP.intervalRoll=null;
BP.rollInterval=null;
BP.autoRollIndex=0;
BP.parentWidth=0;
BP.dir=1;

BP.outHideThumbs=null;
BP.showThumbs=function(){
	if(BrowserDetect.OS=="iPad"||BrowserDetect.OS=="iPhone") return;

	FX.fadeIn(get("homeMenuThumbs"),1,250);
	FX.fadeIn(get("btnRollL"),1,250);
	FX.fadeIn(get("btnRollR"),1,250);

	if(BP.outHideThumbs)clearTimeout(BP.outHideThumbs);
}
BP.hideThumbs=function(){
	if(BrowserDetect.OS=="iPad"||BrowserDetect.OS=="iPhone") return;

	if(BP.outHideThumbs)clearTimeout(BP.outHideThumbs);
	BP.outHideThumbs=setTimeout("BP.hideThumbsDelayed()",3000);
}
BP.hideThumbsDelayed=function(){
	FX.fadeOut(get("homeMenuThumbs"),0,1000,function(){
		if(BP.totalImages>1&&!BP.rollInterval)BP.rollInterval=setInterval("BP.autoRoll()",BP.AUTO_ROLL_DELAY);
	});
	FX.fadeOut(get("btnRollL"),0,1000);
	FX.fadeOut(get("btnRollR"),0,1000);
}
BP.roll=function(toIndex){
	if(BP.intervalRoll)return;
	if(toIndex==BP.rollIndex)return;

	BP.rollStep=0;
	var image0=get("image0");
	
	BP.rollPrev=get("image"+BP.rollIndex);
	// BP.rollPrevText=get("text"+BP.rollIndex);

	CSS.r(get("thumb"+BP.rollIndex),"current");

	// what item is next?
	BP.rollCurrent=get("image"+toIndex);
	// alert(toIndex);
	// BP.rollCurrentText=get("text"+toIndex);
	BP.rollIndex=toIndex;

	CSS.a(get("thumb"+BP.rollIndex),"current");

	Screen.getSize();

	BP.rollCurrent.style.position="absolute";
	BP.rollPrev.style.position="absolute";
	BP.rollPrev.style.left=Math.round(BP.parentWidth/2-BP.slideWidth/2)+"px";

	// place next item to top:
	BP.rollCurrent.style.top=0;

	// IE8- dow not dsupport opacity properly:
	if(BrowserDetect.browser=="Explorer"&&BrowserDetect.version<=8) {
		BP.rollPrevText.style.display="none";
		BP.rollPrev.style.visibility="hidden";
	}
	else {
		// set opacity to 0:
		CSS.setOpacity(BP.rollCurrent,0);
		// CSS.setOpacity(BP.rollCurrentText,0);

		// start fade in animation:
		BP.intervalRoll=setInterval("BP.animRoll()",25);
	}

	// show new current item:
	BP.rollCurrent.style.visibility="visible";
	// BP.rollCurrentText.style.display="block";
}
BP.animRoll=function(){
	Screen.getSize();

	BP.rollStep++;

	var x=Math.round(Math.sin((BP.rollStep/BP.ROLL_STEPS)*(Math.PI/2))*100)/100;
	var finalStep=BP.ROLL_STEPS;

	//var startX=Math.round(BP.parentWidth/2-BP.slideWidth/2);

	if(BP.rollStep>=finalStep){
		clearInterval(BP.intervalRoll);
		BP.intervalRoll=0;

		//BP.rollCurrent.style.left=startX+"px";
		//BP.rollCurrent.style.position="static";

		CSS.setOpacity(BP.rollCurrent,1);
		// CSS.setOpacity(BP.rollCurrentText,1);

		BP.rollPrev.style.visibility="hidden";
		// BP.rollPrevText.style.display="none";
	}
	else {
		var totalMove=BP.slideWidth*BP.SLIDE_WIDTH_SHARE;

		/*if(BP.dir>0){
			BP.rollCurrent.style.left=Math.round(startX+totalMove*(1-x))+"px";
			BP.rollPrev.style.left=Math.round(startX-totalMove*x)+"px";
		}
		else {
			BP.rollCurrent.style.left=Math.round(startX-totalMove*(1-x))+"px";
			BP.rollPrev.style.left=Math.round(startX+totalMove*x)+"px";
		}*/

		CSS.setOpacity(BP.rollCurrent,x);
		CSS.setOpacity(BP.rollPrev,(1-x));

		// CSS.setOpacity(BP.rollCurrentText,x);
		// CSS.setOpacity(BP.rollPrevText,(1-x));
	}
}
BP.rollMan=function(dir){
	var i=BP.rollIndex+dir;

	BP.rollTo(i);
	BP.showThumbs();
}
BP.rollTo=function(i){
	clearInterval(BP.rollInterval);
	BP.rollInterval=null;

	BP.dir=i<BP.rollIndex?-1:1;

	if(i<0)i=BP.totalImages-1;
	else if(i>=BP.totalImages)i=0;
	var thumb=get("thumb"+i);
	if(thumb.className.indexOf("hidden")!=-1){
		BP.rollTo(i+BP.dir);
		return;
	}

	BP.roll(i);
}
BP.autoRoll=function(){
	BP.autoRollIndex++;
	if(BP.autoRollIndex>=BP.totalImages)BP.autoRollIndex=0;

	var thumb=get("thumb"+BP.autoRollIndex);
	if(thumb.className.indexOf("hidden")!=-1){
		BP.autoRoll();
		return;
	}

	BP.roll(BP.autoRollIndex);
}
BP.onWResize=function(){
	if(!get("smallCarImagesFull"))return;
	//BP.parentWidth=Screen.width;
	BP.parentWidth=get("smallCarImagesFull").offsetWidth;

	BP.slideWidth=BP.rollCurrent.offsetWidth;
	BP.rollCurrent.style.left=Math.round(BP.parentWidth/2-BP.slideWidth/2)+"px";
}
BP.init=function(){
	if(!get("smallCarImagesFull"))return;
	
	if(BP.rollInterval){
		clearInterval(BP.rollInterval);
		BP.rollInterval=null;
	}
	BP.autoRollIndex=BP.rollIndex;
	
	BP.rollCurrent=get("image0");
	// BP.rollCurrentText=get("text0");
	// BP.roll(BP.rollCurrent);
	BP.onWResize();
	Event.on(self,"resize",BP.onWResize);

	var ul=get("smallCarImagesFull");
	var lis=ul.getElementsByTagName("li");
	BP.totalImages=lis.length;
	if(BP.totalImages>1)BP.rollInterval=setInterval("BP.autoRoll()",BP.AUTO_ROLL_DELAY);
}
onReadys.push(BP.init);