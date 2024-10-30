import { Toast, ToastService, ToastType } from '@/app/shared/services/toast/toast.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

const TOAST_VISIBILITY_DURATION = 4000;

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent implements OnInit, OnDestroy {
  message: string = '';
  isVisible: boolean = false;
  type: ToastType = ToastType.Success;
  private toastSubscription: Subscription = new Subscription(); // Inicializar con una nueva suscripción vacía
  private toastTimeout: any;

  constructor(private readonly toastService: ToastService) { }

  ngOnInit(): void {
    this.toastSubscription = this.toastService.toastState.subscribe((toast: Toast) => {
      this.message = toast.message;
      this.type = toast.type;
      this.isVisible = true;

      if (this.toastTimeout) {
        clearTimeout(this.toastTimeout);
      }

      this.toastTimeout = setTimeout(() => {
        this.isVisible = false;
      }, TOAST_VISIBILITY_DURATION);
    });
  }

  ngOnDestroy(): void {
    if (this.toastSubscription) {
      this.toastSubscription.unsubscribe();
    }
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }
  }

  closeToast(): void {
    this.isVisible = false;
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }
  }
}