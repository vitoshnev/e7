var UserInternalPage={};
var UIP=UserInternalPage;
UIP.posItem=function(entity,id,s,redirect){
	var f=get("UIPFormPosItem");
	f.id.value=id;
	f.entity.value=entity;
	f.pos.value=s.selectedIndex+1;
	if(redirect!=undefined)f.redirect.value=redirect;
	f.submit();
}
UIP.toggleItem=function(entity,id,prop,redirect){
	var f=get("UIPFormToggleItem");
	f.id.value=id;
	f.entity.value=entity;
	f.prop.value=prop;
	if(redirect!=undefined)f.redirect.value=redirect;
	f.submit();
}
UIP.delItem=function(entity,id,confirmText,redirect){
	if(!confirm((confirmText?confirmText:"Удалить данную запись?")))return;
	var f=get("UIPFormDelItem");
	f.id.value=id;
	f.entity.value=entity;
	if(redirect!=undefined)f.redirect.value=redirect;
	f.submit();
}
UIP.friendRequest=function(customerId){
	var ajax=new Ajax();
	ajax.onResponse=function(x){
		var rs=eval('('+x.responseText+')');
		if(rs.success)alert("Запрос отправлен пользователю.");
	};
	ajax.send("/CustomerFriendRequest.json",
		"id="+encodeURI(customerId)
		);
}
//onReadys.push(AdminPage.init);
