<!doctype html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>{{ $title }}</title>
	
	{{ HTML::style('/assets/css/screen.css') }}
	{{ HTML::style('/assets/css/main.css') }}
	{{ HTML::script('/assets/js/jquery.js') }}
</head>
<body>
	<header id="mainHeader">
		<div class="container">
			<div class="loginForm-header">
				@if(!Auth::check())
					{{ Form::open(array('url'=>'/')) }}

						{{ Form::label('username', 'Username') }}
						{{ Form::text('username', '', array('tabindex'=>10)) }}
						{{ Form::label('password', 'Password') }}
						{{ Form::password('password', '', array('tabindex'=>20)) }}
						
						{{ Form::submit('Login') }}
						{{ HTML::link('register', 'Register') }}
					{{ Form::close() }}
				@else
					<p>Logged in as {{ Auth::user()->username }} {{ HTML::link('logout', 'Logout') }}</p>
				@endif
			</div>
		</div>
	</header>
	<div id = "msg">
		@if(Session::has('msg'))
			<p id="appMsg">{{ Session::get('msg') }}</p>
		@endif
	</div>
	<section id="mainContent">
		<div class="container">
			@yield('content')
		</div>
	</section>
	<footer id="mainFooter">
		<div class="container">
			&copy; Pravin Rai Bookmark it {{ date('Y') }}
		</div>
	</footer>

</body>
</html>