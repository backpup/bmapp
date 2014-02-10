<?php 

class Userscontroller extends BaseController{


	public function __construct()
	{
		$this->beforeFilter('csrf', array('only'=>array('postCreate', 'postLogin')));
	}

	public function getIndex()
	{
		return View::make('home.index')
			->with('title', 'Bookmark Now Yoo')
			->with('bookmarks', Bookmark::yourBookmarks());
	}

	public function postCreate()
	{
		$validation = User::validate(Input::all());

		if($validation->passes())
		{
			User::create(array(
				'username'=>Input::get('username'),
				'password'=>Hash::make(Input::get('password')),
				'email'=>Input::get('email')
			));

			return Redirect::route('home')
						->with('msg', 'Thanks for registering! You can now log in');
		}else{

			return Redirect::route('register')->withErrors($validation)->withInput();
		}

	}

	public function getNew()
	{
		return View::make('users.new')->with('title', 'Register now');
	}

	public function postLogin()
	{
		$user = array(
			'username'=>Input::get('username'),
			'password'=>Input::get('password')
		);
		if(Auth::attempt($user))
		{
			return Redirect::route('home')
				->with('msg', 'You are now logged in');

		}else{
			return Redirect::route('home')
				->with('msg', 'Your username/password combination was incorrect')
				->withInput();
		}
	}

	public function getLogout()
	{
		if(Auth::check())
		{
			Auth::logout();
			return Redirect::route('home')->with('msg', 'You are now logged out');
		}else{
			return Redirect::route('home');
		}
	}


}





 ?>