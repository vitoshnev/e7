<?
	require_once("AdminPage.php");

	class AdminDelItemImage extends AdminPage {
		public function doPost() {
			$id = $_POST['id'];
			$entity = $_POST['entity'];

			// WARNING! Forbid external includes:
			if ( preg_match("/^http/i", $entity) ) go("/Admin.html");
			require_once($entity.".php");

			eval("\$item = ".$entity."::fetchByID(\"".$entity."\", ".$id.");");
			if ( $item ) $item->delImage($_POST['i']);

			go("/Admin".$entity."sEdit.html?id=".$id."&s=1&irnd=1".($_POST['params']?"&".$_POST['params']:"")."#images", 1);
		}
	}
?>