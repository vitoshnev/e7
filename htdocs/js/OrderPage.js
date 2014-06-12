var FirmAddressPoint=function(id,lat,lng,destination,html,img){
	this.id=id;
	this.lat=lat;
	this.lng=lng;
	this.destination=destination;
	this.html=html;
	this.img=img;
}

var OrderPage={};
OrderPage.clickRadius=function(r){
	get(r).click();

	CSS.r(get('r2LI'),'sel');
	CSS.r(get('r5LI'),'sel');
	CSS.r(get('r10LI'),'sel');
	CSS.r(get('r15LI'),'sel');
	CSS.r(get('r100LI'),'sel');

	CSS.a(get(r+'LI'),'sel');
}
OrderPage.show=function(img){
	var url=img.getAttribute('src');
	var i=get("imageBig");
	FX.fadeOut(i,0,100,function(){
		var loader=get("imageBigLoader");
		CSS.setOpacity(loader,0);
		loader.style.display="block";
		FX.fadeIn(loader,1,25);
		FX.loadImage(url,function(fx){
			i.style.backgroundImage="url("+url+")";

			i.setAttribute("enlargeURL", img.getAttribute("enlargeURL"));
			i.setAttribute("enlargeWidth", img.getAttribute("enlargeWidth"));
			i.setAttribute("enlargeHeight", img.getAttribute("enlargeHeight"));
			EnlargableImages.init();

			FX.fadeOut(loader,0,25,function(){
				loader.style.display="none";
			});
			FX.fadeIn(i,1,250);
		});
	});
}

OrderPage.DEFAULT_LNG=30.34;
OrderPage.DEFAULT_LAT=59.93;
OrderPage.DEFAULT_ZOOM=10;

OrderPage.map=null;
OrderPage.addresses=null;
OrderPage.mapIconURL=null;
OrderPage.mapIconHTML=null;

OrderPage.centerAddress=function(id){
	if(!OrderPage.map)return;
	//find it in array:
	for(i=0;i<OrderPage.addresses.length;i++){
		var a=OrderPage.addresses[i];
		if(a.id!=id) continue;

		// center map:
		OrderPage.map.setCenter([a.lat,a.lng], 15);
	}
}

OrderPage.init=function(){
	if(!OrderPage.addresses||!OrderPage.addresses.length)return;

	OrderPage.map=new ymaps.Map("firmMap", {
			center: [OrderPage.DEFAULT_LAT, OrderPage.DEFAULT_LNG],
			zoom: OrderPage.DEFAULT_ZOOM
		}
	);
	OrderPage.map.controls.add("zoomControl");

	var collection = new ymaps.GeoObjectCollection({});

	// add order address:
	var a=OrderPage.address;
	var html="";
	html+="<div class='firm'>";
	if(a.img) html+="<div class=\"img\" style=\"background-image:url('"+a.img+"')\"></div>";
	html+="<div class='text'>";
	html+="<div><b>"+a.destination+"</b></div>";
	html+=a.html;
	html+="</div>";
	html+="</div>";

	if(OrderPage.mapIconURL) var p=new ymaps.Placemark([a.lat,a.lng],{balloonContent:html},{
			iconImageHref: "/i/icon-customer.png",	//OrderPage.mapIconURL,
			iconImageSize: [34, 50],// [OrderPage.mapIconDimension, OrderPage.mapIconDimension],
			iconImageOffset: [-17, -50]// [-Math.round(OrderPage.mapIconDimension/2), -Math.round(OrderPage.mapIconDimension/2)]
		});
	else var p=new ymaps.Placemark([a.lat,a.lng],{balloonContent:html},{
			preset: "twirl#yellowStretchyIcon",
		});
	
	collection.add(p);

	// add firms:
	for(i=0;i<OrderPage.addresses.length;i++){
		var a=OrderPage.addresses[i];

		var html="";
		html+="<div class='firm'>";
		if(a.img) html+="<div class=\"img\" style=\"background-image:url('"+a.img+"')\"></div>";
		html+="<div class='text'>";
		html+="<div><b>"+a.destination+"</b></div>";
		html+=a.html;
		html+="</div>";
		html+="</div>";
		/*if(a.phones){
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
		}*/

		collection.add(new ymaps.Placemark([a.lat,a.lng],{balloonContent:html},{
			iconImageHref: "/i/icon-firm.png",	///'/maps/doc/jsapi/2.x/examples/images/myIcon.gif', // картинка иконки
			iconImageSize: [34, 50], // размеры картинки
			iconImageOffset: [-17, -50] // смещение картинки
			}));
	}

	OrderPage.map.geoObjects.add(collection);
	OrderPage.map.setBounds(collection.getBounds());
	var zoom=OrderPage.map.getZoom();//-1;
	if(zoom>15){
		zoom=15;
		OrderPage.map.setZoom(zoom);
	}


}

OrderPage.submit=function() {
	if(!confirm('Все параметры заявки верны?')) return false;

	var fs=get("formOrderSubmit");

	var ff=get("formFilter");
	ff.method="POST";
	ff.action=fs.action;
	ff.orderId.value=fs.orderId.value;
	ff.submit();

	return false;
}

if(typeof ymaps!="undefined")ymaps.ready(OrderPage.init);
//onReadys.push(Firm.init);
