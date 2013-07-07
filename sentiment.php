<?php
require_once './lib/Unirest.php';

$whathesentyou = $_POST['whathesentyou'];
$whatyousenthim = $_POST['whatyousenthim'];

$from = Unirest::post(
  "https://chatterbox-analytics-sentiment-analysis-free.p.mashape.com/sentiment/current/classify_text/",
  array(
    "X-Mashape-Authorization" => "pcVF97Di5Dlx6OR1LsrRYsLNL7Stnqkl"
  ),
  array(
    "lang" => "en",
    "text" => $whathesentyou,
    "exclude" => "",
    "detectlang" => "",
  ));

$to = Unirest::post(
  "https://chatterbox-analytics-sentiment-analysis-free.p.mashape.com/sentiment/current/classify_text/",
  array(
    "X-Mashape-Authorization" => "pcVF97Di5Dlx6OR1LsrRYsLNL7Stnqkl"
  ),
  array(
    "lang" => "en",
    "text" => $whatyousenthim,
    "exclude" => "",
    "detectlang" => "",
  ));

echo json_encode(array(
	"from" => floatVal($from->body->value),
	"to" => floatVal($to->body->value)));
?>