import { GymInfo } from "../models/GymInfo";
import { PokestopInfo } from "../models/PokestopInfo";
import { isNullOrUndefined } from "util";

const vision = require('@google-cloud/vision');

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
            if(!isNullOrUndefined(result2)){
                if(result2.some((x: string) => x.indexOf("Gym") > -1)){
                    console.log("Info: Gym scanned")
                    var gymInfo = new GymInfo(result2)
                    if(!gymInfo.time_left || gymInfo.time_left.length < 5) {
                        console.log("Warning: incorrect time left")
                    } else {
                        retVal = gymInfo
                    }
                } else if (result2.some((x: string) => x.indexOf("PokéStop") > -1)){
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
}
