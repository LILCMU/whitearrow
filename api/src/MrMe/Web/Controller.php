<?php
namespace MrMe\Web;

use MrMe\Web\Request;
use MrMe\Web\Response;

use MrMe\Database\MySql\MySqlConnection;
use MrMe\Database\MySql\MySqlCommand;

use Monolog\Logger;
use Monolog\Handler\StreamHandler;

class Controller
{
	public $_CONFIG = 0;

	public $db = 0;
	public $request = 0;
	public $response = 0;
	public $logger = 0;

	public function __construct()
	{
		$this->logger = new Logger('system');
		$this->logger->pushHandler(new StreamHandler('system.log', Logger::INFO));
	}

	public function __destruct()
	{
		unset($this->request);
		unset($this->response);
		unset($this->_CONFIG);	
	}

	public function setParams($params)
	{
		$this->request = new Request($params);

		$this->logger->addInfo('----------- Request from ' . $this->request->addr . " " . $_SERVER['REQUEST_URI']);
	}

	public function setConfig($_CONFIG)
	{
		$this->_CONFIG = $_CONFIG;
		//var_dump($this->logger);
		$con = new MySqlConnection($_CONFIG, "utf8", $this->logger);
		$this->db = new MySqlCommand($con , $this->logger); 

		$this->response = new Response($this->logger);
	}

}
?>