<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('alerts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('camera_id')->constrained()->onDelete('cascade');
            $table->foreignId('detection_id')->nullable()->constrained()->onDelete('set null');
            $table->enum('alert_type', ['theft', 'unknown_person', 'motion']);
            $table->enum('severity', ['low', 'medium', 'high', 'critical']);
            $table->text('message');
            $table->string('image_path')->nullable();
            $table->boolean('is_acknowledged')->default(false);
            $table->timestamp('acknowledged_at')->nullable();
            $table->timestamps();
            
            $table->index('camera_id');
            $table->index('is_acknowledged');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('alerts');
    }
};
