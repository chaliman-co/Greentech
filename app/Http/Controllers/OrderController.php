<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use \Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use \App\Models\Order;
use \App\Models\OrderItem;
use \Illuminate\Support\Facades\Storage;

class OrderController extends Controller {

    public function placeOrder(Request $request)
    {
	$input = ["item" => $request->all()];
	$validator = Validator::make($input, [
		    'item.*.quantity' => 'required|integer',
		    'item.*.product_id' => 'required|exists:products,id'
	]);
	if ($validator->fails())
	{
	    return $this->error($validator->errors());
	}
	$orderItems = [];
	$validatedData = $validator->getData();
	$order = Order::create(["user_id" => $request->user()->id]);
	foreach ($validatedData["item"] as $orderItem)
	{
	    $orderItems[] = [
		"order_id" => $order->id,
		"quantity" => $orderItem["quantity"],
		"product_id" => $orderItem["product_id"]
	    ];
	}
	OrderItem::insert($orderItems);
	return $this->success($order);
    }

    function getOrders(Request $request)
    {
	$validator = Validator::make($request->all(),
			[
			    'user_id' => ["integer", "exist:users,id"],
			    'skip' => ["integer", "min:0"],
			    'limit' => ['integer', "min:0", "max:50"],
			]
	);
	if ($validator->fails())
	{
	    return $this->error($validator->errors());
	}
	$validatedData = $validator->getData();
	$skip = array_key_exists("skip", $validatedData) ? $validatedData["skip"] : 0;
	$limit = array_key_exists("limit", $validatedData) ? $validatedData["limit"] : 50;
	if (array_key_exists("user_id", $validatedData))
	{
	    if ($request->user()->id != $validatedData["user_id"] && !$request->user()->isAdmin)
		return $this->error([], "Access denied", 401); // You can't view orders for another user unless you're the admin
	    $total = Order::where("user_id", $validatedData["user_id"])->count();
	    $orders = Order::where("user_id", $validatedData["user_id"])->offset($skip)->limit($limit)->get();
	}
	else
	{
	    if (!$request->user()->isAdmin)
		return $this->error([], "Access denied", 401); // You can't view orders for all users unless you're the admin
	    $total = Order::count();
	    $orders = Order::offset($skip)->limit($limit)->get();
	}
	return $this->success(["limit" => $limit, "skip" => $skip, "total" => $total, "data" => $orders]);
    }

    function editOrder(Request $request, Order $order)
    {
	if ($order->status == "cancelled")
	    return $this->error([], "Order has already been cancelled");
	$validator = Validator::make($request->all(),
			[
			    'status' => ['string', 'in:processing,delivered,declined,cancelled', 'required']
			]
	);
	if ($validator->fails())
	{
	    return $this->error($validator->errors());
	}
	$update = $validator->getData();
	if (!$request->user()->isAdmin)
	{
	    if ($update["status"] != "cancelled" || $request->user()->id != $order->user_id)
		return $this->error([], "Access denied", 401); // You can only cancel orders and you can't cancel those placed by another user
	    if ($order->status != "pending")
		return $this->error([], "Invalid operation: Order is being/has already been processed");
	}
	$order->status = $update["status"];
	$order->save();
	return $this->success($order, message: "Order status was updated successfully");
    }

}
