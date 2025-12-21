// ===== GLOBAL STATE =====
let isUserLoggedIn = false;
let currentUser = null;
let registeredUsers = [];

// ===== INITIALIZE AUTH STATE FROM LOCALSTORAGE =====
function initializeAuthState() {
    // Load registered users from localStorage
    const storedUsers = localStorage.getItem('registeredUsers');
    if (storedUsers) {
        try {
            registeredUsers = JSON.parse(storedUsers);
        } catch (e) {
            registeredUsers = [];
        }
    }
    
    // Load current login state
    const storedLoginState = localStorage.getItem('isUserLoggedIn');
    const storedCurrentUser = localStorage.getItem('currentUser');
    
    if (storedLoginState === 'true' && storedCurrentUser) {
        isUserLoggedIn = true;
        currentUser = storedCurrentUser;
    }
}

// ===== SAVE AUTH STATE TO LOCALSTORAGE =====
function saveAuthState() {
    localStorage.setItem('isUserLoggedIn', isUserLoggedIn.toString());
    localStorage.setItem('currentUser', currentUser || '');
}

// ===== SAVE REGISTERED USERS TO LOCALSTORAGE =====
function saveRegisteredUsers() {
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
}

// ===== THEME TOGGLE =====
function toggleTheme() {
    document.body.classList.toggle('light-mode');
    const themeButton = document.querySelector('.theme-toggle');
    if (document.body.classList.contains('light-mode')) {
        themeButton.textContent = '🌙 Toggle Theme';
    } else {
        themeButton.textContent = '☀️ Toggle Theme';
    }
}

// ===== MODAL FUNCTIONS =====
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
}

// ===== FORM VALIDATION =====
function handleSignup(event) {
    event.preventDefault();
    
    const name = document.getElementById('signupName').value;
    const prn = document.getElementById('signupPRN').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    
    // Clear previous errors
    document.getElementById('prnError').style.display = 'none';
    document.getElementById('emailError').style.display = 'none';
    
    let hasError = false;
    
    // Validate college email format
    if (!email.includes('@gst.sies.edu.in')) {
        document.getElementById('emailError').textContent = 'Please use your college email (@gst.sies.edu.in)';
        document.getElementById('emailError').style.display = 'block';
        hasError = true;
    }
    
    // Check if email is already registered
    const existingUser = registeredUsers.find(u => u.email === email);
    if (existingUser) {
        document.getElementById('emailError').textContent = 'This email is already registered';
        document.getElementById('emailError').style.display = 'block';
        hasError = true;
    }
    
    // Check if PRN is already registered
    const existingPRN = registeredUsers.find(u => u.prn === prn);
    if (existingPRN) {
        document.getElementById('prnError').textContent = 'This PRN is already registered';
        document.getElementById('prnError').style.display = 'block';
        hasError = true;
    }
    
    // Validate PRN format (basic check)
    if (prn.length < 5) {
        document.getElementById('prnError').textContent = 'Please enter a valid PRN';
        document.getElementById('prnError').style.display = 'block';
        hasError = true;
    }
    
    if (!hasError) {
        // Add to registered users
        registeredUsers.push({ name, prn, email, password });
        saveRegisteredUsers();
        
        // Set logged in state
        isUserLoggedIn = true;
        currentUser = name;
        saveAuthState();
        
        alert(`Welcome to CommunitySphere, ${name}! 🎉\nYour account has been created successfully.`);
        closeModal('signupModal');
        document.getElementById('signupForm').reset();
        
        // Update UI for logged-in state
        updateAuthUI();
        
        // Refresh club page if on one
        refreshClubPage();
    }
}

function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Clear previous errors
    document.getElementById('loginEmailError').style.display = 'none';
    
    // Find user
    const user = registeredUsers.find(u => u.email === email && u.password === password);
    
    if (!user && !email.includes('@gst.sies.edu.in')) {
        document.getElementById('loginEmailError').textContent = 'Please use a valid college email';
        document.getElementById('loginEmailError').style.display = 'block';
        return;
    }
    
    if (user) {
        // Set logged in state
        isUserLoggedIn = true;
        currentUser = user.name;
        saveAuthState();
        
        alert(`Welcome back, ${user.name}! 👋`);
        closeModal('loginModal');
        document.getElementById('loginForm').reset();
        
        // Update UI for logged-in state
        updateAuthUI();
        
        // Refresh club page if on one
        refreshClubPage();
    } else {
        // Allow login with any valid college email for demo purposes
        if (email.includes('@gst.sies.edu.in')) {
            isUserLoggedIn = true;
            currentUser = email.split('@')[0];
            saveAuthState();
            
            alert('Welcome back! 👋\nLogin successful.');
            closeModal('loginModal');
            document.getElementById('loginForm').reset();
            
            updateAuthUI();
            refreshClubPage();
        } else {
            document.getElementById('loginEmailError').textContent = 'Invalid credentials';
            document.getElementById('loginEmailError').style.display = 'block';
        }
    }
}

// Update UI based on auth state
function updateAuthUI() {
    const authButtons = document.querySelector('.auth-buttons');
    if (!authButtons) return;
    
    if (isUserLoggedIn) {
        authButtons.innerHTML = `
            <span style="color: var(--accent-cyan); font-weight: 600; margin-right: 0.5rem;">Hi, ${currentUser}!</span>
            <button class="btn btn-login" onclick="handleLogout()">Logout</button>
        `;
    } else {
        authButtons.innerHTML = `
            <button class="btn btn-login" onclick="openModal('loginModal')">Login</button>
            <button class="btn btn-signup" onclick="openModal('signupModal')">Sign Up</button>
        `;
    }
}

// Handle logout
function handleLogout() {
    isUserLoggedIn = false;
    currentUser = null;
    
    // Clear auth state from localStorage
    localStorage.removeItem('isUserLoggedIn');
    localStorage.removeItem('currentUser');
    
    updateAuthUI();
    
    alert('You have been logged out successfully.');
    
    // Refresh club page if on one
    refreshClubPage();
}

// Refresh club page content
function refreshClubPage() {
    const path = window.location.pathname;
    let clubType = null;
    
    if (path.includes('technical')) {
        clubType = 'technical';
    } else if (path.includes('cultural')) {
        clubType = 'cultural';
    } else if (path.includes('sports')) {
        clubType = 'sports';
    }
    
    if (clubType) {
        updateClubAuthState(clubType);
        if (typeof displayPosts === 'function') {
            displayPosts(clubType);
        }
    }
}

// Update club page auth state
function updateClubAuthState(clubType) {
    const authGate = document.getElementById(`${clubType}-auth-gate`);
    const createPost = document.getElementById(`${clubType}-create-post`);
    
    if (!authGate || !createPost) return;
    
    if (isUserLoggedIn) {
        authGate.style.display = 'none';
        createPost.style.display = 'block';
    } else {
        authGate.style.display = 'block';
        createPost.style.display = 'none';
    }
}

// ===== HERO SECTION SLIDESHOW =====
let currentSlide = 0;

function changeSlide() {
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length === 0) return;
    
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
}

// Change slide every 5 seconds
if (document.querySelectorAll('.hero-slide').length > 0) {
    setInterval(changeSlide, 5000);
}

// ===== SMOOTH SCROLL =====
function scrollToClubs() {
    const clubsSection = document.getElementById('clubs');
    if (clubsSection) {
        clubsSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// ===== INITIALIZE ON PAGE LOAD =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialize auth state from localStorage
    initializeAuthState();
    
    // Update auth UI on page load
    updateAuthUI();
    
    // Check if we're on a club page and update auth state
    const path = window.location.pathname;
    let clubType = null;
    
    if (path.includes('technical')) {
        clubType = 'technical';
    } else if (path.includes('cultural')) {
        clubType = 'cultural';
    } else if (path.includes('sports')) {
        clubType = 'sports';
    }
    
    if (clubType) {
        updateClubAuthState(clubType);
    }
});