function Wnd(url){

	this.url=url;
	this.h1=null;
	this.el=null;
	this.elHeader=null;
	this.elIframe=null;
	this.isModal=false;

	var host=this;

	this.showModal=function(url){
		host.isModal=true;

		if(url)host.url=url;
		Event.off(host.elIframe,"load",this.onLoad);
		Event.on(host.elIframe,"load",this.onLoad);
		host.elIframe.src=url;

		if(host.h1){
			host.elHeader.innerHTML=host.h1;
			host.elHeader.style.display="block";
		}
		else host.elHeader.style.display="none";
		
		Fade.show();
		CSS.setOpacity(host.el,0)
		host.el.style.display="block";
		FX.fadeIn(host.el,1,500);

		Event.off(Fade.fade,"click", host.hide);
		Event.on(Fade.fade,"click", host.hide);
		Event.on(self,"keydown",host.keyHandler);
	}

	this.keyHandler=function(e){
		if(e.keyCode=='27'){
			// we close window if the escape key was pressed
			Event.off(self,"keydown",host.keyHandler);
			host.hide();
		}
	}

	this.onLoad=function(e){
	}

	this.hide=function(){
		if(host.isModal)Fade.hide();

		FX.fadeOut(host.el,0,150,function(){
			host.el.style.display="none";
		});
	}

	// constructor:

	this.el=document.createElement("div");
	this.el.className="wnd";

	this.elIframe=document.createElement("iframe");
	this.el.appendChild(this.elIframe);

	this.elHeader=document.createElement("h1");
	this.el.appendChild(this.elHeader);

	var close=document.createElement("div");
	close.className="icon iconClose";
	this.el.appendChild(close);
	Event.off(close,"click",this.hide);
	Event.on(close,"click",this.hide);

	this.el.style.display="none";

	document.body.appendChild(this.el);
}
