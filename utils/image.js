const sharp = require("sharp");

function convPict(input, output, width, height) {
  sharp(input)
    .resize(width, height)
    .toFile(output, (err) => {
      if (err) {
        console.error("Error converting picture:", err);
      } else {
        console.log("Picture converted successfully:", output);
      }
    });
}

// how to use
// const inputPath = 'path/to/input.jpg'; // Replace with your actual input path
// const outputPath = 'path/to/output.jpg'; // Replace with your desired output path
// const width = 300; // Replace with your desired width
// const height = 200; // Replace with your desired height
// convPict(inputPath, outputPath, width, height);

module.exports = {
  convPict,
};
