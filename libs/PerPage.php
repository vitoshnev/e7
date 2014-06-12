<?
//class for pagination
class PerPage{
	const IN_PAGE 		= 12;
	const IN_PAGE_ADMIN 		= 50;
	const PER_PAGE_BIG 		= 60;
	const PER_PAGE_LITLE 	= 20;
	const PER_PAGE_MIDLE 	= 40;
	
	static function cssPerPages($page){
			$css = array();
			$css["div.ppage"]="margin:-100px 0 0;text-align:right;font-size:1.25em;font-family:Arial;";
			$css["div.ppage.bottom"]="margin:0 0 35px;text-align:right;font-size:1.25em;font-family:Arial;";
			$css["div.ppage.confSection"]="display:inline-block;float:right;padding:10px 40px 15px";
			$css["div.ppage ul"]="float:right";
			$css["div.ppage li"]="float:left;margin:0 0.05em;font-size:1.05em;";
			$css["div.ppage span.pName"]="float:left;margin-right:7px;font-weight:bold;color:#000;cursor:default;text-decoration:none;";
			$css["div.ppage a"]="border:0;";
			$css["div.ppage span.a"]="cursor:pointer;padding:0.15em 0.3em;color:#0083A3;transition:color 0.15s ease-out 0s;border:0;";
			$css["div.ppage span.a:hover"]="text-decoration:underline;";
			$css["div.ppage span.active"]="padding:0.15em 0.3em;border:0;background:#E8E9EC;color:#3c3c3c;cursor:default;text-decoration:none;";
			$css["div.ppage span.active:hover"]="text-decoration:none;";

			$page->submitCss($css);
	}
	static function makeLi($i,$activePage,$url,$link=true,$isAdmin=false){
		$css=array();
		$css[]='a';
        
		$openA='';
		$closeA='';
		if($i==$activePage) {
			$css[]='active';
		}
		else if( $link && !$isAdmin ){
			if($i != 1) $newUrl=$url.'page-'.$i.'/#cofigurate';
			else $newUrl=$url.'#cofigurate';
			$openA='<a href="'.$newUrl.'">';
			$closeA='</a>';
		}
		else if($isAdmin){
			if($i != 1) $newUrl=$url.'?page='.$i;
			else $newUrl=$url;
			$openA='<a href="'.$newUrl.'">';
			$closeA='</a>';
		}
?>
			<li ><?= $openA ?><span <?= !$link?'onClick="JQConf.pageSel(this)"':'' ?> pageId="<?= $i ?>" <?= sizeof($css)?'class="'.implode(' ',$css).'"':''?>><?= $i ?></span><?= $closeA ?></li>
<?
	}
	static function showPerPages($total,$activePage,$url,$link=true,$isAdmin=false,$bottom=false){
		$stages=3;
		if($activePage==0) $activePage=1;
		$prev=$activePage-1;
		$next=$activePage+1;
	//detect last page
		if(!$isAdmin) $lastPage=ceil($total/self::IN_PAGE);
		else $lastPage=ceil($total/self::IN_PAGE_ADMIN);
		if($lastPage==1 || !$total) return;
?>
			<div class='clear'></div>
			<div class='ppage confSection animate <?= $bottom?'bottom':''?>' >
			<span class='pName' >Страницы </span>
			<ul>
<?
			if($lastPage < (7+($stages*2))){ //if total pages mote then thump in line just show all
				for($i=1;$i<=$lastPage;$i++){
					self::makeLi($i,$activePage,$url,$link,$isAdmin);
				}
			}
			else if($lastPage > (5+($stages*2))){

				if($activePage < (1+($stages*2))){ //if < 7 show all left
					for($i=1;$i<(4+($stages*2));$i++){
						self::makeLi($i,$activePage,$url,$link,$isAdmin);
					}
?>
				<li class='more'>...</li>
<?
					self::makeLi($lastPage-1,$activePage,$url,$link,$isAdmin);
					// die();
					self::makeLi($lastPage,$activePage,$url,$link,$isAdmin);
				}
				else if($lastPage-($stages*2)>$activePage && $activePage>($stages*2) ){ //show middle 
					self::makeLi(1,$activePage,$url,$link,$isAdmin);
					self::makeLi(2,$activePage,$url,$link,$isAdmin);
?>
				<li class='more'>...</li>
<?
					for($i=$activePage-$stages+1;$i<($activePage+$stages);$i++){
						self::makeLi($i,$activePage,$url,$link,$isAdmin);
					}
?>
				<li class='more'>...</li>
<?
					self::makeLi($lastPage-1,$activePage,$url,$link,$isAdmin);
					self::makeLi($lastPage,$activePage,$url,$link,$isAdmin);
				}
				else{ //show all right
					self::makeLi(1,$activePage,$url,$link,$isAdmin);
					self::makeLi(2,$activePage,$url,$link,$isAdmin);
?>
				<li class='more'>...</li>
<?
					for($i=$lastPage-(2+($stages*2));$i<=($lastPage);$i++){
						self::makeLi($i,$activePage,$url,$link,$isAdmin);
					}
				}
			}
?>
			</ul>
			<div class='clear'></div>
			</div>
<?
	}
	static function cssAdminPerPages($page){
			$css = array();
			$css["div.ppage"]="text-align:right;font-size:1.25em;font-family:Arial;";
			$css["div.ppage.confSection"]="display:inline-block;float:right;padding:10px 40px 15px";
			$css["div.ppage ul"]="float:right";
			$css["div.ppage li"]="float:left;margin:0 0.05em;font-size:1.05em;";
			$css["div.ppage span.pName"]="float:left;margin-right:7px;font-weight:bold;color:#000;cursor:default;text-decoration:none;";
			$css["div.ppage a"]="border:0;";
			$css["div.ppage span.a"]="cursor:pointer;padding:0.15em 0.3em;color:#0083A3;transition:color 0.15s ease-out 0s;border:0;";
			$css["div.ppage span.a:hover"]="text-decoration:underline;";
			$css["div.ppage span.active"]="padding:0.15em 0.3em;border:0;background:#E8E9EC;color:#3c3c3c;cursor:default;text-decoration:none;";
			$css["div.ppage span.active:hover"]="text-decoration:none;";
			$page->submitCss($css);
	}
	static function showAdminPerPages($total,$activePage,$url){
		$page=ceil($total/self::IN_PAGE_ADMIN);
		if($page==1 || !$total) return;
?>
	<div class='clear'></div>
	<div class='ppage confSection animate <?= $bottom?'bottom':''?>' >
		<span class='pName' >Страницы </span>
		<ul>
<?
		for($i=1;$i<=$page;$i++){
			$css=array();
			$css[]='a';

			$openA='';
			$closeA='';
			if($i==$activePage) {
				$css[]='active';
			}
			else{
				if($i != 1) $newUrl=urlAddParam($url,'page',$i);
				else $newUrl=urlRemoveParams($url,'page');;
				$openA='<a href="'.$newUrl.'">';
				$closeA='</a>';
			}
?>
			<li ><?= $openA ?><span <?= !$link?'onClick="JQConf.pageSel(this)"':'' ?> pageId="<?= $i ?>" <?= sizeof($css)?'class="'.implode(' ',$css).'"':''?>><?= $i ?></span><?= $closeA ?></li>
<?
		}
?>
		</ul>
		<div class='clear'></div>
	</div>
	<div class='clear'></div>
<?
	}
}
?>