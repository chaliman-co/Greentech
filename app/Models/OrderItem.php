<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model {

    use HasFactory;

    protected $fillable = ["order_id", "product_id", "quantity"];

    public function product()
    {
	return $this->belongsTo(Product::class);
    }

    protected $with = ['product'];
    protected $hidden = ['product_id', 'created_at', 'updated_at', 'order_id', 'id'];

}
