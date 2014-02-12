<?php 



class Group extends Basemodel{

	protected $table = 'groups';

	//protected $fillable = array('bookmarkGroup', 'user_id');

	public static $rules=array(
		'bookmarkGroup'=>'required|alpha'
	);


	public function bookmarks()
	{
		return $this->hasMany('Bookmark');
	}

	public static function yourGroups()
	{
		if(Auth::check())
			return static::where('user_id', '=', Auth::user()->id)->get();
	}



}







 ?>