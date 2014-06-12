
var OutForm={};
var OF = OutForm;
// alert("here");
var formSource;
OF.get = function(id){
	return document.getElementById(id);
}
OF.init = function(){

	formSource = OF.detectSource();

	OF.struct(formSource);
}
OF.createCss = function (formSource){
		var css = 'div#feedCont{display:none; position:absolute; top:0; left:0; z-index:10001; width:100%; height:100%; background: rgba(255,255,255,0.8); }';
		css += 'div#feedbackForm{font-size: 1em;display:block; position:relative; top:0; left:0; z-index:10001; margin:0 auto; top:35%; width:455px; padding:1em; height:310px; background:#fff;border:2px solid #adadad; border-radius:10px; box-shadow:0 0 15px #999}';
		css += 'p{color: #595959;font: italic 1.1em "PT Sans",Arial,sans-serif;}';
		css += 'form div.i {background-color: #FFFFFF; border: 1px solid #CCCCCC; color: #4F4F4F; overflow: hidden; padding: 8px;}';
		css += 'form div.i input {border: 0 none; color: #000000; font: 1em Tahoma,Verdana,Sans-Serif; outline: 0 none; padding: 0; width: 100%;}';
		css += 'div#feedbackForm td{border:none;}';
		css += 'div#feedbackForm th{border:none;}';
		css += 'div#feedbackForm p{margin: 18px 0;}';
		css += 'div#feedbackForm div.close{position:absolute;right:0.5em;top:0.5em;width:2em;background:#eee;text-align:center;cursor:pointer;font-size:1em;padding:0.25em 0}';
		css += 'div#feedbackForm textarea{width:120px;}';
		css += 'div#feedbackForm div.close:hover{background:#ed1c24;color:#fff;}';
		css += 'div#feedbackForm div.pad{padding:1em}';
		css += 'div#feedbackFormMain{width:430px;margin:0 auto;}';
		css += 'div#feedbackFormLoading{display:none;width:32px;padding:130px 0 0 0;margin:0 auto;}';
		css += 'div#feedbackForm td{padding: 0.5em 0;}';
		css += 'div#feedbackForm input.btn{background: none repeat scroll 0 0 #007DB1; border: 0 none; border-radius: 5px 5px 5px 5px; color: #FFFFFF; cursor: pointer; font-size: 1.2em; font-weight: bold; height: 32px; margin: 0; padding: 0 0.5em 2px; text-transform: uppercase; width: 200px;}';
		return css;
	}

OF.addStyle = function(formSource){
	var heads = document.getElementsByTagName('head');
	head = heads[0];
	var css = OF.createCss(formSource);
	var style = document.createElement("style");
    style.appendChild(document.createTextNode(css));
    head.appendChild(style);
}
OF.closeForm = function(el){
	form = OF.get(el);
	form.style.display = 'none';
}
OF.submitForm = function(){

}
OF.createForm = function(formSource){
		var form ='<div id="feedCont"><div id="feedbackForm">';
		form +='<div class="close" onClick="OF.closeForm(\'feedCont\')">X</div>';
		form +='<div class="pad">';
		form +='<div id="formHeaderText"><p>Пожалуйста, укажите Ваше имя и телефон и мы перезвоним Вам в самое ближайшее время!</p></div>';
		form +='<div id="feedbackFormLoading"><img src="http://alva-spb.ru/i/busy.gif"></div>';
		form +='<div id="feedbackFormMain">';
		form +="<form name='formFeedback' method='POST' id='formFeedback' action='http://alva-spb.ru/ExternalFos.html'>";
		form +='<input type="hidden" name="redirect" value="http://alva-spb.ru/">';
		form +='<input id="hiddenTarget" type="hidden" name="target" value="">';
		form +='<input type="hidden" name="recievedExternalFos" value="true">';
		form +='<input type="hidden" name="sourceUrl" value="'+formSource+'">';
		form +='<table class="form1" style="width:100%">';
		form +='<tr>';
		form +='<td><div class="i"><input id="userName" onclick="document.getElementById(\'userName\').value=\'\';" hint="Ваше имя*" value="Ваше имя*" name="name" maxlength="64"></div></td></tr>';
		form +='<tr>';
		form +='<td><div class="i"><input id="contactPhone" onclick="document.getElementById(\'contactPhone\').value=\'\';" hint="Контактный Телефон*" value="Контактный Телефон*" name="phone" maxlength="64"></div></td></tr>';
		form +='<tr>';
		form +='<td><div class="i"><input id="requestTheme" onclick="document.getElementById(\'requestTheme\').value=\'\';" hint="Тема обращения" value="Тема обращения" name="msg" maxlength="128"></div></td></tr>';
		form +='<tr>';
		form +='<td><input type="submit" value="Отправить" class="btn"></td></tr>';
		form +='</table>';
		form +='</form>';
		form +='</div></div></div></div>';
		return form;
}
OF.showForm = function(el, text, theme, target){
		
		if(text){
			OF.get('formHeaderText').innerHTML='<p>'+text+'</p>';
		}
		if(theme){
			OF.get('requestTheme').value=theme;
		}
		if(target){
			OF.get('hiddenTarget').value=target;
		}
		form = OF.get(el);
		form.style.display = 'block';
}

OF.struct = function(formSource){
	var globalDiv = OF.get('myMegaDiv');
	var form = OF.createForm(formSource);
	globalDiv.innerHTML = form;
	OF.addStyle(formSource);
}

OF.detectSource = function() {
	var sources = [];
	sources[0] = 'http://www.ssangyong-alva.ru/';
	sources[1] = 'http://www.fiat-alva.ru/';
	sources[2] = 'http://jeep.alva-motors.ru/';
	sources[3] = 'http://chrysler.alva-motors.ru/';
	sources[4] = 'http://dodge.alva-motors.ru/';
	var source = window.location.href;
	for (var i=0; i<sources.length; i++){

		if(source.indexOf(sources[i]) + 1) {
			return sources[i];
		}
	}

}
window.onload = OF.init;

