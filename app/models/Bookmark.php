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
			->orderBy('created_at', 'desc')->paginate(60);
	}

		public static function yourBookmarksWithOutPagination()
	{
		if(Auth::check())
			return static::where('user_id', '=', Auth::user()->id)
			->orderBy('created_at', 'desc')->get();
	}

	public static function yourBookmarksByGroup($id)
	{
		if(Auth::check())
			return static::where('user_id', '=', Auth::user()->id)
					->where('group_id', '=', $id)
					->orderBy('created_at', 'desc')
					->get();
	}

	public static function search($keyword)
	{
		if(Auth::check())
			return static::where('user_id', '=', Auth::user()->id)
						->where('title', 'LIKE', '%'.$keyword.'%')
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