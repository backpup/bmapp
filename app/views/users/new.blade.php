@extends('layouts.default')

@section('content')

<section id="registerPage">
	<h1>Register</h1>
	@if($errors->has())
	<p>Please correct the following errors:</p>
		<ul id="form-errors">
			{{ $errors->first('username', '<li>:message</li>') }}
			{{ $errors->first('password', '<li>:message</li>') }}
			{{ $errors->first('password_confirmation', '<li>:message</li>') }}
			{{ $errors->first('email', '<li>:message</li>') }}
		</ul>
	@endif

	{{ Form::open(array('url'=>'register', 'id'=>'registerForm')) }}
		<p>
		
			{{ Form::text('username', Input::old('username'), array('placeholder'=>'username')) }}
		</p>
		<p>
		
			<input type="password" name="password" placeholder="password" />
		</p>
		<p>
			<input type="password" name="password_confirmation" placeholder="confirm password" />
		</p>
		<p>
			{{ Form:: email('email', Input::old('email'), array('placeholder'=>'email')) }}
		</p>
		<p>
			{{ Form::submit('Register', array('class'=>'button')) }}
		</p>

	{{ Form::close() }}

</section>

@endsection