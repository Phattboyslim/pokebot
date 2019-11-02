import fetch from "node-fetch";

export class ApiClient {
    async get(uri: string) {
        var options = {
            uri: uri,
            headers: {
                'Content-Type': 'application/json'
            },
            json: true // Automatically parses the JSON string in the response
        };

        var test = await fetch(options.uri, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
            .then(res => res.json())
            .then(json => {
                return json
            });

            return test
    }
}