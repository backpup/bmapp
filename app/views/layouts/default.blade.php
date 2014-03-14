<!doctype html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>{{ $title }}</title>
	
	{{ HTML::style('/assets/css/main.css') }}
</head>
<body>
	<header id="mainHeader">
		<div class="container">
			<a href="/">
			<div class="intro">
				<h1>bookmark</h1>
				<p class="short-hook">Your personal bookmark repository to go</p>
				<div class="headerLogo">
					<i class="fa fa-star-o"></i>
				</div>
			</div>
			</a>
		@if(Auth::check())
			<div class="headerIcon" id="searchIconId">
				<i class="fa fa-search fa-lg"></i>
			</div>
			<div class="searchForm" id="searchForm">
				
					<input type="text" name="search" id="search" /><br />
					<span class="searchFormInfo">search</span>
			
			</div>
			<div class="headerIcon" id="filterIconId">
				<i class="fa fa-filter fa-lg"></i>
			</div>
			<div class="filterBox" id="filterBox">
			
				<select name="groupSelect" id="groupSelect">
					<option selected>Group</option>
				</select>
		
					<a href="/">Filter Off</a>
			</div>
			<a href="/logout" class="logoutLink">
				<i class="fa fa-sign-out"></i>Logout
			</a>
		@else 
		<div class="mainLogin">
			{{ Form::open(array('url'=>'/')) }}

				
				{{ Form::text('username', '', array('tabindex'=>10, 'placeholder'=>'username')) }}
			
				<input type="password" name="password" tabindex="20" placeholder="password" />
				<!-- <span class="remember">Did you forget your password?</span> -->
				{{ Form::submit('Login', array('class'=>'button green', 'id'=>'loginBtn')) }}
				<!-- <a href="#" class="button blue">Hello<i class ="fa fa-square"></i><i class ="fa fa-circle"></i></a> -->
			{{ Form::close() }}
		</div>
		@endif
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
			
		</div>
	</footer>
<script src="http://code.jquery.com/jquery-1.10.2.min.js"></script>
{{ HTML::script('/assets/js/app.min.js') }}
</body>
</html>