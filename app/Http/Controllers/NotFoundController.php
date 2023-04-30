<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class NotFoundController extends Controller
{
    function handle404(Request $request) {
	return $this->error([], "Resource not found", 404);
    }
}
