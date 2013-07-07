<?php
$code = $_POST['code'];
$client_id = $_POST['client_id'];
$client_secret = $_POST['client_secret'];

$url = 'https://user.humanapi.co/oauth/token';
echo 'dd';
$fields_string = 'code='.$code.'&client_id='.$client_id.'&client_secret='.$client_secret;
//open connection
$ch = curl_init();

//set the url, number of POST vars, POST data
curl_setopt($ch,CURLOPT_URL, $url);
curl_setopt($ch,CURLOPT_POST, 3);
curl_setopt($ch,CURLOPT_POSTFIELDS, $fields_string);

//execute post
$result = curl_exec($ch);

//close connection
curl_close($ch);
echo $result;
?>