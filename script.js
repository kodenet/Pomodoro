// Timer variables
let timeLeft = 25 * 60; // 25 minutes in seconds
let timerId = null;
let isRunning = false;
let soundInterval = null; // For repeating sound
let currentMode = 'pomodoro'; // Track current mode
const BASE_TITLE = 'Pomodoro Timer'; // Store the base title

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
const focusModal = document.getElementById('focus-modal');
const focusInput = document.getElementById('focus-input');
const focusSubmit = document.getElementById('focus-submit');
const focusDisplay = document.getElementById('focus-display');

let currentFocus = '';

// Update timer display
function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    minutesDisplay.textContent = minutes.toString().padStart(2, '0');
    secondsDisplay.textContent = seconds.toString().padStart(2, '0');

    // Update tab title with timer and mode
    if (isRunning) {
        const modeText = currentMode.charAt(0).toUpperCase() + currentMode.slice(1);
        document.title = `(${timeString}) ${modeText} - ${BASE_TITLE}`;
    } else {
        document.title = BASE_TITLE;
    }
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

// Show focus modal
function showFocusModal() {
    focusModal.classList.add('show');
    focusInput.value = ''; // Clear previous input
    focusInput.focus();
}

// Hide focus modal
function hideFocusModal() {
    focusModal.classList.remove('show');
    focusInput.value = ''; // Clear input when canceling
}

// Handle modal click outside
function handleModalClick(event) {
    // If clicked element is the modal backdrop (not the content)
    if (event.target === focusModal) {
        hideFocusModal();
    }
}

// Set focus task
function setFocusTask() {
    const task = focusInput.value.trim();
    if (task) {
        currentFocus = task;
        focusDisplay.textContent = task;
        focusDisplay.classList.add('show');
        hideFocusModal();
        startTimer();
    }
}

// Clear focus task
function clearFocusTask() {
    currentFocus = '';
    focusDisplay.textContent = '';
    focusDisplay.classList.remove('show');
    focusInput.value = '';
}

// Start timer
function startTimer() {
    if (!isRunning) {
        if (currentMode === 'pomodoro' && !currentFocus) {
            showFocusModal();
            return;
        }
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
    document.title = BASE_TITLE; // Reset title when timer stops
}

// Reset timer
function resetTimer() {
    stopTimer();
    stopRepeatingSound();
    timeLeft = MODES.pomodoro * 60;
    updateDisplay();
    clearFocusTask();
}

// Switch timer mode
function switchMode(mode) {
    stopTimer();
    stopRepeatingSound();
    currentMode = mode;
    timeLeft = MODES[mode] * 60;
    updateDisplay();
    
    // Update active button
    [pomodoroButton, shortBreakButton, longBreakButton].forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    // Hide focus display during breaks
    if (mode !== 'pomodoro') {
        focusDisplay.classList.remove('show');
    } else if (currentFocus) {
        focusDisplay.classList.add('show');
    }
}

// Event listeners
startButton.addEventListener('click', startTimer);
pauseButton.addEventListener('click', pauseTimer);
resetButton.addEventListener('click', resetTimer);
pomodoroButton.addEventListener('click', () => switchMode('pomodoro'));
shortBreakButton.addEventListener('click', () => switchMode('shortBreak'));
longBreakButton.addEventListener('click', () => switchMode('longBreak'));
stopSoundButton.addEventListener('click', stopRepeatingSound);

focusSubmit.addEventListener('click', setFocusTask);
focusInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        setFocusTask();
    }
});

// Add modal close events
focusModal.addEventListener('click', handleModalClick);
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && focusModal.classList.contains('show')) {
        hideFocusModal();
    }
});

// Initialize display
updateDisplay();
pauseButton.disabled = true; 