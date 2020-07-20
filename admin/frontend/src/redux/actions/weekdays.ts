import { createAction, props } from '@ngrx/store';
import { weekdaysActions } from './actionTypes';
import { Weekday } from 'src/models/weekday';

export const getWeekdaysAction = createAction(weekdaysActions.GET_WEEKDAYS);
export const setWeekdaysAction = createAction(weekdaysActions.SET_WEEKDAYS, props<{ weekdays: Array<Weekday> }>());
//export const setCurrentWeekday = createAction(weekdaysActions.SET_CURRENT_WEEKDAY, props<{ payload: string }>());