import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function categoriesCountValidator(min: number, max: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (Array.isArray(value) && value.length >= min && value.length <= max) {
      return null;
    }
    return { categoriesCount: { min, max, actual: value.length } };
  };
}