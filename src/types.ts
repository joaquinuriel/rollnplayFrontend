export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  correo: string;
  contraseña: string;
  carrito: Carrito;
  productos: Producto[];
  compras: Item[];
}

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  imageUrl: string;
  precio: number;
  stock: number;
  categoria: Categoria;
  vendedor: Usuario;
}

export interface Categoria {
  id: number;
  nombre: string;
}

export interface Carrito {
  id: number;
  items: Item[];
}

export interface Item {
  id: number;
  cantidad: number;
  producto: Producto;
  carrito: Carrito;
}
