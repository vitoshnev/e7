var AdminCarPage={};
var ACP=AdminCarPage;
ACP.requestId=0;
ACP.showOther=function(){
	ACP.isUpdating=true;
	
	var ajax=new Ajax();
	ACP.requestId++;
	var r="requestId="+ACP.requestId;
	
	ajax.onResponse=function(r){
		//var resp = {"o":"123","qwer":"1234"};
		//resp = r.responseText;
		var r=eval("("+r.responseText+")");  // Using "eval" to make fy object from the string.
		//alert(r.table);
		var el=get("cars");
		//el.innerHTML=el.innerHTML+r.responseText;
		el.innerHTML=el.innerHTML+r.table;
	}

	
	ajax.send("/AdminTradeInCars.json",r);//?rnd"+Math.random());
	return false;
}