<?php
namespace Api\Controller;

use MrMe\Web\Controller;
use MrMe\Web\Validate as WebValidate;
use Mailgun\Mailgun;
use PHPMailer\PHPMailer;
use PayPal\Api\Amount;
use PayPal\Api\Details;
use PayPal\Api\Item;
use PayPal\Api\ItemList;
use PayPal\Api\Payer;
use PayPal\Api\Payment;
use PayPal\Api\RedirectUrls;
use PayPal\Api\Transaction;
use MrMe\Util\StringFunction;
use Dompdf\Dompdf;
use Dompdf\Options;

class Order extends Controller
{
	public function list()
	{
		header("Access-Control-Allow-Origin: *");
		header("Access-Control-Allow-Headers: POST");  
		header('Access-Control-Allow-Methods: *');
		header('Content-Type: application/json');

		// receive from body
		$offset     = $this->request->body->offset;
		$size       = $this->request->body->size;
        $key        = $this->request->body->key;
        $status     = $this->request->body->status;
        $start_date = $this->request->body->start_date;
        $end_date   = $this->request->body->end_date;

        $status = json_decode($status, true);
        
		$table  = "`order` AS o LEFT JOIN `pickup_place` AS p ON o.pickup_place_id = p.id ";
		$select = ["o.id AS id", "o.package_id AS pkg_id", "o.pickup_place_id AS pu_place_id", 
                   "o.pickup_place_detail AS pu_place_desc, o.hotel_name AS hotel_name",
				   "X(o.location) AS lat", "Y(o.location) AS lng", "o.package_name AS pkg_name",
				   "o.booker_name AS bk_name", "o.booker_contact AS bk_contact", "o.booker_email AS bk_email",
				   "o.booking_date AS bk_date", "o.adult AS adult", "o.child AS child", "o.infant AS infant", 
                   "o.remark AS remark", "o.paid AS paid", 
                   "CAST((o.paid + o.outstanding) AS UNSIGNED )AS paid_chg", "o.outstanding AS `out`",
                   "o.status AS `status`", "o.code AS code", "o.timestamp AS `timestamp`", "o.pickup_time AS pu_time"];

		// $clause = [];

  //       if (count($_REQUEST) > 1)
  //           array_push($clause, "WHERE");

  //       if (!empty($key))
  //       {
           
  //           array_push($clause, "(o.package_name REGEXP  '^.*".$key."' 
  //                              OR o.booker_name REGEXP  '^.*".$key."'
  //                              OR o.booker_contact REGEXP '^.*".$key."'
  //                              OR o.booker_email REGEXP '^.*".$key."' ) ", "AND");
  //       }

  //       if (count($status) > 0)
  //       {
  //           $c = "(o.status = " . implode(" OR o.status = ", $status) . ")";
  //           array_push($clause, $c, "AND");
  //       }

  //       if (!empty($start_date) AND !empty($end_date))
  //       {
  //           $c = "(o.booking_date >= '$start_date' AND o.booking_date <= '$end_date')";
  //           array_push($clause, $c, "AND");
  //       }

		$this->db->select($table, $select);
        if (!empty($key))
        {
            $this->db->where("(o.package_name",  "REGEXP", "'^.*".$key."'")
                     ->or    ('o.booker_name',   "REGEXP", "'^.*".$key."'")
                     ->or    ('o.booker_contact',"REGEXP", "'^.*".$key."'")
                     ->or    ('o.booker_email',  "REGEXP", "'^.*".$key."')");
        }

        if (count($status) > 0)
        {
            $this->db->and("(o.status", "=" , $status[0]);

            for ($i = 1; $i < count($status); $i++)
                $this->db->or("o.status", "=" , $status[$i]);
            
            $this->db->bracket(')');
            
        }

        if (!empty($start_date) AND !empty($end_date))
        {
            $this->db->and("(o.booking_date", ">=", "'$start_date'")
                     ->and(" o.booking_date", "<=", "'$end_date')");
        }

        $this->db->order('`timestamp`', 'DESC')
                 ->limit($offset, $size);

     
        $tmp_clause = $this->db->getClause();
		$model = $this->db->executeReader();
		
		foreach($model as $i => $m)
		{
			if (!empty($m->paid))
				$model[$i]->paid = (double)$m->paid;

			if (!empty($m->outstanding)) 
				$model[$i]->outstanding = (double)$m->outstanding;
		}

		$this->db->select('`order` AS o', "COUNT(id) AS count", $tmp_clause);
		$cntResult = $this->db->executeReader();

		$response = array();
		$response['success'] = true;
		$response['orders'] = $model;
		$response['count'] = count($cntResult) > 0 ? $cntResult[0]->count : 0;
		$this->response->success($response);
	}

    public function export()
    {
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Headers: POST");  
        header('Access-Control-Allow-Methods: *');
        header("Pragma: no-cache");
        header("Expires: 0");

        // receive from body
        $offset     = $this->request->body->offset;
        $size       = $this->request->body->size;
        $key        = $this->request->body->key;
        $status     = $this->request->body->status;
        $start_date = $this->request->body->start_date;
        $end_date   = $this->request->body->end_date;

        $status = json_decode($status, true);
        
        $table  = "`order` AS o LEFT JOIN `pickup_place` AS p ON o.pickup_place_id = p.id ";
        $select = ["o.id AS id", "o.package_id AS pkg_id", "o.pickup_place_id AS pu_place_id", 
                   "o.pickup_place_detail AS pu_place_desc, o.hotel_name AS hotel_name",
                   "X(o.location) AS lat", "Y(o.location) AS lng", "o.package_name AS pkg_name",
                   "o.booker_name AS bk_name", "o.booker_contact AS bk_contact", "o.booker_email AS bk_email",
                   "o.booking_date AS bk_date", "o.adult AS adult", "o.child AS child", "o.infant AS infant", 
                   "o.remark AS remark", "o.paid AS paid", 
                   "CAST((o.paid + o.outstanding) AS UNSIGNED )AS paid_chg", "o.outstanding AS `out`",
                   "o.status AS `status`", "o.code AS code", "o.timestamp AS `timestamp`", "o.pickup_time AS pu_time"];

        $this->db->select($table, $select);
        if (!empty($key))
        {
            $this->db->where("(o.package_name",  "REGEXP", "'^.*".$key."'")
                     ->or    ('o.booker_name',   "REGEXP", "'^.*".$key."'")
                     ->or    ('o.booker_contact',"REGEXP", "'^.*".$key."'")
                     ->or    ('o.booker_email',  "REGEXP", "'^.*".$key."')");
        }

        if (count($status) > 0)
        {
            $this->db->and("(o.status", "=" , $status[0]);
            
            for ($i = 1; $i < count($status); $i++)
                $this->db->or("o.status", "=" , $status[$i]);
            
            $this->db->bracket(')');
            
        }

        if (!empty($start_date) AND !empty($end_date))
        {
            $this->db->and("(o.booking_date", ">=", "'$start_date'")
                     ->and(" o.booking_date", "<=", "'$end_date')");
        }

         $this->db->order('`timestamp`', 'DESC')
                  ->limit($offset, $size);

     
        $tmp_clause = $this->db->getClause();
        $model = $this->db->executeReader();
        
        foreach($model as $i => $m)
        {
            if (!empty($m->paid))
                $model[$i]->paid = (double)$m->paid;

            if (!empty($m->outstanding)) 
                $model[$i]->outstanding = (double)$m->outstanding;
        }

        $excel = new \PHPExcel();
        $excel->setActiveSheetIndex(0);

        $excel->getActiveSheet()->getStyle("A1:N1")->getFont()->setBold(true);

        // Add some data
        $excel->setActiveSheetIndex(0)
              ->setCellValue('A1', 'Code')
              ->setCellValue('B1', 'Status')
              ->setCellValue('C1', 'Package Name')
              ->setCellValue('D1', 'Booker Name')
              ->setCellValue('E1', 'Phone Number')
              ->setCellValue('F1', 'Email')
              ->setCellValue('G1', 'Date')
              ->setCellValue('H1', 'Pickup Place')
              //->setCellValue('I1', 'Location')
              ->setCellValue('I1', 'Adult')
              ->setCellValue('J1', 'Children')
              ->setCellValue('K1', 'Infant')
              ->setCellValue('L1', 'Paid')
              ->setCellValue('M1', 'Outstanding')
              ->setCellValue('N1', 'Total Price');


      
        for($col = 'A'; $col !== 'O'; $col++) {
            $excel->getActiveSheet()
                  ->getColumnDimension($col)
                  ->setAutoSize(true);
        }                                                     

        foreach ($model as $row => $items)
        {
           
            $excel->setActiveSheetIndex(0)
                  ->setCellValue('A'.($row+2), $items->code)
                  ->setCellValue('B'.($row+2), "Paid")
                  ->setCellValue('C'.($row+2), $items->pkg_name)
                  ->setCellValue('D'.($row+2), $items->bk_name)
                  ->setCellValue('E'.($row+2), $items->bk_contact)
                  ->setCellValue('F'.($row+2), $items->bk_email)
                  ->setCellValue('G'.($row+2), $items->bk_date)
                  ->setCellValue('H'.($row+2), $items->hotel_name)
                 // ->setCellValue('I'.($row+2), $items->lat ." ". $items->lng)
                  ->setCellValue('I'.($row+2), $items->adult)
                  ->setCellValue('J'.($row+2), $items->child)
                  ->setCellValue('K'.($row+2), $items->infant)
                  ->setCellValue('L'.($row+2), $items->paid)
                  ->setCellValue('M'.($row+2), $items->out)
                  ->setCellValue('N'.($row+2), (double)$items->paid_chg);

            // foreach ($items as $key => $data)
            // {              
            //     // $cell = chr(ord('A') + ($col++)) . ($row + 2);
            //     // $excel->setActiveSheetIndex(0)->setCellValue($cell, $data);

            // }
            
        }

        // Rename worksheet
        $excel->getActiveSheet()->setTitle('Order');

        // Set active sheet index to the first sheet, so Excel opens this as the first sheet
        $excel->setActiveSheetIndex(0);
        //$this->load->library('PHPExcel/PHPExcel_IOFactory');
        //$filename = "temp/";
        $filename.= "oex_" . date('mdysmh') . '.xls';

        $writer = \PHPExcel_IOFactory::createWriter($excel, 'Excel5');
       //$writer->save($filename);
        ob_end_clean();
        header("Content-Type: application/vnd.ms-excel");
        header("Content-Disposition: attachment; filename=" . $filename);
        $writer->save("php://output");
        

    }

	public function add()
	{
		header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Headers: *");  
        header('Access-Control-Allow-Methods: POST');
        header('Content-Type: application/json');

        // receive from params
        $package_id        = $this->request->params->package;

        // receive from body
        $pickup_place_id   = $this->request->body->pu_place_id;
        $pickup_place_desc = $this->request->body->pu_place_desc;
        $pickup_time       = $this->request->body->pu_time;
        $lat               = $this->request->body->lat;
        $lng               = $this->request->body->lng;
        $package_name      = $this->request->body->pkg_name;
        $booker_name       = $this->request->body->bk_name;
        $booker_contact    = $this->request->body->bk_contact;
        $booker_email      = $this->request->body->bk_email;
        $booking_date      = $this->request->body->bk_date;
        $hotel_name        = $this->request->body->hotel_name;
        //$amount            = $this->request->body->amt;
        $adult             = $this->request->body->adult;
        $child             = $this->request->body->child;
        $infant            = $this->request->body->infant;
        $remark            = $this->request->body->remark;
        $paid              = $this->request->body->paid;

        WebValidate::isNumber($adult, "adult must more than 1 person.");
        WebValidate::isNumber($package_id, "package must be number.");
        WebValidate::isEmpty ($booker_name, "bk_name cannot empty.");
        WebValidate::isEmpty ($booker_contact, "bk_contact cannot empty.");
        WebValidate::isEmail ($booker_email, "bk_email incorrect format.");
        WebValidate::isEmpty ($booking_date, "bk_date cannot empty.");
        WebValidate::isNumber($paid, "paid must be number.");

        // select hotel_name 
        $table = "pickup_place";
        $select = ["hotel_name"];
        $clause = ["WHERE", "id = @pickup_place_id"];
        $this->db->select($table, $select, $clause);
        $this->db->bindParam("@pickup_place_id", $pickup_place_id);
        $result = $this->db->executeReader();
        $model = $result[0];
        if ($model)
        {
            $hotel_name = $model->hotel_name;
        }

        $select = ["adult_price", "child_price", "infant_price", 
                   "adult_price_opt", "child_price_opt", "infant_price_opt", "flag"];
        $this->db->select('`package`', $select, "WHERE id = @id");
        $this->db->bindParam("@id", $package_id);
        $packageModel = $this->db->executeReader();
     
        if (count($packageModel) == 0)
        {

        	$this->response->success(array("status" => false,
        								   "message" => "package not found."));
        }

        $package = $packageModel[0];
        $full_price = $adult  * $package->adult_price;
        $full_price+= $child  * $package->child_price;
        $full_price+= $infant * $package->infant_price;
        
        switch ($paid) {
        	case 1:
                $paid = $adult  * $package->adult_price_opt;
                $paid+= $child  * $package->child_price_opt;
                $paid+= $infant * $package->infant_price_opt;
        		break;
        	
        	default:
        		 $paid = $full_price;
        		break;
        }

        //$outstanding = (($adult + $child) * $package->price) - $paid;
        $outstanding =  $full_price - $paid;
        $table = "`order`";
        $field = ["package_id", "pickup_place_id", "pickup_place_detail", "pickup_time", "location", 
        	      "package_name", "booker_name", "booker_contact", "booker_email", "booking_date",
                  "adult", "child", "infant", "remark", "paid", "outstanding", "hotel_name"];
        //var_dump($field);
        $value = ["@package_id", 
        		  empty($pickup_place_id)   ? null : "@pickup_place_id",
        		  empty($pickup_place_desc) ? null : "@pickup_place_detail",
        		  empty($pickup_time)       ? null : "@pickup_time",
        		  $lat + $lng == 0          ? null : "POINT ($lat, $lng)",
        		  empty($package_name)      ? null : "@package_name",
        		  "@booker_name",
        		  "@booker_contact", 
        		  "@booker_email", 
        		  "@booking_date", 
        		  empty($adult)             ? null : "@adult",
                  empty($child)             ? null : "@child",
                  empty($infant)            ? null : "@infant", 
        		  empty($remark)            ? null : "@remark",
        		  empty($paid)              ? null : "@paid",
        		  "@outstanding",
                  empty($hotel_name)        ? null : "@hotel_name"];

        $this->db->insert($table, $field, $value);
        $this->db->bindParam("@package_id", $package_id);
        $this->db->bindParam("@pickup_place_id", $pickup_place_id);
        $this->db->bindParam("@pickup_place_detail", $pickup_place_desc);
        $this->db->bindParam("@pickup_time", $pickup_time);
        $this->db->bindParam("@lat", $lat);
        $this->db->bindParam("@lng", $lng);
        $this->db->bindParam("@package_name", $package_name);
        $this->db->bindParam("@booker_name", $booker_name);
        $this->db->bindParam("@booker_contact", $booker_contact);
        $this->db->bindParam("@booker_email", $booker_email);
        $this->db->bindParam("@booking_date", $booking_date);
        $this->db->bindParam("@adult", $adult);
        $this->db->bindParam("@child", $child);
        $this->db->bindParam("@infant", $infant);
        $this->db->bindParam("@remark", $remark);
        $this->db->bindParam("@paid", $paid);
        $this->db->bindParam("@outstanding", $outstanding);
        $this->db->bindParam("@hotel_name", $hotel_name);

        $err = $this->db->execute();
        if ($err)
        	$this->response->success(array("status" => false,
        								   "error" => $err));

        $insertId = $this->db->getLastInsertId();

        switch ($package->flag) {
			case 1:
				$code = sprintf("CM%06d-%s", $insertId, date('dmY'));
				break;
			case 2:
				$code = sprintf("PK%06d-%s", $insertId, date('dmY'));
				break;
			default:
				$code = sprintf("VT%06d-%s", $insertId, date('dmY'));
				break;
		}

		$update_model = array("code" => $code);
		$this->db->update("`order`", ["code = @code"], "WHERE id = @id");
		$this->db->bindParam("@code", $code);
		$this->db->bindParam("@id", $insertId);
		$err = $this->db->execute();


        $paypal_link = $this->createPayment($code, $paid);

		if ($err)
			$this->response->error(array("success" => false,
										 "error" => $err));
		else
			$this->response->success(array("success" => true,
				  						   "code" => $code,
                                           "link" => $paypal_link));
	}

	public function edit()
	{
		    header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Headers: *");  
        header('Access-Control-Allow-Methods: POST');
        header('Content-Type: application/json');

        // receive from params
        $order_id         = $this->request->params->id;
        $code             = $this->request->params->code; 

        // receive from body
        $package_id        = $this->request->body->pkg_id;
        $pickup_place_id   = $this->request->body->pu_place_id;
        $pickup_place_desc = $this->request->body->pu_place_desc;
        $pickup_time       = $this->request->body->pu_time;
        $lat               = $this->request->body->lat;
        $lng               = $this->request->body->lng;
        $package_name      = $this->request->body->pkg_name;
        $booker_name       = $this->request->body->bk_name;
        $booker_contact    = $this->request->body->bk_contact;
        $booker_email      = $this->request->body->bk_email;
        $booking_date      = $this->request->body->bk_date;
        $adult             = $this->request->body->adult;
        $child             = $this->request->body->child;
        $infant            = $this->request->body->infant;
        $remark            = $this->request->body->remark;
        $paid              = $this->request->body->paid;
        $paid_change       = $this->request->body->paid_chg;
        $hotel_name        = $this->request->body->hotel_name;

        if (empty($code))
            WebValidate::isNumber($order_id, "id must be number.");

        $table = "`order`";
        $sets  = [empty($package_id)        ? null : "package_id = @package_id",
        		  empty($pickup_place_id)   ? null : "pickup_place_id = @pickup_place_id",
        		  empty($pickup_place_desc) ? null : "pickup_place_detail = @pickup_place_desc",
        		  empty($pickup_time)       ? null : "pickup_time = @pickup_time",
        		  $lat + $lng == 0          ? null : "location = POINT($lat, $lng)",
        		  empty($package_name)      ? null : "package_name = @package_name",
        		  empty($booker_name)       ? null : "booker_name = @booker_name",
        		  empty($booker_contact)    ? null : "booker_contact = @booker_contact",
        		  empty($booker_email)      ? null : "booker_email = @booker_email",
        		  empty($booking_date)      ? null : "booking_date = @booking_date",
                  empty($adult)             ? null : "adult = @adult",
                  empty($child)             ? null : "child = @child",
        		  empty($infant)            ? null : "infant = @infant",
        		  empty($remark)            ? null : "remark = @remark",
                  empty($paid)              ? null : "paid = @paid",
                  empty($paid_change)       ? null : "paid_change = @paid_change",
                  empty($hotel_name)        ? null : "hotel_name = @hotel_name"];

        if (!empty($code))
            $clause = "WHERE code = @code";
        else
            $clause = "WHERE id = @id";
        
        $this->db->update($table, $sets, $clause);
        $this->db->bindParam("@package_id", $package_id);
        $this->db->bindParam("@pickup_place_id", $pickup_place_id);
        $this->db->bindParam("@pickup_place_desc", $pickup_place_desc);
        $this->db->bindParam("@pickup_time", $pickup_time);
        $this->db->bindParam("@lat", $lat);
        $this->db->bindParam("@lng", $lng);
        $this->db->bindParam("@package_name", $package_name);
        $this->db->bindParam("@booker_name", $booker_name);
        $this->db->bindParam("@booker_contact", $booker_contact);
        $this->db->bindParam("@booker_email", $booker_email);
        $this->db->bindParam("@booking_date", $booking_date);
        $this->db->bindParam("@adult", $adult);
        $this->db->bindParam("@child", $child);
        $this->db->bindParam("@infant", $infant);
        $this->db->bindParam("@remark", $remark);
        $this->db->bindParam("@hotel_name", $hotel_name);
        $this->db->bindParam("@paid", $paid);
        $this->db->bindParam("@paid_change", $paid_change);
        $this->db->bindParam("@id", $order_id);
        $this->db->bindParam("@code", $code);
        $err = $this->db->execute();

        if ($err)
			$this->response->error(array("success" => false,
										 "error" => $err));
		else
        {
            if (!empty($code))
            {
                $paypal_link = $this->createPayment($code, $paid);

                if ($err)
                    $this->response->error(array("success" => false,
                                                 "error" => $err));
                else
                    $this->response->success(array("success" => true,
                                                   "code" => $code,
                                                   "link" => $paypal_link));
            }
            else
            {
                $this->response->success(array("success" => true));
            }
			
        }

	}

	public function confirm()
	{
		header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Headers: *");  
        header('Access-Control-Allow-Methods: *');
        header('Content-Type: application/json');

         // receive from params
        $id = $this->request->params->id;

        WebValidate::isNumber($id, "id must be number.");
        $this->db->update('`order`', ["status = @status"], "WHERE id = @id");
        $this->db->bindParam("@status", 3);
        $this->db->bindParam("@id", $id);
        $err = $this->db->execute();

        if ($err)
        	$this->response->error(array("success"=>false,
        								 "error"=>$err));
        else
        	$this->response->success(array("success"=>true));
	}

	public function cancel()
	{
		header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Headers: *");  
        header('Access-Control-Allow-Methods: *');
        header('Content-Type: application/json');

         // receive from params
        $id = $this->request->params->id;

        WebValidate::isNumber($id, "id must be number.");
        $this->db->update('`order`', ["status = @status"], "WHERE id = @id");
        $this->db->bindParam("@status", 2);
        $this->db->bindParam("@id", $id);
        $err = $this->db->execute();

        if ($err)
        	$this->response->error(array("success"=>false,
        								 "error"=>$err));
        else
        	$this->response->success(array("success"=>true));
	}

	public function delete()
	{
		header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Headers: *");  
        header('Access-Control-Allow-Methods: POST');
        header('Content-Type: application/json');

        // receive from params
        $id    = $this->request->params->id;
        $redir = $this->request->params->redir;

        WebValidate::isNumber($id, "id must be number.");
        $this->db->delete('`order`', "WHERE id = @id");
        $this->db->bindParam("@id", $id);

        $err = $this->db->execute();

        if ($redir)
        {
            header("Location: http://www.ejsforpayment.com/ejs/front-end/#/home");
        }
        else
        {
            if ($err)
                $this->response->error(array("success"=>false,
                                         "error"=>$err));
            else
                $this->response->success(array("success"=>true));
        }
		
	}

    public function paid()
    {
        $base_url = $this->_CONFIG['COMMON']['BASE_URL'];
        $id       = $this->request->params->id;
        $paid     = $this->request->params->paid;

        $CONFIG = $this->_CONFIG;
        if (empty($CONFIG)) 
            $this->response->error(array("success"=>false,
                                         "error"=>"No email information setting."));
        $table  = "`order`";
        $sets   = ["status = 1"];
        $clause = ["WHERE", "id = @id"];

        $this->db->update($table, $sets, $clause);
        $this->db->bindParam("@id", $id);
        $err = $this->db->execute();

        $this->db->select("`order`", ["booker_email", "code"], "WHERE id = $id");
        $emailModel = $this->db->executeReader();
        $success = $this->sendConfirmationEmail($id, $paid);

        if ($success)
        {
            header("Location: http://www.ejsforpayment.com/ejs/front-end/#/success");
        }
        else
        {
            header("Location: http://www.ejsforpayment.com/ejs/front-end/#/home");
        }
    }

    private function createPayment($code, $paid)
    {
        $table  = "`order` AS o INNER JOIN `package` AS p ON o.package_id = p.id ";
        $table .= "LEFT JOIN `pickup_place` as pu ON o.pickup_place_id = pu.id";
        $select = ["o.adult AS adult, o.child AS child, o.infant AS infant",
                   "p.adult_price AS adult_price", "p.child_price", "p.infant_price",
                   "p.adult_price_opt AS adult_price_opt", "p.child_price_opt AS child_price_opt",
                   "p.infant_price_opt AS infant_price_opt", "pu.price AS pickup_price",
                   "pu.hotel_name AS hotel_name", "o.id AS id"];
        $clause = ["WHERE", "o.code = @code"];

        $this->db->select($table, $select, $clause);
        $this->db->bindParam("@code", $code);
        $result = $this->db->executeReader();
        $model = $result[0];
        if (!$model) return 0;

        $apiContext = new \PayPal\Rest\ApiContext(
            new \PayPal\Auth\OAuthTokenCredential(
                'AYw5AHFOrsaIc4ewU9vu881VjCN8m9vNvJN-WtjbfQre-IhksFY1i7wWMUXjMbqqj2KRYuhBKv-vO5Ct',     // ClientID
                'EDRIlRm-HRs2ysEzRSJIMKJDDmql0-MgKfGsoE1MkHUrosFhm33WT-LABUj9GwtawzdQjaxRFxVoI0u9'      // ClientSecret
            )
        );

        $adult_price  = $paid == 1 ? $model->adult_price_opt  : $model->adult_price;
        $child_price  = $paid == 1 ? $model->child_price_opt  : $model->child_price;
        $infant_price = $paid == 1 ? $model->infant_price_opt : $model->infant_price;

        $total_price = ($model->adult  * $adult_price) +
                       ($model->child  * $child_price) +
                       ($model->infant * $infant_price);

        $payer = new Payer();
        $payer->setPaymentMethod("paypal");

        $items = array();

        if ($model->adult && $adult_price)
        {
            $item = new Item();
            $item->setName("Adult");
            $item->setCurrency("THB");
            $item->setQuantity($model->adult);
            $item->setSku("Adult Package Price");
            $item->setPrice($adult_price);
            array_push($items, $item);
        }
       
        if ($model->child && $child_price)
        {
            $item = new Item();
            $item->setName("Child");
            $item->setCurrency("THB");
            $item->setQuantity($model->child);
            $item->setSku("Child Package Price");
            $item->setPrice($child_price);
            array_push($items, $item);
        }

        if ($model->infant && $infant_price)
        {
            $item = new Item();
            $item->setName("Infant");
            $item->setCurrency("THB");
            $item->setQuantity($model->infant);
            $item->setSku("Infant Package Price");
            $item->setPrice($infant_price);
            array_push($items, $item);

        }

        //var_dump($model);
        if ($model->pickup_price)
        {
            $item = new Item();
            $item->setName("Service Charge");
            $item->setCurrency("THB");
            $item->setQuantity(1);
            $item->setSku("Hotel name : " . $model->hotel_name);
            $item->setPrice($model->pickup_price);
            $total_price += $model->pickup_price;

            array_push($items, $item);

            //var_dump($items);
        }

        $itemList = new ItemList();

        $itemList->setItems($items);

        // $detail = new Details();
        // $detail->setShipping(1.2);
        // $detail->setTax(1.3);
        // $detail->setSubtotal(17.50);

        $amount = new Amount();
        $amount->setCurrency("THB")
            ->setTotal($total_price);
            //->setDetails($detail);

        $transaction = new Transaction();
        $transaction->setAmount($amount)
            ->setItemList($itemList)
            ->setDescription("Payment description")
            ->setInvoiceNumber(uniqid());

        $redirectUrls = new RedirectUrls();
        $successUrl = "http://" . $this->_CONFIG['COMMON']['BASE_URL'] . "api2/order/paid/id/"   . $model->id . "/paid/" . $paid;
        $cancelUrl  = "http://" . $this->_CONFIG['COMMON']['BASE_URL'] . "api2/order/delete/id/" . $model->id . "/redir/1";
        $redirectUrls->setReturnUrl($successUrl)
            ->setCancelUrl($cancelUrl);

        $payment = new Payment();
        $payment->setIntent("sale")
            ->setPayer($payer)
            ->setRedirectUrls($redirectUrls)
            ->setTransactions(array($transaction));

        $request = clone $payment;

        try 
        {       
            $payment->create($apiContext);
        } 
        catch (Exception $ex) 
        {
            ResultPrinter::printError("Created Payment Using PayPal. Please visit the URL to Approve.", "Payment", null, $request, $ex);
            exit(1);
        }

        $approvalUrl = $payment->getApprovalLink();

        //var_dump($approvalUrl);

        return $approvalUrl;
    }

    private function sendConfirmationEmail($id, $paid = 1)
    {
        // $id = "106";
        // $paid = 1;

        $table  = "`order` AS o INNER JOIN `package` AS p ON o.package_id = p.id ";
        $table .= "LEFT JOIN `pickup_place` as pu ON o.pickup_place_id = pu.id";
        $select = ["o.adult AS adult, o.child AS child, o.infant AS infant",
                   "p.adult_price AS adult_price", "p.child_price", "p.infant_price",
                   "p.adult_price_opt AS adult_price_opt", "p.child_price_opt AS child_price_opt",
                   "p.infant_price_opt AS infant_price_opt", "pu.price AS pickup_price",
                   "pu.hotel_name AS hotel_name", "o.id AS id", "o.code AS code", "p.name AS package_name",
                   "o.paid AS paid", "o.booker_name AS booker_name", "o.booking_date AS booking_date", 
                   "o.outstanding AS outstanding", 
                   "o.booker_email AS booker_email", "o.pickup_place_detail AS pickup_place_desc",
                   "o.pickup_time AS pickup_time"];
       // $clause = ["WHERE", "o.id = @id"];

        $this->db->select($table, $select)
                 ->where("o.id", "=", "@id");

        $this->db->bindParam("@id", $id);
        $result = $this->db->executeReader();
        $model = $result[0];

        if (!$model) return 0;
     
        $booking_id   = $model->code;
        $booking_date = strtotime($model->booking_date);
        $booking_date = date('l j F Y', $booking_date);
        $pickup_time  = $model->pickup_time;
        $booker_name  = $model->booker_name;
        $booker_email = $model->booker_email;
        $adult        = $model->adult;
        $child        = $model->child;
        $infant       = $model->infant; 
        $package_name = $model->package_name;
        $adult_price  = $paid == 1 ? $model->adult_price_opt  : $model->adult_price;
        $child_price  = $paid == 1 ? $model->child_price_opt  : $model->child_price;
        $infant_price = $paid == 1 ? $model->infant_price_opt : $model->infant_price;

        $total_adult_price = ($adult_price * $model->adult);
        $total_child_price = ($child_price * $model->child);
        $total_infant_price = ($infant_price * $model->infant);

        $total_price = $total_adult_price + $total_child_price + $total_infant_price + $model->pickup_price;

        $amount = $model->child + $model->infant + $model->adult;
        $service_charge = $model->pickup_price;
        $pickup_place = !empty($model->hotel_name) ? $model->hotel_name : $model->pickup_place_desc;
        $html = 
$html =
<<< HTML_PDF_TEMPLATE1

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" "http://www.w3.org/TR/REC-html40/loose.dtd">
<!-- saved from url=(0145)https://trello-attachments.s3.amazonaws.com/57861c58c8bc1ac579185d4c/58196c33a5d12d81d7c19cb1/4c7d07e74c056114d3f44382a254c8ba/summary_email.html -->
<html style="font-family: sans-serif; color: #343b57; margin: 0; padding: 0;"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
</head>
<body style="font-family: sans-serif; color: #343b57; font-size: 100%; background-color: #fafae2; margin: 0; padding: 2em 0 0;" bgcolor="#fafae2"><div class="summary_revised" style="font-family: sans-serif; color: #343b57; width: 90%; margin: 0 auto; padding: 0;">
  <article class="body" style="font-family: sans-serif; color: #343b57; margin: 0; padding: 0;">
    <table style="font-family: sans-serif; color: #343b57; width: 100%; margin: 0; padding: 0;">
      <tbody><tr style="font-family: sans-serif; color: #343b57; margin: 0; padding: 0;">
        <td style="font-family: sans-serif; color: #343b57; margin: 0; padding: 0;">
          <table class="header" style="font-family: sans-serif; color: #343b57; width: 100%; margin: 0; padding: 0;">
            <tbody style="font-family: sans-serif; color: #343b57; margin: 0; padding: 0;">
              <tr class="descript" style="font-family: sans-serif; color: #343b57; text-align: center; margin: 0; padding: 0;" align="center">
                <td colspan="3" style="font-family: sans-serif; color: #343b57; margin: 0; padding: 0;">
                  <h1 style="font-family: sans-serif; color: #f26907; font-size: 4em; margin: 0; padding: 0;">Thank you!</h1>
                  <p style="font-family: sans-serif; color: #404040; margin: 1em 0 3.5em; padding: 0;">I'm pleased to receipt of your booking as follows.</p>
                  <h2 style="font-family: sans-serif; color: #f26907; margin: 0; padding: 0;">YOUR BOOKING DETAILS
                </h2>
</td>
              </tr>
              <tr class="details" style="font-family: sans-serif; color: #343b57; margin: 0; padding: 0;">
                <td style="font-family: sans-serif; color: #343b57; margin: 0; padding: 0 0 .3em;">
                  <p class="head" style="font-family: sans-serif; color: #343b57; font-size: 1em; font-weight: bold; margin: 0; padding: .2em 0 0;">Booking Reference Number :</p>
                  <p style="font-family: sans-serif; color: #343b57; font-size: 1.1em; margin: 0; padding: .2em 0 0;">$booking_id</p>
                </td>
                <td style="font-family: sans-serif; color: #343b57; margin: 0; padding: 0 0 .3em;">
                  <p class="head" style="font-family: sans-serif; color: #343b57; font-size: 1em; font-weight: bold; margin: 0; padding: .2em 0 0;">Date :</p>
                  <p style="font-family: sans-serif; color: #343b57; font-size: 1.1em; margin: 0; padding: .2em 0 0;">$booking_date</p> 
                </td>
                <td style="font-family: sans-serif; color: #343b57; margin: 0; padding: 0 0 .3em;">
                  <p class="head" style="font-family: sans-serif; color: #343b57; font-size: 1em; font-weight: bold; margin: 0; padding: .2em 0 0;">Pickup Time :</p>
                  <p style="font-family: sans-serif; color: #343b57; font-size: 1.1em; margin: 0; padding: .2em 0 0;">$pickup_time</p>
                  <small style="font-family: sans-serif; color: #343b57; margin: 0; padding: 0;">(Please be ready at your hotel lobby at 06.30 am)</small>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
      <tr style="font-family: sans-serif; color: #343b57; margin: 0; padding: 0;">
        <td style="font-family: sans-serif; color: #343b57; margin: 0; padding: 0;">
          <table class="package" cellspacing="0" style="font-family: sans-serif; color: #343b57; width: 100%; border-bottom-width: 2px; border-bottom-color: #000000; border-bottom-style: solid; margin: 0 0 20px; padding: 0 0 10px;">
            <thead style="font-family: sans-serif; color: #343b57; margin: 0; padding: 0;">
              <tr style="font-family: sans-serif; color: #343b57; margin: 0; padding: 0;">
                <th style="font-family: sans-serif; color: #f26907; font-size: 1.3em; text-align: left; border-top-width: 2px; border-top-color: #000000; border-top-style: solid; border-bottom-width: 2px; border-bottom-color: #000000; border-bottom-style: solid; margin: 0; padding: .5em 0 .55em;" align="left">PACKAGE</th>
                <th style="font-family: sans-serif; color: #f26907; font-size: 1.3em; text-align: left; border-top-width: 2px; border-top-color: #000000; border-top-style: solid; border-bottom-width: 2px; border-bottom-color: #000000; border-bottom-style: solid; margin: 0; padding: .5em 0 .55em;" align="left">PRICE</th>
                <th style="font-family: sans-serif; color: #f26907; font-size: 1.3em; text-align: left; border-top-width: 2px; border-top-color: #000000; border-top-style: solid; border-bottom-width: 2px; border-bottom-color: #000000; border-bottom-style: solid; margin: 0; padding: .5em 0 .55em;" align="left">QUANTITY</th>
                <th style="font-family: sans-serif; color: #f26907; font-size: 1.3em; text-align: left; border-top-width: 2px; border-top-color: #000000; border-top-style: solid; border-bottom-width: 2px; border-bottom-color: #000000; border-bottom-style: solid; margin: 0; padding: .5em 0 .55em;" align="left">TOTAL PRICE</th>
              </tr>
            </thead>
            <tbody style="font-family: sans-serif; color: #343b57; margin: 0; padding: 0;">
HTML_PDF_TEMPLATE1;

if ($adult)
$html.= 
<<< HTML_PDF_TEMPLATE2
              <tr style="font-family: sans-serif; color: #343b57; margin: 0; padding: 0;">
                <td style="font-family: sans-serif; color: #343b57; font-size: 1.15em; margin: 0; padding: 10px 0 0;">
                  <p class="head" style="font-family: sans-serif; color: #343b57; font-size: 1.1em; font-weight: bold; margin: 0; padding: 0;">$package_name( Adult )</p>
                  <p style="font-family: sans-serif; color: #343b57; font-size: .7em; margin: 0; padding: 0;">Ages 25 and up</p>  
                </td>
                <td style="font-family: sans-serif; color: #343b57; font-size: 1.15em; margin: 0; padding: 10px 0 0;">
                  $adult_price
                </td>
                <td style="font-family: sans-serif; color: #343b57; font-size: 1.15em; margin: 0; padding: 10px 0 0;">
                  $adult
                </td>
                <td style="font-family: sans-serif; color: #343b57; font-size: 1.15em; margin: 0; padding: 10px 0 0;">
                  $total_adult_price
                </td>
              </tr>
HTML_PDF_TEMPLATE2;

if ($child)
$html.=
<<< HTML_PDF_TEMPLATE3
              <tr style="font-family: sans-serif; color: #343b57; margin: 0; padding: 0;">
                <td style="font-family: sans-serif; color: #343b57; font-size: 1.15em; margin: 0; padding: 10px 0 0;">
                  <p class="head" style="font-family: sans-serif; color: #343b57; font-size: 1.1em; font-weight: bold; margin: 0; padding: 0;">$package_name( Children )</p>
                  <p style="font-family: sans-serif; color: #343b57; font-size: .7em; margin: 0; padding: 0;">Ages 10 and up</p>  
                </td>
                <td style="font-family: sans-serif; color: #343b57; font-size: 1.15em; margin: 0; padding: 10px 0 0;">
                  $child_price
                </td>
                <td style="font-family: sans-serif; color: #343b57; font-size: 1.15em; margin: 0; padding: 10px 0 0;">
                  $child
                </td>
                <td style="font-family: sans-serif; color: #343b57; font-size: 1.15em; margin: 0; padding: 10px 0 0;">
                  $total_child_price
                </td>
              </tr>
HTML_PDF_TEMPLATE3;

if ($infant)
$html.=
<<< HTML_PDF_TEMPLATE4
              <tr style="font-family: sans-serif; color: #343b57; margin: 0; padding: 0;">
                <td style="font-family: sans-serif; color: #343b57; font-size: 1.15em; margin: 0; padding: 10px 0 0;">
                  <p class="head" style="font-family: sans-serif; color: #343b57; font-size: 1.1em; font-weight: bold; margin: 0; padding: 0;">$package_name( Infant )</p>
                  <p style="font-family: sans-serif; color: #343b57; font-size: .7em; margin: 0; padding: 0;">Ages 10 and below</p>  
                </td>
                <td style="font-family: sans-serif; color: #343b57; font-size: 1.15em; margin: 0; padding: 10px 0 0;">
                  $infant_price
                </td>
                <td style="font-family: sans-serif; color: #343b57; font-size: 1.15em; margin: 0; padding: 10px 0 0;">
                  $infant
                </td>
                <td style="font-family: sans-serif; color: #343b57; font-size: 1.15em; margin: 0; padding: 10px 0 0;">
                  $total_infant_price
                </td>
              </tr>
HTML_PDF_TEMPLATE4;

$html.=
<<< HTML_PDF_TEMPLATE5
            </tbody>
          </table>
        </td>
      </tr>
      <tr style="font-family: sans-serif; color: #343b57; margin: 0; padding: 0;">
        <td style="font-family: sans-serif; color: #343b57; margin: 0; padding: 0;">
          <table class="footer" cellspacing="0" style="font-family: sans-serif; color: #343b57; width: 100%; margin: 0; padding: 0;">
            <tbody><tr style="font-family: sans-serif; color: #343b57; margin: 0; padding: 0;">
              <td class="your_detail" style="font-family: sans-serif; color: #343b57; margin: 0; padding: 0 0 20px;">
                <h2 style="font-family: sans-serif; color: #f26907; font-size: 1.4em; margin: 0; padding: 0 0 .2em;">YOUR DETAIL</h2>
                <ul style="font-family: sans-serif; color: #343b57; list-style-type: none; margin: 0; padding: 0;">
                  <li style="font-family: sans-serif; color: #343b57; margin: 0; padding: .11em 0;">Name: $booker_name</li>
                  <li style="font-family: sans-serif; color: #343b57; margin: 0; padding: .11em 0;">Amount People: $amount pax</li>
                  <li ng-switch="" on="summary.hotel.name || &#39;null&#39;" style="font-family: sans-serif; color: #343b57; margin: 0; padding: .11em 0;">Place to pick up: 
                    <i ng-switch-when="null" style="font-family: sans-serif; color: #343b57; margin: 0; padding: 0;">-</i>
                    <i ng-switch-default="" style="font-family: sans-serif; color: #343b57; margin: 0; padding: 0;">$pickup_place</i>
                  </li>
                  <li style="font-family: sans-serif; color: #343b57; margin: 0; padding: .11em 0;">Email: $booker_email</li>
                </ul>
              </td>
              <td class="sum" style="font-family: sans-serif; color: #343b57; vertical-align: top; border-bottom-style: solid; border-bottom-width: 1px; border-bottom-color: #000; margin: 0; padding: 0;" valign="top">
                <section style="font-family: sans-serif; color: #343b57; margin: 0; padding: 0;">
                  <table cellspacing="0" style="font-family: sans-serif; color: #343b57; width: 100%; margin: 0; padding: 0;">
                    <tbody><tr class="service_charge" style="font-family: sans-serif; color: #343b57; text-align: center; font-weight: bold; margin: 0; padding: 0;" align="center">
                      
                      <td style="font-family: sans-serif; color: #343b57; border-bottom-style: solid; border-bottom-width: 1px; border-bottom-color: #000; margin: 0; padding: .6em 0;">
                        SERVICE CHARGE
                      </td>
                      <td class="money" style="font-family: sans-serif; color: #343b57; text-align: right; font-size: 1em; border-bottom-style: solid; border-bottom-width: 1px; border-bottom-color: #000; margin: 0; padding: .6em 0;" align="right">
                        $service_charge
                      </td>
                    </tr>
                    <tr class="balance" style="font-family: sans-serif; color: #343b57; text-align: center; font-weight: bold; font-size: 1.4em; margin: 0; padding: 0;" align="center">
                      <td style="font-family: sans-serif; color: #343b57; margin: 0; padding: .6em 0;">
                        BALANCE
                      </td>
                      <td class="money orange" style="font-family: sans-serif; color: #f26907; text-align: right; font-size: 1em; margin: 0; padding: .6em 0;" align="right">$total_price</td>
                    </tr>
                  </tbody></table>
                    <p style="font-family: sans-serif; color: #343b57; text-align: right; font-size: .8em; margin: 0; padding: 0;" align="right">(The balance can be paid by both cash and card on the departure date)</p>
                  
                </section>
              </td>
            </tr>
            <tr style="font-family: sans-serif; color: #343b57; margin: 0; padding: 0;">
              <td class="what_to_bring" style="font-family: sans-serif; color: #343b57; margin: 0; padding: 0;">
                <article style="font-family: sans-serif; color: #343b57; width: 80%; margin: 0; padding: 0;">
                  
                  
                  <h2 style="font-family: sans-serif; color: #f26907; font-size: 1.4em; margin: 0; padding: 0 0 .2em;">
                    WHAT TO BRING               
                  </h2>
                  <p style="font-family: sans-serif; color: #343b57; margin: 0; padding: 0;">Change of clothes and some good shoes/sandals that you don't mind getting wet/dry Sunscreen/Hat/Towel/insect repellent</p>
                  <section class="e_ticket" style="font-family: sans-serif; color: #343b57; margin: 0; padding: .4em 0 0;">
                    <h3 style="font-family: sans-serif; color: #343b57; font-weight: normal; font-size: 1em; margin: 0; padding: 0;">Your E-ticket</h3>
                    <p style="font-family: sans-serif; color: #f26907; margin: 0; padding: 0;">Simply open the attachment,print the tickets and present your tickets to the driver</p>
                  </section>
                </article>
              </td>
            </tr>
          </tbody></table>
        </td>
      </tr>
    </tbody></table>
  </article>
  <footer style="font-family: sans-serif; color: #343b57; margin: 0; padding: 2em 0;">
    <table style="font-family: sans-serif; color: #343b57; width: 100%; margin: 0; padding: 0;">
      <tbody style="font-family: sans-serif; color: #343b57; margin: 0; padding: 0;">
        <tr style="font-family: sans-serif; color: #343b57; margin: 0; padding: 0;">
          <td style="font-family: sans-serif; color: #343b57; margin: 0; padding: 0;">
            address...
          </td>
          <td style="font-family: sans-serif; color: #343b57; margin: 0; padding: 0;">
            <img src="http://ejsforpayment.com/ejs/front-end/images/logo_footer.png" style="font-family: sans-serif; color: #343b57; margin: 0; padding: 0;">
          </td>
          <td style="font-family: sans-serif; color: #343b57; margin: 0; padding: 0;">

          </td>
        </tr>
      </tbody>
    </table>
  </footer>
</div>

<div id="techsmith-snagitchrome-extension"></div></body></html>
HTML_PDF_TEMPLATE5;
        $dompdf = new Dompdf();


        //$dompdf->loadHtml($html);
        //$dompdf->loadHtml_fo
       // $file = file_get_contents('http://www.ejsforpayment.com/ejs/front-end/#/booking/16');
        // (Optional) Setup the paper size and orientation
        //$dompdf->setPaper('A4', 'portrait');
        $dompdf->load_html($html);
        $options = new Options();
        $options->setIsRemoteEnabled(true);

        $dompdf->setOptions($options);
        // Render the HTML as PDF
        $dompdf->render();

        // Output the generated PDF to Browser
        //$dompdf->stream();

        $output = $dompdf->output();
        $atth_path = 'temp/email'.date('mdys').'.pdf';
        file_put_contents($atth_path, $output);

        //echo $html;
        
        $CONFIG = $this->_CONFIG;
        if (empty($CONFIG)) 
            $this->response->error(array("success"=>false,
                                         "error"=>"No email information setting."));
        $mail = new \PHPMailer();
        $mail->isSMTP();    
        //$mail->SMTPDebug = 2;
        $mail->SMTPAuth   = $CONFIG['SMTP']['AUTH'];          // Set mailer to use SMTP
        $mail->Host       = $CONFIG['SMTP']['HOST'];          // Specify main backup                               
        $mail->Username   = $CONFIG['SMTP']['USERNAME'];      // SMTP username
        $mail->Password   = $CONFIG['SMTP']['PASSWORD'];      // SMTP password
        $mail->SMTPSecure = $CONFIG['SMTP']['SECURE'];        // Enable encryption, only 'tls' is accepted
        $mail->IsHTML(true);
        $mail->From = 'supanut.pgs@gmail.com';
        $mail->FromName = 'Elephant Jungle Sanctury';
        $mail->addAddress($model->booker_email); 
        $mail->addAttachment($atth_path, "Boarding Pass.pdf");
        //$mail->addAddress("elecwebmaker@gmail.com");
        
        $mail->WordWrap = 1000;                                 

        $body = "<b>Dear $booker_name</b> ,<br>";
        $body.= "Thank you for confirming with us.<br>";
        $body.= "Please find your booking confirmation details in the attachment.<br><br>";
        $body.= "<b>Best Regards,</b><br>";
        $body.= "<b>EJS</b>";
              
        $mail->Subject = "Elephant Jungle Santury Confirmation Order";
        $mail->Body    = $body;
        if(!$mail->send()) 
        {
            return false;
        }

        if (file_exists($atth_path))
          unlink($atth_path);
        return true;
    }

}
?>