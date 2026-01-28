import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-formulario-anillo',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    SelectModule,
    InputTextModule,
    TextareaModule,
    SelectButtonModule,
    ButtonModule,
  ],
  templateUrl: './formulario-anillo.html',
  styleUrl: './formulario-anillo.css',
})
export class FormularioAnillo {
  razas = ['ELFO', 'ENANO', 'HUMANO', 'MAIAR', 'OSCURO'];

  formulario: FormGroup = new FormGroup({
    nombre: new FormControl('', [Validators.required, Validators.minLength(3)]),
    portador: new FormControl('', [Validators.required, Validators.minLength(3)]),
    raza: new FormControl('', [Validators.required]),
    poder: new FormControl('', [Validators.required, Validators.minLength(10)]),
    corrupcion: new FormControl(0, [Validators.required, Validators.min(0), Validators.max(100)]),
  });

  enviar() {
    if (this.formulario.valid) {
      console.log(this.formulario.value);
    }
  }
  limpiar() {
    this.formulario.get('nombre')?.setValue('');
    this.formulario.get('portador')?.setValue('');
    this.formulario.get('raza')?.setValue('');
    this.formulario.get('poder')?.setValue('');
    this.formulario.get('corrupcion')?.setValue(0);

    this.formulario.markAsPristine();
    this.formulario.markAsUntouched();
  }
}
