<!DOCTYPE html>
<html>
<head>
    <title>Your Login OTP</title>
</head>
<body>
    <h2>Hello, {{ $user->first_name }}!</h2>
    <p>Here is your One-Time Password (OTP) to log in to your Icebank account. This code is valid for 5 minutes.</p>
    <p style="font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
        {{ $otp }}
    </p>
    <p>If you did not request a login, please secure your account immediately or contact our support.</p>
    <p>Regards,<br>The Icebank Team</p>
</body>
</html>