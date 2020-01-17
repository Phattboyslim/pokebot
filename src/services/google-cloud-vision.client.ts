import { GymInfo } from "../models/GymInfo";
import { PokestopInfo } from "../models/PokestopInfo";
import { isNullOrUndefined } from "util";

const vision = require('@google-cloud/vision');
const automl = require('@google-cloud/automl');
const fs = require('fs');
// Creates a client

/**
 * TODO(developer): Uncomment the following line before running the sample.
 */

// Performs text detection on the local file
export class GoogleCloudClient {
    client = new vision.ImageAnnotatorClient();

    async readImage() {
        var retVal = null
        try {
            const [result] = await this.client.textDetection("src/services/pokemon.png");
            const detections = result.textAnnotations;
            const result2: string[] = detections[0].description.split('\n')
            if (!isNullOrUndefined(result2)) {
                if (result2.some((x: string) => x.indexOf("Gym") > -1)) {
                    console.log("Info: Gym scanned")
                    var gymInfo = new GymInfo(result2)
                    if (!gymInfo.time_left || gymInfo.time_left.length < 5) {
                        console.log("Warning: incorrect time left")
                    } else {
                        retVal = gymInfo
                    }
                } else if (result2.some((x: string) => x.indexOf("PokéStop") > -1)) {
                    console.log("Info: Pokestop scanned")
                    var pokestopInfo = new PokestopInfo(result2)
                    retVal = pokestopInfo
                } else {
                    console.log("Warning: Something else scanned")
                    retVal = result2;
                }
            }
            return retVal
        } catch (error) {
            console.log("Error: ", error);
        }
    }

    async readImageML() {
        // Create client for prediction service.
        const client = new automl.PredictionServiceClient();

        /**
         * TODO(developer): Uncomment the following line before running the sample.
         */
        const projectId = `647554061248`;
        const computeRegion = `us-central1`;
        const modelId = `IOD6596520010842112000`;
        // const filePath = `local text file path of content to be classified, e.g. "./resources/flower.png"`;
        // const scoreThreshold = 0.6;

        // Get the full path of the model.
        const modelFullId = client.modelPath(projectId, computeRegion, modelId);

        // Read the file content for prediction.
        // TODO: Get Image From Discord Post as Base64 String
        var content = fs.readFileSync("src/services/pokemon.png", 'base64');;

        const params: any = {};

        // if (scoreThreshold) {
        //     params.score_threshold = scoreThreshold;
        // }

        // Set the payload by giving the content and type of the file.
        const payload: any = {};
        payload.image = { imageBytes: content };

        // params is additional domain-specific parameters.
        // currently there is no additional parameters supported.
        const [response] = await client.predict(
            {
                name: modelFullId,
                payload: payload,
                params: params,
            });
        console.log(`Prediction results:`);
        response.payload.forEach((result: any) => {
            console.log(`Predicted class name: ${result.displayName}`);
            console.log(`Predicted image object dectection: ${JSON.stringify(result.imageObjectDetection)}`)
            // console.log(`Predicted class score: ${result.classification.score}`);
        });
        return response;
    }
}
export interface IGCPayload {
    image: IGCImage
}
export interface IGCImage {
    imageBytes: string
}
export interface GC_ML_Object {
    payload: IGCPayload;
}