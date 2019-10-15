import { injectable } from "inversify";
import * as fs from "fs"

@injectable()
export class FileService {
    readFile() {
        fs.readFile('/pokemon_max_cp.json', (err, data) => {
            if (err) {
                console.error(err)
                return
            }
            console.log(data)
        })
    }
}