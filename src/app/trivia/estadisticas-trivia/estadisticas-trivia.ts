import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { EstadisticaPartida } from '../../interfaces/estadistica-partida';

const STORAGE_KEY = 'esdla_estadisticas';

@Component({
  selector: 'app-estadisticas-trivia',
  standalone: true,
  imports: [CommonModule, ButtonModule, TableModule, CardModule, ConfirmDialogModule, ToastModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './estadisticas-trivia.html',
  styleUrl: './estadisticas-trivia.css',
})
export class EstadisticasTrivia implements OnInit {
  @Output() volverAlJuego = new EventEmitter<void>();

  historial: EstadisticaPartida[] = [];

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.cargarEstadisticas();
  }

  cargarEstadisticas() {
    const raw = localStorage.getItem(STORAGE_KEY);
    this.historial = raw ? JSON.parse(raw) : [];
  }

  get totalPartidas(): number {
    return this.historial.length;
  }

  get victorias(): number {
    return this.historial.filter(p => p.victoria).length;
  }

  get derrotas(): number {
    return this.historial.filter(p => !p.victoria).length;
  }

  get mediaAciertos(): string {
    if (this.historial.length === 0) return '0';
    const suma = this.historial.reduce((acc, p) => acc + p.aciertos, 0);
    return (suma / this.historial.length).toFixed(1);
  }

  confirmarBorrar(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: '¿Seguro que quieres borrar todo el historial de partidas?',
      header: 'Borrar historial',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Borrar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        localStorage.removeItem(STORAGE_KEY);
        this.historial = [];
        this.messageService.add({
          severity: 'success',
          summary: 'Historial borrado',
          detail: 'Se han eliminado todas las estadísticas.',
          life: 3000,
        });
      },
    });
  }

  volver() {
    this.volverAlJuego.emit();
  }
}
