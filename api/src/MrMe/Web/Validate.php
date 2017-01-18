<?php
namespace MrMe\Web;

class Validate
{
	public static function isEmpty($obj, $out)
	{
		if (empty($obj))
		{ 
			$json = array("status" => false, 
						  "message" => $out);
			echo json_encode($json);
			exit;
		}     
		
		return $obj;
	}
	
	public static function isDate($obj, $out)
	{
		if ($tm = strtotime($obj) === false) 
		{
			$json = array("status" => false, 
						  "message" => $out);
			echo json_encode($json);
			exit;
		}
		
		return $obj;
	}
	
	public static function isEmail($obj, $out)
	{
		if (!filter_var($obj, FILTER_VALIDATE_EMAIL))
		{ 
			$json = array("status" => false, 
						  "message" => $out);
			echo json_encode($json);
			exit;
		}     
		
		return $obj;
	}
	
	public static function isNumber(&$obj, $out)
	{
		if (!is_numeric ($obj))
		{ 
			$json = array("status" => false, 
						  "message" => $out);
			echo json_encode($json);
			exit;
		} 
		$obj = (double)$obj;
		return $obj;
	}
}
?>