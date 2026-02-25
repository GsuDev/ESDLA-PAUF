import { Component, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DetalleAnillo } from './anillo/detalle-anillo/detalle-anillo';
import { DetalleRaza } from './raza/detalle-raza/detalle-raza';
import { DetallePersonaje } from './personaje/detalle-personaje/detalle-personaje';
import { JugarTrivia } from './trivia/jugar-trivia/jugar-trivia';
import { EstadisticasTrivia } from './trivia/estadisticas-trivia/estadisticas-trivia';

@Component({
  selector: 'app-root',
  imports: [ButtonModule, DetalleAnillo, DetalleRaza, DetallePersonaje, JugarTrivia, EstadisticasTrivia],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('anillosDePoder');

  vistaActual: 'razas' | 'anillos' | 'personajes' | 'portadores' | 'trivia' | 'estadisticas' | null = null;

  mostrarRazas() {
    this.vistaActual = 'razas';
  }

  mostrarAnillos() {
    this.vistaActual = 'anillos';
  }

  mostrarPersonajes() {
    this.vistaActual = 'personajes';
  }

  mostrarPortadores() {
    this.vistaActual = 'portadores';
  }

  mostrarTrivia() {
    this.vistaActual = 'trivia';
  }

  mostrarEstadisticas() {
    this.vistaActual = 'estadisticas';
  }
}
