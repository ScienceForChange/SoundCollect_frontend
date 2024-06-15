import {Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnInit} from '@angular/core';
import {NgClass} from "@angular/common";
import {IonicModule} from "@ionic/angular";
import {TranslateModule} from "@ngx-translate/core";
@Component({
  selector: 'app-my-sounds',
  templateUrl: './my-sounds.component.html',
  styleUrls: ['./my-sounds.component.scss'],
  imports: [
    NgClass,
    IonicModule,
    TranslateModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  standalone: true
})
export class MySoundsComponent  implements OnInit {
  @Input() myDb: number = 0;
  constructor() { }

  ngOnInit() {}

}
