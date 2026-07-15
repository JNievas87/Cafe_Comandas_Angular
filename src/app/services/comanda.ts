import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Comanda, EstadoComanda } from '../models/comanda';

const API_URL = 'https://6903dd02d0f10a340b25fb66.mockapi.io/api/v1/comandas/comandas';

@Injectable({ providedIn: 'root' })
export class ComandaService {

  comandas = signal<Comanda[]>([]);

  constructor(private http: HttpClient) { }

  cargarComandas() {
    this.http.get<Comanda[]>(API_URL).subscribe(data => {
      this.comandas.set(data);
    });
  }

  crearComanda(comanda: Comanda) {
    return this.http.post<Comanda>(API_URL, comanda);
  }

  cambiarEstado(id: string, estado: EstadoComanda) {
    return this.http.put<Comanda>(API_URL + '/' + id, { estado: estado });
  }

  actualizarItems(id: string, items: Comanda['items'], estado: EstadoComanda) {
    return this.http.put<Comanda>(API_URL + '/' + id, { items: items, estado: estado });
  }

  eliminarComanda(id: string) {
    return this.http.delete(API_URL + '/' + id);
  }
}