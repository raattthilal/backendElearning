const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');

// Function to create a certificate
async function createCertificate(winnerName, inputImagePath, outputImagePath) {
  // Load input image
  const image = await loadImage(inputImagePath);

  // Create a canvas
  const canvas = createCanvas(image.width, image.height);
  const ctx = canvas.getContext('2d');

  // Draw the input image on the canvas
  ctx.drawImage(image, 0, 0, image.width, image.height);

  // Add text overlay for the winner's name
  ctx.font = '22px Arial';
  ctx.fillStyle = 'black';
  ctx.fillText(`${winnerName}`, 560, 560);

  // Save the canvas to an output image file
  const out = fs.createWriteStream(outputImagePath);
  const stream = canvas.createPNGStream();
  stream.pipe(out);

  out.on('finish', () => {
    console.log(`Certificate saved to ${outputImagePath}`);
  });
}

// Example usage
const winnerName = 'John Doe';
const inputImagePath = 'assets/cert.jpg'; // Replace with your input image path
const outputImagePath = `public/certificates/${winnerName}_certificate.png`; // Replace with your desired output image path

createCertificate(winnerName, inputImagePath, outputImagePath);
