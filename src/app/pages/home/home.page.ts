import { CommonService } from 'src/app/services/common.service';
import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit, ViewChild, NgZone, ElementRef, OnDestroy, inject } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { CronometroComponent } from '../../components/cronometro/cronometro.component';
import { RouterLink } from "@angular/router";
import { AuthService } from '../../services';
import { HttpClient } from '@angular/common/http';
import { AuthHTTP } from '../../repos';
import { ComponentsModule } from '../../pipes/components.module';
import { TranslateModule } from '@ngx-translate/core';
import { SlicePipe } from "@angular/common";
import { GoogleMap, Marker, Polyline, MapType } from '@capacitor/google-maps';
import { environment } from 'src/environments/environment';
import { LocationService } from '../../services/location.service';
import { PopUpPage } from 'src/app/components/pop-up/pop-up.component';
import { ObservationsService } from 'src/app/services/observations.service';
import { ObservationsRepoHttp } from 'src/app/repos/observations-repo-http';
import { ObservationDetailsPage } from "../observation-details/observation-details.page";
import { UserService } from 'src/app/services/user-service';
import { UserHTTP } from 'src/app/repos/user-repo-http';
import { FormsModule } from "@angular/forms";

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
        PopUpPage,
        FormsModule
    ],
    providers: [
        HttpClient,
        AuthService,
        AuthHTTP,
        LocationService,
        ObservationsRepoHttp,
        ObservationsService,
        UserService, UserHTTP
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomePage implements OnInit, OnDestroy {

    private userService = inject(UserService);
    @ViewChild('map') public mapElement: ElementRef;
    public map: GoogleMap;
    public description: string = '';
    defaultLocation: google.maps.LatLngLiteral = { lat: 41.3870154, lng: 2.1700471 };
    initialPosition: any;
    modal: HTMLIonModalElement;
    observations: any[];

    isOpenBadgeModal = false;
    level = 1;
    canOpenModal = true;


    searchText = '';
    predictions: any[] = [];
    autocompleteService: any;
    placesService: any;
    constructor(
        private locationService: LocationService,
        private commonService: CommonService,
        private modalCtl: ModalController,
        private observationsService: ObservationsService,
        public zone: NgZone,
    ) {

    }

    async ngOnInit() {
        await this.locationService.requestAppPermissions();
        await this.getUserLocationAndCreateMap();
        this.initAutocomplete();
    }

    async ionViewWillEnter() {
        await this.checkIsNewBadge();
    }

    async ngOnDestroy() {
        await this.map.removeAllMapListeners();
    }

    initAutocomplete() {
        this.autocompleteService = new google.maps.places.AutocompleteService();
        // Crear un div temporal para inicializar el PlacesService
        const dummyDiv = document.createElement('div');
        this.placesService = new google.maps.places.PlacesService(dummyDiv);

    }
    async getUserLocationAndCreateMap() {
        try {
            await this.commonService.showLoader();
            if (await this.locationService.checkAppPermissions()) {
                const position = await this.locationService.getCoordinates();
                const userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                this.initialPosition = userLocation;
                await this.createMap(userLocation);
            } else {
                // Si no se otorgan los permisos, utilizar la ubicación predeterminada
                this.initialPosition = this.defaultLocation;
                await this.createMap(this.defaultLocation);
            }
            await this.commonService.hideLoader();
        } catch (error) {
            await this.createMap(this.defaultLocation);
            await this.commonService.hideLoader();
        }
    }
    private async createMap(userLocation: any): Promise<void> {
        this.map = await GoogleMap.create({
            id: 'map',
            element: this.mapElement.nativeElement,
            apiKey: environment.keys.googleMaps,
            forceCreate: true,
            config: {
                center: userLocation,
                zoom: 14,
                mapTypeId: 'satellite'
            },
        });
        await this.map.setMapType(MapType.Satellite);
        await this.map.setCamera({
            coordinate: userLocation,
            animate: true
        });
        await this.getObservationsAndCreateMarkets();
        await this.map.enableCurrentLocation(true);
        //await this.map.enableClustering(3);
        await this.map.setOnMarkerClickListener(async (marker) => {
            const result = this.observations.find(obj => obj?.latitude === marker.latitude.toString() && obj?.longitude === marker.longitude.toString());
            await this.showDetails(result.id);
        });
        await this.map.setOnPolylineClickListener(async (polyline) => {
            console.log(polyline);
            await this.showDetails(polyline.tag ?? '');
        })
    }

    async getObservationsAndCreateMarkets() {
        try {
            let result = await this.observationsService.getMapObservations();
            if (result?.data) {
                this.observations = result?.data;
                console.log(this.observations);
                let polylines: Polyline[] = [];
                let markers: Marker[] = [];
                result.data.forEach((observacion: any) => {
                    if (observacion.path && !observacion.path.includes('lon') && observacion.path.includes('lng')) {
                        let path = JSON.parse(observacion.path);
                        console.log(observacion);
                        //if (path.length > 1) {
                        console.log(path);
                        const polyline = this.createPolyline(path, observacion.id, observacion.Leq);
                        polylines.push(polyline);
                        //} else {
                        const marker = this.createMarker(observacion.latitude, observacion.longitude, observacion.Leq);
                        console.log(marker);

                        markers.push(marker);
                        //}
                    } else {
                        const marker = this.createMarker(observacion.latitude, observacion.longitude, observacion.Leq);
                        markers.push(marker);
                    }
                })
                await this.map.addMarkers(markers);
                await this.map.addPolylines(polylines);
            }
        } catch (error) {
            console.log(error);
        }
    }
    createMarker(lat: string, lng: string, leq: string): Marker {
        return {
            coordinate: {
                lat: parseFloat(lat),
                lng: parseFloat(lng)
            },
            iconSize: {
                width: 30,
                height: 30
            },
            tintColor: this.getMarkerColorByDBA(leq)
        };
    }
    createPolyline(path: any, tag: string, leq: string): Polyline {
        return {
            path: path,
            strokeColor: this.getPolylineColorByDBA(leq),
            strokeWeight: 13, clickable: true, geodesic: true, tag: tag
        }
    }
    getPolylineColorByDBA(leq: string) {
        if (+leq < 40) {
            return '#d9f2d0';
        } else if (+leq < 45) {
            return '#92d050';
        } else if (+leq < 50) {
            return '#4ea72e';
        } else if (+leq < 55) {
            return '#ffff00';
        } else if (+leq < 60) {
            return '#ffc000';
        } else if (+leq < 65) {
            return '#f2aa84';
        } else if (+leq < 70) {
            return '#ff0000';
        } else if (+leq < 75) {
            return '#c00000';
        } else if (+leq < 80) {
            return '#7030a0';
        } else if (+leq < 85) {
            return '#0f9ed5';
        } else {
            return '#215f9a';
        }
    }
    getMarkerColorByDBA(leq: string) {
        if (+leq < 40) {
            return { r: 217, g: 242, b: 208, a: 255 };
        } else if (+leq < 45) {
            return { r: 146, g: 208, b: 80, a: 255 };
        } else if (+leq < 50) {
            return { r: 78, g: 167, b: 46, a: 255 };
        } else if (+leq < 55) {
            return { r: 255, g: 255, b: 0, a: 255 };
        } else if (+leq < 60) {
            return { r: 255, g: 192, b: 0, a: 255 };
        } else if (+leq < 65) {
            return { r: 242, g: 170, b: 132, a: 255 };
        } else if (+leq < 70) {
            return { r: 255, g: 0, b: 0, a: 255 };
        } else if (+leq < 75) {
            return { r: 192, g: 0, b: 0, a: 255 };
        } else if (+leq < 80) {
            return { r: 112, g: 48, b: 160, a: 255 };
        } else if (+leq < 85) {
            return { r: 15, g: 158, b: 213, a: 255 };
        } else {
            return { r: 33, g: 95, b: 154, a: 255 };
        }
    }

    async showDetails(observationId: string) {
        this.modal = await this.modalCtl.create({
            component: ObservationDetailsPage,
            cssClass: 'full-size-modal',
            componentProps: {
                state: { id: observationId }
            },
        });
        if (!this.modal.isOpen && this.canOpenModal) {
            this.canOpenModal = false;
            await this.modal.present();
        }
        const { data } = await this.modal.onWillDismiss();
        if (data === 'closed') {
            this.canOpenModal = true;
        }
    }
    async searchLocations() {
        if (this.searchText && this.searchText.length > 2) {
            await this.autocompleteService.getPlacePredictions({ input: this.searchText }, (predictions: any[], status: google.maps.places.PlacesServiceStatus) => {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    this.predictions = predictions;
                }
            });
        } else {
            this.predictions = [];
        }
    }

    async selectPlace(place: any) {
        console.log('selected itemmmmm', place);
        this.searchText = place.description;
        this.predictions = [];
        // @ts-ignore
        await this.placesService.getDetails({ placeId: place.place_id }, (result, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                this.map.setCamera({
                    coordinate: {
                        lat: result.geometry.location.lat(),
                        lng: result.geometry.location.lng()
                    },
                    animate: true,
                    zoom: 13
                });
            }
        });
    }

    async clearSearch() {
        this.searchText = '';
        this.predictions = [];
        await this.map.setCamera({
            coordinate: this.initialPosition,
            animate: true,
            zoom: 14
        });
    }

    async checkIsNewBadge() {
        this.level = await this.userService.gamificationLevel();
        console.log(this.level);
        const badgesString = await this.commonService.getItem('badges');
        if (badgesString) {
            let badges = JSON.parse(badgesString);
            if (!badges.includes(this.level)) {
                this.isOpenBadgeModal = true;
                badges.push(this.level);
                await this.commonService.setItem('badges', JSON.stringify(badges));
            }
        } else {
            this.isOpenBadgeModal = true;
            await this.commonService.setItem('badges', JSON.stringify([this.level]));
        }
    }
}
