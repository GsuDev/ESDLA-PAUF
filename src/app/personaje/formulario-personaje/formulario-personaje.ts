import { Component, inject, Input, OnInit, OnChanges, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';

import { Personaje } from '../../interfaces/personaje';
import { PersonajeService } from '../../services/personaje-service';

@Component({
  selector: 'app-formulario-personaje',
  standalone: true,
  imports: [ReactiveFormsModule, InputTextModule, SelectModule, ButtonModule, DatePickerModule],
  templateUrl: './formulario-personaje.html',
  styleUrl: './formulario-personaje.css',
})
export class FormularioPersonaje implements OnInit, OnChanges {
  razas = ['ELFO', 'ENANO', 'HUMANO', 'MAIAR', 'OSCURO'];

  private personajeService = inject(PersonajeService);

  @Input() id: number | null = null;
  @Output() editSuccessEvent = new EventEmitter<null>();
  
  formulario = new FormGroup({
    nombre: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)],
    }),
    raza: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    // Aqui como no lo pongas como Date y lo inicialices con null no va la edicion porque no puede insertarle la fecha 
    fechaNacimiento: new FormControl<Date | null>(null, {
      validators: [Validators.required],
    }),
    nivelCorrupcion: new FormControl<number>(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0), Validators.max(100)],
    }),
  });

  ngOnInit() {
    // Cargar datos si hay un ID al inicializar
    if (this.id) {
      this.cargarPersonaje(this.id);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    // Detectar cambios en el Input id
    if (changes['id'] && changes['id'].currentValue) {
      this.cargarPersonaje(changes['id'].currentValue);
    }
  }

  cargarPersonaje(id: number) {
    this.personajeService.obtenerPersonaje(id).subscribe({
      next: (data) => {
        const personaje = data as Personaje;
        this.setDatosEdicion(personaje);
      },
      error: (err) => {
        console.error('Error al cargar personaje:', err);
      },
    });
  }

  setDatosEdicion(personaje: Personaje) {
    this.formulario.patchValue({
      nombre: personaje.nombre,
      raza: personaje.raza,
      fechaNacimiento: this.localDateToDate(personaje.fechaNacimiento),
      nivelCorrupcion: personaje.nivelCorrupcion,
    });
  }

  enviar() {
    if (this.formulario.invalid) return;
    const formValue = this.formulario.value;

    const payload = {
      id: this.id,
      ...formValue,
      fechaNacimiento: (formValue.fechaNacimiento as Date).toISOString().split('T')[0],
    } as Personaje;

    if (this.id) {
      console.log('EDITANDO PERSONAJE', payload);

      this.personajeService.actualizarPersonaje(this.id, payload).subscribe({
        next: (response) => {
          console.log('Personaje editado exitosamente:', response);
          this.limpiar();
          this.editSuccessEvent.emit(null);
        },
        error: (err) => {
          console.error('Error al editar personaje:', err);
        },
      });
    } else {
      console.log('CREANDO PERSONAJE', payload);
      this.personajeService.crearPersonaje(payload as Personaje).subscribe({
        next: (response) => {
          console.log('Personaje creado exitosamente:', response);
          this.limpiar();
          
        },
        error: (err) => {
          console.error('Error al crear personaje:', err);
        },
      });
    }
  }

  limpiar() {
    this.formulario.reset({
      nombre: '',
      raza: '',
      fechaNacimiento: null,
      nivelCorrupcion: 0,
    });
  }

  // Para pasar de String k te llega de springboot a Date de TS
  private localDateToDate(localDate: string): Date {
    const [year, month, day] = localDate.split('-').map(Number);
    return new Date(year, month - 1, day);
  }
}
