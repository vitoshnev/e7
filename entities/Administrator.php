<?
	class Administrator extends Entity {
		const SESSION		= "Administrator";

		var $id;
		var $name;
		var $password;
		var $isActive;
		var $isSuper;
		var $createdOn;
		var $updatedOn;

		public static function fetchByName($name) {
			return DB::fetchOne("Administrator", "SELECT * FROM manager WHERE name='".s($name,1)."'");
		}
	}
?>
