<?
	require_once("AdminPage.php");

	class AdminPosItem extends AdminPage {
		public function doPost() {
			$id = $_POST['id'];
			$pos = $_POST['pos'];
			$entity = $_POST['entity'];

			// WARNING! Forbid external includes:
			if ( preg_match("/^http/i", $entity) ) go("/Admin.html");
			require_once($entity.".php");

			// prepare redirect:
			if ( $_POST['redirect'] ) {
				$url = urlRemoveParams($_POST['redirect'], array("s", "rnd"));
				$url = urlAppendParam($url, "s", 1);
			}
			else $url = "/Admin".$entity."s.html?s=1";

			// update item pos:
			$item = DB::fetchById($entity, $id);
			if ( $item ) $pos = $item->updatePos($pos);
			else {

				errPush("Объект не найден, entity: ".$entity.", id: ".$id); 
				$url = urlAppendParam($url, "err", 1);
			}

			// make redirect:
			go($url, 1);
		}
	}
?>