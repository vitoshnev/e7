var CarPageStock={};
CarPageStock.init=function(){
	if(!isWindowLoaded){
		setTimeout("CarPageStock.init()",500);
		return;
	}

	if(get("stock"))CSS.a(get("stock"),"visible");
}

onReadys.push(CarPageStock.init);
