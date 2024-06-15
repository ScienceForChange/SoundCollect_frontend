import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import { IonicModule } from "@ionic/angular";
import { TranslateModule } from '@ngx-translate/core';
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

  // @ts-ignore
  @ViewChild('lineCanvas') private lineCanvas: ElementRef;
  lineChart: Chart;
  @Input() dataset: any[] = [];

  constructor() {
  }

  ngOnInit() {
    console.log('dataset', this.dataset)
  }

  ngAfterViewInit() {
    this.createLineChart();
  }


  createLineChart() {
    let labelsDates: string[] = [];
    let contador = 0;
    this.dataset.forEach((data: any) => {
      labelsDates.push(contador++ + '');
    });

    this.lineChart = new Chart(this.lineCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: labelsDates,
        datasets: [{
          label: '',
          data: this.dataset,
          backgroundColor: 'rgba(32,106,113,0.2)',
          borderColor: '#206A71',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

}
