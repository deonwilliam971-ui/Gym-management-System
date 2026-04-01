-- Create the database
CREATE DATABASE IF NOT EXISTS gym_management;
USE gym_management;

-- Create 'plans' table
CREATE TABLE IF NOT EXISTS plans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    duration_months INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert some default plans
INSERT INTO plans (name, duration_months, price) VALUES
('Monthly Starter', 1, 50.00),
('Quarterly Pro', 3, 135.00),
('Annual VIP', 12, 500.00)
ON DUPLICATE KEY UPDATE name=name;

-- Create 'members' table
CREATE TABLE IF NOT EXISTS members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    join_date DATE NOT NULL,
    plan_id INT,
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (plan_id) REFERENCES plans(id) ON DELETE SET NULL
);

-- Note: In a real-world application, passwords would be hashed and stored if there's user authentication.
-- This schema focuses on the core dbms requirement for members and plans.
