<?php
//$imei = '353588020145956';
$imei = '013227007777968';
$dbc = new PDO('mysql:host=localhost;dbname=tk102', 'tk102', 'SrL3M7RjdMAHTPtx', array(
    PDO::ATTR_PERSISTENT => true
));
$data_stmt = $dbc->prepare("SELECT time FROM nupositions WHERE sos=1;");
$data_stmt->execute();
$data_stmt->bindColumn(1, $t);
$soses=0;
while ($data_stmt->fetch()) {
    $sostime=$t;
    $soses+=1;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
<title>Live Jailbreak SOS</title>
</head>
<body>
<?php
if($soses!=0) {
?>
<h1 style="color: red;"><?php print $soses; ?> SOS MESSAGES SENT, LAST AT:</h1>
<h2 style="color: red;"><?php print $sostime; ?></h2>
<object type="audio/x-mp3" data="/static/klaxon.mp3" width="320" height="50">
<param name="autostart" value="true" />
<param name="loop" value="true" />
<param name="controller" value="true" />
<param name="src" value="/static/klaxon.mp3">
</object>
<script>
setTimeout(function() {alert("Scarlett SOS Message Received!");},2000);
</script>
<?php
} else {
?>
<h1 style="color: green;">Scarlett seems ok :)</h1>
<script>
setTimeout(function() { location.reload(true); },10*1000);
</script>
<?php
}
?>
</body>
</html>

