<?php

class user {
    private $_db,
            $_data,
            $_session_name,
            $_cookie_name,
            $_is_logged_in;

    public function __construct($user = null){
        $this->_db = db::getInstance();
        $this->_session_name = config::get('session/session_name');
        $this->_cookie_name = config::get('remember/cookie_name');

        if (!$user){
            if (session::exists($this->_session_name)){
                $user = session::get($this->_session_name);

                if ($this->find($user)){
                    $this->_is_logged_in = true;
                } else {
                    //process logout
                }
            }
        } else {
            $this->find($user);
        }
    }

    public function create($fields = array()){
        return $this->_db->insert('users', $fields);
        //throw new Exception('Something went wrong, please contact an admin.');
    }

    public function update($fields = array(), $id = null){
        if (!$id && $this->isLoggedIn()){
            $id = $this->_data->id;
        }

        if (!$this->_db->update('users', $id, $fields)){
            throw new Exception('There was a problem updating your information.');
        }
    }

    public function updateData($fields = array(), $id = null){
        if (!$id && $this->isLoggedIn()){
            $id = $this->_data->id;
        }

        if (!$db->update('users', $id, $fields)){
            throw new Exception('There was a problem updating your profile.');
        }
    }

    public function find($user = null){
        if ($user){
            $field = (is_numeric($user)) ? 'id' : 'email';
            $data = $this->_db->get('users', array($field, '=', $user));

            if ($data->count()){
                $this->_data = $data->firstResult();
                return true;
            }
        }

        return false;
    }

    public function login($email = null, $password = null, $remember = false){
        if (!$email && !$password && $this->exists()){
            session::put($this->_session_name, $this->_data->id);
        } else {
            $user = $this->find($email);

            if ($user){
                if ($this->_data->password === hash::make($password, $this->_data->salt)){
                    session::put($this->_session_name, $this->_data->id);

                    if ($remember){
                        $hash = hash::unique();
                        $hash_check = $this->_db->get('users_session', array('user_id', '=', $this->_data->id));

                        if (!$hash_check->count()){
                            $this->_db->insert('users_session', array(
                                'user_id' => $this->_data->id,
                                'hash' => $hash
                            ));
                        } else {
                            $hash = $hash_check->firstResult()->hash;
                        }

                        cookie::put($this->_cookie_name, $hash, config::get('remember/cookie_expiry'));
                    }

                    return true;
                }
            }
        }

        return false;
    }

    public function hasPermission($key){
        if ($key === 'logged in'){
            return $this->_is_logged_in;
        } else if ($key === 'activated'){
            return $this->_data->status === 'a' || $this->_data->status === 'i';
        } else if ($key === 'registered'){
            return $this->_data->status === 'a' || $this->_data->status === 'i' || $this->_data->status === 'u';
        } else if ($key === 'active'){ //not to be confused with activated
            return $this->_data->status === 'a';
        } else if ($key === 'ds'){
            return $this->_data->type === 'd' || $this->_data->type === 'a';
        } else if ($key === 'lab'){
            return $this->_data->type === 'l' || $this->_data->type === 'a';
        } else if ($key === 'admin'){
            return $this->_data->type === 'a';
        } else if (is_numeric($key)){
            if ($this->_data->type === 'a') return true;
            $projposals = explode(',', $this->_data->projposals);
            foreach ($projposals as $projposal){
                if (!empty($projposal) && $key == $projposal){
                    return true;
                }
            }
            return false;
        }

        return false; //unknown permission
    }

    public function notHasPermission($key){
        if ($key === 'logged in'){
            return !$this->_is_logged_in;
        } else if ($key === 'activated'){
            return $this->_data->status !== 'a';
        } else if ($key === 'ds'){
            return $this->_data->type !== 'd';
        } else if ($key === 'lab'){
            return $this->_data->type !== 'l';
        } else if ($key === 'admin'){
            return $this->_data->type !== 'a';
        }

        return true; //unknown permission
    }

    public function exists(){
        return !empty($this->_data);
    }

    public function logout(){
        $this->_db->delete('users_session', array('user_id', '=', $this->_data->id));
        session::delete($this->_session_name);
        cookie::delete($this->_cookie_name);
    }

	public function email(){
		return $this->_data->email;
	}

    public function name(){
		return $this->_data->name;
	}

    public function data(){
        return $this->_data;
    }

    public function isLoggedIn(){
        return $this->_is_logged_in;
    }
}

?>
