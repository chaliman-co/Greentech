<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;
    
      public function success($payload, $statusCode = 200, $message = null)
    {
	$data = [
	    "status" => "success",
	    "data" => $payload
	];
	if ($message)
	    $data["message"] = $message;
	return response()->json($data, $statusCode);
    }
    
        public function error($errors, $reason = "validation failed", $statusCode = 400 )
    {
	$data = [
	    "status" => "failed",
	    "reason" => $reason,
	    "errors" => $errors
	];
	return response()->json($data, $statusCode);
    }
}
