<?php
// get-orders.php: Returns orders for a supplier (demo: returns all orders)
header('Content-Type: application/json');
$orderFile = __DIR__ . '/../orders.json';
$orders = file_exists($orderFile) ? json_decode(file_get_contents($orderFile), true) : [];
// In production, filter by supplier ID
$allItems = [];
foreach ($orders as $order) {
    foreach ($order['items'] as $item) {
        $allItems[] = [
            'orderId' => $order['orderId'],
            'productName' => $item['productName'],
            'quantity' => $item['quantity'],
            'vendor' => $order['vendor'],
            'date' => $order['date'],
            'supplierId' => $item['supplierId']
        ];
    }
}
echo json_encode(['orders' => $allItems]);
