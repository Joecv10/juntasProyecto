<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Illuminate\Support\Collection;


class JuntasDynamicExport implements FromCollection, WithHeadings
{
    /**
     * @return \Illuminate\Support\Collection
     */

    protected $results;
    protected $columns;

    public function __construct($results, $columns)
    {
        $this->results = $results;    // This is a collection (or array) of DB rows
        $this->columns = $columns;    // e.g. ["junta_riego","tipo_riego",...]
    }

    public function collection()
    {
        // Build a collection of arrays for each row
        $data = [];
        foreach ($this->results as $row) {
            $rowData = [];
            foreach ($this->columns as $col) {
                $rowData[] = $row->$col;
            }
            $data[] = $rowData;
        }
        return new Collection($data);
    }

    public function headings(): array
    {
        // Return these columns as the spreadsheet header row
        $labels = [
            'num_carpeta_junta_riego' => 'Nº Carpeta',
            'junta_riego' => 'Junta de Riego y/o Drenaje',
            'is_legalizada' => 'Legalizada',
            'tipo_riego' => 'Tipo de Riego',
            'cantidad_beneficiarios' => 'Cantidad de Beneficiarios',
            'fecha_resolucion' => 'Fecha Resolución',
            'num_resolucion' => 'Nº Resolucion',
            'canton' => 'Cantón',
            'parroquia' => 'Parroquia',
            'presidente_provisional' => 'Presidente Provisional',
            'presidente_electo' => 'Presidente Electo',
        ];

        return array_map(function ($col) use ($labels) {
            return $labels[$col] ?? $col;
        }, $this->columns);
    }
}
