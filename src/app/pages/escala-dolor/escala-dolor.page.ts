import {Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule, IonicSlides, NavController} from '@ionic/angular';
import {NavigationExtras, Router} from '@angular/router';
import {
    AuthService,
    CommonService,
    PerformedTestService,
    ProgramPatientService,
    TestService,
    ToastPosition
} from '../../services';
import {HttpClient} from '@angular/common/http';
import {TestHTTP} from '../../repos/test-repo-http';
import Swiper from 'swiper';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {PerformedTestHTTP} from '../../repos/peformed-test-repo-http';
import {ITest, IUserData} from '../../models';
import {AuthHTTP} from '../../repos/auth-repo-http';
import {ProgramPatientHTTP} from '../../repos/program-patient-http';

@Component({
    selector: 'app-escala-dolor',
    templateUrl: './escala-dolor.page.html',
    styleUrls: ['./escala-dolor.page.scss'],
    standalone: true,
    imports: [IonicModule, CommonModule, FormsModule, TranslateModule],
    providers: [
        HttpClient,
        TestHTTP,
        TestService,
        PerformedTestHTTP,
        PerformedTestService,
        AuthHTTP,
        AuthService,
        ProgramPatientHTTP,
        ProgramPatientService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EscalaDolorPage implements OnInit {

    @ViewChild('swiperQuestions') swiperRef: ElementRef | undefined;
    @ViewChild('btnOnboarding', {static: false}) btnOnboarding?: ElementRef;
    @ViewChild('btnOnboardingPrev', {static: false}) btnOnboardingPrev?: ElementRef;

    navController = inject(NavController);
    authService = inject(AuthService);
    common = inject(CommonService);
    router = inject(Router);
    testService = inject(TestService);
    translate = inject(TranslateService);
    performedTestSrv = inject(PerformedTestService);
    programPatientService = inject(ProgramPatientService);

    swiper?: Swiper;
    swiperModules = [IonicSlides];
    slideActive!: ElementRef;

    index? = 0;
    step = 0;
    btnText?: string;
    id!: string;
    program!: string;
    programPatient!: string;
    answerText = '';
    isEnd = false;
    processing = true;
    enabledNext = false;
    extras: NavigationExtras;
    questionary: ITest;
    userData!: IUserData;
    answer: any;

    /*config: SwiperOptions = {
        slidesPerView: 1,
        allowTouchMove: false
    };*/

    constructor() {
    }

    async ngOnInit() {
        this.extras = this.router.getCurrentNavigation()?.extras!;
        this.id = this.extras.state?.['id'];
        this.program = this.extras.state?.['program'];
        this.programPatient = this.extras.state?.['programPatient'];
        // @ts-ignore
        this.userData = await this.authService.getUser();
        await this.loadQuestionary();
    }

    swiperReady() {
        this.swiper = this.swiperRef?.nativeElement.swiper;
    }

    goNext() {
        this.answerText = '';
        this.swiper?.slideNext();
    }

    goPrev() {
        this.swiper?.slidePrev();
    }

    async loadQuestionary() {
        try {
            this.processing = true;
            await this.common.showLoader();
            this.questionary = await this.testService.getTestById({id: this.id});
            const length = this.questionary.questions.collection?.length;
            this.answer = new Array(length);

            this.btnText = this.translate.instant('questionary.btn.next');
            if (length === 1) {
                this.isEnd = true;
                this.btnText = this.translate.instant('questionary.btn.finished');
            }
            this.processing = false;
            await this.common.hideLoader();
        } catch (error) {
            // @ts-ignore
            console.error(error?.message);
            // @ts-ignore
            await this.common.presentToast(error?.name, error?.message, 'danger', 4000);
            this.navController.back();
        }

        await this.common.hideLoader();
        this.processing = false;
    }

    clearSelected() {
        if (!!this.slideActive) {
            // @ts-ignore
            this.slideActive.querySelectorAll('.items-list').forEach((el, index) => {
                el.classList.remove('my-selected-intensity-pain');
            });
        }
    }

    paintSelect(el: Element) {
        if (el.localName === 'button') {
            el.classList.add('my-selected-intensity-pain');
            // @ts-ignore
        } else {
            // @ts-ignore
            el.parentElement.classList.add('my-selected-intensity-pain');
        }
    }

    async setSwiperInstance(action: string) {
        if (this.isEnd && action === 'next') {
            await this.common.showLoader();
            try {
                const payload = {
                    date: this.extras.state?.['date'],
                    // @ts-ignore
                    patient: `/api/patients/${this.userData?.user.id}`,
                    programItem: this.questionary.id,
                };
                if (this.programPatient) {
                    // @ts-ignore
                    payload.programPatient = this.programPatient;
                    // @ts-ignore
                    delete payload.patient;
                }
                const createFinishedTest = await this.performedTestSrv.createFinishedTest(payload);
                if ('id' in createFinishedTest.finishedTest) {
                    this.questionary?.questions.collection.map(async (q: any, index: number) => {
                        await this.performedTestSrv.createAnswerTest({
                            question: q.text,
                            value: this.answer[index],
                            performedTest: createFinishedTest.finishedTest?.id
                        });
                    });

                    await this.common.hideLoader();
                    await this.common.presentToast(
                        this.translate.instant('global.label.information'),
                        this.translate.instant('questionary.label.activity_finalized'),
                        'success', undefined, ToastPosition.top);

                    await this.navController.navigateRoot('tabs/tab1', {replaceUrl: true});
                }
                // }
            } catch (e) {
                await this.common.hideLoader();
                await this.navController.navigateRoot(
                    'tabs/tab1'
                );
            }
        } else {
            if (action === 'prev') {
                // @ts-ignore
                this.step = this.swiper.activeIndex - 1;
            } else {
                // @ts-ignore
                this.step = this.swiper.activeIndex + 1;
            }

            this.btnText = this.translate.instant('questionary.btn.next');
            if (this.step === (this.questionary?.questions.collection?.length - 1)) {
                this.isEnd = true;
                this.btnText = this.translate.instant('questionary.btn.finished');
            } else {
                this.isEnd = false;
            }
            // @ts-ignore
            this.enabledNext = true;
        }
    }

    pickAnswer(pos: number, child: any, ev: any) {
        if (ev.target.localName === 'button') {
            this.slideActive = ev.target.parentElement;
        } else {
            this.slideActive = ev.target.parentElement.parentElement;
        }

        if (this.questionary.questions.collection[pos].type === 'single') {
            if (this.answer[pos]) {
                if (this.answer[pos][0] === child.answer) {
                    this.clearSelected();
                    this.answer[pos] = null;
                    this.enabledNext = false;
                } else {
                    this.clearSelected();
                    this.paintSelect(ev.target);
                    this.answer[pos] = [child.answer];
                    this.enabledNext = true;
                }
            } else {
                this.clearSelected();
                this.paintSelect(ev.target);
                this.answer[pos] = [child.answer];
                this.enabledNext = true;
            }
        } else if (this.questionary.questions.collection[pos].type === 'multiple') {
            if (this.answer[pos]) {
                const filter = this.answer[pos].filter((n: any) => (n !== child.answer));

                if (filter?.length === this.answer[pos]?.length) {
                    this.answer[pos] = this.answer[pos].concat(child.answer);
                    this.paintSelect(ev.target);
                    this.enabledNext = true;
                } else {
                    ev.target.classList.remove('my-items-list-selected');
                    this.answer[pos] = filter;
                    if (filter?.length === 0) {
                        this.enabledNext = false;
                    }
                }
            } else {
                this.paintSelect(ev.target);
                this.answer[pos] = [child.answer];
                this.enabledNext = true;
            }
        }
    }

    onChangeAnswer() {
        this.answer[this.step] = [this.answerText];
        this.enabledNext = true;
    }

    goBack() {
        this.navController.back();
    }

}
