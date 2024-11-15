import {  FormControl, } from '@angular/forms';

export function categoriesCountValidator(min: number, max: number) {
  return (control: FormControl) => {
    const value = control.value;

    if (!Array.isArray(value)) {
      return null;
    }

    const length = value.length;

    if (length < min || length > max) {
      return { categoriesCount: { min, max, actual: length } };
    }

    return null;
  };
}
