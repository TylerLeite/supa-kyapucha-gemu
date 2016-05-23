<?php

$owner = 'tyler';

//default to live server values
// When we have a server, fill this out
$site_root ='';
$site_url = '';
$host = '';
$username = 'admin';
$password = '';

if ($owner === 'live'){
    session_save_path('/tmp');
} else {
    ini_set('display_errors',1);
    ini_set('display_startup_errors',1);
    error_reporting(-1);

    if ($owner === 'tyler'){
        $site_root ='/var/www/sdd/server';
        $site_url = 'http://localhost/skgserver/public_html';
        $host = 'localhost';
        $username = 'root';
        $password = 'alpine';
    }
}

session_start();

$GLOBALS['config'] = array(
    'mysql' => array(
        'host' => $host,
        'username' => $username,
        'password' => $password,
        'db' => 'seqhub'
    ),

    'remember' => array(
        'cookie_name' => 'remember_me',
        'cookie_expiry' => 604800
    ),

    'session' => array(
        'session_name' => 'user',
        'token_name' => 'token'
    ),

    'site_url' => $site_url,
    'site_root' => $site_root,

    'owner' => $owner
);

spl_autoload_register(function($class){
	// Handle local dependencies with a chainsaw, not a scalpel
    require_once $GLOBALS['config']['site_root'] . '/classes/' . $class . '.php';
});

require_once config::get('site_root') . '/functions/sanitize.php';

if (cookie::exists(config::get('remember/cookie_name')) && !session::exists(config::get('session/session_name'))) {
    $hash = cookie::get(config::get('remember/cookie_name'));
    $hash_check = db::getInstance()->get('users_session', array('hash', '=', $hash));

    if ($hash_check->count()){
        $user = new user($hash_check->firstResult()->user_id);
        $user->login();
    }
}

?>
