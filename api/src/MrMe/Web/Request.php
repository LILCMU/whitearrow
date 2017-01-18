<?php
namespace MrMe\Web;

class Request
{
	public $addr;

	public function __construct($bodyParams = null)
	{
		$this->addr = $_SERVER['REMOTE_ADDR'];
		
		if ($bodyParams)
		 	$this->params = json_decode(json_encode($bodyParams));
		if (count($_REQUEST) > 0)
			$this->body = json_decode(json_encode($_REQUEST, true));
	}

	public function __destruct()
	{
		unset($this->addr);
	}

}
?>