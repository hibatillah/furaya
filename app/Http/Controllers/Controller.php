<?php

namespace App\Http\Controllers;

abstract class Controller {


  abstract public function create();

  abstract public function show(string $id);

  abstract public function edit(string $id);

  abstract public function destroy(string $id);
}
