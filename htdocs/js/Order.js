var OrderMap={};
OrderMap.DEFAULT_LNG=30.34;
OrderMap.DEFAULT_LAT=59.93;
OrderMap.DEFAULT_ZOOM=10;

OrderMap.map=null;
OrderMap.curPlacemark=null;
OrderMap.toggle=function(){
	var b=get('orderMapBlock');
	var isShown=!CSS.t(b,'invisible');
	if(isShown){
		//if(!OrderMap.map)ymaps.ready(OrderMap.init);
		//FX.fadeIn(b,1,500,OrderMap.setByAddress);
		//OrderMap.setByAddress();
	}
	//else CSS.setOpacity(b,0);
}
OrderMap.onAddressChange=function(){
	OrderMap.setByAddress(false);
}
OrderMap.init=function(){
	var lng=get("orderLng").value;
	var lat=get("orderLat").value;
	var zoom=get("orderZoom").value;
	if(lat!=""&&lng!=""&&zoom!=""){
		OrderMap.map=new ymaps.Map("orderMap", {
				center: [lat, lng],
				zoom: zoom
			}
		);

		OrderMap.addPoint([lat, lng],OrderMap.getFormAddress(false));
	}
	else {
		OrderMap.map=new ymaps.Map("orderMap", {
				center: [OrderMap.DEFAULT_LAT, OrderMap.DEFAULT_LNG],
				zoom: OrderMap.DEFAULT_ZOOM
			}
		);

		// try to set from form:
		OrderMap.setByAddress();
	}

	OrderMap.map.controls.add("zoomControl");

	OrderMap.map.events.add("boundschange",
		function(e) {
			get("orderZoom").value=OrderMap.map.getZoom();
		}
	);
}
OrderMap.setByAddress=function(){
	var a=OrderMap.getFormAddress(true);
	if(a==null)return;

	var map=OrderMap.map;
	var geocoder=ymaps.geocode(a,{results:1});

	get("orderAddress").setAttribute("preventSubmit","Обновляются координаты карты... Пожалуйста подождите.");
	geocoder.then(function(res) {
        if(!res.geoObjects.getLength()) {
			alert("К сожалению введенный адрес не распознан:\n"+a+"\nПожалуйста, укажите позицию на карте вручную.");
			return;
		}

		var point=res.geoObjects.get(0);
		var coords=point.geometry.getCoordinates();

		OrderMap.addPoint(coords,a,true);

		get("orderLat").value=coords[0];
		get("orderLng").value=coords[1];
		get("orderZoom").value=map.getZoom();
		get("orderAddress").setAttribute("preventSubmit","");
	}
	,function(error){
		alert("К сожалению введенный адрес не распознан:\n"+a+"\nПожалуйста, укажите позицию на карте вручную.");
		get("orderAddress").setAttribute("preventSubmit","");
	});
}
OrderMap.addPoint=function(coords,address,pan){
	if(OrderMap.curPlacemark)OrderMap.map.geoObjects.remove(OrderMap.curPlacemark);

	OrderMap.curPlacemark = new ymaps.Placemark(
		coords, {
			balloonContent: address,
		},{
			draggable: true,
		}
	);
	
	OrderMap.curPlacemark.events.add("dragend",
		function (e) {
			var coords=OrderMap.curPlacemark.geometry.getCoordinates();
			get("orderLat").value=coords[0];
			get("orderLng").value=coords[1];
			get("orderZoom").value=OrderMap.map.getZoom();
		}
	);

	OrderMap.map.geoObjects.add(OrderMap.curPlacemark);
	if(pan){
		OrderMap.map.panTo(coords,{flying: true,checkZoomRange:false,callback:function(){OrderMap.map.setZoom(14);}});
	}
}
OrderMap.getFormAddress=function(isStrict){
	var c=get("cityId");
	var cityId=c.options[c.selectedIndex].value;
	var city=c.options[c.selectedIndex].text;
	if(cityId==""){
		if(isStrict){
			alert("Пожалуйста, укажите город в форме.");
			c.focus();
		}
		return null;
	}

	var a=get("orderAddress").value;
	if(a==""){
		if(isStrict){
			alert("Пожалуйста, укажите адрес в форме.");
			get("orderAddress").focus();
		}
		return city;
	}
	return city+", "+a;
	//return a;
}

var Order={};
Order.checkForm=function(f){
	var hasServices=false;
	for(i=0;i<f.elements.length;i++){
		var el=f.elements[i];
		if(el.name.match(/^service\d+$/)&&el.value==1){
			hasServices=true;
			break;
		}
	}
	if(!hasServices){
		alert("Необходимо выбрать как минимум один вид необходимых услуг!");
		return false;
	}
	return Form.check(f);
}
Order.toggle=function(name,id){
	var i=get(name+id);
	var s=get(name+"LI"+id);
	if(i.value>0){
		i.value=0;
		CSS.r(s,"checked");
	}
	else{
		i.value=1;
		CSS.a(s,"checked");
	}
}
Order.onCarChange=function(){
	var s=get("carId");
	var carUL=get("cars");
	var lis=carUL.getElementsByTagName("li");
	for(var i=0;i<lis.length;i++){
		var li=lis[i];
		li.style.display="none";
	}

	if(!s.selectedIndex)return;
	var carLI=get("car"+s.options[s.selectedIndex].value);
	CSS.setOpacity(carLI,0);
	carLI.style.display="block";
	FX.fadeIn(carLI,1,500);
}

if(typeof ymaps!="undefined")ymaps.ready(OrderMap.init);
//onReadys.push(Order.init);