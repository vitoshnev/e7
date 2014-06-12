var CarPageOrder={};
var CP=CarPageOrder;
CarPageOrder.spriteSrc=null;
CP.lastBodyX=0;
CP.lastBodyI=0;
CP.lastColorY=0;
CP.lastColorI=0;
CarPageOrder.setBody=function(i,x){
	var image=get("image");
	var imageItself=HTML.child(image,"div", "img");
	imageItself.style.backgroundPosition=(-x)+"px "+(-CP.lastColorY)+"px";
	CP.lastBodyX=x;
	CP.lastBodyI=i;
	CarPageOrder.outBodies();
}
CarPageOrder.setColor=function(i,y){
	var image=get("image");
	var imageItself=HTML.child(image,"div", "img");
	imageItself.style.backgroundPosition=(-CP.lastBodyX)+"px "+(-y)+"px";
	CP.lastColorY=y;
	CP.lastColorI=i;
	get("color"+i).checked=true;

	CarPageOrder.outColors();
}
CarPageOrder.setComplect=function(id){
	var uls=get("complects").getElementsByTagName("ul");
	for(var i=0;i<uls.length;i++){
		var ul=uls[i];
		if(ul.id=='complect'+id)ul.style.display='block';
		else ul.style.display='none';
	}
}
CarPageOrder.outBodies=function(){
}
CarPageOrder.outColors=function(){
	var lis=get("colors").getElementsByTagName("li");
	for(var i=0;i<lis.length;i++){
		var li=lis[i];
		if(CP.lastColorI==i)CSS.a(li,"over");
		else CSS.r(li,"over");
	}
}
CarPageOrder.init=function(){
	if(CarPageOrder.spriteSrc) FX.loadImage(CarPageOrder.spriteSrc, function(){
		var image=get("image");
		FX.fadeOut(image,0,250,function(){
			image.style.background="none";

			var imageItself=HTML.child(image,"div", "img");
			imageItself.style.backgroundPosition="0 0";
			imageItself.style.backgroundImage="url('"+CarPageOrder.spriteSrc+"')";
			
			CarPageOrder.setBody(CP.lastBodyI,CP.lastBodyX);
			CarPageOrder.setColor(CP.lastColorI,CP.lastColorY);

			FX.fadeIn(image, 1, 500, function(){
			});
		});

	});
}
onReadys.push(CarPageOrder.init);
