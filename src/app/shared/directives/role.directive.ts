import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '@/app/shared/services/auth/auth.service';

@Directive({
  selector: '[appRole]'
})
export class RoleDirective {
  private readonly currentRole: string | null = null;

  constructor(
    private readonly templateRef: TemplateRef<unknown>, 
    private readonly viewContainer: ViewContainerRef,
    private readonly authService: AuthService
  ) {
    this.currentRole = this.authService.getUserRole();
  }

  @Input() set appRole(role: string) {
    if (this.currentRole === role) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}