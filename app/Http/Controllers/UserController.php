<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use \Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use \App\Models\User;

class UserController extends Controller {

    public function createUser(Request $request)
    {
	$validator = Validator::make($request->all(),
			[
			    'firstname' => ['required'],
			    'lastname' => ['required'],
			    'email_address' => ['required', "unique:users", "email"],
			    'country' => ['required', "min:1"],
			    "password" => ["required", "min:4"],
			    "phone_number" => ["required", "array:digits,region"],
			    "image" => ["file"]
			]
	);
	if ($validator->fails())
	{
	    return $this->error($validator->errors());
	}
	$validatedData = $validator->getData();
	$validatedData["password"] = password_hash($validatedData["password"], PASSWORD_DEFAULT);
	if (array_key_exists("image", $validatedData))
	{
	    $validatedData["image"]->store("images/profile_pictures");
	    $validatedData["image_url"] = "/images/profile_pictures/" . $validatedData["image"]->hashName();
	    unset($validatedData["image"]);
	}
	$user = User::create($validatedData);
	return $this->success($user, statusCode: 201);
    }

    public function login(Request $request)
    {
	$validator = Validator::make($request->all(),
			[
			    'email_address' => ['required', "email"],
			    "password" => ["required", "min:4"],
			]
	);
	if ($validator->fails())
	{
	    return $this->error($validator->errors());
	}
	$credentials = $validator->getData();
	if (Auth::attempt($credentials))
	{
	    $token = $request->user()->createToken("spa", [$request->user()->role]);

	    return $this->success(['token' => $token->plainTextToken]);
	}
	else
	{
	    return $this->error(["password" => "incorrect password", "email_address" => "incorrect email address"], "Authentication failed", 401);
	}
    }


}
