<?php
require('simple_html_dom.php');

$output = array();

$html = new simple_html_dom();
$html->load_file('https://www.raise2give.com/jail-break-southampton/scarlett-theron-rush');
$result=$html->find('.raisedsofar strong')[0]->plaintext;
$output[0]=floatval(substr($result,7));

$html = new simple_html_dom();
$html->load_file('https://www.raise2give.com/jail-break-southampton/mohit-gupta');
$result=$html->find('.raisedsofar strong')[0]->plaintext;
$output[1]=floatval(substr($result,7));

file_put_contents('raised.json', json_encode($output));
?>
