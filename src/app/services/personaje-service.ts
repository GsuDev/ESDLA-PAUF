import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Personaje } from '../interfaces/personaje';

@Injectable({
  providedIn: 'root',
})
export class PersonajeService {
  constructor(private http: HttpClient) {}

  private baseUrl = environment.apiESDLA;

  obtenerPersonajes() {
    return this.http.get(`${this.baseUrl}listaPersonajes`);
  }
  obtenerPersonaje(id: number) {
    return this.http.get(`${this.baseUrl}obtenerPersonaje/${id}`);
  }

  crearPersonaje(personaje: Personaje) {
    return this.http.post(`${this.baseUrl}insertarPersonaje`, personaje);
  }

  actualizarPersonaje(id: number, personaje: Personaje) {
    return this.http.put(`${this.baseUrl}actualizarPersonaje/${id}`, personaje);
  }

  bajaLogica(id: number): Observable<any> {
    return this.http.put(`${this.baseUrl}bajaLogica/${id}`, {});
  }

  bajaFisica(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}bajaFisica/${id}`);
  }

  reactivar(id: number): Observable<any> {
    return this.http.put(`${this.baseUrl}reactivar/${id}`, {});
  }
}
