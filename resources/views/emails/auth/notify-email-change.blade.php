<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Security Alert</title>
    <style>
        /* Add your app's email styling here */
        body { font-family: Arial, sans-serif; line-height: 1.6; }
        .container { width: 90%; margin: auto; padding: 20px; }
        .alert-box {
            background-color: #fffbeb;
            border: 1px solid #fde68a;
            padding: 15px;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Security Alert for {{ $user->first_name }}</h2>
        
        <p>This is a confirmation that the email address associated with your Icebank account has been successfully changed to:</p>

        <p style="font-size: 1.2em; font-weight: bold; margin: 15px 0;">
            {{ $newEmail }}
        </p>
        
        <div class="alert-box">
            <strong>If you made this change,</strong> you can safely ignore this email.
            <br><br>
            <strong>If you did NOT make this change,</strong> your account may be compromised. Please contact our support team immediately to secure your account.
        </div>
        
        <p style="margin-top: 20px;">Thanks,<br>The Icebank Team</p>
    </div>
</body>
</html>