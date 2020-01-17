import { injectable } from "inversify";

const vision = require('@google-cloud/vision');

@injectable()
export class ImageAnnotatorClient {
    instance = new vision.ImageAnnotatorClient();
}
