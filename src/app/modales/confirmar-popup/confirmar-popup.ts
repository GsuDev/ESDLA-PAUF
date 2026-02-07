import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PopupData } from '../../interfaces/popup-data';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';


@Component({
  selector: 'app-confirmar-popup',
  standalone: true,
  imports: [ConfirmPopupModule, ToastModule, ButtonModule, TooltipModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './confirmar-popup.html',
  styleUrl: './confirmar-popup.css',
})
export class ConfirmarPopup {
  @Input() config!: PopupData;
  @Output() onConfirm = new EventEmitter<{ action: string; id: number }>();

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  confirm2(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: this.config.message,
      header: this.config.header,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: this.config.nameButton,
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: `p-button-${this.config.severity}`,
      accept: () => {
        // Emitir el evento para que el padre ejecute la acción
        this.onConfirm.emit({ action: this.config.action, id: this.config.id });
        
        // Mostrar toast de éxito inmediatamente
        this.showSuccessToast();
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Cancelado',
          detail: 'Operación cancelada',
          life: 3000
        });
      }
    });
  }

  private showSuccessToast() {
    let summary = '';
    let detail = '';
    
    switch (this.config.action) {
      case 'BAJA_LOGICA':
        summary = 'Baja lógica';
        detail = 'Personaje dado de baja correctamente';
        break;
      case 'BAJA_FISICA':
        summary = 'Eliminado';
        detail = 'Personaje eliminado permanentemente';
        break;
      case 'REACTIVAR':
        summary = 'Reactivado';
        detail = 'Personaje reactivado correctamente';
        break;
    }

    this.messageService.add({
      severity: 'success',
      summary,
      detail,
      life: 3000
    });
  }

  showErrorToast(error: any) {
    let detail = 'Ha ocurrido un error';
    
    // Si el error es 500, probablemente es porque tiene un anillo
    if (error.status === 500) {
      detail = 'Este personaje tiene un anillo asignado';
    }

    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail,
      life: 4000
    });
  }
}
