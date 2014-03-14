@extends('layouts.default')

@section('content')

@if(!Auth::check())

<div class="loginPrompt">
	
	<h2>Please <a href="register" >register</a> and login to start using the app</h2>
	<p>If you do not want to register and wish to simply test the app, just click below:</p>

		<div class="loginForm">
			<a class = "tryout bigBtn green" href="/testride">Test it</a>
		</div>

		<div class="source-code">
			<div class="source-intro">
				<p>Or if you would like to view the source-code. To the left is the js/jquery portion of the app in its entirety, all 800+ lines of it. And to the right is the entire project on github.</p>
			</div>
			<div class="source-link">
				<a class = "git bigBtn blue" target="_blank" href="https://gist.github.com/backpup/9530946">
					<i class="fa fa-github-alt fa-lg"></i>
				</a>
			</div>
			<div class="source-link">
				<a class = "git bigBtn blue" target="_blank" href="https://github.com/backpup/bmapp">
					<i class="fa fa-github fa-lg"></i>
				</a>
			</div>
		</div>
</div><!--end loginPrompt-->
@else
<div id ="bookmarksView">
	
<div id="bookmarks-header">

	<div id="header-controls">
			<div id="header-info">
				
			</div><!--header-info end-->
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
		<span class="num">{{{ $counter }}}.</span>
		<a href="{{ $bookmark->link }}" target="_blank">
			<span class="title">{{{ $bookmark->title }}}</span>
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


</div><!--bookmarks-body end-->
<div class="appInfo">
	@foreach ($groups as $group)

		<span id="group_{{ $group->id }}"class="bookmarkGroups">{{{ $group->bookmarkGroup }}}</span>

	@endforeach
</div>
<div class="paginate">
{{ $bookmarks->links() }}
</div>
</div><!--bookmarksView end-->

@endif
@endsection