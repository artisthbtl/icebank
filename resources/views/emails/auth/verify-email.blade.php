<!DOCTYPE html>
<html>
<head>
    <title>Verify Your Email Address</title>
</head>
<body>
    <h2>Welcome to Icebank, {{ $user->first_name }}!</h2>
    <p>Thank you for registering. Please click the button below to verify your email address and activate your account.</p>
    <a href="{{ $verificationLink }}" style="padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
        Verify Email Address
    </a>
    <p>If you did not create an account, no further action is required.</p>
    <p>Regards,<br>The Icebank Team</p>
</body>
</html>