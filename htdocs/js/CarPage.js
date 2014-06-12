var CarPage={};
CarPage.show=function(img){
	var url=img.getAttribute('src');
	var i=get("imageBig");
	FX.fadeOut(i,0,100,function(){
		var loader=get("imageBigLoader");
		CSS.setOpacity(loader,0);
		loader.style.display="block";
		FX.fadeIn(loader,1,25);
		FX.loadImage(url,function(fx){
			i.style.backgroundImage="url("+url+")";

			i.setAttribute("enlargeURL", img.getAttribute("li_enlargeURL"));
			i.setAttribute("enlargeWidth", img.getAttribute("li_enlargeWidth"));
			i.setAttribute("enlargeHeight", img.getAttribute("li_enlargeHeight"));
			i.setAttribute("enlargeIndex", img.getAttribute("enlargeIndex"));
			EnlargableImages.init();

			FX.fadeOut(loader,0,25,function(){
				loader.style.display="none";
			});
			FX.fadeIn(i,1,250);
		});
	});
}
