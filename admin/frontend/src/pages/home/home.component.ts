import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Weekday } from 'src/models/weekday';
import { getWeekdaysAction } from 'src/redux/actions/weekdays';
import { Router } from '@angular/router';
import { WEEKDAYS } from './../../service/schedule.service';
import { Schedules } from 'src/models/schedules';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  weekdays: Array<Weekday> = [];
  weekdayDef = WEEKDAYS;
  currentDay: string = null;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private store: Store<{ weekdays: any, schedules: Schedules }>,
    private router: Router
  ) {

  }

  ngOnInit() {

    this.store.select('weekdays')
      .subscribe(
        (weekdays: any) => {
          
          if(weekdays.length) {

            this.weekdays = weekdays;
            this.router.navigate(['/', 'day', this.weekdays[0].weekday]);

          }
        },
        err => console.log(err)
      );

    this.getWeekdays();

  }

  private getWeekdays() {
    this.store.dispatch(getWeekdaysAction());
  }

}
