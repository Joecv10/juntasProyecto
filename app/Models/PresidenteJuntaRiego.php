<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PresidenteJuntaRiego extends Model
{
    protected $table = 'presidente_junta_riego';
    protected $primaryKey = 'cod_presidente_junta_riego';
    public $timestamps = false;

    protected $fillable = [
        'cedula_presidente_junta_riego',
        'nombres_presidente_junta_riego',
        'email_presidente_junta_riego',
        'tel_contacto_presidente_junta_riego',
        'email_presidente_junta_riego',
        'fecha_caducida',
    ];
}
