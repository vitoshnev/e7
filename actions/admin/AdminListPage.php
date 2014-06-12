<?
/**
	Base class for type admin List. detect class by actionName and detect is table_image //VVV
*/
	class AdminListPage extends AdminPage {
		const IMG_WIDTH = 100;
		const IMG_HEIGHT = 50;
		const ADMIN_DIMENSION_LIST = 80;
		
		const IMG_BIG_WIDTH = 300;
		const IMG_BIG_HEIGHT = 250;
		
		// var $url		= $_SERVER['REQUEST_URI'];
		var $title		= 'Список';
		var $entity		= false;
		var $imageOn	= true;
		var $imgEntity	= false;
		
		public function initCSS(){
			parent::initCSS();
			PerPage::cssAdminPerPages($this);
			
			$this->css["ul.list li div.icon"] = "float:right;margin:0 3px;";
			$this->css["ul.list li"] = "height:".(AdminListPage::ADMIN_DIMENSION_LIST)."px;overflow:hidden;border:1px solid #ccc;margin-bottom:10px;padding:5px;";
			$this->css["ul.list div.img"] = "float:left;width:".(AdminListPage::ADMIN_DIMENSION_LIST)."px;height:".(AdminListPage::ADMIN_DIMENSION_LIST)."px;overflow:hidden;cursor:pointer;border:1px solid #ccc;";
			$this->css["ul.list select"] = "float:left";
			$this->css["ul.list div.text"] = "padding:0 0 0 ".(AdminListPage::ADMIN_DIMENSION_LIST+20)."px";
		}
		public function init() {
			parent::init();
			$this->cssFiles["a/list.css"] = true;
			$this->cssFiles["a/message.css"] = true;
			$this->cssFiles["a/Form.css"] = true;
			
			$this->page=$_GET['page'];
			$entityName=$_GET['entity'];
			if(!$entityName) go('/AdminHomePage.html?err=noEntity');

			eval('$this->entity=new '.$entityName.'();');
			
			if($this->entity->annotation('Names')) $this->title=$this->entity->annotation('Names');
			$this->imageEntitys=$this->entity->annotation('Image');
			$this->imageEntitys=explode(',',$this->imageEntitys);
			$this->imageEntity=$this->imageEntitys[0];
		}

		public function showBody() {
			$this->tagMenus();
			$this->entity->showList($this,99);
			/*
			
			*/
		}
		public function tagMenus(){
			Tag::menu(array(
				"/Admin".get_class($this->entity)."sEdit.html"=>"Добавить",
				));
		}
	}
?>