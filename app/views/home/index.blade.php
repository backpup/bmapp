@extends('layouts.default')

@section('content')

@if(!Auth::check())

<div class="loginPrompt">
	
	<h2>Please <a href="register" >register</a> and login to start using the app</h2>
	<p>If you do not want to register and wish to simply test the app, just sign in with the following credentials:</p>
	<p>username: <span class="cred">JohnDoe</span> p/w:<span class="cred">password</span></p>
		<div class="loginForm">
				@if(!Auth::check())
					{{ Form::open(array('url'=>'/')) }}

						
						{{ Form::text('username', '', array('tabindex'=>10, 'placeholder'=>'username')) }}
					
						<input type="password" name="password" tabindex="20" placeholder="password" />
						<!-- <span class="remember">Did you forget your password?</span> -->
						{{ Form::submit('Login', array('class'=>'button', 'id'=>'loginBtn')) }}
						<!-- <a href="#" class="button blue">Hello<i class ="fa fa-square"></i><i class ="fa fa-circle"></i></a> -->
					{{ Form::close() }}
				@else
					<p>Logged in as {{ Auth::user()->username }} {{ HTML::link('logout', 'Logout') }}</p>
				@endif
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