import { Component, EventEmitter, Output, inject } from '@angular/core';
import { ComandaService } from '../services/comanda';
import { Comanda } from '../models/comanda';

@Component({
  selector: 'app-table-list',
  imports: [],
  templateUrl: './table-list.html',
  styleUrl: './table-list.scss',
})
export class TableList {
  comandaService = inject(ComandaService);

  @Output() mesaSeleccionada = new EventEmitter<number>();

  mesas = [1, 2, 3, 4, 5, 6, 7, 8];

  // busca si la mesa tiene alguna comanda que no este pagada todavia
  comandaDeMesa(mesa: number): Comanda | undefined {
    for (const c of this.comandaService.comandas()) {
      if (c.mesa === mesa && c.estado !== 'pagada' && c.estado !== 'cancelada') {
        return c;
      }
    }
    return undefined;
  }

  seleccionar(mesa: number) {
    this.mesaSeleccionada.emit(mesa);
  }
}
