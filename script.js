const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const imageUpload = document.getElementById("imageUpload");
const addWatermarkButton = document.getElementById("addWatermark");
const extractWatermarkButton = document.getElementById("extractWatermark");
const result = document.getElementById("result");

// Attack buttons
const addNoiseButton = document.getElementById("addNoise");
const scalingButton = document.getElementById("scaling");
const rotationButton = document.getElementById("rotation");
const croppingButton = document.getElementById("cropping");
const blurringButton = document.getElementById("blurring");
const brightnessButton = document.getElementById("brightnessAdjustment");
const jpegCompressionButton = document.getElementById("jpegCompression");

let originalImage = null;
let watermarkedImage = null;

// Handle image upload
imageUpload.addEventListener("change", (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.src = reader.result;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      originalImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
    };
  };
  if (file) reader.readAsDataURL(file);
});

// Add watermark
addWatermarkButton.addEventListener("click", () => {
  if (!originalImage) return alert("Please upload an image first!");
  ctx.putImageData(originalImage, 0, 0);
  ctx.font = "30px Arial";
  ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
  ctx.fillText("WATERMARK", canvas.width - 200, canvas.height - 30);
  watermarkedImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
});

// Extract watermark
extractWatermarkButton.addEventListener("click", () => {
  if (!watermarkedImage) return alert("Please add a watermark first!");
  const attackedImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let diffCount = 0;

  // Compare pixels between watermarked image and attacked image
  for (let i = 0; i < attackedImage.data.length; i += 4) {
    const rDiff = Math.abs(attackedImage.data[i] - watermarkedImage.data[i]);
    const gDiff = Math.abs(attackedImage.data[i + 1] - watermarkedImage.data[i + 1]);
    const bDiff = Math.abs(attackedImage.data[i + 2] - watermarkedImage.data[i + 2]);

    if (rDiff > 20 || gDiff > 20 || bDiff > 20) {
      diffCount++;
    }
  }

  result.textContent = diffCount > 0 
    ? `Watermark Detected! Differences: ${diffCount} pixels.` 
    : "No Watermark Detected.";
});

// Attack: Add Noise
addNoiseButton.addEventListener("click", () => {
  if (!watermarkedImage) return alert("Please add a watermark first!");
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < imageData.data.length; i += 4) {
    imageData.data[i] += Math.random() * 50 - 25; // R channel
    imageData.data[i + 1] += Math.random() * 50 - 25; // G channel
    imageData.data[i + 2] += Math.random() * 50 - 25; // B channel
  }
  ctx.putImageData(imageData, 0, 0);
});

// Attack: Scaling
scalingButton.addEventListener("click", () => {
  if (!watermarkedImage) return alert("Please add a watermark first!");
  const tempCanvas = document.createElement("canvas");
  const tempCtx = tempCanvas.getContext("2d");

  tempCanvas.width = canvas.width / 2;
  tempCanvas.height = canvas.height / 2;
  tempCtx.drawImage(canvas, 0, 0, tempCanvas.width, tempCanvas.height);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(tempCanvas, 0, 0, canvas.width, canvas.height);
});

// Attack: Rotation
rotationButton.addEventListener("click", () => {
  if (!watermarkedImage) return alert("Please add a watermark first!");
  const tempCanvas = document.createElement("canvas");
  const tempCtx = tempCanvas.getContext("2d");

  tempCanvas.width = canvas.height;
  tempCanvas.height = canvas.width;

  tempCtx.translate(tempCanvas.width / 2, tempCanvas.height / 2);
  tempCtx.rotate((Math.PI / 180) * 45); // Rotate 45 degrees
  tempCtx.drawImage(canvas, -canvas.width / 2, -canvas.height / 2);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  canvas.width = tempCanvas.width;
  canvas.height = tempCanvas.height;
  ctx.drawImage(tempCanvas, 0, 0);
});

// Attack: Cropping
croppingButton.addEventListener("click", () => {
  if (!watermarkedImage) return alert("Please add a watermark first!");
  const croppedWidth = canvas.width * 0.8;
  const croppedHeight = canvas.height * 0.8;
  const startX = canvas.width * 0.1;
  const startY = canvas.height * 0.1;

  const imageData = ctx.getImageData(startX, startY, croppedWidth, croppedHeight);
  canvas.width = croppedWidth;
  canvas.height = croppedHeight;
  ctx.putImageData(imageData, 0, 0);
});

// Attack: Blurring
blurringButton.addEventListener("click", () => {
  if (!watermarkedImage) return alert("Please add a watermark first!");
  ctx.filter = "blur(5px)";
  ctx.drawImage(canvas, 0, 0);
  ctx.filter = "none";
});

// Attack: Brightness Adjustment
brightnessButton.addEventListener("click", () => {
  if (!watermarkedImage) return alert("Please add a watermark first!");
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < imageData.data.length; i += 4) {
    imageData.data[i] = Math.min(imageData.data[i] + 50, 255); // R
    imageData.data[i + 1] = Math.min(imageData.data[i + 1] + 50, 255); // G
    imageData.data[i + 2] = Math.min(imageData.data[i + 2] + 50, 255); // B
  }
  ctx.putImageData(imageData, 0, 0);
});

// Attack: JPEG Compression
jpegCompressionButton.addEventListener("click", () => {
  if (!watermarkedImage) return alert("Please add a watermark first!");
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  const tempCtx = tempCanvas.getContext("2d");
  tempCtx.drawImage(canvas, 0, 0);
  const compressedImage = tempCanvas.toDataURL("image/jpeg", 0.5); // Compress to 50% quality
  const img = new Image();
  img.src = compressedImage;
  img.onload = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
  };
});
