<?php

/*
 * Class validate
 *     Checks whether submitted data fits a set of criteria, outputs errors so
 *       the user can correct any mistakes and submit a proper form
 *
 * $_passed: whether the latest data passsed meets all validation criteria
 * $_errors: list of error messages produced based on incorrect input
 * $_db: current database object
 *
 * static function validate::__construct()
 *     Set $_db data member to current database
 *
 * function validate::check($src, $items)
 *     Take an array of data to be validated (e.g. $_POST) and check whether
 *       element fit criteria specified by $items. Each criterion manually
 *       defined within validate::check()
 *     $src: associative array of data to be validated
 *     $items: criteria to judge $src by, shares keys with $src
 *     Pushes messages to $_errors if any criterion is not met, sets $_passed to
 *       true if there were no errors, else false
 *
 * function addError($error)
 *     Push $error to $_errors array
 *     $error: Error message telling the user what needs to be corrected
*/


req::once('functions/email_validate.php');

class validate{
    private $_passed = false,
            $_errors = array(),
            $_db = null;

    public function __construct(){
        $this->_db = db::getInstance();
    }

    public function check($src, $items = array()){
        foreach ($items as $item => $rules){
            foreach ($rules as $rule => $rule_value){
                $value = $src[$item];
                $item = str_replace('-', ' ', escape($item));

                if ($rule === 'required' && (empty($value) || $value == '')){
                    $this->addError("{$item} cannot be left blank");
                } else if (!empty($value)){
                    switch($rule){
                        case 'email':
                            //if (!preg_match('^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$^', $value)){
                            //    $this->addError("The email address is not valid");
                            //}
                            if (!validEmail($value)){
                                $this->addError("The email address is not valid");
                            }
                            break;
                        case 'min':
                            if (strlen($value) < $rule_value){
                                $this->addError("{$item} must be at least {$rule_value} characters long.");
                            }
                            break;
                        case 'max':
                            if (strlen($value) > $rule_value){
                                $this->addError("{$item} may be no more than {$rule_value} characters long.");
                            }
                            break;
                        case 'matches':
                            if ($value != $src[$rule_value]){
                                $this->addError("{$rule_value} and {$item} must match.");
                            }
                            break;
                        case 'unique':
                            $check = $this->_db->get($rule_value, array($item, '=', $value));
                            if ($check->count()){
                                $this->addError("{$item} is taken.");
                            }
                            break;
                        case 'alpha':
                            if (is_numeric($value)){
                                $this->addError("{$item} must contain at least one letter.");
                            }
                            break;
                        case 'spam':
                            if (!empty($value)){
                                $this->addError("Error code 007: Spam");
                            }
                            break;
                        case 'not':
                            if ($value == $rule_value){
                                $this->addError("{$item} cannot be \"{$rule_value}\"");
                            }
                            break;
                    }
                }
            }
        }

        $err_ = $this->_errors;
        if (empty($err_)){
            $this->_passed = true;
        } else {
            $this->_passed = false;
        }
    }

    private function addError($error){
        $this->_passed = false;
        $this->_errors[] = $error;
    }

    public function errors(){
        return $this->_errors;
    }

    public function passed(){
        return $this->_passed;
    }
}

?>
