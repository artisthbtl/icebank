<!DOCTYPE html>
<html>
<head>
    <title>Subscription Renewed</title>
</head>
<body>
    <h1>Hello, {{ $user->first_name }}!</h1>
    <p>Great news! Your subscription to <strong>{{ $plan->name }}</strong> has been successfully renewed.</p>
    <p><strong>Amount Deducted:</strong> {{ abs($transaction->amount) }} Ices</p>
    <p><strong>Next Renewal Date:</strong> {{ \Carbon\Carbon::parse($plan->duration . ' days')->toFormattedDateString() }}</p>
    <p>Thank you for using IceBank!</p>
</body>
</html>