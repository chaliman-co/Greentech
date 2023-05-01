<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use \Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use \App\Models\User;
use \Illuminate\Support\Facades\Storage;

class UserController extends Controller {
    private static $IMAGE_FOLDER = "/images/profile_pictures";

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
	    $fileName = $validatedData["image"]->store(UserController::$IMAGE_FOLDER, "public");
	    $validatedData["image_url"] = Storage::url($fileName);
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

    function getAllUsers(Request $request)
    {
	return $this->success(User::all());
    }
    function getUser(Request $request, User $user)
    {
	if (! ($request->user()->role == "admin" || $request->user()->id == $user->id)) return $this->error([], "Authentication failed", 401);
	return $this->success($user);
    }
    function editUser(Request $request, User $user) {
	if ($request->user()->id != $user->id) return $this->error([], "Authentication failed", 401);
	$validator = Validator::make($request->all(),
			[
			    'firstname' => ['string'],
			    'lastname' => ['string'],
			    'email_address' => ["unique:users", "email"],
			    'country' => ['string', "min:1"],
			    "password" => ["string", "min:4"],
			    "phone_number" => ["", "array:digits,region"],
			    "image" => ["file"]
			]
	);
	if ($validator->fails())
	{
	    return $this->error($validator->errors());
	}
	$update = $validator->getData();
	if (array_key_exists("firstname", $update)) $user->firstname = $update["firstname"];
	if (array_key_exists("lastname", $update)) $user->lastname = $update["lastname"];
	if (array_key_exists("country", $update)) $user->country = $update["country"];
	if (array_key_exists("phone_number", $update)) $user->phone_number = $update["phone_number"];
	if (array_key_exists("password", $update)) $user->password = $update["password"];
	if (array_key_exists("email_address", $update)) $user->email_address = $update["email_address"];
	if (array_key_exists("image", $update)) {
	    Storage::disk("public")->delete(UserController::$IMAGE_FOLDER . "/" . basename($user->image_url));
	    $fileName = $update["image"]->store(UserController::$IMAGE_FOLDER, "public");
	    $user->image_url = Storage::url($fileName);
	}
	$user->save();
	return $this->success($user, message: "User information was updated successfully");
    }
    public function getProfile(Request $request) {
	return $this->success($request->user());
    }

}
