<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Company extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'logo_path',
    ];

    protected $appends = ['logo_url'];

    protected function logoUrl(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->logo_path 
                ? asset('storage/' . $this->logo_path) 
                : null,
        );
    }

    public function services()
    {
        return $this->hasMany(Service::class);
    }
}