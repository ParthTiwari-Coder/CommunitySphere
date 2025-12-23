// ===============================
// CLUB POSTS (SECURE, DB-BACKED)
// ===============================

function getClubType() {
    const path = location.pathname;
    if (path.includes('technical')) return 'tech';
    if (path.includes('cultural')) return 'cultural';
    if (path.includes('sports')) return 'sports';
    return null;
}

// Fetch posts from backend
async function fetchPosts() {
    const club = getClubType();
    if (!club) return;

    const res = await fetch(`/backend/fetch_messages.php?club=${club}`, {
        credentials: 'include'
    });

    const posts = await res.json();
    renderPosts(posts);
}

// Create post
async function createPost() {
    const club = getClubType();
    const textarea = document.getElementById(`${club}-post-content`);
    const content = textarea.value.trim();

    if (!content) return alert('Write something first');

    const res = await fetch('/backend/post_message.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ club, message: content })
    });

    const data = await res.json();
    if (!data.success) {
        alert(data.message);
        return;
    }

    textarea.value = '';
    fetchPosts();
}

// Render posts
function renderPosts(posts) {
    const club = getClubType();
    const container = document.getElementById(`${club}-posts`);
    container.innerHTML = '';

    if (!posts.length) {
        container.innerHTML = '<p>No posts yet</p>';
        return;
    }

    posts.forEach(p => {
        const card = document.createElement('div');
        card.className = 'post-card';
        card.innerHTML = `
            <div class="post-header">
                <strong>${escapeHtml(p.username)}</strong>
                <span>${new Date(p.created_at).toLocaleString()}</span>
            </div>
            <div class="post-content">${escapeHtml(p.message)}</div>
        `;
        container.appendChild(card);
    });
}

// Auth gate control
function updateClubAuthGate() {
    fetch('/backend/auth_status.php', { credentials: 'include' })
        .then(r => r.json())
        .then(d => {
            document.querySelectorAll('.auth-gate').forEach(el => {
                el.style.display = d.loggedIn ? 'none' : 'block';
            });
            document.querySelectorAll('.create-post').forEach(el => {
                el.style.display = d.loggedIn ? 'block' : 'none';
            });
        });
}

document.addEventListener('DOMContentLoaded', () => {
    updateClubAuthGate();
    fetchPosts();
});
