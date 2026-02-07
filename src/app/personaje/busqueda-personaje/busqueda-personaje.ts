import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { PersonajeService } from '../../services/personaje-service';
import { Router } from '@angular/router';
import { Personaje } from '../../interfaces/personaje';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ConfirmarPopup } from '../../modales/confirmar-popup/confirmar-popup';
import { PopupData } from '../../interfaces/popup-data';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-busqueda-personaje',
  standalone: true,
  imports: [
    ButtonModule,
    TableModule,
    InputTextModule,
    FormsModule,
    ConfirmarPopup,
    CommonModule,
    TooltipModule,
  ],
  templateUrl: './busqueda-personaje.html',
  styleUrl: './busqueda-personaje.css',
})
export class BusquedaPersonaje implements OnInit {
  personajes: Personaje[] = [];
  personajesFiltrados: Personaje[] = [];
  campoBusqueda: string = '';
  error = '';

  // Configuraciones de popup por personaje
  popupConfigs: Map<number, { bajaLogica: PopupData; bajaFisica: PopupData; reactivar: PopupData }> = new Map();

  @Output() editEvent = new EventEmitter<number>();

  constructor(
    private personajeService: PersonajeService,
    private cdr: ChangeDetectorRef,
    private route: Router,
  ) {}

  editar(id: number) {
    this.editEvent.emit(id);
  }

  // Crear las configuraciones de popup para cada personaje
  crearPopupConfig(personaje: Personaje) {
    this.popupConfigs.set(personaje.id, {
      bajaLogica: {
        message: '¿Seguro que quieres dar de baja lógica este personaje?',
        header: 'Baja lógica',
        nameButton: 'Dar de baja',
        severity: "info",
        action: 'BAJA_LOGICA',
        id: personaje.id,
        buttonIcon: 'pi pi-ban',
        buttonLabel: 'Dar de baja',
        buttonSeverity: "info",
        showButton: !personaje.fechaBaja
      },
      bajaFisica: {
        message: '⚠️ Esta acción es irreversible. ¿Borrar definitivamente?',
        header: 'Baja física',
        nameButton: 'Borrar',
        severity: "danger",
        action: 'BAJA_FISICA',
        id: personaje.id,
        buttonIcon: 'pi pi-trash',
        buttonLabel: 'Eliminar',
        buttonSeverity: "danger",
        showButton: true
      },
      reactivar: {
        message: '¿Quieres reactivar este personaje?',
        header: 'Reactivar',
        nameButton: 'Reactivar',
        severity: "success",
        action: 'REACTIVAR',
        id: personaje.id,
        buttonIcon: 'pi pi-refresh',
        buttonLabel: 'Reactivar',
        buttonSeverity: "success",
        showButton: !!personaje.fechaBaja
      }
    });
  }

  getPopupConfig(id: number, tipo: 'bajaLogica' | 'bajaFisica' | 'reactivar'): PopupData {
    return this.popupConfigs.get(id)?.[tipo] || {} as PopupData;
  }

  onPopupConfirm(data: { action: string; id: number }, popup: ConfirmarPopup) {
    switch (data.action) {
      case 'BAJA_LOGICA':
        this.bajaLogica(data.id, popup);
        break;
      case 'BAJA_FISICA':
        this.bajaFisica(data.id, popup);
        break;
      case 'REACTIVAR':
        this.reactivar(data.id, popup);
        break;
    }
  }

  bajaLogica(id: number, popup: ConfirmarPopup) {
    this.personajeService.bajaLogica(id).subscribe({
      next: () => {
        console.log('Baja lógica exitosa');
        this.cargarPersonajes();
      },
      error: (err) => {
        console.error('Error en baja lógica:', err);
        popup.showErrorToast(err);
      },
    });
  }

  bajaFisica(id: number, popup: ConfirmarPopup) {
    this.personajeService.bajaFisica(id).subscribe({
      next: () => {
        console.log('Baja física exitosa');
        this.cargarPersonajes();
      },
      error: (err) => {
        console.error('Error en baja física:', err);
        popup.showErrorToast(err);
      },
    });
  }

  reactivar(id: number, popup: ConfirmarPopup) {
    this.personajeService.reactivar(id).subscribe({
      next: () => {
        console.log('Reactivación exitosa');
        this.cargarPersonajes();
      },
      error: (err) => {
        console.error('Error en reactivación:', err);
        popup.showErrorToast(err);
      },
    });
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
        
        // Crear configuraciones de popup para cada personaje
        this.personajes.forEach(p => this.crearPopupConfig(p));
        
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
