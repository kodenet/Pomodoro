// Timer variables
let timeLeft = 25 * 60; // 25 minutes in seconds
let timerId = null;
let isRunning = false;
let soundInterval = null; // For repeating sound

// Timer modes (in minutes)
const MODES = {
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 15
};

// DOM elements
const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startButton = document.getElementById('start');
const pauseButton = document.getElementById('pause');
const resetButton = document.getElementById('reset');
const pomodoroButton = document.getElementById('pomodoro');
const shortBreakButton = document.getElementById('short-break');
const longBreakButton = document.getElementById('long-break');
const timerSound = document.getElementById('timerSound');
const notification = document.getElementById('notification');
const stopSoundButton = document.getElementById('stopSound');

// Update timer display
function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    minutesDisplay.textContent = minutes.toString().padStart(2, '0');
    secondsDisplay.textContent = seconds.toString().padStart(2, '0');
}

// Stop repeating sound
function stopRepeatingSound() {
    if (soundInterval) {
        clearInterval(soundInterval);
        soundInterval = null;
    }
    timerSound.pause();
    timerSound.currentTime = 0;
    notification.classList.remove('show');
}

// Play repeating sound
function playRepeatingSound() {
    let soundCount = 0;
    const maxRepeats = 60; // Will play for 60 seconds

    // Play first sound immediately
    timerSound.currentTime = 0;
    timerSound.play()
        .catch(error => console.log('Error playing sound:', error));

    // Set up interval for repeating sound
    soundInterval = setInterval(() => {
        soundCount++;
        if (soundCount >= maxRepeats) {
            stopRepeatingSound();
            return;
        }
        timerSound.currentTime = 0;
        timerSound.play()
            .catch(error => console.log('Error playing sound:', error));
    }, 1000); // Repeat every second
}

// Show notification
function showNotification() {
    notification.classList.add('show');
    playRepeatingSound();
}

// Timer countdown function
function countdown() {
    if (timeLeft > 0) {
        timeLeft--;
        updateDisplay();
    } else {
        stopTimer();
        showNotification();
    }
}

// Start timer
function startTimer() {
    if (!isRunning) {
        isRunning = true;
        timerId = setInterval(countdown, 1000);
        startButton.disabled = true;
        pauseButton.disabled = false;
    }
}

// Pause timer
function pauseTimer() {
    if (isRunning) {
        clearInterval(timerId);
        isRunning = false;
        startButton.disabled = false;
        pauseButton.disabled = true;
    }
}

// Stop timer
function stopTimer() {
    clearInterval(timerId);
    isRunning = false;
    startButton.disabled = false;
    pauseButton.disabled = true;
}

// Reset timer
function resetTimer() {
    stopTimer();
    stopRepeatingSound(); // Stop any playing notification sound
    timeLeft = MODES.pomodoro * 60;
    updateDisplay();
}

// Switch timer mode
function switchMode(mode) {
    stopTimer();
    stopRepeatingSound(); // Stop any playing notification sound
    timeLeft = MODES[mode] * 60;
    updateDisplay();
    
    // Update active button
    [pomodoroButton, shortBreakButton, longBreakButton].forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
}

// Event listeners
startButton.addEventListener('click', startTimer);
pauseButton.addEventListener('click', pauseTimer);
resetButton.addEventListener('click', resetTimer);
pomodoroButton.addEventListener('click', () => switchMode('pomodoro'));
shortBreakButton.addEventListener('click', () => switchMode('shortBreak'));
longBreakButton.addEventListener('click', () => switchMode('longBreak'));
stopSoundButton.addEventListener('click', stopRepeatingSound);

// Initialize display
updateDisplay();
pauseButton.disabled = true; 