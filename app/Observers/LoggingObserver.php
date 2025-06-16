<?php

namespace App\Observers;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class LoggingObserver
{
  /**
   * Handle the Model "created" event.
   */
  public function created(Model $model): void
  {
    $this->logAction('CREATED', $model);
  }

  /**
   * Handle the Model "updated" event.
   */
  public function updated(Model $model): void
  {
    // Get changed data
    $changes = collect($model->getDirty())->mapWithKeys(function ($value, $key) use ($model) {
      return ["new_{$key}" => $value, "old_{$key}" => $model->getOriginal($key)];
    })->toArray();

    $this->logAction('UPDATED', $model, $changes);
  }

  /**
   * Handle the Model "deleted" event.
   */
  public function deleted(Model $model): void
  {
    $this->logAction('DELETED', $model, $model->toArray());
  }

  /**
   * Handle the Model "restored" event.
   */
  public function restored(Model $model): void
  {
    $this->logAction('RESTORED', $model);
  }

  /**
   * Handle the Model "force deleted" event.
   */
  public function forceDeleted(Model $model): void
  {
    $this->logAction('FORCE DELETED', $model, $model->toArray());
  }

  /**
   * A helper function to centralize the logging logic.
   */
  protected function logAction(string $action, Model $model, array $context = []): void
  {
    // Get the authenticated user, if available
    $user = Auth::user();
    $userId = $user ? $user->id : 'System';
    $userName = $user ? $user->name : 'N/A';

    $modelName = class_basename($model); // e.g., "Room" instead of "App\Models\Room"
    $modelId = $model->getKey();

    $logMessage = "[AUDIT] Model {$modelName} (ID: {$modelId}) was {$action} by User (ID: {$userId}, Name: {$userName}).";

    Log::channel('project')->info($logMessage, $context);
  }
}
