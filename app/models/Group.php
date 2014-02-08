<?php 



class Group extends Basemodel{

	protected $table = 'groups';

	protected $fillable = array('group', 'user_id');

	public static $rules=array(
		'group'=>'required|alpha'
	);





}







 ?>