import { Injectable, inject } from '@angular/core';
import { MediaRepoHttp } from '../repos/media-repo-http';

@Injectable({
  providedIn: 'root'
})
export class MediaService {
  mediaHTTP: MediaRepoHttp = inject(MediaRepoHttp);
  constructor() { }
  async sendMedia(blob: Blob) {
    console.log("Enviar media");
    console.log(blob);
    try {
      const filename = "video." + (blob.type === "video/webm" ? "webm" : "mp4");
      console.log("Filename: " + filename);

      const formData = new FormData();
      formData.append('file', blob, filename);
      const response = await this.mediaHTTP.sendMedia(formData);
      if (response) {
        //console.log(response);
        return response;
      }
    } catch (e: any) {
      console.error(e);
      throw new Error("Error: " + e);
    }

  }
  /*async sendMedias(blobs: { [key: string]: Blob }) {
    try {
      let mediaSended: { exerciceId: string, mediaUrl: string }[] = [];
      for (let blob in blobs) {
        const formData = new FormData();
        formData.append('file', blobs[blob], 'video.webm');
        const response = await this.mediaHTTP.sendMedia(formData);
        console.log("Response: ", response);
      }
      return mediaSended;
    } catch (e: any) {
      console.error(e);
      throw new Error("Error: " + e);
    }

  }*/
}
