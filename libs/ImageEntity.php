<?
	/**
		E7 web-site engine.
		(c) PlayNext Ltd. 2003-2013.
		Version: 2013-05-16.
		This code is property of PlayNext Ltd. Neither this code nor its part may be used without written license from PlayNext Ltd.
	*/

	/**
		Represents an image file in DB.
	*/
	class ImageEntity extends ImageFileEntity {

		// ImageEntity is extended with parentId and pos - it is a child image of some other entity (Pub, Page, etc):
		var $parentId;	// images always have a parent entity (PageImage - Page)
		var $pos;		// images always have a position
		var $name;

		static public function fetchList($page=NULL,$view=NULL) {
			if(!$view || $view==99) return self::fetchByParent($page->item->id);
			
		}
		public function fetchByParent($parentId){
			if(!$parentId) return;
			$tableName=Entity::tableNameForEntity(get_called_class());
			$sql="SELECT p.id, p.parentId, p.name, p.width, p.height, p.ext, p.pos FROM `".$tableName."` p WHERE p.parentId=".$parentId." ORDER BY pos, createdOn DESC ";
			$items = self::fetch($sql);
			return $items;
		}

		public static function listView($page=NULL,$view=NULL,$items=NULL,$htmlId=NULL,$allCSS=NULL){
			if(!$view || $view==99) self::adminImageList($page,$items);
		}
		public static function adminImageList($page,$items){
			if ( !$items ) return;
			$imageEntity=get_called_class();
?>
	<ul class="images">
<?
			$i = 0;
			$baseUrl = $_SERVER['REQUEST_URI'];
			$baseUrl = urlRemoveParams($baseUrl, array("id", "irnd"));
			$baseUrl = urlAppendParam($baseUrl, "irnd", 1);
			$baseUrl = urlAddAnchor($baseUrl, $imageEntity);
			$url = urlAppendParam($baseUrl, "id", $page->item->id);
			foreach ( $items as $image ){
				$i++;
				$imageURL = $image->url();
				if ( !$image->isFlash() ) {
					if ( $image->width > 160 ) $imageURL = $image->urlWidth(160);
					if ( $image->height*(160/$image->width) > 110 ) $imageURL = $image->urlHeight(110);
				}
?>
		<li>
			<div class="url"><a href="<?= $image->url() ?>" target="_blank"><?= $image->url() ?></a></div>
			<div class="icon" onClick="delItem('<?= get_class($image) ?>','<?= $image->id ?>','<?= $url ?>')" title="Удалить картинку"><img src="/i/a/icon-del.gif"></div>
<?
				if ( $image->pos ) {
?>
			<div class="pos"><? $page::showPos($image, sizeof($items), $url); ?></div>
<?
				}
				if ( !$image->isFlash() ) {
?>
			<img src='<?= $imageURL ?>'>
<?
				}
				else {
?>
			<img src='/i/a/icon-flash.gif'>
<?
				}
?>
			<div class="clear"></div>
		</li>
<?
			}
?>
</ul>
<?

		}
		/**
			Returns images for specified instance, eg PageImage for Page.
			You may override image enotity with $entity or you may specify custom SQL with $sql.
		*/
		public static function imagesOf($item, $entity=NULL, $sql=NULL) {
			if ( !$item || !is_object($item) ) return;

			// make default entity name if neeeded:
			if ( $entity == NULL ) $entity = get_class($item)."Image";

			// instantiate image file entity:
			require_once($entity.".php");
			eval("\$object = new ".$entity."();");

			// make default query:
			if ( $sql == NULL ) $sql = "SELECT id, ext, width, height, length".(property_exists($entity, "pos")?", pos":"")." FROM ".$object->tableName()." WHERE parentId='".$item->id()."'".(property_exists($entity, "pos")?" ORDER BY POS":"");

			// check if images are in cache:
			$cacheKey = $entity."\t".$sql;
			if ( $item->_images[$cacheKey] ) return $item->_images[$cacheKey];

			// fetch image objects:
			$item->_images[$cacheKey] = DB::fetch($entity, $sql);
			return $item->_images[$cacheKey];
		}

		/**
			By default all such entities have a parent.
		*/
		public function posConditionProperties() {
			return array("parentId");
		}
	}
?>