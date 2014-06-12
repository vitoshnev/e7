var HotItem={};
var HI=HotItem;
HI.countdownInterval=null;
HI.countdownDays=null;
HI.countdownHours=null;
HI.countdownMinutes=null;
HI.countdownSeconds=null;
HI.init=function(){
	if(!d.getElementById("countdownSeconds"))return;

	if(get("countdownDays"))HI.countdownDays=d.getElementById("countdownDays");
	HI.countdownHours=d.getElementById("countdownHours");
	HI.countdownMinutes=d.getElementById("countdownMinutes");
	HI.countdownSeconds=d.getElementById("countdownSeconds");

	HI.countdownInterval=setInterval("HI.countdown()",500);

	CSS.setOpacity(get("countdown"),0);
	FX.fadeIn(get("countdown"),1,1000);
}
HI.countdown=function(){
	var now=new Date();
	var now=Math.floor(now.getTime()/1000);
	var diff=HI.countdownTime-now;
	if(diff<0){
		if(HI.countdownDays)HI.countdownDays.style.display="none";
		HI.countdownHours.innerHTML="Акция завершена...";
		HI.countdownMinutes.style.display="none";
		HI.countdownSeconds.style.display="none";
		clearInterval(HI.countdownInterval);
		return;
	}
	var days=Math.floor(diff/86400);
	var hours=Math.floor((diff-days*86400)/3600);
	var minutes=Math.floor((diff-days*86400-hours*3600)/60);
	var seconds=diff-days*86400-hours*3600-minutes*60;
	if(HI.countdownDays)HI.countdownDays.innerHTML=HI.strEnd(days,"остался","осталось","осталось")+" <span class='value'>"+(days<=3?"только ":"")+days+" "+HI.strEnd(days,"день","дня","дней")+"</span>";
	//HI.countdownHours.innerHTML=(hours.toString().length<2?"0"+hours.toString():hours)+" "+HI.strEnd(hours,"час","часа","часов");
	//HI.countdownMinutes.innerHTML=(minutes.toString().length<2?"0"+minutes.toString():minutes)+" "+HI.strEnd(minutes,"минута","минуты","минут");
	//HI.countdownSeconds.innerHTML=(seconds.toString().length<2?"0"+seconds.toString():seconds)+" "+HI.strEnd(seconds,"секунда","секунды","секунд");
	HI.countdownHours.innerHTML=(hours)+" "+HI.strEnd(hours,"час","часа","часов");
	HI.countdownMinutes.innerHTML=(minutes)+" "+HI.strEnd(minutes,"минута","минуты","минут");
	HI.countdownSeconds.innerHTML=(seconds)+" "+HI.strEnd(seconds,"секунда","секунды","секунд");
}
HI.strEnd=function(total, var1, var2, var3) {
	var ts=total.toString();
	var e=parseInt(ts.substr(ts.length-1));
	var e2=parseInt(ts.substr(ts.length-2));
	if ( e >= 2 && e <= 4 && !(e2 >= 11 && e2 <= 19)) return var2;
	else if ( e == 1 && !(e2 >= 11 && e2 <= 19) ) return var1;
	return var3;
}
onReadys.push(HotItem.init);
