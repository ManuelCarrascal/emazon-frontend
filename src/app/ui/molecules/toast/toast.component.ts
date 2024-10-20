import { Toast, ToastService, ToastType } from '@/app/shared/services/toast/toast.service';
import { Component, OnInit } from '@angular/core';


const TOAST_VISIBILITY_DURATION = 4000;
@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent implements OnInit {
  message: string = '';
  isVisible: boolean = false;
  type: ToastType = ToastType.Success; 

  constructor(private readonly toastService: ToastService) { }

  ngOnInit(): void {
    this.toastService.toastState.subscribe((toast: Toast) => {
      this.message = toast.message;
      this.type = toast.type;
      this.isVisible = true;

      setTimeout(() => {
        this.isVisible = false;
      }, TOAST_VISIBILITY_DURATION);
    });
  }

  
}