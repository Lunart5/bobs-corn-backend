```markdown
# Backend - Bob's Corn

REST API for a corn sales system built with Node.js, Express, PostgreSQL, Redis, and Sequelize.

## Technologies

- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **PostgreSQL** - Relational database
- **Sequelize** - ORM for PostgreSQL
- **Redis** - Cache and rate limiting
- **Docker** - Containers for PostgreSQL and Redis
- **JWT** - Token-based authentication

## Prerequisites

- Node.js 18+ 
- Docker and Docker Compose
- npm or yarn

## Installation

1. Clone the backend repository

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Create a `.env` file in the root:
\`\`\`env
# Server
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/bobscorn_db

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your_super_secure_secret_here
\`\`\`

## Docker Configuration

### Start PostgreSQL and Redis

Create a `docker-compose.yml` file:

### Docker Commands

\`\`\`bash
# Start containers
docker-compose up -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose down

# Stop and remove volumes (deletes data)
docker-compose down -v
\`\`\`


### Create Tables

\`\`\`bash
# Run migrations with Sequelize
npm run migrate
\`\`\`

### Fill Tables

\`\`\`bash
# Run seeders with Sequelize
npm run seed
\`\`\`



## Run the Server

\`\`\`bash
# Development with hot-reload
npm run dev

# Production
npm start
\`\`\`

The server will be available at `http://localhost:3000`

## Test Users
admin:
    admin@admin.com
    password123

user:
    test@admin.com
    password123


## Security

- Passwords hashed with bcrypt
- JWT tokens with expiration
- Input validation on all endpoints
- Rate limiting to prevent abuse
- CORS properly configured
- Environment variables for secrets
- Sequelize parameterized queries to prevent SQL injection
