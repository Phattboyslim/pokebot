import http from "http"

export class PokeapiClient {
    private baseUrl = "http://pokeapi.co/api/v2";

    constructor() {

    }

    getGeneration(gen: number) {

        http.get(`${this.baseUrl}/${PokeApiEndPoints.Generation.toString()}/${gen}`, function(res){
            var body = '';
            res.headers.accept = "application/json"
            res.on('data', function(chunk){
                body += chunk;
            });
        
            res.on('end', function(){
                var response = JSON.parse(body);
                console.log("Got a response: ", response);
            });
        }).on('error', function(e){
              console.log("Got an error: ", e);
        });
    }
}

export enum PokeApiEndPoints {
    Generation = "generation"
}