<!DOCTYPE html>
<html>

<head>
    <title>Reporte de Juntas</title>
    <style>
        table {
            border-collapse: collapse;
            width: 100%;
        }

        table,
        th,
        td {
            border: 1px solid black;
            padding: 4px;
        }
    </style>
</head>

<body>

    @php
    $labels = [
    'num_carpeta_junta_riego' => 'Nº Carpeta',
    'junta_riego' => 'Junta de Riego y/o Drenaje',
    'is_legalizada' => 'Legalizada',
    'tipo_riego' => 'Tipo de Riego',
    'cantidad_beneficiarios' => 'Cantidad de Beneficiarios',
    'fecha_resolucion' => 'Fecha Resolucion',
    'num_resolucion' => 'Nº Resolucion',
    'canton' => 'Cantón',
    'parroquia' => 'Parroquia',
    'presidente_provisional' => 'Presidente Provisional',
    'presidente_electo' => 'Presidente Electo',
    ];
    @endphp

    <h1>Reporte de Juntas</h1>
    <table>
        <thead>
            <tr>
                @foreach($columns as $col)
                <th>{{ $labels[$col] ?? $col }}</th>
                @endforeach
            </tr>
        </thead>
        <tbody>
            @foreach($rows as $r)
            <tr>
                @foreach($columns as $col)
                <td>
                    @if($col === 'is_legalizada')
                    {{ $r->$col ? 'Sí' : 'No' }}
                    @else
                    {{ ucwords($r->$col) }}
                    {{-- For Unicode, consider: {{ \Illuminate\Support\Str::title($r->$col) }} --}}
                    @endif
                </td>
                @endforeach
            </tr>
            @endforeach
        </tbody>
    </table>
</body>

</html>