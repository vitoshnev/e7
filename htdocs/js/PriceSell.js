var PriceSell=function(name){

	Event.on(this.bar,"mousedown",this.delegate(this,this.startSliderDrag));
	this.bar.ondragstart=function(){return false;};
	Event.on(this.bar,"touchstart",this.delegate(this,this.startSliderDrag));
}