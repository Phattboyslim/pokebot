import { ApiClient } from "./http.client";

const axios = require('axios').default;

export class PokeapiClient {
    private baseUrl = "http://pokeapi.co/api/v2";

    constructor() {

    }

    async getGeneration(gen: number) {
        var client = new ApiClient()
        var request = await client.get(`${this.baseUrl}/${PokeApiEndPoints.Generation.toString()}/${gen}`)
        return request
    }
}

export enum PokeApiEndPoints {
    Generation = "generation"
}