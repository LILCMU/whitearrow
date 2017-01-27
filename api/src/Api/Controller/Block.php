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

		$name		     = $this->request->body->aname;
		$dev             = $this->request->body->dname;
		$mode		     = $this->request->body->scode;
		$type		     = $this->request->body->type;
		$input_var       = $this->request->body->invar;
		$input_var_name  = $this->request->body->invarname;
		$output_var      = $this->request->body->outvar;
		$output_var_name = $this->request->body->outvarname;
		$codetext		 = $this->request->body->codetext;
		$description	 = $this->request->body->Desp;
		$facebook_id     = $this->request->body->f_id;
        //$name = $this->request->body->name;

		// $msg  = json_decode($json);
		// $u_id = $msg->header->uid;
		// $name = $msg->header->name;
		// $dev  = $msg->header->developer;
		// $sel  = $msg->header->select;

		//echo $u_id. " " .$name. " " .$dev. " " .$sel;
		//var_dump($msg->header);
		// echo json_encode($msg);

		/* ========================== check and insert system ==================================== */
		// $table = "systems";
		// $this->db->select($table);
		// $this->db->and("user_id", "LIKE", "'$u_id'" )
		// 	     ->and("name", "LIKE", "'$name'");
		// $result   = $this->db->executeReader();
		//
		// if ($result)
		// 	$this->response->error(array("status" => false, "message" => "already has system!"));
		// else
		// {
		// 	$fields	  = ["user_id", "name"];
		// 	$values   = [$u_id, "'$name'"];
		//
		// 	$this->db->insert($table, $fields, $values);
		// 	$err 	  = $this->db->execute();
		// 	if ($err)
	    //     	$this->response->success(array("success" => false,
	    //     								   "error" => $err));
		// 	else
		// 		$this->response->success(array("success" => true));
		// }
		/* ========================== check and insert system ==================================== */


		/* =========================== write code in file ======================================== */
        $filename_js  = $name .".js";
		$filename_xml = $name . ".xml";

        mkdir("add-ons/$facebook_id/");
        fopen("add-ons/$facebook_id/$filename_js", "w");
        $myfile = file_put_contents("add-ons/$facebook_id/$filename_js", $msg_js.PHP_EOL , FILE_APPEND | LOCK_EX);

		fopen("add-ons/$facebook_id/$filename_js", "w");
        $myfile = file_put_contents("add-ons/$facebook_id/$filename_js", $msg_xml.PHP_EOL , FILE_APPEND | LOCK_EX);

        if (!$myfile)
            $this->response->error(array("success" => false, "message" => "error!"));
        else
            $this->response->success(array("success" => true , "message"));

		/* =========================== writ`e code in file ======================================== */
	}

    public function getblock()
    {
        header("Access-Control-Allow-Origin: *");
		header("Access-Control-Allow-Headers: POST");
		header('Access-Contro	l-Allow-Methods: *');
		header('Content-Type: application/json');

		$addons_id   = $this->request->body->aid;

        $ip          = $_SERVER['SERVER_ADDR'];
        $port        = $_SERVER['SERVER_PORT'];
		$server_part = $ip.":".$port;

		$table   = "systems";
		$select  = "user_id, name, block_name";
		$this->db->select($table, $select);
		$this->db->where("id", "=", "$addons_id");
		$model   = $this->db->executeReader();
		$user_id = $model[0]->user_id;

		$table  = "users";
		$select = "facebook_id";
		$this->db->select($table, $select);
		$this->db->where("id", "=", "$user_id");
		$model_user = $this->db->executeReader();

		$this->response->success(array(
								"success" => true,
								"block"   => array(
									// "files" => "http://".$server_part."/NSC2017/api/add-ons/".$model_user[0]->facebook_id."/".$model[0]->name.".js",
									"files" => "http://localhost/NSC2017/api/add-ons/".$model_user[0]->facebook_id."/".$model[0]->name.".js",
									"xml"   => $model[0]->block_name)
								));
	}

	public function getlistblock()
	{
		header("Access-Control-Allow-Origin: *");
		header("Access-Control-Allow-Headers: POST");
		header('Access-Control-Allow-Methods: *');
		header('Content-Type: application/json');

		$table  = "systems";
		$select = "id, user_id, name";
		$this->db->select($table, $select);
		$model  = $this->db->executeReader();

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
		$data = $this->request->body->aname;
		var_dump($data);

	}
}
?>
