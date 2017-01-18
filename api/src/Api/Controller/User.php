<?php
namespace Api\Controller;

use MrMe\Web\Validate as WebValidate;
use MrMe\Web\Controller;
use DateTime;
use DateInterval;

use MrMe\Database\MySql\MySqlCommand;
use MrMe\Database\MySql\MySqlConnection;

class User extends Controller
{
	public function login()
	{
		header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Headers: *");
        header('Access-Control-Allow-Methods: POST');
        header('Content-Type: application/json');

		$facebook_id = $this->request->body->fb_id;
		$first_name  = $this->request->body->f_name;
		$last_name   = $this->request->body->l_name;

		WebValidate::isEmpty($facebook_id, "Facebook ID cannot empty.");
		WebValidate::isEmpty($first_name, "first name cannot empty.");
		WebValidate::isEmpty($last_name, "last name cannot empty.");

        $table  = "users";
		$select = "id, status, facebook_id, token";
		$this->db->select($table, $select);
		$this->db->where("facebook_id", "LIKE", "'$facebook_id'");
		$model  = $this->db->executeReader();
		//$this->response->success($model);

		if ($model)
		{
			if ($model[0]->status == 0)
			{
				/* Genarate token and expiry time */
				$datetime = new DateTime(date("Y-m-d H:i:s", time()));
				$datetime->add(new DateInterval('PT2H'));
				json_encode($datetime);
				$expire   = $datetime->date;

				$token  = $_SESSION['token'] = md5(uniqid(mt_rand(), true));
		        $sets   = ["token = '$token'","status = 1", "expiry_datetime = '$expire'"];
				$clause = ["WHERE", "id = @id"];

		        $this->db->update($table, $sets, $clause);
		        $this->db->bindParam("@id", $model[0]->id);
		        $err = $this->db->execute();

				if ($err)
					$this->response->error(array("success" => false,
												 "error" => $err));
				else
					$this->response->success(array("success"     => true ,
												   "user_id"     => $model[0]->id,
												   "facebook_id" => $model[0]->facebook_id,
												   "first_name"  => $first_name,
												   "token"	 	 => $token));
			}
			else
				$this->response->error(array("success" => false,
											 "error" => "You already log in on another computer!"));
		}
	    else
		{
            $field = ["facebook_id", "first_name", "last_name"];
			$value = ["'$facebook_id'", "'$first_name'", "'$last_name'"];
			$this->db->insert($table, $field, $value);
			$err = $this->db->execute();

	        if ($err)
	        	$this->response->error(array("success" => false,
	        								   "error" => $err));
			else
			{
				$this->db->select($table, $select);
				$this->db->where("facebook_id", "LIKE", "'$facebook_id'");
				$model  = $this->db->executeReader();

				if ($model)
				{
					/* Genarate token and expiry time */
					$datetime = new DateTime(date("Y-m-d H:i:s", time()));
					$datetime->add(new DateInterval('PT2H'));
					json_encode($datetime);
					$expire   = $datetime->date;

					$token  = $_SESSION['token'] = md5(uniqid(mt_rand(), true));
			        $sets   = ["token = '$token'","status = 1", "expiry_datetime = '$expire'"];
					$clause = ["WHERE", "id = @id"];

			        $this->db->update($table, $sets, $clause);
			        $this->db->bindParam("@id", $model[0]->id);
			        $err = $this->db->execute();

					if ($err)
						$this->response->error(array("success" => false,
													 "error" => $err));
					else
						$this->response->success(array("success"     => true ,
													   "user_id"     => $model[0]->id,
													   "facebook_id" => $model[0]->facebook_id,
													   "first_name"  => $first_name,
													   "token"	 	 => $token));
				}
				else
					$this->response->error(array("success" => false));

			}
		}
	}

	public function checktoken()
	{
		header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Headers: *");
        header('Access-Control-Allow-Methods: POST');
        header('Content-Type: application/json');

		$facebook_id = $this->request->params->fb_id;

		$table  = "users";
		$select = "expiry_datetime, status";
		$this->db->select($table, $select);
		$this->db->where("facebook_id", "LIKE", "'$facebook_id'");
		$model  = $this->db->executeReader();
		$expire   = $model[0]->expiry_datetime;

		$datetime_current = new DateTime(date("Y-m-d H:i:s", time()));
		json_encode($datetime_current);
		$current   = $datetime_current->date;
		// $this->response->success($datetime_current);

		if ($current >= $expire && $model[0]->status == 1)
		{
			$sets   = ["status = 0"];
			$clause = ["WHERE", "facebook_id LIKE @fb_id"];

			$this->db->update($table, $sets, $clause);
			$this->db->bindParam("@fb_id", $facebook_id);
			$err = $this->db->execute();
			$this->response->success(array("status" => false,
										   "error"  => "token is expired"));
		}
		else if ($model[0]->status == 0)
		{
			$this->response->success(array("status" => false,
										   "error"  => "token is expired"));
		}
		else if ($current < $expire && $model[0]->status == 1)
		{
			$this->response->success(array("status" => true));
		}
	}

	public function logout()
	{
		header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Headers: *");
        header('Access-Control-Allow-Methods: POST');
        header('Content-Type: application/json');

		$facebook_id = $this->request->params->fb_id;
		$table  = "users";
		$sets   = ["status = 0"];
		$clause = ["WHERE", "facebook_id LIKE @fb_id"];

		$this->db->update($table, $sets, $clause);
		$this->db->bindParam("@fb_id", $facebook_id);
		$err = $this->db->execute();

        if ($err)
	    	$this->response->error(array("success"=>false,
		        					     "error"=>$err));
		else
			$this->response->success(array("success"=>true));
	}

}
?>
