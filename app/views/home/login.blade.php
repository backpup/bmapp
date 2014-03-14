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





@endif
@endsection