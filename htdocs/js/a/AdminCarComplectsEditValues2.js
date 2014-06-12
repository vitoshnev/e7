var AdminCarComplectsEditValues2={};
AdminCarComplectsEditValues2.init=function(){
	var textareas=HTML.getAll(null,"textarea","scrollable");
	for(var i=0;i<textareas.length;i++){
		var t=textareas[i];
		Event.on(t,"scroll",function(e){
			var target=Event.target(e);
			for(var j=0;j<textareas.length;j++){
				var t2=textareas[j];
				if(t2===target){
				}
				else {
					t2.scrollTop=target.scrollTop;
				}
			}
		})
	}
}
onReadys.push(AdminCarComplectsEditValues2.init);