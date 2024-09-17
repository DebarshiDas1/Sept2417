import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Injectable({
    providedIn: 'root'
})
export class SweetAlertService {
    public async showDeleteConfirmationDialog(): Promise<boolean> {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'You won\'t be able to revert this!',
            icon: 'warning',
            background: 'var(--main-bg)',
            color: 'var(--color-4)',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
            customClass: {
                confirmButton: 'sweet-alert-confirm-button',
                cancelButton: 'sweet-alert-cancel-button'
            }
        });
        return result.isConfirmed;
    }

    public showError(text: string): void {
        this.showTosterPopup(text, 'error', 5000, '#ff4743');
    }

    public showInfo(text: string): void {
        this.showTosterPopup(text, 'info', 5000, '#808080');
    }

    public showSuccess(text: string): void {
        this.showTosterPopup(text, 'success', 3000, '#0bb783');
    }

    public showWarning(text: string): void {
        this.showTosterPopup(text, 'warning', 5000, '#DF7615');
    }

    private showTosterPopup(text: string, icon: SweetAlertIcon, timer: number, background: string): void {
        const Toast = Swal.mixin({
            toast: true,
            position: 'bottom-end',
            showConfirmButton: false,
            timer: timer,
            timerProgressBar: false,
            iconColor: '#FFF',
            color: '#FFF',
            background: background,
            customClass: {
                title: 'sweetalert-toast-title',
            }
        });
        Toast.fire({
            icon: icon,
            title: text
        });
    }
}