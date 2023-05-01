<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {

    /**
     * Run the migrations.
     */
    public function up(): void
    {
	Schema::create('products', function (Blueprint $table) {
	    $table->id();
	    $table->string('name');
	    $table->string('image_url');
	    $table->double('price');
	    $table->bigInteger('category_id')->unsigned();
	    $table->foreign('category_id')->references('id')->on('categories');
	    $table->timestamps();
	});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
	Schema::table("products", function (Blueprint $table) {
	    $table->dropForeign(['category_id']);
	    Schema::dropIfExists('products');
	});
    }
};