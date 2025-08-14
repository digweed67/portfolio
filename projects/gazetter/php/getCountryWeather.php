<?php
header('Content-Type: application/json');
require_once 'config.php';
$apiKey = OPENWEATHER_API_KEY;
$code   = $_POST['code'] ?? '';
if (!$code) {
  echo json_encode(['status'=>'error','message'=>'Missing country code']);
  exit;
}


$rest = curl_init("https://restcountries.com/v3.1/alpha/{$code}");
curl_setopt_array($rest, [CURLOPT_RETURNTRANSFER=>true, CURLOPT_TIMEOUT=>5]);
$ctry = json_decode(curl_exec($rest), true)[0] ?? null;
curl_close($rest);

if (!$ctry) {
  echo json_encode(['status'=>'error','message'=>'Country not found']);
  exit;
}
$capital = $ctry['capital'][0] ?? '';


if (!isset($ctry['capitalInfo']['latlng'][0])) {
  echo json_encode(['status'=>'error','message'=>'Capital coords not found']);
  exit;
}
[$lat, $lon] = $ctry['capitalInfo']['latlng'];


$url = "https://api.openweathermap.org/data/2.5/forecast"
     . "?lat={$lat}&lon={$lon}&units=metric&appid={$apiKey}";

$ch = curl_init($url);
curl_setopt_array($ch, [CURLOPT_RETURNTRANSFER=>true, CURLOPT_TIMEOUT=>5]);
$resp = curl_exec($ch);
curl_close($ch);
$data = json_decode($resp, true);
if (empty($data['list'])) {
  echo json_encode(['status'=>'error','message'=>'Forecast unavailable']);
  exit;
}


$days = [];
foreach ($data['list'] as $slot) {
  $date = substr($slot['dt_txt'], 0, 10);
  if (!isset($days[$date])) {
    $days[$date] = [
      'high' => $slot['main']['temp_max'],
      'low'  => $slot['main']['temp_min'],
      'icon' => $slot['weather'][0]['icon'],
      'slots'=> 1
    ];
  } else {
    $days[$date]['high'] = max($days[$date]['high'], $slot['main']['temp_max']);
    $days[$date]['low']  = min($days[$date]['low'],  $slot['main']['temp_min']);
    $days[$date]['slots']++;
    // you could pick a midday icon or the first one if you like
  }
  if (count($days) === 3) break;
}

// 4) Current weather (free endpoint)
$currUrl = "https://api.openweathermap.org/data/2.5/weather"
         . "?lat={$lat}&lon={$lon}&units=metric&appid={$apiKey}";
$ch2 = curl_init($currUrl);
curl_setopt_array($ch2, [CURLOPT_RETURNTRANSFER=>true, CURLOPT_TIMEOUT=>5]);
$curr = json_decode(curl_exec($ch2), true);
curl_close($ch2);

echo json_encode([
  'status'    => 'ok',
  'capital'   => $capital,
  'today'     => [
    'temp' => $curr['main']['temp'],
    'icon' => $curr['weather'][0]['icon']
  ],
  'forecast3' => array_map(function($date, $info){
    return [
      'date' => $date,  
      'day'  => date('D', strtotime($date)),
      'icon' => $info['icon'],
      'high' => $info['high'],
      'low'  => $info['low']
    ];
  }, array_keys($days), $days)
]);
