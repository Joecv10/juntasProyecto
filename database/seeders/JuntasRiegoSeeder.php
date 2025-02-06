<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Carbon;
use App\Models\JuntaRiego;
use App\Models\PresidenteJuntaRiego;
use App\Models\HistoricoPresidentesJR;

class JuntasRiegoSeeder extends Seeder
{
    public function run()
    {
        // Find the highest num_carpeta_junta_riego in the table
        $maxCarpeta = DB::table('juntas_riego')->max('num_carpeta_junta_riego');
        $maxCarpeta = $maxCarpeta ?: 0; // if null, set to 0

        $cantonesRange   = range(43, 52);
        $parroquiasRange = range(207, 261);

        DB::transaction(function () use ($cantonesRange, $parroquiasRange, $maxCarpeta) {
            for ($i = 1; $i <= 60; $i++) {
                $numCarpeta = $maxCarpeta + $i;

                // 1) Insert the JuntaRiego record
                $junta = JuntaRiego::create([
                    'num_carpeta_junta_riego' => $numCarpeta,
                    'junta_riego'             => 'Junta Riego ' . Str::random(4),
                    'is_legalizada'           => rand(0, 1),
                    'fecha_solicitud'         => Carbon::now()->subDays(rand(5, 30)),
                    'fecha_resolucion'        => Carbon::now()->addDays(rand(5, 30)),
                    'num_resolucion'          => 'RES-' . Str::upper(Str::random(5)),
                    'cantidad_beneficiarios'  => rand(10, 300),
                    'cod_tipo_riego'          => rand(1, 4),
                    'cod_oficina_tecnica'     => 1, // adapt to your real data
                    'cod_parroquia'           => $parroquiasRange[array_rand($parroquiasRange)],
                    'provincia_id'            => 6, // forced
                    'canton_id'               => $cantonesRange[array_rand($cantonesRange)],
                ]);

                // 2) "Presidente Provisional"
                $presidenteProvisional = PresidenteJuntaRiego::create([
                    'cedula_presidente_junta_riego'  => Str::random(10),
                    'nombres_presidente_junta_riego' => 'Provisional ' . Str::random(5),
                    'email_presidente_junta_riego'   => Str::lower(Str::random(5)) . '@gmail.com',
                    'tel_contacto_presidente_junta_riego' => '09' . rand(10000000, 99999999),
                ]);

                // 3) "Presidente Electo"
                $presidenteElecto = PresidenteJuntaRiego::create([
                    'cedula_presidente_junta_riego'  => Str::random(10),
                    'nombres_presidente_junta_riego' => 'Electo ' . Str::random(5),
                    'email_presidente_junta_riego'   => Str::lower(Str::random(5)) . '@gmail.com',
                    'tel_contacto_presidente_junta_riego' => '09' . rand(10000000, 99999999),
                    'fecha_caducidad'               => Carbon::now()->addYears(rand(1, 3)),
                ]);

                // 4) historico for "provisional"
                HistoricoPresidentesJR::create([
                    'cod_junta_riego' => $junta->cod_junta_riego,
                    'cod_presidente_junta_riego' => $presidenteProvisional->cod_presidente_junta_riego,
                    'cod_tipo_presidente' => 1, // e.g. 1 => provisional
                    'fecha_solicitud_nombramiento' => Carbon::now()->subDays(rand(5, 30)),
                    'fecha_emision_nombramiento'   => Carbon::now()->subDays(rand(1, 4)),
                ]);

                // 5) historico for "electo"
                HistoricoPresidentesJR::create([
                    'cod_junta_riego' => $junta->cod_junta_riego,
                    'cod_presidente_junta_riego' => $presidenteElecto->cod_presidente_junta_riego,
                    'cod_tipo_presidente' => 2, // e.g. 2 => electo
                    'observaciones'   => 'Observación ' . $i,
                ]);
            }
        });
    }
}
