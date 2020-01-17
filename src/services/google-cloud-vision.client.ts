import { GymInfo } from "../models/GymInfo";
import { PokestopInfo } from "../models/PokestopInfo";

const vision = require('@google-cloud/vision');

// Creates a client

/**
 * TODO(developer): Uncomment the following line before running the sample.
 */

// Performs text detection on the local file
export class GoogleCloudClient {
    client = new vision.ImageAnnotatorClient();

    async readImage() {
        const [result] = await this.client.textDetection("src/services/pokemon.png");
        const detections = result.textAnnotations;
        const result2: string[] = detections[0].description.split('\n')
        if(result2.some((x: string) => x.indexOf("Gym") > -1)){
            console.log("Gym scanned")
            var gymInfo = new GymInfo(result2)
            console.log(gymInfo.toString())
        } else if (result2.some((x: string) => x.indexOf("PokéStop") > -1)){
            console.log("Pokestop scanned")
            var pokestopInfo = new PokestopInfo(result2)
            console.log(pokestopInfo)
        } else {
            console.log("Something else scanned")
            console.log(result2)
        }
    }
        
}
