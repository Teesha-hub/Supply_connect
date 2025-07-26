-- Create database
CREATE DATABASE IF NOT EXISTS supplier_vendor_db;
USE supplier_vendor_db;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('supplier', 'vendor') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    quantity INT NOT NULL,
    location VARCHAR(200) NOT NULL,
    supplier_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (supplier_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert sample data (optional)
-- Sample supplier users
INSERT INTO users (name, email, password, role) VALUES 
('Raj Patel', 'raj@supplier.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'supplier'),
('Priya Sharma', 'priya@supplier.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'supplier');

-- Sample vendor users
INSERT INTO users (name, email, password, role) VALUES 
('Amit Kumar', 'amit@vendor.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'vendor'),
('Sneha Gupta', 'sneha@vendor.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'vendor');

-- Sample products
INSERT INTO products (name, price, quantity, location, supplier_id) VALUES 
('Fresh Tomatoes', 40.00, 100, 'Delhi, India', 1),
('Basmati Rice', 80.00, 50, 'Punjab, India', 1),
('Red Onions', 30.00, 200, 'Maharashtra, India', 2),
('Fresh Spinach', 25.00, 75, 'Haryana, India', 2);

-- Note: Default password for all sample users is 'password'