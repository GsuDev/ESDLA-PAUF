import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { PersonajeService } from '../../services/personaje-service';
import { Router, RouterLink } from '@angular/router';
import { Personaje } from '../../interfaces/personaje';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-busqueda-personaje',
  imports: [ButtonModule, TableModule, InputTextModule, FormsModule],
  templateUrl: './busqueda-personaje.html',
  styleUrl: './busqueda-personaje.css',
})
export class BusquedaPersonaje implements OnInit {
  personajes: Personaje[] = [];
  personajesFiltrados: Personaje[] = [];
  campoBusqueda: string = '';
  error = '';

  @Output() editEvent = new EventEmitter<number>();

  constructor(
    private personajeService: PersonajeService,
    private cdr: ChangeDetectorRef,
    private route: Router,
  ) {}

  editar(id: number) {
    this.editEvent.emit(id);
  }

  ngOnInit(): void {
    this.cargarPersonajes();
  }

  cargarPersonajes() {
    this.personajeService.obtenerPersonajes().subscribe({
      next: (data) => {
        console.log(data);
        this.personajes = data as Personaje[];
        this.personajesFiltrados = this.personajes;
        this.cdr.detectChanges();
        console.log(this.personajes);
      },
      error: (err) => {
        this.error = 'Se ha producido un error';
      },
    });
  }

  buscar() {
    const termino = this.campoBusqueda.toLowerCase();

    this.personajesFiltrados = this.personajes.filter(
      (p) => p.nombre.toLowerCase().includes(termino) || p.raza.toLowerCase().includes(termino),
    );
  }
}
