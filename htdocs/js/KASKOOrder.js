var KASKOOrder={};
KASKOOrder.onPostChange=function(){
	var i=get("iOtherModel");
	var s=get("sPost");
	if(s.options[s.selectedIndex].value==-1)i.style.display="block";
	else i.style.display="none";
}