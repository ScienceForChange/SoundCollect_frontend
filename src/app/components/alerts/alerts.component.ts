import { Component, Input, OnInit, inject } from '@angular/core';
import { NgClass, NgIf, NgStyle } from "@angular/common";
import { warning } from "ionicons/icons";
import { IonicModule, ModalController } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss'],
  standalone: true,
  imports: [
    NgStyle,
    NgClass,
    NgIf,
    IonicModule,
    TranslateModule
  ]
})
export class AlertsComponent implements OnInit {
  @Input() myWarning: boolean = false;
  @Input() mySuccess: boolean = false;
  @Input() myText: string = '';
  @Input() myText2Bold: string = '';
  @Input() myColor: "success" | "warning" | "danger" = "success";
  classSelector = { success: "my-success", warning: "my-warning",danger:"my-danger" }
  constructor() { }

  ngOnInit() { }

  protected readonly warning = warning;
  
}
