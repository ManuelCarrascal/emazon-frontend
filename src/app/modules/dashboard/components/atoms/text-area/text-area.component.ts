import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-text-area',
  templateUrl: './text-area.component.html',
  styleUrls: ['./text-area.component.scss']
})
export class TextAreaComponent implements OnInit {
  @Input() value: string = ''; 
  @Output() valueChange = new EventEmitter<string>(); 

  constructor() { }

  ngOnInit(): void {
  }

  onTextAreaChange(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    this.valueChange.emit(textarea.value); 
  }

}
