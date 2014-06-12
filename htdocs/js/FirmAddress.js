var FirmAddress={};
FirmAddress.DEFAULT_LAT=56;
FirmAddress.DEFAULT_LNG=45;
FirmAddress.DEFAULT_ZOOM=4;

FirmAddress.map=null;
FirmAddress.curPlacemark=null;
FirmAddress.onAddressChange=function(){
	FirmAddress.setByAddress(false);
}
FirmAddress.init=function(){
	var lng=get("firmLng").value;
	var lat=get("firmLat").value;
	var zoom=get("firmZoom").value;
	if(lat!=""&&lng!=""&&zoom!=""){
		FirmAddress.map=new ymaps.Map("firmMap", {
				center: [lat, lng],
				zoom: zoom
			}
		);

		FirmAddress.addPoint([lat, lng],FirmAddress.getFormAddress(false));
	}
	else {
		// no address yet specified - show default location:
		FirmAddress.map=new ymaps.Map("firmMap", {
				center: [FirmAddress.DEFAULT_LAT, FirmAddress.DEFAULT_LNG],
				zoom: FirmAddress.DEFAULT_ZOOM
			}
		);
	}

	FirmAddress.map.controls.add("zoomControl");

	FirmAddress.map.events.add("boundschange",
		function(e) {
			get("firmZoom").value=FirmAddress.map.getZoom();
		}
	);
}
FirmAddress.setByAddress=function(){
	var input=get("firmAddress");

	var c=get("firmCityId");
	var cityId=c.options[c.selectedIndex].value;
	var city=c.options[c.selectedIndex].text;
	var address=input.value;
	if(Form.isHinted(input))address="";
	var a = city + ", " + address;

	var map=FirmAddress.map;

	input.setAttribute("preventSubmit","Обновляются координаты карты... Пожалуйста подождите.");

	var geocoder=ymaps.geocode(a,{results:1});
	geocoder.then(function(res) {
		if(!res.geoObjects.getLength()) {
			alert("К сожалению введенный адрес не распознан:\n"+a+"\nПожалуйста, укажите позицию на карте вручную.");
			return;
		}

		var point=res.geoObjects.get(0);
		var coords=point.geometry.getCoordinates();

		FirmAddress.addPoint(coords,a,true,address?true:false);

		// update inputs:
		get("firmLat").value=coords[0];
		get("firmLng").value=coords[1];
		get("firmZoom").value=map.getZoom();
		get("firmAddress").setAttribute("preventSubmit","");
	}
	,function(error){
		alert("К сожалению введенный адрес не распознан:\n"+a+"\nПожалуйста, укажите позицию на карте вручную.");
		get("firmAddress").setAttribute("preventSubmit","");
	});
}
FirmAddress.addPoint=function(coords,address,pan,zoom){
	if(FirmAddress.curPlacemark)FirmAddress.map.geoObjects.remove(FirmAddress.curPlacemark);

	var p = new ymaps.Placemark(
		coords, {
			balloonContent: address,
		},{
			draggable: true,
		}
	);
	FirmAddress.curPlacemark=p;
	
	p.events.add("dragend",
		function (e) {
			var coords=p.geometry.getCoordinates();
			get("firmLat").value=coords[0];
			get("firmLng").value=coords[1];
			get("firmZoom").value=FirmAddress.map.getZoom();
		}
	);

	FirmAddress.map.geoObjects.add(p);
	if(pan){
		FirmAddress.map.panTo(coords,{flying: true,checkZoomRange:false,callback:function(){
			if(zoom)FirmAddress.map.setZoom(14);
		}});
	}
}
FirmAddress.getFormAddress=function(isStrict){
	var c=get("firmCityId");
	var cityId=c.options[c.selectedIndex].value;
	var city=c.options[c.selectedIndex].text;
	if(cityId==""){
		if(isStrict){
			alert("Пожалуйста, укажите город в форме.");
			c.focus();
		}
		return null;
	}

	var a=get("firmAddress").value;
	if(a==""){
		if(isStrict){
			alert("Пожалуйста, укажите адрес в форме.");
			get("firmAddress").focus();
		}
		return city;
	}
	return city+", "+a;
	//return a;
}

FirmAddress.addAddress=function(i){
	// find last entered email:
	var trs=HTML.getAll(d,'tr','firmAddress');
	var count=trs.length;
	var lastTR=trs[count-1];

	var tr=d.createElement("tr");
	tr.innerHTML="<th>Адрес "+(count)+"</th>"
		+"<td>"
		+"<div class='i'><input id='firmAddress"+count+"' name='addresses[]' maxlength='255' hint='Адрес "+(count)+"' onChange='FirmAddress.setByAddress(this)'></div>"
		+"<input type='hidden' name='lats[]' id='firmLat"+count+"'>"
		+"<input type='hidden' name='lngs[]' id='firmLng"+count+"'>"
		+"<input type='hidden' name='zooms[]' id='firmZoom"+count+"'>"
		+"</td>";

	lastTR.parentNode.insertBefore(tr, lastTR.nextSibling);
	tr.className="firmAddress";
	Form.hintize(get("firmAddress"+count));
}
FirmAddress.addPhone=function(i){
	// find last entered phone:
	var trs=HTML.getAll(d,'tr','firmPhone');
	var count=trs.length;
	var lastTR=trs[count-1];

	var tr=d.createElement("tr");
		tr.innerHTML="<th>Телефон "+(count+1)+"</th>"
		+"<td>"
		+"<div class='if' style='width:7%'><div class='iStatic'>+7</div></div>"
		+"<div class='if' style='width:19%;margin:0 3%'><div class='i'><input id='firmPhoneCode"+count+"' name='phoneCodes[]' maxlength='6' hint='код'></div></div>"
		+"<div class='if' style='width:68%'><div class='i'><input id='firmPhone"+count+"' name='phones[]' maxlength='64' hint='Телефон "+(count+1)+"'></div></div>"
		+"</td>";

	lastTR.parentNode.insertBefore(tr, lastTR.nextSibling);
	tr.className="firmPhone";
	Form.hintize(get("firmPhoneCode"+count));
	Form.hintize(get("firmPhone"+count));
}
FirmAddress.addEmail=function(i){
	// find last entered email:
	var trs=HTML.getAll(d,'tr','firmEmail');
	var count=trs.length;
	var lastTR=trs[count-1];

	var id="firmEmail"+count;
	var tr=d.createElement("tr");
	tr.innerHTML="<th>E-mail "+(count+1)+"</th><td><div class='i'><input id='"+id+"' name='emails[]' maxlength='64' hint='E-mail "+(count+1)+"'></div></td>";

	lastTR.parentNode.insertBefore(tr, lastTR.nextSibling);
	tr.className="firmEmail";
	Form.hintize(get(id));
}

FirmAddress.toggle=function(name,id){
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
FirmAddress.setAll=function(name){
	var tr=get(name+"s");
	var lis=HTML.getAll(tr,"li",name);
	for(var i=0;i<lis.length;i++){
		var li=lis[i];
		CSS.a(li,"checked");
		var id=li.id.substring(name.length+2);

		get(name+id).value=1;
	}
}
FirmAddress.clearAll=function(name){
	var tr=get(name+"s");
	var lis=HTML.getAll(tr,"li",name);
	for(var i=0;i<lis.length;i++){
		var li=lis[i];
		CSS.r(li,"checked");
		var id=li.id.substring(name.length+2);

		get(name+id).value=0;
	}
}
if(typeof ymaps!="undefined")ymaps.ready(FirmAddress.init);
//onReadys.push(Firm.init);