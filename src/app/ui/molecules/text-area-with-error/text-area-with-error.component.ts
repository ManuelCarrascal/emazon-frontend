import { Component, forwardRef, Input } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-text-area-with-error',
  templateUrl: './text-area-with-error.component.html',
  styleUrls: ['./text-area-with-error.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextAreaWithErrorComponent),
      multi: true,
    },
  ],
})
export class TextAreaWithErrorComponent implements ControlValueAccessor {
  @Input() value: string = '';
  @Input() disabled: boolean = false;
  @Input() errorMessage: string = '';
  @Input() control: AbstractControl | null = null;
  @Input() placeholder: string = '';

  onChange: any = () => {};
  onTouched: any = () => {};

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
    const inputElement = event.target as HTMLTextAreaElement;
    this.value = inputElement.value;
    this.onChange(this.value);
    this.onTouched();
  }

  get hasError(): boolean {
    return this.control?.touched && this.control?.invalid || false;
  }
}
