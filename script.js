// ===== THEME TOGGLE =====
function toggleTheme() {
    document.body.classList.toggle('light-mode');
    const themeBtn = document.querySelector('.theme-toggle');
    if (document.body.classList.contains('light-mode')) {
        themeBtn.textContent = '🌙 Dark Mode';
    } else {
        themeBtn.textContent = '☀️ Light Mode';
    }
}

// ===== MODAL FUNCTIONS =====
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// ===== FORM VALIDATION =====
// Store registered emails and PRNs in memory
const registeredEmails = [];
const registeredPRNs = [];

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
    if (!email.includes('@college.edu')) {
        document.getElementById('emailError').textContent = 'Please use your college email (@college.edu)';
        document.getElementById('emailError').style.display = 'block';
        hasError = true;
    }
    
    // Check if email is already registered
    if (registeredEmails.includes(email)) {
        document.getElementById('emailError').textContent = 'This email is already registered';
        document.getElementById('emailError').style.display = 'block';
        hasError = true;
    }
    
    // Check if PRN is already registered
    if (registeredPRNs.includes(prn)) {
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
        registeredEmails.push(email);
        registeredPRNs.push(prn);
        
        alert(`Welcome to Campus Connect, ${name}! 🎉\nYour account has been created successfully.`);
        closeModal('signupModal');
        document.getElementById('signupForm').reset();
    }
}

function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Clear previous errors
    document.getElementById('loginEmailError').style.display = 'none';
    
    // Check if email is registered or is a valid college email
    if (!registeredEmails.includes(email) && !email.includes('@college.edu')) {
        document.getElementById('loginEmailError').textContent = 'Please use a valid college email';
        document.getElementById('loginEmailError').style.display = 'block';
        return;
    }
    
    alert('Welcome back! 👋\nLogin successful.');
    closeModal('loginModal');
    document.getElementById('loginForm').reset();
}

// ===== HERO SLIDESHOW =====
let currentHeroSlide = 0;
const heroSlides = document.querySelectorAll('.hero-slide');

function showHeroSlide(index) {
    heroSlides.forEach(slide => slide.classList.remove('active'));
    heroSlides[index].classList.add('active');
}

function nextHeroSlide() {
    currentHeroSlide = (currentHeroSlide + 1) % heroSlides.length;
    showHeroSlide(currentHeroSlide);
}

// Auto-advance slideshow every 5 seconds
setInterval(nextHeroSlide, 5000);

// ===== SMOOTH SCROLL =====
function scrollToClubs() {
    document.getElementById('clubs').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// ===== CLUB REGISTRATION =====
function registerClub(clubName) {
    alert(`Awesome choice! 🎉\nYou're interested in joining ${clubName}.\nPlease login or sign up to complete your registration.`);
    openModal('signupModal');
}

// ===== SMOOTH SCROLL FOR ALL LINKS =====
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});