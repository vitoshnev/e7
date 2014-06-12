<?
	// @FormURL("/registration/")
	// @AfterUpdateURL("/my/profile/")
	// @AfterInsertURL("/registration/done.html")
	// @InsertSubmitValue("Регистрация")
	// @UpdateSubmitValue("Сохранить")
	// @InsertErrMsg("Во время регистрации произошла непрeдвиденная ошибка. Пожалуйста, обратитесь в Администрацию.")
	// @UpdateErrMsg("Во время обновления профиля произошла непрeдвиденная ошибка. Пожалуйста, обратитесь в Администрацию.")
	// @HTMLListCSS("users")
	// @HTMLListItemCSS("user")
	// @WithListItemViewCSS()
	class User extends Entity {

		const VIEW_ICON					= 1;

		const LIST_ALL					= 1;
		const LIST_MEMBERS				= 10;

		const FORM_VIEW_REGISTRATION	= 1;
		const FORM_VIEW_PROFILE			= 2;
		const FORM_VIEW_ADMIN			= 99;

		const SESSION					= "user";
		const COOKIE_REMEMBER			= "vUserIdRemember";
		const COOKIE_REMEMBER_EXPIRY	= 1296000;	// 15 days - we rememeber access for explicit login
		const COOKIE_LAST				= "vUserId";
		const COOKIE_LAST_EXPIRY		= 15552000;	// 180 days - we track user implicitly (for admin/stats purposes)

		// @PrimaryKey
		// @Name("Айдиха")
		var $id;

		// @Length(32)
		// @Name("Фамилия НОВАЯ")
		// @Required
		var $nameLast;

		// @Name("Имя")
		// @Required
		var $nameFirst;

		// @Name("Отчество")
		// @View(1,2,99)
		var $nameMiddle;

		// @Name("Email")
		// @Required
		var $email;

		// @Name("Пароль")
		// @Password
		// @View(2,99)
		// @Required
		var $password;

		// @View(99)
		// @Default(1)
		var $isActive;

		// @Date()
		// @View(99)
		var $createdOn;

/******************************
	Static methods
******************************/

		static public function css($page) {

			$css["ul.users li.user"] = "float:left;width:".UserImage::DIMENSION_ICON."px;height:".UserImage::DIMENSION_ICON."px;margin:0 8px 8px 0;";

			$css["ul.tasks li.user.view10"] = "width:".(UserImage::DIMENSION_ICON*3+8)."px;height:".UserImage::DIMENSION_ICON."px;";
			$css["ul.tasks li.user.view10 div.memberRole"] = "float:right;margin-left:8px;width:".(UserImage::DIMENSION_ICON*2)."px;height:".UserImage::DIMENSION_ICON."px;line-height:".UserImage::DIMENSION_ICON."px";

			$css["div.userIcon"] = "width:".UserImage::DIMENSION_ICON."px;height:".UserImage::DIMENSION_ICON."px;border-radius:5px;overflow:hidden";
			$css["div.userIcon:hover"] = "box-shadow:0 0 5px #ccc";
			$css["div.userIcon div.userIconBG"] = "background-color:#637081;color:#fff";
			$css["div.userIcon:hover div.userIconBG"] = "background-color:#f37936;color:#fff";
			$css["div.userIcon div.userIconText"] = "line-height:".UserImage::DIMENSION_ICON."px;text-align:center;font-size:1.4em;font-weight:bold;";
			$css["div.userIcon a"] = "text-decoration:none;color:#000";

			$page->submitCSS($css);
		}

		/**
		 * Detects and optionally fetches current user from DB.
		 * First, checks $_SESSION[User::SESSION] - it may contain current user object.
		 * If not - checks $_COOKIE[User::COOKIE_REMEMBER] - it may contain current vUserId.
		 * @return User object
		 */
		public static function current() {
			// is this user logged in?
			if(isset($_SESSION[User::SESSION]))	$userData = $_SESSION[User::SESSION];
			if ( $userData ) {
				// yes, take user object from sesion:
				$user = unserialize($userData);
				if ( is_object($user) ) return $user;
			}
			else {
				// no, but check if this user is remembered in cookies:
				list ( $userId, $md5 ) = explode(":", $_COOKIE[User::COOKIE_REMEMBER]);
				if ( $userId ) {
					// yes, we can log in this one:
					$user = User::fetchById($userId);
					// check password still the same:
					if ( $md5 == md5($user->password) ) return self::login($user);
				}
			}
			return NULL;
		}

		/**
		 * Passed argument $user is User object.
		 * Make sure, $user contains id property.
		 * @param User $user
		 * @return User object
		*/
		public static function login($user, $remember=false) {
			// store user object in session:
			$_SESSION[User::SESSION] = serialize($user);

			// refresh user id in cookies:
			if ( $remember ) {
				// храним не просто user id, но и хеш пароля, чтобы нельзя было создать куки вручную в браузере
				// если пароль сменится - ремембер пропадет
				setcookie(User::COOKIE_REMEMBER, $user->id().":".md5($user->password), time()+User::COOKIE_REMEMBER_EXPIRY, $path="/");
			}
			setcookie(User::COOKIE_LAST, $user->id(), time()+User::COOKIE_LAST_EXPIRY, $path="/");

			return $user;
		}

		/**
		 * Fetches a User object by a specified user.id
		 * @param String $id
		 * @return User object
		 */
		public static function loginById($id) {
			$u = User::fetchById($id);
			return self::login($u);
		}

		/**
		 * Detects and fetches current user from DB.
		 * First, checks $_SESSION[User::SESSION] - it may contain current user object.
		 * If not - checks $_COOKIE[User::COOKIE_REMEMBER] - it may contain current vUserId.
		 * @return User object
		 */
		public static function fetchCurrent() {
			$user = User::current();	// take some basic data from session
			if ( !$user || !$user->id() ) return NULL;

			// refetch full user record from DB:
			$user = User::fetchById($user->id());
			if ( !$user ) return NULL;

			// update lastSeenOn:
			$user->lastSeenOn = Date::nowMySQL();
			$user->save(false, false);	// skip validation & triggers

			// relogin - update user in session:
			User::login($user);

			return $user;	// this is a Customer or Manager
		}

		/**
		 * Fetches a User object by a specified column in v_user view.
		 * @param String $by A column in v_user table.
		 * @param Mixed $value
		 * @return User object
		 */
		public static function fetchBy($by, $value) {
			// first we fetch a virtual record User:
			$u = DB::fetchOne("User", "SELECT u.*"
				.", ui.id AS UserImage_id, ui.ext as UserImage_ext, ui.width AS UserImage_width, ui.height AS UserImage_height"
				." FROM user u"
				." LEFT JOIN user_image ui ON u.id=ui.parentId"
				." WHERE"
				." u.`".$by."`='".s($value,1)."'");
			if ( !$u ) return NULL;

			self::cache($u);

			return $u;
		}

		/**
		 * Fetches a User object by a specified v_user.id (vUserId).
		 * @param String $id Important! This is a vUserId!
		 * @return User object
		 */
		public static function fetchById($id) {
			if ( $u = self::fromCache("User".".".$id) ) return $u;

			return self::fetchBy("id", $id);
		}

		/**
		 * Fetches a User object by email.
		 */
		public static function fetchByEmail($email) {
			return self::fetchBy("email", $email);
		}

		public static function showFormAccept($user) {
?>
<input validation="Условия работы с сайтом"<?= $user->hasAcceptedRules?" checked":"" ?> type="checkbox" name="hasAcceptedRules" id="hasAcceptedRules"><label for="hasAcceptedRules">принимаю</label> <a href="<?= PublicPage::TERMS_AND_CONDITIONS ?>" target="_blank">условия работы с сайтом</a><br />
<?
		}

		public function show($view=0) {
			switch ( $view ) {
				case User::LIST_MEMBERS:
?>
<div class="memberRole"><?= UserRole::showSelectList(UserRole::roles(), "roles") ?></div>
<?
					$this->showIcon($view);
					break;

				default:
					$this->showIcon($view);
			}
		}

		public function showIcon($view=0, $url=NULL) {
			if ( $this->data("UserImage_id") ) {
				$img = new UserImage();
				$img->applyArray($this->data(), "UserImage_");
				$imgURL = $img->urlMaxDimension(CustomerImage::DIMENSION_ICON);
			}
			else $imgURL = NULL;

			if ( $url ) {
?>
<div class="userIcon clickable animate" title="<?= $this->name() ?>">
<a href="<?= $url ?>">
<?
				if ( $imgURL ) {
?>
<div class="userIconBG userIconImg" style="background-image:url('<?= $imgURL ?>')"></div>
<?
				}
				else {
?>
<div class="userIconBG userIconText animate"><?= $this->fl() ?></div>
<?
				}
?>
</a>
</div>
<?
			}
			else {
?>
<div class="userIcon animate<?= $view==self::LIST_ALL?" clickable":"" ?>" title="<?= $this->name() ?>"<?= $view==self::LIST_ALL?" onclick='User.click(".$this->id.")'":"" ?>>
<?
				if ( $imgURL ) {
?>
<div class="userIconBG userIconImg animate" style="background-image:url('<?= $imgURL ?>')"></div>
<?
				}
				else {
?>
<div class="userIconBG userIconText animate"><?= $this->fl() ?></div>
<?
				}
?>
</div>
<?
			}
		}

		static public function fetchList($view=NULL) {
			switch ( $view ) {
				case User::LIST_ALL:
					return User::fetch("SELECT u.*"
						.", ui.id AS UserImage_id, ui.ext as UserImage_ext, ui.width AS UserImage_width, ui.height AS UserImage_height"
						." FROM user u"
						." LEFT JOIN user_image ui ON u.id=ui.parentId"
						." WHERE u.isActive"
						." ORDER BY u.nameLast, u.nameFirst");

				default:
					return User::fetch("SELECT u.*"
						.", ui.id AS UserImage_id, ui.ext as UserImage_ext, ui.width AS UserImage_width, ui.height AS UserImage_height"
						." FROM user u"
						." LEFT JOIN user_image ui ON u.id=ui.parentId"
						." WHERE u.isActive"
						." ORDER BY u.nameLast, u.nameFirst");
			}
		}

/******************************
	Public methods
******************************/

		public function setDefaultValues() {
			parent::setDefaultValues();

			$this->password = rand(1111,9999);
		}

		public function name() {
			return trim($this->nameFirst." ".$this->nameLast);
		}

		public function fl() {
			return strtoupper(mb_substr(trim($this->nameFirst), 0, 2).substr(trim($this->nameLast), 0, 2));
		}

		// @SomeMethodAnn("SomeParam")
		public function cssForm($page) {
		}

		public function showForm_nameFirst__() {
?>
<tr>
	<th>Уникальное имя</th>
	<td><input hint="Имdfdfd" name="nameFirst" value="<?= p($this->nameFirst) ?>" maxlength="32"></td>
</tr>
<?
		}

		protected function afterInsert() {
			parent::afterInsert();

			User::login($this);
		}

		protected function afterSave($isNew) {
			parent::afterSave($isNew);

			// trim params:
			/*$_POST = t($_POST);

			// remember in session:
			if ( !$_POST['pt'] ) $_POST['pt'] = WebPage::token();
			$_SESSION[$_POST['pt']] = $_POST;

			//if ( $_POST['back'] ) go(PublicPage::REGISTRATION."?pt=".$_POST['pt']);

			// create user:
			$user = new User($_POST);
			$user->id = NULL;		// always new registration

			try {
				$user->save();
			}
			catch(EntityException $e) {
				$_SESSION[$_POST['pt']]['errMsg'] = $e->message;
				$_SESSION[$_POST['pt']]['object'] = $user;

				go(PublicPage::REGISTRATION."?err=".$e->errCode."&pt=".$_POST['pt']);
			}

			// attach image:
			/ *try {
				Uploader::upload("UserImage", "UserImage".$_POST['pt'], array("parentId"=>$user->id), false);
			}
			catch ( EntityException $e ) {
				// error during saving:
				$_SESSION[$_POST['pt']]['errMsg'] = $e->message;
				$_SESSION[$_POST['pt']]['object'] = $user;

				// do not return user back - just skip...
				//go(PublicPage::REGISTRATION."?err=".$e->errCode."&pt=".$_POST['pt']);
			}* /

			$user->sendRegistrationWithEmailConfirmation();
			$user->sendSMSConfirmation();

			// log in:
			User::login($user);*/
		}
	}
?>
