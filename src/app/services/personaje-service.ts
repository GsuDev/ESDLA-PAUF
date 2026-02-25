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

  // ─── Trivia ───────────────────────────────────────────────────────────────

  empezarPartida(): Observable<any> {
    return this.http.get(`${this.baseUrl}empezarPartida/`);
  }

  obtenerPregunta(idPregunta: number): Observable<any> {
    return this.http.get(`${this.baseUrl}obtenerPregunta/${idPregunta}`);
  }

  /**
   * Endpoint mejorado: comprueba respuesta Y actualiza la partida en un solo paso.
   * Devuelve PartidaDTO con numeroCorrectas y finPartida.
   * - finPartida=true + fechaFin=null → respuesta correcta, sigue jugando
   * - finPartida=true + fechaFin≠null → fallo, partida terminada
   * - numeroCorrectas=5 → victoria
   */
  comprobarRespuestaMejorada(idPregunta: number, idPartida: number, respuestaUsuario: number): Observable<any> {
    return this.http.get(`${this.baseUrl}respuestaMejorada/${idPregunta}/${idPartida}`, {
      params: { respuestaUsuario: respuestaUsuario },
    });
  }

  finalizarPartida(idPartida: number): Observable<any> {
    return this.http.put(`${this.baseUrl}finalizar/${idPartida}/`, {});
  }
}
