import { Component, ElementRef, inject, Input, OnInit, ViewChild } from '@angular/core';
import { IonicModule } from "@ionic/angular";
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import Chart from 'chart.js/auto';


@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    TranslateModule
  ]
})
export class GraphComponent implements OnInit {
private translateService=inject(TranslateService);
  @ViewChild('lineCanvas') private lineCanvas: ElementRef;
  lineChart: Chart;
  @Input() dataset: any[] = [];

  constructor() {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.createLineChart();
  }


  createLineChart() {
    let labelsDates: string[] = [];
    let labelsValues: number[] = [];
    let contador = 0;
    let arrayDataSet = this.dataset.toString().split(","); // Divide la cadena en caracteres individuales
    let max=-100000;
    let min=100000;

    if (arrayDataSet && arrayDataSet.length > 0) {
      arrayDataSet.forEach((data: any) => {
        labelsDates.push(String(contador++));
        labelsValues.push(Number(data));
        if(max<+data) max=+data;
        if(min>+data) min=+data;
      });
    }

    this.lineChart = new Chart(this.lineCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: labelsDates,
        datasets: [{
          label: '',
          data: labelsValues,
          backgroundColor: 'rgba(32,106,113,0.2)',
          borderColor: '#206A71',
          borderWidth: 1,
        }]
      },
      options: {
        scales: {
          y: {
            title: {
              display: true,
              text: this.translateService.instant('sounds.graphic.title_y')
            },
            beginAtZero: false,
            suggestedMax: Math.floor(max+10),
            suggestedMin: Math.floor(min-10)
          },
          x: {
            title: {
              display: true,
              text: this.translateService.instant('sounds.graphic.title_x')
            },
            beginAtZero: true
          }
        },
        plugins:{
          legend:{
            display:false
          }
        }
      }
    });
  }

}
