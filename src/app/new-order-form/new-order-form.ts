import { Component, inject } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
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
  fb = inject(FormBuilder);
  comandaService = inject(ComandaService);

  productos = PRODUCTOS;
  enviando = false;
  error = '';

  form = this.fb.group({
    mesa: this.fb.control<number | null>(null, [Validators.required, Validators.min(1), Validators.max(8)]),
    items: this.fb.array<FormGroup>([]),
  });

  items(): FormArray {
    return this.form.get('items') as FormArray;
  }

  // agrega el producto elegido a la lista de la comanda (columna de la derecha)
  agregarItem(productoIdStr: string, cantidadStr: string, selectEl: HTMLSelectElement, cantidadEl: HTMLInputElement) {
    const productoId = Number(productoIdStr);
    const cantidad = Number(cantidadStr);

    if (!productoId || cantidad < 1) {
      this.error = 'Elegí un producto y una cantidad válida antes de agregarlo.';
      return;
    }

    this.error = '';
    const grupo = this.fb.group({
      productoId: [productoId],
      cantidad: [cantidad],
    });
    this.items().push(grupo);

    // limpio los controles de "agregar producto" para el siguiente
    selectEl.value = '';
    cantidadEl.value = '1';
  }

  quitarItem(index: number) {
    this.items().removeAt(index);
  }

  nombreProducto(id: number): string {
    const producto = this.productos.find(p => p.id === id);
    return producto ? producto.nombre : '';
  }

  precioProducto(id: number): number {
    const producto = this.productos.find(p => p.id === id);
    return producto ? producto.precio : 0;
  }

  // avisa en el formulario si la mesa elegida ya tiene una comanda sin pagar
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

    if (this.items().length === 0) {
      this.error = 'Agregá al menos un producto a la comanda.';
      return;
    }

    const raw = this.form.getRawValue();
    const mesa = raw.mesa!;

    const itemsNuevos: ItemComanda[] = [];
    for (const item of raw.items) {
      const producto = this.productos.find(p => p.id === item['productoId']);
      if (producto) {
        itemsNuevos.push({
          productoId: producto.id,
          nombre: producto.nombre,
          cantidad: item['cantidad'],
          precioUnitario: producto.precio,
        });
      }
    }

    // si la mesa ya tiene una comanda pendiente/entregada, sumo los productos ahi
    const comandaExistente = this.comandaService.comandas().find(c => c.mesa === mesa && c.estado !== 'pagada' && c.estado !== 'cancelada');

    this.enviando = true;

    if (comandaExistente && comandaExistente.id) {
      const itemsCombinados = [...comandaExistente.items];
      for (const nuevo of itemsNuevos) {
        const existente = itemsCombinados.find(i => i.productoId === nuevo.productoId);
        if (existente) {
          existente.cantidad = existente.cantidad + nuevo.cantidad;
        } else {
          itemsCombinados.push(nuevo);
        }
      }

      this.comandaService.actualizarComanda(comandaExistente.id, {
        items: itemsCombinados,
        estado: 'pendiente', // si estaba entregada, vuelve a pendiente porque hay productos nuevos por preparar
      }).subscribe({
        next: () => {
          this.enviando = false;
          this.comandaService.cargarComandas();
          this.items().clear();
          this.form.reset({ mesa: null });
        },
        error: () => {
          this.enviando = false;
          this.error = 'No se pudo actualizar la comanda.';
        },
      });
      return;
    }

    const nuevaComanda: Comanda = {
      mesa: mesa,
      items: itemsNuevos,
      estado: 'pendiente',
      fecha: new Date().toISOString(),
    };

    this.comandaService.crearComanda(nuevaComanda).subscribe({
      next: () => {
        this.enviando = false;
        this.comandaService.cargarComandas();
        this.items().clear();
        this.form.reset({ mesa: null });
      },
      error: () => {
        this.enviando = false;
        this.error = 'No se pudo crear la comanda.';
      },
    });
  }
}
