import { createAction, props } from '@ngrx/store';
import { requestActions } from './actionTypes';

export const requestAction = createAction(requestActions.REQUEST, props<{ submiting: boolean, status: number, scope: string, message?: any }>());