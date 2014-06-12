<?
	class CarImageSprite extends ImageEntity {
		const MAX_FILESIZE			= 16777216;
		const MAX_DIMENSION			= 20000;

		const FULL_WIDTH			= 830;
		const FULL_HEIGHT			= 550;
		const MIN_HEAD_WIDTH			= 460;

		const FULL_CARPAGE_WIDTH			= 833;
		const MIN_CARPAGE_WIDTH			= 636;

		// const THUMB_BIG_WIDTH			= 100;
		// const THUMB_HEIGHT			= 42.9333;

		const THUMB_WIDTH			= 170;
		const THUMB_HEIGHT			= 110;
		
		const THUMB_WIDTH_STOCK		= 140;
		const THUMB_HEIGHT_STOCK	= 220;

		const THUMB_WIDTH_STOCK_BIG		= 450;
		
		const THUMB_WIDTH_MODAL		= 300; //for modal in stock
		const THUMB_BIG_WIDTH		= 350;
		const THUMB_BIG_HEIGHT		= 200;

		const FREE_SPACE = 220;

		public function urlForHead($y=0,$class=false){
			$this->urlCropWidth(0, $y*CarImageSprite::FULL_HEIGHT, CarImageSprite::FULL_WIDTH, CarImageSprite::FULL_HEIGHT, self::FULL_WIDTH);
			$h=CarImageSprite::FULL_HEIGHT;
			// $h=intval($width*$param);
			$url=$this->url();
			$space=self::FREE_SPACE;
			$space=intval($space);
			$offset=$space;
			$url=$this->urlCropWidth(0, $y*CarImageSprite::FULL_HEIGHT, CarImageSprite::FULL_WIDTH, CarImageSprite::FULL_HEIGHT, self::FULL_WIDTH);
			$div='<div '.$ttl.' data-y="'.$y.'" class="carImg '.$class.'" style="height:'.($h-$space).'px;background:url(\''.$url.'\') center bottom/cover no-repeat"></div>';
			return $div;

		}
		public function urlForSlide($y=0,$class=false){
			$height=CarImageSprite::FULL_HEIGHT;
			return $this->urlCropWidth(0, (($y*$height)+150), CarImageSprite::FULL_WIDTH, ($height-150), self::FULL_WIDTH);
			
			$h=CarImageSprite::FULL_HEIGHT;
			// $h=intval($width*$param);
			$url=$this->url();
			$space=self::FREE_SPACE;
			$space=intval($space);
			$offset=$space;
			$url=$this->urlCropWidth(0, $y*CarImageSprite::FULL_HEIGHT, CarImageSprite::FULL_WIDTH, CarImageSprite::FULL_HEIGHT, self::FULL_WIDTH);
			$div='<div '.$ttl.' data-y="'.$y.'" class="carImg '.$class.'" style="height:'.($h-$space).'px;background:url(\''.$url.'\') center bottom/cover no-repeat"></div>';
			return $div;

		}

		public function urlIconSprite($width,$pos,$colorName=false){
			$this->setUrlWidth($width);
			$h=($width*self::FULL_HEIGHT)/self::FULL_WIDTH;
			// $h=intval($width*$param);
			$url=$this->url();
			$space=(self::FREE_SPACE/self::FULL_WIDTH)*$width;
			$space=intval($space);
			$offset=$space+($h*$pos);
			if($colorName) $ttl='title="'.$colorName.'"';
			$div='<div '.$ttl.' space="'.$space.'" class="carImg" style="height:'.($h-$space).'px;background:url(\''.$url.'\') center -'.($offset).'px no-repeat"></div>';
			return $div;
		}
	}
?>