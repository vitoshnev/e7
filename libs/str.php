<?
	require_once("String.php");

	function strEnd($total, $var1, $var2, $var3) {
		$e = intval(substr($total, strlen($total)-1));
		$e2 = intval(substr($total, strlen($total)-2));
		if ( $e >= 2 && $e <= 4 && !($e2 >= 11 && $e2 <= 19) ) return $var2;
		else if ( $e == 1 && !($e2 >= 11 && $e2 <= 19) ) return $var1;
		return $var3;
	}

	function strCut($str, $max)
	{
		if(strlen($str)>$max) $str = substr($str, 0, $max);
		return $str;
	}

	function strMaxChars($str, $max, $padStr="") {
		if ( strlen($str) <= $max ) return $str;
		$a = wordwrap($str, $max, "\t");
		$a = explode("\t", $a);
		return $a[0].$padStr;
	}

	function strMaxWords($str, $maxWords, $padStr="") {
		$words = preg_split("/[ \t\n]/", $str);
		$ww = array();
		foreach ( $words as $w ) {
			$w = trim($w);
			if ( !$w ) continue;
			$ww[] = $w;
			if ( sizeof($ww) >= $maxWords ) break;
		}
		$newStr = implode(" ", $ww);
		if ( String::length($newStr) < String::length($str) ) $newStr = $newStr.$padStr;
		return $newStr;
	}

	function str4URL($str) {
		// if current charset is UTF-8 - use MB version:
		if ( Config::CHARSET == Language::CHARSET_UTF8 ) return String::forURL($str);

		//$str = preg_replace("/[\~\`\!\@\#\$\%\^\&\*\(\)\+\=\|\\\{\}\[\]\;\:\'\"\<\>\/\?]/", "", $str);

		// transliterate cyrillic and remove spaces:
		$a = array(
			"À"=>"a",
			"Á"=>"b",
			"Â"=>"v",
			"Ã"=>"g",
			"Ä"=>"d",
			"Å"=>"e",
			"¨"=>"e",
			"Æ"=>"zh",
			"Ç"=>"z",
			"È"=>"i",
			"É"=>"y",
			"Ê"=>"k",
			"Ë"=>"l",
			"Ì"=>"m",
			"Í"=>"n",
			"Î"=>"o",
			"Ï"=>"p",
			"Ð"=>"r",
			"Ñ"=>"s",
			"Ò"=>"t",
			"Ó"=>"u",
			"Ô"=>"f",
			"Õ"=>"h",
			"Ö"=>"c",
			"×"=>"ch",
			"Ø"=>"sh",
			"Ù"=>"sh",
			"Ü"=>"_",
			"Ú"=>"_",
			"Û"=>"y",
			"Ý"=>"e",
			"Þ"=>"yu",
			"ß"=>"ya",
			" "=>"-",
			);
		$rl = array_keys($a);

		$strNew = "";
		for($i=0; $i<strlen($str); $i++) {
			$l = strtoupper($str[$i]);
			if ( in_array($l, $rl) ) $strNew .= $a[$l];
			else $strNew .= $l;
		}

		// leave only allowed chars:
		$strNew = preg_replace("/[^a-zA-Z0-9-_,\.]/", "", $strNew);

		if ( !strlen($strNew) ) $strNew = "new_file";

		return $strNew;
	}
?>