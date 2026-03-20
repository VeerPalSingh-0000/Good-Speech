import fs from "fs";
import pdf from "pdf-parse";

const dataBuffer = fs.readFileSync("public/stories/harrypotter.pdf");

pdf(dataBuffer)
  .then(function (data) {
    const text = data.text.substring(0, 5000);
    fs.writeFileSync("extracted.txt", text);
    console.log("Extraction complete");
  })
  .catch((err) => {
    console.error("Error:", err);
    fs.writeFileSync("extracted.txt", "ERROR: " + err.message);
  });
