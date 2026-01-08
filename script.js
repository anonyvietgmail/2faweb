/**
 * 2FA Authenticator - Dynamic Sync & Progress Bar
 */

const secretInput = document.getElementById('secretKey');
const codeDisplay = document.getElementById('codeDisplay');
const progressBar = document.getElementById('progressBar');
const progressContainer = document.getElementById('progressContainer');
const errorMsg = document.getElementById('errorMsg');
const copyToast = document.getElementById('copyToast');

let currentToken = '';
let cycleStartTime = Date.now(); // Used for visual sync
let isInitialSync = true;

// Fetch function called every second
async function poll2FA() {
    const key = secretInput.value.trim().replace(/\s/g, '');
    if (!key || key.length < 6) {
        codeDisplay.style.display = 'none';
        progressContainer.style.display = 'none';
        return;
    }

    progressContainer.style.display = 'block';

    try {
        const response = await fetch(`/api/index?key=${key}&t=${Date.now()}`);
        if (!response.ok) throw new Error();

        const data = await response.json();

        if (data && data.token) {
            // IF TOKEN CHANGED: Start a fresh 30s cycle
            if (data.token !== currentToken) {
                currentToken = data.token;
                codeDisplay.textContent = currentToken;
                codeDisplay.style.display = 'flex';
                errorMsg.style.display = 'none';

                // SYNC: Set the visual start time to NOW because we just got a new token
                cycleStartTime = Date.now();
                isInitialSync = false;
            }
        }
    } catch (err) {
        if (key.length > 10) {
            errorMsg.style.display = 'block';
            errorMsg.textContent = "Invalid Secret Key or API Error!";
        }
    }
}

// Update the thin progress bar
function updateProgressBar() {
    const now = Date.now();
    let elapsed = (now - cycleStartTime) % 30000;

    // If we haven't synced yet, just show a "sample" 30s loop
    // If we HAVE synced, we represent the 30s life of that token
    const percentage = 100 - (elapsed / 30000) * 100;

    if (progressBar) {
        progressBar.style.width = `${percentage}%`;
        progressBar.style.background = percentage < 20 ? '#e53e3e' : '#007bff';
    }
}

// Master Loop
function startLoops() {
    // Check for token changes every 0.5 seconds for ultra-fast sync
    setInterval(poll2FA, 500);

    // Smooth progress bar update (60fps for luxury feel)
    const animate = () => {
        updateProgressBar();
        requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
}

// Immediate fetch on input
secretInput.addEventListener('input', () => {
    currentToken = ''; // Force sync on new input
    poll2FA();
});

// Clipboard functionality
codeDisplay.addEventListener('click', () => {
    if (currentToken && currentToken !== '------') {
        navigator.clipboard.writeText(currentToken).then(() => {
            copyToast.classList.add('show');
            setTimeout(() => copyToast.classList.remove('show'), 2000);
        });
    }
});

window.onload = () => {
    startLoops();

    // Auto-fill from URL
    const path = window.location.pathname.split('/').pop().trim();
    if (path && path.length > 5 && !path.includes('.')) {
        secretInput.value = path;
        poll2FA();
    }
};
