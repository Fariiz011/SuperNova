// DOM Elements
const messageInput = document.getElementById('message-input');
const sendBtn = document.querySelector('.btn-send');
const voiceBtn = document.querySelector('.btn-voice');
const attachBtn = document.querySelector('.btn-attach');
const chatMessages = document.getElementById('chat-messages');
const quickFeatures = document.querySelector('.quick-features');
const newChatBtn = document.querySelector('.new-chat');

// Check URL for initial message or feature
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const initialMessage = urlParams.get('message');
    const initialFeature = urlParams.get('feature');
    
    if (initialMessage) {
        addMessage(initialMessage, 'user');
        // Simulate AI response
        setTimeout(() => {
            addMessage("Saya NovaAI, bagaimana saya bisa membantu Anda?", 'ai');
        }, 1000);
    }
    
    if (initialFeature) {
        // Hide quick features after interaction
        setTimeout(() => {
            quickFeatures.classList.add('fade-out');
        }, 500);
    }
});

// Send message
function sendMessage() {
    const message = messageInput.value.trim();
    if (message) {
        addMessage(message, 'user');
        messageInput.value = '';
        
        // Hide quick features after first interaction
        if (!quickFeatures.classList.contains('fade-out')) {
            quickFeatures.classList.add('fade-out');
        }
        
        // Simulate AI response (in a real app, call your API here)
        setTimeout(() => {
            addMessage("Saya telah memproses permintaan Anda. Apa lagi yang bisa saya bantu?", 'ai');
        }, 1500);
    }
}

// Add message to chat
function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', `${sender}-message`);
    messageDiv.textContent = text;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Event listeners
if (sendBtn) {
    sendBtn.addEventListener('click', sendMessage);
}

if (messageInput) {
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
}

// Voice recognition
if (voiceBtn) {
    voiceBtn.addEventListener('click', () => {
        if ('webkitSpeechRecognition' in window) {
            const recognition = new webkitSpeechRecognition();
            recognition.lang = 'id-ID';
            recognition.start();
            
            voiceBtn.innerHTML = '<i class="fas fa-microphone-slash"></i>';
            voiceBtn.style.backgroundColor = 'var(--error-color)';
            
            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                messageInput.value = transcript;
                voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
                voiceBtn.style.backgroundColor = 'transparent';
                sendMessage();
            };
            
            recognition.onerror = () => {
                voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
                voiceBtn.style.backgroundColor = 'transparent';
            };
        } else {
            alert('Browser tidak mendukung voice recognition');
        }
    });
}

// New chat
if (newChatBtn) {
    newChatBtn.addEventListener('click', () => {
        chatMessages.innerHTML = '';
        quickFeatures.classList.remove('fade-out');
    });
}