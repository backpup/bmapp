@extends('layouts.default')

@section('content')

@if(!Auth::check())

<div class="loginPrompt">
	
	<h2>Please register and login to start using the app</h2>
	<p>If you do not want to register and simply test the app just sign in with the following credentials:</p>
	<div class="credentials">
		<ul>
			<li>JohnDoe</li>
			<li>password</li>
		</ul>
	</div>
</div><!--end loginPrompt-->
@else
<div id ="bookmarksView">
	
<div id="bookmarks-header">
	<div id="header-info">
			
	</div><!--header-info end-->
	<div id="header-controls">
			<span class="bmAddBtn">
  					<i class="fa fa-plus fa-lg"></i>
			</span>
	</div><!--header-controls end-->

</div><!--bookmarks-header end-->
<div id="bookmark-adder">
<!-- 	<span class="btnContainer">

	</span> -->
</div><!--bookmark-adder end-->
<div id="bookmarks-body">
<?php $counter=1 ?>
@foreach($bookmarks as $bookmark)

	<div class="row" id="bookmark_{{ $bookmark->id }}">
		<span class="num">{{ $counter }}.</span>
		<a href="{{ $bookmark->link }}" target="_blank">
			<span class="title">{{ $bookmark->title }}</span>
		</a>
		<span class="stars">
			<span class="ratingList" id='ratingList{{ $counter }}'data-rating="{{ $bookmark->stars }}">
			<?php
				$stars = (int)$bookmark->stars;
				for($i=1; $i<=5; $i++)
				{
					if($i <= $stars)
						echo '<i class="fa tara fa-star"></i>';
					else
						echo '<i class="fa tara fa-star-o"></i>';
				}

			 ?>
			 </span>
		</span>
		<span class="group">{{ $bookmark->group_id }}</span>
		<span class="btn blue edit">Edit</span>
		<span class="btn red delete"><i class="fa fa-times fa-lg"></i></span>
	</div>
<?php $counter++; ?>
@endforeach
<!-- <form action="">
<div class="row">
	<input type="text" class="num" disabled>
	<input type="text" class="title" id="text">
	<input type="text" class="stars">
	<select name="group" id="" class="group">
		<option value="Hello">hello</option>
		<option value="World">world</option>
	</select>
	<a href="" class="btn green save">Save</a>
</div>
</form> -->
</div><!--bookmarks-body end-->

</div><!--bookmarksView end-->

















@endif
@endsection