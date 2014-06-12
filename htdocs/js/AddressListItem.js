var SourceFull=function(id,lat,lng,address,phones,emails,url, sibling, name, img, schedule){
	this.id=id;
	this.lat=lat;
	this.lng=lng;
	this.address=address; 
	this.phones=phones;
	this.emails=emails;
	this.url=url;
	this.sibling=sibling;
	this.name=name;
	this.img = img;
	this.schedule=schedule;
}

var AddressList={};
AddressList.DEFAULT_LNG=30.34;
AddressList.DEFAULT_LAT=59.93;
AddressList.DEFAULT_ZOOM=10;
AddressList.HYUDAI_ID=20;


AddressList.map=null;
AddressList.addresses=null;

AddressList.init=function(){

	// BrowserDetect.init();
	// if(BrowserDetect.browser=='Mozilla' && typeof ymaps!="undefined") AddressList.onMapInit();
	// else
	if(typeof ymaps!="undefined"){
		ymaps.ready(AddressList.onMapInit);
	}
	else{
		alert('here');	
	}
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
		
		var sources = new Array();

		for(i=0;i<AddressList.addresses.length;i++){
			var a=AddressList.addresses[i];
		}
		var collection = new ymaps.GeoObjectCollection({}, { iconImageHref: '/i/metka.png', iconImageSize: [60, 70],iconImageOffset: [-26, -70]});
		

		for( key in sources ){
			
			
			var	html = '';
				
			html += '<div class="name" >'+a.name+'</div>';
			html += '<div class="address" >'+a.address+'</div>';
			if(a.schedule){
				html+="<div class='schedule'>Режим работы: "+a.schedule+"</div>";
			}
			html += '<ul class="sources" >';
			for ( l =0; l < siblings.length; l++ ){

				for( k=0; k<AddressList.addresses.length; k++ ){
					if ( AddressList.addresses[k].id ==  siblings[l] ) {
						var a = AddressList.addresses[k] ;
						break;
					}
				}	
				// alert ( a.img );
				// if ( a.id != siblings[k] ) continue; 
				
				html += '<li class="source">';	
				if (a.id == AddressList.HYUDAI_ID) {
					html += '<div class="name" >'+a.name+'</div>';
					html += '<div class="address" >'+a.address+'</div>';
					if(a.schedule){
						html+="<div class='schedule'>Режим работы: "+a.schedule+"</div>";
					}
				}
				html +="<div class='logo' style='background:url("+a.img+") no-repeat center center; '></div>";
				html += "<div class='text' >";
					
				if(a.phones){
					a.phones=a.phones.split(',');
					html+="<div class='phone'><ul class='phones'>";
					for(var j=0;j<a.phones.length;j++){
						html+="<li>Тел. "+a.phones[j]+"</li>";
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
						html+="<ul class='emails'>";
						for(var j=0;j<a.emails.length;j++){
							html+="<li><a href='mailto:"+a.emails[j]+"'>"+a.emails[j]+"</a></li>";
						}
						html+="</ul>";
					//	html+="<div class='more'><span class='a2' onclick=\"CSS.a(get('RegionAddressDetails"+a.id+"'),'open');self.location.href='#RegionAddressDetails"+a.id+"'\">подробнее</span></div>";
				}
				html += '</div><div class="clear"></div>';//text
				html += '</li>';
			}
			html += '</ul>';
			
			var p=new ymaps.Placemark([a.lat,a.lng],{
				balloonContent: html
				});

			collection.add(p);
		}
		AddressList.map.geoObjects.add(collection);
		AddressList.map.setBounds(collection.getBounds());
		var zoom=AddressList.map.getZoom();//-1;
		
		// if(zoom < 10)zoom=10;
		if(zoom>15)zoom=15;
		if ( NK == 1 ) {
			zoom=12;
			// lat=55.61445399998168;
			// lng=51.96912700000001;
			// point=new YMaps.GeoPoint(lng,lat);
			// AddressList.map.setCenter(point, zoom);
		}
		
			AddressList.map.setZoom(zoom);
			AddressList.map.controls.add("zoomControl");
	// }
	// else {
		// AddressList.map=new ymaps.Map("map", {
				// center: [AddressList.DEFAULT_LAT, AddressList.DEFAULT_LNG],
				// zoom: AddressList.DEFAULT_ZOOM
			// }
		// );
	// }

	
}

  onReadys.push(AddressList.init);
