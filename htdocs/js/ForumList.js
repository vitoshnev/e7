var ForumList={};
ForumList.toggleForm=function(){
	var f=get("submitForm");
	CSS.addClass(f,"shown");
	get("submitFormToggler").style.display="none";
	//self.location.href="#submitForm";
}