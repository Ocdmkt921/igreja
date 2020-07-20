import { Event } from "src/models/event";
import { createReducer, on, Action } from '@ngrx/store';
import { addItemAction } from '../actions/schedule';

const initialState: Event = new Event();
const scheduleReducer = createReducer(initialState, on(addItemAction, (state, action) => ({ ...state, ...action.event }))
)

export function reducer(state: Event | undefined, action: Action) {
    return scheduleReducer(state, action);
}