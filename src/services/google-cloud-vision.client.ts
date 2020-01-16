const vision = require('@google-cloud/vision');

// Creates a client

/**
 * TODO(developer): Uncomment the following line before running the sample.
 */

// Performs text detection on the local file
export class GoogleCloudClient {
    client = new vision.ImageAnnotatorClient();

    async readImage() {
        const fileName = 'Local image file, e.g. /path/to/image.png';
        const [result] = await this.client.textDetection("src/services/testImg.png");
        const detections = result.textAnnotations;
        const result2 = detections[0].description.split('\n')
        console.log(result2)
        let info = new PokestopInfo(result2);
        console.log(info)
    }
        
}

export interface IPokestopInfo {
    time: Date | null
    titel: string | null
    description: string | null
    misc: string | null
    distance_alert: string | null
    unkown: any
}

export class PokestopInfo implements IPokestopInfo {
    time: Date | null = null
    titel: string | null = null
    description: string | null = null
    misc: string | null = null
    distance_alert: string | null = null
    unkown: any | null = null

    constructor(info: IPokestopInfo) {
        this.time = info.time
        this.titel = info.titel
        this.description = info.description
        this.misc = info.misc
        this.distance_alert = info.distance_alert
        this.unkown = info.unkown
    }
}

  