<?
	/**
		This is base class for all public pages of the site.
		Admin pages are derived from AdminPage.
	*/
	class PublicPage extends WebPage {
		const IN								= "/in.html";
		const OUT								= "/out.html";
		const FORGOT_PASSWORD					= "/forgot-password/";
		const FORGOT_PASSWORD_SENT				= "/forgot-password/sent.html";
		const REGISTRATION						= "/registration/";
		const REGISTRATION_DONE					= "/registration/done.html";
		const REGISTRATION_CONFIRMATION			= "/registration/confirmation.html";
		const REGISTRATION_CONFIRMATION_NEEDED	= "/registration/confirmation-needed.html";
		const REGISTRATION_CONFIRMATION_RETRY	= "/registration/confirmation-needed.html?retry=1";
		const TERMS_AND_CONDITIONS				= "/terms-and-conditions.html";
		
		const MAX_WIDTH = 2560;
		const MAX_LAYOUT_WIDTH = 1200;
		const MIN_WIDTH = 980;
		const WIDTH_STEP = 100;
		
		const HEADER_HEIGHT = 70;

		// restricted pages:
		const HOME								= "/";
		const MY								= "/";
		const POS_ITEM							= "/pos.html";
		const DEL_ITEM							= "/del.html";
		const DEL_FILE							= "/del.html";
		const TOGGLE_ITEM						= "/toggle.html";

		const CLIENT_LIST						= "/clients/";
		const CLIENT_EDIT						= "/clients/edit.html";

		const AD_LIST							= "/ads/";
		const AD_EDIT							= "/ads/edit.html";

		
/****************************************
	ВСЕ ЦВЕТА САЙТА ЗДЕСЬ
****************************************/
		const A_COLOR			= "#66c";
		const A_COLOR_HOVER		= "#000";
		const A_COLOR_VISITED	= "#ff4526";
		const H1_COLOR			= "#323a45";
		const BG_LITE			= "#ffc";
		const COLOR_GRAY		= "#999";
		const BODY_TEXT_COLOR	= '#647484';
		const BODY_BG_COLOR		= '#dad2cc';
		const HOME_MENU_GROUND		= 'rgba(0,110,106,0.75)';

		
		// miscellanious consts:
		const FORM_PLS_SELECT		= "-- пожалуйста, выберите --";

		var $menuID;
		var $textKeys = array();

		protected $isHome = false;
		protected $navPath = array();

/******************************
Статические методы
******************************/

		/**
			Returns instance of Yandex Direct channel.
		*/
		public static function yandexDirect() {
			/**
			$y = new YandexDirectJSON("playnext-promo");
			$y->applicationId = '2cfe2f2184d0445e9355d421569615f8';
			$y->token = 'bd031dba936a431ca3af615194e8bc53';
			return $y;
			**/
		}

		/**
			Returns current logged in User.
		*/
		public static function user() {
			return User::current();
		}

		/**
		*	Processes page text (edited on Admin pages) just before publishing it.
		*/
		public static function preProcessText($str) {
			return $str;
		}

/******************************
Публичные методы
******************************/

		protected function initSession() {
			session_start();
		}

		protected function checkAccess() {
			parent::checkAccess();

			// detect & fetch current user - always from DB:
			$this->user = User::fetchCurrent();

			// detect city:
			/*$this->city = City::current();
			if ( !$this->city ) {
				// determine city by IP:
				$this->city = IP2City::resolve();
				$this->cityLive = IP2City::wasLive();

				City::remember($this->city);
			}*/
		}

		protected function initCSS() {
			parent::initCSS();

			$this->css["body"] = "font:1em 'Trebuchet MS','Segoe UI',Arial,Tahoma,sans-serif;color:".self::BODY_TEXT_COLOR.";padding:0;margin:0;background:".self::BODY_BG_COLOR." url('/i/bg7.jpg') fixed;width:100%;min-width:".self::MIN_WIDTH."px";
			$this->css["h1"] = "margin:0 0 1em 0;color:".self::H1_COLOR.";font:normal 2.2em 'Segoe UI',Arial,sans-serif;text-transform:uppercase;line-height:1em;border-bottom:1px solid ".self::H1_COLOR.";padding:0 0 0.5em 0;letter-spacing:-1px";
			$this->css["h1 a"] = "text-decoration:none";
			$this->css["h1 a:hover"] = "text-decoration:underline;color:".self::A_COLOR;
			$this->css["h1.right"] = "float:right;border:0";
			$this->css["h2"] = "font:bold 1.4em Arial,Tahoma,sans-serif;color:".self::H1_COLOR.";margin:1.5em 0 0.5em 0;letter-spacing:-1px;line-height:1em;";
			$this->css["h3"] = "font:bold 1em Arial,Tahoma,sans-serif;color:".self::H1_COLOR.";margin:1em 0 0.5em 0;line-height:1.2em;";
			$this->css["h4"] = "font:bold 1em Arial,sans-serif;color:".self::H1_COLOR.";margin:1.5em 0 0.5em 0;line-height:1em;letter-spacing:-1px";
			$this->css["a"] = "outline: 0;color:".self::A_COLOR;
			$this->css["a:hover"] = "color:".self::A_COLOR_HOVER;
			$this->css["p"] = "margin:0 0 0.75em 0;padding:0;";

			// pseudo headers:
			$this->css[".h1"] = $this->css["h1"];
			$this->css[".h2"] = $this->css["h2"];
			$this->css[".h3"] = $this->css["h3"];
			$this->css[".h4"] = $this->css["h4"];
			$this->css[".h5"] = $this->css["h5"];
			$this->css[".b"] = "font-weight:bold";

			// special classes:
			$this->css[".a"] = $this->css["a"].";cursor:pointer;border-bottom:1px solid ".self::A_COLOR;
			$this->css[".a2"] = "color:".self::A_COLOR.";border-bottom:1px dotted ".self::A_COLOR.";cursor:pointer";
			$this->css[".a2:hover"] = "color:".self::A_COLOR_HOVER.";border-bottom:1px dotted ".self::A_COLOR_HOVER.";";
			$this->css[".clickable"] = "cursor:pointer";
			$this->css[".hidden"] = "display:none";
			
			//default cursor for text
			$this->css['h1, h2, h3, h4, .h1, .h2, .h3']='cursor:default';
			
			// dummy and fade:
			$this->css["div#dummy-width"] = "position:absolute;top:0;width:100%;";
			
			//animate transition classes
			$this->css[".animate"] = "transition:all 0.3s ease-out 0s;";
			$this->css[".animateFast"] = "transition:all 0.1s ease-out 0s;";
			$this->css[".animateSlow"] = "transition:all 0.5s ease-out 0s;";

			//global layout:
			$this->css["div#layout"] = "position:relative;z-index:2;margin:0 auto 3em auto;width:90%;min-width:".self::MIN_WIDTH."px;max-width:".self::MAX_LAYOUT_WIDTH."px;padding:100px 1em 3em 1em";

			// header - inside layout:
			$this->css["div#header"] = "position:absolute;z-index:10;left:0;top:0;width:100%;height:".self::HEADER_HEIGHT."px;";

			// logo - inside header:
			$this->css["div#logo"] = "position:absolute;top:33px;left:1em;width:90px;height:32px;";
			$this->css["div#logo img.logo"] = "width:90px;height:32px;border:0;display:block;";
			
			//user - inside header
			$this->css["div.userInHead"] = "position:absolute;top:33px;right:1em;width:40px;height:42px;background:url('/i/userKey.png') center center no-repeat;";
			
			// footer - outside layout:
			$this->css["div#footer"] = "position:relative;border-top:2px solid #ddd;padding:1em;";

			// feedback:
			$this->css["div#feedback"] = "text-align:center;";
			$this->css["div#feedback span.a2"] = "color:".self::A_COLOR.";border-bottom:1px dotted ".self::A_COLOR;
			$this->css["div#feedback span.a2:hover"] = "color:".self::A_COLOR_HOVER.";border-bottom:1px dotted ".self::A_COLOR_HOVER;

			// disable some styles in print media:
			$this->cssPrint[".noPrint"] = "display:none";
		}

		/**
			Called in PublicPage::init() when making sub menu.
			It accepts $callingPage - reference to current page (Internal page or its derived page) where init() is called.
			Override this method to change how a page should look in sub menu or to append page children.
		*/
		protected function menuPage($callingPage) {
			$smi = new Page($this->toArray());
			$smi->url = $this->url();
			$smi->children = array();

			if ( $this->data("imageId") ) {
				$smi->image = new PageImageIcon();
				$smi->image->id = $this->data("imageId");
				$smi->image->ext = $this->data("imageExt");
			}
			else $smi->image = NULL;

			return $smi;
		}

		protected function isPureParentForNavPath() {
			return false;//$this->codeLevel()==1 ? true : false;
		}

		protected function init() {
			parent::init();


			// javascript is always required:
			$this->isJSRequired = true;
			$this->jsFiles["Fade.js"] = true;
			$this->jsFiles["Browser.js"] = true;
			$this->jsFiles["Event.js"] = true;
			$this->jsFiles["Screen.js"] = true;
			$this->jsFiles["CSS.js"] = true;
			$this->jsFiles["Ajax.js"] = true;
			$this->jsFiles["HTML.js"] = true;
			$this->jsFiles["Form.js"] = true;
			$this->jsFiles["FX.js"] = true;

			$this->jsFiles["//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"] = true;
			// $this->jsFiles["jquery.maskedinput-1.2.2.js"] = true;

			// append nav path - after content is fetched:
			$this->appendNavPath();

		}

		protected function appendNavPath() {
			/*if ( $this->code ) {
				// add parent pages to navPath:
				$parentCodes = array();
				for ( $i = 0; $i<strlen($this->code)/Page::LEVEL_WIDTH-1; $i++ ) {
					$parentCodes[] = $this->codeParentAtLevel($i);
				}
				$topParents = PageEntity::fetchAndTransform("SELECT p.*"
					.", (SELECT pad.data FROM ".E5::TABLE_PAGE_ACTION_DATA." pad, ".E5::TABLE_PAGE_ACTION_DATA_PAGE." padp WHERE pad.id=padp.dataId AND padp.pageId=p.id) AS actionData"
					." FROM page p"
					." WHERE p.code IN ('".implode("','",$parentCodes)."') ORDER BY p.code");
				foreach ( $topParents as $page ) {
					if ( !$page->isActive ) continue;
					$this->navPath[] = new NavPathPage($page->name, $page->title, !$page->isPureParentForNavPath()?$page->url():NULL);
					///$this->navPath[] = new NavPathPage($page->name, $page->title, $page->codeLevel()!=1&&!$page->isPureParent?$page->url():NULL);
				}
			}
			else {
				// add home page to nav path:
				$np = new NavPathPage($this->homePage->name, $this->homePage->title, $this->homePage->url());
				$this->navPath[] = $np;
			}
			if ( $this->name ) {
				$np = new NavPathPage($this->name, $this->title, $this->url());
				$this->navPath[] = $np;
			}*/
		}

		protected function showBeforeBody() {
?>
<div id="layout">
<?
			parent::showBeforeBody();	// start of content
		}

		protected function showBodyH1() {
			if ( $this->h2 ) {
?>
<h2 class="preH1"><?= $this->h2 ?></h2>
<?
			}
			if ( $this->h1Right ) {
?>
<h1 class="right"><?= $this->h1Right ?></h1>
<?
			}
			if ( $this->h1 ) {
?>
<h1><?= $this->h1 ?></h1>
<?
			}
		}

		protected function showBodyText() {
			$hasAutoImages = $this->hasAutoImages && is_array($this->images) && sizeof($this->images)>0;
			if ( $this->body || $hasAutoImages ) {
?>
<div class="pageBody">
<?
				if ( $hasAutoImages ) {
					$str = "";
					$str .= "<ul class='pageImages'>\n";

					$i = 0;
					foreach ( $this->images as $image ) {
						$i++;
						$image->setURLWidth(PageImage::WIDTH_AUTO);
						$str .= "<li".($i==1?" class='first'":"")."><img viewIndex=\"".($i-1)."\" src='".$image->url()."'".($image->name?" alt='".p($image->name)."'":"")."></li>\n";
					}
					$str .= "</ul>\n";
					$this->body = $str . $this->body;
				}

				if ( $this->body ) {
					//$this->body = $this->applyImageViewer($this->body);
					//$this->body = $this->applyVideos($this->body);
?>
<?= self::preProcessText($this->body) ?>
<?
				}
?>
</div>
<?
			}
		}

		protected function showBody() {
			$this->showBodyH1();
			$this->showBodyText();
		}

		protected function showSubMenuLevel($items, $level=0, $maxLevel=99, $forceChildren=false, $forceLI=false) {
			if ( !sizeof($items) ) return;
			if ( $level > $maxLevel ) return;
?>
<ul>
<?
			$i = 0;
			foreach ( $items as $page ) {

				$isSelected = $this->id == $page->id;
				$isChild = false;
				$isOpen = false;
				if ( $page->code ) {
					$isChild = $page->codeLevel() > 2 ? true : false;
					$isSelected = $isSelected || $this->codeEquals($page->code);
					//$isOpen = ($page->codeLevel() > 1 && is_array($page->children) && sizeof($page->children) && !$page->isCollapsed ) || ($isSelected && !$isChild) || $page->isCodeTreeParentOf($this->code);
					$isOpen = ($isSelected && !$isChild) || $page->isCodeTreeParentOf($this->code);
				}
				if ( $isSelected ) $selectedPage = $page;
				if ( $isOpen ) $openPage = $page;
				$i++;

				$classes = array();

				if ( $i == 1 ) $classes[] = "first";
				if ( $isSelected ) $classes[] = "sel";
				if ( $isOpen ) $classes[] = "open";
				if ( sizeof($page->children) ) $classes[] = "withChildren";
				$classes[] = "l".$level;
				$classes[] = "i".($i-1);

				///if ( $i == 1 ) $classes[] = "over";

				if ( preg_match("/^NEW\!.+$/i", $page->name) ) {
					$classes[] = "new";
					$name = trim(preg_replace("/^NEW\!(.+)$/i", "$1", $page->name));
				}
				else if ( preg_match("/^HOT\!.+$/i", $page->name) ) {
					$classes[] = "hot";
					$name = trim(preg_replace("/^HOT\!(.+)$/i", "$1", $page->name));
				}
				else $name = $page->name;

				//if ( $page->codeLevel() == 1 ) $zIndex = sizeof($items) - $i + 10;
				//else
				$zIndex = NULL;

				if ( $page->css ) $classes[] = $page->css;
?>
<li id="menu_<?= $page->id ?>"<?= (sizeof($classes)?" class='".implode(" ", $classes)."'":"") ?> onMouseOver="CSS.a(this,'over')" onMouseOut="CSS.r(this,'over')"<?= $zIndex?" style='z-index:".$zIndex."'":"" ?>>
<?
				if ( $page->image ) {
?>
<div class="i" style="width:<?= $page->image->width ?>px;height:<?= $page->image->height ?>px"><img src="<?= $page->image->url() ?>"></div>
<?
				}
?>
<div class="name<?= (sizeof($classes)?" ".implode(" ", $classes):"") ?>" onMouseOver="CSS.a(this,'over')" onMouseOut="CSS.r(this,'over')"<?
				if ( !$page->blank ) {
?>
onClick="<?= $page->isPureParent&&sizeof($page->children)&&$page->codeLevel()>1?"toggleMenu('".$page->id."')":"self.location.href='".$page->url()."'" ?>"<?
				}
?>>
<div class="inner"><?
				//if ( $page->codeLevel()>1 ) print "&mdash;&nbsp;";
				if  ( $page->isPureParent && sizeof($page->children) && $page->codeLevel()>1 ) $url = "javascript:toggleMenu('".$page->id."')";
				else $url = $page->url();
?>
<a<?= (sizeof($classes)?" class='".implode(" ", $classes)."'":"") ?> href="<?= $url ?>"<?= $page->blank?" target='_blank'":"" ?> title="<?= $page->title ?>"><?= $name ?></a></div></div>
<?
				if ( $page->icon ) {
?>
<div class="icon"><?= $page->icon ?></div>
<?
				}
?>
<?
				//if ( ($isOpen || $isSelected ) && is_array($page->children) && sizeof($page->children) && $level < $maxLevel ) {
				if ( $level < $maxLevel && is_array($page->children) && sizeof($page->children) && ( $isOpen || $forceChildren ) ) {
?>
<div class="children" id="subMenu_<?= $page->id ?>">
<?
					//$page->showBeforeSubMenu();
					$this->showSubMenuLevel($page->children, $level+1, $maxLevel, $forceChildren);
?>
</div>
<?
				}
?>
</li>
<?
			}
?>
</ul>
<?
		}

		protected function showAfterBody() {

			$this->showNavPath();

			parent::showAfterBody();	// end of content

			$this->showAfterBodyEnd();
?>
<div class="clear"></div>

<div id="header">
<?
			$this->showInHeader();
?>
</div><? // header ?>
<?
			$this->showBeforeLayoutEnd();
?>
</div><? //layout ?>
<?
			$this->showAfterLayout();
?>
<div id="footer">

<div id="feedback">
Нужна помощь? Нашли ошибку? <span class="a2" onClick="CR.show()">Сообщите нам!</span>
</div><?//feedback ?>

</div><? //footer ?>
<?
		}

		protected function showAfterBodyEnd() {
		}

		protected function showAfterLayout() {
?>
		<div id="dummy-width"></div>
<?
		}

		protected function showNavPath() {
			// show nav path
			if  ( sizeof($this->navPath) ) {
?>
<div id="navPath">
<ul>
<?
				//print " / ";
				$i = 0;
				foreach ( $this->navPath as $navPage ) {
					$i++;

					$css = array();

					if ( $i == 1 ) {
						$css[] = "first";
						$name = "&nbsp;";
					}
					else $name = $navPage->name;

					if ( $navPage->url && $i<sizeof($this->navPath) ) {
?>
<li<?= sizeof($css)?" class='".implode(" ", $css)."'":"" ?> onClick="self.location.href='<?= $navPage->url ?>'" onMouseOver="CSS.addClass(this,'over')" onMouseOut="CSS.removeClass(this,'over')"><div class="l"><div class="r"><a href="<?= $navPage->url ?>" title="<?= p($navPage->title) ?>"><?= String::maxWords($name, 5, "...") ?></a></div></div></li>
<?
					}
					else {
?>
<li class="last"><?= String::maxWords($name, 5, "...") ?></li>
<?
					}
					//if ( $i < sizeof($this->navPath) ) print " / ";
				}
?>
</ul>
</div>
<?
			}
		}

		protected function showBeforeLayoutEnd() {
		}

		protected function showInHeader() {
?>
<div id="logo">
<?
			if ( $this->isHome ) {
?>
<img class="logo" src="/i/logo.png" title="<?= p($this->title) ?>">
<?
			}
			else {
?>
<a href="/" title="<?= p($this->homePage->title) ?>"><img class="logo" src="/i/logo.png"></a>
<?
			}
?>
</div><?// logo ?>
<?
			$this->showUserBlock();
			//$this->showMenu();
			
		}
		public function showUserBlock(){
?>
		<div class='userInHead'></div>
<?		
		}
		protected function showMenu() {
?>
<div id="menu">
<?
			$this->showSubMenuLevel($this->menu, 0, 2, true);
?>
</div><? //menu ?>
<?
		}
		protected function fetchMainMenu($maxLevel=2) {
			// fetch menu (one or several levels) with page action data:
			$sql = "SELECT p.*"
			//.", t.*"
			.", (SELECT COUNT(*) FROM page p2 WHERE code LIKE CONCAT(p.code, '".str_repeat("_", $this->levelWidth()*2)."')) AS countChildren"
			.", (SELECT pad.data FROM ".E7::TABLE_PAGE_ACTION_DATA." pad, ".E7::TABLE_PAGE_ACTION_DATA_PAGE." padp WHERE pad.id=padp.dataId AND padp.pageId=p.id) AS actionData"
			." FROM page p"
			//." LEFT JOIN (SELECT pi.parentId AS imageParentId, pi.id AS imageId, pi.ext AS imageExt, pi.pos AS imagePos, pi.width AS imageWidth, pi.height AS imageHeight FROM page_image_icon pi WHERE pi.pos=1) AS t ON p.id=t.imageParentId"
			//." WHERE p.code LIKE '".$this->codeParentAtLevel(1)."%'"
			." WHERE LENGTH(p.code)>=".($this->levelWidth()*2)	// from 2nd level
			." AND LENGTH(p.code)<=".($this->levelWidth()*$maxLevel)	// to some level
			//." GROUP by p.id"
			." ORDER BY p.code";
			//die($sql);
			$this->menuRaw = Page::fetchAndTransform($sql);

			// form Menu and exclude inactive pages:
			$allMenuItems = array();
			if ( !is_array($this->menu) ) $this->menu = array();
			$pIsActive = Entity::$pIsActive;

			foreach ( $this->menuRaw as $id => $item ) {
				// exclude inactive:
				if ( !$item->$pIsActive ) continue;

				// take parent code:
				$pCode = $item->codeParent();

				// if this item has parent in the sub menu - save it as a child, else - skip:
				foreach ( $allMenuItems as $pc => $p ) {
					if ( $p->codeEquals($pCode) ) {
						// this sub mneu item has a parent in menu - $p is a parent of this item:
						$p->children[$item->code] = $item->menuPage($this);
						$allMenuItems[$item->code] = $p->children[$item->code];
						continue 2;
					}
				}

				if ( $item->codeLevel()!=1 ) continue;

				// this is a top level menu item - append menu:
				$this->menu[$item->code] = $item->menuPage($this);
				$allMenuItems[$item->code] = $this->menu[$item->code];
			}
		}
	}
?>
