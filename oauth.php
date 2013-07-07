<?php
$code = $_POST['code'];
$url = 'http://user.humanapi.co/oauth/token';
$data = array('code' => $code);

$options = array(
    'http' => array(
        'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
        'method'  => 'POST',
        'content' => http_build_query($data),
    ),
);
$context  = stream_context_create($options);
$result = file_get_contents($url, false, $context);
var_dump($result);
?>