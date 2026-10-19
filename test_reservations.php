<?php
require_once("wp-load.php");
global $wpdb;
$res = $wpdb->get_results("SELECT id, location, girl_name FROM wp_pascha_reservations ORDER BY id DESC LIMIT 10");
print_r($res);
