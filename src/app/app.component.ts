import { Component } from '@angular/core';
declare var faceapi: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'faceapi';

  video: any;
  public glassLeft: any;
  public glassTop: any;

  ngOnInit() {
    this.video = document.getElementsByTagName('video')[0];
    this.loadModels();
  }

  loadModels() {
    // load the models
    const MODEL_URL = '/assets/models/';

    Promise.all([
      faceapi.loadFaceLandmarkModel(MODEL_URL),
      faceapi.loadFaceRecognitionModel(MODEL_URL),
      faceapi.loadFaceExpressionModel(MODEL_URL),
      faceapi.loadMtcnnModel(MODEL_URL),
    ]).then(() => {
      console.log('models loaded!');
      this.videoFaceDetection((x: any, y: any) => {
        console.log(x, y);
        this.glassLeft = x;
        this.glassTop = y;
      });
    });
  }

  videoFaceDetection(callback: any) {
    let myNavigator = window.navigator as any;
    myNavigator.getUserMedia(
      { video: {} },
      (stream: any) => {
        this.video.srcObject = stream;
        this.video.addEventListener('play', () => {
          console.log('startet!');
          const canvas = faceapi.createCanvasFromMedia(this.video);
          document.body.append(canvas);

          const displaySize = {
            width: this.video.width,
            height: this.video.height,
          };
          faceapi.matchDimensions(canvas, displaySize);
          setInterval(async () => {
            const detections = await faceapi
              .detectSingleFace(this.video, new faceapi.MtcnnOptions())
              .withFaceLandmarks()
              .withFaceExpressions();

            //clearing the canvas to re-draw every time
            canvas
              ?.getContext('2d')
              ?.clearRect(0, 0, canvas.width, canvas.height);

            //check to see if there is a face!
            if (detections) {
              const resizedDetections = faceapi.resizeResults(
                detections,
                displaySize
              );
              faceapi.draw.drawDetections(canvas, resizedDetections);
              faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
              faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
              const landmarks = detections['landmarks'];
              const leftEye = landmarks.getLeftEye();
              const rightEye = landmarks.getRightEye();
              console.log('y ' + leftEye[0]['y']);
              console.log('x ' + leftEye[0]['x']);
              document.getElementsByTagName('img')[0].style.display = 'block';
              document.getElementsByTagName('img')[0].style.left =
                Math.round(leftEye[0]['x']) + 30 + 'px';
              document.getElementsByTagName('img')[0].style.top =
                Math.round(leftEye[0]['y']) + 10 + 'px';
              document.getElementsByTagName('img')[0].width =
                (rightEye[3]['x'] - leftEye[0]['x']) * 1.5;
            } else {
              document.getElementsByTagName('img')[0].style.display = 'none';
            }
          }, 400);
        });
      },
      (err: any) => console.error(err)
    );
  }
}
