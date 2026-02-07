import { ButtonSeverity } from 'primeng/button';

export interface PopupData {
  message: string;
  header?: string;
  nameButton: string;
  severity: ButtonSeverity;
  action: 'BAJA_LOGICA' | 'BAJA_FISICA' | 'REACTIVAR' | 'EDITAR';
  id: number;
  buttonIcon: string;
  buttonLabel?: string;
  buttonSeverity: ButtonSeverity;
  showButton: boolean; // Para controlar si se muestra el botón o no
}
