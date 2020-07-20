import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { ScheduleService } from 'src/service/schedule.service';
import { weekdaysActions } from '../actions/actionTypes';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { setWeekdaysAction } from '../actions/weekdays';
import { Weekday } from 'src/models/weekday';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeekdayEffects {

  getWeekday$ = createEffect(
    () => this.actions$.pipe(
      ofType(weekdaysActions.GET_WEEKDAYS),
      mergeMap(() => this.weekday.getWeekdays()),      
      map((weekdays: Array<Weekday>) => setWeekdaysAction({ weekdays })),
      catchError(err => {
        return of(err);
      }),
    )
  )

  constructor(
    private actions$: Actions,
    private weekday: ScheduleService
  ) { }
}
