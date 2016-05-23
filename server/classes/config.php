<?php
/*
 * Class config
 *     interface for the $GLOBALS array
 *
 * static function config::get($path)
 *     Retrieve the data from $GLOBALS array specified by $path
 *     $path: '/'-separated index of data in $GLOBALS
 *     Returns data specified by $path from the $GLOBALS array
 *
*/

class config {
    public static function get($path = null){
        if ($path){
            $config = $GLOBALS['config'];
            $path = explode('/', $path);

            foreach ($path as $part){
                if (isset($config[$part])){
                    $config = $config[$part];
                } else {
                    return false;
                }
            }

            return $config; //maybe should sanitize, unsure
        } else {
            return false;
        }
    }
}

?>
