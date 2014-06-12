<?
	/**
		some global override for entity 
	*/
	class EntityBase extends Entity {

		const LIST_ADMIN		= 'adminList';	

		public function h1() {
			return $this->h1?$this->h1:$this->name;
		}
		public function name() {
			return $this->name;
		}
		public function title() {
			return $this->title;
		}
		public function url() {
			return "/".str4url($this->nameURL)."/";
		}
		public function setDefaultValues() {
			$this->isActive = true;
		}
		public function target() {
			return strtoupper($this->name);
		}
		/**
			fetch all items
		*/
		static public function fetchList($page=NULL,$view=NULL) {
			if($view===99) return self::fetchAdminList($page);
			return parent::fetchList($page=NULL,$view=NULL);
		}
		public function fetchAdminList($page){
			if(!$page->page) $page->page=1;
			$tableName=Entity::tableNameForEntity(get_class($page->entity));
			if($page->imageEntity){
				$imgTableName=Entity::tableNameForEntity($page->imageEntity);
			}
			/**
				fetch here cose always needs similar list
			*/
			if(!$imgTableName){
				$sql="SELECT p.* FROM `".$tableName."` p ORDER BY pos, createdOn DESC LIMIT ".(($page->page-1)*PerPage::IN_PAGE_ADMIN).", ".PerPage::IN_PAGE_ADMIN;

			}
			else{
				$page->withImage=true;
				$sql="SELECT p.*, "
					."i.id as image_id, i.pos as image_pos, i.ext as image_ext, i.width as image_width, i.height as image_height"
					." FROM `".$tableName."` p LEFT JOIN "
					."(SELECT pi.id, pi.ext, pi.parentId, pi.pos, pi.width, pi.height FROM `".$imgTableName."` pi WHERE pi.pos=1) AS i"
					." ON i.parentId=p.id ORDER BY "
					. (property_exists(get_called_class(),'pos') ? " pos, " : "")
					."createdOn DESC, id"
					." LIMIT ".(($page->page-1)*PerPage::IN_PAGE_ADMIN).", ".PerPage::IN_PAGE_ADMIN;
			}
			$items = self::fetch($sql);
			$page->totalItems=count($items);

			return $items;
		}
		public static function listView($page=NULL,$view=NULL,$items=NULL,$htmlId=NULL,$allCSS=NULL){

			return self::showAdminList($page,$view,$items,$htmlId,$allCSS);

		}
		static function showAdminList($page=NULL,$view=NULL,$items=NULL,$htmlId=NULL,$allCSS=NULL){
			$totalItems=count($items);
			if ( !$totalItems ) {
				$page::info("Нет записей");
				return;
			}
			$page::attachDelItem();
			$page::attachPosItem();
			$page::attachToggleItem();
			PerPage::showAdminPerPages($totalItems,$page->page,$page->url);
			$allCSS[]='list';
?>
	<ul<?= ($id?" id='".$id."'":"").(sizeof($allCSS)>0?" class='".implode(" ", $allCSS)."'":"") ?>>
<?

			foreach ( $items as $item ) {
				$item->showAdminItem($page,$totalItems);
			}
?>
	</ul>
<?	
			PerPage::showAdminPerPages($totalItems,$page->page,$page->url);
		}
		public function showAdminItem($page,$totalItems){
			$entName=get_class($this);
?>
		<li<?= !$this->isActive?" class='off'":"" ?>>
<?
				if ($this->data("image_id")){
					eval('$thumb = new '.$page->imageEntity.'();');
					$thumb->applyArray($this->data(),"image_");
					if($thumb->width>$thumb->height) $thumb->setUrlWidth(AdminListPage::ADMIN_DIMENSION_LIST);
					else $thumb->setUrlHeight(AdminListPage::ADMIN_DIMENSION_LIST);
					$imageURL = $thumb->url();
?>
				<div class="img" onClick="self.location.href='/Admin<?= $entName ?>sEdit.html?id=<?= $this->id ?>'" style="background:url('<?= $imageURL ?>') no-repeat center center"></div>
<?
				}
?>
				<div class='text'>
					<div class="icon" onClick="delItem('<?= $entName ?>',<?= $this->id ?>)" title="Удалить"><img src="/i/a/icon-del.gif"></div>
					<div class="icon" onClick="self.location.href='AdminEditPage.html?entity=<?= get_class($this) ?>&id=<?= $this->id ?>'" title="Редактировать"><img src="/i/a/icon-edit.gif"></div>
					<div class="icon" onClick="toggleItem('<?= $entName ?>',<?= $this->id ?>,'isActive')" title="Вкл./выкл."><img src="/i/a/icon-<?= $this->isActive?"on":"off" ?>.gif"></div>
					<? AdminPage::showPos($this, $totalItems) ?>
					<a href="/AdminEditPage.html?entity=<?= get_class($this) ?>&id=<?= $this->id ?>"><?= $this->name?p(strip_tags($this->name)):"&lt;без названия&gt;" ?></a>
<?
				if ( $this->short ) print "<div class='s'>".nl2br(strip_tags(($this->short)))."</div>";
?>
				</div>
		</li>
<?			
		}
		protected function showFormHeader($view) {
			if($view == 99){
				if ( !$_GET['pt'] ) $_GET['pt'] = uniqid();

				$formURL = $this->annotation("FormURL");
?>
				<SCRIPT LANGUAGE="JavaScript">
				<!--
				document.writeln("<"+"f"+"o"+"rm met"+"hod='po"+"st' name='<?= $this->formName() ?>' enc"+"t"+"ype='multip"+"art/fo"+"rm-data' act"+"io"+"n='<?= WebPage::maskedFormURL($formURL) ?>' onSubmit='return Form.check(this)'>");
				//-->
				</SCRIPT>
				<input type="hidden" name="pt" value="<?= p($_GET['pt']) ?>">
				<table class="form">
<?
			}
			else parent::showFormHeader($view);
		}

	}
?>
