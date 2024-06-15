import { Component, NO_ERRORS_SCHEMA, ViewChild, inject } from '@angular/core';
import { AlertController, IonModal, IonicModule, NavController } from '@ionic/angular';
import { AuthService, CommonService, PatientService, ProgramPatientService } from '../services';
import { HttpClient } from '@angular/common/http';
import { AuthHTTP, PatientHTTP } from '../repos';
import { ICondensedPatient, IUserData } from '../models';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule, SlicePipe } from "@angular/common";
import * as moment from 'moment';
import { ProgramPatientHTTP } from '../repos';
import { ComponentsModule } from '../pipes/components.module';
import { NavigationEnd, NavigationExtras, Router, RouterLink } from '@angular/router';
import { PatientSimple } from '../models/patient';
import { UserService } from '../services/user-service';
import { UserHTTP } from '../repos/user-repo-http';
import Chart from 'chart.js/auto';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, TranslateModule, RouterLink, SlicePipe, ComponentsModule,],
  providers: [HttpClient, AuthService, AuthHTTP, UserService, UserHTTP, PatientService, PatientHTTP, ProgramPatientService, ProgramPatientHTTP],
})
export class Tab3Page {
  @ViewChild('modal3', { static: false }) modal3?: IonModal;
  userData!: IUserData;
  patientService = inject(PatientService);
  userService = inject(UserService);
  programPatientatientService = inject(ProgramPatientService);
  navController = inject(NavController);
  authService = inject(AuthService);
  common = inject(CommonService);
  private router = inject(Router);
  sub!: Subscription;
  programs: ICondensedPatient[] = [];
  today_program: ICondensedPatient[] = [];
  today_programs_text = "";
  today_exercises: any;
  today_tests: any;
  today_session_number = 0;
  appVersion=environment.appVersion;
  processing = true;
  fisrtOpen = false;
  finished = 0;
  today = 0;
  dayWeek = 0;
  counter = 0;
  finishedAct = 0;
  percent = 0;
  total = 0;
  todayFinishedAct = 0;
  totalAndProgressDay: { [key: string]: { total: number, progress: number } } = {};
  patient: PatientSimple | null = null;
  painRange: "month" | "week" | "year" = "month";
  borgRange: "month" | "week" | "year" = "month";
  painChart: Chart | null = null;
  borgChart: Chart | null = null;
  constructor(
    private commonService: CommonService,
    private alertController: AlertController,
    private translate: TranslateService
  ) { }

  async ngOnInit() {

  }
  ngDestroy() {
    if (this.sub) this.sub.unsubscribe();
  }

  ionViewWillEnter() {
    //this.initToday();
  }
  getAge(fechaNacimiento: number): number {
    const fechaNacimientoDate = new Date(fechaNacimiento);
    const hoy = new Date();

    let edad = hoy.getFullYear() - fechaNacimientoDate.getFullYear();

    // Ajuste si aún no ha pasado el cumpleaños este año
    if (
        hoy.getMonth() < fechaNacimientoDate.getMonth() ||
        (hoy.getMonth() === fechaNacimientoDate.getMonth() &&
            hoy.getDate() < fechaNacimientoDate.getDate())
    ) {
      edad--;
    }

    return edad;
  }

  async loadActivities() {
    try {
      this.processing = true;
      await this.common.showLoader();
      const result = await this.patientService.getCondensedPatient({ id: `/api/patients/${this.userData.user.id}` });
      console.log(result);

      this.processing = false;
      this.programs = [...result?.condensedActivities];
      //let dayOfWeek = moment(Date.now()).day();
      this.dayWeek = this.today/*dayOfWeek === 0 ? 6 : dayOfWeek - 1*/;
      Array.apply(null, new Array(this.dayWeek + 1)).map((val, index) => {
        const actual = moment(Date.now()).subtract(index, 'days');
        console.log("Actual----------------------: ", actual);

        const activity = this.searchActivity(actual);
        console.log(activity);

        if (activity.length > 0) {
          const isFinished = activity[0].items.filter((act: any) => {
            return act.isFinished;
          });
          console.log("Day ", index, ": ", isFinished.length, "/", activity[0].items.length);
          //const actualDay=actual.day()=== 0 ? 6 : actual.day() - 1;
          console.log(this.today + " --- " + (actual.day() - 1));
          console.log(isFinished.length + " - " + activity[0].items.length);

          if (isFinished.length === activity[0].items.length) {
            console.log('TODO TERMINADO', actual.day() - 1);
            document.querySelector(`.about-me .day-${actual.day() - 1}`)?.classList.add('done');
          } else if (this.today !== actual.day() - 1) {
            console.log('AUN FALTA TRABAJO POR COMPLETAR', actual.day() - 1);
            document.querySelector(`.about-me .day-${actual.day() - 1}`)?.classList.add('fail');
          }
        }
      });

      this.programs.map((act, index) => {
        const exeDate = moment.unix(act.date).utc().dayOfYear();
        const exeToday = moment(Date.now()).dayOfYear();
        if (+exeDate === +exeToday) {
          this.today_session_number = index + 1;
          this.today_program.push(act);
        }
      });

      if (this.today_program.length > 0) {
        this.today_tests = new Object();
        this.today_exercises = new Object();

        this.today_program.map(program => {

          let programsText: string[] = [];
          const isFinished = program.items.filter(async (item: any) => {
            const activity = { ...item };
            activity.date = program.date;
            this.total++;
            if (item.isFinished) {
              this.todayFinishedAct++;
            }
            if (item.activityType === 'test') {
              if (!!this.today_tests[item.activityProgramIri]) {
                this.today_tests[item.activityProgramIri].push(activity);
              } else {
                this.today_tests[item.activityProgramIri] = new Array();
                this.today_tests[item.activityProgramIri].push(activity);
              }
            } else if (item.activityType === 'exercise') {
              if (!!this.today_exercises[item.activityProgramIri]) {
                this.today_exercises[item.activityProgramIri].push(activity);
              } else {
                programsText.push(activity.activityProgramTitle);
                this.today_exercises[item.activityProgramIri] = new Array();
                this.today_exercises[item.activityProgramIri].push(activity);
                const programPatient = await this.programPatientatientService.getTotalAndProgressDays({ id: activity.activityProgramPatientIri });

                this.totalAndProgressDay[programPatient.id] = { total: programPatient.totalDays, progress: programPatient.progressDays };
              }
            }
            return item.isFinished;
          });

          console.log(programsText);
          this.today_programs_text = programsText.join(", ");
          this.finished = isFinished.length;
          /*if (this.finished === this.today_program[0].items.length) {
              console.log("This finished");

              document.querySelector(`.about-me .day-${this.today}`)?.classList.add('done');
          }*/
        });
      }
      console.log("Programs: ", this.today_program);


      await this.common.hideLoader();
      this.programs.map((days) => {
        days.items.map((act: any) => {
          this.counter++;
          if (act.isFinished) {
            this.finishedAct++;
          }
        });
      });

      this.percent = Math.round(((this.finishedAct * 100) / this.counter) * 100) / 100;
    } catch (err) {
      await this.common.hideLoader();
      const headerMsg = this.translate.instant('global_error.label.header');
      const message = this.translate.instant('home.error.reload');
      const reload = this.translate.instant('home.buttons.btn_reload');
      const alert = await this.alertController.create({
        header: headerMsg,
        message: message,
        cssClass: 'my-alert',
        buttons: [
          {
            text: reload,
            role: 'confirm',
            cssClass: 'my-btn-alert-confirm',
            handler: async () => {
              alert.dismiss();
              await this.loadActivities();
            },
          },
        ]
      });
      await alert.present();
    }
  }
  searchActivity(date: any) {
    return this.programs.filter((act) => {
      const exeToday = date.dayOfYear();
      const exeDate = moment.unix(act.date).utc().dayOfYear();
      return (exeToday === exeDate)
    });
  }
  onWillPresent(ev: any) {
    this.toogleActives('hide');
  }
  toogleActives(action: string) {
    const actives = document.querySelectorAll('.about-me-modal .my-active-section');
    actives.forEach((el, index) => {
      if (index !== (actives.length - 1)) {
        if (action === 'show') {
          el.classList.remove('ion-hide');
        } else {
          el.classList.add('ion-hide');
        }
      }
    });
  }
  counterFinish(activity: any) {
    const result = activity.items.filter((item: any) => {
      return item.isFinished;
    });

    return result.length;
  }
  async pickActivity(program: any, item: any) {


    if (this.isSameDay(program.date)) {
      if (item.activityType === 'test') {
        if (!item.isFinished) {
          const params: NavigationExtras = {
            state: {
              id: item.activityIri,
              // @ts-ignore
              program: item.activityProgramIri,
              programPatient: item.activityProgramPatientIri,
              date: program?.date
            }
          };
          await this.navController.navigateRoot('escala-dolor', params);
        }
      } else if (item.activityType === 'exercise') {
        const programDate = moment.unix(program.date).utc().dayOfYear();//moment(program.date * 1000);
        const todayDate = moment(Date.now()).dayOfYear();
        if (item.isFinished) {
          await this.common.presentToast(
            this.translate.instant('global_error.label.header'),
            this.translate.instant('training.error.exercise_done'), 'primary');
        } else if (programDate < todayDate) {
          await this.common.presentToast(
            this.translate.instant('global_error.label.header'),
            this.translate.instant('training.error.exercise_of_another_day'), 'primary');
        } else {
          let exercises: any[] = [];
          program.items.filter((i: any) => {
            if (i.activityType === 'exercise' && i.activityProgramIri === item.activityProgramIri) {
              const copy = { ...i };
              copy.date = program?.date;
              exercises.push(copy);
            }
          });

          const params: NavigationExtras = {
            state: {
              // @ts-ignore
              exercises
            }
          };
          this.modal3?.dismiss();
          await this.navController.navigateRoot('ejercicio-hoy', params);
        }

      }


    }
  }
  isSameDay(date: any) {
    const exeToday = moment(Date.now()).dayOfYear();
    const exeDate = moment.unix(date).utc().dayOfYear();
    return (exeToday >= exeDate)
  }
  async logout() {
    const message = await this.translate.instant('about_me.label.close_session');
    const btn_accept = await this.translate.instant('about_me.buttons.btn_accept');
    const btn_cancel = await this.translate.instant('about_me.buttons.btn_cancel');

    const alert = await this.alertController.create({
      header: message,
      mode: 'ios',
      buttons: [
        {
          text: btn_accept,
          handler: () => {
            this.authService.logout();
          }
        },
        {
          text: btn_cancel,
          handler: () => {
            console.log('Confirm Cancel');
          }
        }
      ]
    });
    await alert.present();
  }

  async loadGraphicsInfoPain() {
    if (this.painChart) {
      this.painChart.destroy();
      this.painChart = null;
    }
    const painCanvas = document.getElementById('pain-scale-canvas') as HTMLCanvasElement;
    const { data, dataDays } = await this.getUserRecords(this.painRange, "pain");
    //Gráfica de Dolor
    this.painChart = new Chart(
      painCanvas,
      {
        type: 'line',
        data: {
          labels: dataDays.map(row => row.day),
          datasets: this.borgDatasets(data)
        },
        options: {
          scales: {
            y: {
              suggestedMin: 0,
              suggestedMax: 10,
              ticks:{
                color:"#000000"
              }
            },
            x: {
              ticks: {
                maxTicksLimit: this.painRange === "week" ? 7 : 4,
                color:"#000000"
              }
            }
          },
          plugins: {
            filler: {
              propagate: false,
            },
          },
          interaction: {
            intersect: false,
          }
        },
      }
    );
  }
  async loadGraphicsInfoBorg() {
    if (this.borgChart) {
      this.borgChart.destroy();
      this.borgChart = null;
    }
    const borgCanvas = document.getElementById('borg-scale-canvas') as HTMLCanvasElement;
    const { data, dataDays } = await this.getUserRecords(this.borgRange, "borg");

    //Gráfica de Dolor
    this.borgChart = new Chart(
      borgCanvas,
      {
        type: 'line',
        data: {
          labels: dataDays.map(row => row.day),
          datasets: this.borgDatasets(data)
        },
        options: {
          scales: {
            y: {
              suggestedMin: 0,
              suggestedMax: 10,
              ticks:{
                color:"#000000"
              }
            },
            x: {
              ticks: {
                maxTicksLimit: this.borgRange === "week" ? 7 : 4,
                color:"#000000"
              }
            }
          },
          plugins: {
            filler: {
              propagate: false,
            },
          },
          interaction: {
            intersect: false,
          }
        },
      }
    );
  }
  painSelect(select: any) {
    this.painRange = select.target.value;
    this.loadGraphicsInfoPain();
  }
  borgSelect(select: any) {
    this.borgRange = select.target.value;
    this.loadGraphicsInfoBorg();
  }
  async goToChangePassword() {
    await this.navController.navigateForward("password-new");
  }
  borgDatasets(borgData: { [key: string]: { title: string, data: { day: string | null, value: number | null }[] } }): any {
    let datasets = [];
    const setColors = ["#FF5B23", "#0D423E", "#BDE6FA", "A0DF87"];
    let indexColor = 0;
    for (let data in borgData) {
      datasets.push(
        {
          label: borgData[data].title,
          data: borgData[data].data.map(row => row.value),
          borderColor: setColors[indexColor],
          backgroundColor: setColors[indexColor],
          fill: true
        }

      );
      indexColor++;
    }
    return datasets;
  }
  async getUserRecords(range: "week" | "month" | "year", type: "borg" | "pain") {
    // Obtener momento actual
    const justNow = moment().locale('es');
    let start = 0;
    let end = 0;
    let totalDays = 7;
    switch (range) {
      case "month":// Clonar y establecer al inicio del mes
        const startMonth = justNow.clone().startOf('month');
        // Obtener timestamp
        start = startMonth.valueOf() / 1000;
        // Clonar y establecer al final del mes
        const endMonth = justNow.clone().endOf('month');
        // Obtener timestamp
        end = Math.trunc(endMonth.valueOf() / 1000);
        //total de días
        totalDays = endMonth.date();
        break;
      case 'week':
        const startWeek = justNow.clone().startOf('week');
        const fechaInicio = startWeek.format('YYYY-MM-DD');
        console.log('Inicio semana:', fechaInicio);
        // Obtener timestamp
        start = startWeek.valueOf() / 1000;
        // Clonar y establecer al final del mes
        const endWeek = justNow.clone().endOf('week');
        const fechaFin = endWeek.format('YYYY-MM-DD');
        console.log('Fin semana:', fechaFin);
        // Obtener timestamp
        end = Math.trunc(endWeek.valueOf() / 1000);
        break;
      case 'year': break;
    }
    let dataDays: { day: string | null, value: number | null }[] = [];
    for (let i = 1; i <= totalDays; i++) {
      dataDays.push({ day: totalDays === 7 ? justNow.isoWeekday(i).format('dd').toUpperCase() : "Día " + i, value: null });
    }
    let userRecords: any = await this.userService.getUserRecord({ key: "exercise_final_test", owner: this.userData.user.id, range: start + ".." + end });
    console.log(userRecords);
    let data: { [key: string]: { title: string, data: { day: string | null, value: number | null }[] } } = {};
    userRecords.userRecords.collection.forEach((record: any) => {
      if (!data[record.programPatient.id]) {
        data[record.programPatient.id] = { title: record.programPatient.program.title, data: [] };
        for (let i = 1; i <= totalDays; i++) {
          data[record.programPatient.id].data.push({ day: totalDays === 7 ? justNow.isoWeekday(i).format('dd').toUpperCase() : "Día " + i, value: null });
        }
      }

      switch (range) {
        case 'month':
          data[record.programPatient.id].data[moment(record.date * 1000).locale('es').date() - 1].value = type === "borg" ? record.value.borgScale : record.value.painScale;
          break;
        case 'week':
          let index = data[record.programPatient.id].data.findIndex(item => item.day === moment(record.date * 1000).locale('es').format('dd').toUpperCase());
          data[record.programPatient.id].data[index].value = type === "borg" ? record.value.borgScale : record.value.painScale;
          break;
        case 'year': break;
      }


    });

    return { data, dataDays };
  }
  async handleRefresh(event: any) {
    // this.clearData();
    // await this.loadActivities();
    // this.patient = await this.userService.getUserByIdSimple(this.userData.user.id);
    // await this.loadGraphicsInfoPain();
    // await this.loadGraphicsInfoBorg();
    event.target.complete();
  }
  clearData() {
    this.programs = [];
    this.today_program = [];
    this.today_exercises = [];
    this.today_tests = [];
    this.today_session_number = 0;
    this.processing = true;
    this.fisrtOpen = false;
    this.finished = 0;
    this.dayWeek = 0;
    this.counter = 0;
    this.finishedAct = 0;
    this.percent = 0;
    this.total = 0;
    this.todayFinishedAct = 0;
    this.totalAndProgressDay = {};
    this.initToday();
  }
  initToday() {
    let today = new Date().getDay();
    this.today = (today > 0) ? (today - 1) : 6;
    document.querySelector(`.hoy`)?.classList.remove('hoy');
    document.querySelector(`.about-me .day-${this.today}`)?.classList.add('hoy');
  }

  protected readonly Date = Date;
}
