import { FormControl } from '@angular/forms';
import { categoriesCountValidator } from './categories-count-validator';

describe('categoriesCountValidator', () => {
  it('should return null if the array length is within the specified range', () => {
    const control = new FormControl(['category1', 'category2']);
    const validator = categoriesCountValidator(1, 3);
    const result = validator(control);
    expect(result).toBeNull();
  });

  it('should return an error if the array length is less than the minimum', () => {
    const control = new FormControl([]);
    const validator = categoriesCountValidator(1, 3);
    const result = validator(control);
    expect(result).toEqual({ categoriesCount: { min: 1, max: 3, actual: 0 } });
  });

  it('should return an error if the array length is greater than the maximum', () => {
    const control = new FormControl(['category1', 'category2', 'category3', 'category4']);
    const validator = categoriesCountValidator(1, 3);
    const result = validator(control);
    expect(result).toEqual({ categoriesCount: { min: 1, max: 3, actual: 4 } });
  });

  it('should return null if the control value is not an array', () => {
    const control = new FormControl('not an array');
    const validator = categoriesCountValidator(1, 3);
    const result = validator(control);
    expect(result).toBeNull();
  });
});