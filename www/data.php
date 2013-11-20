<?php
$imei = '353588020145956';
$dbc = new PDO('mysql:host=localhost;dbname=tk102', 'tk102', 'SrL3M7RjdMAHTPtx', array(
    PDO::ATTR_PERSISTENT => true
));
$json_output = array();

$raised_file='../raise2give/raised.json'
if(file_exists($raised_file)) {
    $json_output[]=json_decode(file_get_contents($raised_file));
} else {
    $json_output[]=[];
}

$updated = $dbc->prepare("SELECT last_fix FROM modems WHERE imei=?;");
$updated_stmt->bindValue(1, $imei);
$updated_stmt->execute();
$updated_stmt->bindColumn(1, $lfix);
$updated_stmt->fetch()
$json_output[]=$lfix;

$output = array();
$row = array();
if(isset($_REQUEST["since_id"])) {
	$data_stmt = $dbc->prepare("SELECT id,time,latitude,longitude,speed,bearing FROM positions WHERE id>?;");
	$data_stmt->bindValue(1, $_REQUEST["since_id"], PDO::PARAM_INT);
} else {
	$data_stmt = $dbc->prepare("SELECT id,time,latitude,longitude,speed,bearing FROM positions;");
}
$data_stmt->execute();
$data_stmt->bindColumn(1, $id);
$data_stmt->bindColumn(2, $t);
$data_stmt->bindColumn(3, $lat);
$data_stmt->bindColumn(4, $lon);
$data_stmt->bindColumn(5, $spd);
$data_stmt->bindColumn(6, $trk);
$output = array();
while ($data_stmt->fetch()) {
    $row['id']=$id;
    $row['t']=$t;
    $row['lat']=$lat;
    $row['lon']=$lon;
    $row['spd']=$spd;
    $row['trk']=$trk;
    $output[]=$row;
}
$json_output[]=$output;
print json_encode($json_output);
?>
