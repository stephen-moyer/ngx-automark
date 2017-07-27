import { Component, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';

import { AutoMark, AutoMarkService } from "./autochange.service";

class TestModel {

  @AutoMark()
  public text: string;

  constructor(private t: string) {
    this.text = t;
  }

}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],  
  providers: [ AutoMarkService ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {

  @AutoMark()
  complex = new TestModel('should change after 2 seconds.');

  complexNoAuto = new TestModel('should not change after 4 seconds.');

  constructor(private ___autoMark: AutoMarkService) {
  }

  ngOnInit() {
    setTimeout(() => {
      this.complex.text = 'changed.';
    }, 2000);
    setTimeout(() => {
      this.complexNoAuto.text = 'changed.';
    }, 4000);
  }

}
