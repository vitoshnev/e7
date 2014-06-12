var CreditCalculator={};
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
			document.formCalc.firstPayPercent.value="это "+s+"%";
		}
		else document.formCalc.firstPayPercent.value="";
	}
	else {
		document.formCalc.credit.value="";
		document.formCalc.firstPayPercent.value="";
	}
}

CreditCalculator.setCredit=function(creditId){
	eval("d.formCredits.credit"+creditId).checked=true;
	d.formCredits.submit()
}
onReadys.push(CreditCalculator.updateCredit);