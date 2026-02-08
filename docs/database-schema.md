# Database Schema - FacTot

## Overview
The FacTot platform uses PostgreSQL as the primary database with Sequelize ORM for data modeling and relationships.

## Tables

### 1. users
Stores all user accounts (clients, freelancers, or both)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique user identifier |
| email | VARCHAR(255) | UNIQUE, NOT NULL | User email (login) |
| password_hash | VARCHAR(255) | NOT NULL | Hashed password (bcrypt) |
| first_name | VARCHAR(100) | NOT NULL | User's first name |
| last_name | VARCHAR(100) | NOT NULL | User's last name |
| phone | VARCHAR(20) | | Contact phone number |
| user_type | ENUM | NOT NULL | 'client', 'freelancer', 'both' |
| country | VARCHAR(2) | NOT NULL | Country code (RO/MD) |
| city | VARCHAR(100) | NOT NULL | City name |
| rating | DECIMAL(3,2) | DEFAULT 0 | Average rating (0-5) |
| wallet_balance | DECIMAL(10,2) | DEFAULT 0 | User wallet balance |
| created_at | TIMESTAMP | NOT NULL | Account creation date |
| updated_at | TIMESTAMP | NOT NULL | Last update date |

**Indexes:**
- `email` (unique)
- `user_type`
- `country`

---

### 2. tasks
Job postings created by clients

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique task identifier |
| client_id | UUID | FOREIGN KEY → users.id | Task creator |
| title | VARCHAR(255) | NOT NULL | Task title |
| description | TEXT | NOT NULL | Detailed description |
| country | VARCHAR(2) | NOT NULL | Task location country |
| city | VARCHAR(100) | NOT NULL | Task location city |
| address | VARCHAR(255) | | Specific address (optional) |
| is_remote | BOOLEAN | DEFAULT false | Remote work possible |
| budget_min | DECIMAL(10,2) | NOT NULL | Minimum budget |
| budget_max | DECIMAL(10,2) | | Maximum budget (optional) |
| currency | ENUM | NOT NULL | 'MDL', 'RON', 'EUR', 'USD' |
| status | ENUM | DEFAULT 'draft' | Task status |
| dead_line | DATE | | Deadline (optional) |
| created_at | TIMESTAMP | NOT NULL | Creation date |
| updated_at | TIMESTAMP | NOT NULL | Last update |

**Status Values:**
- `draft` - Not published yet
- `open` - Accepting proposals
- `assigned` - Freelancer selected
- `in_progress` - Work ongoing
- `completed` - Work finished
- `cancelled` - Task cancelled

**Indexes:**
- `client_id`
- `country, city`
- `status`
- `created_at`

---

### 3. proposals
Bids submitted by freelancers to tasks

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique proposal identifier |
| task_id | UUID | FOREIGN KEY → tasks.id | Related task |
| freelancer_id | UUID | FOREIGN KEY → users.id | Proposal creator |
| message | TEXT | NOT NULL | Proposal description |
| price | DECIMAL(10,2) | NOT NULL | Proposed price |
| estimated_days | INTEGER | | Estimated completion days |
| status | ENUM | DEFAULT 'pending' | Proposal status |
| created_at | TIMESTAMP | NOT NULL | Submission date |
| updated_at | TIMESTAMP | NOT NULL | Last update |

**Status Values:**
- `pending` - Awaiting client decision
- `accepted` - Client accepted
- `rejected` - Client rejected
- `cancelled` - Freelancer cancelled

**Indexes:**
- `task_id`
- `freelancer_id`
- `status`
- `task_id, freelancer_id` (unique together)

---

### 4. reviews
Mutual ratings between clients and freelancers

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique review identifier |
| task_id | UUID | FOREIGN KEY → tasks.id | Related task |
| reviewer_id | UUID | FOREIGN KEY → users.id | Who writes review |
| reviewee_id | UUID | FOREIGN KEY → users.id | Who receives review |
| rating | INTEGER | NOT NULL, 1-5 | Star rating |
| comment | TEXT | | Review text (optional) |
| created_at | TIMESTAMP | NOT NULL | Review date |
| updated_at | TIMESTAMP | NOT NULL | Last update |

**Constraints:**
- `rating` must be between 1 and 5
- `task_id, reviewer_id, reviewee_id` unique together

**Indexes:**
- `task_id`
- `reviewer_id`
- `reviewee_id`

---

## Relationships

### One-to-Many

**users → tasks (as client)**
- One user can create many tasks
- `tasks.client_id` → `users.id`

**users → proposals (as freelancer)**
- One freelancer can submit many proposals
- `proposals.freelancer_id` → `users.id`

**tasks → proposals**
- One task can receive many proposals
- `proposals.task_id` → `tasks.id`

**tasks → reviews**
- One task can have multiple reviews (client + freelancer)
- `reviews.task_id` → `tasks.id`

### Many-to-Many (through reviews)

**users ↔ users (reviews)**
- Users can review each other
- `reviews.reviewer_id` → `users.id`
- `reviews.reviewee_id` → `users.id`

---

## ER Diagram
```
┌─────────────┐
│    users    │
│─────────────│
│ id (PK)     │───┐
│ email       │   │
│ user_type   │   │
│ rating      │   │
└─────────────┘   │
                  │
                  │ client_id (FK)
                  │
                  ▼
            ┌─────────────┐
            │    tasks    │
            │─────────────│
            │ id (PK)     │───┐
            │ client_id   │   │
            │ title       │   │
            │ status      │   │
            └─────────────┘   │
                              │ task_id (FK)
                              │
                              ▼
                        ┌─────────────┐
                        │  proposals  │
    ┌───────────────────│─────────────│
    │ freelancer_id (FK)│ id (PK)     │
    │                   │ task_id     │
    │                   │ status      │
    │                   └─────────────┘
    │
    │
    │            ┌─────────────┐
    └───────────►│   reviews   │
                 │─────────────│
                 │ id (PK)     │
                 │ task_id     │
                 │ reviewer_id │
                 │ reviewee_id │
                 │ rating      │
                 └─────────────┘
```

---

## Business Rules

### Task Lifecycle
1. **draft** → Client creates task (not visible to freelancers)
2. **open** → Task published (freelancers can apply)
3. **assigned** → Client accepts a proposal
4. **in_progress** → Work is ongoing (optional status)
5. **completed** → Task finished, reviews can be written
6. **cancelled** → Task cancelled (any stage)

### Proposal Rules
- Freelancer cannot apply twice to same task
- Freelancer cannot apply to own task (if user_type = 'both')
- Only task owner can accept/reject proposals
- Accepting one proposal auto-rejects others

### Review Rules
- Reviews only possible after task status = 'completed'
- Each party (client & freelancer) can review once per task
- Rating updates user's average rating automatically
- Cannot review yourself

### Rating Calculation
- Average of all reviews received
- Rounded to 2 decimal places
- Updated automatically on new review

---

## Indexes Strategy

### Performance Optimization
- Foreign keys indexed automatically
- Composite indexes for common queries:
  - `tasks (country, city)` - Location filtering
  - `proposals (task_id, status)` - Task proposals with status
  - `reviews (reviewee_id)` - User rating calculation

### Query Patterns
```sql
-- Common queries optimized by indexes:

-- Get open tasks in a city
SELECT * FROM tasks 
WHERE country = 'RO' AND city = 'București' AND status = 'open';

-- Get pending proposals for a task
SELECT * FROM proposals 
WHERE task_id = ? AND status = 'pending';

-- Calculate user rating
SELECT AVG(rating) FROM reviews 
WHERE reviewee_id = ?;
```

---

## Data Integrity

### Constraints
- All foreign keys have ON DELETE CASCADE
- Enum fields validated at database level
- NOT NULL enforced on critical fields
- Unique constraints on (email, task+freelancer combo)

### Validation
- Email format validated in application layer
- Phone format validated (optional field)
- Budget min ≤ budget max
- Rating between 1-5
- Dates validated (deadline ≥ created_at)