var FirmProfileServices={};
var FPS=FirmProfileServices;
FPS.toggle=function(name,id){
	var i=get(name+id);
	var s=get(name+"LI"+id);
	if(i.value>0){
		i.value=0;
		CSS.r(s,"checked");
	}
	else{
		i.value=1;
		CSS.a(s,"checked");
	}
}
FPS.setAll=function(name){
	var tr=get(name+"s");
	var lis=HTML.getAll(tr,"li",name);
	for(var i=0;i<lis.length;i++){
		var li=lis[i];
		CSS.a(li,"checked");
		var id=li.id.substring(name.length+2);

		get(name+id).value=1;
	}
}
FPS.clearAll=function(name){
	var tr=get(name+"s");
	var lis=HTML.getAll(tr,"li",name);
	for(var i=0;i<lis.length;i++){
		var li=lis[i];
		CSS.r(li,"checked");
		var id=li.id.substring(name.length+2);

		get(name+id).value=0;
	}
}
