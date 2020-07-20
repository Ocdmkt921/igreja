import { Model } from './model';

export class Event extends Model {    
    constructor(
        public weekday?: string,
        public timeAt?: string,
        public capacity?: string,
        public exceptDays?: Array<string> | string,
        public id?: string
    ) {
        super(id);
    }
}