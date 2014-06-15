<?
	class AdminLogin extends WebPage {
		/**
			Add session support:
		*/
		protected function initSession() {
			session_start();
		}

		/**
			Do login here:
		*/
		protected function doPost() {
			$_SESSION['AdminLogin'] = $_POST;

			// fetch managers:
			$manager = Administrator::fetchByName($_POST['login']);

			if ( !$manager ) go("/AdminLogin.html?err=1");
			if ( $manager->password != $_POST['password'] ) go("/AdminLogin.html?err=2");

			setcookie("AdminLogin", $manager->name, time()+COOKIE_EXPIRY_MEDIUM, "/");
			$_SESSION[Administrator::SESSION] = serialize($manager);
			
			unset($_SESSION['AdminLogin']);
			// succesful login, should we go to smwhr?
			if ( $_SESSION['AdminLoginRedirect'] ) {
				$redirect=$_SESSION['AdminLoginRedirect'];
				unset($_SESSION['AdminLoginRedirect']);
				go($redirect);
			}

			// login manager:
			go("/AdminHomePage.html", 1);
		}

		protected function initCSS() {
			parent::initCSS();
			$this->css["body"] = "margin:0;padding:0;background-color:#fff;color:#555;font:1em 'Trebuchet MS',Arial,Tahoma,Verdana;background-image:url('/i/a/bg-text.gif');background-repeat:repeat-x;";
			$this->css["h1"] = "font-family:'Trebuchet MS',Tahoma,Verdana;color:#D9242D;margin:0 0 0.5em 0;padding:0;font-size:2em;font-weight:normal;letter-spacing:-1px;";

			// common styles:
			$this->css[".g"] = "color:#ccd;";
		}

		/**
			Init CSS and JS.
		*/
		protected function init() {
			parent::init();
			//$this->jsFiles["Form.js"] = true;
			$this->cssFiles["a/Form.css"] = true;
			$this->cssFiles["a/message.css"] = true;

			$this->title = "Административный раздел";
		}

		protected function showBody() {
?>
<div style="margin:150px auto 0 auto;width:32em;text-align:center">
<h1>Административный раздел сайта<br><?= Config::TITLE ?></h1>

<?
	if ( $_GET['err'] ) {
?>
<div class="err">Неверные логин или пароль.<br>Доступ закрыт!</div>
<?
	}
	else {
?>
<div class="msg">Пожалуйста введите логин и пароль Администратора.</div>
<?
	}
?>
<form name="formLogin" method="post" action='/AdminLogin.html'>
<table class="form" style="margin:1em auto 2em auto;min-width:auto;width:300px">
<tr>
	<th style="width:20%" class="r hR">Логин:</th>
	<td class="hL" style="width:100px"><input name='login' validation="Логин" maxlength="32" value="<?= $_COOKIE['AdminLogin']?p($_COOKIE['AdminLogin']):"Администратор" ?>" style="width:200px"></td>
</tr>
<tr>
	<th class="r hR">Пароль:</th>
	<td class="hL" style="width:100px"><input type="password" name='password' validation="Пароль" maxlength="16" style="width:200px"></td>
</tr>
<tr>
	<th></th>
	<td class="hL" style="width:100px"><input type="submit" value=' Вход ' class="btn" style="width:208px"></td>
</tr>
</table>
</form>

<table class="w100 t" style="border-top:1px solid #ccd;">
<tr>
	<td class="s hR w100 nw" style="color:#ccc;padding:0 1em 0 0;line-height:1.2em">Сайт работает на <b>PlayNext CMS</b><br />&copy; PlayNext Ltd. 2005-<?= date("Y") ?><br>Поддержка: <a href="mailto:<?= Config::EMAIL_SUPPORT ?>" style="color:#ccc;"><?= Config::EMAIL_SUPPORT ?></a></td>
	<td style="padding:0.6em 0.5em 0 0"><a href="http://www.playnext.ru" target="_blank"><img src="/i/a/playnext-cms.gif" width="32" height="52" alt="PlayNext Ltd." border="0"></a></td>
</tr>
</table>

</div>
<?
		}
	}
?>