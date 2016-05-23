<?php

/*
 * Class cookie
 *     Interface for the $_COOKIE array
 *
 * static function cookie::exists($name)
 *     Check if there exists a cookie with the name $name
 *     $name: potential index of data in $_COOKIE[]
 *     Returns true if there is data at index $name in $_COOKIE[], else false
 *
 * static function cookie::get($name)
 *     Get the data of the cookie with the name $name
 *     $name: index of data in $_COOKIE[]
 *     Returns data at index $name in $_COOKIE[]
 *
 * static function cookie::put($name, $value, $expiry)
 *     Create a cookie with the data $value and name $name that expires in
 *       $expiry seconds
 *     $name: where to store data in $_COOKIE
 *     $value: data to be stored in $_COOKIE
 *     $expiry: seconds until the cookie expires
 *     Returns true on success, false on failure
 *
 * static function cookie::delete($name)
 *     Delete the cookie with the name $name
 *     $name: name of the cookie to be deleted
 *
*/


class cookie {
    public static function exists($name){
        return isset($_COOKIE[$name]);
    }

    public static function get($name){
        return $_COOKIE[$name]; //might want to sanitize
    }

    public static function put($name, $value, $expiry){
        return setcookie($name, $value, time() + $expiry, '/');
    }

    public static function delete($name){
        self::put($name, '', time() - 1); //always expired
    }
}

?>
