import { Component, OnInit } from '@angular/core';
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

  constructor(private comandaService: ComandaService) { }

  ngOnInit() {
    this.comandaService.cargarComandas();
  }

  comandasFinalizadas(): Comanda[] {
    const finalizadas = this.comandaService.comandas().filter(c => c.estado === 'pagada' || c.estado === 'cancelada');

    finalizadas.sort((a, b) => {
      const fechaA = new Date(a.fecha).getTime();
      const fechaB = new Date(b.fecha).getTime();
      return fechaB - fechaA;
    });

    return finalizadas;
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