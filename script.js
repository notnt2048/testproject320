let questionPool = []; // To store imported questions
let correctAnswers = 0;
let incorrectAnswers = 0;
let streak = 0;
let radicalCoins = 0;
let questionsAnswered = 0;
let beststreak = 0;
let lastUpdateTime = Date.now();
let musicPlaying = false; // Track if music is playing
let audio = new Audio('{INSERT MUSIC HERE IF NEEDED}'); // Load the background music file
let audio1 = new Audio('{INSERT CORRECT AUDIO HERE}');
let audio2 = new Audio('{INSERT INCORRECT AUDIO HERE}');

audio1.load();
audio2.load();

// Import Excel file
function importExcel() {
    const file = document.getElementById('importFile').files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });
            // Parse data into the question pool
            jsonData.shift(); // Remove header row
            questionPool = jsonData.map((row) => ({
                question: row[0],
                type: row[1],
                correct: row[2],
                options: row.slice(3, 7).filter((opt) => opt), // Filter out empty options
            }));

            if (questionPool.length > 0) {
                loadNextQuestion();
            } else {
                alert("No questions found in the uploaded file.");
            }
        };
        reader.readAsArrayBuffer(file);
    }
}

// Get a random question
function getRandomQuestion() {
    if (questionPool.length === 0) {
        alert("Please import an Excel file with questions first!");
        return null;
    }
    const randomIndex = Math.floor(Math.random() * questionPool.length);
    return questionPool[randomIndex];
}

// Load the next question
function loadNextQuestion() {
    const question = getRandomQuestion();
    if (!question) return;

    document.getElementById("question-text").textContent = question.question;

    const optionsDiv = document.getElementById("options");
    optionsDiv.innerHTML = ""; // Clear previous options

    if (question.type === "multiple") {
        // Render multiple-choice options
        question.options.forEach((option, index) => {
            const btn = document.createElement("button");
            btn.textContent = option;
            btn.onclick = () => checkAnswer(question, index + 1);
            btn.style.height = "100px"; // Set the button height to 100 pixels
            btn.style.display = "block"; // Ensure the buttons are stacked vertically
            btn.style.margin = "10px 0"; // Add margin for better spacing
            optionsDiv.appendChild(btn);
        });
        document.getElementById("fill-answer").style.display = "none";
    } else if (question.type === "fill") {
        // Render fill-in-the-blank input
        document.getElementById("fill-answer").style.display = "block";
        document.getElementById("fill-answer").value = ""; // Clear input
        document.getElementById("fill-answer").onchange = () =>
            checkAnswer(question, document.getElementById("fill-answer").value);
    }
}

// Check the answer
function checkAnswer(question, answer) {
    if (String(answer).toLowerCase() === String(question.correct).toLowerCase()) {
        correctAnswers++;
        audio1.play();
        streak++;
        radicalCoins += Math.round(1000 / ((correctAnswers + incorrectAnswers) || 1));
        showStreakEffect();

        if (streak >= beststreak){
            beststreak = streak;
        }
    } else {
        incorrectAnswers++;
        audio2.play();
        streak = 0;
        alert(`Incorrect! The correct answer was: ${question.correct}`);
        showGameOver(); // Trigger game over effect
    }

    questionsAnswered++;
    updateProgress();
    loadNextQuestion();
}

function showGameOver() {
    const streakImage = document.getElementById("streak-image");

    // Set the source of the streak image to a game over image
    streakImage.src = './STREAK/images (1).png'; // Path to the game over image
}

// Update progress
function updateProgress() {
    const totalQuestions = correctAnswers + incorrectAnswers;
    const streakaccuracy = ((streak / (streak + 1)) * 100).toFixed(2);
    const accuracy = ((correctAnswers / (correctAnswers + incorrectAnswers)) * 100).toFixed(2);
    const accuracyBar = document.getElementById("accuracy-bar");

    // Determine the grade letter
    let gradeLetter = '';
    if (accuracy >= 97) {
        gradeLetter = 'A+';
        accuracyBar.className = "bar blue";
    } else if (accuracy >= 93) {
        gradeLetter = 'A';
        accuracyBar.className = "bar green";
    } else if (accuracy >= 90) {
        gradeLetter = 'A−';
        accuracyBar.className = "bar green";
    } else if (accuracy >= 87) {
        gradeLetter = 'B+';
        accuracyBar.className = "bar yellow";
    } else if (accuracy >= 83) {
        gradeLetter = 'B';
        accuracyBar.className = "bar yellow";
    } else if (accuracy >= 80) {
        gradeLetter = 'B−';
        accuracyBar.className = "bar yellow";
    } else if (accuracy >= 77) {
        gradeLetter = 'C+';
        accuracyBar.className = "bar orange";
    } else if (accuracy >= 73) {
        gradeLetter = 'C';
        accuracyBar.className = "bar orange";
    } else if (accuracy >= 70) {
        gradeLetter = 'C−';
        accuracyBar.className = "bar orange";
    } else if (accuracy >= 67) {
        gradeLetter = 'D+';
        accuracyBar.className = "bar red";
    } else if (accuracy >= 63) {
        gradeLetter = 'D';
        accuracyBar.className = "bar red";
    } else if (accuracy >= 60) {
        gradeLetter = 'D−';
        accuracyBar.className = "bar red";
    } else {
        gradeLetter = 'F';
        accuracyBar.className = "bar red";
    }

    // Update the UI with the accuracy, grade letter, and other stats
    document.getElementById(
        "accuracy-info"
    ).textContent = `Accuracy: ${accuracy}% (${gradeLetter}) | Correct: ${correctAnswers} | Incorrect: ${incorrectAnswers} | Total: ${totalQuestions} | Score: ${radicalCoins} | Best Streak: ${beststreak}`;
    document.getElementById("streakcolor").textContent = `Streak accuracy: ${streakaccuracy}%`
}


// Update the questions per minute
function updateQuestionsPerMinute() {
    const currentTime = Date.now();
    const timeElapsedInMinutes = (currentTime - lastUpdateTime) / 60000;
    const questionsPerMinute = (questionsAnswered / timeElapsedInMinutes).toFixed(2); // To include decimals

    document.getElementById("questions-per-minute").textContent = `Questions per minute: ${questionsPerMinute}`;

    if (timeElapsedInMinutes >= 1) {
        lastUpdateTime = currentTime; // Reset timer after 1 minute
        questionsAnswered = 0; // Reset question counter after 1 minute
    }
}

// Streak effect
function showStreakEffect() {
    const streakImage = document.getElementById("streak-image");

    // Dynamically update the streak image based on the streak count
    streakImage.src = `./STREAK/images (${streak + 1}).png`; // Set the source to the streak image path
}

// Reset everything
function resetQuiz() {
    correctAnswers = 0;
    incorrectAnswers = 0;
    streak = 0;
    radicalCoins = 0;
    questionsAnswered = 0;
    beststreak = 0;
    lastUpdateTime = Date.now();

    // Reset UI elements
    document.getElementById("question-text").textContent = "";
    document.getElementById("options").innerHTML = "";
    document.getElementById("fill-answer").style.display = "none";
    document.getElementById("accuracy-info").textContent = "Accuracy: 0% | Correct: 0 | Incorrect: 0 | Radical Coins: 0";
    document.getElementById("streak-image").src = ''; // Reset the streak image

    alert("Quiz has been reset!");
    loadNextQuestion();
}

// Music toggle handler
document.getElementById("music-toggle").addEventListener("change", function() {
    if (this.checked) {
        if (!musicPlaying) {
            audio.loop = true; // Make the music loop
            audio.play();
            musicPlaying = true;
        }
    } else {
        audio.pause();
        musicPlaying = false;
    }
});

// Function to save data to localStorage
function saveToStorage() {
    const quizData = {
        correctAnswers,
        incorrectAnswers,
        streak,
        radicalCoins,
        questionsAnswered,
        beststreak,
        lastUpdateTime,
        questionPool,
    };

    // Store the data as a string in localStorage
    localStorage.setItem('quizData', JSON.stringify(quizData));
}

// Load data from localStorage, including the question pool
function loadFromStorage() {
    const storedData = localStorage.getItem('quizData');
    if (storedData) {
        const quizData = JSON.parse(storedData);
        // Restore the variables
        correctAnswers = quizData.correctAnswers;
        incorrectAnswers = quizData.incorrectAnswers;
        streak = quizData.streak;
        radicalCoins = quizData.radicalCoins;
        questionsAnswered = quizData.questionsAnswered;
        beststreak = quizData.beststreak;
        lastUpdateTime = quizData.lastUpdateTime;
        questionPool = quizData.questionPool || [];  // Restore the question pool

        // Update the UI with the loaded values (if needed)
        updateProgress();
    }
}

// Call the loadFromStorage function on window load
window.onload = () => {
    loadFromStorage(); // Load the stored data when the page is loaded

    // Set an interval to save data every 1000ms (1 second)
    setInterval(saveToStorage, 1000);

    document.getElementById("fill-answer").style.display = "none"; // Hide the fill-in-the-blank field initially
    setInterval(updateQuestionsPerMinute, 100); // Update the question rate every 0.5 seconds
};
