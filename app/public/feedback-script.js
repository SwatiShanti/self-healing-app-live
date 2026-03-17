// Load and display the submitted feedback
async function loadFeedback() {
    try {
        const response = await fetch('/api/last-feedback');
        const feedback = await response.json();

        if (feedback.name) {
            document.getElementById('submittedName').textContent = feedback.name;
            document.getElementById('submittedEmail').textContent = feedback.email;
            document.getElementById('submittedMessage').textContent = feedback.message;
            document.getElementById('submittedTime').textContent = feedback.timestamp;
        } else {
            // No feedback found, redirect to home
            window.location.href = '/';
        }
    } catch (error) {
        console.error('Error loading feedback:', error);
        // Fallback: redirect to home
        setTimeout(() => {
            window.location.href = '/';
        }, 3000);
    }
}

// Load feedback when page loads
document.addEventListener('DOMContentLoaded', loadFeedback);