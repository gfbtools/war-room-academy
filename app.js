/* ============================================
   WAR ROOM ACADEMY - CORE FUNCTIONALITY
   ============================================ */

// ============================================
// CONFIGURATION
// ============================================

const CONFIG = {
    // Replace with your actual Cloudflare Worker URL
    WORKER_URL: 'https://war-room-academy-chat.smartstelleraico.workers.dev',
    MIN_CHECKPOINT_LENGTH: 20,
    RATE_LIMIT_MESSAGE: 'Rate limit exceeded. Please try again in a few minutes.'
};

// ============================================
// PROGRESS TRACKING
// ============================================

/**
 * Save lesson completion progress to localStorage
 * @param {number} lessonNumber - The lesson number (1-4)
 */
function saveProgress(lessonNumber) {
    try {
        // Get existing progress or initialize
        let progress = getProgressData();
        
        // Mark lesson as complete
        progress.module1[`lesson${lessonNumber}`] = true;
        
        // Save to localStorage
        localStorage.setItem('warRoomProgress', JSON.stringify(progress));
        
        console.log(`Progress saved: Lesson ${lessonNumber} completed`);
        
        // Update progress display if on page
        updateProgressDisplay();
        
    } catch (error) {
        console.error('Error saving progress:', error);
        // Fallback: use sessionStorage if localStorage is disabled
        try {
            sessionStorage.setItem('warRoomProgress', JSON.stringify(progress));
        } catch (sessionError) {
            console.error('Both localStorage and sessionStorage failed:', sessionError);
        }
    }
}

/**
 * Get completion percentage for Module 1
 * @returns {number} Percentage complete (0-100)
 */
function getProgress() {
    try {
        const progress = getProgressData();
        const lessons = Object.values(progress.module1);
        const completed = lessons.filter(val => val === true).length;
        const total = lessons.length;
        
        return Math.round((completed / total) * 100);
        
    } catch (error) {
        console.error('Error getting progress:', error);
        return 0;
    }
}

/**
 * Get raw progress data from storage
 * @returns {object} Progress data object
 */
function getProgressData() {
    try {
        const stored = localStorage.getItem('warRoomProgress') || 
                      sessionStorage.getItem('warRoomProgress');
        
        if (stored) {
            return JSON.parse(stored);
        }
        
        // Initialize default progress structure
        return {
            module1: {
                lesson1: false,
                lesson2: false,
                lesson3: false,
                lesson4: false
            }
        };
        
    } catch (error) {
        console.error('Error reading progress data:', error);
        return {
            module1: {
                lesson1: false,
                lesson2: false,
                lesson3: false,
                lesson4: false
            }
        };
    }
}

/**
 * Update progress bar display on page
 */
function updateProgressDisplay() {
    const progressBar = document.querySelector('.progress-bar');
    const progressText = document.querySelector('.progress-text');
    
    if (progressBar) {
        const percentage = getProgress();
        progressBar.style.width = `${percentage}%`;
        
        if (progressText) {
            progressText.textContent = `Module 1: ${percentage}% Complete`;
        }
    }
}

// ============================================
// PAGE ACCESS VALIDATION
// ============================================

/**
 * Check if user has access to a specific lesson
 * @param {number} lessonNumber - The lesson to check access for
 * @returns {boolean} True if access is allowed
 */
function checkAccess(lessonNumber) {
    try {
        const progress = getProgressData();
        
        // Lesson 1 is always accessible
        if (lessonNumber === 1) {
            return true;
        }
        
        // Check if previous lesson is completed
        const previousLesson = lessonNumber - 1;
        const hasAccess = progress.module1[`lesson${previousLesson}`] === true;
        
        if (!hasAccess) {
            // Redirect to last completed lesson
            const lastCompleted = getLastCompletedLesson();
            window.location.href = lastCompleted > 0 ? `lesson-${lastCompleted}.html` : 'index.html';
            return false;
        }
        
        return true;
        
    } catch (error) {
        console.error('Error checking access:', error);
        return true; // Fail open to avoid locking users out
    }
}

/**
 * Get the number of the last completed lesson
 * @returns {number} Last completed lesson number (0 if none)
 */
function getLastCompletedLesson() {
    const progress = getProgressData();
    
    for (let i = 4; i >= 1; i--) {
        if (progress.module1[`lesson${i}`] === true) {
            return i;
        }
    }
    
    return 0;
}

// ============================================
// NOTES EXPORT
// ============================================

/**
 * Export all checkpoint answers as a text file
 */
function exportNotes() {
    try {
        let notes = 'WAR ROOM ACADEMY - MODULE 1 NOTES\n';
        notes += '=' .repeat(50) + '\n\n';
        
        // Collect checkpoint answers
        for (let i = 1; i <= 4; i++) {
            const answer = localStorage.getItem(`lesson${i}_checkpoint`) ||
                          sessionStorage.getItem(`lesson${i}_checkpoint`);
            
            if (answer) {
                notes += `LESSON ${i} CHECKPOINT:\n`;
                notes += answer + '\n\n';
            }
        }
        
        // Create download
        const blob = new Blob([notes], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'war-room-module1-notes.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log('Notes exported successfully');
        
    } catch (error) {
        console.error('Error exporting notes:', error);
        alert('Error exporting notes. Please try again.');
    }
}

// ============================================
// CHAT FUNCTIONALITY
// ============================================

/**
 * Send prompt to AI and display response
 * @param {string} prompt - The prompt to send
 * @param {string} responseElementId - ID of element to display response in
 */
async function sendToAI(prompt, responseElementId) {
    const responseElement = document.getElementById(responseElementId);
    const sendButton = document.querySelector('.send-button');
    
    if (!prompt.trim()) {
        alert('Please enter a prompt');
        return;
    }
    
    try {
        // Show loading state
        responseElement.textContent = 'Thinking';
        responseElement.classList.add('visible', 'loading');
        sendButton.disabled = true;
        sendButton.textContent = 'Sending...';
        
        // Call Cloudflare Worker
        const response = await fetch(CONFIG.WORKER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prompt: prompt,
                system: 'You are a helpful AI assistant.'
            })
        });
        
        if (!response.ok) {
            if (response.status === 429) {
                throw new Error(CONFIG.RATE_LIMIT_MESSAGE);
            }
            throw new Error('Failed to connect to AI');
        }
        
        const data = await response.json();
        
        // Display response
        responseElement.classList.remove('loading');
        responseElement.textContent = data.response;
        
        // Show checkpoint section
        const checkpointSection = document.querySelector('.checkpoint-section');
        if (checkpointSection) {
            setTimeout(() => {
                checkpointSection.classList.add('visible');
            }, 300);
        }
        
    } catch (error) {
        console.error('AI request error:', error);
        responseElement.classList.remove('loading');
        responseElement.textContent = 'Error connecting to AI. Refresh and try again.';
    } finally {
        sendButton.disabled = false;
        sendButton.textContent = 'Send to AI';
    }
}

// ============================================
// CHECKPOINT VALIDATION
// ============================================

/**
 * Validate checkpoint answer and enable continue button
 * @param {string} answer - The checkpoint answer
 * @param {number} minLength - Minimum required character length
 * @returns {boolean} True if valid
 */
function validateCheckpoint(answer, minLength = CONFIG.MIN_CHECKPOINT_LENGTH) {
    const trimmedAnswer = answer.trim();
    const isValid = trimmedAnswer.length >= minLength;
    
    // Update character counter
    const charCounter = document.querySelector('.char-counter');
    if (charCounter) {
        charCounter.textContent = `${trimmedAnswer.length} / ${minLength} characters minimum`;
        
        if (isValid) {
            charCounter.classList.add('valid');
        } else {
            charCounter.classList.remove('valid');
        }
    }
    
    // Enable/disable continue button
    const continueButton = document.querySelector('.cta-button');
    if (continueButton) {
        continueButton.disabled = !isValid;
    }
    
    return isValid;
}

/**
 * Save checkpoint answer when valid and mark lesson complete
 * @param {number} lessonNumber - Current lesson number
 * @param {string} answer - The checkpoint answer
 */
function saveCheckpoint(lessonNumber, answer) {
    try {
        // Save answer
        localStorage.setItem(`lesson${lessonNumber}_checkpoint`, answer);
        
        // Mark lesson as complete
        saveProgress(lessonNumber);
        
        console.log(`Checkpoint saved for lesson ${lessonNumber}`);
        
    } catch (error) {
        console.error('Error saving checkpoint:', error);
        try {
            sessionStorage.setItem(`lesson${lessonNumber}_checkpoint`, answer);
        } catch (sessionError) {
            console.error('Both storage methods failed:', sessionError);
        }
    }
}

// ============================================
// COPY FUNCTIONALITY
// ============================================

/**
 * Copy text to clipboard and auto-fill chat input
 * @param {string} text - Text to copy
 */
function copyPrompt(text) {
    const chatInput = document.querySelector('.chat-input-area');
    const copyButton = document.querySelector('.copy-button');
    
    // Copy to clipboard
    navigator.clipboard.writeText(text).then(() => {
        // Auto-fill chat input
        if (chatInput) {
            chatInput.value = text;
        }
        
        // Visual feedback
        if (copyButton) {
            const originalText = copyButton.textContent;
            copyButton.textContent = 'Copied!';
            copyButton.classList.add('copied');
            
            setTimeout(() => {
                copyButton.textContent = originalText;
                copyButton.classList.remove('copied');
            }, 2000);
        }
        
    }).catch(error => {
        console.error('Copy failed:', error);
        
        // Fallback: just auto-fill
        if (chatInput) {
            chatInput.value = text;
            alert('Prompt added to input field');
        }
    });
}

// ============================================
// INITIALIZATION
// ============================================

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('War Room Academy initialized');
    
    // Update progress display
    updateProgressDisplay();
    
    // Log current progress for debugging
    console.log('Current progress:', getProgress() + '%');
});
