<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateBookmarksTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('bookmarks', function($table){
			$table->increments('id');
			$table->string('title');
			$table->string('link');
			$table->string('description');
			$table->integer('user_id');
			$table->integer('group_id');
			$table->index(array('user_id', 'group_id'));
			$table->smallInteger('stars')->unsigned();
			$table->timestamps();
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('bookmarks');
	}

}
