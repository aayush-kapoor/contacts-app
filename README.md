# Contacts-App

Hello KnotAPI team!

## 🚀 Features

- **Contact Management**: Create, read, update, and delete contacts
- **Search Functionality**: Search contacts by name or email
- **Activity History**: Track all changes made to contacts
- **Real-time Updates**: Instant feedback on all operations

## 📋 Prerequisites

Before setting up this project, ensure you have the following installed:

- **PHP**: Version 8.2 or higher
- **Composer**: PHP dependency manager
- **Node.js**: Version 18 or higher
- **pnpm**: Package manager (preferred) or npm
- **SQLite**: For database (default setup)


## 🛠️ Installation & Setup

### Setup Instructions

#### 1. Clone and Navigate

```bash
git clone https://github.com/aayush-kapoor/contacts-app.git
cd contacts-app
```

#### 2. Backend Setup (Laravel)

```bash
# Navigate to backend directory
cd backend

# Install PHP dependencies
composer install

# Create environment file
echo "APP_NAME=ContactsAPI
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_TIMEZONE=UTC
APP_URL=http://localhost:8000

APP_LOCALE=en
APP_FALLBACK_LOCALE=en
APP_FAKER_LOCALE=en_US

APP_MAINTENANCE_DRIVER=file
APP_MAINTENANCE_STORE=database

BCRYPT_ROUNDS=12

LOG_CHANNEL=stack
LOG_STACK=single
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=debug

DB_CONNECTION=sqlite
DB_DATABASE=database/database.sqlite

BROADCAST_CONNECTION=log
CACHE_STORE=database
FILESYSTEM_DISK=local
QUEUE_CONNECTION=database
SESSION_DRIVER=database
SESSION_LIFETIME=120
SESSION_ENCRYPT=false
SESSION_PATH=/
SESSION_DOMAIN=null

MEMCACHED_HOST=127.0.0.1

REDIS_CLIENT=phpredis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

MAIL_MAILER=log
MAIL_HOST=127.0.0.1
MAIL_PORT=2525
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS=hello@example.com
MAIL_FROM_NAME=Example

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=
AWS_USE_PATH_STYLE_ENDPOINT=false

VITE_APP_NAME=ContactsAPI" > .env

# Generate application key
php artisan key:generate

# Create SQLite database
touch database/database.sqlite

# Run database migrations
php artisan migrate

# Install Node.js dependencies (for Vite)
npm install
```

#### 3. Frontend Setup (Next.js)

```bash
# Navigate to project root
cd ..

# Install dependencies
pnpm install
# OR if using npm: npm install

# Create environment file
echo "NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_API_KEY=012345" > .env.local
```

#### 4. Start the Servers

You need to run both servers simultaneously. Open two terminal windows:

**Terminal 1 - Backend (Laravel):**
```bash
cd backend
php artisan serve
```
The backend will be available at http://localhost:8000

**Terminal 2 - Frontend (Next.js):**
```bash
pnpm dev
# OR if using npm: npm run dev
```
The frontend will be available at http://localhost:3000

## 🚀 Quick Start (After Initial Setup)

Once you've completed the setup above, for future runs you only need to start the servers:

**Terminal 1:**
```bash
cd backend && php artisan serve
```

**Terminal 2:**
```bash
pnpm dev
# OR: npm run dev
```


## 🔌 API Endpoints

The backend provides the following REST API endpoints (all require `knotapi: 012345` header):

### Contacts
- `GET /api/contacts` - List all contacts with pagination and search
- `POST /api/contacts` - Create a new contact (20-second delay)
- `GET /api/contacts/{id}` - Get specific contact with history
- `PUT /api/contacts/{id}` - Update contact
- `DELETE /api/contacts/{id}` - Delete contact
- `GET /api/contacts/stats` - Get contact statistics

### Contact History
- `GET /api/contact-histories` - List all contact's edit history
- `GET /api/contacts/{id}/history` - Get edit history for specific contact

### Testing
- `GET /api/test` - Test API connectivity

## 🧪 API Testing Examples

Use these curl commands to test the API after starting the backend server:

### 1. Test API Connection
```bash
curl -H "knotapi: 012345" \
     -H "Accept: application/json" \
     http://localhost:8000/api/test
```
**Expected Response:**
```json
{"message": "API is working"}
```

### 2. Create a Contact
```bash
curl -X POST \
     -H "knotapi: 012345" \
     -H "Content-Type: application/json" \
     -H "Accept: application/json" \
     -d '{
       "first_name": "John",
       "last_name": "Doe",
       "email": "john.doe@example.com",
       "phone": "+1234567890"
     }' \
     http://localhost:8000/api/contacts
```
**Note:** This endpoint has a 20-second delay as specified in requirements.

**Expected Response:**
```json
{
  "success": true,
  "message": "Contact created successfully",
  "data": {
    "id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "created_at": "2024-01-01T12:00:00.000000Z",
    "updated_at": "2024-01-01T12:00:00.000000Z"
  }
}
```

### 3. Get All Contacts
```bash
curl -H "knotapi: 012345" \
     -H "Accept: application/json" \
     http://localhost:8000/api/contacts
```

### 4. Search Contacts
```bash
curl -H "knotapi: 012345" \
     -H "Accept: application/json" \
     "http://localhost:8000/api/contacts?search=john"
```

### 5. Get Contact by ID
```bash
curl -H "knotapi: 012345" \
     -H "Accept: application/json" \
     http://localhost:8000/api/contacts/1
```

### 6. Update Contact
```bash
curl -X PUT \
     -H "knotapi: 012345" \
     -H "Content-Type: application/json" \
     -H "Accept: application/json" \
     -d '{
       "first_name": "Jane",
       "last_name": "Doe",
       "email": "jane.doe@example.com",
       "phone": "+1234567891"
     }' \
     http://localhost:8000/api/contacts/1
```

### 7. Delete Contact
```bash
curl -X DELETE \
     -H "knotapi: 012345" \
     -H "Accept: application/json" \
     http://localhost:8000/api/contacts/1
```

### 8. Get Contact History
```bash
curl -H "knotapi: 012345" \
     -H "Accept: application/json" \
     http://localhost:8000/api/contact-histories
```

## 🔧 Configuration

### Environment Variables

**Frontend (.env.local):**
```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_API_KEY=012345
```

**Backend (.env):**
```
APP_NAME=ContactsAPI
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000
DB_CONNECTION=sqlite
DB_DATABASE=database/database.sqlite
```

### API Authentication

All API endpoints require the `knotapi` header with the value `012345`. This is configured in:
- Frontend: `config/api.ts`
- Backend: `app/Http/Middleware/ApiKeyMiddleware.php`

## 🗄️ Database Schema

### Contacts Table
- `id` - Primary key
- `first_name` - Contact's first name
- `last_name` - Contact's last name  
- `email` - Contact's email (unique)
- `phone` - Contact's phone number
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

### Contact Histories Table
- `id` - Primary key
- `contact_id` - Foreign key to contacts
- `action` - Type of action (created, updated, deleted)
- `old_data` - Previous data (JSON)
- `new_data` - New data (JSON)
- `user_id` - User who performed the action
- `created_at` - Action timestamp

## 🛠️ Development

### Frontend Development
```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Run linting
pnpm lint
```

### Backend Development
```bash
# Start development server
php artisan serve

# Run migrations
php artisan migrate

# Run tests
php artisan test

# Clear cache
php artisan cache:clear
```

## 📝 Important Files for Deployment

Ensure these files are included when deploying or sharing the project:

### Essential Configuration Files
- `package.json` - Frontend dependencies
- `backend/composer.json` - Backend dependencies
- `backend/composer.lock` - Locked backend dependencies
- `pnpm-lock.yaml` - Locked frontend dependencies
- `tsconfig.json` - TypeScript configuration
- `next.config.mjs` - Next.js configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `components.json` - shadcn/ui configuration

### Environment Templates
- `env.example` - Frontend environment template
- `backend/.env.example` - Backend environment template (if created)

### Database
- `backend/database/migrations/` - All migration files
- `backend/database/seeders/` - Database seeders


### Reset Database
```bash
cd backend
php artisan migrate:fresh
```

### Clear All Caches
```bash
cd backend
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear
```
