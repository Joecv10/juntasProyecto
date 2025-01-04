<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OficinaTecnica extends Model
{
    protected $table = 'oficinas_tecnicas';
    protected $primaryKey = 'cod_oficina_tecnica';

    public function provincia()
    {
        return $this->belongsTo(Provincia::class, 'provincia_id', 'id'); // Adjust foreign keys as per your schema
    }
}
