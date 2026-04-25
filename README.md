# ParkEase

ParkEase is a comprehensive parking, tyre clinic, and battery management system designed for parking attendants and service managers.

## Features
- **Parking Management**: Register vehicle arrivals, track parking transactions, and sign out vehicles.
- **Service Management**: Record transactions for tyre services and battery hires/sales.
- **Reporting**: Generate daily revenue reports and monitor overall system activity.

## Getting Started

1. **Prerequisites**: Ensure you have Node.js and an active AI Studio development environment.
2. **Environment Setup**:
   - The project uses Next.js 15+ with Tailwind CSS for styling.
   - Database: SQLite (via `better-sqlite3`).
3. **Execution**:
   - Run `npm install`.
   - Run `npm run dev` to start the development server on port 3000.

## Database Structure

The project uses SQLite for local storage. Ensure `parkease.db` is initialized on startup.
- `users`: Authentication data.
- `vehicle_entries`: Stores tracked vehicle records.

## Security & Maintenance
- All user input is sanitized before database insertion (using parameterized queries).
- Ensure valid input for fields like 'number_plate'.
