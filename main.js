// DOM Elements
const loginBtn = document.getElementById('login-btn');
const registerBtn = document.getElementById('register-btn');
const featureCards = document.querySelectorAll('.feature-card');
const chatBubble = document.getElementById('dashboard-chat');

// Redirect to auth page
if (loginBtn && registerBtn) {
    loginBtn.addEventListener('click', () => {
        window.location.href = 'auth.html';
    });

    registerBtn.addEventListener('click', () => {
        window.location.href = 'auth.html#register';
    });
}

// Feature card interactions
if (featureCards) {
    featureCards.forEach(card => {
        card.addEventListener('click', () => {
            // Redirect to chat page with specific feature
            const feature = card.id;
            window.location.href = `chat.html?feature=${feature}`;
        });
    });
}

// Chat bubble interaction
if (chatBubble) {
    const input = chatBubble.querySelector('input');
    const sendBtn = chatBubble.querySelector('.btn-send');
    
    function sendMessage() {
        const message = input.value.trim();
        if (message) {
            // Redirect to chat page with message
            window.location.href = `chat.html?message=${encodeURIComponent(message)}`;
        }
    }
    
    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
}

// Check for dark mode preference
function checkDarkMode() {
    if (localStorage.getItem('darkMode') === 'enabled' ||
        (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.body.classList.add('dark-mode');
    }
}

document.addEventListener('DOMContentLoaded', checkDarkMode);