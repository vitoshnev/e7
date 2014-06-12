var CustomerMap={};
CustomerMap.DEFAULT_LNG=30.34;
CustomerMap.DEFAULT_LAT=59.93;
CustomerMap.DEFAULT_ZOOM=10;

CustomerMap.map=null;
CustomerMap.curPlacemark=null;
CustomerMap.toggle=function(){
	var b=get('customerMapBlock');
	var isShown=!CSS.t(b,'invisible');
	if(isShown){
		//if(!CustomerMap.map)ymaps.ready(CustomerMap.init);
		//FX.fadeIn(b,1,500,CustomerMap.setByAddress);
		//CustomerMap.setByAddress();
	}
	//else CSS.setOpacity(b,0);
}
CustomerMap.onAddressChange=function(){
	CustomerMap.setByAddress(false);
}
CustomerMap.init=function(){
	var lng=get("customerLng").value;
	var lat=get("customerLat").value;
	var zoom=get("customerZoom").value;
	if(lat!=""&&lng!=""&&zoom!=""){
		CustomerMap.map=new ymaps.Map("customerMap", {
				center: [lat, lng],
				zoom: zoom
			}
		);

		CustomerMap.addPoint([lat, lng],CustomerMap.getFormAddress(false));
	}
	else {
		CustomerMap.map=new ymaps.Map("customerMap", {
				center: [CustomerMap.DEFAULT_LAT, CustomerMap.DEFAULT_LNG],
				zoom: CustomerMap.DEFAULT_ZOOM
			}
		);
	}

	CustomerMap.map.controls.add("zoomControl");

	CustomerMap.map.events.add("boundschange",
		function(e) {
			get("customerZoom").value=CustomerMap.map.getZoom();
		}
	);
}
CustomerMap.setByAddress=function(){
	var a=CustomerMap.getFormAddress(true);
	if(a==null)return;

	var map=CustomerMap.map;
	var geocoder=ymaps.geocode(a,{results:1});

	get("customerAddress").setAttribute("preventSubmit","Обновляются координаты карты... Пожалуйста подождите.");
	geocoder.then(function(res) {
        if(!res.geoObjects.getLength()) {
			alert("К сожалению введенный адрес не распознан:\n"+a+"\nПожалуйста, укажите позицию на карте вручную.");
			return;
		}

		var point=res.geoObjects.get(0);
		var coords=point.geometry.getCoordinates();

		CustomerMap.addPoint(coords,a,true);

		get("customerLat").value=coords[0];
		get("customerLng").value=coords[1];
		get("customerZoom").value=map.getZoom();
		get("customerAddress").setAttribute("preventSubmit","");
	}
	,function(error){
		alert("К сожалению введенный адрес не распознан:\n"+a+"\nПожалуйста, укажите позицию на карте вручную.");
		get("customerAddress").setAttribute("preventSubmit","");
	});
}
CustomerMap.addPoint=function(coords,address,pan){
	if(CustomerMap.curPlacemark)CustomerMap.map.geoObjects.remove(CustomerMap.curPlacemark);

	CustomerMap.curPlacemark = new ymaps.Placemark(
		coords, {
			balloonContent: address,
		},{
			draggable: true,
		}
	);
	
	CustomerMap.curPlacemark.events.add("dragend",
		function (e) {
			var coords=CustomerMap.curPlacemark.geometry.getCoordinates();
			get("customerLat").value=coords[0];
			get("customerLng").value=coords[1];
			get("customerZoom").value=CustomerMap.map.getZoom();
		}
	);

	CustomerMap.map.geoObjects.add(CustomerMap.curPlacemark);
	if(pan){
		CustomerMap.map.panTo(coords,{flying: true,checkZoomRange:false,callback:function(){CustomerMap.map.setZoom(14);}});
	}
}
CustomerMap.getFormAddress=function(isStrict){
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

	var a=get("customerAddress").value;
	if(a==""){
		if(isStrict){
			alert("Пожалуйста, укажите адрес в форме.");
			get("customerAddress").focus();
		}
		return city;
	}
	return city+", "+a;
	//return a;
}

var Customer={};
if(typeof ymaps!="undefined")ymaps.ready(CustomerMap.init);
//onReadys.push(Customer.init);