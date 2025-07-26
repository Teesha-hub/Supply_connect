<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    $productName = $input['productName'] ?? '';
    $price = $input['price'] ?? 0;
    $quantity = $input['quantity'] ?? 0;
    $location = $input['location'] ?? '';
    $supplierId = $input['supplierId'] ?? 0;
    
    // Validate input
    if (empty($productName) || empty($location) || $price <= 0 || $quantity <= 0 || $supplierId <= 0) {
        echo json_encode(['success' => false, 'message' => 'All fields are required and must be valid']);
        exit();
    }
    
    try {
        // Verify supplier exists
        $stmt = $pdo->prepare("SELECT id FROM users WHERE id = ? AND role = 'supplier'");
        $stmt->execute([$supplierId]);
        
        if (!$stmt->fetch()) {
            echo json_encode(['success' => false, 'message' => 'Invalid supplier']);
            exit();
        }
        
        // Insert product
        $stmt = $pdo->prepare("INSERT INTO products (name, price, quantity, location, supplier_id, created_at) VALUES (?, ?, ?, ?, ?, NOW())");
        $stmt->execute([$productName, $price, $quantity, $location, $supplierId]);
        
        echo json_encode([
            'success' => true,
            'message' => 'Product added successfully'
        ]);
        
    } catch(PDOException $e) {
        echo json_encode([
            'success' => false,
            'message' => 'Database error: ' . $e->getMessage()
        ]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}
?>