<?php

class Logger {
    private $logFile;

    public function __construct($logFile = 'logs/error.log') {
        $this->logFile = $logFile;
    }

    public function log($message) {
        $date = date('Y-m-d H:i:s');
        $logMessage = "[$date] $message" . PHP_EOL;
        file_put_contents($this->logFile, $logMessage, FILE_APPEND);
    }
}
?>