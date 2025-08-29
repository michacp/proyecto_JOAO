<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Contacto;

class ContactosSeeder extends Seeder
{
    public function run(): void
    {
        Contacto::create([
            'nombre' => 'Juan Pérez',
            'email' => 'juan@example.com',
            'telefono' => '0991111111',
        ]);

        Contacto::create([
            'nombre' => 'Ana Gómez',
            'email' => 'ana@example.com',
            'telefono' => '0982222222',
        ]);

        Contacto::create([
            'nombre' => 'Carlos Ramírez',
            'email' => 'carlos@example.com',
            'telefono' => null, // opcional
        ]);
    }
}
