<?
	require_once("ImageEntity.php");

	class HomeMenuImage extends ImageEntity {
		const MAX_FILESIZE			= 8388608;
		const MAX_DIMENSION			= 2560;

		const ADMIN_DIMENSION_LIST	= 80;

		// размеры оригинальной картинки:
		const FULL_WIDTH			= 2560;
		const FULL_HEIGHT			= 550;
	}
?>