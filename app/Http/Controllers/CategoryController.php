<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use \Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use \App\Models\Category;
use \Illuminate\Support\Facades\Storage;

class CategoryController extends Controller {

    public function createCategory(Request $request)
    {
	$validator = Validator::make($request->all(),
			[
			    'name' => ['required', 'unique:categories'],
			]
	);
	if ($validator->fails())
	{
	    return $this->error($validator->errors());
	}
	$validatedData = $validator->getData();
	$category = Category::create($validatedData);
	return $this->success($category, statusCode: 201);
    }

    function getAllCategories(Request $request)
    {
	return $this->success(Category::all());
    }
    function getCategory(Request $request, Category $category)
    {
	return $this->success($category);
    }
    function editCategory(Request $request, Category $category) {
	$validator = Validator::make($request->all(),
			[
			    'name' => ['string', 'required', 'unique:categories']
			]
	);
	if ($validator->fails())
	{
	    return $this->error($validator->errors());
	}
	$update = $validator->getData();
	$category->name = $update["name"];
	$category->save();
	return $this->success($category, message: "Category was updated successfully");
    
    }
    function deleteCategory(Request $request, Category $category)
    {
	Category::destroy($category->id);
	return $this->success($category);
    }

}

