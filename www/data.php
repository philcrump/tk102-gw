<?php
//$imei = '353588020145956';
$imei = '013227007777968';
$dbc = new PDO('mysql:host=localhost;dbname=tk102', 'tk102', 'SrL3M7RjdMAHTPtx', array(
    PDO::ATTR_PERSISTENT => true
));
$json_output = array();

$updated_stmt = $dbc->prepare("SELECT last_fix,last_updated FROM modems WHERE imei=?;");
$updated_stmt->bindValue(1, $imei);
$updated_stmt->execute();
$updated_stmt->bindColumn(1, $lfix);
$updated_stmt->bindColumn(2, $lupd);
$updated_stmt->fetch();
$json_output[]=[$lfix, $lupd];

$output = array();
$row = array();
if(isset($_REQUEST["since_id"])) {
	$data_stmt = $dbc->prepare("SELECT id,time,latitude,longitude,speed,bearing,battery,battstatus,sig,sats FROM nupositions WHERE id>?;");
	$data_stmt->bindValue(1, $_REQUEST["since_id"], PDO::PARAM_INT);
} else {
	$data_stmt = $dbc->prepare("SELECT id,time,latitude,longitude,speed,bearing,battery,battstatus,sig,sats FROM nupositions;");
}
$data_stmt->execute();
$data_stmt->bindColumn(1, $id);
$data_stmt->bindColumn(2, $t);
$data_stmt->bindColumn(3, $lat);
$data_stmt->bindColumn(4, $lon);
$data_stmt->bindColumn(5, $spd);
$data_stmt->bindColumn(6, $trk);
$data_stmt->bindColumn(7, $bat);
$data_stmt->bindColumn(8, $bst);
$data_stmt->bindColumn(9, $sig);
$data_stmt->bindColumn(10, $sat);
$output = array();
while ($data_stmt->fetch()) {
    $row['id']=$id;
    $row['t']=$t;
    $row['lat']=$lat;
    $row['lon']=$lon;
    $row['spd']=$spd;
    $row['trk']=$trk;
    $row['bat']=$bat;
    $row['bst']=$bst;
    $row['sig']=$sig;
    $row['sat']=$sat;
    $output[]=$row;
}
$json_output[]=$output;
print json_encode($json_output);
?>
