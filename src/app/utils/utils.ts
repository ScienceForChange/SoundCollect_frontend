/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */

import * as tf from '@tensorflow/tfjs-core';

import {connectedPartIndices} from './keypoints';
import { Keypoint} from '../models/pose-detection';

function eitherPointDoesntMeetConfidence(
    a: number, b: number, minConfidence: number): boolean {
    return (a < minConfidence || b < minConfidence);
}

export function getAdjacentKeyPoints(
    keypoints: Keypoint[], minConfidence: number): Keypoint[][] {
    return connectedPartIndices.reduce(
        (result: Keypoint[][], [leftJoint, rightJoint]): Keypoint[][] => {
            if (eitherPointDoesntMeetConfidence(
                keypoints[leftJoint].score, keypoints[rightJoint].score,
                minConfidence)) {
                return result;
            }

            result.push([keypoints[leftJoint], keypoints[rightJoint]]);

            return result;
        }, []);
}
