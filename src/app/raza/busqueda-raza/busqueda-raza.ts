import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { RazasEjemplo } from '../../clases/razas';
import { Raza } from '../../interfaces/raza';

@Component({
  selector: 'app-busqueda-raza',
  imports: [InputTextModule, FormsModule, ButtonModule, TableModule],
  templateUrl: './busqueda-raza.html',
  styleUrl: './busqueda-raza.css',
})
export class BusquedaRaza {


  
    razas = RazasEjemplo
  
  
    razasFiltradas: Raza[] = this.razas
    campoBusqueda: string = '';
    buscar() {
  
       const t = this.campoBusqueda.toLowerCase();
  
      this.razasFiltradas = this.razas.filter(
        (a) =>
          a.nombre.toLowerCase().includes(t) ||
          a.regionPrincipal.toLowerCase().includes(t) ||
          a.longevidad.toLowerCase().includes(t) ||
          a.descripcion.toLowerCase().includes(t)
      );
  
    }
}
