var Tabs={};
Tabs.onSet=null;
Tabs.currentName=null;
Tabs.set=function(name){
	if(!Tabs.currentName){
		// try to detect selected li:
		var uls=d.getElementsByTagName("UL");
		for(var i=0;i<uls.length;i++){
			var ul=uls[i];
			if(ul.className.indexOf("tabs")==-1)continue;
			var lis=ul.childNodes;
			for(var j=0;j<lis.length;j++){
				var li=lis[j];
				if(li.tagName!="LI")continue;
				if(li.className.indexOf(" sel")==-1&&
					li.className.indexOf("sel ")==-1&&
					li.className!="sel")continue;
				if(!li.id||!li.id.match(/tab(.+)/))continue;
				Tabs.currentName=li.id.substr(3);
				break;
			}
		}
	}
	if(Tabs.currentName){
		var li=get("tab"+Tabs.currentName);
		CSS.removeClass(li,'sel');
		var content=get("tabContent"+Tabs.currentName);
		if(content)CSS.removeClass(content,'sel');

		li.setAttribute("isSelTab",0);
	}
	Tabs.currentName=name;
	var li=get("tab"+Tabs.currentName);
	CSS.addClass(li,'sel');
	var content=get("tabContent"+Tabs.currentName);
	if(content)CSS.addClass(content,'sel');

	if(Tabs.onSet)Tabs.onSet(name);

	li.setAttribute("isSelTab",1);

	// set siblings:
	var ul=HTML.parent(li,"UL",null,true);
	var children=ul.childNodes;
	var lis=new Array();
	for(var j=0;j<children.length;j++){
		var li2=children[j];
		if(li2.tagName!="LI")continue;
		lis.push(li2);
	}
	for(var j=0;j<lis.length;j++){
		var li2=lis[j];
		if(lis[j+1]==li){
			// this is a left sibling:
			CSS.a(li2,"leftSibling");
			CSS.r(li2,"rightSibling");
		}
		else if(lis[j-1]==li){
			// this is a right sibling:
			CSS.a(li2,"rightSibling");
			CSS.r(li2,"leftSibling");
		}
		else {
			CSS.r(li2,"leftSibling");
			CSS.r(li2,"rightSibling");
		}
	}
}