function classAdd(el,c){
	classRemove(el,c);
	if(el.className.length>0)el.className+=" "+c;
	else el.className=c;
}
function classRemove(el,c){
	if(!el.className)el.className="";
	var cc=el.className.split(" ");
	var cc2=new Array();
	for(var i=0;i<cc.length;i++){
		cc[i]=cc[i].replace(" ","");
		if(cc[i]==c)continue;
		cc2.push(cc[i]);
	}
	el.className=cc2.join(" ");
}