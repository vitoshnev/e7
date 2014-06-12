<?
	class Car extends Entity {

		const LIST_ALL		= 'all';	

		// @PrimaryKey
		// @Name("Айдиха")
		var $id;

		// @Length(32)
		// @Name("Название")
		// @Required
		var $name;
		
		// @Length(32)
		// @Name("Заголовок на странице")
		var $h1;

		// @Name("Ссылка")
		// @Required
		var $url;

		// @Length(500)
		// @Name("Короткое описание")
		var $short;
		
		// @Length(1000)
		// @Name("полное описание")
		var $full;
		
		// @Length(32)
		// @Name("META Заголовок")
		var $title;
		
		// @Length(100)
		// @Name("META Ключевы слова")
		var $keywords;
		
		// @Length(300)
		// @Name("META Описание")
		var $description;
		
		// @Name("Email")
		// @Required
		var $email;


		// @View(99)
		// @Default(1)
		var $isActive;

		// @Date()
		// @View(99)
		var $createdOn;

		var $pos;

		var $brandId;
		var $typeId;

		
		static public function fetchList($view=NULL) {
			switch ( $view ) {
				case self::LIST_ALL:
					return self::fetch("SELECT c.*, b.name AS brandName, b.nameURL AS brandNameURL, ct.name AS typeName"
					.", i.id AS CarImageSprite_id, i.ext AS CarImageSprite_ext, i.width as CarImageSprite_width, i.height as CarImageSprite_height"
					." FROM (car c, car_type ct, brand b, car_image_sprite i)"
					." WHERE c.typeId=ct.id AND c.brandId=b.id AND c.id=i.parentId AND i.pos=1 AND c.isActive"
					." ORDER BY ct.pos, b.pos, c.pos");

				default:
					return self::fetch("SELECT c.*, b.name AS brandName, b.nameURL AS brandNameURL, ct.name AS typeName"
					.", i.id AS CarImageSprite_id, i.ext AS CarImageSprite_ext, i.width as CarImageSprite_width, i.height as CarImageSprite_height"
					." FROM (car c, car_type ct, brand b, car_image_sprite i)"
					." WHERE c.typeId=ct.id AND c.brandId=b.id AND c.id=i.parentId AND i.pos=1 AND c.isActive"
					." ORDER BY ct.pos, b.pos, c.pos");
			}
		}

		public static function cssList($page, $class="brandCars") {
			$css = array();
			$css["ul.".$class." li "] = "margin-right:4.6%;margin-bottom:15px;display:block;float:left;width:".CarImageSprite::THUMB_WIDTH."px;height:".(CarImageSprite::THUMB_HEIGHT+70)."px;";
			$css["ul.".$class." li.lst"] = "margin-right:0;";
//carBlock
			$css["div.carBlock"] = "position:relative;cursor:pointer;";
			$css["div.carBlock:hover"] = "text-decoration:underline;color:#00b6ea";
			$css["div.carBlock div.img "] = "width:".CarImageSprite::THUMB_WIDTH."px;height:".CarImageSprite::THUMB_HEIGHT."px;background-repeat:no-repeat;background-position:center center;";
			$css["div.carBlock div.check"] = "opacity:0;filter:alpha(opacity=0);position:absolute;top:-20px;right:-20px;width:30px;height:30px;background:url('/i/carSel.png') center 0 no-repeat;";
			$css["div.carBlock:hover div.check"] = "opacity:1;filter:alpha(opacity=100)";
			$css["li.carSel div.check"] = "background-position:center -30px;transform:rotate(360deg); -webkit-transform: rotate(360deg);-o-transform: rotate(360deg);-moz-transform: rotate(360deg);opacity:1;";
			$css["li.carSel div.img"] = "opacity:0.6";
			$page->submitCSS($css);
		}

		public static function brandCars(){
			$cars=Car::fetchList(Car::LIST_ALL);
			$brandCars=array();
			foreach($cars as $car){
				$brandCars[$car->brandId][]=$car;
			}
			return $brandCars;
		}
		public static function showList($items,$selCarIds=null) {
?>
		<ul class='brandCars'>
<?
			$j=0;
			foreach($items as $car){
				$j++;
				$image = new CarImageSprite();
				$image->applyArray($car->data(),"CarImageSprite_");
				$divImg = $image->urlIconSprite(CarImageSprite::THUMB_WIDTH, 0);
				$css=array();
			
				if(is_array($selCarIds) && in_array($car->id,$selCarIds)) $css[]='carSel';
				if($j==7) $css[]='lst';
?>
		<li onClick='Car.selItem(this,<?= $car->id ?>,<?= $car->brandId ?>)' id='car<?= $car->id ?>' class="<?= implode(' ',$css); ?>">
			<div class='carBlock animate'>
				<?= $divImg ?>
				<div class='name animate'><?= $car->name?></div>
				<div class='check animateSlow'></div>
			</div>
		</li>
<?
			}
?>
	</ul>
<div class="clear"></div>
<?
		}
		public function posConditionProperties() {
			return array("brandId","typeId");
		}

		public function title() {
			return $this->data("brandNameURL")." ".$this->name." Санкт-Петербург";
		}

		public function nameFull() {
			return $this->data("brandName")." ".($this->name());
		}

		public function name() {
			if($this->prefix){
				return t($this->prefix)." ".$this->data("brandName")." ".$this->name;
			}
			else if( $this->data("brandNameShort") ) {
				return $this->data("brandNameShort")." ".$this->name;
			}
			else{
				return $this->data("brandName")." ".$this->name;
			}
		}

		public function nameShort() {
			if($this->prefix){
				return t($this->prefix)." ".$this->name;
			}
			else{
				return $this->name;
			}
		}

		public function url() {
			if ( $this->url ) return $this->url;
			return "/".str4url($this->data("brandNameURL"))."/".str4url($this->nameURL)."/";
		}


		public function urlMoreCar($brand, $model) {
			if ( !$brand || !$model ) return;
			return "/".str4url($brand)."/".str4url($model)."/more.html";
		}

		protected function setDefaultValues() {
			$this->isActive = 1;
		}



	}
?>
