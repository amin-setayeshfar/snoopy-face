# SNOOPY FACE 😎

This is a simple face recognition angular application to test the [FaceAPI](https://www.npmjs.com/package/@vladmandic/face-api) with the help of [TensorFlow.js](https://www.npmjs.com/package/@tensorflow/tfjs) which is an open-source hardware-accelerated JavaScript library for training and deploying machine learning models.

In this project I use a pre-trained FaceAPI model `mtcnn` which generously provides methods like `detectSingleFace`, `withFaceLandmarks`, `withFaceExpressions` to handle face detection in the easiest way possible; It even gives us the coordinates of different points for each face part.

so I calculate the (almost) proper eyes locations in the camera live stream and add Snoop Dogg meme sunglasses to the face. by default, you can see the face area, face landmarks and impressions and you can toggle them to see only yourself in the famous glasses B-)

## Running The Application

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.1.2.
To start working on it or being able to run it on your machine you can follow [the official angular documents](https://angular.io/guide/setup-local)

If you have NPM and Angular CLI installed, then run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Contribution Guide

There are no specific guidelines for contributing. Feel free to send a pull request if you have an improvement.

Any contributions to this repository are welcomed, there are also some issues already created that you can work on, or if you are not interested in them feel free to suggest any features or edits you think is cool

P.S
Feel free to contact me to discuss anything you might want to share related to this project in any way you prefer 🙂

## License

This project is licensed under the MIT License - see the [License](https://github.com/amin-setayeshfar/snoopy-face/LICENSE) file for details
