<?
	if ( (isset($_ENV['OS']) && preg_match("/windows/i", $_ENV['OS'])) || (isset($_SERVER['SERVER_SOFTWARE']) && preg_match("/.*Win32.*/i", $_SERVER['SERVER_SOFTWARE'])) ) {
		define ("OS", "windows");
		define ("OS_WINDOWS", true);
		define ("OS_PATH_DELIMITER", ";");
	}
	else {
		define ("OS", "unix");
		define ("OS_UNIX", true);
		define ("OS_PATH_DELIMITER", ":");
	}
?>