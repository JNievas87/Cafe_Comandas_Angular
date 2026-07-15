import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ComandaService } from '../services/comanda';
import { PRODUCTOS } from '../data/productos';
import { Comanda, ItemComanda } from '../models/comanda';

@Component({
  selector: 'app-new-order-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './new-order-form.html',
  styleUrl: './new-order-form.scss',
})
export class NewOrderForm {

  productos = PRODUCTOS;
  items: ItemComanda[] = [];
  enviando = false;
  error = '';

  form = new FormGroup({
    mesa: new FormControl<number | null>(null, [Validators.required, Validators.min(1), Validators.max(8)]),
  });

  constructor(private comandaService: ComandaService) { }

  agregarItem(productoIdStr: string, cantidadStr: string, selectEl: HTMLSelectElement, cantidadEl: HTMLInputElement) {
    const productoId = Number(productoIdStr);
    const cantidad = Number(cantidadStr);

    if (!productoId || cantidad < 1) {
      this.error = 'Elegí un producto y una cantidad válida antes de agregarlo.';
      return;
    }

    this.error = '';
    const producto = this.productos.find(p => p.id === productoId);
    if (producto) {
      this.items.push({
        productoId: producto.id,
        nombre: producto.nombre,
        cantidad: cantidad,
        precioUnitario: producto.precio,
      });
    }

    selectEl.value = '';
    cantidadEl.value = '1';
  }

  quitarItem(index: number) {
    this.items.splice(index, 1);
  }

  mesaTieneComandaActiva(): boolean {
    const mesa = this.form.get('mesa')?.value;
    if (!mesa) {
      return false;
    }
    return this.comandaService.comandas().some(c => c.mesa === mesa && c.estado !== 'pagada' && c.estado !== 'cancelada');
  }

  enviar() {
    this.error = '';

    if (this.form.get('mesa')?.invalid) {
      this.form.get('mesa')?.markAsTouched();
      this.error = 'Falta completar la mesa (entre 1 y 8).';
      return;
    }

    if (this.items.length === 0) {
      this.error = 'Agregá al menos un producto a la comanda.';
      return;
    }

    const mesa = this.form.get('mesa')?.value as number;

    const comandaExistente = this.comandaService.comandas().find(c => c.mesa === mesa && c.estado !== 'pagada' && c.estado !== 'cancelada');

    this.enviando = true;

    if (comandaExistente && comandaExistente.id) {
      const itemsCombinados = [...comandaExistente.items];
      for (let nuevo of this.items) {
        const existente = itemsCombinados.find(i => i.productoId === nuevo.productoId);
        if (existente) {
          existente.cantidad = existente.cantidad + nuevo.cantidad;
        } else {
          itemsCombinados.push(nuevo);
        }
      }

      this.comandaService.actualizarItems(comandaExistente.id, itemsCombinados, 'pendiente').subscribe(() => {
        this.enviando = false;
        this.comandaService.cargarComandas();
        this.items = [];
        this.form.reset({ mesa: null });
      });
      return;
    }

    const nuevaComanda: Comanda = {
      mesa: mesa,
      items: this.items,
      estado: 'pendiente',
      fecha: new Date().toISOString(),
    };

    this.comandaService.crearComanda(nuevaComanda).subscribe(() => {
      this.enviando = false;
      this.comandaService.cargarComandas();
      this.items = [];
      this.form.reset({ mesa: null });
    });
  }
}