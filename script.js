// Event listener for keyboard controls
document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight" || event.key === " ") { // Right arrow or space key
      currentIndex = (currentIndex + 1) % images.length;
      updateImage();
    } else if (event.key === "ArrowLeft") { // Left arrow key
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      updateImage();
    }
  });

// Array of image paths
const images = [
    "images/image (1).png",
    "images/image (2).png",
    "images/image (3).png",
    "images/image (4).png",
    "images/image (5).png",
    "images/image (6).png",
    "images/image (7).png",
    "images/image (8).png",
    "images/image (9).png",
    "images/image (10).png",
    "images/image (11).png",
    "images/image (12).png",
    "images/image (13).png",
    "images/image (14).png",
    "images/image (15).png",
    "images/image (16).png",
    "images/image (17).png",
    "images/image (18).png",
    "images/image (19).png",
    "images/image (20).png",
    "images/image (21).png",
    "images/image (22).png",
    "images/image (23).png",
    "images/image (24).png",
    "images/image (25).png",
    "images/image (26).png",
    "images/image (27).png",
    "images/image (28).png",
    "images/image (29).png",
    "images/image (30).png",
    "images/image (31).png",
    "images/image (32).png",
    "images/image (33).png",
    "images/image (34).png",
    "images/image (35).png",
    "images/image (36).png",
    "images/image (37).png",
    "images/image (38).png",
    "images/image (39).png",
    "images/image (40).png",
    "images/image (41).png",
    "images/image (42).png",
    "images/image (43).png",
    "images/image (44).png",
    "images/image (45).png",
    "images/image (46).png",
    "images/image (47).png",
    "images/image (48).png",
    "images/image (49).png",
    "images/image (50).png",
    "images/image (51).png",
  ];
  
  let currentIndex = 0; // Tracks the current image index

const imageDisplay = document.getElementById("image-display");
const imageNumberInput = document.getElementById("image-number");
const accuracyPercentage = document.getElementById("accuracy-percentage");
const accuracyBar = document.querySelector(".progress-bar::before");

// Update the image display and accuracy bar
const updateImage = () => {
  imageDisplay.src = images[currentIndex];
  imageNumberInput.value = currentIndex;

  const accuracy = currentIndex > 0 ? (((currentIndex) / (currentIndex+1)) * 100).toFixed(2) : 0;
  updateAccuracy(accuracy);
};

// Update the accuracy percentage, bar, and grade
const updateAccuracy = (accuracy) => {
    const accuracyValue = Math.min(Math.max(accuracy, 0), 100); // Clamp between 0 and 100
  
    // Update percentage text
    accuracyPercentage.textContent = `Accuracy: ${accuracyValue}%`;
  
    // Determine grade
    let grade = "F"; // Default grade
    if (accuracyValue >= 97) grade = "A+";
    else if (accuracyValue >= 93) grade = "A";
    else if (accuracyValue >= 90) grade = "A−";
    else if (accuracyValue >= 87) grade = "B+";
    else if (accuracyValue >= 83) grade = "B";
    else if (accuracyValue >= 80) grade = "B−";
    else if (accuracyValue >= 77) grade = "C+";
    else if (accuracyValue >= 73) grade = "C";
    else if (accuracyValue >= 70) grade = "C−";
    else if (accuracyValue >= 67) grade = "D+";
    else if (accuracyValue >= 63) grade = "D";
    else if (accuracyValue >= 60) grade = "D−";
  
    // Display grade alongside accuracy
    accuracyPercentage.textContent = `Accuracy: ${accuracyValue}% (${grade})`;

  // Change color and width based on accuracy
  let color = "red"; // Default
  if (accuracyValue >= 100) color = "#48ff00";
  else if (accuracyValue >= 99.9) color = "#ff76ff";
  else if (accuracyValue >= 99.8) color = "#ff00fe";
  else if (accuracyValue >= 99.5) color = "#8f00ff";
  else if (accuracyValue >= 99) color = "#000aff";
  else if (accuracyValue >= 98) color = "#0089ff";
  else if (accuracyValue >= 97) color = "#00fffd";
  else if (accuracyValue >= 95) color = "#00ff7e";
  else if (accuracyValue >= 90) color = "#48ff00";
  else if (accuracyValue >= 80) color = "yellow";
  else if (accuracyValue >= 60) color = "orange";

  accuracyPercentage.style.color = color;
  accuracyPercentage.style.textShadow = `0px 0px 10px ${color}`;
  accuracyBar.style.backgroundColor = color;
  accuracyBar.style.width = `${accuracyValue}%`;
};

// Event listener for clicking the image (next image)
imageDisplay.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % images.length;
  updateImage();
});

// Event listener for the "Go" button
document.getElementById("go-button").addEventListener("click", () => {
  const newIndex = parseInt(imageNumberInput.value, 10);
  if (newIndex >= 0 && newIndex < images.length) {
    currentIndex = newIndex;
    updateImage();
  } else {
    alert("Invalid image number!");
  }
});

// Event listener for the "Reset" button
document.getElementById("reset-button").addEventListener("click", () => {
  currentIndex = 0;
  updateImage();
});

// Event listener for the "Back" button
document.getElementById("back-button").addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  updateImage();
});

// Initial display update
updateImage();