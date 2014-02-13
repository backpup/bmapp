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
		$bookmark = Bookmark::find(Input::get('id'));
		$bookmark->title = Input::get('title');
		$bookmark->link = Input::get('link');
		$bookmark->user_id = Auth::user()->id;
		$bookmark->group_id= Input::get('group_id');
		$bookmark->stars= Input::get('stars');
		$bookmark->save();
	}
	public function postDelete()
	{
		Bookmark::destroy(Input::get('id'));

	}

	public function postNewGroup()
	{
		header("Cache-Control: no-cache");
		header("Pragma: no-cache");
		header("Ajax-Response-Type: application/json");
		$group = new Group;
		$group->bookmarkGroup = Input::get('group');
		$group->user_id = Auth::user()->id;
		$group->save();
		$insertedId=json_encode(['grpId'=>$group->id, 'group'=>$group->bookmarkGroup]);
		echo $insertedId;
	}



}







 ?>