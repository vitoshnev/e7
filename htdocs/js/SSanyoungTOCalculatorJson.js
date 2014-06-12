var SSanyoungTOCalculator={};
var STC=SSanyoungTOCalculator;
STC.requestId=0;
STC.countAndShow=function(){
	STC.isUpdating=true;
	var f = get("formToCalc");
	// alert("111");
	// check(f);
	if (!f.model.value) {
		alert("Пожалуйста, выберите модель");
		return false;
	}
	if (!f.visitOn.value) {
		alert ("Пожалуйста, укажите дату покупки");
		return false;
	}
	var ajax=new Ajax();
	STC.requestId++;
	var r="requestId="+encodeURI(STC.requestId)
		+"&model="+encodeURI(f.model.value)
		+"&visitOn="+encodeURI(f.visitOn.value)
		// +"&visitYear="+encodeURI(f.visitYear.value)
		// +"&visitMonth="+encodeURI(f.visitMonth.value)
		// +"&visitDay="+encodeURI(f.visitDay.value)
		+"&year1="+encodeURI(f.year1.value)
		+"&year2="+encodeURI(f.year2.value)
		+"&run1="+encodeURI(f.run1.value)
		+"&run2="+encodeURI(f.run2.value);

	ajax.onResponse=function(r){
		//var resp = {"o":"123","qwer":"1234"};
		//resp = r.responseText;
		var r=eval("("+r.responseText+")");  // Using "eval" to make fy object from the string.
		//alert(r.table);
		var el=get("calculator");
		//el.innerHTML=el.innerHTML+r.responseText;
		el.innerHTML=r.calculator;
	}


	ajax.send("/SSanyoungTOCalculator.json",r);//?rnd"+Math.random());
	return false;
}