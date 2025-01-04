<?php

namespace Database\Seeders;

use \App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SuperAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'names' => 'JOE STEVEN',
            'last_names' => 'CONCHA VASQUEZ',
            'email' => 'joeconchavasquez@gmail.com',
            'password' => bcrypt('12345678'),
            'cod_oficina_tecnica' => 1,
            'cod_role' => 1,
        ]);
    }
}
