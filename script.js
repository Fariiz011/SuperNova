document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const container = document.querySelector('.container');
    const sidebar = document.querySelector('.sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const closeSidebar = document.getElementById('closeSidebar');
    const chatMessages = document.getElementById('chatMessages');
    const messageInput = document.getElementById('messageInput');
    const sendBtn = document.getElementById('sendBtn');
    const voiceBtn = document.getElementById('voiceBtn');
    const themeToggle = document.getElementById('themeToggle');
    const languageSelect = document.getElementById('languageSelect');
    const modelSelect = document.getElementById('modelSelect');
    const authSection = document.getElementById('authSection');
    const profileSection = document.getElementById('profileSection');
    const profileAvatar = document.getElementById('profileAvatar');
    const profileName = document.getElementById('profileName');
    const profileEmail = document.getElementById('profileEmail');
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const privacyBtn = document.getElementById('privacyBtn');
    const dataControlBtn = document.getElementById('dataControlBtn');
    const aboutBtn = document.getElementById('aboutBtn');
    const termsBtn = document.getElementById('termsBtn');
    const modalOverlay = document.getElementById('modalOverlay');
    const privacyModal = document.getElementById('privacyModal');
    const closePrivacyModal = document.getElementById('closePrivacyModal');
    const dataControlModal = document.getElementById('dataControlModal');
    const closeDataControlModal = document.getElementById('closeDataControlModal');
    const aboutModal = document.getElementById('aboutModal');
    const closeAboutModal = document.getElementById('closeAboutModal');
    const termsModal = document.getElementById('termsModal');
    const closeTermsModal = document.getElementById('closeTermsModal');
    const deleteChatsBtn = document.getElementById('deleteChatsBtn');
    const deleteAccountBtn = document.getElementById('deleteAccountBtn');
    const authModal = document.getElementById('authModal');
    const authModalTitle = document.getElementById('authModalTitle');
    const closeAuthModal = document.getElementById('closeAuthModal');
    const authForm = document.getElementById('authForm');
    const authEmail = document.getElementById('authEmail');
    const authPassword = document.getElementById('authPassword');
    const authName = document.getElementById('authName');
    const passwordGroup = document.getElementById('passwordGroup');
    const nameGroup = document.getElementById('nameGroup');
    const authSubmitBtn = document.getElementById('authSubmitBtn');
    const authSwitchText = document.getElementById('authSwitchText');
    const authSwitchBtn = document.getElementById('authSwitchBtn');
    const splashScreen = document.querySelector('.splash-screen');

    // App State
    let state = {
        isAuthenticated: false,
        currentUser: null,
        isDarkMode: true,
        currentLanguage: 'en',
        currentModel: 'supernova',
        messages: [
            {
                sender: 'bot',
                content: 'Hello! I\'m SuperNova, your advanced AI assistant. How can I help you today?',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
        ],
        isListening: false,
        recognition: null,
        authMode: 'login' // 'login' or 'register'
    };

    // Initialize the app
    function init() {
        // Load state from localStorage
        loadState();
        
        // Set initial UI state
        updateUI();
        
        // Show splash screen for 2 seconds
        setTimeout(() => {
            splashScreen.style.opacity = '0';
            setTimeout(() => {
                splashScreen.classList.add('hidden');
                container.style.opacity = '1';
            }, 500);
        }, 2000);
        
        // Setup event listeners
        setupEventListeners();
    }

    // Load state from localStorage
    function loadState() {
        const savedState = localStorage.getItem('supernova_chat_state');
        if (savedState) {
            state = JSON.parse(savedState);
            
            // Update theme
            document.documentElement.setAttribute('data-theme', state.isDarkMode ? 'dark' : 'light');
            themeToggle.checked = state.isDarkMode;
            
            // Update language
            languageSelect.value = state.currentLanguage;
            
            // Update model
            modelSelect.value = state.currentModel;
            
            // Render messages
            renderMessages();
        }
    }

    // Save state to localStorage
    function saveState() {
        localStorage.setItem('supernova_chat_state', JSON.stringify(state));
    }

    // Update UI based on state
    function updateUI() {
        // Update auth state
        if (state.isAuthenticated && state.currentUser) {
            authSection.classList.add('hidden');
            profileSection.classList.remove('hidden');
            
            // Set profile info
            const initials = state.currentUser.name ? state.currentUser.name.charAt(0).toUpperCase() : 'U';
            profileAvatar.textContent = initials;
            profileName.textContent = state.currentUser.name || 'User';
            profileEmail.textContent = state.currentUser.email || 'user@example.com';
        } else {
            authSection.classList.remove('hidden');
            profileSection.classList.add('hidden');
        }
        
        // Update theme toggle
        themeToggle.checked = state.isDarkMode;
        
        // Update language select
        languageSelect.value = state.currentLanguage;
        
        // Update model select
        modelSelect.value = state.currentModel;
    }

    // Render messages
    function renderMessages() {
        chatMessages.innerHTML = '';
        
        state.messages.forEach(message => {
            const messageElement = document.createElement('div');
            messageElement.classList.add('message', message.sender);
            
            const messageContent = document.createElement('div');
            messageContent.classList.add('message-content');
            
            const messageText = document.createElement('p');
            messageText.textContent = message.content;
            
            const messageTime = document.createElement('div');
            messageTime.classList.add('message-time');
            messageTime.textContent = message.timestamp;
            
            messageContent.appendChild(messageText);
            messageElement.appendChild(messageContent);
            messageElement.appendChild(messageTime);
            
            chatMessages.appendChild(messageElement);
        });
        
        // Scroll to bottom
        scrollToBottom();
    }

    // Scroll chat to bottom
    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Add message to chat
    function addMessage(sender, content) {
        const newMessage = {
            sender,
            content,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        state.messages.push(newMessage);
        saveState();
        renderMessages();
    }

    // Show typing indicator
    function showTypingIndicator() {
        const typingElement = document.createElement('div');
        typingElement.classList.add('message', 'bot', 'typing-indicator');
        typingElement.id = 'typingIndicator';
        
        typingElement.innerHTML = `
            <span></span>
            <span></span>
            <span></span>
        `;
        
        chatMessages.appendChild(typingElement);
        scrollToBottom();
    }

    // Hide typing indicator
    function hideTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    // Process user message and get bot response
    async function processMessage(message) {
        addMessage('user', message);
        
        // Show typing indicator
        showTypingIndicator();
        
        // Simulate API call delay
        setTimeout(() => {
            hideTypingIndicator();
            
            // Generate response based on message
            let response;
            if (message.toLowerCase().includes('hello') || message.toLowerCase().includes('hi')) {
                response = "Hello there! How can I assist you today?";
            } else if (message.toLowerCase().includes('how are you')) {
                response = "I'm just a computer program, so I don't have feelings, but I'm functioning optimally and ready to help you!";
            } else if (message.toLowerCase().includes('thank')) {
                response = "You're welcome! Is there anything else I can help you with?";
            } else if (message.toLowerCase().includes('help')) {
                response = "I can help with answering questions, providing information, or just having a conversation. What would you like to know?";
            } else {
                // Default response - in a real app, this would call the Cohere API
                response = "That's an interesting point. I'm SuperNova, an advanced AI assistant. I can help with a wide range of topics. Could you clarify or ask me something specific?";
            }
            
            addMessage('bot', response);
        }, 1500);
    }

    // Toggle sidebar
    function toggleSidebar() {
        sidebar.classList.toggle('active');
        modalOverlay.classList.toggle('hidden');
    }

    // Toggle theme
    function toggleTheme() {
        state.isDarkMode = !state.isDarkMode;
        document.documentElement.setAttribute('data-theme', state.isDarkMode ? 'dark' : 'light');
        saveState();
    }

    // Change language
    function changeLanguage() {
        state.currentLanguage = languageSelect.value;
        saveState();
        // In a real app, you would update all text based on the selected language
        alert(`Language changed to ${state.currentLanguage === 'en' ? 'English' : 'Bahasa Indonesia'}. In a real app, all text would be translated.`);
    }

    // Change model
    function changeModel() {
        state.currentModel = modelSelect.value;
        saveState();
        if (state.currentModel !== 'supernova') {
            alert(`${modelSelect.options[modelSelect.selectedIndex].text} is coming soon!`);
            modelSelect.value = 'supernova';
            state.currentModel = 'supernova';
            saveState();
        }
    }

    // Toggle voice recognition
    function toggleVoiceRecognition() {
        if (!('webkitSpeechRecognition' in window)) {
            alert('Speech recognition is not supported in your browser. Try Chrome or Edge.');
            return;
        }
        
        state.isListening = !state.isListening;
        
        if (state.isListening) {
            startVoiceRecognition();
            voiceBtn.classList.add('active');
        } else {
            stopVoiceRecognition();
            voiceBtn.classList.remove('active');
        }
    }

    // Start voice recognition
    function startVoiceRecognition() {
        state.recognition = new webkitSpeechRecognition();
        state.recognition.continuous = false;
        state.recognition.interimResults = false;
        
        state.recognition.onstart = function() {
            console.log('Voice recognition started');
        };
        
        state.recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            messageInput.value = transcript;
        };
        
        state.recognition.onerror = function(event) {
            console.error('Recognition error:', event.error);
            stopVoiceRecognition();
        };
        
        state.recognition.onend = function() {
            if (state.isListening) {
                state.recognition.start();
            }
        };
        
        state.recognition.start();
    }

    // Stop voice recognition
    function stopVoiceRecognition() {
        if (state.recognition) {
            state.recognition.stop();
            state.recognition = null;
        }
        state.isListening = false;
        voiceBtn.classList.remove('active');
    }

    // Show modal
    function showModal(modal) {
        modalOverlay.classList.remove('hidden');
        modal.classList.add('active');
        modalOverlay.style.zIndex = '200';
        modal.style.zIndex = '201';
    }

    // Hide modal
    function hideModal(modal) {
        modalOverlay.classList.add('hidden');
        modal.classList.remove('active');
    }

    // Toggle auth mode between login and register
    function toggleAuthMode() {
        state.authMode = state.authMode === 'login' ? 'register' : 'login';
        
        if (state.authMode === 'login') {
            authModalTitle.textContent = 'Sign In';
            authSubmitBtn.textContent = 'Sign In';
            authSwitchText.textContent = 'Don\'t have an account?';
            authSwitchBtn.textContent = 'Sign Up';
            nameGroup.classList.add('hidden');
        } else {
            authModalTitle.textContent = 'Sign Up';
            authSubmitBtn.textContent = 'Sign Up';
            authSwitchText.textContent = 'Already have an account?';
            authSwitchBtn.textContent = 'Sign In';
            nameGroup.classList.remove('hidden');
        }
    }

    // Handle auth form submission
    function handleAuthSubmit(e) {
        e.preventDefault();
        
        const email = authEmail.value.trim();
        const password = authPassword.value.trim();
        const name = authName ? authName.value.trim() : '';
        
        if (!email || !password) {
            alert('Please fill in all fields');
            return;
        }
        
        if (state.authMode === 'register' && !name) {
            alert('Please enter your name');
            return;
        }
        
        // Simulate auth process
        setTimeout(() => {
            if (state.authMode === 'register') {
                // Register
                state.isAuthenticated = true;
                state.currentUser = {
                    email,
                    name
                };
                
                alert('Registration successful! You are now signed in.');
            } else {
                // Login
                state.isAuthenticated = true;
                state.currentUser = {
                    email,
                    name: 'User' // Default name for login
                };
                
                alert('Login successful!');
            }
            
            saveState();
            updateUI();
            hideModal(authModal);
            authForm.reset();
        }, 1000);
    }

    // Delete all chats
    function deleteAllChats() {
        if (confirm('Are you sure you want to delete all your chat history? This cannot be undone.')) {
            state.messages = [
                {
                    sender: 'bot',
                    content: 'Hello! I\'m SuperNova, your advanced AI assistant. How can I help you today?',
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }
            ];
            saveState();
            renderMessages();
            hideModal(dataControlModal);
            alert('All chat history has been deleted.');
        }
    }

    // Delete account
    function deleteAccount() {
        if (confirm('Are you sure you want to delete your account? All your data will be permanently removed.')) {
            state.isAuthenticated = false;
            state.currentUser = null;
            state.messages = [
                {
                    sender: 'bot',
                    content: 'Hello! I\'m SuperNova, your advanced AI assistant. How can I help you today?',
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }
            ];
            saveState();
            updateUI();
            hideModal(dataControlModal);
            alert('Your account has been deleted.');
        }
    }

    // Auto-resize textarea
    function autoResizeTextarea() {
        messageInput.style.height = 'auto';
        messageInput.style.height = messageInput.scrollHeight + 'px';
    }

    // Setup event listeners
    function setupEventListeners() {
        // Sidebar toggle
        sidebarToggle.addEventListener('click', toggleSidebar);
        closeSidebar.addEventListener('click', toggleSidebar);
        modalOverlay.addEventListener('click', toggleSidebar);
        
        // Send message
        sendBtn.addEventListener('click', () => {
            const message = messageInput.value.trim();
            if (message) {
                processMessage(message);
                messageInput.value = '';
                autoResizeTextarea();
            }
        });
        
        // Send message on Enter (but allow Shift+Enter for new lines)
        messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendBtn.click();
            }
        });
        
        // Auto-resize textarea
        messageInput.addEventListener('input', autoResizeTextarea);
        
        // Voice button
        voiceBtn.addEventListener('click', toggleVoiceRecognition);
        
        // Theme toggle
        themeToggle.addEventListener('change', toggleTheme);
        
        // Language select
        languageSelect.addEventListener('change', changeLanguage);
        
        // Model select
        modelSelect.addEventListener('change', changeModel);
        
        // Auth buttons
        loginBtn.addEventListener('click', () => {
            state.authMode = 'login';
            toggleAuthMode();
            showModal(authModal);
        });
        
        registerBtn.addEventListener('click', () => {
            state.authMode = 'register';
            toggleAuthMode();
            showModal(authModal);
        });
        
        // Menu buttons
        privacyBtn.addEventListener('click', () => showModal(privacyModal));
        dataControlBtn.addEventListener('click', () => showModal(dataControlModal));
        aboutBtn.addEventListener('click', () => showModal(aboutModal));
        termsBtn.addEventListener('click', () => showModal(termsModal));
        
        // Close modal buttons
        closePrivacyModal.addEventListener('click', () => hideModal(privacyModal));
        closeDataControlModal.addEventListener('click', () => hideModal(dataControlModal));
        closeAboutModal.addEventListener('click', () => hideModal(aboutModal));
        closeTermsModal.addEventListener('click', () => hideModal(termsModal));
        closeAuthModal.addEventListener('click', () => hideModal(authModal));
        
        // Auth switch
        authSwitchBtn.addEventListener('click', toggleAuthMode);
        
        // Auth form submit
        authForm.addEventListener('submit', handleAuthSubmit);
        
        // Data control buttons
        deleteChatsBtn.addEventListener('click', deleteAllChats);
        deleteAccountBtn.addEventListener('click', deleteAccount);
    }

    // Initialize the app
    init();
});