<?php

// Ensure writable directories exist (use /tmp on Vercel serverless)
foreach (["/tmp/bootstrap/cache", "/tmp/storage/framework/sessions", "/tmp/storage/framework/views", "/tmp/storage/framework/cache/data", "/tmp/storage/logs"] as $dir) {
    if (!is_dir($dir)) mkdir($dir, 0755, true);
}

// Serve static files directly if they exist in public/
$uri = urldecode(parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH));
if ($uri !== "/" && file_exists(__DIR__ . "/../public" . $uri)) {
    return false;
}

require_once __DIR__ . "/../public/index.php";
