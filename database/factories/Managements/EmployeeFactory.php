<?php

namespace Database\Factories\Managements;

use App\Enums\GenderEnum;
use App\Enums\RoleEnum;
use App\Models\Managements\Department;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Managements\Employee>
 */
class EmployeeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::where('role', RoleEnum::EMPLOYEE)
                ->get()->random()->id,
            'department_id' => Department::all()->random()->id,
            'gender' => $this->faker->randomElement(GenderEnum::getValues()),
            'hire_date' => $this->faker->dateTimeBetween('-1 years', 'now')->format('Y-m-d'),
            'phone' => $this->faker->phoneNumber(),
            'address' => $this->faker->address(),
            'salary' => $this->faker->randomFloat(2, 1500000, 4500000),
        ];
    }
}
