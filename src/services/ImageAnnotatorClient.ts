const vision = require('@google-cloud/vision');

export class ImageAnnotatorClient {
    client = new vision.ImageAnnotatorClient();
}
