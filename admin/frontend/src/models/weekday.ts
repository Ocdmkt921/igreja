import { Model } from './model';

export class Weekday extends Model {    
    constructor(
        public weekday?: string,
        public records?: number,
        public id?: string
    ){
        super(id)
    }
}