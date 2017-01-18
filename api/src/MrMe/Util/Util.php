<?php
namespace MrMe\Util;

class Util
{
	public static function GetX()
	{
		return ">>x<<";
	}

	public static function callFunction($instance, $name, $params)
	{
		//var_dump($params);
		if (method_exists($instance, $name))
		{
			return call_user_func_array(array($instance, $name), Util::refValues($params));
		}
		
	}

    public static function refValues($arr)
	{
		if (strnatcmp(phpversion(),'5.3') >= 0) //Reference is required for PHP 5.3+
	    {
	        $refs = array();
	        foreach($arr as $key => $value)
	            $refs[$key] = &$arr[$key];
	        return $refs;
	    }
	    return $arr;
	}
}
?>