<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use \Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use \App\Models\Product;
use \Illuminate\Support\Facades\Storage;

class ProductController extends Controller {

    private static $IMAGE_FOLDER = "/images/products";

    public function createProduct(Request $request)
    {
	$validator = Validator::make($request->all(),
			[
			    'name' => ['required'],
			    'category_id' => ['required', "exists:categories,id"],
			    'price' => ['required', "numeric"],
			    "image" => ["file", "required"]
			]
	);
	if ($validator->fails())
	{
	    return $this->error($validator->errors());
	}
	$validatedData = $validator->getData();
	$fileName = $validatedData["image"]->store(ProductController::$IMAGE_FOLDER, "public");
	$validatedData["image_url"] = Storage::url($fileName);
	unset($validatedData["image"]);
	$product = Product::create($validatedData);
	return $this->success($product, statusCode: 201);
    }

    function getAllProducts(Request $request)
    {
	$validator = Validator::make($request->all(),
			[
			    'skip' => ["integer", "min:0"],
			    'limit' => ['integer', "min:0", "max:50"],
			]
	);
	if ($validator->fails())
	{
	    return $this->error($validator->errors());
	}
	$validatedData = $validator->getData();
	$skip = array_key_exists("skip", $validatedData) ? $validatedData["skip"]:  0;
	$limit = array_key_exists("limit", $validatedData) ? $validatedData["limit"]:  50;
	$total = Product::count();
	return $this->success(["limit" => $limit, "skip" => $skip, "total" => $total, "data" => Product::offset($skip)->limit($limit)->get()]);
    }

    function getProduct(Request $request, Product $product)
    {
	return $this->success($product);
    }

    function editProduct(Request $request, Product $product)
    {
	$validator = Validator::make($request->all(),
			[
			    'name' => ['string'],
			    'category_id' => ["exists:categories,id"],
			    'price' => ["numeric"],
			    "image" => ["file"]
			]
	);
	if ($validator->fails())
	{
	    return $this->error($validator->errors());
	}
	$update = $validator->getData();
	if (array_key_exists("name", $update))
	    $product->name = $update["name"];
	if (array_key_exists("category_id", $update))
	    $product->category_id = $update["category_id"];
	if (array_key_exists("price", $update))
	    $product->price = $update["price"];
	if (array_key_exists("image", $update))
	{
	    Storage::disk("public")->delete(ProductController::$IMAGE_FOLDER . "/" . basename($product->image_url));
	    $fileName = $update["image"]->store(ProductController::$IMAGE_FOLDER, "public");
	    $product->image_url = Storage::url($fileName);
	}
	$product->save();
	return $this->success($product, message: "Product information was updated successfully");
    }

    function deleteProduct(Request $request, Product $product)
    {
	Storage::disk("public")->delete(ProductController::$IMAGE_FOLDER . "/" . basename($product->image_url));
	Product::destroy($product->id);
	return $this->success($product);
    }

}
