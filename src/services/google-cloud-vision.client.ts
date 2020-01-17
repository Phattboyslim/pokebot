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
        } else if (result2.some((x: string) => x.indexOf("stop") > -1)){
            console.log("Pokestop scanned")
        } else {
            console.log("Something else scanned")
        }
        console.log(result2)
        let info = new PokestopInfo(result2);
        console.log(info)
    }
        
}

export interface IPokestopInfo {
    time: string | null
    titel: string | null
    description: string | null
    misc: string | null
    distance_alert: string | null
    unkown: any
}

export class PokestopInfo implements IPokestopInfo {
    time: string | null = null
    titel: string | null = null
    description: string | null = null
    misc: string | null = null
    distance_alert: string | null = null
    unkown: any | null = null

    constructor(info: string[]) {
        this.time = info[0]
        this.titel = info[1]
        this.description = info[2]
        this.misc = info[3]
        this.distance_alert = info[4]
        this.unkown = info[5]
    }
}

  