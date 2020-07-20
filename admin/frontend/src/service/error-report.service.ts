import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class ErrorReportService {

  constructor(
    private snackbar: MatSnackBar
  ) { }

  show(err, message?) {

    console.log(err);
    let errorMessage = message ? message : 'Desculpe ocorreu um erro, tente novamente mais tarde';
    this.snackbar.open(errorMessage, 'OK', { duration: 3000 });

  }

}
