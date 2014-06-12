<?
	require_once("AdminPage.php");

	class AdminToggleItem extends AdminPage {
		public function doPost() {
			$id = $_POST['id'];
			$entity = $_POST['entity'];
			$prop = $_POST['prop'];

			// WARNING! Forbid external includes:
			if ( preg_match("/^http/i", $entity) ) go("/Admin.html");
			require_once($entity.".php");

			// create fake item:
			eval("\$fake = new ".$entity."();");
			$fake->setId($id);
			DB::q("UPDATE `".$fake->tableName()."` SET ".$prop."=(".$prop."=0 OR ISNULL(".$prop.")) WHERE ".$fake->sqlWhereId());
			if ( $_POST['redirect'] ) go($_POST['redirect']);
			go("/AdminListPage.html?entity=".$entity."&s=1".($_POST['params']?"&".$_POST['params']:""), 1);
		}
	}
?>