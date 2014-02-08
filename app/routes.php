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

Route::get('/', array('as'=>'home', function()
{
	return View::make('home.index')->with('title', 'Bookmark Now Yo');
}));

Route::get('register', array('as'=>'register', 'uses'=>'UsersController@getNew'));
Route::get('logout', array('uses'=>'UsersController@getLogout'));

Route::post('/', array('uses'=>'UsersController@postLogin'));
Route::post('register', array('uses'=>'UsersController@postCreate'));