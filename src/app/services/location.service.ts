import { Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { HttpClient } from "@angular/common/http";
import { Device } from '@capacitor/device';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  httpClient: HttpClient
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

}
