<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the Closure to execute when that URI is requested.
|
*/


App::error(function (Exception $exception, $code)
{	
	$errorArray = ['400'=>'Bad Request', '401'=>'Unauthorized', '403'=>'Forbidden', '404'=>'Page Not Found', '500'=>'Not found'];
	$error = array('code'=>$code, 'text'=>$errorArray[$code]);
	return Response::view('layouts.error', $error, $error['code']);
});


Route::get('/', array('as'=>'home', 'uses'=>'UsersController@getIndex'));
Route::get('/testride', array('uses'=>'UsersController@getLogin'));

Route::get('register', array('as'=>'register', 'uses'=>'UsersController@getNew'));
Route::get('logout', array('uses'=>'UsersController@getLogout'));
//Route::get('login', array('uses'=>'UsersController@getLoginPage'));

Route::post('/', array('uses'=>'UsersController@postLogin'));
Route::post('register', array('uses'=>'UsersController@postCreate'));
Route::post('search', array('uses'=>'UsersController@postSearch'));


// Route::get('testthis', function(){
// 	//return Bookmark::where('id','=',1)->get(array('title'));
// 	// $group = new Group;
// 	// $group->bookmarkGroup = 'general';
// 	// $group->user_id = '1';
// 	// $group->save();
// 		// $bookmark = new Bookmark;
// 		// $bookmark->title = 'hello';
// 		// $bookmark->link = 'http://helloworld.com';
// 		// $bookmark->user_id = '1';
// 		// $bookmark->group_id= '2';
// 		// $bookmark->stars= 4;
// 		// $bookmark->save();
// 	return Bookmark::search('red');
// });

/* App Controller */
Route::controller('action', 'BookmarksController');