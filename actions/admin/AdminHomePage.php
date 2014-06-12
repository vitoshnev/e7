<?
	class AdminHomePage extends AdminPage {

		protected function init() {
			parent::init();
			// now we know manager name:
			$this->title		= "Здравствуйте, ".$this->administrator->name."!";
		}

		protected function showBody() {
?>
<p style="margin:0 0 15em 0">Пожалуйста, выберите пункт меню слева.</p>
<?
		}
	}
?>