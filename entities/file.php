<?
	function fileExt ( $file_name )	{
		$i = strrchr($file_name, ".");
		return substr ($i, 1);
	}

	function fileLoad ($f, $a="r") {
		$fh = fopen ( $f, $a );
		if ( !$fh ) err("Could not load file $f");
		$size = filesize($f);
		if ( $size ) $t = fread ( $fh, filesize($f) );
		fclose($fh);
		return $t;
	}

	function fileSave($f, $t) {
		$fh = fopen ( $f, "w" );
		if ( !$fh ) err("Could not save file $f");
		fwrite ( $fh, $t );
		fclose ( $fh );
	}
?>