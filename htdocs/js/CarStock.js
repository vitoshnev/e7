var CarStock={};
var CS=CarStock;
CarStock.init=function(){
	if(get("sliderPrice")){
		// two sliders - one for max price, another - for min price:
		var s1=new Slider("sliderPrice");
		var s2=new Slider("sliderPriceMin");

		s1.onChange=s2.onChange=function(){
			get("formFilter").submit();
		}
		s1.validate=function(value){
			if(value<s2.value){
				// move s2:
				///s2.setValue(value);
				s2.value=value;
				s2.update();
			}
			return value;
		}
		s2.validate=function(value){
			if(value>s1.value){
				// move s1:
				//s1.setValue(value);
				s1.value=value;
				s1.update();
			}
			return value;
		}
		s2.onStartDrag=function(value){
			CSS.a(s1.slider,'push2');
		}
		s2.onStopDrag=function(value){
			CSS.r(s1.slider,'push2');
		}
		s1.setFGWidth=s2.setFGWidth=function(x){
			s1.fg.style.left=s2.x+"px";
			s1.fg.style.width=(s1.x-s2.x)+"px";
		}
		// redraw:
		s1.update();
		s2.update();
	}
}
CarStock.overLine=function(i){
	var tr=get("trStockLine"+i);
	if(!tr)return;
	CSS.a(tr,'sel');
	var t=HTML.parent(tr,"table",null,true);
	var h=HTML.child(tr,"div","infoBoxLine");
	h.style.width=(t.offsetWidth+20)+"px";
}
CarStock.outLine=function(i){
	var tr=get("trStockLine"+i);
	if(!tr)return;
	CSS.r(tr,'sel');
}
onReadys.push(CarStock.init);
