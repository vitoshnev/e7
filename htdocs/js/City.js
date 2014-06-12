var City={};
City.modelDefaultText="Город*";
City.sourceDefaultText="Автосалон*";
City.initPage=function(){
}
City.onProducerChange=function(b){
	var ps=document.getElementById("carId");
	var ms=document.getElementById("cityes");
	var ms1=document.getElementById("sources");

	City.resetSelect(ms,City.modelDefaultText);
	City.resetSelect(ms1,City.sourceDefaultText);

    m=b.value.split("_");
	brand = m[1];

	var brands=allBrands['p'+brand];

	brands =  brands.split(",");
	for (var key in brands) {
		var brand=brands[key];
		var o=document.createElement("option");
		s=brand.split("_");
		o.value=s[0];
		o.text=s[1];
		if (brands.length == 1) {
			ms.remove(ms);
			o.selected=true;
			ms.disabled=true;
		}
		if ( o.value == selectedCityId ) {
			o.selected=true;
		}
		try {
			ms.add(o,null); // standards compliant; doesn-t work in IE
		}
		catch(ex) {
			ms.add(o); // IE only
		}
	}
	ms.disabled = false;
	City.onCityChange(ms);
}
City.onCityChange=function(b){
	var ps=document.getElementById("cityes");
	var ms=document.getElementById("sources");

	City.resetSelect(ms,City.sourceDefaultText);
	var cityes=allCitySources['p'+b.value];
	if ( cityes ) cityes =  cityes.split("|");
	else return;
	var z=1;
	for (var key in cityes) {
		var city=cityes[key];
		var o=document.createElement("option");
		s=city.split("_");
		o.value=s[0];
		o.text=s[1];
		o.id="s"+z;
		if (cityes.length == 1) {
			ms.remove(ms);
			o.selected=true;
			ms.disabled=true;
		}
		sourceBrands = s[2].split(",");
		var brand=document.getElementById("carId");
		m=brand.value.split("_");
		brand = m[1];
        if ( !City.in_array(brand, sourceBrands) ) continue;
		if (s[0]) {
			try {
				ms.add(o,null); // standards compliant; doesn-t work in IE
			}
			catch(ex) {
				ms.add(o); // IE only
			}
			z++;
		}
	}
	if ( z == 2) {
		document.getElementById('s1').selected = 'true';
	}
	ms.disabled = false;
}


City.resetSelect=function(cc,text){
	while(cc.options.length>0){
		cc.remove(cc.options.length-1);
	}
		var o=document.createElement("option");
		o.text=text;
		o.value="";

	try{
		cc.add(o,null); // standards compliant; doesn't work in IE
	}
	catch(ex) {
		cc.add(o); // IE only
	}
	cc.disabled=true;
}

City.in_array=function(what, where) {
    for(var i=0; i<where.length; i++)
        if(what == where[i])
            return true;
    return false;
}


onReadys.push(City.initPage);