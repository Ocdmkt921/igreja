import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export const WEEKDAYS = {
  'sun' : 'Domingo',
  'mon' : 'Segunda',
  'tue' : 'Terça',
  'wed' : 'Quarta',
  'thu' : 'Quinta',
  'fri' : 'Sexta',
  'sat' : 'Sábado'
}

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  constructor(
    @Inject('API_ENDPOINT') private apiEndpoint: string,
    private http: HttpClient
  ) { }

  getWeekdays() {

    const options = {
      params: {
        action: 'weekday'
      }      
    }
    return this.http.get(this.apiEndpoint, options);

  }

  getWeekdayDef() {

    return WEEKDAYS;

  }

  getSchedules(weekday: string) {

    const options = {
      params: {
        action: 'schedule',
        weekday
      }
    }
    
    return this.http.get(this.apiEndpoint, options);

  }

  addSchedule(data: any) {

    let formData = new FormData();

    for(let key in data) {

      let value = data[key];
      if(value !== null)
        formData.append(key, value);      

    }
    const observe: 'response' = 'response';
    const options = {
      params: {
        action: 'schedule'
      },
      observe
    }
    return this.http.post(this.apiEndpoint, formData, options);

  }

}
