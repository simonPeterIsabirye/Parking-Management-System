import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

// -------------------------
// Environment Detection
// -------------------------
const isProduction = process.env.NODE_ENV === "production";

// -------------------------
// Safe Database Path Strategy
// -------------------------
// IMPORTANT:
// - Render free tier: no guaranteed /data disk
// - Local dev: use project directory
// - Production fallback: project directory (safe default)

const baseDir = isProduction
  ? path.join(process.cwd(), "data") // safe fallback for Render free tier
  : path.join(process.cwd(), "data");

// Ensure directory exists BEFORE opening DB
fs.mkdirSync(baseDir, { recursive: true });

// Final DB file path
const dbPath = path.join(baseDir, "parkease.db");

// -------------------------
// Initialize Database
// -------------------------
// NOTE: This runs ONLY on server runtime (see below fix in pages)
const db = new Database(dbPath);

// -------------------------
// Initialize Tables (idempotent)
// -------------------------
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    email TEXT
  );

  CREATE TABLE IF NOT EXISTS vehicle_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    driver_name TEXT NOT NULL,
    number_plate TEXT UNIQUE NOT NULL,
    vehicle_model TEXT,
    vehicle_color TEXT,
    arrival_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    phone_number TEXT,
    nin_number TEXT,
    is_signed_out BOOLEAN DEFAULT 0,
    registered_by INTEGER,
    parking_type TEXT DEFAULT 'hourly',
    FOREIGN KEY (registered_by) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS parking_transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    receipt_number TEXT UNIQUE NOT NULL,
    vehicle_id INTEGER NOT NULL UNIQUE,
    amount REAL NOT NULL,
    pricing_band TEXT,
    duration_minutes INTEGER,
    FOREIGN KEY (vehicle_id) REFERENCES vehicle_entries(id)
  );

  CREATE TABLE IF NOT EXISTS vehicle_sign_outs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vehicle_id INTEGER NOT NULL UNIQUE,
    receipt_number TEXT NOT NULL,
    receiver_name TEXT NOT NULL,
    sign_out_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    phone_number TEXT,
    gender TEXT,
    nin_number TEXT,
    processed_by INTEGER,
    FOREIGN KEY (vehicle_id) REFERENCES vehicle_entries(id),
    FOREIGN KEY (processed_by) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS service_prices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    section TEXT NOT NULL,
    item_name TEXT NOT NULL,
    price REAL NOT NULL,
    configured_by INTEGER,
    UNIQUE(section, item_name),
    FOREIGN KEY (configured_by) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS tyre_service_transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_name TEXT NOT NULL,
    phone_number TEXT,
    tyre_model TEXT,
    service_type TEXT,
    amount REAL NOT NULL,
    handled_by INTEGER,
    FOREIGN KEY (handled_by) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS battery_transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_name TEXT NOT NULL,
    phone_number TEXT,
    battery_name TEXT,
    transaction_type TEXT,
    amount REAL NOT NULL,
    handled_by INTEGER,
    FOREIGN KEY (handled_by) REFERENCES users(id)
  );
`);

// -------------------------
// Export DB (IMPORTANT: server-only usage)
// -------------------------
export default db;