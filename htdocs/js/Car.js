var Car={};
Car.initPage=function(){
	if(get("carId").value)Car.showDetails();
}
Car.showDetails=function(){
	var div=get("carDetails");
	CSS.setOpacity(div,0);

	Car.request("details",function(r){
		FX.fadeIn(div,1,500);
		var tds=div.getElementsByTagName("td");
		for(var i=0;i<tds.length;i++){
			var td=tds[i];
			var p=td.getAttribute("property");
			if(!p)continue;
			
			td.innerHTML=r[p];
		}

		var mod=get("carModificationId");
		mod.value=r.id;
	});
}
Car.onSelectChange=function(parentSelect){
	FX.fadeOut(get("carDetails"),0,250);

	var childName=parentSelect.getAttribute("child");
	if(!childName)return;

	var parentForm=HTML.parent(parentSelect,"form",null,true);
	var childSelect=parentForm[childName];
	Car.resetSelect(childSelect,childSelect.getAttribute("hint"));
	if(parentSelect.options[parentSelect.selectedIndex].value==''||parentSelect.options[parentSelect.selectedIndex].value=='%%%NULL%%%')return;

	// clear children of this child:
	var c=parentForm[childSelect.getAttribute("child")];
	while(c){
		Car.resetSelect(c,c.getAttribute("hint"));
		var c=parentForm[c.getAttribute("child")];
	}

	// remove iFocus/edit from all inputs:
	var divs=parentForm.getElementsByTagName("div");
	for(var i=0;i<divs.length;i++){
		CSS.r(divs[i],"iFocus");
	}

	Car.request(childName,function(r){
		Car.fillSelect(childSelect,r);
		childSelect.focus();
		var parentIDiv=HTML.parent(childSelect,"div","i",true);

		var length=0;
		for(k in r) length++;
		if(length==0){
			// no records - allow manual editing in all children:
			CSS.a(parentIDiv,"edit");
			var c=parentForm[childSelect.getAttribute("child")];
			while(c){
				CSS.a(HTML.parent(c,"div","i",true),"edit");
				var c=parentForm[c.getAttribute("child")];
			}
		}
		else {
			CSS.r(parentIDiv,"edit");
			if(length==1){
				childSelect.selectedIndex=1;
				Event.fire(childSelect,"change");
			}
			else CSS.a(parentIDiv,"iFocus");
		}
	});
}
Car.request=function(what,callback){
	var producers=get("carProducerId");
	var models=get("carModelId");
	var years=get("carYear");
	var powers=get("carPower");
	var volumes=get("carVolume");
	var gearIds=get("carGearId");

	var ajax=new Ajax();
	var r="what="+what
		+"&producerId="+producers.options[producers.selectedIndex].value
		+"&modelId="+models.options[models.selectedIndex].value
		+"&year="+years.options[years.selectedIndex].value
		+"&power="+powers.options[powers.selectedIndex].value
		+"&gearId="+gearIds.options[gearIds.selectedIndex].value;
	ajax.onResponse=function(x){
		var r=eval("("+x.responseText+")");
		if(callback)callback(r);
	}
	ajax.send("/GarageEditPage.json",r);//?rnd"+Math.random());
}
Car.fillSelect=function(cc,records){
	for(key in records){
		var o=document.createElement("option");
		o.value=key;
		o.text=records[key];
		try {
			cc.add(o,null); // standards compliant; doesn-t work in IE
		}
		catch(ex) {
			cc.add(o); // IE only
		}
	}
	cc.disabled=false;
}
Car.resetSelect=function(cc,text){
	var mod=get("carModificationId");
	mod.value="";

	var parentIDiv=HTML.parent(cc,"div","i",true);
	CSS.r(parentIDiv,"edit");

	while(cc.options.length>0){
		cc.remove(cc.options.length-1);
	}
	var o=document.createElement("option");
	o.text=text;
	o.value="";
	try{
		cc.add(o,null); // standards compliant; doesn't work in IE
	}
	catch(ex) {
		cc.add(o); // IE only
	}
	CSS.a(cc,"hint");
	cc.disabled=true;
}
onReadys.push(Car.initPage);