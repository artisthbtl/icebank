# Icebank

---

## Prerequisites

Before starting, ensure you have the following installed:

* **composer**
* **npm**
* **xampp**

---

## Local Deployment

Follow these steps to set up the project locally:

1.  **Configure Environment File**
    Copy the example environment file:
    ```bash
    cp .env.example .env
    ```
    **Action required**: Configure your **mailer** and **database** settings in the newly created `.env` file.

2.  **Install PHP Dependencies**
    Run the Composer install command:
    ```bash
    composer install
    ```

3.  **Install JavaScript Dependencies**
    Run the npm install command:
    ```bash
    npm install
    ```

4.  **Generate Application and JWT Keys**
    Generate the required secret keys:
    ```bash
    php artisan key:generate 
    # ensures APP_KEY is set in .env
    
    php artisan jwt:secret 
    # ensures JWT_SECRET is set in .env
    ```

5.  **Run Database Migrations**
    Run the migrations to set up the database structure:
    ```bash
    php artisan migrate:fresh
    ```

6.  **Create Storage Directories**
    Create the necessary directories for file storage:
    ```bash
    mkdir -p storage/app/private/verifications
    mkdir -p storage/app/public/company_logos
    mkdir -p storage/app/public/profile_photos
    ```

7.  **Add Default Profile Photo**
    **Action required**: Place your `default.png` file inside the `storage/app/public/profile_photos` directory.

8.  **Create Storage Link**
    Create the symbolic link for public storage access:
    ```bash
    php artisan storage:link
    ```

9.  **Create Administrator Account**
    Run this command to create the initial admin user (named "Iceman"):
    ```bash
    php artisan iceman:create
    ```

---

## Running Services

These commands must be running constantly (in separate terminals or via background processes) for the application to function correctly.

1.  **Start the Web Server**
    ```bash
    composer run dev
    ```

2.  **Set up Subscription Renewal Jobs**
    ```bash
    php artisan v1:subscription:renew
    ```