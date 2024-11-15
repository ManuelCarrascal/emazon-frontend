import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ModalComponent } from './modal.component';

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have isVisible as false by default', () => {
    expect(component.isVisible).toBeFalsy();
  });

  it('should emit close event and set isVisible to false when closeModal is called', () => {
    const closeSpy = jest.spyOn(component.close, 'emit');

    component.isVisible = true;
    component.closeModal();

    expect(component.isVisible).toBeFalsy();
    expect(closeSpy).toHaveBeenCalled();
  });

  it('should display modal when isVisible is true', () => {
    component.isVisible = true;
    fixture.detectChanges();

    const modalElement = fixture.debugElement.query(By.css('.modal.show'));
    expect(modalElement).toBeTruthy();
  });

  it('should not display modal when isVisible is false', () => {
    component.isVisible = false;
    fixture.detectChanges();

    const modalElement = fixture.debugElement.query(By.css('.modal.show'));
    expect(modalElement).toBeNull();
  });

  it('should call closeModal when close button is clicked', () => {
    const closeModalSpy = jest.spyOn(component, 'closeModal');
    component.isVisible = true;
    fixture.detectChanges();

    const closeButton = fixture.debugElement.query(By.css('.flex-end'));
    closeButton.triggerEventHandler('click', null);

    expect(closeModalSpy).toHaveBeenCalled();
  });
});