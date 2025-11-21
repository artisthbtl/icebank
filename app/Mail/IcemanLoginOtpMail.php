<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\Iceman;

class IcemanLoginOtpMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public Iceman $iceman;
    public string $otp;

    public function __construct(Iceman $iceman, string $otp)
    {
        $this->iceman = $iceman;
        $this->otp = $otp;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Iceman One Time Verification Code!',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.auth.login-otp-iceman',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
