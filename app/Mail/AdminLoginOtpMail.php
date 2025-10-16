<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\Admin;

class AdminLoginOtpMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public Admin $admin;
    public string $otp;

    public function __construct(Admin $admin, string $otp)
    {
        $this->admin = $admin;
        $this->otp = $otp;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Admin One Time Verification Code!',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.auth.admin-login-otp',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
