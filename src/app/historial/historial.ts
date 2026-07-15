import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComandaService } from '../services/comanda';
import { Comanda } from '../models/comanda';

@Component({
  selector: 'app-historial',
  imports: [CommonModule],
  templateUrl: './historial.html',
  styleUrl: './historial.scss',
})
export class Historial implements OnInit {
  comandaService = inject(ComandaService);

  ngOnInit() {
    this.comandaService.cargarComandas();
  }

  // solo las comandas que ya terminaron su ciclo (pagadas o canceladas)
  comandasFinalizadas(): Comanda[] {
    return this.comandaService.comandas().filter(c => c.estado === 'pagada' || c.estado === 'cancelada');
  }

  totalComanda(comanda: Comanda): number {
    let suma = 0;
    for (const item of comanda.items) {
      suma = suma + (item.cantidad * item.precioUnitario);
    }
    return suma;
  }

  eliminar(id: string | undefined) {
    if (id) {
      this.comandaService.eliminarComanda(id).subscribe(() => {
        this.comandaService.cargarComandas();
      });
    }
  }
}
