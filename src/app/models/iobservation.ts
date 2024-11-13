export interface IObservationOld {
  audio_param_1?: string;
  audio_param_2?: string;
  audio_param_3?: string;
  audio_param_4?: string;
  sound_type?: string;
  sound_source?: string;
  sound_perception_enviroment?: string;
  comments?: string;
  images?: Array<string>;
  created_at?: string;
}

export interface IObservation {
  Leq?: number;
  LAeqT?: number[];
  LAmax?: number;
  LAmin?: number;
  L90?: number;
  L10?: number;
  sharpness_S?: number;
  loudness_N?: number;
  roughtness_R?: number;
  fluctuation_strength_F?: number;
  images: any[] | undefined;
  latitude: any;
  longitude: any;
  sound_types: number[]
  quiet: string;
  cleanliness: string;
  accessibility: string;
  safety: string;
  influence: string;
  landmark: string;
  protection: string;
  pleasant: string;
  chaotic: string;
  vibrant: string;
  uneventful: string;
  calm: string;
  annoying: string;
  eventful: string;
  monotonous: string;
  overall: string;
  exp_acoustic?: { [key: string]: string };//{pleasant:string,chaotic:string,vibrant:string,uneventful:string,calm:string,annoying:string,eventful:string,monotonous:string};
  exp_current?: string;
  path: string;
  segments: any[];
}
