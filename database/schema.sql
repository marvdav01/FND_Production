CREATE DATABASE IF NOT EXISTS event_lighting;
USE event_lighting;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(180) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin','client','crew') NOT NULL DEFAULT 'client',
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS crew (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  role VARCHAR(80) NOT NULL,
  phone VARCHAR(40),
  status ENUM('available','on_job') NOT NULL DEFAULT 'available',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_crew_status (status)
);

CREATE TABLE IF NOT EXISTS equipment (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(140) NOT NULL,
  total_stock INT NOT NULL DEFAULT 0,
  available_stock INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_equipment_name (name)
);

CREATE TABLE IF NOT EXISTS events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(180) NOT NULL,
  type VARCHAR(80) NOT NULL,
  event_date DATE NOT NULL,
  location VARCHAR(180) NOT NULL,
  notes TEXT,
  status ENUM('pending','survey','deal','running','done','cancel') NOT NULL DEFAULT 'pending',
  client_id INT NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  dp_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  paid_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_events_status (status),
  INDEX idx_events_client (client_id)
);

CREATE TABLE IF NOT EXISTS event_equipment (
  id INT AUTO_INCREMENT PRIMARY KEY,
  event_id INT NOT NULL,
  equipment_id INT NOT NULL,
  quantity INT NOT NULL,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  FOREIGN KEY (equipment_id) REFERENCES equipment(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS event_crew (
  id INT AUTO_INCREMENT PRIMARY KEY,
  event_id INT NOT NULL,
  crew_id INT NOT NULL,
  task VARCHAR(120),
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  FOREIGN KEY (crew_id) REFERENCES crew(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  event_id INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  payment_type ENUM('dp','full') NOT NULL,
  status ENUM('paid','unpaid') NOT NULL DEFAULT 'unpaid',
  proof_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  INDEX idx_payments_status (status)
);
