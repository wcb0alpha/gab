import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc, query, orderBy, Timestamp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

const firebaseConfig = {
    apiKey: "AIzaSyAZI6Gbesc4U6d0oU4Us1HT0pK6Z6_m1UU",
    authDomain: "grayson-cdc2e.firebaseapp.com",
    projectId: "grayson-cdc2e",
    storageBucket: "grayson-cdc2e.firebasestorage.app",
    messagingSenderId: "862954707657",
    appId: "1:862954707657:web:8a880e5a039fad95888b18",
    measurementId: "G-T8B1VDZ77S"
};

const app = initializeApp(firebaseConfig);
const db = initializeFirestore(app, {
    experimentalForceLongPolling: true,
});

const loginView = document.getElementById('login-view');
const dashboardView = document.getElementById('dashboard-view');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const logoutBtn = document.getElementById('logout-btn');

const createForm = document.getElementById('create-post-form');
const postList = document.getElementById('admin-post-list');
const submissionList = document.getElementById('admin-submission-list');

// Simple Hardcoded Auth
function checkAuthStatus() {
    if (sessionStorage.getItem('gab_admin_auth') === 'true') {
        loginView.style.display = 'none';
        dashboardView.style.display = 'flex';
        loadAdminPosts();
        loadPendingSubmissions();
    } else {
        loginView.style.display = 'flex';
        dashboardView.style.display = 'none';
    }
}

checkAuthStatus();

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // Testing Password
    if (password === 'Grayson2026!') {
        sessionStorage.setItem('gab_admin_auth', 'true');
        checkAuthStatus();
    } else {
        loginError.innerText = 'Invalid credentials. Access Denied.';
        loginError.style.display = 'block';
    }
});

logoutBtn.addEventListener('click', () => {
    sessionStorage.removeItem('gab_admin_auth');
    checkAuthStatus();
});

// Load Posts
async function loadAdminPosts() {
    postList.innerHTML = '<div style="text-align: center; color: var(--clr-text-muted); padding: 2rem;">Loading Archives...</div>';
    try {
        const q = query(collection(db, "blog_posts"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        
        if (snapshot.empty) {
            postList.innerHTML = '<div style="text-align: center; color: var(--clr-text-muted); padding: 2rem;">No transmissions found.</div>';
            return;
        }

        let html = '';
        snapshot.forEach(doc => {
            const data = doc.data();
            const date = data.createdAt ? data.createdAt.toDate().toLocaleDateString() : 'Unknown Date';
            html += `
                <div class="post-list-item">
                    <div>
                        <div style="font-weight: 700;">${data.title || 'Untitled'}</div>
                        <div style="font-size: 0.8rem; color: var(--clr-text-muted);">${date} - ${data.category || 'Writing'}</div>
                    </div>
                    <button class="btn-danger delete-post-btn" data-id="${doc.id}">Delete</button>
                </div>
            `;
        });
        
        postList.innerHTML = html;

        document.querySelectorAll('.delete-post-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = e.target.getAttribute('data-id');
                if (confirm('Are you sure you want to delete this transmission permanently?')) {
                    e.target.innerText = 'Extracting...';
                    try {
                        await deleteDoc(doc(db, "blog_posts", id));
                        loadAdminPosts();
                    } catch (err) {
                        alert('Failed to delete: ' + err.message);
                    }
                }
            });
        });

    } catch (err) {
        postList.innerHTML = `<div style="text-align: center; color: #ef4444; padding: 2rem;">Error: ${err.message}</div>`;
    }
}

// Create Post
createForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('create-btn');
    btn.innerText = 'Injecting...';
    btn.disabled = true;

    try {
        const title = document.getElementById('post-title').value;
        const category = document.getElementById('post-category').value;
        const imageUrl = document.getElementById('post-image').value;
        const content = document.getElementById('post-content').value;
        const dateInput = document.getElementById('post-date').value;

        let selectedDate = new Date();
        if (dateInput) {
            const parts = dateInput.split('-');
            selectedDate = new Date(parts[0], parts[1] - 1, parts[2], 12, 0, 0); 
        }

        await addDoc(collection(db, "blog_posts"), {
            title,
            category,
            imageUrl: imageUrl || null,
            content,
            excerpt: content.substring(0, 150) + (content.length > 150 ? '...' : ''),
            createdAt: Timestamp.fromDate(selectedDate)
        });

        createForm.reset();
        loadAdminPosts();
        alert('Transmission Successful.');
    } catch (error) {
        alert('Injection failed: ' + error.message);
    } finally {
        btn.innerText = 'Inject to Archive';
        btn.disabled = false;
    }
});

// Moderation Pipeline
async function loadPendingSubmissions() {
    if (!submissionList) return;
    submissionList.innerHTML = '<div style="text-align: center; color: var(--clr-text-muted); padding: 2rem;">Loading Archives...</div>';
    
    try {
        const q = query(collection(db, "user_submissions"), orderBy("timestamp", "desc"));
        const snapshot = await getDocs(q);
        
        if (snapshot.empty) {
            submissionList.innerHTML = '<div style="text-align: center; color: var(--clr-text-muted); padding: 2rem;">No pending reflections found.</div>';
            return;
        }

        let html = '';
        snapshot.forEach(doc => {
            const data = doc.data();
            const date = data.timestamp ? data.timestamp.toDate().toLocaleDateString() : 'Unknown';
            html += `
                <div class="post-list-item">
                    <div>
                        <div style="font-weight: 700; color: #fbbf24;">[ PENDING ] ${data.title || 'Untitled'}</div>
                        <div style="font-size: 0.8rem; color: var(--clr-text-muted);">${date} - ${data.category || 'Journal'} by ${data.author || 'Anonymous'}</div>
                        <div style="font-size: 0.85rem; margin-top: 0.5rem; opacity: 0.8; max-width: 600px;">${data.content?.substring(0, 100)}...</div>
                    </div>
                    <div>
                        <button class="btn-outline approve-sub-btn" data-id="${doc.id}" style="margin-right: 0.5rem; color: #10b981; border-color: #10b981;">Approve</button>
                        <button class="btn-danger discard-sub-btn" data-id="${doc.id}">Discard</button>
                    </div>
                </div>
            `;
        });
        
        submissionList.innerHTML = html;

        // Approve Logic
        document.querySelectorAll('.approve-sub-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = e.target.getAttribute('data-id');
                const subRef = doc(db, "user_submissions", id);
                const snapshot = await getDocs(query(collection(db, "user_submissions"))); // Quick way to get the specific doc data if we don't have it cached
                
                // Find matching doc
                let subData = null;
                snapshot.forEach(d => { if(d.id === id) subData = d.data(); });

                if (subData && confirm('Approve this reflection for the main archive?')) {
                    e.target.innerText = 'Approving...';
                    try {
                        // Move to blog_posts
                        await addDoc(collection(db, "blog_posts"), {
                            title: subData.title,
                            category: subData.category,
                            content: subData.content,
                            excerpt: subData.content.substring(0, 150) + '...',
                            author: subData.author,
                            createdAt: Timestamp.now(),
                            isCommunity: true
                        });
                        // Delete from submissions
                        await deleteDoc(subRef);
                        loadPendingSubmissions();
                        loadAdminPosts();
                    } catch (err) {
                        alert('Approval failed: ' + err.message);
                    }
                }
            });
        });

        // Discard Logic
        document.querySelectorAll('.discard-sub-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = e.target.getAttribute('data-id');
                if (confirm('Discard this community reflection permanently?')) {
                    e.target.innerText = 'Discarding...';
                    try {
                        await deleteDoc(doc(db, "user_submissions", id));
                        loadPendingSubmissions();
                    } catch (err) {
                        alert('Discard failed: ' + err.message);
                    }
                }
            });
        });

    } catch (err) {
        submissionList.innerHTML = `<div style="text-align: center; color: #ef4444; padding: 2rem;">Error: ${err.message}</div>`;
    }
}
