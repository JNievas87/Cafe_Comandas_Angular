import { Component, OnInit } from '@angular/core';
import { TableList } from '../table-list/table-list';
import { OrderPanel } from '../order-panel/order-panel';
import { NewOrderForm } from '../new-order-form/new-order-form';
import { ComandaService } from '../services/comanda';

@Component({
  selector: 'app-mesas',
  imports: [TableList, OrderPanel, NewOrderForm],
  templateUrl: './mesas.html',
  styleUrl: './mesas.scss',
})
export class Mesas implements OnInit {
  mesaActual: number | null = null;

  constructor(private comandaService: ComandaService) { }

  ngOnInit() {
    this.comandaService.cargarComandas();
  }

  onMesaSeleccionada(mesa: number) {
    this.mesaActual = mesa;
  }
}