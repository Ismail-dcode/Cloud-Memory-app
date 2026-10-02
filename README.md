# Memory Diary (Cloud-Dairy)

A private digital photo diary. Create memories with photos, thoughts, places, and dates — your photos live in Amazon S3, your data in Amazon DynamoDB, and the app runs as a Docker container.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite), Tailwind CSS, lucide-react |
| Backend | Node.js + Express 5 |
| Database | Amazon DynamoDB (`Users`, `Memories` tables) |
| Image Storage | Amazon S3 (private bucket, presigned URLs) |
| Auth | Email/Username + bcrypt password hash + JWT |
| Container | Docker (multi-stage, non-root) |

## Architecture (local / current)

```
Browser
   │
   ▼
Docker container (port 3000)
   ├─ Express serves React build (frontend/dist)
   ├─ /api/auth/*   → register / login / me / profile
   ├─ /api/memories → full CRUD, S3 upload + presigned URLs
   │
   ├─► Amazon DynamoDB  (Users, Memories)
   └─► Amazon S3       (users/{userId}/memories/{memoryId}/...)
```

## Project Structure

```
server.js                  → Express entry: JSON, static, routes, SPA fallback
src/
  config/dynamodb.js       → DynamoDB DocumentClient
  middleware/authMiddleware.js → JWT verification
  controllers/             → authController, memoryController
  routes/                  → authRoutes, memoryRoutes, uploadRoutes
  services/                → authService, userService, memoryService, s3Service
  utils/fileValidation.js  → JPEG/PNG/WebP, 5MB limit
frontend/                  → React + Vite + Tailwind app
public/                    → legacy static assets
Dockerfile                 → multi-stage build
.dockerignore
.env.example
```

## Environment Variables

Copy `.env.example` to `.env` and fill in real values. **`.env` is git-ignored — never commit it.**

| Variable | Required | Notes |
|---|---|---|
| `PORT` | yes (default 3000) | |
| `AWS_REGION` | yes | e.g. `us-east-1` |
| `AWS_ACCESS_KEY_ID` | yes (local) | not needed when using ECS task role |
| `AWS_SECRET_ACCESS_KEY` | yes (local) | not needed when using ECS task role |
| `S3_BUCKET_NAME` | yes | |
| `DYNAMODB_USERS_TABLE` | yes (default `Users`) | |
| `DYNAMODB_MEMORIES_TABLE` | yes (default `Memories`) | |
| `AUTH_SECRET` | yes | random 64-hex string; changing it logs everyone out |

## Run Locally (without Docker)

```bash
# Backend
npm install
npm start                 # http://localhost:3000

# Frontend dev server (hot reload, proxies /api to :3000)
cd frontend
npm install
npm run dev               # http://localhost:5173
```

## Run With Docker

Build the image once:

```bash
docker build -t cloud-memory:latest .
```

Run using your local `.env`:

```bash
docker run -d --name app1 --env-file .env -p 3030:3000 cloud-memory:latest
```

Run with overridden AWS credentials at runtime (no rebuild needed):

```bash
docker run -d --name app1 -p 3030:3000 \
  -e AWS_ACCESS_KEY_ID=NEW_KEY \
  -e AWS_SECRET_ACCESS_KEY=NEW_SECRET \
  -e AWS_REGION=us-east-1 \
  -e AUTH_SECRET=... \
  -e S3_BUCKET_NAME=... \
  cloud-memory:latest
```

> **Note:** `.env` files use LF line endings. CRLF breaks `--env-file` parsing (missing-region errors).

The image is already published to Docker Hub:

```
docker pull <your-dockerhub-username>/cloud-memory:latest
```

## API Overview

```
POST /api/auth/register   { name, username, email, password, confirmPassword }
POST /api/auth/login      { identifier, password }   # username OR email
POST /api/auth/logout
GET  /api/auth/me
PUT  /api/auth/profile    { name?, bio? }

POST   /api/memories      multipart: title, thought, place, date, photos[]
GET    /api/memories
GET    /api/memories/:id
PUT    /api/memories/:id
DELETE /api/memories/:id

POST   /upload            (legacy single-image upload)
```

All memory routes require `Authorization: Bearer <token>` and enforce **per-user ownership** server-side.

## Security Notes

- Passwords are bcrypt-hashed; hashes are never returned by the API.
- JWTs signed with `AUTH_SECRET`; changing the secret invalidates all sessions.
- S3 bucket is private — photos are served via 1-hour presigned URLs.
- `.env` and AWS keys are excluded from the Docker image via `.dockerignore`.
- Container runs as the non-root `node` user.

## Future Tasks — Cloud Deployment Roadmap

- [ ] Push image to **Amazon ECR**
- [ ] Deploy to **ECS Fargate** (task role with S3 + DynamoDB permissions → no more env credentials)
- [ ] **Application Load Balancer** with HTTPS via **ACM**
- [ ] **Route 53** DNS
- [ ] **Secrets Manager** for `AUTH_SECRET` and other secrets
- [ ] **CloudWatch** logs + metrics + alarms
- [ ] ECS **Auto Scaling** based on CPU/requests
- [ ] **VPC** networking (private subnets for tasks, NAT for AWS API access)
- [ ] **GitHub Actions** CI/CD: build → push to ECR → deploy to ECS
- [ ] **Terraform** to codify the whole infrastructure
- [ ] Docker Hub image publishing as part of CI

## Docker Hub

Image is published at: `<your-dockerhub-username>/cloud-memory:latest`

```bash
docker pull <your-dockerhub-username>/cloud-memory:latest
```
