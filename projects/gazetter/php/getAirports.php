<?php
header('Content-Type: application/json');


$countryCode = $_POST['countryCode'] ?? '';
if (!$countryCode) {
    http_response_code(400);
    echo json_encode(['status'=>'error','message'=>'No country code provided']);
    exit;
}

$username = 'amaia';
$url = "http://api.geonames.org/searchJSON?country=$countryCode" . "&featureCode=AIRP&maxRows=500&username=$username";


$ch = curl_init($url);
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT        => 8,
]);


$response = curl_exec($ch);
if ($response === false) {
    http_response_code(500);
    $err = curl_error($ch);
    curl_close($ch);
    echo json_encode(['status'=>'error','message'=>$err]);
    exit;
}
curl_close($ch);


$data = json_decode($response, true);
if (empty($data['geonames'])) {
    http_response_code(404);
    echo json_encode(['status'=>'error','message'=>'No airports found']);
    exit;
}


echo json_encode([
  'status' => 'ok',
  'data'   => array_map(function($a){
    return [
      'name' => $a['name'],
      'lat'  => $a['lat'],
      'lng'  => $a['lng']
    ];
  }, $data['geonames'])
]);
