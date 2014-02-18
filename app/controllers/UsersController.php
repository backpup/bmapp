<?php 

class Userscontroller extends BaseController{


	public function __construct()
	{
		$this->beforeFilter('csrf', array('only'=>array('postCreate', 'postLogin', 'postSearch')));
	}

	public function getIndex()
	{
		return View::make('home.index')
			->with('title', 'Your Bookmarks')
			->with('bookmarks', Bookmark::yourBookmarks())
			->with('groups', Group::yourGroups());
	}
/* mark for deletion */
	public function getResults($keyword)
	{
		return View::make('home.results')
			->with('title', 'Your Search Results')
			->with('bookmarks', Bookmark::search($keyword))
			->with('groups', Group::yourGroups());
	}
/* mark for deletion */
	public function postSearch()
	{
		$keyword = Input::get('search');
		if(empty($keyword))
		{
			return Redirect::route('home');
		}
		return Redirect::to('results/'.$keyword);
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
			$user = User::where('username', '=', Input::get('username'))->first();
			$group = new Group;
			$group->bookmarkGroup = 'general';
			$group->user_id = $user->id;
			$group->save();
			Auth::login($user);
			return Redirect::route('home');
						
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
			return Redirect::route('home');

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
			return Redirect::route('home');
		}else{
			return Redirect::route('home');
		}
	}


}





 ?>