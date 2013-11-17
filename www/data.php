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
$data_stmt->bindColumn(1, $row['id']);
$data_stmt->bindColumn(2, $row['t']);
$data_stmt->bindColumn(3, $row['lat']);
$data_stmt->bindColumn(4, $row['lon']);
$data_stmt->bindColumn(5, $row['spd']);
$data_stmt->bindColumn(6, $row['trk']);
$output = array();
while ($data_stmt->fetch()) {
    array_push($output, $row);
}
print json_encode($output);
?>
