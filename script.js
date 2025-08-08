/**
 * Stopwatch Application
 * 
 * This script implements a fully functional stopwatch with start, pause, reset,
 * and lap functionality. It also includes keyboard shortcuts for accessibility.
 */

// DOM elements
const hoursElement = document.getElementById('hours');
const minutesElement = document.getElementById('minutes');
const secondsElement = document.getElementById('seconds');
const millisecondsElement = document.getElementById('milliseconds');
const startButton = document.getElementById('startBtn');
const pauseButton = document.getElementById('pauseBtn');
const resetButton = document.getElementById('resetBtn');
const lapButton = document.getElementById('lapBtn');
const splitButton = document.getElementById('splitBtn');
const lapsList = document.getElementById('lapsList');
const statusAnnouncer = document.getElementById('statusAnnouncer');
const themeToggle = document.getElementById('themeToggle');
const fullscreenToggle = document.getElementById('fullscreenToggle');
const presetButtons = document.querySelectorAll('.preset-btn');

// Stopwatch state variables
let startTime;
let elapsedTime = 0;
let timerInterval;
let isRunning = false;
let lapCount = 0;
let presetTime = 0;
let countdownMode = false;
let lastLapTime = 0; // Store the time of the last lap for lap time calculation

// State variables
let isDarkMode = false;
let isFullscreen = false;

/**
 * Toggle between light and dark theme
 */
function toggleTheme() {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark-theme', isDarkMode);
    
    // Announce theme change to screen readers
    const themeMessage = isDarkMode ? 'Dark mode activated' : 'Light mode activated';
    announceStatus(themeMessage);
    
    // Save preference to localStorage
    localStorage.setItem('darkMode', isDarkMode);
}

/**
 * Toggle fullscreen mode
 */
function toggleFullscreen() {
    if (!isFullscreen) {
        // Enter fullscreen
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) { // Firefox
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) { // Chrome, Safari and Opera
            document.documentElement.webkitRequestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) { // IE/Edge
            document.documentElement.msRequestFullscreen();
        }
        isFullscreen = true;
        document.body.classList.add('is-fullscreen');
        announceStatus('Entered fullscreen mode');
    } else {
        // Exit fullscreen
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) { // Firefox
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) { // Chrome, Safari and Opera
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { // IE/Edge
            document.msExitFullscreen();
        }
        isFullscreen = false;
        document.body.classList.remove('is-fullscreen');
        announceStatus('Exited fullscreen mode');
    }
}

// Listen for fullscreen change events
document.addEventListener('fullscreenchange', updateFullscreenState);
document.addEventListener('webkitfullscreenchange', updateFullscreenState);
document.addEventListener('mozfullscreenchange', updateFullscreenState);
document.addEventListener('MSFullscreenChange', updateFullscreenState);

/**
 * Update fullscreen state based on document state
 */
function updateFullscreenState() {
    isFullscreen = !!(document.fullscreenElement || document.webkitFullscreenElement || 
                     document.mozFullScreenElement || document.msFullscreenElement);
    document.body.classList.toggle('is-fullscreen', isFullscreen);
    
    // Update fullscreen icon state
    fullscreenToggle.setAttribute('aria-pressed', isFullscreen.toString());
    fullscreenToggle.title = isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen';
}

/**
 * Load saved theme preference
 */
function loadThemePreference() {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode !== null) {
        isDarkMode = savedDarkMode === 'true';
        document.body.classList.toggle('dark-theme', isDarkMode);
    }
}

/**
 * Starts the stopwatch timer
 */
function startTimer() {
    if (!isRunning) {
        isRunning = true;
        startTime = Date.now() - elapsedTime;
        
        timerInterval = setInterval(updateTime, 10); // Update every 10ms for smooth display
        
        // Update button states
        startButton.disabled = true;
        pauseButton.disabled = false;
        lapButton.disabled = false;
        splitButton.disabled = false;
        
        // Add running class for animations
        document.querySelector('.container').classList.add('running');
        
        // Announce to screen readers
        announceStatus('Stopwatch started');
    }
}

/**
 * Pauses the stopwatch timer
 */
function pauseTimer() {
    if (isRunning) {
        isRunning = false;
        clearInterval(timerInterval);
        
        // Update button states
        startButton.disabled = false;
        pauseButton.disabled = true;
        // Keep lap button enabled when paused if there's elapsed time
        lapButton.disabled = (elapsedTime === 0);
        splitButton.disabled = (elapsedTime === 0);
        
        // Remove running class to stop animations
        document.querySelector('.container').classList.remove('running');
        
        // Announce to screen readers
        announceStatus('Stopwatch paused');
    }
}

/**
 * Resets the stopwatch timer and clears all lap times
 */
function resetTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    elapsedTime = 0;
    lapCount = 0;
    lastLapTime = 0; // Reset the last lap time
    presetTime = 0;
    countdownMode = false;
    
    // Reset display
    updateDisplay(0, 0, 0, 0);
    
    // Clear lap times
    lapsList.innerHTML = '';
    
    // Reset button states
    startButton.disabled = false;
    pauseButton.disabled = true;
    lapButton.disabled = true;
    splitButton.disabled = true;
    
    // Remove active class from all preset buttons
    presetButtons.forEach(btn => btn.classList.remove('active'));
    
    // Remove running and countdown-mode classes to stop animations
    document.querySelector('.container').classList.remove('running', 'countdown-mode');
    
    // Announce to screen readers
    announceStatus('Stopwatch reset');
}

/**
 * Records a lap time - the time interval since the last lap
 */
function recordLap() {
    // Allow recording laps when timer is running or paused but has elapsed time
    if (isRunning || elapsedTime > 0) {
        lapCount++;
        
        // Calculate the lap time (time since last lap)
        const currentLapTime = elapsedTime - lastLapTime;
        const lapTimeFormatted = formatTime(currentLapTime);
        
        // Create lap time display
        const lapItem = document.createElement('li');
        lapItem.className = 'lap-item';
       
        // Format the total elapsed time for display
        const totalTimeFormatted = formatTime(elapsedTime);
                
        lapItem.innerHTML = `
            <span class="lap-number">Lap ${lapCount}</span>
            <span class="lap-time">${totalTimeFormatted}</span>
            <span class="lap-segment">(Segment: ${lapTimeFormatted})</span>
        `;
        
        // Add to the beginning of the list for most recent at top
        lapsList.insertBefore(lapItem, lapsList.firstChild);
        
        // Update the last lap time for next lap calculation
        lastLapTime = elapsedTime;
        
        // Announce to screen readers
       announceStatus(`Lap ${lapCount} recorded: Total time ${totalTimeFormatted}, Segment time ${lapTimeFormatted}`);
    }
}

/**
 * Records a split time - the total time from start
 */
function recordSplit() {
    // Allow recording splits when timer is running or paused but has elapsed time
    if (isRunning || elapsedTime > 0) {
        lapCount++;
        
        // Create split time display - total time from start
        const splitTime = formatTime(elapsedTime);
        const splitItem = document.createElement('li');
        splitItem.className = 'lap-item split-item';
        splitItem.innerHTML = `
            <span class="lap-number">Split ${lapCount}</span>
            <span class="lap-time">${splitTime}</span>
            <span class="lap-total">(Total from start)</span>
        `;
        
        // Add to the beginning of the list for most recent at top
        lapsList.insertBefore(splitItem, lapsList.firstChild);
        
        // Announce to screen readers
        announceStatus(`Split ${lapCount} recorded: ${splitTime}`);
    }
}

/**
 * Updates the timer display based on elapsed time
 */
function updateTime() {
    const currentTime = Date.now();
    const container = document.querySelector('.container');
    
    if (countdownMode && presetTime > 0) {
        // Countdown mode
        elapsedTime = presetTime - (currentTime - startTime);
        
        // Add countdown-mode class to container
        container.classList.add('countdown-mode');
        
        // Check if countdown has reached zero
        if (elapsedTime <= 0) {
            elapsedTime = 0;
            pauseTimer();
            announceStatus('Timer complete!');
            // Play notification sound or vibrate here if needed
        }
    } else {
        // Regular stopwatch mode
        elapsedTime = currentTime - startTime;
        
        // Remove countdown-mode class from container
        container.classList.remove('countdown-mode');
    }
    
    // Calculate hours, minutes, seconds, and milliseconds
    const hours = Math.floor(elapsedTime / (1000 * 60 * 60));
    const minutes = Math.floor((elapsedTime % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((elapsedTime % (1000 * 60)) / 1000);
    const milliseconds = Math.floor((elapsedTime % 1000) / 10); // Only show 2 digits
    
    // Update the display
    updateDisplay(hours, minutes, seconds, milliseconds);
}

/**
 * Updates the DOM elements with the current time values
 */
function updateDisplay(hours, minutes, seconds, milliseconds) {
    hoursElement.textContent = padNumber(hours);
    minutesElement.textContent = padNumber(minutes);
    secondsElement.textContent = padNumber(seconds);
    millisecondsElement.textContent = padNumber(milliseconds);
}

/**
 * Formats a number to always have at least 2 digits
 */
function padNumber(number) {
    return number.toString().padStart(2, '0');
}

/**
 * Formats the elapsed time into a readable string
 */
function formatTime(timeInMs) {
    const hours = Math.floor(timeInMs / (1000 * 60 * 60));
    const minutes = Math.floor((timeInMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeInMs % (1000 * 60)) / 1000);
    const milliseconds = Math.floor((timeInMs % 1000) / 10);
    
    return `${padNumber(hours)}:${padNumber(minutes)}:${padNumber(seconds)}:${padNumber(milliseconds)}`;
}

/**
 * Announces status changes for screen readers
 */
function announceStatus(message) {
    // Create a visually hidden element for screen reader announcements
    let announcer = document.getElementById('status-announcer');
    
    if (!announcer) {
        announcer = document.createElement('div');
        announcer.id = 'status-announcer';
        announcer.setAttribute('aria-live', 'polite');
        announcer.setAttribute('aria-atomic', 'true');
        announcer.style.position = 'absolute';
        announcer.style.width = '1px';
        announcer.style.height = '1px';
        announcer.style.padding = '0';
        announcer.style.overflow = 'hidden';
        announcer.style.clip = 'rect(0, 0, 0, 0)';
        announcer.style.whiteSpace = 'nowrap';
        announcer.style.border = '0';
        document.body.appendChild(announcer);
    }
    
    announcer.textContent = message;
}

/**
 * Sets a preset time for countdown mode
 * @param {number} milliseconds - The preset time in milliseconds
 * @param {HTMLElement} buttonElement - The button element that was clicked
 */
function setPresetTime(milliseconds, buttonElement) {
    // Reset the timer first
    resetTimer();
    
    // Remove active class from all preset buttons
    presetButtons.forEach(btn => btn.classList.remove('active'));
    
    // Add active class to the clicked button
    if (buttonElement) {
        buttonElement.classList.add('active');
    }
    
    // Set the preset time and enable countdown mode
    presetTime = milliseconds;
    countdownMode = true;
    elapsedTime = presetTime;
    
    // Calculate and display the preset time
    const hours = Math.floor(presetTime / (1000 * 60 * 60));
    const minutes = Math.floor((presetTime % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((presetTime % (1000 * 60)) / 1000);
    const millisecs = Math.floor((presetTime % 1000) / 10);
    
    updateDisplay(hours, minutes, seconds, millisecs);
    
    // Announce to screen readers
    const timeString = formatTime(hours, minutes, seconds, millisecs);
    announceStatus(`Timer preset set to ${timeString}`);
}

// Event listeners
startButton.addEventListener('click', startTimer);
pauseButton.addEventListener('click', pauseTimer);
resetButton.addEventListener('click', resetTimer);
lapButton.addEventListener('click', recordLap);
splitButton.addEventListener('click', recordSplit);
themeToggle.addEventListener('click', toggleTheme);
fullscreenToggle.addEventListener('click', toggleFullscreen);

// Add event listeners for preset buttons
presetButtons.forEach(button => {
    button.addEventListener('click', function() {
        const presetTimeMs = parseInt(this.dataset.time);
        setPresetTime(presetTimeMs, this);
    });
});

// Export functionality
const exportBtn = document.getElementById('exportBtn');
const exportDropdown = document.getElementById('exportDropdown');
const exportOptions = document.querySelectorAll('.export-option');

/**
 * Toggle the export dropdown menu
 */
function toggleExportDropdown() {
    exportDropdown.classList.toggle('show');
}

/**
 * Close the export dropdown when clicking outside
 */
window.addEventListener('click', (event) => {
    if (!event.target.matches('.export-btn') && !event.target.closest('.export-dropdown')) {
        exportDropdown.classList.remove('show');
    }
});

/**
 * Export lap times in the specified format
 * @param {string} format - The export format (csv, json, txt)
 */
function exportLapTimes(format) {
    // Get all lap items
    const lapItems = document.querySelectorAll('.lap-item');
    
    if (lapItems.length === 0) {
        announceStatus('No lap times to export');
        return;
    }
    
    // Prepare data array
    const lapData = [];
    
    lapItems.forEach((item) => {
        const lapNumber = item.querySelector('.lap-number').textContent;
        const lapTime = item.querySelector('.lap-time').textContent;
        
        // Check if it's a lap or split
        const isLap = !item.classList.contains('split-item');
        const type = isLap ? 'Lap' : 'Split';
        
        // Get segment time if available
        let segmentTime = '';
        const segmentElement = item.querySelector('.lap-segment');
        if (segmentElement) {
            // Extract just the time part from the segment text
            const segmentText = segmentElement.textContent;
            const match = segmentText.match(/\d{2}:\d{2}:\d{2}:\d{2}/);
            segmentTime = match ? match[0] : '';
        }
        
        lapData.push({
            number: lapNumber,
            type: type,
            time: lapTime,
            segmentTime: segmentTime
        });
    });
    
    // Generate content based on format
    let content = '';
    let fileName = `stopwatch_laps_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}`;
    let mimeType = '';
    
    switch (format) {
        case 'csv':
            content = 'Number,Type,Time,Segment Time\n';
            lapData.forEach(lap => {
                content += `${lap.number},${lap.type},${lap.time},${lap.segmentTime}\n`;
            });
            fileName += '.csv';
            mimeType = 'text/csv';
            break;
            
        case 'json':
            content = JSON.stringify(lapData, null, 2);
            fileName += '.json';
            mimeType = 'application/json';
            break;
            
        case 'txt':
            lapData.forEach(lap => {
                content += `${lap.number} - ${lap.type} - ${lap.time}`;
                if (lap.segmentTime) {
                    content += ` (Segment: ${lap.segmentTime})`;
                }
                content += '\n';
            });
            fileName += '.txt';
            mimeType = 'text/plain';
            break;
    }
    
    // Create and trigger download
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 100);
    
    // Close dropdown and announce
    exportDropdown.classList.remove('show');
    announceStatus(`Lap times exported as ${format.toUpperCase()}`);
}

// Add event listeners for export functionality
exportBtn.addEventListener('click', toggleExportDropdown);

exportOptions.forEach(option => {
    option.addEventListener('click', () => {
        const format = option.getAttribute('data-format');
        exportLapTimes(format);
    });
});

// Keyboard shortcuts
document.addEventListener('keydown', (event) => {
    // Only process if not in an input field
    if (event.target.tagName !== 'INPUT' && event.target.tagName !== 'TEXTAREA') {
        const key = event.key.toLowerCase();
        
        switch (key) {
            case 's':
                if (isRunning) {
                    pauseTimer();
                } else {
                    startTimer();
                }
                break;
            case 'r':
                resetTimer();
                break;
            case 'l':
                // Allow lap recording when timer is running or has elapsed time
                if (isRunning || elapsedTime > 0) {
                    recordLap();
                }
                break;
            case 'p':
                // Allow split recording when timer is running or has elapsed time
                if (isRunning || elapsedTime > 0) {
                    recordSplit();
                }
                break;
            case 'e':
                // Toggle export dropdown
                toggleExportDropdown();
                break;
        }
    }
});

// Initialize the display and theme
updateDisplay(0, 0, 0, 0);
loadThemePreference();
