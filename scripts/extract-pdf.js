import fs from "fs";
import pdf from "pdf-parse";

const dataBuffer = fs.readFileSync("src/assets/hp.pdf");

pdf(dataBuffer).then(function (data) {
  // Extract first 5000 chars roughly covering Chapter 1
  const text = data.text.substring(0, 5000);
  console.log(text);
});
