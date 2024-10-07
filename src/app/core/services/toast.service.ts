import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Toast {
  message: string;
  type: 'success' | 'error' | 'warning';
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastSubject = new Subject<Toast>();
  toastState = this.toastSubject.asObservable();

  showToast(message: string, type: 'success' | 'error' | 'warning' = 'success') {
    this.toastSubject.next({ message, type });
  }
}
