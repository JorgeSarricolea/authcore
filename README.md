# AuthCore

Authentication service with local and OAuth (Google) authentication support.

## Features

- Local authentication (email/password)
- Google OAuth integration
- Password reset functionality
- Email verification
- JWT-based authentication
- Rate limiting
- CORS support

## API Documentation

The project includes HTTP request files (`api.http`) that serve as documentation for the available endpoints. These files can be used with REST Client extensions in VS Code or other compatible IDEs to test the API endpoints directly.

- `auth.api.http`: Contains authentication-related endpoints
- `app.api.http`: Contains general application endpoints

## Prerequisites

- Node.js 20+
- pnpm
- Docker and Docker Compose

## Setup

1. Clone the repository
2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Copy `.env.example` to `.env` and update the variables

4. Build and start the Docker containers:

   ```bash
   pnpm docker:build
   pnpm docker:dev
   ```

5. After the containers are running, you need to grant database permissions. Connect to the MySQL container and execute the following commands:

   ```bash
   docker exec -it authcore_mysql_db mysql -uroot -p
   ```

   > [!IMPORTANT]
   > When prompted, enter the root password from your .env file.

6. Once inside MySQL, execute these commands:

   ```sql
   GRANT ALL PRIVILEGES ON *.* TO 'MYSQL_USER'@'%' WITH GRANT OPTION;
   FLUSH PRIVILEGES;
   ```

   > [!IMPORTANT]
   > Remember to change **MYSQL_USER** for the user you're going to use.

7. Exit MySQL:

   ```sql
   exit
   ```

8. Run the Prisma migrations:

   ```bash
   pnpm prisma:migrate:dev
   ```

## Environment Variables

#### Application Settings

- `PORT`: Server port number

  ```
  PORT="3000"
  ```

- `NODE_ENV`: Environment (development/production)

  ```
  NODE_ENV="development"
  ```

- `APP_NAME`: Name of your application (used in email templates and UI)

  ```
  APP_NAME="AuthCore"
  ```

- `ALLOWED_ORIGINS`: Comma-separated list of allowed origins for CORS

  ```
  ALLOWED_ORIGINS="http://localhost:3000,https://yourdomain.com"
  ```

- `API_URL`: Base URL for the API endpoints
  ```
  API_URL="http://localhost:8000/api/v1"
  ```

#### Email Configuration

These variables are used for sending verification emails and password reset emails:

- `SMTP_HOST`: SMTP server host

  ```
  SMTP_HOST="smtp.gmail.com"
  ```

- `SMTP_PORT`: SMTP server port

  ```
  SMTP_PORT="587"
  ```

- `SMTP_SECURE`: Whether to use TLS for SMTP connection (true for port 465, false for port 587)

  ```
  SMTP_SECURE="true"
  ```

- `SMTP_USER`: SMTP username/email

  ```
  SMTP_USER="your-email@gmail.com"
  ```

- `SMTP_PASSWORD`: SMTP password or app-specific password

  ```
  SMTP_PASSWORD="your-password"
  ```

#### Google OAuth

Required if you want to enable Google authentication:

- `GOOGLE_CLIENT_ID`: Google OAuth client ID

  ```
  GOOGLE_CLIENT_ID="your-google-client-id"
  ```

- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret

  ```
  GOOGLE_CLIENT_SECRET="your-google-client-secret"
  ```

- `GOOGLE_CALLBACK_URL`: OAuth callback URL
  ```
  GOOGLE_CALLBACK_URL="http://localhost:3000/auth/google/callback"
  ```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
