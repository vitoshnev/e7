var GenericComment={};
GenericComment.cit=function(id){
	var str=null;
	if(document.getSelection){
		// non IE:
		str=document.getSelection();
	}
	else if(document.selection && document.selection.createRange){
		// IE
		var range=document.selection.createRange();
		str=range.text;
	}

	var userName=get("commentUserName"+id).innerHTML;
	if(!str.length)str=get("commentTxt"+id).textContent;

	///var html=FCKeditorAPI.GetInstance("comment").GetHTML();
	///html=html+"<p class='cit'><span class='name'>"+userName+"</span><br />"+str+"</p><p>&nbsp;</p>";
	var html="<div class='cit'><div class='name'>"+userName+"</div>"+str+"</div>";
	FCKeditorAPI.GetInstance("comment").InsertHtml(html);
	self.location.href="#commentsForm";
	FCKeditorAPI.GetInstance("comment").Focus();
}
GenericComment.del=function(id){
	if(!confirm("Удалить эту запись?"))return;
	var f=d.formDelGenericComment;
	f.id.value=id;
	//f.redirect.value=self.location.href;
	f.submit();
}
GenericComment.delFile=function(id){
	if(!confirm("Удалить этот файл?"))return;
	var f=d.formDelGenericCommentFile;
	f.id.value=id;
	//f.redirect.value=self.location.href;
	f.submit();
}
GenericComment.subForum=function(id,div){
	if(!div) div="withSub";
	var el=get(div);
	CSS.a(el,"loading");

	var ajax=new Ajax();
	var r="forumId="+id;
	ajax.onResponse=function(x){
		CSS.r(el,"loading");

		var r=eval("("+x.responseText+")");
		if(r["withSub"]==1) CSS.a(el,"withSub");
		else CSS.r(el,"withSub");
	}
	ajax.send("/ToggleForumSub.json",r);//?rnd"+Math.random());
}
GenericComment.hideUploadForm=function(){
	CSS.r(get("commentsUploadForm"),"visible");
}
GenericComment.showUploadForm=function(){
	CSS.a(get("commentsUploadForm"),"visible");
}
GenericComment.toggleUploadForm=function(){
	var f=get("commentsUploadForm");
	if(f.className.indexOf("visible")==-1)CSS.a(f,"visible");
	else CSS.r(f,"visible");
}
GenericComment.onUpload=function(json){
	GenericComment.hideUploadForm();
	var f=get("commentsFormItself");
	if(f.upload.value)f.upload.value=f.upload.value+"\n"+json;
	else f.upload.value=json;
	
	GenericComment.showUploadedFiles(json);
}
GenericComment.showUploadedFiles=function(json){
	var ul=get("commentsUploadList");
	var x=eval('('+json+')');
	for(var key in x) {
		var name=x[key]['name'];
		var size=x[key]['size'];
		var err=x[key]['error'];
		if(err)continue;

		var i=ul.childNodes.length;

		var li=d.createElement("LI");
		li.setAttribute("id", "commentsUploadedFile"+i);
		li.innerHTML="<span class='name'>"+name+", <span class='size'>"+GenericComment.fileSize(size)+"</span><span class='del' onClick='GenericComment.delUploadedFile("+i+")' title='Удалить'></span><div class='clear'></div>";
		li.setAttribute("key", key);
		//eventOn(li,"mouseover",function(e){ CSS.a(li,"over"); });
		//eventOn(li,"mouseout",function(e){ CSS.r(li,"over"); });
		ul.appendChild(li);
	}
}
GenericComment.delUploadedFile=function(k){
	var ul=get("commentsUploadList");
	var li=get("commentsUploadedFile"+k);
	ul.removeChild(li);
	var k=li.getAttribute("key");

	var f=get("commentsFormItself");
	if(!f.upload.value)return;
	var sets=f.upload.value.split("\n");
	var newSet={};
	for(var i=0;i<sets.length;i++) {
		var x=eval('('+sets[i]+')');
		for(var key in x) {
			var name=x[key]['name'];
			var size=x[key]['size'];
			var err=x[key]['error'];
			if(err)continue;

			if(key!=k)newSet[key]=x[key];
		}
	}
	f.upload.value=JSON.encode(newSet);
	alert(f.upload.value);
}
GenericComment.fileSize=function(s){
	if(s<1024)return s+"&nbsp;б";
	if(s<1048576)return(""+Math.round(s/102.4)/10).replace(/\./,",")+"&nbsp;Кб";
	if(s<1073741824)return(""+Math.round(s/104857.6)/10).replace(/\./,",")+"&nbsp;Мб";
	return(""+Math.round(s/107374182.4)/10).replace(/\./,",")+"&nbsp;Гб";
};
GenericComment.init=function(s){
	var f=get("commentsFormItself");
	if(!f.upload||!f.upload.value)return;
	var sets=f.upload.value.split("\n");
	for(var i=0;i<sets.length;i++) {
		var set=sets[i];
		GenericComment.showUploadedFiles(set);
	}
};

onReadys.push(GenericComment.init);