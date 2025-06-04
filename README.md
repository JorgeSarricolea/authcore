# AuthCore

Authentication service with local and OAuth (Google) authentication support.

## Features

- Local authentication (email/password)
- Google OAuth integration
- Password reset functionality
- Email verification
- JWT-based authentication
- Role-based access control (RBAC)
- Predefined roles and permissions
- Rate limiting
- CORS support

## API Documentation

The project includes HTTP request files (`api.http`) in the `src/interfaces/routes` directory for testing endpoints:

- `auth.api.http`: Authentication-related endpoints
- `app.api.http`: General application endpoints
- `test.api.http`: Test endpoints for protected routes

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

8. Run the Prisma migrations and seed the database:

   ```bash
   pnpm prisma:generate
   pnpm prisma:migrate:dev
   pnpm prisma:seed
   ```

## Available Scripts

- `pnpm dev`: Start development server
- `pnpm build`: Build the project
- `pnpm start`: Start production server
- `pnpm docker:build`: Build Docker containers
- `pnpm docker:dev`: Start Docker containers
- `pnpm docker:down`: Stop Docker containers
- `pnpm docker:logs`: View Docker container logs
- `pnpm prisma:generate`: Generate Prisma client
- `pnpm prisma:migrate:dev`: Run database migrations
- `pnpm prisma:migrate:reset`: Reset database
- `pnpm prisma:migrate:rollback`: Rollback last migration
- `pnpm prisma:seed`: Seed the database with initial data

## Environment Variables

#### Application Settings

- `PORT`: Server port number (default: 8000)

  ```
  PORT="8000"
  ```

- `NODE_ENV`: Environment (development/production)

  ```
  NODE_ENV="development"
  ```

- `APP_NAME`: Name of your application

  ```
  APP_NAME="AuthCore"
  ```

- `COMPOSE_PROJECT_NAME`: Docker Compose project name

  ```
  COMPOSE_PROJECT_NAME="authcore_server"
  ```

- `ALLOWED_ORIGINS`: Comma-separated list of allowed origins for CORS

  ```
  ALLOWED_ORIGINS="http://localhost:3000,https://yourdomain.com"
  ```

- `API_URL`: Base URL for the API endpoints
  ```
  API_URL="http://localhost:8000/api/v1"
  ```

#### Database Configuration

- `DATABASE_URL`: MySQL connection URL

  ```
  DATABASE_URL="mysql://user:password@localhost:3306/database"
  ```

- `MYSQL_USER`: MySQL user

  ```
  MYSQL_USER="user"
  ```

- `MYSQL_PASSWORD`: MySQL password

  ```
  MYSQL_PASSWORD="password"
  ```

- `MYSQL_ROOT_PASS`: MySQL root password

  ```
  MYSQL_ROOT_PASS="root_password"
  ```

- `MYSQL_DB`: MySQL database name

  ```
  MYSQL_DB="authcore"
  ```

- `MYSQL_PORT`: MySQL port (default: 3306)
  ```
  MYSQL_PORT="3306"
  ```

#### JWT Configuration

- `JWT_SECRET`: Secret key for access tokens

  ```
  JWT_SECRET="your-jwt-secret"
  ```

- `JWT_REFRESH_SECRET`: Secret key for refresh tokens
  ```
  JWT_REFRESH_SECRET="your-jwt-refresh-secret"
  ```

#### Email Configuration

- `SMTP_HOST`: SMTP server host

  ```
  SMTP_HOST="smtp.gmail.com"
  ```

- `SMTP_PORT`: SMTP server port

  ```
  SMTP_PORT="587"
  ```

- `SMTP_SECURE`: Whether to use TLS (true for port 465, false for port 587)

  ```
  SMTP_SECURE="false"
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

- `GOOGLE_CLIENT_ID`: Google OAuth client ID

  ```
  GOOGLE_CLIENT_ID="your-client-id"
  ```

- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret

  ```
  GOOGLE_CLIENT_SECRET="your-client-secret"
  ```

- `GOOGLE_CALLBACK_URL`: OAuth callback URL
  ```
  GOOGLE_CALLBACK_URL="http://localhost:8000/api/v1/auth/google/callback"
  ```

### Setting up Google OAuth Credentials

To obtain the Google OAuth credentials, follow these steps:

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Credentials"
4. Click on "Create Credentials" and select "OAuth client ID"
5. Select "Web application" as the application type
6. Add a name for your OAuth client
7. Add authorized JavaScript origins:
   ```
   http://localhost:8000
   ```
8. Add authorized redirect URIs:
   ```
   http://localhost:8000/api/v1/auth/google/callback
   ```
9. Click "Create"
10. Copy the generated Client ID and Client Secret
11. Update your `.env` file with these values:
    ```
    GOOGLE_CLIENT_ID="your-client-id"
    GOOGLE_CLIENT_SECRET="your-client-secret"
    GOOGLE_CALLBACK_URL="http://localhost:8000/api/v1/auth/google/callback"
    ```

> [!NOTE]
> Make sure to enable the Google+ API in your Google Cloud Console project before using OAuth.

## Predefined Roles and Permissions

The system comes with the following predefined roles:

1. **SUPER_ADMIN**

   - Full system access
   - All permissions

2. **ADMIN**

   - Elevated access
   - Most permissions except system configuration

3. **MANAGER**

   - Resource management capabilities
   - Create, read, update, manage, and approve permissions

4. **USER**

   - Basic access
   - Read-only permissions

5. **AUDITOR**
   - System audit capabilities
   - Read and audit permissions

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
