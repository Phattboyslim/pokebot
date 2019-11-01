

var string = "Test"
var fs = require("fs");

var data = "New File Contents";

fs.writeFile("raid-storage.json", data, (err) => {
  if (err) console.log(err);
  console.log("Successfully Written to File.");
});

fs.readFile("raid-storage.json", "utf-8", (err, data) => {
    if (err) { console.log(err) }
    console.log("Successfully read File: ", data);
})