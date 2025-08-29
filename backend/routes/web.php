<?php

use Illuminate\Support\Facades\Route;
use App\Models\Contacto;

Route::get('/', function () {
    return view('welcome');
});
Route::post('/ver-contactos', function (Request $request) {
  
     info('Request data:', $request->all());

    // Parámetros de búsqueda y paginación
    $pagina = $request->input('pagina', 1); // por defecto página 1
    $porPagina = $request->input('porPagina', 10); // por defecto 10 por página

    $query = Contacto::query();

    // Filtros opcionales
    if ($request->filled('nombre')) {
        $query->where('nombre', 'like', '%' . $request->input('nombre') . '%');
    }
    if ($request->filled('email')) {
        $query->where('email', 'like', '%' . $request->input('email') . '%');
    }
    if ($request->filled('telefono')) {
        $query->where('telefono', 'like', '%' . $request->input('telefono') . '%');
    }

    // Obtener total de registros
    $total = $query->count();

    // Calcular total de páginas
    $totalPaginas = ceil($total / $porPagina);

    // Obtener los registros paginados
    $contactos = $query->skip(($pagina - 1) * $porPagina)
                       ->take($porPagina)
                       ->get();

    // Armar respuesta con formato esperado
    return response()->json([
        'contactos' => $contactos,
        'total' => $total,
        'pagina' => $pagina,
        'totalPaginas' => $totalPaginas
    ]);
});
 