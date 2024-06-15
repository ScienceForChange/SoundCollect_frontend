import { inject, Injectable } from '@angular/core';
import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs';
import * as tfc from '@tensorflow/tfjs-core';
// Register one of the TF.js backends.
import * as webgl from '@tensorflow/tfjs-backend-webgl';
import { Keypoint, Pose } from "../models/pose-detection";
import { getAdjacentKeyPoints } from "../utils/utils";
import { Platform } from "@ionic/angular";
import { Camera } from "@capacitor/camera";
import { WebcamIterator } from "@tensorflow/tfjs-data/dist/iterators/webcam_iterator";
import { CommonService } from './common.service';

const pointcolor = "#FFFFFF";
const linecolor = "#E86338";
const lineWidth = 4;
const radio = 5;

@Injectable({
    providedIn: 'root'
})
export class TensorflowService {
    cam: WebcamIterator | null = null;
    canvas: HTMLCanvasElement | null = null
    private platform: Platform = inject(Platform);
    private detector: poseDetection.PoseDetector;
    recorder: MediaRecorder;
    recordedVideos: { [key: string]: Blob } = {};
    url = "";
    size = 0;
    videoKeypoints: poseDetection.Pose[] = [];
    private common = inject(CommonService);

    constructor() {

    }

    ngOnDestroy() {
        this.clearRecordedVideos();
        this.stopWebcam();
    }

    /*
    *Precargar el detector
    */
    async preLoadDetector() {
        //this.canvas = document.getElementById(canvasId) as HTMLCanvasElement | null;
        const canvas = document.createElement("canvas");
        if (canvas && !this.detector) {
            if (this.platform.is('ios')) {
                //Utilizar WebGL v1
                const gl = canvas.getContext("webgl");
                if (gl) {
                    gl.clearColor(0.0, 0.0, 0.0, 1.0);
                    webgl.setWebGLContext(1, gl);
                }
            }

            await tfc.setBackend('webgl');
            //Detection Model
            const detectorConfig = {
                modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
                modelUrl: "assets/singlepose-model/model.json"
            };
            this.detector = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, detectorConfig);
            const img = document.createElement("img");
            img.width = 2;
            img.height = 2;
            await this.detector.estimatePoses(img);
            console.log("Detector Loaded");
        }
    }

    /*
     * Parar la detección
     */
    stopWebcam() {
        //clear cam
        if (this.cam) {
            this.cam.stop();
            this.cam = null;
        }
        //clear canvas
        if (this.canvas) {
            this.canvas.width = 0;
        }
        if (this.recorder !== undefined && this.recorder.state !== "inactive")
            this.recorder.stop();
        console.log("Stop");
    }

    getRecordedVideo(exerciseId: string) {
        return this.recordedVideos[exerciseId];
    }

    getRecordedVideos() {
        return this.recordedVideos;
    }

    getUrl() {
        return this.url;
    }

    getSize() {
        return this.size;
    }

    getVideoKeypointsStringify() {
        return JSON.stringify(this.videoKeypoints);
    }

    clearRecordedVideos() {
        this.recordedVideos = {};
        URL.revokeObjectURL(this.url);
        this.url = "";
        this.videoKeypoints = [];
    }

    /*
    * Comienza a grabar desde la camara y hace la detección
    */
    async poseDetection(exerciseId: string, videoId = "pd-video", canvasId = "pd-canvas", loadingId = "pd-loading", buttonId = "training-next-button") {
        try {
            console.log("Ëjercicio: ", exerciseId);
            const loading = document.getElementById(loadingId) as HTMLElement | null;
            const button = document.getElementById(buttonId) as HTMLButtonElement;
            button.disabled = true;
            loading?.classList.add("loading-flex");
            //Comprueba que no se esté ejecutando ya el intevalo
            if (!this.cam) {
                //se obtiene el elemento video
                const video = document.getElementById(videoId) as HTMLVideoElement | null;
                //se obtiene el elemento canvas
                this.canvas = document.getElementById(canvasId) as HTMLCanvasElement | null;
                //se comprueba que existan los elementos
                if (video && this.canvas) {

                    const width = 360;
                    const height = 480;

                    //Camera permission and start record
                    if (!this.platform.is('mobileweb')) {
                        await Camera.requestPermissions();
                        video.height = width;
                        video.width = height;
                    }
                    if (!this.detector) {
                        await this.preLoadDetector();
                        console.log("No detector");
                    }
                    this.cam = await tf.data.webcam(video, { facingMode: "user" });
                    button.disabled = false;
                    loading?.classList.remove("loading-flex");
                    //canvas dimensions
                    this.canvas.width = width;
                    this.canvas.height = height;

                    //contexto 2d del canvas para pintar en él
                    const ctx = this.canvas.getContext('2d');

                    //intervalo de tección
                    const fps = 30;

                    /*Start Record Functions */
                    //@ts-ignore
                    //const stream = video.captureStream(30);
                    const stream = this.canvas.captureStream(30);
                    const options = {
                        mimeType: this.platform.is('ios')?"video/mp4;codecs=avc1":"video/webm;codecs=vp8",
                    };
                    this.recorder = new MediaRecorder(stream, options);
                    let blobs: Blob[] = [];

                    this.recorder.ondataavailable = function (event) {
                        blobs.push(event.data);
                    };

                    this.recorder.onstop = () => {

                        const blob = new Blob(blobs, { type: this.platform.is('ios')?"video/mp4":"video/webm" });
                        //let url = URL.createObjectURL(blob);
                        this.recordedVideos[exerciseId] = blob;
                        //this.url = url;
                        //this.size = blob.size;
                        console.log("Blob size: ", blob.size);

                        /*formData.append('file', blob, 'video.webm');
                        var link = document.createElement('a');
                        link.download = 'video.webm';
                        link.href = URL.createObjectURL(blob);*/
                        //link.click();
                        //let result = lastValueFrom(this.http.post<any>(`${environment.serverURL}/api/multimedia`, formData));

                        //console.log(result);
                    };
                    /* End Record Functions */
                    let firstExe = true;
                    const detectInterval = setInterval(async () => {
                        if (!this.cam || !ctx) {
                            clearInterval(detectInterval);
                            console.log("Stop record ---------------------------------");
                            //recorder.stop();
                            return;
                        }
                        if (video.readyState >= 2) {
                            //parar la detección
                            ctx.clearRect(0, 0, width, height);
                            ctx.drawImage(video, 0, 0, width, height);
                            // Obtener datos de la imagen del canvas
                            //const imageData = ctx.getImageData(0, 0, width, height);
                            const poses = await this.detector.estimatePoses(video);
                            if (poses[0]) {
                                this.drawCanvas(poses[0], ctx);
                                this.videoKeypoints.push(poses[0]);
                            } else {
                                this.videoKeypoints.push({ keypoints: [], score: 0 });
                            }
                            if (firstExe) {
                                console.log("Start record ---------------------------------");
                                this.recorder.start();
                                firstExe = false;
                            }

                        }

                    }, 1000 / fps);
                } else {
                    console.log("No hay elemento de video o canvas con el id proporcionado.");
                }
            } else {
                console.log("Ya se está ejecutando la detección.");
            }
        } catch (e: any) {
            console.log(e);

            this.common.presentToast("Error", "Ups! Ocurrió un error, intente nuevamente ", "danger");
        }
    }

    drawCanvas(pose: any, ctx: CanvasRenderingContext2D) {
        this.drawKeypoints(pose["keypoints"], 0.5, ctx);
        this.drawSkeleton(pose["keypoints"], 0.5, ctx);
    }

    drawKeypoints(keypoints: any, minConfidence: number, ctx: CanvasRenderingContext2D, scale = 1) {
        for (let i = 0; i < keypoints.length; i++) {
            const keypoint = keypoints[i];

            if (keypoint.score < minConfidence) {
                continue;
            }

            const { y, x } = keypoint;
            this.drawPoint(ctx, y * scale, x * scale, radio, pointcolor);
        }
    }

    drawPoint(ctx: CanvasRenderingContext2D, y: number, x: number, r: number, color: string) {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.strokeStyle = linecolor;
        ctx.lineWidth = 2
        ctx.fill();
        ctx.stroke();
    }

    drawSkeleton(keypoints: Keypoint[], minConfidence: number, ctx: CanvasRenderingContext2D, scale = 1) {
        const adjacentKeyPoints = getAdjacentKeyPoints(
            keypoints,
            minConfidence
        );
        //console.log("Adj: ", adjacentKeyPoints)
        adjacentKeyPoints.forEach((keypoint) => {
            this.drawSegment(
                keypoint[0].y,
                keypoint[0].x,
                keypoint[1].y,
                keypoint[1].x,
                linecolor,
                scale,
                ctx
            );
        });
    }

    drawSegment(ay: number, ax: number, by: number, bx: number, color: string, scale: number, ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.moveTo(ax * scale, ay * scale);
        ctx.lineTo(bx * scale, by * scale);
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = color;
        ctx.stroke();
    }

    toTuple(keypoint: Keypoint) {
        return [keypoint.y, keypoint.x];
    }
}
