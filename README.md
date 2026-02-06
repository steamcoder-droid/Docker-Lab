# 🐳 Docker Lab – Learn Docker by Doing

Welcome to **Docker Lab** 🎉
This project is designed to help you **learn Docker, Dockerfiles, and Docker Compose** through hands-on practice.

Instead of abstract examples, you’ll work with a **real multi-service application** and containerize it step by step.



## 🎯 Objective

Your task is to:

1. **Containerize each service** in this application using Docker
2. **Write a Dockerfile** for every service
3. **Create a `docker-compose.yml` file** to run the entire application with a single command

By the end, you should be able to start the full app using:

```bash
docker compose up -d
```



## 🧠 What You’ll Learn

This lab will help you understand:

* What Docker is and why it’s useful
* How to write Dockerfiles
* How containers communicate with each other
* How to use Docker Compose for multi-container applications
* Environment variables and service dependencies
* Port mapping and volumes (where applicable)



## 📁 Project Structure

The repository contains **multiple services**, each running independently when not containerized.

Example (structure may vary):

```text
docker-lab/
│
├── auth-service/
│   ├── index.js
│   └── package.json
│
├── product-service/
│   ├── index.js
│   └── package.json
│
├── frontend/
│   └── index.html
│
└── README.md
```

Each service should eventually have its own:

```text
Dockerfile
```

## 🧩 About Application

<img width="1902" height="1064" alt="image" src="https://github.com/user-attachments/assets/0303d7c0-0399-49e1-9aa5-714becb70729" />


This demo application is a **simple multi-service web application** built intentionally for **learning Docker and containerization concepts**.

The app is **not about complex business logic** — it is designed to simulate a **real-world microservices setup** where multiple services must work together to deliver a complete application.


## 🏗️ Architecture at a Glance

The application consists of **multiple independent services**, such as:

* A **frontend service** that provides the user interface
* Authentication Service for handling registration and login
* Product API service for managing product
* Supporting services like databases

Each service:

* Can run independently
* Uses its own runtime and dependencies
* Communicates with other services over the network

This makes the app ideal for learning how Docker handles:

* Service isolation
* Networking between containers
* Environment configuration
* Orchestration using Docker Compose


## 🔍 Why This App Works Well for Learning Docker

* ✅ Multiple services (realistic setup)
* ✅ Clear separation of concerns
* ✅ Easy to containerize incrementally
* ✅ Ideal for experimenting, breaking, and fixing

By containerizing this app, learners gain practical experience they can directly apply to real-world DevOps and cloud projects.

## 🛠️ Tasks

### 1️⃣ Understand the Application

* Identify each service
* Understand what it does
* Note:

  * Port it runs on
  * Dependencies (DB, API, other services)
  * Runtime (Node.js, Python, etc.)



### 2️⃣ Create Dockerfiles

For **each service**:

* Create a `Dockerfile` in the directory of each service
* Use an appropriate base image
* Copy application files
* Install dependencies
* Expose required ports
* Define the startup command

Example:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```



### 3️⃣ Create a Docker Compose File

At the root of the project, create:

```text
docker-compose.yml
```

This file should:

* Define all services
* Build images from Dockerfiles
* Expose required ports
* Set environment variables
* Define service dependencies

Example:

```yaml

services:
  backend:
    build: ./backend
    ports:
      - "4000:4000"

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend
```

## 🔍 Some Hints
* The application requires a postgreSQL database
* Use any Webserver of your choice to host the frontend
* Use environment variables 

## ▶️ Running the Application

Once everything is set up:

```bash
docker compose up --build
```

To stop everything:

```bash
docker compose down
```



## 🧪 Validation Checklist

Before considering the task complete, confirm that:

* ✅ All services start successfully
* ✅ Containers can communicate with each other
* ✅ The application works as expected
* ✅ No service requires manual startup outside Docker



## 🚀 Stretch Goals (Optional)

If you want to go further:

* Add `.dockerignore` files
* Use environment variables instead of hardcoded values
* Add volumes for persistent data
* Optimize Docker image size
* Add health checks



## 📌 Who This Is For

* Beginners learning Docker
* Developers transitioning to DevOps / Cloud
* Anyone who prefers **learning by building**



## 🧑‍💻 Author

Built by **Raphael**
GitHub: [https://github.com/lemrex](https://github.com/lemrex)

