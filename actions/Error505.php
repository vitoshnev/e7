<?
	/**
		This is 505 page.
		It is called by E5 when something goes wrong.
	*/
	class Error505 extends ErrorPage {
		var $title = "Ошибка 505";

		public function init() {
			header("HTTP/1.0 505 Internal Server Error");
			parent::init();
		}

		/**
			Overrided to output error message.
		*/
		public function showBody() {
?>
<h1>Внутренний сбой</h1>
<h2>505</h2>
<p>Приносим свои извинения, в данный момент эта часть сайта недоступна.<br />
Пожалуйста, посетите данную страницу через некоторое время.</p>
<?
			parent::showBody();
		}
	}
?>