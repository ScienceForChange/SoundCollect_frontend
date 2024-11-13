import { Component, OnInit } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {TranslateModule} from "@ngx-translate/core";
import {RouterLink} from "@angular/router";
import {CommonService} from "../../services";
import { PdfViewerModule } from 'ng2-pdf-viewer';

@Component({
  selector: 'app-user-guide',
  templateUrl: './user-guide.page.html',
  styleUrls: ['./user-guide.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, TranslateModule, RouterLink, NgOptimizedImage, PdfViewerModule]
})
export class UserGuidePage implements OnInit {

  pdfSrc = '../assets/pdf/guide.pdf';
  zoom = 1;

  constructor(
    private common: CommonService
  ) { }

  async ngOnInit() {
    await this.common.showLoader();
  }

  async complete(ev: any) {
    await this.common.hideLoader();
  }

  zoomIn(){
    if(this.zoom <= 2){
      this.zoom += 0.5;
    }
  }

  zoomOut(){
    if (this.zoom > 1 ){
      this.zoom -= 0.5;
    }
  }

  isValidAmpliar(){
    return this.zoom <= 2
  }

  isValidReducir(){
    return this.zoom > 1;
  }


  // async shareDocument(){
  //   await this.common.showLoader();
  //   this.file.writeFile(this.file.tempDirectory, this.fileName, this.pdfBlob, { replace: true })
  //     .then(res => {
  //       Share.share({
  //         title: this.fileName,
  //         url: res.nativeURL,
  //       }).then(resShare => {
  //         // console.log('resShare DONE: ', resShare);
  //         this.common.hideLoader();
  //       }).finally( () => this.common.hideLoader());
  //     }, err => {
  //       // console.log('Error dataDirectory: ', err);
  //       this.common.hideLoader();
  //     }).finally( () => this.common.hideLoader());
  // }
}
