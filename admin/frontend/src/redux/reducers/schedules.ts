import { Schedules } from "src/models/schedules";
import { createReducer, on, Action } from '@ngrx/store';
import { getScheduleAction, setScheduleItemsAction, setScheduleWeekday } from '../actions/schedule';

const initialState: Schedules = new Schedules();
const schedulesReducer = createReducer(initialState, 
    on(getScheduleAction),
    on(setScheduleItemsAction, (state, action) => {
        return <Schedules>{ ...state, events: action.events};
    }),
    on(setScheduleWeekday, (state, action) => {
        return <Schedules> { ...state, currentWeekday: action.currentWeekday};
    })
);


export function reducer(state: Schedules | any | undefined, action: Action) {
    return schedulesReducer(state, action);
}