function Task(){
}
// static items:
Task.del=function(id){
	PP.confirm("Удалить запись?",function(ok){
		if(!ok)return;
		var f=get("FormTaskDel");
		f.id.value=id;
		f.entity.value="Task";
		Ajax.processForm(f);
	});
}
Task.setStatus=function(id,status){

		var f=get("FormUpdateTaskStatus");
		f.id.value=id;
		f.entity.value="Task";
		f.status.value=status;
		Ajax.processForm(f);
}
Task.membersWnd=null;
Task.memberPlus=function(id){
	if(!Task.membersWnd) var wnd=new Wnd();
	else wnd=Task.membersWnd;

	wnd.h1="Добавить участника задачи";
	wnd.onLoad=function(){
		var d=wnd.elIframe.contentWindow.document;
		d.addEventListener("UserClick",function(e){
			//alert(e+":"+e.detail.id);
			wnd.hide();

			var f=get("FormTaskUser");
			f.reset();
			f.taskId.value=id;
			f.userId.value=e.detail.id;
			Ajax.processForm(f);

		},false);
	};
	wnd.showModal("/WndList.html?entity=User&view=1");
}
