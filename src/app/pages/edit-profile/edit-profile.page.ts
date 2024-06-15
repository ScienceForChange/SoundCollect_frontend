import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { IUserData } from 'src/app/models';
import { UserService } from 'src/app/services/user-service';
import { AuthHTTP } from 'src/app/repos';
import { HttpClient } from '@angular/common/http';
import { UserHTTP } from 'src/app/repos/user-repo-http';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule, FormsModule, RouterLink, TranslateModule],
  providers: [HttpClient, AuthService, AuthHTTP, UserService, UserHTTP]
})
export class EditProfilePage implements OnInit {
  translate = inject(TranslateService);
  private modalController = inject(ModalController);
  profileForm!: FormGroup;
  userData!: IUserData;
  myNumbers: [number] = [1900];

  gender_: string = '';
  birth_year_: number = 1900;

  @Input() data: any;

  constructor() {
    for (let i = 1901; i <= 2008; i++) {
      this.myNumbers.push(i)
    }

    this.profileForm = new FormGroup({
      gender: new FormControl(this.gender_),
      birth_year: new FormControl(this.birth_year_),
    });
  }

  async ngOnInit() {
        this.gender?.setValue(this.data.gender);
         this.birth_year?.setValue(this.data.birth_year);
  }

  get gender() {
    return this.profileForm.get('gender');
  }

  get birth_year() {
    return this.profileForm.get('birth_year');
  }

  async sendProfileForm() {
    const data = { gender: this.gender?.value, birthYear: this.birth_year?.value };
    this.modalController.dismiss(data);  

  }

  goBack() {
    this.modalController.dismiss();  
  }
}
