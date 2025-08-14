<?php
header('Content-Type: application/json');

require_once 'config.php';

$code = $_GET['code'] ?? '';
if (!$code) {
  echo json_encode(['status' => 'error', 'message' => 'Missing country code']);
  exit;
}

$countryName = $_GET['name'] ?? '';
if (!$countryName) {
  echo json_encode(['status' => 'error', 'message' => 'Missing country name']);
  exit;
}

$apiKey = PEXELS_API_KEY;
$url = "https://api.pexels.com/v1/search?query=" . urlencode($countryName) . "&per_page=6";

$ch = curl_init();
curl_setopt_array($ch, [
  CURLOPT_URL => $url,
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_HTTPHEADER => [
    "Authorization: $apiKey"
  ]
]);

$response = curl_exec($ch);
curl_close($ch);

$data = json_decode($response, true);

if (!isset($data['photos']) || count($data['photos']) === 0) {
  echo json_encode(['status' => 'error', 'message' => 'No images found']);
  exit;
}

echo json_encode([
  'status' => 'ok',
  'photos' => $data['photos']
]);
