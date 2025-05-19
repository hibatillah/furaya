<?php

use App\Utils\DateHelper;
use Carbon\Carbon;

test('Get ISO Date from Helper Class extends Carbon', function () {
    $dateHelper = DateHelper::getISO();
    $dateCarbon = Carbon::now()->toIso8601String();

    expect($dateHelper)->toBe($dateCarbon);
});
