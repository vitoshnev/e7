<?
	// site configuration:
	class ConfigBase {
		// general configuration:
		const VERSION				= "1.0";	// always 2 digits!
		const TITLE					= "TryCar";
		const OWNER					= "PlayNext Ltd.";
		const IMAGE_MAGICK_PATH		= "/usr/bin";
		const DEFAULT_LANGUAGE_ID	= "ru";
		const TIMEZONE				= "Europe/Moscow";

		// charset for web pages:
		const CHARSET				= Language::CHARSET_UTF8;
	
		// built-in emails:
		const EMAIL_SUPPORT			= "support@playnext.ru";
		const EMAIL					= "site@playnext.ru";

		// urls:
		const URL					= "http://trycar.ru";
		const URL_RU				= self::URL;
		//const URL_EN				= "http://en.tasks.playnext.ru";

		// locale used in strtoupper, strtolower operations:
		const LOCALE				= Language::LOCALE_UTF8;

		public static function supportedLanguages() {
			return array(
				Language::RU				=> new Language(Language::RU, Language::RU_NAME, Config::URL_RU),
				//Language::EN				=> new Language(Language::EN, Language::EN_NAME, Config::URL_EN),
			);
		}

		const IS_LOGGER_ENABLED		= true;

		const INVALIDATE_CSS_MS		= 3600;	// 1 hour

		const DB_NAME		= "trycar";
		const DB_HOST		= "localhost";
		const DB_USER		= "trycar";
		const DB_PASSWORD	= "try8";

		// turn off paging in DB:
		const DB_PAGES_ENABLED		= false;
	}

	// database settings:
	class DBConfig {
		const DB			= Config::DB_NAME;
		const HOST			= Config::DB_HOST;
		const USER			= Config::DB_USER;
		const PASSWORD		= Config::DB_PASSWORD;
		const CHARSET		= DBMySQL::CHARSET_UTF8;
	}

?>