var Calendar={};
Calendar.weekDayAbbreviations=new Array("пн","вт","ср","чт","пт","сб","вс");
Calendar.monthNames=new Array("январь","февраль","март","апрель","май","июнь","июль","август","сентябрь","октябрь","ноябрь","декабрь");
Calendar.monthNamesR=new Array("января","февраля","марта","апреля","мая","июня","июля","августа","сентября","октября","ноября","декабря");
Calendar.current=null;
Calendar.states={};
Calendar.idIncrement=0;

Calendar.Calendar=function(args){
	div.className="i iCalendar";

	var input=d.createElement("input");
	input.setAttribute("isCalendar",1);
	input.name="_"+div.getAttribute("calendarName");
	input.value=div.getAttribute("calendarTitle");
	input.setAttribute("validation",div.getAttribute("calendarValidation"));
	//input.value=div.getAttribute("calendarHint");
	input.setAttribute("hint",div.getAttribute("calendarHint"));
	input.readOnly=true;
	div.appendChild(input);

	var inputHidden=d.createElement("input");
	inputHidden.type="hidden";
	inputHidden.name=div.getAttribute("calendarName");
	inputHidden.value=div.getAttribute("calendarValue");
	div.appendChild(inputHidden);

	if(inputHidden.value){
		var dd=inputHidden.value.split(/-/);
		var year=dd[0];
		var month=dd[1];
		var day=dd[2];
	}
	else {
		var year=null;
		var month=null;
		var day=null;
	}

	eventOn(div,"mousedown",function(e){
		var div=Event.target(e);
		if(Calendar.current){
			Calendar.hide();
		}
		else {
			var inputs=div.getElementsByTagName("input");
			Calendar.show(year,month,day,div,function(date,dateString,title){
				CSS.a(inputs[0],'clicked');
				inputs[0].value=title;
				inputs[1].value=date;
			});
		}
	});

	eventOn(input,"change",function(e){
		var input=Event.target(e);
		var date=new Date(input.value);
		if(!date){
			alert("Введена некорректная дата.");
			input.focus();
		}
	});
}

Calendar.show=function(year,month,day,parent,callback){
	if(Calendar.current)Calendar.hide();
	if(!parent)return;

	parent.style.position="relative";
	if(!parent.id) parent.id="calendarParent"+Calendar.idIncrement++;

	if(!year||!month){
		// get current date or use state:
		if(Calendar.states[parent.id]){
			dateNow=Calendar.states[parent.id];
			day=dateNow.getDate();
		}
		else {
			var dateNow=new Date();
			day=null;
		}
		year=dateNow.getFullYear();
		month=dateNow.getMonth();
	}

	var t=Calendar.drawMonth(year,month,day,parent,callback);

	var c=d.createElement("div");
	c.appendChild(t);
	c.style.position="absolute";
	//c.style.width=parent.offsetWidth+"px";
	parent.appendChild(c);
	//c.style.top=parent.offsetHeight+"px";
	//c.style.left="0";
	c.className="calendar";
	d.body.appendChild(c);
	c.style.top=Screen.absOffset(parent,"offsetTop")+"px";
	c.style.left=Screen.absOffset(parent,"offsetLeft")+parent.offsetWidth+8+"px";

	Calendar.current=c;
}
Calendar.drawMonth=function(year,mo,day,parent,callback){
	// frame table:
	var t=d.createElement("table");
	var thead=d.createElement("thead");
	var tbody=d.createElement("tbody");
	t.appendChild(thead);
	t.appendChild(tbody);

	// prev and next years:
	var datePrevYear=new Date(year-1,mo,1);
	var dateNextYear=new Date(year+1,mo,1);

	// first row with name of month:
	var tr=d.createElement("tr");
	tr.className="year";
	var th=d.createElement("th");
	thead.appendChild(tr);
	//th.setAttribute("class","mo");
	th.setAttribute("colSpan",7);

	var img=d.createElement("img");
	img.src="/i/calendar-l.gif";
	img.className="l";
	img.title=datePrevYear.getFullYear();
	eventOn(img,"click",function(){
		Calendar.show(datePrevYear.getFullYear(),mo,day,parent,callback);
	});
	th.appendChild(img);
	var img=d.createElement("img");
	img.src="/i/calendar-r.gif";
	img.className="r";
	img.title=dateNextYear.getFullYear();
	eventOn(img,"click",function(){
		Calendar.show(dateNextYear.getFullYear(),mo,day,parent,callback);
	});
	th.appendChild(img);
	//th.innerHTML="<img src='/i/calendar-l.gif' class='l' title=\""+datePrevYear.getFullYear()+"\" onClick=\"Calendar.show("+datePrevYear.getFullYear()+","+mo+",'"+parentId+"','"+callback+"')\">"
		//+"<img src='/i/calendar-r.gif' class='r' title='"+dateNextYear.getFullYear()+"' onClick=\"Calendar.show("+dateNextYear.getFullYear()+","+mo+",'"+parentId+"','"+inputId+"')\">"
		//+year;
	var span=d.createElement("span");
	span.innerHTML=year;
	th.appendChild(span);
	tr.appendChild(th);

	// prev and next months:
	var datePrevMo=new Date(year,mo-1,1);
	var prevMo=Calendar.monthNames[datePrevMo.getMonth()]+" "+datePrevMo.getFullYear();
	var dateNextMo=new Date(year,mo+1,1);
	var nextMo=Calendar.monthNames[dateNextMo.getMonth()]+" "+dateNextMo.getFullYear();

	// second row with name of month:
	var tr=d.createElement("tr");
	tr.className="month";
	var th=d.createElement("th");
	thead.appendChild(tr);
	//th.setAttribute("class","mo");
	th.setAttribute("colSpan",7);
	var img=d.createElement("img");
	img.src="/i/calendar-l.gif";
	img.className="l";
	img.title=prevMo;
	eventOn(img,"click",function(){
		Calendar.show(datePrevMo.getFullYear(),datePrevMo.getMonth(),day,parent,callback);
	});
	th.appendChild(img);
	var img=d.createElement("img");
	img.src="/i/calendar-r.gif";
	img.className="r";
	img.title=nextMo;
	eventOn(img,"click",function(){
		Calendar.show(dateNextMo.getFullYear(),dateNextMo.getMonth(),day,parent,callback);
	});
	th.appendChild(img);
	//th.innerHTML="<img src='/i/calendar-l.gif' class='l' title=\""+prevMo+"\" onClick=\"Calendar.show("+datePrevMo.getFullYear()+","+datePrevMo.getMonth()+",'"+parentId+"','"+inputId+"')\">"
	//	+"<img src='/i/calendar-r.gif' class='r' title='"+nextMo+"' onClick=\"Calendar.show("+dateNextMo.getFullYear()+","+dateNextMo.getMonth()+",'"+parentId+"','"+inputId+"')\">"
	//	+Calendar.monthNames[mo];
	var span=d.createElement("span");
	span.innerHTML=Calendar.monthNames[mo];
	th.appendChild(span);
	tr.appendChild(th);
	//alert(t.innerHTML);

	// next row with days of week:
	tr=d.createElement("tr");
	//tr.setAttribute("class","weekDays");
	tr.className="weekDays";
	for(var i=1;i<=7;i++){
		// first row with days of week:
		var th=d.createElement("th");
		th.innerHTML=Calendar.weekDayAbbreviations[i-1];
		tr.appendChild(th);
	}
	thead.appendChild(tr);

	// selected date:
	if(day)var dateSel=new Date(year,mo,day);
	else dateSel=null;

	// what was the week day of the first day in the month?
	var date1=new Date(year,mo,1);
	var wd=date1.getDay();
	if(wd==0)wd+=7;
	var day=1-wd+1;

	// get current date
	var dateNow=new Date();

	// draw up to 7 weeks:
	for(var j=0;j<7;j++){
		var tr=d.createElement("tr");
		for(var i=1;i<=7;i++){
			var date=new Date(year,mo,day);
			var td=d.createElement("td");

			var title=date.getDate()+" "+Calendar.monthNamesR[date.getMonth()]+" "+date.getFullYear();
			td.title=title;
			td.setAttribute("date",date.getFullYear()+"-"+(date.getMonth()<10?"0"+date.getMonth():date.getMonth())+"-"+(date.getDate()<10?"0"+date.getDate():date.getDate()));
			td.setAttribute("dateString",date.toString());

			var classes=new Array();
			if(date.getMonth()<mo)classes.push("prevMo");
			else if(date.getMonth()>mo)classes.push("nextMo");
			else {
				if(date.getDate()==dateNow.getDate()&&date.getMonth()==dateNow.getMonth()&&date.getFullYear()==dateNow.getFullYear())classes.push("today");
				if(dateSel&&date.getDate()==dateSel.getDate()&&date.getMonth()==dateSel.getMonth()&&date.getFullYear()==dateSel.getFullYear())classes.push("sel");
			}

			eventOn(td,'mouseover',function(e){CSS.a(Event.target(e),'over')});
			eventOn(td,'mouseout',function(e){CSS.r(Event.target(e),'over')});
			eventOn(td,'click',function(e){
				var td=Event.target(e);
				var date=td.getAttribute("date");
				var dateString=td.getAttribute("dateString");

				if(callback)callback(date,dateString,td.title);
				Calendar.states[parent.id]=new Date(dateString);
				Calendar.hide();
			});

			td.innerHTML=date.getDate();
			if(classes.length) td.className=classes.join(" ");
			tr.appendChild(td);
			day++;
		}
		tbody.appendChild(tr);

		// what will be next date?
		var date=new Date(year,mo,day);
		if(date.getMonth()!=mo) break;
	}
	//alert(t.innerHTML);
	return t;
}
Calendar.hide=function(){
	d.body.removeChild(Calendar.current);
	Calendar.current=null;
}
/*onReadys.push(function(){
	Calendar.show(null,null,'customerDOB','customerDOBInput')
});*/