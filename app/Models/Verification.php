<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Verification extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'ktp_image_path',
        'selfie_image_path',
        'status',
    ];
    
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
