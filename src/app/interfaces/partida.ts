export interface Partida {
  id: number;
  fechaInicio: string;
  fechaFin: string | null;
  numeroCorrectas: number;
  finPartida: boolean;
}
