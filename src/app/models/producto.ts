export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  categoria: 'bebidas' | 'comidas' | 'postres';
}
