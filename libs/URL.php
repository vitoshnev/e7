<?
	function urlParams ( $url, $withQ=false)	{
		$url = explode("?", $url);
		return ($url[1]&&$withQ?"?".$url[1]:$url[1]);
	}
	
	function urlRemoveParams ( $theURL, $params )	{
		if ( !is_array($params) ) $params = array($params);

		$anchor = preg_replace("/^.*?(\#.+)?$/", "$1", $theURL);
		$url = explode("?", $theURL);
		if ( sizeof($url) == 1 ) return $theURL;	// no params
		if ( !$url[1] ) return $theURL;	// params are empty (page.html?)
		$pairs = explode("&", $url[1]);
		$newPairs = array();
		foreach ( $pairs as $p ) {
			$pair = explode("=", $p);
			if ( in_array($pair[0], $params) ) continue;
			$newPairs[] = $p;
		}
		return $url[0].(sizeof($newPairs)?"?".implode("&", $newPairs):"").$anchor;
	}

	function urlRemoveAnchor($url) {
		return preg_replace("/#.*$/", "", $url);
	}

	function urlAppendParam($url, $key, $value=NULL) {
		$url = urlRemoveParams($url, $key);
		// save anchor:
		if ( preg_match("/^.+#.+$/", $url) ) {
			$anchor = preg_replace("/.+(#.+)$/", "$1", $url);
			// remove anchor:
			$url = urlRemoveAnchor($url);
		}
		else $anchor = "";
		if ( strpos($url, "?") ) $token = "&";
		else $token = "?";
		return $url.$token.$key.($value!=NULL?"=".$value:"").$anchor;
	}

	function urlAddAnchor($url, $anchor) {
		$url = urlRemoveAnchor($url);
		return $url."#".$anchor;
	}
?>