 export interface ICondensedPatient {
    date: number;
    items: IActivity[];
}
 export interface IActivity {
    activityProgramPatientIri: string;
    activityProgramIri: string;
    activityProgramTitle: string;
    activityIri: string;
    activityTitle: string;
    activityTematicCategoryId: string;
    activityTematicCategoryTitle: string;
    activityDesc: string;
    activityType: string;
    isFinished: boolean;
    activityUrl?: string;
    activityFileType?: string;
    exerciseRepetitions?: number;
    exerciseSeries?: number;
    exerciseYoutubeLink?: string;
    exerciseVideoUrl?:string;
    date?: number;
}