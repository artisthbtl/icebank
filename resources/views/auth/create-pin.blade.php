<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Create PIN - Icebank</title>
    <style>
        body { font-family: sans-serif; margin: 2em; background-color: #f4f4f9; color: #333; }
        .container { max-width: 500px; margin: auto; background: #fff; padding: 2em; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        h1 { color: #2a2a2a; text-align: center; }
        .form-group { margin-bottom: 1.5em; }
        label { display: block; margin-bottom: 0.5em; font-weight: bold; }
        input[type="password"] { width: 100%; padding: 0.8em; box-sizing: border-box; border: 1px solid #ccc; border-radius: 4px; }
        button { width: 100%; padding: 0.8em 1.5em; cursor: pointer; background-color: #007bff; color: white; border: none; border-radius: 4px; font-size: 1em; }
        button:hover { background-color: #0056b3; }
        .alert { padding: 1em; margin-bottom: 1em; border-radius: 4px; }
        .alert-danger { background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
        .alert-success { background-color: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
    </style>
</head>
<body>

<div class="container">
    <h1>Create Your 6-Digit PIN</h1>

    <div id="message-container"></div>

    <form id="createPinForm">
        <div class="form-group">
            <label for="pin">New PIN</label>
            <input type="password" id="pin" name="pin" required maxlength="6" pattern="\d{6}" title="PIN must be 6 digits.">
        </div>

        <div class="form-group">
            <label for="pin_confirmation">Confirm New PIN</label>
            <input type="password" id="pin_confirmation" name="pin_confirmation" required maxlength="6">
        </div>

        <button type="submit">Create PIN</button>
    </form>
</div>

<script>
    document.getElementById('createPinForm').addEventListener('submit', async function (event) {
        event.preventDefault();

        const pin = document.getElementById('pin').value;
        const pinConfirmation = document.getElementById('pin_confirmation').value;
        const messageContainer = document.getElementById('message-container');
        messageContainer.innerHTML = '';

        if (pin !== pinConfirmation) {
            displayMessage('PINs do not match.', 'danger');
            return;
        }

        const token = localStorage.getItem('accessToken'); // Assuming you store the JWT token in localStorage

        if (!token) {
            displayMessage('Authentication error. Please log in again.', 'danger');
            window.location.href = '/login';
            return;
        }

        try {
            const response = await fetch('/api/v1/users/store-pin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify({
                    pin: pin,
                    pin_confirmation: pinConfirmation
                })
            });

            const data = await response.json();

            if (response.ok) {
                displayMessage(data.message || 'PIN created successfully! Redirecting...', 'success');
                setTimeout(() => {
                    window.location.href = '/';
                }, 2000);
            } else {
                const errorMessage = data.message || 'An error occurred.';
                displayMessage(errorMessage, 'danger');
            }
        } catch (error) {
            console.error('Error:', error);
            displayMessage('A network error occurred. Please try again.', 'danger');
        }
    });

    function displayMessage(message, type) {
        const messageContainer = document.getElementById('message-container');
        messageContainer.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
    }
</script>

</body>
</html>