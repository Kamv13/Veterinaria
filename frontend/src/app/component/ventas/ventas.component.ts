// ventas.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VentaService } from '../../services/venta.service';

@Component({
  selector: 'app-ventas',
  imports: [CommonModule, FormsModule],
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.scss']
})
export class VentasComponent implements OnInit {
  // Datos
  ventas: any[] = [];
  productos: any[] = [];
  clientes: any[] = [];
  detalleVenta: any[] = [];

  // Estados de loading
  loadingVentas = false;
  loadingProductos = false;
  loadingClientes = false;

  // Modales
  showDetalleModal = false;
  showNuevaVentaModal = false;

  // Nueva Venta
  nuevaVenta = {
    id_cliente: 0,
    total: 0,
    detalle: [] as any[]
  };

  // Producto seleccionado para agregar
  productoSeleccionado = {
    id_producto: 0,
    cantidad: 1
  };

  // Venta seleccionada para ver detalle
  ventaSeleccionada: any = null;

  // Tabs
  activeTab = 'ventas';

  // Errores
  errorMessage = '';
  successMessage = '';

  constructor(private ventaService: VentaService) {}

  ngOnInit() {
    this.cargarVentas();
    this.cargarProductos();
    this.cargarClientes();
  }

  parseFloat(value: any): number {
    return parseFloat(value);
  }


  // Cambiar tab
  changeTab(tab: string) {
    this.activeTab = tab;
  }

  // Cargar datos
  cargarVentas() {
    this.loadingVentas = true;
    this.ventaService.getVentas().subscribe({
      next: (response) => {
        this.ventas = response.data;
        this.loadingVentas = false;
      },
      error: (error) => {
        console.error('Error al cargar ventas:', error);
        this.loadingVentas = false;
        this.mostrarError('Error al cargar ventas');
      }
    });
  }

  cargarProductos() {
    this.loadingProductos = true;
    this.ventaService.getProductos().subscribe({
      next: (response) => {
        this.productos = response.data;
        this.loadingProductos = false;
      },
      error: (error) => {
        console.error('Error al cargar productos:', error);
        this.loadingProductos = false;
        this.mostrarError('Error al cargar productos');
      }
    });
  }

  cargarClientes() {
    this.loadingClientes = true;
    this.ventaService.getClientes().subscribe({
      next: (response) => {
        this.clientes = response.data;
        this.loadingClientes = false;
      },
      error: (error) => {
        console.error('Error al cargar clientes:', error);
        this.loadingClientes = false;
        this.mostrarError('Error al cargar clientes');
      }
    });
  }

  // Ver detalle de venta
  verDetalle(venta: any) {
    this.ventaSeleccionada = venta;
    this.ventaService.getDetalleVenta(venta.id).subscribe({
      next: (response) => {
        this.detalleVenta = response.data;
        this.showDetalleModal = true;
      },
      error: (error) => {
        console.error('Error al cargar detalle:', error);
        this.mostrarError('Error al cargar detalle de venta');
      }
    });
  }

  // Nueva venta
  abrirNuevaVenta() {
    this.resetNuevaVenta();
    this.showNuevaVentaModal = true;
  }

  resetNuevaVenta() {
    this.nuevaVenta = {
      id_cliente: 0,
      total: 0,
      detalle: []
    };
    this.productoSeleccionado = {
      id_producto: 0,
      cantidad: 1
    };
  }

  // Agregar producto a la venta
  agregarProducto() {
    if (this.productoSeleccionado.id_producto === 0 || this.productoSeleccionado.cantidad <= 0) {
      this.mostrarError('Selecciona un producto y cantidad válida');
      return;
    }
    console.log(this.productoSeleccionado)
    const producto = this.productos.find(p => p.id == this.productoSeleccionado.id_producto);
    if (!producto) {
      this.mostrarError('Producto no encontrado');
      return;
    }

    if (this.productoSeleccionado.cantidad > producto.stock) {
      this.mostrarError(`Stock insuficiente. Disponible: ${producto.stock}`);
      return;
    }

    // Verificar si ya existe el producto en el detalle
    const existeIndex = this.nuevaVenta.detalle.findIndex(d => d.id_producto === this.productoSeleccionado.id_producto);
    
    if (existeIndex !== -1) {
      // Actualizar cantidad existente
      const nuevaCantidad = this.nuevaVenta.detalle[existeIndex].cantidad + this.productoSeleccionado.cantidad;
      if (nuevaCantidad > producto.stock) {
        this.mostrarError(`Stock insuficiente. Disponible: ${producto.stock}, ya tienes: ${this.nuevaVenta.detalle[existeIndex].cantidad}`);
        return;
      }
      this.nuevaVenta.detalle[existeIndex].cantidad = nuevaCantidad;
      this.nuevaVenta.detalle[existeIndex].subtotal = nuevaCantidad * parseFloat(producto.precio);
    } else {
      // Agregar nuevo producto
      this.nuevaVenta.detalle.push({
        id_producto: this.productoSeleccionado.id_producto,
        producto_nombre: producto.nombre,
        precio: parseFloat(producto.precio),
        cantidad: this.productoSeleccionado.cantidad,
        subtotal: this.productoSeleccionado.cantidad * parseFloat(producto.precio)
      });
    }

    this.calcularTotal();
    
    // Reset
    this.productoSeleccionado = {
      id_producto: 0,
      cantidad: 1
    };
  }

  // Remover producto del detalle
  removerProducto(index: number) {
    this.nuevaVenta.detalle.splice(index, 1);
    this.calcularTotal();
  }

  // Calcular total
  calcularTotal() {
    this.nuevaVenta.total = this.nuevaVenta.detalle.reduce((total, item) => total + item.subtotal, 0);
  }

  // Guardar venta
  guardarVenta() {
    if (this.nuevaVenta.id_cliente === 0) {
      this.mostrarError('Selecciona un cliente');
      return;
    }

    if (this.nuevaVenta.detalle.length === 0) {
      this.mostrarError('Agrega al menos un producto');
      return;
    }

    const ventaData = {
      id_cliente: this.nuevaVenta.id_cliente,
      total: this.nuevaVenta.total,
      detalle: this.nuevaVenta.detalle.map(d => ({
        id_producto: d.id_producto,
        cantidad: d.cantidad,
        subtotal: d.subtotal
      }))
    };

    this.ventaService.postVenta(ventaData).subscribe({
      next: (response) => {
        this.mostrarExito('Venta registrada exitosamente');
        this.showNuevaVentaModal = false;
        this.cargarVentas();
        this.cargarProductos(); // Actualizar stock
      },
      error: (error) => {
        console.error('Error al guardar venta:', error);
        this.mostrarError(error.error?.error || 'Error al guardar venta');
      }
    });
  }

  // Cerrar modales
  cerrarModales() {
    this.showDetalleModal = false;
    this.showNuevaVentaModal = false;
    this.ventaSeleccionada = null;
    this.detalleVenta = [];
    this.limpiarMensajes();
  }

  // Mensajes
  mostrarError(mensaje: string) {
    this.errorMessage = mensaje;
    this.successMessage = '';
    setTimeout(() => this.limpiarMensajes(), 5000);
  }

  mostrarExito(mensaje: string) {
    this.successMessage = mensaje;
    this.errorMessage = '';
    setTimeout(() => this.limpiarMensajes(), 3000);
  }

  limpiarMensajes() {
    this.errorMessage = '';
    this.successMessage = '';
  }

  // Formatear fecha
  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleString();
  }

  // Formatear precio
  formatearPrecio(precio: number): string {
    return `L. ${precio.toFixed(2)}`;
  }

  // Obtener nombre del cliente
  getNombreCliente(id: number): string {
    const cliente = this.clientes.find(c => c.id === id);
    return cliente ? cliente.nombre : 'Cliente no encontrado';
  }

  // Obtener nombre del producto
  getNombreProducto(id: number): string {
    const producto = this.productos.find(p => p.id === id);
    return producto ? producto.nombre : 'Producto no encontrado';
  }
}