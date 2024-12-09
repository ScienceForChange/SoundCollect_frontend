/// <reference types="google.maps" />
import { CommonService } from 'src/app/services/common.service';
import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit, ViewChild, NgZone, ElementRef, OnDestroy, inject } from '@angular/core';
import { IonicModule, ModalController, Platform } from '@ionic/angular';
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
import { filter, Subscription, take } from 'rxjs';


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
    private authService = inject(AuthService);
    @ViewChild('map') public mapElement: ElementRef;
    public map: GoogleMap;
    public description: string = '';
    defaultLocation: google.maps.LatLngLiteral = { lat: 41.3870154, lng: 2.1700471 };
    initialPosition: any;
    modal: HTMLIonModalElement;
    observations: any[] = [];
    polylines: string[] = [];
    markers: string[] = [];
    platform = inject(Platform);

    isOpenBadgeModal = false;
    level = 0;
    canOpenModal = true;


    searchText = '';
    predictions: any[] = [];
    autocompleteService: any;
    placesService: any;

    mapType: MapType = MapType.Normal;
    observationType: 'all' | 'mine' = 'all';
    observationTypeShowed: 'all' | 'mine' = 'all';
    userId = ""
    constructor(
        private locationService: LocationService,
        private commonService: CommonService,
        private modalCtl: ModalController,
        private observationsService: ObservationsService,
        public zone: NgZone
    ) { }

    async ngOnInit() {
        this.userId = await this.authService.getUserId() || '';
        await this.locationService.requestLocationAndGetPosition();
        await this.getUserLocationAndCreateMap();
        this.locationService.positionWhenPermissionAccept$
            .pipe(
                filter((position) => position !== null), // Ignorar valores null
                take(1) // Solo escuchar el primer valor válido
            )
            .subscribe((position) => {
                if (position) {
                    this.map.setCamera({
                        coordinate: position,
                        animate: true
                    });                
                }
            });
        this.initAutocomplete();
    }

    async ionViewWillEnter() {
        this.userService.notificationGaming && await this.checkIsNewBadge();
        this.userService.notificationGaming = false;
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
                mapTypeId: 'Normal',
                zoomControl:false,
                streetViewControl:false,
                fullscreenControl:false,
                mapTypeControl:false,
                rotateControl:false,
                scaleControl:false,
                clickableIcons:false,
                disableDefaultUI: true,
                controlSize: 1,
            },
        });
        await this.map.setMapType(MapType.Normal);
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
            await this.showDetails(polyline.tag ?? '');
        })
    }

    async getObservationsAndCreateMarkets() {
        try {
            this.observationTypeShowed = this.observationType;
            this.map.removeMarkers(this.markers);
            this.map.removePolylines(this.polylines);

            if (this.observations.length === 0) {
                let result = await this.observationsService.getMapObservations();
                if (result?.data) {
                    this.observations = result?.data;
                    console.log(result);
                }
            }
            let polylines: Polyline[] = [];
            let markers: Marker[] = [];
            this.observations.forEach((observacion: any) => {
                if ((this.observationType === 'mine' && this.userId === observacion.user_id) || this.observationType === 'all') {
                    if (observacion.segments.length > 0/*observacion.path && !observacion.path.includes('lon') && observacion.path.includes('lng')*/) {
                        observacion.segments.forEach((segment: any) => {
                            const path = [{ lat: +segment.start_latitude, lng: +segment.start_longitude }, { lat: +segment.end_latitude, lng: +segment.end_longitude }]
                            const polyline = this.createPolyline(path, observacion.id, segment.LAeq);
                            polylines.push(polyline);
                        });
                        const marker = this.createMarker(observacion.latitude, observacion.longitude, observacion.Leq);
                        markers.push(marker);
                    } else if (!observacion.path) {
                        const marker = this.createMarker(observacion.latitude, observacion.longitude, observacion.Leq);
                        markers.push(marker);
                    }
                }
            })
            this.markers = await this.map.addMarkers(markers);
            this.polylines = await this.map.addPolylines(polylines);

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
            iconUrl: this.getMarkerSVGColorByDBA(leq),
            iconOrigin: { x: 0, y: 0 },
            iconAnchor: { x: 11, y: 35 },
            iconSize: {
                width: 22,
                height: 35
            },
            //tintColor: this.getMarkerColorByDBA(leq)
        };
    }
    createPolyline(path: any, tag: string, leq: string): Polyline {
        const color = this.observationsService.getPolylineColorByDBA(leq)
        const lineSymbol = {
            path: "M 0,-1 0,1",
            strokeOpacity: 0,
            fillColor: color,
            scale: 0,
            fillOpacity: 0,
            strokeWeight: 4, // Ancho del borde
            strokeColor: color // Color del borde
        };
        return {
            path: path,
            strokeColor: color, 
            strokeWeight: 2, 
            strokeOpacity: 1, 
            clickable: true, 
            geodesic: true,
            tag: tag, 
            icons: [
                {
                    icon: { path: google.maps.SymbolPath.CIRCLE },
                    offset: "25px",
                    repeat: "25px",
                },
            ]
        }
    }
    getMarkerSVGColorByDBA(leq: string) {
        if (+leq < 40) {
            return 'assets/images/sonsCAT/markers/35.png';
        } else if (+leq < 45) {
            return 'assets/images/sonsCAT/markers/40.png';
        } else if (+leq < 50) {
            return 'assets/images/sonsCAT/markers/45.png';
        } else if (+leq < 55) {
            return 'assets/images/sonsCAT/markers/50.png';
        } else if (+leq < 60) {
            return 'assets/images/sonsCAT/markers/55.png';
        } else if (+leq < 65) {
            return 'assets/images/sonsCAT/markers/60.png';
        } else if (+leq < 70) {
            return 'assets/images/sonsCAT/markers/65.png';
        } else if (+leq < 75) {
            return 'assets/images/sonsCAT/markers/70.png';
        } else if (+leq < 80) {
            return 'assets/images/sonsCAT/markers/75.png';
        } else if (+leq < 85) {
            return 'assets/images/sonsCAT/markers/80.png';
        } else {
            return 'assets/images/sonsCAT/markers/85.png';
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
                    zoom: 16
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
        try {
            this.level = await this.userService.gamificationLevel();
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
        } catch (error) {
            console.log(error);
        }
    }
    async applyFilter() {
        await this.map.setMapType(this.mapType);
        this.observationType != this.observationTypeShowed && await this.getObservationsAndCreateMarkets();
    }
    async optionsPopoverDismiss() {
        const selectedMapType = await this.map.getMapType();
        if (selectedMapType != this.mapType) this.mapType = selectedMapType;
        if (this.observationType != this.observationTypeShowed) this.observationType = this.observationTypeShowed;
    }
}
