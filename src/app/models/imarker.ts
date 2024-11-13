import { IIConSize } from './iiconsize';
import { ICoordinate } from "./icoordinate";
import { ITrack } from "./itrack";

export interface IMarker {
    markerId?: string;
    title: string;
    snippet: string;
    iconUrl?: string;
    iconSize?: IIConSize;
    coordinate: ICoordinate;
    track: ITrack
}