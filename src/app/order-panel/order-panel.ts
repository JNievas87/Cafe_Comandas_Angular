import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComandaService } from '../services/comanda';
import { Comanda } from '../models/comanda';

@Component({
  selector: 'app-order-panel',
  imports: [CommonModule],
  templateUrl: './order-panel.html',
  styleUrl: './order-panel.scss',
})
export class OrderPanel {

  @Input() mesa: number | null = null;

  constructor(private comandaService: ComandaService) { }

  comanda(): Comanda | undefined {
    if (!this.mesa) {
      return undefined;
    }
    return this.comandaService.comandas().find(c => c.mesa === this.mesa && c.estado !== 'pagada' && c.estado !== 'cancelada');
  }

  total(): number {
    let suma = 0;
    const comandaActual = this.comanda();
    if (comandaActual) {
      for (const item of comandaActual.items) {
        suma = suma + (item.cantidad * item.precioUnitario);
      }
    }
    return suma;
  }

  marcarEntregada() {
    const comandaActual = this.comanda();
    if (comandaActual && comandaActual.id) {
      this.comandaService.cambiarEstado(comandaActual.id, 'entregada').subscribe(() => {
        this.comandaService.cargarComandas();
      });
    }
  }

  marcarPagada() {
    const comandaActual = this.comanda();
    if (comandaActual && comandaActual.id) {
      this.comandaService.cambiarEstado(comandaActual.id, 'pagada').subscribe(() => {
        this.comandaService.cargarComandas();
      });
    }
  }

  cancelar() {
    const comandaActual = this.comanda();
    if (comandaActual && comandaActual.id) {
      this.comandaService.cambiarEstado(comandaActual.id, 'cancelada').subscribe(() => {
        this.comandaService.cargarComandas();
      });
    }
  }
}