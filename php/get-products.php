<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $supplierId = $_GET['supplier_id'] ?? null;
        $search = $_GET['search'] ?? '';
        
        if ($supplierId) {
            // Get products for specific supplier
            $stmt = $pdo->prepare("
                SELECT p.*, u.name as supplier_name 
                FROM products p 
                JOIN users u ON p.supplier_id = u.id 
                WHERE p.supplier_id = ? 
                ORDER BY p.created_at DESC
            ");
            $stmt->execute([$supplierId]);
        } elseif (!empty($search)) {
            // Search products
            $searchTerm = "%$search%";
            $stmt = $pdo->prepare("
                SELECT p.*, u.name as supplier_name 
                FROM products p 
                JOIN users u ON p.supplier_id = u.id 
                WHERE p.name LIKE ? OR p.location LIKE ? 
                ORDER BY p.created_at DESC
            ");
            $stmt->execute([$searchTerm, $searchTerm]);
        } else {
            // Get all products
            $stmt = $pdo->prepare("
                SELECT p.*, u.name as supplier_name 
                FROM products p 
                JOIN users u ON p.supplier_id = u.id 
                ORDER BY p.created_at DESC
            ");
            $stmt->execute();
        }
        
        $products = $stmt->fetchAll();
        
        echo json_encode([
            'success' => true,
            'products' => $products
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