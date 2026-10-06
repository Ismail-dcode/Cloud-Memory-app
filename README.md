<div align="center">

# Memory Diary

### A private digital photo diary for capturing and managing personal memories.

[![CI/CD](https://img.shields.io/github/actions/workflow/status/Ismail-dcode/Cloud-Memory-app/deploy.yml?branch=main&style=flat-square&label=CI%2FCD)](https://github.com/Ismail-dcode/Cloud-Memory-app/actions)
[![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com/)
[![AWS](https://img.shields.io/badge/AWS-Cloud%20Services-232F3E?style=flat-square&logo=amazonaws&logoColor=white)](https://aws.amazon.com/)
[![Render](https://img.shields.io/badge/Render-Deployed-46E3B7?style=flat-square&logo=render&logoColor=black)](https://render.com/)

[![Live Demo](https://img.shields.io/badge/Live-Demo-2ea44f?style=flat-square&logo=googlechrome&logoColor=white)](https://memory-dairy.ismailshaikh.in/)

</div>

---

## Overview

**Memory Diary** is a full-stack web application for creating and managing personal memories with photos, thoughts, places, and dates.

The application uses React on the frontend and Node.js/Express on the backend. Application data is stored in Amazon DynamoDB, while photos are stored in a private Amazon S3 bucket. The application is packaged as a Docker image, published to Docker Hub, and deployed on Render.

GitHub Actions provides the CI/CD pipeline that automatically builds and publishes a new Docker image and triggers a Render deployment when changes are pushed to `main`.

---

## Technology Stack

<div align="center">

<img src="https://skillicons.dev/icons?i=react,vite,tailwind,nodejs,express,docker,github,aws&perline=8" alt="Technology stack" />

<br><br>

[![DynamoDB](https://img.shields.io/badge/Amazon%20DynamoDB-4053D6?style=for-the-badge&logo=amazondynamodb&logoColor=white)](https://aws.amazon.com/dynamodb/)
[![S3](https://img.shields.io/badge/Amazon%20S3-569A31?style=for-the-badge&logo=amazons3&logoColor=white)](https://aws.amazon.com/s3/)
[![Docker Hub](https://img.shields.io/badge/Docker%20Hub-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://hub.docker.com/)
[![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)](https://github.com/features/actions)
[![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=111111)](https://render.com/)

</div>

| Component | Technology |
|---|---|
| Frontend | React, Vite, Tailwind CSS, lucide-react |
| Backend | Node.js, Express 5 |
| Database | Amazon DynamoDB |
| Object Storage | Amazon S3 |
| Authentication | JWT, bcrypt |
| Containerization | Docker |
| Container Registry | Docker Hub |
| CI/CD | GitHub Actions |
| Deployment | Render |

---

## Architecture

```text
                         ┌─────────────────────┐
                         │    React Frontend   │
                         │  Vite + Tailwind    │
                         └──────────┬──────────┘
                                    │
                              HTTPS / JSON
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │   Node.js + Express │
                         │       REST API      │
                         └─────────┬───┬───────┘
                                   │   │
                         AWS SDK    │   │    AWS SDK
                                   │   │
                    ┌──────────────▼─┐ └─▼───────────────┐
                    │ Amazon        │   │ Amazon S3      │
                    │ DynamoDB      │   │ Private Bucket │
                    │               │   │                │
                    │ Users         │   │ Memory Photos  │
                    │ Memories      │   │ Presigned URLs │
                    └───────────────┘   └────────────────┘
```

The backend serves the production React build and provides the application API. DynamoDB stores users and memory metadata, while S3 stores the associated image files.

---

## Application Flow

### Authentication

```text
Register / Login
       │
       ▼
Express API
       │
       ├── bcrypt password hashing / verification
       │
       └── JWT generation
              │
              ▼
       Authenticated request
              │
              ▼
        JWT verification
              │
              ▼
           API access
```

### Creating a Memory

```text
User
 │
 │ title, thought, place, date, photos
 ▼
Express API
 │
 ├───────────────┐
 ▼               ▼
Amazon S3     DynamoDB
Photos        Memory metadata
 │               │
 └───────┬───────┘
         ▼
   Memory available
   to authenticated user
```

---

## AWS Resources

### Amazon DynamoDB

The application uses two tables.

**Users**

```text
userId
name
username
email
passwordHash
createdAt
```

**Memories**

```text
memoryId
userId
title
thought
place
photos
createdAt
updatedAt
```

The `userId` relationship is used to retrieve a user's memories and enforce ownership in the backend.

### Amazon S3

Photos are stored using a user- and memory-based object structure:

```text
users/
└── {userId}/
    └── memories/
        └── {memoryId}/
            ├── photo1.jpg
            ├── photo2.jpg
            └── photo3.jpg
```

The bucket is private. The application generates presigned URLs when a stored image needs to be displayed.

---

## Docker

The application is packaged as a Docker image.

### Build

```bash
docker build -t cloud-memory:latest .
```

### Run

```bash
docker run -d \
  --name cloud-memory \
  --env-file .env \
  -p 3030:3000 \
  cloud-memory:latest
```

Configuration values and AWS credentials are supplied at runtime rather than embedded in the image.

---

## CI/CD

The project uses **GitHub Actions** to automate Docker image creation and deployment.

```text
Developer
    │
    │ git push origin main
    ▼
┌─────────────┐
│   GitHub    │
└──────┬──────┘
       │
       ▼
┌────────────────────┐
│   GitHub Actions   │
│                    │
│ Checkout           │
│ Docker Buildx      │
│ Docker Login       │
│ Docker Build       │
│ Docker Push        │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│    Docker Hub      │
│                    │
│ :latest            │
│ :commit-sha        │
└─────────┬──────────┘
          │
          │ Deploy Hook
          ▼
┌────────────────────┐
│      Render        │
│                    │
│ Pull new image     │
│ Replace container  │
│ Start new version  │
└─────────┬──────────┘
          │
          ▼
     Live Application
```

The workflow is located at:

```text
.github/workflows/docker-deploy.yml
```

### Workflow

```yaml
name: Build, Push & Deploy

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  build-push-deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: docker/setup-buildx-action@v3

      - uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}

      - uses: docker/build-push-action@v6
        with:
          context: .
          push: true
          tags: |
            ${{ secrets.DOCKERHUB_USERNAME }}/cloud-memory:latest
            ${{ secrets.DOCKERHUB_USERNAME }}/cloud-memory:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

      - name: Trigger Render deploy
        run: curl -fsS -X POST "${{ secrets.RENDER_DEPLOY_HOOK_URL }}"
```

### Image Tags

Each successful build publishes two tags:

```text
cloud-memory:latest
cloud-memory:<commit-sha>
```

`latest` represents the image used for the current deployment. The commit SHA provides traceability to the source revision that produced the image.

### GitHub Secrets

| Secret | Purpose |
|---|---|
| `DOCKERHUB_USERNAME` | Docker Hub username |
| `DOCKERHUB_TOKEN` | Docker Hub access token |
| `RENDER_DEPLOY_HOOK_URL` | Render deployment hook |

Credentials are stored in GitHub repository secrets and are not committed to the repository.

---

## Deployment

Current deployment path:

```text
GitHub
   │
   ▼
GitHub Actions
   │
   ▼
Docker Hub
   │
   ▼
Render
   │
   ▼
Live Application
   │
   ├── Amazon DynamoDB
   └── Amazon S3
```

Render runs the Docker image published to Docker Hub. After GitHub Actions pushes a new image, it calls the Render deploy hook so the service can deploy the updated image.

---

## Project Structure

```text
.
├── server.js
├── src/
│   ├── config/
│   │   └── dynamodb.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── memoryController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── memoryRoutes.js
│   │   └── uploadRoutes.js
│   ├── services/
│   │   ├── authService.js
│   │   ├── userService.js
│   │   ├── memoryService.js
│   │   └── s3Service.js
│   └── utils/
│       └── fileValidation.js
├── frontend/
├── public/
├── Dockerfile
├── .dockerignore
├── .env.example
└── .github/
    └── workflows/
        └── docker-deploy.yml
```

---

## Environment Variables

Create a `.env` file based on `.env.example`.

```env
PORT=3000

AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key

S3_BUCKET_NAME=your_bucket

DYNAMODB_USERS_TABLE=Users
DYNAMODB_MEMORIES_TABLE=Memories

AUTH_SECRET=your_secret
```

Do not commit `.env` to the repository.

---

## Local Development

### Backend

```bash
npm install
npm start
```

Backend:

```text
http://localhost:3000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

## API

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
PUT  /api/auth/profile
```

### Memories

```http
POST   /api/memories
GET    /api/memories
GET    /api/memories/:id
PUT    /api/memories/:id
DELETE /api/memories/:id
```

### Upload

```http
POST /upload
```

Protected memory endpoints require:

```http
Authorization: Bearer <token>
```

The backend validates ownership before allowing users to access or modify their memories.

---

## Security

- Passwords are hashed using bcrypt.
- JWTs are signed using `AUTH_SECRET`.
- S3 is configured as private storage.
- Photos are accessed through presigned URLs.
- Memory ownership is checked on the server.
- AWS credentials are supplied through environment variables.
- `.env` is excluded from source control.
- AWS credentials are not copied into the Docker image.
- The Docker container runs as a non-root user.
- Uploaded images are validated by the application.

---

## Docker Hub

The production image is published as:

```text
<your-dockerhub-username>/cloud-memory:latest
```

Pull the latest image:

```bash
docker pull <your-dockerhub-username>/cloud-memory:latest
```

A specific CI/CD build can be referenced by its Git commit SHA:

```text
<your-dockerhub-username>/cloud-memory:<commit-sha>
```

---

## Current Deployment vs. Future Architecture

### Current

```text
Docker
  ↓
Docker Hub
  ↓
Render
```

AWS services currently used:

```text
Amazon DynamoDB
Amazon S3
```

### Potential Future Improvements

- Amazon ECR
- Amazon ECS Fargate
- IAM task roles
- AWS Secrets Manager
- Application Load Balancer
- AWS Certificate Manager
- Route 53
- CloudWatch
- ECS Auto Scaling
- Terraform

These are future infrastructure options and are not part of the current deployment.

---

<div align="center">

### Memory Diary

Built with React, Node.js, AWS, Docker and GitHub Actions.

</div>
