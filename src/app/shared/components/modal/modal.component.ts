import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  @Input() isVisible: boolean = false;
  @Output() close = new EventEmitter<void>();


  constructor() { }

  ngOnInit(): void {
  }

  closeModal() {
    this.isVisible = false;
    this.close.emit();
  }

}
