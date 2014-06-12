<?
	require_once("file.php");

	if ( !defined("FORM_MAX_FILESIZE") )
		define ("UPLOAD_MAX_FILESIZE", 1048576);
	else
		define ("UPLOAD_MAX_FILESIZE", FORM_MAX_FILESIZE);

	// forbidden's
	$gUploadForbiddenFormats = array("html","htm","shtml","shtm","php","phtml","php3","php4","php5","pl","cgi","asp","jsp","java","class","js","css","xml","xsl","xslt","cab","swf","htaccess","htpasswd");

	function uploadFile($image, $out, $imageOriginal=NULL, $mode=0666) {
		global $gUploadForbiddenFormats;
		
		if ( $imageOriginal ) {
			$ext = strtolower(fileExt($imageOriginal));
			if ( in_array($ext, $gUploadForbiddenFormats) ) {
				errPush("Файл имеет недопустимое расширение: ".$ext."\nНе разрешается добавлять файлы с расширениями: ".implode(", ", $gUploadForbiddenFormats));
				return false;
			}
		}
		if ( $image != "" && file_exists ( $image ) ) {
			if ( !copy($image, $out) ) {
				errPush("Не удалось скопировать файл $image в файл $out");
				return false;
			}
			@chmod ($out, $mode);
			return true;
		}
		return false;
	}
?>