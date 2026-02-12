// War Room Academy - Global JavaScript Functions

// Configuration
const CONFIG = {
    WORKER_URL: 'https://war-room-academy-chat.smartselleraico.workers.dev',
    MIN_CHECKPOINT_LENGTH: 20,
    RATE_LIMIT_MESSAGE: 'Rate limit exceeded. Please try again later.'
};

// Check if user has access to a lesson (prevents skipping)
function checkAccess(lessonNumber) {
    const progress = JSON.parse(localStorage.getItem('warRoomProgress') || '{"module1":{}}');

    // Lesson 1 is always accessible
    if (lessonNumber === 1) return true;

    // Check if previous lesson is complete
    const previousLesson = lessonNumber - 1;
    if (!progress.module1[`lesson${previousLesson}`]) {
        alert(`You must complete Lesson ${previousLesson} first.`);
        window.location.href = `lesson-${previousLesson}.html`;
        return false;
    }

    return true;
}

// Save progress when lesson is completed
function saveProgress(lessonNumber) {
    const progress = JSON.parse(localStorage.getItem('warRoomProgress') || '{"module1":{}}');

    if (!progress.module1) {
        progress.module1 = {};
    }

    progress.module1[`lesson${lessonNumber}`] = true;
    localStorage.setItem('warRoomProgress', JSON.stringify(progress));

    console.log(`Progress saved: Lesson ${lessonNumber} completed`);
}

// Validate checkpoint answer
function validateCheckpoint(answer, minLength = CONFIG.MIN_CHECKPOINT_LENGTH) {
    return answer.trim().length >= minLength;
}

// Send message to AI via Cloudflare Worker
async function sendToAI(prompt, responseElementId) {
    try {
        const response = await fetch(CONFIG.WORKER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: prompt
            })
        });

        const data = await response.json();

        if (response.ok) {
            return {
                success: true,
                response: data.response,
                requestsRemaining: data.requestsRemaining
            };
        } else {
            return {
                success: false,
                error: data.error || 'Failed to get response'
            };
        }
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}

// Copy text to clipboard
function copyPrompt(text) {
    navigator.clipboard.writeText(text).then(() => {
        console.log('Prompt copied to clipboard');
    }).catch(err => {
        console.error('Failed to copy:', err);
    });
}

// Update progress indicators on module hub
function updateProgressIndicators() {
    const progress = JSON.parse(localStorage.getItem('warRoomProgress') || '{"module1":{}}');

    // Update lesson status badges
    for (let i = 1; i <= 4; i++) {
        const lessonCard = document.querySelector(`[data-lesson="${i}"]`);
        if (lessonCard && progress.module1[`lesson${i}`]) {
            lessonCard.classList.add('completed');
        }
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Update progress if on module hub
    if (document.querySelector('[data-lesson]')) {
        updateProgressIndicators();
    }

    console.log('War Room Academy loaded');
});
