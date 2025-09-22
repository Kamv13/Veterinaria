import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VentaService {

   private apiUrl = 'http://localhost:4000/api';

  constructor(private http: HttpClient) {}

  getProductos(): Observable<any> {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}` // Agrega el token en el header
    });

    return this.http.get(this.apiUrl+'/productos', { headers });
  }

  getClientes(): Observable<any> {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}` // Agrega el token en el header
    });

    return this.http.get(this.apiUrl+'/clientes', { headers });
  }

  getVentas(): Observable<any> {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}` // Agrega el token en el header
    });

    return this.http.get(this.apiUrl+'/ventas', { headers });
  }
  getDetalleVenta(id_venta:number): Observable<any> {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}` // Agrega el token en el header
    });

    return this.http.get(`${this.apiUrl}/detalle-by-venta/${id_venta}`, { headers });
  }

  postVenta(userData: { id_cliente:number, total: number, detalle : Array<any>}): Observable<any> {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}` // Agrega el token en el header
    });
    return this.http.post(`${this.apiUrl}/venta`, userData,{ headers });
  }

}
