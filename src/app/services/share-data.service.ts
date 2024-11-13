import { Injectable } from '@angular/core';
import { UserCreate } from '../models/iuser';

@Injectable({
    providedIn: 'root'
})
export class DataService {
    datosCompartidos: UserCreate;

    constructor() { }
}
