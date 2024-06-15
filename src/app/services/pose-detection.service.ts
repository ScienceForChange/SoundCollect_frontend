import {Injectable} from '@angular/core';
// @ts-ignore
import PoseExercise, {getExercisesList, exerciseResultFromRGBArray, exerciseResult, getAdjacentPairs} from '@oktics/oktics-health-pose';
import {BehaviorSubject} from "rxjs";

const scoreThreshold = 0.6;
@Injectable({
  providedIn: 'root'
})
export class PoseDetectionService {

  repetitionDetected: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  constructor() {
  }

  /**
   * return an array of Exercises
   */
  async getExercisesList(): Promise<PoseExercise[]> {
    return await getExercisesList();
  }

  /**
   * Predict the pose and check repetition of exercise from the video
   * @param selectedExerciseId
   * @param video
   * @param canvas
   */
  async predictPoseExercise(selectedExerciseId: number, video: HTMLVideoElement, canvas: HTMLCanvasElement): Promise<void> {
    const {detector, params} = await this.initDetector(selectedExerciseId);
    const ratio = canvas.width / canvas.height;
    const ctx = canvas.getContext('2d')!;
    video.addEventListener('timeupdate', async () => {
      // get the result of detection
      const result = await exerciseResult(await detector, await params, video);
      // Set the repetition detected
      if ('repetitions' in result){
        this.repetitionDetected.next(result.repetitions);
      }
      // Draw the detection
      if ('keypoints' in result){
        PoseDetectionService.drawFrame(video, ctx, result.keypoints, canvas.width, canvas.width / ratio);
      }
    });
  }

  /**
   * Init the exercise detector
   * @param selectedExerciseId
   * @private
   */
  private async initDetector(selectedExerciseId: number): Promise<any> {
    return new PoseExercise(selectedExerciseId);
  }

  /**
   * Method for draw the points and skeleton in canvas
   * @param video
   * @param ctx
   * @param keypoint
   * @param width
   * @param height
   */
  private static drawFrame(video: HTMLVideoElement, ctx: CanvasRenderingContext2D, keypoint: [], width: number, height: number): void {
    if (video.paused || video.ended) {
      return;
    }
    ctx.save();
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(video, 0, 0, width, height);
    // Se dibuja el resultado de los puntos que han sido detectados
    PoseDetectionService.drawKeypoints(ctx, keypoint);
    // Se dibuja el skeleton entre los puntos detectados
    PoseDetectionService.drawSkeleton(ctx, keypoint);
  }

  /**
   * Method for paint a point of detection in canvas
   * @param ctx
   * @param keypoint
   */
  private static drawKeypoint(ctx:CanvasRenderingContext2D, keypoint:any): void {
    const radius = 7;
    if (keypoint.score >= scoreThreshold) {
      const circle = new Path2D();
      circle.arc(keypoint.x, keypoint.y, radius, 0, 2 * Math.PI);
      ctx.fill(circle);
      ctx.stroke(circle);
    }
  }

  /**
   * Method for draw the point of the detection mask
   * @param ctx
   * @param keypoints
   */
  private static drawKeypoints(ctx: CanvasRenderingContext2D, keypoints: []): void {
    ctx.fillStyle = 'red';
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 3;
    for(let i=0; i<keypoints.length; i++) {
      PoseDetectionService.drawKeypoint(ctx, keypoints[i]);
    }
  }

  /**
   * Method for draw the skeleton of detection mask
   * @param ctx
   * @param keypoints
   */
  private static drawSkeleton(ctx: CanvasRenderingContext2D, keypoints: []): void {
    const color = "#fff";
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    getAdjacentPairs
      // @ts-ignore
      .forEach(([i, j]) => {
        const kp1 = keypoints[i];
        const kp2 = keypoints[j];
        // @ts-ignore
        if (kp1.score >= scoreThreshold && kp2.score >= scoreThreshold) {
          ctx.beginPath();
          // @ts-ignore
          ctx.moveTo(kp1.x, kp1.y);
          // @ts-ignore
          ctx.lineTo(kp2.x, kp2.y);
          ctx.stroke();
        }
      });
  }
}
