<?
	//@Name('Бренд')
	//@Names('Бренды')
	//@NameR('Бренда')
	//@Image('BrandImage')
	class Brand extends EntityBase {

		const LIST_ALL		= 'all';	

		// @PrimaryKey
		// @Name("Айдиха")
		// @FormType('hidden')
		var $id;

		// @View(99)
		// @Default(1)
		// @FormType('checkbox')
		// @Name('Показывать на сайте')
		var $isActive;

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

		// @Length(32)
		// @Name("META Заголовок")
		var $title;

		// @Length(100)
		// @Name("META Ключевы слова")
		var $keywords;

		// @Length(300)
		// @Name("META Описание")
		// @FormType('textarea')
		var $description;

		// @Length(500)
		// @Name("Короткое описание")
		// @FormType('textarea')
		var $short;

		// @Length(1000)
		// @Name("полное описание")
		// @FormType('textarea')
		var $full;

		// @Date()
		// @View(99)
		var $createdOn;

		// @View('none')
		var $pos;
		
		// @View('99')
		// @FormType('fileImage')
		// @Name("Логотип бренда")
		var $brandImage;
		
		protected function showFormBrandId($page,$prop,$view,$attrs){
			die('herer');
			$this->counts = array();
			$counts = DB::select("SELECT cell, COUNT(id) AS countItems FROM home_menu hm WHERE isActive GROUP BY cell ORDER BY countItems");
			foreach ( $counts as $a ) {
				$this->counts[$a['cell']] = $a['countItems'];
			}
			for ( $i=0; $i<HomeMenu::MAX_CELLS; $i++ ) {
				$count = intval($this->counts[$i]);
?>
<input type="radio" name="cell" id="cell<?= $i ?>" value="<?= $i ?>"<?= $this->cell==$i?" checked":"" ?>> <label for="cell<?= $i ?>"><?= ($i+1) ?> <span class="g">[<?= $count ?>]</span></label> &nbsp;&nbsp;
<?
			}
		}
		
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
			fetch all brands with images
		*/
		static public function fetchList($page=NULL,$view=false) {
			if($view === Brand::LIST_ALL){
				return self::fetch("SELECT b.*"
					.", i.id AS BrandImage_id, i.ext AS BrandImage_ext, i.width AS BrandImage_width, i.height AS BrandImage_height"
					." FROM (brand b, brand_image i)"
					." WHERE b.id=i.parentId AND i.pos=1 AND b.isActive ORDER BY b.pos");
			}

			else return parent::fetchList($page,$view); //admin fetching
		}
		

	}
?>
