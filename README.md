# web-divers-betterme-project
BetterMe project for web competition

*** WellnessCompany ***

Overview

This project implements an admin system for processing Instant Wellness Kit orders delivered within New York State.

The business problem:
Customers are charged only the kit price, but legally the company must calculate and apply the correct composite sales tax based on the delivery location (GPS coordinates). The system determines applicable tax jurisdictions and computes:

composite tax rate

tax amount

total amount

tax breakdown (state, county, city, special districts)

applied jurisdictions

The application provides tools for importing bulk orders, creating manual orders, and browsing stored records with calculated tax data.

Tech Stack

Backend:

Node.js

TypeScript

Express

SQLite (SQL database)

Docker

Frontend:

Next.js (App Router)

TypeScript

SCSS Modules (BEM methodology)

Infrastructure:

Docker & Docker Compose

Architecture

The system follows a layered backend architecture:

Controller → Service → Repository → Database

Controller handles request validation and routing.

Service contains business logic (tax calculation).

Repository handles database interaction.

TaxService encapsulates all tax rules and logic.

Frontend communicates with backend via REST API.

Features

Admin Panel (Frontend):

Import orders from CSV

Create manual order (lat, lon, subtotal)

View paginated orders list

Display calculated tax breakdown

Filter and browse stored records

Backend API:

POST /orders/import

POST /orders

GET /orders (pagination + filtering)

Project Structure
web-divers-betterme-project/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── routes/
│   │   └── db.ts
│   ├── Dockerfile
│   └── package.json
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── styles/
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml
└── README.md
Running the Project

Instruction how to run the project:

Requirements

Docker Desktop installed

Docker Desktop running

Git installed

Verify Docker is working:

docker info

If this fails, Docker is not running.

Clone the Repository
git clone https://github.com/rinata-abdurakhimova/web-divers-betterme-project.git
cd web-divers-betterme-project

Build and Start Containers

For older Docker versions:

docker-compose up --build

For newer Docker versions:

docker compose up --build

This will:

Build backend image

Build frontend image

Start both services

Create internal network

Access the Application

Frontend:
http://localhost:3000

Backend API:
http://localhost:5000

Stop Containers
docker-compose down
