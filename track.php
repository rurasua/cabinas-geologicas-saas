<?php
/**
 * track.php — registro anónimo de visitas para la presentación
 *
 * Recibe dos parámetros GET:
 *   e = evento (open | slide)
 *   s = slide o contexto (ej. "portada", "3", "login")
 *
 * Registra una línea en visitas.log con:
 *   timestamp | IP | User-Agent | evento=slide
 *
 * Pensado para Hostinger (compartido, PHP estándar).
 * NO usa base de datos — solo append a archivo plano.
 */

// Cabeceras
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Cache-Control: no-store');

// ===== IP real (respeta Cloudflare y proxies comunes) =====
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
if (!empty($_SERVER['HTTP_CF_CONNECTING_IP'])) {
    $ip = $_SERVER['HTTP_CF_CONNECTING_IP'];
} elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
    $parts = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
    $ip = trim($parts[0]);
}

// ===== Otros datos =====
$ua = $_SERVER['HTTP_USER_AGENT'] ?? 'unknown';

// Sanitizar inputs (defensa básica — log es local)
$event = preg_replace('/[^a-z]/', '', strtolower($_GET['e'] ?? 'open'));
$slide = preg_replace('/[^a-z0-9_\-]/i', '', $_GET['s'] ?? '');
$time  = date('Y-m-d H:i:s');

// ===== Append a archivo =====
$line = $time . ' | ' . $ip . ' | ' . $ua . ' | ' . $event . '=' . $slide . "\n";
$log_file = __DIR__ . '/visitas.log';

// LOCK_EX evita corrupción si dos requests escriben a la vez
// El @ silencia warnings si el filesystem está en read-only (fallback silencioso)
@file_put_contents($log_file, $line, FILE_APPEND | LOCK_EX);

// ===== Respuesta =====
echo json_encode(['ok' => true]);
