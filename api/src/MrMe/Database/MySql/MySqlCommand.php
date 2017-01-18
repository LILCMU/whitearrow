<?php
namespace MrMe\Database\MySql;

use Exception;
use MrMe\Util\Util as Util;
use MrMe\Util\StringFunc as StringFunc;

class MySqlCommand
{
	private $clause_     = false;
	private $logic       = false;
	private $sql_clause_ = "";
	private $sql         = "";
	private $limit_      = "";

	public  $params;
	public  $connection;
	public  $logger;

	public function __construct($connection = null, $logger = null)
	{
		$this->params = array();
		$this->connection = $connection;
		$this->logger = $logger;
	}

	public function __destruct()
	{
		unset($this->sql);
		unset($this->params);
	}

	public function bindParam($key, $value)
	{
		//echo $this->sql;
		preg_match_all("/@.[\w]*/", $this->sql.$this->sql_clause_, $keywords);
		if (count($keywords) == 0) return;
		//var_dump($keywords);
		$index = array_search($key, $keywords[0]);
		// echo "<br>-------index------"; var_dump($index);
		// echo "<br>-------key----------"; var_dump($key);
		// echo "<br>-------value-----------"; var_dump($value);
		if (gettype($index) != "boolean")
		{
			$value = empty($value) ? "" : $value;
			$this->params[$index] = $value;
			//var_dump($this->params);
		}
		ksort($this->params);

	}

	public function getLastInsertId()
	{
		return $this->connection->getLastInsertId();
	}

	public function execute()
	{
		if (!$this->connection) return array("message" => "No connection !");

		$this->sql.=$this->sql_clause_.$this->limit_;

		$prepareStatement = "";
		$prepareStatement = preg_replace("/@.[\w]*/", "?", $this->sql);

		if (empty($prepareStatement))
			$prepareStatement = $this->sql;

		$params = array();
		$params[0] = $prepareStatement;
		if (count($this->params) > 0)
			$params = array_merge($params, $this->params);


		//var_dump($params);
		$err = Util::callFunction($this->connection, 'query', $params);
		$this->reset();
		return $err;
	}

	public function executeReader()
	{
		if (!$this->connection) return array("message" => "No connection !");

		$this->sql.=$this->sql_clause_.$this->limit_;

		$prepareStatement = "";
		$prepareStatement = preg_replace("/@.[\w]*/", "?", $this->sql);
		//echo ">> $prepareStatement <<";
		if (empty($prepareStatement))
			$prepareStatement = $this->sql;

		$params = array();
		$params[0] = $prepareStatement;
		if (count($this->params) > 0)
			$params = array_merge($params, $this->params);

		$err = Util::callFunction($this->connection, 'query', $params);
		if ($err) die(json_encode($err));

		$model = $this->connection->readAll();

		$model = json_encode($model);
		$model = json_decode($model);
		$this->reset();
		return $model;
	}

	public function select($table, $fields = "*", $clause = null, $offset = 0, $size = 0)
	{
		if (gettype($fields) === "array")
		{
			$fields = implode($fields, ",");
		}

		//if (count($clause) == 0) $clause = null;
		$sql = "SELECT $fields FROM $table ";
		if (gettype($clause) === "array")
		{
			foreach ($clause as $i => $c)
			{
				if ((!empty($clause[$i + 1]) OR $i % 2 == 1) AND StringFunc::startWith("ORDER", $clase[$i+1]))
					$sql.= "$c ";

			}
		}
		else
		{
			$sql.= $clause;
		}

		if ($size > 0)
			$sql.= "LIMIT $offset, $size ";

		$this->sql = $sql;

		return $this;
	}

	public function where($field, $opt, $value)
	{
		$sql = "";
		if (!empty($value))
		{
			if (!$this->clause_)
			{
				$sql.= " WHERE ";
				$this->clause_ = true;
			}
			$sql.= "$field $opt $value ";
		}

		$this->sql_clause_.= $sql;

		return $this;
	}

	public function bracket($brkt)
	{
		//echo $this->clause_;
		if (!$this->clause_)
		{
			$this->sql_clause_.= " WHERE ";
			$this->clause_ = true;
		}
		$this->sql_clause_.=" $brkt ";
		if (StringFunc::startWith($brkt, "("))
			$this->logic_ = false;
		return $this;
	}

	public function or($field = "", $opt = "", $value = "")
	{
		if (!empty($value))
		{
			if ($this->logic_)
				$this->sql_clause_.= " OR $field $opt $value ";
			else
				$this->where($field, $opt, $value);
		}
		$this->logic_ = true;
		return $this;
	}

	public function and($field = "", $opt = "", $value = "")
	{
		if (!empty($value))
		{
			if ($this->logic_)
				$this->sql_clause_.= " AND $field $opt $value ";
			else
				$this->where($field, $opt, $value);
		}
		$this->logic_ = true;
		return $this;
	}

	public function limit($offset, $size)
	{
		if ($offset + $size > 0)
		{
			$this->limit_ .= " LIMIT $offset, $size ";
		}
		return $this;
	}

	public function order($field, $type)
	{
		$this->sql_clause_.= " ORDER BY $field $type ";
		return $this;
	}

	public function getClause()
	{
		return $this->sql_clause_;
	}

	public function setClause($clause)
	{
		$this->sql_clause_ = $clause;
	}

	public function insert($table, $field = [], $value = [])
	{
		if (count($field) > 0 && count($value) > 0)
		{
			foreach ($value as $i => $val)
			{
				if (empty($val))
				{
					unset($field[$i]);
					unset($value[$i]);
				}
			}

			$field = implode($field, ",");
			$value = implode($value, ",");
		}
		$sql = "INSERT INTO $table ($field) VALUES ($value) ";
		$this->sql = $sql;
	}

	public function update($table, $sets = [], $clause = NULL)
	{
		foreach ($sets as $i => $s)
			if (empty($s)) unset($sets[$i]);

		$sets = implode($sets, ',');
		$sql = "UPDATE $table SET $sets ";

		if (gettype($clause) === "array")
		{
			foreach ($clause as $i => $c)
			{
				if (!empty($clause[$i + 1]) || $i % 2 == 1)
					$sql.= "$c ";

			}
		}
		else
		{
			$sql.= $clause;
		}


		$this->sql = $sql;
	}

	public function delete($table, $clause = NULL)
	{
		$sql = "DELETE FROM $table $clause";
		$this->sql = $sql;
	}

	private function reset()
	{
		$this->sql = 0;
		$this->sql_clause_ = "";
		$this->limit_ = "";
		$this->params = array();
		$this->clause_ = false;
		$this->logic_  = false;
	}

}
?>
