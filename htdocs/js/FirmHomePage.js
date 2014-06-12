var FirmAddressPoint=function(id,lat,lng,address,phones,emails,img){
	this.id=id;
	this.lat=lat;
	this.lng=lng;
	this.address=address;
	this.phones=phones;
	this.emails=emails;
	this.img=img;
}

var FirmHomePage={};
FirmHomePage.DEFAULT_LNG=30.34;
FirmHomePage.DEFAULT_LAT=59.93;
FirmHomePage.DEFAULT_ZOOM=10;

FirmHomePage.map=null;
FirmHomePage.addresses=null;

FirmHomePage.init=function(){

	if(FirmHomePage.addresses.length){
		FirmHomePage.map=new ymaps.Map("firmMap", {
				center: [FirmHomePage.DEFAULT_LAT, FirmHomePage.DEFAULT_LNG],
				zoom: FirmHomePage.DEFAULT_ZOOM
			}
		);

		var collection = new ymaps.GeoObjectCollection({});
		for(i=0;i<FirmHomePage.addresses.length;i++){
			var a=FirmHomePage.addresses[i];

			var html="";
			html+="<div class='firm'>";
			if(a.img) html+="<div class=\"img\" style=\"background-image:url('"+a.img+"')\"></div>";
			html+="<div class='text'>";
			html+="<b>"+a.address+"</b>";
			if(a.phones){
				a.phones=a.phones.split(',');
				html+="<ul class='phones'>";
				for(var j=0;j<a.phones.length;j++){
					html+="<li>Тел. "+a.phones[j]+"</li>";
				}
				html+="</ul>";
			}
			if(a.emails){
				a.emails=a.emails.split(',');
				html+="<ul class='emails'>";
				for(var j=0;j<a.emails.length;j++){
					html+="<li><a href='mailto:"+a.emails[j]+"'>"+a.emails[j]+"</a></li>";
				}
				html+="</ul>";
				//html+="<div class='more'><span class='a2' onclick=\"CSS.a(get('firmAddressDetails"+a.id+"'),'open');self.location.href='#firmAddressDetails"+a.id+"'\">подробнее</span></div>";
			}
			html+="</div>";
			html+="</div>";

			collection.add(new ymaps.Placemark([a.lat,a.lng],{balloonContent:html},{
				iconImageHref: "/i/icon-firm.png",	///'/maps/doc/jsapi/2.x/examples/images/myIcon.gif', // картинка иконки
				iconImageSize: [34, 50], // размеры картинки
				iconImageOffset: [-17, -50] // смещение картинки
				}));
		}

		FirmHomePage.map.geoObjects.add(collection);
		FirmHomePage.map.setBounds(collection.getBounds());
		var zoom=FirmHomePage.map.getZoom()-1;
		if(zoom>15)zoom=15;
		FirmHomePage.map.setZoom(zoom);
	}
	else {
		FirmHomePage.map=new ymaps.Map("firmMap", {
				center: [FirmHomePage.DEFAULT_LAT, FirmHomePage.DEFAULT_LNG],
				zoom: FirmHomePage.DEFAULT_ZOOM
			}
		);
	}

	FirmHomePage.map.controls.add("zoomControl");
}

FirmHomePage.toggleAddress=function(id){
	var a=get('firmAddressDetails'+id);
	CSS.t(a,'open');
	if(a.className.indexOf("open")!=-1){
		FirmHomePage.centerAddress(id);
	}
}

FirmHomePage.centerAddress=function(id){
	if(!FirmHomePage.map)return;
	//find it in array:
	for(i=0;i<FirmHomePage.addresses.length;i++){
		var a=FirmHomePage.addresses[i];
		if(a.id!=id) continue;

		// center map:
		FirmHomePage.map.setCenter([a.lat,a.lng], 15);
	}
}

FirmHomePage.addPoint=function(coords,address,pan){
	var p = new ymaps.Placemark(
		coords, {
			balloonContent: address,
		}
	);
	
	FirmHomePage.map.geoObjects.add(p);
}

if(typeof ymaps!="undefined")ymaps.ready(FirmHomePage.init);
//onReadys.push(Firm.init);