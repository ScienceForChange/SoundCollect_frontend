export type PoseNetOutputStride = 32|16|8;
export type PoseNetArchitecture = 'ResNet50'|'MobileNetV1';
export type PoseNetDecodingMethod = 'single-person'|'multi-person';
export type PoseNetQuantBytes = 1|2|4;

export type MobileNetMultiplier = 0.50|0.75|1.0;

export declare type Vector2D = {
    y: number,
    x: number
};

export declare type Part = {
    heatmapX: number,
    heatmapY: number,
    id: number
};

export declare type PartWithScore = {
    score: number,
    part: Part
};

export declare type Keypoint = {
    score: number,
    x:number,
    y:number,
    name: string
};

export declare type Pose = {
    keypoints: Keypoint[],
    score: number,
};

export declare interface Padding {
    top: number;
    bottom: number;
    left: number;
    right: number;
}

export declare type InputResolution = number | {width: number, height: number};