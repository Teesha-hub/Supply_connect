# SupplyConnect - Supplier Vendor Matching Website

A beginner-friendly supplier-vendor matching website built with HTML, CSS, JavaScript, PHP, and MySQL.

## 🎨 Theme: Clay & Saffron (India Street Food Inspired)
- **Terracotta (#D95D39)** - buttons, highlights
- **Saffron Yellow (#F4A259)** - icons, badges  
- **Cool Beige (#F7EFE5)** - background
- **Slate Brown (#5D4639)** - headings, text
- **Leaf Green (#A9C47F)** - freshness ratings, stock indicators

## 📁 Folder Structure
```
supplier-vendor-match/
├── index.html              # Landing page
├── login.html              # Login page
├── signup.html             # Signup page
├── supplier-dashboard.html # Supplier dashboard
├── vendor-dashboard.html   # Vendor dashboard
├── css/
│   └── styles.css         # All CSS styles
├── js/
│   └── script.js          # JavaScript functionality
├── php/
│   ├── config.php         # Database connection
│   ├── login.php          # Login handling
│   ├── signup.php         # Signup handling
│   ├── add-product.php    # Add product functionality
│   ├── get-products.php   # Retrieve products
│   └── logout.php         # Logout functionality
└── sql/
    └── database.sql       # Database structure and sample data
```

## 🔧 Features
- **User Authentication**: Signup & Login with PHP + MySQL
- **User Roles**: Supplier and Vendor accounts
- **Supplier Features**: Add products (name, price, quantity, location)
- **Vendor Features**: View all available products in a clean table
- **Search**: Vendors can search products by name or location
- **Responsive Design**: Mobile-friendly layout
- **Modern UI**: Hover effects, smooth transitions, clean design

## 🚀 Setup Instructions

### Prerequisites
- XAMPP (or WAMP/LAMP) installed on your computer
- Web browser

### Step 1: Download/Extract Files
1. Save all the files in the folder structure shown above
2. Place the entire `supplier-vendor-match` folder in your XAMPP's `htdocs` directory
   - Default path: `C:\xampp\htdocs\supplier-vendor-match\` (Windows)
   - Or: `/opt/lampp/htdocs/supplier-vendor-match/` (Linux)

### Step 2: Start XAMPP Services
1. Open XAMPP Control Panel
2. Start **Apache** service
3. Start **MySQL** service

### Step 3: Create Database
1. Open your web browser
2. Go to `http://localhost/phpmyadmin`
3. Click "Import" tab
4. Choose the `sql/database.sql` file
5. Click "Go" to import the database

### Step 4: Run the Website
1. Open your web browser
2. Navigate to: `http://localhost/supplier-vendor-match`
3. You should see the landing page!

## 📝 Sample Login Credentials
The database comes with sample users (password: "password"):

**Suppliers:**
- Email: raj@supplier.com
- Email: priya@supplier.com

**Vendors:**
- Email: amit@vendor.com  
- Email: sneha@vendor.com

## 🎯 How to Use

### For Suppliers:
1. Sign up with role "Supplier" or use sample login
2. Access supplier dashboard
3. Add products with name, price, quantity, and location
4. View your listed products

### For Vendors:
1. Sign up with role "Vendor" or use sample login  
2. Access vendor dashboard
3. Browse all available products
4. Search products by name or location
5. View supplier details and stock status

## 🔍 File Explanations

### HTML Files:
- `index.html` - Homepage with hero section and features
- `login.html` - User login form
- `signup.html` - User registration with role selection
- `supplier-dashboard.html` - Add products and manage inventory
- `vendor-dashboard.html` - Browse and search products

### CSS:
- `css/styles.css` - Complete styling with Clay & Saffron theme, responsive design, hover effects

### JavaScript:
- `js/script.js` - Handles forms, authentication, AJAX calls, and dashboard functionality

### PHP Backend:
- `php/config.php` - Database connection settings
- `php/login.php` - User authentication
- `php/signup.php` - User registration  
- `php/add-product.php` - Add new products
- `php/get-products.php` - Retrieve products (with search)
- `php/logout.php` - User logout

### Database:
- `sql/database.sql` - Database structure and sample data

## 🎨 Design Features
- **Modern Typography**: Poppins font family
- **Responsive Layout**: Works on mobile, tablet, and desktop
- **Hover Effects**: Buttons have smooth hover animations
- **Focus States**: Form inputs have saffron highlight on focus
- **Color-coded Status**: Stock indicators use the leaf green color
- **Clean Tables**: Easy-to-read product listings
- **Floating Animations**: Spice icons on homepage

## 🔒 Security Features
- Password hashing using PHP's `password_hash()`
- SQL injection prevention with prepared statements
- Input validation and sanitization
- Session-based authentication

## 📱 Mobile Responsiveness
- Flexible grid layouts
- Collapsible navigation
- Touch-friendly buttons
- Optimized table display
- Responsive typography

## 🐛 Troubleshooting
1. **Database connection error**: Check XAMPP MySQL is running
2. **Pages not loading**: Ensure Apache is running and files are in htdocs
3. **Login not working**: Verify database was imported correctly
4. **Styling issues**: Check CSS file path is correct

This website is perfect for beginners learning web development with a full-stack approach!