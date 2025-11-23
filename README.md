# Icebank

---

## Prerequisites

* **composer**
* **npm**
* **xampp**

---

## Local Deployment

Follow these steps to set up the project locally:

1.  **Configure Environment File**
    ```bash
    cp .env.example .env
    ```
    **Action required**: Configure your **mailer** and **database** settings in the newly created `.env` file.

2.  **Install PHP Dependencies**
    ```bash
    composer install
    ```

3.  **Install JavaScript Dependencies**
    ```bash
    npm install
    ```

4.  **Generate Application and JWT Keys**
    ```bash
    php artisan key:generate 
    # ensures APP_KEY is set in .env
    
    php artisan jwt:secret 
    # ensures JWT_SECRET is set in .env
    ```

5.  **Run Database Migrations**
    ```bash
    php artisan migrate:fresh
    ```

6.  **Create Storage Directories**
    ```bash
    mkdir -p storage/app/private/verifications
    mkdir -p storage/app/public/company_logos
    mkdir -p storage/app/public/profile_photos
    ```

7.  **Add Default Profile Photo**
    **Action required**: Place your `default.png` file inside the `storage/app/public/profile_photos` directory.

8.  **Create Storage Link**
    ```bash
    php artisan storage:link
    ```

9.  **Create Administrator Account**
    ```bash
    php artisan iceman:create
    ```

---

## Running Services

Run these commands in different terminals.

1.  **Start the Web Server**
    ```bash
    composer run dev
    ```

2.  **Set up Subscription Renewal Cron Job**
    ```bash
    php artisan v1:subscription:renew
    ```