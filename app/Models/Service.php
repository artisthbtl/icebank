<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_id',
        'name',
        'type',
        'description',
    ];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function plans()
    {
        return $this->hasMany(Plan::class);
    }
}
