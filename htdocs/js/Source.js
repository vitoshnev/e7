var Source={};
Source.setByBrandId=function(brandId){
	var inputs=HTML.children(d.body,"input");
	var labels=HTML.children(d.body,"label");
	var activeInputs=new Array();
	for(var i=0;i<inputs.length;i++){
		var input=inputs[i];
		if(input.type!="radio")continue;

		var brandIds=input.getAttribute("brandIds");
		if(!brandIds)continue;

		brandIds=brandIds.split(",");
		for(var j=0;j<brandIds.length;j++){
			if(brandIds[j]==brandId){
				input.disabled=false;
				activeInputs.push(input);

				var forId=input.id;
				if(forId){
					for(var k=0;k<labels.length;k++){
						if(labels[k].getAttribute("for")==forId){
							labels[k].disabled=false;
							CSS.r(labels[k],"disabled");
							break;
						}
					}
				}

				
				// go to new input
				break;
			}
			else{
				input.disabled=true;
				input.checked=false;

				var forId=input.id;
				if(forId){
					for(var k=0;k<labels.length;k++){
						if(labels[k].getAttribute("for")==forId){
							CSS.a(labels[k],"disabled");
							break;
						}
					}
				}
			}
		}
	}

	// check input if it is a single one:
	if(activeInputs.length==1){
		activeInputs[0].checked=true;
	}
}
