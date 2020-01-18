import { injectable } from "inversify";

const vision = require('@google-cloud/vision');
const automl = require('@google-cloud/automl');

@injectable()
export class GoogleCloudServices {
    textClient = new vision.ImageAnnotatorClient();
    imageClient = new automl.v1beta1.PredictionServiceClient();
}
