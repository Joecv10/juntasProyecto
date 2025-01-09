<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\JuntaRiego;
use App\Models\PresidenteJuntaRiego;
use App\Models\HistoricoPresidentesJR;


class JuntasRiegoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return inertia('JuntasRiego/JuntasRiegoIndex');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia('JuntasRiego/JuntasRiegoForm', [
            'tipo_riego' => DB::table('tipo_riego')->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        $request->validate([
            'num_carpeta_junta_riego' => 'required|integer',
            'junta_riego' => 'required|string|max:255',
            'is_legalizada' => 'required|boolean',
            'fecha_solicitud' => 'date',
            'fecha_resolucion' => 'date',
            'num_resolucion' => 'string|max:255',
            'cantidad_beneficiarios' => 'integer',
            'cod_tipo_riego' => 'required|integer',
            'cod_oficina_tecnica' => 'required|integer',
            'parroquia_id' => 'required|integer|exists:parroquias,parroquia_id',
            'provincia_id' => 'required|integer|exists:provincias,provincia_id',
            'canton_id' => 'required|integer|exists:cantones,canton_id',
            'presidente_provisional' => 'required|integer',
            'cedula_presidente_junta_riego_p' => 'required|string|size:10',
            'nombres_presidente_junta_riego_p' => 'required|string|max:255',
            'email_presidente_junta_riego_p' => 'email',
            'telefono_presidente_junta_riego_p' => 'string|max:15',
            'fecha_solicitud_nombramiento_presi_p' => 'date',
            'fecha_emision_nombramiento_presi_p' => 'date',
            'presidente_electo' => 'required|integer',
            'cedula_presidente_junta_riego_e' => 'string|size:10',
            'nombres_presidente_junta_riego_e' => 'string|max:255',
            'email_presidente_junta_riego_e' => 'email',
            'telefono_presidente_junta_riego_e' => 'string|max:15',
            'fecha_caducidad' => 'date',
            'observaciones' => 'string|max:255',
        ]);

        DB::transaction(function () use ($request) {
            // 1) Insert into `juntas_riego`
            $junta = JuntaRiego::create([
                'num_carpeta_junta_riego' => $request->num_carpeta_junta_riego,
                'junta_riego'             => $request->junta_riego,
                'is_legalizada'           => $request->is_legalizada,
                'fecha_solicitud'         => $request->fecha_solicitud,
                'fecha_resolucion'        => $request->fecha_resolucion,
                'num_resolucion'          => $request->num_resolucion,
                'cantidad_beneficiarios'  => $request->cantidad_beneficiarios,
                'cod_tipo_riego'          => $request->cod_tipo_riego,
                'cod_oficina_tecnica'     => $request->cod_oficina_tecnica,
                'cod_parroquia'            => $request->parroquia_id,
                'provincia_id'            => $request->provincia_id,
                'canton_id'               => $request->canton_id,
                // etc...
            ]);

            // 2) Insert into `presidente_junta_riego` for the "presidente provisional"
            $presidenteProvisional = PresidenteJuntaRiego::create([
                'cedula_presidente_junta_riego'  => $request->cedula_presidente_junta_riego_p,
                'nombres_presidente_junta_riego' => $request->nombres_presidente_junta_riego_p,
                'email_presidente_junta_riego'   => $request->email_presidente_junta_riego_p,
                'tel_contacto_presidente_junta_riego' => $request->telefono_presidente_junta_riego_p,
                // etc...
            ]);

            // 3) Insert into `presidente_junta_riego` for the "presidente electo"
            // (if it’s required in your design)
            $presidenteElecto = PresidenteJuntaRiego::create([
                'cedula_presidente_junta_riego'  => $request->cedula_presidente_junta_riego_e,
                'nombres_presidente_junta_riego' => $request->nombres_presidente_junta_riego_e,
                'email_presidente_junta_riego'   => $request->email_presidente_junta_riego_e,
                'tel_contacto_presidente_junta_riego' => $request->telefono_presidente_junta_riego_e,
                'fecha_caducidad'               => $request->fecha_caducidad,
                // etc...
            ]);

            // 4) Insert into `historico_presidentes_j_r` 
            // for both the provisional and electo, or just one if that’s your logic.
            // For example, if you store them as separate records in historico:
            HistoricoPresidentesJR::create([
                'cod_junta_riego' => $junta->cod_junta_riego,
                'cod_presidente_junta_riego' => $presidenteProvisional->cod_presidente_junta_riego,
                'cod_tipo_presidente' => $request->presidente_provisional,
                'fecha_solicitud_nombramiento' => $request->fecha_solicitud_nombramiento_presi_p,
                'fecha_emision_nombramiento'   => $request->fecha_emision_nombramiento_presi_p,
            ]);

            HistoricoPresidentesJR::create([
                'cod_junta_riego' => $junta->cod_junta_riego,
                'cod_presidente_junta_riego' => $presidenteElecto->cod_presidente_junta_riego,
                'cod_tipo_presidente' => $request->presidente_electo,
                'observaciones'   => $request->observaciones,
            ]);

            // If any of the above fails (throws an exception),
            // Laravel will roll back the entire transaction.
        });

        return redirect()->route('juntasRiego.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
