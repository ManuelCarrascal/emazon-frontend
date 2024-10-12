import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export enum ToastType {
  Success = 'success',
  Error = 'error',
  Warning = 'warning',
}

export interface Toast {
  message: string;
  type: ToastType;
}

@Injectable({
  providedIn: 'root',
})

export class ToastService {
  private readonly toastSubject = new Subject<Toast>();
  toastState = this.toastSubject.asObservable();

  showToast(message: string, type: ToastType = ToastType.Success) {
    this.toastSubject.next({ message, type });
  }
}