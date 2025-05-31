<?php

namespace App\Http\Controllers;

use App\Http\Requests\Roles\UserRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

abstract class Controller
{
  /**
   * Validate user request
   *
   * @param Request $request
   * @param int|null $userId
   * @return array
   */
  protected function validateUser(Request $request, ?int $userId = null)
  {
    $userRequest = new UserRequest();

    if ($request->getMethod() === 'POST') {
      $userRules = $userRequest->rules();
    } else {
      $userRules = $userRequest->rulesEssential($userId);
    }

    $validated = Validator::make($request->only(array_keys($userRules)), $userRules)->validate();

    return $validated;
  }
}
