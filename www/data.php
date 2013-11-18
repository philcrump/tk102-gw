<?php
$dbc = new PDO('mysql:host=localhost;dbname=tk102', 'tk102', 'SrL3M7RjdMAHTPtx', array(
    PDO::ATTR_PERSISTENT => true
));
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
print json_encode($output);
?>
