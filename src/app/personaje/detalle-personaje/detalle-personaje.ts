import { Component } from '@angular/core';
import { FormularioPersonaje } from '../formulario-personaje/formulario-personaje';
import { BusquedaPersonaje } from '../busqueda-personaje/busqueda-personaje';

@Component({
  selector: 'app-detalle-personaje',
  imports: [FormularioPersonaje, BusquedaPersonaje],
  templateUrl: './detalle-personaje.html',
  styleUrl: './detalle-personaje.css',
})
export class DetallePersonaje {
  vista: 'busqueda' | 'crear' | 'editar' | null = null;

  idEdicion: number | null = null

  mostrarBusqueda() {
    this.vista = 'busqueda';
  }

  mostrarFormulario() {
    this.vista = 'crear';
  }

  editarPersonaje(id:number){
    this.vista = 'editar'
    this.idEdicion = id
  }
}
