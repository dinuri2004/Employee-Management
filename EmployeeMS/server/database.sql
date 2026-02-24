CREATE DATABASE IF NOT EXISTS employee_db;

USE employee_db;

CREATE TABLE IF NOT EXISTS employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    salary DECIMAL(10, 2)
);

-- Optional: Insert dummy data
INSERT INTO employees (name, email, position, salary) VALUES 
('Alice Johnson', 'alice@example.com', 'Developer', 75000),
('Bob Wilson', 'bob@example.com', 'Manager', 85000);
