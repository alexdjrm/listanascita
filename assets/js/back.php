<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: text/plain; charset=utf-8");


if (!isset($_POST['id']) || !ctype_digit($_POST['id'])) exit("ID non valido");
$id = $_POST['id'];

$nomeDonatore = isset($_POST['nome']) ? trim($_POST['nome']) : '';
if ($nomeDonatore === '') exit("Nome donatore mancante");

$contattoDonatore = isset($_POST['contatto']) ? trim($_POST['contatto']) : '';
if ($contattoDonatore === '') exit("Contatto donatore mancante");

$messaggio = isset($_POST['messaggio']) ? trim($_POST['messaggio']) : '';



$listaPath = __DIR__ . '/lista.tsv';
$donorsPath = __DIR__ . '/donors.tsv';

if (!file_exists($listaPath)) {
    http_response_code(500);
    exit("File lista.tsv non trovato");
}

$righe = file($listaPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

foreach ($righe as $riga) {
    $cols = explode("\t", $riga);
    if ($cols[0] === $id && $cols[1] === '1') {
        $cols[1] = '0';
        $titoloOggetto = $cols[2];
    }
    $nuove_righe[] = implode("\t", $cols);
}

file_put_contents($listaPath, implode("\n", $nuove_righe), LOCK_EX);

if ($titoloOggetto !== null) {
    $timestamp = date('Y-m-d H:i:s'); // ⏱️ formato data e ora
    $donorLine = implode("\t", [$timestamp,  $nomeDonatore, $contattoDonatore, $id, $titoloOggetto, $messaggio]);
    file_put_contents($donorsPath, $donorLine . "\n", FILE_APPEND | LOCK_EX);
}

echo "OK";
