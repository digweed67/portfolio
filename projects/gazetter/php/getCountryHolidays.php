<?php

header('Content-Type: application/json; charset=utf-8');

if (!isset($_GET['country'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing country code (ISO Alpha-2), e.g. ?country=ES']);
    exit;
}

$countryCode = strtoupper(substr($_GET['country'], 0, 2));
$year = date('Y');
$url = "https://date.nager.at/api/v3/PublicHolidays/{$year}/{$countryCode}";

$ch = curl_init($url);
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_FAILONERROR    => true,
    CURLOPT_TIMEOUT        => 5,
]);
$response = curl_exec($ch);
if (curl_errno($ch)) {
    http_response_code(502);
    echo json_encode(['error' => curl_error($ch)]);
    exit;
}
curl_close($ch);

$holidays = json_decode($response, true);
if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(500);
    echo json_encode(['error' => 'Invalid JSON from upstream']);
    exit;
}

echo json_encode($holidays);
