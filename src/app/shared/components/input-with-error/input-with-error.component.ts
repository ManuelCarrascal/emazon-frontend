import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input-with-error',
  templateUrl: './input-with-error.component.html',
  styleUrls: ['./input-with-error.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputWithErrorComponent),
      multi: true,
    },
  ],
})
export class InputWithErrorComponent implements ControlValueAccessor {
  @Input() value: string = '';
  @Input() disabled: boolean = false;
  @Input() errorMessage: string = '';
  @Input() control: AbstractControl | null = null;

  onChange: any = () => {};
  onTouched: any = () => {};

  get hasError(): boolean {
    return this.control?.touched && this.control?.invalid || false;
  }


  writeValue(value: string): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.value = inputElement.value;
    this.onChange(this.value);
    this.onTouched();
  }
}
