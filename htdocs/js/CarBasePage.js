var CPP={};
CPP.ROLL_STEPS=12;
CPP.rollStep=0;
CPP.rollIndex=0;
CPP.rollCurrent=get("image0");
CPP.rollPrev=null;
CPP.intervalRoll=null;
CPP.rollDir=null;

CPP.rollFast=false;

CPP.target = 0;
CPP.intervalRollTo = 0;

CPP.roll=function(dir){
	var rollSpeed=25;
	if(CPP.rollFast) rollSpeed=1;
	if(CPP.intervalRoll)return;
	CPP.rollStep=0;
	var image0=get("image0");
	image0.style.position="absolute";

	CPP.rollPrev=get("image"+CPP.rollIndex);
	if(dir<0){
		if(CPP.rollIndex==0)CPP.rollIndex=CPP.totalImages-1;
		else CPP.rollIndex--;
		CPP.rollCurrent=get("image"+CPP.rollIndex);
	}
	else {
		CPP.rollCurrent=get("image"+(CPP.rollIndex+1));
		if(CPP.rollCurrent==null){
			CPP.rollIndex=0;
			CPP.rollCurrent=image0;
		}
		else CPP.rollIndex++;
	}

	//GC.setCurrent(get("thumb"+CPP.rollIndex));

	CPP.rollDir=dir;
	CPP.rollCurrent.style.position="absolute";
	CPP.rollCurrent.style.left=(image0.offsetWidth*dir)+"px";
	CPP.rollCurrent.style.width=image0.offsetWidth+"px";;
	CPP.rollCurrent.style.top=0;
	CPP.rollCurrent.style.visibility="visible";
	CPP.intervalRoll=setInterval("CPP.animRoll()",rollSpeed);
}
CPP.rollTo = function(target){
	if(target==CPP.rollIndex)return;
	CPP.rollFast=true;
	CPP.target = target;
	if (target<CPP.rollIndex) CPP.rollDir=-1;
	else CPP.rollDir=1;
	CPP.intervalRollTo = setInterval ("CPP.roller()",5);
}

CPP.roller = function(){
	CPP.roll(CPP.rollDir);
	if(CPP.rollCurrent.id==("image"+CPP.target)){
		clearInterval(CPP.intervalRollTo);
		CPP.rollFast=false;
	}
}

CPP.animRoll=function(){
	CPP.rollStep++;
	var x=(Math.round(Math.sin((CPP.rollStep/CPP.ROLL_STEPS)*(Math.PI/2))*100)/100)*CPP.rollDir;
	if(CPP.rollStep>=CPP.ROLL_STEPS){
		clearInterval(CPP.intervalRoll);
		CPP.intervalRoll=0;
		x=0;
		CPP.rollCurrent.style.left="0";
		CPP.rollPrev.style.left=(-CPP.rollPrev.offsetWidth)+"px";
		CPP.rollPrev.style.visibility="hidden";
	}
	else {
		CPP.rollCurrent.style.left=(CPP.rollDir*CPP.rollCurrent.offsetWidth-x*CPP.rollCurrent.offsetWidth)+"px";
		CPP.rollPrev.style.left=(-CPP.rollPrev.offsetWidth*x)+"px";
	}
}

CPP.run=function(){
	FX.fadeIn(get("loader"),0.85,500);

	// start pre-loading images:
	var lis=d.getElementsByTagName("LI");
	for(var i=0;i<lis.length;i++){
		var li=lis[i];
		if(li.getAttribute("src")){
			FX.loadImage(li.getAttribute("src"),CPP.onProductImgLoad,li);
		}
	}
}
CPP.onProductImgLoad=function(f){
	var li=f.param;
	var divs=li.getElementsByTagName("DIV");
	for(var i=0;i<divs.length;i++){
		var div=divs[i];
		if(div.className!="img")continue;
		break;
	}
	li.setAttribute("isLoaded",true);
	div.style.backgroundImage="url('"+f.src+"')";

	// check all loaded:
	//var products=get("images");
	var lis=d.getElementsByTagName("LI");
	for(var i=0;i<lis.length;i++){
		var li=lis[i];
		if(!li.getAttribute("src"))continue;
		if(!li.getAttribute("isLoaded"))return;
	}

	FX.fadeIn(get("photoAlbumImages"),1,1000);

	FX.fadeOut(get("loader"),0,500,function(){get("loader").style.display='none'});
	//FX.fadeOut(get("bg"),0.20,3000);

	// all are loaded - show all one by one:
	setTimeout("CPP.showProductInfo()",1000);
}
CPP.showProductInfo=function(){
	FX.fadeIn(get("photoInfo"),1,1000);
	if(CPP.totalImages>1){
		FX.move(get("btnRollR"),(get("photoAlbumImages").offsetWidth-32),0,1000);
		FX.move(get("btnRollL"),0,0,1000);
	}
}
//CatalogBrandPage.runs.push(CPP.run);