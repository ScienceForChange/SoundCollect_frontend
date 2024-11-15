import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { IonicModule, IonicSlides, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import Swiper from 'swiper';
import { HttpClient } from '@angular/common/http';
import { AuthService, CommonService } from '../../services';
import { AuthHTTP } from '../../repos';


@Component({
    selector: 'app-onboarding',
    templateUrl: './onboarding.page.html',
    styleUrls: ['./onboarding.page.scss'],
    standalone: true,
    imports: [IonicModule, CommonModule, FormsModule, RouterLinkActive, RouterLink, TranslateModule],
    providers: [HttpClient, AuthService, AuthHTTP],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OnboardingPage implements OnInit {
    @ViewChild('swiperBoarding') swiperRef!: ElementRef;
    navController = inject(NavController);
    authService = inject(AuthService);
    commonService = inject(CommonService);
    swiper?: Swiper;
    swiperModules = [IonicSlides];
    currentIndex = 1;
    readonly INTRO_KEY = 'has_seen_onboarding';
    constructor() {
    }

    swiperReady() {
        this.swiper = this.swiperRef?.nativeElement.swiper;
    }

    ngOnInit() {
    }

    goNext() {
        this.swiperRef?.nativeElement.swiper.slideNext(300);
        this.currentIndex++;
    }

    async finished() {
        await this.commonService.setItem(this.INTRO_KEY, 'TRUE');
        await this.navController.navigateRoot('/login');
    }

    onSlideChange() {
        // Obtener el índice actual del slide
        this.currentIndex = this.swiperRef?.nativeElement.swiper.activeIndex;
        this.currentIndex++;
    }
}

