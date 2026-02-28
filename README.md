# web-divers-betterme-project
BetterMe project for web competition

*** WellnessCompany ***

# BetterMe: Intelligent Tax Compliance System for Drone Delivery

## Strategic Overview & Business Context
The BetterMe story began with a bold vision: a group of friends leaving university to launch a game-changing wellness service. After securing a drone delivery license for New York State, we introduced "Instant Wellness Kits"—compact resets delivered in 20-30 minutes. Rapid viral success, however, led to a critical oversight: we completely ignored taxation. The Tax Service issued a 48-hour ultimatum: implement a compliant sales tax system or face shutdown. Our solution doesn't just fix this "leak"—it transforms a legal threat into a technological advantage, allowing the company to scale instantly.

## Problem Analysis & Strategic Decisions
The core challenge was that users were only paying the kit price, while legislation requires a complex composite sales tax based on GPS coordinates. We analyzed the U.S. tax structure and realized that a simple "New York-only" fix was a dead end. While the initial requirement focused on NY State, we made the strategic decision to build an architecture that already supports tax rules for all 50 states and Washington D.C.. This means BetterMe can launch in California or Texas tomorrow without a single extra minute spent on tax module development.

## Exceeding Expectations: Why Our Solution Wins
We deliberately went beyond the technical requirements to ensure maximum business resilience:
**Hyper-Local Precision:** We implemented a detailed tax breakdown at the state, county, and city levels . This includes specific surcharges like the **MCTD** for New York, ensuring 100% legal integrity across all local jurisdictions.
**Autonomous Geofencing:** To prevent logistics errors, we integrated a Geofencing system that automatically validates delivery coordinates. If a drone is accidentally routed outside the U.S., the system blocks the order, preventing fraudulent reporting and operational waste.
 **High-Performance Bulk Import:** Instead of slow row-by-row processing, we optimized CSV imports using **PostgreSQL UNNEST**. This allows the system to process thousands of orders in milliseconds—a necessity for a viral startup during peak demand.

## Technical Integrity & Architecture
We chose a modern, industrial-grade stack to ensure the stability of financial data :
**Backend:** Node.js with TypeScript for robust type safety, ensuring no rounding errors in financial calculations.
**Architecture:** A clean layered pattern (**Controller → Service → Repository**) to separate business logic from data persistence.
**Database:** PostgreSQL, chosen for its reliability and ability to handle complex JSON breakdowns for audit trails.
**Frontend:** A reactive Next.js Admin Panel (App Router) that provides managers with transparent tools for monitoring, manual order creation, and advanced filtering by date or tax amount.


## Running the Project
### **Requirements**
* **Docker Desktop** installed and running.
* **Git** installed.
* Verify Docker is working by running `docker info` in your terminal.

### **1. Clone the Repository**
```bash
git clone https://github.com/rinata-abdurakhimova/web-divers-betterme-project.git
cd web-divers-betterme-project
```

### **2. Build and Start Containers**
Use the following command to build the images and start the services:
```bash
docker compose up --build
```
This will automatically build the backend and frontend images, start both services, and set up the internal network.

### **3. Access the Application**
* **Frontend (Admin Panel):** [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000)
* **Backend API:** [http://localhost:5000](https://www.google.com/search?q=http://localhost:5000)

### **4. Stop Containers**
To stop the services, run:
```bash
docker compose down
```

## API Reference
`POST /orders/import` – Validated CSV bulk upload.
`POST /orders` – Manual order creation with instant tax calculation.
`GET /orders` – Paginated list with multi-parameter filtering.

## Technical Deep Dive
### Database Schema (PostgreSQL)
We chose PostgreSQL as our primary data store due to its reliability and robust support for the JSONB type, which is used to store complex tax breakdown structures. This approach allows us to maintain detailed information about every tax levy without overcomplicating the relational table schema.

### Project Structure
The project is organized as a monorepo with a clear separation between the Frontend and Backend, which facilitates seamless deployment and orchestration via Docker.

web-divers-betterme-project/
├── backend/
│   ├── src/
│   │   ├── controllers/   
│   │   ├── services/       
│   │   ├── repositories/   
│   │   └── routes/        
│   └── Dockerfile
├── frontend/
│   ├── app/                
│   ├── components/         
│   └── Dockerfile
├── docker-compose.yml      
└── README.md


### Architectural Principles
1. **Layered Architecture:** We separated responsibilities into distinct layers (Controller → Service → Repository) . This allows for the business logic of tax calculations to be tested independently of the database.
2. **DRY (Don't Repeat Yourself):** Coordinate validation (Geofencing) is extracted into a dedicated service, making it available for both single order creation and bulk CSV imports.
3. **Bulk Processing:** For CSV ingestion, we utilize memory buffering (multer.memoryStorage()) combined with SQL UNNEST queries. This ensures peak performance and maximum speed when processing large datasets.
4. **Type Safety:** The entire codebase is built with TypeScript, significantly reducing runtime errors when dealing with sensitive financial data and complex tax breakdown structures.

