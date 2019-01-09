<?php
/**EXAMPLE: "assets/php/3rd-party-news-provider.php?index=1&size=2" */

/** This file will serve the news */
$index = isset($_GET["index"]) && is_numeric($_GET["index"]) ? $_GET["index"] : 0;
$size = isset($_GET["size"]) && is_numeric($_GET["size"]) ? $_GET["size"] : 2;

sleep(2);

/* fake news provider, should be replaced by the real news */
$json = file_get_contents('fake_news.json');
$news = json_decode($json);
$maxSize = count($news);

$start = min($index * $size, $maxSize);
$limit = min($size , $maxSize - $start);

$output = array_slice($news, $start, $limit);

echo json_encode($output);