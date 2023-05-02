<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\{
    UserController,
    NotFoundController,
    CategoryController,
    ProductController,
    OrderController
};

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
Route::get("/categories", [CategoryController::class, "getAllCategories"]);
Route::get('/categories/{category}', [CategoryController::class, "getCategory"]);
Route::get("/products", [ProductController::class, "getAllProducts"]);
Route::get('/products/{product}', [ProductController::class, "getProduct"]);

Route::group(['middleware' => 'auth:sanctum'], function () {

    Route::get('/users/{user}', [UserController::class, "getUser"]);
    Route::get('/profile', [UserController::class, "getProfile"]);
    Route::patch('/users/{user}', [UserController::class, "editUser"]);
    Route::post('/orders', [OrderController::class, "placeOrder"]);
    Route::get('/orders', [OrderController::class, "getOrders"]);
    Route::get('/orders/{order}', [OrderController::class, "getOrder"]);
    Route::patch('/orders/{order}', [OrderController::class, "editOrder"]);

    Route::group(['middleware' => "ability:admin"], function () {
	Route::get('/users', [UserController::class, "getAllUsers"]);
	Route::post("/categories", [CategoryController::class, "createCategory"]);
	Route::patch("/categories/{category}", [CategoryController::class, "editCategory"]);
	Route::delete("/categories/{category}", [CategoryController::class, "deleteCategory"]);
	Route::post("/products", [ProductController::class, "createProduct"]);
	Route::patch("/products/{product}", [ProductController::class, "editProduct"]);
	Route::delete("/products/{product}", [ProductController::class, "deleteProduct"]);
    });
});

Route::any("{path}", [NotFoundController::class, "handle404"])->where("path", "(.*)");
