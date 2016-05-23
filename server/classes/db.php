<?php

/*
 * Class db
 *     Handles storing and retrieving data from a mysql database. Uses singleton
 *       design pattern
 *
 * static $_instance: current db object
 * $_pdo: PDO object, stores mysql connection and handles execution of sql queries
 * $_query: current query to be executed
 * $_error: stores whether there was an error with the most recent db operation
 * $_results: associative array containing the most recent results from a query
 * $_count: number of rows that match the most recent query
 *
 * function db::__construct()
 *     Creates a mysql connection based on information from the $GLOBALS array
 *       using the PDO class. Stores the created PDO object in this->$_pdo
 *     No inputs
 *     Changes data member $_pdo
 *     Throws PDOException on error creating the connection
 *
 * static function db::getInstance()
 *     Fetch and / or create the db object that will be used throughout the site
 *     Returns the db object
 *
 * function db::query($sql, $parameters)
 *     Execute an sql query through the PDO object in $_pdo
 *     $sql: prepared sql statement to execute
 *     $parameters: array of values to be inserted into the prepared statement

 * function db::action($action, $table, $where)
 *     Abstraction of db::query to automatically create sql queries given an
 *       action (formatting not applicable to all sql actions), a table to act
 *       on, and a description of what row to affect
 *     $action: what sql action to put into the query, either SELECT * or DELETE
 *     $table: table in the database to act on
 *     $where: 3-element array of format [column, operator, value] that describes
 *       what criteria a row needs to meet to be affected by the query
 *
 * function db::get($table, $where)
 *     Retrieve all rows in $table that fit the criteria described by $where
 *     $table: table in database to be searched through
 *     $where: 3-element array of format [column, operator, value] that describes
 *       what criteria a row needs to meet to be affected by the query
 *

 public function getByID($table, $id){
     return $this->action("SELECT *", $table, array('id', '=', $id))
 }

 public function delete($table, $where){
     return $this->action("DELETE", $table, $where);
 }

*/

class db {
    private static $_instance = null;
    private $_pdo,
            $_query,
            $_error = false,
            $_results,
            $_count = 0;

    private function __construct(){
        try {
            $this->_pdo = new PDO('mysql:host='.config::get('mysql/host').';dbname='.config::get('mysql/db'),
                                   config::get('mysql/username'),
                                   config::get('mysql/password'));
            //$this->_pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING);
        } catch (PDOException $e) {
            die ($e->getMessage());
        }
    }

    public static function getInstance() {
        if (!isset(self::$_instance)){
            self::$_instance = new db();
        }

        return self::$_instance;
    }

    public function query($sql, $parameters = array()){
        $this->_error = false; //initialize error to false

        //prime statement for use by PDO
        if ($this->_query = $this->_pdo->prepare($sql)){
            //bind values to the ?'s in the statement
            if (count($parameters)){
                $n = 1; //start at 1 for PDO, not 0
                foreach ($parameters as $param){
                    //bind nth element of $parameters to nth ? in statement
                    $this->_query->bindValue($n, $param);
                    $n++;
                }
            }

            //attempt to execute the query
            if ($this->_query->execute()){
                //success, store results in respective data memebers
                $this->_results = $this->_query->fetchAll(PDO::FETCH_OBJ);
                $this->_count   = $this->_query->rowCount();
            } else {
                $this->_error = true; //something went wrong
            }
        }

        return $this;
    }

    private function action($action, $table, $where = array()){
        if (count($where) === 3){ //make sure where is valid
            $operators = array('=', '<', '>', '<=', '>=');

            //should really probably sanitize this data
            $field    = $where[0];
            $operator = $where[1];
            $value    = $where[2];

            if (in_array($operator, $operators)){
                $sql = "{$action} FROM {$table} WHERE {$field} {$operator} ?";

                if (!$this->query($sql, array($value))->error()){
                    return $this;
                }
            }
        }

        return false;
    }

    public function get($table, $where){
        return $this->action("SELECT *", $table, $where);
    }

    public function getByID($table, $id){
        return $this->action("SELECT *", $table, array('id', '=', $id));
    }

    public function delete($table, $where){
        return $this->action("DELETE", $table, $where);
    }

    public function insert($table, $fields = array()){
        $keys = array_keys($fields);
        $values = '';

        $x = 1;
        foreach ($fields as $field){
            $values .= '?';
            if ($x < count($fields)){
                $values .= ', ';
            }
            $x++;
        }


        $sql = "INSERT INTO {$table} (`" . implode('`, `', $keys) . "`) VALUES ({$values})";

        if (!$this->query($sql, $fields)->_error){
            return $this->_pdo->lastInsertId();
        }


        return -1;
    }

    public function update($table, $id, $fields){
        $set = '';
        $x = 1;

        foreach ($fields as $name => $value){
            $set .= "{$name} = ?";
            if ($x < count($fields)){
                $set .= ",";
            }

            $x++;
        }

        $sql = "UPDATE {$table} SET {$set} WHERE id = {$id}";

        if (!$this->query($sql, $fields)->error()){
            return true;
        }

        return false;
    }

    public function results(){
        return $this->_results;
    }

    public function firstResult(){
        $res_ = $this->_results;
        if (empty($res_)){
            return NULL;
        }

        return $this->_results[0];
    }

    public function error(){
        return $this->_error;
    }

    public function count(){
        return $this->_count;
    }
}

?>
