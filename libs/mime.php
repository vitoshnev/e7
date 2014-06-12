<?
	function mimeByExt($ext)
	{
		$ext = preg_replace("/^\.+/", "", $ext);
		switch(strtolower($ext))
		{
			case "gif":
			case "png":
				$mime = "image/".$ext;
				break;
			case "xls":
				$mime = "application/excel";
				break;
			case "hqx":
				$mime = "application/macbinhex40";
				break;
			case "doc":
			case "dot":
			case "wrd":
				$mime = "application/msword";
				break;
			case "pdf":
				$mime = "application/pdf";
				break;
			case "pgp":
				$mime = "application/pgp";
				break;
			case "ps":
			case "eps":
			case "ai":
				$mime = "application/postscript";
				break;
			case "ppt":
				$mime = "application/powerpoint";
				break;
			case "rtf":
				$mime = "application/rtf";
				break;
			case "tgz":
			case "gtar":
				$mime = "application/x-gtar";
				break;
			case "gz":
				$mime = "application/x-gzip";
				break;
			case "php":
			case "php3":
				$mime = "application/x-httpd-php";
				break;
			case "js":
				$mime = "application/x-javascript";
				break;
			case "ppd":
			case "psd":
				$mime = "application/x-photoshop";
				break;
			case "swf":
			case "swc":
			case "rf":
				$mime = "application/x-shockwave-flash";
				break;
			case "tar":
				$mime = "application/x-tar";
				break;
			case "zip":
				$mime = "application/zip";
				break;
			case "mid":
			case "midi":
			case "kar":
				$mime = "audio/midi";
				break;
			case "mp2":
			case "mp3":
			case "mpga":
				$mime = "audio/mpeg";
				break;
			case "ra":
				$mime = "audio/x-realaudio";
				break;
			case "wav":
				$mime = "audio/wav";
				break;
			case "bmp":
				$mime = "image/bitmap";
				break;
			case "iff":
				$mime = "image/iff";
				break;
			case "jb2":
				$mime = "image/jb2";
				break;
			case "jpg":
			case "jpe":
			case "jpeg":
				$mime = "image/jpeg";
				break;
			case "jpx":
				$mime = "image/jpx";
				break;
			case "tif":
			case "tiff":
				$mime = "image/tiff";
				break;
			case "wbmp":
				$mime = "image/vnd.wap.wbmp";
				break;
			case "xbm":
				$mime = "image/xbm";
				break;
			case "css":
				$mime = "text/css";
				break;
			case "txt":
				$mime = "text/plain";
				break;
			case "htm":
			case "html":
				$mime = "text/html";
				break;
			case "xml":
				$mime = "text/xml";
				break;
			case "mpg":
			case "mpe":
			case "mpeg":
				$mime = "video/mpeg";
				break;
			case "qt":
			case "mov":
				$mime = "video/quicktime";
				break;
			case "avi":
				$mime = "video/x-ms-video";
				break;
			case "eml":
				$mime = "message/rfc822";
				$encoding="7bit";
				break;
			default:
				$mime = "application/octet-stream";
				break;
			}

		return $mime;
	}
?>