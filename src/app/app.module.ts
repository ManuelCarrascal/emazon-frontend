import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UiModule } from './ui/ui.module';
import { SharedModule } from './shared/shared.module';
import { AuthService } from './shared/services/auth/auth.service';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, UiModule, SharedModule],
  providers: [AuthService],
  bootstrap: [AppComponent],
})
export class AppModule {}
