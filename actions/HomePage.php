<?
	class HomePage extends PublicPage {
		var $isHome = true;

		public function url() {
			return "/";
		}

		protected function initCSS() {
			parent::initCSS();
		// die('here');

			$this->alterCSS("div#layout", "padding:92px 0 0 0;position:relative;z-index:5;");

			HomeMenu::cssSlides($this);

/*
			$this->css["div#headerCap2"] = "position:absolute;z-index:3;left:0;top:".(HomeMenuImage::FULL_HEIGHT-4)."px;height:4px;width:100%;background:url('/i/banBord.png') repeat-x left bottom;";
			$this->css["div#homeLayoutInfo"] = "padding:520px 0 0 0";

			$this->css['#homeForm']='postion:relative;background:#fff;width:94%;padding:0 3% 50px;';
			$this->css["div#brands li.brand div.carsPad"] = "display:none;position:absolute;top:-4000px;";
			$this->css["div#brands li.brand.over div.carsPad"] = "top:auto;bottom:100%";
			$this->css["div#brands ul.cars"] = "width:100%; overflow:hidden; position:absolute; top:40px; left:0;";
			$this->css["div#brands ul.cars li.car"] = "float:left;width:33%;vertical-align:center; cursor:pointer; margin:0.5em 0 0 0";
			$this->css["div#brands ul.cars li.car div.img"] = "float:left;width:50%;border:0";

			$this->css["div#brands ul.cars li.car div.img img"] = "border:0;width:90%";
			$this->css["div#brands ul.cars li.car div.text"] = "font-family: 'PT Sans';color:#fff; margin:0 0 0 0.5em;padding:1em 0 0 0";
			$this->css["div#brands ul.cars li.car div.name"] = "font-size:1.5em;line-height:1.1em; font-weight:bold;";
			$this->css["div#brands ul.cars li.car div.price"] = "font-size:0.83em;color:#fff; margin:0.25em 0 0 0";
			$this->css["div#brands ul.cars li.car div.price span.value"] = "font-weight:bold; font-size:1.4em";
			$this->css["ul.tabs li div.brand"] = "position:relative;height:100%;overflow:hidden;overflow:hidden;";
			$this->css["ul.tabs li div.brand img"] = "position:relative;width:100%;max-width:".(BrandImage::FULL_WIDTH)."px;display:block;margin:20px auto 0; border-radius:10px; border:0;";

			$this->css["div#infoLeft"] = "float:left;width:55%;padding:0;";
			$this->css["div#infoRight"] = "float:right;width:38%;padding:0 0 0 0";

			$this->alterCSS("h1", "font-size:1.6em");

			$this->css["div#bodyText"] = "padding:0 0 0 2em";
			$this->css["div.pageBody"] = "width:100%";

			$this->css["div#brandPad"] = "display:none; position:absolute;z-index:3;top:-4000px;left:0;width:100%;height:".HomeMenuImage::FULL_HEIGHT."px;background:#000 url('/i/7.png') repeat 0 0";
			$this->css["div#brandPad.open"] = "top:92px";

			$this->css["div#homeBtns"] = "margin:0 0 2em 2em;font-size:1.6em;font-weight:100;letter-spacing:-1px; font-style:normal;";
			$this->css["div#homeBtns ul li"] = "margin:0; padding:0.5em 0;";
			$this->css["div#homeBtns ul li div.img"] = "float:left;width:43px;height:43px;background-repeat:no-repeat;background-position:0 0";
			$this->css["div#homeBtns ul li:hover div.img"] = "background-position:0 -43px";
			$this->css["div#homeBtns ul li div.name"] = "padding:0 0 0 20px;height:50px;display:table-cell;vertical-align:middle;";
			$this->css["div#homeBtns ul li.testDrive div.img"] = "background-image:url('/i/btnTestDrive.png')";
			$this->css["div#homeBtns ul li.tic div.img"] = "background-image:url('/i/btnTic.png')";
			$this->css["div#homeBtns ul li.service div.img"] = "background-image:url('/i/btnService.png')";
			$this->css["div#homeBtns ul li.calc div.img"] = "background-image:url('/i/btnCalc.png')";
			$this->css["div#homeBtns ul li.kasko div.img"] = "background-image:url('/i/btnKasko.png')";
			$this->css["div#homeBtns ul li.tradeIn div.img"] = "background-image:url('/i/btnTradeIn.png')";
			$this->css["div#homeBtns ul li.claim div.img"] = "background-image:url('/i/claim.png')";
			$this->css["div#homeBtns ul li a"] = "color:#4d4d4d;text-decoration:none;";
			$this->css["div#homeBtns ul li a:hover"] = "text-decoration:underline;color:";
			$this->css["div#homeBtns ul li:hover a"] = "text-decoration:underline;color:";
//cars
			$this->css["div#content ul.tabContents"] = "padding:60px 0 0;";
			Car::cssList($this);
			CarOrder::cssOrderForm($this);

//formContent
			$this->css['div.formContent']='width:60%;margin:0 auto;text-align:center;';
			$this->css['div.formContent div.title']='font-size:3em;margin-bottom:0.25em';
			$this->css['div.formContent div.title']='font-size:3em;margin-bottom:0.25em';
			$this->css['div.formContent div.formInput']='width:95%;margin:60px auto;position:relative;';
			$this->css['div.formContent form']='max-width:100%;';
			$this->css['div.formContent div.submit']='margin-top:60px;';
			$this->css['div.formContent div.NameInput']='width:300px;float:left;';
			$this->css['div.formContent div.EmailInput']='width:300px;float:right;';

			$this->css['div#globFrmContainer']='position:relative';
			$this->css['div#globFrmContainer #globFrmShad']='width:100%;height:100%;background:#b9b9b9;opacity:0.25;position:absolute;left:0;top:0;display:none;';
			$this->css['div#globFrmContainer #formBysy']='width:100px;height:100px;background:url("/i/busy.gif") center center no-repeat;position:absolute;left:46%;bottom:46%;display:none;';
*/
		}


		protected function init() {
			// $this->textKeys[] = "FORM-DESCRIPTION";
			parent::init();
			$this->jsFiles["HomeMenu.js"] = true;

		}

		// hide nav path:
		protected function showNavPath() {
		}

		protected function showBody() {
			$countBrands = sizeof($this->brands);
?>
<div id="homeLayoutInfo">
	<div id="infoLeft">
<?
			parent::showBodyH1();
?>
		<div id="bodyText">
<?
			parent::showBodyText();
?>
		</div>
		<div class="clear"></div>
	</div><? //infoLeft ?>

	<div class="clear"></div>
</div><? //homeLayoutInfo ?>
<?
			// Brand::showList();
			// CarOrder::showOrderForm($this->brands,$this->brandCars,$this->selCarIds,$this->selBrands,$this->texts);

		}
		protected function showBeforeLayoutEnd() {
			parent::showBeforeLayoutEnd();
			HomeMenu::showList($view=2,NULL,'homeMenus'); //show slide content
		}
		protected function showAfterLayout(){
			parent::showAfterLayout();
			HomeMenu::showList($view=1,NULL,'homeMenuImages'); //show slide images
		}
	}
?>