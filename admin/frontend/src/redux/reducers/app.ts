import { createReducer, on, Action } from '@ngrx/store';
import { requestAction } from '../actions/request';

const initialState: any = {
    request: {
        submiting: false,
        status: null,
        scope: null,
        message: null
    }
};
const appReducer = createReducer(initialState,
    on(requestAction, (state, action) => {
        const { submiting, scope, status, message } = action;
        let request = { submiting, scope, status, message };
        return { ...state, request };
    })
)

export function reducer(state: any | undefined, action: Action) {
    return appReducer(state, action);
}