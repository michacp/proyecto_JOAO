<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\Contacto;

Route::get('/contactos', function (Request $request) {
    info('Request data:', $request->all());

    $pagina = $request->input('pagina', 1);
    $porPagina = $request->input('porPagina', 10);

    $query = Contacto::query();

    if ($request->filled('busqueda')) {
        $busqueda = $request->input('busqueda');
        $query->where(function ($q) use ($busqueda) {
            $q->where('nombre', 'like', "%{$busqueda}%")
              ->orWhere('email', 'like', "%{$busqueda}%")
              ->orWhere('telefono', 'like', "%{$busqueda}%");
        });
    }

    $total = $query->count();
    $totalPaginas = ceil($total / $porPagina);

    $contactos = $query->skip(($pagina - 1) * $porPagina)
                       ->take($porPagina)
                       ->get();

    return response()->json([
        'contactos' => $contactos,
        'total' => $total,
        'pagina' => $pagina,
        'totalPaginas' => $totalPaginas
    ]);
});

Route::post('/contactos', function (Request $request) {
    // Validación
    $validated = $request->validate([
        'nombre'   => 'required|string|max:255',
        'email'    => 'required|email|max:255',
        'telefono' => 'nullable|string|max:20',
    ]);

    // Guardar en DB
    $contacto = Contacto::create($validated);

    return response()->json([
        'message' => 'Contacto creado con éxito',
        'contacto' => $contacto
    ], 201);
});
Route::post('/contactos/verificar-email', function (Request $request) {
    $request->validate([
        'email' => 'required|email'
    ]);

    $existe = Contacto::where('email', $request->email)->exists();

    return response()->json([
        'email' => $request->email,
        'existe' => $existe
    ]);
});

Route::put('/contactos/{id}', function (Request $request, $id) {
    $contacto = Contacto::findOrFail($id);

    $validated = $request->validate([
        'nombre'   => 'required|string|max:255', 
        'telefono' => 'nullable|string|max:20',
    ]);

    $contacto->update($validated);

    return response()->json([
        'message'  => 'Contacto actualizado con éxito',
        'contacto' => $contacto
    ]);
}); 
Route::delete('/contactos/{id}', function ($id) {
    $contacto = Contacto::findOrFail($id);
    $contacto->delete();

    return response()->json([
        'message' => 'Contacto eliminado con éxito'
    ]);
});
