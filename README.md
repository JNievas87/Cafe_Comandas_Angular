# ☕ Café Central

Trabajo Práctico Final — Seminario Angular 2026 (TUDAI, UNICEN)

## Temática

Gestión de comandas de un café. La app permite ver las mesas del local,
tomar una comanda nueva para una mesa (con productos y cantidades),
cambiar su estado (pendiente → entregada → pagada) y cancelarla. También
incluye una sección de Menú con el catálogo de productos por categoría.

## Datos del estudiante

- Nombre y Apellido: COMPLETAR
- DNI: COMPLETAR
- Email: COMPLETAR
- Sede: Tandil

## Requisitos cubiertos

- **Ruteo:** `/mesas` y `/menu`, cada una con su componente de página.
- **Componentes:** la página `/mesas` combina `TableList`, `OrderPanel` y `NewOrderForm`.
- **Interfaces:** `Producto`, `Comanda`, `ItemComanda` (ver `src/app/models`).
- **Control flow:** `@for`, `@if`, `@empty` en todas las plantillas.
- **Comunicación entre componentes:** `TableList` emite la mesa seleccionada
  con `@Output` y `Mesas` se la pasa a `OrderPanel` por `@Input`. Además,
  `ComandaService` (con `signal`) mantiene sincronizados los tres componentes
  de la página de mesas.
- **API externa (MockAPI):**
  - GET `/comandas` — listar comandas activas.
  - POST `/comandas` — crear comanda nueva (desde el formulario).
  - PUT `/comandas/:id` — cambiar estado.
  - DELETE `/comandas/:id` — cancelar comanda.
- **Reactive Form:** alta de comanda en `NewOrderForm`, con `FormArray` para
  los productos, validaciones de mesa (1-8), producto requerido y cantidad
  mínima 1.

## Cómo correrlo

1. Reemplazar la constante `API_URL` en `src/app/services/comanda.ts` por la
   URL de tu propio recurso `comandas` creado en https://mockapi.io/
2. Instalar dependencias y levantar el servidor:

```bash
npm install
ng serve
```

3. Abrir `http://localhost:4200/`.
