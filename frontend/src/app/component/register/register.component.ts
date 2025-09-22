import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  nombre: string = '';
  correo: string = '';
  contrasenia: string = '';
  confirmarContrasenia: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  register() {
    // Validaciones
    if (!this.nombre || !this.correo || !this.contrasenia || !this.confirmarContrasenia) {
      this.errorMessage = 'Por favor completa todos los campos';
      return;
    }

    if (this.contrasenia.length < 6) {
      this.errorMessage = 'La contraseña debe tener al menos 6 caracteres';
      return;
    }

    if (this.contrasenia !== this.confirmarContrasenia) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }

    const userData = {
      nombre: this.nombre.trim(),
      correo: this.correo.trim().toLowerCase(),
      contrasenia: this.contrasenia
    };

    this.errorMessage = '';
    this.successMessage = '';
    this.isLoading = true;

    this.authService.register(userData).subscribe({
      next: (response) => {
        console.log('Registro exitoso:', response);
        this.successMessage = 'Cuenta creada exitosamente. Redirigiendo...';
        
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (error) => {
        console.error('Error de registro:', error);
        this.isLoading = false;
        
        if (error.status === 400) {
          this.errorMessage = error.error?.message || 'Datos inválidos';
        } else if (error.status === 409) {
          this.errorMessage = 'El correo ya está registrado';
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