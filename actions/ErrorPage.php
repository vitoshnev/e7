<?
	class ErrorPage extends WebPage {
		var $title = "Ошибка";
		var $logger;

		protected function initCSS() {
			parent::initCSS();

			$this->css["body"] = "background:#fff;font:1em Arial;padding:3em;color:#666";
			$this->css["h1"] = "font-size:4em;color:#99c;margin:0 0 1em 0";
			$this->css["h2"] = "font-size:2em;color:#000;margin:0 0 0 0";
		}

		protected function init() {
			parent::init();
			$this->cssFiles["message.css"] = true;

			// log error:
			$this->logger = Logger::fileLogger("ErrPage.log");
			$this->logger->err(get_class($this).($this->body?": ".$this->body:""));
		}

		/**
			Overrided to output error message.
		*/
		protected function showBeforeBody() {
			eval("\$url = Config::URL_".strtoupper(E7::$languageId).";");
?>
<h3><?= $url.$_SERVER['REQUEST_URI'] ?></h3>
<h2><?= $this->title ?></h2>
<?
		}

		protected function showBody() {
			if ( $this->body && $_SERVER[E7::ENV] ) {
?>
<div class="err"><?= nl2br($this->body) ?></div>
<?
			}
		}
	}
?>