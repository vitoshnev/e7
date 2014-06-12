<?
	class Error404 extends ErrorPage {
		var $title = "Ошибка 404";

		public function init() {
			header("HTTP/1.0 404 Not Found");
			parent::init();
		}

		/**
			Overrided to output error message.
		*/
		public function showBody() {
?>
<h1>Страница не найдена</h1>
<p>Возможно страница была удалена или переехала на другой адрес.<br />
<a href="/">Переход на главную страницу</a>.</p>
<?
		}
	}
?>