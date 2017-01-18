<?php
namespace MrMe\Web;

use MrMe\Web\Controller as Controller;
use MrMe\Util\StringFunc as StringFunc;

class Router
{
	private $_CONFIG;
	private $mapping;

	public function __construct($_CONFIG = NULL)
	{
		if ($_CONFIG == null) return null;

		$this->_CONFIG = $_CONFIG;
	}

	public function __destruct()
	{
		unset($this->_CONFIG);
		unset($this->mapping);
	}

	public function setMapping($mapping = null)
	{
		$this->mapping = $mapping;
	}

	public function route($key, Controller $controller)
	{
		$offset = null;
		if (!empty($this->_CONFIG['URL']['M_OFFSET']))
			$offset = $this->_CONFIG['URL']['M_OFFSET'];

		$url = $this->parseUrl($offset);
		$urlStr = implode($url, '/');
		$urlStrSub = substr($urlStr, 0, strpos($urlStr, '?'));
		if ($urlStrSub)
			$urlStr = $urlStrSub;

		$url = explode('/', $urlStr);
		$keys = explode('/', $key);

		$index = array_search('{F}', $keys);
		
		$func = empty($url[$index]) ? "index" : $url[$index];
		
		$prefix = array_slice($keys, 0, count($index));
		$prefix = implode($prefix, '/');
		//var_dump($func);
		$params = array();
		$urlParams = array_slice($url, $index + 1);
		$urlParams = $this->getParamFromUrl($urlParams);
	
		foreach ($urlParams as $u)
		 	$params = array_merge($params, $u);
		// //var_dump($params);
		// //echo $urlStr . " vs " .$prefix; 
		if (StringFunc::startWith($urlStr, $prefix))
		{
			if (method_exists($controller, $func))
			{
				$controller->setConfig($this->_CONFIG);
				$controller->setParams($params);
			
				call_user_func_array(array($controller, $func), array());
			}
			else
			{
				echo "Request destination doesn't exist !";
			}
		}
	}

	private function getParamFromUrl($url)
	{
		$head = true;
		$params = array();
		foreach ($url as $i => $u)
		{
			if ($head)
			{
				$key = $url[$i];
				$val = "";
				if (!empty($url[$i+1]))
					$val = $url[$i+1];

				array_push($params, array($key => $val));
				$head = false;
				continue;
			}
			$head = true;
		}
		return $params;
	}

	private function parseUrl($offset = 0)
	{
		// $offset = empty($this->_CONFIG['URL']['S_OFFSET']) ? $offset : $this->CONFIG['URL']['S_OFFSET'];
		$url = 0;

		$url = explode('/', filter_var(rtrim($_SERVER['REQUEST_URI'], '/'), FILTER_SANITIZE_URL));
		
		foreach ($url as $i => $u) 
		{
			if (empty($u)) 
			{
				unset($url[$i]); 
			}
		}
		
		$url = array_slice($url, $offset); 
		if (!empty($this->CONFIG['COMMON']['DEBUG']))
			var_dump($url);
		return $url;
	}
}
?>