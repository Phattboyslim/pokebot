const vision = require('@google-cloud/vision');

export class ImageAnnotatorClient {
    instance = new vision.ImageAnnotatorClient();
}
