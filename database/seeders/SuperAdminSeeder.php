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
            'names' => 'Joe Steven',
            'last_names' => 'Concha Vasquez',
            'provincia_oficina_tecnica' => 'Chimborazo',
            'email' => 'joeconchavasquez@gmail.com',
            'password' => bcrypt('12345678'),
            'role' => 'superadmin',
        ]);
    }
}
