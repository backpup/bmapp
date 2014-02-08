@extends('layouts.default')

@section('content')

<section id="register-form">
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

	{{ Form::open(array('url'=>'register')) }}
		<p>
			{{ Form::label('username', 'Username') }}<br />
			{{ Form::text('username', Input::old('username')) }}
		</p>
		<p>
			{{ Form::label('password', 'Password') }}<br />
			{{ Form::password('password') }}
		</p>
		<p>
			{{ Form::label('password_confirmation', 'Confirm Password') }}<br />
			{{ Form::password('password_confirmation') }}
		</p>
		<p>
			{{ Form::label('email', 'Email') }}<br />
			{{ Form:: email('email', Input::old('email')) }}
		</p>
		<p>
			{{ Form::submit('Register') }}
		</p>

	{{ Form::close() }}

</section>

@endsection