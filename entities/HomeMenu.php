<?
	//@Name('Слайдер на главной')
	//@Names('Слайды на главной')
	//@NameR('Слайда')
	//@Image('HomeMenuImage')
	class HomeMenu extends EntityBase {
		const PER_PAGE		= 20;
		const MAX_CELLS		= 7;
		const MIN_SLIDE_HEIGHT = 300;
		
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

		// @Length(200)
		// @Name("Название")
		// @Required
		// @FormType('textarea')
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
		
		protected function showFormCell($prop,$view,$attrs){
			$this->counts = array();
			$counts = DB::select("SELECT cell, COUNT(id) AS countItems FROM home_menu hm WHERE isActive GROUP BY cell ORDER BY countItems");
			foreach ( $counts as $a ) {
				$this->counts[$a['cell']] = $a['countItems'];
			}
			for ( $i=0; $i<HomeMenu::MAX_CELLS; $i++ ) {
				$count = intval($this->counts[$i]);
?>
			<input type="radio" name="cell" id="cell<?= $i ?>" value="<?= $i ?>"<?= $this->cell==$i?" checked":"" ?>>
			<label for="cell<?= $i ?>"><?= ($i+1) ?> <span class="g">[<?= $count ?>]</span></label> &nbsp;&nbsp;
<?
			}
		}
		public static function fetchItem($view,$id){
			if($view===99){
				$sql='SELECT hm.*, (SELECT GROUP_CONCAT(b.brandId) FROM home_menu_brand b WHERE b.homeMenuId=hm.id) as brandId FROM home_menu hm WHERE hm.id='.$id;
				$hm=self::fetchOne($sql);
				return $hm;
			}
			else return parent::fetchItem($view,$id);
		}
		public static function fetchList($view){
			if($view==1 || $view==2) return self::fetchSlides(); //HomePage view
			else return parent::fetchList($view);
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
		public static function showList($view,$items=NULL,$htmlId=NULL){
			if($view==1){
?>
			<div id='homeMenuFrameGround'></div>
<?
			}
			if($view==2){
?>
			<div id="homeMenuFrame">
				<div id="homeMenuFrameInner">
<?			
			}

			parent::showList($view,$items,$htmlId);

			if($view==2){
?>
				</div>
			</div>
<?			
			}
		}
		public function viewListItem($view,$i=NULL,$css=NULL){
			if($view===1) $this->viewListSlide($i,$css); //show images
			else if($view===2) $this->showListContent($i,$css); //show text content in slide
			else parent::viewItem($view);
		}

		public function viewListSlide($i=NULL,$css=NULL){
			$css = array();
			if ( $i == 0 ) $css[] = "current";
			if ( $this->data("HomeMenuImage_id") ){
				$thumb = new HomeMenuImage();
				$thumb->applyArray($this->data(),"HomeMenuImage_");
				$imageURL = $thumb->url();
			}
			else {
				$imageURL = "/i/e.gif";
			}
?>
			<li<?= sizeof($css)?" class='".implode(" ", $css)."'":"" ?> id="image<?= $i ?>" style="background-image:url('<?= $imageURL ?>')"></li>
<?
		}

		public function showListContent($i=NULL,$css=NULL){
			$css = array();
			if ( $i == 0 ) $css[] = "current";
			$css[] = "slide";
?>
			<li<?= sizeof($css)?" class='".implode(" ", $css)."'":"" ?> id="text<?= $i ?>">
				<h2><?= nl2br(strip_tags($this->name)) ?></h2>
			</li>
<?
		}

		public static function cssSlides($page, $height=NULL) {
			if ( !$height ) $height = HomeMenuImage::FULL_HEIGHT;
			$css = array();

			$h2 = 4.2;
			$h3 = 1.8;
			
			//блок с текстом
			$css["div#homeMenuFrame"] = "position:absolute;left:0;top:".PublicPage::HEADER_HEIGHT."px;width:100%;height:".($height-PublicPage::HEADER_HEIGHT)."px;";
			$css["ul#homeMenus"] = "position:relative;width:100%;height:100%;";
			$css["ul#homeMenus li.slide"] = "display:none;position:absolute;margin:0;padding:0;width:100%;height:100%;text-align:center;";
			$css["ul#homeMenus li.slide.current"] = "display:block;";
			$css["ul#homeMenus li.slide h2"] = "font:bold ".$h2."em 'PT Sans',Arial;color:#fff;font-style:normal;margin:0.25em 0 0 0; text-transform:uppercase; text-align:center; padding:0;letter-spacing:-1px;line-height:1.05em;text-shadow:0 1px 1.5px #000";
			
			//блок с фото
			$css["ul#homeMenuImages"] = "position:absolute;z-index:2;top:0;left:0;margin:0;padding:0;list-style:none;width:100%;height:".$height."px;min-width:".PublicPage::MIN_WIDTH.'px';
			$css["ul#homeMenuImages li"] = "visibility:hidden;position:absolute;margin:0;padding:0;width:100%;height:100%;background-position:center bottom;background-repeat:no-repeat;background-size:cover;";
			$css["ul#homeMenuImages li.current"] = "visibility:visible;";
			
			//заливка
			$css["div#homeMenuFrameGround"] = "position:absolute;left:0;top:0;width:100%;height:".$height."px;background-image:url('/i/7.png');background-position:bottom left;background-repeat:repeat-x;background-color:".PublicPage::HOME_MENU_GROUND.";z-index:3";

			$page->submitCSS($css);

			// слайдер на разные резолюшены (перечисляем сверху вниз):
			$cssMedias = array();
			for ( $w=PublicPage::MAX_WIDTH; $w>=PublicPage::MIN_WIDTH; $w-=PublicPage::WIDTH_STEP ) {
				$h = self::heightForWidth($w,$height);
				if($h<self::MIN_SLIDE_HEIGHT) break;
				$cssMedias["all and (max-width: ".$w."px)"]["ul#homeMenuImages"] = "height:".$h."px";
				$cssMedias["all and (max-width: ".$w."px)"]["div#homeMenuFrame"] = "height:".($h-PublicPage::HEADER_HEIGHT)."px";
				$cssMedias["all and (max-width: ".$w."px)"]["div#homeMenuFrameGround"] = "height:".$h."px";
				$cssMedias["all and (max-width: ".$w."px)"]["ul#homeMenus li.slide h2"] = "font-size:".max(2.1,round(($w/2560)*$h2,1))."em;";
				
			}
			$page->submitCSSMedias($cssMedias);
		}

		public static function heightForWidth($w) {
			return round($w/(HomeMenuImage::FULL_WIDTH/HomeMenuImage::FULL_HEIGHT));
		}
		public function setDefaultValues() {
			$this->isActive = 1;
		}
	}
?>
