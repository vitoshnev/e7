var CarPage={};
var CP=CarPage;
CP.Color=function(id,spriteY){
	this.id=id;
	this.spriteY=spriteY;
}
CP.Var=function(what,id,name){
	this.what=what;
	this.id=id;
	this.name=name;
}
CP.Config=function(vars,price,spriteX,spriteY,count,priceStock,priceStatic){
	this.price=price;
	this.priceStock=priceStock;
	this.priceStatic=priceStatic;
	this.vars=vars;
	this.spriteX=spriteX;
	this.spriteY=spriteY;
	this.count=count;
}
CarPage.spriteSrc=null;
CP.spriteX=-1;
CP.spriteY=-1;
CP.vars={};
CP.varNames={};
CP.configs=new Array();
CP.selConfig={};
CP.urlStock=null;
CarPage.orderTarget=null;
CarPage.orderText=null;
CarPage.orderTheme=null;
CarPage.onCarClick=function(){
	if(CP.configs.length){
		if(CP.selConfig.count)CP.goStock();
		else CP.order();
		return;
	}
	self.location.href=CP.urlStock;
}
CarPage.goOrder=function(){
	var params=new Array();
	for(var j=0;j<CP.selConfig.vars.length;j++){
		var v=CP.selConfig.vars[j];
		params.push(CP.varNames[v]);
	}
	var theme=CarPage.orderTheme.replace(/\[config\]/, params.join(", "));
	PublicPage.showCallRequestForm(CarPage.orderText,theme,CarPage.orderTarget);
}
CarPage.goCredit=function(carId){
	var url=CP.urlCredit;
	url=url+"?carId="+carId+"&price="+CP.selConfig.price.replace(/\s+/g,"");
	var params=new Array();
	for(var j=0;j<CP.selConfig.vars.length;j++){
		var v=CP.selConfig.vars[j];
		params.push(CP.what(v)+"="+CP.id(v));
	}
	url+="&"+params.join("&");
	self.location.href=url;
}
CarPage.goStock=function(){
	var url=CP.urlStock;
	var params=new Array();
	for(var j=0;j<CP.selConfig.vars.length;j++){
		var v=CP.selConfig.vars[j];
		params.push(CP.what(v)+"[]="+CP.id(v));
	}
	url=url+"?"+params.join("&");
	self.location.href=url;
}
CarPage.what=function(whatId){
	var what=whatId.replace(/^(.+?)\d+$/,"$1");
	return what;
}
CarPage.id=function(whatId){
	var id=whatId.replace(/^.+?(\d+)$/,"$1");
	return id;
}
CarPage.findAvailableConfig=function(vars,index){
	// go up from bottom to that index trying to find possible config:
	for(var i=vars.length-1;i>index;i--){
		var v=vars[i];
		var what=CP.what(v);
		for(var m=0;m<CP.vars[what].length;m++){
			var wId=CP.vars[what][m];
			//alert("Trying "+wId);
			vars[i]=wId;

			var c=CP.getAvailableConfig(vars);
			if(c){
				//alert("Found new possible config: "+c.vars);
				return c;
			}

			// check child vars as well!
			var c=CarPage.findAvailableConfig(vars,i);
			if(c){
				//alert("Found new possible config: "+c.vars);
				return c;
			}
		}

		// we have found nothing in this var - reset to first one:
		vars[i]=CP.vars[what][0];
	}
	return null;
}
CarPage.setVar=function(whatId){
	if(get(whatId).className.indexOf("disabled")>=0)return;
	var what=CP.what(whatId);

	// create new config by changing in current config one specified var:
	var newConfigVars=[];
	for(var j=0;j<CP.selConfig.vars.length;j++){
		// replace this var only:
		var selWhat=CP.what(CP.selConfig.vars[j]);
		if(selWhat==what)newConfigVars[j]=whatId;
		else newConfigVars[j]=CP.selConfig.vars[j];
	}

	// find index of this updated var:
	var index=1000;
	for(var i=0;i<newConfigVars.length;i++){
		if(newConfigVars[i]==whatId){
			index=i;
		}
	}

	var c=CP.getAvailableConfig(newConfigVars);
	if(!c){
		//alert("Imposible config: "+newConfigVars);
		// now go up from bottom to that index trying to find possible config:
		var c=CP.findAvailableConfig(newConfigVars,index);
		if(!c){
			alert("Такая комбинация не возможна");
			return;
		}
	}
	//else alert("Config "+newConfigVars + " is valid");

	// unset old sel vars:
	for(var j=0;j<CP.selConfig.vars.length;j++){
		var v=CP.selConfig.vars[j];
		CSS.r(get(v),"sel");
	}
	CP.selConfig=c;
	// set new sel vars:
	for(var j=0;j<CP.selConfig.vars.length;j++){
		var v=CP.selConfig.vars[j];
		CSS.a(get(v),"sel");
	}

	// copy config vars:
	var vars=[];
	for(var j=0;j<CP.selConfig.vars.length;j++){
		vars[j]=CP.selConfig.vars[j];
	}
	// disable unavailable lower configs:
	for(var i=index+1;i<vars.length;i++){
		var what=CP.what(vars[i]);
		disabling:
		for(var m=0;m<CP.vars[what].length;m++){
			var wId=CP.vars[what][m];
			vars[i]=wId;
			//alert("Trying to disable "+a);
			for(var j=0;j<CP.configs.length;j++){
				var c=CP.configs[j];
				for(var k=0;k<=i;k++){
					if(c.vars[k]!=vars[k])break;
				}
				if(k>i){
					// found:
					//alert("Found config "+c.vars);
					CSS.r(get(vars[i]),'disabled');
					Cufon.replace(get(wId));
					continue disabling;
				}
			}

			//alert("Disabling "+a);
			CSS.a(get(wId),'disabled');
			Cufon.replace(get(wId));
		}

		// restore vars:
		vars[i]=CP.selConfig.vars[i];
	}

	// change price:
	if(get("priceValue")){
		if(CP.selConfig.price!="0"){
			get("configuratorValues").style.display="block";
			get("priceValue").innerHTML=CP.selConfig.price;
			get("priceStockValue").innerHTML=CP.selConfig.priceStock;
			get("priceStaticValue").innerHTML=CP.selConfig.priceStatic;
			Cufon.replace("#priceValue");

			if(CP.selConfig.count){
				get("configuratorStock").style.display="block";
				get("configuratorOrder").style.display="none";
				get("stockValue").innerHTML=CP.selConfig.count;
				Cufon.replace("#stockValue");
			}
			else {
				get("configuratorStock").style.display="none";
				get("configuratorOrder").style.display="block";
			}
		}
		else get("configuratorValues").style.display="none";
	}

	// change image:
	if(CP.spriteX!=CP.selConfig.spriteX||CP.spriteY!=CP.selConfig.spriteY){
		CP.spriteX=CP.selConfig.spriteX;
		CP.spriteY=CP.selConfig.spriteY;
		CarPage.loadImage(CP.spriteX,CP.spriteY);
	}
}
CP.getAvailableConfig=function(vars){
	for(var i=0;i<CP.configs.length;i++){
		var c=CP.configs[i];
		for(var j=0;j<c.vars.length;j++){
			if(!vars[j]||c.vars[j]!=vars[j])break;
		}

		if(j>=c.vars.length){
			// we are here - all vars are possible:
			return c;
		}
	}

	return null;
}
CarPage.loadImage=function(x,y){
	if(!x||x<0)x=0;
	if(!y||y<0)y=0;

	var image=get("image");
	var imageItself=HTML.child(image,"div", "img");
	var imageLoader=get("imageLoader");

	if(imageItself.style.backgroundImage){
		//FX.fadeOut(imageItself,0,250);
		imageItself.style.display="none";
	}

	CSS.setOpacity(imageLoader,0);
	imageLoader.style.display="block";
	FX.fadeIn(imageLoader, 1, 250);

	var src="/i/"+CarPage.spriteEntity+".c"+(x*CarPage.spriteWidth)+"x"+(y*CarPage.spriteHeight)+"-"+CarPage.spriteWidth+"x"+CarPage.spriteHeight+"."+CarPage.spriteId+"."+CarPage.spriteExt+"?jpg=85";
	FX.loadImage(src, function(){
		FX.fadeOut(imageLoader,0,250,function(){
			imageLoader.style.display="none";
			
			//imageItself.style.backgroundPosition="0 0";
			CSS.setOpacity(imageItself,0);
			imageItself.style.display="block";
			imageItself.style.backgroundImage="url('"+src+"')";
			
			FX.fadeIn(imageItself, 1, 500, function(){
				/*if(get("bodies")){
					CSS.setOpacity(get("bodies"),0);
					get("bodies").style.visibility='visible';
					FX.fadeIn(get("bodies"), 1, 500);
				}
				if(get("colors")){
					CSS.setOpacity(get("colors"),0);
					get("colors").style.visibility='visible';
					FX.fadeIn(get("colors"), 1, 500);
				}*/
			});
		});

	});

}
CarPage.init=function(){
	// is configurator available?
	if(CP.configs.length){
		// take first available config as default:
		CP.selConfig=CP.configs[0];
		CP.setVar(CP.selConfig.vars[0]);
	}
}
onReadys.push(CarPage.init);
