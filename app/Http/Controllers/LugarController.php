<?php

namespace App\Http\Controllers;

use App\Models\Provincia;
use App\Models\Canton;
use App\Models\Parroquia;
use Illuminate\Http\Request;

class LugarController extends Controller
{
    public function buscarProvincias(Request $request)
    {
        $term = $request->get('term', '');
        $provincias = Provincia::where('provincia', 'like', "%{$term}%")
            ->limit(5)
            ->get()
            ->map(function ($prov) {
                return [
                    'id'   => $prov->provincia_id,
                    'nombre' => $prov->provincia,
                ];
            });

        return response()->json($provincias);
    }

    public function buscarCantones(Request $request)
    {
        $term = $request->get('term', '');
        $provinciaId = $request->get('provincia_id');

        $query = Canton::query();

        // Filtra por provincia
        if ($provinciaId) {
            $query->where('provincia_id', $provinciaId);
        }

        // Filtra por texto
        $query->where('canton', 'like', "%{$term}%");

        $cantones = $query->limit(5)->get()->map(function ($can) {
            return [
                'id'   => $can->canton_id,
                'nombre' => $can->canton,
            ];
        });

        return response()->json($cantones);
    }

    public function buscarParroquias(Request $request)
    {
        $term = $request->get('term', '');
        $cantonId = $request->get('canton_id');

        $query = Parroquia::query();

        // Filtra por cantón
        if ($cantonId) {
            $query->where('canton_id', $cantonId);
        }

        // Filtra por texto
        $query->where('parroquia', 'like', "%{$term}%");

        $parroquias = $query->limit(5)->get()->map(function ($par) {
            return [
                'id'   => $par->parroquia_id,
                'nombre' => $par->parroquia,
            ];
        });

        return response()->json($parroquias);
    }

    public function buscarProvinciaByName(Request $request)
    {
        $name = $request->input('name'); // ej: "Chimborazo"
        $provincia = Provincia::where('provincia', $name)->first();
        // O => ->firstOrFail() si quieres 404 en caso de no encontrar

        if (!$provincia) {
            return response()->json(['message' => 'No se encontró esa provincia'], 404);
        }

        // Retornamos { provincia_id, provincia }
        return response()->json([
            'provincia_id' => $provincia->provincia_id,
            'provincia'    => $provincia->provincia,
        ]);
    }
}
