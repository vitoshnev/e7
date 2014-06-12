var EditImage={};
var EI=EditImage;
EI.frameDragOffsetX=0;
EI.frameDragOffsetY=0;
EI.resizeDragOffsetX=0;
EI.resizeDragOffsetY=0;
EI.frameWidth=0;
EI.frameHeight=0;
EI.frame=null;
EI.block=null;
EI.frameResizer=null;
EI.submit=function(form){
	var frame=get("frame");
	form.cropX.value=frame.offsetLeft;
	form.cropY.value=frame.offsetTop;
	form.cropWidth.value=frame.offsetWidth;
	form.cropHeight.value=frame.offsetHeight;

	var frame2=get("frame2");
	form.cropXIcon.value=frame2.offsetLeft;
	form.cropYIcon.value=frame2.offsetTop;
	form.cropWidthIcon.value=frame2.offsetWidth;
	form.cropHeightIcon.value=frame2.offsetHeight;

	form.submit();
}
EI.startResizeDrag=function(e){
	if(e.preventDefault)e.preventDefault();

	Event.on(d,"mousemove",EI.resizeDrag);
	Event.on(d,"mouseup",EI.stopResizeDrag);

	var frameResizer=Event.target(e);
	var block=HTML.parent(frameResizer, "div", "imageContent");
	var frame=HTML.child(block, "div", "frame");
	EI.frame=frame;
	EI.block=block;
	EI.frameResizer=frameResizer;

	EI.frameWidth=frame.offsetWidth;
	EI.frameHeight=frame.offsetHeight;

	Mouse.get(e);
	var x=Mouse.x-Screen.absOffset(block,"offsetLeft");
	var y=Mouse.y-Screen.absOffset(block,"offsetTop");

	EI.resizeDragOffsetX=frameResizer.offsetLeft-x;
	EI.resizeDragOffsetY=frameResizer.offsetTop-y;
}
EI.stopResizeDrag=function(){
	Event.off(d,"mousemove",EI.resizeDrag);
	Event.off(d,"mouseup",EI.stopResizeDrag);

	EI.setValues();
}
EI.resizeDrag=function(e){
	var frame=EI.frame;
	var block=EI.block;
	var frameResizer=EI.frameResizer;
	
	Mouse.get(e);
	var x=Mouse.x-Screen.absOffset(block,"offsetLeft");
	var y=Mouse.y-Screen.absOffset(block,"offsetTop");
	
	var w=x-frame.offsetLeft;
	var h=y-frame.offsetTop;

	if(w/EI.frameWidth>h/EI.frameHeight){
		if(w<50)w=50;
		h=Math.round(w/(EI.frameWidth/EI.frameHeight));
	}
	else {
		if(h<50)h=50;
		w=Math.round(h*(EI.frameWidth/EI.frameHeight));
	}

	EI.frameWidth=w;
	EI.frameHeight=h;	
	
	if(frame.offsetLeft+EI.frameWidth+6>block.offsetWidth)EI.frameWidth=block.offsetWidth-frame.offsetLeft-6;
	if(frame.offsetTop+EI.frameHeight+6>block.offsetHeight)EI.frameHeight=block.offsetHeight-frame.offsetTop-6;

	frame.style.width=EI.frameWidth+"px";
	frame.style.height=EI.frameHeight+"px";

	EI.placeResizer(block);
}
EI.startFrameDrag=function(e){
	if(e.preventDefault)e.preventDefault();

	Event.on(d,"mousemove",EI.frameDrag);
	Event.on(d,"mouseup",EI.stopFrameDrag);

	var frame=Event.target(e);
	var block=HTML.parent(frame, "div", "imageContent");
	var frameResizer=HTML.child(block, "div", "frameResizer");
	EI.frame=frame;
	EI.block=block;
	EI.frameResizer=frameResizer;

	Mouse.get(e);
	var x=Mouse.x-Screen.absOffset(block,"offsetLeft");
	var y=Mouse.y-Screen.absOffset(block,"offsetTop");

	EI.frameDragOffsetX=frame.offsetLeft-x;
	EI.frameDragOffsetY=frame.offsetTop-y;
}
EI.stopFrameDrag=function(){
	Event.off(d,"mousemove",EI.frameDrag);
	Event.off(d,"mouseup",EI.stopFrameDrag);

	EI.setValues();
}
EI.frameDrag=function(e){
	var frame=EI.frame;
	var block=EI.block;
	var frameResizer=EI.frameResizer;

	Mouse.get(e);
	var x=Mouse.x-Screen.absOffset(block,"offsetLeft");
	var y=Mouse.y-Screen.absOffset(block,"offsetTop");
	
	/*if(x<0||x>block.offsetWidth||y<0||y>frame.offsetHeight){
		EI.stopFrameDrag();
		return;
	}*/
	x+=EI.frameDragOffsetX;
	y+=EI.frameDragOffsetY;

	if(x<0)x=0;
	else if(x+frame.offsetWidth+10>block.offsetWidth)x=block.offsetWidth-frame.offsetWidth;
	if(y<0)y=0;
	else if(y+frame.offsetHeight+10>block.offsetHeight)y=block.offsetHeight-frame.offsetHeight;
	//console.log(x+","+y+", "+frame.offsetWidth+", "+block.offsetWidth);
	
	frame.style.left=x+"px";
	frame.style.top=y+"px";

	EI.placeResizer(block);
}
EI.placeResizer=function(){
	var frame=EI.frame;
	var frameResizer=EI.frameResizer;

	frameResizer.style.left=(frame.offsetLeft+frame.offsetWidth-frameResizer.offsetWidth)+"px";
	frameResizer.style.top=(frame.offsetTop+frame.offsetHeight-frameResizer.offsetHeight)+"px";
}
EI.setValues=function(){
	var block=EI.block;
	var frame=HTML.child(block, "div", "frame");
	var x=HTML.child(block, "input", "x");
	var y=HTML.child(block, "input", "y");
	var w=HTML.child(block, "input", "w");
	var h=HTML.child(block, "input", "h");
	var ow=parseInt(w.getAttribute("original"));
	var oh=parseInt(h.getAttribute("original"));
	if(ow/oh>block.offsetWidth/block.offsetHeight){
		// horisontal:
		var m = ow/block.offsetWidth;
		var vx = m * frame.offsetLeft;
		var vy = m * (frame.offsetTop - (block.offsetHeight/2 - (oh/m)/2) );
	}
	else {
		// vertical:
		var m = oh/block.offsetHeight;
		var vx = m * (frame.offsetLeft - (block.offsetWidth/2 - (ow/m)/2) );
		var vy = m * frame.offsetTop;
	}
	x.value=Math.round(vx);
	y.value=Math.round(vy);

	w.value=Math.round(m * frame.offsetWidth);
	h.value=Math.round(m * frame.offsetHeight);
}
EI.setFrame=function(blockName){
	var block=get(blockName);
	var frame=HTML.child(block, "div", "frame");
	var frameResizer=HTML.child(block, "div", "frameResizer");
	EI.frame=frame;
	EI.block=block;
	EI.frameResizer=frameResizer;

	var frame=HTML.child(block, "div", "frame");
	var x=HTML.child(block, "input", "x");
	var y=HTML.child(block, "input", "y");
	var w=HTML.child(block, "input", "w");
	var h=HTML.child(block, "input", "h");
	var ow=parseInt(w.getAttribute("original"));
	var oh=parseInt(h.getAttribute("original"));
	if(ow/oh>block.offsetWidth/block.offsetHeight){
		// horisontal:
		var m = ow/block.offsetWidth;
		var vx = x.value/m;
		var vy = y.value/m + (block.offsetHeight/2 - (oh/m)/2);
	}
	else {
		// vertical:
		var m = oh/block.offsetHeight;
		var vy = y.value/m;
		var vx = x.value/m + (block.offsetWidth/2 - (ow/m)/2);
	}
	frame.style.left=Math.round(vx)+"px";
	frame.style.top=Math.round(vy)+"px";
	var r=frame.offsetWidth/frame.offsetHeight;
	frame.style.width=(w.value/m - 6)+"px";
	frame.style.height=(frame.offsetWidth/r - 6)+"px";

	EI.placeResizer(block);
}
EI.init=function(){

	// set frames:
	EI.setFrame("imageContent");
	//EI.setFrame("imageContent2");
	
	Event.on(get("frame"),"mousedown",EI.startFrameDrag);
	Event.on(get("frameResizer"),"mousedown",EI.startResizeDrag);

	Event.on(get("frame2"),"mousedown",EI.startFrameDrag);
	Event.on(get("frameResizer2"),"mousedown",EI.startResizeDrag);

	get("frame").ondragstart=function(){return false;};
	get("frameResizer").ondragstart=function(){return false;};
}
onReadys.push(EI.init);