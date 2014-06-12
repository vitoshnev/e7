var VacancyApplication={};
VacancyApplication.showMoreForm=function(){
	var styleDisplay="table-row";
	if(document.all)styleDisplay="block";// for IE
	get("tr0").style.display=styleDisplay;
	get("tr1").style.display=styleDisplay;
	get("tr2").style.display=styleDisplay;
	get("tr4").style.display=styleDisplay;
	get("tr5").style.display="none";
}
VacancyApplication.showAttachment=function(){
	var styleDisplay="table-row";
	if(document.all)styleDisplay="block";// for IE
	get("tr0").style.display="none";
	get("tr1").style.display="none";
	get("tr2").style.display="none";
	get("tr4").style.display=styleDisplay;
	get("tr5").style.display=styleDisplay;
}
VacancyApplication.onPostChange=function(){
	var i=get("iOtherPost");
	var s=get("sPost");
	if(s.options[s.selectedIndex].value==-1)i.style.display="block";
	else i.style.display="none";
}