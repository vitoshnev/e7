var FirmAddressPoint=function(id,lat,lng,address,phones,emails){
	this.id=id;
	this.lat=lat;
	this.lng=lng;
	this.address=address;
	this.phones=phones;
	this.emails=emails;
}

var FirmDealerPage={};
FirmDealerPage.DEFAULT_LNG=30.34;
FirmDealerPage.DEFAULT_LAT=59.93;
FirmDealerPage.DEFAULT_ZOOM=10;

FirmDealerPage.map=null;
FirmDealerPage.addresses=null;

FirmDealerPage.init=function(){

	if(FirmDealerPage.addresses.length){
		FirmDealerPage.map=new ymaps.Map("firmMap", {
				center: [FirmDealerPage.DEFAULT_LAT, FirmDealerPage.DEFAULT_LNG],
				zoom: FirmDealerPage.DEFAULT_ZOOM
			}
		);

		var collection = new ymaps.GeoObjectCollection({});
		for(i=0;i<FirmDealerPage.addresses.length;i++){
			var a=FirmDealerPage.addresses[i];

			var html="<b>"+a.address+"</b>";
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

			///collection.add(new ymaps.Placemark([a.lat,a.lng],{balloonContent:html}));
			collection.add(new ymaps.Placemark([a.lat,a.lng],{balloonContent:html},{
				iconImageHref: "/i/icon-firm.png",	///'/maps/doc/jsapi/2.x/examples/images/myIcon.gif', // картинка иконки
				iconImageSize: [34, 50], // размеры картинки
				iconImageOffset: [-17, -50] // смещение картинки
				}));
		}

		FirmDealerPage.map.geoObjects.add(collection);
		FirmDealerPage.map.setBounds(collection.getBounds());
		var zoom=FirmDealerPage.map.getZoom()-1;
		if(zoom>15)zoom=15;
		FirmDealerPage.map.setZoom(zoom);
	}
	else {
		FirmDealerPage.map=new ymaps.Map("firmMap", {
				center: [FirmDealerPage.DEFAULT_LAT, FirmDealerPage.DEFAULT_LNG],
				zoom: FirmDealerPage.DEFAULT_ZOOM
			}
		);
	}

	FirmDealerPage.map.controls.add("zoomControl");
}

FirmDealerPage.addPoint=function(coords,address,pan){
	var p = new ymaps.Placemark(
		coords, {
			balloonContent: address,
		}
	);
	
	FirmDealerPage.map.geoObjects.add(p);
}

if(typeof ymaps!="undefined")ymaps.ready(FirmDealerPage.init);
//onReadys.push(Firm.init);