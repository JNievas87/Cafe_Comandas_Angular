import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Comanda, EstadoComanda } from '../models/comanda';

// TODO: reemplazar por la URL de tu propio recurso "comandas" creado en MockAPI.io
const API_URL = 'https://6903dd02d0f10a340b25fb66.mockapi.io/api/v1/comandas/comandas';

@Injectable({ providedIn: 'root' })
export class ComandaService {

  private http = inject(HttpClient);

  // signal en vez de array normal: sin esto, la pantalla no se refresca sola
  // porque el proyecto no usa zone.js (arquitectura zoneless)
  comandas = signal<Comanda[]>([]);

  cargarComandas() {
    this.http.get<Comanda[]>(API_URL).subscribe((data) => {
      this.comandas.set(data);
    });
  }

  crearComanda(comanda: Comanda) {
    return this.http.post<Comanda>(API_URL, comanda);
  }

  cambiarEstado(id: string, estado: EstadoComanda) {
    return this.http.put<Comanda>(API_URL + '/' + id, { estado: estado });
  }

  // actualiza items y/o estado de una comanda que ya existe (se usa para sumar productos)
  actualizarComanda(id: string, cambios: Partial<Comanda>) {
    return this.http.put<Comanda>(API_URL + '/' + id, cambios);
  }

  eliminarComanda(id: string) {
    return this.http.delete(API_URL + '/' + id);
  }
}
