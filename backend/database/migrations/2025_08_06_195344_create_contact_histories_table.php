<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('contact_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('contact_id')->constrained()->onDelete('cascade');
            $table->string('action'); // created, updated, deleted
            $table->string('field')->nullable(); // which field was changed
            $table->text('old_value')->nullable();
            $table->text('new_value')->nullable();
            $table->string('user_id')->default('system'); // who made the change
            $table->timestamps();
            
            // Add indexes for better performance
            $table->index(['contact_id', 'created_at']);
            $table->index('action');
            $table->index('user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contact_histories');
    }
};
