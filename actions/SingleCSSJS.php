<?
	class SingleCSSJS extends WebPage {
		const EXPIRES					= 300;	//each 5 mins

		protected $contentType = "plain/text";
		protected $logger = NULL;

		public function doGet() {

			$this->logger = Logger::fileLogger("../tmp/SingleCSSJS.txt");
			$this->logger->w(str_repeat("-", 40));
			$this->logger->w("URL: ".$_SERVER['REQUEST_URI']);

			$isCSS = $_GET['isCSS'];
			$isJS = $_GET['isJS'];
			$files = $_GET['files'];

			if ( $isCSS ) {
				$this->contentType = "text/css";
				$ext = "css";
			}
			else {
				$this->contentType = "application/javascript";
				$ext = "js";
			}

			$cacheKey = md5($_SERVER['REQUEST_URI']);
			// important! this has to be in quotes:
			$etag = "\"".$cacheKey."\"";
			$headers = getAllHeaders();
			// check non-changed request:
			if ( $etag == $headers["If-None-Match"] ) {
				// return non-changed!
				header("HTTP/1.1 304 Not Modified");
				header("ETag: ".$etag);
				exit();
			}
			// check cache:
			$cachedFile = E7::PATH_CACHE.$cacheKey.".".$ext;
			if ( !$_GET['noCache'] && is_file($cachedFile) ) {
				// check if file is not expired:
				$mtime = filemtime($cachedFile);
				if ( time() - $mtime < self::EXPIRES ) {
					// output cached resource:
					ob_start(array($this,'output'));
					header("Last-Modified: ".gmdate("D, j M Y G:i:s T", $mtime) );
					$expiry = gmdate("D, j M Y G:i:s T", $mtime+self::EXPIRES);
					header("Expires: ".$expiry );
					header("ETag: ".$etag);
					header("Accept-Ranges: bytes");
					print "/*Cached in ".$cachedFile."*/\n";
					print "/*Expires on ".$expiry."*/\n";
					readfile($cachedFile);
					ob_end_flush();
					return;
				}
			}


			// output resource:
			ob_start(array($this,'output'));
			header("Last-Modified: ".gmdate("D, j M Y G:i:s T", $mtime) );
			header("Expires: ".gmdate("D, j M Y G:i:s T", $mtime+self::EXPIRES) );
			header("ETag: ".$etag);
			header("Accept-Ranges: bytes");

			$files = base64_decode($files);
			$files = explode("\n", $files);
			$content = array();
			$this->logger->w("Files:");
			$this->logger->w($files);
			$content = "";
			$expiry = gmdate("D, j M Y G:i:s T", time() + self::EXPIRES);
			print "/*Just-generated (".$cachedFile.")*/\n";
			print "/*Expires on ".$expiry."*/\n";
			foreach ( $files as $url ) {
				$fullURL = "http://".$_SERVER['HTTP_HOST']."/".$ext."/".$url;
				$content .= trim(file_get_contents($fullURL))."\n";
			}
			print $content;
			ob_end_flush();

			// save to cache:
			fileSave($cachedFile, $content);
		}

		public function output($content) {
			header('Content-type: '.$this->contentType);
			header('Content-Length: ' . strlen($content));
			return $content;
		}

	}
?>
