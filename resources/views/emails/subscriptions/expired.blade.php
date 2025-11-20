<!DOCTYPE html>
<html>
<head>
    <title>Subscription Expired</title>
</head>
<body>
    <h1>Hello, {{ $user->first_name }},</h1>
    <p>We attempted to renew your subscription to <strong>{{ $plan->name }}</strong>, but your account balance was insufficient.</p>
    <p>Your subscription has now <strong>expired</strong>. You can reactivate it anytime by visiting your dashboard and topping up your balance.</p>
    <p>Thank you,<br>The IceBank Team</p>
</body>
</html>