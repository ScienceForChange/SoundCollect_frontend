import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { IUserData } from 'src/app/models';
import { PatientSimple } from 'src/app/models/patient';
import { UserService } from 'src/app/services/user-service';
import { AuthHTTP } from 'src/app/repos';
import { HttpClient } from '@angular/common/http';
import { UserHTTP } from 'src/app/repos/user-repo-http';
import { AuthService } from 'src/app/services/auth.service';
import { NavigationExtras, Router, RouterLink } from "@angular/router";
import * as moment from 'moment';
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
    private navController = inject(NavController);
    private authService = inject(AuthService);
    private userService = inject(UserService);
    private common = inject(CommonService);
    translate = inject(TranslateService);
    private router = inject(Router);
    profileForm!: FormGroup;
    profile: PatientSimple | null = null;
    profileEdited: PatientSimple | null = null;
    userData!: IUserData;

    constructor() {
    }

    async ngOnInit() {
        const extras = this.router.getCurrentNavigation()?.extras!;
        this.profile = extras.state?.['profile'] as PatientSimple;

        this.profileEdited = { ...this.profile };
        console.log(this.profileEdited);
        if (this.profile) {
            this.profileForm = new FormGroup({
                name: new FormControl(this.profileEdited.name, [Validators.required]),
                lastname: new FormControl(this.profileEdited.lastname, [Validators.required]),
                gender: new FormControl(this.profileEdited.gender, [Validators.required]),
                email: new FormControl(this.profileEdited.email, [Validators.required, Validators.email]),
                birthdate: new FormControl(this.profileEdited.birthdate, [Validators.required]),
                mobile: new FormControl(this.profileEdited.mobile, [Validators.required]),
            });
        }
        console.log(this.profileForm);
        //console.log(moment(this.profileEdited.birthdate * 1000).format('DD MM YYYY'));


    }
    get name() {
        return this.profileForm.get('name');
    }
    get lastname() {
        return this.profileForm.get('lastname');
    }
    get gender() {
        return this.profileForm.get('gender');
    }
    get email() {
        return this.profileForm.get('email');
    }
    get birthdate() {
        return this.profileForm.get('birthdate');
    }
    get mobile() {
        return this.profileForm.get('mobile');
    }
    do() {

    }
    async sendProfileForm() {
        console.log("Send");
        try {

            if (this.profileForm.valid) {
                await this.common.showLoader();
                const updateProfile = await this.userService.updateUser({ ...this.profileForm.value, id: this.profile?.id });

                await this.common.hideLoader();
                if (updateProfile && this.profile && this.name && this.lastname && this.gender && this.email && this.birthdate && this.mobile) {

                    if (this.profile?.email !== this.email?.value) await this.authService.logout();
                    else {
                        const params: NavigationExtras = {
                            state: {
                                profile: {
                                    ...this.profile,
                                    name: this.name.value,
                                    lastname: this.lastname.value,
                                    gender: this.gender.value,
                                    birthdate: this.birthdate.value,
                                    mobile: this.mobile.value
                                }
                            }
                        };

                        await this.navController.navigateBack("/tabs/tab3", params);
                    }
                    //await this.common.setItem("email", this.email.value);
                    //console.log(this.profile);
                }
            }
        } catch (error) {
            await this.common.presentToast(
                this.translate.instant('global_error.label.header'),
                this.translate.instant('global_error.label.message'), 'danger');
        } finally {
            await this.common.hideLoader();
        }

    }
    goBack() {
        this.navController.back();
    }
    changeBirthdate(event: any) {
        const fecha = moment(event.detail.value).valueOf();
        //if (this.profileEdited) this.profileEdited.birthdate = fecha / 1000;
        this.birthdate?.setValue(fecha / 1000);
        console.log(this.profileForm.value);

    }

}
