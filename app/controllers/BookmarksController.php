<?php 

class BookmarksController extends BaseController{


	public function __construct(){
		$this->beforeFilter('auth', array('on'=>'post'));
	}


	public function postRating()
	{
		$rate = new Rating;
		$rate->rating = Input::get('rating');
		$rate->save();
	}

	public function postNew()
	{
		$bookmark = new Bookmark;
		$bookmark->title = Input::get('title');
		$bookmark->link = Input::get('link');
		$bookmark->user_id = Auth::user()->id;
		$bookmark->group_id= Input::get('group_id');
		$bookmark->stars= Input::get('stars');
		$bookmark->save();
		$insertedId = $bookmark->id;
		echo $insertedId;
	}
	public function postUpdate()
	{
		$bookmark = new Bookmark;
		$bookmark->title = Input::get('title');
		$bookmark->link = Input::get('link');
		$bookmark->user_id = Auth::user()->id;
		$bookmark->group_id= Input::get('group_id');
		$bookmark->stars= Input::get('stars');
		$bookmark->save();
	}
	public function postDelete()
	{

	}

}







 ?>