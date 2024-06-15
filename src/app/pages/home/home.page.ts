import { CommonService } from 'src/app/services/common.service';
import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit, ViewChild, inject, ElementRef, OnDestroy } from '@angular/core';
import { AlertController, IonicModule, IonModal, NavController, ToastController, Platform, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { CronometroComponent } from '../../components/cronometro/cronometro.component';
import { RouterLink } from "@angular/router";
import { AuthService } from '../../services';
import { HttpClient } from '@angular/common/http';
import { AuthHTTP } from '../../repos';
import { ComponentsModule } from '../../pipes/components.module';
import { TranslateModule } from '@ngx-translate/core';
import { SlicePipe } from "@angular/common";

import { GoogleMap, Marker } from '@capacitor/google-maps';
import { environment } from 'src/environments/environment';
import { LocationService } from '../../services/location.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { PopUpPage } from 'src/app/components/pop-up/pop-up.component';
import { IMarker } from 'src/app/models/imarker';
import { ObservationsService } from 'src/app/services/observations.service';
import { ObservationsRepoHttp } from 'src/app/repos/observations-repo-http';
import {ObservationDetailsPage} from "../observation-details/observation-details.page";

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
    standalone: true,
    imports: [
        IonicModule,
        CommonModule,
        CronometroComponent,
        RouterLink,
        ComponentsModule,
        TranslateModule,
        SlicePipe,
        PopUpPage
    ],
    providers: [
        HttpClient,
        AuthService,
        AuthHTTP,
        Geolocation,
        NativeGeocoder,
        AndroidPermissions,
        LocationService,
        ObservationsRepoHttp,
        ObservationsService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomePage implements OnInit, OnDestroy {

    @ViewChild('map') public mapEl: ElementRef<HTMLElement>;

    public map: GoogleMap;
    public description: string = '';
    private current_lng = 2.1589900;
    private current_lat = 41.3887900;
    markers: Marker[] = [];
    modal: HTMLIonModalElement;

    constructor(
        private locationService: LocationService,
        private commonService: CommonService,
        private modalCtl: ModalController,
        private observationsService: ObservationsService,
    ) { }

    async ngOnInit() {
        await this.getUserLocationAndInitMaps();
    }

    async getObservationsAndCreateMarkets() {
        await this.commonService.showLoader();
        try {
          let result = await this.observationsService.getMapObservations();
            if (result?.data) {
                await result?.data.map((observacion: any) => {
                    const marker: Marker = {
                        coordinate: {
                            lat: parseFloat(observacion?.latitude),
                            lng: parseFloat(observacion?.longitude)
                        },
                        title: observacion?.id,
                        snippet: `ID: ${observacion?.id}`,
                        iconSize: {
                            width: 35,
                            height: 35
                        },
                    };
                  //this.map.addMarker(marker);
                  this.markers.push(marker);
                })
                await this.map.addMarkers(this.markers);
                await this.commonService.hideLoader();
            }
        } catch (error) {
            console.log(error);
            await this.commonService.hideLoader();
        } finally {
            await this.commonService.hideLoader();
        }
    }
    async ngOnDestroy() {
        // await this.map.removeAllMapListeners();
        // await this.map.destroy();
    }

    async getUserLocationAndInitMaps() {
        await this.commonService.showLoader();
        const coordinates = await this.locationService.getCoordinates();
        if (!coordinates) {
            await this.commonService.hideLoader();
            return;
        }
        this.current_lat = coordinates.coords.latitude;
        this.current_lng = coordinates.coords.longitude;
        await this.createMap();
        await this.commonService.hideLoader();
    }

    private async createMap(): Promise<void> {
        this.map = await GoogleMap.create({
            id: 'google-map',
            element: this.mapEl.nativeElement,
            apiKey: environment.keys.googleMaps,
            forceCreate: true,
            config: {
                center: {
                    lat: this.current_lat,
                    lng: this.current_lng
                },
                zoom: 14
            }
        });

        await this.map.setCamera({
            coordinate: {
                lat: this.current_lat,
                lng: this.current_lng
            },
            animate: true
        });

        await this.getObservationsAndCreateMarkets();

        await this.map.enableCurrentLocation(true);
        await this.map.enableClustering(3);
        await this.map.setOnMarkerClickListener(async (marker) => {
            // await this.navCtrl.navigateForward('observation-details', {
            //   state: {id: marker.title}
            // });
          this.modal = await this.modalCtl.create({
            component: ObservationDetailsPage,
            cssClass: 'full-size-modal',
            componentProps: {
              state: {id: marker.title}
            },
          });

          if (!this.modal.isOpen) {
            await this.modal.present();
          }
        });
    }

}
