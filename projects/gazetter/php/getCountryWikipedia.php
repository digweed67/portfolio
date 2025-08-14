<?php
header('Content-Type: application/json');

// 1. Get the country code (not name!)
$code = $_POST['code'] ?? '';

if (!$code) {
  echo json_encode(['status' => 'error', 'message' => 'Missing country code']);
  exit;
}

// 2. Lookup proper name from REST Countries API
$restUrl = "https://restcountries.com/v3.1/alpha/$code";

$ch1 = curl_init();
curl_setopt_array($ch1, [
  CURLOPT_URL => $restUrl,
  CURLOPT_RETURNTRANSFER => true,
]);
$restResponse = curl_exec($ch1);
curl_close($ch1);

$restData = json_decode($restResponse, true);

if (!isset($restData[0]['name']['common'])) {
  echo json_encode(['status' => 'error', 'message' => 'Could not resolve country name']);
  exit;
}

$name = str_replace(' ', '_', $restData[0]['name']['official']);
$name = urlencode($name);


// 3. Query Wikipedia
$wikiUrl = "https://en.wikipedia.org/api/rest_v1/page/summary/$name";

$ch2 = curl_init();
curl_setopt_array($ch2, [
  CURLOPT_URL => $wikiUrl,
  CURLOPT_RETURNTRANSFER => true,
]);
$wikiResponse = curl_exec($ch2);
curl_close($ch2);

$wikiData = json_decode($wikiResponse, true);

if (isset($wikiData['extract'])) {
  echo json_encode(['status' => 'ok', 'summary' => $wikiData['extract']]);
} else {
  echo json_encode(['status' => 'error', 'message' => 'No summary found']);
}
