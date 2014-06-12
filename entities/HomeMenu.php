<?
	//@Name('Слайдер на главной')
	//@Names('Слайды на главной')
	//@NameR('Слайда')
	//@Image('HomeMenuImage')
	class HomeMenu extends EntityBase {
		const PER_PAGE		= 20;
		const MAX_CELLS		= 7;
		
		
		// @PrimaryKey
		// @Name("Айдиха")
		// @FormType('hidden')
		var $id;

		// @View(99)
		// @Default(1)
		// @FormType('checkbox')
		// @Name('Показывать на сайте')
		var $isActive;
		
		// @View(99)
		// @Default(1)
		// @FormType('radio')
		// @Name('Ячейка показа')
		var $cell;
		
		// @Name('Бренд')
		// @Default(1)
		// @FormType('checkbox')
		// @View(99)
		// @FV('Brand')
		// @FK('HomeMenuBrand')
		var $brandId;

		// @Length(32)
		// @Name("Название")
		// @Required
		// @FormType('textarea')
		// @WebEditor
		var $name;

		// @Length(500)
		// @Name("Короткое описание")
		// @FormType('textarea')
		// @WebEditor
		var $short;
		
		// @Name("Ссылка")
		// @Required
		var $url;
		
		
		// @Date()
		// @View(99)
		var $createdOn;

		// @View('none')
		var $pos;
		
		// @View('99')
		// @FormType('fileImage')
		// @Name("Логотип бренда")
		var $HomeMenuImage;
		
		protected function showFormCell($page,$prop,$view,$attrs){
			$this->counts = array();
			$counts = DB::select("SELECT cell, COUNT(id) AS countItems FROM home_menu hm WHERE isActive GROUP BY cell ORDER BY countItems");
			foreach ( $counts as $a ) {
				$this->counts[$a['cell']] = $a['countItems'];
			}
			for ( $i=0; $i<HomeMenu::MAX_CELLS; $i++ ) {
				$count = intval($this->counts[$i]);
?>
<input type="radio" name="cell" id="cell<?= $i ?>" value="<?= $i ?>"<?= $this->cell==$i?" checked":"" ?>> <label for="cell<?= $i ?>"><?= ($i+1) ?> <span class="g">[<?= $count ?>]</span></label> &nbsp;&nbsp;
<?
			}
		}
		public static function fetchItem($page,$view,$id){
			if($view===99){
				$sql='SELECT hm.*, (SELECT GROUP_CONCAT(b.brandId) FROM home_menu_brand b WHERE b.homeMenuId=hm.id) as brandId FROM home_menu hm WHERE hm.id='.$id;
				$hm=self::fetchOne($sql);
				return $hm;
			}
			
			else return self::fetchItem($page,$view,$id);
		}
		public static function fetchSlides(){
			// fetch home menus with thumbs:
			$homeMenus = self::fetch("SELECT p.*"
				.", i.id AS HomeMenuImage_id, i.ext AS HomeMenuImage_ext, i.width AS HomeMenuImage_width, i.height AS HomeMenuImage_height"
				." FROM (home_menu p, (SELECT pi.id, pi.ext, pi.width, pi.height, pi.parentId FROM home_menu_image pi WHERE pi.pos=1) AS i)"
				." WHERE p.id=i.parentId"
				." AND p.isActive"
				." ORDER BY p.cell");

			// distribute homeMenus by cells:
			$sameCellHomeMenus = array();
			foreach ( $homeMenus as $item ) {
				if ( !is_array($sameCellHomeMenus[$item->cell]) ) $sameCellHomeMenus[$item->cell] = array();
				$sameCellHomeMenus[$item->cell][] = $item;
			}
			$hms = array();
			foreach ( $sameCellHomeMenus as $cell => $items ) {
				if ( sizeof($items) > 1 ) {
					$r = rand(0,sizeof($items)-1);
					$item = $items[$r];
					$hms[$items[$r]->id] = $items[$r];
				}
				else {
					$item = $items[0];
					$hms[$item->id] = $item;
				}
			}

			return $hms;
		}

		public static function cssSlides($page, $height=NULL) {
			if ( !$height ) $height = HomeMenuImage::FULL_HEIGHT;
			$css = array();

			$h2 = 4.2;
			$h3 = 1.8;

			$css["div#homeMenuFrame"] = "position:absolute;left:0;top:0;width:100%;";
			$css["div#homeMenuFrameGround"] = "position:absolute;left:0;top:0;width:100%;height:".$height."px;background:#006e6a;opacity:0.85;z-index:3";
			$css["div#homeMenuFrameGround div.bordWhite"] = "border-bottom:1px solid rgba(255,255,255,0.25);height:2px;margin-top:43px;";
			$css["div#homeMenuFrameGround div.bordWhite.left"] = "width:15%;float:left;";
			$css["div#homeMenuFrameGround div.bordWhite.right"] = "width:15%;float:right;";
			$css["div#homeMenuFrameGround div.bordWhite.center"] = "margin-left: 7%;width: 59%;float: left;";
			$css["div#homeMenuFrameInner"] = "position:relative;width:100%;";

			$css["ul#homeMenus"] = "position:relative;width:100%;height:".$height."px;";
			$css["ul#homeMenus li.slide"] = "display:none;position:absolute;margin:0;padding:0;width:100%;height:".$height."px;text-align:left;";
			$css["ul#homeMenus li.slide.current"] = "display:block;";
			$css["ul#homeMenus li.slide a.link"] = "display:block;color:#fff;width:100%;height:100%;position:absolute;top:0;left:0;text-decoration:none;outline: 0;";
			$css["ul#homeMenus li.slide ul.brands"] = "border:0;position:absolute;top:50px;right:0;";
			$css["ul#homeMenus li.slide ul.brands li.brand"] = "margin:0 0 16px 0;text-align:right";
			$css["ul#homeMenus li.slide ul.brands li.brand img.brand"] = "border:0;";
			$css["ul#homeMenus li.slide h2"] = "font:bold ".$h2."em 'PT Sans',Arial;color:#fff;font-style:normal;margin:0.25em 0 0 0; text-transform:uppercase; text-align:center; padding:0;letter-spacing:-1px;line-height:1.05em;text-shadow:0 1px 1.5px #000";
			$css["ul#homeMenus li.slide h3"] = "font:".$h3."em 'PT Sans',Arial;margin:1.8em 0 0 0;padding:0;color:#fff;letter-spacing:-1px;line-height:1.05em;text-shadow:0 1px 1.5px #000";

			$css["ul#shortTexts"] = "margin:0 auto; width:61%; margin-top: 2%;";
			$css["ul#shortTexts li"] = "float:left; margin-right:4%;";
			$css["ul#shortTexts div.shortTextBlock"] = "width:300px; height:136px; position:relative;";
			$css["ul#shortTexts div.shortTextBlock div.topPad"] = "height:40px; width:100%; background: url('/i/star.png') no-repeat center";
			$css["ul#shortTexts div.bordWhite"] = "border-bottom:1px solid rgba(255,255,255,0.25);height:2px;margin-top:17px;";
			$css["ul#shortTexts div.bordWhite.topPadLeft"] = "float:left; width:40%;";
			$css["ul#shortTexts div.bordWhite.topPadRight"] = "float:right; width: 40%";
			$css["ul#shortTexts div.padTextBack"] = "top: 40px;left: 0px;position: absolute;width:100%; opacity:0.2; background:#fff; height:95px; margin-top:5px; border-radius: 5px;";
			$css["ul#shortTexts div.padText"] = "color: #fff;width: 300px;text-align: center;height: 120px;display: table-cell;vertical-align: middle;";
			
			
			$css["ul#homeMenuImages"] = "position:absolute;z-index:2;top:0;left:0;margin:0;padding:0;list-style:none;width:100%;height:".$height."px;background:url('/i/1.jpg') no-repeat center center;";
			$css["ul#homeMenuImages li"] = "visibility:hidden;position:absolute;margin:0;padding:0;width:100%;height:".$height."px;background-position:center bottom;background-repeat:no-repeat;background-size:cover";
			$css["ul#homeMenuImages li.current"] = "visibility:visible;";

			$css["div#btnRollR"] = "display:none;position:absolute;z-index:4;right:-72px;top:450px;width:26px;height:97px;background-image:url('/i/2.png');cursor:pointer;background-position:0 0;opacity:0;filter:alpha(opacity=0)";
			//$css["body.w1024 div#btnRollR"] = "display:none";
			//$css["body.w1280 div#btnRollR"] = "right:0";
			$css["div#btnRollR.over"] = "background-position:0 -97px";
			$css["div#btnRollL"] = "display:none;position:absolute;z-index:4;left:-72px;top:450px;width:26px;height:97px;background-image:url('/i/3.png');cursor:pointer;background-position:0 0;opacity:0;filter:alpha(opacity=0)";
			//$css["body.w1024 div#btnRollL"] = "display:none";
			//$css["body.w1280 div#btnRollL"] = "left:0";
			$css["div#btnRollL.over"] = "background-position:0 -97px";

			$css["ul#homeMenuThumbs"] = "position:absolute;z-index:4;bottom:7%;left:0;margin:0;padding:0;list-style:none;height:30px;font-style:normal;display:none;";
			// if ( !$page->isIPad() && !$page->isIPhone() ) $css["ul#homeMenuThumbs"] .= "opacity:0;filter:alpha(opacity=0);";
			$css["ul#homeMenuThumbs li"] = "opacity:0.5;position:absolute;top:0;width:70px; height:30px;padding:0;background:url('/i/slsel.png') no-repeat center -60px; background-color:#000; cursor:pointer;text-align:center;color:#fff; ";
			$css["ul#homeMenuThumbs li.first"] = "border-radius: 50px 0 0 50px;";
			$css["ul#homeMenuThumbs li.last"] = "border-radius: 0 50px 50px 0;";
			$css["ul#homeMenuThumbs li:hover"] = "background-position:center -30px;";
			$css["ul#homeMenuThumbs li.current"] = "opacity:1; background-color:transparent; background-position:center 0;";

			$css["ul#homeMenuThumbs li div.number"] = "padding:3px 0 0 0; opacity:1;";

			$page->submitCSS($css);

			// слайдер на разные резолюшены (перечисляем сверху вниз):
			
			// $j=21;
			$cssMedias = array();
			/*for ( $w=HomeMenuImage::FULL_WIDTH; $w>=PublicPage::MIN_WIDTH; $w-=PublicPage::WIDTH_STEP ) {
				$h = self::heightForWidth($w);
				// $cssMedias["all and (max-width: ".$w."px)"]["ul#shortTexts li.first"] = "margin-left:".$j."%";
				$cssMedias["all and (max-width: ".$w."px)"]["ul#homeMenuImages"] = "height:".$h."px";
				$cssMedias["all and (max-width: ".$w."px)"]["div#homeMenuFrameGround"] = "height:".$h."px";
				$cssMedias["all and (max-width: ".$w."px)"]["div#headerCap2"] = "top:".($h-4)."px";
				$cssMedias["all and (max-width: ".$w."px)"]["ul#homeMenuImages li"] = "height:".$h."px";

				$cssMedias["all and (max-width: ".$w."px)"]["ul#homeMenus"] = "height:".$h."px";
				$cssMedias["all and (max-width: ".$w."px)"]["ul#homeMenus li.slide"] = "height:".$h."px";
				$cssMedias["all and (max-width: ".$w."px)"]["ul#homeMenus li.slide h2"] = "font-size:".max(1.4,round(($w/2560)*$h2,1))."em";
				$cssMedias["all and (max-width: ".$w."px)"]["ul#homeMenus li.slide h3"] = "font-size:".max(1.1,round(($w/2560)*$h3,1))."em";
				$j-=0.5;
			}*/
			$j=82;
			$cssMedias["all and (max-width: 2250px)"]["ul#shortTexts"] = "width:73%";
			$cssMedias["all and (max-width: 1960px)"]["ul#shortTexts"] = "width:82%";
			$cssMedias["all and (max-width: 1300px)"]["ul#shortTexts li"] = "margin-right:2%;";
			for ( $w=1920; $w>=PublicPage::MIN_WIDTH; $w-=PublicPage::WIDTH_STEP ) {
				$cssMedias["all and (max-width: ".$w."px)"]["ul#shortTexts"] = "width:".$j."%";
				$j+=2;
			}

			// $cssMedias["all and (max-width: 1645px)"]["ul#shortTexts"] = "width:84%";
			// $cssMedias["all and (max-width: 1550px)"]["ul#shortTexts"] = "width:88%";
	
			$page->submitCSSMedias($cssMedias);
			
			
		}

		public static function heightForWidth($w) {
			return round($w/(HomeMenuImage::FULL_WIDTH/HomeMenuImage::FULL_HEIGHT));
		}

		public static function showSlides($items, $page, $height=NULL) {
			if ( !sizeof($items) ) return;

			if ( !$height ) $height = HomeMenuImage::FULL_HEIGHT;
?>
<div id="homeMenuFrame"><div id="homeMenuFrameInner">
<ul id="homeMenus">
<?
				$i = 0;
				foreach ( $items as $item ) {
					$css = array();
					if ( $i == 0 ) $css[] = "current";
					$css[] = "slide";
?>
<li<?= sizeof($css)?" class='".implode(" ", $css)."'":"" ?> id="text<?= $i ?>">
<h2><?= nl2br($item->name) ?></h2>
<ul id='shortTexts'>
<li class="left first">
	
	<div class="shortTextBlock">
	
		<div class="topPad">
			<div class='bordWhite topPadLeft'></div>
			<div class='bordWhite topPadRight'></div>
		</div>
		<div class="padText">
			<p><?= $item->shortLeft ?></p>
		</div>
		<div class="padTextBack"></div>
		
	</div>
</li>
<li class="left">
	
	<div class="shortTextBlock">
	
		<div class="topPad">
			<div class='bordWhite topPadLeft'></div>
			<div class='bordWhite topPadRight'></div>
		</div>
		<div class="padText">
			<p><?= $item->shortCenter ?></p>
		</div>
		<div class="padTextBack"></div>
		
	</div>
</li>
<li class="left">
	
	<div class="shortTextBlock">
	
		<div class="topPad">
			<div class='bordWhite topPadLeft'></div>
			<div class='bordWhite topPadRight'></div>
		</div>
		<div class="padText">
			<p><?= $item->shortRight ?></p>
		</div>
		<div class="padTextBack"></div>
		
	</div>
</li>
</ul>
</li>
<?					$i++;
				}
?>
</ul><? //homeMenus ?>

</div><? //homeMenuFrame.inner ?>
</div><? //homeMenuFrame ?>
<?
		}

		public static function showSlideImages($items, $page, $height=NULL) {
			if ( !sizeof($items) ) return;

			if ( !$height ) $height = HomeMenuImage::FULL_HEIGHT;
?>
<div id='homeMenuFrameGround'>
<div class='bordWhite left'></div>
<div class='bordWhite center'></div>
<div class='bordWhite right'></div>
</div>
<ul id="homeMenuImages">
<?
				$i = 0;
				foreach ( $items as $item ) {
					$css = array();
					if ( $i == 0 ) $css[] = "current";

					if ( $item->data("HomeMenuImage_id") ) {
						$thumb = new HomeMenuImage();
						$thumb->applyArray($item->data(),"HomeMenuImage_");
						$imageURL = $thumb->url();
					}
					else {
						$imageURL = "/i/e.gif";

					}
?>
<li<?= sizeof($css)?" class='".implode(" ", $css)."'":"" ?> id="image<?= $i ?>" style="background-image:url('<?= $imageURL ?>')">

</li>
<?					$i++;
				}
?>
</ul><? //homeMenuImages ?>
<?
		}
		public function show($view) {
			switch ($view){
				case 'admin': $this->showAdminListItem();
			}
		}
		public function setDefaultValues() {
			$this->isActive = 1;
		}

		public function posConditionProperties() {
			//return array("brandId");
		}

	}
?>
