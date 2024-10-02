import { Component, ElementRef, inject, Input, OnInit, ViewChild } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-spectral-graph',
  templateUrl: './spectral-graph.component.html',
  styleUrls: ['./spectral-graph.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    TranslateModule
  ]
})
export class SpectralGraphComponent implements OnInit {
  private translateService = inject(TranslateService);

  @ViewChild('spectralGraphCanvas') private lineCanvas: ElementRef;
  lineChart: Chart;
  @Input() segments: any[] = [];
  freq: any[] = [];
  spec: any[] = [];
  specDB: any[] = [];

  constructor() {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.createLineChart();
  }


  createLineChart() {
    if (this.segments.length > 0) {
      this.freq = this.segments[0].freq_3;
      this.spec = new Array(this.segments[0].spec_3.length).fill(0);
      this.specDB = new Array(this.segments[0].spec_3_dB.length).fill(0);
      this.segments.forEach((segment, index) => {

        for (let i = 0; i < this.freq.length; i++) {
          this.spec[i] = this.spec[i] + segment.spec_3[i];
          this.specDB[i] = this.specDB[i] + segment.spec_3_dB[i];
          if (index + 1 === this.segments.length) {
            this.spec[i] = this.spec[i] / this.segments.length;
            this.specDB[i] = this.specDB[i] / this.segments.length;
          }
        }
      });
    }

    this.lineChart = new Chart(this.lineCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: this.freq,
        datasets: [{
          label: '',
          data: this.spec,
          backgroundColor: '#1f77b4',
          borderWidth: 0,
        }/*,
        {
          label: '',
          data: this.specDB,
          backgroundColor: '#ff7f0e',
          borderWidth: 0,
        }*/]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            title: {
              display: true,
              text: this.translateService.instant('sounds.graphic.title_y_spectral')
            },
            beginAtZero: true
          },
          x: {
            title: {
              display: true,
              text: this.translateService.instant('sounds.graphic.title_x_spectral')
            },
            beginAtZero: true
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  }

}
