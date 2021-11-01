import { ChangeDetectorRef, Component } from '@angular/core';
declare var faceapi: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public video: any;
  public glassesLeft: number;
  public glassesTop: number;
  public glassesWidth: number;
  public faceDetected: boolean = false;
  public drawFaceLandmarks: boolean = true;
  public drawFaceExpressions: boolean = true;
  public drawDetections: boolean = true;

  //TODO: adding joint!
  // public showJoint: boolean = true;

  constructor(private changeDetaction: ChangeDetectorRef) {}

  ngOnInit() {
    //checking to make sure we are in a browser!
    if (window && document) {
      this.video = document.getElementsByTagName('video')[0];
    }
    this.loadModels();
  }

  loadModels() {
    const modelsUrl = '/assets/models/';
    // loading the models
    Promise.all([
      faceapi.loadFaceLandmarkModel(modelsUrl),
      faceapi.loadFaceRecognitionModel(modelsUrl),
      faceapi.loadFaceExpressionModel(modelsUrl),
      faceapi.loadMtcnnModel(modelsUrl),
    ]).then(() => {
      //models loaded!
      this.videoFaceDetection();
    });
  }

  videoFaceDetection() {
    let myNavigator = window.navigator as any;
    myNavigator.getUserMedia(
      { video: {} },
      (stream: any) => {
        this.video.srcObject = stream;
        this.video.addEventListener('play', () => {
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

            //checking to see if there is a face!
            if (detections) {
              const resizedDetections = faceapi.resizeResults(
                detections,
                displaySize
              );
              if (this.drawDetections) {
                faceapi.draw.drawDetections(canvas, resizedDetections);
              }
              if (this.drawFaceLandmarks) {
                faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
              }
              if (this.drawFaceExpressions) {
                faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
              }
              const landmarks = detections['landmarks'];
              const leftEye = landmarks.getLeftEye();
              const rightEye = landmarks.getRightEye();
              this.changeDetaction.detectChanges();
              this.faceDetected = true;
              this.glassesLeft = Math.round(leftEye[0]['x']) + 30;
              this.glassesTop = Math.round(leftEye[0]['y']) + 10;
              this.glassesWidth = (rightEye[3]['x'] - leftEye[0]['x']) * 1.4;
            } else {
              this.faceDetected = false;
              this.changeDetaction.detectChanges();
            }
          }, 100);
        });
      },
      (err: any) => console.error(err)
    );
  }

  toggleFaceLandmarks() {
    this.drawFaceLandmarks = !this.drawFaceLandmarks;
  }

  toggleFaceExpressions() {
    this.drawFaceExpressions = !this.drawFaceExpressions;
  }

  toggleFaceDetections() {
    this.drawDetections = !this.drawDetections;
  }
}
