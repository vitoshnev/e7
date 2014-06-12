var Slider=function(name){
	this.name=name;
	this.sliderDragOffsetX=0;
	this.sliderDragOffsetY=0;
	this.bar=null;
	this.bg=null;
	this.valueSpan=null;
	this.slider=null;
	this.input=null;
	this.x=0;
	this.min=0;
	this.max=0;
	this.steps=null;
	this.value=0;
	this.startSliderDrag=function(e){
		if(e.preventDefault)e.preventDefault();

		this.handlerSliderDrag=this.delegate(this,this.sliderDrag);
		this.handlerStopSliderDrag=this.delegate(this,this.stopSliderDrag);
		Event.on(d,"mousemove",this.handlerSliderDrag);
		Event.on(d,"mouseup",this.handlerStopSliderDrag);
		Event.on(d,"touchmove",this.handlerSliderDrag);
		Event.on(d,"touchend",this.handlerStopSliderDrag);

		Mouse.get(e);
		var x=Mouse.x-Screen.absOffset(this.bg,"offsetLeft");
		var y=Mouse.y-Screen.absOffset(this.bg,"offsetTop");

		this.sliderDragOffsetX=this.bar.offsetLeft-x;
		this.sliderDragOffsetY=this.bar.offsetTop-y;

		CSS.a(this.slider,'push');
		this.onStartDrag();
	}
	this.stopSliderDrag=function(e){
		Event.off(d,"mousemove",this.handlerSliderDrag);
		Event.off(d,"mouseup",this.handlerStopSliderDrag);
		Event.off(d,"touchmove",this.handlerSliderDrag);
		Event.off(d,"touchend",this.handlerStopSliderDrag);

		CSS.r(this.slider,'push');

		this.onChange();
		this.onStopDrag();
	}
	this.sliderDrag=function(e){
		var bar=this.bar;
		var bg=this.bg;

		Mouse.get(e);
		var x=Mouse.x-Screen.absOffset(bg,"offsetLeft");
		var y=Mouse.y-Screen.absOffset(bg,"offsetTop");

		x+=this.sliderDragOffsetX+bar.offsetWidth/2;
		y+=this.sliderDragOffsetY;

		if(x<0)x=0;
		else if(x>bg.offsetWidth)x=bg.offsetWidth;

		// set value from x:
		var min=this.min;
		var max=this.max;
		var range=max-min;

		if(this.steps&&this.steps.length){
			var i=Math.round((x/bg.offsetWidth)*this.steps.length);
			if(i>=this.steps.length)i=this.steps.length-1;
			var v=parseInt(this.steps[i]);
		}
		else var v=Math.round(parseInt(min)+(x/bg.offsetWidth)*range);
		
		this.setValue(v);
	}
	this.validate=function(value){
		if(value<this.min)return this.min;
		if(value>this.max)return this.max;

		/*if(this.steps){
			var min=Math.abs(steps[0]-value);
			// normalize to steps:
			for(var i=0;i<steps.length;i++){
				var s=this.steps[i];
				if(Math.abs(s-value)<
			}
		}*/

		return value;
	}
	this.setFGWidth=function(x){
		this.fg.style.width=x+"px";
	}
	this.setValue=function(v){
		this.value=this.validate(v);
		this.update();
	}
	this.update=function(){
		var min=this.min;
		var max=this.max;
		v=parseInt(this.value);
		var range=max-min;

		if(this.steps&&this.steps.length){
			for(var i=0;i<this.steps.length;i++){
				if(v==parseInt(this.steps[i]))break;
			}
			if(i>=this.steps.length)i=0;
			var x=Math.round((this.bg.offsetWidth/this.steps.length)*i);
		}
		else var x=Math.round((this.bg.offsetWidth/range)*(v-min));

		this.x=x;
		this.input.value=this.value;

		v=v.toString();
		v=v.replace(/(\d+)(\d{3})/,"$1 $2");
		v=v.replace(/(\d+)(\d{3})/,"$1 $2");
		v=v.replace(/(\d+)(\d{3})/,"$1 $2");
		this.valueSpan.innerHTML=v;

		this.setBarX(x);
		this.setFGWidth(x);
	}
	this.setBarX=function(x){
		this.bar.style.left=x-(this.bar.offsetWidth/2)+"px";
	}
	this.onStartDrag=function(){
		// nothing by default
	}
	this.onStopDrag=function(){
		// nothing by default
	}
	this.onChange=function(){
		// nothing by default
	}
	/**
		Returns a delegate function.
		This means the $method of $instance will be invoked when the returned
		function is called.
	*/
	this.delegate=function(instance,method){
		var args=arguments;
		return function(){
			var k=arguments.length;
			for(var i=0;i<args.length;i++){
				arguments[k+i]=args[i];
			}
			return method.apply(instance,arguments);
		}
	}

	// constructor:
	var s=get(name);

	this.bg=HTML.child(s,"div","sliderBG");
	this.bar=HTML.child(s,"div","sliderBar");
	this.slider=HTML.parent(this.bg, "div", "slider", true);
	this.valueSpan=HTML.child(this.bg, "span", "sliderValue");
	this.input=HTML.child(this.slider, "input", "sliderValue");
	this.fg=HTML.child(this.bg, "div", "sliderFG");

	this.min=parseInt(s.getAttribute("min"));
	this.max=parseInt(s.getAttribute("max"));
	this.setValue(parseInt(s.getAttribute("value")));

	if(s.getAttribute("steps")){
		this.steps=s.getAttribute("steps").split(",");
	}

	Event.on(this.bar,"mousedown",this.delegate(this,this.startSliderDrag));
	this.bar.ondragstart=function(){return false;};
	Event.on(this.bar,"touchstart",this.delegate(this,this.startSliderDrag));
}