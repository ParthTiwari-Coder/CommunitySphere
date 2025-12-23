function getClub() {
    if (location.pathname.includes("technical")) return "tech";
    if (location.pathname.includes("cultural")) return "cultural";
    if (location.pathname.includes("sports")) return "sports";
    return null;
}

async function createPost() {
    if (!isUserLoggedIn) {
        alert("Please login first");
        openModal("loginModal");
        return;
    }

    const club = getClub();
    const textarea = document.getElementById(`${club}-post-content`);
    const message = textarea.value.trim();
    if (!message) return;

    const res = await fetch("/backend/post_message.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ club, message })
    });

    const data = await res.json();
    if (!data.success) {
        alert(data.message);
        return;
    }

    textarea.value = "";
    loadPosts();
}

async function loadPosts() {
    const club = getClub();
    const res = await fetch(`/backend/fetch_messages.php?club=${club}`);
    const posts = await res.json();

    const container = document.getElementById(`${club}-posts`);
    container.innerHTML = "";

    posts.forEach(p => {
        const div = document.createElement("div");
        div.className = "post-card";
        div.innerHTML = `
            <strong>${p.username}</strong>
            <p>${p.message}</p>
            <small>${new Date(p.created_at).toLocaleString()}</small>
        `;
        container.appendChild(div);
    });
}

document.addEventListener("DOMContentLoaded", loadPosts);
