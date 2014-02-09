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


}







 ?>