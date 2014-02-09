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

<div class="ratingScale">
	<span class="ratingList">
		<i class="fa fa-star-o fa-lg"></i>
		<i class="fa fa-star-o fa-lg"></i>
		<i class="fa fa-star-o fa-lg"></i>
		<i class="fa fa-star-o fa-lg"></i>
		<i class="fa fa-star-o fa-lg"></i>
	</span>
</div>

{{ Form::open(array('url'=>'action/rating')) }}

	{{ Form::text('rating', '') }}
	{{ Form::submit('Submit') }}

{{ Form::close() }}















@endif
@endsection