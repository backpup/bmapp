<!doctype html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Oops</title>
	
	{{ HTML::style('/assets/css/main.css') }}
</head>
<body>
	<header id="mainHeader">
		<div class="container">
			
		
		</div>
	</header>
	<section id="mainContent">
		<div class="container">
			<div class="pageError">
				<h2>url not found</h2>
				<p>Please check that your url is valid</p>
				<p>If you typed your url instead of copy/pasting it from the browser when saving it it's probably missing http://  infront of it.</p>
			</div>
		</div>
	</section>
	<footer id="mainFooter">
		<div class="container">
			
		</div>
	</footer>
{{ HTML::script('/assets/js/app.js') }}
</body>
</html>