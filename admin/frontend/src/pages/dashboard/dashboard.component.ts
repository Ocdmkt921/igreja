import { Component, NgZone } from '@angular/core';
//import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { MatDialog } from '@angular/material/dialog';
import { EditScheduleDialogComponent } from 'src/components/edit-schedule-dialog/edit-schedule-dialog.component';

import { ActivatedRoute } from '@angular/router';
import { WEEKDAYS } from 'src/service/schedule.service';
import { Store } from '@ngrx/store';
import { setScheduleWeekday, getScheduleAction } from 'src/redux/actions/schedule';
import { Schedules } from 'src/models/schedules';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  weekdayDef = WEEKDAYS;  
  currentDay: string;
  submiting: any;
  schedules: Schedules;

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private store: Store<{ weekdays: any, app: any, schedules: Schedules }>,
    private zone: NgZone
  ) {
    
    this.store.select('app')
      .subscribe(app => {        
        const { request: { scope, submiting } } = app;
        if(scope === 'schedules')
          this.zone.run(() => this.submiting = submiting);        
      });

    this.store.select('schedules')
      .subscribe(schedules => {
        console.log(schedules.events)
        this.schedules = schedules;
      });

    this.route.params.subscribe(params => {
      let { weekday } = params;
      this.currentDay = weekday
      this.store.dispatch(setScheduleWeekday({ currentWeekday: weekday }));
      this.store.dispatch(getScheduleAction());
    })
    
    
  }

  ngOnInit() {

  }

  getWeekday() {
    return this.weekdayDef[this.currentDay]
  }

  openEditSchedule() {
    const options = {
      width: '600px',
      disableClose: true
    };
    this.dialog.open(EditScheduleDialogComponent, options)
  }

}
