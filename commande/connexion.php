<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "wbdf5949_javascript_game";

try {
//    $bdd = new PDO('mysql:host=localhost;dbname=wbdf5949_javascript_game;charset=utf8','root','',array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));
    $bdd = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password, array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));
} catch(Exception $e) {
    die('Erreur: '.$e->getMessage());
}