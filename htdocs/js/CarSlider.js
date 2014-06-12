var carSlider=function(options){
	//Screen.getSize();
	//alert(Screen.width+":"+Screen.height);

	
	// fatal validation:
	if(!options||!options.texts)return;

	// some constants:
	this.SLIDE_WIDTH_SHARE=0.02;	//%% of slide width is total move of slide
	this.AUTO_ROLL_DELAY=3000;
	this.ROLL_STEPS=25;
	this.ROLL_STEPS_FAST=10;

	this.intervalAutoRoll=null;	// handle of interval to auto roll
	this.autoRollIndex=0;	// what slide is not auto rolled
	this.totalItems=0;
	this.ulTexts=null;
	this.ulImages=null;
	this.ulThumbs=null;
	this.texts=null;
	this.images=null;
	this.thumbs=null;

	this.reset=function() {
		this.intervalAutoRoll=null;	// handle of interval to auto roll
		this.autoRollIndex=0;	// what slide is not auto rolled

		if(this.intervalAutoRoll){
			clearInterval(this.intervalAutoRoll);
			this.intervalAutoRoll=null;
		}

		this.rollCurrent=this.images[0];
		this.rollCurrentText=this.texts[0];

		this.autoRollIndex=this.rollIndex;
	}

	this.onWResize=function() {
	}

	this.startAutoRolling=function(){
		if(this.intervalAutoRoll)clearInterval(this.intervalAutoRoll);
		this.intervalAutoRoll=setInterval(this.autoRoll,this.AUTO_ROLL_DELAY);
	}

	this.loadNextImage=function(){
		var lis=this.images;
		var allLoaded=true;
		var host=this;
		for(i=0;i<lis.length;i++){
			var li=lis[i];
			if(li.getAttribute("isLoaded")||li.getAttribute("isLoading")) continue;

			li.setAttribute("isLoading",1);

			// start loading this LI:
			var src=li.getAttribute("src");
			li.setAttribute("loadingIndex",i);
			var param=li;
			FX.loadImage(src,function(f){
				var li=f.param;
				var src=li.getAttribute("src");

				// hide loader, then show LI:
				var loader=HTML.child(li,"img","loader");
				CSS.setOpacity(loader,1);
				FX.fadeOut(loader,0,500,function(){
					// only now LI is loaded!
					if(li.getAttribute("loadingIndex")==0){
						CSS.setOpacity(li,0);
						li.style.backgroundImage="url('"+src+"')";
						FX.fadeIn(li,1,500,function(){
							// if this was first li - start rolling:
							li.setAttribute("isLoaded",1);
							host.startAutoRolling();
						});
					}
					else {
						///console.log("Loaded image 1+");
						// set LI background, but faded:	
						// IE8- does not support opacity properly:
						if(BrowserDetect.browser=="Explorer"&&BrowserDetect.version<=8) {
							host.rollCurrent.style.display="block";
						}
						else CSS.setOpacity(li,0);

						li.style.backgroundImage="url('"+src+"')";
						li.setAttribute("isLoaded",1);

						// IE8- does not support opacity properly:
						if(!(BrowserDetect.browser=="Explorer"&&BrowserDetect.version<=8)) {
							// if this is a LI that is currently loaded - fade it in:
							if(li.getAttribute("loadingIndex")==host.rollIndex){
								FX.fadeIn(li,1,500,function(){});
							}
						}
					}
				});

				// go to loading next image:
				host.loadNextImage();
			},li);

			break;	// do not process next images, wait for last image is loaded
		}
	}

	this.thumbsAreFading=false;
	this.showThumbs=function(){
		if(!this.autoHideThumbs)return;
		if(BrowserDetect.OS=="iPad"||BrowserDetect.OS=="iPhone") return;
		if(!this.thumbs)return;
		if(this.thumbsAreFading)return;

		this.thumbsAreFading=true;
		FX.fadeIn(this.thumbs,1,250,function(){this.thumbsAreFading=false;});
		if(this.btnRollL)FX.fadeIn(this.btnRollL,1,250);
		if(this.btnRollR)FX.fadeIn(this.btnRollR,1,250);
	}

	this.hideThumbs=function(){
		if(BrowserDetect.OS=="iPad"||BrowserDetect.OS=="iPhone") return;
		if(!this.thumbs)return;
		if(this.thumbsAreFading)return;

		this.thumbsAreFading=true;
		FX.fadeOut(this.thumbs,1,1000,function(){this.thumbsAreFading=false;});
		if(this.btnRollL)FX.fadeOut(this.btnRollL,1,1000);
		if(this.btnRollR)FX.fadeOut(this.btnRollR,1,1000);
	}

	this.isMoving=false;
	this.touchStart=function(e,host,method){
		if(typeof(e.changedTouches)!="undefined"){
			if(e.changedTouches.length>1) return;
			var touch=e.changedTouches[0];
			var x=e.changedTouches[0].pageX;
			var y=e.changedTouches[0].pageY;
		}
		else {
			Mouse.get(e);
			var x=Mouse.x;
			var y=Mouse.y;
		}

		//if(e.preventDefault)e.preventDefault();

		// stop autoRoll:
		clearInterval(this.intervalAutoRoll);

		var li=host.rollCurrent;
		console.log("touchStart: "+li);
		//CSS.a(li,'moving');

		li.setAttribute("dragOffsetX", x-Screen.absOffset(li,"offsetLeft"));
		li.setAttribute("dragOffsetY", y-Screen.absOffset(li,"offsetTop"));

		/*li.setAttribute("parentLeft", Screen.absOffset(host.images,"offsetLeft"));
		li.setAttribute("parentWidth", host.images.offsetWidth);
		li.setAttribute("parentTop", Screen.absOffset(host.images,"offsetTop"));*/

		//HSlider.scrollingLI=li;
		//HSlider.scrollingLIText=get("text"+HSlider.rollIndex);
	}

	this.touchMove=function(e){
		this.isMoving=true;

		if(typeof(e.changedTouches)!="undefined"){
			var touch=e.changedTouches[0];
			var mx=e.changedTouches[0].pageX;
			var my=e.changedTouches[0].pageY;
		}
		else {
			Mouse.get(e);
			var mx=Mouse.x;
			var my=Mouse.y;
		}

		var ox=parseInt(li.getAttribute("dragOffsetX"));
		var oy=parseInt(li.getAttribute("dragOffsetY"));

		var px=parseInt(li.getAttribute("parentLeft"));
		var pw=parseInt(li.getAttribute("parentWidth"));
		var py=parseInt(li.getAttribute("parentTop"));

		var x=mx-px-ox;
		var y=my-py-oy;

		this.rollCurrentText.style.left=x+"px";
		this.rollCurrent.style.left=x+"px";
	}

	this.touchEnd=function(e){
		e.stopPropagation();
		e.preventDefault();
		if(!e.handled){
			if(!this.isMoving){
			}
			e.handled = true;
		} else return false;

		this.isMoving = false;
		return true;
	}

	/*
		Constructor:
	*/

	BrowserDetect.init();

	this.ulTexts=options.texts;
	this.ulImages=options.images;
	this.ulThumbs=options.thumbs;
	this.texts=this.ulTexts.getElementsByTagName("li");
	this.images=this.ulImages.getElementsByTagName("li");
	this.thumbs=this.ulThumbs.getElementsByTagName("li");
	this.totalItems=this.texts.length;
	this.btnRollL=options.btnRollL;
	this.btnRollR=options.btnRollR;
	this.withTouchSliding=options.withTouchSliding;

	if(this.btnRollL){
		var host=this;
		Event.on(this.btnRollL,"mouseover",function(){CSS.a(this,'over')});
		Event.on(this.btnRollL,"mouseout",function(){CSS.r(this,'over')});
		Event.on(this.btnRollL,"click",function(){host.rollMan(1)});
	}
	if(this.btnRollL){
		var host=this;
		Event.on(this.btnRollR,"mouseover",function(){CSS.a(this,'over')});
		Event.on(this.btnRollR,"mouseout",function(){CSS.r(this,'over')});
		Event.on(this.btnRollR,"click",function(){host.rollMan(-1)});
	}

	this.reset();

	// if count = 1:
	if(this.totalItems==1) {
		CSS.a(this.ulThumbs,"hidden");
	}

	// resize:
	this.onWResize();
	Event.on(self,"resize",this.onWResize);

	// start loading images:
	this.loadNextImage();

	// touch sliding:
	if(this.withTouchSliding){
		Event.on(this.ulTexts,"mousedown",Event.delegate(this,this.touchStart));
		Event.on(this.ulTexts,"touchstart",Event.delegate(this,this.touchStart));
		/*Event.on(this.ulTexts,"mousemove",Event.delegate(this,this.touchMove));
		Event.on(this.ulTexts,"touchmove",Event.delegate(this,this.touchMove));
		Event.on(this.ulTexts,"mouseup",Event.delegate(this,this.touchStop));
		Event.on(this.ulTexts,"touchstop",Event.delegate(this,this.touchStop));*/
		/*for(i=0;i<this.texts.length;i++){
			var li=this.texts[i];
			Event.on(li,"mousedown",this.touchMove);
			Event.on(li,"touchmove",this.touchMove);
		}*/
	}
}

