<?php
header('Content-Type: application/json');
$data = json_decode(file_get_contents('php://input'), true);
if (!isset($data['cart']) || !is_array($data['cart'])) {
    echo json_encode(['success' => false, 'error' => 'Invalid cart']);
    exit;
}
$cart = $data['cart'];
$date = date('Y-m-d H:i:s');
$orderId = uniqid('ORD');

// Save order to a file (for demo; use DB in production)
$orderFile = __DIR__ . '/../orders.json';
$orders = file_exists($orderFile) ? json_decode(file_get_contents($orderFile), true) : [];
$vendorName = isset($data['vendorName']) ? $data['vendorName'] : 'DemoVendor';
$orders[] = [
    'orderId' => $orderId,
    'date' => $date,
    'items' => $cart,
    'vendor' => $vendorName
];
file_put_contents($orderFile, json_encode($orders, JSON_PRETTY_PRINT));

// Return receipt
foreach ($cart as &$item) {
    $item['orderId'] = $orderId;
    $item['date'] = $date;
}
echo json_encode(['success' => true, 'receipt' => $cart]);
