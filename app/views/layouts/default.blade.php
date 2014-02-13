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
			<div class="searchIcon" id="searchIconId">
				<i class="fa fa-search fa-lg"></i>
			</div>
			<div class="searchForm" id="searchForm">
				{{ Form::open(array('url'=>'search')) }}
					<input type="text" name="search" id="search" /><br />
					<input type="submit" value = "search" />
				{{ Form::close() }}
			</div>
		</div>

		@endif
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