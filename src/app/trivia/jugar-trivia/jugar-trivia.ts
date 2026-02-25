import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { ProgressBarModule } from 'primeng/progressbar';
import { MessageService } from 'primeng/api';
import { PersonajeService } from '../../services/personaje-service';
import { Pregunta } from '../../interfaces/pregunta';
import { Partida } from '../../interfaces/partida';
import { EstadisticaPartida } from '../../interfaces/estadistica-partida';

const TOTAL_PREGUNTAS = 5;
const STORAGE_KEY = 'esdla_estadisticas';
// IDs de preguntas disponibles en el backend
const IDS_PREGUNTAS_DISPONIBLES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

type EstadoJuego = 'inicio' | 'jugando' | 'victoria' | 'derrota';

@Component({
  selector: 'app-jugar-trivia',
  standalone: true,
  imports: [CommonModule, ButtonModule, CardModule, ToastModule, ProgressBarModule],
  providers: [MessageService],
  templateUrl: './jugar-trivia.html',
  styleUrl: './jugar-trivia.css',
})
export class JugarTrivia implements OnInit {
  @Output() verEstadisticas = new EventEmitter<void>();

  estado: EstadoJuego = 'inicio';

  partida: Partida | null = null;
  preguntaActual: Pregunta | null = null;

  aciertos = 0;
  respuestaSeleccionada: number | null = null;
  respondiendo = false;
  idPreguntaActual: number | null = null;

  preguntasUsadas: Set<number> = new Set();

  readonly totalPreguntas = TOTAL_PREGUNTAS;

  // Para mostrar las respuestas como array en el template
  get respuestas(): { id: number; letra: string; texto: string }[] {
    if (!this.preguntaActual) return [];
    return [
      { id: 1, letra: 'A', texto: this.preguntaActual.respuesta1 },
      { id: 2, letra: 'B', texto: this.preguntaActual.respuesta2 },
      { id: 3, letra: 'C', texto: this.preguntaActual.respuesta3 },
      { id: 4, letra: 'D', texto: this.preguntaActual.respuesta4 },
    ];
  }

  get progreso(): number {
    return Math.round((this.aciertos / TOTAL_PREGUNTAS) * 100);
  }

  constructor(
    private personajeService: PersonajeService,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {}

  empezarPartida() {
    this.personajeService.empezarPartida().subscribe({
      next: (partida: Partida) => {
        this.partida = partida;
        this.aciertos = 0;
        this.preguntasUsadas = new Set();
        this.estado = 'jugando';
        this.cargarSiguientePregunta();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo iniciar la partida. Comprueba el servidor.',
          life: 4000,
        });
      },
    });
  }

  cargarSiguientePregunta() {
    this.respuestaSeleccionada = null;
    this.respondiendo = false;

    const disponibles = IDS_PREGUNTAS_DISPONIBLES.filter((id) => !this.preguntasUsadas.has(id));

    if (disponibles.length === 0) {
      // Sin más preguntas sin repetir — victoria por agotamiento
      this.guardarEstadistica(true);
      this.estado = 'victoria';
      return;
    }

    const idAleatorio = disponibles[Math.floor(Math.random() * disponibles.length)];
    this.preguntasUsadas.add(idAleatorio);
    this.idPreguntaActual = idAleatorio;

    this.personajeService.obtenerPregunta(idAleatorio).subscribe({
      next: (pregunta: Pregunta) => {
        this.preguntaActual = pregunta;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar la pregunta.',
          life: 4000,
        });
      },
    });
  }

  responder(idRespuesta: number) {
    if (this.respondiendo || !this.preguntaActual || !this.partida || !this.idPreguntaActual)
      return;

    this.respondiendo = true;
    this.respuestaSeleccionada = idRespuesta;

    const aciertosAntes = this.partida.numeroCorrectas;

    this.personajeService
      .comprobarRespuestaMejorada(this.idPreguntaActual, this.partida.id, idRespuesta)
      .subscribe({
        next: (partidaActualizada: Partida) => {
          this.partida = partidaActualizada;

          const acerto = partidaActualizada.numeroCorrectas > aciertosAntes;

          if (acerto) {
            this.aciertos = partidaActualizada.numeroCorrectas;
            this.messageService.add({
              severity: 'success',
              summary: '¡Correcto!',
              detail: `Llevas ${this.aciertos} de ${TOTAL_PREGUNTAS} aciertos`,
              life: 1500,
            });

            if (this.aciertos >= TOTAL_PREGUNTAS) {
              setTimeout(() => {
                this.personajeService.finalizarPartida(this.partida!.id).subscribe();
                this.guardarEstadistica(true);
                this.estado = 'victoria';
              }, 1600);
            } else {
              setTimeout(() => this.cargarSiguientePregunta(), 1600);
            }
          } else {
            this.aciertos = partidaActualizada.numeroCorrectas;
            this.messageService.add({
              severity: 'error',
              summary: '¡Incorrecto!',
              detail: 'Has fallado. ¡Fin de la partida!',
              life: 1800,
            });
            setTimeout(() => {
              this.guardarEstadistica(false);
              this.estado = 'derrota';
            }, 1900);
          }
        },
        error: () => {
          this.respondiendo = false;
          this.respuestaSeleccionada = null;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo comprobar la respuesta.',
            life: 4000,
          });
        },
      });
  }

  private guardarEstadistica(victoria: boolean) {
    const raw = localStorage.getItem(STORAGE_KEY);
    const estadisticas: EstadisticaPartida[] = raw ? JSON.parse(raw) : [];
    estadisticas.push({
      fecha: new Date().toLocaleString('es-ES'),
      aciertos: this.aciertos,
      victoria,
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(estadisticas));
  }

  volverAJugar() {
    this.estado = 'inicio';
    this.preguntaActual = null;
    this.partida = null;
    this.aciertos = 0;
  }

  irAEstadisticas() {
    this.verEstadisticas.emit();
  }
}
