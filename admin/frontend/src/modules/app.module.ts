import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from 'src/pages/app/app.component';
import { AppRoutingModule } from 'src/routes/app-routing.module';
import { HomeComponent } from 'src/pages/home/home.component';
import { MaterialModule } from './material.module';
import { DashboardComponent } from 'src/pages/dashboard/dashboard.component';
import { EditScheduleDialogComponent } from 'src/components/edit-schedule-dialog/edit-schedule-dialog.component';
import { StoreModule } from '@ngrx/store';

import * as eventReducer from '../redux/reducers/event';
import * as schedulesReducer from './../redux/reducers/schedules';
import * as weekdaysReducer from './../redux/reducers/weekdays';
import * as appReducer from './../redux/reducers/app';
import { EffectsModule } from '@ngrx/effects';
import { WeekdayEffects } from 'src/redux/effects/weekday.effects';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ScheduleEffects } from 'src/redux/effects/schedule.effects';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DashboardComponent,
    EditScheduleDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    StoreModule.forRoot({ 
      event: eventReducer.reducer,
      weekdays: weekdaysReducer.reducer,
      schedules: schedulesReducer.reducer,
      app: appReducer.reducer
    }),
    EffectsModule.forRoot([ 
      WeekdayEffects, 
      ScheduleEffects
    ])
  ],
  entryComponents: [
    EditScheduleDialogComponent
  ],
  providers: [
    {
      provide: 'API_ENDPOINT',
      useValue: window.location.hostname === 'localhost' 
        ? 'https://tsmail.com.br/projetos/igreja/admin/backend/index.php'
        : '../backend/index.php'
    }
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
