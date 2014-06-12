var Calendar={};
Calendar.weekDayAbbreviations=new Array("пн","вт","ср","чт","пт","сб","вс");
Calendar.monthNames=new Array("январь","февраль","март","апрель","май","июнь","июль","август","сентябрь","октябрь","ноябрь","декабрь");
Calendar.monthNamesR=new Array("января","февраля","марта","апреля","мая","июня","июля","августа","сентября","октября","ноября","декабря");
Calendar.idIncrement=-1;

Calendar.dmry=function(date){
	return date.getDate()+" "+Calendar.monthNamesR[date.getMonth()]+" "+date.getFullYear();
}

Calendar.dateValue=function(date){
	return date.getFullYear()+"-"+(date.getMonth()<=8?"0"+(date.getMonth()+1):(date.getMonth()+1))+"-"+(date.getDate()<10?"0"+date.getDate():date.getDate());
}

Calendar.FormSelectors={};
Calendar.FormSelector=function(div,opts){

	this.setSelectedDate=function(date){
		this.selectedDate=date;
		this.selectedDateString=Calendar.dmry(date);
		this.selectedDateValue=Calendar.dateValue(date);
	};

/**
* Constructor:
*/
	if(!div)return null;
	if(!opts)opts={};

	if(div.getAttribute("calendarId")){
		return Calendar.FormSelectors[div.getAttribute("calendarId")];
	}

	Calendar.idIncrement++;
	Calendar.FormSelectors["calendar"+Calendar.idIncrement]=this;
	div.setAttribute("calendarId",Calendar.idIncrement);

	this.element=div;
	this.selectedDate=null;
	this.selectedDateString=null;
	this.selectedDateValue=null;
	this.current=null;
	this.x=div.getAttribute("calendarX")?div.getAttribute("calendarX"):0;
	this.y=div.getAttribute("calendarY")?div.getAttribute("calendarY"):0;
	this.isModal=div.getAttribute("calendarIsModal")?eval(div.getAttribute("calendarIsModal")):0;

	// construct HTML:
	if(!div.id) div.id="iCalendar"+Calendar.idIncrement;
	div.className="i iCalendar";
	var input=d.createElement("input");
	this.input=input;
	input.setAttribute("isCalendar",1);
	input.name="_"+div.getAttribute("calendarName");
	input.value=div.getAttribute("calendarTitle");
	if(div.getAttribute("calendarValidation"))input.setAttribute("validation",div.getAttribute("calendarValidation"));
	if(div.getAttribute("calendarValue")){
		var dv=new Date(div.getAttribute("calendarValue"));
		input.value=Calendar.dmry(dv);
		this.setSelectedDate(dv);
	}
	//input.value=div.getAttribute("calendarHint");
	input.setAttribute("hint",div.getAttribute("calendarHint"));
	input.readOnly=true;
	div.appendChild(input);

	var inputHidden=d.createElement("input");
	this.inputHidden=inputHidden;
	inputHidden.setAttribute("type","hidden");
	inputHidden.setAttribute("name",div.getAttribute("calendarName"));
	inputHidden.setAttribute("value",div.getAttribute("calendarValue"));
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

	var host=this;
	Event.on(div,"mousedown",function(e){
		if(host.current)host.hide();
		else {
			if(host.isModal){
				// hide rest calendars:
				for (var prop in Calendar.FormSelectors){
					var c=Calendar.FormSelectors[prop];
					c.hide();
				}
			}
			// show calendar near parent input:
			var x=Screen.absOffset(div,"offsetLeft")+div.offsetWidth+8+"px";
			var y=Screen.absOffset(div,"offsetTop")+"px";
			host.show(null,null,null,x,y);
		}
	});

	/*Event.on(input,"change",function(e){
		var input=Event.target(e);
		var date=new Date(input.value);
		if(!date){
			alert("Введена некорректная дата.");
			input.focus();
		}
	});*/

/**
* Public methods:
*/

	if(opts.callback)this.callback=opts.callback;
	else this.callback=function(host){
		host.input.value=host.selectedDateString;
		host.inputHidden.value=host.selectedDateValue;
	}

	this.show=function(year,month,day,x,y){
		if(x==null)x=this.x;
		else this.x=x;
		if(y==null)y=this.y;
		else this.y=y;

		// determine default date:
		if(this.selectedDate){
			// restored:
			var yearDefault=this.selectedDate.getFullYear();
			var monthDefault=this.selectedDate.getMonth();
			var dayDefault=this.selectedDate.getDate();
		}
		else {
			// new calendar:
			var dateNow=new Date();
			var yearDefault=dateNow.getFullYear();
			var monthDefault=dateNow.getMonth();
			var dayDefault=null;
		}

		// set defaults:
		if(year==null)year=yearDefault;
		if(month==null)month=monthDefault;
		if(day==null)day=dayDefault;

		// destroy previous element:
		if(this.current)this.hide();

		// recreate calendar month (HTML table):
		var t=this.drawMonth(year,month,day);

		// show this inside a new HTML element:
		var c=d.createElement("div");
		c.appendChild(t);
		c.style.position="absolute";
		//c.style.width=parent.offsetWidth+"px";
		///parent.appendChild(c);
		//c.style.top=parent.offsetHeight+"px";
		//c.style.left="0";
		c.className="calendar";
		if(this.parent)parent.appendChild(c);
		else d.body.appendChild(c);
		c.style.left=x;
		c.style.top=y;

		// keep this element:
		this.current=c;
	};

	this.drawMonth=function(year,mo,day){
		var host=this;
		var parent=this.element;

		// frame table:
		var t=d.createElement("table");
		var thead=d.createElement("thead");
		var tbody=d.createElement("tbody");
		t.appendChild(thead);
		t.appendChild(tbody);

		// prev and next years:
		var datePrevYear=new Date(year-1,mo,1);
		var dateNextYear=new Date(year+1,mo,1);

		// first row with year:
		var tr=d.createElement("tr");
		tr.className="year";
		var th=d.createElement("th");
		thead.appendChild(tr);
		//th.setAttribute("class","mo");
		th.setAttribute("colSpan",7);

		// prev year btn:
		var img=d.createElement("img");
		img.src="/i/calendar-l.gif";
		img.className="l";
		img.title=datePrevYear.getFullYear();
		Event.on(img,"click",function(){
			host.show(datePrevYear.getFullYear(),mo,day);
		});
		th.appendChild(img);

		// next year btn:
		var img=d.createElement("img");
		img.src="/i/calendar-r.gif";
		img.className="r";
		img.title=dateNextYear.getFullYear();
		Event.on(img,"click",function(){
			host.show(dateNextYear.getFullYear(),mo,day);
		});
		th.appendChild(img);
		var span=d.createElement("span");
		span.innerHTML=year;
		th.appendChild(span);
		tr.appendChild(th);

		// row with name of month:
		var tr=d.createElement("tr");
		tr.className="month";
		var th=d.createElement("th");
		thead.appendChild(tr);
		//th.setAttribute("class","mo");
		th.setAttribute("colSpan",7);

		// prev month btn:
		if(mo>0)var datePrevMo=new Date(year,mo-1,1);
		else var datePrevMo=new Date(year-1,11,1);
		var prevMo=Calendar.monthNames[datePrevMo.getMonth()]+" "+datePrevMo.getFullYear();
		var img=d.createElement("img");
		img.src="/i/calendar-l.gif";
		img.className="l";
		img.title=prevMo;
		Event.on(img,"click",function(){
			host.show(datePrevMo.getFullYear(),datePrevMo.getMonth());
		});
		th.appendChild(img);

		// next month btn:
		if(mo<11)var dateNextMo=new Date(year,mo+1,1);
		else var dateNextMo=new Date(year+1,0,1);
		var nextMo=Calendar.monthNames[dateNextMo.getMonth()]+" "+dateNextMo.getFullYear();
		var img=d.createElement("img");
		img.src="/i/calendar-r.gif";
		img.className="r";
		img.title=nextMo;
		Event.on(img,"click",function(){
			host.show(dateNextMo.getFullYear(),dateNextMo.getMonth());
		});
		th.appendChild(img);
		var span=d.createElement("span");
		span.innerHTML=Calendar.monthNames[mo];
		th.appendChild(span);
		tr.appendChild(th);

		// row with days of week:
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

				td.title=Calendar.dmry(date);
				td.setAttribute("value",Calendar.dateValue(date));

				var classes=new Array();
				if(date.getMonth()<mo)classes.push("prevMo");
				else if(date.getMonth()>mo)classes.push("nextMo");
				else {
					if(date.getDate()==dateNow.getDate()&&date.getMonth()==dateNow.getMonth()&&date.getFullYear()==dateNow.getFullYear())classes.push("today");
					if(dateSel&&date.getDate()==dateSel.getDate()&&date.getMonth()==dateSel.getMonth()&&date.getFullYear()==dateSel.getFullYear())classes.push("sel");
				}

				Event.on(td,'mouseover',function(e){CSS.a(Event.target(e),'over')});
				Event.on(td,'mouseout',function(e){CSS.r(Event.target(e),'over')});
				Event.on(td,'click',function(e){
					var td=Event.target(e);
					host.setSelectedDate(new Date(td.getAttribute("value")));

					var r=null;
					if(host.callback)r=host.callback(host);
					if(r==null)host.hide();
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
	};

	this.hide=function(){
		if(this.current) d.body.removeChild(this.current);
		this.current=null;
	};
}
