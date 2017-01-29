<?php
namespace Api\Controller;

use MrMe\Web\Controller;
use MrMe\Database\MySql\MySqlConnection as MySqlConnection;
use MrMe\Database\MySql\MySqlCommand as MySqlCommand;

class Block extends Controller
{
	public function addblock()
	{
		header("Access-Control-Allow-Origin: *");
		header("Access-Control-Allow-Headers: POST");
		header('Access-Control-Allow-Methods: *');
		header('Content-Type: application/json');

		$aname    = $this->request->body->aname;
		$dname    = $this->request->body->dname;
		$xml      = $this->request->body->xml;
		$des      = $this->request->body->des;
		$path     = "add-ons/" .$dname. "/" .$aname. ".eiei";
		$patterns = '/(^\s*)|(\s+$)/';

		$aname    = preg_replace($patterns, '', $aname);
		$des 	  = preg_replace($patterns, '', $des);

		// $this->response->success(preg_replace($patterns, '', $aname));
		// $this->response->success($aname);

		$table = "systems";
		$select = "id";
		$this->db->select($table, $select);
		$this->db->and("user_id", "=", 1)
				 ->and("name", "LIKE", "'$aname'");
		$model = $this->db->executeReader();

		if (!$model)
		{
			$table = "systems";
			$field = ["user_id", "name", "description", "path"];
			$value = [1, "'$aname'", "'$des'", "'$path'"];
			$this->db->insert($table, $field, $value);
			$err = $this->db->execute();

			if ($err)
				$this->response->error(array("success" => false,
											"error" => $err));
			else
			{
				fopen($path, "w");
				$myfile = file_put_contents($path, $xml.PHP_EOL , FILE_APPEND | LOCK_EX);

				if (!$myfile)
					$this->response->error(array("success" => false, "message" => "error!"));
				else
				{
					$select = "id";
					$this->db->select($table, $select);
					$this->db->and("user_id", "=", 1)
							->and("name", "LIKE", "'$aname'")
							->and("description", "LIKE", "'$des'");
					$model = $this->db->executeReader();

					if($model)
						$this->response->success(array("success" => true, 
													  "model"   => $model));
						
					else 
						$this->response->error(array("success" => false));
				}
			}
		}
		else
			$this->response->error(array("success" => false,
										 "error"   => "Add-on is already has in system"));
	}

    public function getblock()
    {
        header("Access-Control-Allow-Origin: *");
		header("Access-Control-Allow-Headers: POST");
		header('Access-Contro	l-Allow-Methods: *');
		header('Content-Type: application/json');

		$addons_id   = $this->request->params->aid;

        // $ip          = $_SERVER['SERVER_ADDR'];
        // $port        = $_SERVER['SERVER_PORT'];
		// $server_part = $ip.":".$port;

		$table   = "systems";
		$select  = "user_id, path";
		$this->db->select($table, $select);
		$this->db->where("id", "=", "$addons_id");
		$model   = $this->db->executeReader();

		$path = $model[0]->path;
		$file    = file_get_contents("$path", FILE_USE_INCLUDE_PATH);
		// var_dump($file);

		// $table  = "users";
		// $select = "facebook_id";
		// $this->db->select($table, $select);
		// $this->db->where("id", "=", "$user_id");
		// $model_user = $this->db->executeReader();
		
		$this->response->success(array(
								"success" => true,
								"file"    => $file
								));
	}

	public function getlistblock()
	{
		header("Access-Control-Allow-Origin: *");
		header("Access-Control-Allow-Headers: POST");
		header('Access-Control-Allow-Methods: *');
		header('Content-Type: application/json');

		$table  = "systems s JOIN users u on s.user_id = u.id";
		$select = "s.id, u.first_name, s.name, s.timestamp";
		$this->db->select($table, $select);
		$model  = $this->db->executeReader();
		// $this->response->success($model);

		$datetime = explode(" ", $model[0]->timestamp);

		// if ($model)
		// 	$this->response->success(array("status" => true,
		// 								   "model" => $model));
		// else
		// 	$this->response->success(array("status" => false));

		/* Write file html */
		$file_top    = file_get_contents('top.txt', FILE_USE_INCLUDE_PATH);
		$file_bottom = file_get_contents('bottom.txt', FILE_USE_INCLUDE_PATH);

		$file_mid1 	 = '<div class="col-xs-6 col-sm-6 col-md-4 portfolio-item Cloud ">
						<div class="wrapper"><div class="card radius shadowDepth1"><div class="card__image border-tlr-radius">
                  		<img src="images/blockly.jpg"  alt="image" class="border-tlr-radius"></div>
						<div class="card__content card__padding"><div class="card__share"><div class="card__social"> </div><a id="share" class="share-toggle share-icon" href="javascript:console.log(\'test\');"></a></div><div class="card__meta">
                    	<a >5.0/5.0</a><time>';
		$file_mid2 	= '</time></div>
                       <article class="card__article"><h2>';
		$file_mid3 = '</a></h2>
                    	</article><div class="card__action"><div class="card__author">
                        <img src="images/cpecmu.jpeg" width="40px"alt="user">
                        <div class="card__author-content">
                            By <a>';
		$file_mid4 = '</a>
                        </div></div></div></div></div></div>';

		$file_all = $file_top;
		
		foreach ($model as $key => $value) 
		{
			$id    = (string)$model[$key]->id;
			$dname = (string)$model[$key]->first_name; 
			$aname = (string)$model[$key]->name;
			$date  = (string)$datetime[0];
			$file_all .= $file_mid1 .$date. $file_mid2 .'<a id="Addons'. $id .'">' .$aname. $file_mid3 .$dname. $file_mid4;
		}
		
		$file_all .= $file_bottom;           
		fopen("../addon_manager.html", "w");
        $myfile = file_put_contents("../addon_manager.html", $file_all.PHP_EOL , FILE_APPEND | LOCK_EX);
		if ($model)
			$this->response->success(array("status" => true,
										   "model" => $model));
		else
			$this->response->success(array("status" => false));

	}

	public function getblocksystems()
	{
		header("Access-Control-Allow-Origin: *");
		header("Access-Control-Allow-Headers: POST");
		header('Access-Control-Allow-Methods: *');
		header('Content-Type: application/json');

        $ip          = $_SERVER['SERVER_ADDR'];
        $port        = $_SERVER['SERVER_PORT'];
		$server_part = $ip.":".$port;

		$this->response->success(array(
								"success" => true,
								"wifi"    => array(
									"files" => "http://".$server_part."/nsc2017/api/add-ons/system/wifi/wifi.js",
									// "files" => "http://localhost/NSC2017/api/add-ons/system/wifi/wifi.js",
									"xml"   => ["network_module","wifi_setting","connect_wifi","check_network"])/*,*/
								// "io_pin"  => array(
								// 	"files" => "http://".$server_part."/NSC2017/api/add-ons/system/io_pin/io_pin.js",
								// 	// "files" => "http://localhost/NSC2017/api/add-ons/system/io_pin/io_pin.js",
								// 	"xml"   => "")
								));
	}

    public function getip()
    {
		header("Access-Control-Allow-Origin: *");
		header("Access-Control-Allow-Headers: POST");
		header('Access-Control-Allow-Methods: *');
		header('Content-Type: application/json');

        echo $_SERVER['SERVER_ADDR'];
    }

	public function echo()
	{
		header("Access-Control-Allow-Origin: *");
		header("Access-Control-Allow-Headers: POST");
		header('Access-Control-Allow-Methods: *');
		header('Content-Type: application/json');

		//$data = ($_POST["aname"]);
		
		$file_top    = file_get_contents('top.txt', FILE_USE_INCLUDE_PATH);
		$file_bottom = file_get_contents('bottom.txt', FILE_USE_INCLUDE_PATH);

		$file_mid1 	 = ' <div class="col-xs-6 col-sm-6 col-md-4 portfolio-item Cloud ">
                                <div class="portfolio-wrapper">
                                    <div class="portfolio-single">
                                        <div class="portfolio-thumb">
                                            <p > ';
		$file_mid2 	= ' </p>
                                        </div>
                                    </div>
                                    <div class="portfolio-info ">
                                        <h2 >by ';
		$file_mid3 = '</h2>
                                        <button id="';
		$file_mid4 = '">add to Blockly</button>
                                    </div>
                                </div>
                            </div>';
										
		$this->response->success($file_top);

	}
}
?>
