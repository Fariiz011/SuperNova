// DOM Elements
const loginTab = document.getElementById('login-tab');
const registerTab = document.getElementById('register-tab');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const notification = document.getElementById('auth-notification');

// Switch between login and register forms
if (loginTab && registerTab) {
    loginTab.addEventListener('click', () => {
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
        loginForm.classList.add('active');
        registerForm.classList.remove('active');
    });

    registerTab.addEventListener('click', () => {
        registerTab.classList.add('active');
        loginTab.classList.remove('active');
        registerForm.classList.add('active');
        loginForm.classList.remove('active');
    });
}

// Check URL hash for register tab
if (window.location.hash === '#register') {
    if (registerTab && registerForm) {
        registerTab.click();
    }
}

// Form submissions
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        // Simulate login (in a real app, you would call your API here)
        setTimeout(() => {
            showNotification('Login berhasil! Mengarahkan ke dashboard...', 'success');
            localStorage.setItem('isLoggedIn', 'true');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        }, 1000);
    });
}

if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('register-username').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        
        // Simulate registration
        setTimeout(() => {
            showNotification('Pendaftaran berhasil! Silakan login.', 'success');
            registerForm.reset();
            loginTab.click();
        }, 1000);
    });
}

// Show notification
function showNotification(message, type) {
    if (notification) {
        notification.textContent = message;
        notification.className = 'notification show ' + type;
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
}

// Check if user is already logged in
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('isLoggedIn') === 'true' && window.location.pathname.includes('auth.html')) {
        window.location.href = 'index.html';
    }
});