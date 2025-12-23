// ===== AUTH STATE (IN-MEMORY ONLY) =====
let isUserLoggedIn = false;
let currentUser = null;

// ===== MODALS =====
function openModal(id) {
    document.getElementById(id).style.display = "block";
}
function closeModal(id) {
    document.getElementById(id).style.display = "none";
}

// ===== AUTH CHECK =====
async function checkAuth() {
    const res = await fetch("/backend/auth_status.php", { credentials: "include" });
    const data = await res.json();
    isUserLoggedIn = data.loggedIn;
    currentUser = data.username || null;
    updateAuthUI();
}

// ===== LOGIN =====
async function handleLogin(e) {
    e.preventDefault();

    const email = loginEmail.value;
    const password = loginPassword.value;

    const res = await fetch("/backend/login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (!data.success) {
        alert(data.message);
        return;
    }

    closeModal("loginModal");
    checkAuth();
}

// ===== SIGNUP =====
async function handleSignup(e) {
    e.preventDefault();

    const payload = {
        fullname: signupName.value,
        prn: signupPRN.value,
        email: signupEmail.value,
        password: signupPassword.value
    };

    const res = await fetch("/backend/register.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (!data.success) {
        alert(data.message);
        return;
    }

    closeModal("signupModal");
    checkAuth();
}

// ===== LOGOUT =====
async function handleLogout() {
    await fetch("/backend/logout.php", {
        method: "POST",
        credentials: "include"
    });
    checkAuth();
}

// ===== UI =====
function updateAuthUI() {
    const authButtons = document.querySelector(".auth-buttons");
    if (!authButtons) return;

    if (isUserLoggedIn) {
        authButtons.innerHTML = `
            <span>Hi, ${currentUser}</span>
            <button onclick="handleLogout()">Logout</button>
        `;
    } else {
        authButtons.innerHTML = `
            <button onclick="openModal('loginModal')">Login</button>
            <button onclick="openModal('signupModal')">Sign Up</button>
        `;
    }

    updateClubAuthState();
}

// ===== CLUB GATE =====
function updateClubAuthState() {
    document.querySelectorAll(".auth-gate").forEach(el => {
        el.style.display = isUserLoggedIn ? "none" : "block";
    });
    document.querySelectorAll(".create-post").forEach(el => {
        el.style.display = isUserLoggedIn ? "block" : "none";
    });
}

document.addEventListener("DOMContentLoaded", checkAuth);
