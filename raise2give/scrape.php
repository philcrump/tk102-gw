<?php
require('simple_html_dom.php');

$output = array();

$html = file_get_html('https://www.raise2give.com/jail-break-southampton/scarlett-theron-rush');
$raised_div = $html->find('.raisedsofar');
$output[0] = $raised_div->find('strong')[0];

$html = file_get_html('https://www.raise2give.com/jail-break-southampton/mohit-gupta');
$raised_div = $html->find('.raisedsofar');
$output[1] = $raised_div->find('strong')[0];

print json_encode($output);
?>
