<?
	require_once("AdminPage.php");

	class AdminDelItem extends AdminPage {
		public function doPost() {
			$id = $_POST['id'];
			$entity = $_POST['entity'];

			// WARNING! Forbid external includes:
			if ( preg_match("/^http/i", $entity) ) go("/Admin.html");
			require_once($entity.".php");

			// del item:
			DB::deleteById($entity, $id);

			// make redirect:
			if ( $_POST['redirect'] ) {
				$url = urlRemoveParams($_POST['redirect'], array("s", "rnd"));
				$url = urlAppendParam($url, "s", 1);
			}
			else $url = "/Admin".$entity."s.html?s=1";
			go($url, 1);
		}
	}
?>