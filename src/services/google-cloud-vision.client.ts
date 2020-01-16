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
        console.log('Text:');
        detections.forEach((text: any) => {
            console.log("Ah yeet",text);
        });
    }
}


  