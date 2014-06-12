<?

	class AdminPage extends WebPage {
		// here we store curretn manager:
				
		protected $administrator = NULL;

		// sub title to display under title
		var $subTitle;

		/**
			List here all admin pages and allowed access level to them:
		*/
		protected static function adminPages() {

			$list = array(
				array("name" => "Слайдер", "entity" => "HomeMenu"),
				array("name" => "Страницы сайта", "url" => "/AdminPages.html"),
				"sep",
				array("name" => "Бренды", "entity" => "Brand"),
				"sep",
				array("name" => "Тексты сайта", "url" => "/AdminContents.html"),
				array("name" => "Справочники", "url" => "/AdminLibraries.html"),
				array("name" => "Настройки", "url" => "/AdminParams.html"),
				array("name" => "Администраторы", "url" => "/AdminAdministrators.html"),
			);
			return $list;
		}

		/**
			Implements access control.
		*/	
		protected function checkAccess() {
			// check if admin is logged in:
			if ( !$_SESSION[Administrator::SESSION] ) {
				$_SESSION['AdminLoginRedirect'] = $_SERVER['REQUEST_URI'];
				go("/AdminLogin.html");
			}

			// get manager from session:
			$this->administrator = unserialize($_SESSION[Administrator::SESSION]);
			if ( !$this->administrator->id ) go("/AdminLogin.html");
		}

		/**
			Add session support:
		*/
		protected function initSession() {
			session_start();
		}

		/**
			Construct CSS:
		*/
		public function initCSS() {
			parent::initCSS();
			$this->css["body"] = "margin:0;padding:0;background-color:#eee;color:#555;font:1em 'Trebuchet MS',Tahoma,Verdana;";
			$this->css["td"] = "font:1em 'Trebuchet MS',Arial,Tahoma,Verdana;";
			$this->css["p"] = "margin:0 0 0.5em 0";

			// a:
			$this->css["a"] = "color:#33f;";
			$this->css[".a2"] = "border-bottom:1px dashed #33f;color:#33f;cursor:pointer";
			$this->css["a:hover"] = "color:#000;";

			// headings:
			$this->css["h1"] = "font-family:'Trebuchet MS',Tahoma,Verdana;color:#D9242D;margin:0 0 0.5em 0;padding:0;font-size:2em;font-weight:normal;letter-spacing:-1px;";
			$this->css["h2"] = "font-family:'Trebuchet MS',Tahoma,Verdana;color:#D9242D;margin:0 0 1em 0;padding:0;font-size:1.4em;font-weight:normal;";
			$this->css["h3"] = "font-family:'Trebuchet MS',Tahoma,Verdana;color:#ccc;margin:1em 0 0 0;padding:0;font-size:1em;font-weight:bold;";
			$this->css["h4"] = "font:1em bold 'Trebuchet MS',Tahoma,Verdana;color:#ccc;margin:1em 0 0 0;padding:0;border-top:1px dotted #ccc";

			$this->css[".g"] = "color:#aaa";

			// work area and copyrights:
			$this->css["#content"] = "margin:60px 1em 0 200px;";
			$this->css["#work-area"] = "padding:1em 2em 22em 2em;background-color:#fff;border:1px solid #ccc;";
			$this->css["#copyrights"] = "text-align:right;font-size:10px;color:#7C6DA1;padding:0 8px 8px 0";

			// dummy width:
			$this->css["#dummy-width"] = "position:absolute;top:0;left:0;width:100%;";

			// header:
			$this->css["#header"] = "position:absolute;top:0;left:0;width:100%;z-index:1;height:60px;";
			$this->css["#header table"] = "border-spacing:0;border-collapse:collapse;width:100%;";
			$this->css["#header table td"] = "padding:0";
			$this->css["#header img"] = "width:21px;height:21px;border:none";

			// main menu (left):
			$this->css["ul#menu"] = "position:absolute;left:20px;top:86px;margin:0;padding:0;list-style:none;";
			$this->css["ul#menu li"] = "margin:0 0 0.25em 0;border:1px solid #ccc;background-color:#eef;padding:0;text-align:center;width:179px;border-right:none;font-size:0.8em";
			$this->css["ul#menu li.sel"] = "width:173px;background-color:#fff;border-left:8px solid #fc0;";
			$this->css["ul#menu li.sep"] = "border:0;background:none;height:8px";
			$this->css["ul#menu li a"] = "color:#33f;text-decoration:none;";
			$this->css["ul#menu li a:hover"] = "color:#000;";

			// sub menu:
			$this->css["ul.menu"] = "padding:0;margin:0 0 1em 0;list-style:none;";
			$this->css["ul.menu li"] = "margin:0 2em 0 0;display:inline;background:#069;padding:0.5em 1em 0.5em 1em;text-align:center;font-size:0.83em;cursor:pointer;text-transform:uppercase;font-weight:bold";
			$this->css["ul.menu li:hover"] = "background-color:#036;";
			$this->css["ul.menu li a"] = "color:#fff;text-decoration:none;";

		}
		
		protected function init() {
			parent::init();
			$this->cssFiles["a/message.css"] = true;
			$this->cssFiles["a/Form.css"] = true;

			$this->jsFiles["HTML.js"] = true;
			$this->jsFiles["cookie.js"] = true;
			$this->jsFiles["Screen.js"] = true;
			$this->jsFiles["Event.js"] = true;
			$this->jsFiles["CSS.js"] = true;
			$this->jsFiles["a/Form.js"] = true;
			$this->jsFiles["a/AdminPage.js"] = true;
			$this->jsFiles["/fckeditor/fckeditor.js"] = true;
			
			$this->isJSRequired = true;


		}

		/**
			Overrides header.
		*/
		public function showBeforeBody() {
			parent::showBeforeBody();
?>
<div id="work-area">
<?
			if ( $this->title ) print "<h1".($this->subTitle?" style='margin-bottom:0'":"").">".$this->title."</h1>";
			if ( $this->subTitle ) print "<h2>".$this->subTitle."</h2>";
			if ( isset($_GET['err']) ) {
				$err = errPop();
				if ( $err ) self::err($err);
			}
		}

		/**
			Overrides common footer.
		*/
		public function showAfterBody() {
?>
</div><!-- /Work-area -->
</div><!-- /Content -->
<?
			parent::showAfterBody();
?>
<ul id="menu">
<li<?= preg_match("/AdminHomePage.html/i", $_SERVER['REQUEST_URI'])?" class='sel'":"" ?>><a href="/AdminHomePage.html">Главная</a></li>
<li class="sep"></li>
<?
			foreach ( self::adminPages() as $item ) {
				if ( $item == "sep" ) {
?>
<li class="sep"></li>
<?
					continue;
				}
				
				if ( !isset($item['url']) && !isset($item['entity']) ) continue;
				if ( !$this->administrator->isSuper ) {
					if ( !$item['allow'] ) continue;
					$p = $item['allow'];
					if ( !$this->administrator->$p ) continue;
				}

				$base = preg_replace("/^\/Admin(.+?)\.html$/", "$1", $item['url']);
				
				if($item['url']) {
					$url=$item['url'];
					$isSel = preg_match("/^\/Admin".$base.".*$/", $_SERVER['REQUEST_URI']);
				}
				else {
					$url='/AdminListPage.html?entity='.$item['entity'];
					if($this->entity==$item['entity']) $isSel = 1;
				}
?>
<li<?= $isSel?" class='sel'":"" ?>><a href="<?= $url ?>"><?= p($item['name']) ?></a></li>
<?
			}
?>
</ul>
<div id="dummy-width"><img src="/i/e.gif"></div>
<div id="header">
<table>
<tr>
	<td class="w100" style="height:56px;padding:0 0 0 1em;">
Администрирование <?= Config::TITLE ?><br />
<div class='s'>Текущий пользователь: <b><?= p($this->administrator->name) ?></b></div>
	</td>
	<td class="hR" style="padding:0 1em 0 0;"><a href="/AdminLogin.html" title="Выход"><img src="/i/a/close.gif" alt="Выход"></a></td>
</tr>
</table>
</div>

<div class="s hR" style="padding:1em 1.5em;">Поддержка: <a href="mailto:<?= Config::EMAIL_SUPPORT ?>"><?= Config::EMAIL_SUPPORT ?></a></div>
<?
			if ( !$_GET['err'] ) {
				if ( $_GET['s'] ) self::msgSaved();
				else if ( $_GET['d'] ) self::msg("Запись удалена!");
			}
		}

		/**
			Displayes web-editor.
		*/
		public static function attachWebEditor($field,$height=300,$customToolBar="Default") {
?>
<script language="Javascript1.2">
var oFCKeditor=new FCKeditor("<?= $field ?>");
oFCKeditor.BasePath="/fckeditor/";
oFCKeditor.Width='96%'; 
oFCKeditor.Height='<?= $height ?>px'; 
oFCKeditor.ToolbarSet="<?= $customToolBar ?>";
oFCKeditor.ReplaceTextarea();
</script>
<?
		}

		public static function msgSaved() {
			self::msg("Информация сохранена!");
		}
		
		public static function msg($msg) {
?>
<div id="dMsgSaved" style="position:absolute;z-index:2;width:350px;border:1px solid black;padding:0.5em 2em 0.5em 2em;text-align:center;background-color:#fc0;color:#333;font-weight:bold;"><?= $msg ?></div>
<script language="JavaScript">
<!--
function onWScroll(){
	dMsgSaved.style.top=(25+document.documentElement.scrollTop)+"px";
}
var dMsgSaved=null;
function showMsgSaved(){
	getScreenSize();
	dMsgSaved=document.getElementById("dMsgSaved");
	dMsgSaved.style.top="25px";
	dMsgSaved.style.left=(screenWidth/2-175)+"px";
	setTimeout("dMsgSaved.style.backgroundColor='#fe0'", 500);
	setTimeout("dMsgSaved.style.backgroundColor='#fc0'", 800);
	setTimeout("dMsgSaved.style.backgroundColor='#fe0'", 1200);
	setTimeout("dMsgSaved.style.backgroundColor='#fc0'", 1400);
	setTimeout("dMsgSaved.style.visibility='hidden'", 2400);
}
onReadys.push(showMsgSaved);
Event.on(window,"scroll",onWScroll);
//-->
</script>
<?
		}

		public static function info($msg) {
?>
<div class="info"><?= $msg ?></div>
<?
		}

		public static function err($msg) {
?>
<div class="err"><?= $msg ?></div>
<?
		}

		public static function errImage() {
			self::err("Ошибка во время добавления картинки:<br />".errPop());
		}

		public static function errFile() {
			self::err("Ошибка во время добавления файла:<br />".errPop());
		}

		public static function attachPosItem($redirect="") {
?>
<SCRIPT LANGUAGE="JavaScript">
<!--
function posItem(entity,id,s,redirect){
	var f=document.formPosItem;
	f.id.value=id;
	f.entity.value=entity;
	f.pos.value=s.selectedIndex+1;
	f.redirect.value="<?= $redirect ?>";
	if(redirect!=undefined)f.redirect.value=redirect;
	f.submit();
}
//-->
</SCRIPT>
<form name="formPosItem" action="/AdminPosItem.html" method="POST">
<input type="hidden" name="id" value="">
<input type="hidden" name="entity" value="">
<input type="hidden" name="pos" value="">
<input type="hidden" name="redirect" value="<?= $redirect ?>">
</form>
<?
		}

		public static function attachDelItem($redirect="") {
?>
<SCRIPT LANGUAGE="JavaScript">
<!--
function delItem(entity,id,redirect){
	if(!confirm("Удалить данную запись?"))return;
	var f=document.formDelItem;
	f.id.value=id;
	f.entity.value=entity;
	f.redirect.value="<?= $redirect ?>";
	if(redirect!=undefined)f.redirect.value=redirect;
	f.submit();
}
//-->
</SCRIPT>
<form name="formDelItem" action="/AdminDelItem.html" method="POST">
<input type="hidden" name="id" value="">
<input type="hidden" name="entity" value="">
<input type="hidden" name="redirect" value="<?= $redirect ?>">
</form>
<?
		}

		public static function attachDelItemImage($params="") {
?>
<SCRIPT LANGUAGE="JavaScript">
<!--
function delItemImage(entity,id,i){
	if(!confirm("Удалить данную картинку?"))return;
	var f=document.formDelItemImage;
	f.entity.value=entity;
	f.id.value=id;
	f.i.value=i;
	f.submit();
}
//-->
</SCRIPT>
<form name="formDelItemImage" action="/AdminDelItemImage.html" method="POST">
<input type="hidden" name="id" value="">
<input type="hidden" name="entity" value="">
<input type="hidden" name="i" value="">
<input type="hidden" name="params" value="<?= $params ?>">
</form>
<?
		}

		public static function attachToggleItem($redirect="") {
?>
<SCRIPT LANGUAGE="JavaScript">
<!--
function toggleItem(entity,id,prop){
	var f=document.formToggleItem;
	f.id.value=id;
	f.entity.value=entity;
	f.redirect.value="<?= $redirect ?>";
	if(prop==undefined)prop="isActive";
	f.prop.value=prop;
	f.submit();
}
//-->
</SCRIPT>
<form name="formToggleItem" action="/AdminToggleItem.html" method="POST">
<input type="hidden" name="id" value="">
<input type="hidden" name="entity" value="">
<input type="hidden" name="prop" value="">
<input type="hidden" name="redirect" value="">
</form>
<?
		}

		public static function showPos($item, $totalItems, $redirect=NULL) {
?>
<select onChange="posItem('<?= get_class($item)."',".$item->id ?>,this<?= $redirect?",'".$redirect."'":"" ?>)">
<?
	for ( $j=1; $j<=$totalItems; $j++ ) {
?>
<option value="<?= $j ?>"<?= $j==$item->pos?" selected":"" ?>><?= $j ?></option>
<?
	}
?>
</select>
<?
		}

		protected function langed($str, $languageID) {
			if ( $languageID == Config::DEFAULT_LANGUAGE_ID ) return $str;
			return $str."_".$languageID;
		}
	}
?>
