<!doctype html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>{{ $title }}</title>
	
	{{ HTML::style('/assets/css/main.css') }}
	{{ HTML::script('/assets/js/jquery.js') }}
</head>
<body>
	<header id="mainHeader">
		<div class="container">
			<a href="/">
			<div class="intro">
				<h1>bookmark</h1>
				<p class="short-hook">Your personal bookmark repository to go</p>
			</div>
			</a>
		@if(Auth::check())
			<div class="headerIcon" id="searchIconId">
				<i class="fa fa-search fa-lg"></i>
			</div>
			<div class="searchForm" id="searchForm">
				{{ Form::open(array('url'=>'search')) }}
					<input type="text" name="search" id="search" /><br />
					<input type="submit" value = "search" />
				{{ Form::close() }}
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
{{ HTML::script('/assets/js/app.js') }}
</body>
</html>