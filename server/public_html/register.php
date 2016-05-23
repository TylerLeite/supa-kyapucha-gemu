<?php

require_once '../core/init.php';
req::once('functions/rand_pass.php');

$user = new user();
if ($user->hasPermission('logged in')){
    redirect::to('index.php');
}

if (input::exists()){
    $validate = new validate();
    $validate->check($_POST, array(
        'email' => array(
            'required' => true,
            'min' => 2,
            'max' => 32,
            'unique' => 'users',
            'email' => true
        ),

        'password' => array(
            'required' => true,
            'min' => 6,
            'max' => 32
        ),

        'confirmation' => array(
            'required' => true,
            'matches' => 'password'
        )
    ));

    if ($validate->passed()){
        $user = new user();
        $salt = hash::salt(32);
        $activation_code = random_code(16);
        $activation_hash = hash::make($activation_code);

        try {
            $id = $user->create(array(
                'email'    => input::get('email'),
                'type'     => input::get('account_type'),
                'status'   => 'u',
                'password' => hash::make(input::get('password'), $salt),
                'salt'     => $salt,
                'activation_code' => $activation_hash
            ));

            mail(input::get('email'), 'Thank you for registering with MyBasket',
                    'To activate your account, go here: ' . config::get('site_url') . '/activate.php?code=' .
                    $activation_code . '&user=' . input::get('email'));

            $db = db::getInstance();
            if (input::get('account_type') === 'l'){
                $db->insert('lab_user_data', array(
                    'user_id' => $id
                ));

            } else if (input::get('account_type') === 'd'){
                $db->insert('ds_user_data', array(
                    'user_id' => $id
                ));
            }
        } catch(Exception $e){
            die($e->getMessage());
        }
    }
}

?>
