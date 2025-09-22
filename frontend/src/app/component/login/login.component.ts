// login.component.ts
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  correo: string = '';
  contrasenia: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login() {
    if (!this.correo || !this.contrasenia) {
      this.errorMessage = 'Por favor completa todos los campos';
      return;
    }

    const credentials = {
      correo: this.correo,
      contrasenia: this.contrasenia
    };

    this.errorMessage = '';
    this.isLoading = true;

    this.authService.login(credentials).subscribe({
      next: (response) => {
        console.log('Login exitoso:', response);
        localStorage.setItem('token', response.token);
        this.router.navigate(['/ventas']);
      },
      error: (error) => {
        console.error('Error de login:', error);
        this.isLoading = false;
        
        if (error.status === 400 || error.status === 401) {
          this.errorMessage = error.error?.message || 'Credenciales incorrectas';
        } else if (error.status === 500) {
          this.errorMessage = 'Error del servidor. Intenta más tarde';
        } else {
          this.errorMessage = 'Error de conexión. Verifica tu internet';
        }
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}
