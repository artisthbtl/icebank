<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your New Email</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; }
        .container { width: 90%; margin: auto; padding: 20px; }
        .button {
            display: inline-block;
            background-color: #007bff;
            color: #ffffff;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Hello, {{ $user->first_name }}!</h2>
        
        <p>You recently requested to change your Icebank account's email address.</p>
        
        <p>To confirm this change, please click the button below. This link will expire in 30 minutes.</p>
        
        <p style="text-align: center; margin: 25px 0;">
            <a href="{{ $verificationLink }}" class="button" style="color: #ffffff;">Confirm New Email</a>
        </p>
        
        <p>If you did not request this change, please contact our support team immediately.</p>
        
        <p>Thanks,<br>The Icebank Team</p>
    </div>
</body>
</html>