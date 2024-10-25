import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-input-with-label',
  templateUrl: './input-with-label.component.html',
  styleUrls: ['./input-with-label.component.scss'],
})
export class InputWithLabelComponent {
  @Input() label: string = '';
  @Input() value: string = '';
  @Input() disabled: boolean = false;
  @Input() errorMessage: string = '';
  @Input() control: AbstractControl | null = null;
  @Input() placeholder: string = '';
  @Input() type: string = 'text';
}