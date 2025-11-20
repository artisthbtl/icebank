<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\User;
use App\Models\Plan;

class SubscriptionExpiredMail extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $plan;

    public function __construct(User $user, Plan $plan)
    {
        $this->user = $user;
        $this->plan = $plan;
    }

    public function build()
    {
        return $this->subject('Action Required: Subscription Expired')
                    ->view('emails.subscriptions.expired');
    }
}