import { createReducer, on, Action } from '@ngrx/store';
import { Weekday } from 'src/models/weekday';
import { getWeekdaysAction, setWeekdaysAction } from '../actions/weekdays';

const initialState: Array<Weekday> = new Array<Weekday>();

const weekdaysReducer = createReducer(initialState,
    on(getWeekdaysAction, (state) => state),
    on(setWeekdaysAction, (_, action) => action.weekdays),
)

export function reducer(state: any | undefined, action: Action) {
    return weekdaysReducer(state, action);
}