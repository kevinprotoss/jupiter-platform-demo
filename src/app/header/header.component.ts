import { Component, Input } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Observable } from 'rxjs';

import { AnalysisService } from '../analysis.service';

/**
 * Read the text contents of a File or Blob using the FileReader interface.
 * This is an async interface so it makes sense to handle it with Rx.
 * @param {blob} File | Blob
 * @return Observable<string>
 */
const readFile = (blob) => Observable.create(obs => {
  if (!(blob instanceof Blob)) {
    obs.error(new Error('`blob` must be an instance of File or Blob.'));
    return;
  }

  const reader = new FileReader();

  reader.onerror = err => obs.error(err);
  reader.onabort = err => obs.error(err);
  reader.onload = () => obs.next(reader.result);
  reader.onloadend = () => obs.complete();

  return reader.readAsText(blob);
});

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  @Input() public sidenav: MatSidenav;
  
  constructor(private analysisService: AnalysisService) {
  }

  csvInputChange(event) {
    let file = event.target.files[0];
    readFile(file).subscribe((csvText) => {
      this.analysisService.loadDatabase(csvText);
    });
  }

}