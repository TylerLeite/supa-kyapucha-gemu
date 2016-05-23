<?php

/*
 * Class token
*/

class token{
    public static function generate(){
        return session::put(config::get('session/token_name'), md5(uniqid()));
    }

    public static function check($token){
        $token_name = config::get('session/token_name');

        if (session::exists($token_name) && $token === session::get($token_name)){
            session::delete($token_name);
            return true;
        } else {
            return false;
        }
    }
}

?>
