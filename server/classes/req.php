<?php
//ignore this
//*
class req {
    public static function once($filen){
        require_once(config::get('site_root') . '/' . $filen);
    }

    public static function inc($filen){
        $filen = config::get('site_root') . '/public_html/' . $filen;
        //$filen = str_replace('/', '\\', $filen); //comment out for unix fs
        include_once $filen;
    }

    public static function ahref($filen, $inside){
        echo '<a href=' . config::get('site_root') . '/public_html/' . $filen . '>' . $inside . '</a>';
    }
}

 //*/

?>
