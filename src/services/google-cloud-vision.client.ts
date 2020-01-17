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
export interface IGymInfo {
    titel: string | null
    pokemon: string | null
    cp: string | null
    time_left: string | null
    dtEnd: Date | null
}

export class GymInfo implements IGymInfo {
    titel: string | null;    
    pokemon: string | null;
    cp: string | null;
    private _time_left: string | null;
    
    get dtEnd() {
        var timeObjects = this._time_left!!.split(':')
        var date = new Date();
        var totalSecondsLeft = (Number(timeObjects[0]) * 60 * 60) + (Number(timeObjects[1]) * 60) + Number(timeObjects[2])
        date = new Date(date.setTime(date.getTime() + (totalSecondsLeft * 1000)))
        return date;
    }
    get time_left() {
        return this._time_left
    }
    constructor(info: string[]){
        this.titel = info[3]
        this.cp = info[4]
        this.pokemon = info[5]
        this._time_left = info[6]
    }



    toString() { 
        return `Found a ${this.pokemon} with ${this.cp} at${this.titel} - Ends at: ${this.dtEnd}`
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

  