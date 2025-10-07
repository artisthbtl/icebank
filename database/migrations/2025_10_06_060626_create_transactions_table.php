<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('account_id')->constrained()->onDelete('cascade');
            $table->enum('type', ['add_balance', 'transfer', 'pay_plan']);
            $table->decimal('amount', 15, 2);
            $table->string('description')->nullable();
            $table->foreignId('related_account_id')->nullable()->constrained('accounts')->onDelete('set null');
            $table->foreignId('related_plan_id')->nullable()->constrained('plans')->onDelete('set null');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
