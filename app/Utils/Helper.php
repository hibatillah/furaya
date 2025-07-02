<?php

namespace App\Utils;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class Helper
{
  /**
   * Store image to storage
   * @return array paths of stored images
   */
  public static function storeImage(
    array $files = [],
    string $prefix,
    string $folder
  ) {
    $paths = array_map(function ($file) use ($prefix, $folder) {
      $filename = $prefix . '_' . $file->getClientOriginalName();

      $path = $file->storeAs($folder, $filename, 'public');
      return $path;
    }, $files);

    return $paths;
  }

  /**
   * Update image to storage
   * @return array paths of updated images
   */
  public static function updateImage(
    array $newFiles = [],
    array $oldFiles = [],
    string $prefix,
    string $folder,
  ) {
    $paths = self::storeImage($newFiles, $prefix, $folder);

    // filter unused old files
    $unused = array_filter($oldFiles, function ($file) use ($paths) {
      return !in_array($file, $paths);
    });

    // delete unused old files
    foreach ($unused as $file) {
      self::deleteImage($file);
    }

    return $paths;
  }

  /**
   * Delete image from storage
   */
  public static function deleteImage(string $path, string $disk = 'public')
  {
    if (Storage::disk($disk)->exists($path)) {
      Storage::disk($disk)->delete($path);
    }
  }

  /**
   * Custom exception handler
   */
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
