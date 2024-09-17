import { TestBed } from '@angular/core/testing';
import { SweetAlertService } from './sweet-alert.service';
import Swal from 'sweetalert2';

describe('SweetAlertService - showSuccess', () => {
    let service: SweetAlertService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [SweetAlertService]
        });
        service = TestBed.inject(SweetAlertService);
    });

    it('should show a success toast popup with custom text', () => {
        const text = 'Custom success message';
        const timer = 3000;
        const background = '#0bb783';
        const spy = spyOn(Swal, 'mixin').and.callThrough();

        service.showSuccess(text);

        expect(spy).toHaveBeenCalledWith({
            toast: true,
            position: 'bottom-end',
            showConfirmButton: false,
            timer: timer,
            timerProgressBar: false,
            iconColor: '#FFF',
            color: '#FFF',
            background: background,
            customClass: {
                title: 'sweetalert-toast-title'
            }
        });
    });
});
