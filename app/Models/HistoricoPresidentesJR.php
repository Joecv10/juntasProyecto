<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HistoricoPresidentesJR extends Model
{
    protected $table = 'historico_presidentes_j_r';
    protected $primaryKey = null;
    public $incrementing = false;
    public $timestamps = false;

    protected $fillable = [
        'cod_junta_riego',
        'cod_presidente_junta_riego',
        'cod_tipo_presidente',
        'fecha_solicitud_nombramiento',
        'fecha_emision_nombramiento',
        'observaciones',
    ];
}
