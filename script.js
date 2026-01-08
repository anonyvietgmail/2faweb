/**
 * 2FA Authenticator - Realtime Polling & Progress Bar
 */

const secretInput = document.getElementById('secretKey');
const codeDisplay = document.getElementById('codeDisplay');
const progressBar = document.getElementById('progressBar');
const progressContainer = document.getElementById('progressContainer');
const errorMsg = document.getElementById('errorMsg');
const copyToast = document.getElementById('copyToast');

let currentToken = '';
let isFetching = false;

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
            // Update UI only if token actually changed to keep it smooth
            if (data.token !== currentToken) {
                currentToken = data.token;
                codeDisplay.textContent = currentToken;
                codeDisplay.style.display = 'flex';
                errorMsg.style.display = 'none';
            }
        }
    } catch (err) {
        if (key.length > 10) {
            errorMsg.style.display = 'block';
            errorMsg.textContent = "Invalid Secret Key or API Error!";
        }
    }
}

// Update the thin progress bar every 100ms for smoothness
function updateProgressBar() {
    const now = Date.now();
    const remainingSeconds = 30 - ((now / 1000) % 30);
    const percentage = (remainingSeconds / 30) * 100;

    if (progressBar) {
        progressBar.style.width = `${percentage}%`;

        // Change color to red when running low (optional, set to constant for minimalist look)
        progressBar.style.background = percentage < 20 ? '#e53e3e' : '#007bff';
    }
}

// Master Loop
function startLoops() {
    // Poll API every 1 second
    setInterval(poll2FA, 1000);

    // Smooth progress bar update (10fps)
    setInterval(updateProgressBar, 100);
}

// Immediate fetch on input
secretInput.addEventListener('input', () => {
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
