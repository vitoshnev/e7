<?

	/**
		Set of commonly used HTML blocks (tags).
	*/
	class Tag {
		/**
			Displays standard menu - unordered list with CSS class 'menu'.
		*/
		public static function menu($items) {
			if ( is_array($items) && sizeof($items) ) {
?>
<ul class="menu">
<?
				foreach ( $items as $url => $item ) {
?>
<li><a href="<?= $url ?>"><?= $item ?></a></li>
<?
				}
?>
</ul>
<?
			}
		}

		public static function msg($html) {
?>
<div class="msg"><?= $html ?></div>
<?
		}

		/**
			Displays paging navigation bar.
		*/
		public static function pages ( $total, $per_page, $page, $url=NULL, $pos=0, $pageParam="page" ) {
			if ( $url == NULL ) $url = $_SERVER['REQUEST_URI'];//.$_SERVER['QUERY_STRING'];
			//da($_SERVER);
			//print $_SERVER['REQUEST_URI'].LF;
			//print $url.LF;
			if ( preg_match("/^(.+?)\/(".$pageParam."-\d+\.html)?(\?.*?)?(#.+)?$/", $url) ) {
				// URL format: /**/page-<pageNum>.html
				$urlFirstPage = preg_replace("/^(.+?)\/(".$pageParam."-\d+\.html)?(\?.*?)?(#.+)?$/", "$1/$3$4", $url);
				$url = preg_replace("/^(.+?)\/(".$pageParam."-\d+\.html)?(\?.*?)?(#.+)?$/", "$1/".$pageParam."-xxxxx-page-xxxxx.html$3$4", $url);
				//die($url);
			}
			else if ( preg_match("/^(.+?)(\.".$pageParam."-\d+)?\.html(\?.*?)?(#.+)?$/", $url) ) {
				// URL format: /*.page-<pageNum>.html
				$urlFirstPage = preg_replace("/^(.+?)(\.".$pageParam."-\d+)?\.html(\?.*?)?(#.+)?$/", "$1.html$3$4", $url);
				$url = preg_replace("/^(.+?)(\.".$pageParam."-\d+)?\.html(\?.*?)?(#.+)?$/", "$1.".$pageParam."-xxxxx-page-xxxxx.html$3$4", $url);
			}
			else {
				// URL format: /*.html?p=<pageNum>
				$url = urlRemoveParams($url, $pageParam);
				$urlFirstPage = $url;
				$url = urlAppendParam($url, $pageParam, "xxxxx-page-xxxxx");
			}
			$total_pages = intval ( $total / $per_page );
			if ( $total % $per_page ) $total_pages++;
			if ( $total <= $page * $per_page ) $page = 0;
			if ( $total <= $per_page ) return;

			if ( E5::$languageId == "en" ) {
				$textPages = "Pages";
				$textPrev = "Previous page";
				$textNext = "Next page";
			}
			else {
				$textPages = "Страницы";
				$textPrev = "Назад";
				$textNext = "Далее";
			}
?>
<div class="pages">
<?
			if ( $pos == 1 && ($page > 0 || $page+1 < $total_pages) ) {
?>
<table class='direct pos<?= $pos ?>'><tr>
<?
				if ( $page > 0 ) {
					$u = str_replace("xxxxx-page-xxxxx", $page, $url);
?>
<td class='prev' onClick="self.location.href='<?= $u ?>'"><a href="<?= $u ?>">&lt; <?= $textPrev ?></a></td>
<?
				}
				if ( $page+1 < $total_pages ) {
					$u = str_replace("xxxxx-page-xxxxx", $page+2, $url);
?>
<td class='next'><a href="<?= $u ?>"><?= $textNext ?> &gt;</a></td>
<?
				}
?>
</tr></table>
<?
			}
?>
<table>
<tr>
<td class='title'><?= $textPages ?>:</td>
<?
			$start = $page - 4;
			if ( $start < 0 ) $start = 0;
			$end = $page + 5;
			if ( $end >= $total_pages ) $end = $total_pages;
			if ( $start > 0 ) print "<td><div onClick=\"self.location.href='".$urlFirstPage."'\"><a href='".$urlFirstPage."'>1</a></div></td>";
			if ( $start > 1 ) print "<td>...</td>";

			for ( $i=$start; $i<$end; $i++ ) {
				if ( $i == $page ) {
?>
<td><div class='sel'><?= ($i+1) ?></div></td>
<?
				}
				else {
					if ( $i == 0 ) $u = $urlFirstPage;
					else $u = str_replace("xxxxx-page-xxxxx", ($i+1), $url);
?>
<td><div onClick="self.location.href='<?= $u ?>'"><a href="<?= $u ?>"><?= ($i+1) ?></a></div></td>
<?
				}
			}
			if ( $end + 1 < $total_pages ) print "<td>...</td>";
			if ( $end < $total_pages ) {
				$urlLastPage = str_replace("xxxxx-page-xxxxx", $total_pages, $url);
				print "<td><div onClick=\"self.location.href='".$urlLastPage."'\"><a href='".$urlLastPage."'>$total_pages</a></div></td>";
			}
?>
</tr>
</table>
<?
			if ( $pos == 0 && ($page > 0 || $page+1 < $total_pages) ) {
?>
<table class='direct pos<?= $pos ?>'><tr>
<?
				if ( $page > 0 ) {
					if ( $page == 1 ) $u = $urlFirstPage;
					else $u = str_replace("xxxxx-page-xxxxx", $page, $url);
?>
<td class='prev'><a href="<?= $u ?>">&lt; <?= $textPrev ?></a></td>
<?
				}
				if ( $page+1 < $total_pages ) {
?>
<td class='next'><a href="<?= str_replace("xxxxx-page-xxxxx", $page+2, $url) ?>"><?= $textNext ?> &gt;</a></td>
<?
				}
?>
</tr></table>
<?
			}
?>
</div>
<?
		}

		public static function playnext() {
?>
<div id="playnext">
<?
	if ( !E5::$languageId || E5::$languageId == Config::DEFAULT_LANGUAGE_ID ) {
?>
Сайт создан<br /><a href="http://www.playnext.ru" target="_blank" title="Создание сайта">студией PlayNext</a>
<?
	}
	else {
?>
Web site developed<br />by <a href="http://www.playnext.ru" target="_blank" title="Web site design and development">PlayNext</a>
<?
	}
?>
</div>
<?
		}

		public function selectList($label, $items, $name, $values=NULL, $listCSS="", $id="", $onUpdate=NULL) {

			$text = array();
			$allAreChecked = true;
			if ( is_array($values) ) {
				foreach ( $items as $item ) {
					if ( in_array($item->id, $values) ) {
						$text[] = $item->name;
					}
					else $allAreChecked = false;
				}
			}
			if ( sizeof($text) && !$allAreChecked ) $text = implode(", ", $text);
			else $text = "не важно";
?>
<div class="selectList"<?= $id?" id='".$id."'":"" ?>>
<div class="label"><?= p($label) ?></div>
<div class="select" id="select<?= $name ?>s"><span onMouseOver="CSS.addClass(this,'over')" onMouseOut="CSS.removeClass(this,'over')" class="value" id="select<?= $name ?>sText" onClick="SelectList.select('select<?= $name ?>s')"><?= $text ?></span></div>

<div id="list<?= $name ?>s" class="listBox<?= $css?" ".$css:"" ?>">
<div class="list">
<ul>
<?
			$i = 0;
			foreach ( $items as $item ) {
				$i++;
				$css = array();
				if ( $i == 1 ) $css[] = "first";
				if ( $i == 2 ) $css[] = "second";
				if ( $i % 2 == 0 ) $css[] = "right";

				$isSel = is_array($_GET[$name."Ids"]) && in_array($item->id, $_GET[$name."Ids"]);
?>
<li<?= sizeof($css)?" class='".implode(" ", $css)."'":"" ?>><input<?= $isSel?" checked":"" ?> type="checkbox" name="<?= $name ?>Ids[]" value="<?= $item->id ?>" id="<?= $name ?>Id<?= $item->id ?>" label="<?= p($item->name) ?>">
<label for="<?= $name ?>Id<?= $item->id ?>"><?= p($item->name) ?></label></li>
<?
			}
?>
</ul>
</div>
<div class="tools">
<span class="any" onClick="SelectList.reset('select<?= $name ?>s');">не важно</span>
<input class="btn" type="button" value="Выбрать" onClick="SelectList.done('select<?= $name ?>s');">
<div class="clear"></div>
</div>
</div>
</div>
<?
		}
	}
?>