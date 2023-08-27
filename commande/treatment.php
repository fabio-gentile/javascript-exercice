<?php

function htmlspecialcharsArray($field) {
    foreach ($field as $key => $value) {
        $field[$key] = htmlspecialchars(($value), ENT_NOQUOTES);
    }
    return $field;
}

if (isset($_POST['item'])) {
    if (!empty($_POST['item'])) {
        $item = htmlspecialcharsArray($_POST['item']);
    } else {
        header('LOCATION: index.html');
    }

    if (!empty($_POST['quantity'])) {
        $quantity = htmlspecialcharsArray($_POST['quantity']);
        $quantity =  array_map('intval', $quantity);
    } else {
        header('LOCATION: index.html');
    }

    // inserting
    require_once 'connexion.php';
    $insert = $bdd->query("INSERT INTO `order` (sent_at) VALUES (DEFAULT)");
    $insert->closeCursor();
    $idOrder = $bdd->lastInsertId();

    for ($i = 0; $i < count($item); $i++) {
        if ($quantity[$i] > 0) {
            $insert = $bdd->prepare("INSERT INTO `order_detail` (order_id, item, quantity) VALUES (?, ?, ?)");
            $insert->execute([$idOrder, $item[$i], $quantity[$i]]);
        }
    }
    $insert->closeCursor();
    header('LOCATION: index.html');
} else {
    header('LOCATION: index.html');
}