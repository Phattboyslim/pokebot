import { injectable } from "inversify";

const vision = require('@google-cloud/vision');


@injectable()
export class GoogleCloudServices {
    textClient = new vision.ImageAnnotatorClient();
}
