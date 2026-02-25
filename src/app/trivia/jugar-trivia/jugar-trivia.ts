import { Component, ChangeDetectorRef, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { ProgressBarModule } from 'primeng/progressbar';
import { MessageService } from 'primeng/api';
import { PersonajeService } from '../../services/personaje-service';
import { Pregunta } from '../../interfaces/pregunta';
import { EstadisticaPartida } from '../../interfaces/estadistica-partida';

const TOTAL_PREGUNTAS = 5;
const STORAGE_KEY = 'esdla_estadisticas';
const IDS_PREGUNTAS_DISPONIBLES = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27,
  28, 29, 30,
];

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

  partida: any = null;
  preguntaActual: Pregunta | null = null;
  idPreguntaActual: number | null = null;

  aciertos = 0;
  respuestaSeleccionada: number | null = null;
  respondiendo = false;
  iniciando = false;
  preguntasUsadas: Set<number> = new Set();

  readonly totalPreguntas = TOTAL_PREGUNTAS;

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
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {}

  empezarPartida() {
    if (this.iniciando) return;
    this.iniciando = true;

    this.personajeService.empezarPartida().subscribe({
      next: (partida: any) => {
        console.log('Partida iniciada:', partida);
        this.partida = partida;
        this.aciertos = 0;
        this.preguntasUsadas = new Set();
        this.estado = 'jugando';
        this.iniciando = false;
        this.cdr.detectChanges();
        this.cargarSiguientePregunta();
      },
      error: () => {
        this.iniciando = false;
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
    this.preguntaActual = null;
    this.idPreguntaActual = null;

    const disponibles = IDS_PREGUNTAS_DISPONIBLES.filter((id) => !this.preguntasUsadas.has(id));

    if (disponibles.length === 0) {
      this.guardarEstadistica(true);
      this.estado = 'victoria';
      return;
    }

    const idElegido = disponibles[Math.floor(Math.random() * disponibles.length)];
    this.preguntasUsadas.add(idElegido);
    this.idPreguntaActual = idElegido;

    console.log('Cargando pregunta con id:', idElegido);

    this.personajeService.obtenerPregunta(idElegido).subscribe({
      next: (pregunta: any) => {
        console.log('Pregunta recibida:', pregunta);
        this.preguntaActual = pregunta;
        this.cdr.detectChanges();
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

    // Guardamos los valores en variables locales ANTES de cualquier modificación
    const aciertosAntes = this.aciertos;
    const idPartida = this.partida.id;
    const idPregunta = this.idPreguntaActual;

    console.log(
      `Respondiendo → pregunta: ${idPregunta}, partida: ${idPartida}, respuesta: ${idRespuesta}, aciertos antes: ${aciertosAntes}`,
    );

    this.personajeService.comprobarRespuestaMejorada(idPregunta, idPartida, idRespuesta).subscribe({
      next: (partidaActualizada: any) => {
        console.log('Servidor devuelve:', partidaActualizada);

        const acierto = partidaActualizada.numeroCorrectas > aciertosAntes;
        console.log(
          `numeroCorrectas: ${partidaActualizada.numeroCorrectas}, aciertosAntes: ${aciertosAntes}, acertó: ${acierto}`,
        );

        this.partida = partidaActualizada;

        if (acierto) {
          this.aciertos = partidaActualizada.numeroCorrectas;
          this.messageService.add({
            severity: 'success',
            summary: '¡Correcto!',
            detail: `Llevas ${this.aciertos} de ${TOTAL_PREGUNTAS} aciertos`,
            life: 1500,
          });

          if (this.aciertos >= TOTAL_PREGUNTAS) {
            setTimeout(() => {
              this.personajeService.finalizarPartida(partidaActualizada.id).subscribe();
              this.guardarEstadistica(true);
              this.estado = 'victoria';
            }, 1600);
          } else {
            setTimeout(() => this.cargarSiguientePregunta(), 1600);
          }
        } else {
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
    this.idPreguntaActual = null;
    this.preguntasUsadas = new Set();
  }

  irAEstadisticas() {
    this.verEstadisticas.emit();
  }
}
