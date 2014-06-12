function User(){
}
// static items:
User.click=function(id){
	document.dispatchEvent(new CustomEvent('UserClick',{'detail':
		{"id":id}
	}));
}
