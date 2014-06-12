var ConfirmationNeeded={
}
ConfirmationNeeded.init=function(){
	BrowserDetect.init();
}
ConfirmationNeeded.check=function(what){
	var f=get("formConfirmation"+what);
	if(!Form.check(f))return false;

	var field=get("confirmationId"+what);
	var btn=get("btn"+what);
	var busy=get("busy"+what);
	var confirmed=get("confirmed"+what);

	if(field.value==""){
		alert("Пожалуйста, введите код.");
		field.focus();
		return false;
	}

	btn.style.display="none";
	busy.style.display="block";

	var ajax=new Ajax();
	var r="confirmationId"+what+"="+encodeURI(field.value);
	ajax.onResponse=function(x){

		busy.style.display="none";

		var r=eval("("+x.responseText+")");
		if(!r["isConfirmed"+what]){
			alert("К сожалению, введеный код подтверждения некорректен!\nПожалуйста, повторите попытку!");
			btn.style.display="block";
		}
		else {
			confirmed.style.display="block";
			field.readonly=true;

			// check all are confirmed:
			var allAreSet=true;
			for(var prop in r) {
				if(!r[prop]){
					allAreSet=false;
					break;
				}
			}
			if(allAreSet){
				get("formConfirmationDone").style.display="block";
			}
		}
	}
	ajax.send("/ConfirmationNeeded.json",r);//?rnd"+Math.random());
	return false;
}
ConfirmationNeeded.repeat=function(what){
	var field=get("confirmationId"+what);
	var btn=get("btn"+what);
	var busy=get("busy"+what);
	var confirmed=get("confirmed"+what);

	confirmed.style.display="none";
	btn.style.display="none";
	busy.style.display="block";

	var ajax=new Ajax();
	var r="repeat"+what+"=1";
	ajax.onResponse=function(x){

		busy.style.display="none";
		btn.style.display="block";

		var r=eval("("+x.responseText+")");
		if(!r["repeatedMsg"]){
			alert("К сожалению, во время повторной попытки произошла ошибка!\nПожалуйста, повторите попытку!");
		}
		else {
			alert(r["repeatedMsg"]);
		}
	}
	ajax.send("/ConfirmationNeeded.json",r);//?rnd"+Math.random());
	return false;
}
ConfirmationNeeded.onUploadOGRN=function(id, fileName, responseJSON){
	get("textOGRN1").style.display="none";
	get("textOGRN2").style.display="block";
}
ConfirmationNeeded.onUploadINN=function(id, fileName, responseJSON){
	get("textINN1").style.display="none";
	get("textINN2").style.display="block";
}

onReadys.push(ConfirmationNeeded.init);

