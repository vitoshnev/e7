/*********************************
	Call request functions
*/
PublicPage.isCallRequestShown=false;
PP.ruTarget=false;
PP.ymlId=null;
PublicPage.ymGoalCallRequest=null;
PublicPage.ymGoalCallRequestSubmit=null;
PublicPage.withTime=false;


PublicPage.showCallRequestForm=function(text,theme,target,withEmail,withMsg,models,ymGoal,ymGoalSubmit,ruTarget,formClass,withDates,withTime,ymlId){
	// объектынй вариант аргументов:
	if(text&&typeof(text)=="object"){
		var theme=text["theme"];
		var withHiddenTheme=text["withHiddenTheme"];
		var target=text["target"];
		var title=text["title"];
		var withEmail=text["withEmail"];
		var withMsg=text["withMsg"];
		var models=text["models"];
		var ymCounter=text["ymCounter"];
		var ymGoal=text["ymGoal"];
		var ymGoalSubmit=text["ymGoalSubmit"];
		var withPhoneOrEmail=text["withPhoneOrEmail"];
		var btn=text["btn"];
		var ruTarget=text["ruTarget"];
		var formClass=text["formClass"];
		var withDates=text["withDates"];
		var withTime=text["withTime"];
		var ymlId=text["ymlId"];
		var text=text["text"];
		
		PublicPage.withTime=withTime;
	}
	// alert(PP.ymlId);
	if(ymlId){
		PP.ymlId=ymlId;
	}
	// alert(PP.ymlId);
		
	// дефолтные цели:
	ymGoal=typeof(ymGoal)!="undefined"&&ymGoal?ymGoal:PublicPage.ymGoalCallRequest;
	ymGoalSubmit=typeof(ymGoalSubmit)!="undefined"&&ymGoalSubmit?ymGoalSubmit:PublicPage.ymGoalCallRequestSubmit;
	
	PublicPage.globalFormClass=formClass;
	if(ruTarget){
		PP.ruTarget=ruTarget;
	}
	else PP.ruTarget=null;
	PP.ruTargetTestDrive = false;
	
	if(ruTarget=='testDrive'){
		PP.ruTargetTestDrive = true;
	    //RuTarget
		if(PP.ymlId){
			//RuTarget
			var _rutarget = window._rutarget || []; 
			_rutarget.push({'event': 'confirmOrder', 'qty': 1, 'sku': PP.ymlId }); 
			// alert(PP.ymlId); 
			//RuTarget
		}
		// alert("!");
		//RuTarget
	}
	if(ruTarget=='orderConfig' && PP.isRuTargetOrder==false){
		PP.isRuTargetOrder=true;
		// var evnt=get("formCallRequest").getAttribute('onSubmit');//+="rtg()";

		// Event.on(get("formCallRequest"), "submit", evnt+'; rtg();');

		get("callRequestFormMain").innerHTML+="<!-- RuTarget --><script type=\"text/javascript\">"
			+"function rtg(){"
				+"var _rutarget = window._rutarget || [];"
				+" var id; var data = window.location.href.split(\"/\");"
				+"if(data.length> 4){id = "+PP.ymlId+"}"
				+"_rutarget.push({'event': 'addToCart', 'sku': id });"
			+"};"
			+"var ele= document.forms[\"formCallRequest\"];"
			+"if(ele !== undefined ){"
			+"if(ele.addEventListener){ele.addEventListener(\"submit\", rtg, false);}"
			+"else if (ele.attachEvent){"
			+"ele.attachEvent('onsubmit', rtg)}"
			+"}</script><!-- /RuTarget -->";
	}

	// регистрируем цели Метрики:
	if(PublicPage.metrikaCounter){
		// общая цель CallRequst:
		PublicPage.metrikaCounter.reachGoal('CallRequest',PublicPage.metrikaParams);
		// частная цель, заданная аргументами
		if(ymGoal)PublicPage.metrikaCounter.reachGoal(ymGoal,PublicPage.metrikaParams);
	}

	// remove iFocus/edit from all inputs:
	var divs=get("formCallRequest").getElementsByTagName("div");
	for(var i=0;i<divs.length;i++){
		CSS.r(divs[i],"iFocus");
	}

	if(text) get("callRequestText").innerHTML=text;
	else get("callRequestText").innerHTML="Пожалуйста, укажите Ваше имя и телефон и мы перезвоним Вам в самое ближайшее время!";

	if(theme) {
		get("formCallRequest").msg.value=theme;
		CSS.r(get("formCallRequest").msg,"hint");
	}
	else {
		get("formCallRequest").msg.value="";
		Form.setHint(get("formCallRequest").msg);
	}

	if(title) {
		CSS.r(get("callRequestTitle"),"hidden");
		get("callRequestTitle").innerHTML=title;
	}
	else {
		CSS.a(get("callRequestTitle"),"hidden");
	}

	if(withMsg) {
		CSS.a(get("callRequestTRMsg"),"hidden");
		CSS.r(get("callRequestTRMsg2"),"hidden");
	}
	else {
		CSS.a(get("callRequestTRMsg2"),"hidden");
		CSS.r(get("callRequestTRMsg"),"hidden");
	}

	if(withDates){
		CSS.r(get("callRequestTRDates"),"hidden");
	}
	if(withTime || target=="PEUGEOT"){
		PublicPage.withTime=true;
		CSS.r(get("callRequestTRTime"),"hidden");
		if(target=="PEUGEOT"){
			get("formCallRequest").visitHour.getElementsByTagName('option')[0].selected = 'selected'
			get("formCallRequest").visitMinute.getElementsByTagName('option')[0].selected = 'selected'
		}
	}

	if(withHiddenTheme) {
		CSS.a(get("callRequestTRMsg"),"hidden");
	}
	else CSS.r(get("callRequestTRMsg"),"hidden");

	if(target) get("formCallRequest").target.value=target;
	else get("formCallRequest").target.value="";

	if(btn) get("callRequestBtn").value=btn;
	else get("callRequestBtn").value="Отправить";

	if(ymGoalSubmit) get("formCallRequest").ymGoalSubmit.value=ymGoalSubmit;
	else get("formCallRequest").ymGoalSubmit.value="";

	var trEmail=get("callRequestTREmail");
	var inputEmail=get("callRequestInputEmail");
	if(withEmail||withPhoneOrEmail) CSS.r(trEmail,"hidden");
	else CSS.a(get("callRequestTREmail"),"hidden");

	var trPhone=get("callRequestTRPhone");
	var inputPhone=get("callRequestInputPhone");
	if(withPhoneOrEmail){
		inputPhone.setAttribute("hint","Ваш телефон");
		inputPhone.setAttribute("validationIf","(get('callRequestInputEmail').value==''||get('callRequestInputEmail').className.indexOf('hint')!=-1)");
		inputPhone.setAttribute("validationMsg","Пожалуйста, введите Ваш телефон или E-mail.");
		inputPhone.setAttribute("validationMaskMsg","Пожалуйста, введите Ваш телефон в формате<br />+7 921 999 8877<br />или корректный E-mail.");

		inputEmail.setAttribute("hint","или Ваш E-mail");
		inputEmail.setAttribute("validation","Ваш E-mail");
		inputEmail.setAttribute("validationIf","(get('callRequestInputPhone').value==''||get('callRequestInputPhone').className.indexOf('hint')!=-1)");
		inputEmail.setAttribute("validationMsg","Пожалуйста, введите Ваш телефон или E-mail.");
		inputEmail.setAttribute("validationMaskMsg","Пожалуйста, введите Ваш телефон в формате<br />+7 921 999 8877<br />или корректный E-mail.");
	}
	else {
		inputPhone.setAttribute("hint","Ваш телефон*");
		inputPhone.setAttribute("validationIf","");
		inputPhone.setAttribute("validationMsg","Пожалуйста, введите Ваш телефон.");
		inputPhone.setAttribute("validationMaskMsg","Пожалуйста, введите телефон в формате +7 921 999 8877.");

		inputEmail.setAttribute("hint","Ваш E-mail");
		inputEmail.setAttribute("validation","");
	}
	Form.setHint(inputPhone);
	Form.setHint(inputEmail);

	if(models&&models.length>0){
		var modelSelectorFrame=get("callRequestTRModel");
		try{
			modelSelector=get("callRequestTRModelSelect");
			for(i=0; i<models.length; i++){
				var nextOption = document.createElement("option");
				nextOption.text=models[i];
				nextOption.value=models[i];
				try{
					modelSelector.add(nextOption, null);
				}
				catch(ex){
					modelSelector.add(elOptNew); // for IE only
				}
			}
		}
		catch (e){
			modelSelectorFrame.setAttribute("class","hidden");
		}
		modelSelectorFrame.removeAttribute("class");
		modelSelector.setAttribute("validation","Модель");
	}

	// show form:
	PublicPage.isCallRequestShown=true;

	var l=d.getElementById("callRequestFormLoading");
	l.style.display="none";
	var l=d.getElementById("callRequestFormMain");
	l.style.display="block";

	var c=d.getElementById("callRequestForm");
	CSS.setOpacity(c,0);
	c.style.display="block";
	PublicPage.placeCallRequestForm();
	FX.fadeIn(c,1,250);
	// alert(formClass);
	if(PublicPage.globalFormClass){
		CSS.a(c,PublicPage.globalFormClass);
	}

	PP.showFade();
	Event.off(PP.fade,"click", PublicPage.closeCallRequestForm);
	Event.on(PP.fade,"click",PublicPage.closeCallRequestForm);
	Event.off(self,"keydown",PublicPage.callRequestKeyHandler);
	Event.on(self,"keydown",PublicPage.callRequestKeyHandler);
}
var cr=PP.showCallRequestForm; // shorter alias;
PublicPage.callRequestKeyHandler=function(e){
	if(e.keyCode=='27'){
		// we close form if the escape key was pressed
		Event.off(self,'keydown',PublicPage.callRequestKeyHandler);
		PublicPage.closeCallRequestForm();
	}
}
PublicPage.closeCallRequestForm=function(){
	if(!PP.isCallRequestShown)return;
	PublicPage.isCallRequestShown=false;

	var c=get("callRequestForm");
	FX.fadeOut(c,0,250,function(fx){
		var c=get("callRequestForm");
		c.style.display="none";
	});

	CSS.a(get("callRequestTRDates"),"hidden");
	CSS.a(get("callRequestTRTime"),"hidden");


	Form.closeError();
	PublicPage.hideFade();
	Event.off(PP.fade,"click",PublicPage.closeCallRequestForm);
	Event.off(self,'keydown',PublicPage.callRequestKeyHandler);
}
PublicPage.placeCallRequestForm=function(){
	if(!PublicPage.isCallRequestShown)return;

	var c=d.getElementById("callRequestForm");
	var s=Screen.scrollTop;
	//alert(s+" : "+Screen.height/2 + " : "+ c.offsetHeight);
	c.style.top=Math.round(s+Screen.height/2-c.offsetHeight/2)+"px";
	c.style.left=Math.round(Screen.width/2-c.offsetWidth/2)+"px";
	
	// var phoneField=get("callRequestInputPhone");
	
	// if(phoneField){
		// Event.on(phoneField,'input',Form.phonePattern(phoneField));
		// Event.on(phoneField,'change',Form.phonePattern(phoneField));
	
	// }
}

PublicPage.submitCallRequestForm=function(f){
	if(!Form.check(f))return false;
	Form.closeError();

	f.target.value=f.target.value.replace(/ /,'-');

	// alert("!"+f.requestYear);

	// регистрируем цели Метрики:
	if(PublicPage.metrikaCounter){

		// общая цель
		PublicPage.metrikaCounter.reachGoal('CallRequestSubmit',PublicPage.metrikaParams);

		// частная цель по конкретному таргету
		if(f.target.value){
			PublicPage.metrikaCounter.reachGoal("CallRequestSubmit"+f.target.value,PublicPage.metrikaParams);
		}

		// частная цель, заданная для этой формы
		if(get("formCallRequest").ymGoalSubmit.value){
			PublicPage.metrikaCounter.reachGoal(get("formCallRequest").ymGoalSubmit.value,PublicPage.metrikaParams);
		};
	}

	var p=d.getElementById("callRequestFormMain");
	p.style.display="none";
	var l=d.getElementById("callRequestFormLoading");
	l.style.display="block";
	var ajax=new Ajax();
	
	// alert(get('callRequestTRTime').getAttribute('class').indexOf('hidden'));
	// alert(PublicPage.withTime);
	
	var r="name="+encodeURI(f.name.value)
		+"&phone="+encodeURI(f.phone.value)
		+"&model="+encodeURI(f.model.value)
		+"&target="+encodeURI(f.target.value)
		+(f.requestDay?("&requiredDay="+encodeURI(f.requestDay.value)):"")
		+(f.requestYear?("&requiredYear="+encodeURI(f.requestYear.value)):"")
		+(f.requestMonth?("&requiredMonth="+encodeURI(f.requestMonth.value)):"")
		+((PublicPage.withTime&&f.visitHour)?("&visitHour="+encodeURI(f.visitHour.value)):"")
		+((PublicPage.withTime&&f.visitMinute)?("&visitMinute="+encodeURI(f.visitMinute.value)):"")
		+"&msg="+encodeURI(f.msg.value)
		+"&msg2="+encodeURI(f.msg2.value)
		+"&email="+encodeURI(f.email.value);
// alert(r);

	ajax.onResponse=function(x){
		//f.reset();
		d.getElementById("callRequestForm").style.display="none";

		PublicPage.fadeLock=true;
		PublicPage.closeCallRequestForm();
		PublicPage.isCallRequestShown=false;
		PublicPage.fadeLock=false;

		var r=eval("("+x.responseText+")");
		if(r.status=="Ok!"){
			if(typeof(isSuccess)=="undefined"){
				// register Metrika cancel goal:
				if(PublicPage.metrikaCounter)PublicPage.metrikaCounter.reachGoal('CallRequestCancel',PublicPage.metrikaParams);
			}

			if(PP.ruTargetTestDrive){
				function rtgThankYou(){
				// alert("!");
					var _rutarget = window._rutarget || [];
					_rutarget.push({'event': 'thankYou', 'qty': 1, 'sku': PP.ymlId});
				}
				rtgThankYou();
			}
			if(PP.isRuTargetOrder){
				function rtg(){

					var _rutarget = window._rutarget || [];
					var id;
					var data = window.location.href.split("/");
					if(data.length > 4){
						id = PP.ymlId;
					}
					_rutarget.push({'event': 'addToCart', 'sku': id });
				};
				rtg();
			}
			PP.alert("Спасибо!\nНаш менеджер свяжется с Вами в ближайшее время!",false,null,true);
			// alert("!");
		}
		else PP.alert(r.status,false,null,true);
	}
	ajax.send("/CallRequest.json",r);//?rnd"+Math.random());
	return false;
}