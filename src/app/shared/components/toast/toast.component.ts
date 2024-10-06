import { Component, OnInit } from '@angular/core';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent implements OnInit {

  message: string = '';
  isVisible: boolean = false;

  constructor(private toastService: ToastService) { }

  ngOnInit(): void {
    this.toastService.toastState.subscribe((message: string) => {
      this.message = message;
      this.isVisible = true;

       setTimeout(() => {
         this.isVisible = false;
       }, 4000);
    });
  }
}
