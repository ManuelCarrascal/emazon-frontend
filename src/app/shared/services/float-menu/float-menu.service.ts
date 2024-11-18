import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FloatMenuService {
  private readonly isOpenSubject = new BehaviorSubject<boolean>(false);
  isOpen$ = this.isOpenSubject.asObservable();

  toggleFloatMenu() {
    this.isOpenSubject.next(!this.isOpenSubject.value);
  }

  closeFloatMenu() {
    this.isOpenSubject.next(false);
  }

  openFloatMenu() {
    this.isOpenSubject.next(true);
  }
}