import * as fs from "fs"

export class FileService {
    writeStringToFile(data: string) {
        fs.writeFile("raid-storage.json", data, (err) => {
            if (err) console.log("Error: ", err);
            console.log("Error: Successfully Written to File.");
          });
    }

    readStringFromFile(data: string) {
        fs.readFile("raid-storage.json", "utf-8", (err, data) => {
            if (err) { console.log("Error: ", err) }
            console.log("Info: Successfully read File: ", data);
        })
    }
}