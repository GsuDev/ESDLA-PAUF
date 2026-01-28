import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
@Component({
  selector: 'app-formulario-raza',
  imports: [
    ReactiveFormsModule,
    SelectModule,
    InputTextModule,
    TextareaModule,
    SelectButtonModule,
    ButtonModule,
  ],
  templateUrl: './formulario-raza.html',
  styleUrl: './formulario-raza.css',
})
export class FormularioRaza {
  regiones = ['Mordor', 'Rivendel', 'La Comarca'];
  afinidades = ['Tiene', 'No tiene'];

  formulario: FormGroup = new FormGroup({
    nombre: new FormControl('', [Validators.required, Validators.minLength(3)]),
    descripcion: new FormControl('', [Validators.required, Validators.minLength(10)]),
    longevidad: new FormControl('', [Validators.required, Validators.minLength(3)]),
    nivelCorrupcion: new FormControl(0, [Validators.required]),
    regionPrincipal: new FormControl('', [Validators.required, Validators.minLength(3)]),
    afinidadMagica: new FormControl('', [Validators.required]),
  });

  enviar() {
    alert;
  }
  limpiar() {
    this.formulario.get('nombre')?.setValue('');
    this.formulario.get('descripcion')?.setValue('');
    this.formulario.get('longevidad')?.setValue('');
    this.formulario.get('nivelCorrupcion')?.setValue(0);
    this.formulario.get('regionPrincipal')?.setValue('');
    this.formulario.get('afinidadMagica')?.setValue('');

    this.formulario.markAsPristine();
    this.formulario.markAsUntouched();
  }
}
