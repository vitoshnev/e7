var AdminSourcesEdit={};
AdminSourcesEdit.DEFAULT_LAT=59.93;
AdminSourcesEdit.DEFAULT_LNG=30.34;
AdminSourcesEdit.DEFAULT_ZOOM=10;
AdminSourcesEdit.map=null;
AdminSourcesEdit.points=new Array();
AdminSourcesEdit.curPlacemark=null;
AdminSourcesEdit.init=function(){
	var lng=get("sourceLng").value;
	var lat=get("sourceLat").value;
	var zoom=get("sourceZoom").value;
	if(lat!=""&&lng!=""&&zoom!=""){
		AdminSourcesEdit.map=new ymaps.Map("sourceMap", {
				center:[lat, lng],
				zoom:zoom
			}
		);

		AdminSourcesEdit.addPoint([lat, lng],AdminSourcesEdit.getFormAddress(false));
	}
	else {
		AdminSourcesEdit.map=new ymaps.Map("sourceMap", {
				center: [AdminSourcesEdit.DEFAULT_LAT, AdminSourcesEdit.DEFAULT_LNG],
				zoom: AdminSourcesEdit.DEFAULT_ZOOM
			}
		);
	}

	AdminSourcesEdit.map.controls.add("zoomControl");

	AdminSourcesEdit.map.events.add("boundschange",
		function(e) {
			get("sourceZoom").value=AdminSourcesEdit.map.getZoom();
		}
	);
}
AdminSourcesEdit.getFormAddress=function(isStrict){
	var a=get("sourceAddress").value;
	if(a==""){
		if(isStrict){
			alert("Пожалуйста, укажите адрес в форме.");
			get("sourceAddress").focus();
		}
		return "Санкт-Петербург";
	}
	return "Санкт-Петербург, "+a;
	//return a;
}
AdminSourcesEdit.setMapByAddress=function(){
	var input=get("sourceAddress");
	if ( !input.value ) return;

	var a=get("sourceAddress").value;
	var a="Санкт-Петербург, "+a;

	var map=AdminSourcesEdit.map;

	input.setAttribute("preventSubmit","Обновляются координаты карты... Пожалуйста подождите.");

	var geocoder=ymaps.geocode(a,{results:1});
	geocoder.then(function(res) {
		if(!res.geoObjects.getLength()) {
			alert("К сожалению введенный адрес не распознан:\n"+a+"\nПожалуйста, укажите позицию на карте вручную.");
			return;
		}

		var point=res.geoObjects.get(0);
		var coords=point.geometry.getCoordinates();

		AdminSourcesEdit.addPoint(coords,a,true);

		// update inputs:
		get("sourceLat").value=coords[0];
		get("sourceLng").value=coords[1];
		get("sourceZoom").value=map.getZoom();
		input.setAttribute("preventSubmit","");
	}
	,function(error){
		alert("К сожалению введенный адрес не распознан:\n"+a+"\nПожалуйста, укажите позицию на карте вручную.");
		input.setAttribute("preventSubmit","");
	});
}
AdminSourcesEdit.addPoint=function(coords,address,pan){
	if(AdminSourcesEdit.curPlacemark)AdminSourcesEdit.map.geoObjects.remove(AdminSourcesEdit.curPlacemark);

	var p = new ymaps.Placemark(
		coords, {
			balloonContent: address,
		},{
			draggable: true,
		}
	);
	AdminSourcesEdit.curPlacemark=p;
	
	p.events.add("dragend",
		function (e) {
			var coords=p.geometry.getCoordinates();
			get("sourceLat").value=coords[0];
			get("sourceLng").value=coords[1];
			get("sourceZoom").value=AdminSourcesEdit.map.getZoom();
		}
	);

	AdminSourcesEdit.map.geoObjects.add(p);
	if(pan){
		AdminSourcesEdit.map.panTo(coords,{flying: true,checkZoomRange:false,callback:function(){AdminSourcesEdit.map.setZoom(14);}});
	}
}

if(typeof ymaps!="undefined")ymaps.ready(AdminSourcesEdit.init);
//onReadys.push(Firm.init);