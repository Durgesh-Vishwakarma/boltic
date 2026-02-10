# Automated Chaser Agent

## Overview

Automated Chaser Agent is a full-stack task tracking and follow-up system that eliminates manual reminders.
It behaves like a human program manager by automatically chasing overdue tasks and acknowledging task completion.

The system is built using React, Node.js, MongoDB, and Boltic workflows.

## Problem Statement

Manual follow-ups for tasks are inefficient and error-prone. Teams often miss deadlines because reminders depend on human intervention.

This project automates:

- Deadline-based reminders for overdue tasks
- Manual acknowledgments when a task is completed

## Tech Stack

- Frontend: React (Vite)
- Backend: Node.js, Express
- Database: MongoDB
- Automation: Boltic
- Deployment:
  - Backend: Render
  - Frontend: Vercel

## Core Features

- Create, update, and delete tasks
- Assign tasks to users via email
- Track task status (Pending, In Progress, Completed)
- Automatically detect overdue tasks
- Trigger automated reminders using Boltic
- Trigger acknowledgment workflow on task completion

## Architecture

### Frontend

- React UI for task creation and management
- Status updates trigger backend APIs
- Clean UX with overdue indicators and stats

### Backend

- REST APIs for task management
- MongoDB for persistence
- Webhook trigger to Boltic on task completion

### Boltic Workflows

#### Scheduled Chaser Workflow

- Periodically fetches overdue tasks
- Sends reminders using Log or Email action

#### Task Completion Workflow

- Triggered via webhook from backend
- Acknowledges task completion

## API Endpoints

| Method | Endpoint                | Description         |
| ------ | ----------------------- | ------------------- |
| POST   | /api/tasks              | Create task         |
| GET    | /api/tasks              | Fetch tasks         |
| GET    | /api/tasks?overdue=true | Fetch overdue tasks |
| PATCH  | /api/tasks/:id/status   | Update status       |
| DELETE | /api/tasks/:id          | Delete task         |

## Environment Variables

## Getting Started

1. Clone the repository
2. Setup backend and frontend environment variables
3. Start backend and frontend servers
4. Configure Boltic workflows and webhooks


### Backend

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
BOLTIC_WEBHOOK_URL=your_boltic_webhook_url
```

### Frontend

```
VITE_API_BASE_URL=https://your-backend.onrender.com/api
```

## How Automation Works

- Boltic schedule triggers the Chaser workflow
- Backend API returns overdue tasks
- Workflow checks if tasks exist
- Loop sends reminders
- When a task is marked COMPLETED
- Backend triggers Boltic webhook
- Acknowledgment workflow runs

## Demo Video

The demo explains:

- Problem statement
- Application flow
- Backend APIs
- Boltic workflows
- End-to-end automation

## Conclusion

This project demonstrates a scalable, automation-driven approach to task follow-ups using Boltic workflows integrated with a modern full-stack application.
