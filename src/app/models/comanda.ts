export interface ItemComanda {
  productoId: number;
  nombre: string;
  cantidad: number;
  precioUnitario: number;
}

export type EstadoComanda = 'pendiente' | 'entregada' | 'pagada' | 'cancelada';

export interface Comanda {
  id?: string;
  mesa: number;
  items: ItemComanda[];
  estado: EstadoComanda;
  fecha: string;
}
