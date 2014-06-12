function select(){
}
select.lastSelectId=null;
select.select=function(sId){
	var s=get(sId);
	var id=sId.substring(6);
	var div=get("list"+id);
	if(select.lastSelectId!=null)select.done(select.lastSelectId);
	select.lastSelectId=sId;

	//div.style.left=(Screen.absOffset(s,"offsetLeft")-2)+"px";
	div.style.left=s.offsetLeft+"px";
	//div.style.top=Screen.absOffset(s,"offsetTop")+"px";
	div.style.top=s.offsetTop+"px";
	div.style.width="350px";

	CSS.addClass(s,'selectHidden');
	//get("btnSubmit").focus();
}
select.done=function(sId){
	if(!sId){
		if(select.lastSelectId!=null)sId=select.lastSelectId;
		else return;
	}
	var s=get(sId);
	var id=sId.substring(6);
	var div=get("list"+id);

	var inputs=div.getElementsByTagName("input");
	var labels=new Array();
	var ids=new Array();
	var totalInputs=0;
	for(var i=0;i<inputs.length;i++){
		var input=inputs[i];
		if(input.getAttribute("type")!="checkbox")continue;
		totalInputs++;
		if(!input.checked)continue;
		ids.push(input.value);
		labels.push(input.getAttribute("label"));
	}
	if(labels.length==0||labels.length==totalInputs)select.resetSelect(s,"не важно");
	else select.resetSelect(s,labels.join(", "));
	///get(id+"Ids").value=ids;

	CSS.removeClass(s,'selectHidden');
	div.style.left="-1000px";
	div.style.top="-10000px";
	select.lastSelectId=null;
}
select.reset=function(sId){
	var s=get(sId);
	var id=sId.substring(6);
	var div=get("list"+id);
	CSS.removeClass(div,'visible');

	var inputs=div.getElementsByTagName("input");
	for(var i=0;i<inputs.length;i++){
		var input=inputs[i];
		if(input.getAttribute("type")!="checkbox")continue;
		input.checked=false;
	}
	select.resetSelect(s,"не важно");
	///get(id+"Ids").value="";

	CSS.removeClass(s,'selectHidden');
	div.style.left="-1000px";
	div.style.top="-10000px";
	select.lastSelectId=null;
}
select.resetSelect=function(cc,text){
	var span=get(cc.id+"Text");
	span.innerHTML=text;
	return;

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
}
select.onWResize=function(){
	if(select.lastSelectId!=null)select.select(select.lastSelectId);
}
select.init=function(){
	Event.on(window,"resize",select.onWResize);
}
onReadys.push(select.init);