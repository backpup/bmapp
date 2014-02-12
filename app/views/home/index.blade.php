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
<!-- 			<span class="grpForm">

				<input type="text" placeholder = "group name..." size="14" class = "grpInput"/>
				<span class="btn green"><i class="fa fa-save"></i></span>
				<span class="btn red"><i class="fa fa-trash-o"></i></span>
				
			</span> -->
			<span id="grpAddBtn">
				<!-- <i class="fa fa-plus fa-lg"></i> -->
				Add <i class="fa fa-folder-open"></i>
			</span>
			<span id="bmAddBtn">
  					<!-- <i class="fa fa-plus fa-lg"></i> -->
  					Add <i class="fa fa-link"></i>
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
		<span class="group">{{ $bookmark->group->bookmarkGroup }}</span>
		<span class="btn blue edit"><i class="fa fa-edit fa-lg"></i></span>
		<span class="btn red delete"><i class="fa fa-trash-o"></i></span>
	</div>
<?php $counter++; ?>
@endforeach

<div class="appInfo">
	@foreach ($groups as $group)

		<span id="group_{{ $group->id }}"class="bookmarkGroups">{{ $group->bookmarkGroup }}</span>

	@endforeach
</div>
</div><!--bookmarks-body end-->

</div><!--bookmarksView end-->

















@endif
@endsection