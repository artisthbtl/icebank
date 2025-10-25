<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Transaction extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'account_id',
        'type',
        'amount',
        'description',
        'related_account_id',
        'related_plan_id',
    ];

    public function account()
    {
        return $this->belongsTo(Account::class);
    }

    public function plan()
    {
        return $this->belongsTo(Plan::class, 'related_plan_id');
    }

    public function relatedAccount()
    {
        return $this->belongsTo(Account::class, 'related_account_id');
    }

    public function receiverAccount()
    {
        return $this->belongsTo(Account::class, 'related_account_id');
    }

    public function senderAccount()
    {
        return $this->belongsTo(Account::class, 'related_account_id');
    }
}