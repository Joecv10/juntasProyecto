<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\JuntaRiego;
use App\Models\PresidenteJuntaRiego;
use App\Models\HistoricoPresidentesJR;
use Barryvdh\DomPDF\Facade\Pdf;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\JuntasDynamicExport;




class JuntasRiegoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // 1) Get current user
        $user = Auth::user();

        // 2) Find the user’s oficina_tecnica
        $oficina = DB::table('oficinas_tecnicas')
            ->where('cod_oficina_tecnica', $user->cod_oficina_tecnica)
            ->first();

        // 3) From there, get the province ID
        //    (Assuming your oficinas_tecnicas table has an `id_provincia` or similar)
        $provinciaId = $oficina->id_provincia;

        // 1) Grab any potential filter values from the request
        $filterCanton       = $request->input('canton_id');
        $filterParroquia    = $request->input('parroquia_id');
        $filterLegalizada   = $request->input('is_legalizada');   // Could be 0 or 1
        $filterTipoRiego    = $request->input('cod_tipo_riego');
        $filterBeneficiarios = $request->input('min_beneficiarios'); // e.g. ">= some number"

        // 2) Start building the query
        $query = DB::table('juntas_riego as jr')
            ->select(
                'jr.cod_junta_riego',
                'jr.num_carpeta_junta_riego',
                'jr.junta_riego',
                'ot.cod_direccion_zonal',
                'dz.direccion_zonal',
                'jr.cod_oficina_tecnica',
                'ot.oficina_tecnica',
                'jr.provincia_id',
                'pr.provincia',
                'jr.canton_id',
                'ca.canton',
                'jr.cod_parroquia',
                'pa.parroquia',
                'jr.is_legalizada',
                'jr.cod_tipo_riego',
                'tr.tipo_riego',
                'jr.cantidad_beneficiarios',
                'jr.fecha_solicitud',
                'jr.fecha_resolucion',
                'jr.num_resolucion'
            )
            ->join('parroquias as pa', 'pa.parroquia_id', '=', 'jr.cod_parroquia')
            ->join('cantones as ca', 'ca.canton_id', '=', 'jr.canton_id')
            ->join('provincias as pr', 'pr.provincia_id', '=', 'jr.provincia_id')
            ->join('oficinas_tecnicas as ot', 'ot.cod_oficina_tecnica', '=', 'jr.cod_oficina_tecnica')
            ->join('direccion_zonal as dz', 'dz.cod_direccion_zonal', '=', 'ot.cod_direccion_zonal')
            ->join('tipo_riego as tr', 'tr.cod_tipo_riego', '=', 'jr.cod_tipo_riego')
            ->where('jr.is_active', 1)
            ->where('jr.provincia_id', $provinciaId);

        // 3) Conditionally apply filters if present
        if ($filterCanton) {
            $query->where('jr.canton_id', $filterCanton);
        }

        if ($filterParroquia) {
            $query->where('jr.cod_parroquia', $filterParroquia);
        }

        // `is_legalizada` might be '0' or '1', so we check for null
        if (!is_null($filterLegalizada)) {
            $query->where('jr.is_legalizada', $filterLegalizada);
        }

        if ($filterTipoRiego) {
            $query->where('jr.cod_tipo_riego', $filterTipoRiego);
        }

        if ($filterBeneficiarios) {
            $query->where('jr.cantidad_beneficiarios', '>=', $filterBeneficiarios);
        }

        // 4) Get the final filtered results
        $listaJuntas = $query->get();

        // 5) (Optional) Also fetch data for the dropdowns
        $cantones = DB::table('cantones')->where('provincia_id', $provinciaId)
            ->get();
        $cantonIds = $cantones->pluck('canton_id'); // e.g. [12, 13, ...]
        $parroquias = DB::table('parroquias')
            ->whereIn('canton_id', $cantonIds)
            ->get();
        $tiposRiego = DB::table('tipo_riego')->get();

        return inertia('JuntasRiego/JuntasRiegoIndex', [
            'listaJuntas' => $listaJuntas,
            'cantones' => $cantones,
            'parroquias' => $parroquias,
            'tiposRiego' => $tiposRiego,
            // (Optional) pass current filter state, so the UI can show what's selected
            'filters' => $request->only([
                'canton_id',
                'parroquia_id',
                'is_legalizada',
                'cod_tipo_riego',
                'min_beneficiarios',
            ]),
        ]);
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
            'telefono_presidente_junta_riego_p' => 'string|max:15|size:10',
            'fecha_solicitud_nombramiento_presi_p' => 'date',
            'fecha_emision_nombramiento_presi_p' => 'date',
            'presidente_electo' => 'required|integer',
            'cedula_presidente_junta_riego_e' => 'string|size:10',
            'nombres_presidente_junta_riego_e' => 'string|max:255',
            'email_presidente_junta_riego_e' => 'email',
            'telefono_presidente_junta_riego_e' => 'string|max:15|size:10',
            'fecha_caducidad' => 'date',
            'observaciones' => 'string|max:255',
        ], [
            'cedula_presidente_junta_riego_p.size' => 'La cédula debe tener una longitud de 10 digitos',
            'cedula_presidente_junta_riego_e.size' => 'La cédula debe tener una longitud de 10 digitos',
            'telefono_presidente_junta_riego_p.size' => 'El teléfono debe tener una longitud de 10 digitos',
            'telefono_presidente_junta_riego_e.size' => 'El teléfono debe tener una longitud de 10 digitos',
        ]);

        DB::transaction(function () use ($request) {
            // 1) Insert into `juntas_riego`
            $junta = JuntaRiego::create([
                'num_carpeta_junta_riego' => $request->num_carpeta_junta_riego,
                'junta_riego'             => strtoupper(trim($request->junta_riego)),
                'is_legalizada'           => $request->is_legalizada,
                'fecha_solicitud'         => $request->fecha_solicitud,
                'fecha_resolucion'        => $request->fecha_resolucion,
                'num_resolucion'          => strtoupper(trim($request->num_resolucion)),
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
                'nombres_presidente_junta_riego' => strtoupper(trim($request->nombres_presidente_junta_riego_p)),
                'email_presidente_junta_riego'   => strtolower(trim($request->email_presidente_junta_riego_p)),
                'tel_contacto_presidente_junta_riego' => $request->telefono_presidente_junta_riego_p,
                // etc...
            ]);

            // 3) Insert into `presidente_junta_riego` for the "presidente electo"
            // (if it’s required in your design)
            $presidenteElecto = PresidenteJuntaRiego::create([
                'cedula_presidente_junta_riego'  => $request->cedula_presidente_junta_riego_e,
                'nombres_presidente_junta_riego' => strtoupper(trim($request->nombres_presidente_junta_riego_e)),
                'email_presidente_junta_riego'   => strtolower(trim($request->email_presidente_junta_riego_e)),
                'tel_contacto_presidente_junta_riego' => $request->telefono_presidente_junta_riego_e,
                'fecha_caducidad' => $request->fecha_caducidad,
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
        $query = DB::table('juntas_riego as jr')
            ->select(
                'jr.cod_junta_riego',
                'jr.num_carpeta_junta_riego',
                'jr.junta_riego',
                'ot.cod_direccion_zonal',
                'dz.direccion_zonal',
                'jr.cod_oficina_tecnica',
                'ot.oficina_tecnica',
                'jr.provincia_id',
                'pr.provincia',
                'jr.canton_id',
                'ca.canton',
                'jr.cod_parroquia',
                'pa.parroquia',
                'jr.is_legalizada',
                'jr.cod_tipo_riego',
                'tr.tipo_riego',
                'jr.cantidad_beneficiarios',
                'jr.fecha_solicitud',
                'jr.fecha_resolucion',
                'jr.num_resolucion',
                'jr.is_active'
            )
            ->join('parroquias as pa', 'pa.parroquia_id', '=', 'jr.cod_parroquia')
            ->join('cantones as ca', 'ca.canton_id', '=', 'jr.canton_id')
            ->join('provincias as pr', 'pr.provincia_id', '=', 'jr.provincia_id')
            ->join('oficinas_tecnicas as ot', 'ot.cod_oficina_tecnica', '=', 'jr.cod_oficina_tecnica')
            ->join('direccion_zonal as dz', 'dz.cod_direccion_zonal', '=', 'ot.cod_direccion_zonal')
            ->join('tipo_riego as tr', 'tr.cod_tipo_riego', '=', 'jr.cod_tipo_riego')
            ->where('jr.cod_junta_riego', $id)
            ->where('jr.is_active', 1);

        $queryPredidenteProv = DB::table('presidente_junta_riego as pjr')
            ->join('historico_presidentes_j_r as hpp', 'pjr.cod_presidente_junta_riego', '=', 'hpp.cod_presidente_junta_riego')
            ->where('hpp.cod_junta_riego', $id)
            ->where('hpp.cod_tipo_presidente', 1)
            ->where('pjr.is_active', 1);

        $queryPresidenteJunta =  DB::table('presidente_junta_riego as pjr')
            ->join('historico_presidentes_j_r as hpp', 'pjr.cod_presidente_junta_riego', '=', 'hpp.cod_presidente_junta_riego')
            ->where('hpp.cod_junta_riego', $id)
            ->where('pjr.is_active', 1)
            ->whereIn('hpp.cod_tipo_presidente', [2, 3])
            ->orderBy('pjr.fecha_caducidad', 'desc')
            ->get();




        $JuntaRiego = $query->get();
        $presiProv = $queryPredidenteProv->get();
        $presidenteJunta = $queryPresidenteJunta;

        return inertia('JuntasRiego/JuntaView', [
            'juntaRiego' => $JuntaRiego,
            'presidenteProv' => $presiProv,
            'presidenteJunta' => $presidenteJunta,
        ]);
    }

    /**
     * Soft delete the specified resource.
     */

    public function deletePresident($id)
    {
        $presidente = PresidenteJuntaRiego::find($id);
        $presidente->is_active = 0;
        $presidente->save();

        return redirect()->back();
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
        $junta = JuntaRiego::find($id);
        $junta->is_active = 0;
        $junta->save();

        return redirect()->route('juntasRiego.index');
    }

    // Añadir Presidente
    public function registerPresidenteForm($codJuntaRiego)
    {
        return inertia('JuntasRiego/RegisterPresident', [
            'codJuntaRiego' => $codJuntaRiego,
        ]);
    }

    public function registerPresidente(Request $request)
    {
        $request->validate([
            'cod_junta_riego' => 'required|integer',
            'presidente_electo' => 'required|integer',
            'cedula_presidente_junta_riego_e' => 'string|size:10',
            'nombres_presidente_junta_riego_e' => 'string|max:255',
            'email_presidente_junta_riego_e' => 'email',
            'telefono_presidente_junta_riego_e' => 'string|max:15|size:10',
            'fecha_caducidad' => 'date',
            'observaciones' => 'string|max:255',
        ], [
            'cedula_presidente_junta_riego_e.size' => 'La cédula debe tener una longitud de 10 digitos',
            'telefono_presidente_junta_riego_e.size' => 'El teléfono debe tener una longitud de 10 digitos',
        ]);

        DB::transaction(function () use ($request) {

            // 3) Insert into `presidente_junta_riego` for the "presidente electo"
            // (if it’s required in your design)
            $presidenteElecto = PresidenteJuntaRiego::create([
                'cedula_presidente_junta_riego'  => $request->cedula_presidente_junta_riego_e,
                'nombres_presidente_junta_riego' => strtoupper(trim($request->nombres_presidente_junta_riego_e)),
                'email_presidente_junta_riego'   => strtolower(trim($request->email_presidente_junta_riego_e)),
                'tel_contacto_presidente_junta_riego' => $request->telefono_presidente_junta_riego_e,
                'fecha_caducidad' => $request->fecha_caducidad,
                // etc...
            ]);

            HistoricoPresidentesJR::create([
                'cod_junta_riego' => $request->cod_junta_riego,
                'cod_presidente_junta_riego' => $presidenteElecto->cod_presidente_junta_riego,
                'cod_tipo_presidente' => $request->presidente_electo,
                'observaciones'   => $request->observaciones,
            ]);

            // If any of the above fails (throws an exception),
            // Laravel will roll back the entire transaction.
        });

        return redirect()->route('juntasRiego.show', $request->cod_junta_riego);
    }

    public function reportForm()
    {
        // 1) Get current user & province
        $user = Auth::user();
        $oficina = DB::table('oficinas_tecnicas')
            ->where('cod_oficina_tecnica', $user->cod_oficina_tecnica)
            ->first();
        $provinciaId = $oficina->id_provincia;

        $provincias = DB::table('provincias')->get();

        // 2) Get list of possible cantones & tipos riego
        $cantones = DB::table('cantones')
            ->where('provincia_id', $provinciaId)
            ->get();

        $parroquias = DB::table('parroquias')
            ->whereIn('canton_id', $cantones->pluck('canton_id'))
            ->get();

        $tiposRiego = DB::table('tipo_riego')->get();

        // 3) Return an Inertia page with these
        return inertia('JuntasRiego/ReportForm', [
            'provincias' => $provincias,
            'cantones' => $cantones,
            'tiposRiego' => $tiposRiego,
            'parroquias' => $parroquias,
        ]);
    }

    public function generateReport(Request $request)
    {
        // 1) Get filters
        $cantonId      = $request->input('canton_id');
        $parroquiaId      = $request->input('parroquia_id');
        $isLegalizada  = $request->input('is_legalizada');
        $tipoRiego     = $request->input('cod_tipo_riego');
        $fechaDesde    = $request->input('fecha_desde'); // if you want "fecha_resolucion >= fechaDesde"
        $fechaHasta    = $request->input('fecha_hasta'); // if you want "fecha_resolucion <= fechaHasta"
        $minBenef      = $request->input('min_beneficiarios'); // if needed

        // 2) Columns the user picked (array of strings)
        //    e.g. ["num_carpeta_junta_riego","junta_riego","tipo_riego"]
        $columns = $request->input('columns', []);

        if (is_string($columns)) {
            $columns = explode(',', $columns);
        }

        // 3) Export format
        $exportFormat = $request->input('export_format', 'pdf'); // 'pdf' or 'excel'

        // 4) Query building (similar to index())
        $user = Auth::user();
        $oficina = DB::table('oficinas_tecnicas')
            ->where('cod_oficina_tecnica', $user->cod_oficina_tecnica)
            ->first();
        $provinciaId = $oficina->id_provincia;

        // 5) Build the query with the necessary joins
        $query = DB::table('juntas_riego as jr')
            ->join('cantones as ca', 'ca.canton_id', '=', 'jr.canton_id')
            ->join('parroquias as pa', 'pa.parroquia_id', '=', 'jr.cod_parroquia')
            ->join('tipo_riego as tr', 'tr.cod_tipo_riego', '=', 'jr.cod_tipo_riego')
            // Add the president joins (using LEFT JOIN so that missing data doesn’t exclude the row)
            ->leftJoin('historico_presidentes_j_r as hp1', function ($join) {
                $join->on('jr.cod_junta_riego', '=', 'hp1.cod_junta_riego')
                    ->where('hp1.cod_tipo_presidente', '=', 1);
            })
            ->leftJoin('presidente_junta_riego as pprov', 'pprov.cod_presidente_junta_riego', '=', 'hp1.cod_presidente_junta_riego')
            ->leftJoin('historico_presidentes_j_r as hp2', function ($join) {
                $join->on('jr.cod_junta_riego', '=', 'hp2.cod_junta_riego')
                    ->where('hp2.cod_tipo_presidente', '=', 2);
            })
            ->leftJoin('presidente_junta_riego as pelecto', 'pelecto.cod_presidente_junta_riego', '=', 'hp2.cod_presidente_junta_riego')
            ->where('jr.provincia_id', $provinciaId);

        // Apply filters
        if ($cantonId) {
            $query->where('jr.canton_id', $cantonId);
        }
        if ($parroquiaId) {
            $query->where('jr.cod_parroquia', $parroquiaId);
        }
        if (!is_null($isLegalizada) && $isLegalizada !== '') {
            $query->where('jr.is_legalizada', $isLegalizada);
        }
        if ($tipoRiego) {
            $query->where('jr.cod_tipo_riego', $tipoRiego);
        }
        if ($fechaDesde) {
            $query->whereDate('jr.fecha_resolucion', '>=', $fechaDesde);
        }
        if ($fechaHasta) {
            $query->whereDate('jr.fecha_resolucion', '<=', $fechaHasta);
        }
        if ($minBenef) {
            $query->where('jr.cantidad_beneficiarios', '>=', $minBenef);
        }

        // 5) Build a map of columns => actual DB columns
        $availableCols = [
            'num_carpeta_junta_riego' => 'jr.num_carpeta_junta_riego',
            'junta_riego'             => 'jr.junta_riego',
            'is_legalizada'           => 'jr.is_legalizada',
            'tipo_riego'              => 'tr.tipo_riego',
            'cantidad_beneficiarios'  => 'jr.cantidad_beneficiarios',
            'fecha_resolucion'        => 'jr.fecha_resolucion',
            'num_resolucion'        => 'jr.num_resolucion',
            'canton'                  => 'ca.canton',
            'parroquia'               => 'pa.parroquia',
            'presidente_provisional'  => 'pprov.nombres_presidente_junta_riego',
            'presidente_electo'       => 'pelecto.nombres_presidente_junta_riego',
            // Add as many as you want user to choose
        ];

        // Always add "jr.cod_junta_riego" for a unique key if needed
        $selects = ['jr.cod_junta_riego'];

        // Append the user-selected columns
        foreach ($columns as $col) {
            if (isset($availableCols[$col])) {
                $selects[] = $availableCols[$col] . ' as ' . $col;
            }
        }

        // If user chose no columns, fallback to something
        if (count($selects) === 1) {
            $selects[] = 'jr.junta_riego as junta_riego';
            $columns[] = 'junta_riego';
        }

        // Final select
        $query->select($selects);
        $results = $query->get();

        // 6) Decide PDF or Excel
        if ($exportFormat === 'excel') {
            return Excel::download(new JuntasDynamicExport($results, $columns), 'reporte_juntas.xlsx');
        } else {
            // PDF
            $pdf = PDF::loadView('reports.juntas', [
                'rows' => $results,
                'columns' => $columns,
            ]);
            return $pdf->download('reporte_juntas.pdf');
        }
    }
}
