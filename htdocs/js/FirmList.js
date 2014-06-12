var FirmAddressPoint=function(id,lat,lng,address,phones,emails,isHot,img){
	this.id=id;
	this.lat=lat;
	this.lng=lng;
	this.address=address;
	this.phones=phones;
	this.emails=emails;
	this.isHot=isHot;
	this.img=img;
}

var FirmList={};
FirmList.DEFAULT_LNG=30.34;
FirmList.DEFAULT_LAT=59.93;
FirmList.DEFAULT_ZOOM=10;

FirmList.map=null;
FirmList.addresses=null;

FirmList.init=function(){
	if(!FirmList.addresses)return;

	if(FirmList.addresses.length){
		FirmList.map=new ymaps.Map("firmMap", {
				center: [FirmList.DEFAULT_LAT, FirmList.DEFAULT_LNG],
				zoom: FirmList.DEFAULT_ZOOM
			}
		);

		var collection = new ymaps.GeoObjectCollection({});
		for(i=0;i<FirmList.addresses.length;i++){
			var a=FirmList.addresses[i];

			var html="<div class='firm'>"
			if(a.img) html+="<div class=\"img\" style=\"background-image:url('"+a.img+"')\"></div>";
			html+="<div class='text'>";
			html+="<div class='name'>"+a.address+"</div>";
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

			if(a.isHot) var p=new ymaps.Placemark([a.lat,a.lng],{balloonContent:html},{
				iconImageHref: "/i/icon-firm.png",	///'/maps/doc/jsapi/2.x/examples/images/myIcon.gif', // картинка иконки
				iconImageSize: [34, 50], // размеры картинки
				iconImageOffset: [-17, -50] // смещение картинки
				});
			else {
				///var p=new ymaps.Placemark([a.lat,a.lng],{balloonContent:html});
				var p=new ymaps.Placemark([a.lat,a.lng],{balloonContent:html},{
					iconImageHref: "/i/icon-firm-default.png",	///'/maps/doc/jsapi/2.x/examples/images/myIcon.gif', // картинка иконки
					iconImageSize: [22, 22], // размеры картинки
					iconImageOffset: [-11, -11] // смещение картинки
					});
			}
			


			collection.add(p);
		}

		FirmList.map.geoObjects.add(collection);
		FirmList.map.setBounds(collection.getBounds());
		var zoom=FirmList.map.getZoom()-1;
		if(zoom>15)zoom=15;
		FirmList.map.setZoom(zoom);
	}
	else {
		FirmList.map=new ymaps.Map("firmMap", {
				center: [FirmList.DEFAULT_LAT, FirmList.DEFAULT_LNG],
				zoom: FirmList.DEFAULT_ZOOM
			}
		);
	}

	FirmList.map.controls.add("zoomControl");
}

if(typeof ymaps!="undefined")ymaps.ready(FirmList.init);
//onReadys.push(Firm.init);