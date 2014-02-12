<?php 

class Bookmark extends Basemodel{
	protected $table = "bookmarks";

	protected $fillable=array(
		'title', 'link', 'description', 'user_id', 'group_id', 'stars'
	);
	public static $rules=array(
		'title'=>'required|max:255',
		'link'=>'required|max:255'
	);

	public static function yourBookmarks()
	{
		if(Auth::check())
			return static::where('user_id', '=', Auth::user()->id)
			->orderBy('created_at', 'desc')
			->get();
	}
	

	public function group()
	{
		return $this->belongsTo('Group');
	}

	public function user()
	{
		return $this->belongsTo('User');
	}
}




 ?>