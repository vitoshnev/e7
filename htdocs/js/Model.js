var Model={};
Model.modelDefaultText="Модель*";
Model.initPage=function(){
	Model.onProducerChange();
}
Model.onProducerChange=function(){
	var ps=document.getElementById("producers");
	var ms=document.getElementById("models");
	var ms2=document.getElementById("models2");
	Model.resetSelect(ms,Model.modelDefaultText);
	if(ms2)Model.resetSelect(ms2,"-- нет --");

	var p=ps.options[ps.selectedIndex].value;
	if(!p||allModels['p'+p]==undefined){
		ms.disabled=true;
		if(ms2)ms2.disabled=true;
		return;
	}

	var models=allModels['p'+p];
	for(key in models){
		var model=models[key];
		var a=model.split(":");
		var o=document.createElement("option");
		o.value=a[0];
		o.text=a[1];
		if(selectedModelId==a[0]) o.selected='selected';
		try {
			ms.add(o,null); // standards compliant; doesn-t work in IE
		}
		catch(ex) {
			ms.add(o); // IE only
		}
		if(ms2){
			var o=document.createElement("option");
			o.value=a[0];
			o.text=a[1];
			try {
				ms2.add(o,null); // standards compliant; doesn-t work in IE
			}
			catch(ex) {
				ms2.add(o); // IE only
			}
		}
	}
	if (models.length==1){
		ms.selectedIndex=1;
	}
	ms.disabled=false;
	ms.focus();
	if(ms2){
		ms2.disabled=false;
	}
}
Model.resetSelect=function(cc,text){
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
	cc.disabled=true;
}
onReadys.push(Model.initPage);