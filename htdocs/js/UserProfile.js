var UserProfile={};
UserProfile.delPhoto=function(f){
	if(!confirm("Удалить изображение?"))return false;
	d.formDelImage.submit();
}
function onChangePerson(i){
	BrowserDetect.init();
	var trBlock=BrowserDetect.browser=="Explorer"?"block":"table-row";
	if(i.value==1){
		d.getElementById("trKPP").style.display="none";
		d.getElementById("innIP").innerHTML="&nbsp;ИП";
		d.getElementById("ogrnIP").innerHTML="&nbsp;ИП";
		d.getElementById("userName").innerHTML="ФИО";
		d.getElementById("addressIP").innerHTML="Адрес регистрации";
	}
	else{
		d.getElementById("trKPP").style.display=trBlock;
		d.getElementById("innIP").innerHTML="";
		d.getElementById("ogrnIP").innerHTML="";
		d.getElementById("userName").innerHTML="Полное название организации";
		d.getElementById("addressIP").innerHTML="Юридический адрес";
	}
}