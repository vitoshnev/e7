var FirmMap={};
FirmMap.DEFAULT_LAT=56;
FirmMap.DEFAULT_LNG=45;
FirmMap.DEFAULT_ZOOM=4;

FirmMap.map=null;
FirmMap.curPlacemark=null;
FirmMap.onAddressChange=function(){
	FirmMap.setByAddress(false);
}
FirmMap.init=function(){
	var lng=get("firmLng").value;
	var lat=get("firmLat").value;
	var zoom=get("firmZoom").value;
	if(lat!=""&&lng!=""&&zoom!=""){
		FirmMap.map=new ymaps.Map("firmMap", {
				center: [lat, lng],
				zoom: zoom
			}
		);

		FirmMap.addPoint([lat, lng],FirmMap.getFormAddress(false));
	}
	else {
		// no address yet specified - show default location:
		FirmMap.map=new ymaps.Map("firmMap", {
				center: [FirmMap.DEFAULT_LAT, FirmMap.DEFAULT_LNG],
				zoom: FirmMap.DEFAULT_ZOOM
			}
		);
	}

	FirmMap.map.controls.add("zoomControl");

	FirmMap.map.events.add("boundschange",
		function(e) {
			get("firmZoom").value=FirmMap.map.getZoom();
		}
	);
}
FirmMap.setByAddress=function(){
	var input=get("firmAddress");

	var c=get("firmCityId");
	var cityId=c.options[c.selectedIndex].value;
	var city=c.options[c.selectedIndex].text;
	var address=input.value;
	if(Form.isHinted(input))address="";
	var a = city + address;

	var map=FirmMap.map;

	input.setAttribute("preventSubmit","Обновляются координаты карты... Пожалуйста подождите.");

	var geocoder=ymaps.geocode(a,{results:1});
	geocoder.then(function(res) {
		if(!res.geoObjects.getLength()) {
			alert("К сожалению введенный адрес не распознан:\n"+a+"\nПожалуйста, укажите позицию на карте вручную.");
			return;
		}

		var point=res.geoObjects.get(0);
		var coords=point.geometry.getCoordinates();

		FirmMap.addPoint(coords,a,true,address?true:false);

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
FirmMap.addPoint=function(coords,address,pan,zoom){
	if(FirmMap.curPlacemark)FirmMap.map.geoObjects.remove(FirmMap.curPlacemark);

	var p = new ymaps.Placemark(
		coords, {
			balloonContent: address,
		},{
			draggable: true,
		}
	);
	FirmMap.curPlacemark=p;
	
	p.events.add("dragend",
		function (e) {
			var coords=p.geometry.getCoordinates();
			get("firmLat").value=coords[0];
			get("firmLng").value=coords[1];
			get("firmZoom").value=FirmMap.map.getZoom();
		}
	);

	FirmMap.map.geoObjects.add(p);
	if(pan){
		FirmMap.map.panTo(coords,{flying: true,checkZoomRange:false,callback:function(){
			if(zoom)FirmMap.map.setZoom(14);
		}});
	}
}
FirmMap.getFormAddress=function(isStrict){
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

var Firm={};
Firm.addAddress=function(i){
	// find last entered email:
	var trs=HTML.getAll(d,'tr','firmAddress');
	var count=trs.length;
	var lastTR=trs[count-1];

	var tr=d.createElement("tr");
	tr.innerHTML="<th>Адрес "+(count)+"</th>"
		+"<td>"
		+"<div class='i'><input id='firmAddress"+count+"' name='addresses[]' maxlength='255' hint='Адрес "+(count)+"' onChange='FirmMap.setByAddress(this)'></div>"
		+"<input type='hidden' name='lats[]' id='firmLat"+count+"'>"
		+"<input type='hidden' name='lngs[]' id='firmLng"+count+"'>"
		+"<input type='hidden' name='zooms[]' id='firmZoom"+count+"'>"
		+"</td>";

	lastTR.parentNode.insertBefore(tr, lastTR.nextSibling);
	tr.className="firmAddress";
	Form.hintize(get("firmAddress"+count));
}
Firm.addPhone=function(i){
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
Firm.addEmail=function(i){
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
Firm.onChangePerson=function(i){
	BrowserDetect.init();
	var trBlock=BrowserDetect.browser=="Explorer"?"block":"table-row";
	if(i.value==1){
		var i=get("firmName");
		i.setAttribute("hint","ФИО*");
		if(i.className.indexOf("hint")!=-1)i.value=i.getAttribute("hint");
		var key=get("firmNameKey");
		key.innerHTML="ФИО";

		get("trKPP").style.display="none";
		get("trNameBrand").style.display=trBlock;

		var i=get("firmOfficialAddress");
		i.setAttribute("hint","Адрес регистрации*");
		if(i.className.indexOf("hint")!=-1)i.value=i.getAttribute("hint");
		var key=get("firmOfficialAddressKey");
		key.innerHTML="Адрес регистрации";

		var i=get("firmOGRN");
		i.setAttribute("hint","ОГРНИП*");
		if(i.className.indexOf("hint")!=-1)i.value=i.getAttribute("hint");
		var key=get("firmOGRNKey");
		key.innerHTML="ОГРНИП";

		/*var i=get("firmINN");
		i.setAttribute("hint","ИНН ИП*");
		if(i.className.indexOf("hint")!=-1)i.value=i.getAttribute("hint");
		var key=get("firmINNKey");
		key.innerHTML="ИНН ИП";*/
	}
	else{
		var i=get("firmName");
		i.setAttribute("hint","Название организации*");
		if(i.className.indexOf("hint")!=-1)i.value=i.getAttribute("hint");
		var key=get("firmNameKey");
		key.innerHTML="Название организации";

		get("trKPP").style.display=trBlock;
		get("trNameBrand").style.display="none";

		var i=get("firmOfficialAddress");
		i.setAttribute("hint","Юридический адрес*");
		if(i.className.indexOf("hint")!=-1)i.value=i.getAttribute("hint");
		var key=get("firmOfficialAddressKey");
		key.innerHTML="Юридический адрес";

		var i=get("firmOGRN");
		i.setAttribute("hint","ОГРН*");
		if(i.className.indexOf("hint")!=-1)i.value=i.getAttribute("hint");
		var key=get("firmOGRNKey");
		key.innerHTML="ОГРН";

		/*var i=get("firmINN");
		i.setAttribute("hint","ИНН*");
		if(i.className.indexOf("hint")!=-1)i.value=i.getAttribute("hint");
		var key=get("firmINNKey");
		key.innerHTML="ИНН";*/
	}
}
///if(typeof ymaps!="undefined")ymaps.ready(FirmMap.init);
//onReadys.push(Firm.init);