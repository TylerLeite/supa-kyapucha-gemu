<?php

require_once '../core/init.php';

$user = new user();
if ($user->hasPermission('logged in')){
	redirect::to('index.php');
}

if (input::exists()){
	if (token::check(input::get('token'))){
		//make sure $_POST has all the required fields filled out
		$validate = new validate();
		$validation = $validate->check($_POST, array(
			'email' => array('required' => true),
			'password' => array('required' => true)
		));

		if ($validate->passed()){
			$user = new user();

			//check if the login session should be stored
			$remember = input::get('remember') == 'on';
			//login
			$login = $user->login(input::get('email'), input::get('password'), $remember);

			if ($login){
				//TODO: make sure user has permission to log in (activated and not banned)
				if ($user->data()->status == 'u'){
					$user->logout();
				} else if ($user->data()->status == 'b') {
					$user->logout();
				} else {
					// success
				}
			}
		}
	}
}

?>
