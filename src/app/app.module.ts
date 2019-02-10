import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';

import { AppComponent }  from './app.component';
import { CalendarComponent } from './calendar.component';
import { AutoGrowDirective } from './auto-grow.directive';
import { CalendarService } from './calendar.service';
import { OAuthService } from 'angular2-oauth2/oauth-service';
import { FormsModule }   from '@angular/forms';

@NgModule({
  imports:      [ BrowserModule, HttpModule, FormsModule ],
  declarations: [ AppComponent, CalendarComponent, AutoGrowDirective],
  bootstrap:    [ AppComponent ],
  providers: [CalendarService, OAuthService]
})
export class AppModule { }
