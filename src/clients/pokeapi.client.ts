const axios = require('axios').default;

export class PokeapiClient {
    private baseUrl = "http://pokeapi.co/api/v2";

    constructor() {

    }

    async getGeneration(gen: number) {
        axios.get(`${this.baseUrl}/${PokeApiEndPoints.Generation.toString()}/${gen}`)
            .then(function (response: any) {
                // handle success
                console.log(response);
            })
            .catch(function (error: any) {
                // handle error
                console.log(error);
            })
            .finally(function () {
                console.log('klaar')
            });
    }
}

export enum PokeApiEndPoints {
    Generation = "generation"
}