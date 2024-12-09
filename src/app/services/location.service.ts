import { Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { HttpClient } from "@angular/common/http";
import { Device } from '@capacitor/device';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  httpClient: HttpClient

  public positionWhenPermissionAccept$ = new BehaviorSubject<google.maps.LatLngLiteral  | null>(null);

  constructor(
  ) { }

  async getCoordinates() {
    const deviceInfo=await Device.getInfo();
    const options = (deviceInfo.platform==='android' && +deviceInfo.osVersion < 13) ? {} : { enableHighAccuracy: true };
    return await Geolocation.getCurrentPosition(options);
  }

  checkAppPermissions = async () => {
    const permissions = await Geolocation.checkPermissions();
    console.log('checkAppPermissions2222222', permissions);
    if (permissions.location === 'granted') {
      console.log("you have both ACCESS_COARSE_LOCATION and ACCESS_FINE_LOCATION permissions!");
      return true;
    } else if (permissions.coarseLocation === 'granted') {
      console.log("you have ACCESS_COARSE_LOCATION permission only!");
      return true;
    } else {
      console.log("you don't have any permission!")
      return false;
    }
  }

  async requestAppPermissions() {
    try {
      const permissions = await Geolocation.requestPermissions();
      console.log('requestAppPermissions', permissions)
      if (permissions.location !== 'granted') {
        await Geolocation.requestPermissions();
      }
    } catch (error) {
      console.error('Error requesting permissions', error)
    }
  }

  async requestLocationAndGetPosition(): Promise<void> {
    try {
      // Solicitar permisos
      const permissions = await Geolocation.requestPermissions();
      if (permissions.location === 'granted') {
        const position = await Geolocation.getCurrentPosition();
        this.positionWhenPermissionAccept$.next({lat: position.coords.latitude, lng: position.coords.longitude});
      } else {
        throw new Error('Permiso de geolocalización no concedido');
      }
      const position = await Geolocation.getCurrentPosition();
    } catch (error) {
      console.error('Error al obtener la posición:', error);
      this.positionWhenPermissionAccept$.next(null);
    }
  }

}
