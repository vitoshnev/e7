var CreditCalculator={};
CreditCalculator.init=function(){
	CreditCalculator.updateCredit();

	var cf=get("creditsFrame");
	if(cf && cf.offsetHeight>300 ){
		CSS.a(cf,"scroll");
	}
}
CreditCalculator.updateCredit=function(){
	var p=document.formCalc.price.value;
	p=p.replace(/\s+/g, "");
	p=p.replace(/[,.].*/g, "");

	var f=document.formCalc.firstPay.value;
	f=f.replace(/\s/g, "");
	f=f.replace(/[,.].*/g, "");
	
	if(p.match(/\d+/)!=null&&f.match(/\d+/)!=null&&parseInt(p)>parseInt(f)){
		var c=parseInt(p)-parseInt(f);
		var s=c.toString();
		s=s.replace(/(\d+)(\d{3})/,"$1 $2");
		s=s.replace(/(\d+)(\d{3})/,"$1 $2");
		s=s.replace(/(\d+)(\d{3})/,"$1 $2");
		document.formCalc.credit.value=s;

		// now, in percents:
		var c=Math.floor((parseInt(f)/parseInt(p))*100);
		if(c>0){
			var s=c.toString();
			s=s.replace(/(\d+)(\d{3})/,"$1 $2");
			s=s.replace(/(\d+)(\d{3})/,"$1 $2");
			s=s.replace(/(\d+)(\d{3})/,"$1 $2");
			//document.formCalc.firstPayPercent.value=s;

			for(var i=0;i<d.formCalc.firstPayPercent.options.length;i++){
				var o=d.formCalc.firstPayPercent.options[i];
				if(o.value<=c)d.formCalc.firstPayPercent.selectedIndex=i;
			}
		}
		else {
			//document.formCalc.firstPayPercent.value="";
			d.formCalc.firstPayPercent.selectedIndex=0;
		}

		var s=f.toString();
		s=s.replace(/(\d+)(\d{3})/,"$1 $2");
		s=s.replace(/(\d+)(\d{3})/,"$1 $2");
		s=s.replace(/(\d+)(\d{3})/,"$1 $2");
		d.formCalc.firstPay.value=s;
	}
	else {
		d.formCalc.credit.value="";
		//d.formCalc.firstPayPercent.value="";
		d.formCalc.firstPayPercent.selectedIndex=0;
	}
}
CreditCalculator.onPercent=function(){
	//var fpp=parseInt(document.formCalc.firstPayPercent.value);
	var fpp=d.formCalc.firstPayPercent.options[d.formCalc.firstPayPercent.selectedIndex].value;

	if(fpp<0||fpp>100||isNaN(fpp)){
		d.formCalc.firstPay.value="";
		return;
	}

	var p=d.formCalc.price.value;
	p=p.replace(/\s+/g, "");
	p=p.replace(/[,.].*/g, "");
	d.formCalc.firstPay.value=parseInt(p)*(fpp/100);

	CreditCalculator.updateCredit();
}
CreditCalculator.setCredit=function(creditId){
	eval("d.formCredits.credit"+creditId).checked=true;
	d.formCredits.submit();
}
onReadys.push(CreditCalculator.init);