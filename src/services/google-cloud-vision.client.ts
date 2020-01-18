import { dependencyInjectionContainer } from "../di-container";
import { GoogleCloudServices } from "./google-cloud.services";
import { injectable } from "inversify";

const axios = require('axios').default;

@injectable()
export class GoogleCloudClient {
    private gcs: GoogleCloudServices
    constructor() {
        this.gcs = dependencyInjectionContainer.get<GoogleCloudServices>(GoogleCloudServices)
    }

    async readImage(url: string) {
        try {
            // Get image as byte array
            const bytes = await axios.get(url, { responseType: 'arraybuffer' })
            .then((response: any) => Buffer.from(response.data, 'binary'))
            const [result] = await this.gcs.textClient.textDetection(bytes);
            const detections = result.textAnnotations;
            return detections[0].description.split('\n')
        } catch (error) {
            console.log("Error: ", error);
        }
    }

    async readImageML(url: string) {
        // Create client for prediction service.

        const projectId = `647554061248`;
        const computeRegion = `us-central1`;
        // const modelId = `IOD6596520010842112000`;
        const modelId = "IOD978842425650839552";
        // Get the full path of the model.
        const modelFullId = this.gcs.imageClient.modelPath(projectId, computeRegion, modelId);

        // Get image as byte array
        const bytes = await axios.get(url, { responseType: 'arraybuffer' })
            .then((response: any) => Buffer.from(response.data, 'binary'))
        
        // Create payload object to send to the model's API
        const payload: any = {};
        payload.image = { imageBytes: bytes };

        // Get prediction response from api
        const [response] = await this.gcs.imageClient.predict(
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