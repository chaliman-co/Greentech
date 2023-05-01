<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\{UserController, NotFoundController};

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::post("/users", [UserController::class, "createUser"]);
Route::post("/auth", [UserController::class, "login"]);
Route::group(['middleware' => 'auth:sanctum'], function () {

    Route::get('/users/{user}', [UserController::class, "getUser"]);
    Route::patch('/users/{user}', [UserController::class, "editUser"]);

    Route::group(['middleware' => "ability:admin"], function () {
	Route::get('/users', [UserController::class, "getAllUsers"]);
    });
});
Route::any("{path}", [NotFoundController::class, "handle404"])->where("path", "(.*)");
