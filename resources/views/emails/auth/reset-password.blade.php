<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px;
        }
        .container {
            background-color: #ffffff;
            max-width: 600px;
            margin: 0 auto;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            border-bottom: 1px solid #eeeeee;
            padding-bottom: 20px;
        }
        .header h1 {
            color: #333333;
        }
        .content {
            padding: 20px 0;
            line-height: 1.6;
            color: #555555;
        }
        .button-container {
            text-align: center;
            padding: 20px 0;
        }
        .button {
            background-color: #007bff;
            color: #ffffff;
            padding: 15px 25px;
            text-decoration: none;
            border-radius: 5px;
            display: inline-block;
        }
        .footer {
            text-align: center;
            font-size: 12px;
            color: #999999;
            padding-top: 20px;
            border-top: 1px solid #eeeeee;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Password Reset Request</h1>
        </div>
        <div class="content">
            <p>Hello,</p>
            <p>You are receiving this email because we received a password reset request for your account. Please click the button below to reset your password:</p>
            <div class="button-container">
                {{-- 
                  IMPORTANT: This URL must point to YOUR FRONTEND application.
                  It passes the token and email, which your frontend will then
                  use to make the API call to /reset-password.
                --}}
                <a href="{{ url('https://your-frontend-app.com/reset-password?token=' . $token . '&email=' . rawurlencode($email)) }}" class="button">Reset Password</a>
            </div>
            <p>This password reset link will expire in 30 minutes.</p>
            <p>If you did not request a password reset, no further action is required.</p>
            <p>Thank you!</p>
        </div>
        <div class="footer">
            <p>&copy; {{ date('Y') }} Icebank. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
