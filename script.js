// ===============================
// AUTH & UI CONTROLLER (SECURE)
// ===============================

// Check auth status from backend
async function checkAuthStatus() {
    try {
        const res = await fetch('/backend/auth_status.php', {
            credentials: 'include'
        });
        const data = await res.json();
        updateAuthUI(data.loggedIn, data.username);
    } catch (e) {
        updateAuthUI(false, null);
    }
}

// Update UI based on backend auth state
function updateAuthUI(isLoggedIn, username) {
    const authButtons = document.querySelector('.auth-buttons');
    if (!authButtons) return;

    if (isLoggedIn) {
        authButtons.innerHTML = `
            <span style="color: var(--accent-cyan); font-weight:600;">
                Hi, ${escapeHtml(username)}
            </span>
            <button class="btn btn-login" onclick="logout()">Logout</button>
        `;
    } else {
        authButtons.innerHTML = `
            <button class="btn btn-login" onclick="openModal('loginModal')">Login</button>
            <button class="btn btn-signup" onclick="openModal('signupModal')">Sign Up</button>
        `;
    }
}

// Logout securely (server clears session)
async function logout() {
    await fetch('/backend/logout.php', {
        method: 'POST',
        credentials: 'include'
    });
    alert('Logged out successfully');
    checkAuthStatus();
    refreshClubGate();
}

// ===== Signup =====
async function handleSignup(e) {
    e.preventDefault();

    const payload = {
        fullname: signupName.value,
        prn: signupPRN.value,
        email: signupEmail.value,
        password: signupPassword.value
    };

    const res = await fetch('/backend/register.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (!data.success) {
        alert(data.message);
        return;
    }

    closeModal('signupModal');
    checkAuthStatus();
}

// ===== Login =====
async function handleLogin(e) {
    e.preventDefault();

    const payload = {
        email: loginEmail.value,
        password: loginPassword.value
    };

    const res = await fetch('/backend/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include'
    });

    const data = await res.json();
    if (!data.success) {
        alert(data.message);
        return;
    }

    closeModal('loginModal');
    checkAuthStatus();
}

// ===== Helpers =====
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function refreshClubGate() {
    if (typeof updateClubAuthGate === 'function') {
        updateClubAuthGate();
    }
}

document.addEventListener('DOMContentLoaded', checkAuthStatus);
