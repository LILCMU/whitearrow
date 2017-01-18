<?php
namespace MrMe\Util;

class StringFunc
{
	public static function GetX()
	{
		return ">>x<<";
	}

	public static function startWith($haystack, $needle)
	{
		return $needle === "" || strrpos($haystack, $needle, -strlen($haystack)) !== false;
	}
}
?>