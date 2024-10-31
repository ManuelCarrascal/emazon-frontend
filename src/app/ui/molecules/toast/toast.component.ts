import { Component, OnInit } from '@angular/core';
import { ToastService, ToastType } from '@/app/shared/services/toast/toast.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent implements OnInit {
  message: string = '';
  type: ToastType = ToastType.Success;
  isVisible: boolean = false;
  private toastSubscription: Subscription = new Subscription();

  constructor(private readonly toastService: ToastService) {}

  ngOnInit(): void {
    this.toastSubscription = this.toastService.toastState.subscribe((toast) => {
      this.message = toast.message;
      this.type = toast.type;
      this.isVisible = true;
      setTimeout(() => {
        this.isVisible = false;
      }, 4000);
    });
  }

  closeToast(): void {
    this.isVisible = false;
  }

  ngOnDestroy(): void {
    this.toastSubscription.unsubscribe();
  }
}