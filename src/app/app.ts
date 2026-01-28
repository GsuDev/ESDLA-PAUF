import { Component, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DetalleAnillo } from './anillo/detalle-anillo/detalle-anillo';
import { DetalleRaza } from './raza/detalle-raza/detalle-raza';
import { DetallePersonaje } from './personaje/detalle-personaje/detalle-personaje';

@Component({
  selector: 'app-root',
  imports: [ButtonModule, DetalleAnillo, DetalleRaza, DetallePersonaje],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('anillosDePoder');
  
  vistaActual: 'razas' | 'anillos' | 'personajes' | null = null;

  mostrarRazas() {
    this.vistaActual = 'razas';
  }

  mostrarAnillos() {
    this.vistaActual = 'anillos';
  }

  mostrarPersonajes() {
    this.vistaActual = 'personajes';
  }
}
