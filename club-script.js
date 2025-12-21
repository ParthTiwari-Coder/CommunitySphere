// ===== CLUB POST MANAGEMENT SYSTEM =====

// Initialize posts from localStorage or create empty arrays
let technicalPosts = [];
let culturalPosts = [];
let sportsPosts = [];

// Load posts from localStorage on initialization
function loadPostsFromStorage() {
    const storedTechnicalPosts = localStorage.getItem('technicalPosts');
    const storedCulturalPosts = localStorage.getItem('culturalPosts');
    const storedSportsPosts = localStorage.getItem('sportsPosts');
    
    if (storedTechnicalPosts) {
        try {
            technicalPosts = JSON.parse(storedTechnicalPosts);
        } catch (e) {
            technicalPosts = [];
        }
    }
    
    if (storedCulturalPosts) {
        try {
            culturalPosts = JSON.parse(storedCulturalPosts);
        } catch (e) {
            culturalPosts = [];
        }
    }
    
    if (storedSportsPosts) {
        try {
            sportsPosts = JSON.parse(storedSportsPosts);
        } catch (e) {
            sportsPosts = [];
        }
    }
}

// Function to get posts for a specific club
function getPosts(clubType) {
    switch(clubType) {
        case 'technical':
            return technicalPosts;
        case 'cultural':
            return culturalPosts;
        case 'sports':
            return sportsPosts;
        default:
            return [];
    }
}

// Function to save posts to localStorage
function savePosts(clubType, posts) {
    switch(clubType) {
        case 'technical':
            technicalPosts = posts;
            localStorage.setItem('technicalPosts', JSON.stringify(posts));
            break;
        case 'cultural':
            culturalPosts = posts;
            localStorage.setItem('culturalPosts', JSON.stringify(posts));
            break;
        case 'sports':
            sportsPosts = posts;
            localStorage.setItem('sportsPosts', JSON.stringify(posts));
            break;
    }
}

// Function to format time ago
function timeAgo(timestamp) {
    const seconds = Math.floor((new Date() - timestamp) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    
    return "Just now";
}

// Function to get user initials for avatar
function getUserInitials(name) {
    if (!name) return "?";
    const words = name.trim().split(' ');
    if (words.length >= 2) {
        return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
}

// Function to create a new post
function createPost(clubType) {
    // Check if user is logged in
    if (typeof isUserLoggedIn === 'undefined' || !isUserLoggedIn) {
        alert('Please login to create a post!');
        if (typeof openModal === 'function') {
            openModal('loginModal');
        }
        return;
    }
    
    const usernameInput = document.getElementById(`${clubType}-username`);
    const contentTextarea = document.getElementById(`${clubType}-post-content`);
    
    const username = usernameInput.value.trim();
    const content = contentTextarea.value.trim();
    
    // Validation
    if (!username) {
        alert('Please enter your name!');
        usernameInput.focus();
        return;
    }
    
    if (!content) {
        alert('Please write something to post!');
        contentTextarea.focus();
        return;
    }
    
    // Create post object
    const post = {
        id: Date.now(),
        username: username,
        content: content,
        timestamp: Date.now(),
        likes: 0
    };
    
    // Add post to beginning of array
    const posts = getPosts(clubType);
    posts.unshift(post);
    savePosts(clubType, posts);
    
    // Clear inputs
    usernameInput.value = '';
    contentTextarea.value = '';
    
    // Refresh display
    displayPosts(clubType);
    
    // Success feedback
    showNotification('Post created successfully! 🎉');
}

// Function to display posts
function displayPosts(clubType) {
    const postsContainer = document.getElementById(`${clubType}-posts`);
    if (!postsContainer) return;
    
    const posts = getPosts(clubType);
    
    // Update post count
    const postCountElement = document.getElementById(`${clubType}-post-count`);
    if (postCountElement) {
        postCountElement.textContent = posts.length;
    }
    
    // Check if user is logged in
    if (typeof isUserLoggedIn === 'undefined' || !isUserLoggedIn) {
        postsContainer.innerHTML = '';
        return;
    }
    
    // Clear container
    postsContainer.innerHTML = '';
    
    // Display empty state if no posts
    if (posts.length === 0) {
        postsContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📝</div>
                <p class="empty-state-text">No posts yet</p>
                <p style="font-size: 0.9rem; opacity: 0.7;">Be the first to share something!</p>
            </div>
        `;
        return;
    }
    
    // Display all posts
    posts.forEach(post => {
        const postCard = document.createElement('div');
        postCard.className = 'post-card';
        postCard.innerHTML = `
            <div class="post-header">
                <div class="post-avatar">${getUserInitials(post.username)}</div>
                <div class="post-user-info">
                    <div class="post-username">${escapeHtml(post.username)}</div>
                    <div class="post-time">${timeAgo(post.timestamp)}</div>
                </div>
            </div>
            <div class="post-content">${escapeHtml(post.content)}</div>
            <div class="post-actions">
                <button class="post-action-btn" onclick="likePost('${clubType}', ${post.id})">
                    👍 Like ${post.likes > 0 ? '(' + post.likes + ')' : ''}
                </button>
                <button class="post-action-btn" onclick="deletePost('${clubType}', ${post.id})">
                    🗑️ Delete
                </button>
            </div>
        `;
        postsContainer.appendChild(postCard);
    });
}

// Function to like a post
function likePost(clubType, postId) {
    const posts = getPosts(clubType);
    const post = posts.find(p => p.id === postId);
    
    if (post) {
        post.likes = (post.likes || 0) + 1;
        savePosts(clubType, posts);
        displayPosts(clubType);
    }
}

// Function to delete a post
function deletePost(clubType, postId) {
    if (!confirm('Are you sure you want to delete this post?')) {
        return;
    }
    
    let posts = getPosts(clubType);
    posts = posts.filter(p => p.id !== postId);
    savePosts(clubType, posts);
    displayPosts(clubType);
    
    showNotification('Post deleted');
}

// Function to escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Function to show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #00d4ff 0%, #a855f7 100%);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        font-family: 'Poppins', sans-serif;
        font-weight: 500;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize posts when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Load posts from localStorage
    loadPostsFromStorage();
    
    // Determine which club page we're on
    const path = window.location.pathname;
    let clubType = null;
    
    if (path.includes('technical')) {
        clubType = 'technical';
    } else if (path.includes('cultural')) {
        clubType = 'cultural';
    } else if (path.includes('sports')) {
        clubType = 'sports';
    }
    
    // Display posts if we're on a club page
    if (clubType) {
        displayPosts(clubType);
        
        // Add enter key support for textarea
        const textarea = document.getElementById(`${clubType}-post-content`);
        if (textarea) {
            textarea.addEventListener('keydown', function(e) {
                if (e.ctrlKey && e.key === 'Enter') {
                    createPost(clubType);
                }
            });
        }
    }
});