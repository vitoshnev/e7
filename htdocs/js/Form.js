var Form={};
Form.lastForm=null;
Form.repeatSubmit=function(){
	if(!Form.lastForm)return;
	if(!Form.check(Form.lastForm))return;
	Form.lastForm.submit();
}
Form.isUnsetSelect=function(e){
	return (e.type=="select-one"&&(e.options[e.selectedIndex].value==''||e.options[e.selectedIndex].value=='%%%NULL%%%'));
}
Form.check=function(f,cb){
	Form.lastForm=f;
	var i;
	var warn="";

	for(i=0;i<f.elements.length;i++){
		var e=f.elements[i];

		var prevent=e.getAttribute("preventSubmit");
		if(prevent){
			setTimeout("Form.repeatSubmit()",500);
			return false;
		}

		// clear iFocus:
		var parentIDiv=HTML.parent(e,"div","i",true);
		if(parentIDiv)CSS.r(parentIDiv,"iFocus");

		var requiredIf=e.getAttribute("requiredIf")||e.getAttribute("validationIf");
		if(requiredIf) c=eval(requiredIf);
		else c=1;
		var required=e.getAttribute("required")||e.getAttribute("validation");
		if(required&&c){
			if((e.type=="text"||e.type=="password"||e.type=="textarea")&&(e.value==""||e.className.indexOf("hint")!=-1)){
				warn="Пожалуйста, заполните поле '"+required+"'!";
				if(e.getAttribute("hint"))e.value="";
			}
			else if(Form.isUnsetSelect(e)) warn="Пожалуйста, выберите из списка '"+required+"'!";
			else if(e.type=="textarea"&&e.value=="") warn="Пожалуйста, заполните поле '"+required+"'!";
			else if(e.type=="file"&&e.value=="") warn="Пожалуйста, укажите файл в поле '"+required+"'!";
			else if(e.type=="checkbox"&&!e.checked) warn="Пожалуйста, поставьте галочку в пункт '"+required+"'!";
			else if(e.type=="radio"){
				for(j=0;j<f.elements.length;j++){
					if(f.elements[j].type=="radio"&&f.elements[j].name==e.name&&f.elements[j].checked) break;
				}
				if(j==f.elements.length)warn="Пожалуйста, выберите из вариантов '"+required+"'!";
			}
			else if(e.type=="hidden"&&e.value==""){
				warn=required;
			}
		}
		if(e.type=="file"&&e.value!=""){
			var uploadableFormats=e.getAttribute("uploadableFormats");
			if(uploadableFormats){
				var v=e.value.toLowerCase();
				var fs=uploadableFormats.split(",");
				for(var j=0;j<fs.length;j++){
					if(v.substr(v.length-fs[j].length)==fs[j].toLowerCase()) break;
				}
				if(j==fs.length) warn="Пожалуйста, выберите файл в одном из форматов: "+uploadableFormats;
			}
		}
		if(warn!=""){
			//alert(warn);
			// check there is a parent div.i:
			if(parentIDiv)CSS.a(parentIDiv,"iFocus");
			e.focus();

			if(cb)cb();
			else {
				//PP.alert(warn);
				Form.showError(e,warn);
			}

			return false;
		}
	}

	// clear hints:
	for(i=0;i<f.elements.length;i++){
		var e=f.elements[i];
		if((e.type=="text"||e.type=="password"||e.type=="textarea")&&e.className.indexOf("hint")!=-1&&e.getAttribute("hint")){
			e.value="";
		}
	}
	return true;
}
Form.showError=function(el,warn){
	/*el.setCustomValidity(warn);
	return;*/

	var offset=21;
	var parent=HTML.parent(el,"div","i");
	if(!parent){
		parent=el;
		offset=6;
	}
	var err=get("formErrMsg");
	if(err)d.body.removeChild(err);
	var err=d.createElement("DIV");
	d.body.appendChild(err);
	err.innerHTML=warn;
	err.id="formErrMsg";
	var tri=d.createElement("DIV");
	err.appendChild(tri);
	tri.className="triangle";
	//alert();
	err.style.left=(Screen.absOffset(parent,"offsetLeft")+parent.offsetWidth+10)+"px";
	err.style.top=(Screen.absOffset(parent,"offsetTop")-Math.round(err.offsetHeight/2)+offset)+"px";
	tri.style.top=(Math.round(err.offsetHeight/2)-Math.round(tri.offsetHeight/2))+"px";
	Event.on(err,"click",function(){
		Form.closeError();
	});

}
Form.closeError=function(){
	var err=get("formErrMsg");
	if(err)d.body.removeChild(err);
}
Form.onInputFocus=function(e){
	var s=Event.target(e);
	if(s.className.indexOf("hint")==-1)return;
	CSS.r(s,"hint");
	if(s.type=="text") {
		s.value="";
		if(s.getAttribute("realType")=="password")s.setAttribute("type","password");
	}
	if(s.type=="textarea")s.value="";
}
Form.onInputBlur=function(e){
	var s=Event.target(e);
	if(s.type=="select-one"&&(s.options[s.selectedIndex].value==''||s.options[s.selectedIndex].value=='%%%NULL%%%')){
		CSS.a(s,"hint");
	}
	else if(s.value.length==0){
		Form.setHint(s);
	}
}
/*Form.onInputChange=function(e){
	var s=Event.target(e);
	CSS.a(s,"clicked");
}*/
Form.init=function(){

	var forms=d.getElementsByTagName("form");
	for(var j=0;j<forms.length;j++){
		var f=forms[j];

		// process custom form elements:
		var divs=f.getElementsByTagName("div");
		for(var i=0;i<divs.length;i++){
			var div=divs[i];

			if(div.getAttribute("uploaderToken")||div.getAttribute("uploaderEntity")){
				var uploader=new Uploader.FileUploader({
					element:div//,
					//debug: true,
					/*onComplete:function(id,fileName,responseJSON){
						///alert(responseJSON["file"]+"!!!");
					}*/
				});  
			}
			else if(div.getAttribute("calendarName")){
				var calendar=new Calendar.FormSelector(div,{
					callback:function(c){
						c.input.value=c.selectedDateString;
						c.inputHidden.value=c.selectedDateValue;
						CSS.r(c.input,"hint");
					}
				});
			}
		}

		// add hints:
		for(var i=0;i<f.elements.length;i++){
			var e=f.elements[i];
			if(!e.getAttribute("hint"))continue;
			if(e.type=="text"||e.type=="password"||e.type=="textarea"||e.type=="select-one"){

				Form.hintize(e);
			}
		}
	}

	Form.decorateSelects();

	if(typeof(errMsg)!="undefined"&&typeof(errElementName)!="undefined"){
		for(var j=0;j<forms.length;j++){
			var f=forms[j];
			for(var i=0;i<f.elements.length;i++){
				var el=f.elements[i];
				if(el.getAttribute("errNames")){
					var names=el.getAttribute("errNames").split("|");
					for(var k=0;k<names.length;k++){
						var name=names[k];
						if(name==errElementName){
							Form.showError(el,errMsg);
							break;
						}
					}
				}
				else if(el.name==errElementName){
					Form.showError(el,errMsg);
					break;
				}
			}
		}
	}

	//$("SELECT").selectBox({menuTransition:"slide"});
}
Form.setHint=function(s){
	if(s.getAttribute("hint")) {
		var supportsPlaceholder = (s.type!="select-one") && !!('placeholder' in document.createElement('input'));
		if(supportsPlaceholder){
			s.placeholder=s.getAttribute("hint");
		}
		else {
			if(s.type!="select-one")s.value=s.getAttribute("hint");
			if(s.getAttribute("type")=="password"){
				s.setAttribute("realType","password");
				s.setAttribute("type","text");
			}
			CSS.a(s,"hint");
		}
	}
}
Form.isHinted=function(e){
	if((e.type=="text"||e.type=="password"||e.type=="textarea"||e.type=="select-one")&&e.className.indexOf("hint")!=-1)return true;
	return false;
}
Form.hintize=function(e){
	if(Form.isUnsetSelect(e)||!e.value){
		// hint this element:
		Form.setHint(e);
	}

	//if(e.getAttribute("isCalendar")) continue;

	Event.on(e,"focus",Form.onInputFocus);
	Event.on(e,"blur",Form.onInputBlur);
	//Event.on(e,"change",Form.onInputChange);
}
Form.currentSelectList=null;
Form.currentSelectDivI=null;
Form.selectScroller=null;
Form.decorateSelects=function(specificSelect){
	return;
	if(specificSelect)var selects=[specificSelect];
	else var selects=d.getElementsByTagName("select");
	for(var j=0;j<selects.length;j++){
		var s=selects[j];

		//console.log("Redrawing "+s.getAttribute("name"));

		var divI=HTML.parent(s,"div","i",true);
		if(!divI)continue;

		CSS.a(divI,"iSelect");
		CSS.a(s,"decorated");

		// (re)create border div:
		var divBox=HTML.child(divI,"div","selectBox");
		if(!divBox){
			var divBox=d.createElement("DIV");
			divBox.className="selectBox";
			divI.appendChild(divBox);
		}
		divBox.innerHTML="";

		// create UL itself:
		var list=d.createElement("div");
		list.className="formSelect";
		var ul=d.createElement("UL");
		ul.className="select";
		for(var i=0;i<s.options.length;i++){
			var o=s.options[i];

			var li=d.createElement("LI");
			li.className="option";
			li.innerHTML=o.text;
			li.setAttribute("optionValue",o.value);
			li.setAttribute("optionIndex",i);
			if(o.selected)li.className+=" sel";
			ul.appendChild(li);

			if(!s.disabled) {
				Event.on(li,"click",function(e){
					var li=Event.target(e);
					if(li.tagName!="LI")li=HTML.parent(li,"LI");

					var ul=HTML.parent(li,"ul",null,true);
					var list=HTML.parent(li,"div","formSelect",true);

					// are we open or closed?
					if(list.className.indexOf("open")!=-1){
						
						// we are open - choose this li:
						var lis=HTML.children(ul,"li");
						for(var k=0;k<lis.length;k++){
							var li2=lis[k];
							CSS.r(li2,"sel");
						}
						CSS.a(li,"sel");

						// close list:
						var divI=Form.currentSelectDivI;
						Form.closeCurrentSelect(null,true);
						
						// set select and fire change event:
						var select=HTML.child(divI,"select");
						select.selectedIndex=parseInt(li.getAttribute("optionIndex"));
						///console.log("Firing change event on "+select.getAttribute("name"));
						Event.fire(select,"change");

						return;
					}
					else {
						// show fade:
						var f=PublicPage.showFade("#fff",0.25);
						Event.off(f,"click", Form.closeCurrentSelect);
						Event.on(f,"click", Form.closeCurrentSelect);

						// open list:
						var divI=HTML.parent(li,"div","i",true);
						CSS.a(divI,"open");
						CSS.a(list,"open");
						Form.currentSelectDivI=divI;
						Form.currentSelectList=list;

						// move open to outter layout so it is over fade:
						document.body.appendChild(list);

						// place it right:
						CSS.setOpacity(list,0);
						list.style.left=(Screen.absOffset(divI,"offsetLeft")-5)+"px";
						list.style.top=(Screen.absOffset(divI,"offsetTop")-5)+"px";
						list.style.width=(divI.offsetWidth+8)+"px";
						FX.fadeIn(list,1,250);

						Form.selectScroller=new Scroller(list);
					}
				});
				CSS.r(divI,"disabled");
			}
			else {
				// disabled:
				CSS.a(divI,"disabled");
			}
		}
		list.appendChild(ul);
		divBox.appendChild(list);
		list.style.width=(divI.offsetWidth)+"px";

		// attach change event listener:
		if(!s.getAttribute("isDecoratedEventAttached")){
			s.setAttribute("isDecoratedEventAttached",1);
			Event.on(s,"change",function(e){
				// redraw:
				var s=Event.target(e);
				//console.log("Catched change event on "+s.getAttribute("name"));
				Form.decorateSelects(s);
			});
			//console.log("Attached event catcher on "+s.getAttribute("name"));
		}

	}
}
Form.closeCurrentSelect=function(e,skipMovingNode){
	PublicPage.hideFade();
	if(Form.currentSelectDivI&&Form.currentSelectList){
		// move ul to outter layout so it is over fade:
		var list=Form.currentSelectList;
		var divI=Form.currentSelectDivI;
		FX.fadeOut(list,0,250,function(){
			if(skipMovingNode){
				document.body.removeChild(list);
			}
			else{
				var divBox=HTML.child(divI,"div","selectBox");
				divBox.appendChild(list);
			}

			list.style.left="1px";
			list.style.top="1px";

			CSS.r(list,"open");
			CSS.r(divI,"open");

			Form.currentSelectList=null;
			Form.currentSelectDivI=null;
			if(Form.selectScroller){
				Form.selectScroller.die();
				Form.selectScroller=null;
			}

			CSS.setOpacity(list,1);
		});
	}
}
var Scroller=function(parent){
	var thisObject=this;
	thisObject.handle=null;
	thisObject.scroller=null;
	thisObject.parent=parent;

	this.die=function(){
		// scroll parent:
		var p=thisObject.parent;
		var ul=HTML.child(p,"ul");
		ul.style.top=0;
		
		if(thisObject.parent&&this.scroller)thisObject.parent.removeChild(this.scroller);
	}

	this.startScroll=function(e){
		if(e.preventDefault)e.preventDefault();

		Event.on(d,"mousemove",thisObject.scroll);
		Event.on(d,"mouseup",thisObject.stopScroll);
		Event.on(d,"touchmove",thisObject.scroll);
		Event.on(d,"touchend",thisObject.stopScroll);

		CSS.a(thisObject.handle,'sel');

		Mouse.get(e);
		//var x=Mouse.x-Screen.absOffset(thisObject.scroller,"offsetLeft");
		//var y=Mouse.y-Screen.absOffset(thisObject.scroller,"offsetTop");

		handle.setAttribute("dragOffsetX", Mouse.x-Screen.absOffset(thisObject.handle,"offsetLeft"));
		handle.setAttribute("dragOffsetY", Mouse.y-Screen.absOffset(thisObject.handle,"offsetTop"));
		//console.log("Mouse.y:"+Mouse.y+", offsetTop:"+Screen.absOffset(thisObject.scroller,"offsetTop"));
	}

	this.stopScroll=function(){
		CSS.r(thisObject.handle,'sel');
		Event.off(d,"mousemove",thisObject.scroll);
		Event.off(d,"mouseup",thisObject.stopScroll);
		Event.off(d,"touchmove",thisObject.scroll);
		Event.off(d,"touchend",thisObject.stopScroll);
	}

	this.scroll=function(e){
		Mouse.get(e);
		var handle=thisObject.handle;
		var parent=thisObject.scroller;

		var ox=parseInt(handle.getAttribute("dragOffsetX"));
		var oy=parseInt(handle.getAttribute("dragOffsetY"));

		var x=Mouse.x-Screen.absOffset(parent,"offsetLeft")-ox;
		var y=Mouse.y-Screen.absOffset(parent,"offsetTop")-oy;

		//console.log("Mouse.y:"+Mouse.y+", offsetTop:"+Screen.absOffset(parent,"offsetTop")+", oy:"+oy+", y:"+y);

		if(y<0)y=0;
		else if(y>parent.offsetHeight-handle.offsetHeight)y=parent.offsetHeight-handle.offsetHeight;

		handle.style.top=y+"px";

		// scroll parent:
		var p=thisObject.parent;
		var ul=HTML.child(p,"ul");
		var diff=ul.offsetHeight-parent.offsetHeight;
		var scrollTop=-Math.round((diff/(parent.offsetHeight-handle.offsetHeight))*y);
		ul.style.top=scrollTop+"px";
	}

	// scroll parent:
	var p=thisObject.parent;
	var ul=HTML.child(p,"ul");
	var diff=ul.offsetHeight-parent.offsetHeight;

	// constructor:
	var scroll=d.createElement("div");
	parent.appendChild(scroll);
	scroll.setAttribute("class","scroller");
	scroll.style.height=(parent.offsetHeight-10)+"px";
	scroll.style.top="5px";
	scroll.style.right="5px";
	this.scroller=scroll;

	if(diff<=0) return;

	var handle=d.createElement("div");
	scroll.appendChild(handle);
	handle.setAttribute("class","handle");
	//handle.style.height=Math.round(scroll.offsetHeight*.25)+"px";
	handle.style.height=25+"px";
	this.handle=handle;

	Event.on(handle,"mousedown",this.startScroll);
	handle.ondragstart=function(){return false;};
	Event.on(handle,"touchstart",this.startScroll);
}
onReadys.push(Form.init);
