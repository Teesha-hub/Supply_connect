<?php
header('Content-Type: application/json');
$orderFile = __DIR__ . '/../orders.json';
$orders = file_exists($orderFile) ? json_decode(file_get_contents($orderFile), true) : [];
// In production, filter by vendor (session/user)
$allPurchases = [];
foreach ($orders as $order) {
    foreach ($order['items'] as $item) {
        $allPurchases[] = [
            'orderId' => $order['orderId'],
            'date' => $order['date'],
            'productName' => $item['productName'] ?? $item['name'],
            'quantity' => $item['quantity'],
            'supplierName' => $item['supplierName'] ?? $item['supplier_name'],
            'total' => $item['price'] * $item['quantity']
        ];
    }
}
echo json_encode(['purchases' => $allPurchases]);
