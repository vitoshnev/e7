<?
	require_once("AdminPage.php");
	require_once("url.php");
	require_once("file.php");

	/**
		This page encapsulates common logic of editor page.
		It has POST handler which is responsible for saving data from submitted form.
		$entity tells which entity should be saved.
	*/
	class AdminEditPage extends AdminPage {
		var $entityTitle	= "чего-то неизвестного";
		var $entity			= NULL;
		var $urlErr			= NULL;
		var $urlAfterNew	= NULL;
		var $urlAfterSave	= NULL;
		var $urlNotFound	= NULL;
		var $posRedirect	= NULL;

		// here is stored managed item:
		var $item			= NULL;

		// sub menu is an array:
		var $subMenu;

		public function doPost() {
			// save form in session:
			if ( !$_POST['pt'] ) $_POST['pt'] = WebPage::token();
			$_SESSION[$_POST['pt']] = $_POST;
			if(!$this->entity) $this->entity = $_GET['entity'];
			// create instance of managed entity:
			require_once($this->entity.".php");
			$code = "\$this->item = new ".$this->entity."(\$_POST);";
			eval($code);

			// whether this is new or old item?
			$pks = $this->item->primaryKey();
			$exists = DB::fetchById($this->entity, $this->item->id());
			/*// check all PKs are set:
			$isNew = false;
			foreach ( $pks as $pk ) {
				if ( !$_POST[$pk] ) {
					$isNew = true;
					break;
				}
			}
			// isNew is specified in POST?
			if ( isset($_POST['isNew']) ) $isNew = $_POST['isNew'];*/
			if ( $exists ) $isNew = false;
			else $isNew = true;

			// save item to DB:
			$this->item->setNew($isNew);
			$this->beforeSave();

			// prepare error URL:
			$errURL = $this->urlErr ? $this->urlErr : $_SERVER['REQUEST_URI'];
			$errURL = urlRemoveParams($errURL, array("id", "s", "irnd", "err"));
			if ( !$isNew ) $errURL = urlAppendParam($errURL, "id", $this->item->id());

			try {
				$wasNew = $this->save();
			}
			catch ( EntityException $e ) {
				$_SESSION[$_POST['pt']]['errMsg'] = $e->message;
				$errURL = urlAppendParam($errURL, "err", $e->errCode);
				$errURL = urlAppendParam($errURL, "err", $e->errCode);
				$errURL = urlAppendParam($errURL, "pt", $_POST['pt']);
				go($errURL);
			}
			$this->afterSave();

			// process image names and inInViewer:
			$imageNames = array();
			$imageIsInViewers = array();
			foreach ( $_POST as $k => $v ) {
				// acquire index:
				$matches = array();
				if ( preg_match("/imageName_(.+?)_(\d+)/", $k, $matches) ) {
					$id = $matches[2];
					$imageNames[$id] = $v;
					$imageIsInViewers[$id] = $_POST['isInViewer'.$id] ? 1 : 0;

					$entityName = $matches[1];
					$fake = Entity::fake($entityName);
					$imageTableName = $fake->tableName();

					$name = $_POST['imageName_'.$entityName.'_'.$id];

					DB::q("UPDATE `".$imageTableName."` SET name='".s($name)."'"
						.($fake->hasProperty("isInViewer")?", isInViewer='".$imageIsInViewers[$id]."'":"")
						." WHERE id='".$id."'");
				}
			}

			// are some images uploaded?
			for ( $i=0; $i<10; $i++ ) {
				if ( !$_FILES['image'.$i]['size'] || !$_POST['imageEntityName'.$i] ) continue;

				// check if error happened while image was uploaded (item is saved, anyway):
				if ( $_FILES['image'.$i]['error'] == 1 ) {
					$errURL = urlAppendParam($errURL, "err", "image");
					eval("\$maxSize = ".$this->entity."::MAX_FILESIZE;");
					errPush("Ошибка! Слишком большой размер файла картинки.<br />Лимит: ".number_format($maxSize/1048576, 1, ",", " ")."Mb. Попробуйте уменьшить размер файла.");
					go($errURL);
				}

				// what is the name of the entity we upload now?
				$entityName = $_POST['imageEntityName'.$i];

				// make image and save it:
				eval("\$imageFile = new ".$entityName."();");
				$imageFile->applyFile($_FILES['image'.$i]['tmp_name'], $_FILES['image'.$i]['name']);
				$imageFile->parentId = $this->item->id;
				$this->beforeSaveImage($imageFile);
				$imageFile->save();
				$this->afterSaveImage($imageFile);
			}

			if ( $_POST['redirect'] ) {
				// special URL is specified for redirect:
				go($_POST['redirect']);
			}

			if ( $wasNew && !$_FILES['image']['size'] ) {
				// we have created a new item:
				if ( !$this->urlAfterNew ) {
					if ( $this->urlList ) $this->urlAfterNew = $this->urlList;
					else $this->urlAfterNew = $_SERVER['REQUEST_URI'];
				}
				$this->urlAfterNew = urlRemoveParams($this->urlAfterNew, array("s", "irnd", "id"));
				$this->urlAfterNew = urlAppendParam($this->urlAfterNew, "id", $this->item->id());
				$this->urlAfterNew = urlAppendParam($this->urlAfterNew, "s", 1);
				$this->urlAfterNew = urlAppendParam($this->urlAfterNew, "irnd", 1);
				go($this->urlAfterNew);
			}

			// we have saved an existsing item or uploaded an image:
			if ( !$this->urlAfterSave ) $this->urlAfterSave = $_SERVER['REQUEST_URI'];
			$this->urlAfterSave = urlRemoveParams($this->urlAfterSave, array("s", "id"));
			$this->urlAfterSave = urlAppendParam($this->urlAfterSave, "id", $this->item->id());
			$this->urlAfterSave = urlAppendParam($this->urlAfterSave, "s", 1);
			if ( $_FILES['image']['size'] ) {
				$this->urlAfterSave = urlRemoveParams($this->urlAfterSave, "irnd");
				$this->urlAfterSave = urlAppendParam($this->urlAfterSave, "irnd", 1);
			}
			go($this->urlAfterSave);
		}

		public function save() {
			return $this->item->save();
		}

		/**
			This is called just before saving the item.
			Override this to fix values if needed.
		*/
		public function beforeSave() {
			// do noting...
		}

		/**
			This is called just afer tjhe item is saved and item ID is acquired.
			Override this to make additional actions.
		*/
		public function afterSave() {
			// do noting...
		}

		/**
			This is called just before saving each item related image.
			Override this to fix values if needed.
		*/
		public function beforeSaveImage($imageFileEntity) {
			// do noting...
		}

		/**
			This is called just after saving each item related image.
			Override this to fix smth if needed.
		*/
		public function afterSaveImage($imageFileEntity) {
			// do noting...
		}

		public function initCSS() {
			parent::initCSS();

			$this->css["input#save2"] = "margin:1em 0 0 0";

			$this->css["ul.images"] = "width:100%;margin:0;padding:0;list-style:none;font-size:0.7em";
			$this->css["ul.images li"] = "float:left;width:200px;height:200px;padding:4px;margin:0;border:1px solid #fff;background-color:#eef";
			$this->css["ul.images div.url"] = "background:#ccf;font-weight:bold;padding:0.25em;color:#000;margin:0 0 0.25em 0";
			$this->css["ul.images div.pos"] = "float:left;width:64px;";
			$this->css["ul.images div.pos select"] = "width:97%;";
			$this->css["ul.images div.isInViewer"] = "float:left;width:100px;";
			//$this->css["ul.images div.isInViewer label"] = "position:absolute;top:2px;left:24px";
			$this->css["ul.images input.name"] = "width:97%;display:block;margin:0 0 0.5em 0;font-size:0.9em;text-align:center";
			$this->css["ul.images img"] = "clear:both;display:block;margin:0 auto;";
			$this->css["ul.images li div.icon"] = "float:right;padding:2px 0 0 0;width:20px;text-align:center;cursor:pointer;";
			$this->css["ul.images li div.icon img"] = "width:16px;height:16px;margin:0 6px 0 0";

			$this->css["div.hintLabel"] = "cursor:pointer;background:#ffe;border:1px dashed #ccc;padding:0.5em 1em;font-style:italic;font-size:0.7em";

			$this->css["div#hintImages"] = "position:absolute;width:20em;margin:0;padding:0.5em;display:none;background:#ffe;border:2px solid #666;";
			$this->css["div#hintImages ul"] = "margin:0 0 0 1.5em;padding:0";
			$this->css["div#hintImages ul li"] = "margin:0 0 0.5em 0;padding:0;font-size:0.7em";
		}

		/**
			Do all queries here.
		*/
		public function init() {
			parent::init();

			$this->entity=$_GET['entity'];
			if(!$this->entity) go('/AdminHomePage.html?err=noEntity');
			

			// attach js and css:
			$this->cssFiles["a/list.css"] = true;
			$this->cssFiles["a/Form.css"] = true;
			$this->cssFiles["a/tabs.css"] = true;
			if ( sizeof(Config::supportedLanguages()) > 1 ) $this->cssFiles["a/tabs-languages.css"] = true;
			else $this->cssFiles["a/tabs-language.css"] = true;
			$this->jsFiles["HTML.js"] = true;
			$this->jsFiles["Form.js"] = true;
			$this->jsFiles["a/AdminEditPage.js"] = true;

			if ( $_GET['backURL'] ) $this->urlList = $_GET['backURL'];

			// create or fetch item:
			if ( isset($_GET['err']) ) {
				// restore from error:
				$code = "\$this->item = new ".$this->entity."(\$_SESSION[\$_GET['pt']]);";
				eval($code);
			}
			else {
				$itemId=intval($_GET['id']);
				if ( $itemId ) {
					// fetch an existing item here for redirect!!
					eval('$this->item = '.$this->entity.'::fetchItem($this,99,$itemId);');
					if ( !$this->item ) {
						// item is not found in DB:
						if ( !$this->urlList ) $this->urlList = "/Admin.html";
						$this->urlList = urlRemoveParams($this->urlList, "err");
						$this->urlList = urlAppendParam($this->urlList, "err", "notFound");
						errPush("Запись не найдена");
						go($this->urlList);
					}
				}
				else {
					// create new item:
					$code = "\$this->item = new ".$this->entity."();";
					eval($code);
				}
			}
			// print_r($this->item);
			// die();
						// set title:
			$this->entityTitle=$this->item->annotation('NameR');
			$this->title = $_GET['id'] ? "Редактирование ".$this->entityTitle : "Создание ".$this->entityTitle;
			
			$this->imageEntitys=$this->item->annotation('Image');
			
		}

		/**
			Initializes sub menu.
			This is called in the end of main initialization.
		*/
		public function initSubMenu() {
			// add back button to sub menu:
			if ( $this->urlList ) $this->subMenu = array($this->urlList=>$this->item->id?"&lt; Назад":"&lt; Отмена");
			else $this->subMenu = array();
		}

		

		public function showBeforeBody() {
			parent::showBeforeBody();

			$this->initSubMenu();
			if ( is_array($this->subMenu) && sizeof($this->subMenu) ) Tag::menu($this->subMenu);

			if ( $this->item->id() ) {
				self::attachDelItem();
				self::attachPosItem();
			}
		}

		public function showBody(){
			$this->item->showForm($this,99);
			if($this->imageEntitys){
				$imageEntitys=explode(',',$this->imageEntitys);
				foreach($imageEntitys as $imageEntity){
					eval($imageEntity.'::showList($this,99);');
				}
			}
			$props = $this->item->properties();
			foreach ( $props as $prop ) {
				$WebEditor = $this->item->propertyAnnotation($prop, "WebEditor");
				if($WebEditor){
					self::attachWebEditor($prop);
				}
			}
			
		}
		
		public function showBottomButtonsTR($hideDelete=false) {
?>
	<tr>
		<th></th>
		<td>
<?
			if ( $this->item->id() && !$hideDelete ) {
?>
<input type="button" value="Удалить" class="btn" onClick="delItem('<?= get_class($this->item) ?>','<?= $this->item->id() ?>','')" style="float:right">
<?
			}
?>
<input type="submit" value="Сохранить &gt;" class="btn">
		</td>
	</tr>
<?
		}

		public function showFilesTR($label="Файлы", $imageEntity=NULL) {

			if ( !$this->item->id ) return;

			if ( !$imageEntity ) $imageEntity = get_class($this->item)."File";
			eval("\$fake = new ".$imageEntity."();");

			$files = DB::fetch($imageEntity, "SELECT id, ext, file, pos, length FROM `".$fake->tableName()."` WHERE parentId=".$this->item->id);
			if(!sizeof($files)) return;
?>
<tr>
	<th class="vT br"><a name="images<?= $imageEntity?"_".$imageEntity:"" ?>"></a><?= $label ?></th>
	<td class="vT" style="padding:1em 0 0 0">
<ul class="list files">
<?					
					$i = 0;
					$baseUrl = $_SERVER['REQUEST_URI'];
					$baseUrl = urlRemoveParams($baseUrl, array("id"));
					$baseUrl = urlAddAnchor($baseUrl, "files");
					$url = urlAppendParam($baseUrl, "id", $this->item->id);
					foreach ( $files as $file ) {
						$i++;
?>
<li class="<?= $file->ext ?>">
<div class="icon" onClick="delItem('<?= get_class($file) ?>','<?= $file->id ?>','<?= $url ?>')" title="Удалить файл"><img src="/i/a/icon-del.gif"></div>
<?
						if ( $file->pos ) {
?>
<div class="pos"><? self::showPos($image, sizeof($files), $url); ?></div>
<?
						}
?>
<div><a href="<?= $file->url() ?>" target="_blank"><?= ($file->file?$file->file:"&lt;без названия&gt;") ?></a>, <?= $file->fileSize() ?></div>
</li>
<?
					}
?>
</ul>
	</td>
</tr>
<?
		}
	}
?>