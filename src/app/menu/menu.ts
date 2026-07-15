import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PRODUCTOS } from '../data/productos';
import { Producto } from '../models/producto';

@Component({
  selector: 'app-menu',
  imports: [CommonModule],
  templateUrl: './menu.html',
  styleUrl: './menu.scss',
})
export class Menu {
  protected readonly categorias: Producto['categoria'][] = ['bebidas', 'comidas', 'postres'];
  protected readonly productos = PRODUCTOS;

  productosPorCategoria(categoria: Producto['categoria']): Producto[] {
    return this.productos.filter((p) => p.categoria === categoria);
  }
}
