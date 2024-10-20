import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { InputWithErrorComponent } from './input-with-error.component';
import { By } from '@angular/platform-browser';

describe('InputWithErrorComponent', () => {
  let component: InputWithErrorComponent;
  let fixture: ComponentFixture<InputWithErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InputWithErrorComponent],
      imports: [FormsModule, ReactiveFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(InputWithErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should write value', () => {
    component.writeValue('test value');
    expect(component.value).toBe('test value');
  });

  it('should register onChange callback', () => {
    const fn = jest.fn();
    component.registerOnChange(fn);
    component.onChange('test value');
    expect(fn).toHaveBeenCalledWith('test value');
  });

  it('should register onTouched callback', () => {
    const fn = jest.fn();
    component.registerOnTouched(fn);
    component.onTouched();
    expect(fn).toHaveBeenCalled();
  });

  it('should set disabled state', () => {
    component.setDisabledState(true);
    expect(component.disabled).toBe(true);
    component.setDisabledState(false);
    expect(component.disabled).toBe(false);
  });

  it('should handle input event', () => {
    const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
    jest.spyOn(component, 'onChange');
    jest.spyOn(component, 'onTouched');

    inputElement.value = 'test input';
    inputElement.dispatchEvent(new Event('input'));

    expect(component.value).toBe('test input');
    expect(component.onChange).toHaveBeenCalledWith('test input');
    expect(component.onTouched).toHaveBeenCalled();
  });

  it('should display error message when control is invalid and touched', () => {
    component.control = new FormControl('', { validators: [] });
    component.control.markAsTouched();
    component.control.setErrors({ required: true });
    fixture.detectChanges();

    const errorMessageElement = fixture.debugElement.query(By.css('.error-message'));
    expect(errorMessageElement).toBeTruthy();
  });

  it('should not display error message when control is valid', () => {
    component.control = new FormControl('', { validators: [] });
    component.control.markAsTouched();
    component.control.setErrors(null);
    fixture.detectChanges();

    const errorMessageElement = fixture.debugElement.query(By.css('.error-message'));
    expect(errorMessageElement).toBeFalsy();
  });
});