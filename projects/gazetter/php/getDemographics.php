<?php
header('Content-Type: application/json');

if (!isset($_POST['code'])) {
  echo json_encode(['status' => 'error', 'message' => 'No country code provided']);
  exit;
}

$code = strtoupper(trim($_POST['code']));
$url = "https://restcountries.com/v3.1/alpha/$code";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);

$response = curl_exec($ch);

if (curl_errno($ch)) {
  echo json_encode(['status' => 'error', 'message' => 'Request error']);
  curl_close($ch);
  exit;
}

curl_close($ch);

$data = json_decode($response, true);

if (!is_array($data) || !isset($data[0])) {
  echo json_encode(['status' => 'error', 'message' => 'Invalid country data']);
  exit;
}

$country = $data[0];

$name = $country['name']['common'] ?? 'Unknown';
$capital = $country['capital'][0] ?? 'N/A';
$population = $country['population'] ?? 0;
$area = $country['area'] ?? 0;
$languages = isset($country['languages']) ? implode(', ', $country['languages']) : 'N/A';
$region = $country['region'] ?? 'N/A';
$subregion = $country['subregion'] ?? 'N/A';

echo json_encode([
  'status' => 'success',
  'data' => [
    'name' => $name,
    'capital' => $capital,
    'population' => $population,
    'area' => $area,
    'languages' => $languages,
    'region' => $region,
    'subregion' => $subregion
  ]
]);

