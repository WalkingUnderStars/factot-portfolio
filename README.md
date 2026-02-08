# Fac-Tot - Freelance MarketPlace Platform
> **Portofolio Version:** This repository showcase selected code samples and arhitecture. The full application is deployed and functional.

# Live Demo
**Comming soon** - Currently in deployment phase

# About
Fac Tot is a full-stack freelance marketplace platform that connects clients with freelancers for lcoal and remote tasks. Built with modern web technologies and best practicies.

## Key Features

### Authetification System
- JWT-based secure authentification
- Pasword hashing with bcrypt
- Role-based access control (Client/Freelancer/Both)
- Protected routes and middleware

### Task Management
- Create, read, update, delete tasks.
- Advanced filtering (location, budget, status)
- Pagination for large datasets
- Role-based permisions

### Review & Rating System
- Mutual reviews between client and freelancers
- Automatic average rating calculation
- Review history and statistics
- Trust-building throught transparency

### Tech Stack

### BackEnd
- **Runtime:** Node.js
- **Framework:** Express.js
- **DataBase:** PostgresSQL
- **ORM:** Sequelize
- **Authentification:** JWT (jsonwebtoken)
- **Security:** bcrypt, input validation

### Frontend
- **Library:** React 18
- **Routing:** React Router V6
- **State Managemnet:** Context API
- **HTTP Client:** Axios
- **Styling:** InLine styles (migrating to CSS modules)

### DevOps
- **Version Control:** Git/Github
- **BackEnd Hosting:** Railway (PostgreSQL + Node.js)
- **FrontEnd Hosting:** Vercel
- **CI/CD:** GitHub integration

## Project Arhitecture
BackEnd (MVC Pattern)
-- controllers/         # Bussiness logic
-- models/              # Database model & relationships
-- routes/              # API endpoints
-- middleware/          # Authentification & validation
-- config/              # Database configuration

FrontEnd (Component-Based)
-- pages/               # Route components
-- components/          # Reusable UI components
-- context/             # Global state management
-- api/                 # Centralized API service

## Code Samples

### BackEnd Examples
- **[authController.js](./code-samples/backend/authController.js)** - User authentication & registration
- **[taskController.js](./code-samples/backend/taskController.js)** - Task CRUD operations
- **[Task.js](./code-samples/backend/Task.js)** - Task model with validations
- **[index.js](./code-samples/backend/index.js)** - Model relationships
- **[auth.js](./code-samples/backend/auth.js)** - JWT verification middleware

### Frontend Examples
- **[Dashboard.js](./code-samples/frontend/Dashboard.js)** - Main dashboard component
- **[TaskDetail.js](./code-samples/frontend/TaskDetail.js)** - Task details & proposals
- **[AuthContext.js](./code-samples/frontend/AuthContext.js)** - Authentication state management
- **[api.js](./code-samples/frontend/api.js)** - API service with interceptors

## 🗄️ Database Schema

### Core Tables
- **users** - User accounts with role distinction
- **tasks** - Job postings with budget and location
- **proposals** - Bids submitted by freelancers
- **reviews** - Mutual rating system

### Key Relationships
```
users (1) ──── (N) tasks       (Client creates tasks)
users (1) ──── (N) proposals   (Freelancer submits proposals)
tasks (1) ──── (N) proposals   (Task receives proposals)
users (N) ──── (N) reviews     (Mutual reviews)
```

## Security Features
- JWT token-based authetification
- Password hashing (bcrypt, 10 rounds)
- Protected API routes
- Input validation and sanitization
- SQL injection prevention (Sequelize ORM)
- Cors configuration
- Environment variables for secrets

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (protected)

### Tasks
- `GET /api/tasks` - List tasks (with filters)
- `GET /api/tasks/:id` - Get task details
- `POST /api/tasks` - Create task (protected)
- `PUT /api/tasks/:id` - Update task (protected)
- `DELETE /api/tasks/:id` - Delete task (protected)

### Proposals
- `POST /api/proposals` - Create proposal (protected)
- `GET /api/proposals/task/:taskId` - Get task proposals (protected)
- `GET /api/proposals/my` - Get my proposals (protected)
- `PUT /api/proposals/:id/accept` - Accept proposal (protected)
- `PUT /api/proposals/:id/reject` - Reject proposal (protected)

### Reviews
- `POST /api/reviews` - Create review (protected)
- `GET /api/reviews/user/:userId` - Get user reviews
- `PUT /api/reviews/task/:taskId/complete` - Complete task (protected)

## Design Patterns

- **MVC Architecture** - Separation of concerns
- **Repository Pattern** - Data access abstraction
- **Middleware Pattern** - Request processing pipeline
- **Context Pattern** - Global state management (React)
- **Component Composition** - Reusable UI components

## Development Highlights

### Backend
- RESTful API design principles
- Sequelize ORM with migrations
- Async/await error handling
- Centralized error responses
- Database relationships and joins

### Frontend
- React Hooks (useState, useEffect, useContext)
- Custom API service with Axios interceptors
- Protected routes with conditional rendering
- Role-based UI components
- Responsive design principles

## Performance Consideration
- Database indexing on foreign keys
- Efficient query optimization
- Pagination for large datasets
- JWT token expiration management
- API response structure standardization

## Planned Enchancements
- Real-time chat (Socket.io)
- Push notification system
- Payment integration (Striple/PayPal/MIA/Revolut)
- React Native mobile app
- Dark mode themes
- Analutics dashboard
- Advanced search with Elasticsearch

## Screenshots
*Screenshots will be added after deployment*

## Learning Outcomes
This project demonstrates proficiency in:
- Full-stack JavaScript development
- RESTful API design and implementation
- Relational database design and ORM usage
- Modern React patterns and hooks
- Authentication and authorization
- Git version control and collaboration
- Deployment and DevOps basics

# Developer
**Vasilean Mihail**
- Email: vasilean777@gmail.com
- GitHub: [@WalkingUnderStars](https://github.com/WalkingUnderStars)
- Linkedin: *[Soon...]*

**Note:** This is a portfolio repository showcasing code architecture and samples. Full source code is available for review upon request by potential employers.

**Project Status:** Active Development | Deploying Soon 