<?php

namespace App\Utils;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class Helper
{
  public static function handleException(
    \Exception $e,
    string $message = "Exception",
  ) {
    Log::channel("project")->error($message, [
      "message" => $e->getMessage(),
      "file" => $e->getFile(),
      "line" => $e->getLine(),
      "trace" => $e->getTraceAsString(),
      "user_id" => Auth::user()->id ?? null,
    ]);
  }
}
