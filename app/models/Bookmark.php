<?php 

class Bookmark extends Basemodel{
	protected $table = "bookmarks";

	protected $fillable=array(
		'title', 'link', 'description', 'user_id', 'group_id', 'stars'
	);
	public static $rules=array(
		'title'=>'required|max:255',
		'link'=>'required|max:255',
		'description'=>'required|max:255',
	);

	public static function yourBookmarks()
	{
		if(Auth::check())
			return static::where('user_id', '=', Auth::user()->id)->get();
	}
}




 ?>