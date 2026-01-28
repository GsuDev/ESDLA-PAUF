import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BusquedaRaza } from '../busqueda-raza/busqueda-raza';
import { FormularioRaza } from '../formulario-raza/formulario-raza';

@Component({
  selector: 'app-detalle-raza',
  imports: [BusquedaRaza, FormularioRaza],
  templateUrl: './detalle-raza.html',
  styleUrl: './detalle-raza.css',
})
export class DetalleRaza {
  vista: 'busqueda' | 'formulario' | null = null;

  mostrarBusqueda() {
    this.vista = 'busqueda';
  }

  mostrarFormulario() {
    this.vista = 'formulario';
  }
}
