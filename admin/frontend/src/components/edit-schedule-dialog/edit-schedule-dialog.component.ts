import { Component, OnInit, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Event } from 'src/models/event';
import { addItemAction } from './../../redux/actions/schedule';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { ErrorReportService } from 'src/service/error-report.service';

@Component({
  selector: 'app-edit-schedule-dialog',
  templateUrl: './edit-schedule-dialog.component.html',
  styleUrls: ['./edit-schedule-dialog.component.scss']
})
export class EditScheduleDialogComponent implements OnInit {

  dateFilter: any;
  form: FormGroup;
  exceptDaysControls: any;
  request: any;

  constructor(
    private fb: FormBuilder,
    private store: Store<{ weekdays: any, app: any }>,
    private zone: NgZone,
    private dialogRef: MatDialogRef<EditScheduleDialogComponent>,
    private snackbar: MatSnackBar,
    private errorReport: ErrorReportService
  ) { 

    this.form = this.fb.group({
      id: [ null ],
      weekday: [ null, Validators.required ],
      timeAt: [ null, Validators.required ],
      capacity: [ null, [ Validators.required, Validators.min(1) ]],
      exceptDaysActive: [ false, Validators.required ],
      exceptDays: this.fb.array([]),
      active: [ true, Validators.required ]
    })

    this.exceptDaysControls = (this.form.get('exceptDays') as FormArray).controls;
    this.store
      .select('weekdays')
      .subscribe(weekdays => this.form.patchValue({ weekday: weekdays.currentDay }))
    this.store.select('app')
      .subscribe(
        app => {

          const { request:{ scope, status, message } } = app;          
          if(scope === 'event') {
            console.log(status, message)
            if(status === 200) {
              this.snackbar.open('Culto cadastrado com sucesso!', 'OK', { duration: 3000 });
              this.dialogRef.close(true);
            } else if(status !== null)
              this.errorReport.show(null, message);
            
            this.zone.run(() => this.request = app.request)

          }
          
        },
        //err => this.errorReport.show(err)
      )

  }

  ngOnInit() {

    this.dateFilter = date => {

      const day = (date || new Date()).getDay();
      return day === 6;

    }

    this.form.get('exceptDaysActive')
      .valueChanges
      .subscribe(
        exceptDaysActive => {

          if(exceptDaysActive)
            this.addExceptDayControl();
          else {
            let controls = this.form.get('exceptDays') as FormArray;
            controls.clear();
          }

        }
      )

  }

  addExceptDayControl() {

    let controls = this.form.get('exceptDays') as FormArray;
    console.log(controls);
    controls.push(this.fb.group({ day: [ null, Validators.required ] }));

  }

  removeExceptDayControl(i: number) {

    if(!confirm('Deseja realmente remover essa data?'))
      return;

    let controls = this.form.get('exceptDays') as FormArray;
    controls.removeAt(i);

  }

  onSubmitForm() {

    let data = this.form.getRawValue();
    let isValid = !this.form.invalid;
    
    if(isValid) {

      let event = new Event(
        data.weekday,
        data.timeAt,
        data.capacity,
        data.exceptDays,
        data.id
      );
      
      this.store.dispatch(addItemAction({ event }));

    }

  }

}
