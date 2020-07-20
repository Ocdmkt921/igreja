import { createAction, props } from '@ngrx/store';
import { scheduleActions } from './actionTypes';
import { Event } from 'src/models/event';

export const addItemAction = createAction(scheduleActions.ADD_ITEM, props<{ event: Event }>());
export const getScheduleAction = createAction(scheduleActions.GET_ITEMS);
export const setScheduleItemsAction = createAction(scheduleActions.SET_ITEMS, props<{ events: Array<Event> }>());
export const setScheduleWeekday = createAction(scheduleActions.SET_CURRENT_WEEKDAY, props<{ currentWeekday: string }>());