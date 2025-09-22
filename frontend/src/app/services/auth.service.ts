import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:4000/api/auth'; // Cambia esto según tu backend

  constructor(private http: HttpClient) {}

  login(userData: { correo: string; contrasenia: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, userData);
  }
  register(userData: { nombre:string, correo: string; contrasenia: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }
}
