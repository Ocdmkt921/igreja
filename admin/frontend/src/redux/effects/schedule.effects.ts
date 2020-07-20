import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { ScheduleService } from 'src/service/schedule.service';
import { scheduleActions } from '../actions/actionTypes';
import { mergeMap, map, catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { requestAction } from '../actions/request';
import { Store } from '@ngrx/store';
import { Schedules } from 'src/models/schedules';
import { setScheduleItemsAction } from '../actions/schedule';
import { Event } from 'src/models/event';

@Injectable({
  providedIn: 'root'
})
export class ScheduleEffects {

  private currentWeekday: string;

  addItem$ = createEffect(
    () => this.actions$.pipe(
      ofType(scheduleActions.ADD_ITEM),
      tap(() => this.store.dispatch(requestAction({ submiting: true , status: null, scope: 'event'} ))),
      mergeMap((result: any) => this.weekday.addSchedule(result.event)),  
      map((result: any) => requestAction({ submiting: false , status: result.status, scope: 'event'} )),
      catchError(err => {
        this.store.dispatch(requestAction({ submiting: false , status: err.status, scope: 'event', message: err.error} ));
        return throwError(err);
      }),
    )
  );
    
  getItems$ = createEffect(
    () => this.actions$.pipe(
      ofType(scheduleActions.GET_ITEMS),
      tap(() => this.store.dispatch(requestAction({ submiting: true , status: null, scope: 'schedules'} ))),
      mergeMap(() => this.weekday.getSchedules(this.currentWeekday)),
      map((events: Array<Event>) => setScheduleItemsAction({ events })),
      tap(() => this.store.dispatch(requestAction({ submiting: false , status: 200, scope: 'schedules'} ))),      
      catchError(err => {
        console.log(err);
        this.store.dispatch(requestAction({ submiting: false , status: err.status, scope: 'schedules', message: err.error} ));
        return throwError(err);
      }),
    )    
  );

  constructor(
    private actions$: Actions,
    private weekday: ScheduleService,
    private store: Store<{ schedules: Schedules }>
  ) { 
    this.store.select('schedules')
      .subscribe(
        schedules => this.currentWeekday = schedules.currentWeekday
      )
  }
}
