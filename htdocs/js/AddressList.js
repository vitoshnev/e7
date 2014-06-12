var SourceFull=function(id,lat,lng,zoom,address,phones,emails,url,name,img,schedule){
	this.id=id;
	this.lat=lat;
	this.lng=lng;
	this.zoom=zoom;
	this.address=address; //it's name
	this.phones=phones;
	this.emails=emails;
	this.url=url;
	this.name=name;
	this.img=img;
	this.schedule=schedule;
}

var AddressList={};
AddressList.DEFAULT_LNG=30.34;
AddressList.DEFAULT_LAT=59.93;
AddressList.DEFAULT_ZOOM=10;

AddressList.map=null;
AddressList.addresses=null;

AddressList.init=function(){
	// BrowserDetect.init();
	// if(BrowserDetect.browser=='Mozilla' && typeof ymaps!="undefined") AddressList.onMapInit();
	// else
	if(typeof ymaps!="undefined")ymaps.ready(AddressList.onMapInit);
	 // if(typeof ymaps!="undefined")ymaps.ready(AddressList.onMapInit);
	 // if(typeof ymaps!="undefined") AddressList.onMapInit();
}

AddressList.onMapInit=function(){

	// if(AddressList.addresses.length){
		AddressList.map=new ymaps.Map("map", {
				center: [AddressList.DEFAULT_LAT, AddressList.DEFAULT_LNG],
				zoom: AddressList.DEFAULT_ZOOM
			}
		);

		var collection = new ymaps.GeoObjectCollection({}, { iconImageHref: '/i/metka.png', iconImageSize: [132, 53],iconImageOffset: [-65, -53]});
		for(i=0;i<AddressList.addresses.length;i++){
			var a=AddressList.addresses[i];

			var icon = '/i/metka.png';
			var html="<div class='name'>"+a.name+"</div>" 
			html+="<div class='address'>"+a.address+"</div>" 
			if(a.schedule){
				html+="<div class='schedule'>Режим работы: "+a.schedule+"</div>";
			}
			html += '<ul class="sources" >';
			html += '<li class="source">';	
			html +="<div class='logo' style='background:url(\"/i/mapl.png\") no-repeat center center; '></div>";
			html += "<div class='text' >";
			if(a.phones){
				a.phones=a.phones.split(',');
				html+="<div class='phone'><ul class='phones' >";
				for(var j=0;j<a.phones.length;j++){
					html+="<li style=''>Тел. "+a.phones[j]+"</li>";
				}
				html+="</ul></div>";
			}
			if(a.url){
					a.url=a.url.split(',');
					html+="<ul class='urls'>";
					for(var j=0;j<a.url.length;j++){
						html+="<li><a target='_blank' href='"+a.url[j]+"'>"+a.url[j]+"</a></li>";
					}
					html+="</ul>";
			}
			if(a.emails){
				a.emails=a.emails.split(',');
				html+="<ul class='emails' style='list-style:none;'>";
				for(var j=0;j<a.emails.length;j++){
					html+="<li><a href='mailto:"+a.emails[j]+"'>"+a.emails[j]+"</a></li>";
				}
				html+="</ul>";
			//	html+="<div class='more'><span class='a2' onclick=\"CSS.a(get('RegionAddressDetails"+a.id+"'),'open');self.location.href='#RegionAddressDetails"+a.id+"'\">подробнее</span></div>";
			}
			
			
		//	YMaps.Styles.add("example#customPoint",s);
			
			var p=new ymaps.Placemark([a.lat,a.lng],{
						
						balloonContent: html
						});

			collection.add(p);
		}

		AddressList.map.geoObjects.add(collection);
		AddressList.map.setBounds(collection.getBounds());
		var zoom=AddressList.map.getZoom()-1;

		AddressList.map.setZoom(a.zoom);
		AddressList.map.controls.add("zoomControl");
		
		// 
	}
	// else {
		// AddressList.map=new ymaps.Map("map", {
				// center: [AddressList.DEFAULT_LAT, AddressList.DEFAULT_LNG],
				// zoom: AddressList.DEFAULT_ZOOM
			// }
		// );
	// }


  onReadys.push(AddressList.init);
