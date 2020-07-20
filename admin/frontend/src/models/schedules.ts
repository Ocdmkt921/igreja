import { Model } from './model';
import { Event } from './event';

export class Schedules extends Model {
    constructor(        
        public currentWeekday?: string,
        public events?: Array<Event>,
        public id?: string
    ) {
        super(id);
    }
}