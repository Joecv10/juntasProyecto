<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JuntaRiego extends Model
{
    protected $table = 'juntas_riego';
    protected $primaryKey = 'cod_junta_riego';
    public $timestamps = false;

    protected $fillable = [
        'num_carpeta_junta_riego',
        'junta_riego',
        'is_legalizada',
        'fecha_solicitud',
        'fecha_resolucion',
        'num_resolucion',
        'cantidad_beneficiarios',
        'cod_tipo_riego',
        'cod_oficina_tecnica',
        'cod_parroquia',
        'provincia_id',
        'canton_id',
    ];
}
