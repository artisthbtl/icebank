<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ID Verification - Icebank</title>
    <style>
        body { font-family: sans-serif; margin: 2em; background-color: #f4f4f9; color: #333; }
        .container { max-width: 500px; margin: auto; background: #fff; padding: 2em; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        h1 { color: #2a2a2a; text-align: center; }
        p { color: #666; text-align: center; margin-bottom: 2em; }
        .form-group { margin-bottom: 1.5em; }
        label { display: block; margin-bottom: 0.5em; font-weight: bold; }
        input[type="file"] { width: 100%; padding: 0.8em; box-sizing: border-box; border: 1px solid #ccc; border-radius: 4px; }
        .file-info { font-size: 0.8em; color: #888; margin-top: 0.5em; }
        button { width: 100%; padding: 0.8em 1.5em; cursor: pointer; background-color: #007bff; color: white; border: none; border-radius: 4px; font-size: 1em; }
        button:hover { background-color: #0056b3; }
        .alert { padding: 1em; margin-bottom: 1em; border-radius: 4px; }
        .alert-danger { background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
        .alert-success { background-color: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
    </style>
</head>
<body>

<div class="container">
    <h1>Account Verification</h1>
    <p>To access all features, please upload the required documents.</p>

    <div id="message-container"></div>

    <form id="verificationForm">
        <div class="form-group">
            <label for="ktpImage">KTP (ID Card)</label>
            <input type="file" id="ktpImage" name="ktpImage" accept="image/jpeg, image/png, image/jpg" required>
            <div class="file-info">Max file size: 2MB. Allowed formats: JPG, PNG.</div>
        </div>

        <div class="form-group">
            <label for="selfieImage">Selfie with KTP</label>
            <input type="file" id="selfieImage" name="selfieImage" accept="image/jpeg, image/png, image/jpg" required>
            <div class="file-info">Max file size: 2MB. Allowed formats: JPG, PNG.</div>
        </div>

        <button type="submit">Submit for Verification</button>
    </form>
</div>

<script>
    document.getElementById('verificationForm').addEventListener('submit', async function (event) {
        event.preventDefault();

        const ktpImage = document.getElementById('ktpImage').files[0];
        const selfieImage = document.getElementById('selfieImage').files[0];
        const messageContainer = document.getElementById('message-container');
        messageContainer.innerHTML = '';

        if (ktpImage.size > 2 * 1024 * 1024 || selfieImage.size > 2 * 1024 * 1024) {
            displayMessage('One or both files exceed the 2MB size limit.', 'danger');
            return;
        }

        const token = localStorage.getItem('accessToken');
        if (!token) {
            displayMessage('Authentication error. Please log in again.', 'danger');
            return;
        }

        const formData = new FormData();
        formData.append('ktpImage', ktpImage);
        formData.append('selfieImage', selfieImage);

        try {
            const response = await fetch('/api/v1/verifications', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                displayMessage('Verification documents submitted successfully! You will be notified once the review is complete.', 'success');
                document.getElementById('verificationForm').reset();
            } else {
                let errorMessage = data.message || 'An error occurred.';
                if (data.errors) {
                    errorMessage += '<ul>';
                    for (const key in data.errors) {
                        errorMessage += `<li>${data.errors[key].join(', ')}</li>`;
                    }
                    errorMessage += '</ul>';
                }
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