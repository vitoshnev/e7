var CarPageComplects={};
var CPC=CarPageComplects;
CarPageComplects.init=function(){
	if(!get("complects"))return;

	Event.on(self,"scroll",CarPageComplects.onWScroll);
	Event.on(self,"resize",CarPageComplects.onWSize);

	CarPageComplects.drawHeader();
}

CarPageComplects.drawHeader=function(){
	var header=HTML.child(get("complects"),"div","header");
	if(header){
		get("complects").removeChild(header);
	}
	var table=HTML.child(get("complects"),"table");

	var trs=table.getElementsByTagName("tr");
	var t=d.createElement("table");
	var height=0;
	for(var i=0;i<trs.length;i++){
		var tr=trs[i];
		if(tr.className.indexOf("header")!=-1){
			height+=tr.offsetHeight;
		}
	}

	var t=table.cloneNode(true);
	t.className="header";

	var div=d.createElement("div");
	div.className="header";
	div.style.width=table.offsetWidth+"px";
	div.style.height=(height)+"px";
	//div.style.top=Screen.absOffset(table,"offsetTop")+"px";
	div.style.left=Screen.absOffset(table,"offsetLeft")+"px";
	get("complects").appendChild(div);

	div.appendChild(t);
}

CarPageComplects.onWSize=function(){
	CarPageComplects.drawHeader();
}

CarPageComplects.onWScroll=function(){
	var header=HTML.child(get("complects"),"div","header");
	var table=HTML.child(get("complects"),"table");

	Screen.getScroll();
	var top=Screen.absOffset(table,"offsetTop");
	if(top<Screen.scrollTop)CSS.a(header,"visible");
	else CSS.r(header,"visible");
}

onReadys.push(CarPageComplects.init);
