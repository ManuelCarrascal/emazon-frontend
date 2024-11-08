import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavLinkComponent } from './atoms/nav-link/nav-link.component';
import { HeaderComponent } from './organisms/header/header.component';
import { SidebarComponent } from './organisms/sidebar/sidebar.component';
import { NavComponent } from './organisms/nav/nav.component';
import { FooterComponent } from './organisms/footer/footer.component';
import { LucideAngularModule, LogOut,ShoppingCart,ShoppingBasket,ShoppingBag} from 'lucide-angular';
import { AtomsModule } from '../ui/atoms/atoms.module';
import { RoleDirective } from './directives/role.directive';

@NgModule({
  declarations: [
    NavLinkComponent,
    HeaderComponent,
    SidebarComponent,
    NavComponent,
    FooterComponent,
    RoleDirective
  ],
  imports: [
    CommonModule,
    RouterModule,
    AtomsModule,
    LucideAngularModule.pick({ LogOut, ShoppingCart,ShoppingBasket,ShoppingBag }),
  ],
  exports: [
    NavLinkComponent,
    HeaderComponent,
    SidebarComponent,
    NavComponent,
    FooterComponent,
    RoleDirective,
  ],
})
export class SharedModule {}
