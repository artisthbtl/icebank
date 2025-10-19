<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Carbon\Carbon;
use App\Mail\PasswordResetMail;
use Hash;
use Throwable;

class SendPasswordResetJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $email;

    public function __construct(string $email)
    {
        $this->email = $email;
    }

    public function handle(): void
    {
        try {
            DB::table('password_reset_tokens')->where('email', $this->email)->delete();

            $token = bin2hex(random_bytes(32));

            DB::table('password_reset_tokens')->insert([
                'email'      => $this->email,
                'token'      => Hash::make($token),
                'created_at' => Carbon::now()
            ]);

            Mail::to($this->email)->send(new PasswordResetMail($token, $this->email));

        } catch (Throwable $e) {
            report($e);
        }
    }
}