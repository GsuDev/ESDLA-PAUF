import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Busqueda } from '../busqueda/busqueda';
import { FormularioAnillo } from '../formulario-anillo/formulario-anillo';

@Component({
  selector: 'app-detalle-anillo',
  imports: [Busqueda, FormularioAnillo],
  templateUrl: './detalle-anillo.html',
  styleUrl: './detalle-anillo.css',
})
export class DetalleAnillo {
  vista: 'busqueda' | 'formulario' | null = null;

  mostrarBusqueda() {
    this.vista = 'busqueda';
  }

  mostrarFormulario() {
    this.vista = 'formulario';
  }
}
