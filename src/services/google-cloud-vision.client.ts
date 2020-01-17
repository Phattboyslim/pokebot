import { dependencyInjectionContainer } from "../di-container";
import { ImageAnnotatorClient } from "./ImageAnnotatorClient";

const automl = require('@google-cloud/automl');
const axios = require('axios').default;

// Performs text detection on the local file
export class GoogleCloudClient {
    private imageAnnotatorClient: ImageAnnotatorClient
    constructor() {
        this.imageAnnotatorClient = dependencyInjectionContainer.get<ImageAnnotatorClient>(ImageAnnotatorClient)
    }

    async readImage(url: string) {
        try {
            // Get image as byte array
            const bytes = await axios.get(url, { responseType: 'arraybuffer' })
            .then((response: any) => Buffer.from(response.data, 'binary'))
            const [result] = await this.imageAnnotatorClient.instance.textDetection(bytes);
            const detections = result.textAnnotations;
            return detections[0].description.split('\n')
        } catch (error) {
            console.log("Error: ", error);
        }
    }

    async readImageML(url: string) {
        // Create client for prediction service.
        const client = new automl.v1beta1.PredictionServiceClient();

        const projectId = `647554061248`;
        const computeRegion = `us-central1`;
        const modelId = `IOD6596520010842112000`;

        // Get the full path of the model.
        const modelFullId = client.modelPath(projectId, computeRegion, modelId);

        // Get image as byte array
        const bytes = await axios.get(url, { responseType: 'arraybuffer' })
            .then((response: any) => Buffer.from(response.data, 'binary'))
        
        // Create payload object to send to the model's API
        const payload: any = {};
        payload.image = { imageBytes: bytes };

        
        // Get prediction response from api
        const [response] = await client.predict(
            {
                name: modelFullId,
                payload
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