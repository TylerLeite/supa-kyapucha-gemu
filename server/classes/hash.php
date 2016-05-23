<?php

class hash {
    public static function make($string, $salt = ''){
        return hash('sha256', $string . $salt);
    }
    
    public static function salt($length){
        return mcrypt_create_iv($length, MCRYPT_DEV_RANDOM);
    }
    
    public static function unique(){
        return self::make(uniqid());
    }
}

?>
