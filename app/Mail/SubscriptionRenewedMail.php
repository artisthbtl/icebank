<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\User;
use App\Models\Plan;
use App\Models\Transaction;

class SubscriptionRenewedMail extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $plan;
    public $transaction;

    public function __construct(User $user, Plan $plan, Transaction $transaction)
    {
        $this->user = $user;
        $this->plan = $plan;
        $this->transaction = $transaction;
    }

    public function build()
    {
        return $this->subject('Subscription Renewed: ' . $this->plan->name)
                    ->view('emails.subscriptions.renewed');
    }
}